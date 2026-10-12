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
  - *(Amended 2026-10-11 by BA/PM, `bapm-batch-2026-10-11`. **"0 in-scope findings" is struck**,
    because it is known to be false at the tip.)* `Done` now holds rows that were closed with no QE
    hop on purpose:
    - drops and owner-word closes with no delivered diff (`ABC-060`, `ABC-074`, `ABC-092`,
      `ABC-100`, `ABC-108` and `ABC-112`, from the 2026-10-10 rough sweep and this hop's read of
      the `Done` section);
    - `ABC-073`, delivered inside `ABC-072`'s Security/NFR hop, in a folder that names only
      `ABC-072`.
  - **Then** `--sweep` reports exact counts on separate lines: `Done` rows, pre-cutover,
    covered by `qe-e2e`, covered by the `security-nfr` substitute (`A9`), and in-scope findings.
    **Every finding is listed by id.**
  - The delivery note classifies each finding from its board row as dropped / owner-close / real
    miss. **The deliverable is the exact numbers, not 0.** Each count must equal a hand count of
    the same rule. Test note 3 still stands: no flag clears a finding.
- **`A9` (the owner's substitute for docs-only tickets is visible, not silent)** *(added 2026-10-11,
  on the owner's answer 3, note `…owner-word-six-answers-b7c41e09`: closing `ABC-072`/`ABC-073` with
  Security/NFR "instead of QE: acceptable for docs-only tickets")*.
  - **Given** a `kind: decision` note authored `by: security-nfr` that meets the other three
    conditions (refs contain `T`; folder names `T`; folder is not `T`'s `ticket-to-pr-*`), **when**
    `--ticket T` runs, **then** exit is **0**, and stdout labels the coverage
    **`covered (security-nfr substitute — docs-only rule)`**, distinct from `covered (qe-e2e)`.
  - **Proven on the real `ABC-072`:** `--ticket ABC-072` gives exit 0, the substitute label, and the
    path under `secnfr-ABC-072/notes/`.
  - **Proven on the real `ABC-073`:** `--ticket ABC-073` gives exit **1**. The only verdict that
    cites it sits in a folder that names `ABC-072`, so the folder rule (`A3`) holds for the
    substitute too.
  - **The tool does not judge "docs-only".** It cannot see a diff's kind from a note. The label
    makes the substitute visible to the human at the `Done` exit, and that human applies the
    owner's rule. This is the same ceiling as `A7`: a completeness check on the record.
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

## Re-score — 2026-10-10 (BA/PM, subtask `bapm-rescore-backlog-r1-2026-10-10`, wave tip `39d87491`)

**Verdict: STAYS `Backlog`. DoR 9/10, the ⚠️ is still item 10 (the owner's acknowledgement of the
ceiling). `M` and `P2` kept.** `column`/`status` are not moved here.

**Premise re-checked. The failure it watches for HAS RECURRED in a recorded form.**
- `tools/grugops/qe-hop-integrity.js` does not exist at the tip.
- A rough sweep (folder names the ticket + `by: qe-e2e` + `kind: decision`; this is **not** the tool's
  four-condition rule) over the 112 `Done` rows finds **7** tickets from `ABC-069` up with no QE verdict.
  - **Five are explained:** `ABC-071` was closed 2026-08-16, before the cutover. `ABC-074`, `ABC-092`,
    `ABC-100` and `ABC-112` are owner-word closes or cancellations with no delivered diff.
  - **Two are not:** `ABC-072` and `ABC-073` reached `Done` **2026-10-10** with no `qe-e2e` hop. The
    `ABC-072` row says Security/NFR re-verified `A1`–`A6` *"in place of a separate QE hop
    (Orchestrator routing: docs-only ruling ticket)"*, and `ABC-073` was delivered inside that hop.
- **So it was not silent drift.** It was a recorded routing call. But it **departs from the owner's
  2026-08-17 rule** (*"Every ticket gets a `qe-e2e` hop … none reaches `Done` without one"*). This tool
  would flag both. That is the argument for `P2` and against `P3`. It is not `P1` because the departure
  was recorded and not silent.

**Amendments:**
- **`A4`'s 38** and the 1288 / 223 note counts are history. The page already lets the builder
  re-measure at build time.
- **`## Security / NFR triggers`, `N8-LANE`, re-read** under `ADR-0035`:
  - the new test file's cost is read on its **narrow set**, against the placeholder arm, with `R`
    reported (decisions 1–2);
  - the provisional `F` is 16 % of its base CPU; the 650 ms holds only at or above `F`;
  - 1 file, 0 spawns is the count pin.
  - **A file under `tools/` runs only in the `npm test` root lane**, not in `--dir src` (`QE-093-d`).
- **NEW dependency, `AGENTS.md` bytes.** `A7` adds an `AGENTS.md` paragraph. Main's file is
  **23,216 B of a 24,576 B target**, so **1,360 B** are left (`QE-093-a`), and `QE-093-a`'s regeneration
  line also wants some. The paragraph has to fit the remainder or go by pointer. That is the Scribe's
  call at the pull.

**DoR item 10 stays ⚠️, and it is the owner's.** His *"yes to the QE detector"* (2026-08-17) has not
been squared with the stated ceiling: a completeness check on the record, not proof that a hop ran. See
Owner questions in `.grugops/context/bapm-rescore-backlog-r1-2026-10-10/notes/`.

## Re-score — 2026-10-11 (BA/PM, subtask `bapm-batch-2026-10-11`, wave tip `506550f3`)

**Verdict: DoR 10/10, 0 ⚠️ (was 9/10). Recommend `Backlog → Ready`. `M` and `P2` kept.**
`column`/`status` are not moved here; that is the Orchestrator's.

**Item 10 ⚠️ → ✅, on the owner's word.** On 2026-10-10 he answered (note
`…owner-word-six-answers-b7c41e09`, answer 5): *"yes, it is enough"*. The Orchestrator mapped that to
"a QE note exists" is enough. **So the ceiling stated in § Scope 4 and `A7` is acknowledged.** The
detector he agreed to is a completeness check on the record, not proof that a hop ran. `A7` stays
as written, because it is what makes the ceiling visible to the next reader.

