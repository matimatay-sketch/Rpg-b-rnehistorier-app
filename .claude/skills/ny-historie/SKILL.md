---
name: ny-historie
description: Brug, når du skal lave månedens historier (en serie med et kapitel hver fredag) til Lanterneskoven ("lav månedens historie", "skriv en ny historie", "ny månedshistorie", "lav en serie"), enten fra den planlagte månedlige opgave eller når ejeren beder om det i chatten.
---

# Ny historie til Lanterneskoven

Opskriften på en ny måneds historier: en **serie** med ét kapitel til hver fredag i den kommende måned (4 eller 5 kapitler). Hvert kapitel er en hel, illustreret historie, som ejeren spiller igennem fra et link. Ejeren godkender hele serien ved at merge én pull request. Kapitel 1 bliver synligt for familierne på månedens første fredag, og et nyt kapitel kommer hver fredag derefter.

**Reglerne for indholdet står i `docs/historie-regler.md`. De gælder altid.** Denne fil er arbejdsgangen.

**Er skill'en ikke registreret** i sessionen (fx i en planlagt session, hvor `ny-historie` ikke står blandt skills), så læs denne fil direkte fra disken, `.claude/skills/ny-historie/SKILL.md` i repoet, og følg den.

## GitHub-trinene, og når de ikke kan lade sig gøre

Flere trin bruger GitHub: find issues med mærkatet `historie-idé`, find en åben pull request med "Månedens historie" i titlen (den nye titel `Månedens historier: …` indeholder det også), åbn pull requesten, skriv en kommentar, og følg pull requesten. Den planlagte session har ikke altid de samme værktøjer. Gør sådan:

1. **Prøv først GitHub-værktøjerne (MCP).** De er ofte udskudte og skal hentes med `ToolSearch`, fx `select:mcp__github__list_issues,mcp__github__list_pull_requests,mcp__github__create_pull_request,mcp__github__add_issue_comment`. Repoet er `matimatay-sketch/Rpg-b-rnehistorier-app`.
2. **Ellers `gh`,** hvis kommandoen findes og er logget ind (`gh auth status`).
3. **Følg pull requesten** med `subscribe_pr_activity`, hvis værktøjet findes (hent det også med `ToolSearch`).
4. **Kan et trin ikke gøres** (intet værktøj, ingen adgang, en fejl, der kommer igen), så prøv ikke igen og igen. Push grenen, hvis der er en, og stop. Skriv til sidst i sessionen en tydelig besked til ejeren: hvad der er lavet, hvilken gren det ligger på, hvilket trin der ikke kunne gøres, og præcis hvad ejeren selv skal gøre (fx "Åbn en pull request fra grenen `claude/maanedens-historie-2026-12` mod `main` med titlen …, og læg forhåndsvisningslinket … i beskrivelsen").

Kan du ikke se, om der er en åben "Månedens historie"-pull request (før du begynder, trin 1), så lav ikke en ny historie. Stop med en besked til ejeren om, at det ikke kunne tjekkes.

## Før du begynder

1. **Er sidste måneds serie godkendt?** Søg efter åbne pull requests med "Månedens historie" i titlen (`mcp__github__list_pull_requests` med `state: open`, eller `gh pr list --search "Månedens historie in:title" --state open`). Se "GitHub-trinene" ovenfor, hvis det ikke kan lade sig gøre.
   - Findes der en, så lav **ikke** en ny historie. Skriv en kort, venlig påmindelse som kommentar på den åbne pull request (`mcp__github__add_issue_comment` med pull requestens nummer, eller `gh pr comment`), fx: "Hej! Månedens historier venter stadig på at blive læst og godkendt. Spil kapitlerne fra linkene i beskrivelsen, og merge, når den er klar. Skriv en kommentar her, hvis noget skal rettes." Stop så.
