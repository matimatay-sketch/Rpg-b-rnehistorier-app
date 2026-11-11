# Billeder til scenerne og månedlige historier – byggeplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Flyt historierne ud i egne filer, giv hver scene et billede i billedbogsstil, og sæt en månedlig, automatisk historie op, som ejeren godkender ved at merge en pull request.

**Architecture:** `index.html` bliver en motor, der læser `stories/katalog.js` og indlæser hver historie som et klassisk script, der registrerer sig med `LK.addStory(...)`. Rene funktioner (udgivelsesdato, hjælpefunktioner til historierne, billeddele) ligger i små `js/`- og `art/`-filer, som både browseren og Node kan køre. Et Node-script tjekker historierne, og en planlagt Claude-session laver en ny historie hver måned efter en projekt-skill.

**Tech Stack:** Ren HTML/CSS/JS uden byggetrin. Node 22 (`node --test`) til tests og tjek. Playwright (forudinstalleret) til gennemspilningstests. GitHub Actions til tjek på pull requests.

**Spec:** `docs/superpowers/specs/2026-11-11-billeder-og-maanedshistorier-design.md`

## Global Constraints

- Intet byggetrin og ingen afhængigheder i appen. Alle filer, appen bruger, er klassiske scripts, der også virker fra `file://`.
- Gemte data i `localStorage` (`lk-heroes`, `lk-prefs`, `lk-welcomed`) skal kunne læses som før. Formatet ændres ikke.
- Hæv `VERSION` i `sw.js` i hver pull request, der ændrer filer, appen bruger.
- Appen skal virke uden net efter første besøg.
- Billedstil A: flade former, varme farver, bløde runde kanter, tydelige øjne. `viewBox="0 0 400 250"`. Ingen bevægelse ved `prefers-reduced-motion: reduce`.
- Ét billede pr. scene, øverst over teksten. Lanternerækken står som en smal række lige under billedet.
- Månedshistorier: selvstændige, tæller med til levels, må læse venner, må ikke skrive varige venner eller flag, ingen "Spil næste del".
- En historie med `udgives: 'ÅÅÅÅ-MM-DD'` vises først fra den dato efter enhedens lokale dato. Forhåndsvisning ser bort fra datoen.
- Al tekst til brugeren er på dansk.
- Hver fase herunder er én pull request fra `claude/adoring-dijkstra-nzijgl`. Er den forrige merget, startes grenen forfra fra `origin/main`.

## Review Focus

1. **Gemte data fra den nuværende version** (helte med `stories`, `lib.world.done_lantern`, venneflag, `gnistNavne`) skal virke uændret efter flytningen. Test i Task 3.
2. **En historiefil, der ikke kan hentes eller fejler** (uden net, eller en fejl i AI-skrevet kode), må ikke give en tom skærm. De andre historier skal stadig virke. Test i Task 2 og Task 3.
3. **Midnat den 1.:** en historie med `udgives: '2026-12-01'` er skjult kl. 23:59 den 30. november og synlig kl. 00:00 den 1. december lokal tid. Test i Task 1.
4. **Forhåndsvisning må aldrig gemme:** `localStorage` er uændret efter en gennemspilning med `?preview=`. Test i Task 8.
5. **En månedshistorie må ikke ændre varige venner:** efter at have gennemført en månedshistorie er `lib.world` kun ændret med `done_<id>`. Test i Task 7.

---

## Fase 1: Historierne i egne filer (pull request 1)

### Task 1: Katalog og udgivelsesdato

**Files:**
- Create: `js/katalog.js`
- Create: `tests/helpers/indlaes.mjs`
- Test: `tests/katalog.test.mjs`

