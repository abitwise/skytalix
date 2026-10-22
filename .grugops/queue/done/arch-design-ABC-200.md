---
subtask: arch-design-ABC-200
role: architect-design
ticket: plans/tickets/ABC-200-on-a-terminal-npm-run-chess-asks-for-colour-and-difficulty-when-the-flags-are-absent.md
ref: .grugops/context/arch-design-ABC-200/
inputs: BA/PM …2fddb7fa (bapm-next-slice); Orchestrator …de0099fa; ABC-037 (stdin reader); existing ADRs under plans/ or memory-bank/
width: 2 (beside ticket-to-pr-ABC-199)
---

# Design ruling for ABC-200: the startup colour and difficulty questions share stdin with ABC-037's reader

## Do
- Read the ABC-200 page, ABC-037's reader design and the ADRs that govern stdin, readline and the TTY.
- Rule how the questions read input on a TTY without breaking the move reader, and how a piped (non-TTY) run stays byte-identical to today. Say where the code goes and which test seams exist.
- **STOP condition:** if this needs a new ADR, or changes or reverses one, write the proposal and the options with a recommendation, then stop. That decision is the owner's.
- If no ADR change is needed, record the ruling against the existing ADRs and amend the ABC-200 page's build notes, so the SE can build it.

## Fences
- Records only: no `src/`, `tools/` or `package*.json` changes, and no test or timing runs. A prototype in scratch is allowed if it runs no vitest.
- On `plans/board.md`: one `_Updated` line only.
- Work on `grugops/arch-design-ABC-200` (worktree `../wt-arch-design-ABC-200` from `main`). Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/arch200/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `arch-design-ABC-200`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a trace row into this brief, then move it to `done/`.

## Result (architect-design, 2026-10-22T19:15:42Z): **ABC-200 design ruled. No STOP: no ADR is new, changed or reversed. Ready for the SE.**

- **Branch:** `grugops/arch-design-ABC-200` @ `8f5a8a3c` in `../wt-arch-design-ABC-200`, from `main` `9c54df47`. Not pushed, not merged.
- **Ruling** (`…f612277c`):
  - **One line reader per stream.** `ABC-037`'s line state machine moves from `src/line-input.ts` into a new `src/line-reader.ts`, as `lineReaderOf(source)`, memoized per source by a `WeakMap`. `createLineInputSeam` keeps its signature and reads through it.
  - **The questions** go in a new `src/startup-questions.ts`, on the same reader. They ask only when both handed streams report `isTTY`; otherwise they make 0 reads and 0 writes. They reach for no `process`.
  - **`src/cli-options.ts`** gains an ok-branch `absent`, exports its two closed value sets, and gets one options builder that holds the coin and the orientation rule.
  - **`src/cli.ts`** wiring keeps every `src/cli.test.ts` pin, so `A6`'s 0 edited lines hold:
    - `process` still occurs 10 times;
    - the seam literal `source: process.stdin` is kept;
    - the `EPIPE` arm is installed before the questions, and its `process.stdin.destroy()` becomes `stdin.destroy()` on the same handle;
    - the questions run inside the existing `try`.
- **Why a new module:** the `inputSeamThrows` child substitutes `./line-input.ts` with a double that exports only `createLineInputSeam`. A new import from it fails at link time (measured in scratch: `SyntaxError`, rc 1).
- **ADRs it rests on, all unchanged:** `ADR-0011`, `ADR-0015`, `ADR-0016` (clauses 3, 4 and 6), `ADR-0036`, `ADR-0009`, `ADR-0029`, `ADR-0045`, `ADR-0037` D3, `ADR-0044`, `ADR-0042`.
  - `ADR-0036` (b1) fires on the two `cli.ts` handle lines, so the Security/NFR hop is still owed. § 3's trigger does not fire.
- **Readings** (`…0d7cbff3`; plain `node` in `scratchpad/arch200/`, no vitest, no timing):
  - every `cli.test.ts` pin that binds the wiring is listed;
  - **A7, shared reader:** `black\n1\ne5\n` in one write gives black and 1, and the seam reads `e5`;
  - **control, two private readers:** the seam reads `eof`;
  - **A2/A4:** 5 rejections, no ESC byte;
  - **A5:** `null`;
  - **A6:** 0 bytes written, and the seam reads `e4`.
- **The ABC-200 page:**
  - a dated pointer under the title;
  - `## Build notes` added;
  - two corrections in place: (b1) fires on the handle lines, not on `isTTY` reads; the size stays M but the file count grows;
  - test note 6 added (`A7` with the real seam; plant P6);
  - no acceptance criterion moved.
- **Board:** one `_Updated` line. The column move (In Design → Ready for development) is the Orchestrator's.
- **Not touched:**
  - `src/`, `tools/`, `package*.json`, ADRs, `plans/nfr-catalog.md`, `plans/traceability.md`;
  - other worktrees;
  - git config.
- **Notes** (sealed under `../wt-arch-design-ABC-200/.grugops/context/arch-design-ABC-200/notes/` and committed on the branch):
  - `20261022T191359Z-architect-design-observation-0d7cbff3`;
  - `20261022T191404Z-architect-design-decision-f612277c`.

### Trace row (10 cells, header order)

| ABC-200 (arch-design-ABC-200) | Design ruled: one line reader per stream (src/line-reader.ts, lineReaderOf memoized per source); questions in src/startup-questions.ts on that reader, TTY-only, before the loop; cli-options ok-branch absent + one options builder; cli.ts wiring inside every cli.test.ts pin (A6 0 edited lines) | EPIC-006 | — | ADR-0011, ADR-0015, ADR-0016 cl.3/4/6, ADR-0036 (b1) fires (hop owed; §3 not fired), ADR-0009, ADR-0029, ADR-0045, ADR-0037 D3, ADR-0044, ADR-0042 — none changed; NFR-007/NFR-008 as cut; notes …0d7cbff3, …f612277c | grugops/arch-design-ABC-200 @ 8f5a8a3c (records only)<br>plans/tickets/ABC-200-…-absent.md; plans/board.md (1 line); .grugops/context/arch-design-ABC-200/notes/ (2) | — (records only; scratch prototype under plain node: A7 shared reader e5, control eof; link probe SyntaxError rc 1; no vitest, no timing) | — | — | In Design exit: ready for SE (column move is the Orchestrator's); no STOP |
