/**
 * Regressionscheck der Startseite — nach jeder Aenderung an Hero, Projektbahn oder main.js.
 *
 * Aufruf (der Vorschau-Server muss laufen: node tools/server.mjs):
 *   node tools/regression.mjs
 *   BASIS=http://localhost:4180 node tools/regression.mjs   (anderer Port)
 *
 * Steuert das installierte Chrome ueber das DevTools-Protokoll, wie tools/screenshots.mjs.
 * Geprueft wird, was man beim Durchklicken leicht uebersieht:
 *   - Bretterwand: Startzustand, Lesbarkeit des ersten Bildes (Kontrast Pixel fuer Pixel),
 *     Klick durch die geschlossene Wand, Tastatur, Loesen der Anheftung, Rueckweg
 *   - Projektbahn: Anheften bei 14 %, Loesen ohne Sprung, letzte Karte ganz im Bild
 *   - Reiter, Formularpruefung, Vorher/Nachher-Regler, Mobilmenue
 *   - ohne JavaScript und bei ruhiger Darstellung
 *   - Konsole: keine Fehler und Warnungen
 * Dauert rund zwei Minuten — darum NICHT in .claude/pruefen.txt (Done-Gate), sondern von Hand.
 */

import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const BASIS = (process.env.BASIS || "http://localhost:4173").replace(/\/$/, "") + "/";
const LOG = "[JGC Website]";

const CHROME_PFADE = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];
const chromePfad = CHROME_PFADE.find((p) => existsSync(p));

/** Mindestkontrast im ersten Bild (WCAG AA fuer normale Schrift). Das Logo wird am
 *  Median gemessen: seine Buchstaben sind gross, einzelne dunkle Maserungsstriche
 *  duerfen darunter liegen. Leitsatz und Hinweis muessen auch an den dunkelsten
 *  5 % ihres Hintergrunds lesbar bleiben. */
const MIN_KONTRAST = 4.5;

const ergebnisse = [];
function pruefe(name, ok, info) {
  ergebnisse.push({ name, ok });
  const text = info === undefined ? "" : "  —  " + (typeof info === "string" ? info : JSON.stringify(info));
  console.log((ok ? "  OK      " : "  FEHLER  ") + name + text);
}

function pause(ms) {
  return new Promise((ok) => setTimeout(ok, ms));
}

const scrolle = (y) => `(() => { window.scrollTo({ top: ${y}, behavior: 'instant' }); return Math.round(scrollY); })()`;

