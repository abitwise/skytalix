#!/bin/bash
# QE ABC-138 own plants. Usage: qe-plants.sh <repo> <commit> <label> <scratch> [typecheck]
# git archive copy, node_modules symlinked, one plant per `npx vitest run src/cli.test.ts`, anchors once,
# tree restored + diff-checked. With 5th arg "tc", each plant also runs `npx tsc --noEmit` and
# `npx biome check src/cli.test.ts` on the planted tree (is the plant gate-admissible?).
set -u
REPO=$1; COMMIT=$2; LABEL=$3; SP=$4; TC=${5:-}
MUT=$(cd "$(dirname "$0")" && pwd)/mutate.cjs
T=$SP/tree-$LABEL
rm -rf "$T" "$T.pristine"; mkdir -p "$T"
git -C "$REPO" archive "$COMMIT" | tar -x -C "$T"
ln -s "$REPO/node_modules" "$T/node_modules"
cp -R "$T/src" "$T.pristine"
OUT=$SP/qe-plants-$LABEL.out.txt
: > "$OUT"
echo "commit $(git -C "$REPO" rev-parse --short "$COMMIT")  node $(node --version)  $(date -u +%FT%TZ)" >> "$OUT"
restore() { rm -rf "$T/src"; cp -R "$T.pristine" "$T/src"; diff -r "$T/src" "$T.pristine" > /dev/null || { echo "RESTORE FAILED"; exit 2; }; }
run() {
  echo "== $1   load1 $(sysctl -n vm.loadavg | awk '{print $2}')  $(date -u +%H:%M:%SZ)" >> "$OUT"
  (cd "$T" && npx vitest run src/cli.test.ts 2>&1) \
    | grep -E "Tests +[0-9]|AssertionError|Error:" \
    | sed 's/ [0-9]*ms$//' | cut -c1-260 | sort -u >> "$OUT"
  if [ "$TC" = tc ]; then
    (cd "$T" && npx tsc --noEmit -p . > "$SP/tc.txt" 2>&1; echo "   typecheck exit $? $(grep -c 'error TS' "$SP/tc.txt") errors $(grep -o 'error TS[0-9]*' "$SP/tc.txt" | sort -u | tr '\n' ' ')") >> "$OUT"
    (cd "$T" && npx biome check src/cli.test.ts > "$SP/bio.txt" 2>&1; echo "   biome exit $?  $(grep -oE 'lint/[a-zA-Z/]+|format' "$SP/bio.txt" | sort -u | tr '\n' ' ')") >> "$OUT"
  fi
}
probe() {
  local name=$1; shift; local args=()
  while [ $# -gt 0 ]; do args+=("$T/src/$1" "$2" "$3"); shift 3; done
  node "$MUT" "${args[@]}" 2>> "$OUT" || { echo "== $name  ABORTED: anchor" >> "$OUT"; restore; return; }
  run "$name"; restore
}
SITE='const startGame = () => newGame(START_FEN);'
IMP='import { spawnSync } from "node:child_process";'
run "control (unmutated)"
# ---- loader forms (expect RED on (i) at head) ----
probe "L1 renamed createRequire: const mk = createRequire; mk(...)(\"node:child_process\")" cli.test.ts "$SITE" "$SITE"$'\nconst mkL1 = createRequire;\nconst neverL1 = () => mkL1(import.meta.url)("node:child_process").execSync("true");\nvoid neverL1;'
probe "L2 require alias: const r = createRequire(...); const load = r; load(\"child_process\")" cli.test.ts "$SITE" "$SITE"$'\nconst neverL2 = () => { const r = createRequire(import.meta.url); const load = r; return load("child_process").execSync("true"); };\nvoid neverL2;'
probe "L3a getBuiltinModule via a variable callee: const gbm = process.getBuiltinModule; gbm(\"node:child_process\")" cli.test.ts "$SITE" "$SITE"$'\nconst gbmL3 = process.getBuiltinModule;\nconst neverL3a = () => gbmL3("node:child_process").execSync("true");\nvoid neverL3a;'
probe "L3b getBuiltinModule with the NAME in a const (the comment's own spelling)" cli.test.ts "$SITE" "$SITE"$'\nconst CP_L3 = "node:child_process";\nconst neverL3b = () => process.getBuiltinModule(CP_L3).execSync("true");\nvoid neverL3b;'
probe "L3c getBuiltinModule.call(process, \"node:child_process\") literal NOT first arg" cli.test.ts "$SITE" "$SITE"$'\nconst neverL3c = () => (process.getBuiltinModule.call(process, "node:child_process") as typeof import("node:child_process")).execSync("true");\nvoid neverL3c;'
probe "L4 no-substitution template getBuiltinModule(\`node:child_process\`)" cli.test.ts "$SITE" "$SITE"$'\nconst neverL4 = () => process.getBuiltinModule(`node:child_process`).execSync("true");\nvoid neverL4;'
probe "L5 Reflect.apply(createRequire(...), undefined, [\"child_process\"]) literal in array" cli.test.ts "$SITE" "$SITE"$'\nconst neverL5 = () => (Reflect.apply(createRequire(import.meta.url), undefined, ["child_process"]) as typeof import("node:child_process")).execSync("true");\nvoid neverL5;'
probe "L6 vi.doMock(\"child_process\")" cli.test.ts "$SITE" "$SITE"$'\nvi.doMock("child_process");'
probe "L7 export * from \"node:child_process\"" cli.test.ts "$IMP" "$IMP"$'\nexport * from "node:child_process";'
probe "L8 re-export the binding: export { spawnSync }" cli.test.ts "$SITE" "$SITE"$'\nexport { spawnSync };'
# ---- wrapped callees (expect RED on (iii) at head) ----
probe "W1 satisfies callee (spawnSync satisfies typeof spawnSync)()" cli.test.ts "$SITE" "$SITE"$'\nconst neverW1 = () => (spawnSync satisfies typeof spawnSync)(process.execPath, ["-e", ""]);\nvoid neverW1;'
probe "W2 array-index callee [spawnSync][0]()" cli.test.ts "$SITE" "$SITE"$'\nconst neverW2 = () => [spawnSync][0]?.(process.execPath, ["-e", ""]);\nvoid neverW2;'
probe "W3 shorthand object { spawnSync }.spawnSync()" cli.test.ts "$SITE" "$SITE"$'\nconst boxW3 = { spawnSync };\nconst neverW3 = () => boxW3.spawnSync(process.execPath, ["-e", ""]);\nvoid neverW3;'
probe "W4 new (spawnSync as ...)()" cli.test.ts "$SITE" "$SITE"$'\nconst neverW4 = () => new (spawnSync as unknown as new (f: string, a: string[]) => object)(process.execPath, ["-e", ""]);\nvoid neverW4;'
probe "W5 class EXTENDS (spawnSync as ...) + new  [ExpressionWithTypeArguments]" cli.test.ts "$SITE" "$SITE"$'\nclass SpawnerW5 extends (spawnSync as unknown as new (f: string, a: string[]) => object) {}\nconst neverW5 = () => new SpawnerW5(process.execPath, ["-e", ""]);\nvoid neverW5;'
probe "W6 instantiation-expression alias (spawnSync as <T>…)<object> [ExpressionWithTypeArguments]" cli.test.ts "$SITE" "$SITE"$'\nconst aliasW6 = (spawnSync as unknown as <T>(f: string, a: string[]) => T)<object>;\nconst neverW6 = () => aliasW6(process.execPath, ["-e", ""]);\nvoid neverW6;'
probe "W7 destructure from a local array: const [s] = [spawnSync]; s()" cli.test.ts "$SITE" "$SITE"$'\nconst [aliasW7] = [spawnSync];\nconst neverW7 = () => aliasW7(process.execPath, ["-e", ""]);\nvoid neverW7;'
# ---- false-red candidates in legitimate code (expect GREEN unless the stated class) ----
probe "F1 logger, name first arg: console.log(\"child_process\")  [stated class]" cli.test.ts "$SITE" "$SITE"$'\nconst logF1 = () => console.log("child_process");\nvoid logF1;'
probe "F1b logger, name SECOND arg: console.info(\"module\", \"child_process\")" cli.test.ts "$SITE" "$SITE"$'\nconst logF1b = () => console.info("module", "child_process");\nvoid logF1b;'
probe "F2 type-only reference: type R = ReturnType<typeof spawnSync>" cli.test.ts "$SITE" "$SITE"$'\ntype ResultF2 = ReturnType<typeof spawnSync>;\nconst noneF2: ResultF2 | undefined = undefined;\nvoid noneF2;'
probe "F2b type-only reference in a param annotation: Parameters<typeof spawnSync>[0]" cli.test.ts "$SITE" "$SITE"$'\nconst nameF2b = (file: Parameters<typeof spawnSync>[0]): string => String(file);\nvoid nameF2b;'
probe "F3 JSDoc {@link spawnSync}" cli.test.ts "$SITE" $'/** See {@link spawnSync} and `childOf`. */\n'"$SITE"
probe "F4 expect(text).not.toContain(\"child_process\")  [stated class]" cli.test.ts "$SITE" "$SITE"$'\nconst guardF4 = (text: string) => expect(text).not.toContain("child_process");\nvoid guardF4;'
probe "F5 import type { SpawnSyncReturns } (type-only import, pre-existing behaviour)" cli.test.ts "$IMP" "$IMP"$'\nimport type { SpawnSyncReturns } from "node:child_process";\nconst noneF5: SpawnSyncReturns<string> | undefined = undefined;\nvoid noneF5;'
probe "F6 typeof import(\"node:child_process\") type (ImportType, no runtime load)" cli.test.ts "$SITE" "$SITE"$'\ntype CpF6 = typeof import("node:child_process");\nconst noneF6: CpF6 | undefined = undefined;\nvoid noneF6;'
probe "F7 lookalike name in a string, not exact: describe-style \"child_process loader\"" cli.test.ts "$SITE" "$SITE"$'\nconst labelF7 = String("child_process loader");\nvoid labelF7;'
