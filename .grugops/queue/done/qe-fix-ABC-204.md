---
subtask: qe-fix-ABC-204
role: qe-e2e
ticket: plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md
ref: .grugops/context/qe-fix-ABC-204/
branch: new grugops/qe-fix-ABC-204 from grugops/se-fix-ABC-204 (64f29cdd), worktree ../wt-qe-fix-ABC-204
width: 3 of 3 (beside ticket-to-pr-ABC-216/217; no readings, no engine games)
---

# QE short re-check: ABC-204 fix (QE-204-b, QE-204-a)

## Do
- Read SE `se-fix-ABC-204/…86f9bb11`, `…39d453b2` and Orchestrator `qe-ABC-204/…f9d109ea`.
- Independently: the per-file `dist/` manifest separates two different builds and matches for identical ones (re-use the SE's scratch builds or your own); the symlinked out dir is refused and real outside dirs are not; game play code paths unchanged vs `16c51d1c` (diff read).
- Add a dated line to the page's `## Reading` / QE addendum: the readings ran with `rating.ts` `d4b16e20…`; the merged harness is `rating.ts` `d6b2a988…` + `dist-manifest.ts` `78b1528e…`; the readings stand (recording-only change).
- Gates: lint, typecheck, build, `npm test` + `last-run.json`, skips. Verdict PASS / PASS_WITH_GAPS / FAIL.

## Fences
- Only your worktree and `<scratchpad>/qe204fix/`. No `src/`/`tools/` edits. No engine games or readings. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task qe-fix-ABC-204). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**`PASS_WITH_GAPS`.** Branch `grugops/qe-fix-ABC-204` in `../wt-qe-fix-ABC-204` (own `npm ci --ignore-scripts`, node v26.11.1), from `64f29cdd`. **Tip `1558ed73`**: 3 sealed notes and the page's dated line. Not pushed, not merged. No `src/` or `tools/` edit. No engine games, no readings.

- **QE-204-b (MEDIUM): CLOSED.** QE made 2 builds of its own, and the SE's 3 were also hashed. The tip's `distManifest` and the shell pipeline agree on all 5:
  - `8ccba739` gives `3798b8d1…`; `3497aad2` gives `726e5225…`, equal ×3 across 2 producers. `uci.js` is `877e9595` in all 5, so the old line was blind.
  - Sensitivity: a 1-byte change, an added file, a nested file and a removed file all move the tree hash. A symlink in `dist/` stops the run.
- **QE-204-a (LOW): CLOSED.** 9 seeded, non-destructive guard probes were run at base `16c51d1c` and at head:
  - a leaf symlink into the checkout, to a subdir or to the root, is missed at base and refused at head (`is inside`);
  - parent-symlink and plain inside paths are refused at both; a dangling leaf symlink is refused (`ENOENT`) at both;
  - outside dirs and symlinks to them are not over-refused;
  - 0 writes inside the checkout; `git status` clean.
- **QE-204-h (LOW, new, pre-existing, not blocking):** the guard compares path strings.
  - A case-variant spelling or a `/System/Volumes/Data` alias of a checkout path gets through at both base and head (APFS is case-insensitive).
  - `realpathSync.native` fixes the case alias only. A `dev`/`ino` ancestor check fixes both.
  - The route is the Orchestrator's; it is not needed before ABC-205.
- **Diff read:** play code paths unchanged against `16c51d1c`. The `rating.ts` hunks are the header comment, one import, the `artifacts.txt` write and the guard; `uciLines` has the same arguments. The change is recording-only, so **the readings stand**.
- **Blobs:** `rating.ts` `d4b16e20…35fa` (readings) → `d6b2a988…b172`, plus `dist-manifest.ts` `78b1528e…357f`. These equal the brief and the SE.
- **Page:** one dated line was added under `## Reading` (QE/E2E addendum, 2026-10-25).
- **Gates:** lint, typecheck and build 0; `npm test` 62 files, 2073/2073, `last-run.json` success, 0 pending, 0 todo (Duration 7.16 s); skips 0, `No findings.`
- **UAT:** the waiver still applies (0 production lines). This verdict signs under `…5aaf7cec` item 2.
- **Owed:**
  - the Orchestrator merges into the ABC-204 line and rules Done;
  - QE-204-h's route is the Orchestrator's;
  - QE-204-d to Security/NFR is unchanged.
- **Notes:** proof `qe-fix-ABC-204/…9330d5d7`, QE-204-h `…46b85693`, verdict `…f1bc80ed`.

**Trace row** (for the Orchestrator):

| ABC-204 (qe-fix-ABC-204) | QE re-check PASS_WITH_GAPS at 64f29cdd: QE-204-b and QE-204-a CLOSED; new QE-204-h LOW (case-variant and firmlink alias paths pass the guard, pre-existing, not blocking); readings stand (recording-only) | EPIC-008 (ahead of ABC-205's D reading) | tools/rating/rating.ts d6b2a988… + dist-manifest.ts 78b1528e… (readings ran d4b16e20…) | NFR-008 untouched (62 files = base); no play change | grugops/qe-fix-ABC-204 @ 1558ed73<br>.grugops/context/qe-fix-ABC-204/notes/ (3); ABC-204 ## Reading dated addendum | lint/typecheck/build 0; npm test 62/2073 success, 7.16 s; skips 0 No findings.; hash proof 5 builds (8ccba739 3798b8d1… v 3497aad2 726e5225… ×3) + 5 mutations; 9 guard probes base v head | waiver applies (0 production lines); signs UAT under …5aaf7cec item 2 | Orchestrator merge and Done; QE-204-h route; QE-204-d to Security/NFR | In Review → Orchestrator's call |
