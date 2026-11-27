"""Generate a DRAFT-ONLY daily SEO report (Google Trends PK + GSC + competitor sitemaps).

This script NEVER edits website source files, rates, formulas, SEO metadata, or git state.
It writes output files strictly inside SEO_OUTPUT_DIR for GitHub Issue + workflow artifact upload.
"""

from __future__ import annotations

import json
import os
import re
import ssl
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Callable

PKT_TZ = timezone(timedelta(hours=5))
USER_AGENT = "CalculationHubSEOBot/1.0 (+https://calculationhubs.com/)"
GSC_PROPERTY = "https://calculationhubs.com/"

CORE_TARGETS: list[dict[str, str]] = [
    {"term": "Pakistan tax calculator", "page": "Homepage", "path": "/"},
    {
        "term": "salary tax calculator Pakistan 2026-27",
        "page": "Salary Tax",
        "path": "/salary-tax-calculator",
    },
    {"term": "zakat calculator Pakistan", "page": "Zakat", "path": "/zakat-calculator"},
    {
        "term": "property tax calculator Pakistan",
        "page": "Property Tax",
        "path": "/property-tax-calculator",
    },
    {"term": "GST calculator Pakistan", "page": "GST", "path": "/gst-calculator"},
    {"term": "fitrana 2026 Pakistan", "page": "Fitrana", "path": "/fitrana-calculator"},
    {"term": "ushr calculator Pakistan", "page": "Ushr", "path": "/ushr-calculator"},
]

COMPETITORS: list[str] = [
    "calculation-hub.com",
    "investify.pk",
    "deencalc.com",
    "paycalculus.com",
]

PARKED_TERMS: tuple[str, ...] = (
    "pta",
    "imei",
    "dirbs",
    "mobile tax",
    "phone tax",
    "mobile registration",
    "mobile duty",
)

CALC_RELEVANCE_TERMS: tuple[str, ...] = (
    "tax",
    "fbr",
    "salary",
    "income",
    "zakat",
    "nisab",
    "fitrana",
    "sadqa",
    "fiter",
    "ushr",
    "gst",
    "sales tax",
    "property",
    "236c",
    "236k",
    "filer",
    "non-filer",
    "calculator",
    "hisab",
    "gold rate",
    "silver rate",
    "tola",
    "withholding",
    "slab",
    "incometax",
)

PAGE_MATCH_RULES: list[tuple[tuple[str, ...], str, str]] = [
    (("salary", "income tax", "paycheck", "take home", "take-home", "slab", "fbr"), "Salary Tax", "/salary-tax-calculator"),
    (("zakat", "nisab", "gold", "silver", "tola"), "Zakat", "/zakat-calculator"),
    (("property", "236c", "236k", "stamp duty", "filer", "non-filer", "plot", "immovable"), "Property Tax", "/property-tax-calculator"),
    (("gst", "sales tax", "vat", "inclusive", "exclusive", "tax credit"), "GST", "/gst-calculator"),
    (("fitrana", "sadqa", "fitrah", "fidya"), "Fitrana", "/fitrana-calculator"),
    (("ushr", "usher", "harvest", "crop", "tubewell", "tube-well", "barani", "maund"), "Ushr", "/ushr-calculator"),
]


def is_parked_keyword(keyword: str) -> bool:
    """Return True if a query matches the parked PTA tax calculator topic."""
    lower = keyword.lower()
    return any(re.search(rf"\b{re.escape(term)}\b", lower) for term in PARKED_TERMS) or "pta tax" in lower


def is_calculation_relevant(keyword: str) -> bool:
    """Keep only calculation/tax/Zakat/Fitrana/GST/Ushr/gold-silver relevant queries."""
    lower = keyword.lower()
    if is_parked_keyword(lower):
        return False
    return any(token in lower for token in CALC_RELEVANCE_TERMS)


def match_target_page(keyword: str, default_page: str = "Homepage", default_path: str = "/") -> tuple[str, str]:
    """Map a candidate keyword cleanly to its CalculationHub target page."""
    lower = keyword.lower()
    for tokens, page_name, page_path in PAGE_MATCH_RULES:
        if any(t in lower for t in tokens):
            return page_name, page_path
    return default_page, default_path


def is_rate_limit_error(exc: Exception) -> bool:
    """Detect HTTP 429 / TooManyRequests responses across pytrends versions."""
    cls_name = type(exc).__name__.lower()
    msg = str(exc).lower()
    return "toomanyrequests" in cls_name or "429" in msg or "too many requests" in msg


