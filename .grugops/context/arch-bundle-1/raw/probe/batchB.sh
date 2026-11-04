# Step B, P4 alone over history. bash batchB.sh <root> <out>
here="$(cd "$(dirname "$0")" && pwd)"
H=M1,M2,M3,M4,M5
bash "$here/run.sh" "$1" "$2" b-nodes nodes MAIN $H
bash "$here/run.sh" "$1" "$2" b-reach reach MAIN $H
bash "$here/run.sh" "$1" "$2" b-drift drift MAIN $H
bash "$here/run.sh" "$1" "$2" b-floor floor MAIN $H
bash "$here/run.sh" "$1" "$2" b-zug zug MAIN $H
bash "$here/run.sh" "$1" "$2" b-g1 g1 MAIN $H
bash "$here/run.sh" "$1" "$2" b-audit audit MAIN $H
