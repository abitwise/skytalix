---
id: 20261012T122700Z-ba-pm-observation-process-half-readings-bb718725
kind: observation
by: ba-pm
task: bapm-rescore-backlog-process
at: 2026-10-12T12:27:00Z
verified_by:
confidence: high
refs:
  - ABC-040
  - ABC-052
  - ABC-030
  - ABC-039
  - ABC-056
  - AR-1
  - plans/traceability.md
  - plans/board.md
  - plans/metrics.md
  - tools/grugops/qe-hop-integrity.js
  - memory-bank/50-decisions/ADR-0018-distribution-channel-git-clone-npm-run-chess.md
  - .grugops/context/secnfr-ABC-152-window/notes/20261011T231055Z-security-nfr-observation-abc152-v12-dependency-review-daf38cf7.md
supersedes:
---

# Process-half re-score: what I measured, and the commands

This is a hand-authored, unsealed note (`AGENTS.md`). I took **no timing reading**. I ran `npm audit`
read-only (no install, update or fix). Worktree `../wt-bapm-rescore-backlog-process` at `main` `1eb2edbc`,
with `node_modules` symlinked into the worktree root only (gitignored). File hashes:
- `plans/traceability.md`: 1069 lines, md5 `eb3233b22053441f60f6f91cf4f479f8`.
- `plans/board.md`: md5 `be514ce68361fb27254ad574c8a95dae`.
- `plans/metrics.md`: md5 `1b083e8d171eba47454ae32298b09d2c`.
- `package.json`: md5 `076a03d7955198d9219e997a9d929291`.
- `package-lock.json`: md5 `ed7a5b0c455a3cc59fd76a686192c7b8`.

Each `split()` below is `re.split(r'(?<!\\)\|', line.strip().strip('|'))`.

## ABC-040

- **Counts.** `grep -cE '^\| ABC-'` → 482. Distinct `^\| ABC-[0-9]{3}` ids → 143. Ticket files → 145.
  `comm -3` → `ABC-052` and `ABC-155` have no row.
- **First cells.** 129 bare and 353 suffixed. The first suffixed row came in `05eecc1a` (2026-08-17),
  from `git log --reverse -G'^\| ABC-[0-9]{3} \('`.
- **Bare-id duplicates.** `ABC-028` L460/L462, `ABC-029` L461/L463, `ABC-100` L658/L679, `ABC-154`
  L1066/L1067. Only the 028/029 pairs share byte-identical cells 0–4 (dict keyed on `cells[:5]`).
- **Stability.** The four 028/029 rows are byte-identical to `git show 06c5427:plans/traceability.md`.
- **`ABC-028`.** Stale `Status` `startswith` holds: 2618 of 50168. Stale `Code`/`Tests` cells are
  empty.
- **`ABC-029`.** Divergence at 2705. The stale tail is 2404 chars (2418 UTF-8 bytes). The six probes
  are present in stale and absent from live.
- **The splice.** A naive `live[:d]+stale[d:]+live[d:]` leaves 205 `**` markers (odd) and the junction
  reads `bytes.DESIGN`. With a `" **"` separator it is 206.
- **`NOT repaired`.** `grep -c` → 5: L117, L192, L378 (the comment block), L470, L479.
- **Rows that do not split to 10.** L630 `ABC-065` (11), L631 `ABC-066` (13), L739 `ABC-109 (UAT)` (11),
  L986 `ABC-094 (accepted)` (6), L1010 `ABC-150 (design)` (2). `ABC-009`/`011`/`015`/`019` all split
  to 10. **For the Orchestrator, no ticket:** L479 (`ABC-042` row) calls the four-row malformation
  "`ABC-052`'s subject". `ABC-052`'s page does not carry it.

## ABC-052

- **Method.** `Done` ids are the `^- \[ABC-\d{3}\]` rows between `## Done` and the next `## ` (board
  L843–1021): 134 of them, all with a trace row.
