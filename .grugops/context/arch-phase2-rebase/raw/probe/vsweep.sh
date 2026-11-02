# variant sweep on the main base: d8 nodes (head lines) + d5 drift both recursions
cd "$1"
run() { echo "== $1"; node probe.ts nodes "$2" | grep head; REC=search node probe.ts drift "$2"; REC=choose node probe.ts drift "$2"; }
run uncapped '{"lmr":"log","base":1.0,"div":2.0,"killerLess":0}'
run uncapped-k1 '{"lmr":"log","base":1.0,"div":2.0}'
run textbook '{"lmr":"log","base":0.75,"div":2.25}'
run noadj '{"lmr":"log","base":0.75,"div":2.25,"pvLess":0,"killerLess":0}'
run 100-175 '{"lmr":"log","base":1.0,"div":1.75}'
run flat21 '{"lmr":"log","base":1.0,"div":2.0,"killerLess":0,"maxR":2,"simple":true}'
run floor1 '{"lmr":"log","base":0.75,"div":2.25,"floorOne":true}'
