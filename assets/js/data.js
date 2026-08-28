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
    { slug: 'shawn-wong', name: 'Shawn Wong', photo: 'assets/img/team-shawn-wong.jpg', role: 'Senior Coach', cert: 'BWF Level 1', group: 'team', coaching: ['Essentials', 'Emergence'], languages: ['English', 'Mandarin'], bio: 'Shawn coaches across the Essentials and Emergence pathways, and mentors newer coaches on the Élever curriculum.', placeholder: true },
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
     Age ranges, ability levels and grading checkpoints are still to be
     decided — they are deliberately not stated here rather than guessed.
     --------------------------------------------------------------- */
  var PATHWAYS = [
    {
      key: 'exploration', name: 'Exploration', num: '01',
      tag: 'Discover the game · new to badminton? start here',
      blurb: 'Our entry programme for new students. It introduces badminton in a safe, engaging and structured environment, helping players build confidence while experiencing Élever\u2019s coaching approach. Recommended progression into Essentials.',
      learn: ['Grip, ready position and basic racket control', 'Movement and coordination through games', 'Court awareness and simple rallying'],
      cta: { label: 'See our camps', href: 'camps.html' }
    },
    {
      key: 'essentials', name: 'Essentials', num: '02',
      tag: 'Build the foundation · master the basics',
      blurb: 'For players who have grasped the basics and are ready to strengthen their foundations. The programme focuses on solid footwork, proper grips and reliable technique, helping players play with confidence and consistency. Progression into Emergence upon assessment.',
      learn: ['Full stroke set — clear, drop, net, lift, drive', 'Six-corner footwork and recovery', 'Singles and doubles basics'],
      cta: { label: 'Find an Essentials class', href: 'classes.html#locations' }
    },
    {
      key: 'emergence', name: 'Emergence', num: '03',
      tag: 'Refine your skills · raise your game',
      blurb: 'Helps players move beyond the basics and explore the tactical side of the game. Through structured drills, guided match scenarios and focused coaching, players develop greater consistency, strategic thinking and adaptability on court. Selection into Elite based on readiness.',
      learn: ['Tactical patterns for singles and doubles', 'Deception, pace change and shot selection', 'Match play and competition routines'],
      cta: { label: 'Find an Emergence class', href: 'classes.html#locations' }
    },
    {
      key: 'elite', name: 'Elite', num: '04',
      tag: 'Perform with purpose · compete with confidence',
      blurb: 'For athletes aiming to reach their highest potential, Elite focuses on advanced skills, tactical understanding, mental preparation and competitive performance. Players experience high-intensity training, match simulations and individualised guidance to maximise growth and readiness for tournaments.',
      learn: ['Individual technical and tactical programme', 'Planned competition calendar', 'Dedicated strength & conditioning', 'Video analysis and performance review'],
      cta: { label: 'Enquire about Elite', href: 'contact.html' }
    }
  ];

  /* ---------------------------------------------------------------
     REGULAR CLASS SCHEDULE
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
        title: 'Holiday Exploration Camp',
        dates: '7 – 11 September 2026',
        venues: ['Aljunied', 'Novena', 'Sengkang', 'Serangoon'],
        ratio: '6 students : 1 coach',
        pricing: [
          { label: 'Standard pricing', note: 'until 31 Aug', price: 'S$228' },
          { label: 'Closing pricing', note: 'until 6 Sep', price: 'S$248' }
        ],
        bring: ['Court shoes (non-marking)', 'Water bottle', 'A racket if you have one — we lend one if not'],
        signup: 'https://www.eleverbadminton.com/hec202609'
      }
    ],
    timetable: [
      { time: '9.00am', what: 'Warm-up games and movement' },
      { time: '9.30am', what: 'Skill block — the day’s focus stroke' },
      { time: '10.15am', what: 'Break and hydration' },
      { time: '10.30am', what: 'Game-based practice' },
      { time: '11.15am', what: 'Mini-tournament and cool-down' },
      { time: '12.00pm', what: 'Pick-up' }
    ]
  };

  /* ---------------------------------------------------------------
     EVENTS — the service line we deliver for other organisations
     type: 'carnival' | 'clinic' | 'competition'
     --------------------------------------------------------------- */
  var EVENT_TYPES = [
    {
      key: 'carnival', name: 'Carnivals', num: '01',
      what: 'A mass-participation event day. Rotating stations, coach-led games, fun formats and prizes — designed so complete beginners and regular players both have a good time on the same floor.',
      provides: ['Event coaches and marshals', 'Rackets, shuttles and all equipment', 'Court and station setup', 'Scoring, prizes and medals']
    },
    {
      key: 'clinic', name: 'Clinics', num: '02',
      what: 'A focused coaching workshop. One topic — footwork, doubles rotation, serve and return — taught properly in a short block, scaled to whatever level walks in.',
      provides: ['BWF-certified coaches', 'Structured session plan for the level', 'Shuttles and training equipment', 'Loan rackets if needed']
    },
    {
      key: 'competition', name: 'Competitions', num: '03',
      what: 'A properly run tournament. We handle draws, formats, scheduling, umpiring and results so the host organisation can concentrate on their people rather than the spreadsheet.',
      provides: ['Format design and seeding', 'Draws, scheduling and results', 'Umpires and court marshals', 'Trophies, medals and prize ceremony']
    }
  ];

  /* All-in-one suite of event management services. */
  var EVENT_SERVICES = [
    'Coaches and marshals', 'Scoring and results', 'Procurement of equipment',
    'Medals, trophies and prizes', 'Emcee and event hosting', 'Media and photography',
    'Court and venue setup', 'First aid on site'
  ];

  var EVENTS_UPCOMING = [
    {
      title: 'SingHealth Presidents’ Challenge Sports Day 2026',
      type: 'carnival',
      client: 'SingHealth Community Hospitals',
      scope: [
        'Badminton and Pickleball Tournament',
        'Badminton and Pickleball Clinics'
      ],
      feature: true
    }
  ];

  /* Previous events, grouped by pillar. Write-ups and photos to follow. */
  var EVENTS_PAST = {
    carnival: [
      { title: 'Joo Chiat Badminton Carnival 2026', when: '23 Jul 2026', where: 'St. Patrick’s School' },
      { title: 'ÉB @ KFF Singapore Badminton Open 2025', when: '30 May – 1 Jun 2025', where: 'OCBC Square' }
    ],
    clinic: [
      { title: 'ASICS Badminton Summit 2026', when: '5 Jul 2026', where: 'The Sports Arina @ Jalan Kayu' },
      { title: 'Serangoon-Paya Lebar Badminton Clinic 2026', when: '4 Apr 2026', where: 'Paya Lebar Kovan Community Club' },
      { title: 'Bukit Gombak Sports Clinic 2026', when: '8 Feb 2026', where: 'Hillview Community Club' },
      { title: 'ÉB @ Northbrooks Secondary School', when: '23 Oct 2025', where: 'Northbrooks Secondary School' },
      { title: 'Pesta Sukan Clinic 2025', when: '6 & 10 Jul 2025', where: 'Singapore Badminton Stadium' },
      { title: 'Joo Chiat Badminton Clinic 2025', when: '11 May 2025', where: 'Joo Chiat Community Club' },
      { title: 'Siglap South Badminton Clinic 2025', when: '10 May 2025', where: 'Siglap South Community Centre' },
      { title: 'Bukit Gombak Sports Clinic 2025', when: '26 Jan 2025', where: 'Hillview Community Club' },
      { title: 'Kolam Ayer Badminton Clinic 2024', when: '23 Nov 2024', where: 'Kolam Ayer Community Club' },
      { title: 'Paya Lebar Badminton Clinic 2024', when: '18 May 2024', where: 'Paya Lebar Kovan Community Club' }
    ],
    competition: []
  };

  var EVENT_GROUP_LABEL = { carnival: 'Carnivals', clinic: 'Clinics', competition: 'Competitions' };

  /* Partner logos: drop files in assets/img/partners/ and set `logo`.
     Entries with no logo render as a name chip rather than a fake mark. */
  var PARTNERS = [
    { name: 'SingHealth Community Hospitals', logo: '' },
    { name: 'ASICS', logo: '' },
    { name: 'Joo Chiat CC', logo: '' },
    { name: 'Bukit Gombak CC', logo: '' },
    { name: 'Siglap South CC', logo: '' },
    { name: 'Paya Lebar Kovan CC', logo: '' },
    { name: 'Kolam Ayer CC', logo: '' },
    { name: 'Northbrooks Secondary School', logo: '' }
  ];

  /* ---------------------------------------------------------------
     ARTICLES — News page
     --------------------------------------------------------------- */
  var ARTICLES = [
    { slug: 'choosing-a-racket-for-your-child', title: 'How to choose a badminton racket for your child', category: 'Parent guides', date: '2026-08-01', read: '5 min', excerpt: 'Weight, grip size, string tension and why the expensive racket in the shop window is usually the wrong one for a nine-year-old.', placeholder: true },
    { slug: 'how-to-book-an-activesg-court', title: 'How to book an ActiveSG badminton court', category: 'SG badminton scene', date: '2026-07-18', read: '4 min', excerpt: 'The ballot, the release times and the trick to actually getting a peak-hour slot in Singapore.', placeholder: true },
    { slug: 'first-five-sessions', title: 'Badminton for beginners: your first five sessions', category: 'Coaching tips', date: '2026-07-02', read: '6 min', excerpt: 'What a complete beginner should expect to learn, in order, and how to tell whether it is going well.', placeholder: true }
  ];

  /* ---------------------------------------------------------------
     RACKET RATINGS — the free rating platform we point players at
     --------------------------------------------------------------- */
  var RACKET_RATINGS = {
    home: 'https://www.racketratings.net/badminton',
    features: [
      { key: 'leaderboard', icon: '📊', name: 'Leaderboard',
        desc: 'See where you actually stand. Separate boards for Singles, Doubles and 3v3.',
        href: 'https://www.racketratings.net/badminton' },
      { key: 'clubs', icon: '👥', name: 'Clubs',
        desc: 'Find a recreational club near you, join its ladder and climb its leaderboard. The best place to find a regular group.',
        href: 'https://www.racketratings.net/badminton/clubs', primary: true },
      { key: 'tournaments', icon: '🏆', name: 'Tournaments',
        desc: 'Browse open tournaments and enter — or create one for your own group.',
        href: 'https://www.racketratings.net/badminton/tournaments' },
      { key: 'h2h', icon: '⚔️', name: 'Head to head',
        desc: 'Your match history against any opponent, so you can see whether you are actually improving.',
        href: 'https://www.racketratings.net/badminton/matches/head-to-head' }
    ]
  };

  /* ---------------------------------------------------------------
     RECREATIONAL PLAY GROUPS
     Racket Ratings Clubs is the live, self-maintaining directory —
     this list is only for groups that ask us to feature them.
     Leave it empty and the page falls back to a clean empty state.
     --------------------------------------------------------------- */
  var REC_GROUPS = [];

  window.ELEVER_DATA = {
    coaches: COACHES,
    pathways: PATHWAYS,
    classes: CLASSES,
    camps: CAMPS,
    eventTypes: EVENT_TYPES,
    eventServices: EVENT_SERVICES,
    eventsUpcoming: EVENTS_UPCOMING,
    eventsPast: EVENTS_PAST,
    eventGroupLabel: EVENT_GROUP_LABEL,
    partners: PARTNERS,
    articles: ARTICLES,
    racketRatings: RACKET_RATINGS,
    recGroups: REC_GROUPS
  };
})();
