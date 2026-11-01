#!/usr/bin/env bash
# qe-ABC-255 dry-run comparator: base (8f2fc9b5) vs head rating.ts, same args, same (absent) out path.
# usage: dry.sh <outdir-for-records>
set -u
SP=<scratch>/qe-255
W=<worktree>
R=$1; mkdir -p "$R"
set -a; . $SP/tools.env; set +a
C=b5c67ab7; B=8f2fc9b5; O=$SP/nonexistent-out
run() { # label side args...
  local label=$1 side=$2; shift 2
  local dir=$W; [ "$side" = base ] && dir=$SP/base
  (cd "$dir" && node tools/rating/rating.ts "$@" --dry-run) > "$R/$label.$side.txt" 2>&1; echo $? > "$R/$label.$side.rc"
}
i=0
cmp_row() { # label args...  -> byte-compare base and head
  local label=$1; shift
  run "$label" base "$@"; run "$label" head "$@"
  if cmp -s "$R/$label.base.txt" "$R/$label.head.txt" && cmp -s "$R/$label.base.rc" "$R/$label.head.rc"; then r=EQUAL; else r=DIFF; fi
  echo "$label rc base=$(cat $R/$label.base.rc) head=$(cat $R/$label.head.rc) $r :: $*" | tee -a "$R/summary.txt"
}
: > "$R/summary.txt"
cmp_row e01-d-default d $C $B $O
for b in 3000 2500 2000 1500 1000; do cmp_row e-d-$b d $C $B $O --budget-ms $b; done
cmp_row e08-d-1000-r50-c1 d $C $B $O --budget-ms 1000 --rounds 50 --concurrency 1
cmp_row e09-d-r200-c1 d $C $B $O --rounds 200 --concurrency 1
cmp_row e10-r-default r $C $O
cmp_row e11-r-elo1910 r $C $O --elo 1910
cmp_row e12-r-r5-c1 r $C $O --rounds 5 --concurrency 1
cmp_row e13-r-elo1650-r10-c2 r $C $O --elo 1650 --rounds 10 --concurrency 2
cmp_row e14-rpair-default rpair $B $C $O
cmp_row e15-rpair-elo1650 rpair $B $C $O --elo 1650
cmp_row e16-rpair-r10-c1 rpair $B $C $O --rounds 10 --concurrency 1
cmp_row e17-rpair-r40-elo1910-c2 rpair $B $C $O --rounds 40 --elo 1910 --concurrency 2
cmp_row e18-rpair-budget500 rpair $B $C $O --budget-ms 500
cmp_row e19-rpair-budget100 rpair $B $C $O --budget-ms 100
# new shapes and refusals, head only (base refuses / differs by design)
for spec in "n01-d100-r50:d $C $B $O --budget-ms 100 --rounds 50 --concurrency 1" \
            "n02-d100-r200:d $C $B $O --budget-ms 100 --rounds 200 --concurrency 1" \
            "n03-r500:r $C $O --budget-ms 500 --rounds 5 --concurrency 1" \
            "n04-r500-default-rounds:r $C $O --budget-ms 500" \
            "x01-r4000:r $C $O --budget-ms 4000" "x02-r100:r $C $O --budget-ms 100" "x03-r1000:r $C $O --budget-ms 1000" \
            "x04-r0:r $C $O --budget-ms 0" "x05-r499:r $C $O --budget-ms 499" "x06-r501:r $C $O --budget-ms 501" \
            "x07-r500.0:r $C $O --budget-ms 500.0" "x08-r5e2:r $C $O --budget-ms 5e2" "x09-r0x1F4:r $C $O --budget-ms 0x1F4" \
            "x10-rneg:r $C $O --budget-ms -500" "x11-rabc:r $C $O --budget-ms abc" \
            "x12-d500:d $C $B $O --budget-ms 500" "x13-d50:d $C $B $O --budget-ms 50" "x14-d1e2:d $C $B $O --budget-ms 1e2" \
            "x15-d4000:d $C $B $O --budget-ms 4000" "x16-d200:d $C $B $O --budget-ms 200"; do
  label=${spec%%:*}; args=${spec#*:}
  run "$label" head $args; run "$label" base $args
  echo "$label rc head=$(cat $R/$label.head.rc) base=$(cat $R/$label.base.rc) :: $args :: $(grep -m1 -o 'st=[0-9.]*\|Error: [^\n]*\|usage' $R/$label.head.txt | head -1)" | tee -a "$R/summary.txt"
done