def format_rising_label(raw_val: Any) -> tuple[str, bool, int]:
    """Convert pytrends rising metric value into human text, strong-flag, and numeric rank."""
    if raw_val is None:
        return ("N/A", False, 0)
    text = str(raw_val).strip()
    if text.lower() == "breakout":
        return ("Breakout", True, 5000)
    try:
        num = int(float(text.replace("%", "").replace("+", "").replace(",", "")))
    except ValueError:
        return (text, "breakout" in text.lower(), 0)
    if num >= 5000:
        return (f"Breakout (+{num}%)", True, num)
    return (f"+{num}%", num >= 100, num)


def collect_google_trends(
    core_targets: list[dict[str, str]] | None = None,
    trend_client_factory: Callable[[], Any] | None = None,
    sleep_fn: Callable[[float], None] = time.sleep,
    inter_request_sleep: float = 5.0,
    backoff_seconds: float = 60.0,
    fetch_text_fn: Callable[[str], str] | None = None,
) -> dict[str, Any]:
    """Fetch 90-day Pakistan Google Trends data for the 7 core terms + PK daily searches."""
    targets = core_targets or CORE_TARGETS
    bounded_backoff = max(0.0, min(float(backoff_seconds), 60.0))

    if trend_client_factory is None:
        from pytrends.request import TrendReq  # pinned in scripts/requirements-seo.txt

        def default_factory() -> Any:
            return TrendReq(hl="en-US", tz=300, timeout=(10, 25))

        trend_client_factory = default_factory

    results: list[dict[str, Any]] = []
    rate_limited_global = False
    global_note: str | None = None

    try:
        client = trend_client_factory()
    except Exception as exc:
        msg = (
            "Trends rate-limited today, retry tomorrow"
            if is_rate_limit_error(exc)
            else f"Trends unavailable ({type(exc).__name__})"
        )
        return {
            "status": "rate_limited" if is_rate_limit_error(exc) else "unavailable",
            "note": msg,
            "terms": [],
            "trending_relevant": [],
            "trending_ignored_count": 0,
        }

    def run_with_429_retry(fn: Callable[[], Any]) -> tuple[Any, bool, str | None]:
        try:
            return fn(), False, None
        except Exception as exc:
            if not is_rate_limit_error(exc):
                return None, False, f"Unavailable ({type(exc).__name__})"
            if bounded_backoff > 0:
                sleep_fn(bounded_backoff)
            try:
                return fn(), False, None
            except Exception as retry_exc:
                if is_rate_limit_error(retry_exc):
                    return None, True, "Trends rate-limited today, retry tomorrow"
                return None, False, f"Unavailable ({type(retry_exc).__name__})"

    for idx, target in enumerate(targets):
        term = target["term"]
        entry: dict[str, Any] = {
            "term": term,
            "page": target["page"],
            "path": target["path"],
            "latest_interest": None,
            "top_queries": [],
            "rising_queries": [],
            "note": None,
        }
        if rate_limited_global:
            entry["note"] = "Trends rate-limited today, retry tomorrow"
            results.append(entry)
            continue

        if idx > 0 and inter_request_sleep > 0:
            sleep_fn(inter_request_sleep)

        def fetch_term() -> tuple[Any, Any]:
            client.build_payload([term], cat=0, timeframe="today 3-m", geo="PK")
            iot = client.interest_over_time()
            rq = client.related_queries()
            return iot, rq

        payload_res, hit_429, err_note = run_with_429_retry(fetch_term)
        if hit_429:
            rate_limited_global = True
            global_note = "Trends rate-limited today, retry tomorrow"
            entry["note"] = global_note
            results.append(entry)
            continue
        if err_note or payload_res is None:
            entry["note"] = err_note or "No Trends data returned"
            results.append(entry)
            continue

        iot, rq = payload_res
        try:
            if iot is not None and not iot.empty and term in iot.columns:
                entry["latest_interest"] = int(iot[term].iloc[-1])
        except Exception:
            entry["latest_interest"] = None

        term_rq = rq.get(term, {}) if isinstance(rq, dict) else {}
        top_df = term_rq.get("top")
        rising_df = term_rq.get("rising")

        if top_df is not None and hasattr(top_df, "empty") and not top_df.empty:
            for _, row in top_df.head(8).iterrows():
                q = str(row.get("query", "")).strip()
                v = row.get("value", 0)
                if q:
                    entry["top_queries"].append({"query": q, "value": str(v)})

        if rising_df is not None and hasattr(rising_df, "empty") and not rising_df.empty:
            for _, row in rising_df.head(10).iterrows():
                q = str(row.get("query", "")).strip()
                label, strong, rank = format_rising_label(row.get("value"))
                if q:
                    entry["rising_queries"].append(
                        {
                            "query": q,
                            "growth": label,
                            "strong": strong and not is_parked_keyword(q),
                            "parked": is_parked_keyword(q),
                            "rank": rank,
                        }
                    )
        results.append(entry)

    # Pakistan daily trending searches (strictly filtered to calculation topics)
    trending_relevant: list[str] = []
    trending_ignored_count = 0
    trending_note: str | None = None

    if rate_limited_global:
        trending_note = "Trends rate-limited today, retry tomorrow"
    else:
        if inter_request_sleep > 0:
            sleep_fn(inter_request_sleep)

        def fetch_daily() -> Any:
            return client.trending_searches(pn="pakistan")

        ts_df, ts_429, ts_err = run_with_429_retry(fetch_daily)
        if ts_429:
            trending_note = "Trends rate-limited today, retry tomorrow"
        elif ts_df is not None and hasattr(ts_df, "empty") and not ts_df.empty:
            col = ts_df.columns[0]
            for raw in ts_df[col].tolist():
                item = str(raw).strip()
                if not item:
                    continue
                if is_calculation_relevant(item):
                    trending_relevant.append(item)
                else:
                    trending_ignored_count += 1
        elif ts_err:
            # Fallback to Google Trends official PK daily RSS feed when pytrends legacy hottrends endpoint returns ResponseError
            try:
                rss_fn = fetch_text_fn or default_fetch_text
                rss_xml = rss_fn("https://trends.google.com/trending/rss?geo=PK")
                root = ET.fromstring(rss_xml)
                titles = [
                    el.text.strip()
                    for el in root.findall(".//item/title")
                    if el.text and el.text.strip()
                ]
                if titles:
                    for item in titles:
                        if is_calculation_relevant(item):
                            trending_relevant.append(item)
                        else:
                            trending_ignored_count += 1
                else:
                    trending_note = ts_err
            except Exception as rss_exc:
                trending_note = (
                    "Trends rate-limited today, retry tomorrow"
                    if is_rate_limit_error(rss_exc)
                    else ts_err
                )

    status = "rate_limited" if rate_limited_global else "ok"
    return {
        "status": status,
        "note": global_note or trending_note,
        "terms": results,
        "trending_relevant": trending_relevant,
        "trending_ignored_count": trending_ignored_count,
        "trending_note": trending_note,
    }


