#!/bin/bash
S=<scratch>
L=$S/host-test.lock; O=$S/qe304
W=<repo>
cd $O || exit 9
: > $O/probe-exits.txt
for p in nfr k0 floor reach drift; do
  flock $L taskset -c 0 node --max-old-space-size=400 $O/probe.mjs $W $p > $O/probe-$p.txt 2>&1
  echo "probe-$p exit $? bytes $(wc -c < $O/probe-$p.txt)" >> $O/probe-exits.txt
done
echo done >> $O/probe-exits.txt
