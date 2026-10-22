---
id: ABC-196
title: "A drifted anchor or a dropped capability line turns a twin-referenced row of `r2-mutants.sh` into a silent control, and the harness still reads 25 of 25 (QE-195-a)"
status: in-review
column: In Review
size: XS
priority: P3
epic: —
feature: —
---

# ABC-196: each of `r2-mutants.sh`'s five `TW` rows fails when its plant no longer reads as the row expects on limbs 2 and 3. Harness-only: one file, 0 `src/` lines, no instrument or ADR edit

> **Cut 2026-10-21 by BA/PM** (subtask `bapm-rule-QE-195`, at `main` `219e8e33`). Sources:
> - QE's gap register on `ABC-195`: `.grugops/context/qe-ABC-195/notes/…decision-f36a06c3` (`QE-195-a`), with the
>   drift copies D1–D5 in `…observation-741eebba`.
> - The Orchestrator's close: `…orchestrator-decision-ed1933d8`.
> - The rows this ticket guards: `ABC-195` (cut in `bapm-cut-AR-193` `…d7a70688`, which promised "a drifted anchor
>   cannot make a silent control").
>
> The readings measured for this cut are in `.grugops/context/bapm-rule-QE-195/notes/`. They were taken on a scratch
> clone outside the repository (its own `.git`, private `HOME`/`TMPDIR`/`GIT_CONFIG_GLOBAL`, `GIT_CONFIG_NOSYSTEM=1`)
> with a scratch harness prototype, which is not a design.

## Problem

*User:* the Orchestrator and Security/NFR. Both rely on `r2-mutants.sh` being red whenever clause (b) stops reading a
plant. Also the builder and QE of every later clause (b) hop, who read its exit code and summary line.

*Pain:*
- **A refactor of `src/cli.ts` alone makes `PP-EDIT` a silent control (`QE-195-a`).** The plant's in-place edit is a
  `perl` substitution anchored on `resolveOptions(process.argv.slice(2))` (`src/cli.ts:138` at cut). If that line
  changes, the substitution matches nothing and the plant's template still lands. `mk` (file list) and the plant check
  (stand-in lines on the template) both pass. Limb 2 then reads `does not fire` on the plant and on its twin, so the
  `TW` comparison reads `identical`.
  - Measured at cut, today's harness, head instrument: at a scratch tip whose only change splits that line into
    `const argv = process.argv.slice(2);` + `resolveOptions(argv)`, the harness exits **0** with `25 of 25`.
  - QE's D2 copy (the anchor changed to `slice\(9\)`) gives the same, at `fb6d7565` (QE) and at `219e8e33` (cut).
- **The trigger and the reading are far apart.** `src/cli.ts` is the composition root; feature tickets edit it
  (`ABC-174`, `ABC-096`, `ABC-101`, `ABC-095` in its last five commits). The harness runs only at clause (b) hops. So
  the row goes silent in one hop and is read in a later one. At that hop, the exit code and the summary line read all
  clear, and no diff in that hop points at the row.
- **The harness promises more than it checks.** Its header says the plant check exists "so a plant whose anchor drifts
  never runs as a silent control". For `PP-EDIT` that is false today.
- **The same hole, by a harness edit** (measured at cut, not by QE). Drop the one `printf` that appends `leak()` to
  `pp`'s plants. Today's harness then still exits **0** with `25 of 25`. `PP-TPL`, `PP-REDIR` and `RA-PLUS` read
  `does not fire` on both sides of limbs 2 and 3.
- **Why only the `TW` rows.** Their limbs 2 and 3 are checked only as equality with `341da4c1` on a twin. That holds
  whenever plant and twin are equally blind. Limb 1 has an expected verdict on every row, and the other 20 rows
  compare limbs 2/3 with `341da4c1` on the same plant.

*Value:* every `TW` row is red whenever its plant stops exercising what the row is named for. `25 of 25` again means
that all five `ABC-195` rows were exercised.

## Scope

One file: **`.grugops/context/design-F-072-1/probe/r2-mutants.sh`**.

1. **The guard.** The harness exits non-zero, naming the row and limb, whenever a `TW` row's plant no longer reads as
   that row expects on limbs 2 and 3 at head. That covers `PP-TPL`, `PP-REDIR`, `RA-PLUS`, `PP-EDIT` and `SP-N5`.
   Either of QE's two shapes may be built, if `A2`–`A6` hold:
   - (a) each `TW` row asserts its own expected limb 2 and limb 3 verdicts. This was prototyped at cut. At head they
     are `FIRES`/`FIRES` on four rows and `FIRES`/`does not fire` on `PP-EDIT`;
   - (b) the plant check also requires each plant's capability line in that plant's diff.
2. **The header comment** states the guard, and says nothing beyond what it checks.

`r2-mutants.out.txt` is regenerated only if the head output changes. With prototype (a) the output does not change:
177 lines, byte-equal.

## Out of scope

- **The instrument** (`clause-b.mjs`), **`ADR-0036`**, any `src/` file, `AGENTS.md`, `memory-bank/`, git config and
  `.gitattributes`. The `ABC-195` ADR block describes the plant check as it is. It promises no more, so it stays true.
- **Changing the plants.** Security/NFR's plant bodies and `PP-EDIT`'s in-place edit stay as they are. The guard makes
  a drift loud. It does not make the anchor drift-proof. Re-anchoring a plant after a drift is the next hop's work.
- **The 20 earlier rows.** Several make two or more substitutions in one file (`P2c`, `X1`, `G1B`, `REN`, `BIN-NUL`,
  `BIN-ATTR`), and `mk` checks only the file list (`QE-182-a`). Whether a partly applied substitution there can leave
  a row green is `UNKNOWN - verify`: it was not measured, and it is not in `QE-195-a`. Those rows carry an expected
  limb 1 verdict and compare limbs 2/3 with `341da4c1` on the same plant.
- **`QE-195-b`, `QE-195-c`** (INFO, no action), and the `GIT_DIFF_OPTS` rider (fenced at `ABC-195`).

## Acceptance (Given/When/Then)

"Base" is `main` at pull time (`219e8e33` at cut). Every harness run is in a scratch clone OUTSIDE the repository,
with its own `.git`, private `HOME`/`TMPDIR`/`GIT_CONFIG_GLOBAL` and `GIT_CONFIG_NOSYSTEM=1`, with `GIT_DIFF_OPTS` and
`GIT_EXTERNAL_DIFF` unset. The instrument is base's `clause-b.mjs`, called "head's" below (sha-256 prefix
`24b963b14fa4f1bf` at cut), unless named otherwise. Drift copies are harness copies with one line changed, kept in
scratch.

