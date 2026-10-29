# qe-epic008-close host probes, Linux (qe-ABC-208/210 common.sh ported from macOS). Paths are computed at run time.
ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }
load1() { cut -d' ' -f1 /proc/loadavg; }
# power: "none" when /sys/class/power_supply has no entry; else type:status/online per entry
power() { local out="" e; for e in /sys/class/power_supply/*; do [ -e "$e" ] || continue
    out="$out$(cat $e/type 2>/dev/null):$(cat $e/status 2>/dev/null || cat $e/online 2>/dev/null),"; done
  [ -z "$out" ] && echo none || echo "${out%,}"; }
battery_present() { local e; for e in /sys/class/power_supply/*; do [ -e "$e" ] || continue
    [ "$(cat $e/type 2>/dev/null)" = "Battery" ] && return 0; done; return 1; }
# thermal: k10temp temp1 (Tctl), whole degrees C
thermal() { local h; for h in /sys/class/hwmon/hwmon*; do [ "$(cat $h/name 2>/dev/null)" = k10temp ] && { echo $(( $(cat $h/temp1_input) / 1000 )); return; }; done; echo "?"; }
vitest() { pgrep -f '[n]ode.*vitest' | wc -l | tr -d ' '; }
# cutechess-cli processes whose command line does not name OWN (the reading's out dir); OWN empty = all
cutechess_foreign() { local own=${1:-} n=0 pid
  for pid in $(pgrep -f '[c]utechess-cli'); do
    if [ -n "$own" ] && tr '\0' ' ' < /proc/$pid/cmdline 2>/dev/null | grep -qF "$own"; then continue; fi
    n=$((n+1)); done; echo $n; }
# preconditions: load1 <= 8, 0 node vitest, 0 cutechess-cli; poll every 15 s up to 60 min (a pause, never a re-run).
# A battery entry -> STOP before game 1 (exit 5); the brief's power rule.
wait_pre() { local log=$1 i
  for i in $(seq 1 240); do
    local l=$(load1) p=$(power) v=$(vitest) c=$(cutechess_foreign "") t=$(thermal)
    echo "$(ts) wait poll=$i load1=$l power=$p vitest=$v cutechess=$c thermal=$t" >> "$log"
    if battery_present; then echo "$(ts) BATTERY-PRESENT: STOP before game 1" >> "$log"; return 5; fi
    if [ "$v" = "0" ] && [ "$c" = "0" ] && awk -v l="$l" 'BEGIN{exit !(l<=8)}'; then echo "$(ts) PRECONDITIONS-MET" >> "$log"; return 0; fi
    sleep 15
  done
  echo "$(ts) PRECONDITION-NOT-MET after 60 min" >> "$log"; return 3; }
# sampler every 10 s; process lines of foreign load go to a scratch-only file (never packaged)
sampler() { local log=$1 own=${2:-}; while true; do local v=$(vitest) c=$(cutechess_foreign "$own")
    echo "$(ts) load1=$(load1) power=$(power) thermal=$(thermal) vitest=$v cutechess_foreign=$c" >> "$log"
    if [ "$v" != "0" ] || [ "$c" != "0" ]; then { echo "$(ts)"; pgrep -fa '[n]ode.*vitest' | cut -c1-200; pgrep -fa '[c]utechess-cli' | cut -c1-120; } >> "$log.procs-scratch-only"; fi
    sleep 10; done; }
