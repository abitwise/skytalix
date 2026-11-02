# Batch 2: A4 (b) reach 47 000 (+ 20 000 report), mate floor d4->d5 (+ same-depth d5 report), zugzwang 7 rows (head
# and door), G1 (head and door), d8 report roots, firing at d6. Run as: flock <host-test.lock> timeout 300 bash batch2.sh <root> <out>.
here="$(cd "$(dirname "$0")" && pwd)"
printf '%s\n' "R0 reach ALL=1 N=47000" "R0 reach ALL=1 N=20000" "R0 mate D=4 PLUS=1" "R0 mate D=5 PLUS=0" \
  "R0 zug" "DOOR zug" "R0 g1" "DOOR g1" "R0 nodes POS=position-4,position-5,startpos" "R0 fire D=6" \
  | xargs -P 10 -L 1 bash "$here/job.sh" "$1" "$2"