**Interfaces:**
- Produces:
  - `tests/helpers/indlaes.mjs`: `indlaes(filer: string[], ekstra?: object): object` kører klassiske scripts i en `vm`-kontekst, hvor `self` og `window` er konteksten selv, og returnerer konteksten (så `ctx.LK` kan bruges).
  - `js/katalog.js` sætter `self.LK = self.LK || {}` og tilføjer:
    - `LK.datoStreng(d: Date): string` lokal dato som `'ÅÅÅÅ-MM-DD'`
    - `LK.erUdgivet(entry: {udgives?: string}, nu: Date): boolean`
    - `LK.synlige(katalog: Entry[], nu: Date, previewId: string|null): Entry[]` hvor `Entry = {id: string, fil: string, type: 'saga'|'maaned', udgives?: string}`. Sagaen først i katalogets rækkefølge, derefter udgivne månedshistorier med nyeste `udgives` først. Er `previewId` sat, er den historie med uanset dato.

- [ ] **Step 1: Skriv de fejlende tests**

```js
test('uden dato er altid udgivet', () => assert.equal(LK.erUdgivet({}, new Date(2020, 0, 1)), true));
test('skjult kl. 23:59 dagen før', () => assert.equal(LK.erUdgivet({ udgives: '2026-12-01' }, new Date(2026, 10, 30, 23, 59)), false));
test('synlig kl. 00:00 på dagen', () => assert.equal(LK.erUdgivet({ udgives: '2026-12-01' }, new Date(2026, 11, 1, 0, 0)), true));
test('datoStreng bruger lokal tid', () => assert.equal(LK.datoStreng(new Date(2026, 0, 5, 0, 30)), '2026-01-05'));
test('synlige: saga først, månedshistorier nyeste først, fremtidige skjult', () => {
  const k = [{ id: 'lantern', type: 'saga' }, { id: 'dec', type: 'maaned', udgives: '2026-12-01' },
             { id: 'jan', type: 'maaned', udgives: '2027-01-01' }, { id: 'nov', type: 'maaned', udgives: '2026-11-01' }];
  assert.deepEqual(LK.synlige(k, new Date(2026, 11, 2), null).map(e => e.id), ['lantern', 'dec', 'nov']);
  assert.deepEqual(LK.synlige(k, new Date(2026, 11, 2), 'jan').map(e => e.id), ['lantern', 'jan', 'dec', 'nov']);
});
```

- [ ] **Step 2:** Kør `node --test tests/` og se dem fejle, fordi `js/katalog.js` ikke findes.
- [ ] **Step 3:** Skriv `tests/helpers/indlaes.mjs` og `js/katalog.js`. `erUdgivet` sammenligner `datoStreng(nu) >= entry.udgives` som strenge.
- [ ] **Step 4:** Kør `node --test tests/`. Forventet: alle PASS.
- [ ] **Step 5:** Commit: `git add js tests && git commit -m "Katalog med udgivelsesdato"`

### Task 2: Historietjek

**Files:**
- Create: `js/kit.js`
- Create: `tools/tjek-historier.mjs`
- Create: `tests/fixtures/god.js`, `tests/fixtures/blindgyde.js`, `tests/fixtures/manglende-maal.js`, `tests/fixtures/mangler-spoergsmaal.js`, `tests/fixtures/kaster-fejl.js`
- Test: `tests/tjek.test.mjs`

**Interfaces:**
- Consumes: `indlaes` (Task 1).
- Produces:
  - `js/kit.js`: `LK.lavKit(hentState: () => State, data: {stats, comps, magics}): Kit`. `Kit` er de hjælpefunktioner, historiekoden må bruge, og en getter `state`. Den indeholder mindst `esc`, `joinNames`, `partyStat`, `lockTxt`, `friendNames`, `crew`, `friendCount`, `gnistNames`, `availG` og `friendLines`, flyttet uændret fra `index.html`, men med `state` læst via `hentState()`. Alt, historiekoden i `S`, `MAGIC_OPTS` og `MAX_OPTS` i dag læser fra motorens lukkede scope, skal komme fra `Kit`.
  - Historiefil-format: `LK.addStory(function (k) { return Story; })` hvor `Story = {id, title, tag, blurb, start, scenes: {[id]: Scene}, magi?: {[sceneId]: {...}}, mester?: {[sceneId]: [...]}, billeder?: {[sceneId]: BilledSpec}}`. `Scene` har samme felter som i dag (`title`, `text`, `ask`, `choices`/`next`/`dyn`, `end`, `lit`, `all`, `gnist`, `gain`, `flag`, `path` osv.).
  - `tools/tjek-historier.mjs`: `tjek(filer: string[], valg?: {kraevBilleder?: boolean}): Fejl[]` hvor `Fejl = {historie, scene, besked}`. Kørt fra kommandolinjen (`node tools/tjek-historier.mjs`) læser den `stories/katalog.js`, tjekker alle historier, skriver fejlene og afslutter med kode 1, hvis der er fejl.

