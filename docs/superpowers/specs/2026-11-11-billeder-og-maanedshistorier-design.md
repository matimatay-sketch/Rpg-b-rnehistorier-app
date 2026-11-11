# Billeder til scenerne og en ny historie hver måned

**Dato:** 2026-11-11
**Status:** Klar til godkendelse
**Projekt:** 1 af 3 (2 er konti og abonnement, 3 er universet og den ugentlige familiemission)

## Hvorfor

Lanterneskoven skal på sigt være en app med månedligt abonnement. Det, familierne betaler for, er **én ny historie hver måned**, og den skal have **et billede til hver scene**. I dag er scenerne næsten kun tekst, og de fire eksisterende dele er alt indhold, der findes.

Ejeren vil have det så automatisk som muligt: AI skriver historierne og tegner billederne. Ejeren kan komme med idéer og skal **godkende hver historie, før den bliver lagt op**.

Projektet skal bevise, at det kan lade sig gøre at lave en god, illustreret historie hver måned uden meget håndarbejde, før der bygges konti og betaling (projekt 2).

## Mål

1. Alle scener i de fire eksisterende dele får en tegning i den valgte billedstil.
2. En ny historie er nogle nye filer, der kan lægges til uden at røre de andre historier.
3. En gang om måneden laver en planlagt Claude-session en ny historie med billeder og åbner en pull request.
4. Ejeren kan spille historien igennem fra et link, før den godkendes.
5. Ejeren godkender ved at merge pull requesten. Først da kommer historien ud til familierne.
6. Ejeren kan give idéer til kommende historier fra telefonen.

## Ikke med i dette projekt

- Konti, login, betaling og låsning af indhold bag abonnement (projekt 2).
- Ugentlig familiemission og andre dele af universet (projekt 3).
- En redaktørside i selve appen. Den kræver en server og hører til projekt 2.
- Malede eller fotolignende billeder. Billederne er tegninger lavet i koden.
- Familiens egne helte inde i scenebillederne. Heltene vises stadig som i dag.

## Det må ikke ske

- En historie kommer ud til familierne uden ejerens godkendelse.
- En historie er uhyggelig, voldelig, skammer et barn eller har en blindgyde, hvor et mislykket kast stopper historien. Spillet lover i dag, at "et mislykket kast er aldrig en blindgyde".
- Billederne tager opmærksomheden fra oplæsningen eller gør spillet til mere skærmtid. "Skærmen er bogen, ikke legetøjet."
- En ny historie ødelægger de gamle eller familiernes gemte helte.
- Appen holder op med at virke uden internet.

## Begrænsninger

- Spillet er ren HTML, CSS og JavaScript uden byggetrin og uden afhængigheder. Det skal blive ved med at være sådan.
- Repoet er offentligt, og den færdige app ligger på `main`.
- Appen er en PWA med `sw.js`. Den gemmer filer til brug uden net, og `VERSION` skal hæves, når filer ændres.
- Gemte data ligger i `localStorage` (`lk-heroes`, `lk-prefs`, `lk-welcomed`) og skal kunne læses som før.
- Claude kan ikke lave malede billeder eller fotos, kun tegninger som SVG i koden.
- Målgruppen er børn på 6-9 år, der spiller sammen med en voksen, der læser højt.

## Sådan virker det i dag

- Alt ligger i `index.html` (ca. 1900 linjer).
- `STORIES` (linje ca. 234) er listen over de fire dele med `id`, `start`, `title`, `tag` og `blurb`.
- `S` (linje ca. 635) er et objekt med alle scener. Hver scene har `title`, `text` (tekst eller funktion), `ask`, og enten `choices`, `next` eller en `dyn`-funktion, der bygger valg ud fra spillets tilstand (gnister, venner, træk, terningkast). Nogle scener har `end`, `lit`, `all` eller `gnist`.
- `MAGIC_OPTS` og `MAX_OPTS` er nøglet efter scene-id og giver magi- og mester-valg i bestemte scener.
- `COMP_VOICE` giver følgesvendenes replikker.
- `render()` (linje ca. 1784) tegner en scene. I toppen er der en række lanterner (`LAMPS`, `setLamps`), der lyser mere, jo længere man kommer.
- Del 2-4 bygger videre på flag fra de tidligere dele, fx venner og gnister.

## Fremgangsmåder, der blev overvejet

### Billedstil

Tre stilarter blev vist som skitser af den samme scene: **A. Billedbog** (flade former, varme farver, tydelige ansigter), **B. Akvarel** (bløde kanter og papirstruktur) og **C. Skyggeteater** (silhuetter i lag med lys, der gløder). En blanding af A og C blev også vist.

