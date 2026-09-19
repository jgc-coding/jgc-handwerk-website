# Weitermachen

Stand: 13.09.2026 · Version 0.3.0 in `main`, **noch nicht veröffentlicht** · letzter Tag `v0.1.0`

- **Vorschau:** https://jgc-coding.github.io/jgc-handwerk-website/ (zeigt noch 0.1.0)
- **Repo:** https://github.com/jgc-coding/jgc-handwerk-website
- **Lokal:** `node tools/server.mjs` → http://localhost:4173 (Port belegt? `PORT=4180` davor)

## Stand

**0.3.0: Bewegungs-Feinschliff und Projektbahn-Fix** (Sitzung 13.09. abends, Details im
`CHANGELOG.md`). Der von Gabriel gemeldete Sprung der Bildleiste ist behoben und die Ursache
belegt: Bahn und Gleis trugen als reveal-Elemente eine CSS-Transition auf `transform`, die
beim Lösen der ScrollTrigger-Anheftung nachzog (Kontrollmessung alt: 577 px Nachlauf, neu:
0 px). Die Bahn hält jetzt am Ende 18 Prozent der Strecke still, damit das letzte Bild
wirklich zu sehen ist. Dazu: gestaffelter Hero-Auftritt mit Wort-für-Wort-Überschrift,
Zeiger- und Scroll-Parallaxe, zwei feine Hintergrund-Ringe, Scroll-Hinweis,
Wort-Einblendung aller Abschnittsüberschriften, Lesefaden oben, lebendigere
Leistungs-Panels. Vorbild fora.so und die Midsummer-Seite.

Davor (0.2.0): Gabriels Rückmeldungen V1 bis V4, Logo-Schriftzug, Kontaktformular an
`formular/senden.php` für die Subdomain `formular.jgc-handwerk.de` (Muster JGC Lumen).

`main` steht lokal auf 0.3.0, ist aber **bewusst nicht gepusht**: Gabriel hat am 13.09.
entschieden, erst nach der KAS-Einrichtung (V3) zu veröffentlichen.

Geprüft (0.3.0): `pruefen.mjs` grün; Bahn-Diagnose im Headless-Chrome (kein Nachlauf in
beide Richtungen, letzte Karte komplett im Bild, Halt ruhig); Regressionscheck Reiter,
Formularprüfung, Regler, Mobilmenü, ohne JavaScript, ruhige Darstellung — alles grün, keine
Konsolenfehler; Screenshots 1440×900, 1366×700 und 390×844.
**Nicht geprüft:** echte Geräte, Safari/Firefox, Mailzustellung bei All-Inkl (Subdomain
fehlt noch).

## Offen

- **V3 blockiert die Veröffentlichung:** Gabriel richtet Subdomain, SSL, FTP-Nutzer und AVV
  im KAS ein und lädt `senden.php` hoch (Teilschritte auf der Hub-Karte „JGC Handwerk").
- Gabriels Blick auf den neuen Hero und die Übergänge — Screenshots gingen per Telegram,
  das echte Gefühl braucht den Browser (lokal oder nach dem Push die Vorschau).

## Nächste Schritte (Claude)

1. Selbsttest ohne Mail: `https://formular.jgc-handwerk.de/senden.php` muss
   `{"ok":false,"grund":"methode"}` zeigen. Ein Zertifikatsfehler heißt, SSL ist noch nicht aktiv.
2. Mit Gabriels OK eine echte Test-Anfrage schicken: lokale Seite (`localhost:4173` ist als
   Herkunft erlaubt) mit dem echten Endpunkt; Gabriel bestätigt den Eingang. Scheitert es,
   Status und Kennung aus der Antwort nehmen und das PHP-Fehlerlog im KAS ansehen.
3. Mit Gabriels OK `git push origin main` (Deploy), auf der Vorschau Version 0.3.0 und einen
   Formularversand prüfen, Tags `v0.2.0` und `v0.3.0` setzen und pushen.
4. V4: Gabriel lässt die Datenschutzerklärung prüfen, sinnvoll nach Schritt 3.
5. Umzug auf die eigene Domain (V6): Hosting wählen, `noindex` und `robots.txt` entfernen,
   Datenschutz Abschnitt 2 anpassen, `og:image` auf die gültige Adresse.
6. Porträtfoto entfernen, falls Gabriel es nicht veröffentlicht haben will (offen seit 0.1.0).
7. Aufräumen, sobald die jeweilige Sitzung zu ist — beide Stände stecken in `main`, die
   Worktrees samt Branches sind dann verlustfrei löschbar:
   `.claude/worktrees/jgc-handwerk-website-feedback-9766c5` und
   `.claude/worktrees/website-hero-transitions-a730c7`.

## Was Gabriel selbst tun muss

Am 19.09.2026 von der Hub-Tafel hierher gezogen. Die Tafel nimmt seither nur
noch, was Gabriel selbst eintraegt oder ausdruecklich beauftragt. Wo oben im
Text von der Hub-Karte oder einem Hub-Sammelpunkt die Rede ist, sind diese
Punkte gemeint.

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
- **Wer an Bahn (`#rail`/`#railTrack`) oder Hero-Ebenen arbeitet:** niemals CSS-Transitionen
  auf `transform` dieser Elemente legen — ScrollTrigger setzt Positionen als Inline-Transform,
  eine Transition lässt sie sichtbar nachspringen (der behobene 0.3.0-Fehler). Karten und
  Inhalte einblenden, nie die transformierten Container.
- **Port 4173 kann von einer anderen Sitzung belegt sein** — der neue Server stirbt dann mit
  EADDRINUSE und man prüft unbemerkt den alten Stand. Gegenprobe ist die Version im Footer;
  Ausweg `PORT=4180 node tools/server.mjs` und Werkzeuge mit `BASIS=http://localhost:4180`.
- **Sichtkontrollen nie über die Browser-Pane**, sondern mit
  `node tools/screenshots.mjs <ordner> [breite] [hoehe]`; Hero-Endzustände brauchen längere
  Wartezeit als die 900 ms des Werkzeugs (Choreografie läuft ~2,5 s).
- **Umlaute aus Python erscheinen in Git Bash als Ersatzzeichen** — `PYTHONIOENCODING=utf-8`
  setzen, bevor man an einen Kodierungsfehler glaubt.
- **Zugangsdaten und Hochlade-Skript der Stilprobe von JGC Lumen** liegen im privaten Repo
  `C:\Projekte\Stilprobe-Automatik`. Nur lesen, nichts übernehmen: dieses Repo ist öffentlich.
