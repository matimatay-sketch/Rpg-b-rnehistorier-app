# En ny historie hver uge – byggeplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ugentlige historier i serier: én hver fredag. November får en serie på 4 kapitler (6., 13., 20. og 27.), og Julestjernen deles op i 4 kapitler til december-fredagene. Den månedlige opgave laver fremover hele næste måneds serie i én pull request.

**Architecture:** Katalogposter og historiefiler får `serie`, `kapitel` og `kapitler`. Rene datohjælpere i `js/katalog.js` bruges af både motoren og tjekket. Motoren viser kapitel-overskrift og "næste kapitel" på slutskærmen. Tjekket validerer serier. Skill'en `ny-historie` laver en hel serie. Indholdet skrives ved at følge skill'en.

**Tech Stack:** Ren HTML/JS uden byggetrin. Node 22 `node:test`. Playwright (forudinstalleret).

**Spec:** `docs/superpowers/specs/2026-11-11-ugens-historie-design.md`

## Global Constraints

- Katalogpost for et kapitel: `{ id, fil, type: 'maaned', udgives: 'ÅÅÅÅ-MM-DD', serie: { id, titel }, kapitel: n, kapitler: N }`. Historiefilen har de samme felter. Id'er: `<ÅÅÅÅ-MM>-<serie-navn>-<n>`, mappe `stories/<id>/historie.js`.
- `udgives` for et kapitel er en fredag. Kapitlerne i en serie ligger på fredage i træk uden huller, i samme måned, og det sidste ligger på månedens sidste fredag. De er nummereret 1..N, og `kapitler` = N.
- En historie uden `serie` skal stadig udgives den 1. i måneden.
- Hvert kapitel: 15-30 scener, 1-2 bevægelser, et billede og et "Spørg børnene" pr. scene, ingen varige venne-flag. Gælder alle tidligere regler i `docs/historie-regler.md`.
- Overskrift: `Ugens eventyr · <serietitel> · kapitel <n> af <N>`.
- Slutskærmen for et kapitel:
  - er næste kapitel udgivet: knappen `Spil næste kapitel`
  - er det ikke udgivet endnu: `Næste kapitel kommer fredag den <d>. <måned>.`
  - er det sidste kapitel: `Næste måned kommer en ny serie.`
- Pull requestens titel indeholder `Månedens historie`, fx `Månedens historier: <serietitel> (<måned år>)`.
- November 2026: kapitlerne udgives 2026-11-06, 2026-11-13, 2026-11-20 og 2026-11-27. December 2026 (Julestjernen): 2026-12-04, 2026-12-11, 2026-12-18 og 2026-12-25.
- Hæv `VERSION` i `sw.js` (nu `lk-v11`) én gang pr. opgave, der ændrer filer, appen bruger.
- Testkommandoer: `node --test 'tests/*.test.mjs'`, `node --test 'tests/e2e/*.test.cjs'`, `node tools/tjek-historier.mjs`. `tests/e2e/gennemspil.forloeb.json` må ikke ændres.

## Review Focus

1. **Fredag kl. 00:00 lokal tid:** et kapitel er skjult torsdag kl. 23:59 og synligt fredag kl. 00:00. Test i Task 2.
2. **Halv udgivet serie:** kapitel 1 er ude, og kapitel 2 kommer om en uge. Slutskærmen viser datoen og ingen knap. Test i Task 2.
3. **Forhåndsvisning af et kommende kapitel** virker og gemmer intet. Test i Task 2.
4. **En serie, der starter midt i måneden** (november fra den 13.), godkendes af tjekket. En serie med et hul eller en ikke-fredag stoppes. Test i Task 1.
5. **Gamle referencer til `2026-12-julestjernen`** i tests, skill og docs fjernes, så intet peger på en fil, der ikke findes. Tjekket i Task 5.

---

### Task 1: Datohjælpere og tjek af serier

**Files:**
- Modify: `js/katalog.js`, `tools/tjek-historier.mjs`, `tests/katalog.test.mjs`
- Create: fixtures under `tests/fixtures/katalog-tjek/` (en god serie med 3 kapitler, en med hul, en med ikke-fredag, en hvor sidste kapitel ikke er månedens sidste fredag, en med forkert `kapitler`)
- Test: `tests/katalog.test.mjs`, `tests/tjek.test.mjs`

