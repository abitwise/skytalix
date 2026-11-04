#!/bin/bash
# qe-ABC-281 A6: the frozen mutants (arch-ABC-281 raw/mut.py, byte-unchanged) on scratch arms, never the repository.
# Run inside one `flock <lock>` hold, after A8. B = base arm, H2 = a tip arm (identity twin of H, used after timing).
# Usage: a6.sh <arms dir> <mut.py> <out dir>
A=$1; M=$2; O=$3; mkdir -p $O
for arm in B H2; do mkdir -p $O/orig-$arm; cp $A/$arm/src/engine.ts $O/orig-$arm/engine.ts.orig; cp $A/$arm/src/levels.ts $O/orig-$arm/levels.ts.orig; done
killers() { node -e 'const j=require(process.argv[1]);const k=[];for(const f of j.testResults)for(const a of f.assertionResults)if(a.status==="failed")k.push(f.name.split("/").pop()+"::"+a.fullName);console.log([j.numPassedTests,j.numFailedTests,j.numPendingTests+(j.numTodoTests||0),k.join(" ; ")].join("\t"))' "$1"; }
echo -e "arm\tlane\tmutant\texit\tpassed\tfailed\tskipped\tkillers" > $O/a6.tsv
for m in restore M1 M2 M2c M3c M3d; do
  for arm in B H2; do
    python3 -I $M $A/$arm $O/orig-$arm $m > /dev/null
    (cd $A/$arm && npm test > $O/$arm-$m-default.txt 2>&1); ex=$?
    echo -e "$arm\tdefault\t$m\t$ex\t$(killers $A/$arm/.test-results/last-run.json)" >> $O/a6.tsv
  done
  case $m in restore) files="null engine levels";; M1) files=null;; M2|M2c) files=engine;; M3c|M3d) files=levels;; esac
  python3 -I $M $A/H2 $O/orig-H2 $m > /dev/null
  for f in $files; do
    case $f in
      null) ev=SEARCH_DEEP; file=src/search.null-move.test.ts; t="QE-208-a — an abort inside a null move's subtree still hands the root back byte-identical \[deep, SEARCH_DEEP=1\]";;
      engine) ev=ENGINE_DEEP; file=src/engine.test.ts; t="ABC-230 A3 and A4 — no prior keys is base, node for node, and the doors take none \[deep, ENGINE_DEEP=1\]";;
      levels) ev=ENGINE_DEEP; file=src/levels.test.ts; t="A9 — different seeds actually differ \[deep\]";;
    esac
    (cd $A/H2 && env $ev=1 NODE_OPTIONS=--max-old-space-size=400 node_modules/.bin/vitest run $file -t "$t" --reporter=default --reporter=json --outputFile.json=$O/deep-$m-$f.json > $O/H2-$m-deep-$f.txt 2>&1); ex=$?
    echo -e "H2\tdeep-row-$f\t$m\t$ex\t$(killers $O/deep-$m-$f.json)" >> $O/a6.tsv
  done
done
python3 -I $M $A/B $O/orig-B restore > /dev/null; python3 -I $M $A/H2 $O/orig-H2 restore > /dev/null
echo "a6 done $(date -u +%FT%TZ)"
