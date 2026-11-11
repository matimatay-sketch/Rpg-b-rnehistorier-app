# Forside, indstillinger og tilbage-knap

**Dato:** 2026-11-11
**Status:** Godkendt til bygning. Ejeren sagde "bare kør", så Claude har taget de åbne valg. De står herunder som *Claudes valg* og kan rettes bagefter.
**Bygger på:** `2026-11-11-forside-og-navigation-noter.md`

## Hvorfor

Appen skal blive et abonnement, og familierne skal kunne finde rundt. I dag:
- er der ingen forside
- er indstillingerne spredt rundt i appen
- er der ingen vej ud af en historie, før man når til slutningen

Login og abonnement er et separat, senere projekt.

## Mål

1. **En forside**, som appen åbner på hver gang (efter velkomsten første gang).
2. **En indstillingsside** bag en tandhjulsknap.
3. **En tilbage-knap** i historien og i opsætningen, som fører til forsiden.

## Ikke med

- Login, konti og betaling.
- At appen husker, hvor man var midt i en historie. *(Claudes valg: det kræver et nyt gemt format og kan komme senere.)*
- Ændringer i historiernes indhold.

## Det må ikke ske

- Gemte data (`lk-heroes`, `lk-prefs`, `lk-welcomed`) går tabt eller skifter format.
- En familie mister sin historie ved et uheld: tilbage-knappen midt i en historie spørger først.
- Forhåndsvisning (`?preview=`) begynder at vise forsiden eller gemmer noget. Den starter stadig direkte i historien.
- Gennemspilningstesten (`tests/e2e/gennemspil.forloeb.json`) ændrer sig.
- Appen holder op med at virke uden net.

## Det, der er besluttet (Claudes valg)

### Forsiden
- Øverst: navnet "Lanterneskoven" og en **tandhjulsknap** (`aria-label="Indstillinger"`), der åbner indstillingerne.
- **Ugens eventyr:** et stort kort med det nyeste udgivne kapitel. Det viser:
  - billedet fra kapitlets første scene
  - serietitel og "Kapitel n af N"
  - kapitlets titel og korte beskrivelse
  - en knap: **"Start kapitlet"**
  
  Findes der intet udgivet kapitel, vises sagaens første del, som familien ikke har gennemført, med knappen **"Start historien"**.
- **Alle historier:** en liste med serierne (nyeste først, kapitler i rækkefølge, med "Kapitel n af N") og sagaens fire dele. Gennemførte historier markeres "Gennemført". Et tryk på en historie fører til opsætningen med den historie valgt.
- **Jeres helte:** en knap, der åbner heltelisten (den nuværende opsætning), hvor man laver og retter helte.
- **Start-knapperne** fører til opsætningen med historien valgt. Her vælger man helte og følgesvend, som i dag, og trykker "Start eventyret". Har familien ingen helte endnu, åbner heltebyggeren som i dag.
- **Udseende:** samme farver, skrifttyper og rolige billedbogsstil som resten af appen. Følg skill'en `frontend-design`, men indenfor appens eksisterende stil. Det skal ligne en side i samme bog, ikke en ny app.

### Indstillingerne
En egen side med overskriften "Indstillinger" og knappen **"‹ Forside"**:
- **"Læs altid højt"** (til/fra)
- **"Stor skrift"** (til/fra)
- **"Bevægelse"** (til/fra) med en linje, der forklarer, hvad bevægelser er
- **"Nulstil skovens venner"**, med bekræftelse på siden selv (ikke `confirm()`): "Er I sikre? Skovens venner glemmer jer." med knapperne [Nulstil] og [Fortryd]
- **"Installér app"**, når browseren tilbyder det
- **"Om Lanterneskoven"**, som åbner velkomstteksten

Knappen "Læs højt" bliver i scenerne, fordi den læser den aktuelle side op. Knapperne "Læs altid højt", "Stor skrift" og "Bevægelse" flyttes til indstillingerne. Linkene i bunden ("Om Lanterneskoven", "Installér app") flyttes også derind. Indstillingerne gemmes i `lk-prefs` som i dag.

### Tilbage-knappen
- **I en historie:** knappen **"‹ Forside"** sidder øverst til venstre i hver scene.
  - Midt i en historie spørger appen først, på siden selv: **"Vil I stoppe historien her? I kan altid starte forfra."** med knapperne [Stop historien] og [Bliv i historien].
  - På slutskærmen går den direkte til forsiden.
- **I opsætning, heltebygger og indstillinger:** **"‹ Forside"** fører direkte tilbage.
- **Browserens tilbage-knap** behøver ikke at virke på særlig måde. Appen er én side. *(Claudes valg.)*

### Forhåndsvisning
Uændret: `?preview=<id>` starter direkte i historien med eksempelholdet. "‹ Forside" i forhåndsvisning fører til forsiden, men intet gemmes.

