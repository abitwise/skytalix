cd "$1"
run() { echo "== $1"; REC=search node probe.ts drift "$2"; REC=choose node probe.ts drift "$2"; }
run V1 '{"lmr":"log","base":0.75,"div":2.25}'
run V3-noadj '{"lmr":"log","base":0.75,"div":2.25,"pvLess":0,"killerLess":0}'
run V4-floor1 '{"lmr":"log","base":0.75,"div":2.25,"floorOne":true}'
run V5-100-200 '{"lmr":"log","base":1.0,"div":2.0}'
