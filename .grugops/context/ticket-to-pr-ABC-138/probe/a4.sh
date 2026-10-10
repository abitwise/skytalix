#!/bin/bash
# SE ABC-138 A5: the pin's own CPU in situ, under ABC-133 A4's protocol (qe-ABC-133/probe/a4.sh): three
# process.cpuUsage marks planted around the pin's lines (before the load, after the load, before the
# FINAL expect), N fresh `npx vitest run src/cli.test.ts` processes per tree, load1 logged before each,
# round 0 discarded by the reader. Base and head rounds INTERLEAVED. Per the page's Test note 5 the end
# mark moves at head: the pin's final expect is now count (iii)'s, so the mark goes before it and the
# reading covers all three counts. The base marks are QE's, unchanged.
# Usage: a4.sh <repo> <base> <head> <n> <scratch-dir> <out>
set -u
REPO=$1; BASE=$2; HEAD=$3; N=$4; SP=$5; OUT=$6
MUT=$(cd "$(dirname "$0")/../../qe-ABC-133/probe" && pwd)/mutate.cjs
LOAD='    const ts: typeof Ts = createRequire(import.meta.url)("typescript");'
END_B='    expect(resolved, "calls that resolve to a child_process binding").toEqual(['
END_H='    expect(references, "value-position references to a child_process binding").toEqual(['
MARK0='    const __c0 = process.cpuUsage();'
MARK1='    const __c1 = process.cpuUsage(__c0);'
MARK2_B=$'    const __c2 = process.cpuUsage(__c0);\n    createRequire(import.meta.url)("node:fs").appendFileSync(process.env.A4_OUT as string, `${(__c1.user + __c1.system) / 1000} ${(__c2.user + __c2.system) / 1000} ${JSON.stringify(specifiers)} ${JSON.stringify(resolved)}\\n`);'
MARK2_H=$'    const __c2 = process.cpuUsage(__c0);\n    createRequire(import.meta.url)("node:fs").appendFileSync(process.env.A4_OUT as string, `${(__c1.user + __c1.system) / 1000} ${(__c2.user + __c2.system) / 1000} ${JSON.stringify(specifiers)} ${JSON.stringify(resolved)} ${JSON.stringify(references)}\\n`);'
prep() { # label commit end-anchor mark2
  local T=$SP/a4tree-$1; rm -rf "$T"; mkdir -p "$T"
  git -C "$REPO" archive "$2" | tar -x -C "$T"; ln -s "$REPO/node_modules" "$T/node_modules"
  node "$MUT" "$T/src/cli.test.ts" "$LOAD" "$MARK0"$'\n'"$LOAD"$'\n'"$MARK1" "$T/src/cli.test.ts" "$3" "$4"$'\n'"$3" || exit 3
}
prep base "$BASE" "$END_B" "$MARK2_B"
prep head "$HEAD" "$END_H" "$MARK2_H"
echo "# base $(git -C "$REPO" rev-parse --short "$BASE") head $(git -C "$REPO" rev-parse --short "$HEAD") node $(node --version) $(date -u +%FT%TZ)" > "$OUT"
echo "# round tree load1 load_ms total_ms specifiers resolved [references] |tests" >> "$OUT"
for i in $(seq 0 $((N - 1))); do
  for L in base head; do
    LA=$(sysctl -n vm.loadavg | awk '{print $2}')
    RAW=$SP/a4-$L.raw; : > "$RAW"
    TESTS=$(cd "$SP/a4tree-$L" && A4_OUT=$RAW npx vitest run src/cli.test.ts 2>&1 | grep -E "Tests +[0-9]" | tr -s ' ')
    echo "$i $L $LA $(tr -d '\n' < "$RAW") |$TESTS" >> "$OUT"
  done
done
cat "$OUT"
