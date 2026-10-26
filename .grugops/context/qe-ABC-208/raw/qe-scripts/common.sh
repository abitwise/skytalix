# shared host probes (ABC-204 QE driver.sh, the AC gate removed: power is logged only, owner word …10e61802)
ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }
load1() { sysctl -n vm.loadavg | awk '{print $2}'; }
power() { pmset -g ps | head -1 | sed -E "s/.*'(.*)'.*/\1/" | tr ' ' _; }
batt() { pmset -g ps | sed -n 2p | grep -oE '[0-9]+%' | head -1; }
thermal() { notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}'; }
vitest() { pgrep -f '[n]ode.*vitest' | wc -l | tr -d ' '; }
# wait for load1 <= 8 and no node.*vitest: poll every 15 s, up to 60 min (a pause, never a re-run; qe-ABC-215 brief)
wait_pre() { local log=$1 i
  for i in $(seq 1 240); do
    local l=$(load1) p=$(power) v=$(vitest) t=$(thermal)
    echo "$(ts) wait poll=$i load1=$l power=$p batt=$(batt) vitest=$v thermal=$t" >> "$log"
    if [ "$v" = "0" ] && awk -v l="$l" 'BEGIN{exit !(l<=8)}'; then echo "$(ts) PRECONDITIONS-MET" >> "$log"; return 0; fi
    sleep 15
  done
  echo "$(ts) PRECONDITION-NOT-MET after 60 min" >> "$log"; return 3; }
sampler() { local log=$1; while true; do local v=$(vitest); echo "$(ts) load1=$(load1) power=$(power) batt=$(batt) thermal=$(thermal) vitest=$v" >> "$log"; [ "$v" != "0" ] && { echo "$(ts)"; pgrep -fl '[n]ode.*vitest' | cut -c1-200; } >> "$log.procs-scratch-only"; sleep 10; done; }
