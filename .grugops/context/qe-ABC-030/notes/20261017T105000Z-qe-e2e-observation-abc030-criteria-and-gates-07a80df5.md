---
id: 20261017T105000Z-qe-e2e-observation-abc030-criteria-and-gates-07a80df5
kind: observation
by: qe-e2e
task: qe-ABC-030
at: 2026-10-17T10:50:00Z
verified_by:
confidence: high
refs:
  - ABC-030
  - plans/tickets/ABC-030-nfr-justification-comments-cite-a-live-sibling-count.md
  - src/status-panel.nfr.test.ts
  - src/gameend.nfr.test.ts
  - src/san.nfr.test.ts
  - src/zobrist.nfr.test.ts
supersedes:
---

# ABC-030 criteria and gates, re-measured by QE (tip `e0f8b617`, code `bc185f83`, base `b84dc637`)

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). Every reading below
was taken by QE **before** opening `.grugops/context/ticket-to-pr-ABC-030/notes/`. The run was width 3, beside
the SE hops on `ABC-040` and `ABC-024`. No timing reading was taken.

**Fences.** The md5 values at base match the 2026-10-12 re-score table: status-panel `b1c1998e…`, gameend
`5be6c34f…`, san `5da32d6a…`, zobrist `bb4d52be…`. At the tip zobrist is still `bb4d52be580364fb33e50b4845c4767d`,
so 0 lines changed there.

| criterion | command (run by QE) | reading | ruling |
|---|---|---|---|
| `A1` | `/usr/bin/grep -nE 'all [0-9]+ tests there' src/zobrist.nfr.test.ts src/status-panel.nfr.test.ts` | base: 1 hit (`status-panel:11`), exit 0. Tip: 0 hits, exit 1 | **MET** |
| `A1` mechanism | read `status-panel:10-12` and `gameend:12-14` | both say *"a `vi.mock` factory is hoisted to file scope"* and *"re-route the module graph for every test there"*. The argument survives; nothing is reduced to "in its own file" | **MET** |
| `A2` grep | `/usr/bin/grep -nE 'all [0-9]+ tests there\|the [0-9]+ rows in' src/*.ts` | base (`git grep` at `b84dc637`): 3 hits, `gameend:13`, `san:19`, `status-panel:11`. Tip: 0 hits, exit 1 | **MET** |
| `A2` numstat | `git diff --numstat b84dc637 bc185f83` | `1 1` each for `src/gameend.nfr.test.ts`, `src/san.nfr.test.ts`, `src/status-panel.nfr.test.ts`; nothing else. Base..tip under `src/` gives the same three files | **MET** |
| `A2` comment-only | read each hunk against the header block | each changed line is a ` * ` line inside the opening `/** … */`, which closes at status-panel `:13` (edit at `:11`), gameend `:18` (`:13`) and san `:27` (`:19`) | **MET** |
| `A3` counts | `npx vitest run --reporter=json \| jq -r '.testResults[] \| "\(.assertionResults\|length) \(.name)"' \| sort -k2`, root prefix stripped | **base was run from a `git archive b84dc637` export in QE scratch, independent of the worktree**; the tip was run in `wt-ABC-030`. `cmp` 0, 58 lines, 1792 each side, 0 pending, 0 todo, success true both. Beyond the criterion, all 1792 `file \t fullName \t status` triples are byte-identical (`cmp` 0), so nothing was renamed either | **MET** |
| `A4` | read the three repaired sentences | `"every test there"` ×2 and `"every one of the rows in \`san.test.ts\`"` contain no integer. Dated witness `gameend:8` kept per test note 2 and the re-score | **MET** (sentence-scoped reading — see `QE-030-a`) |

Sibling counts by the runner at the tip: status-panel.test 29, gameend.test 45, san.test 22, zobrist.test 32.
The `.nfr` files have 6, 3, 5 and 3 tests.

**Gates on the tip** (`node_modules` symlinked from the main checkout after `cmp` 0 on `package.json` and
`package-lock.json`; the link is removed before handoff):

- `npm run lint` exit 0 (113 files)
- `npm run typecheck` exit 0
- `npm run build` exit 0
- `npm test` exit 0: 58 files, 1792 passed
- `.test-results/last-run.json`: success true, 1792 total, 0 failed, 0 pending, 0 todo
- skip count (`numPendingTests + numTodoTests`) is 0
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` reports `No findings.`, exit 0

**Merge readiness.** `git merge-tree --write-tree main e0f8b617` exits 0, so the merge is clean. `main` moved by 3
board-only commits since base, and none touches `src/` or this page.

**UAT-waiver reading.** All three forms are empty (exit 1):

- `git diff --name-only b84dc637...e0f8b617 | grep -v '\.test\.ts$' | grep '^src/'` (the brief's form)
- `bc185f83~1 bc185f83` (`AGENTS.md`'s form, delivered = the code commit)
- `e0f8b617~1 e0f8b617`

Zero production lines, so the 2026-08-17 waiver applies.
