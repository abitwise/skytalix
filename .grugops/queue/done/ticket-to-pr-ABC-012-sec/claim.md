---
task: ticket-to-pr-ABC-012
subtask: security-nfr-abc012-gate
role: security-nfr
claimed_at: 2026-08-04T18:10:00Z
claimed_by: security-nfr
method: MANUAL-BY-HAND
---

Claimed BY HAND. This install has **no `scripts/` directory at all** — no `scripts/claim.js`, so
Workflow 17 step 2's atomic `mkdirSync` claim primitive could not be executed and nothing here
provides exclusivity. Queue width is 1 and no contention is possible, so the claim is degenerate.
Recorded rather than glossed, exactly as the queued subtask instructed and as every prior subtask on
this board recorded.

Workflow 16's sanctioned writer (`scripts/context-io.ts` / `mcp__grugops__propose_note`) is likewise
absent, so this role's context notes are **hand-written** into
`.grugops/context/ticket-to-pr-ABC-012/notes/` in the schema's exact shape. **No `finding` is
written — none is admissible without a §14 gate to issue a `§14-gate#<id>` stamp, and
`context.human_admission` is `off`, so no `human:<name>` stamp is available either. Nothing is
self-stamped.** The kinds used are `decision`, `observation`, `claim` and `artifact-ref`. No derived
`index.md` / `index.jsonl` was hand-faked, because the renderer that produces them does not exist
here.

## Read before acting

The `ref:` context folder was read AT SOURCE and IN FULL before any gating judgement was formed —
**eleven notes**: the Orchestrator's pull decision `20260804T120000Z-orchestrator-decision-f066a9d0`,
the Software Engineer's five (`…-decision-2c425d84`, `…-observation-f82d9b50`, `…-claim-4afa292e`,
`…-artifact-ref-f11fbe2a`, `…-observation-a3758376`) and QE/E2E's five
(`…-decision-a283903f`, `…-observation-a0401665`, `…-observation-5bbcc35c`, `…-claim-d49bd286`,
`…-artifact-ref-9475f86e`). Then `plans/tickets/ABC-012-game-history-module.md` in full,
`plans/nfr-catalog.md`, `plans/board.md`, `plans/traceability.md`, `.grugops/factory.config.json`,
`AGENTS.md`, and the shipped `src/history.ts` line by line.

**Nothing measured by an earlier role is inherited.** The five numeric NFR bars are re-measured on
this gate's own harness — the same standard this column applied to `NFR-005` on `ABC-011` — and the
ticket's "no security trigger" assertion is TESTED against the shipped module rather than accepted
from its framing.

