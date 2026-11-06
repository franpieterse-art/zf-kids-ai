# ZF Kids AI — My Best Friend

**GitHub + Render-ready editable source code**, with the 12 original approved avatar images (Puppy, Dragon, Robot, Unicorn, Capybara, Dino, Axolotl, Panda, Cow/Highland Cow, Kitten, Astro, Lion). Puppy and Dragon are free; other avatars are premium-preview only.

## Publish to GitHub
1. Download and unzip the project.
2. In GitHub, select **New repository**, name it `zf-kids-ai`, choose **Private**, then **Create repository**.
3. Click **uploading an existing file** and upload the **contents of the `zf-kids-ai-v1` folder**, not the ZIP itself. Include `server.js`, `package.json`, `render.yaml`, `public/` and the rest. Commit changes.
4. Future edits: click any file in GitHub, use the pencil editor and **Commit changes**. Render can auto-deploy each commit.

## Deploy to Render
1. Render dashboard > **New** > **Web Service** > connect your new GitHub repository.
2. Select **Node** runtime, **Build Command** `npm install`, **Start Command** `npm start` (or use `render.yaml` as a Blueprint).
3. Render sets `PORT` automatically. For live AI, in Render > your service > **Environment**, add `OPENAI_API_KEY` and optionally `OPENAI_MODEL=gpt-4o-mini`.
4. Save/redeploy and open your Render `.onrender.com` URL.
5. **Never** put your API key in GitHub or browser code. `SEARCH_API_KEY` is a placeholder for a future curated, parent-controlled search feature, not an active search integration.

## Test locally
Requires Node.js 18+. From the project folder: `npm test`, then `npm start`. Open `http://localhost:3000`.

## Implemented
- Parent setup: child nickname, age 1–15, English/Afrikaans speech settings, optional local PIN, wake-up time, spoken replies, premium **developer preview**.
- Original avatar chooser: 2 free + 10 premium-preview characters, using crops from the approved original grid.
- Chat: written input, optional browser speech recognition and speech synthesis, server-side AI API integration, demo replies when no key is set, basic guardrails and per-IP request limiting.
- Learning games: counting, arithmetic, general knowledge; drawing canvas; colouring brush; sticker-book collection; save artwork as PNG.
- Browser-local settings, art, chat and stickers; health endpoint and automated HTTP tests; Render configuration and PWA manifest.

## Important limitations before public launch
This is a **working editable development build**, **not** a production-certified child-safe service. Parent PIN and premium developer preview are stored locally and are not secure authentication or a payment system. Do not sell premium access until a real account and verified payment flow exists. Wake-up alerts only run while the page is active; do not replace a real alarm clock. Speech recognition depends on device/browser permission. Colouring currently uses a brush, not automatic region-fill. Search API key is reserved, but unrestricted internet search for children is deliberately not enabled. Live AI needs an API key and paid API usage; basic prompt guardrails do not replace independent safety moderation. Before public launch implement verified parental consent, secure accounts, moderation, privacy policy/POPIA compliance, child-data deletion, payment verification, comprehensive device testing and age-specific safeguarding. No child information is saved to a server by this build, but live chat text is sent to the configured AI provider.
