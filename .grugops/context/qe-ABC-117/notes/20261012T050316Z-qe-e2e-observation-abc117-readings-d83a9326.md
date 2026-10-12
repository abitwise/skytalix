---
id: 20261012T050316Z-qe-e2e-observation-abc117-readings-d83a9326
kind: observation
by: qe-e2e
at: 2026-10-12T05:03:16Z
verified_by:
confidence: high
refs:
  - ABC-117
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - A7
  - ABC-115
  - G-QE115-5
  - src/cli.ts
  - src/cli.test.ts
supersedes:
---

# QE `ABC-117`: my own readings, taken before I read the Engineer's notes

Host: Node v26.11.0. Tip `d5afab3f` in worktree `../cli-chess-example-qe-ABC-117` (branch
`grugops/qe-ABC-117`). Base `3537fe48` in a detached worktree `../cli-chess-example-qe-ABC-117-base`.
`node_modules` was copy-on-write cloned from the main checkout. No timing was read (width 3).

## A1: both commands, run at my hand

| run | exit | `grep -c Usage` | `grep -c '^usage: '` | `internal error` | `CAUGHT:` | stderr |
|---|---|---|---|---|---|---|
| `node src/cli.ts 1</dev/null </dev/null` (tip) | **1** | 0 | **0** | **0** | 0 | Node banner, caret on `throw error` at **`src/cli.ts:160`**, `EBADF`, `at main (…cli.ts:170:27)`, 1173 B (longer worktree path than the Engineer's 1148 B: +5 chars x 5 occurrences) |
| QE's out-of-product script (`…d2c79dc9`, six lines of JS), `1</dev/null </dev/null` | **1** | 0 | 0 | 0 | **0, never printed** | Node banner, `EBADF`, 1265 B |
| control: `node src/cli.ts --bogus </dev/null` | **1** | **0** | **1** | 0 | n/a | `unrecognised argument: --bogus` + `usage: npm run chess -- …` |
| extra: pre-`ABC-115` build `badf6c3d` (= `aac410c1~1`), `--ascii </dev/null \| head -c 1`, 3 runs | **1** x3 | n/a | 0 x3 | 0 x3 | n/a | `EPIPE` stack x3 |

**The `CAUGHT:` reading holds on v26.11.0.** `main`'s `try` cannot reach the re-throw, and neither the
usage line nor `INTERNAL_ERROR` is written. The `1` is Node's unhandled-exception status. Every
corrected sentence on the branch (board block, ABC-115 page block, `…0081a95a` (i)/(ii), `…92514474`,
the S8 comment) agrees with these readings. None claims a quantity I did not reproduce.

**The instrument.** `grep -c "Usage"` reads 0 on the refusal control as well, so it cannot tell
the two paths apart. `^usage: ` reads 1 on the refusal and 0 on `EBADF`. The control proves the
Engineer's substitution sound (ruling and gap in the verdict / gap notes).

**The extra run** answers the Engineer's unverified flag on `src/cli.test.ts:3251`: before `ABC-115`,
the `EPIPE` path's `1` was also Node's (0 `usage:` lines, 0 `internal error` lines, 3/3).

## A2/A3: notes

- `…8a4b2e69` (49 lines) is unmodified. `git diff --name-status 3537fe48...HEAD -- .grugops/context/`
  shows only `A` lines, five files, all under `ticket-to-pr-ABC-117/`.
- **A2(iii) `cmp`, my own.** I extracted the original's lines 24-49 and the `> ` blockquote of
  `…0081a95a` with the quote marks stripped. `cmp` exits 0, 26 lines each. The title (`:17`) and the
  opening (`:19-22`) are restated with only the mechanism sentence corrected. Nothing in the 49 lines
  is folded out uncarried.
- A2(i) cites both zeros (`usage:`, `internal error`). (ii) says no `try`/`catch` and puts the outcome
  in the `:160` arm, disclaimed as a proposal. (iv) says "NOT re-opened".
- A3: `…92514474` has `refs` naming `…9d3a7e52`, `…8c04b19d` and `…6b1e4c72`, and an empty `supersedes`.
  All three originals are byte-identical.

## A4/A5: board, ABC-115 page, ADR

- `plans/board.md` +2/-0. The block sits directly after `:659`, the S6 header, which carries *"on that
  `EBADF` path the delivered build exits `1` = `USAGE_EXIT_CODE`"*. **It names both clauses it
  corrects: S6 by position and S9 by its entry** (*"the `ABC-115` entry in `## Done` …"*, base `:871`,
  confirmed under `## Done (WIP unlimited)`).
- ABC-115 page +14/-0, after the `## RESIDUAL` paragraph. It quotes `:302`'s clause and changes no
  existing line.
- `memory-bank/` numstat (ADR-0016 included) is empty. `AGENTS.md` numstat is empty.
- I scanned all added lines for re-open / re-score / wider-arm / propose / grade / move / signed
  wording. Every hit is a negation, or A2(ii)'s required sentence disclaimed as a proposal.
  `ABC-115` is described only as `Done`, owner-signed, which is fact.

## A6/A7: tree and lane

- `src/` lists exactly `src/cli.test.ts`, and the non-test numstat is empty. Every +/- line under
  `src/` matches `^[+-]\s*//` (+7/-3). `nfr-catalog.md`/`AGENTS.md` numstat is empty.
- NFR 8 rows: `c74e742698b59da90b67e101942f20406a20c8aee54da7f518df39da9eae0d3b` at base and head
  (base == head). The page's `63f66795…` pin is void per the 2026-10-10 re-score.
- `npm test`: base exit 0, 56 files / 1741 tests / 0 pending / 0 todo. Tip exit 0, 56 / 1741 / 0 / 0.
  The same 56 file paths and the same 1741 `fullName`s (`cmp` equal).
- The `N8_SPAWN` / `spawned` / `Object.keys(CHILDREN)` lines (15, with line numbers) hash
  `9f4eb8bb45d81185` at both ends. `const N8_SPAWN = 17 + 7 + 1 + 2;` at `:1842`. **`T2` not fired:**
  no child's argv, stdin script, hook or settle changed.

## Gates at the tip

`npm run lint` 0 (107 files, no fixes), `typecheck` 0, `build` 0, `npm test` 0. `test-skip-integrity
--skip-count 0` reads `No findings.`, exit 0. `host-protection.js` exits **2**, `UNKNOWN - verify`
(no git remote; the repository endpoint answered nothing readable). This is recorded, not read as a pass.

## UAT-waiver reading (measured)

Over the range `3537fe48...HEAD`, the production `src/` list is empty. Per commit
`git diff --name-only <c>~1 <c> | grep -v '\.test\.ts$' | grep '^src/'` is empty for each of
`59000c87`, `00741431` and `d5afab3f`. **The 2026-08-17 zero-production-lines waiver applies.**
