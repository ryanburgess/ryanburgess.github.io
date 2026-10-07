# Photography resource operations

## Architecture

`/resources/photography` bundles a validated snapshot of approved links during the Vite build. A visitor submission is sent to `/api/resources/submit`; the Netlify Function opens a pull request in the separately owned resource repository. The submission never writes directly to its default branch and never appears on the site before review and merge.

The top navigation intentionally does not link to Resources or Guides yet.

## Data contract

The bundled snapshot lives in:

- `src/data/photography-resources/categories.json`
- `src/data/photography-resources/resources.json`

Each resource requires `id`, `category`, `title`, and an HTTP(S) `url`. `notes` is optional. Categories are stable IDs with separate display labels.

URL duplicate detection parses the URL, lowercases the scheme and hostname according to URL rules, removes fragments, and retains path case and query parameters. It therefore considers fragment-only differences duplicates while preserving query strings that may change meaning.

Validation and README generation share `shared/photography-resources-contract.js`. Generated Markdown escapes contributor-provided text. The server never fetches a submitted URL.

The current ten-category file is the single source used by the UI, tests, and server validation. Replace that file with the final categories from the public list repository before launch if they differ.

## Build snapshot

Without external configuration, `npm run build` validates and bundles the checked-in snapshot. To fetch an approved snapshot from the public list repository during a build, configure:

```text
PHOTOGRAPHY_RESOURCES_SOURCE_REPOSITORY=owner/photography-resources
PHOTOGRAPHY_RESOURCES_SOURCE_REF=main
```

`scripts/sync-photography-resources.mjs` resolves the ref to one commit, fetches both JSON files at that exact commit, validates them, and records the source SHA. A failure stops the deployment so Netlify retains the previous successful site.

For a private source repository, make `GITHUB_TOKEN` available to the build scope with read access. A public repository does not require it for source sync.

## Submission function

Configure these variables in Netlify for the **Production** deploy context and Functions scope. Do not place secrets in `netlify.toml` or a `VITE_` variable.

```text
PHOTOGRAPHY_SUBMISSIONS_ENABLED=true
PHOTOGRAPHY_RESOURCES_REPOSITORY=owner/photography-resources
GITHUB_TOKEN=...
TURNSTILE_SECRET_KEY=...
```

Configure `VITE_TURNSTILE_SITE_KEY` separately for the Production deploy context and **Builds** scope. It is a public browser key; the corresponding secret stays Functions-only.

Use either a repository-limited GitHub App installation token or a fine-grained token with Contents and Pull requests write access to only the resource repository. Leave `PHOTOGRAPHY_SUBMISSIONS_ENABLED` unset outside production so untrusted previews cannot create branches or pull requests.

Cloudflare Turnstile is optional during local UI development, but both Turnstile variables should be configured together in production. The endpoint also has a honeypot and a Netlify rate limit of five attempts per IP/domain per hour.

The resource repository must contain these files on its default branch:

```text
categories.json
resources.json
README.md
```

The function uses fixed file paths. Visitors cannot choose the repository, branch, or target files. Each request uses an idempotency key to derive a stable branch, checks approved and pending URLs for duplicates, updates the JSON and generated README, and returns the pull-request URL only after creation succeeds.

## Publication flow

1. A visitor submits a resource.
2. The function opens a public pull request.
3. Ryan reviews and edits the wording, then merges it.
4. A workflow in the resource repository calls a secret Netlify build hook.
5. The website build fetches both JSON files at the merged commit and deploys the approved snapshot.

Protect the resource repository's default branch and require the validation workflow before merge. Never automatically merge a web submission.

## Commands

```bash
npm run validate:resources
npm run sync:resources
npm test
npm run build
```

The separate public repository should own its interactive `npm run add` CLI, README generator command, schema validation CI, and contributor documentation. Those repository-specific files are deliberately not scaffolded inside the website repository.
