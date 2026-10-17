---
id: 20261017T123700Z-software-engineer-artifact-ref-abc096-branch-files-commands-5b71c2e9
kind: artifact-ref
by: software-engineer
task: ticket-to-pr-ABC-096
at: 2026-10-17T12:37:00Z
verified_by:
confidence: high
refs:
  - ABC-096
  - 20261017T123500Z-software-engineer-decision-abc096-build-to-adr0043-3c9e1a7f
  - 20261017T123600Z-software-engineer-observation-abc096-criteria-gates-mutants-8f2d4b60
supersedes:
---

# Branch, files, commands, and what is owed

This note is hand-authored and unsealed.

- **Branch** `grugops/ABC-096-opening-name`, cut from `main` `6edadcf0`. Worktree
  `/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-ABC-096`, with `node_modules` symlinked from the main
  checkout. Not merged, not pushed.
- **Code commit** `a48da51c`, then the records commit (these notes, the trace row, § Delivery).
- **Files** (`--numstat` against `6edadcf0`). All seven are inside the fence, and there is no new file:
  - `src/book.ts` +33 −9; `src/render-seam.ts` +43 −4; `src/cli.ts` +4 −3 (production);
  - `src/render-seam.test.ts` +350 −5; `src/history-pane.nfr.test.ts` +36 −7; `src/cli.test.ts` +30 −4;
    `src/book-engine.test.ts` +2 −1.
- **Production lines: yes.** The UAT waiver does not apply.
- **Commands:**
  - `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`;
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`;
  - `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`;
  - `npx vitest run src/book.test.ts`;
  - the mutant script `scratchpad/abc096-se/mut.py`;
  - the timing script `scratchpad/abc096-se/frame-time.mjs`.
- **Not touched:** `plans/board.md`, `AGENTS.md`, the ADRs, everything on the must-not-change list.
- **Flag, not fixed (outside the fence):** the comment in `src/cli.real-engine.test.ts:405`, "the engine
  reached its ply (the probe is asked only then)", is now stale: frame 0's lookup asks first. The assertion is
  still true. That is a comment for whoever next edits that file.
- **Owed, not mine:**
  - QE: the hop;
  - Security/NFR: `A3`/`A4`/`A7`, and the `NFR-007` first-call ≤ 30 ms reading on the delivered build. I took
    none; my 6.4 ms figure is a first *frame*, which includes the parse, in a script, not `npm run chess`;
  - the owner: UAT, with the page's three observations;
  - the Orchestrator: the board.
