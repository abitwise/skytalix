---
id: ABC-105
title: Nothing observes the QE hop — a ticket can reach `Done` with no QE note and no one notices
status: backlog
column: Backlog
size: M
priority: P2
epic: —
feature: —
---

# ABC-105 — make the QE rule observable instead of merely stated

> **Cut 2026-08-17 by BA/PM** (task `cut-qe-detector-2026-08-17`), on the owner's word in session —
> *"yes to the QE detector"* — and item 1 of the Orchestrator's
> `20260817T171157Z-orchestrator-decision-…-three-things-not-decided` note. Counts marked *(2026-08-17)*
> were measured on the cut's tree and are history.
>
> **Amended 2026-10-12 by BA/PM** (subtask `bapm-amend-ABC-105`), folding QE's pre-build re-check
> `QE-105-a`…`-o` (`.grugops/context/qe-recheck-ABC-105/notes/…72ae8565`, sweep `…298a669e`). Each
> change carries the gap id. Struck text is kept in brief as `~~…~~`. Per-gap dispositions and the
> re-measurements, with their commands, are in `.grugops/context/bapm-amend-ABC-105/notes/`.

## Problem

*User*: the Orchestrator, at the `Ready for UAT` → `Done` exit, and every future reader of the board
who assumes a `Done` ticket was validated.

*Pain*: **QE dispatch stopped for five consecutive tickets — `ABC-068`, `ABC-061`, `ABC-062`,
`ABC-063`, `ABC-064` — and no note anywhere records a decision to stop.** It was drift, not a call.
`agent-factory/workflows/04-ticket-to-pr.md` **step 5 already required the hop**, so the rule was
binding and got dropped anyway. `AGENTS.md` § "QE validation authority" and `memory-bank/60-progress.md`
§ "Standing directive — EVERY ticket passes through QE's validation…" now restate it — **and a
restatement shares the exact failure mode of the thing it restates.** Nothing in the repository
*looks*. The rule has no instrument.

*Value*: one command that answers "did QE's verdict get recorded for this ticket?" before the board
row moves. **It converts a silent omission into a red exit** — which is precisely and only the
failure that actually occurred. See `## Out of scope` for what it deliberately does not achieve.

## Scope

Build **`tools/grugops/qe-hop-integrity.js`** — one hand-run node script, `node:` builtins only, on
the exact contract of the repo's precedent `tools/grugops/test-skip-integrity.js` (exit `0` pass /
`1` findings / `2` could-not-run; clear professional voice on stdout; `--json` block).

**1. What it scans, and the ticket → task-folder mapping.** It walks
`.grugops/context/*/notes/*.md` and parses each note's front matter with plain `String.split` — **no
yaml library**. The front-matter fields are the source of truth; the filename is not read (its
convention changed mid-history, front matter did not). *(2026-08-17: 1288 notes, 223 `by: qe-e2e`.
At `21980135`: 2607 / 622, all with fences, `QE-105-k`.)*

A ticket `T` is **covered** when there exists a note that satisfies **all four** conditions:

  - `by: qe-e2e`, and
  - `kind: decision` — QE's *verdict*, not a stray observation, and
  - ~~its `refs:` list contains `T`~~ **some element of its `refs:` list names `T` under `A5`'s
    normalisation** — a bare id, a ticket path (`plans/tickets/ABC-076-…md`) or a note id all count
    *(amended 2026-10-12, `QE-105-b`)*, and
  - the **task folder** it sits in has a name that names `T` under the same normalisation
    (case-insensitive, optional hyphen, zero-padded, boundary-safe: `abc031` ≡ `ABC-031`).

**The fourth condition is the mapping, and it is the whole difficulty of this ticket.** A ticket's QE
work legitimately lives in a folder named for a different task (`quality-gate-ABC-031-qe-2026-08-17`),
so the folder cannot be *derived* from the id — but it can be *required to name it*. **Refs alone are
not enough, measured:** with a refs-only rule `ABC-062` reads as COVERED by a QE note authored for
`ABC-066` that cites `ABC-062` in its refs — a **false pass on one of the five.** The conjunction rejects
it. *(`QE-105-b`: QE measured the token reading of condition 3 against the exact one over all 93
post-cutover rows; only `ABC-076` flips, to covered. `A3`'s `ABC-062` and `A9`'s `ABC-073` are unchanged.)*

