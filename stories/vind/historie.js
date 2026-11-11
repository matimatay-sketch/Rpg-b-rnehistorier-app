// Del 3: Vinden der var alene. Historiefil: registrerer sig med LK.addStory og får kit-hjælperne som k.
LK.addStory(function (k) {
  var scenes = {
    v1: {
      title: 'Et brev i vinden', lit: 2,
      text: function () {
        var t = ['Nogle nætter efter, at månen kom hjem, banker det på ruden. Det er ikke Uffe. Det er et lille, krøllet brev, der blæser rundt i stuen som et sommerfuglefnug.',
          'På brevet står der med rystende skrift: &laquo;Undskyld. Det var mig, der blæste lanternerne ud. Jeg ville bare lege. Jeg har ikke nogen at lege med. Vinden.&raquo;',
          'Uffe lander på vindueskarmen. &laquo;Hu-hu! Så var det altså Vinden hele tiden,&raquo; siger han stille. &laquo;Kom, vi må finde den.&raquo;'];
        var g = k.state.gnisterIn;
        t.push(g.length ? 'Jeres gnister ' + k.joinNames(g) + ' kommer susende ind ad vinduet og peger alle sammen mod Vindbjerget.' : 'En lille gnist svæver ind ad vinduet og peger mod Vindbjerget.');
        var fr = k.crew();
        if (fr.length) t.push('&laquo;' + k.joinNames(fr) + ' har allerede hørt om brevet,&raquo; siger Uffe. &laquo;De tror, at Vinden bare er ensom.&raquo;');
        return t;
      },
      ask: 'Har I nogensinde gjort noget dumt, fordi I gerne ville have nogen at lege med?',
      choices: [{ label: 'Følg gnisterne mod Vindbjerget', to: 'v_skov' }, { label: 'Spørg Uffe, hvad han ved om Vinden', to: 'v1b' }]
    },
    v1b: {
      title: 'Uffes hemmelighed', lit: 2, gainFeather: true,
      text: ['&laquo;Da jeg var lille, var Vinden min bedste ven,&raquo; siger Uffe. &laquo;Den bar mig på ryggen, når mine vinger var for små. Så blev jeg stor og fik travlt med lanterner, og så havde jeg ikke tid til Vinden mere.&raquo;',
        'Han plukker en lille fjer af sin vinge, lettere og lysere end alle de andre. &laquo;Tag den med. Den giver held, og Vinden vil kende den. Brug den, når I slår med terningen.&raquo;'],
      ask: 'Har I en ven, I har haft for lidt tid til? Hvad kunne I gøre?',
      choices: [{ label: 'Tak, Uffe! Lad os finde Vinden', to: 'v_skov' }]
    },
    v_skov: {
      title: 'Bladenes dans', lit: 3,
      text: ['Stien til Vindbjerget går gennem en skov, hvor tusind blade hvirvler rundt i luften som et stort, grønt tæppe. De drejer og drejer, og de er så mange, at I ikke kan se jeres egne hænder.',
        '&laquo;Vinden har leget alene her i flere nætter,&raquo; hvisker Uffe. &laquo;Bladene kan ikke stoppe.&raquo;'],
      ask: 'Hvordan føles det at lege helt alene i lang tid?',
      dyn: function () {
        function R(stat, label, t) { return { label: label, roll: { stat: stat, target: t || 6, win: 'v_skovOk', lose: 'v_skovFejl', flag: 'nusseVen', flagTxt: 'fordi Nusse kender de små stier' } }; }
        // Bevægelse: samme valg som R, men familien danser selv med bladene.
        function B(stat, label, goer) { var c = R(stat, label), r = c.roll; return { label: label, bevaeg: { goer: goer, stat: r.stat, target: r.target, win: r.win, lose: r.lose, flag: r.flag, flagTxt: r.flagTxt } }; }
        var c = [R('Mod', 'Gå lige gennem bladene med hovedet først', 7), R('List', 'Vent på et hul mellem hvirvlerne og løb'), B('Humor', 'Dans med bladene, så de bliver glade', 'Stil jer over for hinanden og vær blade i vinden. Den ene svajer langsomt med armene, og den anden gør præcis det samme som et spejl.')];
        k.availG().forEach(function (n) { c.push({ label: 'Bed ' + n + ' om at lyse en rolig sti', to: 'v_skovGnist', use: n }); });
        c.push({ label: 'Forestil jer, at bladene er sommerfugle, der gerne vil hjælpe', to: 'v_skovOk', lock: function () { return k.lockTxt('Fantasi', 3); } });
        return c;
      }
    },
    v_skovOk: {
      title: 'Bladene falder til ro', lit: 3,
      text: function () {
        var t = ['Langsomt daler bladene ned omkring jer som grønt konfetti. Hvirvlen bliver til en blid brise, og stien åbner sig. Langt væk rejser Vindbjerget sig, gråt og stort.'];
        if (k.state.flags.nusseVen || k.state.flags.nusseHonning) t.push('En lille rød hue titter frem bag et træ. Det er Nusse, der vinker fra sikker afstand.');
        return t;
      },
      ask: 'Hvad fik bladene til at falde til ro: at være stille, at grine eller at tage det roligt?',
      next: 'v_bjerg'
    },
    v_skovFejl: {
      title: 'Rundt i hvirvlen', lit: 3,
      text: ['En hvirvel af blade løfter jer op og sætter jer blidt ned igen, helt der, hvor I startede. I har blade i håret, i lommerne og bag ørerne!',
        'En lille mus kigger ud af et hul. &laquo;Man skal være blid i bladene,&raquo; fniser den og viser jer en sti langs kanten, til I er kommet igennem.'],
      ask: 'Er det i orden at starte forfra? Hvad lærte I?',
      next: 'v_bjerg'
    },
    v_skovGnist: {
      title: 'Lys i bladene', lit: 3,
      text: function () {
        var n = k.state.lastUse || 'Gnisten';
        return [n + ' svæver op og lyser som et lille bål midt i hvirvlen. Bladene falder til ro rundt om lyset, som om de ville varme sig.',
          n + ' bliver helt træt og kravler ned i jeres lomme for at sove. Den kan ikke bruges mere i nat.'];
      },
      ask: 'Hvad kan I gøre for at takke en, der har hjulpet jer?',
      next: 'v_bjerg'
    },
    v_bjerg: {
      title: 'Vindbjerget', lit: 4,
      text: ['Vindbjerget er højt og stejlt, og jo højere I kommer, jo hårdere blæser det. Jeres tøj flagrer, og småsten ruller forbi jeres fødder.',
        'Helt oppe på toppen kan I ane en lille, drejende sky.'],
      ask: 'Hvad gør man, når noget blæser imod én?',
      dyn: function () {
        function R(stat, label, t) { return { label: label, roll: { stat: stat, target: t || 6, win: 'v_bjergOk', lose: 'v_bjergFejl', flag: 'mollLoefte', flagTxt: 'fordi Moll har vist jer en genvej' } }; }
        // Bevægelse: samme valg som R, men familien går selv op ad bjerget i blæsten.
        function B(stat, label, t, goer) { var c = R(stat, label, t), r = c.roll; return { label: label, bevaeg: { goer: goer, stat: r.stat, target: r.target, win: r.win, lose: r.lose, flag: r.flag, flagTxt: r.flagTxt } }; }
        var c = [B('Mod', 'Bøj jer ned og gå ét skridt ad gangen', 7, 'Gør jer så små som en mus, og gå langsomt tværs over stuen, ét lille skridt ad gangen, som om blæsten skubber imod jer.'), R('List', 'Hold jer i læ bag klipperne'), R('Nysgerrighed', 'Find ud af, hvor blæsten kommer fra, og gå med den')];
        k.availG().forEach(function (n) { c.push({ label: 'Bed ' + n + ' om at lyse op i blæsten', to: 'v_bjergGnist', use: n }); });
        c.push({ label: 'Bed Moll grave en tunnel gennem klippen', to: 'v_bjergOk', lock: function () { return k.state.flags.mollLoefte ? null : 'Kræver at I har hjulpet Moll'; } });
        return c;
      }
    },
    v_bjergOk: {
      title: 'Toppen', lit: 4,
      text: function () {
        var t = ['Pludselig lægger blæsten sig. Øverst på bjerget drejer en lille hvirvel af luft rundt og rundt, helt alene. I kan ikke se den, men I kan se, hvordan små blade og fjer danser omkring den.'];
        if (k.state.flags.maaneVen) t.push('Månen kigger ned over bjergtoppen og lægger sølvlys på stien, så I kan se, hvor I går.');
        return t;
      },
      ask: 'Hvad tror I, Vinden tænker, når den ser jer komme?',
      next: 'v_vind'
    },
    v_bjergFejl: {
      title: 'Hår til vejrs', lit: 4, flag: 'blaest',
      text: ['Blæsten tager jeres hatte og blæser jeres hår helt lodret. I må kravle de sidste meter på alle fire. Det ser så sjovt ud, at en flok fugle klapper med vingerne.',
        'Til sidst når I toppen, forpustede og grinende, med hår som små skorstene.'],
      ask: 'Er det værre at se sjov ud eller at give op? Hvad tænker I?',
      next: 'v_vind'
    },
    v_bjergGnist: {
      title: 'Et lys i blæsten', lit: 4,
      text: function () {
        var n = k.state.lastUse || 'Gnisten';
        return [n + ' lyser som en lille lanterne, og blæsten bliver så forbløffet, at den holder pause. I går de sidste skridt til toppen i ro og mag.',
          n + ' gaber stort og kravler ned i jeres lomme for at sove.'];
      },
      ask: 'Hvorfor tror I, at blæsten holdt pause?',
      next: 'v_vind'
    },
    v_vind: {
      title: 'Vinden', lit: 5,
      text: function () {
        var t = ['Hvirvlen stopper, da den får øje på jer. Så kommer der en lille, tynd stemme, som lyder som en fløjte i en nøglering. &laquo;Gå væk,&raquo; siger Vinden. &laquo;I er vrede på mig. Jeg slukkede jeres lanterner.&raquo;'];
        if (k.state.flags.blaest) t.push('Vinden kigger på jeres lodrette hår og fniser lidt. &laquo;Det gjorde jeg,&raquo; siger den.');
        if (k.state.feather) t.push('Så ser den Uffes fjer. &laquo;Du har Uffes fjer,&raquo; hvisker den. &laquo;Er han ikke vred på mig?&raquo;');
        return t;
      },
      ask: 'Hvad siger man til én, der har lavet noget galt og er ked af det?',
      dyn: function () {
        function R(stat, label, key, t) { return { label: label, key: key, roll: { stat: stat, target: t || 6, win: 'v_endHjem', lose: 'v_vindFejl', flag: 'tutVen', flagTxt: 'fordi Tut har lært jer at grine sammen' } }; }
        var c = [R('Venlighed', 'Sig, at I tilgiver, og at I gerne vil lege', 'vv1'), R('Humor', 'Lav en drage af jeres arme, og lad som om I flyver', 'vv2'), R('Fantasi', 'Fortæl, hvordan Vinden kunne bære lys i stedet for at slukke det', 'vv3'), R('Mod', 'Løb ud i blæsten og tag fat i Vinden', 'vv4', 7)];
        c.push({ label: 'Lad alle venner række hånden ud til Vinden', to: 'v_endVenner', lock: function () { return k.friendCount() >= 2 ? null : 'Kræver to venner, I har hjulpet'; } });
        c.push({ label: 'Lad gnisterne lege med Vinden', to: 'v_endGnister', lock: function () { return k.availG().length > 0 ? null : 'Kræver en gnist, der ikke er brugt'; } });
        c.push({ label: 'Sæt jer stille ved siden af Vinden og lyt', to: 'v_endLyt' });
        return c;
      }
    },
    v_vindFejl: {
      title: 'Vinden tøver', lit: 5,
      text: ['Vinden krøller sig sammen og bliver helt lille. &laquo;Det hjælper ikke,&raquo; mumler den. &laquo;Jeg er alt for dum.&raquo;',
        'Uffe lander ved siden af jer og hvisker: &laquo;Prøv at fortælle, at I også nogle gange laver fejl.&raquo;'],
      ask: 'Hvad er forskellen på at være dum og at lave en fejl?',
      next: 'v_vind'
    },
    v_endHjem: {
      title: 'Vinden får lov at lege', end: true, all: true, flag: 'vindVen',
      text: function () {
        var t = ['Vinden bliver så glad, at den snurrer tre gange rundt om jer. &laquo;Må jeg godt lege med jer alligevel?&raquo; hvisker den. Og I siger ja.',
          'Fra den dag blæser Vinden blidt gennem Lanterneskoven. Den bærer duften af blomster og lanternernes lys fra træ til træ i stedet for at slukke dem.'];
        if (k.availG().length) t.push(k.joinNames(k.availG()) + ' danser på Vindens ryg som små stjerneskud.');
        t.push('&laquo;Hu-hu!&raquo; siger Uffe. &laquo;Nu mangler vi bare at sige undskyld til resten af skoven. Vi skal holde en fest!&raquo;');
        return t;
      },
      ask: 'Hvorfor er det godt at give nogen en chance til?'
    },
    v_endLyt: {
      title: 'Vinden fortæller', end: true, all: true, flag: 'vindVen',
      text: ['I sætter jer ved siden af Vinden og siger ingenting. Efter lang tid begynder Vinden at fortælle: om bjergene, om havet og om alle de steder, den har været, uden at nogen har lyttet.',
        'I lytter, til stjernerne står højt på himlen. &laquo;Tak,&raquo; hvisker Vinden til sidst. &laquo;Det var det, jeg manglede.&raquo; Uffe nikker. &laquo;Nu skal vi bare vise hele skoven, at Vinden er en ven. Lad os holde en fest!&raquo;'],
      ask: 'Hvornår hjælper det mest bare at lytte?'
    },
    v_endVenner: {
      title: 'Alle rækker ud', end: true, all: true, flag: 'vindVen',
      text: function () {
        return ['I løfter hånden og kalder: &laquo;Kom frem, alle sammen!&raquo; Fra stierne under bjerget kommer ' + k.joinNames(k.crew()) + ', og hver især rækker en hånd ud mod Vinden.',
          'Vinden kigger på alle de hænder og bliver helt stille. &laquo;Er der så mange, der vil lege med mig?&raquo; Så snurrer den rundt af glæde og løfter jer alle et lille stykke op fra jorden.',
          '&laquo;Hu-hu!&raquo; råber Uffe. &laquo;Nu skal vi holde en fest for hele skoven!&raquo;'];
      },
      ask: 'Hvem har rakt hånden ud til jer, når I havde brug for det?'
    },
    v_endGnister: {
      title: 'Gnister i blæsten', end: true, all: true, flag: 'vindVen',
      text: function () {
        return [k.joinNames(k.availG()) + ' svæver op og begynder at lege fangeleg med Vinden. Vinden løfter dem højt op og lader dem dale langsomt ned igen, og de kilder af grin.',
          'Hver gang Vinden blæser, danser gnisterne i lange, lysende spiraler, og himlen ser ud, som om stjernerne har fået nye venner.',
          '&laquo;Hu-hu! Det her skal fejres,&raquo; siger Uffe. &laquo;Lad os holde en fest!&raquo;'];
      },
      ask: 'Hvem ville I gerne lege fangeleg med?'
    }
  };

  var magi = {
    v_skov: {
      gnist: { l: 'Skab en gnist, der lyser en rolig sti', to: 'v_skovGnist', eff: function (h) { k.state.lastUse = k.gen(h.name) + ' gnist'; } },
      dyr: { l: 'Bed fuglene vise, hvor vinden er blidest', to: 'v_skovOk' },
      syn: { l: 'Se mønstret i bladenes dans og find hullet', to: 'v_skovOk' },
      latter: { l: 'Strø latterstøv, så bladene falder ned i et stort fnis', to: 'v_skovOk' }
    },
    v_bjerg: {
      gnist: { l: 'Skab en gnist, der lyser op i blæsten', to: 'v_bjergGnist', eff: function (h) { k.state.lastUse = k.gen(h.name) + ' gnist'; } },
      dyr: { l: 'Bed bjerggeden vise den lune sti', to: 'v_bjergOk' },
      syn: { l: 'Se den skjulte sti i læ bag klipperne', to: 'v_bjergOk' },
      latter: { l: 'Strø latterstøv, så blæsten bliver kildet og holder pause', to: 'v_bjergOk' }
    },
    v_vind: {
      gnist: { l: 'Skab en ny gnist, der leger med Vinden', to: 'v_endGnister', eff: function (h) { k.state.gnisterIn.push(k.gen(h.name) + ' gnist'); } },
      dyr: { l: 'Bed fuglene lære Vinden at lege', to: 'v_endHjem' },
      syn: { l: 'Se, at Vinden egentlig bare er lille og bange', to: 'v_endHjem' },
      latter: { l: 'Strø latterstøv, så Vinden får sit første grin', to: 'v_endHjem' }
    }
  };

  var mester = {
    v_skov: [
      { stat: 'Mod', l: 'Gå gennem bladene som en modig vandrer', to: 'v_skovOk', n: function (n) { return n + ' går lige ind i bladhvirvlen uden at blinke, og bladene deler sig som et gardin foran de modige skridt.'; } },
      { stat: 'List', l: 'Find den vindstille sti midt i hvirvlen', to: 'v_skovOk', n: function (n) { return n + ' lægger mærke til, at midten af hvirvlen er stille som øjet i en storm, og leder alle derind.'; } },
      { stat: 'Fantasi', l: 'Forvandl bladene til et grønt, flyvende tæppe', to: 'v_skovOk', n: function (n) { return n + ' forestiller sig, at bladene er et flyvende tæppe, og pludselig bærer de alle sammen blidt gennem skoven.'; } }
    ],
    v_bjerg: [
      { stat: 'Mod', l: 'Tag de mindste ved hånden og gå forrest i blæsten', to: 'v_bjergOk', n: function (n) { return n + ' tager de mindste ved hånden og går forrest i blæsten. Hvert skridt er sikkert, og snart er alle på toppen.'; } },
      { stat: 'List', l: 'Find den skjulte sti, der snor sig i læ hele vejen op', to: 'v_bjergOk', n: function (n) { return n + ' opdager en smal sti, der snor sig i læ bag klipperne hele vejen til toppen.'; } },
      { stat: 'Nysgerrighed', l: 'Læs blæstens spor, og følg den til dens kilde', to: 'v_bjergOk', n: function (n) { return n + ' lægger mærke til, hvordan græsset bøjer, og følger blæsten helt op til dens kilde.'; } }
    ],
    v_vind: [
      { stat: 'Venlighed', l: 'Fortæl Vinden, at I har savnet at lege med den', to: 'v_endHjem', n: function (n) { return n + ' siger blidt, at alle har savnet at lege med Vinden. Det er ikke meget, men det er sandt, og Vinden mærker det.'; } },
      { stat: 'Humor', l: 'Lav en vindpuster-konkurrence, hvor Vinden vinder', to: 'v_endHjem', n: function (n) { return n + ' udfordrer Vinden til en vindpuster-konkurrence. Vinden vinder hver gang og griner for første gang i mange år.'; } },
      { stat: 'Fantasi', l: 'Fortæl om et sted, hvor Vinden kan lege uden at slukke noget', to: 'v_endHjem', n: function (n) { return n + ' fortæller om en stor, åben eng, hvor Vinden kan lege med drager og vindmøller uden at slukke noget som helst.'; } }
    ]
  };

  /* Billeder til scenerne, tegnet med delene i art/dele.js (LK.art.scene). Koordinater i en ramme på 400 x 250. */
  var billeder = {
    v1: { sted: 'vindue', himmel: 'nat', alt: 'Et lille, krøllet brev fra Vinden blæser rundt i stuen, og Uffe lander forbavset på vindueskarmen.',
      ting: [{ navn: 'lanterne', x: 110, y: 120, skala: 0.6, taendt: true }, { navn: 'blade', x: 340, y: 205, skala: 0.45 }, { navn: 'brev', x: 330, y: 215, skala: 1.3, taendt: true }],
      figurer: [{ navn: 'uffe', x: 150, y: 141, skala: 0.9, humoer: 'overrasket' }] },
    v1b: { sted: 'skovsti', himmel: 'nat', alt: 'Uffe fortæller om dengang, Vinden var hans bedste ven.',
      ting: [{ navn: 'gren', x: 150, y: 172 }, { navn: 'lanterne', x: 345, y: 150, taendt: true }],
      figurer: [{ navn: 'uffe', x: 205, y: 128, humoer: 'rolig' }, { navn: 'vinden', x: 95, y: 70, skala: 0.55, humoer: 'glad' }] },
    v_skov: { sted: 'lysning', himmel: 'nat', alt: 'Tusind blade hvirvler rundt mellem træerne, og Uffe kan næsten ikke se stien.',
      ting: [{ navn: 'blade', x: 210, y: 105, skala: 1.6 }],
      figurer: [{ navn: 'uffe', x: 120, y: 180, skala: 0.8, humoer: 'bekymret' }] },
    v_skovOk: { sted: 'bjerg', himmel: 'skumring', alt: 'Bladene daler blidt ned, og langt væk rejser Vindbjerget sig.',
      ting: [{ navn: 'blade', x: 300, y: 150, skala: 0.8 }],
      figurer: [{ navn: 'uffe', x: 110, y: 180, skala: 0.8, humoer: 'glad' }] },
    v_skovFejl: { sted: 'lysning', himmel: 'nat', alt: 'En hvirvel af blade har sat jer ned igen, og en lille mus fniser.',
      ting: [{ navn: 'blade', x: 200, y: 95, skala: 1.3 }],
      figurer: [{ navn: 'uffe', x: 120, y: 180, skala: 0.8, humoer: 'overrasket' }, { navn: 'mus', x: 290, y: 192, skala: 0.8, humoer: 'glad' }] },
    v_skovGnist: { sted: 'lysning', himmel: 'skumring', alt: 'En gnist lyser som et lille bål, og bladene falder til ro omkring den.',
      ting: [{ navn: 'blade', x: 230, y: 120, skala: 1.2 }, { navn: 'gnist', x: 230, y: 120, skala: 1.3, taendt: true }],
      figurer: [{ navn: 'uffe', x: 110, y: 180, skala: 0.8, humoer: 'glad' }] },
    v_bjerg: { sted: 'bjerg', himmel: 'nat', alt: 'Det blæser hårdt op ad Vindbjerget, og helt oppe på toppen drejer en lille sky.',
      ting: [{ navn: 'blade', x: 300, y: 150, skala: 0.7 }],
      figurer: [{ navn: 'uffe', x: 120, y: 182, skala: 0.75, humoer: 'bekymret' }, { navn: 'vinden', x: 205, y: 40, skala: 0.35, humoer: 'rolig' }] },
    v_bjergOk: { sted: 'bjerg', himmel: 'skumring', alt: 'Blæsten lægger sig, og øverst på bjerget drejer Vinden rundt, helt alene.',
      ting: [{ navn: 'blade', x: 200, y: 105, skala: 1.1 }],
      figurer: [{ navn: 'vinden', x: 205, y: 105, skala: 0.8, humoer: 'bekymret' }, { navn: 'uffe', x: 110, y: 182, skala: 0.75, humoer: 'overrasket' }] },
    v_bjergFejl: { sted: 'bjerg', himmel: 'nat', alt: 'Blæsten tager fat i alt, og Uffe må holde godt fast for ikke at flyve væk.',
      ting: [{ navn: 'blade', x: 260, y: 130, skala: 1.1 }],
      figurer: [{ navn: 'uffe', x: 130, y: 182, skala: 0.75, humoer: 'overrasket' }] },
    v_bjergGnist: { sted: 'bjerg', himmel: 'skumring', alt: 'En gnist lyser i blæsten, og I går de sidste skridt til toppen i ro.',
      ting: [{ navn: 'gnist', x: 250, y: 150, skala: 1.3, taendt: true }],
      figurer: [{ navn: 'uffe', x: 130, y: 182, skala: 0.75, humoer: 'glad' }] },
    v_vind: { sted: 'bjerg', himmel: 'nat', alt: 'Vinden stopper og ser bange på jer: «Gå væk, I er vrede på mig.»',
      figurer: [{ navn: 'vinden', x: 230, y: 110, skala: 0.9, humoer: 'bekymret' }, { navn: 'uffe', x: 95, y: 182, skala: 0.75, humoer: 'bekymret' }] },
    v_vindFejl: { sted: 'bjerg', himmel: 'nat', alt: 'Vinden krøller sig sammen og bliver helt lille, og Uffe hvisker et godt råd.',
      figurer: [{ navn: 'vinden', x: 240, y: 135, skala: 0.55, humoer: 'bekymret' }, { navn: 'uffe', x: 110, y: 182, skala: 0.75, humoer: 'rolig' }] },
    v_endHjem: { sted: 'lysning', himmel: 'aften', alt: 'Vinden snurrer glad rundt og bærer lanternernes lys gennem skoven.',
      ting: [{ navn: 'lanterne', x: 70, y: 120, taendt: true }, { navn: 'lanterne', x: 340, y: 128, taendt: true }, { navn: 'blade', x: 200, y: 95, skala: 1.1 }],
      figurer: [{ navn: 'vinden', x: 205, y: 95, skala: 0.85, humoer: 'glad' }, { navn: 'uffe', x: 140, y: 184, skala: 0.75, humoer: 'glad' }] },
    v_endLyt: { sted: 'bjerg', himmel: 'skumring', alt: 'I sidder stille ved Vinden, mens den fortæller om alle de steder, den har været.',
      figurer: [{ navn: 'vinden', x: 240, y: 120, skala: 0.8, humoer: 'rolig' }, { navn: 'uffe', x: 110, y: 182, skala: 0.75, humoer: 'rolig' }] },
    v_endVenner: { sted: 'lysning', himmel: 'aften', alt: 'Vennerne rækker ud mod Vinden, og den snurrer rundt af glæde.',
      figurer: [{ navn: 'vinden', x: 220, y: 85, skala: 0.85, humoer: 'glad' }, { navn: 'nusse', x: 90, y: 182, skala: 0.8 },
        { navn: 'moll', x: 190, y: 196, skala: 0.7 }, { navn: 'tut', x: 280, y: 194, skala: 0.7 }, { navn: 'uffe', x: 350, y: 182, skala: 0.7, humoer: 'glad' }] },
    v_endGnister: { sted: 'lysning', himmel: 'skumring', alt: 'Gnisterne leger fangeleg med Vinden i lange, lysende spiraler.',
      ting: [{ navn: 'gnist', x: 110, y: 70, taendt: true }, { navn: 'gnist', x: 360, y: 150, skala: 0.8, taendt: true }, { navn: 'gnist', x: 260, y: 170, skala: 0.7, taendt: true }],
      figurer: [{ navn: 'vinden', x: 210, y: 100, skala: 0.9, humoer: 'glad' }, { navn: 'uffe', x: 110, y: 184, skala: 0.75, humoer: 'glad' }] }
  };

  return {
    id: 'vind', start: 'v1', title: 'Vinden der var alene', tag: 'Del 3 af 4',
    blurb: 'Et brev er blæst ind ad vinduet. Hvorfor slukkede Vinden lanternerne?',
    scenes: scenes, magi: magi, mester: mester, billeder: billeder
  };
});
