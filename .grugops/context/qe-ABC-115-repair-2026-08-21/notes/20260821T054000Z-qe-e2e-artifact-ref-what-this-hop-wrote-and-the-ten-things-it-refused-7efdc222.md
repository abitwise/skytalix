---
id: 20260821T054000Z-qe-e2e-artifact-ref-what-this-hop-wrote-and-the-ten-things-it-refused-7efdc222
kind: artifact-ref
by: qe-e2e
at: 2026-08-21T05:40:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - A10
  - G-QE115-1
  - G-QE115-2
  - G-QE115-3
  - G-QE115-4
  - G-QE115-5
supersedes:
---

# WHAT THIS HOP WROTE, WHERE IT WROTE IT, AND THE TEN THINGS IT REFUSED

## Written

| path | what |
|---|---|
| `.grugops/context/qe-ABC-115-repair-2026-08-21/notes/` | **seven notes**: two `observation` (both defects re-verified; the guard audited by mutating the guard), one `decision` on `G-QE115-3`, one `observation` (regression sweep + lane cost), one `claim` (`G-QE115-5`, and the diff carries no weakened assertion), one `failed-attempt` (the pty trap, third shape), one `decision` (the verdict), and this `artifact-ref` |
| `plans/board.md` | **one ticket moved**, `ABC-115` `In Review` → `Ready for UAT`; both column headers re-counted (1/3 → 0/3, 0/4 → 1/4); one header line appended; the ticket's own line appended to |
| `plans/traceability.md` | **one row touched in place** (`ABC-115`), three cells appended to (`NFRs`, `Tests`, `Status`), append-only within each; one header line appended |
| `.grugops/queue/claimed/` → `done/` | the subtask file, claimed by a bare `mkdir` and moved on completion |

**Branch `grugops/qe-abc115-reverify`, off `grugops/abc115-repair` @ `8d4980c`**, worked in its own
`git worktree`. **Eleven branches now stacked unmerged.**

## Instruments, so the readings can be re-run

- Mutation tree: a copy outside the repository carrying `src/`, `package.json`, `package-lock.json`,
  `tsconfig.json`, `vitest.config.ts`, `biome.json`, **`AGENTS.md`** and `tools/`, `node_modules`
  symlinked. **Established green at 61/61 before any mutation.** Destroyed after reading; every
  intermediate state `cmp`-verified back to the original before the next run.
- Production mutant: `sink.on("error", () => { process.stdin.destroy(); })` — the deleted-token
  mutant from my previous hop, byte-identical to it.
- Guard mutants (mine, on the test file): `A10` reading `child.status`; `ABC-066`'s refusal
  derivation made wrapper-transparent.
- Standalone probes: `/bin/sh -c '<product> --ascii 1</dev/null; echo "NODE_EXIT=$?"'`;
  `script -q <log> /bin/sh -c '<product>; echo "NODE_EXIT=$?"'` for the pty.

## The ten things this hop REFUSED

1. **Refused to accept any repair-hop claim on its report.** Every closure was re-measured with my
   own instrument; where I used their shape I said so.
2. **Refused to fix anything I found.** `G-QE115-4` and `G-QE115-5` are reported with line numbers
   and the correction named, and left for their owners. `src/` is byte-identical to `8d4980c`.
3. **Refused to re-run a recorded dead end.** Ten are on file across seven context folders; the two
   that bore on this hop (the copied tree missing `AGENTS.md`; the worktree without `node_modules`)
   were avoided by construction, not by discovery.
4. **Refused to re-open the exit-code, CPU-clause or count-ceiling rulings.** Where I disagreed with
   a measurement I handed it back instead (`G-QE115-4`).
5. **Refused to stretch the accepted residual's cut trigger to fire.** `G-QE115-5` is adjacent to it
   and I checked the trigger's words and said plainly that it does not fire.
6. **Refused to grade the lane.** Three readings reported; `NFR-008` not graded, no `N8-LANE` line
   claimed, `plans/nfr-catalog.md` not opened for writing.
7. **Refused to send the ticket back on `G-QE115-4`** — and refused equally to bury it. The account
   of why that is even-handed rather than a softening is written out in the verdict note, in terms
   that let a reader overturn it.
8. **Refused to write `.grugops/test-skips.md`.** Read and used as input to the integrity check;
   never authored — an agent may not self-author a justification that clears its own gate.
9. **Refused to sign, accept or merge.** No UAT conducted, no acceptance recorded, nothing merged,
   nothing deployed. 13 production lines shipped, so the zero-production-lines waiver does not apply
   and the `In UAT` exit is the owner's word alone.
10. **Refused to emit a stamp.** `context.human_admission` is `off`; every note here is
    hand-authored under a soft kind and no `finding` is admissible on this install.

## The verdict, in one line, for anyone reading only this note

**PASS.** `In Review` → `Ready for UAT`. Both defects I raised are genuinely closed and I proved it
myself; `A10` is a real guard and I proved that by mutating it; three residuals are named and none
of them blocks. **The merge and the acceptance are still the owner's.**
