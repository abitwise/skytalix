#!/bin/bash
set -u; SC=$1
export HOME=$SC/home TMPDIR=$SC/tmp GIT_CONFIG_GLOBAL=$SC/home/.gitconfig GIT_CONFIG_NOSYSTEM=1
unset GIT_EXTERNAL_DIFF GIT_DIFF_OPTS
export GIT_AUTHOR_DATE=2026-10-21T00:00:00Z GIT_COMMITTER_DATE=2026-10-21T00:00:00Z
I=$SC/inst/cur.mjs; P=$SC/inst/fix.mjs; cd $SC/clone
T=837e8b22; ADD=78b6e009; git cat-file -e $ADD || exit 2
v() { node "$1" "$2" "$3" "$4" 2>&1 | grep -E '^  limb [123]: ' | sed 's/^  //'; }
git -c advice.detachedHead=false checkout -q $ADD
printf 'src/** diff=ext\n' > .gitattributes; git add .gitattributes; git commit -qm ADD+attr; ADDA=$(git rev-parse --short=8 HEAD)
git config diff.ext.command "$SC/inst/silent.sh"
git -c advice.detachedHead=false checkout -q $T; echo "head $ADDA (ADD + committed src/** diff=ext); ext command configured"
echo "R5c base checked out (no .gitattributes in tree): L1 cur=$(v $I $T $ADDA 1) fix=$(v $P $T $ADDA 1); L3 cur=$(v $I $T $ADDA 3)"
git -c advice.detachedHead=false checkout -q $ADDA
echo "R5d head checked out (.gitattributes in tree):    L1 cur=$(v $I $T $ADDA 1) fix=$(v $P $T $ADDA 1); L3 cur=$(v $I $T $ADDA 3) fix=$(v $P $T $ADDA 3)"
git config --unset diff.ext.command
echo "R5e head checked out, NO ext command:             L1 cur=$(v $I $T $ADDA 1)"
git -c advice.detachedHead=false checkout -q $T
# QE-191-b: non-ASCII production file name, unreached (QU) — and core.quotePath=false as a fix candidate
printf 'import { readFileSync } from "node:fs";\nexport const r = () => readFileSync("/etc/passwd");\n' > "src/qé.ts"; git add -A; git commit -qm QU; QU=$(git rev-parse --short=8 HEAD)
echo "QU  src/qé.ts unreached: L1 cur=$(v $I $T $QU 1); with -c core.quotePath=false in env: L1 cur=$(GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.quotePath GIT_CONFIG_VALUE_0=false v $I $T $QU 1)"
git -c advice.detachedHead=false checkout -q $T
git config --list --local | grep -E '^(color|diff)\.' && echo LEFTOVER || echo "clone config clean"
