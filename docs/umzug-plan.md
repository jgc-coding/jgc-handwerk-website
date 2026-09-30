# Plan: Neue Website läuft auf jgc-handwerk.de (GitHub Pages)

Stand: 30.09.2026 · Umsetzung in der nächsten Sitzung · Hosting: GitHub Pages (Gabriels
Entscheidung vom 30.09.2026, V6)

---

## ⚠️ **ERINNERUNG AN GABRIEL: STEUERNUMMER FÜRS IMPRESSUM (V9)**

**Hast du eine Umsatzsteuer-Identifikationsnummer oder schon die neue
Wirtschafts-Identifikationsnummer vom Finanzamt? Wenn ja, MUSS sie ins Impressum — eine
fehlende Pflichtangabe ist ein klassischer Abmahngrund. Bitte VOR dem Umzug an Claude
geben oder sagen, dass du keine hast.**

---

## Voraussetzungen (Gabriel)

- [ ] **V9 Steuernummer liefern** (siehe oben) — blockiert den Umzug
- [ ] **V8 Impressum-Anschrift klären** — Weiterleitungsadresse in Hoyerswerda oder Adresse
      der Betriebsanmeldung? Empfehlung: Rechtsberatung der Handwerkskammer Freiburg fragen.
      Blockiert den Umzug
- [ ] Porträtfoto im Bereich „Über mich“ freigeben oder entfernen lassen
- [ ] Empfohlen: Handy-Test von 0.5.0 (`docs/tests/handy-0.5.0.md`)
- [ ] Zur Umstellung im KAS angemeldet sein (Claude schickt nie ein Passwort ab)

## Schritte (Claude)

1. Rückkehrpunkt-Commit.
2. Impressum nach V8 und V9 anpassen; Porträt nach Gabriels Entscheidung.
3. V7 beheben (1 px Überlauf am Handy), danach `node tools/regression.mjs`.
4. **V10 Alte Adressen weiterleiten.** GitHub kann nicht serverseitig weiterleiten, darum je
   eine kleine Seite mit sofortiger Weiterleitung (Meta-Refresh 0, `canonical`, JS-Fallback):
   - `/leistungen/` → `/#leistungen`
   - `/ueber-mich/` → `/#ueber-mich`
   - `/impressum/` → `/impressum.html`
   - `/datenschutz/` → `/datenschutz.html`
   - `/sample-page/` → `/`
   Dazu eine eigene `404.html`. Prüfen, ob `tools/pruefen.mjs` die neuen Seiten mitprüft.
5. **V11 Reihenfolge für Google**, Sperre bleibt dabei noch drin:
   - `sitemap.xml` mit den endgültigen Adressen (nur Seiten ohne `noindex`, also `/`)
   - neue `robots.txt` vorbereiten: alles erlaubt, Verweis auf die Sitemap
   - Seitentitel mit dem Suchbegriff vorn, etwa „Trockenbau & Montage in Freiburg | JGC
     Handwerk“; die sichtbaren Überschriften bleiben Markensätze
   - Firmenangaben im Quelltext: Freiburg als Einsatzgebiet, **keine** Anschrift in
     Hoyerswerda (würde Google einen falschen Ort melden)
   - Vorschaubild für geteilte Links (`og:image`) prüfen — stand schon im alten Plan, zeigt
     derzeit `p-trockenbau.webp`
6. Eigene Domain bei GitHub eintragen. Der Deploy läuft über GitHub Actions, darum wirkt
   eine `CNAME`-Datei nicht — die Domain kommt in die Repo-Einstellungen (Pages → Custom
   domain, oder `gh api`). Domain im GitHub-Konto bestätigen (TXT-Eintrag), damit niemand
   sie mit einer fremden GitHub-Seite übernehmen kann.
7. **DNS bei All-Inkl umstellen** (mit Gabriel im KAS). Vorher alle bestehenden Einträge
   notieren oder abfotografieren — das ist der Rückweg.
   - Hauptdomain: A-Einträge auf `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
     `185.199.111.153`
   - `www`: CNAME auf `jgc-coding.github.io`
   - **Unverändert lassen:** MX (E-Mail), `formular` samt Zertifikat, SPF und andere TXT
   - Die WordPress-Dateien bleiben unangetastet auf dem Server liegen.
8. Warten, bis GitHub das Zertifikat ausstellt (Minuten bis Stunden), dann „Enforce HTTPS“.
9. Prüfen (siehe Akzeptanzkriterien).
10. **Zuletzt scharf schalten:** `noindex` aus `index.html` entfernen und die neue
    `robots.txt` einsetzen. Impressum und Datenschutz behalten ihr `noindex, follow`.
    Stolperfalle „Vorschau-Sperre“ in `CLAUDE.md` nachziehen.
11. Version 0.6.0, CHANGELOG, Tag `v0.6.0`, pushen.

## Danach (Gabriel)

- [ ] Google Search Console einrichten (Bestätigung per TXT-Eintrag bei All-Inkl),
      Sitemap einreichen
- [ ] Bing Webmaster Tools einrichten (kann die Daten aus der Search Console übernehmen)
- [ ] V12 Google-Unternehmensprofil anlegen oder prüfen: Adresse verbergen, Freiburg als
      Einsatzgebiet

## Akzeptanzkriterien

- [ ] https://jgc-handwerk.de zeigt die neue Seite, Fußzeile „Version 0.6.0“
- [ ] https://www.jgc-handwerk.de leitet auf die Hauptdomain, beide mit gültigem Zertifikat
- [ ] Kontaktformular von der neuen Adresse abgeschickt, Mail kommt in kontakt@ an
- [ ] Eine Test-Mail an kontakt@ kommt an (E-Mail nicht beschädigt)
- [ ] https://formular.jgc-handwerk.de/senden.php antwortet weiter mit 405
- [ ] Alle fünf alten Adressen landen an der richtigen Stelle
- [ ] Unbekannte Adresse zeigt die eigene 404-Seite
- [ ] `robots.txt` erlaubt alles und nennt die Sitemap; `index.html` ohne `noindex`
- [ ] Impressum enthält Steuernummer (falls vorhanden) und die geklärte Anschrift
- [ ] `node tools/pruefen.mjs` und `node tools/regression.mjs` grün

## Risiken

- **E-Mail:** Wer beim DNS die MX-Einträge anfasst, legt das Postfach lahm. Nur A und
  `www` ändern.
- **Kurze Zertifikatslücke:** Bis GitHub das Zertifikat ausgestellt hat, können Besucher
  eine Sicherheitswarnung sehen. Darum abends umstellen.
- **Rückweg:** DNS-Einträge zurück auf `85.13.154.127`, die alte Seite liegt noch da.

## Annahmen

- Das Formular-Skript nimmt `jgc-handwerk.de` und `www` bereits an (am 30.09.2026 per
  Vorabfrage geprüft) — dort ist nichts zu ändern.
- Datenschutz Abschnitt 2 beschreibt GitHub Pages bereits (0.5.1).
- Die alte Seite hat genau diese Unterseiten (laut ihrer Sitemap vom 30.09.2026).

## Nicht enthalten

Eigene Seiten je Leistung (V13), Projekte mit Ort und Umfang (V14), Suchbegriff-Recherche
mit echten Daten, Google-Unternehmensprofil (V12, macht Gabriel). Bewusst gar nicht: eine
Seite pro Nachbarstadt, gekaufte Links, `llms.txt`, Punktejagd im Tempotest.
