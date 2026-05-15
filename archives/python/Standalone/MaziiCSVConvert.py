#!/usr/bin/env python3
"""MaziiCSVConvert — merged CLI for Split, Enrich, and SplitEnriched."""
from pathlib import Path
import argparse
import sys
import re
import csv
import json
import zipfile
from urllib.parse import quote_plus
from urllib.request import urlopen, Request

import pandas as pd

# compute repo root from this script's location: /archives/python -> repo root is 2 parents up
REPO_ROOT = Path(__file__).resolve().parents[2]
RESULTS_DIR = REPO_ROOT / "results"
UNIHAN_DIR = REPO_ROOT / "unihan"


def ensure_dir(p: Path):
    p.mkdir(parents=True, exist_ok=True)


# ---- Split logic (from split.py) ----
INPUT_GLOB = "*.xlsx"
KANJI_ONLY_RE = re.compile(r'^[\u4E00-\u9FFF々ヶ]+$')
SINGLE_KANJI_RE = re.compile(r'^[\u4E00-\u9FFF]$')
KATAKANA_RE = re.compile(r'^[\u30A0-\u30FFー]+$')


def classify_rows(input_file: Path):
    df = pd.read_excel(input_file)
    word_column = df.columns[0]
    kanji_only = []
    single_kanji = []
    katakana = []
    others = []
    for _, row in df.iterrows():
        row_dict = row.to_dict()
        row_dict["source_file"] = input_file.name
        word = str(row_dict[word_column]).strip()
        row_dict["_word"] = word
        if word == "" or word == "nan":
            continue
        if SINGLE_KANJI_RE.fullmatch(word):
            single_kanji.append(row_dict)
        elif KANJI_ONLY_RE.fullmatch(word):
            kanji_only.append(row_dict)
        elif KATAKANA_RE.fullmatch(word):
            katakana.append(row_dict)
        else:
            others.append(row_dict)
    return kanji_only, single_kanji, katakana, others


def save_csv(filename: Path, rows):
    cleaned = []
    for r in rows:
        if isinstance(r, dict) and "_word" in r:
            cleaned.append({k: v for k, v in r.items() if k != "_word"})
        else:
            cleaned.append(r)
    out = pd.DataFrame(cleaned)
    out.to_csv(filename, index=False, encoding="utf-8-sig")


def do_split(args):
    base_dir = REPO_ROOT
    output_dir = base_dir / "results"
    ensure_dir(output_dir)

    kanji_only = []
    single_kanji = []
    katakana = []
    others = []
    seen_words = set()

    for input_file in sorted(base_dir.glob(INPUT_GLOB)):
        if input_file.name.startswith("~$"):
            continue
        if input_file.parent == output_dir:
            continue
        file_kanji_only, file_single_kanji, file_katakana, file_others = classify_rows(input_file)
        for r in file_kanji_only:
            w = r.get("_word")
            if not w or w in seen_words:
                continue
            seen_words.add(w)
            kanji_only.append(r)
        for r in file_single_kanji:
            w = r.get("_word")
            if not w or w in seen_words:
                continue
            seen_words.add(w)
            single_kanji.append(r)
        for r in file_katakana:
            w = r.get("_word")
            if not w or w in seen_words:
                continue
            seen_words.add(w)
            katakana.append(r)
        for r in file_others:
            w = r.get("_word")
            if not w or w in seen_words:
                continue
            seen_words.add(w)
            others.append(r)

    save_csv(output_dir / "kanji_only.csv", kanji_only)
    save_csv(output_dir / "single_kanji.csv", single_kanji)
    save_csv(output_dir / "katakana_loan.csv", katakana)
    save_csv(output_dir / "others.csv", others)

    print("Done.")
    print("Output folder:", output_dir)
    print("Kanji only:", len(kanji_only))
    print("Single kanji:", len(single_kanji))
    print("Katakana:", len(katakana))
    print("Others:", len(others))


# ---- Enrich logic (from enrich_results.py) ----
UNIHAN_ZIP_URL = "https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip"


def download_and_extract_unihan(dest: Path):
    dest.mkdir(parents=True, exist_ok=True)
    print("Downloading Unihan (this may take a while)...")
    req = Request(UNIHAN_ZIP_URL, headers={"User-Agent": "python-urllib"})
    with urlopen(req) as resp:
        data = resp.read()
    zip_path = dest / "Unihan.zip"
    zip_path.write_bytes(data)
    print("Extracting Unihan...")
    with zipfile.ZipFile(zip_path, "r") as z:
        z.extractall(dest)
    zip_path.unlink()


