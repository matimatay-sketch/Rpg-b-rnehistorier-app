---
name: ny-historie
description: Brug, når du skal lave månedens historie til Lanterneskoven ("lav månedens historie", "skriv en ny historie", "ny månedshistorie"), enten fra den planlagte månedlige opgave eller når ejeren beder om det i chatten.
---

# Ny historie til Lanterneskoven

Opskriften på en ny månedshistorie: én selvstændig, illustreret historie, som ejeren spiller igennem fra et link og godkender ved at merge en pull request. Historien bliver synlig for familierne den 1. i måneden.

**Reglerne for indholdet står i `docs/historie-regler.md`. De gælder altid.** Denne fil er arbejdsgangen.

**Er skill'en ikke registreret** i sessionen (fx i en planlagt session, hvor `ny-historie` ikke står blandt skills), så læs denne fil direkte fra disken, `.claude/skills/ny-historie/SKILL.md` i repoet, og følg den.

## GitHub-trinene, og når de ikke kan lade sig gøre

Flere trin bruger GitHub: find issues med mærkatet `historie-idé`, find en åben pull request med "Månedens historie" i titlen, åbn pull requesten, skriv en kommentar, og følg pull requesten. Den planlagte session har ikke altid de samme værktøjer. Gør sådan:

1. **Prøv først GitHub-værktøjerne (MCP).** De er ofte udskudte og skal hentes med `ToolSearch`, fx `select:mcp__github__list_issues,mcp__github__list_pull_requests,mcp__github__create_pull_request,mcp__github__add_issue_comment`. Repoet er `matimatay-sketch/Rpg-b-rnehistorier-app`.
2. **Ellers `gh`,** hvis kommandoen findes og er logget ind (`gh auth status`).
3. **Følg pull requesten** med `subscribe_pr_activity`, hvis værktøjet findes (hent det også med `ToolSearch`).
4. **Kan et trin ikke gøres** (intet værktøj, ingen adgang, en fejl, der kommer igen), så prøv ikke igen og igen. Push grenen, hvis der er en, og stop. Skriv til sidst i sessionen en tydelig besked til ejeren: hvad der er lavet, hvilken gren det ligger på, hvilket trin der ikke kunne gøres, og præcis hvad ejeren selv skal gøre (fx "Åbn en pull request fra grenen `claude/maanedens-historie-2026-12` mod `main` med titlen …, og læg forhåndsvisningslinket … i beskrivelsen").

Kan du ikke se, om der er en åben "Månedens historie"-pull request (før du begynder, trin 1), så lav ikke en ny historie. Stop med en besked til ejeren om, at det ikke kunne tjekkes.

## Før du begynder

1. **Er sidste måneds historie godkendt?** Søg efter åbne pull requests med "Månedens historie" i titlen (`mcp__github__list_pull_requests` med `state: open`, eller `gh pr list --search "Månedens historie in:title" --state open`). Se "GitHub-trinene" ovenfor, hvis det ikke kan lade sig gøre.
   - Findes der en, så lav **ikke** en ny historie. Skriv en kort, venlig påmindelse som kommentar på den åbne pull request (`mcp__github__add_issue_comment` med pull requestens nummer, eller `gh pr comment`), fx: "Hej! Månedens historie venter stadig på at blive læst og godkendt. Spil den fra linket i beskrivelsen, og merge, når den er klar. Skriv en kommentar her, hvis noget skal rettes." Stop så.
2. **Har den kommende måned allerede en historie?** Historien er til **den kommende måned**, dvs. måneden efter dagens dato. Kører du den 15. november 2026, er det december 2026, og `udgives` er `'2026-12-01'`. Hent den nyeste `main` (`git fetch origin main`), og læs `stories/katalog.js` på `origin/main` (`git show origin/main:stories/katalog.js`).
   - Står der allerede en historie med `udgives` den 1. i den kommende måned, så stop uden at gøre noget: ingen gren, ingen pull request og ingen kommentar.
3. Lav en gren fra den nyeste `main`: `claude/maanedens-historie-<ÅÅÅÅ-MM>`, fx `claude/maanedens-historie-2026-12`.

## Trin

### 1. Find idéen

Find den ældste åbne issue med mærkatet `historie-idé` (`mcp__github__list_issues` med `labels: ["historie-idé"]` og `state: OPEN`, eller `gh issue list --label historie-idé --state open`), og tag den med det laveste nummer. Brug idéen, og husk issue-nummeret til `Closes #N`. Kan issues ikke læses, så vælg selv et emne som nedenfor, og skriv det i pull requestens beskrivelse.

