# JGC Handwerk — Website

Neue Fassung der Website von [JGC Handwerk](https://jgc-handwerk.de) (Johann Gabriel
Chimento, Freiburg im Breisgau): Trockenbau, Montageservice, Zuarbeit im Dach- und
Gaubenbau, Zuarbeit für Zimmerertätigkeiten und Bodenverlegung.

Inhalte, Logo und Farbwelt stammen von der bestehenden Seite. Neu sind Aufbau und
Bewegungssprache, orientiert an [fora.so](https://fora.so).

## Ansehen

Die Seite braucht keinen Build-Schritt. Für die lokale Vorschau genügt Node:

```bash
node tools/server.mjs
```

Danach im Browser `http://localhost:4173` öffnen.

## Prüfen

```bash
node tools/pruefen.mjs
```

Die Prüfung meldet fehlende Dateien, Verweise auf fremde Server und eine Version, die nicht
mehr zum CHANGELOG passt. Sie läuft auch in GitHub Actions, bevor die Seite veröffentlicht
wird.

Nach Änderungen an Startbereich, Projektbahn oder Skript zusätzlich den Regressionscheck
(rund zwei Minuten, der Vorschau-Server muss laufen):

```bash
node tools/regression.mjs
```

Er spielt Scrollen, Klicks und Tastatur im installierten Chrome durch, misst die Lesbarkeit des
ersten Bildes und prüft die Seite ohne JavaScript und bei ruhiger Darstellung.

## Sichtkontrolle

```bash
node tools/screenshots.mjs screenshots 1440 900
```

Legt Bilder aller Abschnitte ab — steuert dafür das installierte Chrome fern. Der
Vorschau-Server muss laufen. Für die mobile Ansicht `390 844` angeben.

## Kontaktformular

Das Formular schickt Anfragen an `formular/senden.php`. Dieses PHP-Skript läuft **nicht** auf
GitHub Pages, sondern bei All-Inkl unter `https://formular.jgc-handwerk.de/senden.php`, und
leitet jede Anfrage als E-Mail an kontakt@jgc-handwerk.de weiter. Nach jeder Änderung muss die Datei dort neu hochgeladen
werden. Lokal lässt sie sich mit PHP in Docker prüfen:

```bash
node tools/formular-test.mjs
```

Der Test schickt gültige, fehlerhafte und böswillige Einsendungen an das Skript und fängt die
Mails ab, statt sie zu verschicken.

## Aufbau

```
index.html            Startseite (Hero, Leistungen, Über mich, Projekte, Kontakt)
impressum.html        Impressum
datenschutz.html      Datenschutzerklärung
formular/senden.php   Empfänger des Kontaktformulars — läuft bei All-Inkl, nicht auf GitHub
assets/css/style.css  Design-System; alle Farben und Abstände als CSS-Variablen
assets/js/config.js   Version und Formular-Ziel — die einzige Stelle für diese Werte
assets/js/main.js     Verhalten: Bretterwand im Hero, Reiter, Einblendungen, Projektbahn, Formular
assets/fonts/         Raleway und Open Sans, lokal (kein Google-Server)
assets/vendor/gsap/   GSAP 3.12.5 mit ScrollTrigger, lokal
assets/img/           Bilder als WebP
tools/                Vorschau-Server, Prüfung, Regressionscheck, Screenshots, Formular-Test, Schriften holen
```

Die Seite lädt **nichts** von fremden Servern nach. Das ist Absicht und wird von
`tools/pruefen.mjs` überwacht.

## Lizenz

Inhalte, Bilder und Logo gehören Johann Gabriel Chimento. Die Schriften Raleway und Open Sans
stehen unter der SIL Open Font License 1.1, GSAP unter der Standard-Lizenz von GreenSock.