2. **Har den kommende måned allerede en historie?** Serien er til **den kommende måned**, dvs. måneden efter dagens dato. Kører du den 15. november 2026, er det december 2026, og kapitlerne udgives på december 2026's fredage (`LK.fredageIMaaned(2026, 12)` i `js/katalog.js` giver dem: `2026-12-04`, `2026-12-11`, `2026-12-18` og `2026-12-25`). Hent den nyeste `main` (`git fetch origin main`), og læs `stories/katalog.js` på `origin/main` (`git show origin/main:stories/katalog.js`).
   - Står der allerede en historie med `udgives` i den kommende måned, så stop uden at gøre noget: ingen gren, ingen pull request og ingen kommentar.
3. Lav en gren fra den nyeste `main`: `claude/maanedens-historie-<ÅÅÅÅ-MM>`, fx `claude/maanedens-historie-2026-12`.

## Trin

### 1. Find idéen

Find den ældste åbne issue med mærkatet `historie-idé` (`mcp__github__list_issues` med `labels: ["historie-idé"]` og `state: OPEN`, eller `gh issue list --label historie-idé --state open`), og tag den med det laveste nummer. Brug idéen til **hele serien** (én idé, ikke én pr. kapitel), og husk issue-nummeret til `Closes #N`. Kan issues ikke læses, så vælg selv et emne som nedenfor, og skriv det i pull requestens beskrivelse.

Er der ingen, så vælg selv et emne, der passer til årstiden og måneden (sne og jul i december, forår og spirer i april, sommerferie og bær i juli, blade og høst i oktober). Tjek i `stories/katalog.js`, at emnet ikke ligner en tidligere månedshistorie eller serie for meget.

### 2. Læs reglerne og et eksempel

- Læs `docs/historie-regler.md` hele vejen igennem.
- Læs `stories/lantern/historie.js` (hub med stier, terningkast, en bevægelse, Fejl-scener, gnister, magi, mester, billeder) og den nyeste månedshistorie eller det nyeste kapitel i `stories/` (fx `stories/2026-12-julestjernen-1/historie.js`).
- Læs toppen af `art/dele.js` og listen over `steder`, `figurer` og `ting`. Se dem tegnet ved at åbne `tools/vis-dele.html` i en browser.
- `k` er kittet fra `js/kit.js` (`k.state`, `k.joinNames`, `k.gnistNames`, `k.lockTxt`, `k.partyStat`, `k.crew`, `k.stats`, `k.esc`). Brug ikke `k.friendLines()` i en månedshistorie: linjerne er skrevet til sagaen (fx kommer Nusse genert frem bag et træ), og de passer ikke, hvis figuren allerede er med i historien. Skriv historiens egne venne-linjer ud fra `k.state.flags`, og udelad de venner, der allerede er med.

### 3. Planlæg serien

Find først fredagene: `LK.fredageIMaaned(<år>, <måned>)` (kør fx `node -e "global.self=global;global.LK={};require('./js/katalog.js');console.log(self.LK.fredageIMaaned(2026,12))"`, eller regn selv efter, hvis det driller). Det giver 4 eller 5 datoer, og så er serien 4 eller 5 kapitler lang. Kapitel 1 er den første fredag, det sidste kapitel er månedens sidste fredag.

Skriv en kort plan, før du skriver et eneste kapitel (gem den fx i pull requestens beskrivelse til sidst, eller som kommentar øverst i den første historiefil):

- **Serietitel** og et **serie-id**: et kort ord uden æøå, fx `julestjernen`.
- **Ét afsnit pr. kapitel:** kapitlets titel, dato, hvad der sker, hvilket mål børnene arbejder på, og hvordan kapitlet slutter (en god slutning, hvor noget er lykkedes).
- **De samme figurer og det samme overordnede mål** går igen i alle kapitler, så serien hænger sammen (fx at finde en stjerne, hjælpe samme ugle, nå frem til en fest).
- **Sammenhængen mellem kapitlerne:** hvert kapitel kan spilles alene. Et kapitel må gerne starte med et kort tilbageblik (1-2 sætninger: "Sidste gang fandt I …"), men må ikke forudsætte, at man har spillet det forrige, og må aldrig afhænge af børnenes valg dér. Hvert kapitel har sin egen gode slutning, ikke en cliffhanger, der efterlader børnene i knibe. Slutningen må gerne pege fremad med en sjov, rolig sætning ("Næste fredag venter …").
- **Bevægelserne:** 1-2 pr. kapitel, med forskellige bevægelser fra kapitel til kapitel.

