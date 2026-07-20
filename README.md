# M. Dijkstra — portfolio (React + Vite)

A packable, static build of the chat-style portfolio. Same visuals and behaviour
as the original single-file design: scroll-lift card reveals, mouse-follow shine,
ink-wipe buttons, the Conway's-Game-of-Life background, and the hidden
snake game (click **Take a break**, or enter the Konami code).

## Run it

```bash
npm install
npm run dev        # local dev server (hot reload)
npm run build      # static production build -> dist/
npm run preview    # serve the built dist/ locally
```

The `dist/` folder after `npm run build` is a fully static site — drop it on any
static host (Netlify, GitHub Pages, S3, nginx…). `vite.config.js` uses
`base: './'` so it also works from a subfolder or opened directly.

## Layout

```
src/
  main.jsx              React entry
  App.jsx               page shell; mounts the engine, renders the block list
  data.js               ← all portfolio content (single source of truth) + chat pills
  engine.js             imperative canvas/animation engine (scroll-lift, fly-away,
                        Game of Life, snake, spark bursts). Framework-agnostic.
  styles.css            resets, keyframes, and the few CSS-only :hover states
  components/
    ui.js               shared primitives: Card, Row, Badge, TechTag, WipeButton
    cards.jsx           one component per card type + <Block> dispatcher
    Header.jsx          top chrome
    Composer.jsx        bottom chip rail + faux input + "take a break" pill
    Background.jsx      canvases + ambient layers + game overlays
public/uploads/         logos & avatars (served at /uploads/…)
```

### Editing content
Everything shown on the page comes from `src/data.js` — edit the `BLOCKS` array to
change/add/reorder cards. Card visuals live in `src/components/cards.jsx`.

### Why the engine is a plain class
The scroll reveal, Game of Life, snake and particle systems are `requestAnimationFrame`
+ `<canvas>` work that shouldn't re-render through React. `SiteEngine` owns the DOM
imperatively; `App.jsx` just mounts it once against the rendered markup (each card
carries the `data-*` hooks the engine looks for) and tears it down on unmount.

## Bonus: zero-build demo
`demo.html` is the whole app inlined into one file (React + Babel from a CDN, compiled
in the browser). Open it directly in a browser — no install needed. It's handy for a
quick look, but use the Vite build for anything real.

## License

Released under the [Zero-Clause BSD](LICENSE) (0BSD) license — public-domain-equivalent, do whatever you like, no attribution required.
