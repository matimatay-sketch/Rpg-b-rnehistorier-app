# Bevægelsesudfordringer – byggeplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Udvalgte terningkast bliver til bevægelser, som familien selv bedømmer med "Vi klarede det!" eller "Vi vaklede". En indstilling slår bevægelse fra, så de bliver til terningkast igen.

**Architecture:** Et nyt valgfelt `bevaeg` i historiefilerne. Motoren i `index.html` viser en bevægelsesboks i stedet for terningboksen, når `prefs.bevaeg` er slået til. Er den slået fra, behandles valget som et almindeligt `roll` med samme `stat`, `target`, `win` og `lose`. Tjekket i `tools/tjek-historier.mjs` validerer feltet og antallet. Indholdet ændres ved at gøre eksisterende `roll`-valg om til `bevaeg` med samme label, træk og sværhed.

**Tech Stack:** Ren HTML/JS uden byggetrin. Node 22 `node:test`. Playwright (forudinstalleret).

**Spec:** `docs/superpowers/specs/2026-11-11-bevaegelse-design.md`

## Global Constraints

- Intet byggetrin og ingen afhængigheder. Klassiske scripts, der virker fra `file://`.
- `lk-prefs` får feltet `bevaeg` (boolean). Mangler feltet, betyder det slået til. `auto` og `big` læses som før.
- Forhåndsvisningen gemmer intet, heller ikke `bevaeg`.
- Knaptekster, præcis: `Vi klarede det!` og `Vi vaklede`. Mærke på valget: `🤸`. Indstillingsknap: `Bevægelse`.
- Slutskærmen: `Terningkast: N` tæller kun terningkast. `Bevægelser: N` vises kun, når N > 0.
- Højst 2 bevægelser pr. historie, både saga-dele og månedshistorier. En månedshistorie har mindst 1.
- Højst én bevægelse pr. scene.
- Lysskjold og Uffes fjer bruges kun ved terningkast.
- "Mislykkedes"-scenerne ændres ikke.
- Hæv `VERSION` i `sw.js` (nu `lk-v8`) til `lk-v9`.
- Testkommandoer: `node --test 'tests/*.test.mjs'`, `node --test 'tests/e2e/*.test.cjs'`, `node tools/tjek-historier.mjs`.

## Review Focus

1. **En familie med gamle indstillinger** (`lk-prefs` = `{"auto":false,"big":true}`) får bevægelse slået til, og `big` bevares. Test i Task 2.
2. **Bevægelse slået fra:** valget ser ud og virker præcis som det gamle terningvalg (samme mærke `🎲 <stat>`, samme chance, samme udfald). Derfor er gennemspilningens optagelse uændret, når den kører med bevægelse slået fra. Test i Task 2 og Task 3.
3. **"Vi vaklede" ved et valg med `key`**: valget kan ikke vælges igen i samme scene, ligesom et mislykket kast. Test i Task 2.
4. **Forhåndsvisning:** et tryk på `Bevægelse` skifter tilstand, men skriver intet til `localStorage`. Test i Task 2.
5. **En AI-skrevet månedshistorie med 3 bevægelser eller ingen** stoppes af tjekket, før den når ejeren. Test i Task 1.

---

### Task 1: Tjekket kender bevægelser

**Files:**
- Modify: `tools/tjek-historier.mjs`
- Create: `tests/fixtures/bevaeg-god.js`, `tests/fixtures/bevaeg-uden-goer.js`, `tests/fixtures/bevaeg-uden-terning.js`, `tests/fixtures/bevaeg-for-mange.js`, `tests/fixtures/maaned-uden-bevaeg.js`
- Test: `tests/tjek.test.mjs`

**Interfaces:**
- Produces: valgformatet `{ label, key?, bevaeg: { goer: string, stat: string, target: number, win: string, lose: string } }`. `stat` er et af trækkene i `js/data.js`.

Tjekket:
- samler `bevaeg.win` og `bevaeg.lose` som mål, ligesom `roll.win` og `roll.lose`, og regner et bevægelsesvalg som et valg i blindgyde-tjekket
- `besked: 'Bevægelse uden instruktion'`, når `goer` mangler eller er tom
- `'Bevægelse uden træk og sværhed til terningen'`, når `stat` ikke er et kendt træk, eller `target` ikke er et tal fra 2 til 12
- `'For mange bevægelser (højst 2)'` for en historie med flere end 2 bevægelsesvalg i alt. Valget tælles én gang pr. scene og label, uanset tilstand.
- `'To bevægelser i samme scene'`, hvis en scene viser flere end én
- `'Månedshistorien har ingen bevægelser'` for `type: 'maaned'` uden bevægelsesvalg

