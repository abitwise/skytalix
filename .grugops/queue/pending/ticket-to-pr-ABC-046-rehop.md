---
task: wave-2026-09-24
subtask: ticket-to-pr-ABC-046-rehop
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md (re-hop after a QE FAIL and a ruling)
ticket: plans/tickets/ABC-046-quit-and-new.md
ref: .grugops/context/ticket-to-pr-ABC-046/  (append to the SAME context)
qe_ref: .grugops/context/qe-ABC-046/
ruling_ref: .grugops/context/ruling-abc046-clause6/
enqueued_by: orchestrator
enqueued_at: 2026-09-24T21:00:00Z
branch: grugops/ABC-046-rehop
base: grugops/wave-2026-09-24 @ 8905de5  (QE and the clause-6 ruling are both merged)
---

# Subtask: `ABC-046` re-hop — fix the two false docblock sentences, add the licensed `disarm`, add the three rows

QE failed the build on two false docblock sentences (D1, D2). Architect/Design then ruled that
`ADR-0021` clause 6 stands, and licensed a `disarm` so that an over-cap line clears the `quit`
confirmation. This amends `A8` a second time. Read the ruling's `decision` note in `ruling_ref:`
and the ticket's `## Ruling (clause 6) 2026-09-24` first. That section IS your change list, down
to the line numbers. Then read QE's `decision` note in `qe_ref:`.

## Change exactly the ruling's list
1. `src/command-input.ts`: D1 (`:4-5`, "six commands … five of them"); D2 (`:222-223`, the true
   statement about `classifyCommand`); `PromptLineResolver` gains `readonly disarm: () => void`,
   attached with `Object.assign(resolve, { disarm })`, and it only clears `quitArmed`; true
   sentences in the wrapper docblock (`:218-230`).
2. `src/line-input.ts`: the over-cap branch (`:245`) calls `resolve.disarm()` and then returns the
   same rejection; one true sentence in the cap docblock (`:85-88`).
3. `src/command-input.test.ts`: the `G1` row (kills `Q3`) and the disarm unit row.
4. `src/line-input.test.ts`: one reader row (`quit` / 1025×`z` / `quit` / `quit`), and add
   `QUIT_CONFIRMATION_MESSAGES` to the existing import.
Every other line stays byte-identical: `src/turn-loop.ts`, `src/cli.test.ts`, and the spawn pin
at `17 + 7 + 1 + 2`. No new files and no new child processes.

## Prove it
- Each new row goes red on its mutant (`Q3`, `X1`, `X2`, `X3`, `M9`) per the ruling's table;
  revert each one and confirm the tree is clean.
- `ABC-037` security bar 2 is green in both lanes (`INPUT_DEEP=1 --expose-gc` for the deep lane).
- The real entry point: `quit` / 1025×`x` / `quit` / EOF shows 2 confirmations and ends on
  `input ended`.
- The four gates, with the expected default lane 42 / 1364 / 0; `test-skip-integrity` prints
  `No findings.`
- N8-LANE charge (in-file ms) and paired lane CPU, `/usr/bin/time -p`, at least 3 runs, load noted.

## Fences
- Do not touch `src/search.*`, `src/quiescence.*` or `src/engine.*` (`ABC-079` is live), and do
  not touch `src/zobrist.*`.
- Do not touch `plans/board.md`, `AGENTS.md` or the `plans/nfr-catalog.md` bars. Do not rule
  NFR-008.
- `self_fix_attempts` = 2 on gates, then stop. Do not merge or deploy. Work in your own
  worktree. Write commit messages to a uniquely named scratchpad file and use `git commit -F`.
  Run gates through node scripts.

## Publish
Notes into `ref:` (`claim` for gates with raw numbers, `observation` for mutants and NFR figures,
no `finding`), a trace row, and ticket § Delivery (re-hop). Claim by hand per Workflow 17 and
move this file to `done/`. Report: the sha, the numstat, the gate numbers, the mutant table, bar 2
in both lanes, the real entry point transcript, the NFR figures, and anything you could not meet.
