---
id: 20261011T162336Z-architect-design-decision-abc151-adr0040-addendum-2-k2-5c4c4ef2
kind: decision
by: architect-design
at: 2026-10-11T16:23:36Z
verified_by:
confidence: high
refs:
  - ABC-151
  - ABC-144
  - ABC-152
  - ADR-0040
  - ADR-0035
  - ADR-0008
  - NFR-008
  - N8-LANE
  - RISK-ABC144-HEAT
  - RISK-ABC144-FCAP
  - memory-bank/50-decisions/ADR-0040-the-default-lane-holds-at-most-four-test-workers-pinned-by-value-and-isolation-stays-on.md
  - .grugops/context/wave-2026-09-25/notes/20261011T161037Z-orchestrator-decision-owner-word-uat-abc083-adr0041-k2-vitest41-adr0034-addendum-fbbdde16.md
  - .grugops/context/secnfr-ABC-144-window-b/notes/20261011T124750Z-security-nfr-observation-abc144-window-b-heat-1ff56629.md
  - .grugops/context/secnfr-ABC-144-window-b/notes/20261011T124750Z-security-nfr-observation-abc144-window-b-readings-bfdcf3b3.md
  - .grugops/context/secnfr-ABC-144-window-b/notes/20261011T124750Z-security-nfr-decision-abc144-window-b-grades-and-result-e451fa31.md
supersedes:
---

# `ABC-151` design: `ADR-0040` addendum 2 records the owner's k = 2. It governs as written, and no owner word is owed for it

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`). The record
is the addendum itself (`ADR-0040` § "ADDENDUM 2, 2026-10-11"). This note lists the decisions and does not
restate their text. **This hop took no timing, CPU or heat reading.** Width 3: Architect `ABC-152` and SE
`ABC-149` were running.

## Decisions

1. **k = 2 is the owner's pick, not decision 2's rule.** Owner's word, verbatim and dated: *"Heat 2 workers is
   fine"*, 2026-10-11 (`…fbbdde16` item 3).
   - Decision 2 still reads 3, the largest eligible k.
   - K2 is also eligible (−22.71 % CPU, 8.38 s). So the pick overrides only "largest", and it does so on heat,
     a criterion decision 2 does not read.
   - Decision 2 is not amended.
2. **Literals** (decision 2: "a smaller k changes the pin's literal and nothing else"):
   - the config: `maxWorkers: 2`;
   - the header paragraph names the pick and addendum 2;
   - the pin: `toBe(2)`, the environment check `≤ 2`, and titles that say 2;
   - the reds: r1, r2, r3, r3b (`VITEST_MAX_THREADS=3`) and `maxWorkers: 3` must turn red, while `=2` and `=1`
     stay green;
   - QE reads `effectiveWorkers` 2 at head and 3 at base.
   - `isolate`, `pool`, `poolOptions`, `fileParallelism`, `minWorkers` and `scripts.test` do not change.
3. **The floors, decision 4 at k = 2.**
   - Sets of ≤ 2 files carry their `F` over. Larger sets and the full lane are re-read.
   - **No recorded `F` moves.** The four recorded sets have 1, 1, 2 and 1 files.
4. **The full-lane `F` (`RISK-ABC144-FCAP`), ruled.** Until a full-lane twin R is read at k = 2, the full lane
   keeps `ADR-0035`'s recorded 1.72 s CPU / 3.25 s wall, the stricter value. An R read at any other k is listed
   and not used. The first chance is expected to be `ABC-152` `V9`. The owner of the risk stays Architect/Design.
5. **The environment.** `VITEST_MAX_THREADS=2` now does nothing. A lane under `=1` (K1 14.68 s warm wall) is
   not an `NFR-008` reading.
6. **The window's step order, fixed here:** warm paired (`A3`/`A4`) → gate → `A5` k = 2 → gate → `A5` k = 3 →
   cooled (only if owed) → opt-in lanes.
   - **Why:** the gate reads the pressure level, not the chassis temperature. This order makes each sequence
     follow about 27 back-to-back runs.
   - So residual heat leans against k = 2, toward asking the owner. That is a claim about direction, not
     measured.
   - Logged per sequence: idle seconds, the time the gate passed, battery state and load1.
7. **The k = 3 heat sequence runs on the base tree,** never on head with `VITEST_MAX_THREADS=3`. The pin turns
   that run red by design.
8. **Two readings of the ticket, open to BA/PM:**
   - `A5` with neither sequence at level ≥ 1 is reported as "not separable", not as k = 2 failing.
   - `A5` does not hold the merge. Its owner outcome goes beside the merge.

## Alternatives rejected

- **Amending decision 2 to read heat.** There is no heat bar to pre-register, and the owner's pick already
  answers the question. A rule for one data point is gold plating.
- **An ABBA order for `A5`** (k2, k3, k3, k2). It doubles the 54 runs, which is about 8 more minutes of
  back-to-back load on a fanless machine (54 × ~8.5 s, arithmetic). The ticket also fixes the order. Placing the
  steps gets the bias pointing the right way at no extra cost.
- **A twin that copies head**, so that the window reads the full-lane `F` at k = 2. The harness pairs each arm
  against `BASE`. A head twin is not an identity twin of base, and supporting one would change the instrument
  that the ticket keeps "as it stands".
- **Changing the minimum idle before each sequence** (a number of minutes). No reading supports any number, so
  the idle time is logged instead.
