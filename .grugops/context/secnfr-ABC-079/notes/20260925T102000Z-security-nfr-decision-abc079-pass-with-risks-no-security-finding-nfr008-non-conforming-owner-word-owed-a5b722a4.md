---
id: 20260925T102000Z-security-nfr-decision-abc079-pass-with-risks-no-security-finding-nfr008-non-conforming-owner-word-owed-a5b722a4
kind: decision
by: security-nfr
at: 2026-09-25T10:20:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - NFR-004
  - NFR-005
  - NFR-008
  - N8-LANE
  - ADR-0003
  - ADR-0014
  - ADR-0019
  - ADR-0024
  - AR-NFR004-A
  - src/quiescence.ts
  - src/engine.ts
  - src/search.ts
  - plans/tickets/ABC-079-quiescence-search-on-captures.md
  - .grugops/context/secnfr-ABC-079/notes/20260925T101000Z-security-nfr-observation-abc079-nfr004-holds-nfr005-depth-3-first-iteration-bounded-ceiling-holds-stack-shallow-8c746b63.md
  - .grugops/context/secnfr-ABC-079/notes/20260925T101500Z-security-nfr-observation-abc079-nfr008-lane-paired-charge-3625-ms-cpu-8-of-8-null-control-admissible-905148a8.md
  - .grugops/context/qe-ABC-079/notes/20260925T090000Z-qe-e2e-decision-abc079-delta-pass-d1-d4-true-g1-g2-closed-r2a-also-red-4a7bc08c.md
supersedes:
---

# Security/NFR gate on `ABC-079`: **PASS_WITH_RISKS**. There is no security finding and no required fix. `NFR-004` holds. `NFR-005` is below its floor, and the re-level is the owner's call. **`NFR-008` is NON-CONFORMING: this ticket charges 3.47 s net against `N8-LANE`'s 650 ms (5.3x), and this gate does NOT accept that on the owner's bar. His word is owed before merge.**

**Not a stamp.** `context.human_admission` is `off`, so this is a hand-authored `decision`. It
carries no `§14-gate#<id>` and it is not a human acceptance of anything. The evidence is in the two
`observation` notes beside it, and every probe is kept as `raw-harness-*.mjs.txt`.

`security.asvs_level` is `L1` and `security.block_on` is `high`. `compliance_regime` is `[]`, so
no Compliance Officer hand-off is owed. Scope is `ABC-079`'s four commits and seven files, not the
21 other files the subtask's `4f0ef01..cb5540d` range carries (see the first observation).

## 1. `NFR-004` (≤ 3 s at default difficulty, 5 s hard ceiling): **HOLDS**

- **The reading:** n = 40 on the six perft roots, a capture-dense middlegame and the worst
  first-iteration board. **p95 3 003.5 ms, max 3 004.0 ms.**
- **The overshoot:** 36 of 40 calls ran past 3 000 ms, by at most 4.0 ms. That is the abort
  granularity, and it is inside ABC-078's accepted risk `AR-NFR004-A` (≤ 31 ms). That risk's owner,
  Security/NFR at `EPIC-006`'s difficulty hop, and its discharge route are unchanged.
- **The ceiling:** at `budgetMs` `Infinity` and `1e9` the reads are 4 999.8 to 5 002.1 ms, with the
  abort landing inside `quiesce`.
- **The 300 ms figure:** `nfr.perf_p95_ms` (300 ms) does not apply to a budget-spending search. The
  catalogue already records it as an untrue bootstrap default, and it is reported, not graded.

## 2. `NFR-005` (depth in budget): **depth 3 on kiwipete, depth 3 on position-6**, against a FAIL floor of 6. For the OWNER, not re-levelled here

