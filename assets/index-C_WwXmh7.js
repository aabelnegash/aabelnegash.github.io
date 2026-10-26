(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[{value:`4,812`,label:`Hospitals in dataset`,detail:`Recorded cleaned hospital dataset`,sourceUrl:`https://github.com/aabelnegash/hospital-cleaning-project/blob/main/reports/change_report.txt#L5-L6`},{value:`3,567`,label:`Hospitals with ratings`,detail:`Overall ratings available`,sourceUrl:`https://github.com/aabelnegash/hospital-quality-analysis/blob/main/README.md#L209-L211`},{value:`28 → 20`,label:`Columns, raw → clean`,detail:`Eight footnote columns removed`,sourceUrl:`https://github.com/aabelnegash/hospital-cleaning-project/blob/main/reports/change_report.txt#L5-L10`},{value:`0`,label:`Reported validation failures`,detail:`Recorded validation report`,sourceUrl:`https://github.com/aabelnegash/hospital-cleaning-project/blob/main/reports/validation_report.txt#L1-L26`}],t=[{id:`hospital-data-cleaning`,title:`Hospital Data Cleaning`,category:`Data cleaning`,pipeline:[`Profile`,`Clean`,`Validate`,`Report`],summary:`A reproducible Python/pandas pipeline for the CMS Hospital General Information dataset. Profiles raw data, standardizes selected fields, enforces a consistent output schema, and writes validation and change reports.`,technologies:[`Python`,`pandas`,`GitHub Actions`],projectUrl:`https://aabelnegash.github.io/hospital-cleaning-project/`,repositoryUrl:`https://github.com/aabelnegash/hospital-cleaning-project`,highlights:[`Profiles missing values, duplicates and data types`,`Standardizes state, ZIP code and phone fields`,`Removes footnote columns and applies a fixed 20-column output schema`,`Writes validation reports; sample-data validation runs in GitHub Actions`],code:{language:`python`,filename:`src/clean.py`,sourceUrl:`https://github.com/aabelnegash/hospital-cleaning-project/blob/main/src/clean.py#L18-L34`,sourceLines:[18,34],content:`def standardize_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = (
        df.columns.str.strip()
        .str.lower()
        .str.replace(r"\\s+", "_", regex=True)
        .str.replace(r"[^a-z0-9_]", "", regex=True)
    )
    return df

def clean_state(s: pd.Series) -> pd.Series:
    return s.astype("string").str.strip().str.upper()

def clean_zip(s: pd.Series) -> pd.Series:
    s = s.astype("string").str.strip().str.replace(r"[^0-9]", "", regex=True)
    s = s.str.slice(0, 5)
    return s`,caption:`Source excerpt: column names, state values and ZIP codes are standardized.`}},{id:`hospital-quality-analysis`,title:`Hospital Quality Analysis`,category:`Analysis & reporting`,summary:`An analysis of cleaned CMS hospital data using SQLite, SQL, Excel and Power BI. Compares rating coverage, sample-adjusted rankings and national quality domains across states, ownership types and hospital types.`,technologies:[`SQL`,`SQLite`,`Python`,`Excel`,`Power BI`],projectUrl:`https://aabelnegash.github.io/hospital-quality-analysis/`,repositoryUrl:`https://github.com/aabelnegash/hospital-quality-analysis`,highlights:[`Loads the cleaned hospital CSV into SQLite`,`Examines ratings across state, ownership and hospital-type groups`,`Compares seven CMS national quality domains and their missingness`,`Exports SQL summaries for Excel reporting and interactive Power BI dashboards`],code:{language:`sql`,filename:`sql/04_state_analysis.sql`,sourceUrl:`https://github.com/aabelnegash/hospital-quality-analysis/blob/main/sql/04_state_analysis.sql#L25-L49`,sourceLines:[25,49],content:`-- Rank states by rating strength while penalizing small rated sample sizes.
WITH state_summary AS(
    SELECT
        state,
        COUNT(*) AS total_hospitals,
        SUM(CASE WHEN hospital_overall_rating IS NOT NULL THEN 1 ELSE 0 END) AS rated_hospitals,
        ROUND(AVG(CAST(hospital_overall_rating AS REAL)), 2) AS avg_rating,
        SUM(CASE WHEN emergency_services = 'Yes' THEN 1 ELSE 0 END) AS emergency_hospitals,
        SUM(CASE WHEN hospital_overall_rating IS NULL THEN 1 ELSE 0 END) AS missing_ratings
    FROM hospitals
    GROUP BY state
) 
SELECT 
    state,
    total_hospitals,
    rated_hospitals,
    ROUND(100.0 * rated_hospitals / total_hospitals, 2) AS rating_coverage_pct,
    ROUND(1.0 * rated_hospitals / (rated_hospitals + 20), 3) AS sample_weight,
    ROUND(
        avg_rating * 1.0 * rated_hospitals / (rated_hospitals  + 20),
        2) AS sample_adjusted_rating_score,
    avg_rating
FROM state_summary
WHERE rated_hospitals > 0
ORDER BY sample_adjusted_rating_score DESC;`,caption:`Source excerpt: state rankings apply a sample-size adjustment. This score is an internal analysis aid, not an official CMS metric.`},preview:{src:`./images/hospital-quality-overview.png`,alt:`Existing Power BI hospital quality overview screenshot`,caption:`Power BI Overview`,url:`https://aabelnegash.github.io/hospital-quality-analysis/#dashboard-screenshots`}}],n={code:`    # ---------- ZIP / Phone / State formats ----------
    for col, pattern in [
        ("zip_code", r"^\\d{5}$"),
        ("phone_number", r"^\\d{10}$"),
        ("state", r"^[A-Z]{2}$"),
    ]:
        if col not in df.columns:
            failures += 1
            fail(lines, f"Missing required column: {col}")
            continue

        s = df[col].dropna()
        bad = s[~s.str.match(pattern)]
        if len(bad) == 0:
            ok(lines, f"{col} format valid (0 bad)")
        else:
            failures += 1
            fail(lines, f"{col} format invalid: {len(bad)} examples={bad.head(10).tolist()}")`,codeLabel:`Source excerpt · src/validate.py · lines 78–95`,codeSourceUrl:`https://github.com/aabelnegash/hospital-cleaning-project/blob/main/src/validate.py#L78-L95`},r=Object.freeze({mode:`simulation`,status:`success`,rows:4812,columns:20,validation_failures:0}),i=new WeakMap;function a(){let e=document.getElementById(`sandbox-console`),t=document.getElementById(`run-pipeline`),n=document.getElementById(`run-label`),a=document.getElementById(`pipeline-spinner`),o=document.getElementById(`reset-pipeline`),s=document.getElementById(`pipeline-status`),c=document.getElementById(`pipeline-output`),l=document.getElementById(`terminal-status`);if(!e||!t||!n||!a||!o||!s||!c||!l)throw Error(`The pipeline simulation is missing a required element.`);if(i.has(e))return i.get(e);let u=c.textContent,d=null,f=0;function p(){f+=1,d!==null&&(window.clearTimeout(d),d=null)}function m(){p(),t.disabled=!1,o.disabled=!0,a.hidden=!0,n.textContent=`Run Pipeline`,s.textContent=`Ready to simulate`,l.textContent=`IDLE`,c.textContent=u,c.dataset.state=`idle`,e.setAttribute(`aria-busy`,`false`)}function h(){if(d!==null)return;p();let i=f;t.disabled=!0,o.disabled=!1,a.hidden=!1,n.textContent=`Validating schemas…`,s.textContent=`Simulation running · no Python is executed`,l.textContent=`SIMULATING`,c.dataset.state=`running`,c.textContent=`> Simulation started
> Validating schemas…
> Checking the recorded report values…
> No Python is executed in this preview.`,e.setAttribute(`aria-busy`,`true`),d=window.setTimeout(()=>{i===f&&(d=null,c.textContent=JSON.stringify(r,null,2),c.dataset.state=`success`,n.textContent=`Run again`,t.disabled=!1,a.hidden=!0,s.textContent=`Simulation complete · recorded report values`,l.textContent=`SUCCESS`,e.setAttribute(`aria-busy`,`false`))},1400)}function g(){p(),t.removeEventListener(`click`,h),o.removeEventListener(`click`,m),i.delete(e)}return t.addEventListener(`click`,h),o.addEventListener(`click`,m),i.set(e,g),m(),g}var o=e=>String(e).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e]);function s(e){let t=/(?<comment>#[^\n]*|--[^\n]*)|(?<string>(?:\b[rf])?(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'))|(?<keyword>\b(?:def|return|for|in|if|else|continue|import|from|as|WITH|SELECT|FROM|AS|SUM|COUNT|CASE|WHEN|IS|NOT|NULL|THEN|ELSE|END|ROUND|AVG|CAST|REAL|GROUP|BY|WHERE|ORDER|DESC)\b)|(?<number>\b\d+(?:\.\d+)?\b)/g,n=``,r=0;for(let i of e.matchAll(t)){n+=o(e.slice(r,i.index));let t=Object.keys(i.groups).find(e=>i.groups[e]!==void 0);n+=`<span class="token-${t}">${o(i[0])}</span>`,r=i.index+i[0].length}return n+o(e.slice(r))}var c=[`<path d="M4 6c0-4 16-4 16 0s-16 4-16 0Zm0 0v6c0 4 16 4 16 0V6M4 12v6c0 4 16 4 16 0v-6"/>`,`<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>`,`<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11M15 9v11"/>`,`<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>`];document.querySelector(`#metric-grid`).innerHTML=e.map((e,t)=>`
  <div class="metric-tile ${t===3?`metric-success`:``}">
    <div class="metric-topline"><span>${String(t+1).padStart(2,`0`)}</span><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">${c[t]}</svg></div>
    <p class="metric-value ${t===2?`metric-schema`:``}">${o(e.value)}</p>
    <h3>${o(e.label)}</h3>
    <a href="${o(e.sourceUrl)}" target="_blank" rel="noopener">${o(e.detail)} <span aria-hidden="true">↗</span></a>
  </div>`).join(``);function l(e){let t=`<p class="project-summary">${o(e.summary)}</p>`;return e.preview?`${t}
    <a class="project-preview" href="${o(e.preview.url||e.projectUrl)}" target="_blank" rel="noopener" aria-label="View ${o(e.title)} preview"><img src="${o(e.preview.src)}" alt="${o(e.preview.alt)}" width="1952" height="1098" loading="lazy"/><span>${o(e.preview.caption||`Project preview`)} <span aria-hidden="true">↗</span></span></a>`:`${t}${e.pipeline?`<div class="pipeline-path" aria-label="Project pipeline steps">${e.pipeline.map(e=>`<span>${o(e)}</span>`).join(`<i aria-hidden="true">→</i>`)}</div>`:``}<ul class="project-highlights">${e.highlights.slice(0,3).map(e=>`<li>${o(e)}</li>`).join(``)}</ul>`}document.querySelector(`#project-grid`).innerHTML=t.map((e,t)=>`
  <article class="project-card bg-slate-900" data-category="${o(e.category)}" aria-labelledby="${e.id}-title">
    <div class="project-card-header"><div class="project-label"><span class="project-number">${String(t+1).padStart(2,`0`)}</span>${o(e.category)}</div><h3 id="${e.id}-title">${o(e.title)}</h3><ul class="technology-tags" aria-label="Tools used">${e.technologies.map(e=>`<li>${o(e)}</li>`).join(``)}</ul></div>
    <div class="project-tabs" role="tablist" aria-label="${o(e.title)} views"><button type="button" role="tab" id="${e.id}-overview-tab" aria-controls="${e.id}-overview" aria-selected="true" tabindex="0">Overview</button><button type="button" role="tab" id="${e.id}-code-tab" aria-controls="${e.id}-code" aria-selected="false" tabindex="-1">Code preview <span aria-hidden="true">&lt;/&gt;</span></button></div>
    <div class="project-panel" role="tabpanel" id="${e.id}-overview" aria-labelledby="${e.id}-overview-tab" tabindex="0">${l(e,t)}</div>
    <div class="project-panel code-panel" role="tabpanel" id="${e.id}-code" aria-labelledby="${e.id}-code-tab" tabindex="0" hidden><div class="code-filename"><span>${o(e.code.filename)}</span><a href="${o(e.code.sourceUrl)}" target="_blank" rel="noopener">View source <span aria-hidden="true">↗</span></a></div><pre class="card-code code-scroller" tabindex="0"><code>${s(e.code.content)}</code></pre><p class="code-caption">${o(e.code.caption)}</p></div>
    <div class="project-card-footer"><a class="project-open" href="${o(e.projectUrl)}" target="_blank" rel="noopener">Explore project <span aria-hidden="true">↗</span></a><a href="${o(e.repositoryUrl)}" target="_blank" rel="noopener">GitHub <span aria-hidden="true">↗</span></a></div>
  </article>`).join(``);function u(e,t=!1){let n=e.closest(`[role="tablist"]`);for(let t of n.querySelectorAll(`[role="tab"]`)){let n=t===e;t.setAttribute(`aria-selected`,String(n)),t.tabIndex=n?0:-1,document.getElementById(t.getAttribute(`aria-controls`)).hidden=!n}t&&e.focus()}for(let e of document.querySelectorAll(`[role="tablist"]`))e.addEventListener(`click`,e=>{let t=e.target.closest(`[role="tab"]`);t&&u(t)}),e.addEventListener(`keydown`,t=>{let n=[...e.querySelectorAll(`[role="tab"]`)],r=n.indexOf(document.activeElement);if(r<0)return;let i={ArrowRight:(r+1)%n.length,ArrowLeft:(r-1+n.length)%n.length,Home:0,End:n.length-1};Object.hasOwn(i,t.key)&&(t.preventDefault(),u(n[i[t.key]],!0))});var d=[{value:`all`,label:`All projects`},...[...new Set(t.map(e=>e.category))].map(e=>({value:e,label:e}))];document.querySelector(`.project-filter`).innerHTML=d.map((e,n)=>`<button type="button" data-filter="${o(e.value)}" aria-pressed="${n===0}">${o(e.label)}${n===0?`<span id="all-project-count">${String(t.length).padStart(2,`0`)}</span>`:``}</button>`).join(``);var f=[...document.querySelectorAll(`[data-filter]`)];for(let e of f)e.addEventListener(`click`,()=>{f.forEach(t=>t.setAttribute(`aria-pressed`,String(t===e)));let t=0;for(let n of document.querySelectorAll(`.project-card`)){let r=e.dataset.filter===`all`||n.dataset.category===e.dataset.filter;n.hidden=!r,r&&(t+=1)}document.querySelector(`#project-count`).textContent=`${t} ${t===1?`project`:`projects`}`});document.querySelector(`#all-project-count`).textContent=String(t.length).padStart(2,`0`),document.querySelector(`#project-count`).textContent=`${t.length} projects`,document.querySelector(`#sandbox-code`).innerHTML=s(n.code),a();