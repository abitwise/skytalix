---
id: 20261010T150119Z-security-nfr-decision-abc072-pass-with-risks-limb-list-widened-readings-upheld-f-072-1-29849eeb
kind: decision
by: security-nfr
at: 2026-10-10T15:01:19Z
verified_by:
confidence: high
refs:
  - ABC-072
  - ABC-073
  - ABC-055
  - ABC-041
  - ADR-0036
  - F-072-1
  - AR-072-LIMBS
  - AR-072-WORDHIT
  - O-072-a
  - V1.2.5
  - V1.3.2
  - N8-LANE
  - NFR-002
  - memory-bank/50-decisions/ADR-0036-abc041-clause-b-is-a-delta-test-on-the-production-capability-surface.md
  - plans/tickets/ABC-072-abc041-clause-b-is-a-state-predicate-with-a-one-limb-instrument.md
  - .grugops/queue/pending/secnfr-ABC-072.md
  - .grugops/context/secnfr-ABC-072/probe/limb-ruling.patch
  - 20261010T150119Z-security-nfr-observation-abc072-fixtures-plants-limb-demo-gates-6dd88c01
  - 20261010T144155Z-architect-design-decision-abc072-a2-a5-delivered-abc073-folded-66a8bfa8
  - 20261010T144155Z-architect-design-observation-clause-b-instrument-readings-fixtures-mutants-self-run-23cfa14f
supersedes:
---

# `ABC-072` (+`ABC-073`) Security/NFR: **PASS_WITH_RISKS**. `A1`–`A6` hold on both pages. The limb list is NOT confirmed as written: it is widened (`F-072-1`, MEDIUM, Architect/Design), and the instrument as delivered stays honest about what it sees. Both of the Architect's readings are upheld

This note is hand-authored and unsealed. It is a `decision`, not a stamp, because `human_admission`
is `off` and this install has no sanctioned writer.
- **Reviewed:** `6bfc7b29..5f48753f` on `grugops/ABC-072-clause-b-delta`, delivered commit
  `088e48db`.
- **Settings:** ASVS L1, `block_on` high, `compliance_regime` `[]`.
- **This hop replaces a separate QE hop** for a docs-only ticket (queue task).
- **Readings:** `…6dd88c01`.
- **Not ruled here:** DELTA vs STATE. The owner's veto stays open. **Every ruling below holds under
  either reading.** The limbs are the same set whether they feed a STATE baseline or a DELTA test,
  and the widened list leaves the baseline at 0 / 3 / 0.

## Result

**PASS_WITH_RISKS. Nothing is at or above `high`, so nothing blocks.**
- No fix is required on this branch.
- One MEDIUM follow-up (`F-072-1`) and two accepted risks, each with an owner.
- **The merge is a strict improvement over `main`.** `main` has no canonical clause and a one-limb
  grep. This branch has an AST instrument that reproduces every recorded answer and lists what it
  does not count.
- If the Orchestrator chooses to hold the merge until `F-072-1` lands, that is consistent with this
  verdict. It is not required by it.
- The board move is the Orchestrator's.
- **The UAT waiver applies by measurement:** the delivered commit has 0 production lines.

## Per criterion (independent; readings in `…6dd88c01` O1, O5, O6)

**`ABC-072`:** `A1`–`A6` all MET.
- **`A1` MET.** `ADR-0036` (`afa60861`, Architect/Design) states DELTA, gives its reason and names
  the narrower trigger it accepts (§3).
- **`A2` MET.** The clause text occurs once in the tree, and the ADR says "Cite this block".
- **`A3` MET.**
  - Three commands, each naming its unit, run by this hop on all three fixtures with the known
    answers.
  - The baseline is 0 / 3 / 0 at 36 files and at 35.
  - The Architect's nine mutants were re-run.
- **`A4` MET.** The phrase occurs 0 times in the block. Only § Context quotes it, as the defect.
- **`A5` MET.** `460b9f58` reads 0 files and 0 / 0 / 0, and the skip note exists at the cited path.
- **`A6` MET.**
  - 3 paths, 0 under `src/`.
  - Four fenced blobs are equal at `088e48db~1`, at `088e48db`, at the tip and on `main`.
  - Gates are green.

