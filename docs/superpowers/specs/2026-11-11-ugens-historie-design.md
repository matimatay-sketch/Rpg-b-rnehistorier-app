# En ny historie hver uge

**Dato:** 2026-11-11
**Status:** Godkendt af ejeren 2026-11-11, med ændringerne under "Ejerens tilføjelser"

## Hvorfor

Lanterneskoven skal blive en abonnementsforretning, og ejeren vil have, at familierne "får noget for pengene". En ny historie hver uge giver familierne følelsen af, at abonnementet hele tiden giver noget nyt. I dag kommer der én historie om måneden.

## Hvad der er besluttet med ejeren

- **En ny historie hver uge** i stedet for hver måned.
- **Samme længde som i dag:** 15-30 scener pr. historie.
- **Månedens historier hænger sammen** som kapitler i én fortælling. Hver har sin egen gode slutning.
- **Godkendelse én gang om måneden (fremgangsmåde B):** den automatiske opgave den 15. skriver alle næste måneds ugehistorier i én pull request, og ejeren godkender dem samlet ved at merge.

## Mål

1. Hver fredag bliver en ny historie synlig for familierne.
2. Den 15. i hver måned laver den planlagte Claude-session alle næste måneds ugehistorier i én pull request.
3. Ejeren kan læse og spille hvert kapitel fra pull requesten, før de godkendes.

## Ikke med

- Kortere historier. Længden bliver, som den er.
- At et kapitel kræver, at man har spillet det forrige.
- Ændringer i saga-delene, Julestjernen eller abonnement og betaling.

## Det må ikke ske

- En uge uden ny historie, når månedens pull request er godkendt.
- En historie bliver synlig før sin fredag, eller uden ejerens godkendelse.
- Kapitlerne skriver varige venner eller flag, så de gemte data ændrer sig. Reglerne for månedshistorier gælder uændret.
- Alt, der står under "Det må ikke ske" i de tidligere designs (historier og bevægelser).

## Begrænsninger

- **Den planlagte opgave kører allerede** (den 15. kl. 9:47), og dens tekst kan ikke ændres fra denne session. Den leder efter en åben pull request med "Månedens historie" i titlen og springer over, hvis der findes en historie med `udgives` den 1. i den kommende måned. Derfor:
  - pull requestens titel skal fortsat indeholde "Månedens historie" (fx "Månedens historier: …")
  - skill'en `ny-historie` står for resten
- Samme teknik og samme regler som i dag: ren HTML/JS, virker uden net, og gemte data bevares.
- Julestjernen (`udgives: '2026-12-01'`, en tirsdag) skal fortsat virke og vises.

## Det, der er besluttet

### Udgivelse
- **En historie hver fredag i måneden.** Det bliver fire eller fem, alt efter hvor mange fredage måneden har. *(Claudes valg.)*
- `udgives` er datoen for en fredag. Den bliver synlig fra kl. 00:00 den dag, efter enhedens lokale dato, som i dag.
- **Start allerede i november 2026** (ejerens valg, se "Ejerens tilføjelser").

### Serien
- Hver historie i katalogen og i historiefilen får `serie` (id og titel, fx `{ id: '2027-01-vinterkongen', titel: 'Vinterkongens kort' }`) og `kapitel` (nummer) samt `kapitler` (antal i serien). Bygherren vælger de præcise navne.
- **Overskriften** viser i stedet for "Månedens eventyr · <måned år>": "Ugens eventyr · <serietitel> · kapitel <n> af <antal>". *(Claudes valg.)*
- **Historielisten** viser de udgivne kapitler med nyeste først, ligesom månedshistorier i dag.
- **Kapitlerne hænger sammen i fortællingen:** samme figurer og samme mål, og kapitel 2 kan kort nævne, hvad der skete i kapitel 1. Hvert kapitel kan dog spilles alene og har sin egen gode slutning. Det kræver ikke flag fra det forrige.
- **Slutskærmen** for et kapitel siger, at næste kapitel kommer på fredag, hvis det ikke er udgivet endnu. Er det udgivet, får man et "Spil næste kapitel". *(Claudes valg.)*
- Julestjernen og andre ældre månedshistorier uden `serie` vises som i dag.

### Den automatiske opgave og skill'en
- Skill'en `ny-historie` laver alle ugehistorier til den kommende måned i én kørsel, på én gren og i én pull request:
  - **Titel:** "Månedens historier: <serietitel> (<måned år>)", som indeholder "Månedens historie", så den planlagte opgaves tjek finder den.
  - **Beskrivelse:** et forhåndsvisningslink pr. kapitel, kapitlernes datoer og listen over bevægelser pr. kapitel.
  - **Spring over:** findes der allerede en historie med `udgives` i den kommende måned på `main`, laver den ingenting (som i dag).
