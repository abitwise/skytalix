---
id: 20261012T103400Z-qe-e2e-decision-abc105-qe4-verdict-pass-with-gaps-n8-not-read-6a647762
kind: decision
by: qe-e2e
task: qe4-ABC-105
at: 2026-10-12T10:34:00Z
verified_by:
confidence: high
refs:
  - ABC-105
  - plans/tickets/ABC-105-qe-hop-detector.md
  - N8-LANE
  - NFR-008
  - QE-105-x
  - QE-105-y
  - QE-105-z
  - QE-105-aa
  - QE-105-ab
  - 20261012T101500Z-qe-e2e-observation-abc105-qe4-plants-seam-reads-gates-6df3826a
  - 20261012T103300Z-qe-e2e-observation-abc105-qe4-n8-lane-not-read-622677c5
  - 20261012T103500Z-qe-e2e-artifact-ref-abc105-qe4-commands-probe-bbb1e62b
  - 20261012T095452Z-qe-e2e-decision-abc105-qe3-n8-lane-not-met-15ca6e06
  - 20261012T100000Z-software-engineer-decision-abc105-fix2-notes-seam-9c628f28
supersedes:
---

# QE4 `ABC-105` on `fix2-ABC-105` (tip `cfcd59af`, code `8fd0c233`): **PASS_WITH_GAPS**, and `N8-LANE` is **NOT READ**

This is a hand-authored, unsealed note (`AGENTS.md`: no `finding` is admissible on this install). The review was
done on QE's own branch, `grugops/qe4-ABC-105` off `cfcd59af`. The readings are in `…6df3826a` (plants, seam,
reads, gates) and `…622677c5` (timing).

| brief item | ruling | basis |
|---|---|---|
| 1. No catch lost | **MET** | All 23 recorded plants turn red in the same tests by name in the old and new pairs. QE4's 46 rows are identical to fix2's. **(a)** A `--sweep`-only break in `main`'s read line goes **1 red** in the new file and **0** in the old one: the plain `plainSweep()` catches what the injected `--json` would hide. **(b)** Each single broken memo goes **1 red** (`A4`), not vacuous. |
| 2. Seam | **does not weaken any criterion** | The tool diff is exactly the JSDoc type plus the one read line. No argv path reaches `options.notes`, and every argv attempt exits 2. Through the CLI, a missing context dir exits 2 and an empty one exits 1. `A4`'s text and ids still come from the plain, uninjected sweep. |
| 3. Whole-tree reads | **2** (old 5) | QE's own instrumentation: 5366 real note files read = 2.032 × the 2641-note tree. |
| 4. `N8-LANE` at 650 ms | **NOT READ** | Window 1 was **void**: the grugops kit's own vitest ran in another session from round 3. Window 2, the one re-attempt, was **inadmissible**: twin +1.75 % against a 1.5 % limit. That follows the pre-registration: no window 3, no pooling, no estimate. |
| 5. Gates at the tip | **green** | lint, typecheck and build exit 0. `npm test` reads 57 files / 1775 tests, `success: true`, skip 0, integrity `No findings.`; `--sweep` reads 132/38/77/2/15 and exits 1. |

## Gaps

- **`QE-105-x` (MEDIUM, as QE3 suggested): stays OPEN, now as NOT READ at `8fd0c233`.**
  - QE3's NOT MET (+0.690 s) was measured at `db1cfb6c`, so it does not carry to this code.
  - No MET exists for `8fd0c233` either.
  - The Orchestrator's hold was "`N8-LANE` NOT MET at the fixed tip". **This hop does not clear it.** It
    needs one admissible window at `8fd0c233`.
  - Window 2's ungraded numbers are listed in `…622677c5` as read. They are not a state.
- **`QE-105-y` (LOW, wording, not edited):** the tool's JSDoc continuation line still says "the command line can
  supply **neither**", but it now covers three options (`snapshotIds`, `root`, `notes`).
- **`QE-105-z` (LOW, test strength; it predates the seam and is the same in the old and new files):** the
  whole-tree reads have no positive control.
  - A bug inside `readNotes` that drops notes only on the unfiltered read goes **0 red in both pairs**. For
    example, dropping `secnfr-*` gives a sweep of 132/38/77/0/17, and dropping `quality-gate-*` gives
    132/38/67/3/24.
  - Two empty memos at once also go 0 red.
  - `A3`'s unfiltered check passes on an empty read.
  - One positive assertion over `allNotes()` would make the shared read non-vacuous on its own: for example,
    `coverage("ABC-031", all, snapshotIds)` is covered, or the note count is near the tree size. `A4` pins only
    pre-cutover 38 by design ("not a pinned test").
- **`QE-105-aa` (INFO):** the seam has in-memory-only behaviour.
  - With `notes` injected, a missing context dir is never read, so it gives no exit 2.
  - With `notes` injected, `--ticket` does not scope malformed reporting to T's folders.
  - The command line can reach neither of these, and the test injects only under `--sweep`.
- **`QE-105-ab` (INFO, method, Architect/Design's under `ADR-0035`):** on this set the 1.5 % twin limit is 8.6
  ms, which is under the 10 ms tick of `/usr/bin/time -p`. So any ±0.010 s twin median is inadmissible. QE3 w1
  (+1.74 %) and QE4 w2 (+1.75 %) both fell to this.
- **Still open, unchanged:** `QE-105-r`, `-s` and `-u` (LOW) and `-w` (INFO). UAT was waived by the owner and is
  not re-litigated.

**Recommendation.** The functional criteria, the seam and the read cut are sound, and QE has no functional
objection to the fix. **`N8-LANE` is unread at this code**, so the merge hold that rests on it is not lifted by
QE4. Re-reading it in a quiet window, or ruling otherwise, belongs to the Orchestrator or the owner. Board, merge
and the `Done` exit are the Orchestrator's.
