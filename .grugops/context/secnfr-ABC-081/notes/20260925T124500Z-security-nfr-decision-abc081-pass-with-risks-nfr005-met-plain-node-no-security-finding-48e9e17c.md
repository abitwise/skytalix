---
id: 20260925T124500Z-security-nfr-decision-abc081-pass-with-risks-nfr005-met-plain-node-no-security-finding-48e9e17c
kind: decision
by: security-nfr
at: 2026-09-25T12:45:00Z
verified_by:
confidence: high
refs:
  - ABC-081
  - NFR-004
  - NFR-005
  - NFR-008
  - NFR-009
  - N8-LANE
  - ADR-0003
  - ADR-0007
  - ADR-0019
  - ADR-0025
  - AR-NFR004-A
  - AR-NFR005-079
  - AR-QS-ITER1-079
  - AR-N8LANE-079
  - src/transposition.ts
  - src/search.ts
  - src/engine.ts
  - plans/tickets/ABC-081-transposition-table-and-in-tree-repetition.md
  - .grugops/context/secnfr-ABC-081/notes/20260925T124200Z-security-nfr-observation-abc081-nfr005-met-6-6-plain-node-5-5-vitest-nfr009-met-nfr004-holds-f3a2f269.md
  - .grugops/context/secnfr-ABC-081/notes/20260925T124300Z-security-nfr-observation-abc081-n8lane-met-plus-360ms-gross-200ms-net-null-admissible-a4e009b8.md
  - .grugops/context/secnfr-ABC-081/notes/20260925T124400Z-security-nfr-observation-abc081-table-bounded-key-verified-moves-legal-capacity-guard-unreached-k4-low-80a49b24.md
  - .grugops/context/qe-ABC-081/notes/20260925T110500Z-qe-e2e-decision-abc081-verdict-pass-with-findings-d4e6a1b7.md
  - .grugops/context/wave-2026-09-24/notes/20260925T180000Z-orchestrator-decision-0288b6ed.md
  - .grugops/context/wave-2026-09-24/notes/20260925T104000Z-orchestrator-decision-36b66fbd.md
supersedes:
---

# Security/NFR gate on `ABC-081`: **PASS_WITH_RISKS**. `NFR-005` MET on the binding runner (plain node 6 / 6). `NFR-009` MET. `NFR-004` holds. `N8-LANE` MET. No security finding; two LOW reliability risks with named owners

**Not a stamp.** `context.human_admission` is `off`, so this is a hand-authored `decision`. It
carries no `§14-gate#<id>` and is not a human acceptance of anything. The evidence is in the three
`observation` notes beside it. Every probe is kept as `raw-harness-*.mjs.txt`, with its output as
`raw-out-*.txt`.

`security.asvs_level` is `L1` and `security.block_on` is `high`. `compliance_regime` is `[]`, so no
Compliance Officer hand-off is owed.

**Scope** is `6033d05..504f046 -- src`: seven files, three of them production.
- `src/transposition.ts` +176, new.
- `src/search.ts` +164/−24.
- `src/engine.ts` +84/−14.
- The `src/` tree at `c9d65a0` / `ff28ae5` is byte-identical to `504f046`.

## 1. `NFR-005` (floor 6, binds plain node on the owner's word): **MET**. Depth 7 WARN

| runner | kiwipete | position-6 | rounds | load1 |
|---|---|---|---|---|
| **plain node (binds)** | **6** ×5 (base 6) | **6** ×5 (base 5) | 5, same process as the base | 3.58–4.62 |
| vitest (reported, not the verdict) | 5 ×5 (base 4) | 5 ×5 (base 4) | 5, same process | 3.19–3.67 |

- **This is the verdict** that `plans/nfr-catalog.md` § "WHEN THE FLOOR BECOMES DUE" sets at the
  close of the last of `ABC-079`, `ABC-080` and `ABC-081`. **The floor holds on both positions,
  in every round.**
- **Headroom:** depth 6 completes by 2.0 s on both positions, so about 1 s (33%) is spare on this
  M3.
- **Depth 7 is not reached even at 5 s.** So the **WARN** level stands, and it is still
  PROVISIONAL per the row (non-M3 hardware is `UNKNOWN - verify`).
- **`AR-NFR005-079`**, *"NFR-005 below its floor"*, no longer describes the binding reading.
  - **This gate recommends that its owner close it.** It is not closed here: the register entry is
    the owner's.
  - The owner of the decision is **Olger Oeselg**. The owner of the levers is
    **Architect/Design**.
  - The depth-7 WARN is not part of that risk. It already has its home in `ABC-121` and the
    `EPIC-004` spike.

## 2. `NFR-009` (16 MiB; the owner licensed up to 128 MiB only on a measured need): **MET**

