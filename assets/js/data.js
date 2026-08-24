/* =====================================================================
   ÉLEVER BADMINTON — SITE DATA
   ---------------------------------------------------------------------
   Single source of truth for every page that renders from a list:
   coaches, development pathways, class schedule, camps, events,
   partners and articles.

   >>> THIS IS THE FILE ÉLEVER EDITS. Nothing here is baked into markup.

   Entries flagged  placeholder: true  are structural samples so the page
   can be seen working. Replace the content and remove the flag — any
   entry still flagged renders with a small "sample" tag so nothing
   unverified is ever presented to the public as fact.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------
     COACHES  — About page grid + one generated page each
     slug must match assets/img/team-<slug>.jpg (see `photo`)
     --------------------------------------------------------------- */
  var COACHES = [
    {
      slug: 'loh-kean-hean', name: 'Loh Kean Hean', photo: 'assets/img/team-loh-kean-hean.jpg',
      role: 'Co-Founder · Technical Director', cert: 'BWF Level 1', group: 'founder',
      coaching: ['Emergence', 'Elite'], languages: ['English', 'Mandarin'],
      bio: 'Kean Hean co-founded Élever to build the structured pathway he wished existed when he was coming up through the Singapore system. As Technical Director he owns what gets taught at every stage — from a first grip to competition tactics — and how a player moves from one pillar to the next.',
      placeholder: true
    },
    {
      slug: 'eng-chin-an', name: 'Eng Chin An', photo: 'assets/img/team-eng-chin-an.jpg',
      role: 'Co-Founder', cert: 'BWF Level 1', group: 'founder',
      coaching: ['Essentials', 'Emergence'], languages: ['English', 'Mandarin'],
      bio: 'Chin An co-founded Élever with the belief that world-class guidance should not depend on which hall you happen to live near. He leads the academy’s programmes and partnerships, and still coaches on court every week.',
      placeholder: true
    },
    {
      slug: 'ong-keng-yang', name: 'Ong Keng Yang', photo: 'assets/img/team-ong-keng-yang.jpg',
      role: 'Performance Manager · S&C Coach', cert: '', group: 'team',
      coaching: ['Emergence', 'Elite'], languages: ['English', 'Mandarin'],
      bio: 'Keng Yang runs Élever’s strength and conditioning. He builds the off-court work — movement, speed, injury resilience — that lets technique hold up over a long match and a long season.',
      placeholder: true
    },
    { slug: 'shawn-wong', name: 'Shawn Wong', photo: 'assets/img/team-shawn-wong.jpg', role: 'Senior Coach', cert: 'BWF Level 1', group: 'team', coaching: ['Essentials', 'Emergence'], languages: ['English', 'Mandarin'], bio: 'Shawn coaches across the Essentials and Emergence pillars, and mentors newer coaches on the Élever curriculum.', placeholder: true },
    { slug: 'torance-jng', name: 'Torance Jng', photo: 'assets/img/team-torance-jng.jpg', role: 'Development Coach', cert: 'BWF Level 1', group: 'team', coaching: ['Exploration', 'Essentials'], languages: ['English', 'Mandarin'], bio: 'Torance works with players building their first foundations, keeping sessions game-based so beginners leave wanting the next one.', placeholder: true },
    { slug: 'lim-su-qi', name: 'Lim Su Qi', photo: 'assets/img/team-lim-su-qi.jpg', role: 'Development Coach', cert: 'BWF Level 1', group: 'team', coaching: ['Exploration', 'Essentials'], languages: ['English', 'Mandarin'], bio: 'Su Qi coaches junior development groups with a focus on footwork and consistency before power.', placeholder: true },
    { slug: 'grace-tan', name: 'Grace Tan', photo: 'assets/img/team-grace-tan.jpg', role: 'Development Coach', cert: 'BWF Level 1', group: 'team', coaching: ['Exploration', 'Essentials'], languages: ['English', 'Mandarin'], bio: 'Grace coaches beginner and junior groups, and is a regular lead coach at Élever holiday camps.', placeholder: true },
    { slug: 'hassan', name: 'Hassan', photo: 'assets/img/team-hassan.jpg', role: 'Development Coach', cert: 'BWF Level 1', group: 'team', coaching: ['Essentials'], languages: ['English', 'Malay'], bio: 'Hassan coaches Essentials groups and works across Élever’s community carnivals and clinics.', placeholder: true },
    { slug: 'jaren-ong', name: 'Jaren Ong', photo: 'assets/img/team-jaren-ong.jpg', role: 'Development Coach', cert: 'BWF Level 1', group: 'team', coaching: ['Essentials', 'Emergence'], languages: ['English', 'Mandarin'], bio: 'Jaren coaches development groups with an emphasis on match play and decision-making under pressure.', placeholder: true },
    { slug: 'uzair', name: 'Uzair', photo: 'assets/img/team-uzair.png', role: 'Development Coach', cert: 'BWF Level 1', group: 'team', coaching: ['Exploration', 'Essentials'], languages: ['English', 'Malay'], bio: 'Uzair coaches beginner and junior groups, and helps run Élever’s outreach carnivals.', placeholder: true },
    { slug: 'elsa-lai', name: 'Elsa Lai', photo: 'assets/img/team-elsa-lai.jpg', role: 'Development Coach', cert: '', group: 'team', coaching: ['Exploration'], languages: ['English', 'Mandarin'], bio: 'Elsa coaches Élever’s youngest players, where the goal is confidence and enjoyment before anything technical.', placeholder: true },
    { slug: 'thong-kin-yu', name: 'Thong Kin Yu', photo: 'assets/img/team-thong-kin-yu.jpg', role: 'Development Coach', cert: '', group: 'team', coaching: ['Exploration', 'Essentials'], languages: ['English', 'Mandarin'], bio: 'Kin Yu coaches junior development groups and supports Élever’s holiday camp programme.', placeholder: true },
    { slug: 'ryan-lim', name: 'Ryan Lim', photo: 'assets/img/team-ryan-lim.jpg', role: 'Assistant Coach', cert: '', group: 'team', coaching: ['Exploration'], languages: ['English'], bio: 'Ryan supports lead coaches across junior classes and camps.', placeholder: true },
    { slug: 'jaden-chiang', name: 'Jaden Chiang', photo: 'assets/img/team-jaden-chiang.jpg', role: 'Assistant Coach', cert: '', group: 'team', coaching: ['Exploration'], languages: ['English', 'Mandarin'], bio: 'Jaden supports lead coaches across junior classes and camps.', placeholder: true }
  ];

  /* ---------------------------------------------------------------
     DEVELOPMENT PATHWAYS — the four E's (Classes page, 4 columns)
     --------------------------------------------------------------- */
  var PATHWAYS = [
    {
      key: 'exploration', name: 'Exploration', num: '01',
      tag: 'Start here · little to no experience',
      ages: '5–12', commitment: '1 camp or 1 session / week',
      blurb: 'The first taste of the sport. Game-based sessions that build coordination, movement and racket familiarity while keeping it fun enough that they ask to come back. No experience needed, and no expectation of any.',
      learn: ['Grip, ready position and basic racket control', 'Movement and coordination through games', 'Court awareness and simple rallying', 'Enjoying the sport enough to continue'],
      next: 'Move up to Essentials once a player can rally consistently and wants structured training.',
      cta: { label: 'See our holiday camps', href: 'camps.html' }
    },
    {
      key: 'essentials', name: 'Essentials', num: '02',
      tag: 'Building the foundation',
      ages: '7–16', commitment: '1–2 sessions / week',
      blurb: 'Where technique gets built properly. Players learn the core strokes and footwork patterns that everything later depends on — done slowly and correctly rather than quickly and roughly.',
      learn: ['Full stroke set — clear, drop, net, lift, drive', 'Six-corner footwork and recovery', 'Singles and doubles basics', 'Consistency under simple pressure'],
      next: 'Move up to Emergence when technique holds under match pressure.',
      cta: { label: 'Find an Essentials class', href: 'classes.html#schedule' }
    },
    {
      key: 'emergence', name: 'Emergence', num: '03',
      tag: 'Competitive development',
      ages: '10–18', commitment: '2–3 sessions / week',
      blurb: 'For players who have the strokes and now want to win with them. Training shifts toward tactics, match play, physical conditioning and the habits that competition demands.',
      learn: ['Tactical patterns for singles and doubles', 'Deception, pace change and shot selection', 'Match play and competition routines', 'Strength, speed and injury resilience'],
      next: 'Move up to Elite by invitation, based on training standard and competition results.',
      cta: { label: 'Find an Emergence class', href: 'classes.html#schedule' }
    },
    {
      key: 'elite', name: 'Elite', num: '04',
      tag: 'By invitation · performance squad',
      ages: '12+', commitment: '3+ sessions / week',
      blurb: 'Our performance squad. Individualised programmes, a competition calendar, strength and conditioning, and video review — built around players targeting national age-group and open competition.',
      learn: ['Individual technical and tactical programme', 'Planned competition calendar and periodisation', 'Dedicated strength & conditioning', 'Video analysis and performance review'],
      next: 'Squad places are reviewed each season.',
      cta: { label: 'Enquire about Elite', href: 'contact.html' }
    }
  ];

  /* ---------------------------------------------------------------
     REGULAR CLASS SCHEDULE
     venueId links to the SG Hub venue directory in main.js (VENUES).
     level: 'Essentials' | 'Emergence'
     --------------------------------------------------------------- */
  var CLASSES = [
    { venueId: 'acsbarker', venue: 'Anglo-Chinese School (Barker Road)', area: 'Newton', region: 'Central', addr: '60 Barker Road, S309919', mrt: 'Newton', lat: 1.3196, lng: 103.8399, sessions: [ { day: 'Saturday', time: '9.00am – 11.00am', level: 'Essentials' }, { day: 'Saturday', time: '11.00am – 1.00pm', level: 'Emergence' } ], placeholder: true },
    { venueId: 'bidadari', venue: 'Bidadari Community Club', area: 'Bidadari', region: 'Central', addr: 'Bidadari Park Drive, Singapore', mrt: 'Woodleigh', lat: 1.3376, lng: 103.8703, sessions: [ { day: 'Tuesday', time: '5.00pm – 7.00pm', level: 'Essentials' }, { day: 'Thursday', time: '5.00pm – 7.00pm', level: 'Emergence' } ], placeholder: true },
    { venueId: 'wyse', venue: 'Wyse Active Hub', area: 'Jurong East', region: 'West', addr: '1 Venture Avenue, #03-01, S608521', mrt: 'Jurong East', lat: 1.3331, lng: 103.7429, sessions: [ { day: 'Sunday', time: '9.00am – 11.00am', level: 'Essentials' }, { day: 'Sunday', time: '11.00am – 1.00pm', level: 'Emergence' } ], placeholder: true },
    { venueId: 'fernvale', venue: 'Fernvale Village', area: 'Sengkang', region: 'North-East', addr: '61 Fernvale Link, S799956', mrt: 'Layar LRT', lat: 1.3917, lng: 103.8760, sessions: [ { day: 'Wednesday', time: '5.30pm – 7.30pm', level: 'Essentials' }, { day: 'Saturday', time: '2.00pm – 4.00pm', level: 'Emergence' } ], placeholder: true },
    { venueId: 'sbhsims', venue: 'Singapore Badminton Hall (Sims)', area: 'Geylang', region: 'East', addr: '1 Lorong 23 Geylang, S388352', mrt: 'Aljunied', lat: 1.3168, lng: 103.8869, sessions: [ { day: 'Monday', time: '6.00pm – 8.00pm', level: 'Emergence' }, { day: 'Friday', time: '6.00pm – 8.00pm', level: 'Essentials' } ], placeholder: true },
    { venueId: 'sbhexpo', venue: 'SBH East Coast @ Expo', area: 'Changi', region: 'East', addr: 'Singapore Expo, Carpark J, S486150', mrt: 'Expo', lat: 1.3346, lng: 103.9614, sessions: [ { day: 'Saturday', time: '4.00pm – 6.00pm', level: 'Essentials' } ], placeholder: true },
    { venueId: 'kff', venue: 'KFF Badminton Arena', area: 'Geylang', region: 'Central', addr: '100 Guillemard Road, S399718', mrt: 'Dakota', lat: 1.3106, lng: 103.8845, sessions: [ { day: 'Thursday', time: '7.00pm – 9.00pm', level: 'Emergence' } ], placeholder: true }
  ];

  /* ---------------------------------------------------------------
     CAMPS — Exploration holiday camps
     Set  upcoming: []  when nothing is on sale; the page then shows
     the waitlist capture instead of a registration card.
     --------------------------------------------------------------- */
  var CAMPS = {
    upcoming: [
      {
        title: 'December Holiday Exploration Camp',
        dates: '15 – 18 December 2026',
        time: '9.00am – 12.00pm daily',
        venue: 'Wyse Active Hub, Jurong East',
        ages: '6–12',
        ratio: '1 coach : 8 players',
        price: 'S$280 for 4 days',
        bring: ['Court shoes (non-marking)', 'Water bottle', 'A racket if you have one — we lend one if not', 'A small snack'],
        signup: 'https://app.eleverbadminton.com/',
        placeholder: true
      }
    ],
    timetable: [
      { time: '9.00am', what: 'Warm-up games and movement' },
      { time: '9.30am', what: 'Skill block — the day’s focus stroke' },
      { time: '10.15am', what: 'Break and hydration' },
      { time: '10.30am', what: 'Game-based practice' },
      { time: '11.15am', what: 'Mini-tournament and cool-down' },
      { time: '12.00pm', what: 'Pick-up' }
    ],
    past: [
      { title: 'June Holiday Camp 2026', when: 'June 2026', venue: 'Wyse Active Hub', note: 'Four days of game-based sessions for first-time players.', placeholder: true },
      { title: 'March Holiday Camp 2026', when: 'March 2026', venue: 'Fernvale Village', note: 'Our largest March intake to date across two age groups.', placeholder: true }
    ]
  };

  /* ---------------------------------------------------------------
     EVENTS — the corporate / community service line
     type: 'carnival' | 'clinic' | 'competition'
     --------------------------------------------------------------- */
  var EVENT_TYPES = [
    {
      key: 'carnival', name: 'Carnivals', num: '01',
      who: 'Companies, schools, condos and community groups who want a lot of people playing at once.',
      what: 'A mass-participation event day. Rotating stations, coach-led games, fun formats and prizes — designed so complete beginners and regular players both have a good time on the same floor.',
      size: '50 – 300+ participants', duration: 'Half or full day', lead: '6–8 weeks',
      provides: ['Event coaches and marshals', 'Rackets, shuttles and all equipment', 'Court and station setup', 'Scoring, prizes and medals', 'Event photography', 'First aid on site']
    },
    {
      key: 'clinic', name: 'Clinics', num: '02',
      who: 'Corporate teams, school CCAs and interest groups who want to actually get better.',
      what: 'A focused coaching workshop. One topic — footwork, doubles rotation, serve and return — taught properly in a short block, scaled to whatever level walks in.',
      size: '10 – 60 participants', duration: '2 – 3 hours, or a short series', lead: '3–4 weeks',
      provides: ['BWF-certified coaches', 'Structured session plan for the level', 'Shuttles and training equipment', 'Loan rackets if needed', 'Take-home practice notes']
    },
    {
      key: 'competition', name: 'Competitions', num: '03',
      who: 'Organisations running an internal tournament, an inter-school meet or an open event.',
      what: 'A properly run tournament. We handle draws, formats, scheduling, umpiring and results so the host organisation can concentrate on their people rather than the spreadsheet.',
      size: '16 – 128 entries', duration: 'One or multiple days', lead: '8–10 weeks',
      provides: ['Format design and seeding', 'Draws, scheduling and results', 'Umpires and court marshals', 'Trophies, medals and prize ceremony', 'Live results board', 'Event photography']
    }
  ];

  var EVENT_USES = [
    'Company D&D or family day', 'Team bonding', 'CSR / community day',
    'School CCA enrichment', 'Inter-class or inter-school meet',
    'Condo community day', 'Brand activation', 'Charity fundraiser'
  ];

  var EVENT_PROCESS = [
    { step: 'Enquire', note: 'Tell us the date, headcount and what you are trying to achieve.' },
    { step: 'Proposal & quote', note: 'We come back with a format, a run sheet and a fixed price.' },
    { step: 'Site recce', note: 'We check the venue, courts, power and access.' },
    { step: 'Event day', note: 'Our coaches and marshals run it end to end.' },
    { step: 'Recap', note: 'You get the photos, results and a short report.' }
  ];

  var EVENTS_UPCOMING = [
    { title: 'Community Badminton Carnival', type: 'carnival', partner: 'Partner to be announced', when: 'Q1 2027', where: 'To be confirmed', note: 'A community open day bringing first-time players onto court.', placeholder: true }
  ];

  var EVENTS_PAST = [
    { title: 'Corporate Badminton Carnival', type: 'carnival', partner: 'Partner name', when: '2026', where: 'Singapore', stats: '', note: 'Replace this entry with a real past event — date, venue, partner, headcount and a short write-up.', placeholder: true },
    { title: 'School Coaching Clinic', type: 'clinic', partner: 'Partner name', when: '2026', where: 'Singapore', stats: '', note: 'Replace this entry with a real past event — date, venue, partner, headcount and a short write-up.', placeholder: true }
  ];

  /* Partner logos: drop files in assets/img/partners/ and set `logo`.
     Entries with no logo render as a name chip rather than a fake mark. */
  var PARTNERS = [
    { name: 'Add your partners in assets/js/data.js', logo: '', placeholder: true }
  ];

  /* ---------------------------------------------------------------
     ARTICLES — News page
     --------------------------------------------------------------- */
  var ARTICLES = [
    { slug: 'choosing-a-racket-for-your-child', title: 'How to choose a badminton racket for your child', category: 'Parent guides', date: '2026-08-01', read: '5 min', excerpt: 'Weight, grip size, string tension and why the expensive racket in the shop window is usually the wrong one for a nine-year-old.', placeholder: true },
    { slug: 'how-to-book-an-activesg-court', title: 'How to book an ActiveSG badminton court', category: 'SG badminton scene', date: '2026-07-18', read: '4 min', excerpt: 'The ballot, the release times and the trick to actually getting a peak-hour slot in Singapore.', placeholder: true },
    { slug: 'first-five-sessions', title: 'Badminton for beginners: your first five sessions', category: 'Coaching tips', date: '2026-07-02', read: '6 min', excerpt: 'What a complete beginner should expect to learn, in order, and how to tell whether it is going well.', placeholder: true }
  ];

  window.ELEVER_DATA = {
    coaches: COACHES,
    pathways: PATHWAYS,
    classes: CLASSES,
    camps: CAMPS,
    eventTypes: EVENT_TYPES,
    eventUses: EVENT_USES,
    eventProcess: EVENT_PROCESS,
    eventsUpcoming: EVENTS_UPCOMING,
    eventsPast: EVENTS_PAST,
    partners: PARTNERS,
    articles: ARTICLES
  };
})();
