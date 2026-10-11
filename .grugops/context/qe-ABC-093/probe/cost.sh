#!/bin/bash
# Narrow-set CPU: base = 5332f501's book.test.ts, qe = this hop's. Usage: cost.sh <wt> <sp> <nm>
set -u
WT="$1"; SP="$2"; NM="$3"; C="$SP/cost"
rm -rf "$C"; mkdir -p "$C"
for t in base qe; do
  rsync -a --exclude .git --exclude node_modules --exclude .grugops --exclude plans --exclude memory-bank --exclude .claude "$WT/" "$C/$t/"
  ln -s "$NM" "$C/$t/node_modules"
done
git -C "$WT" show 5332f501:tools/opening-book/book.test.ts > "$C/base/tools/opening-book/book.test.ts"
OUT="$C/runs.tsv"; echo -e "round\tarm\tload1\tcpu\tpassed" > "$OUT"
ARMS=(base qe)
for r in 0 1 2 3 4 5 6 7 8; do
  for i in 0 1; do
    arm=${ARMS[$(( (i + r) % 2 ))]}
    load1=$(sysctl -n vm.loadavg | awk '{print $2}')
    res=$( { cd "$C/$arm" && /usr/bin/time -p npx vitest run tools/opening-book/book.test.ts 2>&1; } 2>&1 )
    user=$(echo "$res" | awk '/^user/{print $2}'); sys=$(echo "$res" | awk '/^sys/{print $2}')
    passed=$(echo "$res" | grep -oE 'Tests +[0-9]+ passed' | grep -oE '[0-9]+')
    echo -e "$r\t$arm\t$load1\t$(echo "$user + $sys" | bc)\t$passed" >> "$OUT"
  done
done
cat "$OUT"
