#!/bin/bash
# usage: bt1.sh <worktree> <lichess file> <out dir> <lock>. B-T1: extract only (identity gate on the full set at the base values). No fit, no emit.
W=$1; LI=$2; O=$3; L=$4; rm -rf "$O"; mkdir -p "$O"; cd "$W"
flock "$L" timeout 1800 node --max-old-space-size=3000 tools/tune/tune.ts extract "$O" --lichess "$LI" > "$O.log" 2>&1
echo "exit=$?" >> "$O.log"
