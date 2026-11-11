// Del 4: Lanternefesten. Historiefil: registrerer sig med LK.addStory og får kit-hjælperne som k.
LK.addStory(function (k) {
  var scenes = {
    f1: {
      title: 'Invitationer', lit: 2,
      text: function () {
        var t = ['Morgenen efter, at Vinden har fået lov at lege, sidder Uffe på jeres vindueskarm med en lille fjerpen i kloen. &laquo;Hu-hu! Nu skal Vinden sige undskyld til hele skoven,&raquo; siger han. &laquo;Og den bedste måde at sige undskyld på er med en fest!&raquo;',
          'Lanterneskoven skal have lanterner, musik og gæster. Og Vinden står genert bag et træ og kigger på jer.'];
        var fr = k.crew();
        if (fr.length) t.push('&laquo;' + k.joinNames(fr) + ' vil gerne hjælpe,&raquo; siger Uffe.');
        if (k.state.flags.maaneVen) t.push('Højt oppe på himlen blinker Månen. Den har allerede lovet at komme.');
        return t;
      },
      ask: 'Hvordan holder man en god fest for dem, man har gjort kede af det?',
      choices: [{ label: 'Gå i gang med festen', to: 'f_lys' }, { label: 'Spørg Uffe, hvad der er vigtigst', to: 'f1b' }]
    },
    f1b: {
      title: 'Uffes festregel', lit: 2, gainFeather: true,
      text: ['&laquo;Den vigtigste regel til en fest,&raquo; siger Uffe, &laquo;er, at alle skal have lov at være med. Også dem, der er lidt bange.&raquo;',
        'Han plukker en lysende fjer af sin vinge. &laquo;Tag den med. Den giver held til festen. Brug den, når I slår med terningen.&raquo;'],
      ask: 'Hvordan kan man få en, der er genert, til at føle sig velkommen?',
      choices: [{ label: 'Tak, Uffe! Lad os holde fest', to: 'f_lys' }]
    },
    f_lys: {
      title: 'Lanterner til festen', lit: 3,
      text: ['Først skal der lys til. Lanternerne hænger højt i træerne, og mange af dem er blevet bøjede og skæve af Vindens leg. Der er hundredvis, og de skal rettes op, pudses og tændes.'],
      ask: 'Hvordan gør man et stort arbejde lettere?',
      dyn: function () {
        function R(stat, label, t) { return { label: label, roll: { stat: stat, target: t || 6, win: 'f_lysOk', lose: 'f_lysFejl', flag: 'tutVen', flagTxt: 'fordi Tuts svampe lyser op' } }; }
        var c = [R('List', 'Byg en stige af grene og reb'), R('Mod', 'Klatr op i træerne med en rygsæk fuld af lanterner', 7), R('Fantasi', 'Mal en stjernehimmel på lanternerne med fingrene')];
        k.availG().forEach(function (n) { c.push({ label: 'Bed ' + n + ' om at tænde de højeste lanterner', to: 'f_lysGnist', use: n }); });
        c.push({ label: 'Bed Tuts lysende svampe stå som lamper langs stien', to: 'f_lysOk', lock: function () { return k.state.flags.tutVen ? null : 'Kræver at I har hjulpet Tut'; } });
        return c;
      }
    },
    f_lysOk: {
      title: 'Skoven lyser', lit: 3,
      text: ['Lanterne efter lanterne bliver rettet op og tændt, til hele skoven ligner en stjernehimmel på jorden. Vinden hjælper med at blæse så blidt, at lysene bare danser.'],
      ask: 'Hvad er det flotteste, I har set, når det var mørkt?',
      next: 'f_musik'
    },
    f_lysFejl: {
      title: 'Skæve lanterner', lit: 3,
      text: ['Nogle lanterner kommer til at hænge skævt, og andre med bunden i vejret. Uffe kigger på dem med hovedet på skrå. &laquo;Hu-hu! De ser faktisk ret sjove ud,&raquo; siger han.',
        'Og det gør de. Skoven lyser, bare lidt mere pudsigt end før.'],
      ask: 'Er noget stadig flot, selvom det ikke blev perfekt?',
      next: 'f_musik'
    },
    f_lysGnist: {
      title: 'Gnisten tænder', lit: 3,
      text: function () {
        var n = k.state.lastUse || 'Gnisten';
        return [n + ' svæver op til de højeste grene og tænder lanterne efter lanterne med et lille kys. Hver gang klinger det som et lille &laquo;ding&raquo;.',
          n + ' bliver helt træt og kravler ned i jeres lomme for at sove.'];
      },
      ask: 'Hvem hjælper jer, når I ikke kan nå det alene?',
      next: 'f_musik'
    },
    f_musik: {
      title: 'Musik til festen', lit: 4,
      text: ['Til en rigtig fest hører der musik. Men skoven er helt stille, for ingen har turdet synge, siden Vinden blæste. I kan høre jeres egne skridt og ikke andet.'],
      ask: 'Hvilken lyd bliver I allermest glade for?',
      dyn: function () {
        function R(stat, label, t) { return { label: label, roll: { stat: stat, target: t || 6, win: 'f_musikOk', lose: 'f_musikFejl', flag: 'nusseVen', flagTxt: 'fordi Nusse har lånt jer sin fløjte' } }; }
        var c = [R('Humor', 'Lav en vild lydorkester med frøer, krager og tudser'), R('Venlighed', 'Bed alle om at nynne en stille sang sammen'), R('Nysgerrighed', 'Find alle de ting i skoven, der kan lave lyde')];
        k.availG().forEach(function (n) { c.push({ label: 'Bed ' + n + ' om at klinge som en lille klokke', to: 'f_musikGnist', use: n }); });
        c.push({ label: 'Bed Månen lyse, så alle kan se at danse', to: 'f_musikOk', lock: function () { return k.state.flags.maaneVen ? null : 'Kræver at I har hjulpet Månen'; } });
        return c;
      }
    },
    f_musikOk: {
      title: 'Skoven synger', lit: 4,
      text: ['Først er det kun én tone. Så kommer der en til, og en til, indtil hele skoven er fuld af melodi. Træerne rasler i takt, frøerne kvækker, og Vinden fløjter med.'],
      ask: 'Hvilken sang kan I alle sammen?',
      next: 'f_gaester'
    },
    f_musikFejl: {
      title: 'Skæve toner', lit: 4,
      text: ['Det lyder som en kat i en tromme. Men så begynder en krage at synge med, og så en frø, og så en ugle, og pludselig bliver det bedre og bedre.',
        '&laquo;Det er ikke perfekt,&raquo; siger Uffe, &laquo;men det er jeres.&raquo;'],
      ask: 'Hvorfor er det sjovere at synge sammen end alene?',
      next: 'f_gaester'
    },
    f_musikGnist: {
      title: 'Klokkeklang', lit: 4,
      text: function () {
        var n = k.state.lastUse || 'Gnisten';
        return [n + ' svæver rundt og klinger som den allermindste klokke. Frøerne, kragerne og tudserne falder ind, til hele skoven spiller.',
          n + ' gaber stort og kravler ned i jeres lomme for at sove.'];
      },
      ask: 'Hvad er den smukkeste lyd, I kender?',
      next: 'f_gaester'
    },
    f_gaester: {
      title: 'Gæsterne', lit: 4,
      text: ['Nu skal gæsterne komme. I banker på hos ræve, mus, pindsvin og ugler, men de fleste tør ikke komme.',
        '&laquo;Vinden har blæst mit tag af,&raquo; siger en lille mus. &laquo;Hvad hvis den gør det igen?&raquo;'],
      ask: 'Hvad hjælper, når man er bange for noget, der engang gjorde ondt?',
      dyn: function () {
        function R(stat, label, t) { return { label: label, roll: { stat: stat, target: t || 6, win: 'f_gaesterOk', lose: 'f_gaesterFejl', flag: 'mollLoefte', flagTxt: 'fordi Moll fortæller de andre, hvor rart det er' } }; }
        var c = [R('Venlighed', 'Fortæl, at Vinden har skrevet et brev og vil sige undskyld'), R('Mod', 'Gå sammen med de bange gæster hele vejen til festen', 7), R('Humor', 'Lav en invitation som en pudsig sang')];
        c.push({ label: 'Lad Nusse fortælle, hvordan det er at være bange', to: 'f_gaesterOk', lock: function () { return (k.state.flags.nusseVen || k.state.flags.nusseHonning) ? null : 'Kræver at I har hjulpet Nusse'; } });
        return c;
      }
    },
    f_gaesterOk: {
      title: 'Alle kommer', lit: 4,
      text: function () {
        var t = ['Én efter én titter de frem: ræve, mus, pindsvin og ugler. Den lille mus går forrest, og de andre følger lige efter.'];
        if (k.state.flags.nusseVen || k.state.flags.nusseHonning) t.push('Nusse går ved siden af den lille mus og holder den i hånden. &laquo;Jeg var også bange,&raquo; siger han. &laquo;Men det bliver bedre.&raquo;');
        return t;
      },
      ask: 'Hvordan føles det at komme ind til en fest, hvor man ikke kender nogen?',
      next: 'f_fest'
    },
    f_gaesterFejl: {
      title: 'Kun en enkelt', lit: 4,
      text: ['Kun den lille mus tør komme med. Men den fortæller de andre, hvor sjovt der er, og snart kommer de listende, én efter én.'],
      ask: 'Er det i orden at komme senere end de andre?',
      next: 'f_fest'
    },
    f_fest: {
      title: 'Festen', lit: 5,
      text: function () {
        var t = ['Skoven lyser, musikken spiller, og gæsterne står i en stor rundkreds. Midt i cirklen står Vinden, helt lille. Alle kigger på den.',
          '&laquo;Jeg&hellip; jeg vil gerne sige undskyld,&raquo; hvisker Vinden. &laquo;Jeg slukkede jeres lanterner, fordi jeg var ensom. Jeg lover at blæse blidt.&raquo; Så bliver der helt stille.'];
        var fr = k.crew();
        if (fr.length) t.push(k.joinNames(fr) + ' smiler til Vinden.');
        return t;
      },
      ask: 'Hvad siger man, når nogen siger undskyld?',
      dyn: function () {
        function R(stat, label, key, win, t) { return { label: label, key: key, roll: { stat: stat, target: t || 6, win: win, lose: 'f_festFejl', flag: 'vindVen', flagTxt: 'fordi Vinden stoler på jer' } }; }
        var c = [R('Venlighed', 'Sig, at alle laver fejl, og at Vinden hører til i skoven', 'ff1', 'f_endTilgiv'), R('Humor', 'Bed Vinden puste tryllebobler til alle', 'ff2', 'f_endDans'), R('Fantasi', 'Bed Vinden bære lanternerne op som lysende balloner', 'ff3', 'f_endLys')];
        c.push({ label: 'Lad alle venner synge for Vinden', to: 'f_endVenner', lock: function () { return k.friendCount() >= 2 ? null : 'Kræver to venner, I har hjulpet'; } });
        c.push({ label: 'Sæt jer i græsset og vær stille sammen med Vinden', to: 'f_endStille' });
        return c;
      }
    },
    f_festFejl: {
      title: 'Stille i rundkredsen', lit: 5,
      text: ['Ingen siger noget. Vinden kigger ned, og lanternerne holder helt stille. Så rækker den lille mus en pote frem. &laquo;Det kan vi nok godt prøve,&raquo; siger den med en tynd stemme.',
        'Uffe hvisker: &laquo;Prøv igen. Man skal sige det, man mener.&raquo;'],
      ask: 'Hvorfor er det svært at sige noget, når alle kigger?',
      next: 'f_fest'
    },
    f_endTilgiv: {
      title: 'Plads til alle', end: true, all: true,
      text: function () {
        var t = ['Den lille mus træder frem. &laquo;Alle kan blæse forkert engang imellem,&raquo; siger den. Og så nikker gæsterne, én efter én.',
          'Vinden bliver så lettet, at den sender en blød brise gennem alle lanterner, så de svajer, som lå de i en vugge. Musikken begynder igen, og denne gang danser Vinden med.'];
        if (k.state.flags.maaneVen) t.push('Månen kigger ned og lægger sølvlys over hele festen.');
        t.push('Uffe sidder på den laveste gren og ser ud over skoven. &laquo;Jeg fandt hjem i aften,&raquo; hvisker han. &laquo;Det var ikke et træ. Det var jer.&raquo;');
        return t;
      },
      ask: 'Hvem har givet jer en ny chance?'
    },
    f_endDans: {
      title: 'Skovens dans', end: true, all: true,
      text: function () {
        var t = ['Vinden puster store, skinnende tryllebobler, som svæver op mellem lanternerne og spejler hele skoven. Først tøver gæsterne, så begynder den lille mus at danse, og snart danser alle.',
          'Vinden løfter dansende blade i spiraler, og lanternerne blinker i takt med musikken.'];
        if (k.availG().length) t.push(k.joinNames(k.availG()) + ' danser med som små stjerner.');
        t.push('&laquo;Hu-hu!&raquo; råber Uffe. &laquo;Nu er Lanterneskoven helt tændt igen, og ingen er alene!&raquo;');
        return t;
      },
      ask: 'Hvad er den sjoveste dans, I kender?'
    },
    f_endLys: {
      title: 'Lanterner i luften', end: true, all: true,
      text: function () {
        var t = ['Vinden løfter lanternerne forsigtigt af grenene og lader dem svæve op i luften som lysende balloner. Alle gæsterne tager sig til munden. Aldrig har skoven set noget så smukt.',
          'Så lader Vinden dem dale blidt tilbage på deres grene, én efter én, uden at ét eneste lys går ud.'];
        if (k.availG().length) t.push(k.joinNames(k.availG()) + ' danser rundt om lanternerne som en lysende krans.');
        t.push('&laquo;Se,&raquo; siger Uffe stille. &laquo;Når Vinden bærer lyset, i stedet for at slukke det, bliver det endnu mere magisk.&raquo;');
        return t;
      },
      ask: 'Hvad kan man gøre af noget, der før gik galt?'
    },
    f_endVenner: {
      title: 'Alle sammen', end: true, all: true,
      text: function () {
        return ['I peger på de venner, I har mødt undervejs. ' + k.joinNames(k.crew()) + ' træder frem og begynder at synge for Vinden. Først tyndt, så højt, så alle gæsterne falder ind.',
          'Vinden lytter med lukkede øjne. Til sidst blæser den en lille, blid vindstrøg gennem alle lanterner, så de klinger som klokker.',
          '&laquo;Hu-hu!&raquo; siger Uffe. &laquo;Det er det smukkeste, jeg har hørt i hele mit liv.&raquo;'];
      },
      ask: 'Hvilken sang ville I synge for jeres bedste ven?'
    },
    f_endStille: {
      title: 'Den stille undskyldning', end: true, all: true,
      text: ['I sætter jer i græsset omkring Vinden uden at sige noget. Gæsterne ser på jer og sætter sig også, én efter én, til hele rundkredsen sidder i den bløde nat.',
        'Til sidst lægger en lille, blød brise sig om alle som et tæppe. &laquo;Tak, fordi I ikke løb væk,&raquo; hvisker Vinden. Og lanternerne lyser stille og roligt videre.',
        'Uffe lægger hovedet på skrå og smiler. &laquo;Nu er der ro i skoven igen,&raquo; hvisker han.'],
      ask: 'Hvornår føles det rart bare at sidde stille sammen?'
    }
  };

  var magi = {
    f_lys: {
      gnist: { l: 'Skab en gnist, der tænder de højeste lanterner', to: 'f_lysGnist', eff: function (h) { k.state.lastUse = k.gen(h.name) + ' gnist'; } },
      dyr: { l: 'Bed ugler og flagermus hjælpe med de højeste grene', to: 'f_lysOk' },
      syn: { l: 'Se, hvilke lanterner der er ødelagte, og ret dem først', to: 'f_lysOk' },
      latter: { l: 'Strø latterstøv, så alle får lyst til at hjælpe', to: 'f_lysOk' }
    },
    f_musik: {
      gnist: { l: 'Skab en gnist, der klinger som en lille klokke', to: 'f_musikGnist', eff: function (h) { k.state.lastUse = k.gen(h.name) + ' gnist'; } },
      dyr: { l: 'Bed krager og frøer om at synge sammen', to: 'f_musikOk' },
      syn: { l: 'Se, hvilke ting i skoven der kan klinge', to: 'f_musikOk' },
      latter: { l: 'Strø latterstøv, så alle får lyst til at synge', to: 'f_musikOk' }
    },
    f_gaester: {
      gnist: { l: 'Skab en gnist, der følger de bange gæster hele vejen', to: 'f_gaesterOk' },
      dyr: { l: 'Tal blidt med de bange dyr på deres eget sprog', to: 'f_gaesterOk' },
      syn: { l: 'Se, hvad hver enkelt gæst er mest bange for', to: 'f_gaesterOk' },
      latter: { l: 'Strø latterstøv, så de bange gæster får lyst til at komme', to: 'f_gaesterOk' }
    },
    f_fest: {
      gnist: { l: 'Skab en gnist, der danser ved siden af Vinden', to: 'f_endLys', eff: function (h) { k.state.gnisterIn.push(k.gen(h.name) + ' gnist'); } },
      dyr: { l: 'Bed alle dyrene sige noget pænt til Vinden', to: 'f_endTilgiv' },
      syn: { l: 'Se, at hele skoven faktisk allerede har tilgivet Vinden', to: 'f_endTilgiv' },
      latter: { l: 'Strø latterstøv, så alle begynder at danse', to: 'f_endDans' }
    }
  };

  var mester = {
    f_lys: [
      { stat: 'List', l: 'Lav et system, hvor alle har deres egen række lanterner', to: 'f_lysOk', n: function (n) { return n + ' deler alle op i hold, så hver har sin egen række af lanterner at passe. Pludselig går det som en leg.'; } },
      { stat: 'Mod', l: 'Klatr op i det højeste træ og tænd den øverste lanterne', to: 'f_lysOk', n: function (n) { return n + ' klatrer helt op i det højeste træ og tænder den øverste lanterne. Så følger de andre efter.'; } },
      { stat: 'Fantasi', l: 'Kald på lanternerne, som var de små drager', to: 'f_lysOk', n: function (n) { return n + ' kalder på lanternerne, som var de små drager. Én efter én svæver de ned og lader sig tænde.'; } }
    ],
    f_musik: [
      { stat: 'Humor', l: 'Fortæl en vittighed, så alle griner i takt', to: 'f_musikOk', n: function (n) { return n + ' fortæller en vittighed, hvor alle grin kommer i takt, og pludselig er latteren selv blevet til musik.'; } },
      { stat: 'Venlighed', l: 'Bed den mindste i skoven om at starte sangen', to: 'f_musikOk', n: function (n) { return n + ' beder den mindste mus om at starte sangen. Hun synger tyndt og sødt, og alle de andre falder ind.'; } },
      { stat: 'Nysgerrighed', l: 'Find en hul stamme, der kan spille som en tromme', to: 'f_musikOk', n: function (n) { return n + ' finder en gammel, hul stamme og opdager, at den lyder som den fineste tromme. Snart svarer hele skoven.'; } }
    ],
    f_gaester: [
      { stat: 'Venlighed', l: 'Lyt til alle de bange, til de selv vil komme', to: 'f_gaesterOk', n: function (n) { return n + ' sætter sig blidt hos hver eneste bange gæst og lytter, til de er klar. Én efter én rejser de sig og går med.'; } },
      { stat: 'Mod', l: 'Gå forrest og bær den lille mus hele vejen', to: 'f_gaesterOk', n: function (n) { return n + ' løfter den lille mus op på skulderen og går forrest. Så tør de andre også.'; } },
      { stat: 'Humor', l: 'Lav en invitation som en sjov sang', to: 'f_gaesterOk', n: function (n) { return n + ' laver en invitation som en pudsig sang, og alle de bange gæster kommer hoppende efter.'; } }
    ],
    f_fest: [
      { stat: 'Venlighed', l: 'Tag Vindens hånd, og sig, at den er en del af skoven', to: 'f_endTilgiv', n: function (n) { return n + ' tager Vindens usynlige hånd og siger, at Vinden er en del af skoven lige så meget som alle andre.'; } },
      { stat: 'Humor', l: 'Bed Vinden puste en tryllebobbel til hver gæst', to: 'f_endDans', n: function (n) { return n + ' beder Vinden om at puste store, skinnende tryllebobler, og snart danser alle rundt mellem dem.'; } },
      { stat: 'Fantasi', l: 'Foreslå, at Vinden løfter lanternerne som balloner', to: 'f_endLys', n: function (n) { return n + ' foreslår, at Vinden løfter lanternerne op som balloner. Vinden prøver, og det virker.'; } }
    ]
  };

  /* Billeder til scenerne, tegnet med delene i art/dele.js (LK.art.scene). Koordinater i en ramme på 400 x 250. */
  var billeder = {
    f1: { sted: 'vindue', himmel: 'dag', alt: 'Uffe sidder på vindueskarmen og vil holde fest, og udenfor kigger Vinden genert frem bag et træ.',
      ting: [{ navn: 'brev', x: 95, y: 176, taendt: true }],
      figurer: [{ navn: 'uffe', x: 180, y: 141, skala: 0.9, humoer: 'glad' }, { navn: 'vinden', x: 285, y: 140, skala: 0.35, humoer: 'bekymret' }] },
    f1b: { sted: 'vindue', himmel: 'dag', alt: 'Uffe sidder på vindueskarmen og fortæller festens vigtigste regel: alle skal have lov at være med.',
      ting: [{ navn: 'brev', x: 95, y: 176 }, { navn: 'brev', x: 300, y: 176 }],
      figurer: [{ navn: 'uffe', x: 200, y: 141, skala: 0.9, humoer: 'rolig' }] },
    f_lys: { sted: 'lysning', himmel: 'skumring', alt: 'Lanternerne hænger slukkede og skæve højt oppe i træerne.',
      ting: [{ navn: 'lanterne', x: 60, y: 125 }, { navn: 'lanterne', x: 340, y: 130 }, { navn: 'lanterne', x: 380, y: 150, skala: 0.8 }, { navn: 'lanterne', x: 25, y: 150, skala: 0.8 }],
      figurer: [{ navn: 'uffe', x: 200, y: 180, skala: 0.8, humoer: 'bekymret' }] },
    f_lysOk: { sted: 'festplads', himmel: 'aften', alt: 'Alle lanternerne er tændt, og Vinden blæser så blidt, at lysene danser.',
      ting: [{ navn: 'lanterne', x: 30, y: 140, taendt: true }, { navn: 'lanterne', x: 370, y: 140, taendt: true }],
      figurer: [{ navn: 'vinden', x: 200, y: 150, skala: 0.6, humoer: 'glad' }, { navn: 'uffe', x: 110, y: 186, skala: 0.7, humoer: 'glad' }] },
    f_lysFejl: { sted: 'lysning', himmel: 'aften', alt: 'Lanternerne lyser, men hænger lidt pudsigt, og Uffe lægger hovedet på skrå.',
      ting: [{ navn: 'lanterne', x: 60, y: 110, taendt: true }, { navn: 'lanterne', x: 340, y: 150, taendt: true }, { navn: 'lanterne', x: 380, y: 120, skala: 0.8, taendt: true }, { navn: 'lanterne', x: 25, y: 155, skala: 0.8, taendt: true }],
      figurer: [{ navn: 'uffe', x: 200, y: 180, skala: 0.8, humoer: 'rolig' }] },
    f_lysGnist: { sted: 'lysning', himmel: 'skumring', alt: 'En gnist flyver op i træerne og tænder lanterne efter lanterne.',
      ting: [{ navn: 'lanterne', x: 60, y: 125, taendt: true }, { navn: 'lanterne', x: 340, y: 130, taendt: true }, { navn: 'lanterne', x: 380, y: 150, skala: 0.8 }, { navn: 'gnist', x: 300, y: 105, taendt: true }],
      figurer: [{ navn: 'uffe', x: 200, y: 180, skala: 0.8, humoer: 'glad' }] },
    f_musik: { sted: 'lysning', himmel: 'skumring', alt: 'Skoven er helt stille, for ingen har turdet synge, siden Vinden blæste.',
      ting: [{ navn: 'lanterne', x: 60, y: 125, taendt: true }, { navn: 'lanterne', x: 340, y: 130, taendt: true }],
      figurer: [{ navn: 'uffe', x: 200, y: 180, skala: 0.8, humoer: 'bekymret' }] },
    f_musikOk: { sted: 'festplads', himmel: 'aften', alt: 'Hele skoven synger: kragen, Uffe og Vinden, der fløjter med.',
      figurer: [{ navn: 'vinden', x: 300, y: 145, skala: 0.55, humoer: 'glad' }, { navn: 'krage', x: 90, y: 182, skala: 0.8, humoer: 'glad' }, { navn: 'uffe', x: 185, y: 182, skala: 0.75, humoer: 'glad' }] },
    f_musikFejl: { sted: 'festplads', himmel: 'aften', alt: 'Tonerne er skæve, men kragen synger med, og det bliver bedre og bedre.',
      figurer: [{ navn: 'krage', x: 120, y: 182, skala: 0.8, humoer: 'overrasket' }, { navn: 'uffe', x: 280, y: 182, skala: 0.75, humoer: 'rolig' }] },
    f_musikGnist: { sted: 'festplads', himmel: 'aften', alt: 'En gnist klinger som en lille klokke, og kragen og Tut spiller med.',
      ting: [{ navn: 'gnist', x: 200, y: 140, skala: 1.2, taendt: true }],
      figurer: [{ navn: 'krage', x: 110, y: 182, skala: 0.8, humoer: 'glad' }, { navn: 'tut', x: 290, y: 190, skala: 0.75, humoer: 'glad' }] },
    f_gaester: { sted: 'skovsti', himmel: 'aften', alt: 'En lille mus tør ikke komme til festen, for Vinden har blæst hendes tag af.',
      figurer: [{ navn: 'mus', x: 300, y: 192, skala: 0.85, humoer: 'bekymret' }, { navn: 'uffe', x: 130, y: 180, skala: 0.8, humoer: 'rolig' }] },
    f_gaesterOk: { sted: 'festplads', himmel: 'aften', alt: 'Ræve, mus og pindsvin kommer til festen, og den lille mus går forrest.',
      figurer: [{ navn: 'mus', x: 140, y: 196, skala: 0.75 }, { navn: 'raev', x: 70, y: 182, skala: 0.8 }, { navn: 'pind', x: 230, y: 198, skala: 0.7 }, { navn: 'uffe', x: 330, y: 182, skala: 0.75, humoer: 'glad' }] },
    f_gaesterFejl: { sted: 'skovsti', himmel: 'aften', alt: 'Kun den lille mus tør komme, men hun fortæller de andre, hvor sjovt der er.',
      figurer: [{ navn: 'mus', x: 300, y: 192, skala: 0.85, humoer: 'glad' }, { navn: 'uffe', x: 130, y: 180, skala: 0.8, humoer: 'glad' }] },
    f_fest: { sted: 'festplads', himmel: 'aften', alt: 'Gæsterne står i en rundkreds, og midt i står Vinden, helt lille, og vil sige undskyld.',
      figurer: [{ navn: 'vinden', x: 200, y: 150, skala: 0.5, humoer: 'bekymret' }, { navn: 'raev', x: 55, y: 182, skala: 0.75, humoer: 'rolig' }, { navn: 'mus', x: 120, y: 198, skala: 0.7, humoer: 'overrasket' },
        { navn: 'pind', x: 280, y: 200, skala: 0.65, humoer: 'overrasket' }, { navn: 'uffe', x: 345, y: 184, skala: 0.7, humoer: 'rolig' }] },
    f_festFejl: { sted: 'festplads', himmel: 'skumring', alt: 'Der er helt stille i rundkredsen, og Vinden kigger ned.',
      figurer: [{ navn: 'vinden', x: 200, y: 165, skala: 0.45, humoer: 'bekymret' }, { navn: 'raev', x: 55, y: 182, skala: 0.75, humoer: 'bekymret' }, { navn: 'mus', x: 125, y: 198, skala: 0.7, humoer: 'rolig' },
        { navn: 'pind', x: 280, y: 200, skala: 0.65, humoer: 'bekymret' }, { navn: 'uffe', x: 345, y: 184, skala: 0.7, humoer: 'bekymret' }] },
    f_endTilgiv: { sted: 'festplads', himmel: 'aften', alt: 'Gæsterne tilgiver Vinden, og den danser med, mens musikken spiller.',
      figurer: [{ navn: 'vinden', x: 200, y: 145, skala: 0.6, humoer: 'glad' }, { navn: 'raev', x: 55, y: 182, skala: 0.75 }, { navn: 'mus', x: 125, y: 198, skala: 0.7 },
        { navn: 'pind', x: 280, y: 200, skala: 0.65 }, { navn: 'uffe', x: 345, y: 184, skala: 0.7, humoer: 'glad' }] },
    f_endDans: { sted: 'festplads', himmel: 'aften', alt: 'Alle danser, og Vinden løfter bladene i spiraler, mens lanternerne blinker.',
      ting: [{ navn: 'blade', x: 200, y: 125, skala: 1.1 }],
      figurer: [{ navn: 'vinden', x: 200, y: 125, skala: 0.55, humoer: 'glad' }, { navn: 'raev', x: 55, y: 182, skala: 0.75 }, { navn: 'mus', x: 125, y: 198, skala: 0.7 },
        { navn: 'pind', x: 280, y: 200, skala: 0.65 }, { navn: 'uffe', x: 345, y: 184, skala: 0.7, humoer: 'glad' }] },
    f_endLys: { sted: 'festplads', himmel: 'aften', alt: 'Vinden lader lanternerne svæve op i luften som lysende balloner.',
      ting: [{ navn: 'lanterne', x: 120, y: 150, taendt: true }, { navn: 'lanterne', x: 200, y: 115, taendt: true }, { navn: 'lanterne', x: 280, y: 150, taendt: true }],
      figurer: [{ navn: 'vinden', x: 200, y: 175, skala: 0.45, humoer: 'glad' }, { navn: 'raev', x: 55, y: 182, skala: 0.75, humoer: 'overrasket' },
        { navn: 'mus', x: 345, y: 198, skala: 0.7, humoer: 'overrasket' }] },
    f_endVenner: { sted: 'festplads', himmel: 'aften', alt: 'Vennerne synger for Vinden, og den lytter med lukkede øjne.',
      figurer: [{ navn: 'vinden', x: 200, y: 140, skala: 0.6, humoer: 'rolig' }, { navn: 'nusse', x: 70, y: 182, skala: 0.8 }, { navn: 'moll', x: 150, y: 198, skala: 0.7 },
        { navn: 'tut', x: 260, y: 196, skala: 0.7 }, { navn: 'uffe', x: 340, y: 184, skala: 0.7, humoer: 'glad' }] },
    f_endStille: { sted: 'festplads', himmel: 'skumring', alt: 'Alle sidder stille i rundkredsen, og en blød brise lægger sig om dem som et tæppe.',
      figurer: [{ navn: 'vinden', x: 200, y: 150, skala: 0.55, humoer: 'rolig' }, { navn: 'raev', x: 55, y: 182, skala: 0.75, humoer: 'rolig' }, { navn: 'mus', x: 125, y: 198, skala: 0.7, humoer: 'rolig' },
        { navn: 'pind', x: 280, y: 200, skala: 0.65, humoer: 'rolig' }, { navn: 'uffe', x: 345, y: 184, skala: 0.7, humoer: 'rolig' }] }
  };

  return {
    id: 'fest', start: 'f1', title: 'Lanternefesten', tag: 'Del 4 af 4',
    blurb: 'Skoven holder fest, så Vinden kan sige undskyld. Alle venner skal med.',
    scenes: scenes, magi: magi, mester: mester, billeder: billeder
  };
});
