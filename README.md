# Lanterneskoven 🏮

**Interaktiv fortælling for børn på 6-9 år, hvor familien læser, vælger og slår med terning sammen.**

Lanterneskoven er et lille, børnevenligt rollespil i en historiebog: lidt som Dungeons & Dragons, bare mere spiseligt. Én læser højt, alle vælger vej, og terningen går rundt. Skærmen er bogen, ikke legetøjet.

> Spillet er lavet til at blive brugt **sammen**. Det er ikke tænkt som mere skærmtid, men som en hyggestund med en historie at dele.

---

## Sådan er det at spille

1. **Lav en helt.** Vælg navn, udseende, hat, tøj og en ting at have med.
2. **Fordel kræfter.** Seks træk: Mod, List, Venlighed, Fantasi, Humor og Nysgerrighed. Hver helt får point at fordele og kan forbedres efter hvert eventyr.
3. **Vælg en magi og en følgesvend.** Gnistmagi, Dyresprog, Skjulte syn, Latterstøv eller Lysskjold. Følgesvenden giver et lille plus og kommenterer historien undervejs.
4. **Læs og vælg.** Hver scene slutter med et spørgsmål til børnene. Når et valg er svært, slår man med terningen. Siden viser chancen på forhånd, og et mislykket kast er aldrig en blindgyde: historien går bare videre på en anden måde.
5. **Husk det, I gjorde.** Venner og gnister fra tidligere dele følger med ind i de næste.

### Det er med
- 🎲 Terningkast med synlig chance (Nemt, Middel, Svært)
- ⭐ **Mester-valg:** når et træk når 5, åbner der sig særlige valg i historien
- 📈 **Levels** (hvert andet eventyr), og på level 3 kan helten vælge en ekstra magi
- 🧙 Heltebygger med mange hatte, frisurer, ansigter og tilbehør (også Halloween-hatte)
- 🔊 Oplæsning med fremhævning af ordene, og en indstilling til stor skrift
- 💾 Heltene og skovens venner gemmes i browseren, ingen konto nødvendig

---

## Historierne

Én stor fortælling i fire dele. Hver del har en god slutning, hvor børnene er lykkedes med noget, så man kan stoppe, når man har lyst.

| Del | Titel | Handling |
|---|---|---|
| 1 | **Lanterneskoven** | Uffe uglen skal have hjælp til at tænde skovens lanterner igen. |
| 2 | **Månen der gemte sig** | Månen er væk fra himlen. Jeres gnister og venner kan hjælpe. |
| 3 | **Vinden der var alene** | Et brev fra Vinden: hvorfor slukkede den lanternerne? |
| 4 | **Lanternefesten** | Skoven holder fest, så Vinden kan sige undskyld. |
| ★ | **Græskarnatten** *(Halloween-special)* | Lille Spøg har mistet sit bøh. Uhyggeligt, men kun på den hyggelige måde. |

---

## Kom i gang

Der er ingen installation og ingen build. Hele spillet er **én HTML-fil**, plus et par små filer, der gør det til en app.

```bash
git clone https://github.com/<dit-brugernavn>/Rpg-b-rnehistorier-app.git
cd Rpg-b-rnehistorier-app
open index.html        # eller dobbeltklik på filen
```

**Spil det online med GitHub Pages:** Gå til *Settings → Pages*, vælg grenen `main` og mappen `/ (root)`, og spillet ligger på `https://<dit-brugernavn>.github.io/Rpg-b-rnehistorier-app/`.

Det virker i alle moderne browsere, på computer, tablet og telefon. Dansk oplæsning kræver en dansk stemme i enhedens indstillinger for tale.

### Brug det som app 📲

Lanterneskoven er en web-app (PWA). Når den ligger online (fx på GitHub Pages), kan den installeres og ligger så på hjemmeskærmen som en rigtig app, i fuld skærm og **uden internet**.

- **Android / Chrome / Edge:** Tryk på *📲 Installér app* på forsiden, eller vælg *Installér app* i browserens menu.
- **iPhone / iPad:** Åbn siden i Safari, tryk på *Del* og vælg *Føj til hjemmeskærm*.
- **Computer:** Klik på installér-ikonet i adresselinjen i Chrome eller Edge.

Appen virker ikke offline, hvis man bare åbner `index.html` direkte fra disken. Det kræver, at siden hentes over `https://` (eller `http://localhost`).

---

## Teknik

- Ren HTML, CSS og JavaScript. Ingen frameworks, ingen afhængigheder.
- Heltene tegnes som SVG direkte i koden, så der ikke er nogen billedfiler.
- Oplæsning med Web Speech API (`speechSynthesis`).
- Gemmer i `localStorage` (nøglerne `lk-heroes`, `lk-prefs` og `lk-welcomed`). Hvis spillet nogensinde ikke kan starte, viser siden en fejlbesked og en knap, der nulstiller de gemte data.
- Skrifttyper (Grandstander og Literata) hentes fra Google Fonts. Uden net bruges systemets skrifttyper.
- Lys og mørk tilstand følger enhedens indstilling (kan også vælges i indstillingerne).
- App-delen: `manifest.webmanifest` beskriver appen, `sw.js` gemmer spillet til brug uden net, og ikonerne ligger i `icons/`. Hæv `VERSION` i `sw.js`, når spillet ændres, så alle får den nye udgave.

### Sådan er koden bygget op

Historierne ligger i ét objekt, `S`, hvor hver scene har en titel, en tekst, et spørgsmål til børnene og enten faste valg eller et `dyn`-valg, der bygges efter, hvad børnene har med (gnister, venner, træk). Nye scener tilføjes som nye nøgler i `S`, og nye dele tilføjes i listen `STORIES`.

---

## Idéer fremover

- Flere dele og nye fortællinger
- En Verdensbyggerdel, hvor børnene selv designer dyr og væsner (fjer giver en fugl, skæl giver en gekko)
- Tegn og fortæl, bevægelsesfortællinger og opgaver til ture og madlavning
- En ugentlig familiemission

Har du en idé eller en fejl? Opret et issue.

---

## Licens

*Ikke valgt endnu.* Indtil der er valgt en licens, er alle rettigheder forbeholdt.
