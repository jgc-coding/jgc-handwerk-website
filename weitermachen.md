# Weitermachen

Stand: 22.09.2026 · Version 0.3.0 in `main`, **noch nicht veröffentlicht** · letzter Tag `v0.1.0`
· Hero-Entwürfe im Branch `claude/handwerk-hero-sections-986d61` (Worktree
`.claude/worktrees/handwerk-hero-sections-986d61`), **nicht in `main`**

- **Vorschau:** https://jgc-coding.github.io/jgc-handwerk-website/ (zeigt noch 0.1.0)
- **Repo:** https://github.com/jgc-coding/jgc-handwerk-website
- **Lokal:** `node tools/server.mjs` → http://localhost:4173 (Port belegt? `PORT=4180` davor);
  Entwürfe unter http://localhost:4173/hero-varianten/

## Stand

**Drei Hero-Entwürfe** (Sitzung 21./22.09.), von Gabriel beauftragt als technisch
anspruchsvollere Alternativen zum Startbereich, Vorbild fora.so und der Midsummer-Hero.
Alles liegt getrennt in `hero-varianten/` (Übersicht, drei Seiten, eigenes CSS/JS je Entwurf,
Testflächen zum Scrollen darunter, alle `noindex`); `index.html`, `style.css` und `main.js`
sind unverändert, die Version bleibt 0.3.0.

1. **Schichtholz** — Schwarzwald aus sechs Holzebenen (Holzfoto als Oberfläche, SVG-Masken
   aus `tools/hero-schichten.mjs`), Logo geht dahinter als Sonne auf, Zeiger- und
   Scroll-Parallaxe ohne Bibliothek.
2. **Bretterwand** — Holzwand wie auf der Live-Seite; ScrollTrigger heftet die Bühne an, die
   Bretter (Teilung nach den echten Fugen im Foto) gleiten weg, das Logo reist an seinen Platz.
3. **Schicht für Schicht** — Trockenbauwand als CSS-3D-Modell (Ständerwerk, Dämmung,
   Beplankung, Oberfläche mit Logo), fügt sich beim Scrollen zusammen, Legende hakt ab, Maus
   neigt das Modell.

Geprüft: `pruefen.mjs` grün (prüft jetzt auch `hero-varianten/`); Headless-Chrome-Aufnahmen
je Entwurf bei 1440×900 (mehrere Scrollstellungen, Mausversatz), 1366×700, 390×844, dazu
ruhige Darstellung und ohne JavaScript; keine Konsolenfehler oder -warnungen.
**Nicht geprüft:** das Bewegungsgefühl selbst (nur Standbilder), echte Geräte, Safari/Firefox
(CSS-3D und `mask` sind dort die heiklen Stellen).

Davor: 0.3.0 Bewegungs-Feinschliff und Projektbahn-Fix (13.09.), 0.2.0 Rückmeldungen V1–V4,
Logo-Schriftzug, Kontaktformular an `formular/senden.php` — Details im `CHANGELOG.md`.
`main` ist bewusst nicht gepusht: erst nach der KAS-Einrichtung (V3) veröffentlichen.

## Offen

- **Gabriels Wahl unter den drei Entwürfen** (oder Mischung, z. B. Landschaft aus 1 mit dem
  Zusammenbau aus 3). Erst danach Einbau in die Startseite.
- **V3 blockiert die Veröffentlichung:** Subdomain, SSL, FTP-Nutzer und AVV im KAS, dann
  `senden.php` hochladen.
- Gabriels Blick auf den 0.3.0-Hero und die Übergänge im echten Browser.

## Nächste Schritte (Claude)

1. Gewählten Entwurf in `index.html` einbauen (CSS in `style.css` Abschnitt 8, JS in
   `main.js` als eigener Baustein), Testflächen und Umschalter weglassen, `hero-varianten/`
   samt `tools/hero-schichten.mjs` entfernen oder als Archiv behalten (Gabriel fragen),
   Version 0.4.0 + CHANGELOG, Regressionscheck wie bei 0.3.0.
2. Branch in `main` mergen (`git merge --ff-only` aus dem Hauptbaum), Worktree danach löschen.
3. Selbsttest ohne Mail: `https://formular.jgc-handwerk.de/senden.php` muss
   `{"ok":false,"grund":"methode"}` zeigen. Ein Zertifikatsfehler heißt, SSL ist noch nicht aktiv.
4. Mit Gabriels OK eine echte Test-Anfrage schicken (lokale Seite ist als Herkunft erlaubt);
   scheitert es, Status und Kennung aus der Antwort nehmen und das PHP-Fehlerlog im KAS ansehen.
5. Mit Gabriels OK `git push origin main` (Deploy), Version und Formularversand auf der
   Vorschau prüfen, Tags `v0.2.0`, `v0.3.0` (und `v0.4.0`) setzen und pushen.
