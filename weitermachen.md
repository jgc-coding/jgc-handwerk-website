# Weitermachen

Stand: 01.10.2026 · Version 0.5.2 veröffentlicht (Vorschau geprüft) · Rückkehrpunkt vor 0.5.2: `main` auf 6d486b1
· **Umzug auf jgc-handwerk.de kommt in der nächsten Sitzung — Ablauf in [docs/umzug-plan.md](docs/umzug-plan.md)**

- **Vorschau:** https://jgc-coding.github.io/jgc-handwerk-website/
- **Repo:** https://github.com/jgc-coding/jgc-handwerk-website
- **Lokal:** `node tools/server.mjs` → http://localhost:4173 (Port belegt? siehe `CLAUDE.md`)

## Stand

**01.10.2026: 0.5.2 — Gabriels Wünsche und Umzugsvorbereitung.** Projektsatz „eigene Aufträge
ebenso wie Projekte, an denen ich im Team … mitgewirkt habe“, Fußzeile mit Link auf JGC Lumen
(Link und Ziel auf der Vorschau geprüft). Vorbereitet ohne Sperre zu lösen: Weiterleitungen der
fünf alten Adressen (im echten Browser geprüft), `404.html`, `sitemap.xml`, Titel, Vorschaubild,
V7. Regressionscheck 31/31 grün. Alte WordPress-Seite gesichert in `_archiv/` (offline geprüft,
lädt mit Bildern). Gabriel fand die Seite am Handy „sehr gut“; die Testliste hat er nicht
ausdrücklich abgehakt. Für den Umzug fehlen nur noch Gabriels Angaben (V8, V9, Porträt) und
seine KAS-Anmeldung — Plan in [docs/umzug-plan.md](docs/umzug-plan.md).

**30.09.2026: Rechtstexte für GitHub-Hosting überarbeitet (0.5.1), Umzug geplant.** Gabriel hat
entschieden: Die Seite bleibt bei GitHub Pages (V6 erledigt), und Claude überarbeitet
Datenschutz und Impressum selbst statt einer externen Prüfung (V4). Datenschutz stützt die
USA-Übermittlung jetzt auf GitHubs Zertifizierung nach dem EU-US Data Privacy Framework;
Impressum hat Firmenname und Handwerksordnung. Was dabei unsicher blieb: V8 und V9.

Live geprüft am 30.09.: Formular antwortet 405, Zertifikat gültig bis 28.12.2026, das Skript
erlaubt Anfragen von `jgc-handwerk.de` und `www` schon — beim Umzug ist dort nichts zu tun.
Haupt-, `www`- und `formular`-Domain zeigen noch auf All-Inkl (`85.13.154.127`), also auf die
alte WordPress-Seite. Deren Sitemap nennt fünf Unterseiten, die weitergeleitet werden müssen
(V10).

SEO-Learning aus der früheren Sitzung ausgewertet (Analyse der Arbeit von Fedor Brotkorb):
daraus V10 bis V14. **Nicht geprüft:** echte Handys, Safari, Firefox; diese Sitzung wurde keine
echte Test-Mail über das Formular geschickt.

## Aktuelle Stolperfallen/Workarounds

- **Das SEO-Learning gibt es nur als Chatverlauf**, keine Datei:
  `C:\Users\chime\.claude\projects\C--Projekte-Experimente-und-Verschiedenes-SEO-Youtube-Video-Transkripte\eea9715c-0172-4202-89d9-d67658ac0f22.jsonl`,
  Zeilen 98/103 (fünf Merksätze) und 156/164 (Analyse Brotkorb). Die Kernpunkte für diese
  Seite stehen in V10 bis V14. Gabriel hat noch nicht entschieden, ob es als Datei nach
  `Claude-Skills\grundlagen\` soll.
- **Vier ältere Worktrees liegen noch** (`handwerk-hero-sections-986d61`,
  `jgc-handwerk-seite-24482a`, `jgc-handwerk-seite-afa828`, `kind-jennings-d084c0`). Ihre
  `weitermachen.md` und `CLAUDE.md` sind veraltet — dort nie ohne `git merge --ff-only main`
  weiterarbeiten.

## Nächste Schritte (Claude)

1. Umzug nach [docs/umzug-plan.md](docs/umzug-plan.md), ab Schritt 1 (Schritte 3 bis 5 sind
   erledigt) — wartet auf V8, V9 und Porträt von Gabriel und auf seine KAS-Anmeldung am PC.
2. Rückmeldungen aus Gabriels Handy-Test (`docs/tests/handy-0.5.0.md`) einarbeiten.
3. I2 mit Gabriel klären: Entwurf 3 als Erklärbild im Reiter Trockenbau?
4. Nach dem Umzug: V13 (erst echte Suchdaten, dann Leistungsseite Trockenbau), V14 sobald
   Gabriel die Projektangaben liefert.

## Offen

- Handy-Test von 0.5.0 steht aus (Liste in `docs/tests/handy-0.5.0.md`).

## Was Gabriel selbst tun muss

- [ ] **[blockiert Claude] STEUERNUMMER FÜRS IMPRESSUM: Umsatzsteuer-IdNr. oder Wirtschafts-IdNr. an Claude geben — oder sagen, dass du keine hast (V9)** (seit 2026-09-30)
- [ ] [blockiert Claude] Impressum-Anschrift klären, am besten mit der Rechtsberatung der Handwerkskammer Freiburg (V8) (seit 2026-09-30)
- [ ] [blockiert Claude] Claude Rueckmeldung geben: Portraetfoto im Ueber-mich-Bereich freigeben oder entfernen lassen (seit 2026-09-13)
- [ ] Version 0.5.0 am Handy durchklicken, Liste in docs/tests/handy-0.5.0.md (seit 2026-09-24) — gilt auch für 0.5.2, besonders „seitlich wischen“
- [ ] Sagen, ob es ein Google-Unternehmensprofil für JGC Handwerk gibt; sonst anlegen (V12) (seit 2026-09-30)
- [ ] Entscheiden: SEO-Learning als Datei in Claude-Skills\grundlagen ablegen? (seit 2026-09-30)
- [ ] Alte WordPress-Seite: Dresden-Anschrift in der Datenschutzerklaerung durch Hoyerswerda ersetzen (seit 2026-09-13)
  - Entfällt mit dem Umzug, weil die alte Seite dann verschwindet
- [ ] Alte Worktrees entfernen, sobald darin keine Sitzung mehr laeuft (seit 2026-09-24) — je ein Befehl:
  - `git -C "C:/Projekte/JGC Handwerk Website" worktree remove "C:/Projekte/JGC Handwerk Website/.claude/worktrees/handwerk-hero-sections-986d61"`
  - `git -C "C:/Projekte/JGC Handwerk Website" worktree remove "C:/Projekte/JGC Handwerk Website/.claude/worktrees/jgc-handwerk-seite-24482a"`
  - `git -C "C:/Projekte/JGC Handwerk Website" worktree remove "C:/Projekte/JGC Handwerk Website/.claude/worktrees/jgc-handwerk-seite-afa828"`
  - `git -C "C:/Projekte/JGC Handwerk Website" worktree remove "C:/Projekte/JGC Handwerk Website/.claude/worktrees/kind-jennings-d084c0"`
