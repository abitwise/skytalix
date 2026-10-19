---
id: 20261019T152100Z-security-nfr-observation-abc173-named-risks-ruled-and-skip-count-silent-zero-f3757b98
kind: observation
by: security-nfr
task: secnfr-ABC-173
at: 2026-10-19T15:21:00Z
verified_by:
confidence: high
sealed: false
refs:
  - ABC-173
  - ADR-0008
  - NFR-010
  - RISK-ABC173-TEARDOWN
  - RISK-ABC173-STATE
  - RISK-ABC173-PUZZLE
  - RISK-ABC143-01
  - SEC-173-1
  - QE-173-d
  - .grugops/context/secnfr-ABC-173/probe/skipzero.out
supersedes:
---

# `ABC-173`: the addendum's three named risks, ruled acceptable (LOW, each with an owner). One new LOW observation: an unprefixed skip-count capture prints a silent `0`

Hand-authored and unsealed. Sources: `ADR-0008` § ADDENDUM 2026-10-19 § Risks, plus the SE's census and peaks
(branch note `…4b2e8f61`), QE `…6b0e2f58` / `…3d7a91c4`, and this hop's reading of `heap-guard.js` at `9c97dd23`.

## `RISK-ABC173-TEARDOWN`: **acceptable, LOW**. Owner: Architect/Design (the table). The level stays the owner's
- **Restated:** the SUITE row counts 2 still-terminating workers as a reserve. That count is observed, not
  source-bound: vitest 4.1.11 starts the next file at `testfileFinished` and does not await termination
  (`cli-api…js:3494`, `:3547`). If more than 4 workers are ever live at once, Σ goes over 2048 MiB by construction.
- **Evidence:** at most 4 live workers in 3 of 3 censuses (Architect 2, SE 1, all at flag 128). That is exactly the
  reserve, with no headroom.
- **Why it is acceptable:** the row bounds **limits**, not use. The highest sampled `heapUsed` in a SUITE-shape run
  was a worker at 109 MiB under coverage, against a 224 MiB limit. One extra live worker adds 224 MiB to the arithmetic Σ, and nothing here shows actual heap
  near 2 GB.
- **Trigger:** any census over 4 goes to the owner, and so does any vitest version change. Re-read with
  `probe/pre.mjs` + `analyze2.mjs`.

## `RISK-ABC173-STATE`: **acceptable, LOW**. Owner: Security/NFR (re-read at any vitest bump; `RISK-ABC143-01`'s class)
- **Restated:** the shape comes from `project.vitest.state.getPaths().length`, a public getter that is not
  documented as stable.
- **Fails closed** (read from `admit()` and pinned by the `A5` "cannot look" row at `9c97dd23`) in these cases:
  `getPaths` missing; no `vitest`; no project; a non-array result; 0 files.
- **Stated plainly, the residual fail-open direction:** if a future vitest made `getPaths()` **under-count** a
  multi-file run as 1, the ONE-FILE row (496) would admit a SUITE run. The `A5` rows use a stub project, so they would
  not notice. Two things bound it:
  - every spelled SUITE command still carries flag 128 (`A3`, `A10`), so the as-spelled lanes stay at 224 MiB;
  - only a SUITE run typed at the ONE-FILE flag would get through, at 9 × 496 = 4464 MiB.
- **The opposite drift** (a one-file run over-counted) refuses every `*_DEEP` lane loudly.
- **Trigger:** at any vitest version change, re-read `getPaths().length` as the addendum's V4 probe did (1 file reads
  1, the `src/search` filter reads 5, the suite reads 59) before the bump merges.

## `RISK-ABC173-PUZZLE`: **acceptable, LOW**. Owner: Security/NFR (the row). Any re-level is the owner's word (Q4)
- **Restated:** `PUZZLE_DEEP` is red at 224 MiB ("Worker exited unexpectedly", 2 of 2) and green at 256 / 292 / 336 /
  496 MiB. Its row is ONE-FILE, 496 MiB.
- **Evidence:** the SE's sampled peak `heapUsed` was 198 MiB in the worker, against 496 (`…4b2e8f61`). QE read it
  green as spelled, 18/18.
- **One correction to the addendum's wording; this is not a defect.** The addendum says *"Running it in a SUITE-shape
  command is refused by the guard."* That holds only when the SUITE-shape command carries the ONE-FILE flag. Two
  cases differ:
  - `PUZZLE_DEEP=1 npm test` carries flag 128, and 224 ≤ 224, so `admit()` lets it in. By the addendum's own
    224 MiB reading, the puzzle file should then go **red** with a worker exit, not pass. This comes from the code
    and that reading. It was not re-run here: `UNKNOWN - verify`.
  - No `AGENTS.md` line spells that command.
- **Why it is acceptable:** either way the failure is loud, never a silent pass, and no row is resized. Margin by
  limit: about 1.9× over the smallest green reading. Margin by sampled peak: about 2.5×.

## `SEC-173-1` (new, LOW, not a security finding: test integrity): an unprefixed skip-count capture prints `0` and exits 0
- **Observed** (`probe/skipzero.out`, worktree at `9c97dd23`): `npx vitest run --reporter=json 2>/dev/null | jq
  '.numPendingTests + .numTodoTests'`, typed **without** its new prefix, prints **`0`** and exits 0. The guard refused
  the run: `numTotalTests` 0, `success` false, and the refusal is on stderr, which the command discards. As spelled,
  with the prefix, the same command reads 1924 tests, `success` true, skips 0.
- **Why it matters:** feeding that `0` to `test-skip-integrity.js --skip-count 0` reads `No findings.` That is a
  false clean reading on a run that ran nothing.
- **The class existed before this change.** The `AGENTS.md` line's own comment says *"0 with no tests"*. `ABC-173`
  makes the trigger far more likely: **24 files under `.grugops/`** quote the old unprefixed command for agents to
  copy.
- **It is the same class as `QE-173-d`** (`last-run.json` does not name the refusal).
- **Bound:** the as-spelled command is correct, `A3` pins it, and `npm test`'s own result file can never read green
  on a refusal.
- **Route:** not a merge blocker (`security.block_on: high`; `quality.test_integrity: warn`). Two options:
  - the owner accepts it, as `RISK-ABC173-SKIPZERO`, owner Olger Oeselg (`AGENTS.md` is at its byte budget, so a line
    change is his to trade);
  - a follow-up ticket makes the capture refuse to trust a count when `numTotalTests` is 0.

  Until then, a reader of a skip count also reads `numTotalTests > 0`, as QE did at `…6b0e2f58`. Nothing was fixed
  here.