- [ ] **Step 1: Skriv de fejlende tests**

```js
test('god bevægelse giver ingen fejl', () => assert.deepEqual(tjek(['tests/fixtures/bevaeg-god.js']), []));
test('uden instruktion', () => assert.match(beskeder('bevaeg-uden-goer.js'), /Bevægelse uden instruktion/));
test('uden terning', () => assert.match(beskeder('bevaeg-uden-terning.js'), /Bevægelse uden træk og sværhed til terningen/));
test('for mange', () => assert.match(beskeder('bevaeg-for-mange.js'), /For mange bevægelser \(højst 2\)/));
test('månedshistorie uden bevægelse', () => assert.match(beskeder('maaned-uden-bevaeg.js'), /Månedshistorien har ingen bevægelser/));
test('bevægelsens mål tjekkes', () => { /* bevaeg-god med lose: 'findesikke' → /fører til "findesikke"/ */ });
```

- [ ] **Step 2:** Kør `node --test 'tests/*.test.mjs'`. Forventet: de nye tests fejler.
- [ ] **Step 3:** Byg reglerne i `tools/tjek-historier.mjs`.
- [ ] **Step 4:** Kør igen. Forventet: alle PASS, bortset fra at `node tools/tjek-historier.mjs` nu melder `Månedshistorien har ingen bevægelser` for Julestjernen. Det rettes i Task 3. Opdatér de eksisterende månedshistorie-fixtures i `tests/fixtures/stories-maaned/` med én bevægelse hver, så de stadig er gyldige.
- [ ] **Step 5:** Commit: `Tjekket kender bevægelser`

### Task 2: Bevægelser i motoren

**Files:**
- Modify: `index.html` (valgknapper ca. linje 924-939, `startRoll` ca. 955, værktøjslinjen `toolsHtml`/`bindTools` ca. 605-620, `prefs` ca. 548, slutskærmen ca. 901, `compRemark` ca. 358), `sw.js`
- Create: `tests/fixtures/stories-maaned/` får en lille saga-agtig testhistorie med ét bevægelsesvalg med `key`, eller en eksisterende fixture udvides
- Test: `tests/e2e/bevaeg.test.cjs`

**Interfaces:**
- Consumes: valgformatet fra Task 1.
- Produces: `prefs.bevaeg` (boolean, standard `true`), gemt i `lk-prefs`. `state.bevaegelser` (tal) tæller gennemførte bevægelser.

Adfærd:
- **Bevægelse slået til:** valgknappen får mærket `🤸`. Et tryk viser en boks (samme plads og stil som terningboksen) med instruktionen `goer`, linjen "<heltens navn> prøver, og alle må gerne være med", og knapperne `Vi klarede det!` og `Vi vaklede`. Knapperne går til `win` og `lose` med samme bogføring som et kast (`state.turn++`, `key` blokeres). `state.bevaegelser++`, ikke `state.rolls`. Ingen fjer og intet lysskjold. Instruktionen læses højt, når "Læs altid højt" er slået til.
- **Bevægelse slået fra:** valget omdannes, før det vises, til `{ label, key, roll: { stat, target, win, lose } }` og opfører sig præcis som et terningvalg.
- `compRemark` regner et bevægelsesvalg som en udfordring, ligesom `roll`.
- Værktøjslinjen får knappen `Bevægelse` med `aria-pressed`. Skift gælder fra næste skærm.
- Slutskærmen viser `<span>Bevægelser: N</span>` efter `Terningkast`, kun når N > 0.
- `VERSION = 'lk-v9'`.

