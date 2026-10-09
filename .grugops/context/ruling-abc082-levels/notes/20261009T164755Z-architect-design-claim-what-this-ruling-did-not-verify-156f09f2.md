---
id: 20261009T164755Z-architect-design-claim-what-this-ruling-did-not-verify-156f09f2
kind: claim
by: architect-design
at: 2026-10-09T16:47:55Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-082
  - ADR-0028
supersedes:
---

# What this ruling did not verify

Hand-authored, no `seal`. A claim, not a finding: no `§14-gate` verdict exists on this install.

- **No edit on the build branch.** The two FEN swaps and the A2 literals were applied only in
  `git archive` scratch copies (`probe/scratch-checks.sh`). The Engineer's re-hop applies them and
  runs the gate.
- **Lanes not run:**
  - the full `SEARCH_DEEP=1 src/transposition.test.ts` lane with the A2 literals at `0.1`. Only
    `-t A2` was run, and A2's readings are independent of the literal;
  - the other five deep lanes. No file they read changes.
- **The discard mutant was planted in `src/search.ts` only.** An `engine.ts` copy was not planted.
  Whether the `chooseMove` row reds it rests on the Engineer's deepened reading for `A4_FEN`
  (both variants 50 / d6d5 vs 95 / h5e5), not re-measured here.
- **The chess judgement in ruling 1 is stated, not engine-proved.** "K v K+B+P with a right-coloured
  bishop is a win for the defender" was not searched to mate. The engine's own margin is what the
  row asserts.
- **ADR-0028 is `proposed`.** Nothing here is accepted until the owner says so.
- **Machine:** Apple M3, load 2.0–3.9. All readings are node-deterministic, so load does not move
  them.
