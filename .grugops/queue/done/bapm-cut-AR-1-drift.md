---
subtask: bapm-cut-AR-1-drift
role: ba-pm
tickets: []
branch: main (records only; commit nothing, the Orchestrator commits)
ref: .grugops/context/bapm-cut-AR-1-drift/
width: 3 (beside qe-ABC-189 and qe-ABC-178b)
---

# BA/PM: cut the fix ticket for AR-1's registry drift (4 new dev-only advisory pairs, no HIGH)

## Read first
- Orchestrator `.grugops/context/orch-ar1-delta-2026-10-22/notes/20261022T153947Z-orchestrator-decision-e4ef897b.md` (the decision and routing).
- Security/NFR `.grugops/context/security-nfr-ABC-190/notes/` (`…140008ff` result, `…56bf0b02` readings: the four pairs, the `@vitest/mocker` 4.1.12 fix inside `vitest`'s `~4.1.11` range); `security-nfr-ABC-172` `…216ceb43` (Rulings 2–3, the unproven dev-server-socket point); AR-1's approval `…193e08fb`; `memory-bank/45-standing-rulings.md`; `AGENTS.md` (`RISK-ABC143-01`: a vitest/`@vitest/*` bump carries the result-file reporter risk).
- The owner delegation `…5aaf7cec`: you rule scope yourself; escalate only a requirement change.

## Do
- Cut one ticket (next free id **ABC-198**): a **lock-only** bump that clears the two `@vitest/mocker` advisories (`npm` resolves 4.1.12 inside the existing ranges; `package.json` unchanged unless a range must move, in which case say so and why). Rule whether the two vite pairs go in the same ticket (only if a lock-only in-range bump exists; measure with `npm view` / a scratch clone, never main's checkout) or are accepted with a reopen trigger.
- Criteria must include: the audit (package, advisory) set before and after, compared pair by pair (not just the count); `npm ci` clean on a fresh clone; gates green with unchanged test counts; `RISK-ABC143-01` (the reporter loads); a QE probe that a plain `npm test` opens no listening socket (the `…216ceb43` point); Security/NFR clause (a) on the lock diff. State who re-states AR-1 after it merges.
- Size it (expect XS), set priority (expect P2/P3), and score DoR. Put it in Ready if 10/10, else Backlog with the missing input named.
- One `_Updated:` line at the top of `plans/board.md` and the new card.

## Fences
- Only `plans/` and your notes (context root: this repository's `.grugops/context`). No `src/`, `package*.json`, `AGENTS.md`, `memory-bank/`, branches, worktrees, git config. Commit nothing. npm only in scratch clones in your scratch area; no vitest, no timing.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-cut-AR-1-drift`). Every `at` from `date -u`. Include a `kind: decision`.
- Trace row (10 cells, plain table line) in your done record `.grugops/queue/done/bapm-cut-AR-1-drift.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave this pending file and the claim directory alone.

## Result (ba-pm, 2026-10-22T15:48:20Z): **`ABC-198` cut → Ready (XS, P2, DoR 10/10; SE builds). The vite pairs go IN the same ticket. After the merge, the Release Manager re-states AR-1 on the 3-pair set.**

Records only, uncommitted on `main` (`5aaf09ac` at start, `a54f91c4` at finish; ABC-189's merge touches neither `package*.json`). Notes in `.grugops/context/bapm-cut-AR-1-drift/notes/`, sealed with grugops 2.1.0 `context-io.js` `admitAndAppend` (this checkout's `.grugops/context` passed explicitly) and read back through `readContext`:
- `20261022T154809Z-ba-pm-observation-63b88f5d`: the readings (scratch clones; commands tried, lock diffs, `npm ci`, audit lists pair by pair);
- `20261022T154813Z-ba-pm-decision-1a123d24`: the scope and vite ruling, the criteria, who re-states AR-1, size, priority and DoR.

**Measured (scratch clones of `5aaf09ac`, npm 11.20.0):**
- `vitest` 4.1.11 pins `@vitest/mocker` at exactly `4.1.11`, so the fix is the whole `vitest` family going to 4.1.12. That is inside `~4.1.11`.
- `npm install --package-lock-only --ignore-scripts 'vitest@~4.1.11' '@vitest/coverage-v8@~4.1.11' 'vite@~7.3.6'` leaves `package.json` unchanged. It moves 10 packages, with lock numstat `53 53`.
  - `npm ci` is clean, and the command is idempotent.
  - The audit drops from 10 pairs (7 packages) to 3 pairs: nanoid, postcss and source-map-js, all AR-1-approved.
  - All 4 new pairs are gone, and so are the 3 approved vite pairs.
- A named `npm update` moves nothing, and a bare `npm update` moves 80 versions. Neither is used.

**Vite ruling: IN.** `vite` 7.3.7 is in range, and its entry moves only `version`, `resolved` and `integrity`. It shares the same hops.
- Fallback, if the gates are red only with vite: the vitest-only diff (`50 50`). The 2 new vite pairs are then accepted LOW, with a reopen trigger (any vite pair graded high, or anything that starts a dev server, `ui`, `api` or `browser`). BA/PM re-rules on hand-back.

**Criteria (`A1`–`A8`):**
- `A1`: the exact lock diff.
- `A2`: the audit lists, compared pair by pair before and after. Head = base minus 7 pairs and 3 via rows, with nothing added.
- `A3`: `npm ci` clean on a fresh clone, and idempotent.
- `A4`: `ABC-192` `A2` reds first; then `BUMP_RERUN_LIST` (1)–(3) runs, then the literal is re-pinned. That is the one `src/` line.
- `A5`: gates green, with counts and names equal to base.
- `A6`: `RISK-ABC143-01`. The reporter writes `success: true`, and a planted red run writes `false`.
- `A7`: the QE probe. It reads 0 listening sockets across `run-bounded.js` → `vitest` → threads, with a planted-listener non-vacuity check.
- `A8`: Security/NFR clause (a).

**Who re-states AR-1:** the Release Manager, after the merge. The interim accept `…e4ef897b` lapses at the merge.

**Owed by the Orchestrator:** the pull; the order relative to `ABC-178`'s B7/B8 timing hop; and appending the trace row below.

**Files:**
- `plans/tickets/ABC-198-four-new-dev-only-advisories-on-vitest-4-1-11-and-vite-7-3-6-and-an-in-range-lock-bump-clears-them.md` (new, 211 lines);
- `plans/board.md`: one `_Updated:` line at the top, plus the `ABC-198` card in Ready (header 0/8 → 1/8). The Orchestrator's uncommitted ABC-189 edits in the same file were left as found;
- `.grugops/context/bapm-cut-AR-1-drift/notes/` (2 notes, new);
- this done record and `bapm-cut-AR-1-drift.claim.md`.

**Not touched:**
- `plans/traceability.md` (the row is below);
- `src/`, `package*.json`, `AGENTS.md` and `memory-bank/`;
- other board cards;
- branches, worktrees and git config;
- main's `node_modules`;
- the pending file and the claim directory.

No vitest, no timing, no commit. No stop.

### Trace row (10 cells, header order)

| ABC-198 (bapm-cut-AR-1-drift) | Four new dev-only advisory pairs sit on @vitest/mocker 4.1.11 and vite 7.3.6; an in-range lock-only bump (vitest family 4.1.12, vite 7.3.7; package.json unchanged; one ABC-192 A2 literal re-pinned) clears them | — | — | AR-1 (ABC-056 A4 clause (1) fired, registry drift; interim LOW …e4ef897b); Security/NFR clause (a) owed (A8); NFR-008 not triggered (runner wall-time UNKNOWN - verify); RISK-ABC143-01 (A6); …216ceb43 socket point (A7 QE probe); notes …140008ff, …56bf0b02, …193e08fb, …5aaf7cec, …63b88f5d, …1a123d24 | main @ 5aaf09ac / a54f91c4 (uncommitted, records only)<br>plans/tickets/ABC-198-four-new-dev-only-advisories-on-vitest-4-1-11-and-vite-7-3-6-and-an-in-range-lock-bump-clears-them.md | — (scratch measurements only: lock numstat 53 53, 10 packages; npm ci rc 0 clean; audit 10 pairs → 3, nanoid/postcss/source-map-js) | waiver expected (0 production lines) | — | cut → Ready (XS, P2, DoR 10/10); next free ABC-199 |
