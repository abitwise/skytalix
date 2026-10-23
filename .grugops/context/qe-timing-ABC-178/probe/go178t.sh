#!/bin/bash
# qe-timing-ABC-178 launcher: starts the host poller beside the start gate, waits for the gate, stops the poller.
S=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe178t
DL=$1
bash $S/hostpoll178t.sh $DL $S/hostpoll.tsv & HP=$!
bash $S/gate178t.sh $DL > $S/gate.log 2>&1; rc=$?
kill $HP 2>/dev/null; wait $HP 2>/dev/null
echo "gate rc $rc at $(date -u +%FT%TZ)" >> $S/gate.log
exit $rc
