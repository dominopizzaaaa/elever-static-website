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
     `photo` is the square headshot built by tools/build-coach-photos.sh
     from assets/img/Photos/Coaches/, so <slug> must match that file name.
     --------------------------------------------------------------- */
  var COACHES = [
    {
      slug: 'loh-kean-hean', name: 'Loh Kean Hean', photo: 'assets/img/coaches/loh-kean-hean.jpg',
      role: 'Co-Founder · Technical Director', cert: 'BWF Level 1', group: 'founder',
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
      slug: 'eng-chin-an', name: 'Eng Chin An', photo: 'assets/img/coaches/eng-chin-an.jpg',
      role: 'Co-Founder', cert: '', group: 'founder',
      coaching: ['Essentials', 'Emergence'], languages: ['English', 'Mandarin'],
      bio: ['To write soon'],
      placeholder: true,
      profilePage: false
    },
    {
      slug: 'ong-keng-yang', name: 'Ong Keng Yang', photo: 'assets/img/coaches/ong-keng-yang.jpg',
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
      slug: 'shawn-wong', name: 'Shawn Wong', photo: 'assets/img/coaches/shawn-wong.jpg',
      role: 'Senior Coach', cert: 'BWF Level 1', group: 'team',
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
      slug: 'torance-jng', name: 'Torance Jng', photo: 'assets/img/coaches/torance-jng.jpg',
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
      slug: 'lim-su-qi', name: 'Lim Su Qi', photo: 'assets/img/coaches/lim-su-qi.jpg',
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
      slug: 'grace-tan', name: 'Grace Tan', photo: 'assets/img/coaches/grace-tan.jpg',
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
      slug: 'hassan', name: 'Hassan', photo: 'assets/img/coaches/hassan.jpg',
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
      slug: 'jaren-ong', name: 'Jaren Ong', photo: 'assets/img/coaches/jaren-ong.jpg',
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
      slug: 'uzair', name: 'Uzair', photo: 'assets/img/coaches/uzair.jpg',
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
      slug: 'elsa-lai', name: 'Elsa Lai', photo: 'assets/img/coaches/elsa-lai.jpg',
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
      slug: 'thong-kin-yu', name: 'Thong Kin Yu', photo: 'assets/img/coaches/thong-kin-yu.jpg',
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
      slug: 'robin-chio', name: 'Robin Chio', photo: 'assets/img/coaches/robin-chio.jpg',
      role: 'Development Coach', cert: '', group: 'team',
      coaching: ['Exploration', 'Essentials'], languages: ['English'],
      bio: ['To be added'],
      placeholder: true,
      profilePage: false
    },
    {
      slug: 'ryan-lim', name: 'Ryan Lim', photo: 'assets/img/coaches/ryan-lim.jpg',
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
      slug: 'jaden-chiang', name: 'Jaden Chiang', photo: 'assets/img/coaches/jaden-chiang.jpg',
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
     DEVELOPMENT PATHWAYS — Exploration, Essentials, Emergence, Elite
     ---------------------------------------------------------------
     Copy is transcribed verbatim from the Google Doc
     "EB Website for Dom" -> tab "Write-ups for Development Pathways",
     including its capitalisation and paragraph breaks. Each stage is:
        headline -> hook (optional) -> body
     The doc's closing pointer line ("Recommended progression into
     ESSENTIALS.", "Step into your full potential.", ...) was dropped at
     the client's request (Aug 2026) — the arrows between the cards carry
     the progression now.
     Age ranges, ability levels and grading checkpoints are still to be
     decided — they are deliberately not stated here rather than guessed.
     --------------------------------------------------------------- */
  var PATHWAYS = [
    {
      key: 'exploration', name: 'Exploration', num: '01',
      headline: 'DISCOVER THE GAME. EXPERIENCE \u00c9LEVER.',
      hook: 'New to badminton? Start here.',
      body: 'EXPLORATION is our entry programme for new students. It introduces badminton in a safe, engaging, and structured environment, helping players build confidence while experiencing \u00c9lever Badminton\u2019s coaching approach.',
      cta: { label: 'See our camps', href: 'camps.html' }
    },
    {
      key: 'essentials', name: 'Essentials', num: '02',
      headline: 'BUILD THE FOUNDATION. MASTER THE BASICS.',
      hook: 'Ready to take your game further?',
      body: 'ESSENTIALS is designed for players who have grasped the basics and are ready to strengthen their foundations. The programme focuses on solid footwork, proper grips, and reliable technique, helping players play with confidence and consistency.',
      cta: { label: 'Find an Essentials class', href: 'classes.html#locations' }
    },
    {
      key: 'emergence', name: 'Emergence', num: '03',
      headline: 'REFINE YOUR SKILLS. RAISE YOUR GAME.',
      hook: 'Take it to the next level.',
      body: 'EMERGENCE helps players move beyond the basics and explore the tactical side of the game. Through structured drills, guided match scenarios, and focused coaching, players develop greater consistency, strategic thinking, and adaptability on court.',
      cta: { label: 'Find an Emergence class', href: 'classes.html#locations' }
    },
    {
      key: 'elite', name: 'Elite', num: '04',
      headline: 'PERFORM WITH PURPOSE. COMPETE WITH CONFIDENCE.',
      hook: '',
      body: 'For athletes aiming to reach their highest potential, ELITE focuses on advanced skills, tactical understanding, mental preparation, and competitive performance. Players experience high-intensity training, match simulations, and individualised guidance to maximise growth and readiness for tournaments.',
      cta: { label: 'Enquire about Elite', href: 'contact.html' }
    }
  ];

  /* ---------------------------------------------------------------
     REGULAR CLASS SCHEDULE
     level: 'Essentials' | 'Emergence'
     status: 'Available' when a class has slots
     --------------------------------------------------------------- */
  var CLASSES = [
    { venueId: 'sbhaljunied', venue: 'Singapore Badminton Hall', area: 'Aljunied', region: 'East', addr: '1 Lorong 23 Geylang, S388352', mrt: 'Aljunied', lat: 1.313938, lng: 103.880708, book: 'https://app.eleverbadminton.com/', sessions: [ { day: 'Friday', time: '16:00 - 18:00', level: 'Essentials' } ] },
    { venueId: 'sbstadium', venue: 'Singapore Badminton Stadium', area: 'Aljunied', region: 'East', addr: '100 Guillemard Road, S399718', mrt: 'Aljunied', lat: 1.309908, lng: 103.881842, book: 'https://app.eleverbadminton.com/', sessions: [ { day: 'Saturday', time: '12:00 - 14:00', level: 'Emergence' }, { day: 'Saturday', time: '14:00 - 16:00', level: 'Essentials' }, { day: 'Saturday', time: '16:00 - 18:00', level: 'Essentials' }, { day: 'Sunday', time: '12:00 - 14:00', level: 'Essentials' }, { day: 'Sunday', time: '14:00 - 16:00', level: 'Essentials' } ] },
    { venueId: 'scgs', venue: 'Singapore Chinese Girls’ School', area: 'Novena', region: 'Central', addr: '190 Dunearn Road, S309437', mrt: 'Novena', lat: 1.320634, lng: 103.828165, book: 'https://app.eleverbadminton.com/', sessions: [ { day: 'Sunday', time: '15:00 - 17:00', level: 'Essentials' } ] },
    { venueId: 'sbhexpo', venue: 'SBH East Coast @ Expo', area: 'Expo', region: 'East', addr: 'Singapore Expo, 1 Expo Drive, S486150', mrt: 'Expo', lat: 1.334402, lng: 103.96036, book: 'https://app.eleverbadminton.com/', sessions: [ { day: 'Saturday', time: '10:00 - 12:00', level: 'Essentials' }, { day: 'Saturday', time: '15:00 - 17:00', level: 'Essentials' }, { day: 'Sunday', time: '14:00 - 16:00', level: 'Essentials' } ] },
    { venueId: 'wyse', venue: 'Wyse Active Hub', area: 'Jurong', region: 'West', addr: '1 Venture Avenue, #03-01 Perennial Business City, S608521', mrt: 'Jurong East', lat: 1.331865, lng: 103.744882, book: 'https://app.eleverbadminton.com/', sessions: [ { day: 'Saturday', time: '15:00 - 17:00', level: 'Essentials' }, { day: 'Sunday', time: '09:00 - 11:00', level: 'Essentials' } ] },
    { venueId: 'fernvale', venue: 'Fernvale Village', area: 'Sengkang', region: 'North-East', addr: '61 Fernvale Link, S799956', mrt: 'Layar LRT', lat: 1.396193, lng: 103.878618, book: 'https://app.eleverbadminton.com/', sessions: [ { day: 'Tuesday', time: '16:00 - 18:00', level: 'Essentials' }, { day: 'Thursday', time: '16:00 - 18:00', level: 'Essentials' }, { day: 'Saturday', time: '10:00 - 12:00', level: 'Essentials' }, { day: 'Saturday', time: '13:00 - 15:00', level: 'Essentials' }, { day: 'Saturday', time: '15:00 - 17:00', level: 'Essentials' }, { day: 'Saturday', time: '15:00 - 18:00', level: 'Emergence' }, { day: 'Sunday', time: '11:00 - 13:00', level: 'Essentials' }, { day: 'Sunday', time: '13:00 - 15:00', level: 'Essentials' } ] },
    { venueId: 'cantonment-primary', venue: 'Cantonment Primary School', area: 'Cantonment', region: 'Central', addr: '1 Cantonment Close, S088256', mrt: 'Cantonment', lat: 1.275473, lng: 103.839963, book: 'https://app.eleverbadminton.com/', sessions: [ { day: 'Sunday', time: '09:00 - 11:00', level: 'Essentials' } ] },
    { venueId: 'bidadari', venue: 'Bidadari Community Club', area: 'Woodleigh', region: 'Central', addr: '11 Bidadari Park Drive, S367905', mrt: 'Woodleigh', lat: 1.338694, lng: 103.87175, book: 'https://app.eleverbadminton.com/', sessions: [ { day: 'Monday', time: '15:30 - 17:30', level: 'Essentials' }, { day: 'Tuesday', time: '15:30 - 17:30', level: 'Essentials' } ] }
  ];

  /* ---------------------------------------------------------------
     CAMPS — Exploration holiday camps
     Set  upcoming: []  when nothing is on sale; the page then shows
     the waitlist capture instead of a registration card.

     `gallery.photos` are filenames only — CAMP_PHOTO_BASE (full size, used
     in the lightbox) and CAMP_THUMB_BASE (grid thumbnails) supply the
     directories, so both sets stay in sync. Regenerate both from the
     originals in assets/img/Photos/Camps/ with:
         bash tools/build-camp-photos.sh
     then check the numbering here still matches.
     --------------------------------------------------------------- */
  var CAMP_PHOTO_BASE = 'assets/img/camps/';
  var CAMP_THUMB_BASE = 'assets/img/camps/thumb/';

  var CAMPS = {
    upcoming: [
      {
        title: '2026 September Holidays Exploration Camp',
        dates: '7 – 11 September 2026',
        venues: ['Aljunied', 'Novena', 'Sengkang', 'Serangoon'],
        ratio: '6 students : 1 coach',
        pricing: [
          { label: 'Standard Pricing', note: 'until 31 Aug', price: 'S$228' },
          { label: 'Closing Pricing', note: 'until 6 Sep', price: 'S$248' }
        ],
        signup: 'https://www.eleverbadminton.com/hec202609'
      }
    ],

    /* One rolling gallery of past camps rather than one per occasion — the
       camps run to the same shape every holiday, so they read as a single
       set. `alt` is per photo because a gallery of children deserves real
       alternative text, not "camp photo 3". */
    gallery: {
      title: 'Élever Exploration camps',
      photos: [
        'camp-1.jpg', 'camp-2.jpg', 'camp-3.jpg', 'camp-4.jpg',
        'camp-5.jpg', 'camp-6.jpg', 'camp-7.jpg'
      ],
      alt: [
        'Campers lined up along the net working through a rally drill with their coach',
        'Campers sprinting through a warm-up across the court',
        'A coach demonstrating a forehand to two campers',
        'A camp group photographed on court with their coaches and rackets',
        'A camper lunging low for a shot, laughing',
        'A camp group standing arms-folded on court with their coach',
        'A camper following through on a forehand as the shuttle leaves the racket'
      ]
    }
  };

  /* ---------------------------------------------------------------
     EVENTS — the service line we deliver for other organisations
     type: 'carnival' | 'clinic' | 'competition'
     --------------------------------------------------------------- */
  var EVENT_TYPES = [
    {
      key: 'carnival', name: 'Carnivals', num: '01',
      what: 'Big, energetic play days with stations, games, prizes and coaches keeping everyone moving.',
      provides: ['Event coaches and marshals', 'Rackets, shuttles and all equipment', 'Court and station setup', 'Scoring, prizes and medals']
    },
    {
      key: 'clinic', name: 'Clinics', num: '02',
      what: 'Focused coaching workshops built around one clear skill or theme.',
      provides: ['BWF-certified coaches', 'Structured session plan for the level', 'Shuttles and training equipment', 'Loan rackets if needed']
    },
    {
      key: 'competition', name: 'Competitions', num: '03',
      what: 'Tournament formats, draws, scoring and court flow handled end to end.',
      provides: ['Format design and seeding', 'Draws, scheduling and results', 'Umpires and court marshals', 'Trophies, medals and prize ceremony']
    }
  ];

  /* All-in-one suite of event management services.
     Not rendered right now — the "Service provided" section was removed from
     events.html in Aug 2026. Kept here so it is easy to bring back. */
  var EVENT_SERVICES = [
    { title: 'Plan', copy: 'Format, run sheet and court flow.' },
    { title: 'Run', copy: 'Coaches, marshals and hosting.' },
    { title: 'Equip', copy: 'Rackets, shuttles, stations and prizes.' },
    { title: 'Score', copy: 'Draws, fixtures, leaderboards and results.' }
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

  /* Previous events, grouped by pillar.
     Not rendered right now — the "Previously" log was removed from
     events.html in Aug 2026. Kept here so it is easy to bring back. */
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

  /* EVENT_SHOWCASE photos are filenames only. `eventPhotoBase` (full size,
     used in the lightbox) and `eventThumbBase` (grid thumbnails) supply the
     directories, so both sets stay in sync. Regenerate both from the
     originals in assets/img/Photos/Events/ with:
         bash tools/build-event-photos.sh                              */
  var EVENT_PHOTO_BASE = 'assets/img/events/';
  var EVENT_THUMB_BASE = 'assets/img/events/thumb/';

  var EVENT_SHOWCASE = [
    {
      title: 'ASICS Badminton Summit 2026',
      type: 'Clinic',
      when: '5 Jul 2026',
      where: 'The Sports Arina @ Jalan Kayu',
      slug: 'asics-summit-2026',
      photos: [
        'asics-summit-2026-1.jpg',
        'asics-summit-2026-2.jpg',
        'asics-summit-2026-3.jpg',
        'asics-summit-2026-4.jpg',
        'asics-summit-2026-5.jpg',
        'asics-summit-2026-6.jpg',
        'asics-summit-2026-7.jpg',
        'asics-summit-2026-8.jpg',
        'asics-summit-2026-9.jpg'
      ]
    },
    {
      title: 'Joo Chiat Badminton Carnival 2026',
      type: 'Carnival',
      when: '23 Jul 2026',
      where: 'St. Patrick’s School',
      slug: 'joo-chiat-carnival-2026',
      photos: [
        'joo-chiat-carnival-2026-1.jpg',
        'joo-chiat-carnival-2026-2.jpg',
        'joo-chiat-carnival-2026-3.jpg',
        'joo-chiat-carnival-2026-4.jpg',
        'joo-chiat-carnival-2026-5.jpg',
        'joo-chiat-carnival-2026-6.jpg',
        'joo-chiat-carnival-2026-7.jpg',
        'joo-chiat-carnival-2026-8.jpg',
        'joo-chiat-carnival-2026-9.jpg',
        'joo-chiat-carnival-2026-10.jpg',
        'joo-chiat-carnival-2026-11.jpg',
        'joo-chiat-carnival-2026-12.jpg',
        'joo-chiat-carnival-2026-13.jpg',
        'joo-chiat-carnival-2026-14.jpg',
        'joo-chiat-carnival-2026-15.jpg',
        'joo-chiat-carnival-2026-16.jpg',
        'joo-chiat-carnival-2026-17.jpg',
        'joo-chiat-carnival-2026-18.jpg'
      ]
    },
    {
      title: 'Serangoon-Paya Lebar Badminton Clinic 2026',
      type: 'Clinic',
      when: '4 Apr 2026',
      where: 'Paya Lebar Kovan Community Club',
      slug: 'serangoon-paya-lebar-clinic-2026',
      photos: [
        'serangoon-paya-lebar-clinic-2026-1.jpg',
        'serangoon-paya-lebar-clinic-2026-2.jpg',
        'serangoon-paya-lebar-clinic-2026-3.jpg',
        'serangoon-paya-lebar-clinic-2026-4.jpg',
        'serangoon-paya-lebar-clinic-2026-5.jpg',
        'serangoon-paya-lebar-clinic-2026-6.jpg',
        'serangoon-paya-lebar-clinic-2026-7.jpg',
        'serangoon-paya-lebar-clinic-2026-8.jpg',
        'serangoon-paya-lebar-clinic-2026-9.jpg'
      ]
    },
    {
      title: 'Bukit Gombak Sports Clinic 2026',
      type: 'Clinic',
      when: '8 Feb 2026',
      where: 'Hillview Community Club',
      slug: 'bukit-gombak-clinic-2026',
      photos: [
        'bukit-gombak-clinic-2026-1.jpg',
        'bukit-gombak-clinic-2026-2.jpg',
        'bukit-gombak-clinic-2026-3.jpg',
        'bukit-gombak-clinic-2026-4.jpg',
        'bukit-gombak-clinic-2026-5.jpg',
        'bukit-gombak-clinic-2026-6.jpg',
        'bukit-gombak-clinic-2026-7.jpg',
        'bukit-gombak-clinic-2026-8.jpg',
        'bukit-gombak-clinic-2026-9.jpg'
      ]
    },
    {
      title: 'ÉB @ Northbrooks Secondary School',
      type: 'Clinic',
      when: '23 Oct 2025',
      where: 'Northbrooks Secondary School',
      slug: 'northbrooks-school-2025',
      photos: [
        'northbrooks-school-2025-1.jpg',
        'northbrooks-school-2025-2.jpg',
        'northbrooks-school-2025-3.jpg',
        'northbrooks-school-2025-4.jpg',
        'northbrooks-school-2025-5.jpg',
        'northbrooks-school-2025-6.jpg',
        'northbrooks-school-2025-7.jpg',
        'northbrooks-school-2025-8.jpg',
        'northbrooks-school-2025-9.jpg'
      ]
    },
    {
      title: 'ÉB @ KFF Singapore Badminton Open 2025',
      type: 'Carnival',
      when: '30 May – 1 Jun 2025',
      where: 'OCBC Square',
      slug: 'kff-singapore-open-2025',
      photos: [
        'kff-singapore-open-2025-1.jpg',
        'kff-singapore-open-2025-2.jpg',
        'kff-singapore-open-2025-3.jpg',
        'kff-singapore-open-2025-4.jpg',
        'kff-singapore-open-2025-5.jpg',
        'kff-singapore-open-2025-6.jpg',
        'kff-singapore-open-2025-7.jpg',
        'kff-singapore-open-2025-8.jpg',
        'kff-singapore-open-2025-9.jpg',
        'kff-singapore-open-2025-10.jpg',
        'kff-singapore-open-2025-11.jpg',
        'kff-singapore-open-2025-12.jpg',
        'kff-singapore-open-2025-13.jpg',
        'kff-singapore-open-2025-14.jpg',
        'kff-singapore-open-2025-15.jpg',
        'kff-singapore-open-2025-16.jpg'
      ]
    }
  ];

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
     ARTICLES — News page + one generated page each (news/<slug>.html)
     `body` is an ordered list of blocks: p | h2 | quote.
     Regenerate the article pages after editing:  node tools/build-news.js
     --------------------------------------------------------------- */
  var ARTICLES = [
    {
      slug: 'bronze-builds-belief-for-para-badminton-athlete-lim',
      title: 'Bronze Builds Belief for Para Badminton Athlete Lim',
      category: 'SG badminton scene', date: '2026-01-30', read: '3 min',
      author: 'Jeremiah Ong',
      excerpt: 'National para badminton player Xavier Lim left the 2025 ASEAN Para Games in Nakhon Ratchasima with an abundant haul – a joint bronze in the men’s singles SH6 – and, more…',
      body: [
        { type: 'p', text: 'National para badminton player Xavier Lim left the 2025 ASEAN Para Games in Nakhon Ratchasima with an abundant haul – a joint bronze in the men’s singles SH6 – and, more importantly, sharper footwork, greater mental strength and belief as he looks to kickstart his season.' },
        { type: 'quote', text: '“The areas I’ve improved the most on are my footwork and my mental strength. Footwork is such an important part of the game, especially so for us short-stature players; we need to be able to cover the whole court with shorter reach. I’ve been working with my coaches a lot on maximising my speed and efficiency of my footwork, to cover the court well.”' },
        { type: 'p', text: 'Adding that his second appearance at the regional Games came with fewer “jitters” compared to his debut in Cambodia in 2023, Lim credited his coaches and sports psychologist for helping him manage pre-game nerves and “maintain focus regardless of the scoreline”. The improved mental approach, he said, allowed him to perform closer to his level during training.' },
        { type: 'p', text: 'After an opening 2-0 (21-18, 21-13) pool stage win against Asian Youth Para Games silver medallist John Cyrus Maclang of the Philippines, Lim faced second seed and eventual gold medallist Subhan Subhan in his next pool stage match.' },
        { type: 'p', text: 'He fell in straight sets (21-9, 21-10) to the Indonesian but still secured a semi-final berth where he was due to face home hope and world no.4 Natthapong Meechai.' },
        { type: 'p', text: 'A 2-0 (21-7, 21-11) loss marked the end of his campaign, but not before bagging the joint bronze on his second outing at the Games' },
        { type: 'p', text: 'Cutting his teeth against superior opponents has only fuelled his hunger in pursuit of improvement.' },
        { type: 'quote', text: '“If you want to be the best, you have to face the best, and it was certainly a good experience playing the top players in ASEAN in Subhan and Nattapong. It’s always great to see how my game measures up against the top players and where I can improve or learn from them,”' },
        { type: 'p', text: 'So, returning home with a medal was merely a bonus for the full-time pharmacist.' },
        { type: 'p', text: '“It definitely feels great to medal, and it’s one of the goals in my badminton career. However, I wasn’t too fixated on the result or getting on the podium, but rather the process and gameplay,” he said.' },
        { type: 'p', text: 'Some other improvements Lim noticed in his performances as compared to his last APG outing were “in my movement on court and tactical understanding”.' },
        { type: 'p', text: 'The major Games experience of interacting with fellow Team Singapore athletes and athletes from other countries was also a highlight of Lim’s time in Thailand.' },
        { type: 'p', text: '“It was enjoyable to watch everyone push their limits,” he added. He was among the 37-strong Team Singapore contingent who often found themselves hopping between sporting venues to cheer each other on.' },
        { type: 'p', text: 'Top-tier competition will come thick and fast for the 25-year-old at the Feb 8–14 Badminton World Federation (BWF) Para Badminton World Championships in Manama, Bahrain, where he is slated to compete in the men’s singles and doubles, where he will partner Brunei’s Ak Muhd Amirul Faiq Pg Zali.' },
        { type: 'p', text: 'A short break will follow before a push towards qualification for October’s Asian Para Games in Nagoya.' },
        { type: 'quote', text: '“I will definitely be taking the lessons learnt and integrating them into my plans for the Asian Games and subsequently the 2028 Paralympics.' },
        { type: 'quote', text: '“I maintain the same passion and determination in working towards qualification for the Games.”' },
        { type: 'p', text: 'With a busy season ahead, Lim’s podium start provides timely encouragement, but it is his renewed belief that will be crucial in carrying him through the months to come.' },
        { type: 'quote', text: '“Belief is the biggest lesson I am taking away.”' },
        { type: 'quote', text: '“To always believe in myself, even when the odds are stacked against me. I need to always trust in my own abilities and dig deep to fight it out.”' }
      ]
    },
    {
      slug: 'an-completes-malaysia-open-three-peat',
      title: 'An completes Malaysia Open three-peat as Kunlavut claims maiden Super 1000 title',
      category: 'World tour', date: '2026-01-13', read: '4 min',
      author: 'Jeremiah Ong',
      excerpt: 'It was the same old story in the women’s singles at the season-opening Malaysia Open, as world no. 1 An completed a three-peat after dispatching China’s Wang Zhiyi 21-15,…',
      body: [
        { type: 'h2', text: 'An-touchable' },
        { type: 'p', text: 'It was the same old story in the women’s singles at the season-opening Malaysia Open, as world no. 1 An completed a three-peat after dispatching China’s Wang Zhiyi 21-15, 24-22 — with December’s Badminton World Federation (BWF) Tour Finals 2-1 defeat likely still fresh in the Chinese player’s memory.' },
        { type: 'p', text: 'Wang pushed hard in the second game and looked poised to take it to a decider after racing to a commanding 17-9 lead. But An had other ideas as she stormed back from 9-17 down to win 24-22 and seal her ninth consecutive victory over Wang Zhiyi and her fifth straight individual title.' },
        { type: 'p', text: 'Elsewhere in the draw, former world champion PV Sindhu also made a remarkable semi-final charge on her competitive comeback after a lengthy injury break. In the earlier rounds, she beat world no. 33 Chinese Taipei’s Sung Shuo-yun and dismissed eighth seed Japan’s Tomoka Miyazaki in just 33 minutes.' },
        { type: 'p', text: 'A quarter-final walkover against Japan’s Akane Yamaguchi — who was wearing a knee brace and retired after losing the first game 21-11 — sent her into the last four, where she later fell to Wang 21-16, 21-15. Her performance in Kuala Lumpur signals momentum building once again, with a projected rise to world no.12.' },
        { type: 'h2', text: 'Kunlavut claims his Super 1000 moment' },
        { type: 'p', text: 'Former world champion Kunlavut Vitidsarn stood on the brink of his maiden Super 1000 title against reigning world champion Shi Yuqi, a familiar rival who had beaten him at the BWF Tour Finals semi-finals just weeks earlier.' },
        { type: 'p', text: 'And Kunlavut had his fairytale ending when the reigning world champion Shi Yuqi retired with a back injury in the final, crushing the latter’s hopes of a third straight Malaysian Open title. The Thai edged the opening game 23-21, before Shi pulled out of the showpiece to hand Kunlavut his maiden Super 1000 title, just a day after reaching his first final at this level.' },
        { type: 'p', text: '“I felt a lot of pressure in the match, but it was also very exciting. This is my first time at a big Super 1000 tournament, and I really hoped to win the gold. It is just amazing, I’m so happy,” Kunlavut told The Star Malaysia.' },
        { type: 'p', text: 'He also expressed his gratitude to Malaysian badminton icon Lee Chong Wei for the guidance he received.' },
        { type: 'p', text: '“He shared everything I needed to know, both on and off the court, and I am very grateful to him," he added.' },
        { type: 'h2', text: 'Early exits and home heartbreak' },
        { type: 'p', text: 'Olympic bronze medallist Lee Zii Jia returned to competition after four months of rehabilitation but struggled to find rhythm, exiting in the opening round after a 39-minute defeat to India’s Ayush Shetty.' },
        { type: 'p', text: 'Singapore’s Loh Kean Yew suffered a similar fate, bowing out at the first hurdle to eventual semi-finalist and third seed Anders Antonsen 21-13, 14-21, 21-18. Compatriot Jason Teh also exited early, losing to India’s Lakshya Sen 21-16, 15-21, 21-14.' },
        { type: 'p', text: 'Home hopes in the women’s doubles, Pearly Tan and Thinaah Muralitharan, finally broke the duck of three consecutive early exits at their home Open, but fell in the second round after losing to Indonesia’s Febriana Kusuma and Meilysa Puspitasari.' },
        { type: 'p', text: 'The world no. 2 pair and SEA Games gold medallists beat the Indonesians in the SEA Games final last month, but succumbed to a tight 24-26, 17-21 defeat on this occasion.' },
        { type: 'p', text: 'Instead, it was China that reigned supreme in the women’s doubles with top-ranked pair Liu Shengshu and Tan Ning avenging their World Tour Finals semi-final loss, seeing out South Korea’s Baek Ha-na and Lee So-hee 21-18. 21-12. China were also guaranteed another winner with an all-China final in the mixed doubles, with second seed Jiang Zhenbang and Wei Yaxin taking on top seed Feng Yan Zhe and Huang Dong Ping, with the latter triumphant in a closely-fought 21-19, 21-19 victory.' },
        { type: 'p', text: 'Malaysian pair and reigning world champions Chen Tang Jie and Toh Ee Wei also missed out on their target of a final berth as their charge was halted in the quarter-finals after a 21-17, 17-21, 21-10 loss to Hong Kong’s Tang Chun Man and Tse Ying Suet.' },
        { type: 'h2', text: 'Men’s doubles — so close yet so far' },
        { type: 'p', text: 'The hosts’ best chance of silverware ultimately came in the men’s doubles – and it came with the nation watching.' },
        { type: 'p', text: 'World No. 2 pair Aaron Chia and Soh Wooi Yik took on South Korean world No. 1 duo Kim Won Ho and Seo Seung Jae in the final, with Malaysian Prime Minister Anwar Ibrahim watching from the stands.' },
        { type: 'p', text: 'After trading sets, the Malaysians mounted a spirited comeback from 11-4 down in the decider, roaring back to 18-17 behind a thunderous home crowd. But composure prevailed on the South Koreans\' side, as they closed out a 21-15, 12-21, 21-18 victory to seal the title. Malaysia’s 12-year men’s doubles title drought at the tournament continues (since Goh V Shem and Lim Khim Wah’s triumph in 2014).' },
        { type: 'p', text: 'The curtain falls on the Malaysia Open with An reigning supreme in the women’s singles and Kunlavut cementing his place in badminton’s elite – the Thai is only the ninth men’s singles player to win titles at a minimum of four BWF World Tour tiers.' },
        { type: 'p', text: 'For more badminton-related news, follow Élever Badminton on Instagram and Facebook.' }
      ]
    }
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
     TEAM SINGAPORE — SG Hub "Team Singapore" tab
     ---------------------------------------------------------------
     `rank` is a LAST-KNOWN figure with the date it was true (`rankAs`),
     never presented as live. The panel links to the official BWF ranking
     page for the current number, and the news feed pulls current stories
     per player at page load.
     Update `rank`/`rankAs` when you refresh these by hand; the site never
     claims a stale number is today's.
     --------------------------------------------------------------- */
  var TEAM_SG = {
    rankingUrl: 'https://bwf.tournamentsoftware.com/ranking/ranking.aspx?rid=70',
    calendarUrl: 'https://corporate.bwfbadminton.com/events/calendar/2026/all/0/-1',
    sbaUrl: 'https://singaporebadminton.org.sg/',
    players: [
      {
        name: 'Loh Kean Yew', discipline: 'Men’s singles', code: 'MS',
        rank: 14, rankAs: 'May 2026',
        note: 'World champion in 2021 — the first Singaporean to win a BWF world title.',
        highlights: ['2021 World Champion', 'Olympian (Tokyo 2020, Paris 2024)'],
        news: 'Loh Kean Yew badminton'
      },
      {
        name: 'Yeo Jia Min', discipline: 'Women’s singles', code: 'WS',
        rank: 38, rankAs: 'May 2026',
        note: 'Former World Junior No. 1 and Singapore’s lead women’s singles player.',
        highlights: ['Former World Junior No. 1', 'Paris 2024 round of 16'],
        news: 'Yeo Jia Min badminton'
      },
      {
        name: 'Jason Teh', discipline: 'Men’s singles', code: 'MS',
        note: 'Singapore’s second men’s singles representative on the world tour.',
        highlights: ['SEA Games team medallist', '2022 Commonwealth Games team bronze'],
        news: 'Jason Teh badminton Singapore'
      },
      {
        name: 'Terry Hee', discipline: 'Doubles', code: 'MD',
        note: 'Commonwealth Games mixed doubles champion, now competing in men’s doubles.',
        highlights: ['2022 Commonwealth Games gold (XD)', '2022 India Open champion'],
        news: 'Terry Hee badminton'
      },
      {
        name: 'Andy Kwek', discipline: 'Men’s doubles', code: 'MD',
        note: 'Men’s doubles regular on the world tour and in Singapore’s team events.',
        highlights: ['Swedish Open champion', 'Asia Team Championships bronze'],
        news: 'Andy Kwek badminton'
      }
    ],
    /* Where the national team's next competitions come from. The hub reads
       the same 2026 calendar the season tracker uses, so this list can never
       drift out of step with it. */
    watchFor: ['Singapore Open', 'BWF World Tour Finals', 'World Championships']
  };

  window.ELEVER_DATA = {
    coaches: COACHES,
    pathways: PATHWAYS,
    classes: CLASSES,
    camps: CAMPS,
    campPhotoBase: CAMP_PHOTO_BASE,
    campThumbBase: CAMP_THUMB_BASE,
    eventTypes: EVENT_TYPES,
    eventServices: EVENT_SERVICES,
    eventsUpcoming: EVENTS_UPCOMING,
    eventsPast: EVENTS_PAST,
    eventShowcase: EVENT_SHOWCASE,
    eventPhotoBase: EVENT_PHOTO_BASE,
    eventThumbBase: EVENT_THUMB_BASE,
    eventGroupLabel: EVENT_GROUP_LABEL,
    partners: PARTNERS,
    articles: ARTICLES,
    racketRatings: RACKET_RATINGS,
    teamSg: TEAM_SG
  };
})();
