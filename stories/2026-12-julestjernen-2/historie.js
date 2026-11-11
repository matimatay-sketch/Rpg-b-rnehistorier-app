// Månedens historier, december 2026: Julestjernen, kapitel 2 af 4: Tut på Månesøen. Historiefil: registrerer sig med LK.addStory og får kit-hjælperne som k.
// Et kapitel står for sig selv. Det må læse vennerne fra sagaen, men sætter aldrig venne-flag.
// Det andet stykke af julestjernen sidder på Tuts hat. Tut skøjter rundt på Månesøen og kan ikke stoppe.
// I bliver inde på bredden hele tiden og samler det, der kan hjælpe Tut med at stoppe blødt ved bredden.
LK.addStory(function (k) {
  var PATHS = [
    { id: 'bred', to: 'js2Bred', label: 'Byg noget blødt inde på bredden' },
    { id: 'krage', to: 'js2Krage', label: 'Gå hen til kragen, der står på ét ben ved sivene' },
    { id: 'mus', to: 'js2Mus', label: 'Følg den lille sang under den væltede båd' }
  ];
  // Det, I finder til at hjælpe Tut, er en gnist med sit eget navn.
  var FUND = function (c, def, col, ph) { return { c: c, def: def, col: col, ph: ph }; };

  var MESTER_TXT = {
    Mod: function (n) { return n + ' stiller sig helt ude ved kanten af bredden, med begge fødder på land, og råber med sin klareste stemme: &laquo;Tut! Kig på mig! Bøj knæene, og sæt dig ned!&raquo; Tut gør det, og han glider langsomt og blødt ind i sneen lige foran ' + n + '.'; },
    List: function (n) { return n + ' lægger en lang række snebolde ud langs bredden, så de danner en blød kurve. Tut glider hen langs kurven, langsommere og langsommere, til han står stille ved bredden.'; },
    Venlighed: function (n) { return n + ' taler så roligt til Tut, at han holder op med at være bange. &laquo;Du kan godt,&raquo; siger ' + n + '. Tut trækker vejret dybt, bøjer knæene og stopper helt af sig selv.'; },
    Fantasi: function (n) { return n + ' råber trinene til en dans ud til Tut, som om isen var et dansegulv. Et skridt til siden, et lille buk, og så en blød sidde-ned. Tut danser sig langsomt og blødt hen til bredden.'; },
    Humor: function (n) { return n + ' laver så sjove ansigter inde fra bredden, at Tut begynder at grine. Han griner så meget, at han sætter sig ned på isen og glider stille ind til bredden.'; },
    Nysgerrighed: function (n) { return n + ' spørger Tut, hvordan hans skøjter ser ud nedenunder. Tut kigger ned for at se efter, bøjer sig forover og glider langsommere og langsommere, til han står stille ved bredden.'; }
  };

  // Venner fra sagaen, der kommer ned til søen. Historiens egne linjer i stedet for k.friendLines(), som er skrevet
  // til sagaen. Nusse og Tut er med i hele kapitlet og nævnes derfor ikke her.
  function venneLinjer() {
    var f = k.state.flags, o = [];
    if (f.mollLoefte) o.push('Moll kommer gående med en stak julekort under armen. &laquo;Jeg skal alligevel aflevere et til Tut,&raquo; siger hun og stiller sig ved bredden.');
    if (f.vindVen) o.push('Vinden lægger sig helt stille, så Tut ikke bliver blæst endnu hurtigere rundt.');
    if (f.maaneVen) o.push('Månen kigger frem og lægger et blødt sølvlys hen over isen, så alle kan se, hvor Tut er.');
    return o;
  }

  var scenes = {
    js2Start: {
      title: 'Is på søen',
      text: function () {
        var t = ['Det er koldt i Lanterneskoven, og der ligger sne på alle grenene. Uffe sidder på vindueskarmen og pudser sine fjer.',
          'Så banker det på ruden. Det er nissen Nusse med sin kælk. &laquo;Det første stykke af julestjernen blev fundet på kælkebakken,&raquo; siger han og viser en lille æske med vat. &laquo;Og nu har jeg set det næste. Det sidder på Tuts hat nede på Månesøen!&raquo;'];
        if (k.state.flags.nusseVen) t.push('Nusse smiler til jer. &laquo;Godt, det er jer. I er altid gode til at hjælpe.&raquo;');
        return t;
      },
      ask: 'Hvad tror I, Tut laver på en frossen sø?',
      choices: [{ label: 'Tag huer og vanter på, og gå med Nusse', to: 'js2Hub' }, { label: 'Spørg Nusse, hvordan stykket kom op på Tuts hat', to: 'js2Hvad' }]
    },
    js2Hvad: {
      title: 'Tuts nye skøjter',
      text: ['&laquo;Da Uffe nøs, og stjernen sprang i stykker, fløj ét stykke helt ned til søen,&raquo; fortæller Nusse. &laquo;Det landede på Tuts hat. Han tror, det er julepynt.&raquo;',
        '&laquo;Og Tut har fået skøjter,&raquo; siger Uffe. &laquo;Han har lært at køre. Men han har glemt at lære at stoppe.&raquo; Nusse ser alvorlig ud. &laquo;Vi bliver inde på bredden. Man kan ikke se, hvor tyk isen er.&raquo;',
        'Uffe plukker en lille fjer af sin vinge. &laquo;Tag den med. Den giver held. Brug den, når I slår med terningen.&raquo;'],
      gainFeather: true,
      ask: 'Hvad er det første, man skal lære, når man prøver noget nyt?',
      choices: [{ label: 'Vi bliver på bredden. Afsted!', to: 'js2Hub' }]
    },
    js2Hub: {
      title: 'Ved Månesøen',
      text: function () {
        var g = k.state.gnists, v = k.state.visited.length;
        if (v === 0) return ['Månesøen er frosset til og glitrer som glas. Ude på isen kører Tut på skøjter. Rundt og rundt og rundt. På toppen af hans hat sidder stjernestumpen og lyser.',
          '&laquo;Hjææælp!&raquo; synger Tut, mens han suser forbi. &laquo;Jeg kan ikke stoppe!&raquo; Nusse holder jer i ærmet. &laquo;Vi går ikke ud på isen. Vi finder noget herinde, der kan hjælpe ham.&raquo;'];
        var a = 'I kommer tilbage til bredden. Tut suser stadig rundt derude og vinker, hver gang han kommer forbi.';
        var b = g === 0 ? '&laquo;Vi har ikke fundet noget endnu,&raquo; siger Nusse. &laquo;Skal vi lede et sted til, eller prøve at hjælpe Tut nu?&raquo;'
          : g === 1 ? '&laquo;Det er en god begyndelse,&raquo; siger Nusse. &laquo;Men Tut kører stærkt. Måske skal vi finde lidt mere. I bestemmer.&raquo;'
          : '&laquo;Nu har vi meget, der kan hjælpe Tut,&raquo; siger Nusse. &laquo;Men jo mere, jo blødere. I bestemmer.&raquo;';
        var left = PATHS.filter(function (p) { return k.state.visited.indexOf(p.id) < 0; }).length + (k.state.visited.indexOf('is') < 0 ? 1 : 0);
        return [a, b + (left === 0 ? ' Der er ikke flere steder at lede.' : '')];
      },
      ask: 'Hvordan kan man hjælpe en, der ikke kan stoppe, uden selv at gå ud på isen?',
      dyn: function () {
        var c = PATHS.filter(function (p) { return k.state.visited.indexOf(p.id) < 0; }).map(function (p) { return { label: p.label, to: p.to }; });
        if (k.state.visited.indexOf('is') < 0) c.push({ label: 'Kig godt efter, hvordan isen ser ud', to: 'js2Is', lock: function () { return k.lockTxt('Nysgerrighed', 2); } });
        if (k.state.visited.length > 0) c.push({ label: 'Gå hen til bredden, hvor Tut kommer forbi', to: 'js2Bredden' });
        return c;
      }
    },
    js2Bred: {
      title: 'Den bløde bred', path: 'bred',
      text: ['Inde på bredden ligger der masser af blød, ny sne. &laquo;Hvis vi bygger en stor, blød snevold lige her, kan Tut glide ind i den,&raquo; siger Nusse. &laquo;Så stopper han blødt.&raquo;',
        'Men sneen er let og fnugget, og den vil ikke rigtig blive, hvor man lægger den.'],
      ask: 'Hvad ville I bygge af sne, hvis I kunne bygge hvad som helst?',
      choices: [
        { label: 'Rul store snebolde, og stil dem på række', roll: { stat: 'List', target: 6, win: 'js2BredOk', lose: 'js2BredFejl' } },
        { label: 'Skub den allerstørste snebold på plads', roll: { stat: 'Mod', target: 6, win: 'js2BredOk', lose: 'js2BredFejl' } },
        { label: 'Byg volden som en stor, blød sofa', roll: { stat: 'Fantasi', target: 6, win: 'js2BredOk', lose: 'js2BredFejl' } }
      ]
    },
    js2BredOk: {
      title: 'Snevolden', gain: true, gnist: FUND('hvide', 'Den bløde snevold', '#F7EBD0', 'Puf'),
      text: ['Snebold efter snebold kommer på plads, og I klapper dem godt sammen med vanterne. Snart står der en lang, blød snevold langs bredden.',
        'Uffe hopper op på den og synker lidt ned. &laquo;Hu-hu! Den er blød som en dyne,&raquo; siger han. &laquo;Her vil jeg gerne lande, hvis jeg var en tudse på skøjter.&raquo;'],
      ask: 'Hvad er det blødeste, I nogensinde har landet i?',
      next: 'js2Hub'
    },
    js2BredFejl: {
      title: 'Puf!',
      text: ['I bygger og bygger, men sneen er for let. Lige da volden er færdig, siger det PUF, og den falder sammen til en flad bunke.',
        'Uffe sad på toppen. Nu sidder han midt i bunken med sne på hovedet som en hvid hue. &laquo;Jeg er en snemand nu,&raquo; siger han. Nusse griner. &laquo;En meget lille en. Vi finder noget andet.&raquo;'],
      ask: 'Hvordan kan man grine af et uheld sammen?',
      next: 'js2Hub'
    },
    js2Krage: {
      title: 'Kragen på ét ben', path: 'krage',
      text: ['Ved sivene står en krage i sneen. Den står på ét ben og har gemt det andet ben inde i fjerene. &laquo;Det holder foden varm,&raquo; siger den. &laquo;Og så står man helt stille.&raquo;',
        '&laquo;Den, der kan stå stille, kan også lære andre at stoppe,&raquo; siger kragen. &laquo;Vis mig, at I kan stå som mig. Så lærer jeg jer et trick, I kan råbe ud til Tut.&raquo;'],
      ask: 'Hvordan holder I balancen, når I står på ét ben?',
      choices: [
        { label: 'Stå på ét ben, ligesom kragen', bevaeg: { goer: 'Stå på ét ben, ligesom kragen, og tæl sammen til ti. Prøv at stå helt stille.', stat: 'Mod', target: 6, win: 'js2KrageOk', lose: 'js2KrageFejl' } },
        { label: 'Spørg kragen pænt om tricket', roll: { stat: 'Venlighed', target: 6, win: 'js2KrageOk', lose: 'js2KrageFejl' } },
        { label: 'Lav den sjoveste krage-stilling', roll: { stat: 'Humor', target: 6, win: 'js2KrageOk', lose: 'js2KrageFejl' } }
      ]
    },
    js2KrageOk: {
      title: 'Kragens trick', gain: true, gnist: FUND('sorte', 'Kragens trick', '#4A4A5A', 'Kra'),
      text: ['Kragen nikker anerkendende. &laquo;Kra! I står som rigtige kragefødder.&raquo; Så hvisker den tricket: &laquo;Bøj knæene, læn dig lidt tilbage, og sæt dig blødt ned. Så stopper man.&raquo;',
        '&laquo;Bøj knæene, og sæt dig blødt ned,&raquo; gentager Nusse. &laquo;Det kan vi råbe til Tut.&raquo;'],
      ask: 'Hvem har lært jer et godt trick?',
      next: 'js2Hub'
    },
    js2KrageFejl: {
      title: 'Vakle-vakle', flag: 'js2Vaklede',
      text: ['I står på ét ben. Så vakler I lidt. Kragen vakler også. Så vakler I alle sammen, og PLUMP! I sætter jer i den bløde sne, både I og kragen.',
        'Kragen griner, så den hikker. &laquo;Kra! Det er meget sværere i vinterstøvler,&raquo; siger den. &laquo;Nu er min fod kold. Jeg flyver hjem og varmer den.&raquo; Og så er den væk, med tricket og det hele.'],
      ask: 'Hvordan føles det, når man vakler? Er det sjovt eller svært?',
      next: 'js2Hub'
    },
    js2Mus: {
      title: 'Musenes vals', path: 'mus',
      text: ['Under en væltet båd ved bredden bor en musefamilie. Derinde synger de, og sangen er så langsom og blød, at man næsten bliver søvnig.',
        '&laquo;Det er vores vintervals,&raquo; piber den mindste mus. &laquo;Når man hører den, bliver man langsommere og langsommere. Vi kan lære jer den, men kun hvis I synger med på den rigtige måde.&raquo;'],
      ask: 'Hvilken sang gør jer rolige og søvnige?',
      choices: [
        { label: 'Syng helt stille med, som en vuggevise', roll: { stat: 'Venlighed', target: 6, win: 'js2MusOk', lose: 'js2MusFejl' } },
        { label: 'Find på nye vers om Tut sammen med musene', roll: { stat: 'Fantasi', target: 6, win: 'js2MusOk', lose: 'js2MusFejl' } },
        { label: 'Syng med i den dybeste brummestemme', roll: { stat: 'Humor', target: 6, win: 'js2MusOk', lose: 'js2MusFejl' } }
      ]
    },
    js2MusOk: {
      title: 'Den langsomme vals', gain: true, gnist: FUND('blå', 'Den langsomme vals', '#4A90D9', 'Vals'),
      text: ['I synger sammen med musene. Én, to, tre. Én, to, tre. Langsomt og blødt. Selv Uffe gaber.',
        '&laquo;Nu kan I den,&raquo; piber den mindste mus. &laquo;Syng den for Tut, så kører han langsommere og langsommere.&raquo;'],
      ask: 'Hvem ville I synge en vals for?',
      next: 'js2Hub'
    },
    js2MusFejl: {
      title: 'Hurtig-valsen',
      text: ['I synger med, men lidt for hurtigt. Så synger musene også hurtigere. Og hurtigere. Snart er valsen blevet til en rask, lille hoppedans, og musene hopper rundt under båden.',
        '&laquo;Nu er vi slet ikke søvnige!&raquo; piber den mindste mus og griner. &laquo;Den sang vil ikke hjælpe Tut. Han ville bare køre endnu hurtigere.&raquo;'],
      ask: 'Hvad er jeres yndlingssang at danse til?',
      next: 'js2Hub'
    },
    js2Is: {
      title: 'Den ru plet', path: 'is',
      text: ['I står på bredden og kigger ud over isen. Den meste is er glat og blank som et spejl. Men et sted er den måske ru og grå, så skøjterne kan bremse der.',
        '&laquo;Hvis vi kan finde det sted, kan vi råbe til Tut, hvor han skal køre hen,&raquo; siger Nusse. &laquo;Men solen glitrer så meget i isen.&raquo;'],
      ask: 'Hvordan ser man noget, der er svært at få øje på?',
      choices: [
        { label: 'Kig længe og stille ud over isen', roll: { stat: 'Nysgerrighed', target: 6, win: 'js2IsOk', lose: 'js2IsFejl' } },
        { label: 'Hold vanterne op som en skygge for øjnene', roll: { stat: 'List', target: 6, win: 'js2IsOk', lose: 'js2IsFejl' } },
        { label: 'Spørg en and, der står på bredden', roll: { stat: 'Venlighed', target: 6, win: 'js2IsOk', lose: 'js2IsFejl' } }
      ]
    },
    js2IsOk: {
      title: 'Den ru plet', gain: true, gnist: FUND('grå', 'Den ru plet', '#9AA5B1', 'Ru'),
      text: ['Dér! Lige ud for bredden er isen grå og ru, som sandpapir. Den ligger lige der, hvor Tut kommer forbi, hver gang han kører rundt.',
        '&laquo;Hvis Tut kører hen over den, bremser skøjterne helt af sig selv,&raquo; siger Nusse. &laquo;Og så er han lige ved bredden.&raquo;'],
      ask: 'Hvad har I opdaget, fordi I kiggede ekstra godt efter?',
      next: 'js2Hub'
    },
    js2IsFejl: {
      title: 'Glitter overalt',
      text: ['I kigger og kigger, men solen glitrer i isen, så det hele ser ens ud. Glitter her, glitter dér, glitter overalt.',
        'Til sidst ser I små glitterprikker, selv når I lukker øjnene. &laquo;Hu-hu, jeg ser stjerner,&raquo; siger Uffe og blinker. &laquo;Desværre ikke den rigtige.&raquo;'],
      ask: 'Hvad er det smukkeste, I har set glitre?',
      next: 'js2Hub'
    },
    js2Bredden: {
      title: 'Tut kommer forbi',
      text: function () {
        var g = k.state.gnists;
        var a = 'I stiller jer helt ude ved kanten af bredden, med fødderne på land. Ude på isen kommer Tut susende. Stjernestumpen på hans hat blinker. &laquo;Hjææælp!&raquo;';
        var b = g >= 3 ? '&laquo;Vi har ' + k.joinNames(k.gnistNames()) + ',&raquo; siger Nusse. &laquo;Nu stopper Tut blødere end nogensinde!&raquo;'
          : g >= 1 ? '&laquo;Vi har ' + k.joinNames(k.gnistNames()) + ',&raquo; siger Nusse. &laquo;Det skal nok hjælpe Tut.&raquo;'
          : '&laquo;Vi fandt ikke noget,&raquo; siger Nusse og kigger ud på Tut. Uffe lægger en vinge om ham. &laquo;Men vi er her. Og vi kan råbe på hjælp.&raquo;';
        var t = [a, b];
        if (k.state.flags.js2Vaklede) t.push('Der er stadig sne bag på jeres bukser fra kragens sted. Uffe fniser og børster det af med vingen.');
        return t;
      },
      ask: 'Hvordan tror I, Tut har det derude på isen?',
      dyn: function () {
        var c = [];
        if (k.state.gnists > 0) c.push({ label: 'Hjælp Tut med det, I har fundet', to: 'js2EndStop' });
        c.push({ label: 'Råb på skovens venner', to: 'js2EndVenner' });
        c.push({ label: 'Syng en vuggevise, så Tut bliver søvnig', to: 'js2EndVise', lock: function () { return k.partyStat('Fantasi') >= 3 || k.partyStat('Venlighed') >= 3 ? null : 'Kræver Fantasi 3 eller Venlighed 3'; } });
        return c;
      }
    },
    js2EndStop: {
      title: 'Isstumpen', end: true, all: true,
      text: function () {
        var t = ['Med ' + k.joinNames(k.gnistNames()) + ' hjælper I Tut. Han kører langsommere og langsommere, og til sidst glider han blødt ind i sneen ved bredden. PUF! Han sidder helt stille med et stort smil.',
          '&laquo;Tak!&raquo; siger Tut og rækker jer stumpen fra sin hat. &laquo;Jeg troede, det var julepynt. Næste gang lærer jeg at stoppe først. Og jeg spørger en voksen, om isen er tyk nok.&raquo;'];
        t.push('Nusse lægger stumpen i æsken ved siden af den første. To stumper! &laquo;Næste fredag besøger vi Moll,&raquo; siger han.');
        return t;
      },
      ask: 'Hvad var det bedste valg, I tog i dag?'
    },
    js2EndVenner: {
      title: 'En bred af venner', end: true, all: true,
      text: function () {
        var fl = venneLinjer();
        var a = 'I råber ud over søen: &laquo;Vil nogen hjælpe Tut?&raquo; Først er alt stille. Så knaser det i sneen.';
        var slut = 'En ræv, nogle mus og en krage kommer. Alle stiller sig på bredden og råber sammen: &laquo;Bøj knæene, Tut! Sæt dig ned!&raquo; Tut gør det, og han glider langsomt ind til bredden og stopper i sneen. PUF. &laquo;Det var ligesom at blive grebet af venner,&raquo; siger han og giver jer stumpen fra sin hat.';
        var t = fl.length ? [a, fl.join(' '), slut] : [a, slut];
        t.push('Nusse lægger stumpen i sin æske. &laquo;To fundet. To tilbage,&raquo; hvisker Nusse glad.');
        return t;
      },
      ask: function () { return venneLinjer().length ? 'Hvem var I gladest for at se i dag?' : 'Hvornår har I sidst fået hjælp af en ven? Hvordan føltes det?'; }
    },
    js2EndVise: {
      title: 'Vuggevisen', end: true, all: true,
      text: function () {
        var t = ['I stiller jer på bredden og synger en blød vuggevise. Nusse synger med, og Uffe hu-huer stille i takt.',
          'Ude på isen begynder Tut at gabe. Han kører langsommere og langsommere. Til sidst sætter han sig ned og glider stille ind til bredden, hvor han falder i søvn med hovedet i sneen. Han snorker. Pip-snork.'];
        if (k.state.gnists > 0) t.push(k.joinNames(k.gnistNames()) + ' skulle I slet ikke bruge. Det gør ikke noget.');
        t.push('Nusse løfter forsigtigt stumpen af Tuts hat og lægger sin egen varme hue på ham i stedet. Da Tut vågner, griner han. &laquo;Det var den bedste lur, jeg har fået på skøjter.&raquo; To stumper er fundet.');
        return t;
      },
      ask: 'Hvilken vuggevise ville I synge for Tut?'
    },
    js2EndMester: {
      title: 'Mesterens stop', end: true, all: true,
      text: function () {
        var m = k.state.mester || { name: 'Jeres helt', stat: 'Mod' };
        var how = MESTER_TXT[m.stat] || MESTER_TXT.Mod;
        return [how(k.esc(m.name)), '&laquo;Tak!&raquo; siger Tut og giver jer stumpen fra sin hat. Nusse lægger den i æsken ved siden af den første. &laquo;To fundet,&raquo; siger han. &laquo;Næste fredag besøger vi Moll.&raquo;'];
      },
      ask: 'Hvad er I blevet rigtig gode til? Hvordan lærte I det?'
    }
  };

  var magi = {
    js2Bred: {
      gnist: { l: 'Skab en gnist, der gør sneen klæbrig som snebolde', to: 'js2BredOk' },
      dyr: { l: 'Spørg en ræv, om den vil hjælpe med at grave sne sammen', to: 'js2BredOk' },
      syn: { l: 'Se, hvor sneen er våd og god at bygge med', to: 'js2BredOk' },
      latter: { l: 'Strø latterstøv, så sneen griner og klumper sig sammen', to: 'js2BredOk' }
    },
    js2Krage: {
      gnist: { l: 'Skab en gnist, der holder jer helt stille', to: 'js2KrageOk' },
      dyr: { l: 'Spørg kragen på kragesprog om tricket', to: 'js2KrageOk' },
      syn: { l: 'Se, hvordan kragen holder balancen', to: 'js2KrageOk' },
      latter: { l: 'Strø latterstøv, så kragen griner tricket ud', to: 'js2KrageOk' }
    },
    js2Mus: {
      gnist: { l: 'Skab en gnist, der svæver i takt til valsen', to: 'js2MusOk' },
      dyr: { l: 'Syng med på musesprog', to: 'js2MusOk' },
      syn: { l: 'Se noderne, musene har ridset i båden', to: 'js2MusOk' },
      latter: { l: 'Strø latterstøv, så musene fniser valsen frem', to: 'js2MusOk' }
    },
    js2Is: {
      gnist: { l: 'Skab en gnist, der lyser op over den ru plet', to: 'js2IsOk' },
      dyr: { l: 'Spørg en and på bredden, hvor den bremser', to: 'js2IsOk' },
      syn: { l: 'Se forskellen på den glatte og den ru is', to: 'js2IsOk' },
      latter: { l: 'Strø latterstøv, så isen griner og rynker sig', to: 'js2IsOk' }
    },
    js2Hub: {
      syn: { l: 'Se, hvordan isen ser ud derude', to: 'js2Is', show: function () { return k.state.visited.indexOf('is') < 0 && !!k.lockTxt('Nysgerrighed', 2); } }
    },
    js2Bredden: {
      gnist: { l: 'Skab en ekstra hjælper til Tut', to: 'js2Bredden', eff: function (h) { k.state.gnists++; k.state.gnistList.push({ key: 'magi_' + h.id + '_' + k.state.gnists, c: 'magiske', def: k.gen(h.name) + ' snepude', col: '#F2C94C', ph: 'Pude', name: '' }); } },
      dyr: { l: 'Bed skovens dyr om at hjælpe', to: 'js2EndVenner' },
      latter: { l: 'Strø latterstøv, så Tut bliver glad og søvnig', to: 'js2EndVise' }
    }
  };

  /* Mester-valg: når en helt har 5 i et træk, åbner der sig et ekstra valg i scenen (uden terning). */
  var mester = {
    js2Bred: [
      { stat: 'List', l: 'Byg volden som en bue, der bremser langsomt', to: 'js2BredOk', n: function (n) { return n + ' bygger snevolden i en blød bue, så man glider langsomt ind i den og ikke støder ind i noget.'; } }
    ],
    js2Krage: [
      { stat: 'Mod', l: 'Stå på ét ben, så længe kragen vil', to: 'js2KrageOk', n: function (n) { return n + ' står på ét ben, helt stille, så længe at kragen til sidst siger: &laquo;Kra! Nu må du godt stoppe.&raquo;'; } }
    ],
    js2Mus: [
      { stat: 'Fantasi', l: 'Skriv et nyt vers til valsen om en tudse på skøjter', to: 'js2MusOk', n: function (n) { return n + ' finder på et vers om en tudse, der skøjter så langsomt, at sneen når at falde på hans hat. Musene elsker det.'; } }
    ],
    js2Is: [
      { stat: 'Nysgerrighed', l: 'Find den ru plet med det samme', to: 'js2IsOk', n: function (n) { return n + ' ser straks, at isen er grå og mat ét sted, lige ud for bredden.'; } }
    ],
    js2Bredden: []
  };
  k.stats.forEach(function (t) {
    mester.js2Bredden.push({ stat: t[0], l: 'Brug mester-trækket ' + t[0] + ' til at hjælpe Tut med at stoppe', to: 'js2EndMester', eff: function (h, stat) { k.state.mester = { name: h.name, stat: stat }; } });
  });

  /* Billeder til scenerne, tegnet med delene i art/dele.js (LK.art.scene). Koordinater i en ramme på 400 x 250. */
  var SNE = { navn: 'snefald', x: 200, y: 125 };
  var BRED = [{ navn: 'snedrive', x: 60, y: 244 }, { navn: 'snedrive', x: 345, y: 246 }];
  var STUMP = function (x, y, s) { return { navn: 'gnist', x: x, y: y, skala: s || 0.7, taendt: true }; };
  var NU = function (x, y, h, s) { return { navn: 'nusse', x: x, y: y, skala: s || 0.7, humoer: h }; };
  var UF = function (x, y, h, s) { return { navn: 'uffe', x: x, y: y, skala: s || 0.65, humoer: h }; };
  var TUT = function (x, y, h) { return { navn: 'tut', x: x, y: y, skala: 0.8, humoer: h }; };
  var billeder = {
    js2Start: { sted: 'vindue', himmel: 'dag', alt: 'Uffe sidder på vindueskarmen, og udenfor står Nusse med en lille æske.',
      ting: [{ navn: 'snefald', x: 200, y: 100, skala: 0.65 }],
      figurer: [{ navn: 'uffe', x: 145, y: 141, skala: 0.9, humoer: 'glad' }, { navn: 'nusse', x: 270, y: 142, skala: 0.5, humoer: 'glad' }] },
    js2Hvad: { sted: 'vindue', himmel: 'dag', alt: 'Nusse fortæller om Tuts nye skøjter, og Uffe lytter.',
      ting: [{ navn: 'snefald', x: 200, y: 100, skala: 0.65 }],
      figurer: [{ navn: 'uffe', x: 145, y: 141, skala: 0.9, humoer: 'rolig' }, { navn: 'nusse', x: 270, y: 142, skala: 0.5, humoer: 'bekymret' }] },
    js2Hub: { sted: 'maanesoe', himmel: 'dag', alt: 'Tut suser rundt på den frosne sø med en stjernestump på hatten, og Nusse står på bredden.',
      ting: BRED.concat([STUMP(213, 120), SNE]),
      figurer: [TUT(200, 170, 'overrasket'), NU(70, 200, 'bekymret', 0.6)] },
    js2Bred: { sted: 'maanesoe', himmel: 'dag', alt: 'Nusse og Uffe står ved bredden med en bunke let sne.',
      ting: [{ navn: 'snedrive', x: 200, y: 246, skala: 1.2 }, SNE],
      figurer: [NU(90, 200, 'rolig'), UF(320, 196, 'rolig')] },
    js2BredOk: { sted: 'maanesoe', himmel: 'dag', alt: 'En lang, blød snevold ligger langs bredden, og Uffe sidder glad på den.',
      ting: [{ navn: 'snedrive', x: 140, y: 246, skala: 1.4 }, { navn: 'snedrive', x: 270, y: 246, skala: 1.4 }, { navn: 'gnist', x: 330, y: 150, taendt: true, farve: '#F7EBD0' }, SNE],
      figurer: [NU(70, 200, 'glad', 0.6), UF(210, 200, 'glad')] },
    js2BredFejl: { sted: 'maanesoe', himmel: 'dag', alt: 'Snevolden er faldet sammen, og Uffe sidder i bunken med sne på hovedet.',
      ting: [{ navn: 'snedrive', x: 230, y: 248, skala: 1.5 }, SNE],
      figurer: [NU(80, 200, 'glad'), UF(240, 200, 'overrasket')] },
    js2Krage: { sted: 'maanesoe', himmel: 'dag', alt: 'En krage står på ét ben i sneen ved sivene.',
      ting: BRED.concat([SNE]),
      figurer: [{ navn: 'krage', x: 150, y: 196, skala: 0.75, humoer: 'rolig' }, NU(300, 200, 'overrasket')] },
    js2KrageOk: { sted: 'maanesoe', himmel: 'dag', alt: 'Kragen nikker, og Nusse gentager tricket.',
      ting: BRED.concat([{ navn: 'gnist', x: 225, y: 140, taendt: true, farve: '#4A4A5A' }, SNE]),
      figurer: [{ navn: 'krage', x: 150, y: 196, skala: 0.75, humoer: 'glad' }, NU(300, 200, 'glad')] },
    js2KrageFejl: { sted: 'maanesoe', himmel: 'dag', alt: 'Kragen og Nusse sidder i den bløde sne og griner.',
      ting: [{ navn: 'snedrive', x: 200, y: 248, skala: 1.5 }, SNE],
      figurer: [{ navn: 'krage', x: 130, y: 200, skala: 0.7, humoer: 'glad' }, NU(290, 204, 'glad')] },
    js2Mus: { sted: 'maanesoe', himmel: 'dag', alt: 'Ved bredden synger en lille mus en langsom sang.',
      ting: BRED.concat([SNE]),
      figurer: [{ navn: 'mus', x: 140, y: 204, skala: 0.65, humoer: 'rolig' }, UF(300, 196, 'rolig')] },
    js2MusOk: { sted: 'maanesoe', himmel: 'dag', alt: 'Musen og Uffe synger valsen sammen, og Uffe gaber.',
      ting: BRED.concat([{ navn: 'gnist', x: 220, y: 140, taendt: true, farve: 'blaa' }, SNE]),
      figurer: [{ navn: 'mus', x: 140, y: 204, skala: 0.65, humoer: 'glad' }, UF(300, 196, 'rolig')] },
    js2MusFejl: { sted: 'maanesoe', himmel: 'dag', alt: 'Musen hopper rundt og griner, og Uffe ser overrasket ud.',
      ting: BRED.concat([SNE]),
      figurer: [{ navn: 'mus', x: 160, y: 200, skala: 0.65, humoer: 'glad' }, UF(300, 196, 'overrasket')] },
    js2Is: { sted: 'maanesoe', himmel: 'dag', alt: 'Nusse og Uffe står på bredden og kigger ud over den glitrende is.',
      ting: BRED.concat([SNE]),
      figurer: [NU(90, 200, 'rolig'), UF(310, 196, 'overrasket')] },
    js2IsOk: { sted: 'maanesoe', himmel: 'dag', alt: 'Lige ud for bredden lyser et lille sted, hvor isen er ru.',
      ting: BRED.concat([{ navn: 'gnist', x: 200, y: 190, taendt: true, farve: '#9AA5B1' }, SNE]),
      figurer: [NU(90, 200, 'glad'), UF(310, 196, 'glad')] },
    js2IsFejl: { sted: 'maanesoe', himmel: 'dag', alt: 'Solen glitrer i isen, og Uffe blinker med øjnene.',
      ting: BRED.concat([{ navn: 'gnist', x: 160, y: 180, skala: 0.5, taendt: true }, { navn: 'gnist', x: 240, y: 175, skala: 0.5, taendt: true }, SNE]),
      figurer: [NU(90, 200, 'overrasket'), UF(310, 196, 'rolig')] },
    js2Bredden: { sted: 'maanesoe', himmel: 'skumring', alt: 'Tut kommer susende på isen, og Nusse og Uffe venter på bredden.',
      ting: BRED.concat([STUMP(213, 120), SNE]),
      figurer: [TUT(200, 170, 'overrasket'), NU(70, 200, 'rolig', 0.6), UF(335, 198, 'rolig', 0.6)] },
    js2EndStop: { sted: 'maanesoe', himmel: 'aften', alt: 'Tut sidder glad i sneen ved bredden og rækker stjernestumpen frem.',
      ting: [{ navn: 'snedrive', x: 140, y: 246, skala: 1.4 }, { navn: 'snedrive', x: 345, y: 246 }, STUMP(240, 170, 1), SNE],
      figurer: [TUT(150, 196, 'glad'), UF(320, 196, 'glad')] },
    js2EndVenner: { sted: 'maanesoe', himmel: 'aften', alt: 'Ræven, musen og kragen står på bredden, og Tut sidder glad i sneen.',
      ting: [{ navn: 'snedrive', x: 200, y: 248, skala: 1.3 }, STUMP(200, 120, 1), SNE],
      figurer: [{ navn: 'raev', x: 55, y: 192, skala: 0.65 }, { navn: 'mus', x: 120, y: 206, skala: 0.55 }, TUT(210, 196, 'glad'), { navn: 'krage', x: 340, y: 198, skala: 0.6 }] },
    js2EndVise: { sted: 'maanesoe', himmel: 'aften', alt: 'Tut sover i sneen ved bredden med Nusses hue på.',
      ting: [{ navn: 'snedrive', x: 140, y: 246, skala: 1.4 }, STUMP(270, 150, 1), SNE],
      figurer: [TUT(150, 196, 'rolig'), NU(320, 200, 'rolig')] },
    js2EndMester: { sted: 'maanesoe', himmel: 'aften', alt: 'Tut står stille ved bredden, og stjernestumpen lyser.',
      ting: [{ navn: 'snedrive', x: 140, y: 246, skala: 1.4 }, STUMP(240, 150, 1.2), SNE],
      figurer: [TUT(150, 196, 'glad'), UF(320, 196, 'glad')] }
  };

  return {
    id: '2026-12-julestjernen-2', type: 'maaned', udgives: '2026-12-11',
    serie: { id: '2026-12-julestjernen', titel: 'Julestjernen' }, kapitel: 2, kapitler: 4,
    start: 'js2Start', title: 'Tut på Månesøen', tag: 'December',
    blurb: 'Et stykke af julestjernen sidder på Tuts hat, og Tut kan ikke stoppe på sine nye skøjter. Kan I hjælpe ham inde fra bredden?',
    scenes: scenes, magi: magi, mester: mester, billeder: billeder
  };
});
