---
id: ABC-198
title: "Four new dev-only advisory pairs sit on `@vitest/mocker` 4.1.11 and `vite` 7.3.6, and an in-range, lock-only bump clears them (AR-1 registry drift)"
status: in-review
column: In Review
size: XS
priority: P2
epic: —
feature: —
---

# ABC-198: bump the `vitest` family to 4.1.12 and `vite` to 7.3.7 inside the existing ranges. `package.json` stays unchanged, and one test literal is re-pinned

> **Cut 2026-10-22 by BA/PM** (subtask `bapm-cut-AR-1-drift`, at `main` `5aaf09ac`; `a54f91c4` touches neither
> `package*.json`). Sources:
> - Orchestrator `…e4ef897b`: the routing, and an interim LOW accept of the four pairs until this lands.
> - Security/NFR `…56bf0b02` (readings) and `…140008ff` Ruling 3 (the four pairs, no new HIGH, registry drift).
> - `…216ceb43` Ruling 3: it is unproven that a plain vitest run opens no dev-server socket.
> - AR-1's approved set `…193e08fb`; `AGENTS.md` `RISK-ABC143-01`; the owner delegation `…5aaf7cec`.
>
> Measured on scratch clones (npm 11.20.0, node v26.11.1). The readings are in
> `.grugops/context/bapm-cut-AR-1-drift/notes/`: `20261022T154809Z-ba-pm-observation-63b88f5d` (readings) and
> `20261022T154813Z-ba-pm-decision-1a123d24` (the ruling).

## Problem

*User:* the AR-1 owner (the Release Manager) and every Security/NFR reader of `npm audit` on `main`.

*Pain:*
- `npm audit` on `main` holds 4 (package, advisory) pairs that AR-1's approved set (`…193e08fb`) does not:
  - `@vitest/mocker` GHSA-qxg6-89mg-rqv8 and GHSA-xp26-3454-mjgp;
  - `vite` GHSA-9jrq-w75r-8gcw and GHSA-rq7h-c2jc-7f22.
- They are covered only by the Orchestrator's interim LOW accept, which runs until a fix lands.
- Every one of them is fixable inside the ranges `package.json` already declares.

*Value:* one lock commit takes 7 of today's 10 advisory pairs off `main`, including one npm-`high` (`vite`
GHSA-587h). AR-1 then rests on the 3 pairs left, which the owner already approved.

## Scope

1. **Regenerate the lock with one command, at `main`:**
   `npm install --package-lock-only --ignore-scripts 'vitest@~4.1.11' '@vitest/coverage-v8@~4.1.11' 'vite@~7.3.6'`.
   - Each spec equals the range `package.json` already declares, so npm re-resolves those trees to the newest
     in-range version and writes `package.json` back unchanged (measured).
   - A named `npm update vitest @vitest/coverage-v8` moves nothing, because `@vitest/coverage-v8` peers an exact
     `vitest`. A bare `npm update` moves 80 versions. Do not use either one (measured).
2. **Why the whole `vitest` family moves, not `@vitest/mocker` alone:** `vitest` 4.1.11 depends on
   `@vitest/mocker` at exactly `4.1.11`. So 4.1.12 is reachable only through `vitest` 4.1.12, which pins all 8
   `@vitest/*` packages at `4.1.12`. No range moves: `~4.1.11` admits 4.1.12.
3. **Re-pin one literal.** `ABC-192`'s `A2` row (`src/cli.test.ts`, `CAPTURE_ARM_READ_ON_VITEST = "4.1.11"`) goes
   red on the bump by design. Run its `BUMP_RERUN_LIST` items (1)–(3) on 4.1.12 and record the readings in a note.
   Only then change the literal to `"4.1.12"`.

**The vite ruling: IN this ticket.** Both new vite pairs (and the 3 approved vite pairs) have the range
`>=7.0.0 <=7.3.6`. `vite` 7.3.7 is inside `~7.3.6`, and its lock entry moves only `version`, `resolved` and
`integrity`: its `dependencies` are unchanged (measured). It adds no hop, because it shares the same clause (a)
read and the same gates, and vitest runs on it. So it is not accepted with a reopen trigger.
- **Fallback, only if `A5` is red with vite 7.3.7 and green without it:** drop `'vite@~7.3.6'` from the command.
  The vitest-only diff was measured at numstat `50 50`, with 9 packages.
  - The 2 new vite pairs then stay accepted LOW, with a reopen trigger. The trigger fires when any vite pair is
    graded `high` by the registry, or when anything in the repo starts a Vite dev server, `ui`, `api` or
    `browser` mode.
  - BA/PM re-rules this on hand-back. The builder does not.

## Out of scope

- `package.json`, and any range change. A vitest/vite minor or major bump.
- **nanoid, postcss and source-map-js.** They are AR-1-approved. A full `npm update` would move them in range,
  but it drags in 80 version moves (biome, rollup, esbuild, `@types/node`). They are an option for the Release
  Manager, not for this ticket.
- `npm audit fix` and `npm update`.
- The `4.1.11` mentions in the comments of `vitest.config.ts`, `tools/grugops/heap-guard.js` and
  `src/cli.test.ts:377`. They record the version each reading was taken on.
