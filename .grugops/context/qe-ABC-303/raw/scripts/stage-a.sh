#!/bin/bash
# qe-ABC-303 Stage A, the RUNNER reread.sh calls inside its one hold, after its five clear samples. P7, P6, R5 in order, nothing else.
# usage: stage-a.sh <arms dir> <out dir> <rows: any of p7 p6 r5, comma-separated; empty means all>. Env QE=<qe scratch>, RAWS=<raw scripts dir>.
A=$1; O=$2; ROWS=${3:-p7,p6,r5}; HERE=$(cd "$(dirname "$0")" && pwd)
mkdir -p "$O"; S() { echo "$(date -u +%FT%TZ) load1 $(cut -d' ' -f1 /proc/loadavg) $*" >> "$O/stage.txt"; }
samp() { "$HERE/fsample.sh" "$A" "$1" & SP=$!; }
trap '[ -n "$SP" ] && kill $SP 2>/dev/null' EXIT
S "hold start rows=$ROWS"
case ",$ROWS," in *,p7,*) mkdir -p "$O/p7"; S "P7 start"; bash "$HERE/n8.sh" "$A" "$O/p7" > "$O/p7/console.txt" 2>&1; S "P7 exit=$?";; esac
case ",$ROWS," in *,p6,*) mkdir -p "$O/p6"; samp "$O/p6/foreign.tsv"; S "P6 start"; node "$HERE/g6.mjs" "$QE/p6" "$O/p6" g6 > "$O/p6/console.txt" 2>&1; S "P6 exit=$?"; kill $SP 2>/dev/null; SP=;; esac
case ",$ROWS," in *,r5,*) mkdir -p "$O/r5"; samp "$O/r5/foreign.tsv"; S "R5 start"; taskset -c 0 env NODE_OPTIONS=--max-old-space-size=400 timeout 900 node "$RAWS/drv.ts" nps "$QE/H" > "$O/r5/nps.jsonl" 2> "$O/r5/nps.err"; S "R5 exit=$?"; kill $SP 2>/dev/null; SP=;; esac
S "hold end"
