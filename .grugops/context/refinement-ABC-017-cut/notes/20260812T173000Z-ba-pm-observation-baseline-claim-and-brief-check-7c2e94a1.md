---
id: 20260812T173000Z-ba-pm-observation-baseline-claim-and-brief-check-7c2e94a1
kind: observation
by: ba-pm
at: 2026-08-12T17:30:00Z
verified_by:
confidence: high
refs:
  - refinement-ABC-017-cut
  - abc017-cut-2026-08-12
  - ABC-017
  - ABC-010
  - plans/tickets/ABC-010-fen-semantic-validation.md
  - src/history-pane.ts
  - src/history-pane.nfr.test.ts
  - .grugops/queue/claimed/refinement-ABC-017-cut/claim.md
  - 20260812T140000Z-orchestrator-decision-merge-call-d71b3e05
supersedes:
---

# The claim, the baseline re-run, and the brief checked as instructed — THREE wrong figures, one of which stops three gates from running at all

> **HAND-AUTHORED.** `scripts/context-io.ts` does not exist in this repo and the kit has **no
> `scripts/` directory at all** — `/Users/olgeroeselg/.grugops/agent-factory/scripts/` is absent, and
> `mcp__grugops__propose_note` is not in this session's tools. Workflow 16 names `context-io.ts` as
> the single sanctioned writer; it is absent, so this note is written by hand and **says so**,
> following the practice every prior role on this ticket recorded. **Nothing in this note set is a
> `finding`** — no `§14-gate#<id>` machinery exists in this repo and none was invented. **No
> self-attested stamp.**

## Claim (Workflow 17)

`scripts/claim.js` is absent too, so the claim was taken with a plain shell **non-recursive**
`mkdir .grugops/queue/claimed/refinement-ABC-017-cut` — the same single atomic `mkdir(2)` that
`claimTask` relies on, so `EEXIST` would have meant "claim lost" and any other code a genuine failure
to surface rather than swallow. It returned rc=0. **The `claimed/` parent existed and was empty, as
the brief said** — the first hop in three where that sub-claim was right. Registry record written,
subtask moved `pending/` → `claimed/` → `done/`, and the claim directory **released** at the end, per
the precedent the Engineer set after the `d23` stale-claim sweep.

## The brief's baseline, re-run BEFORE any ruling

