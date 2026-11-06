#!/bin/bash
# qe-ABC-291 timing stage, the RUNNER reread.sh calls inside its one hold, after its five clear samples. K4, K5, NFR-008 in that order, then the two timed PR10 reports, nothing else.
# A K4 above 1.03 or a clean K5 below depth 6 stops the hold: nothing after it runs. usage: stage-a.sh <arms dir> <out dir> <rows: any of k4 k5 n8 r10, comma-separated>.
# Env QE=<qe scratch>, PGN=<the sealed pgn>.
A=$1; O=$2; ROWS=${3:-k4,k5,n8,r10}; HERE=$(cd "$(dirname "$0")" && pwd)
mkdir -p "$O"; S() { echo "$(date -u +%FT%TZ) load1 $(cut -d' ' -f1 /proc/loadavg) $*" >> "$O/stage.txt"; }
samp() { "$HERE/fsample.sh" "$A" "$1" & SP=$!; }
trap '[ -n "$SP" ] && kill $SP 2>/dev/null' EXIT
S "hold start rows=$ROWS"
case ",$ROWS," in *,k4,*) mkdir -p "$O/k4"; samp "$O/k4/foreign.tsv"; S "K4 start"
  for o in B,C,H H,C,B; do { echo "start $(date -u +%FT%TZ) $(cut -d' ' -f1-3 /proc/loadavg)"; taskset -c 0 env NODE_OPTIONS=--max-old-space-size=400 timeout 240 node "$HERE/g2.ts" "$QE/g2" $o "$PGN"; echo "exit $?"; echo "end $(date -u +%FT%TZ) $(cut -d' ' -f1-3 /proc/loadavg)"; } > "$O/k4/K4-${o//,/}.out" 2>&1; done
  S "K4 end"; kill $SP 2>/dev/null; SP=; python3 -I "$HERE/g2-read.py" "$O/k4" > "$O/k4/read.txt"; S "$(tail -1 "$O/k4/read.txt")"; grep -q '^K4 MISS' "$O/k4/read.txt" && { S "hold end: K4 above 1.03"; exit 0; };; esac
case ",$ROWS," in *,k5,*) mkdir -p "$O/k5"; samp "$O/k5/foreign.tsv"; S "K5 start"; node "$HERE/g6.mjs" "$QE/p6" "$O/k5" g6 > "$O/k5/console.txt" 2>&1; S "K5 exit=$?"; kill $SP 2>/dev/null; SP=; python3 -I "$HERE/p6-read.py" "$O/k5/g6.jsonl" "$O/k5/foreign.tsv" > "$O/k5/read.txt"; python3 -I "$HERE/k5-floor.py" "$O/k5/g6.jsonl" >> "$O/k5/read.txt"; grep -q '^K5 BELOW' "$O/k5/read.txt" && { S "hold end: K5 below depth 6"; exit 0; };; esac
case ",$ROWS," in *,n8,*) mkdir -p "$O/n8"; S "NFR-008 start"; bash "$HERE/n8.sh" "$A" "$O/n8" > "$O/n8/console.txt" 2>&1; S "NFR-008 exit=$?";; esac
case ",$ROWS," in *,r10,*) mkdir -p "$O/r10"; S "PR10 reports start"
  for o in B,C,H H,C,B; do { ENTRY=bypass taskset -c 0 env NODE_OPTIONS=--max-old-space-size=400 timeout 240 node "$HERE/g2.ts" "$QE/g2" $o "$PGN"; echo "exit $?"; } > "$O/r10/bypass-${o//,/}.out" 2>&1; { taskset -c 0 env NODE_OPTIONS=--max-old-space-size=400 timeout 300 node "$HERE/nsnode.ts" "$QE/g2" $o 8; echo "exit $?"; } > "$O/r10/nsnode-${o//,/}.out" 2>&1; done
  S "PR10 reports end";; esac
S "hold end"