Er der ingen, så vælg selv et emne, der passer til årstiden og måneden (sne og jul i december, forår og spirer i april, sommerferie og bær i juli, blade og høst i oktober). Tjek i `stories/katalog.js`, at emnet ikke ligner en tidligere månedshistorie for meget.

### 2. Læs reglerne og et eksempel

- Læs `docs/historie-regler.md` hele vejen igennem.
- Læs `stories/lantern/historie.js` (hub med stier, terningkast, Fejl-scener, gnister, magi, mester, billeder) og den nyeste månedshistorie i `stories/` (fx `stories/2026-12-julestjernen/historie.js`).
- Læs toppen af `art/dele.js` og listen over `steder`, `figurer` og `ting`. Se dem tegnet ved at åbne `tools/vis-dele.html` i en browser.
- `k` er kittet fra `js/kit.js` (`k.state`, `k.joinNames`, `k.gnistNames`, `k.lockTxt`, `k.partyStat`, `k.crew`, `k.stats`, `k.esc`). Brug ikke `k.friendLines()` i en månedshistorie: linjerne er skrevet til sagaen (fx kommer Nusse genert frem bag et træ), og de passer ikke, hvis figuren allerede er med i historien. Skriv historiens egne venne-linjer ud fra `k.state.flags`, og udelad de venner, der allerede er med.

### 3. Skriv historien

Lav `stories/<ÅÅÅÅ-MM>-<navn>/historie.js`. `<navn>` er et kort ord uden æøå, fx `julestjernen`. Historiens id er hele mappenavnet.

```js
// Månedens historie, <måned år>: <titel>. Historiefil: registrerer sig med LK.addStory og får kit-hjælperne som k.
LK.addStory(function (k) {
  var scenes = { /* 15-30 scener, alle id'er med et fælles præfiks, fx snStart, snHub */ };
  var magi = { /* scene-id -> { gnist, dyr, syn, latter } */ };
  var mester = { /* scene-id -> [{ stat, l, to, n }] */ };
  var billeder = { /* scene-id -> { sted, himmel, alt, ting, figurer } */ };
  return {
    id: '<ÅÅÅÅ-MM>-<navn>', type: 'maaned', udgives: '<ÅÅÅÅ-MM>-01',
    start: '<første scene>', title: '<Titel>', tag: '<Måned>', blurb: '<én sætning til listen>',
    scenes: scenes, magi: magi, mester: mester, billeder: billeder
  };
});
```

Tilføj den i `stories/katalog.js` efter sagaen:

```js
{ id: '<ÅÅÅÅ-MM>-<navn>', fil: 'stories/<ÅÅÅÅ-MM>-<navn>/historie.js', type: 'maaned', udgives: '<ÅÅÅÅ-MM>-01' }
```

Sådan skriver du:

- Planlæg først: en start med en figur, der har brug for hjælp; en hub med 3-4 stier, hvor hver sti har et terningkast med en Ok- og en Fejl-scene; en finale med 3-4 glade slutninger plus en mester-slutning.
- Hver scene har titel, tekst, et **Spørg børnene**-spørgsmål og et billede.
- Hver Fejl-scene er sød eller sjov og fører videre. Ingen blindgyder.
- Sæt aldrig et venne-flag (`nusseVen`, `nusseHonning`, `mollLoefte`, `tutVen`, `maaneVen`, `vindVen`). Læs dem gerne.
- Læs teksten højt for dig selv. Er en sætning svær at læse højt, så del den op.

**Billeder:** brug de eksisterende dele i `art/dele.js`. Tilføj kun en ny del (et sted, en figur eller en ting), hvis historien virkelig har brug for den, fx sne til en vinterhistorie. En ny del:

- tegnes i stil A (flade former, varme farver, bløde runde kanter, tydelige øjne), i en ramme på 400 x 250,
- bruger `c.u(...)` eller `c.ny(...)` til gradienter og de fælles klasser `lk-blafr`, `lk-blink`, `lk-glimt` til bevægelse,
- en ny figur bruger `ansigt(h, ...)`, så alle fire humører ser forskellige ud,
- kommer med i listen i testen `startsættet findes` i `tests/art.test.mjs` og får en lille test af sine egne valg.

### 4. Tjek