**Owner answer 3 is folded as `A9`, because it changes what "covered" means.** He accepted
Security/NFR in place of QE for docs-only tickets. Without `A9`, the tool would report every such
close as a finding forever.
- `A9` labels the substitute and does not judge "docs-only". The human at the `Done` exit applies
  that rule.
- Real-data proofs: `ABC-072` passes with the substitute label, and `ABC-073` stays a finding.

**`A4` is amended: exact counts, every finding named, and "0" struck.** Read at this tip, the
`Done` section holds drops and owner-word closes with no QE hop (`ABC-060`, `ABC-074`, `ABC-092`,
`ABC-100`, `ABC-108`, `ABC-112`) plus `ABC-073`. A sweep that must read 0 would fail on day one,
or would need an override flag that test note 3 forbids.

**Dependency re-read, `AGENTS.md` bytes.** It is **23,609 B** at this tip (`wc -c`, last touched by
`076dca9b`), so **967 B** of the 24,576 B target are left. `A7`'s paragraph has to fit that or go by
pointer. The Scribe calls it at the pull. This is not a blocker.

**`P2` holds.** Answer 3 makes the `ABC-072` routing owner-accepted, so the 2026-10-10 "departure"
argument for `P2` is gone. What is left is the original one: the measured drift was silent for five
tickets, and the board now closes tickets at width 3. **Demotion trigger:** if the Orchestrator
records the `--ticket` check as a manual step in its own `Done` routine before this is built, drop
to `P3`.

| # | item | 2026-10-11 |
|---|---|---|
| 1 | problem clear | ✅ unchanged |
| 2 | scope and out-of-scope clear | ✅ plus `A9`'s substitute and its "does not judge docs-only" fence |
| 3 | INVEST-shaped | ✅ independent; `M` |
| 4 | acceptance testable and measurable | ✅ `A4` is now exact counts with named findings; `A9` gives exit 0 / 1 on two real tickets |
| 5 | dependencies known | ✅ none blocking; `AGENTS.md` 967 B headroom named |
| 6 | security/NFR triggers with a measurable target | ✅ unchanged (`N8-LANE` narrow set; 1 file, 0 spawns; no-exec, no symlink escape) |
| 7 | test notes present | ✅ four |
| 8 | size assigned | ✅ `M` (5); `A9` is one more author value on an existing rule |
| 9 | priority assigned | ✅ `P2`, with a demotion trigger |
| 10 | no major unresolved blocker | **✅** *(was ⚠️)* the owner's answer 5 acknowledges the ceiling |

## QE re-check (2026-10-12)

QE/E2E, subtask `qe-recheck-ABC-105`, read at `main` `21980135` (byte-equal to `05a1f11d` on `## Done` and
`.grugops/context/`). Pre-build, read-only. **Criteria above are not edited here; amendments are BA/PM's.**

**Verdict: BUILDABLE WITH PAGE AMENDMENTS.** The design holds on today's data. The four-condition rule
parses every QE/Security-NFR note with plain `String.split`, `A3`'s refs-only false pass on `ABC-062` still
reproduces on real notes, and the 38-id cutover set is reconstructable from git. Two criteria do not hold
as worded:
- **`QE-105-a` (HIGH).** § Scope 3 says the snapshot is "`Done` on 2026-08-17" (38 ids), but
  § Dependencies says it is "the board as it stands when this lands". A land-time set today would be 131 ids,
  leaving 0 in scope. That would silence `A4`'s findings, `A9`'s `ABC-073` exit 1, and 93 post-directive
  tickets. Suggested fix: fix the set as `## Done` at `9998a544` (38 ids).
- **`QE-105-b` (HIGH).** `A2`'s `ABC-076` exits 1 under an exact-element reading of "refs contains `T`", because
  its QE decisions cite only `plans/tickets/ABC-076-…md`. Suggested fix: define "contains `T`" by `A5`'s
  normalisation.

The sweep at the tip, measured: 131 `Done`, 38 pre-cutover, 75 covered (`qe-e2e`), 2 substitute
(`ABC-072`, `ABC-147`), 15 findings (16 under exact refs). Of the findings, 0 are real misses.

Gap register `QE-105-a`…`QE-105-o` (2 HIGH, 6 MEDIUM, 7 LOW) is in
`.grugops/context/qe-recheck-ABC-105/notes/` (`…72ae8565`, decision). The sweep table, with commands, is in
`…298a669e`. `P2` demotion trigger: not fired.
