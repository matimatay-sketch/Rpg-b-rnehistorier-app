# Bevægelsesudfordringer i stedet for nogle terningkast

**Dato:** 2026-11-11
**Status:** Klar til godkendelse

## Hvorfor

Lanterneskoven er lavet til at blive spillet sammen, og "skærmen er bogen, ikke legetøjet". Ejeren vil have, at børnene nogle gange rejser sig og gør det, heltene gør i historien. Når heltene skal over bækken på en træstamme, går børnene på line hen over stuegulvet. Det giver mere leg og mindre skærm.

## Hvad det er

En **bevægelsesudfordring** bruges ligesom et terningkast. Den fører til den samme "lykkedes"-scene og den samme "mislykkedes"-scene. Forskellen er, at familien selv afgør, hvordan det gik, ved at trykke på **"Vi klarede det!"** eller **"Vi vaklede"**. Ligesom ved terningen er det aldrig en blindgyde: "Vi vaklede" fører videre ad den anden vej i historien.

## Mål

1. Udvalgte terningvalg i både de fire eksisterende dele og de nye månedshistorier bliver til bevægelsesudfordringer.
2. Familien kan slå bevægelse fra i indstillingerne. Så bliver hver bevægelsesudfordring til et almindeligt terningkast med et træk, der passer.
3. Den månedlige historie får også bevægelsesudfordringer, efter de samme regler.

## Ikke med

- Telefonen måler ikke selv bevægelsen, hverken med kamera eller med bevægelsessensor. Familien afgør det.
- Ingen tidtagning, point eller ranglister for bevægelserne.
- Ingen billeder eller videoer, der viser bevægelsen. Instruktionen er tekst, som læses op ligesom resten.

## Det må ikke ske

- En bevægelse er farlig eller kan give en skade: klatring, at springe ned fra noget, løb om kap, at snurre rundt til man bliver svimmel, eller noget man gør på trapper, møbler eller nær vinduer.
- En bevægelse kræver noget, familien typisk ikke har ved hånden.
- Et barn, der ikke kan eller vil, bliver holdt ude eller gjort til grin. "Vi vaklede" skal føles lige så fint som "Vi klarede det!", og teksten bagefter skal være venlig og sjov.
- Familier, der har slået bevægelse fra, mister en vej i historien eller en mulighed, som terningen ellers gav.
- Gemte data går tabt eller skifter format.

## Begrænsninger

- Samme teknik som resten af appen: ren HTML/JS, intet byggetrin, virker uden net.
- Indstillinger gemmes i `lk-prefs` som i dag (`auto`, `big`). Et nyt felt må tilføjes, men gamle indstillinger skal kunne læses som før.
- Gennemspilningstesten, der låser de fire deles tekst fast, må kun ændre sig præcis der, hvor terningvalg bliver til bevægelser. Ændringerne skal kunne tjekkes ord for ord.
- Forhåndsvisningen gemmer stadig ingenting, heller ikke indstillingen.

## Fremgangsmåder, der blev overvejet

**A. Ekstra valg ved siden af terningen.** Bevægelsen kommer som et ekstra valg, og terningvalgene bliver, som de er. Det er nemt, og ingen mister noget, men mange familier ville måske altid springe bevægelsen over.

**B. Bevægelse i stedet for nogle terningkast (valgt).** Udvalgte terningvalg bliver til bevægelser. Slår man bevægelse fra, bliver de til terningkast igen. Alle møder bevægelserne, og knappen i indstillingerne sørger for, at det stadig passer til sengetid og bilture. Ejeren valgte B.

## Det, der er besluttet

### Sådan ser det ud

- Et bevægelsesvalg ser ud som et terningvalg, men mærket viser 🤸 i stedet for 🎲 og trækket. *(Claudes valg.)*
- Når man vælger det, vises en boks i stedet for terningboksen:
  - en kort instruktion, fx "Læg et snørebånd på gulvet. Gå på det hele vejen uden at træde ved siden af." Den kan læses højt med Læs højt-knappen ligesom alt andet
  - hvem der gør det: helten, der har tur, og gerne alle andre også *(Claudes valg)*
  - to knapper: **"Vi klarede det!"** og **"Vi vaklede"**
- Der vises ingen procent-chance, fordi familien selv afgør det. *(Claudes valg.)*
- Følgesvendens bemærkninger og Uffes fjer bruges ikke ved bevægelser. Fjeren bruges kun ved terningkast. *(Claudes valg.)*
- Ved "Vi klarede det!" går historien til den samme scene, som et vellykket kast ville føre til, og "Vi vaklede" til den samme som et mislykket kast. Optælling af kast (`rolls`) og tur (`turn`) sker på samme måde som ved et kast.

### Indstillingen

