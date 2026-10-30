---
subtask: se-ABC-244
role: software-engineer
ticket: ABC-244
ref: .grugops/context/se-ABC-244/
branch: new grugops/ABC-244 from main de02f8c2 (worktree .claude/worktrees/se-ABC-244)
width: ALONE-ish (nothing else scheduled; no timed reads owed by the SE — A8/A9 are QE's)
---
# SE ABC-244: time-blind virtual-clock rows take the coarsest kill-set-preserving step (ADR-0046 § Addendum 2026-10-30)
## Read
plans/tickets/ABC-244-time-blind-virtual-clock-rows-in-the-cli-and-uci-tests-take-the-coarsest-kill-set-preserving-step.md (all of it: Scope U1/U2, the step-rule word and its 3 conditions, A1–A10), ADR-0046 § Addendum 2026-10-30 (R1–R4),
arch-g8-headroom notes (`…e15a97a2` + its observation), how ABC-177 was built (the precedent).
## Do
Census per A1; move U1 and U2 per the conditions (the frozen mutant list is QE's — do not choose steps by mutant runs of your own
beyond what the ticket assigns the SE); A3–A5 byte rules; gates via `npm run …`, npm test count. Report an informal npm test wall.
## Fences
Only step literals in src/cli.test.ts and src/uci-session.test.ts (A4/A5). Never push, force, amend, rebase, merge into main. No board
edits. Never bare npx/npm exec. No host paths. Scratch `se-244/`. Wait on jobs via output file or `kill -0`, never `while pgrep -f`.
## Publish
Sealed notes (task `se-ABC-244`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-10-30, Software Engineer. Done. Branch `grugops/ABC-244`, from `main` `d59e3194` (its `src/` is identical to `161e940d`). Code `25282ad4`; notes, brief and claim are in the next commit. Not merged, and nothing pushed. No timed read was taken: A8 and A9 are QE's.**

- **Steps (A2)**, decision `…f1e84d64`:
  - **U1 (`ABC-230`, CLI A1/A3 + UCI A2): 100 → 1 000** on both surfaces. All 4 rows kill the same mutants at base and tip.
  - **U2 (`ABC-241`, CLI A4/A7 + UCI A5): kept at 100** on both. Tried at 1 000, the CLI A4 and A7 rows stop killing `F230` (the seam ignores the injected list): {F230, REP0, S241M1} → {REP0, S241M1}, and {F230, S241M1} → {S241M1}. Condition 1 keeps the CLI half at 100, and R3 keeps the UCI half with it.
  - Condition 2 holds for both units: 4 000 ms is 40 reads at step 100 and 4 at 1 000.
- **Census (A1)**, observation `…ee17f704`: 8 unit rows and 10 candidates, each with budget, step, reads and class. **No census unit joins.**
  - `:392`, `:452` and `:1989` read time or depth.
  - `:298`, `:1033`, `:1051`, `:1543` and `:1748` are already at 1 000, or do not search.
  - `:1804` and `:1910` read equal nodes at 1 000 (30 = 30, 370 = 370), so there is no saving to take.
- **Parity list:** 9 SE mutants, frozen at 2026-10-30T22:38:25Z, before any head run: `F230`, `QM1`–`QM4`, `UNTRIM`, `REP0`, `S241M1`, `S241M6`. The file is `raw/probe/frozen-mutants.json`, sha256 `a624b9f5…1c45`.
- **A3:** `npm test` reads 2 322 / 2 322 at base and at tip, with 0 skipped.
  - `cli.test.ts` has 108 rows at each. `uci-session.test.ts` has 200.
  - The sorted names are byte-identical.
- **A4/A5:** the diff touches only the two files.
  - 2 step lines (`100` → `1_000`) and 4 comment lines that cite `ABC-244` and `ADR-0046` § Addendum.
  - No `expect(`, `it(`, `describe(` or helper line changed.
  - The UAT measurement is empty.
- **A10:** lint, typecheck and build exit 0. `test-skip-integrity` prints "No findings." The `ABC-230`/`ABC-241` rows are green and unedited.
- **Informal wall** (n = 1 per arm, not a reading): base 9.67 s, tip 9.17 s.
- **Readings:** observation `…1b63ff56`. **Findings and QE handoff:** observation `…497faf89`.
  - SE-244-a LOW: U2's `F230` kill depends on depth.
  - SE-244-b INFO: 2 unit rows kill none of the 9 mutants.
  - SE-244-c INFO: only U1 moved, so the saving sits at the low end.
  - SE-244-d INFO: the wall is informal.
  - SE-244-e INFO: `S241M1`/`S241M6` are reconstructed.
- **QE owes:**
  - A6: freeze a list holding at least the 9, then re-confirm on the 4 changed rows.
  - A7: node census, 4 rows.
  - A8: `N8-LANE` on the two-file set, heap flag 128 (the SUITE row).
  - A9: `G8` b h h b b h, base `d59e3194`, head `25282ad4`, target ≤ 9.4 s.
  - Then Security/NFR gives the `NFR-008` state.
- STOP: none.

### Trace row (10 cells, header order)

| ABC-244 | Time-blind ABC-230 virtual-clock rows take step 1 000 on both surfaces; ABC-241 rows keep 100 (they lose F230 at 1 000); no census unit | EPIC-010 | ADR-0046 § Addendum 2026-10-30 R1–R3 | NFR-008 G8 owed (A9; informal 9.17 s, n = 1); N8-LANE owed (A8); R1 census A1 recorded | grugops/ABC-244 @ 25282ad4: src/cli.test.ts, src/uci-session.test.ts (test-only) | npm test 63 files / 2 322 pass, skips 0; SE parity 9 mutants, 0 changed rows differ; names byte-identical per file | — (UAT owed; the QE verdict signs) | — | In Review (branch, not merged; A6–A9 QE) |
