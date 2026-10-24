# host precondition helpers. source me.
hostline() { echo "$(date -u +%H:%M:%SZ) ac=$(pmset -g batt | head -1 | grep -q 'AC Power' && echo AC || echo BATT) load1=$(sysctl -n vm.loadavg | awk '{print $2}') vitest=$(pgrep -f 'node.*vitest' | wc -l | tr -d ' ')"; }
hostok() { pmset -g batt | head -1 | grep -q 'AC Power' || return 1; awk -v l="$(sysctl -n vm.loadavg | awk '{print $2}')" 'BEGIN{exit !(l<=8)}' || return 1; [ "$(pgrep -f 'node.*vitest' | wc -l | tr -d ' ')" = 0 ] || return 1; return 0; }
# wait up to 60 min for the preconditions; log every poll. returns 1 if they never clear.
waitok() { local log=$1 i=0; while ! hostok; do echo "WAIT $(hostline) $(pgrep -fl 'node.*vitest' | head -1 | awk '{print $2,$3}' | sed 's#/Users/[^/]*/#~/#')" >> $log; i=$((i+1)); [ $i -gt 120 ] && { echo "NEVER-CLEARED $(hostline)" >> $log; return 1; }; sleep 30; done; echo "OK $(hostline)" >> $log; return 0; }
monitor() { while true; do echo "$(hostline)" >> $1; sleep 2; done; }
