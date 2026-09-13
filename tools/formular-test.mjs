/**
 * Prueft das Formular-Skript formular/senden.php lokal - mit PHP in Docker.
 *
 * Aufruf:
 *   node tools/formular-test.mjs           startet PHP, prueft alle Faelle, raeumt auf
 *   node tools/formular-test.mjs --laufen  startet PHP und laesst es laufen (Tests im Browser)
 *
 * Voraussetzung: Docker laeuft und das Image php:8.3-cli ist vorhanden. Eine andere
 * PHP-Version per Umgebungsvariable, z. B. PHP_IMAGE=php:8.5-cli.
 * Verschickt wird nichts: tools/formular-test/fake-sendmail.sh schreibt jede Mail nach
 * tools/formular-test/post/mails.eml.
 */

import { spawnSync } from "node:child_process";
import { mkdir, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const LOG = "[JGC Formular-Test]";
const WURZEL = fileURLToPath(new URL("..", import.meta.url));
const ORDNER = join(WURZEL, "tools", "formular-test");
const POSTFACH = join(ORDNER, "post", "mails.eml");
const PORT = 8099;
const CONTAINER = "jgc-formular-test";
const IMAGE = process.env.PHP_IMAGE || "php:8.3-cli";
const ZIEL = `http://localhost:${PORT}/formular/senden.php`;
const WEBSITE = "http://localhost:4173"; // steht in senden.php unter ERLAUBTE_HERKUNFT
const LAUFEN = process.argv.includes("--laufen");

/** Eine Anfrage, wie ein Mensch sie abschickt. */
const GUELTIG = {
  vorname: "Anna",
  nachname: "Müller-Lüdenscheidt",
  email: "anna.mueller@example.de",
  telefon: "0761 123456",
  anfrage: "Wir planen eine Trennwand im Dachgeschoss, etwa 12 m².\nZeitraum: Oktober.",
  datenschutz: "on",
  webseite: "",
  dauer: "25",
};

const FAELLE = [
  [
    "Vorabfrage des Browsers von der Website wird freigegeben",
    async () => {
      const antwort = await fetch(ZIEL, { method: "OPTIONS", headers: { Origin: WEBSITE } });
      pruefe(antwort.status === 204, `Status 204 erwartet, kam ${antwort.status}`);
      pruefe(antwort.headers.get("access-control-allow-origin") === WEBSITE, "Freigabe fuer die Website fehlt");
    },
  ],
  [
    "Gueltige Anfrage geht als Mail an das Postfach",
    async () => {
      const vorher = (await leseMails()).length;
      const r = await sende(GUELTIG);
      pruefe(r.status === 200 && r.json?.ok === true, `200 und ok erwartet, kam ${r.status} ${r.text}`);
      pruefe(/^[0-9a-f]{6}$/.test(r.json.id || ""), "Kennung fehlt in der Antwort");
      pruefe(r.freigabe === WEBSITE, "Antwort ist nicht fuer die Website freigegeben");

      const mails = await leseMails();
      pruefe(mails.length === vorher + 1, "Es wurde keine Mail erzeugt");
      const m = zerlege(mails[mails.length - 1]);
      pruefe(m.aufruf.includes("-fkontakt@jgc-handwerk.de"), "Absender-Parameter -f fehlt: " + m.aufruf);
      pruefe(m.kopf.to === "kontakt@jgc-handwerk.de", "Empfaenger falsch: " + m.kopf.to);
      pruefe(m.kopf.from === "JGC Handwerk Website <kontakt@jgc-handwerk.de>", "Absender falsch: " + m.kopf.from);
      pruefe(m.kopf["reply-to"] === GUELTIG.email, "Antwortadresse falsch: " + m.kopf["reply-to"]);
      pruefe(
        m.betreff === "Anfrage über jgc-handwerk.de von Anna Müller-Lüdenscheidt",
        "Betreff falsch: " + m.betreff
      );
      pruefe(
        m.text.includes("Trennwand im Dachgeschoss, etwa 12 m².\r\nZeitraum: Oktober."),
        "Anfragetext fehlt oder Umlaute sind kaputt"
      );
      pruefe(m.text.includes("Telefon:  0761 123456"), "Telefonnummer fehlt");
      pruefe(m.text.includes("Kennung " + r.json.id), "Kennung fehlt in der Mail");
    },
  ],
  [
    "Fehlende Pflichtfelder werden je Feld gemeldet",
    () =>
      ohneNeueMail(async () => {
        const r = await sende({ ...GUELTIG, nachname: "", email: "", anfrage: "kurz", datenschutz: undefined });
        pruefe(r.status === 422, `422 erwartet, kam ${r.status} ${r.text}`);
        const felder = Object.keys(r.json?.felder || {}).sort().join(",");
        pruefe(felder === "anfrage,datenschutz,email,nachname", "Falsche Felder gemeldet: " + felder);
      }),
  ],
  [
    "Ungueltige Telefonnummer wird abgelehnt",
    () =>
      ohneNeueMail(async () => {
        const r = await sende({ ...GUELTIG, telefon: "0761-abc" });
        pruefe(r.status === 422 && r.json?.felder?.telefon, `422 mit Feld telefon erwartet, kam ${r.status} ${r.text}`);
      }),
  ],
  [
    "Zu lange Anfrage wird abgelehnt",
    () =>
      ohneNeueMail(async () => {
        const r = await sende({ ...GUELTIG, anfrage: "x".repeat(5001) });
        pruefe(r.status === 422 && r.json?.felder?.anfrage, `422 mit Feld anfrage erwartet, kam ${r.status} ${r.text}`);
      }),
  ],
  [
    "Uebergrosse Einsendung wird abgelehnt",
    () =>
      ohneNeueMail(async () => {
        const r = await sende({ ...GUELTIG, anfrage: "x".repeat(70000) });
        pruefe(r.status === 413, `413 erwartet, kam ${r.status} ${r.text}`);
      }),
  ],
  [
    "Ausgefuelltes Koederfeld wird abgelehnt",
    () =>
      ohneNeueMail(async () => {
        const r = await sende({ ...GUELTIG, webseite: "https://spam.example" });
        pruefe(r.status === 400 && r.json?.grund === "koeder", `400 koeder erwartet, kam ${r.status} ${r.text}`);
      }),
  ],
  [
    "Absenden im Automaten-Tempo wird abgelehnt",
    () =>
      ohneNeueMail(async () => {
        const schnell = await sende({ ...GUELTIG, dauer: "1" });
        pruefe(schnell.status === 429, `429 erwartet, kam ${schnell.status} ${schnell.text}`);
        const ohneZeit = await sende({ ...GUELTIG, dauer: undefined });
        pruefe(ohneZeit.status === 429, `429 ohne Zeitmessung erwartet, kam ${ohneZeit.status}`);
      }),
  ],
  [
    "Aufruf ohne Herkunft (kein Browser) wird abgelehnt",
    () =>
      ohneNeueMail(async () => {
        const r = await sende(GUELTIG, { herkunft: null });
        pruefe(r.status === 403, `403 erwartet, kam ${r.status} ${r.text}`);
        pruefe(r.freigabe === null, "Antwort darf ohne Herkunft nicht freigegeben sein");
      }),
  ],
  [
    "Aufruf von einer fremden Seite wird abgelehnt",
    () =>
      ohneNeueMail(async () => {
        const r = await sende(GUELTIG, { herkunft: "https://fremde-seite.example" });
        pruefe(r.status === 403, `403 erwartet, kam ${r.status} ${r.text}`);
        pruefe(r.freigabe === null, "Fremde Seite darf keine Freigabe bekommen");
      }),
  ],
  [
    "GET-Aufruf wird abgelehnt",
    () =>
      ohneNeueMail(async () => {
        const r = await sende(GUELTIG, { methode: "GET" });
        pruefe(r.status === 405, `405 erwartet, kam ${r.status} ${r.text}`);
      }),
  ],
  [
    "Eingeschleuste Kopfzeile in der E-Mail-Adresse wird abgelehnt",
    () =>
      ohneNeueMail(async () => {
        const r = await sende({ ...GUELTIG, email: "a@example.de\r\nBcc: opfer@example.com" });
        pruefe(r.status === 422 && r.json?.felder?.email, `422 mit Feld email erwartet, kam ${r.status} ${r.text}`);
      }),
  ],
  [
    "Eingeschleuste Kopfzeile im Namen bleibt harmloser Text",
    async () => {
      const r = await sende({ ...GUELTIG, nachname: "Muster\r\nBcc: opfer@example.com" });
      pruefe(r.status === 200, `200 erwartet, kam ${r.status} ${r.text}`);
      const mails = await leseMails();
      const m = zerlege(mails[mails.length - 1]);
      pruefe(!("bcc" in m.kopf), "Eine Bcc-Kopfzeile ist in der Mail gelandet");
      pruefe(m.betreff.endsWith("Muster Bcc: opfer@example.com"), "Name nicht als Text im Betreff: " + m.betreff);
    },
  ],
];

/* ---- Ablauf ------------------------------------------------------------------ */

async function los() {
  await starte();
  console.log(`${LOG} [INFO] PHP laeuft (${IMAGE}) unter ${ZIEL}`);

  if (LAUFEN) {
    console.log(`${LOG} [INFO] Bleibt fuer Tests im Browser an. Mails landen in ${POSTFACH}`);
    console.log(`${LOG} [INFO] Beenden mit Strg+C. Bleibt der Container haengen: docker rm -f ${CONTAINER}`);
    const halten = setInterval(() => {}, 60_000);
    const ende = () => {
      clearInterval(halten);
      docker(["rm", "-f", CONTAINER]);
    };
    process.once("SIGINT", ende);
    process.once("SIGTERM", ende);
    return;
  }

  let rot = 0;
  try {
    for (const [name, lauf] of FAELLE) {
      try {
        await lauf();
        console.log("  ok    " + name);
      } catch (fehler) {
        rot++;
        console.log("  ROT   " + name + "\n        " + fehler.message);
      }
    }
    if (rot) {
      console.log(`\n${LOG} [INFO] Letzte Zeilen aus dem PHP-Log:`);
      console.log(docker(["logs", "--tail", "25", CONTAINER]).stderr);
    }
  } finally {
    docker(["rm", "-f", CONTAINER]);
  }

  if (rot) {
    console.error(`\n${LOG} [ERROR] ${rot} von ${FAELLE.length} Faellen rot (${IMAGE}).`);
    process.exitCode = 1;
  } else {
    console.log(`\n${LOG} [INFO] Alle ${FAELLE.length} Faelle gruen (${IMAGE}).`);
  }
}

async function starte() {
  if (docker(["version", "--format", "{{.Server.Version}}"]).status !== 0) {
    throw new Error("Docker laeuft nicht. Bitte Docker Desktop starten.");
  }
  docker(["rm", "-f", CONTAINER]); // Reste eines abgebrochenen Laufs
  await rm(join(ORDNER, "post"), { recursive: true, force: true });
  await mkdir(join(ORDNER, "post"), { recursive: true });

  const start = docker([
    "run", "-d", "--rm", "--name", CONTAINER, "-p", `${PORT}:${PORT}`,
    "--mount", `type=bind,source=${join(WURZEL, "formular")},target=/app/formular,readonly`,
    "--mount", `type=bind,source=${ORDNER},target=/pruef`,
    IMAGE, "php",
    "-d", "sendmail_path=sh /pruef/fake-sendmail.sh",
    "-d", "log_errors=1",
    "-S", `0.0.0.0:${PORT}`, "-t", "/app",
  ]);
  if (start.status !== 0) throw new Error("PHP-Container startet nicht: " + start.stderr.trim());

  for (let versuch = 0; versuch < 50; versuch++) {
    try {
      const antwort = await fetch(ZIEL, { method: "OPTIONS", headers: { Origin: WEBSITE } });
      if (antwort.status === 204) return;
    } catch {
      /* noch nicht bereit */
    }
    await pause(200);
  }
  throw new Error(`PHP antwortet nicht unter ${ZIEL}.`);
}

/* ---- Hilfen ------------------------------------------------------------------ */

/** Schickt das Formular so ab, wie es der Browser tut. undefined laesst ein Feld weg. */
async function sende(felder, { herkunft = WEBSITE, methode = "POST" } = {}) {
  const kopf = { Accept: "application/json" };
  if (herkunft) kopf.Origin = herkunft;

  let body;
  if (methode === "POST") {
    body = new FormData();
    for (const [name, wert] of Object.entries(felder)) {
      if (wert !== undefined) body.append(name, wert);
    }
  }

  const antwort = await fetch(ZIEL, { method: methode, headers: kopf, body });
  const text = await antwort.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* keine JSON-Antwort */
  }
  return { status: antwort.status, json, text, freigabe: antwort.headers.get("access-control-allow-origin") };
}

