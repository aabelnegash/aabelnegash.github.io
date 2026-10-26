import { stat } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as catalog from '../src/projects.js';
import { normalizeProjects } from '../src/catalog.js';
import { metrics } from '../src/hospital-example.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = resolve(root, 'public');

function isSourceUrl(value) {
  if (typeof value !== 'string' || !/^https?:\/\//i.test(value.trim())) return false;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && !!url.hostname && !url.username && !url.password;
  } catch {
    return false;
  }
}

async function check() {
  const projects = normalizeProjects(catalog.projects);
  if (!projects.length) throw new Error('Add at least one project before publishing the portfolio.');
  let localImages = 0;
  for (const project of projects) {
    const source = project.preview?.src;
    if (!source || /^https?:\/\//i.test(source)) continue;
    let pathname;
    try {
      pathname = decodeURIComponent(source.split(/[?#]/, 1)[0]);
    } catch {
      throw new Error(`Project "${project.id}" preview.src has invalid URL encoding.`);
    }
    const asset = resolve(publicRoot, pathname);
    const withinPublic = relative(publicRoot, asset);
    if (withinPublic === '..' || withinPublic.startsWith(`..${sep}`) || isAbsolute(withinPublic)) {
      throw new Error(`Project "${project.id}" preview.src must point to an asset within public/.`);
    }
    let exists = false;
    try {
      exists = (await stat(asset)).isFile();
    } catch {
      // Report the catalog field and expected asset location below.
    }
    if (!exists) {
      throw new Error(`Project "${project.id}" preview image is missing: ${source}. Add the file under public/; for example ./images/example.png refers to public/images/example.png.`);
    }
    localImages += 1;
  }

  if (!Array.isArray(metrics)) throw new Error('metrics must be an array when supplied.');
  metrics.forEach((metric, index) => {
    const label = `Metric ${index + 1}`;
    if (!metric || typeof metric !== 'object' || Array.isArray(metric)) {
      throw new Error(`${label} must be an object.`);
    }
    const hasValue = typeof metric.value === 'number'
      ? Number.isFinite(metric.value)
      : typeof metric.value === 'string' && !!metric.value.trim();
    if (!hasValue) throw new Error(`${label} needs a nonempty value.`);
    if (typeof metric.label !== 'string' || !metric.label.trim()) {
      throw new Error(`${label} needs a nonempty label.`);
    }
    if (!isSourceUrl(metric.sourceUrl)) {
      throw new Error(`${label} needs an http(s) sourceUrl without embedded credentials.`);
    }
  });
  console.log(`Content check passed: ${projects.length} projects, ${metrics.length} sourced metrics, ${localImages} local preview images.`);
}

check().catch((error) => {
  console.error(`Portfolio content check failed: ${error.message}`);
  process.exitCode = 1;
});
