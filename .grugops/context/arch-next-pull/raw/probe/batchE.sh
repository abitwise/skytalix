# Batch E: the evaluation-lever probe (PREREG part 2). Skytalix chooseMove at 47 000 / 94 000 / 188 000 nodes (frozen
# clock, PROBE defaults = main) on the 145 positions, then Stockfish 19 depth 16 labels (8 workers, Threads 1 each).
# Run as: flock <host-test.lock> timeout 300 bash batchE.sh <root> <out> <kit>.
root=$1 out=$2 kit=$3
for n in 47000 94000 188000; do (cd "$root" && timeout 280 node evalprobe.ts play "$out/positions.jsonl" $n > "$out/play$n.jsonl" 2> "$out/play$n.err"; echo "play $n exit $?" >> "$out/exits.txt") & done
wait
cd "$kit" && timeout 200 python3 -I sf.py "$out/positions.jsonl" "$out/play47000.jsonl" "$out/play94000.jsonl" "$out/play188000.jsonl" 16 8 > "$out/sf16.jsonl" 2> "$out/sf16.err"; echo "sf exit $?" >> "$out/exits.txt"