Tjekket kører hver scenes `text`, `ask` og `dyn` under et fast sæt falske tilstande (ingen flag og stats 0; alle `FRIEND_FLAGS` og stats 5; besøgt alle stier; 0, 1 og 3 gnister) og samler alle mål fra `to`, `next`, `roll.win`, `roll.lose`, magi og mester. Derefter:
- hvert mål skal findes i `scenes` → `besked: 'Valget fører til "<mål>", som ikke findes'`
- hver nåbar scene skal have `title` og `ask`, der giver ikke-tom tekst → `'Mangler titel'` / `'Mangler spørgsmål til børnene'`
- hver nåbar scene uden `end` skal have mindst ét valg i alle tilstande → `'Blindgyde: ingen valg'`
- fra hver nåbar scene skal en scene med `end` kunne nås → `'Kan ikke nå en slutning'`
- en fejl kastet fra `text`, `ask` eller `dyn` → `'Fejl i koden: <besked>'`
- med `kraevBilleder: true`: hver nåbar scene skal have et billede, og `LK.art.scene(spec)` må ikke kaste → `'Mangler billede'` / `'Billedfejl: <besked>'` (bruges fra Task 5)

- [ ] **Step 1: Skriv de fejlende tests**

```js
test('en god historie giver ingen fejl', () => assert.deepEqual(tjek(['tests/fixtures/god.js']), []));
test('blindgyde', () => assert.match(beskeder('blindgyde.js'), /Blindgyde: ingen valg/));
test('manglende mål', () => assert.match(beskeder('manglende-maal.js'), /fører til "findesikke"/));
test('manglende spørgsmål', () => assert.match(beskeder('mangler-spoergsmaal.js'), /Mangler spørgsmål til børnene/));
test('kode der kaster', () => assert.match(beskeder('kaster-fejl.js'), /Fejl i koden/));
```

- [ ] **Step 2:** Kør `node --test tests/` og se de nye tests fejle.
- [ ] **Step 3:** Skriv de små fixtures (3-5 scener hver), `js/kit.js` og `tools/tjek-historier.mjs`.
- [ ] **Step 4:** Kør `node --test tests/`. Forventet: alle PASS.
- [ ] **Step 5:** Commit: `git commit -m "Tjek af historier"`

### Task 3: Flyt de fire dele ud af index.html

**Files:**
- Create: `stories/katalog.js`, `stories/lantern/historie.js`, `stories/maane/historie.js`, `stories/vind/historie.js`, `stories/fest/historie.js`
- Modify: `index.html` (fjern `STORIES`, indholdet af `S`, `MAGIC_OPTS`, `MAX_OPTS` og historie-hjælpere; tilføj registrering og indlæsning)
- Modify: `sw.js`
- Create: `tests/e2e/gennemspil.test.cjs`, `.github/workflows/tjek.yml`

