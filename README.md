# Ryan Burgess Photography

React and Vite website for Ryan Burgess Photography, deployed with Netlify.

## Local development

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm test
npm run lint
npm run build
```

## Photography resources

The website includes two distinct resource systems:

- Authored guides at `/resources` and `/resources/:slug`, backed by `public/resources.json`.
- The curated external-link collection at `/resources/photography`, backed by the build snapshot in `src/data/photography-resources`.

The two data sources intentionally remain separate. See [Photography resource operations](docs/photography-resources.md) for the contract, source synchronization, submission workflow, and required Netlify/GitHub configuration.
