---
id: 20261018T211000Z-qe-e2e-observation-abc167-rows-and-gates-ee144f96
kind: observation
by: qe-e2e
task: qe2-ABC-167
at: 2026-10-18T21:10:00Z
verified_by:
confidence: high
refs:
  - ABC-167
  - plans/tickets/ABC-167-a-capability-free-uci-session-answers-the-d3-commands-with-the-d4-time-rule-and-the-go-limits.md
  - 20261018T202300Z-ba-pm-decision-abc167-amendment-rulings-for-qe-167-a-to-h-7d2e41b9
  - 20261018T204242Z-ba-pm-decision-abc167-clock-step-ruling-5c7a1e30
  - .grugops/queue/done/ticket-to-pr-ABC-167-fix.md
  - .grugops/queue/done/ticket-to-pr-ABC-167-fix2.md
supersedes:
---

# ABC-167 re-check at tip `6922f772`: the amended rows and the gates

Hand-authored and unsealed: this install has no `context-io.ts`. Run in the scratch worktree `../wt-qe2-ABC-167`,
detached at `6922f772`, with its own `npm ci`. That worktree is removed.

## The code change (`4dbbfbd8..6922f772 -- src/uci-session.ts`, +23/-8)
- `position`, `ucinewgame` and `quit` call `release()` first. `go` already did.
- `parseGo` reads every value through `valueAfter(index)`: the next token, unless it is missing or in `GO_KEYWORDS`.
  The index moves only when a value was read. This applies to all three value groups: depth/nodes/mate, the ms
  tokens and `movestogo`.

## Every amended row exists in `src/uci-session.test.ts` and passes
A3-h1, A4-a1, A4-a2, A5-b1..b5, A5-c1, A6-d1, A6-e1..e5, A7-f1..f3, A7-h1, A9-h1 and A11-g1. The steps match
`bapm-amend2`: 100 on b1, b2, b4, b5, f1, both halves of f3, and h1; 10 on b3 and c1; the bound G..G+2·step is
kept, and the timeout is not raised. The constants-only A8 `ceil` row is kept, which the page allows; it counts for
nothing.

Which row kills which wrong build is in `…92d6d4e6`. Every wrong build the page names fails its row.

## Gates at `6922f772`
- lint 0, typecheck 0, build 0.
- `npm test` exit 0 on the first run: 59 files, 1908/1908, 26.48 s (under the 60 s bound). A foreign `vitest` run
  (`Projects/public/grugops`) was going at the same time, so that duration is not a lane reading.
- `.test-results/last-run.json`: `success: true`, numTotalTests 1908, passed 1908, failed 0, pending 0, todo 0,
  59 test files.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No findings.", exit 0.
- A12: `git diff --name-only e286526d 6922f772 -- src` lists exactly `src/uci-session.ts` and
  `src/uci-session.test.ts`.
- `git merge-tree --write-tree main 6922f772` against main `702895c7`: clean.
- `CLI_DEEP` and `PERFT_DEEP` were not re-run. The SE reports 10/10 and 32/32, and `src/uci-session.ts` is
  imported by no other file.
