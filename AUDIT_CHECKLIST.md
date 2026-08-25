# Age-Inclusive Website Audit Checklist

This checklist is the standard for every page in the Elever Badminton website. It prioritizes parents and older adult users while preserving a modern experience for younger visitors.

## Page Inventory And Priority

### High-Traffic Core Pages
- `index.html`: homepage, first impression, primary calls to action.
- `classes.html`: class discovery, schedule, map, booking intent.
- `camps.html`: holiday camp discovery and waitlist/signup intent.
- `events.html`: corporate, school, and community event enquiries.
- `contact.html`: lead capture, direct contact, conversion completion.

### Supporting Pages
- `about.html`: trust, story, coach discovery.
- `hub.html`: venue and community discovery.
- `news.html`: articles and newsletter signup.
- `play.html`: engagement/game page.
- `privacy.html`: consent and data handling.

### Coach Profile Pages
- `coaches/*.html`: credibility and coach-specific discovery.

## Mandatory Cross-Page Checks

### Accessibility: WCAG 2.1 AA
- Text contrast is at least 4.5:1 for normal text and 3:1 for large text.
- Text remains readable and layouts do not break at 200% browser zoom.
- Keyboard users can reach and operate every interactive element.
- Focus states are visible on buttons, links, fields, cards, menus, and map controls.
- All images have useful alternative text or are hidden when decorative.
- Motion respects `prefers-reduced-motion`.
- Forms use persistent visible labels, useful autocomplete attributes where relevant, and field-level error messages.
- Touch targets are at least 48x48px with practical spacing.
- Screen reader labels are present for icon-only controls, menus, language selection, map controls, and game controls.

### Older Adult User Checks
- Body text starts at 16px or larger.
- Secondary text avoids low-contrast light gray on white.
- Critical actions use explicit labels, such as "Book a trial class" or "Send class enquiry".
- Core tasks are reachable within 3 clicks from the homepage.
- Navigation is visible and predictable; desktop navigation does not rely on hidden menus.
- No mandatory autoplay video, audio, or carousel behavior.
- Forms explain exactly what went wrong directly below the relevant field.

### Younger User Checks
- Interactions feel fast, smooth, and non-intrusive.
- Visual design remains clean, contemporary, and uncluttered.
- Secondary features are discoverable without competing with primary actions.
- Mobile swipe/scroll behavior stays natural and does not trap the user.
- Keyboard shortcuts or keyboard flows do not conflict with standard browser behavior.

### Responsive Behavior
- Validate at 360px, 390px, 768px, 1024px, 1366px, and wide desktop sizes.
- Confirm all primary CTAs remain visible and tappable.
- Confirm cards, forms, nav, tables, maps, and game interfaces do not overflow.
- Confirm phone readability, not only laptop readability.

### Visual And Interaction Consistency
- Buttons share consistent size, radius, typography, hover, focus, and active states.
- Form fields share consistent labels, hints, borders, focus, and error states.
- Links are visually identifiable in body copy.
- Cards have consistent spacing and clear click/tap affordances when interactive.
- Language, search, menu, and booking actions remain visually distinct.

## Severity Model

- Critical: Blocks booking/contact, causes inaccessible navigation/forms, or fails keyboard/screen reader use.
- High: Causes frequent mis-taps, poor readability, broken mobile layout, or confusing primary actions.
- Medium: Creates inconsistency, weak feedback, minor contrast risk, or non-essential friction.
- Low: Cosmetic polish or non-blocking copy improvements.

## Baseline Audit Summary

### Critical
- None currently confirmed during this implementation pass.

### High
- Some interactive targets were below the 48x48px age-inclusive target, especially nav language/search controls, review dots, and compact icon buttons.
- Some secondary copy used `--faint`, which was too light for older users on white backgrounds.
- Motion-heavy elements lacked a comprehensive reduced-motion CSS fallback across intro, hero, marquees, quiz decorations, reviews, and map/pin transitions.

### Medium
- Form fields had visible labels, but there was no standardized field-level error style for future forms.
- Body copy and link styling were not fully standardized for high-contrast body links.
- Mobile spacing could be improved for tap safety on dense button groups.

### Low
- Documentation/playbook standards were not previously captured in the repository.

## Phased Implementation Roadmap

### Phase 1: Accessibility Foundations
- Enforce minimum readable base text sizing and mobile text scaling.
- Improve default contrast tokens and avoid faint text for important supporting content.
- Standardize 48x48px tap targets for primary buttons, navigation controls, icon buttons, filters, carousel controls, and map pins.
- Add robust reduced-motion behavior.

### Phase 2: Forms And Task Completion
- Standardize labels, helper text, and error message presentation.
- Keep error messages directly below relevant fields.
- Add clearer action copy for critical submission buttons.
- Validate booking/contact paths in three clicks or fewer from the homepage.

### Phase 3: Cross-Device Polish
- Review all core pages at mobile, tablet, and desktop widths.
- Validate map/list behavior, game interactions, cards, and forms.
- Ensure desktop nav stays visible and mobile nav remains simple.

### Phase 4: User Testing And Monitoring
- Test with older adults 55+ and younger users 18-34.
- Measure completion of core navigation and booking/contact tasks within 30 seconds from the homepage.
- Track form errors, booking clicks, support tickets, and drop-off after each release.
- Run quarterly audits using this checklist when new pages or features are added.

## Definition Of Done

- 100% of pages pass this checklist before release.
- VoiceOver and NVDA spot checks confirm navigation, forms, menus, and controls are understandable.
- Chrome, Firefox, Safari, and Edge show no functional errors on desktop, tablet, and mobile viewports.
- Younger users rate the interface at least 4/5 for "cool" and "seamless" in testing.
- This playbook is updated when new UI patterns are introduced.
