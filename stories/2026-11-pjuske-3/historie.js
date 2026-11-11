// Månedens historier, november 2026: Pjuskes efterårsliste, kapitel 3 af 4: Den lange aften. Historiefil: registrerer sig med LK.addStory og får kit-hjælperne som k.
// Et kapitel står for sig selv. Det må læse vennerne fra sagaen, men sætter aldrig venne-flag.
// Pjuske skal snart gå i hi. Punkt tre på hans efterårsliste: se lysormene lyse i den lange, mørke aften.
// Men det er koldt, og lysormene har gemt sig. I finder dem og får dem til at lyse igen.
LK.addStory(function (k) {
  var PATHS = [
    { id: 'svamp', to: 'pj3Svamp', label: 'Gå ned i sumpen, hvor Tut står med en mørk lygte' },
    { id: 'baek', to: 'pj3Baek', label: 'Følg den lille, kolde stemme ved bækken' },
    { id: 'moll', to: 'pj3Moll', label: 'Gå hen til Molls hule, hvor nogen snorker bittesmå snork' }
  ];
  // En lysorm, I finder, er en gnist med sit eget navn.
  var LYS = function (c, def, col, ph) { return { c: c, def: def, col: col, ph: ph }; };

  var MESTER_TXT = {
    Mod: function (n) { return n + ' slukker sin lygte og står helt stille i mørket. &laquo;Mørket er ikke farligt,&raquo; siger ' + n + '. &laquo;Det er bare dag med lukkede øjne.&raquo; Så tør lysormene også komme frem, og én efter én tænder de.'; },
    List: function (n) { return n + ' bygger en lille, lun hytte af blade og mos på toppen af bakken. Lysormene kryber ind, bliver varme og begynder at lyse, så hytten gløder som en lanterne.'; },
    Venlighed: function (n) { return n + ' sætter sig ned og hvisker til hver lysorm, at den er god nok, præcis som den er. Lysormene bliver så glade, at de lyser stærkere end nogensinde.'; },
    Fantasi: function (n) { return n + ' tegner en stor stjerne i luften med fingeren, og lysormene kravler efter, så stjernen bliver til lys. Pjuske klapper med begge poter.'; },
    Humor: function (n) { return n + ' fortæller lysormene en vittighed om en snegl, der kom for sent til sin egen fødselsdag. Lysormene griner, så de blinker, og snart blinker hele bakken.'; },
    Nysgerrighed: function (n) { return n + ' spørger lysormene, hvordan de lyser. &laquo;Vi tænker på noget dejligt,&raquo; siger de. Så tænker alle på noget dejligt, og hele bakken lyser.'; }
  };

  // Venner fra sagaen, der kommer med lys i den mørke aften. Historiens egne linjer i stedet for k.friendLines(), som er
  // skrevet til sagaen. Tut og Moll kan allerede have været mødt i dag, så linjerne passer, uanset om I har mødt dem.
  function venneLinjer() {
    var f = k.state.flags, o = [];
    if (f.nusseVen || f.nusseHonning) o.push('Nusse kommer med sin røde gnist i hånden som en lille lygte.');
    if (f.mollLoefte) o.push('Moll har taget sin læselampe med og stiller den forsigtigt i græsset.');
    if (f.tutVen) o.push('Tut har pyntet sin hat med lysende svampe, så han ligner en lille lampe på ben.');
    if (f.vindVen) o.push('Vinden puster så blidt, at ingen lys går ud.');
    if (f.maaneVen) o.push('Månen kigger frem bag en sky og blinker sølvlys ned over bakken.');
    return o;
  }

  var scenes = {
    pj3Start: {
      title: 'Mørkt allerede',
      text: function () {
        var t = ['I november bliver det mørkt tidligt. I har lige fået eftermiddagsmad, og alligevel er himlen udenfor allerede blå og mørk. Uffe sidder i vindueskarmen og blinker med sine store øjne. Han er en ugle, så han elsker mørke.',
          'Så banker det på ruden. Det er Pjuske, og han tripper af spænding. &laquo;I aften er det den lange aften!&raquo; siger han. &laquo;Jeg har aldrig set lysormene lyse, for jeg går altid i seng, før det bliver mørkt. Men de har gemt sig, fordi det er så koldt. Vil I hjælpe mig med at finde dem?&raquo;'];
        if (k.state.remembered.length) t.push('&laquo;Hu-hu! Det er ' + k.joinNames(k.state.remembered) + ',&raquo; siger Uffe. &laquo;De er gode til at finde ting i mørket.&raquo;');
        return t;
      },
      ask: 'Hvad kan man lave i de lange, mørke aftener, som man ikke kan om sommeren?',
      choices: [{ label: 'Tag en lygte, og gå med Pjuske', to: 'pj3Hub' }, { label: 'Spørg Pjuske om hans liste', to: 'pj3Liste' }]
    },
    pj3Liste: {
      title: 'Punkt nummer tre',
      text: ['Pjuske finder sit store egeblad frem. Uffe har skrevet fire ting på det: en blød seng, farvel til trækfuglene, lysormene i den lange aften, og at blive sunget godnat.',
        '&laquo;Min seng er klar, og gæssene er fløjet,&raquo; siger Pjuske. &laquo;Så i aften er det nummer tre. Lysormene lyser kun, når de er varme og glade.&raquo;',
        'Uffe plukker en lille fjer af sin vinge. &laquo;Tag den med. Den giver held. Brug den, når I slår med terningen.&raquo;'],
      gainFeather: true,
      ask: 'Hvad gør jer varme og glade indeni?',
      choices: [{ label: 'Lad os finde lysormene!', to: 'pj3Hub' }]
    },
    pj3Hub: {
      title: 'Skoven i mørke',
      text: function () {
        var g = k.state.gnists, v = k.state.visited.length;
        if (v === 0) return ['Skoven er mørk og stille. Jeres lygte laver en lille, gul cirkel på stien, og Uffe flyver lydløst foran jer. Pjuske holder jer i hånden.',
          '&laquo;Hvis vi finder bare to lysorme, kan vi se dem lyse oppe på bakken,&raquo; siger Pjuske. &laquo;Og jo flere, jo flottere.&raquo;'];
        var a = 'I går videre i mørket. Det knaser under jeres sko, og et sted langt væk tuder en anden ugle. Uffe tuder tilbage.';
        var b = g === 0 ? '&laquo;Vi har ikke fundet nogen lysorme endnu,&raquo; siger Pjuske. &laquo;Skal vi lede et sted til, eller gå op på bakken og se, hvad der sker?&raquo;'
          : g === 1 ? '&laquo;Én lysorm!&raquo; siger Pjuske og kigger på den med store øjne. &laquo;Én til, og så er det et rigtigt lysshow. Men I bestemmer.&raquo;'
          : '&laquo;Nu har vi lysorme nok til bakken,&raquo; siger Pjuske. &laquo;Men jo flere, jo flottere. I bestemmer.&raquo;';
        var left = PATHS.filter(function (p) { return k.state.visited.indexOf(p.id) < 0; }).length + (k.state.visited.indexOf('krat') < 0 ? 1 : 0);
        return [a, b + (left === 0 ? ' Der er ikke flere steder at lede.' : '')];
      },
      ask: 'Hvordan føles det at gå i skoven, når det er mørkt?',
      dyn: function () {
        var c = PATHS.filter(function (p) { return k.state.visited.indexOf(p.id) < 0; }).map(function (p) { return { label: p.label, to: p.to }; });
        if (k.state.visited.indexOf('krat') < 0) c.push({ label: 'Gå ind i det mørke krat, hvor noget blinker svagt', to: 'pj3Krat', lock: function () { return k.lockTxt('Mod', 2); } });
        if (k.state.visited.length > 0) c.push({ label: 'Gå op på bakken og se lysormene lyse', to: 'pj3Bakke' });
        return c;
      }
    },
    pj3Svamp: {
      title: 'Tuts mørke lygte', path: 'svamp',
      text: function () {
        var t = ['Nede i sumpen står tudsen Tut med sin svampelygte. Den plejer at lyse blågrønt, for der bor en lysorm i den. Men i aften er den helt mørk.',
          '&laquo;Lysormen siger, at den ikke lyser pænt nok,&raquo; siger Tut og ser bekymret ud. &laquo;Den har gemt sig under svampehatten og vil ikke komme frem.&raquo;'];
        if (k.state.flags.tutVen) t.push('Så lyser Tuts ansigt op, selvom lygten ikke gør. &laquo;Mine venner! I kommer lige til tiden.&raquo;');
        return t;
      },
      ask: 'Har I nogensinde syntes, at I ikke var gode nok til noget? Hvad hjalp?',
      choices: [
        { label: 'Sig til lysormen, at alt lys er fint lys', roll: { stat: 'Venlighed', target: 6, win: 'pj3SvampOk', lose: 'pj3SvampFejl' } },
        { label: 'Fortæl en historie om den modigste lille lysorm', roll: { stat: 'Fantasi', target: 6, win: 'pj3SvampOk', lose: 'pj3SvampFejl' } },
        { label: 'Kig forsigtigt ind under svampehatten', roll: { stat: 'Nysgerrighed', target: 6, win: 'pj3SvampOk', lose: 'pj3SvampFejl' } }
      ]
    },
    pj3SvampOk: {
      title: 'Svampelyset', gain: true, gnist: LYS('blågrønne', 'Svampelyset', '#4FC3B0', 'Glim'),
      text: ['Langsomt kryber lysormen frem under hatten. Først lyser den bare en lille smule. Så lidt mere. Så lyser hele svampen blågrøn, og sumpen glimter.',
        '&laquo;Er det pænt nok?&raquo; spørger lysormen. &laquo;Det er det smukkeste, jeg har set,&raquo; hvisker Pjuske. Tut giver jer lygten. &laquo;Tag den med op på bakken. Jeg kommer bagefter.&raquo;'],
      ask: 'Hvilken farve ville I lyse i, hvis I var en lysorm?',
      next: 'pj3Hub'
    },
    pj3SvampFejl: {
      title: 'Svampen nyser',
      text: ['Lysormen kryber endnu længere ind, og svampehatten kilder den på næsen. ATJU! Svampen ryster, og der drysser små sporer ud over Tut, så han bliver helt prikket.',
        'Tut griner højt. &laquo;Nu ligner jeg en stjernehimmel!&raquo; Lysormen fniser inde i svampen. &laquo;Måske kommer jeg op på bakken senere,&raquo; siger den. &laquo;Når jeg har øvet mig lidt.&raquo;'],
      ask: 'Hvorfor tror I, det er lettere at prøve noget, når man har grinet?',
      next: 'pj3Hub'
    },
    pj3Baek: {
      title: 'Den lille lysorm', path: 'baek',
      text: ['På en sten ved bækken sidder en bitte lille lysorm og ryster af kulde. &laquo;Jeg hedder Lyn,&raquo; siger den med en tynd stemme. &laquo;Jeg vil så gerne se ud over hele skoven. Men jeg er så lille, at jeg kun kan se græs.&raquo;',
        'Pjuske har en idé. &laquo;Du kan sidde på hovedet af en af os! Så er du højest af alle.&raquo; Men så skal man gå meget forsigtigt, så Lyn ikke falder af.'],
      ask: 'Hvad ville I gerne kunne se, hvis I var helt små?',
      choices: [
        { label: 'Bær Lyn på hovedet, så han kan se det hele', bevaeg: { goer: 'Læg en bamse eller en bog på hovedet. Det er Lyn. Gå fra den ene ende af stuen til den anden uden at tabe den.', stat: 'Mod', target: 6, win: 'pj3BaekOk', lose: 'pj3BaekFejl' } },
        { label: 'Byg et højt tårn af sten, som Lyn kan sidde på', roll: { stat: 'List', target: 6, win: 'pj3BaekOk', lose: 'pj3BaekFejl' } },
        { label: 'Fortæl Lyn om alt det, han kan se oppe fra bakken', roll: { stat: 'Fantasi', target: 6, win: 'pj3BaekOk', lose: 'pj3BaekFejl' } }
      ]
    },
    pj3BaekOk: {
      title: 'Lyn lyser', gain: true, gnist: LYS('gule', 'Lyn', '#FFE08A', 'Lyn'),
      text: ['Højt oppe kan Lyn se det hele: de mørke træer, bækken, der glimter, og de små, gule vinduer langt væk. &laquo;Hvor er skoven stor!&raquo; råber han.',
        'Han bliver så glad, at han begynder at lyse. Først som en lille prik, så som en rigtig lille lampe. &laquo;Jeg er varm!&raquo; siger Lyn. &laquo;Jeg vil med op på bakken!&raquo;'],
      ask: 'Hvad bliver I glade af at kigge på?',
      next: 'pj3Hub'
    },
    pj3BaekFejl: {
      title: 'Igen, igen!', flag: 'pj3Lyn',
      text: ['I går forsigtigt, men så vipper det. Lyn triller ned, rutsjer over en skulder og lander blødt i en stor mospude. Plop!',
        'Først er der stille. Så griner Lyn så højt, at han lyser en lille smule. &laquo;Igen! Igen!&raquo; Han vil hellere blive og rutsje i mosset med musene. &laquo;Kig efter mig nede fra bakken,&raquo; råber han. &laquo;Jeg blinker til jer!&raquo;'],
      ask: 'Hvad er det sjoveste, I har rutsjet ned ad?',
      next: 'pj3Hub'
    },
    pj3Moll: {
      title: 'Søvnige lysorme', path: 'moll',
      text: ['Inde i Molls hule ligger tre lysorme og sover i en tændstikæske på bogreolen. De snorker bittesmå snork. Sno. Sno. Sno.',
        '&laquo;De kom ind for at varme sig,&raquo; hvisker Moll. &laquo;Og så faldt de i søvn midt i min godnathistorie. Men de ville så gerne lyse for dig i aften, Pjuske. Kan I vække dem, uden at de bliver sure?&raquo;'],
      ask: 'Hvordan kan I bedst lide at blive vækket?',
      choices: [
        { label: 'Syng en blid vågn-op-sang', roll: { stat: 'Venlighed', target: 6, win: 'pj3MollOk', lose: 'pj3MollFejl' } },
        { label: 'Lav sjove lyde, indtil de fniser sig vågne', roll: { stat: 'Humor', target: 6, win: 'pj3MollOk', lose: 'pj3MollFejl' } },
        { label: 'Læs slutningen på Molls historie, så de vil høre, hvordan den ender', roll: { stat: 'Nysgerrighed', target: 6, win: 'pj3MollOk', lose: 'pj3MollFejl' } }
      ]
    },
    pj3MollOk: {
      title: 'Læselyset', gain: true, gnist: LYS('lilla', 'Læselyset', '#9B6BD6', 'Sno'),
      text: ['Den første lysorm gaber. Den anden strækker sig. Den tredje sætter sig op og lyser lilla. &laquo;Er det aften nu?&raquo; spørger de. &laquo;Er det tid til at lyse?&raquo;',
        '&laquo;Det er tid,&raquo; siger Pjuske. De tre lysorme kravler op på hans pigge og sidder der som små lamper. Moll klapper. &laquo;Nu ligner du et juletræ, Pjuske.&raquo;'],
      ask: 'Hvad tror I, lysormene drømte om?',
      next: 'pj3Hub'
    },
    pj3MollFejl: {
      title: 'Sno, sno, sno',
      text: ['Lysormene vender sig bare om og snorker videre. Sno. Sno. Sno. Og nu gaber Moll også. Og Uffe. Og Pjuske.',
        '&laquo;Lad dem bare sove,&raquo; hvisker Moll og lægger et lille lommetørklæde over æsken som en dyne. &laquo;Søvn er også vigtigt. Det ved du jo godt, Pjuske.&raquo; Pjuske nikker og gaber igen.'],
      ask: 'Hvorfor tror I, det er vigtigt at sove?',
      next: 'pj3Hub'
    },
    pj3Krat: {
      title: 'Det mørke krat', path: 'krat',
      text: ['Inde i krattet er det helt mørkt. Jeres lygte kan kun lige lyse på de nærmeste grene. Men langt inde blinker noget svagt. Blink. Pause. Blink.',
        '&laquo;Er der nogen?&raquo; hvisker en stemme. Det er en lysorm, der er kravlet ind for at komme i læ. &laquo;Det er så mørkt, at jeg ikke kan finde ud igen.&raquo;'],
      ask: 'Hvad gør I, når I er lidt bange for mørket?',
      choices: [
        { label: 'Gå roligt ind til lysormen, ét skridt ad gangen', roll: { stat: 'Mod', target: 6, win: 'pj3KratOk', lose: 'pj3KratFejl' } },
        { label: 'Tal hele tiden, så lysormen kan følge jeres stemme', roll: { stat: 'Venlighed', target: 6, win: 'pj3KratOk', lose: 'pj3KratFejl' } },
        { label: 'Blink med lygten, så I blinker til hinanden', roll: { stat: 'List', target: 6, win: 'pj3KratOk', lose: 'pj3KratFejl' } }
      ]
    },
    pj3KratOk: {
      title: 'Blinkelyset', gain: true, gnist: LYS('grønne', 'Blinkelyset', '#B8D86A', 'Blink'),
      text: ['Blink, siger lygten. Blink, svarer lysormen. Blink. Blink. Og så er I ved siden af hinanden. Lysormen kravler op på jeres hånd og lyser grønt.',
        '&laquo;Tak,&raquo; siger den. &laquo;Mørket var ikke så slemt, da I kom. Det var bare mørkt.&raquo;'],
      ask: 'Hvad er godt ved mørket?',
      next: 'pj3Hub'
    },
    pj3KratFejl: {
      title: 'Et blink for langt',
      text: ['I går hen mod blinket, men det var et blankt blad, der spejlede jeres lygte! Den rigtige lysorm har allerede fundet ud selv og sidder og vinker på den anden side af krattet.',
        '&laquo;Jeg fulgte jeres lys!&raquo; råber den glad. &laquo;Vi ses oppe på bakken. Måske.&raquo; Så kryber den ind under et blad for at varme sig lidt først.'],
      ask: 'Kan man hjælpe nogen, selvom det ikke går, som man tænkte?',
      next: 'pj3Hub'
    },
    pj3Bakke: {
      title: 'På bakken i mørket',
      text: function () {
        var g = k.state.gnists;
        var a = 'Oppe på bakken er det helt mørkt. Herfra kan man se ud over hele Lanterneskoven. Pjuske sætter sig i græsset og venter med store øjne.';
        var b = g >= 3 ? '&laquo;' + k.joinNames(k.gnistNames()) + ',&raquo; hvisker Pjuske. &laquo;Er I klar til at lyse?&raquo;'
          : g >= 1 ? '&laquo;Vi har ' + k.joinNames(k.gnistNames()) + ' med,&raquo; hvisker Pjuske. &laquo;Det er nok til et lille lysshow.&raquo;'
          : '&laquo;Vi fandt ingen lysorme,&raquo; siger Pjuske stille. Uffe lægger en vinge om ham. &laquo;Mørket har sine egne lys. Vent bare og se.&raquo;';
        var t = [a, b];
        if (k.state.flags.pj3Lyn) t.push('Langt nede ved bækken blinker der en lille prik. Det er Lyn, der rutsjer i mosset. Blink! Pjuske vinker.');
        return t;
      },
      ask: 'Hvad ønsker I jer at se, når lyset kommer?',
      dyn: function () {
        var c = [];
        if (k.state.gnists > 0) c.push({ label: 'Sluk lygten, og lad lysormene lyse', to: 'pj3EndLys' });
        c.push({ label: 'Råb på skovens venner, så de kommer med lys', to: 'pj3EndVenner' });
        c.push({ label: 'Læg jer i græsset og kig op', to: 'pj3EndStjerner', lock: function () { return k.partyStat('Fantasi') >= 3 || k.partyStat('Nysgerrighed') >= 3 ? null : 'Kræver Fantasi 3 eller Nysgerrighed 3'; } });
        return c;
      }
    },
    pj3EndLys: {
      title: 'Lysormenes dans', end: true, all: true,
      text: function () {
        var navne = k.joinNames(k.gnistNames());
        return ['I slukker lygten. Først er alt sort. Så begynder ' + navne + ' at lyse, én efter én. De kravler rundt i græsset og laver en stor, lysende cirkel om Pjuske.',
          'Pjuske sidder helt stille i midten. Hans øjne skinner. &laquo;Det er endnu smukkere, end jeg troede,&raquo; hvisker han. &laquo;Det er godt, at aftenerne er lange i november. Så kan man se det her.&raquo;',
          'Uffe sætter et flueben ved nummer tre på listen. Nu mangler der kun én ting.'];
      },
      ask: 'Hvad er det smukkeste, I har set i mørket?'
    },
    pj3EndVenner: {
      title: 'En bakke af lys', end: true, all: true,
      text: function () {
        var fl = venneLinjer();
        var a = 'I råber ud i mørket: &laquo;Pjuske vil se lys! Kom op på bakken!&raquo; Så begynder der at komme små lys frem mellem træerne.';
        var slut = 'Ræven har en lanterne i munden, musene bærer på hver sin lille glødende svamp, og lysormene fra hele skoven kravler efter. Snart lyser hele bakken. &laquo;Det er ligesom at sidde midt i en stjernehimmel,&raquo; siger Pjuske.';
        var t = fl.length ? [a, fl.join(' '), slut] : [a, slut];
        t.push('Uffe sætter et flueben ved nummer tre på listen. Nu mangler der kun én ting.');
        return t;
      },
      ask: function () { return venneLinjer().length ? 'Hvem var I gladest for at se i aften?' : 'Hvordan kan man være et lys for en anden?'; }
    },
    pj3EndStjerner: {
      title: 'Himlens lys', end: true, all: true,
      text: function () {
        var t = ['I lægger jer på ryggen i græsset ved siden af Pjuske og slukker lygten. Først er alt sort. Men så vænner øjnene sig til mørket.',
          'Der er stjerner over hele himlen. Hundredvis. Tusindvis. Nogle er store, nogle er bittesmå. &laquo;De har været der hele tiden,&raquo; hvisker Pjuske. &laquo;Man kan bare kun se dem, når det er mørkt.&raquo;'];
        if (k.state.gnists > 0) t.push(k.joinNames(k.gnistNames()) + ' kravler op på Pjuskes næse og lyser med, som små stjerner på jorden.');
        t.push('Uffe sætter et flueben ved nummer tre på listen. Nu mangler der kun én ting.');
        return t;
      },
      ask: 'Hvis I kunne give en stjerne et navn, hvad skulle den så hedde?'
    },
    pj3EndMester: {
      title: 'Mesterens lys', end: true, all: true,
      text: function () {
        var m = k.state.mester || { name: 'Jeres helt', stat: 'Mod' };
        var how = MESTER_TXT[m.stat] || MESTER_TXT.Mod;
        return [how(k.esc(m.name)), 'Pjuske sidder midt i lyset med store, skinnende øjne. &laquo;Nu har jeg set lysormene,&raquo; hvisker han. Uffe sætter et flueben ved nummer tre. Nu mangler der kun én ting på listen.'];
      },
      ask: 'Hvad er I blevet rigtig gode til? Hvordan lærte I det?'
    }
  };

  var magi = {
    pj3Svamp: {
      gnist: { l: 'Skab en gnist, der viser lysormen, hvor smuk den er', to: 'pj3SvampOk' },
      dyr: { l: 'Tal med lysormen på lysormesprog', to: 'pj3SvampOk' },
      syn: { l: 'Se det lille lys, der allerede gemmer sig i lysormen', to: 'pj3SvampOk' },
      latter: { l: 'Strø latterstøv, så lysormen fniser sig lysende', to: 'pj3SvampOk' }
    },
    pj3Baek: {
      gnist: { l: 'Skab en varm gnist, så Lyn holder op med at fryse', to: 'pj3BaekOk' },
      dyr: { l: 'Bed en ugle om at flyve Lyn en tur over skoven', to: 'pj3BaekOk' },
      syn: { l: 'Se den høje sten, hvor Lyn kan sidde sikkert', to: 'pj3BaekOk' },
      latter: { l: 'Strø latterstøv, så Lyn griner sig varm', to: 'pj3BaekOk' }
    },
    pj3Moll: {
      gnist: { l: 'Skab en lille gnist, der vækker lysormene som en solopgang', to: 'pj3MollOk' },
      dyr: { l: 'Hvisk til lysormene på lysormesprog', to: 'pj3MollOk' },
      syn: { l: 'Se, hvilken lysorm der næsten er vågen', to: 'pj3MollOk' },
      latter: { l: 'Strø latterstøv, så lysormene fniser i søvne og vågner', to: 'pj3MollOk' }
    },
    pj3Krat: {
      gnist: { l: 'Skab en gnist, der lyser hele krattet op', to: 'pj3KratOk' },
      dyr: { l: 'Spørg en pindsvinefætter, der kender krattet', to: 'pj3KratOk' },
      syn: { l: 'Se den skjulte sti ind til lysormen', to: 'pj3KratOk' },
      latter: { l: 'Strø latterstøv, så lysormen griner og lyser op', to: 'pj3KratOk' }
    },
    pj3Hub: {
      syn: { l: 'Se det svage blink inde i krattet', to: 'pj3Krat', show: function () { return k.state.visited.indexOf('krat') < 0 && !!k.lockTxt('Mod', 2); } }
    },
    pj3Bakke: {
      gnist: { l: 'Skab en ekstra lysorm af gnister', to: 'pj3Bakke', eff: function (h) { k.state.gnists++; k.state.gnistList.push({ key: 'magi_' + h.id + '_' + k.state.gnists, c: 'magiske', def: k.gen(h.name) + ' lysorm', col: '#F2C94C', ph: 'Gnistorm', name: '' }); } },
      dyr: { l: 'Bed skovens dyr om at komme med lys', to: 'pj3EndVenner' },
      syn: { l: 'Se stjernerne bag skyerne', to: 'pj3EndStjerner' }
    }
  };

  /* Mester-valg: når en helt har 5 i et træk, åbner der sig et ekstra valg i scenen (uden terning). */
  var mester = {
    pj3Svamp: [
      { stat: 'Venlighed', l: 'Fortæl lysormen, at det er dens lys, Tut holder allermest af', to: 'pj3SvampOk', n: function (n) { return n + ' fortæller lysormen, at Tut holder af dens lys mere end af noget andet. Lysormen bliver så glad, at den straks lyser.'; } }
    ],
    pj3Baek: [
      { stat: 'Mod', l: 'Gå helt roligt, som om Lyn var en krone', to: 'pj3BaekOk', n: function (n) { return n + ' går så roligt og ret, at Lyn sidder som en lille krone på hovedet hele vejen.'; } },
      { stat: 'Fantasi', l: 'Lav en lille luftballon af et blad til Lyn', to: 'pj3BaekOk', n: function (n) { return n + ' laver en luftballon af et blad og en tråd, og Lyn svæver op over bækken og kigger ud over det hele.'; } }
    ],
    pj3Moll: [
      { stat: 'Humor', l: 'Snork endnu højere end lysormene, så de vågner af grin', to: 'pj3MollOk', n: function (n) { return n + ' snorker så højt og så sjovt, at lysormene vågner af grin og begynder at lyse.'; } }
    ],
    pj3Krat: [
      { stat: 'Mod', l: 'Gå lige ind i mørket uden lygte', to: 'pj3KratOk', n: function (n) { return n + ' går roligt ind i mørket uden lygte. Så kan lysormen se, at mørket ikke er farligt, og kravler med det samme hen til jer.'; } }
    ],
    pj3Bakke: []
  };
  k.stats.forEach(function (t) {
    mester.pj3Bakke.push({ stat: t[0], l: 'Brug mester-trækket ' + t[0] + ' til at tænde bakken', to: 'pj3EndMester', eff: function (h, stat) { k.state.mester = { name: h.name, stat: stat }; } });
  });

  /* Billeder til scenerne, tegnet med delene i art/dele.js (LK.art.scene). Koordinater i en ramme på 400 x 250. */
  var PJ = function (x, y, h, s) { return { navn: 'pind', x: x, y: y, skala: s || 0.65, humoer: h }; };
  var UF = function (x, y, h, s) { return { navn: 'uffe', x: x, y: y, skala: s || 0.65, humoer: h }; };
  var LO = function (x, y, h, s) { return { navn: 'lysorm', x: x, y: y, skala: s || 0.6, humoer: h }; };
  var LYGTE = function (x, y) { return { navn: 'lanterne', x: x, y: y, taendt: true, skala: 0.9 }; };
  var billeder = {
    pj3Start: { sted: 'vindue', himmel: 'nat', alt: 'Uffe sidder i vindueskarmen, og udenfor i mørket står Pjuske.',
      figurer: [{ navn: 'uffe', x: 145, y: 141, skala: 0.9, humoer: 'glad' }, { navn: 'pind', x: 268, y: 150, skala: 0.45, humoer: 'overrasket' }] },
    pj3Liste: { sted: 'vindue', himmel: 'nat', alt: 'Pjuske viser sin liste på et stort egeblad.',
      ting: [{ navn: 'blade', x: 268, y: 100, skala: 0.5 }],
      figurer: [{ navn: 'uffe', x: 145, y: 141, skala: 0.9, humoer: 'glad' }, { navn: 'pind', x: 268, y: 150, skala: 0.45, humoer: 'glad' }] },
    pj3Hub: { sted: 'skovsti', himmel: 'nat', alt: 'Pjuske går på den mørke sti med en lille lygte, og Uffe flyver foran.',
      ting: [LYGTE(205, 170)],
      figurer: [PJ(160, 200, 'rolig'), UF(290, 192, 'glad', 0.65)] },
    pj3Svamp: { sted: 'sump', himmel: 'nat', alt: 'Tut står i sumpen med en mørk svampelygte.',
      ting: [{ navn: 'svamp', x: 260, y: 222 }],
      figurer: [{ navn: 'tut', x: 190, y: 190, skala: 0.8, humoer: 'bekymret' }, PJ(80, 205, 'bekymret', 0.55)] },
    pj3SvampOk: { sted: 'sump', himmel: 'nat', alt: 'Svampen lyser blågrønt, og sumpen glimter.',
      ting: [{ navn: 'svamp', x: 260, y: 222, taendt: true, skala: 1.2 }],
      figurer: [{ navn: 'tut', x: 190, y: 190, skala: 0.8, humoer: 'glad' }, PJ(80, 205, 'glad', 0.55)] },
    pj3SvampFejl: { sted: 'sump', himmel: 'nat', alt: 'Svampen har nyst, og Tut er fuld af små prikker og griner.',
      ting: [{ navn: 'svamp', x: 260, y: 222 }, { navn: 'snefald', x: 200, y: 150, skala: 0.35 }],
      figurer: [{ navn: 'tut', x: 190, y: 190, skala: 0.8, humoer: 'glad' }, PJ(80, 205, 'overrasket', 0.55)] },
    pj3Baek: { sted: 'baek', himmel: 'nat', alt: 'En bitte lille lysorm sidder på en sten ved bækken og fryser.',
      figurer: [LO(232, 207, 'bekymret', 0.5), PJ(110, 178, 'bekymret')] },
    pj3BaekOk: { sted: 'baek', himmel: 'nat', alt: 'Lysormen Lyn lyser som en lille lampe og kigger ud over skoven.',
      figurer: [PJ(150, 178, 'glad'), LO(150, 138, 'glad', 0.5)] },
    pj3BaekFejl: { sted: 'baek', himmel: 'nat', alt: 'Lyn er rutsjet ned i en mospude og griner.',
      figurer: [LO(250, 185, 'glad', 0.5), PJ(110, 178, 'overrasket'), { navn: 'mus', x: 340, y: 180, skala: 0.55 }] },
    pj3Moll: { sted: 'hule', himmel: 'nat', alt: 'Moll hvisker, mens tre lysorme sover i hulen.',
      ting: [{ navn: 'bog', x: 280, y: 232 }],
      figurer: [{ navn: 'moll', x: 190, y: 192, humoer: 'rolig' }, LO(300, 205, 'rolig', 0.4), PJ(80, 212, 'overrasket', 0.55)] },
    pj3MollOk: { sted: 'hule', himmel: 'nat', alt: 'Lysormene er vågnet og lyser lilla, og Moll klapper.',
      ting: [{ navn: 'bog', x: 280, y: 232, taendt: true }, { navn: 'gnist', x: 90, y: 150, taendt: true, farve: 'lilla' }],
      figurer: [{ navn: 'moll', x: 190, y: 192, humoer: 'glad' }, PJ(80, 212, 'glad', 0.55)] },
    pj3MollFejl: { sted: 'hule', himmel: 'nat', alt: 'Lysormene sover videre, og Moll og Pjuske gaber.',
      ting: [{ navn: 'bog', x: 280, y: 232 }],
      figurer: [{ navn: 'moll', x: 190, y: 192, humoer: 'rolig' }, LO(300, 205, 'rolig', 0.4), PJ(80, 212, 'rolig', 0.55)] },
    pj3Krat: { sted: 'tornekrat', himmel: 'nat', maane: false, alt: 'Det mørke krat, hvor et svagt lys blinker langt inde.',
      ting: [LYGTE(110, 170), { navn: 'gnist', x: 290, y: 190, skala: 0.6, taendt: true, farve: 'groen' }],
      figurer: [PJ(160, 205, 'bekymret')] },
    pj3KratOk: { sted: 'tornekrat', himmel: 'nat', maane: false, alt: 'En lysorm lyser grønt og sidder glad ved Pjuske.',
      ting: [LYGTE(110, 170)],
      figurer: [PJ(170, 205, 'glad'), LO(260, 200, 'glad', 0.55)] },
    pj3KratFejl: { sted: 'tornekrat', himmel: 'nat', maane: false, alt: 'Et blankt blad spejler lygten, og Pjuske kigger overrasket.',
      ting: [LYGTE(110, 170), { navn: 'gnist', x: 360, y: 180, skala: 0.5, taendt: true, farve: 'groen' }],
      figurer: [PJ(190, 205, 'overrasket')] },
    pj3Bakke: { sted: 'bjerg', himmel: 'nat', alt: 'Pjuske sidder på den mørke bakke og venter, og Uffe sidder ved siden af.',
      figurer: [PJ(150, 205, 'rolig'), UF(260, 196, 'rolig', 0.6)] },
    pj3EndLys: { sted: 'bjerg', himmel: 'nat', alt: 'Lysormene laver en lysende cirkel om Pjuske i græsset.',
      ting: [{ navn: 'gnist', x: 100, y: 228, taendt: true }, { navn: 'gnist', x: 150, y: 238, taendt: true, farve: 'groen' }, { navn: 'gnist', x: 250, y: 238, taendt: true, farve: 'lilla' }, { navn: 'gnist', x: 300, y: 228, taendt: true, farve: '#4FC3B0' }],
      figurer: [PJ(200, 205, 'glad')] },
    pj3EndVenner: { sted: 'bjerg', himmel: 'nat', alt: 'Ræven, musen og lysormene kommer op på bakken med små lys.',
      ting: [{ navn: 'lanterne', x: 95, y: 150, taendt: true }, { navn: 'svamp', x: 290, y: 232, taendt: true }],
      figurer: [{ navn: 'raev', x: 70, y: 188, skala: 0.7 }, PJ(180, 205, 'glad', 0.6), { navn: 'mus', x: 250, y: 204, skala: 0.55 }, LO(340, 205, 'glad', 0.5)] },
    pj3EndStjerner: { sted: 'lysning', himmel: 'nat', maane: false, alt: 'Pjuske ligger i græsset og kigger op på en himmel fuld af stjerner.',
      ting: [{ navn: 'gnist', x: 120, y: 60, skala: 0.6, taendt: true }, { navn: 'gnist', x: 280, y: 40, skala: 0.5, taendt: true }, { navn: 'gnist', x: 330, y: 95, skala: 0.4, taendt: true }],
      figurer: [PJ(160, 210, 'rolig'), UF(260, 200, 'rolig', 0.55)] },
    pj3EndMester: { sted: 'bjerg', himmel: 'nat', alt: 'Hele bakken lyser, og Pjuske sidder midt i lyset.',
      ting: [{ navn: 'gnist', x: 110, y: 228, taendt: true }, { navn: 'gnist', x: 290, y: 228, taendt: true, farve: 'groen' }, { navn: 'lanterne', x: 200, y: 140, taendt: true }],
      figurer: [PJ(200, 205, 'glad')] }
  };

  return {
    id: '2026-11-pjuske-3', type: 'maaned', udgives: '2026-11-20',
    serie: { id: '2026-11-pjuske', titel: 'Pjuskes efterårsliste' }, kapitel: 3, kapitler: 4,
    start: 'pj3Start', title: 'Den lange aften', tag: 'November',
    blurb: 'Det er mørkt allerede om eftermiddagen, og Pjuske vil se lysormene lyse. Men de har gemt sig for kulden.',
    scenes: scenes, magi: magi, mester: mester, billeder: billeder
  };
});
