# Verbesserungen und offene Befunde

Stand: 08.09.2026. Jeder Punkt hat eine Nummer, damit `weitermachen.md` und Commits darauf
verweisen können, ohne die Beschreibung zu wiederholen.

---

## V1 · Widersprüchliche Anschrift klären · hoch · S

**Gefahr:** Auf deiner bestehenden Seite steht im Impressum eine andere Anschrift als in der
Datenschutzerklärung — Hoyerswerda gegen Dresden. Wer dich anschreiben will oder muss,
findet zwei Adressen und weiß nicht, welche gilt. Bei einer Abmahnung ist ein fehlerhaftes
Impressum der klassische Angriffspunkt.

**Bezug:** Betrifft dich direkt. Ich habe für die neue Fassung durchgehend die
Impressums-Adresse genommen (Hoyerswerda, steht auch im Footer deiner Live-Seite) — siehe
[impressum.html](impressum.html) und [datenschutz.html](datenschutz.html). Empfehlung: beim
Impressumsservice nachfragen, welche gilt, und die alte Seite ebenfalls korrigieren.

---

## V2 · Leistungsbeschreibungen bestätigen · hoch · S

**Gefahr:** Deine alte Seite listet die fünf Leistungen nur als Stichpunkte. Für die neue
Darstellung habe ich je einen erklärenden Satz ergänzt, etwa „vom Ständerwerk bis zur fertig
gespachtelten Fläche". Wenn du eine dieser Arbeiten gar nicht anbietest, verspricht die Seite
etwas, das du nachher ablehnen musst.

**Bezug:** Betrifft dich direkt. Die betroffenen Stellen sind in
[index.html](index.html) mit `<!-- TEXT PRUEFEN -->` markiert, insgesamt zehn Sätze im
Leistungsabschnitt. Empfehlung: einmal durchlesen und mir sagen, was weg oder anders soll.

---

## V3 · Kontaktformular anschließen · hoch · S

**Gefahr:** Das Formular prüft zwar alle Eingaben, verschickt aber nichts. Ginge die Seite so
live, würden Anfragen ins Leere laufen. Aktuell sagt es dem Besucher das offen und verweist
auf Telefon und E-Mail — als Dauerlösung ist das aber eine verlorene Anfrage nach der
anderen.

**Bezug:** Betrifft dich, sobald die Seite live geht. Ein Formulardienst wie Formspree wird in
`JGC.formularEndpunkt` in [config.js](assets/js/config.js) eingetragen, das ist eine Zeile.
Der Dienst muss dann zusätzlich in die Datenschutzerklärung.

---

## V4 · Datenschutzerklärung fachlich prüfen lassen · mittel · S

**Gefahr:** Ich habe die Erklärung an die neue Technik angepasst: GitHub statt All-Inkl als
Hoster, keine Cookies, keine Besucherzählung, Schriften vom eigenen Server. Das beschreibt
den tatsächlichen Zustand — ich bin aber kein Anwalt, und ein Fehler in diesem Text ist
teurer als der Text selbst.

**Bezug:** Betrifft dich vor dem Livegang. Wenn du ohnehin einen Impressumsservice nutzt,
lässt sich der Text dort meist mitprüfen. Datei: [datenschutz.html](datenschutz.html).

---

## V5 · Vorher/Nachher-Paare zeigen unterschiedliche Ausschnitte · niedrig · M

**Gefahr:** Beim Regler „Trockenbau Hallenwand" ist das Vorher-Bild hochkant und das
Nachher-Bild quer aufgenommen. Der Regler schiebt dadurch zwei verschiedene Blickwinkel
übereinander statt derselben Ansicht vorher und nachher — der Aha-Effekt bleibt aus.

**Bezug:** Betrifft nur die Wirkung, nichts funktioniert falsch. Die Originalbilder auf deiner
alten Seite haben schon diese Ausschnitte. Beim nächsten Projekt beide Bilder vom selben
Standpunkt aufnehmen, dann wird der Regler zum stärksten Element der Seite.

---

## I1 · Ideen für später

- **Kundenstimmen.** Drei Sätze von zufriedenen Auftraggebern wirken bei Handwerksleistungen
  stärker als jede Selbstbeschreibung. Platz dafür wäre zwischen Projekten und Kontakt.
- **Projekte mit Ort und Umfang beschriften.** „Trockenbau, Dachgeschoss, 40 m², Freiburg-Wiehre"
  sagt mehr als „Trockenbau" und hilft auch bei der Auffindbarkeit in Suchmaschinen.
- **Eigene Seite je Leistung.** Fünf Unterseiten mit je 300 Wörtern werden von Google deutlich
  besser gefunden als fünf Stichpunkte auf einer Seite. Sinnvoll erst, wenn die Texte stehen.
- **Fotos vom Arbeitsprozess.** Das Porträt wirkt stark, weil man ein Gesicht sieht. Zwei, drei
  Bilder von dir bei der Arbeit hätten denselben Effekt für die Projektgalerie.
