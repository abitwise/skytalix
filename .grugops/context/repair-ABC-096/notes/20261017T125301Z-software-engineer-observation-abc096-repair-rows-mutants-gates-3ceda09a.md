---
id: 20261017T125301Z-software-engineer-observation-abc096-repair-rows-mutants-gates-3ceda09a
kind: observation
by: software-engineer
task: repair-ABC-096
at: 2026-10-17T12:53:01Z
verified_by:
confidence: high
refs:
  - ABC-096
  - ADR-0043
  - QE-096-a
  - QE-096-b
  - src/render-seam.test.ts
  - 20261017T124600Z-qe-e2e-observation-abc096-mutants-qe-vs-se-9b3d51f0
  - 20261017T124700Z-qe-e2e-decision-abc096-verdict-pass-with-gaps-e5a80c37
supersedes:
---

# Repair `ABC-096`: two test rows close `QE-096-a` and `QE-096-b`; production code unchanged

Hand-authored and unsealed. The test commit is `3ceda09a`, on top of `00fb0f75`. Only `src/render-seam.test.ts` changed
under `src/`. I took no timing reading.

**The rows** (in `describe("ABC-096 — …")`):
- `A1 / A4 — an astral run at an odd offset…`: in unicode mode, `"a"` + 20 × `U+1D11E` must show `a` + 8 × `U+1D11E` +
  `...`, with no lone surrogate in any row and the row count unchanged (`QE-096-a`).
- `A1 — the family ends at ': ', not at a bare ':'…`: `"Foo:Bar: Baz Variation"` and `"Foo:Bar"` must both show
  `Foo:Bar` (`QE-096-b`).

**Red on the mutant, green on the real code.** I used a `git archive` copy outside the repository (scratchpad
`repair096/tip`) and applied QE's exact substitutions from `qe096/qe_mut.py`. I restored the file after each mutant and
checked it with `cmp`.
- Q2 (`const kept = family.slice(undefined, HISTORY_COLS - ELLIPSIS.length);`): 1 failed / 27 passed. Only the
  odd-offset row failed. The received row 1 was `a` + 8 × `U+1D11E` + `\uD834...`, a lone high surrogate.
- Q9 (`FAMILY_END = ":"`): 1 failed / 27 passed. Only the separator row failed.
- Real code: 28 / 28 passed in the copy and in the worktree.

**Gates at `3ceda09a`, in the worktree:**
- lint exit 0 (113 files);
- typecheck exit 0;
- build exit 0;
- `npm test` exit 0, 58 files / 1824 tests (1822 + 2), `last-run.json` `success: true`, 0 failed, 0 pending;
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`;
- `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`: exit 0, 10 passed.
