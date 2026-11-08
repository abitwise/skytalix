# Batch P (arch-ABC-298-probe; ADR-0077 d9 step 3): the count probe. Serial, one process at a time,
# pinned to one core. Each board: main (unpatched), then count (patched), each a fresh process.
# Run as: flock <host-test.lock> taskset -c 0 bash batch.sh <scratch dir>
S=$1; out=$S/out
echo "P start $(date -u +%FT%TZ)" >> "$out/holds.txt"
for b in kiwipete position-6 start; do
  for c in main count; do
    ( cd "$S/$c" && BOARD=$b timeout 1500 node probe.ts > "$out/P-$c-$b.out" 2>&1; echo "P-$c-$b exit $?" >> "$out/exits.txt" )
  done
done
echo "P end $(date -u +%FT%TZ)" >> "$out/holds.txt"
