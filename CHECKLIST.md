# Élever Badminton — Requested Update Checklist

Status: `[ ]` todo · `[x]` done

---

## A. Project Safety

- [x] A1. Check git state before editing.
- [x] A2. Identify all files that control Camps, Classes, Events, About, SG Hub, venue booking links, and styles.
- [x] A3. Keep changes scoped to the user's requested sections.
- [x] A4. Run a local static server and inspect key pages after edits.
- [x] A5. Commit finished changes and push to the `frontend` branch.

## B. Camps

- [x] B1. Remove the upcoming camp `bring` list: court shoes, water bottle, and racket loan note.
- [x] B2. Remove the paragraph beginning `Sessions are game-based...`.
- [x] B3. Remove the full `A typical camp day` section and timetable from the Camps page.
- [x] B4. Remove unused camp timetable rendering/data if it is no longer needed.
- [x] B5. Re-check the Camps page spacing after the removals.

## C. Home / What Is Élever

- [x] C1. Remove the headline `The name is the brief.`
- [x] C2. Redesign the `What is Élever` section so the definition, translation, meaning, and tagline feel more intentional.
- [x] C3. Keep the `Read more about us` call-to-action.
- [x] C4. Verify the redesigned section works on mobile.

## D. Classes

- [x] D1. Make the Four E's feel progressive: Exploration -> Essentials -> Emergence -> Elite.
- [x] D2. Add a stair/step visual or other clear progression treatment.
- [x] D3. Keep beginner messaging clear: new players start with Exploration before moving up.
- [x] D4. Reduce vertical space used by the `Group class or private class` section.
- [x] D5. Remove the `Not sure where you fit? Tell us about the player and we'll place them.` enquiry section.
- [x] D6. Update the Classes Google Map view to show one pin per venue.
- [x] D7. Use different pin colours for Essentials and Emergence class venues.
- [x] D8. Ensure list filtering and map filtering continue to work.

## E. Events

- [x] E1. Shorten descriptions for Carnivals, Clinics, and Competitions.
- [x] E2. Make the `An all-in-one event management suite` section more concise.
- [x] E3. Reduce vertical space in the event suite section.
- [x] E4. Allow event photos to be clicked.
- [x] E5. Add a full-size image viewer/lightbox with previous/next navigation.
- [x] E6. Ensure gallery interactions work by keyboard and close cleanly.

## F. About

- [x] F1. Redesign the `Get in touch` section to look more polished.
- [x] F2. Keep Email, WhatsApp, and Book a class actions.
- [x] F3. Make the contact cards visually cleaner and less plain.

## G. SG Hub Removals

- [x] G1. Remove the `Regions covered 5` stat from the SG Hub hero.
- [x] G2. Remove the recreational play section under `Groups & ratings`.
- [x] G3. Remove now-unused recreational groups rendering if no mount remains.
- [x] G4. Make sure Racket Ratings and other useful group/rating cards still remain.

## H. SG Hub Season / National Team

- [x] H1. Replace stale hardcoded 2026 season text and avoid showing past tournaments as `Results to be confirmed`.
- [x] H2. Implement a self-updating season section based on event dates relative to the current date.
- [x] H3. Add better source links for BWF tournament schedule/results.
- [x] H4. Add a Singapore National Team-focused section for users to know rankings, upcoming competitions, and news.
- [x] H5. Include linked news/search entry points for Loh Kean Yew, Yeo Jia Min, and Singapore national team players.
- [x] H6. Keep the SG Hub copy clear that live ranking/results links are external sources.

## I. Venue Booking Links

- [x] I1. Fix or add booking links for Wyse Active Hub.
- [x] I2. Fix or add booking links for The Sports Arina @ Jalan Kayu.
- [x] I3. Fix or add booking links for Singapore Badminton Hall (SBH @ Sims).
- [x] I4. Fix or add booking links for SBH East Coast @ Expo.
- [x] I5. Fix or add booking links for OBA Arena @ Punggol.
- [x] I6. Fix or add booking links for KFF Badminton Arena / Singapore Badminton Stadium.
- [x] I7. Fix or add booking links for Cereza Sports Hall.
- [x] I8. Fix or add booking links for Kovan Sports Centre.
- [x] I9. Fix or add booking links for Chinese Swimming Club.
- [x] I10. Fix or add booking links for Singapore Swimming Club.
- [x] I11. Fix or add booking links for Warren Golf & Country Club.
- [x] I12. Fix or add booking links for Anglo-Chinese School (Barker Road).
- [x] I13. Fix or add booking links for Bidadari Community Club.
- [x] I14. Fix or add booking links for Cantonment Primary School.
- [x] I15. Fix or add booking links for North Vista Primary School.
- [x] I16. Fix or add booking links for Singapore Chinese Girls' School.
- [x] I17. Use the Élever booking app for Élever class venues and provider booking pages where court hire is external.

## J. Verification

- [x] J1. Run static syntax checks where possible.
- [x] J2. Run browser smoke checks for Home, Camps, Classes, Events, About, and SG Hub.
- [x] J3. Check console errors after loading edited pages.
- [x] J4. Review git diff before committing.
- [x] J5. Commit with a clear message.
- [x] J6. Push the commit to the `frontend` branch.
