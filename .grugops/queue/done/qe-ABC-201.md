---
subtask: qe-ABC-201
role: qe-e2e
ticket: plans/tickets/ABC-201-on-a-fresh-git-clone-npm-install-then-npm-run-chess-starts-a-playable-game-and-the-first-board-in-under-2-s.md
ref: .grugops/context/qe-ABC-201/
inputs: Security/NFR …9da46c78, …636a410f (task security-nfr-timing-2026-10-23; raw files under probe/p2)
width: 2 (beside arch-floor-reread, records only)
---

# QE hop for ABC-201: re-read the fresh-clone reading

## Do
- Re-read A1–A4 from the raw evidence in `.grugops/context/security-nfr-timing-2026-10-23/probe/p2/` **before** opening Security/NFR's notes.
- Then take your own short re-reading on a fresh `git clone` of `main` (`c0585331`) in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe201/`, with an empty npm cache and empty user config:
  - A1: install.
  - A2: the piped smoke run.
  - A3: at least 10 launches with the same instrument copy. Precondition before the A3 runs: AC, load1 ≤ 8, no foreign vitest. If the host does not qualify, mark A3 re-read UNRESOLVED and rely on the recorded reading.
- `main` now includes ABC-200. On a pipe, the first board must be unchanged (A6 of ABC-200). Say whether the 23-newline pin still holds.
- Verdict: PASS, PASS_WITH_GAPS or FAIL, with a gap register (`QE-201-x`). UAT is waived (0 production lines).

## Fences
- Scratch clones only. Commit notes plus a `## QE` section on the ABC-201 page on `grugops/qe-ABC-201` (worktree `../wt-qe-ABC-201` from `main`). No `src/`, `package*.json`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `qe-ABC-201`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

QE/E2E, 2026-10-23T08:00–08:05Z. **PASS_WITH_GAPS** (5 INFO gaps, none blocking). Branch `grugops/qe-ABC-201` @ `3a330853`
(worktree `../wt-qe-ABC-201` from `main` `e9ed895e`). Not merged, not pushed.

- **Raw re-read first** (`probe/p2/`, all RUNSUMS and pre-registration sums OK). The recorded A1–A4 hold: A3 recomputed
  188.3 / 192.6 / 220.9 ms, with child 1 = 220.9. The A4 catalog edit is one cell insertion, and every other `NFR-` line
  is byte-identical. The notes were opened after QE's own reading, and they match.
- **QE's own fresh clone at `c0585331`** (empty cache, empty user config). Preconditions: AC, load1 3.39–4.34, thermal 0,
  0 vitest; gate 13 polls over 61 s, all OK. A1 rc 0 (66 packages, 1.76 s). A2 exit 0, 0 stderr bytes, `1. e4 c5`,
  `input ended` ×1. **A3 MET 196.0 / 204.3 / 227.2 ms**, n 10, with the first launch (227.2) counted.
- **23-newline pin with ABC-200 merged: HOLDS.** Child 1 is byte-identical to the pre-ABC-200 child 1 (`4e7ace1164fb…`). With
  no flags on a pipe, 0 questions are written, and the output equals the recorded A2 byte-for-byte.
- **Gaps:** `QE-201-a` (the reply is a book draw, not a pin), `-b` (the records cite only `c91445e3`), `-c` (+12 ms at a higher
  load, not attributed), `-d` (`9f245333` covers 3 cells), `-e` (same M3; host-bounded and disk-cold are unchanged).
- **Notes:** `…960922fe` (raw re-read), `…0a5d72bb` (own reading), `…400f9aef` (gaps), `…02ef046d` (verdict).

**Trace row** (for the Orchestrator):

| ABC-201 (qe-ABC-201) | QE: recorded A1–A4 re-read from raw p2 (hold; A3 188.3/192.6/220.9 ms); own fresh clone at c0585331 (main with ABC-200): A1 rc 0, A2 exit 0 1. e4 c5, A3 MET 196.0/204.3/227.2 ms n 10 first launch counted; 23-newline pin holds (child 1 byte-identical to pre-ABC-200) | EPIC-006 | — | NFR-007 (MET, bar unchanged); ADR-0018 D3 not fired; AR-096-DISKCOLD unchanged; QE-201-a/-b/-c/-d/-e INFO | grugops/qe-ABC-201 @ 3a330853<br>.grugops/context/qe-ABC-201/notes/ (4), ABC-201 page ## QE | same instrument copy nfr007-201.mjs d3940487c808… + readout201.py b46d8ee22dca…; driver qe201.sh 3921fc07…; raw child-1 4e7ace1164fb…, A2 920135d919b1…, no-flags pipe 96a13b85f6f4… | UAT waived (0 production lines; not a signature) | — | In Review → Orchestrator (QE PASS_WITH_GAPS …02ef046d; card move and EPIC-006 closure the Orchestrator's) |
