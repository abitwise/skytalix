cd "$1"
R='{"lmr":"log","base":1.0,"div":2.0,"killerLess":0}'
echo "== G1 R"; node probe.ts g1 "$R"
echo "== drift d5"; REC=search node probe.ts drift "$R"; REC=choose node probe.ts drift "$R"
echo "== mate"; D=5 PLUS=0 node probe.ts mate "$R"; D=4 PLUS=1 node probe.ts mate "$R"
echo "== fire d6"; D=6 node probe.ts fire "$R"
echo "== nodes other roots d8"; POS=position-4,position-5,startpos node probe.ts nodes "$R"
echo "== reach roots only"; N=47000 node probe.ts reach "$R"
