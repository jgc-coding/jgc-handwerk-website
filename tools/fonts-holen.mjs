// Holt die Webfonts einmalig von Google und legt sie lokal ab.
// Grund: Die Seite darf im Betrieb keine Google-Server kontaktieren (DSGVO).
// Aufruf: node tools/fonts-holen.mjs
import { writeFile } from 'node:fs/promises';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const URL_CSS = 'https://fonts.googleapis.com/css2?family=Raleway:wght@200..700&family=Open+Sans:wght@400..700&display=swap';
const ERLAUBT = ['latin', 'latin-ext']; // Deutsch braucht nicht mehr

const css = await fetch(URL_CSS, { headers: { 'User-Agent': UA } }).then(r => r.text());

// Das CSS ist eine Folge aus "/* subset */" + @font-face-Block.
const bloecke = css.split('/*').slice(1).map(b => {
  const subset = b.slice(0, b.indexOf('*/')).trim();
  const rest = b.slice(b.indexOf('*/') + 2);
  return { subset, rest };
});

const regeln = [];
for (const { subset, rest } of bloecke) {
  if (!ERLAUBT.includes(subset)) continue;
  const familie = /font-family:\s*'([^']+)'/.exec(rest)?.[1];
  const gewicht = /font-weight:\s*([^;]+);/.exec(rest)?.[1].trim();
  const bereich = /unicode-range:\s*([^;]+);/.exec(rest)?.[1].trim();
  const url = /url\((https:[^)]+\.woff2)\)/.exec(rest)?.[1];
  if (!familie || !url) throw new Error(`Block "${subset}" unvollstaendig - Google hat das Format geaendert.`);

  const datei = `${familie.toLowerCase().replace(/\s+/g, '-')}-${subset}.woff2`;
  const daten = Buffer.from(await fetch(url, { headers: { 'User-Agent': UA } }).then(r => r.arrayBuffer()));
  await writeFile(new URL(`../assets/fonts/${datei}`, import.meta.url), daten);
  console.log(`  ${datei}  ${(daten.length / 1024).toFixed(0)} KB`);

  regeln.push(`@font-face {
  font-family: '${familie}';
  font-style: normal;
  font-weight: ${gewicht};
  font-display: swap;
  src: url('${datei}') format('woff2');
  unicode-range: ${bereich};
}`);
}

if (regeln.length === 0) throw new Error('Keine passende Schrift gefunden - Abbruch statt stiller Leerdatei.');

const kopf = `/* Lokal eingebundene Schriften - erzeugt von tools/fonts-holen.mjs, nicht von Hand aendern.
   Raleway und Open Sans, SIL Open Font License 1.1.
   Variable Fonts: eine Datei deckt alle Schriftstaerken des angegebenen Bereichs ab. */\n\n`;
await writeFile(new URL('../assets/fonts/fonts.css', import.meta.url), kopf + regeln.join('\n\n') + '\n');
console.log(`\nfonts.css geschrieben, ${regeln.length} Regeln.`);
