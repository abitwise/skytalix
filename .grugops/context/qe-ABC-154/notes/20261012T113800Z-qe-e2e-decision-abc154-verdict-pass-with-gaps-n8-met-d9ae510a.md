---
id: 20261012T113800Z-qe-e2e-decision-abc154-verdict-pass-with-gaps-n8-met-d9ae510a
kind: decision
by: qe-e2e
task: qe-ABC-154
at: 2026-10-12T11:38:00Z
verified_by:
confidence: high
refs:
  - ABC-154
  - ABC-105
  - plans/tickets/ABC-154-the-qe-hop-detector-test-has-no-positive-control-on-its-whole-tree-read.md
  - N8-LANE
  - NFR-008
  - RISK-ABC105-LANE
  - QE-105-x
  - QE-105-y
  - QE-105-z
  - QE-154-a
  - 20261012T113600Z-qe-e2e-observation-abc154-replant-reads-sweep-gates-00a2e2c3
  - 20261012T113700Z-qe-e2e-observation-abc154-n8-lane-met-4e153e76
  - 20261012T113900Z-qe-e2e-artifact-ref-abc154-commands-probe-74e76e9d
  - 20261012T111800Z-software-engineer-decision-abc154-positive-control-shape-c8768914
supersedes:
---

# QE `ABC-154` on `grugops/ABC-154-positive-control-whole-tree-read` (tip `beb0991c`, code `0f8036f9`): **PASS_WITH_GAPS**. `N8-LANE` reads **MET** at 650 ms CPU

This is a hand-authored, unsealed note (`AGENTS.md`: no `finding` is admissible on this install). The review was
done on QE's own branch, `grugops/qe-ABC-154` off `beb0991c`. The readings are in `…00a2e2c3` (plants, reads,
sweep, static, gates) and `…4e153e76` (timing).

