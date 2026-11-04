#!/bin/bash
# qe-ABC-302 A4 resume (brief qe-ABC-302-resume, item 4): the remainder of raw/a4.sh after the host disruption, from
# H deep-engine onward, then every arm-B lane. run() and each lane line are a4.sh's, byte for byte; the only change is
# that the header line is gone, because a4.sh's `echo ... > $T` would truncate the 17 finished rows. It appends.
# Run inside one `flock <scratch>/host-test.lock` hold. Usage: a4-resume.sh <arms dir> <out dir>
A=$1; O=$2; mkdir -p $O/out; T=$O/a4.tsv
run() { # run <arm> <id> <env> <file> [pattern]
  local st=$(date +%s)
  if [ -n "$5" ]; then (cd $A/$1 && env ${3:+$3} NODE_OPTIONS=--max-old-space-size=400 npx vitest run $4 -t "$5" > $O/out/$1-$2.txt 2>&1)
  else (cd $A/$1 && env ${3:+$3} NODE_OPTIONS=--max-old-space-size=400 npx vitest run $4 > $O/out/$1-$2.txt 2>&1); fi
  local ex=$?
  echo -e "$1\t$2\t$ex\t$(( $(date +%s) - st ))\t$(sed 's/\x1b\[[0-9;]*m//g' $O/out/$1-$2.txt | grep -E '^ +Tests ' | tr -s ' ')" >> $T
}
echo "lock-acquired $(date -u +%FT%TZ)"
  run H deep-engine ENGINE_DEEP=1 src/engine.test.ts
  run H deep-capacity ENGINE_DEEP=1 src/engine.capacity.test.ts
  run H cli-single "" src/cli.test.ts
  run H deep-uci ENGINE_DEEP=1 src/uci-session.test.ts
  run H deep-levels ENGINE_DEEP=1 src/levels.test.ts
for arm in B; do
  run $arm deep-null SEARCH_DEEP=1 src/search.null-move.test.ts
  run $arm deep-futility SEARCH_DEEP=1 src/search.futility.test.ts
  run $arm deep-zobrist ZOBRIST_DEEP=1 src/zobrist.test.ts
  run $arm deep-engine ENGINE_DEEP=1 src/engine.test.ts
  run $arm deep-capacity ENGINE_DEEP=1 src/engine.capacity.test.ts
  run $arm cli-single "" src/cli.test.ts
  run $arm deep-uci ENGINE_DEEP=1 src/uci-session.test.ts
  run $arm deep-levels ENGINE_DEEP=1 src/levels.test.ts
done
echo "a4 done $(date -u +%FT%TZ)"
