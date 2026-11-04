# Step A, O2c alone over main. bash batchA.sh <root> <out>
here="$(cd "$(dirname "$0")" && pwd)"
H=C1,C2,C3,C4
bash "$here/run.sh" "$1" "$2" a-nodes nodes MAIN $H
bash "$here/run.sh" "$1" "$2" a-reach reach MAIN $H
bash "$here/run.sh" "$1" "$2" a-drift drift MAIN $H
bash "$here/run.sh" "$1" "$2" a-floor floor MAIN $H
bash "$here/run.sh" "$1" "$2" a-zug zug MAIN $H
bash "$here/run.sh" "$1" "$2" a-g1 g1 MAIN $H
