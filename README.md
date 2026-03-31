# 🧮 Times Tables Learner for Ella Mae

A fun, child-friendly times tables practice app built with plain HTML, CSS, and JavaScript — no frameworks, no server, no setup needed.

---

## ✨ What it does

- Choose any combination of the 1× through 12× times tables
- Practise random questions from your chosen tables
- Get instant feedback — correct or wrong
- Track your score and streak
- Confetti burst on correct answers 🎉
- Works on phones, tablets, and computers
- Runs entirely in the browser — no internet needed after loading

---

## 📁 File structure

```
times-tables/
├── index.html   ← The main page (HTML structure)
├── style.css    ← All the colours, fonts, and layout
├── script.js    ← All the app logic
└── README.md    ← This file
```

---

## 🖥 How to run it on your computer (no installation needed)

1. Download or unzip the project folder
2. Open the `times-tables` folder
3. Double-click `index.html`
4. It opens in your browser — done!

> **Tip:** If fonts look wrong, it means you're offline. The fonts load from Google Fonts. Everything else works offline.

---

## ✏️ How to edit the site name and colours

### Change the page title (browser tab)
Open `index.html` and find this near the top:
```html
<title>Times Tables Learner for Ella Mae</title>
```
Change the text between the tags.

### Change the big heading
Still in `index.html`, find:
```html
<h1 class="site-title">Times Tables Learner</h1>
```

### Change the subtitle / name
```html
<p class="site-subtitle">
  for <span class="name-pill">Ella Mae 🌸</span> · Second Grade
</p>
```

### Change colours
Open `style.css` and look for the `:root {` block near the top. You'll see clearly labelled colour variables:
```css
--clr-primary:    #FF6B6B;  /* main coral-red colour */
--clr-secondary:  #4ECDC4;  /* teal accent colour    */
--clr-bg:         #FFF9F0;  /* page background        */
```
Change any hex colour code (e.g. `#FF6B6B`) to any colour you like.
A good tool for picking colours: https://coolors.co

---

## 🚀 How to put it on the internet (GitHub → Netlify)

Follow these steps exactly — even if you've never done this before.

---

### Step 1 — Create a GitHub account (free)

1. Go to https://github.com
2. Click **Sign up**
3. Follow the steps to create a free account
4. Verify your email address

---

### Step 2 — Create a new repository on GitHub

A "repository" is just a folder on GitHub that stores your files.

1. Log into GitHub
2. Click the **+** button in the top right → **New repository**
3. Name it something like `times-tables` (no spaces)
4. Make sure it is set to **Public**
5. Leave everything else as default
6. Click **Create repository**

---

### Step 3 — Upload your files to GitHub

You don't need any coding tools for this — just drag and drop:

1. You'll see a page saying "Quick setup"
2. Click **uploading an existing file** (it's a link in the middle of the page)
3. Drag and drop all four files into the upload box:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
4. Scroll down and click **Commit changes**
5. Your files are now on GitHub! 🎉

---

### Step 4 — Deploy with Netlify (free, takes 2 minutes)

Netlify turns your GitHub repo into a live website automatically.

1. Go to https://netlify.com
2. Click **Sign up** → choose **Sign up with GitHub** (easiest option)
3. Click **Add new site** → **Import an existing project**
4. Click **GitHub**
5. Find your `times-tables` repository and click it
6. Leave all settings as they are (defaults are correct for this project)
7. Click **Deploy site**
8. Wait about 30 seconds
9. Netlify gives you a live URL like: `https://sparkly-unicorn-abc123.netlify.app`
10. Click it — your site is live! 🌐

> Every time you upload new files to GitHub, Netlify automatically updates the live site within a minute.

---

### Step 5 — Connect your own domain name (optional)

A "domain name" is something like `ellamaetables.com`.

#### Buy a domain name
- https://namecheap.com (usually cheapest)
- https://domains.google.com (easiest interface)
- https://porkbun.com (good prices)

A `.com` domain costs around $10–15 per year.

#### Connect your domain to Netlify

1. Log into Netlify
2. Click on your site
3. Go to **Domain management** → **Add a domain**
4. Type your domain name (e.g. `ellamaetables.com`) → click **Verify**
5. Click **Add domain**
6. Netlify will show you **DNS records** to add — these look like:
   ```
   Type: A     Value: 75.2.60.5
   Type: CNAME Value: yoursitename.netlify.app
   ```
7. Log into your domain registrar (Namecheap, Google Domains, etc.)
8. Find **DNS Settings** or **Nameservers**
9. Add the records Netlify gave you
10. Wait up to 48 hours (usually much faster — often 15 minutes)
11. Your domain now points to your Netlify site!

> **Free HTTPS:** Netlify automatically gives you a free security certificate (the padlock in the browser bar). No extra steps needed.

---

## 🔄 How to update the site later

1. Edit the files on your computer (index.html, style.css, or script.js)
2. Go to your GitHub repository
3. Click the file you want to update
4. Click the pencil ✏️ icon to edit, OR drag new files into the repo
5. Click **Commit changes**
6. Netlify detects the change and rebuilds your site automatically within ~60 seconds

---

## 🐛 Troubleshooting

| Problem | Fix |
|---|---|
| Site doesn't open | Make sure you're opening `index.html`, not `style.css` |
| Fonts look wrong | Check your internet connection (fonts load from Google) |
| Changes not showing | Hard-refresh your browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac) |
| Netlify not updating | Go to Netlify → your site → **Deploys** → click **Trigger deploy** |
| Domain not working | DNS changes take up to 48 hours — be patient |

---

## 📱 Browser support

Works in all modern browsers:
- Chrome ✅
- Firefox ✅
- Safari ✅ (iPhone / iPad)
- Edge ✅
- Samsung Internet ✅

---

## 🏗 Built with

- **HTML5** — structure
- **CSS3** — styling, animations, responsive layout
- **Vanilla JavaScript** — all app logic
- **Google Fonts** — Baloo 2 + Nunito
- No frameworks, no build tools, no dependencies

---

Made with ❤️ for Ella Mae
