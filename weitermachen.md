# Weitermachen

Stand: 29.09.2026 · Version 0.5.0 **veröffentlicht** · Tags `v0.1.0` bis `v0.5.0` gesetzt und gepusht
· **Kontaktformular live**, Test-Mail angekommen · Rückkehrpunkt vor diesem save-state: `main` auf 7449ea7

- **Vorschau:** https://jgc-coding.github.io/jgc-handwerk-website/ (zeigt 0.5.0)
- **Repo:** https://github.com/jgc-coding/jgc-handwerk-website
- **Lokal:** `node tools/server.mjs` → http://localhost:4173 (Port belegt? siehe `CLAUDE.md`)

## Stand

**29.09.2026: Kontaktformular live, V3 erledigt.** Mit Gabriels Freigabe im KAS eingerichtet:
Subdomain `formular.jgc-handwerk.de` (Ordner `/formular.jgc-handwerk.de/`, PHP 8.5),
Let's-Encrypt-Zertifikat bis 28.12.2026 mit automatischer Verlängerung, `senden.php` per WebFTP
hochgeladen (Login-Symbol des Hauptnutzers, ohne Passwort). Selbsttest grün:
`405 {"ok":false,"grund":"methode"}`, Zertifikat gültig, Vorabfrage von der Vorschau erlaubt,
fremde Herkunft 403. Eine echte Test-Anfrage über die Vorschau kam laut Gabriel im Postfach
kontakt@ an. Der AVV ist Teil des Hosting-Vertrags (seit 05.02.2024). Den FTP-Nutzer
„formular-handwerk“ (nur dieser Ordner) hat Gabriel mit eigenem Passwort angelegt. Aufgeräumt:
die drei gemergten Branches der alten Worktrees sind gelöscht.

Davor (24.09.): 0.4.0 Bretterwand als Startbereich, 0.5.0 Leistungs-Karten am Handy und
„bewusst-werken“ entfernt — Details im `CHANGELOG.md`.
**Nicht geprüft:** echte Handys, Safari und Firefox.

## Aktuelle Stolperfallen/Workarounds

- **Ältere Worktrees liegen noch** (`handwerk-hero-sections-986d61`, `jgc-handwerk-seite-24482a`,
  dazu `jgc-handwerk-seite-afa828` dieser Sitzung, jetzt ohne Branch). Ihre `weitermachen.md` und
  `CLAUDE.md` sind veraltet — dort nie ohne `git merge --ff-only main` weiterarbeiten.

## Nächste Schritte (Claude)

1. Rückmeldungen aus Gabriels Handy-Test (`docs/tests/handy-0.5.0.md`) einarbeiten.
2. V7 beheben (Schein hinter dem Porträt, 1 px Überlauf am Handy), dann `regression.mjs`.
3. I2 mit Gabriel klären: Entwurf 3 als Erklärbild im Reiter Trockenbau?
4. V4, dann Umzug auf die eigene Domain (V6): `noindex` und `robots.txt` entfernen,
   Datenschutz Abschnitt 2, `og:image`. Porträtfoto klären (offen seit 0.1.0).

## Offen

- Handy-Test von 0.5.0 steht aus (Liste in `docs/tests/handy-0.5.0.md`).

## Was Gabriel selbst tun muss

- [ ] Version 0.5.0 am Handy durchklicken, Liste in docs/tests/handy-0.5.0.md (seit 2026-09-24)
- [ ] Datenschutzerklaerung fachlich pruefen lassen (V4) (seit 2026-09-08)
  - Vor dem Umzug auf die eigene Domain - Impressumsservice kann das meist mitpruefen
- [ ] Alte WordPress-Seite: Dresden-Anschrift in der Datenschutzerklaerung durch Hoyerswerda ersetzen (seit 2026-09-13)
- [ ] Claude Rueckmeldung geben: Portraetfoto im Ueber-mich-Bereich freigeben oder entfernen lassen (seit 2026-09-13)
- [ ] Alte Worktrees entfernen, sobald darin keine Sitzung mehr laeuft (seit 2026-09-24) — je ein Befehl:
  - `git -C "C:/Projekte/JGC Handwerk Website" worktree remove "C:/Projekte/JGC Handwerk Website/.claude/worktrees/handwerk-hero-sections-986d61"`
  - `git -C "C:/Projekte/JGC Handwerk Website" worktree remove "C:/Projekte/JGC Handwerk Website/.claude/worktrees/jgc-handwerk-seite-24482a"`
  - `git -C "C:/Projekte/JGC Handwerk Website" worktree remove "C:/Projekte/JGC Handwerk Website/.claude/worktrees/jgc-handwerk-seite-afa828"`
