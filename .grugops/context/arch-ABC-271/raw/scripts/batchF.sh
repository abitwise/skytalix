# Batch F (arch-ABC-271): the firing figure at 100 ms, H (graded for the intent) and the singles (reports).
# Run as: flock <host-test.lock> timeout 900 bash batchF.sh <scratch dir> <pgn1,pgn2>
S=$1; out=$S/out; cd "$S/base"
for f in H KD FP UN; do PGNS=$2 timeout 600 node e4aprobe.ts fire $f > "$out/F-$f.out" 2>&1; echo "F-$f exit $?" >> "$out/exits.txt"; done