**Valgt: A. Billedbog.** Ejeren valgte den. Den er hurtigst at lave nye scener i, er nemmest at holde ens fra historie til historie, og ansigterne er tydelige, så børnene kan se, hvad figurerne føler.

Skitserne: https://claude.ai/artifact/QaUcFjbao1gxSZ1BVANxHg (version 1 viser A, B og C).

### Hvordan en ny historie bliver til

1. **Månedlig automatisk opgave, der godkendes med et merge (valgt).** En planlagt Claude-session skriver historien og tegner billederne, åbner en pull request og giver et link, hvor historien kan spilles. Ejeren godkender ved at merge. Det kan bygges nu uden server.
2. **Redaktørside i appen.** Ejeren trykker "Lav ny historie" og "Godkend" i appen. Det kræver server, login og betaling for AI-brug, altså projekt 2's fundament. Fravalgt nu, men kan bygges oven på løsning 1 senere.
3. **Ejeren beder om det i chatten hver måned.** Det er ikke automatisk. Fravalgt.

**Valgt: 1.** Ejeren valgte den.

## Det, der er besluttet

### Billederne

- Stilen er **A. Billedbog**: flade, enkle former, varme farver, bløde runde kanter og tydelige øjne.
- Hver scene får **ét billede øverst**, over teksten, som i en billedbog.
- Billederne er **SVG tegnet i koden**, så de fylder lidt, er skarpe på alle skærme og virker uden net.
- Små, rolige bevægelser er tilladt: lanterner, der blafrer, stjerner, der blinker, og figurer, der blinker med øjnene. Ingen bevægelse, når enheden beder om mindre bevægelse (`prefers-reduced-motion`).
- **Genbrugelige dele:** figurer (Uffe, følgesvendene, Månen, Vinden og andre faste figurer), steder (fx skovsti, lysning, Månesøen, bjerget, Lanternetræet) og ting (lanterner, gnister, grene). En scene sættes sammen af et sted, figurer og ting. Så ser Uffe ens ud i alle scener, og en ny historie kan bruge de dele, der allerede findes, og kun tegne det nye.
- **Stemning** styres af himlen og lyset: mørk nat, skumring eller varm, lys aften, så billedet passer til, hvordan det går i historien.
- Alle de scener, man kan nå i de fire eksisterende dele, får et billede.

### Historierne som filer

- Hver historie flyttes ud af `index.html` til sin egen mappe, så en ny historie er nye filer og ikke en ændring i resten.
- Der er én liste over historier, som appen læser for at vide, hvilke der findes. Den erstatter `STORIES`.
- De fire eksisterende dele skal virke præcis som i dag efter flytningen, også flagene mellem delene og de gemte data.

### Den månedlige historie

- **Rækkefølge og sammenhæng:** De fire første dele er stadig én fortælling i rækkefølge. Hver månedshistorie er **et selvstændigt eventyr i Lanterneskoven**, som kan spilles uden at have spillet de andre. Den må gerne nævne venner, familien har fået i tidligere dele.
- **Idéer:** Ejeren skriver idéer som issues på GitHub med mærkatet `historie-idé`. Det kan gøres fra telefonen. Den månedlige session bruger den ældste åbne idé. Er der ingen, vælger den selv et emne, der passer til årstiden.
- **Regler for historierne:** en fast regelfil i repoet beskriver tone, længde og indhold, så alle historier bliver ens i kvalitet. Den bygger på det, de fire dele allerede gør:
  - til børn på 6-9 år, der spiller sammen med en voksen
  - venlig og varm, lidt spænding er fint, men aldrig uhyggeligt, voldeligt eller skamfuldt
  - hver scene har et "Spørg børnene"-spørgsmål
  - et mislykket terningkast fører altid videre, aldrig til en blindgyde
  - der er en god slutning, hvor børnene er lykkedes med noget
  - historien bruger de eksisterende træk, magier og følgesvende
  - cirka samme længde som en af de eksisterende dele
