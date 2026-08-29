# Élever Website — Client Comments Checklist (29 Aug 2026)

Source: client comment list (Overall / Regular Classes / Camps / Events / Performance
Lab / SG Hub / News / About / Contact) + `news.txt` (2 real articles) + Google Doc
**"EB Website for Dom" → tab "Write-ups for Development Pathways"**.

Legend: `[ ]` todo · `[x]` done · `[!]` blocked / needs client input

---

## 0. OVERALL — Nav layout (ElevenLabs style)

- [ ] 0.1 Move `Classes`, `Events`, `News`, `About`, `Contact` to the **left**, immediately
      beside the logo
- [ ] 0.2 Keep `Élever Performance Lab` and `Book a class` on the **right**
- [ ] 0.3 Rename nav label `Performance Lab` → `Élever Performance Lab` (see 5.1)
- [ ] 0.4 Restructure `assets/js/site.js` NAV into two groups (`primary` / `end`) and render
      a `.nav__end` cluster inside `#navLinks` (so the mobile burger panel still holds
      every link — one container, not two)
- [ ] 0.5 CSS: `.nav` → `justify-content:flex-start`; `.nav__links{flex:1}`;
      `.nav__end{margin-left:auto}` on desktop
- [ ] 0.6 CSS mobile (≤900px): reset `.nav__end` to column / full-width so the burger panel
      is unchanged in behaviour
- [ ] 0.7 Check nav does not overflow at 1024–1280px with the extra long
      "Élever Performance Lab" label (allow a step-down in font-size/gap)
- [ ] 0.8 Verify both nav states (transparent-over-dark-head and `.scrolled` solid)
- [ ] 0.9 Verify `is-current` highlighting still works for every page key

---

## 1. REGULAR CLASSES (`classes.html`, `assets/js/pages.js`, `assets/js/data.js`)

### 1a. Nav dropdown
- [ ] 1.1 Remove the note "Weekly group and private coaching" under *Regular classes*
      (`site.js` NAV children)
- [ ] 1.2 Make `nav__menu-item` render correctly when a child has **no** `note`
      (no empty `<small>` element)

### 1b. Page head
- [ ] 1.3 Remove the breadcrumb `Home · Classes` (`.phead__crumbs`)
- [ ] 1.4 Remove the "Looking for camps?" ghost button from `.phead__actions`
- [ ] 1.5 Check `.phead__actions` still lays out correctly with a single button

### 1c. Development Pathways section
- [ ] 1.6 Remove the kicker line "The four E's"
- [ ] 1.7 Capitalise: `Development pathways` → **Development Pathways**
- [ ] 1.8 Remove "Photo 1" — interpreted as the **`#pathsRail` progression strip**
      (the `Exploration → Essentials → Emergence → Elite` rail above the cards).
      *Client to confirm — see §11 Questions.*
- [ ] 1.9 Remove the now-contradictory sub-line "A staircase, not a menu. Every beginner
      starts on step 1 at Exploration and climbs one step at a time…" (it describes the
      staircase being removed)
