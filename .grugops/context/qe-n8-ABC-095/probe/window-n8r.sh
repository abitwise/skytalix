#!/bin/bash
# qe-n8-ABC-095: a copy of qe-ABC-095/probe/window-n8.sh (sha256 d31d738b...4cb35b) with TWO changes, fixed in
# qe-n8-ABC-095/probe/preregistration.txt before window 1: (W1) CTX is this hop's worktree, where lane144b.mjs and gate.sh are
# the same bytes (sha256 652b7793...c80c7c, 5335905a...352b6f); (W2) ARMS is a required parameter (S1/S2: qen8095/arms;
# S3: qen8095/arms3). The sampler, the gate call, the lane call and every logged field are unchanged.
# ---- the original header follows ----
# qe-ABC-095 N8-LANE window for ONE narrow set (copy of qe-ABC-154/probe/window-qe5.sh; changed: CTX, the set and TAG are
# parameters, the sampler's own-file filter follows the set, the window directory is an argument, and the gate gets the
# remaining minutes of the hop's global budget). Width 1.
# Usage: SET=src/cli.test.ts OWN='src/cli[.]test[.]ts' TAG=n8-cli-w1 GMAX=<min> bash window-n8.sh <window dir>
# Harness: secnfr-ABC-144-window-b/probe/lane144b.mjs IN PLACE, unchanged. Gate: secnfr-ABC-152-window/probe/gate.sh IN PLACE,
# settle: thermal 0, NO vitest runner process (NOFOREIGN 1), 4 x 15 s, MAXLOAD "" (load1 logged, not gated).
# Arms (outside the repository): B = git archive 0974102f, T = cp -R of B, H = git archive 2307fc11; one shared node_modules symlink each.
D="$1"; mkdir -p "$D"
CTX=/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe-n8-ABC-095/.grugops/context
LANE=$CTX/secnfr-ABC-144-window-b/probe/lane144b.mjs
GATE=$CTX/secnfr-ABC-152-window/probe/gate.sh
ARMS="${ARMS:?ARMS is required}"
GMAX="${GMAX:-30}"
ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }
{
  echo "utc_start $(ts) set $SET tag $TAG own-filter $OWN"; echo "lane sha256 $(shasum -a 256 "$LANE" | cut -d' ' -f1)"; echo "gate sha256 $(shasum -a 256 "$GATE" | cut -d' ' -f1)"
  echo "node $(node --version) vitest $(node -p 'require("'"$ARMS"'/H/node_modules/vitest/package.json").version')"
  echo "hw $(sysctl -n hw.model) $(sysctl -n machdep.cpu.brand_string)"; pmset -g batt | head -1; pmset -g | grep -i lowpowermode
  notifyutil -g com.apple.system.thermalpressurelevel; echo "load $(sysctl -n vm.loadavg)"; echo "VITEST_ env: $(env | grep -c '^VITEST_')"; echo "_DEEP env: $(env | grep -c '_DEEP=')"
} > "$D/window-once.txt" 2>&1
rm -f "$D/STOP"
( printf 'utc\tload1\tthermal\tpower\tforeign_runner\tplatform\tforeign_cmds\n' > "$D/sampler.tsv"
  while [ ! -e "$D/STOP" ]; do
    fr=$(ps -Ao command | grep '[v]itest' | grep -v -c "$OWN")
    fc=$(ps -Ao command | grep '[v]itest' | grep -v "$OWN" | cut -c1-90 | tr '\n\t' '| ' )
    pf=$(ps -Ao command | grep -c '[o]eselg-labs/platform')
    printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$(ts)" "$(sysctl -n vm.loadavg | tr -d '{}' | awk '{print $1}')" \
      "$(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}')" "$(pmset -g batt | sed -n "s/.*'\(.*\)'.*/\1/p")" "$fr" "$pf" "$fc" >> "$D/sampler.tsv"
    sleep 5
  done ) &
echo "gate_start $(ts) GMAX=$GMAX" >> "$D/window-once.txt"
if ! bash "$GATE" "$D" settle "" 1 "$GMAX"; then echo "GATE_TIMEOUT $(ts)" >> "$D/window-once.txt"; touch "$D/STOP"; exit 3; fi
echo "gate_pass $(ts)" >> "$D/window-once.txt"
cd "$D" && ARMS="$ARMS" CONDS=B,H,T BASE=B TWIN=T ROUNDS=9 GAP=0 TAG="$TAG" NARROW="$SET" \
  env -u CLI_DEEP -u SEARCH_DEEP -u ENGINE_DEEP -u VITEST_MAX_WORKERS node "$LANE" > "$D/$TAG.console.txt" 2>&1
echo "lane_exit $? $(ts)" >> "$D/window-once.txt"
# lane144b writes <ARMS>/../<TAG>.tsv and .summary.txt; move them into the window directory
mv "$ARMS/../$TAG.tsv" "$ARMS/../$TAG.summary.txt" "$D/" 2>/dev/null
sleep 6; touch "$D/STOP"; echo "utc_end $(ts)" >> "$D/window-once.txt"
