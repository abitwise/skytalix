---
id: 20261010T091104Z-qe-e2e-decision-abc051-verdict-pass-with-gaps-933d32ed
kind: decision
by: qe-e2e
at: 2026-10-10T09:11:04Z
verified_by:
confidence: high
refs:
  - ABC-051
  - NFR-002
  - N8-LANE
  - ADR-0021
  - ABC-019
  - M2
  - QE-051-a
  - QE-051-b
  - QE-051-c
  - QE-051-d
  - QE-051-e
  - src/turn-loop.ts
  - src/turn-loop.nfr.test.ts
  - 20261010T091104Z-qe-e2e-observation-abc051-mutant-matrix-and-measurements-8ea81c8c
  - 20261010T091104Z-qe-e2e-observation-abc051-gap-register-e9262a1c
  - 20261010T090235Z-software-engineer-claim-abc051-acceptance-met-ready-for-review-05908d8f
  - 20261010T090235Z-software-engineer-decision-abc051-wording-of-the-rule-and-the-spy-a684650d
  - 20261010T090235Z-software-engineer-observation-abc051-reverify-build-and-measurements-0db3513e
supersedes:
---

# `ABC-051` QE verdict: **PASS_WITH_GAPS** at `85f260f`

Hand-authored, no seal. This is a `decision`, not a `finding`, because no `§14-gate` verdict exists on
this install. The diff under review is `7812018..85f260f`. QE re-ran every criterion itself, in the
Engineer's worktree, against the re-cut page and not against the Engineer's notes. The ticket's
`## Scope` and `## Out of scope` are authoritative.

| | what QE ran | result |
|---|---|---|
| `A1` | Green on the unmodified tip, 4/4. `M2` re-planted on the **tip's** file (mutant md5 `14bbca7b…`; the Engineer's `276de6e0…` was built from base): **RED 4/4, every failure `expected "keyHistory" to be called +0 times`** (40/120/300/40) in `src/turn-loop.nfr.test.ts`. On the base nfr file `M2` is green 4/4. Three further mutants the bar should catch (`M3`, `M4`, `M5`) are all RED on `keyHistory`. `M3` is killed by **this assertion and nothing else in the 1,540**. The control `M6` is red on `gameStatus` and never on `keyHistory`. The control `M7` is green here and red at `A8` | **MET** |
| `A2` | Withdrawn by the re-cut. `M7` confirms the per-command price is still caught by merged `A8` (ii) | n/a |
| `A3` | The grep exits 1 with 0 hits (2 on base). The docblock keeps "eighteen" and carries (i) the source, (ii) "NUMBERED" plus "the enumeration's, not one row per trigger", and (iii) the refused claim "IS NOT ONE OF THE EIGHTEEN". Each line checked against `ADR-0021` cl. 5 and `ABC-019` § Scope, with no contradiction. The test name names `rejected`, and `41`/`0` are unmoved. The honest-limit sentence survives, and the cite `history.ts:153` is the call line | **MET on its four enumerated checks**. One new sentence overreaches (QE-051-a) |
| `A4` | Numstat `-- src/`: exactly the two files (+19/−7, +7/−1). The non-comment pipeline is **empty**. Suite **50 / 1,540 on both sides** (base from a clean archive). 2 `it` sites, 0 new files, skip 0. lint, typecheck, build and test exit 0, and integrity printed `No findings.` | **MET** |

**Why PASS_WITH_GAPS and not PASS.** QE-051-a: the new header sentence (nfr `:24-25`) says the two
spies at 0 *"prove the loop adds no replay of its own to a PLY"*. QE's probe `M8` (a per-ply
`takeBack(history, 0)`, an `O(plies)` replay) is green in this file and in all 1,540 tests. Under a
strict reading of `A3`'s headline this is the same defect class the ticket removes. QE recommends a
one-line narrowing **before merge**, within the ticket's own fence. Whether that is a re-hop or a
fix-forward is the Orchestrator's call.

**Why not FAIL.** Every enumerated, measurable criterion is met. The spy is proved wired by the
required failing assertion. The overreach concerns a replay shape the page never scoped, and that
shape was already invisible at base.

**Gap register** (detail in `…e9262a1c`):
- **QE-051-a, MEDIUM, in-fence.** The header sentence overclaims what the spies prove (`M8` survives
  everything). Narrow it before merge.
- **QE-051-b, LOW, out of fence.** `keyHistory` on the take-back edge (`M9`) is guarded by no test.
  `A8`'s "nowhere else" is broader than its rows. Candidate follow-up in `src/turn-loop.test.ts`.
- **QE-051-c, LOW, out of fence, pre-existing.** The Engineer's five stale cites are confirmed, every
  one wrong at base, and none was made wrong by this ticket. The pattern is 13 of 14 cross-file
  `turn-loop.ts:<n>` cites. Follow-up: cite by symbol, after `ABC-036`.
- **QE-051-d, for the Orchestrator.** The UAT-waiver measure, applied as written, prints
  `src/turn-loop.ts`, so the waiver does **not** apply on the literal rule. The Engineer's "should
  apply" is not supported by that measure. Comment-only counting as zero is the owner's word to give.
- **QE-051-e, INFO.** `A4`'s "exactly two files" holds for `src/` (the branch has 7 files including
  notes, the page and the trace row).
- **Not re-run by QE:** `N8-LANE` (0 new files; the build's figure is accepted with its load caveat).
  `PUZZLE_DEEP` is not required, because no engine/search/evaluate file is touched.

No QE test rows were added, because `A4` fixes the suite total under review. No production line was
changed. Every mutant was reverted, `src/` matches `HEAD`, and `src/turn-loop.ts` md5 is `f01ba3ab…`.
The board move is the Orchestrator's. Nothing was merged or pushed.
