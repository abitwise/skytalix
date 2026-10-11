#!/bin/bash
# ABC-151 plants (usage: plants.sh <scratch-dir> <sha>; ran on 0035001c): one fresh git archive of $SHA per arm, one change, the pin run once.
R=/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example
S=$1; SHA=$2; OUT=$S/abc151-plants.tsv
PROBE=$R/.grugops/context/design-ABC-144/probe/resolved-workers.mjs
: > $OUT
arm() { # id, sed-from (or -), sed-to, env
  id=$1; from=$2; to=$3; envs=$4
  D=$S/abc151-plant-$id; rm -rf $D; mkdir $D
  (cd $R && git archive $SHA) | tar -x -C $D; ln -s $R/node_modules $D/node_modules
  if [ "$from" != "-" ]; then
    n=$(grep -cF -- "$from" $D/vitest.config.ts)
    [ "$n" = 1 ] || { echo "$id anchor count $n" >> $OUT; return; }
    F="$from" T="$to" node -e 'const fs=require("fs");const p=process.argv[1];fs.writeFileSync(p,fs.readFileSync(p,"utf8").replace(process.env.F,process.env.T))' $D/vitest.config.ts
  fi
  log=$S/abc151-plant-$id.log
  (cd $D && env $envs npx vitest run src/cli.test.ts -t "ABC-144" > $log 2>&1); rc=$?
  msg=$(grep -m1 -E "AssertionError|Error:" $log | sed 's/^ *//')
  sum=$(grep -m1 -E "^ +Tests " $log | sed 's/^ *//')
  eff=$(cd $D && env $envs node $PROBE 2>&1 | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);console.log("eff "+j.effectiveWorkers+", isolate "+j.isolate)}catch{console.log("probe: "+s.slice(0,80))}})')
  printf '%s\t%s\t%s\t%s\t%s\n' "$id" "rc=$rc" "$sum" "$msg" "$eff" >> $OUT
  rm -rf $D
}
arm control - - ""
arm r1 "maxWorkers: 2," "" ""
arm r2 '    pool: "threads",' '    pool: "threads",
    isolate: false,' ""
arm r3 - - "VITEST_MAX_THREADS=8"
arm r3b - - "VITEST_MAX_THREADS=3"
arm raise3 "    maxWorkers: 2," "    maxWorkers: 3," ""
arm lower2 - - "VITEST_MAX_THREADS=2"
arm lower1 - - "VITEST_MAX_THREADS=1"
arm x4forks - - "VITEST_MAX_FORKS=3"
cat $OUT
