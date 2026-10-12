---
id: 20261012T120800Z-ba-pm-decision-abc154-fold-accept-qe154a-ar154-b84edbb6
kind: decision
by: ba-pm
task: bapm-fold-ABC-154
at: 2026-10-12T12:08:00Z
verified_by:
confidence: high
refs:
  - ABC-154
  - QE-154-a
  - QE-154-b
  - QE-154-c
  - QE-154-d
  - QE-105-z
  - AR-154-TWO-POINT-CONTROL
  - AR-105-SYMLINK-ROOT
  - N8-LANE
  - RISK-ABC105-LANE
  - plans/tickets/ABC-154-the-qe-hop-detector-test-has-no-positive-control-on-its-whole-tree-read.md
  - 20261012T113800Z-qe-e2e-decision-abc154-verdict-pass-with-gaps-n8-met-d9ae510a
  - 20261012T113600Z-qe-e2e-observation-abc154-replant-reads-sweep-gates-00a2e2c3
  - 20261012T120700Z-ba-pm-observation-abc154-fold-readings-3a619733
supersedes:
---

# `QE-154-a` is accepted as `AR-154-TWO-POINT-CONTROL`. No ticket is cut, and `ABC-156` stays free. The fix's acceptance is written now, so the next ticket that edits the set carries it

This is a hand-authored, unsealed note (`AGENTS.md`). The readings are in `…3a619733`. **No timing was taken.**
The ticket page's `## Fold` section is authoritative, and this note is its reasoning.

## Disposition

**`QE-154-a` (LOW, test strength): accepted as `AR-154-TWO-POINT-CONTROL`.** It is not cut and not closed.

### Why not cut it now

1. **It fails closed.** A dropped note can only cost coverage: the result is a false finding, never a false
   pass. The blocking `--ticket` check at the `Done` exit uses the filtered read and is unaffected (QE,
   `…d9ae510a`).
2. **The blind spot needs a tuned fault.** Both green plants spare a control folder by name (`…3a619733`).
   - Their untuned twins go red: 4, caught by `A6`.
   - Every other plant QE wrote is caught at head.
   - An accidental fault that happens to spare exactly `quality-gate-ABC-031*` and `secnfr-ABC-072` is
     possible but improbable. Whether any untuned green fault exists is `UNKNOWN - verify`.
3. **Closing it now costs a width-1 window.**
   - Any edit to `tools/grugops/qe-hop-integrity.test.ts` changes the `N8-LANE` set, and the QE hop then owes a
     width-1 lane re-read (`ABC-154` § Size: "the QE hop is not `XS`").
   - Paying a window to close a LOW, fail-closed gap that only a tuned fault reaches is the bloat this role
     refuses.
   - The next ticket that edits either file pays that window anyway. Riding along with it costs no extra window.

### Why not close it with no action

The gap is real and cheap to close at the right moment. `QE-105-z` showed that an unwatched read decays. So the
acceptance is written now, and the triggers hand it on.

## Triggers (whichever comes first)

- **R-a (ride-along).** A ticket is cut or pulled that edits `tools/grugops/qe-hop-integrity.test.ts`, or the
  note-reading path of `tools/grugops/qe-hop-integrity.js` (`readNotes`, the `allNotes()` / `plainSweep()`
  memos, or the `A3` / `A9` controls).
  - **What happens:** BA/PM adds the acceptance below to that ticket.
  - The edit already owes an `N8-LANE` re-read.
  - This includes `AR-105-SYMLINK-ROOT`'s own fix, which adds an `A6` case to the test file.
- **R-b (symptom).** A `--ticket` or `--sweep` finding is traced to a note that is on disk but that `readNotes`
  did not return.
  - **What happens:** cut a ticket at once, at `P2`, with the acceptance below.
- **R-c (owner).** The owner may pull it at any time.
  - **What happens:** cut it as the next free id with the acceptance below, `XS` build, `P3`. Its QE hop carries
    the width-1 re-read.

## The acceptance, written now

### Option chosen: note count against a names-only listing

Of QE's three options, this is the only one that **closes the thinning class** instead of moving the blind
spot.

| option | why not |
|---|---|
| more control ids | There are at least eight folder forms (`…3a619733`). Each id added still leaves a thinning that spares the named folders. |
| a covered-count floor | A literal floor erodes as the record grows: today's 79 covered (`…3a619733`) lets any thinning that keeps ≥ 79 pass. It also needs re-pinning as the board moves. That is the reason `ABC-105` `A4` left the counts unpinned. |

### Criteria

- **`F1` (the read is whole).**
  - **Given** the head test.
  - **When** `allNotes()` is read.
  - **Then** its length equals the number of `*.md` names under every non-symlink
    `.grugops/context/<folder>/notes/` directory, counted by a listing that opens no note file.
  - The assertion compares two computed counts and **never a literal**. At `b89b3fd2` both would read 2660.
- **`F2` (the blind plants go red).**
  - **Given** QE's two green plants, loaded verbatim from `.grugops/context/qe-ABC-154/probe/plants6.py`
    `extra` mode: `q5x-readNotes-unfiltered-drops-qe-folders-real-tree-only` and
    `q5x-readNotes-unfiltered-drops-quality-gate-except-ABC-031 (real tree)`.
  - **When** each is planted in a scratch copy outside the repository.
  - **Then** each turns **≥ 1** test red at head, and 0 at base.
  - The unmutated head is green.
- **`F3` (no catch lost).** Over `ABC-154`'s 32 plants, QE's own plants (`plants6.py` `own` mode) and the two
  plants of `F2`, head ⊇ base by test name.
- **`F4` (pins).**
  - Whole-tree `readNotes` calls of the real notes stay **2**, read by instrumentation.
  - The test file has 0 spawn sites.
  - There is at most one new `it`.
  - `npm test` file count equals base, and skips are 0.
  - The listing is new directory I/O, not a note read. **Its cost is read by the host ticket's own `N8-LANE`
    re-read at 650 ms CPU, never estimated.**
  - **If that reading is NOT MET, the fallback is the "more ids" option:** one id per folder form, the
    weaker fix. The lever is the owner's under `ADR-0035`.

The plain sweep needs no separate assertion. `A4` already requires `plainSweep()`'s count lines to equal the
counts of a sweep fed `allNotes()` (`…3a619733`). The Engineer may still add one; `F2` is the criterion.

## Pointers to the Architect, not restated here

`QE-154-b`, `-c` and `-d` are Architect/Design's (`design-ABC-154-close`, items 2–4). The same hop records the
`RISK-ABC105-LANE` closure (item 1).

**Where my triggers meet that hop.** R-a fires on the same event as the set's `N8-LANE` re-read trigger: an edit
to the test or the tool. Where that trigger lives once the risk closes is the Architect's ruling (item 3).
- **R-a is a test-strength trigger, not a timing trigger.** It neither relies on that ruling nor replaces it.
- If the Architect re-homes the 4,000-note `T-c`, that trigger fires no ride-along. `F1` would also read a
  larger tree.

## Recommendations to the Orchestrator

- **Column moves: none.** No ticket is cut. `ABC-154` stays `Done`, and `ABC-156` stays the next free id.
- **The `ABC-154` front matter is stale:** `status: backlog` / `column: Backlog`. This is the same as `ABC-105`
  and `ABC-153`. Correcting it is the Orchestrator's call; the append-only fold does not edit it.
- **No question goes to the owner.** QE left the choice to BA/PM (`…d9ae510a`), and R-c keeps the owner's
  option open.
