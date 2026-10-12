---
id: ABC-154
title: "The QE-hop detector's test has no positive control on its whole-tree read — a `readNotes` that drops notes only when unfiltered stays green"
status: backlog
column: Backlog
size: XS
priority: P3
epic: —
feature: —
---

# ABC-154 — make `ABC-105`'s whole-tree read non-vacuous with one positive assertion, and fix the stale "neither" in `main`'s JSDoc: ZERO production lines, ZERO new spawns, still 2 whole-tree reads

> **Cut 2026-10-12 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-fold-ABC-105-153`), from `ABC-105`'s
> QE4 verdict (`.grugops/context/qe4-ABC-105/notes/…6a647762`; readings `…6df3826a`):
> - **`QE-105-z`** (LOW) is the reason for this ticket;
> - **`QE-105-y`** (LOW, wording) is folded in, because it edits the same pair of files, and one QE hop with
>   one lane re-read is cheaper than two.
>
> Every reading below is QE4's, cited and not re-run. **This hop took no timing reading.**

## Problem

*User:* the next hop that edits `readNotes` in `tools/grugops/qe-hop-integrity.js`, or the test file's shared
memos (`allNotes()`, `plainSweep()`). That hop needs the lane to go red if the whole-tree read starts losing
notes.

*Pain:* `fix2-ABC-105` cut the file's whole-tree reads of the real notes from 5 to 2. Both are lazy memos.
Nothing checks that either one returns real notes. QE4 planted three faults (`…6df3826a`, plant text in
`.grugops/context/qe4-ABC-105/probe/plants4.py`), and each one turns **0 tests red**, at the merged code and
at the code before the seam:
- `q4a-readNotes-unfiltered-drops-secnfr`: the sweep reads 132/38/77/**0**/**17**;
- `q4a-readNotes-unfiltered-drops-quality-gate`: the sweep reads 132/38/**67**/**3**/**24**;
- `q4b-both-memos-empty (two faults)`: both memos are empty, and everything stays green.

`A4` does not pin 77/2/15, by design. And **`A3`'s unfiltered check passes on an empty read.** That check is
the one `QE-105-p` was closed with (`qe2-ABC-105/…3bc30c08`). With an empty or thinned read, `coverage()`
can lose the folder condition again, and `A3`'s unfiltered check would not see it.

*Direction of the harm:* a dropped note can only reduce coverage. The tool can then report a false finding,
but never a false pass. The `--ticket` check at the `Done` exit uses the filtered read, so it is not
affected. The harm is to the **test**: the `QE-105-p` closure becomes vacuous. Hence `P3`, not `P2`.

*Value:* one positive assertion on each shared read restores the closure, at no extra read.

## Scope

1. **In `tools/grugops/qe-hop-integrity.test.ts` only:** add positive assertions over the real notes that
   fail when the whole-tree read is empty or thinned. QE's example (`…6a647762`) is
   `coverage("ABC-031", allNotes(), snapshotIds)` reads as covered (`qe-e2e`). Covering both measured drops
   also needs a substitute-class check, for example `coverage("ABC-072", allNotes(), snapshotIds)` reads as the
   `security-nfr` substitute. The Engineer picks the shape and the ids. The acceptance criteria are the
   plants, not this example.
   - Use the existing memos. **No new whole-tree read.**
   - At most **one** new `it`. Assertions added inside an existing `it` are fine.
2. **In `tools/grugops/qe-hop-integrity.js`, the `main` JSDoc only (`QE-105-y`):** the continuation line
   "the command line can supply **neither**" now covers three options (`snapshotIds`, `root`, `notes`).
   Reword it to say the command line can supply **none of them**. No other byte of the tool changes.

## Out of scope

- **Any code line of `tools/grugops/qe-hop-integrity.js`.** In particular, there is **no** `lstat` of the context
  root (`QE-105-r` is accepted as `AR-105-SYMLINK-ROOT`; see `ABC-105` § Fold).
- **Pinning the sweep's 77/2/15.** `A4` leaves it unpinned on purpose, because the counts move with the board.
- **`tsconfig.json`, `biome.json`, `AGENTS.md`, the board, `src/`.** `QE-105-u` is accepted as
  `AR-105-ALLOWJS`.
- **Any timing reading at build.** The lane is read at QE (see `N8-LANE`).

## Acceptance (Given/When/Then)

The plants are loaded **verbatim** from `.grugops/context/qe4-ABC-105/probe/plants4.py`, plus the 23 recorded
plants that file loads from QE's, QE2's and fix's probes. Each is applied to a scratch copy **outside the
repository**. *Base* is `main` at the pull. The tool and the test there are both `cmp` 0 to `8fd0c233`,
measured at the cut base `6ae6dd27`.

- **`A1` (the whole-tree read is non-vacuous).** **Given** the head test file, **when** each of
  `q4a-readNotes-unfiltered-drops-secnfr`, `q4a-readNotes-unfiltered-drops-quality-gate` and
  `q4b-both-memos-empty (two faults)` is planted, **then** each turns **≥ 1** test red at head. On the base
  test each is **0** red. The unmutated head is green. The delivery note records all six readings (3 plants ×
  base and head).
- **`A2` (no catch lost).** **Given** the 23 recorded plants and the 9 in `plants4.py`, **when** each runs
  against base and head, **then** every test that is red at base is also red at head, by name (head ⊇ base for
  each plant). The table goes in the delivery note.
- **`A3` (`QE-105-y`).** **Given** `git diff <base> -- tools/grugops/qe-hop-integrity.js`, **then** every changed
  line lies inside `main`'s JSDoc block. The word "neither" no longer appears there, and the text says the
  command line can supply none of `snapshotIds`, `root` and `notes`.
- **`A4` (fences and cost pins).**
  - `git diff --name-only <base>` lists exactly `tools/grugops/qe-hop-integrity.test.ts` and
    `tools/grugops/qe-hop-integrity.js`, and **0** new files.
  - The test file has **0** spawn sites:
    `grep -cE 'spawn\(|spawnSync\(|execFile\(|exec\(|child_process'` reads 0, as it does at the cut base.
  - Whole-tree reads of the real notes stay **2**. Count them by instrumenting a scratch copy of `readNotes`,
    `fix2-ABC-105`'s method. QE4 read 2.
  - `--sweep` stdout from the head tool is `cmp` 0 to the base tool's on the same tree, because the tool
    change is comment-only.
  - `npm test`: the file count equals base, the test count is base or base + 1, skips are **0**, and integrity
    reads `No findings.`

## Dependencies

- **`ABC-105` — `Done`** (merged `f6400877`). This ticket hardens its test.
- **Architect/Design `design-ABC-105-lane`** (in parallel at the cut): it rules the `N8-LANE` admissibility
  limit (`QE-105-ab`) and records the owner's +0.370 s ruling with `QE-105-x`'s trigger. **Not blocking**, but
  this ticket's QE lane reading uses whatever that hop rules.
- None other. No open ticket touches `tools/grugops/qe-hop-integrity.*`.

## Security / NFR triggers

- **`NFR-008` / `N8-LANE`: THIS TICKET CHANGES THE `N8-LANE` SET AND OWES A LANE RE-READ.** It edits
  `qe-hop-integrity.test.ts` and the tool that file imports.
  - **Count pins:** 0 test files added, ≤ 1 test added, 0 spawns, whole-tree reads still 2.
  - **Cost:** the new assertions read the existing memos, so no extra tree walk is expected. That is not a
    reading. **QE reads the narrow set** (the file against a one-assertion placeholder, `ADR-0035`
    decision 2) at **650 ms CPU**, at width 1, in a quiet window, under the admissibility rule `design-ABC-105-lane`
    rules.
  - **Whether that reading also discharges `QE-105-x`** (the formal reading owed since the owner merged
    `ABC-105` on +0.370 s) **is the Architect's to say**, not this page's.
- **Security:** not triggered. The diff is a test and a comment. It has no input path, network or dependency.

## Test notes

1. **Show the gap first.** Plant `A1`'s three on the **base** test to show 0 red, then on the head test.
2. **Plant in scratch copies, never in the worktree.** `git status --porcelain` is empty afterwards.
3. **Load the plant text, do not retype it.** `qe4-ABC-105` loaded the dicts with `ast.literal_eval`; do the same.
4. **Do not inject `notes` under `--ticket`.** With `notes` injected, `--ticket` does not scope malformed
   reporting to T's folders (`QE-105-aa`, closed no-action). The test injects only under `--sweep`; keep it so.
5. **Mandatory gates:** lint, typecheck, build, `npm test`. A QE hop is owed: QE re-plants and reads the lane.
   UAT: with 0 production `src/` lines the waiver reading is expected to be empty. It is measured at the exit,
   never asserted here. `ABC-105`'s own UAT was waived on the owner's word, not by the measurement
   (`QE-105-v`), so the Orchestrator should say which rule it applies.

## Size and priority

**`XS` to build:** one or two assertions over existing memos, plus one comment line.
- **Not `S`:** no new read, file or spawn, and no tool code.
- **The QE hop is not `XS`:** it carries a width-1 lane re-read. Pull it into a window that can hold width 1.

**`P3`:**
- **Not `P2`:** the shipped tool is right (QE4: 23/23 plants, gates green). The blocking `--ticket` path is not
  affected, and the uncaught fault fails closed, as a false finding and never a false pass.
- **Promotion trigger: `P2`, and merge first,** when a ticket that edits `readNotes`, the test's `allNotes()` /
  `plainSweep()` memos, or the tool's note-reading path is cut or pulled.
- **The owner may pull it earlier** to get the `N8-LANE` reading that `QE-105-x` owes. That is his call, routed
  through the Architect's trigger.

## Definition of Ready

BA/PM, 2026-10-12. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** three QE4 plants go 0 red, read in `…6df3826a`; the cause is no positive check on either memo |
| 2 | scope and out-of-scope clear | **✅** one test file plus one JSDoc block; tool code, config and the sweep pin are fenced |
| 3 | INVEST-shaped | **✅** independent; one or two assertions; testable by plants |
| 4 | acceptance testable and measurable | **✅** 3 plants 0 → ≥ 1 red; head ⊇ base on 32 plants; diff fenced to two paths; reads 2; `--sweep` `cmp` 0; counts |
| 5 | dependencies known | **✅** `ABC-105` `Done`; the Architect's lane ruling is consumed, not awaited |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` set changes, re-read owed at 650 ms; count pins 0 / ≤ 1 / 0 / 2 |
| 7 | test notes present | **✅** five |
| 8 | size assigned | **✅** `XS`, with the QE hop's width named |
| 9 | priority assigned | **✅** `P3`, both directions argued, promotion trigger named |
| 10 | no major unresolved blocker | **✅** none |

