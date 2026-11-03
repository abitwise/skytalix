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

## Result
by: architect-design (claude-opus-5-5), at: 2026-11-03T20:21:22Z. Records only. The one run was a data-size probe under the host lock (the export's index files plus HTTP HEAD, under 2 s; `.grugops/context/arch-owner-answers-1103/raw/lichess-probe.txt`).
- **ADR-0067: ACCEPTED 2026-11-03, IN FORCE as the method.** E2-pre (`ABC-274`) merged at `2410d4f7` (QE `…fa87f74d`); F8 did not fire. Decision-log rows, a decision 9 pointer, B-T8 approved, and a § Consequences dated line (item 8: `ABC-270`'s design starts now; the build order is the Orchestrator's).
- **ADR-0067 § Addendum 2026-11-03, the data pin:** `lichess_db_standard_rated_2017-03.pgn.zst` (2 169 142 067 B, 11 346 745 games, sha256 `b319297e…4320`).
  - Game filters: rated standard, base ≥ 180 s, both ratings ≥ 2000 with a gap ≤ 200, `Termination` Normal, no BOT, legal replay, de-dup.
  - Positions: ply ≥ 16, key-hash mod 8, not in check, quiet; leakage dropped on the Lichess side only.
  - Cap 1 000 000 positions; STOP below 250 000. The file is streamed via `node:zlib` zstd. Heap flag 3000 MB. One run is estimated at 10–15 min, with a hard limit of 30 min.
  - Validation is own games only. **Own games carry 0.5 of the loss.** K is fitted per source. Material stays frozen.
  - Provenance: URL, bytes and sha256 in the manifest (never a local path); the tool refuses a wrong hash.
  - B-T0–B-T8 and F1–F7 re-read: **no bar moved.**
- **ADR-0056:** status fold, D2 and D7 dated lines. Q-3K-7 (a) yes / (b) no / (c) no, B-T8 approved, Q-3K-9 yes. Still open: Q-3K-6 and Q-3K-8.
- **ADR-0024:** d4 is open for **Q1's design only**. A build ships on C2′, 100 games at 100 ms.
- **ADR-0048:** Lichess CC0 data is admitted for tuning. It is data, not code, with its provenance in the tool's output. `NOTICE` is unchanged.
- **SEC-HP-2 (`ABC-277` A7):** line 5 is now `foreign=[<foreign: vitest> count=3]`, a one-line commit `1e558566`. A7's page says "2 processes", but the line held 3 (owed to BA/PM).
- **Notes:** `arch-owner-answers-1103` `20261103T202041Z-architect-design-decision-ab9f83a3`, `20261103T202049Z-architect-design-observation-08beac19` (artifacts), `20261103T202049Z-architect-design-observation-e81f6b25` (owed lines: BA/PM's `ABC-239` / `ABC-277` / `EPIC-011` / Q1; Architect later: `ADR-0064` pointer, `ADR-0067` decision 9 label).
- **Owner questions: none.**
