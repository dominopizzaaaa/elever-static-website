# Élever Website — Change Checklist

Tracking file for the multi-part change requested on 29 Aug 2026.
Legend: `[ ]` todo · `[x]` done · `[!]` blocked / needs the client

---

## 1. Nav logo too small
- [x] 1.1 Measure current `.nav__logo__mark` box (142×30px) in `assets/css/style.css`
- [x] 1.2 Increase logo box for desktop (target ~190×40px)
- [x] 1.3 Add responsive step-downs so it never overlaps the burger on mobile
- [x] 1.4 Increase nav height / padding so the bigger mark is not cropped
- [x] 1.5 Check the scrolled (solid) and transparent nav states both look right
- [x] 1.6 Check the footer brand mark scales consistently

## 2. Tagline spacing — "Enhance your skills.Enjoy the process.Elevate your experience."
- [x] 2.1 Find every render of the tagline (index hero, index cards, about, footer, meta tags)
- [x] 2.2 Fix the run-together instance(s) — grid cards on index have no visible separator
- [x] 2.3 Confirm footer + meta descriptions read with proper sentence spacing

## 3. Classes — make the four E's read as progressive stairs
- [x] 3.1 Design a stair layout: each step sits higher than the previous one
- [x] 3.2 Rebuild `pathways()` renderer in `assets/js/pages.js` with a stairs structure
- [x] 3.3 Add a rising connector / arrow between steps showing upward progression
- [x] 3.4 Add explicit "Step 1 → Step 2 → …" and "progresses to" language
- [x] 3.5 Write the `.stairs` CSS (desktop stair offsets via `--step`)
- [x] 3.6 Tablet fallback (2-up) that still reads as ascending
- [x] 3.7 Mobile fallback — vertical ladder, ascending, with connector line
- [x] 3.8 Add a compact "pathway rail" summary above the cards (Exploration → Elite)
- [x] 3.9 Verify keyboard focus order and reduced-motion behaviour

## 4. Remove "SAMPLE" and "Available" labels
- [x] 4.1 Remove `placeholder: true` from all `CLASSES` entries in `assets/js/data.js`
- [x] 4.2 Remove `status: 'Available'` from every session object
- [x] 4.3 Drop the `.vcard__status` render branch in `pages.js` (no status = no chip)
- [x] 4.4 Sweep other pages for stray `sample` tags that should go (camps / articles)
- [x] 4.5 Confirm `sampleTag()` still exists for genuinely unverified data

## 5. Class locations — real Google Map with coloured pins
- [x] 5.1 Replace the fake CSS "island" map with a real interactive map
- [x] 5.2 Choose a no-API-key option (Leaflet + OpenStreetMap tiles via CDN)
- [x] 5.3 Verify/correct lat-lng for every class venue in `data.js`
- [x] 5.4 Colour pins by level: Essentials = blue, Emergence = green, both = split
- [x] 5.5 Popup per pin: venue, address, sessions, Book + Google Maps links
- [x] 5.6 Legend that matches the pin colours
- [x] 5.7 Re-filter the map when the level filter changes
- [x] 5.8 Lazy-init the map only when the Map tab is opened
- [x] 5.9 Graceful fallback if the tile CDN is blocked

## 6. Events — "Service provided / Plan, run and wrap" takes too much height
- [x] 6.1 Change `.suite` from 2×2 to a 4-across horizontal row
- [x] 6.2 Move the heading above the row instead of beside it (kills the tall split)
- [x] 6.3 Tighten padding/typography on `.suite__item`
- [x] 6.4 Responsive: 4 → 2 → 2 columns, never 1-per-row stack of tall cards
- [x] 6.5 Verify total section height is meaningfully reduced

## 7. Events photos — click through to full-size galleries
- [x] 7.1 Export every source photo (not just 4) per event to `assets/img/events/`
- [x] 7.2 Generate web-sized versions with `sips` (max 1600px, quality-tuned)
- [x] 7.3 Generate small thumbnails for the grid (max 640px)
- [x] 7.4 Update `EVENT_SHOWCASE` in `data.js` with full photo arrays
- [x] 7.5 Upgrade the lightbox: counter, thumbnail strip, keyboard nav, focus trap
- [x] 7.6 Lightbox shows the full-size image, thumbs use the small ones
- [x] 7.7 "View all N photos" button on each card
- [x] 7.8 Preload adjacent images for smooth stepping
- [x] 7.9 Restore focus to the trigger on close
- [x] 7.10 Swipe support on touch devices

## 8. SG Hub — improve the Team Singapore page UI
- [x] 8.1 Expand the roster beyond 3 cards to the real national squad
- [x] 8.2 Group by discipline (MS / WS / MD / WD / XD)
- [x] 8.3 Show world ranking prominently on each player card
- [x] 8.4 Add a "next competitions" block
- [x] 8.5 Add a news feed block (ties into item 10)
- [x] 8.6 Redesign card visuals — ranking badge, discipline chip, cleaner links
- [x] 8.7 Responsive grid + reduced-motion safety

## 9. SG Hub — 2026 season tracker is wrong / must self-update
- [x] 9.1 Audit the current tournament list against the real 2026 BWF calendar
- [x] 9.2 Fix wrong dates and missing events; add per-event result links
- [x] 9.3 Root cause: every past event says "Results to be confirmed" because no
        result data exists — add a real `champions` field per completed event
