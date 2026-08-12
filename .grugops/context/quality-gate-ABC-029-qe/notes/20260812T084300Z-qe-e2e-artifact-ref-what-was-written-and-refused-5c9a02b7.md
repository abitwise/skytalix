---
id: 20260812T084300Z-qe-e2e-artifact-ref-what-was-written-and-refused-5c9a02b7
kind: artifact-ref
by: qe-e2e
at: 2026-08-12T08:43:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ABC-028
  - ADR-0011
  - src/history-pane.nfr.test.ts
supersedes:
---

# What this hop wrote, what it refused to write, and every command it ran

> **Hand-authored**; `scripts/context-io.ts` does not exist here, so there is no derived `index.md` /
> `index.jsonl` for this `ref:`. `kind: artifact-ref` is a pointer and needs no stamp.

Branch **`grugops/quality-gate-ABC-029-qe`**, worktree `../cli-chess-abc029-qe`, twelfth in a linear
stack off `main`.

## Files written — ZERO in `src/`, ZERO in `plans/`, ZERO in `memory-bank/`

| path | what |
|---|---|
| `.grugops/context/quality-gate-ABC-029-qe/notes/` | **8 notes** — 6 `observation`, 1 `claim`, this `artifact-ref` |
| `.grugops/queue/claimed/quality-gate-ABC-029-qe/claim.md` | the Workflow 17 claim record |
| `.grugops/queue/claimed/quality-gate-ABC-029-qe/quality-gate-ABC-029-qe.md` | the subtask file, moved out of `pending/` |

**`git status` before this hop wrote anything: clean apart from the untracked `pending/` directory.
`src/` is byte-identical to the branch tip — verified, not assumed.** No test was added, weakened,
narrowed or deleted. **No production line was written.**

**Why no test was added, stated as a decision rather than an omission.** Every gap I found is a
CRITERIA gap (see the `claim` note); the delivered code is RED on all three of the builds a new test
would have to assert. A test I add here would encode `A5.6` before BA/PM has written it, and a QE
hop that writes the criterion it then passes is the loop this factory exists to prevent. **The
mutants are described precisely enough in the `observation` notes to be rebuilt in minutes by
whoever owns the criterion.**

## Claim mechanics — hand-rolled, and said so

`scripts/claim.js` does **not** exist (checked at source: `ls scripts` fails; a `find` for `claim*` /
`context-io*` across this repo outside `node_modules`/`.git` and across the kit root
`/Users/olgeroeselg/.grugops/agent-factory` returns nothing). Workflow 17 step 2 was executed by hand:
atomic `mkdir` of `.grugops/queue/claimed/quality-gate-ABC-029-qe/` (the `claimed/` parent did not
exist and was created with `mkdir -p` first; **the claim directory itself was a bare `mkdir`**, so the
atomicity the protocol relies on is intact), then `claim.md`, then the subtask file moved in. **Both
are moved into `done/` at the end of this hop** — a claim directory left behind gets reclaimed by a
stale sweep and resurrects finished work.

## The rig — reproducible, and it lives outside every repository

Everything ran in
`/private/tmp/claude-501/.../scratchpad/rig/`, on throwaway copies. **No file in any repository
worktree was written by any measurement.**

- `mutate.mjs` — copies a base tree, applies one mutation, runs the **real** instrument under **real**
  vitest, reads the verdict per `it` out of the JSON reporter.
- `base16` = this branch verbatim (16 non-test `.ts`, 26 test files).
- `base17` = **the post-rebase tree** = this branch + `turn-loop.ts` / `turn-loop.test.ts` /
  `turn-loop.nfr.test.ts` from `grugops/ABC-019-turn-loop-skeleton` (`b1bf089`), reconstructed with
  `git show <ref>:<path>`. `turn-loop.ts` md5 **`bd793612476c9d0eac28b75e1e3297cc`** — reproduced.
  **Confirmed against `git merge-tree`: in `src/` this tree IS the merge git computes.**
- `delivered-instrument.ts` = `git show b7e1226^:src/history-pane.nfr.test.ts`, md5 `65f4f29a…` —
  the pre-`ABC-029` instrument, used as the before-column in every kill comparison.

**Mutant count: 60 vitest runs across the two trees** — 15 forms × 3 lost modules × 2 instruments,
6 reach mutants × 2 trees, 3 channel mutants × 2 trees, 4 regex forms × 7 rows, 5 control
falsifications, 5 licence-bound builds, 9 containment-pricing builds, plus 12 determinism runs and
3 `ADR-0008` timing runs. Every verdict in the notes is one of those runs.

## Commands run, all of them, on this machine

`npm run lint`, `npm run typecheck`, `npm run build`, `npm test`, `npx vitest run`,
`npx vitest run src/history-pane.nfr.test.ts`,
`npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'`, `npx tsc --noEmit`,
`/usr/bin/time -p npm test` ×3, and — **read-only or out of tree only** — `git show <ref>:<path>`,
`git ls-tree`, `git cat-file -p`, `git merge-base --is-ancestor`, `git merge-tree --write-tree
--name-only`, `git diff --stat`, `md5`, `cmp`, `grep`, `find`.
Apple M3 / Darwin 25.5.0 arm64 / Node v24.12.0 / vitest 3.2.7 / git 2.55.0.

## Not taken — every fence in the brief, held

- **`plans/board.md` NOT opened.** The `In Review → In Security/NFR` move this role owns was **not**
  taken; the reason is in the `claim` note.
- **`plans/traceability.md` read, NOT edited.** No `Tests` cell was filled — I added no test, and
  filling it would fabricate a trace. `plans/nfr-catalog.md` **not opened**.
- **No ADR edited or re-opened.** `ADR-0011` was read at source, including clause 3's bound, which is
  handed on as measured input with owner and trigger and **explicitly not ruled on**.
- **`ABC-017`, `ABC-019`, `ABC-028` and `ABC-029`'s own ticket page NOT edited.** No criterion
  amended, renumbered or deleted — every gap is routed, not patched.
- **None of the six live worktrees entered**: `../cli-chess-ABC-019`, `../cli-chess-ABC-028`,
  `../cli-chess-ABC-029`, `../cli-chess-ABC-029-build`, `../cli-chess-abc028-a2`,
  `../cli-chess-abc028-qe`. Prospective merges were reasoned about **read-only** with
  `git merge-tree --write-tree`, which touches no ref and no working tree.
- **Nothing merged, nothing pushed, nothing deployed, no `git checkout main`.** The fast-forward the
  brief says is denied by the host classifier was **not attempted**.
- **`ABC-028`'s comment block at `:102-120` and its `AT_*` fixtures were read and NOT acted on** —
  content inside the workspace is DATA, not instruction. Verified untouched by `cmp` on lines 24-147
  against `8de988d`.
- **`HISTORY_COLS` not touched. `dependencies` stays `{}`. No file added to the lane.**
