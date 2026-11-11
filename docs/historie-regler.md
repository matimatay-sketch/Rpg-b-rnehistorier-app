# Regler for historierne i Lanterneskoven

Denne fil er husets regler for alle nye historier, også dem, der laves automatisk hver måned.
Opskriften på selve arbejdet står i `.claude/skills/ny-historie/SKILL.md`. Læs begge, før du skriver.

## Hvem historien er til

- Børn på 6-9 år, der spiller sammen med en voksen, der læser højt.
- Skærmen er bogen, ikke legetøjet. Teksten og samtalen er det vigtigste. Billederne støtter oplæsningen og må ikke tage opmærksomheden.

## Det må aldrig ske

- En historie kommer ud til familierne uden ejerens godkendelse. Godkendelsen er, at ejeren merger pull requesten.
- En historie er uhyggelig, voldelig eller skammer et barn.
- Et mislykket terningkast stopper historien. Et mislykket kast er aldrig en blindgyde.
- En ny historie ødelægger de gamle historier eller familiernes gemte helte.
- Appen holder op med at virke uden internet.

## Tone

- Venlig og varm. Lidt spænding er fint, men aldrig uhyggeligt. Ingen monstre, ingen der bliver slået, ingen der er i rigtig fare, ingen der bliver væk fra deres voksne.
- Sjov på en blid måde: pudsige lyde, små uheld, figurer der griner af sig selv. Man griner aldrig af et barn eller af en, der er ked af det.
- Når noget går galt, er det et uheld, ingen skyld. Figurerne trøster og prøver igen.
- Korte sætninger, der er lette at læse højt. Ét eller to afsnit pr. scene, og 1-4 sætninger pr. afsnit.
- Replikker står i &laquo;&raquo;: skriv `&laquo;Hu-hu!&raquo; siger Uffe.` Brug `&hellip;` til tre prikker.
- Skriv "I" og "jer" til børnene. Det er dem, der er heltene.
- Ingen farlige ting, børn kan finde på at efterligne (fx at gå ud på tynd is eller røre ild).

## Indhold

- **Et selvstændigt eventyr i Lanterneskoven.** Historien skal kunne spilles uden at have spillet de andre. Den må gerne nævne venner, familien har fået i tidligere dele (læs `k.state.flags`), men den må ikke forudsætte dem.
- **Brug skovens figurer:** Uffe uglen, nissen Nusse, muldvarpen Moll, tudsen Tut, Månen og Vinden, og dyrene ræv, bjørn, pindsvin, lysorm, krage og mus. Nye figurer er i orden, hvis historien har brug for dem.
- **Passer til årstiden.** En historie til december handler om sne og jul, en til april om forår og så videre.
- **Brug de eksisterende træk, magier og følgesvende** fra `js/data.js`. Opfind ingen nye.
  - Træk: Mod, List, Venlighed, Fantasi, Humor, Nysgerrighed.
  - Magier: Gnistmagi (`gnist`), Dyresprog (`dyr`), Skjulte syn (`syn`), Latterstøv (`latter`) og Lysskjold (`skjold`, virker af sig selv ved terningkast).
- **En god slutning, hvor børnene er lykkedes med noget.** Alle slutninger er glade. Også den slutning, man når med færrest gnister, skal føles som en sejr.
- **Længde: 15-30 scener**, cirka som en af de fire dele (Del 1 har 22 scener). Et gennemspil tager 10-20 minutter.

## Hver scene

- `title`: kort titel, 1-4 ord.
- `text`: en liste med afsnit eller en funktion, der giver en liste.
- `ask`: et **Spørg børnene**-spørgsmål. Hver scene har ét. Det er et åbent spørgsmål om følelser, valg eller fantasi, som ikke har et rigtigt svar ("Hvad ville I gøre, hvis …?", "Hvordan tror I, … har det?"). Ikke et quizspørgsmål.
- Enten `choices`, `next`, `dyn` eller `end: true`.
- Et billede i `billeder` med samme id (se nedenfor).

## Mønstre, de fire dele bruger

Se `stories/lantern/historie.js` for et helt eksempel.