**`ABC-073` (folded):** `A1`, `A2`, `A3`, `A5`, `A6` MET; `A4` VOID.
- **`A1` MET.** The non-`Done` pages that return either grep are `072` (ruled) and `073` (itself);
  "unruled" finds 0 non-`Done` pages.
- **`A2` MET.** `ABC-055` carries the fail-safe 1×, normalized.
- **`A3` MET.** The answer gives `ABC-055`'s own facts.
- **`A4` VOID.** `ABC-053` is `done`.
- **`A5` MET.** One hunk, inside the section; Acceptance is byte-identical.
- **`A6` MET**, read inside 072's `A6`.

## Ruling 1. The limb list (`ADR-0036` § Alternatives 5 / § Known limits): NOT confirmed as written. WIDEN it

**The reason.** The clause's job is to route capability changes to this gate. As written, 8 of 13
plausible forms pass **silently**: no count, no word hit, nothing unresolved (O2). An unseen form
cannot be disputed, so the fail-safe cannot reach it. On this tree the widening costs **nothing**:
- the baseline is still 0 / 3 / 0, with the same holders;
- all 21 fixture rows are unchanged;
- the Architect's nine are byte-identical (O3).

| question | ruling | evidence |
|---|---|---|
| bare `process` | **COUNT.** Limb 2 becomes "any value reference to the global `process`", including destructuring, element access, aliasing and `globalThis.process` | S2, S3 silent; S4 word hit only |
| non-`node:` builtins | **COUNT, and go one step wider.** Limb 1 becomes "any import whose specifier is not a local module": a builtin with or without `node:`, or any package. It covers static, `export … from` and literal `import()` | S1, S9 silent. Biome reports S1 as info, exit 0, so lint does not close it. 0 runtime dependencies, so any package import from production is new reach |
| `Worker` | **No separate entry.** Node has no global `Worker` (`undefined` at v26.11.0). It is reachable only through `worker_threads`, which limb 1 counts | S12 FIRES as delivered |
| also, limb 3 | **ADD `Function(…)` without `new`** (the same as `new Function`, `V1.3.2`) and **the global `WebSocket`** (network with no import, the same class as `fetch`). **COUNT THE WHOLE CALL SPAN**, not the callee line: editing the arguments of an existing `spawn`/`exec`/`fetch` changes what it does (`V1.2.5`) | S5, S6, S10 silent |
| also, production files | **Every JS/TS source under `src/`** (`.ts .mts .cts .js .mjs .cjs`), not tests. An `.mjs` escapes Biome, `tsc` and this clause today | S7 silent, S8 unresolved |
| also, the verdict line | **Unresolved means FIRES (disputed)**, and is scoped to the diff. Today the tool prints "does not fire" beside a listed dispute, which contradicts the clause's own fail-safe | S8, S11 |
| left as word hits | `(0, eval)(…)`, `globalThis["eval"]` and `Reflect.apply(eval, …)`: computed forms, listed and not counted (`AR-072-WORDHIT`) | S13 listed |

## Ruling 2. The Architect's two readings: BOTH UPHELD

- **(b2) counts imports that reach a holder transitively ("holds, or reaches at runtime"). UPHELD.**
  - **It is the clause's own subject phrase** (*"this module or any module in its runtime
    closure"*) and the ADR's "newly reachable". **It only widens:** a holder is in its own closure.
  - **No answer moves** (O1, O4). The only runtime edge into a holder is `cli.ts:71 ->
    glyph-mode.ts`, and `cli.ts` is itself a holder.
  - **M7 is the case it exists for:** without it, a bridge module defeats (b2) one commit later.
  - **Runtime edges are counted the way Node behaves** (checked at v26.11.0): an inline
    `{ type X }` import is an edge, and `import type` is not.
  - **One caveat:** the closure walks production files only. Under `F-072-1`'s wider file set, a
    `.mjs` bridge joins it.
