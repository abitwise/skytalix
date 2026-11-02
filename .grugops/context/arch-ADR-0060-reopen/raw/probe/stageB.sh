# Stage B (pre-registered): reach at 47 000 nodes (A4 b), mate floor door d4 vs head d5, zugzwang 7 rows, G1; plus
# reports (reach at 20 000, d8 on position-4/position-5/startpos, firing at d6). For the forms that meet every
# stage-A bar or miss only the 27 cp cap: C4 C5 C6 C7 C8. $1 = scratch root, $2 = out dir.
# Run as: flock <host-test.lock> timeout 300 bash stageB.sh <root> <out>. Deterministic counts only.
here="$(cd "$(dirname "$0")" && pwd)"
for id in C4 C5 C6 C7 C8; do
  echo "$id reach ALL=1 N=47000"; echo "$id reach ALL=1 N=20000"; echo "$id mate D=4 PLUS=1"
  echo "$id zug"; echo "$id g1"; echo "$id nodes POS=position-4,position-5,startpos"; echo "$id fire D=6"
done | xargs -P 12 -L 1 bash "$here/job.sh" "$1" "$2"
