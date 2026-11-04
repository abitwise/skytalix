#!/bin/bash
# qe-ABC-302 A6: the 27 frozen mutants (arch-ABC-302 raw/mut.py + abc244-carried.json, byte-unchanged) on scratch
# arms, never the repository. One `flock <scratch>/host-test.lock` hold, after A8. B = base arm; H2 = a tip arm
# (identity twin of H, used after timing). Base and tip production files are identical, so one .orig set serves both.
# Usage: a6.sh <arms dir> <dir holding mut.py + abc244-carried.json> <out dir>
A=$1; M=$2/mut.py; O=$3; mkdir -p $O/orig $O/json
for f in engine levels level-seam search zobrist apply history gameend uci-session; do cp $A/B/src/$f.ts $O/orig/$f.ts.orig; done
killers() { node -e 'const j=require(process.argv[1]);const k=[];for(const f of j.testResults){const n=f.name.split("/").pop();let a=0;for(const t of f.assertionResults)if(t.status==="failed"){k.push(n+"::"+t.fullName);a++}if(f.status==="failed"&&a===0)k.push("FILEFAIL "+n)}console.log([j.numTotalTests,j.numPassedTests,j.numFailedTests,j.numPendingTests+(j.numTodoTests||0),k.length,k.join(" ; ")].join("\t"))' "$1" 2>/dev/null || printf 'NOJSON\t\t\t\t\t\n'; }
lane() { (cd $A/$1 && NODE_OPTIONS=--max-old-space-size=128 node tools/grugops/run-bounded.js 120000 npx vitest run --reporter=json --outputFile=$O/json/$2.json > $O/json/$2.log 2>&1); }
deep() { # deep <ev> <file> <-t pattern> <tag>
  (cd $A/H2 && env $1=1 NODE_OPTIONS=--max-old-space-size=400 node_modules/.bin/vitest run $2 ${3:+-t "$3"} --reporter=json --outputFile=$O/json/$4.json > $O/json/$4.log 2>&1); }
declare -A L
L[R1]='SEARCH_DEEP|src/search.null-move.test.ts|A2 — the instrumented search makes 0 null moves in check, and 0 below three non-pawn pieces \[deep, SEARCH_DEEP=1\]'
L[R2]='ENGINE_DEEP|src/uci-session.test.ts|ABC-241 A4, A5 — UCI: the prior keys are repetition keys \[deep, ENGINE_DEEP=1\]'
L[R3]='SEARCH_DEEP|src/search.futility.test.ts|the doors — searchWithoutFutility and chooseMoveWithoutFutility turn futility off, as every older door does \[deep, SEARCH_DEEP=1\]'
L[R4]='ZOBRIST_DEEP|src/zobrist.test.ts|ABC-075 property — the ep component tracks the ep FIELD, not availability \(ADR-0020\) \[deep, ZOBRIST_DEEP=1\]'
L[R5]='ENGINE_DEEP|src/engine.test.ts|ABC-170 A5 — the limits only shorten; the ceiling still holds \[deep, ENGINE_DEEP=1\]'
L[R6]='ENGINE_DEEP|src/levels.test.ts|A7 — seeded, in deterministic mode \[deep\]'
L[R7]='ENGINE_DEEP|src/levels.test.ts|ABC-174 A3 — the default plays as the engine: chooseMove at 4 000 ms \(ABC-228, ADR-0053 d10\) \[deep\]'
L[R8]='ENGINE_DEEP|src/uci-session.test.ts|ABC-241 A4, A7 — the CLI: a third occurrence through an uncapturable ep square \[deep, ENGINE_DEEP=1\]'
L[R9]='ENGINE_DEEP|src/engine.capacity.test.ts|ABC-122 A8: src/engine\.ts'"'"'s KEY_ARRAY_CAPACITY guard, reached through chooseMove\(\) \[deep, ENGINE_DEEP=1\]'
declare -A ROWOF=([M1]=R1 [M2]=R2 [M3]=R3 [M3s]=R3 [M4]=R4 [M4z]=R4 [M5]=R5 [M5c]=R5 [M6]=R6 [M7]=R7 [M7n]=R7 [M8d]=R8 [M9]=R9 [M9r]=R9)
T=$O/a6.tsv
echo -e "arm\tlane\tmutant\texit\ttotal\tpassed\tfailed\tskipped\tn_killers\tkillers" > $T
IDS="restore M1 M2 M2s M3 M3s M4 M4z M5 M5c M6 M6t M7 M7n M8d M9 M9r F230 QSEAMRAW QPRIOROFF QMATCH3 QTRIM1 REP0 S241M1 QMATCH1 UNTRIM S241M6 QUCINOKEYS"
for m in $IDS; do
  for arm in B H2; do
    python3 -I $M $A/$arm $O/orig $m > /dev/null || { echo -e "$arm\tdefault\t$m\tAPPLYFAIL" >> $T; continue; }
    lane $arm $arm-$m-default; ex=$?
    echo -e "$arm\tdefault\t$m\t$ex\t$(killers $O/json/$arm-$m-default.json)" >> $T
  done
  python3 -I $M $A/B $O/orig restore > /dev/null
  if [ $m = restore ]; then rows="R1 R2 R3 R4 R5 R6 R7 R8 R9"; else rows=${ROWOF[$m]:-}; fi
  for r in $rows; do
    IFS='|' read -r ev file pat <<< "${L[$r]}"
    deep $ev $file "$pat" H2-$m-deep-$r; ex=$?
    echo -e "H2\tdeep-$r\t$m\t$ex\t$(killers $O/json/H2-$m-deep-$r.json)" >> $T
  done
  if [ $m = M8d ] || [ $m = restore ]; then  # R8's and R2's deep rows in the FULL uci-session ENGINE_DEEP lane order
    deep ENGINE_DEEP src/uci-session.test.ts "" H2-$m-deep-uci-full; ex=$?
    echo -e "H2\tdeep-uci-full\t$m\t$ex\t$(killers $O/json/H2-$m-deep-uci-full.json)" >> $T
  fi
  echo "$m done $(date -u +%FT%TZ)"
done
python3 -I $M $A/B $O/orig restore > /dev/null; python3 -I $M $A/H2 $O/orig restore > /dev/null
for arm in B H2; do for f in engine levels level-seam search zobrist apply history gameend uci-session; do cmp -s $A/$arm/src/$f.ts $O/orig/$f.ts.orig || echo "RESTORE MISMATCH $arm $f"; done; done
echo "a6 done $(date -u +%FT%TZ)"
