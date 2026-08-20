---
id: 20260820T172000Z-qe-e2e-observation-main-moved-under-me-mid-verdict-and-i-checked-whether-it-touched-what-i-measured-e5b3c19d
kind: observation
by: qe-e2e
role: qe-e2e
task: qe-ABC-043-review-exit-2026-08-20
at: 2026-08-20T17:20:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-050
  - src/cli.ts
  - src/cli.test.ts
supersedes:
---

# `main` MOVED UNDER ME BETWEEN THE VERDICT AND THE BOARD WRITE. I re-measured rather than assume it was harmless

**I took the verdict at `main` @ `d127ae3`. By the time I wrote the board, `main` was `ca50b26`** —
`ABC-050` merged mid-hop by the agent that was already writing into this shared tree.

**What moved, measured with `git diff --numstat d127ae3 ca50b26`:** five context notes, `biome.json`
(+1), `plans/board.md` (+2/−2), `plans/traceability.md` (+3), `src/glyph-mode.nfr.test.ts` (+24/−2),
`tsconfig.json` (+1/−1), `vitest.config.ts` (+12/−6).

**What it did NOT move, checked by blob hash rather than by reading the numstat:**

```
git rev-parse d127ae3:src/cli.ts   == ca50b26:src/cli.ts        → IDENTICAL
git rev-parse d127ae3:src/cli.test.ts == ca50b26:src/cli.test.ts → IDENTICAL
```

**Both of `ABC-043`'s delivered files are byte-identical across the move, so every decoy result, every
criterion verdict and the whole `G-05` adjudication stand unchanged.** No production line under `src/`
moved at all — `ABC-050`'s only `src/` file is a `.test.ts`.

**One number in my gate claim drifted and I am correcting it here rather than editing that note:**
`npm run lint` read **72 files at 15:52** (at `d127ae3`) and **73 files at 16:21** (at `ca50b26`).
**Exit 0 both times.** The extra file is `vitest.config.ts`, which `ABC-050` brought inside
`biome.json`'s `includes` — that is that ticket's whole point, not a drift in mine. The suite re-read
**40 files / 1207 tests / 0 failed** after the move, so the gate figures in the verdict hold at both
commits.

**The verdict is recorded against `d127ae3` and I am not restating it against `ca50b26`** — a verdict
belongs to the tree it was measured on, and the honest way to carry it forward is to name the commit
and the check that showed the delta could not reach it.

**This is the same root cause a third time in one day: one working tree, several writers, no
isolation.** `ABC-113`'s QE hop reported the owner committing into its measurement window; this hop
found another agent's edits in `src/` at its first decoy revert, and then found `main` itself moving
between the verdict and the write-up. **Still unowned, still not this ticket's, and now with three
dated instances behind it.**