/** Startet ein frisches Chrome, laedt die Seite und uebergibt Helfer an arbeit(). */
async function mitBrowser(breite, hoehe, optionen, arbeit) {
  const port = 9334 + Math.floor(Math.random() * 400);
  const profil = join(process.env.TEMP || ".", "jgc-regression-" + port);
  await rm(profil, { recursive: true, force: true });
  const chrome = spawn(
    chromePfad,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      "--hide-scrollbars",
      "--remote-debugging-port=" + port,
      "--user-data-dir=" + profil,
      "--window-size=" + breite + "," + hoehe,
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  let ws;
  let naechsteId = 0;
  const offen = new Map();
  const konsole = [];

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
      }, 30000);
    });
  }

  try {
    let ziel;
    for (let versuch = 0; versuch < 60 && !ziel; versuch++) {
      try {
        const liste = await fetch("http://127.0.0.1:" + port + "/json/list").then((r) => r.json());
        ziel = liste.find((t) => t.type === "page")?.webSocketDebuggerUrl;
      } catch {
        /* Chrome noch nicht bereit */
      }
      if (!ziel) await pause(200);
    }
    if (!ziel) throw new Error("Chrome hat den Fernsteuerungs-Port " + port + " nicht geoeffnet.");

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
      if (n.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(n.params.type)) {
        konsole.push(n.params.type + ": " + n.params.args.map((a) => a.value ?? a.description ?? "").join(" "));
      }
      if (n.method === "Runtime.exceptionThrown") {
        konsole.push("EXCEPTION: " + (n.params.exceptionDetails.exception?.description || n.params.exceptionDetails.text));
      }
      if (n.method === "Log.entryAdded" && n.params.entry.level === "error") {
        konsole.push("LOG: " + n.params.entry.text + " " + (n.params.entry.url || ""));
      }
    });

    await sende("Page.enable");
    await sende("Runtime.enable");
    await sende("Log.enable");
    await sende("Emulation.setDeviceMetricsOverride", { width: breite, height: hoehe, deviceScaleFactor: 1, mobile: breite < 768 });
    if (optionen.jsAus) await sende("Emulation.setScriptExecutionDisabled", { value: true });
    if (optionen.ruhig) {
      await sende("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
    }
    if (optionen.touch) await sende("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });

    const geladen = new Promise((ok) => {
      const horcher = (e) => {
        if (JSON.parse(e.data).method === "Page.loadEventFired") {
          ws.removeEventListener("message", horcher);
          ok();
        }
      };
      ws.addEventListener("message", horcher);
      setTimeout(ok, 12000);
    });
    await sende("Page.navigate", { url: BASIS });
    await geladen;
    // Der Auftritt der Bretterwand dauert rund 2,9 s
    await pause(optionen.warte ?? 3600);

    async function werte(ausdruck) {
      const r = await sende("Runtime.evaluate", { expression: ausdruck, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
      return r.result.value;
    }
    async function klick(x, y) {
      await sende("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
      await sende("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
      await sende("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });
    }
    async function taste(key, code, keyCode) {
      await sende("Input.dispatchKeyEvent", { type: "keyDown", key, code, windowsVirtualKeyCode: keyCode });
      await sende("Input.dispatchKeyEvent", { type: "keyUp", key, code, windowsVirtualKeyCode: keyCode });
    }

    await arbeit({ werte, klick, taste, sende });
    return konsole;
  } finally {
    if (ws) ws.close();
    chrome.kill();
  }
}

/** Kontrast im ersten Bild: Schrift gegen das, was tatsaechlich dahinter gemalt wird.
 *  Leitsatz und Hinweis werden unsichtbar geschaltet, dann wird fotografiert und jedes
 *  Hintergrundpixel im Textrechteck gegen die Schriftfarbe gerechnet. Beim Logo sind die
 *  Buchstaben die durchsichtigen Stellen des Bildes; gerechnet wird gegen die Scheibe. */
async function messeKontrast(werte, sende) {
  await werte(`(() => {
    window.__kontrast = [".hero__leitsatz span", ".hero__hinweis-wort"].map((sel) => {
      const el = document.querySelector(sel);
      const r = el.getBoundingClientRect();
      return { sel, farbe: getComputedStyle(el).color, rect: { x: r.x, y: r.y, w: r.width, h: r.height } };
    });
    const st = document.createElement("style");
    st.id = "__kontrastStil";
    st.textContent = ".hero__leitsatz span, .hero__hinweis-wort { color: transparent !important; }";
    document.head.appendChild(st);
  })()`);
  await pause(300);
  const bild = await sende("Page.captureScreenshot", { format: "png" });
  return werte(`(async () => {
    document.getElementById("__kontrastStil").remove();
    const bild = new Image();
    bild.src = "data:image/png;base64,${bild.data}";
    await bild.decode();
    const c = document.createElement("canvas");
    c.width = bild.naturalWidth;
    c.height = bild.naturalHeight;
    const g = c.getContext("2d");
    g.drawImage(bild, 0, 0);
    const px = g.getImageData(0, 0, c.width, c.height).data;
    const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const lum = (r, gg, b) => 0.2126 * lin(r) + 0.7152 * lin(gg) + 0.0722 * lin(b);
    const kontrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const stat = (w) => { w.sort((a, b) => a - b); return { n: w.length, p05: +w[Math.floor(w.length * 0.05)].toFixed(2), median: +w[Math.floor(w.length / 2)].toFixed(2) }; };
    const erg = {};
    for (const t of window.__kontrast) {
      const m = t.farbe.match(/[\\d.]+/g).map(Number);
      const lt = lum(m[0], m[1], m[2]);
      const w = [];
      for (let y = Math.max(0, Math.round(t.rect.y)); y < Math.min(c.height, Math.round(t.rect.y + t.rect.h)); y++) {
        for (let x = Math.max(0, Math.round(t.rect.x)); x < Math.min(c.width, Math.round(t.rect.x + t.rect.w)); x++) {
          const i = (y * c.width + x) * 4;
          w.push(kontrast(lt, lum(px[i], px[i + 1], px[i + 2])));
        }
      }
      erg[t.sel] = stat(w);
    }
    const img = document.querySelector(".hero__logo img");
    const r = img.getBoundingClientRect();
    const bw = Math.round(r.width), bh = Math.round(r.height);
    const mc = document.createElement("canvas");
    mc.width = bw;
    mc.height = bh;
    const mg = mc.getContext("2d");
    mg.drawImage(img, 0, 0, bw, bh);
    const a = mg.getImageData(0, 0, bw, bh).data;
    const alpha = (x, y) => (x < 0 || y < 0 || x >= bw || y >= bh ? 255 : a[(y * bw + x) * 4 + 3]);
    const scheibe = [];
    for (let i = 0; i < a.length; i += 4) if (a[i + 3] === 255) scheibe.push(lum(a[i], a[i + 1], a[i + 2]));
    scheibe.sort((p, q) => p - q);
    const ls = scheibe[Math.floor(scheibe.length / 2)];
    const w = [];
    for (let y = 0; y < bh; y++) {
      for (let x = 0; x < bw; x++) {
        if (Math.hypot(x - bw / 2, y - bh / 2) > (bw / 2) * 0.99) continue;
        let leer = true;
        for (let dy = -2; dy <= 2 && leer; dy++) for (let dx = -2; dx <= 2; dx++) if (alpha(x + dx, y + dy) > 0) { leer = false; break; }
        if (!leer) continue;
        const i = (Math.round(r.y + y) * c.width + Math.round(r.x + x)) * 4;
        w.push(kontrast(ls, lum(px[i], px[i + 1], px[i + 2])));
      }
    }
    erg.logo = stat(w);
    return erg;
  })()`);
}

function pruefeKontrast(k, wo) {
  const l = k[".hero__leitsatz span"], h = k[".hero__hinweis-wort"];
  pruefe(wo + ": Leitsatz im ersten Bild lesbar", l.p05 >= MIN_KONTRAST, l);
  pruefe(wo + ": Hinweis 'Scrollen' lesbar", h.p05 >= MIN_KONTRAST, h);
  pruefe(wo + ": Logo-Buchstaben lesbar", k.logo.median >= MIN_KONTRAST && k.logo.n > 20, k.logo);
}

if (!chromePfad) {
  console.error(LOG + " [ERROR] Weder Chrome noch Edge gefunden. Gesucht in:\n  " + CHROME_PFADE.join("\n  "));
  process.exitCode = 1;
} else {
  try {
    /* ---------- Desktop 1440x900 ---------- */
    console.log("\nDesktop 1440x900");
    let konsole = await mitBrowser(1440, 900, {}, async ({ werte, klick, taste, sende }) => {
      const start = await werte(`(() => ({
        bewegt: document.documentElement.classList.contains("bewegt"),
        version: document.getElementById("version")?.textContent,
        trigger: ScrollTrigger.getAll().map((s) => ({ id: s.trigger.id, start: Math.round(s.start), ende: Math.round(s.end) })),
        freigabe: [...document.querySelectorAll(".hero__inhalt [data-freigabe]")].map((e) => getComputedStyle(e).opacity),
        klickbar: getComputedStyle(document.querySelector(".hero__inhalt")).pointerEvents,
      }))()`);
      console.log("  Version in der Fusszeile: " + start.version);
      pruefe("Bretterwand aktiv", start.bewegt === true);
      pruefe("Inhalt hinter der Wand anfangs unsichtbar", start.freigabe.every((o) => o === "0"), start.freigabe);
      pruefe("Inhalt hinter geschlossener Wand nicht klickbar", start.klickbar === "none", start.klickbar);
      pruefe(
        "Anheftungen in Seitenreihenfolge (Hero vor Bahn)",
        start.trigger.length === 2 && start.trigger[0].id === "home" && start.trigger[0].ende <= start.trigger[1].start,
        start.trigger
      );

      pruefeKontrast(await messeKontrast(werte, sende), "Desktop");

      const knopf = await werte(`(() => { const r = document.querySelector(".hero__aktionen .btn").getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`);
      await klick(knopf.x, knopf.y);
      await pause(600);
      const nachKlick = await werte(`({ hash: location.hash, y: Math.round(scrollY) })`);
      pruefe("Klick auf die geschlossene Wand loest keinen Link aus", nachKlick.hash === "" && nachKlick.y === 0, nachKlick);

      let fokus = "";
      for (let i = 0; i < 14 && !fokus.startsWith("hero:"); i++) {
        await taste("Tab", "Tab", 9);
        await pause(120);
        fokus = await werte(`(() => { const a = document.activeElement; return (a.closest(".hero") ? "hero:" : "") + (a.textContent || "").trim().slice(0, 30); })()`);
      }
      await pause(1500);
      const nachTab = await werte(`(() => { const st = ScrollTrigger.getAll()[0]; const a = document.activeElement; const r = a.getBoundingClientRect(); return { fokus: (a.textContent || "").trim().slice(0, 30), progress: +st.progress.toFixed(2), deckkraft: +getComputedStyle(a.closest("[data-freigabe]") || a).opacity, imBild: r.top >= 0 && r.bottom <= innerHeight }; })()`);
      pruefe("Tab in den Hero oeffnet die Wand, Knopf sichtbar", fokus.startsWith("hero:") && nachTab.progress === 1 && nachTab.deckkraft > 0.95 && nachTab.imBild, nachTab);

      // Loesen der Anheftung: die Buehne muss danach genau mit der Seite laufen
      await werte(scrolle(0));
      await pause(900);
      const heroEnde = await werte(`Math.round(ScrollTrigger.getAll()[0].end)`);
      let heroSprung = 0;
      for (let y = heroEnde - 120; y <= heroEnde + 120; y += 20) {
        await werte(scrolle(y));
        await pause(900);
        const oben = await werte(`document.querySelector(".hero__buehne").getBoundingClientRect().top`);
        heroSprung = Math.max(heroSprung, Math.abs(oben - (y <= heroEnde ? 0 : -(y - heroEnde))));
      }
      pruefe("Hero loest die Anheftung ohne Sprung", heroSprung <= 2, "groesste Abweichung " + heroSprung.toFixed(1) + " px");

      const bahn = await werte(`(() => { const st = ScrollTrigger.getAll().find((s) => s.trigger.id === "rail"); return { start: Math.round(st.start), ende: Math.round(st.end) }; })()`);
      await werte(scrolle(bahn.start + 40));
      await pause(1000);
      const bahnOben = await werte(`Math.round(document.getElementById("rail").getBoundingClientRect().top)`);
      pruefe("Projektbahn heftet bei 14 % der Hoehe an", Math.abs(bahnOben - Math.round(900 * 0.14)) <= 2, bahnOben + " px");
      let bahnSprung = 0;
      for (let y = bahn.ende - 120; y <= bahn.ende + 120; y += 20) {
        await werte(scrolle(y));
        await pause(900);
        const oben = await werte(`document.getElementById("rail").getBoundingClientRect().top`);
        bahnSprung = Math.max(bahnSprung, Math.abs(oben - (y <= bahn.ende ? 900 * 0.14 : 900 * 0.14 - (y - bahn.ende))));
      }
      pruefe("Projektbahn loest die Anheftung ohne Sprung", bahnSprung <= 2, "groesste Abweichung " + bahnSprung.toFixed(1) + " px");
      await werte(scrolle(bahn.ende - 5));
      await pause(1200);
      const letzte = await werte(`(() => { const k = [...document.querySelectorAll("#railTrack .shot")].pop().getBoundingClientRect(); return { links: Math.round(k.left), rechts: Math.round(k.right), breite: innerWidth }; })()`);
      pruefe("Letzte Projektkarte am Ende ganz im Bild", letzte.links >= 0 && letzte.rechts <= letzte.breite, letzte);

      await werte(scrolle(0));
      await pause(1500);
      const zu = await werte(`(() => { const m = new DOMMatrix(getComputedStyle(document.querySelector(".hero__brett")).transform); return { x: Math.round(m.m41), offen: document.querySelector(".hero__buehne").classList.contains("ist-offen"), leitsatz: getComputedStyle(document.querySelector(".hero__leitsatz span")).opacity }; })()`);
      pruefe("Zurueck nach oben: Wand wieder geschlossen", Math.abs(zu.x) < 2 && !zu.offen && zu.leitsatz === "1", zu);

      await werte(`document.getElementById("tab-2").click()`);
      await pause(700);
      const reiter = await werte(`({ gewaehlt: document.getElementById("tab-2").getAttribute("aria-selected"), p2: !document.getElementById("panel-2").hidden, p1: !document.getElementById("panel-1").hidden })`);
      pruefe("Reiter wechseln das Panel", reiter.gewaehlt === "true" && reiter.p2 && !reiter.p1, reiter);

      const form = await werte(`(async () => { const f = document.getElementById("kontaktFormular"); f.querySelector("button[type=submit]").click(); await new Promise((r) => setTimeout(r, 400)); const s = document.getElementById("formStatus"); return { meldung: s.hidden ? null : s.textContent.trim().slice(0, 60), ungueltig: f.querySelectorAll("[aria-invalid=true]").length }; })()`);
      pruefe("Formular: leeres Absenden zeigt Fehler und versendet nichts", !!form.meldung && form.ungueltig > 0, form);

      const regler = await werte(`(async () => { const b = document.querySelector("[data-compare]"); const vor = b.getAttribute("aria-valuenow"); b.focus(); b.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true })); await new Promise((r) => setTimeout(r, 200)); return { vor, nach: b.getAttribute("aria-valuenow") }; })()`);
      pruefe("Vorher/Nachher-Regler reagiert auf Pfeiltaste", regler.vor !== regler.nach, regler);
    });
    pruefe("Desktop: keine Konsolenfehler oder -warnungen", konsole.length === 0, konsole);

    /* ---------- Handy 390x844 ---------- */
    console.log("\nHandy 390x844");
    konsole = await mitBrowser(390, 844, { touch: true }, async ({ werte, sende }) => {
      pruefeKontrast(await messeKontrast(werte, sende), "Handy");
      const menue = await werte(`(() => { const t = document.getElementById("navToggle"); t.click(); const r = { offen: document.getElementById("nav").classList.contains("is-open"), label: t.getAttribute("aria-label") }; t.click(); return r; })()`);
      pruefe("Mobilmenue oeffnet", menue.offen && menue.label === "Menü schließen", menue);
      pruefe("Projektbahn am Handy zum Wischen", await werte(`document.getElementById("rail").classList.contains("rail--swipe")`));
      const hero = await werte(`(() => { const st = ScrollTrigger.getAll()[0]; return { bewegt: document.documentElement.classList.contains("bewegt"), strecke: Math.round(st.end - st.start), hoehe: innerHeight }; })()`);
      pruefe("Bretterwand auch am Handy aktiv", hero.bewegt && Math.abs(hero.strecke - hero.hoehe * 1.6) <= 1, hero);
      // Die Adressleiste aendert nur die Hoehe: keine Neuberechnung mitten im Scrollen
      await werte(scrolle(300));
      await pause(1200);
      const vor = await werte(`({ ende: ScrollTrigger.getAll()[0].end, wandH: document.querySelector(".hero__buehne").style.getPropertyValue("--wand-h") })`);
      await werte(`window.dispatchEvent(new Event("resize"))`);
      await pause(700);
      const nach = await werte(`({ ende: ScrollTrigger.getAll()[0].end, wandH: document.querySelector(".hero__buehne").style.getPropertyValue("--wand-h") })`);
      pruefe("Handy: Groessenwechsel ohne neue Breite rechnet nicht neu", vor.ende === nach.ende && vor.wandH === nach.wandH, { vor, nach });

      // Leistungen: am Handy eine Liste, jede Leistung mit Kopf und eigenem Bild
      const leistungen = `(() => {
        const panels = [...document.querySelectorAll(".tabs__panels .panel")];
        const sichtbar = (p) => { const s = getComputedStyle(p); return s.display !== "none" && s.visibility === "visible" && p.getBoundingClientRect().height > 100; };
        return {
          liste: document.querySelector(".tabs").classList.contains("tabs--liste"),
          leiste: getComputedStyle(document.querySelector(".tabs__list")).display,
          sichtbar: panels.filter(sichtbar).length,
          koepfe: panels.filter((p) => p.querySelector(".panel__kopf") && getComputedStyle(p.querySelector(".panel__kopf")).display !== "none").length,
          bilder: panels.filter((p) => p.querySelector("img") && p.querySelector("img").getBoundingClientRect().height > 100).length,
          untereinander: panels.every((p, i) => i === 0 || p.getBoundingClientRect().top >= panels[i - 1].getBoundingClientRect().bottom),
          rollen: panels.filter((p) => p.getAttribute("role") === "tabpanel").length,
          ueberlauf: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      })()`;
      const liste = await werte(leistungen);
      pruefe(
        "Handy: Leistungen als Liste, jede mit Kopf und Bild",
        liste.liste && liste.leiste === "none" && liste.sichtbar === 5 && liste.koepfe === 5 && liste.bilder === 5 && liste.untereinander && liste.rollen === 0,
        liste
      );

      // Dreht jemand das Tablet oder zieht das Fenster breit, kommen die Reiter zurueck
      await sende("Emulation.setDeviceMetricsOverride", { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
      await pause(900);
      const breit = await werte(leistungen);
      pruefe(
        "Breiter Bildschirm danach: wieder Reiter mit einem Bild",
        !breit.liste && breit.leiste !== "none" && breit.sichtbar === 1 && breit.koepfe === 0 && breit.rollen === 5,
        breit
      );
    });
    pruefe("Handy: keine Konsolenfehler oder -warnungen", konsole.length === 0, konsole);

    /* ---------- Ohne JavaScript ---------- */
    console.log("\nOhne JavaScript 1440x900");
    await mitBrowser(1440, 900, { jsAus: true, warte: 1500 }, async ({ werte }) => {
      const r = await werte(`(() => { const w = document.querySelector(".hero__wand").getBoundingClientRect(); const t = document.querySelector(".hero__titel"); return { js: document.documentElement.classList.contains("js"), bewegt: document.documentElement.classList.contains("bewegt"), wandHoehe: Math.round(w.height), titel: getComputedStyle(t).opacity, titelUnterWand: t.getBoundingClientRect().top >= w.bottom - 1 }; })()`);
      pruefe("Ohne JS: Holzband oben, Inhalt sichtbar darunter", !r.js && !r.bewegt && r.titel === "1" && r.titelUnterWand && r.wandHoehe > 200, r);
    });

    /* ---------- Ruhige Darstellung ---------- */
    console.log("\nRuhige Darstellung 1440x900");
    konsole = await mitBrowser(1440, 900, { ruhig: true, warte: 1500 }, async ({ werte }) => {
      const r = await werte(`({ bewegt: document.documentElement.classList.contains("bewegt"), trigger: ScrollTrigger.getAll().length, titel: getComputedStyle(document.querySelector(".hero__titel")).opacity, bahn: document.getElementById("rail").classList.contains("rail--swipe") })`);
      pruefe("Ruhig: keine Bewegung, Inhalt sichtbar, Bahn zum Wischen", !r.bewegt && r.trigger === 0 && r.titel === "1" && r.bahn, r);
    });
    pruefe("Ruhig: keine Konsolenfehler oder -warnungen", konsole.length === 0, konsole);
  } catch (fehler) {
    console.error(LOG + " [ERROR] Regressionscheck abgebrochen: " + fehler.message);
    process.exitCode = 1;
  }

  const rot = ergebnisse.filter((e) => !e.ok);
  if (rot.length || process.exitCode) {
    console.error("\n" + LOG + " [ERROR] Regressionscheck ROT: " + rot.length + " von " + ergebnisse.length + " Pruefungen fehlgeschlagen.");
    process.exitCode = 1;
  } else {
    console.log("\n" + LOG + " [INFO] Regressionscheck gruen: alle " + ergebnisse.length + " Pruefungen bestanden.");
  }
}