async function ohneNeueMail(lauf) {
  const vorher = (await leseMails()).length;
  await lauf();
  const nachher = (await leseMails()).length;
  pruefe(nachher === vorher, "Trotz Ablehnung wurde eine Mail erzeugt");
}

async function leseMails() {
  let roh = "";
  try {
    roh = await readFile(POSTFACH, "utf8");
  } catch {
    return [];
  }
  return roh.split("#### sendmail").slice(1);
}

/** Zerlegt eine mitgeschnittene Mail in Aufruf, Kopfzeilen, Betreff und Text. */
function zerlege(roh) {
  const zeilen = roh.replace(/\r\n/g, "\n").split("\n");
  const aufruf = zeilen.shift();
  const leer = zeilen.indexOf("");

  const kopf = {};
  for (const zeile of zeilen.slice(0, leer)) {
    const i = zeile.indexOf(":");
    if (i > 0) kopf[zeile.slice(0, i).trim().toLowerCase()] = zeile.slice(i + 1).trim();
  }

  const base64 = zeilen
    .slice(leer + 1)
    .filter((z) => z && !z.startsWith("#### Ende"))
    .join("");

  return {
    aufruf,
    kopf,
    betreff: dekodiere(kopf.subject || ""),
    text: Buffer.from(base64, "base64").toString("utf8"),
  };
}

/** Macht aus =?UTF-8?B?...?=-Stuecken wieder lesbaren Text. */
function dekodiere(wert) {
  const teile = wert.match(/=\?UTF-8\?B\?[^?]*\?=/gi);
  if (!teile) return wert;
  return teile.map((t) => Buffer.from(t.slice(10, -2), "base64").toString("utf8")).join("");
}

function docker(args) {
  const ergebnis = spawnSync("docker", args, { encoding: "utf8" });
  if (ergebnis.error) throw new Error("Docker nicht gefunden: " + ergebnis.error.message);
  return ergebnis;
}

function pruefe(bedingung, meldung) {
  if (!bedingung) throw new Error(meldung);
}

function pause(ms) {
  return new Promise((ok) => setTimeout(ok, ms));
}

los().catch((fehler) => {
  console.error(`${LOG} [ERROR] ${fehler.message}`);
  try {
    docker(["rm", "-f", CONTAINER]);
  } catch {
    /* Docker selbst fehlt - nichts aufzuraeumen */
  }
  process.exitCode = 1;
});
