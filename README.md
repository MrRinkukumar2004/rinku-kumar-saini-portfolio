# rinku-kumar-saini-portfolio

My personal site: **https://rinku-kumar-saini-portfolio.vercel.app**

It's plain HTML, CSS and a bit of vanilla JS. No framework, no bundler, nothing to install. I wanted something that loads fast and that I can edit in a couple of minutes without fighting a build setup.

## What's on it

- A home page with my work, experience, skills, a short about, freelance services and a contact form
- A write-up page for each project under `projects/` (AGCX, Walker Red Blue, Design2Occupancy)
- An animated diagram in the hero: one order going through the gateway and services, with Kafka fanning the event out to email, notifications and the audit log. It's an SVG moved along its paths with `requestAnimationFrame`.
- Dark and light themes (dark by default, the choice is saved in `localStorage`)
- A contact form that emails me through a small Vercel function

## Running it locally

Open `index.html` in a browser. That's really it.

The contact form needs the serverless function, so from a local file it falls back to opening your mail app. To test the real thing, run `npx vercel dev` and open the URL it prints.

## How it's laid out

```
index.html          home page
projects/           one page per project
css/style.css       everything; colours, fonts and spacing are variables at the top
css/project.css     extra bits for the project pages
js/theme.js         theme switch, loaded in <head> so there's no flash of the wrong theme
js/main.js          home page: menu, share menu, contact form, hero diagram, etc.
js/project.js       project pages: contents highlight, share, screenshot lightbox
api/contact.js      Vercel function that emails me the contact form
images/             project screenshots
```

## Contact form

`api/contact.js` takes the form, checks it (plus a hidden honeypot field for bots) and sends it to my inbox with [Resend](https://resend.com). The free tier is plenty for this. The email's reply-to is set to the sender, so I can just hit Reply.

It needs two environment variables in Vercel (Settings → Environment Variables):

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | API key from the Resend dashboard |
| `CONTACT_TO_EMAIL` | where messages should land |

Redeploy after adding them. Until I verify a domain in Resend, mail goes out from `onboarding@resend.dev`, which only delivers to the address the Resend account was made with. Once a domain is verified, set `CONTACT_FROM_EMAIL` too.

## Deploying

The repo is connected to Vercel, so pushing to `main` deploys it. There's no build step (framework preset: Other).

Browsers cache the CSS and JS hard, so every `<link>` and `<script>` has a `?v=` number. Bump it whenever those files change, or people keep seeing the old version.

## Small things worth knowing

- **Experience updates itself.** Anything marked `data-from="2024-06"` is counted from that month on page load, so "2+ years" turns into "3 years" on its own. The format is set with `data-format` (`years`, `words`, `short` or `num`).
- **Changing the domain** means updating the URL in `index.html`, the three project pages, `robots.txt` and `sitemap.xml`. The project pages also have it URL-encoded in their LinkedIn share links.
- **Screenshots** are about 1600 × 1000 and compressed with squoosh.app before they go in `images/`. `og-image.png` (1200 × 630) is the preview image when the link is shared.
- **Google** finds the site through `sitemap.xml`, and the `google…html` file in the root is the Search Console verification, so leave it there.
