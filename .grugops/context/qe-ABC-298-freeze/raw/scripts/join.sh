#!/usr/bin/env bash
# qe-ABC-298-freeze: join the G4 parts into the SG1 (b) digest. Pure file work, no engine run.
#   bash join.sh <outDir>   -> <outDir>/g4.jsonl, g4-sample.jsonl, g4-digest.txt
# g4.jsonl is g4-0-corpus .. g4-6-ordering-15 in name order (corpus, lists, choose, search, doors, unpruned, then the
# 16 ordering shards); g4-sample.jsonl is the unpruned depth-5 sample. The head's run joins the same way, so the two
# compare byte for byte (cmp) and by sha256.
set -euo pipefail
O=$1; cd "$O"
parts=$(ls g4-[0-6]-*.jsonl | sort)
[ "$(ls g4-6-ordering-*.jsonl | wc -l)" -eq 16 ] || { echo "need 16 ordering shards" >&2; exit 1; }
cat $parts > g4.jsonl
cp g4-9-sample.jsonl g4-sample.jsonl
{
  echo "# per part: lines sha256 name"
  for f in $parts g4-9-sample.jsonl; do echo "$(wc -l < "$f") $(sha256sum "$f" | cut -d' ' -f1) $f"; done
  echo "# joined: lines sha256 name"
  for f in g4.jsonl g4-sample.jsonl; do echo "$(wc -l < "$f") $(sha256sum "$f" | cut -d' ' -f1) $f"; done
  echo "# rows with pure:false: $(grep -c '"pure":false' g4.jsonl g4-sample.jsonl | tr '\n' ' ')"
} > g4-digest.txt
cat g4-digest.txt
