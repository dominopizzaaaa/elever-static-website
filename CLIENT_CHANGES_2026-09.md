# Élever Badminton — client changes, 9 Sep 2026

This is the working acceptance tracker for the client feedback received on
9 September 2026. A checked item means the implementation and its stated
verification have both been completed. Items marked **client input** remain
visible so they cannot be mistaken for forgotten work.

Legend: `[ ]` queued · `[x]` implemented and verified · `[~]` implemented with
a documented editorial fallback · `[?]` waiting for client input

## 0. Current request addendum

- [x] Add a dedicated Terms and Conditions page using the supplied copy, dated
  1 January 2026, and point the global footer to it.
- [x] Preserve the four approved Trusted by marks and keep the heading visually
  attached to the Events services section.
- [x] Increase the smallest Hub card/list type and standardise navigational
  arrow indicators to arrowheads.
- [x] Pull the complete official ActiveSG badminton directory into a generated
  static dataset, including all listed DUS school halls, direct venue links
  where ActiveSG publishes them, and the official booking-directory fallback.
- [x] Standardise every court-directory time to 24-hour `HH:MM` formatting.
- [~] Keep the existing social-groups fallback because the requested UI remains
  undecided and no verified group schedules or contacts were supplied.
- [x] Change the Contact page header to `Get in touch`, the form heading to
  `Enquiry Form`, expand country codes, capitalise `Group Classes`, and apply
  the supplied blue-outline/transparent send-button treatment.
- [x] Preserve the supplied social URLs and associate the supplied Google
  Business Profile URL with Élever Performance Lab.
- [x] Re-audit the live ActiveSG source page by page: derive all 15 pages from
  its declared count, parse all 147 unique cards, visit all 147 facility detail
  pages, and publish an `All ActiveSG facilities (147)` route alongside the 19
  sport venues and 128 DUS school halls.

## 1. Global design and behaviour

- [x] Keep the approved colour system consistent: primary `#2151d1`, hover
  `#173da2`, active/focus `#4a78e7`, deep navy `#0c1b40`, charcoal `#1a1a1a`,
  border grey `#ccd2db` (the supplied `ccs2db` is not a valid hex value),
  secondary grey `#e0e4ec`, and light UI background `#f4f6f9`.
- [x] Use deep navy for headings on light backgrounds while preserving white
  or gradient headings on dark surfaces.
- [x] Stop faint section separators at the shared content width instead of at
  the viewport edges. Check Classes, Camps, Events, News, About, and Hub.
- [x] Make the approved Élever icon the favicon on every root page, generated
  coach page, and generated news page; add cache-busting and generator support.
- [x] Bump shared CSS/JS cache keys consistently after the release.
- [x] Preserve the later-approved static Home cover (the older photo slideshow
  remains retired) and remove stale slideshow code/documentation.

## 2. Home

- [x] Show `CLASSES` and `EVENTS` in capitals.
- [x] Desktop: keep both CTA buttons side by side at equal width.
- [x] Phone: keep both CTA buttons side by side at the same width as desktop,
  with 44px minimum touch targets.
- [x] Add `ENHANCE YOUR SKILLS. ENJOY THE PROCESS. ELEVATE YOUR EXPERIENCE.`
  below the decorative line: one row on desktop and three rows on phone.
- [x] Verify 320px, 390px, tablet, and desktop widths plus a short phone
  viewport without overflow or overlap.

## 3. Classes and WhatsApp enquiries

- [x] Change the private-class CTA from `Enquire about private classes` to
  `Enquire more`.
- [x] Private CTA opens WhatsApp with the exact approved private-class message.
- [x] Each group-class area CTA opens WhatsApp with the exact approved message,
  replacing `[Location]` with the area shown on that card.
- [x] Phone: keep the Essentials/Emergence class-type chip right-aligned like
  desktop, including repeated-day rows and 320px width.

## 4. Events

- [x] Replace the Trusted by list with only the four supplied logos: ASICS,
  People's Association, Singapore Badminton Association, and SingHealth
  Community Hospitals. Normalise filenames/formats for the web pipeline.
- [x] Integrate the Trusted by heading cleanly with the preceding services
  section instead of presenting it as a heavy standalone band.
- [x] Change all `Request a proposal` CTAs to `Work with us`, including the
  no-upcoming-events fallback.
- [x] `Work with us` opens WhatsApp with the exact approved event message.
- [x] Use an 8px radius on Past Events cover cards.
- [x] Size popup partner/sponsor logos by a consistent bounding box so wide and
  square artwork has comparable optical weight; verify Cuckoo and Noomoo.
- [x] Phone: gallery close button stays fixed, visible, and tappable in portrait
  and landscape; closing the photo returns to the event popup.

## 5. News

- [x] Add visible horizontal and vertical spacing between tag-filter buttons.
- [x] Verify wrapping and active/focus states at 320px and desktop widths.

## 6. Contact

- [x] Remove the `01` and `02` step markers.
- [x] Change the form heading from `Tell us what you need` to `Get in touch`
  and remove the explanatory sentence below it.
- [x] Remove `Your` from the Name label.
- [x] Add a country-code selector beside Mobile, defaulting to Singapore
  (`SG +65`) and retaining common international alternatives.
- [x] Remove `(optional)` wording and identify compulsory fields with an
  asterisk plus a visible required-fields key.
- [x] Replace the old detailed topic list with `Classes`, `Events`, `Careers`,
  and `Others`.
- [x] Remove the `Player details, if relevant` divider and keep all
  enquiry-specific fields hidden and disabled until a topic is selected.
- [x] Classes: require student name, student age, preferred class type (Group
  classes / Private Classes / Holiday Camps), and preferred area; include a
  message field.
