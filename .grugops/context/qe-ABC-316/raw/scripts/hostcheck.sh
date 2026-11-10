#!/usr/bin/env bash
# qe-ABC-295 host check (sealed in the PREREG before any game). Prints ONE line: UTC time, load1, Tctl, /tmp free,
# and foreign load BY CLASS AND COUNT ONLY. It never prints, logs or stores a command line, a pid, a user or a path:
# a foreign command line can carry credentials. It never signals any process.
# Classes: vitest (any process whose argv holds "/vitest"), cutechess-cli, stockfish, node (exact process names).
# usage: bash hostcheck.sh [exclude-root-pid]   (descendants of the given pid, and this script, are not foreign)
set -u
ROOT=${1:-$$}
tctl() { for h in /sys/class/hwmon/hwmon*; do [ "$(cat "$h/name")" = k10temp ] && { awk '{printf "%.1f", $1/1000}' "$h/temp1_input"; return; }; done; echo "?"; }
mine() { ps -e -o pid=,ppid= | awk -v r1="$ROOT" -v r2="$$" '{p[$1]=$2} END{s[r1]=1; s[r2]=1; c=1; while(c){c=0; for(k in p) if(!(k in s) && (p[k] in s)){s[k]=1; c=1}} for(k in s) print k}'; }
M=$(mine)
count() { pgrep "$@" | grep -vxF -f <(printf '%s\n' "$M") | wc -l; }
echo "$(date -u +%FT%TZ) load1=$(cut -d' ' -f1 /proc/loadavg) tctl=$(tctl) tmp_free_mb=$(df -Pm /tmp | awk 'NR==2{print $4}') foreign_vitest=$(count -f '/vitest') foreign_cutechess=$(count -x cutechess-cli) foreign_stockfish=$(count -x stockfish) foreign_node=$(count -x node)"
