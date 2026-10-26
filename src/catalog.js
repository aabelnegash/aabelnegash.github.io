function record(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object.`);
  }
  return value;
}

function text(value, label, fallback) {
  if (value === undefined || value === null) {
    if (fallback !== undefined) return fallback;
    throw new TypeError(`${label} is required.`);
  }
  if (typeof value !== 'string' || !value.trim()) {
    throw new TypeError(`${label} must be a nonempty string.`);
  }
  return value.trim();
}

function optionalText(value, label, fallback = '') {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value !== 'string') throw new TypeError(`${label} must be a string.`);
  return value.trim() || fallback;
}

function httpUrl(value, label, optional = false) {
  if (optional && (value === undefined || value === null || value === '')) return '';
  const candidate = text(value, label);
  if (!/^https?:\/\//i.test(candidate)) {
    throw new TypeError(`${label} must be a complete http:// or https:// URL.`);
  }
  let url;
  try {
    url = new URL(candidate);
  } catch {
    throw new TypeError(`${label} must be a complete http:// or https:// URL.`);
  }
  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password) {
    throw new TypeError(`${label} must be an http(s) URL without embedded credentials.`);
  }
  return candidate;
}

function textList(value, label) {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw new TypeError(`${label} must be an array of strings.`);
  return value.map((item, index) => text(item, `${label}[${index}]`));
}

function dimension(value, label) {
  if (value === undefined || value === null) return undefined;
  if (!Number.isInteger(value) || value <= 0) {
    throw new TypeError(`${label} must be a positive integer when supplied.`);
  }
  return value;
}

function previewSource(value, label) {
  const source = text(value, label);
  if (/^[a-z][a-z\d+.-]*:/i.test(source)) return httpUrl(source, label);
  if (source.startsWith('/') || source.includes('\\')) {
    throw new TypeError(`${label} must use a relative asset path such as ./images/project.png.`);
  }
  const pathname = source.split(/[?#]/, 1)[0];
  if (!pathname || pathname.split('/').includes('..')) {
    throw new TypeError(`${label} must stay within the public asset directory.`);
  }
  return source;
}

function exampleLink(value, label) {
  const link = optionalText(value, label);
  if (!link) return '';
  if (/^[a-z][a-z\d+.-]*:/i.test(link)) return httpUrl(link, label);
  const pathname = link.split(/[?#]/, 1)[0];
  if (!pathname || link.startsWith('/') || link.includes('\\') || pathname.split('/').includes('..')) {
    throw new TypeError(`${label} must be an http(s) URL or a site-relative path such as ./examples/hospital-validation/.`);
  }
  return link;
}

// Check required project fields and fill optional values.
export function normalizeProjects(projects) {
  if (!Array.isArray(projects)) throw new TypeError('The project catalog must be an array.');
  const ids = new Set();

  return projects.map((value, index) => {
    const project = record(value, `Project ${index + 1}`);
    const id = text(project.id, `Project ${index + 1} id`);
    if (!/^[a-z\d]+(?:-[a-z\d]+)*$/.test(id)) {
      throw new TypeError(`Project id "${id}" must be a lowercase slug, such as hospital-quality-analysis.`);
    }
    if (ids.has(id)) throw new TypeError(`Duplicate project id "${id}". Give every project a unique id.`);
    ids.add(id);
    const label = `Project "${id}"`;
    const projectUrl = httpUrl(project.projectUrl, `${label} projectUrl`, true);
    const repositoryUrl = httpUrl(project.repositoryUrl, `${label} repositoryUrl`, true);
    if (!projectUrl && !repositoryUrl) {
      throw new TypeError(`${label} needs at least one projectUrl or repositoryUrl.`);
    }

    let code;
    if (project.code !== undefined && project.code !== null) {
      const source = record(project.code, `${label} code`);
      text(source.content, `${label} code.content`);
      code = {
        ...source,
        filename: text(source.filename, `${label} code.filename`),
        content: source.content,
        sourceUrl: httpUrl(source.sourceUrl, `${label} code.sourceUrl`),
        language: optionalText(source.language, `${label} code.language`, 'plaintext'),
        caption: optionalText(source.caption, `${label} code.caption`, 'Source excerpt'),
      };
    }

    let preview;
    if (project.preview !== undefined && project.preview !== null) {
      const image = record(project.preview, `${label} preview`);
      preview = {
        ...image,
        src: previewSource(image.src, `${label} preview.src`),
        alt: text(image.alt, `${label} preview.alt`),
        caption: optionalText(image.caption, `${label} preview.caption`),
        url: httpUrl(image.url, `${label} preview.url`, true),
        width: dimension(image.width, `${label} preview.width`),
        height: dimension(image.height, `${label} preview.height`),
      };
    }

    if (project.featured !== undefined && typeof project.featured !== 'boolean') {
      throw new TypeError(`${label} featured must be true or false.`);
    }

    return {
      ...project,
      id,
      title: text(project.title, `${label} title`),
      summary: text(project.summary, `${label} summary`),
      category: optionalText(project.category, `${label} category`, 'Other projects'),
      projectUrl,
      repositoryUrl,
      exampleUrl: exampleLink(project.exampleUrl, `${label} exampleUrl`),
      technologies: textList(project.technologies, `${label} technologies`),
      highlights: textList(project.highlights, `${label} highlights`),
      pipeline: textList(project.pipeline, `${label} pipeline`),
      code,
      preview,
      featured: project.featured ?? false,
      scopeNote: optionalText(project.scopeNote, `${label} scopeNote`),
    };
  });
}
