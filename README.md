# ÉLEVER BADMINTON — Website

Multi-page static site for [Élever Badminton](https://www.eleverbadminton.com/), built to the
structure Élever specified: a standalone Home page with every other section as its own page,
rather than one long scrolling page.

## Pages

| Page | File | What's on it |
|---|---|---|
| Home | `index.html` | Hero slideshow, the Élever definition + tagline, the What We Do tiles |
| Classes | `classes.html` | Development pathways, group vs private, trial & placement, class locations (list **or** map) |
| Camps | `camps.html` | What happens at an Exploration camp, a day's timetable, the next camp, waitlist |
| Events | `events.html` | Carnivals / clinics / competitions offered as a service, the all-in-one suite, our work, Trusted by, proposal form |
| Performance Lab | `lab.html` | Black "OPENING SOON" holding page with the Upper Serangoon address |
| About | `about.html` | Definition + tagline, founder write-up, the coaching team, the 5 pillars, contact |
| Coaches | `coaches/<slug>.html` | One generated page per coach — photo, profile, stages coached, languages |
| News | `news.html` | Articles, filterable by category, newsletter signup |
| SG Badminton Hub | `hub.html` | Venue directory with filters, how to book, Racket Ratings + play groups, world tour calendar |
| Contact | `contact.html` | Enquiry form, WhatsApp / email routing, FAQ |
| Privacy | `privacy.html` | PDPA privacy notice draft (needs completion — see below) |

## Editing content — start here

**`assets/js/data.js` is the file to edit.** Coaches, development pathways, the class schedule,
camps, event types, upcoming/past events, partners, articles, the Racket Ratings links and the
recreational play groups all live there. Nothing is baked into the markup, so changing a class
time does not require touching HTML.

Entries flagged `placeholder: true` are structural samples so pages can be seen working. They
render with a small **sample** tag on the page. Replace the content and delete the flag.

After editing the coach list, regenerate their pages:

```
node tools/build-coaches.js
```

## Photos

**The Home hero** is a four-photo crossfading slideshow, written straight into
`index.html` as four `.hero__slide` divs — swap the `background-image` URLs to change
the photos. Add or remove a slide and the `nth-child` animation delays in
`.hero__slide` (`assets/css/style.css`) have to match. The brand blue wash over
them is `.hero__tint`; delete that one div if photos arrive already tinted.

**The What We Do tiles** (Home + About) take their photo, crop focus and hover
line from `PILLARS` in `assets/js/pages.js` — one line per pillar.

**Press covers** in `assets/img/press/` are the publications' own article cover
images, used on the About page's "Featured on" list. Confirm with the publication
before adding more.

Originals live in `assets/img/Photos/` and are never modified. One script per set
exports the web-ready files — run the matching one after dropping new files in, then
check the filenames listed in `data.js` still line up:

| Source | Script | Output |
|---|---|---|
| `Photos/Coaches/Headshot - <Name>.<ext>` | `bash tools/build-coach-photos.sh` | `assets/img/coaches/<slug>.jpg` — 800×800, centre-cropped square |
| `Photos/Camps/*` | `bash tools/build-camp-photos.sh` | `assets/img/camps/` (1600px) + `camps/thumb/` (640px) |
| `Photos/Events/<occasion>/*` | `bash tools/build-event-photos.sh` | `assets/img/events/` (1600px) + `events/thumb/` (640px) |
| `Photos/Regular Classes/<Stage>.png` | `bash tools/build-class-photos.sh` | `assets/img/classes/<stage>.jpg` — 900px pathway card image |
| `Photos/Partners/<Partner>.png` | `bash tools/build-partner-logos.sh` | `assets/img/partners/<slug>.png` — 480px, transparency kept |

The scripts use macOS `sips`, so they run on a Mac as-is.

## Brand

| | |
|---|---|
| White | `#FFFFFF` |
| Black | `#000000` |
| Blue | `#2151D1` |
| Type | Montserrat 400–900 |

Registered company: **Elever Sports Pte. Ltd.** · UEN **202501591C**
767 Upper Serangoon Road, #01-03, Singapore 534635
info@eleverbadminton.com · WhatsApp +65 8921 4221

## Still needed from Élever

- Home hero photos (the Google Drive set) — the current four are interim
- The EPL logo as `assets/img/brand/epl-logo-white.png` — `lab.html` picks it up
  automatically and falls back to the wordmark until it exists
- Real class days, times, levels and venues (currently sample data in `CLASSES`)
- Age ranges, ability levels and grading checkpoints for the four pathways (deliberately
  omitted rather than guessed)
- Logos for the partners still shown as name-only chips in `PARTNERS`
  (SingHealth Community Hospitals, Northbrooks Secondary School, the five CCs)
- Write-ups for the previous events listed on the Events page
- Completion of the bracketed fields in `privacy.html` (DPO, retention period) and the
  Terms & Conditions page the footer links to
- The make-up/cancellation policy and insurance wording in the Contact FAQ
- A form endpoint — forms currently open a pre-filled email; point them at Formspree, Netlify
  Forms or the CRM to capture leads properly
- Real coach bios (all are currently flagged `placeholder`)

## Structure

```
index.html  classes.html  camps.html  events.html  lab.html
about.html  news.html     hub.html    contact.html privacy.html
sitemap.xml robots.txt
coaches/          generated — one page per coach
tools/            build-coaches.js, build-news.js, build-*-photos.sh
assets/
  css/style.css   design system (white / black / #2151D1, Montserrat)
  css/pages.css   layout layer for the standalone pages
  js/data.js      >>> site content lives here
  js/site.js      shared nav + footer injection
  js/pages.js     renders the data-driven blocks on each page
  js/main.js      intro, hero canvas, nav, reveals, hub directory
  img/            hero, tiles, press covers and player portraits
    Photos/       untouched originals — coaches, camps, events, logos
    coaches/      square headshots      (build-coach-photos.sh)
    camps/        camp gallery + thumbs (build-camp-photos.sh)
    events/       event photos + thumbs (build-event-photos.sh)
    classes/      pathway card images   (build-class-photos.sh)
    partners/     "Trusted by" logos    (build-partner-logos.sh)
    press/        article covers for the About page "Featured on" list
```

Scripts load in the order `data → site → pages → main`.

## Run locally

```
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy

GitHub Pages from the `main` branch.

---
Photography © Élever Badminton.
