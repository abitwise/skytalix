---
id: 20261031T061548Z-architect-design-decision-068f36ba
kind: decision
by: architect-design
at: 2026-10-31T06:15:48Z
verified_by: 
confidence: high: a records ruling read from QE, SE and Security/NFR sealed notes and the spawn block at main 9c008db4; no run
refs:
  - arch-ABC-221-records
  - ABC-221
  - ABC-242
  - ABC-228
  - ABC-245
  - EPIC-009
  - ADR-0052
  - ADR-0054
  - ADR-0045
  - ADR-0053
  - NFR-004
  - NFR-009
  - SE-221-a
  - SE-221-b
  - SEC-221-b
  - QE-221-b
  - SE-242-a
  - se-ABC-221/20261031T053932Z-software-engineer-observation-7896971d
  - qe-ABC-221/20261031T060935Z-qe-e2e-observation-8ad25906
  - qe-ABC-221/20261031T060935Z-qe-e2e-observation-f9b43b6d
  - secnfr-ABC-221/20261031T055207Z-security-nfr-decision-ef060512
  - secnfr-ABC-221/20261031T055207Z-security-nfr-observation-8881d726
  - qe-ABC-242/20261031T051332Z-qe-e2e-observation-b9f3cd67
  - af32f82c
  - 9395d8dc
  - c48a6f83
  - e42b637b
  - af5b2b49
  - 9c008db4
  - db8fea11
  - src/uci-session.test.ts
  - src/levels.ts
supersedes: 
seal: sha256:5879c722d81cb8889ff201750992a55fff08ddd04bf92137c7ceec320a67d130
---

# `SE-221-b` / `SEC-221-b` ruled: `ABC-221` `A10`'s `ENGINE_DEEP` `spawnSync` stays in `src/uci-session.test.ts`. `ADR-0052` D8 gains a dated line and a three-condition rule for spawns in that file. Not PROPOSED; nothing goes to the owner

The ruling is in `ADR-0052` D8, in a dated line under the 2026-10-30 `arch-ABC-220-a14` amendment, commit `db8fea11`. It
cites the inputs' `## Scope` and `## Risks`: the SE's findings `se-ABC-221` `…7896971d` (SE-221-b), QE's findings
`qe-ABC-221` `…8ad25906` (QE agrees with the reading), and Security/NFR's decision `secnfr-ABC-221` `…ef060512` and
observation `…8881d726` (SEC-221-b). Records only: nothing was run or timed. The spawn block was read at `main`
`9c008db4` (`src/uci-session.test.ts`, the `ABC-221` `A10` describe).

## Decision
- **Keep the row.** `A10`'s child is `node --expose-gc --input-type=module -e <script>`. It is the `ABC-081` `A7` /
  `NFR-009` instrument, which `src/transposition.test.ts` already runs in `ENGINE_DEEP`.
- **"Has no spawn site" was true only until `ABC-221`'s merge** (`af32f82c`, code `c48a6f83`). The dated line says so,
  and the 2026-10-30 text is kept as written.
- **The rule from here.** A spawn in `src/uci-session.test.ts` is admitted only if all three hold:
  1. it is not the delivered entry point (`src/uci.ts`, `dist/uci.js`);
  2. it is defined only under an opt-in deep lane, so the default lane spawns 0;
  3. it is synchronous, with an argument array and no shell (`ABC-173` `C2`).
  A spawn of the delivered entry point still belongs in `src/uci.real-engine.test.ts` (`runDialogue`).

## Why
- **D8 guards three things, and all three hold.** There is no new file and no delivery file. The delivered entry point
  is still spawned from one place only. The child's script imports `uci-session.ts`, `book.ts`, `levels.ts` and
  `engine.ts`, never `src/uci.ts`. The default lane spawns 0 (QE: lane inventory 63 = 63; 2 363 green with no child).
- **A row is better than a hand reading.** The row re-reads `NFR-009` at 59.5 s on every `ENGINE_DEEP` run. The
  `ABC-212` form, a QE hand reading in plain node, is read once. Security/NFR found no security or NFR risk and
  prefers the row. Moving it is test-only and would add none of the guards D8 exists for.
- **The three conditions** are the ones this child already meets. They stop the next child from widening the
  exception without anyone noticing.

## Not PROPOSED
- D8's 2026-10-30 text was an Architect amendment that moved no requirement. This line moves none either, and the
  bounds, the files and the constants are unchanged. The owner accepted `ADR-0052` on 2026-10-30, and that acceptance
  is not touched.

## Alternatives rejected
- **Move `A10`'s memory read to a QE hand reading in plain node** (the SE's second option). It costs a test-only
  change and loses repeatability, and it buys nothing D8 guards.
- **Only fix the words, with no rule.** That leaves the next spawn in this file to be argued from scratch.
