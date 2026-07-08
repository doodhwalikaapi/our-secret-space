# OUR SECRET SPACE 💜

A soft lilac & yellow photo/video gallery — same idea as your first gallery, just reskinned:
- Colors: `#C7A0CB` (lilac) + `#FFFF84` (soft yellow) + white
- Title font: Segoe UI Bold
- Title changed to "OUR SECRET SPACE"
- Little pink heart pins on top of each photo/video instead of the plain dot

Photos and videos are stored on **Cloudinary** (same free, permanent storage as your first gallery) — nothing gets wiped when the server restarts.

## Step 1: Set up Cloudinary (skip if you already have an account from your first gallery)

If you already made a Cloudinary account before, you can reuse it — just skip to Step 2 and use the same Cloud Name / API Key / API Secret. Otherwise:

1. Go to **https://cloudinary.com** → **Sign up free** (no credit card)
2. On your Dashboard, note down: **Cloud Name**, **API Key**, **API Secret**

## Step 2: Get the code onto GitHub

1. Unzip this project
2. Go to **https://github.com** → **+** → **New repository**
3. Name it `our-secret-space`, set to **Private**, click **Create repository**
4. Click **"uploading an existing file"**
5. Open the unzipped folder, select **everything** (`server.js`, `package.json`, `README.md`, and the `public` folder) and drag it all in **at once** (this keeps the `public` folder structure intact)
6. Scroll down, click **Commit changes**
7. Double check the repo's main page shows: `public`, `package.json`, `README.md`, `server.js` all at the top level

## Step 3: Deploy on Render

1. Go to **https://dashboard.render.com**, log in
2. Click **New +** → **Web Service**
3. Find `our-secret-space` in your repo list → **Connect**
   - If it's not listed, click the "Configure GitHub App" link to give Render access to the new repo, then come back and refresh
4. Fill in:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** **Free**
5. Scroll to **Environment Variables**, add all three:
   - `CLOUDINARY_CLOUD_NAME` → your Cloud Name
   - `CLOUDINARY_API_KEY` → your API Key
   - `CLOUDINARY_API_SECRET` → your API Secret
6. Click **Create Web Service**

## Step 4: Watch it deploy

Click the **Logs** tab. Wait for:
```
🌸 Our Secret Space is running on port ...
```
and a green **Live** badge. You'll get a link like:
```
https://our-secret-space-xxxx.onrender.com
```

Open it, try uploading a test photo, then share the link with your friend — that's it!

## Notes

- Max file size: 100MB per upload
- Accepted types: jpg, png, gif, webp, mp4, mov, webm, avi
- To remove something, hover over it and click the ✕
- Since there's no login, treat the link itself as the "key" — don't post it publicly
