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
