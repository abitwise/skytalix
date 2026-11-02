# Batch D (a REPORT added after batch C, not pre-registered; decides nothing): ADR-0061 decision 8's futility drift and
# mate floor re-read on each form's scale, BASE as the control (must read ADR-0061's recorded 100 % / max 10 and 0 / 189).
# Run as: flock <host-test.lock> timeout 300 bash batchD.sh <root> <out>
root=$1 out=$2
cd "$root"
for f in BASE L P; do ( timeout 290 node e1probe.ts fut $f > "$out/D-$f-fut.out" 2>&1; echo "D-$f-fut exit $?" >> "$out/exits.txt" ) & done
wait