- **Counts.** First-row `Status` lacks `Done`: 94. No row's `Status` has `Done`: 77. No cell of any row
  has `Done`: 56. Last-row `Status` lacks `Done`: 90. The 2026-08-13 twelve are in every set.
- **Merge data on the board.** Board `Done` rows with "merged" + a date + a hex sha: 106 of 134.
  "merged" at all: 123.
- **No row of its own.** `git log -S'| ABC-052' -- plans/traceability.md` → none.
- **Reuse.** `parseDone(boardText)` is exported at `tools/grugops/qe-hop-integrity.js:74`.

## ABC-030

- **Sibling counts.** `npx vitest run src/<f>.test.ts --reporter=json | jq
  '.testResults[0].assertionResults|length'` gives status-panel 29, gameend 45, san 22, zobrist 32. All
  passed, 0 pending.
- **Remaining live counts.** `/usr/bin/grep -nE 'all [0-9]+ tests there|the [0-9]+ rows in' src/*.ts`
  → 3 hits: `gameend.nfr:13`, `san.nfr:19`, `status-panel.nfr:11`.
- **History.** zobrist was repaired in `40b77ac7` (`git log -S'all 13 tests there'`). `san.test.ts`
  commits: `1e39511e`, `c98b1e22`, `ccb8f1bd`. `808a7e82` touched all four `.nfr` files.
- **The san row count.** A single-line regex `^\s*\["P-[A-Z-]+", *"[a-h][1-8]"` finds 45 rows. The true
  row count is `UNKNOWN - verify` (multi-line rows are not counted), and it is not needed.

## ABC-039

- **Board.** `grep -c "FIRST BACKWARD BOARD MOVE IN THIS PROJECT'S HISTORY" plans/board.md` → 1, at
  L969.
- **#2 is wrapped.** The label in `ABC-009-board-history.md` spans L814–815. `grep -cF` of the full
  label → 0.
- **#3–#8.** `grep -nF` of each quoted label hits L17, L451, L786; `ABC-025:37`, `ABC-019:24`,
  `ABC-016:52`.
- **#9, new and live.** `plans/traceability.md:437` (`ABC-009` row): `grep -cF "first backward board move
  in this project's history"` → 1. It was also present at `06c5427`.
- **Metrics.** `plans/metrics.md:28` holds the Rework-rate row: 13 moves across 9 tickets.
- **Citations.** `grep -rliE "(first|second|third|fourth) backward (board )?move"` over `plans`,
  `memory-bank` and `.grugops/context` finds no note dated after 2026-08-13.

## ABC-056

- **`npm audit` (2026-10-12T12:20Z).** Exit 1, 3 vulnerabilities:
  - `nanoid` <3.3.18, high, GHSA-2v37-7h3g-55p8;
  - `postcss` <=8.5.22, moderate, GHSA-fxqj-rqcc-2cmp;
  - `source-map-js` 1.0.0–1.2.1, high, GHSA-68fv-2mgg-jv7q.
  - All have `fixAvailable: true` via `npm audit fix`. Metadata: prod 1, dev 122.
- **Prod-only.** `npm audit --omit=dev` → 0.
- **Lockfile paths.** `vite`→`postcss`; `postcss`→`nanoid`, `source-map-js`; `magicast`→`source-map-js`.
  All are `dev: true`.
- **Lockfile history.** `git log -- package-lock.json` gives `9313dda7` (2026-10-11), then
  `226c2e3c`/`5165f97a` (2026-07-22). Nothing in between.
- **Manifest premises.** `jq 'has("dependencies")' package.json` → false. `private` true. No
  `bin`/`main`/`exports`/`files`. `build` = `tsc --noEmit`. `chess` = `node src/cli.ts`.
- **Runtime imports.** Across 37 non-test `src/*.ts` files there are 140 import specifiers, 0
  non-relative. Positive control: the same grep on `src/cli.test.ts` finds `node:child_process`.
- **Untouched.** Manifest md5s were identical after the audit; `git status` was clean.