- [x] 9.4 Populate champions for completed 2026 events (research required)
- [x] 9.5 Build a self-updating layer: fetch live results at page load
- [x] 9.6 Pick a CORS-safe public data source for BWF results
- [x] 9.7 Cache fetched results in `localStorage` with a TTL
- [x] 9.8 Fall back to the baked-in data when the fetch fails (never show a blank)
- [x] 9.9 Show a "last updated" stamp driven by real data, not a hardcoded date
- [x] 9.10 Make status (done/live/upcoming) derive from the real clock — verify
- [x] 9.11 Remove the stale "Updated 7 Aug 2026" string

## 10. SG Hub — live rankings, upcoming competitions, player news
- [x] 10.1 Add per-player ranking data (world ranking + points) to a data file
- [x] 10.2 Add an upcoming-competitions list for the national team
- [x] 10.3 Add a news panel pulling stories about SG players
- [x] 10.4 Choose a CORS-safe news source (RSS via a public JSON proxy)
- [x] 10.5 Cache + fall back to curated links when the feed fails
- [x] 10.6 Make it clear which numbers are live and which are last-known

## 11. Fix broken / missing booking links for these venues
Each needs: verify the real booking URL, correct label, correct in `main.js`
(and `data.js` where the venue is also an Élever class venue).
- [x] 11.1 Wyse Active Hub
- [x] 11.2 The Sports Arina @ Jalan Kayu
- [x] 11.3 Singapore Badminton Hall (SBH @ Sims)
- [x] 11.4 SBH East Coast @ Expo
- [x] 11.5 OBA Arena @ Punggol
- [x] 11.6 KFF Badminton Arena / Singapore Badminton Stadium
- [x] 11.7 Cereza Sports Hall
- [x] 11.8 Kovan Sports Centre
- [x] 11.9 Chinese Swimming Club
- [x] 11.10 Singapore Swimming Club
- [x] 11.11 Warren Golf & Country Club
- [x] 11.12 Anglo-Chinese School (Barker Road)
- [x] 11.13 Bidadari Community Club
- [x] 11.14 Cantonment Primary School
- [x] 11.15 North Vista Primary School
- [x] 11.16 Singapore Chinese Girls' School
- [x] 11.17 Schools/CCs are not public-bookable — give them an honest
        "Élever class venue — book a class" or "not publicly bookable" state
        instead of a dead Book button
- [x] 11.18 Add a `bookNote` field so a venue can explain how booking works
- [x] 11.19 Re-check every OTHER venue's booking link while in there

## Cross-cutting
- [x] X.1 Bump all `?v=` cache-busting query strings
- [x] X.2 Validate every HTML page opens with no console errors
- [x] X.3 Check responsive behaviour at 375 / 768 / 1280 / 1600
- [x] X.4 Re-run `node tools/build-coaches.js` if `data.js` coach data changed
- [ ] X.5 Git commit and push to `main`
- [x] X.6 Report to the user anything that needs their input

---

## Outcome — 29 Aug 2026

All eleven requested changes are implemented, verified in a headless browser
(no console errors on any page, no horizontal overflow at 375 / 768 / 1440).

**Verified in-browser**
- Stairs pathway: 4 ascending steps desktop, 2-up tablet, vertical ladder mobile
- Class map: real Leaflet/OpenStreetMap map, 8 pins placed, colour-coded, popups
- Event galleries: 70 photos across 6 events, full-screen viewer with thumb strip
- Season tracker: 21 completed events now show real champions in all 5 disciplines
- Team Singapore: 5 player cards, ranking badges, next competitions, news links

**Needs Élever's input (could not be settled from public sources)**
1. `Kovan Sports Centre` — kovansports.com has lapsed and now redirects to an
   unrelated overseas site. Linked to a phone number (6286 0256) instead of a
   dead URL. If they have a current booking page, send it over.
2. `Singapore Swimming Club` — the members' booking deep link is behind a
   CAPTCHA gate and the old MembersWeb URL is plain http. Linked to the club
   homepage instead. A member could confirm the correct https booking URL.
3. `Playtomic` deep links (SBH @ Sims, SBH East Coast @ Expo, TSA @ Jalan Kayu)
   were taken from Singapore Badminton Hall's own site, but Playtomic blocks
   automated checks, so they were not machine-verified. Worth one manual click.
4. Class **prices** are still not published anywhere on the site. If you want
   them shown on the venue cards, send the rate card.
5. Player **world rankings** in the Team Singapore panel are last-known figures
   labelled with the month they were true (Loh Kean Yew #14, Yeo Jia Min #38,
   both May 2026). Rankings are not available from any CORS-open free API, so
   these are updated by hand in `assets/js/data.js` → `TEAM_SG`; the panel links
   to the live BWF page for the current number rather than claiming these are live.
6. Coach bios still flagged `sample`: **Eng Chin An** ("To write soon") and
   **Robin Chio**. Those tags disappear as soon as the real bios are added.
7. The three **News** articles are still placeholders — they render with a
   "sample" tag until real articles are written.
