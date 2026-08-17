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
> `20260817T171157Z-orchestrator-decision-…-three-things-not-decided` note. **Every count in this
> ticket was measured against this repository on 2026-08-17, not estimated.**

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
`.grugops/context/*/notes/*.md` and parses each note's YAML front matter with plain `String.split`
— **no yaml library** (builtins only, same rule as the precedent). *Measured 2026-08-17: all 1288
notes carry front matter; 223 carry `by: qe-e2e`; all 223 also match the filename form
`^\d{8}T\d{6}Z-qe-e2e-`.* The front-matter fields are the source of truth and the filename is not
read — the filename convention changed mid-history (older notes are
`<ts>-qe-e2e-<kind>-<hash>.md`, today's are `<ts>-qe-e2e-<kind>-<slug>-<hash>.md`) and front matter
did not.

A ticket `T` is **covered** when there exists a note that satisfies **all four** conditions:

  - `by: qe-e2e`, and
  - `kind: decision` — QE's *verdict*, not a stray observation, and
  - its `refs:` list contains `T`, and
  - the **task folder** it sits in has a name that contains `T` after normalisation
    (case-insensitive, optional hyphen, zero-padded: `abc031` ≡ `ABC-031`).

**The fourth condition is the mapping, and it is the whole difficulty of this ticket.** A ticket's
QE work legitimately lives in a folder named for a different task (`quality-gate-ABC-031-qe-2026-08-17`,
not `ticket-to-pr-ABC-031-2026-08-17`), so the folder cannot be *derived* from the ticket id — but it
can be *required to name it*. **Refs alone are not enough and this was measured, not feared:** with a
refs-only rule `ABC-062` reads as COVERED, by a QE note authored for `ABC-066` that merely cites
`ABC-062` in its refs — a **false pass on one of the five tickets this ticket exists because of.**
The conjunction rejects it correctly.

**So the convention the detector requires is stated here and becomes the criterion:** *QE's verdict
note for ticket `T` is a `kind: decision` note, authored `by: qe-e2e`, carrying `T` in `refs:`, in a
context task folder whose name contains `T`.* That convention is documented in `AGENTS.md` by this
ticket, so it is a rule QE follows rather than a shape the detector guesses at.

**2. When it runs.** **Both modes, and neither is CI.** *Measured fact, not an assumption: this
project has no CI and no git remote.* The precedent is a hand-run script and so is this.

  - **`--ticket ABC-xxx` — blocking, at the `Done` exit.** The Orchestrator runs it before moving
    any row into `Done` (the `Ready for UAT`/`In UAT` → `Done` transition, Workflow 06). Exit `1`
    stops the move. This is the mode that matters.
  - **`--sweep` — reporting, over every `Done` row on the board.** Run at daily hygiene. Same exit
    contract, so it can be read by a human or by a later gate.

**3. Retroactivity — NO, and the measurement is why.** The detector is **forward-only from
2026-08-17**, inheriting the scope `AGENTS.md` § "QE validation authority" already sets in its own
words (*"It is forward-only"*) rather than inventing a second one.

**The brief for this ticket assumed a history sweep would flag the five. It does not — it flags far
more, measured over the 38 rows in the board's `Done` section:**

| rule | `Done` tickets flagged |
|---|---|
| loosest sane (any `qe-e2e` note in a folder naming the ticket) | **9** — the five, plus `ABC-067`, `ABC-071`, `ABC-008`, `ABC-001` |
| the criterion above (verdict note, all four conditions) | **20** of 38 |

**An allowlist of the five is therefore not a viable design: it is factually insufficient, and
committing one would encode a false claim that only five are unrecorded.** The mechanism is instead a
**generated grandfather snapshot**: at build time the engineer writes the ids of every ticket already
in `Done` on 2026-08-17 to `.grugops/qe-cutover-2026-08-17.txt` (38 ids, generated by the tool's own
board parser, not hand-curated), with a one-paragraph header naming the owner's declined retro pass
as the reason. A ticket in the snapshot is reported as `out-of-scope (pre-cutover)` and is **never a
finding**. Everything that reaches `Done` after cutover is in scope, permanently.

**4. The self-authorship hole. State the ceiling in the tool's own header comment and in `AGENTS.md`,
do not let it be discovered later.** `AGENTS.md` records for `.grugops/test-skips.md` that *"the agent
may not self-author a justification to clear its own gate."* **This detector does not achieve that
property and must not be described as if it does.** `by: qe-e2e` is self-declared metadata in a
hand-authored file; any agent can write a conforming note. The contrast with the precedent is exact
and instructive: `test-skip-integrity.js` takes its decisive input (`--skip-count`) from **outside the
artifact under test** — the test runner — which is what makes it un-cheatable. **This detector has no
external signal; the note and the claim come from the same process.**

Therefore, written into the tool and the ticket:

> **What it proves:** a QE verdict note for this ticket exists, is authored as QE's, and is filed
> where the convention requires. **What it does not prove:** that a QE hop ran, or that its findings
> are honest. This is a **completeness check on the record, not evidence of the work.** It catches
> the silent omission — the measured failure of `ABC-061`/`062`/`063`/`064`/`068`, where **no note
> existed at all and no decision was recorded anywhere** — and it does not catch deliberate forgery.

One cheap hardening is in scope because it costs nothing: the verdict note's folder must **not** be
the ticket's own `ticket-to-pr-*` folder. A QE hop is a separate dispatch and lands in a separate task
folder (measured: `ABC-031`, `ABC-076`, `ABC-066` all do), so this makes a fake require a deliberate
second folder rather than a line appended in place.

## Out of scope

- **Proving the hop ran.** Named above. A control with an external signal (a human-owned register in
  the shape of `.grugops/test-skips.md`, or a QE-only credential) is a different, larger ticket and is
  the owner's to commission. **Do not let this ticket grow into it.**
- **Any retro QE pass over the five, or over the other 15.** The owner declined; this ticket does not
  reopen it.
- **CI, hooks, a git remote, or any automatic invocation.** Hand-run, both modes.
- **Editing `plans/board.md` row content, or any `.grugops/context/` note.** The tool is read-only
  over both; its only write is its own generated snapshot, once.
- **Any `src/` change.** Zero production lines under `src/`.

## Acceptance (Given/When/Then)

- **`A1` (it catches the measured failure).** **Given** the tool and the cutover snapshot, **when**
  run as `--ticket ABC-061` with `ABC-061` **removed** from the snapshot, **then** exit is **1** and
  stdout names `ABC-061` and states that no QE verdict note was found. **When** run with the snapshot
  intact, **then** exit is **0** and `ABC-061` is reported `out-of-scope (pre-cutover)`.
- **`A2` (it passes a real QE hop).** **Given** the tool, **when** run as `--ticket ABC-031` and
  `--ticket ABC-076`, **then** exit is **0** for each and stdout names the covering note's path —
  which is under `quality-gate-ABC-0xx-qe-2026-08-17/notes/`, **a different folder from that ticket's
  `ticket-to-pr-*`**.
- **`A3` (the false pass is closed — this is the criterion that earns the ticket).** **Given** the
  tool, **when** `ABC-062` is removed from the snapshot and `--ticket ABC-062` is run, **then** exit
  is **1**; the `qe-e2e` note under `quality-gate-ABC-066-qe/` that cites `ABC-062` in its `refs:`
  **does not** cover it, because its folder does not name it. *(A refs-only implementation passes
  this ticket's other criteria and fails here; that is the point of the criterion.)*
- **`A4` (the sweep's number is exact and reproducible).** **Given** `--sweep` on `main` at build
  time, **then** the tool reports **38** `Done` rows and **0** in-scope findings, and states the
  pre-cutover count separately. The `Done` row set is parsed from the line-leading `- [ABC-xxx]` form
  only — *measured 2026-08-17: a naive `ABC-\d+` scan of the same section yields **42**, because four
  ids appear inside other rows' prose. A tool that reports 42 is wrong.*
- **`A5` (id normalisation).** **Given** a folder named `abc031-…` and a ticket `ABC-031`, **when**
  coverage is computed, **then** they match; and `ABC-006` does **not** match a folder named
  `…abc0066…`. *(Zero-padded, boundary-safe — not a substring test.)*
- **`A6` (fail-closed, per the precedent's contract).** **Given** a missing board file, an
  unreadable note, or a missing snapshot, **when** the tool runs, **then** exit is **2** with a clear
  stderr message — **never a silent 0**. A note with malformed front matter is reported as an
  `UNKNOWN - verify` finding, not skipped silently.
- **`A7` (the ceiling is written down, not implied).** **Given** the delivered diff, **when**
  `tools/grugops/qe-hop-integrity.js`'s header and the new `AGENTS.md` paragraph are read, **then**
  both state in plain words that presence of a note is **not** proof a QE hop ran, and that the tool
  is a completeness check on the record. **No line of either claims the tool prevents self-authorship.**
- **`A8` (test-only under `src/`).** **Given** `git diff --numstat`, **then** **0** files under
  `src/` changed, the suite is green with skip count **0**, and `PERFT_DEEP=1` is **32/32** exact.

## Dependencies

**None blocking.** Reads `plans/board.md` and `.grugops/context/`, both on `main`.

**Ordering note, not a dependency:** the grandfather snapshot must be generated from the board **as
it stands when this lands**. If tickets close between now and then, the snapshot count is no longer 38
and `A4`'s number is re-measured at build time — the engineer states the number it measured and why it
differs, rather than forcing 38.

## Security / NFR triggers

- **`N8-LANE`**: **one test file added** (`tools/grugops/qe-hop-integrity.test.ts` or its `src/`-side
  equivalent), so the per-file floor applies: **≤ 650 ms CPU, ≤ 2 files, ≤ 2 spawns.** The tool
  itself is hand-run and outside the suite's lane.
- **Security: low, and one real item.** The tool reads two trees and writes one file. **It must not
  execute anything it reads** and must not follow symlinks out of `.grugops/context/`. No network, no
  new dependency, no user surface.

## Test notes

1. **Test `A3` against the real `ABC-062`/`ABC-066` notes on disk, not a fixture.** The false pass is
   a property of this repository's actual history; a hand-built fixture can be made to pass while the
   real data still fails.
2. **Test the negative direction of `A1`.** A detector that only ever exits 0 satisfies a
   one-directional check. Every criterion above that asserts `1` must be shown going `0` → `1` on a
   single controlled change.
3. **Do not add a `--force`, `--skip` or `--allow` flag.** A per-run override reintroduces exactly the
   silent-drift failure this ticket exists to close. Scope exclusion is the snapshot, in git, or
   nothing.
4. **Report the sweep even when clean.** `--sweep` printing "38 Done rows, 20 pre-cutover, 18 in
   scope, no findings" is the deliverable; "No findings." alone hides the denominator.

## Lane cost — how many test FILES this ticket implies

**One.**

## Size and priority rationale

**Size `M` (5), and it is bigger than it looks.** The one-line summary ("check a note exists") hides
five separate pieces of real work, each already measured to be non-trivial: front-matter parsing with
builtins over 1288 notes; board `Done` parsing where the naive read is off by **4**; id normalisation
across two historical spellings; the ticket→folder mapping whose obvious implementation produces a
**measured false pass on `ABC-062`**; and the cutover snapshot with its generation step. **What would
make it `L`:** any attempt to prove the hop actually ran — that is out of scope by design and is the
line the engineer must not cross unasked.

**Priority `P2`.** It guards a directive that has already failed once in this repository, which argues
for `P1`; but the directive is currently held by an *active, dated, human* instruction that is being
followed on its first two tickets (`ABC-031`, `ABC-076` both got QE), so the exposure today is future
drift rather than present breakage, and it ships no player-visible value. It ranks above anything
cosmetic and below any ticket that ships behaviour. **The owner may reasonably bump this to `P1`; that
is his call, and the argument for it is that the last drift was silent for five tickets.**

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` (**10 items**, not five) by BA/PM,
**2026-08-17**. **Result: 9 of 10 MET, 1 ⚠️. Requesting `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the Orchestrator at the `Done` exit; five tickets, no note, no recorded decision |
| 2 | scope and out-of-scope clear | **✅** two run modes, four coverage conditions, five explicit fences |
| 3 | INVEST-shaped | **✅** independent, `M`, every criterion an observable exit code |
| 4 | acceptance testable and measurable | **✅** eight criteria; each names an exit code and a measured number (38, 42, 0, 1, 2) |
| 5 | dependencies known | **✅** none blocking; one snapshot-freshness ordering note |
| 6 | security/NFR triggers | **✅** `N8-LANE` ≤ 650 ms / ≤ 2 files / ≤ 2 spawns; no-exec and no-symlink-escape named |
| 7 | test notes present | **✅** four, including the no-override rule |
| 8 | size assigned | **✅** `M` (5), with the five pieces that make it `M` and the condition that makes it `L` |
| 9 | priority assigned | **✅** `P2`, with the argument for `P1` stated rather than hidden |
| 10 | no major unresolved blocker | **⚠️** **The owner should acknowledge the stated ceiling before this is built.** He said yes to "the QE detector"; this ticket rules that the achievable detector is a *completeness check on the record*, not proof the hop ran, and that `by: qe-e2e` is self-declarable. If he understood "detector" to mean a control an agent cannot satisfy by writing its own note, **this ticket does not deliver that and no amount of building it will** — it needs an external signal and a different, larger ticket. Buildable as written either way; the risk is a mismatch between what ships and what was agreed. |
