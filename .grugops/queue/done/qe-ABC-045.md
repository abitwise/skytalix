---
task: wave-2026-09-19
subtask: qe-ABC-045
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-045-resign.md
ref: .grugops/context/qe-ABC-045/
build_ref: .grugops/context/ticket-to-pr-ABC-045/
enqueued_by: orchestrator
enqueued_at: 2026-09-20T03:00:00Z
branch: grugops/qe-ABC-045
base: grugops/wave-2026-09-19 (build b8afa30 / 5ef7a15 merged; lane 42 / 1317 / 0)
---

# Subtask: QE `ABC-045` — break `resign`, and rule the two things the Engineer named

The build: `src/command-input.ts` +38/−18 (11 production lines: `COMMAND_TABLE` row
`{ token: "resign", outcome: "game-over" }`, `resolvePromptLine` returns `game-over` with
`reason: "resignation"` and the loser read off `history.position.blackToMove`),
`src/command-input.test.ts` +171/−6, `src/cli.test.ts` +65/−10 (one new child `resigns`, spawn
pin 17+7 → 17+7+1). Read the Engineer's notes in `build_ref:` (the `decision`, the mutant
`observation`, and the two interpretations), the ticket's `A1`–`A7`, then the code.

## Rule these two
1. **`A2` "exactly one further frame is written — the final one":** the Engineer asserts ZERO
   frames after the outcome (the `game-over` branch returns without rendering; the result screen
   is the one further write). Is the criterion as written met, met-as-read, or FAILED? If the
   sentence needs re-wording, say so for BA/PM; if the loop should render one more frame, that is
   `src/turn-loop.ts` and a FAIL with the row named.
2. **`A5`'s loop row did not itself red on the confirmation mutant** (a module-level flag armed by
   an earlier row in the same module instance) — is `A5` actually guarded, or only by `A4`'s
   child? If only by the child, is that enough, or a gap?

## Then break it
- Re-run the four gates; expect 42 / 1317 / 0. Confirm the `cli.test.ts` spawn pin and that the
  new child's stream ends byte-for-byte with the resignation screen.
- Reproduce the Engineer's 8 mutants (they are listed in the observation note) and add at least:
  (a) `resign` while it is the ENGINE's turn — can the human even reach the prompt then? If not,
  say why the `blackToMove` read is safe; if yes, what does the product do; (b) `resign` on ply 0
  (before any move); (c) `resign` after the game is already over (result screen shown) — is the
  line read at all? (d) `resign` with trailing text (`resign now`) — the ticket's no-argument
  sweep; (e) `RESIGN` / `Resign` case — consistent with the other tokens' rule.
  Each: rows RED or NONE; product behaviour where no row exists. Revert; confirm clean.
- `help` output lists `resign` — through the real frame, hidden 0.
- False-sentence check on the amended `command-input.ts` docblock (`ABC-114` standard).
- `test-skip-integrity` → `No findings.`; skip 0.

## Do not
- Do not "fix" the build. Do not touch `src/search.*`, `src/quiescence.*`, `src/engine.*`
  (`ABC-079` re-hop live), `src/zobrist.*` (QE `ABC-075` live). Do not open `plans/board.md`,
  `AGENTS.md`, `plans/nfr-catalog.md`. Do not rule NFR-008 (18.6 → 20.3 s at load 5–10).
- No merge, no deploy. Own `git worktree`; commit messages via a UNIQUELY-NAMED scratchpad file
  and `git commit -F`; gates/mutants via node scripts (hook refuses `$?`, `npm run`).

## Publish
PASS or FAIL as a `decision` note, mutants as `observation` with raw output, trace row, ticket §
QE. Claim by hand per Workflow 17: `mkdir .grugops/queue/claimed/qe-ABC-045`, move this file in,
then out to `done/`. Report: verdict, the two rulings, mutant table, gate numbers, sha, numstat.
