# Psychedelic p5.js Art

Made using https://p5js.org/ and deployed on Cloudflare Workers.

## Deployment

This repo uses **Cloudflare Git Integration** for automatic deployments:

1. Push to GitHub/GitLab
2. In Cloudflare Dashboard: **Workers & Pages** → **Create** → **Connect to Git**
3. Select this repo — Cloudflare auto-detects the Worker config
4. Every push to `main` triggers a new deployment

## Controls

- **Mouse movement** — glowing cursor with particle trails
- **Click** — creates ripple effect and particle burst
- **Keys 3-9** — change kaleidoscope segments
- **R** — reset feedback trails