**So the convention the detector requires is stated here and becomes the criterion:** *QE's verdict
note for ticket `T` is a `kind: decision` note, authored `by: qe-e2e`, naming `T` in `refs:`, in a
context task folder that is not `T`'s `ticket-to-pr-*` and whose name spells `T` as `ABC-xxx` or
`abcxxx`* (`QE-105-n`: `residual-G-QE115-5-*` spells `QE115` and is not seen). ~~That convention is
documented in `AGENTS.md` by this ticket~~ **It is documented by this ticket in `memory-bank/40-contributing.md`
§ Conventions** *(amended 2026-10-12, `QE-105-f`: `AGENTS.md` has 31 B of headroom; see `A7`)*, so it
is a rule QE follows rather than a shape the detector guesses at.

**2. When it runs.** **Both modes, and neither is CI** (this project has no CI and no git remote).

  - **`--ticket ABC-xxx` — blocking, at the `Done` exit.** The Orchestrator runs it before moving
    any row into `Done` (Workflow 06). Exit `1` stops the move.
  - **`--sweep` — reporting, over every `Done` row on the board.** Run at daily hygiene.
  - **Exit codes for both** *(amended 2026-10-12, `QE-105-d`)*: `0` = no in-scope finding, `1` = at
    least one, `2` = could not run. **Findings stand permanently; this ticket builds no route that
    clears one.** At build `--sweep` therefore **exits 1** and names its 15 findings (`A4`), and it
    keeps exiting 1 while any of them stands. A human reads the list; a later gate built on `--sweep`
    must read the list, not the exit code.
  - **A ticket the owner closes with no QE hop** (a drop, a cancellation, an owner-close) exits `1`
    under `--ticket` like any other. The tool does not read his word and has no flag for it. Such a row
    moves only on the owner's recorded word, and its id then stands as a finding in every sweep —
    which is how 9 of today's 15 got there.

**3. Retroactivity — NO. The cutover is a fixed, named commit** *(amended 2026-10-12, `QE-105-a`)*.
The detector is forward-only from the owner's directive, inheriting `AGENTS.md` § "QE validation
authority"'s own scope (*"Forward-only"*).

**An allowlist of the five is not viable** — a history sweep flags far more than five *(2026-08-17,
over the 38 `Done` rows)*: the loosest sane rule (any `qe-e2e` note in a folder naming the ticket)
flags **9** (the five, plus `ABC-067`, `ABC-071`, `ABC-008`, `ABC-001`); the four-condition rule flags
~~20~~ **30** of 38 *(`QE-105-k`; re-measured at `e908b8e6`, exact and token readings agree)*.

The mechanism is a **generated grandfather snapshot**, `.grugops/qe-cutover-2026-08-17.txt`: the ids
of the line-leading `## Done` rows of **`git show 9998a544:plans/board.md`** — the directive commit
(*"grug write down that every ticket pass through QE"*, 2026-08-17 21:34) — parsed by the tool's own
`Done` parser, written once at build and committed. **38 ids**, one per line (304 B), after a header of
`#` lines naming the owner's declined retro pass as the reason. ~~every ticket already in `Done` on
2026-08-17~~ is struck because it reads two ways: 38 at `9998a544` and at the cut `e908b8e6`, or **40**
at `e23c8484` (23:00), which closed `ABC-031` and `ABC-076` — the first two tickets QE'd under the
directive and `A2`'s proofs. **The set is the 38; `ABC-031` and `ABC-076` are in scope.** A ticket in
the snapshot is reported `out-of-scope (pre-cutover)` and is **never a finding**. Everything that
reaches `Done` after the cutover is in scope, permanently. **The snapshot is never regenerated**; the
tool has no mode that writes it, and the one-off generation command goes in the delivery note.