**Interfaces:**
- Consumes: `LK.synlige`, `LK.lavKit`, historiefil-formatet (Task 1-2).
- Produces:
  - `stories/katalog.js`: `LK.katalog([{id:'lantern', fil:'stories/lantern/historie.js', type:'saga'}, ...maane, vind, fest])`.
  - I `index.html`: `LK.addStory(factory)` kalder `factory(kit)` i `try/catch`; en fejl springer historien over og logges med `console.error`. `S`, `MAGIC_OPTS` og `MAX_OPTS` fyldes fra de registrerede historier. Scene-id'er er i dag unikke på tværs af delene og forbliver det.
  - `LK.start()`: læser katalog, indlæser synlige historier med `<script>`-elementer, venter til alle er hentet eller fejlet (`onload`/`onerror`), og starter så appen som i dag.
  - `sw.js`: `stories/katalog.js` hentes fra nettet først, ellers fra cachen. `js/` og `art/` lægges i `SHELL`. `VERSION = 'lk-v3'`.

- [ ] **Step 1: Skriv gennemspilningstesten** i `tests/e2e/gennemspil.test.cjs` mod den nuværende `index.html`, før noget flyttes. Den starter `python3 -m http.server` i repoet, åbner siden i Playwright med en gemt helt i `lk-heroes` og `lk-welcomed = '1'`, erstatter `Math.random` via `addInitScript`, og spiller hver af de fire dele til slutskærmen (`.end` med teksten "Slut") ved altid at trykke første valg. To kørsler: `Math.random = () => 0.99` (alle kast lykkes) og `() => 0` (alle kast fejler). Asserts: slutskærmen nås i alle otte gennemspilninger, ingen `pageerror`, og efter del 1 er `lk-heroes`.`world.done_lantern === true`.
- [ ] **Step 2:** Kør `node --test tests/e2e/`. Forventet: PASS mod den nuværende kode. Det er udgangspunktet, der ikke må ændre sig.
- [ ] **Step 3: Tilføj testen for gamle gemte data:** start med et `lk-heroes` i det nuværende format, hvor `world` har `done_lantern`, `nusseVen` og `gnistNavne: ['Blinke']`. Assert, at listen over historier viser del 1 som "Gennemført", at del 2 er valgt, og at Nusse nævnes i del 2's første scene.
- [ ] **Step 4: Tilføj testen for en historie, der fejler:** i Playwright routes `stories/vind/historie.js` til 404. Assert, at appen starter, og at del 1, 2 og 4 kan vælges.
- [ ] **Step 5:** Kør testene. Forventet: test 3 PASS, test 4 FAIL.
- [ ] **Step 6:** Flyt koden. Klip uændret: hver dels scener, magi- og mester-tabeller over i sin historiefil. Erstat referencer til motorens scope med `k.` (`state` → `k.state`). Lad `index.html` indlæse `js/katalog.js`, `js/kit.js` og `stories/katalog.js` med faste `<script>`-tags og kalde `LK.start()`.
- [ ] **Step 7:** Kør `node tools/tjek-historier.mjs`. Forventet: `0 fejl`. Kør `node --test tests/ tests/e2e/`. Forventet: alle PASS.
- [ ] **Step 8:** Tilføj `.github/workflows/tjek.yml`, som på pull requests kører `node --test tests/` og `node tools/tjek-historier.mjs` på Node 22.
- [ ] **Step 9:** Commit, push og åbn pull request 1: "Historierne i egne filer". Beskriv, at spillet skal opføre sig præcis som før.

## Fase 2: Billeder (pull request 2)

### Task 4: Billeddele og scenebilleder

**Files:**
- Create: `art/dele.js`
- Test: `tests/art.test.mjs`

