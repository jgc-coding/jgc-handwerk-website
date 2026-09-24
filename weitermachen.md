# Weitermachen

Stand: 24.09.2026 · Version 0.4.0 **veröffentlicht** · Tags `v0.1.0` bis `v0.4.0` gesetzt und gepusht

- **Vorschau:** https://jgc-coding.github.io/jgc-handwerk-website/ (zeigt 0.4.0)
- **Repo:** https://github.com/jgc-coding/jgc-handwerk-website
- **Lokal:** `node tools/server.mjs` → http://localhost:4173 (Port belegt? `PORT=4180` davor)

## Stand

**0.4.0: Bretterwand als Startbereich** (Sitzung 24.09., Details im `CHANGELOG.md`). Gabriel
hat Hero-Entwurf 2 gewählt und ein lesbareres erstes Bild verlangt. Hinter Leitsatz und
Logo-Schrift liegt jetzt je eine halb deckende helle Ebene (sein Vorschlag, 50 %), hinter
„Scrollen“ eine dunkle. Kontrast an den dunkelsten 5 %: Leitsatz 2,5 → 7,9, Logo 1,8 → 4,5.
Mit 0.4.0 gingen auch 0.2.0 und 0.3.0 online, das Formular ist eingeschaltet (Gabriels
Entscheidung). `main` = `origin/main`.

Die drei Entwürfe sind aus dem Repo entfernt: gesichert im Commit ef41e2e und als startbare
Kopie in Gabriels Materialordner der Website (Pfad im Memory, `LIESMICH.txt` darin).
Neues Werkzeug `tools/regression.mjs` (29 Prüfungen, misst auch den Kontrast).

Geprüft: `pruefen.mjs` grün; `regression.mjs` 29/29 lokal und gegen die veröffentlichte Seite;
Aufnahmen 1440×900, 1366×700, 390×844 an mehreren Scrollstellen; ohne JavaScript, ruhige
Darstellung, Druckansicht; Deploy-Lauf grün, Vorschau zeigt 0.4.0.
**Nicht geprüft:** echte Handys (Adressleiste, Streifen unten), Safari und Firefox, das
Bewegungsgefühl selbst, Mailzustellung (Formular-Subdomain fehlt, siehe V3).

## Aktuelle Stolperfallen/Workarounds

- **Das Formular scheitert, bis V3 erledigt ist.** Selbsttest am 24.09.: Zertifikat der
  Subdomain ungültig, `senden.php` fehlt. Besucher sehen eine Fehlermeldung mit Telefonnummer.
- **Bretterwand:** keine CSS-Transition auf `transform` der bewegten Teile, Auftritte nur an
  die Kapseln selbst, am Handy `svh`/`lvh` nicht vereinfachen (Details in `CLAUDE.md`).
- **Der Vorschau-Server der Browser-Pane stirbt zwischen den Zügen** — vor jeder Aufnahme-Serie
  `curl` auf die Seite. Port 4173 kann von einer anderen Sitzung belegt sein: Gegenprobe ist
  die Version in der Fußzeile, Ausweg `PORT=4180` und `BASIS=http://localhost:4180`.
- **Sichtkontrollen nie über die Browser-Pane**, sondern `tools/screenshots.mjs` und
  `tools/regression.mjs`.
- **Umlaute aus Python erscheinen in Git Bash als Ersatzzeichen** — `PYTHONIOENCODING=utf-8`.
- **Zugangsdaten und Hochlade-Skript der Stilprobe von JGC Lumen** liegen im privaten Repo
  `C:\Projekte\Stilprobe-Automatik`. Nur lesen, nichts übernehmen: dieses Repo ist öffentlich.

## Nächste Schritte (Claude)

1. Nach Gabriels Einrichtung (V3): Selbsttest ohne Mail, `https://formular.jgc-handwerk.de/senden.php`
   muss `{"ok":false,"grund":"methode"}` zeigen. Dann mit Gabriels OK eine echte Test-Anfrage
   über die Vorschau; scheitert sie, Status und Kennung aus der Antwort nehmen und das
   PHP-Fehlerlog im KAS ansehen.
2. V7 beheben (Schein hinter dem Porträt, 1 px Überlauf am Handy), dann `regression.mjs`.
3. I2 mit Gabriel klären: Entwurf 3 als Erklärbild im Reiter Trockenbau?
4. V4, dann Umzug auf die eigene Domain (V6): `noindex` und `robots.txt` entfernen,
   Datenschutz Abschnitt 2, `og:image`. Porträtfoto klären (offen seit 0.1.0).
5. Aufräumen, sobald die Sitzungen zu sind — alle Stände stecken in `main`:
   `.claude/worktrees/jgc-handwerk-website-feedback-9766c5`, `website-hero-transitions-a730c7`,
   `handwerk-hero-sections-986d61`, `jgc-handwerk-seite-afa828` samt Branches.

## Offen

- **V3 blockiert, dass Anfragen ankommen** — die Seite ist schon online.
- Gabriels Blick auf die Bretterwand am eigenen Handy.

## Was Gabriel selbst tun muss

- [ ] Formular bei All-Inkl einrichten (V3) (seit 2026-09-13) — jetzt dringend, die Seite ist online
  - Subdomain formular.jgc-handwerk.de mit SSL anlegen
  - FTP-Nutzer nur fuer den Ordner der Subdomain anlegen (nicht den Nutzer "formular" von JGC Lumen)
  - senden.php aus dem Repo (Ordner formular) direkt in diesen Ordner hochladen
  - AVV mit All-Inkl bestaetigen
  - Selbsttest: formular.jgc-handwerk.de/senden.php im Browser oeffnen, dann Claude Bescheid geben
- [ ] Bretterwand am Handy ansehen (seit 2026-09-24): Vorschau oeffnen, langsam scrollen — liest
  sich das erste Bild, bleibt unten beim Einklappen der Adressleiste kein heller Streifen?
- [ ] Datenschutzerklaerung fachlich pruefen lassen (V4) (seit 2026-09-08)
  - Vor dem Umzug auf die eigene Domain - Impressumsservice kann das meist mitpruefen
- [ ] Alte WordPress-Seite: Dresden-Anschrift in der Datenschutzerklaerung durch Hoyerswerda ersetzen (seit 2026-09-13)
- [ ] Claude Rueckmeldung geben (seit 2026-09-13)
  - Portraetfoto im Ueber-mich-Bereich freigeben oder entfernen lassen
  - Nach dem Selbsttest: OK fuer eine echte Test-Anfrage (V3)
