---
id: 20261106T203245Z-architect-design-observation-e535c3c9
kind: observation
by: architect-design
at: 2026-11-06T20:32:45Z
verified_by: 
confidence: high on the arithmetic; nothing run
refs:
  - ABC-291
  - ABC-282
  - ABC-303
  - ADR-0075
  - ADR-0071
  - ADR-0072
  - ADR-0056
  - EPIC-011
  - se-ABC-291/20261106T201944Z-software-engineer-failed-attempt-a8daf408
  - se-ABC-291/20261106T201944Z-software-engineer-decision-d68ef14e
  - se-ABC-291/20261106T201944Z-software-engineer-observation-cb124720
  - orch-2026-10-30a/20261103T221607Z-orchestrator-decision-42c82347
supersedes: 
seal: sha256:edf51321f1e5ee313f6785e20dee6a24d7a2f67ccae8e4c5db2fbc692f7c0643
---

# arch-ABC-291-stop observation: what the ruling was checked against, the one-read margin on `D8`, and what stays unread

Read at `63af973e`, read only, and at `main` `48993089`. Nothing run. Every figure below is the SE's record or arithmetic on it.

## The figures, how far each is checked
- **`se-ABC-291`'s raw does not hold the six session lines.** `raw/out/lanes-deep1.txt` has counts only. The new literals come from `…a8daf408`'s table.
- **Checked independently:**
  - `cp 74` equals K0 (c)'s position-6 d8 score (`raw/out/K0c-build.out`).
  - `196681 = 73 + 192 × 1024` and `69705 = 73 + 68 × 1024`. With 8 and 7 loop reads those are the 200th and 75th clock reads, so both stop nodes follow from `deepen` and `countNode`.
  - Head d8 at 81 563 and d9 at 201 352 put `D8`'s abort inside iteration 9, so depth 8 holds.
  - `nps`: 978 512, 917 171 and 624 353 by division. `time 17` holds at 10 614: 10 node checks and 6 loop reads, as at 10 513.
- **Not checked by anything but the note:** `cp 88`, `cp 99` and `nodes 10614`. The lane run in the repair is their check, and the STOP line covers a difference.

## `D8` reads a leak by one clock read
- `…a8daf408` says the five lines' columns are what a leak would change, carried from U2. On this tree that is true, narrowly. Depth 8 ends after 86 reads, the next read returns 87, and the soft limit is 86.96. One read fewer and iteration 9 starts, and a leaked search reads the same line as a clean one. On the bundle's tree the margin was 14.
- **So the next tree that shortens depth 8 by about 1 000 nodes blinds `D8`,** with nothing red. `D7` does not share this: D3's row is its leak line. The default-lane "hands no soft limit" rows read the handing itself, in all eight cases, so W1's claim does not rest on `D8`.
- **For QE:** plant `softMs` on the `level` row and confirm `D8` reads red. That turns this arithmetic into a read. It is a mutant on a copy, not a bar.

## A0-1 and A0-2 at the tip, outside the brief's list
- `072397fb` hands `chooseMoveWithoutPawnShape` `softMs: 1`, against D12 item 6. It is green, the SE did not name it, and the note's § 5 item 4 removes it.
- A0-2 has no shipped line left (`e76d22f3`). d4 allows the re-point, and the door shares `deepen`. Which shipped row moved its stop is not on the record.

## For `qe-ABC-291-k1`, not ruled here
- Position-6's head scores sit far from the off door's on these rows: d7 88 against 43, d8 74 against 45, d9 65 against 34, d6 99 against 87. These are search scores, not the static part, and no bar reads them. They may bear on the drift question, and the Architect did not work them.

## Not read
The K1 fixtures, the drift cause, `ABC-282`'s page, any `mut.py` result, and whether the D8 leak line is what a run would print.
