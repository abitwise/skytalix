---
id: 20261025T030904Z-software-engineer-decision-86f9bb11
kind: decision
by: software-engineer
at: 2026-10-25T03:09:04Z
verified_by: 
confidence: high (design as committed at 2c8a84f2)
refs:
  - ABC-204
  - EPIC-008
  - ABC-205
  - QE-204-a
  - QE-204-b
  - plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md
  - qe-ABC-204/20261025T025833Z-qe-e2e-decision-b5f4d5a1
  - qe-ABC-204/20261025T025833Z-qe-e2e-observation-fbff3e18
  - qe-ABC-204/20261025T030130Z-orchestrator-decision-f9d109ea
  - grugops/se-fix-ABC-204
  - 2c8a84f2
  - 16c51d1c
  - tools/rating/rating.ts
  - tools/rating/dist-manifest.ts
supersedes: 
seal: sha256:7c70afca13924b597a917621bbd283da3cab4780958442d7989971f99259a09b
---

# Software Engineer: ABC-204 fix. artifacts.txt records each side's whole dist/; the out-dir guard resolves the leaf

Task `se-fix-ABC-204`. The branch is `grugops/se-fix-ABC-204` from `grugops/qe-ABC-204` `16c51d1c`, fix commit `2c8a84f2`. It closes QE-204-b (MEDIUM) and QE-204-a (LOW) from `qe-ABC-204/…b5f4d5a1`, as the Orchestrator ordered in `qe-ABC-204/…f9d109ea`.

## QE-204-b: the whole-dist manifest
- New module `tools/rating/dist-manifest.ts`, imported by `rating.ts`. It is a separate module because `rating.ts` runs `main` at the top level, so importing it would start a run. The proof below calls the same function the harness calls.
- Each manifest line is `<sha256>  ./<path>`: every regular file under `dist/`, recursively, sorted by path bytes. The tree hash is the sha256 of those lines, each ending in a newline. This is the same format as QE's by-hand `raw/*/dist-manifest.txt`, so the figures compare one to one. The shell gives the same hash: `cd dist && find . -type f | LC_ALL=C sort | xargs shasum -a 256 | shasum -a 256`.
- A symlink, or any other non-regular entry, under `dist/` stops the run with an error. A `dist/` the manifest cannot fully describe is never recorded.
- The `artifacts.txt` block for each side is now `<name> <sha> dist/ (<n> files) tree sha256 <tree>`, then the manifest lines indented 2 spaces, then the `uci` `id`/`option` lines indented 2 spaces as before. The `dist/uci.js sha256` line is gone. Its hash is still recorded, as the `./uci.js` manifest line.
- No reader parses `artifacts.txt` (checked with `git grep`, outside `.grugops/context/`).

## QE-204-a: the symlinked out dir
- The guard is unchanged before `mkdirSync`, which still blocks creating a directory through a parent that resolves into the checkout. A second check after `mkdirSync`, before any write, runs `realpathSync(out)`. So an out dir that is, or resolves through, a symlink into the checkout is refused with `<out> is inside <repo>`, and nothing is written.

## Not changed
- No `src/` change and no change to play. The `cutechess-cli` command, the pins, the summary, `SHA256SUMS` and `cmd.txt` are byte-for-byte the same code. No test file was added: the page's A3 keeps `npm test` at 62 files, and the harness is outside the lane.
- The ticket page records the harness sha256 as `d4b16e20…35fa`, the `rating.ts` that ran the readings. At this tip, `rating.ts` is `d6b2a988…b172` and `dist-manifest.ts` is `78b1528e…357f`. The readings stand, because the fix changes how runs are recorded, not how they are played. The page is not edited here (the scope is `tools/rating/` only).