- [ ] **Step 1: Skriv de fejlende e2e-tests** i `tests/e2e/bevaeg.test.cjs`, med `?katalog=` til fixture-kataloget:
  - et bevægelsesvalg har mærket `🤸`, og et tryk viser instruktionen og knapperne `Vi klarede det!` og `Vi vaklede`
  - `Vi klarede det!` fører til `win`-scenen, og `Vi vaklede` fører til `lose`-scenen
  - efter `Vi vaklede` på et valg med `key` er valget deaktiveret, når scenen vises igen
  - med `lk-prefs` = `{"bevaeg":false}` har valget mærket `🎲 <stat>`, og et tryk viser terningboksen med chancen
  - et tryk på `Bevægelse` gemmer `bevaeg:false` i `lk-prefs`, og `big` bevares
  - med gamle `lk-prefs` = `{"auto":false,"big":true}` er bevægelse slået til, og stor skrift er stadig slået til
  - i `?preview=` skifter `Bevægelse` tilstand uden et eneste `localStorage.setItem`
  - slutskærmen viser `Bevægelser: 1` efter én bevægelse og ingen `Bevægelser`-linje uden
- [ ] **Step 2:** Kør `node --test 'tests/e2e/bevaeg.test.cjs'`. Forventet: FAIL.
- [ ] **Step 3:** Byg det.
- [ ] **Step 4:** Kør alle tests og tjekket. Forventet: alle PASS, bortset fra tjekkets kendte melding om Julestjernen fra Task 1.
- [ ] **Step 5:** Commit: `Bevægelser i motoren og indstillingen Bevægelse`

### Task 3: Bevægelser i historierne, regler og opskrift

**Files:**
- Modify: `stories/lantern/historie.js`, `stories/maane/historie.js`, `stories/vind/historie.js`, `stories/fest/historie.js`, `stories/2026-12-julestjernen/historie.js`, `docs/historie-regler.md`, `.claude/skills/ny-historie/SKILL.md`, `README.md`, `tests/e2e/gennemspil.test.cjs`, `tests/e2e/maanedens.test.cjs`

**Interfaces:**
- Consumes: valgformatet (Task 1) og motoren (Task 2).

Indhold:
- 1-2 bevægelser pr. del og i Julestjernen, aldrig flere og aldrig to i samme scene. Hver bevægelse er et eksisterende `roll`-valg, der gøres om til `bevaeg` med **uændret** `label`, `stat`, `target`, `win`, `lose` og `key`, plus en `goer`. Vælg valg, hvor handlingen er kropslig, og hvor "mislykkedes"-scenen allerede er venlig og sjov. Forslag: del 1 "Gå over stammen, ét skridt ad gangen" (Mod) i `bro`; del 2 et valg i tågen eller sumpen; del 3 et valg i blæsten på bjerget; del 4 et valg ved dansen eller lanternerne; Julestjernen kælkebakken eller snemanden.
- `goer` bruger en bevægelse fra listen i specen ("Gode bevægelser") og følger sikkerhedsreglerne: på stuegulvet, uden særlige ting, ingen klatring, ingen spring ned fra noget, intet om kap, ingen snurren.
- `docs/historie-regler.md` får et afsnit "Bevægelser" med specens regler og listen. Skill'en `ny-historie` beder om 1-2 bevægelser i hver månedshistorie efter afsnittet, og dens fejltabel nævner de nye beskeder fra tjekket. README nævner bevægelser under "Det er med" og knappen `Bevægelse`.

Tests:
- `tests/e2e/gennemspil.test.cjs` kører gennemspilningen med `lk-prefs` = `{"bevaeg":false}`. Så er optagelsen `gennemspil.forloeb.json` **uændret**. Den må ikke optages igen.
- `tests/e2e/maanedens.test.cjs` spiller hver månedshistorie igennem i forhåndsvisning to gange med bevægelse slået til: én gang med terningen høj og `Vi klarede det!`, én gang med den lav og `Vi vaklede`. Begge når slutskærmen uden fejl i konsollen.
- En e2e-test spiller del 1 til slut med bevægelse slået til og trykker `Vi klarede det!` ved hver bevægelse, uden fejl.

- [ ] **Step 1:** Sæt `{"bevaeg":false}` i gennemspilningens init-script og udvid `maanedens.test.cjs` som beskrevet. Kør og se maanedens fejle, fordi Julestjernen ingen bevægelser har.
- [ ] **Step 2:** Gør valgene om i de fem historier og skriv reglerne, skill'en og README.
- [ ] **Step 3:** Kør `node tools/tjek-historier.mjs`. Forventet: `Ingen fejl i 5 historier`. Kør `git diff --exit-code tests/e2e/gennemspil.forloeb.json`. Forventet: ingen ændringer. Kør alle unit- og e2e-tests. Forventet: alle PASS.
- [ ] **Step 4:** Commit: `Bevægelser i alle historier, regler og opskrift`