- **§ Alternatives 3's example, `cli-options.ts` → `glyph-mode.ts`: UPHELD.**
  - `cli-options.ts` has only `import type` edges (`:38`, `:39`). Its "spawn" is in a docblock
    (`:7`–`:8`). It reaches no holder.
  - `glyph-mode.ts` is a limb-2 holder. The row's verdict is unchanged.
  - The table row itself still prints `cli-options.ts`; the correction lives in the dated block
    (`O-072-a`).

## Severity, stated

`V1.2.5 [L1]` and `V1.3.2 [L1]` are **MET** at `5f48753f`. Production holds 0 spawn, exec, eval
and `Function` sites, under both the delivered count and the widened count.
- **Why the default does not apply.** The gaps are in the **reach of a routing trigger**, not a
  failed control, so the ASVS-derived default (L1 fail → high) does not apply.
- **Why MEDIUM.** A silent miss removes this gate for exactly the diffs those L1 rows care about.
- **Why not HIGH.**
  - No instance exists in the tree.
  - QE reviews every ticket (standing since 2026-08-17).
  - Clauses (a) and (d) bound part of the gap.
- **Severity call owner:** Security/NFR.

## Follow-ups and accepted risks, each with an owner

- **`F-072-1` (MEDIUM, P2), owner Architect/Design.** Amend `ADR-0036` § Canonical clause (b) with
  Ruling 1, as a dated block, and amend `clause-b.mjs` to match.
  - `secnfr-ABC-072/probe/limb-ruling.patch` is a **verified demonstration**, not the instrument.
    The Architect may take it or write their own.
  - **Acceptance:** S1–S12 fire and S13 is listed. The baseline is 0 / 3 / 0, the fixtures are
    unchanged and M1–M9 are byte-identical.
  - BA/PM cuts it, or the Architect takes it as a design hop.
  - **The ruling is the same under STATE**, so the owner's veto does not void it.
- **`AR-072-LIMBS` (MEDIUM until `F-072-1` lands), accepted, owner the Orchestrator** (the routing
  owner).
  - **Interim control.** This ruling is on the record as a **dispute** for every form in Ruling 1.
    A hop that sees one of them in a production diff fires (b) under the fail-safe. On a diff that
    touches production files, the Orchestrator may also run the patched copy; any disagreement is a
    dispute.
  - **Promotion → HIGH** if a production diff carrying one of the S1–S10 forms is routed past
    `In Security/NFR` before `F-072-1` lands.
- **`AR-072-WORDHIT` (LOW), accepted, owner Security/NFR.**
  - **The risk.** Computed and indirect forms (S13 class) stay listed word hits.
  - **Promotion trigger:** a limb-2 or limb-3 word hit on a **code** line (not a comment or string)
    of a production diff. That hop treats it as a dispute, and the form joins the count.
- **`ADR-0036` §3 residual (new call over an existing edge, LOW, Architect/Design's).**
  **Concurred**, and unchanged: the widened list leaves the holders at the same 3 files, so §3's
  trigger does not move.
  - S10 is a different case: an argument edit **inside** an existing capability call. It falls
    under (b1)'s "edited in place counts", and `F-072-1` closes it.
- **`O-072-a` (INFO, no action required), owner Architect/Design.** § Alternatives row 3 still names
  `cli-options.ts`. A pointer to the dated block can ride with `F-072-1`.

## NFR

- **`N8-LANE`:** zero. There are 0 test files, 0 `src/` paths and 0 spawns in the suite.
- **`NFR-002`:** not triggered.
- **`plans/nfr-catalog.md`:** not opened. No row carries clause (b).
- **The probe is a hop tool, not a lane.** It takes ≈ 0.5–1.0 s per limb at load1 7–13.
- **Gates (O6):** lint 0. `npm test` is 52 files / 1608, 12.22 s at load1 21.55–26.40. Skip is 0,
  and integrity reads `No findings.`
