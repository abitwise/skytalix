#!/usr/bin/env bash
# qe-ABC-298 pre-seal logic test of the SG3 instrument, with NO search: grade-cases.mjs (synthetic lines through
# grade.mjs), then two stub schedules through s2.mjs with stub-probe.mjs (A4_PROBE), then analyse.mjs and grade.mjs on
# them. Run as: flock <scratch>/<home>/<repo>/host-test.lock bash run-tests.sh <outDir>
# Schedule 1: STUB_RATIO 1.05, runs 3 and 4 dirty (one discarded pair on kiwipete, retried in the same order).
# Schedule 2: the start board always dirty (VOID-LOAD at its cap of 15), the rest clean, STUB_RATIO 1.00.
set -u
O=$1; Q=$(cd "$(dirname "$0")/.." && pwd); mkdir -p "$O/cases" "$O/stub1" "$O/stub2"
node "$Q/test/grade-cases.mjs" "$O/cases" > "$O/grade-cases.txt" 2>&1; echo "grade-cases exit $?" >> "$O/exits.txt"
export A4_PROBE="$Q/test/stub-probe.mjs"
CLEAR_DEADLINE=$(date -u -d '+5 min' +%FT%TZ) STUB_DIR="$O/stub1" STUB_RATIO=1.05 STUB_DIRTY_RUNS=3,4 \
  node "$Q/s2.mjs" "$O/none" "$O/stub1/s2.jsonl" kiwipete,position-6,start stub1; echo "stub1 exit $?" >> "$O/exits.txt"
node "$Q/analyse.mjs" "$O/stub1/s2.jsonl" > "$O/stub1/analysis.jsonl"; node "$Q/grade.mjs" "$O/stub1/analysis.jsonl" > "$O/stub1/grade.json"
CLEAR_DEADLINE=$(date -u -d '+5 min' +%FT%TZ) STUB_DIR="$O/stub2" STUB_RATIO=1.00 STUB_DIRTY_BOARDS=start \
  node "$Q/s2.mjs" "$O/none" "$O/stub2/s2.jsonl" kiwipete,position-6,start stub2; echo "stub2 exit $?" >> "$O/exits.txt"
node "$Q/analyse.mjs" "$O/stub2/s2.jsonl" > "$O/stub2/analysis.jsonl"; node "$Q/grade.mjs" "$O/stub2/analysis.jsonl" > "$O/stub2/grade.json"
