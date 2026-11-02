# arch-phase2-rebase: the batches run on the main-base scratch copy (each wrapped in flock <host-test.lock> timeout 300).
# $1 = scratch root (git archive main src package.json + probe.ts of arch-phase2-p1 + patch_main.py applied).
cd "$1"
R='{"lmr":"log","base":1.0,"div":2.0,"killerLess":0,"maxR":2}'   # ADR-0060 decision 1
# m1: node probe.ts nodes "$R"                                      (d8 kiwipete, position-6; door + head)
# m2: ALL=1 N=47000 node probe.ts reach "$R"; ALL=1 N=20000 node probe.ts reach "$R"
# m3: REC=search node probe.ts drift "$R"; REC=choose node probe.ts drift "$R"; D=4 PLUS=1 node probe.ts mate "$R"; D=5 PLUS=0 node probe.ts mate "$R"
# m4: node probe.ts zug "$R"; DS=10,11 node probe.ts zugd "$R"; DS=10,11 node probe.ts zugd '{}'; D=6 node probe.ts fire "$R";
#     POS=position-4,position-5,startpos node probe.ts nodes "$R"; D=6 node probe.ts nodes "$R"
# m5: node probe.ts g1 '{}'; node probe.ts g1 "$R"
# m6: bash vsweep.sh <root>   (needs the `simple` line, see README)
