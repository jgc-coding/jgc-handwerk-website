/**
 * Screenshots der Seite an festen Stellen — zur Sichtkontrolle nach Aenderungen.
 *
 * Aufruf (der Vorschau-Server muss laufen: node tools/server.mjs):
 *   node tools/screenshots.mjs [zielordner] [breite] [hoehe]
 *
 * Steuert ein vorhandenes Chrome ueber das DevTools-Protokoll. Kein Zusatzpaket,
 * kein Puppeteer — Node bringt WebSocket und fetch selbst mit.
 */

import { spawn } from "node:child_process";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const ZIEL = process.argv[2] || "screenshots";
const BREITE = Number(process.argv[3]) || 1440;
const HOEHE = Number(process.argv[4]) || 900;
const BASIS = process.env.BASIS || "http://localhost:4173";
const PORT = 9333;

const CHROME_PFADE = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

/** Stellen, die abgelichtet werden: [Dateiname, Seite, Sprungziel oder Pixel] */
const STELLEN = [
  ["01-hero", "/", 0],
  ["02-willkommen", "/", "#willkommen"],
  ["03-leistungen", "/", "#leistungen"],
  ["04-ueber-mich", "/", "#ueber-mich"],
  ["05-projekte", "/", "#projekte"],
  ["06-vergleich", "/", ".compare-grid"],
  ["07-kontakt", "/", "#kontakt"],
  ["08-fusszeile", "/", "footer"],
  ["09-impressum", "/impressum.html", 0],
  ["10-datenschutz", "/datenschutz.html", 0],
];

const chromePfad = CHROME_PFADE.find((p) => existsSync(p));
if (!chromePfad) {
  console.error("[JGC Website] [ERROR] Weder Chrome noch Edge gefunden. Gesucht in:\n  " + CHROME_PFADE.join("\n  "));
  process.exit(1);
}

const profil = join(process.env.TEMP || ".", "jgc-shot-profil");
await rm(profil, { recursive: true, force: true });
await mkdir(ZIEL, { recursive: true });

const chrome = spawn(
  chromePfad,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--hide-scrollbars",
    "--remote-debugging-port=" + PORT,
    "--user-data-dir=" + profil,
    "--window-size=" + BREITE + "," + HOEHE,
    "about:blank",
  ],
  { stdio: "ignore" }
);

let ws;
let naechsteId = 0;
const offen = new Map();

try {
  const ziel = await warteAufChrome();
  ws = new WebSocket(ziel);
  await new Promise((ok, fehler) => {
    ws.addEventListener("open", ok, { once: true });
    ws.addEventListener("error", () => fehler(new Error("WebSocket zu Chrome fehlgeschlagen")), { once: true });
  });

  ws.addEventListener("message", (e) => {
    const n = JSON.parse(e.data);
    if (n.id && offen.has(n.id)) {
      const { ok, fehler } = offen.get(n.id);
      offen.delete(n.id);
      n.error ? fehler(new Error(n.error.message)) : ok(n.result);
    }
  });

  await sende("Page.enable");
  await sende("Emulation.setDeviceMetricsOverride", {
    width: BREITE,
    height: HOEHE,
    deviceScaleFactor: 1,
    mobile: BREITE < 768,
  });

  for (const [name, seite, stelle] of STELLEN) {
    await sende("Page.navigate", { url: BASIS + seite });
    await warteAufLadung();

    if (stelle !== 0) {
      await sende("Runtime.evaluate", {
        expression: `(() => {
          const el = document.querySelector(${JSON.stringify(stelle)});
          if (!el) return 'FEHLT: ' + ${JSON.stringify(stelle)};
          const y = el.getBoundingClientRect().top + window.scrollY - 40;
          window.scrollTo({ top: y, behavior: 'instant' });
          return Math.round(window.scrollY);
        })()`,
        returnByValue: true,
      }).then((r) => {
        if (typeof r.result.value === "string") console.warn("  [WARN] " + r.result.value);
      });
      // Einblendungen und Bilder brauchen einen Moment
      await pause(900);
    }

    const bild = await sende("Page.captureScreenshot", { format: "png" });
    const datei = join(ZIEL, name + ".png");
    await writeFile(datei, Buffer.from(bild.data, "base64"));
    console.log("  " + datei);
  }

  console.log("\nFertig: " + STELLEN.length + " Bilder in " + ZIEL + " (" + BREITE + "x" + HOEHE + ")");
} finally {
  if (ws) ws.close();
  chrome.kill();
}

function sende(methode, params) {
  const id = ++naechsteId;
  return new Promise((ok, fehler) => {
    offen.set(id, { ok, fehler });
    ws.send(JSON.stringify({ id, method: methode, params: params || {} }));
    setTimeout(() => {
      if (offen.has(id)) {
        offen.delete(id);
        fehler(new Error("Zeitueberschreitung bei " + methode));
      }
    }, 20000);
  });
}

function warteAufLadung() {
  return new Promise((ok) => {
    const horcher = (e) => {
      if (JSON.parse(e.data).method === "Page.loadEventFired") {
        ws.removeEventListener("message", horcher);
        setTimeout(ok, 700);
      }
    };
    ws.addEventListener("message", horcher);
    setTimeout(() => {
      ws.removeEventListener("message", horcher);
      ok();
    }, 12000);
  });
}

async function warteAufChrome() {
  for (let versuch = 0; versuch < 50; versuch++) {
    try {
      const liste = await fetch("http://127.0.0.1:" + PORT + "/json/list").then((r) => r.json());
      const seite = liste.find((t) => t.type === "page");
      if (seite) return seite.webSocketDebuggerUrl;
    } catch {
      /* noch nicht bereit */
    }
    await pause(200);
  }
  throw new Error("Chrome hat den Fernsteuerungs-Port " + PORT + " nicht geoeffnet.");
}

function pause(ms) {
  return new Promise((ok) => setTimeout(ok, ms));
}
