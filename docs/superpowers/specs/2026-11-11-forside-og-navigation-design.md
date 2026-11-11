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
