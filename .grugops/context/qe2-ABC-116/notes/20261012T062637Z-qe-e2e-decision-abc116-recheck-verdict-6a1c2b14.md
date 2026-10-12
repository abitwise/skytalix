---
id: 20261012T062637Z-qe-e2e-decision-abc116-recheck-verdict-6a1c2b14
kind: decision
by: qe-e2e
task: qe2-ABC-116
at: 2026-10-12T06:26:37Z
verified_by:
confidence: high
refs:
  - ABC-116
  - A1
  - A5
  - A6
  - QE-116-a
  - QE-116-b
  - QE-116-c
  - QE-116-d
  - QE2-116-a
  - QE2-116-b
  - QE2-116-c
  - ADR-0017
  - G-QE115-3
  - 20261012T062637Z-qe-e2e-observation-abc116-recheck-readings-a0f3e853
  - 20261012T062637Z-qe-e2e-artifact-ref-abc116-recheck-commands-and-gates-43bb8876
  - 20261012T062100Z-software-engineer-decision-abc116-settle-and-surface-wording-16a8ee37
supersedes:
---

# QE re-check `ABC-116` (repair of QE-116-a..d) at tip `ffe52710`: PASS_WITH_GAPS

This is an agent `decision`, not a stamp. QE did not author the repair. The code and git were read
before the Engineer's notes. All three gaps are INFO, and none blocks the exit.

## The four items

1. **The changed JSDoc: MET.**
   - `timeout` is the hang bound `childOf` passes to `spawnSync`.
   - The settle is the `sleep ${A9_SETTLE_SECONDS}` in A9's `/bin/sh -c` argv.
   - `spawnSync(` occurs once, inside `childOf`, and every child spawns through it.
   - The edit lands in a `CHILDREN` entry or a constant, not in the block.
   - Each sentence is true of the code. A1's (i)–(iv) are all present. **QE-116-a and QE-116-b are
     closed.**
   - **QE2-116-a (INFO):** the "where the edit lands" list is not exhaustive. It omits the builder
     bodies (`closedReader`, `heldOpenReaderClosed`, `unwritableStdout`) and `run`/`play`/`childOf`.
     (i) still fires `T2` on any argv change, so no reader is misled about the trigger.
2. **The Engineer's refusal to add "or its bound (`timeout`)": CORRECT.**
   - `ADR-0017` decision 2 lists four things: argv, stdin script, substitution hook, settle. QE
     re-read it at `:88-90`. The bound is not among them.
   - Adding it would put a fifth trigger in a code comment that no ruling makes, which is the
     invented-ruling move the fix subtask forbade.
   - The comment now says only what the code shows: `timeout` is not the settle.
   - The question is correctly routed in note `…16a8ee37` to BA/PM and to Architect/Design, the owner
     of `ADR-0017`. QE does not decide it.
   - **Input for that ruling (QE's reading, not a ruling).** On a green lane a bound change does not
     move a child's cost:
     - a child that finishes inside the bound costs the same under any larger bound;
     - a child that reaches the bound gets `error: ETIMEDOUT` (measured here), and `childOf` throws
       (`:395-399`), so the row goes red.
   - A bound change is therefore either a cost no-op or a visible red. It is never the silent green
     drift that `AR-N8SPAWN-DRIFT` names and `T2` controls.
   - The Engineer's "two orders of magnitude" premise does not hold for A9 (4 s bound, a child of
     about a second; QE2-116-b, INFO). The conclusion holds without it.
3. **QE-116-c / QE-116-d: CLOSED.**
   - Both logs are `*.log.txt` (`R100`, content unchanged), and `git ls-files '*.log'` is empty.
   - Neither new name is ignored.
   - Note `…79e292cc` records `d39618d1`, which is the correct add commit.
   - No committed note was edited; only notes were added.
   - **QE2-116-c (INFO):** that note's claim that `plans/traceability.md` does not name the files is
     overtaken by the same commit's fix row.
4. **Fence and gates: MET.**
   - `src/` changes only `src/cli.test.ts`, +28/−0, all comment lines. The non-comment hash is equal at
     base and tip.
   - The catalog, `AGENTS.md` and the board are untouched.
   - The NFR hash is `c74e7426…0d3b` at base and at tip.
   - `N8_SPAWN` is byte-identical, and the pin lines and the `CHILDREN` block are equal.
   - At the tip: lint, typecheck and build exit 0. `npm test` reads 56 files / 1743 tests,
     `success: true`. The skip count is 0, and the integrity check reads `No findings.`
   - The UAT waiver applies; the production `src/` diff is empty, measured. It is not a signature.

## Owed elsewhere (named, not done here)

- BA/PM: the ticket's `C2` still reads "`timeout` (the settle)". The Engineer named it, and QE agrees
  it is the source of QE-116-a.
- BA/PM and Architect/Design: whether a hang-bound change fires `T2`. QE's input is above.
- Orchestrator: the `In Review` exit. QE's verdict now permits it.
