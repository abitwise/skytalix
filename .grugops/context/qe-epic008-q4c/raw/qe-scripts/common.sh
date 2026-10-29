# qe-epic008-q4c host probes, Linux (from qe-epic008-close common.sh). Paths are computed at run time.
ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }
load1() { cut -d' ' -f1 /proc/loadavg; }
power() { local out="" e; for e in /sys/class/power_supply/*; do [ -e "$e" ] || continue
    out="$out$(cat $e/type 2>/dev/null):$(cat $e/status 2>/dev/null || cat $e/online 2>/dev/null),"; done
  [ -z "$out" ] && echo none || echo "${out%,}"; }
battery_present() { local e; for e in /sys/class/power_supply/*; do [ -e "$e" ] || continue
    [ "$(cat $e/type 2>/dev/null)" = "Battery" ] && return 0; done; return 1; }
# thermal: k10temp temp1 (Tctl), 0.1 degree C
thermal() { local h; for h in /sys/class/hwmon/hwmon*; do [ "$(cat $h/name 2>/dev/null)" = k10temp ] && { awk '{printf "%.1f", $1/1000}' $h/temp1_input; return; }; done; echo "?"; }
vitest() { pgrep -f '[n]ode.*vitest' | wc -l | tr -d ' '; }
cutechess_foreign() { local own=${1:-} n=0 pid
  for pid in $(pgrep -f '[c]utechess-cli'); do
    if [ -n "$own" ] && tr '\0' ' ' < /proc/$pid/cmdline 2>/dev/null | grep -qF "$own"; then continue; fi
    n=$((n+1)); done; echo $n; }
# cpufreq: governors (distinct, with counts), EPP of cpu0, boost, per-core requested (scaling_cur_freq) and
# measured (cpuinfo_avg_freq, APERF/MPERF) frequency in MHz, cpu0..cpuN in order; per-core scaling_max_freq distinct set.
CPUS=$(ls -d /sys/devices/system/cpu/cpu[0-9]* | sort -V)
govs() { cat /sys/devices/system/cpu/cpu[0-9]*/cpufreq/scaling_governor | sort | uniq -c | awk '{printf "%s%sx%s", (NR>1?",":""), $2, $1}'; }
freqs() { local f=$1 c out=""; for c in $CPUS; do out="$out$(( $(cat $c/cpufreq/$f 2>/dev/null || echo 0) / 1000 )),"; done; echo "${out%,}"; }
maxset() { cat /sys/devices/system/cpu/cpu[0-9]*/cpufreq/scaling_max_freq | sort -u | awk '{printf "%s%d", (NR>1?",":""), $1/1000}'; }
wait_pre() { local log=$1 i
  for i in $(seq 1 240); do
    local l=$(load1) p=$(power) v=$(vitest) c=$(cutechess_foreign "") t=$(thermal)
    echo "$(ts) wait poll=$i load1=$l power=$p vitest=$v cutechess=$c thermal=$t" >> "$log"
    if battery_present; then echo "$(ts) BATTERY-PRESENT: STOP before game 1" >> "$log"; return 5; fi
    if [ "$v" = "0" ] && [ "$c" = "0" ] && awk -v l="$l" 'BEGIN{exit !(l<=8)}'; then echo "$(ts) PRECONDITIONS-MET" >> "$log"; return 0; fi
    sleep 15
  done
  echo "$(ts) PRECONDITION-NOT-MET after 60 min" >> "$log"; return 3; }
# sampler every ~10 s. Logging only: it never stops the reading.
sampler() { local log=$1 own=${2:-}; while true; do local v=$(vitest) c=$(cutechess_foreign "$own")
    echo "$(ts) load1=$(load1) power=$(power) tctl=$(thermal) vitest=$v cutechess_foreign=$c gov=$(govs) epp=$(cat /sys/devices/system/cpu/cpu0/cpufreq/energy_performance_preference) boost=$(cat /sys/devices/system/cpu/cpufreq/boost 2>/dev/null || echo ?) maxset=$(maxset) cur=$(freqs scaling_cur_freq) avg=$(freqs cpuinfo_avg_freq)" >> "$log"
    if [ "$v" != "0" ] || [ "$c" != "0" ]; then { echo "$(ts)"; pgrep -fa '[n]ode.*vitest' | cut -c1-200; pgrep -fa '[c]utechess-cli' | cut -c1-120; } >> "$log.procs-scratch-only"; fi
    sleep 10; done; }
