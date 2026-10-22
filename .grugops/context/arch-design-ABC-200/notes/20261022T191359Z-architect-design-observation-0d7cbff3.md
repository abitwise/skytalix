---
id: 20261022T191359Z-architect-design-observation-0d7cbff3
kind: observation
by: architect-design
at: 2026-10-22T19:13:59Z
verified_by: 
confidence: high (pins read from src/cli.test.ts, src/line-input.test.ts, src/cli.real-engine.test.ts at main 9c54df47; prototype and link probe run under plain node v26.11.1 in scratch; no vitest, no timing)
refs:
  - ABC-200
  - ABC-037
  - ABC-042
  - ABC-043
  - ABC-101
  - ABC-115
  - EPIC-006
  - G6
  - ADR-0009
  - ADR-0011
  - ADR-0015
  - ADR-0016
  - ADR-0029
  - ADR-0036
  - ADR-0037
  - ADR-0042
  - ADR-0044
  - ADR-0045
  - NFR-007
  - NFR-008
  - 20261022T185856Z-ba-pm-decision-2fddb7fa
  - 20261022T191000Z-orchestrator-decision-de0099fa
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
  - plans/tickets/ABC-200-on-a-terminal-npm-run-chess-asks-for-colour-and-difficulty-when-the-flags-are-absent.md
  - 9c54df47
supersedes: 
seal: sha256:25cdf529d38372f434dd9ccb438f20a6d9ac6de63f5e8bd3a782bb85ac21c6be
---

# ABC-200 design inputs, read at `main` `9c54df47`: the pins that bind the wiring, a scratch prototype, and a link-time reading

No vitest and no timing ran. The prototype and the link probe ran under plain `node` v26.11.1, in `scratchpad/arch200/`.

## 1. `src/cli.test.ts` pins that bind any ABC-200 wiring

`A6` says this file stays unedited. These pins are the binding ones:

**`cli.ts` source:**
- `process` occurs exactly 10 times, and the sorted `process.\w+` list is fixed: argv 1, exitCode 3, stderr 3, stdin 2, stdout 1.
- `const sink = process.stdout;` appears, and `process.stdout` appears exactly once.
- `resolveOptions\(process\.argv\.slice\(2\)\)` appears, and `resolveOptions(` appears exactly once.
- `input:\s*createLineInputSeam\(\{\s*source:\s*process\.stdin,` appears, `createLineInputSeam(` appears exactly once, and it is never bound to a name.
- `const \{…difficulty…\} = resolution\.options;` appears, and `\bdifficulty\b` occurs exactly twice in code.
- `numbersIn("cli.ts")` equals `0, 0x20, 0x7f, 1, 2, 32, 70`.
- `sink.write(` appears exactly once.
- The `history` and `book` binders appear once each.
- The `runTurnLoop(` window holds no `=>` and no `as`.
- There is no `beginFrameSession` and no `./frame.ts`.

**Production modules:** the `cli*` list is exactly `cli-options.ts` and `cli.ts`.

**`cli-options.ts`:**
- `.options` is compared whole with `toEqual`. The ok-branch `Resolution` is never compared whole (`engine.test.ts` uses `toMatchObject`).
- `numbersIn` equals `0, 0.5, 1, 2, 3, 4, 5`.
- Every space-free string literal must be in `ACCEPTED_ARGUMENTS` or `NOT_ARGV`.
- `A7`'s `/depth|ply|…|budget/gi` must have no hits in code.
- No `process`, `globalThis` or `import.meta`.

**`inputSeamThrows`** substitutes `./line-input.ts` with a double whose only export is `createLineInputSeam`.

`src/cli.real-engine.test.ts` copies the whole `src/` directory, so a new module is copied too. Its child runs on a pipe.

`src/line-input.test.ts` pins `line-input.ts`'s import set at 4 specifiers, and its code scan has no `try`/`catch` and no `node:`.

## 2. Prototype (`proto/`): the extracted reader memoized per source, the questions, and a reduced seam

| row | input | reading |
|---|---|---|
| A7 | `black\n1\ne5\n` in one write, TTY | options black/1; first seam read `e5`; second `eof` |
| A7 control | the same chunk, read by a private reader, then a second private reader | the second reader's seam read **`eof`**: `e5` is lost |
| A2/A4 | `purple\x1b[2J`, empty, `6`, `0`, `03`, a 1 025-unit line, empty | white/5; 5 rejection lines; no ESC byte in the output |
| A5 | end of input at colour | `null` |
| A6 | non-TTY, `e4\n` | options unchanged; 0 bytes written; the seam read `e4` |

## 3. Link probe (`link/`)

An entry imports a module that imports `lineReaderOf` from a double exporting only `createLineInputSeam`:
- `SyntaxError: The requested module './line-input.mjs' does not provide an export named 'lineReaderOf'`, rc 1.
- With `lineReaderOf` imported from its own module, the same entry loads, rc 0.

## 4. Other readings

- The `uci.ts` closure imports neither `cli-options.ts` nor `line-input.ts`, so the new modules never reach `dist/`.
- `frame.ts`'s in-place session writes `CURSOR_HOME`, then erases each line and the rest of the screen.
