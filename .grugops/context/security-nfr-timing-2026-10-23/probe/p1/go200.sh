#!/bin/bash
# security-nfr-timing-2026-10-23 launcher: host poller beside the start gate; stops the poller when the gate exits.
S=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/sectime/p1
DL=$1
bash $S/hostpoll200.sh $DL $S/hostpoll.tsv & HP=$!
bash $S/gate200.sh $DL > $S/gate.log 2>&1; rc=$?
kill $HP 2>/dev/null; wait $HP 2>/dev/null
echo "gate rc $rc at $(date -u +%FT%TZ)" >> $S/gate.log
exit $rc
