# Abel Negash Portfolio

Personal portfolio for data analysis, modeling, and programming projects.

Website: [aabelnegash.github.io](https://aabelnegash.github.io/)

**Tools:** JavaScript, Vite, Tailwind CSS, and GitHub Pages.

## Goal

- Organize completed and ongoing projects in one place
- Link project reports, dashboards, and public repositories
- Add projects using the existing page layout

## Project structure

- `index.html` — homepage with selected projects and contact links
- `projects/index.html` — project directory with category filters and code previews
- `examples/hospital-validation/index.html` — hospital validation example
- `src/`
  - `projects.js` — project descriptions, tools, and links
  - `main.js` — renders project cards, filters, and code previews
  - `catalog.js` — checks project entries and fills optional fields
  - `style.css` — page styles and responsive layouts
  - `hospital-example.js` — recorded hospital metrics and a Python source excerpt
  - `sandbox.js` — displays saved validation report values
- `public/images/` — dashboard preview images
- `scripts/`
  - `check-content.mjs` — checks project fields and local image paths before building
  - `deploy.mjs` — builds the site and publishes it to the `gh-pages` branch
- `vite.config.js` — build configuration for the three pages
- `postcss.config.mjs` — Tailwind CSS and Autoprefixer configuration

## Setup

Use Node.js 22.12 or newer and pnpm.

```bash
pnpm install
```

## Run locally

```bash
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview
```

The build writes the site to `dist/`. Project entries and image paths are checked before the build runs.

## Add a project

Add an entry to `src/projects.js` using the existing projects as examples.

- Use a unique `id` and include `title`, `summary`, and at least one `projectUrl` or `repositoryUrl`
- Set `featured: true` to include the project on the homepage
- Use `category` for the project filter and `technologies` for the tool list
- Add code excerpts, screenshots, or a scope note when needed
- Store local preview images in `public/images/`

The homepage and project-directory HTML files also contain fallback links for browsers with JavaScript disabled. Update those links when adding a project.

## Publish

Commit and push source changes to `main`, then run:

```bash
pnpm deploy
```

The script builds the site and pushes the output to `gh-pages`. GitHub Pages is configured to publish that branch from `/ (root)`. Git needs write access to the repository, with `user.name` and `user.email` configured.

## Notes

- Each project has a separate site and public repository
- The credit-risk repository contains documentation and aggregate results while the hackathon implementation remains private
- The hospital validation example displays saved report values; it does not run Python or revalidate the dataset
- Build output and installed dependencies are not tracked in `main`
