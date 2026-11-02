cd "$1"
R='{"lmr":"log","base":1.0,"div":2.0,"killerLess":0,"maxR":2}'
echo "== zug"; node probe.ts zug "$R"
echo "== zugd"; DS=10,11 node probe.ts zugd "$R"
echo "== drift d5"; REC=search node probe.ts drift "$R"; REC=choose node probe.ts drift "$R"
echo "== mate"; D=4 PLUS=1 node probe.ts mate "$R"
echo "== fire d6"; D=6 node probe.ts fire "$R"
echo "== nodes other roots d8"; POS=position-4,position-5,startpos node probe.ts nodes "$R" | grep head
echo "== d6 nodes"; D=6 node probe.ts nodes "$R"
echo "== reach N=20000"; ALL=1 N=20000 node probe.ts reach "$R"