**Interfaces:**
- Produces: `LK.art.scene(spec: BilledSpec): string` returnerer en SVG-streng.
  `BilledSpec = { sted: Sted, himmel: 'nat'|'skumring'|'aften'|'dag', alt: string, figurer?: [{navn: Figur, x: number, y: number, skala?: number, humoer?: 'glad'|'bekymret'|'overrasket'|'rolig'}], ting?: [{navn: Ting, x, y, skala?, taendt?: boolean}] }`.
  Startsættet: `Sted` = `skovsti`, `lysning`, `baek`, `tornekrat`, `hule`, `lanternetrae`, `taage`, `sump`, `maanesoe`, `bjerg`, `festplads`. `Figur` = `uffe`, `nusse`, `moll`, `tut`, `maanen`, `vinden` og de seks følgesvende (`raev`, `bjorn`, `pind`, `lysorm`, `krage`, `mus`). `Ting` = `lanterne`, `gnist`, `gren`, `svamp`, `bog`, `brev`. Bygherren tilføjer flere, hvis en scene kræver det.
  Hver del er en funktion, der returnerer SVG-elementer som streng. Id'er inde i SVG'en får et unikt præfiks pr. kald, så flere billeder på samme side ikke deler gradienter.
- Stilen følger skitsen "A. Billedbog" i https://claude.ai/artifact/QaUcFjbao1gxSZ1BVANxHg version 1: mørkeblå himmel om natten, grønne trætrekanter i lag, brun gren, Uffe som brun oval med lys mave og store øjne, gyldne lanterner med en blød glød.

- [ ] **Step 1: Skriv de fejlende tests**

```js
test('scene giver en svg med viewBox og alt-tekst', () => {
  const s = LK.art.scene({ sted: 'skovsti', himmel: 'nat', alt: 'Uffe på en gren', figurer: [{ navn: 'uffe', x: 200, y: 130 }] });
  assert.match(s, /^<svg[^>]*viewBox="0 0 400 250"/);
  assert.match(s, /role="img"/); assert.match(s, /aria-label="Uffe på en gren"/);
});
test('ukendt del giver en tydelig fejl', () => assert.throws(() => LK.art.scene({ sted: 'mars', himmel: 'nat', alt: 'x' }), /Ukendt sted: mars/));
test('to billeder deler ikke id', () => {
  const ids = s => [...s.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
  const a = ids(LK.art.scene(spec)), b = ids(LK.art.scene(spec));
  assert.equal(a.filter(x => b.includes(x)).length, 0);
});
test('alle steder, figurer og ting kan tegnes', () => { /* løkke over LK.art.steder, LK.art.figurer, LK.art.ting */ });
```

- [ ] **Step 2:** Kør og se dem fejle.
- [ ] **Step 3:** Byg `art/dele.js` med `LK.art.steder`, `LK.art.figurer`, `LK.art.ting` (objekter med tegnefunktioner) og `LK.art.scene`. Bevægelser via CSS-klasserne `lk-blafr`, `lk-blink` og `lk-glimt`.
- [ ] **Step 4:** Kør og se dem bestå.
- [ ] **Step 5:** Lav `tools/vis-dele.html`, der viser alle dele og et par sammensatte scener, og tag ét skærmbillede med Playwright til eget eftersyn.
- [ ] **Step 6:** Commit: `git commit -m "Billeddele i billedbogsstil"`

### Task 5: Billeder i appen og til alle scener

**Files:**
- Modify: `index.html` (render og CSS), `stories/*/historie.js` (feltet `billeder`), `tools/tjek-historier.mjs` (kald med `kraevBilleder: true` fra kommandolinjen), `sw.js` (`VERSION = 'lk-v4'`)
- Test: `tests/e2e/gennemspil.test.cjs`

**Interfaces:**
- Consumes: `LK.art.scene` (Task 4), `Story.billeder` (Task 2).
- Produces: `render()` sætter `<figure class="scene-art">` med billedet øverst i `#stage`, derefter lanternerækken som en smal stribe og så overskriften. Lanternerne i den store top-SVG fjernes.

