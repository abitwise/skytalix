---
id: 20261010T152348Z-architect-design-decision-f0721-widened-limbs-landed-in-adr0036-canonical-instrument-dd731490
kind: decision
by: architect-design
at: 2026-10-10T15:23:48Z
verified_by:
confidence: high
refs:
  - F-072-1
  - O-072-a
  - ABC-072
  - ABC-041
  - ADR-0036
  - AR-072-LIMBS
  - AR-072-WORDHIT
  - V1.2.5
  - V1.3.2
  - memory-bank/50-decisions/ADR-0036-abc041-clause-b-is-a-delta-test-on-the-production-capability-surface.md
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - .grugops/context/design-F-072-1/probe/architect-delta.patch
  - .grugops/context/secnfr-ABC-072/probe/limb-ruling.patch
  - .grugops/queue/pending/design-F-072-1.md
  - 20261010T150119Z-security-nfr-decision-abc072-pass-with-risks-limb-list-widened-readings-upheld-f-072-1-29849eeb
  - 20261010T150119Z-security-nfr-observation-abc072-fixtures-plants-limb-demo-gates-6dd88c01
  - 20261010T144155Z-architect-design-observation-clause-b-instrument-readings-fixtures-mutants-self-run-23cfa14f
  - 20261010T152348Z-architect-design-observation-f0721-readings-fixtures-plants-qe136-qe104d-gates-f8dee48b
supersedes:
---

# `F-072-1` landed. `ADR-0036` gains a dated "Widened limbs" block, and the canonical clause (b) instrument moves to `design-F-072-1/probe/clause-b.mjs`. Nothing moves on this tree: 0 / 3 / 0, 21 of 21 fixture rows and the nine are unchanged, and S1–S12 fire

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
- **Branch:** `grugops/design-F-072-1`, from wave tip `7f7e6b84`.
- **Changes:** docs and probe only, 0 `src/` lines.
- **Readings:** `…f8dee48b`.
- **Not in scope:** `ADR-0036`'s DELTA ruling and the owner's open veto. Neither is touched.

## 1. `ADR-0036`: what was written

1. **A new block, `### Widened limbs — 2026-10-10 (F-072-1)`,** at the end of § Canonical clause
   (b). It holds Security/NFR's Ruling 1 as a substitution table: what the quoted clause says, and
   what it reads now.
   - **Production files:** every JS/TS source under `src/`, excluding tests and declaration files.
   - **Limb 1:** any non-local import.
   - **Limb 2:** any reference to the global `process`.
   - **Limb 3:** adds `Function(…)` and `new WebSocket`.
   - **(b1)'s unit:** the whole call span.
   - **Unresolved items:** FIRES (disputed), scoped to the diff.
   - **`Worker`:** no separate entry.
   - **Word hits:** unchanged.

   The block also holds the canonical commands, the readings, and what is left with whom.
2. **The `A2` quote itself is NOT re-copied.**
   - A pointer under it says to read the quote with the substitutions.
   - The phrase "Production capability — a DELTA test" still occurs **1** time in the tree (`A2`).
   - "hop that ends it" occurs **0** times in the section (`A4`).
3. **Pointers:**
   - a Status bullet, which also says the narrower words in the Status and § Decision 2 yield to
     the block;
   - a line under `### The instrument`: the commands there run `ABC-072`'s record; route with the
     canonical path instead;
   - § Alternatives **row 3 → the existing correction (`O-072-a`, closed)**;
   - row 5 → "ruled WIDEN".

## 2. The instrument: which copy is canonical

**Canonical from 2026-10-10:** `.grugops/context/design-F-072-1/probe/clause-b.mjs`.
`.grugops/context/design-ABC-072/probe/clause-b.mjs` is kept **unchanged** as `ABC-072`'s record.
- **Why a new copy and not an edit in place.** Every reading in `ABC-072`'s and Security/NFR's notes
  was taken with the old file. Leaving it as it was keeps those readings reproducible from the tree,
  not only from history. Records are append-only here, the same as notes.
- **What it is built from:** the old file, plus Security/NFR's `limb-ruling.patch` (taken as given;
  it applies clean), plus `architect-delta.patch`.

**`architect-delta.patch`: four points beyond the ruling's words, each inside its intent.** Each
over-fires only, the safe direction, and each has a plant:
1. **`require(<literal>)` is an import (F1–F3).** The ruling made `.cjs`/`.cts` production, and
   `require()` is how those files import. In ESM, `createRequire` makes it a real import too.
   - A non-local specifier counts for limb 1.
   - A local one is an edge.
   - A non-literal one is unresolved, so it FIRES (disputed).
   - **Without this, the ruling's own file widening would add a silent import form.** F1, F2 and
     F3 are silent under the demonstration.
2. **`child_process` bindings made by `require()` or `await import()` (F5, F6).**
   - **The case.** The delivered instrument tracked ESM import bindings only. So
     `const cp = require("child_process"); cp.execSync(…)` and
     `const { execSync: run } = await import("node:child_process"); run(…)` were a word hit at best,
     or silent.
   - **The fix.** These bindings are collected in a pre-pass, so a call above its binding is still
     seen.
3. **`new globalThis.WebSocket(…)` / `new globalThis.Function(…)` (F4).** This is the same global,
   as with the ruling's `globalThis.process`.
4. **`.d.mts`/`.d.cts` are declaration files (F8),** as `.d.ts` already was in the demonstration.

**Cosmetic.**
- The header comment states the widened limbs.
- The verdict line reads the `fires` variable; the patch had left it computed but unused.
- No output format changed, so every harness (`mutants.sh`, `sec-mutants.sh`) runs unmodified.

## 3. The proof, against the queue task's three conditions (`…f8dee48b`)

- **Baseline 0 / 3 / 0 unchanged on the current tip (`7f7e6b84`, 36 files),** with the same three
  holders. It is also 0 / 3 / 0 at `f76e041`.
- **21 fixture rows unchanged.** Against the old instrument, 24 of 24 rows (the 7 recorded pairs ×
  3 limbs, plus the tip) give the same b1, edge count, b2, holders and verdict. Only limb 2's raw
  word count moves (9 → 11), by design.
- **The Architect's nine:** byte-identical to `design-ABC-072/probe/mutants.out.txt`.
- **Security/NFR's S1–S12 fire, and S13 is listed.** At `5f48753f` the run is byte-identical to
  Security/NFR's demonstration.
- **"Disputed" never reads "does not fire".** There are 0 such rows across every output file of
  this hop. S11, F3 and F7b read "FIRES (disputed: unresolved, the fail-safe)".
- **The dispute is diff-scoped.** F7a: a non-literal `import()` in a file the diff does not touch
  does not make an unrelated diff fire.
- **Computed eval forms stay listed word hits:** S13 `(0, eval)("1")`, limb 3 words=1.

## 4. What this leaves, with owners

- **`AR-072-LIMBS`** (owner Orchestrator; MEDIUM until `F-072-1` lands). Its condition is met when
  this branch merges. **The Orchestrator records the close** (this note does not close another
  role's risk).
- **`AR-072-WORDHIT`** (LOW, Security/NFR). Unchanged.
- **§ Decision 3's residual** (LOW, Architect/Design). Unchanged: the holders are still the same 3
  files, so its trigger does not move.
- **NFR:** `plans/nfr-catalog.md` is not opened, because no row carries clause (b). `N8-LANE` is
  0: no test file and no lane. The instrument is a hop tool at ≈ 1.0 s per limb.
- **No ticket page is edited.** `ABC-072` is `Done`, and its pages cite § Canonical clause (b) by
  name, which now includes the block.