- [x] Events: require organisation and event type (Carnival / Clinic /
  Competition); use `Estimated number of participants` for event size and
  include a message field.
- [x] Careers: use the shared required name field, then require age, role of
  interest, relevant experience/qualifications, and availability; include an
  optional CV/portfolio/LinkedIn URL and message.
- [x] Others: show a required message field.
- [x] Remove both `Usually replies within one working day` messages.
- [x] Use the approved secondary grey for the `Send message` button, with
  distinct hover, active, focus, and disabled states.
- [x] Update the contact endpoint to include and validate every new conditional
  field while omitting hidden sections and an unused country code.
- [x] Verify every conditional state, required-field validation, payload,
  contextual Events shortcut, and desktop/tablet/phone layouts.

## 7. Singapore Shuttlers Hub

- [x] Make `BY ÉLEVER BADMINTON` uppercase, blue like the SSH brand treatment,
  and larger than the description.
- [x] Correct the description from `Singapore Shuttle Hub` to `Singapore
  Shuttlers Hub`.
- [x] Keep only the primary International/Local switch; remove nested tab
  systems and present each side as a clean scrolling page with compact anchors.
- [x] International: show only the next/current World Tour stop, with direct
  official stop and full-calendar buttons.
- [x] International: place relevant Singapore players within the stop card; do
  not claim entries that cannot be verified.
- [x] International: show Élever-owned BWF World Tour-filtered news beside
  curated external player coverage with publisher/date attribution and outbound links.
- [x] Local order: Play, Shop, Compete.
- [x] Play: reduce Courts to a compact link/preview and move the complete court
  finder + booking guide to a dedicated page.
- [x] Courts: underline location/address links rather than using a trailing arrow.
- [x] Courts: remove the closed Cereza Sports Hall and nonexistent Kovan Sports
  Centre.
- [x] Courts: reconcile ActiveSG halls against the official badminton-facilities
  source, removing centres that do not actually list badminton courts.
- [x] Courts: preserve operator-specific booking labels, notes, and alternate
  OnePA links instead of rendering every action as `Check Availability`.
- [x] Courts follow-up: add linked, source-checked operating or bookable hours
  to the complete directory; clearly distinguish public hours, DUS/CC booking
  bands, venue-only hours, and school class-only access.
- [?] Social groups: retain an honest Racket Ratings fallback until the client
  supplies the preferred UI and verified group schedules/contacts.
- [x] Shop: retain verified physical and online badminton retailers/stringers.
- [x] Compete: remove Singapore Junior International Series 2026 from Local.
- [x] Preserve useful deep links (`#team`, `#news`, `#halls`, `#groups`,
  `#shops`, `#tournaments`) after simplifying navigation.

## 8. About — cards and popup

- [x] Put `View more` below the certification line on coach cards and keep it
  visible/touch-friendly.
- [x] Remove the certification badge above a coach's name in the popup.
- [x] Remove the repeated role below the popup photo.
- [x] Remove coaching-pathway and language rows from the popup.
- [x] Show certifications as linked buttons below the certification heading.
- [x] Add Keng Yang's `ASCA Level 1` and `Level 1 Sports Trainer` certifications.
- [x] Link BWF Level 1, ASCA Level 1, and Level 1 Sports Trainer to the exact
  official course URLs supplied by the client.
- [x] Remove `See classes` from the popup.
- [x] Change `Open full profile` to `View full profile`.
- [~] Use a concise popup bio; until client-edited short copy arrives, use the
  first approved paragraph from each existing full bio as the safe fallback.

## 9. About — full coach profiles

- [x] Remove `HOME · ABOUT · COACHES`.
- [x] Remove the certification from beside the role in the page header.
- [x] Use a centred, single-column profile identity/content layout.
- [x] Mirror the cleaned popup identity/certification treatment below the photo.
- [x] Justify the About biography text (with hyphenation support).
- [x] Remove coaching-pathway and language rows.
- [x] Remove `See classes`.
- [x] Change `All coaches` to `View all coaches`.
- [x] Regenerate and review all 13 canonical coach pages.

## 10. Release verification

- [x] Validate JavaScript syntax, shell scripts, generated HTML, local links,
  image references, and `git diff --check`.
- [x] Test Home, Classes, Events, News, Hub, About, one coach profile, Contact,
  Camps, Lab, and Privacy on desktop and phone sizes.
- [x] Verify keyboard/Escape/focus-return behavior for event and coach dialogs.
- [x] Verify exact decoded WhatsApp text for group, private, and events CTAs.
- [x] Confirm no unintended files (screenshots, DNS backup, source drop folder)
  are included in the release commit.
- [x] Commit the completed release on `main` and push to `origin/main`.

## 11. Follow-up — venue hours and Trusted by logo balance

- [x] Add an hours row and a source link to every court-directory card. The
  refreshed directory now includes 160 entries: 10 private halls, one CC, two
  school class venues, plus all 147 badminton facilities currently returned by
  ActiveSG (19 public halls and 128 DUS halls).
- [x] Use official ActiveSG facility pages for all public SportSG/DUS hours,
  including the published MOE Evans and weekend DUS schedules.
- [x] Use each private operator's published page where available; label City
  Sprouts' 9am–11pm value as venue hours because tenant hours may vary.
- [x] Keep ACS Barker and SCGS truthful as non-public school halls; show the
  verified Élever Sunday class window only for SCGS and do not invent an ACS
  schedule.
- [x] Optically size the four Trusted by marks individually so SBA no longer
  appears materially smaller than ASICS, and verify desktop and phone layouts.
- [x] Favicon follow-up: give Classes, Hub, and Lab a cache-busted,
  root-absolute blue-to-black shuttle icon so clean routes cannot retain or
  resolve to the stale white favicon.
