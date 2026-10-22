---
id: 20261022T135459Z-architect-design-decision-7cd5d10a
kind: decision
by: architect-design
at: 2026-10-22T13:54:59Z
verified_by: 
confidence: high (built and measured in scratch; QE read owed)
refs:
  - ABC-196
  - QE-195-a
  - ABC-195
  - AR-193-HUNKHDR
  - ADR-0036 S1
  - NFR-008
  - grugops/ABC-196
  - 6d15460b
  - a7857e0b
  - 219e8e33
  - 99d07d32
  - 341da4c1
  - 0dfd17b3
  - 14fea7d4
  - .grugops/context/design-F-072-1/probe/r2-mutants.sh
  - .grugops/context/design-F-072-1/probe/r2-mutants.out.txt
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - plans/tickets/ABC-196-a-drifted-anchor-or-a-dropped-capability-line-turns-a-twin-row-of-r2-mutants-into-a-silent-control.md
  - 20261021T205709Z-ba-pm-decision-f0144de0
  - 20261021T205709Z-ba-pm-observation-466ee18d
  - 20261021T203404Z-qe-e2e-decision-f36a06c3
  - 20261021T203404Z-qe-e2e-observation-741eebba
  - 20261021T201020Z-architect-design-decision-6a068acf
supersedes: 
seal: sha256:d94b9f41fcab0ef8f3819e0ab9f0b463e784dcc66d5e9332fc3d854e7bab52ba
---

# Architect decision for `ABC-196`: shape (a). Each `TW` row names its expected limb 2 and limb 3 verdicts on its plant, and a mismatch goes in a new list `XP` that turns exit 0 into exit 1 with one line naming `row:limb`. One file, 22 `+` / 12 `−`, 0 `src/` lines; head output byte-equal; `r2-mutants.out.txt` untouched. A1–A7 met on the builder's read; QE's read is owed

Cites the page `plans/tickets/ABC-196-…md` `## Scope` / `## Out of scope` and QE `…decision-f36a06c3` (`QE-195-a`, the `## Risks`) as authoritative. Readings: this task's observation note.

## Chosen design (shape (a))
- **The check.**
  - `row`'s `TW` mode takes two more arguments, `TW <tb> <th> <l2> <l3>`.
  - In the limb loop, after the existing print, a `TW` row compares the limb's verdict text on the plant (the same `grep`/`sed` the print uses) with its expectation. On a mismatch it appends `row:limbN` to `XP`.
  - The verdict is compared whole, so `FIRES (disputed …)` is not `FIRES`. That is why base's instrument names RA-PLUS too.
- **Expectations**, as head's instrument reads them today:
  - `FIRES FIRES` on PP-TPL, PP-REDIR, RA-PLUS and SP-N5;
  - `FIRES "does not fire"` on PP-EDIT.
- **Exit.**
  - The exit-0 test gains `[ -z "$XP" ]`.
  - After the `DIFFER` line, one new line prints: `r2-mutants: limbs 2/3 verdict on the plant not as the row expects (FIRES and FIRES; PP-EDIT FIRES and does not fire):$XP`.
  - Exit stays 1. The `25 of 25` summary text is unchanged.
- **What is untouched.** The row's existing print is not changed, so `$b` is never given a spaced word (the page's test-note trap does not arise). `mk`, `hh`, `pc`, the plants and the twins are untouched too.
- **Header.**
  - The plant-check sentence's "never runs as a silent control" becomes "a plant whose header-shaped line does not land never runs". That is what `pc` checks.
  - A new `ABC-196` paragraph states the guard and its upkeep, and that it checks the verdict word only.
  - The exit-1 line names the new list.

## Alternatives rejected
- **Shape (b)**, the plant check also grepping each plant's capability line in its diff. It needs a per-row pattern list inside `pc`, and it would also touch D1/D3/D4/D5's path. It also checks a proxy (a line in the diff), where (a) checks the property the row exists for (what the instrument reads). And it would not catch an instrument hop that stops reading the line.
- **Marking the mismatch inside the row's `L2`/`L3` line.** Not asked for. It would also need `$b` quoted, and A3 is met by the summary line naming row and limb.
- **Asserting the twin's verdicts too.** Out of scope. The twin compare already pins the twin to `341da4c1`.

## NFR and risk impact
- **`QE-195-a`: built.** It closes on QE's read of A2–A6.
  - D2, R and L now exit 1, naming only the silent limbs.
  - Head is byte-equal; base's instrument is still red on the same 9 limbs.
- **Test integrity** (`quality.test_integrity: warn`): the silent path past the harness is closed for the five `TW` rows.
- **`NFR-008`:** 0 new children, 0 suite rows, no timing. The harness runs by hand, outside `npm test`.
- **No new residual found.**
  - The 20 earlier rows' multi-substitution plants stay `UNKNOWN - verify`, as the page fences them.
  - **A known limit, stated in the header:** the guard reads the verdict word, not which line fires. A drift that leaves a limb firing on some other line would stay green (not measured; no such drift is known). That is within the page's scope ("reads as that row expects on limbs 2 and 3").
  - LF shows the two limbs are read apart: with `fetch` gone, limb 2 still fires on `process.env`, and only limb 3 is named.
- **Upkeep (page § Dependencies):** an instrument hop that changes a `TW` verdict updates `<l2>`/`<l3>` in the same diff, as for limb 1.

## For QE
- Re-run A2 with `git show a7857e0b:<harness>` and A3–A6 with the harness at `6d15460b`. Use a full scratch clone as `<repo>` and the private env. Use head's instrument (`24b963b14fa4f1bf`) and base's (`git show 99d07d32:<instrument>`), each beside a `node_modules/typescript` link.
- R needs a scratch commit on base. The drift copies are one-line edits of the harness (the observation note lists each).
- Plant ids repeat for a given tip (fixed commit dates).
