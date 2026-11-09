#!/usr/bin/env bash
# qe-ABC-298 stage B (ADR-0077 d7, d9 step 7, d11): the timed reads, sealed in PREREG before any timing figure exists.
# Three sessions in one held window, each in ONE hold of the host lock with nothing else in it, run in this order, the
# next starting only after QE has read the last one's exit:
#   flock <scratch>/<home>/<repo>/host-test.lock bash session.sh sg3 <stageB scratch> <outDir>   # SG3
#   flock <scratch>/<home>/<repo>/host-test.lock bash session.sh g6  <stageB scratch> <outDir>   # G6, only if SG3 exited 0
#   flock <scratch>/<home>/<repo>/host-test.lock bash session.sh n8  <stageB scratch> <outDir>   # NFR-008
# <stageB scratch> holds: trees/B and trees/H (git archive of src/, package.json, tsconfig.json at the merge-base and at
# the head); g6/scripts/timed.mjs with g6/base -> trees/B and g6/head -> trees/H; arms/B, arms/H (full-tree git archive,
# node_modules by symlink) and arms/H2 (cp -a of arms/H). The session itself is not pinned: SG3 and G6 run unpinned, as
# ADR-0055's second addendum item 2 has search reads (PREREG § 2); NFR-008 pins each lane run inside stage.inc.sh.
# The host snapshot logs process classes and counts only, never a command line (they can hold credentials).
set -u
WHAT=$1; S=$2; O=$3; Q=$(cd "$(dirname "$0")" && pwd); mkdir -p "$O"
t() { echo "$WHAT $1 $(date -u +%FT%TZ) load1 $(cut -d' ' -f1 /proc/loadavg)" >> "$O/session.txt"; }
snap() {
  echo "# $1 $(date -u +%FT%TZ): processes above 5 % CPU, by command name, count only" >> "$O/ps.txt"
  ps -eo pcpu=,comm= | awk '$1 > 5 {n[$2]++} END {for (c in n) print "  " c, n[c]}' >> "$O/ps.txt"
  echo "  vitest(node|npm|npx): $(ps -eo comm=,args= | grep -E '[v]itest' | awk '$1 ~ /^(node|npm|npx)/' | wc -l); cutechess-cli: $(pgrep -xc cutechess-cli)" >> "$O/ps.txt"
}
t hold-start; snap "$WHAT hold start"
case $WHAT in
  sg3)
    bash "$Q/s2/run.sh" "$S/trees" "$O/sg3" "$Q/s2"; t "sg3 exit=$?"; snap "after SG3" ;;
  g6)
    mkdir -p "$O/g6"; bash "$Q/g6/fsample.sh" "$S/g6" "$O/g6/foreign.tsv" & SP=$!
    timeout 50m node "$Q/g6/g6.mjs" "$S/g6" "$O/g6" g6 > "$O/g6/console.txt" 2>&1; g=$?; kill $SP 2>/dev/null
    t "g6 exit=$g"; snap "after G6" ;;
  n8)
    mkdir -p "$O/n8"; bash "$Q/n8/n8.sh" "$S/arms" "$O/n8" > "$O/n8/console.txt" 2>&1; t "n8 exit=$?"; snap "after NFR-008" ;;
  *) echo "unknown session $WHAT" >&2; exit 2 ;;
esac
t hold-end
