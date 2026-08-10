---
task: ticket-to-pr-ABC-025
subtask: ticket-to-pr-ABC-025-qe
role: qe-e2e
by: qe-e2e
at: 2026-08-10T16:01:42Z
method: MANUAL-BY-HAND
completed_at: 2026-08-10T16:33:00Z
outcome: |
  `ABC-025` QE-GATED **PASS_WITH_RISKS**. Moved `In Review` -> `In Security/NFR` (In Review 1/3 ->
  0/3, In Security/NFR 0/2 -> 1/2). NOTHING MERGED, NOTHING DEPLOYED.

  **49 MUTANTS OVER TWO TREE STATES — 0 broken builds (`tsc --noEmit` exit 0 on all 49 in both
  passes), 0 harness errors.** The set was chosen by a DIFFERENT ROUTE from the two prior hops'
  shared one (they both read `ABC-013`'s criteria and QE's five): a per-token operator sweep over
  every decision point in `src/san.ts`, plus two INTERACTION classes a per-token sweep cannot reach,
  plus five equivalence controls of my own. That is what found the hole.

  **FOUR WRONG BUILDS PASSED THE DELIVERED NET 672/672, ALL ONE CLASS: a qualifier and a check/mate
  suffix on the SAME string** (`QS2` the suffix dropped whenever a qualifier is emitted, `QS3` a
  qualified mate loses its `#`, `QS4` the square rung only, `QS6` mate only). Cause MEASURED: **0 of
  the repository's 111 hand-typed rows carry both parts**, and `ABC-025`'s 207-position corpus holds
  **32 qualified checks and ZERO qualified mates**; `A1` strips a trailing `+`/`#` before reading the
  qualifier back out (it must — it is a qualifier property), injectivity cannot see a dropped suffix
  because rivals keep distinct qualifiers, and the shape property accepts a suffix-free string.
  **CLOSED HERE** by `src/san.suffix.hardening.test.ts` (NEW, +168/-0, 5 positions, 11 hand-typed
  rows, 4 tests, 6 ms): a qualified check at all three rungs, a qualified capture that checks, the
  only qualified MATE in the repository, and a non-vacuity row. All four now die; 676/676.

  **THE TICKET'S 13 RE-SPECIFIED AND EVERY VERDICT AND EVERY INTERNAL COUNT REPRODUCED ON A THIRD
  INSTRUMENT** — `A1` 412 / 24 / 110 / 536 / 30 / 116 / 412 and injectivity 44 / 53 / 50, the same
  integers BA/PM and the Engineer measured with harnesses that share no code with this one.
  **ALL FOUR EQUIVALENT CONTROLS `Q22` `Q24` `Q29` `Q40` ARE STILL ALIVE AT 676/676, KILLED COUNT
  ZERO**, and 3 of my own 5 as well; the only rows that kill a behaviour-equivalent build anywhere
  in the repository are `san.nfr.test.ts`'s `N1` call-count assertions, which exist to pin cost.

  `A2` IS NOT VACUOUS BUT ITS 44 IS UNPINNED — measured by mutating the TEST file out of tree:
  dropping `["B", BISHOP]` from `CELL_TYPES` leaves the `44 of 44` row GREEN at 32/32 and only the
  leave-one-out row catches it. `A1` reads the qualifier OUT of the emitted string and is a ladder
  SEARCH rather than a second copy of the flags, so `## Test notes` 2 and 3 are honoured; it is
  blind to the piece LETTER itself (`T08`, the king's letter lower-cased, dies on `ABC-013`'s `A2`).

  **`A6` RE-VERIFIED ON THIS HOP'S OWN INSTRUMENT**: `src/san.ts` md5 `cbcc3be37c21414d16e8e6b4d0c68959`
  unchanged, ZERO deletion lines under `src/`, the diff over every pre-existing `src/` file EMPTY,
  and `src/san.qualifier.hardening.test.ts` BYTE-IDENTICAL to its delivered state (md5 `856ebab1...`)
  — no delivered row modified, because this hop's rows are their own file. `package.json` /
  `package-lock.json` byte-unchanged; `chess.js` absent from the repository's `node_modules`.
  GATES: **676/676 on 22 files, skip 0**, lint exit 0 (40 files, the same 2 PRE-EXISTING infos),
  typecheck 0, build 0, `PERFT_DEEP=1` **32/32 exact in 36.76 s**.

  **`N5` BREACHED FOR THE THIRD TIME AND ALSO UNMEASURABLE AS WRITTEN.** +6.7% (wall median) /
  +8.8% (wall min) / ~18% (the delivered file's own test time, 236-242 ms) against a <= 5% bar; and
  over 9 INTERLEAVED rounds the within-condition spread of the UNCHANGED lane is **330 ms against a
  bar worth ~85 ms**, so the bar names a ratio but no statistic and no sample size. This hop's rows
  cost 6 ms (~0.4%), BELOW that noise floor — they do not change the runtime picture. The bar was
  NOT moved and `plans/nfr-catalog.md` was NOT edited: a gate does not move a target.

  **THE EVIDENCE OFFERED FOR DROPPING `A1`'S UNASSISTED HALF IS NOT EVIDENCE** — none of the 13
  mutants can distinguish `toSan`'s two call forms by construction, so their identical assisted /
  unassisted counts say nothing about the clause. Four mutants built to be call-form asymmetric are
  all killed, and **`A5` — recorded by the ticket and the Engineer as "corroboration, not a
  mutant-killer" — is red for all four**, and for `CF1` is one of only three rows that catch it.

  SIX RISKS, each with a named owner and a trigger. FIVE NOTES published (2 `observation`,
  1 `decision`, 1 `artifact-ref`, 1 `claim`); NO `finding` — none is admissible on this hop (no §14
  gate verdict record under this task, `context.human_admission` off). Nothing self-stamped.
moved: pending/ -> claimed/ticket-to-pr-ABC-025-qe/ -> done/ticket-to-pr-ABC-025-qe/ — ALL BY HAND.
---

# Claim record — the now-running registry entry

Queue claim taken BY HAND, and the deviation is recorded rather than presented as compliance.

`scripts/claim.js` does not exist in this install, **re-checked at the source at this hop** rather
than inherited from the subtask brief or from the three prior claim records under `done/`: there is
no `scripts/` directory in the repository (`ls scripts/` → "No such file or directory"), and a
repository-wide `find` for `claim*` / `context-io*` (excluding `node_modules`) plus the same find
across the kit root `/Users/olgeroeselg/.grugops/agent-factory` returns only this queue's own
`claim.md` registry records — no script, anywhere, in either tree.

The claim IS the atomic `mkdir(2)` of this directory — the same primitive `claimTask` relies on — so
the exactly-once property is unchanged. It exited **0**, so this claim was the first writer; a second
writer would have taken `EEXIST` and this hop would have stopped. The `pending/ → claimed/`
transition is a `git mv` (rename(2)), the atomic rename Workflow 17 step 3 names.

`pending/` held exactly one file and `claimed/` was empty when this hop started, so queue width was 1
and no contention was possible: **the claim is degenerate**, recorded rather than glossed. No
stale-claim sweep was owed (`claimed/` was empty), and the sweep is the coordinator's in any case.

Workflow 16's sanctioned writer `scripts/context-io.ts` is likewise absent, and the structured
`mcp__grugops__propose_note` tool is **not** in this session's tool set — checked against the tools
actually available rather than assumed. Notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-025/notes/` in the exact shape of
`agent-factory/contracts/context-note.md`, as every prior note on this task did. **No `finding` is
written**: none is admissible on this hop — there is no `§14-gate` verdict record under this task to
issue a `§14-gate#<id>` stamp, and `context.human_admission` is `off` in
`.grugops/factory.config.json`, so no `human:<name>` stamp exists either. No `index.md` /
`index.jsonl` is hand-faked.

`at` is `date -u` output taken at the moment of the `mkdir`, not a local clock and not the runner's
`Start at` line. This machine is UTC+3. The subtask's own `enqueued_at: 2026-08-10T16:05:41Z` runs
~4 minutes AHEAD of this machine's `date -u` reading at claim time (`16:01:42Z`) — the same
hand-written-stamp drift the Orchestrator recorded against itself on the previous hop. Recorded
rather than smoothed; `at` is the real reading.
