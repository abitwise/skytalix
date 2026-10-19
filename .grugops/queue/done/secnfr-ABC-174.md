---
subtask: secnfr-ABC-174
role: security-nfr
ticket: ABC-174
branch: grugops/ABC-174 @ be6a5599 (from bd480c99)
ref: .grugops/context/secnfr-ABC-174/
---

# Security/NFR gate on ABC-174 (lean)

## Read first
Ticket page `plans/tickets/ABC-174-*.md` (§ Security / NFR triggers, § Owed), ADR-0045, `plans/nfr-catalog.md`
(NFR-004, NFR-005, NFR-008, NFR-010, R-173-1/-2), the SE done file `ticket-to-pr-ABC-174.md`, and the QE done file
`qe-ABC-174.md` with its notes under `.grugops/context/qe-ABC-174/` (timing `…5d9a0f63`, verdict `…e7b3c218`).

## Decide
1. **NFR-004** clauses A/B and **NFR-005** referent at `be6a5599` (from the data and QE's A6 readings; ABC-087 A5 max 3007 ms on 30/30).
2. **QE-174-b (MEDIUM): full-lane `npm test` 10.01 s median vs NFR-008's 10 s bar** (R 0.28 s, CPU 27.73 s, load1 3.10–6.01; this ticket's own N8-LANE charge MET at +0.115 s CPU / +0.03 s wall). Rule: attributable to this ticket or not; blocking or accepted risk (name it `R-174-*`); whether this discharges `R-173-1`; whether QE's new spread should replace the pre-cap noise floor. If a ruling needs the owner, say so plainly with the options.
3. **Catalog lines owed at this gate:** edit the `NFR-004` lines in `plans/nfr-catalog.md` that name the old table (`AR-NFR004-A` "level 3 = `DEFAULT_BUDGET_MS`", and the line near `:1364`) → the level-5 default. Edit only those lines; hash every other row before/after and report byte-identical.
4. R-167-1 grep (already empty per SE) — confirm.

## Timing
Take no new timing unless you need it; if so, only in a foreground-verified quiet window (180 s, no foreign vitest, no `oeselg-labs/platform` process, no other hop — a `scribe-ABC-174` hop may run briefly). Else OWED; never estimate.

## Fences
- Catalog edit on **main's** working tree, `plans/nfr-catalog.md` only; leave it uncommitted for the Orchestrator.
- Do not touch: `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`, `../wt-ABC-174`, any process you did not start. Never push, merge or self-sign.

## Publish
Notes under `ref:` (a `kind: decision` by `security-nfr`); sanctioned writer if available, else hand-authored and say so.
`.grugops/queue/done/secnfr-ABC-174.md` (brief + `## Result`) and `.claim.md`, uncommitted: verdict (PASS / PASS_WITH_RISKS / FAIL), required fixes, accepted risks, catalog diff summary, trace row.

## Result (security-nfr, 2026-10-19): **PASS_WITH_RISKS**. No required code fix. The `NFR-008` total is NOT MET as `R-174-1` (MEDIUM, not this ticket's), and the owner's word on it is owed

**Notes** in `.grugops/context/secnfr-ABC-174/notes/` are hand-authored and unsealed, because the sanctioned writer
(`propose_note`) is absent from this session:
- `…a4c7f025` (observation): `NFR-004`/`NFR-005`/`NFR-010` from the data, the security walk, `R-167-1`, and the catalog
  edit with its hashes;
- `…6b1e94d2` (decision): the verdict and rulings 1–4.

**What I did not do.**
- **No timing.** None was needed: every ruling reads from the data and from QE's admissible readings, so no quiet
  window was sought.
- **Few forks.** About 20 short shell calls, none of them a loop. No process was started beyond those.
- **Nothing committed, pushed, merged or self-signed.**
- **No fenced file touched:** `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` and `../wt-ABC-174` were
  not edited. The branch was read through git objects only.

