#!/usr/bin/env bash
# qe-ABC-317 level session (sealed in the PREREG before any graded game). Model: qe-ABC-316's sealed session.sh (3fc10849)
# with five changes: L is 3 or 4; E is an argument, so a band step needs no script copy; the session itself refuses an
# <out> inside <repo> (each level starts alone, with no stage-b.sh); the sampler counts games in r.pgn, not in the debug
# log; the disk gate is 1 536 MB (the clone is about 800 MB) and RUNAWAY is set for these levels' times.
#   CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> flock <scratch>/host-test.lock bash session.sh <L> <E> <out> <repo>
# L 3 (st 0.33 s) or 4 (st 1 s). E is the level's sealed E (3: 1890, 4: 2040), or a step E' sealed in a PREREG addendum
# on the Orchestrator's word; this script checks only E's form (a multiple of 10 from 1320 to 3190).
# <out> must not exist; its parent must; it must lie outside <repo>, this task's worktree (harness tools/ 6272e8d2).
# Order: gates (pins, trees, disk, W's class-and-count check) -> the level's r command once -> record check -> read.mjs.
# The sampler logs every 10 s by class and count only (hostcheck.sh); it never logs a command line.
# It stops ONLY its own processes, on THERMAL (median of the last 30 Tctl samples > 85 C) or RUNAWAY (the level's
# wall-time bound since launch). Either stop makes the reading VOID. A foreign process is never signalled.
# Exit: 0 read written, 2 usage, 3 gate miss, 4 WAIT, 5 VOID.
set -u
L=${1:-}; E=${2:-}; OUT=${3:-}; REPO=${4:-}; HERE=$(cd "$(dirname "$0")" && pwd)
SHA=b6366a79
USAGE="usage: session.sh <3|4> <E> <out> <repo>"
case "$L" in
  3) ST=330; RUNAWAY=13500 ;;   # 225 min: 5 min for the build plus 200 games at a mean of 200 plies at 0.33 s
  4) ST=1000; RUNAWAY=40300 ;;  # 672 min: the same at 1 s
  *) echo "$USAGE"; exit 2 ;;