def load_kvietnamese(unihan_path: Path):
    mapping = {}
    if not unihan_path.exists():
        return mapping
    for p in unihan_path.glob("**/*.txt"):
        with p.open(encoding="utf-8") as fh:
            for line in fh:
                if not line or line.startswith("#"):
                    continue
                parts = line.strip().split("\t")
                if len(parts) < 3:
                    continue
                cp, field, val = parts[0], parts[1], parts[2]
                if field == "kVietnamese":
                    try:
                        char = chr(int(cp[2:], 16))
                    except Exception:
                        continue
                    mapping[char] = val
    return mapping


def hanviet_for_word(word: str, mapping: dict):
    readings = []
    for ch in word:
        if ch in mapping:
            readings.append(mapping[ch])
        else:
            readings.append("")
    return " ".join([r for r in readings if r])


def jisho_meaning(word: str):
    try:
        url = f"https://jisho.org/api/v1/search/words?keyword={quote_plus(word)}"
        req = Request(url, headers={"User-Agent": "python-urllib"})
        with urlopen(req, timeout=15) as resp:
            data = json.load(resp)
        if data.get("data"):
            senses = data["data"][0].get("senses", [])
            if senses:
                defs = senses[0].get("english_definitions", [])
                return "; ".join(defs)
    except Exception:
        return ""
    return ""


def jisho_reading(word: str):
    try:
        url = f"https://jisho.org/api/v1/search/words?keyword={quote_plus(word)}"
        req = Request(url, headers={"User-Agent": "python-urllib"})
        with urlopen(req, timeout=15) as resp:
            data = json.load(resp)
        if data.get("data"):
            jap = data["data"][0].get("japanese", [])
            if jap:
                reading = jap[0].get("reading")
                if reading:
                    return reading
    except Exception:
        return ""
    return ""


def pykakasi_reading(word: str):
    try:
        from pykakasi import kakasi

        k = kakasi()
        conv = k.convert(word)
        if isinstance(conv, list):
            return "".join(item.get("hira", "") for item in conv)
        return ""
    except Exception:
        try:
            from pykakasi import kakasi

            k = kakasi()
            k.setMode("J", "H")
            conv = k.getConverter()
            return conv.do(word)
        except Exception:
            return ""


KATAKANA_RE = re.compile(r'^[\u30A0-\u30FFー]+$')


def glosbe_translate_to_vie(phrase: str):
    try:
        url = (
            "https://glosbe.com/gapi/translate?from=jpn&dest=vie&format=json&phrase="
            + quote_plus(phrase)
        )
        req = Request(url, headers={"User-Agent": "python-urllib"})
        with urlopen(req, timeout=15) as resp:
            data = json.load(resp)
        tuc = data.get("tuc", [])
        for t in tuc:
            phrase_obj = t.get("phrase")
            if phrase_obj:
                return phrase_obj.get("text", "")
    except Exception:
        return ""
    return ""


def jamdict_meaning(word: str):
    try:
        from jamdict import Jamdict

        jd = Jamdict()
        res = jd.lookup(word)
        senses = []
        for entry in res.entries:
            for sense in entry.senses:
                senses.extend([g for g in sense.glosses])
        if senses:
            return "; ".join(senses)
    except Exception:
        return ""
    return ""


def enrich_dataframe(df: pd.DataFrame, kv_map: dict, online: bool = False):
    word_col = df.columns[0]
    if "comment" not in df.columns:
        df["comment"] = ""
    if "meaning" not in df.columns:
        df["meaning"] = ""

    def is_blank(v):
        if pd.isna(v):
            return True
        s = str(v).strip()
        return s == "" or s.lower() == "nan"

    for idx, row in df.iterrows():
        word = str(row[word_col]).strip()
        if not word or word.lower() == "nan":
            continue
        if is_blank(row.get("phonetic", "")):
            phon = ""
            if KATAKANA_RE.fullmatch(word):
                phon = word
            else:
                if online:
                    phon = jisho_reading(word)
                if not phon:
                    phon = pykakasi_reading(word)
            if phon:
                df.at[idx, "phonetic"] = phon
        if is_blank(row.get("comment", "")):
            hv = hanviet_for_word(word, kv_map)
            if hv:
                df.at[idx, "comment"] = hv
        if is_blank(row.get("meaning", "")):
            vi = ""
            if online:
                vi = glosbe_translate_to_vie(word)
            if vi:
                df.at[idx, "meaning"] = vi
                continue
            en = jamdict_meaning(word)
            if en:
                df.at[idx, "meaning"] = en
                continue
            if online:
                en2 = jisho_meaning(word)
                if en2:
                    df.at[idx, "meaning"] = en2
    return df


