---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T20:07:55Z
subtask: arch-owner-answers-1103
role: architect-design
ref: .grugops/context/arch-owner-answers-1103/
branch: new grugops/arch-owner-answers-1103 from main — worktree .claude/worktrees/arch-owner-answers-1103
width: records only; no test, build or engine run except a ≤ 5 min data-size probe (download headers / sizes only) if you need one, under `flock <scratch>/host-test.lock <cmd>`. Write host paths only as placeholders (<home> <repo> <scratch>).
---
# Fold owner answers …af126c04 into the ADRs, and pin the Lichess data for ABC-239
Source: Orchestrator note `20261103T200613Z-orchestrator-decision-af126c04` (owner verbatim "1. yes ; 2. yes ; 3. no ; 4. no ; 5. ok yes ; 6. yes ; 7. yes; 8. yes").
- ADR-0067 → ACCEPTED 2026-11-03; IN FORCE as method. ABC-274 (E2-pre) merged to local main (merge sha in the Orchestrator's board line; read `git log main`). Decision log row.
- ADR-0056: Q-3K-7 (a) YES — public-domain Lichess database export (CC0) allowed as training data beside own self-play; (b) NO — no Stockfish-labelled targets; (c) NO — our games vs Stockfish are never training data (they stay the outside measure). B-T8 APPROVED (200+200 outside pair, ~5 h, before ABC-239 merges). Q-3K-9 YES. Update the "still open" lines (Q-3K-6, Q-3K-8 remain open).
- ADR-0024: d4 OPENED by owner word for the design of Q1 (SEE pruning of losing captures) — design only; any build ships on its own evidence (per-change 100 games at 100 ms).
- ADR-0048 (licence): dated line that Lichess CC0 data is admitted for tuning (data, not code; provenance recorded in the tool's output).
- **ADR-0067 addendum — data pin for (a):** which Lichess export (standard rated, which month(s) and why), how big a slice (must fit host disk/RAM and a ≤ 30 min fit run; give the numbers), rating-band / time-control filter, de-dup, quiet-position filter, the train/validation split with own games, the mix weight vs own games, and how the tool records provenance (URL + sha256). Re-read B-T0–B-T8 and F1–F7 against the new data; move no bar — if one must move, say so as a question.
- ABC-277 A7 / SEC-HP-2 YES: forward-redact line 5 of `.grugops/context/se-ABC-262/raw/gates/summary.txt` to placeholders (one-line commit). No history rewrite.
## Fences
memory-bank/50-decisions, that one summary.txt line, and your records. Do NOT edit ticket pages or EPIC-011 — list owed lines in a note for BA/PM. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task arch-owner-answers-1103, contextRoot = worktree's .grugops/context, `at` from `date -u`); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.
