/**
 * Erzeugt die Silhouetten der Holzebenen fuer die Hero-Variante 1 ("Schichtholz").
 *
 * Aufruf:   node tools/hero-schichten.mjs
 * Ergebnis: assets/img/hero/v1-ebene-1.svg ... v1-ebene-6.svg
 *
 * Die Dateien dienen als CSS-Masken: schwarz = Holz sichtbar, leer = durchsichtig.
 * Alle Ebenen teilen sich dasselbe Koordinatenfeld (2400 x 1000), damit sie
 * uebereinandergelegt ein Bild ergeben. Der Zufall hat je Ebene einen festen
 * Startwert — jeder Lauf liefert dieselben Dateien.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const WURZEL = fileURLToPath(new URL("..", import.meta.url));
const ZIEL = join(WURZEL, "assets", "img", "hero");
const B = 2400;
const H = 1000;

/* ---------- Werkzeug ------------------------------------------ */

/** Zufallszahlen mit festem Startwert (mulberry32). */
function zufall(start) {
  let a = start >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n) => Math.round(n * 10) / 10;
const punkt = (p) => r1(p[0]) + " " + r1(p[1]);

/** Hoehenlinie eines Huegelkamms: ueberlagerte Wellen, dazu einzelne Berge
 *  (c = Mitte, w = Breite, a = Hoehe). Kleinere y-Werte liegen weiter oben. */
function kamm(basis, wellen, berge = []) {
  return (x) =>
    basis +
    wellen.reduce((s, w) => s + w.a * Math.sin((x / w.l) * Math.PI * 2 + w.p), 0) -
    berge.reduce((s, b) => s + b.a * Math.exp(-Math.pow((x - b.c) / b.w, 2)), 0);
}

/** Gefuellter Huegel unter einer Kammlinie, bis zum unteren Bildrand. */
function huegel(linie) {
  const teile = ["M -60 " + (H + 40)];
  for (let x = -60; x <= B + 60; x += 16) teile.push("L " + r1(x) + " " + r1(linie(x)));
  teile.push("L " + (B + 60) + " " + (H + 40) + " Z");
  return teile.join(" ");
}

/** Eine Tanne als geschlossener Umriss: Stamm, haengende Astetagen, Spitze. */
function tanne(cx, fuss, h, b, r, neigung = 0) {
  const stammB = Math.max(2.4, b * 0.07);
  const stammH = h * 0.1;
  const etagen = Math.max(3, Math.min(9, Math.round(h / 40)));
  const stufe = (h - stammH) / etagen;
  const links = [];
  const rechts = [];

  for (let i = 0; i < etagen; i++) {
    const anteil = i / etagen; // 0 = unterste Etage
    const radius = (b / 2) * Math.pow(1 - anteil, 0.85);
    const y = fuss - stammH - i * stufe;
    const versatz = neigung * anteil;
    // aeussere Astspitze haengt leicht, danach der Einschnitt zur naechsten Etage
    links.push([cx - radius * (0.88 + r() * 0.24) + versatz, y + stufe * 0.2]);
    links.push([cx - radius * 0.44 + versatz, y - stufe * 0.62]);
    rechts.push([cx + radius * (0.88 + r() * 0.24) + versatz, y + stufe * 0.2]);
    rechts.push([cx + radius * 0.44 + versatz, y - stufe * 0.62]);
  }

  const umriss = [
    [cx - stammB, fuss + 6],
    [cx - stammB, fuss - stammH],
    ...links,
    [cx + neigung, fuss - h],
    ...rechts.reverse(),
    [cx + stammB, fuss - stammH],
    [cx + stammB, fuss + 6],
  ];
  return "M " + umriss.map(punkt).join(" L ") + " Z";
}

