# Verbesserungen und offene Befunde

Stand: 24.09.2026. Jeder Punkt hat eine Nummer, damit `weitermachen.md` und Commits darauf
verweisen können, ohne die Beschreibung zu wiederholen. Erledigtes steht im `CHANGELOG.md`
(V1 und V2 mit Version 0.2.0). Der Sessionstart-Hook lädt nur den Abschnitt „Offen“ — neue
Befunde darum als `###` darunter eintragen.

## Offen

### V3 · Formular bei All-Inkl einrichten und live testen · hoch · S

**Gefahr:** Seit Version 0.4.0 ist die Seite mit eingeschaltetem Formular veröffentlicht. Solange
es die Subdomain `formular.jgc-handwerk.de` mit gültigem Zertifikat und dort die Datei
`senden.php` nicht gibt, bekommt jeder Besucher beim Absenden eine Fehlermeldung — die Anfrage
kommt nicht an, und nur wer anruft, erreicht dich. Selbsttest am 24.09.2026: Zertifikat
ungültig, `senden.php` fehlt.

**Bezug:** Betrifft dich jetzt. Das Skript ist lokal in 13 Fällen mit PHP 8.3 und 8.5 geprüft.
Offen sind vier Schritte im KAS, wie bei formular.jgc-lumen.de: die Subdomain mit SSL anlegen,
einen FTP-Nutzer nur für ihren Ordner anlegen, `senden.php` direkt in diesen Ordner laden und
den AVV mit All-Inkl bestätigen. Danach eine Test-Anfrage.

### V4 · Datenschutzerklärung fachlich prüfen lassen · mittel · S

**Gefahr:** Ich habe die Erklärung an die neue Technik angepasst: GitHub für die Seite, All-Inkl
für Formular und E-Mail, keine Cookies, keine Besucherzählung, Schriften vom eigenen Server.
Das beschreibt den tatsächlichen Zustand — ich bin aber kein Anwalt, und ein Fehler in diesem
Text ist teurer als der Text selbst.

**Bezug:** Betrifft dich vor dem Livegang; am 13.09.2026 bestätigt. Sinnvoll erst nach V3, weil
die Abschnitte zu All-Inkl und zum Kontaktformular neu sind. Datei:
[datenschutz.html](datenschutz.html).

### V5 · Vorher/Nachher-Paare zeigen unterschiedliche Ausschnitte · niedrig · M

**Gefahr:** Beim Regler „Trockenbau Hallenwand" ist das Vorher-Bild hochkant und das
Nachher-Bild quer aufgenommen. Der Regler schiebt dadurch zwei verschiedene Blickwinkel
übereinander statt derselben Ansicht vorher und nachher — der Aha-Effekt bleibt aus.

**Bezug:** Betrifft nur die Wirkung, nichts funktioniert falsch. Die Originalbilder auf deiner
alten Seite haben schon diese Ausschnitte. Beim nächsten Projekt beide Bilder vom selben
Standpunkt aufnehmen, dann wird der Regler zum stärksten Element der Seite.

### V6 · Hosting beim Umzug bewusst wählen: GitHub oder All-Inkl · mittel · M

**Gefahr:** Solange die Seite bei GitHub liegt, geht bei jedem Besuch die IP-Adresse an ein
US-Unternehmen. Das ist erlaubt und in der Erklärung genannt, aber angreifbarer als ein
deutscher Hoster.

**Bezug:** Betrifft dich beim Umzug auf jgc-handwerk.de. JGC Lumen liegt bereits bei GitHub,
das Formular auf einer Subdomain bei All-Inkl — dasselbe Muster geht hier ohne Änderung am
Formular. Soll alles in Deutschland liegen, kommt die Seite zu All-Inkl, und Abschnitt 2 der
Datenschutzerklärung wird kürzer.

### V7 · Goldener Schein hinter dem Porträt ragt am Handy über den Rand · niedrig · S

**Gefahr:** Auf 390 Pixel breiten Handys ist die Seite 391 Pixel breit. Das Handy verkleinert
die Ansicht dadurch minimal, und die Seite lässt sich unter Umständen einen Pixel seitwärts
wischen.

**Bezug:** Betrifft nur schmale Handys und besteht schon vor 0.4.0. Ursache ist der Ring
`.about__media::before` in `assets/css/style.css`: er sitzt 6 % rechts über dem Bild, der
Seitenrand fängt am Handy aber nur 20 Pixel ab. Empfehlung: `.about` seitlich abschneiden
(`overflow-x: clip`) oder den Ring nach innen setzen, danach `tools/regression.mjs`.

## Ideen

### I1 · Ideen für später

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

### I2 · Hero-Entwurf 3 „Schicht für Schicht“ weiterverwenden

Gabriel gefällt der Entwurf, ein Einsatzort fehlt noch. Naheliegend: als Erklärbild im Reiter
„Trockenbau“ — die Wand setzt sich beim Scrollen aus Ständerwerk, Dämmung, Beplankung und
Oberfläche zusammen und zeigt so, was Trockenbau ist. Der Entwurf steckt im Commit ef41e2e
(`hero-varianten/variante-3.html` samt CSS und JS); eine startbare Kopie liegt bei Gabriel
lokal im Materialordner der Website.
