#!/bin/bash
S=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/abc152
cd /Users/olgeroeselg/Projects/hacks/grugops-examples/wt-ABC-152 && export PATH="$PWD/node_modules/.bin:$PATH"
for v in PERFT_DEEP SEARCH_DEEP ENGINE_DEEP INPUT_DEEP ZOBRIST_DEEP PUZZLE_DEEP CLI_DEEP LADDER_DEEP; do
  extra=""; [ $v = INPUT_DEEP ] && extra="NODE_OPTIONS=--expose-gc"
  echo "$v start $(date +%s) $(sysctl -n vm.loadavg) thermal=$(pmset -g therm 2>/dev/null | grep -i 'thermal' | head -1 | tr -s ' ')" >> $S/lanes/log.txt
  t0=$(date +%s)
  env $extra $v=1 node tools/grugops/run-bounded.js 1800000 vitest run --reporter=dot --reporter=json --outputFile.json=$S/lanes/$v.json > $S/lanes/$v.out 2>&1
  e=$?
  echo "$v exit $e wall_s $(( $(date +%s) - t0 ))" >> $S/lanes/log.txt
done
echo DONE >> $S/lanes/log.txt
