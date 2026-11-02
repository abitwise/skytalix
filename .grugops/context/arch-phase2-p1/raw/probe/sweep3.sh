cd "$1"
for v in 'V1|{"lmr":"log","base":0.75,"div":2.25}' 'V3|{"lmr":"log","base":0.75,"div":2.25,"pvLess":0,"killerLess":0}' 'V5|{"lmr":"log","base":1.0,"div":2.0}'; do
  n=${v%%|*}; c=${v#*|}
  echo "== $n"
  D=5 PLUS=0 node probe.ts mate "$c"
  D=4 PLUS=1 node probe.ts mate "$c"
  ALL=1 N=47000 node probe.ts reach "$c"
  D=6 node probe.ts fire "$c"
done
