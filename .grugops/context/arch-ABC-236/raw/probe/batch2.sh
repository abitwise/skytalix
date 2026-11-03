# Batch 2: safety gate per form (zugzwang, G1, mate floor d5 / d6, drift d5 / d6 with A2), door zugzwang and G1 checks.
# Run as: flock <host-test.lock> timeout 3000 bash batch2.sh <root> <out>. One job at a time; counts only.
here="$(cd "$(dirname "$0")" && pwd)"
{ echo "DOOR zug"; echo "DOOR g1"
  for f in A25 A50 A100 A50F; do
    printf '%s\n' "$f zug" "$f g1" "$f mate D=5" "$f mate D=6" "$f drift D=5" "$f drift D=6"
  done; } | xargs -P 1 -L 1 bash "$here/job.sh" "$1" "$2"
