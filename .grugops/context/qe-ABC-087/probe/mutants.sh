#!/bin/bash
# QE mutant runner for ABC-087 (qe-ABC-087). Usage: mutants.sh <scratch> <mutant-id>...
# For each mutant: copy the pristine `git archive` tree, plant, then run (1) the page's DEFAULT
# lane (src/levels.test.ts, ENGINE_DEEP unset), (2) QE's harness, (3) the DEEP lane minus A5
# (A5 runs rate 0 on the real clock and no blunder-path mutant reaches it; M3a is run with A5).
# load1 is logged beside every timing. Output: <scratch>/mut/<id>.out
set -u
S="$1"; shift  # <scratch> holds head/ (git archive of the tip, node_modules linked) and harness/ (this probe dir)
H="$S/harness"
mkdir -p "$S/mut"
for id in "$@"; do
  C="$S/mut/$id"
  rm -rf "$C"; cp -R "$S/head" "$C"
  cp "$H/levels.qe.test.ts.txt" "$C/src/levels.qe.test.ts"
  O="$S/mut/$id.out"
  {
    node "$H/mutate.cjs" "$C" "$id" || { echo "PLANT FAILED"; continue; }
    (cd "$C" && git diff --no-index --stat "$S/head/src/levels.ts" src/levels.ts)
    for lane in default qe deep; do
      case $lane in
        default) cmd=(npx vitest run src/levels.test.ts); envs=() ;;
        qe)      cmd=(npx vitest run src/levels.qe.test.ts); envs=() ;;
        deep)    if [ "$id" = "M3a_seed_perturbs_engine_budget" ]; then
                   cmd=(npx vitest run src/levels.test.ts); else
                   cmd=(npx vitest run src/levels.test.ts -t "A4|A2|A3"); fi
                 envs=(ENGINE_DEEP=1) ;;
      esac
      echo "== $id $lane load1 $(sysctl -n vm.loadavg) $(date -u +%T)"
      t0=$(date +%s)
      (cd "$C" && env "${envs[@]+"${envs[@]}"}" "${cmd[@]}" > "$S/mut/$id.$lane.log" 2>&1)
      rc=$?
      echo "exit $rc  $(( $(date +%s) - t0 )) s  load1 $(sysctl -n vm.loadavg)"
      grep -E "Tests +[0-9]|Test Files" "$S/mut/$id.$lane.log" | sed 's/^/   /'
      grep -E "^ (FAIL|×)|✗|AssertionError|Error:" "$S/mut/$id.$lane.log" | sort | uniq -c | head -8 | sed 's/^/   /'
    done
    if [ "$id" = "M3b_seed_as_engine_option" ]; then
      echo "== $id typecheck"; (cd "$C" && npx tsc --noEmit 2>&1 | grep -E "error TS" | head -3); echo "exit ${PIPESTATUS[0]}"
    fi
  } > "$O" 2>&1
  echo "done $id"
done