def collect_gsc_data(
    secret_json: str | None = None,
    property_url: str = GSC_PROPERTY,
    service_builder: Callable[[dict[str, Any]], Any] | None = None,
    now_utc: datetime | None = None,
) -> dict[str, Any]:
    """Fetch last 28d top 20 queries & top 5 pages from Google Search Console safely."""
    raw = (os.environ.get("GSC_SERVICE_ACCOUNT_JSON", "") if secret_json is None else secret_json).strip()
    if not raw:
        return {
            "status": "unavailable",
            "note": "GSC unavailable — secret add karein",
            "queries": [],
            "pages": [],
        }

    try:
        info = json.loads(raw)
        if not isinstance(info, dict) or not info.get("client_email") or not info.get("private_key"):
            return {
                "status": "unavailable",
                "note": "GSC unavailable — invalid service account JSON format",
                "queries": [],
                "pages": [],
            }
    except Exception:
        return {
            "status": "unavailable",
            "note": "GSC unavailable — invalid service account JSON",
            "queries": [],
            "pages": [],
        }

    try:
        if service_builder is None:
            from google.oauth2 import service_account
            from googleapiclient.discovery import build

            creds = service_account.Credentials.from_service_account_info(
                info,
                scopes=["https://www.googleapis.com/auth/webmasters.readonly"],
            )
            service = build("searchconsole", "v1", credentials=creds, cache_discovery=False)
        else:
            service = service_builder(info)

        ref_day = (now_utc or datetime.now(timezone.utc)).date()
        end_date = ref_day - timedelta(days=2)  # GSC search analytics delay
        start_date = end_date - timedelta(days=27)
        prev_end = start_date - timedelta(days=1)
        prev_start = prev_end - timedelta(days=27)

        curr_q_resp = (
            service.searchanalytics()
            .query(
                siteUrl=property_url,
                body={
                    "startDate": start_date.isoformat(),
                    "endDate": end_date.isoformat(),
                    "dimensions": ["query"],
                    "rowLimit": 20,
                },
            )
            .execute()
        )
        curr_p_resp = (
            service.searchanalytics()
            .query(
                siteUrl=property_url,
                body={
                    "startDate": start_date.isoformat(),
                    "endDate": end_date.isoformat(),
                    "dimensions": ["page"],
                    "rowLimit": 5,
                },
            )
            .execute()
        )

        prev_impr_map: dict[str, int] = {}
        try:
            prev_q_resp = (
                service.searchanalytics()
                .query(
                    siteUrl=property_url,
                    body={
                        "startDate": prev_start.isoformat(),
                        "endDate": prev_end.isoformat(),
                        "dimensions": ["query"],
                        "rowLimit": 50,
                    },
                )
                .execute()
            )
            for row in prev_q_resp.get("rows", []):
                keys = row.get("keys") or []
                if keys:
                    prev_impr_map[keys[0]] = int(row.get("impressions", 0))
        except Exception:
            prev_impr_map = {}

        queries: list[dict[str, Any]] = []
        for row in curr_q_resp.get("rows", []):
            keys = row.get("keys") or []
            if not keys:
                continue
            q = str(keys[0])
            impr = int(row.get("impressions", 0))
            clicks = int(row.get("clicks", 0))
            pos = round(float(row.get("position", 0.0)), 1)
            prev_impr = prev_impr_map.get(q)
            growing = (
                prev_impr is not None
                and impr > prev_impr
                and (prev_impr == 0 or impr >= prev_impr * 1.2)
                and impr >= 3
            )
            queries.append(
                {
                    "query": q,
                    "impressions": impr,
                    "prev_impressions": prev_impr,
                    "clicks": clicks,
                    "position": pos,
                    "growing": growing,
                }
            )

        pages: list[dict[str, Any]] = []
        for row in curr_p_resp.get("rows", []):
            keys = row.get("keys") or []
            if not keys:
                continue
            pages.append(
                {
                    "page": str(keys[0]),
                    "impressions": int(row.get("impressions", 0)),
                    "clicks": int(row.get("clicks", 0)),
                    "position": round(float(row.get("position", 0.0)), 1),
                }
            )

        return {
            "status": "ok",
            "note": f"{start_date.isoformat()} to {end_date.isoformat()}",
            "queries": queries,
            "pages": pages,
        }
    except Exception as exc:
        # SECURITY: log ONLY exception class name, never stringify exception details that might wrap credentials/headers.
        return {
            "status": "unavailable",
            "note": f"GSC unavailable ({type(exc).__name__})",
            "queries": [],
            "pages": [],
        }


