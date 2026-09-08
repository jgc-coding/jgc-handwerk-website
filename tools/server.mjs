// Kleiner statischer Server fuer die lokale Vorschau. Kein Zusatzpaket noetig.
// Aufruf: node tools/server.mjs   ->  http://localhost:4173
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = fileURLToPath(new URL('..', import.meta.url));
const PORT = Number(process.env.PORT) || 4173;

const TYPEN = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

createServer(async (req, res) => {
  try {
    let pfad = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (pfad.endsWith('/')) pfad += 'index.html';

    // join haengt einen fuehrenden Trenner korrekt an; normalize loest ".." auf.
    const ziel = normalize(join(WURZEL, pfad));
    if (!ziel.startsWith(WURZEL)) { // Ausbruch aus dem Projektordner verhindern
      res.writeHead(403).end('Verboten');
      return;
    }

    await stat(ziel);
    const daten = await readFile(ziel);
    res.writeHead(200, {
      'Content-Type': TYPEN[extname(ziel).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    }).end(daten);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
       .end('<h1>404</h1><p>Nicht gefunden: ' + req.url + '</p>');
  }
}).listen(PORT, () => console.log('Vorschau laeuft: http://localhost:' + PORT));