- [ ] 1.10 Replace the ascending **staircase** layout with **4 equal boxes in one row**
- [ ] 1.11 Add a **right arrow (→) between** each pair of boxes (3 arrows total)
- [ ] 1.12 Remove `--step` offsets, `.path__riser`, `.path__rise`, "Step N of 4" label
- [ ] 1.13 Equal-height boxes (grid `align-items:stretch`, identical padding)
- [ ] 1.14 Tablet fallback: 2×2 grid, arrows still read left→right within a row
- [ ] 1.15 Mobile fallback: 1 column, arrows rotate to point **down**
- [ ] 1.16 Delete the point-form bullet list inside each card (`path__learn` / `p.learn`)
- [ ] 1.17 Delete the generated "Progresses to <E>" line (`.path__next`)
- [ ] 1.18 Delete the generated "Top of the pathway" line (`.path__next--top`)
- [ ] 1.19 Rewrite each pathway's copy to match the Google Doc **exactly**, keeping the
      doc's paragraph breaks. New per-card shape:
      `name → headline (caps) → hook → body paragraph → closing line`
  - [ ] 1.19a **EXPLORATION** — headline `DISCOVER THE GAME. EXPERIENCE ÉLEVER.` ·
        hook `New to badminton? Start here.` · body `EXPLORATION is our entry programme
        for new students. It introduces badminton in a safe, engaging, and structured
        environment, helping players build confidence while experiencing Élever
        Badminton's coaching approach.` · closing `Recommended progression into ESSENTIALS.`
  - [ ] 1.19b **ESSENTIALS** — headline `BUILD THE FOUNDATION. MASTER THE BASICS.` ·
        hook `Ready to take your game further?` · body `ESSENTIALS is designed for players
        who have grasped the basics and are ready to strengthen their foundations. The
        programme focuses on solid footwork, proper grips, and reliable technique, helping
        players play with confidence and consistency.` · closing `Progression into
        EMERGENCE upon assessment.`
  - [ ] 1.19c **EMERGENCE** — headline `REFINE YOUR SKILLS. RAISE YOUR GAME.` ·
        hook `Take it to the next level.` · body `EMERGENCE helps players move beyond the
        basics and explore the tactical side of the game. Through structured drills,
        guided match scenarios, and focused coaching, players develop greater consistency,
        strategic thinking, and adaptability on court.` · closing `Selection into ELITE
        based on readiness.`
  - [ ] 1.19d **ELITE** — headline `PERFORM WITH PURPOSE. COMPETE WITH CONFIDENCE.` ·
        **no hook line** (the doc has none) · body `For athletes aiming to reach their
        highest potential, ELITE focuses on advanced skills, tactical understanding,
        mental preparation, and competitive performance. Players experience high-intensity
        training, match simulations, and individualised guidance to maximise growth and
        readiness for tournaments.` · closing `Step into your full potential.`
- [ ] 1.20 Restructure the `PATHWAYS` entries in `data.js` to carry
      `headline` / `hook` / `body` / `closing` (drop `tag`, `learn`)
- [ ] 1.21 Keep each card's CTA link (Exploration → camps page, per the doc)
- [ ] 1.22 Keep the `01–04` numbering (not flagged for removal)
- [ ] 1.23 Update the `.path*` CSS in `pages.css`; delete now-dead stair/rail rules
- [ ] 1.24 Reduced-motion + keyboard focus order still sane

### 1d. Class Type section (was "Group class or private class")
- [ ] 1.25 Remove kicker "Two ways to train"
- [ ] 1.26 Change heading `Group class or private class` → **Class Type**
- [ ] 1.27 Remove the button inside the **Group Class** card
      ("See days, times and venues")
- [ ] 1.28 Remove the button inside the **Private Class** card
      ("Enquire about private coaching")
- [ ] 1.29 Remove the `Trial session / Video analysis / Competition preparation` list
      from the Private Class card
- [ ] 1.30 Check `.duo__card` still looks balanced with no button / no list

### 1e. Trial and placement
- [ ] 1.31 Remove the **entire** "Getting started / Trial and placement" section
      (heading, prose, and the "Book a trial class" button)

### 1f. Class Locations
- [ ] 1.32 Remove kicker "Where we run"
- [ ] 1.33 Capitalise: `Class locations` → **Class Locations**
- [ ] 1.34 Remove the sub-line "Every venue where Élever runs weekly classes, with the day,
      time and level of play."
- [ ] 1.35 Remove "Nearest MRT: …" from every venue card (`.vcard__addr`)
- [ ] 1.36 Remove the MRT/LRT line from the **map popup** too
- [ ] 1.37 Consider dropping the now-unused `mrt` field from `data.js` (keep the data,
      just stop rendering it — cheaper to restore later)
- [ ] 1.38 Make the **address itself** a clickable Google Maps link in each venue card
- [ ] 1.39 Remove the separate "Open in Google Maps ↗" action button from each card
- [ ] 1.40 Do the same in the map popup (address is the link; no duplicate button)
- [ ] 1.41 Check `.vcard__actions` layout with only the "Book this class" link left
- [ ] 1.42 Sort the venue list **alphabetically by venue name** (A→Z)
- [ ] 1.43 Use a locale-aware sort so `Singapore Chinese Girls' School` (curly apostrophe)
      sorts correctly