**4. The self-authorship hole. The ceiling is stated in the tool's header comment and in the
`memory-bank/40-contributing.md` paragraph** *(amended 2026-10-12, `QE-105-f`; was "and in
`AGENTS.md`")*. `AGENTS.md` records for `.grugops/test-skips.md` that *"the agent may not self-author
a justification to clear its own gate."* **This detector does not achieve that property and must not
be described as if it does.** `by: qe-e2e` is self-declared metadata in a hand-authored file. The
precedent `test-skip-integrity.js` takes its decisive input (`--skip-count`) from **outside the
artifact under test**; **this detector has no external signal.** Therefore:

> **What it proves:** a QE verdict note for this ticket exists, is authored as QE's, and is filed
> where the convention requires. **What it does not prove:** that a QE hop ran on the delivered work,
> or that its findings are honest. This is a **completeness check on the record, not evidence of the
> work.** It catches the silent omission — the measured failure of `ABC-061`/`062`/`063`/`064`/`068` —
> and it does not catch deliberate forgery. **Nor can it tell a pre-build QE note from a post-build
> verdict** *(added 2026-10-12, `QE-105-g`)*: `qe-recheck-ABC-105/…72ae8565`, QE's honest pre-build
> re-check, already meets all four conditions for `ABC-105` itself. The covering note's path is printed
> so the human at the `Done` exit can see which note it was.

One cheap hardening is in scope: the verdict note's folder must **not** be the ticket's own
`ticket-to-pr-*` folder, so a fake needs a deliberate second folder rather than a line appended in place.

**5. Test seam — no flag** *(added 2026-10-12, `QE-105-h`)*. The module exports its pieces —
`parseDone(boardText)`, `coverage(id, notes, snapshotIds)` and `main(argv, { snapshotIds? }) → exit
code`; `process.exitCode` is set by a one-line CLI wrapper. The test imports them, reads the **real**
notes and board, and "removes an id from the snapshot" by passing the parsed snapshot **minus that id,
in memory**. **This is not an override:** the command line has no way to supply a snapshot; the CLI
always reads the committed file. **0 spawns.**

## Out of scope

- **Proving the hop ran.** A control with an external signal (a human-owned register in the shape of
  `.grugops/test-skips.md`, or a QE-only credential) is a different, larger ticket and is the owner's to
  commission. **Do not let this ticket grow into it.**
- **A disposition route that clears a standing finding** *(added 2026-10-12, `QE-105-d`)* — any register
  of accepted findings is that same external-signal ticket's question, not this one's.
- **Any retro QE pass, re-filing of off-convention QE notes, or snapshot regeneration.**
- **CI, hooks, a git remote, or any automatic invocation.** Hand-run, both modes.
- **Editing `plans/board.md` row content, or any `.grugops/context/` note.** Read-only over both; the
  tool writes nothing. The snapshot is written once, at build, by the engineer's one-off command.
- **Any `src/` change.** Zero files under `src/`.

## Acceptance (Given/When/Then)

All of `A1`–`A3` and `A9` hold only with the 38-id cutover set (`QE-105-a`).

- **`A1` (it catches the measured failure).** **Given** the tool and the cutover snapshot, **when**
  `main(['--ticket','ABC-061'])` runs with `ABC-061` **removed from the in-memory snapshot** (§ Scope 5),
  **then** it returns **1** and stdout names `ABC-061` and states that no QE verdict note was found.
  **When** run against the committed snapshot, **then** **0**, and `ABC-061` is `out-of-scope
  (pre-cutover)`.
- **`A2` (it passes a real QE hop).** **Given** the tool, **when** run as `--ticket ABC-031` and
  `--ticket ABC-076`, **then** exit is **0** for each and stdout names the covering note's path, under
  `quality-gate-ABC-031-qe-2026-08-17/notes/` and `quality-gate-ABC-076-qe-2026-08-17/notes/` — **not**
  that ticket's `ticket-to-pr-*`. *(`QE-105-b`: `ABC-076`'s two QE decisions cite it only as
  `plans/tickets/ABC-076-…md`; it passes under condition 3's amended reading and must fail under an
  exact-element reading. That is its job here.)*
