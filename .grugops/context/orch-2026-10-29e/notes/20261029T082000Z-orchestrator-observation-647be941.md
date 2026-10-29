---
id: 20261029T082000Z-orchestrator-observation-647be941
kind: observation
by: orchestrator
at: 2026-10-29T08:20:00Z
verified_by: 
confidence: high
refs:
  - se-tools-rating-concurrency/…f999dea4
  - tools/rating/rating.ts
  - ABC-204
  - qe-epic008-q4c
supersedes: 
seal: sha256:8d24aa0fdcbe2812f0ac605b5ea23f58fd64769c4cc07b51651a73b1e7b8d3eb
---

# se-tools-rating-concurrency reviewed and merged; one npx slip outside the repo

**Review:**
- The `tools/rating/rating.ts` diff is +20/−10.
- Without the flag the widths are R 2 and D 3. The arg list is byte-identical to before (SE dry check, stub cutechess, cmd.txt `cmp` equal in both modes).
- The flag is checked as text against `^[1-8]$` before any work.
- ABC-204 has a dated 2026-10-29 line. No src/ or data/ change. Gates 63/2 128, skips 0.
- No cutechess was running at review.

**Slip (LOW, outside the repo):**
- Before `npm ci`, the SE ran `npx biome`. npx fetched and ran the unrelated npm package `biome@0.3.3`, a 2016 per-project env-var manager, not the `@biomejs/biome` linter. It came with 107 dependencies in an npx cache dir.
- Effects found:
  - its startup step created an empty `~/.biome` directory;
  - `core-js`'s postinstall ran (a banner script).
- No repo or worktree file changed.
- The leftovers (the empty dir and the npx cache entry) are the owner's to remove. The Orchestrator does not delete in the home directory.
- **Lesson for SE briefs:** run linters only through `npm run lint` after `npm ci`; never through a bare `npx <name>`.

**Q4 (c):** `qe-epic008-q4c` stays HELD for the owner's width (3/2/1) and his "counts" / "info only".
