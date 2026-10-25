# shared host probes (ABC-204 QE driver.sh, the AC gate removed: power is logged only, owner word …10e61802)
ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }
load1() { sysctl -n vm.loadavg | awk '{print $2}'; }
power() { pmset -g ps | head -1 | sed -E "s/.*'(.*)'.*/\1/" | tr ' ' _; }
batt() { pmset -g ps | sed -n 2p | grep -oE '[0-9]+%' | head -1; }
thermal() { notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}'; }
vitest() { pgrep -f 'node.*vitest' | wc -l | tr -d ' '; }
# wait for load1 <= 8 and no node.*vitest: poll every 15 s, windows of 60 min, at most 3 windows (a pause, never a re-run)
wait_pre() { local log=$1 i
  for i in $(seq 1 720); do
    local l=$(load1) p=$(power) v=$(vitest) t=$(thermal)
    echo "$(ts) wait poll=$i load1=$l power=$p batt=$(batt) vitest=$v thermal=$t" >> "$log"
    if [ "$v" = "0" ] && awk -v l="$l" 'BEGIN{exit !(l<=8)}'; then echo "$(ts) PRECONDITIONS-MET" >> "$log"; return 0; fi
    sleep 15
  done
  echo "$(ts) PRECONDITION-NOT-MET after 180 min" >> "$log"; return 3; }
sampler() { local log=$1; while true; do echo "$(ts) load1=$(load1) power=$(power) batt=$(batt) thermal=$(thermal) vitest=$(vitest)" >> "$log"; sleep 10; done; }