- **Automatisk tjek:** et script tjekker hver historie: at alle valg fører til en scene, der findes, at hver scene har tekst, titel, spørgsmål og billede, at alle veje kan nå en slutning, og at der ikke er blindgyder. Den månedlige session skal have et grønt tjek, før den åbner pull requesten.
- **Planlagt opgave:** en planlagt Claude-session kører én gang om måneden, den 15. kl. 10 dansk tid, så ejeren har god tid til at læse og godkende, før måneden skifter. Den laver en ny gren, skriver historien og billederne, kører tjekket, åbner en pull request og lægger linket til forhåndsvisningen i beskrivelsen.
- **Forhåndsvisning:** pull requesten indeholder et link, hvor historien kan spilles direkte fra pull requestens gren, fx via raw.githack.com, som kan vise filer fra et offentligt GitHub-repo som en hjemmeside. Linket starter direkte i den nye historie.
- **Rettelser:** vil ejeren have noget ændret, skriver de det som en kommentar på pull requesten. Den planlagte session følger pull requesten og retter.
- **Godkendelse:** at merge pull requesten til `main` er godkendelsen. `VERSION` i `sw.js` hæves i samme pull request, så alle får de nye filer.
- **Udgivelsesdag (ejerens valg):** en godkendt historie bliver synlig for familierne **den 1. i måneden**, uanset hvornår den blev godkendt. Opgaven den 15. laver historien til den kommende måned. Hver historie i listen har en udgivelsesdato, og appen viser den først fra den dato, efter enhedens ur. Godkendes en historie først efter den 1., kommer den ud med det samme. Når appen allerede har hentet en kommende historie, åbner den også på dagen uden net. Forhåndsvisningen ser bort fra datoen.
- Datoen er kun et spørgsmål om, hvornår historien vises. Repoet er offentligt, så filerne kan findes før tid. At holde indhold bag betaling hører til projekt 2.
- **Lås på `main` (ejerens valg):** ejeren slår en regel til på GitHub, så intet kan komme ind på `main` uden en pull request, og så `main` ikke kan slettes eller overskrives. Så sikrer GitHub selv, at ingen historie udgives uden godkendelse.
- **Opskriften** på at lave en historie ligger som en projekt-skill i `.claude/skills/`, så den månedlige session og ejeren (i chatten) kan lave en historie på samme måde.

### Afklaret efter gennemlæsning (Claudes valg, kan rettes)

- **Rettelser på pull requesten:** den månedlige opgave kører altid i den samme faste Claude-session. Den følger pull requesten og vågner, når ejeren skriver en kommentar, også hvis det er uger senere. Der skal ikke ligge nogen API-nøgle i repoet.
- **Hvis sidste måneds historie ikke er godkendt endnu,** laver opgaven ikke en ny. Den skriver i stedet en kort påmindelse på den åbne pull request, så der aldrig ligger to historier og konkurrerer.
- **Heltene og månedshistorier:** en gennemført månedshistorie tæller som et eventyr, så heltene stiger i level som i dag. En månedshistorie må læse, hvilke venner familien har, men må ikke lave nye varige venner eller flag. Slutskærmen viser ikke "Spil næste del" for månedshistorier, men et link tilbage til listen over historier.
- **Lanternerne i toppen** bliver, men som en smal række lige under scenebilledet, så billedet står øverst og teksten ikke skubbes langt ned.
- **Forhåndsvisningen** åbner med et lille eksempelhold (to helte og en følgesvend) direkte i den nye historie. Det sker kun, når linket har en særlig markering, og eksempelholdet gemmes aldrig.

### Uden net

- Appen skal stadig virke uden net. Listen over historier skal hentes fra nettet først, når der er net, så nye historier dukker op, og ellers fra den gemte udgave.

## Det, bygherren selv afgør

- Præcist filformat og mappestruktur for historierne, og hvordan historiefilerne får adgang til spillets funktioner (tilstand, terningkast, flag).
- Om historierne indlæses alle ved start eller først, når de vælges.
- Hvordan de genbrugelige billeddele bygges, og hvordan en scene beskriver sit billede.
- Hvordan billedet placeres og skaleres på telefon, tablet og computer, så længe det står over teksten og ikke skubber teksten for langt ned.
- Hvordan billedet tegnes i mørk tilstand.
- Hvordan tjekket køres, så længe det ikke kræver byggetrin for selve appen.
- Ordlyden i regelfilen og skill'en.

## Rækkefølge for arbejdet

1. Flyt de fire dele ud i egne filer uden at ændre, hvordan de spilles. Lav tjekket.
2. Lav de genbrugelige billeddele og et billede til hver scene i de fire dele.
3. Lav regelfilen og skill'en til nye historier. Lav én prøvehistorie med den, som ejeren godkender.
4. Opret den planlagte månedlige opgave og forhåndsvisningen.
5. Opdatér README.

Hvert trin kommer som sin egen pull request, så ejeren kan se og prøve det undervejs.
