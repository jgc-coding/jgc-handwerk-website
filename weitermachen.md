# Weitermachen

Stand: 01.10.2026 · **Version 0.6.0 live auf https://jgc-handwerk.de** · Tag `v0.6.0` gepusht
· Rückkehrpunkt vor dem Umzug: `main` auf dee2e1f

- **Live:** https://jgc-handwerk.de (www und die alte Vorschau-Adresse leiten dorthin)
- **Repo:** https://github.com/jgc-coding/jgc-handwerk-website
- **Lokal:** `node tools/server.mjs` → http://localhost:4173 (Port belegt? siehe `CLAUDE.md`)

## Stand

**01.10.2026: Umzug erledigt (0.6.0).** Gabriels Antworten: Umsatzsteuer-ID geliefert (V9, per
EU-Prüfdienst gültig, steht im Impressum), Anschrift bleibt bewusst (V8), Porträt bleibt.
Gabriel meldete sich selbst im KAS an; Claude stellte die DNS um (Hauptdomain vier A-Einträge
auf GitHub, `www` CNAME, Platzhalter `*` unverändert — Details und Rückweg in `CLAUDE.md`),
bestätigte die Domain im GitHub-Konto und trug sie als eigene Domain im Repo ein. Zertifikat
für Haupt- und www-Domain ausgestellt (bis 30.12.2026, erneuert sich selbst), HTTPS-Pflicht an.

Geprüft auf der Domain: Version 0.6.0, Impressum mit USt-ID, alle fünf alten Adressen leiten
weiter, eigene 404, Sitemap, `robots.txt` offen, kein `noindex` auf der Startseite,
http/www/Vorschau leiten mit 301 um. Öffentliche DNS (Google, Cloudflare, Quad9) zeigen schon
auf GitHub. Formular: Vorabfrage von der Domain erlaubt, eine echte Testanfrage
(„Claude Umzugstest“, ID d0314a) kam laut Gabriel in kontakt@ an. Regressionscheck 31/31 grün.

0.6.1: Die alte Seite war in der Google Search Console per Meta-Tag bestätigt; der Code steht
jetzt auch in der neuen `index.html`. Gabriel hat ein Google-Unternehmensprofil (V12 zum Teil
erledigt — Website-Link und Einsatzgebiet dort noch nicht geprüft).

Davor am selben Tag 0.5.2 (Projektsatz, JGC-Lumen-Link, Umzugsvorbereitung), am 30.09. 0.5.1
(Rechtstexte) — Details im `CHANGELOG.md`. **Nicht geprüft:** echte Handys, Safari, Firefox.

## Aktuelle Stolperfallen/Workarounds

- **DNS-Zwischenspeicher:** Einzelne Rechner und Router sehen bis zu einige Stunden noch die alte
  WordPress-Seite. Prüfen gegen GitHub direkt: `curl --resolve jgc-handwerk.de:443:185.199.108.153 https://jgc-handwerk.de/`.
- **All-Inkl-Zertifikat der Hauptdomain** kann sich nicht mehr erneuern, weil die Domain jetzt
  auf GitHub zeigt. Kommt deswegen eine Warn-Mail von All-Inkl, ist das harmlos; im KAS unter
  SSL-Schutz lässt es sich für die Hauptdomain abschalten — **nicht** für `formular`.
- **Das SEO-Learning gibt es nur als Chatverlauf**, keine Datei:
  `C:\Users\chime\.claude\projects\C--Projekte-Experimente-und-Verschiedenes-SEO-Youtube-Video-Transkripte\eea9715c-0172-4202-89d9-d67658ac0f22.jsonl`,
  Zeilen 98/103 (fünf Merksätze) und 156/164 (Analyse Brotkorb). Die Kernpunkte für diese
  Seite stehen in V12 bis V14.
- **Vier ältere Worktrees liegen noch** (`handwerk-hero-sections-986d61`,
  `jgc-handwerk-seite-24482a`, `jgc-handwerk-seite-afa828`, `kind-jennings-d084c0`). Ihre
  `weitermachen.md` und `CLAUDE.md` sind veraltet — dort nie ohne `git merge --ff-only main`
  weiterarbeiten.

## Nächste Schritte (Claude)

1. Rückmeldungen aus Gabriels Handy-Test (`docs/tests/handy-0.5.0.md`) einarbeiten.
2. V13: erst echte Suchdaten, dann eine eigene Seite für die stärkste Leistung (vermutlich
   Trockenbau). V14, sobald Gabriel die Projektangaben liefert.
3. I2 mit Gabriel klären: Entwurf 3 als Erklärbild im Reiter Trockenbau?

## Offen

- Handy-Test steht aus (Liste in `docs/tests/handy-0.5.0.md`, gilt für 0.6.0).

## Was Gabriel selbst tun muss

- [ ] In der Google Search Console die Sitemap `https://jgc-handwerk.de/sitemap.xml` einreichen, danach Bing Webmaster Tools (seit 2026-10-01)
- [ ] Version 0.6.0 am Handy durchklicken, Liste in docs/tests/handy-0.5.0.md (seit 2026-09-24) — besonders „seitlich wischen“
- [ ] Entscheiden: SEO-Learning als Datei in Claude-Skills\grundlagen ablegen? (seit 2026-09-30)
- [ ] Alte Worktrees entfernen, sobald darin keine Sitzung mehr laeuft (seit 2026-09-24) — je ein Befehl:
  - `git -C "C:/Projekte/JGC Handwerk Website" worktree remove "C:/Projekte/JGC Handwerk Website/.claude/worktrees/handwerk-hero-sections-986d61"`
  - `git -C "C:/Projekte/JGC Handwerk Website" worktree remove "C:/Projekte/JGC Handwerk Website/.claude/worktrees/jgc-handwerk-seite-24482a"`
  - `git -C "C:/Projekte/JGC Handwerk Website" worktree remove "C:/Projekte/JGC Handwerk Website/.claude/worktrees/jgc-handwerk-seite-afa828"`
  - `git -C "C:/Projekte/JGC Handwerk Website" worktree remove "C:/Projekte/JGC Handwerk Website/.claude/worktrees/kind-jennings-d084c0"`