def parse_sitemap_date(raw: str | None) -> datetime | None:
    """Parse ISO-8601 date or timestamp into timezone-aware UTC datetime."""
    if not raw:
        return None
    text = raw.strip()
    if len(text) == 10:
        try:
            return datetime.strptime(text, "%Y-%m-%d").replace(tzinfo=timezone.utc)
        except ValueError:
            return None
    normalized = text[:-1] + "+00:00" if text.endswith("Z") else text
    try:
        dt = datetime.fromisoformat(normalized)
        return dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt.astimezone(timezone.utc)
    except ValueError:
        try:
            return datetime.strptime(text[:10], "%Y-%m-%d").replace(tzinfo=timezone.utc)
        except ValueError:
            return None


def topic_from_url(url: str) -> str:
    """Infer a concise topic label strictly from the URL path slug (never scrapes content)."""
    path = urllib.parse.urlparse(url).path.strip("/")
    if not path:
        return "Homepage"
    slug = path.split("/")[-1]
    cleaned = re.sub(r"[-_]+", " ", slug).strip()
    return cleaned.title() if cleaned else path


def default_fetch_text(url: str, timeout: int = 12) -> str:
    ctx = ssl.create_default_context()
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
        return resp.read().decode("utf-8", errors="replace")


def parse_xml_entries(xml_text: str) -> tuple[str, list[dict[str, str | None]]]:
    """Return ('sitemapindex'|'urlset'|'unknown', list of {'loc', 'lastmod'})."""
    root = ET.fromstring(xml_text)
    tag = root.tag.split("}")[-1].lower()
    entries: list[dict[str, str | None]] = []

    if tag == "sitemapindex":
        for child in root:
            if child.tag.split("}")[-1].lower() != "sitemap":
                continue
            loc_el = next((c for c in child if c.tag.split("}")[-1].lower() == "loc"), None)
            mod_el = next((c for c in child if c.tag.split("}")[-1].lower() == "lastmod"), None)
            if loc_el is not None and loc_el.text:
                entries.append(
                    {"loc": loc_el.text.strip(), "lastmod": mod_el.text.strip() if mod_el is not None and mod_el.text else None}
                )
        return ("sitemapindex", entries)

    if tag == "urlset":
        for child in root:
            if child.tag.split("}")[-1].lower() != "url":
                continue
            loc_el = next((c for c in child if c.tag.split("}")[-1].lower() == "loc"), None)
            mod_el = next((c for c in child if c.tag.split("}")[-1].lower() == "lastmod"), None)
            if loc_el is not None and loc_el.text:
                entries.append(
                    {"loc": loc_el.text.strip(), "lastmod": mod_el.text.strip() if mod_el is not None and mod_el.text else None}
                )
        return ("urlset", entries)

    return (tag, [])


