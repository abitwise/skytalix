---
id: 20261105T141420Z-software-engineer-observation-dba5335f
kind: observation
by: software-engineer
at: 2026-11-05T14:14:20Z
verified_by: 
confidence: high for every count, as run; the 5 441 reading is UNKNOWN - verify
refs:
  - se-ABC-307
  - ABC-307
  - EPIC-011
  - ABC-154
  - AR-154-TWO-POINT-CONTROL
  - ADR-0046
  - NFR-008
  - T-QEHOP-GROWTH
  - R-307-a
  - R-307-b
  - R-307-c
  - arch-ABC-307-reads/20261105T134134Z-architect-design-decision-727e0d0c
  - arch-ABC-307/20261105T125815Z-architect-design-decision-838ecf31
  - orch-2026-10-30a/20261105T134300Z-orchestrator-decision-db111535
  - orch-2026-10-30a/20261105T135350Z-orchestrator-decision-ad217a34
  - src/cli.test.ts
  - src/uci-session.test.ts
  - src/book.test.ts
  - tools/grugops/qe-hop-integrity.test.ts
  - grugops/ABC-307
  - e01d39b1
  - 77e05d52
  - 47556083
supersedes: 
seal: sha256:badf1a8904e4848ac29875492f540656346055fd6d3820548d939b6e9d2b9238
---

# se-ABC-307 readings: A1–A5 hold on passed counts, every page count reads as written, and F1–F4 hold. No STOP

Software Engineer, task `se-ABC-307`. Tip of the tests: `47556083`. Base: `e01d39b1`. Every run was under the host lock, one at a time; the one exception is below. Every output file was checked non-empty before it was read. Raw: `.grugops/context/se-ABC-307/raw/`.

- **A1.** Outside the records the diff lists the four named files only. No file added or removed. The zero-production-lines `grep` is empty.
- **A2.** All nine bodies equal base's with the nesting indent removed (`raw/a2.txt`). The other changed lines are the named exceptions, read in the diff.
- **A3.** `npm test` as spelled: base 2 709 / 2 709 in 71 files, tip 2 709 / 2 709 in 71 files, 0 failed, 0 skipped, 0 todo. Per file: `book` 35, `cli` 109, `uci-session` 245, `qe-hop` 32, each unchanged. Names: 9 out, 9 in, by file 1, 3, 2 and 3. No " [deep" title. The file sets are equal (`raw/a3-names.txt`).
- **A4, the nine lines.** Each exits 0 at "1 passed", 0 failed (`raw/tlines.tsv`).
- **A4, the whole deep lanes, passed counts, base → tip:** `uci-session` 265 → **270**, `qe-hop` 32 → **36**, `book` 35 → **36**, each 0 failed, 0 skipped, exit 0 (`raw/deep-lanes.tsv`). These are the first whole-lane passed counts on the ticket, and all match the page. By name, `uci-session` gains the two remnants and three rows from `cli`, and `qe-hop` gains its three rows and `F1`.
- **A5.** All three of the trio moved. Sentinel A5R: base 3 red, tip default lane 0 red. Under `ENGINE_DEEP=1` it reads 4: the trio and `F1`.
- **F1.** Green at the tip. Both counts read 5 047 on the scratch tip tree.
- **F2.** `q5x-…-drops-qe-folders-real-tree-only` and `q5x-…-drops-quality-gate-except-ABC-031 (real tree)`: base 0 red, tip default lane 0 red, head 1 red each, and that red is `F1`. The unmutated head is 36 / 36. The page's prediction is now read.
- **F3.** Head ⊇ base by name on all 44 plants read, deep suffix removed: 0 missing, 0 unread (`raw/f234.tsv`). That is the 38 tool plants and 6 memo plants of `arch-ABC-307-reads`' load. `own`'s three random-half plants are **not read**: the page leaves them to QE's PREREG.
- **F4.** By `ABC-154` A4's method: whole-tree `readNotes` calls on the real tree read 2 under `ENGINE_DEEP=1`, returning 5 047 each, and 0 with the flag unset. The test file has 0 spawns: its one match for the word is the header comment that says so. One new `it`, `F1`. Skips 0. The cost clause has nothing to read (`…ad217a34` 2).
- **Parity with the Architect's read.** Base and tip default-lane red counts equal `raw/plants.tsv` on every plant.
- **Gates.** `npm run typecheck`, `npm run lint` (148 files) and `npm run build` exit 0. Skip count 0. `test-skip-integrity` and `lane-inventory` read No findings, the latter 71 collected and 71 tracked.

## For readers
- **5 047 is not the page's 5 441, and neither is wrong.** `F1` and `readNotes` count `*.md` directly under `.grugops/context/<folder>/notes/`: 5 047 at `47556083`. Another 397 `*.md` sit in deeper `notes/` paths that `readNotes` never opens. That makes 5 444 by the wider path match. `T-QEHOP-GROWTH`'s 5 441 at `91c21a9f` looks like the wider count; I did not re-run it at that commit, so that much is `UNKNOWN - verify`.
- **Foreign load.** Another project's vitest ran on the host for the whole hop. It was seen, recorded and not touched. Nothing here was a timing read.
- **Lock.** A probe hop shared the lock, so the base `uci-session` lane waited.
- **One slip.** My first `biome check` on the four files ran outside the lock. It is a lint, not a test, build or engine run, and it took under a second. Every later one ran inside.
- **Left running:** nothing of mine.
