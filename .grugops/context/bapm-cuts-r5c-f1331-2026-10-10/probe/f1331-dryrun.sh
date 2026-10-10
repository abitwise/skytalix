#!/bin/bash
# BA/PM F-133-1 dry run: apply each plant (same recipes, same mutate.cjs) to a COPY of the file and run
# Security/NFR's loader-scan.mjs over it. No vitest; a reading of what counts (a) and (b) would see.
# C14-ARRAY / C14-ARG are BA/PM's split of QE's C14 control (its array half and its JSON.stringify half), P-DYN is the ABC-133 page's.
# Usage: f1331-dryrun.sh <.grugops/context dir> <scratch-tree> <a copy of src/cli.test.ts at the commit read>
set -u
C=$1; T=$2; SRC=$3
MUT=$C/qe-ABC-133/probe/mutate.cjs; SCAN=$C/secnfr-ABC-133/probe/loader-scan.mjs
mkdir -p "$T/src"
probe() { local name=$1; shift; cp "$SRC" "$T/src/cli.test.ts"; local args=()
  while [ $# -gt 0 ]; do args+=("$T/src/$1" "$2" "$3"); shift 3; done
  node "$MUT" "${args[@]}" 2>/dev/null || { echo "$name	ABORTED"; return; }
  node "$SCAN" "$T/src/cli.test.ts" | node -e 'const r=JSON.parse(require("fs").readFileSync(0,"utf8"));console.log(process.argv[1]+"\t(a)="+JSON.stringify(r.childProcessArgCalls)+"\tcreateRequireCallNodes="+r.createRequireSites.length+"\t(b)refs="+r.spawnSyncValueRefs.length+" "+JSON.stringify(r.spawnSyncValueRefs))' "$name"; }
SITE='const startGame = () => newGame(START_FEN);'
IMP='import { spawnSync } from "node:child_process";'
probe "CONTROL unmutated" cli.test.ts "$SITE" "$SITE"
probe "E-A1 prose docblock names \`spawnSync(\`" cli.test.ts $'/**\n * `ABC-042`' $'/**\n * Prose only: a later hop never adds a second `spawnSync(` call site.\n * `ABC-042`'
probe "S-CTRL string control, no call" cli.test.ts "$SITE" "$SITE"$'\nconst tag = "a//b /* c"; void tag;'
probe "Q14 REAL call through an alias (out of scope)" cli.test.ts "$SITE" "$SITE"$'\nconst alias = spawnSync;\nconst stray3 = alias(process.execPath, ["-e", ""]);\nvoid stray3;'
probe "X5 createRequire(import.meta.url)(\"node:child_process\") inline" cli.test.ts "$SITE" "$SITE"$'\nconst neverX5 = () => createRequire(import.meta.url)("node:child_process").execSync("true");\nvoid neverX5;'
probe "X5b const req = createRequire(...); req(\"child_process\")" cli.test.ts "$SITE" "$SITE"$'\nconst neverX5b = () => { const req = createRequire(import.meta.url); return req("child_process").execSync("true"); };\nvoid neverX5b;'
probe "X6 process.getBuiltinModule(\"node:child_process\")" cli.test.ts "$SITE" "$SITE"$'\nconst neverX6 = () => process.getBuiltinModule("node:child_process").execSync("true");\nvoid neverX6;'
probe "X7 vi.importActual(\"node:child_process\")" cli.test.ts "$SITE" "$SITE"$'\nconst neverX7 = async () => (await vi.importActual<typeof import("node:child_process")>("node:child_process")).execSync("true");\nvoid neverX7;'
probe "C5 PARENTHESISED callee (spawnSync)()" cli.test.ts "$SITE" "$SITE"$'\nconst neverC5 = () => (spawnSync)(process.execPath, ["-e", ""]);\nvoid neverC5;'
probe "C6 COMMA callee (0, spawnSync)()" cli.test.ts "$SITE" "$SITE"$'\nconst neverC6 = () => (0, spawnSync)(process.execPath, ["-e", ""]);\nvoid neverC6;'
probe "C7 NON-NULL callee spawnSync!()" cli.test.ts "$SITE" "$SITE"$'\nconst neverC7 = () => spawnSync!(process.execPath, ["-e", ""]);\nvoid neverC7;'
probe "C8 AS-cast callee (spawnSync as typeof spawnSync)()" cli.test.ts "$SITE" "$SITE"$'\nconst neverC8 = () => (spawnSync as typeof spawnSync)(process.execPath, ["-e", ""]);\nvoid neverC8;'
probe "C10 Reflect.apply(spawnSync, ...)" cli.test.ts "$SITE" "$SITE"$'\nconst neverC10 = () => Reflect.apply(spawnSync, undefined, [process.execPath, ["-e", ""]]);\nvoid neverC10;'
probe "C13 RegExp.exec + local object .execSync (false-red control)" cli.test.ts "$SITE" "$SITE"$'\nconst reC13 = /a/; void reC13.exec("a");\nconst objC13 = { execSync: () => 0 }; void objC13.execSync();'
probe "C14 \"child_process\" string NOT a specifier (array/arg)" cli.test.ts "$SITE" "$SITE"$'\nconst namesC14 = ["node:child_process", "child_process"]; void String(namesC14); void JSON.stringify("child_process");'
probe "C15 import of a lookalike path ./child_process (not the module)" cli.test.ts "$SITE" "$SITE"$'\nconst neverC15 = () => import("./child_process.ts");\nvoid neverC15;'
probe "S2 vi.mock partial mock via importOriginal (no new child)" cli.test.ts "$SITE" "$SITE"$'\nvi.mock("node:child_process", async (importOriginal) => ({ ...(await importOriginal<object>()) }));'
probe "S3 node:module namespace createRequire(\"child_process\").execSync" cli.test.ts "$IMP" "$IMP"$'\nimport * as nodeModule from "node:module";' cli.test.ts "$SITE" "$SITE"$'\nconst neverS3 = () => nodeModule.createRequire(import.meta.url)("child_process").execSync("true");\nvoid neverS3;'
probe "C14-ARRAY (C14 without its JSON.stringify call)" cli.test.ts "$SITE" "$SITE"$'\nconst namesC14 = ["node:child_process", "child_process"]; void String(namesC14);'
probe "C14-ARG (C14's JSON.stringify call alone)" cli.test.ts "$SITE" "$SITE"$'\nvoid JSON.stringify("child_process");'
probe "P-DYN module-level dynamic import" cli.test.ts "$SITE" "$SITE"$'\nvoid import("node:child_process");'
