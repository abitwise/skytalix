#!/bin/sh
# qe-ABC-221 POST-HOC (after the plants; informative, changes no pre-registered bar): does the out-of-tree oracle
# (oracle.mjs) catch the two lane survivors? Builds a src-only copy of H per survivor with the plant's exact edit
# (the same strings as plant.mjs), then runs oracle.mjs B <copy>. usage: sh posthoc-oracle.sh <B> <H> <scratch> <scripts>
B=$1; H=$2; S=$3; Q=$4
for id in HSCM CLOCKWINSCM; do
  rm -rf "$S/ph-$id"; mkdir -p "$S/ph-$id"; cp -r "$H/src" "$S/ph-$id/src"
  node -e '
    const fs = require("node:fs"); const [f, id] = process.argv.slice(1); let s = fs.readFileSync(f, "utf8");
    const SHARE = "budget = Math.min(cap, safeClockShare(time, increment, movesToGo));";
    const MT = "if (clock.movetime !== undefined) budget = Math.min(clock.movetime, cap);";
    const edits = {
      HSCM: [SHARE, "budget = Math.min(cap, timeMode === \"uci-clock-mode\" ? Math.max(1, (time - CLOCK_RESERVE_MS - movesToGo * CLOCK_OVERHEAD_MS) / movesToGo + increment) : safeClockShare(time, increment, movesToGo));"],
      CLOCKWINSCM: [MT, "if (clock.movetime !== undefined && (timeMode !== \"uci-clock-mode\" || time === undefined)) budget = Math.min(clock.movetime, cap);"],
    };
    const [from, to] = edits[id]; if (s.split(from).length !== 2) throw new Error("not once"); fs.writeFileSync(f, s.split(from).join(to));
  ' "$S/ph-$id/src/uci-session.ts" "$id"
  echo "== POST-HOC oracle vs $id"
  node "$Q/oracle.mjs" "$B" "$S/ph-$id" "$S/ph-shims-$id" > "$S/ph-$id.txt" 2>&1
  grep -c "^FAIL O1 " "$S/ph-$id.txt" | sed 's/^/O1 FAIL lines: /'; grep "^FAIL O1 " "$S/ph-$id.txt" | head -3; tail -1 "$S/ph-$id.txt"
done