## Test

E2e-test af:
- forsiden: Ugens eventyr-kortet, "Start kapitlet", "Alle historier" og "Jeres helte"
- tandhjulet og alle indstillinger, inklusive at de gemmes og at gamle `lk-prefs` bevares
- "Nulstil skovens venner" med bekræftelse
- tilbage-knappen midt i en historie, med begge valg i bekræftelsen, og på slutskærmen
- tilbage-knappen fra opsætningen
- at forhåndsvisningen stadig starter i historien og intet gemmer

Gennemspilningstesten skal bestå uændret. Det er tilladt at justere, hvordan testen kommer fra start til første scene, fx med et ekstra klik via forsiden, men aldrig at optage den igen. Gælder for alle eksisterende tests: de må tilpasses den nye vej ind, men ikke svækkes.

## Ændring: Lanternestien (godkendt af ejeren 2026-11-11)

Erstatter afsnittet "Forsiden" ovenfor. Skitsen, som ejeren godkendte, ligger i `assets/2026-11-11-lanternestien-skitse.html`. Den viser tre telefonskærme med rigtige billeder og helte.

### Forsiden
- **Øverst:** navnet "Lanterneskoven" og tandhjulsknappen til indstillingerne (som nu).
- **Heltene:** "Med i aften. Tryk for at slå til og fra." Under teksten står heltene, som de ser ud (appens egen `avatar`), cirka 58 px med navn under.
  - Valgte helte har en ring i lanternefarven, og fravalgte er blege.
  - Et tryk slår en helt til eller fra (samme `lib.play` som i dag).
  - En sidste knap "+" med teksten "Helte" fører til heltelisten og -byggeren.
  - Har familien ingen helte, viser rækken kun "+"-knappen med teksten "Lav jeres første helt".
- **Lanternestien:** én sti pr. gruppe, først de synlige serier (nyeste serie først, kapitler i rækkefølge, også de kommende kapitler i serien), derefter "Den store fortælling" (sagaens fire dele).
  - Hver gruppe har en overskrift: serietitlen med linjen "En lanterne tændes hver fredag i <måned>", eller "Den store fortælling" med linjen "Fire dele, der hænger sammen".
  - Stien går i zigzag: lanternerne skifter mellem højre og venstre side, og en prikket, buet linje forbinder dem.
  - Ved hver lanterne står titlen og en linje:
    - "Ude nu" (grøn) for udgivne kapitler, der ikke er gennemført
    - "Tændes fredag <d>. <mdr.>" for kommende kapitler
    - "Gennemført" for gennemførte historier
    - "Del n af 4" for sagaen
  - En tændt lanterne er en historie, der kan spilles. En slukket lanterne er et kommende kapitel; den kan ikke åbnes, men titel og dato kan ses.
- **Ugens eventyr-kortet** fra den første udgave udgår. Stien er forsiden.

### Tryk på en lanterne
Et ark glider op nedefra (med mørk baggrund bag). Det viser historiens billede (dens første scene), "Kapitel n af N i <serie>" eller "Del n af 4", titlen, den korte beskrivelse, knappen **"Start eventyret"** og et link **"Luk"**. Arket lukkes også med Escape og ved tryk på baggrunden. Fokus flyttes ind i arket og tilbage bagefter.

### Vælg følgesvend
En ny skærm efter "Start eventyret":
- **Øverst:** "‹ Forside" og tandhjulet. Under dem står den valgte historie med et lille billede, "Kapitel n af N i <serie>" og titlen.
- **Overskrift:** "Hvem tager I med?"
- **De seks følgesvende** står som kort i to kolonner. Hvert kort har et billede (figuren alene i `lysning` om dagen, glad, tegnet med `LK.art.scene`), navn, beskrivelse og "+1 i <træk>" (fra `js/data.js`). Den valgte har en ring i lanternefarven. Sidst valgte følgesvend er valgt på forhånd.
- **Knappen** "Afsted med <navn>" starter historien med de helte, der er med i aften.
  - Er ingen helte valgt, står der på siden: "Vælg mindst én helt på forsiden", og knappen er slået fra.
- Den gamle opsætning med radioknapper til historie og følgesvend udgår. Heltelisten og -byggeren bevares og nås fra "+"-knappen.

### Fire rettelser fra den første bygning
1. **"‹ Forside"** sidder fast øverst (sticky), så den altid kan ses i lange scener.
2. **Slutskærmen:** "Tilbage til historierne" fører til forsiden.
3. **Stop-bekræftelsen** vises ikke på historiens første scene, før der er valgt noget.
4. **Scenens overskriftslinje** holdes på én linje på en telefon, fx ved at forkorte eller ombryde smukt.
