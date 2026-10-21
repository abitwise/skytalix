#!/bin/bash
# ABC-182: the committed Ruling 2 plants (ADR-0036 § S1 Ruling 2, folded into clause-b.mjs by ABC-163, widened to
# `+` and `-` lines by ABC-188). Ten plants, each with its EXPECTED limb-1 verdict printed beside the ACTUAL one
# (Architect `…34e592ac`; bodies as QE `…7f56f339`, G1B as Security/NFR's G-1b `…3b895278` § 2).
# Same harness shape as f-mutants.sh: plants live in a `git clone --shared` under <scratch-dir>; the repository is
# never written.
# usage: r2-mutants.sh <repo> <tip> <scratch-dir> <absolute path to clause-b.mjs>
#   <tip> is a commit id; the holder plants are made on it, NOH on f00038ef^1 (before ABC-095: no limb-1 holder).
# Limb 1 is read from the `(b1) capability` line, the `(b1) Ruling 2` line and the files listed under it, and the
#   `limb 1:` verdict line, never from a bare `(b1)` grep (Architect decision 2, G-3). A row compares the verdict and
#   the Ruling 2 file list (`file@ends`); NOH also needs `adds nothing` whenever a `(b1) Ruling 2` line is printed.
#   Each Ruling 2 file line is also printed whole (`R2 file`), with its `+` and `-` counts (ABC-188).
# Limbs 2 and 3 of every plant are compared byte for byte with the 341da4c1 instrument. The script makes that copy
#   itself: `git -C <repo> show 341da4c1:<instrument path>` into <scratch-dir>/r2-mutants-ref/, beside a
#   node_modules/typescript symlink to the typescript that <clause-b.mjs>'s own directory resolves.
# Each plant names the files it edits. `mk` refuses it (exit 2, naming the plant) unless `git diff --name-only` of the
#   plant is exactly those files, so a plant that applies only in part never runs under its full label (QE-182-a).
# Exit 0: every row as expected and limbs 2 and 3 identical. Exit 1: names each mismatched plant (limb 1) and each
#   differing plant and limb (2, 3). Exit 2: usage, or a plant did not apply to <tip> exactly as named.
# G1-IMP, G1-GRD, G1B, UNC1 and REN are deletion-only in a limb-1 holder (`AR-163-DELONLY`, closed by ABC-188): each
#   FIRES on the instrument from ABC-188, and none fires on the one before it.
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
# mk <plant> <file>...: commit the plant if the files it changed are exactly <file>... (QE-182-a), else exit 2.
mk() { local p=$1 got want; shift; git add -A >/dev/null
  got=$(git diff --cached --name-only --no-renames | LC_ALL=C sort | paste -sd ' ' -)
  want=$(printf '%s\n' "$@" | LC_ALL=C sort | paste -sd ' ' -)
  [ "$got" = "$want" ] || { echo "plant $p did not apply at $(git rev-parse --short=8 HEAD): changed [$got], names [$want]" >&2; exit 2; }
  git commit -qm "$p"; git rev-parse --short=8 HEAD; }
ed() { perl -0pi -e "$2" "$1"; }   # one in-place edit; mk checks the plant's file list
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
  awk '/^  \(b1\) Ruling 2 /{f=1;next} f&&/^      /{sub(/^ +/,""); print "        R2 file      " $0; next} {f=0}' <<<"$o"
  for l in 2 3; do lo=$(node "$S" "$2" "$3" $l)
    if [ "$lo" = "$(node "$O" "$2" "$3" $l)" ]; then b=identical; else b=DIFFERS; DIFF="$DIFF $1:limb$l"; fi
    printf '        L%s vs %s: %s (limb %s: %s)\n' $l $REF $b $l "$(grep -E '^  limb ' <<<"$lo" | sed 's/^  limb [0-9]: //')"
  done; }
