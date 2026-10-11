#!/bin/bash
# secnfr-ABC-144-window-b: drive Window B exactly as plan ff54a750 pre-registers it (B1 warm, B2 cooled, B3 narrow),
# with the lane144b.mjs copy (additive thermal columns) and the 15 s sampler running across the whole window.
# Usage (cwd = the ticket-branch worktree): bash .grugops/context/secnfr-ABC-144-window-b/probe/window.sh <winb dir>
D="$1"; PR=".grugops/context/secnfr-ABC-144-window-b/probe"
{
  echo "utc_start $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "base $(git -C "$D/arms/B" rev-parse HEAD)"; echo "twin $(git -C "$D/arms/T" rev-parse HEAD)"; echo "head $(git -C "$D/arms/H" rev-parse HEAD)"
  pmset -g | grep -i lowpowermode; echo "node $(node --version)"
  echo "runner $(node -p 'require("'"$D"'/arms/B/node_modules/vitest/package.json").version')"
  echo "hw $(sysctl -n hw.model) $(sysctl -n machdep.cpu.brand_string) perf=$(sysctl -n hw.perflevel0.logicalcpu) eff=$(sysctl -n hw.perflevel1.logicalcpu)"
  echo "os $(uname -sr)"
  echo "pmset -g therm:"; pmset -g therm; echo "pmset -g batt:"; pmset -g batt
  notifyutil -g com.apple.system.thermalpressurelevel; echo "load: $(sysctl -n vm.loadavg)"
} > "$D/window-once.txt" 2>&1
rm -f "$D/STOP"; bash "$PR/sampler.sh" "$D" & SPID=$!
export ARMS="$D/arms" CONDS=B,H,T BASE=B TWIN=T ROUNDS=9
GAP=0 TAG=abc144-warm node "$PR/lane144b.mjs" > "$D/abc144-warm.console.txt" 2>&1
GAP=90 TAG=abc144-cooled node "$PR/lane144b.mjs" > "$D/abc144-cooled.console.txt" 2>&1
GAP=0 NARROW=src/cli.test.ts TAG=abc144-cli-narrow node "$PR/lane144b.mjs" > "$D/abc144-cli-narrow.console.txt" 2>&1
touch "$D/STOP"; wait $SPID
echo "utc_end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$D/window-once.txt"
echo WINDOW_DONE > "$D/DONE"
