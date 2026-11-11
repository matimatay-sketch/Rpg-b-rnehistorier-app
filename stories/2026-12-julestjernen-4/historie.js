// Månedens historier, december 2026: Julestjernen, kapitel 4 af 4: Stjernen på træet. Historiefil: registrerer sig med LK.addStory og får kit-hjælperne som k.
// Et kapitel står for sig selv. Det må læse vennerne fra sagaen, men sætter aldrig venne-flag.
// Det sidste stykke af julestjernen er blevet næse på ræveungernes snemand. I finder et nyt, fint ansigt til snemanden,
// så ræveungerne gerne bytter, og så kommer julestjernen op i toppen af Lanternetræet til skovens julefest.
// Pindsvinet Pjuske gik i hi i november (Pjuskes efterårsliste), så han sover hele kapitlet.
LK.addStory(function (k) {
  var PATHS = [
    { id: 'kogle', to: 'js4Kogle', label: 'Gå hen til granen, hvor egernet har sit forråd' },
    { id: 'pjuske', to: 'js4Pjuske', label: 'Gå stille hen til den store rod, hvor Pjuske sover' },
    { id: 'krage', to: 'js4Krage', label: 'Gå hen til kragen, der har gemt noget rødt' }
  ];
  // Det, I finder til snemandens nye ansigt, er en gnist med sit eget navn.
  var FUND = function (c, def, col, ph) { return { c: c, def: def, col: col, ph: ph }; };

  var MESTER_TXT = {
    Mod: function (n) { return n + ' træder frem foran hele skoven, selvom alle kigger, og løfter julestjernen højt op mod den mørke himmel. &laquo;Glædelig jul!&raquo; siger ' + n + ' med klar stemme. Uffe tager stjernen i næbbet og flyver den det sidste stykke op i toppen.'; },
    List: function (n) { return n + ' binder en lille løkke af Nusses lange halstørklæde om stjernen, så Uffe kan bære den sikkert i næbbet. Uffe flyver op, og stjernen sidder lige i toppen, ikke en millimeter skæv.'; },
    Venlighed: function (n) { return n + ' lægger en vante om træets stamme og hvisker: &laquo;Nu får du din stjerne igen.&raquo; Træet bliver så glad, at det lyser fra roden og helt op til stjernen.'; },
    Fantasi: function (n) { return n + ' samler en håndfuld snefnug og puster på dem. De bliver til en glitrende sky, der bærer stjernen op og lægger sig rundt om den som en lysende krans.'; },
    Humor: function (n) { return n + ' laver en så sjov julenisse-dans, at hele skoven griner. Latteren ryster sneen af grenene, og Uffe flyver stjernen op, mens alle stadig fniser.'; },
    Nysgerrighed: function (n) { return n + ' kigger op i træets top og opdager et lille hak mellem grenene, formet præcis som en stjerne. &laquo;Uffe, dér!&raquo; Uffe flyver op, og stjernen klikker på plads.'; }
  };

  // Venner fra sagaen, der kommer til julefesten. Historiens egne linjer i stedet for k.friendLines(), som er skrevet
  // til sagaen. Nusse er med hele vejen her og nævnes derfor ikke.
  function venneLinjer() {
    var f = k.state.flags, o = [];
    if (f.mollLoefte) o.push('Moll kommer med en stak julekort under armen. &laquo;I lovede mig en historie engang,&raquo; siger hun. &laquo;Den her er god nok.&raquo;');
    if (f.tutVen) o.push('Tut kommer glidende på sine skøjter hen over sneen og stopper lige foran jer. &laquo;Se! Nu kan jeg bremse!&raquo;');
    if (f.vindVen) o.push('Vinden puster så blidt, at sneen hvirvler rundt om træet som glitter.');
    if (f.maaneVen) o.push('Månen kigger ned mellem skyerne og lægger sølvlys over hele den hvide skov.');
    return o;
  }

  var scenes = {
    js4Start: {
      title: 'Julefest i aften',
      text: function () {
        var t = ['Det er jul i Lanterneskoven. Sneen ligger tyk og blød, og i aften holder hele skoven julefest ved Lanternetræet. Uffe sidder på vindueskarmen og er så spændt, at han ikke kan sidde stille.',
          'Så banker det på ruden. Det er Nusse med sin æske. &laquo;Tre stykker af julestjernen er fundet,&raquo; siger han. &laquo;Fra kælkebakken, fra Tuts hat og fra Molls hule. Men det sidste mangler. Og jeg ved, hvor det er!&raquo;'];
        if (k.state.flags.nusseVen) t.push('Nusse smiler stort. &laquo;Godt, at det er jer. Så ved jeg, at stjernen kommer op i aften.&raquo;');
        return t;
      },
      ask: 'Hvad glæder I jer mest til ved jul?',
      choices: [{ label: 'Tag huer og vanter på, og gå med Nusse', to: 'js4Hub' }, { label: 'Spørg Nusse, hvor det sidste stykke er', to: 'js4Hvad' }]
    },
    js4Hvad: {
      title: 'Den lysende næse',
      text: ['&laquo;I aftes gik jeg forbi lysningen,&raquo; fortæller Nusse. &laquo;Dér står ræveungernes snemand. Og hans næse lyser! Ræveungerne fandt stumpen i sneen og troede, det var verdens bedste næse.&raquo;',
        '&laquo;Vi kan ikke bare tage den,&raquo; siger Uffe. &laquo;Så bliver de kede af det.&raquo; Nusse nikker. &laquo;Vi må finde et nyt ansigt til snemanden, der er endnu finere.&raquo;',
        'Uffe plukker en lille fjer af sin vinge. &laquo;Tag den med. Den giver held. Brug den, når I slår med terningen.&raquo;'],
      gainFeather: true,
      ask: 'Hvordan kan man bede om noget tilbage, uden at nogen bliver kede af det?',
      choices: [{ label: 'Lad os finde det fineste ansigt!', to: 'js4Hub' }]
    },
    js4Hub: {
      title: 'Juledag i skoven',
      text: function () {
        var g = k.state.gnists, v = k.state.visited.length;
        if (v === 0) return ['Sneen knirker under jeres støvler. Nusse trækker sin kælk med æsken, og Uffe flyver foran. Overalt i skoven gør dyrene klar til festen i aften.',
          '&laquo;En snemand skal have en næse, to øjne og en mund,&raquo; siger Uffe. &laquo;Lad os se, hvad vi kan finde.&raquo;'];
        var a = 'I går videre gennem den hvide skov. Det begynder at blive aften, og de første lanterner tænder mellem træerne.';
        var b = g === 0 ? '&laquo;Vi har ikke fundet noget endnu,&raquo; siger Nusse. &laquo;Skal vi lede et sted til, eller gå til snemanden og tale med ræveungerne?&raquo;'
          : g === 1 ? '&laquo;Det er en god begyndelse,&raquo; siger Nusse. &laquo;Men et ansigt har mange dele. I bestemmer.&raquo;'
          : '&laquo;Det bliver et flot ansigt,&raquo; siger Nusse. &laquo;Men måske kan vi finde lidt mere. I bestemmer.&raquo;';
        var left = PATHS.filter(function (p) { return k.state.visited.indexOf(p.id) < 0; }).length + (k.state.visited.indexOf('lille') < 0 ? 1 : 0);
        return [a, b + (left === 0 ? ' Der er ikke flere steder at lede.' : '')];
      },
      ask: 'Hvordan skal snemandens nye ansigt se ud?',
      dyn: function () {
        var c = PATHS.filter(function (p) { return k.state.visited.indexOf(p.id) < 0; }).map(function (p) { return { label: p.label, to: p.to }; });
        if (k.state.visited.indexOf('lille') < 0) c.push({ label: 'Gå hen til den mindste ræveunge, der sidder alene', to: 'js4Lille', lock: function () { return k.lockTxt('Venlighed', 2); } });
        if (k.state.visited.length > 0) c.push({ label: 'Gå til snemanden i lysningen', to: 'js4Snemand' });
        return c;
      }
    },
    js4Kogle: {
      title: 'Egernets forråd', path: 'kogle',
      text: ['Højt oppe i granen sidder et egern ved sit forråd. Det har de fineste grankogler i hele skoven. Der er én, der er lang og brun og lige som en rigtig næse.',
        'Ingen skal klatre derop. &laquo;Vi må spørge egernet, om det vil kaste den ned,&raquo; siger Nusse. Men egernet er travlt optaget af at tælle sine nødder.'],
      ask: 'Hvordan får man en, der har travlt, til at lytte?',
      choices: [
        { label: 'Spørg egernet høfligt og vent', roll: { stat: 'Venlighed', target: 6, win: 'js4KogleOk', lose: 'js4KogleFejl' } },
        { label: 'Byd egernet en nød fra jeres lomme', roll: { stat: 'List', target: 6, win: 'js4KogleOk', lose: 'js4KogleFejl' } },
        { label: 'Hjælp egernet med at tælle nødderne', roll: { stat: 'Nysgerrighed', target: 6, win: 'js4KogleOk', lose: 'js4KogleFejl' } }
      ]
    },
    js4KogleOk: {
      title: 'Den fine grankogle', gain: true, gnist: FUND('brune', 'Den fine grankogle', '#8A5A2B', 'Kogle'),
      text: ['Egernet kigger ned og smiler. &laquo;Til en snemand? Så skal I have den fineste.&raquo; Grankoglen daler ned og lander blødt i Nusses hue.',
        'Den er lang og brun og lige. &laquo;Det er en rigtig snemandsnæse,&raquo; siger Uffe. &laquo;Ingen kan sige andet.&raquo;'],
      ask: 'Hvad ville I bruge som næse til en snemand?',
      next: 'js4Hub'
    },
    js4KogleFejl: {
      title: 'Koglesne',
      text: ['Egernet bliver så glad for at blive spurgt, at det kaster alle sine kogler ned på én gang. De forsvinder plop, plop, plop i den dybe sne.',
        '&laquo;Ups,&raquo; siger egernet. &laquo;Dem finder jeg til foråret.&raquo; I graver lidt, men koglerne er væk. Uffe finder kun en meget lille en, der ligner en ært.'],
      ask: 'Hvad tror I, egernet finder i sneen til foråret?',
      next: 'js4Hub'
    },
    js4Pjuske: {
      title: 'Pjuskes vinterseng', path: 'pjuske',
      text: ['Under den store, gamle rod sover pindsvinet Pjuske i sin seng af blade. Han gik i hi i november og sover til foråret. Kun hans lille, sorte næse stikker op.',
        'Ved siden af sengen ligger hans bunke blanke kastanjer. &laquo;Pjuske sagde, at vi måtte låne to, hvis vi fik brug for dem,&raquo; hvisker Uffe. &laquo;De er perfekte øjne til en snemand. Men vi må ikke vække ham.&raquo;'],
      ask: 'Hvordan er man helt stille, når man gerne vil fnise?',
      choices: [
        { label: 'List lydløst hen til kastanjerne', bevaeg: { goer: 'Gå på tæerne fra den ene ende af stuen til den anden, så stille I kan. Pjuske må ikke høre et eneste trin.', stat: 'List', target: 6, win: 'js4PjuskeOk', lose: 'js4PjuskeFejl' } },
        { label: 'Lad som om I er snefnug, der daler helt stille', roll: { stat: 'Fantasi', target: 6, win: 'js4PjuskeOk', lose: 'js4PjuskeFejl' } },
        { label: 'Nyn en stille godnatsang, så Pjuske sover endnu tungere', roll: { stat: 'Venlighed', target: 6, win: 'js4PjuskeOk', lose: 'js4PjuskeFejl' } }
      ]
    },
    js4PjuskeOk: {
      title: 'Kastanjeøjnene', gain: true, gnist: FUND('blanke', 'Kastanjeøjnene', '#7A3B1E', 'Blank'),
      text: ['Skridt for skridt, helt uden en lyd, kommer I hen til bunken og tager to blanke kastanjer. Pjuske sover videre og smiler lidt i søvne.',
        'Nusse lægger forsigtigt en lille julekugle ved hans seng. &laquo;Så har han en julegave, når han vågner til foråret,&raquo; hvisker han.'],
      ask: 'Hvad tror I, Pjuske drømmer om hele vinteren?',
      next: 'js4Hub'
    },
    js4PjuskeFejl: {
      title: 'Godnat igen',
      text: ['KNAS! Et frossent blad knaser under en fod. Pjuske åbner ét øje. &laquo;Er det forår?&raquo; mumler han.',
        '&laquo;Nej, det er jul,&raquo; hvisker I. &laquo;Godnat igen.&raquo; &laquo;Glædelig jul,&raquo; mumler Pjuske. Så ruller han sig sammen om sine kastanjer, som om de var en bamse, og sover videre. Dem kan I ikke tage nu. Nusse holder sig for munden for ikke at fnise.'],
      ask: 'Hvordan tror I, det er at vågne midt i vinteren og falde i søvn igen?',
      next: 'js4Hub'
    },
    js4Krage: {
      title: 'Kragens bær', path: 'krage',
      text: ['Kragen sidder på en lav gren med en klase røde rønnebær. &laquo;Dem har jeg gemt hele efteråret,&raquo; siger den. &laquo;De er så røde, at de næsten lyser.&raquo;',
        '&laquo;De ville blive det fineste smil til en snemand,&raquo; siger Nusse. Kragen kniber øjnene sammen. &laquo;Kra. Hvad får jeg så?&raquo;'],
      ask: 'Hvad er en god byttehandel?',
      choices: [
        { label: 'Tilbyd at synge en julesang for kragen', roll: { stat: 'Humor', target: 6, win: 'js4KrageOk', lose: 'js4KrageFejl' } },
        { label: 'Lov kragen den bedste plads til festen i aften', roll: { stat: 'Venlighed', target: 6, win: 'js4KrageOk', lose: 'js4KrageFejl' } },
        { label: 'Fortæl kragen, hvordan snemanden skal se ud', roll: { stat: 'Fantasi', target: 6, win: 'js4KrageOk', lose: 'js4KrageFejl' } }
      ]
    },
    js4KrageOk: {
      title: 'Rønnebærsmilet', gain: true, gnist: FUND('røde', 'Rønnebærsmilet', '#E0525A', 'Smil'),
      text: ['Kragen lytter med hovedet på skrå. &laquo;Kra! Det lyder godt,&raquo; siger den og giver jer bærrene. &laquo;Men jeg vil se snemanden bagefter.&raquo;',
        'Uffe lægger bærrene på række i sneen. De laver et stort, rødt smil. &laquo;Hu-hu! Han kommer til at smile hele julen,&raquo; siger Uffe.'],
      ask: 'Hvad får jer til at smile hele julen?',
      next: 'js4Hub'
    },
    js4KrageFejl: {
      title: 'Ups, kra',
      text: ['Kragen tænker så længe over byttehandlen, at den kommer til at spise et bær. Og så et til. Og så et til.',
        'Til sidst er der kun stilken tilbage. &laquo;Ups. Kra,&raquo; siger kragen og ser lidt flov ud. &laquo;De smagte bare så godt.&raquo; Uffe griner. &laquo;Så har du i hvert fald fået en julemiddag.&raquo;'],
      ask: 'Er I nogensinde kommet til at spise noget, I skulle have gemt?',
      next: 'js4Hub'
    },
    js4Lille: {
      title: 'Den mindste ræveunge', path: 'lille',
      text: ['Bag en snedrive sidder den mindste ræveunge helt alene. Hun kigger ned i sneen. &laquo;Jeg har hørt, at I vil have snemandens næse,&raquo; siger hun stille.',
        '&laquo;Den er det fineste, jeg nogensinde har fundet. Hvis den bliver taget, har han ingen næse. Og så er han bare en bunke sne.&raquo;'],
      ask: 'Hvordan tror I, den mindste ræveunge har det?',
      choices: [
        { label: 'Sæt jer ved siden af hende, og lyt', roll: { stat: 'Venlighed', target: 6, win: 'js4LilleOk', lose: 'js4LilleFejl' } },
        { label: 'Fortæl, at næsen skal lyse for hele skoven fra toppen af træet', roll: { stat: 'Fantasi', target: 6, win: 'js4LilleOk', lose: 'js4LilleFejl' } },
        { label: 'Spørg hende, hvad snemanden hedder', roll: { stat: 'Nysgerrighed', target: 6, win: 'js4LilleOk', lose: 'js4LilleFejl' } }
      ]
    },
    js4LilleOk: {
      title: 'Den mindstes løfte', gain: true, gnist: FUND('varme', 'Den mindstes løfte', '#F2C94C', 'Løfte'),
      text: ['Den mindste ræveunge lytter. Så kigger hun op. &laquo;Kan alle i skoven se den, når den sidder i toppen af Lanternetræet?&raquo; &laquo;Alle sammen,&raquo; siger Nusse.',
        '&laquo;Så må I godt få den,&raquo; siger hun. &laquo;Men snemanden skal have et nyt ansigt. Og jeg vil sidde forrest til festen.&raquo; Det lover I.'],
      ask: 'Hvordan føles det at give noget væk, som man selv synes er fint?',
      next: 'js4Hub'
    },
    js4LilleFejl: {
      title: 'Ikke endnu',
      text: ['Den mindste ræveunge trækker halen om sig. &laquo;Jeg vil tænke over det,&raquo; siger hun og går hen til sin søster.',
        'Uffe sætter sig ved siden af jer. &laquo;Det er i orden at have brug for tid,&raquo; siger han. &laquo;Det har jeg også tit. Især før morgenmad.&raquo;'],
      ask: 'Hvad hjælper jer, når I har brug for at tænke over noget?',
      next: 'js4Hub'
    },
    js4Snemand: {
      title: 'Snemanden',
      text: function () {
        var g = k.state.gnists;
        var a = 'I lysningen står ræveungernes store snemand med pindearme, hat og halstørklæde. Hans næse lyser gyldent. Det er den sidste stjernestump. Ræveungerne står ved siden af ham og ser stolte ud.';
        if (g >= 1) return [a, 'I lægger ' + k.joinNames(k.gnistNames()) + ' frem i sneen. Ræveungerne kigger på det, og så begynder de at bygge. Snemanden får et helt nyt ansigt. Ræveungerne kigger på ham med hovedet på skrå, og så griner de højt. &laquo;Nu ligner han vores morfar!&raquo;',
          'Ræveungerne løfter forsigtigt stjernestumpen af og giver den til jer. &laquo;Han er endnu finere nu,&raquo; siger de. Nusse lægger stumpen i æsken. Alle fire er fundet!'];
        return [a, 'I har ikke fundet noget nyt ansigt. Ræveungerne kigger på jer. Så siger I det, som det er: at stumpen er en del af julestjernen, og at den skal lyse for hele skoven i aften.',
          'Ræveungerne kigger på hinanden. &laquo;Så skal den op i træet,&raquo; siger den største. De løfter stumpen af og trykker en lille snebold på i stedet. &laquo;En snenæse er også fin.&raquo; Nusse lægger stumpen i æsken. Alle fire er fundet!'];
      },
      ask: 'Hvordan tror I, ræveungerne har det nu?',
      choices: [{ label: 'Gå til Lanternetræet med alle fire stumper', to: 'js4Trae' }]
    },
    js4Trae: {
      title: 'Lanternetræet i sne',
      text: function () {
        var a = 'Midt i skoven står Lanternetræet med sne på alle grenene. Skovens dyr er kommet for at fejre jul, og alle kigger op mod toppen. Der er tomt, hvor julestjernen skal sidde.';
        var b = 'Nusse åbner sin æske. Der ligger de fire gyldne stumper på vattet og lyser. Den mindste ræveunge sidder forrest og holder vejret.';
        return [a, b, 'Kun Pjuske er her ikke. Han sover under sin rod og drømmer om foråret. &laquo;Vi fortæller ham det hele, når han vågner,&raquo; siger Uffe.'];
      },
      ask: 'Hvordan skal stjernen komme op i toppen?',
      dyn: function () {
        var c = [{ label: 'Sæt stjernen sammen, og lad Uffe flyve den op', to: 'js4EndStjerne' }];
        c.push({ label: 'Råb på skovens venner', to: 'js4EndVenner' });
        c.push({ label: 'Syng en julesang for træet', to: 'js4EndSang', lock: function () { return k.partyStat('Fantasi') >= 3 || k.partyStat('Humor') >= 3 ? null : 'Kræver Fantasi 3 eller Humor 3'; } });
        return c;
      }
    },
    js4EndStjerne: {
      title: 'Julestjernen lyser', end: true, all: true,
      text: function () {
        var t = ['I lægger de fire stumper sammen. De klikker sammen med et lille &laquo;pling&raquo;, og julestjernen er hel igen. Uffe tager den forsigtigt i næbbet og flyver den op i toppen af træet.',
          'Stjernen lyser så stærkt, at sneen på alle grenene glitrer som guld. Lanterne efter lanterne tænder, og skovens dyr råber hurra. Nusse kigger op med tårer af glæde i øjnene. &laquo;Den har aldrig lyst så flot før.&raquo;'];
        if (k.state.gnists > 0) t.push('Ovre i lysningen smiler snemanden med ' + k.joinNames(k.gnistNames()) + ', og den mindste ræveunge vinker til stjernen.');
        t.push('&laquo;Hu-hu! Glædelig jul!&raquo; siger Uffe. Og så nyser han. Men denne gang holder alle godt fast i stjernen.');
        return t;
      },
      ask: 'Hvad var det bedste valg, I tog i hele julestjernens historie?'
    },
    js4EndVenner: {
      title: 'En stjerne af venner', end: true, all: true,
      text: function () {
        var fl = venneLinjer();
        var a = 'I råber ud i den hvide skov: &laquo;Glædelig jul! Vil nogen hjælpe os med stjernen?&raquo; Først er alt stille. Så knaser det i sneen.';
        var slut = 'Alle har en lille lanterne med. De stiller sig i en stor ring om træet og løfter lanternerne, mens Uffe flyver den hele stjerne op i toppen. Stjernen og lanternerne lyser sammen. &laquo;Det er den første julestjerne, der er sat op af så mange venner,&raquo; hvisker Nusse.';
        if (!fl.length) return [a + ' Ræve, mus, en krage og to fnisende ræveunger kommer frem mellem træerne.', slut];
        return [a, fl.join(' '), 'Ræve, mus og kragen kommer også. ' + slut];
      },
      ask: function () { return venneLinjer().length ? 'Hvem var I gladest for at se i aften?' : 'Hvornår har I sidst fået hjælp af en ven? Hvordan føltes det?'; }
    },
    js4EndSang: {
      title: 'Julesangen', end: true, all: true,
      text: function () {
        var t = ['I stiller jer ved foden af Lanternetræet og begynder at synge en julesang. Først stille, så højere. Nusse synger med, og Uffe hu-huer i takt.',
          'Mens I synger, svæver de fire stumper op af æsken. De finder hinanden i luften og klikker sammen, og den hele julestjerne svæver op i toppen af træet.'];
        t.push('Snefnuggene begynder at gløde, mens de daler ned, og hele skoven synger med til sidste vers. Lanterne efter lanterne tænder.');
        return t;
      },
      ask: 'Hvilken julesang ville I synge for træet?'
    },
    js4EndMester: {
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
    js4Kogle: {
      gnist: { l: 'Skab en gnist, der svæver op og henter koglen', to: 'js4KogleOk' },
      dyr: { l: 'Spørg egernet på egernsprog', to: 'js4KogleOk' },
      syn: { l: 'Se en lige så fin kogle, der allerede ligger i sneen', to: 'js4KogleOk' },
      latter: { l: 'Strø latterstøv, så egernet griner og taber koglen', to: 'js4KogleOk' }
    },
    js4Pjuske: {
      gnist: { l: 'Skab en gnist, der lyser en lydløs sti op', to: 'js4PjuskeOk' },
      dyr: { l: 'Spørg en mus, om den vil hente kastanjerne stille for jer', to: 'js4PjuskeOk' },
      syn: { l: 'Se de bløde pletter i sneen, hvor man kan gå uden en lyd', to: 'js4PjuskeOk' },
      latter: { l: 'Strø latterstøv, så Pjuske smiler i søvne og sover endnu dybere', to: 'js4PjuskeOk' }
    },
    js4Krage: {
      gnist: { l: 'Skab en gnist, som kragen kan få i bytte', to: 'js4KrageOk' },
      dyr: { l: 'Byt med kragen på kragesprog', to: 'js4KrageOk' },
      syn: { l: 'Se, at kragen har to klaser bær', to: 'js4KrageOk' },
      latter: { l: 'Strø latterstøv, så kragen griner og taber bærrene', to: 'js4KrageOk' }
    },
    js4Lille: {
      gnist: { l: 'Skab en lille gnist, der danser for ræveungen', to: 'js4LilleOk' },
      dyr: { l: 'Tal med ræveungen på rævesprog', to: 'js4LilleOk' },
      syn: { l: 'Se, hvad ræveungen allerhelst vil have', to: 'js4LilleOk' },
      latter: { l: 'Strø latterstøv, så ræveungen kommer til at smile', to: 'js4LilleOk' }
    },
    js4Hub: {
      syn: { l: 'Se den mindste ræveunge, der sidder alene', to: 'js4Lille', show: function () { return k.state.visited.indexOf('lille') < 0 && !!k.lockTxt('Venlighed', 2); } }
    },
    js4Trae: {
      dyr: { l: 'Bed skovens dyr om at hjælpe', to: 'js4EndVenner' },
      latter: { l: 'Strø latterstøv, så hele skoven synger', to: 'js4EndSang' }
    }
  };

  /* Mester-valg: når en helt har 5 i et træk, åbner der sig et ekstra valg i scenen (uden terning). */
  var mester = {
    js4Kogle: [
      { stat: 'Nysgerrighed', l: 'Find den kogle, egernet har tabt under granen', to: 'js4KogleOk', n: function (n) { return n + ' kigger under granen og finder en lang, brun kogle, som egernet tabte i går.'; } }
    ],
    js4Pjuske: [
      { stat: 'List', l: 'Gå i jeres egne fodspor, hvor sneen allerede er trådt', to: 'js4PjuskeOk', n: function (n) { return n + ' går i jeres gamle fodspor, hvor sneen ikke knaser. Det er helt lydløst.'; } }
    ],
    js4Krage: [
      { stat: 'Humor', l: 'Lav en krage-imitation, der får kragen til at grine', to: 'js4KrageOk', n: function (n) { return n + ' hopper rundt og siger &laquo;kra&raquo; så præcist, at kragen griner og giver jer bærrene.'; } },
      { stat: 'Venlighed', l: 'Byd kragen den bedste plads ved festen', to: 'js4KrageOk', n: function (n) { return n + ' lover kragen den bedste gren ved Lanternetræet. Kragen bliver så glad, at den giver jer alle bærrene.'; } }
    ],
    js4Lille: [
      { stat: 'Venlighed', l: 'Giv ræveungen et kram og lov at passe på næsen', to: 'js4LilleOk', n: function (n) { return n + ' giver den mindste ræveunge et kram og lover, at næsen skal lyse for hende hele julen.'; } }
    ],
    js4Trae: []
  };
  k.stats.forEach(function (t) {
    mester.js4Trae.push({ stat: t[0], l: 'Brug mester-trækket ' + t[0] + ' til at sætte stjernen i toppen', to: 'js4EndMester', eff: function (h, stat) { k.state.mester = { name: h.name, stat: stat }; } });
  });

  /* Billeder til scenerne, tegnet med delene i art/dele.js (LK.art.scene). Koordinater i en ramme på 400 x 250. */
  var SNE = { navn: 'snefald', x: 200, y: 125 };
  var driver = function (a, b) { return [{ navn: 'snedrive', x: a, y: 238 }, { navn: 'snedrive', x: b, y: 242, skala: 1.2 }]; };
  var STJERNE = { navn: 'stjerne', x: 200, y: 30, skala: 0.9, taendt: true };
  var NU = function (x, y, h, s) { return { navn: 'nusse', x: x, y: y, skala: s || 0.75, humoer: h }; };
  var UF = function (x, y, h, s) { return { navn: 'uffe', x: x, y: y, skala: s || 0.7, humoer: h }; };
  var billeder = {
    js4Start: { sted: 'vindue', himmel: 'skumring', alt: 'Uffe sidder spændt på vindueskarmen, og udenfor står Nusse med sin æske.',
      ting: [{ navn: 'snefald', x: 200, y: 100, skala: 0.65 }],
      figurer: [{ navn: 'uffe', x: 145, y: 141, skala: 0.9, humoer: 'glad' }, { navn: 'nusse', x: 270, y: 142, skala: 0.5, humoer: 'glad' }] },
    js4Hvad: { sted: 'vindue', himmel: 'skumring', alt: 'Nusse fortæller om snemanden med den lysende næse.',
      ting: [{ navn: 'snefald', x: 200, y: 100, skala: 0.65 }],
      figurer: [{ navn: 'uffe', x: 145, y: 141, skala: 0.9, humoer: 'overrasket' }, { navn: 'nusse', x: 270, y: 142, skala: 0.5, humoer: 'rolig' }] },
    js4Hub: { sted: 'skovsti', himmel: 'skumring', alt: 'Uffe og Nusse går gennem den hvide skov, hvor de første lanterner tænder.',
      ting: driver(70, 330).concat([{ navn: 'lanterne', x: 340, y: 120, skala: 0.7, taendt: true }, SNE]),
      figurer: [UF(140, 170, 'glad', 0.8), NU(255, 188, 'glad', 0.85)] },
    js4Kogle: { sted: 'skovsti', himmel: 'skumring', alt: 'Nusse kigger op mod granen, hvor egernet har sit forråd.',
      ting: driver(70, 330).concat([{ navn: 'gren', x: 290, y: 110 }, SNE]),
      figurer: [NU(120, 194, 'rolig'), UF(250, 190, 'rolig', 0.6)] },
    js4KogleOk: { sted: 'skovsti', himmel: 'skumring', alt: 'Nusse holder en lang, brun grankogle, og Uffe er glad.',
      ting: driver(70, 330).concat([{ navn: 'gnist', x: 200, y: 130, taendt: true, farve: '#8A5A2B' }, SNE]),
      figurer: [NU(120, 194, 'glad'), UF(300, 190, 'glad', 0.6)] },
    js4KogleFejl: { sted: 'skovsti', himmel: 'skumring', alt: 'Koglerne er forsvundet i den dybe sne, og Uffe holder en bitte lille kogle.',
      ting: [{ navn: 'snedrive', x: 200, y: 242, skala: 1.6 }, SNE],
      figurer: [NU(90, 194, 'overrasket'), UF(320, 190, 'glad', 0.6)] },
    js4Pjuske: { sted: 'slukkettrae', himmel: 'skumring', alt: 'Pjuske sover i sin seng af blade under den store rod.',
      ting: [{ navn: 'bladbunke', x: 150, y: 240 }, { navn: 'snedrive', x: 340, y: 244 }, SNE],
      figurer: [{ navn: 'pind', x: 150, y: 210, skala: 0.55, humoer: 'rolig' }, UF(300, 190, 'rolig', 0.6)] },
    js4PjuskeOk: { sted: 'slukkettrae', himmel: 'skumring', alt: 'Pjuske sover videre, og Uffe holder to blanke kastanjer.',
      ting: [{ navn: 'bladbunke', x: 150, y: 240 }, { navn: 'gnist', x: 300, y: 130, taendt: true, farve: '#7A3B1E' }, SNE],
      figurer: [{ navn: 'pind', x: 150, y: 210, skala: 0.55, humoer: 'rolig' }, UF(300, 190, 'glad', 0.6)] },
    js4PjuskeFejl: { sted: 'slukkettrae', himmel: 'skumring', alt: 'Pjuske kigger søvnigt op med ét øje, og Nusse holder sig for munden.',
      ting: [{ navn: 'bladbunke', x: 150, y: 240 }, SNE],
      figurer: [{ navn: 'pind', x: 150, y: 210, skala: 0.55, humoer: 'overrasket' }, NU(300, 196, 'overrasket', 0.65)] },
    js4Krage: { sted: 'lysning', himmel: 'skumring', alt: 'Kragen sidder på en lav gren med en klase røde bær.',
      ting: driver(60, 340).concat([{ navn: 'gnist', x: 205, y: 150, skala: 0.6, farve: 'roed' }, SNE]),
      figurer: [{ navn: 'krage', x: 160, y: 190, skala: 0.7, humoer: 'rolig' }, NU(300, 194, 'rolig', 0.7)] },
    js4KrageOk: { sted: 'lysning', himmel: 'skumring', alt: 'Kragen giver de røde bær, og Uffe smiler.',
      ting: driver(60, 340).concat([{ navn: 'gnist', x: 230, y: 130, taendt: true, farve: 'roed' }, SNE]),
      figurer: [{ navn: 'krage', x: 160, y: 190, skala: 0.7, humoer: 'glad' }, UF(300, 190, 'glad', 0.65)] },
    js4KrageFejl: { sted: 'lysning', himmel: 'skumring', alt: 'Kragen ser flov ud, og der er kun en tom stilk tilbage.',
      ting: driver(60, 340).concat([SNE]),
      figurer: [{ navn: 'krage', x: 160, y: 190, skala: 0.7, humoer: 'bekymret' }, UF(300, 190, 'glad', 0.65)] },
    js4Lille: { sted: 'lysning', himmel: 'skumring', alt: 'Den mindste ræveunge sidder alene bag en snedrive.',
      ting: [{ navn: 'snedrive', x: 150, y: 240, skala: 1.3 }, SNE],
      figurer: [{ navn: 'raev', x: 150, y: 200, skala: 0.55, humoer: 'bekymret' }, NU(300, 194, 'rolig', 0.7)] },
    js4LilleOk: { sted: 'lysning', himmel: 'skumring', alt: 'Den mindste ræveunge smiler igen, og Nusse er glad.',
      ting: [{ navn: 'snedrive', x: 150, y: 240, skala: 1.3 }, { navn: 'gnist', x: 225, y: 130, taendt: true }, SNE],
      figurer: [{ navn: 'raev', x: 150, y: 200, skala: 0.55, humoer: 'glad' }, NU(300, 194, 'glad', 0.7)] },
    js4LilleFejl: { sted: 'lysning', himmel: 'skumring', alt: 'Den mindste ræveunge går hen til sin søster, og Uffe sidder roligt i sneen.',
      ting: [{ navn: 'snedrive', x: 120, y: 240 }, SNE],
      figurer: [{ navn: 'raev', x: 80, y: 196, skala: 0.55, humoer: 'rolig' }, { navn: 'raev', x: 150, y: 194, skala: 0.65 }, UF(300, 190, 'rolig', 0.65)] },
    js4Snemand: { sted: 'lysning', himmel: 'aften', alt: 'Snemanden har fået en ny næse, og ræveungerne griner ved siden af ham.',
      ting: driver(60, 340).concat([{ navn: 'gnist', x: 290, y: 110, taendt: true }, SNE]),
      figurer: [{ navn: 'snemand', x: 200, y: 168, skala: 1.1, naese: 'kogle', humoer: 'glad' }, { navn: 'raev', x: 95, y: 190, skala: 0.7, humoer: 'glad' }, { navn: 'raev', x: 305, y: 194, skala: 0.6, humoer: 'glad' }] },
    js4Trae: { sted: 'slukkettrae', himmel: 'nat', alt: 'Lanternetræet står med sne på grenene, og toppen er tom.',
      ting: driver(80, 320).concat([SNE]),
      figurer: [NU(100, 190, 'rolig', 0.8), { navn: 'raev', x: 200, y: 200, skala: 0.55, humoer: 'overrasket' }, UF(300, 184, 'rolig')] },
    js4EndStjerne: { sted: 'lanternetrae', himmel: 'nat', alt: 'Julestjernen lyser i toppen af Lanternetræet, og Nusse og Uffe jubler i sneen.',
      ting: driver(80, 320).concat([STJERNE, SNE]),
      figurer: [NU(100, 190, 'glad', 0.8), UF(300, 184, 'glad')] },
    js4EndVenner: { sted: 'lanternetrae', himmel: 'nat', alt: 'Skovens dyr står om Lanternetræet med lanterner, og stjernen lyser i toppen.',
      ting: driver(80, 320).concat([STJERNE, { navn: 'lanterne', x: 174, y: 64, skala: 0.7, taendt: true }, { navn: 'lanterne', x: 226, y: 64, skala: 0.7, taendt: true }, SNE]),
      figurer: [{ navn: 'raev', x: 60, y: 186, skala: 0.75 }, { navn: 'mus', x: 120, y: 200, skala: 0.65 }, { navn: 'krage', x: 285, y: 196, skala: 0.6 }, NU(345, 190, 'glad')] },
    js4EndSang: { sted: 'lanternetrae', himmel: 'nat', alt: 'Alle synger ved Lanternetræet, og stjernen lyser i toppen.',
      ting: driver(80, 320).concat([STJERNE, SNE]),
      figurer: [NU(100, 190, 'rolig', 0.8), UF(300, 184, 'rolig')] },
    js4EndMester: { sted: 'lanternetrae', himmel: 'nat', alt: 'Lanternetræet skinner over den hvide skov med julestjernen i toppen.',
      ting: driver(80, 320).concat([STJERNE, SNE]),
      figurer: [NU(100, 190, 'glad', 0.8), UF(300, 184, 'glad')] }
  };

  return {
    id: '2026-12-julestjernen-4', type: 'maaned', udgives: '2026-12-25',
    serie: { id: '2026-12-julestjernen', titel: 'Julestjernen' }, kapitel: 4, kapitler: 4,
    start: 'js4Start', title: 'Stjernen på træet', tag: 'December',
    blurb: 'Det sidste stykke af julestjernen er blevet næse på ræveungernes snemand. Find et nyt ansigt til ham, og sæt stjernen i toppen af Lanternetræet.',
    scenes: scenes, magi: magi, mester: mester, billeder: billeder
  };
});
