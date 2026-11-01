#!/bin/bash
# qe-ABC-260 counts on the merge result (git merge-tree --write-tree ffc6ee6e grugops/ABC-260 = addea2e5) ×3 and on main ffc6ee6e ×1. Run under flock host-test.lock.
set -u
Q=/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/qe-260
O=$Q/raw/merged
for i in 1 2 3; do ( cd $Q/merged && npm test > $O/merged-$i.txt 2>&1; echo "merged run $i rc=$? :: $(grep -E '^\s+Tests\s' $O/merged-$i.txt) :: $(grep -E '^\s+Test Files\s' $O/merged-$i.txt)"; cp .test-results/last-run.json $O/merged-$i.last-run.json 2>/dev/null ); done
( cd $Q/main && npm test > $O/main-1.txt 2>&1; echo "main ffc6ee6e run 1 rc=$? :: $(grep -E '^\s+Tests\s' $O/main-1.txt)" )
