// Månedens historier, november 2026: Pjuskes efterårsliste, kapitel 4 af 4: Godnat, Pjuske. Historiefil: registrerer sig med LK.addStory og får kit-hjælperne som k.
// Et kapitel står for sig selv. Det må læse vennerne fra sagaen, men sætter aldrig venne-flag.
// I aften skal Pjuske gå i hi. Sidste punkt på hans efterårsliste: bliv sunget godnat af alle vennerne.
// I samler det, der skal til en rigtig godnat, og følger ham med lanterner hen til hans seng.
LK.addStory(function (k) {
  var PATHS = [
    { id: 'taage', to: 'pj4Taage', label: 'Find vejen gennem tågen, hvor der lyser en lanterne' },
    { id: 'moll', to: 'pj4Moll', label: 'Gå hen til Moll, der øver på en sang' },
    { id: 'mus', to: 'pj4Mus', label: 'Gå ud i lysningen, hvor musene syr noget' }
  ];
  // Det, I samler til godnatten, er en gnist med sit eget navn.
  var GODNAT = function (c, def, col, ph) { return { c: c, def: def, col: col, ph: ph }; };

  var MESTER_TXT = {
    Mod: function (n) { return n + ' går forrest med den største lanterne hele vejen gennem den mørke skov og synger højt, så alle tør synge med. Det bliver det mest modige godnat, skoven har hørt.'; },
    List: function (n) { return n + ' hænger små lanterner i rødderne over Pjuskes seng, så der er lys, mens han falder i søvn. Bagefter slukker ' + n + ' dem én ad gangen, helt stille.'; },
    Venlighed: function (n) { return n + ' tager et blødt blad og lægger det over Pjuske som en dyne. &laquo;Sov godt,&raquo; hvisker ' + n + '. &laquo;Vi passer på din seng, til du vågner.&raquo;'; },
    Fantasi: function (n) { return n + ' fortæller Pjuske en godnathistorie om et pindsvin, der drømmer, at det flyver med gæssene sydpå og ser hele verden. Pjuske falder i søvn med et smil midt i historien.'; },
    Humor: function (n) { return n + ' laver den sjoveste godnat-dans med lanternen, så hele skoven griner stille. Pjuske fniser og fniser, til han gaber, og så sover han.'; },
    Nysgerrighed: function (n) { return n + ' spørger Pjuske, hvad han glæder sig mest til i foråret. &laquo;At se jer igen,&raquo; mumler Pjuske, og så sover han.'; }
  };

  // Venner fra sagaen, der kommer for at sige godnat. Historiens egne linjer i stedet for k.friendLines(), som er skrevet
  // til sagaen. Moll kan allerede have været mødt i aften, så hendes linje passer, uanset om I har mødt hende.
  function venneLinjer() {
    var f = k.state.flags, o = [];
    if (f.nusseVen || f.nusseHonning) o.push('Nusse kommer med sin røde hue i hånden. &laquo;Den kan du låne som natkasket,&raquo; hvisker han.');
    if (f.mollLoefte) o.push('Moll har taget sin tykkeste bog med. &laquo;Den læser jeg højt for dig til foråret,&raquo; siger hun.');
    if (f.tutVen) o.push('Tut kommer hoppende med en lysende svamp, som han stiller ved sengen som en natlampe.');
    if (f.vindVen) o.push('Vinden lægger sig helt stille, så ikke et eneste blad rasler.');
    if (f.maaneVen) o.push('Månen lægger et blødt sølvlys over Pjuskes seng som et tæppe.');
    return o;
  }

  var scenes = {
    pj4Start: {
      title: 'Den sidste aften',
      text: function () {
        var t = ['Det er en stille, kold aften i Lanterneskoven. Næsten alle bladene er faldet, og luften dufter af vinter. Uffe sidder i vindueskarmen med en tændt lanterne ved siden af sig.',
          'Så banker det på ruden. Det er Pjuske, og han gaber så stort, at man kan se alle hans små tænder. &laquo;I aften skal jeg gå i hi,&raquo; siger han. &laquo;Men jeg vil ikke bare putte mig. Jeg vil have en rigtig godnat. Vil I hjælpe mig?&raquo;'];
        if (k.state.remembered.length) t.push('Uffe nikker. &laquo;Hu-hu! Det er ' + k.joinNames(k.state.remembered) + '. Ingen er bedre til en godnat end dem.&raquo;');
        return t;
      },
      ask: 'Hvad skal der til, for at I får en rigtig god godnat?',
      choices: [{ label: 'Tænd lanternerne, og gå med Pjuske', to: 'pj4Hub' }, { label: 'Spørg Pjuske om hans liste', to: 'pj4Liste' }]
    },
    pj4Liste: {
      title: 'Det sidste punkt',
      text: ['Pjuske finder sit store egeblad frem. Det er lidt krøllet nu. Der står fire ting: en blød seng, farvel til trækfuglene, lysormene i den lange aften, og at blive sunget godnat af alle vennerne.',
        '&laquo;De tre første har jeg nået,&raquo; siger Pjuske stolt. &laquo;Nu mangler kun den sidste. Så kan jeg sove hele vinteren og drømme om det hele.&raquo;',
        'Uffe plukker en lille fjer af sin vinge. &laquo;Tag den med. Den giver held. Brug den, når I slår med terningen.&raquo;'],
      gainFeather: true,
      ask: 'Hvad tror I, Pjuske kommer til at drømme om hele vinteren?',
      choices: [{ label: 'Så laver vi den bedste godnat!', to: 'pj4Hub' }]
    },
    pj4Hub: {
      title: 'Lanterner i mørket',
      text: function () {
        var g = k.state.gnists, v = k.state.visited.length;
        if (v === 0) return ['I går ud i den mørke skov med jeres lanterner. De laver små, gule cirkler på stien. Pjuske går lige ved siden af jer og gaber hvert tiende skridt.',
          '&laquo;En rigtig godnat skal have en sang,&raquo; siger Uffe. &laquo;Og noget blødt at sove på. Og nogen, der passer på én. Lad os se, hvad vi kan finde.&raquo;'];
        var a = 'Jeres lanterner gynger, mens I går. Pjuske gaber igen, endnu større.';
        var b = g === 0 ? '&laquo;Vi har ikke fundet noget endnu,&raquo; siger Pjuske søvnigt. &laquo;Skal vi prøve et sted til, eller gå hen til min seng?&raquo;'
          : g === 1 ? '&laquo;Én ting til godnatten!&raquo; siger Pjuske. &laquo;Det er godt. Men jeg kan holde mig vågen lidt endnu. I bestemmer.&raquo;'
          : '&laquo;Nu har vi nok til en rigtig godnat,&raquo; siger Pjuske. &laquo;Men jeg kan godt holde mig vågen lidt endnu. I bestemmer.&raquo;';
        var left = PATHS.filter(function (p) { return k.state.visited.indexOf(p.id) < 0; }).length + (k.state.visited.indexOf('raev') < 0 ? 1 : 0);
        return [a, b + (left === 0 ? ' Der er ikke flere steder at gå hen.' : '')];
      },
      ask: 'Hvad er det vigtigste ved en godnat?',
      dyn: function () {
        var c = PATHS.filter(function (p) { return k.state.visited.indexOf(p.id) < 0; }).map(function (p) { return { label: p.label, to: p.to }; });
        if (k.state.visited.indexOf('raev') < 0) c.push({ label: 'Følg den lille, triste pibelyd under busken', to: 'pj4Raev', lock: function () { return k.lockTxt('Venlighed', 2); } });
        if (k.state.visited.length > 0) c.push({ label: 'Gå hen til Pjuskes seng under den store rod', to: 'pj4Rod' });
        return c;
      }
    },
    pj4Taage: {
      title: 'Tågestien', path: 'taage',
      text: ['Her ligger tågen tæt og hvid mellem træerne. Stien er så smal som et bånd, og på begge sider ligger store, bløde bunker af visne blade.',
        'Langt inde i tågen hænger en lanterne og lyser. &laquo;Det er min mormors gamle lanterne,&raquo; siger Pjuske. &laquo;Den hænger der hvert år til den sidste aften. Den skal lyse over min seng.&raquo;'],
      ask: 'Hvordan finder man vej, når man ikke kan se ret langt?',
      choices: [
        { label: 'Gå på den smalle sti, ét skridt ad gangen', bevaeg: { goer: 'Læg et snørebånd eller en tæppekant på gulvet. Det er den smalle sti i tågen. Gå hen ad den, ét skridt ad gangen, uden at træde ved siden af.', stat: 'Mod', target: 6, win: 'pj4TaageOk', lose: 'pj4TaageFejl' } },
        { label: 'Følg Uffes hu-hu gennem tågen', roll: { stat: 'Nysgerrighed', target: 6, win: 'pj4TaageOk', lose: 'pj4TaageFejl' } },
        { label: 'Hold hinanden i hånden, og gå i en lang række', roll: { stat: 'Venlighed', target: 6, win: 'pj4TaageOk', lose: 'pj4TaageFejl' } }
      ]
    },
    pj4TaageOk: {
      title: 'Mormors lanterne', gain: true, gnist: GODNAT('gyldne', 'Mormors lanterne', '#E3A21A', 'Glød'),
      text: ['Skridt for skridt går I gennem tågen uden at træde ved siden af. Så står I lige under lanternen. Den lyser varmt og gyldent, som om den har ventet på jer.',
        'Pjuske løfter den forsigtigt ned. &laquo;Min mormor sagde, at den lyser for alle, der skal sove længe,&raquo; siger han stille. &laquo;Nu lyser den for mig.&raquo;'],
      ask: 'Har I noget, der har tilhørt en, I holder af? Hvad er det?',
      next: 'pj4Hub'
    },
    pj4TaageFejl: {
      title: 'Plums i bladene', flag: 'pj4Blade',
      text: ['Et skridt ved siden af, og PLUMS! I lander midt i en kæmpestor bunke visne blade. De knaser og rasler, og der stikker blade ud af jeres ærmer og hår.',
        'Pjuske griner så meget, at han glemmer at gabe. &laquo;I ligner nogle pindsvin!&raquo; Tågen er for tæt i aften, så lanternen må blive hængende. &laquo;Den lyser alligevel over skoven,&raquo; siger Pjuske. &laquo;Det kan jeg godt lide.&raquo;'],
      ask: 'Hvad er det bedste ved at hoppe i en bunke blade?',
      next: 'pj4Hub'
    },
    pj4Moll: {
      title: 'Molls godnatsang', path: 'moll',
      text: ['Moll sidder foran sin hule med en lille lanterne og en sangbog på skødet. Hun har skrevet en godnatsang til Pjuske. Men det sidste vers mangler.',
        '&laquo;Sov nu godt, mit lille pindsvin, under bladene så lun&hellip;&raquo; synger hun. Så stopper hun. &laquo;Jeg kan ikke finde på, hvordan den skal slutte. Kan I hjælpe?&raquo;'],
      ask: 'Hvilke ord skal der være i en rigtig god godnatsang?',
      choices: [
        { label: 'Find på et sidste vers om foråret', roll: { stat: 'Fantasi', target: 6, win: 'pj4MollOk', lose: 'pj4MollFejl' } },
        { label: 'Lav et sidste vers, der får Pjuske til at smile', roll: { stat: 'Humor', target: 6, win: 'pj4MollOk', lose: 'pj4MollFejl' } },
        { label: 'Spørg Pjuske, hvad han allerhelst vil høre', roll: { stat: 'Venlighed', target: 6, win: 'pj4MollOk', lose: 'pj4MollFejl' } }
      ]
    },
    pj4MollOk: {
      title: 'Godnatsangen', gain: true, gnist: GODNAT('blå', 'Godnatsangen', '#4A90D9', 'Nynne'),
      text: ['I finder på det sidste vers sammen: &laquo;&hellip;og når sneen smelter væk igen, så vågner du, min ven.&raquo;',
        'Moll skriver det ned med det samme. &laquo;Det er den fineste slutning,&raquo; siger hun og tørrer en lille tåre væk. Pjuske nynner sangen hele vejen tilbage til stien.'],
      ask: 'Hvilken sang synger I, når I skal sove?',
      next: 'pj4Hub'
    },
    pj4MollFejl: {
      title: 'Pindsvin og rosin',
      text: ['I prøver og prøver, men det eneste, der rimer på pindsvin, er rosin. &laquo;Sov nu godt, mit lille pindsvin&hellip; du ligner en rosin?&raquo;',
        'Moll griner så meget, at brillerne falder ned. Pjuske griner også. &laquo;Vi nynner bare det sidste vers,&raquo; siger Moll. &laquo;Det er de bedste vers, dem man nynner.&raquo;'],
      ask: 'Hvad kan I finde på, der rimer på jeres eget navn?',
      next: 'pj4Hub'
    },
    pj4Mus: {
      title: 'Musenes pude', path: 'mus',
      text: ['Ude i lysningen sidder musefamilien og syr en bitte lille pude til Pjuske. Den skal fyldes med bløde tidselfnug, der ligger i en stor bunke ved siden af.',
        'Men lige da I kommer, puster en kold vind ind over lysningen, og fnuggene letter som små, hvide skyer. &laquo;Fang dem!&raquo; piber den mindste mus.'],
      ask: 'Hvad ville I fylde en pude med, hvis I kunne vælge hvad som helst?',
      choices: [
        { label: 'Fang fnuggene med jeres huer', roll: { stat: 'List', target: 6, win: 'pj4MusOk', lose: 'pj4MusFejl' } },
        { label: 'Stil jer i en ring, så fnuggene ikke kan slippe væk', roll: { stat: 'Mod', target: 6, win: 'pj4MusOk', lose: 'pj4MusFejl' } },
        { label: 'Lok fnuggene tilbage med en sjov fløjtelyd', roll: { stat: 'Humor', target: 6, win: 'pj4MusOk', lose: 'pj4MusFejl' } }
      ]
    },
    pj4MusOk: {
      title: 'Fnugpuden', gain: true, gnist: GODNAT('hvide', 'Fnugpuden', '#F4F1EA', 'Fnug'),
      text: ['Fnug for fnug kommer tilbage, og musene propper dem ind i puden. Så syr den mindste mus det sidste sting, og puden er færdig. Den er så blød, at den næsten ikke vejer noget.',
        '&laquo;Den er til dit hoved,&raquo; siger musene til Pjuske. &laquo;Så drømmer du blødt.&raquo; Pjuske lægger kinden mod den og lukker øjnene et lille øjeblik.'],
      ask: 'Hvad tror I, man drømmer om, når man sover på en pude af fnug?',
      next: 'pj4Hub'
    },
    pj4MusFejl: {
      title: 'Fnug over det hele',
      text: ['Fnuggene flyver alle vegne. De sætter sig i jeres hår, på jeres næser og på Uffes hoved, så han ligner en lille snemand. &laquo;Hu-hu-atju!&raquo; nyser han.',
        'Musene griner, så de triller rundt i græsset. &laquo;Vi samler dem i morgen,&raquo; siger de. &laquo;Så får Pjuske puden til foråret i stedet.&raquo;'],
      ask: 'Hvad er det sjoveste, der er fløjet ind i jeres hår?',
      next: 'pj4Hub'
    },
    pj4Raev: {
      title: 'Den lille ræv', path: 'raev',
      text: ['Under en busk sidder en lille ræveunge og piber. &laquo;Jeg vil ikke have, at Pjuske skal sove hele vinteren,&raquo; siger den. &laquo;Hvem skal jeg så lege med?&raquo;',
        'Pjuske sætter sig ved siden af den. &laquo;Jeg kommer jo igen til foråret,&raquo; siger han. Men ræveungen ser stadig trist ud.'],
      ask: 'Hvordan kan man trøste en, der skal undvære en ven i lang tid?',
      choices: [
        { label: 'Fortæl ræveungen om alt det sjove, man kan i sneen', roll: { stat: 'Fantasi', target: 6, win: 'pj4RaevOk', lose: 'pj4RaevFejl' } },
        { label: 'Giv ræveungen en vigtig opgave', roll: { stat: 'Venlighed', target: 6, win: 'pj4RaevOk', lose: 'pj4RaevFejl' } },
        { label: 'Lav en sjov leg, som ræveungen kan lege alene', roll: { stat: 'Humor', target: 6, win: 'pj4RaevOk', lose: 'pj4RaevFejl' } }
      ]
    },
    pj4RaevOk: {
      title: 'Rævens løfte', gain: true, gnist: GODNAT('orange', 'Rævens løfte', '#D9772E', 'Vagt'),
      text: ['&laquo;Du kan være Pjuskes vagt,&raquo; foreslår I. &laquo;Du kan kigge forbi hans seng hver dag og se, at alt er godt.&raquo; Ræveungen spidser ørerne. &laquo;En rigtig vagt?&raquo;',
        '&laquo;Den bedste vagt i skoven,&raquo; siger Pjuske. Ræveungen sætter sig ret op med halen pænt om poterne. &laquo;Jeg lover det,&raquo; siger den. &laquo;Og når du vågner, er jeg den første, der siger godmorgen.&raquo;'],
      ask: 'Hvem passer på jer, når I sover?',
      next: 'pj4Hub'
    },
    pj4RaevFejl: {
      title: 'Ræve kan ikke gå i hi',
      text: ['&laquo;Så går jeg også i hi!&raquo; siger ræveungen og lægger sig ned ved siden af Pjuske. Den lukker øjnene. Det er helt stille. I et helt minut.',
        'Så knurrer det. &laquo;Jeg er sulten!&raquo; siger ræveungen og springer op. &laquo;Ræve kan vist ikke gå i hi.&raquo; Alle griner, også ræveungen, og så løber den hjem til sin mor for at få aftensmad.'],
      ask: 'Hvor længe tror I, at I kunne sove i træk?',
      next: 'pj4Hub'
    },
    pj4Rod: {
      title: 'Under den store rod',
      text: function () {
        var g = k.state.gnists;
        var a = 'Under den gamle egs store rødder ligger Pjuskes seng af blade og venter. Pjuske gaber, så hans næse rynker. &laquo;Nu er det tid,&raquo; siger han.';
        var b = g >= 3 ? '&laquo;' + k.joinNames(k.gnistNames()) + ',&raquo; siger Pjuske og smiler søvnigt. &laquo;Nu har jeg alt, hvad en godnat skal have.&raquo;'
          : g >= 1 ? '&laquo;Vi har ' + k.joinNames(k.gnistNames()) + ',&raquo; siger Pjuske. &laquo;Det bliver en dejlig godnat.&raquo;'
          : '&laquo;Vi fandt ikke noget,&raquo; siger Pjuske og gaber. Uffe lægger en vinge om ham. &laquo;Det vigtigste ved en godnat er dem, der siger den. Og vi er her.&raquo;';
        var t = [a, b];
        if (k.state.flags.pj4Blade) t.push('Der sidder stadig et visnet blad i jeres hår fra tågestien. Pjuske fniser og plukker det ud. &laquo;Det tager jeg med i seng,&raquo; siger han.');
        return t;
      },
      ask: 'Hvad ville I sige til Pjuske, før han sover hele vinteren?',
      dyn: function () {
        var c = [];
        if (k.state.gnists > 0) c.push({ label: 'Put Pjuske med alt det, I har samlet', to: 'pj4EndPut' });
        c.push({ label: 'Råb på alle vennerne, så de kan synge med', to: 'pj4EndVenner' });
        c.push({ label: 'Sig godnat helt stille, med hvisken', to: 'pj4EndHvisk', lock: function () { return k.partyStat('List') >= 3 || k.partyStat('Venlighed') >= 3 ? null : 'Kræver List 3 eller Venlighed 3'; } });
        return c;
      }
    },
    pj4EndPut: {
      title: 'Godnat, Pjuske', end: true, all: true,
      text: function () {
        var navne = k.joinNames(k.gnistNames());
        return ['I putter Pjuske i hans seng under roden med ' + navne + '. Han kryber helt ind i bladene, så kun hans lille, sorte næse stikker ud.',
          'Så synger I godnatsangen for ham, stille og blødt. Uffe hu-huer med. Før det sidste vers er færdigt, sover Pjuske. Han smiler i søvne.',
          'Uffe tager det krøllede egeblad og sætter det sidste flueben. Alle fire punkter er klaret. Så lister I hjem med jeres lanterner. Snart kommer sneen og lægger sig som en hvid dyne over hans seng.'];
      },
      ask: 'Hvad var det bedste på Pjuskes efterårsliste?'
    },
    pj4EndVenner: {
      title: 'Alle siger godnat', end: true, all: true,
      text: function () {
        var fl = venneLinjer();
        var a = 'I råber blidt ud i skoven: &laquo;Pjuske skal sove nu! Kom og sig godnat!&raquo; Snart kommer der lanterner mellem træerne fra alle sider.';
        var slut = 'Ræven og ræveungen kommer, musene kommer, og kragen Kra sætter sig på en rod. Alle stiller sig i en rundkreds om sengen med hver sin lanterne og synger godnat. Pjuske kigger på dem alle sammen, og så lukker han øjnene. &laquo;Det er den bedste godnat i hele verden,&raquo; mumler han. Så sover han.';
        var t = fl.length ? [a, fl.join(' '), slut] : [a, slut];
        t.push('Uffe sætter det sidste flueben på listen. Alle fire punkter er klaret.');
        return t;
      },
      ask: function () { return venneLinjer().length ? 'Hvem var I gladest for at se i aften?' : 'Hvem vil I gerne sige godnat til i aften?'; }
    },
    pj4EndHvisk: {
      title: 'Hvisket godnat', end: true, all: true,
      text: function () {
        var t = ['I sætter jer på knæ ved sengen og hvisker. &laquo;Godnat, Pjuske. Sov godt. Vi ses til foråret.&raquo; Uffe hvisker også: &laquo;Hu-hu-godnat.&raquo;'];
        if (k.state.gnists > 0) t.push('I lægger ' + k.joinNames(k.gnistNames()) + ' helt stille ved siden af ham.');
        t.push('Pjuske smiler og lukker øjnene. Hans vejrtrækning bliver langsom og rolig. Så lister I væk på tæerne, så stille, at ikke engang bladene hører det.',
          'Uffe sætter det sidste flueben på listen. Alle fire punkter er klaret.');
        return t;
      },
      ask: 'Hvordan føles det at sige godnat til en ven?'
    },
    pj4EndMester: {
      title: 'Mesterens godnat', end: true, all: true,
      text: function () {
        var m = k.state.mester || { name: 'Jeres helt', stat: 'Mod' };
        var how = MESTER_TXT[m.stat] || MESTER_TXT.Mod;
        return [how(k.esc(m.name)), 'Pjuske sover trygt i sin seng under roden. Uffe sætter det sidste flueben på det krøllede egeblad. Alle fire punkter er klaret, og hele skoven siger stille godnat.'];
      },
      ask: 'Hvad er I blevet rigtig gode til? Hvordan lærte I det?'
    }
  };

  var magi = {
    pj4Taage: {
      gnist: { l: 'Skab en gnist, der lyser tågen væk fra stien', to: 'pj4TaageOk' },
      dyr: { l: 'Spørg en flagermus, der kan finde vej i tåge', to: 'pj4TaageOk' },
      syn: { l: 'Se stien tydeligt, selvom tågen er tæt', to: 'pj4TaageOk' },
      latter: { l: 'Strø latterstøv, så tågen fniser og letter', to: 'pj4TaageOk' }
    },
    pj4Moll: {
      gnist: { l: 'Skab en gnist, der synger det sidste vers', to: 'pj4MollOk' },
      dyr: { l: 'Spørg en solsort, hvordan en godnatsang slutter', to: 'pj4MollOk' },
      syn: { l: 'Se det sidste vers, der gemmer sig i Molls sangbog', to: 'pj4MollOk' },
      latter: { l: 'Strø latterstøv, så verset kommer af sig selv', to: 'pj4MollOk' }
    },
    pj4Mus: {
      gnist: { l: 'Skab en gnist, der kalder fnuggene hjem', to: 'pj4MusOk' },
      dyr: { l: 'Bed en lille fugl om at samle fnuggene', to: 'pj4MusOk' },
      syn: { l: 'Se, hvor vinden har lagt alle fnuggene', to: 'pj4MusOk' },
      latter: { l: 'Strø latterstøv, så fnuggene danser tilbage', to: 'pj4MusOk' }
    },
    pj4Raev: {
      gnist: { l: 'Skab en gnist, som ræveungen kan lege med hele vinteren', to: 'pj4RaevOk' },
      dyr: { l: 'Tal med ræveungen på rævesprog', to: 'pj4RaevOk' },
      syn: { l: 'Se, hvad ræveungen allerhelst vil', to: 'pj4RaevOk' },
      latter: { l: 'Strø latterstøv, så ræveungen griner igen', to: 'pj4RaevOk' }
    },
    pj4Hub: {
      syn: { l: 'Se ræveungen, der sidder under busken', to: 'pj4Raev', show: function () { return k.state.visited.indexOf('raev') < 0 && !!k.lockTxt('Venlighed', 2); } }
    },
    pj4Rod: {
      gnist: { l: 'Skab en ekstra ting til godnatten', to: 'pj4Rod', eff: function (h) { k.state.gnists++; k.state.gnistList.push({ key: 'magi_' + h.id + '_' + k.state.gnists, c: 'magiske', def: k.gen(h.name) + ' godnat', col: '#F2C94C', ph: 'Drøm', name: '' }); } },
      dyr: { l: 'Bed skovens dyr om at komme og synge', to: 'pj4EndVenner' },
      latter: { l: 'Strø latterstøv, så alle hvisker og fniser godnat', to: 'pj4EndHvisk' }
    }
  };

  /* Mester-valg: når en helt har 5 i et træk, åbner der sig et ekstra valg i scenen (uden terning). */
  var mester = {
    pj4Taage: [
      { stat: 'Mod', l: 'Gå forrest ind i tågen, og vis vejen', to: 'pj4TaageOk', n: function (n) { return n + ' går forrest ind i tågen, roligt og sikkert, og de andre følger lige efter.'; } },
      { stat: 'Nysgerrighed', l: 'Find de små sten, der viser, hvor stien går', to: 'pj4TaageOk', n: function (n) { return n + ' ser, at der ligger små, hvide sten langs stien. Dem følger I hele vejen.'; } }
    ],
    pj4Moll: [
      { stat: 'Fantasi', l: 'Digt hele det sidste vers på én gang', to: 'pj4MollOk', n: function (n) { return n + ' digter det sidste vers på én gang, så smukt, at Moll må pudse brillerne.'; } }
    ],
    pj4Mus: [
      { stat: 'List', l: 'Lav en lille fælde af en hue, der fanger alle fnuggene', to: 'pj4MusOk', n: function (n) { return n + ' holder en hue op mod vinden, og alle fnuggene flyver lige ned i den.'; } }
    ],
    pj4Raev: [
      { stat: 'Venlighed', l: 'Lov ræveungen, at I kommer og leger i sneen', to: 'pj4RaevOk', n: function (n) { return n + ' lover at komme og lege med ræveungen, når sneen kommer. Så ser den slet ikke trist ud mere.'; } }
    ],
    pj4Rod: []
  };
  k.stats.forEach(function (t) {
    mester.pj4Rod.push({ stat: t[0], l: 'Brug mester-trækket ' + t[0] + ' til at sige godnat', to: 'pj4EndMester', eff: function (h, stat) { k.state.mester = { name: h.name, stat: stat }; } });
  });

  /* Billeder til scenerne, tegnet med delene i art/dele.js (LK.art.scene). Koordinater i en ramme på 400 x 250. */
  var PJ = function (x, y, h, s) { return { navn: 'pind', x: x, y: y, skala: s || 0.65, humoer: h }; };
  var UF = function (x, y, h, s) { return { navn: 'uffe', x: x, y: y, skala: s || 0.65, humoer: h }; };
  var LYGTE = function (x, y, t) { return { navn: 'lanterne', x: x, y: y, taendt: t !== false, skala: 0.9 }; };
  var billeder = {
    pj4Start: { sted: 'vindue', himmel: 'nat', alt: 'Uffe sidder ved en tændt lanterne i vinduet, og udenfor står Pjuske og gaber.',
      ting: [{ navn: 'lanterne', x: 95, y: 165, taendt: true }],
      figurer: [{ navn: 'uffe', x: 150, y: 141, skala: 0.9, humoer: 'glad' }, { navn: 'pind', x: 268, y: 150, skala: 0.45, humoer: 'rolig' }] },
    pj4Liste: { sted: 'vindue', himmel: 'nat', alt: 'Pjuske viser sin krøllede liste på et stort egeblad.',
      ting: [{ navn: 'lanterne', x: 95, y: 165, taendt: true }, { navn: 'blade', x: 268, y: 100, skala: 0.5 }],
      figurer: [{ navn: 'uffe', x: 150, y: 141, skala: 0.9, humoer: 'glad' }, { navn: 'pind', x: 268, y: 150, skala: 0.45, humoer: 'glad' }] },
    pj4Hub: { sted: 'skovsti', himmel: 'nat', alt: 'Pjuske og Uffe går gennem den mørke skov med lanterner.',
      ting: [LYGTE(200, 218)],
      figurer: [PJ(160, 200, 'rolig'), UF(280, 178, 'glad', 0.65)] },
    pj4Taage: { sted: 'taage', himmel: 'nat', alt: 'En smal sti går ind i den hvide tåge, og langt inde lyser en lanterne.',
      ting: [{ navn: 'bladbunke', x: 70, y: 244, skala: 0.8 }, { navn: 'bladbunke', x: 330, y: 246, skala: 0.8 }, LYGTE(260, 120)],
      figurer: [PJ(160, 205, 'overrasket'), UF(245, 210, 'rolig', 0.5)] },
    pj4TaageOk: { sted: 'taage', himmel: 'nat', alt: 'Pjuske holder sin mormors gyldne lanterne i tågen.',
      ting: [{ navn: 'bladbunke', x: 70, y: 244, skala: 0.8 }, { navn: 'bladbunke', x: 330, y: 246, skala: 0.8 }, LYGTE(205, 160)],
      figurer: [PJ(170, 205, 'glad'), UF(250, 205, 'glad', 0.55)] },
    pj4TaageFejl: { sted: 'taage', himmel: 'nat', alt: 'Alle er plumpet ned i en stor bunke blade, og Pjuske griner.',
      ting: [{ navn: 'bladbunke', x: 200, y: 246, skala: 1.4 }, { navn: 'blade', x: 200, y: 175, skala: 0.7 }, LYGTE(320, 110)],
      figurer: [PJ(110, 205, 'glad'), UF(300, 205, 'overrasket', 0.55)] },
    pj4Moll: { sted: 'hule', himmel: 'nat', alt: 'Moll sidder foran sin hule med en lanterne og en sangbog.',
      ting: [{ navn: 'lanterne', x: 280, y: 220, taendt: true }, { navn: 'bog', x: 255, y: 234 }],
      figurer: [{ navn: 'moll', x: 200, y: 192, humoer: 'bekymret' }, PJ(85, 212, 'rolig', 0.55)] },
    pj4MollOk: { sted: 'hule', himmel: 'nat', alt: 'Moll skriver det sidste vers, og sangbogen gløder.',
      ting: [{ navn: 'lanterne', x: 280, y: 220, taendt: true }, { navn: 'bog', x: 255, y: 234, taendt: true }],
      figurer: [{ navn: 'moll', x: 200, y: 192, humoer: 'glad' }, PJ(85, 212, 'glad', 0.55)] },
    pj4MollFejl: { sted: 'hule', himmel: 'nat', alt: 'Moll griner, så brillerne næsten falder af, og Pjuske griner med.',
      ting: [{ navn: 'lanterne', x: 280, y: 220, taendt: true }, { navn: 'bog', x: 255, y: 234 }],
      figurer: [{ navn: 'moll', x: 200, y: 192, humoer: 'overrasket' }, PJ(85, 212, 'glad', 0.55)] },
    pj4Mus: { sted: 'lysning', himmel: 'nat', alt: 'Musene syr en lille pude, mens fnuggene flyver op i luften.',
      ting: [{ navn: 'snefald', x: 250, y: 110, skala: 0.45 }, LYGTE(90, 218)],
      figurer: [{ navn: 'mus', x: 220, y: 202, skala: 0.6, humoer: 'overrasket' }, { navn: 'mus', x: 280, y: 206, skala: 0.5, humoer: 'bekymret' }, PJ(140, 200, 'overrasket', 0.6)] },
    pj4MusOk: { sted: 'lysning', himmel: 'nat', alt: 'Puden af fnug er færdig, og musene smiler.',
      ting: [{ navn: 'gnist', x: 250, y: 150, taendt: true, farve: '#F4F1EA' }, LYGTE(90, 218)],
      figurer: [{ navn: 'mus', x: 220, y: 202, skala: 0.6, humoer: 'glad' }, { navn: 'mus', x: 280, y: 206, skala: 0.5, humoer: 'glad' }, PJ(140, 200, 'rolig', 0.6)] },
    pj4MusFejl: { sted: 'lysning', himmel: 'nat', alt: 'Fnuggene sidder over det hele, også på Uffes hoved, og musene griner.',
      ting: [{ navn: 'snefald', x: 200, y: 125, skala: 0.7 }],
      figurer: [{ navn: 'mus', x: 230, y: 202, skala: 0.6, humoer: 'glad' }, PJ(130, 200, 'glad', 0.6), UF(320, 190, 'overrasket', 0.6)] },
    pj4Raev: { sted: 'tornekrat', himmel: 'nat', alt: 'En lille ræveunge sidder under en busk og ser trist ud.',
      ting: [LYGTE(110, 218)],
      figurer: [{ navn: 'raev', x: 250, y: 200, skala: 0.55, humoer: 'bekymret' }, PJ(170, 205, 'rolig', 0.6)] },
    pj4RaevOk: { sted: 'tornekrat', himmel: 'nat', alt: 'Ræveungen sidder stolt og ret op som en rigtig vagt.',
      ting: [LYGTE(110, 218)],
      figurer: [{ navn: 'raev', x: 250, y: 200, skala: 0.55, humoer: 'glad' }, PJ(170, 205, 'glad', 0.6)] },
    pj4RaevFejl: { sted: 'tornekrat', himmel: 'nat', alt: 'Ræveungen er sprunget op og griner, fordi den er sulten.',
      ting: [LYGTE(110, 218)],
      figurer: [{ navn: 'raev', x: 260, y: 196, skala: 0.55, humoer: 'overrasket' }, PJ(170, 205, 'glad', 0.6)] },
    pj4Rod: { sted: 'slukkettrae', himmel: 'nat', alt: 'Pjuskes seng af blade ligger klar under det store træs rødder.',
      ting: [{ navn: 'bladbunke', x: 150, y: 240 }, LYGTE(255, 226)],
      figurer: [PJ(90, 206, 'rolig', 0.6), UF(320, 192, 'rolig', 0.6)] },
    pj4EndPut: { sted: 'lanternetrae', himmel: 'nat', alt: 'Pjuske sover i sin seng af blade, og lanternerne lyser over ham.',
      ting: [{ navn: 'bladbunke', x: 150, y: 240 }, LYGTE(230, 226)],
      figurer: [PJ(150, 214, 'rolig', 0.5), UF(320, 192, 'rolig', 0.6)] },
    pj4EndVenner: { sted: 'lanternetrae', himmel: 'nat', alt: 'Ræven, musen og kragen står med lanterner om Pjuskes seng og synger godnat.',
      ting: [{ navn: 'bladbunke', x: 200, y: 242 }, LYGTE(40, 226), LYGTE(360, 226)],
      figurer: [{ navn: 'raev', x: 85, y: 200, skala: 0.6 }, PJ(200, 216, 'rolig', 0.5), { navn: 'mus', x: 290, y: 212, skala: 0.5 }, { navn: 'krage', x: 335, y: 210, skala: 0.55 }] },
    pj4EndHvisk: { sted: 'lanternetrae', himmel: 'nat', alt: 'Pjuske sover stille, og Uffe lister væk med en lanterne.',
      ting: [{ navn: 'bladbunke', x: 150, y: 240 }, LYGTE(290, 226)],
      figurer: [PJ(150, 214, 'rolig', 0.5), UF(330, 192, 'rolig', 0.55)] },
    pj4EndMester: { sted: 'lanternetrae', himmel: 'nat', alt: 'Lanternetræet lyser blødt over Pjuskes seng.',
      ting: [{ navn: 'bladbunke', x: 150, y: 240, skala: 1.1 }, LYGTE(240, 226)],
      figurer: [PJ(150, 212, 'rolig', 0.5), UF(320, 192, 'glad', 0.6)] }
  };

  return {
    id: '2026-11-pjuske-4', type: 'maaned', udgives: '2026-11-27',
    serie: { id: '2026-11-pjuske', titel: 'Pjuskes efterårsliste' }, kapitel: 4, kapitler: 4,
    start: 'pj4Start', title: 'Godnat, Pjuske', tag: 'November',
    blurb: 'I aften skal Pjuske gå i hi. Kan I give ham den bedste godnat, før han sover hele vinteren?',
    scenes: scenes, magi: magi, mester: mester, billeder: billeder
  };
});
