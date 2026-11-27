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
                                {"query": "salary tax calculator 2026-27 fbr", "value": "Breakout"},
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
                json.dumps([{"number": 1, "title": "SEO Report 2026-11-26", "body": "| `salary tax calculator 2026-27 fbr` |"}]),
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
        # Candidate is present and marked sustained 2 runs
        self.assertIn("`salary tax calculator 2026-27 fbr`", md)
        self.assertIn("Sustained 2+ runs", md)
        # Parked PTA keyword must NEVER appear in candidate table
        candidates_section = md.split("## 2. Strong Keyword Candidates")[1].split("## 3. PARKED")[0]
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


if __name__ == "__main__":
    unittest.main(verbosity=2)
