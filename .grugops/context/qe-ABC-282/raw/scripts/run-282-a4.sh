#!/usr/bin/env bash
# qe-ABC-282 A4 harness: ABC-282 A4 (ADR-0071 D11), EPIC-009's M1 and M2 on W1's build. It is qe-ABC-223's run-223.sh; the
# game command, openings, coverage extension, watchdog, thermal stop and foreign scan are unchanged. Changes, all outside
# the game command: (1) TC / MAXMOVES / WALL_S / CLEAR_S read from the environment, defaults = the read, so the rehearsal
# runs THIS script; (2) wait-clear runs here, inside the lock hold; (3) a wall stop at WALL_S from game 1's start;
# (4) free space on /tmp and on the output's filesystem, and a real write probe of each, before game 1 and every 60 s
# (QE-282-b: on /tmp a write can leave 0 bytes and exit 0); (5) line and byte counts of each game's log, and a log under
# 10 lines counts as dead; (6) it refuses an out dir that already holds a game; (7) a TERM stops this run's own game.
# It runs under ONE `flock <scratch>/host-test.lock`, launched by the agent's background runner, not `setsid -f`.
# Tool paths come from the env file given as $1 (outside the repo, mode 600); no path is written to a record.
#   usage: [TC=..] [MAXMOVES=..] [WALL_S=..] [CLEAR_S=..] run-282-a4.sh <tools.env> <clone> <out>
set -u
envf=$1; CL=$2; G=$3
TC=${TC:-40/900}; MAXMOVES=${MAXMOVES:-80}; WALL_S=${WALL_S:-16200}; CLEAR_S=${CLEAR_S:-900}
HERE=$(cd "$(dirname "$0")" && pwd); TMPP=$(dirname "$envf")/.a4-probe
set -a; . "$envf"; set +a
NODE=$(command -v node)
mkdir -p "$G"
if ls "$G"/g[0-9][0-9].log >/dev/null 2>&1; then echo "refused: out dir already holds a game" >&2; exit 9; fi
H="$G/harness.log"; T="$G/thermal.log"; F="$G/foreign.log"
tctl() { for h in /sys/class/hwmon/hwmon*; do [ "$(cat "$h/name")" = k10temp ] && awk '{printf "%.1f", $1/1000}' "$h/temp1_input" && return; done; echo "?"; }
freq() { cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_cur_freq | awk '{s+=$1; if($1>m)m=$1} END{printf "fmax=%d fmean=%d", m, s/NR}'; }
foreign() { echo "vitest=$(pgrep -f '[/]vitest' | wc -l) cutechess=$(pgrep -x cutechess-cli | wc -l)"; }
sample() { echo "at=$(date -u +%FT%TZ) t=$(date +%s) tctl=$(tctl) $(freq) load1=$(cut -d' ' -f1 /proc/loadavg) $(foreign)" >> "$T"; }
# Every vitest (pid, parent, repo = skytalix or other, by its working directory's name; no path is written), and every
# process at >= 50 % of a core over a 1 s top sample that is not one of this run's engines or cutechess-cli.
foreign_scan() {
  local at now p cwd repo eng
  at=$(date -u +%FT%TZ); now=$(date +%s)
  for p in $(pgrep -f '[/]vitest'); do
    cwd=$(readlink "/proc/$p/cwd" 2>/dev/null); case "$cwd" in *skytalix*) repo=skytalix ;; *) repo=other ;; esac
    echo "at=$at t=$now vitest pid=$p ppid=$(ps -o ppid= -p "$p" | tr -d ' ') etimes=$(ps -o etimes= -p "$p" | tr -d ' ') repo=$repo" >> "$F"
  done
  eng=" $(pgrep -f "$CL/dist/uci.js" | tr '\n' ' ') $(pgrep -x cutechess-cli | tr '\n' ' ') "
  top -b -n 2 -d 1 -w 512 | awk -v e="$eng" -v at="$at" -v t="$now" '
    /^top -/ {it++} it==2 && $1 ~ /^[0-9]+$/ && $9+0 >= 50 && index(e, " " $1 " ") == 0 {print "at=" at " t=" t " busy pid=" $1 " pcpu=" $9 " comm=" $12}' >> "$F"
}
# Free MB and a real write of each filesystem; prints the fields, returns 1 when the output's probe fails.
probe() { local f=$1; printf 'probe\n' > "$f" 2>/dev/null; if [ -s "$f" ]; then rm -f "$f"; echo ok; else rm -f "$f" 2>/dev/null; echo FAIL; fi; }
space() {
  local tp op; tp=$(probe "$TMPP"); op=$(probe "$G/.a4-probe")
  echo "tmp_used_mb=$(df -BM --output=used /tmp | tail -1 | tr -dc 0-9) tmp_avail_mb=$(df -BM --output=avail /tmp | tail -1 | tr -dc 0-9) tmp_probe=$tp out_avail_mb=$(df -BM --output=avail "$G" | tail -1 | tr -dc 0-9) out_probe=$op"
  [ "$op" = ok ]
}
( while :; do sample; sleep 10; done ) &
sampler=$!
trap 'kill $sampler 2>/dev/null' EXIT
log() { echo "$* at=$(date -u +%FT%TZ) t=$(date +%s)" >> "$H"; }
log "session start harness_pid=$$ ppid=$PPID ppid_comm=$(ps -o comm= -p "$PPID") sid=$(ps -o sid= -p $$ | tr -d ' ') load1=$(cut -d' ' -f1 /proc/loadavg) tctl=$(tctl) $(foreign)"
sp=$(space); sprc=$?
log "space $sp"
case "$sp" in *tmp_probe=FAIL*) sprc=1 ;; esac
if [ "$sprc" -ne 0 ] || [ "$(echo "$sp" | sed 's/.*tmp_avail_mb=\([0-9]*\).*/\1/')" -lt 1024 ]; then log "session end status=no_space games=0"; exit 7; fi
if [ "$CLEAR_S" -gt 0 ]; then bash "$HERE/wait-clear.sh" "$G/precheck.log" "$CLEAR_S"; log "wait-clear rc=$?"; fi
foreign_scan

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