def collect_competitor_sitemaps(
    competitors: list[str] | None = None,
    fetch_text_fn: Callable[[str], str] = default_fetch_text,
    now_utc: datetime | None = None,
    days: int = 7,
) -> list[dict[str, Any]]:
    """Inspect competitor sitemaps ONLY and extract URLs added/updated within last 7 days."""
    hosts = competitors or COMPETITORS
    ref_now = now_utc or datetime.now(timezone.utc)
    cutoff = ref_now - timedelta(days=days)
    index_cutoff = ref_now - timedelta(days=days + 3)

    report_items: list[dict[str, Any]] = []
    for host in hosts:
        item: dict[str, Any] = {
            "host": host,
            "sitemap_url": f"https://{host}/sitemap.xml",
            "status": "ok",
            "total_urls": 0,
            "recent_urls": [],
            "note": None,
        }
        xml_body: str | None = None
        try:
            xml_body = fetch_text_fn(item["sitemap_url"])
        except Exception:
            # Fallback to robots.txt Sitemap: directive
            try:
                robots = fetch_text_fn(f"https://{host}/robots.txt")
                for line in robots.splitlines():
                    if line.lower().startswith("sitemap:"):
                        alt_url = line.split(":", 1)[1].strip()
                        if alt_url:
                            item["sitemap_url"] = alt_url
                            xml_body = fetch_text_fn(alt_url)
                            break
            except Exception:
                xml_body = None

        if not xml_body:
            item["status"] = "unavailable"
            item["note"] = "Sitemap unreachable"
            report_items.append(item)
            continue

        try:
            kind, entries = parse_xml_entries(xml_body)
            all_urls: list[dict[str, str | None]] = []
            if kind == "sitemapindex":
                for sm in entries[:12]:
                    sm_loc = sm.get("loc")
                    if not sm_loc:
                        continue
                    sm_dt = parse_sitemap_date(sm.get("lastmod"))
                    if sm_dt is not None and sm_dt < index_cutoff:
                        continue
                    try:
                        child_xml = fetch_text_fn(sm_loc)
                        c_kind, c_entries = parse_xml_entries(child_xml)
                        if c_kind == "urlset":
                            all_urls.extend(c_entries)
                    except Exception:
                        continue
            elif kind == "urlset":
                all_urls.extend(entries)
            else:
                item["status"] = "unavailable"
                item["note"] = f"Unexpected sitemap root: {kind}"
                report_items.append(item)
                continue

            item["total_urls"] = len(all_urls)
            dated_count = 0
            recent: list[dict[str, str]] = []
            for entry in all_urls:
                loc = entry.get("loc")
                lastmod_str = entry.get("lastmod")
                if not loc:
                    continue
                dt = parse_sitemap_date(lastmod_str)
                if dt is not None:
                    dated_count += 1
                    if dt >= cutoff:
                        recent.append(
                            {
                                "url": loc,
                                "date": dt.date().isoformat(),
                                "topic": topic_from_url(loc),
                            }
                        )

            recent.sort(key=lambda r: r["date"], reverse=True)
            item["recent_urls"] = recent[:15]
            if dated_count == 0 and len(all_urls) > 0:
                item["note"] = "Sitemap has no <lastmod> dates"
        except Exception as exc:
            item["status"] = "unavailable"
            item["note"] = f"Sitemap parse failed ({type(exc).__name__})"

        report_items.append(item)

    return report_items


def count_prior_keyword_appearances(
    prior_issues: list[dict[str, Any]],
    report_date_str: str,
) -> dict[str, int]:
    """Count distinct prior report dates that already mentioned candidate keywords."""
    counts: dict[str, set[str]] = {}
    for issue in prior_issues:
        title = str(issue.get("title") or "")
        body = str(issue.get("body") or "")
        if f"SEO Report {report_date_str}" in title:
            continue
        date_match = re.search(r"\b(20\d{2}-\d{2}-\d{2})\b", title)
        date_key = date_match.group(1) if date_match else f"issue-{issue.get('number', len(counts))}"
        body_lower = body.lower()
        # Capture backticked candidate strings mentioned in prior Strong Candidates / Top Keywords tables
        for match in re.findall(r"`([^`\n]{4,90})`", body_lower):
            counts.setdefault(match.strip(), set()).add(date_key)
    return {k: len(v) for k, v in counts.items()}


