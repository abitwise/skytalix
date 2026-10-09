---
id: 20261009T212814Z-software-engineer-decision-abc125-row-placement-and-mutant-on-shipped-file-55e1389b
kind: decision
by: software-engineer
at: 2026-10-09T21:28:14Z
verified_by: 
confidence: high
refs:
  - ABC-125
  - ABC-086
  - M5
  - src/engine.test.ts
  - plans/tickets/ABC-125-two-live-virtual-clocks-at-different-steps.md
supersedes: 
---

# `ABC-125`: where the row lives, what it says, and which file `M5` was planted in

Hand-authored, no seal (degraded posture, `AGENTS.md`).

1. **Placement: a new `it` in the existing `ABC-086 A6` describe**, directly after the per-instance
   row, as the page's Scope names. It is not merged into the per-instance row: that row asserts that
   **state** stays in its instance, and this one asserts that the **step** does. Kept as two rows, a
   red line names which one leaked.
2. **The title carries `(ABC-125)`**, so a red run names the ticket that owns the row. It follows
   the file's practice of naming the criterion in the title.
3. **There is a two-line comment** that names `M5`'s reading `[0, 0, 0.5, 0.5, 1, 1]`, and why
   `toEqual` is exact (dyadic steps, from ticket test note 2). It is there so that a future edit to
   non-dyadic steps is a visible choice.
4. **`M5` was planted in the shipped `src/virtual-clock.ts`, not by copying QE's `m5.ts`.** QE's
   `pristine.ts` predates the shipped `: Clock` return type and its import, so copying `m5.ts`
   would have planted `M5` plus a type change. The three-line `sed` patch is QE's mutation exactly
   (`raw-m5-planted.diff.txt`). The file was reverted with `git checkout`, and it is checked
   byte-identical against `928c83b`.
5. **No production line, no helper, no new file.** Nothing else in `src/` was touched.