Skriv kapitlerne **ét ad gangen**: skriv et kapitel, tilføj det i kataloget, kør tjekket (trin 4), ret, og **commit på grenen**, før du går i gang med det næste. Så er intet tabt, hvis sessionen afbrydes, og fejl opdages tidligt. Et kapitel er en fuld historie, så det tager tid: hold dig til planen, og skriv ikke de næste kapitler på forhånd.

### 4. Skriv kapitlerne

Hvert kapitel er en **hel historie** i sin egen mappe: `stories/<ÅÅÅÅ-MM>-<serie-navn>-<n>/historie.js`, fx `stories/2026-12-julestjernen-1/historie.js`. Kapitlets id er hele mappenavnet: `<ÅÅÅÅ-MM>-<serie-navn>-<n>`, hvor `<n>` er kapitlets nummer (1, 2, 3 …). Alle kapitler har samme `serie`, og scene-id'erne har et præfiks pr. kapitel (se nedenfor).

```js
// Månedens historier, <måned år>: <serietitel>, kapitel <n> af <N>: <kapiteltitel>. Historiefil: registrerer sig med LK.addStory og får kit-hjælperne som k.
LK.addStory(function (k) {
  var scenes = { /* 15-30 scener, alle id'er med et fælles præfiks for kapitlet, fx js1Start, js1Hub */ };
  var magi = { /* scene-id -> { gnist, dyr, syn, latter } */ };
  var mester = { /* scene-id -> [{ stat, l, to, n }] */ };
  var billeder = { /* scene-id -> { sted, himmel, alt, ting, figurer } */ };
  return {
    id: '<ÅÅÅÅ-MM>-<serie-navn>-<n>', type: 'maaned', udgives: '<fredagens dato, ÅÅÅÅ-MM-DD>',
    serie: { id: '<serie-navn>', titel: '<Serietitel>' }, kapitel: <n>, kapitler: <N>,
    start: '<første scene>', title: '<Kapiteltitel>', tag: '<Måned>', blurb: '<én sætning til listen>',
    scenes: scenes, magi: magi, mester: mester, billeder: billeder
  };
});
```

`serie`, `kapitel` og `kapitler` skal stå i både historiefilen og kataloget med samme værdier, og `serie` er ens i alle seriens kapitler. Motoren viser `Ugens eventyr · <serietitel> · kapitel <n> af <N>` og, på slutskærmen, hvornår det næste kapitel kommer (eller at serien er slut). Skriv ikke selv om "næste kapitel" i et kapitels slutscene ud over en kort, rolig sætning.

Tilføj hvert kapitel i `stories/katalog.js` efter sagaen (og efter de tidligere kapitler):

```js
{ id: '<ÅÅÅÅ-MM>-<serie-navn>-<n>', fil: 'stories/<ÅÅÅÅ-MM>-<serie-navn>-<n>/historie.js', type: 'maaned', udgives: '<fredagens dato, ÅÅÅÅ-MM-DD>',
  serie: { id: '<serie-navn>', titel: '<Serietitel>' }, kapitel: <n>, kapitler: <N> }
```

Regler for serien, som tjekket håndhæver: `udgives` er en fredag; kapitlerne ligger på fredage i træk i samme måned; det sidste ligger på månedens sidste fredag; de er nummereret 1 til N, og `kapitler` er N på alle (se fejlbeskederne nederst).

