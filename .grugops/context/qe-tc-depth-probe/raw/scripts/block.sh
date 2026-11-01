#!/usr/bin/env bash
# qe-tc-depth-probe block wrapper.  usage: block.sh <label> <outdir> <cap-s> -- <command...>
# 1. wait-clear: poll every 10 s; CLEAR once no foreign vitest ([/]vitest) has been seen for 120 s; give up after
#    1 800 s and proceed NOT-CLEAR. Logged, never killed.
# 2. Run the command in the background; a sampler logs tctl/freq/load1/vitest every 10 s to <outdir>/host.log and to
#    the probe-wide all-host.log; THERMAL STOP (SIGTERM to the command) when, with >= 30 probe-wide samples, the
#    Tctl median is above 85 C. A wall cap (<cap-s>) sends SIGTERM to the command (CAP).
# 3. Every 60 s, a busy scan: every process >= 50 % CPU (1 s top sample), owner=probe when its cwd is under PROBE_ROOT, else foreign.
set -u
PROBE_ROOT=${PROBE_ROOT:?set PROBE_ROOT}
label=$1; G=$2; cap=$3; shift 4
mkdir -p "$G"; B="$G/block.log"; HL="$G/host.log"; ALL="$(dirname "$G")/all-host.log"
tctl() { for h in /sys/class/hwmon/hwmon*; do [ "$(cat "$h/name")" = k10temp ] && awk '{printf "%.1f", $1/1000}' "$h/temp1_input" && return; done; echo "?"; }
freq() { cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_cur_freq | awk '{s+=$1; if($1>m)m=$1} END{printf "fmax=%d fmean=%d", m, s/NR}'; }
nv() { pgrep -f '[/]vitest' | wc -l; }
log() { echo "$* at=$(date -u +%FT%TZ) t=$(date +%s)" >> "$B"; }
log "wait-clear start label=$label load1=$(cut -d' ' -f1 /proc/loadavg) tctl=$(tctl) vitest=$(nv)"
t0=$(date +%s); lastseen=$t0; state=NOT-CLEAR
while :; do
  now=$(date +%s); v=$(nv)
  [ "$v" -gt 0 ] && lastseen=$now
  echo "wc at=$(date -u +%FT%TZ) vitest=$v load1=$(cut -d' ' -f1 /proc/loadavg) tctl=$(tctl)" >> "$G/waitclear.log"
  if [ "$v" -eq 0 ] && [ $((now - lastseen)) -ge 120 ]; then state=CLEAR; break; fi
  [ $((now - t0)) -ge 1800 ] && break
  sleep 10
done
log "wait-clear end state=$state waited_s=$(( $(date +%s) - t0 )) load1=$(cut -d' ' -f1 /proc/loadavg) tctl=$(tctl) vitest=$(nv)"
"$@" &
cmd=$!
log "block start label=$label pid=$cmd"
(
  n=0
  while kill -0 "$cmd" 2>/dev/null; do
    line="at=$(date -u +%FT%TZ) t=$(date +%s) label=$label tctl=$(tctl) $(freq) load1=$(cut -d' ' -f1 /proc/loadavg) vitest=$(nv)"
    echo "$line" >> "$HL"; echo "$line" >> "$ALL"
    read -r sn med < <(sed -n 's/.* tctl=\([0-9.]*\) .*/\1/p' "$ALL" | sort -n | awk '{v[NR]=$1} END{if(NR==0)print 0,0; else if(NR%2)print NR,v[(NR+1)/2]; else print NR,(v[NR/2]+v[NR/2+1])/2}')
    if [ "$sn" -ge 30 ] && awk -v m="$med" 'BEGIN{exit !(m>85)}'; then echo "THERMAL STOP median=$med samples=$sn at=$(date -u +%FT%TZ)" >> "$B"; kill -TERM "$cmd"; break; fi
    if [ $((n % 6)) -eq 0 ]; then
      top -b -n 2 -d 1 -w 512 | awk '/^top -/{it++} it==2 && $1 ~ /^[0-9]+$/ && $9+0 >= 50 {print $1, $9, $12}' | while read -r bp bc bn; do
        cwd=$(readlink "/proc/$bp/cwd" 2>/dev/null); case "$cwd" in "$PROBE_ROOT"*) own=probe ;; *) own=foreign ;; esac
        echo "busy at=$(date -u +%FT%TZ) pid=$bp pcpu=$bc comm=$bn owner=$own" >> "$G/busy.log"
      done
    fi
    n=$((n + 1)); sleep 10
  done
) &
sampler=$!
( sleep "$cap"; if kill -0 "$cmd" 2>/dev/null; then echo "CAP at=$(date -u +%FT%TZ) cap_s=$cap" >> "$B"; kill -TERM "$cmd"; fi ) &
capper=$!
wait "$cmd"; rc=$?
kill "$capper" 2>/dev/null; wait "$sampler" 2>/dev/null
log "block end label=$label rc=$rc wait_state=$state wall_s=$(( $(date +%s) - t0 ))"
exit $rc
