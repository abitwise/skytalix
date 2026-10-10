---
id: 20261010T134751Z-architect-design-observation-probe-readings-for-six-rulings-12a6a8a9
kind: observation
by: architect-design
at: 2026-10-10T13:47:51Z
verified_by:
confidence: high
refs:
  - ADR-0011
  - ADR-0029
  - ADR-0030
  - ADR-0034
  - ADR-0035
  - ADR-0036
  - ABC-072
  - ABC-073
  - ABC-083
  - AR-053-COMPOSER
  - .grugops/context/design-owed-rulings-2026-10-10/probe/RUN.txt
  - .grugops/context/design-owed-rulings-2026-10-10/probe/adr0034-scope.sh
supersedes:
---

# Readings behind the six rulings: R4 has not fired, the ADR-0034 scope reading on three merges, and clause (b)'s baseline is 0 / 3 / 0

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
- **Where:** worktree `.claude/worktrees/design-owed-rulings-2026-10-10` at `37ca6ae2`.
- **Commands and output:** all in `probe/RUN.txt`.
- **Not run:** no lane and no timing. The `ADR-0035` figures are arithmetic over readings that
  other hops have already committed. Each one is cited where it is used in `…95c73721`.

## O1. `ADR-0011` `R4` and `AR-053-COMPOSER`: neither trigger has fired

- Production files containing `import(`: **0**.
- The `AR-053-COMPOSER` promotion grep (a re-export of `./frame.ts` or a dynamic import of it in
  production) is **empty**.

## O2. `ADR-0034` decision 2: the scope on three merges (`probe/adr0034-scope.sh`)

| merge | files the globs match (read literally) | files the shipped engine can load |
|---|---|---|
| `3858e3c` `ABC-082` (evaluation) | 6, including 2 `search*.test.ts` and `evaluate.mirror-corpus.ts` | `src/evaluate.ts` |
| `5b5a0a36` `ABC-121` (PVS/LMR) | 6 | `src/engine.ts`, `src/search.ts` |
| `4a79c812` `ABC-079` (quiescence) | 5 | `src/engine.ts`, `src/quiescence.ts`, `src/search.ts` |

- **Two non-`.test.ts` files under the globs are imported only by tests:**
  - `src/search.mate-corpus.ts`, imported by `search.pvs-lmr.test.ts`;
  - `src/evaluate.mirror-corpus.ts`, imported by `evaluate.test.ts` and `evaluate.pawns.test.ts`.
- **The two controls:** both search-changing merges still print search files, so they stay all-B.

## O3. `ABC-041` clause (b): the state baseline at `37ca6ae2`, comment lines stripped

- **Production files:** 35.
- **Limb 1** (`from "node:`): **0** files.
- **Limb 2** (`process.` in code): **3** files, `cli.ts`, `glyph-mode.ts` and `perft-bench.ts`.
- **Limb 3** (call sites, excluding `.exec(` method calls): **0**.
- **Same as BA/PM's reading at `f76e041`.** The comment strip is rough: it removes `//` tails and
  lines that start with `*` or `/*`. `ABC-072` `A3` owes the exact commands.
- **`ABC-065` touched 0 production files.** Source: the Orchestrator's note `…9f2b81d4`, row
  "production files touched". This hop did not re-measure it.

## O4. Code facts read for `QE-057-c` (`src/turn-loop.ts` at `37ca6ae2`)

- **`:52`** is a value import of `gameStatusOf`, `keyHistory`, `playMove` and `takeBack` from
  `./history.ts`.
- **`:154`** is `readonly history: GameHistory` in the options.
- **Injected seams:**
  - `:160` `render: RenderSeam`
  - `:161` `input: InputSeam`
  - `:162` `engine: EngineSeam`
- **Calls on the injected history:** `takeBack` at `:342`, `:389` and `:425`; `playMove` at `:414`
  and `:435`; `gameStatusOf` at `:304` and `:442`; `keyHistory` at `:256`.
- **The licence docblock's `turn-loop.ts` citation** is at `src/history-pane.nfr.test.ts:227-232`.