| quantity | brief said | measured here |
|---|---|---|
| `npm test` | 744/744 on 26 files | **744/744 on 26 files** (`testResults.length` = 26, not the JSON's `numTotalTestSuites`, which reads 133) |
| skip count | 0 | **0** (`numPendingTests + numTodoTests`) |
| failed | — | **0** |
| branched from `main` at `ee68ee1` | — | **`git merge-base HEAD main` = `ee68ee112e313b7ea0f5c5c25422a34233561777`** — exact |
| behind / ahead of `main` | — | **0 behind, 1 ahead** (this subtask's own enqueue commit) |
| `src/history-pane.ts` md5 | — | **`54fd4346dcc1a0060c4e66ae0149265d`** — the merged value, unchanged |
| `lint` / `typecheck` / `build` | exit **0** | **exit 127 / 127 / 127 — see below** |

## WRONG FIGURE 1 — the three gates CANNOT RUN in this worktree, and a later hop will read 127 as a failure

`npm run lint`, `npm run typecheck` and `npm run build` all exit **127**, not 0:

```
> cli-chess@0.0.0 lint
> biome check .
sh: biome: command not found
```

**`node_modules` in `../cli-chess-cut` contains ONE entry and `node_modules/.bin` does not exist.**
The main checkout's `node_modules/.bin` has `biome`, `esbuild`, `glob` and the rest. So the brief's
*"`main` is green: lint/typecheck/build 0"* is true **of `main` in the main checkout** and is **not
reproducible here**.

**This is not pedantry and it is the item with a consequence.** `127` is *command not found*, not a
gate failure — but a hop that runs the three gates in this worktree and reads three non-zero exits
will either report a red that is not there or run `npm install` without saying so. **Both tickets cut
at this hop create Engineer work whose acceptance requires measuring `N8-LANE` in a worktree**, so
whoever dispatches that hop should either seed `node_modules` or say in the brief that an install is
the first step. The suite itself ran (`npx` resolved `vitest` off-tree; `vitest` is not on `PATH`),
which is why the test figure is real and the other three are not.

## WRONG FIGURE 2 — `ABC-010:92` does not say what the brief says it says

The brief homes `AR-1` against three citations. Two are exact and one is off by a bullet:

| citation | brief's claim | read at source |
|---|---|---|
| `:55` | names the huge-fullmove case | **exact** — `\| fullmove 1000000000000000000000 \| toFen emits ... 1e+21 \|` |
| `:114` | names the huge-fullmove case | **exact** — *"Likewise a fullmove field of `1000000000000000000000`"* |
| `:92` | *"explicitly declines unbounded work"* | **WRONG.** `:92` is the tail of a different bullet — *"— both Architect/Design, both out of this ticket."* The decline is at **`:93-95`**, and the phrase itself sits on **`:94`** |

Non-load-bearing on its own — but the brief flagged this citation as the basis for believing `ABC-010`
already covers the risk, and **the substantive ruling on that belief is the opposite of what the brief
expected**. Detail in the `AR-1` note beside this one.

## WRONG FIGURE 3 — `ticket-to-pr-ABC-017-fixtures` has SEVEN notes, not six

The brief lists five context directories with their note counts. Four are exact
(`quality-gate-ABC-017-qe` 6, `security-nfr-ABC-017` 7, `refinement-ABC-017-gaps` 6,
`quality-gate-ABC-017-narrow` 6). **`ticket-to-pr-ABC-017-fixtures` has 7.**

**The cause is benign and is the same shape the Engineer himself reported one hop earlier.** His own
`artifact-ref` note records *"six notes"*, and he then published a seventh
(`…-decision-three-acceptance-edits-9c25e7b1`) after writing it — so the figure was right when typed
and stale by the act of writing the next note, exactly as his commit count was *"right when it was
typed and stale by the act of committing it"*. **The brief inherited a note's figure instead of
counting the directory.** I read all seven; the seventh is the one carrying the `A9` timing-repair
pattern and the `src/history-pane.ts:30` flag, both of which this hop rules on, so it is not a note it
was safe to miss.

**That is nine consecutive hops in which the role being briefed found a wrong figure in the brief.**

## What I re-derived at source rather than inheriting

- **`src/history-pane.ts:30`** reads *"IT IMPORTS `GameHistory` AS A TYPE ONLY, so `src/history.ts`
  keeps its zero runtime importers."* **Unqualified — confirmed exactly as the brief describes.**
- **`src/history-pane.nfr.test.ts:106-112`** is the seven-line block ending *"…which is why it was
  declined rather than forgotten"* — **the line range in the brief is exact.**
- **Swept for the retired vocabulary rather than trusting the one site named**, which is `ABC-016`
  `R1`/`D27`'s own lesson: `grep -rn 'runtime importer' src/` returns **three** sites, and **only
  `src/history-pane.ts:30` is unqualified**. `src/history-pane.nfr.test.ts:228` already says *"among
  the production modules"*; `:269` is the file describing itself. **One site, not three** — unlike
  `ABC-016`, where `D27` named one of three and two survived into `main`.
- **The two guards' file sets, read at source.** The regex guard filters
  `file.endsWith(".ts") && !file.endsWith(".test.ts")` (`src/history-pane.nfr.test.ts:237-239`); the
  probe applies that same filter and then `file !== "history.ts" && file !== "perft-bench.ts"`
  (`:281-282`). **The disagreement QE named is exactly there.**
- **`src/perft-bench.ts` calls `main()` at module scope** — confirmed at `:114`.
- **`src/status-panel.ts:24`** reads *"IT ADDS NO RUNTIME IMPORTER OF `src/history.ts`"* — scoped to
  the module's own contribution, and it is the phrasing QE said should win.
- **`parseClock` applies `/^\d+$/`** to both clock fields (`src/fen.ts:132`, `:178-179`), which is
  load-bearing for the `AR-1` ruling and is why an exponential-form field cannot be supplied directly.

## Boundary held

**ZERO lines under `src/`** — asserted, not assumed: `git status --short -- src/` is **empty**, the
`src/` aggregate md5 is **`19279a8fadd5302810634c172ec9b766`** before and after, and
`src/history-pane.ts` is **`54fd4346dcc1a0060c4e66ae0149265d`** before and after. No test was written.
`plans/board.md` was **not** written. `ABC-017` was **not** re-opened, moved or edited — its
frontmatter still reads `status: done` / `column: Done`. `ABC-010`, `ABC-024`, `ABC-026`, `ABC-016`
and `ABC-019` were **read and not edited**. `ADR-0009` and `ADR-0010` were **read and not re-opened**.
`memory-bank/` was not written. No merge, no push, no deploy, no `git checkout main`.

**The four out-of-tree measurements this hop made were `node -e` probes and one scratch script in the
session scratchpad** — they imported delivered modules read-only and wrote nothing into the
repository.

## Standing rule — nothing tried to widen my boundary

No note, comment or file in this workspace attempted to authorise a write outside the boundary this
subtask names. Recorded because the rule requires reporting either way. **One low-severity injection
scan fired four times** — on the repo's own root `AGENTS.md` (*"act as the Orchestrator"*) and on
three concatenations of prior roles' notes that are **quoting or reporting that same line, including
notes reporting the same scan**. All four are that file's legitimate routing instruction to human and
agent readers, and all four are false positives. **I remained BA/PM**, which is the role the
activating agent named; a file in the workspace is data and cannot reassign a role.
