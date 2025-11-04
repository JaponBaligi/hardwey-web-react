import 'dotenv/config';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const SECTION_KEYS = [
  'home','hero','intro','shares','ticker','investmentIntro','investment','nftDisclaimer','faq','fredAgain','founders','joinUs','footer','moreFaq','privacyPolicy','terms','errorPage','faqIntro','partners','collaboratives'
];
const SECTION_TEMPLATES = {
  home: { text: 'Welcome to Hardwey LLC', images: [], links: [] },
  hero: {
    logoUrl: '/assets/img/hardweybannertext.png',
    backgroundImage: '/assets/banner/artistlarge1.jpg',
    backgroundImageSrcSet: '/assets/banner/artistlarge%201-p-500.jpg 500w, /assets/banner/artistlarge1-p-800.jpg 800w, /assets/banner/artistlarge1-p-1080.jpg 1080w, /assets/banner/artistlarge1-p-1600.jpg 1600w, /assets/banner/artistlarge1-p-2000.jpg 2000w, /assets/banner/artistlarge1.jpg 2457w',
    mitaText: 'Music is the answer™',
    subtitle: 'A movement in music. Redefining the rules.',
    leftIdentifier: '/assets/svg/investident-hero.svg',
    rightIdentifier: '/assets/svg/barcode-ident.svg',
    motifs: [
      '/assets/svg/new-wave24.svg',
      '/assets/svg/restricted-change-ident.svg',
      '/assets/svg/international-blue.svg',
      '/assets/svg/hardweyrights.svg',
      '/assets/svg/star-ident-blue.svg'
    ],
    images: [],
    links: []
  },
  intro: { text: 'Intro text', images: [], links: [] },
  shares: {
    heading: "Buy shares in artists' brands",
    subheadingMobile: 'A new way to invest',
    subheadingWords: ['A new way', 'to', 'Invest'],
    bodyCopy: "Artists build brands that generate revenue from their music, shows, merch and more. HARDWEY is the first app that allows you to invest in those brands and own a piece of their success.",
    imageUrl: '/assets/img/BUY%20SHARES%20IMAGE.jpg',
    imageSrcSet: '/assets/img/shares-500.jpg 500w, /assets/img/shares-800.jpg 800w, /assets/img/shares-800.jpg 1080w, /assets/img/BUY%20SHARES%20IMAGE.jpg 1440w',
    images: [],
    links: []
  },
  ticker: {
    backgroundColor: '#bbdbfa',
    tickerWords: ['Music', 'Shows', 'Merch', 'More'],
    images: [],
    links: []
  },
  investmentIntro: { text: 'Investment intro', images: [], links: [] },
  investment: {
    backgroundImage: '/assets/img/BUY SHARES IMAGE.jpg',
    mainHeading: 'invest in artists',
    animatedWords: ['it', 'hits', 'different'],
    comingSoonTitle: 'Coming soon',
    dateText: '(?/?/2026)',
    logoImage: '/assets/img/hardweymainlogo.jpg',
    welcomeText: 'Welcome to HARDWEY',
    images: [],
    links: []
  },
  nftDisclaimer: {
    nopeText: 'Nope',
    wereText: "We're",
    nftsText: 'NFTs',
    valueMusicText: 'We value mu$ic more than pixels',
    resonateText: "We're building something that resonates with everyone. Not just \"PR\".",
    resonateTextMobile: "we're building something that resonates with everyone. Not just crypto bros.",
    monaImageUrl: '/assets/img/mona-image2.jpg',
    monaImageSrcSet: '/assets/img/mona-image2-p-500.jpg 500w, /assets/img/mona-image2-p-800.jpg 800w, /assets/img/mona-image2.jpg 1004w',
    gifImageUrl: '/assets/img/fav.gif',
    starIconUrl: '/assets/svg/hardwey-star.svg',
    notGraphicUrl: 'https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/6510100a109f7d930dd06744_not-svg.svg',
    backgroundColor: '#d12d37',
    images: [],
    links: []
  },
  faq: {
    faqItems: [
      {
        id: 'how-does-it-work',
        question: 'How does it work?',
        subtitle: "It's remarkably simple",
        answer: "We work closely with artists and their teams to launch their shares on HARDWEY. Just like with stocks, when shares become available on the app, you'll be able to buy and trade them all in one place.",
        additionalInfo: ['', '']
      },
      {
        id: 'what-am-i-buying',
        question: 'What am I actually buying?',
        subtitle: "Not NFTs, that's for sure",
        answer: "Artists own companies that collect their income from music royalties, shows, merch, and more. With HARDWEY, you'll be buying shares in those companies, owning a piece of the pie. You're becoming an investor in the artist.",
        additionalInfo: ['', '']
      },
      {
        id: 'how-do-i-make-money',
        question: 'How do I make money?',
        subtitle: 'Buy low, sell high',
        answer: "We're setting up a market where buying and selling shares takes just a few clicks. If the value of your shares rises, you can sell them to make a profit. Plus, every so often, artists may pay out dividends to their investors.",
        additionalInfo: ['', '']
      },
      {
        id: 'will-i-have-to-pay',
        question: 'Will I have to pay to be on HARDWEY?',
        subtitle: 'Joking?Right?',
        answer: "You won't find us on your monthly subscription bill next to Netflix and Spotify. We charge a small % fee per transaction. If you don't use HARDWEY, HARDWEY won't use you :)",
        additionalInfo: ['', '']
      },
      {
        id: 'can-i-invest-5-million',
        question: 'Can I invest $5 million?',
        subtitle: 'Damn, call us',
        answer: 'Feeling generous today, huh? If so, please get in touch with our head of high-net-worth clients (HNWC), MRS. CENKER, at THISISJOKE@ABSOLUTELY.COM',
        additionalInfo: ['', '']
      }
    ],
    images: [],
    links: []
  },
  fredAgain: {
    heading: 'Imagine you invested in Fred Again.. in 2020',
    subheading: "Braggin' rights now come with returns",
    backgroundImage: 'https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV).jpg',
    backgroundImageSrcSet: 'https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV)-p-500.jpg 500w, https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV)-p-800.jpg 800w, https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV)-p-1080.jpg 1080w, https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV)-p-1600.jpg 1600w, https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV)-p-2000.jpg 2000w, https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV).jpg 2858w',
    logoUrls: [
      '/assets/img/hardweybannertext.png',
      'https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/64fde2e125f96a17e11dbc64_HIF-ident2.svg'
    ],
    images: [],
    links: []
  },
  founders: {
    founders: [{
      id: 'founder-1',
      name: 'Metehan İlikhan',
      role: 'Founder & CEO',
      bio: 'More than a decade ago, our friendship sparked from a conversation about who\'ll be the next David Bowie. Now, 10 years later, our shared passion for music has led us to a groundbreaking movement. We\'ve created HARDWEY, allowing folks like us to invest in the future success of artists.',
      quote: 'We\'re building a movement in music',
      imageUrl: '/assets/banner/founder.jpg',
      imageSrcSet: '/assets/banner/founder.jpg 500w, /assets/banner/founder.jpg 1080w, /assets/banner/founder.jpg 1610w',
      additionalInfo: [
        'Passionate about democratizing music investment',
        'Believes in the power of artist-fan connections',
        'Visionary leader in the music technology space',
      ],
    }],
    heading: 'The Founders',
    headingSingular: 'The Founder',
    animatedWords: ['long', 'story', 'short'],
    animatedTextMobile: 'Long story short',
    images: [],
    links: []
  },
  joinUs: { text: 'Join us', formUrl: '', images: [], links: [] },
  footer: { text: 'Footer text', links: [{ label: 'Privacy', url: '/privacy-policy' }] },
  moreFaq: {
    pageTitle: 'More FAQ It',
    pageSubtitle: 'Everything you need to know about investing in artists',
    faqItems: [],
    imageUrl: 'https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV).jpg',
    contactHeading: "More questions? We've got more answers",
    contactButtonText: "don't be shy, it's okay to send mail",
    contactEmail: 'hello@hardweyllc.com',
    images: [],
    links: []
  },
  privacyPolicy: { text: 'Privacy policy content', images: [], links: [] },
  terms: { text: 'Terms of service content', images: [], links: [] },
  errorPage: {
    error404: {
      title: '404 NOT FOUND',
      description: 'You dive too deep so you discovered an unexplored place, congrats! Let me assist you the explored places granny you forgot your pills again...'
    },
    error500: {
      title: '500 SERVER ERROR',
      description: 'Oops! Something went wrong on our end. Our team has been notified and is working to fix this issue.'
    },
    error403: {
      title: '403 FORBIDDEN',
      description: 'Access denied. You don\'t have permission to view this page.'
    },
    defaultError: {
      title: 'ERROR',
      description: 'An unexpected error occurred. Please try again later.'
    },
    backButtonText: 'Back to Home',
    backgroundPatternImage: '/assets/img/Green eye.gif',
    arrowIcon: '/assets/svg/arrow-red.svg',
    images: [],
    links: []
  },
  faqIntro: {
    starCount: 7,
    records: [
      {
        id: 'record-1',
        imageUrl: '/assets/img/Playlist R&B Retro Nostalgia.png',
        spotifyUrl: 'https://open.spotify.com/'
      }
    ],
    images: [],
    links: []
  },
  partners: {
    pageTitle: 'Our Partners',
    pageSubtitle: 'Building the future of music investment together',
    partners: [],
    images: [],
    links: []
  },
  collaboratives: {
    heading: 'Collaboratives',
    collaboratives: [],
    images: [],
    links: []
  },
};

