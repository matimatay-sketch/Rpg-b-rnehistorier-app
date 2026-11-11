// Månedens historier, december 2026: Julestjernen, kapitel 3 af 4: Molls julegåde. Historiefil: registrerer sig med LK.addStory og får kit-hjælperne som k.
// Et kapitel står for sig selv. Det må læse vennerne fra sagaen, men sætter aldrig venne-flag.
// Det tredje stykke af julestjernen faldt ned gennem Molls tag, og nu er det hendes lampe. I hjælper hende med at bringe
// julekort ud i skoven, og til sidst gætter I hendes julegåde.
LK.addStory(function (k) {
  var PATHS = [
    { id: 'mus', to: 'js3Mus', label: 'Bring den høje stak kort ned til musene ved bækken' },
    { id: 'krage', to: 'js3Krage', label: 'Bring kortet til kragen, der bor højt oppe i egetræet' },
    { id: 'raev', to: 'js3Raev', label: 'Bring kortet til ræveungerne i lysningen' }
  ];
  // Det, I får som tak for kortene, er en gnist med sit eget navn.
  var FUND = function (c, def, col, ph) { return { c: c, def: def, col: col, ph: ph }; };

  var MESTER_TXT = {
    Mod: function (n) { return n + ' stiller sig midt i Molls hule og siger svaret højt og klart, selvom alle kigger: &laquo;Et snefnug!&raquo; Moll klapper, så brillerne hopper.'; },
    List: function (n) { return n + ' lægger mærke til, at Moll har tegnet små snefnug i hjørnet af alle sine julekort. &laquo;Svaret har været her hele tiden,&raquo; siger ' + n + '. &laquo;Et snefnug!&raquo;'; },
    Venlighed: function (n) { return n + ' spørger Moll, hvad hun selv bedst kan lide ved vinteren. &laquo;Når det første snefnug lander på næsen,&raquo; siger Moll. Så smiler hun. &laquo;Nå. Der røg svaret.&raquo;'; },
    Fantasi: function (n) { return n + ' lukker øjnene og forestiller sig noget hvidt og koldt, der falder fra himlen uden at slå sig. &laquo;Et snefnug,&raquo; siger ' + n + '. &laquo;Det danser hele vejen ned.&raquo;'; },
    Humor: function (n) { return n + ' gætter først på en flyvende isbjørn, så på en hvid sok med vinger. Moll griner så meget, at hun kommer til at sige svaret selv: &laquo;Det er et snefnug, dit fjols!&raquo;'; },
    Nysgerrighed: function (n) { return n + ' går hen til Molls lille vindue og ser et snefnug lande på ruden. Det smelter til en lille dråbe. &laquo;Det er et snefnug!&raquo; siger ' + n + '.'; }
  };

  // Venner fra sagaen, der kommer til Molls hule. Historiens egne linjer i stedet for k.friendLines(), som er skrevet
  // til sagaen. Moll og Nusse er med i hele kapitlet og nævnes derfor ikke her.
  function venneLinjer() {
    var f = k.state.flags, o = [];
    if (f.tutVen) o.push('Tut kommer hoppende, uden skøjter i dag. &laquo;Jeg er god til gåder,&raquo; siger han. &laquo;Er svaret en tudse? Det er det tit.&raquo;');
    if (f.vindVen) o.push('Vinden puster blidt ind ad døren og har en hvirvel af sne med.');
    if (f.maaneVen) o.push('Månen kigger ind ad Molls lille vindue, så hele hulen bliver sølvblank.');
    return o;
  }

  var scenes = {
    js3Start: {
      title: 'Et julekort',
      text: function () {
        var t = ['Det sner stille i Lanterneskoven. Uffe sidder på vindueskarmen og kigger på fnuggene, der daler forbi.',
          'Så banker det på ruden. Det er nissen Nusse med sin lille æske med vat. &laquo;To stykker af julestjernen er fundet,&raquo; siger han. &laquo;Ét på kælkebakken og ét på Tuts hat. Og nu har jeg fået et julekort fra Moll. Hun har det tredje!&raquo;'];
        if (k.state.flags.nusseVen) t.push('Nusse blinker til jer. &laquo;Godt, I er med. Moll elsker gæster, der kan tænke.&raquo;');
        return t;
      },
      ask: 'Hvad er det bedste ved at få et kort med posten?',
      choices: [{ label: 'Tag huer og vanter på, og gå med Nusse', to: 'js3Hub' }, { label: 'Læs Molls julekort', to: 'js3Kort' }]
    },
    js3Kort: {
      title: 'Molls julekort',
      text: ['På kortet er der tegnet et snefnug. Nusse læser højt: &laquo;Kære Nusse. Et lille stykke stjerne faldt ned gennem mit tag. Nu er det min lampe. I må gerne få det, men først skal I hjælpe mig med mine julekort. Og så skal I gætte min julegåde. Kærlig hilsen Moll.&raquo;',
        '&laquo;Moll er god til gåder,&raquo; siger Uffe. Så plukker han en lille fjer af sin vinge. &laquo;Tag den med. Den giver held. Brug den, når I slår med terningen.&raquo;'],
      gainFeather: true,
      ask: 'Hvem ville I skrive et julekort til, og hvad skulle der stå?',
      choices: [{ label: 'Afsted til Moll!', to: 'js3Hub' }]
    },
    js3Hub: {
      title: 'Molls hule',
      text: function () {
        var g = k.state.gnists, v = k.state.visited.length;
        if (v === 0) return ['Inde i sin hule sidder muldvarpen Moll ved et lille bord fuldt af julekort. Hun har ingen lampe. I stedet lyser stjernestumpen ved siden af hende.',
          '&laquo;Godt, I kom,&raquo; siger Moll og skubber brillerne op. &laquo;Jeg er så langsom i sneen. Vil I bringe mine julekort ud? Imens finder jeg på den bedste julegåde.&raquo;'];
        var a = 'I kommer tilbage til Molls hule. Hun skriver stadig, og stumpen lyser på bordet.';
        var b = g === 0 ? '&laquo;Gik det godt?&raquo; spørger Moll. &laquo;Det gør ikke noget, hvis ikke. Vil I bringe et kort til, eller er I klar til gåden?&raquo;'
          : g === 1 ? '&laquo;Fik I en tak med hjem?&raquo; siger Moll glad. &laquo;Der er flere kort, hvis I vil. I bestemmer.&raquo;'
          : '&laquo;Hele skoven får julekort i år,&raquo; siger Moll. &laquo;Der er stadig et par stykker, hvis I vil. I bestemmer.&raquo;';
        var left = PATHS.filter(function (p) { return k.state.visited.indexOf(p.id) < 0; }).length + (k.state.visited.indexOf('bjorn') < 0 ? 1 : 0);
        return [a, b + (left === 0 ? ' Der er ikke flere kort at bringe ud.' : '')];
      },
      ask: 'Hvem i skoven tror I, der bliver gladest for et julekort?',
      dyn: function () {
        var c = PATHS.filter(function (p) { return k.state.visited.indexOf(p.id) < 0; }).map(function (p) { return { label: p.label, to: p.to }; });
        if (k.state.visited.indexOf('bjorn') < 0) c.push({ label: 'Find ud af, hvem det sidste, krøllede kort er til', to: 'js3Bjorn', lock: function () { return k.lockTxt('Nysgerrighed', 2); } });
        if (k.state.visited.length > 0) c.push({ label: 'Sæt jer hos Moll, og hør julegåden', to: 'js3Hule' });
        return c;
      }
    },
    js3Mus: {
      title: 'Den høje stak', path: 'mus',
      text: ['Musefamilien ved bækken skal have mange kort. Ét til hver mus. Det er en høj, vaklende stak. Moll lægger en bog oven på den, så den holder sammen.',
        '&laquo;Bær den på hovedet,&raquo; siger hun. &laquo;Så har I armene fri til at holde balancen. Men pas på. Hvis stakken vælter, blæser kortene ud over hele skoven.&raquo;'],
      ask: 'Hvad er det sværeste, I har båret?',
      choices: [
        { label: 'Bær stakken på hovedet hele vejen', bevaeg: { goer: 'Læg en bog eller en bamse på hovedet. Det er stakken med julekort. Gå fra den ene ende af stuen til den anden uden at tabe den.', stat: 'List', target: 6, win: 'js3MusOk', lose: 'js3MusFejl' } },
        { label: 'Træk stakken på Nusses kælk', roll: { stat: 'Mod', target: 6, win: 'js3MusOk', lose: 'js3MusFejl' } },
        { label: 'Syng en marchsang, så I går i takt', roll: { stat: 'Humor', target: 6, win: 'js3MusOk', lose: 'js3MusFejl' } }
      ]
    },
    js3MusOk: {
      title: 'Pebernødden', gain: true, gnist: FUND('brune', 'Pebernødden', '#B5793A', 'Knas'),
      text: ['Skridt for skridt, og stakken vælter ikke. Musene stiller sig på række, og hver mus får sit eget kort. &laquo;Piv! Der står mit navn!&raquo; piber den mindste.',
        'Som tak får I en pebernød, der er næsten lige så stor som en mus. &laquo;Den er til Moll,&raquo; siger musene. &laquo;Hun elsker pebernødder.&raquo;'],
      ask: 'Hvad ville I give som tak for et julekort?',
      next: 'js3Hub'
    },
    js3MusFejl: {
      title: 'Kort i blæsten', flag: 'js3Kortregn',
      text: ['Halvvejs vakler stakken. Den vipper til venstre, så til højre, og så FLUP! Kortene flyver ud over sneen som en flok hvide fugle.',
        'Musene løber rundt og samler dem op. &laquo;Det er ligesom at fange snefnug!&raquo; piber de og griner. Men kortene er blevet våde, og de skal tørre ved ovnen, før de kan læses. Pebernødden når de ikke at finde frem i dag.'],
      ask: 'Hvordan føles det, når noget vælter, selvom man prøvede?',
      next: 'js3Hub'
    },
    js3Krage: {
      title: 'Kragen i egetræet', path: 'krage',
      text: ['Kragen bor helt oppe i toppen af det gamle egetræ. Ingen skal klatre derop. &laquo;Vi må få kragen til at komme ned,&raquo; siger Nusse.',
        'Men kragen sidder og sover med hovedet under vingen. Den hører ikke, når I kalder forsigtigt.'],
      ask: 'Hvordan vækker man nogen på en sød måde?',
      choices: [
        { label: 'Fold kortet til en flyver, der svæver derop', roll: { stat: 'Fantasi', target: 6, win: 'js3KrageOk', lose: 'js3KrageFejl' } },
        { label: 'Kald pænt, og vent tålmodigt', roll: { stat: 'Venlighed', target: 6, win: 'js3KrageOk', lose: 'js3KrageFejl' } },
        { label: 'Lad kortet blinke i solen, så kragen bliver nysgerrig', roll: { stat: 'Nysgerrighed', target: 6, win: 'js3KrageOk', lose: 'js3KrageFejl' } }
      ]
    },
    js3KrageOk: {
      title: 'Den blanke knap', gain: true, gnist: FUND('blanke', 'Den blanke knap', '#D9DEE6', 'Blink'),
      text: ['Kragen vågner, kigger ned og flyver ned til jer. Den tager kortet i næbbet og læser det. &laquo;Kra! Et julekort! Til mig!&raquo;',
        'Kragen roder i sin rede og kommer ned med en blank knap. &laquo;Den er til Moll. Det er det fineste, jeg har.&raquo;'],
      ask: 'Hvad er det fineste, I har, som I godt kunne give væk?',
      next: 'js3Hub'
    },
    js3KrageFejl: {
      title: 'Snorke-kragen',
      text: ['Kragen snorker videre. KRAAA-pust. KRAAA-pust. Den hører ingenting.',
        'Til sidst stikker I kortet ind i en sprække i barken, så kragen kan finde det, når den vågner. &laquo;Det bliver en overraskelse,&raquo; siger Nusse. Uffe prøver at snorke ligesom kragen, og I må holde jer for munden for ikke at grine.'],
      ask: 'Hvad tror I, kragen drømmer om?',
      next: 'js3Hub'
    },
    js3Raev: {
      title: 'Ræveungerne', path: 'raev',
      text: ['I lysningen er to ræveunger ved at bygge en stor snemand. Han har pindearme, hat og halstørklæde. &laquo;Han skal stå her til juleaften,&raquo; siger de stolt.',
        'Ræveungerne vil gerne have deres kort. Men de kan ikke læse endnu, og de vil så gerne vide, hvad der står.'],
      ask: 'Hvordan kan man hjælpe en, der ikke kan læse endnu?',
      choices: [
        { label: 'Læs kortet højt med sjove stemmer', roll: { stat: 'Humor', target: 6, win: 'js3RaevOk', lose: 'js3RaevFejl' } },
        { label: 'Fortæl, hvad der står, som en lille historie', roll: { stat: 'Fantasi', target: 6, win: 'js3RaevOk', lose: 'js3RaevFejl' } },
        { label: 'Vis ræveungerne bogstaverne ét ad gangen', roll: { stat: 'Venlighed', target: 6, win: 'js3RaevOk', lose: 'js3RaevFejl' } }
      ]
    },
    js3RaevOk: {
      title: 'Ræveungernes tegning', gain: true, gnist: FUND('farverige', 'Ræveungernes tegning', '#E0525A', 'Streg'),
      text: ['&laquo;Glædelig jul, kære ræveunger. Kærlig hilsen Moll,&raquo; læser I. Ræveungerne hopper af glæde. &laquo;Hun kender vores navne!&raquo;',
        'De tegner en tegning til Moll med en pind i sneen og så på et stykke bark. Det er en snemand med et kæmpe smil. &laquo;Giv hende den,&raquo; siger de.'],
      ask: 'Hvad ville I tegne til en, I holder af?',
      next: 'js3Hub'
    },
    js3RaevFejl: {
      title: 'Snemand med kort',
      text: ['Lige da I skal læse, kommer et vindpust. Kortet flyver ud af jeres vante og lander i snemandens halstørklæde.',
        '&laquo;Nu har snemanden fået post!&raquo; råber ræveungerne og griner. De vil ikke have kortet ned igen. &laquo;Han passer på det for os,&raquo; siger de. Tegningen glemmer de helt.'],
      ask: 'Hvis en snemand kunne læse, hvad tror I så, han ville læse?',
      next: 'js3Hub'
    },
    js3Bjorn: {
      title: 'Kortet til Brumme', path: 'bjorn',
      text: ['Det sidste kort er krøllet, fordi Moll har skrevet det om mange gange. Der står &laquo;Til Brumme&raquo; på det. Brumme er bjørnen, og han sover i sin hule hele vinteren.',
        '&laquo;Læg det ved hans pote, så han finder det til foråret,&raquo; siger Moll. &laquo;Men væk ham ikke. En bjørn, der vågner midt i vinteren, bliver så forvirret.&raquo;'],
      ask: 'Hvad skal man huske, når nogen sover?',
      choices: [
        { label: 'Skub kortet stille ind under poten', roll: { stat: 'List', target: 6, win: 'js3BjornOk', lose: 'js3BjornFejl' } },
        { label: 'Nyn en stille godnatsang, mens I lægger det', roll: { stat: 'Venlighed', target: 6, win: 'js3BjornOk', lose: 'js3BjornFejl' } },
        { label: 'Gå ind på listefødder i bjørnens store fodspor', roll: { stat: 'Mod', target: 6, win: 'js3BjornOk', lose: 'js3BjornFejl' } }
      ]
    },
    js3BjornOk: {
      title: 'Brummes smil', gain: true, gnist: FUND('gyldne', 'Brummes smil', '#E3A21A', 'Brum'),
      text: ['Helt stille lægger I kortet ved Brummes store pote. Han snorker videre. SNOOORK. Pust. Men så smiler han i søvne, og poten lægger sig blødt over kortet.',
        '&laquo;Det smil skal Moll høre om,&raquo; hvisker Nusse. &laquo;Det er den bedste tak, man kan få fra en bjørn i hi.&raquo;'],
      ask: 'Hvad tror I, Brumme tænker, når han finder kortet til foråret?',
      next: 'js3Hub'
    },
    js3BjornFejl: {
      title: 'Er det jul?',
      text: ['KNÆK! En pind knækker. Brumme åbner ét øje. &laquo;Er det jul?&raquo; mumler han. &laquo;Ja,&raquo; hvisker I. &laquo;Glædelig jul,&raquo; mumler Brumme.',
        'Så tager han kortet, lægger det under hovedet som en pude og sover videre. SNOOORK. Pust. Nusse holder sig for munden. &laquo;Han fik det i hvert fald,&raquo; hvisker han.'],
      ask: 'Hvad er det sjoveste, nogen har sagt, mens de sov?',
      next: 'js3Hub'
    },
    js3Hule: {
      title: 'Hos Moll',
      text: function () {
        var g = k.state.gnists;
        var a = 'I sætter jer på puderne i Molls hule. Det er lunt derinde, og der dufter af julekage. Stjernestumpen lyser på bordet.';
        var b = g >= 1 ? 'I giver Moll ' + k.joinNames(k.gnistNames()) + ' fra skoven. Moll bliver helt stille. &laquo;Til mig?&raquo; siger hun og tørrer brillerne. &laquo;Så skal I også have en rigtig god gåde.&raquo;'
          : '&laquo;Det gør ikke noget, at I ikke fik noget med hjem,&raquo; siger Moll. &laquo;Det vigtigste er, at I prøvede. Er I klar til gåden?&raquo;';
        var t = [a, b];
        if (k.state.flags.js3Kortregn) t.push('&laquo;Musene fortalte, at det regnede med julekort ved bækken i dag,&raquo; siger Moll og klukker. &laquo;Det har jeg aldrig hørt om før.&raquo;');
        return t;
      },
      ask: 'Hvordan tror I, Moll har det, når hun får gaver fra hele skoven?',
      dyn: function () {
        var c = [{ label: 'Hør Molls julegåde', to: 'js3Gaade' }];
        c.push({ label: 'Råb på skovens venner, så de kan gætte med', to: 'js3EndVenner' });
        c.push({ label: 'Lad Uffe gætte først', to: 'js3EndUffe', lock: function () { return k.partyStat('Humor') >= 3 || k.partyStat('Fantasi') >= 3 ? null : 'Kræver Humor 3 eller Fantasi 3'; } });
        return c;
      }
    },
    js3Gaade: {
      title: 'Julegåden',
      text: ['Moll skubber brillerne op og taler med sin gådestemme: &laquo;Jeg falder fra himlen, men jeg slår mig aldrig. Jeg er hvid og kold, og jeg forsvinder, hvis du holder mig i hånden. Hvad er jeg?&raquo;'],
      ask: 'Tænk sammen, før I svarer. Hvad har I set falde ned i dag?',
      choices: [
        { label: 'Et snefnug', to: 'js3EndGaade', key: 'snefnug' },
        { label: 'En isbjørn', to: 'js3Gaade', key: 'isbjoern', wrong: 'Moll klukker: &laquo;Isbjørne falder heldigvis ikke ned fra himlen!&raquo;' },
        { label: 'En hvid sok', to: 'js3Gaade', key: 'sok', wrong: 'Moll fniser: &laquo;Sokker forsvinder kun i vaskemaskinen. Prøv igen!&raquo;' },
        { label: 'Kig ud ad Molls lille vindue og se, hvad der sker derude', key: 'kig', roll: { stat: 'Nysgerrighed', target: 6, win: 'js3GaadeKig', lose: 'js3GaadeHint' } }
      ]
    },
    js3GaadeKig: {
      title: 'Ud ad vinduet',
      text: ['I kigger ud ad Molls lille vindue. Derude daler fnug efter fnug. Et af dem lander på jeres finger og bliver til en lille vanddråbe.',
        '&laquo;Det er et snefnug!&raquo; siger I. Moll klapper i sine små hænder. &laquo;I kiggede efter i stedet for at gætte. Det kan jeg godt lide.&raquo;'],
      ask: 'Hvad så I derude, som I ikke havde lagt mærke til før?',
      next: 'js3EndGaade'
    },
    js3GaadeHint: {
      title: 'Et lille hint',
      text: ['Vinduet er helt dugget til, og I kan ikke se noget. Moll smiler. &laquo;Jeg giver jer et hint: Der faldt tusindvis af mig ned på jeres huer på vejen herhen.&raquo;'],
      ask: 'Hvad lå der på jeres huer, da I kom ind?',
      next: 'js3Gaade'
    },
    js3EndGaade: {
      title: 'Hulestumpen', end: true, all: true,
      text: function () {
        var t = ['&laquo;Et snefnug! Selvfølgelig!&raquo; Moll rækker jer stjernestumpen. Den er varm og lyser i jeres hænder.',
          '&laquo;Så skal jeg bare finde en anden lampe,&raquo; siger hun og finder sin lille lommelygte frem. Klik. &laquo;Den her virker også. Og den springer ikke i stykker, hvis nogen nyser.&raquo; Uffe ser lidt flov ud.'];
        t.push('Nusse lægger stumpen i æsken ved siden af de to andre. Tre stumper! &laquo;Kun én tilbage,&raquo; siger han. &laquo;Og så skal stjernen op i Lanternetræet.&raquo;');
        return t;
      },
      ask: 'Hvad var det bedste valg, I tog i dag?'
    },
    js3EndVenner: {
      title: 'Gåde for hele skoven', end: true, all: true,
      text: function () {
        var fl = venneLinjer();
        var a = 'I råber ud ad døren: &laquo;Kom og gæt med!&raquo; Snart er Molls lille hule fuld af gæster.';
        var slut = 'Musene, kragen og ræveungerne klemmer sig ind på puderne. Moll siger gåden: &laquo;Jeg falder fra himlen, men slår mig aldrig. Jeg er hvid og kold. Hvad er jeg?&raquo; Alle tænker. Så råber alle på én gang: &laquo;ET SNEFNUG!&raquo; Moll griner og giver jer stumpen. &laquo;Det er den første gåde, hele skoven har gættet sammen,&raquo; hvisker Nusse.';
        var t = fl.length ? [a, fl.join(' '), slut] : [a, slut];
        t.push('Nusse lægger stumpen i sin æske. Tre fundet. Én tilbage.');
        return t;
      },
      ask: function () { return venneLinjer().length ? 'Hvem var I gladest for at se i dag?' : 'Hvornår har I sidst løst noget sammen med andre?'; }
    },
    js3EndUffe: {
      title: 'Uffe gætter', end: true, all: true,
      text: function () {
        var t = ['&laquo;Jeg gætter!&raquo; siger Uffe, før Moll er færdig med gåden. &laquo;Er det en mus? En kage? En hvid ugle, der er faldet ned fra en gren?&raquo; Moll ryster på hovedet hver gang.',
          'Så kommer et snefnug flyvende ind ad døren og lander lige på Uffes næb. Det kilder. &laquo;HAT-SJU!&raquo; Snefnugget smelter. Uffe kigger på dråben. &laquo;Nå,&raquo; siger han. &laquo;Det er et snefnug.&raquo;'];
        if (k.state.gnists > 0) t.push('Moll griner så meget, at hun taber ' + k.joinNames(k.gnistNames()) + ' på gulvet.');
        t.push('&laquo;Rigtigt!&raquo; siger Moll og giver jer stumpen. &laquo;Men hold den langt væk fra Uffe.&raquo; Nusse lægger den i sin æske. Tre fundet. Én tilbage.');
        return t;
      },
      ask: 'Hvad er det sjoveste forkerte svar, I nogensinde har givet?'
    },
    js3EndMester: {
      title: 'Mesterens svar', end: true, all: true,
      text: function () {
        var m = k.state.mester || { name: 'Jeres helt', stat: 'Mod' };
        var how = MESTER_TXT[m.stat] || MESTER_TXT.Mod;
        return [how(k.esc(m.name)), 'Moll rækker jer stjernestumpen og finder sin lille lommelygte frem i stedet. Nusse lægger stumpen i æsken. &laquo;Tre fundet,&raquo; siger han. &laquo;Kun én tilbage.&raquo;'];
      },
      ask: 'Hvad er I blevet rigtig gode til? Hvordan lærte I det?'
    }
  };

  var magi = {
    js3Mus: {
      gnist: { l: 'Skab en gnist, der holder stakken sammen som lim', to: 'js3MusOk' },
      dyr: { l: 'Spørg musene, om de vil hente kortene ét ad gangen', to: 'js3MusOk' },
      syn: { l: 'Se den jævne sti, hvor man ikke snubler', to: 'js3MusOk' },
      latter: { l: 'Strø latterstøv, så stakken griner og holder sig stille', to: 'js3MusOk' }
    },
    js3Krage: {
      gnist: { l: 'Skab en gnist, der kilder kragen blidt vågen', to: 'js3KrageOk' },
      dyr: { l: 'Kald på kragen på kragesprog', to: 'js3KrageOk' },
      syn: { l: 'Se, at kragen kun lader som om, den sover', to: 'js3KrageOk' },
      latter: { l: 'Strø latterstøv, så kragen vågner af grin', to: 'js3KrageOk' }
    },
    js3Raev: {
      gnist: { l: 'Skab gnister, der tegner bogstaverne i luften', to: 'js3RaevOk' },
      dyr: { l: 'Læs kortet højt på rævesprog', to: 'js3RaevOk' },
      syn: { l: 'Se den lille tegning, Moll har gemt på kortet', to: 'js3RaevOk' },
      latter: { l: 'Strø latterstøv, så ræveungerne fniser og lytter', to: 'js3RaevOk' }
    },
    js3Bjorn: {
      gnist: { l: 'Skab en gnist, der lyser en lydløs sti op', to: 'js3BjornOk' },
      dyr: { l: 'Hvisk på bjørnesprog, at det kun er et julekort', to: 'js3BjornOk' },
      syn: { l: 'Se de bløde pletter, hvor man kan gå uden en lyd', to: 'js3BjornOk' },
      latter: { l: 'Strø latterstøv, så Brumme smiler i søvne', to: 'js3BjornOk' }
    },
    js3Hub: {
      syn: { l: 'Se, hvem det krøllede kort er til', to: 'js3Bjorn', show: function () { return k.state.visited.indexOf('bjorn') < 0 && !!k.lockTxt('Nysgerrighed', 2); } }
    },
    js3Gaade: {
      gnist: { l: 'Skab en gnist, der tegner et snefnug i luften', to: 'js3GaadeKig' },
      dyr: { l: 'Spørg Molls edderkop, hvad den så falde ned i dag', to: 'js3GaadeKig' },
      syn: { l: 'Se svaret, der gemmer sig i Molls julekort', to: 'js3GaadeKig' },
      latter: { l: 'Strø latterstøv, så Moll kommer til at grine svaret ud', to: 'js3EndGaade' }
    },
    js3Hule: {
      dyr: { l: 'Bed skovens dyr om at komme og gætte med', to: 'js3EndVenner' },
      latter: { l: 'Strø latterstøv, så Uffe får lyst til at gætte', to: 'js3EndUffe' }
    }
  };

  /* Mester-valg: når en helt har 5 i et træk, åbner der sig et ekstra valg i scenen (uden terning). */
  var mester = {
    js3Mus: [
      { stat: 'List', l: 'Bind stakken sammen med et snørebånd', to: 'js3MusOk', n: function (n) { return n + ' binder et snørebånd om stakken med en fin sløjfe. Nu kan den slet ikke vælte.'; } }
    ],
    js3Krage: [
      { stat: 'Fantasi', l: 'Fold kortet til en lille fugl, der flyver op til kragen', to: 'js3KrageOk', n: function (n) { return n + ' folder kortet til en lille papirfugl. Den svæver op og lander lige i kragens rede.'; } }
    ],
    js3Raev: [
      { stat: 'Humor', l: 'Læs kortet højt, som om snemanden siger det', to: 'js3RaevOk', n: function (n) { return n + ' stiller sig bag snemanden og læser kortet højt med en dyb snemandsstemme. Ræveungerne hyler af grin.'; } }
    ],
    js3Bjorn: [
      { stat: 'List', l: 'Lad kortet glide hen til poten på en flad sten', to: 'js3BjornOk', n: function (n) { return n + ' lægger kortet på en flad sten og skubber den blidt hen over sneen til Brummes pote. Den stopper præcis der.'; } }
    ],
    js3Hule: []
  };
  k.stats.forEach(function (t) {
    mester.js3Hule.push({ stat: t[0], l: 'Brug mester-trækket ' + t[0] + ' til at løse gåden', to: 'js3EndMester', eff: function (h, stat) { k.state.mester = { name: h.name, stat: stat }; } });
  });

  /* Billeder til scenerne, tegnet med delene i art/dele.js (LK.art.scene). Koordinater i en ramme på 400 x 250. */
  var SNE = { navn: 'snefald', x: 200, y: 125 };
  var driver = function (a, b) { return [{ navn: 'snedrive', x: a, y: 238 }, { navn: 'snedrive', x: b, y: 242, skala: 1.2 }]; };
  var STUMP = function (x, y, s) { return { navn: 'gnist', x: x, y: y, skala: s || 0.8, taendt: true }; };
  var MOLL = function (h) { return { navn: 'moll', x: 200, y: 192, humoer: h }; };
  var NU = function (x, y, h, s) { return { navn: 'nusse', x: x, y: y, skala: s || 0.7, humoer: h }; };
  var UF = function (x, y, h, s) { return { navn: 'uffe', x: x, y: y, skala: s || 0.65, humoer: h }; };
  var billeder = {
    js3Start: { sted: 'vindue', himmel: 'dag', alt: 'Uffe sidder på vindueskarmen, og udenfor står Nusse med et julekort.',
      ting: [{ navn: 'snefald', x: 200, y: 100, skala: 0.65 }, { navn: 'brev', x: 300, y: 150, skala: 0.6 }],
      figurer: [{ navn: 'uffe', x: 145, y: 141, skala: 0.9, humoer: 'glad' }, { navn: 'nusse', x: 270, y: 142, skala: 0.5, humoer: 'glad' }] },
    js3Kort: { sted: 'vindue', himmel: 'dag', alt: 'Nusse læser Molls julekort højt, og Uffe lytter.',
      ting: [{ navn: 'snefald', x: 200, y: 100, skala: 0.65 }, { navn: 'brev', x: 300, y: 150, skala: 0.6, taendt: true }],
      figurer: [{ navn: 'uffe', x: 145, y: 141, skala: 0.9, humoer: 'rolig' }, { navn: 'nusse', x: 270, y: 142, skala: 0.5, humoer: 'rolig' }] },
    js3Hub: { sted: 'hule', himmel: 'dag', alt: 'Moll sidder foran sin hule med julekort, og en stjernestump lyser ved siden af hende.',
      ting: [{ navn: 'snedrive', x: 75, y: 244 }, { navn: 'brev', x: 290, y: 232 }, { navn: 'brev', x: 325, y: 238 }, STUMP(255, 200)],
      figurer: [MOLL('glad')] },
    js3Mus: { sted: 'baek', himmel: 'dag', alt: 'Ved siden af Nusse ligger en høj stak julekort med en bog ovenpå, og en mus venter ved bækken.',
      ting: [{ navn: 'brev', x: 345, y: 214, skala: 0.7 }, { navn: 'bog', x: 345, y: 200, skala: 0.6 }, SNE],
      figurer: [{ navn: 'mus', x: 130, y: 182, skala: 0.65, humoer: 'overrasket' }, NU(280, 182, 'rolig')] },
    js3MusOk: { sted: 'baek', himmel: 'dag', alt: 'Musen jubler over sit julekort og holder en stor pebernød.',
      ting: [{ navn: 'brev', x: 200, y: 210, skala: 0.6 }, { navn: 'gnist', x: 220, y: 130, taendt: true, farve: '#B5793A' }, SNE],
      figurer: [{ navn: 'mus', x: 130, y: 182, skala: 0.7, humoer: 'glad' }, NU(290, 182, 'glad')] },
    js3MusFejl: { sted: 'baek', himmel: 'dag', alt: 'Julekortene flyver ud over sneen, og musen griner.',
      ting: [{ navn: 'brev', x: 150, y: 90, skala: 0.5 }, { navn: 'brev', x: 230, y: 70, skala: 0.5 }, { navn: 'brev', x: 300, y: 110, skala: 0.5 }, SNE],
      figurer: [{ navn: 'mus', x: 120, y: 182, skala: 0.65, humoer: 'glad' }, NU(290, 182, 'overrasket')] },
    js3Krage: { sted: 'skovsti', himmel: 'dag', alt: 'Kragen sover på en gren, og Nusse står nedenunder med et kort.',
      ting: driver(70, 330).concat([{ navn: 'gren', x: 280, y: 110 }, { navn: 'brev', x: 120, y: 160, skala: 0.5 }, SNE]),
      figurer: [{ navn: 'krage', x: 280, y: 88, skala: 0.55, humoer: 'rolig' }, NU(110, 194, 'rolig')] },
    js3KrageOk: { sted: 'skovsti', himmel: 'dag', alt: 'Kragen er fløjet ned med en blank knap, og Nusse smiler.',
      ting: driver(70, 330).concat([{ navn: 'gnist', x: 200, y: 140, taendt: true, farve: '#D9DEE6' }, SNE]),
      figurer: [{ navn: 'krage', x: 280, y: 196, skala: 0.65, humoer: 'glad' }, NU(110, 194, 'glad')] },
    js3KrageFejl: { sted: 'skovsti', himmel: 'dag', alt: 'Kragen sover videre på grenen, og Uffe prøver at snorke ligesom den.',
      ting: driver(70, 330).concat([{ navn: 'gren', x: 280, y: 110 }, SNE]),
      figurer: [{ navn: 'krage', x: 280, y: 88, skala: 0.55, humoer: 'rolig' }, UF(110, 190, 'rolig')] },
    js3Raev: { sted: 'lysning', himmel: 'dag', alt: 'To ræveunger bygger en snemand i lysningen.',
      ting: driver(60, 340).concat([SNE]),
      figurer: [{ navn: 'snemand', x: 200, y: 168, skala: 1.1, humoer: 'glad' }, { navn: 'raev', x: 95, y: 190, skala: 0.7, humoer: 'overrasket' }, { navn: 'raev', x: 305, y: 194, skala: 0.6 }] },
    js3RaevOk: { sted: 'lysning', himmel: 'dag', alt: 'Ræveungerne hopper af glæde over deres julekort.',
      ting: driver(60, 340).concat([{ navn: 'gnist', x: 290, y: 110, taendt: true, farve: 'roed' }, SNE]),
      figurer: [{ navn: 'snemand', x: 200, y: 168, skala: 1.1, humoer: 'glad' }, { navn: 'raev', x: 95, y: 190, skala: 0.7, humoer: 'glad' }, { navn: 'raev', x: 305, y: 194, skala: 0.6, humoer: 'glad' }] },
    js3RaevFejl: { sted: 'lysning', himmel: 'dag', alt: 'Kortet sidder i snemandens halstørklæde, og ræveungerne griner.',
      ting: driver(60, 340).concat([{ navn: 'brev', x: 200, y: 150, skala: 0.45 }, SNE]),
      figurer: [{ navn: 'snemand', x: 200, y: 168, skala: 1.1, humoer: 'overrasket' }, { navn: 'raev', x: 95, y: 190, skala: 0.7, humoer: 'glad' }, { navn: 'raev', x: 305, y: 194, skala: 0.6, humoer: 'glad' }] },
    js3Bjorn: { sted: 'hule', himmel: 'dag', alt: 'Bjørnen Brumme sover i sin hule, og Nusse holder et krøllet kort.',
      ting: [{ navn: 'snedrive', x: 340, y: 244 }, { navn: 'brev', x: 85, y: 160, skala: 0.5 }],
      figurer: [{ navn: 'bjorn', x: 200, y: 196, skala: 0.85, humoer: 'rolig' }, NU(80, 200, 'bekymret', 0.6)] },
    js3BjornOk: { sted: 'hule', himmel: 'dag', alt: 'Brumme smiler i søvne med kortet under poten.',
      ting: [{ navn: 'brev', x: 230, y: 236, skala: 0.5 }, { navn: 'gnist', x: 330, y: 140, taendt: true, farve: '#E3A21A' }],
      figurer: [{ navn: 'bjorn', x: 200, y: 196, skala: 0.85, humoer: 'glad' }, NU(80, 200, 'glad', 0.6)] },
    js3BjornFejl: { sted: 'hule', himmel: 'dag', alt: 'Brumme sover med kortet under hovedet, og Nusse holder sig for munden.',
      ting: [{ navn: 'snedrive', x: 340, y: 244 }],
      figurer: [{ navn: 'bjorn', x: 200, y: 196, skala: 0.85, humoer: 'rolig' }, NU(80, 200, 'overrasket', 0.6)] },
    js3Hule: { sted: 'hule', himmel: 'skumring', alt: 'Moll sidder i sin lune hule, og stjernestumpen lyser på bordet.',
      ting: [{ navn: 'brev', x: 325, y: 238 }, STUMP(255, 200)],
      figurer: [MOLL('glad'), NU(80, 200, 'rolig', 0.6)] },
    js3Gaade: { sted: 'hule', himmel: 'skumring', alt: 'Moll skubber brillerne op og siger sin julegåde.',
      ting: [{ navn: 'brev', x: 325, y: 238 }, STUMP(255, 200)],
      figurer: [MOLL('overrasket'), UF(80, 196, 'rolig')] },
    js3GaadeKig: { sted: 'hule', himmel: 'skumring', alt: 'Snefnuggene daler uden for Molls vindue, og Moll klapper.',
      ting: [STUMP(255, 200), SNE],
      figurer: [MOLL('glad'), UF(80, 196, 'overrasket')] },
    js3GaadeHint: { sted: 'hule', himmel: 'skumring', alt: 'Moll smiler og giver et hint, mens Uffe tænker så det knager.',
      ting: [{ navn: 'brev', x: 290, y: 232 }, STUMP(255, 200)],
      figurer: [MOLL('rolig'), UF(330, 186, 'bekymret')] },
    js3EndGaade: { sted: 'hule', himmel: 'aften', alt: 'Moll giver jer stjernestumpen og tænder sin lille lommelygte.',
      ting: [{ navn: 'brev', x: 325, y: 238, taendt: true }, STUMP(250, 150, 1.2)],
      figurer: [MOLL('glad'), NU(80, 200, 'glad', 0.6)] },
    js3EndVenner: { sted: 'hule', himmel: 'aften', alt: 'Musen, kragen og en ræveunge sidder i Molls hule og gætter med.',
      ting: [STUMP(200, 110, 1.1)],
      figurer: [{ navn: 'mus', x: 60, y: 210, skala: 0.55 }, { navn: 'krage', x: 120, y: 200, skala: 0.55 }, MOLL('glad'), { navn: 'raev', x: 320, y: 196, skala: 0.6, humoer: 'glad' }] },
    js3EndUffe: { sted: 'hule', himmel: 'aften', alt: 'Uffe har nyst et snefnug væk, og Moll griner.',
      ting: [STUMP(255, 150, 1.1), { navn: 'snefald', x: 330, y: 120, skala: 0.4 }],
      figurer: [MOLL('glad'), UF(330, 186, 'overrasket')] },
    js3EndMester: { sted: 'hule', himmel: 'aften', alt: 'Stjernestumpen lyser i Molls hule.',
      ting: [{ navn: 'brev', x: 325, y: 238, taendt: true }, STUMP(250, 140, 1.3)],
      figurer: [MOLL('glad'), NU(80, 200, 'glad', 0.6)] }
  };

  return {
    id: '2026-12-julestjernen-3', type: 'maaned', udgives: '2026-12-18',
    serie: { id: '2026-12-julestjernen', titel: 'Julestjernen' }, kapitel: 3, kapitler: 4,
    start: 'js3Start', title: 'Molls julegåde', tag: 'December',
    blurb: 'Et stykke af julestjernen er blevet Molls lampe. Hjælp hende med julekortene, og gæt hendes julegåde.',
    scenes: scenes, magi: magi, mester: mester, billeder: billeder
  };
});
