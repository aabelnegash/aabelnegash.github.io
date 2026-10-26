// Recorded hospital-project evidence, kept separate from the general portfolio catalog.
export const metrics = [
  {
    "value": "4,812",
    "label": "Hospitals in dataset",
    "detail": "Recorded cleaned hospital dataset",
    "sourceUrl": "https://github.com/aabelnegash/hospital-cleaning-project/blob/main/reports/change_report.txt#L5-L6"
  },
  {
    "value": "3,567",
    "label": "Hospitals with ratings",
    "detail": "Overall ratings available",
    "sourceUrl": "https://github.com/aabelnegash/hospital-quality-analysis/blob/main/README.md#L209-L211"
  },
  {
    "value": "28 → 20",
    "label": "Columns, raw → clean",
    "detail": "Eight footnote columns removed",
    "sourceUrl": "https://github.com/aabelnegash/hospital-cleaning-project/blob/main/reports/change_report.txt#L5-L10"
  },
  {
    "value": "0",
    "label": "Reported validation failures",
    "detail": "Recorded validation report",
    "sourceUrl": "https://github.com/aabelnegash/hospital-cleaning-project/blob/main/reports/validation_report.txt#L1-L26"
  }
];

export const sandbox = {
  "code": "    # ---------- ZIP / Phone / State formats ----------\n    for col, pattern in [\n        (\"zip_code\", r\"^\\d{5}$\"),\n        (\"phone_number\", r\"^\\d{10}$\"),\n        (\"state\", r\"^[A-Z]{2}$\"),\n    ]:\n        if col not in df.columns:\n            failures += 1\n            fail(lines, f\"Missing required column: {col}\")\n            continue\n\n        s = df[col].dropna()\n        bad = s[~s.str.match(pattern)]\n        if len(bad) == 0:\n            ok(lines, f\"{col} format valid (0 bad)\")\n        else:\n            failures += 1\n            fail(lines, f\"{col} format invalid: {len(bad)} examples={bad.head(10).tolist()}\")",
  "codeLabel": "Source excerpt · src/validate.py · lines 78–95",
  "codeSourceUrl": "https://github.com/aabelnegash/hospital-cleaning-project/blob/main/src/validate.py#L78-L95"
};
