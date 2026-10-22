---
subtask: security-nfr-ABC-200
role: security-nfr
ticket: plans/tickets/ABC-200-on-a-terminal-npm-run-chess-asks-for-colour-and-difficulty-when-the-flags-are-absent.md
ref: .grugops/context/security-nfr-ABC-200/
branch: grugops/ABC-200 (tip 0a07df04; code 1efd2cee; base bd745ac9)
width: 2 (beside qe-ABC-200)
---

# Security/NFR hop for ABC-200: ADR-0036 (b1) fires on the new `cli.ts` handle lines

## Do
- Review the diff `bd745ac9..1efd2cee` in full: the new `line-reader.ts` and `startup-questions.ts`, plus the edits to `line-input.ts`, `cli-options.ts` and `cli.ts`. Read the Architect's ruling (`…f612277c`) and the SE's decision (`…11628f2f`).
- Rule on the ADR-0036 (b1) clause for `const sink = process.stdout;` and `const stdin = process.stdin;`.
- Rule on the input-handling surface:
  - the echo sanitising (ESC, C0, DEL, over-length);
  - the line limit (`MAX_LINE_LENGTH`);
  - the shared reader's single waiting slot;
  - the new exit-70 path that comes before the loop.
- Rule whether an `NFR-003` or `NFR-008` reading is owed. If one is, spell out the measurement but **do not take it**: timing runs wait for ABC-178's hop.
- Re-check AR-1 premise checks 5a–5d and 5e on the tip (no new package import; built-ins still `node:fs node:readline`). This ticket adds production modules.
- Result: PASS, PASS_WITH_RISKS or FAIL, with required fixes and accepted risks.

## Fences
- Records only, plus scratch reads and runs of the tip in a clone under `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/sec200/`. No vitest timing. Work on `grugops/security-nfr-ABC-200` (worktree `../wt-security-nfr-ABC-200` from `main`). No `src/`, `package*.json`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `security-nfr-ABC-200`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
