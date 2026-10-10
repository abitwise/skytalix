#!/bin/bash
# ADR-0034 decision 2 scope reading: trigger-list files a diff touches that the shipped engine can load.
B=$1; H=$2
git diff --name-only "$B" "$H" \
  | grep -E '^src/(engine\.ts|search[^/]*\.ts|evaluate[^/]*\.ts|quiescence\.ts|transposition\.ts)$' \
  | grep -v '\.test\.ts$' \
  | while read -r f; do
      n=$(basename "$f")
      git grep -lF "\"./$n\"" "$H" -- 'src/*.ts' ':!src/*.test.ts' | grep -q . && echo "$f"
    done