**Interfaces:**
- Produces, i `js/katalog.js`:
  - `LK.erFredag(dato: string): boolean`
  - `LK.sidsteFredag(aar: number, maaned: number /* 1-12 */): string`
  - `LK.fredageIMaaned(aar: number, maaned: number): string[]`
  - `LK.naesteKapitel(katalog: Entry[], entry: Entry): Entry | null`, samme serie, kapitel + 1
- Tjekket melder:
  - `'Et kapitel skal udgives på en fredag'`
  - `'Seriens kapitler skal ligge i samme måned'`
  - `'Serien har huller: kapitlerne skal ligge på fredage i træk'`
  - `'Seriens sidste kapitel skal ligge på månedens sidste fredag'`
  - `'Kapitlerne skal være nummereret 1 til ' + N`
  - `'Kapitlet har kapitler: ' + x + ', men serien har ' + N`
- `tests/katalog.test.mjs`: reglen "`udgives` er den 1." gælder kun poster uden `serie`.

- [ ] **Step 1: Skriv de fejlende tests**

```js
test('fredag', () => { assert.equal(LK.erFredag('2026-11-13'), true); assert.equal(LK.erFredag('2026-12-01'), false); });
test('sidste fredag', () => { assert.equal(LK.sidsteFredag(2026, 11), '2026-11-27'); assert.equal(LK.sidsteFredag(2027, 1), '2027-01-29'); });
test('fredage i december', () => assert.deepEqual(LK.fredageIMaaned(2026, 12), ['2026-12-04', '2026-12-11', '2026-12-18', '2026-12-25']));
test('næste kapitel', () => { /* kapitel 1 af serie s → kapitel 2 af s; sidste kapitel → null */ });
test('serie fra midt i måneden er god', () => assert.deepEqual(tjekKatalogFil('serie-god.js'), []));
test('hul', () => assert.match(beskeder('serie-hul.js'), /Serien har huller/));
test('ikke fredag', () => assert.match(beskeder('serie-ikke-fredag.js'), /Et kapitel skal udgives på en fredag/));
test('ikke sidste fredag', () => assert.match(beskeder('serie-ikke-sidste.js'), /månedens sidste fredag/));
test('forkert antal', () => assert.match(beskeder('serie-kapitler.js'), /men serien har/));
```

- [ ] **Step 2:** Kør `node --test 'tests/*.test.mjs'`. Forventet: de nye tests fejler.
- [ ] **Step 3:** Byg hjælperne og tjekket. Datoer håndteres som strenge og lokal kalender, uden tidszone-skift.
- [ ] **Step 4:** Kør igen. Forventet: alle PASS.
- [ ] **Step 5:** Commit: `Serier: fredage og tjek af kapitler`

### Task 2: Kapitler i motoren

**Files:**
- Modify: `index.html` (`overskrift` ca. linje 247, slutskærmen ca. 901, historielisten), `sw.js` (`VERSION = 'lk-v12'`)
- Create: `tests/fixtures/stories-uge/` (et katalog med sagaen og en serie med 3 kapitler, med billeder og én bevægelse hver)
- Test: `tests/e2e/uge.test.cjs`

**Interfaces:**
- Consumes: `LK.naesteKapitel`, katalogfelterne (Task 1).

- [ ] **Step 1: Skriv de fejlende e2e-tests** med `?katalog=tests/fixtures/stories-uge/katalog.js` og fast ur:
  - torsdag 23:59 før kapitel 2's fredag: kun kapitel 1 på listen. Fredag 00:00: kapitel 1 og 2, nyeste først.
  - overskriften i kapitel 1 er `Ugens eventyr · <serietitel> · kapitel 1 af 3`
  - slutskærmen i kapitel 1, når kapitel 2 ikke er udgivet: `Næste kapitel kommer fredag den <d>. <måned>.` og ingen `Spil næste kapitel`
  - når kapitel 2 er udgivet: `Spil næste kapitel` starter kapitel 2
  - i sidste kapitel: `Næste måned kommer en ny serie.`
  - `?preview=<kapitel 3>` før dets fredag åbner det og skriver intet til `localStorage`
  - en månedshistorie uden `serie` (fixture i `stories-maaned`) viser stadig `Månedens eventyr · <måned år>`
- [ ] **Step 2:** Kør `node --test 'tests/e2e/uge.test.cjs'`. Forventet: FAIL.
- [ ] **Step 3:** Byg det.
- [ ] **Step 4:** Kør alle tests og tjekket. Forventet: alle PASS.
- [ ] **Step 5:** Commit: `Kapitler i motoren`

