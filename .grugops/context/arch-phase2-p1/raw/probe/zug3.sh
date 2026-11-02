cd "$1"
R='{"lmr":"log","base":1.0,"div":2.0,"killerLess":0}'
M2='{"lmr":"log","base":1.0,"div":2.0,"killerLess":0,"maxR":2}'
echo "== door"; DS=9,10,11,12 node probe.ts zugd '{}'
echo "== R"; DS=9,10,11,12,13,14 node probe.ts zugd "$R"
echo "== R-max2 nodes/reach/mate/G1"; node probe.ts nodes "$M2" | grep head; ALL=1 N=47000 node probe.ts reach "$M2"; D=5 PLUS=0 node probe.ts mate "$M2"; node probe.ts g1 "$M2"
