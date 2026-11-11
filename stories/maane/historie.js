// Del 2: Månen der gemte sig. Historiefil: registrerer sig med LK.addStory og får kit-hjælperne som k.
LK.addStory(function (k) {
  var scenes = {
    m1: {
      title: 'Himlen uden måne', lit: 2,
      text: function () {
        var t = ['Nogle nætter efter, at Lanterneskoven blev tændt, vågner I ved, at nogen rasler på ruden. Det er Uffe! &laquo;Hu-hu! Kom hurtigt! Månen er væk!&raquo;',
          'Alle lanternerne lyser stadig smukt, men oppe på himlen er der kun mørke og stjerner. Hvor månen plejer at hænge, er der et hul.'];
        var g = k.state.gnisterIn;
        t.push(g.length ? 'Jeres gnister ' + k.joinNames(g) + ' kommer susende og peger alle sammen mod Månesøen.' : 'En lille gnist svæver ned fra et træ og peger mod Månesøen.');
        var fr = k.friendNames(k.state.flags).filter(function (n) { return n !== 'Månen'; });
        if (fr.length) t.push('&laquo;Jeg har hørt fra ' + k.joinNames(fr) + ',&raquo; siger Uffe. &laquo;De vil gerne hjælpe os.&raquo;');
        return t;
      },
      ask: 'Hvad tror I, der sker, hvis månen aldrig kommer tilbage?',
      choices: [{ label: 'Følg gnisterne mod Månesøen', to: 'm_taage' }, { label: 'Spørg Uffe, hvorfor månen er væk', to: 'm1b' }]
    },
    m1b: {
      title: 'Uffes gæt', lit: 2, gainFeather: true,
      text: ['&laquo;Jeg tror, månen er ked af det,&raquo; hvisker Uffe. &laquo;Siden I tændte lanternerne, kigger ingen op på den mere.&raquo;',
        'Han plukker en sølvfjer af sin vinge. &laquo;Tag den med. Den lyser i mørket, og den giver held. Brug den, når I slår med terningen.&raquo;'],
      ask: 'Har I nogensinde følt jer glemt? Hvad hjælper, når man har det sådan?',
      choices: [{ label: 'Tak, Uffe! Lad os finde månen', to: 'm_taage' }]
    },
    m_taage: {
      title: 'Tågen', lit: 3,
      text: ['Ved skovens kant ligger en tyk, hvid tåge som en stor dyne. I kan ikke se jeres egne fødder. Et sted derinde ligger Månesøen.'],
      ask: 'Hvordan finder man vej, når man ikke kan se noget?',
      dyn: function () {
        function R(stat, label) { return { label: label, roll: { stat: stat, target: 6, win: 'm_taageOk', lose: 'm_taageFejl', flag: 'tutVen', flagTxt: 'fordi Tuts svampe lyser vejen' } }; }
        // Bevægelse: samme valg som R, men familien går selv igennem tågen.
        function B(stat, label, goer) { var c = R(stat, label), r = c.roll; return { label: label, bevaeg: { goer: goer, stat: r.stat, target: r.target, win: r.win, lose: r.lose, flag: r.flag, flagTxt: r.flagTxt } }; }
        var c = [R('Nysgerrighed', 'Kig efter små spor på jorden'), R('List', 'Lyt efter lyden af vand og følg den'), B('Venlighed', 'Hold hinanden i hænderne og gå sammen', 'Tag hinanden i hænderne. List helt lydløst fra den ene ende af stuen til den anden, så tågen ikke hører jer.')];
        k.availG().forEach(function (n) { c.push({ label: 'Bed ' + n + ' om at lyse vejen', to: 'm_taageGnist', use: n }); });
        c.push({ label: 'Tegn en lysende sti i tågen med fantasien', to: 'm_taageOk', lock: function () { return k.lockTxt('Fantasi', 3); } });
        return c;
      }
    },
    m_taageOk: {
      title: 'Tågen letter', lit: 3,
      text: function () {
        var t = ['I går skridt for skridt, og pludselig lysner tågen. Foran jer glitrer Månesøen, helt stille og sort som blæk.'];
        if (k.state.flags.tutVen) t.push('Bag jer lyser Tuts svampe som små vejskilte.');
        return t;
      },
      ask: 'Hvad hjalp mest: at kigge, at lytte eller at holde sammen?',
      next: 'm_sump'
    },
    m_taageFejl: {
      title: 'Rundt i ring', lit: 3,
      text: ['I går og går, og pludselig står I ved det samme væltede træ igen. I er gået i ring! En lille frø kvækker: &laquo;Det gør alle i tågen!&raquo;',
        'Frøen hopper foran jer og viser vej, til tågen til sidst slipper jer.'],
      ask: 'Er det i orden at gå forkert? Hvad gør man så?',
      next: 'm_sump'
    },
    m_taageGnist: {
      title: 'Gnisten lyser', lit: 3,
      text: function () {
        var n = k.state.lastUse || 'Gnisten';
        return [n + ' svæver op og lyser som en lille lanterne. Tågen deler sig som et forhæng, og stien står tydelig foran jer.',
          n + ' bliver helt træt af at lyse og lægger sig til at sove i jeres lomme. Den kan ikke bruges mere i nat.'];
      },
      ask: 'Hvad kan I gøre for at takke en, der har hjulpet jer?',
      next: 'm_sump'
    },
    m_sump: {
      title: 'Kvækkesumpen', lit: 4,
      text: ['Næste stykke går gennem en sump, hvor tusind frøer kvækker i munden på hinanden. Larmen er så høj, at I ikke kan høre jer selv tænke. På den anden side glimter Månesøen.'],
      ask: 'Hvad gør man, når der er så meget larm, at man ikke kan tænke?',
      dyn: function () {
        function R(stat, label, t) { return { label: label, roll: { stat: stat, target: t || 6, win: 'm_sumpOk', lose: 'm_sumpFejl', flag: 'mollLoefte', flagTxt: 'fordi Moll har vist en genvej' } }; }
        var c = [R('Humor', 'Kvæk med og få frøerne til at grine'), R('Mod', 'Hop fra sten til sten over sumpen', 7), R('Fantasi', 'Find på en melodi, som frøerne kan synge med på')];
        k.availG().forEach(function (n) { c.push({ label: 'Bed ' + n + ' om at lyse stenene op', to: 'm_sumpGnist', use: n }); });
        c.push({ label: 'Bed Moll vise sin hemmelige genvej', to: 'm_sumpOk', lock: function () { return k.state.flags.mollLoefte ? null : 'Kræver at I har hjulpet Moll'; } });
        return c;
      }
    },
    m_sumpOk: {
      title: 'Over sumpen', lit: 4,
      text: function () {
        var t = ['Frøerne holder op med at kvække og begynder at nynne sammen med jer. Larmen bliver til en melodi, og I går let hen over sumpen.'];
        if (k.state.flags.mollLoefte) t.push('Under jer rasler Moll i sin tunnel og sender et lille &laquo;Hej!&raquo; op gennem jorden.');
        return t;
      },
      ask: 'Hvordan føles det, når larm bliver til musik?',
      next: 'm_maane'
    },
    m_sumpFejl: {
      title: 'Plask i mudderet', lit: 4, flag: 'mudder',
      text: ['I glider og plasker, og frøerne klukker af grin. Det er koldt og mudret, men til sidst er I forbi. Jeres sko siger &laquo;splask&raquo; for hvert skridt.'],
      ask: 'Er det værre at blive mudret eller at blive grint af? Hvad tænker I?',
      next: 'm_maane'
    },
    m_sumpGnist: {
      title: 'Lysende sten', lit: 4,
      text: function () {
        var n = k.state.lastUse || 'Gnisten';
        return [n + ' hopper fra sten til sten, og hver sten lyser op under den. Frøerne tier stille af ren forbavselse, og I går tørskoede over.',
          n + ' gaber stort og kravler ned i jeres lomme for at sove.'];
      },
      ask: 'Hvorfor tror I, at frøerne blev stille?',
      next: 'm_maane'
    },
    m_maane: {
      title: 'Månen i søen', lit: 5,
      text: function () {
        var t = ['Midt i søen sidder månen. Men den er ikke rund og skinnende. Den er en lille bleg skive, der hænger med hovedet. &laquo;Gå væk,&raquo; siger den med en stille stemme. &laquo;Ingen kigger op på mig mere. Lanternerne er meget finere.&raquo;'];
        if (k.state.flags.mudder) t.push('Månen kigger på jeres mudrede sko og smiler næsten.');
        return t;
      },
      ask: 'Hvad ville I sige til én, der er ked af det og føler sig glemt?',
      dyn: function () {
        function R(stat, label, key, t) { return { label: label, key: key, roll: { stat: stat, target: t || 6, win: 'm_endHjem', lose: 'm_maaneFejl', flag: 'nusseVen', flagTxt: 'fordi Nusse har lært jer pæne ord' } }; }
        var c = [R('Venlighed', 'Sig, at lanterner og måne lyser bedst sammen', 'mm1'), R('Fantasi', 'Fortæl om dengang månen reddede en lille ugle', 'mm2'), R('Humor', 'Lav en sjov grimasse, så månen kommer til at grine', 'mm3'), R('Mod', 'Løft månen forsigtigt op af vandet', 'mm4', 7)];
        c.push({ label: 'Lad alle venner lyse op mod månen', to: 'm_endVenner', lock: function () { return k.friendCount() >= 2 ? null : 'Kræver to venner, I har hjulpet'; } });
        c.push({ label: 'Lad gnisterne skinne ved siden af månen', to: 'm_endGnister', lock: function () { return k.availG().length > 0 ? null : 'Kræver en gnist, der ikke er brugt'; } });
        c.push({ label: 'Sæt jer stille ved siden af månen og vent', to: 'm_endStille' });
        return c;
      }
    },
    m_maaneFejl: {
      title: 'Det hjælper ikke', lit: 5,
      text: ['Månen ryster på hovedet og dykker et stykke ned under vandet. &laquo;Det hjælper ikke,&raquo; mumler den.', 'I sidder tavse. Så hvisker Uffe: &laquo;Prøv at lytte i stedet for at gøre noget.&raquo;'],
      ask: 'Hvad er forskellen på at gøre noget for en ven og at lytte?',
      next: 'm_maane'
    },
    m_endHjem: {
      title: 'Månen kommer hjem', end: true, all: true, flag: 'maaneVen',
      text: function () {
        var t = ['Månen kigger på jer og tænker sig om. Så begynder den at stige op af søen, langsomt som en boble. Jo højere den kommer, jo rundere og lysere bliver den.',
          'Til sidst hænger den på himlen igen, stor og sølvhvid. Nedefra skinner lanternerne, oppefra skinner månen. &laquo;Det er jo som to lamper i samme stue,&raquo; siger Uffe.'];
        var fr = k.friendNames(k.state.flags).filter(function (n) { return n !== 'Månen'; });
        if (fr.length) t.push(k.joinNames(fr) + ' vinker fra søens bred.');
        if (k.availG().length) t.push(k.joinNames(k.availG()) + ' danser rundt om månen som små stjerner.');
        return t;
      },
      ask: 'Hvorfor er det godt, at der er plads til både lanterner og måne?'
    },
    m_endStille: {
      title: 'Den stille måne', end: true, all: true, flag: 'maaneVen',
      text: ['I sætter jer ved søen og siger ingenting. Månen kigger på jer. Længe. Så hvisker den: &laquo;Tak, fordi I blev.&raquo;',
        'Langsomt løfter den sig op fra vandet. Den er ikke helt rund endnu, men den er tilbage. Næste aften bliver den lidt rundere, og dagen efter lidt rundere igen.'],
      ask: 'Hvornår hjælper det mest bare at være der?'
    },
    m_endVenner: {
      title: 'Alle kigger op', end: true, all: true, flag: 'maaneVen',
      text: function () {
        var fr = k.friendNames(k.state.flags).filter(function (n) { return n !== 'Månen'; });
        return ['I løfter hånden og kalder: &laquo;Alle sammen! Kig op på månen!&raquo; Fra skoven kommer ' + k.joinNames(fr) + ', og hver især løfter et lille lys.',
          'Månen kigger rundt på alle de lyse ansigter. &laquo;Så mange, der kigger på mig,&raquo; hvisker den. Så blusser den op, rund og skinnende, og stiger op til himlen.'];
      },
      ask: 'Hvem kigger I op til, og hvem kigger op til jer?'
    },
    m_endGnister: {
      title: 'Gnister og måne', end: true, all: true, flag: 'maaneVen',
      text: function () {
        return [k.joinNames(k.availG()) + ' svæver ud over søen og sætter sig som små stjerner ved siden af månen. &laquo;Må vi lyse sammen med dig?&raquo; spørger de.',
          'Månen smiler for første gang i lang tid. Så stiger den op, og gnisterne følger med som en lysende hale.'];
      },
      ask: 'Hvem ville I gerne lyse sammen med?'
    }
  };

  var magi = {
    m_taage: {
      gnist: { l: 'Skab en gnist, der lyser vejen', to: 'm_taageGnist', eff: function (h) { k.state.lastUse = k.gen(h.name) + ' gnist'; } },
      dyr: { l: 'Spørg uglerne og flagermusene om vej', to: 'm_taageOk' },
      syn: { l: 'Se de usynlige fodspor i tågen', to: 'm_taageOk' },
      latter: { l: 'Strø latterstøv, så tågen kildes og letter', to: 'm_taageOk' }
    },
    m_sump: {
      gnist: { l: 'Skab en gnist, der lyser stenene op', to: 'm_sumpGnist', eff: function (h) { k.state.lastUse = k.gen(h.name) + ' gnist'; } },
      dyr: { l: 'Tal frøsprog og bed dem være stille', to: 'm_sumpOk' },
      syn: { l: 'Se, hvilke tuer der kan bære jer', to: 'm_sumpOk' },
      latter: { l: 'Strø latterstøv, så frøerne glemmer at kvække', to: 'm_sumpOk' }
    },
    m_maane: {
      gnist: { l: 'Skab en ny gnist, der lyser sammen med månen', to: 'm_endGnister', eff: function (h) { k.state.gnisterIn.push(k.gen(h.name) + ' gnist'); } },
      dyr: { l: 'Bed natsommerfuglene om at kigge op på månen', to: 'm_endHjem' },
      syn: { l: 'Se, hvad månen drømmer om', to: 'm_endHjem' },
      latter: { l: 'Strø latterstøv, så månen får sit første grin', to: 'm_endHjem' }
    }
  };

  var mester = {
    m_taage: [
      { stat: 'Nysgerrighed', l: 'Læs sporene i tågen som en bog', to: 'm_taageOk', n: function (n) { return n + ' kigger tæt på og læser små spor i tågen: en fjer, en pote, en dugdråbe. Sporene fører lige til søen.'; } },
      { stat: 'List', l: 'Find vej med ører og næse, helt uden at se', to: 'm_taageOk', n: function (n) { return n + ' lukker øjnene, lytter efter vandet og dufter sig frem. Alle følger efter, og tågen når slet ikke at narre dem.'; } },
      { stat: 'Venlighed', l: 'Syng en stille sang, så alle holder sammen', to: 'm_taageOk', n: function (n) { return n + ' nynner en stille sang, så ingen farer vild. Alle holder hinanden i hænderne og følger melodien.'; } },
      { stat: 'Fantasi', l: 'Mal en lysende sti, som tågen ikke kan skjule', to: 'm_taageOk', n: function (n) { return n + ' maler en lysende sti i tågen med fingrene, og stien bliver ved med at lyse, indtil alle er kommet igennem.'; } }
    ],
    m_sump: [
      { stat: 'Humor', l: 'Hold en frøkoncert, hvor I dirigerer hele sumpen', to: 'm_sumpOk', n: function (n) { return n + ' hopper op på en sten og dirigerer. Frøerne kvækker i takt, og larmen bliver til en stor, glad koncert.'; } },
      { stat: 'Mod', l: 'Spring over sumpen i ét stort hop', to: 'm_sumpOk', n: function (n) { return n + ' tager tilløb og springer helt over sumpen i ét eneste stort hop. De andre klapper og følger efter.'; } },
      { stat: 'Fantasi', l: 'Forvandl sumpen til en dansesal med lysende sten', to: 'm_sumpOk', n: function (n) { return n + ' forestiller sig, at sumpen er en dansesal. Stenene begynder at lyse, og frøerne danser med.'; } }
    ],
    m_maane: [
      { stat: 'Venlighed', l: 'Sig noget fra hjertet, så månen mærker, at den er savnet', to: 'm_endHjem', n: function (n) { return n + ' siger stille: &laquo;Vi har savnet dig.&raquo; Det er ikke meget, men månen mærker, at det er sandt.'; } },
      { stat: 'Fantasi', l: 'Fortæl månen en helt ny historie, hvor den er hovedperson', to: 'm_endHjem', n: function (n) { return n + ' begynder at fortælle en historie, hvor månen er den modigste i hele natten. Månen lytter med store øjne.'; } },
      { stat: 'Humor', l: 'Få månen til at grine, så den ryster op af søen', to: 'm_endHjem', n: function (n) { return n + ' laver en grimasse, som ingen har set før. Månen prøver at holde masken, men så kommer grinet.'; } },
      { stat: 'Mod', l: 'Gå ud i søen og løft månen blidt op, helt uden frygt', to: 'm_endHjem', n: function (n) { return n + ' vader ud i det kolde vand og løfter månen blidt op i armene. Månen gisper, men den bliver varm om kinderne.'; } }
    ]
  };

  /* Billeder til scenerne, tegnet med delene i art/dele.js (LK.art.scene). maane: false betyder en himmel uden måne. */
  var billeder = {
    m1: { sted: 'vindue', himmel: 'nat', maane: false, alt: 'Uffe rasler på ruden: lanternerne lyser i skoven, men der er ingen måne på himlen.',
      ting: [{ navn: 'lanterne', x: 110, y: 120, skala: 0.6, taendt: true }, { navn: 'lanterne', x: 290, y: 130, skala: 0.6, taendt: true }, { navn: 'gnist', x: 300, y: 60, skala: 0.7, taendt: true }],
      figurer: [{ navn: 'uffe', x: 200, y: 141, skala: 0.9, humoer: 'overrasket' }] },
    m1b: { sted: 'skovsti', himmel: 'nat', maane: false, alt: 'Uffe tror, at månen er ked af det, fordi ingen kigger op på den mere.',
      ting: [{ navn: 'gren', x: 150, y: 172 }, { navn: 'lanterne', x: 95, y: 140, taendt: true }, { navn: 'lanterne', x: 345, y: 150, taendt: true }],
      figurer: [{ navn: 'uffe', x: 205, y: 128, humoer: 'bekymret' }] },
    m_taage: { sted: 'taage', himmel: 'nat', maane: false, alt: 'En tyk, hvid tåge ligger ved skovens kant, og Uffe kan næsten ikke se noget.',
      figurer: [{ navn: 'uffe', x: 200, y: 176, skala: 0.8, humoer: 'bekymret' }] },
    m_taageOk: { sted: 'maanesoe', himmel: 'nat', maane: false, alt: 'Tågen letter, og Månesøen ligger helt stille og sort foran jer.',
      ting: [{ navn: 'svamp', x: 70, y: 236, skala: 0.8, taendt: true }, { navn: 'svamp', x: 95, y: 240, skala: 0.6, taendt: true }],
      figurer: [{ navn: 'uffe', x: 170, y: 206, skala: 0.65, humoer: 'glad' }] },
    m_taageFejl: { sted: 'taage', himmel: 'nat', maane: false, alt: 'I er gået i ring i tågen, og Uffe ser sig forvirret omkring.',
      figurer: [{ navn: 'uffe', x: 200, y: 176, skala: 0.8, humoer: 'overrasket' }] },
    m_taageGnist: { sted: 'taage', himmel: 'skumring', maane: false, alt: 'En gnist lyser som en lille lanterne, og tågen deler sig.',
      ting: [{ navn: 'gnist', x: 250, y: 120, skala: 1.4, taendt: true }],
      figurer: [{ navn: 'uffe', x: 160, y: 176, skala: 0.8, humoer: 'glad' }] },
    m_sump: { sted: 'sump', himmel: 'nat', maane: false, alt: 'Uffe står ved Kvækkesumpen, hvor frøerne larmer i munden på hinanden.',
      figurer: [{ navn: 'uffe', x: 150, y: 178, skala: 0.8, humoer: 'overrasket' }] },
    m_sumpOk: { sted: 'sump', himmel: 'skumring', maane: false, alt: 'Larmen bliver til en melodi, og I går let hen over sumpen.',
      figurer: [{ navn: 'uffe', x: 150, y: 178, skala: 0.8, humoer: 'glad' }] },
    m_sumpFejl: { sted: 'sump', himmel: 'nat', maane: false, alt: 'Plask i mudderet! Uffe kigger forbavset på de mudrede sko.',
      figurer: [{ navn: 'uffe', x: 150, y: 178, skala: 0.8, humoer: 'overrasket' }] },
    m_sumpGnist: { sted: 'sump', himmel: 'skumring', maane: false, alt: 'En gnist hopper fra sten til sten og lyser dem op.',
      ting: [{ navn: 'gnist', x: 110, y: 214, taendt: true }, { navn: 'gnist', x: 290, y: 220, skala: 0.7, taendt: true }],
      figurer: [{ navn: 'uffe', x: 195, y: 178, skala: 0.8, humoer: 'glad' }] },
    m_maane: { sted: 'maanesoe', himmel: 'nat', alt: 'Midt i søen sidder en lille, bleg måne og hænger med hovedet.',
      figurer: [{ navn: 'maanen', x: 290, y: 192, skala: 0.45, humoer: 'bekymret' }, { navn: 'uffe', x: 110, y: 206, skala: 0.65, humoer: 'bekymret' }] },
    m_maaneFejl: { sted: 'maanesoe', himmel: 'nat', alt: 'Månen dykker et stykke ned i vandet, og Uffe sidder stille og lytter.',
      figurer: [{ navn: 'maanen', x: 290, y: 206, skala: 0.4, humoer: 'bekymret' }, { navn: 'uffe', x: 110, y: 206, skala: 0.65, humoer: 'rolig' }] },
    m_endHjem: { sted: 'maanesoe', himmel: 'skumring', alt: 'Månen hænger stor og rund på himlen igen, og Uffe jubler.',
      figurer: [{ navn: 'maanen', x: 290, y: 70, skala: 0.85, humoer: 'glad' }, { navn: 'uffe', x: 110, y: 206, skala: 0.65, humoer: 'glad' }] },
    m_endStille: { sted: 'maanesoe', himmel: 'skumring', alt: 'Månen løfter sig langsomt fra søen, og I sidder stille sammen.',
      figurer: [{ navn: 'maanen', x: 290, y: 110, skala: 0.65, humoer: 'rolig' }, { navn: 'uffe', x: 110, y: 206, skala: 0.65, humoer: 'rolig' }] },
    m_endVenner: { sted: 'maanesoe', himmel: 'skumring', alt: 'Vennerne løfter små lys, og månen stiger rund og skinnende op.',
      ting: [{ navn: 'lanterne', x: 92, y: 214, skala: 0.7, taendt: true }],
      figurer: [{ navn: 'maanen', x: 300, y: 70, skala: 0.8, humoer: 'glad' }, { navn: 'nusse', x: 70, y: 206, skala: 0.7 }, { navn: 'moll', x: 150, y: 214, skala: 0.6 }, { navn: 'tut', x: 220, y: 214, skala: 0.6 }] },
    m_endGnister: { sted: 'maanesoe', himmel: 'skumring', alt: 'Gnisterne sætter sig som små stjerner ved siden af månen.',
      ting: [{ navn: 'gnist', x: 220, y: 50, skala: 0.8, taendt: true }, { navn: 'gnist', x: 375, y: 95, skala: 0.7, taendt: true }, { navn: 'gnist', x: 240, y: 120, skala: 0.6, taendt: true }],
      figurer: [{ navn: 'maanen', x: 300, y: 72, skala: 0.8, humoer: 'glad' }, { navn: 'uffe', x: 110, y: 206, skala: 0.65, humoer: 'glad' }] }
  };

  return {
    id: 'maane', start: 'm1', title: 'Månen der gemte sig', tag: 'Del 2 af 4',
    blurb: 'Månen er væk fra himlen. Jeres gnister og venner fra første del kan hjælpe.',
    scenes: scenes, magi: magi, mester: mester, billeder: billeder
  };
});
