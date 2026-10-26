// Project catalog: add future projects here; the interface renders from this data.
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

export const projects = [
  {
    "id": "hospital-data-cleaning",
    "title": "Hospital Data Cleaning",
    "category": "Data cleaning",
    "pipeline": ["Profile", "Clean", "Validate", "Report"],
    "summary": "A reproducible Python/pandas pipeline for the CMS Hospital General Information dataset. Profiles raw data, standardizes selected fields, enforces a consistent output schema, and writes validation and change reports.",
    "technologies": [
      "Python",
      "pandas",
      "GitHub Actions"
    ],
    "projectUrl": "https://aabelnegash.github.io/hospital-cleaning-project/",
    "repositoryUrl": "https://github.com/aabelnegash/hospital-cleaning-project",
    "highlights": [
      "Profiles missing values, duplicates and data types",
      "Standardizes state, ZIP code and phone fields",
      "Removes footnote columns and applies a fixed 20-column output schema",
      "Writes validation reports; sample-data validation runs in GitHub Actions"
    ],
    "code": {
      "language": "python",
      "filename": "src/clean.py",
      "sourceUrl": "https://github.com/aabelnegash/hospital-cleaning-project/blob/main/src/clean.py#L18-L34",
        "sourceLines": [
        18,
        34
      ],
      "content": "def standardize_columns(df: pd.DataFrame) -> pd.DataFrame:\n    df = df.copy()\n    df.columns = (\n        df.columns.str.strip()\n        .str.lower()\n        .str.replace(r\"\\s+\", \"_\", regex=True)\n        .str.replace(r\"[^a-z0-9_]\", \"\", regex=True)\n    )\n    return df\n\ndef clean_state(s: pd.Series) -> pd.Series:\n    return s.astype(\"string\").str.strip().str.upper()\n\ndef clean_zip(s: pd.Series) -> pd.Series:\n    s = s.astype(\"string\").str.strip().str.replace(r\"[^0-9]\", \"\", regex=True)\n    s = s.str.slice(0, 5)\n    return s",
      "caption": "Source excerpt: column names, state values and ZIP codes are standardized."
    }
  },
  {
    "id": "hospital-quality-analysis",
    "title": "Hospital Quality Analysis",
    "category": "Analysis & reporting",
    "summary": "An analysis of cleaned CMS hospital data using SQLite, SQL, Excel and Power BI. Compares rating coverage, sample-adjusted rankings and national quality domains across states, ownership types and hospital types.",
    "technologies": [
      "SQL",
      "SQLite",
      "Python",
      "Excel",
      "Power BI"
    ],
    "projectUrl": "https://aabelnegash.github.io/hospital-quality-analysis/",
    "repositoryUrl": "https://github.com/aabelnegash/hospital-quality-analysis",
    "highlights": [
      "Loads the cleaned hospital CSV into SQLite",
      "Examines ratings across state, ownership and hospital-type groups",
      "Compares seven CMS national quality domains and their missingness",
      "Exports SQL summaries for Excel reporting and interactive Power BI dashboards"
    ],
    "code": {
      "language": "sql",
      "filename": "sql/04_state_analysis.sql",
      "sourceUrl": "https://github.com/aabelnegash/hospital-quality-analysis/blob/main/sql/04_state_analysis.sql#L25-L49",
        "sourceLines": [
        25,
        49
      ],
      "content": "-- Rank states by rating strength while penalizing small rated sample sizes.\nWITH state_summary AS(\n    SELECT\n        state,\n        COUNT(*) AS total_hospitals,\n        SUM(CASE WHEN hospital_overall_rating IS NOT NULL THEN 1 ELSE 0 END) AS rated_hospitals,\n        ROUND(AVG(CAST(hospital_overall_rating AS REAL)), 2) AS avg_rating,\n        SUM(CASE WHEN emergency_services = 'Yes' THEN 1 ELSE 0 END) AS emergency_hospitals,\n        SUM(CASE WHEN hospital_overall_rating IS NULL THEN 1 ELSE 0 END) AS missing_ratings\n    FROM hospitals\n    GROUP BY state\n) \nSELECT \n    state,\n    total_hospitals,\n    rated_hospitals,\n    ROUND(100.0 * rated_hospitals / total_hospitals, 2) AS rating_coverage_pct,\n    ROUND(1.0 * rated_hospitals / (rated_hospitals + 20), 3) AS sample_weight,\n    ROUND(\n        avg_rating * 1.0 * rated_hospitals / (rated_hospitals  + 20),\n        2) AS sample_adjusted_rating_score,\n    avg_rating\nFROM state_summary\nWHERE rated_hospitals > 0\nORDER BY sample_adjusted_rating_score DESC;",
      "caption": "Source excerpt: state rankings apply a sample-size adjustment. This score is an internal analysis aid, not an official CMS metric."
    },
    "preview": {
      "src": "./images/hospital-quality-overview.png",
      "alt": "Existing Power BI hospital quality overview screenshot",
      "caption": "Power BI Overview",
      "url": "https://aabelnegash.github.io/hospital-quality-analysis/#dashboard-screenshots"
    }
  }
];

export const sandbox = {
  "code": "    # ---------- ZIP / Phone / State formats ----------\n    for col, pattern in [\n        (\"zip_code\", r\"^\\d{5}$\"),\n        (\"phone_number\", r\"^\\d{10}$\"),\n        (\"state\", r\"^[A-Z]{2}$\"),\n    ]:\n        if col not in df.columns:\n            failures += 1\n            fail(lines, f\"Missing required column: {col}\")\n            continue\n\n        s = df[col].dropna()\n        bad = s[~s.str.match(pattern)]\n        if len(bad) == 0:\n            ok(lines, f\"{col} format valid (0 bad)\")\n        else:\n            failures += 1\n            fail(lines, f\"{col} format invalid: {len(bad)} examples={bad.head(10).tolist()}\")",
  "codeLabel": "Source excerpt · src/validate.py · lines 78–95",
  "codeSourceUrl": "https://github.com/aabelnegash/hospital-cleaning-project/blob/main/src/validate.py#L78-L95"
};
