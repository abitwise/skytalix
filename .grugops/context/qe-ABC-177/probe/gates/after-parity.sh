#!/bin/bash
# qe-ABC-177: sequential, one process tree at a time.
S=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/c759514b-0b67-4176-b897-647bcb7478de/scratchpad
echo "census start $(date -u +%FT%TZ) procs $(ps -u $(id -u) | wc -l) load $(sysctl -n vm.loadavg)"
cd $S/cen && node census.mjs $S/cen/B base && node census.mjs $S/cen/H head && node cens.mjs > census-qe.out 2>&1; echo "census rc=$?"
cd $S/gp
node gp.mjs $S/gp/B base file > gp-base-file.log 2>&1; echo "gp base file rc=$? $(date -u +%FT%TZ)"
node gp.mjs $S/gp/H tip file > gp-tip-file.log 2>&1; echo "gp tip file rc=$? $(date -u +%FT%TZ)"
node gp.mjs $S/gp/H tip lane > gp-tip-lane.log 2>&1; echo "gp tip lane rc=$? $(date -u +%FT%TZ)"
echo "end $(date -u +%FT%TZ) procs $(ps -u $(id -u) | wc -l) load $(sysctl -n vm.loadavg)"
