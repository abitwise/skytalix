#!/bin/bash
# Hash ABC-042 A1 row, ABC-065 describe, ABC-059 describe by start marker to first "^  });" / "^});".
F=$1
blk() { awk -v m="$1" -v e="$2" 'index($0,m)==1{on=1} on{print} on&&$0==e{exit}' "$F"; }
echo "A042-A1 $(blk '  it("A1 — AGENTS.md'"'"'s `Dev / run` line is the command that was run"' '  });' | tee /dev/null | wc -l | tr -d ' ') $(blk '  it("A1 — AGENTS.md'"'"'s `Dev / run` line is the command that was run"' '  });' | shasum -a 256 | cut -c1-16)"
echo "D065 $(blk 'describe("ABC-065 —' '});' | wc -l | tr -d ' ') $(blk 'describe("ABC-065 —' '});' | shasum -a 256 | cut -c1-16)"
echo "D059 $(blk 'describe("ABC-059 —' '});' | wc -l | tr -d ' ') $(blk 'describe("ABC-059 —' '});' | shasum -a 256 | cut -c1-16)"
