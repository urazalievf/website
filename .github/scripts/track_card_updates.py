#!/usr/bin/env python3
"""Scan card-news RSS feeds for items mentioning cards listed in
rewards-cards.jsx, and open a GitHub issue summarizing matches."""

import os
import re
import sys
import subprocess
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from pathlib import Path

FEEDS = [
    ("Doctor of Credit", "https://www.doctorofcredit.com/feed/"),
    ("Frequent Miler", "https://frequentmiler.com/feed/"),
    ("One Mile at a Time", "https://onemileatatime.com/feed/"),
]
LOOKBACK_DAYS = 14
JSX_PATH = Path("rewards-cards.jsx")


def load_cards(path: Path):
    text = path.read_text(encoding="utf-8")
    brands = re.findall(r'^\s*brand:\s*"([^"]+)"', text, re.MULTILINE)
    names = re.findall(r'^\s*name:\s*"([^"]+)"', text, re.MULTILINE)
    return [(b.strip(), n.strip()) for b, n in zip(brands, names)]


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "card-tracker/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def parse_feed(name: str, url: str):
    try:
        data = fetch(url)
        root = ET.fromstring(data)
    except Exception as e:
        print(f"[warn] {name}: {e}", file=sys.stderr)
        return []
    out = []
    for item in root.iter("item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        pub = (item.findtext("pubDate") or "").strip()
        try:
            dt = datetime.strptime(pub, "%a, %d %b %Y %H:%M:%S %z")
        except ValueError:
            dt = None
        out.append({"title": title, "link": link, "date": dt, "source": name})
    return out


def normalize(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()


def matches(item, brand: str, name: str) -> bool:
    # The card name is what distinguishes one card from another within an
    # issuer's lineup ("Sapphire Reserve", "Gold Card", "Bilt 2.0"). Require
    # it to appear as a contiguous phrase in the title — brand alone matches
    # too many unrelated articles ("Chase Sapphire Reserve" vs every Chase
    # card; "Apple gift card" vs the Apple Card).
    name_norm = normalize(name)
    if not name_norm:
        return False
    return name_norm in normalize(item["title"])


def main() -> int:
    if not JSX_PATH.exists():
        print(f"[fatal] {JSX_PATH} not found", file=sys.stderr)
        return 1
    cards = load_cards(JSX_PATH)
    cutoff = datetime.now(timezone.utc) - timedelta(days=LOOKBACK_DAYS)

    by_card: dict[str, list[dict]] = {}
    for source_name, url in FEEDS:
        for item in parse_feed(source_name, url):
            if item["date"] and item["date"] < cutoff:
                continue
            for brand, name in cards:
                if matches(item, brand, name):
                    by_card.setdefault(f"{brand} — {name}", []).append(item)

    if not by_card:
        print("No relevant items in the lookback window.")
        return 0

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    title = f"Card-news scan — {today}"
    lines = [
        f"Scan window: last {LOOKBACK_DAYS} days across {len(FEEDS)} feeds.",
        "",
        "Verify welcome offers, fees, and benefits against the issuer page",
        "before editing `rewards-cards.jsx`.",
        "",
    ]
    for card_label in sorted(by_card):
        lines.append(f"### {card_label}")
        seen = set()
        for item in by_card[card_label]:
            key = item["link"] or item["title"]
            if key in seen:
                continue
            seen.add(key)
            lines.append(f"- [{item['title']}]({item['link']}) — *{item['source']}*")
        lines.append("")
    body = "\n".join(lines)

    repo = os.environ["GH_REPO"]
    subprocess.run(
        ["gh", "issue", "create", "-R", repo, "-t", title, "-b", body],
        check=True,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
