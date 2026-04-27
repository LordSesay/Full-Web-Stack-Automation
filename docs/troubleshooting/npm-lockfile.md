
### `docs/troubleshooting/npm-lockfile.md`

```markdown
# NPM Lockfile Mismatch

## Error

`npm ci` failed because `package.json` and `package-lock.json` were not in sync.

## Root Cause

`npm ci` is strict and expects the lockfile to exactly match dependency versions declared in `package.json`.

## Fix

```bash
cd apps/frontend
rm -rf node_modules package-lock.json
npm install
npm run build
git add package.json package-lock.json
git commit -m "Fix frontend lockfile for CI build"

Lesson
Use npm install locally to regenerate lockfiles. Use npm ci in CI/CD for repeatable builds.