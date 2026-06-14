# CrossGate Legal — Landing Site

Static marketing site for CrossGate Legal (AI-powered trade risk intelligence).
Plain HTML/CSS/JS — no build step, no dependencies.

## Pages
- `index.html` — landing page (the live showcase)
- `about.html` — founder / about (preview: shows a "work in progress" modal 7s after load, then redirects home)
- `contact.html` — verification intake form (same preview behaviour)
- `styles.css` — shared design system
- `site.js` — shared behaviour (nav, scroll reveals, hero canvas, work-in-progress flow)

## Work-in-progress preview
Pages tagged `<body data-wip-preview>` open normally, then after 7 seconds show a
modal that counts down 7 seconds and returns to the homepage. Timing lives in
`site.js` (`initWip` and `showWipModal`) and the ring animation in `styles.css`.
Remove the `data-wip-preview` attribute from a page's `<body>` to make it fully live.

## Run locally
Just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Deploy (Vercel)
No configuration needed — Vercel serves the static files as-is.
See the deployment steps shared with this project, or run `vercel` from this folder.
