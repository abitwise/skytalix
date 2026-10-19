#!/bin/bash
# qe-ABC-174 mutant runner: one mutant at a time on the scratch copy $S/mut (git archive be6a5599), the default lane
# as AGENTS.md spells the SUITE shape, then the file is restored from the pristine arm $S/arms/H and cmp-checked.
S=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/c759514b-0b67-4176-b897-647bcb7478de/scratchpad; P=/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.grugops/context/qe-ABC-174/probe
mkdir -p $S/mut-out
while IFS=$'\t' read -r id file expr desc; do
  [ -n "$id" ] || continue
  cp $S/arms/H/$file $S/mut/$file
  sed -i '' "$expr" $S/mut/$file
  if cmp -s $S/arms/H/$file $S/mut/$file; then echo -e "$id\tNOT-APPLIED\t$desc"; continue; fi
  ( cd $S/mut && NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json --outputFile.json=$S/mut-out/$id.json >/dev/null 2>$S/mut-out/$id.err ); rc=$?
  cp $S/arms/H/$file $S/mut/$file; cmp -s $S/arms/H/$file $S/mut/$file || echo "RESTORE FAILED $id"
  f=$(jq '.numFailedTests' $S/mut-out/$id.json 2>/dev/null); t=$(jq '.numTotalTests' $S/mut-out/$id.json 2>/dev/null)
  echo -e "$id\trc $rc\tfailed ${f:-?}/${t:-?}\t$desc"
  jq -r '.testResults[] | .name as $n | .assertionResults[] | select(.status=="failed") | "    \($n|sub(".*/src/";"")) > \(.fullName)"' $S/mut-out/$id.json 2>/dev/null | cut -c1-170 | head -12
done < $P/mutants.tsv
