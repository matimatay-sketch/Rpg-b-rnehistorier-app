# Forside, indstillinger og tilbage-knap: noter fra brainstorm

**Dato:** 2026-11-11
**Status:** Påbegyndt brainstorm. Ikke et godkendt design. Fortsæt i en ny session med `/brainstorming`, og brug skill'en `frontend-design` til selve udseendet.

## Hvad ejeren har sagt

- Lanterneskoven skal være et abonnement. Det kræver login, men **login og abonnement er et separat projekt** (ejerens valg). Det kommer efter navigationen.
- Ejeren vil have:
  - en **forside**
  - en **knap til indstillinger**
  - en **tilbage-knap**, som man kan bruge blandt andet midt i en historie. Ejeren skrev først "tilbagekøbsprogrammet" og bekræftede bagefter, at det betyder tilbage-knap.

## Sådan er appen i dag (november 2026)

- **Ingen rigtig forside.** Velkomsten (`renderWelcome` i `index.html`) vises kun første gang. Bagefter starter appen direkte i heltelisten og valget af historie (`renderSetup`).
- **Indstillingerne er spredt.**
  - Knapperne "Læs højt", "Læs altid højt", "Stor skrift" og "Bevægelse" ligger i værktøjslinjen øverst i hver scene (`toolsHtml`).
  - "Nulstil skovens venner" ligger i heltelisten.
  - "Installér app" og "Om Lanterneskoven" ligger i bunden af siden.
- **Ingen vej ud af en historie.** Midt i en historie kan man ikke komme tilbage til listen. "Tilbage til historierne" findes kun på slutskærmen.
- **Historier:** sagaen i 4 dele og ugentlige kapitler i serier, et nyt hver fredag.
- **Appen husker ikke, hvor man var** midt i en historie. Kun helte, venner og indstillinger gemmes (`lk-heroes`, `lk-prefs`, `lk-welcomed`).

## Claudes forslag (ikke godkendt endnu)

- **Tilbage-knap:** sidder øverst i hver scene og fører til forsiden. Går man midt i en historie, mister man sin plads. Derfor spørger appen først: "Vil I stoppe historien her? I kan altid starte forfra."
- **Indstillinger:** en tandhjulsknap fører til én side med "Læs højt", "Læs altid højt", "Stor skrift", "Bevægelse", "Nulstil skovens venner", "Installér app" og "Om Lanterneskoven".

## Åbent spørgsmål, som skal besvares først

**Hvad skal en familie kunne gøre fra forsiden en almindelig aften?** Fx:
- starte ugens nye kapitel med det samme
- vælge blandt alle historier
- fortsætte en historie, de stoppede midt i

Den sidste mulighed kræver, at appen husker, hvor man var. Det kan den ikke i dag, og det skal i så fald designes, så gemte data bevares.

## Regler, der stadig gælder

- Ren HTML/JS uden byggetrin, og appen skal virke uden net.
- Gemte data må ikke gå tabt eller skifte format.
- Forhåndsvisning (`?preview=`) gemmer intet.
- "Skærmen er bogen, ikke legetøjet": rolig og enkel, så den ikke tager opmærksomheden fra oplæsningen.
- Gennemspilningstesten (`tests/e2e/gennemspil.forloeb.json`) skal blive ved med at bestå.
- Hæv `VERSION` i `sw.js`, når filer, appen bruger, ændres.
