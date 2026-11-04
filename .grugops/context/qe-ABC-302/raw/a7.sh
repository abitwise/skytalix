#!/bin/bash
# qe-ABC-302 A7 gates, in the worktree (src/ identical to tip a5651cbf), borrowed node_modules symlink, as the PREREG's
# "A1-A5 and A7" section says. Each command as AGENTS.md spells it. Run inside one `flock <scratch>/host-test.lock` hold.
# Usage: a7.sh <worktree> <out dir>
W=$1; O=$2; mkdir -p $O; cd $W || exit 1
echo "lock-acquired $(date -u +%FT%TZ)"
step() { local id=$1; shift; "$@" > $O/$id.txt 2>&1; echo -e "$id\texit $?"; }
step typecheck npm run typecheck
step lint npm run lint
step npm-test npm test
NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null | tee $O/skip.json | jq '.numPendingTests + .numTodoTests' > $O/skip.txt
echo -e "skip-count\t$(cat $O/skip.txt)\t(pipe status ${PIPESTATUS[*]})"
N=$(cat $O/skip.txt)
step skip-integrity node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count "$N"
step inv node tools/grugops/lane-inventory.js
step build npm run build
echo "a7 done $(date -u +%FT%TZ)"