### Task 3: Skill, regler og README til serier

**Files:**
- Modify: `.claude/skills/ny-historie/SKILL.md`, `docs/historie-regler.md`, `README.md`

Skill'en:
- laver en hel serie til den kommende måned, ét kapitel pr. fredag (`LK.fredageIMaaned`), på grenen `claude/maanedens-historie-<ÅÅÅÅ-MM>`
- skriver ét kapitel ad gangen og kører tjekket efter hvert kapitel
- springer over, hvis `main` har en historie med `udgives` i den kommende måned
- bruger én `historie-idé` til hele serien
- åbner én pull request med titlen `Månedens historier: <serietitel> (<måned år>)`. Beskrivelsen har et resumé pr. kapitel med dato, et forhåndsvisningslink pr. kapitel, bevægelseslisten pr. kapitel, "godkend senest den 1." og `Closes #N`
- har stopreglen: efter tre seriøse forsøg åbnes pull requesten som kladde med fejlene
- skriver om kapitlernes sammenhæng: samme figurer og mål, kort tilbageblik, hvert kapitel kan spilles alene og har sin egen gode slutning

`docs/historie-regler.md` får et afsnit "Serier og kapitler". README nævner en ny historie hver fredag.

- [ ] **Step 1:** Skriv ændringerne.
- [ ] **Step 2:** Tjek, at skill'ens eksempler og fejlbeskeder passer ord for ord med `tools/tjek-historier.mjs` (Task 1).
- [ ] **Step 3:** Commit: `Skill og regler: en serie om måneden, en historie om ugen`

### Task 4: November-serien (4 kapitler)

**Files:**
- Create: `stories/2026-11-<serie>-1/historie.js` … `-4`
- Modify: `stories/katalog.js`, `sw.js` (`VERSION = 'lk-v13'`), eventuelt `art/dele.js` for nye dele i stil A med registry-test

Lav serien ved at følge skill'en (Task 3) trin for trin. Emnet er sent efterår i Lanterneskoven (fx første frost, trækfugle, lange mørke aftener). Kapitlerne udgives 2026-11-06, 2026-11-13, 2026-11-20 og 2026-11-27.

- [ ] **Step 1:** Skriv kapitel 1 og kør `node tools/tjek-historier.mjs`. Gentag for kapitel 2-4.
- [ ] **Step 2:** Kør alle tests. `maanedens.test.cjs` spiller hvert kapitel i forhåndsvisning med "klarede" og "vaklede". Forventet: alle PASS, `Ingen fejl i 9 historier`.
- [ ] **Step 3:** Tag ét skærmbillede pr. kapitel af en scene med bevægelse, og se dem selv.
- [ ] **Step 4:** Commit: `November-serien: <serietitel>`

### Task 5: Julestjernen i 4 kapitler

**Files:**
- Delete: `stories/2026-12-julestjernen/`
- Create: `stories/2026-12-julestjernen-1/historie.js` … `-4`
- Modify: `stories/katalog.js`, `sw.js` (`VERSION = 'lk-v14'`), tests og docs, der nævner `2026-12-julestjernen` (`tests/maanedshistorier.test.mjs`, `tests/e2e/offline.test.cjs`, skill, regler, README)

Serie `{ id: '2026-12-julestjernen', titel: 'Julestjernen' }`. Den nuværende historie er udgangspunktet: Uffe nyser, og Nusses julestjerne springer i fire stykker.
- **Kapitel 1** (2026-12-04): kælkebakken.
- **Kapitel 2** (2026-12-11): Tut på Månesøen.
- **Kapitel 3** (2026-12-18): Molls julegåde.
- **Kapitel 4** (2026-12-25): snemanden, og stjernen på Lanternetræet.

Hvert kapitel udbygges til 15-30 scener med sin egen gode slutning, hvor ét stykke er fundet. Genbrug de eksisterende scener, billeder, bevægelser og venne-linjer, hvor de passer, og følg alle regler. Kapitel 4's slutning er den store julestjerne-slutning.

- [ ] **Step 1:** Skriv kapitlerne ét ad gangen med tjekket efter hvert. Slet den gamle fil, og ret alle referencer. `grep -rn "2026-12-julestjernen'" .` må kun finde serie-id'et.
- [ ] **Step 2:** Kør alle tests. Forventet: alle PASS, `Ingen fejl i 12 historier`, og `gennemspil.forloeb.json` uændret.
- [ ] **Step 3:** Commit: `Julestjernen i fire kapitler`