n=0; periods=0; status=done; play0=$(date +%s); cc=
trap 'log "harness TERM"; [ -n "$cc" ] && kill -TERM "$cc" 2>/dev/null; pkill -TERM -f "$CL/dist/uci.js"; log "session end status=term games=$n side_periods=$periods"; exit 143' TERM
while :; do
  n=$((n + 1))
  if [ "$n" -gt 5 ] && { [ "$periods" -ge 4 ] || [ "$n" -gt 10 ]; }; then n=$((n - 1)); break; fi
  g=$(printf 'g%02d' "$n")
  log "game $n start opening=$n tctl=$(tctl) load1=$(cut -d' ' -f1 /proc/loadavg) $(foreign)"
  args=(
    -engine name=skytalix-a cmd="$NODE" arg="$CL/dist/uci.js" dir="$CL" stderr="$G/$g-a.stderr"
    -engine name=skytalix-b cmd="$NODE" arg="$CL/dist/uci.js" dir="$CL" stderr="$G/$g-b.stderr"
    -each proto=uci "tc=$TC" timemargin=0 restart=on option.OwnBook=true option.TimeMode=uci-clock-mode
    -openings file="$CL/tools/rating/openings.epd" format=epd order=sequential start="$n"
    -games 1 -rounds 1 -concurrency 1 -maxmoves "$MAXMOVES"
    -pgnout "$G/$g.pgn" -debug all
  )
  printf '%q ' "$CUTECHESS_CLI" "${args[@]}" >> "$G/argv.local"; echo >> "$G/argv.local"
  "$CUTECHESS_CLI" "${args[@]}" > "$G/$g.log" 2>&1 &
  cc=$!
  t0=$(date +%s); last=0; stopped=0
  while kill -0 "$cc" 2>/dev/null; do
    sleep 10
    now=$(date +%s)
    if [ $((now - last)) -ge 60 ]; then
      last=$now
      foreign_scan
      read -r sn med mx < <(thermal_check)
      sp=$(space); sprc=$?
      log "watch game=$n samples=$sn tctl_median=$med tctl_max=$mx load1=$(cut -d' ' -f1 /proc/loadavg) $(foreign) log_bytes=$(stat -c %s "$G/$g.log") $sp"
      if [ "$sprc" -ne 0 ]; then
        log "OUT WRITE FAIL game=$n"
        kill -TERM "$cc"; pkill -TERM -f "$CL/dist/uci.js"; stopped=4; break
      fi
      if [ "$sn" -ge 30 ] && awk -v m="$med" 'BEGIN{exit !(m>85)}'; then
        log "THERMAL STOP game=$n median=$med samples=$sn"
        kill -TERM "$cc"; pkill -TERM -f "$CL/dist/uci.js"; stopped=1; break
      fi
    fi
    if [ $((now - play0)) -ge "$WALL_S" ]; then
      log "WALL STOP game=$n wall_s=$((now - play0))"
      kill -TERM "$cc"; pkill -TERM -f "$CL/dist/uci.js"; stopped=3; break
    fi
    if [ $((now - t0)) -ge 5400 ]; then
      log "WATCHDOG game=$n wall_s=$((now - t0)): stall, killed"
      kill -TERM "$cc"; pkill -TERM -f "$CL/dist/uci.js"; stopped=2; break
    fi
  done
  wait "$cc"; rc=$?; cc=
  fin=$(grep -c '^Finished match' "$G/$g.log")
  res=$(grep -m1 '^Finished game' "$G/$g.log" | sed 's/^Finished game [0-9]* //')
  lines=$(wc -l < "$G/$g.log"); pgnb=$(stat -c %s "$G/$g.pgn" 2>/dev/null || echo 0)
  log "game $n end rc=$rc finished_match=$fin wall_s=$(( $(date +%s) - t0 )) log_lines=$lines pgn_bytes=$pgnb result=[$res]"
  if [ "$stopped" = 1 ]; then status=thermal_stop; break; fi
  if [ "$stopped" = 2 ]; then status=stall; break; fi
  if [ "$stopped" = 3 ]; then status=wall_stop; break; fi
  if [ "$stopped" = 4 ]; then status=out_write_fail; break; fi
  if [ "$rc" -ne 0 ] || [ "$fin" -ne 1 ] || [ ! -s "$G/$g.pgn" ] || [ "$lines" -lt 10 ]; then status=died; break; fi
  p=$(periods_in "$G/$g.pgn"); periods=$((periods + p))
  log "game $n side_periods=$p total_side_periods=$periods"
done
foreign_scan
log "session end status=$status games=$n side_periods=$periods load1=$(cut -d' ' -f1 /proc/loadavg) tctl=$(tctl) $(foreign)"
case $status in done) exit 0 ;; thermal_stop) exit 4 ;; stall) exit 5 ;; wall_stop) exit 6 ;; out_write_fail) exit 8 ;; *) exit 3 ;; esac
