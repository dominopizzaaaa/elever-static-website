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
      role: 'Co-Founder · Technical Director', cert: '', group: 'founder',
      coaching: ['Emergence', 'Elite'], languages: ['English', 'Mandarin'],
      bio: [
        "Kean Hean is the Co-Founder and Technical Director of Élever Badminton, where he leads the academy's coaching philosophy and designs its training programmes for players of all ages and abilities.",
        "A former Singapore National Team athlete, Kean Hean represented Singapore for over 12 years, reaching a career-high world ranking of No. 22 in Men's Doubles. His achievements include a bronze medal at the 2022 Commonwealth Games and six SEA Games medals, bringing world-class experience into every programme.",
        "Kean Hean co-founded Élever in 2023 with a vision to make quality badminton coaching more accessible. Having dedicated much of his life to the sport, he is passionate about giving back by sharing the knowledge, values, and opportunities badminton has given him while inspiring more people to enjoy the game.",
        'Known for his patient, approachable, and engaging coaching style, Kean Hean specialises in doubles development. His signature 50/50 philosophy balances game-based learning with sport-specific training, helping players build strong fundamentals, grow with confidence, and develop a lifelong love for badminton.'
      ],
      achievements: ['Former Singapore National Team athlete', "Career-high world ranking of No. 22 in Men's Doubles", 'Bronze medallist at the 2022 Commonwealth Games', 'Six-time SEA Games medallist']
    },
    {
      slug: 'eng-chin-an', name: 'Eng Chin An', photo: 'assets/img/team-eng-chin-an.jpg',
      role: 'Co-Founder', cert: '', group: 'founder',
      coaching: ['Essentials', 'Emergence'], languages: ['English', 'Mandarin'],
      bio: ['To write soon'],
      placeholder: true,
      profilePage: false
    },
    {
      slug: 'ong-keng-yang', name: 'Ong Keng Yang', photo: 'assets/img/team-ong-keng-yang.jpg',
      role: 'Performance Manager · Strength & Conditioning Coach', cert: '', group: 'team',
      coaching: ['Emergence', 'Elite'], languages: ['English', 'Mandarin'],
      bio: [
        "Keng Yang is the Performance Manager and Lead of Strength & Conditioning (S&C) at Élever Badminton, where he oversees the academy's physical development programmes and works closely with Technical Director Kean Hean to maximise player performance through evidence-based training.",
        "A graduate of Nanyang Technological University in Sports Science and Management, Keng Yang also serves as the Strength & Conditioning Coach for Singapore's National Team and National Training Squad at the High Performance Sport Institute. Working alongside the country's top badminton athletes gives him first-hand insight into the physical standards and demands of elite competition.",
        "This unique experience enables Élever Badminton to bring national-level sports science and training methodologies directly to its players. Aspiring athletes benefit from structured physical development, performance testing and conditioning programmes aligned with the expectations of Singapore's high-performance pathway, providing a distinct advantage for those working towards national selection.",
        'Known for his calm demeanour and analytical, research-driven approach, Keng Yang is passionate about helping players of all ages build strength, resilience and confidence. He is committed to making elite sports science accessible, empowering every athlete to maximise performance, reduce injury risk and reach their full potential.'
      ],
      achievements: ['Graduate of Nanyang Technological University in Sports Science and Management', "Strength & Conditioning Coach for Singapore's National Team and National Training Squad"]
    },
    {
      slug: 'shawn-wong', name: 'Shawn Wong', photo: 'assets/img/team-shawn-wong.jpg',
      role: 'Senior Coach', cert: '', group: 'team',
      coaching: ['Exploration', 'Essentials'], languages: ['English', 'Mandarin'],
      bio: [
        'Shawn is a Senior Coach at Élever Badminton, bringing over 25 years of coaching experience across schools, recreational programmes, and competitive youth development.',
        "Throughout his career, Shawn has guided players from complete beginners to championship-winning school teams. Since 2010, he has led Singapore Chinese Girls' School to multiple National School Games titles across the Junior and Senior divisions, while also coaching at Rosyth, Montfort Secondary, and Presbyterian High. His extensive experience has helped countless young athletes build strong technical foundations and achieve success at both the Zonal and National levels.",
        "As the lead coach for Élever Badminton's Exploration and Essentials programmes, Shawn specialises in shaping every child's first experience with badminton. Renowned for his calm authority and fatherly approach, he creates a positive learning environment where young beginners feel supported, motivated, and excited to learn. Beyond developing strong fundamentals, Shawn places great emphasis on character development, using sport to instill discipline, resilience, respect, and confidence that extends well beyond the court.",
        "As a father of two, Shawn shares Élever Badminton's mission of helping every child develop not only as a badminton player, but also as a confident individual with a lifelong love for the game."
      ],
      achievements: ['Over 25 years of coaching experience', "Led Singapore Chinese Girls' School to multiple National School Games titles", 'Coached at Rosyth, Montfort Secondary, and Presbyterian High']
    },
    {
      slug: 'torance-jng', name: 'Torance Jng', photo: 'assets/img/team-torance-jng.jpg',
      role: 'Development Coach', cert: 'BWF Level 1', group: 'team',
      coaching: ['Exploration', 'Essentials'], languages: ['English', 'Mandarin'],
      bio: [
        "Torance is a Development Coach at Élever Badminton, bringing over eight years of elite competitive experience to the court and representing the highest standard of his generation's badminton talent.",
        'Having honed his foundation at the Singapore Sports School, Torance rapidly progressed to the National Intermediate Squad, where he trained and competed from 2016 to 2019. As an ex-national player, he has amassed an impressive portfolio of achievements, including capturing an international title. His journey from a dedicated national athlete to a coach speaks volumes about the relentless hard work and discipline required to succeed on the international stage.',
        'As a coach, Torance is known for his stoicism and calm demeanour, which makes him highly approachable and well-liked among his students. He creates a supportive yet challenging environment that encourages players to be braver and more aggressive in their gameplay. Beyond technical execution, Torance imparts crucial real-life competitive skills - teaching his students how to thrive under pressure, mentally prepare for tournaments, and structure their training so they improve safely and consistently.',
        'Sharing Élever Badminton’s vision of purposeful training, Torance brings the mindset of a champion and the discipline of a seasoned competitor to every class, ensuring his students develop both the strategic fitness and the resilience needed to succeed.'
      ],
      achievements: ['Former National Intermediate Squad player', 'Trained and competed with the National Intermediate Squad from 2016 to 2019', 'International title winner']
    },
    {
      slug: 'lim-su-qi', name: 'Lim Su Qi', photo: 'assets/img/team-lim-su-qi.jpg',
      role: 'Development Coach', cert: 'BWF Level 1', group: 'team',
      coaching: ['Exploration', 'Essentials'], languages: ['English', 'Mandarin'],
      bio: [
        'Su Qi is a Development Coach at Élever Badminton, drawing on over 14 years of elite competitive experience and more than five years of dedicated coaching to shape the next generation of young athletes.',
        'A former Singapore National Team athlete, Su Qi specialised in the doubles event and has proudly represented the nation on major international stages. Her notable appearances include the Badminton Asia Team Championship 2024, the ASEAN School Games 2019, and reaching the Top 16 in the Women’s Doubles at the World University Games 2023. Her extensive track record features a Women’s Doubles Championship title at the Bravesword Series 2022, a runner-up finish at the Singapore National Open Championship 2024, and consistent podium finishes across numerous national and international youth challenges. Today, she remains a formidable competitor in the local circuit, actively playing for the SIM Women’s Team and securing top placement in both SUNIG and IVP competitions.',
        'Equipped with BWF Level 1 certification, Su Qi brings a wealth of grassroots and academy experience. As she continues to bridge her professional playing career with coaching, she serves as a passionate advocate for women in sports, actively working to inspire change and cultivate the next generation of female badminton players in Singapore.',
        'Her coaching philosophy is built on the belief that nurturing a champion takes time, patience and deep trust. On the court, Su Qi is celebrated for her unmatched ability to command a session with warmth and unwavering authority. Using her playful nature to make young students feel at ease, she also knows exactly when to flip the switch - seamlessly turning up the intensity and demanding that her students push their limits. Deeply aligned with Élever Badminton’s mission of holistic development, Su Qi ensures her students develop focus, discipline and profound self-belief.'
      ],
      achievements: ['Former Singapore National Team athlete', 'Badminton Asia Team Championship 2024 representative', 'ASEAN School Games 2019 representative', 'Top 16 in Women’s Doubles at the World University Games 2023', 'Women’s Doubles Champion at the Bravesword Series 2022', 'Runner-up at the Singapore National Open Championship 2024']
    },
    {
      slug: 'grace-tan', name: 'Grace Tan', photo: 'assets/img/team-grace-tan.jpg',
      role: 'Development Coach', cert: 'BWF Level 1', group: 'team',
      coaching: ['Exploration', 'Essentials'], languages: ['English', 'Mandarin'],
      bio: [
        'Grace is a Development Coach at Élever Badminton, drawing on over 13 years of competitive experience including her time in the National Intermediate Squad.',
        'Having first picked up a racket in Primary 3, Grace rose through the ranks to the National Intermediate Squad, earning podium finishes throughout her school years. A true all-rounder, she has claimed local podium finishes across women’s singles, women’s doubles, and mixed doubles, and finished among the Top 8 at the Asian University Badminton Championship - a testament to her versatility across every discipline of the game.',
        'Now in her third year of coaching, Grace specialises in introducing children to badminton - shaping every beginner’s very first experience of the sport. Known for her carefree, approachable, and fun-loving nature, she brings something no amount of tenure can teach: she remembers exactly what it feels like to be a young beginner herself. To her students, Grace is less of a coach and more of a friend - someone they trust, listen to, and genuinely enjoy learning from.',
        'Deeply aligned with Élever Badminton’s mission of holistic development, Grace is dedicated to helping every child fall in love with the sport from their very first lesson - and grow in confidence both on and off the court.'
      ],
      achievements: ['Former National Intermediate Squad player', 'Local podium finisher across women’s singles, women’s doubles, and mixed doubles', 'Top 8 at the Asian University Badminton Championship']
    },
    {
      slug: 'hassan', name: 'Hassan', photo: 'assets/img/team-hassan.jpg',
      role: 'Development Coach', cert: 'BWF Level 1', group: 'team',
      coaching: ['Essentials'], languages: ['English', 'Malay'],
      bio: [
        'Hassan is a Development Coach at Élever Badminton, bringing 16 years of coaching experience - a journey he turned into his full-time calling in 2023.',
        'Hassan’s love for badminton began at 13, and by 15 he was representing his school. A familiar face on Singapore’s community tournament circuit - including the Cheers, Berita Harian, and Temasya tournaments - he still travels overseas for friendly matches with other clubs and keeps playing competitively to keep up with the modern game. His belief is simple: to coach today’s players well, he must never stop being one.',
        'On court, Hassan is known for his patience and his natural way with kids. His coaching follows a clear progression - basics, consistency, then the extras. He specialises in guiding drills and challenging intermediate players with realistic, match-like training - meeting every student exactly where they are.',
        'Sharing Élever Badminton’s mission of helping every player build strong fundamentals and a lifelong love for the game, Hassan is committed to giving each student the foundation they need to grow - one consistent step at a time.'
      ],
      achievements: ['16 years of coaching experience', 'Competitive player on Singapore’s community tournament circuit']
    },
    {
      slug: 'jaren-ong', name: 'Jaren Ong', photo: 'assets/img/team-jaren-ong.jpg',
      role: 'Development Coach', cert: 'BWF Level 1', group: 'team',
      coaching: ['Essentials', 'Emergence'], languages: ['English', 'Mandarin'],
      bio: [
        'Jaren is a Development Coach at Élever Badminton, bringing five years of coaching experience across more than a dozen of schools, academies and clubs in Singapore - a coaching journey that never stops evolving since he began at just 16.',
        'Since then, he has prepared school teams for the National School Games and trained national deaf players with the Singapore Deaf Sports Association in preparation for the 2022 ASEAN Games. A four-year National School Games competitor himself, Jaren understands exactly what his students experience on court - because he has lived it.',
        'Jaren specialises in singles development, transforming unpolished form, inconsistent shots, and shaky footwork into confident movement and proper technique. For competitive players, he builds rapport with his students and game plans around each student’s strengths and weaknesses - and few things excite him more than watching his strategies work in tournaments. Known for his direct, honest, and results-driven style, Jaren sets high standards; his students may find him fierce at first, but they quickly discover that every session is purposeful, productive and tailored to their age and ability.',
        'One piece of feedback that he gets is that he shows visible improvement in every student he teaches. Deeply aligned with Élever Badminton’s mission of holistic development, he is committed to refining raw talent into confident, capable players who love the game.'
      ],
      achievements: ['Five years of coaching experience across schools, academies, and clubs', 'Prepared school teams for the National School Games', 'Trained national deaf players with the Singapore Deaf Sports Association for the 2022 ASEAN Games']
    },
    {
      slug: 'uzair', name: 'Uzair', photo: 'assets/img/team-uzair.png',
      role: 'Development Coach', cert: 'BWF Level 1', group: 'team',
      coaching: ['Exploration', 'Essentials'], languages: ['English', 'Malay'],
      bio: [
        'Uzair is a Development Coach at Élever Badminton, bringing over 20 years of coaching experience as a BWF Level 1 Certified Coach.',
        'A competitive player for more than 15 years, Uzair is a champion and podium finisher in multiple local tournaments, and has competed internationally at the Morning Cup in Taiwan, in Newcastle, Australia and across Malaysia. Over the past two decades, he has worked extensively with adult recreational and competitive players - giving him a deep understanding of how grown-up learners improve fast.',
        'Uzair’s coaching philosophy is simple: train with purpose, not repetition. Application-based and results-oriented, he focuses on practical improvements that players can feel in their very next match - building smarter players through tactical awareness, mental resilience, and efficient movement, with a constant eye on sustainable progress and injury prevention. Patient, approachable, and relatable, he is known for explaining the why behind every drill, encouraging players to think and decide for themselves on court.',
        'To his students, Uzair is more than a coach - he is a mentor both on and off the court. Sharing Élever Badminton’s belief that quality coaching is for every player, whatever their age or stage, he is dedicated to helping adults improve with confidence and rediscover the joy of the game.'
      ],
      achievements: ['Over 20 years of coaching experience', 'More than 15 years as a competitive player', 'Champion and podium finisher in multiple local tournaments', 'International competition experience in Taiwan, Australia, and Malaysia']
    },
    {
      slug: 'elsa-lai', name: 'Elsa Lai', photo: 'assets/img/team-elsa-lai.jpg',
      role: 'Development Coach', cert: '', group: 'team',
      coaching: ['Exploration'], languages: ['English', 'Mandarin'],
      bio: [
        'Elsa is a Development Coach at Élever Badminton, bringing a decade of elite competitive experience as a former Singapore National player.',
        'Over a 10-year playing career, Elsa competed on some of badminton’s biggest stages - representing Singapore at the SEA Games 2023 and the Uber Cup 2024, and taking on the world’s best young talents at the World Junior Championship in 2022 and 2023. Having progressed from the junior circuit to the senior international stage, she understands firsthand every step of the journey her young students are just beginning.',
        'As a coach, Elsa specialises in building strong foundations - the footwork and fundamental skills every great player is built upon. Empathetic, patient, and nurturing, she believes no child is ever “unable” to learn a skill - only that the right way to teach it hasn’t been found yet. When a student struggles, she works with them, adjusting and problem-solving together until it clicks. For Elsa, badminton is a source of fun and self-expression for every player, while instilling the life lessons and discipline that shape character.',
        'As one of the newest female coaches to join the Élever Badminton Family, Elsa is proud to be a role model for the next generation of girls in the sport. Above all, she hopes her students know she cares for them as individuals - not just as players. Deeply aligned with Élever Badminton’s mission of holistic development, she is dedicated to nurturing confident, disciplined, and happy athletes who love the game as much as she does.'
      ],
      achievements: ['Former Singapore National player', 'SEA Games 2023 representative', 'Uber Cup 2024 representative', 'World Junior Championship 2022 and 2023 representative']
    },
    {
      slug: 'thong-kin-yu', name: 'Thong Kin Yu', photo: 'assets/img/team-thong-kin-yu.jpg',
      role: 'Development Coach', cert: '', group: 'team',
      coaching: ['Exploration', 'Essentials'], languages: ['English', 'Mandarin'],
      bio: [
        'Kin Yu is a Development Coach at Élever Badminton and a competitive player with the SMU badminton team, bringing seven years of playing experience.',
        'Kin Yu’s badminton journey began at six years old - running around the court, dragging his racket along the concrete floor, simply because it was fun. That joy never left. He began formal training in Secondary 1, finished second at the Tampines Meridian Age Group Tournament 2018 (U17), and today represents Singapore Management University’s competitive badminton team.',
        'Friendly and patient, Kin Yu builds every session on strong fundamentals - taking the time to make sure each student truly masters them before moving on to the next complex skill. As an active player himself, he loves getting on court and doing drills alongside his students, striving to make every training session a fun and fresh experience.',
        'Sharing Élever Badminton’s mission of helping every child develop as a player and as a confident individual with a lifelong love of the game, Kin Yu hopes every student discovers the same joy he first found as a six-year-old with a racket in hand.'
      ],
      achievements: ['Competitive player with the SMU badminton team', 'Second at the Tampines Meridian Age Group Tournament 2018 (U17)']
    },
    {
      slug: 'robin-chio', name: 'Robin Chio', photo: '',
      role: 'Development Coach', cert: '', group: 'team',
      coaching: ['Exploration', 'Essentials'], languages: ['English'],
      bio: ['To be added'],
      placeholder: true,
      profilePage: false
    },
    {
      slug: 'ryan-lim', name: 'Ryan Lim', photo: 'assets/img/team-ryan-lim.jpg',
      role: 'Assistant Coach', cert: '', group: 'team',
      coaching: ['Exploration'], languages: ['English'],
      bio: [
        'Ryan is an Assistant Coach at Élever Badminton, guided by a simple belief: no two students learn the same way.',
        'Having picked up badminton at 13 and spent four years competing, Ryan knows what it’s like to learn the sport from scratch - and he brings that understanding into every class. Coaching under the guidance of Élever Badminton’s senior coaching team, he adapts his approach to suit each student, making sure every player builds solid foundations before moving on to more advanced skills.',
        'Ryan especially enjoys coaching doubles and young beginners. He keeps drills within each student’s skill level - challenging enough that they always learn something new, yet achievable enough that they never lose confidence. Easygoing, friendly, and strict when it counts, he creates a relaxed environment where young players feel comfortable trying, failing and trying again.',
        "Bringing Élever Badminton’s belief that quality coaching should be within every child's reach into every session, Ryan is committed to helping every beginner grow in both skill and self-belief."
      ],
      achievements: ['Four years of competitive playing experience']
    },
    {
      slug: 'jaden-chiang', name: 'Jaden Chiang', photo: 'assets/img/team-jaden-chiang.jpg',
      role: 'Assistant Coach', cert: '', group: 'team',
      coaching: ['Exploration'], languages: ['English', 'Mandarin'],
      bio: [
        'Jaden is an Assistant Coach at Élever Badminton, bringing over seven years of playing experience and an active competitor still climbing the ranks of Singapore’s tertiary badminton scene.',
        'Jaden picked up his first racket at 13 - later than most competitive players - yet within four years of training, he earned his place representing ITE at the IVP Games 2025 and Singapore Polytechnic at the POL-ITE Games 2026. His journey from late starter to tertiary-level competitor is proof of what discipline, resilience, and the right attitude can achieve - the very values he now instils in his students.',
        'Coaching under the guidance of Élever Badminton’s senior coaching team, Jaden specialises in footwork - the foundation he believes every great player is built on. His style is patient but firm; he gives every player the time they need to learn, while holding them to a standard that builds strong fundamentals, confidence, and commitment. He knows exactly what it feels like to learn the game today, and his students feel that understanding in every session.',
        'Bringing Élever Badminton’s belief that quality coaching should be the way to reach every child’s potential in every session, Jaden is committed to growing alongside his students and helping them build strong foundations - for the game, and for life.'
      ],
      achievements: ['Over seven years of playing experience', 'Represented ITE at the IVP Games 2025', 'Represented Singapore Polytechnic at the POL-ITE Games 2026']
    }
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
