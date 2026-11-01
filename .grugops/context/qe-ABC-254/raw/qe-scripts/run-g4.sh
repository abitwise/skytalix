#!/usr/bin/env bash
# qe-ABC-254 G4 runner. usage: run-g4.sh <outDir>  (trees B and H beside this script's ../trees)
# Jobs for both builds go through one pool of 22 (24 cores). Rows are deterministic (no real clock);
# per build the shard files are joined in name order, so B and H have the same layout.
set -euo pipefail
S=$(dirname "$(readlink -f "$0")"); T=$S/../trees; out=$1; mkdir -p "$out"; n=16
jobs=$out/jobs.txt; : > "$jobs"
for b in B H; do
  mkdir -p "$out/$b"
  for part in doors search; do for ((i=0;i<n;i++)); do echo "$b $part $i/$n $(printf %02d $i) -" >> "$jobs"; done; done
  for ((i=0;i<8;i++)); do echo "$b unpruned $i/8 $(printf %02d $i) -" >> "$jobs"; done
  for ((i=0;i<8;i++)); do echo "$b sample $i/8 $(printf %02d $i) -" >> "$jobs"; done
  echo "$b choose 0/1 00 -" >> "$jobs"; echo "$b lists 0/1 00 -" >> "$jobs"; echo "$b corpus 0/1 00 -" >> "$jobs"
done
run1() { # build part shard tag
  local b=$1 part=$2 sh=$3 tag=$4 tree=$T/$1
  if [ "$part" = sample ]; then
    A1_UNPRUNED_DEPTH=5 A1_FAMILIES=kq-corner,kr-corner,kqk-h8,kp-vs-k,krk-a-file,pawn-race,position-3 \
      node "$S/g4.mjs" "$tree" unpruned "$sh" > "$out/$b/9-sample-$tag" 2>> "$out/$b/err-sample-$tag"
  else
    local pre=3; [ "$part" = corpus ] && pre=0; [ "$part" = lists ] && pre=1; [ "$part" = choose ] && pre=2
    node "$S/g4.mjs" "$tree" "$part" "$sh" > "$out/$b/$pre-$part-$tag" 2>> "$out/$b/err-$part-$tag"
  fi
}
export -f run1; export S T out
t0=$(date +%s)
xargs -P 22 -L 1 bash -c 'run1 "$0" "$1" "$2" "$3"' < "$jobs"
echo "pool wall $(( $(date +%s) - t0 )) s"
for b in B H; do
  cat $(ls "$out/$b"/[0-3]-* | sort) > "$out/g4-$b.jsonl"
  cat $(ls "$out/$b"/9-sample-* | sort) > "$out/g4-sample-$b.jsonl"
  wc -l "$out/g4-$b.jsonl" "$out/g4-sample-$b.jsonl"; sha256sum "$out/g4-$b.jsonl" "$out/g4-sample-$b.jsonl"
  cat "$out/$b"/err-* > "$out/err-$b.txt"
done
