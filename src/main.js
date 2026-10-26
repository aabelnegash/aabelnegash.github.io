import './style.css';
import { projects as projectEntries } from './projects.js';
import { normalizeProjects } from './catalog.js';
import { metrics, sandbox } from './hospital-example.js';
import { initValidationExample } from './sandbox.js';

const projects = normalizeProjects(projectEntries);
const page = document.body.dataset.page || 'home';
const rootPath = document.body.dataset.root || './';
const events = new AbortController();

const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);

function publicPath(path) {
  if (/^https?:\/\//i.test(path)) return path;
  return rootPath + path.replace(/^\.\//, '');
}

function highlight(code, language = 'plaintext') {
  if (!['python', 'sql'].includes(language.toLowerCase())) return escapeHTML(code);
  const pattern = language.toLowerCase() === 'python'
    ? /(?<comment>#[^\n]*)|(?<string>(?:\b[rf])?(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'))|(?<keyword>\b(?:def|return|for|in|if|else|continue|import|from|as|not|and|or|True|False|None)\b)|(?<number>\b\d+(?:\.\d+)?\b)/g
    : /(?<comment>--[^\n]*)|(?<string>"(?:""|[^"\\])*"|'(?:''|[^'\\])*')|(?<keyword>\b(?:WITH|SELECT|FROM|AS|SUM|COUNT|CASE|WHEN|IS|NOT|NULL|THEN|ELSE|END|ROUND|AVG|CAST|REAL|GROUP|BY|WHERE|ORDER|DESC|ASC|HAVING|JOIN|ON|UNION|ALL)\b)|(?<number>\b\d+(?:\.\d+)?\b)/gi;
  let html = '';
  let offset = 0;
  for (const match of code.matchAll(pattern)) {
    html += escapeHTML(code.slice(offset, match.index));
    const type = Object.keys(match.groups).find((name) => match.groups[name] !== undefined);
    html += `<span class="token-${type}">${escapeHTML(match[0])}</span>`;
    offset = match.index + match[0].length;
  }
  return html + escapeHTML(code.slice(offset));
}

function projectLinks(project, compact) {
  const links = [];
  if (project.projectUrl) {
    links.push(`<a class="project-open" href="${escapeHTML(project.projectUrl)}" target="_blank" rel="noopener">Project details <span aria-hidden="true">↗</span></a>`);
  }
  if (project.repositoryUrl) {
    const label = project.projectUrl ? 'GitHub' : 'View repository';
    links.push(`<a class="${project.projectUrl ? '' : 'project-open'}" href="${escapeHTML(project.repositoryUrl)}" target="_blank" rel="noopener">${label} <span aria-hidden="true">↗</span></a>`);
  }
  if (project.exampleUrl && !compact) {
    const external = /^https?:\/\//i.test(project.exampleUrl) ? ' target="_blank" rel="noopener"' : '';
    links.push(`<a class="project-example" href="${escapeHTML(publicPath(project.exampleUrl))}"${external}>Validation example <span aria-hidden="true">↗</span></a>`);
  }
  return links.join('');
}

function previewImage(project) {
  if (!project.preview) return '';
  const image = project.preview;
  const dimensions = `${image.width ? ` width="${image.width}"` : ''}${image.height ? ` height="${image.height}"` : ''}`;
  const destination = image.url || project.projectUrl || project.repositoryUrl;
  return `<a class="project-preview" href="${escapeHTML(destination)}" target="_blank" rel="noopener" aria-label="View ${escapeHTML(project.title)} preview"><img src="${escapeHTML(publicPath(image.src))}" alt="${escapeHTML(image.alt)}"${dimensions} loading="lazy"/>${image.caption ? `<span>${escapeHTML(image.caption)} <span aria-hidden="true">↗</span></span>` : ''}</a>`;
}

function overview(project, compact) {
  const summary = `<p class="project-summary">${escapeHTML(project.summary)}</p>`;
  const scope = project.scopeNote ? `<p class="project-scope">${escapeHTML(project.scopeNote)}</p>` : '';
  if (compact) return summary + scope;
  const pipeline = project.pipeline.length ? `<div class="pipeline-path" aria-label="Project pipeline steps">${project.pipeline.map((step) => `<span>${escapeHTML(step)}</span>`).join('<i aria-hidden="true">→</i>')}</div>` : '';
  const highlights = project.highlights.length ? `<ul class="project-highlights">${project.highlights.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul>` : '';
  return summary + scope + pipeline + highlights + previewImage(project);
}

function projectCard(project, compact = false) {
  const hasCode = !compact && !!project.code;
  const technologies = project.technologies.length ? `<ul class="technology-tags" aria-label="Tools used">${project.technologies.map((technology) => `<li>${escapeHTML(technology)}</li>`).join('')}</ul>` : '';
  const tabs = hasCode ? `<div class="project-tabs" role="tablist" aria-label="${escapeHTML(project.title)} views"><button type="button" role="tab" id="${project.id}-overview-tab" aria-controls="${project.id}-overview" aria-selected="true" tabindex="0">Overview</button><button type="button" role="tab" id="${project.id}-code-tab" aria-controls="${project.id}-code" aria-selected="false" tabindex="-1">Code preview <span aria-hidden="true">&lt;/&gt;</span></button></div>` : '';
  const panelAttributes = hasCode ? ` role="tabpanel" id="${project.id}-overview" aria-labelledby="${project.id}-overview-tab" tabindex="0"` : '';
  const code = hasCode ? `<div class="project-panel code-panel" role="tabpanel" id="${project.id}-code" aria-labelledby="${project.id}-code-tab" tabindex="0" hidden><div class="code-filename"><span>${escapeHTML(project.code.filename)}</span><a href="${escapeHTML(project.code.sourceUrl)}" target="_blank" rel="noopener">View source <span aria-hidden="true">↗</span></a></div><pre class="card-code code-scroller" tabindex="0"><code>${highlight(project.code.content, project.code.language)}</code></pre><p class="code-caption">${escapeHTML(project.code.caption)}</p></div>` : '';
  return `<article class="project-card ${compact ? 'project-card--compact' : 'project-card--detailed'}" data-category="${escapeHTML(project.category)}" aria-labelledby="${project.id}-title"><div class="project-card-header"><p class="project-label">${escapeHTML(project.category)}</p><h3 id="${project.id}-title">${escapeHTML(project.title)}</h3>${technologies}</div><div class="project-card-content">${tabs}<div class="project-panel"${panelAttributes}>${overview(project, compact)}</div>${code}<div class="project-card-footer">${projectLinks(project, compact)}</div></div></article>`;
}

function activateTab(tab, moveFocus = false) {
  const tablist = tab.closest('[role="tablist"]');
  for (const item of tablist.querySelectorAll('[role="tab"]')) {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  }
  if (moveFocus) tab.focus();
}

function bindTabs() {
  for (const tablist of document.querySelectorAll('[role="tablist"]')) {
    tablist.addEventListener('click', (event) => {
      const tab = event.target.closest('[role="tab"]');
      if (tab) activateTab(tab);
    }, { signal: events.signal });
    tablist.addEventListener('keydown', (event) => {
      const tabs = [...tablist.querySelectorAll('[role="tab"]')];
      const index = tabs.indexOf(document.activeElement);
      if (index < 0) return;
      const destinations = { ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 };
      if (Object.hasOwn(destinations, event.key)) {
        event.preventDefault();
        activateTab(tabs[destinations[event.key]], true);
      }
    }, { signal: events.signal });
  }
}

function renderHome() {
  const container = document.querySelector('#featured-projects');
  if (!container) return;
  const featured = projects.filter((project) => project.featured);
  container.innerHTML = (featured.length ? featured : projects.slice(0, 3)).map((project) => projectCard(project, true)).join('');
}

function renderProjects() {
  const grid = document.querySelector('#project-grid');
  const filter = document.querySelector('.project-filter');
  const count = document.querySelector('#project-count');
  if (!grid || !filter || !count) return;
  grid.innerHTML = projects.map((project) => projectCard(project)).join('');
  const updateCount = (number) => { count.textContent = `${number} ${number === 1 ? 'project' : 'projects'}`; };
  count.setAttribute('role', 'status');
  count.setAttribute('aria-live', 'polite');
  updateCount(projects.length);
  const categories = [...new Set(projects.map((project) => project.category))];
  const filters = [{ value: 'all', label: 'All projects' }, ...categories.map((category) => ({ value: category, label: category }))];
  filter.innerHTML = filters.map((item, index) => `<button type="button" data-filter="${escapeHTML(item.value)}" aria-pressed="${index === 0}">${escapeHTML(item.label)}</button>`).join('');
  const buttons = [...filter.querySelectorAll('[data-filter]')];
  for (const button of buttons) {
    button.addEventListener('click', () => {
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      let visibleCount = 0;
      for (const card of grid.querySelectorAll('.project-card')) {
        card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
        if (!card.hidden) visibleCount += 1;
      }
      updateCount(visibleCount);
    }, { signal: events.signal });
  }
  bindTabs();
}

function renderValidation() {
  const grid = document.querySelector('#metric-grid');
  const code = document.querySelector('#sandbox-code');
  if (grid) {
    grid.innerHTML = metrics.map((metric) => `<div class="metric-tile"><p class="metric-value">${escapeHTML(metric.value)}</p><h3>${escapeHTML(metric.label)}</h3><a href="${escapeHTML(metric.sourceUrl)}" target="_blank" rel="noopener">${escapeHTML(metric.detail)} <span aria-hidden="true">↗</span></a></div>`).join('');
  }
  if (code) code.innerHTML = highlight(sandbox.code, 'python');
  return initValidationExample();
}

let disposeExample;
if (page === 'home') renderHome();
else if (page === 'projects') renderProjects();
else if (page === 'validation') disposeExample = renderValidation();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    events.abort();
    disposeExample?.();
  });
}
