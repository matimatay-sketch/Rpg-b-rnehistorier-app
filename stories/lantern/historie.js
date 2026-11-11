// Del 1: Lanterneskoven. Historiefil: registrerer sig med LK.addStory og får kit-hjælperne som k.
LK.addStory(function (k) {
  var PATHS = [
    { id: 'bro', label: 'Følg lyden af rislende vand' },
    { id: 'torn', label: 'Gå ind mellem de tætte torne' },
    { id: 'gaade', label: 'Find den gamle rod med det lille hul' }
  ];

  var MESTER_TXT = {
    Mod: function (n) { return n + ' træder helt hen til Lanternetræet uden at tøve og lægger hånden på stammen. Træet mærker modet og varmer, og de første lanterner tænder af sig selv.'; },
    List: function (n) { return n + ' finder det gamle, skjulte gnistkammer i træets rod, hvor vinden aldrig kom. Derinde ligger de sidste gnister og venter.'; },
    Venlighed: function (n) { return n + ' lægger øret mod træet og lytter længe. Træet fortæller om sine drømme, og af ren glæde over at blive hørt begynder det at lyse.'; },
    Fantasi: function (n) { return n + ' finder på en ny farve, som ingen har set før, og maler den med fingrene op ad træet. Lanterne efter lanterne tænder i den nye farve.'; },
    Humor: function (n) { return n + ' fortæller den allerbedste vittighed i hele skoven. Træet griner så meget, at alle lanternerne rasler og tænder.'; },
    Nysgerrighed: function (n) { return n + ' kigger helt tæt på barken og opdager en lille, skjult lås i træet. Bag den sidder alle de forsvundne gnister.'; }
  };

  var scenes = {
    s1: {
      title: 'Uglen i mørket',
      text: function () {
        var t = ['Engang hang der hundredvis af små lanterner mellem træerne i Lanterneskoven. Men i nat kom der en drilsk vind, og nu er alle lanternerne slukket.',
          'Pludselig lander en lille ugle på en gren lige foran jer. &laquo;Hu-hu! Jeg hedder Uffe,&raquo; siger den. &laquo;Jeg kan ikke finde hjem i mørket. Vil I hjælpe mig med at tænde Lanternetræet igen?&raquo;'];
        if (k.state.remembered.length) t.push('Så blinker Uffe og smiler. &laquo;Vent lidt, jeg kender jer! Rygtet har løbet gennem hele skoven. ' + k.joinNames(k.state.remembered) + ' har fortalt, hvor søde I er.&raquo;');
        return t;
      },
      ask: 'Hvordan tror I, det føles at være en lille ugle i en helt mørk skov?',
      choices: [{ label: 'Følg med Uffe ind i skoven', to: 'hub' }, { label: 'Spørg Uffe, hvad der skete', to: 's1b' }]
    },
    s1b: {
      title: 'Vinden tog gnisterne',
      text: ['&laquo;Vinden tog lanternernes gnister,&raquo; hvisker Uffe. &laquo;De spredte sig over hele skoven. Hvis vi finder bare to gnister, kan vi tænde Lanternetræet.&raquo;',
        'Uffe plukker en lille gylden fjer af sin vinge. &laquo;Tag den med. Den giver held. Brug den, når I slår med terningen.&raquo;'],
      gainFeather: true,
      ask: 'Hvornår vil I bruge fjeren? Den kan kun bruges én gang.',
      choices: [{ label: 'Tak, Uffe! Afsted!', to: 'hub' }]
    },
    hub: {
      title: 'Stien deler sig',
      text: function () {
        var g = k.state.gnists, v = k.state.visited.length;
        if (v === 0) return ['Skoven er stille og mørk. Efter lidt tid deler stien sig. I lytter. Der er noget derude.'];
        var a = 'I går videre. Stien deler sig igen. Uffe flyver foran jer og kigger sig om.';
        var b = g === 0 ? '&laquo;I har ikke fundet nogen gnister endnu,&raquo; siger Uffe. &laquo;Prøv en sti til, eller gå til Lanternetræet, hvis I tør.&raquo;'
          : g === 1 ? '&laquo;Én gnist! Træet skal bruge to for at lyse helt, men I bestemmer selv, om vi leder videre.&raquo;'
          : '&laquo;Nu har I nok gnister til at tænde træet,&raquo; siger Uffe. &laquo;Men flere gnister giver et stærkere lys. I bestemmer.&raquo;';
        var left = PATHS.filter(function (p) { return k.state.visited.indexOf(p.id) < 0; }).length + (k.state.visited.indexOf('svamp') < 0 ? 1 : 0);
        return [a, b + (left === 0 ? ' Der er ikke flere stier at prøve.' : '')];
      },
      ask: 'Hvilken vej ville I vælge, hvis I var helt alene?',
      dyn: function () {
        var c = PATHS.filter(function (p) { return k.state.visited.indexOf(p.id) < 0; }).map(function (p) { return { label: p.label, to: p.id }; });
        if (k.state.visited.indexOf('svamp') < 0) c.push({ label: 'Følg de lysende svampe', to: 'svamp', lock: function () { return k.lockTxt('Nysgerrighed', 2); } });
        if (k.state.visited.length > 0) c.push({ label: 'Gå til Lanternetræet nu', to: 'tree' });
        return c;
      }
    },
    bro: {
      title: 'Bækken', path: 'bro',
      text: ['Bag nogle høje bregner løber en bred bæk. En glat træstamme ligger henover vandet. På den anden side glimter der noget blåt. Det er en gnist!',
        'Men stammen vipper, og vandet er koldt.'],
      ask: 'Hvad ville I gøre, hvis I var bange for vand?',
      choices: [
        { label: 'Gå over stammen, ét skridt ad gangen', roll: { stat: 'Mod', target: 6, win: 'broOk', lose: 'broFejl' } },
        { label: 'Byg et rækværk af pinde sammen', roll: { stat: 'List', target: 6, win: 'broOk', lose: 'broFejl' } },
        { label: 'Lad som om, stammen er en regnbuebro', roll: { stat: 'Fantasi', target: 6, win: 'broOk', lose: 'broFejl' } }
      ]
    },
    broOk: {
      title: 'Den blå gnist', gain: true, gnist: { c: 'blå', def: 'Blå gnist', col: '#4A90D9', ph: 'Blinke' },
      text: ['I når over på den anden side uden en eneste våd tå. Den blå gnist hopper op i jeres hænder og kilder lidt. &laquo;Hi hi!&raquo; siger den.', '&laquo;Hu-hu! Én gnist!&raquo; råber Uffe.'],
      ask: 'Hvad tror I, gnisten har lyst til at gøre i Lanternetræet?',
      next: 'hub'
    },
    broFejl: {
      title: 'Plask!', flag: 'vaad',
      text: ['Stammen vipper, I vipper, og så plasker I i bækken! Vandet er koldt, men I griner højt. Den blå gnist glider væk med strømmen og forsvinder bag en sten.', '&laquo;Det går nok,&raquo; siger Uffe og ryster vand af jeres ryg. &laquo;Der er flere gnister derude.&raquo;'],
      ask: 'Er det i orden at fejle, når man prøver? Hvad kan man lære af det?',
      next: 'hub'
    },
    torn: {
      title: 'Tornekrattet', path: 'torn',
      text: ['Mellem tornene hører I en tynd lille stemme: &laquo;Hjælp&hellip;&raquo; Det er nissen Nusse. Hans røde gnist sidder fast i en tornegren, og han tør ikke række ud efter den.'],
      ask: 'Hvad gør man, når en anden er bange?',
      choices: [
        { label: 'Tal blidt til Nusse', roll: { stat: 'Venlighed', target: 6, win: 'tornOk', lose: 'tornFejl' } },
        { label: 'Træk forsigtigt i grenen', roll: { stat: 'Mod', target: 7, win: 'tornOk', lose: 'tornFejl' } },
        { label: 'Få Nusse til at grine med en sjov lyd', roll: { stat: 'Humor', target: 6, win: 'tornOk', lose: 'tornFejl' } }
      ]
    },
    tornOk: {
      title: 'Den røde gnist', gain: true, flag: 'nusseVen', gnist: { c: 'røde', def: 'Rød gnist', col: '#E0525A', ph: 'Pippi' },
      text: ['Nusse kigger frem og smiler lidt. Sammen får I grenen bøjet til side, og den røde gnist svæver ud i jeres hænder.', '&laquo;Tak,&raquo; hvisker Nusse. &laquo;Jeg kommer til Lanternetræet senere. Jeg skal bare finde min hue.&raquo;'],
      ask: 'Hvordan tror I, Nusse har det nu?',
      next: 'hub'
    },
    tornFejl: {
      title: 'Den frygtsomme nisse', flag: 'nusseHonning',
      text: ['Nusse bliver endnu mere bange og kryber helt ned i busken. I kan ikke få fat i gnisten.', 'I lægger en lille honningkage på en sten, så han kan se, at I er venner. &laquo;Måske kommer han frem, når vi er gået,&raquo; siger Uffe.'],
      ask: 'Hvad kunne I have gjort anderledes? Eller var det rigtigt at give ham ro?',
      next: 'hub'
    },
    gaade: {
      title: 'Muldvarpens gåde', path: 'gaade',
      text: ['Under en gammel rod bor Muldvarpen Moll. Hun stikker snuden op og kniber øjnene sammen. &laquo;En gnist? Jo, jeg har en. Men først en gåde:&raquo;',
        '&laquo;Jeg har ingen mund, men jeg kan fortælle historier. Hvad er jeg?&raquo;'],
      ask: 'Tænk sammen, før I svarer. Hvad har I i hænderne lige nu?',
      choices: [
        { label: 'En bog', to: 'gaadeOk', key: 'bog' },
        { label: 'En trold', to: 'gaade', key: 'trold', wrong: 'Moll klukker: &laquo;Næsten! Men trolde har mund.&raquo;' },
        { label: 'En sky', to: 'gaade', key: 'sky', wrong: 'Moll ryster på hovedet: &laquo;Skyer fortæller ikke historier. Prøv igen!&raquo;' },
        { label: 'Kig dig omkring i Molls hule og stil spørgsmål', key: 'kig', roll: { stat: 'Nysgerrighed', target: 6, win: 'gaadeKig', lose: 'gaadeHint' } }
      ]
    },
    gaadeKig: {
      title: 'Den grønne gnist', gain: true, flag: 'mollLoefte', gnist: { c: 'grønne', def: 'Grøn gnist', col: '#4CAF6A', ph: 'Fnug' },
      text: ['I kigger jer omkring i Molls hule. På bordet ligger en stak støvede bøger. &laquo;Hov!&raquo; siger I. &laquo;Har en bog en mund? Nej, men den kan fortælle historier. Det er en bog!&raquo;',
        'Moll klapper i sine små hænder og rækker en grøn gnist frem. Den lugter af nyslåede enge. &laquo;Fortæl mig en historie en dag,&raquo; siger hun.'],
      ask: 'Hvad lagde I mærke til, som Moll slet ikke havde tænkt på?',
      next: 'hub'
    },
    gaadeHint: {
      title: 'Et lille hint',
      text: ['I kigger og kigger, men får ikke øje på noget. Moll smiler lidt. &laquo;Ikke så nysgerrige endnu? Jeg giver jer et hint: Man kan åbne den, og man kan holde den i hænderne.&raquo;'],
      ask: 'Hvad kan man åbne og holde i hænderne, og som kan fortælle noget?',
      next: 'gaade'
    },
    gaadeOk: {
      title: 'Den grønne gnist', gain: true, flag: 'mollLoefte', gnist: { c: 'grønne', def: 'Grøn gnist', col: '#4CAF6A', ph: 'Fnug' },
      text: ['&laquo;En bog! Selvfølgelig!&raquo; Moll klapper i sine små hænder og rækker en grøn gnist frem. Den lugter af nyslåede enge.', '&laquo;Fortæl mig en historie en dag,&raquo; siger Moll. &laquo;Jeg har aldrig fået en rigtig.&raquo;'],
      ask: 'Hvilken historie ville I fortælle Moll?',
      next: 'hub'
    },
    svamp: {
      title: 'Svampecirklen', path: 'svamp',
      text: function () {
        var t = ['Bag en væltet gran gemmer der sig en cirkel af svampe, som lyser svagt som små natlamper. Midt i cirklen sidder en tudse med en stor, rynket hat. &laquo;Jeg hedder Tut,&raquo; siger han. &laquo;Jeg har en gnist, men jeg giver den kun til en, der kan få mig til at smile. Det er længe siden, jeg har grint.&raquo;'];
        if (k.state.flags.nusseVen) t.push('Tut kigger på jer. &laquo;Nusse har fortalt, at I er søde. Så må I gerne prøve.&raquo;');
        return t;
      },
      ask: 'Hvad får jer selv til at grine, når I er kede af det?',
      choices: [
        { label: 'Lav en sjov lyd som en frø med hikke', roll: { stat: 'Humor', target: 6, win: 'svampOk', lose: 'svampFejl', flag: 'nusseVen', flagTxt: 'fordi I hjalp Nusse' } },
        { label: 'Spørg Tut, hvorfor han er så trist', roll: { stat: 'Venlighed', target: 6, win: 'svampOk', lose: 'svampFejl', flag: 'nusseVen', flagTxt: 'fordi I hjalp Nusse' } },
        { label: 'Fortæl om en tudse, der kunne flyve', roll: { stat: 'Fantasi', target: 6, win: 'svampOk', lose: 'svampFejl', flag: 'nusseVen', flagTxt: 'fordi I hjalp Nusse' } }
      ]
    },
    svampOk: {
      title: 'Den lilla gnist', gain: true, flag: 'tutVen', gnist: { c: 'lilla', def: 'Lilla gnist', col: '#9B6BD6', ph: 'Lilje' },
      text: ['Tut prøver at holde masken, men så kommer der et lille klukkende grin, og så et større. Hans hat ryster, og svampene blinker i takt. &laquo;Jeg havde glemt, hvor rart det er!&raquo;',
        'Han giver jer en lilla gnist, der pludrer og pludrer. &laquo;Kom og besøg mig igen,&raquo; siger Tut.'],
      ask: 'Hvad gør I, når nogen omkring jer er kede af det?',
      next: 'hub'
    },
    svampFejl: {
      title: 'En stille tudse',
      text: ['Tut sukker lavt og trækker hatten ned over øjnene. &laquo;Det var sødt forsøgt,&raquo; siger han. &laquo;Men jeg er ikke klar endnu.&raquo;',
        'I sætter jer ved siden af ham og lytter til svampene, der lyser. Måske er det også nok i dag.'],
      ask: 'Er det i orden at sidde stille sammen med én, der er ked af det?',
      next: 'hub'
    },
    tree: {
      title: 'Lanternetræet',
      text: function () {
        var g = k.state.gnists;
        var a = 'Midt i skoven står Lanternetræet, stort som et hus. Alle dets lanterner hænger slukkede og stille. Uffe lander på den laveste gren.';
        var b = g >= 3 ? '&laquo;Hu-hu! ' + k.joinNames(k.gnistNames()) + '! Så mange gnister har træet aldrig fået!&raquo;'
          : g === 2 ? '&laquo;Hu-hu! ' + k.joinNames(k.gnistNames()) + '! Det er lige nok!&raquo;'
          : g === 1 ? '&laquo;Hu-hu! ' + k.joinNames(k.gnistNames()) + ' er en god begyndelse. Måske kan vi klare resten sammen.&raquo;'
          : '&laquo;I har ingen gnister,&raquo; siger Uffe. &laquo;Men I har noget bedre: I turde prøve. Lad os bede skovens venner om hjælp.&raquo;';
        var t = [a, b];
        if (k.state.flags.vaad) t.push('Jeres sko klasker stadig lidt efter plasket i bækken. Uffe kigger ned og fniser.');
        return t;
      },
      ask: 'Hvad tror I virker bedst: gnisterne, vennerne eller en sang?',
      dyn: function () {
        var c = [];
        if (k.state.gnists > 0) c.push({ label: 'Løft gnisterne op mod træet', to: 'endLight' });
        c.push({ label: 'Råb på skovens venner', to: 'endFriends' });
        c.push({ label: 'Bed vennerne bære gnisterne med jer', to: 'endSammen', lock: function () { return k.state.gnists > 0 && k.friendCount() > 0 ? null : 'Kræver en gnist og en ven, I har hjulpet'; } });
        c.push({ label: 'Syng en sang for træet', to: 'endSang', lock: function () { return k.partyStat('Fantasi') >= 3 || k.partyStat('Humor') >= 3 ? null : 'Kræver Fantasi 3 eller Humor 3'; } });
        return c;
      }
    },
    endLight: {
      title: 'Skoven lyser', end: true, all: true,
      text: function () {
        var g = k.state.gnists;
        if (g >= 3) return ['I løfter ' + k.joinNames(k.gnistNames()) + ' op på én gang. De sprutter og knitrer og springer fra gren til gren. Lanterne efter lanterne tænder, først gul, så orange, så hvid, og til sidst lyser skoven så kraftigt, at selv stjernerne kigger ned.', 'Uffe flyver glade cirkler om jeres hoveder. &laquo;Så meget lys har jeg aldrig set!&raquo;'];
        if (g === 2) return ['I løfter ' + k.joinNames(k.gnistNames()) + ' op. De sprutter og knitrer og hopper fra gren til gren. Lanterne efter lanterne tænder, først gul, så orange, så hvid. Hele skoven lyser!', 'Uffe flyver glade cirkler om jeres hoveder. &laquo;Nu kan jeg finde hjem!&raquo; Og hver gang nætterne bliver lange, fortæller uglerne om familien, der tændte skoven.'];
        return ['I løfter ' + k.joinNames(k.gnistNames()) + ' op. Den tænder én lanterne, og så en til. Træet lyser blødt, ikke helt som før, men nok til, at Uffe kan se vej hjem.', '&laquo;Det er nok,&raquo; hu-huer han. &laquo;I kan altid finde flere gnister en anden aften.&raquo;'];
      },
      ask: 'Hvad var det bedste valg, I tog i dag?'
    },
    endFriends: {
      title: 'Venner tænder lys', end: true, all: true,
      text: function () {
        var fl = k.friendLines();
        var a = 'I råber ud i mørket: &laquo;Hej! Vil nogen hjælpe os?&raquo; Først er alt stille. Så knitrer det i buskene.';
        if (!fl.length) return [a + ' Ræve, mus og pindsvin kommer frem, og hver af dem har en lille lampe med lysorme i.',
          'De hænger lamperne i træet, én efter én. Snart lyser Lanternetræet af venskab. Uffe græder lidt af glæde. &laquo;Jeg vidste ikke, at man kunne tænde en skov bare ved at bede om hjælp,&raquo; siger han.'];
        return [a, fl.join(' '),
          'Sammen med ræve, mus og pindsvin hænger de lamper med lysorme i træet, én efter én. Snart lyser Lanternetræet af venskab. &laquo;Det var jer, der hjalp dem først,&raquo; siger Uffe stille. &laquo;Nu hjælper de jer.&raquo;'];
      },
      ask: function () { return k.friendCount() ? 'Hvem hjalp I først, og hvordan føltes det, da de hjalp jer tilbage?' : 'Hvornår har I sidst bedt nogen om hjælp? Hvordan gik det?'; }
    },
    endSammen: {
      title: 'Alle sammen', end: true, all: true,
      text: function () {
        return ['I løfter gnisterne højt. Men træet er stort og gnisterne er små. &laquo;Vi klarer det ikke alene,&raquo; siger Uffe.']
          .concat(k.friendLines(), ['Hver ven får en gnist at bære. De klatrer op i træet og tænder lanterne efter lanterne, til hele Lanterneskoven skinner som en stjernehimmel.',
            'Uffe flyver ned og sætter sig på jeres skulder. &laquo;Det var den bedste nat i hele skoven,&raquo; hvisker han.']);
      },
      ask: 'Hvorfor tror I, det virkede bedre, da I gjorde det sammen?'
    },
    endSang: {
      title: 'Skovens sang', end: true, all: true,
      text: function () {
        var t = ['I stiller jer ved foden af Lanternetræet og begynder at synge. Først lidt skævt, så højere. Uffe synger med, og så gør buskene. Hver tone får en lanterne til at blinke.'];
        if (k.state.gnists > 0) t.push(k.joinNames(k.gnistNames()) + ' svæver ud af jeres hænder og danser med i lysene.');
        t.push('Til sidst lyser hele skoven i takt med jeres sang. Træet rasler tilfreds med bladene. &laquo;Ingen har sunget for mig før,&raquo; siger det med en dyb, blød stemme.');
        return t;
      },
      ask: 'Hvilken sang ville I synge for træet?'
    },
    endMester: {
      title: 'Mesterens lys', end: true, all: true,
      text: function () {
        var m = k.state.mester || { name: 'Jeres helt', stat: 'Mod' };
        var how = MESTER_TXT[m.stat] || MESTER_TXT.Mod;
        return [how(k.esc(m.name)), 'Lanterne efter lanterne tænder, og til sidst lyser hele Lanterneskoven. Uffe sætter sig på træets laveste gren og hvisker: &laquo;Nogle gange er det de ting, man har øvet sig rigtig meget i, der tænder de største lys.&raquo;'];
      },
      ask: 'Hvad er I blevet rigtig gode til? Hvordan lærte I det?'
    }
  };

  var magi = {
    bro: {
      gnist: { l: 'Skab en gnist, der tegner en bro af lysprikker i luften', to: 'broOk' },
      dyr: { l: 'Spørg en bæver, om den vil lægge et træ som bro', to: 'broOk' },
      syn: { l: 'Se, hvilke sten der ligger lige under vandet', to: 'broOk' },
      latter: { l: 'Strø latterstøv, så fiskene hopper og viser vejen', to: 'broOk' }
    },
    torn: {
      gnist: { l: 'Skab en gnist, så Nusse ikke er bange for mørket', to: 'tornOk' },
      dyr: { l: 'Tal med fuglene, så de skubber tornene til side', to: 'tornOk' },
      syn: { l: 'Se, hvordan grenen sidder, og find den lette måde at løsne den på', to: 'tornOk' },
      latter: { l: 'Strø latterstøv, så Nusse får lyst til at smile og række ud', to: 'tornOk' }
    },
    gaade: {
      gnist: { l: 'Skab en gnist, så I kan se alle bøgerne i Molls hule', to: 'gaadeKig' },
      dyr: { l: 'Spørg Molls tusindben, hvad hun elsker allermest', to: 'gaadeKig' },
      syn: { l: 'Se på bogryggene, der gemmer sig i mørket', to: 'gaadeKig' },
      latter: { l: 'Strø latterstøv, så Moll kommer til at grine svaret ud', to: 'gaadeOk' }
    },
    svamp: {
      gnist: { l: 'Skab en gnist, der danser rundt og får Tut til at kigge op', to: 'svampOk' },
      dyr: { l: 'Spørg den lille flue, hvad Tut savner', to: 'svampOk' },
      syn: { l: 'Se, at Tut gemmer et lille legetøj under hatten', to: 'svampOk' },
      latter: { l: 'Strø latterstøv på Tuts hat', to: 'svampOk' }
    },
    hub: {
      syn: { l: 'Se den skjulte sti mellem træerne', to: 'svamp', show: function () { return k.state.visited.indexOf('svamp') < 0 && !!k.lockTxt('Nysgerrighed', 2); } }
    },
    tree: {
      gnist: { l: 'Lav en ekstra gnist til træet', to: 'tree', eff: function (h) { k.state.gnists++; k.state.gnistList.push({ key: 'magi_' + h.id + '_' + k.state.gnists, c: 'magiske', def: k.gen(h.name) + ' gnist', col: '#F2C94C', ph: 'Stjerne', name: '' }); } },
      dyr: { l: 'Bed skovens dyr om at hjælpe', to: 'endFriends' },
      latter: { l: 'Strø latterstøv, så træet må grine', to: 'endSang' }
    }
  };

  /* Mester-valg: når en helt har 5 i et træk, åbner der sig et ekstra valg i scenen (uden terning).
     Højst ét mester-valg pr. træk pr. eventyr (k.state.maxUsed). Vises først, når det er opnået. */
  var mester = {
    bro: [
      { stat: 'Mod', l: 'Bær de andre over stammen, som var den en bred bro', to: 'broOk', n: function (n) { return n + ' går roligt ud på stammen, og den holder helt stille under de modige fødder. Én efter én kommer alle sikkert over.'; } },
      { stat: 'List', l: 'Find den tørre genvej, som kun en snedig helt får øje på', to: 'broOk', n: function (n) { return n + ' får øje på nogle flade sten, der gemmer sig under bregnerne, og leder alle tørskoede rundt om det værste vand.'; } },
      { stat: 'Fantasi', l: 'Tegn en lysende regnbuebro op i luften', to: 'broOk', n: function (n) { return n + ' lukker øjnene og tegner med fingrene. En regnbuebro bygger sig selv hen over bækken, og alle går over uden at vippe.'; } }
    ],
    torn: [
      { stat: 'Venlighed', l: 'Lyt længe til Nusse, til han selv vil række ud', to: 'tornOk', n: function (n) { return n + ' sætter sig ned og lytter længe, uden at skynde på. Til sidst rækker Nusse selv ud efter sin gnist og smiler.'; } },
      { stat: 'Mod', l: 'Åbn krattet som en port med bare hænder', to: 'tornOk', n: function (n) { return n + ' bøjer tornene til side så roligt, at de næsten glemmer at stikke. Nusse og gnisten kommer sikkert ud.'; } },
      { stat: 'Humor', l: 'Lav den sjoveste lyd i hele skoven', to: 'tornOk', n: function (n) { return n + ' laver en lyd som en ged med hikke på en trampolin, og Nusse må holde sig for munden af grin. Så er han slet ikke bange mere.'; } }
    ],
    gaade: [
      { stat: 'Nysgerrighed', l: 'Læs bogryggene, og find svaret med det samme', to: 'gaadeKig', n: function (n) { return n + ' løber øjnene hen over bogryggene og får øje på ét ord: HISTORIER. Så er svaret let.'; } },
      { stat: 'Venlighed', l: 'Bed Moll fortælle om sin yndlingsbog', to: 'gaadeOk', n: function (n) { return n + ' spørger Moll, hvad hun elsker allermest, og hun begynder at fortælle om sin yndlingsbog. Midt i fortællingen kommer svaret af sig selv.'; } }
    ],
    svamp: [
      { stat: 'Humor', l: 'Lav en hel lille forestilling for Tut', to: 'svampOk', n: function (n) { return n + ' laver en forestilling med en hikkende frø, en dansende svamp og et meget langt gabe. Tut må tørre øjnene af grin.'; } },
      { stat: 'Venlighed', l: 'Sæt dig ved siden af Tut, og lyt, til han selv smiler', to: 'svampOk', n: function (n) { return n + ' sætter sig stille ved siden af Tut og lytter. Efter lidt tid begynder Tut selv at smile.'; } },
      { stat: 'Fantasi', l: 'Fortæl, hvordan svampene engang var natlamper for en tudsekonge', to: 'svampOk', n: function (n) { return n + ' fortæller om en tudsekonge, hvis natlamper voksede op af jorden. Tut lytter med åben mund og glemmer helt at være trist.'; } }
    ],
    tree: []
  };
  k.stats.forEach(function (t) {
    mester.tree.push({ stat: t[0], l: 'Brug mester-trækket ' + t[0] + ' til at tænde træet', to: 'endMester', eff: function (h, stat) { k.state.mester = { name: h.name, stat: stat }; } });
  });

  /* Billeder til scenerne, tegnet med delene i art/dele.js (LK.art.scene). Koordinater i en ramme på 400 x 250. */
  var billeder = {
    s1: { sted: 'skovsti', himmel: 'nat', alt: 'Uffe sidder bekymret på en gren i den mørke skov, hvor alle lanternerne er slukket.',
      ting: [{ navn: 'gren', x: 150, y: 172 }, { navn: 'lanterne', x: 95, y: 140 }, { navn: 'lanterne', x: 345, y: 150 }],
      figurer: [{ navn: 'uffe', x: 205, y: 128, humoer: 'bekymret' }] },
    s1b: { sted: 'skovsti', himmel: 'nat', alt: 'Uffe fortæller, at Vinden har spredt gnisterne ud over hele skoven.',
      ting: [{ navn: 'gren', x: 150, y: 172 }, { navn: 'lanterne', x: 95, y: 140 }, { navn: 'gnist', x: 300, y: 95, skala: 0.7, taendt: true }, { navn: 'gnist', x: 350, y: 135, skala: 0.6, taendt: true }],
      figurer: [{ navn: 'uffe', x: 190, y: 128, humoer: 'rolig' }] },
    hub: { sted: 'skovsti', himmel: 'nat', alt: 'Stien deler sig i den mørke skov, og Uffe lytter efter lyde.',
      ting: [{ navn: 'svamp', x: 330, y: 222, skala: 0.8, taendt: true }],
      figurer: [{ navn: 'uffe', x: 150, y: 172, skala: 0.85, humoer: 'overrasket' }] },
    bro: { sted: 'baek', himmel: 'nat', alt: 'En glat træstamme ligger over bækken, og på den anden side glimter en gnist.',
      ting: [{ navn: 'gren', x: 215, y: 218, skala: 0.55 }, { navn: 'gnist', x: 330, y: 196, taendt: true }],
      figurer: [{ navn: 'uffe', x: 95, y: 166, skala: 0.8, humoer: 'bekymret' }] },
    broOk: { sted: 'baek', himmel: 'skumring', alt: 'Gnisten hopper op fra bækken, og Uffe jubler.',
      ting: [{ navn: 'gren', x: 215, y: 218, skala: 0.55 }, { navn: 'gnist', x: 230, y: 140, skala: 1.4, taendt: true }],
      figurer: [{ navn: 'uffe', x: 130, y: 166, skala: 0.85, humoer: 'glad' }] },
    broFejl: { sted: 'baek', himmel: 'nat', alt: 'Plask! Gnisten glider væk med strømmen, og Uffe ser forbavset efter den.',
      ting: [{ navn: 'gren', x: 215, y: 218, skala: 0.55 }, { navn: 'gnist', x: 345, y: 222, skala: 0.6, taendt: true }],
      figurer: [{ navn: 'uffe', x: 120, y: 166, skala: 0.85, humoer: 'overrasket' }] },
    torn: { sted: 'tornekrat', himmel: 'nat', alt: 'Nissen Nusse sidder bange i tornekrattet, og hans gnist hænger fast i en gren.',
      ting: [{ navn: 'gnist', x: 245, y: 180, taendt: true }],
      figurer: [{ navn: 'nusse', x: 160, y: 178, humoer: 'bekymret' }, { navn: 'uffe', x: 320, y: 160, skala: 0.75, humoer: 'bekymret' }] },
    tornOk: { sted: 'tornekrat', himmel: 'skumring', alt: 'Nusse smiler, og gnisten svæver fri af tornene.',
      ting: [{ navn: 'gnist', x: 235, y: 120, skala: 1.3, taendt: true }],
      figurer: [{ navn: 'nusse', x: 160, y: 178, humoer: 'glad' }, { navn: 'uffe', x: 320, y: 160, skala: 0.75, humoer: 'glad' }] },
    tornFejl: { sted: 'tornekrat', himmel: 'nat', alt: 'Nusse kryber bange ned i busken, og Uffe venter roligt ved siden af.',
      figurer: [{ navn: 'nusse', x: 255, y: 205, skala: 0.65, humoer: 'bekymret' }, { navn: 'uffe', x: 110, y: 165, skala: 0.75, humoer: 'rolig' }] },
    gaade: { sted: 'hule', himmel: 'nat', alt: 'Muldvarpen Moll stikker snuden frem fra sin hule og stiller jer en gåde.',
      figurer: [{ navn: 'moll', x: 200, y: 192, humoer: 'glad' }, { navn: 'uffe', x: 320, y: 186, skala: 0.7, humoer: 'overrasket' }] },
    gaadeKig: { sted: 'hule', himmel: 'skumring', alt: 'Ved Molls hule ligger en bog, og Moll rækker jer en gnist.',
      ting: [{ navn: 'bog', x: 110, y: 228, skala: 1.2, taendt: true }, { navn: 'gnist', x: 245, y: 160, taendt: true }],
      figurer: [{ navn: 'moll', x: 200, y: 192, humoer: 'glad' }, { navn: 'uffe', x: 320, y: 186, skala: 0.7, humoer: 'glad' }] },
    gaadeHint: { sted: 'hule', himmel: 'nat', alt: 'Moll smiler og giver et hint: noget, man kan åbne og holde i hænderne.',
      figurer: [{ navn: 'moll', x: 200, y: 192, humoer: 'rolig' }, { navn: 'uffe', x: 320, y: 186, skala: 0.7, humoer: 'bekymret' }] },
    gaadeOk: { sted: 'hule', himmel: 'aften', alt: 'Moll klapper glad og giver jer en gnist.',
      ting: [{ navn: 'gnist', x: 245, y: 160, taendt: true }],
      figurer: [{ navn: 'moll', x: 200, y: 192, humoer: 'glad' }, { navn: 'uffe', x: 320, y: 186, skala: 0.7, humoer: 'glad' }] },
    svamp: { sted: 'lysning', himmel: 'nat', alt: 'Tudsen Tut sidder trist midt i en cirkel af lysende svampe.',
      ting: [{ navn: 'svamp', x: 135, y: 214, taendt: true }, { navn: 'svamp', x: 160, y: 232, taendt: true }, { navn: 'svamp', x: 245, y: 232, taendt: true }, { navn: 'svamp', x: 270, y: 214, taendt: true }],
      figurer: [{ navn: 'tut', x: 202, y: 180, humoer: 'bekymret' }, { navn: 'uffe', x: 335, y: 176, skala: 0.7, humoer: 'rolig' }] },
    svampOk: { sted: 'lysning', himmel: 'skumring', alt: 'Tut griner, så hatten ryster, og giver jer en gnist.',
      ting: [{ navn: 'svamp', x: 135, y: 214, taendt: true }, { navn: 'svamp', x: 160, y: 232, taendt: true }, { navn: 'svamp', x: 245, y: 232, taendt: true }, { navn: 'svamp', x: 270, y: 214, taendt: true }, { navn: 'gnist', x: 200, y: 112, taendt: true }],
      figurer: [{ navn: 'tut', x: 202, y: 180, humoer: 'glad' }, { navn: 'uffe', x: 335, y: 176, skala: 0.7, humoer: 'glad' }] },
    svampFejl: { sted: 'lysning', himmel: 'nat', alt: 'Tut har trukket hatten ned, og I sidder stille sammen ved svampene.',
      ting: [{ navn: 'svamp', x: 135, y: 214, taendt: true }, { navn: 'svamp', x: 160, y: 232, taendt: true }, { navn: 'svamp', x: 245, y: 232, taendt: true }, { navn: 'svamp', x: 270, y: 214, taendt: true }],
      figurer: [{ navn: 'tut', x: 202, y: 180, humoer: 'bekymret' }, { navn: 'uffe', x: 335, y: 176, skala: 0.7, humoer: 'rolig' }] },
    tree: { sted: 'slukkettrae', himmel: 'nat', alt: 'Lanternetræet står stort og mørkt, og Uffe sidder på den laveste gren.',
      figurer: [{ navn: 'uffe', x: 288, y: 98, skala: 0.55, humoer: 'overrasket' }] },
    endLight: { sted: 'lanternetrae', himmel: 'aften', alt: 'Lanternetræet lyser, og Uffe jubler ved foden af det.',
      ting: [{ navn: 'gnist', x: 70, y: 110, taendt: true }, { navn: 'gnist', x: 330, y: 70, skala: 0.8, taendt: true }],
      figurer: [{ navn: 'uffe', x: 115, y: 172, skala: 0.8, humoer: 'glad' }] },
    endFriends: { sted: 'lanternetrae', himmel: 'aften', alt: 'Ræve, mus og pindsvin kommer med lamper, og Lanternetræet lyser af venskab.',
      ting: [{ navn: 'lanterne', x: 288, y: 140, taendt: true }],
      figurer: [{ navn: 'raev', x: 70, y: 180, skala: 0.85 }, { navn: 'mus', x: 130, y: 196, skala: 0.75 }, { navn: 'pind', x: 270, y: 196, skala: 0.7 },
        { navn: 'uffe', x: 340, y: 178, skala: 0.75, humoer: 'glad' }] },
    endSammen: { sted: 'lanternetrae', himmel: 'aften', alt: 'Vennerne bærer gnisterne op, og hele Lanternetræet skinner.',
      ting: [{ navn: 'gnist', x: 140, y: 140, skala: 0.8, taendt: true }, { navn: 'gnist', x: 262, y: 140, skala: 0.8, taendt: true }],
      figurer: [{ navn: 'nusse', x: 70, y: 182, skala: 0.85 }, { navn: 'moll', x: 135, y: 196, skala: 0.75 }, { navn: 'tut', x: 270, y: 194, skala: 0.75 },
        { navn: 'uffe', x: 340, y: 178, skala: 0.75, humoer: 'glad' }] },
    endSang: { sted: 'lanternetrae', himmel: 'aften', alt: 'Uffe synger ved Lanternetræet, og lanternerne blinker i takt.',
      ting: [{ navn: 'gnist', x: 80, y: 100, skala: 0.8, taendt: true }],
      figurer: [{ navn: 'uffe', x: 110, y: 172, skala: 0.8, humoer: 'rolig' }, { navn: 'lysorm', x: 290, y: 205, skala: 0.7 }] },
    endMester: { sted: 'lanternetrae', himmel: 'aften', alt: 'Hele Lanterneskoven lyser, og Uffe sidder tilfreds på træets laveste gren.',
      figurer: [{ navn: 'uffe', x: 288, y: 98, skala: 0.55, humoer: 'rolig' }] }
  };

  return {
    id: 'lantern', start: 's1', title: 'Lanterneskoven', tag: 'Del 1 af 4',
    blurb: 'Uffe uglen skal have hjælp til at tænde skovens lanterner.',
    scenes: scenes, magi: magi, mester: mester, billeder: billeder
  };
});
