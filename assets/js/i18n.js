/* =====================================================================
   ÉLEVER BADMINTON — Internationalisation (i18n)
   - Single dictionary for English (en) + Simplified Chinese (zh)
   - Static DOM nodes are tagged with data-i18n / data-i18n-html /
     data-i18n-ph (placeholder) / data-i18n-aria (aria-label).
   - JS-rendered modules (quiz, news, hub) read strings from window.I18N
     and re-render on the 'i18n:change' event.
   - Language choice persists in localStorage; no page reload needed.
   ===================================================================== */
(function () {
  'use strict';

  var STORAGE_KEY = 'elever-lang';
  var SUPPORTED = ['en', 'zh', 'hi', 'ta', 'ms'];
  // BCP-47 codes for the <html lang> attribute per UI language.
  var LANG_TAG = { en: 'en', zh: 'zh-Hans', hi: 'hi', ta: 'ta', ms: 'ms' };
  // Short label shown on the switcher button, and full name for accessibility.
  var LANG_LABELS = { en: 'EN', zh: '中文', hi: 'हिन्दी', ta: 'தமிழ்', ms: 'BM' };
  var LANG_NAMES = { en: 'English', zh: '中文', hi: 'हिन्दी', ta: 'தமிழ்', ms: 'Bahasa Melayu' };

  /* ------------------------------------------------------------------ */
  /* 1. UI STRINGS                                                       */
  /* ------------------------------------------------------------------ */
  var UI = {
    en: {
      'a11y.skip': 'Skip to main content',
      'intro.skip': 'Skip intro',

      'nav.about': 'About', 'nav.quiz': 'Quiz', 'nav.programs': 'Programs',
      'nav.team': 'Coaches', 'nav.hub': 'SG Hub', 'nav.news': 'News',
      'nav.play': 'Play', 'nav.reviews': 'Reviews', 'nav.join': 'Join us',
      'nav.classes': 'Classes', 'nav.camps': 'Camps', 'nav.events': 'Events',
      'nav.book': 'Book a class', 'nav.contact': 'Contact',

      'hero.eyebrow': 'Singapore · Badminton Excellence',
      'hero.sub': 'To build. To raise. To bring something to a higher position. Élite coaching that turns first swings into championship dreams.',
      'hero.ctaPrograms': 'Explore programs',
      'hero.ctaQuiz': 'Find your twin',
      'hero.hint': '↳ Move your cursor — the shuttles react to you',
      'hero.scroll': 'Scroll',
      'hero.stat1': 'Expert coaches', 'hero.stat2': 'Program pillars', 'hero.stat3': '% Passion',

      'about.kicker': '01 — About Élever',
      'about.title': 'More than a sport.<br><em>A pathway to greatness.</em>',
      'about.lead': '<strong>Élever</strong> <span class="about__def">(verb)</span> — to build or raise; to bring something to a higher position.',
      'about.p1': 'Excellence is a journey — and at Élever Badminton it follows a carefully structured pathway built on progressive pillars. From your very first swing to elite competition, our coaches provide the expert mentorship and supportive community every athlete needs to build confidence and master the game.',
      'about.p2': 'We believe every player deserves world-class guidance, wherever they are in their journey. That belief drives everything we do — on and off the court.',

      'quiz.kicker': '02 — Interactive',
      'quiz.title': 'Which pro is your <em>badminton twin</em>?',
      'quiz.lead': 'Answer 6 quick questions about how you play and think.<br>We\u2019ll reveal which of the world\u2019s badminton stars is your on-court twin — with their photo. <strong>No peeking</strong> — there are 27 possible matches, and yours is a surprise.',
      'quiz.start': 'Start the quiz',
      'quiz.count': '🏸 {n} / {total}',
      'quiz.resultLead': 'Your badminton twin is\u2026',
      'quiz.again': 'Play again',
      'quiz.share': 'Share result',
      'quiz.rrPrompt': 'That’s your pro twin — but what’s your <em>real</em> level? Find out below 👇',
      'quiz.rrCta': 'Get rated on Racket Ratings →',
      'quiz.credit': 'Photo: Wikimedia Commons · {lic}',

      'programs.kicker': '03 — What We Do',
      'programs.title': 'Four ways to <em>rise</em>.',
      'programs.campsTitle': 'Camps',
      'programs.campsBody': 'Our holiday exploration camps turn every school break into a badminton adventure. Game-based learning for players with little to no experience — building strong foundations and physical development while keeping them eager to play more.',
      'programs.classesTitle': 'Classes',
      'programs.classesBody': 'A structured pathway built on four progressive pillars. From your very first swing to elite competition, our classes provide expert mentorship and a supportive community to build confidence and master the game.',
      'programs.clinicsTitle': 'Clinics',
      'programs.clinicsBody': 'Dynamic, community-driven training — specialised, short-term workshops. Players dive deep into technique, footwork and strategy in a high-energy environment tailored to specific age groups and every skill level.',
      'programs.carnivalsTitle': 'Carnivals',
      'programs.carnivalsBody': 'Community outreach that combines clinics, fun games and activities. By bringing the sport into local communities, we make badminton accessible to everyone — celebrating health, connection and the joy of play.',

      'team.kicker': '04 — Our People',
      'team.title': 'Meet the <em>coaches</em>.',
      'team.founders': 'Co-Founders',
      'team.team': 'Our Team',
      'role.cofounderTech': 'Co-Founder · Technical Director',
      'role.cofounder': 'Co-Founder',
      'role.performance': 'Performance Manager · S&C Coach',
      'role.senior': 'Senior Coach',
      'role.development': 'Development Coach',
      'role.assistant': 'Assistant Coach',
      'role.bwf1': 'BWF Level 1',

      'hub.kicker': '05 — Singapore Badminton Hub',
      'hub.title': 'Everything <em>badminton</em>, one place.',
      'hub.hint': 'There\u2019s nowhere in Singapore to find every place to play — so we built it. Browse the halls, learn how to book a court, and find people to hit with. New to the scene? Get your skill level on <a href="https://www.racketratings.net/badminton" target="_blank" rel="noopener">Racket Ratings</a> first. <strong>Not just an academy — the home of badminton in Singapore.</strong>',
      'hub.tabHalls': 'Where to play',
      'hub.tabBook': 'How to book',
      'hub.tabGroups': 'Groups & ratings',
      'hub.searchLabel': 'Find a venue',
      'hub.searchPh': 'Search by name or area, e.g. Tampines',
      'hub.filterAll': 'All venues',
      'hub.filterElever': 'Élever classes',
      'hub.filterPrivate': 'Private halls',
      'hub.filterActivesg': 'ActiveSG (public)',
      'hub.filterClub': 'Country clubs',
      'hub.count': '{n} venues',
      'hub.countOne': '1 venue',
      'hub.empty': 'No venues match your search. Try a different word or filter.',
      'hub.map': 'View map',
      'hub.book': 'Book',
      'hub.bookActivesg': 'Book on ActiveSG',
      'hub.mapAria': 'Open {name} in Google Maps (opens in a new tab)',
      'hub.bookAria': 'Book {name} (opens in a new tab)',
      'hub.note': 'Addresses are compiled from Google Maps and the official SportSG facilities dataset. ActiveSG public halls can also be booked in the MyActiveSG app. Community Club (CC) courts are booked on <a href="https://www.onepa.gov.sg/facilities/search?facility=BADMINTON%20COURTS" target="_blank" rel="noopener">OnePA</a>. Spotted a mistake or a missing hall? <a href="mailto:hello@eleverbadminton.com?subject=SG%20Badminton%20Hub%20—%20hall%20update">Tell us</a>.',
      'tag.private': 'Private', 'tag.activesg': 'ActiveSG', 'tag.club': 'Club', 'tag.elever': 'Élever',

      'book.privateTitle': 'Private halls',
      'book.privateBody': 'Air-conditioned courts you rent by the hour, usually through each hall\u2019s own website or app. Best for a guaranteed slot with no balloting. Prices vary — roughly <strong>S$20–40 per hour</strong> per court.',
      'book.privateStep1': 'Pick a hall on the <button class="hub__inline-link" data-goto="halls" type="button">Where to play</button> tab.',
      'book.privateStep2': 'Open its booking link and choose a date and time.',
      'book.privateStep3': 'Pay online to confirm — you\u2019re set.',
      'book.activesgTitle': 'ActiveSG public halls',
      'book.activesgBody': 'The most affordable way to play — from about <strong>S$3.50–7.40 per hour</strong>. Book at <a href="https://activesg.gov.sg/facility-bookings/activities/YLONatwvqJfikKOmB5N9U/venues" target="_blank" rel="noopener">activesg.gov.sg</a> or in the MyActiveSG app.',
      'book.activesgStep1': 'Log in with <strong>Singpass</strong>, then choose Book a Facility → Badminton.',
      'book.activesgStep2': 'Search by postal code or venue. Each slot is 1 hour (up to 2 per day).',
      'book.activesgStep3': '<strong>Peak</strong> hours (weekdays after 6pm, weekends and public holidays) use a <strong>ballot</strong> that opens about 14 days ahead. <strong>Off-peak</strong> is first-come, released about 13 days ahead at 12pm.',
      'book.ccTitle': 'Community Club (CC) courts',
      'book.ccBody': 'Run by the People\u2019s Association across the island. Prices vary by CC, roughly <strong>S$5–7 per hour</strong>. Book on <a href="https://www.onepa.gov.sg/facilities/search?facility=BADMINTON%20COURTS" target="_blank" rel="noopener">OnePA</a>.',
      'book.ccStep1': 'Log in with <strong>Singpass</strong>, then choose Facilities → Book a Facility.',
      'book.ccStep2': 'Select Badminton Court, then your region, date and time.',
      'book.ccStep3': 'New slots open <strong>daily at 10pm</strong>, up to <strong>15 days</strong> ahead.',

      'groups.featureEyebrow': 'Our top pick · Know your level',
      'groups.featureTitle': 'Racket Ratings',
      'groups.featureBody': 'Not sure how good you actually are — or who to play with? <strong>Racket Ratings</strong> is the free Singapore rating that gives you a real skill level and matches you with players, kakis and games around it. It’s the easiest way to see where you stand — we recommend every player start here.',
      'groups.featureCta': 'Get your free rating →',
      'groups.casualTitle': 'Casual & social play',
      'groups.casualBody': 'Most social games form up on community platforms. Try these to find a session near you and at your level:',
      'groups.casualLink1': '<a href="https://www.racketratings.net/badminton/clubs" target="_blank" rel="noopener">Racket Ratings Clubs</a> — rated players and ladders',
      'groups.casualLink2': '<a href="https://www.meetup.com/find/?keywords=badminton&location=sg--Singapore" target="_blank" rel="noopener">Meetup — Singapore badminton</a>',
      'groups.casualLink3': 'Facebook and Telegram \u201Ckaki\u201D groups (search \u201Cbadminton Singapore\u201D)',
      'groups.casualLink4': 'Your neighbourhood CC — many run drop-in social sessions',
      'groups.coachTitle': 'Prefer structured coaching?',
      'groups.coachBody': 'If you\u2019d rather improve with a coach, that\u2019s exactly what we do. From your first swing to competition, Élever\u2019s camps, classes and clinics have a place for you.',
      'groups.coachCta': 'See our classes',
      'rr.eyebrow': 'Our top pick · Know your level',
      'rr.title': 'Racket Ratings',
      'rr.lead': 'A free platform that gives every badminton player in Singapore a real, comparable skill level — then uses it to match you with clubs, ladders and tournaments at your standard. If you want to find people to play with, this is the single most useful thing on this page.',
      'rr.ratingLabel': '⚡ Rating',
      'rr.ratingDesc': 'How strong you are',
      'rr.rankingLabel': '🏅 Ranking',
      'rr.rankingDesc': 'What you have won',
      'rr.formatsLabel': 'Formats',
      'rr.formats': 'Singles · Doubles · 3v3',
      'rr.cta': 'Get your free rating →',
      'rr.note': 'Free to use, available in English and Chinese, and it covers table tennis, tennis, pickleball and squash too. Élever is not affiliated with Racket Ratings — we point players there because it is the most useful tool in the local scene.',
      'groups.dirEyebrow': 'Recreational play',
      'groups.dirTitle': 'Find a group to play with',
      'groups.dirLead': 'The fastest route to a regular game is Racket Ratings Clubs above — it is kept current by the groups themselves. Below are local groups that have asked us to feature them and are happy to take new players.',
      'groups.addTitle': 'Run a group that welcomes new players?',
      'groups.addBody': 'Tell us the day, time, venue and level and we will list it here — free, whether or not you train with Élever.',
      'groups.addCta': 'Add your group',
      'groups.compTitle': 'Ready to compete?',
      'groups.compBody': 'Once you have a rating, Racket Ratings lists open tournaments you can enter — and lets your own group create one. A low-pressure way into competitive play.',
      'groups.compCta': 'Browse tournaments',

      'news.kicker': '06 — The 2026 Season',
      'news.title': 'Every stop on the <em>world tour</em>.',
      'news.hint': 'The four most recent results from the 2026 HSBC BWF World Tour. Select \u201CShow all\u201D for the full season. Updated 7 Aug 2026.',
      'news.filterAll': 'All', 'news.filterDone': 'Completed', 'news.filterUpcoming': 'Upcoming',
      'news.showAll': 'Show all tournaments',
      'news.showAllN': 'Show all {n} tournaments',
      'news.showLess': 'Show less',
      'news.latest': 'Latest', 'news.upcoming': 'Upcoming',
      'news.tbdUpcoming': 'Scheduled — results to come.',
      'news.tbdDone': 'Completed. Champions per BWF records.',
      'news.source': 'Full schedule and results sourced from the BWF World Tour, Wikipedia and wire reports (AFP/Xinhua). Completed events up to 7 Aug 2026 show verified singles and doubles champions where available; later events list date and grade. No images used.',

      'play.kicker': '07 — Game On',
      'play.title': 'Play a <em>rally</em>.',
      'play.hintDesktop': 'A classic stick-badminton match against the computer. <strong>Move</strong> with ← → (or A/D), <strong>jump</strong> with ↑ (or W), <strong>swing</strong> with Space or ↓. Jump into a high shuttle to <strong>smash</strong> it down; lift low ones over the net. First to 7 points wins.',
      'play.hintMobile': 'A classic stick-badminton match against the computer. Use the on-screen buttons below to move, jump and swing. Jump into a high shuttle to <strong>smash</strong> it down; lift low ones over the net. First to 7 points wins.',
      'play.you': 'You', 'play.rally': 'Rally', 'play.cpu': 'Computer',
      'play.start': 'Start game', 'play.again': 'Play again',
      'play.move': 'Move', 'play.jump': 'Jump', 'play.swing': 'Swing',
      'play.msgStart': 'Select Start. Move under the shuttle, then jump and swing to hit it back.',
      'play.serveYou': 'Your serve! Move with ← →, jump with ↑ / W, swing with Space / ↓.',
      'play.serveCpu': 'Opponent serving — get under the shuttle and swing!',
      'play.shotServe': 'Serve', 'play.shotSmash': 'SMASH!', 'play.shotClear': 'Clear',
      'play.pointYou': 'Point to you', 'play.pointCpu': 'Point to computer',
      'play.reasonNet': '{who} hit the net',
      'play.reasonYourSide': 'the shuttle landed on your side',
      'play.reasonCpuSide': 'the shuttle landed on the computer\u2019s side',
      'play.whoYou': 'you', 'play.whoCpu': 'computer',
      'play.win': 'Game! You win {a}–{b} 🏆',
      'play.lose': 'The computer wins {a}–{b}. Play again!',

      'reflex.kicker': '08 — Reaction Test',
      'reflex.title': 'How fast are your <em>reflexes</em>?',
      'reflex.hint': 'Wait for the shuttle to drop, then tap (or press Space) as fast as you can. Reaction time matters on court — the pros react in under 0.2 seconds.',
      'reflex.start': 'Tap or press Space to start', 'reflex.sub': 'Test your reaction speed',
      'reflex.wait': 'Wait for it…', 'reflex.waitSub': 'Tap or press Space the moment the shuttle drops',
      'reflex.tap': 'TAP NOW!', 'reflex.early': 'Too soon!', 'reflex.earlySub': 'Tap or press Space to try again',
      'reflex.last': 'Last', 'reflex.best': 'Best', 'reflex.rank': 'Rank',
      'reflex.rankF1': 'F1 Driver', 'reflex.rankPro': 'Badminton Pro', 'reflex.rankNormal': 'Normal Human', 'reflex.rankSlow': 'Sluggish',

      'guess.kicker': '09 — Photo Quiz',
      'guess.title': 'Guess the <em>pro</em>.',
      'guess.hint': 'Ten photos, four names each. How many of the world’s badminton stars can you name?',
      'guess.start': 'Start', 'guess.again': 'Play again',
      'guess.count': 'Photo {n}/{total}', 'guess.score': 'Score {s}', 'guess.done': 'Your score',
      'guess.alt': 'Guess this badminton player',
      'guess.end9': 'Incredible — you really know your badminton! 🏆',
      'guess.end6': 'Nice one! You know your stars.',
      'guess.end3': 'Not bad — keep watching!',
      'guess.end0': 'Time to watch more badminton! 🏸',

      'reviews.kicker': '10 — Reviews',
      'reviews.title': 'Loved by <em>players &amp; parents</em>.',
      'reviews.hint': 'What our community says about training at Élever.',
      'reviews.ig': 'See real moments on Instagram',
      'reviews.disclaimer': 'The quotes above are sample placeholders — follow us on Instagram for real training moments, results and updates.',

      'cta.title': 'Ready to <em>elevate</em>?',
      'cta.body': 'Whether it\u2019s your first swing or your next title, there\u2019s a place for you at Élever Badminton.',
      'cta.enquire': 'Enquire now', 'cta.email': 'Email us', 'cta.instagram': 'Follow on Instagram',

      'footer.tag': 'To build. To raise. To rise higher.',
      'footer.instagram': 'Instagram',
      'footer.official': 'Official site',
      'footer.note': 'Concept redesign · Built for Élever Badminton. Photography © Élever Badminton.'
    },

    zh: {
      'a11y.skip': '跳至主要内容',
      'intro.skip': '跳过片头',

      'nav.about': '关于我们', 'nav.quiz': '测验', 'nav.programs': '课程',
      'nav.team': '教练团队', 'nav.hub': '新加坡中心', 'nav.news': '赛事资讯',
      'nav.play': '小游戏', 'nav.reviews': '评价', 'nav.join': '加入我们',
      'nav.classes': '课程', 'nav.camps': '训练营', 'nav.events': '活动',
      'nav.book': '预订课程', 'nav.contact': '联系我们',

      'hero.eyebrow': '新加坡 · 卓越羽毛球',
      'hero.sub': '培养、提升，让你更上一层楼。精英级教学，把第一次挥拍化为冠军梦想。',
      'hero.ctaPrograms': '浏览课程',
      'hero.ctaQuiz': '找出你的球星分身',
      'hero.hint': '↳ 移动光标 — 羽球会随你而动',
      'hero.scroll': '向下滚动',
      'hero.stat1': '专业教练', 'hero.stat2': '课程支柱', 'hero.stat3': '% 热忱',

      'about.kicker': '01 — 关于 Élever',
      'about.title': '不只是一项运动。<br><em>更是一条通往卓越的道路。</em>',
      'about.lead': '<strong>Élever</strong> <span class="about__def">（动词）</span> — 培养、提升；使之更上一层楼。',
      'about.p1': '卓越是一段旅程 — 在 Élever 羽毛球学院，这段旅程遵循一条精心规划、层层递进的成长路径。从你的第一次挥拍到精英赛场，我们的教练提供专业指导与温暖的团队氛围，帮助每位球员建立自信、精通球技。',
      'about.p2': '我们相信，无论处于哪个阶段，每位球员都值得获得世界级的指导。这份信念驱动着我们所做的一切 — 无论场上还是场下。',

      'quiz.kicker': '02 — 互动测验',
      'quiz.title': '哪位职业球星是你的<em>羽球分身</em>？',
      'quiz.lead': '回答 6 道关于你打法与性格的小问题。<br>我们将揭晓哪位世界羽球明星是你的场上分身 — 并附上照片。<strong>先别偷看</strong> — 共有 27 种可能，结果保证让你惊喜。',
      'quiz.start': '开始测验',
      'quiz.count': '🏸 {n} / {total}',
      'quiz.resultLead': '你的羽球分身是\u2026',
      'quiz.again': '再玩一次',
      'quiz.share': '分享结果',
      'quiz.rrPrompt': '这是你的球星分身 — 那你<em>真正</em>的水平呢？在下面看看 👇',
      'quiz.rrCta': '前往 Racket Ratings 评级 →',
      'quiz.credit': '照片：维基共享资源 · {lic}',

      'programs.kicker': '03 — 我们的课程',
      'programs.title': '四种方式，助你<em>提升</em>。',
      'programs.campsTitle': '假期训练营',
      'programs.campsBody': '我们的假期探索训练营，让每个学校假期都成为一场羽球冒险。以游戏化教学面向零基础或初学球员 — 打好扎实基础、促进体能发展，同时让他们意犹未尽、乐于继续打球。',
      'programs.classesTitle': '常规课程',
      'programs.classesBody': '一条建立在四大递进支柱上的结构化成长路径。从第一次挥拍到精英赛场，我们的课程提供专业指导与温暖团队，帮助你建立自信、精通球技。',
      'programs.clinicsTitle': '专项工作坊',
      'programs.clinicsBody': '充满活力、以社区为本的训练 — 专项短期工作坊。球员在高能量的环境中深入钻研技术、步法与战术，并针对不同年龄层与各种水平量身定制。',
      'programs.carnivalsTitle': '羽球嘉年华',
      'programs.carnivalsBody': '结合工作坊、趣味游戏与社区活动的社区推广。我们把羽毛球带进各个社区，让人人都能参与 — 一起庆祝健康、连结与运动的快乐。',

      'team.kicker': '04 — 我们的团队',
      'team.title': '认识我们的<em>教练</em>。',
      'team.founders': '联合创始人',
      'team.team': '我们的团队',
      'role.cofounderTech': '联合创始人 · 技术总监',
      'role.cofounder': '联合创始人',
      'role.performance': '表现经理 · 体能教练',
      'role.senior': '资深教练',
      'role.development': '培训教练',
      'role.assistant': '助理教练',
      'role.bwf1': '世界羽联一级教练',

      'hub.kicker': '05 — 新加坡羽毛球中心',
      'hub.title': '羽球一切，尽在<em>一处</em>。',
      'hub.hint': '在新加坡，没有一个地方能查到所有打球场地 — 于是我们把它做了出来。浏览球馆、了解如何订场，并找到一起打球的伙伴。新手？先到 <a href="https://www.racketratings.net/badminton" target="_blank" rel="noopener">Racket Ratings</a> 看看你的水平。<strong>不只是一家学院 — 更是新加坡羽球之家。</strong>',
      'hub.tabHalls': '去哪打球',
      'hub.tabBook': '如何订场',
      'hub.tabGroups': '球友与评级',
      'hub.searchLabel': '查找场馆',
      'hub.searchPh': '按名称或地区搜索，例如：淡滨尼',
      'hub.filterAll': '全部场馆',
      'hub.filterElever': 'Élever 课程场地',
      'hub.filterPrivate': '私人球馆',
      'hub.filterActivesg': 'ActiveSG（公共）',
      'hub.filterClub': '乡村俱乐部',
      'hub.count': '{n} 个场馆',
      'hub.countOne': '1 个场馆',
      'hub.empty': '没有符合条件的场馆。请换个关键词或筛选条件。',
      'hub.map': '查看地图',
      'hub.book': '订场',
      'hub.bookActivesg': '在 ActiveSG 订场',
      'hub.mapAria': '在 Google 地图中打开 {name}（在新标签页打开）',
      'hub.bookAria': '预订 {name}（在新标签页打开）',
      'hub.note': '地址整理自 Google 地图与新加坡体育理事会（SportSG）官方场馆数据。ActiveSG 公共球馆也可在 MyActiveSG 应用中预订。民众俱乐部（CC）球场可在 <a href="https://www.onepa.gov.sg/facilities/search?facility=BADMINTON%20COURTS" target="_blank" rel="noopener">OnePA</a> 预订。发现错误或遗漏的球馆？<a href="mailto:hello@eleverbadminton.com?subject=SG%20Badminton%20Hub%20—%20hall%20update">告诉我们</a>。',
      'tag.private': '私人', 'tag.activesg': 'ActiveSG', 'tag.club': '俱乐部', 'tag.elever': 'Élever',

      'book.privateTitle': '私人球馆',
      'book.privateBody': '按小时租用的冷气球场，通常通过各球馆自己的网站或应用预订。适合想要确定场地、无需抽签的情况。价格不一 — 每片场地大约<strong>每小时 20–40 新元</strong>。',
      'book.privateStep1': '在<button class="hub__inline-link" data-goto="halls" type="button">“去哪打球”</button>标签页中选择一家球馆。',
      'book.privateStep2': '打开它的预订链接，选择日期与时间。',
      'book.privateStep3': '在线付款确认 — 大功告成。',
      'book.activesgTitle': 'ActiveSG 公共球馆',
      'book.activesgBody': '最实惠的打球方式 — 大约<strong>每小时 3.50–7.40 新元</strong>。可在 <a href="https://activesg.gov.sg/facility-bookings/activities/YLONatwvqJfikKOmB5N9U/venues" target="_blank" rel="noopener">activesg.gov.sg</a> 或 MyActiveSG 应用预订。',
      'book.activesgStep1': '使用 <strong>Singpass</strong> 登录，然后选择「Book a Facility（预订设施）」→「Badminton（羽毛球）」。',
      'book.activesgStep2': '按邮区编号或场馆搜索。每个时段为 1 小时（每天最多 2 个时段）。',
      'book.activesgStep3': '<strong>高峰</strong>时段（工作日晚上 6 点后、周末及公共假日）采用<strong>抽签</strong>，约提前 14 天开放。<strong>非高峰</strong>为先到先得，约提前 13 天中午 12 点开放。',
      'book.ccTitle': '民众俱乐部（CC）球场',
      'book.ccBody': '由人民协会在全岛各地运营。各 CC 价格不一，大约<strong>每小时 5–7 新元</strong>。可在 <a href="https://www.onepa.gov.sg/facilities/search?facility=BADMINTON%20COURTS" target="_blank" rel="noopener">OnePA</a> 预订。',
      'book.ccStep1': '使用 <strong>Singpass</strong> 登录，然后选择「Facilities（设施）」→「Book a Facility（预订设施）」。',
      'book.ccStep2': '选择「Badminton Court（羽毛球场）」，再选地区、日期与时间。',
      'book.ccStep3': '新时段<strong>每晚 10 点</strong>开放，最多可提前<strong>15 天</strong>预订。',

      'groups.featureEyebrow': '首推 · 了解你的水平',
      'groups.featureTitle': 'Racket Ratings 评级',
      'groups.featureBody': '不确定自己到底什么水平、也不知道该和谁打？<strong>Racket Ratings</strong> 是新加坡免费的球员评级，给你一个真实的技术等级，并帮你匹配水平相近的球员、球友与球局。想知道自己的实力，这是最简单的方式 — 我们建议每位球员都从这里开始。',
      'groups.featureCta': '免费获取你的评级 →',
      'groups.casualTitle': '休闲与社交球局',
      'groups.casualBody': '大多数社交球局都在社区平台上组织。试试以下渠道，找到就近且水平相当的球局：',
      'groups.casualLink1': '<a href="https://www.racketratings.net/badminton/clubs" target="_blank" rel="noopener">Racket Ratings Clubs</a> — 有评级的球员与天梯赛',
      'groups.casualLink2': '<a href="https://www.meetup.com/find/?keywords=badminton&location=sg--Singapore" target="_blank" rel="noopener">Meetup — 新加坡羽毛球</a>',
      'groups.casualLink3': 'Facebook 与 Telegram 的“球友（kaki）”群组（搜索“badminton Singapore”）',
      'groups.casualLink4': '你家附近的民众俱乐部（CC） — 许多都设有随到随打的社交场次',
      'groups.coachTitle': '想要系统化的训练？',
      'groups.coachBody': '如果你更愿意在教练指导下进步，这正是我们的专长。从第一次挥拍到参加比赛，Élever 的训练营、常规课程与工作坊都为你留有一席之地。',
      'groups.coachCta': '查看我们的课程',
      'rr.eyebrow': '我们的首选 · 了解你的水平',
      'rr.title': 'Racket Ratings 评级',
      'rr.lead': '一个免费平台，为新加坡每位羽球爱好者提供真实、可比较的技术等级，并据此为你匹配水平相近的俱乐部、天梯赛与比赛。如果你想找人一起打球，这是本页最有用的工具。',
      'rr.ratingLabel': '⚡ Rating 评级',
      'rr.ratingDesc': '你的实力有多强',
      'rr.rankingLabel': '🏅 Ranking 排名',
      'rr.rankingDesc': '你赢得过什么',
      'rr.formatsLabel': '比赛形式',
      'rr.formats': '单打 · 双打 · 3v3',
      'rr.cta': '免费获取你的评级 →',
      'rr.note': '免费使用，支持中英文，同时涵盖乒乓球、网球、匹克球与壁球。Élever 与 Racket Ratings 并无隶属关系 — 我们推荐它，是因为它是本地球圈中最实用的工具。',
      'groups.dirEyebrow': '休闲球局',
      'groups.dirTitle': '找到一起打球的球友',
      'groups.dirLead': '想固定打球，最快的方式是上方的 Racket Ratings Clubs — 由各球队自行维护，信息最新。以下是主动请我们推荐、并欢迎新球友加入的本地球局。',
      'groups.addTitle': '你的球局欢迎新球友吗？',
      'groups.addBody': '告诉我们时间、地点与水平，我们免费为你列在这里 — 无论你是否在 Élever 训练。',
      'groups.addCta': '登记你的球局',
      'groups.compTitle': '准备好参赛了吗？',
      'groups.compBody': '有了评级后，Racket Ratings 会列出你可以报名的公开赛事，你的球局也能自行创建比赛。这是进入竞技赛场最轻松的方式。',
      'groups.compCta': '浏览赛事',

      'news.kicker': '06 — 2026 赛季',
      'news.title': '世界巡回赛的<em>每一站</em>。',
      'news.hint': '2026 汇丰世界羽联世界巡回赛最近的四项赛果。点击“显示全部”查看整个赛季。更新于 2026 年 8 月 7 日。',
      'news.filterAll': '全部', 'news.filterDone': '已结束', 'news.filterUpcoming': '即将举行',
      'news.showAll': '显示全部赛事',
      'news.showAllN': '显示全部 {n} 项赛事',
      'news.showLess': '收起',
      'news.latest': '最新', 'news.upcoming': '即将举行',
      'news.tbdUpcoming': '已排期 — 赛果待定。',
      'news.tbdDone': '已结束。冠军以世界羽联记录为准。',
      'news.source': '完整赛程与赛果来源于世界羽联世界巡回赛、维基百科及通讯社报道（法新社／新华社）。截至 2026 年 8 月 7 日已结束的赛事，在可查证的情况下列出单打与双打冠军；较晚的赛事仅列出日期与级别。未使用任何图片。',

      'play.kicker': '07 — 开打',
      'play.title': '来打一个<em>回合</em>。',
      'play.hintDesktop': '一场经典火柴人风格的羽球对战，对手是电脑。用 ← → （或 A/D）<strong>移动</strong>，用 ↑（或 W）<strong>起跳</strong>，用空格或 ↓ <strong>挥拍</strong>。跳起击打高球可<strong>扣杀</strong>；低球则挑高过网。先得 7 分者胜。',
      'play.hintMobile': '一场经典火柴人风格的羽球对战，对手是电脑。使用下方的屏幕按钮移动、起跳与挥拍。跳起击打高球可<strong>扣杀</strong>；低球则挑高过网。先得 7 分者胜。',
      'play.you': '你', 'play.rally': '回合', 'play.cpu': '电脑',
      'play.start': '开始游戏', 'play.again': '再玩一次',
      'play.move': '移动', 'play.jump': '起跳', 'play.swing': '挥拍',
      'play.msgStart': '点击“开始游戏”。移动到羽球下方，起跳并挥拍将球回击。',
      'play.serveYou': '轮到你发球！用 ← → 移动，↑ / W 起跳，空格 / ↓ 挥拍。',
      'play.serveCpu': '对手发球 — 移到羽球下方并挥拍！',
      'play.shotServe': '发球', 'play.shotSmash': '扣杀！', 'play.shotClear': '高远球',
      'play.pointYou': '你得一分', 'play.pointCpu': '电脑得一分',
      'play.reasonNet': '{who}挂网',
      'play.reasonYourSide': '羽球落在你这一侧',
      'play.reasonCpuSide': '羽球落在电脑那一侧',
      'play.whoYou': '你', 'play.whoCpu': '电脑',
      'play.win': '胜利！你以 {a}–{b} 获胜 🏆',
      'play.lose': '电脑以 {a}–{b} 获胜。再玩一次吧！',

      'reflex.kicker': '08 — 反应测试',
      'reflex.title': '你的<em>反应</em>有多快？',
      'reflex.hint': '等羽球落下，然后尽快点击（或按空格键）。场上反应速度很关键 — 职业球员的反应不到 0.2 秒。',
      'reflex.start': '点击或按空格键开始', 'reflex.sub': '测测你的反应速度',
      'reflex.wait': '稍等…', 'reflex.waitSub': '羽球一落下就点击或按空格键',
      'reflex.tap': '快点击！', 'reflex.early': '太早了！', 'reflex.earlySub': '点击或按空格键再试一次',
      'reflex.last': '上次', 'reflex.best': '最佳', 'reflex.rank': '评级',
      'reflex.rankF1': 'F1 车手', 'reflex.rankPro': '职业球员', 'reflex.rankNormal': '普通人', 'reflex.rankSlow': '较迟缓',

      'guess.kicker': '09 — 看图猜球星',
      'guess.title': '<em>猜猜</em>这位球星。',
      'guess.hint': '十张照片，每题四个名字。你能认出多少位世界羽球明星？',
      'guess.start': '开始', 'guess.again': '再玩一次',
      'guess.count': '第 {n}/{total} 张', 'guess.score': '得分 {s}', 'guess.done': '你的得分',
      'guess.alt': '猜猜这位羽毛球运动员',
      'guess.end9': '太厉害了 — 你真是羽球通！🏆',
      'guess.end6': '不错！你很了解这些球星。',
      'guess.end3': '还行 — 继续看比赛吧！',
      'guess.end0': '该多看看羽毛球啦！🏸',

      'reviews.kicker': '10 — 评价',
      'reviews.title': '深受<em>球员与家长</em>喜爱。',
      'reviews.hint': '我们的学员与家长如何评价在 Élever 的训练。',
      'reviews.ig': '在 Instagram 看真实瞬间',
      'reviews.disclaimer': '以上评价为示例占位文字 — 关注我们的 Instagram，查看真实的训练瞬间、成绩与动态。',

      'cta.title': '准备好<em>提升</em>了吗？',
      'cta.body': '无论是你的第一次挥拍，还是下一座奖杯 — 在 Élever 羽毛球学院，总有属于你的一席之地。',
      'cta.enquire': '立即咨询', 'cta.email': '发送邮件', 'cta.instagram': '关注 Instagram',

      'footer.tag': '培养、提升，更上一层楼。',
      'footer.instagram': 'Instagram',
      'footer.official': '官方网站',
      'footer.note': '概念改版设计 · 为 Élever 羽毛球学院打造。摄影 © Élever 羽毛球学院。'
    },

    hi: {
      'a11y.skip': 'मुख्य सामग्री पर जाएँ',
      'intro.skip': 'इंट्रो छोड़ें',

      'nav.about': 'परिचय', 'nav.quiz': 'क्विज़', 'nav.programs': 'प्रोग्राम',
      'nav.team': 'कोच', 'nav.hub': 'SG हब', 'nav.news': 'समाचार',
      'nav.play': 'खेलें', 'nav.reviews': 'समीक्षाएँ', 'nav.join': 'जुड़ें',
      'nav.classes': 'कक्षाएँ', 'nav.camps': 'कैम्प', 'nav.events': 'इवेंट्स',
      'nav.book': 'क्लास बुक करें', 'nav.contact': 'संपर्क',

      'hero.eyebrow': 'सिंगापुर · बैडमिंटन उत्कृष्टता',
      'hero.sub': 'निर्माण करें। ऊँचा उठें। किसी चीज़ को और ऊँचे स्तर तक ले जाएँ। एलीट कोचिंग जो पहली स्ट्रोक को चैंपियनशिप के सपनों में बदल देती है।',
      'hero.ctaPrograms': 'प्रोग्राम देखें',
      'hero.ctaQuiz': 'अपना जुड़वाँ खोजें',
      'hero.hint': '↳ अपना कर्सर हिलाएँ — शटल आप पर प्रतिक्रिया देते हैं',
      'hero.scroll': 'स्क्रॉल',
      'hero.stat1': 'विशेषज्ञ कोच', 'hero.stat2': 'प्रोग्राम स्तंभ', 'hero.stat3': '% जुनून',

      'about.kicker': '01 — Élever के बारे में',
      'about.title': 'सिर्फ़ एक खेल नहीं।<br><em>महानता की ओर एक राह।</em>',
      'about.lead': '<strong>Élever</strong> <span class="about__def">(क्रिया)</span> — निर्माण करना या ऊपर उठाना; किसी चीज़ को और ऊँचे स्थान तक ले जाना।',
      'about.p1': 'उत्कृष्टता एक यात्रा है — और Élever Badminton में यह क्रमिक स्तंभों पर बनी एक सुनियोजित राह पर चलती है। आपकी पहली स्ट्रोक से लेकर एलीट प्रतिस्पर्धा तक, हमारे कोच हर खिलाड़ी को आत्मविश्वास बनाने और खेल में महारत हासिल करने के लिए विशेषज्ञ मार्गदर्शन और सहयोगी समुदाय प्रदान करते हैं।',
      'about.p2': 'हमारा मानना है कि हर खिलाड़ी विश्वस्तरीय मार्गदर्शन का हक़दार है, चाहे वह अपनी यात्रा में कहीं भी हो। यही विश्वास कोर्ट पर और बाहर, हमारे हर काम को प्रेरित करता है।',

      'quiz.kicker': '02 — इंटरैक्टिव',
      'quiz.title': 'कौन-सा प्रो आपका <em>बैडमिंटन जुड़वाँ</em> है?',
      'quiz.lead': 'आप कैसे खेलते और सोचते हैं, इस पर 6 छोटे सवालों के जवाब दें।<br>हम बताएँगे कि दुनिया के कौन-से बैडमिंटन सितारे आपके कोर्ट-जुड़वाँ हैं — उनकी तस्वीर के साथ। <strong>झाँकना मना है</strong> — 27 संभावित मैच हैं, और आपका एक सरप्राइज़ है।',
      'quiz.start': 'क्विज़ शुरू करें',
      'quiz.count': '🏸 {n} / {total}',
      'quiz.resultLead': 'आपका बैडमिंटन जुड़वाँ है…',
      'quiz.again': 'फिर से खेलें',
      'quiz.share': 'नतीजा शेयर करें',
      'quiz.rrPrompt': 'यह रहा आपका प्रो जुड़वाँ — पर आपका <em>असली</em> स्तर क्या है? नीचे जानें 👇',
      'quiz.rrCta': 'Racket Ratings पर रेटिंग पाएँ →',
      'quiz.credit': 'तस्वीर: Wikimedia Commons · {lic}',

      'programs.kicker': '03 — हम क्या करते हैं',
      'programs.title': 'ऊपर उठने के <em>चार</em> रास्ते।',
      'programs.campsTitle': 'कैम्प',
      'programs.campsBody': 'हमारे छुट्टियों के एक्सप्लोरेशन कैम्प हर स्कूल-अवकाश को बैडमिंटन के रोमांच में बदल देते हैं। कम या बिना अनुभव वाले खिलाड़ियों के लिए खेल-आधारित सीख — मज़बूत बुनियाद और शारीरिक विकास, और खेलने का उत्साह बनाए रखते हुए।',
      'programs.classesTitle': 'कक्षाएँ',
      'programs.classesBody': 'चार क्रमिक स्तंभों पर बनी एक सुनियोजित राह। पहली स्ट्रोक से लेकर एलीट प्रतिस्पर्धा तक, हमारी कक्षाएँ आत्मविश्वास बनाने और खेल में महारत के लिए विशेषज्ञ मार्गदर्शन और सहयोगी समुदाय देती हैं।',
      'programs.clinicsTitle': 'क्लिनिक',
      'programs.clinicsBody': 'गतिशील, समुदाय-संचालित प्रशिक्षण — विशेष, अल्पकालिक वर्कशॉप। खिलाड़ी तकनीक, फुटवर्क और रणनीति में गहराई से उतरते हैं, हर आयु-वर्ग और स्तर के अनुरूप एक ऊर्जावान माहौल में।',
      'programs.carnivalsTitle': 'कार्निवल',
      'programs.carnivalsBody': 'सामुदायिक पहुँच जो क्लिनिक, मज़ेदार खेल और गतिविधियों को जोड़ती है। खेल को स्थानीय समुदायों तक ले जाकर हम बैडमिंटन को सबके लिए सुलभ बनाते हैं — स्वास्थ्य, जुड़ाव और खेल के आनंद का उत्सव।',

      'team.kicker': '04 — हमारी टीम',
      'team.title': '<em>कोचों</em> से मिलें।',
      'team.founders': 'सह-संस्थापक',
      'team.team': 'हमारी टीम',
      'role.cofounderTech': 'सह-संस्थापक · तकनीकी निदेशक',
      'role.cofounder': 'सह-संस्थापक',
      'role.performance': 'परफ़ॉर्मेंस मैनेजर · S&C कोच',
      'role.senior': 'वरिष्ठ कोच',
      'role.development': 'डेवलपमेंट कोच',
      'role.assistant': 'सहायक कोच',
      'role.bwf1': 'BWF लेवल 1',

      'hub.kicker': '05 — सिंगापुर बैडमिंटन हब',
      'hub.title': 'बैडमिंटन का <em>सब कुछ</em>, एक जगह।',
      'hub.hint': 'सिंगापुर में खेलने की हर जगह ढूँढने के लिए कोई एक स्थान नहीं था — तो हमने बना दिया। हॉल देखें, कोर्ट बुक करना सीखें, और साथ खेलने वाले लोग खोजें। नए हैं? पहले <a href="https://www.racketratings.net/badminton" target="_blank" rel="noopener">Racket Ratings</a> पर अपना स्तर जानें। <strong>सिर्फ़ एक अकादमी नहीं — सिंगापुर में बैडमिंटन का घर।</strong>',
      'hub.tabHalls': 'कहाँ खेलें',
      'hub.tabBook': 'बुक कैसे करें',
      'hub.tabGroups': 'ग्रुप और रेटिंग',
      'hub.searchLabel': 'वेन्यू खोजें',
      'hub.searchPh': 'नाम या इलाके से खोजें, जैसे Tampines',
      'hub.filterAll': 'सभी वेन्यू',
      'hub.filterElever': 'Élever कक्षाएँ',
      'hub.filterPrivate': 'निजी हॉल',
      'hub.filterActivesg': 'ActiveSG (सार्वजनिक)',
      'hub.filterClub': 'कंट्री क्लब',
      'hub.count': '{n} वेन्यू',
      'hub.countOne': '1 वेन्यू',
      'hub.empty': 'आपकी खोज से कोई वेन्यू मेल नहीं खाता। कोई और शब्द या फ़िल्टर आज़माएँ।',
      'hub.map': 'नक्शा देखें',
      'hub.book': 'बुक करें',
      'hub.bookActivesg': 'ActiveSG पर बुक करें',
      'hub.mapAria': '{name} को Google Maps में खोलें (नए टैब में खुलता है)',
      'hub.bookAria': '{name} बुक करें (नए टैब में खुलता है)',
      'hub.note': 'पते Google Maps और आधिकारिक SportSG सुविधा डेटासेट से संकलित हैं। ActiveSG सार्वजनिक हॉल MyActiveSG ऐप में भी बुक किए जा सकते हैं। Community Club (CC) कोर्ट <a href="https://www.onepa.gov.sg/facilities/search?facility=BADMINTON%20COURTS" target="_blank" rel="noopener">OnePA</a> पर बुक होते हैं। कोई गलती या छूटा हुआ हॉल दिखा? <a href="mailto:hello@eleverbadminton.com?subject=SG%20Badminton%20Hub%20—%20hall%20update">हमें बताएँ</a>।',
      'tag.private': 'निजी', 'tag.activesg': 'ActiveSG', 'tag.club': 'क्लब', 'tag.elever': 'Élever',

      'book.privateTitle': 'निजी हॉल',
      'book.privateBody': 'वातानुकूलित कोर्ट जिन्हें आप घंटे के हिसाब से किराए पर लेते हैं, आमतौर पर हर हॉल की अपनी वेबसाइट या ऐप के ज़रिए। बिना बैलट के पक्की स्लॉट के लिए सबसे अच्छा। कीमतें अलग-अलग — प्रति कोर्ट लगभग <strong>S$20–40 प्रति घंटा</strong>।',
      'book.privateStep1': '<button class="hub__inline-link" data-goto="halls" type="button">कहाँ खेलें</button> टैब पर एक हॉल चुनें।',
      'book.privateStep2': 'उसका बुकिंग लिंक खोलें और तारीख़ व समय चुनें।',
      'book.privateStep3': 'ऑनलाइन भुगतान कर पुष्टि करें — हो गया।',
      'book.activesgTitle': 'ActiveSG सार्वजनिक हॉल',
      'book.activesgBody': 'खेलने का सबसे किफ़ायती तरीका — लगभग <strong>S$3.50–7.40 प्रति घंटा</strong> से। <a href="https://activesg.gov.sg/facility-bookings/activities/YLONatwvqJfikKOmB5N9U/venues" target="_blank" rel="noopener">activesg.gov.sg</a> पर या MyActiveSG ऐप में बुक करें।',
      'book.activesgStep1': '<strong>Singpass</strong> से लॉग इन करें, फिर Book a Facility → Badminton चुनें।',
      'book.activesgStep2': 'पोस्टल कोड या वेन्यू से खोजें। हर स्लॉट 1 घंटे का (रोज़ 2 तक)।',
      'book.activesgStep3': '<strong>पीक</strong> घंटे (सप्ताह में शाम 6 बजे के बाद, सप्ताहांत और सार्वजनिक अवकाश) एक <strong>बैलट</strong> से चलते हैं जो लगभग 14 दिन पहले खुलता है। <strong>ऑफ़-पीक</strong> पहले-आओ-पहले-पाओ, लगभग 13 दिन पहले दोपहर 12 बजे जारी।',
      'book.ccTitle': 'Community Club (CC) कोर्ट',
      'book.ccBody': 'पूरे द्वीप में People’s Association द्वारा संचालित। कीमतें CC के अनुसार अलग, लगभग <strong>S$5–7 प्रति घंटा</strong>। <a href="https://www.onepa.gov.sg/facilities/search?facility=BADMINTON%20COURTS" target="_blank" rel="noopener">OnePA</a> पर बुक करें।',
      'book.ccStep1': '<strong>Singpass</strong> से लॉग इन करें, फिर Facilities → Book a Facility चुनें।',
      'book.ccStep2': 'Badminton Court चुनें, फिर अपना क्षेत्र, तारीख़ और समय।',
      'book.ccStep3': 'नई स्लॉट <strong>रोज़ रात 10 बजे</strong> खुलती हैं, <strong>15 दिन</strong> पहले तक।',

      'groups.featureEyebrow': 'हमारी टॉप पसंद · अपना स्तर जानें',
      'groups.featureTitle': 'Racket Ratings',
      'groups.featureBody': 'पक्का नहीं कि आप असल में कितने अच्छे हैं — या किसके साथ खेलें? <strong>Racket Ratings</strong> सिंगापुर की मुफ़्त रेटिंग है जो आपको एक असली स्किल-स्तर देती है और उसी के आसपास के खिलाड़ियों, kaki और मैचों से जोड़ती है। यह जानने का सबसे आसान तरीका कि आप कहाँ खड़े हैं — हम हर खिलाड़ी को यहीं से शुरू करने की सलाह देते हैं।',
      'groups.featureCta': 'अपनी मुफ़्त रेटिंग पाएँ →',
      'groups.casualTitle': 'कैज़ुअल और सोशल खेल',
      'groups.casualBody': 'ज़्यादातर सोशल गेम समुदाय प्लेटफ़ॉर्म पर बनते हैं। अपने पास और अपने स्तर का सेशन खोजने के लिए ये आज़माएँ:',
      'groups.casualLink1': '<a href="https://www.racketratings.net/badminton/clubs" target="_blank" rel="noopener">Racket Ratings Clubs</a> — रेटेड खिलाड़ी और लैडर',
      'groups.casualLink2': '<a href="https://www.meetup.com/find/?keywords=badminton&location=sg--Singapore" target="_blank" rel="noopener">Meetup — सिंगापुर बैडमिंटन</a>',
      'groups.casualLink3': 'Facebook और Telegram के “kaki” ग्रुप (“badminton Singapore” खोजें)',
      'groups.casualLink4': 'आपका पड़ोसी CC — कई ड्रॉप-इन सोशल सेशन चलाते हैं',
      'groups.coachTitle': 'संरचित कोचिंग पसंद है?',
      'groups.coachBody': 'अगर आप किसी कोच के साथ सुधार करना चाहते हैं, तो हम यही करते हैं। पहली स्ट्रोक से प्रतिस्पर्धा तक, Élever के कैम्प, कक्षाएँ और क्लिनिक में आपके लिए जगह है।',
      'groups.coachCta': 'हमारी कक्षाएँ देखें',
      'rr.eyebrow': 'हमारी पहली पसंद · अपना स्तर जानें',
      'rr.title': 'Racket Ratings',
      'rr.lead': 'एक मुफ़्त प्लेटफ़ॉर्म जो सिंगापुर के हर बैडमिंटन खिलाड़ी को एक वास्तविक, तुलना-योग्य स्किल-स्तर देता है — और उसी के आधार पर आपको आपके स्तर के क्लब, लैडर और टूर्नामेंट से जोड़ता है। साथ खेलने के लिए लोग ढूँढने हैं, तो इस पेज पर यही सबसे उपयोगी चीज़ है।',
      'rr.ratingLabel': '⚡ Rating',
      'rr.ratingDesc': 'आप कितने मज़बूत हैं',
      'rr.rankingLabel': '🏅 Ranking',
      'rr.rankingDesc': 'आपने क्या जीता है',
      'rr.formatsLabel': 'फ़ॉर्मैट',
      'rr.formats': 'सिंगल्स · डबल्स · 3v3',
      'rr.cta': 'अपनी मुफ़्त रेटिंग पाएँ →',
      'rr.note': 'उपयोग में मुफ़्त, अंग्रेज़ी और चीनी में उपलब्ध, और यह टेबल टेनिस, टेनिस, पिकलबॉल तथा स्क्वैश भी कवर करता है। Élever का Racket Ratings से कोई संबंध नहीं है — हम इसे इसलिए सुझाते हैं क्योंकि यह स्थानीय बैडमिंटन जगत का सबसे उपयोगी टूल है।',
      'groups.dirEyebrow': 'मनोरंजक खेल',
      'groups.dirTitle': 'साथ खेलने के लिए ग्रुप खोजें',
      'groups.dirLead': 'नियमित खेल का सबसे तेज़ रास्ता ऊपर दिया Racket Ratings Clubs है — जिसे ग्रुप स्वयं अपडेट रखते हैं। नीचे वे स्थानीय ग्रुप हैं जिन्होंने हमसे सूचीबद्ध होने को कहा है और जो नए खिलाड़ियों का स्वागत करते हैं।',
      'groups.addTitle': 'क्या आपका ग्रुप नए खिलाड़ियों का स्वागत करता है?',
      'groups.addBody': 'हमें दिन, समय, स्थान और स्तर बताएँ — हम इसे यहाँ मुफ़्त सूचीबद्ध कर देंगे, चाहे आप Élever में प्रशिक्षण लें या न लें।',
      'groups.addCta': 'अपना ग्रुप जोड़ें',
      'groups.compTitle': 'प्रतिस्पर्धा के लिए तैयार?',
      'groups.compBody': 'रेटिंग मिलने के बाद Racket Ratings आपको खुले टूर्नामेंट दिखाता है जिनमें आप भाग ले सकते हैं — और आपका ग्रुप अपना टूर्नामेंट भी बना सकता है।',
      'groups.compCta': 'टूर्नामेंट देखें',

      'news.kicker': '06 — 2026 सीज़न',
      'news.title': '<em>वर्ल्ड टूर</em> का हर पड़ाव।',
      'news.hint': '2026 HSBC BWF वर्ल्ड टूर के चार सबसे हालिया नतीजे। पूरे सीज़न के लिए “सभी दिखाएँ” चुनें। 7 अगस्त 2026 को अपडेट किया गया।',
      'news.filterAll': 'सभी', 'news.filterDone': 'समाप्त', 'news.filterUpcoming': 'आगामी',
      'news.showAll': 'सभी टूर्नामेंट दिखाएँ',
      'news.showAllN': 'सभी {n} टूर्नामेंट दिखाएँ',
      'news.showLess': 'कम दिखाएँ',
      'news.latest': 'नवीनतम', 'news.upcoming': 'आगामी',
      'news.tbdUpcoming': 'निर्धारित — नतीजे आने बाकी।',
      'news.tbdDone': 'समाप्त। चैंपियन BWF रिकॉर्ड के अनुसार।',
      'news.source': 'पूरा शेड्यूल और नतीजे BWF वर्ल्ड टूर, Wikipedia और समाचार एजेंसी रिपोर्ट (AFP/Xinhua) से लिए गए हैं। 7 अगस्त 2026 तक समाप्त इवेंट, जहाँ उपलब्ध हो, सत्यापित सिंगल्स और डबल्स चैंपियन दिखाते हैं; बाद के इवेंट तारीख़ और ग्रेड दर्शाते हैं। कोई तस्वीर इस्तेमाल नहीं।',

      'play.kicker': '07 — गेम ऑन',
      'play.title': 'एक <em>रैली</em> खेलें।',
      'play.hintDesktop': 'कंप्यूटर के ख़िलाफ़ एक क्लासिक स्टिक-बैडमिंटन मैच। ← → (या A/D) से <strong>चलें</strong>, ↑ (या W) से <strong>कूदें</strong>, Space या ↓ से <strong>स्विंग</strong> करें। ऊँचे शटल पर कूदकर उसे <strong>स्मैश</strong> करें; नीचे वालों को नेट के ऊपर उठाएँ। पहले 7 अंक तक पहुँचने वाला जीतता है।',
      'play.hintMobile': 'कंप्यूटर के ख़िलाफ़ एक क्लासिक स्टिक-बैडमिंटन मैच। चलने, कूदने और स्विंग के लिए नीचे दिए बटन इस्तेमाल करें। ऊँचे शटल पर कूदकर उसे <strong>स्मैश</strong> करें; नीचे वालों को नेट के ऊपर उठाएँ। पहले 7 अंक तक पहुँचने वाला जीतता है।',
      'play.you': 'आप', 'play.rally': 'रैली', 'play.cpu': 'कंप्यूटर',
      'play.start': 'गेम शुरू करें', 'play.again': 'फिर से खेलें',
      'play.move': 'चलें', 'play.jump': 'कूदें', 'play.swing': 'स्विंग',
      'play.msgStart': 'Start चुनें। शटल के नीचे जाएँ, फिर कूदकर स्विंग कर उसे वापस मारें।',
      'play.serveYou': 'आपकी सर्विस! ← → से चलें, ↑ / W से कूदें, Space / ↓ से स्विंग करें।',
      'play.serveCpu': 'प्रतिद्वंद्वी सर्व कर रहा है — शटल के नीचे जाकर स्विंग करें!',
      'play.shotServe': 'सर्व', 'play.shotSmash': 'स्मैश!', 'play.shotClear': 'क्लियर',
      'play.pointYou': 'आपको अंक', 'play.pointCpu': 'कंप्यूटर को अंक',
      'play.reasonNet': '{who} ने नेट पर मारा',
      'play.reasonYourSide': 'शटल आपकी ओर गिरा',
      'play.reasonCpuSide': 'शटल कंप्यूटर की ओर गिरा',
      'play.whoYou': 'आपने', 'play.whoCpu': 'कंप्यूटर ने',
      'play.win': 'गेम! आप {a}–{b} से जीते 🏆',
      'play.lose': 'कंप्यूटर {a}–{b} से जीता। फिर से खेलें!',

      'reflex.kicker': '08 — रिएक्शन टेस्ट',
      'reflex.title': 'आपके <em>रिफ़्लेक्स</em> कितने तेज़ हैं?',
      'reflex.hint': 'शटल के गिरने का इंतज़ार करें, फिर जितनी तेज़ी से हो सके टैप करें (या स्पेस दबाएं)। कोर्ट पर रिएक्शन टाइम मायने रखता है — प्रो 0.2 सेकंड से भी कम में प्रतिक्रिया देते हैं।',
      'reflex.start': 'शुरू करने के लिए टैप करें या स्पेस दबाएं', 'reflex.sub': 'अपनी रिएक्शन स्पीड जाँचें',
      'reflex.wait': 'रुकिए…', 'reflex.waitSub': 'जैसे ही शटल गिरे, टैप करें या स्पेस दबाएं',
      'reflex.tap': 'अभी टैप करें!', 'reflex.early': 'बहुत जल्दी!', 'reflex.earlySub': 'फिर से कोशिश करने के लिए टैप करें या स्पेस दबाएं',
      'reflex.last': 'पिछला', 'reflex.best': 'सर्वश्रेष्ठ', 'reflex.rank': 'रैंक',
      'reflex.rankF1': 'F1 ड्राइवर', 'reflex.rankPro': 'बैडमिंटन प्रो', 'reflex.rankNormal': 'सामान्य इंसान', 'reflex.rankSlow': 'सुस्त',

      'guess.kicker': '09 — फ़ोटो क्विज़',
      'guess.title': '<em>प्रो</em> पहचानें।',
      'guess.hint': 'दस तस्वीरें, हर एक के चार नाम। दुनिया के कितने बैडमिंटन सितारों को आप पहचान सकते हैं?',
      'guess.start': 'शुरू करें', 'guess.again': 'फिर से खेलें',
      'guess.count': 'फ़ोटो {n}/{total}', 'guess.score': 'स्कोर {s}', 'guess.done': 'आपका स्कोर',
      'guess.alt': 'इस बैडमिंटन खिलाड़ी को पहचानें',
      'guess.end9': 'कमाल! आप वाक़ई बैडमिंटन के जानकार हैं! 🏆',
      'guess.end6': 'बढ़िया! आप अपने सितारों को जानते हैं।',
      'guess.end3': 'बुरा नहीं — देखते रहिए!',
      'guess.end0': 'और बैडमिंटन देखने का समय आ गया! 🏸',

      'reviews.kicker': '10 — समीक्षाएँ',
      'reviews.title': '<em>खिलाड़ियों और अभिभावकों</em> का प्यार।',
      'reviews.hint': 'Élever में प्रशिक्षण के बारे में हमारा समुदाय क्या कहता है।',
      'reviews.ig': 'Instagram पर असली पल देखें',
      'reviews.disclaimer': 'ऊपर दिए उद्धरण नमूना प्लेसहोल्डर हैं — असली प्रशिक्षण के पल, नतीजे और अपडेट के लिए हमें Instagram पर फ़ॉलो करें।',

      'cta.title': '<em>ऊपर उठने</em> के लिए तैयार?',
      'cta.body': 'चाहे यह आपकी पहली स्ट्रोक हो या अगला ख़िताब, Élever Badminton में आपके लिए जगह है।',
      'cta.enquire': 'अभी पूछताछ करें', 'cta.email': 'ईमेल करें', 'cta.instagram': 'Instagram पर फ़ॉलो करें',

      'footer.tag': 'निर्माण करें। ऊपर उठें। और ऊँचे जाएँ।',
      'footer.instagram': 'Instagram',
      'footer.official': 'आधिकारिक साइट',
      'footer.note': 'कॉन्सेप्ट रीडिज़ाइन · Élever Badminton के लिए बनाया गया। फ़ोटोग्राफ़ी © Élever Badminton।'
    },

    ta: {
      'a11y.skip': 'முதன்மை உள்ளடக்கத்திற்குச் செல்',
      'intro.skip': 'அறிமுகத்தைத் தவிர்',

      'nav.about': 'எங்களைப் பற்றி', 'nav.quiz': 'வினா', 'nav.programs': 'திட்டங்கள்',
      'nav.team': 'பயிற்சியாளர்கள்', 'nav.hub': 'SG மையம்', 'nav.news': 'செய்திகள்',
      'nav.play': 'விளையாடு', 'nav.reviews': 'கருத்துகள்', 'nav.join': 'இணையுங்கள்',
      'nav.classes': 'வகுப்புகள்', 'nav.camps': 'முகாம்கள்', 'nav.events': 'நிகழ்வுகள்',
      'nav.book': 'வகுப்பை முன்பதிவு', 'nav.contact': 'தொடர்பு',

      'hero.eyebrow': 'சிங்கப்பூர் · பேட்மிண்டன் சிறப்பு',
      'hero.sub': 'உருவாக்குங்கள். உயருங்கள். மேலும் உயர்ந்த நிலைக்கு எடுத்துச் செல்லுங்கள். முதல் அடியை சாம்பியன்ஷிப் கனவுகளாக மாற்றும் உயர்தர பயிற்சி.',
      'hero.ctaPrograms': 'திட்டங்களைப் பாருங்கள்',
      'hero.ctaQuiz': 'உங்கள் இரட்டையைக் கண்டறியுங்கள்',
      'hero.hint': '↳ உங்கள் கர்சரை நகர்த்துங்கள் — ஷட்டில்கள் உங்களுக்கு எதிர்வினையாற்றும்',
      'hero.scroll': 'ஸ்க்ரோல்',
      'hero.stat1': 'நிபுணர் பயிற்சியாளர்கள்', 'hero.stat2': 'திட்டத் தூண்கள்', 'hero.stat3': '% ஆர்வம்',

      'about.kicker': '01 — Élever பற்றி',
      'about.title': 'ஒரு விளையாட்டை விட மேலானது.<br><em>சிறப்புக்கான ஒரு பாதை.</em>',
      'about.lead': '<strong>Élever</strong> <span class="about__def">(வினைச்சொல்)</span> — உருவாக்குதல் அல்லது உயர்த்துதல்; ஏதோ ஒன்றை மேலும் உயர்ந்த நிலைக்கு கொண்டு செல்லுதல்.',
      'about.p1': 'சிறப்பு என்பது ஒரு பயணம் — Élever Badminton-இல் அது படிப்படியான தூண்களின் மேல் கட்டமைக்கப்பட்ட நன்கு திட்டமிட்ட பாதையைப் பின்பற்றுகிறது. உங்கள் முதல் அடியிலிருந்து உயர்தர போட்டி வரை, ஒவ்வொரு வீரரும் தன்னம்பிக்கையை வளர்க்கவும் விளையாட்டில் தேர்ச்சி பெறவும் தேவையான நிபுணர் வழிகாட்டுதலையும் ஆதரவான சமூகத்தையும் எங்கள் பயிற்சியாளர்கள் வழங்குகிறார்கள்.',
      'about.p2': 'ஒவ்வொரு வீரரும், தங்கள் பயணத்தில் எங்கிருந்தாலும், உலகத் தரமான வழிகாட்டுதலுக்கு தகுதியானவர் என நாங்கள் நம்புகிறோம். அந்த நம்பிக்கையே கோர்ட்டிலும் வெளியேயும் நாங்கள் செய்யும் அனைத்தையும் இயக்குகிறது.',

      'quiz.kicker': '02 — ஊடாடும்',
      'quiz.title': 'எந்த ப்ரோ உங்கள் <em>பேட்மிண்டன் இரட்டை</em>?',
      'quiz.lead': 'நீங்கள் எப்படி விளையாடுகிறீர்கள், சிந்திக்கிறீர்கள் என்பது குறித்த 6 சிறு கேள்விகளுக்கு பதிலளியுங்கள்.<br>உலகின் எந்த பேட்மிண்டன் நட்சத்திரம் உங்கள் கோர்ட்-இரட்டை என்பதை — அவரது புகைப்படத்துடன் — வெளிப்படுத்துவோம். <strong>பார்க்காதீர்கள்</strong> — 27 சாத்தியமான பொருத்தங்கள், உங்களுடையது ஒரு அதிர்ச்சி.',
      'quiz.start': 'வினாவைத் தொடங்கு',
      'quiz.count': '🏸 {n} / {total}',
      'quiz.resultLead': 'உங்கள் பேட்மிண்டன் இரட்டை…',
      'quiz.again': 'மீண்டும் விளையாடு',
      'quiz.share': 'முடிவைப் பகிர்',
      'quiz.rrPrompt': 'இதுதான் உங்கள் ப்ரோ இரட்டை — ஆனால் உங்கள் <em>உண்மையான</em> நிலை என்ன? கீழே அறியுங்கள் 👇',
      'quiz.rrCta': 'Racket Ratings-இல் மதிப்பீடு பெறுங்கள் →',
      'quiz.credit': 'புகைப்படம்: Wikimedia Commons · {lic}',

      'programs.kicker': '03 — நாங்கள் செய்வது',
      'programs.title': 'உயர <em>நான்கு</em> வழிகள்.',
      'programs.campsTitle': 'கேம்ப்கள்',
      'programs.campsBody': 'எங்கள் விடுமுறை ஆய்வுக் கேம்ப்கள் ஒவ்வொரு பள்ளி விடுமுறையையும் பேட்மிண்டன் சாகசமாக மாற்றுகின்றன. குறைவான அல்லது அனுபவமில்லாத வீரர்களுக்கு விளையாட்டு அடிப்படையிலான கற்றல் — வலுவான அடித்தளத்தையும் உடல் வளர்ச்சியையும் உருவாக்கி, மேலும் விளையாட ஆவலை தக்கவைக்கிறது.',
      'programs.classesTitle': 'வகுப்புகள்',
      'programs.classesBody': 'நான்கு படிப்படியான தூண்களின் மேல் கட்டமைக்கப்பட்ட ஒரு திட்டமிட்ட பாதை. முதல் அடியிலிருந்து உயர்தர போட்டி வரை, எங்கள் வகுப்புகள் தன்னம்பிக்கையை வளர்க்கவும் விளையாட்டில் தேர்ச்சி பெறவும் நிபுணர் வழிகாட்டுதலையும் ஆதரவான சமூகத்தையும் வழங்குகின்றன.',
      'programs.clinicsTitle': 'கிளினிக்குகள்',
      'programs.clinicsBody': 'சுறுசுறுப்பான, சமூக இயக்கப் பயிற்சி — சிறப்பு, குறுகிய கால பட்டறைகள். ஒவ்வொரு வயதுப் பிரிவுக்கும் திறன் நிலைக்கும் ஏற்ற உற்சாகமான சூழலில் வீரர்கள் நுட்பம், கால்வேலை மற்றும் உத்தியில் ஆழமாக இறங்குகிறார்கள்.',
      'programs.carnivalsTitle': 'கார்னிவல்கள்',
      'programs.carnivalsBody': 'கிளினிக்குகள், வேடிக்கை விளையாட்டுகள் மற்றும் செயல்பாடுகளை இணைக்கும் சமூக அணுகல். விளையாட்டை உள்ளூர் சமூகங்களுக்குக் கொண்டு வருவதன் மூலம், பேட்மிண்டனை அனைவருக்கும் அணுகக்கூடியதாக்குகிறோம் — ஆரோக்கியம், இணைப்பு மற்றும் விளையாட்டின் மகிழ்ச்சியைக் கொண்டாடுகிறோம்.',

      'team.kicker': '04 — எங்கள் குழு',
      'team.title': '<em>பயிற்சியாளர்களை</em> சந்திக்கவும்.',
      'team.founders': 'இணை நிறுவனர்கள்',
      'team.team': 'எங்கள் குழு',
      'role.cofounderTech': 'இணை நிறுவனர் · தொழில்நுட்ப இயக்குநர்',
      'role.cofounder': 'இணை நிறுவனர்',
      'role.performance': 'செயல்திறன் மேலாளர் · S&C பயிற்சியாளர்',
      'role.senior': 'மூத்த பயிற்சியாளர்',
      'role.development': 'மேம்பாட்டுப் பயிற்சியாளர்',
      'role.assistant': 'உதவிப் பயிற்சியாளர்',
      'role.bwf1': 'BWF நிலை 1',

      'hub.kicker': '05 — சிங்கப்பூர் பேட்மிண்டன் மையம்',
      'hub.title': 'பேட்மிண்டன் <em>அனைத்தும்</em>, ஒரே இடத்தில்.',
      'hub.hint': 'சிங்கப்பூரில் விளையாடும் ஒவ்வொரு இடத்தையும் கண்டறிய ஒரு தளம் இல்லை — அதனால் நாங்களே உருவாக்கினோம். ஹால்களை உலாவுங்கள், கோர்ட் பதிவு செய்வதை அறியுங்கள், சேர்ந்து விளையாட ஆட்களைக் கண்டறியுங்கள். புதியவரா? முதலில் <a href="https://www.racketratings.net/badminton" target="_blank" rel="noopener">Racket Ratings</a>-இல் உங்கள் திறன் நிலையைப் பெறுங்கள். <strong>வெறும் அகாடமி அல்ல — சிங்கப்பூரில் பேட்மிண்டனின் இல்லம்.</strong>',
      'hub.tabHalls': 'எங்கே விளையாடுவது',
      'hub.tabBook': 'எப்படி பதிவு செய்வது',
      'hub.tabGroups': 'குழுக்கள் & மதிப்பீடுகள்',
      'hub.searchLabel': 'இடத்தைக் கண்டறியுங்கள்',
      'hub.searchPh': 'பெயர் அல்லது பகுதி மூலம் தேடுங்கள், எ.கா. Tampines',
      'hub.filterAll': 'அனைத்து இடங்கள்',
      'hub.filterElever': 'Élever வகுப்புகள்',
      'hub.filterPrivate': 'தனியார் ஹால்கள்',
      'hub.filterActivesg': 'ActiveSG (பொது)',
      'hub.filterClub': 'கன்ட்ரி கிளப்புகள்',
      'hub.count': '{n} இடங்கள்',
      'hub.countOne': '1 இடம்',
      'hub.empty': 'உங்கள் தேடலுக்கு எந்த இடமும் பொருந்தவில்லை. வேறு சொல் அல்லது வடிகட்டியை முயற்சிக்கவும்.',
      'hub.map': 'வரைபடம் பார்',
      'hub.book': 'பதிவு',
      'hub.bookActivesg': 'ActiveSG-இல் பதிவு',
      'hub.mapAria': '{name}-ஐ Google Maps-இல் திற (புதிய தாவலில் திறக்கும்)',
      'hub.bookAria': '{name} பதிவு செய் (புதிய தாவலில் திறக்கும்)',
      'hub.note': 'முகவரிகள் Google Maps மற்றும் அதிகாரப்பூர்வ SportSG வசதிகள் தரவுத்தொகுப்பிலிருந்து தொகுக்கப்பட்டவை. ActiveSG பொது ஹால்களை MyActiveSG ஆப்பிலும் பதிவு செய்யலாம். Community Club (CC) கோர்ட்கள் <a href="https://www.onepa.gov.sg/facilities/search?facility=BADMINTON%20COURTS" target="_blank" rel="noopener">OnePA</a>-இல் பதிவு செய்யப்படும். தவறு அல்லது விடுபட்ட ஹால் கண்டீர்களா? <a href="mailto:hello@eleverbadminton.com?subject=SG%20Badminton%20Hub%20—%20hall%20update">எங்களிடம் சொல்லுங்கள்</a>.',
      'tag.private': 'தனியார்', 'tag.activesg': 'ActiveSG', 'tag.club': 'கிளப்', 'tag.elever': 'Élever',

      'book.privateTitle': 'தனியார் ஹால்கள்',
      'book.privateBody': 'மணிநேர அடிப்படையில் வாடகைக்கு எடுக்கும் குளிரூட்டப்பட்ட கோர்ட்கள், பொதுவாக ஒவ்வொரு ஹாலின் சொந்த இணையதளம் அல்லது ஆப் வழியாக. வாக்கெடுப்பு இல்லாமல் உறுதியான நேரத்திற்கு சிறந்தது. விலைகள் மாறுபடும் — கோர்ட் ஒன்றுக்கு தோராயமாக <strong>S$20–40 மணிநேரம்</strong>.',
      'book.privateStep1': '<button class="hub__inline-link" data-goto="halls" type="button">எங்கே விளையாடுவது</button> தாவலில் ஒரு ஹாலைத் தேர்ந்தெடுங்கள்.',
      'book.privateStep2': 'அதன் பதிவு இணைப்பைத் திறந்து தேதி மற்றும் நேரத்தைத் தேர்வு செய்யுங்கள்.',
      'book.privateStep3': 'ஆன்லைனில் பணம் செலுத்தி உறுதிப்படுத்துங்கள் — முடிந்தது.',
      'book.activesgTitle': 'ActiveSG பொது ஹால்கள்',
      'book.activesgBody': 'விளையாட மிகவும் மலிவான வழி — தோராயமாக <strong>S$3.50–7.40 மணிநேரம்</strong> முதல். <a href="https://activesg.gov.sg/facility-bookings/activities/YLONatwvqJfikKOmB5N9U/venues" target="_blank" rel="noopener">activesg.gov.sg</a>-இல் அல்லது MyActiveSG ஆப்பில் பதிவு செய்யுங்கள்.',
      'book.activesgStep1': '<strong>Singpass</strong> மூலம் உள்நுழையவும், பின்னர் Book a Facility → Badminton தேர்ந்தெடுக்கவும்.',
      'book.activesgStep2': 'அஞ்சல் குறியீடு அல்லது இடத்தின் மூலம் தேடுங்கள். ஒவ்வொரு நேரமும் 1 மணி (ஒரு நாளைக்கு 2 வரை).',
      'book.activesgStep3': '<strong>உச்ச</strong> நேரங்கள் (வார நாட்களில் மாலை 6 மணிக்குப் பிறகு, வார இறுதி மற்றும் பொது விடுமுறை) தோராயமாக 14 நாட்களுக்கு முன் திறக்கும் <strong>வாக்கெடுப்பைப்</strong> பயன்படுத்துகின்றன. <strong>உச்சமல்லாத</strong> நேரம் முதலில் வருபவர் அடிப்படையில், தோராயமாக 13 நாட்களுக்கு முன் மதியம் 12 மணிக்கு வெளியிடப்படும்.',
      'book.ccTitle': 'Community Club (CC) கோர்ட்கள்',
      'book.ccBody': 'தீவு முழுவதும் People’s Association மூலம் நடத்தப்படுகின்றன. விலைகள் CC-க்கு ஏற்ப மாறுபடும், தோராயமாக <strong>S$5–7 மணிநேரம்</strong>. <a href="https://www.onepa.gov.sg/facilities/search?facility=BADMINTON%20COURTS" target="_blank" rel="noopener">OnePA</a>-இல் பதிவு செய்யுங்கள்.',
      'book.ccStep1': '<strong>Singpass</strong> மூலம் உள்நுழையவும், பின்னர் Facilities → Book a Facility தேர்ந்தெடுக்கவும்.',
      'book.ccStep2': 'Badminton Court-ஐத் தேர்ந்தெடுத்து, பின்னர் உங்கள் பகுதி, தேதி மற்றும் நேரம்.',
      'book.ccStep3': 'புதிய நேரங்கள் <strong>தினமும் இரவு 10 மணிக்கு</strong> திறக்கும், <strong>15 நாட்கள்</strong> வரை முன்னதாக.',

      'groups.featureEyebrow': 'எங்கள் சிறந்த தேர்வு · உங்கள் நிலையை அறியுங்கள்',
      'groups.featureTitle': 'Racket Ratings',
      'groups.featureBody': 'நீங்கள் உண்மையில் எவ்வளவு திறமையானவர் — அல்லது யாருடன் விளையாடுவது என்பது உறுதியில்லையா? <strong>Racket Ratings</strong> என்பது சிங்கப்பூரின் இலவச மதிப்பீடு, இது உங்களுக்கு உண்மையான திறன் நிலையை வழங்கி, அதற்கு ஏற்ற வீரர்கள், kaki மற்றும் விளையாட்டுகளுடன் பொருத்துகிறது. நீங்கள் எங்கே நிற்கிறீர்கள் என்பதை அறிய எளிதான வழி — ஒவ்வொரு வீரரும் இங்கிருந்தே தொடங்க பரிந்துரைக்கிறோம்.',
      'groups.featureCta': 'உங்கள் இலவச மதிப்பீட்டைப் பெறுங்கள் →',
      'groups.casualTitle': 'சாதாரண & சமூக விளையாட்டு',
      'groups.casualBody': 'பெரும்பாலான சமூக விளையாட்டுகள் சமூக தளங்களில் உருவாகின்றன. உங்கள் அருகில், உங்கள் நிலையில் ஒரு அமர்வைக் கண்டறிய இவற்றை முயற்சிக்கவும்:',
      'groups.casualLink1': '<a href="https://www.racketratings.net/badminton/clubs" target="_blank" rel="noopener">Racket Ratings Clubs</a> — மதிப்பிடப்பட்ட வீரர்கள் மற்றும் ஏணிப் போட்டிகள்',
      'groups.casualLink2': '<a href="https://www.meetup.com/find/?keywords=badminton&location=sg--Singapore" target="_blank" rel="noopener">Meetup — சிங்கப்பூர் பேட்மிண்டன்</a>',
      'groups.casualLink3': 'Facebook மற்றும் Telegram “kaki” குழுக்கள் (“badminton Singapore” தேடுங்கள்)',
      'groups.casualLink4': 'உங்கள் அருகிலுள்ள CC — பல ட்ராப்-இன் சமூக அமர்வுகளை நடத்துகின்றன',
      'groups.coachTitle': 'கட்டமைக்கப்பட்ட பயிற்சி விரும்புகிறீர்களா?',
      'groups.coachBody': 'நீங்கள் ஒரு பயிற்சியாளருடன் மேம்பட விரும்பினால், அதைத்தான் நாங்கள் செய்கிறோம். உங்கள் முதல் அடியிலிருந்து போட்டி வரை, Élever-இன் கேம்ப்கள், வகுப்புகள் மற்றும் கிளினிக்குகளில் உங்களுக்கு இடம் உண்டு.',
      'groups.coachCta': 'எங்கள் வகுப்புகளைப் பார்க்க',
      'rr.eyebrow': 'எங்கள் சிறந்த தேர்வு · உங்கள் நிலையை அறியுங்கள்',
      'rr.title': 'Racket Ratings',
      'rr.lead': 'சிங்கப்பூரின் ஒவ்வொரு பூப்பந்து வீரருக்கும் உண்மையான, ஒப்பிடக்கூடிய திறன் நிலையை வழங்கும் இலவச தளம் — அதன் அடிப்படையில் உங்கள் தரத்திற்கேற்ற கிளப்புகள், ஏணிப் போட்டிகள் மற்றும் போட்டிகளுடன் உங்களை இணைக்கிறது.',
      'rr.ratingLabel': '⚡ Rating',
      'rr.ratingDesc': 'உங்கள் ஆற்றல் எவ்வளவு',
      'rr.rankingLabel': '🏅 Ranking',
      'rr.rankingDesc': 'நீங்கள் வென்றவை',
      'rr.formatsLabel': 'வடிவங்கள்',
      'rr.formats': 'ஒற்றையர் · இரட்டையர் · 3v3',
      'rr.cta': 'இலவச மதிப்பீட்டைப் பெறுங்கள் →',
      'rr.note': 'இலவசம், ஆங்கிலம் மற்றும் சீன மொழிகளில் கிடைக்கிறது; மேசைப் பந்து, டென்னிஸ், பிக்கிள்பால், ஸ்க்வாஷ் ஆகியவற்றையும் உள்ளடக்கியது. Élever-க்கும் Racket Ratings-க்கும் தொடர்பு இல்லை — உள்ளூர் சூழலில் மிகவும் பயனுள்ள கருவி என்பதால் பரிந்துரைக்கிறோம்.',
      'groups.dirEyebrow': 'பொழுதுபோக்கு விளையாட்டு',
      'groups.dirTitle': 'சேர்ந்து விளையாட ஒரு குழுவைக் கண்டறியுங்கள்',
      'groups.dirLead': 'வழக்கமான ஆட்டத்திற்கு விரைவான வழி மேலே உள்ள Racket Ratings Clubs — குழுக்களே அதைப் புதுப்பித்து வைக்கின்றன. கீழே உள்ளவை எங்களிடம் கேட்டுக்கொண்டு, புதிய வீரர்களை வரவேற்கும் உள்ளூர் குழுக்கள்.',
      'groups.addTitle': 'புதிய வீரர்களை வரவேற்கும் குழு நடத்துகிறீர்களா?',
      'groups.addBody': 'நாள், நேரம், இடம், நிலை ஆகியவற்றைச் சொல்லுங்கள் — இலவசமாக இங்கே பட்டியலிடுவோம்.',
      'groups.addCta': 'உங்கள் குழுவைச் சேர்க்க',
      'groups.compTitle': 'போட்டியிடத் தயாரா?',
      'groups.compBody': 'மதிப்பீடு கிடைத்ததும், நீங்கள் பங்கேறக்கூடிய திறந்த போட்டிகளை Racket Ratings பட்டியலிடும் — உங்கள் குழுவும் சொந்தமாக ஒன்றை உருவாக்கலாம்.',
      'groups.compCta': 'போட்டிகளைப் பார்க்க',

      'news.kicker': '06 — 2026 சீசன்',
      'news.title': '<em>உலகச் சுற்றுப்</em> பயணத்தின் ஒவ்வொரு நிறுத்தமும்.',
      'news.hint': '2026 HSBC BWF உலகச் சுற்றுப் பயணத்தின் நான்கு சமீபத்திய முடிவுகள். முழு சீசனுக்கும் “அனைத்தையும் காட்டு” தேர்வு செய்யுங்கள். 7 ஆகஸ்ட் 2026 அன்று புதுப்பிக்கப்பட்டது.',
      'news.filterAll': 'அனைத்தும்', 'news.filterDone': 'முடிந்தது', 'news.filterUpcoming': 'வரவிருக்கும்',
      'news.showAll': 'அனைத்து போட்டிகளையும் காட்டு',
      'news.showAllN': 'அனைத்து {n} போட்டிகளையும் காட்டு',
      'news.showLess': 'குறைவாகக் காட்டு',
      'news.latest': 'சமீபத்தியது', 'news.upcoming': 'வரவிருக்கும்',
      'news.tbdUpcoming': 'திட்டமிடப்பட்டது — முடிவுகள் வர இருக்கின்றன.',
      'news.tbdDone': 'முடிந்தது. சாம்பியன்கள் BWF பதிவுகளின்படி.',
      'news.source': 'முழு அட்டவணையும் முடிவுகளும் BWF உலகச் சுற்றுப் பயணம், Wikipedia மற்றும் செய்தி நிறுவன அறிக்கைகள் (AFP/Xinhua) மூலம் பெறப்பட்டவை. 7 ஆகஸ்ட் 2026 வரை முடிந்த நிகழ்வுகள், கிடைக்கும் இடத்தில், சரிபார்க்கப்பட்ட ஒற்றையர் மற்றும் இரட்டையர் சாம்பியன்களைக் காட்டுகின்றன; பிற்பட்ட நிகழ்வுகள் தேதி மற்றும் தரத்தைப் பட்டியலிடுகின்றன. படங்கள் எதுவும் பயன்படுத்தப்படவில்லை.',

      'play.kicker': '07 — விளையாட்டு தொடங்கு',
      'play.title': 'ஒரு <em>ரேலி</em> விளையாடு.',
      'play.hintDesktop': 'கணினிக்கு எதிரான ஒரு கிளாசிக் ஸ்டிக்-பேட்மிண்டன் போட்டி. ← → (அல்லது A/D) மூலம் <strong>நகர்</strong>, ↑ (அல்லது W) மூலம் <strong>குதி</strong>, Space அல்லது ↓ மூலம் <strong>அடி</strong>. உயரமான ஷட்டிலுக்குள் குதித்து அதை <strong>ஸ்மாஷ்</strong> செய்யுங்கள்; தாழ்வானவற்றை நெட்டுக்கு மேல் தூக்குங்கள். முதலில் 7 புள்ளிகளை அடைபவர் வெற்றி.',
      'play.hintMobile': 'கணினிக்கு எதிரான ஒரு கிளாசிக் ஸ்டிக்-பேட்மிண்டன் போட்டி. நகர, குதிக்க, அடிக்க கீழேயுள்ள திரை பொத்தான்களைப் பயன்படுத்துங்கள். உயரமான ஷட்டிலுக்குள் குதித்து அதை <strong>ஸ்மாஷ்</strong> செய்யுங்கள்; தாழ்வானவற்றை நெட்டுக்கு மேல் தூக்குங்கள். முதலில் 7 புள்ளிகளை அடைபவர் வெற்றி.',
      'play.you': 'நீங்கள்', 'play.rally': 'ரேலி', 'play.cpu': 'கணினி',
      'play.start': 'விளையாட்டைத் தொடங்கு', 'play.again': 'மீண்டும் விளையாடு',
      'play.move': 'நகர்', 'play.jump': 'குதி', 'play.swing': 'அடி',
      'play.msgStart': 'Start-ஐத் தேர்வு செய்யுங்கள். ஷட்டிலுக்குக் கீழே நகர்ந்து, பின்னர் குதித்து அடித்து அதைத் திருப்பியடியுங்கள்.',
      'play.serveYou': 'உங்கள் சர்வீஸ்! ← → மூலம் நகர், ↑ / W மூலம் குதி, Space / ↓ மூலம் அடி.',
      'play.serveCpu': 'எதிராளி சர்வ் செய்கிறார் — ஷட்டிலுக்குக் கீழே சென்று அடியுங்கள்!',
      'play.shotServe': 'சர்வ்', 'play.shotSmash': 'ஸ்மாஷ்!', 'play.shotClear': 'கிளியர்',
      'play.pointYou': 'உங்களுக்கு புள்ளி', 'play.pointCpu': 'கணினிக்கு புள்ளி',
      'play.reasonNet': '{who} நெட்டில் அடித்தது',
      'play.reasonYourSide': 'ஷட்டில் உங்கள் பக்கம் விழுந்தது',
      'play.reasonCpuSide': 'ஷட்டில் கணினியின் பக்கம் விழுந்தது',
      'play.whoYou': 'நீங்கள்', 'play.whoCpu': 'கணினி',
      'play.win': 'கேம்! நீங்கள் {a}–{b} வெற்றி 🏆',
      'play.lose': 'கணினி {a}–{b} வெற்றி. மீண்டும் விளையாடு!',

      'reflex.kicker': '08 — எதிர்வினை சோதனை',
      'reflex.title': 'உங்கள் <em>எதிர்வினை</em> எவ்வளவு வேகம்?',
      'reflex.hint': 'ஷட்டில் விழுவதற்குக் காத்திருங்கள், பின்னர் முடிந்தவரை வேகமாகத் தட்டுங்கள். கோர்ட்டில் எதிர்வினை நேரம் முக்கியம் — ப்ரோக்கள் 0.2 வினாடிக்கும் குறைவாக எதிர்வினையாற்றுகிறார்கள்.',
      'reflex.start': 'தொடங்க தட்டுங்கள் அல்லது ஸ்பேஸ் அழுத்தவும்', 'reflex.sub': 'உங்கள் எதிர்வினை வேகத்தைச் சோதியுங்கள்',
      'reflex.wait': 'காத்திருங்கள்…', 'reflex.waitSub': 'ஷட்டில் விழும் தருணத்தில் தட்டுங்கள் அல்லது ஸ்பேஸ் அழுத்தவும்',
      'reflex.tap': 'இப்போது தட்டு!', 'reflex.early': 'மிக விரைவு!', 'reflex.earlySub': 'மீண்டும் முயற்சிக்க தட்டுங்கள் அல்லது ஸ்பேஸ் அழுத்தவும்',
      'reflex.last': 'கடைசி', 'reflex.best': 'சிறந்தது', 'reflex.rank': 'தரவரிசை',
      'reflex.rankF1': 'F1 டிரைவர்', 'reflex.rankPro': 'பேட்மிண்டன் ப்ரோ', 'reflex.rankNormal': 'சாதாரண மனிதன்', 'reflex.rankSlow': 'மந்தமான',

      'guess.kicker': '09 — புகைப்பட வினா',
      'guess.title': '<em>ப்ரோ</em>வை யூகியுங்கள்.',
      'guess.hint': 'பத்து புகைப்படங்கள், ஒவ்வொன்றுக்கும் நான்கு பெயர்கள். உலகின் எத்தனை பேட்மிண்டன் நட்சத்திரங்களை உங்களால் பெயரிட முடியும்?',
      'guess.start': 'தொடங்கு', 'guess.again': 'மீண்டும் விளையாடு',
      'guess.count': 'படம் {n}/{total}', 'guess.score': 'மதிப்பெண் {s}', 'guess.done': 'உங்கள் மதிப்பெண்',
      'guess.alt': 'இந்த பேட்மிண்டன் வீரரை யூகியுங்கள்',
      'guess.end9': 'அபாரம் — நீங்கள் உண்மையிலேயே பேட்மிண்டன் நிபுணர்! 🏆',
      'guess.end6': 'நன்று! உங்கள் நட்சத்திரங்களை அறிவீர்கள்.',
      'guess.end3': 'மோசமில்லை — தொடர்ந்து பாருங்கள்!',
      'guess.end0': 'இன்னும் அதிக பேட்மிண்டன் பார்க்க வேண்டிய நேரம்! 🏸',

      'reviews.kicker': '10 — கருத்துகள்',
      'reviews.title': '<em>வீரர்கள் & பெற்றோர்</em> விரும்பும்.',
      'reviews.hint': 'Élever-இல் பயிற்சி பற்றி எங்கள் சமூகம் என்ன சொல்கிறது.',
      'reviews.ig': 'Instagram-இல் உண்மையான தருணங்களைப் பாருங்கள்',
      'reviews.disclaimer': 'மேலே உள்ள மேற்கோள்கள் மாதிரி இடம்பிடிப்புகள் — உண்மையான பயிற்சி தருணங்கள், முடிவுகள் மற்றும் புதுப்பிப்புகளுக்கு எங்களை Instagram-இல் பின்தொடருங்கள்.',

      'cta.title': '<em>உயர</em> தயாரா?',
      'cta.body': 'இது உங்கள் முதல் அடியாக இருந்தாலும் அல்லது அடுத்த பட்டமாக இருந்தாலும், Élever Badminton-இல் உங்களுக்கு ஒரு இடம் உண்டு.',
      'cta.enquire': 'இப்போது விசாரியுங்கள்', 'cta.email': 'மின்னஞ்சல் அனுப்பு', 'cta.instagram': 'Instagram-இல் பின்தொடர்',

      'footer.tag': 'உருவாக்கு. உயர். மேலும் உயர.',
      'footer.instagram': 'Instagram',
      'footer.official': 'அதிகாரப்பூர்வ தளம்',
      'footer.note': 'கான்செப்ட் மறுவடிவமைப்பு · Élever Badminton-க்காக உருவாக்கப்பட்டது. புகைப்படம் © Élever Badminton.'
    },

    ms: {
      'a11y.skip': 'Langkau ke kandungan utama',
      'intro.skip': 'Langkau intro',

      'nav.about': 'Tentang', 'nav.quiz': 'Kuiz', 'nav.programs': 'Program',
      'nav.team': 'Jurulatih', 'nav.hub': 'Hab SG', 'nav.news': 'Berita',
      'nav.play': 'Main', 'nav.reviews': 'Ulasan', 'nav.join': 'Sertai kami',
      'nav.classes': 'Kelas', 'nav.camps': 'Kem', 'nav.events': 'Acara',
      'nav.book': 'Tempah kelas', 'nav.contact': 'Hubungi',

      'hero.eyebrow': 'Singapura · Kecemerlangan Badminton',
      'hero.sub': 'Membina. Meningkat. Membawa sesuatu ke tahap yang lebih tinggi. Kejurulatihan elit yang mengubah ayunan pertama menjadi impian kejuaraan.',
      'hero.ctaPrograms': 'Terokai program',
      'hero.ctaQuiz': 'Cari kembar anda',
      'hero.hint': '↳ Gerakkan kursor anda — bulu tangkis bertindak balas kepada anda',
      'hero.scroll': 'Skrol',
      'hero.stat1': 'Jurulatih pakar', 'hero.stat2': 'Tunjang program', 'hero.stat3': '% Semangat',

      'about.kicker': '01 — Tentang Élever',
      'about.title': 'Lebih daripada sukan.<br><em>Laluan ke arah kegemilangan.</em>',
      'about.lead': '<strong>Élever</strong> <span class="about__def">(kata kerja)</span> — membina atau meningkatkan; membawa sesuatu ke kedudukan yang lebih tinggi.',
      'about.p1': 'Kecemerlangan ialah satu perjalanan — dan di Élever Badminton ia mengikuti laluan tersusun rapi yang dibina atas tunjang berperingkat. Dari ayunan pertama anda hingga ke pertandingan elit, jurulatih kami memberikan bimbingan pakar dan komuniti menyokong yang diperlukan setiap atlet untuk membina keyakinan dan menguasai permainan.',
      'about.p2': 'Kami percaya setiap pemain layak mendapat bimbingan bertaraf dunia, di mana sahaja mereka dalam perjalanan mereka. Kepercayaan itu mendorong segala yang kami lakukan — di dalam dan di luar gelanggang.',

      'quiz.kicker': '02 — Interaktif',
      'quiz.title': 'Pro mana yang jadi <em>kembar badminton</em> anda?',
      'quiz.lead': 'Jawab 6 soalan ringkas tentang cara anda bermain dan berfikir.<br>Kami akan dedahkan bintang badminton dunia yang mana menjadi kembar anda di gelanggang — dengan gambar mereka. <strong>Jangan mengintai</strong> — ada 27 padanan yang mungkin, dan milik anda satu kejutan.',
      'quiz.start': 'Mula kuiz',
      'quiz.count': '🏸 {n} / {total}',
      'quiz.resultLead': 'Kembar badminton anda ialah…',
      'quiz.again': 'Main lagi',
      'quiz.share': 'Kongsi keputusan',
      'quiz.rrPrompt': 'Itulah kembar pro anda — tapi apa tahap <em>sebenar</em> anda? Ketahui di bawah 👇',
      'quiz.rrCta': 'Dapatkan penilaian di Racket Ratings →',
      'quiz.credit': 'Gambar: Wikimedia Commons · {lic}',

      'programs.kicker': '03 — Apa Kami Buat',
      'programs.title': 'Empat cara untuk <em>meningkat</em>.',
      'programs.campsTitle': 'Kem',
      'programs.campsBody': 'Kem penerokaan cuti kami menjadikan setiap cuti sekolah satu pengembaraan badminton. Pembelajaran berasaskan permainan untuk pemain yang kurang atau tiada pengalaman — membina asas kukuh dan perkembangan fizikal sambil mengekalkan keghairahan untuk bermain lagi.',
      'programs.classesTitle': 'Kelas',
      'programs.classesBody': 'Laluan tersusun yang dibina atas empat tunjang berperingkat. Dari ayunan pertama anda hingga ke pertandingan elit, kelas kami memberikan bimbingan pakar dan komuniti menyokong untuk membina keyakinan dan menguasai permainan.',
      'programs.clinicsTitle': 'Klinik',
      'programs.clinicsBody': 'Latihan dinamik yang dipacu komuniti — bengkel khusus jangka pendek. Pemain mendalami teknik, kerja kaki dan strategi dalam persekitaran bertenaga tinggi yang disesuaikan untuk kumpulan umur dan setiap tahap kemahiran.',
      'programs.carnivalsTitle': 'Karnival',
      'programs.carnivalsBody': 'Jangkauan komuniti yang menggabungkan klinik, permainan menyeronokkan dan aktiviti. Dengan membawa sukan ini ke komuniti setempat, kami menjadikan badminton mudah diakses oleh semua — meraikan kesihatan, hubungan dan keseronokan bermain.',

      'team.kicker': '04 — Warga Kami',
      'team.title': 'Temui <em>jurulatih</em>.',
      'team.founders': 'Pengasas Bersama',
      'team.team': 'Pasukan Kami',
      'role.cofounderTech': 'Pengasas Bersama · Pengarah Teknikal',
      'role.cofounder': 'Pengasas Bersama',
      'role.performance': 'Pengurus Prestasi · Jurulatih S&C',
      'role.senior': 'Jurulatih Kanan',
      'role.development': 'Jurulatih Pembangunan',
      'role.assistant': 'Jurulatih Pembantu',
      'role.bwf1': 'BWF Tahap 1',

      'hub.kicker': '05 — Hab Badminton Singapura',
      'hub.title': 'Segala <em>badminton</em>, di satu tempat.',
      'hub.hint': 'Tiada tempat di Singapura untuk mencari setiap lokasi bermain — jadi kami membinanya. Layari dewan, pelajari cara menempah gelanggang, dan cari rakan bermain. Baru dalam bidang ini? Dapatkan tahap kemahiran anda di <a href="https://www.racketratings.net/badminton" target="_blank" rel="noopener">Racket Ratings</a> dahulu. <strong>Bukan sekadar akademi — rumah badminton di Singapura.</strong>',
      'hub.tabHalls': 'Tempat bermain',
      'hub.tabBook': 'Cara menempah',
      'hub.tabGroups': 'Kumpulan & penilaian',
      'hub.searchLabel': 'Cari lokasi',
      'hub.searchPh': 'Cari mengikut nama atau kawasan, cth. Tampines',
      'hub.filterAll': 'Semua lokasi',
      'hub.filterElever': 'Kelas Élever',
      'hub.filterPrivate': 'Dewan persendirian',
      'hub.filterActivesg': 'ActiveSG (awam)',
      'hub.filterClub': 'Kelab desa',
      'hub.count': '{n} lokasi',
      'hub.countOne': '1 lokasi',
      'hub.empty': 'Tiada lokasi sepadan dengan carian anda. Cuba perkataan atau penapis lain.',
      'hub.map': 'Lihat peta',
      'hub.book': 'Tempah',
      'hub.bookActivesg': 'Tempah di ActiveSG',
      'hub.mapAria': 'Buka {name} dalam Google Maps (buka dalam tab baharu)',
      'hub.bookAria': 'Tempah {name} (buka dalam tab baharu)',
      'hub.note': 'Alamat disusun daripada Google Maps dan set data kemudahan rasmi SportSG. Dewan awam ActiveSG juga boleh ditempah dalam aplikasi MyActiveSG. Gelanggang Kelab Komuniti (CC) ditempah di <a href="https://www.onepa.gov.sg/facilities/search?facility=BADMINTON%20COURTS" target="_blank" rel="noopener">OnePA</a>. Nampak kesilapan atau dewan yang tertinggal? <a href="mailto:hello@eleverbadminton.com?subject=SG%20Badminton%20Hub%20—%20hall%20update">Beritahu kami</a>.',
      'tag.private': 'Persendirian', 'tag.activesg': 'ActiveSG', 'tag.club': 'Kelab', 'tag.elever': 'Élever',

      'book.privateTitle': 'Dewan persendirian',
      'book.privateBody': 'Gelanggang berhawa dingin yang anda sewa mengikut jam, biasanya melalui laman web atau aplikasi setiap dewan. Terbaik untuk slot terjamin tanpa undian. Harga berbeza — kira-kira <strong>S$20–40 sejam</strong> setiap gelanggang.',
      'book.privateStep1': 'Pilih dewan pada tab <button class="hub__inline-link" data-goto="halls" type="button">Tempat bermain</button>.',
      'book.privateStep2': 'Buka pautan tempahannya dan pilih tarikh dan masa.',
      'book.privateStep3': 'Bayar dalam talian untuk mengesahkan — selesai.',
      'book.activesgTitle': 'Dewan awam ActiveSG',
      'book.activesgBody': 'Cara paling berpatutan untuk bermain — dari sekitar <strong>S$3.50–7.40 sejam</strong>. Tempah di <a href="https://activesg.gov.sg/facility-bookings/activities/YLONatwvqJfikKOmB5N9U/venues" target="_blank" rel="noopener">activesg.gov.sg</a> atau dalam aplikasi MyActiveSG.',
      'book.activesgStep1': 'Log masuk dengan <strong>Singpass</strong>, kemudian pilih Book a Facility → Badminton.',
      'book.activesgStep2': 'Cari mengikut poskod atau lokasi. Setiap slot 1 jam (sehingga 2 sehari).',
      'book.activesgStep3': 'Waktu <strong>puncak</strong> (hari bekerja selepas 6 petang, hujung minggu dan cuti umum) menggunakan <strong>undian</strong> yang dibuka kira-kira 14 hari lebih awal. <strong>Luar puncak</strong> ialah siapa cepat dia dapat, dikeluarkan kira-kira 13 hari lebih awal pada 12 tengah hari.',
      'book.ccTitle': 'Gelanggang Kelab Komuniti (CC)',
      'book.ccBody': 'Dikendalikan oleh People’s Association di seluruh pulau. Harga berbeza mengikut CC, kira-kira <strong>S$5–7 sejam</strong>. Tempah di <a href="https://www.onepa.gov.sg/facilities/search?facility=BADMINTON%20COURTS" target="_blank" rel="noopener">OnePA</a>.',
      'book.ccStep1': 'Log masuk dengan <strong>Singpass</strong>, kemudian pilih Facilities → Book a Facility.',
      'book.ccStep2': 'Pilih Badminton Court, kemudian wilayah, tarikh dan masa anda.',
      'book.ccStep3': 'Slot baharu dibuka <strong>setiap hari jam 10 malam</strong>, sehingga <strong>15 hari</strong> lebih awal.',

      'groups.featureEyebrow': 'Pilihan utama kami · Kenali tahap anda',
      'groups.featureTitle': 'Racket Ratings',
      'groups.featureBody': 'Tak pasti sejauh mana kemahiran anda — atau dengan siapa hendak bermain? <strong>Racket Ratings</strong> ialah penilaian percuma Singapura yang memberikan anda tahap kemahiran sebenar dan memadankan anda dengan pemain, kaki dan perlawanan pada tahap itu. Cara paling mudah untuk melihat kedudukan anda — kami mengesyorkan setiap pemain bermula di sini.',
      'groups.featureCta': 'Dapatkan penilaian percuma anda →',
      'groups.casualTitle': 'Permainan santai & sosial',
      'groups.casualBody': 'Kebanyakan perlawanan sosial terbentuk di platform komuniti. Cuba yang berikut untuk mencari sesi berdekatan dan pada tahap anda:',
      'groups.casualLink1': '<a href="https://www.racketratings.net/badminton/clubs" target="_blank" rel="noopener">Racket Ratings Clubs</a> — pemain dan tangga yang dinilai',
      'groups.casualLink2': '<a href="https://www.meetup.com/find/?keywords=badminton&location=sg--Singapore" target="_blank" rel="noopener">Meetup — badminton Singapura</a>',
      'groups.casualLink3': 'Kumpulan “kaki” di Facebook dan Telegram (cari “badminton Singapore”)',
      'groups.casualLink4': 'CC kejiranan anda — banyak menganjurkan sesi sosial masuk terus',
      'groups.coachTitle': 'Lebih suka kejurulatihan berstruktur?',
      'groups.coachBody': 'Jika anda lebih suka menambah baik dengan jurulatih, itulah yang kami lakukan. Dari ayunan pertama hingga pertandingan, kem, kelas dan klinik Élever ada tempat untuk anda.',
      'groups.coachCta': 'Lihat kelas kami',
      'rr.eyebrow': 'Pilihan utama kami · Kenali tahap anda',
      'rr.title': 'Racket Ratings',
      'rr.lead': 'Platform percuma yang memberi setiap pemain badminton di Singapura tahap kemahiran yang nyata dan boleh dibandingkan — kemudian memadankan anda dengan kelab, tangga dan kejohanan pada tahap anda. Jika anda mahu mencari orang untuk bermain, inilah perkara paling berguna di halaman ini.',
      'rr.ratingLabel': '⚡ Rating',
      'rr.ratingDesc': 'Sekuat mana anda',
      'rr.rankingLabel': '🏅 Ranking',
      'rr.rankingDesc': 'Apa yang anda menangi',
      'rr.formatsLabel': 'Format',
      'rr.formats': 'Perseorangan · Beregu · 3v3',
      'rr.cta': 'Dapatkan rating percuma anda →',
      'rr.note': 'Percuma, tersedia dalam bahasa Inggeris dan Cina, dan turut merangkumi ping pong, tenis, pickleball serta skuasy. Élever tidak bergabung dengan Racket Ratings — kami mencadangkannya kerana ia alat paling berguna dalam kalangan pemain tempatan.',
      'groups.dirEyebrow': 'Permainan santai',
      'groups.dirTitle': 'Cari kumpulan untuk bermain',
      'groups.dirLead': 'Jalan terpantas untuk permainan tetap ialah Racket Ratings Clubs di atas — dikemas kini oleh kumpulan itu sendiri. Di bawah ialah kumpulan tempatan yang meminta kami menyenaraikan mereka dan mengalu-alukan pemain baharu.',
      'groups.addTitle': 'Mengendalikan kumpulan yang mengalu-alukan pemain baharu?',
      'groups.addBody': 'Beritahu kami hari, masa, tempat dan tahap — kami akan menyenaraikannya di sini secara percuma, sama ada anda berlatih dengan Élever atau tidak.',
      'groups.addCta': 'Tambah kumpulan anda',
      'groups.compTitle': 'Bersedia untuk bertanding?',
      'groups.compBody': 'Setelah anda mempunyai rating, Racket Ratings menyenaraikan kejohanan terbuka yang boleh anda sertai — dan kumpulan anda boleh mencipta kejohanan sendiri. Cara mudah masuk ke permainan kompetitif.',
      'groups.compCta': 'Lihat kejohanan',

      'news.kicker': '06 — Musim 2026',
      'news.title': 'Setiap perhentian dalam <em>jelajah dunia</em>.',
      'news.hint': 'Empat keputusan terkini daripada BWF World Tour HSBC 2026. Pilih “Tunjuk semua” untuk keseluruhan musim. Dikemas kini 7 Ogos 2026.',
      'news.filterAll': 'Semua', 'news.filterDone': 'Selesai', 'news.filterUpcoming': 'Akan datang',
      'news.showAll': 'Tunjuk semua kejohanan',
      'news.showAllN': 'Tunjuk semua {n} kejohanan',
      'news.showLess': 'Tunjuk kurang',
      'news.latest': 'Terkini', 'news.upcoming': 'Akan datang',
      'news.tbdUpcoming': 'Dijadualkan — keputusan menyusul.',
      'news.tbdDone': 'Selesai. Juara mengikut rekod BWF.',
      'news.source': 'Jadual penuh dan keputusan diperoleh daripada BWF World Tour, Wikipedia dan laporan agensi berita (AFP/Xinhua). Acara yang selesai sehingga 7 Ogos 2026 menunjukkan juara perseorangan dan beregu yang disahkan jika ada; acara kemudian menyenaraikan tarikh dan gred. Tiada imej digunakan.',

      'play.kicker': '07 — Mula Main',
      'play.title': 'Main satu <em>rali</em>.',
      'play.hintDesktop': 'Perlawanan stik-badminton klasik menentang komputer. <strong>Gerak</strong> dengan ← → (atau A/D), <strong>lompat</strong> dengan ↑ (atau W), <strong>ayun</strong> dengan Space atau ↓. Lompat ke bulu tangkis tinggi untuk <strong>smash</strong> ke bawah; angkat yang rendah melepasi jaring. Pertama mencapai 7 mata menang.',
      'play.hintMobile': 'Perlawanan stik-badminton klasik menentang komputer. Guna butang pada skrin di bawah untuk gerak, lompat dan ayun. Lompat ke bulu tangkis tinggi untuk <strong>smash</strong> ke bawah; angkat yang rendah melepasi jaring. Pertama mencapai 7 mata menang.',
      'play.you': 'Anda', 'play.rally': 'Rali', 'play.cpu': 'Komputer',
      'play.start': 'Mula permainan', 'play.again': 'Main lagi',
      'play.move': 'Gerak', 'play.jump': 'Lompat', 'play.swing': 'Ayun',
      'play.msgStart': 'Pilih Start. Bergerak di bawah bulu tangkis, kemudian lompat dan ayun untuk memukulnya semula.',
      'play.serveYou': 'Servis anda! Gerak dengan ← →, lompat dengan ↑ / W, ayun dengan Space / ↓.',
      'play.serveCpu': 'Lawan sedang servis — pergi ke bawah bulu tangkis dan ayun!',
      'play.shotServe': 'Servis', 'play.shotSmash': 'SMASH!', 'play.shotClear': 'Clear',
      'play.pointYou': 'Mata untuk anda', 'play.pointCpu': 'Mata untuk komputer',
      'play.reasonNet': '{who} kena jaring',
      'play.reasonYourSide': 'bulu tangkis jatuh di pihak anda',
      'play.reasonCpuSide': 'bulu tangkis jatuh di pihak komputer',
      'play.whoYou': 'anda', 'play.whoCpu': 'komputer',
      'play.win': 'Permainan! Anda menang {a}–{b} 🏆',
      'play.lose': 'Komputer menang {a}–{b}. Main lagi!',

      'reflex.kicker': '08 — Ujian Reaksi',
      'reflex.title': 'Berapa pantas <em>refleks</em> anda?',
      'reflex.hint': 'Tunggu bulu tangkis jatuh, kemudian ketik (atau tekan Space) sepantas mungkin. Masa tindak balas penting di gelanggang — pro bertindak balas dalam kurang 0.2 saat.',
      'reflex.start': 'Ketik atau tekan Space untuk mula', 'reflex.sub': 'Uji kelajuan tindak balas anda',
      'reflex.wait': 'Tunggu…', 'reflex.waitSub': 'Ketik atau tekan Space sebaik bulu tangkis jatuh',
      'reflex.tap': 'KETIK SEKARANG!', 'reflex.early': 'Terlalu awal!', 'reflex.earlySub': 'Ketik atau tekan Space untuk cuba lagi',
      'reflex.last': 'Terakhir', 'reflex.best': 'Terbaik', 'reflex.rank': 'Pangkat',
      'reflex.rankF1': 'Pemandu F1', 'reflex.rankPro': 'Pemain Pro', 'reflex.rankNormal': 'Manusia Biasa', 'reflex.rankSlow': 'Lembap',

      'guess.kicker': '09 — Kuiz Foto',
      'guess.title': 'Teka <em>pro</em>.',
      'guess.hint': 'Sepuluh foto, empat nama setiap satu. Berapa ramai bintang badminton dunia yang anda boleh namakan?',
      'guess.start': 'Mula', 'guess.again': 'Main lagi',
      'guess.count': 'Foto {n}/{total}', 'guess.score': 'Skor {s}', 'guess.done': 'Skor anda',
      'guess.alt': 'Teka pemain badminton ini',
      'guess.end9': 'Hebat — anda betul-betul kenal badminton! 🏆',
      'guess.end6': 'Bagus! Anda kenal bintang-bintang anda.',
      'guess.end3': 'Tak teruk — teruskan menonton!',
      'guess.end0': 'Masa untuk tonton lebih banyak badminton! 🏸',

      'reviews.kicker': '10 — Ulasan',
      'reviews.title': 'Disukai <em>pemain & ibu bapa</em>.',
      'reviews.hint': 'Apa kata komuniti kami tentang latihan di Élever.',
      'reviews.ig': 'Lihat detik sebenar di Instagram',
      'reviews.disclaimer': 'Petikan di atas ialah teks contoh — ikuti kami di Instagram untuk detik latihan, keputusan dan kemas kini sebenar.',

      'cta.title': 'Sedia untuk <em>meningkat</em>?',
      'cta.body': 'Sama ada ayunan pertama anda atau gelaran seterusnya, ada tempat untuk anda di Élever Badminton.',
      'cta.enquire': 'Tanya sekarang', 'cta.email': 'E-mel kami', 'cta.instagram': 'Ikuti di Instagram',

      'footer.tag': 'Membina. Meningkat. Naik lebih tinggi.',
      'footer.instagram': 'Instagram',
      'footer.official': 'Laman rasmi',
      'footer.note': 'Reka bentuk semula konsep · Dibina untuk Élever Badminton. Fotografi © Élever Badminton.'
    }
  };

  /* ------------------------------------------------------------------ */
  /* 2. DATA STRINGS (quiz players/questions, news events, hub venues)   */
  /*    Keyed by id so the JS modules can look them up per language.     */
  /* ------------------------------------------------------------------ */
  var DATA = {
    // ---- quiz player bios: { role, tag, desc } per language ----
    players: {
      en: {
        an: { name: 'An Se-young', role: 'Women\u2019s Singles · World No. 1', tag: 'The Relentless Counter-Puncher', desc: 'Olympic and World champion who wins with suffocating consistency: she absorbs pace, extends rallies and flips defence into attack in a single shot. Ice-cold discipline, elite stamina, endless patience.' },
        tai: { name: 'Tai Tzu-ying', role: 'Women\u2019s Singles · Legend', tag: 'The Court Artist', desc: 'The most deceptive player of her generation — spontaneous, creative and impossible to read. She controls rallies with disguise and wristy magic rather than raw power. Pure improvisation.' },
        akane: { name: 'Akane Yamaguchi', role: 'Women\u2019s Singles · 3× World Champion', tag: 'The Tireless Retriever', desc: 'Proof that heart beats height. Bottomless defence, blistering footwork and a never-give-up spirit force opponents to hit one more shot — until they crack. Humble off court, ferocious on it.' },
        yeo: { name: 'Yeo Jia Min', role: 'Women\u2019s Singles · Singapore', tag: 'The Quiet Giant-Killer', desc: 'Singapore\u2019s under-the-radar star who has toppled Yamaguchi, Sindhu and other top-10 names. Humble, self-analytical and mentally tough — she rises without the spotlight and lets her racket talk.' },
        axelsen: { name: 'Viktor Axelsen', role: 'Men\u2019s Singles · 2× Olympic Champion', tag: 'The Problem-Solver', desc: 'The ultimate professional: methodical, disciplined and relentlessly self-improving. Towering defence married to a devastating smash — there\u2019s no problem on court he can\u2019t engineer a solution to.' },
        kunlavut: { name: 'Kunlavut Vitidsarn', role: 'Men\u2019s Singles · World Champion', tag: 'The Rally Chess-Master', desc: 'A patient, tactical thinker with elite defence who pushes you back, opens the court and counter-attacks the instant you\u2019re out of position. Calm, deceptive at the net, endlessly adaptable.' },
        loh: { name: 'Loh Kean Yew', role: 'Men\u2019s Singles · Singapore, 2021 World Champ', tag: 'The Fearless Attacker', desc: 'Singapore\u2019s first world champion. Explosive speed, high-flying jump smashes and a huge fighting spirit — he chases every shuttle and turns defence into attack in a heartbeat. Fearless underdog energy.' },
        antonsen: { name: 'Anders Antonsen', role: 'Men\u2019s Singles · World Champion', tag: 'The Tactical Craftsman', desc: 'Wins with brain over brawn: sharp changes of tempo, deceptive strokes, a tight net game and iron mental toughness. Built brick-by-brick from Denmark\u2019s famous club system.' },
        chou: { name: 'Chou Tien-chen', role: 'Men\u2019s Singles · Veteran', tag: 'The Ageless Warrior', desc: 'At 36 the oldest-ever Super 1000 champion. Ferociously fit, disciplined and durable — he out-lasts younger rivals through relentless conditioning and sheer will.' },
        naraoka: { name: 'Kodai Naraoka', role: 'Men\u2019s Singles · Rising Star', tag: 'The Marathon Runner', desc: 'A defensive powerhouse who thrives in brutal, lung-busting rallies. Turns matches into endurance tests and simply refuses to miss.' },
        shi: { name: 'Shi Yuqi', role: 'Men\u2019s Singles · Former World No. 1', tag: 'The Complete Package', desc: 'Smooth, balanced and technically flawless — strong in every phase, with the calm of a player who\u2019s solved the game. All-round excellence.' },
        jonatan: { name: 'Jonatan Christie', role: 'Men\u2019s Singles · Asian Champion', tag: 'The Crowd-Pleaser', desc: 'Athletic, charismatic and attack-minded — he feeds off the crowd and lights up an arena with explosive, entertaining badminton.' },
        lakshya: { name: 'Lakshya Sen', role: 'Men\u2019s Singles · India', tag: 'The Fearless Youngster', desc: 'Fast, aggressive and unafraid of anyone\u2019s reputation. A gutsy shot-maker who plays his best badminton on the biggest stages.' },
        chenyf: { name: 'Chen Yufei', role: 'Women\u2019s Singles · Olympic Champion', tag: 'The Ice Queen', desc: 'Tokyo 2020 gold medallist with a controlled, weighty game and nerves of steel. She dictates rallies with placement and composure.' },
        marin: { name: 'Carolina Marín', role: 'Women\u2019s Singles · Olympic Champion', tag: 'The Fierce Competitor', desc: 'Europe\u2019s trailblazer — explosive, left-handed and famously fiery. Roars through rallies with relentless attacking intensity and passion.' },
        sindhu: { name: 'P. V. Sindhu', role: 'Women\u2019s Singles · 2× Olympic Medallist', tag: 'The Big-Match Player', desc: 'Tall, powerful and built for the occasion — a towering smash and a champion\u2019s temperament that peaks when the medals are on the line.' },
        ratchanok: { name: 'Ratchanok Intanon', role: 'Women\u2019s Singles · Former World Champ', tag: 'The Silky Stylist', desc: 'Elegant, wristy and wonderfully deceptive — she wins with touch, timing and clever angles rather than brute force.' },
        wangzy: { name: 'Wang Zhiyi', role: 'Women\u2019s Singles · World No. 2', tag: 'The Steady Riser', desc: 'Consistent, composed and quietly climbing to the top with solid all-court play and a cool head under pressure.' },
        leezii: { name: 'Lee Zii Jia', role: 'Men\u2019s Singles · Malaysia', tag: 'The Independent Maverick', desc: 'Flashy, powerful and fiercely his own person — he went independent to chase his dream his way, with a spectacular attacking game.' },
        ginting: { name: 'Anthony Ginting', role: 'Men\u2019s Singles · Indonesia', tag: 'The Speed Demon', desc: 'Lightning-fast footwork and a rapid-fire attacking style. He overwhelms opponents with sheer pace and quick hands.' },
        gregoria: { name: 'Gregoria M. Tunjung', role: 'Women\u2019s Singles · Olympic Medallist', tag: 'The Resilient Fighter', desc: 'Battled through setbacks to a Paris 2024 bronze. Tenacious, improving and full of heart — she never stops believing.' },
        lindan: { name: 'Lin Dan', role: 'Men\u2019s Singles · The G.O.A.T.', tag: 'Super Dan', desc: 'Two-time Olympic champion and the most decorated men\u2019s singles player ever. Charismatic, dominant and box-office — a once-in-a-generation icon.' },
        lcw: { name: 'Lee Chong Wei', role: 'Men\u2019s Singles · Legend', tag: 'The Eternal Contender', desc: 'A record-breaking world No. 1 and Malaysia\u2019s hero — blistering speed and a fighter\u2019s heart that never gave up chasing gold.' },
        okuhara: { name: 'Nozomi Okuhara', role: 'Women\u2019s Singles · World Champion', tag: 'The Iron Retriever', desc: 'Small in stature, giant in defence. Famous for epic marathon rallies and a bottomless tank of stamina and grit.' },
        momota: { name: 'Kento Momota', role: 'Men\u2019s Singles · 2× World Champion', tag: 'The Comeback King', desc: 'A tactical genius with pinpoint control who fought back from adversity to reach world No. 1. Precision, patience and mental steel.' },
        saina: { name: 'Saina Nehwal', role: 'Women\u2019s Singles · Trailblazer', tag: 'The Pioneer', desc: 'The player who put Indian women\u2019s badminton on the map — aggressive, determined and an inspiration to a whole generation.' },
        tommy: { name: 'Tommy Sugiarto', role: 'Men\u2019s Singles · Indonesia', tag: 'The Crafty Veteran', desc: 'Experienced, clever and steady — he relies on smart placement, deception and years of ring-craft rather than raw power.' }
      },
      zh: {
        an: { name: '安洗莹', role: '女子单打 · 世界第一', tag: '不懈的防守反击手', desc: '奥运会与世锦赛冠军，以令人窒息的稳定性取胜：她化解对手的速度、拉长回合，并能一拍之间由守转攻。冷静自律、体能顶尖、耐心无穷。' },
        tai: { name: '戴资颖', role: '女子单打 · 传奇球星', tag: '球场艺术家', desc: '同辈中最难以捉摸的球员 — 灵动、富有创意、令人难以预判。她凭假动作与出神入化的手腕控制回合，而非蛮力。纯粹的即兴发挥。' },
        akane: { name: '山口茜', role: '女子单打 · 三届世锦赛冠军', tag: '不知疲倦的救球手', desc: '身高不占优，却用意志取胜。深不见底的防守、迅疾的步法与永不放弃的精神，逼着对手多打一拍 — 直到他们崩溃。场下谦逊，场上凶悍。' },
        yeo: { name: '杨佳敏', role: '女子单打 · 新加坡', tag: '低调的巨人杀手', desc: '新加坡低调的明星，曾击败山口茜、辛杜等多位世界前十选手。谦逊、善于自我剖析、心理强大 — 她不靠聚光灯崛起，让球拍替她说话。' },
        axelsen: { name: '安赛龙', role: '男子单打 · 两届奥运冠军', tag: '难题破解者', desc: '顶级职业球员的典范：有条不紊、自律、不懈自我提升。高塔般的防守搭配毁灭性的扣杀 — 场上没有他解不开的难题。' },
        kunlavut: { name: '昆拉武特', role: '男子单打 · 世锦赛冠军', tag: '回合中的棋手', desc: '有耐心、讲战术的思考者，防守一流，把你逼到底线、拉开空当，一旦你失位便立刻反击。冷静、网前假动作多、适应力极强。' },
        loh: { name: '骆建佑', role: '男子单打 · 新加坡，2021 世锦赛冠军', tag: '无畏的进攻者', desc: '新加坡首位世界冠军。爆发力十足、跳杀凌厉、斗志昂扬 — 每一个球都全力去追，转瞬之间由守转攻。无畏的黑马气质。' },
        antonsen: { name: '安东森', role: '男子单打 · 世锦赛冠军', tag: '战术工匠', desc: '以脑力取胜而非蛮力：节奏变化犀利、假动作多、网前细腻，且心理坚韧如铁。在丹麦著名的俱乐部体系中一砖一瓦磨炼而成。' },
        chou: { name: '周天成', role: '男子单打 · 老将', tag: '不老的战士', desc: '36 岁成为史上年龄最大的超级 1000 赛冠军。体能惊人、自律、耐打 — 靠着不懈的体能训练与顽强意志耗垮更年轻的对手。' },
        naraoka: { name: '奈良冈功大', role: '男子单打 · 新星', tag: '马拉松跑者', desc: '防守型的强手，在残酷、拼体能的多拍回合中如鱼得水。把比赛变成耐力考验，几乎不会失误。' },
        shi: { name: '石宇奇', role: '男子单打 · 前世界第一', tag: '全能选手', desc: '流畅、均衡、技术无懈可击 — 每个环节都很强，带着一种“已看透比赛”的从容。全面而卓越。' },
        jonatan: { name: '克里斯蒂', role: '男子单打 · 亚锦赛冠军', tag: '人气之星', desc: '身体素质出色、极具魅力、以攻为主 — 他从观众的热情中汲取能量，用爆发式、极具观赏性的羽球点燃全场。' },
        lakshya: { name: '拉克什亚·森', role: '男子单打 · 印度', tag: '无畏的少年', desc: '快速、进攻、不惧任何名头。敢打敢拼的制胜球高手，越是大舞台越能打出最佳状态。' },
        chenyf: { name: '陈雨菲', role: '女子单打 · 奥运冠军', tag: '冰之女王', desc: '东京 2020 金牌得主，打法沉稳有分量、心理素质过硬。她用落点与从容掌控回合。' },
        marin: { name: '马林', role: '女子单打 · 奥运冠军', tag: '凶悍的斗士', desc: '欧洲的开拓者 — 爆发力强、左手持拍、以火爆气场著称。她带着不懈的进攻强度与激情吼叫着打完每个回合。' },
        sindhu: { name: '辛杜', role: '女子单打 · 两届奥运奖牌得主', tag: '大赛型球员', desc: '身材高大、力量十足、为大场面而生 — 高点扣杀凶猛，冠军气质在争夺奖牌时达到巅峰。' },
        ratchanok: { name: '因达农', role: '女子单打 · 前世锦赛冠军', tag: '丝滑的技术流', desc: '优雅、手腕灵巧、假动作出众 — 她靠手感、时机与刁钻的角度取胜，而非蛮力。' },
        wangzy: { name: '王祉怡', role: '女子单打 · 世界第二', tag: '稳步上升者', desc: '稳定、沉着，凭借扎实的全场球和压力下的冷静头脑悄然攀升至顶端。' },
        leezii: { name: '李梓嘉', role: '男子单打 · 马来西亚', tag: '独立的特立独行者', desc: '华丽、力量足、极有主见 — 他选择单飞，以自己的方式追梦，拥有极具观赏性的进攻打法。' },
        ginting: { name: '金廷', role: '男子单打 · 印度尼西亚', tag: '速度恶魔', desc: '步法快如闪电，进攻风格连珠炮般密集。他用纯粹的速度与快手压制对手。' },
        gregoria: { name: '滕俊', role: '女子单打 · 奥运奖牌得主', tag: '坚韧的斗士', desc: '历经挫折，在巴黎 2024 摘得铜牌。顽强、不断进步、满怀热忱 — 她从不放弃相信自己。' },
        lindan: { name: '林丹', role: '男子单打 · 史上最伟大', tag: '超级丹', desc: '两届奥运冠军，史上荣誉最多的男单球员。极具魅力、统治力十足、票房号召力强 — 一代难遇的传奇icon。' },
        lcw: { name: '李宗伟', role: '男子单打 · 传奇球星', tag: '永远的挑战者', desc: '打破纪录的世界第一，马来西亚的英雄 — 速度惊人，怀着一颗永不放弃追逐金牌的斗士之心。' },
        okuhara: { name: '奥原希望', role: '女子单打 · 世锦赛冠军', tag: '钢铁救球手', desc: '身材娇小，防守却如巨人。以史诗级的马拉松回合，以及深不见底的体能与斗志著称。' },
        momota: { name: '桃田贤斗', role: '男子单打 · 两届世锦赛冠军', tag: '王者归来', desc: '掌控精准的战术天才，历经逆境重回世界第一。精准、耐心、意志如钢。' },
        saina: { name: '内瓦尔', role: '女子单打 · 开拓者', tag: '先驱', desc: '把印度女子羽毛球带上世界舞台的人 — 进攻、坚定，激励了整整一代人。' },
        tommy: { name: '苏吉亚托', role: '男子单打 · 印度尼西亚', tag: '精明的老将', desc: '经验丰富、聪明、稳健 — 他靠聪明的落点、假动作与多年的球场智慧取胜，而非蛮力。' }
      }
    },

    // ---- quiz questions & options (arrays parallel to QUESTIONS in main.js) ----
    quiz: {
      en: [
        { q: 'It\u2019s match point and the pressure is on. What\u2019s your gut reaction?',
          a: ['Keep it steady and wait for them to mess up', 'Go for a risky winner — high risk, high reward', 'Stick to the plan I\u2019ve practised a hundred times', 'Chase down every single shot until they crack'] },
        { q: 'Pick your go-to shot.',
          a: ['A massive jump smash', 'A sneaky fake that sends them the wrong way', 'An impossible save no one thought I\u2019d reach', 'Super-fast hands in a net battle'] },
        { q: 'How do you train?',
          a: ['Same strict routine every day, no shortcuts', 'Mess around, try new things, keep it fun', 'Pure fitness grind so I never run out of energy', 'Quietly fix my weak spots, one session at a time'] },
        { q: 'What are you like on court?',
          a: ['Loud and fired up — I show my emotions', 'Calm, quiet and hard to read', 'Low-key — I let my racket do the talking', 'A bit of a showoff — I love hyping the crowd'] },
        { q: 'What motivates you the most?',
          a: ['Being the underdog with nothing to lose', 'Being the first — someone others look up to', 'Outlasting everyone when they\u2019re exhausted', 'Being solid at every part of the game'] },
        { q: 'Your favourite way to win a point?',
          a: ['Overpower them with pace and power', 'Outsmart them with tricks and soft touches', 'Wear them down until they give up', 'Turn it on when it matters most'] }
      ],
      zh: [
        { q: '比分来到你的赛点（对手领先）。你的直觉是？',
          a: ['保持冷静、拉长回合，等对手失误', '大胆一搏，打出出其不意的制胜球', '相信我为此刻反复演练的战术', '死咬不放，用跑动耗垮对手 — 我从不停止追球'] },
        { q: '选出你的招牌球。',
          a: ['雷霆万钧的跳杀', '骗过所有人的假动作吊球', '什么球都能救的防守回击', '快如闪电的网前对拉'] },
        { q: '你如何训练？',
          a: ['固定的作息、严格的饮食、绝不走捷径', '尝试、即兴发挥，保持趣味', '死磕体能，直到耐力深不见底', '默默地一节课一节课地补短板'] },
        { q: '你在场上的气场是？',
          a: ['火爆 — 我会怒吼、挥拳，靠情绪点燃自己', '冷若冰霜、令人难以捉摸', '谦逊 — 我更愿意低调行事', '表演者 — 我热爱取悦观众'] },
        { q: '最能驱动你的是什么？',
          a: ['做一名无所畏惧、毫无包袱的黑马', '开辟一条后人追随的道路', '靠纯粹的体能耗过所有人', '把全面的技术打磨到极致'] },
        { q: '你最理想的得分方式？',
          a: ['用力量与速度碾压对手', '用假动作与手感智取对手', '耗到对手崩溃为止', '在最关键的时刻挺身而出'] }
      ],
      hi: [
        { q: 'मैच पॉइंट है और दबाव चरम पर। आपकी सहज प्रतिक्रिया क्या है?',
          a: ['शांत रहें और उनके गलती करने का इंतज़ार करें', 'जोखिम भरा विनर लगाएँ — बड़ा जोखिम, बड़ा इनाम', 'उस प्लान पर टिके रहें जो मैंने सौ बार अभ्यास किया है', 'हर एक शॉट के पीछे भागें जब तक वे टूट न जाएँ'] },
        { q: 'अपना पसंदीदा शॉट चुनें।',
          a: ['एक ज़बरदस्त जंप स्मैश', 'एक चालाक फ़ेक जो उन्हें गलत दिशा में भेज दे', 'एक नामुमकिन बचाव जिसकी किसी ने उम्मीद न की हो', 'नेट पर बिजली जैसी तेज़ हाथ-सफ़ाई'] },
        { q: 'आप कैसे ट्रेनिंग करते हैं?',
          a: ['हर दिन वही सख़्त रूटीन, कोई शॉर्टकट नहीं', 'मस्ती करें, नई चीज़ें आज़माएँ, मज़ा बनाए रखें', 'शुद्ध फ़िटनेस मेहनत ताकि मेरी ऊर्जा कभी खत्म न हो', 'चुपचाप अपनी कमज़ोरियाँ सुधारें, एक-एक सेशन'] },
        { q: 'कोर्ट पर आप कैसे हैं?',
          a: ['ज़ोरदार और जोश में — मैं अपनी भावनाएँ दिखाता हूँ', 'शांत, चुप और पढ़ने में मुश्किल', 'लो-की — मैं अपने रैकेट को बोलने देता हूँ', 'थोड़ा शो-ऑफ़ — मुझे भीड़ को जोश दिलाना पसंद है'] },
        { q: 'आपको सबसे ज़्यादा क्या प्रेरित करता है?',
          a: ['बिना कुछ खोने वाला अंडरडॉग होना', 'पहला होना — जिसकी ओर दूसरे देखें', 'सबको तब पछाड़ना जब वे थक जाएँ', 'खेल के हर हिस्से में मज़बूत होना'] },
        { q: 'पॉइंट जीतने का आपका पसंदीदा तरीका?',
          a: ['गति और ताक़त से उन्हें हावी कर दें', 'चालाकी और नाज़ुक टच से उन्हें मात दें', 'उन्हें तब तक थकाएँ जब तक वे हार न मानें', 'जब सबसे ज़रूरी हो तब कमाल दिखाएँ'] }
      ],
      ta: [
        { q: 'மேட்ச் பாயிண்ட், அழுத்தம் உச்சத்தில். உங்கள் உள்ளுணர்வு எதிர்வினை என்ன?',
          a: ['அமைதியாக இருந்து அவர்கள் தவறு செய்யக் காத்திருங்கள்', 'ரிஸ்க் எடுத்து வின்னர் அடியுங்கள் — பெரிய ரிஸ்க், பெரிய வெகுமதி', 'நூறு முறை பயிற்சி செய்த திட்டத்தில் உறுதியாக இருங்கள்', 'அவர்கள் சோர்ந்து போகும் வரை ஒவ்வொரு அடியையும் துரத்துங்கள்'] },
        { q: 'உங்கள் விருப்பமான ஷாட்டைத் தேர்வு செய்யுங்கள்.',
          a: ['ஒரு பலமான ஜம்ப் ஸ்மாஷ்', 'அவர்களைத் தவறான திசையில் அனுப்பும் ஒரு தந்திரமான ஃபேக்', 'யாரும் எதிர்பார்க்காத ஒரு சாத்தியமற்ற காப்பாற்றல்', 'நெட்டில் மின்னல் வேக கை வேலை'] },
        { q: 'நீங்கள் எப்படி பயிற்சி செய்கிறீர்கள்?',
          a: ['தினமும் அதே கடுமையான வழக்கம், குறுக்குவழிகள் இல்லை', 'விளையாடி, புதியவற்றை முயற்சித்து, சுவாரஸ்யமாக வைத்திருங்கள்', 'ஆற்றல் ஒருபோதும் தீராதபடி தூய உடற்பயிற்சி உழைப்பு', 'அமைதியாக என் பலவீனங்களை சரிசெய்கிறேன், ஒவ்வொரு அமர்வாக'] },
        { q: 'கோர்ட்டில் நீங்கள் எப்படி?',
          a: ['சத்தமாக, உற்சாகமாக — என் உணர்வுகளைக் காட்டுகிறேன்', 'அமைதி, மௌனம், படிக்க கடினம்', 'அமைதியானவன் — என் ராக்கெட்டையே பேச விடுகிறேன்', 'சற்று ஷோ-ஆஃப் — கூட்டத்தை உற்சாகப்படுத்த விரும்புகிறேன்'] },
        { q: 'உங்களை மிகவும் தூண்டுவது எது?',
          a: ['இழப்பதற்கு எதுவுமில்லாத அண்டர்டாக் ஆக இருப்பது', 'முதலாமவராக இருப்பது — மற்றவர்கள் மதிக்கும் ஒருவர்', 'அனைவரும் சோர்ந்த பின்பும் நீடிப்பது', 'விளையாட்டின் ஒவ்வொரு பகுதியிலும் திடமாக இருப்பது'] },
        { q: 'புள்ளி வெல்ல உங்கள் விருப்பமான வழி?',
          a: ['வேகம் மற்றும் பலத்தால் அவர்களை மிஞ்சுங்கள்', 'தந்திரம் மற்றும் மென்மையான டச்சால் புத்திசாலித்தனமாக வெல்லுங்கள்', 'அவர்கள் விட்டுக்கொடுக்கும் வரை சோர்வடையச் செய்யுங்கள்', 'மிக முக்கியமான தருணத்தில் சிறந்து விளங்குங்கள்'] }
      ],
      ms: [
        { q: 'Mata perlawanan dan tekanan memuncak. Apa reaksi naluri anda?',
          a: ['Kekal tenang dan tunggu mereka buat silap', 'Cuba pukulan berisiko — risiko tinggi, ganjaran tinggi', 'Ikut rancangan yang saya latih beratus kali', 'Kejar setiap pukulan sehingga mereka tumbang'] },
        { q: 'Pilih pukulan pilihan anda.',
          a: ['Smash lompat yang hebat', 'Tipuan licik yang menghantar mereka ke arah salah', 'Penyelamatan mustahil yang tiada siapa sangka saya capai', 'Tangan sepantas kilat dalam pertempuran jaring'] },
        { q: 'Bagaimana anda berlatih?',
          a: ['Rutin ketat yang sama setiap hari, tiada jalan pintas', 'Bermain-main, cuba benda baharu, kekalkan keseronokan', 'Latihan kecergasan tulen supaya tenaga tak pernah habis', 'Diam-diam perbaiki kelemahan saya, satu sesi demi satu'] },
        { q: 'Bagaimana anda di gelanggang?',
          a: ['Lantang dan bersemangat — saya tunjuk emosi saya', 'Tenang, senyap dan sukar dibaca', 'Rendah diri — saya biar raket saya bercakap', 'Sedikit suka menunjuk — saya suka menaikkan semangat penonton'] },
        { q: 'Apa yang paling mendorong anda?',
          a: ['Menjadi pihak bawah yang tiada apa nak rugi', 'Menjadi yang pertama — orang yang dicontohi', 'Bertahan lebih lama apabila semua sudah keletihan', 'Mantap dalam setiap aspek permainan'] },
        { q: 'Cara kegemaran anda untuk menang mata?',
          a: ['Atasi mereka dengan kepantasan dan kuasa', 'Kalahkan mereka dengan tipu helah dan sentuhan halus', 'Lelahkan mereka sehingga mengalah', 'Naikkan tahap apabila ia paling penting'] }
      ]
    },

    // ---- news events: name, grade, result per language, keyed by index ----
    news: {
      en: null, // English uses the source strings already in main.js EVENTS
      zh: {
        // keyed by event 'name' (English) -> { name, grade, result }
        'India Open': { name: '印度公开赛', grade: '超级 750', result: '男单 林俊易 · 女单 安洗莹 · 男双 梁伟铿／王昶 · 女双 刘圣书／谭宁 · 混双 德差蓬／沙西丽。' },
        'Malaysia Open': { name: '马来西亚公开赛', grade: '超级 1000', result: '男单 昆拉武特（首夺超级 1000）· 女单 安洗莹（三连冠）· 男双 金元浩／徐承宰 · 女双 刘圣书／谭宁 · 混双 冯彦哲／黄东萍。' },
        'Indonesia Masters': { name: '印尼大师赛', grade: '超级 500' },
        'Thailand Masters': { name: '泰国大师赛', grade: '超级 300' },
        'German Open': { name: '德国公开赛', grade: '超级 300' },
        'All England Open': { name: '全英公开赛', grade: '超级 1000', result: '男单 林俊易（胜 拉克什亚·森）· 女单 王祉怡（胜 安洗莹）· 混双 叶宏纬／陈玟妤。' },
        'Swiss Open': { name: '瑞士公开赛', grade: '超级 300' },
        'Ruichang China Masters': { name: '瑞昌中国大师赛', grade: '超级 100' },
        'Orléans Masters': { name: '奥尔良大师赛', grade: '超级 300' },
        'Thailand Open': { name: '泰国公开赛', grade: '超级 500' },
        'Baoji China Masters': { name: '宝鸡中国大师赛', grade: '超级 100' },
        'Malaysia Masters': { name: '马来西亚大师赛', grade: '超级 500' },
        'Singapore Open': { name: '新加坡公开赛', grade: '超级 750', result: '男单 亚历克斯·拉尼耶 · 男双 兰基雷迪／谢提。骆建佑首次闯入主场决赛。' },
        'Indonesia Open': { name: '印尼公开赛', grade: '超级 1000', result: '男单 维克多·赖 · 女单 安洗莹 · 男双 吴世飞／努尔·伊祖丁 · 女双 福岛由纪／松本麻佑 · 混双 克里斯蒂安森／伯厄。' },
        'Australian Open': { name: '澳大利亚公开赛', grade: '超级 500' },
        'Macau Open': { name: '澳门公开赛', grade: '超级 300' },
        'U.S. Open': { name: '美国公开赛', grade: '超级 300' },
        'Canada Open': { name: '加拿大公开赛', grade: '超级 300' },
        'Japan Open': { name: '日本公开赛', grade: '超级 750', result: '男单 克里斯托·波波夫 · 女单 辛杜 · 男双 法扎尔／穆罕默德·舒海布尔·菲克里 · 女双 金惠贞／孔希容 · 混双 冯彦哲／黄东萍。' },
        'China Open': { name: '中国公开赛', grade: '超级 1000', result: '男单 周天成 — 36 岁，成为史上年龄最大的超级 1000 冠军（胜 托马·波波夫）· 女单 山口茜（胜 陈雨菲）· 男双 法扎尔／穆罕默德·舒海布尔·菲克里 · 女双 刘圣书／谭宁（卫冕）· 混双 郭新娃／陈芳卉。' },
        'Taipei Open': { name: '台北公开赛', grade: '超级 300' },
        'Korea Masters': { name: '韩国大师赛', grade: '超级 300' },
        'BWF World Championships': { name: '世界羽联世锦赛', grade: '新德里', result: '本赛季分量最重的桂冠。山口茜力争卫冕世界冠军；群雄逐鹿彩虹战袍。' },
        'China Masters': { name: '中国大师赛', grade: '超级 750' },
        'Indonesia Masters Super 100 I': { name: '印尼大师赛 超级 100（第一站）', grade: '超级 100' },
        'Vietnam Open': { name: '越南公开赛', grade: '超级 100' },
        'Arctic Open': { name: '北极公开赛', grade: '超级 500' },
        'Denmark Open': { name: '丹麦公开赛', grade: '超级 750' },
        'Malaysia Super 100': { name: '马来西亚 超级 100', grade: '超级 100' },
        'French Open': { name: '法国公开赛', grade: '超级 750' },
        'Indonesia Masters Super 100 II': { name: '印尼大师赛 超级 100（第二站）', grade: '超级 100' },
        'Hylo Open': { name: 'Hylo 公开赛', grade: '超级 500' },
        'Korea Open': { name: '韩国公开赛', grade: '超级 500' },
        'Japan Masters': { name: '日本大师赛', grade: '超级 500' },
        'Kaohsiung Masters': { name: '高雄大师赛', grade: '超级 100' },
        'Hong Kong Open': { name: '香港公开赛', grade: '超级 500' },
        'Syed Modi International': { name: '赛义德·莫迪国际赛', grade: '超级 300' },
        'Guwahati Masters': { name: '古瓦哈提大师赛', grade: '超级 100' },
        'Odisha Masters': { name: '奥迪沙大师赛', grade: '超级 100' },
        'BWF World Tour Finals': { name: '世界羽联世界巡回赛总决赛', grade: '赛季收官战', result: '各单项世界前八齐聚，为 2026 赛季画上句号。' }
      }
    },

    // ---- month names for the news timeline headers ----
    months: {
      en: { January: 'January', February: 'February', March: 'March', April: 'April', May: 'May', June: 'June', July: 'July', August: 'August', September: 'September', October: 'October', November: 'November', December: 'December' },
      zh: { January: '1 月', February: '2 月', March: '3 月', April: '4 月', May: '5 月', June: '6 月', July: '7 月', August: '8 月', September: '9 月', October: '10 月', November: '11 月', December: '12 月' },
      short: {
        en: { January: 'Jan', February: 'Feb', March: 'Mar', April: 'Apr', May: 'May', June: 'Jun', July: 'Jul', August: 'Aug', September: 'Sep', October: 'Oct', November: 'Nov', December: 'Dec' },
        zh: { January: '1 月', February: '2 月', March: '3 月', April: '4 月', May: '5 月', June: '6 月', July: '7 月', August: '8 月', September: '9 月', October: '10 月', November: '11 月', December: '12 月' }
      }
    },

    // ---- hub venue overrides: translated name/area/meta per venue id ----
    venues: {
      zh: {
        wyse: { name: 'Wyse Active Hub', area: '裕廊东', meta: '冷气球馆 · 32 片场地（全岛最大）' },
        fernvale: { name: 'Fernvale Village', area: '盛港', meta: '冷气球馆 · 羽毛球与匹克球' },
        arina: { name: 'The Sports Arina @ Jalan Kayu', area: '盛港西', meta: '冷气球馆 · 综合运动中心' },
        sbhsims: { name: '新加坡羽毛球馆（SBH @ Sims）', area: '芽笼', meta: '16 片场地 + VIP · 电话 6744 4111' },
        sbhexpo: { name: 'SBH East Coast @ Expo', area: '樟宜', meta: '全岛最大私人球馆 · 22+ 片场地' },
        obapasirris: { name: 'OBA Arena @ Pasir Ris', area: '巴西立', meta: '学院运营球馆' },
        obapunggol: { name: 'OBA Arena @ Punggol', area: '榜鹅', meta: '有顶球馆' },
        citysprouts: { name: 'City Sprouts @ Bedok', area: '勿洛', meta: '社区中心 · 由 XY 羽球运营' },
        kff: { name: 'KFF 羽毛球馆／新加坡羽毛球体育馆', area: '芽笼', meta: '历史悠久的 SBA 场馆 · 12 片场地（2025 年重开）' },
        smash: { name: 'Smash Arena', area: '裕群（Joo Koon）', meta: '9 片双打 + 1 片单打 · Taraflex 地胶' },
        cereza: { name: 'Cereza Sports Hall', area: '友诺士', meta: '约 4 片场地 · 橡胶垫地面' },
        kovan: { name: 'Kovan Sports Centre', area: '后港', meta: '室内场地' },
        ocbc: { name: 'OCBC 羽毛球馆', area: '加冷', meta: '冷气场馆' },
        oth: { name: '淡滨尼天地 — 淡滨尼体育中心', area: '淡滨尼', meta: 'ActiveSG 旗舰球馆 · 约 20 片场地' },
        bishan: { name: '碧山体育中心', area: '碧山' },
        canberra: { name: '武吉甘柏体育中心', area: '三巴旺' },
        gombak: { name: '武吉巴督体育中心（Bukit Gombak）', area: '武吉巴督' },
        cck: { name: '蔡厝港体育中心', area: '蔡厝港' },
        clementi: { name: '金文泰体育中心', area: '金文泰' },
        delta: { name: 'Delta 体育中心', area: '中峇鲁' },
        heartbeat: { name: 'Heartbeat @ 勿洛体育中心', area: '勿洛' },
        hougang: { name: '后港体育中心', area: '后港' },
        jurongeast: { name: '裕廊东体育中心', area: '裕廊东' },
        jurongwest: { name: '裕廊西体育中心', area: '裕廊西' },
        pasirris: { name: '巴西立体育中心', area: '巴西立' },
        queenstown: { name: '女皇镇体育中心', area: '女皇镇' },
        sengkang: { name: '盛港体育中心', area: '盛港' },
        senja: { name: 'Senja-Cashew 体育中心', area: '武吉班让' },
        serangoon: { name: '实龙岗体育中心', area: '实龙岗' },
        wilfred: { name: 'St. Wilfred 体育中心', area: '加冷' },
        toapayoh: { name: '大巴窑体育中心', area: '大巴窑' },
        woodlands: { name: '兀兰体育中心', area: '兀兰' },
        yck: { name: '杨厝港体育中心', area: '宏茂桥' },
        yishun: { name: '义顺体育中心', area: '义顺' },
        evans: { name: 'MOE（Evans）体育馆', area: '武吉知马' },
        csc: { name: '中华游泳会', area: '加东', meta: '仅限会员 · 始于 1909 年' },
        ssc: { name: '新加坡游泳会', area: '丹戎禺', meta: '仅限会员 · 始于 1894 年' },
        warren: { name: 'Warren 高尔夫乡村俱乐部', area: '多佛', meta: '仅限会员 · 电话 6778 0127' },
        acsbarker: { name: '英华学校（巴克路）', area: '纽顿', meta: 'Élever 常规课程场地 · 学校球馆' },
        bidadari: { name: '碧达达利民众俱乐部', area: '碧达达利', meta: 'Élever 常规课程场地 · 民众俱乐部' },
        cantonment: { area: '丹戎巴葛', meta: 'Élever 常规课程场地 · 学校球馆' },
        northvista: { area: '盛港', meta: 'Élever 常规课程场地 · 学校球馆' },
        scgs: { area: '武吉知马', meta: 'Élever 常规课程场地 · 学校球馆' }
      }
    }
  };

  /* ------------------------------------------------------------------ */
  /* 3. ENGINE                                                           */
  /* ------------------------------------------------------------------ */
  var current = 'en';

  function normalise(l) { return SUPPORTED.indexOf(l) !== -1 ? l : 'en'; }

  function t(key, vars) {
    var dict = UI[current] || UI.en;
    var s = dict[key];
    if (s == null) s = UI.en[key];
    if (s == null) return key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
      });
    }
    return s;
  }

  function applyStatic(root) {
    root = root || document;
    root.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    root.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    root.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph')));
    });
    root.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
  }

  function updateToggle() {
    var label = document.getElementById('langCurrent');
    if (label) label.textContent = LANG_LABELS[current] || current.toUpperCase();
    document.querySelectorAll('.lang__opt').forEach(function (b) {
      var on = b.getAttribute('data-lang') === current;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-checked', String(on));
    });
    var toggle = document.getElementById('langToggle');
    if (toggle) toggle.setAttribute('aria-label', 'Language / 语言: ' + (LANG_NAMES[current] || current));
  }

  function setLang(lang, opts) {
    current = normalise(lang);
    try { localStorage.setItem(STORAGE_KEY, current); } catch (e) {}
    var rootEl = document.documentElement;
    rootEl.setAttribute('lang', LANG_TAG[current] || 'en');
    SUPPORTED.forEach(function (l) { rootEl.classList.toggle('lang-' + l, current === l); });
    applyStatic(document);
    // fix the search placeholder (input uses a dedicated string)
    var search = document.getElementById('hallSearch');
    if (search) search.setAttribute('placeholder', t('hub.searchPh'));
    updateToggle();
    // let JS-rendered modules refresh themselves
    if (!opts || !opts.silent) {
      document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: current } }));
    }
  }

  function detectInitial() {
    var saved;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    var codes = ['zh', 'hi', 'ta', 'ms'];
    for (var i = 0; i < codes.length; i++) { if (nav.indexOf(codes[i]) === 0) return codes[i]; }
    return 'en';
  }

  // Public API
  window.I18N = {
    t: t,
    lang: function () { return current; },
    set: setLang,
    data: DATA,
    apply: applyStatic
  };

  // Wire up toggle buttons + initial language as soon as the DOM is ready.
  function init() {
    var toggle = document.getElementById('langToggle');
    var menu = document.getElementById('langMenu');
    if (toggle && menu) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
      });
      document.addEventListener('click', function () {
        menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false');
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
      });
    }
    document.querySelectorAll('.lang__opt').forEach(function (b) {
      b.addEventListener('click', function () {
        setLang(b.getAttribute('data-lang'));
        if (menu) menu.classList.remove('open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    });
    // Apply the detected/saved language. Modules load after this file and
    // render themselves in the current language on their own first run.
    setLang(detectInitial(), { silent: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
