"""Upsert daily SEO draft GitHub Issue so at most one open Issue exists per PKT day.

- Before creating an Issue, queries open `seo-report` Issues for `"SEO Report YYYY-MM-DD"`.
- If an open same-day Issue exists: replaces its body with the latest draft report and
  posts an update timestamp comment (`Updated by re-run at HH:MM PKT, run <run-id>`).
- Otherwise: creates a new Issue with title `SEO Report YYYY-MM-DD` and label `seo-report`.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Callable

PKT_TZ = timezone(timedelta(hours=5))
SEO_LABEL = "seo-report"


def run_gh_command(args: list[str]) -> str:
    """Execute a GitHub CLI command and return stdout cleanly."""
    proc = subprocess.run(["gh", *args], check=True, capture_output=True, text=True)
    return proc.stdout


def upsert_daily_seo_issue(
    repo: str,
    report_date: str,
    body_file: str | Path,
    run_id: str,
    gh_runner: Callable[[list[str]], str] = run_gh_command,
    now_utc: datetime | None = None,
) -> dict[str, Any]:
    """Create or update today's open `seo-report` Issue and return action metadata."""
    target_title = f"SEO Report {report_date}"
    body_path = str(body_file)
    now_pkt = (now_utc or datetime.now(timezone.utc)).astimezone(PKT_TZ)
    hhmm_pkt = now_pkt.strftime("%H:%M")

    # Query open seo-report issues directly (avoids GitHub search indexing delay on back-to-back runs)
    raw_list = gh_runner(
        [
            "issue",
            "list",
            "--repo",
            repo,
            "--label",
            SEO_LABEL,
            "--state",
            "open",
            "--limit",
            "50",
            "--json",
            "number,title,state,url",
        ]
    )
    open_issues = json.loads(raw_list or "[]")
    matching = [
        issue
        for issue in open_issues
        if str(issue.get("title", "")).strip() == target_title
        and str(issue.get("state", "OPEN")).upper() == "OPEN"
    ]

    if matching:
        # Update the latest matching open issue in place; never open a duplicate
        existing = max(matching, key=lambda item: int(item["number"]))
        issue_num = str(existing["number"])
        comment_body = f"Updated by re-run at {hhmm_pkt} PKT, run {run_id}"
        gh_runner(
            [
                "issue",
                "edit",
                issue_num,
                "--repo",
                repo,
                "--body-file",
                body_path,
            ]
        )
        gh_runner(
            [
                "issue",
                "comment",
                issue_num,
                "--repo",
                repo,
                "--body",
                comment_body,
            ]
        )
        return {
            "action": "updated",
            "number": int(existing["number"]),
            "title": target_title,
            "comment": comment_body,
            "url": existing.get("url", ""),
        }

    created_out = gh_runner(
        [
            "issue",
            "create",
            "--repo",
            repo,
            "--title",
            target_title,
            "--label",
            SEO_LABEL,
            "--body-file",
            body_path,
        ]
    )
    return {
        "action": "created",
        "title": target_title,
        "url": created_out.strip(),
    }


def main() -> int:
    output_dir = Path(os.environ["SEO_OUTPUT_DIR"])
    report_date = (output_dir / "report_date.txt").read_text(encoding="utf-8").strip()
    body_file = output_dir / "report.md"
    repo = os.environ["GITHUB_REPOSITORY"]
    run_id = os.environ.get("GITHUB_RUN_ID", "manual")

    result = upsert_daily_seo_issue(
        repo=repo,
        report_date=report_date,
        body_file=body_file,
        run_id=run_id,
    )
    print(f"SEO Issue {result['action']}: {result.get('title')} {result.get('url') or '#' + str(result.get('number', ''))}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