| item | ruling | basis |
|---|---|---|
| `A1` non-vacuous whole-tree read | **MET** | The three QE4 plants read **0 red at base and 2 red at head**, each (`A3` unfiltered, `A9` --sweep). The unmutated head reads 32/32. |
| `A2` no catch lost | **MET** | Head ⊇ base by name on **32 of 32** plants. QE loaded the text by executing QE4's `plants4.py` verbatim, and **the SE's load is identical on 32 of 32**. Base equals QE4's `[new]` rows by pass count and red names on 32 of 32. |
| `A3` (`QE-105-y`) | **MET** | One JSDoc line (223) changed, and "neither" is gone from `main`'s block. The tool with comments stripped hashes the same at base and head. |
| `A4` fences and pins | **MET** | 2 files, 0 added; 0 spawns; whole-tree reads **2 = 2** (QE's own end-of-function hook); `--sweep` and `--sweep --json` are `cmp` 0; `npm test` 57 / 1775 (+0), skip 0, `No findings.` |
| Brief item 2, QE's own plants | **all caught at head** | by-`security-nfr` drop (every read 1 → 3; unfiltered only **0 → 2**); hash half (9 → 11, 6 → 8); random half (3 runs, `A3` and `A9` red in each); one-folder `allNotes()` memo for either control folder (1 → 2). No single or pair removal of the 4 new expects leaves any of 10 faults uncaught. |
| `N8-LANE` at 650 ms CPU | **MET** | One admissible window (w1, n = 8, 0 discarded): **+0.380 s (+0.350..+0.410)**; twin −0.005 s (−0.87 %), non-zero signs +1/−4 (p 0.375), R 0.030 s. It is also admissible under the pre-A1 rule. |
| Gates at QE's tip | **green** | lint (109 files), typecheck and build exit 0; `npm test` `success: true`; integrity `No findings.`; the file passes 32/32. |
| UAT-waiver reading | **empty** | `git diff --name-only 0f8036f9~1 0f8036f9 \| grep -v '\.test\.ts$' \| grep '^src/'` is empty, and so is the same over `beb0991c~1..beb0991c` and `69a1f4b4..beb0991c`. The one non-test file is the tool, and its change is a comment. Which UAT rule applies is the Orchestrator's to state (Test note 5). |

## `RISK-ABC105-LANE` (`QE-105-x`): what this reading's state does under the catalog

- **The state is MET.** Under `plans/nfr-catalog.md` § "`N8-LANE` at `ABC-105`" → "What happens next", **MET reads
  "Write the reading and close the risk."** This reading is `ABC-154`'s own, owed under trigger **T-b** ("the
  changing ticket's own `N8-LANE` reading discharges the risk").
- **So it CLOSES `RISK-ABC105-LANE`, effective when `0f8036f9` is the code on `main`.** It is a reading of
  `ABC-154`'s code, not of `8fd0c233`. If `ABC-154` does not merge, `main` still runs `8fd0c233`, which has no
  graded reading, and the risk stays open on the same triggers.
- **It does not go to the owner.** The state is not NOT MET.
- **The writes are not QE's.** The brief fences the catalog and ADRs. The closure entry is Architect/Design's (owner
  of the record), and the `Done` move is the Orchestrator's.
- **The owner's +0.370 s ruling on `ABC-105` stays what it was:** a ruling, not a reading. This MET is at different
  code and does not regrade QE4 w2.

## Gaps

- **`QE-154-a` (LOW, test strength; new). The positive control is two-point.**
  - A real-tree, unfiltered-only thinning that spares `quality-gate-ABC-031*` and `secnfr-ABC-072` stays 0 red at
    head. Dropping every real `qe*-` folder moves the sweep from 78 covered / 15 findings to 14 / 61. Dropping
    every other `quality-gate-*` gives 69 / 23.
  - The direction of harm is `QE-105-z`'s: a false finding, never a false pass, and `--ticket` is unaffected.
  - `A1` is met as written, because the ticket chose the three plants and left the counts unpinned.
  - If BA/PM wants it closed, the options are:
    - more control ids (cheap; each one only moves the blind spot);
    - a lower bound on the note count against an independent `readdir` count of `notes/*.md` (a directory walk,
      not a note read, but its cost against "no new whole-tree read" would need measuring);
    - accepting it as a risk.
  - **That choice is BA/PM's, and QE does not pick one.**
- **`QE-154-b` (INFO, method). The A1 forward-only clause.**
  - A1 applies to "a window whose pre-registration lands on `main` after this addendum does". This
    pre-registration is on QE's branch, and it reaches `main` only through the Orchestrator's merge. It was written
    after the addendum was on `main`.
  - **No state depends on this,** because the window is admissible under both the old and the amended rule. If
    the Architect wants that clause worded for QE-branch pre-registrations, that is the Architect's call.
- **`QE-154-c` (INFO, for Architect/Design).**
  - **`F`.** This is a third admissible R (CPU 0.030 s, wall 0.030 s). The median of the three most recent is
    0.020 s, so `F` stays **0.020 s** CPU and wall. It is the Architect's to record.
  - **`T-c`.** The 4,000-note re-read trigger is written as part of `RISK-ABC105-LANE`. If the risk closes on
    this MET, the Architect should say whether `ADR-0035` A3's growth trigger survives the closure. The cost
    still grows with the record (2656 notes at this reading).
- **`QE-154-d` (INFO).** load1 rose from 3.21 to 8.88 mid-window, and no foreign runner, platform process, thermal
  event or power change was sampled. The cause is `UNKNOWN - verify`. Load is logged, not gated, and the twin is
  admissible.
- **Still open, unchanged and not this ticket's:** `QE-105-r`, `-s` and `-u` (LOW) and `-w` (INFO), as accepted
  in `ABC-105` § Fold.

**Recommendation.** `ABC-154` meets `A1`–`A4`, every one of QE's plants is caught, and the gates are green. The
`N8-LANE` set that changed reads MET at 650 ms. QE has no objection to the merge. Board, merge and the `Done`
exit are the Orchestrator's; the catalog and risk record are Architect/Design's.
