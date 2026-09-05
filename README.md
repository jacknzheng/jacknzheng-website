# Jack Neo Zheng

Personal website at https://jacknzheng.com, built with React, TypeScript, and TanStack Start.

## Run locally

Use Node.js 22.

```bash
npm ci
npm run dev
```

Open http://localhost:3000.

## Build and check

```bash
npx tsc --noEmit
npm run build
```

The build generates finished HTML pages in `dist/client`, including the homepage, category pages, About page, and linked articles. TanStack follows internal links during the build, so new articles linked from the site are included automatically. GitHub Pages serves this folder; it cannot run the application server in `dist/server`.

To preview the static files locally:

```bash
python3 -m http.server 3000 --directory dist/client
```

## Publishing to GitHub Pages

In the repository's **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**. Keep the custom domain set to `jacknzheng.com`. This is a one-time setup.

The workflow in `.github/workflows/deploy.yml` runs whenever changes are pushed to `main`. It installs the locked dependency versions, checks TypeScript, builds the static pages, and publishes `dist/client`. It also copies the root `CNAME` file into the published files to preserve the domain.

To publish an update:

1. Edit the site and check it locally.
2. Commit the changes and push them to `main`.
3. Open the repository's **Actions** tab and wait for **Deploy website to GitHub Pages** to finish successfully.
4. Visit https://jacknzheng.com.

You can also rerun deployment from **Actions → Deploy website to GitHub Pages → Run workflow**.

Do not switch Pages back to publishing the root of a branch: that publishes the README instead of the built website.

## Content

- `src/data/writings.ts`: article titles, categories, images, and excerpts.
- `src/routes/`: homepage, category pages, About page, and article layout.
- `src/styles.css`: site styling.
- `public/`: images and fonts copied into the build.

This deployment serves static files. Features that require a running server, such as server functions or server API endpoints, need a different hosting setup.