The three drifts:
- **D2:** `pe`'s in-place anchor `resolveOptions\(process\.argv\.slice\(2\)\)` becomes `…slice\(9\)…`.
- **R:** a scratch commit on base whose only change is `src/cli.ts`'s
  `const resolution = resolveOptions(process.argv.slice(2));` split into `const argv = process.argv.slice(2);` +
  `const resolution = resolveOptions(argv);`. The harness itself is unchanged; it runs with that commit as `<tip>`.
- **L:** the `printf` that appends `leak()` in `pp` is removed.

- **`A1`: files and waiver.**
  - `git diff --name-only main...HEAD` lists `r2-mutants.sh`, plus `r2-mutants.out.txt` only if `A4`'s head output
    changed. Otherwise only this hop's own records appear (notes under `.grugops/context/*/notes/`, `.grugops/queue/`,
    this page and `plans/board.md`).
  - The UAT waiver form in `AGENTS.md` prints nothing.
- **`A2`: base is red on all three drifts.** **Given** base's harness, **when** it runs with D2, at R, and with L,
  **then** each exits 0 with `25 of 25`. That is the hole.
  - For D2 and R, `PP-EDIT` reads `L2 … identical (limb 2: does not fire)`. For L, `PP-TPL`, `PP-REDIR` and `RA-PLUS`
    read `does not fire` on limbs 2 and 3.
  - *(Measured at cut, at `219e8e33` and R = scratch `99518856`: all three rc 0, `25 of 25`.)*
