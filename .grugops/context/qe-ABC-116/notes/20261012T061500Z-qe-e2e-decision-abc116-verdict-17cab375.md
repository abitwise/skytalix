---
id: 20261012T061500Z-qe-e2e-decision-abc116-verdict-17cab375
kind: decision
by: qe-e2e
task: qe-ABC-116
at: 2026-10-12T06:15:00Z
verified_by:
confidence: high
refs:
  - ABC-116
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - QE-116-a
  - QE-116-b
  - QE-116-c
  - QE-116-d
  - AR-N8SPAWN-DRIFT
  - ADR-0017
  - 20261012T061500Z-qe-e2e-observation-abc116-qe-own-readings-a1-a2-69982a4f
  - 20261012T061500Z-qe-e2e-observation-abc116-audit-and-fences-557c5bee
  - 20261012T061500Z-qe-e2e-artifact-ref-abc116-commands-gates-probe-2fc2b532
supersedes:
---

# QE `ABC-116`: PASS_WITH_GAPS

Tip `d39618d1`, `grugops/ABC-116-t2-carrier`, reviewed unchanged. This is an agent `decision`, not a stamp.

**A1 through A6 are all MET as the criteria are written.** On A2, my independent spot check reads +3.15 s wall and +3.21 s CPU (paired
medians, n = 5, sign 5/5). That is within ±0.5 s of the Engineer's +3.08 / +3.12, and the sign held in every
pair. Every figure in the Engineer's TSV recomputes, the discards were honest, and the mutant is the one line.
All gates are green at the tip, and the UAT waiver applies on a measured 0 production lines.

## Gaps

- **QE-116-a (MEDIUM, comment fact; one parenthetical; recommended before merge).** The block says
  "its settle (`timeout`)", but `timeout` is the `spawnSync` hang bound. This file's settle is
  `A9_SETTLE_SECONDS` (`:484`), a `sleep` inside A9's `/bin/sh` argv (`:495`), which `:1813` calls "a
  settle `sleep`".
  - The block is the only carrier of the only control, and it points a hop at the wrong field.
  - The settle is still technically covered by "argv", since it lives in the `-c` string, but the
    block does not say so.
  - The error is inherited from the ticket's `C2` ("`timeout` (the settle)").
  - **Suggested repair (comment-only, re-opens nothing):** "its settle (a `sleep` in a child's shell
    argv, e.g. `A9_SETTLE_SECONDS`) or its bound (`timeout`)".
  - The ticket's `C2` sentence needs BA/PM's correction too.
- **QE-116-b (LOW, overclaim; not blocking).** "On the surface such a hop has to edit" is not true of the code.
  - The block's own measured mutant edits `CHILDREN.black` at `:695`, a `ChildOptions` value 350 lines
    below the comment, and never the interface or `childOf`.
  - Edits to `FIRST_LEGAL_ENGINE`'s body or `A9_SETTLE_SECONDS` do not pass the block either.
  - This is inherited from the ticket's `C2` premise, "reader and trigger-er coincide by construction".
    That premise is weaker than written, which bears on the `P3` demotion argument.
  - The block's "below" pointer softens it.
  - It could be mitigated by softening the sentence, or by one-line pointers at `CHILDREN` and
    `A9_SETTLE_SECONDS`. That decision is the Orchestrator's or BA/PM's, not QE's.
- **QE-116-c (LOW, record hygiene; not blocking).** The two force-added `*.log` files are acceptable as
  a record, but they should be renamed to `*.log.txt`.
  - They are the only tracked `*.log` files in the repository, and `.gitignore` still matches them.
  - `rg` and other tools that honour `.gitignore` do not list them.
  - The convention elsewhere is 239 tracked `*.log.txt` / `*.out.txt` files.
- **QE-116-d (INFO).** Note `…ae9de9b2` places `a2-window.log` in carrier commit `9b8c38ec`. It was
  added at `d39618d1`.

## Not gaps, recorded

- `T2` did not fire, and the A2 mutant is not claimed as a `T2` re-measure.
- The NFR 8-row hash is `c74e7426…0d3b` at base and at head.
- The catalog pointer is named and not made.
- The host was not exclusive. Another session's runner (`oeselg-labs/platform`) cost my windows 8
  discarded runs and 2 pre-launch waits, and the Engineer's 3 discards and 4 waits. This repo itself
  was at width 1.

## Next

- The board move out of `In Review` belongs to the Orchestrator.
- If QE-116-a is repaired on the branch, a QE re-check of that one parenthetical is enough. The fence
  stays the same, and A2 is not re-opened.
- UAT is waived on a measured 0 production lines. That is not a signature.
