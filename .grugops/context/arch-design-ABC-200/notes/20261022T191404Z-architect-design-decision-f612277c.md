---
id: 20261022T191404Z-architect-design-decision-f612277c
kind: decision
by: architect-design
at: 2026-10-22T19:14:04Z
verified_by: 
confidence: high (every pin it must keep is enumerated in the companion observation; the reader sharing and the link failure were measured in scratch, not inferred)
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
  - 20261022T191359Z-architect-design-observation-0d7cbff3
supersedes: 
seal: sha256:c2a4142220a2440450618c472e0698c8da7eedd14b37af0bf599f526c162f694
---

# ABC-200 design ruling: one line reader per stream; the questions run before the loop, on the same reader, inside the existing pins. No ADR is new, changed or reversed, so no STOP

Records only. No test or timing run. One scratch prototype ran under plain `node`, with no vitest; its readings are in the companion observation note.

## The ruling

**R1. One line reader per stream: the reader moves out of `src/line-input.ts` into a new `src/line-reader.ts`.**
- Move `ABC-037`'s line state machine into the new module unchanged: the decoder, `pending`, `overlong`, the overshoot queue, `ended`, the single `waiting` slot, the `end` listener attached once, and pause between reads.
- Export `lineReaderOf(source: LineSource): LineReader`, where `LineReader` is `{ read(): Promise<SubmittedLine | null> }`. A module-level `WeakMap` keyed by the source memoizes it, so the same source always gets the same reader.
- `MAX_LINE_LENGTH` and `LineSource` move too. `line-input.ts` re-exports both, so no importer changes.
- `createLineInputSeam` keeps its signature, its per-seam command resolver (the `quit` flag stays per seam) and its prompt. It reads through `lineReaderOf(source)`.
- Every existing caller builds one seam per source, so its behaviour is unchanged.
- **Why one reader:** on `A7`'s single chunk `black\n1\ne5\n`, a second private reader keeps `e5` in its own queue, and the game's first prompt reads end of input. The prototype measured exactly that: the control's seam read `eof`, while the shared reader's seam read `e5`.
- **Why a new module rather than a new export of `line-input.ts`:** `src/cli.test.ts`'s `inputSeamThrows` child (`ADR-0015` (S), `ABC-043` `A3`) substitutes `./line-input.ts` with a double that exports only `createLineInputSeam`.
  - Any module that `cli.ts` loads and that imports a new name from `./line-input.ts` fails at link time. Measured: `SyntaxError … does not provide an export named …`, rc 1.
  - That reds the child, and `A6` forbids editing `cli.test.ts`.

**R2. The questions live in a new `src/startup-questions.ts`.**
- **Name:** it must not start with `cli`. `cli.test.ts` `A9` pins the `cli*` module list to `cli-options.ts` and `cli.ts`.
- **Shape:** one export, for example `askAbsentOptions(parsed, { source, output })`. It returns `Promise<{ readonly options: ResolvedOptions } | null>`, where `null` means input ended at a question.
- **When it asks:** it decides that itself, from `source.isTTY === true && output.isTTY === true` read off the objects it is handed. Its own I/O type adds `readonly isTTY?: boolean` to both.
- **Not a TTY:** it returns `{ options: parsed.options }`. That is 0 reads and 0 writes, and it never calls `lineReaderOf` (scope 6).
- **It reaches for nothing:**
  - no `process`, no Node builtin, no `globalThis`;
  - no error listener (`ADR-0016` clause 3);
  - no cursor control;
  - no `try`.
- **Runtime imports:** only `./line-reader.ts` and `./cli-options.ts`.
  - Never `./line-input.ts` (R1).
  - Never `./history.ts` (`history-pane.nfr.test.ts` `LICENSED_DRIVERS`).
