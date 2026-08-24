# ÉLEVER BADMINTON — Website

Multi-page static site for [Élever Badminton](https://www.eleverbadminton.com/), built to the
structure Élever specified: a standalone Home page with every other section as its own page,
rather than one long scrolling page.

## Pages

| Page | File | What's on it |
|---|---|---|
| Home | `index.html` | Intro animation, hero, "What is Élever" + definition, the 5 pillars (each clickable), find-a-class-near-you, reviews |
| Classes | `classes.html` | The four development pathways, regular vs private coaching, class locations on a Singapore map **and** as a list, class enquiry form |
| Camps | `camps.html` | What happens at an Exploration camp, a day's timetable, the next camp (or the waitlist capture when none is live), past camps and photos |
| Events | `events.html` | Split into **Work with us** (the corporate offer — carnivals, clinics, competitions) and **Our work** (upcoming, past, partners), plus a proposal request form |
| About | `about.html` | Definition, founder story, coaching approach, credentials, the coaching team, the 5 pillars |
| Coaches | `coaches/<slug>.html` | One generated page per coach — photo, profile, stages coached, languages |
| News | `news.html` | Articles, filterable by category, newsletter signup |
| SG Badminton Hub | `hub.html` | Venue directory with filters, how to book each system, groups & ratings, world tour calendar |
| Play | `play.html` | The interactive pieces — rally game, reflex test, badminton-twin quiz, guess-the-pro |
| Contact | `contact.html` | Enquiry form, WhatsApp / email / events routing, FAQ |
| Privacy | `privacy.html` | PDPA privacy notice draft (needs completion — see below) |

## Editing content — start here

**`assets/js/data.js` is the file to edit.** Coaches, development pathways, the class schedule,
camps, event types, upcoming/past events, partners and articles all live there. Nothing is baked
into the markup, so changing a class time does not require touching HTML.

Entries flagged `placeholder: true` are structural samples so pages can be seen working. They
render with a small **sample** tag on the page. Replace the content and delete the flag.

After editing the coach list, regenerate their pages:

```
node tools/build-coaches.js
```

## Still needed from Élever

- Real class days, times, levels and venues (currently sample data)
- Real camp dates, prices and photos
- Real past events, partners and partner logo files
- Confirmed wording for the four credential claims on the About page
- The make-up/cancellation policy and insurance wording in the Contact FAQ
- Completion of the bracketed fields in `privacy.html` (DPO, UEN, retention period)
- A form endpoint — forms currently open a pre-filled email; point them at Formspree, Netlify
  Forms or the CRM to capture leads properly
- The academy WhatsApp number for click-to-chat on the Contact page

## Structure

```
index.html  classes.html  camps.html  events.html  about.html
news.html   hub.html      play.html   contact.html privacy.html
sitemap.xml robots.txt
coaches/          generated — one page per coach
tools/            build-coaches.js
assets/
  css/style.css   base design system (brand blue #2151D1 / white / black, Montserrat)
  css/pages.css   layout layer for the standalone pages
  js/data.js      >>> site content lives here
  js/site.js      shared nav + footer injection
  js/pages.js     renders the data-driven blocks on each page
  js/main.js      intro, hero, games, hub directory, carousel
  js/i18n.js      5-language switcher (EN / 中文 / हिन्दी / தமிழ் / Bahasa Melayu)
  img/            team photos, hero, player portraits
```

Scripts load in the order `data → site → i18n → pages → main`. `pages.js` must run before
`main.js`: `startReveals()` collects `.reveal` elements once, so anything injected afterwards
would never become visible.

## Run locally

```
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy

GitHub Pages from the `main` branch.

---
Photography © Élever Badminton.
