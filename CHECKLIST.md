# Élever Badminton — client review, 3 Sep 2026

Source: owner's review notes (`1.png`, `2.png`). **All comments are for desktop view**, but every
change below is checked on tablet and phone too so nothing regresses.

Legend: `[x]` done · `[~]` done as far as the supplied assets allow · `[ ]` deliberately not done
(waiting on the client, see note).

---

## 1. Home

- [~] **Replace the An Se Young hero photo with a slideshow of Élever's own photos, keeping the
  slow zoom.** Hero is now a 4-photo crossfading slideshow; each slide keeps the Ken Burns zoom the
  client liked. Slides are Élever photography from the repo (camps + events) as an interim set —
  swap for the Google Drive photos when Chin sends them: the list is the four `.hero__slide`
  elements at the top of `index.html`, nothing else to touch.
- [x] **Blue tint on the hero**, in the spirit of the Development Pathway cards — applied as a CSS
  layer (`.hero__tint`), so if Chin later supplies photos that are already blue-tinted we just
  delete one line rather than re-editing images.
- [ ] *"Will consider new Home page style soon"* — no action, waiting on the client.

## 2. What We Do (Home + About — one shared component)

- [x] **5 columns filling the full width** — the section is now full-bleed, edge to edge.
- [x] **'What we do' kicker and 'Five pillars' heading removed** on both pages.
- [x] **3 : 4 box sizing** for each tile.
- [x] **Title centred in the box, one photo as the box background.**
- [x] **Resting state = blue tint** (matching the Development Pathway cards).
- [x] **On hover: the photo comes back to full colour, stays dark enough for white text, and the
  description fades in below the title.** Same on keyboard focus.
- [x] Photos assigned per pillar from Élever's own library (see `PILLARS` in `assets/js/pages.js`) —
  easy to swap when the Drive photos arrive.

## 3. Classes

- [x] **One alignment for everything** — the ÉB logo, the *Book a class* button, the black-section
  copy (*Regular Classes… Our regular classes…*) and the white-section copy (*Development
  Pathways…*) now share one content column. Fixed at the design-system level (`.nav__inner`,
  `.psec`, `.psec--alt > .psec__inner`), so **every page** picks it up, as asked.
- [x] Removed *"Switch tabs, swipe, or use the arrows to explore how we train…"*.
- [x] **'Class Type' is now smaller** than the *Group Classes* / *Private Classes* tab titles.
- [x] **Blue and orange dots removed.**
- [x] **Active tab is blue with white text** instead of a white chip.
- [x] Removed the repeated *Group Classes* / *Private Classes* headings inside the panel below the
  tabs (the descriptions stay).
- [x] Removed *'7 areas · 8 venues · 24 classes'*.
- [x] **Address sits to the right of the venue name on the same line and links to Google Maps**
  (opens in a new tab). The venue list went from three columns to two so the name and the address
  genuinely fit on one line at desktop width — three columns forced the address onto its own row.
- [ ] *Edit the Group / Private descriptions* — waiting on Chin's copy.
- [ ] *"Something not quite right with the UI of each Area / Location / Day / Time box"* — waiting
  on the client's decision.

## 4. Camps

- [x] **Full photo is no longer cropped at the bottom in the viewer** — the image is sized against
  the space above the thumbnail strip, so the bottom of the photo always finishes above the
  previews. Fixes the camp gallery *and* the event galleries, which share one viewer.
- [x] **'Close ×' replaced by a circled ×.**

## 5. Events

- [x] **'What we organise' → 'Our Services'.**
- [x] **Carnivals / Clinics / Competitions are now larger than the 'Our Services' label.**
- [x] **One *Request a proposal* button below all three boxes** instead of one per box.
- [x] **'Trusted by' is a single scrolling row** with the logos close together, using the same
  moving-marquee treatment as the Home page.

## 6. About

- [x] **'HOME · ABOUT' breadcrumb removed** (also removed the matching 'HOME · CONTACT' so the two
  pages stay consistent — say the word and it goes back).
- [x] **Featured-on items now show each article's cover photo.**
- [x] **Full article titles used**, exactly as published:
  - 联合早报 — 我国退役羽将骆建贤 另一种身份参与新加坡公开赛
  - SportPlus — Sharing the Heart of the Badminton Community at Élever Badminton: Loh Kean Hean and
    Eng Chin An
  - 联合早报 — 羽总推广入门课培养学生兴趣 骆建贤教第一堂课盼栽培明日之星
  - ⚠️ The cover images are the publications' own photos, saved to `assets/img/press/`. Worth a
    quick note to Zaobao / SportPlus that we are using them, or we swap them for our own shots.
- [x] **'Co-founders' label and the two founder cards centred on the page.**
- [x] **'Our team' label centred.**
- [x] **What We Do follows the new Home-page style** (shared component, so it matches exactly).

## 7. Contact

- [x] **Descriptions removed** from the WhatsApp, Email, Events and Book-a-class boxes; the boxes
  are re-proportioned so they don't look half-empty without them.
- [ ] *"Will have to think of nicer UI"* — waiting on the client.

## 8. Élever Performance Lab

- [x] **Moved next to Classes in the nav** (was on the far right).
- [x] **Renamed to 'Lab'** in the nav.
- [~] **EPL logo replaces the 'ÉLEVER PERFORMANCE LAB' wording on the page** — the markup now looks
  for `assets/img/brand/epl-logo-white.png` and falls back to the current wording until that file
  exists. Drop Chin's logo in at that path and it appears; no code change needed.

## 9. Footer

- [x] **'Enhance your skills. Enjoy the process. Elevate your experience.' is bold.**
- [x] **Social platform names replaced with their logos** (Instagram, Facebook, TikTok, LinkedIn),
  each still labelled for screen readers.

---

## Checked before hand-off

- Content column measured on every page at 1600px: nav logo, dark-header copy, section headings,
  the grey banded sections and the footer all start on the same line, and the *Book a class* button
  lines up with the footer's right edge.
- Home, Classes, Camps, Events, About, Contact, Lab, News, Privacy and a coach page: no JavaScript
  errors, no broken images (the one deliberate exception is the EPL logo, which triggers the
  wordmark fallback by design).
- Hero slideshow verified frame by frame — one photo visible per quarter of the loop, crossfading,
  and the first frame is never blank.
- Camp and event viewers measured: the photo now finishes 8px above the thumbnail strip instead of
  running 100px underneath it.
- Checked at 390px wide as well as desktop: nothing overflows sideways, and the What We Do tiles
  run full width there too, with the fifth tile taking the last row rather than leaving a gap.

## Still with the client

| # | Item | Needed |
|---|---|---|
| 1 | Home hero photos | The Google Drive set (Chin) — ideally 4–6 landscape shots |
| 2 | What We Do tile photos | Optional: a chosen shot per pillar |
| 3 | Group / Private class descriptions | Copy (Chin) |
| 4 | Area / Location / Day / Time card UI | Client's direction |
| 5 | Contact box UI | Client's direction |
| 6 | EPL logo | `epl-logo-white.png` (Chin) |
| 7 | Press cover photos | Confirm we may use the publications' images |
| 8 | New Home page style | Client's direction |
