# Batch C: the evaluation instrument's Stockfish side (information only): sf.py (arch-next-pull's, unchanged), Stockfish
# 19 depth 16, 8 workers at Threads 1, on the 145 with L's and P's moves at 47 000 nodes.
# Run as: flock <host-test.lock> timeout 300 bash batchC.sh <kit dir holding sf.py> <out>
kit=$1 out=$2
cd "$kit" && timeout 280 python3 -I sf.py "$out/../root/positions.jsonl" "$out/play-L.jsonl" "$out/play-P.jsonl" 16 8 > "$out/sf16-LP.jsonl" 2> "$out/sf16-LP.err"; echo "C-sf exit $?" >> "$out/exits.txt"