Sådan skriver du:

- Planlæg hvert kapitel først (ud over seriens plan): en start med en figur, der har brug for hjælp; en hub med 3-4 stier, hvor hver sti har et terningkast med en Ok- og en Fejl-scene; en finale med 3-4 glade slutninger plus en mester-slutning.
- Hvert kapitel er en fuld historie på 15-30 scener med 1-2 bevægelser. Hver scene har titel, tekst, et **Spørg børnene**-spørgsmål og et billede.
- Hver Fejl-scene er sød eller sjov og fører videre. Ingen blindgyder.
- **1-2 bevægelser, aldrig flere**, efter afsnittet "Bevægelser" i `docs/historie-regler.md`: gør et terningvalg, hvor kroppen er med (fx en bakke eller en snemand), om til `bevaeg: { goer, stat, target, win, lose }`, og giv det en kort, sikker instruktion fra listen over gode bevægelser. Højst én i hver scene, og kun hvor Fejl-scenen er venlig og sjov. Se `js1Vold` i `stories/2026-12-julestjernen-1/historie.js` og `pj1Bjorn` i `stories/2026-11-pjuske-1/historie.js`. Det bedste eksempel er liniegangen i `bro` (`stories/lantern/historie.js`): gå ét skridt ad gangen hen ad et snørebånd. Foretræk bevægelser, hvor det at vakle har en tydelig mening (balance, liste lydløst, stå på ét ben), så "Vi vaklede" giver en naturlig, venlig Fejl-scene. Spejlleg kun, hvis "Vi vaklede"-scenen stadig giver mening.
- Brug figurerne og målet fra planen i hvert kapitel. Sæt aldrig et venne-flag (`nusseVen`, `nusseHonning`, `mollLoefte`, `tutVen`, `maaneVen`, `vindVen`). Læs dem gerne. Et kapitel må heller ikke sætte et flag, som et andet kapitel kræver: kapitlerne er uafhængige af hinanden.
- Læs teksten højt for dig selv. Er en sætning svær at læse højt, så del den op.

**Billeder:** brug de eksisterende dele i `art/dele.js`. Tilføj kun en ny del (et sted, en figur eller en ting), hvis historien virkelig har brug for den, fx sne til en vinterhistorie. En ny del:

- tegnes i stil A (flade former, varme farver, bløde runde kanter, tydelige øjne), i en ramme på 400 x 250,
- bruger `c.u(...)` eller `c.ny(...)` til gradienter og de fælles klasser `lk-blafr`, `lk-blink`, `lk-glimt` til bevægelse,
- en ny figur bruger `ansigt(h, ...)`, så alle fire humører ser forskellige ud,
- kommer med i listen i testen `startsættet findes` i `tests/art.test.mjs` og får en lille test af sine egne valg.

### 5. Tjek (efter hvert kapitel)

```
node tools/tjek-historier.mjs
node --test 'tests/*.test.mjs'
```

Kør de to efter hvert kapitel. E2e-testen er tung (den spiller alle månedens kapitler igennem to gange), så kør den kun **én gang efter det sidste kapitel**: `node --test 'tests/e2e/*.test.cjs'`.

**Midlertidige serie-meldinger:** tjekket regner seriens længde ud fra de kapitler, der er i kataloget lige nu. Mens det sidste kapitel endnu ikke er tilføjet, vil tjekket derfor altid give præcis to meldinger, som du skal **ignorere**: `Kapitlet har kapitler: <N>, men serien har <antal skrevet indtil nu>` og `Seriens sidste kapitel skal ligge på månedens sidste fredag`. Alt andet skal være grønt efter hvert kapitel, og ingen af de to meldinger tæller som et forsøg til stopreglen. Efter det **sidste** kapitel skal tjekket give `Ingen fejl i N historier`, og e2e-testen skal være grøn. Tjekket sammenligner også hver post i `stories/katalog.js` med sin fil (samme `id`, `type` og `udgives`) og kører alle magi- og mester-valgenes funktioner, og seriereglerne tjekkes over hele kataloget. E2e-testen `tests/e2e/maanedens.test.cjs` spiller automatisk alle månedshistorier (alle kapitler) i kataloget igennem i forhåndsvisningen to gange med bevægelse slået til (terningen høj og "Vi klarede det!", terningen lav og "Vi vaklede") og fejler ved fejl i konsollen, eller hvis den ikke møder en bevægelse.

