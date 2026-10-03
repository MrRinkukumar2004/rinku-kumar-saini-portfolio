# Rinku Kumar Saini – Portfolio

Personal portfolio in plain HTML, CSS and JavaScript. No framework, no build step.

Live at **https://rinku-kumar-saini-portfolio.vercel.app/**

## Folder structure

```
index.html            Home page: content, SEO tags, structured data
projects/*.html       Case-study page for each project (agcx, walker, d2o)
css/style.css         Site styles; colours and fonts are the variables at the top
css/project.css       Extra styles for the case-study pages
js/theme.js           Light / dark theme (loaded in <head>)
js/main.js            Home page interactions: menu, share menu, reveal, copy, contact form
api/contact.js        Vercel function that emails contact form messages to you
js/project.js         Case-study pages: contents highlight, share, screenshot lightbox
images/               Your photo and project screenshots
resume.pdf            Used by every "Résumé" / "Download résumé" link
og-image.png          Image shown when the home page link is shared
robots.txt, sitemap.xml   Help Google index the site
```

## Images

| File | What it is | Best size |
|---|---|---|
| `images/profile.jpg` | Your photo, cropped to head and shoulders | about 800 × 1000 px |
| `images/agcx.jpg` | Screenshot of the arabglobal.ae home page | 1600 × 1000 px |
| `images/walker.jpg` | Screenshot of the Walker Red Blue admin panel (hide any client data) | 1600 × 1000 px |
| `images/d2o.jpg` | Screenshot of design2occupancy.com | 1600 × 1000 px |
| `og-image.png` (root folder) | A 1200 × 630 image for link previews | 1200 × 630 px |

Compress images at squoosh.app or tinypng.com before uploading (aim for under 300 KB each).

## Contact form

Messages from the form are emailed to you by a Vercel serverless function, `api/contact.js`, using [Resend](https://resend.com) (free: 3,000 emails/month).
Each email's subject shows the topic ("Job opportunity", "Freelance project" or "Something else") and the sender's name, and pressing Reply answers the sender directly.

One-time setup:

1. Sign up at https://resend.com with **sainirinku1604@gmail.com** and create an API key (API Keys → Create).
2. In Vercel: your project → Settings → Environment Variables, add:
   - `RESEND_API_KEY` = the key from step 1
   - `CONTACT_TO_EMAIL` = `sainirinku1604@gmail.com`
3. Redeploy (Deployments → ⋯ → Redeploy) so the variables take effect.
4. Send a test message from the live site. If nothing arrives, check your spam folder and the function logs in Vercel (Deployments → Functions).

Resend's shared sender (`onboarding@resend.dev`) can only deliver to the email you signed up with. To send from your own address, verify a domain in Resend and add `CONTACT_FROM_EMAIL`, for example `Portfolio <hello@yourdomain.com>`.

When the page is opened as a local file, the form falls back to opening the visitor's email app.

## Deploying on Vercel

The site is hosted on Vercel at https://rinku-kumar-saini-portfolio.vercel.app/.
Push to the connected GitHub repository and Vercel redeploys automatically. No build settings are needed (Framework preset: **Other**, output directory: root).

If the address ever changes (for example a custom domain), replace `https://rinku-kumar-saini-portfolio.vercel.app` in `index.html`, the three `projects/*.html` pages, `robots.txt` and `sitemap.xml`. The project pages also contain it URL-encoded in their LinkedIn share links (`https%3A%2F%2Frinku-kumar-saini-portfolio.vercel.app`).

After changing any CSS or JS file, bump the `?v=` number on the `<link>` and `<script>` tags so browsers load the new version.

## Get found on Google

1. Add the site in Google Search Console (https://search.google.com/search-console).
2. Verify with the HTML-tag method (paste their meta tag into the `<head>` of `index.html`).
3. Submit `https://rinku-kumar-saini-portfolio.vercel.app/sitemap.xml`.
4. Add the site link to LinkedIn (Contact info and Featured), Naukri, Indeed, your GitHub profile and your resume.

## Editing

- Home page text: `index.html` (sections are `home`, `about`, `work`, `services`, `skills`, `experience`, `contact`).
- Project write-ups: `projects/agcx.html`, `projects/walker.html`, `projects/d2o.html`.
- Colours, fonts and corner radius: the variables at the top of `css/style.css`.
- Share text: the `text` line in the share menu section of `js/main.js`.
- New resume: replace `resume.pdf`, keeping the same name.
