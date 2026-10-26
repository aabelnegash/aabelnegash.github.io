// Project catalog. Add or reorder entries without changing the page layout.
export const projects = [
  {
    "id": "auto-loan-credit-risk",
    "title": "Auto Loan Credit Risk",
    "category": "Predictive modeling",
    "featured": true,
    "summary": "SAS Viya credit-risk modeling and loan decisioning using synthetic data for the SAS Hackathon 2026 Student Track.",
    "technologies": [
      "SAS Viya",
      "Model Studio",
      "Intelligent Decisioning",
      "Python"
    ],
    "projectUrl": "https://aabelnegash.github.io/auto-loan-credit-risk/",
    "repositoryUrl": "https://github.com/aabelnegash/auto-loan-credit-risk",
    "highlights": [
      "Compared six model families; the selected logistic regression recorded a validation AUC of 0.7992 on 40,000 loans.",
      "Audited 100,000 scored applications for ID coverage, valid probabilities, and consistency with the saved decision rule.",
      "Evaluated approval policies and validated scoring outputs before accepted Kaggle submissions."
    ],
    "scopeNote": "The public repository contains documentation and aggregate results. The implementation remains private during the competition."
  },
  {
    "id": "hospital-quality-analysis",
    "title": "Hospital Quality Analysis",
    "category": "Data analysis",
    "summary": "SQL analysis of hospital ratings and CMS quality domains, with Excel reporting and a three-page Power BI dashboard.",
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
      "url": "https://aabelnegash.github.io/hospital-quality-analysis/#dashboard-screenshots",
      "width": 1951,
      "height": 1091
    },
    "featured": true
  },
  {
    "id": "hospital-data-cleaning",
    "title": "Hospital Data Cleaning",
    "category": "Data preparation",
    "pipeline": [
      "Profile",
      "Clean",
      "Validate",
      "Report"
    ],
    "summary": "A Python/pandas pipeline for profiling, cleaning, and validating CMS hospital data, with change reports and automated sample-data checks.",
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
    },
    "featured": true,
    "exampleUrl": "./examples/hospital-validation/"
  }
];
