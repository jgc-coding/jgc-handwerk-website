# JGC Handwerk Website

**Prozess-Stufe: Produkt** — volles Programm (Version, CHANGELOG, Regressionscheck).

Neue Fassung der Website von JGC Handwerk (Johann Gabriel Chimento, Freiburg im Breisgau).
Übernimmt Inhalte, Logo und Farbwelt der bestehenden WordPress-Seite auf jgc-handwerk.de,
setzt sie aber in der Gestaltungs- und Bewegungssprache von fora.so um: grosse schlanke
Typografie, Kapsel-Etiketten, Glaskarten, Scroll-Einblendungen und ein Lichtfleck am Zeiger.

## Tech-Stack

- **Vanilla HTML/CSS/JS, kein Build-Schritt** (Standard fuer statische Seiten laut
  `C:\Projekte\Claude-Skills\grundlagen\TECH-STACK.md`).
- **GSAP 3.12.5 + ScrollTrigger**, lokal unter `assets/vendor/gsap/`.
- **Schriften lokal**: Raleway und Open Sans als Variable Fonts in `assets/fonts/`.
- **PHP (ab 7.4) nur fuer `formular/senden.php`**, den Empfaenger des Kontaktformulars. Laeuft
  bei All-Inkl auf der Subdomain `formular.jgc-handwerk.de`, nicht auf GitHub Pages; verschickt
  per `mail()` und speichert nichts. Bewusst kein Formulardienst: so verlassen Anfragen nie den
  deutschen Hoster. Gleiches Muster wie die Stilprobe von JGC Lumen (`formular.jgc-lumen.de`),
  in `TECH-STACK.md` als bewusste Abweichung eingetragen.
- **Node 24** nur fuer die Werkzeuge in `tools/`, nicht fuer die Seite selbst.

**Nichts wird von einem fremden Server nachgeladen.** Kein CDN, kein Google Fonts, keine
Analyse. `tools/pruefen.mjs` bricht ab, wenn doch ein externer Verweis hineingerät.

## Befehle

- Vorschau: `node tools/server.mjs` → http://localhost:4173. Ist der Port von einer anderen
  Sitzung belegt, stirbt der neue Server still und man prueft den alten Stand: dann
  `PORT=4180` davor und die Werkzeuge mit `BASIS=http://localhost:4180`; Gegenprobe ist die
  Version in der Fusszeile. Der Server aus der Browser-Pane stirbt zwischen den Zuegen — vor
  jeder Aufnahme-Serie kurz per `curl` pruefen.
- Pruefen: `node tools/pruefen.mjs` (fehlende Dateien, fremde Server, Versionsabgleich)
- Formular-Skript testen: `node tools/formular-test.mjs` — PHP in Docker, 13 Faelle; Mails
  landen in `tools/formular-test/post/` statt im Postfach. Docker muss laufen, andere
  PHP-Version per `PHP_IMAGE=php:8.5-cli`. Mit `--laufen` bleibt PHP fuer Browser-Tests an
  (launch.json: `formular-test`, Port 8099). Ein Stopp ueber die Browser-Pane beendet nur
  Node, der Container laeuft weiter: danach `docker rm -f jgc-formular-test`.
- Sichtkontrolle: `node tools/screenshots.mjs <ordner> [breite] [hoehe]` — steuert das
  installierte Chrome fern und legt Bilder aller Abschnitte ab. Server muss laufen.
- Schriften erneuern: `node tools/fonts-holen.mjs` (nur bei Schriftwechsel noetig)
- Regressionscheck: `node tools/regression.mjs` (Server muss laufen, dauert ~2 min) — spielt
  Bretterwand, Projektbahn, Reiter samt Handy-Karten, Formular, Regler, Menue und Tastatur im
  Chrome ohne Fenster durch, misst den Kontrast im ersten Bild und prueft ohne JavaScript und
  ruhige Darstellung.
  Nach jeder Aenderung an Hero, Projektbahn oder `main.js`. Zu langsam fuer `pruefen.txt`.

## Konventionen

- Sprache der Oberflaeche: Deutsch, mit echten Umlauten. Code und Kommentare ebenfalls
  deutsch, Kommentare aber ASCII (`ae/oe/ue`).
- Version = Single Source of Truth in `assets/js/config.js` (`JGC.version`), sichtbar in der
  Fusszeile. `tools/pruefen.mjs` vergleicht sie mit dem obersten Eintrag in `CHANGELOG.md`.
