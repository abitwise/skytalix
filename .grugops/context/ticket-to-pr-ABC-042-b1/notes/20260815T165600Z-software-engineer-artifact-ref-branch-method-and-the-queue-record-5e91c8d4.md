---
id: 20260815T165600Z-software-engineer-artifact-ref-branch-method-and-the-queue-record-5e91c8d4
kind: artifact-ref
by: software-engineer
at: 2026-08-15T16:56:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - B1
  - src/cli.test.ts
  - .grugops/context/ticket-to-pr-ABC-042-b1/
  - .grugops/queue/claimed/ticket-to-pr-ABC-042-b1/
supersedes: 
---

# Branch, base, files, method, and the queue move I do NOT own

## Branch and base

- **Branch:** `grugops/ticket-to-pr-ABC-042-b1`
- **Base:** `grugops/refinement-ABC-042-a6-nearmiss` @ **`59ea767`** — BA/PM's tip, as instructed.
- **`main` is NOT an ancestor of my base and was NOT merged in.** Verified with
  `git merge-base --is-ancestor main grugops/refinement-ABC-042-a6-nearmiss` **before** branching (it
  reports not-an-ancestor, which is the expected answer). The branch was cut from the SHA.
- **The subtask file lives on `main`** (`.grugops/queue/pending/ticket-to-pr-ABC-042-b1.md`) and is
  absent from this tree. **It was read before branching**, as the subtask requires.
- **Security/NFR's `S1`–`S3` notes are on no branch I hold**: they live only on
  `grugops/security-nfr-ABC-042-gate`, which is not an ancestor of my base either. They were read with
  `git show grugops/security-nfr-ABC-042-gate:<path>` — **a read, not a merge**.
- **Worktree, not a branch switch.** I worked in `../cli-chess-dev042b` (a `git worktree`) so the `main`
  checkout stayed on `main` for the Orchestrator and so the **concurrent Architect/Design hop** could not
  collide with me. `node_modules` is symlinked from the main checkout — no reinstall, identical bytes.
- **No push, no PR, no merge, no deploy.** This repository has no remote.

## Files this hop changed

| file | change |
|---|---|
| `src/cli.test.ts` | **four existing rows repaired, +71 / −19, one file.** `A6`(i)'s near-miss family (138 cases / 134 distinct, both pinned), `A6`(ii)'s 500-draw budget, bar 3's located token (`S2`), the literal scan's template-literal alternation (`S3`). **Zero new tests (29 → 29), zero new spawns (10 → 10), zero production bytes** |
| `.grugops/context/ticket-to-pr-ABC-042-b1/notes/` | **eight notes** (4 `observation`, 3 `decision`, 1 `artifact-ref`, **0 `finding`**), hand-authored per `agent-factory/contracts/context-note.md` |
| `.grugops/queue/claimed/ticket-to-pr-ABC-042-b1/claim.md` | the now-running registry record |

**`src/cli.ts`, `src/cli-options.ts` and `src/history-pane.nfr.test.ts` are byte-identical to my base by
md5 AND git blob SHA**, re-checked *after* the mutation census. All 18 merged production modules are
identical to `main@8dbc3db` by blob SHA, 18/18. Hashes are in the gate note.

## Commands run, and what they returned

```
git merge-base --is-ancestor main grugops/refinement-ABC-042-a6-nearmiss   NOT an ancestor (expected)
npm run lint                  PASS  54 files, no fixes, 2 infos (both on biome.json), rc 0
npm run typecheck             PASS  tsc --noEmit, rc 0
npm run build                 PASS  tsc --noEmit, rc 0
npm test                      PASS  856/856 on 30 files
npx vitest run src/cli.test.ts                                            PASS  29/29
npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'  ->  0
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0
                              PASS  "No findings.", exit 0
PERFT_DEEP=1 npx vitest run src/perft.test.ts     PASS  32/32, 8 deep counts exact, 36.80 s
git rev-parse <commit>:<file>                     production blob SHAs, three commits, identical
md5 -r src/cli.ts src/cli-options.ts src/history-pane.nfr.test.ts   unchanged from pre-work capture
```

## Method, stated so it can be re-run against me

- **The family was measured BEFORE the row was written** — 138 / 134 / 4 duplicates / 0 accepted by the
  delivered resolver — by calling `resolveOptions` directly from a scratchpad script. The row was written
  to match a measurement, not the other way round.
- **Mutation harness** (`census.mjs`, `census-s.mjs`, `m17.mjs`, `lane.sh`, in the session scratchpad,
  deliberately **outside the repository**): anchored replacements that **abort unless the anchor occurs
  exactly once**, the mutation proved on disk with `git diff --name-only` before each run, `timeout 180 s`
  per run.
- **Plus the INSTRUMENT guard, which is `E4`'s lesson applied rather than quoted.** The instrument was
  **committed first**; every mutant application proves the row's markers **and the file's md5** before AND
  after; restore is a **byte copy from a pristine capture, never `git checkout -- src/`**; `git status
  --porcelain src/` asserted empty after every mutant. **22 mutant runs, tree clean at the end, all three
  production hashes unmoved.**
- **Both directions, always.** Every mutant was run against **both** the base instrument and mine, so a
  kill is attributable to my row rather than to something else in the file.
- **`N8-LANE`**: 3 conditions × 8 rounds, order rotated per round, round 0 discarded, CPU = `user + sys`
  from `/usr/bin/time -p`, with a **byte-identical rerun as the identity null control** and a per-run
  guard proving which variant was on disk.
- **`PERFT_DEEP` reachability**: settled by blob SHA over every production module plus a check that the
  diff adds **no import statement**, then run anyway.

## Not produced, deliberately

`plans/board.md` and `plans/traceability.md` (**the Orchestrator's — reserved on this ticket for the
fourth time, and the subtask says the resulting move is not a gap I must report**), the **ticket page**
(BA/PM's, and it was just repaired), `plans/nfr-catalog.md` and `ADR-0008` (**owner-ratified — not opened
for writing**), `.grugops/test-skips.md` (**human-owned — read and run against, never written**),
`src/history-pane.nfr.test.ts` and `ADR-0011` (**`A12` bounds the first; both are Architect/Design's and
its hop is live on its own branch**), `plans/metrics.md`, any ADR, and **any `kind: finding` or
`§14-gate#<id>` stamp** — none is emittable on this install and none was invented.

**File-set disjointness with the concurrent Architect/Design hop, checked rather than assumed:** it owns
`ADR-0011`, `src/history-pane.nfr.test.ts` and the `Q3`/`G6`/`E2` rulings; I own `src/cli.test.ts` and
my own context folder. **No path appears in both sets**, and my worktree means we never shared a checkout.

## The queue record, and the move that is the Orchestrator's

The **atomic claim** was taken **by hand** per `AGENTS.md` § Role / workflow files and the subtask:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` (no `-p`) of
`.grugops/queue/claimed/ticket-to-pr-ABC-042-b1/`. That bare `mkdir` is the atomic act; it returned
success, so **the claim is mine and was not lost**. `claim.md` was written inside it. `scripts/claim.js`
is absent from this repository and from the kit, so `claimTask` / `transition` were not called and were
not faked.

**The `pending → claimed → done` git move is the ORCHESTRATOR'S, and the subtask says so explicitly.**
`.grugops/queue/pending/ticket-to-pr-ABC-042-b1.md` is tracked on **`main`**, `main` is not an ancestor
of my base, so the file **does not exist in this branch's tree** and cannot be `git mv`d here. This is the
fourth consecutive hop on this ticket line to record the same structural fact — it is a property of the
diverged branch, not an omission by any of us.
