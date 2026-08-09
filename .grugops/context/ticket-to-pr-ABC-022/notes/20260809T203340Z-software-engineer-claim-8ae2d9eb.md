---
id: 20260809T203340Z-software-engineer-claim-8ae2d9eb
kind: claim
by: software-engineer
at: 2026-08-09T20:33:40Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ABC-022
  - ABC-023
  - NFR-001
  - src/legal.ts
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# The soft edges of this hop — everything here is `UNKNOWN - verify` and none of it is load-bearing

Recorded so review does not mistake a soft edge for a measurement.

1. **The mutant space is not covered, only sampled.** Three mutants were built (two half-deletions,
   one restructure). The two half-deletions are exhaustive over *this diff* — there are exactly two
   conditions to delete — but the space of alternative *implementations* is unbounded. BA/PM said the
   same of their two; mine add nothing to that coverage claim. **QE's mutation campaign is the
   instrument for this, not my three trees.**

2. **`A5`'s restructure mutant is my reconstruction of BA/PM's description, not their artifact.** It
   reproduces the reported behaviour exactly (passes everything, fails only `A5`, all four rows), but
   its md5 `dd5b7ab68fe2a7f2a1ec2cd80740c251` differs from their `603fccf48f6373360f89d73b8ebbbcc2`,
   so it is a same-shape independent build and not a byte-level corroboration of theirs.

3. **The 512-state exhaustion behind `A5`'s equivalence proof was NOT re-derived by me.** I relied on
   it when choosing the emptiness-shaped clause over the colour-shaped one. If that exhaustion is
   wrong, the clause shape becomes a behavioural choice rather than a readability one. It is BA/PM's
   measurement, carried as such — as is the `toFen` non-injectivity (28 castling aliases, `epSquare`
   32 ≡ 40), which I used to justify keeping `toFen` out of the test file without re-measuring.

4. **`A9`'s "no existing test is modified" is proved for MY diff, not guaranteed for the ticket.** It
   is mechanically true here. It says nothing about what a later hop might need to touch.

5. **No claim that the criteria set is complete.** Seven defects were found where a careful pre-check
   named two, and I found a candidate eighth (`src/legal.ts` 69-71) while implementing. On this board
   "that was the last one" has been wrong repeatedly. I did not audit the ticket's prose; I read it
   for what it required of me.

6. **The judgement to route the eighth rather than fix it is a judgement.** Its falsity is measured;
   the boundary call is not. A reviewer who thinks the boundary should have stretched is disagreeing
   with a decision, not with a number.

7. **The aggregate ratio is three rounds, not seven.** `ABC-009`'s hop ran seven rounds with two
   independent samples; this ran three rounds of three trees. The bar is met with the null control
   larger than the signal either way, but the sample is smaller and **no per-cell or per-run cost
   figure should be quoted from it**. The `~0.01%` true-cost arithmetic Security/NFR did for
   `ABC-009` was not repeated here; my count (331 evaluations) supports the same conclusion but I did
   not measure a ns-per-operation figure to convert it.

8. **All throughput figures are one machine.** Apple M3 / Node v24.12.0 / darwin-arm64. `UNKNOWN -
   verify` anywhere else.

9. **`ABC-023`'s hash invalidation is now REAL rather than predicted, and it is still open.**
   `src/moves.ts` is `6335b452fc21ffe2d0f902ecab930840` on this branch. `ABC-023`'s `A4` pin is
   already stale against the branch tip and will be stale against `main` the moment this merges.
   Deferred by design; nothing here discharged it.

10. **Queue and note plumbing deviate from the workflows as written, and the deviation is recorded
    rather than presented as compliance.** `scripts/claim.js` and `scripts/context-io.ts` do not
    exist in this install — re-checked at the source rather than trusted from the brief: there is no
    `scripts/` directory in the repository and none in the kit root, and `mcp__grugops__propose_note`
    is not in this session's tool set. The claim was a plain atomic `mkdir` (exit 0, so first writer)
    and these notes are hand-written in the exact shape of `agent-factory/contracts/context-note.md`.
    **No `finding` is written** — none is admissible: no §14 gate exists here to issue a
    `§14-gate#<id>` stamp and `context.human_admission` is `off`, so no `human:<name>` stamp exists
    either. **Nothing is self-stamped and no `index.md` / `index.jsonl` was hand-faked.** `at` was
    taken from `date -u`; this machine is **UTC+3**, so a local timestamp labelled `Z` would be a
    three-hour lie.
