# Weitermachen

Stand: 08.09.2026 · Version 0.1.0 · Tag `v0.1.0`

- **Vorschau:** https://jgc-coding.github.io/jgc-handwerk-website/
- **Repo:** https://github.com/jgc-coding/jgc-handwerk-website
- **Lokal:** `node tools/server.mjs` → http://localhost:4173

## Stand

Projekt neu angelegt (Stufe Produkt) und in einer Session fertig gebaut: die neue Fassung der
JGC-Handwerk-Website. Inhalte, Logo, Fotos und Farbwelt stammen vollständig von der
bestehenden Seite jgc-handwerk.de; Aufbau und Bewegungssprache folgen fora.so.

Gebaut sind Startseite (Hero, Willkommen, Leistungen als Reiter, Über mich, Projektbahn mit
zwei Vorher/Nachher-Reglern, Kontakt), Impressum und Datenschutzerklärung. Vanilla
HTML/CSS/JS ohne Build-Schritt, Schriften und GSAP lokal, keine Verbindung zu fremden
Servern. Bilder als WebP, 2,5 MB → 1,2 MB.

Geprüft: `node tools/pruefen.mjs` grün, Reiter/Formularprüfung/Vergleichsregler/Mobilmenü
einzeln durchgeklickt, Sichtkontrolle in 1440×900 und 390×844, einmal gegen die
veröffentlichte Adresse. Deploy-Workflow dreimal grün. Drei Fehler dabei selbst gefunden und
behoben (Mobilmenü-Knopf, Hero-Höhe, Versatz der Bildergalerie).

**Nicht geprüft:** Safari und Firefox, echte Geräte, Bedienung mit Vorleseprogramm, Ladezeit
unter Mobilfunk.

## Offen

Nichts halb Fertiges im Code. Alle offenen Punkte hängen an Gabriels Rückmeldung und stehen
mit Beschreibung in `verbesserungen.md`.

## Nächste Schritte (Claude)

1. **V2** einarbeiten, sobald Gabriel die zehn Leistungssätze bestätigt oder geändert hat.
   Die Stellen sind in `index.html` mit `<!-- TEXT PRUEFEN -->` markiert.
2. **V3** umsetzen, sobald der Formulardienst feststeht: URL in `JGC.formularEndpunkt`
   (`assets/js/config.js`) eintragen **und** den Dienst im selben Zug in `datenschutz.html`
   als Datenempfänger aufnehmen.
3. Porträtfoto im Über-mich-Bereich entfernen, falls Gabriel es nicht veröffentlicht haben
   will (`assets/img/gabriel.webp`, eingebunden in `index.html`).
4. **Umzug auf die eigene Domain vorbereiten**, wenn Gabriel die Fassung freigibt: `noindex`
   in `index.html` und `robots.txt` entfernen, Hoster in `datenschutz.html` Abschnitt 2
   anpassen, `og:image` auf die dann gültige Adresse zeigen lassen.
5. Nachholen, falls gewünscht: Prüfung in Safari und Firefox sowie mit einem
   Vorleseprogramm. Die Tastaturbedienung von Reitern und Reglern ist gebaut, aber nur
   programmatisch getestet.

## Aktuelle Stolperfallen/Workarounds

Dauerhafte Regeln stehen in der `CLAUDE.md`; hier nur, was beim Weitermachen sofort greift:

- **Sichtkontrollen nie über die Browser-Pane.** Ist die Pane ausgeblendet, kommt alles
  außerhalb des zuletzt gezeichneten Ausschnitts weiß zurück — das kostete in dieser Session
  mehrere Runden Fehlersuche an einem Problem, das es nicht gab. Stattdessen
  `node tools/screenshots.mjs <ordner> [breite] [hoehe]`; mit `BASIS=<url>` läuft es auch
  gegen die veröffentlichte Seite.
- Beim Fernsteuern eines Browsers `scrollTo({ top: y, behavior: "instant" })` verwenden —
  `scroll-behavior: smooth` verschluckt sonst den Sprung.
- Reguläre Ausdrücke in `tools/*.mjs` nie per Bash-Heredoc schreiben: der Heredoc frisst den
  doppelten Backslash, und `server.mjs` stürzte beim ersten Start sofort ab.
