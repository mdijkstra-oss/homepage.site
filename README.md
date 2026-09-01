# homepage.site

The frontend of [mdijkstra.dev](https://mdijkstra.dev): a portfolio page laid out as a chat conversation, with a composer at the bottom that answers questions through a real LLM backend, and a hidden easter egg.

The build is a fully static site. It talks to exactly one external endpoint — the chat backend named by `VITE_AGENT_URL` — using the [OpenAI Responses API streaming shape](https://platform.openai.com/docs/api-reference/responses-streaming) over server-sent events. Everything else on the page ships in the bundle.

## Content

Every card, pill, nav link and piece of copy on the page comes from [`src/content/site.ts`](src/content/site.ts). Editing the `SECTIONS` array changes, adds or reorders cards; the `SITE` object holds the header, nav and composer text. Images live in [`public/uploads/`](public/uploads) and are served at `/uploads/…`; the resume is served at `/resume.pdf`.

There's a chat button at the bottom of the page hooked up to an LLM.

## Quick start

Needs Node `22` and a value for `VITE_AGENT_URL` — a URL that points at nothing still builds and serves, and the chat fails only when used.

1. Install and configure:

```console
$ npm install
$ cp .env.example .env.local   # VITE_AGENT_URL=http://localhost:8081/cv
```

2. Run the dev server with hot reload:

```sh
npm run dev
```

3. Or build the static site into `dist/`:

```console
$ npm run build

> mdijkstra-portfolio@1.1.2 build
> tsc --noEmit && vite build

vite v5.4.21 building for production...
transforming...
✓ 378 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.73 kB │ gzip:   0.40 kB
dist/assets/index-DR36olxm.css   26.83 kB │ gzip:   6.38 kB
dist/assets/index-DygiocX2.js   359.25 kB │ gzip: 115.64 kB
✓ built in 866ms
```

## Runtime environment

| variable | default | meaning |
| :--- | :--- | :--- |
| `VITE_AGENT_URL` | none — the build refuses to start without it | absolute `http`/`https` URL of the chat backend |

The variable is read at build time and compiled into the bundle; the built site reads no environment at run time. An unset or malformed value stops `npm run dev` and `npm run build` with `VITE_AGENT_URL is not set. Copy .env.example to .env.local, or set the repository variable.`

## Deployment

```sh
docker build --build-arg VITE_AGENT_URL=https://backend.example/cv -t homepage-site .
```

The image holds nginx and the built `dist/` . It listens on `8080` as an unprivileged user and behaves like this:

| request | response |
| :--- | :--- |
| `GET /healthz` | `200` with body `ok` |
| any URL on a `www.` host | `301` to the same path on the bare domain |
| any request whose `X-Forwarded-Proto` header is `http` | `301` to the `https` URL |
| `/assets/…` | cached for a year (`immutable` — Vite hashes the filenames) |
| everything else | `Cache-Control: no-cache`, revalidated on each visit |

Pushing a tag `v*` runs the release workflow: it verifies the tag matches the `package.json` version, runs the checks and tests, then builds and pushes `rg.nl-ams.scw.cloud/mdijkstra-homepage/homepage-site:<tag>`. Cut releases with `npm version` so tag and version stay in sync. The [homepage.infra](https://github.com/mdijkstra-oss/homepage.infra) repo pins that tag to deploy it.

## Development

```sh
npm run dev        # vite dev server with hot reload
npm run dev:all    # dev server plus the hermes-logos sibling repo (../../hermes/hermes-logos)
npm test           # vitest, single run
npm run typecheck  # tsc --noEmit
npm run lint       # biome lint
npm run format     # biome format --write
npm run check      # biome ci — what CI and the pre-commit hook enforce
npm run preview    # serve the built dist/ locally
```

`npm install` installs a husky pre-commit hook that runs `biome check --write` on staged files. CI runs `check`, `typecheck`, `test` and `build` on every push and pull request, using a `backend.invalid` fallback URL when the repository variable is unset — nothing published comes from that workflow.

## License

Released under the [Zero-Clause BSD](LICENSE) (0BSD) license — public-domain-equivalent, do whatever you like, no attribution required.

## See also

- [homepage.infra](https://github.com/mdijkstra-oss/homepage.infra) — the OpenTofu that deploys this image and owns the DNS.
- [homepage.backend](https://github.com/mdijkstra-oss/homepage.backend) — the chat agent the composer talks to.

[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v1/monitor/2wp15.svg)](https://uptime.betterstack.com/?utm_source=status_badge)
