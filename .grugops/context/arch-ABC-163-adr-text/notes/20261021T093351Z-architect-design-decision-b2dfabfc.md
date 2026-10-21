---
id: 20261021T093351Z-architect-design-decision-b2dfabfc
kind: decision
by: architect-design
at: 2026-10-21T09:33:51Z
verified_by: 
confidence: high
refs:
  - ABC-163
  - AR-095-L1UNIT
  - ADR-0036
  - grugops/arch-ABC-163-adr-text
  - e7385671
  - 2270c8fa
  - 87d3897d
  - d8c073e2
  - 341da4c1
  - 20261021T091931Z-architect-design-decision-a7d9c818
  - 20261021T093040Z-qe-e2e-decision-8a60d7c8
  - .grugops/queue/claimed/arch-ABC-163-adr-text/arch-ABC-163-adr-text.md
  - G-3
  - F-072-1
  - .grugops/context/design-ABC-072/probe/mutants.sh
  - .grugops/context/design-F-072-1/probe/f-mutants.sh
  - .grugops/context/design-F-072-1/probe/fixtures.sh
  - .grugops/context/secnfr-ABC-072/probe/sec-mutants.sh
  - 20261021T093020Z-qe-e2e-observation-47186969
supersedes: 
seal: sha256:fcd3e37ceeff9deba6e0377a7d7ed6dda58a7b96623ee6d717e93023bb562bf0
---

# Decision 2 (G-3): the probe harnesses get a note in `ADR-0036`, not an edit

**Ruling: note, no edit.** The note is now in the § S1 fold paragraph (`e7385671`).
- Harnesses that `grep '(b1)'` also match the Ruling 2 line, so their limb-1 rows split in two. Grep
  `(b1) capability` for the old row.
- F5, F6 and S10 move from `L3` to `L1 L3` by design.
- The recorded outputs are not edited.

**Why not edit `mutants.sh`, `f-mutants.sh`, `sec-mutants.sh` and `fixtures.sh`.**
- **They are records.** Each one belongs to an earlier hop (`design-ABC-072`, `design-F-072-1`, `secnfr-ABC-072`).
  Its `*.out.txt` was taken with an earlier instrument and reproduces at `341da4c1`. The ADR already points a byte
  comparison there. Editing the script would break that pairing.
- **No live gate parses their output** (QE `…47186969`: 0 references in `src/`, `tools/`, `scripts`, `package.json`
  or `.claude/`). They are read by eye.
- **The verdicts are unchanged.** The column the harnesses use for verdicts reads `^  limb`, and that line's form did
  not change. Clause (b)'s verdict is unchanged on all 23 `=>` lines.
- **The three limb-set moves are correct.** Each plant's base holds a limb-1 `child_process` import, and its head adds
  a line to that file. That is exactly what Ruling 2 fires on. They are not a regression to fix.
- **The fix is one word, made by whoever re-runs a harness.** In the instrument at `87d3897d`, the `(b1) capability`
  string is printed only on the old row. A new harness, such as the G-4 fixture, greps that string from the start.

**Not chosen.**
- **Change the instrument's Ruling 2 label so that it does not contain `(b1)`.** This would put the output format
  ahead of the ruling's own wording: Ruling 2 *is* a (b1) unit. It would also mean a second edit to an instrument that
  QE has just read.
