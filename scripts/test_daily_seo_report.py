import io
import json
import os
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch

import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
import daily_seo_report as seo  # noqa: E402


class _FakeColSeries:
    def __init__(self, vals):
        self._vals = list(vals)

    @property
    def iloc(self):
        return self

    def __getitem__(self, idx):
        return self._vals[idx]

    def tolist(self):
        return list(self._vals)


class _FakeDF:
    def __init__(self, rows=None, cols=None):
        self._rows = rows or []
        self.columns = cols or (list(rows[0].keys()) if rows else [])

    @property
    def empty(self):
        return len(self._rows) == 0

    def head(self, n):
        return _FakeDF(self._rows[:n], self.columns)

    def iterrows(self):
        for i, r in enumerate(self._rows):
            yield i, r

    def __getitem__(self, col):
        return _FakeColSeries([r[col] for r in self._rows])


class TooManyRequestsError(Exception):
    pass


class DailySeoReportTests(unittest.TestCase):
    NOW = datetime(2026, 11, 27, 4, 0, tzinfo=timezone.utc)  # 09:00 PKT

    @staticmethod
    def _mock_fetch_sitemap(url: str) -> str:
        if "investify.pk/sitemap.xml" in url:
            return """<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>https://www.investify.pk/sitemaps/pages.xml</loc><lastmod>2026-11-26T00:00:00Z</lastmod></sitemap>
  <sitemap><loc>https://www.investify.pk/sitemaps/old.xml</loc><lastmod>2026-10-01T00:00:00Z</lastmod></sitemap>
</sitemapindex>"""
        if "investify.pk/sitemaps/pages.xml" in url:
            return """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.investify.pk/zakat-nisab-guide</loc><lastmod>2026-11-26T12:00:00+05:00</lastmod></url>
  <url><loc>https://www.investify.pk/old-article</loc><lastmod>2026-11-01T00:00:00Z</lastmod></url>
</urlset>"""
        return """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://example.com/salary-tax-2026</loc><lastmod>2026-11-25</lastmod></url>
</urlset>"""

    def test_pytrends_429_rate_limit_fails_soft_with_note(self):
        sleeps: list[float] = []

        class RateLimitedClient:
            def build_payload(self, *args, **kwargs):
                raise TooManyRequestsError("The request failed: Google returned a response with code 429")

            def interest_over_time(self):
                return _FakeDF()

            def related_queries(self):
                return {}

            def trending_searches(self, pn="pakistan"):
                return _FakeDF()

        with tempfile.TemporaryDirectory() as tmpdir, patch.dict(os.environ, {"GSC_SERVICE_ACCOUNT_JSON": ""}, clear=False):
            summary = seo.generate_and_write_report(
                output_dir=tmpdir,
                trend_client_factory=RateLimitedClient,
                fetch_text_fn=self._mock_fetch_sitemap,
                sleep_fn=lambda s: sleeps.append(s),
                inter_request_sleep=0,
                backoff_seconds=60,
                now_utc=self.NOW,
            )
            md = (Path(tmpdir) / "report.md").read_text(encoding="utf-8")

        self.assertEqual(summary["trends"]["status"], "rate_limited")
        self.assertIn(60.0, sleeps)
        self.assertIn("Trends rate-limited today, retry tomorrow", md)
        self.assertIn("Zakat Nisab Guide", md)
        self.assertIn("PARKED: PTA Tax Calculator", md)

    def test_missing_gsc_secret_still_completes_trends_and_sitemaps(self):
        class OkClient:
            def __init__(self):
                self.current_term = ""

            def build_payload(self, kw_list, **kwargs):
                self.current_term = kw_list[0]

            def interest_over_time(self):
                return _FakeDF([{"date": "2026-11-26", self.current_term: 64}], ["date", self.current_term])

            def related_queries(self):
                return {
                    self.current_term: {
                        "top": _FakeDF([{"query": f"{self.current_term} top", "value": 100}], ["query", "value"]),
                        "rising": _FakeDF(
                            [
                                {"query": "salary tax breakdown fbr slabs", "value": "Breakout"},
                                {"query": "pta mobile tax calculator", "value": "Breakout"},
                            ],
                            ["query", "value"],
                        ),
                    }
                }

            def trending_searches(self, pn="pakistan"):
                return _FakeDF(
                    [
                        {"0": "Pakistan vs England cricket match"},
                        {"0": "gold rate per tola Pakistan"},
                    ],
                    ["0"],
                )

        with tempfile.TemporaryDirectory() as tmpdir, patch.dict(os.environ, {"GSC_SERVICE_ACCOUNT_JSON": ""}, clear=False):
            prior_file = Path(tmpdir) / "prior.json"
            prior_file.write_text(
                json.dumps([{"number": 1, "title": "SEO Report 2026-11-26", "body": "| `salary tax breakdown fbr slabs` |"}]),
                encoding="utf-8",
            )
            seo.generate_and_write_report(
                output_dir=Path(tmpdir) / "out",
                prior_issues_path=prior_file,
                trend_client_factory=OkClient,
                fetch_text_fn=self._mock_fetch_sitemap,
                sleep_fn=lambda _: None,
                inter_request_sleep=0,
                backoff_seconds=0,
                now_utc=self.NOW,
            )
            md = (Path(tmpdir) / "out" / "report.md").read_text(encoding="utf-8")

        self.assertIn("GSC unavailable — secret add karein", md)
        self.assertIn("`gold rate per tola Pakistan`", md)
        self.assertNotIn("cricket match", md)
        # Candidate is present and generates ready prompt on sustained 2 runs
        self.assertIn("`salary tax breakdown fbr slabs`", md)
        self.assertIn("Ready prompt generated (sustained 2 runs)", md)
        # Parked PTA keyword must NEVER appear in candidate table
        candidates_section = md.split("## 2. Strong Keyword Candidates")[1].split("## Ready-to-Paste Antigravity Prompt")[0]
        self.assertNotIn("pta mobile tax calculator", candidates_section.lower())

    def test_gsc_error_never_leaks_secret_values(self):
        secret_marker = "PRIVATE_KEY_SUPER_SECRET_DO_NOT_LOG_98765"
        secret_email = "seo-bot@secret-project.iam.gserviceaccount.com"
        fake_json = json.dumps({"client_email": secret_email, "private_key": secret_marker})

        def broken_service_builder(_info):
            raise RuntimeError(f"Auth failure for {secret_email} with key {secret_marker}")

        buf_out, buf_err = io.StringIO(), io.StringIO()
        with tempfile.TemporaryDirectory() as tmpdir, patch.dict(
            os.environ, {"GSC_SERVICE_ACCOUNT_JSON": fake_json}, clear=False
        ), redirect_stdout(buf_out), redirect_stderr(buf_err):
            summary = seo.generate_and_write_report(
                output_dir=tmpdir,
                trend_client_factory=lambda: (_ for _ in ()).throw(RuntimeError("offline")),
                gsc_service_builder=broken_service_builder,
                fetch_text_fn=self._mock_fetch_sitemap,
                sleep_fn=lambda _: None,
                now_utc=self.NOW,
            )
            md = (Path(tmpdir) / "report.md").read_text(encoding="utf-8")
            raw_json = (Path(tmpdir) / "report.json").read_text(encoding="utf-8")

        self.assertEqual(summary["gsc"]["status"], "unavailable")
        self.assertIn("GSC unavailable (RuntimeError)", md)
        combined = md + raw_json + buf_out.getvalue() + buf_err.getvalue()
        self.assertNotIn(secret_marker, combined)
        self.assertNotIn(secret_email, combined)

    def test_trending_searches_falls_back_to_rss_when_legacy_endpoint_errors(self):
        class BrokenTrendingClient:
            def build_payload(self, *args, **kwargs):
                return None

            def interest_over_time(self):
                return _FakeDF()

            def related_queries(self):
                return {}

            def trending_searches(self, pn="pakistan"):
                raise RuntimeError("ResponseError 404")

        def fetch_with_rss(url: str) -> str:
            if "trends.google.com/trending/rss" in url:
                return """<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <item><title>fbr income tax calculator</title></item>
  <item><title>PSL cricket match today</title></item>
</channel></rss>"""
            return self._mock_fetch_sitemap(url)

        with tempfile.TemporaryDirectory() as tmpdir, patch.dict(os.environ, {"GSC_SERVICE_ACCOUNT_JSON": ""}, clear=False):
            seo.generate_and_write_report(
                output_dir=tmpdir,
                trend_client_factory=BrokenTrendingClient,
                fetch_text_fn=fetch_with_rss,
                sleep_fn=lambda _: None,
                inter_request_sleep=0,
                backoff_seconds=0,
                now_utc=self.NOW,
            )
            md = (Path(tmpdir) / "report.md").read_text(encoding="utf-8")

        self.assertIn("`fbr income tax calculator`", md)
        self.assertNotIn("PSL cricket match", md)

    def test_p79_prompt_qualification_coverage_parked_and_unverified_rules(self):
        class MultiScenarioClient:
            def __init__(self):
                self.current_term = ""

            def build_payload(self, kw_list, **kwargs):
                self.current_term = kw_list[0]

            def interest_over_time(self):
                return _FakeDF([{"date": "2026-11-26", self.current_term: 50}], ["date", self.current_term])

            def related_queries(self):
                if self.current_term == "Pakistan tax calculator":
                    rising_rows = [
                        {"query": "first run strong salary tax slab", "value": "Breakout"},
                        {"query": "zakat calculator on gold", "value": "+180%"},
                        {"query": "fbr tax calculator", "value": "+120%"},
                        {"query": "pta mobile tax calculator", "value": "Breakout"},
                        {"query": "prize bond withholding tax calculator", "value": "+200%"},
                        {"query": "salary tax breakdown fbr slabs", "value": "+150%"},
                        {"query": "gold jewellery 87.48g zakat nisab", "value": "Breakout"},
                    ]
                else:
                    rising_rows = []
                return {
                    self.current_term: {
                        "top": _FakeDF([], ["query", "value"]),
                        "rising": _FakeDF(rising_rows, ["query", "value"]),
                    }
                }

            def trending_searches(self, pn="pakistan"):
                return _FakeDF([], ["0"])

        prior_issues = [
            {
                "number": 10,
                "title": "SEO Report 2026-11-25",
                "body": (
                    "| `zakat calculator on gold` | | `fbr tax calculator` | | `pta mobile tax calculator` | "
                    "| `prize bond withholding tax calculator` | | `salary tax breakdown fbr slabs` | "
                    "| `gold jewellery 87.48g zakat nisab` |"
                ),
            },
            {
                "number": 11,
                "title": "SEO Report 2026-11-26",
                "body": "| `gold jewellery 87.48g zakat nisab` |",
            },
        ]

        with tempfile.TemporaryDirectory() as tmpdir, patch.dict(os.environ, {"GSC_SERVICE_ACCOUNT_JSON": ""}, clear=False):
            prior_file = Path(tmpdir) / "prior.json"
            prior_file.write_text(json.dumps(prior_issues), encoding="utf-8")
            out_dir = Path(tmpdir) / "out"
            summary = seo.generate_and_write_report(
                output_dir=out_dir,
                prior_issues_path=prior_file,
                trend_client_factory=MultiScenarioClient,
                fetch_text_fn=self._mock_fetch_sitemap,
                sleep_fn=lambda _: None,
                inter_request_sleep=0,
                backoff_seconds=0,
                now_utc=self.NOW,
            )
            md = (out_dir / "report.md").read_text(encoding="utf-8")

            # 1) Only the 2 sustained uncovered verified candidates get prompts
            prompt_kw = [p["keyword"] for p in summary["generated_prompts"]]
            self.assertCountEqual(prompt_kw, ["salary tax breakdown fbr slabs", "gold jewellery 87.48g zakat nisab"])

            # 2) Artifact prompt files exist for both qualifying candidates
            sal_prompt_file = out_dir / "prompts" / "2026-11-27-salary-tax-breakdown-fbr-slabs.md"
            zak_prompt_file = out_dir / "prompts" / "2026-11-27-gold-jewellery-87-48g-zakat-nisab.md"
            self.assertTrue(sal_prompt_file.is_file())
            self.assertTrue(zak_prompt_file.is_file())

            # 3) First-run keyword -> tracking note ONLY, no prompt
            self.assertIn("`first run strong salary tax slab`", md)
            self.assertIn("1st run observed — tracking only", md)

            # 4) Already-covered live keywords -> no prompt, marked already covered live
            self.assertIn("`zakat calculator on gold`", md)
            self.assertIn("`fbr tax calculator`", md)
            self.assertIn("already covered live", md)

            # 5) PTA -> excluded from candidates & prompts
            prompt_section = md.split("## Ready-to-Paste Antigravity Prompt")[1].split("## 3. PARKED")[0]
            self.assertNotIn("pta mobile tax", prompt_section.lower())

            # 6) Unverified tax figure -> STOP note, no prompt
            self.assertIn("`prize bond withholding tax calculator`", md)
            self.assertIn("STOP — figure not verified", md)

            # 7) Prompt content rules: Step 0, exact 1 FAQ, Do NOT change title, verified figures, live vars for Zakat, 3+ runs note outside prompt
            sal_prompt = sal_prompt_file.read_text(encoding="utf-8")
            self.assertIn("Step 0 — Reconcile first", sal_prompt)
            self.assertIn("Add exactly 1 concise, helpful FAQ", sal_prompt)
            self.assertIn('Do NOT change <title>, <meta name="description">, or <h1>', sal_prompt)
            self.assertIn("Rs 150,000/month", sal_prompt)
            self.assertIn("Rs 6,000/month", sal_prompt)
            self.assertIn("777,777 cash -> Rs 19,444.43", sal_prompt)
            self.assertIn("1774525983843690", sal_prompt)
            self.assertIn("ca-pub-9434774796732008", sal_prompt)

            zak_prompt = zak_prompt_file.read_text(encoding="utf-8")
            self.assertIn("goldPerTola", zak_prompt)
            self.assertIn("silverPerTola", zak_prompt)
            self.assertIn("title-change candidate, Muse/user decide karein", md)
            self.assertNotIn("title-change candidate", zak_prompt)


if __name__ == "__main__":
    unittest.main(verbosity=2)