- Farben und Abstaende ausschliesslich ueber die CSS-Variablen in `:root` (Abschnitt 1 von
  `style.css`). Keine Farbwerte direkt in Regeln schreiben.
- Sandgold `#d1b280` ist Dekorfarbe, nie Textfarbe — der Kontrast auf hellem Grund reicht
  nicht. Fuer goldenen Text `--gold-600` (`#8c6d42`) verwenden.
- Bilder als WebP in `assets/img/`; die unbearbeiteten Vorlagen liegen daneben in
  `_original/` und bleiben ausserhalb des Repos.
- **Logo (Gabriels Entscheidung):** Kopf- und Fusszeile tragen den Schriftzug der alten Seite
  (`logo-schriftzug.webp`, auf dunklem Grund `logo-schriftzug-hell.webp`), der Startbereich
  das Kreis-Logo. Neu erzeugen aus `_original/logo-schriftzug-orig.png`: nur die Deckkraft
  verkleinern und die Farbe neu setzen — wer das farbige Bild direkt skaliert, bekommt helle
  Raender an den Buchstaben.

## Stolperfallen

- **Ohne JavaScript muss alles sichtbar bleiben.** Die Startwerte der Einblendungen haengen
  an `.js` am `<html>`, die der Bretterwand an `.js.bewegt` — beides setzt ein Inline-Script im
  `<head>`. Wer eine neue `.reveal`-Regel schreibt, muss sie ebenfalls unter `.js` haengen —
  sonst ist die Seite bei einem Script-Fehler leer.
- **Screenshots aus der Browser-Pane sind unbrauchbar**, sobald die Pane ausgeblendet ist:
  der Bereich ausserhalb des zuletzt gezeichneten Ausschnitts kommt weiss zurueck. Fuer
  Sichtkontrollen `tools/screenshots.mjs` nehmen.
- `scroll-behavior: smooth` verschluckt `window.scrollTo(0, y)` in ferngesteuerten Browsern.
  Beim Testen immer `scrollTo({ top: y, behavior: "instant" })`.
- Bash-Heredocs fressen doppelte Backslashes — regulaere Ausdruecke in `tools/*.mjs` nie per
  Heredoc schreiben, sondern mit dem Edit-Werkzeug. Umlaute aus Python erscheinen in Git Bash
  als Ersatzzeichen: erst `PYTHONIOENCODING=utf-8` setzen, dann an einen Kodierungsfehler glauben.
- Die Projektbahn (`#rail`) wird von ScrollTrigger angeheftet. Aendert sich die Kartenzahl
  oder -breite, aendert sich die Scrollstrecke der ganzen Seite mit.
- **Leistungen bis 980 px: Karten statt Reiter.** Der Baustein Reiter in `main.js` setzt
  `.tabs--liste` und baut jeder Karte den Kopf aus ihrem Reiter — Texte nur in Reiter und
  Panel pflegen, nie einen zweiten Kopf ins HTML schreiben. Der dunkle Bildverlauf ist dort
  bewusst kraeftiger, weil die Unterschrift hoeher ins Bild reicht; nicht angleichen.
- **Keine CSS-Transition auf `transform` von Elementen, die ScrollTrigger anheftet oder
  schiebt** (`#rail`, `#railTrack`, `.hero__buehne`, `.hero__brett`, `.hero__logo`, alles
  Gepinnte): die gesetzten Inline-Transforms werden sonst animiert nachgezogen, und die
  Bildleiste springt sichtbar beim Loesen der Anheftung (Fehler in 0.2.0, behoben in 0.3.0 —
  577 px Nachlauf). Einblendungen gehoeren auf die Karten oder Inhalte DARIN, nie auf die
  transformierten Container.
- **ScrollTrigger-Timelines beim Seitenaufbau: Startwerte mit `fromTo` setzen.** Laeuft beim
  Aufbau noch ein CSS-Auftritt mit Deckkraft 0, schreibt GSAP diese 0 als Startwert fest und
  das Element bleibt fuer immer unsichtbar (Leitsatz der Bretterwand). Dazu Auftritte nur mit
  `animation-fill-mode: backwards` — `both`/`forwards` schlagen Inline-Styles, GSAP kommt dann
  nicht mehr an das Element heran.
