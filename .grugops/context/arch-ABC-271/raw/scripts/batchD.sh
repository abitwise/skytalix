# Batch D (arch-ABC-271, addendum): E3's failure classes on H. Run as: flock <host-test.lock> timeout 900 bash batchD.sh <scratch dir>
S=$1; out=$S/out; cd "$S/base"
timeout 600 node e4aprobe.ts rel2 H > "$out/D-H-rel2.out" 2>&1; echo "D-H-rel2 exit $?" >> "$out/exits.txt"
