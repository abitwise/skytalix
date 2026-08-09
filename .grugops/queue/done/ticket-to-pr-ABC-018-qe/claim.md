---
task: ticket-to-pr-ABC-018
subtask: qe-abc018-review
role: qe-e2e
claimed_at: 2026-08-09T09:20:00Z
claimed_by: qe-e2e
method: MANUAL-BY-HAND
---

Claimed BY HAND. Re-checked at the source rather than taken from the subtask file's word or from any
prior note: `ls scripts` returns `No such file or directory` in the repo, and `ls
/Users/olgeroeselg/.grugops/agent-factory/scripts` returns the same in the kit (whose top level is
`_commit-convention.md`, `checklists/`, `config/`, `contracts/`, `examples/`, `handoffs/`,
`packaging/`, `README.md`, `roles/`, `seed/`, `VERSION`, `workflows/` — no `scripts/`). So there is
no `scripts/claim.js` and Workflow 17 step 2's atomic `claimTask` could not be executed. The claim
directory was created with a plain `mkdir` — still atomic, still `EEXIST` on a second writer;
`mkdir` exited 0, so this claim is the first — and this registry record written into it.
`pending/…md` → `claimed/…/…md` was a plain `mv` (atomic rename). `pending/` and `claimed/` were both
empty at the start, queue width is 1, so no contention was possible and the claim is degenerate.
Recorded rather than glossed, exactly as every prior subtask on this board recorded.

Workflow 16's sanctioned writer (`scripts/context-io.ts` / `mcp__grugops__propose_note`) is likewise
absent, so this role's context notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-018/notes/` in the exact shape of
`agent-factory/contracts/context-note.md`. **No `finding` is written — none is admissible on this
task, because there is no §14 gate here to issue a `§14-gate#<id>` stamp and
`context.human_admission` is `off`, so no `human:<name>` stamp is available either. Nothing is
self-stamped.** No derived `index.md` / `index.jsonl` was hand-faked, because the renderer that
produces them does not exist here.

## Read before acting

`.grugops/context/ticket-to-pr-ABC-018/notes/` holds **ten** notes and all ten were read in full, at
the source, in `at` order, before a single test was run or a single command executed:
`20260809T081615Z-orchestrator-decision-046a7d60` (routing, the three flagged acceptance items, the
substrate ruling, the `NFR-002` quoting rule), `20260809T083236Z-ba-pm-observation-f8026fb2` (the
neutral source facts), `20260809T083704Z-orchestrator-decision-215adfeb` (the Definition-of-Ready
gate at the pull and the open prompt-row cross-ticket obligation),
`20260809T084500Z-ba-pm-decision-53b4877d` (the five acceptance corrections and their rejected
alternatives), `20260809T084800Z-ba-pm-claim-d45d16a4` (what the promotion does NOT establish),
`20260809T090500Z-software-engineer-artifact-ref-f0614850` (the files and every gate command),
`20260809T090600Z-software-engineer-decision-176a65c3` (the five structural choices),
`20260809T090700Z-software-engineer-observation-6b72e200` (`NFR-002`, both halves),
`20260809T090800Z-software-engineer-observation-2bfbf80e` (the 18-mutant campaign and the two that
survived the suite as first written — **the open gap handed forward**), and
`20260809T090900Z-software-engineer-claim-80508934` (what the implementation does NOT establish).

Then, and deliberately NOT on their authority:
`plans/tickets/ABC-018-frame-output-and-redraw.md` line by line including the `CORRECTED IN PLACE`
block under `## Acceptance` and the `## Implementation` section; `src/frame.ts` and
`src/frame.test.ts` in full; `src/render.ts`; `AGENTS.md` (the real commands, the 12 coding rules,
the branching model); `.grugops/factory.config.json` (`quality.mandatory_gates`, `gate_enforcement`,
`coverage_threshold`, `test_integrity`, WIP limits); `plans/board.md`; `plans/traceability.md`;
`plans/nfr-catalog.md`; `memory-bank/00-index.md`; and the kit's `roles/qe-e2e.md`,
`workflows/16-context-read-write.md`, `workflows/17-task-claim.md`,
`contracts/context-note.md` and `_commit-convention.md`.

