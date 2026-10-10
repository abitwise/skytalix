#!/bin/bash
# Usage: perm-run.sh <scratch> <variant...>. Runs the frame-path probe test alone in each tree.
S=$1; shift
printf "variant\texit\tload1\tresult\n"
for v in "$@"; do
  t="$S/perm-$v"
  l=$(sysctl -n vm.loadavg | awk '{print $2}')
  out=$(cd "$t" && node node_modules/vitest/vitest.mjs run src/history-pane.nfr.test.ts -t "NOWHERE ON THE FRAME PATH" 2>&1)
  e=$?
  r=$(printf "%s" "$out" | grep -o -E "Tests +[0-9]+ (passed|failed)[^\n]*|ERR_ACCESS_DENIED[^\"]{0,80}|probe child failed \([0-9]+\)" | sort -u | tr '\n' ' ')
  printf "%s\t%s\t%s\t%s\n" "$v" "$e" "$l" "$r"
  printf "%s" "$out" > "$S/perm-$v.log"
done
