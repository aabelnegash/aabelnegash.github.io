# Abel Negash · Data Analytics Portfolio

A lightweight portfolio built with Vite, vanilla JavaScript and Tailwind CSS. It links to the existing Hospital Data Cleaning and Hospital Quality Analysis project sites and repositories.

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

The production build goes into `dist/`. Vite uses `base: './'` so built assets have relative paths. Tailwind scans the source and includes the styles used by the site in production.

## Add future projects

Add an entry to `src/projects.js`. The interface renders the project catalog from this file. Keep project descriptions and metrics tied to the underlying project evidence, and include source links for new metrics.

The current figures come from the projects' recorded reports and README. They describe those datasets and validation results; they are not live pipeline measurements. The interactive sandbox is a browser simulation and does not execute Python or access hospital data.

## Publish to GitHub Pages

The source repository is `aabelnegash/aabelnegash.github.io`, with source on `main`. Configure GitHub Pages to **Deploy from a branch**, using **gh-pages** and **/ (root)**.

Commit and push source changes to `main` using your usual Git workflow, then run:

```sh
pnpm deploy
```

The deployment script verifies the repository and origin, builds the site, and publishes only `dist/` plus `.nojekyll` to `gh-pages`. It uses a temporary checkout, preserves the publishing branch's history, and pushes without forcing. An unchanged build creates no deployment commit. It does not commit or push source changes on `main`.

Git must already be authenticated with write access to this repository, and `git user.name` and `git user.email` must be configured. No tokens belong in this project. Publishing uses the standard GitHub Pages branch workflow and does not require a custom Actions workflow or repository secrets.

The portfolio is served at [aabelnegash.github.io](https://aabelnegash.github.io/). The two original project repositories remain separate.
