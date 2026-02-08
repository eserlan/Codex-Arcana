# Implementation Plan: Staging Environment

## 1. SvelteKit Configuration

- Modify `apps/web/svelte.config.js` to respect `process.env.BASE_PATH`.
- Default `base` path remains an empty string for production.

## 2. CI/CD Workflow (GitHub Actions)

- Update `.github/workflows/deploy.yml`:
  - Create a temporary `dist` root directory.
  - **Build 1 (Prod)**: Build normally, copy contents of `apps/web/build` to `dist/`.
  - **Build 2 (Staging)**: Build with `VITE_STAGING=true` and `BASE_PATH=/staging`, copy contents to `dist/staging/`.
  - **404 Handling**: Ensure both `dist/404.html` and `dist/staging/404.html` exist for SPA support on GitHub Pages.
- Upload the entire `dist` directory as the deployment artifact.

## 3. UI Gating

- Update `apps/web/src/routes/+layout.svelte`.
- Add logic to render `<DebugConsole />` if `import.meta.env.VITE_STAGING === 'true'`.

## 4. Verification

- Confirm production URL loads at `/`.
- Confirm staging URL loads at `/staging`.
- Confirm `Debug Log` button is visible at `/staging` but hidden at `/`.