### 1. `NFR-004` / `NFR-005` at `be6a5599`
| item | state |
|---|---|
| `NFR-004` clause A (≤ 3 s at the default) | **Holds under `AR-NFR004-A`, re-accepted with its number** (+12 ms max, ≤ 31 ms bound). `LEVELS[DEFAULT_LEVEL]` = `{ 3 000, 0 }` = `DEFAULT_BUDGET_MS`, the same call as before (`A3` 30/30, 2 seeds). QE's `ABC-087` `A5` at level 5 read max 3 007 ms on 30/30 (+7 ms) |
| `NFR-004` clause B (5 s at any level) | **Holds, with more margin.** The highest reachable budget falls from 4 500 to 3 000 ms, below `HARD_CEILING_MS` 5 000. The clamp and `R1` are unedited. The largest blundering budget is 1 000 ms, so the level-layer re-read rule does not fire |
| first-call excess at the default | `UNKNOWN - verify` (one QE run showed none) |
| `NFR-005` | referent unchanged (`chooseMove` at `DEFAULT_BUDGET_MS`); state not moved |
| `NFR-010` | not affected; every lane passed under the cap (QE) |
| security (ASVS L1) | not triggered. Input paths unchanged (`Object.hasOwn(LEVELS, …)` at `uci-session.ts:336`, closed `--difficulty` word list). No eval, dependency, spawn, file or network. No ASVS failure |