- **Answer rules (scope 2–5):**
  - **Colour:** trim and lower-case, then exact membership in `cli-options`' `COLOUR_VALUES`. An empty line means `white`.
  - **Difficulty:** trim, then exact membership in `DIFFICULTY_VALUES`. An empty line means `DEFAULT_DIFFICULTY`, imported and never re-spelled.
  - **Over-long line:** a `SubmittedLine.overlong` line is a wrong answer. It echoes nothing, because the reader keeps no text past the cap.
  - **Wrong answer:** one line naming the accepted answers, plus the filtered echo, then the same question again. There is no retry cap: end of input ends it.
  - **Echo filter:** the module carries its own copy of the C0/`U+007F` filter. `printableOf` must stay in `cli.ts`, because `numbersIn("cli.ts")` pins `0x20` and `0x7f`.
- **Order:** colour, then difficulty. Each is asked only when `parsed.absent` says that flag was absent.
- **The result is built by R3's function,** so `random` uses the same coin and orientation follows the same rule.

**R3. `src/cli-options.ts` changes additively.**
- (i) The **ok branch** of `Resolution` gains `absent: { readonly colour: boolean; readonly difficulty: boolean }`, set in the argv loop.
  - It sits beside `options`, never inside `ResolvedOptions`: `cli.test.ts` compares `.options` whole with `toEqual`.
  - The ok branch is never compared whole. `engine.test.ts` uses `toMatchObject`.
- (ii) Export `COLOUR_VALUES`, `DIFFICULTY_VALUES` and `ColourValue`.
- (iii) `resolveOptions`' tail (the coin, the orientation, the object) becomes one exported pure function, for example `optionsFor(colour, flags, difficulty)`. `resolveOptions` calls it.
- **Pins the SE must keep (all in `cli.test.ts`):**
  - no new numeric literal (`A8` `numbersIn`);
  - no new string literal (`A6`(i) scan);
  - no `process`, `globalThis` or `import.meta`;
  - no code word matching `/depth|ply|millisecond|\bms\b|nodes?\/sec|budget/i` (`A7`). This is a substring match, so `apply`, `reply` and `supply` red it;
  - membership by exact equality only. `toLowerCase` stays in the questions module;
  - `ACCEPTED_ARGUMENTS` byte-unchanged.

**R4. Wiring in `src/cli.ts`, inside every pin, so `cli.test.ts` stays unedited (`A6`).** The order:
1. `const parsed = resolveOptions(process.argv.slice(2));` The usage path is unchanged except for the name.
2. `const sink = process.stdout;` then `const stdin = process.stdin;`
3. The `EPIPE` arm, with `stdin.destroy()`. It is installed **before** the handle reaches the questions (`ADR-0016` clause 4).
4. `try {`
5. `const resolution = await askAbsentOptions(parsed, { source: stdin, output: sink });`
6. `if (resolution === null) return;` This is `A5`: exit 0 with no new assignment, and no frame and no result screen.
7. `const { colour, orientation, flags, difficulty } = resolution.options;`
8. The glyph mode, `history`, `book` and `runTurnLoop` follow as today, with `input: createLineInputSeam({ source: process.stdin, output: sink })` kept literally.

The `catch` is unchanged.

**Pin accounting:**
- `process` stays at 10 tokens with the same sorted list. `process.stdin` still appears twice: the new `const stdin` line and the seam's `source:`. The arm's `process.stdin.destroy()` becomes `stdin.destroy()` on the same object.
- `process.stdout` appears once.
- `resolveOptions(` appears once.
- `difficulty` appears twice in code.
- `sink.write(` appears once.
- No new numbers.
- The `history` and `book` binders appear once each.
- The `G6` literal is kept.
- There is no `=>` and no `as` in the `runTurnLoop` window, and no `beginFrameSession`.

**Side effect, stated:** a defect thrown by the questions, or by the glyph-mode, game or probe construction that now sits inside the `try`, exits `70` with `INTERNAL_ERROR`. Before, it was an unhandled rejection. No non-defect run changes.

**R5. `A9` holds by structure.** `createBookProbe` (which is lazy anyway) and the glyph-mode session are both built after the questions return.

