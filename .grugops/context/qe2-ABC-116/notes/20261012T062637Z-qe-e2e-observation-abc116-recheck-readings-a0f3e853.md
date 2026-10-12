---
id: 20261012T062637Z-qe-e2e-observation-abc116-recheck-readings-a0f3e853
kind: observation
by: qe-e2e
task: qe2-ABC-116
at: 2026-10-12T06:26:37Z
verified_by:
confidence: high
refs:
  - ABC-116
  - A1
  - A5
  - A6
  - QE-116-a
  - QE-116-b
  - QE-116-c
  - QE-116-d
  - QE2-116-a
  - QE2-116-b
  - QE2-116-c
  - src/cli.test.ts
  - 20261012T062100Z-software-engineer-decision-abc116-settle-and-surface-wording-16a8ee37
  - 20261012T062100Z-software-engineer-observation-abc116-log-rename-79e292cc
supersedes:
---

# QE re-check `ABC-116`: readings at tip `ffe52710`

QE read the code and git before reading the Engineer's notes. Line numbers are at `ffe52710`.
The worktree was `../cli-chess-example-qe2-ABC-116` on `grugops/qe2-ABC-116`, off the tip.

## 1. The changed `ChildOptions` JSDoc, read against the code

- **"`timeout` is the hang bound": TRUE.** `childOf` (`:367`) passes `timeout: options.timeout ?? 30_000`
  to `spawnSync` (`:390`). The field's own JSDoc (`:351-361`) calls it the bound. A reached bound
  returns an error, measured here in a scratch run: `spawnSync("/bin/sh", ["-c", "sleep 2"], { timeout: 200 })`
  returned `error: spawnSync /bin/sh ETIMEDOUT`, `status: null`, `signal: "SIGTERM"`. `childOf` throws on
  any `child.error` (`:395-399`).
- **"the settle is a `sleep` in a child's shell argv, e.g. `A9_SETTLE_SECONDS`": TRUE.** The settle is
  `sleep ${A9_SETTLE_SECONDS}` (`:498`), inside the `/bin/sh -c` string that `heldOpenReaderClosed`
  (`:491`) hands to `childOf`. `const A9_SETTLE_SECONDS = 0.6` is at `:487`. A9's `timeout` is a separate
  constant, `A9_BOUND_MS = 4_000` (`:489`). This is the file's only settle: the only `sleep` in code is
  at `:498`, and every other `sleep` hit is in a comment.
- **"`spawnSync(` only inside `childOf`" / "the options type of `childOf`, which every child spawns
  through": TRUE.** `spawnSync(` occurs once, at `:374`, inside `childOf`. `node:child_process` is
  imported once (`:32`, `spawnSync` only). There is no `exec`, `execSync`, `execFile`, `fork` or `spawn(`
  call. Every `CHILDREN` entry (`:683`) calls `childOf` directly or through `run`, `play`,
  `closedReader`, `heldOpenReaderClosed` or `unwritableStdout`. The JSDoc is attached to
  `interface ChildOptions`, which is `childOf`'s fourth parameter type.
- **"The edit itself lands elsewhere: in a `CHILDREN` entry below (e.g. `black`'s hook) or in a
  constant a child's argv reads (e.g. `A9_SETTLE_SECONDS`), not in this block": TRUE as a statement of
  where the edit does not land, and both examples are real. `black`'s hook is at `:698`.**
  - **QE2-116-a (INFO): the list is not exhaustive.** A child's shell argv also lives in the bodies of
    the builders `closedReader` (`:453`), `heldOpenReaderClosed` (`:491`, e.g. `| head -2`) and
    `unwritableStdout` (`:533`, `1</dev/null`). It also lives in `run` / `play` / `childOf` themselves.
    An edit there is in neither a `CHILDREN` entry nor a plain constant.
  - This does not weaken the trigger: (i) fires `T2` on any change to a child's argv, wherever it is
    typed. The sentence no longer says "has to", so QE-116-b's overclaim is gone.
