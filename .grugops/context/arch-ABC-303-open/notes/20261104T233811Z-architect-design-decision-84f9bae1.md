---
id: 20261104T233811Z-architect-design-decision-84f9bae1
kind: decision
by: architect-design
at: 2026-11-04T23:38:11Z
verified_by: 
confidence: high on bar, re-point and no red: the ADR text decides them; UNKNOWN - verify on the WithoutBundle door's figures, not run
refs:
  - ABC-303
  - ABC-279
  - ADR-0069
  - ADR-0072
  - ADR-0058
  - ADR-0050
  - ADR-0061
  - orch-2026-10-30a/20261104T215525Z-orchestrator-decision-3e73f9f9
  - se-ABC-303/20261104T232604Z-software-engineer-observation-75e4058e
supersedes: 
seal: sha256:aa24ca3e6579e5fc698cbf874fd9b4c1e6fe0a53b0420be2191a0dbff86367a3
---

# arch-ABC-303-open item 1: `ABC-279` A3 (a) is a bar, and it may re-point. The 90.91 % is no red, no STOP and no owner question. The row sits one rung short of its right door; a correction is owed, and it gates nothing

Architect/Design, task `arch-ABC-303-open`, records only, from `main` `c118a5cf`. Lines of record: `ADR-0069` d11's and `ADR-0072` d7's dated lines of this date. No run fed this ruling. The figures are `se-ABC-303`'s lane output and `qe-ABC-279`'s.

**The ruling.**
1. **Bar or pin: a bar.** ≥ 93 %, ≤ 144 cp and 0 sign changes are `ADR-0069` d11's derived levels, and F1 names them. No literal moves.
2. **May it re-point: yes, and the rule requires it.** Bar and re-point are separate questions: a re-point moves the search on the row's shipped side and no level. The engineer looked at `ADR-0072` d7, which names only count rows. The governing sentence is d6: "Rows re-point by `ADR-0050` d4, `ADR-0058` d5, `ADR-0059` d6, `ADR-0061` d6". Those re-point every row "whose shipped side is `search()` or `chooseMove` and whose other side is an older door", and they name the d5 drift rows. `ADR-0069` d8 sends this row to the same four. A3 (a)'s other side is `…WithoutSeePruning`, an older door. So the records do settle it; the engineer's `UNKNOWN - verify` is closed.
3. **The rejected reading.** "Value and behaviour rows stay on the shipped path" might seem to hold a drift row there. It does not: `ADR-0061` d6 lists those rows as zugzwang, mates and `G1`, which compare with no door, and `ADR-0050` d4 re-points the d5 drift by name.
4. **Not a red, so no STOP and no owner's word.** The override is not used and not stretched: his word stays on L2 and CH3.
5. **Had it stayed on the shipped path** (the Orchestrator's question, for the record): it would be a red nothing overrode, not a read-blocking table row but a failing deep bar. That would be a STOP to Architect/Design, and any lift would be the owner's.

**What the engineer's comment gets wrong, and the correction.**
- The comment at `de15cfb2` says the row "measures `ABC-279`'s skip". As built it does not. `ABC-283` re-pointed A4 (a) to `…WithoutBundle` and left A3 (a) on `search` / `chooseMove`. So since `58e90d07` the row has read Q1 plus history, SEE ordering and aspiration, and `…WithoutQuietBundle` keeps that.
- The form of record is `searchWithoutBundle` / `chooseMoveWithoutBundle`, the door one rung above Q1's, where the drift rows of futility, null move, LMR and quiescence already stand. It should read 96.26 % / 95.72 %, 66 / 96 cp. That is `UNKNOWN - verify` until the lane runs: this hop's one run was item 2's. A red there comes back here, and no bar moves.
- It rides with item 2's test-only hop on `main`. `ABC-303` takes it when `main` goes in, and its comment goes then. As built, the row is allowed and green, so this gates neither QE's seal nor the read.

**What the row measures, in plain words.** Take 190 test positions and search each to depth 5 twice: once with today's engine, once with an old engine that has no SEE pruning, no history, no SEE ordering, no aspiration and neither bundle part. 187 give non-mate scores on both sides. The row counts how many of the two scores agree within 25 cp, a quarter of a pawn.

**What 90.91 % means.** 170 of 187 agree. 17 differ by more than a quarter of a pawn. The bar needs 174, so it is four positions short. The worst gap is 96 cp, on kiwipete f3f4, the same position and the same gap Q1 alone read, well inside the 144 cp cap. No mate changed sign. The `search()` side of the row passed; its figure is not on record.

**What it means for play: nothing direct, and it is not a defect signal.**
- It compares two engines with each other, not one engine with the truth. The old engine is the weaker one (`ABC-283` alone read 66.0 / 100 against its base). A better search moving away from it is expected, so the row cannot tell a better score from a worse one.
- It reads scores at depth 5, not moves and not results. C2′ is what reads play.
- The row was green on `main` (`ABC-303`'s all-off door read 52 / 52 in `deep-lanes-2.txt`), so the bundle moved at least four positions past 25 cp on this yardstick. The exact figure on `main` is not on record.
- **It is not the figure the owner was shown.** His 93.6 % / 80 cp is P4 against P4's own door. 90.91 % is the whole stack against a door four changes old. The two cannot be compared, and 90.91 % says nothing new about P4. The figure that speaks to wrong cuts is the audit, R2: 15.27 %, 29 errors ≥ 200 cp, which he took knowingly.

**Owed:** the PR lists this row with 90.91 %, 96 cp, 0 changes beside it (`ADR-0058` d5). Not ruled here: the engineer's other three re-points, which the brief does not ask about; QE checks them against the PR list. `src/engine.test.ts` A3 is the one to read closely, because it is a behaviour row whose premise left the shipped path.
