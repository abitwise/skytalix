---
subtask: ticket-to-pr-ABC-200
role: software-engineer
ticket: plans/tickets/ABC-200-on-a-terminal-npm-run-chess-asks-for-colour-and-difficulty-when-the-flags-are-absent.md
ref: .grugops/context/ticket-to-pr-ABC-200/
inputs: Architect …f612277c, …0d7cbff3 (arch-design-ABC-200) and the page's ## Build notes; BA/PM …2fddb7fa; Orchestrator …de0099fa
width: 2 (beside qe-ABC-199)
---

# Build ABC-200: the startup colour and difficulty questions on a TTY

## Do
- Create worktree `../wt-ABC-200` on `grugops/ABC-200` from `main`, with its own `npm ci --ignore-scripts`. Never run npm in main's checkout.
- Build exactly to the page's criteria and the Architect's `## Build notes`:
  - `src/line-reader.ts`: the shared reader;
  - `src/startup-questions.ts`;
  - the additive `cli-options.ts` changes;
  - the `cli.ts` wiring, keeping `process` at exactly 10 occurrences;
  - the A7 test, using the real seam, with plant P6 shown red.
- Red first: show each new test red before its code lands.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success; skip-count capture → `test-skip-integrity.js`; `CLI_DEEP`, `UCI_DEEP`, `PERFT_DEEP`. Heap 128 multi-file, 400 one-file.
- **This ticket has production lines, so UAT is not waived.** Say what the QE hand reading on a real terminal (A8) must cover, including Ctrl-D on a question.
- If the build needs anything the Architect's ruling does not cover (a new or changed ADR, a moved acceptance criterion), STOP and report it.
- **Merge order:** after ABC-178. Do not merge into `main`. No timing claims.

## Fences
- Only the files the build notes name. No `package*.json`, `tools/`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se200/`. Never push, force, amend or rebase.

## Publish
- Seal notes via the plugin writer (task `ticket-to-pr-ABC-200`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief, then move it to `done/`.
