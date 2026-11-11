// Månedens historier, december 2026: Julestjernen, kapitel 1 af 4: Kælkebakken. Historiefil: registrerer sig med LK.addStory og får kit-hjælperne som k.
// Et kapitel står for sig selv. Det må læse vennerne fra sagaen, men sætter aldrig venne-flag.
//
// Plan for serien: Uffe nyser, nissen Nusse taber sin kælk, og julestjernen til Lanternetræet springer i fire stykker.
// Hver fredag finder I ét stykke, og til skovens julefest sidder stjernen hel i toppen af Lanternetræet.
//  1. Kælkebakken (4. dec.): stykket ligger på toppen af den glatte bakke. Bevægelse: gå på line ad den smalle snevold.
//  2. Tut på Månesøen (11. dec.): stykket sidder på Tuts hat, og han kan ikke stoppe. I bliver på bredden. Bevægelse: stå på ét ben.
//  3. Molls julegåde (18. dec.): stykket er Molls lampe. Hjælp med julekortene, og gæt gåden. Bevægelse: bær kortkassen på hovedet.
//  4. Stjernen på træet (25. dec.): stykket er ræveungernes snemandsnæse, og stjernen kommer op. Bevægelse: list forbi Pjuske, der sover.
// Hvert kapitel kan spilles alene og slutter godt, med ét stykke fundet.
LK.addStory(function (k) {
  var PATHS = [
    { id: 'gran', to: 'js1Gran', label: 'Gå hen til den store gran, hvor der ikke er sne' },
    { id: 'mus', to: 'js1Mus', label: 'Følg den lille, pibende stemme ned til bækken' },
    { id: 'vold', to: 'js1Vold', label: 'Gå hen til den smalle snevold, hvor noget rødt blafrer' }
  ];
  // Det, I finder til turen op ad bakken, er en gnist med sit eget navn.
  var FUND = function (c, def, col, ph) { return { c: c, def: def, col: col, ph: ph }; };

  var MESTER_TXT = {
    Mod: function (n) { return n + ' går forrest op ad den glatte bakke, roligt og sikkert, og trækker et spor, de andre kan gå i. Helt oppe på toppen tager ' + n + ' stjernestumpen op af sneen og løfter den højt.'; },
    List: function (n) { return n + ' går op ad bakken i siksak, frem og tilbage, ligesom en bjergged. Så glider ingen, og snart står I alle sammen på toppen ved stumpen.'; },
    Venlighed: function (n) { return n + ' spørger bakken pænt, om I må komme op. Sneen knirker, som om den svarer ja, og hvert skridt bliver lidt mindre glat. På toppen ligger stumpen og venter.'; },
    Fantasi: function (n) { return n + ' tegner en lang trappe i sneen med en pind. &laquo;Nu er den der,&raquo; siger ' + n + ', og trin for trin går I op ad den tegnede trappe til stumpen.'; },
    Humor: function (n) { return n + ' laver en så sjov pingvingang, at bakken næsten griner. I vralter op efter hinanden og griner hele vejen til toppen, hvor stumpen blinker.'; },
    Nysgerrighed: function (n) { return n + ' kigger godt efter og opdager, at der er sten under sneen på den ene side af bakken. Dér er der ikke glat. I går op ad stenene og henter stumpen.'; }
  };

  // Venner fra sagaen, der kommer til kælkebakken. Historiens egne linjer i stedet for k.friendLines(), som er skrevet
  // til sagaen. Nusse er med hele vejen her og nævnes derfor ikke.
  function venneLinjer() {
    var f = k.state.flags, o = [];
    if (f.mollLoefte) o.push('Moll stikker hovedet op af sneen med en julekage i poten. &laquo;Hvad er det for en larm herude?&raquo; siger hun. &laquo;Nå, en stjerne. Så hjælper jeg.&raquo;');
    if (f.tutVen) o.push('Tut kommer glidende på sine nye skøjter og kører lige ind i en snedrive. PUF! &laquo;Jeg har ikke lært at stoppe endnu,&raquo; siger han inde fra sneen.');
    if (f.vindVen) o.push('Vinden puster blidt ned ad bakken og fejer et smalt spor fri for glat sne.');
    if (f.maaneVen) o.push('Månen står bleg på himlen og lyser på stumpen, så den blinker endnu mere.');
    return o;
  }

  var scenes = {
    js1Start: {
      title: 'Den første sne',
      text: function () {
        var t = ['Der er kommet sne i Lanterneskoven. Store, bløde fnug daler ned, og alle træerne har fået hvide huer på. Uffe sidder på jeres vindueskarm og har pustet sig helt op, så han ligner en lille, rund pude.',
          'Så banker det på ruden. Udenfor står nissen Nusse med en tom kælk og en hue fuld af sne. &laquo;Hjælp!&raquo; siger han. &laquo;Julestjernen til Lanternetræet er sprunget i fire stykker. Den skal være hel til skovens julefest!&raquo;'];
        if (k.state.flags.nusseVen) t.push('Så får Nusse øje på jer, og hele hans ansigt lyser op. &laquo;Det er jer! I hjalp mig i tornekrattet. Så ved jeg, at det nok skal gå.&raquo;');
        return t;
      },
      ask: 'Hvad er det bedste ved, at der kommer sne?',
      choices: [{ label: 'Tag huer og vanter på, og gå med Nusse', to: 'js1Hub' }, { label: 'Spørg Nusse, hvad der skete', to: 'js1Hvad' }]
    },
    js1Hvad: {
      title: 'Hat-sju!',
      text: ['Nusse kigger lidt skævt på Uffe. &laquo;Jeg kørte stjernen hen til træet på min kælk. Så nøs Uffe. Meget højt.&raquo;',
        '&laquo;HAT-SJU!&raquo; siger Uffe, bare for at vise, hvordan det lød. &laquo;Undskyld. Det var sneen, der kildede mig i næbbet.&raquo; Nusse hoppede af forskrækkelse, kælken susede af sted, og stjernen sprang i fire gyldne stumper, der fløj ud i sneen.',
        '&laquo;Én af dem fløj op på kælkebakken,&raquo; siger Nusse. &laquo;Vi tager én ad gangen.&raquo; Uffe plukker en lille fjer af sin vinge. &laquo;Tag den med. Den giver held. Brug den, når I slår med terningen.&raquo;'],
      gainFeather: true,
      ask: 'Er I nogensinde kommet til at lave noget i stykker ved et uheld? Hvad gjorde I så?',
      choices: [{ label: 'Det var et uheld, Uffe. Afsted!', to: 'js1Hub' }]
    },
    js1Hub: {
      title: 'Ved foden af bakken',
      text: function () {
        var g = k.state.gnists, v = k.state.visited.length;
        if (v === 0) return ['I står ved foden af den store kælkebakke. Helt oppe på toppen stikker noget gyldent op af sneen og blinker til jer. Det er en stjernestump!',
          'Uffe prøver at gå et skridt op. Han glider straks ned igen på halen. &laquo;Bakken er glat som en rutsjebane,&raquo; siger Nusse. &laquo;Vi må finde noget, der kan hjælpe os op.&raquo;'];
        var a = 'I kommer tilbage til foden af bakken. Stumpen blinker stadig deroppe, og Nusse trækker sin tomme kælk efter sig.';
        var b = g === 0 ? '&laquo;Vi har ikke fundet noget endnu,&raquo; siger Nusse. &laquo;Skal vi lede et sted til, eller prøve bakken alligevel?&raquo;'
          : g === 1 ? '&laquo;Det er en god begyndelse,&raquo; siger Nusse. &laquo;Men måske kan vi finde lidt mere. I bestemmer.&raquo;'
          : '&laquo;Nu har vi meget, der kan hjælpe,&raquo; siger Nusse. &laquo;Men jo mere, jo lettere. I bestemmer.&raquo;';
        var left = PATHS.filter(function (p) { return k.state.visited.indexOf(p.id) < 0; }).length + (k.state.visited.indexOf('raev') < 0 ? 1 : 0);
        return [a, b + (left === 0 ? ' Der er ikke flere steder at lede.' : '')];
      },
      ask: 'Hvordan kommer man op ad noget, der er glat og svært?',
      dyn: function () {
        var c = PATHS.filter(function (p) { return k.state.visited.indexOf(p.id) < 0; }).map(function (p) { return { label: p.label, to: p.to }; });
        if (k.state.visited.indexOf('raev') < 0) c.push({ label: 'Følg de små, fnisende fodspor rundt om bakken', to: 'js1Raev', lock: function () { return k.lockTxt('Nysgerrighed', 2); } });
        if (k.state.visited.length > 0) c.push({ label: 'Gå op ad bakken nu', to: 'js1Bakke' });
        return c;
      }
    },
    js1Gran: {
      title: 'Den store gran', path: 'gran',
      text: ['Under den store gran er der næsten ingen sne. Der ligger en bunke brede grangrene, som egernet har klippet af. &laquo;Dem kan man binde under støvlerne,&raquo; siger Nusse. &laquo;Så synker man ikke, og man glider ikke.&raquo;',
        'Men lige over bunken hænger en gren, der er tung af sne. Den vipper, hver gang I trækker vejret.'],
      ask: 'Hvordan henter man noget, uden at det hele vælter?',
      choices: [
        { label: 'Kryb forsigtigt ind under granen', roll: { stat: 'List', target: 6, win: 'js1GranOk', lose: 'js1GranFejl' } },
        { label: 'Spørg egernet, om I må låne grenene', roll: { stat: 'Venlighed', target: 6, win: 'js1GranOk', lose: 'js1GranFejl' } },
        { label: 'Hent grenene med en lang pind, som en fiskestang', roll: { stat: 'Fantasi', target: 6, win: 'js1GranOk', lose: 'js1GranFejl' } }
      ]
    },
    js1GranOk: {
      title: 'Snesko', gain: true, gnist: FUND('grønne', 'Grangrenene', '#4CAF6A', 'Nål'),
      text: ['I får fat i grenene, uden at et eneste fnug falder ned. Nusse binder dem under jeres støvler med snor. Nu har I snesko!',
        'I prøver at gå. Klap, klap, klap. &laquo;Hu-hu! I ligner ænder med alt for store fødder,&raquo; siger Uffe. Men I synker ikke ned, og I glider ikke.'],
      ask: 'Hvilket dyr ville I helst gå som i sneen?',
      next: 'js1Hub'
    },
    js1GranFejl: {
      title: 'Snebyge fra granen',
      text: ['Grenen vipper en lille smule for meget. PUF! Al sneen falder ned over jer på én gang. Nu står der tre små snemænd under granen, og de har jeres huer på.',
        'Uffe griner, så han må holde sig på maven. Grangrenene ligger dybt nede under sneen. &laquo;Vi finder noget andet,&raquo; siger Nusse og børster jer af. &laquo;Men I var meget fine som snemænd.&raquo;'],
      ask: 'Hvad er det sjoveste, der er sket for jer i sneen?',
      next: 'js1Hub'
    },
    js1Mus: {
      title: 'Musenes dør', path: 'mus',
      text: ['Nede ved bækken bor en musefamilie under en sten. Men sneen har lagt sig foran døren, og nu kan de ikke komme ud. &laquo;Piv! Hjælp!&raquo; lyder det inde fra sneen.',
        '&laquo;Vi har en pose grus derinde,&raquo; piber den mindste mus gennem et lille hul. &laquo;Det strør vi på vores sti, når den er glat. I må få lidt, hvis I hjælper os ud.&raquo;'],
      ask: 'Hvordan tror I, det er at være lukket inde af sne?',
      choices: [
        { label: 'Grav forsigtigt med vanterne', roll: { stat: 'Mod', target: 6, win: 'js1MusOk', lose: 'js1MusFejl' } },
        { label: 'Grav en lille tunnel ind til døren', roll: { stat: 'List', target: 6, win: 'js1MusOk', lose: 'js1MusFejl' } },
        { label: 'Syng en gravesang, så det går hurtigere', roll: { stat: 'Humor', target: 6, win: 'js1MusOk', lose: 'js1MusFejl' } }
      ]
    },
    js1MusOk: {
      title: 'Posen med grus', gain: true, gnist: FUND('brune', 'Posen med grus', '#C9A26B', 'Gryn'),
      text: ['Skovl for skovl bliver døren fri. Musene vælter ud i sneen og jubler. &laquo;Frisk luft!&raquo; piber de.',
        'Den mindste mus giver jer en lille pose grus. &laquo;Strø det foran jer, så glider I ikke,&raquo; siger hun. &laquo;Det virker hver gang. Næsten.&raquo;'],
      ask: 'Hvad tror I, musene laver inde under stenen, når det sner?',
      next: 'js1Hub'
    },
    js1MusFejl: {
      title: 'Snekamp',
      text: ['I graver og graver, men sneen flyver lige ind ad musenes dør. Snart har de en lille snebunke midt i stuen.',
        'Musene kigger på bunken. Så begynder de at kaste bittesmå snebolde efter hinanden og efter jer. Piv! Fnis! &laquo;Det er den bedste dag i år,&raquo; siger den mindste mus. &laquo;Men gruset skal vi selv bruge til vores glatte sti.&raquo;'],
      ask: 'Hvordan kan noget, der gik skævt, alligevel blive sjovt?',
      next: 'js1Hub'
    },
    js1Vold: {
      title: 'Den smalle snevold', path: 'vold',
      text: ['Her er en lang, smal snevold mellem to dybe snedriver. Helt ude for enden hænger Nusses lange, røde halstørklæde på en busk. Det blæste af, da kælken susede af sted.',
        '&laquo;Det er så langt, at vi kan bruge det som et reb op ad bakken,&raquo; siger Nusse. &laquo;Men gå forsigtigt. Ved siden af volden er sneen så blød, at man synker helt ned.&raquo;'],
      ask: 'Hvordan holder man balancen, når man skal gå et smalt sted?',
      choices: [
        { label: 'Gå hen ad volden, ét skridt ad gangen', bevaeg: { goer: 'Læg et snørebånd eller en tæppekant på gulvet. Det er den smalle snevold. Gå hen ad den, ét skridt ad gangen, uden at træde ved siden af.', stat: 'Mod', target: 6, win: 'js1VoldOk', lose: 'js1VoldFejl' } },
        { label: 'Bed Uffe flyve derhen og hente det', roll: { stat: 'Venlighed', target: 6, win: 'js1VoldOk', lose: 'js1VoldFejl' } },
        { label: 'Kast en snebold, så halstørklædet falder ned', roll: { stat: 'Nysgerrighed', target: 6, win: 'js1VoldOk', lose: 'js1VoldFejl' } }
      ]
    },
    js1VoldOk: {
      title: 'Det røde halstørklæde', gain: true, gnist: FUND('røde', 'Det røde halstørklæde', '#E0525A', 'Strik'),
      text: ['Skridt for skridt kommer I helt ud for enden af volden. Halstørklædet er koldt og stift af frost, men det er langt. Meget langt.',
        'Nusse vikler det rundt om halsen tre gange, og der hænger stadig en lang hale ned. &laquo;Det er mormors strik,&raquo; siger han stolt. &laquo;Det kan holde en hel kælk.&raquo;'],
      ask: 'Har I noget, som en i familien har lavet til jer?',
      next: 'js1Hub'
    },
    js1VoldFejl: {
      title: 'Plump!', flag: 'js1Plump',
      text: ['Halvvejs ude træder en fod ved siden af. PLUMP! I synker ned i den bløde sne, så kun jeres huer stikker op. Det er som at sidde i en stor, kold dyne.',
        'Nusse hiver jer op ved vanterne. I samme øjeblik kommer et vindpust og tager halstørklædet med op over træerne. &laquo;Det lander nok et sted,&raquo; siger Nusse og griner. &laquo;Og I så meget sjove ud med kun huerne oppe.&raquo;'],
      ask: 'Er det i orden at vakle, når man prøver noget svært? Hvad gør man så?',
      next: 'js1Hub'
    },
    js1Raev: {
      title: 'Ræveungen', path: 'raev',
      text: ['De små fodspor går rundt om bakken. Bag en busk sidder en lille ræveunge og fniser. &laquo;Jeg ved noget, I ikke ved,&raquo; siger den.',
        '&laquo;Der er en hemmelig sti op ad bakken på bagsiden. Der er ingen is, kun sten og grus. Men den viser jeg kun til nogen, der kan få mig til at grine.&raquo;'],
      ask: 'Hvad får jer altid til at grine?',
      choices: [
        { label: 'Lav sjove ræveører med vanterne', roll: { stat: 'Humor', target: 6, win: 'js1RaevOk', lose: 'js1RaevFejl' } },
        { label: 'Fortæl om dengang, Uffe nøs stjernen i stykker', roll: { stat: 'Fantasi', target: 6, win: 'js1RaevOk', lose: 'js1RaevFejl' } },
        { label: 'Spørg ræveungen, hvad den selv synes er sjovt', roll: { stat: 'Venlighed', target: 6, win: 'js1RaevOk', lose: 'js1RaevFejl' } }
      ]
    },
    js1RaevOk: {
      title: 'Den hemmelige sti', gain: true, gnist: FUND('hvide', 'Den hemmelige sti', '#F7EBD0', 'Pote'),
      text: ['Ræveungen griner, så den triller rundt i sneen. &laquo;I er sjove!&raquo; siger den. &laquo;Kom, jeg viser jer det.&raquo;',
        'Bag bakken går en lille sti op mellem stenene. Der er ingen is, og den er lige til små fødder. &laquo;Vi bygger en snemand i lysningen,&raquo; siger ræveungen. &laquo;Kom og se den en dag.&raquo;'],
      ask: 'Hvis I havde en hemmelig sti, hvor skulle den så føre hen?',
      next: 'js1Hub'
    },
    js1RaevFejl: {
      title: 'Hop, og væk',
      text: ['Lige da ræveungen skal til at grine, siger Uffe &laquo;HU-HU!&raquo; meget højt. Ræveungen bliver så forskrækket, at den hopper lige op i luften og løber hjem.',
        'Lidt efter stikker den hovedet frem bag en busk og fniser. &laquo;Du lød som en trompet,&raquo; siger den. Men den hemmelige sti vil den holde for sig selv i dag. Uffe kigger flovt ned på sine fødder.'],
      ask: 'Hvordan kan man sige undskyld til en, man kom til at forskrække?',
      next: 'js1Hub'
    },
    js1Bakke: {
      title: 'Op ad bakken',
      text: function () {
        var g = k.state.gnists;
        var a = 'I står ved foden af kælkebakken igen. Stjernestumpen blinker helt oppe på toppen, som om den vinker til jer. Nu er det nu.';
        var b = g >= 3 ? '&laquo;' + k.joinNames(k.gnistNames()) + '!&raquo; siger Nusse. &laquo;Med alt det kommer vi op, før man kan sige julegrød!&raquo;'
          : g >= 1 ? '&laquo;Vi har ' + k.joinNames(k.gnistNames()) + ',&raquo; siger Nusse. &laquo;Det skal nok hjælpe os op.&raquo;'
          : '&laquo;Vi fandt ikke noget,&raquo; siger Nusse og kigger op ad den glatte bakke. Uffe lægger en vinge om ham. &laquo;Men vi har hinanden. Måske kan skovens venner hjælpe.&raquo;';
        var t = [a, b];
        if (k.state.flags.js1Plump) t.push('Der er stadig sne i jeres støvler fra snevolden. Det knaser, hver gang I tripper, og Uffe fniser.');
        return t;
      },
      ask: 'Hvordan tror I, det føles at stå helt oppe på toppen?',
      dyn: function () {
        var c = [];
        if (k.state.gnists > 0) c.push({ label: 'Gå op ad bakken med det, I har fundet', to: 'js1EndOp' });
        c.push({ label: 'Råb på skovens venner', to: 'js1EndVenner' });
        c.push({ label: 'Lad Uffe flyve op efter stumpen', to: 'js1EndNys', lock: function () { return k.partyStat('Humor') >= 3 || k.partyStat('Fantasi') >= 3 ? null : 'Kræver Humor 3 eller Fantasi 3'; } });
        return c;
      }
    },
    js1EndOp: {
      title: 'Bakkestumpen', end: true, all: true,
      text: function () {
        var navne = k.joinNames(k.gnistNames());
        var t = ['Med ' + navne + ' går I op ad bakken. Skridt for skridt, og ingen glider. Helt oppe på toppen ligger stjernestumpen og lyser. Den hopper op i jeres vante og er varm som en kop kakao.',
          '&laquo;Hu-hu! Den første!&raquo; råber Uffe. Og så sætter I jer alle sammen på Nusses kælk og kører ned igen. Det går stærkt, og I griner hele vejen.'];
        t.push('Nusse lægger stumpen i en lille æske med vat. &laquo;Nu mangler vi tre,&raquo; siger han. &laquo;Næste fredag leder vi ved Månesøen.&raquo;');
        return t;
      },
      ask: 'Hvad var det bedste valg, I tog i dag?'
    },
    js1EndVenner: {
      title: 'En kæde af venner', end: true, all: true,
      text: function () {
        var fl = venneLinjer();
        var a = 'I råber ud i den hvide skov: &laquo;Vil nogen hjælpe os op ad bakken?&raquo; Først er alt stille. Så knaser det i sneen.';
        var slut = 'En ræv, tre mus og en krage kommer frem mellem træerne. I holder hinanden i hænderne, poterne og vingerne og går op ad bakken som en lang kæde. Når én glider, holder de andre fast. Helt oppe på toppen tager Nusse stumpen op. &laquo;Den blev fundet af venner,&raquo; hvisker han.';
        var t = fl.length ? [a, fl.join(' '), slut] : [a, slut];
        t.push('Bagefter kører alle ned på kælken på én gang. Det bliver en meget lang kælketur. Nusse lægger stumpen i sin æske. &laquo;Én fundet. Tre tilbage.&raquo;');
        return t;
      },
      ask: function () { return venneLinjer().length ? 'Hvem var I gladest for at se i dag?' : 'Hvornår har I sidst fået hjælp af en ven? Hvordan føltes det?'; }
    },
    js1EndNys: {
      title: 'Hat-sju igen', end: true, all: true,
      text: function () {
        var t = ['&laquo;Jeg flyver op og henter den,&raquo; siger Uffe. Han flyver op ad bakken, lander ved stumpen og stikker næbbet ned i sneen. Men sneen kilder.',
          '&laquo;HAT-SJU!&raquo; Stumpen hopper op af sneen og glider ned ad hele bakken, lige så hurtigt som en kælk. Den lander præcis i Nusses hue. PLING.'];
        if (k.state.gnists > 0) t.push('&laquo;Og vi som havde ' + k.joinNames(k.gnistNames()) + ' med!&raquo; griner Nusse. &laquo;Dem gemmer vi til en anden bakke.&raquo;');
        t.push('Uffe kommer flyvende ned og ser meget stolt ud. &laquo;Det var med vilje,&raquo; siger han. Ingen tror på ham, men alle synes, at han er god. Nusse lægger stumpen i sin æske. Én fundet, tre tilbage.');
        return t;
      },
      ask: 'Hvornår er et uheld endt med noget godt for jer?'
    },
    js1EndMester: {
      title: 'Mesterens vej', end: true, all: true,
      text: function () {
        var m = k.state.mester || { name: 'Jeres helt', stat: 'Mod' };
        var how = MESTER_TXT[m.stat] || MESTER_TXT.Mod;
        return [how(k.esc(m.name)), 'Stumpen er varm som en kop kakao. Så kører I alle sammen ned på Nusses kælk og griner hele vejen. &laquo;Den første!&raquo; siger Nusse og lægger den i sin æske. &laquo;Tre tilbage.&raquo;'];
      },
      ask: 'Hvad er I blevet rigtig gode til? Hvordan lærte I det?'
    }
  };

  var magi = {
    js1Gran: {
      gnist: { l: 'Skab en varm gnist, der smelter sneen på den tunge gren', to: 'js1GranOk' },
      dyr: { l: 'Spørg egernet, om det vil skubbe grenene ud til jer', to: 'js1GranOk' },
      syn: { l: 'Se de grene, der ligger løst helt ude i kanten', to: 'js1GranOk' },
      latter: { l: 'Strø latterstøv, så granen griner og holder på sin sne', to: 'js1GranOk' }
    },
    js1Mus: {
      gnist: { l: 'Skab en gnist, der smelter sneen foran døren', to: 'js1MusOk' },
      dyr: { l: 'Spørg musene, hvor sneen er blødest at grave i', to: 'js1MusOk' },
      syn: { l: 'Se musenes bagdør, som sneen har glemt', to: 'js1MusOk' },
      latter: { l: 'Strø latterstøv, så sneen griner og triller væk', to: 'js1MusOk' }
    },
    js1Vold: {
      gnist: { l: 'Skab små gnister, der lyser op, hvor volden er fast', to: 'js1VoldOk' },
      dyr: { l: 'Spørg en krage, om den vil hente halstørklædet', to: 'js1VoldOk' },
      syn: { l: 'Se den skjulte kant, hvor sneen er hård', to: 'js1VoldOk' },
      latter: { l: 'Strø latterstøv, så busken griner og ryster halstørklædet løs', to: 'js1VoldOk' }
    },
    js1Raev: {
      gnist: { l: 'Skab en gnist, der danser rundt om ræveungens næse', to: 'js1RaevOk' },
      dyr: { l: 'Fortæl ræveungen en rævevits på rævesprog', to: 'js1RaevOk' },
      syn: { l: 'Se den hemmelige sti mellem stenene', to: 'js1RaevOk' },
      latter: { l: 'Strø latterstøv over ræveungen', to: 'js1RaevOk' }
    },
    js1Hub: {
      syn: { l: 'Se de små fodspor, der fniser rundt om bakken', to: 'js1Raev', show: function () { return k.state.visited.indexOf('raev') < 0 && !!k.lockTxt('Nysgerrighed', 2); } }
    },
    js1Bakke: {
      gnist: { l: 'Skab en ekstra hjælper til turen op', to: 'js1Bakke', eff: function (h) { k.state.gnists++; k.state.gnistList.push({ key: 'magi_' + h.id + '_' + k.state.gnists, c: 'magiske', def: k.gen(h.name) + ' trappe', col: '#F2C94C', ph: 'Trin', name: '' }); } },
      dyr: { l: 'Bed skovens dyr om at hjælpe', to: 'js1EndVenner' },
      latter: { l: 'Strø latterstøv, så Uffe får lyst til at flyve', to: 'js1EndNys' }
    }
  };

  /* Mester-valg: når en helt har 5 i et træk, åbner der sig et ekstra valg i scenen (uden terning). */
  var mester = {
    js1Gran: [
      { stat: 'Nysgerrighed', l: 'Find de grene, der ligger løst i kanten', to: 'js1GranOk', n: function (n) { return n + ' kigger rundt om granen og finder grene, der ligger helt ude i kanten, langt fra den tunge gren.'; } }
    ],
    js1Mus: [
      { stat: 'Mod', l: 'Grav lige ind, så hurtigt og forsigtigt som en grævling', to: 'js1MusOk', n: function (n) { return n + ' graver så hurtigt og forsigtigt, at døren er fri, før musene når at sige piv.'; } },
      { stat: 'Venlighed', l: 'Hjælp musene med at grave indefra og udefra på samme tid', to: 'js1MusOk', n: function (n) { return n + ' råber til musene, så de graver indefra, mens I graver udefra. Midt i sneen mødes I.'; } }
    ],
    js1Vold: [
      { stat: 'List', l: 'Gå i de spor, Nusse lavede i morges', to: 'js1VoldOk', n: function (n) { return n + ' finder Nusses gamle fodspor på volden og går i dem, hvor sneen er hård.'; } }
    ],
    js1Raev: [
      { stat: 'Humor', l: 'Lav den sjoveste rævegrimasse, skoven har set', to: 'js1RaevOk', n: function (n) { return n + ' laver en grimasse med skæve ører og lang næse. Ræveungen griner, så den får hikke.'; } }
    ],
    js1Bakke: []
  };
  k.stats.forEach(function (t) {
    mester.js1Bakke.push({ stat: t[0], l: 'Brug mester-trækket ' + t[0] + ' til at komme op ad bakken', to: 'js1EndMester', eff: function (h, stat) { k.state.mester = { name: h.name, stat: stat }; } });
  });

  /* Billeder til scenerne, tegnet med delene i art/dele.js (LK.art.scene). Koordinater i en ramme på 400 x 250. */
  var SNE = { navn: 'snefald', x: 200, y: 125 };
  var driver = function (a, b) { return [{ navn: 'snedrive', x: a, y: 238 }, { navn: 'snedrive', x: b, y: 242, skala: 1.2 }]; };
  var STUMP = function (x, y, s) { return { navn: 'gnist', x: x, y: y, skala: s || 1, taendt: true }; };
  var NU = function (x, y, h, s) { return { navn: 'nusse', x: x, y: y, skala: s || 0.75, humoer: h }; };
  var UF = function (x, y, h, s) { return { navn: 'uffe', x: x, y: y, skala: s || 0.7, humoer: h }; };
  var billeder = {
    js1Start: { sted: 'vindue', himmel: 'dag', alt: 'Uffe sidder på vindueskarmen, og udenfor i sneen står Nusse med en tom kælk.',
      ting: [{ navn: 'snefald', x: 200, y: 100, skala: 0.65 }],
      figurer: [{ navn: 'uffe', x: 145, y: 141, skala: 0.9, humoer: 'overrasket' }, { navn: 'nusse', x: 270, y: 142, skala: 0.5, humoer: 'bekymret' }] },
    js1Hvad: { sted: 'vindue', himmel: 'dag', alt: 'Uffe ser lidt flov ud, mens Nusse fortæller om nyset, der fik kælken til at suse af sted.',
      ting: [{ navn: 'snefald', x: 200, y: 100, skala: 0.65 }],
      figurer: [{ navn: 'uffe', x: 145, y: 141, skala: 0.9, humoer: 'bekymret' }, { navn: 'nusse', x: 270, y: 142, skala: 0.5, humoer: 'rolig' }] },
    js1Hub: { sted: 'bjerg', himmel: 'dag', alt: 'Helt oppe på den glatte bakke blinker en gylden stjernestump i sneen.',
      ting: [{ navn: 'snedrive', x: 80, y: 236 }, { navn: 'snedrive', x: 330, y: 240 }, STUMP(262, 100), SNE],
      figurer: [NU(100, 196, 'bekymret'), UF(300, 186, 'overrasket')] },
    js1Gran: { sted: 'skovsti', himmel: 'dag', alt: 'Under den store gran ligger grangrene, og en gren er tung af sne.',
      ting: driver(70, 330).concat([{ navn: 'gren', x: 205, y: 226 }, SNE]),
      figurer: [NU(110, 194, 'rolig'), UF(300, 186, 'bekymret')] },
    js1GranOk: { sted: 'skovsti', himmel: 'dag', alt: 'Nusse har bundet grangrene under støvlerne som snesko, og Uffe griner.',
      ting: driver(70, 330).concat([{ navn: 'gnist', x: 200, y: 130, taendt: true, farve: 'groen' }, SNE]),
      figurer: [NU(120, 194, 'glad'), UF(300, 186, 'glad')] },
    js1GranFejl: { sted: 'skovsti', himmel: 'dag', alt: 'Sneen er faldet ned fra granen, og der ligger en stor snebunke på stien.',
      ting: [{ navn: 'snedrive', x: 200, y: 242, skala: 1.6 }, { navn: 'snedrive', x: 340, y: 240 }, SNE],
      figurer: [NU(90, 194, 'overrasket'), UF(320, 186, 'glad')] },
    js1Mus: { sted: 'baek', himmel: 'dag', alt: 'Ved bækken piber en lille mus bag en snedrive, der dækker døren.',
      ting: [{ navn: 'snedrive', x: 170, y: 214, skala: 1.1 }, SNE],
      figurer: [{ navn: 'mus', x: 120, y: 182, skala: 0.65, humoer: 'bekymret' }, NU(300, 182, 'rolig', 0.7)] },
    js1MusOk: { sted: 'baek', himmel: 'dag', alt: 'Døren er fri, og musen jubler med en lille pose grus.',
      ting: [{ navn: 'gnist', x: 220, y: 140, taendt: true, farve: '#C9A26B' }, SNE],
      figurer: [{ navn: 'mus', x: 150, y: 182, skala: 0.7, humoer: 'glad' }, NU(300, 182, 'glad', 0.7)] },
    js1MusFejl: { sted: 'baek', himmel: 'dag', alt: 'Musen kaster bittesmå snebolde og griner.',
      ting: [{ navn: 'snedrive', x: 170, y: 216 }, SNE],
      figurer: [{ navn: 'mus', x: 120, y: 182, skala: 0.7, humoer: 'glad' }, UF(300, 176, 'overrasket', 0.65)] },
    js1Vold: { sted: 'tornekrat', himmel: 'dag', alt: 'For enden af en smal snevold blafrer et rødt halstørklæde på en busk.',
      ting: [{ navn: 'snedrive', x: 90, y: 240, skala: 1.2 }, { navn: 'snedrive', x: 310, y: 240, skala: 1.2 }, { navn: 'gnist', x: 270, y: 168, skala: 0.8, farve: 'roed' }, SNE],
      figurer: [NU(90, 196, 'rolig', 0.7), UF(200, 190, 'rolig', 0.6)] },
    js1VoldOk: { sted: 'tornekrat', himmel: 'dag', alt: 'Nusse har det lange, røde halstørklæde om halsen og ser stolt ud.',
      ting: [{ navn: 'snedrive', x: 90, y: 240, skala: 1.2 }, { navn: 'gnist', x: 290, y: 140, taendt: true, farve: 'roed' }, SNE],
      figurer: [NU(170, 196, 'glad'), UF(320, 186, 'glad', 0.6)] },
    js1VoldFejl: { sted: 'tornekrat', himmel: 'dag', alt: 'Plump! Der er kun huer, der stikker op af den bløde sne, og Nusse griner.',
      ting: [{ navn: 'snedrive', x: 200, y: 242, skala: 1.6 }, { navn: 'gnist', x: 330, y: 70, skala: 0.6, farve: 'roed' }, SNE],
      figurer: [NU(90, 196, 'glad', 0.7), UF(300, 186, 'overrasket', 0.6)] },
    js1Raev: { sted: 'lysning', himmel: 'dag', alt: 'En lille ræveunge sidder i sneen og fniser.',
      ting: driver(60, 340).concat([SNE]),
      figurer: [{ navn: 'raev', x: 150, y: 192, skala: 0.6, humoer: 'glad' }, NU(290, 192, 'rolig', 0.7)] },
    js1RaevOk: { sted: 'lysning', himmel: 'dag', alt: 'Ræveungen triller rundt af grin og viser vej til en hemmelig sti.',
      ting: driver(60, 340).concat([{ navn: 'gnist', x: 220, y: 130, taendt: true, farve: '#F7EBD0' }, SNE]),
      figurer: [{ navn: 'raev', x: 130, y: 192, skala: 0.6, humoer: 'glad' }, NU(290, 192, 'glad', 0.7)] },
    js1RaevFejl: { sted: 'lysning', himmel: 'dag', alt: 'Ræveungen kigger frem bag en snedrive, og Uffe ser flov ud.',
      ting: [{ navn: 'snedrive', x: 110, y: 238, skala: 1.3 }, SNE],
      figurer: [{ navn: 'raev', x: 100, y: 200, skala: 0.55, humoer: 'overrasket' }, UF(290, 186, 'bekymret')] },
    js1Bakke: { sted: 'bjerg', himmel: 'skumring', alt: 'Nusse og Uffe står ved foden af bakken, og stumpen blinker på toppen.',
      ting: [{ navn: 'snedrive', x: 80, y: 236 }, { navn: 'snedrive', x: 330, y: 240 }, STUMP(262, 100), SNE],
      figurer: [NU(100, 196, 'rolig'), UF(300, 186, 'rolig')] },
    js1EndOp: { sted: 'bjerg', himmel: 'aften', alt: 'Stjernestumpen lyser, og Nusse og Uffe jubler på bakken.',
      ting: [{ navn: 'snedrive', x: 80, y: 236 }, { navn: 'snedrive', x: 330, y: 240 }, STUMP(200, 120, 1.4), SNE],
      figurer: [NU(100, 196, 'glad'), UF(300, 186, 'glad')] },
    js1EndVenner: { sted: 'bjerg', himmel: 'aften', alt: 'En ræv, en mus og en krage har hjulpet med at hente stumpen.',
      ting: [{ navn: 'snedrive', x: 330, y: 240 }, STUMP(200, 110, 1.3), SNE],
      figurer: [{ navn: 'raev', x: 60, y: 190, skala: 0.7 }, { navn: 'mus', x: 135, y: 204, skala: 0.6 }, NU(255, 196, 'glad', 0.7), { navn: 'krage', x: 345, y: 196, skala: 0.6 }] },
    js1EndNys: { sted: 'bjerg', himmel: 'aften', alt: 'Stumpen er glidet ned ad bakken og ligger i Nusses hue, og Uffe ser stolt ud.',
      ting: [{ navn: 'snedrive', x: 330, y: 240 }, STUMP(120, 140), SNE],
      figurer: [NU(100, 196, 'overrasket'), UF(300, 186, 'glad')] },
    js1EndMester: { sted: 'bjerg', himmel: 'aften', alt: 'Stjernestumpen lyser over den hvide bakke.',
      ting: [{ navn: 'snedrive', x: 80, y: 236 }, { navn: 'snedrive', x: 330, y: 240 }, STUMP(200, 110, 1.5), SNE],
      figurer: [NU(100, 196, 'glad'), UF(300, 186, 'glad')] }
  };

  return {
    id: '2026-12-julestjernen-1', type: 'maaned', udgives: '2026-12-04',
    serie: { id: '2026-12-julestjernen', titel: 'Julestjernen' }, kapitel: 1, kapitler: 4,
    start: 'js1Start', title: 'Kælkebakken', tag: 'December',
    blurb: 'Det sner i Lanterneskoven, og Nusses julestjerne er sprunget i fire stumper. Den første ligger på toppen af den glatte kælkebakke.',
    scenes: scenes, magi: magi, mester: mester, billeder: billeder
  };
});