**Stopregel:** er tjekket eller testene (bortset fra de to midlertidige serie-meldinger ovenfor, før det sidste kapitel er med) stadig ikke grønne efter 3 seriøse forsøg på at rette dem, så stop med at rette. Commit og push (alle de kapitler, der er skrevet), og åbn pull requesten som **kladde** (`draft: true`, eller `gh pr create --draft`) med den fejlende uddata i beskrivelsen og en kort forklaring af, hvad du har prøvet og hvilke kapitler der mangler eller ikke er grønne. Kan der ikke åbnes en pull request, så stop med beskeden til ejeren (se "GitHub-trinene").

Se derefter billederne med dine egne øjne: start en server i repoet (`python3 -m http.server 8000`), åbn `http://localhost:8000/index.html?preview=<id>` for hvert kapitel i Playwright, og tag skærmbilleder af nogle scener (`deviceScaleFactor: 1`). Se efter figurer, der dækker hinanden, står i luften eller er skåret over, og ret dem én gang pr. kapitel.

### 6. Hæv VERSION

Hæv `VERSION` i `sw.js` med én, fx `'lk-v7'` til `'lk-v8'`. Kapitlernes filer skal ikke stå i nogen liste i `sw.js`: appen beder selv service workeren gemme alle katalogets filer, også de kommende, så hvert kapitel også åbner på udgivelsesdagen uden net. Hæv den kun én gang for hele serien.

### 7. Åbn en pull request

Når alle kapitler er skrevet, tjekket og committet, og `VERSION` er hævet: push grenen `claude/maanedens-historie-<ÅÅÅÅ-MM>`. Åbn **én** pull request mod `main` for hele serien (`mcp__github__create_pull_request`, ellers `gh pr create`; se "GitHub-trinene", hvis ingen af dem virker):

- **Titel:** `Månedens historier: <serietitel> (<måned år>)`, fx `Månedens historier: Julestjernen (december 2026)`. Titlen skal indeholde "Månedens historie", for det er den tekst, den planlagte opgave leder efter.
- **Beskrivelse:**
  - et kort resumé af serien (2-3 sætninger),
  - et **resumé pr. kapitel** med kapitlets nummer, titel og udgivelsesdato (fredagen), 2-3 sætninger og gerne de sjoveste øjeblikke,
  - `Closes #N` for idéens issue (udelad linjen, hvis du selv valgte emnet),
  - et **forhåndsvisningslink pr. kapitel**: `https://raw.githack.com/matimatay-sketch/Rpg-b-rnehistorier-app/<gren>/index.html?preview=<id>` med kapitlets id,
  - afsnittet **Bevægelser til gennemsyn**, grupperet pr. kapitel: hver bevægelse (1-2 pr. kapitel) med scenens id, valgets `label`, hele `goer`-teksten og titlen på dens "Vi vaklede"-scene (`lose`). Ejeren skal kunne læse dem igennem, før kapitlerne går live uden yderligere gennemsyn,
  - en linje om, at kapitlerne bliver synlige for familierne en fredag ad gangen (nævn datoerne), når pull requesten er merget, og at pull requesten skal **godkendes senest den 1.** i måneden, så kapitel 1 ikke går glip af sin dato.

### 8. Følg pull requesten

