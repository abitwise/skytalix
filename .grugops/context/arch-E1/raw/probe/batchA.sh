# Batch A: instrument check (BASE d8, both recursions) and the G6 shape (chooseMove nodes to complete each depth) for
# BASE, L, P; search() d8 for L and P as a report. Run as: flock <host-test.lock> timeout 300 bash batchA.sh <root> <out>
root=$1 out=$2
cd "$root"
j() { local tag=$1; shift; ( env "$@" timeout 290 node e1probe.ts nodes $FORM > "$out/A-$tag.out" 2>&1; echo "A-$tag exit $?" >> "$out/exits.txt" ) & }
for f in BASE L P; do
  FORM=$f j "$f-kiwi-choose" REC=choose POS=kiwipete DS=7,8,9
  FORM=$f j "$f-pos6-choose" REC=choose POS=position-6 DS=7,8,9,10
  FORM=$f j "$f-search8" REC=search POS=kiwipete,position-6 DS=8
done
wait
