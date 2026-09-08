/* ============================================================
   Konfiguration — die einzige Stelle, an der diese Werte stehen.
   ============================================================ */

window.JGC = {
  /** Version der Seite. Single Source of Truth, erscheint in der Fusszeile.
   *  Beim Aendern: CHANGELOG.md mitziehen (tools/pruefen.mjs bewacht das). */
  version: "0.1.0",

  /** Zieladresse des Kontaktformulars.
   *  null  = noch nicht angeschlossen; das Formular prueft die Eingaben,
   *          zeigt aber ehrlich an, dass es nicht versendet.
   *  Sonst = URL des Formulardienstes (z. B. https://formspree.io/f/xxxxxxx).
   *  Wird hier eine URL eingetragen, muss der Dienst zusaetzlich in die
   *  Datenschutzerklaerung aufgenommen werden. */
  formularEndpunkt: null,
};