Abonnér på pull requestens aktivitet (`subscribe_pr_activity`, hent det med `ToolSearch`, hvis det er udskudt). Findes værktøjet ikke, så skriv i beskeden til ejeren, at kommentarer på pull requesten ikke bliver set automatisk, og at ejeren kan bede om rettelser i chatten i stedet. Når ejeren skriver en kommentar, så ret historien (kapitlet) efter den, kør tjekket igen (trin 5, med samme stopregel), commit og push til samme gren, og svar kort på kommentaren med, hvad du har rettet (`mcp__github__add_issue_comment` med pull requestens nummer, eller `gh pr comment`). Er en kommentar uklar, så spørg på pull requesten i stedet for at gætte.

Merge aldrig selv. Ejerens merge er godkendelsen.

## Almindelige fejl

| Fejl | Gør i stedet |
|------|--------------|
| Scene-id'er som `start` eller `hub` | Et præfiks for kapitlet: `js1Start`, `js1Hub` (et nyt præfiks pr. kapitel) |
| `flag: 'nusseVen'` i en månedshistorie | Et eget flag, fx `flag: 'sneIStoevlerne'` |
| En Fejl-scene uden `next` | Fejl fører altid videre, fx tilbage til hubben |
| Spørgsmål med ét rigtigt svar | Åbne spørgsmål om følelser, valg og fantasi |
| Ny tegnet del for noget, der allerede findes | Genbrug delene; tilføj kun det, historien mangler |
| Glemt at hæve `VERSION` i `sw.js` | Hæv den i samme pull request |
| Ny pull request, mens sidste måneds serie stadig er åben | Skriv en påmindelse på den åbne i stedet |
| Prøve et GitHub-trin igen og igen | Push grenen, stop, og skriv til ejeren, hvad de skal gøre |
| `Månedshistorien har ingen bevægelser` | Gør 1-2 terningvalg om til `bevaeg` (se "Bevægelser" i reglerne) |
| `For mange bevægelser (højst 2)` | Gør resten tilbage til almindelige terningvalg med `roll` |
| `To bevægelser i samme scene` | Højst én bevægelse pr. scene; flyt den anden til en anden scene eller gør den til `roll` |
| `Bevægelse uden instruktion` | Skriv `goer`: 1-2 korte sætninger om, hvad man gør |
| `Bevægelse uden træk og sværhed til terningen` | Giv `stat` (et af de seks træk) og `target` (fx 6), som bruges, når bevægelse er slået fra |
| En bevægelse med klatring, spring, kapløb eller snurren | En rolig bevægelse på stuegulvet fra listen i reglerne |
| Alle kapitler skrevet på én gang uden at tjekke undervejs | Ét kapitel ad gangen: skriv, tjek, commit |
| Et kapitel, der kræver, at man har spillet det forrige | Hvert kapitel kan spilles alene; kun et kort tilbageblik |
| `Et kapitel skal udgives på en fredag` | Brug en dato fra `LK.fredageIMaaned(år, måned)` |
| `Seriens kapitler skal ligge i samme måned` | Alle kapitlers `udgives` skal være i den samme måned |
| `Serien har huller: kapitlerne skal ligge på fredage i træk` | Ét kapitel pr. fredag, ingen fredag sprunget over |
| `Seriens sidste kapitel skal ligge på månedens sidste fredag` | Lav lige så mange kapitler, som måneden har fredage (`LK.sidsteFredag`) |
| `Kapitlerne skal være nummereret 1 til N` | `kapitel` er 1, 2, 3 … uden huller eller dubletter |
| `Kapitlet har kapitler: x, men serien har N` | Sæt `kapitler` til antallet af kapitler i serien på alle kapitler (fil og katalog) |
| `Historien i filen har serie "…", men kataloget siger "…"` (også for `kapitel` og `kapitler`) | Gør `serie`, `kapitel` og `kapitler` ens i historiefilen og i `stories/katalog.js` |
| Rette i det uendelige, når tjekket ikke bliver grønt | Efter 3 seriøse forsøg: kladde-pull request med den fejlende uddata |