- Én idé fra `historie-idé`-issues bruges til hele månedens serie.
- Regler og tjek gælder for hvert kapitel for sig: 15-30 scener, 1-2 bevægelser, et billede pr. scene og et "Spørg børnene" pr. scene.
- **Stopregel:** kan tjekket ikke blive grønt for alle kapitler efter tre seriøse forsøg, åbnes pull requesten som kladde med fejlene, som i dag.

### Tjekket
- Et kapitel med `serie` skal have `udgives` på en fredag.
- Kapitlerne i en serie skal ligge i samme måned, være nummereret 1 til N uden huller og have én historie pr. fredag i måneden.
- Dagens regel om, at `udgives` er den 1. i måneden, gælder kun for historier uden `serie`.

### Afklaret efter gennemlæsning (Claudes valg, kan rettes)

- **Den planlagte opgaves eget tjek:** opgaven stopper kun selv, hvis der er en historie den 1. i den kommende måned. Ellers kalder den skill'en, og det er skill'ens tjek ("en historie med `udgives` i den kommende måned"), der sørger for, at der ikke laves en serie to gange. Opgavens tekst skal ikke ændres.
- **Sen godkendelse:** godkender ejeren efter den første fredag, bliver de kapitler, hvis fredag er passeret, synlige med det samme. Det accepteres. Pull requestens beskrivelse beder om godkendelse senest den 1., og den eksisterende påmindelse på en åben pull request bevares.
- **Antal kapitler følger kalenderen:** fire eller fem, og fortællingen lægges an på det antal.
- **Sidste kapitel** viser ingen "næste kapitel"-knap. Slutskærmen siger i stedet, at der kommer en ny serie næste måned.

## Ejerens tilføjelser (godkendt 2026-11-11)

- **November 2026 får en serie på 4 kapitler** til fredagene 6., 13., 20. og 27. november (ejerens valg). 6. november er gået, så kapitel 1 bliver synligt, så snart pull requesten er merget. Emnet vælges efter årstiden (sent efterår), da der ikke er nogen idé-issue.
- **Julestjernen deles op i 4 kapitler** til december-fredagene 4., 11., 18. og 25. december. Historien om de fire stykker af Nusses julestjerne passer naturligt: hvert kapitel finder ét stykke (kælkebakken, Månesøen, Molls julegåde, snemanden), og kapitel 4 sætter stjernen på Lanternetræet. Hvert kapitel får samme længde som en hel historie i dag (15-30 scener) og 1-2 bevægelser. Den nuværende `udgives: '2026-12-01'` udgår.
- **Tjekkets regel for en serie** bliver: kapitlerne ligger på fredage i rækkefølge uden huller, i samme måned, og det sidste kapitel ligger på månedens sidste fredag. Så kan en serie starte midt i en måned, som november. For en serie, der laves den 15. til den kommende måned, betyder det i praksis én historie pr. fredag.
- **Pull requesten** til de to serier hedder "Månedens historier: november og december 2026", så den planlagte opgave den 15. november ser den og kun skriver en påmindelse, hvis den ikke er godkendt endnu.
- **Tidsfrist:** kapitel 1 kommer ud ved merge, og kapitel 2 fredag den 13. november. Godkendes pull requesten senere, kommer alle kapitler, hvis fredag er passeret, ud på én gang.

## Det, bygherren selv afgør

- Felternes præcise navne og formen på `serie`.
- Hvordan "næste kapitel"-knappen og teksten om næste fredag ser ud.
- Hvordan katalogtesten og fixtures tilpasses.
- Hvordan skill'en deler arbejdet op, så fire eller fem lange historier kan laves i én kørsel uden at ramme sessionens grænser. Fx ét kapitel ad gangen, med tjek efter hvert kapitel.

## Test

- Unit: tjekkets nye regler (fredag, samme måned, nummerering, én pr. fredag) og at historier uden `serie` stadig skal udgives den 1.
- E2e:
  - et kapitel er skjult torsdag kl. 23:59 og synligt fredag kl. 00:00
  - overskriften viser serie og kapitel
  - "Spil næste kapitel" vises kun, når det næste kapitel er udgivet
  - Julestjernen vises som før
  - forhåndsvisningen viser et kommende kapitel
