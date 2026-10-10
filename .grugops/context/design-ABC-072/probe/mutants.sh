#!/bin/bash
# ABC-072 A3: nine planted diffs that prove clause-b.mjs fires where ADR-0036 § Canonical clause (b) says
# it fires, and stays quiet where it says it does not. History has no fixture for limbs 1 and 3, the
# transitive reach, or the type-only exclusion, so they are planted here.
# usage: mutants.sh <repo> <tip> <scratch-dir> <absolute path to clause-b.mjs>   (macOS sed)
# Plants in a `git clone --shared` under <scratch-dir>; the repository itself is never written.
set -e
REPO=$1; TIP=$2; X=$3/mutants-clone; S=$4
rm -rf "$X"; git clone -q --shared --no-checkout "$REPO" "$X"; cd "$X"
git -c advice.detachedHead=false checkout -q "$TIP"; git config user.email m@x; git config user.name mut
mk() { git add -A >/dev/null; git commit -qm "$1"; git rev-parse --short=8 HEAD; }
run() { for l in 1 2 3; do o=$(node "$S" "$2" "$3" $l)
  printf '%-28s limb %s  b1=%s b2=%s words=%s  %s\n' "$1" $l \
    "$(grep '(b1)' <<<"$o" | sed 's/.*: //')" "$(grep '(b2)' <<<"$o" | sed 's/.*: //')" \
    "$(grep 'word hits on added' <<<"$o" | sed 's/.*: //')" "$(grep -E '^  limb' <<<"$o" | sed 's/.*: //')"; done; }
T=$(git rev-parse --short=8 HEAD); echo "tip $T"
sed -i '' '1i\
import { readFileSync } from "node:fs";
' src/fen.ts; M=$(mk M1); run "M1 node:fs import" $T $M; git reset -q --hard $T
printf 'import * as cp from "node:child_process";\nexport const run = () => cp.execSync("true");\n' > src/zz-cp.ts; M=$(mk M2); run "M2 cp.execSync, new file" $T $M; git reset -q --hard $T
printf 'export const m = (s: string) => /a/.exec(s);\n// process.exit and spawn( in a comment\nexport const t = "process.exit(1) in a string";\n' > src/zz-words.ts; M=$(mk M3); run "M3 words only" $T $M; git reset -q --hard $T
printf 'import { beginGlyphModeSession } from "./glyph-mode.ts";\nexport const g = beginGlyphModeSession;\n' > src/zz-edge.ts; M=$(mk M4); run "M4 value edge -> holder" $T $M; git reset -q --hard $T
printf 'import type { GlyphFlags } from "./glyph-mode.ts";\nexport type G = GlyphFlags;\n' > src/zz-type.ts; M=$(mk M5); run "M5 import type -> holder" $T $M; git reset -q --hard $T
printf 'import { type GlyphFlags } from "./glyph-mode.ts";\nexport type G = GlyphFlags;\n' > src/zz-inl.ts; M=$(mk M6); run "M6 inline type -> holder" $T $M; git reset -q --hard $T
printf 'import "./glyph-mode.ts";\nexport const b = 1;\n' > src/zz-bridge.ts; B=$(mk B7)
printf 'import { b } from "./zz-bridge.ts";\nexport const c = b;\n' > src/zz-reach.ts; M=$(mk M7); run "M7 transitive reach (B7..M7)" $B $M; git reset -q --hard $T
sed -i '' 's/    isTTY: Boolean(process.stdout.isTTY),/    isTTY: Boolean(process.stdout.isTTY), \/\/ edited in place/' src/glyph-mode.ts; M=$(mk M8)
git diff -U0 $T $M | grep '^[-+][^-+]' | sed 's/^/  /'; run "M8 holder line edited" $T $M; git reset -q --hard $T
sed -i '' '1i\
// a comment line, no capability
' src/glyph-mode.ts; M=$(mk M9); run "M9 comment in a holder" $T $M; git reset -q --hard $T
