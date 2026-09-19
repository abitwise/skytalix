---
id: 20260919T173300Z-qe-e2e-artifact-ref-abc107-qe-branch-commands-and-scratch-scripts-02f2e2aa
kind: artifact-ref
by: qe-e2e
at: 2026-09-19T17:33:00Z
verified_by:
confidence: high
refs:
  - ABC-107
  - ADR-0022
  - src/frame.overflow-bound.test.ts
  - plans/traceability.md
  - plans/tickets/ABC-107-the-message-region-cannot-show-a-seven-candidate-ambiguity.md
  - .grugops/queue/done/qe-ABC-107/qe-ABC-107.md
supersedes:
---

# `ABC-107` QE hop — the branch, the commands, and where the raw runs are

Branch **`grugops/qe-ABC-107`**, created from `grugops/wave-2026-09-19` @ `fb9a740` in an isolated
worktree (`node_modules` symlinked read-only from the main checkout). **Unmerged; no remote; not
deployed.** The QE commit carries state only — the four notes in
`.grugops/context/qe-ABC-107/notes/`, one appended trace row plus one header line in
`plans/traceability.md`, § QE on the ticket page, and the subtask file moved `claimed/` → `done/`.
**Nothing under `src/` is in the diff** (`git diff --numstat grugops/wave-2026-09-19` — the
report carries the listing).

Not a UAT spec, so no `sha` / `gate_run` / `content_hash` triple is carried — the same shape as
every prior hand-authored `artifact-ref` on this install.

## Commands run (all at the tip, all with numbers in the sibling `decision`)

`npm run lint`; `npm run typecheck`; `npm run build`; `npx vitest run --dir src`;
`npx vitest run --dir src --reporter=json --outputFile=…` (skip count);
`node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`;
`npx vitest run src/frame.overflow-bound.test.ts`; `SEARCH_DEEP=1 npx vitest run src/search.test.ts`;
`git diff --name-only a5a9178~1 a5a9178 | grep -v '\.test\.ts$' | grep '^src/'` (empty);
18 mutant runs of `npx vitest run src/frame.overflow-bound.test.ts --reporter=json` with
`git checkout -- <file>` and `git status --porcelain -- src` after each (ledger in the sibling
`observation`); one whole-lane `--dir src --reporter=json` for the survivor `M7`.

## Scratch scripts (session scratchpad, NOT committed — reproduce from the ledger, not from these)

`gates-qe107.js` (the gate sequence, JSON summary), `mutants-qe107.js` + `mutants2b-qe107.js`
(the 18 mutants as exact-string edits with revert-and-assert-clean), `probe-qe107.mjs` (fixture
messages, `W`, wider-frame sweep through the real pipeline). Their content is fully described by
the ledger's `mutant` column; nothing in them is load-bearing beyond that.