/** Wald entlang einer Kammlinie. "luecke" laesst Wiesen frei, "sperre" haelt Bereiche baumfrei. */
function wald(linie, r, o) {
  const baeume = [];
  let x = o.von;
  while (x < o.bis) {
    const dichteWelle = Math.sin((x / o.lueckeL) * Math.PI * 2 + o.lueckeP);
    const gesperrt = (o.sperre || []).some(([a, b]) => x > a && x < b);
    if (!gesperrt && dichteWelle > o.luecke) {
      const h = o.hMin + r() * (o.hMax - o.hMin);
      baeume.push(tanne(x, linie(x) + h * 0.04, h, h * (0.36 + r() * 0.1), r, (r() - 0.5) * h * 0.04));
    }
    x += o.abstand * (0.55 + r() * 0.9);
  }
  return baeume;
}

function svg(inhalt) {
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + B + " " + H +
    '" preserveAspectRatio="none">' + inhalt + "</svg>\n"
  );
}

const flaeche = (d) => '<path d="' + d + '"/>';
const linien = (d, staerke) =>
  '<path d="' + d + '" fill="none" stroke="#000" stroke-width="' + staerke +
  '" stroke-linecap="square" stroke-linejoin="miter"/>';

/* ---------- Bauwerke ------------------------------------------ */

/** Freiburger Muenster, stark vereinfacht: Westturm mit Helm, Langhaus, zwei Hahnentuerme. */
function muenster(x, fuss, m) {
  const p = (dx, dy) => r1(x + dx * m) + " " + r1(fuss - dy * m);
  const turm =
    "M " + p(0, -10) + " L " + p(0, 96) + " L " + p(2, 96) + " L " + p(3, 118) + " L " + p(6, 100) +
    " L " + p(6, 132) + " L " + p(9, 132) + " L " + p(23, 226) + " L " + p(23, 240) + " L " + p(24.5, 240) +
    " L " + p(24.5, 226) + " L " + p(38, 132) + " L " + p(41, 132) + " L " + p(41, 100) + " L " + p(44, 118) +
    " L " + p(45, 96) + " L " + p(47, 96) + " L " + p(47, -10) + " Z";
  const schiff =
    "M " + p(47, -10) + " L " + p(47, 50) + " L " + p(54, 76) + " L " + p(150, 76) + " L " + p(158, 58) +
    " L " + p(196, 58) + " L " + p(206, 34) + " L " + p(206, -10) + " Z";
  const hahn = (dx) =>
    "M " + p(dx, 40) + " L " + p(dx, 92) + " L " + p(dx + 5, 116) + " L " + p(dx + 10, 92) + " L " + p(dx + 10, 40) + " Z";
  return [turm, schiff, hahn(148), hahn(170)].map(flaeche).join("");
}

