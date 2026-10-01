# Verbesserungen und offene Befunde

Stand: 01.10.2026. V7 und V10 sind mit 0.5.2 erledigt, V9 und V11 mit dem Umzug in 0.6.0 (siehe
`CHANGELOG.md`). V8 ist entschieden: Die Anschrift über den Impressumsservice bleibt bewusst
(Gabriel, 01.10.2026), trotz des Hinweises auf das Abmahnrisiko. Jeder Punkt hat eine Nummer, damit `weitermachen.md` und Commits darauf
verweisen können, ohne die Beschreibung zu wiederholen. Erledigtes steht im `CHANGELOG.md`
(V1 und V2 mit Version 0.2.0). V3 (Formular bei All-Inkl) ist seit 29.09.2026 erledigt — reine
Einrichtung im KAS ohne Code, darum ohne CHANGELOG-Eintrag. V4 (Datenschutz) hat Claude auf
Gabriels Wunsch statt einer externen Prüfung selbst überarbeitet (0.5.1); was dabei unsicher
blieb, steht als V8 und V9 unten. V6 ist entschieden: Die Seite bleibt bei GitHub Pages
(Gabriel, 30.09.2026). Der Sessionstart-Hook lädt nur den Abschnitt „Offen“ — neue Befunde
darum als `###` darunter eintragen. Der Ablauf des Umzugs steht in
[docs/umzug-plan.md](docs/umzug-plan.md).

## Offen

### V12 · Google-Unternehmensprofil mit Einsatzgebiet · hoch · S

**Gefahr:** Wer „Trockenbau Freiburg“ sucht, sieht zuerst eine Karte mit drei Betrieben. Ohne
Eintrag dort bleibst du für diese Kunden unsichtbar, egal wie gut die Website ist.

**Bezug:** Offen, ob du schon eins hast. Im Profil lässt sich die Adresse verbergen und
Freiburg als Einsatzgebiet angeben. Aus demselben Grund gehört die Anschrift in Hoyerswerda
nicht in die Firmenangaben im Quelltext von [index.html](index.html).

### V13 · Eine eigene Seite je Leistung · mittel · M

**Gefahr:** Eine Sammelseite mit fünf Leistungen wird für keine davon weit oben gefunden.
Laut dem SEO-Learning (Auswertung der Arbeit von Fedor Brotkorb) ist das der häufigste teure
Fehler.

**Bezug:** Betrifft dich: alle fünf Leistungen stehen auf der Startseite. Empfehlung: erst mit
echten Suchdaten prüfen, welche Leistung gesucht wird (DataForSEO, wenige Euro), dann mit der
stärksten anfangen, vermutlich Trockenbau. Suchbegriff in Titel und Adresse, Überschriften
bleiben Markensätze, unter jeder Zwischenüberschrift sofort eine Antwort in 20 bis 40 Wörtern.
Höchstens ein, zwei Seiten für Nachbarorte, keine Seitenfabrik.

### V14 · Projekte mit Ort und Umfang beschriften · mittel · S

**Gefahr:** „Trockenbau“ unter einem Foto sagt Google nichts. „Dachgeschoss, 40 m²,
Freiburg-Wiehre“ belegt echte Erfahrung vor Ort — das bewertet Google hoch, und kein
Mitbewerber kann es kopieren.

**Bezug:** Betrifft die Projektbahn in [index.html](index.html). Gabriel liefert je Projekt
Ort, Größe und was gemacht wurde.

### V5 · Vorher/Nachher-Paare zeigen unterschiedliche Ausschnitte · niedrig · M

**Gefahr:** Beim Regler „Trockenbau Hallenwand" ist das Vorher-Bild hochkant und das
Nachher-Bild quer aufgenommen. Der Regler schiebt dadurch zwei verschiedene Blickwinkel
übereinander statt derselben Ansicht vorher und nachher — der Aha-Effekt bleibt aus.

**Bezug:** Betrifft nur die Wirkung, nichts funktioniert falsch. Die Originalbilder auf deiner
alten Seite haben schon diese Ausschnitte. Beim nächsten Projekt beide Bilder vom selben
Standpunkt aufnehmen, dann wird der Regler zum stärksten Element der Seite.

## Ideen

### I1 · Ideen für später

- **Dachdecker auch im Startbereich nennen.** Startbereich, Vertrauensleiste und die
  Beschreibung für Suchmaschinen sprechen bisher nur von Zimmereien. Die Dachdecker stehen
  nur im Reiter „Zuarbeit Dach- und Gaubenbau".
- **Kundenstimmen.** Drei Sätze von zufriedenen Auftraggebern wirken bei Handwerksleistungen
  stärker als jede Selbstbeschreibung. Platz dafür wäre zwischen Projekten und Kontakt.
- **Fotos vom Arbeitsprozess.** Das Porträt wirkt stark, weil man ein Gesicht sieht. Zwei, drei
  Bilder von dir bei der Arbeit hätten denselben Effekt für die Projektgalerie.

Aus dieser Liste wurden „Projekte mit Ort und Umfang beschriften“ (jetzt V14) und „Eigene
Seite je Leistung“ (jetzt V13) zu Befunden hochgestuft.

### I2 · Hero-Entwurf 3 „Schicht für Schicht“ weiterverwenden

Gabriel gefällt der Entwurf, ein Einsatzort fehlt noch. Naheliegend: als Erklärbild im Reiter
„Trockenbau“ — die Wand setzt sich beim Scrollen aus Ständerwerk, Dämmung, Beplankung und
Oberfläche zusammen und zeigt so, was Trockenbau ist. Der Entwurf steckt im Commit ef41e2e
(`hero-varianten/variante-3.html` samt CSS und JS); eine startbare Kopie liegt bei Gabriel
lokal im Materialordner der Website.