- [ ] 1.44 Confirm sorting does not break the level filter, the count line, or the map pins

---

## 2. CAMPS (`camps.html`, `pages.js`, `data.js`)

- [ ] 2.1 Remove the note "Holiday Exploration camps" from the *Camps* nav dropdown item
- [ ] 2.2 Remove the breadcrumb `Home · Classes · Camps`
- [ ] 2.3 Upcoming camp title: `Holiday Exploration Camp` →
      **`2026 September Holidays Exploration Camp`** (in `data.js`)
- [ ] 2.4 Register button: `Register for this camp` → **`Register`**
- [ ] 2.5 Capitalise pricing labels: `Standard pricing` → **Standard Pricing**,
      `Closing pricing` → **Closing Pricing**
- [ ] 2.6 Show the "Tell me when the next camp opens" waitlist form **only when
      `CAMPS.upcoming` is empty**
- [ ] 2.7 When a camp IS on sale, the camp card must fill the section cleanly
      (the `.cols2` grid currently assumes two children)
- [ ] 2.8 When there is NO camp, the waitlist form must still render and look right
- [ ] 2.9 Remove the kicker "Previously" above the camp photos
- [ ] 2.10 Change heading `Past camps` → **Highlights from Previous Camps**
- [ ] 2.11 Remove the media-consent paragraph ("Photographs of identifiable students are
      only published where written media consent has been given…")
- [ ] 2.12 Camp gallery placeholders stay as-is (no real camp photos supplied)

---

## 3. EVENTS (`events.html`, `pages.js`, `data.js`)

- [ ] 3.1 Remove the breadcrumb `Home · Events`
- [ ] 3.2 Remove the H1 "We run badminton events for you."
- [ ] 3.3 Remove the lead paragraph "Carnivals, clinics and competitions organised as a
      service for companies, schools, community clubs and organisations across Singapore.
      Bring us a date and a headcount — we bring everything else."
- [ ] 3.4 Remove the 2 buttons below it ("Request a proposal", "See our work")
- [ ] 3.5 3.2–3.4 empty the `.phead` band → remove the whole `<section class="phead">`
- [ ] 3.6 Page must still have exactly one `<h1>` — add a visually-hidden
      `<h1>Badminton events</h1>` (or promote the section head) so SEO/a11y is not broken
- [ ] 3.7 Verify the nav renders correctly with no `.phead` (site.js adds `.scrolled`
      instead of `has-dark-head`)
- [ ] 3.8 Remove the H2 "Carnivals, clinics and competitions" under "What we organise"
      (keep the "What we organise" kicker)
- [ ] 3.9 Remove the whole **"Service provided / Plan, run and wrap."** section
      (`.suitebar` + `#eventServices`, including its "Request a proposal" button)
- [ ] 3.10 Leave `EVENT_SERVICES` in `data.js` (unused) so it is easy to restore
- [ ] 3.11 Remove the kicker "Our work"
- [ ] 3.12 Change heading `Upcoming` → **Upcoming Events**
- [ ] 3.13 Remove the kicker "Event photos"
- [ ] 3.14 Change heading `Highlights from recent events` → **Past Events**
- [ ] 3.15 Remove the sub-line "A curated look at the carnivals, clinics and activations we
      have delivered for community partners, schools and brands."
- [ ] 3.16 Showcase type `School clinic` → **Clinic** (ÉB @ Northbrooks Secondary School)
- [ ] 3.17 Showcase type `Festival activation` → **Carnival**
      (ÉB @ KFF Singapore Badminton Open 2025)
- [ ] 3.18 Remove the "Previously" heading and **everything after it** — i.e. the whole
      `#eventsPast` grouped log (Carnivals / Clinics lists)
- [ ] 3.19 Leave `EVENTS_PAST` in `data.js` (unused) so it is easy to restore
- [ ] 3.20 Move the **"Trusted by"** section up so it sits directly **below the 3 cards**
      of "What we organise" (Carnivals / Clinics / Competitions)
- [ ] 3.21 Check the alternating `psec--alt` banding still reads correctly after the move
      and the two section removals
- [ ] 3.22 Verify the photo lightbox still initialises after the DOM changes

---

## 4. PERFORMANCE LAB (`lab.html`)

- [ ] 4.1 Nav label → **Élever Performance Lab** (same change as 0.3)
- [ ] 4.2 Address block follows the Google Doc exactly:
      line 1 `Singapore 534635`, line 2 `#01-03`
      (drop the "767 Upper Serangoon Road" line from this page's display)
- [ ] 4.3 Make the address a clickable link to the Google Business profile
      `https://share.google/c47J8gToXl1Bndw4P`
- [ ] 4.4 Remove the "View on Google Maps" button
- [ ] 4.5 Replace the "Follow for updates" button with a plain **Instagram icon** linking
      to the **Élever Performance Lab** Instagram page
- [ ] 4.6 Inline SVG icon (no icon font / no external request), accessible label,
      visible focus ring, works on the dark `is-dark` page
- [ ] 4.7 `[!]` **Need the EPL Instagram URL** — the site currently only has
      `instagram.com/eleverbadminton`. See §11 Questions.
- [ ] 4.8 Keep the JSON-LD `PostalAddress` complete (street address stays in structured
      data even though it is not displayed)

---

## 5. SG HUB — hide, do not delete

- [ ] 5.1 Remove the `SG Hub` item from the main nav (`site.js` NAV)
- [ ] 5.2 Remove the `SG Badminton Hub` link from the footer "Élever" column
- [ ] 5.3 Remove `hub.html` from `sitemap.xml`
- [ ] 5.4 Add `<meta name="robots" content="noindex,nofollow">` to `hub.html`
- [ ] 5.5 **Keep `hub.html` and all its data/JS/CSS intact** — the page must still work if
      opened directly, ready to be re-linked later
- [ ] 5.6 Sweep for any other internal link to `hub.html` and remove/neutralise it
- [ ] 5.7 Leave a short comment in `site.js` saying why SG Hub is commented out and how
      to bring it back

---

## 6. NEWS (`news.html`, `pages.js`, `data.js`, `news.txt`)

### 6a. Page head
- [ ] 6.1 Remove the breadcrumb `Home · News`
- [ ] 6.2 Change H1 `News & articles.` → **`News.`**
- [ ] 6.3 Remove the lead "Coaching tips, guides for parents, and what is happening in
      Singapore badminton — written by the people who coach it."
- [ ] 6.4 Update `<title>` / meta description to match (no "& Articles")

### 6b. Replace the 3 placeholder articles with the 2 real ones from `news.txt`
- [ ] 6.5 Delete all 3 placeholder `ARTICLES` entries
      (racket for your child / ActiveSG court / first five sessions)
- [ ] 6.6 Strip the copied site-chrome junk from the top of each article in `news.txt`
      ("Skip to Content / ÉLEVER BADMINTON / Classes / Events / News / About / Sign Up")
- [ ] 6.7 **Article 1** — `Bronze Builds Belief for Para Badminton Athlete Lim`
      · 30 Jan 2026 · by Jeremiah Ong
- [ ] 6.8 **Article 2** — `An completes Malaysia Open three-peat as Kunlavut claims maiden
      Super 1000 title` · 13 Jan 2026 · by Jeremiah Ong
- [ ] 6.9 Confirm the years (both dated "30 Jan" / "13 Jan" with no year in source;
      internal references — 2025 ASEAN Para Games, Dec BWF Tour Finals, Feb 2026 Worlds —
      put both in **January 2026**). Flag to client.
- [ ] 6.10 Give each a slug, category, read-time and excerpt
- [ ] 6.11 Add an `author` field (`Jeremiah Ong`) — new field, render it on the card
- [ ] 6.12 Remove the `placeholder: true` flag so the "sample" chip disappears
- [ ] 6.13 Check the category filter bar renders sensibly with only 2 categories

### 6c. Make the articles actually readable
- [ ] 6.14 The current cards are not clickable and there are no article pages — build them,
      mirroring the existing `coaches/<slug>.html` pattern
- [ ] 6.15 Store full article bodies (array of paragraphs, with sub-headings preserved)
      in `data.js`
- [ ] 6.16 Preserve article 2's internal sub-headings: `An-touchable`,
      `Kunlavut claims his Super 1000 moment`, `Early exits and home heartbreak`,
      `Men's doubles — so close yet so far`
- [ ] 6.17 Preserve blockquote-style pull quotes where the source has them
- [ ] 6.18 Write `tools/build-news.js` (mirroring `tools/build-coaches.js`) to generate
      `news/<slug>.html`
- [ ] 6.19 Each page: correct `<title>`, meta description, canonical, OG/Twitter tags,
      `NewsArticle` JSON-LD with author + datePublished
- [ ] 6.20 `data-base="../"` on the generated pages so nav/footer relative links resolve
- [ ] 6.21 Make the news cards link through to the article pages
- [ ] 6.22 Photo credits in the source ("Photo: Sport Singapore / Jeremy Lee", "Photo:
      Singapore National Paralympic Council / Goh Siwei", "Photo: Yves Lacroix /
      Badmintonphoto") — **we have no image files**; do not fabricate images.
      Decide: drop the credit lines, or keep them as text. → drop for now, flag to client.
- [ ] 6.23 Add the 2 new article URLs to `sitemap.xml`
- [ ] 6.24 Article 2 ends "For more badminton-related news, follow Élever Badminton on
      Instagram and Facebook." — keep, and make the two words real links
- [ ] 6.25 Run the generator and verify both pages render

---

## 7. ABOUT (`about.html`, `pages.js`, `data.js`, `tools/build-coaches.js`)

- [ ] 7.1 Remove the H2 "Enhancing the badminton experience for all."
      (keep the "Our story" kicker and the prose below it)
- [ ] 7.2 Remove the kicker "Our people"
- [ ] 7.3 Remove the H2 "The coaching team"
- [ ] 7.4 Check the coaching-team section still has a sensible top edge with no heading
      (the `Co-founders` / `Our team` sub-labels remain)
- [ ] 7.5 Coaches with `profilePage: false` (Eng Chin An, Robin Chio): remove the
      "Profile coming soon" line **and** render them as a non-linked card
- [ ] 7.6 Confirm the non-linked card has no hover/pointer affordance and is not
      keyboard-focusable
- [ ] 7.7 Square-crop coach photos: source files are 800×1200 (2:3).
      Verify the rendered crop is square on both the About grid and the profile page,
      and fix the focal point if any face is cut
- [ ] 7.8 Add `cert: 'BWF Level 1'` to **Loh Kean Hean**
- [ ] 7.9 Add `cert: 'BWF Level 1'` to **Shawn Wong**
- [ ] 7.10 Re-run `node tools/build-coaches.js` so the profile pages pick the certs up
- [ ] 7.11 Remove the H2 "Five pillars" (keep the "What we do" kicker and the grid)

---

## 8. CONTACT (`contact.html`)

- [ ] 8.1 Remove **everything from "Before you ask" onwards** — the whole
      `<section>` containing the kicker, the "Frequently asked" H2 and all 7 `<details>`
- [ ] 8.2 Confirm `</main>` / footer still close correctly and the last remaining section
      has the right `psec--alt` banding
- [ ] 8.3 Leave a comment noting the FAQ was removed pending a decision

---

## 9. CROSS-CUTTING

- [ ] 9.1 Bump every `?v=14` cache-busting query string → `?v=15`
      (all HTML pages incl. generated `coaches/*.html` and new `news/*.html`)
- [ ] 9.2 Delete now-dead CSS (stairs, rail, suite, elog if unused elsewhere)
- [ ] 9.3 Update `sitemap.xml`: drop `hub.html`, add the 2 news article pages
- [ ] 9.4 Open every page headless and confirm **zero console errors**
- [ ] 9.5 Check responsive at 375 / 768 / 1280 / 1600 — no horizontal overflow
- [ ] 9.6 Re-run `node tools/build-coaches.js`
- [ ] 9.7 Run the new `node tools/build-news.js`
- [ ] 9.8 Delete the stale `temp.md` working file
- [ ] 9.9 Do **not** commit/push unless asked

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
