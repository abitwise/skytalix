#!/bin/bash
# security-nfr-timing-2026-10-23 start gate (ABC-200 N8-LANE). Derivative of qe-timing-ABC-178/probe/gate178t.sh (db5d97e2f5f5),
# one stage only. Decides only WHEN the stage starts, never a reading. Usage: gate200.sh <deadline_epoch>.
# A poll (every 5 s) is OK when ALL hold (the brief's preconditions): no [v]itest process on the host; pmset 'AC Power'; load1 <= 8.
# Thermal is RECORDED on every poll and does not gate ("thermal kept and flagged"). A 60 s span of OK polls opens the gate.
# run200.sh exit 4 (window not admitted) or 3 (not AC) does not count as a run. Re-run: ONE, only when the stage did not read
# (readout200 prints VOID or INADMISSIBLE, or powercheck finds a not-AC run). A re-run stands alone. No start after the deadline.
# SEC-177-1: the cmds log holds utc / count / class only.
DL=$1
S=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/sectime/p1
L=$S/gate.tsv; C=$S/gate-cmds.txt
[ -s $L ] || echo "utc	thermal	power	load1	vitest_lines	ok	ok_span_s	note" > $L; touch $C
runs=0; att=0; since=0
voidof() { grep -qE "WINDOW STATE: VOID|STATE at 650 ms CPU: INADMISSIBLE" $S/n8/$1/readout-n8-lane-200.out || ! grep -q "POWER: AC on every run" $S/n8/$1/powercheck.out; }
while [ $(date +%s) -lt $DL ]; do
  now=$(date +%s); utc=$(date -u +%FT%TZ)
  th=$(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}')
  pw=$(pmset -g batt | grep -o "'[^']*'" | head -1 | tr -d "'")
  l1=$(sysctl -n vm.loadavg | awk '{print $2}')
  vl=$(ps -axo command= | grep -c 'vites[t]')
  [ "$vl" -gt 0 ] && printf '%s\t%s\t%s\n' "$utc" "$vl" "vitest" >> $C
  ok=0; if [ "$vl" = 0 ] && [ "$pw" = "AC Power" ] && awk -v m=$l1 'BEGIN{exit !(m<=8)}'; then ok=1; fi
  if [ $ok = 1 ]; then [ $since = 0 ] && since=$now; span=$((now-since)); else since=0; span=0; fi
  pick=""; [ $ok = 1 ] && [ $span -ge 60 ] && pick=n8
  echo "$utc	$th	$pw	$l1	$vl	$ok	$span	${pick:+launch $pick}" >> $L
  if [ -n "$pick" ]; then
    att=$((att+1)); rid="n8-a$att"
    echo "gate open at $utc (span ${span}s, thermal $th); launching $rid"
    bash $S/run200.sh $rid; rc=$?
    echo "run200 $rid rc $rc at $(date -u +%FT%TZ)"
    if [ $rc != 4 ] && [ $rc != 3 ] && [ $rc != 2 ]; then
      runs=$((runs+1))
      if [ $rc = 0 ] && voidof $rid && [ $runs -lt 2 ]; then echo "$rid did not read; one re-run allowed"; else echo "stage done"; exit 0; fi
    fi
    since=0
  fi
  sleep 5
done
echo "DEADLINE $(date -u -r $DL +%FT%TZ) passed; runs=$runs"; exit 5