def build_strong_candidates(
    trends_data: dict[str, Any],
    gsc_data: dict[str, Any],
    prior_counts: dict[str, int],
) -> list[dict[str, Any]]:
    """Classify Strong candidates (Breakout / +100%+ / GSC growing / 2-3 sustained runs)."""
    candidates_map: dict[str, dict[str, Any]] = {}

    for term_entry in trends_data.get("terms", []):
        default_page = term_entry["page"]
        default_path = term_entry["path"]
        for rq in term_entry.get("rising_queries", []):
            q = rq["query"]
            if rq.get("parked") or is_parked_keyword(q) or not is_calculation_relevant(q):
                continue
            prev_runs = prior_counts.get(q.lower(), 0)
            total_runs = prev_runs + 1
            if rq.get("strong") or prev_runs >= 1:
                page_name, page_path = match_target_page(q, default_page, default_path)
                reasons = [f"Trends rising ({rq['growth']})"]
                if prev_runs >= 1:
                    reasons.append(f"sustained {total_runs} runs")
                key = q.lower()
                candidates_map[key] = {
                    "keyword": q,
                    "page": f"{page_name} (`{page_path}`)",
                    "signal": ", ".join(reasons),
                    "sustained_runs": total_runs,
                    "title_meta_ready": total_runs >= 2,
                }

    for gq in gsc_data.get("queries", []):
        q = gq["query"]
        if is_parked_keyword(q):
            continue
        prev_runs = prior_counts.get(q.lower(), 0)
        total_runs = prev_runs + 1
        if gq.get("growing") or (gq.get("impressions", 0) >= 10 and prev_runs >= 1):
            page_name, page_path = match_target_page(q)
            key = q.lower()
            reason = f"GSC growing ({gq.get('prev_impressions', '?')} -> {gq['impressions']} impr, pos {gq['position']})"
            if key in candidates_map:
                candidates_map[key]["signal"] += f"; {reason}"
            else:
                candidates_map[key] = {
                    "keyword": q,
                    "page": f"{page_name} (`{page_path}`)",
                    "signal": f"{reason}" + (f", sustained {total_runs} runs" if prev_runs >= 1 else ""),
                    "sustained_runs": total_runs,
                    "title_meta_ready": total_runs >= 2,
                }

    return sorted(candidates_map.values(), key=lambda c: (-c["sustained_runs"], c["keyword"]))