- **`A3` (the false pass is closed — the criterion that earns the ticket).** **Given** the tool, **when**
  `ABC-062` is removed from the in-memory snapshot and `--ticket ABC-062` runs, **then** **1**: the
  `qe-e2e` decision under `quality-gate-ABC-066-qe/` that cites `ABC-062` in `refs:` **does not** cover
  it, because its folder does not name it. *(A refs-only implementation passes the other criteria and
  fails here. QE counts 2 such notes, not the board row's "three", `QE-105-l`.)*
- **`A4` (the sweep's numbers are exact, and every finding is named).** **Given** `--sweep` on `main`
  at build time, **then** stdout reports on separate lines: `Done` rows; pre-cutover; covered
  (`qe-e2e`); covered (`security-nfr` substitute, `A9`); in-scope findings, **each listed by id** — and
  the exit is **1** (§ Scope 2). `Done` rows are parsed from the line-leading `- [ABC-xxx]` form only
  (*2026-08-17: a naive `ABC-\d+` scan read 42 for 38 rows; at `21980135`, 1217 hits / 137 distinct for 131*).
  - ~~38 `Done` rows and 0 in-scope findings~~ (struck 2026-10-11; the 2026-10-11 list of seven is
    superseded by this one, `QE-105-c`). **Expected, measured 2026-10-12 under the amended rule:**

    | tree | `Done` | pre-cutover | `qe-e2e` | substitute | findings |
    |---|---|---|---|---|---|
    | `21980135` (QE's read) | 131 | 38 | 76 | 2 (`ABC-072`, `ABC-147`) | 15 |
    | `a37a4e12` (this amendment's base) | 132 | 38 | 77 | 2 | 15 |

    *(QE's suggested "75" was the exact-refs count; under the token reading `ABC-076` is covered, so 76.
    The tip adds `ABC-153`, covered by `qe-ABC-153/…-6b2eab82`.)*
  - **The 15, by class** (the delivery note classifies from the board row; the tool does not):
    - **dropped / cancelled (6):** `ABC-038`, `ABC-060`, `ABC-074`, `ABC-108`, `ABC-111`, `ABC-112`;
    - **owner-close, no QE hop (3):** `ABC-092`, `ABC-100`, `ABC-150`;
    - **verified elsewhere (1):** `ABC-073` (Security/NFR verdict filed only in `secnfr-ABC-072`, `A9`);
    - **QE'd, off-convention (5) — new class:** `ABC-044`, `ABC-110`, `ABC-113` (QE decisions only in
      their own `ticket-to-pr-*`); `ABC-070`, `ABC-085` (QE verdict filed as `kind: observation`).
      **These stay findings. The builder must not loosen the four conditions to clear them** — doing so
      re-opens the own-folder hole and the observation-as-verdict hole.
    - **real miss (0).**
  - Every `Done` row lands in exactly one count: pre-cutover + `qe-e2e` + substitute + findings = `Done`. Each
    count equals a hand count of the same rule at the build SHA (QE reads it there; not a pinned test).
- **`A9` (the owner's substitute for docs-only tickets is visible, not silent)** *(added 2026-10-11, on
  the owner's answer 3, note `…owner-word-six-answers-b7c41e09`)*.
  - **Given** a `kind: decision` note authored `by: security-nfr` that meets the other three
    conditions, **when** `--ticket T` runs, **then** exit is **0**, labelled **`covered (security-nfr
    substitute — docs-only rule)`**, distinct from `covered (qe-e2e)`.
  - **`ABC-072`:** exit 0, the substitute label, the path under `secnfr-ABC-072/notes/`.
  - **`ABC-073`:** exit **1** — its only verdict sits in a folder naming `ABC-072` (`A3`'s rule).
  - **The tool does not judge "docs-only".** The human at the `Done` exit applies the owner's rule.
- **`A5` (id normalisation).** **Given** a folder named `abc031-…` and a ticket `ABC-031`, **then** they
  match; `ABC-006` does **not** match `…abc0066…`. The same function decides condition 3 (`QE-105-b`).
  *(Not a substring test. The negative case exists in no real folder, so it is synthetic input.)*
- **`A6` (fail-closed).** **Given** a missing board file, an unreadable note, or a missing snapshot,
  **then** exit **2** with a clear stderr message — **never a silent 0**.
  - **Malformed front matter** *(defined 2026-10-12, `QE-105-e`)*: the first line is not `---`; or no
    later line is `---`; or a non-blank line inside the block is neither `key:` / `key: value` (key
    `[A-Za-z_][A-Za-z0-9_-]*`) nor an indented `- item` after a key. A malformed note is reported as an
    `UNKNOWN - verify` finding with its path: under `--sweep` every one; under `--ticket T` those in a
    folder that names `T`.
  - **Not malformed:** a missing `kind` / `by` / `refs` key (such a note cannot cover anything); an
    inline `refs: [a, b]` (read as one element); quoted values (compared as written).
  - **Expected count at build: 0** (0 of 2607 at `21980135`, 0 of 2618 at `a37a4e12`; 22 notes lack
    `kind`, 30 lack `by`, 7 inline `refs` — all Orchestrator notes, none malformed). A synthetic tree
    proves each of the three malformed shapes reaches the report.
- **`A7` (the ceiling is written down, not implied)** *(amended 2026-10-12, `QE-105-f`, `-g`)*. **Given**
  the delivered diff, **when** the tool's header comment and the new paragraph in
  `memory-bank/40-contributing.md` § Conventions are read, **then** both state in plain words that the
  presence of a note is **not** proof a QE hop ran, that the tool is a completeness check on the record,
  and that a pre-build QE note satisfies it (naming `qe-recheck-ABC-105` as the example); the paragraph
  also states the § Scope 1 convention. **No line of either claims the tool prevents self-authorship.**
  ~~the new `AGENTS.md` paragraph~~. **And** `wc -c AGENTS.md` is **≤ 24,576** after the diff.
- **`A8` (0 files under `src/`).** **Given** `git diff --numstat`, **then** **0** files under `src/`
  changed and the suite is green with skip count **0**. ~~`PERFT_DEEP=1` is 32/32 exact~~ *(struck
  2026-10-12, `QE-105-j`: a diff with no `src/` file cannot move perft; the lane costs minutes and reads
  nothing about this ticket)*.

## Dependencies

**None blocking.** Reads `plans/board.md`, `.grugops/context/` and `git show 9998a544:plans/board.md`
(once, at build), all on `main`.

~~**Ordering note:** the snapshot must be generated from the board as it stands when this lands …~~
*(struck 2026-10-12, `QE-105-a`: a land-time snapshot at `21980135` is 131 ids and 0 in scope.)*

**`AGENTS.md` bytes** *(amended 2026-10-12, `QE-105-f`)*: **24,545 B** of the 24,576 B target at
`a37a4e12` (`wc -c`, last touched `e1f23b8d`) — **31 B** left. The ticket's text lives in
`memory-bank/40-contributing.md`. **The Scribe, at the pull:** tighten `AGENTS.md` first, without losing
a reading, to free room for one pointer line under § "QE validation authority" to that paragraph, then
add it. If the bytes cannot be freed that way, **no `AGENTS.md` edit**, and the delivery note says so.
Either way `A7`'s byte bound holds.

## Security / NFR triggers

- **`NFR-008` / `N8-LANE`** *(rewritten 2026-10-12, `QE-105-i`, `-j`)*: the count pin is **1 test file
  added** — `tools/grugops/qe-hop-integrity.test.ts` ~~or its `src/`-side equivalent~~ — **0 spawns,
  0 files under `src/`**. Its cost is read under `ADR-0035` decision 2 on its **narrow set** (the file
  against a one-assertion placeholder at the same path), on vitest 4.1.11, runner off, `maxWorkers: 2`.
  The bound is **650 ms CPU** (fixed under R-1); until the file's first 4.1 reading its per-set floor
  `F` is the provisional **16 %** of its base CPU, and 650 ms resolves only at or above `F`. The file
  sits under `tools/`, so **`npm test` collects it and `npx vitest run --dir src` does not**
  (`QE-093-d`). The test walks the real notes tree (2618 files at `a37a4e12`); its cost is read at QE,
  not estimated here.
- **Security: low, and one real item.** The tool reads two trees and writes nothing. **It must not
  execute anything it reads** and must not follow symlinks out of `.grugops/context/` (0 symlinks
  there today, `…298a669e`). No network, no new dependency, no user surface.

## Test notes

1. **Test `A2`, `A3` and `A9` against the real notes on disk, not a fixture.** The false pass is a
   property of this repository's actual history. `A5`'s negative and `A6` need synthetic input.
2. **Test the negative direction.** Every criterion that asserts `1` is shown going `0` → `1` on a single
   controlled change — for `A1`/`A3`, the in-memory snapshot minus the id (§ Scope 5).
3. **Do not add a `--force`, `--skip`, `--allow` or `--snapshot` flag.** A per-run override reintroduces
   the silent-drift failure this ticket exists to close. Scope exclusion is the committed snapshot, or
   nothing.
4. **Report the sweep even when it is red.** ~~"38 Done rows, 20 pre-cutover, 18 in scope, no findings"~~
   *(impossible: all 38 are pre-cutover, `QE-105-d`)*. At `a37a4e12` the deliverable reads: `132 Done
   rows · 38 pre-cutover · 77 covered (qe-e2e) · 2 covered (security-nfr substitute) · 15 findings:
   ABC-038 …`, exit **1**. "No findings." alone hides the denominator.
5. **Pin the snapshot** *(added 2026-10-12, `QE-105-a`)*: the test asserts the committed file holds 38
   ids, includes `ABC-061` and `ABC-062`, and excludes `ABC-031` and `ABC-076`.

## Lane cost — how many test FILES this ticket implies

**One**, under `tools/` (see `N8-LANE`).

## Size and priority rationale

**Size `M` (3)** *(amended 2026-10-12, `QE-105-m`: ~~`M` (5)~~ — board § Conventions maps `M=3, L=5`;
the label was the cut's intent, since it names what would make it `L`)*. It is bigger than it looks:
front-matter parsing with builtins over ~2,600 notes; `Done` parsing where the naive read is wrong;
id normalisation used twice (folder and refs); the ticket→folder mapping whose obvious implementation
gives a **measured false pass on `ABC-062`**; the fixed-commit snapshot; and the test seam. This
amendment removes the open design questions; it adds no new piece of work. **What would make it `L`:**
any attempt to prove the hop actually ran — out of scope by design.

**Priority `P2`.** It guards a directive that has failed silently once in this repository; it ships no
player-visible value. **Demotion trigger:** if the Orchestrator records the `--ticket` check as a
manual step in its own `Done` routine before this is built, drop to `P3` (not fired at `21980135`,
QE's item 5). **The owner may bump this to `P1`; that is his call.**

## Definition of Ready — re-score 2026-10-12 (BA/PM, `bapm-amend-ABC-105`, base `a37a4e12`)

Against `agent-factory/checklists/definition-of-ready.md` (10 items). **Result: 10 of 10. Recommend
`Backlog → Ready`.** `column`/`status` are not moved here; that is the Orchestrator's.

| # | item | 2026-10-12 |
|---|---|---|
| 1 | problem clear | ✅ unchanged |
| 2 | scope and out-of-scope clear | ✅ cutover fixed at `9998a544`; exit semantics with standing findings; test seam; no disposition route |
| 3 | INVEST-shaped | ✅ independent; `M` (3) |
| 4 | acceptance testable and measurable | ✅ `A4` expected counts at two named trees, 15 findings by id and class; `A6` "malformed" defined, expected 0; `A2` now holds on `ABC-076` |
| 5 | dependencies known | ✅ none blocking; § Dependencies ordering note struck; `AGENTS.md` 31 B with the Scribe's steps named |
| 6 | security/NFR triggers with a measurable target | ✅ `N8-LANE` in today's terms: 1 file, 0 spawns, 650 ms on the narrow set, `F` 16 %; no-exec, no symlink escape |
| 7 | test notes present | ✅ five; note 4's example re-written to a reachable sweep |
| 8 | size assigned | ✅ `M` (3) on the board's scale |
| 9 | priority assigned | ✅ `P2`, demotion trigger not fired |
| 10 | no major unresolved blocker | ✅ the ceiling was acknowledged by the owner's answer 5 (2026-10-10); `QE-105-a` and `-b` are folded |

## History (condensed 2026-10-12, `QE-105-o`; full prior text: `git show a37a4e12:plans/tickets/ABC-105-qe-hop-detector.md`)

- **2026-08-17 cut** — DoR 9/10; item 10 ⚠️ was the owner's acknowledgement of the ceiling. Notes:
  `.grugops/context/cut-qe-detector-2026-08-17/notes/` (`…a1c47e02`, `…b7f30d14`, `…c5e91a63`, `…e4b18d57`).
- **2026-10-10 re-score** (`bapm-rescore-backlog-r1-2026-10-10`) — stays 9/10. A rough sweep found
  `ABC-072`/`ABC-073` closed with Security/NFR in place of QE: a recorded routing call, not silent drift.
- **2026-10-11 re-score** (`bapm-batch-2026-10-11`, `…f4950252`) — 10/10. Owner answer 5 (*"yes, it is
  enough"*) acknowledges the ceiling; answer 3 becomes `A9`; `A4`'s "0" struck.
- **2026-10-12 QE pre-build re-check** (`qe-recheck-ABC-105`, `…72ae8565`, `…298a669e`) — BUILDABLE WITH
  PAGE AMENDMENTS, 2 HIGH / 6 MEDIUM / 7 LOW; Ready → Backlog. Folded by this amendment.