- I værktøjslinjen, hvor "Læs højt" og "Stor skrift" ligger, kommer en knap: **"Bevægelse"**. Den er **slået til fra starten**, så alle møder bevægelserne. *(Claudes valg.)*
- Slået fra: hvert bevægelsesvalg vises og virker som et almindeligt terningvalg, med det træk og den sværhed, der står i bevægelsens data, og med samme tekst og samme to udfald.
- Indstillingen gemmes i `lk-prefs` som `bevaeg`. Mangler feltet (gamle indstillinger), betyder det slået til.

### I historiefilerne

- Et bevægelsesvalg er et valg med feltet `bevaeg` i stedet for `roll`:
  `{ label, bevaeg: { goer: '<instruktion>', stat, target, win, lose } }`.
  `stat` og `target` bruges kun, når bevægelse er slået fra. Navnene på felterne kan bygherren justere.
- Teksten i `label` skal give mening i begge tilstande, fx "Gå over stammen, ét skridt ad gangen". Når bevægelse er slået til, står instruktionen i boksen.
- **De fire eksisterende dele:** 2-3 bevægelsesudfordringer pr. del, i scener hvor kroppen er med i historien. Fx bækken med stammen (del 1), tornekrattet (del 1), tågen eller sumpen (del 2), blæsten på bjerget (del 3) og dansen eller lanternerne til festen (del 4). Det er det eksisterende terningvalg med samme handling, der bliver til en bevægelse, så teksten i "lykkedes"- og "mislykkedes"-scenerne stadig passer.
- **Julestjernen:** 1-2 bevægelsesudfordringer på samme måde, fx kælkebakken eller snemanden.

### Gode bevægelser

En liste i reglerne for historierne, som historierne vælger fra eller laver variationer af. Bevægelserne skal kunne laves på et stuegulv uden særlige ting:
- gå på line, fx et snørebånd, et tæppekant eller en streg af puder
- stå på ét ben, mens man tæller til ti
- liste helt lydløst fra den ene ende af stuen til den anden
- hoppe som en frø tre gange
- balancere en bog eller en bamse på hovedet
- lave sig så lille som en mus eller så stor som en bjørn
- spejle hinanden, hvor den ene gør, og den anden gør det samme
- blæse en fjer eller et stykke papir hen over bordet

### Regler, opskrift og tjek

- `docs/historie-regler.md` får et afsnit om bevægelsesudfordringer: sikkerhedsreglerne fra "Det må ikke ske", listen over gode bevægelser, at "Vi vaklede"-scenen skal være venlig og sjov, og at en månedshistorie har 1-3 bevægelsesudfordringer.
- Skill'en `ny-historie` skal bede om dem.
- Historietjekket fanger:
  - et bevægelsesvalg uden instruktion
  - et bevægelsesvalg uden `stat` og `target` til terningen
  - et bevægelsesvalg uden "lykkedes"- og "mislykkedes"-mål, eller hvor målene ikke findes
  - en månedshistorie uden bevægelsesudfordringer
- Tjekket af blindgyder skal regne bevægelsesvalg med som valg i begge tilstande.

### Afklaret efter gennemlæsning (Claudes valg, kan rettes)

- **"Mislykkedes"-scenerne ændres ikke.** "Vi vaklede" fører til den samme scene som et mislykket kast, med de samme følger. Mister man fx den blå gnist i bækken ved et mislykket kast, mister man den også ved "Vi vaklede". Til bevægelser vælges de terningvalg, hvor "mislykkedes"-scenen allerede er venlig og sjov.
- **Slutskærmen:** "Terningkast: N" tæller kun terningkast. Har man lavet bevægelser, står der også "Bevægelser: N".
- **Højst én bevægelse pr. scene.** Den kan dele "lykkedes"- og "mislykkedes"-scene med terningvalgene ved siden af.
- **Lysskjold og Uffes fjer** bruges kun ved terningkast.
- **Prøv ikke igen:** har valget en `key`, kan det ligesom et terningvalg ikke vælges igen i samme scene.
- **Slår man bevægelse til eller fra midt i en scene,** gælder det fra næste skærm.

## Det, bygherren selv afgør

- Det præcise navn på felterne og hvordan boksen ser ud, så længe den ligner terningboksen og bruger appens farver.
- Hvilke konkrete terningvalg i de fire dele der bliver til bevægelser, inden for 2-3 pr. del og reglerne ovenfor.
- Ordlyden af instruktionerne.
- Hvordan bevægelsesvalg vises i forhåndsvisningen (med eksempelholdet, slået til).

## Test

- Unit-tests for tjekkets nye regler.
- E2e:
  - et bevægelsesvalg viser instruktionen og de to knapper
  - "Vi klarede det!" og "Vi vaklede" fører til de rigtige scener
  - med bevægelse slået fra bliver valget til et terningkast
  - indstillingen gemmes og huskes, men ikke i forhåndsvisningen
- Gennemspilningstesten optages igen. Ændringerne tjekkes ord for ord, så kun de valgte terningvalg er ændret.
