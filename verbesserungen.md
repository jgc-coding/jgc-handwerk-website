# Verbesserungen und offene Befunde

Stand: 13.09.2026. Jeder Punkt hat eine Nummer, damit `weitermachen.md` und Commits darauf
verweisen können, ohne die Beschreibung zu wiederholen. Erledigtes steht im `CHANGELOG.md`
(V1 und V2 mit Version 0.2.0).

---

## V3 · Formular-Skript bei All-Inkl hochladen und live testen · hoch · S

**Gefahr:** Ab Version 0.2.0 schickt die Seite Anfragen an `formular/senden.php` bei All-Inkl.
Liegt die Datei dort nicht, bekommt jeder Besucher beim Absenden eine Fehlermeldung — die
Anfrage kommt nicht an, und nur wer anruft, erreicht dich.

**Bezug:** Betrifft dich vor dem Veröffentlichen von 0.2.0. Das Skript ist lokal in 13 Fällen
mit PHP 8.3 und 8.5 geprüft. Offen sind drei Schritte: den AVV mit All-Inkl bestätigen (die
Datenschutzerklärung sagt, dass er besteht), die Datei in den Ordner `formular` der Domain
laden, eine Test-Anfrage schicken. Erst danach veröffentlichen.

---

## V4 · Datenschutzerklärung fachlich prüfen lassen · mittel · S

**Gefahr:** Ich habe die Erklärung an die neue Technik angepasst: GitHub für die Seite, All-Inkl
für Formular und E-Mail, keine Cookies, keine Besucherzählung, Schriften vom eigenen Server.
Das beschreibt den tatsächlichen Zustand — ich bin aber kein Anwalt, und ein Fehler in diesem
Text ist teurer als der Text selbst.

**Bezug:** Betrifft dich vor dem Livegang; am 13.09.2026 bestätigt. Sinnvoll erst nach V3, weil
die Abschnitte zu All-Inkl und zum Kontaktformular neu sind. Datei:
[datenschutz.html](datenschutz.html).

---

## V5 · Vorher/Nachher-Paare zeigen unterschiedliche Ausschnitte · niedrig · M

**Gefahr:** Beim Regler „Trockenbau Hallenwand" ist das Vorher-Bild hochkant und das
Nachher-Bild quer aufgenommen. Der Regler schiebt dadurch zwei verschiedene Blickwinkel
übereinander statt derselben Ansicht vorher und nachher — der Aha-Effekt bleibt aus.

**Bezug:** Betrifft nur die Wirkung, nichts funktioniert falsch. Die Originalbilder auf deiner
alten Seite haben schon diese Ausschnitte. Beim nächsten Projekt beide Bilder vom selben
Standpunkt aufnehmen, dann wird der Regler zum stärksten Element der Seite.

---

## V6 · Beim Umzug die Seite zu All-Inkl statt GitHub legen · mittel · M

**Gefahr:** Solange die Seite bei GitHub liegt, geht bei jedem Besuch die IP-Adresse an ein
US-Unternehmen. Das ist erlaubt und in der Erklärung genannt, aber angreifbarer als ein
deutscher Hoster.

**Bezug:** Betrifft dich beim Umzug auf jgc-handwerk.de. Bei All-Inkl läge alles in
Deutschland, direkt neben dem Formular-Skript. Zeigt die Domain dagegen auf GitHub, muss das
Skript auf eine Subdomain bei All-Inkl umziehen.

---

## I1 · Ideen für später

- **Dachdecker auch im Startbereich nennen.** Startbereich, Vertrauensleiste und die
  Beschreibung für Suchmaschinen sprechen bisher nur von Zimmereien. Die Dachdecker stehen
  nur im Reiter „Zuarbeit Dach- und Gaubenbau".
- **Kundenstimmen.** Drei Sätze von zufriedenen Auftraggebern wirken bei Handwerksleistungen
  stärker als jede Selbstbeschreibung. Platz dafür wäre zwischen Projekten und Kontakt.
- **Projekte mit Ort und Umfang beschriften.** „Trockenbau, Dachgeschoss, 40 m², Freiburg-Wiehre"
  sagt mehr als „Trockenbau" und hilft auch bei der Auffindbarkeit in Suchmaschinen.
- **Eigene Seite je Leistung.** Fünf Unterseiten mit je 300 Wörtern werden von Google deutlich
  besser gefunden als fünf Stichpunkte auf einer Seite. Sinnvoll erst, wenn die Texte stehen.
- **Fotos vom Arbeitsprozess.** Das Porträt wirkt stark, weil man ein Gesicht sieht. Zwei, drei
  Bilder von dir bei der Arbeit hätten denselben Effekt für die Projektgalerie.
