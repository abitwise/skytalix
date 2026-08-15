---
id: 20260815T113400Z-qe-e2e-artifact-ref-branch-method-and-what-was-not-produced-c17b3e90
kind: artifact-ref
by: qe-e2e
at: 2026-08-15T11:34:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - src/cli.test.ts
  - .grugops/context/quality-gate-ABC-042/
supersedes: 
---

# What this gate produced, by reference — and the method, so it can be re-run against me

## Branch

- **`grugops/quality-gate-ABC-042`**, cut from the engineer's tip **`8b07d9f`** (not from `main`).
  `main` is at `8dbc3db` and was **never checked out**; `8b07d9f` is **not** an ancestor of it.
- **Worktree, not a checkout in the shared tree.** A Security/NFR hop is live in this repository off
  the same tip; a second checkout would have fought it for the working directory. `node_modules` was
  symlinked in for the run and **removed before finish**.
- **No push, no PR, no merge, no deploy.** This repo has no remote.

## Files changed by this hop

| file | change |
|---|---|
| `src/cli.test.ts` | **three existing rows strengthened.** `A6(i)`'s near misses move `--colour` into its legal two-token argv position; `A9`'s row gains the entry point's whole process surface transcribed plus a bracket-access guard; `A2`'s row gains `globalThis`. **Zero new tests (29 → 29), zero new spawns, zero production bytes** |
| `.grugops/context/quality-gate-ABC-042/notes/` | **eight notes** (5 `observation`, 2 `decision`, 1 `artifact-ref`), hand-authored per `agent-factory/contracts/context-note.md` |

**`src/cli.ts`, `src/cli-options.ts` and `src/history-pane.nfr.test.ts` are byte-identical to
`8b07d9f`** at this hop's tip. Every mutation was reverted with `git checkout -- src/` and
`git status --porcelain` was verified clean after each batch.

## Commands run, and what they returned

```
git diff --name-only e140355~1 e140355        6 paths, exactly A12's
git rev-parse 8dbc3db:<module> vs e140355:<module>   18/18 production modules IDENTICAL
npm run lint                 PASS  54 files, no fixes, 2 pre-existing infos
npm run typecheck            PASS  tsc --noEmit, rc 0
npm run build                PASS  tsc --noEmit, rc 0
npm test                     PASS  856/856 on 30 files
npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'   ->  0
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0
                             PASS  "No findings.", exit 0
PERFT_DEEP=1 npx vitest run src/perft.test.ts   PASS  32/32, 8 deep counts exact, 36.2 s
npm run chess                exit 0, 23-row frame, max code point 0x76, no ESC-[
node src/cli.ts --colour white|black|random|--unicode   orientation + glyphs verified by hand
```

All of the above were re-run **with the armed `src/cli.test.ts` in place** and returned the same
results — the gate is green on the state this branch carries, not only on the delivered state.

## Method, stated so it is reproducible and attackable

- **Mutation harness** (`mutate.mjs` + `run-mutants.sh`, in the session scratchpad, deliberately
  **outside the repo**): each mutant is an anchored string replacement that **aborts if its anchor is
  not found**, so a silently-unapplied mutation can never be scored as "killed". `git diff
  --name-only` is printed after every application to prove the mutation is on disk. `timeout 180` per
  run. `git checkout -- src/` between mutants.
- **20 mutants**, 14 killed, 5 survived, 1 hung. Full table in
  `…observation-twenty-mutants-and-the-five-that-lived-3e9b02d7`.
- **Import-closure analysis** for the `PERFT_DEEP` ruling: runtime (value) edges and `import type`
  edges computed **separately**, because a type-only edge is erased and reaches nothing at runtime.
- **`N8-LANE`**: 4 conditions × 8 rounds, order rotated per round, round 0 discarded, CPU =
  `user + sys` from `/usr/bin/time -p`, **with a byte-identical rerun as the identity null control**
  and the per-file floor **measured** rather than imported.
- **`A10` was checked against real git** (`git show 8dbc3db:package.json`), not against the suite's
  transcription — a deliberately different instrument from the engineer's, so the two are independent.

## Not produced, deliberately

`plans/board.md` (the Orchestrator's), `plans/traceability.md` (the Orchestrator's — the `ABC-042`
row is still owed, their `G3`), the **ticket page** (BA/PM's; ticking criteria is theirs),
`plans/nfr-catalog.md` and `ADR-0008` (**owner-ratified — not opened for writing**),
`.grugops/test-skips.md` (**human-owned — read and run against, never written**), `plans/metrics.md`,
any ADR, and **any `kind: finding` or `§14-gate#<id>` stamp** — none is emittable on this install and
none was invented.

## The queue record, and the move that is owed

The **atomic claim** was taken by hand in the **main** working tree per `AGENTS.md` § Role / workflow
files: `mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of
`.grugops/queue/claimed/quality-gate-ABC-042/` — that bare `mkdir` is the atomic act, and it
returned success, so the claim is mine and was not lost.

**The `pending -> done` git move is OWED TO THE ORCHESTRATOR**, for the reason the
`quality-gate-ABC-041-regate` hop recorded before me and which I verified still holds:
`.grugops/queue/pending/quality-gate-ABC-042.md` is tracked on **`main`**, and `main` is **not** an
ancestor of this branch's base `8b07d9f`, so the file does not exist in this branch's tree and cannot
be `git mv`d here. The `claim.md` / `done.md` registry pair is written into the **main** repo's
working tree and left **untracked**.
