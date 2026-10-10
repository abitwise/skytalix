---
id: 20261010T165600Z-architect-design-observation-qe010d-readings-guard-suite-lint-tsc-per-shape-03a2029d
kind: observation
by: architect-design
at: 2026-10-10T16:56:00Z
verified_by:
confidence: high
refs:
  - QE-010-d
  - ABC-010
  - ADR-0033
  - ADR-0011
  - R3
  - ADR-0036
  - src/fen.test.ts
  - src/cli.test.ts
  - src/history.ts
  - .grugops/context/qe-ABC-010/notes/20261010T164425Z-qe-e2e-observation-abc010-gap-register-2c22980f.md
  - .grugops/context/design-qe010d-2026-10-10/probe/RUN.txt
  - .grugops/context/design-qe010d-2026-10-10/probe/plants.out.txt
  - 20261010T165600Z-architect-design-decision-qe010d-three-accepted-residuals-one-alignment-fix-bbe6bd95
supersedes:
---

# `QE-010-d` readings: what each shape does to the guard, the whole suite, lint and `tsc`

Hand-authored and unsealed: no sanctioned writer was reachable in this session (this repository has no
`scripts/context-io.js`, and the `propose_note` tool was not offered). The kind is soft, and no `finding` is
claimed.

**Subject.** The 9(e) guard is at `src/fen.test.ts:369–383` on `grugops/ABC-010-fen-semantic-validation` at
`f9d1ff4b` (not merged). It is a flat `readdirSync` of `src/`. It keeps names that end in `.ts`, but not
`.test.ts` and not `fen.ts`, and it asserts that no kept file's text contains `parseFenGrammarOnly`. That is
exactly `ADR-0033` decision 2's wording.

**Harness.** The Architect's own, `../probe/plant.sh`. Each plant is a fresh out-of-tree `git archive` of
`f9d1ff4b`, read four ways: the guard alone, the whole suite, `biome check .` and `tsc --noEmit`. Table in
`../probe/RUN.txt`, raw output in `../probe/plants.out.txt`.

## Readings

- **Control:** green, 52 files / 1663 tests. Lint 0, `tsc` 0.
- **Positive** (a re-export appended to `src/history.ts`): the guard goes RED, and it is the only red. This
  matches QE's 9(e) reading.
- **Shape 1, nested `.ts`** (`src/qeplant/x.ts`, standalone and re-exported from `history.ts`):
  - **the guard stays green**, as QE said;
  - **the whole suite goes RED**, 1 test: `src/cli.test.ts` "A3 — the entry point is flat in `src/`". Its
    `nested` equality (`:1511–1514`, the same at the wave tip `4afff35e`) is `ADR-0011` `R3`'s tripwire.
  - So QE's "each stayed green" is true of the guard, **not of the gate**. A nested production `.ts` cannot
    merge green today.
- **Shape 2, a non-`.ts` JS/TS source:**
  - `.mts` is **silent on all four** in three placements: flat, nested, and flat and re-exported live from
    `history.ts`. That is because `tsconfig.json` and `biome.json` include only `**/*.ts`, and
    `cli.test.ts`'s `nested` filter ends in `.ts`.
  - `.js` re-exported live from `history.ts`: the guard, the suite and lint stay green, but **`tsc` goes RED
    with TS7016**. That catches it only because strict mode refuses an untyped `.js` import.
  - Not measured: `.cts`, `.mjs`, `.cjs`, and a `.js` with a sibling `.d.ts`. `UNKNOWN - verify` if a later
    hop leans on them. Under the ruling's fix they are all in the set anyway.
- **Shape 3, the name not spelled.** Three forms were planted in `history.ts` through `import * as qeFen`:
  - the concatenation behind a `Record` cast;
  - `` `parseFen${"GrammarOnly"}` as const `` (**no cast, fully typed**);
  - the escape `parseFenGrammarOnly`.

  All three are **silent on all four**: lint 0, `tsc` 0.
- **All five silent production plants are live.** Importing `src/history.ts` gives
  `__qePlant === parseFenGrammarOnly` 5/5 (`../probe/liveness.out.txt`).

## Shape counts today (`git ls-tree`, both tips)

- `.mts`/`.cts`/`.js`/`.mjs`/`.cjs`/`.tsx` under `src/`: **0** at `f9d1ff4b` and at `4afff35e`.
- `.ts` under a subdirectory of `src/`: **0** at both.
- Production importers of `fen.ts`: **6**, all a named `import { parseFen } from "./fen.ts"`
  (`../probe/fen-importers.out.txt`).
- Namespace bindings of `fen.ts` (`import * as`, `import()`, `export * from`): **0**. Shape 3 needs one, so
  it would show in a diff first.
