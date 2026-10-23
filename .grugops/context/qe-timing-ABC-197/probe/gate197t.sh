#!/bin/bash
# qe-timing-ABC-197 start gate: derivative of qe-timing-ABC-178/probe/gate178t.sh (db5d97e2f5f5). One change, nothing else:
#  V1. S is this hop's dir (qe197t); it launches run197t.sh. The header below is gate178t.sh's own, unchanged:
# qe-timing-ABC-178 start gate: derivative of qe-ABC-178/probe/timing/gate178.sh (2aeeabda). Changes, nothing else:
#  G1. S is this hop's dir; it launches run197t.sh.
#  G2. ORDER reverts addendum 1: n8 (B7) first when thermal is 0, else full (B8) if pending. Run ids -aN.
#  G3. Re-run: ONE per stage, only when the stage did not read: n8 = 174a prints VOID or INADMISSIBLE, or powercheck finds a
#      not-AC run; full = 174b prints VOID, NOT APPLICABLE or INADMISSIBLE, or powercheck finds a not-AC run. A re-run stands alone.
# The header below is gate178.sh's own, unchanged:
# qe-ABC-178 start gate (derivative of qe-ABC-177/probe/timing3/gate3.sh; decides only WHEN a stage starts, never a reading).
# Usage: gate178.sh <deadline_epoch>. Stages: n8 (B7) and full (B8). Polls every 5 s. A poll is OK when ALL hold (brief
# qe-ABC-178 "host fit"): H1 no vitest process at all (any command line matching vites[t]: qe-ABC-196, the owner's other
# session, anything); H2 pmset reads 'AC Power'; H3 load1 <= 8. Thermal is logged; it gates ONLY the n8 stage (its readouts
# discard thermal rounds as registered); full runs under 5aaf7cec ("thermal kept and flagged").
# Once every poll has been OK for a span >= 60 s: if n8 is pending and thermal is 0, run n8; else if full is pending, run full;
# else (only n8 pending, thermal != 0) keep waiting. run178.sh exit 4 (window not admitted) does not count as a run.
# A stage whose lane ran gets at most ONE re-run, and only if its grading readout says VOID. No stage starts after the deadline.
# SEC-177-1: the cmds log holds utc / count / class only, never a command line.
DL=$1
S=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe197t
L=$S/gate.tsv; C=$S/gate-cmds.txt
[ -s $L ] || echo "utc	thermal	power	load1	vitest_lines	ok	ok_span_s	note" > $L; touch $C
declare -A runs=([n8]=0 [full]=0) done_=([n8]=0 [full]=0) att=([n8]=0 [full]=0)
since=0
voidof() { case $1 in n8) grep -qE "WINDOW STATE: VOID|STATE at 650 ms CPU: INADMISSIBLE" $S/n8/$2/readout-n8-lane-a.out || ! grep -q "POWER: AC on every run" $S/n8/$2/powercheck.out;; full) grep -qE "WINDOW STATE: VOID|A9 STATE at 10 s wall: (NOT APPLICABLE|INADMISSIBLE)" $S/full/$2/readout-nfr008-full-b.out || ! grep -q "POWER: AC on every run" $S/full/$2/powercheck.out;; esac; }
while [ $(date +%s) -lt $DL ]; do
  [ ${done_[n8]} = 1 ] && [ ${done_[full]} = 1 ] && { echo "all stages done $(date -u +%FT%TZ)"; exit 0; }
  now=$(date +%s); utc=$(date -u +%FT%TZ)
  th=$(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}')
  pw=$(pmset -g batt | grep -o "'[^']*'" | head -1 | tr -d "'")
  l1=$(sysctl -n vm.loadavg | awk '{print $2}')
  vl=$(ps -axo command= | grep -c 'vites[t]')
  [ "$vl" -gt 0 ] && printf '%s\t%s\t%s\n' "$utc" "$vl" "vitest" >> $C
  ok=0; if [ "$vl" = 0 ] && [ "$pw" = "AC Power" ] && awk -v m=$l1 'BEGIN{exit !(m<=8)}'; then ok=1; fi
  if [ $ok = 1 ]; then [ $since = 0 ] && since=$now; span=$((now-since)); else since=0; span=0; fi
  pick=""
  if [ $ok = 1 ] && [ $span -ge 60 ]; then
    if [ ${done_[n8]} = 0 ] && [ "$th" = 0 ]; then pick=n8; elif [ ${done_[full]} = 0 ]; then pick=full; fi  # G2: n8 first at thermal 0
  fi
  echo "$utc	$th	$pw	$l1	$vl	$ok	$span	${pick:+launch $pick}" >> $L
  if [ -n "$pick" ]; then
    att[$pick]=$(( ${att[$pick]} + 1 )); rid="$pick-a${att[$pick]}"
    echo "gate open at $utc (span ${span}s, thermal $th); launching $pick $rid"
    bash $S/run197t.sh $pick $rid; rc=$?
    echo "run178 $pick $rid rc $rc at $(date -u +%FT%TZ)"
    if [ $rc != 4 ] && [ $rc != 2 ]; then
      runs[$pick]=$(( ${runs[$pick]} + 1 ))
      if [ $rc = 0 ] && voidof $pick $rid && [ ${runs[$pick]} -lt 2 ]; then echo "$pick $rid VOID; one re-run allowed"; else done_[$pick]=1; fi
    fi
    since=0
  fi
  sleep 5
done
echo "DEADLINE $(date -u -r $DL +%FT%TZ) passed; n8 done=${done_[n8]} runs=${runs[n8]}; full done=${done_[full]} runs=${runs[full]}"; exit 5