```
node tools/tjek-historier.mjs
node --test 'tests/*.test.mjs'
node --test 'tests/e2e/*.test.cjs'
```

Ret, til alt er grønt (`Ingen fejl i N historier` og ingen fejlede tests). Tjekket sammenligner også hver post i `stories/katalog.js` med sin fil (samme `id`, `type` og `udgives`) og kører alle magi- og mester-valgenes funktioner. E2e-testen `tests/e2e/maanedens.test.cjs` spiller automatisk alle månedshistorier i kataloget igennem i forhåndsvisningen to gange (med terningen høj og lav) og fejler ved fejl i konsollen.

**Stopregel:** er tjekket eller testene stadig ikke grønne efter 3 seriøse forsøg på at rette dem, så stop med at rette. Commit og push, og åbn pull requesten som **kladde** (`draft: true`, eller `gh pr create --draft`) med den fejlende uddata i beskrivelsen og en kort forklaring af, hvad du har prøvet. Kan der ikke åbnes en pull request, så stop med beskeden til ejeren (se "GitHub-trinene").

Se derefter billederne med dine egne øjne: start en server i repoet (`python3 -m http.server 8000`), åbn `http://localhost:8000/index.html?preview=<id>` i Playwright, og tag skærmbilleder af nogle scener (`deviceScaleFactor: 1`). Se efter figurer, der dækker hinanden, står i luften eller er skåret over, og ret dem én gang.

### 5. Hæv VERSION

Hæv `VERSION` i `sw.js` med én, fx `'lk-v7'` til `'lk-v8'`. Historiefilen skal ikke stå i nogen liste i `sw.js`: appen beder selv service workeren gemme alle katalogets filer, også de kommende, så historien også åbner på udgivelsesdagen uden net.

### 6. Åbn en pull request

Commit på grenen, og push. Åbn en pull request mod `main` (`mcp__github__create_pull_request`, ellers `gh pr create`; se "GitHub-trinene", hvis ingen af dem virker):

- **Titel:** `Månedens historie: <titel> (<måned år>)`, fx `Månedens historie: Julestjernen (december 2026)`.
- **Beskrivelse:**
  - et kort resumé af historien (3-5 sætninger, gerne med de sjoveste øjeblikke),
  - `Closes #N` for idéens issue (udelad linjen, hvis du selv valgte emnet),
  - forhåndsvisningslinket: `https://raw.githack.com/matimatay-sketch/Rpg-b-rnehistorier-app/<gren>/index.html?preview=<id>`,
  - en linje om, at historien bliver synlig for familierne den 1. i måneden, når pull requesten er merget.

### 7. Følg pull requesten

Abonnér på pull requestens aktivitet (`subscribe_pr_activity`, hent det med `ToolSearch`, hvis det er udskudt). Findes værktøjet ikke, så skriv i beskeden til ejeren, at kommentarer på pull requesten ikke bliver set automatisk, og at ejeren kan bede om rettelser i chatten i stedet. Når ejeren skriver en kommentar, så ret historien efter den, kør tjekket igen (trin 4, med samme stopregel), commit og push til samme gren, og svar kort på kommentaren med, hvad du har rettet (`mcp__github__add_issue_comment` med pull requestens nummer, eller `gh pr comment`). Er en kommentar uklar, så spørg på pull requesten i stedet for at gætte.

Merge aldrig selv. Ejerens merge er godkendelsen.

## Almindelige fejl

| Fejl | Gør i stedet |
|------|--------------|
| Scene-id'er som `start` eller `hub` | Et præfiks for historien: `snStart`, `snHub` |
| `flag: 'nusseVen'` i en månedshistorie | Et eget flag, fx `flag: 'sneIStoevlerne'` |
| En Fejl-scene uden `next` | Fejl fører altid videre, fx tilbage til hubben |
| Spørgsmål med ét rigtigt svar | Åbne spørgsmål om følelser, valg og fantasi |
| Ny tegnet del for noget, der allerede findes | Genbrug delene; tilføj kun det, historien mangler |
| Glemt at hæve `VERSION` i `sw.js` | Hæv den i samme pull request |
| Ny pull request, mens sidste måneds stadig er åben | Skriv en påmindelse på den åbne i stedet |
| Prøve et GitHub-trin igen og igen | Push grenen, stop, og skriv til ejeren, hvad de skal gøre |
| Rette i det uendelige, når tjekket ikke bliver grønt | Efter 3 seriøse forsøg: kladde-pull request med den fejlende uddata |
