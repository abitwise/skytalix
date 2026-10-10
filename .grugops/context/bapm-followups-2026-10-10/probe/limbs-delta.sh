#!/bin/bash
# ABC-072 A3 fixtures: clause (b) limb tokens on the + side of production files, and new import edges.
# usage: limbs-delta.sh <repo> <base> <head>. Rough reading for BA/PM only; the instrument is ABC-072's hop.
REPO=$1; B=$2; H=$3
PROD=$(git -C "$REPO" diff --name-only "$B" "$H" -- 'src/*.ts' ':!src/*.test.ts')
echo "production files: $(echo "$PROD" | grep -c .)"
echo "+ lines with a limb token, comment lines dropped: $(git -C "$REPO" diff -U0 "$B" "$H" -- 'src/*.ts' ':!src/*.test.ts' | grep -E '^\+[^+]' | grep -vE '^\+\s*(//|\*|/\*)' | grep -cE 'from "node:|import\("node:|\bprocess\.|\b(spawn|spawnSync|exec|execSync|execFile|fork|fetch|eval)\s*\(|new\s+Function')"
echo "+ import/export-from edges:"; git -C "$REPO" diff -U0 "$B" "$H" -- 'src/*.ts' ':!src/*.test.ts' | grep -E '^\+\s*(import|export).*from' | sed 's/^/  /'
