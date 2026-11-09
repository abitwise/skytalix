#!/usr/bin/env bash
# qe-ABC-295 R2 session (sealed in the PREREG before any game). The whole session holds the host lock once:
#   CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> flock <scratch>/<home>/<repo>/host-test.lock bash session.sh <out> <repo>
# <out> must not exist yet and must lie outside <repo>; <repo> is this task's worktree (harness tools/ c361f429).
# Order: gates (pins, trees, disk, W's class-and-count check) -> the R2 command once -> G11 -> read.mjs.
# The sampler logs every 10 s by class and count only (hostcheck.sh); it never logs a command line.
# It stops ONLY its own processes, on THERMAL (median of the last 30 Tctl samples > 85 C) or RUNAWAY (90 min of
# wall time since launch). Either stop makes the reading VOID. A foreign process is never signalled.
set -u
OUT=$1; REPO=$2; HERE=$(cd "$(dirname "$0")" && pwd)
SHA=e069b49a; E=1810
LOG=$OUT.session.log
: "${CUTECHESS_CLI:?}"; : "${STOCKFISH:?}"
say() { echo "$(date -u +%FT%TZ) $*" | tee -a "$LOG"; }
[ -e "$OUT" ] && { echo "out exists"; exit 2; }
: > "$LOG"
# Gate 1: pins (ABC-204), read here before any build; the tool only labels a mismatch.
[ "$(sha256sum < "$CUTECHESS_CLI" | cut -c1-64)" = dc77690113d9ae130f5d1b4c76fefb28f42620ac45a2bd4abb7dd8eb2154f40a ] || { say "GATE pin cutechess-cli: differs; no game"; exit 3; }
[ "$(sha256sum < "$STOCKFISH" | cut -c1-64)" = c78c22a924e8d452e1089ec8d47826f7a276aba69373185e82cbac4593e352d2 ] || { say "GATE pin stockfish: differs; no game"; exit 3; }
# Gate 2: trees. The read sha's src/ and the harness's tools/ are the sealed ones.
[ "$(git -C "$REPO" rev-parse "$SHA^{commit}:src")" = bba42fb7a8f613ee7947ddf9d570140cd4bd7f8e ] || { say "GATE src tree: differs; no game"; exit 3; }
[ "$(git -C "$REPO" rev-parse HEAD:tools)" = c361f4292bf2f6cdb92432c61df668b5333b3072 ] || { say "GATE harness tools tree: differs; no game"; exit 3; }
# Gate 3: /tmp space for one clone and the debug log.
[ "$(df -Pm /tmp | awk 'NR==2{print $4}')" -ge 1024 ] || { say "GATE /tmp free under 1024 MB; no game"; exit 3; }
# Gate 4: W's check, by class and count only. Any foreign vitest, cutechess-cli or stockfish is a WAIT, not a read.
H=$(bash "$HERE/hostcheck.sh"); say "W-check $H"
case "$H" in *foreign_vitest=0\ foreign_cutechess=0\ foreign_stockfish=0\ *) ;; *) say "WAIT: foreign load at W's check; no game"; exit 4;; esac
tctl() { for h in /sys/class/hwmon/hwmon*; do [ "$(cat "$h/name")" = k10temp ] && { awk '{printf "%.1f", $1/1000}' "$h/temp1_input"; return; }; done; echo "?"; }
own() { ps -e -o pid=,ppid= | awk -v r="$1" '{p[$1]=$2} END{s[r]=1; c=1; while(c){c=0; for(k in p) if(!(k in s) && (p[k] in s)){s[k]=1; c=1}} for(k in s) print k}'; }
say "launch r $SHA E=$E budget-ms=100 rounds=100 concurrency=1"
cd "$REPO" || exit 2
node tools/rating/rating.ts r "$SHA" "$OUT" --elo "$E" --budget-ms 100 --rounds 100 --concurrency 1 > "$OUT.run.txt" 2>&1 &
TOOL=$!; T0=$(date +%s); STOP=""; temps=()
while kill -0 $TOOL 2>/dev/null; do
  sleep 10
  t=$(tctl); temps+=("$t"); [ ${#temps[@]} -gt 30 ] && temps=("${temps[@]: -30}")
  g=$(grep -c '^Finished game' "$OUT/r.out" 2>/dev/null || echo 0)
  el=$(( $(date +%s) - T0 ))
  echo "el=${el}s games=$g $(bash "$HERE/hostcheck.sh" "$TOOL")" >> "$OUT.sampler.log"
  med=$(printf '%s\n' "${temps[@]}" | grep -v '?' | sort -n | awk '{a[NR]=$1} END{if(NR) print a[int((NR+1)/2)]; else print 0}')
  if [ ${#temps[@]} -ge 30 ] && awk "BEGIN{exit !($med > 85)}"; then STOP="THERMAL median30=$med"; fi
  if [ $el -ge 5400 ]; then STOP="RUNAWAY 90 min"; fi
  if [ -n "$STOP" ]; then say "STOP $STOP: SIGTERM to own process tree only"; kill -TERM $(own $TOOL | grep -vx "$TOOL") 2>/dev/null; kill -TERM $TOOL; break; fi
done
wait $TOOL; RC=$?
say "end r tool_exit=$RC stop=${STOP:-none}"
[ -n "$STOP" ] && { say "VOID by $STOP; no G11, no read"; exit 5; }
# G11 (reported, not graded): one fresh process per position, on the read sha's src/ (the tool's own clone).
while IFS= read -r line; do
  b=$(node -e 'console.log(JSON.parse(process.argv[1]).before)' "$line"); f=$(node -e 'console.log(JSON.parse(process.argv[1]).fen)' "$line")
  node "$HERE/g11.mjs" "$OUT/clone-skytalix" "$b" "$f" >> "$OUT.g11.jsonl" 2>&1 || say "G11 $b failed (reported UNKNOWN - verify; validity unaffected)"
done < "$HERE/g11-fens.jsonl"
say "end g11"
node "$HERE/read.mjs" "$OUT" > "$OUT.read.txt" 2>&1; say "end read rc=$?"