- **`A3`: the fix is red on all three.** **Given** the fixed harness, **when** it runs with D2, at R, and with L,
  **then** each exits non-zero, and its output names the silent row and limb:
  - `PP-EDIT` limb 2 for D2 and R;
  - `PP-TPL`, `PP-REDIR` and `RA-PLUS`, limbs 2 and 3, for L.

  No other row is named.
  - *(Measured at cut with prototype (a): D2 and R rc 1, `…not as the row expects …: PP-EDIT:limb2`; L rc 1, the
    six limbs.)*
- **`A4`: head is green and unchanged.** **Given** the fixed harness at base, head's instrument, **when** it runs,
  **then** it exits 0 with `25 of 25`. The 20 earlier rows' output (139 lines, header line excluded) is byte-equal
  (`cmp`) to base's harness on the same tip.
  - *(Measured at cut: prototype (a)'s whole output, 177 lines, is byte-equal to base's; the 139 lines read sha-256
    prefix `692a5a3e34a820a6` on both.)*
- **`A5`: base's instrument is still red.** **Given** the fixed harness and the pre-`ABC-195` instrument
  (`git show 99d07d32:.grugops/context/design-F-072-1/probe/clause-b.mjs`, sha-256 prefix `2c0c1985e6607110`),
  **when** it runs at base, **then**:
  - it exits 1;
  - it still prints `limb 1 MISMATCH: RA-PLUS SP-N5`;
  - its `limbs 2/3 DIFFER` line names the same 9 limbs as base's harness:
    `PP-TPL:limb2 PP-TPL:limb3 PP-REDIR:limb2 PP-REDIR:limb3 RA-PLUS:limb2 RA-PLUS:limb3 PP-EDIT:limb2 SP-N5:limb2
    SP-N5:limb3`.

  It may print more lines.
  - *(Measured at cut: the `DIFFER` line is identical to base's harness, and the 139 lines are byte-equal. One new
    line names the same 9 limbs as not as expected.)*
- **`A6`: QE's other drifts still exit 2.** QE's D1 (`pp`'s template anchor), D3 (`SP-N5`'s name without a space), D4
  (`PP-TPL`'s twin keeps `++`) and D5 (`pe`'s template anchor), as in `…observation-741eebba`, each exit 2 naming the
  plant at base.
  - *(Not re-run at cut: prototype (a) does not touch `mk`, `hh` or `pc`. Shape (b) does touch `pc`, so the builder
    re-runs these four either way.)*
- **`A7`: gates equal base.** Lint, typecheck and build exit 0. `npm test` exits 0 at 59 files / 1994 tests, equal to
  base, and `.test-results/last-run.json` reads `success` true. The skip count as spelled is 0, and the gate reads
  `No findings.`. `biome.json` is unchanged.

## Dependencies

- **None blocking.** `ABC-195` is merged (`219e8e33`), so the five `TW` rows and the plant check are on `main`.
- **No file overlap.** `ABC-178`, `ABC-189` and `ABC-190` (Backlog) touch no file under
  `.grugops/context/design-F-072-1/probe/`.
- **Gates no merge.** This is a LOW hole in a test harness, not a missed criterion. `AR-193-HUNKHDR` stays closed.
  QE's `A3` reading shows three other rows exercise the same header window today (noA reds 6 limbs without
  `PP-EDIT`).
- **Upkeep:** the expected verdicts are head-specific, like limb 1's. A later instrument hop that changes a `TW` row's
  verdict updates that row's expectation in the same diff, as it already does for limb 1.

## Security / NFR triggers

- **Test integrity** (`quality.test_integrity: warn`). It closes a silent path past the harness that guards clause (b)'s
  routing evidence. The target is observable: three named drifts exit non-zero, naming the row and limb (`A3`), and
  head stays byte-equal (`A4`).
- **`NFR-008`:** the harness is not in `npm test`. 0 new children and 0 new suite rows. No timing target is set, and
  none is taken.
- No new security surface. No `security.block_on` threshold applies.

## Test notes

1. **Measure base before the fix** (`A2`). Then measure the fix (`A3`–`A6`), in the scratch clone and environment the
   acceptance names. Never in a worktree, and never with a repository git config or attribute.
2. **The prototype is not a design.** It lives in BA/PM's session scratch, with 8 changed and 3 added lines. One trap
   if shape (a) is built: the row's existing `printf` passes `$b` unquoted, so a status word with spaces splits. The
   prototype quoted it, and the head output stayed byte-equal.
