# Élever Badminton — Redesign Checklist

Working from the Google Docs content page + the reference/comment list.
Status: `[ ]` todo · `[x]` done

---

## A. Removals (explicitly asked for)

- [x] A1. Remove the **Play** page entirely (`play.html`, nav entry, footer entry, sitemap)
- [x] A2. Remove the **custom cursor** — restore the normal system cursor
      (main.js §3, `body{cursor:none}` rules in style.css)
- [x] A3. Remove the **language switcher** / i18n (site.js LANG_MENU, `assets/js/i18n.js`,
      all `data-i18n` / `data-i18n-html` attributes, `.lang*` CSS, `html.lang-*` font stacks)
- [x] A4. Remove the dead **quiz / rally / reflex** CSS + JS left behind by A1
- [x] A5. Remove the leftover **search overlay / breadcrumb / scrollspy** block in main.js
      (no `#searchToggle` exists on any page — dead code)
- [x] A6. Locations = **maps only or list only** — drop the side-by-side "Map + list"
      default; ship a single clean toggle with list as the default view

## B. Copy trim (too many AI descriptions)

- [x] B1. Home: drop the "Two of them are how you train with us…" sub under *What we do*
- [x] B2. Classes: drop the "Four progressive stages. Each one has a clear entry point…"
      sub under *Development pathways*
- [x] B3. Sweep every page for invented filler paragraphs not in the Google Doc;
      keep the doc's wording verbatim where the doc supplies it
- [x] B4. Remove all "For Élever:" note-strips (internal notes, not public copy)
- [x] B5. Remove the sample-review carousel + disclaimer from Home (placeholder quotes)

## C. Content from the Google Doc

### Home
- [x] C1. "What is Élever" — definition block exactly as the doc:
      `/eləve/ • v.` · (french translation of elevate) · to build or raise; bring
      something to a higher position
- [x] C2. Tagline: *Enhance your skills. Enjoy the process. Elevate your experience.*
- [x] C3. Link to About page
- [x] C4. Summary of what we do → 5 pillars (Classes, Camps, Carnivals, Clinics,
      Competitions), each clickable to its page

### Classes
- [x] C5. Two sections: **Regular Classes** and **Camps** (doc calls them Dropdown 1 / 2)
- [x] C6. Regular classes intro — doc's two paragraphs verbatim
- [x] C7. Development Pathways — Exploration / Essentials / Emergence / Elite;
      Exploration CTA leads to the Camps page
- [x] C8. Group Class vs Private Class — doc write-ups verbatim
- [x] C9. Trial and Placement — doc write-up verbatim
- [x] C10. Private class services — Trial, video analysis, competition prep
- [x] C11. Locations: map **or** list (see A6), each pin/row = days, timings, level

### Camps
- [x] C12. What we do at an Exploration camp
- [x] C13. Upcoming: 7–11 Sep 2026 · Aljunied, Novena, Sengkang, Serangoon
      · signup www.eleverbadminton.com/hec202609
      · Standard $228 until 31 Aug, Closing $248 until 6 Sep · 6 students : 1 coach
- [x] C14. Photos of previous camps (placeholder frames, no fake data)

### Events
- [x] C15. Three event types we organise: Carnivals, Clinics, Competitions
- [x] C16. Upcoming (card style): SingHealth Presidents' Challenge Sports Day 2026
      — client SingHealth Community Hospitals; badminton + pickleball tournament
      and clinics
- [x] C17. Previous events — full real list from the doc (2 carnivals, 10 clinics)
- [x] C18. Service provided: all-in-one event management suite
- [x] C19. "Trusted by" partner logo strip
- [x] C20. Frame the page as a **service for corporate**, not self-promotion

### Élever Performance Lab  (NEW PAGE, black)
- [x] C21. New `lab.html` — black page, middle-aligned big **OPENING SOON**,
      small address below: SEE YOU AT / 767 Upper Serangoon Road #01-03 /
      Singapore 534635
- [x] C22. Add to nav + footer + sitemap

### About
- [x] C23. Definition + tagline (same block as Home)
- [x] C24. Founder write-up verbatim from the doc (founded June 2023 by
      Loh Kean Hean and Eng Chin An…)
- [x] C25. Team of coaches → clickable to their own pages
- [x] C26. The 5 pillars
- [x] C27. Contact info: info@eleverbadminton.com · WhatsApp +65 8921 4221
      (wa.me/6589214221)

### Global
- [x] C28. Footer: registered name Elever Sports Pte. Ltd. · UEN 202501591C ·
      address · socials (IG, FB, TikTok, LinkedIn) · Terms link
- [x] C29. Contact page: real email + WhatsApp everywhere (replace
      hello@ / empty wa.me links)
- [x] C30. Colour codes locked to the brand: White #FFFFFF · Black #000000 ·
      Blue #2151D1
- [x] C31. Book A Class button → app.eleverbadminton.com (already correct — verify)

## D. Design pass (ElevenLabs / Catalyc / Protocol Health / Apple)

- [x] D1. Repalette to #2151D1 brand blue; white-based with black + blue details
- [x] D2. **Smaller type, more space** — reduce heading clamps and body size,
      widen breathing room (ElevenLabs sizing)
- [x] D3. ElevenLabs-style curves + buttons — smaller radii on cards, pill buttons
      kept but tightened
- [x] D4. ElevenLabs-style **two-column page splits** as the recurring layout
- [x] D5. Protocol-Health-style alternation of bright and dark sections
      (dark band used deliberately, not everywhere)
- [x] D6. Tone down the hero: keep it clean, drop the "move your cursor" hint
      (cursor is gone) and the shuttle-field gimmick if it fights the clean look
- [x] D7. Nav: simplify to the real page set, ElevenLabs-style dropdown for Classes

## E. Housekeeping

- [x] E1. Update `sitemap.xml` (remove play, add lab)
- [x] E2. Update `README.md` to match the new structure
- [x] E3. Bump `?v=` cache-busting on css/js across every page
- [x] E4. Regenerate coach pages (`node tools/build-coaches.js`)
- [x] E5. Verify every page loads with no console errors, no dead links
- [x] E6. Commit + push to `main`
