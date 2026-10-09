# Portfolio — Shravan Paladugula

Next.js 16 (App Router) + Tailwind v4. Static, no client-side state.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
```

## Where the content lives

All copy is data, not markup. Edit these three files and the pages follow:

| File | Holds |
| --- | --- |
| `src/content/profile.ts` | Name, headline, intro, stats, about, toolbox, education |
| `src/content/projects.ts` | `featured[]` (full write-ups) and `otherBuilds[]` (compact entries) |
| `src/content/experience.ts` | `experience[]`, `leadership[]`, `awards[]` |

### Crediting work honestly

Every project carries a `role` (what you specifically owned) and a `team`:

```ts
team: ["Yash Kathrani", "Dhruv Gupta"]  // named collaborators
team: []                                // confirmed solo
// omitted                              // not confirmed — the Team row is
//                                      // hidden rather than guessing
```

Leave `team` off rather than asserting "solo build" on something you have not
verified. The site renders nothing instead of a claim.

## Images

`public/projects/` holds real build photography only — no placeholder art.
Source files were pulled from the public Devpost project pages.

A photo entry can set `fit: "contain"` for CAD renders and UI screenshots that
sit on a white background and must not be cropped; everything else is
`object-cover`.

Projects with no real photo (CONJR, UAS-SAR, Powerchair) render as typographic
blocks. That is deliberate — an empty frame or stock graphic reads worse than
no image. Drop a real file into `public/projects/` and add it to the project's
`photos` array when you have one.

A `mark` (wordmark/logo) renders as a small tile beside the metadata, never as
a lead image.

## Résumé

`public/resume.pdf` is generated from `resume/resume.html`:

```bash
npm install --no-save playwright-core   # once; needs Chrome installed
node resume/build.mjs
```

The script fails loudly if the output spills past one page.

`resume/resume.html` sets `@page { margin: 0 }` deliberately — the page margins
come from `build.mjs`. Setting both makes Chrome stack them and paginate.

## Design

Strictly black and white. There is no accent colour — hierarchy comes from
weight, size, and rules. An award reads as a solid black `.marker` chip, not a
coloured word. Keep it that way; adding a hue is the quickest way to make this
look like every other portfolio.

One typeface: **Archivo**, loaded once in `layout.tsx`. No serif, no mono. The
helpers in `globals.css` cover the whole scale:

| Class | Use |
| --- | --- |
| `.display` | Large headings — 700, tight tracking |
| `.headline` | Mid headings — 600 |
| `.label` | Small uppercase metadata |
| `.marker` | Solid black award chip |

Light by default, dark via `prefers-color-scheme` — no toggle, no stored
preference, no hydration flash. Tokens are defined once in
`src/app/globals.css`; only the custom properties change between themes.