- **A1's four parts are still present, all inside the JSDoc on `ChildOptions`:**
  - (i) argv / stdin script / hook / settle, at `:323-325`;
  - (ii) the per-child CPU re-measure whether or not the count moves, at `:326-328`;
  - (iii) the count pin cannot see it, at `:329-334`;
  - (iv) `ADR-0017` decision 2 and `plans/nfr-catalog.md` § `G-QE115-3`, at `:334-337`.
  - `grep -n "T2"` hits are all inside the block.
- **No sentence in the changed lines overclaims.** QE-116-a and QE-116-b are closed.

## 3. QE-116-c / QE-116-d: the logs

- **Renamed with no content change.** `git diff -M --name-status 2aaccaf4 ffe52710` shows two `R100`
  renames:
  - `…/ticket-to-pr-ABC-116/probe/a2-window.log` → `a2-window.log.txt`;
  - `…/probe/aborted-start-1/a2-window.log` → `a2-window.log.txt`.
- **No tracked `*.log` and nothing ignored.** `git ls-files '*.log'` returns 0 lines. Of the 8 tracked
  `*.log.txt` files, `git check-ignore --no-index` matches none.
- **The add commit is right.** `git show --name-status d39618d1` adds exactly the two old paths, so
  `d39618d1` is their add commit, as note `…79e292cc` records.
- **No committed note was edited.** Over `2aaccaf4..ffe52710`, every `.grugops/context/` change is an
  `A` (the three `fix-ABC-116` notes) or one of the two `R100` renames. The only `M` entries are
  `src/cli.test.ts`, the ticket and `plans/traceability.md`.
- **Old-path references.** The remaining references are in committed notes (`…ae9de9b2:25`, and QE's
  `…557c5bee` and `…17cab375`) and in the two recorded harness scripts. Note `…79e292cc` records all of
  them, so its approach of recording rather than editing holds.
  - **QE2-116-c (INFO):** the note's last bullet says `plans/traceability.md` "does not name them". The
    `ABC-116 (fix)` row, added in the same commit `ffe52710`, now names `a2-window.log` in the rename
    sentence. This is harmless, and the note is not edited.

## 4. The fence against `3c38a8ea` (= `git merge-base main HEAD`)

- **`src/`.** `git diff --name-only 3c38a8ea ffe52710 -- src/` lists `src/cli.test.ts` only, at numstat
  `28 0`.
  - The non-test `src/` numstat is empty.
  - The `src/` diff has 0 removed lines, and 0 added lines that are not ` * ` or `//` comment lines.
  - With comment lines stripped, `src/cli.test.ts` hashes `a0b7b6c3…e002` at base and at tip.
- **Other files.** The `plans/nfr-catalog.md`, `AGENTS.md` and `plans/board.md` numstat is empty.
- **NFR hash.** `grep -E '^\| NFR-00[1-8] \|' plans/nfr-catalog.md | shasum -a 256` gives `c74e7426…0d3b`
  on 8 lines at base and at tip.
- **`N8_SPAWN`.** The line `    const N8_SPAWN = 17 + 7 + 1 + 2;` is byte-identical. It moves from `:1842`
  to `:1870` only because 28 comment lines were added above it.
  - The 5 non-comment `N8_SPAWN` / `spawned` / `Object.keys(CHILDREN)` lines are `cmp`-equal at base
    and at tip (`63ec1b8f…` on QE's filter).
  - The `CHILDREN` block hashes `0284b8dd…e19e` at both.
- **`T1` / `T2` NOT FIRED** (no child changed).

## Side reading: the Engineer's bound remark (note `…16a8ee37`)

- **QE2-116-b (INFO).** The note says "A bound sits two orders of magnitude above the child's cost".
  That holds for the 30 s default against the 64–72 ms the file quotes per child (`:388`). It
  does not hold for A9: `A9_BOUND_MS` is 4 s, and the file says that child "costs ~9x a normal one in
  wall because most of its second is a settle `sleep`" (`:1816`).
  - That is the file's own figure; QE took no timing reading.
  - The note's conclusion survives for the reason in the verdict note, and the note is not edited.
