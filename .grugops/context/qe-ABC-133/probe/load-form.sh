#!/bin/bash
SP=$(cd "$(dirname "$0")" && pwd); R=${REPO:-<repo>}
OUT=$SP/load-form.out.txt; echo "# round load1 form version cpu_ms  node $(node --version) $(date -u +%FT%TZ)" > $OUT
for i in 0 1 2 3 4 5 6 7 8; do for f in cjs esm; do echo "$i $(sysctl -n vm.loadavg | awk '{print $2}') $(node $SP/load-form.mjs $R $f)" >> $OUT; done; done
for f in cjs esm; do echo -n "$f median(r1-8): "; grep " $f " $OUT | awk '$1>0{print $5}' | sort -n | awk '{a[NR]=$1} END{print (a[4]+a[5])/2}'; done >> $OUT
cat $OUT
