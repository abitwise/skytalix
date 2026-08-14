---
id: 20260815T133600Z-software-engineer-artifact-ref-branch-method-and-the-queue-record-e2b1d9c4
kind: artifact-ref
by: software-engineer
at: 2026-08-15T13:36:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - src/cli.test.ts
  - .grugops/context/ticket-to-pr-ABC-042-q1q2fix/
  - .grugops/queue/claimed/ticket-to-pr-ABC-042-q1q2fix/
supersedes: 
---

# What this hop produced, by reference — the method, and the queue move I do NOT own

## Branch

- **`grugops/ticket-to-pr-ABC-042-q1q2fix`**, cut from **`grugops/quality-gate-ABC-042` @ `257d023`**
  exactly as the subtask directed — **not** from `main`.
- **`main` is NOT an ancestor of my base and was NOT merged in.** Verified with
  `git merge-base --is-ancestor main grugops/quality-gate-ABC-042` before branching (it reported not
  an ancestor, which is the expected answer). `main` was never checked out.
- Commit **`ad67e67`** carries the instrument change; a second commit carries this note set and the
  queue record, so the code change and the process bookkeeping are separable — the same two-commit
  split the delivered hop used.
- **No push, no PR, no merge, no deploy.** This repo has no remote.

## Files this hop changed

| file | change |
|---|---|
| `src/cli.test.ts` | **two existing rows strengthened, +24 / −0.** `A9`'s row counts the `process` identifier (4) and forbids `globalThis`; the `N8-LANE` row pins `node:child_process`'s import list to `["spawnSync"]` and its call sites to 1. **Zero new tests (29 → 29), zero new spawns (10 → 10), zero production bytes** |
| `.grugops/context/ticket-to-pr-ABC-042-q1q2fix/notes/` | **eight notes** (5 `observation`, 2 `decision`, 1 `artifact-ref`, **0 `finding`**), hand-authored per `agent-factory/contracts/context-note.md` |
| `.grugops/queue/claimed/ticket-to-pr-ABC-042-q1q2fix/claim.md` | the now-running registry record |

**`src/cli.ts`, `src/cli-options.ts` and `src/history-pane.nfr.test.ts` are byte-identical to my base
by md5 AND git blob SHA** — hashes in the gate note. All 18 merged production modules are identical
to `main@8dbc3db` by blob SHA, 18/18.

## Commands run, and what they returned

```
git merge-base --is-ancestor main grugops/quality-gate-ABC-042   NOT an ancestor (expected)
npm run lint                  PASS  54 files, no fixes, 2 infos (both on biome.json), rc 0
npm run typecheck             PASS  tsc --noEmit, rc 0
npm run build                 PASS  tsc --noEmit, rc 0
npm test                      PASS  856/856 on 30 files
npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'    ->  0
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0
                              PASS  "No findings.", exit 0
PERFT_DEEP=1 npx vitest run src/perft.test.ts    PASS  32/32, 8 deep counts exact, 36.19 s
node src/cli.ts "x--colour" black   (under mutant MX5)  ->  23-row board, exit 0, stderr empty
git rev-parse <commit>:<file>       production blob SHAs, three commits, identical
md5 -r src/cli.ts src/cli-options.ts src/history-pane.nfr.test.ts   unchanged from pre-work capture
```

## Method, stated so it can be re-run against me

- **Mutation harness** (`mutate.mjs`, `census.mjs`, `lane.sh`, in the session scratchpad,
  deliberately **outside the repository**): every mutant is an anchored replacement that **aborts
  unless its anchor is found exactly once**; the mutation is proved on disk with
  `git diff --name-only` before the run; `timeout 180` per run; `git checkout -- src/` between
  mutants with `git status --porcelain` verified clean after each.
- **Plus an INSTRUMENT guard**, which is the part I got wrong first and would want the next role to
  copy: the harness proves the strengthened assertions are still present **before and after every
  mutant application**, because `git checkout -- src/` also reverts uncommitted instrument work and a
  reverted treatment reads as a **false SURVIVED**. Recorded as `E4`.
- **14 mutants**, run against `src/cli.test.ts` for the kill determination and against the **whole
  suite** for every survivor. Seven of QE's rebuilt from its descriptions rather than copied.
- **`N8-LANE`**: 3 conditions × 8 rounds, order rotated per round, round 0 discarded, CPU =
  `user + sys` from `/usr/bin/time -p`, with a **byte-identical rerun as the identity null control**.
- **`PERFT_DEEP` reachability**: settled by blob SHA over every production module plus a check that
  the diff adds **no import statement**, then run anyway.

## Not produced, deliberately

`plans/board.md` and `plans/traceability.md` (the Orchestrator's — reserved on this ticket for the
third time, deliberately, and the subtask says the resulting move is the Orchestrator's and not a gap
I must report), the **ticket page** (BA/PM's; four wording items are already queued for it and
ticking criteria is theirs), `plans/nfr-catalog.md` and `ADR-0008` (**owner-ratified — not opened for
writing**), `.grugops/test-skips.md` (**human-owned — read and run against, never written**),
`src/history-pane.nfr.test.ts` (**`A12` bounds it; `Q3` is Architect/Design's**), `plans/metrics.md`,
any ADR, and **any `kind: finding` or `§14-gate#<id>` stamp** — none is emittable on this install and
none was invented.

## The queue record, and the move that is the Orchestrator's

The **atomic claim** was taken **by hand** per `AGENTS.md` § Role / workflow files and the subtask:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` (no `-p`) of
`.grugops/queue/claimed/ticket-to-pr-ABC-042-q1q2fix/`. That bare `mkdir` is the atomic act; it
returned success, so **the claim is mine and was not lost**. `claim.md` was written inside it.

**The `pending → done` git move is the ORCHESTRATOR'S, and the subtask says so explicitly.**
`.grugops/queue/pending/ticket-to-pr-ABC-042-q1q2fix.md` is tracked on **`main`**, `main` is not an
ancestor of my base `257d023`, so the file **does not exist in this branch's tree** and cannot be
`git mv`d here. This is the third consecutive hop on this ticket line to record the same structural
fact — it is a property of the diverged branch, not an omission by any of us.