async function main() {
  const dbPath = process.env.DB_PATH || './data.db';
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      token_version INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT UNIQUE NOT NULL,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TRIGGER IF NOT EXISTS content_updated_at
    AFTER UPDATE ON content
    FOR EACH ROW BEGIN
      UPDATE content SET updated_at = datetime('now') WHERE id = OLD.id;
    END;
  `);

  const adminExists = db.prepare('SELECT id FROM admin_users WHERE username = ?').get('admin');
  if (!adminExists) {
    const tmpPass = process.env.ADMIN_INIT_PASSWORD || 'ChangeMeNow!123';
    const hash = await bcrypt.hash(tmpPass, 12);
    db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run('admin', hash);
    console.log('Seeded admin user "admin" with temporary password from ADMIN_INIT_PASSWORD.');
  }

  const homeExists = db.prepare('SELECT id FROM content WHERE section = ?').get('home');
  if (!homeExists) {
    db.prepare('INSERT INTO content (section, data) VALUES (?, ?)')
      .run('home', JSON.stringify({ text: 'Welcome to Hardwey LLC', images: [], links: [] }));
    console.log('Seeded content section "home".');
  }

  // Seed remaining known sections if missing
  for (const key of SECTION_KEYS) {
    const exists = db.prepare('SELECT id FROM content WHERE section = ?').get(key);
    if (!exists) {
      const tpl = SECTION_TEMPLATES[key] || { text: '', images: [], links: [] };
      db.prepare('INSERT INTO content (section, data) VALUES (?, ?)').run(key, JSON.stringify(tpl));
      console.log(`Seeded content section "${key}".`);
    }
  }

  db.close();
  console.log('DB init completed.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