Column moves are the Orchestrator's.

## Delivery

Software Engineer, 2026-10-12 (subtask `ticket-to-pr-ABC-154`). The branch is
`grugops/ABC-154-positive-control-whole-tree-read`, from `main` `69a1f4b4`. That is a child of the brief's
`c4822697` and changes only the board and the queue; the tool and the test are blob-identical to `8fd0c233`. The
code commit is `0f8036f9`. The detail is in `.grugops/context/ticket-to-pr-ABC-154/notes/`. **No timing reading
was taken.**

- **Shape.**
  - Inside `A3`'s unfiltered `it`, `allNotes()` must read `ABC-031` as `covered (qe-e2e)` and `ABC-072` as the
    `security-nfr` substitute.
  - Inside `A9`'s `--sweep` `it`, `plainSweep()` must not list either id as a finding.
  - There is no new `it` and no new read. The tool's `main` JSDoc now says the command line can supply "none of
    snapshotIds, root and notes".
- **`A1`.** All three plants read **0 red on the base test** (32/32) and **2 red on the head test** (30/32: `A3`
  unfiltered, `A9` --sweep). The unmutated head is 32/32. **PASS.**
- **`A2`.** The 23 recorded plants plus `plants4.py`'s 9 were run on base and head. **Head ⊇ base by name on 32 of
  32.** The 23 recorded plants are identical. The 9 QE4 plants each gain 1 or 2 red at head. **PASS.**