def render_report_markdown(
    report_date_str: str,
    generated_at_pkt: str,
    trends_data: dict[str, Any],
    gsc_data: dict[str, Any],
    competitors_data: list[dict[str, Any]],
    candidates: list[dict[str, Any]],
) -> str:
    """Render structured DRAFT-ONLY GitHub Issue Markdown report."""
    lines: list[str] = [
        f"# SEO Report {report_date_str} (DRAFT ONLY)",
        "",
        f"> **Generated:** {generated_at_pkt} PKT  ",
        "> **Scope:** Reporting ONLY — site content, FAQs, titles, meta, rates, and formulas were NOT modified. No commit/deploy triggered.",
        "",
        "---",
        "",
        "## 1. Aaj ke Top Calculation Keywords (Trends Rising + GSC Queries)",
        "",
        "### Google Trends Pakistan (Past 90 Days — 7 Core Terms)",
    ]

    if trends_data.get("status") == "rate_limited" and not trends_data.get("terms"):
        lines.append("- **Note:** `Trends rate-limited today, retry tomorrow`")
    elif not trends_data.get("terms"):
        lines.append(f"- **Note:** {trends_data.get('note') or 'Trends unavailable today'}")
    else:
        for t in trends_data["terms"]:
            interest_str = str(t["latest_interest"]) if t["latest_interest"] is not None else "N/A"
            if t.get("note"):
                lines.append(f"- **`{t['term']}`** -> {t['page']} (`{t['path']}`): _{t['note']}_")
                continue
            top_list = ", ".join(f"`{q['query']}` ({q['value']})" for q in t["top_queries"][:4]) or "None"
            rising_list = (
                ", ".join(
                    f"`{q['query']}` (**{q['growth']}**)" if q["strong"] else f"`{q['query']}` ({q['growth']})"
                    for q in t["rising_queries"][:5]
                    if not q.get("parked")
                )
                or "None"
            )
            lines.append(
                f"- **`{t['term']}`** -> {t['page']} (`{t['path']}`) | Latest Interest: `{interest_str}`  \n"
                f"  - Top: {top_list}  \n"
                f"  - Rising: {rising_list}"
            )

    lines.append("")
    lines.append("### Pakistan Trending Searches (Calculation-Related Filter)")
    if trends_data.get("trending_note"):
        lines.append(f"- {trends_data['trending_note']}")
    elif trends_data.get("trending_relevant"):
        for item in trends_data["trending_relevant"][:15]:
            lines.append(f"- `{item}`")
        lines.append(
            f"- _(Filtered out {trends_data.get('trending_ignored_count', 0)} non-calculation trends such as cricket/entertainment)_"
        )
    else:
        lines.append(
            f"- No calculation-related daily spikes today (filtered out {trends_data.get('trending_ignored_count', 0)} non-calculation trends)."
        )

    lines.append("")
    lines.append(f"### Google Search Console (`{GSC_PROPERTY}`, Last 28 Days)")
    if gsc_data.get("status") != "ok":
        lines.append(f"- **{gsc_data.get('note', 'GSC unavailable — secret add karein')}**")
    else:
        lines.append(f"- Period: `{gsc_data.get('note')}`")
        lines.append("")
        lines.append("#### Top 20 Queries")
        if gsc_data.get("queries"):
            lines.append("| # | Query | Impressions | Clicks | Avg Position |")
            lines.append("|---|---|---:|---:|---:|")
            for idx, row in enumerate(gsc_data["queries"][:20], start=1):
                lines.append(
                    f"| {idx} | `{row['query']}` | {row['impressions']} | {row['clicks']} | {row['position']} |"
                )
        else:
            lines.append("- No GSC query rows returned yet for this period.")

        lines.append("")
        lines.append("#### Top 5 Pages")
        if gsc_data.get("pages"):
            lines.append("| # | Page | Impressions | Clicks | Avg Position |")
            lines.append("|---|---|---:|---:|---:|")
            for idx, row in enumerate(gsc_data["pages"][:5], start=1):
                lines.append(
                    f"| {idx} | `{row['page']}` | {row['impressions']} | {row['clicks']} | {row['position']} |"
                )
        else:
            lines.append("- No GSC page rows returned yet.")

    lines.extend(
        [
            "",
            "---",
            "",
            "## 2. Strong Keyword Candidates (Breakout / +100%+ / GSC Growing / Sustained)",
            "",
            "> **Rule:** Titles/meta sirf un keywords ke liye badlein jo **2–3 runs se sustained** hon. Single-run observations are marked below for tracking only.",
            "",
        ]
    )

    if candidates:
        lines.append("| Candidate Keyword | Matching Page | Signal & Sustained Note | Title/Meta Readiness |")
        lines.append("|---|---|---|---|")
        for c in candidates:
            readiness = (
                "Sustained 2+ runs — review for Title/Meta/FAQ"
                if c["title_meta_ready"]
                else "1st run observed — wait for 2–3 sustained runs before changing Title/Meta"
            )
            lines.append(f"| `{c['keyword']}` | {c['page']} | {c['signal']} | {readiness} |")
    else:
        lines.append("- No new Strong (`Breakout` / `+100%+` / growing GSC) calculation candidates detected in today's run.")

    lines.extend(
        [
            "",
            "---",
            "",
            "## 3. PARKED: PTA Tax Calculator (~17 Dec 2026 tak)",
            "",
            "- **PARKED: PTA tax calculator** (1-month hold rule, until ~17 Dec 2026). All PTA / IMEI / mobile tax queries are intentionally excluded from candidate recommendations.",
            "",
            "---",
            "",
            "## 4. Competitor Naye Topics (Sitemap Only — Last 7 Days)",
            "",
            "> Sitemaps checked read-only for new/updated URLs (`<lastmod>` last 7 days). No SERP scraping and no content copying.",
            "",
        ]
    )

    for comp in competitors_data:
        if comp["status"] != "ok":
            lines.append(f"- **{comp['host']}** (`{comp['sitemap_url']}`): _{comp.get('note') or 'Unavailable'}_")
            continue
        recent = comp["recent_urls"]
        note_suffix = f" — _{comp['note']}_" if comp.get("note") else ""
        lines.append(
            f"- **{comp['host']}** (`{comp['total_urls']}` total URLs, `{len(recent)}` updated in last 7d){note_suffix}"
        )
        for u in recent:
            lines.append(f"  - `{u['date']}` — Topic note: **{u['topic']}** (`{u['url']}`)")

    lines.extend(
        [
            "",
            "---",
            "",
            "## 5. Kya Add NA Karna (Editorial Guardrails)",
            "",
            "- **Weak or fleeting keywords:** Do not chase `< +100%` 1-day spikes or zero-volume random variants.",
            "- **Off-topic trends:** Ignore non-calculation Pakistan trends (cricket, entertainment, drama, unrelated news).",
            "- **30-day no-delete rule:** Jo keyword zero ho gaya ho usay **30 din se pehle delete/remove NA karein** — ranking mein haftay lagte hain.",
            "- **Zero automatic site edits:** Do not auto-modify calculator slabs, nisab/Fitrana rates, formulas, FAQs, titles, meta, JSON-LD, ads, or analytics.",
            "",
        ]
    )

    report = "\n".join(lines)
    # Safeguard GitHub Issue max body size (65,536 chars)
    if len(report) > 62000:
        report = report[:62000] + "\n\n_(Report truncated to fit GitHub Issue body limit; see uploaded artifact for complete output.)_\n"
    return report


