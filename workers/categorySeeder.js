const axios = require('axios');

const data = [
  {
    image: 'https://realpython.com/static/social-default-image.5e1aa4786b3a.png',
    title: 'Real Python is giving away free Python programming courses',
    tags: ['programming'],
    store: 'Real Python',
    categories: 'Education',
    dealLink: 'https://realpython.com/free-courses-march-2020',
    description: `Use the deal link to obtain the access code.
  Real Python is one of the best source to learn Python in depth.Their video courses are usually premium, now they are offering redeem code for few of their video courses.`,
    dealType: 'freebie',
  }, {
    image: 'https://www.ncell.axiata.com/Templates/ncell/images/fLogo.png',
    title: '120% Bonus on Ncell Recharge',
    tags: ['topup'],
    store: 'Ncell',
    categories: 'Recharge & Utility Payments',
    dealLink: 'https://www.ncell.axiata.com/Latest-Offers/StaySafe',
    description: 'Bonus balance can be used for 3 days to call and message within Ncell network or to surf internet.',
    dealType: 'bonus',
  }, {
    image: 'https://m.media-amazon.com/images/G/01/AudibleBlisseyReactWebApp/images/headline_3._CB1584461446_.png',
    title: 'Audible audio books free for children & teens during Covid19 pandemic',
    store: 'Audible',
    categories: 'Books & Magazine',
    dealLink: 'https://stories.audible.com/start-listen',
    description: 'Audible is providing unlimited streaming of hundreds of titles for kids and families for free with selections available in six languages.',
    dealType: 'freebie',
  }, {
    image: 'https://everpath-course-content.s3-accelerate.amazonaws.com/instructor%2Fgina_moz_com_qfzpqj%2Fpublic%2FFree-training-for-all-Roger-Banner.1584990400647.jpg',
    title: 'Moz Academy is giving away SEO courses until May 31',
    couponCode: 'wegotthis',
    store: 'Moz',
    categories: 'Education',
    dealLink: 'https://academy.moz.com/',
    description: `Now through May 31, Moz is making courses in Moz Academy free.
Just log in to your moz.com account (or sign up for free if you don’t have one). Use the code “wegotthis” at checkout to redeem your training.`,
    dealType: 'freebie',
  }, {
    image: 'https://cdn.shopify.com/shopify-marketing_assets/static/share-image-generic.jpg',
    title: 'Shopify trial extended to 90 days (from 30 days), no credit card required',
    store: 'Shopify',
    categories: 'Services',
    dealLink: 'https://www.shopify.com/free-trial',
    description: 'Shopify has extended the trial period from 30 days to 90 days. No credit card required.',
    dealType: 'freebie',
  }, {
    image: 'https://awsmp-logos.s3.amazonaws.com/84e08b3d-ff70-4afd-8d39-2aab15d1e5cf/22ea0da576072054990d4f8146010760.png',
    title: 'All PluralSight courses are free for the month of April',
    store: 'PluralSight',
    categories: 'Education',
    dealStarts: '2020-04-01',
    dealExpires: '2020-04-30',
    dealLink: 'https://www.pluralsight.com/offer/2020/free-april-month',
    description: 'PluralSight is making all 7,000+ expert-led video courses completely free for the month of April. No credit required for sign up.',
    dealType: 'freebie',
  }, {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Skillshare_logo_2020.svg/1200px-Skillshare_logo_2020.svg.png',
    title: 'SkillShare free premium membership for 2 months for students',
    store: 'SkillShare',
    categories: 'Education',
    dealLink: 'https://www.skillshare.com/schoolverification/',
    description: `Students affected by COVID-19 can access thousands of inspiring classes, on topics including illustration, design, photography, and more with a free premium membership.

Required .edu email as student proof.`,
    dealType: 'freebie',
  }, {
    image: 'https://ia801407.us.archive.org/16/items/nationalemergencylibrary/NEL-heart-noURL.jpg',
    title: 'National Emergency Library by Internet Archive',
    store: 'Internet Archive',
    categories: ['Education', 'Books & Magazine'],
    dealLink: 'https://archive.org/details/nationalemergencylibrary',
    description: 'National Emergency Library is a collection of books that supports emergency remote teaching, research, independent scholarship, and intellectual stimulation while universities, schools, training centers, and libraries are closed.',
    dealType: 'freebie',
  }, {
    image: 'https://connect-prd-cdn.unity.com/cdn-origin/images/learn-meta-hero.jpg',
    title: 'Unity learn is giving away free unity learn premium for 3 month',
    store: 'Unity',
    categories: ['Education', 'Gaming'],
    dealStarts: '2020-03-19',
    dealExpires: '2020-06-20',
    dealLink: 'https://learn.unity.com/',
    description: `Unity is real-time development platform that enables you to create 3D, 2D VR & AR visualizations for Games, Auto, Transportation, Film, Animation and much more.

For a limited time, Unity is giving away premium learning access.`,
    dealType: 'freebie',
  }, {
    image: 'https://media.downdogapp.com/asset/blue_logo_91727a0c_server.png',
    title: 'Down Dog yoga/workout apps are free until May 1st',
    tags: ['yoga', 'workout', 'ios', 'android'],
    categories: ['Sports & Fitness'],
    dealLink: 'https://twitter.com/downdogapp/status/1243524188184461312?s=21',
    description: `Down Dog is making all of their apps - Down Dog, Yoga for Beginners, HIIT, Barre, and 7 Minute Workout - completely free until May 1st.
In response to the many school closures taking place, they are also offering free access until July 1st for all students and teachers (K-12 and college). To access the free school membership, please register your school's domain by visiting downdogapp.com/schools.
Down Dog are also extending free access until July 1 for all healthcare professionals so we can help those who are helping us. Please visit downdogapp.com/healthcare to register your work healthcare domain.`,
    dealType: 'freebie',
  }, {
    image: 'https://www.goldsgym.com/wp-content/uploads/sites/1/2019/08/Company-Picrure-300x300.png',
    title: 'Gold\'s Gym guided workout videos',
    store: 'Gold\s Gym',
    categories: ['Sports & Fitness'],
    dealLink: 'https://www.goldsgym.com/anywhere/',
    description: 'Keep your fitness routine strong with unlimited access to Gold’s Gym on-demand video workouts, Les Mills on-demand video workouts, or in-app audio and video-guided workouts with GOLD’S AMP™*',
    dealType: 'freebie',
  }, {
    image: 'https://c.static-nike.com/a/images/f_auto/dpr_1.0/w_912,c_limit/58e3c7f6-168c-4ccf-8d1a-142de8bdb122/nike-training-club-app-home-workouts-more.jpg',
    title: 'Nike Training Club app premium free access',
    store: 'Nike',
    tags: ['yoga', 'workout'],
    categories: ['Sports & Fitness'],
    dealLink: 'https://www.nike.com/ntc-app',
    description: 'The Nike Training Club app helps you reach your fitness goals with expertly designed workouts from our world-class Nike Master Trainers. NTC provides free workouts for everything from bodyweight-only sessions, invigorating yoga classes, targeted training programs, and full-equipment home workouts for all fitness levels.',
    dealType: 'freebie',
  }, {
    image: 'https://www.siriusxm.com/sxm/img/global/header/sxm-logo.png',
    title: 'SiriusXM free streaming until May 15',
    store: 'SiriusXM',
    tags: ['music', 'radio', 'sports'],
    categories: ['Sports & Fitness'],
    dealLink: 'https://www.nike.com/ntc-app',
    description: 'The Nike Training Club app helps you reach your fitness goals with expertly designed workouts from our world-class Nike Master Trainers. NTC provides free workouts for everything from bodyweight-only sessions, invigorating yoga classes, targeted training programs, and full-equipment home workouts for all fitness levels.',
    dealType: 'freebie',
  }, {
    image: 'https://www.siriusxm.com/sxm/img/global/header/sxm-logo.png',
    title: 'SiriusXM free streaming until May 15',
    store: 'SiriusXM',
    tags: ['music', 'radio', 'sports'],
    categories: ['Music, Movie & Entertainment'],
    dealExpires: '2020-05-15',
    dealLink: 'https://player.siriusxm.com/home/foryou',
    description: 'Go to the provided link and click \'free preview\' and enjoy music, sports and more on SiriusXM.',
    dealType: 'freebie',
  }, {
    image: 'https://s3.amazonaws.com/thinkific-import/59347/5DhB88HpRHyunmgIDXVg_packt-logo.png',
    title: 'Paktpub workshop access for 1 year',
    store: 'Paktpub',
    tags: ['programming', 'webdev', 'datascience'],
    categories: ['Education'],
    dealExpires: '2020-05-31',
    dealLink: 'https://courses.packtpub.com/pages/free',
    description: 'One year of access to any interactive workshop is currently available at no charge for registered Packt users. Offer expires May 31st, 2020.',
    dealType: 'freebie',
  }, {
    image: 'https://pbs.twimg.com/profile_images/803722648198881280/5hV-C1mN.jpg',
    title: 'Open Library by Internet Archive',
    store: 'Internet Archive',
    categories: ['Books & Magazine'],
    dealLink: 'https://openlibrary.org/',
    description: 'Open Library is an open, editable library catalog, building towards a web page for every book ever published',
    dealType: 'freebie',
  }, {
    image: 'https://m.media-amazon.com/images/G/01/digital/video/sonata/US_SVOD_FVOD_MULTI_C19/6dde35b8-bc89-497d-ac5f-648d304347f6._UR3000,600_SX1500_FMwebp_.jpg',
    title: 'Amazon is offering kids shows for free',
    store: 'Amazon',
    categories: ['Music, Movie & Entertainment'],
    dealLink: 'https://amzn.to/2wBiVvq',
    description: 'Kids shows are free to stream on Amazon until Covid19 pandemic is over',
    dealType: 'freebie',
  }, {
    image: 'https://www.k7computing.com/img/k7-logo.png',
    title: 'K7 Antivirus unconditionally free until Covid19 pandemic is over',
    tags: ['ios', 'android', 'pc', 'desktop'],
    store: 'K7',
    categories: ['Computer, Software & Electronics'],
    dealLink: 'https://www.k7computing.com/us/k7cares-covid',
    description: 'K7 Antivirus for all platforms including PC, Android and iOS is free until Covid19 pandemic is over.',
    dealType: 'freebie',
  }, {
    image: 'https://upload.wikimedia.org/wikipedia/en/7/77/Assassins_Creed_2_Box_Art.JPG',
    title: 'Ubisoft Assassin\'s Creed II free on Uplay',
    store: 'Uplay',
    categories: ['Gaming'],
    dealStarts: '2020-04-14',
    dealExpires: '2020-04-17',
    dealLink: 'https://register.ubisoft.com/assassins-creed-2/en-US',
    description: 'Assassin\'s creed is available on Uplay for free for a limited time.',
    dealType: 'freebie',
  }, {
    image: 'https://www.trendmicro.com/content/dam/trendmicro/global/en/global/logo/logo-desktop.png',
    title: 'Trend Micro Antivirus 6 months Free',
    tags: ['pc', 'mac'],
    store: 'Trend Micro',
    categories: ['Computer, Software & Electronics'],
    dealLink: 'https://resources.trendmicro.com/Work-From-Home-Assistance-Program.html',
    description: 'Trend Micro Maximum Security product for either their personal Microsoft® Windows® or Mac computer (one device per download) free for 6 months.',
    dealType: 'freebie',
  }, {
    image: 'https://gadgetstouse.com/wp-content/uploads/2018/03/Hungama-Music.jpg',
    title: 'Hungama Music Pro 1 month free for Ncell users',
    store: 'Ncell',
    categories: ['Music, Movie & Entertainment'],
    dealExpires: '2020-05-03',
    dealLink: 'https://www.ncell.axiata.com/Latest-Offers/StaySafe',
    description: `- Only for Ncell users
      - Users will have to send SMS StayHome to 17157 for activation of offer for 1 month.
- Users can then download Hungama Music Pro app via Playstore or Appstore and use the premium version of the app(download and offline play feature).
- Offer will be valid till May 3, 2020`,
    dealType: 'freebie',
  }, {
    image: 'https://www.vuemastery.com/images/facbeook_image.png',
    title: 'Vue Mastery is offering all their courses for free until April 19',
    tags: ['webdev', 'programming', 'frontend'],
    store: 'Vue Mastery',
    categories: ['Education'],
    dealExpires: '2020-04-19',
    dealLink: 'https://www.vuemastery.com/free-week/',
    description: 'As an initiative for stay at home, Vue Mastery is offering all their courses for free for a week.',
    dealType: 'freebie',
  }, {
    image: 'https://upload.wikimedia.org/wikipedia/en/c/ce/SmartCellLogo.jpg',
    title: 'SmartCell is offering bonus talk time, sms and mobile data on recharge',
    store: 'SmartTel',
    categories: ['Recharge & Utility Payments'],
    dealLink: 'https://smarttel.com.np/offer/smart-recharge',
    description: `- For Rs. 100 recharge, get 200 MB + Extra 200 MB Data with 10 Mins. talk time and 10 SMS, valid for 7 days.

      - For Rs. 200 recharge, get 400 MB + Extra 400 MB Data with 20 Mins.talk time and 20 SMS, valid for 15 days.

- For Rs. 500 recharge, get 1.5 GB + Extra 1.5 GB Data with 100 Mins.talk time and 100 SMS, valid for 30 days.

- For Rs. 1000 recharge, get 3 GB + Extra 3 GB Data with 200 Mins.talk time and 200 SMS, valid for 30 days`,
    dealType: 'bonus',
  },
];

const fun = async () => {
  // const categories = ['Computer, Software & Electronics'];
  await data.forEach(async deal => {
    const res = await axios.post('http://127.0.0.1:3000/api/deals', deal);
    console.log(res.data);
  });
  console.log('done');
};

fun();
