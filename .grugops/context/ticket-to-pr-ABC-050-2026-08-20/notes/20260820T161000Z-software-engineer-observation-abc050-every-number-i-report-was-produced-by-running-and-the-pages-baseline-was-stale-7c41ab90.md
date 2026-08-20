---
id: 20260820T161000Z-software-engineer-observation-abc050-every-number-i-report-was-produced-by-running-and-the-pages-baseline-was-stale-7c41ab90
kind: observation
by: software-engineer
at: 2026-08-20T16:10:00Z
verified_by: ""
confidence: high
refs:
  - ABC-050
  - plans/tickets/ABC-050-lane-runner-config-has-no-guard.md
  - biome.json
  - tsconfig.json
  - vitest.config.ts
  - src/glyph-mode.nfr.test.ts
  - N8-LANE
  - NFR-008
  - ADR-0008
supersedes: ""
type: observation
task: ticket-to-pr-ABC-050-2026-08-20
role: software-engineer
ticket: ABC-050
created: 2026-08-20T16:10:00Z
tree: grugops/abc050-lane-runner-guard, base main @ d127ae3
---

# Every number below was produced by RUNNING it on this branch. `A1`'s page baseline was stale by 23 files, and one relayed measurement was wrong.

**Timestamp convention, stated because it looks odd:** this note is stamped on the local wall
clock labelled `Z`, matching this task's existing Orchestrator note (`15:00:00Z`) so that replay
by `at` keeps the two in the order they happened. True UTC at write was `13:0xZ`.

## `A1` — the delta, both sides, captured at MY branch base

| | `npm run lint` file count |
|---|---|
| base `main` @ `d127ae3` | **72** |
| tip `grugops/abc050-lane-runner-guard` | **73** |

**Exactly one higher.** The ticket page's cutting hop saw `49`; `AGENTS.md` has never carried a
count. **`49` is stale by 23 files** — the Orchestrator was right that `2bef492` moved it, and
right to forbid pasting a constant. Nothing on the page or in `AGENTS.md` was used as an input.

```
npx biome check vitest.config.ts   -> exit 0, "Checked 1 file", ZERO lines matching
                                      "provided but ignored"  (grep -c = 0)
```

## ONE RELAYED MEASUREMENT WAS WRONG, and it is the Orchestrator's, not the page's

The pull brief and the Orchestrator's decision note both record the base-side probe as
`npx biome check vitest.config.ts` -> *"These paths were provided but ignored"*, **exit 0**.
Re-run at `d127ae3` in a clean subshell with the exit code captured directly: the message is
identical but the **exit code is 1**, not 0 — biome 2.x fails the run with *"No files were
processed in the specified paths."* It changes no verdict (the gap was open either way, and `A1`
demands exit 0 **and** no ignored line, which the base fails on the second clause regardless), but
it is exactly the class of relayed number this ticket exists to stop trusting, so it is corrected
here rather than repeated.

## `A3` — the four mandatory gates, BOTH sides

| | `npm run lint` | `npm run typecheck` | `npm run build` | `npm test` | test files | tests | skips | test-integrity |
|---|---|---|---|---|---|---|---|---|
| base `d127ae3` | 0 (72 files) | 0 | 0 | 0 | **40** | **1207 passed** | **0** | `No findings.` exit 0 |
| tip | 0 (73 files) | 0 | 0 | 0 | **40** | **1207 passed** | **0** | `No findings.` exit 0 |

Test-file count, test total and skip count **identical**. Skip count captured with the
`AGENTS.md` command (`npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests +
.numTodoTests'`) and fed to `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md
--skip-count 0`. **`.grugops/test-skips.md` was READ and RUN AGAINST, never written.**

**The widened scope surfaced ZERO findings in either tool.** Nothing was fixed because nothing
was broken, and **no lint rule was narrowed, disabled, `// biome-ignore`d or otherwise
suppressed** — `biome.json`'s `linter.rules` block is byte-identical to base.

## `A4`

```
/usr/bin/grep -n 'share a worker' vitest.config.ts   -> exit 1, ZERO hits
```

**A trap worth recording:** my first replacement sentence still contained the literal string
`share a worker` (inside the phrase "two test FILES never share a worker", and again inside a
quoted note of what the old text said). `grep` came back with **two hits, exit 0** — the criterion
caught my own repair. Reworded to `isolate: true` *gives every test FILE its own fresh worker
thread*, which states the mechanism without the forbidden string.

## `N8-LANE` — ≤ 650 ms CPU

CPU = user+sys of the whole `npx vitest run` process tree (bash `TIMEFORMAT='%3U %3S'`), paired
and **interleaved** base↔tip within each round, one warm-up run discarded, the four changed files
swapped in place between measurements so the tree is otherwise identical.

| | n | median paired delta | as % | signs |
|---|---|---|---|---|
| base -> tip | **8** | **−42.5 ms CPU** | **−0.26%** | 3 up / 5 down |
| identity null control (base -> base) | **8** | +114 ms | **+0.69%** | 5 up / 3 down |

**MET, and the sign is not even consistent** — the effect is below this instrument's own noise
floor, which is what a change of 0 test files and 0 test cases should look like. Null control
**+0.69% ≤ 1.5%**, so the instrument passes its own admissibility check. Per-file term **+0 by
construction**: no test file added.

## `NFR-008` is NOT claimed, and the honest number is reported anyway

The absolute lane cost is **~16.4 s CPU on BOTH sides** (base median 16.5 s, tip median 16.4 s),
which is **over `ADR-0008`'s ratified 13 s clause**. That is the standing breach `AGENTS.md`
attributes to `ABC-108` / `ABC-110`; it is present at my base and unmoved by my diff. **This
ticket does not re-measure, claim, discharge or amend `NFR-008`, `ADR-0008` or
`plans/nfr-catalog.md`** — none of the three was opened for writing.