- [ ] **Step 1:** Udvid gennemspilningstesten: hver viste scene har præcis én `figure.scene-art svg[role="img"]`, og `figure.scene-art` står før `h2`. Med `reducedMotion: 'reduce'` har ingen element i billedet en kørende animation (`getAnimations().length === 0`).
- [ ] **Step 2:** Kør. Forventet: FAIL.
- [ ] **Step 3:** Byg visningen. Billedet fylder hele kortets bredde, højst `45vh` højt, med `object-fit`-agtig skalering via `preserveAspectRatio="xMidYMid slice"`. Lanternerækken viser samme antal tændte lanterner som i dag.
- [ ] **Step 4:** Skriv et `BilledSpec` for hver scene i de fire dele. Ok-, Fejl- og Hint-scener må genbruge stedet fra scenen før, men med det humør og lys, der passer.
- [ ] **Step 5:** Kør `node tools/tjek-historier.mjs` (nu med krav om billeder) og `node --test tests/ tests/e2e/`. Forventet: `0 fejl` og alle PASS.
- [ ] **Step 6:** Tag et skærmbillede af hver scene i telefonbredde og saml dem på én oversigtsside, som publiceres som artifact til ejeren.
- [ ] **Step 7:** Commit, push og åbn pull request 2: "Billeder til alle scener". Læg linket til oversigtssiden i beskrivelsen.

## Fase 3: Opskrift og prøvehistorie (pull request 3)

### Task 6: Forhåndsvisning og månedshistorier i appen

**Files:**
- Modify: `index.html`
- Test: `tests/e2e/maaned.test.cjs`, `tests/fixtures/stories-maaned/` (et lille katalog med en månedshistorie til testen)

**Interfaces:**
- Consumes: `LK.synlige` (Task 1).
- Produces:
  - `?preview=<id>`: indlæser historien uanset dato, opretter et eksempelhold (to helte, "Asta" og "Bo", med 2 point i hvert træk og følgesvenden `bjorn`), springer velkomst og opsætning over og går direkte til historiens start. I denne tilstand gemmer `saveLib` og alle andre `localStorage`-skrivninger ingenting, og der står en lille mærkat "Forhåndsvisning" øverst.
  - `?katalog=<sti>`: kun til tests; bruger et andet katalog.
  - For `type: 'maaned'`: overskriften viser "Månedens eventyr · <måned år>" i stedet for "Del X af N". Slutskærmen har "Tilbage til historierne" i stedet for "Spil næste del". `awardHtml` tæller `stories` op og sætter `done_<id>`, men skriver ikke `FRIEND_FLAGS` eller `gnistNavne`.
  - Listen over historier viser sagaen og derefter de synlige månedshistorier.

- [ ] **Step 1: Skriv de fejlende tests:**
  - en månedshistorie med `udgives` i fremtiden vises ikke på listen; med `?preview=<id>` åbner den direkte
  - efter en gennemspilning med `?preview=` er `localStorage` præcis som før
  - efter en gennemspilning uden preview er `lib.world` kun ændret med `done_<id>`, og heltenes `stories` er steget med 1
  - slutskærmen har "Tilbage til historierne" og ikke "Spil næste del"
- [ ] **Step 2:** Kør. Forventet: FAIL.
- [ ] **Step 3:** Byg det.
- [ ] **Step 4:** Kør `node --test tests/ tests/e2e/`. Forventet: alle PASS.
- [ ] **Step 5:** Commit: `git commit -m "Forhåndsvisning og månedshistorier"`

### Task 7: Regler, skill og prøvehistorie for december

**Files:**
- Create: `docs/historie-regler.md`
- Create: `.claude/skills/ny-historie/SKILL.md`
- Create: `stories/2026-12-<navn>/historie.js`, Modify: `stories/katalog.js`, `sw.js`

