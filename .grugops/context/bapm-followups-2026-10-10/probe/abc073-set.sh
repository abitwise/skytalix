#!/bin/bash
# ABC-073 live-set re-measure over whitespace-normalized text. usage: abc073-set.sh <repo-root>
cd "$1" || exit 2
col() { # board column holding the ticket id (first `- [ID]` line), by nearest preceding ## heading
  awk -v id="$1" '/^## /{h=$0} index($0,"- ["id"]")==1{print h; exit}' plans/board.md; }
for f in plans/tickets/*.md; do
  t=$(tr -s ' \n\t' ' ' < "$f")
  r=0; u=0; fs=0
  case "$t" in *'non-`.test.ts` file under'*) r=1;; esac
  case "$t" in *'reading is unruled (`ABC-072`)'*) u=1;; esac
  case "$t" in *'it fires and the gate resolves it'*) fs=1;; esac
  if [ $r = 1 ] || [ $u = 1 ]; then
    id=$(basename "$f" | cut -d- -f1-2)
    echo "$id restate=$r unruled=$u failsafe=$fs board=[$(col "$id")]"
  fi
done