- **Kiwipete** went 4 → 3 against ABC-078's record. **Position-6** stays at 3.
- **Why this is not a ticket failure (the ABC-078 gate's reasoning, applied again):**
  - The bar was written for a finished engine. Quiescence trades raw depth for leaves that are not
    in the middle of a trade.
  - The tickets that buy the depth back are unbuilt: `ABC-080` (move ordering), `ABC-081`
    (transposition table) and `ADR-0003` clause 3 (c1).
- **The rate arithmetic:** `ADR-0024` decision 6 already states that, at a measured quiescence
  factor near 45, depth 6 in 3 s needs about 850k nodes/s. This gate measured 250k–390k in plain
  node.

> **FOR THE OWNER, Olger Oeselg. This is a question, not a ruling, and no agent moves this level.**
> `NFR-005`'s ratified depth-6 floor (and the provisional depth-7 WARN) is likely unreachable by
> node rate alone once quiescence is in the leaf. Two honest options:
> **(a)** keep the floor, and treat it as the target `ABC-080` / `ABC-081` / c1 must reach before
> `EPIC-004` closes; or
> **(b)** re-level it on `ADR-0024`'s arithmetic (Architect/Design to draft; his word to ratify).
> Until he answers, every engine ticket reads `NFR-005` as FAIL, and gates record it rather than
> fail tickets on it.
> **Risk `AR-NFR005-079`:** the owner of the decision is **Olger Oeselg**. The owner of the levers
> and the arithmetic is **Architect/Design**.

## 3. `NFR-008` (lane CPU, `ADR-0019`, 60 ms headroom): **NON-CONFORMING**. Ruled on the two accounts separately

**The reading:** paired, n = 8, with an admissible null control (+0.13 s, 0.58%). The load
average was min 2.34, median 4.43, max 13.30.

- **With `ABC-079`:** the lane reads **22.29 s CPU / 5.34 s wall**.
- **Without it, at the same base:** **18.61 s CPU / 4.89 s wall**.
- **Charge:** **+3.625 s CPU**, 8 of 8 rounds positive. Net of the 160 ms per-file floor it is
  **3.465 s**.

**3a. About THE LANE, not about `ABC-079`: `ADR-0019` revisit trigger (a) HAS FIRED.**
- The lane at the delivery base **without** this ticket already reads **18.61 s against 15 s**.
- That reading uses the row's own protocol (fresh process, rotated order, round 0 discarded,
  n = 8, counts asserted, null control admissible) at a named tree: `cb5540d` minus `ABC-079`.
- The 60 ms of headroom ADR-0019 granted was spent before this ticket arrived, by the other seven
  tickets on the integration branch. **Charging that to `ABC-079` would be a category error**, the
  same one the ABC-078 gate refused.
