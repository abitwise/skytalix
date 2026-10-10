#!/bin/bash
# QE ABC-133 A4: the DELIVERED pin's own CPU, measured IN SITU (not a transcription). Out-of-tree copy of
# <commit>; three process.cpuUsage marks are planted around the pin's own lines (before the load, after
# the load, before the final expect), appended to $A4_OUT. N fresh `npx vitest run src/cli.test.ts`
# processes, load1 logged before each; round 0 is discarded by the reader.
# Variant `require` = as delivered; variant `esm` = the load swapped for `await import("typescript")`
# (the it made async), to re-measure the engineer's stated ESM gap.
# Usage: a4.sh <commit> <variant> <n>
set -u
COMMIT=$1; VAR=$2; N=$3
REPO=${REPO:-<repo>}
SP=$(cd "$(dirname "$0")" && pwd)
T=$SP/a4tree-$VAR
rm -rf "$T"; mkdir -p "$T"
git -C "$REPO" archive "$COMMIT" | tar -x -C "$T"
ln -s "$REPO/node_modules" "$T/node_modules"
LOAD='    const ts: typeof Ts = createRequire(import.meta.url)("typescript");'
END='    expect(resolved, "calls that resolve to a child_process binding").toEqual(['
IT='  it("N8-LANE — this file spawns TWENTY-SEVEN children and no more", () => {'
MARK0='    const __c0 = process.cpuUsage();'
MARK1='    const __c1 = process.cpuUsage(__c0);'
MARK2=$'    const __c2 = process.cpuUsage(__c0);\n    createRequire(import.meta.url)("node:fs").appendFileSync(process.env.A4_OUT as string, `${(__c1.user + __c1.system) / 1000} ${(__c2.user + __c2.system) / 1000} ${JSON.stringify(specifiers)} ${JSON.stringify(resolved)}\\n`);'
if [ "$VAR" = esm ]; then
  NEWLOAD='    const ts: typeof Ts = ((await import("typescript")) as unknown as { default: typeof Ts }).default;'
  node "$SP/mutate.cjs" "$T/src/cli.test.ts" "$LOAD" "$MARK0"$'\n'"$NEWLOAD"$'\n'"$MARK1" "$T/src/cli.test.ts" "$END" "$MARK2"$'\n'"$END" "$T/src/cli.test.ts" "$IT" '  it("N8-LANE — this file spawns TWENTY-SEVEN children and no more", async () => {' || exit 3
else
  node "$SP/mutate.cjs" "$T/src/cli.test.ts" "$LOAD" "$MARK0"$'\n'"$LOAD"$'\n'"$MARK1" "$T/src/cli.test.ts" "$END" "$MARK2"$'\n'"$END" || exit 3
fi
OUT=$SP/a4-$VAR.out.txt
echo "# commit $(git -C "$REPO" rev-parse --short "$COMMIT") variant $VAR node $(node --version) $(date -u +%FT%TZ)" > "$OUT"
echo "# round load1 load_ms total_ms specifiers resolved tests" >> "$OUT"
for i in $(seq 0 $((N - 1))); do
  L=$(sysctl -n vm.loadavg | awk '{print $2}')
  RAW=$SP/a4-$VAR.raw; : > "$RAW"
  TESTS=$(cd "$T" && A4_OUT=$RAW npx vitest run src/cli.test.ts 2>&1 | grep -E "Tests +[0-9]" | tr -s ' ')
  echo "$i $L $(cat "$RAW" | tr -d '\n') |$TESTS" >> "$OUT"
done
cat "$OUT"
