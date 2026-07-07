# Our Secret Space 🤍

A cute, simple photo gallery — lavender (`#C7A0CB`), soft yellow (`#FFFF84`), and white, with
little heart and daisy pins on top of each photo instead of plain pushpins.

## Files
- `index.html` — page structure
- `style.css` — all styling / theme colors
- `script.js` — gallery rendering, lightbox, Cloudinary upload widget
- `config.js` — **edit this one** to add your Cloudinary details and photos

---

## 1. Set up Cloudinary (free tier is plenty)

1. Create a free account at https://cloudinary.com
2. On your Dashboard, copy your **Cloud name**.
3. Go to **Settings → Upload → Upload presets → Add upload preset**
   - Set **Signing Mode** to **Unsigned**
   - Name it something like `secret-space-preset`
   - Save
4. Open `config.js` and fill in:
   ```js
   const CLOUDINARY_CLOUD_NAME = "your-cloud-name";
   const CLOUDINARY_UPLOAD_PRESET = "secret-space-preset";
   ```

## 2. Add your photos

You have two options:

**Option A — Upload through the site**
Open the site, click **"＋ Add a photo"**, and upload an image. It'll appear in the
gallery instantly. To make it *permanent* (so it's still there after a refresh),
open the browser console (it logs the new photo's details), copy the Cloudinary URL,
and paste it into the `GALLERY_IMAGES` array in `config.js`.

**Option B — Upload directly in Cloudinary**
Go to your Cloudinary **Media Library**, upload photos there, then copy each photo's
**secure URL** and add it to `config.js`:
```js
const GALLERY_IMAGES = [
  { url: "https://res.cloudinary.com/your-cloud-name/image/upload/v.../photo1.jpg", pin: "heart", caption: "our first date" },
  { url: "https://res.cloudinary.com/your-cloud-name/image/upload/v.../photo2.jpg", pin: "daisy", caption: "" },
];
```
`pin` can be `"heart"` or `"daisy"` — `caption` is optional.

---

## 3. Deploy on Render (step by step)

Render can host this as a **Static Site** for free.

1. **Put the project on GitHub**
   - Create a new repository (e.g. `our-secret-space`)
   - Push these four files (`index.html`, `style.css`, `script.js`, `config.js`) to it

2. **Create the Render service**
   - Go to https://dashboard.render.com and sign in (GitHub login works well)
   - Click **New +** → **Static Site**
   - Connect your GitHub account if prompted, then select your `our-secret-space` repo

3. **Configure the site**
   - **Name**: anything you like, e.g. `our-secret-space`
   - **Branch**: `main` (or whichever branch has your files)
   - **Build Command**: leave **blank** (no build step needed — it's plain HTML/CSS/JS)
   - **Publish Directory**: `.` (a single dot, meaning the repo root — since `index.html` is at the top level)

4. **Deploy**
   - Click **Create Static Site**
   - Render will build and deploy automatically; wait for the status to turn **Live**
   - You'll get a free URL like `https://our-secret-space.onrender.com`

5. **Future updates**
   - Any time you `git push` a change (like adding new photos to `config.js`), Render
     automatically redeploys the site within a minute or two.

That's it — your secret space is live! 💛
