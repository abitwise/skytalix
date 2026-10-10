#!/bin/bash
# F-072-1: plants for the Architect's deltas over limb-ruling.patch (architect-delta.patch), and for the
# two properties the queue task names: the diff-scoped dispute and "never 'does not fire' when disputed".
# Same harness shape as secnfr-ABC-072/probe/sec-mutants.sh. Plants live in a `git clone --shared` under
# <scratch-dir>; the repository is never written.
# usage: f-mutants.sh <repo> <tip> <scratch-dir> <absolute path to clause-b.mjs>
set -e
REPO=$1; TIP=$2; X=$3/f-mutants-clone; S=$4
rm -rf "$X"; git clone -q --shared --no-checkout "$REPO" "$X"; cd "$X"
git -c advice.detachedHead=false checkout -q "$TIP"; git config user.email m@x; git config user.name mut
mk() { git add -A >/dev/null; git commit -qm "$1"; git rev-parse --short=8 HEAD; }
run() { local v=""; for l in 1 2 3; do o=$(node "$S" "$2" "$3" $l)
  case "$(grep -E '^  limb' <<<"$o" | sed 's/^  limb [0-9]: //')" in FIRES*) v="$v L$l";; esac
  printf '%-40s limb %s  b1=%s b2=%s words=%s unresolved=%s  %s\n' "$1" $l \
    "$(grep '(b1)' <<<"$o" | sed 's/.*: //')" "$(grep '(b2)' <<<"$o" | sed 's/.*: //')" \
    "$(grep 'word hits on added' <<<"$o" | sed 's/.*: //')" "$(grep 'unresolved, listed' <<<"$o" | sed 's/.*: //' || true)" \
    "$(grep -E '^  limb' <<<"$o" | sed 's/^  limb [0-9]: //')"; done; if [ -n "$v" ]; then echo "  => $1: clause (b) FIRES (limbs:$v)"; else echo "  => $1: clause (b) does not fire"; fi; }
T=$(git rev-parse --short=8 HEAD); echo "tip $T"
p() { printf "$2" > "src/$1"; }
# F1-F3: require() is an import form (.cjs/.cts are production; createRequire in ESM).
p zz-f1.cjs 'const fs = require("fs");\nmodule.exports = { r: (f) => fs.readFileSync(f, "utf8") };\n'; M=$(mk F1); run "F1 require(\"fs\") in a new .cjs" $T $M; git reset -q --hard $T
p zz-f2.cjs 'const g = require("./glyph-mode.ts");\nmodule.exports = { g };\n'; M=$(mk F2); run "F2 require() edge -> holder" $T $M; git reset -q --hard $T
p zz-f3.cjs 'module.exports = { load: (name) => require(name) };\n'; M=$(mk F3); run "F3 non-literal require()" $T $M; git reset -q --hard $T
# F4: new globalThis.WebSocket is the same global as new WebSocket.
p zz-f4.ts 'export const w = () => new globalThis.WebSocket("ws://127.0.0.1:1");\n'; M=$(mk F4); run "F4 new globalThis.WebSocket" $T $M; git reset -q --hard $T
# F5-F6: a child_process binding made by require() / await import(), then a NEW call through it.
p zz-f5.cjs 'const cp = require("child_process");\nmodule.exports = { cp };\n'; B=$(mk B5)
printf 'module.exports.r = () => cp.execSync("true");\n' >> src/zz-f5.cjs; M=$(mk F5); run "F5 cp.execSync via require ns (B5..)" $B $M; git reset -q --hard $T
p zz-f6.ts 'const { execSync: run } = await import("node:child_process");\nexport const a = 1;\n'; B=$(mk B6)
printf 'export const r = () => run("true");\n' >> src/zz-f6.ts; M=$(mk F6); run "F6 aliased execSync via await import (B6..)" $B $M; git reset -q --hard $T
# F7: the dispute is scoped to the diff (file-level): untouched -> not disputed; touched -> FIRES (disputed).
p zz-f7.ts 'export const z = (s: string) => import(s);\n'; B=$(mk B7)
printf '// a comment, no capability\n' >> src/fen.ts; M=$(mk F7a); run "F7a dispute elsewhere, diff untouched (B7..)" $B $M; git reset -q --hard $B
printf '// a comment, no capability\n' >> src/zz-f7.ts; M=$(mk F7b); run "F7b comment in the disputed file (B7..)" $B $M; git reset -q --hard $T
# F8: a declaration file is not a production file.
p zz-f8.d.mts 'declare const process: { argv: string[] };\nexport { process };\n'; M=$(mk F8); run "F8 new .d.mts (not production)" $T $M; git reset -q --hard $T
# F9: a type-only package import is not an import at runtime (listed as a word hit, not counted).
p zz-f9.ts 'import type { SourceFile } from "typescript";\nexport type S = SourceFile;\n'; M=$(mk F9); run "F9 import type from a package" $T $M; git reset -q --hard $T
