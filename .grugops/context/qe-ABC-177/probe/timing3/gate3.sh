#!/bin/bash
# qe-ABC-177-timing-3 start-gate + cool-down watcher (derivative of ../timing2/wait177.sh; decides only WHEN a stage starts,
# never what a reading is). Usage: gate3.sh <deadline_epoch> <runid>
# Polls every 5 s. A poll is OK when ALL hold (brief qe-ABC-177-timing-3 "Start gate"):
#   G1 no full-suite vitest process: a command line with a `vitest run` token pair and NO test-file token
#      (*.test.* / *.spec.*); short single-file runs and vitest workers are LOGGED, not blocking (b87c35b6);
#   G2 thermalpressurelevel == 0;  G3 pmset reads 'AC Power';  G4 load1 <= 8.
# Launches `go177.sh amd full <runid>` (registered timing2 driver run-amended.sh, unchanged) once every poll has been OK
# for a span >= 60 s. Off-AC or any failed condition resets the span and keeps waiting. Deadline passed -> exit 5 (OWED).
# Runs from a scratchpad copy so no ancestor command line matches the instruments' foreign regex.
# qe-redact-SEC-177-1 (2026-10-21, SEC-177-1): gate-<runid>-cmds.txt holds utc / count / class (vitest) for each poll
# that saw a full-suite vitest, never the command line. Every gate condition and the gate TSV are unchanged.
DL=$1; RUNID=$2
SP=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/c759514b-0b67-4176-b897-647bcb7478de/scratchpad
L=$SP/t177/gate-$RUNID.tsv; C=$SP/t177/gate-$RUNID-cmds.txt
echo "utc	thermal	power	load1	full_suite	vitest_lines	ok	ok_span_s" > $L; : > $C
since=0
while [ $(date +%s) -lt $DL ]; do
  now=$(date +%s); utc=$(date -u +%FT%TZ)
  th=$(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}')
  pw=$(pmset -g batt | grep -o "'[^']*'" | head -1 | tr -d "'")
  l1=$(sysctl -n vm.loadavg | awk '{print $2}')
  ps -axo command= > $SP/t177/.ps
  vl=$(grep -c 'vites[t]' $SP/t177/.ps)
  fs=$(grep 'vites[t] run' $SP/t177/.ps | grep -v -E '\.(test|spec)\.[cm]?[jt]sx?( |$)' | grep -v '/t177/')
  nfs=$(printf '%s' "$fs" | grep -c .)
  [ "$nfs" -gt 0 ] && printf '%s\t%s\t%s\n' "$utc" "$nfs" "vitest" >> $C  # SEC-177-1: count + CLASS only, never the command line
  ok=0
  if [ "$nfs" = 0 ] && [ "$th" = 0 ] && [ "$pw" = "AC Power" ] && awk -v m=$l1 'BEGIN{exit !(m<=8)}'; then ok=1; fi
  if [ $ok = 1 ]; then [ $since = 0 ] && since=$now; span=$((now-since)); else since=0; span=0; fi
  echo "$utc	$th	$pw	$l1	$nfs	$vl	$ok	$span" >> $L
  if [ $ok = 1 ] && [ $span -ge 60 ]; then
    rm -f $SP/t177/.ps; echo "start gate open at $utc (span ${span}s); launching full $RUNID"
    exec bash $SP/go177.sh amd full $RUNID
  fi
  sleep 5
done
rm -f $SP/t177/.ps; echo "NO ADMISSIBLE START before deadline $(date -u -r $DL +%FT%TZ); $RUNID not run; OWED"; exit 5
