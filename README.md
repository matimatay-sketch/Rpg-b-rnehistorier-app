# Lanterneskoven 🏮

**Interaktiv fortælling for børn på 6-9 år, hvor familien læser, vælger og slår med terning sammen.**

Lanterneskoven er et lille, børnevenligt rollespil i en historiebog: lidt som Dungeons & Dragons, bare mere spiseligt. Én læser højt, alle vælger vej, og terningen går rundt. Skærmen er bogen, ikke legetøjet.

> Spillet er lavet til at blive brugt **sammen**. Det er ikke tænkt som mere skærmtid, men som en hyggestund med en historie at dele.

---

## Sådan er det at spille

1. **Lav jeres helte.** Alle i familien kan have sin egen helt med navn, ansigt, hår, hat, tøj og en ting at have med. Op til fire helte kan være med i det samme eventyr.
2. **Fordel kræfter.** Seks træk: Mod, List, Venlighed, Fantasi, Humor og Nysgerrighed. Hver helt får point at fordele og kan forbedres efter hvert eventyr.
3. **Vælg magi og følgesvend.** Hver helt har en magi: Gnistmagi, Dyresprog, Skjulte syn, Latterstøv eller Lysskjold. Holdet vælger en følgesvend, der giver et lille plus og kommenterer historien undervejs.
4. **Læs og vælg på skift.** Heltene skiftes til at læse højt og vælge. Under hver scene står **Spørg børnene:** et spørgsmål, I kan snakke om sammen. Når et valg er svært, slår man med terningen. Siden viser chancen på forhånd, og et mislykket kast er aldrig en blindgyde: historien går bare videre på en anden måde.
5. **Husk det, I gjorde.** Venner og gnister fra tidligere dele følger med ind i de næste.

### Det er med
- 👨‍👩‍👧 **Spil sammen:** op til fire helte i historien på samme tid, og de skiftes til at læse og vælge
- 💬 **Spørg børnene:** et spørgsmål at snakke om under hver scene
- 🎲 Terningkast med synlig chance (Nemt, Middel, Svært)
- 🤸 **Bevægelser:** 1-2 gange i hver historie rejser børnene sig og gør det, heltene gør, fx går på line over stammen, og familien trykker "Vi klarede det!" eller "Vi vaklede". Knappen **Bevægelse** slår det fra, så bliver det almindelige terningkast
- ⭐ **Mester-valg:** når et træk når 5, åbner der sig særlige valg i historien
- 📈 **Levels** (hvert andet eventyr), og på level 3 kan helten vælge en ekstra magi
- 🖼️ **Et billede til hver scene** i billedbogsstil, og lanternerne står lige under billedet
- 🎄 **Ny historie hver fredag:** hver måned er en serie med et kapitel til hver fredag, og kapitlet dukker op på forsiden den dag
- 🧙 Heltebygger med mange hatte, frisurer, ansigter og tilbehør
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

### Månedens historie

Ud over de fire dele kommer der en ny historie hver fredag. En måneds historier er en serie med et kapitel pr. fredag (4 eller 5), og hvert kapitel er en hel historie, der kan spilles uden at kende resten. Den første er **Julestjernen** (december 2026).

Månedens historier laves af en planlagt Claude-session den 15. i måneden. Den åbner én pull request for hele serien med titlen "Månedens historier: …", og så er det ejeren, der godkender den ved at lægge den ind (merge), senest den 1. Først da kommer kapitlerne med i spillet, ét hver fredag.

Har den kommende måned allerede en historie på `main`, gør den månedlige kørsel ingenting: ingen gren, ingen pull request og ingen kommentar.

Har du en idé til en historie, så opret et issue med mærket `historie-idé`.

For at se en historie, før den er udkommet, åbn `index.html?preview=<id>` (fx `?preview=2026-12-julestjernen`, eller `?preview=<id>` for et enkelt kapitel i en serie). Så bruges et fast prøvehold, og der gemmes ikke noget.

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
- Heltene og scenebillederne tegnes som SVG direkte i koden, så der ikke er nogen billedfiler. Billederne samles af dele i `art/dele.js`.
- Oplæsning med Web Speech API (`speechSynthesis`).
- Gemmer i `localStorage` (nøglerne `lk-heroes`, `lk-prefs` og `lk-welcomed`). Under `lk-heroes` ligger heltene, hvem der er med i aften, og hvad skovens venner husker. Kan de gemte data ikke læses, starter spillet bare uden dem.
- Skrifttyper (Grandstander og Literata) hentes fra Google Fonts. Uden net bruges systemets skrifttyper.
- Lys og mørk tilstand følger enhedens indstilling (kan også vælges i indstillingerne).
- App-delen: `manifest.webmanifest` beskriver appen, `sw.js` gemmer spillet til brug uden net, og ikonerne ligger i `icons/`. Hæv `VERSION` i `sw.js`, når spillet ændres, så alle får den nye udgave.

### Sådan er koden bygget op

Hver historie ligger i sin egen mappe, `stories/<id>/historie.js`, og står i listen `stories/katalog.js`. Hver scene har en titel, en tekst, et billede, et spørgsmål til børnene (`ask`) og enten faste valg eller et `dyn`-valg, der bygges efter, hvad børnene har med (gnister, venner, træk).

- `index.html`: selve spillet.
- `js/data.js`: motorens data (træk, magi, følgesvende m.m.).
- `js/kit.js`: hjælpere, som historierne bruger.
- `js/katalog.js`: kataloget og datoerne, så et kapitel først vises på sin udgivelsesfredag (`type: 'maaned'`, `udgives`, `serie`, `kapitel` og `kapitler`).
- `art/dele.js`: delene, billederne bygges af.
- `docs/historie-regler.md`: reglerne for en god historie.

**Ny historie:** brug skill'en `ny-historie` (`.claude/skills/ny-historie/SKILL.md`). Er skill'en ikke registreret (fx i den planlagte session), så læs filen direkte. Den følger `docs/historie-regler.md`, laver mappen og tilføjer historien i kataloget.

**Tjek, før noget lægges ind:**

```bash
node tools/tjek-historier.mjs
node --test 'tests/*.test.mjs'
node --test 'tests/e2e/*.test.cjs'
```

GitHub Actions kører enhedstestene og historietjekket på hver pull request. Husk at hæve `VERSION` i `sw.js`, når filer ændres.

---

## Idéer fremover

- Flere nye fortællinger, fx Halloween-specialen **Græskarnatten**, hvor Lille Spøg har mistet sit bøh
- En Verdensbyggerdel, hvor børnene selv designer dyr og væsner (fjer giver en fugl, skæl giver en gekko)
- Tegn og fortæl, bevægelsesfortællinger og opgaver til ture og madlavning
- En ugentlig familiemission

Har du en idé til en historie? Opret et issue med mærket `historie-idé`. Fejl kan også meldes som issue.

---

## Licens

*Ikke valgt endnu.* Indtil der er valgt en licens, er alle rettigheder forbeholdt.
