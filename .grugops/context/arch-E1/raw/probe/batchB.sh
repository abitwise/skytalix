# Batch B: play premise checks (mate floor, zugzwang, G1), static shapes, reach and drift reports for L and P; the
# work-proxy counters for BASE (d8 chooseMove, both boards; batch A lacked the reach counter); the evaluation
# instrument's skytalix side (play at 47 000) for BASE (instrument check), L and P.
# Run as: flock <host-test.lock> timeout 300 bash batchB.sh <root> <out>
root=$1 out=$2
cd "$root"
j() { local tag=$1 mode=$2 form=$3; shift 3; ( env "$@" timeout 290 node e1probe.ts $mode $form > "$out/B-$tag.out" 2>&1; echo "B-$tag exit $?" >> "$out/exits.txt" ) & }
j BASE-work nodes BASE REC=choose POS=kiwipete,position-6 DS=8
for f in L P; do
  j $f-mate45 mate $f D=4 PLUS=1
  j $f-mate55 mate $f D=5 PLUS=0
  j $f-zug zug $f
  j $f-g1 g1 $f
  j $f-static static $f
  j $f-reach reach $f N=47000
  j $f-drift drift $f D=5
done
j BASE-reach reach BASE N=47000
for f in BASE L P; do
  ( POSF="$root/positions.jsonl" timeout 290 node e1probe.ts play $f 47000 > "$out/play-$f.jsonl" 2> "$out/play-$f.err"; echo "play-$f exit $?" >> "$out/exits.txt" ) &
done
wait
