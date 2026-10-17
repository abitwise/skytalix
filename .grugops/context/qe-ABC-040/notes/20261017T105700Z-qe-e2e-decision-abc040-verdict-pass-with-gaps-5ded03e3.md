---
id: 20261017T105700Z-qe-e2e-decision-abc040-verdict-pass-with-gaps-5ded03e3
kind: decision
by: qe-e2e
task: qe-ABC-040
at: 2026-10-17T10:57:00Z
verified_by:
confidence: high
refs:
  - ABC-040
  - plans/tickets/ABC-040-traceability-duplicate-row-reconciliation.md
  - plans/traceability.md
  - QE-040-a
  - QE-040-b
  - QE-040-c
  - QE-040-d
  - 20261017T105500Z-qe-e2e-observation-abc040-derived-blind-8c0b32bf
  - 20261017T105600Z-qe-e2e-observation-abc040-criteria-gates-2cc164e9
  - 20261017T115100Z-software-engineer-observation-criteria-readings-b7c2d935
supersedes:
---

# QE `ABC-040` on `grugops/ABC-040-trace-dedup` (tip `08bbdf2c`, code `8d2e4f8b`, base `b84dc637`): **PASS_WITH_GAPS**

This note is hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). The criteria
are read as amended by the 2026-10-12 re-score. The readings are in `…8c0b32bf` (taken blind) and `…2cc164e9` (SE
comparison, gates, waiver).

| item | ruling | basis |
|---|---|---|
| `A1` | **MET** | No two rows share cells 0–4 at the tip. At base, exactly the `ABC-028` and `ABC-029` pairs did. Each of the two ids now occurs once. |
| `A2` | **MET** | Prefix True (2618 of 50168, raw and stripped). Stale Code and Tests are empty, and so are UAT and Release. |
| `A3` | **MET** | `d` = 2705, re-derived. The cell equals `live[:d] + stale[d:] + " **" + live[d:]`. It has 206 `**`. All six probes are present. |
| `A4` | **MET** | Both anchors occur once, in order. The record dates run 08-11 and then 08-12 ×5. |
| `A5` | **MET** | The amended `grep -cF` gives 0. There is one dated sentence, which names R3, R4 and 2404. |
| `A6` | **MET** (on the code commit, see `QE-040-a`) | 508 other rows are byte-identical and in order. Count 512 → 510 before the build row. `8d2e4f8b` names one file. |
| Gates | **green** | lint, typecheck and build exit 0. `npm test` 58/1792. Skip count 0. `No findings.` |

**Gap register (none blocks; no criterion is unmet):**

- **`QE-040-a` (LOW, criteria text).** As written, `A6` says *"`git diff --numstat` names exactly one file"*. It holds
  only for the code commit `8d2e4f8b`. The branch range `b84dc637..08bbdf2c` names five files: the trace file, the
  ticket page and three SE notes. QE's commit adds this page section and the QE notes on top. The brief required
  those docs, and the SE split the commits so that the criterion is checkable. The re-score amended `A6`'s row count
  for the hop's own row, but it did not amend the file count for the hop's own page and notes. QE reads `A6` against
  the code commit. A literal reader of the range would call it red.
- **`QE-040-b` (INFO, residual reader risk).** The comment block no longer says the duplicates are open. Dated
  records elsewhere in the file still do, and they are kept by R4/R5 as record:
  - the L230 `_Updated` paragraph (*"FLAGGED NOT REPAIRED: `ABC-028` and `ABC-029` each appear TWICE"*);
  - the live `ABC-028` Status sentence at L458 (*"needs a RECONCILING hop, not a delete"*);
  - the bare `ABC-040` cut row at L473.

  `A5` is scoped to the comment block, so it is met. A reader who greps the whole file still meets those dated claims.
  The new dated sentence in the block is what supersedes them.
- **`QE-040-c` (INFO, out of scope, carried).** The paragraph just above the reconciled sentence is untouched:
  *"KNOWN PRE-EXISTING malformations … ABC-009 (12 cells), ABC-011, ABC-015, ABC-019 (11 each)"*, and *"every row
  gives 10"*. It is still stale. Five rows at the tip do not split to 10: L626 (11), L627 (13), L735 (11), L982 (6)
  and L1006 (2). The 2026-10-12 re-score already routed this to the Orchestrator. Not this ticket's.
- **`QE-040-d` (INFO, board/front matter).** The page's front matter still reads `status: backlog`, `column:
  Backlog`, `priority: P2`. The re-score's `P3`, and the column, are the Orchestrator's to apply. QE did not edit them.

**A2 "at repair time".** QE re-ran the check on base `b84dc637`, which is the pre-edit state of the file, and it is
True. That the SE ran it *before* deleting is attested only by the SE's note. Git holds one commit, so the order of
the SE's acts is not recoverable from it.

**UAT waiver.** The `b84dc637...08bbdf2c` reading is empty, so it applies (UAT only; QE still ran). **Next column**
is the Orchestrator's call. QE recommends leaving `In Review` toward `Ready for UAT` and then `Done` under the
waiver. Security/NFR does not fire (0 `src/` lines). This merges with no conflict against `main` @ `fb2c207a`.
