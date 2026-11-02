cd "$1"
V5='{"lmr":"log","base":1.0,"div":2.0}'
echo "== G1 door"; node probe.ts g1 '{}'
echo "== G1 V5"; node probe.ts g1 "$V5"
echo "== G1 V3"; node probe.ts g1 '{"lmr":"log","base":0.75,"div":2.25,"pvLess":0,"killerLess":0}'
for v in 'V5k0|{"lmr":"log","base":1.0,"div":2.0,"killerLess":0}' 'V10-100-175|{"lmr":"log","base":1.0,"div":1.75}' 'V5idx2|{"lmr":"log","base":1.0,"div":2.0,"minIndex":2}'; do
  n=${v%%|*}; c=${v#*|}
  echo "== $n"
  node probe.ts nodes "$c" | grep head
  ALL=1 N=47000 node probe.ts reach "$c"
  D=5 PLUS=0 node probe.ts mate "$c"
done
