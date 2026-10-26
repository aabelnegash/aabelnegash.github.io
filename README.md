# Abel Negash Portfolio

A portfolio built with Vite, vanilla JavaScript and Tailwind CSS. Project entries link to their case studies, reports, dashboards and source repositories. The homepage introduces the author and selected work; the project directory links to separate case studies and public repositories.

## Local development

Use Node.js 22.12 or newer and pnpm.

```sh
pnpm install
pnpm dev
```

```sh
pnpm build
pnpm preview
```

The production build goes into `dist/`. Vite uses `base: './'` so built assets have relative paths. Tailwind scans the source files and generates the utility styles used by the site.

## Site structure

- `/`: introduction, selected projects, background, and professional profiles.
- `/projects/`: the full project catalog and category filters.
- `/examples/hospital-validation/`: a project-specific code excerpt and recorded output.
- The hospital project sites remain separate at their existing addresses. The credit-risk project links to its public documentation repository.

Hospital metrics and examples are kept out of the homepage so unrelated future projects fit the same structure.

## Add a project

Add an object to the `projects` array in `src/projects.js`. A project does not need a code excerpt or screenshot. This is the minimum entry:

```js
{
  id: 'my-project',
  title: 'Project title',
  summary: 'Describe the data problem and the work completed.',
  repositoryUrl: 'https://github.com/aabelnegash/project-repository',
}
```

Give each entry a unique lowercase slug for `id`. Supply at least one complete `https://` or `http://` link in `projectUrl` or `repositoryUrl`. A project can link only to its report or case study, only to its repository, or to both.

Optional fields:

- `category`: a filter label, such as `Data cleaning`. The default is `Other projects`; category filters are generated from the catalog.
- `technologies`, `highlights`, `pipeline`: arrays of strings. They default to empty arrays.
- `code`: an object containing `filename`, `content`, and an http(s) `sourceUrl`. Optional `language` and `caption` describe the excerpt. Omit `code` for projects that do not need a code preview.
- `preview`: an image object with `src` and descriptive `alt` text. Optional fields are `caption`, an http(s) `url`, and positive integer `width` and `height` matching that image. For a local file in `public/images/`, use a path such as `./images/project.png`. No fixed image dimensions are required.
- `featured`: a boolean, defaulting to `false`. Set it to `true` to include the entry on the homepage. If no entries are featured, the homepage shows the first three projects. Keep the homepage selection short; the Projects page always lists the full catalog.
- `exampleUrl`: an optional http(s) link or site-root-relative path such as `./examples/hospital-validation/`. Internal paths are adjusted for each page’s depth.
- `scopeNote`: a short qualification or limitation, defaulting to an empty string.

`scripts/check-content.mjs` checks entries before the production build. It rejects duplicate or malformed IDs, missing required fields, unsafe link schemes, incomplete code or image entries, and missing local preview files. It also checks that any metric has a value, label and source URL. It does not verify the factual contents of linked sources; project descriptions and figures still need to agree with the underlying work.

## Project evidence

The hospital figures describe the projects' recorded datasets and reports. They are not live pipeline measurements or cumulative career statistics. Any output preview reproduces a saved report; it does not run Python or access hospital data. Keep that distinction clear when adding future demonstrations.

## Publish to GitHub Pages

The source repository is `aabelnegash/aabelnegash.github.io`, with source on `main`. GitHub Pages is configured to **Deploy from a branch**, using **gh-pages** and **/ (root)**.

Commit and push source changes to `main`, then run:

```sh
pnpm deploy
```

The deployment script checks the repository, origin, and project content, builds all three pages, and publishes the contents of `dist/` with `.nojekyll` to `gh-pages`. It uses a temporary checkout and preserves the publishing branch's history without a force push. An unchanged build creates no deployment commit. It does not commit or push source changes on `main`.

Git must be authenticated with write access to this repository. Configure `git user.name` and `git user.email` before deploying. Publication uses GitHub Pages' branch workflow and does not require a custom Actions workflow or repository secrets.

The portfolio is served at [aabelnegash.github.io](https://aabelnegash.github.io/).
