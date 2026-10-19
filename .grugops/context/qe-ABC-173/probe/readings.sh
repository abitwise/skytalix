#!/bin/bash
# qe-ABC-173 timing readings, started ONLY right after a foreground window.mjs 180 exit 0. Width 1.
# N8-LANE narrow set (ADR-0035 D2; ADR-0008 addendum Ruling 5): B = git archive 68bbf33f (base command, unprefixed),
# T = cp -R of B, H = git archive 840ebbf7 (head command, SUITE prefix). A9: H and H2 = cp -R of H, `npm test` as spelled.
S=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/qe173
D=$S/win; mkdir -p $D; rm -f $D/STOP
unset NODE_OPTIONS PERFT_DEEP SEARCH_DEEP ENGINE_DEEP INPUT_DEEP ZOBRIST_DEEP PUZZLE_DEEP CLI_DEEP LADDER_DEEP VITEST_MAX_WORKERS
{ echo "utc_start $(date -u +%Y-%m-%dT%H:%M:%SZ)"; echo "host $(hostname) $(sysctl -n hw.model) $(sysctl -n machdep.cpu.brand_string) ncpu $(sysctl -n hw.ncpu)";
  echo "node $(node --version) vitest $(node -p 'require("'$S'/nm/vitest/package.json").version')"; pmset -g batt | head -1; pmset -g | grep -i lowpowermode;
  notifyutil -g com.apple.system.thermalpressurelevel; echo "load $(sysctl -n vm.loadavg)";
  echo "lane173 sha256 $(shasum -a 256 $S/lane173.mjs | cut -d' ' -f1)"; } > $D/window-once.txt 2>&1
node $S/sampler173.mjs $D $S/arms & SP=$!
SET="src/cli.test.ts src/cli.real-engine.test.ts src/engine.test.ts src/line-input.test.ts src/uci-session.test.ts"
REP='"--reporter=default","--reporter=json","--outputFile.json=.test-results/last-run.json"'
SETJ=$(printf '"%s",' $SET); SETJ=${SETJ%,}
cd $D && ARMS=$S/arms CONDS=B,H,T BASE=B TWIN=T ROUNDS=9 GAP=0 TAG=n8-173 NARROW="$SET" \
  CMD_H="[\"env\",\"NODE_OPTIONS=--max-old-space-size=128\",\"npx\",\"vitest\",\"run\",$SETJ,$REP]" \
  node $S/lane173.mjs > $D/n8-173.console.txt 2>&1
echo "n8_exit $? $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $D/window-once.txt
cd $D && ARMS=$S/arms CONDS=H,H2 BASE=H TWIN=H2 ROUNDS=9 GAP=0 TAG=a9-173 node $S/lane173.mjs > $D/a9-173.console.txt 2>&1
echo "a9_exit $? $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $D/window-once.txt
mv $S/n8-173.tsv $S/n8-173.summary.txt $S/a9-173.tsv $S/a9-173.summary.txt $D/ 2>/dev/null
sleep 6; touch $D/STOP; wait $SP; echo "utc_end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $D/window-once.txt
python3 -I $S/readout173.py $D n8-173 16pct multi > $D/n8-173.readout.txt 2>&1
python3 -I $S/readout-a9.py $D a9-173 > $D/a9-173.readout.txt 2>&1
echo READINGS-DONE >> $D/window-once.txt
