# Weitermachen

Stand: 08.09.2026

## Wo wir stehen

Die neue Fassung der JGC-Handwerk-Website ist gebaut, geprüft und veröffentlicht.
Version 0.1.0, Tag `v0.1.0`.

- **Vorschau:** https://jgc-coding.github.io/jgc-handwerk-website/
- **Repo:** https://github.com/jgc-coding/jgc-handwerk-website
- **Lokal:** `node tools/server.mjs` → http://localhost:4173

Inhalte, Logo und Farbwelt stammen vollständig von der bestehenden Seite jgc-handwerk.de.
Aufbau und Bewegungssprache folgen fora.so: Kapsel-Etiketten, große schlanke Typografie,
Glaskarten mit Lichtfleck am Zeiger, Einblendungen beim Scrollen, Leistungen als Reiter,
Projektbahn die seitwärts läuft, zwei Vorher/Nachher-Regler.

Geprüft wurde mit `node tools/pruefen.mjs` (grün) und per Sichtkontrolle in 1440×900 und
390×844, zusätzlich einmal gegen die veröffentlichte Adresse.

## Was als Nächstes ansteht

Die inhaltlichen Punkte liegen bei Gabriel, nicht am Code. Beschreibungen stehen in
`verbesserungen.md`, hier nur die Reihenfolge:

1. **V2** — die zehn von mir formulierten Leistungssätze durchlesen und bestätigen oder
   ändern. Sie sind im HTML mit `<!-- TEXT PRUEFEN -->` markiert.
2. **V1** — welche Anschrift gilt? Impressum und Datenschutz der alten Seite widersprechen
   sich.
3. **V3** — Kontaktformular an einen Dienst hängen, sobald klar ist, welchen.
4. **V4** — Datenschutzerklärung fachlich prüfen lassen, bevor die Seite auf die eigene
   Domain zieht.

## Stolperfallen, die aktuell gelten

- **Screenshots aus der Browser-Pane sind unbrauchbar**, sobald die Pane ausgeblendet ist:
  alles außerhalb des zuletzt gezeichneten Ausschnitts kommt weiß zurück. Für Sichtkontrollen
  `node tools/screenshots.mjs <ordner> [breite] [hoehe]` nehmen; mit `BASIS=<url>` läuft es
  auch gegen die veröffentlichte Seite.
- **`scroll-behavior: smooth`** verschluckt `window.scrollTo(0, y)` in ferngesteuerten
  Browsern — beim Testen `scrollTo({ top: y, behavior: "instant" })` verwenden.
- **Bash-Heredocs fressen doppelte Backslashes.** Reguläre Ausdrücke in `tools/*.mjs` nie per
  Heredoc schreiben, sondern mit dem Edit-Werkzeug. Ist beim Anlegen von `server.mjs`
  passiert und hat den Server sofort abstürzen lassen.
- **Die Vorschau-Sperre sitzt an zwei Stellen**: `noindex` in `index.html` und `robots.txt`.
  Beim Umzug auf die eigene Domain beide entfernen, sonst bleibt die Seite unsichtbar.
- Neue `.reveal`-Regeln müssen unter dem Selektor `.js` hängen, sonst ist die Seite ohne
  JavaScript leer.
