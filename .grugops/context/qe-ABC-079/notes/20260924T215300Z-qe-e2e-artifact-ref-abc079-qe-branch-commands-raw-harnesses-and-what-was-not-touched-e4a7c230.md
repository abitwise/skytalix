---
id: 20260924T215300Z-qe-e2e-artifact-ref-abc079-qe-branch-commands-raw-harnesses-and-what-was-not-touched-e4a7c230
kind: artifact-ref
by: qe-e2e
at: 2026-09-24T21:53:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - plans/tickets/ABC-079-quiescence-search-on-captures.md
  - plans/traceability.md
  - .grugops/queue/done/qe-ABC-079.md
supersedes:
---

# `ABC-079` QE: the branch, the commands, the raw harnesses, and what was not touched

**Branch.** The branch is **`grugops/qe-ABC-079`**, created from `grugops/int-ABC-079` @
`6b7b2c8`. That base is the wave branch plus `grugops/ABC-079-quiescence-rehop2`. It is
unmerged, nothing was pushed, and nothing was deployed.

**Diffs.** The delivered diff under test is `git diff 4f0ef01 6b7b2c8`, restricted to the
ticket's seven files: 898 insertions and 74 deletions. The same seven files diffed from
`33b9a02` to `6b7b2c8` are EMPTY, so the integrated base carries the build byte for byte.

**This branch's commit.** It carries these notes and `raw-*.txt`, the trace row, the ticket's
§ QE section and the queue move. It holds **nothing under `src/`**. The hand-back quotes
`git diff --numstat 6b7b2c8..HEAD` as the measurement.

## Commands, each through a node script (`raw-harness-*.mjs.txt`)

- **Gates:** `gates.mjs` runs `npx biome check .`, then `npx tsc --noEmit` twice (the typecheck
  slot and the build slot). It then runs `npx vitest run --dir src`, with the JSON reporter for
  the skip count, and `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md
  --skip-count 0`.
- **Deep lanes:** `lane.mjs` runs `SEARCH_DEEP=1 npx vitest run src/search.test.ts`, `SEARCH_DEEP=1
  npx vitest run src/quiescence.test.ts` and `ENGINE_DEEP=1 npx vitest run src/engine.test.ts`, in
  sequence and in the background. `chain.mjs` drives the order.
- **Mutants:** `mutants.mjs` (13 mutants, stages P/A/B/C) and `kscan.mjs` (the K gate). The
  follow-ups are `q7check.mjs`, `q7row.mjs` and `bruteprobe.mjs` (D3/D4 evidence). The last of
  those was run twice: the first run's kiwipete arm ran away and was killed, `src/quiescence.ts`
  was restored by `git checkout`, and porcelain was confirmed empty. The rerun is restricted to
  `startpos` and `position-3`.
- **Readings:** `post.mjs` runs `e2e.mjs` (`node src/cli.ts`, one game as white and one as black),
  `nfr.mjs` (`chooseMove` at 3 s, 3 × 6), `hanging.mjs` (the `A1` corpus parsed from the test
  file, d1–d3 and at the default budget), `NFR-008` × 3 and `A4` alone × 2. `A7` alone was run
  separately.
- **Vitest probe:** `sync-timeout.test.mjs` is a scratch test in the session scratchpad, NOT in
  the repository. It shows vitest 3.2.7 fails a synchronous test that overran its timeout, and
  does so after the test returns.

## Raw outputs (`raw-out-*.txt`)

- `gates-summary.json`
- `deep-{search,quiescence,engine}.json` and `.shares.json`
- `probe-clean.json`
- `kscan.json`
- `mutants-{r2,q}.json`
- `mutant-ledger.txt`
- `q7check.txt`
- `q7row.log`
- `bruteprobe.json`
- `hanging.json`
- `nfr.json`
- `e2e-{white,black}.txt`
- `nfr008-{1,2,3}.json`
- `a4alone-{1,2}.json`
- `a7alone.json`
- `sync-timeout.txt`

## Not touched, on purpose

- `src/**`: every mutant was reverted, and QE wrote no test and no production line.
- `src/command-input.*` and `src/line-input.*` (`ABC-046`'s live re-hop). Not opened.
- `plans/board.md`, `AGENTS.md` and `plans/nfr-catalog.md`. Not opened.
- `.grugops/test-skips.md`: human-owned; it was read by the checker and never written.
- `NFR-008` was not ruled (fence).

## State this hop wrote

- `.grugops/context/qe-ABC-079/notes/*`: four notes and the `raw-*.txt` files.
- `plans/traceability.md`: one `_Updated:` line prepended and one row `ABC-079 (qe)` appended.
  Nothing was touched in place.
- `plans/tickets/ABC-079-…md`: § QE appended.
- `.grugops/queue/{pending → claimed → done}/qe-ABC-079*`, claimed by hand per Workflow 17.

The board move and the routing of G1/G2 to Architect/Design belong to the Orchestrator.
