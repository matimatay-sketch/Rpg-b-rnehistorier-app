// Månedens historier, november 2026: Pjuskes efterårsliste, kapitel 1 af 4: Den første frost. Historiefil: registrerer sig med LK.addStory og får kit-hjælperne som k.
// Et kapitel står for sig selv. Det må læse vennerne fra sagaen, men sætter aldrig venne-flag.
//
// Plan for serien: Den første frost er kommet, og pindsvinet Pjuske skal snart gå i hi og sove hele vinteren.
// Men først vil han nå fire ting på sin efterårsliste, som Uffe har skrevet for ham på et stort egeblad.
//  1. Den første frost (6. nov.): find den blødeste seng i skoven. Bevægelse: list lydløst forbi den sovende bjørn.
//  2. Trækfuglenes farvel (13. nov.): sig farvel til gæssene, der flyver sydpå. Bevægelse: blæs en fjer over bordet.
//  3. Den lange aften (20. nov.): se lysormene lyse i den mørke aften. Bevægelse: balancér en bamse på hovedet.
//  4. Godnat, Pjuske (27. nov.): gå med lanterner til Pjuskes seng og syng godnat. Bevægelse: gå på line i tågen.
// Hvert kapitel kan spilles alene og slutter godt, med ét punkt på listen klaret.
LK.addStory(function (k) {
  var PATHS = [
    { id: 'blade', to: 'pj1Blade', label: 'Gå ud i lysningen, hvor bladene glitrer af frost' },
    { id: 'bjorn', to: 'pj1Bjorn', label: 'Følg den dybe snorken hen til bjørnens hule' },
    { id: 'moll', to: 'pj1Moll', label: 'Bank på hos muldvarpen Moll' }
  ];
  // Det, I finder til sengen, er en gnist med sit eget navn.
  var FUND = function (c, def, col, ph) { return { c: c, def: def, col: col, ph: ph }; };

  var MESTER_TXT = {
    Mod: function (n) { return n + ' kravler helt ind under den store rod, hvor det er mørkt og kildrer af spindelvæv, og fejer den gamle jord væk. Derinde er der lunt og tørt, og det er det bedste sted i hele skoven til en vinterseng.'; },
    List: function (n) { return n + ' fletter grene og blade sammen til et lille tag over sengen, så hverken regn eller sne kan komme ind. &laquo;Et hus med tag!&raquo; siger Pjuske. &laquo;Det har intet pindsvin haft før.&raquo;'; },
    Venlighed: function (n) { return n + ' spørger hele skoven om ét blad hver. Snart kommer dyrene med blade i alle farver, og sengen bliver bygget af venlighed, ét blad ad gangen.'; },
    Fantasi: function (n) { return n + ' lægger bladene i en stor spiral, så sengen ligner en snegl. &laquo;Så kan jeg drømme i ring hele vinteren,&raquo; siger Pjuske og fniser.'; },
    Humor: function (n) { return n + ' lægger sig i bladene og laver de sjoveste snorkelyde, man har hørt. Pjuske griner, så han triller rundt, og hvert trille gør sengen blødere og rundere.'; },
    Nysgerrighed: function (n) { return n + ' kigger under en sten og finder en gammel, glemt bunke tørre blade, som et andet pindsvin har gemt for mange år siden. De er de blødeste i hele skoven.'; }
  };

  // Venner fra sagaen, der kommer med noget blødt. Historiens egne linjer i stedet for k.friendLines(), som er skrevet
  // til sagaen. Moll kan allerede have været mødt i dag, så hendes linje passer, uanset om I har besøgt hende.
  function venneLinjer() {
    var f = k.state.flags, o = [];
    if (f.nusseVen || f.nusseHonning) o.push('Nusse kommer med sin røde hue fuld af tørre blade. &laquo;Huen kan jeg få igen til foråret,&raquo; siger han.');
    if (f.mollLoefte) o.push('Moll stikker hovedet op af jorden med en håndfuld tørt græs. &laquo;Det dufter af sommer,&raquo; siger hun.');
    if (f.tutVen) o.push('Tut hopper ind med hatten fuld af blødt mos og taber halvdelen undervejs.');
    if (f.vindVen) o.push('Vinden puster blidt og samler alle de løse blade i én stor, rund bunke.');
    if (f.maaneVen) o.push('Månen står bleg på morgenhimlen og blinker ned til Pjuske.');
    return o;
  }

  var scenes = {
    pj1Start: {
      title: 'Frost på ruden',
      text: function () {
        var t = ['I nat kom den første frost til Lanterneskoven. Ruden er fuld af små, hvide isblomster, og græsset udenfor er stift og glitrer i solen. Uffe sidder på vindueskarmen og har pustet fjerene op, så han ligner en lille, rund pude.',
          'Så banker det på ruden. Tik, tik. Udenfor står et lille pindsvin med frost på næsetippen. &laquo;Hej. Jeg hedder Pjuske,&raquo; siger det. &laquo;Når frosten kommer, skal pindsvin snart sove hele vinteren. Men min seng blæste væk i nat. Vil I hjælpe mig?&raquo;'];
        if (k.state.remembered.length) t.push('Uffe blinker til Pjuske. &laquo;Dem her kan du stole på. ' + k.joinNames(k.state.remembered) + ' har hjulpet hele skoven før.&raquo;');
        return t;
      },
      ask: 'Hvordan tror I, det føles at skulle sove en hel vinter?',
      choices: [{ label: 'Tag varmt tøj på, og gå med Pjuske', to: 'pj1Hub' }, { label: 'Spørg Pjuske, hvad det store blad er', to: 'pj1Liste' }]
    },
    pj1Liste: {
      title: 'Pjuskes liste',
      text: ['Pjuske holder et stort, brunt egeblad. Der er skrevet på det med små, krøllede bogstaver. &laquo;Uffe har skrevet min efterårsliste,&raquo; siger han stolt. &laquo;Det er fire ting, jeg vil nå, før jeg går i hi.&raquo;',
        'Uffe læser højt: &laquo;Et: Find den blødeste seng i skoven. To: Sig farvel til trækfuglene. Tre: Se lysormene lyse i den lange aften. Fire: Bliv sunget godnat af alle vennerne.&raquo;',
        '&laquo;I dag er det nummer et,&raquo; siger Pjuske og gaber. Uffe plukker en lille fjer af sin vinge. &laquo;Tag den med. Den giver held. Brug den, når I slår med terningen.&raquo;'],
      gainFeather: true,
      ask: 'Hvad ville I skrive på jeres egen efterårsliste?',
      choices: [{ label: 'Nummer et! Afsted!', to: 'pj1Hub' }]
    },
    pj1Hub: {
      title: 'Rim på stien',
      text: function () {
        var g = k.state.gnists, v = k.state.visited.length;
        if (v === 0) return ['Frosten knaser under jeres sko, og jeres ånde laver små, hvide skyer. Pjuske tripper ved siden af jer, og Uffe flyver foran og kigger efter noget blødt.',
          '&laquo;Hvis vi finder bare to bløde ting, kan jeg bygge en seng,&raquo; siger Pjuske. &laquo;Og finder vi flere, bliver den ekstra lun.&raquo;'];
        var a = 'I går videre på den frosne sti. Pjuske gaber, men han holder sig vågen.';
        var b = g === 0 ? '&laquo;Vi har ikke fundet noget endnu,&raquo; siger Pjuske. &laquo;Skal vi lede et sted til, eller gå hen til min plads under den store rod?&raquo;'
          : g === 1 ? '&laquo;Én blød ting!&raquo; siger Pjuske og klapper på den. &laquo;Sengen skal bruge to. Men I bestemmer.&raquo;'
          : '&laquo;Nu har vi nok til en seng,&raquo; siger Pjuske. &laquo;Men jo mere blødt, jo lunere. I bestemmer.&raquo;';
        var left = PATHS.filter(function (p) { return k.state.visited.indexOf(p.id) < 0; }).length + (k.state.visited.indexOf('mus') < 0 ? 1 : 0);
        return [a, b + (left === 0 ? ' Der er ikke flere steder at lede.' : '')];
      },
      ask: 'Hvor i skoven tror I, der er allermest blødt?',
      dyn: function () {
        var c = PATHS.filter(function (p) { return k.state.visited.indexOf(p.id) < 0; }).map(function (p) { return { label: p.label, to: p.to }; });
        if (k.state.visited.indexOf('mus') < 0) c.push({ label: 'Følg de bittesmå spor ned til bækken', to: 'pj1Mus', lock: function () { return k.lockTxt('Nysgerrighed', 2); } });
        if (k.state.visited.length > 0) c.push({ label: 'Gå hen til Pjuskes plads under den store rod', to: 'pj1Rod' });
        return c;
      }
    },
    pj1Blade: {
      title: 'De frosne blade', path: 'blade',
      text: ['Lysningen er fuld af blade i rødt, gult og brunt. Men frosten har gjort dem stive og glitrende, og når Pjuske træder på dem, knaser de som chips.',
        '&laquo;Frosne blade er ikke bløde,&raquo; siger Pjuske og ser lidt trist ud. Inde under en stor gran ligger der et rødt blad, som frosten ikke har fundet.'],
      ask: 'Hvordan kan man få noget koldt til at blive varmt igen?',
      choices: [
        { label: 'Pust varm luft på bladene, ét ad gangen', roll: { stat: 'Venlighed', target: 6, win: 'pj1BladeOk', lose: 'pj1BladeFejl' } },
        { label: 'Kryb ind under granen og hent det røde blad', roll: { stat: 'List', target: 6, win: 'pj1BladeOk', lose: 'pj1BladeFejl' } },
        { label: 'Lav en solskinsdans, så solen kigger frem', roll: { stat: 'Humor', target: 6, win: 'pj1BladeOk', lose: 'pj1BladeFejl' } }
      ]
    },
    pj1BladeOk: {
      title: 'Det røde blad', gain: true, gnist: FUND('røde', 'Det røde blad', '#D9772E', 'Knas'),
      text: ['Solen kigger frem mellem træerne, og frosten smelter til små, glitrende dråber. Det røde blad er blødt som et tæppe, og det er stort nok til at dække et helt pindsvin.',
        '&laquo;Det første!&raquo; siger Pjuske og lægger det på hovedet som en hat. &laquo;Hu-hu, det klæder dig,&raquo; siger Uffe.'],
      ask: 'Hvis I skulle have en hat af et blad, hvilken farve skulle det så være?',
      next: 'pj1Hub'
    },
    pj1BladeFejl: {
      title: 'Knas-knas',
      text: ['I samler en stor armfuld blade. Men de er stadig frosne, og KNAS! De knækker i hundrede små stykker, der drysser ned som cornflakes.',
        'Pjuske kigger på bunken og griner. &laquo;Det er den sjoveste lyd, jeg har hørt i dag. Men det er ikke en seng. Der er mere blødt andre steder.&raquo;'],
      ask: 'Hvad er den sjoveste lyd, I kender?',
      next: 'pj1Hub'
    },
    pj1Bjorn: {
      title: 'Bjørnens hule', path: 'bjorn',
      text: ['Inde i en stor hule sover bjørnen Brumme. Han er allerede gået i hi, og han snorker så dybt, at jorden summer. SNOOORK. Pust. SNOOORK. Pust.',
        'Lige foran hulen ligger hans gamle bladbunke. &laquo;Brumme sagde i går, at jeg måtte få den,&raquo; hvisker Pjuske. &laquo;Han har en ny seng derinde. Men vi må ikke vække ham. En bjørn, der vågner i hi, bliver så forvirret.&raquo;'],
      ask: 'Hvordan er man helt stille, når man gerne vil grine?',
      choices: [
        { label: 'List lydløst hen til bladbunken', bevaeg: { goer: 'Gå på tæerne fra den ene ende af stuen til den anden, så stille I kan. Ingen må høre et eneste trin.', stat: 'List', target: 6, win: 'pj1BjornOk', lose: 'pj1BjornFejl' } },
        { label: 'Lad som om I er fjer, der svæver hen over jorden', roll: { stat: 'Fantasi', target: 6, win: 'pj1BjornOk', lose: 'pj1BjornFejl' } },
        { label: 'Nyn en stille godnatsang, så Brumme sover endnu tungere', roll: { stat: 'Venlighed', target: 6, win: 'pj1BjornOk', lose: 'pj1BjornFejl' } }
      ]
    },
    pj1BjornOk: {
      title: 'Bjørnebladene', gain: true, gnist: FUND('gyldne', 'Bjørnebladene', '#E3A21A', 'Brum'),
      text: ['Skridt for skridt, helt uden en lyd, kommer I hen til bunken. Bladene er tørre og gyldne, og de er varme, fordi en stor bjørn har sovet på dem hele efteråret.',
        'I bærer dem væk på listefødder. Bag jer snorker Brumme videre. SNOOORK. Pust. Pjuske holder sig for munden, så han ikke kommer til at fnise.'],
      ask: 'Hvem i jeres familie snorker? Hvordan lyder det?',
      next: 'pj1Hub'
    },
    pj1BjornFejl: {
      title: 'Er det forår?', flag: 'pj1Brumme',
      text: ['KNÆK! En lille pind knækker under en fod. Snorkene stopper. Brumme åbner ét øje og mumler: &laquo;Er det forår?&raquo;',
        '&laquo;Nej, det er kun november,&raquo; hvisker Pjuske. &laquo;Godt,&raquo; mumler Brumme. Så vender han sig om, lige ud på bladbunken. Nu er bladene flade som pandekager, og der ligger en stor bjørn på dem. SNOOORK. Pust. Pjuske må gemme hovedet for ikke at grine højt.'],
      ask: 'Hvad tror I, bjørne drømmer om, når de sover hele vinteren?',
      next: 'pj1Hub'
    },
    pj1Moll: {
      title: 'Molls gåde', path: 'moll',
      text: ['Inde i sin lune hule sidder muldvarpen Moll og strikker. Ved siden af hende ligger en tyk, stribet uldsok. &laquo;Den blev for stor til mig og for lille til en bjørn,&raquo; siger hun. &laquo;Men den er lige til et pindsvin.&raquo;',
        'Moll skubber brillerne op. &laquo;I får den, hvis I kan svare på min gåde: Jeg kommer om natten uden at banke på. Jeg maler hvide blomster på ruden, men jeg har ingen pensel. Når solen kommer, går jeg igen. Hvad er jeg?&raquo;'],
      ask: 'Tænk sammen, før I svarer. Hvad så I på ruden i morges?',
      choices: [
        { label: 'Frosten', to: 'pj1MollOk', key: 'frost' },
        { label: 'En maler', to: 'pj1Moll', key: 'maler', wrong: 'Moll klukker: &laquo;En maler banker da på! Og han har en pensel.&raquo;' },
        { label: 'Julemanden', to: 'pj1Moll', key: 'julemand', wrong: 'Moll fniser: &laquo;Han kommer først i december. Prøv igen!&raquo;' },
        { label: 'Kig ud ad Molls lille vindue', key: 'kig', roll: { stat: 'Nysgerrighed', target: 6, win: 'pj1MollKig', lose: 'pj1MollHint' } }
      ]
    },
    pj1MollKig: {
      title: 'Uldsokken', gain: true, gnist: FUND('stribede', 'Uldsokken', '#9B6BD6', 'Strik'),
      text: ['I kigger ud ad Molls lille vindue. Ruden er fuld af hvide isblomster, der krøller sig som bregner. &laquo;Det er frosten!&raquo; siger I. &laquo;Den har malet hele ruden.&raquo;',
        'Moll klapper i sine små hænder og giver Pjuske uldsokken. Han kryber ind i den, så kun næsen stikker ud. &laquo;Den er varm som en kop kakao,&raquo; siger han.'],
      ask: 'Hvad ville I male på en rude, hvis I var frosten?',
      next: 'pj1Hub'
    },
    pj1MollHint: {
      title: 'Et lille hint',
      text: ['Molls vindue er helt dugget til, så I kan ikke se noget. Moll smiler. &laquo;Jeg giver jer et hint: I mødte mig på vejen herhen. Jeg fik græsset til at knase og jeres ånde til at blive hvid.&raquo;'],
      ask: 'Hvad knasede under jeres sko på vejen herhen?',
      next: 'pj1Moll'
    },
    pj1MollOk: {
      title: 'Uldsokken', gain: true, gnist: FUND('stribede', 'Uldsokken', '#9B6BD6', 'Strik'),
      text: ['&laquo;Frosten! Selvfølgelig!&raquo; Moll klapper i sine små hænder og giver Pjuske uldsokken.',
        'Pjuske kryber ind i den, så kun næsen stikker ud. &laquo;Den er varm som en kop kakao,&raquo; siger han. Moll strikker videre. &laquo;Nu laver jeg en til Uffe,&raquo; siger hun. Uffe ser lidt bekymret ud.'],
      ask: 'Hvad er det varmeste tøj, I har?',
      next: 'pj1Hub'
    },
    pj1Mus: {
      title: 'Musenes mos', path: 'mus',
      text: ['De bittesmå spor fører ned til bækken. Her bor en musefamilie i et hul under en sten, og de har samlet mos til vinteren. Så meget mos, at det ikke kan komme ind ad døren!',
        '&laquo;Vi har en mospude for meget,&raquo; piber den mindste mus. &laquo;Den sidder fast i døren. Hvis I kan få den ud, må Pjuske få den.&raquo;'],
      ask: 'Hvad gør man, når man har samlet alt for meget af noget?',
      choices: [
        { label: 'Træk forsigtigt i den store mospude', roll: { stat: 'Mod', target: 6, win: 'pj1MusOk', lose: 'pj1MusFejl' } },
        { label: 'Fold mosset sammen som et lille tæppe', roll: { stat: 'List', target: 6, win: 'pj1MusOk', lose: 'pj1MusFejl' } },
        { label: 'Kild døren, så den griner og bliver større', roll: { stat: 'Humor', target: 6, win: 'pj1MusOk', lose: 'pj1MusFejl' } }
      ]
    },
    pj1MusOk: {
      title: 'Mospuden', gain: true, gnist: FUND('grønne', 'Mospuden', '#4CAF6A', 'Blød'),
      text: ['PLOP! Mospuden kommer ud af døren, og musene jubler. Den er grøn og blød og dufter af skov.',
        '&laquo;Tak!&raquo; piber den mindste mus. &laquo;Nu kan vi komme ind i vores eget hus igen.&raquo; Pjuske lægger kinden mod puden og lukker øjnene et øjeblik. &laquo;Blødt,&raquo; mumler han.'],
      ask: 'Hvad tror I, musene laver inde i deres hus om vinteren?',
      next: 'pj1Hub'
    },
    pj1MusFejl: {
      title: 'Mosbåden',
      text: ['Mospuden ryger ud med et ryk og triller lige ned i bækken. Plask! Den flyder af sted som en lille, grøn båd.',
        'En frø hopper op på den og vinker. &laquo;Tak for båden!&raquo; kvækker den og sejler væk. Musene griner, så de må holde sig på maven. &laquo;Vi har mere mos til foråret,&raquo; siger de.'],
      ask: 'Hvor tror I, frøen sejler hen?',
      next: 'pj1Hub'
    },
    pj1Rod: {
      title: 'Under den store rod',
      text: function () {
        var g = k.state.gnists;
        var a = 'Pjuskes plads er under en gammel eg med store, krogede rødder. Der er tørt og lunt, og derinde skal han sove, til foråret kommer. Men pladsen er helt tom.';
        var b = g >= 4 ? '&laquo;' + k.joinNames(k.gnistNames()) + '!&raquo; siger Pjuske. &laquo;Det bliver den blødeste seng i hele verden!&raquo;'
          : g >= 2 ? '&laquo;' + k.joinNames(k.gnistNames()) + '. Det er nok til en rigtig seng!&raquo; siger Pjuske.'
          : g === 1 ? '&laquo;' + k.joinNames(k.gnistNames()) + ' er en god begyndelse,&raquo; siger Pjuske. &laquo;Måske kan vi klare resten sammen.&raquo;'
          : '&laquo;Vi fandt ikke noget blødt,&raquo; siger Pjuske og kigger ned. Uffe lægger en vinge om ham. &laquo;Men vi fandt hinanden. Lad os spørge skovens venner.&raquo;';
        var t = [a, b];
        if (k.state.flags.pj1Brumme) t.push('Langt borte kan I høre Brumme snorke på sine pandekageblade. SNOOORK. Pust. Pjuske fniser.');
        return t;
      },
      ask: 'Hvad skal der til, før en seng er rigtig god at sove i?',
      dyn: function () {
        var c = [];
        if (k.state.gnists > 0) c.push({ label: 'Byg sengen af det, I har fundet', to: 'pj1EndSeng' });
        c.push({ label: 'Råb på skovens venner', to: 'pj1EndVenner' });
        c.push({ label: 'Lad Uffe prøve sengen først', to: 'pj1EndFjer', lock: function () { return k.partyStat('Humor') >= 3 || k.partyStat('Fantasi') >= 3 ? null : 'Kræver Humor 3 eller Fantasi 3'; } });
        return c;
      }
    },
    pj1EndSeng: {
      title: 'Den blødeste seng', end: true, all: true,
      text: function () {
        var g = k.state.gnists, navne = k.joinNames(k.gnistNames());
        var t;
        if (g >= 3) t = ['I lægger ' + navne + ' ind under roden, lag på lag. Sengen bliver rund og blød og dyb som en rede. Pjuske kryber ind og forsvinder helt. Kun hans lille, sorte næse stikker op.',
          '&laquo;Den er perfekt,&raquo; siger han. &laquo;Den blødeste seng i hele skoven.&raquo;'];
        else if (g === 2) t = ['I lægger ' + navne + ' ind under roden og klapper det hele godt til. Det er ikke en stor seng, men den er rund og lun.',
          'Pjuske kryber ind og sukker glad. &laquo;Den passer præcis til ét pindsvin,&raquo; siger han.'];
        else t = ['I lægger ' + navne + ' ind under roden. Det er kun en lille seng, men Pjuske krøller sig sammen, så han passer præcis.',
          '&laquo;Små pindsvin har brug for små senge,&raquo; siger han og smiler.'];
        t.push('Så gaber han stort. &laquo;Men jeg sover ikke endnu! Der er tre ting mere på min liste.&raquo; Uffe sætter et flot flueben ved nummer et. Næste punkt på listen er trækfuglene.');
        return t;
      },
      ask: 'Hvad var det bedste valg, I tog i dag?'
    },
    pj1EndVenner: {
      title: 'En seng af venner', end: true, all: true,
      text: function () {
        var fl = venneLinjer();
        var a = 'I råber ud i den frosne skov: &laquo;Pjuske skal have en vinterseng! Har nogen noget blødt?&raquo; Først er der stille. Så rasler det mellem træerne.';
        var slut = 'Ræven kommer med en tot af sin bløde sommerpels, som han ikke skal bruge mere. Musene kommer med strå, og kragen kommer med en sort fjer. Snart er der en stor, blød seng under roden. &laquo;Den er bygget af venner,&raquo; siger Pjuske stille. &laquo;Så må den være den bedste.&raquo;';
        var t = fl.length ? [a, fl.join(' '), slut] : [a, slut];
        t.push('Uffe sætter et flueben ved nummer et på listen. Næste punkt er trækfuglene.');
        return t;
      },
      ask: function () { return venneLinjer().length ? 'Hvem var I gladest for at se i dag?' : 'Hvornår har I sidst fået hjælp af en ven? Hvordan føltes det?'; }
    },
    pj1EndFjer: {
      title: 'Uffe sidder fast', end: true, all: true,
      text: function () {
        var t = ['&laquo;Jeg prøver lige sengen først,&raquo; siger Uffe og hopper ind under roden. Han vrikker og vrider sig, og så sidder han fast. &laquo;Hu-hu! Hjælp!&raquo;',
          'I trækker i Uffe, og PUF! Han kommer ud med et ryk, men en hel sky af små, bløde dun bliver tilbage og daler ned under roden.'];
        if (k.state.gnists > 0) t.push('I lægger ' + k.joinNames(k.gnistNames()) + ' ovenpå, og så er sengen klar.');
        t.push('Pjuske kryber ind i dunene. &laquo;Nu er det den blødeste seng i skoven,&raquo; siger han. &laquo;Tak, Uffe.&raquo; Uffe retter på sine fjer og ser meget stolt ud. Fluebenet ved nummer et er sat. Næste punkt er trækfuglene.');
        return t;
      },
      ask: 'Hvad er det sjoveste sted, I nogensinde har siddet fast?'
    },
    pj1EndMester: {
      title: 'Mesterens seng', end: true, all: true,
      text: function () {
        var m = k.state.mester || { name: 'Jeres helt', stat: 'Mod' };
        var how = MESTER_TXT[m.stat] || MESTER_TXT.Mod;
        return [how(k.esc(m.name)), 'Pjuske kryber ind i sin nye seng og sukker glad. &laquo;Nu kan vinteren bare komme,&raquo; siger han. &laquo;Men ikke helt endnu. Der er tre ting mere på listen.&raquo; Uffe sætter et stort flueben ved nummer et.'];
      },
      ask: 'Hvad er I blevet rigtig gode til? Hvordan lærte I det?'
    }
  };

  var magi = {
    pj1Blade: {
      gnist: { l: 'Skab en varm gnist, der smelter frosten på bladene', to: 'pj1BladeOk' },
      dyr: { l: 'Spørg et egern, hvor der ligger tørre blade', to: 'pj1BladeOk' },
      syn: { l: 'Se det røde blad, der gemmer sig under granen', to: 'pj1BladeOk' },
      latter: { l: 'Strø latterstøv, så solen griner og varmer lysningen', to: 'pj1BladeOk' }
    },
    pj1Bjorn: {
      gnist: { l: 'Skab en gnist, der lyser en lydløs sti op', to: 'pj1BjornOk' },
      dyr: { l: 'Spørg en mus, om den vil hente bladene stille for jer', to: 'pj1BjornOk' },
      syn: { l: 'Se de bløde pletter i mosset, hvor man kan gå uden en lyd', to: 'pj1BjornOk' },
      latter: { l: 'Strø latterstøv, så Brumme smiler i søvne og sover endnu dybere', to: 'pj1BjornOk' }
    },
    pj1Moll: {
      gnist: { l: 'Skab en gnist, der tegner en isblomst i luften', to: 'pj1MollKig' },
      dyr: { l: 'Spørg Molls edderkop, hvem der malede ruden i nat', to: 'pj1MollKig' },
      syn: { l: 'Se svaret, der gemmer sig i Molls strikketøj', to: 'pj1MollKig' },
      latter: { l: 'Strø latterstøv, så Moll kommer til at grine svaret ud', to: 'pj1MollOk' }
    },
    pj1Mus: {
      gnist: { l: 'Skab en gnist, der gør mosset glat som sæbe', to: 'pj1MusOk' },
      dyr: { l: 'Spørg musene, hvordan de selv fik mosset ind', to: 'pj1MusOk' },
      syn: { l: 'Se den lille bagdør, som musene har glemt', to: 'pj1MusOk' },
      latter: { l: 'Strø latterstøv, så døren griner og bliver bred', to: 'pj1MusOk' }
    },
    pj1Hub: {
      syn: { l: 'Se de bittesmå spor, der fører ned til bækken', to: 'pj1Mus', show: function () { return k.state.visited.indexOf('mus') < 0 && !!k.lockTxt('Nysgerrighed', 2); } }
    },
    pj1Rod: {
      gnist: { l: 'Skab en ekstra blød ting til sengen', to: 'pj1Rod', eff: function (h) { k.state.gnists++; k.state.gnistList.push({ key: 'magi_' + h.id + '_' + k.state.gnists, c: 'magiske', def: k.gen(h.name) + ' dyne', col: '#F2C94C', ph: 'Dyne', name: '' }); } },
      dyr: { l: 'Bed skovens dyr om at hjælpe', to: 'pj1EndVenner' },
      latter: { l: 'Strø latterstøv, så Uffe vil prøve sengen', to: 'pj1EndFjer' }
    }
  };

  /* Mester-valg: når en helt har 5 i et træk, åbner der sig et ekstra valg i scenen (uden terning). */
  var mester = {
    pj1Blade: [
      { stat: 'Nysgerrighed', l: 'Find de blade, frosten ikke har fundet', to: 'pj1BladeOk', n: function (n) { return n + ' kigger under hver eneste gren og finder straks det røde blad, der ligger tørt og blødt under granen.'; } }
    ],
    pj1Bjorn: [
      { stat: 'List', l: 'Gå i bjørnens egne fodspor, hvor jorden er blød', to: 'pj1BjornOk', n: function (n) { return n + ' går i Brummes store, bløde fodspor, hvor ingen pinde ligger. Det er helt lydløst.'; } },
      { stat: 'Mod', l: 'Gå helt hen til hulen uden at tøve', to: 'pj1BjornOk', n: function (n) { return n + ' går roligt og sikkert hen til bunken, så stille som en sky.'; } }
    ],
    pj1Moll: [
      { stat: 'Nysgerrighed', l: 'Se på Molls rude, og find svaret med det samme', to: 'pj1MollKig', n: function (n) { return n + ' ser de hvide isblomster på Molls rude. Så er svaret let.'; } }
    ],
    pj1Mus: [
      { stat: 'Venlighed', l: 'Hjælp musene med at gøre plads derinde', to: 'pj1MusOk', n: function (n) { return n + ' hjælper musene med at stable deres mos pænt, så der bliver plads, og den sidste pude glider ud af sig selv.'; } },
      { stat: 'Fantasi', l: 'Lav mosset om til en lille vogn og trill det ud', to: 'pj1MusOk', n: function (n) { return n + ' sætter fire agern under mosset, så det bliver til en vogn, der triller lige ud ad døren.'; } }
    ],
    pj1Rod: []
  };
  k.stats.forEach(function (t) {
    mester.pj1Rod.push({ stat: t[0], l: 'Brug mester-trækket ' + t[0] + ' til at bygge Pjuskes seng', to: 'pj1EndMester', eff: function (h, stat) { k.state.mester = { name: h.name, stat: stat }; } });
  });

  /* Billeder til scenerne, tegnet med delene i art/dele.js (LK.art.scene). Koordinater i en ramme på 400 x 250. */
  var PJ = function (x, y, h, s) { return { navn: 'pind', x: x, y: y, skala: s || 0.65, humoer: h }; };
  var UF = function (x, y, h, s) { return { navn: 'uffe', x: x, y: y, skala: s || 0.65, humoer: h }; };
  var billeder = {
    pj1Start: { sted: 'vindue', himmel: 'dag', alt: 'Uffe sidder på vindueskarmen, og udenfor står et lille pindsvin med frost på næsen.',
      figurer: [{ navn: 'uffe', x: 145, y: 141, skala: 0.9, humoer: 'overrasket' }, { navn: 'pind', x: 268, y: 150, skala: 0.45, humoer: 'bekymret' }] },
    pj1Liste: { sted: 'vindue', himmel: 'dag', alt: 'Pjuske viser sin liste på et stort egeblad, og Uffe læser højt.',
      ting: [{ navn: 'blade', x: 268, y: 100, skala: 0.5 }],
      figurer: [{ navn: 'uffe', x: 145, y: 141, skala: 0.9, humoer: 'glad' }, { navn: 'pind', x: 268, y: 150, skala: 0.45, humoer: 'glad' }] },
    pj1Hub: { sted: 'skovsti', himmel: 'dag', alt: 'Pjuske og Uffe går ad den frosne sti, hvor græsset glitrer.',
      figurer: [UF(120, 190, 'glad', 0.7), PJ(250, 196, 'glad')] },
    pj1Blade: { sted: 'lysning', himmel: 'dag', alt: 'Lysningen er fuld af frosne blade, og Pjuske kigger lidt trist på dem.',
      ting: [{ navn: 'bladbunke', x: 120, y: 236, skala: 0.8 }, { navn: 'bladbunke', x: 310, y: 240, skala: 0.7 }],
      figurer: [PJ(215, 200, 'bekymret'), UF(345, 192, 'rolig', 0.6)] },
    pj1BladeOk: { sted: 'lysning', himmel: 'dag', alt: 'Solen skinner, og Pjuske har et rødt blad på hovedet som en hat.',
      ting: [{ navn: 'bladbunke', x: 310, y: 240, skala: 0.7 }, { navn: 'gnist', x: 200, y: 140, taendt: true, farve: '#D9772E' }],
      figurer: [PJ(140, 200, 'glad'), UF(345, 192, 'glad', 0.6)] },
    pj1BladeFejl: { sted: 'lysning', himmel: 'dag', alt: 'De frosne blade er knækket i små stykker, og Pjuske griner.',
      ting: [{ navn: 'blade', x: 230, y: 175, skala: 0.8 }],
      figurer: [PJ(130, 200, 'glad'), UF(330, 192, 'overrasket', 0.6)] },
    pj1Bjorn: { sted: 'hule', himmel: 'dag', alt: 'Bjørnen Brumme sover i sin hule, og foran ligger en bunke gyldne blade.',
      ting: [{ navn: 'bladbunke', x: 318, y: 246, skala: 0.7 }],
      figurer: [{ navn: 'bjorn', x: 200, y: 196, skala: 0.85, humoer: 'rolig' }, PJ(75, 212, 'overrasket', 0.55)] },
    pj1BjornOk: { sted: 'hule', himmel: 'dag', alt: 'Brumme sover videre, mens Pjuske glad holder de gyldne blade.',
      ting: [{ navn: 'gnist', x: 85, y: 150, taendt: true, farve: '#E3A21A' }],
      figurer: [{ navn: 'bjorn', x: 200, y: 196, skala: 0.85, humoer: 'rolig' }, PJ(75, 212, 'glad', 0.55)] },
    pj1BjornFejl: { sted: 'hule', himmel: 'dag', alt: 'Brumme har lagt sig på bladene og sover videre, og Pjuske holder sig for munden.',
      ting: [{ navn: 'bladbunke', x: 200, y: 248, skala: 0.9 }],
      figurer: [{ navn: 'bjorn', x: 200, y: 200, skala: 0.85, humoer: 'rolig' }, PJ(330, 212, 'overrasket', 0.55)] },
    pj1Moll: { sted: 'hule', himmel: 'dag', alt: 'Moll sidder foran sin hule med strikketøj og en stribet uldsok.',
      ting: [{ navn: 'gnist', x: 262, y: 220, skala: 0.8, taendt: true, farve: 'lilla' }],
      figurer: [{ navn: 'moll', x: 200, y: 192, humoer: 'glad' }, PJ(90, 212, 'rolig', 0.55)] },
    pj1MollKig: { sted: 'hule', himmel: 'dag', alt: 'Moll klapper, og Pjuske kigger frem fra den stribede uldsok.',
      ting: [{ navn: 'gnist', x: 300, y: 160, taendt: true, farve: 'lilla' }],
      figurer: [{ navn: 'moll', x: 200, y: 192, humoer: 'glad' }, PJ(90, 212, 'glad', 0.55)] },
    pj1MollHint: { sted: 'hule', himmel: 'dag', alt: 'Moll smiler og giver et hint, mens Uffe tænker så det knager.',
      figurer: [{ navn: 'moll', x: 200, y: 192, humoer: 'rolig' }, UF(330, 186, 'bekymret')] },
    pj1MollOk: { sted: 'hule', himmel: 'dag', alt: 'Moll giver Pjuske uldsokken, og Uffe ser lidt bekymret ud.',
      ting: [{ navn: 'gnist', x: 140, y: 150, taendt: true, farve: 'lilla' }],
      figurer: [{ navn: 'moll', x: 200, y: 192, humoer: 'glad' }, PJ(80, 212, 'glad', 0.55), UF(330, 186, 'bekymret')] },
    pj1Mus: { sted: 'baek', himmel: 'dag', alt: 'Ved bækken står en lille mus og peger på en mospude, der sidder fast.',
      ting: [{ navn: 'gnist', x: 230, y: 200, skala: 0.8, farve: 'groen' }],
      figurer: [{ navn: 'mus', x: 160, y: 180, skala: 0.7, humoer: 'bekymret' }, PJ(300, 178, 'overrasket')] },
    pj1MusOk: { sted: 'baek', himmel: 'dag', alt: 'Mospuden er kommet fri, og musen og Pjuske jubler.',
      ting: [{ navn: 'gnist', x: 230, y: 140, taendt: true, farve: 'groen' }],
      figurer: [{ navn: 'mus', x: 160, y: 180, skala: 0.7, humoer: 'glad' }, PJ(300, 178, 'glad')] },
    pj1MusFejl: { sted: 'baek', himmel: 'dag', alt: 'Mospuden flyder væk på bækken som en lille båd, og musen griner.',
      ting: [{ navn: 'gnist', x: 300, y: 214, skala: 0.7, farve: 'groen' }],
      figurer: [{ navn: 'mus', x: 110, y: 180, skala: 0.7, humoer: 'glad' }, PJ(200, 178, 'overrasket')] },
    pj1Rod: { sted: 'slukkettrae', himmel: 'skumring', alt: 'Under det store træs rødder er Pjuskes plads tom.',
      figurer: [PJ(120, 206, 'bekymret'), UF(300, 186, 'rolig', 0.7)] },
    pj1EndSeng: { sted: 'lanternetrae', himmel: 'aften', alt: 'Pjuske ligger i sin nye, bløde seng af blade under træet.',
      ting: [{ navn: 'bladbunke', x: 140, y: 238 }],
      figurer: [PJ(140, 208, 'rolig', 0.55), UF(300, 186, 'glad', 0.7)] },
    pj1EndVenner: { sted: 'lanternetrae', himmel: 'aften', alt: 'Ræven, musen og kragen har hjulpet Pjuske med en stor, blød seng.',
      ting: [{ navn: 'bladbunke', x: 200, y: 240 }],
      figurer: [{ navn: 'raev', x: 70, y: 188, skala: 0.7 }, PJ(200, 208, 'glad', 0.55), { navn: 'mus', x: 300, y: 204, skala: 0.6 }, { navn: 'krage', x: 355, y: 196, skala: 0.6 }] },
    pj1EndFjer: { sted: 'lanternetrae', himmel: 'aften', alt: 'Uffe har tabt en sky af bløde dun, og Pjuske ligger glad i dem.',
      ting: [{ navn: 'bladbunke', x: 140, y: 238 }, { navn: 'snefald', x: 140, y: 150, skala: 0.4 }],
      figurer: [PJ(140, 208, 'glad', 0.55), UF(300, 186, 'overrasket', 0.7)] },
    pj1EndMester: { sted: 'lanternetrae', himmel: 'aften', alt: 'Pjuskes seng under træet er den fineste i hele skoven.',
      ting: [{ navn: 'bladbunke', x: 140, y: 238, skala: 1.1 }],
      figurer: [PJ(140, 206, 'rolig', 0.55), UF(300, 186, 'glad', 0.7)] }
  };

  return {
    id: '2026-11-pjuske-1', type: 'maaned', udgives: '2026-11-06',
    serie: { id: '2026-11-pjuske', titel: 'Pjuskes efterårsliste' }, kapitel: 1, kapitler: 4,
    start: 'pj1Start', title: 'Den første frost', tag: 'November',
    blurb: 'Den første frost er kommet, og pindsvinet Pjuske skal snart sove hele vinteren. Kan I finde den blødeste seng i skoven?',
    scenes: scenes, magi: magi, mester: mester, billeder: billeder
  };
});