- **The total is about 4.00 MiB:** a 4 194 304 B table, a 1 032 B key array and a killer table of
  tens of references.
- **Growth 1 s → 3 s:** `arrayBuffers` +0.000 MiB and `heapUsed` −0.128 MiB.
- **Growth across 30 calls:** `arrayBuffers` is flat. `heapUsed` moves +0.14 MiB, against +0.13
  on the base, which has no table.
- **Measured need for more: none.** 2^16, 2^18 and 2^20 tables all read depth 6 on both positions
  at 3 s. **Nothing is handed up, and no re-level is proposed.**

## 3. `NFR-004`: **HOLDS**, with the table in the abortable recursion

- **Plain node:** n = 40, p95 **3 004.3 ms**, max **3 005.8 ms**.
- **Ceiling:** **4 999.8 – 5 008.8 ms**.
- **Clear per search:** ≤ 0.062 ms, and ≤ 0.021 ms on a table left dirty by a real search. The
  first-call allocation costs 0.05 ms.
- **Two tail readings are recorded for `AR-NFR004-A`'s owner.** Neither is attributable to this
  ticket on the paired reading.
  - Vitest **3 037.3 ms** (base 3 027.7 in the same process). That is 37.3 ms, outside the
    ≤ 31 ms denomination.
  - The queens rig at the ceiling, **5 008.8 ms**, which is inside the denomination.

## 4. `NFR-008` / `N8-LANE`: **MET**. The charge is +360 ms gross and +200 ms net, against 650 ms

- **The reading:** paired, n = 8, sign 6/8, against an admissible null of −0.060 s (−0.25%,
  sign 2/8) at a median load of 18.7.
- **The build's +220 / +60 is CONFIRMED as MET and CORRECTED UPWARD in size.** Both instruments
  read positive, so the honest figure is a small, probably real charge of 0.2–0.4 s gross.
- **Attribution:** the new test file adds +891 ms and `engine.test.ts` adds +193 ms. The
  `!(depth >= 1)` root guard saves 762 ms in `search.qe.test.ts`.
- **Against `AR-N8LANE-079`:**
  - that acceptance is `ABC-079`'s, owner-accepted by Olger Oeselg on 2026-09-25. It covers that
    ticket's charge, not later ones;
  - this ticket meets its own 650 ms bar, so **no new owner word is owed**;
  - the lane reads about 24.0 s against 15 s, and trigger (a) stays fired.

## 5. Security (ASVS L1, block on high): **CHECKED. No finding at any severity against an L1 requirement**

| rule item 6 | result | severity |
|---|---|---|
| **Index bounds (hash → slot)** | `key & (2^18−1)` is in range by construction. The packed-word fields fit (depth ≤ 8 191). The key-array index is ≤ 128 of 129 | none |
| **Full-key verification on hit** | Present: the full 64-bit compare, and T7 dies. The residual is a true 64-bit collision, about 7 × 10⁻¹⁴ per move, and it could only mis-score a node, never produce an illegal move | none |
| **Capacity guard (QE K3)** | **Unreached in play.** The deepest iteration found at 5 s is **40** (a caged-king board; the base reads 18) against 128. There were 12 runaway boards and 2 hunt hits; a second hunt found 0 candidates. It is not proven that no board exists whose tree dies out, but the clock and the legal root list bound the consequence | **LOW** (untested defense-in-depth) |
| **Hang class (QE K4) + no OS-level test timeout** | **Test-API-only.** Production never calls `search()` and reaches the engine only at a constant budget. `chooseMove` is bounded for NaN, 0, negative and `Infinity` budgets. The missing process timeout is confirmed, and **the failure is closed**: a hung gate never goes green | **LOW** (gate availability) |
| **Allocation per node** | No typed allocation per node. One 1 032 B key array per search (K1 and K2 die). BigInt temporaries per node, which are short-lived. The node rate moved +1% on kiwipete and −5% on position-6 | none |
| **Unbounded growth** | None. The table is fixed at 4 MiB and cleared at every search entry, so nothing crosses between moves | none |
| **Stored move replayed without legality** | None. `entryMove` matches only inside the node's own `legalMoves` list. The root move always comes from `legalMoves(position)`. 12 of 12 probe boards returned a move from a fresh legal list | none |
| V1.3.2 · V2.2.1 · V2.2.2 · V15.2.1 [L1] | pass: no dynamic code, no new input path, no dependency change | pass |
| all other L1 chapters | n/a: no such surface | n/a |

## 6. `NFR-005` catalogue wording the row owes, now that the owner has ruled plain node binds. **PROPOSED, not edited**