- The AR-1 re-statement itself; `AGENTS.md`; `memory-bank/`.
- Any fix to the reporter, the heap guard or a `RISK` if a re-run item fails: **stop and hand back**.

## Acceptance (Given/When/Then)

"Base" is `main` at pull time, read on a fresh clone. "Head" is the branch merged with the latest `main`. "The
10 packages" are `vitest`, `@vitest/{coverage-v8,expect,mocker,pretty-format,runner,snapshot,spy,utils}`
(4.1.11 → 4.1.12) and `vite` (7.3.6 → 7.3.7).

- **`A1` (the lock moves exactly the 10 packages, in range).**
  - **Given** head;
  - **when** `git diff --numstat main...HEAD -- package-lock.json package.json` runs;
  - **then** it prints `53	53	package-lock.json` and nothing for `package.json`. *(Measured at cut.)*
  - A structural read of the lock, base against head:
    - there are 123 `packages` entries at both ends;
    - exactly the 10 packages differ, at the versions above;
    - every other entry is deep-equal;
    - `git diff -U0 main...HEAD -- package-lock.json | grep -cE '^[-+].*"version"'` prints `20`.
  - Inside the 10 entries, every changed line other than `version`, `resolved` or `integrity` is a
    `4.1.11` → `4.1.12` pin in `dependencies`/`peerDependencies`. The one exception is the `vitest` peer
    `@vitest/browser-webdriverio` `4.1.11` → `^4.1.11`, which is as published.
  - **If npm resolves any other version or package, stop and hand back.** The registry has moved, and BA/PM
    re-measures. Never hand-trim the lock.
- **`A2` (the audit, compared pair by pair rather than by count).** On fresh clones of base and head, after
  `npm ci --ignore-scripts`, run on the same day:
  - **when** `npm audit --json` runs, and its `vulnerabilities` are listed as sorted
    `package advisory-id` lines (via-only rows as `package via:<name>`);
  - **then** head's list equals base's list minus exactly these 7 pairs and 3 via rows, with nothing added:
    - `@vitest/mocker` GHSA-qxg6-89mg-rqv8 and GHSA-xp26-3454-mjgp;
    - `vite` GHSA-9jrq-w75r-8gcw, GHSA-rq7h-c2jc-7f22, GHSA-587h-7wmj-h5pm, GHSA-698v-4r3x-3vcv and
      GHSA-r825-w8mm-5pxw;
    - `vitest via:@vitest/mocker`, `vitest via:@vitest/coverage-v8` and `@vitest/coverage-v8 via:vitest`.
  - **Expected head list (measured at cut):** nanoid GHSA-2v37-7h3g-55p8, postcss GHSA-fxqj-rqcc-2cmp and
    source-map-js GHSA-68fv-2mgg-jv7q. Metadata reads `{low 0, moderate 1, high 2, critical 0, total 3}`.
  - `npm audit --omit=dev` totals `0` at head.
  - Both lists go into the hop's note, in full.
  - A pair the registry adds to both ends on the day is drift. Name it and route it to Security/NFR; it does not
    fail `A2`.
- **`A3` (`npm ci` is clean on a fresh clone, and stable).** In a fresh clone of head:
  - `npm ci --ignore-scripts` exits `0`, and `git status --porcelain` is empty.
  - `npm ls vitest @vitest/mocker @vitest/coverage-v8 vite --all` shows only `4.1.12`/`4.1.12`/`4.1.12`/`7.3.7`.
  - Re-running the Scope 1 command, then `npm install --package-lock-only --ignore-scripts`, adds no diff.
    *(Both were no-ops at cut.)*
- **`A4` (the re-pin is the one `src/` change, and it is earned).**
  - Red first: at head with the lock bumped and the literal still `"4.1.11"`, `npm test` reds exactly 1 test,
    `ABC-192`'s `A2` ("the installed vitest is the version the capture arm was last read on"), and prints
    `BUMP_RERUN_LIST`.
  - `BUMP_RERUN_LIST` items (1)–(3) are each re-run on 4.1.12. Their readings are in a note that the literal
    change's commit cites.
  - Then `git diff --numstat main...HEAD -- src/ tools/` prints only `1	1	src/cli.test.ts`, and that line is the
    literal.
- **`A5` (the gates are green, with the test counts unchanged).**
  - lint, typecheck and build exit `0`.
  - `npm test` exits `0` with the same file and test counts and the same test names as base. Skips are `0`, and
    the skip-integrity line reads `No findings.`
  - The UAT waiver form in `AGENTS.md` prints nothing (`src/cli.test.ts` is filtered out).
- **`A6` (`RISK-ABC143-01`: the result-file reporter loads on 4.1.12).**
  - Head's `npm test` writes `.test-results/last-run.json`, with an mtime after the run started. It parses, reads
    `success: true`, and its file and test counts equal the console's.
  - In a scratch clone of head, a planted failing assertion makes the same file read `success: false`. That is
    `ABC-143`'s point: a red run never reads green.
  - `BUMP_RERUN_LIST` (2), the reporter header's seven rows, is read as present.
