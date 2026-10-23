#!/bin/bash
# qe-read-ABC-202: the exact two pinned commands of ABC-202 (§ The pinned invocation), paths filled in,
# wrapped in a host logger and a wall-clock watchdog (bash poll loop; 75 min for M1, 20 min for M8(a)).
# The two cutechess-cli command lines below are the page's, byte for byte apart from the filled-in paths and one
# A2 spelling correction: `-debug` -> `-debug all`. Bare -debug aborts this Qt 6 build with
# 'Empty value for option "-debug"' (main.cpp:482-487 + matchparser.cpp:135-138). `all` also sends the
# engine UCI `debug on`, which skytalix ignores (src/uci-session.ts:383, D3; raw/debugcheck-*.out identical).
CC=/Users/olgeroeselg/Projects/others/cutechess/cutechess/build/cutechess-cli
NODE=/opt/homebrew/bin/node        # command -v node; node --version = v26.11.1
CL=/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe202/clone
R=/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe-read-ABC-202/.grugops/context/qe-read-ABC-202/raw
H="$R/host.log"

hostline() {
  printf '%s %s load1=%s thermal=%s power=%s foreign_vitest_procs=%s\n' \
    "$(date -u +%FT%TZ)" "$1" \
    "$(sysctl -n vm.loadavg | awk '{print $2}')" \
    "$(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}')" \
    "$(pmset -g batt | head -1 | sed "s/.*'\(.*\)'.*/\1/" | tr ' ' '_')" \
    "$(pgrep -f '/vitest' | wc -l | tr -d ' ')" >> "$H"
}

m1() {
"$CC" \
  -engine name=skytalix-a cmd="$NODE" arg="$CL/dist/uci.js" dir="$CL" stderr="$R/m1-a.stderr" \
  -engine name=skytalix-b cmd="$NODE" arg="$CL/dist/uci.js" dir="$CL" stderr="$R/m1-b.stderr" \
  -each proto=uci tc=60+1 \
  -openings file="$R/m1-perft.epd" format=epd order=sequential \
  -rounds 6 -games 1 -concurrency 1 -maxmoves 200 \
  -pgnout "$R/m1.pgn" -debug all \
  > "$R/m1.out" 2>&1
}

m8a() {
"$CC" \
  -engine name=skytalix-a cmd="$NODE" arg="$CL/dist/uci.js" dir="$CL" stderr="$R/m8a-a.stderr" \
  -engine name=skytalix-b cmd="$NODE" arg="$CL/dist/uci.js" dir="$CL" stderr="$R/m8a-b.stderr" \
  -each proto=uci tc=inf depth=4 \
  -rounds 1 -games 2 -concurrency 1 -maxmoves 200 \
  -pgnout "$R/m8a.pgn" -debug all \
  > "$R/m8a.out" 2>&1
}

# watch <label> <limit-seconds> <outfile> <function>
watch() {
  local label=$1 limit=$2 out=$3 fn=$4
  local start now games=0 n last_sample
  start=$(date +%s); last_sample=$start
  echo "$(date -u +%FT%TZ) $label start" >> "$H"
  $fn &
  local pid=$!
  while kill -0 "$pid" 2>/dev/null; do
    sleep 5
    now=$(date +%s)
    n=$(grep -c 'Finished game' "$out" 2>/dev/null || true); n=${n:-0}
    if [ "$n" -gt "$games" ]; then games=$n; hostline "$label after-game-$n"; last_sample=$now; fi
    if [ $((now - last_sample)) -ge 60 ]; then hostline "$label periodic"; last_sample=$now; fi
    if [ $((now - start)) -ge "$limit" ]; then
      echo "$(date -u +%FT%TZ) $label WATCHDOG FIRED at $((now - start)) s; killing pid $pid" >> "$H"
      kill "$pid" 2>/dev/null; sleep 2; pkill -f "$CL/dist/uci.js"; break
    fi
  done
  wait "$pid"; local rc=$?
  now=$(date +%s)
  echo "$(date -u +%FT%TZ) $label end rc=$rc wall_s=$((now - start))" >> "$H"
}

: > "$H"
hostline "before-M1"
watch M1 4500 "$R/m1.out" m1
hostline "after-M1"
watch M8a 1200 "$R/m8a.out" m8a
hostline "after-M8a"
