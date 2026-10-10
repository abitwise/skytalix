#!/bin/bash
# Security/NFR ABC-138 own plants. Usage: sec-plants.sh <repo> <commit> <label> <scratch> <mutate.cjs>
# QE's harness shape: git archive copy, node_modules symlinked, one plant per `npx vitest run src/cli.test.ts`,
# anchors must occur once, tree restored + diff-checked; each plant also runs tsc --noEmit and biome check.
set -u
REPO=$1; COMMIT=$2; LABEL=$3; SP=$4; MUT=$5
T=$SP/tree-$LABEL
rm -rf "$T" "$T.pristine"; mkdir -p "$T"
git -C "$REPO" archive "$COMMIT" | tar -x -C "$T"
ln -s "$REPO/node_modules" "$T/node_modules"
cp -R "$T/src" "$T.pristine"
OUT=$SP/sec-plants-$LABEL.out.txt
: > "$OUT"
echo "commit $(git -C "$REPO" rev-parse --short "$COMMIT")  node $(node --version)  $(date -u +%FT%TZ)" >> "$OUT"
restore() { rm -rf "$T/src"; cp -R "$T.pristine" "$T/src"; diff -r "$T/src" "$T.pristine" > /dev/null || { echo "RESTORE FAILED"; exit 2; }; }
run() {
  echo "== $1   load1 $(sysctl -n vm.loadavg | awk '{print $2}')  $(date -u +%H:%M:%SZ)" >> "$OUT"
  (cd "$T" && npx vitest run src/cli.test.ts 2>&1) \
    | grep -E "Tests +[0-9]|AssertionError|Error:" \
    | sed 's/ [0-9]*ms$//' | cut -c1-240 | sort -u >> "$OUT"
  (cd "$T" && npx tsc --noEmit -p . > "$SP/tc-$LABEL.txt" 2>&1; echo "   typecheck exit $? $(grep -o 'error TS[0-9]*' "$SP/tc-$LABEL.txt" | sort -u | tr '\n' ' ')") >> "$OUT"
  (cd "$T" && npx biome check src/cli.test.ts > "$SP/bio-$LABEL.txt" 2>&1; echo "   biome exit $?  $(grep -oE 'lint/[a-zA-Z/]+|format' "$SP/bio-$LABEL.txt" | sort -u | tr '\n' ' ')") >> "$OUT"
}
probe() {
  local name=$1; shift; local args=()
  while [ $# -gt 0 ]; do args+=("$T/src/$1" "$2" "$3"); shift 3; done
  node "$MUT" "${args[@]}" 2>> "$OUT" || { echo "== $name  ABORTED: anchor" >> "$OUT"; restore; return; }
  run "$name"; restore
}
SITE='const startGame = () => newGame(START_FEN);'
run "control (unmutated)"
# ---- Ruling 1: the C14 split, and the remedy as now worded ----
probe "K1 C14-ARG void JSON.stringify(\"child_process\")  [stated false red, expect RED (i)]" cli.test.ts "$SITE" "$SITE"$'\nvoid JSON.stringify("child_process");'
probe "K2 C14-ARRAY [control, expect GREEN]" cli.test.ts "$SITE" "$SITE"$'\nconst namesC14 = ["node:child_process", "child_process"]; void String(namesC14);'
probe "K3 remedy for a call that loads nothing: const CP; expect(text).not.toContain(CP) [expect GREEN]" cli.test.ts "$SITE" "$SITE"$'\nconst CP_K3 = "child_process";\nconst guardK3 = (text: string) => expect(text).not.toContain(CP_K3);\nvoid guardK3;'
probe "K4 remedy MISapplied to a loader: const CP; vi.importActual(CP) [QE-138-c blind shape, expect GREEN]" cli.test.ts "$SITE" "$SITE"$'\nconst CP_K4 = "node:child_process";\nconst neverK4 = () => vi.importActual(CP_K4);\nvoid neverK4;'
probe "K5 remedy MISapplied to a loader: const CP; createRequire(...)(CP).execSync [expect GREEN]" cli.test.ts "$SITE" "$SITE"$'\nconst CP_K5 = "node:child_process";\nconst neverK5 = () => createRequire(import.meta.url)(CP_K5).execSync("true");\nvoid neverK5;'
# ---- Ruling 2: AR-133-WRAP residual reach without an identifier ----
probe "E1 direct eval reaches the module binding by STRING: eval(\"spawnSync\")(...) [expect GREEN suite; gate?]" cli.test.ts "$SITE" "$SITE"$'\nconst neverE1 = () => eval("spawnSync")(process.execPath, ["-e", ""]);\nvoid neverE1;'
probe "E2 wrapped callee re-check (spawnSync as typeof spawnSync)(...) [expect RED (iii)]" cli.test.ts "$SITE" "$SITE"$'\nconst neverE2 = () => (spawnSync as typeof spawnSync)(process.execPath, ["-e", ""]);\nvoid neverE2;'
probe "E3 class extends + new (W5 shape) [expect RED (iii)]" cli.test.ts "$SITE" "$SITE"$'\nclass SpawnerE3 extends (spawnSync as unknown as new (f: string, a: string[]) => object) {}\nconst neverE3 = () => new SpawnerE3(process.execPath, ["-e", ""]);\nvoid neverE3;'
# ---- Ruling 3: AR-133-LOADER residuals ----
probe "L-a QE-138-b getBuiltinModule.call(process, literal) [expect GREEN]" cli.test.ts "$SITE" "$SITE"$'\nconst neverLa = () => (process.getBuiltinModule.call(process, "node:child_process") as typeof import("node:child_process")).execSync("true");\nvoid neverLa;'
probe "L-b concatenated name process.getBuiltinModule(\"node:child\" + \"_process\") [expect GREEN, adversarial]" cli.test.ts "$SITE" "$SITE"$'\nconst neverLb = () => (process.getBuiltinModule("node:child" + "_process") as typeof import("node:child_process")).execSync("true");\nvoid neverLb;'
probe "L-c X5 createRequire(...)(\"node:child_process\") [expect RED (i)]" cli.test.ts "$SITE" "$SITE"$'\nconst neverLc = () => createRequire(import.meta.url)("node:child_process").execSync("true");\nvoid neverLc;'
probe "L-d S2 vi.mock(\"node:child_process\") [expect RED (i)]" cli.test.ts "$SITE" "$SITE"$'\nvi.mock("node:child_process");'
echo "DONE $(date -u +%FT%TZ)" >> "$OUT"
