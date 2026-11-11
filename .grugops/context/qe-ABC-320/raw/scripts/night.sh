#!/usr/bin/env bash
# qe-ABC-320 level-5 night session (sealed in the PREREG before any graded game). Model: qe-ABC-317's sealed session.sh
# (4d569d53). One night plays the level-5 reading in chunks of `r --rounds 5 --start S` (10 games, openings S..S+4),
# S = <first-start>, +5, +10, ... while the openings last and the 8 h guard allows.
#   CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> flock <scratch>/host-test.lock bash night.sh <E> <first-start> <out-root> <repo>
# E is the sealed E (2280) or a step E' sealed in a PREREG addendum; only its form is checked here (a multiple of 10,
# 1320-3190). <first-start> is 1 on night 1, and the `next start` this script wrote on the night before (1, 6, ..., 96).
# <out-root> must not exist; its parent must; it lies outside <repo>, this task's worktree.
# Order: gates (pins, trees, W's class-and-count check) -> for each chunk: the 8 h guard, the disk gate, the chunk's r
# command, the chunk check, its build clone deleted -> next-start -> rsum over the clean chunks -> read.mjs.
# The 8 h guard: a chunk is launched only if (seconds since this script started) + CHUNK_WORST <= CAP. CHUNK_WORST is
# 2 000 plies (10 games at a mean of 200 plies: the worst 10-game window in ABC-316's and ABC-317's 1 000 graded games
# was 1 969 plies) at 4.05 s a ply (st 4 s + skytalix's 50 ms margin), plus 300 s for the build and starts: 8 400 s.
# RUNAWAY is hard: at CAP (8 h since this script started) the sampler stops the running chunk. THERMAL as ABC-317.
# Either stop makes that chunk VOID: it is not pooled, and its first opening is the next start. The session stops.
# The sampler logs every 10 s by class and count only (hostcheck.sh); it never logs a command line. It signals only its
# own processes; a foreign process is never signalled.
# Exit: 0 night ended (guard or openings done), every chunk clean; 2 usage; 3 gate miss; 4 WAIT; 5 a chunk VOID
# (RUNAWAY or THERMAL); 6 a chunk not clean (tool exit, faults, state, depth guard or record check). 5 and 6 still pool
# the clean chunks before it, for the report.
set -u
T0=$(date +%s)
E=${1:-}; FIRST=${2:-}; ROOT=${3:-}; REPO=${4:-}; HERE=$(cd "$(dirname "$0")" && pwd)
SHA=cddd4df91d2932d31f37c6b2998e7eecbd9dcb1c   # v1.1.0
L=5; ST=4000; S=4; ROUNDS=5                    # LEVELS[5].budgetMs; 5 rounds = 10 games a chunk
CAP=28800; CHUNK_WORST=8400                    # 8 h; 2 000 plies x 4.05 s + 300 s
USAGE="usage: night.sh <E> <first-start 1|6|...|96> <out-root> <repo>"
[[ "$E" =~ ^[1-3][0-9][0-9]0$ ]] && [ "$E" -ge 1320 ] && [ "$E" -le 3190 ] || { echo "$USAGE (E: a multiple of 10, 1320-3190)"; exit 2; }
[[ "$FIRST" =~ ^[1-9][0-9]?$ ]] && [ $(( (FIRST - 1) % ROUNDS )) -eq 0 ] && [ "$FIRST" -le 96 ] || { echo "$USAGE (first-start: 1, 6, ..., 96)"; exit 2; }
[ -n "$ROOT" ] && [ -n "$REPO" ] && [ -d "$REPO" ] || { echo "$USAGE"; exit 2; }
[ -e "$ROOT" ] && { echo "out-root exists"; exit 2; }
[ -d "$(dirname "$ROOT")" ] || { echo "out-root's parent does not exist"; exit 2; }
case "$(realpath -m "$ROOT")/" in "$(realpath "$REPO")"/*) echo "out-root lies inside the repo"; exit 2;; esac
# The depth guard's depth at E: the harness's pickDepth (1 + int(level(E)), search.h:261-268 at sf_19); 6 at E 2280.
DEPTH=$(awk -v e="$E" 'BEGIN{x=(e-1320)/1870; l=((37.2473*x-40.8525)*x+22.2943)*x-0.311438; if(l<0)l=0; if(l>19)l=19; print 1+int(l)}')
: "${CUTECHESS_CLI:?}"; : "${STOCKFISH:?}"
mkdir "$ROOT" || exit 2
LOG=$ROOT/session.log
say() { echo "$(date -u +%FT%TZ) L$L E$E el=$(( $(date +%s) - T0 ))s $*" | tee -a "$LOG"; }
say "session start: first-start $FIRST, depth guard $DEPTH, cap ${CAP}s, chunk worst ${CHUNK_WORST}s, last launch at el <= $(( CAP - CHUNK_WORST ))s"
# Gate 1: pins (ABC-204), read here before any build; the tool only labels a mismatch.
[ "$(sha256sum < "$CUTECHESS_CLI" | cut -c1-64)" = dc77690113d9ae130f5d1b4c76fefb28f42620ac45a2bd4abb7dd8eb2154f40a ] || { say "GATE pin cutechess-cli: differs; no game"; exit 3; }
[ "$(sha256sum < "$STOCKFISH" | cut -c1-64)" = c78c22a924e8d452e1089ec8d47826f7a276aba69373185e82cbac4593e352d2 ] || { say "GATE pin stockfish: differs; no game"; exit 3; }
[ "$(sha256sum < "$REPO/tools/rating/openings.epd" | cut -c1-64)" = 0d7f7a72678cbf54c2c309dc5d664e7aac5de2c15bc54fe4247a437f51e82666 ] || { say "GATE pin openings: differs; no game"; exit 3; }
# Gate 2: trees. The read sha's src/ is v1.1.0's; the harness's tools/ is ABC-320's C1; the worktree's src/ equals the
# read sha's, because the harness reads LEVELS (the level's st) from the worktree's src/levels.ts.
[ "$(git -C "$REPO" rev-parse "$SHA^{commit}:src")" = b668b153ca68d06097ecbc9f3d6d867672d6bed2 ] || { say "GATE src tree: differs; no game"; exit 3; }
[ "$(git -C "$REPO" rev-parse HEAD:tools)" = 2ae53ab1a91b97058e7d31f662ad38d3d6ddedcd ] || { say "GATE harness tools tree: differs; no game"; exit 3; }
[ "$(git -C "$REPO" rev-parse HEAD:src)" = b668b153ca68d06097ecbc9f3d6d867672d6bed2 ] || { say "GATE worktree src tree: differs; no game"; exit 3; }
[ -z "$(git -C "$REPO" status --porcelain -- tools src)" ] || { say "GATE worktree tools/ or src/ not clean; no game"; exit 3; }
# Gate 3: W's check, by class and count only. Any foreign vitest, cutechess-cli or stockfish is a WAIT, not a read.
H=$(bash "$HERE/hostcheck.sh"); say "W-check $H"
case "$H" in *foreign_vitest=0\ foreign_cutechess=0\ foreign_stockfish=0\ *) ;; *) say "WAIT: foreign load at W's check; no game"; exit 4;; esac
tctl() { for h in /sys/class/hwmon/hwmon*; do [ "$(cat "$h/name")" = k10temp ] && { awk '{printf "%.1f", $1/1000}' "$h/temp1_input"; return; }; done; echo "?"; }
own() { ps -e -o pid=,ppid= | awk -v r="$1" '{p[$1]=$2} END{s[r]=1; c=1; while(c){c=0; for(k in p) if(!(k in s) && (p[k] in s)){s[k]=1; c=1}} for(k in s) print k}'; }
cd "$REPO" || exit 2
START=$FIRST; CLEAN=(); RC=0; temps=(); END_WHY=""
while :; do
  el=$(( $(date +%s) - T0 ))
  [ "$START" -gt 96 ] && { END_WHY="openings 1-100 done"; break; }
  [ $(( el + CHUNK_WORST )) -le "$CAP" ] || { END_WHY="8 h guard: el ${el}s + ${CHUNK_WORST}s > ${CAP}s"; break; }
  OUT=$ROOT/c$(printf %03d "$START")
  # Disk gate, per chunk: space for one clone and the debug log.
  [ "$(df -Pm "$ROOT" | awk 'NR==2{print $4}')" -ge 1536 ] || { say "GATE free space under 1536 MB before chunk $START; stop"; RC=3; END_WHY="disk"; break; }
  say "launch chunk start=$START openings $START-$(( START + ROUNDS - 1 )): r ${SHA:0:8} skill=$L E=$E st=$S rounds=$ROUNDS concurrency=1"
  node tools/rating/rating.ts r "$SHA" "$OUT" --skill "$L" --elo "$E" --rounds "$ROUNDS" --start "$START" --concurrency 1 > "$OUT.run.txt" 2>&1 &
  TOOL=$!; C0=$(date +%s); STOP=""
  while kill -0 $TOOL 2>/dev/null; do
    sleep 10
    t=$(tctl); temps+=("$t"); [ ${#temps[@]} -gt 30 ] && temps=("${temps[@]: -30}")
    g=$(grep -c '^\[Event ' "$OUT/r.pgn" 2>/dev/null); g=${g:-0}
    el=$(( $(date +%s) - T0 ))
    echo "el=${el}s chunk=$START games=$g $(bash "$HERE/hostcheck.sh" "$TOOL")" >> "$ROOT/sampler.log"
    med=$(printf '%s\n' "${temps[@]}" | grep -v '?' | sort -n | awk '{a[NR]=$1} END{if(NR) print a[int((NR+1)/2)]; else print 0}')
    if [ ${#temps[@]} -ge 30 ] && awk "BEGIN{exit !($med > 85)}"; then STOP="THERMAL median30=$med"; fi
    if [ $el -ge $CAP ]; then STOP="RUNAWAY ${CAP}s since session start"; fi
    if [ -n "$STOP" ]; then say "STOP $STOP: SIGTERM to own process tree only"; kill -TERM $(own $TOOL | grep -vx "$TOOL") 2>/dev/null; kill -TERM $TOOL; break; fi
  done
  wait $TOOL; TRC=$?
  say "end chunk start=$START tool_exit=$TRC stop=${STOP:-none} wall=$(( $(date +%s) - C0 ))s"
  # The chunk's build clone is deleted, clean or not (about 800 MB); the records stay.
  [ -d "$OUT/clone-skytalix" ] && rm -rf -- "$OUT/clone-skytalix" && say "chunk $START clone deleted"
  [ -n "$STOP" ] && { say "VOID chunk $START by $STOP; not pooled"; RC=5; END_WHY="VOID"; break; }
  # The chunk check: tool exit, summary, depth guard, record check. Any miss: not clean, the session stops.
  miss=""
  [ "$TRC" -eq 0 ] || miss="$miss tool_exit=$TRC"
  grep -q "^W/L/D: .*  games: $(( 2 * ROUNDS )) of $(( 2 * ROUNDS ))$" "$OUT/summary.txt" 2>/dev/null || miss="$miss games"
  grep -qx "faults: 0  unclassified: 0  move-cap draws: [0-9]*" "$OUT/summary.txt" 2>/dev/null || miss="$miss faults"
  grep -q "^stockfish depth guard: 0 of [0-9]* moves below depth $DEPTH$" "$OUT/summary.txt" 2>/dev/null || miss="$miss depth-guard"
  grep -q "^state: rating " "$OUT/summary.txt" 2>/dev/null || miss="$miss state"
  grep -qFx "control: skytalix Skill Level=$L st=$S timemargin=50, stockfish st=$S timemargin=2000" "$OUT/machine.txt" 2>/dev/null || miss="$miss control-line"
  grep -qFx "start: $START (openings $START–$(( START + ROUNDS - 1 )))" "$OUT/machine.txt" 2>/dev/null || miss="$miss start-line"
  for tok in "st=$S timemargin=50 restart=on 'option.Skill Level=$L'" "st=$S timemargin=2000 restart=on" "option.UCI_Elo=$E " "order=sequential start=$START -repeat -games 2 -rounds $ROUNDS -concurrency 1 -maxmoves 200"; do
    grep -qF -- "$tok" "$OUT/cmd.txt" 2>/dev/null || miss="$miss cmd[$tok]"
  done
  if [ -n "$miss" ]; then say "chunk $START NOT CLEAN:$miss; the session stops"; RC=6; END_WHY="not clean"; break; fi
  CLEAN+=("$OUT"); say "chunk $START clean: $(grep '^W/L/D' "$OUT/summary.txt")"
  START=$(( START + ROUNDS ))
done
say "session end: $END_WHY; clean chunks ${#CLEAN[@]} ($(( 2 * ROUNDS * ${#CLEAN[@]} )) games)"
echo "next start: $START" > "$ROOT/next-start"; say "next start: $START (night 2: night.sh $E $START <new out-root> <repo>)"
if [ ${#CLEAN[@]} -gt 0 ]; then
  node tools/rating/rating.ts rsum "${CLEAN[@]}" > "$ROOT/rsum.txt" 2>&1; say "end rsum rc=$?"
  node "$HERE/read.mjs" "$L" "$E" "$ST" "${CLEAN[@]}" > "$ROOT/read.txt" 2>&1; say "end read rc=$?"
fi
say "session exit $RC"
exit $RC
