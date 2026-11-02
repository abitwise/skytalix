#!/usr/bin/env bash
# qe-ABC-264 G8 + npm test x3 only (b h h b b h), complete base tree. usage: g8.sh <scratch> <worktree> <outDir>
set -uo pipefail
S=$1; W=$2; O=$3; mkdir -p $O/g8
ts() { date -u +%FT%TZ; }
i=0
for t in b h h b b h; do
  i=$((i+1)); dir=$S/base; [ $t = h ] && dir=$W
  anc=" $(a=$$; while [ "$a" -gt 1 ]; do printf '%s ' $a; a=$(ps -o ppid= -p $a | tr -d ' '); done)"
  for p in $(pgrep -f "[/]vitest"); do case "$anc" in *" $p "*) continue;; esac; echo "wait foreign vitest $p $(ts)" >> $O/g8/wait.log; while kill -0 $p 2>/dev/null; do sleep 5; done; done
  while awk '{exit !($1>8)}' /proc/loadavg; do sleep 15; done
  l0=$(cut -d' ' -f1 /proc/loadavg); t0=$(date +%s.%N)
  (cd "$dir" && npm test) > $O/g8/g8-$i-$t.txt 2>&1; rc=$?
  t1=$(date +%s.%N); l1=$(cut -d' ' -f1 /proc/loadavg)
  printf 'run=%s tree=%s rc=%s wall=%.2fs load1=%s/%s %s | %s\n' $i $t $rc "$(echo "$t1 - $t0" | bc)" $l0 $l1 \
    "$(grep -E '^ +Tests ' $O/g8/g8-$i-$t.txt | tr -s ' ' | head -1)" "$(grep -E '^ +Duration' $O/g8/g8-$i-$t.txt | tr -s ' ' | head -1)" | tee -a $O/g8/g8.txt
done
echo "g8 done $(ts)" >> $O/times.txt