### 2. `QE-174-b` ruled
- **State: NOT MET** (recomputed from QE's raw TSV). The median wall is 10.010 s against 10 s. Twin R is 0.280 s, the
  run is admissible, load1 ≤ 6.01, and CPU is 27.73 s, reported. **This is the first verdict on `NFR-008`'s R-1 clause.**
  The lane sits at the bar: 10 ms over, inside its own R.
- **Not attributable to `ABC-174`.**
  - On `ADR-0035` D2's per-ticket instrument the charge is +0.115 s CPU and +0.030 s wall, and the wall interval
    includes 0. `N8-LANE` is MET.
  - Whether the lane was already over before this ticket is `UNKNOWN - verify`, because no full-lane base arm was
    read.
- **Not blocking.** It is MEDIUM, `block_on` is `high`, and the cause is not in this change.
- **Not mine to accept alone.** `ADR-0035` D6, `ADR-0008` Ruling 5 and `R-173-1`'s table all say a wall over 10 s goes
  to the owner. So it is **`R-174-1`, PROPOSED, owner-designate Olger Oeselg, his word owed before merge.**
- **`R-173-1` is NOT discharged.** The reading was on the wrong arms: `be6a5599`, the combined `ABC-171`+`173`+`174`
  tree, not `9c97dd23`, and the catalog forbids that tree. It also was not the named taker's reading. `R-173-1` stays
  open, LOW, owned by Olger Oeselg.
- **QE's full-lane twin R does NOT replace the pre-cap `F`.** The rule (`…dd7a6ec9`) needs the full-lane twin "with its
  own `npm ci`". QE's `H`/`H2` shared one symlinked `node_modules`. `R-173-1`'s table also says "on MET".
  - QE's R (0.390 / 0.280 s) is listed and not used. `F` stays 1.72 / 3.25 s, pre-cap, and `RISK-ABC144-FCAP` stays
    open.
  - The verdict does not depend on `F`.
  - The row's heap clause ("outright") and `R-173-1`'s table ("on MET") differ. Architect/Design should align them.

### Required fixes
- **None in code.**
- **`SEC-174-1` (LOW, catalog, non-blocking).** `plans/nfr-catalog.md:1405` (`THE LEVEL LAYER`) still defines "at
  default difficulty" as `LEVELS[3]`, and it goes stale at the merge. The fence kept it out of this hop.
  - **Fix:** the same insertion-only dated note.
  - **Owner:** the Orchestrator, to route to the next catalog-holding Security/NFR hop, at or before the merge.
  - That hop should also write `NFR-008`'s first R-1 verdict (NOT MET, 10.010 s) into the catalog.

### Accepted risks (each with its owner)
- **`AR-NFR004-A`**: re-accepted with its number. Owner: Security/NFR.
- **`QE-174-a`** (LOW): no `NFR` rests on the blind band. It is optional. Owner if taken: Software Engineer, test-only.
- **`QE-174-c`, `QE-174-e`** (INFO): no `NFR` bearing. Owner: QE (record).
- **`R-174-1`** (MEDIUM): **proposed, not yet accepted.** Owner-designate Olger Oeselg, his word owed.
- **Open and carried, not discharged here:** `R-173-1` and `R-173-2` (LOW, Olger Oeselg).
- **`SEC-174-2`** (INFO): every scored QE run was on Battery Power, and the declared stack names no power source. Owner:
  Architect/Design, optional. It does not soften the NOT MET.

### Owner question (`R-174-1`): the `npm test` total reads 10.01 s against 10 s on the capped stack, and not because of `ABC-174`
- **(a) Accept, and route a lane remedy (Recommended).** `ABC-174` proceeds. Architect/Design, as the floor-account
  owner, sizes a remedy to get `npm test` under 10 s. Until it lands, every gate that reads the lane sees NOT MET.
- **(b) Hold `ABC-174`'s merge until the lane reads ≤ 10 s.** The ticket waits on a fix it did not cause.
- **(c) Re-level W.** Not recommended: it repeats the 13 → 15 s pattern.
- **(d) Take one paired full-lane base-arm reading first** (`bd480c99` against `be6a5599`, with a twin, about 15 min of
  quiet window). It settles whether the lane was over before `ABC-174`. It changes nothing in (a)–(c).
- This can be asked together with his UAT word, which already waits on `ABC-175` (Q3).

### Catalog diff summary (`plans/nfr-catalog.md`, main's working tree, **uncommitted**)
- **Two lines changed, insertion only.** Each got one dated italic note, true from `ABC-174`'s merge. Removing the note
  restores each old line byte for byte.
  - **`:1342`**: the `AR-NFR004-A` re-acceptance block, "`LEVELS[3]` = `DEFAULT_BUDGET_MS`". The note says the default
    is `LEVELS[5]`, the same `{ 3 000, 0 }`, so the figures stand.
  - **`:1366`**: `ADR-0045`'s ":1364", shifted by 2 lines, "Levels 4 and 5 (4 000 / 4 500 ms)". The note gives
    1 000/0.05 and 3 000/0, level 5 as the default and the hardest, and `A5` at 3 000 ms (max 3 007). It says the
    4 500 ms level is gone, the first-call question stays `UNKNOWN - verify`, and the blundering budgets are ≤ 1 000 ms.
- `git diff --numstat`: `2 2`.
- **Hashes (sha256).**
  - The file: `c42e27ab…7ee9bd9` → `7c2aebc8…c504048c`. It has 2 287 lines before and after.
  - All other lines joined: `efae8355…` before and after, so **byte-identical**.
  - **`NFR-001`–`NFR-010` were each hashed alone, and all 10 are byte-identical.** The joined rows read `bf189d8f…`
    both times.
- **Not edited, by the fence:** `:11`, `:1348` and `:1364` are dated history, still correct as history. `:1405` is
  `SEC-174-1`. No `_Updated:` header line was added.
- The notes are written to be safe to commit before the merge. **I recommend committing them with or after
  `ABC-174`'s merge.**

### `R-167-1`
**Confirmed empty.** I re-ran the grep over `bd480c99...be6a5599`. It printed nothing (rc 1).

### Next column
Recommended **`In Security/NFR` → `Ready for UAT`**. The move is the Orchestrator's, because the fence keeps
`plans/board.md` closed to me. Items still owed:
- UAT waits on `ABC-175`'s verdict (owner Q3).
- `AGENTS.md:59` (Scribe) is owed before merge.
- `R-174-1`: the owner's word is owed before merge.
- `SEC-174-1` is owed at or before the merge.

### Trace row (for the Orchestrator to append; I did not edit `plans/traceability.md`)
`| ABC-174 (Security/NFR) | NFR-004 (A, B), NFR-005, NFR-008, NFR-010, N8-LANE; ADR-0045 D1–D4 | grugops/ABC-174 @ be6a5599 (from bd480c99) | src/levels.ts, src/cli-options.ts, src/uci-session.ts, src/cli.ts | secnfr-ABC-174: NFR-004 A holds under AR-NFR004-A (re-accepted with its number; A5 max 3007 ms at L5=3000/0), B holds (max budget 3000 < 5000); NFR-005 referent unchanged; NFR-010 n/a; security not triggered (ASVS L1, no failure); R-167-1 empty; NFR-008 total NOT MET 10.010 s (R 0.28 s), not attributable (N8-LANE MET +0.115 s CPU); R-173-1 not discharged; full-lane F not replaced (twin lacked own npm ci); catalog :1342/:1366 dated notes, NFR-001..010 byte-identical | PASS_WITH_RISKS: R-174-1 MEDIUM proposed, owner word owed (Olger Oeselg); SEC-174-1 LOW catalog :1405 owed; SEC-174-2 INFO; → Ready for UAT (Orchestrator), UAT after ABC-175 | notes …a4c7f025, …6b1e94d2 |`
