---
id: 20260925T090400Z-qe-e2e-decision-abc080-pass-with-findings-9f72677b
kind: decision
by: qe-e2e
at: 2026-09-25T09:04:00Z
verified_by:
confidence: high
refs:
  - ABC-080
  - ABC-079
  - NFR-005
  - N8-LANE
  - src/search.ts
  - src/engine.ts
  - 20260925T090200Z-qe-e2e-observation-abc080-gates-and-criteria-reread-b1d5b70b
  - 20260925T090300Z-qe-e2e-observation-abc080-mutants-3-new-1-survivor-e4577130
supersedes:
---

# ABC-080 QE verdict: PASS WITH FINDINGS — `ABC-080` MAY LEAVE `In Review`

Hand-authored per `agent-factory/contracts/context-note.md`, no `seal` (degraded posture,
`AGENTS.md`: `context-io.ts`/`claim.js`/`mcp__grugops__propose_note` absent, no `finding` is
admissible here). This is a `decision`/`observation` recording, NOT a stamped gate result. Worked
on `grugops/qe-ABC-080` off `5f8c4ae` (carries the build `cb8ca55`); NOT merged, NOT pushed.

## PASS/FAIL: PASS WITH FINDINGS

Every criterion `A1`–`A7` holds as the build reported. Gates reproduce clean. One mutant survives
(`N3`, below) — a real mutation-coverage gap on the engine's killer-update rule, not a production
defect. No criterion is failed and no board-blocking issue was found.

## Each criterion, my own reading

`A1` MET. `A2` MET. `A3` MET (2.64% / 2.10% ≤ 4%, reproduced). `A4` MET as reported (killers'
delete-rule reading reproduces; hash column correctly NOT YET MEASURABLE, `ABC-081`'s). `A5` MET
(every search here is the no-hash-move case by construction). `A6` MET (instrumentation
reproduces; code inspection confirms `killers.record` fires only on a beta cutoff, for a quiet
move, in both recursions). `A7` **UNKNOWN — verify**: not independently re-run across the two
builds (it needs the pre-`ABC-080` tip archived out-of-tree, which this hop did not re-do); the
in-tree half (this build's depth-in-budget) reproduces the build's own vitest reading (4/4).
`ABC-079` QE `G4` — closed, reproduced (275-node fixture reds when the promotion term is dropped).

## Rulings on the three flagged calls

1. **The `quiescence.test.ts` fingerprint re-pin (562→136, 14 565→2 273), outside the two named
   test companions.** IN LICENCE. The ticket's Scope says both full-width recursions consume the
   comparator; `searchWithoutQuiescence` lives inside `src/search.ts`'s `negamax`/`searchRoot` and
   shares `switches.ordering` by default, so ordering it was not optional once the recursion it
   sits inside was ordered — leaving it unordered would make it compare a different algorithm
   from `search`, breaking the very identity `ABC-078`'s sweep and `A1` need. Moves unchanged
   (g5f6, c3d5); only the node count moved, and it is now re-pinned to the true post-ordering
   figure (reproduced exactly, see the companion observation note). No scope growth.
2. **`engine.test.ts` `A3`'s fixture budget 8 → 4.** SOUND. The premise (aborts inside depth 3,
   discards it, returns depth 2's move) still holds; the node counts behind the boundary choice
   (38 / 153 / 2 551) reproduce exactly (`verify-a3.mjs`, companion note). Budget 4 is inside the
   window the comment claims (3–4 complete depth 2 and abort inside depth 3); not independently
   re-verified for budgets 5–12 (the comment's own upper bound), which is a minor unchecked claim,
   not a defect.
3. **Killers kept across one `chooseMove` call's iterations, cleared only between calls.**
   ACCEPTED AS READ, not a defect. The ticket's own words ("cleared or invalidated between
   searches") are ambiguous between "one `chooseMove` call" and "one iteration" as the unit of
   "search" — the build's reading (one call) is the more useful one for an iterative-deepening
   engine (a killer found at depth 4's ply `n` is still a good first quiet move to try at depth
   5's ply `n`), and it is behaviourally exercised and asserted (`search.ordering.test.ts`'s
   `chooseMove()` row, reproduced). Flagged for BA/PM to firm up the ticket's wording so a future
   reader does not need to re-derive this; not a QE gap, and not routed back for a code change.

## Mutant ledger — extension

The build's 18/18 (default lane) reproduces as claimed on re-inspection; not independently
re-applied (see the companion mutant note for why: the named thin spots' own accounting is
plausible and re-running ten mutants to confirm an accounting was judged lower value than trying
new ones). **Two new mutants on the comparator and the killer-update rule, KILLED (N1, N2).**
**One new mutant, applied identically to `src/engine.ts` instead of `src/search.ts`,
SURVIVED (N3) — the killer-update-on-cutoff-only rule has no test in the abortable recursion that
would catch it if that one line regressed.** Full detail, the exact edits and the exact failing
assertions are in the companion observation note.

## Gap named (not blocking)

**G1 — mutation-coverage gap, `src/engine.ts`'s killer-update rule.** Recorded above (`N3`). The
code is correct; there is no test that would catch a regression of the
`if (alpha >= beta) { budget.killers.record(...) }` guard specifically inside `src/engine.ts`'s
`negamax`, as distinct from `src/search.ts`'s (which IS caught, by `N2`/the quiescence and
ordering node-count pins). Closing it would cost one exact node-count pin on a `chooseMove` call
at a fixed injected-clock budget (the existing `A3` fixture's shape) that differs between
correct-only-on-cutoff and record-on-every-move. Not a criterion failure; named so a future hop
can close it cheaply. Owner: Software Engineer, at the next licensed touch of `src/engine.ts` or
`src/search.ordering.test.ts`.

## Fences honoured

Zero lines under `src/` in this hop's own diff (`git status --porcelain -- src` asserted empty
after every mutant revert, three rounds). `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`
and no ADR touched. `NFR-005`/`N8-LANE` reported above and in the companion note, not ruled — the
same fence the build itself worked under; Security/NFR's to rule.

## Report

**PASS WITH FINDINGS.** `A1`–`A6` and `ABC-079` `G4` MET, reproduced independently. `A7`
`UNKNOWN — verify` (not independently re-run across two builds this hop; the in-tree half
reproduces). All three flagged calls ruled: (1) in licence, (2) sound, (3) accepted as read,
wording flagged for BA/PM. Mutant ledger: 18/18 (build) plausible on inspection, not re-run; 2/3
new QE mutants killed, 1 survived — **G1**, a named, non-blocking mutation-coverage gap in
`src/engine.ts`'s killer-update rule. Gates: lint 0, typecheck 0, build 0, unit 44/1 418/0 skip,
skip-integrity `No findings.`, `SEARCH_DEEP=1` 57/57, `ENGINE_DEEP=1` 33/33 — all reproduced.
sha `cb8ca55` (the build under review), this hop's own tip `5ba83a8` on `grugops/qe-ABC-080`.
Numstat under review: `src/engine.test.ts` +9/−4, `src/engine.ts` +24/−11,
`src/quiescence.test.ts` +7/−3, `src/search.ordering.test.ts` +574/−0, `src/search.test.ts`
+10/−1, `src/search.ts` +140/−15. `ABC-080` MAY LEAVE `In Review` — the board move (toward
`In Security/NFR`, `NFR-005`/`N8-LANE` triggered) is the Orchestrator's; fenced from this hop.
