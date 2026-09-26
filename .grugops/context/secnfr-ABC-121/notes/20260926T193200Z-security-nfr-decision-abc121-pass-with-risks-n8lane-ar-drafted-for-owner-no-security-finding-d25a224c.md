---
id: 20260926T193200Z-security-nfr-decision-abc121-pass-with-risks-n8lane-ar-drafted-for-owner-no-security-finding-d25a224c
kind: decision
by: security-nfr
at: 2026-09-26T19:32:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - N8-LANE
  - NFR-004
  - NFR-005
  - NFR-008
  - NFR-009
  - AR-NFR004-A
  - AR-N8LANE-078
  - AR-N8LANE-079
  - ADR-0019
  - ADR-0025
  - ADR-0026
  - plans/tickets/ABC-121-principal-variation-search-late-move-reductions.md
  - .grugops/context/secnfr-ABC-121/notes/20260926T193000Z-security-nfr-observation-abc121-n8lane-not-met-910-to-1285ms-net-no-guard-preserving-placement-closes-it-2db5faac.md
  - .grugops/context/secnfr-ABC-121/notes/20260926T193100Z-security-nfr-observation-abc121-nfr004-005-009-held-plain-node-doors-unreachable-76eb826c.md
  - .grugops/context/qe-ABC-121/notes/20260926T010000Z-qe-e2e-decision-verdict-pass-with-findings-N8LANE-to-secnfr-075000b5.md
supersedes:
---

# ABC-121 Security/NFR: **PASS_WITH_RISKS**. No security finding, no required fix. `N8-LANE` is NOT MET and cannot be closed by a guard-preserving placement. `AR-N8LANE-121` is drafted and waits on the owner's word

Hand-authored and unsealed: a `decision`, not a stamp. `human_admission` is `off`, and this
install has no sanctioned writer. The gate reviewed `main...grugops/ABC-121-pvs-lmr` at `ada4093`.
`security.asvs_level` is `L1` and `block_on` is `high`.

## Result

**PASS_WITH_RISKS.**
- Nothing is at or above `high`, so nothing blocks.
- One LOW risk (`N8-LANE`) is **proposed** for acceptance with a named owner. **This gate does not
  accept it.** As with `AR-N8LANE-079`, it **waits on Olger Oeselg's word. Recommend no merge
  before it.**
- The board move is the Orchestrator's.

## Gate at `ada4093`, re-run here

- `npm test`: 48 files / 1 466 tests / 0 skipped, exit 0.
- `npm run lint`: clean (85 files). `npm run typecheck`: exit 0.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No findings."
- `src/` is byte-identical to QE's `312a188`.

## Items

| # | item | reading | severity | disposition |
|---|---|---|---|---|
| 1 | **`N8-LANE`** | **NOT MET.** +910 / +1 035 / +1 285 ms net on three runs by this gate (two with an admissible null), and +1 415 / +1 670 by the build. That is 1.4x–2.6x of 650 ms. Detail in `…2db5faac` | **LOW.** It is a performance budget, not an ASVS requirement, and it has precedent: `AR-N8LANE-078` at 1.29x, and `AR-N8LANE-079` at 5.3x, accepted | **Risk proposed for owner acceptance, `AR-N8LANE-121` below.** It is not a FAIL, and it is not a required fix, because no guard-preserving fix closes it |
| 2 | `NFR-005` | **FLOOR MET**: plain node, kiwipete 7/7/7 and position-6 7/7/7 against the door's 6/6/6. **Depth-7 WARN reached** on M3 (still PROVISIONAL) | — | Met. Follow-up for the catalog owner **after merge**: the `NFR-005` status sentence *"Depth 7 not reached"* goes stale. Not edited here |
| 3 | `NFR-004` | 3 s clause: worst 3 005.3 ms wall over 24 calls. 5 s ceiling: 10 s budget → 5 000.6 ms | — | Inside `AR-NFR004-A` (≤ 31 ms). Nothing new |
| 4 | `NFR-009` | `arrayBuffers` 4.01 MiB flat. `heapUsed` moves ≤ 0.023 MiB across 1 s → 3 s → 3 s on 3 positions. The `ABC-081` `A7` deep row is green | — | Met |
| 5 | Test-only doors | Unreachable from `src/cli.ts`: `createEngine` → `chooseMove` → literal `{ pvs: true, reductions: true }`, `options` is never spread into the budget, and no non-test file names a door | info | None. The residual is `ADR-0024` decision 7's accepted precedent |
| 6 | `lateMoveReduction` make/unmake without `try/finally` | Unreachable throw today | info | Note for any future abort point inside the predicate |
| 7 | ASVS L1 | The diff touches no input, auth, crypto, file, network, secret or dependency surface | — | No finding. Filtered by surface, not ticked one by one |

**Required fixes: none.**

## Recommended, optional, not blocking

Apply arm **F**: drop the reference search and the two reference-equality `expect`s from **both**
`A4` rows, keeping the literal pin and the re-search assertion.
- It is test-only, and it holds 23 of 23 planted variants red in the default lane (measured).
- It saves about 0.2 s CPU. **It does not bring `N8-LANE` under 650.**
- **Do NOT also move the PVS bite** (arm G). It is the only default-lane guard of
  `searchWithoutReductions` silently losing PVS, which I planted and saw survive G. G does not
  close the gap either (+870 net).
- Owner of the choice: the Software Engineer, scheduled by the Orchestrator.

## DRAFT accepted-risk text, for the owner. NOT accepted by this gate

> **ACCEPTED RISK `AR-N8LANE-121`.** `ABC-121` charges **+910 to +1 285 ms CPU net** against
> `N8-LANE`'s 650 ms. That is Security/NFR's three readings at `ada4093`, on Apple M3 (4P+4E),
> Darwin 25.5.0, node v24.12.0, load1 median 14–18. The build read +1 415 ms at `6c1e895` and
> +1 670 ms before placement. So it is **1.4x–2.0x on this gate's readings, and 6–9% of
> `NFR-008`'s 15 s CPU level.**
>
> **Why it is accepted, not trimmed:**
> - The charge is the new file's test bodies (`…e1e4a69f`).
> - Every row left in the default lane is some planted variant's only default-lane guard, or
>   costs ~0 ms.
> - No placement that keeps all 23 planted variants red reaches 650 ms on any reading. The
>   guard-neutral saving (arm F, both `A4` reference searches) reads +785 ms net. The maximal
>   placement (arm G) reads +870 ms net, and it opens a 24th unguarded variant.
>
> **Reported into the merge decision rather than netted out.**
> - **Owner: Olger Oeselg.**
> - **Discharge:** at `NFR-008`'s next lane ruling (`ADR-0019` trigger (a), already fired at
>   `ABC-079`, `AR-N8LANE-079`), where this charge is one input among many; or re-accepted in
>   writing with its number.
> - **It may NOT be discharged by editing `N8-LANE`, or by moving a sole-guard row to a deep
>   lane.**
> - **Scope:** it is denominated in the readings above, on the reference machine. A later reading
>   materially worse, beyond ≈ +1.7 s net (the highest on record), is a new question and is not
>   covered.

## What this gate did NOT verify (`UNKNOWN - verify`)

- Any machine other than the M3 reference.
- A quiet-machine `N8-LANE` reading. The harness itself drives load1 to 14–18.
- The full 23-variant ledger was run by this gate on arms F and G, which carry A's `src/` with
  only the test file changed. It was not run on A itself. A's own ledger rests on the build's two
  ledgers and QE's five re-applied variants.
- The `SEARCH_DEEP` lane was not re-run here. QE re-ran it end to end at `312a188` (`…dc82fb03`).