---
completed_at: 2026-08-09T09:52:00Z
outcome: |
  VERDICT PASS on ABC-018. In Review -> In Security/NFR, the one board move this role owns.
  In Review 1/3 -> 0/3, In Security/NFR 0/2 -> 1/2; no limit approached, no override taken, no
  written reason owed. NOTHING MERGED, NOTHING DEPLOYED - a human holds both.

  ALL FOUR MANDATORY GATES WERE RE-RUN ON THE TIP BY THIS ROLE, BEFORE AND AFTER THE ADDED TESTS,
  never inherited: npm run lint exit 0 (the 2 infos are the pre-existing biome.json schema and
  recommended-deprecation notices), npm run typecheck exit 0, npm run build exit 0, npm test exit 0
  at 297/297 on 14 files THEN 304/304 on 14 files. Skip count 0 both times by the AGENTS.md command.
  The 277-on-13 baseline was RE-DERIVED by running the suite without this file, not subtracted.
  src/frame.ts at 100% statements/branches/functions/lines against coverage_threshold 0.8. The
  Engineer's figures reproduce exactly. One autofix pass was needed on THIS ROLE'S OWN new test code
  (formatting only, lint.autofix true, self-fix 1 of 2) and is reported rather than smoothed.
  Test-integrity checker exit 2 (.grugops/test-skips.md absent) - recorded as an ERROR and NOT as a
  pass; NO registry file was created. E2E and auto-UAT oracles: UNKNOWN - verify.

  TWELVE TESTABLE ACCEPTANCE CRITERIA CHECKED ONE BY ONE BY MUTATING src/frame.ts UNTIL THE
  BEHAVIOUR EACH NAMES WAS WRONG. Not one test was accepted because it is named after a criterion.
  Ten are covered by a test that actually fails when the behaviour is wrong. Criterion 1 is
  near-vacuous under stub panels - BA/PM ruled it left in place knowingly and QE CONCURS by
  measurement (0 sole kills across the campaign). CRITERION 2 IS WEAKER THAN IT WAS RULED TO BE and
  that is NEW: BA/PM assigned it criterion 1's falsifiable weight, and measured it does NOT kill the
  grown-message-region mutant its own rationale names, because its two-item rejection never needs a
  third row. NFR-002 carries no in-repo assertion by this project's standing convention and is the
  Security/NFR gate's to re-derive.

  BOTH FAKES THE SUBTASK AND THE TICKET'S ## Test notes NAME WERE CHECKED BY CONSTRUCTION AND
  NEITHER IS PRESENT. A byte-only rewrite of criteria 5 and 6 - home prefix, frame present, exactly
  one erase, exactly two \x1b - PASSES the no-padding mutant that the DELIVERED forms KILL, so the
  screen model is load-bearing rather than decoration. And the mutant that IS the second fake -
  sanitize() left entirely correct while the writer bypasses it - dies to criteria 11 and 12,
  because both assert on the CAPTURED STREAM.

  56 DISTINCT MUTANTS OVER 75 MUTATE-AND-RESTORE CYCLES. 46 died to the delivered suite. SIX PASSED
  ALL TWELVE CRITERIA AND ALL 297 DELIVERED TESTS, AND NOT ONE OF THEM WAS A DEFECT IN THE DELIVERED
  CODE: (1) SEPARATOR = "" - items run together into one unreadable token while both region criteria
  still pass, and the separator is load-bearing in the ticket's OWN arithmetic (6x4 + 5 = 29);
  (2) the sanitizer skipped over the PANEL rows - the reading the Engineer honestly said "would pass
  every test in this suite", and it did; (3) no (+N more) when NOT ONE supplied item fits - the
  shown === 0 fall-through, where the region goes SILENTLY blank and the player is never told
  anything was withheld; (4) A TTY EXACTLY ONE ROW SHORT STILL REDRAWING IN PLACE - the other side
  of the >= boundary, which the criteria never test because their only "too short" case is thirteen
  rows short, and it is the exact failure 4b exists to prevent; (5) U+0000 surviving the C0 strip -
  the bar is a RANGE and the range was never asserted; (6) the C1 block stripped in unicode mode -
  CHARACTERIZED, NOT DECIDED, and routed to Security/NFR.

  FOUR MUTANTS SURVIVE AND ALL FOUR ARE REPORTED. Three are PROVEN EQUIVALENT (`?? -1` for `?? 0`,
  since frameHeight >= 3 on every reachable input; `sink.isTTY === true` for `Boolean(sink.isTTY)`
  over the declared type - ABC-015's surviving mutant a SECOND time on the same coercion; `+ 1` for
  `+ SEPARATOR.length`). The fourth reserves marker room on every region row rather than the last:
  it shows fewer items with a larger N, N stays a count of the input, so it is a CONFORMING
  ALTERNATIVE PACKING and not a defect - which is what the ticket intends by leaving packing to the
  engineer.

  CLOSED IN TESTS ONLY, AND NOTHING WAS REPAIRED TO MAKE THIS VERDICT GREEN. Seven tests added in
  one block at the end of src/frame.test.ts (line 651), ZERO production lines changed. src/frame.ts
  is BYTE-IDENTICAL to the Engineer's commit d88a1f0 - md5 bb827f52fe537817e40020a29dfa0e6d before
  and after 75 mutate-and-restore cycles, the same digest the Engineer published, and
  `git diff --stat d88a1f0 -- src/frame.ts` is EMPTY. The harness asserted the digest after EVERY
  cycle and would have aborted on the first mismatch.

  ONE PRODUCTION-SHAPED RISK IS NAMED AND IT IS STILL A PASS: W IS RECOMPUTED PER FRAME while the
  ticket's ## Scope calls it "a session constant", and beginFrameSession takes H and not W.
  Demonstrated on the screen model rather than argued - a 24-wide frame followed by an 18-wide one
  leaves the wider frame's TAIL on screen, because ED(0) cannot reach what sits to the right of a row
  overwritten by a shorter one. It is the same class the padding decision prevents, one level up. It
  breaks NO criterion, CANNOT FIRE TODAY (renderBoard is always 9x18, the other two panels are
  fixed-height stubs, and src/frame.ts has zero runtime importers), and the fix is an API change
  whose right shape depends on ABC-016 and ABC-017, which do not exist. Pinned by a CHARACTERIZATION
  test and handed to those tickets - the ABC-014 precedent.

  THE ENGINEER'S HANDED-OVER GAP WAS CHECKED INDEPENDENTLY AND IS REAL AND STILL OPEN AT THE
  CRITERIA LEVEL: no acceptance criterion constructs a sink whose isTTY or rows is ABSENT, and both
  mutants die to the Engineer's own added pin and to NOTHING ELSE. This is the THIRD consecutive
  ticket on this board whose acceptance set is written entirely over signals that agree.

  NFR-002 WAS NOT RE-DERIVED HERE and no figure of this role's may be quoted as a measurement - the
  Security/NFR gate owns it on its own instruments. One coarse single-sample order-of-magnitude
  sanity check agreed with the Engineer's in-memory pair (0.0071 ms against 0.0067 ms per frame,
  Apple M3 / Node v24.12.0 / darwin arm64), so a four-orders-of-magnitude claim was not RELAYED
  unlooked-at. plans/nfr-catalog.md is untouched and undischarged.

  NO E2E WAS WRITTEN AND NONE COULD BE: no CLI entry point until EPIC-006, zero runtime importers of
  src/frame.ts, AGENTS.md E2E slot UNKNOWN - verify, no UI surface against quality.ui_e2e
  ui-or-critical-path. Reported as a gap rather than filled with a fake.

  FLAKINESS CHECKED RATHER THAN ASSUMED: five full-suite runs with --sequence.shuffle, all 304/304
  clean. No added test touches an ambient global and none carries a wall-clock assertion.

  NO CRITERION WAS AMENDED - that is the Backlog exit, not this role's. Four items are ROUTED and
  none is discharged here: two criteria gaps to BA/PM (the absent-signal shape; criterion 2's
  instantiation), the C1 question to Security/NFR, and the per-frame W plus criterion 1's
  integration obligation to ABC-016 / ABC-017 / ABC-019.

  NO FINDING WAS WRITTEN - none is admissible on this task (no §14 gate here to issue a
  §14-gate#<id> stamp, context.human_admission is off). Nothing is self-stamped and no index.md /
  index.jsonl was hand-faked. FIVE NOTES PUBLISHED, hand-written in the contract's exact shape:
  20260809T094500Z-qe-e2e-observation-f4e30dbc, 20260809T094600Z-qe-e2e-observation-f9b3a54c,
  20260809T094700Z-qe-e2e-decision-67ac270a, 20260809T094800Z-qe-e2e-artifact-ref-0cb3d087,
  20260809T094900Z-qe-e2e-claim-273c224e.
moved: pending/ -> claimed/ticket-to-pr-ABC-018-qe/ -> done/ticket-to-pr-ABC-018-qe/ - ALL BY HAND
  (no scripts/claim.js in this install or in the kit; the claim dir was created with a plain mkdir,
  still atomic and still EEXIST on a second writer). The whole claim directory moves, keeping this
  registry record beside the subtask file - the shape done/ticket-to-pr-ABC-018-dev/ already uses.
