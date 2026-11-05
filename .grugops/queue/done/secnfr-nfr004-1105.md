---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-05T11:49:20Z
subtask: secnfr-nfr004-1105
role: security-nfr
ref: .grugops/context/secnfr-nfr004-1105/
branch: new grugops/secnfr-nfr004-1105 from main — worktree .claude/worktrees/secnfr-nfr004-1105
width: records only; nothing run. No test, build or engine.
---
# NFR-004 at the cap, first reading in play
Read the Architect's decision …1ce8828d, QE's gaps note …4f8f7f5d, A4's moves.tsv in qe-ABC-282's raw records, and secnfr-ABC-221's notes.
1. NFR-004's Verified-by cell in plans/nfr-catalog.md: settle its `UNKNOWN - verify` from the records: QE's A10 re-run and A4's reading.
2. AR-NFR004-A: re-accept with its number, or say why not. QE-223-d's +2.5 ms with it.
3. Say whether A4's 59 501 ms longest move, with foreign load present, changes any risk rating. A move ≥ 59 900 ms or an overshoot past about 31 ms would be a new question; report only, do not re-open.
Fences: plans/nfr-catalog.md and your records only. No src, ticket, ADR, EPIC or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task secnfr-nfr004-1105, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result
by: security-nfr (claude-opus-5-5), 2026-11-05T12:22:19Z. **PASS_WITH_RISKS.** Records only; nothing run.
- **`NFR-004`, `Verified by`: settled.** The `uci-clock-mode` `UNKNOWN - verify` is struck and kept. The 60 s clause reads MET on the real clock: QE's `A10` walls 59 500.1, 59 500.8 and 59 499.4 ms; A4's longest move 59 501 ms, 499 ms under 60 000. The levels 1–4 `UNKNOWN - verify` stands.
- **`AR-NFR004-A`: re-accepted with its number,** owner Security/NFR, bound ≤ 31 ms unchanged. `A10` +0.8 ms, QE-223-d +2.5 ms over 614 moves, A4 +3.9 ms over 118 moves at the abort. The +3.9 ms was read at a 23 s budget; at the cap A4 read +1 and 0 ms.
- **Rating: none changes.** QE-282-l stays LOW, QE-282-k MEDIUM, `AR-UCI-BUSY` ≤ 60 s. Neither trigger fired: 0 moves ≥ 59 900 ms, 0 overshoots past ~31 ms.
- **Thin:** the hard stop at 59 500 has 5 QE readings (3 in `A10`, 2 in play), and the load was light for 24 threads, so the stall tail under saturation is unread.
- **Left as found:** `NFR-009`'s same stale `UNKNOWN - verify`; `AR-UCI-BUSY`'s pending drain line; A4's nine logs, which `…1434a7d1` calls committed but which exist only in QE's worktree.
- **Records:** `plans/nfr-catalog.md`: one row, one `_Updated` line, one section; the other 11 rows hash identical. Notes `…bc10e2ed`, `…902cf6e2`. No src, test, ticket, ADR, EPIC or board edit.
