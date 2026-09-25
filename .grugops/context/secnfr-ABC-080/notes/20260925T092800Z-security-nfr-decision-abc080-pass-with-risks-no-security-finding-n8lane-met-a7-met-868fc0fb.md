---
id: 20260925T092800Z-security-nfr-decision-abc080-pass-with-risks-no-security-finding-n8lane-met-a7-met-868fc0fb
kind: decision
by: security-nfr
at: 2026-09-25T09:28:00Z
verified_by:
confidence: high
refs:
  - ABC-080
  - ABC-081
  - NFR-004
  - NFR-005
  - NFR-008
  - N8-LANE
  - ADR-0003
  - ADR-0007
  - ADR-0019
  - AR-NFR004-A
  - AR-NFR005-079
  - AR-QS-ITER1-079
  - AR-N8LANE-079
  - src/search.ts
  - src/engine.ts
  - plans/tickets/ABC-080-move-ordering-mvv-lva-killers-hash-move.md
  - .grugops/context/secnfr-ABC-080/notes/20260925T092500Z-security-nfr-observation-abc080-a7-met-both-runners-nfr005-node-6-5-vitest-4-4-nfr004-holds-615156d2.md
  - .grugops/context/secnfr-ABC-080/notes/20260925T092600Z-security-nfr-observation-abc080-n8lane-no-measurable-charge-minus-250ms-gross-null-admissible-516e88de.md
  - .grugops/context/secnfr-ABC-080/notes/20260925T092700Z-security-nfr-observation-abc080-killer-table-bounded-by-iteration-depth-no-retention-iter1-cheaper-507eedec.md
  - .grugops/context/qe-ABC-080/notes/20260925T090400Z-qe-e2e-decision-abc080-pass-with-findings-9f72677b.md
  - .grugops/context/wave-2026-09-24/notes/20260925T104000Z-orchestrator-decision-36b66fbd.md
supersedes:
---

# Security/NFR gate on `ABC-080`: **PASS_WITH_RISKS**. No security finding, no required fix. `A7` MET, `NFR-004` holds, `N8-LANE` MET. `NFR-005` reported, and its verdict waits for `ABC-081`

**Not a stamp.** `context.human_admission` is `off`, so this is a hand-authored `decision`. It
carries no `§14-gate#<id>` and is not a human acceptance of anything. The evidence is in the three
`observation` notes beside it, and every probe is kept as `raw-harness-*.mjs.txt` with its output
as `raw-out-*.txt`.

`security.asvs_level` is `L1` and `security.block_on` is `high`. `compliance_regime` is `[]`, so no
Compliance Officer hand-off is owed. **Scope** is `4f74acc..cb8ca55 -- src`: six files, two of
them production (`src/search.ts` +140/−15, `src/engine.ts` +24/−11).

## 1. `A7` + `NFR-005`

- **`A7`: MET, measured by this gate**, not taken from the build.
  - Plain node: kiwipete **3 → 6**, position-6 **3 → 5**.
  - Vitest: kiwipete **2 → 4**, position-6 **3 → 4**.
  - Both builds ran in the same process, 5 rounds, build ≥ base in 20 of 20 pairs.
  - Load 3.9–5.5.
- **`NFR-005`:** plain node **6 / 5** and vitest **4 / 4** (`ENGINE_DEEP=1`'s own case also
  reads 4 / 4). The floor stays 6 on the owner's word. Kiwipete meets it in plain node, and
  position-6 is one ply short. **No verdict is taken here. It waits for `ABC-081`**, per the
  catalogue's "WHEN THE FLOOR BECOMES DUE" and the subtask.

## 2. `NFR-004`: **HOLDS**

- **Plain node:** n = 40, p95 **3 004.3 ms**, max **3 006.1 ms**.
- **Ceiling:** 5 000.6 – 5 002.6 ms at unbounded budgets. The abort still binds with ordering and
  killers inside the abortable recursion.
- **Vitest `A1` (30 positions):** this build **3 024 ms**, base **3 021 ms**. There is no tail
  charge attributable to this ticket.

## 3. `NFR-008` / `N8-LANE`: **MET, with no measurable charge**

- **The paired reading:** gross **−0.250 s CPU** (sign 3/8) against an admissible null control
  of −0.035 s (sign 3/8, per-round ±0.86 s), at a median load of 15.7.
- **The Engineer's +10 ms net is CONFIRMED in substance and corrected in form.** Both readings
  sit inside the noise, and neither is the ticket's cost to the millisecond.
- **Attribution, now measured:** the new file costs +955 ms of test time, and ordering makes the
  existing search files 509 ms cheaper.
- **The lane is about 23.7 s against 15 s either way.** That is `ADR-0019` trigger (a) and
  `AR-N8LANE-079`, both **owner-accepted 2026-09-25**. It is inherited and not moved here.

