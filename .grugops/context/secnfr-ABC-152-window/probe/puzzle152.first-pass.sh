#!/bin/bash
# secnfr-ABC-152-window step 3: the RISK-ABC152-PUZZLE-SPY wall reading (ADR-0042 addendum 2, ruling 8). NOT a gate.
# PUZZLE_DEEP=1 on src/puzzle-suite.test.ts, B and H rotated, ROUNDS rounds (round 0 discarded), GAP 0, unprofiled.
# lane144b.mjs drops the child's stdout, and the reading is the suite's own PRINTED wall, so this script keeps each
# run's console. Per run it logs: the printed PUZZLES / ORACLE walls, /usr/bin/time real and user+sys, the vitest
# summary counts, exit, load1 and thermal level before and after, and the foreign runner count before.
# Usage: bash puzzle152.sh <w152 dir> [ROUNDS]
D="$1"; ROUNDS="${2:-5}"; OUT="$D/abc152-puzzle.tsv"; mkdir -p "$D/puzzle-console"
l1() { sysctl -n vm.loadavg | tr -d '{}' | awk '{print $1}'; }
th() { notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}'; }
fv() { ps -Ao command | grep -c '[v]itest'; }
printf 'round\tcond\texit\twall\tcpu\tprinted_puzzles_wall\tprinted_mate3_wall\tprinted_winmat_wall\tsolved\tfiles_line\ttests_line\tload1_before\tload1_after\tthermal_before\tthermal_after\tforeign_before\tutc\n' > "$OUT"
for ((r = 0; r < ROUNDS; r++)); do
  if (( r % 2 == 0 )); then order="B H"; else order="H B"; fi
  for c in $order; do
    C="$D/puzzle-console/r$r-$c.txt"; lb=$(l1); tb=$(th); f=$(fv); u=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    (cd "$D/arms/$c" && PUZZLE_DEEP=1 /usr/bin/time -p npx vitest run src/puzzle-suite.test.ts > "$C" 2> "$C.time")
    ex=$?; la=$(l1); ta=$(th)
    real=$(awk '/^real/{print $2}' "$C.time"); cpu=$(awk '/^user/{u=$2} /^sys/{s=$2} END{printf "%.2f", u+s}' "$C.time")
    pw=$(sed -n 's/.*PUZZLES.*wall \([0-9.]*\) s.*/\1/p' "$C" | head -1)
    m3=$(sed -n 's/.*ORACLE mate-in-3.*wall \([0-9.]*\) s.*/\1/p' "$C" | head -1)
    wm=$(sed -n 's/.*ORACLE win-material.*wall \([0-9.]*\) s.*/\1/p' "$C" | head -1)
    sv=$(grep -o 'solved [0-9]*/[0-9]*' "$C" | head -1 | tr ' ' '_')
    fl=$(sed 's/\x1b\[[0-9;]*m//g' "$C" | grep -m1 'Test Files' | tr -s ' ' | sed 's/^ //'); tl=$(sed 's/\x1b\[[0-9;]*m//g' "$C" | grep -m1 '^ *Tests ' | tr -s ' ' | sed 's/^ //')
    printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$r" "$c" "$ex" "$real" "$cpu" "$pw" "$m3" "$wm" "$sv" "$fl" "$tl" "$lb" "$la" "$tb" "$ta" "$f" "$u" >> "$OUT"
    echo "$r $c exit $ex wall $real cpu $cpu printed $pw $sv th $tb->$ta"
  done
done
