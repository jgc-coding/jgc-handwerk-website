# Weitermachen

Stand: 13.09.2026 · Version 0.2.0 in `main`, **noch nicht veröffentlicht** · letzter Tag `v0.1.0`

- **Vorschau:** https://jgc-coding.github.io/jgc-handwerk-website/ (zeigt noch 0.1.0)
- **Repo:** https://github.com/jgc-coding/jgc-handwerk-website
- **Lokal:** `node tools/server.mjs` → http://localhost:4173

## Stand

Gabriels Rückmeldungen zu V1 bis V4 und zum Logo sind eingearbeitet, Einzelheiten im
`CHANGELOG.md` unter 0.2.0: Schriftzug in Kopf- und Fußzeile, größeres Kreis-Logo im
Startbereich, Trockenbau ohne „Vorsatzschalen“, Dachdecker bei Dach- und Gaubenbau, DDG und
TDDDG statt TMG und TTDSG. Das Kontaktformular schickt an `formular/senden.php`, das bei
All-Inkl auf der Subdomain `formular.jgc-handwerk.de` laufen soll (Gabriels Entscheidung,
gleiches Muster wie JGC Lumen, in `TECH-STACK.md` als bewusste Abweichung eingetragen).

`main` steht lokal per Fast-Forward auf diesem Stand, ist aber **bewusst nicht gepusht**:
Gabriel hat beim `/save-state clean` am 13.09.2026 entschieden, erst nach dem Hochladen zu
veröffentlichen.

Geprüft: `node tools/pruefen.mjs` grün; `node tools/formular-test.mjs` 13 von 13 grün mit PHP
8.3 und 8.5; Formular im Browser gegen lokales PHP (Erfolg, Feldfehler vom Server,
Verbindungsabbruch); Screenshots 1440×900 und 390×844.
**Nicht geprüft:** Mailzustellung bei All-Inkl — die Subdomain gab es am 13.09. noch nicht
(kein SSL-Zertifikat).

## Offen

- **V3 blockiert die Veröffentlichung:** Gabriel richtet Subdomain, SSL, FTP-Nutzer und AVV im
  KAS ein und lädt `senden.php` hoch (Teilschritte auf der Hub-Karte „JGC Handwerk“).

## Nächste Schritte (Claude)

1. Selbsttest ohne Mail: `https://formular.jgc-handwerk.de/senden.php` muss
   `{"ok":false,"grund":"methode"}` zeigen. Ein Zertifikatsfehler heißt, SSL ist noch nicht aktiv.
2. Mit Gabriels OK eine echte Test-Anfrage schicken: lokale Seite (`localhost:4173` ist als
   Herkunft erlaubt) mit dem echten Endpunkt; Gabriel bestätigt den Eingang. Scheitert es,
   Status und Kennung aus der Antwort nehmen und das PHP-Fehlerlog im KAS ansehen.
3. Mit Gabriels OK `git push origin main` (Deploy), auf der Vorschau Version 0.2.0 und einen
   Formularversand prüfen, Tag `v0.2.0` setzen und pushen.
4. V4: Gabriel lässt die Datenschutzerklärung prüfen, sinnvoll nach Schritt 3.
5. Umzug auf die eigene Domain (V6): Hosting wählen, `noindex` und `robots.txt` entfernen,
   Datenschutz Abschnitt 2 anpassen, `og:image` auf die gültige Adresse.
6. Porträtfoto entfernen, falls Gabriel es nicht veröffentlicht haben will (offen seit 0.1.0).
7. Aufräumen, sobald die Sitzung vom 13.09. geschlossen ist: Worktree
   `.claude/worktrees/jgc-handwerk-website-feedback-9766c5` entfernen und Branch
   `claude/jgc-handwerk-website-feedback-9766c5` löschen — verlustfrei, alles steckt in `main`.

## Aktuelle Stolperfallen/Workarounds

- **`main` liegt ungepusht vor `origin/main`.** Jeder Push von `main` veröffentlicht 0.2.0 mit —
  auch das `/save-state clean` einer anderen Sitzung. Vorher V3 abschließen.
- **Zweite Sitzung im Projekt:** Der Worktree `website-hero-transitions-a730c7` entstand am
  13.09. um 15:35 und steht noch auf 0.1.0 (`72271c6`), ohne eigene Commits — vermutlich eine
  neue Sitzung von Gabriel. Nicht entfernen, auch wenn Git den Branch als gemergt meldet; dort
  vor dem Arbeiten `git merge --ff-only main`, sonst baut sie am alten Stand ohne 0.2.0.
- **Sichtkontrollen nie über die Browser-Pane**, sondern mit
  `node tools/screenshots.mjs <ordner> [breite] [hoehe]`.
- **Umlaute aus Python erscheinen in Git Bash als Ersatzzeichen** — `PYTHONIOENCODING=utf-8`
  setzen, bevor man an einen Kodierungsfehler glaubt.
- **Zugangsdaten und Hochlade-Skript der Stilprobe von JGC Lumen** liegen im privaten Repo
  `C:\Projekte\Stilprobe-Automatik`. Nur lesen, nichts übernehmen: dieses Repo ist öffentlich.