6. V4 Datenschutz prüfen lassen, V6 Umzug auf die eigene Domain (`noindex` und `robots.txt`
   entfernen, Datenschutz Abschnitt 2, `og:image`), Porträtfoto klären (offen seit 0.1.0).
7. Aufräumen der alten Worktrees, sobald die Sitzungen zu sind (Stände stecken in `main`):
   `.claude/worktrees/jgc-handwerk-website-feedback-9766c5`,
   `.claude/worktrees/website-hero-transitions-a730c7`.

## Was Gabriel selbst tun muss

Am 19.09.2026 von der Hub-Tafel hierher gezogen. Die Tafel nimmt seither nur noch, was
Gabriel selbst eintraegt oder ausdruecklich beauftragt.

- [ ] Hero-Entwurf auswaehlen (seit 2026-09-22): lokal `node tools/server.mjs` im Worktree
  starten und http://localhost:4173/hero-varianten/ ansehen — langsam scrollen, Maus bewegen,
  auch am Handy (Adresse des Rechners im WLAN statt localhost)
- [ ] Datenschutzerklaerung fachlich pruefen lassen (V4) (seit 2026-09-08)
  - Vor dem Umzug auf die eigene Domain - Impressumsservice kann das meist mitpruefen
- [ ] Formular bei All-Inkl einrichten (V3) (seit 2026-09-13)
  - Subdomain formular.jgc-handwerk.de mit SSL anlegen
  - FTP-Nutzer nur fuer den Ordner der Subdomain anlegen
  - senden.php direkt in diesen Ordner hochladen
  - AVV mit All-Inkl bestaetigen
  - Selbsttest: formular.jgc-handwerk.de/senden.php im Browser oeffnen
- [ ] Alte WordPress-Seite: Dresden-Anschrift in der Datenschutzerklaerung durch Hoyerswerda ersetzen (seit 2026-09-13)
- [ ] Claude Rueckmeldung geben (2 Punkte) (seit 2026-09-13)
  - Portraetfoto im Ueber-mich-Bereich freigeben oder entfernen lassen
  - Nach dem Selbsttest Bescheid geben: OK fuer Test-Anfrage und Veroeffentlichen (V3)

## Aktuelle Stolperfallen/Workarounds

- **`main` liegt ungepusht vor `origin/main`.** Jeder Push von `main` veröffentlicht 0.2.0
  und 0.3.0 mit — auch das `/save-state clean` einer anderen Sitzung. Vorher V3 abschließen.
- **Der Entwurfs-Branch enthält `hero-varianten/`.** Beim Merge in `main` geht der Ordner mit
  ins Deploy (harmlos: `noindex`, keine Verlinkung), beim Einbau der Wahl wieder entfernen.
- **Wer an Bahn, Bretterwand oder 3D-Modell arbeitet:** keine CSS-Transitionen auf `transform`
  der von ScrollTrigger bewegten Elemente; Startwerte in Timelines mit `fromTo`; Auftritte nur
  mit `animation-fill-mode: backwards`; bei CSS-3D nie `opacity`/`filter`/`overflow` auf
  Modell oder Ebenen (Details in `CLAUDE.md`, Stolperfallen).
- **Der Vorschau-Server der Browser-Pane stirbt zwischen den Zügen** — Headless-Aufnahmen
  liefern dann „Website nicht erreichbar“. Vor jeder Aufnahme-Serie `curl` auf die Seite.
- **Port 4173 kann von einer anderen Sitzung belegt sein** — der neue Server stirbt dann mit
  EADDRINUSE und man prüft unbemerkt den alten Stand. Gegenprobe ist die Version im Footer;
  Ausweg `PORT=4180 node tools/server.mjs` und Werkzeuge mit `BASIS=http://localhost:4180`.
- **Sichtkontrollen nie über die Browser-Pane**, sondern mit
  `node tools/screenshots.mjs <ordner> [breite] [hoehe]`; Hero-Endzustände brauchen längere
  Wartezeit als die 900 ms des Werkzeugs (Choreografie läuft ~2,5 s). Für die Entwürfe
  braucht es Aufnahmen bei mehreren Scrollstellungen — das Werkzeug kennt nur Sprungziele.
- **Umlaute aus Python erscheinen in Git Bash als Ersatzzeichen** — `PYTHONIOENCODING=utf-8`
  setzen, bevor man an einen Kodierungsfehler glaubt.
- **Zugangsdaten und Hochlade-Skript der Stilprobe von JGC Lumen** liegen im privaten Repo
  `C:\Projekte\Stilprobe-Automatik`. Nur lesen, nichts übernehmen: dieses Repo ist öffentlich.
