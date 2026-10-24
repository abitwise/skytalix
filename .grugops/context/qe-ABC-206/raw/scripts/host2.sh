# like host.sh, but my own vitest (wt-qe-ABC-206 / qe206 paths, or a child of my run) is not foreign.
MYPAT='wt-qe-ABC-206|qe206'
fv() { local n=0; for pid in $(pgrep -f 'node.*vitest'); do c=$(ps -o command= -p $pid 2>/dev/null); cwd=$(lsof -a -p $pid -d cwd -Fn 2>/dev/null | grep '^n' | cut -c2-); echo "$c $cwd" | grep -qE "$MYPAT" || n=$((n+1)); done; echo $n; }
hostline() { echo "$(date -u +%H:%M:%SZ) ac=$(pmset -g batt | head -1 | grep -q 'AC Power' && echo AC || echo BATT) load1=$(sysctl -n vm.loadavg | awk '{print $2}') vitest=$(fv)"; }
hostok() { pmset -g batt | head -1 | grep -q 'AC Power' || return 1; awk -v l="$(sysctl -n vm.loadavg | awk '{print $2}')" 'BEGIN{exit !(l<=8)}' || return 1; [ "$(fv)" = 0 ] || return 1; return 0; }
waitok() { local log=$1 i=0; while ! hostok; do echo "WAIT $(hostline)" >> $log; i=$((i+1)); [ $i -gt 120 ] && { echo "NEVER-CLEARED $(hostline)" >> $log; return 1; }; sleep 30; done; echo "OK $(hostline)" >> $log; return 0; }
