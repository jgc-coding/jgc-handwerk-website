# Weitermachen

Stand: 24.09.2026 · Version 0.5.0 **veröffentlicht** · Tags `v0.1.0` bis `v0.5.0` gesetzt und gepusht
· Rückkehrpunkt vor diesem save-state: `main` auf 0979f75

- **Vorschau:** https://jgc-coding.github.io/jgc-handwerk-website/ (zeigt 0.5.0)
- **Repo:** https://github.com/jgc-coding/jgc-handwerk-website
- **Lokal:** `node tools/server.mjs` → http://localhost:4173 (Port belegt? siehe `CLAUDE.md`)

## Stand

Sitzung 24.09.2026, zwei Versionen, beide online (Details im `CHANGELOG.md`):

- **0.4.0 Bretterwand als Startbereich.** Gabriel hat Hero-Entwurf 2 gewählt. Hinter Leitsatz
  und Logo-Schrift liegt je eine halb deckende helle Ebene (sein Vorschlag, 50 %), hinter
  „Scrollen“ eine dunkle; Kontrast an den dunkelsten 5 %: Leitsatz 2,5 → 7,9, Logo 1,8 → 4,5.
  Mit 0.4.0 gingen auch 0.2.0 und 0.3.0 online, das Formular ist eingeschaltet (Gabriels
  Entscheidung). Die drei Entwürfe sind aus dem Repo entfernt: im Commit ef41e2e und als
  startbare Kopie in Gabriels Materialordner (Pfad im Memory). Neues Werkzeug
  `tools/regression.mjs`.
- **0.5.0 Rückmeldungen.** Leistungen am Handy und Tablet als Karten mit je eigenem Bild,
  kräftigerer Bildverlauf (Bildunterschriften überall über 5,3 : 1). „bewusst-werken“ komplett
  entfernt: Kachel „Gründungsmitglied“, Fußzeilen-Link, Freigabe in `pruefen.mjs`.

Geprüft: `pruefen.mjs` grün; `regression.mjs` 31/31 lokal und gegen die veröffentlichte Seite;
Aufnahmen 1440×900, 1366×700, 390×844; ohne JavaScript, ruhige Darstellung, Druckansicht;
beide Deploy-Läufe grün. **Nicht geprüft:** echte Handys (Adressleiste, Streifen unten),
Safari und Firefox, das Bewegungsgefühl selbst, Mailzustellung (V3).

## Aktuelle Stolperfallen/Workarounds

- **Das Formular scheitert, bis V3 erledigt ist.** Selbsttest am 24.09.: Zertifikat der
  Subdomain ungültig, `senden.php` fehlt. Besucher sehen eine Fehlermeldung mit Telefonnummer.
  Das Skript lässt `https://jgc-coding.github.io` schon als Herkunft zu.
- **Drei ältere Worktrees stehen hinter `main`** (`handwerk-hero-sections-986d61`,
  `jgc-handwerk-seite-24482a`, `website-hero-transitions-a730c7`). Ihre `weitermachen.md` und
  `CLAUDE.md` sind veraltet — dort nie ohne `git merge --ff-only main` weiterarbeiten.

## Nächste Schritte (Claude)

1. Nach Gabriels Einrichtung (V3): Selbsttest ohne Mail, `https://formular.jgc-handwerk.de/senden.php`
   muss `{"ok":false,"grund":"methode"}` zeigen. Dann mit Gabriels OK eine echte Test-Anfrage
   über die Vorschau; scheitert sie, Status und Kennung aus der Antwort nehmen und das
   PHP-Fehlerlog im KAS ansehen.
2. Rückmeldungen aus Gabriels Handy-Test (`docs/tests/handy-0.5.0.md`) einarbeiten.
3. V7 beheben (Schein hinter dem Porträt, 1 px Überlauf am Handy), dann `regression.mjs`.
4. I2 mit Gabriel klären: Entwurf 3 als Erklärbild im Reiter Trockenbau?
5. V4, dann Umzug auf die eigene Domain (V6): `noindex` und `robots.txt` entfernen,
   Datenschutz Abschnitt 2, `og:image`. Porträtfoto klären (offen seit 0.1.0).
6. Sind die alten Worktrees entfernt (Gabriel, siehe unten): ihre Branches mit
   `git -C "C:\Projekte\JGC Handwerk Website" branch -d <name>` löschen — alle Stände stecken in `main`.

## Offen

- **V3 blockiert, dass Anfragen ankommen** — die Seite ist schon online.
- Handy-Test von 0.5.0 steht aus (Liste in `docs/tests/handy-0.5.0.md`).

## Was Gabriel selbst tun muss

- [ ] [blockiert Claude] Formular bei All-Inkl einrichten (V3) (seit 2026-09-13) — dringend, die Seite ist online
  - Subdomain formular.jgc-handwerk.de mit SSL anlegen
  - FTP-Nutzer nur fuer den Ordner der Subdomain anlegen (nicht den Nutzer "formular" von JGC Lumen)
  - senden.php aus dem Repo (Ordner formular) direkt in diesen Ordner hochladen
  - AVV mit All-Inkl bestaetigen
  - Selbsttest: formular.jgc-handwerk.de/senden.php im Browser oeffnen, dann Claude Bescheid geben
- [ ] Version 0.5.0 am Handy durchklicken, Liste in docs/tests/handy-0.5.0.md (seit 2026-09-24)
- [ ] Datenschutzerklaerung fachlich pruefen lassen (V4) (seit 2026-09-08)
  - Vor dem Umzug auf die eigene Domain - Impressumsservice kann das meist mitpruefen
- [ ] Alte WordPress-Seite: Dresden-Anschrift in der Datenschutzerklaerung durch Hoyerswerda ersetzen (seit 2026-09-13)
- [ ] Claude Rueckmeldung geben (seit 2026-09-13)
  - Portraetfoto im Ueber-mich-Bereich freigeben oder entfernen lassen
  - Nach dem Selbsttest: OK fuer eine echte Test-Anfrage (V3)
- [ ] Alte Worktrees entfernen, sobald darin keine Sitzung mehr laeuft (seit 2026-09-24) — je ein Befehl:
  - `git -C "C:/Projekte/JGC Handwerk Website" worktree remove "C:/Projekte/JGC Handwerk Website/.claude/worktrees/handwerk-hero-sections-986d61"`
  - `git -C "C:/Projekte/JGC Handwerk Website" worktree remove "C:/Projekte/JGC Handwerk Website/.claude/worktrees/jgc-handwerk-seite-24482a"`
  - `git -C "C:/Projekte/JGC Handwerk Website" worktree remove "C:/Projekte/JGC Handwerk Website/.claude/worktrees/website-hero-transitions-a730c7"`
  - `git -C "C:/Projekte/JGC Handwerk Website" worktree remove "C:/Projekte/JGC Handwerk Website/.claude/worktrees/jgc-handwerk-website-feedback-9766c5"` (enthaelt ignorierte Dateien unter tools/, vorher ansehen)
  - `git -C "C:/Projekte/JGC Handwerk Website" worktree remove "C:/Projekte/JGC Handwerk Website/.claude/worktrees/jgc-handwerk-seite-afa828"` (diese Sitzung, erst wenn sie geschlossen ist)
