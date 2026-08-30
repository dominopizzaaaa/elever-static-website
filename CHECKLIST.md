# Élever Website — Client Comments Checklist (29 Aug 2026)

Source: client comment list (Overall / Regular Classes / Camps / Events / Performance
Lab / SG Hub / News / About / Contact) + `news.txt` (2 real articles) + Google Doc
**"EB Website for Dom" → tab "Write-ups for Development Pathways"**.

Legend: `[ ]` todo · `[x]` done · `[!]` blocked / needs client input

---

## 0. OVERALL — Nav layout (ElevenLabs style)

- [x] 0.1 Move `Classes`, `Events`, `News`, `About`, `Contact` to the **left**, immediately
      beside the logo
- [x] 0.2 Keep `Élever Performance Lab` and `Book a class` on the **right**
- [x] 0.3 Rename nav label `Performance Lab` → `Élever Performance Lab` (see 5.1)
- [x] 0.4 Restructure `assets/js/site.js` NAV into two groups (`primary` / `end`) and render
      a `.nav__end` cluster inside `#navLinks` (so the mobile burger panel still holds
      every link — one container, not two)
- [x] 0.5 CSS: `.nav` → `justify-content:flex-start`; `.nav__links{flex:1}`;
      `.nav__end{margin-left:auto}` on desktop
- [x] 0.6 CSS mobile (≤900px): reset `.nav__end` to column / full-width so the burger panel
      is unchanged in behaviour
- [x] 0.7 Check nav does not overflow at 1024–1280px with the extra long
      "Élever Performance Lab" label (allow a step-down in font-size/gap)
- [x] 0.8 Verify both nav states (transparent-over-dark-head and `.scrolled` solid)
- [x] 0.9 Verify `is-current` highlighting still works for every page key

---

## 1. REGULAR CLASSES (`classes.html`, `assets/js/pages.js`, `assets/js/data.js`)

### 1a. Nav dropdown
- [x] 1.1 Remove the note "Weekly group and private coaching" under *Regular classes*
      (`site.js` NAV children)
- [x] 1.2 Make `nav__menu-item` render correctly when a child has **no** `note`
      (no empty `<small>` element)

### 1b. Page head
- [x] 1.3 Remove the breadcrumb `Home · Classes` (`.phead__crumbs`)
- [x] 1.4 Remove the "Looking for camps?" ghost button from `.phead__actions`
- [x] 1.5 Check `.phead__actions` still lays out correctly with a single button

### 1c. Development Pathways section
- [x] 1.6 Remove the kicker line "The four E's"
- [x] 1.7 Capitalise: `Development pathways` → **Development Pathways**
- [x] 1.8 Remove "Photo 1" — interpreted as the **`#pathsRail` progression strip**
      (the `Exploration → Essentials → Emergence → Elite` rail above the cards).
      *Client to confirm — see §11 Questions.*
- [x] 1.9 Remove the now-contradictory sub-line "A staircase, not a menu. Every beginner
      starts on step 1 at Exploration and climbs one step at a time…" (it describes the
      staircase being removed)