**Interfaces:**
- Consumes: alt ovenfor.
- Produces:
  - `docs/historie-regler.md`: reglerne fra specen under "Den månedlige historie", plus de mønstre de fire dele bruger (hub med stier, terningkast med `win`/`lose`, Fejl-scener der fører videre, Spørg børnene, følgesvendenes replikker, magi og mester), og en grænse på 15-30 scener.
  - `.claude/skills/ny-historie/SKILL.md` med `name: ny-historie` og en beskrivelse, der udløses af "lav månedens historie". Trinene:
    1. Find den ældste åbne issue med mærkatet `historie-idé`, ellers vælg et emne, der passer til årstiden.
    2. Læs `docs/historie-regler.md` og en eksisterende del som eksempel.
    3. Skriv `stories/<ÅÅÅÅ-MM>-<navn>/historie.js` med `type: 'maaned'` og `udgives` = den 1. i den kommende måned. Brug eksisterende billeddele, og tilføj kun nye i `art/dele.js`, hvis historien kræver det.
    4. Kør `node tools/tjek-historier.mjs` og `node --test tests/ tests/e2e/`, og ret, til alt er grønt.
    5. Hæv `VERSION` i `sw.js`.
    6. Åbn en pull request med titlen "Månedens historie: <titel> (<måned år>)". Beskrivelsen indeholder et kort resumé, idéens issue (`Closes #N`) og forhåndsvisningslinket `https://raw.githack.com/matimatay-sketch/Rpg-b-rnehistorier-app/<gren>/index.html?preview=<id>`.
    7. Følg pull requesten og ret efter ejerens kommentarer.
- [ ] **Step 1:** Skriv reglerne og skill'en.
- [ ] **Step 2:** Lav decemberhistorien ved at følge skill'en trin for trin, med `udgives: '2026-12-01'`.
- [ ] **Step 3:** Kør `node tools/tjek-historier.mjs` og `node --test tests/ tests/e2e/`. Forventet: `0 fejl`, alle PASS.
- [ ] **Step 4:** Åbn forhåndsvisningslinket i Playwright og tjek, at historien starter uden fejl i konsollen.
- [ ] **Step 5:** Commit, push og åbn pull request 3, som skill'en beskriver. Ejeren godkender decemberhistorien ved at merge.

## Fase 4: Den månedlige opgave (ingen pull request)

### Task 8: Planlagt opgave

**Interfaces:**
- Consumes: skill'en `ny-historie` (Task 7).
- Produces: en fast Claude-session "Lanterneskoven: månedens historie" på repoet og en planlagt opgave, der vækker den.

- [ ] **Step 1:** Opret mærkatet `historie-idé` på GitHub og en første issue med ejerens idé, hvis de har en.
- [ ] **Step 2:** Opret den faste session med `create_session` på repoet og grenen `main`.
- [ ] **Step 3:** Opret den planlagte opgave med `create_trigger`: `persistent_session_id` = den nye session, `cron_expression` = `CRON_TZ=Europe/Copenhagen 47 9 15 * *` (den 15. kl. 9:47, lidt før 10 så den ikke står i kø), og denne prompt:
  > Det er tid til månedens historie. Se først, om der er en åben pull request med titlen "Månedens historie". Er der det, så lav ingen ny historie, men skriv en kort, venlig påmindelse på den. Ellers: start grenen `claude/maanedens-historie-<ÅÅÅÅ-MM>` fra `origin/main`, brug skill'en `ny-historie`, og abonnér på pull requesten, når den er oprettet, så du kan rette efter ejerens kommentarer.
- [ ] **Step 4:** Kør opgaven én gang med `fire_trigger` og tjek med `list_events`, at sessionen finder decemberhistoriens pull request (hvis den ikke er merget) eller begynder på januar.
- [ ] **Step 5:** Fortæl ejeren, hvornår opgaven kører, og hvordan de skriver idéer.

## Fase 5: README (pull request 4)

### Task 9: Opdatér README

**Files:**
- Modify: `README.md`

- [ ] **Step 1:** Opdatér "Historierne", "Sådan er koden bygget op" og "Teknik": historierne ligger i `stories/`, billederne laves af delene i `art/dele.js`, en ny historie laves med skill'en `ny-historie`, tjek med `node tools/tjek-historier.mjs` og `node --test tests/ tests/e2e/`, og der kommer en ny historie den 1. i hver måned.
- [ ] **Step 2:** Commit, push og åbn pull request 4.