def do_enrich(args):
    if not RESULTS_DIR.exists():
        print("No results directory found. Run split first.")
        return
    if not UNIHAN_DIR.exists():
        try:
            download_and_extract_unihan(UNIHAN_DIR)
        except Exception as e:
            print("Could not download Unihan data:", e)
            print("Han-Viet lookups will be skipped unless you provide Unihan files in:", UNIHAN_DIR)
    print("Loading kVietnamese mapping...")
    kv_map = load_kvietnamese(UNIHAN_DIR)
    print(f"Loaded {len(kv_map)} kVietnamese entries")
    online = getattr(args, "online", True)
    for csv_path in sorted(RESULTS_DIR.glob("*.csv")):
        if csv_path.name.startswith("enriched_"):
            continue
        print("Processing", csv_path.name)
        df = pd.read_csv(csv_path, dtype=str)
        df = enrich_dataframe(df, kv_map, online=online)
        out_path = RESULTS_DIR / f"enriched_{csv_path.name}"
        df.to_csv(out_path, index=False, encoding="utf-8-sig")
        print("Wrote", out_path.name)


# ---- SplitEnriched logic (from split_enriched.py) ----
MAX_LINES_PER_FILE = 500


def split_csv_file(csv_path: Path, output_dir: Path, max_lines: int = MAX_LINES_PER_FILE):
    df = pd.read_csv(csv_path, dtype=str)
    df = df.map(lambda value: value.replace("\r\n", " ").replace("\n", " ").replace("\r", " ") if isinstance(value, str) else value)
    rows_per_chunk = max(1, max_lines - 1)
    output_dir.mkdir(parents=True, exist_ok=True)
    if len(df) <= rows_per_chunk:
        out_path = output_dir / csv_path.name
        df.to_csv(out_path, index=False, encoding="utf-8-sig")
        return [out_path]
    out_paths = []
    stem = csv_path.stem
    suffix = csv_path.suffix
    for chunk_index, start in enumerate(range(0, len(df), rows_per_chunk), start=1):
        chunk = df.iloc[start : start + rows_per_chunk]
        out_path = output_dir / f"{stem}_part{chunk_index}{suffix}"
        chunk.to_csv(out_path, index=False, encoding="utf-8-sig")
        out_paths.append(out_path)
    return out_paths


def do_split_enriched(args):
    source_dir = RESULTS_DIR
    output_dir = source_dir / "separate"
    if not source_dir.exists():
        print("No results directory found. Run split and enrich first.")
        return
    enriched_files = sorted(source_dir.glob("enriched_*.csv"))
    if not enriched_files:
        print("No enriched CSV files found in results/")
        return
    all_outputs = []
    for csv_path in enriched_files:
        print(f"Splitting {csv_path.name}...")
        all_outputs.extend(split_csv_file(csv_path, output_dir))
    print(f"Done. Wrote {len(all_outputs)} file(s) to {output_dir}")


def interactive_menu():
    print("MaziiCSVConvert — choose an action:")
    print("1) Split")
    print("2) Enrich")
    print("3) SplitEnriched")
    choice = input("Enter number: ").strip()
    return choice


def main():
    parser = argparse.ArgumentParser(description="MaziiCSVConvert CLI")
    parser.add_argument("--action", choices=["split", "enrich", "split-enriched"], help="Action to run")
    parser.add_argument("--no-online", dest="online", action="store_false", help="Disable online lookups")
    parser.set_defaults(online=True)
    args = parser.parse_args()
    action = args.action
    if not action:
        choice = interactive_menu()
        mapping = {"1": "split", "2": "enrich", "3": "split-enriched"}
        action = mapping.get(choice)
        if not action:
            print("Invalid choice")
            sys.exit(1)
    if action == "split":
        do_split(args)
    elif action == "enrich":
        do_enrich(args)
    elif action == "split-enriched":
        do_split_enriched(args)


if __name__ == "__main__":
    main()
