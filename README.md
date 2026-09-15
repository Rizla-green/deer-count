# Deer Count — setup

## 1. Put this on GitHub
1. Go to github.com → New repository → name it `deer-count` → Create (public is fine, no secrets are baked into the code)
2. Upload all these files to the repo root: `index.html`, `app.js`, `manifest.json`, `sw.js`, `logo.png`, `icon-192.png`, `icon-512.png`
3. Repo → Settings → Pages → Source: **Deploy from a branch**, Branch: **main**, folder **/(root)** → Save
4. Wait a minute, then your app is live at `https://<your-username>.github.io/deer-count/`

## 2. Lock down Firestore (important — do this before real use)
1. Firebase console → your project → Build → Firestore Database → **Rules** tab
2. Replace the contents with what's in `firestore.rules` (included here) → Publish
3. This makes sure only your logged-in account can read/write your farms and scans — right now it's likely still in whatever default "production mode" gave you (probably locked to nobody), so this step is what actually lets your app in while keeping everyone else out.

## 3. Install it as an app
- On your phone/tablet, open the GitHub Pages link in Chrome/Safari
- Use "Add to Home Screen" (Safari) or the install prompt / menu → "Install app" (Chrome/Android)
- It'll then launch full-screen like a normal app, and works offline once you've opened it at least once with a connection

## 4. Using it
- Log in with the email/password you set up in Firebase Authentication → Users
- Tap **+** to add a farm
- Open a farm → use the draw tool (bottom-left on the map) to draw your fields — you'll be asked to name/type/size each one right after drawing
- Tap a field to log a scan (method, date, species counts) — tap again anytime to see its history
- Settings (gear icon) — set postcode (for weather), tick which of the 6 UK deer species are present, add other species/livestock/schemes, toggle shoot & Dropbox backup, and paste your Dropbox access token there (kept on your device only, never in the code)
- Export button in Settings downloads an Excel file: totals at the top, then one row per animal per scan

## Notes
- Offline: you can view farms and log scans with no signal — they queue locally and sync automatically once you're back online (small "saved offline" toast confirms this)
- The Dropbox token lives only in that device's browser storage — if you use the app on a second device, you'll need to paste the token in again there
