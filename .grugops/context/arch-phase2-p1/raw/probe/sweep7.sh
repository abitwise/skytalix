cd "$1"
R='{"lmr":"log","base":1.0,"div":2.0,"killerLess":0,"maxR":2,"simple":true}'
echo "== simple2 nodes"; node probe.ts nodes "$R" | grep head
echo "== reach"; ALL=1 N=47000 node probe.ts reach "$R"
echo "== zug"; node probe.ts zug "$R" | grep -c '"ok":true'
echo "== G1"; node probe.ts g1 "$R"
echo "== mate"; D=5 PLUS=0 node probe.ts mate "$R"; D=4 PLUS=1 node probe.ts mate "$R"
echo "== drift"; REC=search node probe.ts drift "$R"; REC=choose node probe.ts drift "$R"
