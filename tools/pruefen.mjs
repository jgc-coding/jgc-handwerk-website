/**
 * Schnellpruefung der Website. Laeuft in Sekunden, braucht keinen Server.
 * Aufruf: node tools/pruefen.mjs
 *
 * Geprueft wird, was bei einer statischen Seite still scheitern kann:
 *   1. Verweist eine Seite auf eine Datei, die es nicht gibt?
 *   2. Laedt eine Seite etwas von einem fremden Server? (DSGVO)
 *   3. Passt die Version in config.js zum CHANGELOG?
 *   4. Fehlen Grundangaben wie Titel, Sprache oder Beschreibung?
 */

import { readFile, access } from "node:fs/promises";
import { readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const WURZEL = fileURLToPath(new URL("..", import.meta.url));
const fehler = [];
const warnungen = [];

const seiten = readdirSync(WURZEL).filter((d) => d.endsWith(".html"));
if (seiten.length === 0) fehler.push("Keine HTML-Seite im Projektordner gefunden.");

/* ---- 1. + 2. + 4. je Seite ------------------------------------ */

for (const seite of seiten) {
  const html = await readFile(join(WURZEL, seite), "utf8");

  // Grundangaben
  if (!/<html[^>]+lang="de"/.test(html)) fehler.push(`${seite}: <html lang="de"> fehlt.`);
  if (!/<title>[^<]{5,}<\/title>/.test(html)) fehler.push(`${seite}: <title> fehlt oder ist zu kurz.`);
  if (!/<meta\s+name="description"\s+content="[^"]{20,}"/s.test(html))
    warnungen.push(`${seite}: meta description fehlt oder ist sehr kurz.`);

  // Alle Verweise auf Dateien einsammeln
  const verweise = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]);

  for (const v of verweise) {
    // Fremde Server: alles ausser den erlaubten Verweiszielen
    if (/^https?:\/\//i.test(v)) {
      const erlaubt = [
        "https://jgc-handwerk.de", // eigene kanonische Adresse
        "https://schema.org",
        "https://docs.github.com", // Quellenangabe im Datenschutztext
        "https://all-inkl.com", // Quellenangabe im Datenschutztext
      ];
      const istLink = new RegExp(`href="${v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`).test(html);
      if (!erlaubt.some((e) => v.startsWith(e))) {
        // Ein Textlink ist unkritisch, eine nachgeladene Datei (src) nicht.
        (istLink ? warnungen : fehler).push(`${seite}: verweist nach aussen auf ${v}`);
      }
      continue;
    }

    if (v.startsWith("#") || v.startsWith("mailto:") || v.startsWith("tel:") || v.startsWith("data:")) continue;

    const datei = resolve(join(WURZEL, dirname(seite), v.split("?")[0].split("#")[0]));
    try {
      await access(datei);
    } catch {
      fehler.push(`${seite}: verweist auf ${v} — Datei fehlt.`);
    }
  }
}

/* ---- CSS: verweist es auf vorhandene Dateien? ------------------ */

const cssPfad = join(WURZEL, "assets/css/style.css");
try {
  const css = await readFile(cssPfad, "utf8");
  for (const m of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
    const v = m[1];
    if (v.startsWith("data:")) continue;
    if (/^https?:\/\//i.test(v)) {
      fehler.push(`style.css: laedt von einem fremden Server: ${v}`);
      continue;
    }
    try {
      await access(resolve(join(WURZEL, "assets/css", v)));
    } catch {
      fehler.push(`style.css: verweist auf ${v} — Datei fehlt.`);
    }
  }
  for (const m of css.matchAll(/@import\s+url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
    try {
      await access(resolve(join(WURZEL, "assets/css", m[1])));
    } catch {
      fehler.push(`style.css: @import ${m[1]} — Datei fehlt.`);
    }
  }
} catch {
  fehler.push("assets/css/style.css nicht gefunden.");
}

/* ---- 3. Version: config.js gegen CHANGELOG --------------------- */

try {
  const konfig = await readFile(join(WURZEL, "assets/js/config.js"), "utf8");
  const inCode = /version:\s*"([^"]+)"/.exec(konfig)?.[1];
  if (!inCode) {
    fehler.push("config.js: keine Version gefunden.");
  } else {
    const changelog = await readFile(join(WURZEL, "CHANGELOG.md"), "utf8");
    const imLog = /##\s*\[?v?(\d+\.\d+\.\d+)\]?/.exec(changelog)?.[1];
    if (!imLog) fehler.push("CHANGELOG.md: kein Versionseintrag im Format '## 1.2.3' gefunden.");
    else if (imLog !== inCode)
      fehler.push(`Version haengt auseinander: config.js sagt ${inCode}, CHANGELOG.md sagt ${imLog}.`);
  }
} catch (e) {
  fehler.push("Versionspruefung nicht moeglich: " + e.message);
}

/* ---- Ergebnis -------------------------------------------------- */

for (const w of warnungen) console.warn("[JGC Website] [WARN] " + w);

if (fehler.length) {
  for (const f of fehler) console.error("[JGC Website] [ERROR] " + f);
  console.error(`\nPruefung ROT: ${fehler.length} Fehler, ${warnungen.length} Warnungen.`);
  process.exit(1);
}

console.log(
  `[JGC Website] [INFO] Pruefung gruen: ${seiten.length} Seiten, keine fehlenden Dateien, ` +
    `keine fremden Server, Version stimmt.` + (warnungen.length ? ` (${warnungen.length} Warnungen)` : "")
);
