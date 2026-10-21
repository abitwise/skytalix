---
id: 20261021T093352Z-architect-design-decision-34e592ac
kind: decision
by: architect-design
at: 2026-10-21T09:33:52Z
verified_by: 
confidence: high on the ruling; the harness shape is a proposal for BA/PM's cut
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
  - G-4
  - NFR-008
  - biome.json
  - .grugops/context/design-F-072-1/probe/f-mutants.sh
  - 20261021T093030Z-qe-e2e-observation-7a3267d0
  - bapm
supersedes: 
seal: sha256:79d23c47e53d0ae68e2ab01b4e0f913500d2d8877b2fae2424675e41a1cdf928
---

# Decision 3 (G-4): cut one XS ticket for a committed Ruling 2 plant harness, `r2-mutants.sh`. Do not lint the instrument. BA/PM cuts it

**Ruling: yes, cut a ticket.** LOW, XS, P3, test and probe only, with 0 `src/` lines.
- **Why.** The next edit to `clause-b.mjs` is likely. If Security/NFR rules G-1 into the unit, the change is about three
  lines in `addedLines`. § S1's re-armed trigger is the other likely cause. Either edit needs Ruling 2's plants re-run.
- **What exists today.** The plants exist only as scratch scripts (the SE's `bin/plants.sh`, QE's `plant.py`), outside
  the repository. Each of the last two hops rebuilt them by hand.
- **What already does this.** `F-072-1` and `ABC-072` have a committed harness beside the instrument, so one more
  follows an existing shape.

**Shape (for BA/PM to cut; the Architect owns the instrument).**
- **Path:** `.grugops/context/design-F-072-1/probe/r2-mutants.sh`. Commit its first run's output beside it as
  `r2-mutants.out.txt`.
- **Harness:** the same as `f-mutants.sh`. Usage is `<repo> <tip> <scratch-dir> <absolute path to clause-b.mjs>`.
  Plants go in a `git clone --shared` under the scratch dir, and the repository is never written. It reads
  `(b1) capability`, not `(b1)` (decision 2).
- **Plants, each with the expected limb-1 verdict printed beside the actual one.**
  - `P2b`: the read becomes `/etc/passwd`. **FIRES.**
  - `P2c`: `path: string`, passed from `cli.ts`. **FIRES**, naming `src/book-file.ts` only.
  - A comment-only edit to the holder. **FIRES.**
  - Base-only, the SE's X1: the import is dropped and the read is replaced. **FIRES** at `<base>`.
  - No holder at either end: a `+` line in a non-holder, planted at a commit before `ABC-095` (for example
    `f00038ef^1`), which has no limb-1 holder. **Adds nothing**, and runs no pathspec diff.
  - G-1 deletion-only, with two plants, import line deleted and guard line deleted. **Does not fire**, labelled as
    the G-1 gap. If Security/NFR's ruling changes the unit, these two rows flip on purpose.
- **Exit code:** nonzero when any actual verdict differs from its expected one.
- **Limbs 2 and 3:** compare the output with the `341da4c1` copy on each plant, and fail on any byte difference.
- **Acceptance:** on the instrument at `87d3897d`, the harness exits 0. On the `341da4c1` copy, it exits nonzero on
  `P2b`, `P2c`, the comment plant and X1. QE reads both.
- **Promotion trigger:** any ticket that edits `clause-b.mjs`. The harness is owed before that ticket merges.

**Not chosen.**
- **Bringing the instrument under Biome** by narrowing `!.grugops` in `biome.json`.
  - QE measured 0 new diagnostics from the Ruling 2 code. The 2 pre-existing diagnostics are a warning and an info.
  - A lint pass does not show whether Ruling 2 fires. The plants do.
  - The change would also touch a repository-wide gate config for one probe file.
- **A vitest suite for the instrument.** It would put a probe under `src/`'s test runner and its heap and lane budget,
  for a tool that is run by hand.
- **Doing nothing.** A third hand-built plant set at the next edit costs more than one XS harness.

**NFR impact: none.** The harness runs by hand, outside `npm test`. `NFR-008` (lane budget) is not touched.
