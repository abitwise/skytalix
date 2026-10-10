#!/bin/bash
# Security/NFR at ABC-072's gate: plants that probe the LIMB LIST and the instrument's edges, beyond the
# Architect's nine (design-ABC-072/probe/mutants.sh). Each line says what a reader would want and what
# clause-b.mjs reports. Plants live in a `git clone --shared` under <scratch-dir>; the repo is never written.
# usage: sec-mutants.sh <repo> <tip> <scratch-dir> <absolute path to clause-b.mjs>   (macOS sed not needed)
set -e
REPO=$1; TIP=$2; X=$3/sec-mutants-clone; S=$4
rm -rf "$X"; git clone -q --shared --no-checkout "$REPO" "$X"; cd "$X"
git -c advice.detachedHead=false checkout -q "$TIP"; git config user.email m@x; git config user.name mut
mk() { git add -A >/dev/null; git commit -qm "$1"; git rev-parse --short=8 HEAD; }
run() { local v=""; for l in 1 2 3; do o=$(node "$S" "$2" "$3" $l)
  case "$(grep -E '^  limb' <<<"$o" | sed 's/^  limb [0-9]: //')" in FIRES*) v="$v L$l";; esac
  printf '%-34s limb %s  b1=%s b2=%s words=%s unresolved=%s  %s\n' "$1" $l \
    "$(grep '(b1)' <<<"$o" | sed 's/.*: //')" "$(grep '(b2)' <<<"$o" | sed 's/.*: //')" \
    "$(grep 'word hits on added' <<<"$o" | sed 's/.*: //')" "$(grep -c 'unresolved, listed' <<<"$o" || true)" \
    "$(grep -E '^  limb' <<<"$o" | sed 's/^  limb [0-9]: //')"; done; if [ -n "$v" ]; then echo "  => $1: clause (b) FIRES (limbs:$v)"; else echo "  => $1: clause (b) does not fire"; fi; }
T=$(git rev-parse --short=8 HEAD); echo "tip $T"
p() { printf "$2" > "src/$1"; }
p zz-s1.ts 'import { readFileSync } from "fs";\nexport const r = (f: string): string => readFileSync(f, "utf8");\n'; M=$(mk S1); run "S1 unprefixed builtin \"fs\"" $T $M; git reset -q --hard $T
p zz-s2.ts 'const { argv } = process;\nexport const a = argv.length;\n'; M=$(mk S2); run "S2 const { argv } = process" $T $M; git reset -q --hard $T
p zz-s3.ts 'export const e = process["env"];\n'; M=$(mk S3); run "S3 process[\"env\"]" $T $M; git reset -q --hard $T
p zz-s4.ts 'export const e = globalThis.process.env.HOME;\n'; M=$(mk S4); run "S4 globalThis.process.env" $T $M; git reset -q --hard $T
p zz-s5.ts 'export const f = Function("return 1");\n'; M=$(mk S5); run "S5 Function() without new" $T $M; git reset -q --hard $T
p zz-s6.ts 'export const w = (): WebSocket => new WebSocket("ws://127.0.0.1:1");\n'; M=$(mk S6); run "S6 global WebSocket" $T $M; git reset -q --hard $T
p zz-s7.mjs 'import { execSync } from "node:child_process";\nexport const x = () => execSync("true");\n'; M=$(mk S7); run "S7 new src/*.mjs with execSync" $T $M; git reset -q --hard $T
p zz-s7.mjs 'import { execSync } from "node:child_process";\nexport const x = () => execSync("true");\n'; B=$(mk B8)
p zz-s8.ts 'import { x } from "./zz-s7.mjs";\nexport const y = x;\n'; M=$(mk S8); run "S8 .ts edge into that .mjs (B8..)" $B $M; git reset -q --hard $T
p zz-s9.ts 'import ts from "typescript";\nexport const v = ts.version;\n'; M=$(mk S9); run "S9 bare package import" $T $M; git reset -q --hard $T
p zz-s10.ts 'import { spawn } from "node:child_process";\nexport const r = () =>\n  spawn(\n    "true",\n    [],\n  );\n'; B=$(mk B10)
sed 's/"true"/"rm"/' src/zz-s10.ts > src/zz-s10.tmp && mv src/zz-s10.tmp src/zz-s10.ts; M=$(mk S10)
git diff -U0 $B $M -- src | grep '^[-+][^-+]' | sed 's/^/  /'; run "S10 spawn arg line edited (B10..)" $B $M; git reset -q --hard $T
p zz-s11.ts 'export const z = (s: string) => import(s);\n'; M=$(mk S11); run "S11 non-literal import()" $T $M; git reset -q --hard $T
p zz-s12.ts 'import { Worker } from "node:worker_threads";\nexport const w = () => new Worker("./x.js");\n'; M=$(mk S12); run "S12 Worker via node:worker_threads" $T $M; git reset -q --hard $T
p zz-s13.ts 'export const v = (0, eval)("1");\n'; M=$(mk S13); run "S13 indirect (0, eval)" $T $M; git reset -q --hard $T