- [x] 1.10 Replace the ascending **staircase** layout with **4 equal boxes in one row**
- [x] 1.11 Add a **right arrow (→) between** each pair of boxes (3 arrows total)
- [x] 1.12 Remove `--step` offsets, `.path__riser`, `.path__rise`, "Step N of 4" label
- [x] 1.13 Equal-height boxes (grid `align-items:stretch`, identical padding)
- [x] 1.14 Tablet fallback: 2×2 grid, arrows still read left→right within a row
- [x] 1.15 Mobile fallback: 1 column, arrows rotate to point **down**
- [x] 1.16 Delete the point-form bullet list inside each card (`path__learn` / `p.learn`)
- [x] 1.17 Delete the generated "Progresses to <E>" line (`.path__next`)
- [x] 1.18 Delete the generated "Top of the pathway" line (`.path__next--top`)
- [x] 1.19 Rewrite each pathway's copy to match the Google Doc **exactly**, keeping the
      doc's paragraph breaks. New per-card shape:
      `name → headline (caps) → hook → body paragraph → closing line`
  - [x] 1.19a **EXPLORATION** — headline `DISCOVER THE GAME. EXPERIENCE ÉLEVER.` ·
        hook `New to badminton? Start here.` · body `EXPLORATION is our entry programme
        for new students. It introduces badminton in a safe, engaging, and structured
        environment, helping players build confidence while experiencing Élever
        Badminton's coaching approach.` · closing `Recommended progression into ESSENTIALS.`
  - [x] 1.19b **ESSENTIALS** — headline `BUILD THE FOUNDATION. MASTER THE BASICS.` ·
        hook `Ready to take your game further?` · body `ESSENTIALS is designed for players
        who have grasped the basics and are ready to strengthen their foundations. The
        programme focuses on solid footwork, proper grips, and reliable technique, helping
        players play with confidence and consistency.` · closing `Progression into
        EMERGENCE upon assessment.`
  - [x] 1.19c **EMERGENCE** — headline `REFINE YOUR SKILLS. RAISE YOUR GAME.` ·
        hook `Take it to the next level.` · body `EMERGENCE helps players move beyond the
        basics and explore the tactical side of the game. Through structured drills,
        guided match scenarios, and focused coaching, players develop greater consistency,
        strategic thinking, and adaptability on court.` · closing `Selection into ELITE
        based on readiness.`
  - [x] 1.19d **ELITE** — headline `PERFORM WITH PURPOSE. COMPETE WITH CONFIDENCE.` ·
        **no hook line** (the doc has none) · body `For athletes aiming to reach their
        highest potential, ELITE focuses on advanced skills, tactical understanding,
        mental preparation, and competitive performance. Players experience high-intensity
        training, match simulations, and individualised guidance to maximise growth and
        readiness for tournaments.` · closing `Step into your full potential.`
- [x] 1.20 Restructure the `PATHWAYS` entries in `data.js` to carry
      `headline` / `hook` / `body` / `closing` (drop `tag`, `learn`)
- [x] 1.21 Keep each card's CTA link (Exploration → camps page, per the doc)
- [x] 1.22 Keep the `01–04` numbering (not flagged for removal)
- [x] 1.23 Update the `.path*` CSS in `pages.css`; delete now-dead stair/rail rules
- [x] 1.24 Reduced-motion + keyboard focus order still sane

### 1d. Class Type section (was "Group class or private class")
- [x] 1.25 Remove kicker "Two ways to train"
- [x] 1.26 Change heading `Group class or private class` → **Class Type**
- [x] 1.27 Remove the button inside the **Group Class** card
      ("See days, times and venues")
- [x] 1.28 Remove the button inside the **Private Class** card
      ("Enquire about private coaching")
- [x] 1.29 Remove the `Trial session / Video analysis / Competition preparation` list
      from the Private Class card
- [x] 1.30 Check `.duo__card` still looks balanced with no button / no list

### 1e. Trial and placement
- [x] 1.31 Remove the **entire** "Getting started / Trial and placement" section
      (heading, prose, and the "Book a trial class" button)

### 1f. Class Locations
- [x] 1.32 Remove kicker "Where we run"
- [x] 1.33 Capitalise: `Class locations` → **Class Locations**
- [x] 1.34 Remove the sub-line "Every venue where Élever runs weekly classes, with the day,
      time and level of play."
- [x] 1.35 Remove "Nearest MRT: …" from every venue card (`.vcard__addr`)
- [x] 1.36 Remove the MRT/LRT line from the **map popup** too
- [x] 1.37 Consider dropping the now-unused `mrt` field from `data.js` (keep the data,
      just stop rendering it — cheaper to restore later)
- [x] 1.38 Make the **address itself** a clickable Google Maps link in each venue card
- [x] 1.39 Remove the separate "Open in Google Maps ↗" action button from each card
- [x] 1.40 Do the same in the map popup (address is the link; no duplicate button)
- [x] 1.41 Check `.vcard__actions` layout with only the "Book this class" link left
- [x] 1.42 Sort the venue list **alphabetically by venue name** (A→Z)
- [x] 1.43 Use a locale-aware sort so `Singapore Chinese Girls' School` (curly apostrophe)
      sorts correctly
