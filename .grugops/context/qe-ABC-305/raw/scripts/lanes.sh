#!/bin/bash
# qe-ABC-305: A4, A6, A7 runs and the 23rd line, one job at a time, each under the host lock. No timed read.
# Usage: lanes.sh <lock> <worktree> <scratch out> <main arm>
LOCK=$1; W=$2; O=$3; M=$4; mkdir -p $O
L() { flock "$LOCK" "$@"; }
stamp() { date -u +%H:%M:%SZ; }
fg() { # foreign vitest seen by ps, not under W or M; command name, cwd project basename only
  ps -eo pid=,pcpu=,comm=,args= | grep -E '[v]itest' | while read -r pid pc comm rest; do
    case "$comm" in node*|npm*|npx*) ;; *) continue;; esac
    cwd=$(readlink /proc/$pid/cwd 2>/dev/null) || continue
    case "$cwd" in "$W"*|"$M"*) continue;; esac
    echo "$pc $(basename "$cwd")"
  done | sort | uniq -c | awk '{printf "%s;", $0}'
}
cnt() { # name json
  if [ -s "$2" ]; then node -e 'const j=require(process.argv[1]);console.log(process.argv[2],"files",j.testResults.length,"total",j.numTotalTests,"passed",j.numPassedTests,"failed",j.numFailedTests,"pending",j.numPendingTests,"todo",j.numTodoTests||0,"success",j.success)' "$2" "$1"; else echo "$1 EMPTY REPORT"; fi
}
run() { n=$1; shift; echo "[$(stamp)] $n start; foreign [$(fg)]"; L "$@" > $O/$n.out 2>&1; e=$?; echo "[$(stamp)] $n exit $e ($(wc -c < $O/$n.out) B)"; }
deep() { # name env-assignments path...  : the page's spelling plus a JSON report
  n=$1; envs=$2; shift 2; echo "[$(stamp)] $n start; foreign [$(fg)]"
  (cd $W && L env $envs NODE_OPTIONS=--max-old-space-size=400 npx vitest run "$@" --reporter=default --reporter=json --outputFile.json=$O/$n.json) > $O/$n.out 2>&1; e=$?
  echo "[$(stamp)] $n exit $e ($(wc -c < $O/$n.out) B)"; cnt $n $O/$n.json
}
echo "start $(date -u +%FT%TZ) head $(git -C $W rev-parse --short=8 HEAD) main-arm $(cat $M/.arm-sha)"
# A4
cd $M; run npm-main npm test; cp $M/.test-results/last-run.json $O/main-last-run.json; cnt main $O/main-last-run.json
cd $W; rm -rf .test-results dist; run npm-tip npm test; cp $W/.test-results/last-run.json $O/tip-last-run.json; cnt tip $O/tip-last-run.json
cd $W; L bash -c "NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'" > $O/skip-tip.out; echo "skip tip [$(cat $O/skip-tip.out)]"
cd $M; L bash -c "NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'" > $O/skip-main.out; echo "skip main [$(cat $O/skip-main.out)]"
cd $W; L node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count "$(cat $O/skip-tip.out)" > $O/integrity.out 2>&1; echo "integrity exit $?: $(cat $O/integrity.out)"
run lint npm run lint
run typecheck npm run typecheck
run build npm run build
echo "dist files: $(find dist -type f | wc -l); path naming tools: $(find dist -path '*tools*' | wc -l); tune: $(find dist -name '*tune*' -o -name 'bounds*' -o -name 'tracer*' | wc -l)"
# A6 and the arriving lanes
deep tune TUNE_DEEP=1 tools/tune
deep passer SEARCH_DEEP=1 src/evaluate.passer.test.ts
deep book ENGINE_DEEP=1 src/book.test.ts
deep qehop ENGINE_DEEP=1 tools/grugops/qe-hop-integrity.test.ts
deep cli-flag ENGINE_DEEP=1 src/cli.test.ts
deep cli-noflag X_NOFLAG=1 src/cli.test.ts
deep clireal CLI_DEEP=1 src/cli.real-engine.test.ts
deep king ENGINE_DEEP=1 src/evaluate.king-mobility.test.ts
# the 23rd line, spelled as ADR-0046 spells it
echo "[$(stamp)] line23 start; foreign [$(fg)]"
(cd $W && L env ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/grugops/qe-hop-integrity.test.ts -t "AR-154-TWO-POINT-CONTROL F1 — the whole-tree read drops no note \[deep, ENGINE_DEEP=1\]") > $O/line23.out 2>&1; echo "[$(stamp)] line23 exit $? ($(wc -c < $O/line23.out) B)"
deep line23-json ENGINE_DEEP=1 tools/grugops/qe-hop-integrity.test.ts -t "AR-154-TWO-POINT-CONTROL F1 — the whole-tree read drops no note \[deep, ENGINE_DEEP=1\]"
# the same line with the flag off: the count must not be the flag-on count
(cd $W && L env NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/grugops/qe-hop-integrity.test.ts -t "AR-154-TWO-POINT-CONTROL F1 — the whole-tree read drops no note \[deep, ENGINE_DEEP=1\]") > $O/line23-noflag.out 2>&1; echo "line23-noflag exit $? ($(wc -c < $O/line23-noflag.out) B)"
deep uci ENGINE_DEEP=1 src/uci-session.test.ts
echo "end $(date -u +%FT%TZ); foreign [$(fg)]"
