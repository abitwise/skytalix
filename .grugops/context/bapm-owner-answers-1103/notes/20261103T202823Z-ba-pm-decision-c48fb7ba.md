---
id: 20261103T202823Z-ba-pm-decision-c48fb7ba
kind: decision
by: ba-pm
at: 2026-11-03T20:28:23Z
verified_by: 
confidence: high on the folds (the owner's verbatim answers, the merged addendum and merges read with git log); BA/PM's calls stated with reasons: DoR row 3 ✅ (ABC-215 precedent), P3 → P2; figures copied from ADR-0067 § Addendum, estimates kept UNKNOWN - verify
refs:
  - bapm-owner-answers-1103
  - grugops/bapm-owner-answers-1103
  - ABC-239
  - ABC-274
  - ABC-277
  - ABC-270
  - ABC-269
  - ABC-273
  - EPIC-011
  - ADR-0067
  - ADR-0048
  - ADR-0024
  - ADR-0056
  - Q-3K-7
  - Q-3K-9
  - Q-3K-6
  - Q-3K-8
  - B-T7
  - B-T8
  - SEC-HP-2
  - Q1
  - E2
  - E2-pre
  - NFR-008
  - RISK-EPIC010-05
  - QE-274-b
  - bdecb7e1
  - 2410d4f7
  - 54dee3f2
  - 1e558566
  - 5a254b61
  - orch-2026-10-30a/20261103T200613Z-orchestrator-decision-af126c04
  - arch-owner-answers-1103/20261103T202041Z-architect-design-decision-ab9f83a3
  - arch-owner-answers-1103/20261103T202049Z-architect-design-observation-e81f6b25
  - qe-ABC-274/20261103T143139Z-qe-e2e-decision-fa87f74d
supersedes: 
seal: sha256:af1036a9df2e179ca8f0c5a0e3f1d7d46720c3ac369f43dafc038c6a1da86e54
---

# bapm-owner-answers-1103 decision: `ABC-239` re-scored DoR 10/10, Ready (P3 → P2), on the owner's answers `…af126c04` and `ADR-0067` § Addendum 2026-11-03; no bar moved

BA/PM, task `bapm-owner-answers-1103`, on `grugops/bapm-owner-answers-1103` from `main` `bdecb7e1`. Records only;
nothing run but a read of commit `1e558566` and the records path check. Sources: the owner's answers
`orch-2026-10-30a` `…af126c04` (verbatim "1. yes ; 2. yes ; 3. no ; 4. no ; 5. ok yes ; 6. yes ; 7. yes; 8. yes"),
the Architect's fold `arch-owner-answers-1103` (decision `…ab9f83a3`, owed lines `…e81f6b25`), `ADR-0067` § Addendum.

## `ABC-239` (page `plans/tickets/ABC-239-…`)
- **A1:** the data is own self-play games plus the Lichess `2017-03` export
  (`lichess_db_standard_rated_2017-03.pgn.zst`, 2 169 142 067 bytes, sha256 as pinned in the addendum), CC0, training
  only, ≤ 1 000 000 positions, own share 0.5 of the loss, validation own games only. Given/when/then rows: the manifest
  names the export by URL, byte length and sha256 (never a local path); a differing sha256 exits non-zero and writes
  nothing; no Stockfish-labelled target (Q-3K-7 (b) no); no game against Stockfish (Q-3K-7 (c) no); every comment
  dropped unread.
- **A6:** B-T7 (100 games at 100 ms, GAIN ≥ 50.0 by C2′; S′ at E 1 810; the Levels deep lane) **and B-T8** (200 + 200
  against Stockfish 19 at 0.5 s, ≈ 5 h, point estimate ≥ 0), **owner-approved, both before the merge.** The "if he
  declines" branch is void. `rpair` versus two `r` reads stays the Orchestrator's (`UNKNOWN - verify`, unchanged).
- **§ What happens on a miss (new):** bars take `ADR-0067` F1–F8. The four data-stage stops, each a STOP to
  Architect/Design with its count, not a bar: under 250 000 Lichess rows; reader drops over 0.1 %; a run over 30 min;
  a heap over the 3 000 MB flag.
- **Test note 4 (new):** the addendum's six rows (comment blindness, the known-issue parse, filter counts, the sha256
  refusal, leakage direction, a `.pgn.zst` fixture). NFR line: one run ≤ 30 min under `--max-old-space-size=3000`,
  peak RSS recorded, no network call.
- **Dependencies:** `ABC-269` (`54dee3f2`) and `ABC-274` (`2410d4f7`) merged; `ADR-0067` ACCEPTED; Q-3K-7 answered;
  B-T8 approved; `ABC-273` Done. One manual precondition, not a blocker: the hand download and `sha256sum -c`.
- **DoR 8/10 → 10/10.** Row 10 flips (no blocker left). Row 3 flips too: it was ⚠ for "L; depends on" the two merges.
  Both merged, so it is independent; L stays, with the split rule stated and not firing (one module; the Lichess reader
  ships nothing alone, its value is read only through the fit), on `ABC-215`'s precedent (L ✅ with a stated split,
  independent once predecessors merge). This is BA/PM's judgement; if the Orchestrator reads L as ⚠, the score is 9/10
  and nothing else changes.
- **Front matter → Ready** (BA/PM's exit). The brief's "Ready for Dev" is the Orchestrator's board move.
- **Priority P3 → P2** (BA/PM's call at the re-score): it is the next pull, and `ABC-270` (P2) waits on it. The
  Orchestrator may set it back.
- **Size stays L.** Not split: the Lichess reader is inside `tools/tune/`.

## No Q1 ticket
Not cut: its ADR (`arch-Q1-see-pruning`) is still being written (brief). Recorded on `EPIC-011` § Phases.