/** Haus im Holzrahmenbau mit offenem Dachstuhl, Gaube, Richtbaum und Leiter. */
function rohbau(x, fuss, r) {
  const breite = 330;
  const wand = 196;
  const first = 172;
  const ueberstand = 30;
  const teile = [];
  const L = (x1, y1, x2, y2) => "M " + r1(x + x1) + " " + r1(fuss - y1) + " L " + r1(x + x2) + " " + r1(fuss - y2);

  // Schwelle, Raehm, Riegel
  const waagrecht = [L(-6, 4, breite + 6, 4), L(-6, wand, breite + 6, wand)];
  const staender = [];
  const felder = 6;
  for (let i = 0; i <= felder; i++) staender.push(L((breite / felder) * i, 4, (breite / felder) * i, wand));
  const feld = breite / felder;
  // Riegel ueberall ausser im Tuerfeld (Feld 3)
  const riegel = [L(0, 104, feld * 2, 104), L(feld * 3, 104, breite, 104), L(feld * 2, 150, feld * 3, 150)];
  // Streben in den Eckfeldern
  const streben = [L(0, 4, feld, 104), L(breite, 4, breite - feld, 104)];

  // Dachstuhl: Sparren, Kehlbalken, Haengesaeule, Kopfbaender
  const mitte = breite / 2;
  const dach = [
    L(-ueberstand, wand - ueberstand * (first / mitte) + 2, mitte, wand + first),
    L(breite + ueberstand, wand - ueberstand * (first / mitte) + 2, mitte, wand + first),
    L(mitte * 0.46, wand + first * 0.46, breite - mitte * 0.46, wand + first * 0.46),
    L(mitte, wand, mitte, wand + first),
    L(mitte, wand + 6, mitte * 0.52, wand + first * 0.5),
    L(mitte, wand + 6, breite - mitte * 0.52, wand + first * 0.5),
  ];

  // Gaube auf der rechten Dachflaeche
  const gx = breite * 0.69;
  const gy = wand + first * 0.24;
  const gaube = [
    L(gx, gy + 4, gx, gy + 62),
    L(gx, gy + 62, gx + 58, gy + 62),
    L(gx - 8, gy + 62, gx + 26, gy + 92),
    L(gx + 26, gy + 92, gx + 60, gy + 62),
  ];

  teile.push(linien([...waagrecht].join(" "), 13));
  teile.push(linien([...staender, ...riegel, ...streben].join(" "), 9));
  teile.push(linien(dach.join(" "), 11));
  teile.push(linien(gaube.join(" "), 8));

  // Richtbaum auf dem First
  teile.push(linien(L(mitte, wand + first, mitte, wand + first + 34), 5));
  teile.push(flaeche(tanne(x + mitte, fuss - wand - first - 26, 74, 40, r)));

  // Leiter an der linken Traufe
  const lx1 = -92;
  const lx2 = -12;
  const holme = [L(lx1, 0, lx2, wand + 6), L(lx1 + 22, 0, lx2 + 22, wand + 6)];
  const sprossen = [];
  for (let i = 1; i < 9; i++) {
    const t = i / 9;
    sprossen.push(L(lx1 + (lx2 - lx1) * t, (wand + 6) * t, lx1 + 22 + (lx2 - lx1) * t, (wand + 6) * t));
  }
  teile.push(linien(holme.join(" "), 6));
  teile.push(linien(sprossen.join(" "), 4.5));

  return teile.join("");
}

/** Fertiges Haus mit Satteldach als volle Flaeche (Nachbargebaeude). */
function haus(x, fuss, breite, wand, first) {
  const d =
    "M " + r1(x) + " " + r1(fuss + 10) + " L " + r1(x) + " " + r1(fuss - wand) + " L " + r1(x - 14) + " " + r1(fuss - wand + 6) +
    " L " + r1(x + breite / 2) + " " + r1(fuss - wand - first) + " L " + r1(x + breite + 14) + " " + r1(fuss - wand + 6) +
    " L " + r1(x + breite) + " " + r1(fuss - wand) + " L " + r1(x + breite) + " " + r1(fuss + 10) + " Z";
  // Schornstein
  const s =
    "M " + r1(x + breite * 0.7) + " " + r1(fuss - wand - first * 0.3) + " L " + r1(x + breite * 0.7) + " " + r1(fuss - wand - first * 0.92) +
    " L " + r1(x + breite * 0.7 + 18) + " " + r1(fuss - wand - first * 0.92) + " L " + r1(x + breite * 0.7 + 18) + " " + r1(fuss - wand - first * 0.3) + " Z";
  return flaeche(d) + flaeche(s);
}

/* ---------- Die sechs Ebenen ---------------------------------- */

const ebenen = [];

// 1 — ferner Kamm mit feinem Waldsaum und dem Muenster
{
  // Zwei Berge mit einem Sattel in der Mitte — dort geht das Logo auf
  const r = zufall(11);
  const linie = kamm(
    648,
    [
      { a: 12, l: 560, p: 2.1 },
      { a: 6, l: 250, p: 4.0 },
    ],
    [
      { c: 470, w: 430, a: 104 },
      { c: 2010, w: 480, a: 128 },
    ]
  );
  const baeume = wald(linie, r, { von: -40, bis: B + 40, abstand: 17, hMin: 20, hMax: 40, luecke: -0.55, lueckeL: 900, lueckeP: 1.2, sperre: [[640, 880]] });
  ebenen.push(svg(flaeche(huegel(linie)) + baeume.map(flaeche).join("") + muenster(670, linie(760) + 4, 0.86)));
}

