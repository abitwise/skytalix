#!/usr/bin/env bash
# usage: a1pair.sh <headDir> [skipBase]  — A1 rows for base (once) and head, then cmp
set -uo pipefail
S=$(dirname "$(readlink -f "$0")")
cd "$S"
head=$1
if [ ! -f a1-base.jsonl ]; then
  { time bash h/run-a1.sh "$S/base" a1-base.jsonl 8; } > a1-base.log 2>&1
fi
{ time bash h/run-a1.sh "$S/$head" "a1-$head.jsonl" 8; } > "a1-$head.log" 2>&1
tail -n 6 a1-base.log "a1-$head.log"
if cmp a1-base.jsonl "a1-$head.jsonl"; then echo "A1 $head: BYTE-EQUAL"; else echo "A1 $head: DIFFERS"; fi
echo "impure rows head: $(grep -c '"pure":false' "a1-$head.jsonl")"
