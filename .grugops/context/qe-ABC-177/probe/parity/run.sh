#!/bin/bash
cd /private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/c759514b-0b67-4176-b897-647bcb7478de/scratchpad/parrun
echo "start $(date -u +%FT%TZ) procs $(ps -u $(id -u) | wc -l) load $(sysctl -n vm.loadavg)"
node mut.mjs /private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/c759514b-0b67-4176-b897-647bcb7478de/scratchpad/par/B qb > qb.log 2>&1; echo "base rc=$? $(date -u +%FT%TZ)"
node mut.mjs /private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/c759514b-0b67-4176-b897-647bcb7478de/scratchpad/par/H qh > qh.log 2>&1; echo "tip rc=$? $(date -u +%FT%TZ)"
node parity.mjs qb qh > parity-qb-vs-qh.out 2>&1
echo "end $(date -u +%FT%TZ) procs $(ps -u $(id -u) | wc -l) load $(sysctl -n vm.loadavg)"
