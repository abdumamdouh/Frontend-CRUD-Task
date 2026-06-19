# Setup Guide

This file explains how to run, test, build, and preview the UAE Services Directory project locally.

## Requirements

Use Node.js 20.

The project includes an `.nvmrc` file:

```bash
nvm use
```

If Node 20 is not installed:

```bash
nvm install 20
nvm use
```

## Install Dependencies

```bash
npm install
```

## Run The Development Server

```bash
npm run dev
```

Vite will print a local URL, usually:

```txt
http://localhost:3000
```

The Vite config uses `strictPort`, so stop the other process if port `3000` is busy.

## Build For Production

```bash
npm run build
```

The build command runs TypeScript first, then creates the production build with Vite:

```txt
tsc -b && node scripts/build.mjs
```

The generated production files are written to:

```txt
build/static/
```

## Preview The Production Build

After building:

```bash
npm run preview
```

This serves the built output locally.

## Run Tests

Run tests once:

```bash
npm test -- --run
```

Run tests in watch mode:

```bash
npm test
```

Run the Vitest UI:

```bash
npm run test:ui
```

Run coverage:

```bash
npm run test:coverage
```

## Lint

```bash
npm run lint
```

## Format

```bash
npm run format
```

Check formatting without writing files:

```bash
npm run format:check
```

The project uses an explicit Prettier config in `.prettierrc`, plus `.editorconfig` and workspace VS Code settings. This keeps editor format-on-save aligned with the CLI formatter.

## Available Scripts

```json
{
  "dev": "vite",
  "build": "tsc -b && node scripts/build.mjs",
  "preview": "vite preview",
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage",
  "lint": "eslint .",
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

## Environment Variables

No environment variables are required.

The app uses local seed data, a fake Promise-based API layer, and localStorage.

## Data Reset

The app stores service changes in localStorage. If you want to restore the initial data from the UI, use:

```txt
Reset data
```

This restores the original 50 services and clears local CRUD/favorite changes.

You can also clear the browser storage manually during development.

The services page also stores the latest search, filters, sort, and page in localStorage so that navigating away and returning to Services keeps the browsing context. The URL query string still takes priority when route params are present.

## Vercel Deployment

The project includes:

```txt
vercel.json
```

It contains a React Router fallback rewrite:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

Before deploying, run:

```bash
npm run build
```

## Notes

- The app uses React Router, so direct route refreshes need the Vercel rewrite in production.
- The fake API intentionally uses a small delay to make loading and feedback states visible.
- The app is frontend-only. There is no backend, authentication, or external API dependency.
