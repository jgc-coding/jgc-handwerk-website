<?php
/**
 * JGC Handwerk - Empfaenger des Kontaktformulars
 *
 * Laeuft auf dem Webspace bei All-Inkl, NICHT auf GitHub Pages (dort gibt es kein PHP).
 * Nimmt eine Anfrage aus dem Formular der Website entgegen, prueft sie ein zweites Mal
 * und schickt sie als E-Mail an das eigene Postfach. Gespeichert wird nichts.
 *
 * Ablage bei All-Inkl: Ordner "formular" im Verzeichnis der Domain, erreichbar unter
 * https://jgc-handwerk.de/formular/senden.php (= JGC.formularEndpunkt in assets/js/config.js).
 * Nach jeder Aenderung an dieser Datei muss sie dort neu hochgeladen werden.
 *
 * Wer Empfaenger, Absender oder den Weg der Daten aendert, passt datenschutz.html im
 * selben Zug an.
 *
 * Lokal testen: node tools/formular-test.mjs (braucht Docker). Laeuft ab PHP 7.4.
 */

declare(strict_types=1);

ini_set('display_errors', '0'); // Fehlertexte gehoeren ins Log, nicht in die Antwort

// ---- Einstellungen ------------------------------------------------------------

/** Postfach, in dem die Anfragen landen. */
const EMPFAENGER = 'kontakt@jgc-handwerk.de';

/** Absender der Benachrichtigung. Muss ein echtes Postfach im All-Inkl-Paket sein,
 *  sonst verschickt All-Inkl die Mail nicht. */
const ABSENDER = 'kontakt@jgc-handwerk.de';

/** Adressen der Website, von denen aus abgeschickt werden darf. Zieht die Seite auf
 *  eine andere Adresse um, gehoert diese hier hinein - sonst lehnt das Skript ab. */
const ERLAUBTE_HERKUNFT = [
    'https://jgc-handwerk.de',
    'https://www.jgc-handwerk.de',
    'https://jgc-coding.github.io',
    'http://localhost:4173', // lokale Vorschau (node tools/server.mjs)
];

/** Schneller fuellt kein Mensch das Formular aus. */
const MINDESTDAUER_SEKUNDEN = 3;

/** Groesste angenommene Einsendung in Bytes; die Felder selbst sind enger begrenzt. */
const MAX_BYTES = 64000;

const LOG = '[JGC Formular]';

// ---- Hilfsfunktionen ----------------------------------------------------------

/** Schickt eine JSON-Antwort und beendet das Skript. */
function antworte(int $status, array $inhalt): void
{
    http_response_code($status);
    echo json_encode($inhalt, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Zaehlt Zeichen statt Bytes, damit Umlaute nicht doppelt zaehlen. */
function zeichen(string $text): int
{
    return (int) preg_match_all('/./us', $text);
}

/** Kuerzt einen Text auf hoechstens $max Zeichen. */
function kuerze(string $text, int $max): string
{
    if (zeichen($text) <= $max) {
        return $text;
    }
    $einzeln = (array) preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY);
    return implode('', array_slice($einzeln, 0, $max)) . '…';
}

/**
 * Liest ein Textfeld aus der Einsendung.
 * Entfernt unsichtbare Steuerzeichen. Einzeilige Felder verlieren zusaetzlich jeden
 * Zeilenumbruch - so kann niemand ueber ein Feld weitere Mail-Kopfzeilen einschleusen.
 */
function feld(string $name, bool $mehrzeilig = false): string
{
    $wert = isset($_POST[$name]) && is_string($_POST[$name]) ? $_POST[$name] : '';
    if (preg_match('//u', $wert) !== 1) {
        return ''; // kein gueltiges UTF-8
    }
    $wert = str_replace(["\r\n", "\r"], "\n", $wert);
    if (!$mehrzeilig) {
        $wert = str_replace(["\n", "\t"], ' ', $wert);
    }
    return trim((string) preg_replace('/[^\P{C}\n\t]/u', '', $wert));
}

/** Kodiert Text mit Umlauten fuer eine Mail-Kopfzeile (RFC 2047), in kurzen Stuecken. */
function kopfzeile(string $text): string
{
    if (preg_match('/[^\x20-\x7E]/', $text) !== 1) {
        return $text;
    }
    $teile = [];
    $einzeln = (array) preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY);
    foreach (array_chunk($einzeln, 10) as $stueck) {
        $teile[] = '=?UTF-8?B?' . base64_encode(implode('', $stueck)) . '?=';
    }
    return implode(' ', $teile);
}

// ---- Wer fragt an? --------------------------------------------------------------

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Vary: Origin');

// Browser schicken beim Absenden mit, von welcher Seite das Formular stammt.
$herkunft = isset($_SERVER['HTTP_ORIGIN']) ? (string) $_SERVER['HTTP_ORIGIN'] : '';
$vonDerWebsite = in_array($herkunft, ERLAUBTE_HERKUNFT, true);

if ($vonDerWebsite) {
    // Erst diese Freigabe erlaubt dem Browser, der Seite die Antwort zu zeigen.
    header('Access-Control-Allow-Origin: ' . $herkunft);
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Accept, Content-Type');
    header('Access-Control-Max-Age: 600');
}

$methode = isset($_SERVER['REQUEST_METHOD']) ? (string) $_SERVER['REQUEST_METHOD'] : '';

