/**
 * AUTONOMY WALKS - SEED DATA & EDITORIAL ARCHIVE
 * Inspired by Kinfolk Aesthetics & Public Journalism
 */

const DEFAULT_DATA = {
  // Hero Interactive Stories (Used in Hero section bottom-right selector)
  heroStories: [
    {
      id: 'hero-1',
      kicker: '01 • ISSUE FIFTY-NINE • LEAD ESSAY',
      title: 'THE SCENT OF CLEAN',
      subtitle: 'The hidden forces—and people—shaping our idea of “clean.”',
      category: 'Arts & Culture',
      image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1920&q=80',
      articleId: 'art-1'
    },
    {
      id: 'hero-2',
      kicker: '02 • MUSIC & DIALOGUE',
      title: 'JESSIE WARE',
      subtitle: 'The British singer on joy, perfectionism, and embracing life’s beautiful mess.',
      category: 'Music & Culture',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1920&q=80',
      articleId: 'art-2'
    },
    {
      id: 'hero-3',
      kicker: '03 • SPACES & SANCTUARY',
      title: 'HOME TOUR: STERREKOPJE',
      subtitle: 'A visit to a restorative sanctuary farm nestled in Franschhoek.',
      category: 'Interiors & Living',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
      articleId: 'art-3'
    },
    {
      id: 'hero-4',
      kicker: '04 • FASHION & CRAFT',
      title: 'SPIN CYCLE',
      subtitle: 'A layering of silhouettes built from natural textures and everyday ritual.',
      category: 'Fashion & Form',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1920&q=80',
      articleId: 'art-4'
    }
  ],

  // Main Articles (Inside Issue 59 / Editorial Series)
  articles: [
    {
      id: 'art-1',
      issue: 'Issue 59',
      category: 'Arts & Culture',
      title: 'COMING CLEAN',
      headline: 'The Scent of Clean: How Ritual Shapes Modern Consciousness',
      author: 'Tara Joshi',
      photographer: 'Raphaëlle Orphelin',
      stylist: 'Aartthie Mahakuperan',
      authorImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      readTime: '6 min read',
      date: 'Issue Fifty-Nine',
      image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
      ],
      excerpt: 'From public baths in ancient antiquity to modern minimalist sanctuaries, our cultural obsession with purity reflects deeper anxieties regarding control, ritual, and civic renewal.',
      quote: '“We believe that a poem can paint a picture, and a picture can form a piece of furniture. That inspiration is where journalism and aesthetic truth intervene.”',
      content: `From ancient myth to modern psychology—and in much of the literature in between—the act of confession has been depicted as a moral and physical release. The burden of a guilty conscience, we are told, can be lightened by "coming clean," liberating you from the torture of living deceitfully.\n\nIn Fyodor Dostoevsky’s most famous work, Crime and Punishment, for example, the murderer Raskolnikov is punished with ferocious paranoia and physical illness as he attempts to conceal his misdeeds. "Thought tormented him," Dostoevsky writes, and eventually Raskolnikov realizes: "I don’t want to go on living like this." When he finally admits to his crime in the public square, the torture of the soul is resolved.\n\nIn contemporary democratic theory, public transparency serves an identical cathartic function. When institutions conceal procedural errors or state subsidies behind closed doors, civic trust erodes into pervasive cynicism. Open discourse, by contrast, acts as the ultimate disinfectant for society.`,
      likes: 342,
      comments: [
        { name: 'Priya Sundaram', text: 'The parallel between physical cleanliness and institutional transparency is brilliant.', time: '2 hours ago' },
        { name: 'Marcus Vance', text: 'The typography and aesthetic here elevate the discourse to another level.', time: '5 hours ago' }
      ]
    },
    {
      id: 'art-2',
      issue: 'Issue 59',
      category: 'Music & Culture',
      title: 'JESSIE WARE',
      headline: 'Jessie Ware: On Embracing Perfection and Life’s Beautiful Chaos',
      author: 'Francis Martin',
      photographer: 'Jayne Fowler',
      stylist: 'Solace London',
      authorImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      readTime: '8 min read',
      date: 'Issue Fifty-Nine',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
      ],
      excerpt: 'The acclaimed artist reflects on motherhood, sonic ambition, and why vulnerability remains the cornerstone of enduring visual and musical expression.',
      quote: '“I present as somebody that has it all and is having a wonderful time, but there is mess. And in that mess lives the music.”',
      content: `What makes Superbloom feel so special: yes, there’s the raunchy fun—notably on "Ride," which interpolates the theme from The Good, the Bad and the Ugly into a brash, chubby earworm, and "My Valentine," where she commands a lover who wants "all the way up, up, up"—but it also sounds like an artist stepping up a level.\n\nThis is cosmic world-building through a rich orchestration of flutes and strings, taut, glossy bass lines, and huge, celestial vocal harmonies ("I’m always layering an extra vocal—there were points where we’d already have like 80 backing vocals, and I’d say, ‘Let’s have another one!’").\n\n"It’s about highlighting the imperfections, but also enjoying the abundance and enjoying where I’m at," she says. "I’m enjoying doing the most on a vocal. I’m enjoying getting that flute player that I’ve always said I wanted; I’m enjoying that I can revel in all this, because I’ve earned this world that I’ve created."`,
      likes: 512,
      comments: [
        { name: 'Elena Rostova', text: 'A masterclass in editorial portraiture and candid storytelling.', time: '1 day ago' }
      ]
    },
    {
      id: 'art-3',
      issue: 'Issue 59',
      category: 'Interiors',
      title: 'CULT ROOMS',
      headline: 'Cult Rooms: The Architecture of Contemplative Spaces',
      author: 'Sneha Verma',
      photographer: 'Aarav Mehta',
      stylist: 'Studio Kinfolk',
      authorImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
      readTime: '5 min read',
      date: 'Issue Fifty-Nine',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'
      ],
      excerpt: 'Examining monastic minimalism, raw earthen plaster, and how intentional spatial proportions foster emotional equilibrium in chaotic metropolitan landscapes.',
      quote: '“A room is not merely four walls; it is a canvas of light, shadow, and silence.”',
      content: `The spaces we inhabit quietly shape the cadence of our thoughts. In an era dominated by hyper-saturated screens and sensory bombardment, the domestic sanctuary has emerged as the last bastion of genuine stillness.\n\nFrom the wabi-sabi tea houses of Kyoto to modernist stone pavilions in the Swiss Alps, contemplative architecture prioritizes tactile honesty: unlacquered brass that patinas with touch, limewashed masonry that breathes, and raw linen that drapes with casual grace.\n\nWhen we strip away ornamental noise, space itself becomes the primary luxury.`,
      likes: 429,
      comments: [
        { name: 'Arjan Das', text: 'This space design ethos aligns perfectly with the philosophy of mindful living.', time: '2 days ago' }
      ]
    },
    {
      id: 'art-4',
      issue: 'Issue 59',
      category: 'Fashion',
      title: 'DIRTY TALK',
      headline: 'Material Integrity: Sustainable Textiles & Raw Form',
      author: 'Riya Kapoor',
      photographer: 'Solace London',
      stylist: 'Atelier Walks',
      authorImg: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      readTime: '6 min read',
      date: 'Issue Fifty-Nine',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
      ],
      excerpt: 'Why the future of mindful couture lies in raw plant fibers, regenerative agricultural wool, and garments engineered to outlast cyclical trends.',
      quote: '“Style is an attitude of conservation, discernment, and personal sovereignty.”',
      content: `Fast fashion is the aesthetic equivalent of disposable consumption. True craftsmanship, by contrast, celebrates the durability of natural fibers and the human hands that spin them.\n\nBy embracing heirloom pieces that age with character, we reclaim our relationship with the objects that touch our skin every day.`,
      likes: 278,
      comments: []
    },
    {
      id: 'art-5',
      issue: 'Issue 59',
      category: 'Society',
      title: 'ODD JOBS',
      headline: 'The Secret Lives of Specialized Artisans and Restorers',
      author: 'Dr. Sameer Dutta',
      photographer: 'Raphaëlle Orphelin',
      stylist: 'Editorial Board',
      authorImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      readTime: '7 min read',
      date: 'Issue Fifty-Nine',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80'
      ],
      excerpt: 'Profiles of master bookbinders, vintage analog synthesizer restorers, and botanical seed collectors preserving delicate cultural heritage.',
      quote: '“To master an odd craft is to protect a sliver of human memory from algorithmic obsolescence.”',
      content: `In an economic landscape dominated by automated workflows, the meticulous labor of the manual artisan takes on an almost sacred importance.\n\nThese craftsmen spend decades understanding the grain of parchment, the resonance of copper coils, and the germination cycles of endangered flora. Their dedication reminds us of the profound dignity of focused human vocation.`,
      likes: 388,
      comments: []
    }
  ],

  // Thought Starters / Highlights (PDF Page 7)
  thoughtStarters: [
    {
      id: 'ts-1',
      title: 'IS CULTURE DEAD?',
      subtitle: 'Writer W. David Marx thinks so. An investigation into algorithmic homogenization.',
      category: 'Arts & Culture, Issue 59',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80',
      articleId: 'art-1'
    },
    {
      id: 'ts-2',
      title: 'IN PRAISE OF GARLIC',
      subtitle: 'The culinary, historical, and ritual uses of a versatile botanical bulb.',
      category: 'Food & Botany, Issue 59',
      image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=400&q=80',
      articleId: 'art-3'
    },
    {
      id: 'ts-3',
      title: 'THE ARCHITECTURE OF DISSENT',
      subtitle: 'How street posters and underground print shops fuel political breakthroughs.',
      category: 'Politics & Society, Issue 59',
      image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=400&q=80',
      articleId: 'art-2'
    }
  ],

  // Comic Series & Curated Editions (PDF Page 9)
  comicSeries: [
    {
      id: 'cs-1',
      tag: 'SUBSCRIBE',
      title: 'The Print Edition',
      subtitle: 'Receive our quarterly collectible volume delivered directly to your door.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      ctaText: 'See More'
    },
    {
      id: 'cs-2',
      tag: 'SHOP',
      title: 'The Art of Autonomy',
      subtitle: 'Hardcover monographs, fine-art silkscreen editions, and gallery prints.',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
      ctaText: 'See More'
    },
    {
      id: 'cs-3',
      tag: 'READ',
      title: 'Visual Comic Archive',
      subtitle: 'Illustrated political satire, serialized graphic essays, and comic journalism.',
      image: 'https://images.unsplash.com/photo-1507842229451-70b99195b072?auto=format&fit=crop&w=800&q=80',
      ctaText: 'See More'
    }
  ],

  // Political Campaigns & Picks (PDF Page 4)
  campaigns: [
    {
      id: 'camp-1',
      title: 'HOPE FOR ALL',
      category: 'Democracy',
      subtitle: 'Berlin Grassroots Assembly • Issue 59',
      image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=600&q=80',
      description: 'A pan-European grassroots civic movement mobilizing working-class districts for universal healthcare, housing rights, and participatory municipal governance.',
      likes: 284
    },
    {
      id: 'camp-2',
      title: 'VOTE FOR CHANGE',
      category: 'Democracy',
      subtitle: 'Youth Civic Mobilization • Paris',
      image: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=600&q=80',
      description: 'Striking silkscreen posters created by art students to advocate for lowered voting age and mandatory environmental audits for all corporate campaign donations.',
      likes: 310
    },
    {
      id: 'camp-3',
      title: 'ECOLOGICAL JUSTICE',
      category: 'Ecology',
      subtitle: 'Global Climate Coalition • Franschhoek',
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      description: 'Visual documentation of youth-led assemblies across coastal districts protesting industrial wetland destruction and fossil subsidies.',
      likes: 195
    },
    {
      id: 'camp-4',
      title: 'VOICES OF LABOR',
      category: 'Labor',
      subtitle: 'Solidarity Network • Chicago',
      image: 'https://images.unsplash.com/photo-1572945753563-804956783694?auto=format&fit=crop&w=600&q=80',
      description: 'Photojournalism series capturing modern warehouse and gig-economy workers organizing autonomous trade unions for fair algorithmic oversight.',
      likes: 247
    },
    {
      id: 'camp-5',
      title: 'FREE EXPRESSION',
      category: 'Archive',
      subtitle: 'Anti-Censorship League • 1968–2026',
      image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=600&q=80',
      description: 'Curated historical and contemporary poster art celebrating investigative whistleblowers and unyielding freedom of the press.',
      likes: 362
    }
  ],

  // Live Art & Masterpiece Auctions
  auctions: [
    {
      id: 'auc-1',
      title: 'The Silent Thoughts',
      artist: 'Aarav Mehta',
      medium: 'Acrylic on Linen (48x36 in)',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
      currentBid: 145000,
      totalBids: 14,
      remainingSeconds: 8130,
      bidHistory: [
        { bidder: 'Karan M.', amount: 145000, time: '3 mins ago' },
        { bidder: 'Siddharth R.', amount: 138000, time: '14 mins ago' },
        { bidder: 'Aisha V.', amount: 125000, time: '40 mins ago' }
      ]
    },
    {
      id: 'auc-2',
      title: 'Golden Reflection',
      artist: 'Maya Sen',
      medium: 'Oil on Canvas (36x30 in)',
      image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=800&q=80',
      currentBid: 78000,
      totalBids: 9,
      remainingSeconds: 6012,
      bidHistory: [
        { bidder: 'Vikram S.', amount: 78000, time: '8 mins ago' },
        { bidder: 'Elena R.', amount: 72000, time: '22 mins ago' }
      ]
    },
    {
      id: 'auc-3',
      title: 'Freedom Unbound',
      artist: 'Prof. Arjan Das',
      medium: 'Mixed Media on Linen',
      image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=800&q=80',
      currentBid: 35000,
      totalBids: 6,
      remainingSeconds: 12165,
      bidHistory: [
        { bidder: 'Rohan G.', amount: 35000, time: '12 mins ago' },
        { bidder: 'Naina P.', amount: 30000, time: '1 hour ago' }
      ]
    },
    {
      id: 'auc-4',
      title: 'The Village Morning',
      artist: 'Dr. Karan Malhotra',
      medium: 'Watercolor on Handmade Paper',
      image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80',
      currentBid: 28000,
      totalBids: 11,
      remainingSeconds: 7518,
      bidHistory: [
        { bidder: 'Meera I.', amount: 28000, time: '5 mins ago' },
        { bidder: 'Tanvi S.', amount: 25000, time: '35 mins ago' }
      ]
    }
  ],

  // Podcasts / Audio Dialogue
  podcasts: [
    {
      id: 'pod-1',
      episode: 'EPISODE 22',
      duration: '45:20',
      title: 'The Future of Journalism in the Age of AI',
      host: 'With Ananya Sen, Senior Investigative Journalist',
      cover: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'pod-2',
      episode: 'EPISODE 21',
      duration: '38:15',
      title: 'Understanding Elections, Data and Voters',
      host: 'With Dr. Sameer Dutta & Election Analysts',
      cover: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'pod-3',
      episode: 'EPISODE 20',
      duration: '42:50',
      title: 'Climate Change and Human Responsibility',
      host: 'With Sneha Verma & Ecological Researchers',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'pod-4',
      episode: 'EPISODE 19',
      duration: '50:10',
      title: 'Art, Identity & Expression in Modern World',
      host: 'With Riya Kapoor, Visual Arts Critic',
      cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80'
    }
  ],

  // Opinion Polls & Citizen Voice
  polls: [
    {
      id: 'poll-1',
      question: 'Should AI-generated journalistic content require mandatory provenance watermarks?',
      category: 'MEDIA ETHICS',
      totalVotes: 1248,
      options: [
        { text: 'Yes, mandatory by law with penal enforcement', votes: 812 },
        { text: 'Voluntary industry self-regulation codes', votes: 310 },
        { text: 'No regulation needed (reader discernment)', votes: 126 }
      ]
    },
    {
      id: 'poll-2',
      question: 'What is the most urgent institutional priority for global democratic renewal in 2026?',
      category: 'ELECTORAL POLICY',
      totalVotes: 986,
      options: [
        { text: 'Transparent digital political campaign financing', votes: 492 },
        { text: 'Independent non-partisan citizen assemblies', votes: 345 },
        { text: 'Universal mail-in and accessible early voting', votes: 149 }
      ]
    }
  ],

  // Academic & Research Repository
  researchPapers: [
    {
      id: 'paper-1',
      title: 'The Rise of Populism in 21st Century Democracies',
      author: 'Dr. Sameer Dutta',
      affiliation: 'Institute for Democratic Studies',
      category: 'Politics',
      date: 'June 2026',
      abstract: 'An empirical examination of socioeconomic disenfranchisement, algorithmic polarization, and the erosion of institutional trust across 24 OECD electoral cycles between 2004 and 2024.',
      content: 'Key Findings:\n1. Economic precarity alone does not predict populist realignment; status anxiety and perceived cultural obsolescence act as primary catalysts.\n2. Hyper-targeted recommendation algorithms amplify affective polarization by 34% compared to linear media diets.\n3. Institutional counter-measures such as sortition-based citizen juries consistently depolarize controversial policy debates.'
    },
    {
      id: 'paper-2',
      title: 'Impact of Social Media on Youth Mindset & Civic Engagement',
      author: 'Dr. Meera Iyer',
      affiliation: 'Center for Behavioral Sociology',
      category: 'Society',
      date: 'May 2026',
      abstract: 'Quantitative survey measuring cognitive fatigue, information veracity evaluation, and political agency among 18-25 year olds engaging with short-form video discourse.',
      content: 'Key Findings:\n1. Short-form algorithmic feeds accelerate awareness of crisis events while reducing deep structural comprehension by 28%.\n2. Creative visual remixing empowers youth to articulate political grievances outside traditional editorial gatekeepers.\n3. Media literacy programs focused on source provenance significantly improve critical verification behaviors.'
    },
    {
      id: 'paper-3',
      title: 'Sustainable Cities: A Global Comparative Perspective',
      author: 'Prof. Arjan Das',
      affiliation: 'Urban Ecology Research Lab',
      category: 'Environment',
      date: 'April 2026',
      abstract: 'Analyzing decentralized transit infrastructure, permeable urban surfaces, and high-density micro-housing policies across Singapore, Medellin, and Vienna.',
      content: 'Key Findings:\n1. 15-minute municipal design reduces per capita vehicular emissions by up to 41%.\n2. Sponge-city bioswales mitigate urban flood vulnerability by 62% during extreme monsoon events.\n3. Municipal land value capture funds sustainable transit without regressive property taxation.'
    },
    {
      id: 'paper-4',
      title: 'Economics of Green Technology & Fiscal Incentives',
      author: 'Dr. Karan Malhotra',
      affiliation: 'Department of Applied Macroeconomics',
      category: 'Economics',
      date: 'March 2026',
      abstract: 'A longitudinal cost-benefit analysis of sovereign green bond yields, carbon dividend mechanisms, and domestic solar manufacturing subsidies.',
      content: 'Key Findings:\n1. Targeted sovereign guarantees reduce the weighted average cost of capital (WACC) for green infrastructure by 220 basis points.\n2. Carbon dividends redistributed progressively to lower-income deciles eliminate regressive energy price shock resistance.\n3. Domestic content requirements require balanced bilateral trade agreements to avoid supply-chain bottlenecks.'
    }
  ],

  // Scholarships & Fellowships
  scholarships: [
    {
      id: 'sch-1',
      title: 'Young Journalist Fellowship 2026',
      amount: '₹ 150,000',
      deadline: '30 Sep 2026',
      category: 'Journalism',
      description: 'Full research stipend for early-career reporters investigating grassroots environmental justice, rural governance, and civic innovations.'
    },
    {
      id: 'sch-2',
      title: 'Art & Design Excellence Award',
      amount: '₹ 75,000',
      deadline: '15 Oct 2026',
      category: 'Visual Arts',
      description: 'Support grant for visual artists producing public installation works, anti-war iconography, or community mural projects.'
    },
    {
      id: 'sch-3',
      title: 'Research Grant for Undergraduates',
      amount: '₹ 45,000',
      deadline: '18 Oct 2026',
      category: 'Academic Research',
      description: 'Seed funding for university students conducting field surveys in sociology, political economy, or public policy reform.'
    },
    {
      id: 'sch-4',
      title: 'Women in Leadership Scholarship',
      amount: '₹ 60,000',
      deadline: '26 Oct 2026',
      category: 'Civic Leadership',
      description: 'Mentorship and financial award empowering women and non-binary grassroots organizers spearheading local advocacy campaigns.'
    }
  ],

  // Science & Technology Essays (The Human Future)
  scienceTech: [
    {
      id: 'sci-1',
      title: 'THE NEURAL HORIZON',
      headline: 'Brain-Computer Interfaces and the Philosophical Limits of Consciousness',
      category: 'Neural Systems',
      author: 'Dr. Julian Sterling',
      affiliation: 'Center for Cognitive Neurotechnology',
      readTime: '7 min read',
      date: 'Aug 2026',
      image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'As high-bandwidth neural implants transition from clinical laboratories to commercial prototypes, we confront fundamental inquiries about digital agency, cognitive sovereignty, and the boundary between biological mind and algorithmic synthesis.',
      quote: '“To augment the mind without safeguarding its sovereignty is to build an empire of glass.”',
      content: `The direct interface between human neocortex and synthetic computational substrates is no longer speculative science fiction. With sub-millimeter wireless micro-electrode arrays achieving multi-thousand-channel recordings in primate trials, human clinical applications for sensory restoration and memory augmentation are accelerating.\n\nYet the ethical questions lag dangerously behind hardware deployment. When a neural implant uses predictive machine learning to complete a motor intent or translate inner speech into text, who possesses ultimate authorship over the thought?\n\nCognitive liberty must become a foundational human right in the twenty-first century, codified before proprietary corporate ecosystems monopolize neural telemetry.`,
      likes: 419,
      comments: [
        { name: 'Dr. Sameer Dutta', text: 'Cognitive sovereignty is the civil rights battleground of the next fifty years.', time: '3 hours ago' }
      ]
    },
    {
      id: 'sci-2',
      title: 'QUANTUM PROVENANCE',
      headline: 'Post-Quantum Cryptography & The Preservation of Public Truth',
      category: 'Cryptography',
      author: 'Aanya Roy & Dr. Elena Rostova',
      affiliation: 'Public Cryptography Institute',
      readTime: '6 min read',
      date: 'Aug 2026',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'How lattice-based zero-knowledge proofs and decentralized verification protocols ensure investigative journalism and whistleblower leaks remain mathematically tamper-proof against state-level surveillance.',
      quote: '“Cryptography is the ultimate asymmetric equalizer in an age of total surveillance.”',
      content: `The advent of fault-tolerant quantum computing threatens to shatter asymmetric RSA and elliptic-curve cryptography. In response, open-source researchers are deploying lattice-based cryptographic primitives that remain impenetrable even to million-qubit quantum processors.\n\nFor investigative journalists operating under authoritarian regimes, quantum provenance protocols allow immutable evidentiary timestamping without revealing source identities or location metadata.\n\nMath, rather than institutional goodwill, becomes the permanent guardian of historical veracity.`,
      likes: 382,
      comments: []
    },
    {
      id: 'sci-3',
      title: 'BIOMIMETIC ARCHITECTURE',
      headline: 'Living Mycelium Scaffolding & Self-Healing Urban Structures',
      category: 'Biotechnology',
      author: 'Prof. Arjan Das',
      affiliation: 'Institute of Sustainable Biomaterials',
      readTime: '5 min read',
      date: 'Jul 2026',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Replacing carbon-heavy concrete with living fungal composites that capture atmospheric carbon, self-repair fissures, and naturally biodegrade at the end of their architectural lifecycle.',
      quote: '“We do not need to dominate nature to build our shelters; we need to grow them.”',
      content: `Concrete alone accounts for nearly 8% of global greenhouse emissions. Modern biochemical labs are pioneering engineered living materials (ELMs)—structural composites infused with fungal mycelium and cyanobacteria that actively sequesters atmospheric carbon as it cures.\n\nWhen micro-fissures develop due to seismic stress or thermal expansion, dormant spores within the bio-composite activate upon moisture exposure, precipitating calcium carbonate to seal cracks autonomously.\n\nCities of the next century will not be constructed from dead quarries; they will be cultivated in living bio-foundries.`,
      likes: 294,
      comments: []
    },
    {
      id: 'sci-4',
      title: 'THE ALGORITHMIC COMMONS',
      headline: 'Open-Weight Foundation Models as Democratic Public Utilities',
      category: 'Artificial Intelligence',
      author: 'Marcus Vance',
      affiliation: 'Open Foundation Society',
      readTime: '8 min read',
      date: 'Jul 2026',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Why democratized access to frontier artificial intelligence must be structured like public libraries and municipal water grids rather than closed monopolistic walled gardens.',
      quote: '“Universal intelligence should belong to the global commons, not private gatekeepers.”',
      content: `Artificial intelligence models represent the cumulative synthesis of human cultural and scientific knowledge. Permitting a tiny cartel of closed-source tech conglomerates to act as rent-seeking arbiters of this intelligence is an existential threat to democratic autonomy.\n\nBy funding open-weight foundation models through decentralized public compute consortia, society ensures researchers, journalists, and civic activists possess unmoderated, transparent tools for discovery.\n\nDemocratic sovereignty requires technological sovereignty.`,
      likes: 512,
      comments: [
        { name: 'Riya Kapoor', text: 'A compelling blueprint for the democratization of frontier tech.', time: '1 day ago' }
      ]
    }
  ]
};

if (typeof window !== 'undefined') window.DEFAULT_DATA = DEFAULT_DATA;
if (typeof global !== 'undefined') global.DEFAULT_DATA = DEFAULT_DATA;
if (typeof module !== 'undefined') module.exports = DEFAULT_DATA;
