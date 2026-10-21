#!/bin/bash
# ABC-182: the committed Ruling 2 plants (ADR-0036 § S1 Ruling 2, folded into clause-b.mjs by ABC-163). Seven plants,
# each with its EXPECTED limb-1 verdict printed beside the ACTUAL one (Architect `…34e592ac`; bodies as QE `…7f56f339`).
# Same harness shape as f-mutants.sh: plants live in a `git clone --shared` under <scratch-dir>; the repository is
# never written.
# usage: r2-mutants.sh <repo> <tip> <scratch-dir> <absolute path to clause-b.mjs>
#   <tip> is a commit id; the holder plants are made on it, NOH on f00038ef^1 (before ABC-095: no limb-1 holder).
# Limb 1 is read from the `(b1) capability` line, the `(b1) Ruling 2` line and the files listed under it, and the
#   `limb 1:` verdict line, never from a bare `(b1)` grep (Architect decision 2, G-3). A row compares the verdict and
#   the Ruling 2 file list (`file@ends`); NOH also needs `adds nothing` whenever a `(b1) Ruling 2` line is printed.
# Limbs 2 and 3 of every plant are compared byte for byte with the 341da4c1 instrument. The script makes that copy
#   itself: `git -C <repo> show 341da4c1:<instrument path>` into <scratch-dir>/r2-mutants-ref/, beside a
#   node_modules/typescript symlink to the typescript that <clause-b.mjs>'s own directory resolves.
# Exit 0: every row as expected and limbs 2 and 3 identical. Exit 1: names each mismatched plant (limb 1) and each
#   differing plant and limb (2, 3). Exit 2: usage, or a plant did not apply to <tip>.
# The G1-* rows are the AR-163-DELONLY gap: they flip on purpose when that risk's fix lands, and its ticket edits them.
set -e
[ $# -eq 4 ] && [ -f "$4" ] || { echo "usage: r2-mutants.sh <repo> <tip> <scratch-dir> <absolute path to clause-b.mjs>" >&2; exit 2; }
REPO=$1; TIP=$2; mkdir -p "$3"; SC=$(cd "$3" && pwd); X=$SC/r2-mutants-clone; R=$SC/r2-mutants-ref; S=$4
REF=341da4c1; IP=.grugops/context/design-F-072-1/probe/clause-b.mjs
rm -rf "$X" "$R"; mkdir -p "$R/node_modules"
TSP=$(cd "$(dirname "$S")" && node -p 'path.dirname(require.resolve("typescript/package.json"))')
ln -s "$TSP" "$R/node_modules/typescript"; git -C "$REPO" show "$REF:$IP" > "$R/clause-b.$REF.mjs"; O=$R/clause-b.$REF.mjs
git clone -q --shared --no-checkout "$REPO" "$X"; cd "$X"
git -c advice.detachedHead=false checkout -q "$TIP"; git config user.email m@x; git config user.name mut
export GIT_AUTHOR_DATE=2026-10-21T00:00:00Z GIT_COMMITTER_DATE=2026-10-21T00:00:00Z   # fixed, so a re-run makes the same plant ids
T=$(git rev-parse --short=8 HEAD); H=src/book-file.ts
echo "tip $T; instrument sha256 $(shasum -a 256 "$S" | cut -c1-16); reference $REF sha256 $(shasum -a 256 "$O" | cut -c1-16)"
mk() { git diff --quiet && { echo "plant $1 did not apply at $(git rev-parse --short=8 HEAD)" >&2; exit 2; }
  git add -A >/dev/null; git commit -qm "$1"; git rev-parse --short=8 HEAD; }
ed() { perl -0pi -e "$2" "$1"; }   # one in-place edit; mk refuses a plant that changed nothing
BAD=""; DIFF=""
# row <plant> <base> <head> <expected verdict> <expected Ruling 2 files, or -> <note>
row() { local o v r2 fl got want l a b lo
  o=$(node "$S" "$2" "$3" 1)
  v=$(grep -E '^  limb 1: ' <<<"$o" | sed 's/^  limb 1: //')
  r2=$(grep -F '  (b1) Ruling 2 ' <<<"$o" | sed 's/^[^:]*: //' || true)
  fl=$(awk '/^  \(b1\) Ruling 2 /{f=1;next} f&&/^      /{print;next} {f=0}' <<<"$o" |
    sed -E 's/^ +([^ ]+) .*holds limb 1 at (.*)\)$/\1@\2/' | paste -sd ';' - || true)
  got="$v; R2 ${fl:--}"; want="$4; R2 $5"
  if [ "$got" = "$want" ] && { [ "$1" != NOH ] || [ -z "$r2" ] || [[ "$r2" == *"adds nothing" ]]; }; then a=ok; else a=MISMATCH; BAD="$BAD $1"; fi
  printf '%-7s %s..%s  %s\n        L1 expected  %s\n        L1 actual    %s   %s\n' "$1" "$2" "$3" "$6" "$want" "$got" "$a"
  printf '        (b1) capability: %s | (b1) Ruling 2: %s\n' "$(grep -F '  (b1) capability ' <<<"$o" | sed 's/.*: //')" "${r2:-(no such line)}"
  for l in 2 3; do lo=$(node "$S" "$2" "$3" $l)
    if [ "$lo" = "$(node "$O" "$2" "$3" $l)" ]; then b=identical; else b=DIFFERS; DIFF="$DIFF $1:limb$l"; fi
    printf '        L%s vs %s: %s (limb %s: %s)\n' $l $REF $b $l "$(grep -E '^  limb ' <<<"$lo" | sed 's/^  limb [0-9]: //')"
  done; }
# P2b: the holder's read becomes "/etc/passwd".
ed $H 's|readFileSync\(new URL\("../data/opening-book/book.json", import.meta.url\)\)|readFileSync("/etc/passwd")|'
M=$(mk P2b); row P2b $T $M FIRES "src/book-file.ts@<base> and <head>" "read becomes /etc/passwd"; git reset -q --hard $T
# P2c: the holder takes `path: string`; cli.ts passes a value from its options (`colour`).
ed $H 's|readBookFile\(\): Uint8Array|readBookFile(path: string): Uint8Array|; s|readFileSync\(new URL\([^\n]*\)\);|readFileSync(path);|'
ed src/cli.ts 's|read: readBookFile,|read: () => readBookFile(`data/opening-book/\${colour}.json`),|'
M=$(mk P2c); row P2c $T $M FIRES "src/book-file.ts@<base> and <head>" "path: string, from cli.ts options"; git reset -q --hard $T
# CMT: only a comment line of the holder changes.
ed $H 's|The composition root binds this function and nothing else calls it\.|The composition root binds this function; nothing else calls it.|'
M=$(mk CMT); row CMT $T $M FIRES "src/book-file.ts@<base> and <head>" "comment line only"; git reset -q --hard $T
# X1 (base-only): the holder drops its node:fs import and returns an empty array.
ed $H 's|import \{ readFileSync \} from "node:fs";\n\n||; s|return readFileSync\([^\n]*\);|return new Uint8Array(0);|'
M=$(mk X1); row X1 $T $M FIRES "src/book-file.ts@<base>" "holder at <base> only"; git reset -q --hard $T
# NOH (no holder): a + line in a non-holder file at f00038ef^1, before ABC-095; no file holds limb 1 at either end.
git -c advice.detachedHead=false checkout -q f00038ef^1; N=$(git rev-parse --short=8 HEAD)
printf '// r2-mutants NOH: a + line in a non-holder file\n' >> src/fen.ts
M=$(mk NOH); row NOH $N $M "does not fire" "-" "+ line in src/fen.ts, no holder"; git -c advice.detachedHead=false checkout -q $T
# G1-IMP (deletion only): the holder loses only its import line. AR-163-DELONLY gap.
ed $H 's|import \{ readFileSync \} from "node:fs";\n||'
M=$(mk G1-IMP); row G1-IMP $T $M "does not fire" "-" "AR-163-DELONLY gap: import line deleted only"; git reset -q --hard $T
# G1-GRD (deletion only, two commits): base guards the holder's read; head deletes only the guard line. AR-163-DELONLY gap.
ed $H 's|export function readBookFile\(\): Uint8Array \{\n  return readFileSync\(new URL\(("[^"]*"), import.meta.url\)\);|const BOOK = new URL($1, import.meta.url);\n\nexport function readBookFile(path: URL = BOOK): Uint8Array {\n  if (path !== BOOK) throw new Error("readBookFile: the fixed path only");\n  return readFileSync(path);|'
B=$(mk G1-GRD-base); ed $H 's|  if \(path !== BOOK\) throw [^\n]*\n||'
M=$(mk G1-GRD); row G1-GRD $B $M "does not fire" "-" "AR-163-DELONLY gap: guard line deleted only"; git reset -q --hard $T
[ -z "$BAD" ] && [ -z "$DIFF" ] && { echo "r2-mutants: 7 of 7 limb-1 rows as expected; limbs 2 and 3 identical to $REF on 7 of 7"; exit 0; }
[ -n "$BAD" ] && echo "r2-mutants: limb 1 MISMATCH:$BAD"
[ -n "$DIFF" ] && echo "r2-mutants: limbs 2/3 DIFFER from $REF:$DIFF"
exit 1
