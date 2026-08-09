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
  var SUPPORTED = ['en', 'zh'];

  /* ------------------------------------------------------------------ */
  /* 1. UI STRINGS                                                       */
  /* ------------------------------------------------------------------ */
  var UI = {
    en: {
      'a11y.skip': 'Skip to main content',
      'intro.skip': 'Skip intro',

      'nav.about': 'About', 'nav.quiz': 'Quiz', 'nav.programs': 'Programs',
      'nav.team': 'Coaches', 'nav.hub': 'SG Hub', 'nav.news': 'News',
      'nav.play': 'Play', 'nav.join': 'Join us',

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
      'quiz.count': 'Question {n} of {total}',
      'quiz.resultLead': 'Your badminton twin is\u2026',
      'quiz.again': 'Play again',
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
      'hub.hint': 'There\u2019s nowhere in Singapore to find every place to play — so we built it. Browse the halls, learn how to book a court, and find people to hit with. <strong>Not just an academy — the home of badminton in Singapore.</strong>',
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

      'groups.featureEyebrow': 'Find your level',
      'groups.featureTitle': 'Racket Ratings',
      'groups.featureBody': 'Not sure how good you are — or who to play with? <strong>Racket Ratings</strong> gives Singapore players a skill rating and helps you find casual sessions, kakis and games near your level.',
      'groups.featureCta': 'Visit Racket Ratings',
      'groups.casualTitle': 'Casual & social play',
      'groups.casualBody': 'Most social games form up on community platforms. Try these to find a session near you and at your level:',
      'groups.casualLink1': '<a href="https://www.racketratings.com/" target="_blank" rel="noopener">Racket Ratings</a> — rated players and sessions',
      'groups.casualLink2': '<a href="https://www.meetup.com/find/?keywords=badminton&location=sg--Singapore" target="_blank" rel="noopener">Meetup — Singapore badminton</a>',
      'groups.casualLink3': 'Facebook and Telegram \u201Ckaki\u201D groups (search \u201Cbadminton Singapore\u201D)',
      'groups.casualLink4': 'Your neighbourhood CC — many run drop-in social sessions',
      'groups.coachTitle': 'Prefer structured coaching?',
      'groups.coachBody': 'If you\u2019d rather improve with a coach, that\u2019s exactly what we do. From your first swing to competition, Élever\u2019s camps, classes and clinics have a place for you.',
      'groups.coachCta': 'See our programs',

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

      'cta.title': 'Ready to <em>elevate</em>?',
      'cta.body': 'Whether it\u2019s your first swing or your next title, there\u2019s a place for you at Élever Badminton.',
      'cta.enquire': 'Enquire now', 'cta.email': 'Email us',

      'footer.tag': 'To build. To raise. To rise higher.',
      'footer.official': 'Official site',
      'footer.note': 'Concept redesign · Built for Élever Badminton. Photography © Élever Badminton.'
    },

    zh: {
      'a11y.skip': '跳至主要内容',
      'intro.skip': '跳过片头',

      'nav.about': '关于我们', 'nav.quiz': '测验', 'nav.programs': '课程',
      'nav.team': '教练团队', 'nav.hub': '新加坡中心', 'nav.news': '赛事资讯',
      'nav.play': '小游戏', 'nav.join': '加入我们',

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
      'quiz.count': '第 {n} 题 / 共 {total} 题',
      'quiz.resultLead': '你的羽球分身是\u2026',
      'quiz.again': '再玩一次',
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
      'hub.hint': '在新加坡，没有一个地方能查到所有打球场地 — 于是我们把它做了出来。浏览球馆、了解如何订场，并找到一起打球的伙伴。<strong>不只是一家学院 — 更是新加坡羽球之家。</strong>',
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

      'groups.featureEyebrow': '找到你的水平',
      'groups.featureTitle': 'Racket Ratings 评级',
      'groups.featureBody': '不确定自己水平如何、也不知道该和谁打？<strong>Racket Ratings</strong> 为新加坡球员提供技术评级，帮你找到与自己水平相近的休闲球局、球友与比赛。',
      'groups.featureCta': '前往 Racket Ratings',
      'groups.casualTitle': '休闲与社交球局',
      'groups.casualBody': '大多数社交球局都在社区平台上组织。试试以下渠道，找到就近且水平相当的球局：',
      'groups.casualLink1': '<a href="https://www.racketratings.com/" target="_blank" rel="noopener">Racket Ratings</a> — 有评级的球员与球局',
      'groups.casualLink2': '<a href="https://www.meetup.com/find/?keywords=badminton&location=sg--Singapore" target="_blank" rel="noopener">Meetup — 新加坡羽毛球</a>',
      'groups.casualLink3': 'Facebook 与 Telegram 的“球友（kaki）”群组（搜索“badminton Singapore”）',
      'groups.casualLink4': '你家附近的民众俱乐部（CC） — 许多都设有随到随打的社交场次',
      'groups.coachTitle': '想要系统化的训练？',
      'groups.coachBody': '如果你更愿意在教练指导下进步，这正是我们的专长。从第一次挥拍到参加比赛，Élever 的训练营、常规课程与工作坊都为你留有一席之地。',
      'groups.coachCta': '查看我们的课程',

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

      'cta.title': '准备好<em>提升</em>了吗？',
      'cta.body': '无论是你的第一次挥拍，还是下一座奖杯 — 在 Élever 羽毛球学院，总有属于你的一席之地。',
      'cta.enquire': '立即咨询', 'cta.email': '发送邮件',

      'footer.tag': '培养、提升，更上一层楼。',
      'footer.official': '官方网站',
      'footer.note': '概念改版设计 · 为 Élever 羽毛球学院打造。摄影 © Élever 羽毛球学院。'
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
        { q: 'It\u2019s match point against you. What\u2019s your instinct?',
          a: ['Stay calm, extend the rally, wait for their mistake', 'Go for a bold, unexpected winner', 'Trust the plan I drilled for exactly this moment', 'Dig in and out-run them — I never stop chasing'] },
        { q: 'Pick your signature shot.',
          a: ['A thunderous jump smash', 'A disguised drop that fools everyone', 'A gets-everything defensive retrieve', 'A blistering fast net-to-net exchange'] },
        { q: 'How do you train?',
          a: ['Rigid routine, strict diet, zero shortcuts', 'Experiment, improvise, keep it playful', 'Grind fitness until my tank is bottomless', 'Quietly fix my weaknesses, session by session'] },
        { q: 'What\u2019s your energy on court?',
          a: ['Fiery — I roar, I fist-pump, I feed off emotion', 'Ice-cold and unreadable', 'Humble — I\u2019d rather fly under the radar', 'A showman — I love entertaining the crowd'] },
        { q: 'What drives you the most?',
          a: ['Being a fearless underdog with nothing to lose', 'Blazing a trail others will follow', 'Outlasting everyone through sheer fitness', 'Perfecting a complete, all-round game'] },
        { q: 'Your ideal way to win a point?',
          a: ['Overwhelm them with power and speed', 'Outsmart them with deception and touch', 'Outlast them until they break', 'Rise to the moment when it matters most'] }
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
    var en = document.getElementById('langEn');
    var zh = document.getElementById('langZh');
    if (en && zh) {
      en.classList.toggle('is-active', current === 'en');
      zh.classList.toggle('is-active', current === 'zh');
      en.setAttribute('aria-pressed', String(current === 'en'));
      zh.setAttribute('aria-pressed', String(current === 'zh'));
    }
  }

  function setLang(lang, opts) {
    current = normalise(lang);
    try { localStorage.setItem(STORAGE_KEY, current); } catch (e) {}
    document.documentElement.setAttribute('lang', current === 'zh' ? 'zh-Hans' : 'en');
    document.documentElement.classList.toggle('lang-zh', current === 'zh');
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
    return nav.indexOf('zh') === 0 ? 'zh' : 'en';
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
    var en = document.getElementById('langEn');
    var zh = document.getElementById('langZh');
    if (en) en.addEventListener('click', function () { setLang('en'); });
    if (zh) zh.addEventListener('click', function () { setLang('zh'); });
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