`plans/nfr-catalog.md` is fenced from this hop. The owner's note (`…0288b6ed`) gives the wording
to Security/NFR's pen at this gate. So it is proposed here verbatim, for the hop that holds the
catalogue.

**(a) The one change the row owes.** In row `NFR-005`, column 3 (the target), insert this
immediately after *"Node rate is a **diagnostic, not the target**"*:

> **Runner: plain `node`.** Depth-in-budget is read from `chooseMove` at `DEFAULT_BUDGET_MS` on
> the real clock, in a plain `node` process — the product's own runtime (`npm run chess` →
> `node src/cli.ts`). A depth read under vitest (5–7x fewer nodes/s on the same code, measured at
> `ABC-080` and `ABC-081`) is a regression indicator, reported and never the verdict. Ruled by
> Olger Oeselg, 2026-09-25 (*"2. use recommendation"*, `wave-2026-09-24` note `…0288b6ed`).

**(b) The status the row can then carry** (last column, appended, no other byte moved):

> **FLOOR MET at `ABC-081`'s close** (Security/NFR `secnfr-ABC-081`, 2026-09-25, Apple M3, node
> v24.12.0): plain node kiwipete **6**, position-6 **6**, 5 of 5 rounds, load 3.6–4.6; depth 6
> completes by 2.0 s. **Depth 7 not reached (WARN, still PROVISIONAL).** Vitest reads 5 / 5.

**(c) A gap in the row's instrument, named and not proposed as wording.**
- `engine.test.ts`'s `ENGINE_DEEP` case, *"NFR-005 — depth-in-budget, MEASURED and reported"*,
  runs under vitest and asserts only `depth >= 1`.
- **So nothing in the suite would go red if the binding plain-node reading fell to 5.**
- `NFR-009`'s own check already spawns a child `node` from the `ENGINE_DEEP` lane, so that shape
  exists.
- Whether to add such a guard, and the tolerance for machine load, is **Architect/Design**'s call.

## Result

**PASS_WITH_RISKS**, which is the subtask's PASS-WITH-ACCEPTED-RISK.

**Required fixes: none.** Security findings at high or above: none. Findings against an ASVS L1
requirement: none.

**New risks, each LOW, each with a named owner:**
- **`R-081-K4`, the hang class plus no OS-level test timeout on `npm test`.**
  - **Owner: the Orchestrator** (`AGENTS.md`'s Test slot), with **Olger Oeselg**'s word if a
    command changes.
  - Portability note: `timeout` here is Homebrew's; stock macOS has none.
- **`R-081-K3`, the capacity guard has no test that reaches it.**
  - **Owner: the Software Engineer**, at the next licensed touch of `src/search.ts`.
- **An informational line, with no owner:** above iteration 8 191, the 13-bit depth field would
  alias. That is unreachable (the deepest seen is 40), and it would touch only `A1`'s exactness.

**Inherited risks, re-read:**
- **`AR-NFR004-A` (low). Owner: Security/NFR at `EPIC-006`'s difficulty hop.** Two readings are
  recorded for it: vitest at 37.3 ms, outside the denomination, and the queens rig at 8.8 ms over
  5 s. Neither is attributable to this ticket.
- **`AR-NFR005-079`.** Its condition no longer holds on the binding runner. **Closure is
  recommended**, and it is **Olger Oeselg**'s.
- **`AR-QS-ITER1-079` (low). Owner: Architect/Design.** It was **not re-measured** here. Iteration 1
  now also runs the repetition scan and the table probe and store. `UNKNOWN - verify` at the next
  touch; there is no reason on reading to expect a revisit trigger.
- **`AR-N8LANE-079`**, owner-accepted. This ticket's own charge is within its bar.

**QE's non-security gaps** are not re-ruled here: `A4`'s search-level mate-in-2 fixture and
`A2`'s thin margin. Their owners stay as QE named them.

> **FOR THE OWNER, Olger Oeselg. None of these blocks this gate:**
> 1. **Ratify, or have Architect/Design place, the `NFR-005` wording in section 6 (a) and (b).**
>    It is proposed only; the catalogue is untouched.
> 2. **Close `AR-NFR005-079`?** The floor is met on the runner you chose. The depth-7 WARN
>    remains, and it is `ABC-121`'s.
> 3. **`R-081-K4`: do you want a process-level timeout on the Test command?** It is LOW, and the
>    failure is closed. It is yours because it would change `AGENTS.md`'s command.
> 4. **UAT:** the delivered diff carries production lines, so the zero-production-lines waiver
>    does not apply. **Your word is needed at `In UAT`.**

**Not done here, by fence:**
- No line under `src/`, `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md` or any ADR was
  written.
- No NFR bar was moved.
- Nothing was merged or pushed.
- The `In Security/NFR` → `Ready for UAT` move is the Orchestrator's.