- **Per `ADR-0019`'s rollback:**
  - The CPU clause is **BREACHED at the owner's level**.
  - `N8-LANE` is a rate limit again.
  - The question goes to the owner with the sized remedy `OPT-1` beside it: move `engine.test.ts`
    and `perft.test.ts` behind an opt-in lane (2.55 s, per QE's `A2`/`A4` notes).
  - **No agent moves the 15 s.**
- **`OPT-1` as sized no longer closes the gap.** 2.55 s against a 7.29 s breach (22.29 s) leaves
  about 19.7 s even with `ABC-079` in, and 16.1 s without it. It also predates this wave's changes
  to `engine.test.ts`. **It needs re-sizing by Architect/Design before it is put to the owner as the
  remedy.** This is arithmetic on the recorded 2.55 s, not a measurement of `OPT-1` today.
- The wall clause (5.34 s) is **reported, not ruled**. `ABC-111` owns it.

**3b. About `ABC-079`: `N8-LANE` NOT MET. It is 5.3x, and this gate will not accept it on its own
authority.**
- Every precedent a gate has accepted is far smaller: `ABC-078` at 1.29x and `ABC-025` at 1.6x.
  This one is 5.3x.
- **Most of the charge is not new tests.** It is the existing search tests paying a quiescence leaf
  at every leaf (`search.test.ts` +1.2 s test time, `search.qe.test.ts` +0.33 s). That is the
  feature working, not waste. The ticket's own `A1` does run at a millisecond budget, as its test
  notes require.
- **There is no cheap in-ticket fix that restores conformance.** Moving cases behind `SEARCH_DEEP`
  would trade default-lane coverage of the shipped leaf for CPU, and it would still leave the lane
  at 18.6 s, which is breached. So **no required fix is set on this ticket**.
- A 5.3x overspend on a bar the owner ratified is still his to accept, not a gate's.

> **RISK `AR-N8LANE-079`: NOT ACCEPTED BY THIS GATE. It needs the owner's word.** `ABC-079` charges
> **3.465 s CPU net** (3.625 s gross, 8 of 8) to a default lane already **3.61 s over** `NFR-008`'s
> 15 s without it.
> **Owner: Olger Oeselg.**
> **What he is asked, in one sitting with trigger (a):**
> **(i)** accept this charge as a risk and let `ABC-079` merge;
> **(ii)** take `OPT-1` (or another lane lever Architect/Design sizes) first; or
> **(iii)** hold `ABC-079` until the lane has room.
> **Recommendation to the Orchestrator:** do not merge `ABC-079` on this gate's result alone; put
> (i)–(iii) to the owner first. Architect/Design owns the `NFR-008` floor account and sizes the
> levers.

## 4. Security (ASVS L1, block on high): **CHECKED, not inherited. No finding at any severity that blocks. Nothing at high.**

The ticket says *"Security — not triggered. No input surface."* **Confirmed by reading and
measurement.**

| what this gate went looking for | result | severity |
|---|---|---|
| **Unbounded recursion in `quiesce`** | **None.** `QUIESCENCE_MAX_PLY = 8` is a hard stand-pat before capture generation. In 20 096 positions plus the queens rig the deepest ply seen was exactly 8. The whole stack peaks at about 21 search frames (KPvK, depth 12 at 5 s) against a Node frame budget of about 10 387. | none |
| **Abort / timeout reachability** | **Reachable everywhere after iteration 1.** `countNode` clocks quiescence nodes too, so the abort lands inside a capture sequence and the 5 s ceiling binds (4 999.8 to 5 002.1 ms at unbounded budgets). **Iteration 1 is unabortable by design**, and it now carries depth-1 quiescence: worst reachable **32 980 nodes / 129.5 ms** (p99 10 ms) over 20 096 positions; worst constructed (the queens rig) **87 231 nodes / 277 ms**. Both are bounded by the cap and are 2.6% / 5.5% of the ceiling. | **low**, accepted as `AR-QS-ITER1-079` below |
| **Input path from the CLI into search** | **None new.** The start position is the constant `START_FEN` (`src/cli.ts:166`), the budget is the constant `DEFAULT_BUDGET_MS` (`:175`), and user moves are resolved against `legalMoves`. No flag, command or file supplies a FEN or a budget. | none |
| V1.3.2 [L1] dynamic code | None of `eval`, `new Function`, dynamic `import()` or `require` in the three production files. | pass |
| V2.2.1 [L1] input validation | No new input. Search inputs are in-process values from constants and validated moves. | pass |
| V15.2.1 [L1] components | `package.json` and `package-lock.json` are unchanged over the range. No new dependency. | pass |
| I/O, secrets, logging, persisted state | None: no `process.*`, `fs`, `net`, `child_process` or `console`. The position is byte-identical on return and on throw (`finally` unmake, `A6`). | pass |
| All other L1 chapters (HTTP, files, auth, sessions, tokens, OAuth, crypto) | Not applicable: no such surface exists in the change. | n/a |

The resource-exhaustion requirement a spin would touch is `V2.4.1`, which is **L2**, out of scope
at L1. Nothing is reachable by an adversary here anyway. The process is a local single-user CLI
that deploys nowhere (`ADR-0007`), and the only party who can steer it is the person at the
keyboard.

> **ACCEPTED RISK `AR-QS-ITER1-079` (low).** The unabortable first iteration includes depth-1
> quiescence. It is bounded by the cap at ≤ 33k nodes / ≤ 130 ms on 20 096 reachable positions
> (277 ms on a constructed worst case).
> **Owner: Architect/Design**, who already ruled it an accepted bound in `ABC-079` § Ruling. This
> gate confirms that ruling over a far wider sample.
> **Revisit if** `QUIESCENCE_MAX_PLY` rises, if the MVV-LVA ordering is removed, or if a later
> reading of iteration 1 exceeds 500 ms (10% of the ceiling).

## Result

**PASS_WITH_RISKS** (the subtask's PASS-WITH-ACCEPTED-RISK).

- **Required fixes:** none.
- **Security findings at high or above:** none.
- **Risks:**
  - `AR-NFR004-A`: inherited from ABC-078, still covering, at 4 ms here.
  - `AR-QS-ITER1-079`: low, accepted, owner Architect/Design.
  - `AR-NFR005-079`: `NFR-005` below its floor. The re-level is the owner's question.
  - `AR-N8LANE-079`: **not accepted by this gate. The owner's word is owed before merge**,
    together with `ADR-0019` trigger (a).

**Not done here, by fence:**
- No line under `src/`, `AGENTS.md`, `plans/board.md` or `plans/nfr-catalog.md` was written.
- No NFR bar was moved.
- Nothing was merged or pushed.
- The `In Security/NFR` → `Ready for UAT` move is the Orchestrator's.
- UAT: production lines > 0, so the waiver does not apply.