// 2 — mittlerer Kamm, dichter Tannenwald mit Lichtungen
{
  const r = zufall(23);
  const linie = kamm(704, [
    { a: 64, l: 1250, p: 3.4 },
    { a: 30, l: 560, p: 0.4 },
    { a: 9, l: 240, p: 1.7 },
  ]);
  const baeume = wald(linie, r, { von: -40, bis: B + 40, abstand: 26, hMin: 44, hMax: 86, luecke: -0.2, lueckeL: 760, lueckeP: 0.3 });
  ebenen.push(svg(flaeche(huegel(linie)) + baeume.map(flaeche).join("")));
}

// 3 — Ortsrand: Rohbau mit Dachstuhl, Nachbarhaus, einzelne Tannen
{
  const r = zufall(37);
  const linie = kamm(792, [
    { a: 34, l: 1500, p: 5.2 },
    { a: 14, l: 520, p: 2.6 },
  ]);
  const baeume = wald(linie, r, { von: -40, bis: B + 40, abstand: 58, hMin: 84, hMax: 150, luecke: 0.1, lueckeL: 1150, lueckeP: 4.1, sperre: [[1380, 2010], [380, 700]] });
  const bauX = 1500;
  ebenen.push(
    svg(
      flaeche(huegel(linie)) +
        baeume.map(flaeche).join("") +
        rohbau(bauX, linie(bauX + 165) + 6, r) +
        haus(450, linie(530) + 4, 170, 92, 84)
    )
  );
}

// 4 — naher Huegel mit groesseren Tannengruppen
{
  const r = zufall(51);
  const linie = kamm(872, [
    { a: 40, l: 1350, p: 1.1 },
    { a: 16, l: 470, p: 3.3 },
  ]);
  const baeume = wald(linie, r, { von: -40, bis: B + 40, abstand: 74, hMin: 130, hMax: 230, luecke: 0.25, lueckeL: 980, lueckeP: 2.4, sperre: [[1000, 1420]] });
  ebenen.push(svg(flaeche(huegel(linie)) + baeume.map(flaeche).join("")));
}

// 5 und 6 — Vordergrund: grosse Tannen rahmen das Bild links und rechts.
// Auf zwei Ebenen verteilt, damit sich Nachbarbaeume nicht in derselben
// Maske ueberlappen: dort entstuenden zwischen den Astzacken kleine
// Durchblicke, die wie Splitter aussehen. So steht stattdessen sichtbar
// ein Baum vor dem anderen.
function rahmenEbene(start, boden, staemme) {
  const r = zufall(start);
  const linie = (x) => boden - 64 * Math.pow(Math.abs(x - B / 2) / (B / 2), 2.2);
  const baeume = staemme.map(([x, h]) => tanne(x, linie(x) + 10, h, h * 0.4, r, (r() - 0.5) * 14));
  return svg(flaeche(huegel(linie)) + baeume.map(flaeche).join(""));
}

ebenen.push(rahmenEbene(73, 940, [[120, 620], [410, 430], [B - 160, 660], [B - 445, 450]]));
ebenen.push(rahmenEbene(89, 976, [[-30, 830], [262, 540], [545, 300], [B + 12, 790], [B - 300, 560], [B - 585, 310]]));

await mkdir(ZIEL, { recursive: true });
for (let i = 0; i < ebenen.length; i++) {
  const datei = join(ZIEL, "v1-ebene-" + (i + 1) + ".svg");
  await writeFile(datei, ebenen[i], "utf8");
  console.log("[JGC Website] [INFO] " + datei + " (" + Math.round(ebenen[i].length / 1024) + " KB)");
}