# P2b: the holder's read becomes "/etc/passwd".
ed $H 's|readFileSync\(new URL\("../data/opening-book/book.json", import.meta.url\)\)|readFileSync("/etc/passwd")|'
M=$(mk P2b $H); row P2b $T $M FIRES "src/book-file.ts@<base> and <head>" "read becomes /etc/passwd"; git reset -q --hard $T
# P2c: the holder takes `path: string`; cli.ts passes a value from its options (`colour`).
ed $H 's|readBookFile\(\): Uint8Array|readBookFile(path: string): Uint8Array|; s|readFileSync\(new URL\([^\n]*\)\);|readFileSync(path);|'
ed src/cli.ts 's|read: readBookFile,|read: () => readBookFile(`data/opening-book/\${colour}.json`),|'
M=$(mk P2c $H src/cli.ts); row P2c $T $M FIRES "src/book-file.ts@<base> and <head>" "path: string, from cli.ts options"; git reset -q --hard $T
# CMT: only a comment line of the holder changes.
ed $H 's|The composition root binds this function and nothing else calls it\.|The composition root binds this function; nothing else calls it.|'
M=$(mk CMT $H); row CMT $T $M FIRES "src/book-file.ts@<base> and <head>" "comment line only"; git reset -q --hard $T
# X1 (base-only): the holder drops its node:fs import and returns an empty array.
ed $H 's|import \{ readFileSync \} from "node:fs";\n\n||; s|return readFileSync\([^\n]*\);|return new Uint8Array(0);|'
M=$(mk X1 $H); row X1 $T $M FIRES "src/book-file.ts@<base>" "holder at <base> only"; git reset -q --hard $T
# NOH (no holder): a + line in a non-holder file at f00038ef^1, before ABC-095; no file holds limb 1 at either end.
git -c advice.detachedHead=false checkout -q f00038ef^1; N=$(git rev-parse --short=8 HEAD)
printf '// r2-mutants NOH: a + line in a non-holder file\n' >> src/fen.ts
M=$(mk NOH src/fen.ts); row NOH $N $M "does not fire" "-" "+ line in src/fen.ts, no holder"; git -c advice.detachedHead=false checkout -q $T
# G1-IMP (deletion only): the holder loses only its import line. AR-163-DELONLY.
ed $H 's|import \{ readFileSync \} from "node:fs";\n||'
M=$(mk G1-IMP $H); row G1-IMP $T $M FIRES "src/book-file.ts@<base>" "AR-163-DELONLY: import line deleted only"; git reset -q --hard $T
# G1-GRD (deletion only, two commits): base guards the holder's read; head deletes only the guard line. AR-163-DELONLY.
ed $H 's|export function readBookFile\(\): Uint8Array \{\n  return readFileSync\(new URL\(("[^"]*"), import.meta.url\)\);|const BOOK = new URL($1, import.meta.url);\n\nexport function readBookFile(path: URL = BOOK): Uint8Array {\n  if (path !== BOOK) throw new Error("readBookFile: the fixed path only");\n  return readFileSync(path);|'
B=$(mk G1-GRD-base $H); ed $H 's|  if \(path !== BOOK\) throw [^\n]*\n||'
M=$(mk G1-GRD $H); row G1-GRD $B $M FIRES "src/book-file.ts@<base> and <head>" "AR-163-DELONLY: guard line deleted only"; git reset -q --hard $T
# G1B (deletion only, two commits; Security/NFR G-1b): base adds a no-parameter stat guard; head deletes only its `if` line.
ed $H 's|import \{ readFileSync \} from "node:fs";|import { readFileSync, statSync } from "node:fs";|; s|export function readBookFile\(\): Uint8Array \{\n  return readFileSync\(new URL\(("[^"]*"), import.meta.url\)\);|const BOOK = new URL($1, import.meta.url);\n\nexport function readBookFile(): Uint8Array {\n  const st = statSync(BOOK);\n  if (!st.isFile() \|\| st.size > 1_048_576) throw new Error("readBookFile: not a regular file of at most 1 MB");\n  return readFileSync(BOOK);|'
B=$(mk G1B-base $H); ed $H 's|  if \(!st\.isFile\(\) [^\n]*\n||'
M=$(mk G1B $H); row G1B $B $M FIRES "src/book-file.ts@<base> and <head>" "AR-163-DELONLY: no-parameter guard deleted only"; git reset -q --hard $T
# UNC1 (deletion only, two commits; limb 1 of AR-163-UNCOMMENT): base comments out an import at the top of src/book.ts;
#   head deletes only the two delimiter lines.
ed src/book.ts 's|\A|/*\nimport { readFileSync } from "node:fs";\n*/\n|'
B=$(mk UNC1-base src/book.ts); ed src/book.ts 's|\A/\*\n(import [^\n]*\n)\*/\n|$1|'
M=$(mk UNC1 src/book.ts); row UNC1 $B $M FIRES "src/book.ts@<head>" "AR-163-DELONLY: comment delimiters deleted only"; git reset -q --hard $T
# REN (rename and drop): the holder becomes src/book-reader.ts with no node:fs import, returning an empty array; the
#   cli.ts import follows. Under --no-renames the old path is deleted whole.
mv $H src/book-reader.ts
ed src/book-reader.ts 's|import \{ readFileSync \} from "node:fs";\n\n||; s|return readFileSync\([^\n]*\);|return new Uint8Array(0);|'
ed src/cli.ts 's|from "\./book-file\.ts";|from "./book-reader.ts";|'
M=$(mk REN $H src/book-reader.ts src/cli.ts); row REN $T $M FIRES "src/book-file.ts@<base>" "AR-163-DELONLY: holder renamed away, import dropped"; git reset -q --hard $T
[ -z "$BAD" ] && [ -z "$DIFF" ] && { echo "r2-mutants: 10 of 10 limb-1 rows as expected; limbs 2 and 3 identical to $REF on 10 of 10"; exit 0; }
[ -n "$BAD" ] && echo "r2-mutants: limb 1 MISMATCH:$BAD"
[ -n "$DIFF" ] && echo "r2-mutants: limbs 2/3 DIFFER from $REF:$DIFF"
exit 1
