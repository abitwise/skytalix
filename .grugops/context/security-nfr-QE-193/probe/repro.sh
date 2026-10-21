#!/bin/bash
# Security/NFR QE-193 repro. Private HOME/GIT_CONFIG_GLOBAL/TMPDIR, GIT_CONFIG_NOSYSTEM=1, own clone.
set -e
REPO=/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example
W=$(cd "$(dirname "$0")" && pwd)
export HOME=$W/home GIT_CONFIG_GLOBAL=$W/home/gitconfig GIT_CONFIG_NOSYSTEM=1 TMPDIR=$W/tmp
export GIT_AUTHOR_DATE=2026-10-21T00:00:00Z GIT_COMMITTER_DATE=2026-10-21T00:00:00Z
IP=.grugops/context/design-F-072-1/probe/clause-b.mjs
HEADI=$REPO/$IP
R=$W/ref; rm -rf "$R/node_modules"; mkdir -p "$R/node_modules"
TSP=$(cd "$(dirname "$HEADI")" && node -p 'path.dirname(require.resolve("typescript/package.json"))')
ln -s "$TSP" "$R/node_modules/typescript"
git -C "$REPO" show 11245e3d:$IP > "$R/clause-b.base.mjs"; BASEI=$R/clause-b.base.mjs
cp "$HEADI" "$R/clause-b.fix.mjs"; FIXI=$R/clause-b.fix.mjs
# Fix prototype: headers only between `diff --git` and the first `@@`; one trailing TAB stripped from an unquoted header path.
perl -0pi -e 's/  const quoted = new Set\(\);/  let hdr = false;\n  const quoted = new Set();/;
  s/(\.split\("\\n"\)\) \{\n)/$1    if (line.startsWith("diff --git ")) hdr = true;\n    else if (line.startsWith("@@")) hdr = false;\n/;
  s/if \(\/\^\(\?:---\|\\\+\\\+\\\+\) "\/\.test\(line\)\)/if (hdr && \/^(?:---|\\+\\+\\+) "\/.test(line))/;
  s/if \(line\.startsWith\("--- "\)\) \{\n      const p = line\.slice\(4\);/if (hdr && line.startsWith("--- ")) {\n      const p = line.slice(4).replace(\/^([^"].*)\\t\$\/, "\$1");/;
  s/if \(line\.startsWith\("\+\+\+ "\)\) \{\n      const p = line\.slice\(4\);/if (hdr && line.startsWith("+++ ")) {\n      const p = line.slice(4).replace(\/^([^"].*)\\t\$\/, "\$1");/' "$FIXI"
diff -u "$HEADI" "$FIXI" > "$W/fix.patch" || true
X=$W/clone; rm -rf "$X"; git clone -q --shared --no-checkout "$REPO" "$X"; cd "$X"
git -c advice.detachedHead=false checkout -q aa86a1a1; git config user.email s@x; git config user.name snfr
T=$(git rev-parse --short=8 HEAD)
standin() { git -c core.quotePath=false diff -U0 --no-renames --text --no-textconv --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/ "$1" "$2" -- src | awk '/^diff --git /{h=0} /^@@/{h=1} /^(\+\+\+|---) / && (h || /\t$/)'; }
run() { # run <label> <base> <head>
  echo "=== $1  ($2..$3)"
  for L in 1 2 3; do
    for I in head base fix; do
      case $I in head) S=$HEADI;; base) S=$BASEI;; fix) S=$FIXI;; esac
      out=$(node "$S" "$2" "$3" $L)
      v=$(printf '%s\n' "$out" | grep "^  limb $L:" | sed 's/^  //')
      extra=$(printf '%s\n' "$out" | grep -E 'production files changed|C-quoted|fired by Ruling 2|^      src/[^ ]+:[0-9]+ ' | sed 's/^ */      /' | head -6)
      printf '  L%s %-4s %s\n' $L $I "$v"; [ "$L" = 1 ] || [ "$I" != head ] || [ -z "$extra" ] || printf '%s\n' "$extra"
      [ "$I" = fix ] && [ "$L" != 1 ] && [ -n "$extra" ] && printf '%s\n' "$extra" | sed 's/^/   fix:/'
      true
    done
  done
  echo "  stand-in:"; standin "$2" "$3" | sed 's/^/    | /'; echo "  stand-in end"
}
TAIL='
export async function leak(): Promise<string> {
  const u = process.env.FEN_URL ?? "";
  return (await fetch(u)).text();
}
'
plant() { # plant <label> <top-insert-text> -> commits on T, echoes sha
  git checkout -q "$T"
  perl -0pi -e "s/(\n\nimport \{ isSquareAttackedBy \})/\n\n$2\n\$1/" src/fen.ts
  printf '%s' "$TAIL" >> src/fen.ts
  git add -A; git commit -qm "$1"; git rev-parse --short=8 HEAD; }
PP_TPL=$(plant PP-TPL 'export const NOTE = `\n++ promoted pieces\n`;')
PP_CMT=$(plant PP-CMT '\/*\n++ promoted pieces\n*\/')
PP_CTL=$(plant PP-CTL 'export const NOTE = `\nx promoted pieces\n`;')
PP_REDIR=$(plant PP-REDIR 'export const NOTE = `\n++ b\/src\/glyph-mode.ts\n`;')
RA_PLUS=$(plant RA-PLUS 'export const NOTE = `\n++ \"quoted\" note\n`;')
# PP-L1: later hunk adds a node:fs read, no fetch/process
git checkout -q "$T"; perl -0pi -e 's/(\n\nimport \{ isSquareAttackedBy \})/\n\nexport const NOTE = `\n++ promoted pieces\n`;\n$1/' src/fen.ts
printf '\nexport function slurp(p: string): string {\n  return require("node:fs").readFileSync(p, "utf8");\n}\n' >> src/fen.ts
git add -A; git commit -qm PP-L1; PP_L1=$(git rev-parse --short=8 HEAD)
# PP-EDIT: limb-2 holder cli.ts; a ++ line near the top, then an existing process read edited in place far below
git checkout -q "$T"; perl -0pi -e 's/(\nfunction |\nexport function |\nasync function )/\nexport const NOTE = `\n++ promoted pieces\n`;\n$1/' src/cli.ts
perl -pi -e 's/resolveOptions\(process\.argv\.slice\(2\)\)/resolveOptions(process.argv.slice(1))/' src/cli.ts
git add -A; git commit -qm PP-EDIT; PP_EDIT=$(git rev-parse --short=8 HEAD)
# SP base: src/q t.ts benign, imported by cli.ts. SP-N5 head: q t.ts gains node:fs + fetch + process.env. SP-N4: new unreached file.
git checkout -q "$T"; printf 'export const q = 1;\n' > "src/q t.ts"
perl -0pi -e 's/(\nimport )/\nimport { q as qq } from ".\/q t.ts";\nvoid qq;$1/' src/cli.ts
git add -A; git commit -qm SP-BASE; SP_B=$(git rev-parse --short=8 HEAD)
printf 'import { readFileSync } from "node:fs";\nexport const q = 1;\nexport const r = () => readFileSync(process.env.Q ?? "x", "utf8");\nexport const f = () => fetch("http://x");\n' > "src/q t.ts"
git add -A; git commit -qm SP-N5; SP_N5=$(git rev-parse --short=8 HEAD)
git checkout -q "$T"; printf 'import { readFileSync } from "node:fs";\nexport const r = () => readFileSync(process.env.Q ?? "x", "utf8");\n' > "src/w t.ts"
git add -A; git commit -qm SP-N4; SP_N4=$(git rev-parse --short=8 HEAD)
run PP-TPL "$T" "$PP_TPL"
run PP-CMT "$T" "$PP_CMT"
run PP-CTL "$T" "$PP_CTL"
run PP-REDIR "$T" "$PP_REDIR"
run PP-L1 "$T" "$PP_L1"
run PP-EDIT "$T" "$PP_EDIT"
run RA-PLUS "$T" "$RA_PLUS"
run SP-N5 "$SP_B" "$SP_N5"
run SP-N4 "$T" "$SP_N4"
echo "=== waiver form on SP-N5 / PP-TPL"; git -c core.quotePath=false diff --name-only "$SP_B" "$SP_N5" | grep -v '\.test\.ts$' | grep '^src/' | cat -vet | head; git -c core.quotePath=false diff --name-only "$T" "$PP_TPL" | grep -v '\.test\.ts$' | grep '^src/'
echo "=== raw headers SP-N5"; git -c core.quotePath=false diff -U0 --no-renames --src-prefix=a/ --dst-prefix=b/ "$SP_B" "$SP_N5" -- src | grep -E '^(---|\+\+\+) ' | cat -vet
echo "=== raw PP-TPL lines"; git diff -U0 --no-color "$T" "$PP_TPL" -- src | grep -nE '^(@@|\+\+\+|---)'
echo "=== stand-in under GIT_DIFF_OPTS=--unified=5 on PP-TPL / PP-CTL"; export GIT_DIFF_OPTS=--unified=5; echo TPL:; standin $T $PP_TPL; echo CTL:; standin $T $PP_CTL; echo "fix L3 TPL: $(node $FIXI $T $PP_TPL 3 | grep "limb 3:")"; unset GIT_DIFF_OPTS
cd "$W"; echo "=== route check"; git -C "$X" config --local --get-regexp '^(color|diff)\.' || echo "no color/diff keys"
echo "=== space+quote and tab names (head instrument, limb 2)"; cd "$X"; git checkout -q "$T"; printf 'x\n' > 'src/a "b.ts'; printf 'x\n' > "src/c	d.ts"; git add -A; git commit -qm Q2; Q2=$(git rev-parse --short=8 HEAD)
git -c core.quotePath=false diff -U0 --src-prefix=a/ --dst-prefix=b/ "$T" "$Q2" -- src | grep -E '^(---|\+\+\+) ' | cat -vet
node "$HEADI" "$T" "$Q2" 2 | grep -E 'limb 2:|C-quoted' | cat -vet
echo "=== instrument limb 1 on SP-N5 (baseline names the new holder, verdict silent)"; node "$HEADI" "$SP_B" "$SP_N5" 1 | grep -E 'Ruling 2|baseline|limb 1:'
echo "=== stand-in over main history (first-parent commits touching src, and root..tip)"
n=0; hits=0; for c in $(git rev-list --first-parent "$T" -- src); do p=$(git rev-parse -q --verify $c^1) || continue; n=$((n+1)); o=$(standin $p $c); [ -n "$o" ] && { hits=$((hits+1)); echo "HIT $c"; }; done; echo "commits: $n; hits: $hits"
root=$(git rev-list --max-parents=0 "$T" | tail -1); echo "root..tip lines: $(standin $root $T | wc -l | tr -d ' ')"
echo "=== route check"; git config --local --get-regexp '^(color|diff)\.' || echo "no color/diff keys in clone"