## 4. Security (ASVS L1, block on high): **CHECKED. No finding at any severity**

| looked for | result | severity |
|---|---|---|
| **Killer-table bounds, ply vs `MAX_PLY`** | No main-tree `MAX_PLY` exists and none is needed. `at()` is range-safe (`?? NO_KILLERS`). `record` keeps ≤ 2 quiet moves per ply. Recorded ply is below the deepest iteration started, which the 5 s clamp bounds. **Measured worst: 15 slots × 2 at the ceiling** (locked-pawn king ending, depth 14) | none |
| **Allocation per node** | Yes, at every ordered node: one wrapper per move plus 2 arrays, which is 4.2% of nodes (6 560 of 157 042, kiwipete d5). Plain-node rate −17% / −7%, repaid as +3 / +2 plies. Short-lived and bounded by nodes in budget | none |
| **Unbounded growth across a `chooseMove` call** | None. One table per call, collected after it. The heap drift over 40 calls matches the base build, which has no table (+0.15 vs +0.12 MiB) | none |
| **Unabortable iteration 1** (`AR-QS-ITER1-079`) | **Improved 4–6x**: worst reachable 32 980 → 5 574 nodes (≤ 29 ms); queens rig 87 231 → 19 585 (≤ 67 ms) | risk shrank |
| V1.3.2 · V2.2.1 · V2.2.2 · V15.2.1 [L1] | pass: no dynamic code, no new input path (`cli.ts` and `turn-loop.ts` unchanged), no dependency change | pass |
| all other L1 chapters | n/a: no such surface | n/a |

## Result

**PASS_WITH_RISKS** (the subtask's PASS-WITH-ACCEPTED-RISK).

- **Required fixes: none.**
- **Security findings at high or above: none. Findings at any severity: none.**
- **Risks carried. None is new, and each has a named owner:**
  - **`AR-NFR004-A` (low, inherited). Owner: Security/NFR at `EPIC-006`'s difficulty hop
    (`ABC-087` if that lands first)**, unchanged.
    - **One reading at this build is outside its ≤ 31 ms denomination:** QE's `ENGINE_DEEP` `A1`
      at **3 040 ms (40 ms, 1.33%)**.
    - Three other readings at this build (3 024, 3 024, 3 029.5) are inside it, and base vs
      build pairs at 3 021 vs 3 024.
    - The catalogue records that the tail is scheduler/GC-driven.
    - **This gate does not re-denominate the risk. It cannot, because the row forbids discharge
      by editing it.** Per the row's own text, *"a later reading materially worse … is a NEW
      question"*, so it is recorded for that owner to take at the discharge hop with the number
      40 ms. **Not attributable to `ABC-080` on the paired reading, and not blocking.**
  - **`AR-NFR005-079` (open, inherited).** The floor was kept at 6 by **Olger Oeselg**, and the
    levers and arithmetic belong to **Architect/Design**. Readings are above. The verdict is due at
    `ABC-081`'s close.
  - **`AR-QS-ITER1-079` (low, inherited). Owner: Architect/Design.** It shrank 4–6x here, and no
    revisit trigger fired.
  - **`AR-N8LANE-079` (inherited). Owner-accepted 2026-09-25 by Olger Oeselg.** This ticket adds
    nothing measurable to it.
- **QE's `G1`** (the `engine.ts` killer-update mutation gap) is a test-coverage gap, not a security
  or NFR risk. It is noted, not re-ruled, and its owner stays the Software Engineer.

> **FOR THE OWNER, Olger Oeselg, one question. It is not blocking this ticket, but it must be
> answered before `ABC-081`'s `NFR-005` verdict: WHICH RUNNER DOES `NFR-005` BIND?**
> - The catalogue row names positions, budget and levels, but no runner.
> - On this build the same code reads **depth 6 on kiwipete in plain node and depth 4 under
>   vitest**. Vitest runs about 5x fewer nodes/s, and the cause has not been investigated.
> - Earlier waypoints mixed the two runners.
> - **This gate's recommendation: plain node.** That is how the product runs (`npm run chess` →
>   `node src/cli.ts`). The vitest case stays a regression guard, not the verdict.
> - Architect/Design would draft the one-line clarification to the row; your word ratifies it. No
>   agent moves the level.

**Not done here, by fence:**
- No line under `src/`, `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md` or any ADR was
  written.
- No NFR bar was moved.
- Nothing was merged or pushed.
- The `In Security/NFR` → `Ready for UAT` move is the Orchestrator's.
- UAT: the delivered diff carries production lines (`src/search.ts`, `src/engine.ts`), so the
  zero-production-lines waiver does not apply and the owner's word is needed at `In UAT`.