**R6. Test seams.**
- **New file:** `src/startup-questions.test.ts`, in the default lane, with 0 spawns.
  - It uses `PassThrough` streams whose `isTTY` the test assigns, and a recording output with `isTTY`.
  - It covers `A1`–`A5` and `A7`, plus the module half of `A6`: 0 reads, 0 writes, and a script's first line reaching the seam.
  - **`A7`:** drive it with the **real** `createLineInputSeam` over the same stream after the questions, with the input written in one `write`.
  - **`A9`:** a source-order row over `cli.ts`: the question call comes before `createBookProbe(`.
  - **Injection, not `vi.spyOn`** on ESM namespaces (`ADR-0042`).
- **`src/line-input.test.ts` (edited, guards only):**
  - the import-set row gains `./line-reader.ts`;
  - the code bars (no `try`/`catch`, bar 1, no `node:`) must scan `line-reader.ts` as well, so the moved code keeps its guards.
- **Plants:** the page's P1–P5, plus **P6**: a private reader per caller, with no `WeakMap`. P6 must red `A7`.

## ADR standing: no STOP

Each ADR below is cited, not changed.
- **`ADR-0011`:**
  - clause 1: two new flat production modules, both exporting, so neither is an entry point (clause 4);
  - clause 2: not frame producers;
  - clause 3: not history importers.
- **`ADR-0015`:**
  - `line-input.ts` stays the `input:` supplier;
  - `line-reader.ts` sits one static import below it, so it is not substitutable;
  - `startup-questions.ts` is not in the `runTurnLoop` bag.
- **`ADR-0016`:**
  - clause 3: the receiver installs no listener;
  - clause 4: the arm is installed before the questions;
  - clause 6: holds by identity, because `stdin` is `process.stdin`.
- **`ADR-0036`:**
  - (b1) **fires** on `cli.ts`'s moved `const sink = process.stdout;` and new `const stdin = process.stdin;`. The Security/NFR hop is owed, as cut.
  - § 3's trigger does not fire: neither new module holds a limb.
  - (b2): the new edges reach no holder.
- **`ADR-0009`:**
  - the questions come before the frame session;
  - the in-place writer starts at `CURSOR_HOME` and erases to the end of the screen, so the question lines are overwritten and never miscounted;
  - `cli.ts` names no row count.
- **`ADR-0029`:** the frame-path root is unchanged.
- **`ADR-0045`:** both defaults are unchanged.
- **`ADR-0037` D3:** the `random` answer uses the same coin.
- **`ADR-0044`:** neither new module is in the `uci.ts` closure, so `dist/` emits neither.

The *why* of R1 is recorded in this note and on the ticket page. It is ABC-037-level structure, which this project records on ticket pages (ABC-037 did the same), so it needs no ADR.

## Residual risks (all LOW)

1. **The shared reader's single `waiting` slot.** Two overlapping reads would orphan one (`G6`).
   - **Guarded by:** R4's `await` before `runTurnLoop`.
   - **Trigger:** any new caller of `lineReaderOf`.
2. **`EPIPE` while a question waits.** `stdin.destroy()` may not settle a pending read.
   - **Why unreachable:** questions run only when stdout is a TTY, where a write failure is not `EPIPE`.
   - **Trigger:** questions ever asked on a non-TTY stdout.
3. **Ctrl-D at a question on a real terminal.** That the process exits promptly is `UNKNOWN - verify`. Suggested for QE's `A8` pty reading; not binding.

## Page corrections, made on the ABC-200 page

- **`ADR-0036` (b1):** `cli.ts` reads no `isTTY`. (b1) fires on the two handle lines instead.
- **Size:** stays `M`.
  - **New:** 2 production modules (one is a move of about 95 lines) and 1 test file.
  - **Edited:** 3 production modules (`cli.ts` about 15–20 lines, `cli-options.ts`, a slimmer `line-input.ts`) and 1 test file (guards only).
- **`NFR-008`:** +1 test file, as cut.