- **Lesbarkeit der Bretterwand haengt an zwei Ebenen.** Die Logo-Buchstaben sind im Bild
  durchsichtig; lesbar macht sie die halb deckende helle Ebene dahinter (`.hero__logo::before`).
  Ein Schatten als `filter: drop-shadow` am Bild schiene durch die Buchstaben und machte sie
  trueb — darum sitzt er als `box-shadow` auf dieser Ebene. `backdrop-filter` (Weichzeichnung
  hinter Leitsatz und Hinweis) faellt aus, solange ein Vorfahr `opacity < 1` oder `filter` hat:
  Auftritte und Ausblenden darum an die Kapsel selbst haengen, nie an ihren Rahmen. Nach jeder
  Aenderung `tools/regression.mjs` laufen lassen, es misst den Kontrast.
- **Bretterwand am Handy: Buehne `svh`, Wand und Schein `lvh`.** Die angeheftete Buehne waechst
  nicht mit, wenn die Adressleiste einklappt; ohne den Ueberstand der Wand stuende unten ein
  heller Streifen. Aus demselben Grund misst `main.js` auf Touch-Geraeten nur bei neuer Breite
  neu. Nie auf `100vh` "vereinfachen".
- **CSS-3D (`transform-style: preserve-3d`) wird von `opacity < 1`, `filter`, `overflow` und
  `mask` aufgehoben.** Solche Eigenschaften und Auftritts-Animationen nur auf Blaettern
  (Flaechen, Kanten), nie auf Modell oder Ebenen — sonst fallen die Ebenen flach zusammen
  (Hero-Entwurf 3, archiviert im Commit ef41e2e).
- **Das Formular-Skript liegt nicht auf GitHub.** `formular/senden.php` wird von Hand direkt in
  den Ordner der Subdomain `formular.jgc-handwerk.de` geladen, mit einem FTP-Nutzer nur fuer
  diesen Ordner. Der Deploy-Workflow bringt Aenderungen nicht dorthin — nach jeder Aenderung
  neu hochladen, sonst laeuft dort der alte Stand weiter.
- **Der FTP-Nutzer `formular` im KAS gehoert zu JGC Lumen** (Ordner `formular.jgc-lumen.de`).
  Nicht fuer diese Seite verwenden und sein Passwort nicht aendern — das Hochlade-Skript der
  Stilprobe-Automatik meldet sich vermutlich damit an. Zugangsdaten und Skript liegen im
  privaten Repo `C:\Projekte\Stilprobe-Automatik`: nur lesen, nichts uebernehmen — dieses Repo
  ist oeffentlich.
- **Formular, Herkunft und Datenschutztext haengen zusammen.** `JGC.formularEndpunkt` in
  `assets/js/config.js` zeigt auf das Skript (bei `null` prueft das Formular nur und sagt das
  offen). Das Skript nimmt nur Einsendungen von Adressen in `ERLAUBTE_HERKUNFT` an: Zieht die
  Website um, muss ihre neue Adresse dort hinein, sonst scheitert jede Anfrage mit 403. Wer
  Empfaenger oder Weg der Daten aendert, zieht `datenschutz.html` im selben Zug mit.
- **All-Inkl verschickt Skript-Mails nur mit echtem Absender.** `ABSENDER` in `senden.php` muss
  ein Postfach im All-Inkl-Paket sein; es geht per `-f` an `mail()`.
- **Beim Umzug der Hauptdomain bleibt die Subdomain bei All-Inkl.** Zeigt jgc-handwerk.de
  spaeter auf GitHub Pages, nur die Eintraege der Hauptdomain und von `www` umstellen —
  `formular` bleibt samt SSL-Zertifikat bei All-Inkl, so wie bei jgc-lumen.de.
- **Hoster und Formular-Empfaenger stehen in `datenschutz.html` Abschnitt 2** (GitHub Pages fuer
  die Seite, All-Inkl fuer Formular und E-Mail). Zieht die Seite um, muss der Abschnitt mit.
- `docker run` aus Git Bash mit Pfaden wie `/app` braucht `MSYS_NO_PATHCONV=1`, sonst macht
  Bash daraus einen Windows-Pfad. `tools/formular-test.mjs` startet Docker direkt aus Node und
  ist davon nicht betroffen.
- **Vorschau-Sperre an zwei Stellen.** Solange die Seite auf der GitHub-Adresse liegt, halten
  ein `noindex`-Tag in `index.html` und `robots.txt` sie aus den Suchmaschinen heraus — sonst
  taucht sie neben der echten Seite auf jgc-handwerk.de auf und nimmt ihr Sichtbarkeit. Beim
  Umzug auf die eigene Domain **beide** entfernen.
