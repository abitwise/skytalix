---
id: 20261010T154703Z-ba-pm-decision-abc010-dor10-fence16-levels351-abc139-cut-6e1b4d27
kind: decision
by: ba-pm
at: 2026-10-10T15:47:03Z
verified_by:
confidence: high
refs:
  - ABC-010
  - ABC-139
  - QE-129-a
  - ABC-083
  - ABC-126
  - ABC-131
  - ABC-087
  - ADR-0033
  - plans/tickets/ABC-010-fen-semantic-validation.md
  - plans/tickets/ABC-139-cadence-comment-quotes-the-formula-its-cite-disowns.md
  - .grugops/context/qe-ABC-129/notes/20261010T152604Z-qe-e2e-observation-abc129-gap-register-83afd95b.md
  - 20261010T154703Z-ba-pm-observation-abc010-tip-scan-abc131-levels-qe129a-readings-9c2f50e8
supersedes:
---

# `ABC-010` DoR 10/10 (`M`/`P2`), fence 15 → 16 files for `src/levels.test.ts:351`; `QE-129-a` cut as `ABC-139` (`XS`/`P3`, Ready)

This note is hand-authored and unsealed (degraded posture, `AGENTS.md`). Task `wave-2026-09-25`,
subtask `bapm-abc010-qe129a-2026-10-10`, branch `grugops/bapm-abc010-qe129a-2026-10-10` from
`b98fb419`. The readings are in `…9c2f50e8`.

## R1 — `ABC-010`: both ⚠️ cleared, and one fixture joins the fence

- **Item 3 cleared.** `ABC-126` is an ancestor of the tip (`f8aa31cf`). No corpus row is rejected.
- **Item 10 cleared.** `ADR-0033` § Status reads **accepted**, with the owner's words quoted.
- **The fence grows to 16.** `ABC-087` (`659215a3`) added `src/levels.test.ts:351`,
  `7k/8/5QK1/8/8/8/8/8 w - - 0 1`. The black king on h8 is in check from Qf6 with white to move, and
  the generator offers `f6h8`. Left alone, 9(d)'s stop rule fires at build and the Engineer stops.
  The stop rule is right for a build hop, but this was found before the build, so it is
  BA/PM's to decide. **I re-authored it into (c), not into a swap file.** The row is about the blunder
  path scoring a stalemate, not about an impossible board, so the off-domain entry would hide a
  defective fixture. A measured replacement keeps the name, the point and the comment (test note 6).
- **(f) gains `ENGINE_DEEP=1 npx vitest run src/levels.test.ts`** under the page's own rule ("their
  files are in the fence"). It costs about 3.5 min (AGENTS.md: 202–225 s). The changed row runs on the
  default lane.
- **Line drift:** `src/quiescence.test.ts:327` → `:329` (`ABC-126`, +4/−2). Every other cited line
  and all six import lines hold. No other fence file changed since `980890f`.
- **Size `M` holds** (10 fixtures in 9 files, 3 with measured replacements). **`P2` holds.**

## R2 — `ABC-131` is not a predecessor

Its tip `677b8b09` gives the identical reject list. Its four dropped rows pass the rules, and it edits
`src/puzzle-corpus.ts`, `src/puzzle-suite.baseline.json` and `src/puzzle-suite.test.ts`, none of which
is in the fence. 9(f)'s `PUZZLE_DEEP` clause reads "not below the baseline file's on the build's base",
so either merge order is checkable.

## R3 — Ordering against `ABC-083`, and the resulting pull order

The rule stands (never in parallel; `ABC-083` first when both are pullable). **The overlap is two files,
not one.** `ABC-083` `A8` adds rows to `src/evaluate.pawns.test.ts`, which this ticket re-authors at
`:121`. The page named only `src/quiescence.test.ts`. `ABC-083` changes evaluation, so the second one
to build re-measures the other's pinned values.

**Pull order at `b98fb419`:**
1. **`ABC-010` is pullable now.** It is the only one of the pair that is: `ABC-083` waits for
   `ABC-131`'s merge, which waits for the owner's UAT word.
2. **If the owner's `ABC-131` word lands before `ABC-010` is pulled,** pull `ABC-083` (`P1`) first
   and `ABC-010` after it merges.
3. **If `ABC-010` is already in `In Development`,** it finishes and `ABC-083` follows and rebases.
   There is no pre-emption: the rule serves the files and is not a blocker.

Choosing between (1) and holding `ABC-010` back for `ABC-083` is the Orchestrator's sequencing call.
The cost of (1) is that a P1 may wait one `M` build.

`ABC-010` UAT: `src/fen.ts` is a production file. **The owner's word is owed at `In UAT`; no waiver.**

## R4 — `QE-129-a`: cut `ABC-139`, `XS`, `P3`, DoR 10/10, `Ready`

- **Why cut, not decline.** QE's register says both formulas give 4 for this input. Under the cited
  docblock's own definitions they do not. `runLines` answers `eof` after the three lines, and `eof`
  is a non-advancing outcome (`turn-loop.ts:105-106`). So the quoted formula predicts 5, which is the
  EOF-frame build the docblock warns about. The assertion `toBe(4)` is right, and the narration
  endorses the red build's number. LOW stands, but the comment is actively misleading.
- **Why not fold.** No open ticket edits `src/command-input.test.ts`. Every page that names it is
  `done` or `dropped`.
- **Number.** `ABC-139`. `ABC-137` and `ABC-138` are on `grugops/bapm-cuts-r5c-f1331-2026-10-10`
  (`2230dd46`, `git ls-tree`). No branch carries an `ABC-139` page. The Orchestrator confirmed the range
  mid-hop. **No clash.**
- Comment-only, so UAT is waived (2026-08-17 rule) and QE still hops. `A3` uses owner Q4's
  conjunction, per `QE-129-b`.

## Fences kept, and what is owed to others

- **Not touched:** `src/`, `plans/board.md`, every ADR, `AGENTS.md`. No column change on `ABC-010`;
  its frontmatter still reads `Backlog`.
- **For the Orchestrator:**
  - the `ABC-010` board row: Backlog → `Ready for Dev` at 10/10. Its leading text still reads "M, P1".
  - an `ABC-139` row in `Ready`.
  - `ABC-083`'s page names only `quiescence.test.ts` as shared with `ABC-010`. This note records the
    second file. `ABC-083`'s page is not mine this hop. BA/PM at its next touch.
- **`ABC-010` page length:** 356 lines (346 before). That is above the 300-line budget (AGENTS.md
  rule 2). The growth is the cleared dependencies and test note 6. I replaced the old DoR block
  rather than stacking a new one.
