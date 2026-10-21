---
id: 20261021T103801Z-ba-pm-decision-faaf2f14
kind: decision
by: ba-pm
at: 2026-10-21T10:38:01Z
verified_by: 
confidence: high (base readings measured at afc8d43a; head reds for fix 2/3 expected, not measured: UNKNOWN - verify by the SE)
refs:
  - ABC-161
  - QE-101-a
  - QE-101-b
  - SEC-101-a
  - ABC-174
  - ABC-096
  - ABC-168
  - be6a5599
  - f6b63c1c
  - b20eb451
  - afc8d43a
  - plans/tickets/ABC-161-three-cli-test-rows-a-wrong-difficulty-build-passes.md
  - 20261021T102707Z-software-engineer-decision-67e9ccc1
  - 20261021T102744Z-software-engineer-observation-b56b418c
  - 20261021T103740Z-ba-pm-observation-3d29ca70
supersedes: 
seal: sha256:8c25270dd819e27a8335030b91befd425e843222d8b2ad4be33c293951b06a38
---

# ABC-161 re-worded for main afc8d43a: fix 1 KEPT and re-aimed at levels 1-3, A3 is 5 of 5, DoR 10/10, Backlog → Ready

Inputs: the SE stop `…67e9ccc1` and readings `…b56b418c`, plus this task's `…observation-3d29ca70`. Authoritative text: the ABC-161 page's `## Scope` and `## Acceptance`.

**1. Fix 1 is KEPT, and A1 is re-worded.**
- *Why the row catches P11 today.* `A8′` reds P11 only because level 4's `blunderRate` 0.05 falls between seed 7's first two draws, 0.0117 and 0.0620. That is a property of the `ABC-174` table, not of the row.
- *What stays blind.* A rebuild at any of levels 1-3 still passes the whole lane (P11-L1..L3: 1987/1987). A later re-cut that moves level 4 to ≤ 0.0117 or above 0.0620 blinds the row to P11 entirely, and nothing would say so.
- *What the row claims.* Its own comment says the seam keeps "the level's own generator across calls" for each level.
- *Cost.* Fix 1 is one token (`call < 3`), measured to red P11-L1..L4 at seed 7.
- *Ruling.* Dropping it would leave QE-101-a closed by coincidence. That is the shape QE-101-a was raised against.

**The new A1.**
- P11-L1, P11-L2 and P11-L3 are each green on base and red on head, 3 of 3, at `A8′`'s equivalence row.
- P11 and P11-L4 are red on both.
- The delivered seam is green on head.
- The row's non-vacuity block is kept.

**Seed options.** The page's old seed option `4294967295` no longer qualifies: levels 3 and 4 decide alike on its draws. The Engineer may still pick a seed instead of `call < 3` if A1 holds.

**2. A3 is re-worded.**
- P9a, P9b, P9c, P9d and P9e are each green on base and red on head, 5 of 5, at `ABC-065` `A3`.
- The real `AGENTS.md` is green on head.
- Fix 3's text is unchanged. P9e's head red already forces the value list to be read from the `|` list, not the `-- --colour black` example.

**3. A2 and A4 are unchanged.** A4 now names its base counts as read at the branch base (59 / 1987 at `afc8d43a`).

**4. Pointers.**
- Test line numbers are dropped in favour of row names.
- "1810 of 1810" and "78 of 78" are replaced by the `afc8d43a` readings: 1987/1987, and 88 tests in the file.
- The `ABC-096` dependency is marked discharged (`b20eb451`).
- `ABC-168` (Backlog) is named as the other `src/cli.test.ts` editor. It edits a different row, so no order is needed.
- The production line refs (`src/level-seam.ts:15`, `src/cli-options.ts:158`) were re-read and hold.

**5. QE-101-a stays OPEN.** Its 2026-10-12 symptom, P11 passing the lane, has been gone since `be6a5599`. The gap it names, that `A8′` does not discriminate a per-move rebuild, still stands at levels 1-3. It closes when ABC-161 merges with A1 met (QE re-plants P11-L1..L3). QE-101-b also stays open, widened to 5 of 5. SEC-101-a is unchanged.

**6. Size, priority, DoR.**
- Size: XS (about 13 plants, three edits in one file).
- Priority: P3. The promotion trigger is kept and gains one clause: a ticket that re-cuts a level's `blunderRate` in `LEVELS`. That table is what the level-4 catch rests on.
- DoR: 10 of 10, so the ticket goes Backlog → Ready, which moves Ready from 2/8 to 3/8.