3. **R needs a scratch commit**, not a harness copy. That is the real trigger: an unrelated `src/cli.ts` change.
4. **Gates:** lint, typecheck, build, `npm test`, skip count 0. A QE hop is owed. The UAT waiver is expected (0
   production lines). A waiver is not a signature.
5. **Builder:** Architect/Design, who built the harness at `ABC-182`, `-188`, `-191`, `-193` and `-195`. No timing at
   any hop.

## Size and priority

**`XS`:** one guard in one harness file over five existing rows, plus a header sentence. It adds no row and no plant,
and it changes no instrument. Prototype (a) was measured at cut in 12 harness runs (base and fix, each on the drifts and on both instruments).

**`P3`:** `QE-195-a` is LOW, proposed (unrated), and gates nothing. It is cut, not accepted, because:
- the trigger is an unrelated `src/cli.ts` refactor in some other hop, so no diff-reading owner rule sits where the
  drift happens (unlike `QE-194-a`/`-b`, where only an edit to the guarded file itself opens the hole);
- the class is bounded, and one guard closes it for all five rows (measured);
- the harness's own header promises that this cannot happen.

## Definition of Ready

BA/PM, 2026-10-21 at `219e8e33`. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** a `src/cli.ts`-only refactor, D2 and L each leave today's harness at rc 0, `25 of 25` (measured at cut; D2 also by QE) |
| 2 | scope and out-of-scope clear | **✅** one file. The instrument, the ADR, the plants, `src/` and the 20 earlier rows are fenced, each with its reason |
| 3 | INVEST-shaped | **✅** independent (no overlap; gates nothing); valuable alone; `XS`; each criterion is an exit code, a named row or a `cmp` |
| 4 | acceptance testable and measurable | **✅** three drifts rc 0 at base and non-zero at fix naming the row/limb; head 25/25 with 139 lines byte-equal; base instrument rc 1 with the same 9 limbs; QE's four drifts rc 2; 59/1994 |
| 5 | dependencies known | **✅** `ABC-195` merged; no overlap; the verdict upkeep is named |
| 6 | security/NFR triggers with a measurable target | **✅** test integrity via `A2`/`A3`; `NFR-008` 0 children, 0 timing |
| 7 | test notes present | **✅** five |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3` |
| 10 | no major unresolved blocker | **✅** none. Whether the 20 earlier rows have a like hole is `UNKNOWN - verify` and fenced; it does not block this |

Column moves after `Ready` are the Orchestrator's.

## QE

**QE/E2E, 2026-10-22 (subtask `qe-ABC-196`), at `grugops/qe-ABC-196` merge `35a2d708` (`main` `5d3832ef` into tip `0492a007`; harness `6d15460b`; base `a7857e0b`). Verdict: PASS_WITH_GAPS.**
- **Merges.**
  - At first `git merge main` reported `Already up to date` (`main` was `a7857e0b`, the base), and the criteria below were read at `0492a007`.
  - `main` then moved to `5d3832ef`: ABC-168 merged, bringing a new production file `src/uci.ts`. I merged it at `35a2d708` with no conflict.
  - At `35a2d708` I re-ran the gates and 19 harness runs (A2–A6, E1/E2/E4, R and R3 rebuilt on that tip). All reproduce.
  - The head output moves only in the Ruling 2 holder counts (+1, `src/uci.ts`), on base's and the fix's harness alike. Base and fix are still byte-equal (lines 2–140 `1b87c526f22b01c7`).
- **How.** I read every criterion from my own runs before I opened the Architect's `…7cd5d10a`/`…d955ee60`. Those notes agree on every shared number, and my harness copies hash the same as theirs.
- **Environment.** Every run went through one wrapper: private `HOME`, `TMPDIR` and `GIT_CONFIG_GLOBAL` (an empty file), `GIT_CONFIG_NOSYSTEM=1`, with `GIT_DIFF_OPTS` and `GIT_EXTERNAL_DIFF` unset. `<repo>` was a full scratch clone with its own `.git`. 46 harness runs; no timing.

- **A1 MET.** `main...HEAD` lists `r2-mutants.sh` plus the 2 Architect notes. The waiver prints nothing.
- **A2 MET.** Base's harness exits 0 at `25 of 25` on D2, at R (scratch `521eac8a`) and on L. For D2 and R, PP-EDIT reads `L2 … identical (limb 2: does not fire)`. For L, PP-TPL, PP-REDIR and RA-PLUS read `does not fire` on limbs 2 and 3.
- **A3 MET.** The fix exits 1 on each. Line 177 alone differs from base's, and it names `PP-EDIT:limb2` (D2, R) or the six limbs of PP-TPL, PP-REDIR and RA-PLUS (L). No other row is named.
- **A4 MET.** At base: rc 0, `25 of 25`, 177 lines, `cmp` byte-equal to base's harness. Lines 2–140 hash to `a00519f3ddcc2ca2` on both. At `0dfd17b3` the fix's output equals the committed `r2-mutants.out.txt`.
- **A5 MET.** With the pre-`ABC-195` instrument (`2c0c1985e6607110`): rc 1, `limb 1 MISMATCH: RA-PLUS SP-N5`, and a DIFFER line identical to base's (the 9 limbs). One added line names the same 9.
- **A6 MET.** D1, D3, D4 and D5 each exit 2, naming PP-TPL, SP-N5, PP-TPL and PP-EDIT.
- **A7 MET.**
  - Lint, typecheck and build exit 0.
  - `npm test` exits 0 at 59 files / 1994 tests (= base) at `0492a007`, and at 60 files / 1995 tests (= `main` after ABC-168) at `35a2d708`. `last-run.json` reads `success` true at both.
  - The skip count as spelled is `0` → `No findings.` `biome.json` is unchanged.

**Own drifts:**
- **The guard reads exactly.**
  - E1, a wrong expectation word: red, naming `PP-TPL:limb3`.
  - E2, a row's expectation pair dropped: red, naming `SP-N5:limb2 SP-N5:limb3`.
  - E4, leak() without `fetch`: red, naming the three `:limb3` only.
- **"Which line fires" is constructible (`QE-196-a`).**
  - The drift is R3, scratch `3d26dff8` (and R3' `36f19186` at the merge). It is a `src/cli.ts`-only refactor: `main` becomes an arrow `const`, and `printableOf` moves below it. tsc is 0, biome is clean, and 59 / 1994 (60 / 1995 at the merge) pass, so it would merge.
  - It puts `pe`'s template below the argv read. The fixed harness exits 0 at `25 of 25`.
  - With the pre-`ABC-195` instrument, `PP-EDIT:limb2` is no longer named (9 → 8 limbs). PP-EDIT keeps reading FIRES, on a line the broken instrument also reads.
  - The other three `++` rows still discriminate.
- **For the other rows (`QE-196-b`).**
  - For PP-TPL, the same limit needs a harness edit (W2).
  - I could not make SP-N5 silent: W3 stays DIFFER through the changed-file list.

**Gap register** (none blocks, none is against a criterion):
- `QE-196-a` (LOW, proposed). The verdict-word-only limit lets a mergeable `src/cli.ts`-only refactor take PP-EDIT's part of `AR-193-HUNKHDR` out silently. → BA/PM: record, or cut an XS harness hop. One shape: each `TW` row requires the pre-`ABC-195` instrument not to read it as expected. Another: the plant check also requires the row's limb 2 line after the stand-in line.
- `QE-196-b` (INFO). For PP-TPL, PP-REDIR and RA-PLUS the limit is reachable only by a harness edit; SP-N5 was not reached. → record.
- `QE-196-c` (INFO). The exit-1 header line runs 188 characters, and `Exit 0:` does not name the new list. The header promises nothing it does not check. → none.

**`QE-195-a`: close condition met.** UAT waived (0 `src/` lines; a waiver is not a signature). Notes: `.grugops/context/qe-ABC-196/notes/` (`…observation-a8e8fbc8` criteria, `…observation-7e6804d4` drifts, `…observation-143f86d8` gates and artifacts, `…observation-c6b997d0` the re-merge, and `…decision-df052eb2` the verdict, which supersedes `…decision-fd211043`).