def generate_and_write_report(
    output_dir: str | Path | None = None,
    prior_issues_path: str | Path | None = None,
    core_targets: list[dict[str, str]] | None = None,
    competitors: list[str] | None = None,
    trend_client_factory: Callable[[], Any] | None = None,
    gsc_service_builder: Callable[[dict[str, Any]], Any] | None = None,
    fetch_text_fn: Callable[[str], str] = default_fetch_text,
    sleep_fn: Callable[[float], None] = time.sleep,
    inter_request_sleep: float | None = None,
    backoff_seconds: float | None = None,
    now_utc: datetime | None = None,
) -> dict[str, Any]:
    """Run all 3 read-only collectors and write report.md, report.json, and report_date.txt."""
    ref_utc = now_utc or datetime.now(timezone.utc)
    ref_pkt = ref_utc.astimezone(PKT_TZ)
    report_date_str = ref_pkt.strftime("%Y-%m-%d")
    generated_at_pkt = ref_pkt.strftime("%Y-%m-%d %H:%M")

    sleep_s = (
        float(os.environ.get("SEO_TRENDS_SLEEP", "5.0"))
        if inter_request_sleep is None
        else float(inter_request_sleep)
    )
    backoff_s = (
        float(os.environ.get("SEO_TRENDS_BACKOFF", "60.0"))
        if backoff_seconds is None
        else float(backoff_seconds)
    )

    prior_issues: list[dict[str, Any]] = []
    p_path = Path(prior_issues_path or os.environ.get("SEO_PRIOR_ISSUES_PATH", ""))
    if str(p_path) and p_path.is_file():
        try:
            loaded = json.loads(p_path.read_text(encoding="utf-8"))
            if isinstance(loaded, list):
                prior_issues = loaded
        except Exception:
            prior_issues = []

    prior_counts = count_prior_keyword_appearances(prior_issues, report_date_str)
    trends_data = collect_google_trends(
        core_targets=core_targets,
        trend_client_factory=trend_client_factory,
        sleep_fn=sleep_fn,
        inter_request_sleep=sleep_s,
        backoff_seconds=backoff_s,
        fetch_text_fn=fetch_text_fn,
    )
    gsc_data = collect_gsc_data(
        service_builder=gsc_service_builder,
        now_utc=ref_utc,
    )
    competitors_data = collect_competitor_sitemaps(
        competitors=competitors,
        fetch_text_fn=fetch_text_fn,
        now_utc=ref_utc,
        days=7,
    )
    candidates = build_strong_candidates(trends_data, gsc_data, prior_counts)
    markdown = render_report_markdown(
        report_date_str=report_date_str,
        generated_at_pkt=generated_at_pkt,
        trends_data=trends_data,
        gsc_data=gsc_data,
        competitors_data=competitors_data,
        candidates=candidates,
    )

    out_path = Path(output_dir or os.environ.get("SEO_OUTPUT_DIR", "tmp-seo-report"))
    out_path.mkdir(parents=True, exist_ok=True)
    (out_path / "report_date.txt").write_text(report_date_str, encoding="utf-8")
    (out_path / "report.md").write_text(markdown, encoding="utf-8")

    summary_payload = {
        "report_date": report_date_str,
        "generated_at_pkt": generated_at_pkt,
        "trends": trends_data,
        "gsc": gsc_data,
        "competitors": competitors_data,
        "strong_candidates": candidates,
        "parked": "PTA tax calculator (~17 Dec 2026)",
    }
    (out_path / "report.json").write_text(json.dumps(summary_payload, indent=2), encoding="utf-8")
    return summary_payload


if __name__ == "__main__":
    summary = generate_and_write_report()
    print(
        f"Draft SEO report written for {summary['report_date']} PKT | "
        f"Trends={summary['trends']['status']} | "
        f"GSC={summary['gsc']['status']} | "
        f"Competitors={len(summary['competitors'])} | "
        f"StrongCandidates={len(summary['strong_candidates'])}"
    )
