#!/bin/sh
# Ersatz fuer sendmail beim lokalen Test von formular/senden.php (siehe tools/formular-test.mjs).
# Verschickt nichts, sondern haengt jede Mail samt Aufrufparametern an post/mails.eml an.
{
  printf '#### sendmail %s\n' "$*"
  cat
  printf '\n#### Ende\n'
} >> /pruef/post/mails.eml
