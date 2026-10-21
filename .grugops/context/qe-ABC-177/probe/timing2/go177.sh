#!/bin/bash
# launcher (keeps the probe path off every ancestor command line). go177.sh presample|reg <stage>|amd <stage> <runid>
export NODE_OPTIONS=--max-old-space-size=400
P=/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.grugops/context/qe-ABC-177/probe
S=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/c759514b-0b67-4176-b897-647bcb7478de/scratchpad/t177
dk() { echo "docker $1 $(date -u +%FT%TZ) procs $(ps -axo %cpu=,command= | grep -ic '[d]ocker') cpu_sum $(ps -axo %cpu=,command= | grep -i '[d]ocker' | awk '{s+=$1} END {printf "%.1f", s}')"; }
dk start
case $1 in
  presample) cd $P && node $P/window.mjs 180 > $S/presample.out; echo "presample rc $?";;
  reg) cd $P/timing && bash run.sh $2;;
  amd) cd $P/timing2 && bash run-amended.sh $2 $3;;
esac
rc=$?; dk end; exit $rc
