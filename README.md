# AI Agent Directory

A **Next.js** web app for browsing, filtering, and exploring a curated directory of AI tools. Tools are stored in **MongoDB** (Mongoose), the UI is **Tailwind CSS** with **GSAP** / **Framer Motion** for motion, and images can be delivered via **Cloudinary**.

---

## Features

- **Home** – Tools grouped by category with search, pricing filter (Free / Paid / Freemium), access model (Open Source / Close Source / API), and sort
- **Category pages** – Listings per category (URL-friendly slugs) and per-tool detail pages
- **Search** – Scored text search over name, tagline, description, category, and related fields (see API)
- **Favorites** – Star tools; selections persist in the browser via `localStorage`
- **Submit tool** – Public form to propose new tools (default API behavior documented below)
- **Promoted tools** – Carousel strip for tools flagged with `promotion: true` in the database
- **Responsive UI** – Dark theme, Radix-based form controls, toast notifications (Sonner)

---

## Tech stack

| Area | Technology |
|------|------------|
| Framework | [Next.js](https://nextjs.org/) 15 (App Router, Turbopack in dev) |
| UI | React 19, Tailwind CSS 3, [Radix UI](https://www.radix-ui.com/) (select, label), [Lucide](https://lucide.dev/) icons |
| Data | [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) 8 |
| Media | [Cloudinary](https://cloudinary.com/) (optional; used by the persistent submit API) |
| Motion | [GSAP](https://gsap.com/) (ScrollTrigger, scroll behavior), [Framer Motion](https://www.framer.com/motion/) |
| HTTP | [Axios](https://axios-http.com/) and `fetch` |

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- A **MongoDB** connection string (Atlas or self-hosted)
- **Cloudinary** account (only if you use `POST /api/tools/submit` with image uploads or wire the UI to that route)

---

## Environment variables

Create a **`.env.local`** in the project root (never commit secrets).

| Variable | Required | Purpose |
|----------|----------|--------|
| `MONGODB_URI` | **Yes** | MongoDB connection string; required by `src/lib/dbConnect.js` on server start |
| `NEXT_PUBLIC_API_URL` | **Yes** (for most client fetches) | Base URL the browser uses to call API routes, e.g. `http://localhost:3000` in development or your deployed origin. Some components use relative `/api/...` URLs; many use this prefix. |
| `CLOUDINARY_CLOUD_NAME` | For Cloudinary | Used by `api/tools/submit` |
| `CLOUDINARY_API_KEY` | For Cloudinary | |
| `CLOUDINARY_API_SECRET` | For Cloudinary | |

**Local development tip:** set `NEXT_PUBLIC_API_URL=http://localhost:3000` so client-side requests match the dev server.

---

## Getting started

```bash
# Install dependencies
npm install

# Run the dev server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
# Production build
npm run build
npm start

# Lint
npm run lint
```

---

## Project structure (high level)

```text
src/
  app/                 # App Router: pages + API route handlers
    api/               # REST-style endpoints (home, tools, search, category, etc.)
    [category]/        # Category + product detail routes
    about/, contact/   # Static-style pages
    submit/, favourites/
  components/          # UI: filters, tool cards, layout, etc.
  lib/                 # db connection, utilities
  models/              # Mongoose schemas (e.g. AiTool)
```

---

## Data model (AiTool)

Defined in `src/models/aiTools.js`. Notable fields include:

- `name` (unique), `category`, `industry`, `accessModel`, `pricingModel`, `tagline`, rich text and arrays (`keyFeatures`, `useCases`)
- `websiteUrl` and social links: `linkedin`, `twitter`, `github`
- `logo`, `thumbnailImage`, `videoUrl`
- `promotion` (boolean) for featured/promoted listings

> The schema file contains some duplicated `industry` / `accessModel` keys; when extending the app, consider consolidating them in a single migration-friendly definition.

---

## API overview

Server routes live under `src/app/api/`. CORS is enabled for `/api/*` in `next.config.mjs` (tighten `Access-Control-Allow-Origin` in production).

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/home` | All tools, grouped by category (response shape: `{ data }`) |
| `GET` | `/api/tools` | All tools (flat list) |
| `GET` | `/api/tools/search?q=…` | Search with relevance scoring, grouped by category |
| `GET` | `/api/tools/promotion` | Tools with `promotion: true` |
| `GET` | `/api/tools/[category]` | Tools for a kebab-case category slug (see `api/tools/[category]/route.js`) |
| `POST` | `/api/tools/submit` | **Persist** a tool; supports JSON or `multipart/form-data` with images to Cloudinary |
| `GET` | `/api/pricingModel/[pricingModel]` | `Free` \| `Paid` \| `Freemium` |
| `GET` | `/api/accessModel/[accessModel]` | `Open Source` \| `Close Source` \| `API` |
| `GET` | `/api/category` | Distinct category names |
| `GET` | `/api/category/[category]` | Paginated tools in a category |
| `GET` | `/api/category/[category]/[name]` | Single tool by category + name |
| `GET` | `/api/favourites` | Fetches full tool documents for a set of names; handler expects a JSON body `{ toolNames: string[] }` (non-standard for `GET`). The favorites **page** uses client-side `localStorage` only, so this route is optional for future sync |
| `POST` | `/api/submit-tool` | Used by the **current** “Submit” page: validates input and returns success **without** writing to MongoDB (stub for demos; extend or redirect to `POST /api/tools/submit` for real persistence) |

---

## Image domains

`next.config.mjs` allows optimized images from `res.cloudinary.com` (project-specific path). Add patterns there if you use other image hosts.

---

## Scripts (from `package.json`)

- `npm run dev` – `next dev --turbopack`
- `npm run build` – production build
- `npm start` – run production server
- `npm run lint` – Next.js ESLint

---

## Production checklist

- Set `MONGODB_URI` and `NEXT_PUBLIC_API_URL` to your real deployment URL.
- Restrict CORS in `next.config.mjs` instead of `*` if the API is only used by your own site.
- Decide whether the public submit form should call **`/api/submit-tool`** (demo) or **`/api/tools/submit`** (database + optional Cloudinary), and update the form `fetch` in `src/app/submit/page.jsx` accordingly.
- Add `public/favicon.ico.png` and any marketing assets the layout references, if not already present.

