import './style.css';
import { metrics, projects, sandbox } from './projects.js';
import { initSandbox } from './sandbox.js';

const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

function highlight(code) {
  const tokens = /(?<comment>#[^\n]*|--[^\n]*)|(?<string>(?:\b[rf])?(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'))|(?<keyword>\b(?:def|return|for|in|if|else|continue|import|from|as|WITH|SELECT|FROM|AS|SUM|COUNT|CASE|WHEN|IS|NOT|NULL|THEN|ELSE|END|ROUND|AVG|CAST|REAL|GROUP|BY|WHERE|ORDER|DESC)\b)|(?<number>\b\d+(?:\.\d+)?\b)/g;
  let result = '';
  let position = 0;
  for (const match of code.matchAll(tokens)) {
    result += escapeHTML(code.slice(position, match.index));
    const type = Object.keys(match.groups).find((name) => match.groups[name] !== undefined);
    result += `<span class="token-${type}">${escapeHTML(match[0])}</span>`;
    position = match.index + match[0].length;
  }
  return result + escapeHTML(code.slice(position));
}

const icons = [
  '<path d="M4 6c0-4 16-4 16 0s-16 4-16 0Zm0 0v6c0 4 16 4 16 0V6M4 12v6c0 4 16 4 16 0v-6"/>',
  '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
  '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11M15 9v11"/>',
  '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
];

document.querySelector('#metric-grid').innerHTML = metrics.map((metric, index) => `
  <div class="metric-tile ${index === 3 ? 'metric-success' : ''}">
    <div class="metric-topline"><span>${String(index + 1).padStart(2, '0')}</span><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">${icons[index]}</svg></div>
    <p class="metric-value ${index === 2 ? 'metric-schema' : ''}">${escapeHTML(metric.value)}</p>
    <h3>${escapeHTML(metric.label)}</h3>
    <a href="${escapeHTML(metric.sourceUrl)}" target="_blank" rel="noopener">${escapeHTML(metric.detail)} <span aria-hidden="true">↗</span></a>
  </div>`).join('');

function projectOverview(project) {
  const summary = `<p class="project-summary">${escapeHTML(project.summary)}</p>`;
  if (project.preview) return `${summary}
    <a class="project-preview" href="${escapeHTML(project.preview.url || project.projectUrl)}" target="_blank" rel="noopener" aria-label="View ${escapeHTML(project.title)} preview"><img src="${escapeHTML(project.preview.src)}" alt="${escapeHTML(project.preview.alt)}" width="1952" height="1098" loading="lazy"/><span>${escapeHTML(project.preview.caption || 'Project preview')} <span aria-hidden="true">↗</span></span></a>`;
  const pipeline = project.pipeline ? `<div class="pipeline-path" aria-label="Project pipeline steps">${project.pipeline.map((step) => `<span>${escapeHTML(step)}</span>`).join('<i aria-hidden="true">→</i>')}</div>` : '';
  return `${summary}${pipeline}<ul class="project-highlights">${project.highlights.slice(0, 3).map((highlight) => `<li>${escapeHTML(highlight)}</li>`).join('')}</ul>`;
}

document.querySelector('#project-grid').innerHTML = projects.map((project, index) => `
  <article class="project-card bg-slate-900" data-category="${escapeHTML(project.category)}" aria-labelledby="${project.id}-title">
    <div class="project-card-header"><div class="project-label"><span class="project-number">${String(index + 1).padStart(2, '0')}</span>${escapeHTML(project.category)}</div><h3 id="${project.id}-title">${escapeHTML(project.title)}</h3><ul class="technology-tags" aria-label="Tools used">${project.technologies.map((tech) => `<li>${escapeHTML(tech)}</li>`).join('')}</ul></div>
    <div class="project-tabs" role="tablist" aria-label="${escapeHTML(project.title)} views"><button type="button" role="tab" id="${project.id}-overview-tab" aria-controls="${project.id}-overview" aria-selected="true" tabindex="0">Overview</button><button type="button" role="tab" id="${project.id}-code-tab" aria-controls="${project.id}-code" aria-selected="false" tabindex="-1">Code preview <span aria-hidden="true">&lt;/&gt;</span></button></div>
    <div class="project-panel" role="tabpanel" id="${project.id}-overview" aria-labelledby="${project.id}-overview-tab" tabindex="0">${projectOverview(project, index)}</div>
    <div class="project-panel code-panel" role="tabpanel" id="${project.id}-code" aria-labelledby="${project.id}-code-tab" tabindex="0" hidden><div class="code-filename"><span>${escapeHTML(project.code.filename)}</span><a href="${escapeHTML(project.code.sourceUrl)}" target="_blank" rel="noopener">View source <span aria-hidden="true">↗</span></a></div><pre class="card-code code-scroller" tabindex="0"><code>${highlight(project.code.content)}</code></pre><p class="code-caption">${escapeHTML(project.code.caption)}</p></div>
    <div class="project-card-footer"><a class="project-open" href="${escapeHTML(project.projectUrl)}" target="_blank" rel="noopener">Explore project <span aria-hidden="true">↗</span></a><a href="${escapeHTML(project.repositoryUrl)}" target="_blank" rel="noopener">GitHub <span aria-hidden="true">↗</span></a></div>
  </article>`).join('');

function activateTab(tab, moveFocus = false) {
  const tablist = tab.closest('[role="tablist"]');
  for (const item of tablist.querySelectorAll('[role="tab"]')) {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
  }
  if (moveFocus) tab.focus();
}

for (const tablist of document.querySelectorAll('[role="tablist"]')) {
  tablist.addEventListener('click', (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (tab) activateTab(tab);
  });
  tablist.addEventListener('keydown', (event) => {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const index = tabs.indexOf(document.activeElement);
    if (index < 0) return;
    const destinations = { ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 };
    if (Object.hasOwn(destinations, event.key)) {
      event.preventDefault();
      activateTab(tabs[destinations[event.key]], true);
    }
  });
}

const filters = [{ value: 'all', label: 'All projects' }, ...[...new Set(projects.map((project) => project.category))].map((category) => ({ value: category, label: category }))];
document.querySelector('.project-filter').innerHTML = filters.map((filter, index) => `<button type="button" data-filter="${escapeHTML(filter.value)}" aria-pressed="${index === 0}">${escapeHTML(filter.label)}${index === 0 ? `<span id="all-project-count">${String(projects.length).padStart(2, '0')}</span>` : ''}</button>`).join('');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
for (const button of filterButtons) {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    for (const card of document.querySelectorAll('.project-card')) {
      const visible = button.dataset.filter === 'all' || card.dataset.category === button.dataset.filter;
      card.hidden = !visible;
      if (visible) count += 1;
    }
    document.querySelector('#project-count').textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
  });
}

document.querySelector('#all-project-count').textContent = String(projects.length).padStart(2, '0');
document.querySelector('#project-count').textContent = `${projects.length} projects`;
document.querySelector('#sandbox-code').innerHTML = highlight(sandbox.code);
const disposeSandbox = initSandbox();
if (import.meta.hot) import.meta.hot.dispose(disposeSandbox);
