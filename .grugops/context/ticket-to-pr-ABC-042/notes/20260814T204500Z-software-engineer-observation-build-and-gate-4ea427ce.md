---
id: 20260814T204500Z-software-engineer-observation-build-and-gate-4ea427ce
kind: observation
by: software-engineer
at: 2026-08-14T20:45:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - src/cli.ts
  - src/cli-options.ts
  - src/cli.test.ts
  - src/history-pane.nfr.test.ts
  - package.json
  - AGENTS.md
supersedes: 
---

# The delivered build, the gate numbers on the branch tip, and the base I actually took

## The base, checked rather than assumed

The subtask names `main @ 5b85d31`. **`main` had moved to `7df25b9`** by the time I claimed, so I
verified what moved before branching:

```
git diff --numstat 5b85d31 7df25b9 -- src/     ->  (empty)
git diff --name-only 5b85d31 7df25b9           ->  .grugops/context/ticket-to-pr-ABC-042/notes/ x2
                                                   .grugops/queue/pending/ticket-to-pr-ABC-042.md
                                                   plans/board.md
                                                   plans/tickets/ABC-042-...md
                                                   plans/tickets/history/ABC-042-board-history.md
                                                   plans/traceability.md
```

**Zero bytes under `src/`.** `grugops/ticket-to-pr-ABC-042` is branched from **`7df25b9`**, and that
is the commit this build was produced on.

## The gate, run on the branch tip

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | **PASS** — 54 files checked, no fixes applied, 2 infos (both the pre-existing `biome migrate` config notice, not this diff's) |
| typecheck | `npm run typecheck` | **PASS** — `tsc --noEmit`, no output |
| unit | `npm test` | **PASS — 856/856 on 30 files** (827/29 at the base; this ticket adds 29 tests in 1 file) |
| build | `npm run build` | **PASS** — `tsc --noEmit` (this project's honest "build") |
| test integrity | skip-count capture then `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **PASS** — skip count **0**, `No findings.`, exit **0** |

`.grugops/test-skips.md` was read and run against. **No row was written into it** — it is human-owned.
`self_fix_attempts` was not consumed: the gate was green on its first full run after the licence edit.

## The diff, against `7df25b9`

```
AGENTS.md                    Dev / run: UNKNOWN - verify  ->  `npm run chess`
package.json                 +1 key under scripts ("chess"), nothing else
src/cli.ts                   NEW  (entry point, exports nothing)
src/cli-options.ts           NEW  (the pure resolver)
src/cli.test.ts              NEW  (the one test file, both modules)
src/history-pane.nfr.test.ts +7 -1   the licensed edit, and nothing else in that file
```

`git diff --numstat 7df25b9 -- src/` reports **one** merged file — `src/history-pane.nfr.test.ts`.
**All 18 merged production modules are byte-identical**, measured, not asserted.

## The licence edit, and the red it answers

The red arrived exactly where Architect/Design measured it out of tree, **before** I touched the
merged file:

```
FAIL src/cli.test.ts > A12 — the licence gained exactly the entry point
AssertionError: expected [ '"turn-loop.ts"' ] to deeply equal [ '"cli.ts"', '"turn-loop.ts"' ]
```

It was **anticipated, not diagnosed**: `LICENSED_DRIVERS` (`:213`) gained one element — `"cli.ts"` —
and **the citation was pasted verbatim from `…decision-clause4-census-and-licence-d07080ea`**. No
citation was invented, the equality at `:329` was not weakened, the regex was not touched, and no
other line of that file changed. The entry point stayed **flat in `src/`** (`A3`): the
`src/cli/main.ts` build that makes this red disappear is the wrong green and was never built.

## The spawn count — **10**, stated as the ticket requires

Every child is spawned **once**, at module scope, with stdout and stderr piped, and the count is
pinned by an assertion (`expect(spawned).toBe(10)`) so a later hop cannot let it creep.

| # | child | criteria it carries |
|---|---|---|
| 1 | `npm run chess` | `A1`, `A7` (ascii half), `A8` |
| 2 | `--colour white --unicode` | `A4` (white), `A7` (unicode half) |
| 3 | `--colour black` | `A4` (black) |
| 4 | `--colour random` | `A4` (random) |
| 5 | `--ascii --unicode` | `A5` end-to-end |
| 6–9 | `--difficulty 3`, `-x`, `--colour purple`, `foo` | `A6`(iii) — the criterion names these four |
| 10 | `--colour <ESC>[2J purple` | security bar 3 (*"spawn once"*) |

**Everything else is zero-spawn**: `A4`'s 1000 `random` resolutions, all of `A6`(i), `A6`(ii)'s 1000
generated tokens with its 250-per-shape quota, `A5`'s spy with its arming control, and every
structural row. Test note 3 is satisfied with room.

**10 is one over the ticket's "single digits", and no merge exists that removes one** — see the gaps
note. `A1` requires the bare `npm run <name>`; `A4` names three colour runs; `A6`(iii) names four
argvs; bar 3 says *"spawn once"*.

## `A11` — the recorded reading, with its machine

**Not a suite assertion**, by design. Protocol: `spawnSync` from process start to the child's exit
with the whole frame captured — an **upper bound** on "to the last byte of the first frame". 9 runs,
round 0 discarded, n = 8.

| command | median | min | max |
|---|---|---|---|
| `node src/cli.ts` (the entry point as a child) | **68.8 ms** | 61.2 | 74.3 |
| `npm run chess` (what a human types) | **150.3 ms** | 146.0 | 152.8 |

**Machine: Apple M3, 8 cores, 16 GB, Darwin 25.5.0 arm64, Node v24.12.0, npm 11.7.0.** Bar: ≤ 1 s.
Both readings are more than an order of magnitude under it. `plans/nfr-catalog.md` was not edited.
