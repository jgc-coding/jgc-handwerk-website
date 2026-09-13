/* ============================================================
   Konfiguration — die einzige Stelle, an der diese Werte stehen.
   ============================================================ */

window.JGC = {
  /** Version der Seite. Single Source of Truth, erscheint in der Fusszeile.
   *  Beim Aendern: CHANGELOG.md mitziehen (tools/pruefen.mjs bewacht das). */
  version: "0.2.0",

  /** Zieladresse des Kontaktformulars: das PHP-Skript formular/senden.php bei All-Inkl.
   *  null  = nicht angeschlossen; das Formular prueft nur und sagt dem Besucher offen,
   *          dass nichts versendet wird.
   *  Die Datei liegt NICHT auf GitHub Pages - sie muss bei All-Inkl hochgeladen sein.
   *  Wer hier eine andere Adresse eintraegt, passt im selben Zug datenschutz.html an und
   *  gibt die Adresse der Website in senden.php unter ERLAUBTE_HERKUNFT frei. */
  formularEndpunkt: "https://jgc-handwerk.de/formular/senden.php",
};
