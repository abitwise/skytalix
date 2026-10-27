#!/bin/bash
# qe-ABC-209: does the DELIVERED UCI entry point keep the table across two moves of one game? Spawns the entry point
# (src/uci.ts of a tree, or a built dist/uci.js) the way cutechess does (stdin lines, one process), book off, go depth 6
# (depth-limited: the counts are deterministic while depth 6 completes inside the 3 s level budget).
# P = one process: the opening, go; then the opening + m1 + r1, go (the second search, as in a game).
# Q = a fresh process: the opening + m1 + r1, go.   Kept table: P's second nodes != Q's.  Base: equal.
# usage: art.sh <label> <entry.js|.ts> ; r1 = g8f6 (a3.mts: the stored hash reply on opening 1)
set -u
L=$1; E=$2
F="rnbqk1nr/ppppppbp/6p1/8/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1"
pre=$'uci\nsetoption name OwnBook value false\nisready\n'
m1=$(printf '%sposition fen %s\ngo depth 6\nquit\n' "$pre" "$F" | node "$E" | grep '^bestmove' | awk '{print $2}')
P=$(printf '%sposition fen %s\ngo depth 6\nposition fen %s moves %s g8f6\ngo depth 6\nquit\n' "$pre" "$F" "$F" "$m1" | node "$E" | grep '^info depth' | tail -1)
Q=$(printf '%sposition fen %s moves %s g8f6\ngo depth 6\nquit\n' "$pre" "$F" "$m1" | node "$E" | grep '^info depth' | tail -1)
pn=$(echo "$P" | sed -E 's/.* nodes ([0-9]+).*/\1/'); qn=$(echo "$Q" | sed -E 's/.* nodes ([0-9]+).*/\1/')
pd=$(echo "$P" | awk '{print $3}'); qd=$(echo "$Q" | awk '{print $3}')
echo "$L m1=$m1 r1=g8f6 | second search in one process: depth $pd nodes $pn | fresh process: depth $qd nodes $qn | $([ "$pn" = "$qn" ] && echo "EQUAL (table not kept)" || echo "DIFFERS (table kept)")"