if ($methode === 'OPTIONS') {
    http_response_code($vonDerWebsite ? 204 : 403);
    exit;
}

if ($methode !== 'POST') {
    header('Allow: POST, OPTIONS');
    antworte(405, ['ok' => false, 'grund' => 'methode']);
}

if (!$vonDerWebsite) {
    antworte(403, ['ok' => false, 'grund' => 'herkunft']);
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > MAX_BYTES) {
    antworte(413, ['ok' => false, 'grund' => 'zu-gross']);
}

// ---- Schutz vor Automaten -------------------------------------------------------

// Koederfeld: fuer Menschen unsichtbar, Automaten fuellen es aus.
if (feld('webseite') !== '') {
    error_log(LOG . ' [WARN] Koederfeld ausgefuellt, Einsendung abgelehnt.');
    antworte(400, ['ok' => false, 'grund' => 'koeder']);
}

// Die Seite misst, wie lange das Ausfuellen gedauert hat.
$dauer = isset($_POST['dauer']) && is_string($_POST['dauer']) && preg_match('/^\d{1,7}$/', $_POST['dauer']) === 1
    ? (int) $_POST['dauer']
    : 0;
if ($dauer < MINDESTDAUER_SEKUNDEN) {
    error_log(LOG . ' [WARN] Einsendung nach ' . $dauer . ' s, abgelehnt.');
    antworte(429, ['ok' => false, 'grund' => 'zu-schnell']);
}

// ---- Eingaben pruefen (dieselben Regeln wie in assets/js/main.js) ----------------

$vorname = feld('vorname');
$nachname = feld('nachname');
$email = feld('email');
$telefon = feld('telefon');
$anfrage = feld('anfrage', true);

$fehler = [];

if (zeichen($vorname) > 100) {
    $fehler['vorname'] = 'Bitte kürzen Sie den Vornamen.';
}

if (zeichen($nachname) < 2) {
    $fehler['nachname'] = 'Bitte tragen Sie Ihren Nachnamen ein.';
} elseif (zeichen($nachname) > 100) {
    $fehler['nachname'] = 'Bitte kürzen Sie den Nachnamen.';
}

if ($email === '') {
    $fehler['email'] = 'Bitte tragen Sie Ihre E-Mail-Adresse ein.';
} elseif (
    strlen($email) > 254
    || filter_var($email, FILTER_VALIDATE_EMAIL) === false
    || preg_match('/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/', $email) !== 1
) {
    $fehler['email'] = 'Diese E-Mail-Adresse sieht nicht vollständig aus.';
}

if ($telefon !== '' && preg_match('/^[\d\s+()\/.\-]{5,40}$/', $telefon) !== 1) {
    $fehler['telefon'] = 'Bitte nur Ziffern und die Zeichen + ( ) / - verwenden.';
}

if (zeichen($anfrage) < 10) {
    $fehler['anfrage'] = 'Bitte beschreiben Sie Ihre Anfrage in ein paar Worten.';
} elseif (zeichen($anfrage) > 5000) {
    $fehler['anfrage'] = 'Bitte fassen Sie Ihre Anfrage kürzer, höchstens 5.000 Zeichen.';
}

if (!isset($_POST['datenschutz'])) {
    $fehler['datenschutz'] = 'Ohne diese Zustimmung kann ich Ihre Anfrage nicht bearbeiten.';
}

if ($fehler) {
    antworte(422, ['ok' => false, 'grund' => 'eingaben', 'felder' => $fehler]);
}

// ---- E-Mail zusammenstellen und versenden ----------------------------------------

date_default_timezone_set('Europe/Berlin');
$kennung = bin2hex(random_bytes(3));

$betreff = 'Anfrage über jgc-handwerk.de von ' . kuerze(trim($vorname . ' ' . $nachname), 60);

$text = implode("\r\n", [
    'Neue Anfrage über das Kontaktformular auf jgc-handwerk.de',
    '',
    'Vorname:  ' . ($vorname !== '' ? $vorname : '-'),
    'Nachname: ' . $nachname,
    'E-Mail:   ' . $email,
    'Telefon:  ' . ($telefon !== '' ? $telefon : '-'),
    '',
    'Anfrage:',
    str_replace("\n", "\r\n", $anfrage),
    '',
    '--',
    'Eingegangen am ' . date('d.m.Y') . ' um ' . date('H:i') . ' Uhr, Kennung ' . $kennung . '.',
    'Zustimmung zur Verarbeitung laut Datenschutzerklärung: erteilt.',
    'Mit „Antworten“ schreiben Sie direkt an die Person, die angefragt hat.',
]);

$kopf = [
    'From' => 'JGC Handwerk Website <' . ABSENDER . '>',
    'Reply-To' => $email,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'Content-Transfer-Encoding' => 'base64',
];

$versendet = mail(EMPFAENGER, kopfzeile($betreff), chunk_split(base64_encode($text)), $kopf, '-f' . ABSENDER);

if (!$versendet) {
    error_log(LOG . ' [ERROR] mail() hat den Versand abgelehnt, Kennung ' . $kennung . '.');
    antworte(500, ['ok' => false, 'grund' => 'versand', 'id' => $kennung]);
}

antworte(200, ['ok' => true, 'id' => $kennung]);