- **`A7` (QE probe: a plain `npm test` opens no listening socket).** This settles `…216ceb43`'s open point.
  - **Given** a fresh clone of head after `npm ci`;
  - **when** `npm test` runs exactly as spelled;
  - **then** the process tree opens **0** listening sockets (TCP, UDP or a Unix-domain listener) from launch to
    exit. The tree is `run-bounded.js`, `vitest` and its worker threads (`pool: "threads"`).
  - The instrument is QE's choice, with two conditions:
    - (i) it covers the whole run, not a sample alone;
    - (ii) it is shown to be able to fail: in a scratch clone, the same instrument records `≥ 1` when a scratch-only
      test file calls `net.createServer().listen(0, "127.0.0.1")`.
  - QE records the instrument, both readings and the count.
  - **If the count is not 0,** that is a gap routed to Security/NFR before merge. It does not revert the bump,
    which only removes advisories, but it reopens the reachability premise in AR-1's re-statement.
- **`A8` (Security/NFR clause (a) on the lock diff).** Security/NFR reads `A1`'s diff itself. Every `resolved`
  stays on `registry.npmjs.org`, and only the 10 entries change `integrity`. It confirms `A2`'s two lists.
  - Expected: no finding.
  - Clause (c) is not expected to fire, because one string literal in a test file introduces nothing. Security/NFR
    confirms this on the same read.

## Who re-states AR-1

- **After the merge, the Release Manager (AR-1's owner) re-states AR-1** with head's `A2` list (3 pairs) as the
  approved set. Trigger clause (1) is unchanged.
- The new set adds no HIGH and removes one. Under the delegation `…5aaf7cec` item 1, that is the Orchestrator's
  to accept or route; it is not the owner's.
- The Orchestrator's interim LOW accept (`…e4ef897b`) lapses at the merge.
- If this ticket stops unmerged, the interim accept stands and the Orchestrator re-routes.

## Dependencies

- **Waits on nothing.** No file overlaps with `ABC-178` (`src/uci-session.test.ts`) or `ABC-197`.
- The literal is one line (`src/cli.test.ts:4270` at `a54f91c4`). A concurrent edit elsewhere in that file
  should merge textually; a conflict on that line is re-read, never auto-resolved.
- **Sequencing note for the Orchestrator:** merging this before `ABC-178`'s owed B7/B8 timing hop puts that
  reading on vitest 4.1.12. That is the Orchestrator's to order.

## Security / NFR triggers

- **Security, clause (a) fires** (`package-lock.json`). A short hop is owed (`A8`), and no finding is expected.
- **NFR:** `NFR-008`'s triggers (tests, spawns) are not hit: 0 tests and 0 spawns are added. Whether a runner
  patch bump moves the lane's wall time is **`UNKNOWN - verify`**. That is read at the next admissible full-lane
  reading, not on this ticket (no timing).

## Test notes

1. **Use the npm that ships with the repository's Node** (11.20.0 at cut). Run `A2`, `A3` and `A7` in fresh clones,
   never in the main checkout's `node_modules`.
2. **`RISK-ABC143-01` and `RISK-ABC173-STATE`** are re-read under `BUMP_RERUN_LIST` (3). If either fails, or if
   item (1) shows the heap-guard refusal changed, stop and hand back.
3. **Hops:** SE builds (lock + `A4`). QE reads `A1`–`A7` from its own runs. Security/NFR clause (a) then reads
   `A8`. The UAT waiver is expected (0 production lines).

## Size and priority

**`XS`:** one command, one file regenerated, and one literal. The diff is known to the line, and the re-run
list is pre-written.

**`P2`:** the interim accept is explicitly temporary. The fix is in range and cheap, and it retires 7 of 10
pairs, including one npm-`high`. It is not `P1`, because every pair is dev-only (`--omit=dev` = 0) and none is
reachable without a dev server.

## Definition of Ready

BA/PM, 2026-10-22 at `5aaf09ac`. **Result: 10 of 10 → Ready.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** 4 unapproved pairs on `main`, under an interim accept; fixable in range |
| 2 | scope and out-of-scope clear | **✅** one command, one literal; the vite ruling plus its fallback; ranges, the 3 approved pairs, comments and the AR-1 re-statement fenced |
| 3 | INVEST-shaped | **✅** independent; valuable alone; `XS`; each criterion measured |
| 4 | acceptance testable and measurable | **✅** numstat `53 53`, 10 packages, 20 version lines; audit list minus 7 pairs, set of 3; `npm ci` rc 0 with a clean status; 1 red then green; counts equal; socket count 0 with a non-vacuity plant |
| 5 | dependencies known | **✅** none blocking; ABC-178 timing sequencing named |
| 6 | security/NFR triggers with a measurable target | **✅** clause (a) (`A8`); `NFR-008` not triggered, with the wall-time effect marked `UNKNOWN - verify` |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P2` |
| 10 | no major unresolved blocker | **✅** none; the registry-moved and re-run-fail cases are stop-and-hand-back |
