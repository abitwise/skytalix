# qe-ABC-230 host probes, Linux (from qe-epic008-q4c common.sh). Paths are computed at run time; none is written here.
ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }
load1() { cut -d' ' -f1 /proc/loadavg; }
power() { local out="" e; for e in /sys/class/power_supply/*; do [ -e "$e" ] || continue
    out="$out$(cat $e/type 2>/dev/null):$(cat $e/status 2>/dev/null || cat $e/online 2>/dev/null),"; done
  [ -z "$out" ] && echo none || echo "${out%,}"; }
# thermal: k10temp temp1 (Tctl), 0.1 degree C
thermal() { local h; for h in /sys/class/hwmon/hwmon*; do [ "$(cat $h/name 2>/dev/null)" = k10temp ] && { awk '{printf "%.1f", $1/1000}' $h/temp1_input; return; }; done; echo "?"; }
# the brief's probes: foreign vitest = pgrep -f "[/]vitest"; cutechess = pgrep -x cutechess-cli
vitest() { pgrep -f '[/]vitest' | wc -l | tr -d ' '; }
cutechess_all() { pgrep -x cutechess-cli | wc -l | tr -d ' '; }
CPUS=$(ls -d /sys/devices/system/cpu/cpu[0-9]* | sort -V)
freqs() { local f=$1 c out=""; for c in $CPUS; do out="$out$(( $(cat $c/cpufreq/$f 2>/dev/null || echo 0) / 1000 )),"; done; echo "${out%,}"; }
busy() { freqs cpuinfo_avg_freq | tr ',' '\n' | sort -n | tail -1; }
# Preconditions (pre-registered): 0 cutechess-cli, 0 foreign vitest, load1 <= 2.0, Tctl <= 60.0. Poll 15 s, up to 60 min.
wait_pre() { local log=$1 i
  for i in $(seq 1 240); do
    local l=$(load1) v=$(vitest) c=$(cutechess_all) t=$(thermal)
    echo "$(ts) wait poll=$i load1=$l power=$(power) vitest=$v cutechess=$c tctl=$t" >> "$log"
    if [ "$v" = "0" ] && [ "$c" = "0" ] && awk -v l="$l" -v t="$t" 'BEGIN{exit !(l<=2.0 && t<=60.0)}'; then
      echo "$(ts) PRECONDITIONS-MET" >> "$log"; return 0; fi
    sleep 15
  done
  echo "$(ts) PRECONDITION-NOT-MET after 60 min" >> "$log"; return 3; }
# sampler every ~10 s: tctl, load1, foreign vitest, cutechess count, busiest-core measured MHz, per-core avg MHz.
sampler() { local log=$1; while true; do local v=$(vitest)
    echo "$(ts) load1=$(load1) power=$(power) tctl=$(thermal) vitest=$v cutechess=$(cutechess_all) busy_mhz=$(busy) avg=$(freqs cpuinfo_avg_freq)" >> "$log"
    if [ "$v" != "0" ]; then { echo "$(ts)"; pgrep -fa '[/]vitest' | cut -c1-200; } >> "$log.procs-scratch-only"; fi
    sleep 10; done; }
