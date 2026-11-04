# Step C, the bundle C1+M3 (Rule A: C1; Rule B: M3 carried). bash batchC.sh <root> <out>
here="$(cd "$(dirname "$0")" && pwd)"
B=C1+M3
bash "$here/run.sh" "$1" "$2" c-floor floor MAIN $B,M3,C1
bash "$here/run.sh" "$1" "$2" c-krk krk MAIN $B,M3,C1
bash "$here/run.sh" "$1" "$2" c-zug zug MAIN $B
bash "$here/run.sh" "$1" "$2" c-g1 g1 MAIN $B
bash "$here/run.sh" "$1" "$2" c-drift drift MAIN $B
bash "$here/run.sh" "$1" "$2" c-nodes nodes MAIN $B
bash "$here/run.sh" "$1" "$2" c-reach reach MAIN $B
bash "$here/run.sh" "$1" "$2" c-fire fire MAIN $B,M3,C1,MAIN
bash "$here/run.sh" "$1" "$2" c-p4-nodes nodes C1 $B
bash "$here/run.sh" "$1" "$2" c-p4-reach reach C1 $B
bash "$here/run.sh" "$1" "$2" c-p4-drift drift C1 $B
bash "$here/run.sh" "$1" "$2" c-p4-audit audit C1 $B
bash "$here/run.sh" "$1" "$2" c-o2c-nodes nodes M3 $B
bash "$here/run.sh" "$1" "$2" c-o2c-drift drift M3 $B
bash "$here/run.sh" "$1" "$2" c-nps nps MAIN $B,M3,C1
