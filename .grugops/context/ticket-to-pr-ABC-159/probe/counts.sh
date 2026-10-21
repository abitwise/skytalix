#!/bin/bash
# usage: counts.sh <worktree> <outfile>   — one vitest run per test file, sequential, 400 MiB (ONE-FILE row)
cd "$1" || exit 2
out="$2"; : > "$out"; : > "$out.err"
files=$(NODE_OPTIONS=--max-old-space-size=400 npx vitest list --filesOnly 2>/dev/null | sed "s#^$PWD/##" | sort)
for f in $files; do
  NODE_OPTIONS=--max-old-space-size=400 npx vitest run "$f" --reporter=json > "$out.tmp" 2>>"$out.err"
  rc=$?
  jq -r --arg rc "$rc" '.testResults[] | "\(.assertionResults|length) \(.name) rc=\($rc) pend=\([.assertionResults[]|select(.status!="passed")]|length)"' "$out.tmp" | sed "s#$PWD/##" >> "$out"
done
rm -f "$out.tmp"
sort -k2 "$out" -o "$out"