esac
[[ "$E" =~ ^[1-3][0-9][0-9]0$ ]] && [ "$E" -ge 1320 ] && [ "$E" -le 3190 ] || { echo "$USAGE (E: a multiple of 10, 1320-3190)"; exit 2; }
[ -n "$OUT" ] && [ -n "$REPO" ] || { echo "$USAGE"; exit 2; }
[ -e "$OUT" ] && { echo "out exists"; exit 2; }
[ -d "$(dirname "$OUT")" ] || { echo "out's parent does not exist"; exit 2; }
case "$(realpath -m "$OUT")/" in "$(realpath "$REPO")"/*) echo "out lies inside the repo"; exit 2;; esac
S=$(awk -v m="$ST" 'BEGIN{print m/1000}')
LOG=$OUT.session.log
: "${CUTECHESS_CLI:?}"; : "${STOCKFISH:?}"
say() { echo "$(date -u +%FT%TZ) L$L E$E $*" | tee -a "$LOG"; }
: > "$LOG"
# Gate 1: pins (ABC-204), read here before any build; the tool only labels a mismatch.
[ "$(sha256sum < "$CUTECHESS_CLI" | cut -c1-64)" = dc77690113d9ae130f5d1b4c76fefb28f42620ac45a2bd4abb7dd8eb2154f40a ] || { say "GATE pin cutechess-cli: differs; no game"; exit 3; }
[ "$(sha256sum < "$STOCKFISH" | cut -c1-64)" = c78c22a924e8d452e1089ec8d47826f7a276aba69373185e82cbac4593e352d2 ] || { say "GATE pin stockfish: differs; no game"; exit 3; }
[ "$(sha256sum < "$REPO/tools/rating/openings.epd" | cut -c1-64)" = 0d7f7a72678cbf54c2c309dc5d664e7aac5de2c15bc54fe4247a437f51e82666 ] || { say "GATE pin openings: differs; no game"; exit 3; }
# Gate 2: trees. The read sha's src/ is the sealed one; the harness's tools/ is the sealed one; and the worktree's src/
# equals the read sha's, because the harness reads LEVELS (the level's st) from the worktree's src/levels.ts.
[ "$(git -C "$REPO" rev-parse "$SHA^{commit}:src")" = 21f3b3049d3293cb8b3fb917104749791b2fd9e2 ] || { say "GATE src tree: differs; no game"; exit 3; }
[ "$(git -C "$REPO" rev-parse HEAD:tools)" = 6272e8d2fa0b1d7d7a0589cc75cf71cd9778b63d ] || { say "GATE harness tools tree: differs; no game"; exit 3; }
[ "$(git -C "$REPO" rev-parse HEAD:src)" = 21f3b3049d3293cb8b3fb917104749791b2fd9e2 ] || { say "GATE worktree src tree: differs; no game"; exit 3; }
[ -z "$(git -C "$REPO" status --porcelain -- tools src)" ] || { say "GATE worktree tools/ or src/ not clean; no game"; exit 3; }
# Gate 3: space for one clone and the debug log, where <out> is written.
[ "$(df -Pm "$(dirname "$OUT")" | awk 'NR==2{print $4}')" -ge 1536 ] || { say "GATE free space under 1536 MB; no game"; exit 3; }
# Gate 4: W's check, by class and count only. Any foreign vitest, cutechess-cli or stockfish is a WAIT, not a read.
H=$(bash "$HERE/hostcheck.sh"); say "W-check $H"
case "$H" in *foreign_vitest=0\ foreign_cutechess=0\ foreign_stockfish=0\ *) ;; *) say "WAIT: foreign load at W's check; no game"; exit 4;; esac
tctl() { for h in /sys/class/hwmon/hwmon*; do [ "$(cat "$h/name")" = k10temp ] && { awk '{printf "%.1f", $1/1000}' "$h/temp1_input"; return; }; done; echo "?"; }
own() { ps -e -o pid=,ppid= | awk -v r="$1" '{p[$1]=$2} END{s[r]=1; c=1; while(c){c=0; for(k in p) if(!(k in s) && (p[k] in s)){s[k]=1; c=1}} for(k in s) print k}'; }
say "launch r $SHA skill=$L E=$E st=$S rounds=100 concurrency=1 runaway=${RUNAWAY}s"
cd "$REPO" || exit 2
node tools/rating/rating.ts r "$SHA" "$OUT" --skill "$L" --elo "$E" --rounds 100 --concurrency 1 > "$OUT.run.txt" 2>&1 &
TOOL=$!; T0=$(date +%s); STOP=""; temps=()
while kill -0 $TOOL 2>/dev/null; do
  sleep 10
  t=$(tctl); temps+=("$t"); [ ${#temps[@]} -gt 30 ] && temps=("${temps[@]: -30}")
  g=$(grep -c '^\[Event ' "$OUT/r.pgn" 2>/dev/null); g=${g:-0}
  el=$(( $(date +%s) - T0 ))
  echo "el=${el}s games=$g $(bash "$HERE/hostcheck.sh" "$TOOL")" >> "$OUT.sampler.log"
  med=$(printf '%s\n' "${temps[@]}" | grep -v '?' | sort -n | awk '{a[NR]=$1} END{if(NR) print a[int((NR+1)/2)]; else print 0}')
  if [ ${#temps[@]} -ge 30 ] && awk "BEGIN{exit !($med > 85)}"; then STOP="THERMAL median30=$med"; fi
  if [ $el -ge $RUNAWAY ]; then STOP="RUNAWAY ${RUNAWAY}s"; fi
  if [ -n "$STOP" ]; then say "STOP $STOP: SIGTERM to own process tree only"; kill -TERM $(own $TOOL | grep -vx "$TOOL") 2>/dev/null; kill -TERM $TOOL; break; fi
done
wait $TOOL; RC=$?
say "end r tool_exit=$RC stop=${STOP:-none}"
[ -n "$STOP" ] && { say "VOID by $STOP; no read"; exit 5; }
# Record check (reported; a miss is a validity miss in the PREREG): the control line and the level's tokens in cmd.txt.
CTRL="control: skytalix Skill Level=$L st=$S timemargin=50, stockfish st=$S timemargin=2000"
grep -qFx "$CTRL" "$OUT/machine.txt" && say "record machine.txt control line = sealed" || say "record machine.txt control line DIFFERS"
for tok in "st=$S timemargin=50 restart=on 'option.Skill Level=$L'" "st=$S timemargin=2000 restart=on" "option.UCI_Elo=$E" "-games 2 -rounds 100 -concurrency 1 -maxmoves 200"; do
  grep -qF -- "$tok" "$OUT/cmd.txt" && say "record cmd.txt has [$tok]" || say "record cmd.txt LACKS [$tok]"
done
node "$HERE/read.mjs" "$OUT" "$L" "$E" "$ST" > "$OUT.read.txt" 2>&1; say "end read rc=$?"
