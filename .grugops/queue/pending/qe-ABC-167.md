---
subtask: qe-ABC-167
role: qe-e2e
ticket: ABC-167
page: plans/tickets/ABC-167-a-capability-free-uci-session-answers-the-d3-commands-with-the-d4-time-rule-and-the-go-limits.md
branch: grugops/ABC-167 @ 4dbbfbd8 (code 3dd0db1b, base e286526d)
ref: .grugops/context/qe-ABC-167/
---

# QE pass on ABC-167, the capability-free UCI session

You are breaking the delivery at `4dbbfbd8`. Report the gaps you find.

**Worktree.** Work from a scratch worktree: `git worktree add --detach ../wt-qe-ABC-167 4dbbfbd8`. **Do not commit to `grugops/ABC-167`. Do not touch `../wt-ABC-167` or `../wt-ABC-146`.**

## Read first
- The ticket page, A1–A12.
- ADR-0044, especially D2–D4 and D12.
- `.grugops/context/ticket-to-pr-ABC-167/notes/` on the branch.
- **Decision note `…297da9e5`.** The SE made five choices the page left open. Grade each one: either the page or ADR decides it, or it is a gap. Name the gap and its severity.
  1. A new session starts at the start position.
  2. The time-token value rules.
  3. A held `bestmove` is written first when a new `go` arrives.
  4. `searchmoves` consumes tokens up to the next `go` keyword.
  5. The `nps` formula.
- QE-170-g in `.grugops/context/qe-ABC-170/notes/`: the edge cases (`go depth 0`, tiny `nodes`, `mate N` → 2N−1). Check that they are pinned by tests that fail on a wrong build.

## Do
- **Mutants.** Use scratch copies only. Target each criterion, especially:
  - the A5 bounds,
  - the A6 hold, `stop` and `ponderhit`,
  - A7 limit parsing and the min of `depth` and `mate`,
  - A4's `bestmove 0000`,
  - A11's fences.
- **Run the gates at the tip.** Check `.test-results/last-run.json` for `success: true` and the full count. Re-run if the 60 s bound cut the run off. Run integrity at skip 0.
- **N8-LANE delta (NFR-008).** This is a timing reading. Take it **only** if you see a quiet window from the foreground: 180 s in which `ps -axo command | grep -E "vitest|oeselg-labs/platform" | grep -v grep` shows nothing that is not yours. Record the host and load1. Otherwise leave it **OWED**. Never estimate it.

## Fences
- **Keep this hop lean and finish it.** ABC-166's width-1 verdict run waits for it to end.
- Do not touch `src/`, `plans/board.md`, `plans/traceability.md`, `AGENTS.md`, `package.json`, `vitest.config.ts`, or any process you did not start.
- Do not fix any defect you find. Never push, never merge, never self-sign.

## Publish
- Write hand-authored, unsealed notes under `ref:` in main's working tree.
  - At least one note must be a `kind: decision` note authored by `qe-e2e`, with the verdict PASS / PASS_WITH_GAPS / FAIL.
- Write `.grugops/queue/done/qe-ABC-167.md` and `.claim.md` in main's working tree, uncommitted. Include:
  - the criteria grading,
  - the five choices graded,
  - the mutants killed and survived,
  - the gates line,
  - N8-LANE (the reading, or OWED),
  - the gaps (`QE-167-*`),
  - a trace row.
- Remove the scratch worktree.
