#!/bin/bash
# qe-qehop-growth T-QEHOP-GROWTH window on oeselg-dev (Linux). The Linux counterpart of qe-ABC-154/probe/window-qe5.sh
# (sha256 b2d39bce...b4027aedfc): host facts once, a 5 s sampler throughout, the settle gate, the lane, 6 s tail, STOP.
# Every host read is a Linux read (preregistration.txt § ADAPTATIONS). The sampler is waited on with kill -0 only.
# usage: ROUNDS=9 STREAK=4 GMAX=45 bash window-qeg.sh <laneDir>   (laneDir holds arms/{B,H,T}; outputs land in laneDir)
P="$(cd "$(dirname "$0")" && pwd)"
D="$(realpath "$1")"; ROUNDS="${ROUNDS:-9}"; STREAK="${STREAK:-4}"; GMAX="${GMAX:-45}"
ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }
topnow() { top -b -n 2 -d 1 -w 200 | awk '/^top -/{n++} n==2' | head -24; }
{
  echo "utc_start $(ts)"
  for f in lane-qeg.mjs host-qeg.mjs gate-qeg.mjs sampler-qeg.mjs window-qeg.sh; do echo "$f sha256 $(sha256sum "$P/$f" | cut -d' ' -f1)"; done
  echo "node $(node --version) vitest $(node -p "require('$D/arms/H/node_modules/vitest/package.json').version")"
  echo "time: $(/usr/bin/time --version 2>&1 | head -1)"
  echo "host $(hostname) |$(grep -m1 'model name' /proc/cpuinfo | cut -d: -f2) | nproc $(nproc) | kernel $(uname -r)"
  echo "power_supply devices: $(ls /sys/class/power_supply | wc -l)"
  echo "governor $(cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor 2>/dev/null) epp $(cat /sys/devices/system/cpu/cpu0/cpufreq/energy_performance_preference 2>/dev/null)"
  echo "loadavg $(cat /proc/loadavg)"
  echo "VITEST_ env: $(env | grep -c '^VITEST_') ; NODE_OPTIONS env: [${NODE_OPTIONS:-}]"
  for a in B H T; do echo "arm $a notes $(find "$D/arms/$a/.grugops/context" -path '*/notes/*.md' | wc -l) test sha256 $(sha256sum "$D/arms/$a/tools/grugops/qe-hop-integrity.test.ts" | cut -d' ' -f1)"; done
  echo "--- top before the gate (second iteration, 1 s)"; topnow
} > "$D/window-once.txt" 2>&1
rm -f "$D/STOP"
node "$P/sampler-qeg.mjs" "$D/arms" "$D" & SPID=$!
echo "sampler_pid $SPID" >> "$D/window-once.txt"
echo "gate_start $(ts) STREAK=$STREAK GMAX=$GMAX" >> "$D/window-once.txt"
if ! node "$P/gate-qeg.mjs" "$D" settle "$STREAK" "$GMAX"; then
  echo "GATE_TIMEOUT $(ts)" >> "$D/window-once.txt"; touch "$D/STOP"
  while kill -0 "$SPID" 2>/dev/null; do sleep 1; done
  exit 3
fi
echo "gate_pass $(ts)" >> "$D/window-once.txt"
ARMS="$D/arms" OUT="$D" ROUNDS="$ROUNDS" node "$P/lane-qeg.mjs" > "$D/n8-qeg.console.txt" 2>&1
echo "lane_exit $? $(ts)" >> "$D/window-once.txt"
sleep 6; touch "$D/STOP"
while kill -0 "$SPID" 2>/dev/null; do sleep 1; done
{ echo "--- top after the lane (second iteration, 1 s)"; topnow; echo "loadavg $(cat /proc/loadavg)"; echo "utc_end $(ts)"; } >> "$D/window-once.txt" 2>&1
