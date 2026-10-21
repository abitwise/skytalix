---
id: 20261021T090143Z-software-engineer-observation-e299c4fd
kind: observation
by: software-engineer
at: 2026-10-21T09:01:43Z
verified_by: 
confidence: high for A1, A3 and A4 and the waiver (commands run); A2's QE read and A3's QE confirmation are QE's and are not claimed here
refs:
  - ABC-179
  - grugops/ABC-179
  - dd131b71
  - ccccc6bb
  - plans/tickets/ABC-179-three-test-comments-say-what-their-source-does-not.md
  - QE-159-f
  - NFR-008
supersedes: 
seal: sha256:d938d3ab4280a9ce07bc29f1ffb4b2f0b47505e0eb027dd903bbb6b4025c200d
---

# ABC-179 acceptance readings and UAT-waiver measurement (base `ccccc6bb`, tip `dd131b71`)

| criterion | base `ccccc6bb` | head `dd131b71` |
|---|---|---|
| A1 (page command) | prints the "A MEASUREMENT IS NOT A GUARD" sentence | prints nothing |
| A2 command | prints the status-panel and history-pane sentences | prints nothing |
| A3 `grep -nE 'history-pane\.nfr\.test\.ts:[0-9]+' src/*.ts` | `src/cli.test.ts:1831`, exit 0 | exit 1 |
| A4 numstat | — | exactly the 4 files: 2/2, 3/3, 3/3, 3/3 (`cli.test.ts` 3/3, net 0) |
| A4 line kind | — | every changed line is a ` * ` header line or a `//` line in `A12` |
| A4 per-file counts (page command, heap 128, same worktree) | 59 files | byte-identical (`cmp` 0); skips 0 |

**A2 and A3, QE parts (owed to QE, not claimed).** The three header sentences that name the catalog at head, on joined text:
- san: "… green: the bars there were held by nothing in the repo, so the in-suite guard is a count." There is no quoted span. The
  substance is at `plans/nfr-catalog.md:555-556`.
- status-panel and history-pane: "… so the bar moves off the clock and onto a count (see `plans/nfr-catalog.md` for that move)."
  There is no quoted span. The move is at `:25` and `:49`.

**Plant check.** The retired forms were planted in scratch copies of the head files, outside the repo. With a san "cannot fail" clause,
A1 printed it. With a status-panel "as `plans/nfr-catalog.md` records:" form, A2 printed it. With a `cli.test.ts`
`history-pane.nfr.test.ts:390` pointer, A3 printed it and exited 0. So the head silence is not vacuous.

**UAT waiver, AGENTS.md form, `.snap` not filtered.** `git diff --name-only dd131b71~1 dd131b71 | grep -v '\.test\.ts$' | grep '^src/'` is empty
(grep exit 1). The same form over `ccccc6bb..dd131b71` is also empty. `.snap` files changed: none. So 0 production lines, and the waiver
condition holds. Applying it is the Orchestrator's job.

**NFR-008:** 0 test files, 0 tests and 0 spawns added (the per-file counts are identical).
