# Batch F (arch-ABC-291-probe): PR10's untimed reports. Run as: flock <host-test.lock> timeout 900 bash batchF.sh <scratch dir>
S=$1; out=$S/out
echo "F start $(date -u +%FT%TZ)" >> "$out/holds.txt"
cd "$S/cand"
for f in OFF ON; do N=47000 timeout 300 node e4bprobe.ts reach $f > "$out/F-PR10-reach-$f.out" 2>&1; echo "F-reach-$f exit $?" >> "$out/exits.txt"; done
D=5 timeout 300 node e4bprobe.ts drift ON > "$out/F-PR10-drift.out" 2>&1; echo "F-drift exit $?" >> "$out/exits.txt"
cd "$S/count"; D=8 timeout 300 node hits.ts > "$out/F-PR10-hits.out" 2>&1; echo "F-hits exit $?" >> "$out/exits.txt"
echo "F end $(date -u +%FT%TZ)" >> "$out/holds.txt"