---
completed_at: 2026-08-04T18:45:00Z
outcome: PASS_WITH_RISKS (board verdict PASS) - ABC-012 moved In Security/NFR -> Ready for UAT.
  In Security/NFR 1/2 -> 0/2, Ready for UAT 0/4 -> 1/4; no limit approached, no override taken.
  Gated against `security.asvs_level: L1` and `security.block_on: high`. NO required fix outstanding.
  FIVE accepted risks, each with a named owner AND a place. `compliance_regime` is [], so no
  Compliance Officer hand-off is owed.

  THE FIVE BARS WERE RE-MEASURED ON THIS GATE'S OWN HARNESS, not inherited - the standard this column
  set on ABC-011's NFR-005. Harness outside the repository, its own process doing nothing else, a
  discarded warm-up round, 11 rounds with the CELL ORDER ROTATED EVERY ROUND, medians of per-round
  means, TWO fully independent samples, on Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64
  and `UNKNOWN - verify` on any other hardware. Population: the same deterministic LCG game
  src/history.test.ts:81-89 plays. ALL SIX MET WITH ROOM:
    takeBack(h,2) @120 [upper bound]  2.46 / 2.45 us   vs <= 5 us     0.49x  MET
    keyHistory(h) @120                40.16 / 40.20 us vs <= 60 us    0.67x  MET
    repetitionCounts(h) @120          44.35 / 44.45 us vs <= 75 us    0.59x  MET
    gameStatusOf(h) @120              47.75 / 47.59 us vs <= 75 us    0.64x  MET
    playMove(h,move) @120             8.6 / 8.2 ns     vs <= 100 ns   0.09x  MET
    repetitionCounts(h) @300 plies    91.93 / 92.15 us vs <= 150 us   0.61x  MET
    repetitionCounts(h) @40 plies     17.57 / 17.48 us  (shape only, no bar)
  Growth linear with a constant offset - 17.5 / 44.4 / 92.0 us at 40 / 120 / 300 plies - so at 300
  plies the derive is still ~10x under ADR-0002's own ~1 ms threshold and SEAM 2 is under no pressure.

  BOTH FENCES QE NAMED WERE TESTED RATHER THAN REPEATED, and one produced a result nobody predicted.
  (1) gameStatusOf's margin IS the one legalMoves call plus ~0.6 us and swings 1.4x on position alone
  (3.40 / 3.14 us startpos-anchored vs 4.55 / 4.49 us kiwipete-anchored, matching bare legalMoves of
  2.74 us and 3.89-3.96 us) - AND THE EXPENSIVE-legalMoves ANCHOR IS CHEAPER OVERALL (41.89 / 42.25 us
  vs 47.75 / 47.59 us), because the O(plies) derive dominates. The bar survives the worst legalMoves
  position this repo benchmarks; the arithmetic worst case over the observed extremes is ~49.0 us =
  0.65x, LABELLED AS ARITHMETIC, NOT A MEASUREMENT. (2) The takeBack upper bound reads HIGHER with the
  restore outside the clock (2.92 / 2.93 us), not lower - the clean variant pays cold-object cost -
  and the restore's own contribution (~0.017 us) is BELOW instrument resolution, so the bound is tight
  to within less than it can see and the bar is MET on either framing. No claim is made that either
  framing resolves the other.

  ONE INSTRUMENT WAS BUILT, MEASURED AT A 2.08x FALSE MISS (10.38 us against the 5 us bar), AND
  DISCARDED - it called legalMoves twice inside the timed region, ~5.4 us of the reading. NO NUMBER IS
  CLAIMED FROM IT and it is recorded rather than buried, because a gate that reports a MISS it
  manufactured itself is worse than one that reports nothing. Seventh instrument-limit correction on
  this project.

  THE "NO SECURITY TRIGGER" ASSERTION WAS TESTED, NOT INHERITED, AND IT HOLDS. Structurally: the
  8-module transitive closure rebuilt, EVERY import relative and inside src/, and across the whole
  closure ZERO node: builtins, child_process, require(, eval(, new Function, process.env, globalThis,
  __proto__. No filesystem, network, environment, serialization sink, logger, secret or privilege
  check. ZERO runtime dependencies; package.json + lockfile byte-identical to 39e260d. Adversarially:
  12 hostile payloads fed to newGame(initialFen) - prototype-pollution keys, __proto__ and
  constructor/prototype placements, a 10,000-char string, control bytes, `; rm -rf /`, path traversal,
  SQLish, <script> - EVERY ONE REJECTED with a typed FenError; ZERO prototype pollution, zero hang,
  zero crash. ASVS L1 JUDGED NOT PADDED: 12 of the 70 L1 requirements reachable and each judged from
  evidence, 58 structurally N/A with the reason stated per block; V11.4.1 N/A WITH ITS REASON, because
  zobristKey is a non-cryptographic position-identity hash - a collision is a wrong draw verdict, a
  correctness risk and not a security one.

  THE takeBack(NaN) RULING: MEDIUM, DOES NOT BLOCK - and the reasoning is written out rather than
  asserted, because the convenient answer was the easy one. REPRODUCED AND EXTENDED PAST QE'S TABLE:
  NaN, undefined, THE RAW STRING "abc" and {} each silently discard the ENTIRE game; null, [], -1,
  -Infinity are safe; "2" and [3] correct by coercion; 1.5 -> 2 and 0.5 -> 1; Infinity and 1e21 clamp
  correctly. THE STRING CASE IS NEW HERE AND IS THE ONE THAT MATTERS - ABC-019 parses a ply count from
  user input and BOTH plausible implementations reach the defect. It is a CORRECTNESS / DATA-INTEGRITY
  defect, NOT a security finding: under ASVS V2.2.1 an unvalidated input used for a business decision
  is L1, and an L1 fail is HIGH by default, WHICH WOULD BLOCK - but IT IS NOT AN L1 FAILURE TODAY
  BECAUSE THE INPUT SURFACE DOES NOT EXIST, a fact MEASURED rather than assumed: src/history.ts has
  ZERO production importers and takeBack/playMove have NO caller outside src/history.test.ts. The
  requirement is not FAILED - it is NOT YET ENGAGED. AND THE COUNTERFACTUAL IS STATED RATHER THAN
  BANKED: the moment ABC-019 wires user input to it, V2.2.1 IS engaged, the default severity is HIGH,
  and IT BLOCKS. Owner BA/PM to rule the guard; place ABC-019. Not fixed and deliberately not pinned.

  playMove'S UNGUARDED PRECONDITION IS WORSE THAN "A CORRUPT BOARD", and that is new: a foreign move
  is accepted silently and gameStatusOf then returns {"result":"draw","reason":"insufficient-material"}
  - a confident, well-typed, WRONG terminal verdict. ASVS V2.3.1 PARTIAL. SEAM 1's priced decision,
  not re-opened. Owner Architect/Design; place ABC-019 / EPIC-003.

  THE COVERAGE HAZARD WAS READ BEFORE COVERAGE WAS RUN. coverage/ tracked (22 files) and NOT in
  .gitignore, both confirmed. QE's mitigation USED AND THEN VERIFIED: --coverage.reportsDirectory
  outside the repo gave src/history.ts 100/100/100/100 against a 0.8 threshold with
  `git status --porcelain -uall coverage` EMPTY and `git diff --numstat 3a44b3f -- coverage` EMPTY.
  The hazard was deliberately NOT reproduced - QE reproduced it twice already under a controlled
  restore and damaging tracked files a third time adds nothing.

  THE SKIP-INTEGRITY CHECKER was re-run rather than inherited: exit 2, "cannot read the registry file",
  registry confirmed absent, RECORDED AS AN ERROR AND NEVER AS A PASS. Skip count 0 by the AGENTS.md
  command, independently captured here (226 total / 226 passed / 0 failed / 0 pending / 0 todo). NO
  REGISTRY FILE WAS CREATED - an agent may not self-author a justification to clear its own gate. This
  gate's board comment and trace row are the first in this project to mention the checker at all.

  THE src/history.ts:42 DOC CONTRADICTION CONFIRMED ON THIS GATE'S OWN INSTRUMENTS, BOTH HALVES:
  "documented and tested" is FALSE (no test touches history.position.board), and the comment forbids
  holding the reference across a takeBack, which the shipped resetTo makes SAFE (measured: the held
  reference is === h.position afterwards, not stale, correctly rewound). Errs safe, so not a blocker.
  Named, not fixed - it is production-code text. Owner BA/PM / ABC-019.

  FIVE ACCEPTED RISKS, NONE UNOWNED: (1) takeBack(NaN)/"abc"/{} destroys the game - MEDIUM - BA/PM /
  ABC-019. (2) playMove validates nothing - MEDIUM - Architect/Design (SEAM 1) / ABC-019 / EPIC-003.
  (3) src/fen.ts accepts out-of-range move counters: 999999999999999999999 ACCEPTED, becomes 1e+21,
  BREAKS FEN ROUND-TRIP BYTE-IDENTITY, and makes gameStatusOf report a seventy-five-move draw before
  the game starts; negative / non-numeric / exponential / hex all correctly rejected, so it is a RANGE
  gap in a control that exists - LOW - BA/PM / EPIC-001, recorded because THIS ticket makes it
  reachable through a new door, newGame(initialFen). (4) coverage/ tracked, unignored and stale - LOW -
  a human; THREE ROLES HAVE FLAGGED IT AND NO TICKET EXISTS, so the missing artefact is named rather
  than a fourth flag added; BA/PM to cut it. (5) every figure is one machine and one Node version -
  LOW - Security/NFR / EPIC-004's already-scheduled non-M3 spike.

  COULD NOT VERIFY, named rather than smoothed: why this gate's playMove figure (8.2-8.6 ns) is 1.5x
  the Engineer's (12.4-12.7 ns) - both >7x under the bar, and the Engineer's harness shape is not
  recorded in enough detail to reproduce; whether the two takeBack framings resolve each other (they
  do not - the delta is below instrument resolution); the true worst case for gameStatusOf across all
  positions (two anchors measured, the rest is arithmetic); and whether EPIC-006 will ever let a user
  type a FEN, which is the scope question accepted risk 3's LOW severity rests on.

  Gates re-run independently at this gate: 226 passed / 10 files / 0 failed, skip count 0, lint,
  typecheck and build all exit 0; src/history.ts md5 12f8c562d46286e68383f8e2cab407fa, IDENTICAL to
  the Engineer's feat commit 47cad31 - the independent confirmation that QE changed no production code.
  NO PRODUCTION CODE CHANGED AND NO TEST ADDED BY THIS GATE.

  plans/nfr-catalog.md: NFR-003's row and NFR-002's boundary-condition block gain ABC-012's real-code
  measurements, replacing what were WAVE-1 PROTOTYPE figures taken before src/history.ts existed. NO
  TARGET MOVED - not one. NFR-001, NFR-004, NFR-005, NFR-006 and NFR-007 are byte-identical rows.
  plans/traceability.md: exactly one row changed (verified), three cells - NFRs, UAT, Status.

  UAT RECORDED AS DEFERRED TO EPIC-006, NOT PASSED - this module has zero importers, renders nothing
  and prompts for nothing, so there is no surface a human can exercise and a UAT pass would be a
  fabrication. ABC-009, ABC-010 and ABC-022 carried, not fixed. NO PR - this repo has no git remote
  and none was invented. NOTHING MERGED, NOTHING DEPLOYED - a human holds both.
moved: pending/ -> claimed/ticket-to-pr-ABC-012-sec/ -> done/ticket-to-pr-ABC-012-sec/ - ALL BY HAND
  (no scripts/claim.js in this install).
