#!/bin/bash
# qe3-ABC-105-lane N8-LANE re-read window (copy of qe-ABC-105/probe/window105.sh; only CTX, TAG, console name and the arm tip changed) (width 1). Harness: secnfr-ABC-144-window-b/probe/lane144b.mjs used IN PLACE, unchanged.
# Gate: secnfr-ABC-152-window/probe/gate.sh used IN PLACE: thermal 0, load1 <= 4.0, no runner process, 4 x 15 s.
# Arms (git archive db1cfb6c, shared symlinked node_modules): B = placeholder at the path, H = tip, T = twin of B.
# Sampler: every 5 s, utc / load1 / thermal / power / runner lines other than this window's own (by file name) / platform-repo lines.
D="$(cd "$(dirname "$0")" && pwd)"
CTX=/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe3-ABC-105-lane/.grugops/context
LANE=$CTX/secnfr-ABC-144-window-b/probe/lane144b.mjs
GATE=$CTX/secnfr-ABC-152-window/probe/gate.sh
GMAX="${GMAX:-30}"; MAXLOAD="${MAXLOAD-4.0}"  # attempt 2: MAXLOAD="" = load logged, not gated (ADR-0035 d2)
ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }
{
  echo "utc_start $(ts)"; echo "lane sha256 $(shasum -a 256 "$LANE" | cut -d' ' -f1)"; echo "gate sha256 $(shasum -a 256 "$GATE" | cut -d' ' -f1)"
  echo "node $(node --version) vitest $(node -p 'require("'"$D"'/arms/H/node_modules/vitest/package.json").version')"
  echo "hw $(sysctl -n hw.model) $(sysctl -n machdep.cpu.brand_string)"; pmset -g batt | head -1; pmset -g | grep -i lowpowermode
  notifyutil -g com.apple.system.thermalpressurelevel; echo "load $(sysctl -n vm.loadavg)"; echo "VITEST_ env: $(env | grep -c '^VITEST_')"
} > "$D/window-once.txt" 2>&1
rm -f "$D/STOP"
( printf 'utc\tload1\tthermal\tpower\tforeign_runner\tplatform\tforeign_cmds\n' > "$D/sampler.tsv"
  while [ ! -e "$D/STOP" ]; do
    fr=$(ps -Ao command | grep '[v]itest' | grep -v -c 'qe-hop-integrity[.]test[.]ts')
    fc=$(ps -Ao command | grep '[v]itest' | grep -v 'qe-hop-integrity[.]test[.]ts' | cut -c1-90 | tr '\n\t' '| ' )
    pf=$(ps -Ao command | grep -c '[o]eselg-labs/platform')
    printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$(ts)" "$(sysctl -n vm.loadavg | tr -d '{}' | awk '{print $1}')" \
      "$(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}')" "$(pmset -g batt | sed -n "s/.*'\(.*\)'.*/\1/p")" "$fr" "$pf" "$fc" >> "$D/sampler.tsv"
    sleep 5
  done ) &
echo "gate_start $(ts) MAXLOAD=[$MAXLOAD]" >> "$D/window-once.txt"
if ! bash "$GATE" "$D" settle "$MAXLOAD" 1 "$GMAX"; then echo "GATE_TIMEOUT $(ts)" >> "$D/window-once.txt"; touch "$D/STOP"; exit 3; fi
echo "gate_pass $(ts)" >> "$D/window-once.txt"
cd "$D" && ARMS="$D/arms" CONDS=B,H,T BASE=B TWIN=T ROUNDS=9 GAP=0 TAG=n8-qe3 NARROW="tools/grugops/qe-hop-integrity.test.ts" \
  node "$LANE" > "$D/n8-qe3.console.txt" 2>&1
echo "lane_exit $? $(ts)" >> "$D/window-once.txt"
sleep 6; touch "$D/STOP"; echo "utc_end $(ts)" >> "$D/window-once.txt"
