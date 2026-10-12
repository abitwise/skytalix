---
task: wave-2026-09-25
subtask: bapm-amend-ABC-101
role: ba-pm
ticket: plans/tickets/ABC-101-difficulty-selection.md
ref: .grugops/context/bapm-amend-ABC-101/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/bapm-amend-ABC-101
base: main (after the board commit that enqueues this)
---

# Subtask: rule the criteria that stopped ABC-101's wiring. You are the ONLY hop running (width 1).

The SE (`ticket-to-pr-ABC-101`, branch `grugops/ABC-101-difficulty-selection`, tip `27dddf86`, records only) built the whole ticket as a probe diff (`.grugops/context/ticket-to-pr-ABC-101/probe/abc101-full-not-committed.diff` on that branch; probe tree `c7fbafff`) and STOPPED because wiring the level reds **`ABC-086` `A5`(i)**: "The shipped construction is unchanged: `src/cli.ts:175`, `createEngine({ budgetMs: DEFAULT_BUDGET_MS })`, passes no `now`", pinned in `src/engine.test.ts` as `expect(cliSource).toContain("createEngine({ budgetMs: DEFAULT_BUDGET_MS })")`. Read the SE's notes `…57bfba6d` (observation) and `…443a041f` (decision) on that branch before ruling.

Rule, each with its reason, as dated append-only amendments on the pages (never loosen; amend openly, as A5(iii) itself demands):
1. **`ABC-086` `A5`(i).** The SE recommends "the shipped construction passes no `now`" (wall clock), re-pinned on `createLevelSeam(`. Weigh it against A5's stated purpose (shipped default is wall-clock; virtual clock off the shipped path) and its last line, "Determinism must not be bought by changing the shipped budget" — the default level 3 is `{ DEFAULT_BUDGET_MS, 0 }` by value. Say what the re-pinned row must assert (e.g. no `now` in the root's construction, and the default level's budget equals `DEFAULT_BUDGET_MS`) so the pin still discriminates. If you judge this is a design question, not a criteria one, say so and stop; the Orchestrator routes it.
2. **`ABC-101` `A9`.** Widen the allowed file set by `src/engine.test.ts` (the one re-pinned row only), or rule otherwise.
3. **`ABC-101` `A7`'s grep** reads 2 hits in older ABC-042 comments ("0.112 ms", "simp**ly**"), identical at base, 0 in executable code. Rule the reading (Test note 4 anticipated this).
4. **`ABC-042`'s merged page:** the annotation that its "anything else, including `--difficulty`" refusal row is superseded by ABC-101 (dated pointer only).
5. Confirm the guards the SE moved that were not named in advance (ABC-061 `A2`/`A3` whole-object `difficulty: 3`; ABC-042 `A8` numeric-literal list gains `32` in `cli.ts` and `2`–`5` in `cli-options.ts`) are moves the criteria allow, not loosenings.
6. Note for the Orchestrator: the `AGENTS.md` dev/run slot line the SE drafted (`probe/agents-md-dev-run-slot.txt`, +4 B → 24,573 B) is the Scribe's to land after you; say if its wording conflicts with any criterion (ABC-065 `A3`, ABC-101 `A5`/`A6`).

## Fences
Own worktree: `git worktree add ../wt-bapm-amend-ABC-101 -b grugops/bapm-amend-ABC-101 main`. Edit only ticket pages `ABC-086`, `ABC-101`, `ABC-042` (dated, append-only), your notes under `ref:`, and one trace row at the END of `plans/traceability.md`. Do not touch `src/`, `tools/`, tests, `plans/board.md`, `AGENTS.md`, ADRs. No `update-ref`, `--force`, `-D`, `--amend`, `reset --hard`, rebase. Never merge or push. No timing readings. If you change any committed file other than notes, run the gates before your last commit (`npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, `.test-results/last-run.json` success true, `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`). End commits with a `Co-Authored-By:` trailer naming the model you are. Queue: `mkdir .grugops/queue/claimed/bapm-amend-ABC-101` in the main checkout, then FLAT `.grugops/queue/done/bapm-amend-ABC-101.md` and `.claim.md` there, uncommitted; `rmdir` the claim dir.

Report: branch tip; each ruling 1–6 with its reason and the exact amended text; DoR of ABC-101 after; what the SE resume hop must do; anything owed by the Architect, Security/NFR, the Scribe or the owner.
