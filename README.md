# Rinku Kumar Saini – Portfolio

Personal portfolio in plain HTML, CSS and JavaScript. No framework, no build step.

## Folder structure

```
index.html        Page content, SEO tags, structured data
css/style.css     All styles (colors are the variables at the top)
js/main.js        Animations and interactions
images/           Your photo and project screenshots (add these)
resume.pdf        Used by every "Download resume" button
og-image.png      Image shown when the link is shared (optional, add later)
robots.txt, sitemap.xml   Help Google index the site
```

## Add your images

Put these files in the `images/` folder with exactly these names:

| File | What it is | Best size |
|---|---|---|
| `images/profile.jpg` | Your photo. A JPG or PNG, cropped to head and shoulders. | about 800 × 1000 px |
| `images/agcx.jpg` | Screenshot of arabglobal.ae home page | 1600 × 1000 px |
| `images/walker.jpg` | Screenshot of the Walker Red Blue admin dashboard (hide any client data) | 1600 × 1000 px |
| `images/d2o.jpg` | Screenshot of design2occupancy.com | 1600 × 1000 px |
| `og-image.png` (root folder) | A 1200 × 630 image for link previews. A screenshot of your hero works. | 1200 × 630 px |

Until an image is added, the site shows a styled placeholder, so nothing looks broken.
Compress images at squoosh.app or tinypng.com before uploading (aim for under 300 KB each).

## What's interactive

- Hero background: a moving network of connected nodes that reacts to your mouse
- Typing animation that cycles through your job titles
- Photo tilts in 3D as the mouse moves; floating tech badges
- Stats count up when they scroll into view
- Sections fade in as you scroll; a progress bar at the top shows how far you've read
- Cards light up under the cursor
- Project filter (All / FinTech / CRM & ERP / Web & CMS) and a "Details" pop-up for each project
- Experience timeline line fills as you scroll
- Copy buttons for email and phone, contact form with validation, back-to-top button
- Mobile menu; everything respects "reduce motion" settings

## Contact form

By default, "Send message" opens the visitor's email app with the message filled in.
To receive messages directly in your inbox instead:

1. Create a free form at https://formspree.io (50 messages/month free).
2. Copy your form URL, for example `https://formspree.io/f/abcdwxyz`.
3. In `index.html`, change `<form class="form panel reveal" id="contact-form" novalidate>` to
   `<form class="form panel reveal" id="contact-form" novalidate data-endpoint="https://formspree.io/f/abcdwxyz">`

## Publish free on GitHub Pages

1. Create a **public** GitHub repository named exactly `MrRinkukumar2004.github.io`.
2. Upload everything in this folder to the repository root (keep the `css`, `js` and `images` folders).
3. Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder `/ (root)` → Save.
4. In 1–2 minutes the site is live at **https://mrrinkukumar2004.github.io/**

If you use another URL (custom domain, Netlify, Vercel), replace `https://mrrinkukumar2004.github.io/` in `index.html`, `robots.txt` and `sitemap.xml`.

## Get found on Google

1. Add the site in Google Search Console (https://search.google.com/search-console).
2. Verify with the HTML-tag method (paste their meta tag into the `<head>` of `index.html`).
3. Submit `sitemap.xml`.
4. Add the site link to LinkedIn (Contact info and Featured), Naukri, Indeed, your GitHub profile and your resume.

## Editing

- Text: `index.html` (sections are `home`, `about`, `projects`, `skills`, `experience`, `contact`).
- Project pop-up text: the `PROJECTS` object in `js/main.js`.
- Typing titles: the `roles` list in `js/main.js`.
- Colors and fonts: the top of `css/style.css`.
- New resume: replace `resume.pdf`, keeping the same name.