- [x] 1.44 Confirm sorting does not break the level filter, the count line, or the map pins

---

## 2. CAMPS (`camps.html`, `pages.js`, `data.js`)

- [x] 2.1 Remove the note "Holiday Exploration camps" from the *Camps* nav dropdown item
- [x] 2.2 Remove the breadcrumb `Home · Classes · Camps`
- [x] 2.3 Upcoming camp title: `Holiday Exploration Camp` →
      **`2026 September Holidays Exploration Camp`** (in `data.js`)
- [x] 2.4 Register button: `Register for this camp` → **`Register`**
- [x] 2.5 Capitalise pricing labels: `Standard pricing` → **Standard Pricing**,
      `Closing pricing` → **Closing Pricing**
- [x] 2.6 Show the "Tell me when the next camp opens" waitlist form **only when
      `CAMPS.upcoming` is empty**
- [x] 2.7 When a camp IS on sale, the camp card must fill the section cleanly
      (the `.cols2` grid currently assumes two children)
- [x] 2.8 When there is NO camp, the waitlist form must still render and look right
- [x] 2.9 Remove the kicker "Previously" above the camp photos
- [x] 2.10 Change heading `Past camps` → **Highlights from Previous Camps**
- [x] 2.11 Remove the media-consent paragraph ("Photographs of identifiable students are
      only published where written media consent has been given…")
- [x] 2.12 Camp gallery placeholders stay as-is (no real camp photos supplied)

---

## 3. EVENTS (`events.html`, `pages.js`, `data.js`)

- [x] 3.1 Remove the breadcrumb `Home · Events`
- [x] 3.2 Remove the H1 "We run badminton events for you."
- [x] 3.3 Remove the lead paragraph "Carnivals, clinics and competitions organised as a
      service for companies, schools, community clubs and organisations across Singapore.
      Bring us a date and a headcount — we bring everything else."
- [x] 3.4 Remove the 2 buttons below it ("Request a proposal", "See our work")
- [x] 3.5 3.2–3.4 empty the `.phead` band → remove the whole `<section class="phead">`
- [x] 3.6 Page must still have exactly one `<h1>` — add a visually-hidden
      `<h1>Badminton events</h1>` (or promote the section head) so SEO/a11y is not broken
- [x] 3.7 Verify the nav renders correctly with no `.phead` (site.js adds `.scrolled`
      instead of `has-dark-head`)
- [x] 3.8 Remove the H2 "Carnivals, clinics and competitions" under "What we organise"
      (keep the "What we organise" kicker)
- [x] 3.9 Remove the whole **"Service provided / Plan, run and wrap."** section
      (`.suitebar` + `#eventServices`, including its "Request a proposal" button)
- [x] 3.10 Leave `EVENT_SERVICES` in `data.js` (unused) so it is easy to restore
- [x] 3.11 Remove the kicker "Our work"
- [x] 3.12 Change heading `Upcoming` → **Upcoming Events**
- [x] 3.13 Remove the kicker "Event photos"
- [x] 3.14 Change heading `Highlights from recent events` → **Past Events**
- [x] 3.15 Remove the sub-line "A curated look at the carnivals, clinics and activations we
      have delivered for community partners, schools and brands."
- [x] 3.16 Showcase type `School clinic` → **Clinic** (ÉB @ Northbrooks Secondary School)
- [x] 3.17 Showcase type `Festival activation` → **Carnival**
      (ÉB @ KFF Singapore Badminton Open 2025)
- [x] 3.18 Remove the "Previously" heading and **everything after it** — i.e. the whole
      `#eventsPast` grouped log (Carnivals / Clinics lists)
- [x] 3.19 Leave `EVENTS_PAST` in `data.js` (unused) so it is easy to restore
- [x] 3.20 Move the **"Trusted by"** section up so it sits directly **below the 3 cards**
      of "What we organise" (Carnivals / Clinics / Competitions)
- [x] 3.21 Check the alternating `psec--alt` banding still reads correctly after the move
      and the two section removals
- [x] 3.22 Verify the photo lightbox still initialises after the DOM changes

---

## 4. PERFORMANCE LAB (`lab.html`)

- [x] 4.1 Nav label → **Élever Performance Lab** (same change as 0.3)
- [x] 4.2 Address block follows the Google Doc exactly:
      line 1 `Singapore 534635`, line 2 `#01-03`
      (drop the "767 Upper Serangoon Road" line from this page's display)
- [x] 4.3 Make the address a clickable link to the Google Business profile
      `https://share.google/c47J8gToXl1Bndw4P`
- [x] 4.4 Remove the "View on Google Maps" button
- [x] 4.5 Replace the "Follow for updates" button with a plain **Instagram icon** linking
      to the **Élever Performance Lab** Instagram page
- [x] 4.6 Inline SVG icon (no icon font / no external request), accessible label,
      visible focus ring, works on the dark `is-dark` page
- [!] 4.7 `[!]` **Need the EPL Instagram URL** — the site currently only has
      `instagram.com/eleverbadminton`. See §11 Questions.
- [x] 4.8 Keep the JSON-LD `PostalAddress` complete (street address stays in structured
      data even though it is not displayed)

---

## 5. SG HUB — hide, do not delete

- [x] 5.1 Remove the `SG Hub` item from the main nav (`site.js` NAV)
- [x] 5.2 Remove the `SG Badminton Hub` link from the footer "Élever" column
- [x] 5.3 Remove `hub.html` from `sitemap.xml`
- [x] 5.4 Add `<meta name="robots" content="noindex,nofollow">` to `hub.html`
- [x] 5.5 **Keep `hub.html` and all its data/JS/CSS intact** — the page must still work if
      opened directly, ready to be re-linked later
- [x] 5.6 Sweep for any other internal link to `hub.html` and remove/neutralise it
- [x] 5.7 Leave a short comment in `site.js` saying why SG Hub is commented out and how
      to bring it back

---

## 6. NEWS (`news.html`, `pages.js`, `data.js`, `news.txt`)

### 6a. Page head
- [x] 6.1 Remove the breadcrumb `Home · News`
- [x] 6.2 Change H1 `News & articles.` → **`News.`**
- [x] 6.3 Remove the lead "Coaching tips, guides for parents, and what is happening in
      Singapore badminton — written by the people who coach it."
- [x] 6.4 Update `<title>` / meta description to match (no "& Articles")

### 6b. Replace the 3 placeholder articles with the 2 real ones from `news.txt`
- [x] 6.5 Delete all 3 placeholder `ARTICLES` entries
      (racket for your child / ActiveSG court / first five sessions)
- [x] 6.6 Strip the copied site-chrome junk from the top of each article in `news.txt`
      ("Skip to Content / ÉLEVER BADMINTON / Classes / Events / News / About / Sign Up")
- [x] 6.7 **Article 1** — `Bronze Builds Belief for Para Badminton Athlete Lim`
      · 30 Jan 2026 · by Jeremiah Ong
- [x] 6.8 **Article 2** — `An completes Malaysia Open three-peat as Kunlavut claims maiden
      Super 1000 title` · 13 Jan 2026 · by Jeremiah Ong
- [x] 6.9 Confirm the years (both dated "30 Jan" / "13 Jan" with no year in source;
      internal references — 2025 ASEAN Para Games, Dec BWF Tour Finals, Feb 2026 Worlds —
      put both in **January 2026**). Flag to client.
- [x] 6.10 Give each a slug, category, read-time and excerpt
- [x] 6.11 Add an `author` field (`Jeremiah Ong`) — new field, render it on the card
- [x] 6.12 Remove the `placeholder: true` flag so the "sample" chip disappears
- [x] 6.13 Check the category filter bar renders sensibly with only 2 categories

### 6c. Make the articles actually readable
- [x] 6.14 The current cards are not clickable and there are no article pages — build them,
      mirroring the existing `coaches/<slug>.html` pattern
- [x] 6.15 Store full article bodies (array of paragraphs, with sub-headings preserved)
      in `data.js`
- [x] 6.16 Preserve article 2's internal sub-headings: `An-touchable`,
      `Kunlavut claims his Super 1000 moment`, `Early exits and home heartbreak`,
      `Men's doubles — so close yet so far`
- [x] 6.17 Preserve blockquote-style pull quotes where the source has them
- [x] 6.18 Write `tools/build-news.js` (mirroring `tools/build-coaches.js`) to generate
      `news/<slug>.html`
- [x] 6.19 Each page: correct `<title>`, meta description, canonical, OG/Twitter tags,
      `NewsArticle` JSON-LD with author + datePublished
- [x] 6.20 `data-base="../"` on the generated pages so nav/footer relative links resolve
- [x] 6.21 Make the news cards link through to the article pages
- [x] 6.22 Photo credits in the source ("Photo: Sport Singapore / Jeremy Lee", "Photo:
      Singapore National Paralympic Council / Goh Siwei", "Photo: Yves Lacroix /
      Badmintonphoto") — **we have no image files**; do not fabricate images.
      Decide: drop the credit lines, or keep them as text. → drop for now, flag to client.
- [x] 6.23 Add the 2 new article URLs to `sitemap.xml`
- [x] 6.24 Article 2 ends "For more badminton-related news, follow Élever Badminton on
      Instagram and Facebook." — keep, and make the two words real links
- [x] 6.25 Run the generator and verify both pages render

---

## 7. ABOUT (`about.html`, `pages.js`, `data.js`, `tools/build-coaches.js`)

- [x] 7.1 Remove the H2 "Enhancing the badminton experience for all."
      (keep the "Our story" kicker and the prose below it)
- [x] 7.2 Remove the kicker "Our people"
- [x] 7.3 Remove the H2 "The coaching team"
- [x] 7.4 Check the coaching-team section still has a sensible top edge with no heading
      (the `Co-founders` / `Our team` sub-labels remain)
- [x] 7.5 Coaches with `profilePage: false` (Eng Chin An, Robin Chio): remove the
      "Profile coming soon" line **and** render them as a non-linked card
- [x] 7.6 Confirm the non-linked card has no hover/pointer affordance and is not
      keyboard-focusable
- [x] 7.7 Square-crop coach photos: source files are 800×1200 (2:3).
      Verify the rendered crop is square on both the About grid and the profile page,
      and fix the focal point if any face is cut
- [x] 7.8 Add `cert: 'BWF Level 1'` to **Loh Kean Hean**
- [x] 7.9 Add `cert: 'BWF Level 1'` to **Shawn Wong**
- [x] 7.10 Re-run `node tools/build-coaches.js` so the profile pages pick the certs up
- [x] 7.11 Remove the H2 "Five pillars" (keep the "What we do" kicker and the grid)

---

## 8. CONTACT (`contact.html`)

- [x] 8.1 Remove **everything from "Before you ask" onwards** — the whole
      `<section>` containing the kicker, the "Frequently asked" H2 and all 7 `<details>`
- [x] 8.2 Confirm `</main>` / footer still close correctly and the last remaining section
      has the right `psec--alt` banding
- [x] 8.3 Leave a comment noting the FAQ was removed pending a decision

---

## 9. CROSS-CUTTING

- [x] 9.1 Bump every `?v=14` cache-busting query string → `?v=15`
      (all HTML pages incl. generated `coaches/*.html` and new `news/*.html`)
- [x] 9.2 Delete now-dead CSS (stairs, rail, suite, elog if unused elsewhere)
- [x] 9.3 Update `sitemap.xml`: drop `hub.html`, add the 2 news article pages
- [x] 9.4 Open every page headless and confirm **zero console errors**
- [x] 9.5 Check responsive at 375 / 768 / 1280 / 1600 — no horizontal overflow
- [x] 9.6 Re-run `node tools/build-coaches.js`
- [x] 9.7 Run the new `node tools/build-news.js`
- [x] 9.8 Delete the stale `temp.md` working file
- [x] 9.9 Commit per change and push to `main` (requested mid-task)

---

## 10. PAGES DELIBERATELY NOT TOUCHED

- `index.html` (home) — no comments given
- `privacy.html` — no comments given
- `hub.html` — hidden from nav only, content untouched (see §5)

---

## 11. QUESTIONS FOR THE CLIENT

1. **"Photo 1"** — the comment list references screenshots I cannot see.
   Interpreted as the **progression rail strip** above the pathway cards
   (`Exploration → Essentials → Emergence → Elite`). Confirm.
2. **"like Photo 2 arrows"** — arrow style is being implemented as a simple
   right-pointing chevron/arrow between equal boxes. Confirm the look.
3. **Élever Performance Lab Instagram URL** — the site only has
   `instagram.com/eleverbadminton`. Send the EPL handle.
4. **Article years** — both `news.txt` articles are dated day+month only;
   inferring **2026** from their content. Confirm.
5. **Article photos** — the source text has 3 photo credits but no image files.
   Send the images if you want them in the articles.
6. **Events page H1** — removing the hero text leaves the page with no visible H1;
   using a visually-hidden one. Say the word if you want a visible heading instead.


---

## 12. STATUS — 29 Aug 2026

Every item above is implemented. Verification done without a browser (none
is installed here): `pages.js` and `site.js` were executed against each
page's real element ids with a DOM shim — all 10 pages plus the generated
coach and article pages render with no thrown errors — and every HTML file
passes a tag-balance check.

**Not machine-verified:** the visual result at 375 / 768 / 1280 / 1600.
The CSS was written for those breakpoints but has not been seen rendered.

---
---

# ROUND 2 — Client Comments (29 Aug 2026)

Second comment list: Regular Classes / Camps / Events / Élever Performance
Lab / About. Camp photos came from the client's Google Drive
**Photos → Camps** folder.

Legend: `[x]` done · `[!]` assumption made — client to confirm

---

## R2.1 REGULAR CLASSES

### Nav dropdown
- [x] R2.1.1 Capitalise the dropdown label `Regular classes` → **Regular Classes**
      (`site.js` NAV children)
- [x] R2.1.2 Match the footer "Train" column link so the label reads the same
      in both places

### Pathway arrows ("UI for arrows")
- [x] R2.1.3 Replace the bare stroke arrow with a filled blue chip (a chevron
      in a circle with a soft accent ring), so the connector reads as designed
      rather than as a stray glyph in the gap
- [x] R2.1.4 Chip rotates to point **down** where the layout stacks — use the
      `rotate` property, not `transform`, so it does not fight the centring
- [x] R2.1.5 Verify desktop (one row, 3 arrows right), tablet ≤1080px
      (2×2, right / down / right) and mobile ≤700px (column, all down)

### Inside each E card
- [x] R2.1.6 Delete the closing pointer line from all four cards — this is the
      "progresses to E***" line on Exploration / Essentials / Emergence
      ("Recommended progression into ESSENTIALS.", "Progression into EMERGENCE
      upon assessment.", "Selection into ELITE based on readiness.") **and**
      the top-of-pathway line on Elite ("Step into your full potential.")
- [x] R2.1.7 Drop the `closing` field from `PATHWAYS` in `data.js`, the
      `.path__closing` render in `pages.js` and its CSS rule
- [x] R2.1.8 Note in the data.js comment why the doc's closing line is not used
- [x] R2.1.9 Keep the per-card CTA; stop the `›` orphaning onto its own line

### Class Type
- [x] R2.1.10 "Class Type" heading is now **secondary** to the card titles:
      new `.psec__head--minor` drops the h2 to a quiet 0.86rem label
- [x] R2.1.11 Raise `Group Class` / `Private Class` to 1.35rem so they carry
      the section
- [x] R2.1.12 Rule placed **after** `.psec h2` — same specificity, so source
      order decides which wins

### Content width
- [x] R2.1.13 `.psec--alt > .psec__inner` was `--maxw` wide *inside* the band's
      own padding, making every banded section ~2× padding wider than the plain
      sections. Capped at `calc(var(--maxw) - 2 * <padding>)`
- [x] R2.1.14 Verified: Development Pathways, Class Type and Class Locations
      share the same left/right edge at 1600 / 1440 / 1024 / 768 / 375

### View by map
- [x] R2.1.15 Restore the List / Map toggle removed in `e9cad71`
- [x] R2.1.16 Restore the Leaflet CSS + JS includes (cdnjs, SRI pinned)
- [x] R2.1.17 Restore the map view, the level-coloured pins, the venue popups
      and the legend
- [x] R2.1.18 Restore the "Leaflet could not load" fallback with its link back
      to the list
- [x] R2.1.19 List stays the **default** view; the map only draws when opened
- [x] R2.1.20 Level filter re-draws the map while it is open
- [x] R2.1.21 Verified with a Leaflet stub: 8 pins, re-draws to 2 on the
      Emergence filter, no thrown errors. The live tiles could not be loaded
      from this sandbox (cdnjs and OpenStreetMap are both blocked here)

---

## R2.2 CAMPS

- [x] R2.2.1 Capitalise `Upcoming camp` → **Upcoming Camp**
- [x] R2.2.2 Content width now matches the rest of the page (same fix as
      R2.1.13 — it is the same banded-section bug)
- [x] R2.2.3 Pull the 7 camp photos from the client's Google Drive
      **Photos → Camps** folder into `assets/img/Photos/Camps/`
- [x] R2.2.4 New `tools/build-camp-photos.sh` exports them to
      `assets/img/camps/` (1600px) + `assets/img/camps/thumb/` (640px),
      matching the events pipeline
- [x] R2.2.5 Add `CAMPS.gallery` + `campPhotoBase` / `campThumbBase` to
      `data.js`, with real per-photo alt text
- [x] R2.2.6 Replace the four "Camp photos coming soon" placeholders with the
      real gallery
- [x] R2.2.7 Generalise `initEventLightbox` → `initLightbox(scope, opts)` so
      camps and events share one viewer with separate photo directories
- [x] R2.2.8 The gallery section hides itself if no photos are supplied, rather
      than showing empty boxes
- [x] R2.2.9 Verified: 7 thumbs, lightbox opens on the clicked photo, arrows
      and Escape work, no 404s

---

## R2.3 EVENTS

- [x] R2.3.1 `Badminton events.` → **`Events.`** (page H1)

---

## R2.4 ÉLEVER PERFORMANCE LAB

- [x] R2.4.1 The page is black, but `body.is-dark` forces the nav into its
      `.scrolled` state, which swapped in the **black** logo — invisible.
      Added `is-dark` rules pinning the white logo in both nav states
- [x] R2.4.2 Verified at 1440 and 375: dark logo opacity 0, light logo 1

---

## R2.5 ABOUT

### Square-crop the photos
- [x] R2.5.1 Root cause found: the coach **profile pages** were never square.
      The generated markup carries `width="640" height="640"`, and that
      presentational height beat `aspect-ratio:1/1`, stretching the portrait
      back to 298×640. Fixed with `height:auto`
- [x] R2.5.2 The crop now lives in the file, not the stylesheet: new
      `tools/build-coach-photos.sh` takes a **centred** square crop of each
      2:3 studio headshot and exports 800×800 to `assets/img/coaches/`
- [x] R2.5.3 All 15 coaches build from one place — Ong Keng Yang and Elsa Lai's
      photos moved from `assets/img/team-*.jpg` into
      `assets/img/Photos/Coaches/` and now follow the same convention
- [x] R2.5.4 `data.js` points both of them at the new files; comment updated
- [x] R2.5.5 Drop `object-position:top center` — with a square file there is
      nothing left for `cover` to trim
- [x] R2.5.6 Re-run `node tools/build-coaches.js`
- [!] R2.5.7 **Assumption:** "like our current one on eleverbadminton.com" —
      the live site is blocked from this sandbox, so the crop was chosen on
      its merits (centred: head, shoulders and folded arms all in frame).
      Say the word if you want it tighter or looser

### One scrollable row
- [x] R2.5.8 `Our team` is now a single row that scrolls right, not four
      wrapped rows (`.coachgrid--rail`)
- [x] R2.5.9 Scroll snapping, a styled thin scrollbar, and `tabindex="0"` +
      an aria-label so the row is keyboard-scrollable
- [x] R2.5.10 Prev / next arrows for mouse users, added by `pages.js` only
      when the row overflows, disabled at each end, hidden on touch and ≤700px
- [x] R2.5.11 Co-founders stay a plain 2-card grid (the comment was about
      "our team")
- [x] R2.5.12 Verified at 1440 / 1024 / 768 / 375: one row, 13 cards, no
      horizontal page overflow, buttons enable and disable correctly

---

## R2.6 CROSS-CUTTING

- [x] R2.6.1 Bump `?v=18` → `?v=19` on all 10 hand-written pages
- [x] R2.6.2 `tools/build-coaches.js` hardcoded `?v=15` and had drifted three
      versions behind — it now uses a `V` constant like `build-news.js`
- [x] R2.6.3 Bump `V` to `'19'` in both generators and regenerate the 13 coach
      pages and 2 article pages
- [x] R2.6.4 README updated for the two new build scripts and the camp photos
- [x] R2.6.5 Every page opened headless at 1600 / 1440 / 1024 / 768 / 375 —
      no JS errors, no 404s, no horizontal overflow

---

## R2.7 NOTED, NOT CHANGED

- The `ON COURT` placeholder on the coach profile pages renders its
  `assets/img/coaches/<slug>/` hint one word per line. It pre-dates this round
  and was not in the comments — say the word and it is a one-line fix.
- `assets/img/team-*.jpg` still holds unreferenced older copies of the coach
  photos. Left alone; safe to delete whenever you want.

---

## R3 PHOTOS — CLASSES, PARTNERS, CAMP MOSAIC (30 Aug 2026)

Élever supplied two more image sets (`assets/img/regular classes/` and
`assets/img/partners/`) after the camp photos landed in R2. Originals moved to
`assets/img/Photos/` with the rest; exports follow the existing one-script-per-set
pattern.

### Regular classes
- [x] R3.1 `bash tools/build-class-photos.sh` — the four brand-tinted portraits
      export to `assets/img/classes/<stage>.jpg` (900px, ~65 KB each)
- [x] R3.2 Each pathway card on `classes.html` now opens with its stage photo,
      full-bleed to the card edges, from `PATHWAYS[].photo` / `.photoAlt`
- [x] R3.3 The image is 4/5 (the ratio supplied) and capped at 400px tall, so it
      crops rather than towers on the 2×2 and single-column layouts
- [x] R3.4 The clip lives on `.path__media`, **not** on `.path` — `overflow:hidden`
      on the card itself zeroes the automatic minimum height and collapses every
      card to a sliver in the single-column layout

### Trusted by
- [x] R3.5 `bash tools/build-partner-logos.sh` — six logos export to
      `assets/img/partners/<slug>.png`, transparency kept
- [x] R3.6 ASICS, People’s Association, Wabi Studios, Truly Nuts, Timber Actually
      and JK Technology render as real marks; the seven partners we only have a
      name for keep the dashed name chip and are listed after them
- [x] R3.7 Chips grew to 84px so a near-square mark is not drawn half the size of
      a wide one; the Truly Nuts logo is centre-cropped off its empty canvas first

### Camp gallery
- [x] R3.8 The seven camp photos are now a mosaic — first tile two columns and
      two rows, tiles at 3/2 (the shape they were shot in) instead of a cropped
      4/3 — so at full width the set fills a five-column grid exactly
- [x] R3.9 `CAMPS.gallery.photos` re-ordered (`alt` re-ordered with it) so the
      lead tile is the strongest action shot and the group photos close the set
- [x] R3.10 Bump `?v=20` → `?v=21`, regenerate the coach and article pages
- [x] R3.11 Verified headless at 1440 / 900 / 430: no 404s on any page, the
      pathway cards, the camp mosaic and both lightboxes seen rendering
