import json
import sys
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import upsert_seo_issue as upsert  # noqa: E402


class UpsertSeoIssueTests(unittest.TestCase):
    NOW = datetime(2026, 11, 27, 7, 5, tzinfo=timezone.utc)  # 12:05 PKT

    def test_creates_issue_when_none_open_for_today(self):
        calls: list[list[str]] = []

        def fake_gh(args: list[str]) -> str:
            calls.append(args)
            if args[:2] == ["issue", "list"]:
                return json.dumps(
                    [
                        {
                            "number": 9,
                            "title": "SEO Report 2026-11-26",
                            "state": "OPEN",
                            "url": "https://github.com/ihaider3/Pakistan-Tax-Website/issues/9",
                        }
                    ]
                )
            if args[:2] == ["issue", "create"]:
                return "https://github.com/ihaider3/Pakistan-Tax-Website/issues/10\n"
            raise AssertionError(f"Unexpected gh command: {args}")

        with tempfile.TemporaryDirectory() as tmp:
            body_path = Path(tmp) / "report.md"
            body_path.write_text("# SEO Report 2026-11-27", encoding="utf-8")
            res = upsert.upsert_daily_seo_issue(
                repo="ihaider3/Pakistan-Tax-Website",
                report_date="2026-11-27",
                body_file=body_path,
                run_id="1001",
                gh_runner=fake_gh,
                now_utc=self.NOW,
            )

        self.assertEqual(res["action"], "created")
        self.assertEqual(calls[1][:2], ["issue", "create"])
        self.assertNotIn("edit", [c[1] for c in calls])

    def test_updates_existing_open_issue_and_adds_comment_on_rerun_or_fail_retry(self):
        calls: list[list[str]] = []

        def fake_gh(args: list[str]) -> str:
            calls.append(args)
            if args[:2] == ["issue", "list"]:
                return json.dumps(
                    [
                        {
                            "number": 2,
                            "title": "SEO Report 2026-11-27",
                            "state": "OPEN",
                            "url": "https://github.com/ihaider3/Pakistan-Tax-Website/issues/2",
                        }
                    ]
                )
            if args[:2] in (["issue", "edit"], ["issue", "comment"]):
                return "ok"
            raise AssertionError(f"Unexpected gh command (must NOT create duplicate): {args}")

        with tempfile.TemporaryDirectory() as tmp:
            body_path = Path(tmp) / "report.md"
            body_path.write_text("# Updated SEO Report 2026-11-27", encoding="utf-8")
            res = upsert.upsert_daily_seo_issue(
                repo="ihaider3/Pakistan-Tax-Website",
                report_date="2026-11-27",
                body_file=body_path,
                run_id="45959999999",
                gh_runner=fake_gh,
                now_utc=self.NOW,
            )

        self.assertEqual(res["action"], "updated")
        self.assertEqual(res["number"], 2)
        self.assertEqual(res["comment"], "Updated by re-run at 12:05 PKT, run 45959999999")
        actions = [c[1] for c in calls]
        self.assertEqual(actions, ["list", "edit", "comment"])
        self.assertNotIn("create", actions)


if __name__ == "__main__":
    unittest.main(verbosity=2)
