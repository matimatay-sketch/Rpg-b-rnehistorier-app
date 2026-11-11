// Månedens historie, december 2026: Julestjernen. Historiefil: registrerer sig med LK.addStory og får kit-hjælperne som k.
// En månedshistorie står for sig selv. Den må læse vennerne fra sagaen, men sætter aldrig venne-flag.
LK.addStory(function (k) {
  var PATHS = [
    { id: 'bakke', label: 'Følg kælkesporet op ad bakken' },
    { id: 'soe', label: 'Gå ned til den frosne sø, hvor nogen synger' },
    { id: 'hule', label: 'Gå hen til Molls hule, hvor der lyser i vinduet' }
  ];
  // En stjernestump er en gylden gnist med sit eget navn.
  var STUMP = function (def, ph) { return { c: 'gyldne', def: def, col: '#F2C94C', ph: ph }; };

  var MESTER_TXT = {
    Mod: function (n) { return n + ' klatrer helt op i toppen af det sneklædte træ uden at kigge ned. Deroppe holder ' + n + ' hænderne op mod himlen, og sneen på grenene begynder at gløde som en stjerne.'; },
    List: function (n) { return n + ' binder lanternerne sammen med Nusses lange halstørklæde, så de danner en stor stjerne, og hejser den op i toppen med en snor.'; },
    Venlighed: function (n) { return n + ' lægger en vante om træets stamme og hvisker: &laquo;Du må gerne lyse, selvom stjernen er væk.&raquo; Træet bliver så glad, at det lyser fra roden og helt op.'; },
    Fantasi: function (n) { return n + ' samler en håndfuld snefnug og puster på dem. De bliver til en stjerne af lysende sne, der svæver op og sætter sig i toppen.'; },
    Humor: function (n) { return n + ' laver en så sjov julenisse-dans, at hele skoven griner. Latteren ryster sneen af grenene, og under sneen sidder alle lanternerne og lyser.'; },
    Nysgerrighed: function (n) { return n + ' kigger op i træets top og opdager en lille hule mellem grenene. Derinde ligger en gammel julestjerne, som ingen har set i hundrede år.'; }
  };

  // Venner fra sagaen, der kommer til julestjernen. Historiens egne linjer i stedet for k.friendLines(), som er skrevet
  // til sagaen: Nusse er med hele vejen her og nævnes derfor ikke, og Moll og Tut kan allerede have været mødt i dag.
  function venneLinjer() {
    var f = k.state.flags, o = [];
    if (f.mollLoefte) o.push('Moll kommer med en stak julekort under armen. &laquo;I lovede mig en historie engang,&raquo; siger hun. &laquo;Den her er god nok.&raquo;');
    if (f.tutVen) o.push('Tut kommer glidende på sine skøjter hen over sneen og stopper lige foran jer. &laquo;Se! Nu kan jeg bremse!&raquo;');
    if (f.vindVen) o.push('Vinden puster så blidt, at sneen hvirvler rundt om træet som glitter.');
    if (f.maaneVen) o.push('Månen kigger ned mellem skyerne og lægger sølvlys over hele den hvide skov.');
    return o;
  }

  var scenes = {
    snStart: {
      title: 'Den første sne',
      text: function () {
        var t = ['Der er kommet sne i Lanterneskoven. Store, bløde fnug daler ned, og alle træerne har fået hvide huer på. Uffe sidder på jeres vindueskarm og har pustet sig helt op, så han ligner en lille, rund pude.',
          'Så banker det på ruden. Udenfor står nissen Nusse med en tom kælk og en hue fuld af sne. &laquo;Hjælp!&raquo; siger han. &laquo;I aften er det juleaften i skoven, og julestjernen til Lanternetræet er gået i stykker!&raquo;'];
        if (k.state.flags.nusseVen) t.push('Så får Nusse øje på jer, og hele hans ansigt lyser op. &laquo;Det er jer! I hjalp mig i tornekrattet. Så ved jeg, at det nok skal gå.&raquo;');
        return t;
      },
      ask: 'Hvad er det bedste ved, at der kommer sne?',
      choices: [{ label: 'Tag huer og vanter på, og gå med Nusse', to: 'snHub' }, { label: 'Spørg Nusse, hvad der skete', to: 'snHvad' }]
    },
    snHvad: {
      title: 'Hat-sju!',
      text: ['Nusse kigger lidt skævt på Uffe. &laquo;Jeg kørte stjernen hen til træet på min kælk. Så nøs Uffe. Meget højt.&raquo;',
        '&laquo;HAT-SJU!&raquo; siger Uffe, bare for at vise, hvordan det lød. &laquo;Undskyld. Det var sneen, der kildede mig i næbbet.&raquo; Nusse hoppede af forskrækkelse, kælken susede ned ad bakken, og stjernen sprang i fire gyldne stumper, der fløj ud i sneen.',
        'Uffe plukker en lille fjer af sin vinge. &laquo;Tag den med. Den giver held. Brug den, når I slår med terningen.&raquo;'],
      gainFeather: true,
      ask: 'Er I nogensinde kommet til at lave noget i stykker ved et uheld? Hvad gjorde I så?',
      choices: [{ label: 'Det var et uheld, Uffe. Afsted!', to: 'snHub' }]
    },
    snHub: {
      title: 'Spor i sneen',
      text: function () {
        var g = k.state.gnists, v = k.state.visited.length;
        if (v === 0) return ['Sneen knirker under jeres støvler. Nusse trækker sin tomme kælk, og Uffe flyver foran. Overalt i den hvide skov er der spor, der går hver sin vej.',
          '&laquo;Hvis vi finder bare to stumper, kan stjernen lyse,&raquo; siger Nusse. &laquo;Og finder vi alle fire, bliver den helt hel.&raquo;'];
        var a = 'I går videre gennem sneen. Uffe ryster fnug af vingerne, og Nusse puster varm luft i sine vanter.';
        var b = g === 0 ? '&laquo;Vi har ingen stumper endnu,&raquo; siger Nusse. &laquo;Skal vi prøve et spor til, eller gå til Lanternetræet og se, hvad vi kan gøre?&raquo;'
          : g === 1 ? '&laquo;Én stump!&raquo; siger Nusse og kigger på den. &laquo;Stjernen skal bruge to for at lyse. Men I bestemmer.&raquo;'
          : '&laquo;Nu har vi nok til, at stjernen kan lyse,&raquo; siger Nusse. &laquo;Men jo flere stumper, jo stærkere lys. I bestemmer.&raquo;';
        var left = PATHS.filter(function (p) { return k.state.visited.indexOf(p.id) < 0; }).length + (k.state.visited.indexOf('spor') < 0 ? 1 : 0);
        return [a, b + (left === 0 ? ' Der er ikke flere spor at følge.' : '')];
      },
      ask: 'Hvilket spor ville I selv følge, og hvorfor?',
      dyn: function () {
        var c = PATHS.filter(function (p) { return k.state.visited.indexOf(p.id) < 0; }).map(function (p) { return { label: p.label, to: 'sn' + p.id.charAt(0).toUpperCase() + p.id.slice(1) }; });
        if (k.state.visited.indexOf('spor') < 0) c.push({ label: 'Følg de små, fnisende fodspor', to: 'snSpor', lock: function () { return k.lockTxt('Nysgerrighed', 2); } });
        if (k.state.visited.length > 0) c.push({ label: 'Gå til Lanternetræet nu', to: 'snTrae' });
        return c;
      }
    },
    snBakke: {
      title: 'Kælkebakken', path: 'bakke',
      text: ['Kælkesporet fører op ad den store bakke. Helt oppe på toppen stikker noget gyldent op af sneen og blinker til jer. Det er en stjernestump!',
        'Men bakken er glat som en rutsjebane, og hver gang I tager et skridt op, glider I et halvt skridt ned igen.'],
      ask: 'Hvordan kommer man op ad noget, der er glat og svært?',
      choices: [
        { label: 'Kravl op på alle fire som en isbjørn', roll: { stat: 'Mod', target: 6, win: 'snBakkeOk', lose: 'snBakkeFejl' } },
        { label: 'Træd trin i sneen, så I får en trappe', roll: { stat: 'List', target: 6, win: 'snBakkeOk', lose: 'snBakkeFejl' } },
        { label: 'Gå op baglæns og vralt som en pingvin', roll: { stat: 'Humor', target: 6, win: 'snBakkeOk', lose: 'snBakkeFejl' } }
      ]
    },
    snBakkeOk: {
      title: 'Bakkestumpen', gain: true, gnist: STUMP('Bakkestumpen', 'Glimmer'),
      text: ['Skridt for skridt kommer I helt op på toppen. Stjernestumpen hopper op i jeres vante og er varm som en kop kakao.',
        '&laquo;Hu-hu! Den første!&raquo; råber Uffe. Og så kører I alle sammen ned igen på Nusses kælk. Det går stærkt, og I griner hele vejen.'],
      ask: 'Hvad er det sjoveste, I har prøvet i sneen?',
      next: 'snHub'
    },
    snBakkeFejl: {
      title: 'Bums i sneen', flag: 'sneIStoevlerne',
      text: ['Halvvejs oppe glider I og rutsjer hele vejen ned igen på numsen. BUMS! I lander i en stor snebunke, så kun jeres støvler stikker op.',
        'Stumpen triller ned ad den anden side af bakken og forsvinder i en snedrive. &laquo;Der er flere stumper,&raquo; siger Nusse og hiver jer op ved vanterne. &laquo;Og det så altså meget sjovt ud.&raquo;'],
      ask: 'Er det i orden at falde, når man prøver noget svært? Hvad gør man så?',
      next: 'snHub'
    },
    snSoe: {
      title: 'Den frosne sø', path: 'soe',
      text: function () {
        var t = ['Månesøen er frosset til, og på isen kører tudsen Tut på skøjter. Rundt og rundt og rundt. På toppen af hans hat sidder en stjernestump og lyser.',
          '&laquo;Hjææælp!&raquo; synger Tut, mens han suser forbi. &laquo;Jeg har lært at skøjte, men jeg har glemt at lære at stoppe!&raquo;'];
        if (k.state.flags.tutVen) t.push('Næste gang Tut kommer forbi, vinker han. &laquo;Hej, mine venner! Godt at se jer! Og farvel igen!&raquo;');
        return t;
      },
      ask: 'Hvordan kan man hjælpe en, der ikke kan stoppe, uden selv at gå ud på isen?',
      choices: [
        { label: 'Råb roligt til Tut, hvordan han kan bremse', roll: { stat: 'Venlighed', target: 6, win: 'snSoeOk', lose: 'snSoeFejl' } },
        { label: 'Byg en blød snevold ved bredden, som Tut kan glide ind i', roll: { stat: 'List', target: 6, win: 'snSoeOk', lose: 'snSoeFejl' } },
        { label: 'Syng en langsom vals, så Tut skøjter langsommere og langsommere', roll: { stat: 'Fantasi', target: 6, win: 'snSoeOk', lose: 'snSoeFejl' } }
      ]
    },
    snSoeOk: {
      title: 'Isstumpen', gain: true, gnist: STUMP('Isstumpen', 'Funkel'),
      text: ['Tut kører langsommere og langsommere, og til sidst glider han blødt ind i sneen ved bredden. PUF! Han sidder helt stille med et stort smil.',
        '&laquo;Tak!&raquo; siger Tut og rækker jer stumpen fra sin hat. &laquo;Den landede på mig, da den fløj forbi. Jeg troede, det var en julepynt.&raquo;'],
      ask: 'Hvem har lært jer noget, som I ikke kunne før?',
      next: 'snHub'
    },
    snSoeFejl: {
      title: 'Rundt og rundt',
      text: ['Tut kører endnu hurtigere. Rundt og rundt, til han bliver helt svimmel og glider ind i sivene på den anden side af søen. Han sidder blødt og godt, og han griner.',
        'Men stjernestumpen flyver af hans hat og forsvinder et sted i sneen. &laquo;Undskyld!&raquo; råber Tut. &laquo;Næste gang lærer jeg at stoppe først!&raquo;'],
      ask: 'Hvad lærer man først, når man skal prøve noget nyt?',
      next: 'snHub'
    },
    snHule: {
      title: 'Molls julekort', path: 'hule',
      text: ['Inde i sin hule sidder muldvarpen Moll og skriver julekort til hele skoven. Hun har ingen lampe. I stedet lyser en stjernestump på bordet ved siden af hende.',
        '&laquo;Den faldt lige ned gennem mit tag,&raquo; siger Moll og skubber brillerne op. &laquo;I må gerne få den. Men først en julegåde: Jeg falder fra himlen, men jeg slår mig aldrig. Jeg er hvid og kold, og jeg forsvinder, hvis du holder mig i hånden. Hvad er jeg?&raquo;'],
      ask: 'Tænk sammen, før I svarer. Hvad har I set falde ned i dag?',
      choices: [
        { label: 'Et snefnug', to: 'snHuleOk', key: 'snefnug' },
        { label: 'En isbjørn', to: 'snHule', key: 'isbjoern', wrong: 'Moll klukker: &laquo;Isbjørne falder heldigvis ikke ned fra himlen!&raquo;' },
        { label: 'En hvid sok', to: 'snHule', key: 'sok', wrong: 'Moll fniser: &laquo;Sokker forsvinder kun i vaskemaskinen. Prøv igen!&raquo;' },
        { label: 'Kig ud ad Molls lille vindue og se, hvad der sker derude', key: 'kig', roll: { stat: 'Nysgerrighed', target: 6, win: 'snHuleKig', lose: 'snHuleHint' } }
      ]
    },
    snHuleKig: {
      title: 'Hulestumpen', gain: true, gnist: STUMP('Hulestumpen', 'Glitter'),
      text: ['I kigger ud ad Molls lille vindue. Derude daler fnug efter fnug. Et af dem lander på jeres finger og bliver til en lille vanddråbe. &laquo;Det er et snefnug!&raquo; siger I.',
        'Moll klapper i sine små hænder og giver jer stjernestumpen. &laquo;I kiggede efter i stedet for at gætte. Det kan jeg godt lide.&raquo;'],
      ask: 'Hvad så I derude, som I ikke havde lagt mærke til før?',
      next: 'snHub'
    },
    snHuleHint: {
      title: 'Et lille hint',
      text: ['Vinduet er helt dugget til, og I kan ikke se noget. Moll smiler. &laquo;Jeg giver jer et hint: Der faldt tusindvis af mig ned på jeres huer på vejen herhen.&raquo;'],
      ask: 'Hvad lå der på jeres huer, da I kom ind?',
      next: 'snHule'
    },
    snHuleOk: {
      title: 'Hulestumpen', gain: true, gnist: STUMP('Hulestumpen', 'Glitter'),
      text: ['&laquo;Et snefnug! Selvfølgelig!&raquo; Moll klapper i sine små hænder og giver jer stjernestumpen.',
        '&laquo;Så skal jeg bare finde en anden lampe,&raquo; siger hun og tænder et lille stearinlys. &laquo;Kom forbi i aften. Jeg har skrevet et julekort til jer.&raquo;'],
      ask: 'Hvem ville I sende et julekort til, og hvad skulle der stå?',
      next: 'snHub'
    },
    snSpor: {
      title: 'Snemanden', path: 'spor',
      text: ['De små fodspor fører hen til en lysning. Der står to ræveunger og fniser ved siden af en stor, flot snemand. Han har pindearme, hat og halstørklæde.',
        'Og hans næse lyser. Det er en stjernestump! &laquo;Er han ikke fin?&raquo; siger ræveungerne stolt. &laquo;Det er verdens bedste næse.&raquo;'],
      ask: 'Hvordan kan man bede om noget tilbage, uden at nogen bliver kede af det?',
      choices: [
        { label: 'Find på en ny næse af en grankogle', roll: { stat: 'Fantasi', target: 6, win: 'snSporOk', lose: 'snSporFejl' } },
        { label: 'Fortæl ræveungerne om julestjernen og spørg pænt', roll: { stat: 'Venlighed', target: 6, win: 'snSporOk', lose: 'snSporFejl' } },
        { label: 'Hold en sjov opvisning med alle slags næser', roll: { stat: 'Humor', target: 6, win: 'snSporOk', lose: 'snSporFejl' } }
      ]
    },
    snSporOk: {
      title: 'Næsestumpen', gain: true, gnist: STUMP('Næsestumpen', 'Snude'),
      text: ['Snemanden får en ny næse af en grankogle. Ræveungerne kigger på ham med hovedet på skrå, og så griner de højt. &laquo;Nu ligner han vores morfar!&raquo;',
        'De giver jer stjernestumpen. &laquo;Kommer I tilbage og ser vores snemand i aften?&raquo; spørger de. Det lover I.'],
      ask: 'Hvordan føles det at give noget væk, som man selv synes er fint?',
      next: 'snHub'
    },
    snSporFejl: {
      title: 'En lysende næse',
      text: ['Ræveungerne kigger på snemanden og så på hinanden. &laquo;Men så har han jo ingen næse,&raquo; siger den mindste stille.',
        'I bliver enige om, at snemanden må beholde sin stjernenæse i aften. Han lyser over lysningen som en lille lygte, så ingen farer vild i sneen. Ræveungerne krammer jer, og den mindste giver jer en grankogle som tak.'],
      ask: 'Var det rigtigt at lade ræveungerne beholde næsen? Hvorfor tror I det?',
      next: 'snHub'
    },
    snTrae: {
      title: 'Lanternetræet i sne',
      text: function () {
        var g = k.state.gnists;
        var a = 'Midt i skoven står Lanternetræet med sne på alle grenene. Skovens dyr er kommet for at fejre jul, og alle kigger op mod toppen. Der er tomt, hvor julestjernen skulle sidde.';
        var b = g >= 4 ? '&laquo;' + k.joinNames(k.gnistNames()) + '!&raquo; råber Nusse. &laquo;Så er stjernen helt hel igen!&raquo;'
          : g >= 2 ? '&laquo;' + k.joinNames(k.gnistNames()) + '! Det er lige nok til, at den kan lyse!&raquo; siger Nusse.'
          : g === 1 ? '&laquo;' + k.joinNames(k.gnistNames()) + ' er en god begyndelse,&raquo; siger Nusse. &laquo;Måske kan vi klare resten sammen.&raquo;'
          : '&laquo;Vi fandt ingen stumper,&raquo; siger Nusse og kigger ned i sneen. Uffe lægger en vinge om ham. &laquo;Men vi fandt hinanden. Lad os bede skovens venner om hjælp.&raquo;';
        var t = [a, b];
        if (k.state.flags.sneIStoevlerne) t.push('Der er stadig sne i jeres støvler fra bakken. Det knaser, hver gang I tripper, og Uffe fniser.');
        return t;
      },
      ask: 'Hvad tror I virker bedst: stumperne, vennerne eller en julesang?',
      dyn: function () {
        var c = [];
        if (k.state.gnists > 0) c.push({ label: 'Sæt stjernestumperne sammen i toppen af træet', to: 'snEndStjerne' });
        c.push({ label: 'Råb på skovens venner', to: 'snEndVenner' });
        c.push({ label: 'Syng en julesang for træet', to: 'snEndSang', lock: function () { return k.partyStat('Fantasi') >= 3 || k.partyStat('Humor') >= 3 ? null : 'Kræver Fantasi 3 eller Humor 3'; } });
        return c;
      }
    },
    snEndStjerne: {
      title: 'Julestjernen lyser', end: true, all: true,
      text: function () {
        var g = k.state.gnists, navne = k.joinNames(k.gnistNames());
        var t;
        if (g >= 4) t = ['Uffe flyver ' + navne + ' op i toppen af træet. Stumperne klikker sammen med et lille &laquo;pling&raquo;, og julestjernen er hel igen. Den lyser så stærkt, at sneen på alle grenene glitrer som guld.',
          'Lanterne efter lanterne tænder, og skovens dyr råber hurra. Nusse kigger op med tårer af glæde i øjnene. &laquo;Den har aldrig lyst så flot før.&raquo;'];
        else if (g >= 2) t = ['Uffe flyver ' + navne + ' op i toppen af træet. Stumperne klikker sammen, og julestjernen begynder at lyse. Der mangler en takke eller to, men lyset er varmt og gyldent.',
          'Lanterne efter lanterne tænder ned gennem træet. &laquo;Den er ikke helt hel,&raquo; siger Nusse, &laquo;men den er den fineste stjerne, jeg kender.&raquo;'];
        else t = ['Uffe flyver ' + navne + ' op i toppen af træet. Det er kun en lille stump, men den lyser, så godt den kan, og så tænder én lanterne, og så en til.',
          'Til sidst lyser hele Lanternetræet blødt i sneen. &laquo;En lille stjerne er også en stjerne,&raquo; siger Nusse og smiler.'];
        t.push('&laquo;Hu-hu! Glædelig jul!&raquo; siger Uffe. Og så nyser han. Men denne gang holder alle godt fast i stjernen.');
        return t;
      },
      ask: 'Hvad var det bedste valg, I tog i dag?'
    },
    snEndVenner: {
      title: 'En stjerne af venner', end: true, all: true,
      text: function () {
        var fl = venneLinjer();
        var a = 'I råber ud i den hvide skov: &laquo;Glædelig jul! Vil nogen hjælpe os med stjernen?&raquo; Først er alt stille. Så knaser det i sneen.';
        var slut = 'Alle dyrene har en lille lanterne med. De klatrer op i træet og hænger dem i toppen, så de danner en stor, lysende stjerne. &laquo;Det er den første julestjerne, der er lavet af venner,&raquo; hvisker Nusse.';
        if (!fl.length) return [a + ' Ræve, mus, pindsvin og to fnisende ræveunger kommer frem mellem træerne.', slut];
        return [a, fl.join(' '), 'Ræve, mus og pindsvin kommer også. ' + slut];
      },
      ask: function () { return venneLinjer().length ? 'Hvem var I gladest for at se i aften?' : 'Hvornår har I sidst fået hjælp af en ven? Hvordan føltes det?'; }
    },
    snEndSang: {
      title: 'Julesangen', end: true, all: true,
      text: function () {
        var t = ['I stiller jer ved foden af Lanternetræet og begynder at synge en julesang. Først stille, så højere. Nusse synger med, og Uffe hu-huer i takt.'];
        if (k.state.gnists > 0) t.push(k.joinNames(k.gnistNames()) + ' svæver op i toppen og danser med.');
        t.push('Snefnuggene begynder at gløde, mens de daler ned, og de lægger sig i toppen af træet som en stjerne af lysende sne. Hele skoven synger med til sidste vers.');
        return t;
      },
      ask: 'Hvilken julesang ville I synge for træet?'
    },
    snEndMester: {
      title: 'Mesterens stjerne', end: true, all: true,
      text: function () {
        var m = k.state.mester || { name: 'Jeres helt', stat: 'Mod' };
        var how = MESTER_TXT[m.stat] || MESTER_TXT.Mod;
        return [how(k.esc(m.name)), 'Lanterne efter lanterne tænder, og Lanternetræet skinner over hele den hvide skov. Nusse giver jer et stort kram. &laquo;Det er den bedste jul, Lanterneskoven har haft,&raquo; siger han.'];
      },
      ask: 'Hvad er I blevet rigtig gode til? Hvordan lærte I det?'
    }
  };

  var magi = {
    snBakke: {
      gnist: { l: 'Skab en gnist, der smelter små trin i sneen', to: 'snBakkeOk' },
      dyr: { l: 'Spørg en hare, om den vil hente stumpen', to: 'snBakkeOk' },
      syn: { l: 'Se den skjulte sti, hvor sneen ikke er glat', to: 'snBakkeOk' },
      latter: { l: 'Strø latterstøv, så bakken griner og bliver flad af grin', to: 'snBakkeOk' }
    },
    snSoe: {
      gnist: { l: 'Skab en gnist, der viser Tut, hvor han skal bremse', to: 'snSoeOk' },
      dyr: { l: 'Bed en flok ænder om at vralte ud og fange Tut', to: 'snSoeOk' },
      syn: { l: 'Se, hvor isen er ru, så Tut kan stoppe der', to: 'snSoeOk' },
      latter: { l: 'Strø latterstøv, så Tut griner og sætter sig ned', to: 'snSoeOk' }
    },
    snHule: {
      gnist: { l: 'Skab en gnist, der tegner et snefnug i luften', to: 'snHuleKig' },
      dyr: { l: 'Spørg Molls edderkop, hvad den så falde ned i dag', to: 'snHuleKig' },
      syn: { l: 'Se svaret, der gemmer sig i Molls julekort', to: 'snHuleKig' },
      latter: { l: 'Strø latterstøv, så Moll kommer til at grine svaret ud', to: 'snHuleOk' }
    },
    snSpor: {
      gnist: { l: 'Skab en gnist, så snemanden får en ny lysende næse', to: 'snSporOk' },
      dyr: { l: 'Spørg ræveungerne, hvad de allerhelst vil have', to: 'snSporOk' },
      syn: { l: 'Se en perfekt grankogle, der ligger skjult i sneen', to: 'snSporOk' },
      latter: { l: 'Strø latterstøv, så alle griner og bytter næser', to: 'snSporOk' }
    },
    snHub: {
      syn: { l: 'Se de små fodspor, der fniser i sneen', to: 'snSpor', show: function () { return k.state.visited.indexOf('spor') < 0 && !!k.lockTxt('Nysgerrighed', 2); } }
    },
    snTrae: {
      gnist: { l: 'Lav en ekstra stjernestump til træet', to: 'snTrae', eff: function (h) { k.state.gnists++; k.state.gnistList.push({ key: 'magi_' + h.id + '_' + k.state.gnists, c: 'magiske', def: k.gen(h.name) + ' stump', col: '#F2C94C', ph: 'Stjerne', name: '' }); } },
      dyr: { l: 'Bed skovens dyr om at hjælpe', to: 'snEndVenner' },
      latter: { l: 'Strø latterstøv, så hele skoven synger', to: 'snEndSang' }
    }
  };

  /* Mester-valg: når en helt har 5 i et træk, åbner der sig et ekstra valg i scenen (uden terning). */
  var mester = {
    snBakke: [
      { stat: 'Mod', l: 'Løb lige op ad den glatte bakke', to: 'snBakkeOk', n: function (n) { return n + ' tager tilløb og løber lige op ad bakken uden at glide en eneste gang.'; } },
      { stat: 'List', l: 'Lav en snor af halstørklæder og træk alle op', to: 'snBakkeOk', n: function (n) { return n + ' binder alle halstørklæderne sammen til en lang snor og trækker de andre op, én efter én.'; } }
    ],
    snSoe: [
      { stat: 'Venlighed', l: 'Tal så roligt til Tut, at han selv finder ud af at stoppe', to: 'snSoeOk', n: function (n) { return n + ' taler så roligt til Tut, at han holder op med at være forskrækket og selv finder ud af at bremse.'; } },
      { stat: 'Fantasi', l: 'Forestil jer, at isen er et dansegulv, og led Tut i en dans', to: 'snSoeOk', n: function (n) { return n + ' råber trinene til en dans, og Tut danser sig langsomt og blødt hen til bredden.'; } }
    ],
    snHule: [
      { stat: 'Nysgerrighed', l: 'Kig på Molls julekort, og find svaret med det samme', to: 'snHuleKig', n: function (n) { return n + ' kigger på Molls julekort. Der er tegnet snefnug på dem alle sammen. Så er svaret let.'; } }
    ],
    snSpor: [
      { stat: 'Humor', l: 'Giv snemanden et helt nyt ansigt, der får alle til at grine', to: 'snSporOk', n: function (n) { return n + ' giver snemanden skæve øjenbryn af pinde og en grankoglenæse. Ræveungerne griner, så de triller rundt i sneen.'; } },
      { stat: 'Venlighed', l: 'Byg en lille snekone sammen med ræveungerne', to: 'snSporOk', n: function (n) { return n + ' bygger en lille snekone sammen med ræveungerne, så snemanden ikke står alene. Så giver de gerne stumpen.'; } }
    ],
    snTrae: []
  };
  k.stats.forEach(function (t) {
    mester.snTrae.push({ stat: t[0], l: 'Brug mester-trækket ' + t[0] + ' til at give træet en stjerne', to: 'snEndMester', eff: function (h, stat) { k.state.mester = { name: h.name, stat: stat }; } });
  });

  /* Billeder til scenerne, tegnet med delene i art/dele.js (LK.art.scene). Koordinater i en ramme på 400 x 250. */
  var SNE = { navn: 'snefald', x: 200, y: 125 };
  var driver = function (a, b) { return [{ navn: 'snedrive', x: a, y: 238 }, { navn: 'snedrive', x: b, y: 242, skala: 1.2 }]; };
  var billeder = {
    snStart: { sted: 'vindue', himmel: 'nat', alt: 'Uffe sidder på vindueskarmen, og udenfor i sneen står Nusse med en tom kælk.',
      ting: [{ navn: 'snefald', x: 200, y: 100, skala: 0.65 }],
      figurer: [{ navn: 'uffe', x: 145, y: 141, skala: 0.9, humoer: 'overrasket' }, { navn: 'nusse', x: 270, y: 142, skala: 0.5, humoer: 'bekymret' }] },
    snHvad: { sted: 'vindue', himmel: 'nat', alt: 'Uffe ser lidt flov ud, mens Nusse fortæller om nyset, der fik kælken til at suse af sted.',
      ting: [{ navn: 'snefald', x: 200, y: 100, skala: 0.65 }],
      figurer: [{ navn: 'uffe', x: 145, y: 141, skala: 0.9, humoer: 'bekymret' }, { navn: 'nusse', x: 270, y: 142, skala: 0.5, humoer: 'rolig' }] },
    snHub: { sted: 'skovsti', himmel: 'nat', alt: 'Uffe og Nusse står i den hvide skov, hvor sporene går hver sin vej.',
      ting: driver(70, 330).concat([SNE]),
      figurer: [{ navn: 'uffe', x: 140, y: 170, skala: 0.8, humoer: 'glad' }, { navn: 'nusse', x: 255, y: 188, skala: 0.85, humoer: 'glad' }] },
    snBakke: { sted: 'bjerg', himmel: 'nat', alt: 'Helt oppe på den glatte bakke blinker en gylden stjernestump i sneen.',
      ting: [{ navn: 'snedrive', x: 80, y: 236 }, { navn: 'snedrive', x: 330, y: 240 }, { navn: 'gnist', x: 262, y: 100, taendt: true }, SNE],
      figurer: [{ navn: 'nusse', x: 100, y: 196, skala: 0.75, humoer: 'bekymret' }, { navn: 'uffe', x: 300, y: 186, skala: 0.7, humoer: 'overrasket' }] },
    snBakkeOk: { sted: 'bjerg', himmel: 'skumring', alt: 'Stjernestumpen lyser, og Uffe jubler på toppen af bakken.',
      ting: [{ navn: 'snedrive', x: 80, y: 236 }, { navn: 'snedrive', x: 330, y: 240 }, { navn: 'gnist', x: 200, y: 120, skala: 1.4, taendt: true }, SNE],
      figurer: [{ navn: 'nusse', x: 100, y: 196, skala: 0.75, humoer: 'glad' }, { navn: 'uffe', x: 300, y: 186, skala: 0.7, humoer: 'glad' }] },
    snBakkeFejl: { sted: 'bjerg', himmel: 'nat', alt: 'Bums! Alle er rutsjet ned i en stor snebunke, og Nusse griner.',
      ting: [{ navn: 'snedrive', x: 200, y: 242, skala: 1.6 }, { navn: 'snedrive', x: 340, y: 240 }, SNE],
      figurer: [{ navn: 'nusse', x: 110, y: 196, skala: 0.75, humoer: 'glad' }, { navn: 'uffe', x: 300, y: 186, skala: 0.7, humoer: 'overrasket' }] },
    snSoe: { sted: 'maanesoe', himmel: 'nat', alt: 'Tut suser rundt på den frosne sø med en stjernestump på hatten.',
      ting: [{ navn: 'snedrive', x: 60, y: 244 }, { navn: 'snedrive', x: 345, y: 246 }, { navn: 'gnist', x: 213, y: 120, skala: 0.7, taendt: true }, SNE],
      figurer: [{ navn: 'tut', x: 200, y: 170, skala: 0.8, humoer: 'overrasket' }] },
    snSoeOk: { sted: 'maanesoe', himmel: 'skumring', alt: 'Tut sidder glad i sneen ved bredden og rækker stjernestumpen frem.',
      ting: [{ navn: 'snedrive', x: 140, y: 246, skala: 1.4 }, { navn: 'snedrive', x: 345, y: 246 }, { navn: 'gnist', x: 240, y: 170, taendt: true }, SNE],
      figurer: [{ navn: 'tut', x: 150, y: 196, skala: 0.8, humoer: 'glad' }, { navn: 'uffe', x: 320, y: 196, skala: 0.65, humoer: 'glad' }] },
    snSoeFejl: { sted: 'maanesoe', himmel: 'nat', alt: 'Tut er svimmel og sidder i sivene, mens stjernestumpen flyver væk.',
      ting: [{ navn: 'snedrive', x: 60, y: 244 }, { navn: 'gnist', x: 330, y: 90, skala: 0.6, taendt: true }, SNE],
      figurer: [{ navn: 'tut', x: 200, y: 196, skala: 0.8, humoer: 'rolig' }, { navn: 'uffe', x: 95, y: 196, skala: 0.65, humoer: 'overrasket' }] },
    snHule: { sted: 'hule', himmel: 'nat', alt: 'Moll sidder foran sin hule med julekort, og en stjernestump lyser ved siden af hende.',
      ting: [{ navn: 'snedrive', x: 75, y: 244 }, { navn: 'brev', x: 290, y: 232 }, { navn: 'brev', x: 325, y: 238 }, { navn: 'gnist', x: 255, y: 200, skala: 0.8, taendt: true }],
      figurer: [{ navn: 'moll', x: 200, y: 192, humoer: 'glad' }] },
    snHuleKig: { sted: 'hule', himmel: 'skumring', alt: 'Snefnuggene daler, og Moll rækker jer stjernestumpen.',
      ting: [{ navn: 'snedrive', x: 75, y: 244 }, { navn: 'brev', x: 325, y: 238 }, { navn: 'gnist', x: 250, y: 160, taendt: true }, SNE],
      figurer: [{ navn: 'moll', x: 200, y: 192, humoer: 'glad' }] },
    snHuleHint: { sted: 'hule', himmel: 'nat', alt: 'Moll smiler og giver et hint, mens Uffe tænker så det knager.',
      ting: [{ navn: 'snedrive', x: 75, y: 244 }, { navn: 'brev', x: 290, y: 232 }, { navn: 'gnist', x: 255, y: 200, skala: 0.8, taendt: true }],
      figurer: [{ navn: 'moll', x: 200, y: 192, humoer: 'rolig' }, { navn: 'uffe', x: 330, y: 186, skala: 0.65, humoer: 'bekymret' }] },
    snHuleOk: { sted: 'hule', himmel: 'aften', alt: 'Moll klapper glad og giver jer stjernestumpen.',
      ting: [{ navn: 'snedrive', x: 75, y: 244 }, { navn: 'brev', x: 325, y: 238, taendt: true }, { navn: 'gnist', x: 250, y: 160, taendt: true }],
      figurer: [{ navn: 'moll', x: 200, y: 192, humoer: 'glad' }] },
    snSpor: { sted: 'lysning', himmel: 'nat', alt: 'To ræveunger står stolt ved en snemand, hvis næse er en lysende stjernestump.',
      ting: driver(60, 340).concat([SNE]),
      figurer: [{ navn: 'snemand', x: 200, y: 168, skala: 1.1, naese: 'stjerne' }, { navn: 'raev', x: 95, y: 190, skala: 0.7 }, { navn: 'raev', x: 305, y: 194, skala: 0.6, humoer: 'overrasket' }] },
    snSporOk: { sted: 'lysning', himmel: 'skumring', alt: 'Snemanden har fået en grankoglenæse, og ræveungerne griner.',
      ting: driver(60, 340).concat([{ navn: 'gnist', x: 290, y: 110, taendt: true }, SNE]),
      figurer: [{ navn: 'snemand', x: 200, y: 168, skala: 1.1, naese: 'kogle', humoer: 'glad' }, { navn: 'raev', x: 95, y: 190, skala: 0.7, humoer: 'glad' }, { navn: 'raev', x: 305, y: 194, skala: 0.6, humoer: 'glad' }] },
    snSporFejl: { sted: 'lysning', himmel: 'nat', alt: 'Snemanden beholder sin stjernenæse og lyser over lysningen som en lille lygte.',
      ting: driver(60, 340).concat([SNE]),
      figurer: [{ navn: 'snemand', x: 200, y: 168, skala: 1.1, naese: 'stjerne', humoer: 'rolig' }, { navn: 'raev', x: 95, y: 190, skala: 0.7, humoer: 'rolig' }, { navn: 'raev', x: 305, y: 194, skala: 0.6, humoer: 'glad' }] },
    snTrae: { sted: 'slukkettrae', himmel: 'nat', alt: 'Lanternetræet står med sne på grenene, og toppen er tom.',
      ting: driver(80, 320).concat([SNE]),
      figurer: [{ navn: 'nusse', x: 100, y: 190, skala: 0.8, humoer: 'bekymret' }, { navn: 'uffe', x: 300, y: 184, skala: 0.7, humoer: 'rolig' }] },
    snEndStjerne: { sted: 'lanternetrae', himmel: 'nat', alt: 'Julestjernen lyser i toppen af Lanternetræet, og Nusse og Uffe jubler i sneen.',
      ting: driver(80, 320).concat([{ navn: 'stjerne', x: 200, y: 30, skala: 0.9, taendt: true }, SNE]),
      figurer: [{ navn: 'nusse', x: 100, y: 190, skala: 0.8, humoer: 'glad' }, { navn: 'uffe', x: 300, y: 184, skala: 0.7, humoer: 'glad' }] },
    snEndVenner: { sted: 'lanternetrae', himmel: 'nat', alt: 'Skovens dyr har hængt lanterner i toppen, så de danner en stor, lysende stjerne.',
      ting: driver(80, 320).concat([{ navn: 'lanterne', x: 200, y: 36, taendt: true }, { navn: 'lanterne', x: 174, y: 54, skala: 0.8, taendt: true }, { navn: 'lanterne', x: 226, y: 54, skala: 0.8, taendt: true }, SNE]),
      figurer: [{ navn: 'raev', x: 60, y: 186, skala: 0.75 }, { navn: 'mus', x: 120, y: 200, skala: 0.65 }, { navn: 'pind', x: 285, y: 202, skala: 0.6 }, { navn: 'nusse', x: 345, y: 190, skala: 0.75, humoer: 'glad' }] },
    snEndSang: { sted: 'lanternetrae', himmel: 'nat', alt: 'Alle synger ved Lanternetræet, og snefnuggene lyser i toppen som en stjerne.',
      ting: driver(80, 320).concat([{ navn: 'stjerne', x: 200, y: 30, skala: 0.9, taendt: true }, SNE]),
      figurer: [{ navn: 'nusse', x: 100, y: 190, skala: 0.8, humoer: 'rolig' }, { navn: 'uffe', x: 300, y: 184, skala: 0.7, humoer: 'rolig' }] },
    snEndMester: { sted: 'lanternetrae', himmel: 'nat', alt: 'Lanternetræet skinner over den hvide skov med en stjerne i toppen.',
      ting: driver(80, 320).concat([{ navn: 'stjerne', x: 200, y: 30, skala: 0.9, taendt: true }, SNE]),
      figurer: [{ navn: 'nusse', x: 100, y: 190, skala: 0.8, humoer: 'glad' }, { navn: 'uffe', x: 300, y: 184, skala: 0.7, humoer: 'glad' }] }
  };

  return {
    id: '2026-12-julestjernen', type: 'maaned', udgives: '2026-12-01',
    start: 'snStart', title: 'Julestjernen', tag: 'December',
    blurb: 'Det sner i Lanterneskoven, og Nusses julestjerne er sprunget i stumper. Kan I finde dem, før det bliver aften?',
    scenes: scenes, magi: magi, mester: mester, billeder: billeder
  };
});
