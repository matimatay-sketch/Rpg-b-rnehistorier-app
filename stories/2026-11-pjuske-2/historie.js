// Månedens historier, november 2026: Pjuskes efterårsliste, kapitel 2 af 4: Trækfuglenes farvel. Historiefil: registrerer sig med LK.addStory og får kit-hjælperne som k.
// Et kapitel står for sig selv. Det må læse vennerne fra sagaen, men sætter aldrig venne-flag.
// Pjuske skal snart gå i hi. Punkt to på hans efterårsliste: sig farvel til trækfuglene, der flyver sydpå i aften.
// I samler hilsner fra skoven, som gæssene kan tage med på rejsen.
LK.addStory(function (k) {
  var PATHS = [
    { id: 'moll', to: 'pj2Moll', label: 'Gå hen til Moll, der skriver et brev' },
    { id: 'tut', to: 'pj2Tut', label: 'Følg den mærkelige hikkelyd ned til sivene' },
    { id: 'vind', to: 'pj2Vind', label: 'Gå op på bakken, hvor Vinden leger i trætoppene' }
  ];
  // En hilsen til gæssene er en gnist med sit eget navn.
  var HILSEN = function (c, def, col, ph) { return { c: c, def: def, col: col, ph: ph }; };

  var MESTER_TXT = {
    Mod: function (n) { return n + ' stiller sig modigt helt forrest på bredden og løfter armene højt. Den forreste gås ser det og daler ned, lige foran jer.'; },
    List: function (n) { return n + ' binder alle hilsnerne sammen med et langt græsstrå, så de bliver til en lille pakke, som en gås nemt kan bære om halsen.'; },
    Venlighed: function (n) { return n + ' siger farvel til hver eneste gås, én ad gangen. Det tager lang tid, men gæssene venter tålmodigt, og de bliver så glade, at de snadrer hele vejen op i luften.'; },
    Fantasi: function (n) { return n + ' tegner et kort over hele skoven i sandet ved søen, så gæssene kan huske vejen hjem til foråret.'; },
    Humor: function (n) { return n + ' går som en gås, vralter og snadrer, så hele flokken griner gak-gak-gak. De flyver af sted i det gladeste V, man har set.'; },
    Nysgerrighed: function (n) { return n + ' spørger den forreste gås om alt: hvor de skal hen, hvor længe de flyver, og hvad de spiser. Gåsen bliver så glad for at fortælle, at hun lover at sende en hilsen tilbage med foråret.'; }
  };

  // Venner fra sagaen, der kommer for at vinke. Historiens egne linjer i stedet for k.friendLines(), som er skrevet
  // til sagaen. Moll, Tut og Vinden kan allerede have været mødt i dag, så linjerne passer, uanset om I har mødt dem.
  function venneLinjer() {
    var f = k.state.flags, o = [];
    if (f.nusseVen || f.nusseHonning) o.push('Nusse kommer løbende og vifter med sin røde hue, så gæssene kan se den helt oppe fra himlen.');
    if (f.mollLoefte) o.push('Moll vinker med et lommetørklæde og tørrer en lille glædeståre væk.');
    if (f.tutVen) o.push('Tut står på en sten og kvækker &laquo;God tur!&raquo; så højt, han kan.');
    if (f.vindVen) o.push('Vinden lægger sig blidt under gæssenes vinger, så de får en god start.');
    if (f.maaneVen) o.push('Månen kigger frem over trætoppene, så gæssene har lys på den første del af vejen.');
    return o;
  }

  var scenes = {
    pj2Start: {
      title: 'Gak-gak!',
      text: function () {
        var t = ['Højt oppe over Lanterneskoven lyder det: &laquo;Gak-gak! Gak-gak!&raquo; En stor flok gæs flyver hen over trætoppene i et langt V. Pjuske kommer trippende ned ad stien så hurtigt, hans små ben kan bære ham.',
          '&laquo;Det er trækfuglene!&raquo; puster han. &laquo;Når det bliver koldt, flyver de sydpå, hvor det er varmt. De tager af sted i aften, når solen går ned. Jeg vil så gerne sige ordentligt farvel, før jeg selv skal sove hele vinteren. Vil I hjælpe mig?&raquo;'];
        if (k.state.remembered.length) t.push('Uffe lander på en gren ved siden af. &laquo;Hu-hu! Det er ' + k.joinNames(k.state.remembered) + '. Så skal det nok gå.&raquo;');
        return t;
      },
      ask: 'Hvordan siger I farvel til nogen, I holder af?',
      choices: [{ label: 'Gå med Pjuske og Uffe', to: 'pj2Hub' }, { label: 'Spørg Pjuske om hans liste', to: 'pj2Liste' }]
    },
    pj2Liste: {
      title: 'Punkt nummer to',
      text: ['Pjuske finder sit store egeblad frem. Uffe har skrevet fire ting på det: en blød seng, farvel til trækfuglene, lysormene i den lange aften, og at blive sunget godnat.',
        '&laquo;Min seng er klar under den store rod,&raquo; siger Pjuske. &laquo;Så i dag er det nummer to. Jeg vil give gæssene en hilsen fra hele skoven med på rejsen.&raquo;',
        'Uffe plukker en lille fjer af sin vinge. &laquo;Tag den med. Den giver held. Brug den, når I slår med terningen.&raquo;'],
      gainFeather: true,
      ask: 'Hvis I skulle sende en hilsen langt væk, hvad skulle den så være?',
      choices: [{ label: 'Lad os samle hilsner!', to: 'pj2Hub' }]
    },
    pj2Hub: {
      title: 'Hilsner til rejsen',
      text: function () {
        var g = k.state.gnists, v = k.state.visited.length;
        if (v === 0) return ['Solen står lavt, og bladene drysser ned fra træerne. Over jer flyver gæssene i store cirkler og øver sig til rejsen.',
          '&laquo;Hvis vi samler bare to hilsner, har gæssene noget at tage med,&raquo; siger Pjuske. &laquo;Og jo flere, jo bedre.&raquo;'];
        var a = 'Gak-gak, lyder det fra himlen. Pjuske kigger op og skynder sig lidt.';
        var b = g === 0 ? '&laquo;Vi har ingen hilsner endnu,&raquo; siger Pjuske. &laquo;Skal vi prøve et sted til, eller gå ned til søen og sige farvel?&raquo;'
          : g === 1 ? '&laquo;Én hilsen!&raquo; siger Pjuske. &laquo;Det ville være fint med én til. Men I bestemmer.&raquo;'
          : '&laquo;Nu har vi hilsner nok,&raquo; siger Pjuske. &laquo;Men gæssene bliver glade for hver eneste en. I bestemmer.&raquo;';
        var left = PATHS.filter(function (p) { return k.state.visited.indexOf(p.id) < 0; }).length + (k.state.visited.indexOf('krage') < 0 ? 1 : 0);
        return [a, b + (left === 0 ? ' Der er ikke flere at spørge.' : '')];
      },
      ask: 'Hvem i skoven tror I, har den fineste hilsen?',
      dyn: function () {
        var c = PATHS.filter(function (p) { return k.state.visited.indexOf(p.id) < 0; }).map(function (p) { return { label: p.label, to: p.to }; });
        if (k.state.visited.indexOf('krage') < 0) c.push({ label: 'Se, hvem der sidder alene og surmuler på en gren', to: 'pj2Krage', lock: function () { return k.lockTxt('Venlighed', 2); } });
        if (k.state.visited.length > 0) c.push({ label: 'Gå ned til søen og sig farvel', to: 'pj2Soe' });
        return c;
      }
    },
    pj2Moll: {
      title: 'Molls brev', path: 'moll',
      text: ['Moll sidder foran sin hule og skriver et brev til gæssene med sin fineste pen. &laquo;Kære gæs,&raquo; står der. &laquo;God tur, og kom hjem igen til foråret.&raquo;',
        '&laquo;Det er til jer,&raquo; siger Moll. &laquo;Men først en gåde, for det hører sig til: Jeg flyver sydpå, når bladene falder, og hjem igen, når de springer ud. Jeg siger gak-gak og flyver i et stort V. Hvad er jeg?&raquo;'],
      ask: 'Tænk sammen, før I svarer. Hvad hørte I oppe på himlen i dag?',
      choices: [
        { label: 'En gås', to: 'pj2MollOk', key: 'gaas' },
        { label: 'En snemand', to: 'pj2Moll', key: 'snemand', wrong: 'Moll klukker: &laquo;Snemænd flyver ikke. De smelter, hvis de tager sydpå!&raquo;' },
        { label: 'En flyvemaskine', to: 'pj2Moll', key: 'fly', wrong: 'Moll fniser: &laquo;Den flyver i et V? Og siger gak-gak? Prøv igen!&raquo;' },
        { label: 'Kig på tegningen på Molls væg', key: 'kig', roll: { stat: 'Nysgerrighed', target: 6, win: 'pj2MollKig', lose: 'pj2MollHint' } }
      ]
    },
    pj2MollKig: {
      title: 'Brevet', gain: true, gnist: HILSEN('røde', 'Molls brev', '#C8352E', 'Kære'),
      text: ['På Molls væg hænger en tegning af en flok fugle med lange halse og orange fødder. De flyver i et stort V. &laquo;Det er en gås!&raquo; siger I.',
        'Moll klapper i sine små hænder og folder brevet. &laquo;I kiggede efter. Det kan jeg lide.&raquo; Hun giver Pjuske brevet, og han holder det forsigtigt med begge poter.'],
      ask: 'Hvad ville I skrive i et brev til gæssene?',
      next: 'pj2Hub'
    },
    pj2MollHint: {
      title: 'Et lille hint',
      text: ['Tegningen hænger i skyggen, så I kan ikke se den ordentligt. Moll smiler. &laquo;Jeg giver jer et hint: Jeg har lange fødder, der er gode til at svømme, og jeg snadrer.&raquo;',
        'Lige i det samme flyver flokken forbi over hulen. &laquo;Gak-gak!&raquo;'],
      ask: 'Hvad tror I, det var, der fløj forbi?',
      next: 'pj2Moll'
    },
    pj2MollOk: {
      title: 'Brevet', gain: true, gnist: HILSEN('røde', 'Molls brev', '#C8352E', 'Kære'),
      text: ['&laquo;En gås! Selvfølgelig!&raquo; Moll klapper i sine små hænder og folder brevet.',
        'Hun giver Pjuske det, og han holder det forsigtigt med begge poter. &laquo;Jeg har tegnet et hjerte nederst,&raquo; siger Moll. &laquo;Så ved de, at vi savner dem.&raquo;'],
      ask: 'Hvem savner I, når de er langt væk?',
      next: 'pj2Hub'
    },
    pj2Tut: {
      title: 'Tut har hikke', path: 'tut',
      text: function () {
        var t = ['Ude ved sivene står tudsen Tut og øver sig på en farvelsang til gæssene. &laquo;Far-HIK-vel, far-HIK-vel, kæ-HIK-re gæs!&raquo; Han har hikke.',
          '&laquo;Det er HIK håbløst,&raquo; siger Tut og ser trist ud. &laquo;Jeg kan ikke synge for gæssene HIK på den måde.&raquo;'];
        if (k.state.flags.tutVen) t.push('Så får han øje på jer. &laquo;Mine venner! HIK! Godt, I kom.&raquo;');
        return t;
      },
      ask: 'Hvad gør I, når I får hikke?',
      choices: [
        { label: 'Få Tut til at grine, så hikken forsvinder', roll: { stat: 'Humor', target: 6, win: 'pj2TutOk', lose: 'pj2TutFejl' } },
        { label: 'Tæl stille til ti sammen med Tut, mens han trækker vejret langsomt', roll: { stat: 'Venlighed', target: 6, win: 'pj2TutOk', lose: 'pj2TutFejl' } },
        { label: 'Lav en ny sang, hvor hikken er en del af den', roll: { stat: 'Fantasi', target: 6, win: 'pj2TutOk', lose: 'pj2TutFejl' } }
      ]
    },
    pj2TutOk: {
      title: 'Tuts sang', gain: true, gnist: HILSEN('grønne', 'Tuts sang', '#4CAF6A', 'Kvæk'),
      text: ['Tut trækker vejret. Han venter. Ingen hik! &laquo;Den er væk!&raquo; råber han og hopper så højt, at hatten letter.',
        'Så synger han sin farvelsang for jer, klar og fin. &laquo;Den skal gæssene have med,&raquo; siger han. &laquo;Så har de noget at nynne på, når de flyver.&raquo;'],
      ask: 'Hvilken sang ville I give med på en lang rejse?',
      next: 'pj2Hub'
    },
    pj2TutFejl: {
      title: 'Hikke-koret', flag: 'pj2Hik',
      text: ['Tut prøver og prøver, men HIK! Hikken bliver. Og så får Pjuske også hikke. HIK! Og så Uffe. Hu-HIK!',
        'Nu står I alle tre og hikker i takt, og det lyder næsten som en sang. Tut griner, så han må sætte sig ned. &laquo;Den sang synger vi for gæssene en anden gang,&raquo; siger han.'],
      ask: 'Hvad er det sjoveste, der er sket, da noget gik lidt galt?',
      next: 'pj2Hub'
    },
    pj2Vind: {
      title: 'Vinden leger', path: 'vind',
      text: ['Oppe på bakken leger Vinden i trætoppene. Den blæser rundt og rundt, så bladene hvirvler som en karrusel.',
        '&laquo;Jeg kan ikke lide farvel,&raquo; suser Vinden. &laquo;Hvis jeg blæser rundt i ring, kan gæssene måske ikke flyve, og så bliver de her.&raquo;',
        'Uffe ryster på hovedet. &laquo;Gæssene skal sydpå, ellers fryser de. De har brug for en blid vind, der blæser lige ud.&raquo;'],
      ask: 'Hvordan kan man hjælpe en ven, der er ked af et farvel?',
      choices: [
        { label: 'Vis Vinden, hvordan man blæser blidt og lige', bevaeg: { goer: 'Læg en fjer eller et lille stykke papir på bordet. Blæs den blidt hen over bordet til den anden kant, uden at den flyver ned.', stat: 'Fantasi', target: 6, win: 'pj2VindOk', lose: 'pj2VindFejl' } },
        { label: 'Fortæl Vinden, at gæssene kommer igen til foråret', roll: { stat: 'Venlighed', target: 6, win: 'pj2VindOk', lose: 'pj2VindFejl' } },
        { label: 'Spørg Vinden, om den vil følge gæssene et stykke af vejen', roll: { stat: 'Nysgerrighed', target: 6, win: 'pj2VindOk', lose: 'pj2VindFejl' } }
      ]
    },
    pj2VindOk: {
      title: 'Medvinden', gain: true, gnist: HILSEN('blå', 'Medvinden', '#4A90D9', 'Sus'),
      text: ['Vinden holder op med at blæse rundt. Den prøver at blæse blidt og lige ud, og bladene lægger sig stille på jorden. &laquo;Sådan?&raquo; hvisker den.',
        '&laquo;Præcis sådan,&raquo; siger Pjuske. Vinden smiler. &laquo;Så blæser jeg gæssene sikkert sydpå i aften. Og til foråret blæser jeg dem hjem igen.&raquo;'],
      ask: 'Hvad tror I, Vinden ser, når den følger gæssene sydpå?',
      next: 'pj2Hub'
    },
    pj2VindFejl: {
      title: 'Bladet flyver',
      text: ['Vinden prøver at blæse lige, men et blad flyver skævt, snurrer rundt og lander lige på Uffes næb. &laquo;Hu-hu!&raquo; siger Uffe forbløffet og skeler til den.',
        'Vinden griner, så alle bladene danser. &laquo;Det var det sjoveste, jeg har set i hele efteråret!&raquo; suser den. &laquo;Nu er jeg ikke ked af det mere. Jeg øver mig på at blæse lige til i aften.&raquo;'],
      ask: 'Hvad hjælper jer, når I er kede af det?',
      next: 'pj2Hub'
    },
    pj2Krage: {
      title: 'Kragen Kra', path: 'krage',
      text: ['På en lav gren sidder kragen Kra helt alene og surmuler. &laquo;Alle snakker kun om gæssene,&raquo; siger han. &laquo;Ingen siger farvel til mig.&raquo;',
        '&laquo;Men du skal jo ikke rejse,&raquo; siger Pjuske. &laquo;Nej,&raquo; siger Kra. &laquo;Krager bliver her hele vinteren. Og det er der ingen, der lægger mærke til.&raquo; Ved siden af ham ligger en lille bunke blanke skatte.'],
      ask: 'Hvordan føles det, når alle andre får opmærksomhed?',
      choices: [
        { label: 'Sig til Kra, at I er glade for, at han bliver', roll: { stat: 'Venlighed', target: 6, win: 'pj2KrageOk', lose: 'pj2KrageFejl' } },
        { label: 'Spørg Kra om alle hans blanke skatte', roll: { stat: 'Nysgerrighed', target: 6, win: 'pj2KrageOk', lose: 'pj2KrageFejl' } },
        { label: 'Lav en vinterkrage-dans sammen med Kra', roll: { stat: 'Humor', target: 6, win: 'pj2KrageOk', lose: 'pj2KrageFejl' } }
      ]
    },
    pj2KrageOk: {
      title: 'Den blanke knap', gain: true, gnist: HILSEN('blanke', 'Den blanke knap', '#9AA0AC', 'Blink'),
      text: ['Kra puster sig op og smiler med hele næbbet. &laquo;Så er der én, der lægger mærke til mig,&raquo; siger han.',
        'Han roder i sine skatte og finder en lille, blank knap. &laquo;Den må gæssene få. Så kan de se den glimte og huske, at der er en krage, der venter på dem her.&raquo;'],
      ask: 'Hvem kunne I huske at sige noget sødt til i morgen?',
      next: 'pj2Hub'
    },
    pj2KrageFejl: {
      title: 'Alle skattene',
      text: ['Kra bliver så glad, at han vil vise jer alle sine skatte. En kapsel. En glasperle. En sølvske. En til kapsel. Det bliver ved og ved.',
        '&laquo;Jeg kan slet ikke vælge,&raquo; siger Kra glad. &laquo;Jeg kigger dem lige igennem én gang til. Gå I bare videre, så kommer jeg ned til søen bagefter.&raquo; Han sidder ikke og surmuler mere.'],
      ask: 'Hvad er jeres allerfineste skat?',
      next: 'pj2Hub'
    },
    pj2Soe: {
      title: 'Ved søen i solnedgangen',
      text: function () {
        var g = k.state.gnists;
        var a = 'Solen går ned over Månesøen, og himlen bliver orange og lyserød. Gæssene flyver en sidste runde over vandet. &laquo;Gak-gak! Nu skal vi af sted!&raquo;';
        var b = g >= 3 ? '&laquo;' + k.joinNames(k.gnistNames()) + '!&raquo; siger Pjuske stolt. &laquo;Det er hilsner fra hele skoven.&raquo;'
          : g >= 1 ? '&laquo;Vi har ' + k.joinNames(k.gnistNames()) + ' med,&raquo; siger Pjuske. &laquo;Det er en fin hilsen.&raquo;'
          : '&laquo;Vi fik ingen hilsner med,&raquo; siger Pjuske stille. Uffe lægger en vinge om ham. &laquo;Det bedste farvel kommer fra hjertet. Det har vi masser af.&raquo;';
        var t = [a, b];
        if (k.state.flags.pj2Hik) t.push('HIK! Pjuske har stadig en lille smule hikke. Han fniser.');
        return t;
      },
      ask: 'Hvordan tror I, det føles at flyve hele vejen sydpå?',
      dyn: function () {
        var c = [];
        if (k.state.gnists > 0) c.push({ label: 'Giv gæssene hilsnerne med på rejsen', to: 'pj2EndHilsner' });
        c.push({ label: 'Råb på skovens venner, så alle kan vinke', to: 'pj2EndVenner' });
        c.push({ label: 'Sig farvel på gåsesprog', to: 'pj2EndGak', lock: function () { return k.partyStat('Humor') >= 3 || k.partyStat('Fantasi') >= 3 ? null : 'Kræver Humor 3 eller Fantasi 3'; } });
        return c;
      }
    },
    pj2EndHilsner: {
      title: 'God tur, gæs!', end: true, all: true,
      text: function () {
        var navne = k.joinNames(k.gnistNames());
        return ['Den forreste gås daler ned og lander blødt ved bredden. Hun hedder Gerda, og hun er den ældste i flokken. Pjuske rækker hende ' + navne + '.',
          '&laquo;Tak, lille pindsvin,&raquo; siger Gerda. &laquo;Dem tager vi med hele vejen sydpå. Og når vi kommer hjem til foråret, vækker vi dig med et stort gak-gak.&raquo;',
          'Så letter hun, og flokken flyver af sted i et langt V mod solnedgangen. Pjuske vinker, til de bare er en lille prik. Uffe sætter et flueben ved nummer to på listen.'];
      },
      ask: 'Hvad tror I, gæssene fortæller om Lanterneskoven, når de kommer frem?'
    },
    pj2EndVenner: {
      title: 'Hele skoven vinker', end: true, all: true,
      text: function () {
        var fl = venneLinjer();
        var a = 'I råber ud over søen: &laquo;Kom og sig farvel til gæssene!&raquo; Snart kommer dyrene løbende fra alle sider.';
        var slut = 'Ræven vifter med halen, musene hopper op og ned, og kragen Kra flyver et lille stykke med. Gæssene ser det hele. De flyver en ekstra runde over søen og snadrer tak, før de forsvinder i et langt V mod syd. &laquo;Det var det fineste farvel,&raquo; siger Pjuske.';
        var t = fl.length ? [a, fl.join(' '), slut] : [a, slut];
        t.push('Uffe sætter et flueben ved nummer to på listen.');
        return t;
      },
      ask: function () { return venneLinjer().length ? 'Hvem var I gladest for at se i dag?' : 'Hvordan kan man vise nogen, at man vil savne dem?'; }
    },
    pj2EndGak: {
      title: 'Gak-gak!', end: true, all: true,
      text: function () {
        var t = ['I stiller jer på bredden, stikker armene ud som vinger og råber så højt, I kan: &laquo;GAK-GAK! GOD TUR!&raquo; Pjuske og Uffe råber med.',
          'Oppe på himlen bliver der stille et øjeblik. Så svarer hele flokken: &laquo;GAK-GAK-GAK!&raquo; De flyver en stor runde lige over jeres hoveder, så tæt, at I kan mærke vinden fra vingerne.'];
        if (k.state.gnists > 0) t.push('Den forreste gås daler ned og tager ' + k.joinNames(k.gnistNames()) + ' med i næbbet.');
        t.push('Så forsvinder de i et langt V mod syd. &laquo;Nu kan jeg tale gåsesprog,&raquo; siger Pjuske stolt. Uffe sætter et flueben ved nummer to på listen.');
        return t;
      },
      ask: 'Hvis I kunne tale med ét dyr, hvilket skulle det så være?'
    },
    pj2EndMester: {
      title: 'Mesterens farvel', end: true, all: true,
      text: function () {
        var m = k.state.mester || { name: 'Jeres helt', stat: 'Mod' };
        var how = MESTER_TXT[m.stat] || MESTER_TXT.Mod;
        return [how(k.esc(m.name)), 'Gæssene flyver af sted mod solnedgangen og snadrer tak hele vejen. Pjuske vinker, til de er en lille prik. &laquo;Det var det bedste farvel i hele verden,&raquo; siger han, og Uffe sætter et flueben ved nummer to.'];
      },
      ask: 'Hvad er I blevet rigtig gode til? Hvordan lærte I det?'
    }
  };

  var magi = {
    pj2Moll: {
      gnist: { l: 'Skab en gnist, der tegner en gås i luften', to: 'pj2MollKig' },
      dyr: { l: 'Spørg en and ved søen, hvem der siger gak-gak', to: 'pj2MollKig' },
      syn: { l: 'Se svaret, der gemmer sig i Molls brev', to: 'pj2MollKig' },
      latter: { l: 'Strø latterstøv, så Moll kommer til at grine svaret ud', to: 'pj2MollOk' }
    },
    pj2Tut: {
      gnist: { l: 'Skab en varm gnist, der får hikken til at smelte', to: 'pj2TutOk' },
      dyr: { l: 'Spørg en gammel frø om et godt råd mod hikke', to: 'pj2TutOk' },
      syn: { l: 'Se, hvor hikken gemmer sig, og kild den væk', to: 'pj2TutOk' },
      latter: { l: 'Strø latterstøv, så Tut griner hikken ud', to: 'pj2TutOk' }
    },
    pj2Vind: {
      gnist: { l: 'Skab en gnist, der viser Vinden vejen mod syd', to: 'pj2VindOk' },
      dyr: { l: 'Bed gæssene selv fortælle Vinden, at de kommer igen', to: 'pj2VindOk' },
      syn: { l: 'Se forårets blade, der allerede venter i knopperne', to: 'pj2VindOk' },
      latter: { l: 'Strø latterstøv, så Vinden griner og glemmer at være ked af det', to: 'pj2VindOk' }
    },
    pj2Krage: {
      gnist: { l: 'Skab en gnist, der glimter som Kras fineste skat', to: 'pj2KrageOk' },
      dyr: { l: 'Tal med Kra på kragesprog', to: 'pj2KrageOk' },
      syn: { l: 'Se den blanke knap, der gemmer sig nederst i bunken', to: 'pj2KrageOk' },
      latter: { l: 'Strø latterstøv, så Kra kommer til at grine', to: 'pj2KrageOk' }
    },
    pj2Hub: {
      syn: { l: 'Se kragen, der sidder alene på en gren', to: 'pj2Krage', show: function () { return k.state.visited.indexOf('krage') < 0 && !!k.lockTxt('Venlighed', 2); } }
    },
    pj2Soe: {
      gnist: { l: 'Skab en ekstra hilsen til gæssene', to: 'pj2Soe', eff: function (h) { k.state.gnists++; k.state.gnistList.push({ key: 'magi_' + h.id + '_' + k.state.gnists, c: 'magiske', def: k.gen(h.name) + ' hilsen', col: '#F2C94C', ph: 'Hilsen', name: '' }); } },
      dyr: { l: 'Bed skovens dyr om at komme og vinke', to: 'pj2EndVenner' },
      latter: { l: 'Strø latterstøv, så alle siger farvel på gåsesprog', to: 'pj2EndGak' }
    }
  };

  /* Mester-valg: når en helt har 5 i et træk, åbner der sig et ekstra valg i scenen (uden terning). */
  var mester = {
    pj2Moll: [
      { stat: 'Nysgerrighed', l: 'Kig på Molls tegning, og find svaret med det samme', to: 'pj2MollKig', n: function (n) { return n + ' ser tegningen af de lange halse og det store V. Så er svaret let.'; } }
    ],
    pj2Tut: [
      { stat: 'Humor', l: 'Lav en så sjov hikkelyd, at Tut glemmer sin egen', to: 'pj2TutOk', n: function (n) { return n + ' laver den sjoveste hikkelyd i verden. Tut griner så meget, at hans egen hikke bliver helt væk.'; } }
    ],
    pj2Vind: [
      { stat: 'Fantasi', l: 'Fortæl Vinden, hvordan foråret bliver, når gæssene kommer hjem', to: 'pj2VindOk', n: function (n) { return n + ' fortæller om foråret, når gæssene kommer hjem med sol på vingerne. Vinden lytter og bliver helt stille og glad.'; } },
      { stat: 'Venlighed', l: 'Lov Vinden, at I leger med den hele vinteren', to: 'pj2VindOk', n: function (n) { return n + ' lover at lege med Vinden hele vinteren. Så er Vinden ikke ked af farvel mere.'; } }
    ],
    pj2Krage: [
      { stat: 'Venlighed', l: 'Giv Kra et stort kram og sig, at han er jeres vinterven', to: 'pj2KrageOk', n: function (n) { return n + ' giver Kra et forsigtigt kram og kalder ham sin vinterven. Kra bliver så glad, at han straks finder sin fineste skat.'; } }
    ],
    pj2Soe: []
  };
  k.stats.forEach(function (t) {
    mester.pj2Soe.push({ stat: t[0], l: 'Brug mester-trækket ' + t[0] + ' til at sige farvel', to: 'pj2EndMester', eff: function (h, stat) { k.state.mester = { name: h.name, stat: stat }; } });
  });

  /* Billeder til scenerne, tegnet med delene i art/dele.js (LK.art.scene). Koordinater i en ramme på 400 x 250. */
  var PJ = function (x, y, h, s) { return { navn: 'pind', x: x, y: y, skala: s || 0.65, humoer: h }; };
  var UF = function (x, y, h, s) { return { navn: 'uffe', x: x, y: y, skala: s || 0.65, humoer: h }; };
  var FLOK = function (x, y, s, antal) { return { navn: 'fugleflok', x: x, y: y, skala: s || 1, antal: antal || 7 }; };
  var billeder = {
    pj2Start: { sted: 'skovsti', himmel: 'dag', alt: 'En flok gæs flyver i et V over skoven, og Pjuske kigger op.',
      ting: [FLOK(200, 50)],
      figurer: [PJ(160, 200, 'overrasket'), UF(290, 176, 'glad', 0.7)] },
    pj2Liste: { sted: 'skovsti', himmel: 'dag', alt: 'Pjuske viser sin liste på et stort egeblad.',
      ting: [FLOK(300, 40, 0.6, 5), { navn: 'blade', x: 120, y: 120, skala: 0.5 }],
      figurer: [PJ(160, 200, 'glad'), UF(290, 176, 'glad', 0.7)] },
    pj2Hub: { sted: 'lysning', himmel: 'dag', alt: 'Gæssene flyver i store cirkler over lysningen, og Pjuske og Uffe går under dem.',
      ting: [FLOK(130, 55, 0.8), { navn: 'blade', x: 300, y: 110, skala: 0.6 }],
      figurer: [PJ(170, 206, 'glad'), UF(260, 182, 'glad', 0.7)] },
    pj2Moll: { sted: 'hule', himmel: 'dag', alt: 'Moll sidder foran sin hule og skriver et brev til gæssene.',
      ting: [{ navn: 'brev', x: 270, y: 232 }, FLOK(300, 40, 0.6, 5)],
      figurer: [{ navn: 'moll', x: 200, y: 192, humoer: 'glad' }, PJ(85, 212, 'rolig', 0.55)] },
    pj2MollKig: { sted: 'hule', himmel: 'dag', alt: 'Moll giver Pjuske brevet med et hjerte på.',
      ting: [{ navn: 'brev', x: 140, y: 160, taendt: true }],
      figurer: [{ navn: 'moll', x: 200, y: 192, humoer: 'glad' }, PJ(85, 212, 'glad', 0.55)] },
    pj2MollHint: { sted: 'hule', himmel: 'dag', alt: 'Moll smiler og giver et hint, mens gæssene flyver forbi over hulen.',
      ting: [FLOK(200, 40, 0.8)],
      figurer: [{ navn: 'moll', x: 200, y: 192, humoer: 'rolig' }, UF(330, 186, 'bekymret')] },
    pj2MollOk: { sted: 'hule', himmel: 'dag', alt: 'Moll klapper, og Pjuske holder brevet med begge poter.',
      ting: [{ navn: 'brev', x: 140, y: 160, taendt: true }],
      figurer: [{ navn: 'moll', x: 200, y: 192, humoer: 'glad' }, PJ(85, 212, 'glad', 0.55)] },
    pj2Tut: { sted: 'maanesoe', himmel: 'dag', alt: 'Tut står ved sivene og hikker, så hatten hopper.',
      figurer: [{ navn: 'tut', x: 200, y: 212, skala: 0.8, humoer: 'bekymret' }, PJ(80, 214, 'overrasket', 0.55)] },
    pj2TutOk: { sted: 'maanesoe', himmel: 'dag', alt: 'Tut synger glad, og hikken er væk.',
      ting: [{ navn: 'gnist', x: 300, y: 120, taendt: true, farve: 'groen' }],
      figurer: [{ navn: 'tut', x: 200, y: 212, skala: 0.8, humoer: 'glad' }, PJ(80, 214, 'glad', 0.55)] },
    pj2TutFejl: { sted: 'maanesoe', himmel: 'dag', alt: 'Tut, Pjuske og Uffe hikker alle sammen i takt og griner.',
      figurer: [{ navn: 'tut', x: 200, y: 212, skala: 0.8, humoer: 'overrasket' }, PJ(80, 214, 'overrasket', 0.55), UF(320, 216, 'overrasket', 0.6)] },
    pj2Vind: { sted: 'bjerg', himmel: 'dag', alt: 'Vinden blæser bladene rundt i ring oppe på bakken.',
      ting: [{ navn: 'blade', x: 195, y: 115, skala: 0.8 }],
      figurer: [{ navn: 'vinden', x: 310, y: 100, humoer: 'bekymret' }, PJ(110, 200, 'bekymret'), UF(200, 190, 'rolig', 0.6)] },
    pj2VindOk: { sted: 'bjerg', himmel: 'dag', alt: 'Vinden blæser blidt, og bladene lægger sig stille.',
      ting: [{ navn: 'gnist', x: 200, y: 120, taendt: true, farve: 'blaa' }],
      figurer: [{ navn: 'vinden', x: 300, y: 100, humoer: 'glad' }, PJ(110, 200, 'glad'), UF(220, 190, 'glad', 0.6)] },
    pj2VindFejl: { sted: 'bjerg', himmel: 'dag', alt: 'Vinden griner, og bladene danser rundt om Uffe.',
      ting: [{ navn: 'blade', x: 220, y: 150, skala: 0.8 }],
      figurer: [{ navn: 'vinden', x: 310, y: 90, humoer: 'glad' }, PJ(100, 200, 'glad'), UF(220, 190, 'overrasket', 0.6)] },
    pj2Krage: { sted: 'skovsti', himmel: 'skumring', alt: 'Kragen Kra sidder alene på en gren ved en lille bunke blanke skatte.',
      ting: [{ navn: 'gren', x: 300, y: 150, skala: 0.6 }, { navn: 'gnist', x: 330, y: 225, skala: 0.6 }],
      figurer: [{ navn: 'krage', x: 290, y: 122, skala: 0.7, humoer: 'bekymret' }, PJ(140, 205, 'bekymret')] },
    pj2KrageOk: { sted: 'skovsti', himmel: 'skumring', alt: 'Kra smiler og holder en blank knap frem.',
      ting: [{ navn: 'gren', x: 300, y: 150, skala: 0.6 }, { navn: 'gnist', x: 220, y: 110, taendt: true, farve: '#9AA0AC' }],
      figurer: [{ navn: 'krage', x: 290, y: 122, skala: 0.7, humoer: 'glad' }, PJ(140, 205, 'glad')] },
    pj2KrageFejl: { sted: 'skovsti', himmel: 'skumring', alt: 'Kra viser glad den ene skat efter den anden.',
      ting: [{ navn: 'gren', x: 300, y: 150, skala: 0.6 }, { navn: 'gnist', x: 250, y: 225, skala: 0.5 }, { navn: 'gnist', x: 330, y: 230, skala: 0.5, farve: 'blaa' }],
      figurer: [{ navn: 'krage', x: 290, y: 122, skala: 0.7, humoer: 'overrasket' }, PJ(140, 205, 'glad')] },
    pj2Soe: { sted: 'maanesoe', himmel: 'aften', alt: 'Solen går ned over søen, og gæssene flyver en sidste runde.',
      ting: [FLOK(200, 60)],
      figurer: [PJ(110, 214, 'rolig'), UF(300, 216, 'rolig', 0.6)] },
    pj2EndHilsner: { sted: 'maanesoe', himmel: 'aften', alt: 'Gæssene flyver af sted i et langt V mod solnedgangen, og Pjuske vinker.',
      ting: [FLOK(290, 70, 0.8, 9), { navn: 'gnist', x: 200, y: 140, taendt: true }],
      figurer: [PJ(110, 214, 'glad'), UF(200, 216, 'glad', 0.55)] },
    pj2EndVenner: { sted: 'maanesoe', himmel: 'aften', alt: 'Ræven, musen og kragen vinker farvel til gæssene ved søen.',
      ting: [FLOK(200, 55, 0.9, 9)],
      figurer: [{ navn: 'raev', x: 60, y: 212, skala: 0.7 }, PJ(160, 214, 'glad', 0.6), { navn: 'mus', x: 260, y: 218, skala: 0.6 }, { navn: 'krage', x: 345, y: 215, skala: 0.6 }] },
    pj2EndGak: { sted: 'maanesoe', himmel: 'aften', alt: 'Gæssene flyver lavt over søen og råber gak-gak tilbage.',
      ting: [FLOK(200, 80, 1.3, 9)],
      figurer: [PJ(110, 214, 'overrasket'), UF(300, 216, 'glad', 0.6)] },
    pj2EndMester: { sted: 'maanesoe', himmel: 'aften', alt: 'Gæssene flyver mod solnedgangen, og Pjuske og Uffe vinker.',
      ting: [FLOK(290, 70, 0.8, 9)],
      figurer: [PJ(110, 214, 'glad'), UF(220, 216, 'glad', 0.6)] }
  };

  return {
    id: '2026-11-pjuske-2', type: 'maaned', udgives: '2026-11-13',
    serie: { id: '2026-11-pjuske', titel: 'Pjuskes efterårsliste' }, kapitel: 2, kapitler: 4,
    start: 'pj2Start', title: 'Trækfuglenes farvel', tag: 'November',
    blurb: 'Gæssene flyver sydpå i aften, og Pjuske vil sige ordentligt farvel. Kan I samle hilsner fra hele skoven?',
    scenes: scenes, magi: magi, mester: mester, billeder: billeder
  };
});
