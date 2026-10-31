#!/usr/bin/env bash
# qe-ABC-222 harness: the ABC-222 smoke reading of `simple-tournament` at tc=40/900, one cutechess-cli 1.5.1
# invocation per game (openings 1..5 of tools/rating/openings.epd, then 6, 7, ... up to 10 only while fewer than
# 4 side-periods are complete), width 1, ALONE. A sampler logs Tctl (k10temp) and the CPU frequency every 10 s.
# A watcher stops the run if, with >= 30 samples, the Tctl median over all samples so far is above 85 C
# (THERMAL STOP). A game still running after 5 400 s is killed as a stall (a named fault) and the run stops.
# Tool paths come from the env file given as $1 (outside the repo, mode 600); no path is written to a record.
#   usage: run-222.sh <tools.env> <clone> <out>
set -u
envf=$1; CL=$2; G=$3
set -a; . "$envf"; set +a
NODE=$(command -v node)
mkdir -p "$G"
H="$G/harness.log"; T="$G/thermal.log"
tctl() { for h in /sys/class/hwmon/hwmon*; do [ "$(cat "$h/name")" = k10temp ] && awk '{printf "%.1f", $1/1000}' "$h/temp1_input" && return; done; echo "?"; }
freq() { cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_cur_freq | awk '{s+=$1; if($1>m)m=$1} END{printf "fmax=%d fmean=%d", m, s/NR}'; }
foreign() { echo "vitest=$(pgrep -f '[/]vitest' | wc -l) cutechess=$(pgrep -x cutechess-cli | wc -l)"; }
sample() { echo "at=$(date -u +%FT%TZ) t=$(date +%s) tctl=$(tctl) $(freq) load1=$(cut -d' ' -f1 /proc/loadavg) $(foreign)" >> "$T"; }
( while :; do sample; sleep 10; done ) &
sampler=$!
trap 'kill $sampler 2>/dev/null' EXIT
log() { echo "$* at=$(date -u +%FT%TZ) t=$(date +%s)" >> "$H"; }
log "session start load1=$(cut -d' ' -f1 /proc/loadavg) tctl=$(tctl) $(foreign)"

thermal_check() {  # prints "n median max"
  sed -n 's/.* tctl=\([0-9.]*\) .*/\1/p' "$T" | sort -n | awk '{v[NR]=$1} END{if(NR==0){print 0,0,0}else if(NR%2){print NR, v[(NR+1)/2], v[NR]}else{print NR, (v[NR/2]+v[NR/2+1])/2, v[NR]}}'
}

# side-periods completed in one PGN: white moves = ceil(ply/2) when the FEN has white to move, else floor(ply/2)
periods_in() {
  local pgn=$1 ply stm w b
  ply=$(sed -n 's/^\[PlyCount "\([0-9]*\)"\]/\1/p' "$pgn"); ply=${ply:-0}
  stm=$(sed -n 's/^\[FEN "[^ ]* \([wb]\) .*/\1/p' "$pgn")
  if [ "$stm" = b ]; then w=$(( ply / 2 )); b=$(( (ply + 1) / 2 )); else w=$(( (ply + 1) / 2 )); b=$(( ply / 2 )); fi
  echo $(( w / 40 + b / 40 ))
}

n=0; periods=0; status=done
while :; do
  n=$((n + 1))
  if [ "$n" -gt 5 ] && { [ "$periods" -ge 4 ] || [ "$n" -gt 10 ]; }; then n=$((n - 1)); break; fi
  g=$(printf 'g%02d' "$n")
  log "game $n start opening=$n tctl=$(tctl) load1=$(cut -d' ' -f1 /proc/loadavg) $(foreign)"
  "$CUTECHESS_CLI" \
    -engine name=skytalix-a cmd="$NODE" arg="$CL/dist/uci.js" dir="$CL" stderr="$G/$g-a.stderr" \
    -engine name=skytalix-b cmd="$NODE" arg="$CL/dist/uci.js" dir="$CL" stderr="$G/$g-b.stderr" \
    -each proto=uci tc=40/900 timemargin=0 restart=on option.OwnBook=true option.TimeMode=simple-tournament \
    -openings file="$CL/tools/rating/openings.epd" format=epd order=sequential start="$n" \
    -games 1 -rounds 1 -concurrency 1 -maxmoves 80 \
    -pgnout "$G/$g.pgn" -debug all > "$G/$g.log" 2>&1 &
  cc=$!
  t0=$(date +%s); last=0; stopped=0
  while kill -0 "$cc" 2>/dev/null; do
    sleep 10
    now=$(date +%s)
    if [ $((now - last)) -ge 60 ]; then
      last=$now
      read -r sn med mx < <(thermal_check)
      log "watch game=$n samples=$sn tctl_median=$med tctl_max=$mx load1=$(cut -d' ' -f1 /proc/loadavg) $(foreign)"
      if [ "$sn" -ge 30 ] && awk -v m="$med" 'BEGIN{exit !(m>85)}'; then
        log "THERMAL STOP game=$n median=$med samples=$sn"
        kill -TERM "$cc"; pkill -TERM -f "$CL/dist/uci.js"; stopped=1; break
      fi
    fi
    if [ $((now - t0)) -ge 5400 ]; then
      log "WATCHDOG game=$n wall_s=$((now - t0)): stall, killed"
      kill -TERM "$cc"; pkill -TERM -f "$CL/dist/uci.js"; stopped=2; break
    fi
  done
  wait "$cc"; rc=$?
  fin=$(grep -c '^Finished match' "$G/$g.log")
  res=$(grep -m1 '^Finished game' "$G/$g.log" | sed 's/^Finished game [0-9]* //')
  log "game $n end rc=$rc finished_match=$fin wall_s=$(( $(date +%s) - t0 )) result=[$res]"
  if [ "$stopped" = 1 ]; then status=thermal_stop; break; fi
  if [ "$stopped" = 2 ]; then status=stall; break; fi
  if [ "$rc" -ne 0 ] || [ "$fin" -ne 1 ] || [ ! -s "$G/$g.pgn" ]; then status=died; break; fi
  p=$(periods_in "$G/$g.pgn"); periods=$((periods + p))
  log "game $n side_periods=$p total_side_periods=$periods"
done
log "session end status=$status games=$n side_periods=$periods load1=$(cut -d' ' -f1 /proc/loadavg) tctl=$(tctl) $(foreign)"
case $status in done) exit 0 ;; thermal_stop) exit 4 ;; stall) exit 5 ;; *) exit 3 ;; esac
