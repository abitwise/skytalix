---
id: 20261012T062637Z-qe-e2e-artifact-ref-abc116-recheck-commands-and-gates-43bb8876
kind: artifact-ref
by: qe-e2e
task: qe2-ABC-116
at: 2026-10-12T06:26:37Z
verified_by:
confidence: high
refs:
  - ABC-116
  - A5
  - A6
  - src/cli.test.ts
  - plans/tickets/ABC-116-record-the-t2-re-measure-trigger-where-a-hop-will-meet-it.md
  - plans/traceability.md
supersedes:
---

# QE re-check `ABC-116`: the commands and gates, at tip `ffe52710`

**Where it ran.** Worktree `../cli-chess-example-qe2-ABC-116` on `grugops/qe2-ABC-116`, off
`ffe52710`, with `node_modules` symlinked. The worktree is removed at the end of the hop.
`grugops/ABC-116-t2-carrier` was not touched. No timing readings were taken; none were owed.

## Gates at `ffe52710`, run in this order

- **`node tools/grugops/host-protection.js`: exit 2.** All lines read `UNKNOWN - verify`, because `gh`
  returned no readable HTTP status. The repository has no git remote. This is not a pass, and it
  changes nothing here.
- `npm run lint`: exit 0. Biome checked 107 files, no fixes applied.
- `npm run typecheck`: exit 0.
- `npm run build`: exit 0.
- **`npm test`: exit 0.** 56 files and 1743 tests, all passed. `.test-results/last-run.json` reads
  `success: true`, `numFailedTests` 0, `numPendingTests` 0, `numTodoTests` 0.
- **Skip count.** `npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'`
  returns `0`.
- **Integrity.** `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`
  prints `No findings.` and exits 0.
- **Not run.** The opt-in deep lanes, because the change is 28 comment lines under `src/` and touches
  no file on any trigger list. Acceptance and e2e are `UNKNOWN - verify` per `AGENTS.md`.

## The UAT-waiver reading, measured

`git diff --name-only <a> <b> | grep -v '\.test\.ts$' | grep '^src/'` returns 0 lines on each of:
- `HEAD~1..HEAD` (`ffe52710`);
- `be6882b8~1..be6882b8`;
- `3c38a8ea..HEAD`;
- `main...HEAD`.

So the waiver applies. It is not a signature.

## The fence commands

All were run against `3c38a8ea`. The readings are in note `…a0f3e853`.
- `git diff --name-only|--numstat 3c38a8ea HEAD -- src/` and the same with `':!src/*.test.ts'`.
- `git diff -U0 3c38a8ea HEAD -- src/`, filtered for `+`/`-` lines not starting `*` or `//`.
- `git diff --numstat 3c38a8ea HEAD -- plans/nfr-catalog.md AGENTS.md plans/board.md`.
- `grep -E '^\| NFR-00[1-8] \|' plans/nfr-catalog.md | shasum -a 256` at base (`git show`) and at tip.
- `grep -n 'const N8_SPAWN'` at both, plus a `cmp` of the non-comment pin lines and a hash of the
  `CHILDREN` block.
- `git diff -M --name-status 2aaccaf4 HEAD`, `git ls-files '*.log'`, `git check-ignore --no-index`,
  and `git show --name-status d39618d1`.

## Written by this hop

- These three notes.
- A dated addendum at the end of the ticket's `## QE`.
- One row at the end of `plans/traceability.md`.
- Nothing under `src/`, and nothing in `plans/board.md`, `plans/nfr-catalog.md` or `AGENTS.md`.