- **`A3`.** The one changed line is in `main`'s JSDoc (line 223), and "neither" is gone from that block. **PASS.**
- **`A4`** (read at `0f8036f9`):
  - the diff is exactly the two files, with 0 new files;
  - 0 spawn sites;
  - whole-tree reads are 2 at base and **2** at head, by instrumentation;
  - `--sweep` and `--sweep --json` stdout from the head tool are byte-identical to the base tool's;
  - `npm test` reads 57 files / 1775 tests at base and at head, with 0 skips;
  - integrity reads `No findings.`.

  **PASS.**
- **Gates.** Lint, typecheck, build and `npm test` all exit 0, and `last-run.json` has `success: true`.
- **UAT-waiver reading.** `git diff --name-only 0f8036f9~1 0f8036f9 | grep -v '\.test\.ts$' | grep '^src/'` is
  empty.
- **Owed.**
  - **The QE hop.** QE re-plants, and reads the `N8-LANE` narrow set at width 1 under `ADR-0035` A1.
  - **The UAT rule.** The Orchestrator states which rule it applies (Test note 5).

## QE

QE/E2E, 2026-10-12 (subtask `qe-ABC-154`, branch `grugops/qe-ABC-154` off `beb0991c`; QE was the only hop running).
**Verdict: PASS_WITH_GAPS.** The detail is in `.grugops/context/qe-ABC-154/notes/` (decision `…d9ae510a`).

- **`A1`–`A4` MET, every one re-read by QE.**
  - **The plant text.** QE loaded it by executing QE4's `plants4.py` verbatim up to `PAIRS`. The SE's load is
    identical on 32 of 32 plants, and base matches QE4's `[new]` rows on 32 of 32.
  - **`A1`.** The three plants read 0 → 2 red.
  - **`A2`.** Head ⊇ base on 32 of 32.
  - **`A3`.** The tool with comments stripped hashes the same at base and head.
  - **`A4`.** Whole-tree reads are 2 = 2. `--sweep` and `--sweep --json` are `cmp` 0. `npm test` reads 57 / 1775
    (+0), skip 0.