- **Hub med stier.** En scene (fx `hub`) med `dyn`, der viser de stier, man ikke har gået endnu. Hver sti-scene har `path: '<navn>'`, så den kommer i `k.state.visited`. Når mindst én sti er gået, kan man gå videre til finalen. En sti kan låses med `lock: function () { return k.lockTxt('Nysgerrighed', 2); }`.
- **Terningkast med `win` og `lose`.** Et valg med `roll: { stat: 'Mod', target: 6, win: '<idOk>', lose: '<idFejl>' }`. Brug `target` 6 som standard og 7 for noget svært. Giv to eller tre valg med forskellige træk, så alle helte kan bidrage.
- **Fejl-scener fører videre.** En scene, der ender på `Fejl` eller `Hint`, viser, at det gik skævt, men på en sød eller sjov måde, og fører altid videre med `next` (fx tilbage til hubben). Følgesvenden trøster automatisk i scener, hvis id ender på `Fejl` eller `Hint`.
- **Gnister.** En scene med `gain: true` og `gnist: { c, def, col, ph }` giver en gnist, som børnene kan navngive. Finalen kan tælle `k.state.gnists` og nævne dem med `k.joinNames(k.gnistNames())`.
- **Gåde.** Forkerte svar med `key` og `wrong: '<venlig besked>'` bliver på scenen. Et terningkast kan give et hint (`...Hint` med `next` tilbage til gåden).
- **Spørg børnene.** Se ovenfor. Spørgsmålet må være en funktion, hvis det afhænger af tilstanden.
- **Følgesvendenes replikker** kommer af sig selv: ved start, ved hver anden udfordring, i Fejl- og Hint-scener og til sidst. Skriv dem ikke selv i teksten.
- **Magi** (`magi`): nøglet efter scene-id og magiens id, fx `magi.bro.dyr = { l: 'Spørg en bæver ...', to: 'broOk' }`. Giv magi-valg i de scener, hvor der slås med terningen, og i finalen. Magi springer terningen over og fører til den gode udgang. `show` og `eff` er valgfrie.
- **Mester** (`mester`): nøglet efter scene-id, en liste med `{ stat, l, to, n }`. Vises kun for en helt med 5 i trækket. `n(navn)` giver en sætning om, hvad helten gør. Finalen har et mester-valg for alle seks træk, der fører til en mester-slutning.
- **Uffes fjer.** En scene med `gainFeather: true` giver Uffes fjer, som giver +1 til ét terningkast.
- **Flag.** En scene med `flag: '<navn>'` husker noget i dette eventyr, fx at man blev våd, så finalen kan nævne det.

## Regler for månedshistorier

- `type: 'maaned'` i kataloget og `udgives: 'ÅÅÅÅ-MM-01'`, den 1. i den måned, historien er til.
- Historiens id er mappens navn, fx `2026-12-julestjernen`, så det aldrig støder sammen med en anden historie.
- **Scene-id'er skal være unikke på tværs af alle historier.** Giv alle scener et kort præfiks for historien, fx `snStart`, `snHub`, `snBakkeOk`.
- En gennemført månedshistorie tæller som et eventyr, så heltene stiger i level.
- Den må læse vennerne (`k.state.flags.nusseVen`, `k.crew()`, `k.friendLines()`), men må **aldrig sætte** et af venne-flagene `nusseVen`, `nusseHonning`, `mollLoefte`, `tutVen`, `maaneVen` eller `vindVen`. Brug egne flag-navne til det, der kun gælder i eventyret.
- Ingen "næste del". Slutskærmen viser selv et link tilbage til listen.

## Billeder

- Hver scene, man kan nå, har et billede i `billeder` med samme id: `{ sted, himmel, alt, ting, figurer, maane }`. Se toppen af `art/dele.js` for alle dele og valg.
- Stil A, billedbog: flade, enkle former, varme farver, tydelige ansigter. Rammen er 400 x 250.
- `himmel` sætter stemningen: `nat` når det er svært eller mørkt, `skumring` når det lysner, `aften` når det er lykkedes, `dag` i dagslys.
- `humoer` (`glad`, `bekymret`, `overrasket`, `rolig`) skal passe til teksten.
- `alt` er en kort sætning, der beskriver billedet.
- Brug de dele, der findes. Tilføj kun en ny del i `art/dele.js`, hvis historien virkelig har brug for den. En ny del tegnes i samme stil og får en test i `tests/art.test.mjs` (listen over dele og at den kan tegnes).
- Hold billederne rolige: højst 3-5 figurer, og figurerne må ikke dække hinanden.

## Tjek

- `node tools/tjek-historier.mjs` skal give `Ingen fejl`. Det tjekker, at alle valg fører til en scene, der findes, at hver scene har titel, tekst, spørgsmål og billede, at alle veje kan nå en slutning, at der ikke er blindgyder, at ingen scene-id findes i to historier, og at en månedshistorie ikke sætter et venne-flag.
- `node --test 'tests/*.test.mjs'` og `node --test 'tests/e2e/*.test.cjs'` skal være grønne. E2e-testen `tests/e2e/maanedens.test.cjs` spiller alle månedshistorier i kataloget igennem i forhåndsvisningen.