- **QE's own plants are all caught at head.** A `readNotes` that drops `by: security-nfr` notes on unfiltered reads
  goes 0 → 2 red. The hash half and the random half are caught, and so is a one-folder `allNotes()` memo. Removing
  any one, or any pair, of the four new expects leaves every fault still caught.
- **`N8-LANE` (`RISK-ABC105-LANE` T-b): MET at 650 ms CPU** at `0f8036f9`.
  - The reading is **+0.380 s (+0.350..+0.410)**. The twin is −0.005 s with R 0.030 s, from one admissible window
    (pre-registered as `b9a5c957`, under the `ADR-0035` A1 rule).
  - Under the catalog this **closes the risk once `0f8036f9` is on `main`**. The record is Architect/Design's to
    write.
- **Gaps.**
  - **`QE-154-a` (LOW).** The positive control is two-point. A real-tree thinning that spares the two control
    folders stays green (sweep 14 / 61).
  - **`QE-154-b`–`d` (INFO):**
    - the A1 forward-only wording (no state depends on it);
    - `F` stays 0.020 s;
    - whether the `T-c` trigger survives the closure;
    - an unexplained load1 rise to 8.88.
- **UAT-waiver reading:** empty (0 production `src/` lines; the tool change is a comment). Which rule applies is the
  Orchestrator's to state.

## Fold (2026-10-12, BA/PM, subtask `bapm-fold-ABC-154`)

This section is append-only. Nothing above it was edited, and no criterion is rewritten. The reasoning and the
readings are in `.grugops/context/bapm-fold-ABC-154/notes/` (decision `…b84edbb6`, readings `…3a619733`). **No
timing was taken.**

| gap | sev | disposition |
|---|---|---|
| `QE-154-a` | LOW | **Accepted as `AR-154-TWO-POINT-CONTROL`. No ticket is cut, and `ABC-156` stays free.** Both green plants spare a control folder by name. Their untuned twins go red (4, `A6`), and the fault fails closed with `--ticket` unaffected. Closing it now would cost a width-1 window, and riding along with the next edit to the set costs none. **Triggers:** **R-a**, a ticket that edits `qe-hop-integrity.test.ts` or the tool's note-reading path is cut or pulled: BA/PM adds `F1`–`F4` to it. **R-b**, a finding is traced to a note on disk that `readNotes` did not return: cut at once at `P2`. **R-c**, the owner pulls it: cut it as the next free id, `XS`, `P3` |
| `QE-154-b` | INFO | Not BA/PM's: `design-ABC-154-close` item 2 (the wording of `ADR-0035` A1's forward-only clause) |
| `QE-154-c` | INFO | Not BA/PM's: `design-ABC-154-close` item 3 (the set's `F`, and whether the 4,000-note `T-c` survives the risk's closure) |
| `QE-154-d` | INFO | Not BA/PM's: `design-ABC-154-close` item 4 (load1 at 8.88 during w1) |

**`AR-154-TWO-POINT-CONTROL`: the acceptance carried when a trigger fires.**
- **`F1`.** `allNotes().length` equals the number of `*.md` names under every non-symlink
  `.grugops/context/<folder>/notes/`. The number comes from a listing that opens no note. The check compares
  two counts and never a literal; both read 2660 at `b89b3fd2`.
- **`F2`.** QE's two green plants, loaded verbatim from `qe-ABC-154/probe/plants6.py` `extra` mode
  (`q5x-…-drops-qe-folders-real-tree-only` and `q5x-…-drops-quality-gate-except-ABC-031 (real tree)`), each turn
  **≥ 1** red at head and 0 at base. The unmutated head is green.
- **`F3`.** Head ⊇ base by name over the 32 plants, QE's `own` plants and the two `F2` plants.
- **`F4`.**
  - Whole-tree `readNotes` calls stay 2. There are 0 spawns and at most 1 new `it`. Skips are 0.
  - The listing's cost is read by the host ticket's `N8-LANE` re-read at 650 ms CPU, never estimated.
  - If that reading is NOT MET, the fallback is one control id per folder form, which is weaker. The lever is
    the owner's.

This option was chosen over "more ids" and a covered-count floor because it is the only one that closes the
thinning class (decision `…b84edbb6`).

**The front matter is stale:** `status: backlog` / `column: Backlog`. The board is authoritative: `Done`, merged
`4537fb11`. Correcting it is the Orchestrator's call. **Column moves recommended: none.**
