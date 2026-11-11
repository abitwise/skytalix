---
id: 20261111T081302Z-orchestrator-decision-54f06923
kind: decision
by: orchestrator
at: 2026-11-11T08:13:02Z
verified_by: 
confidence: high
refs:
  - ABC-319
  - VERSIONING.md
  - CHANGELOG.md
  - package.json
  - package-lock.json
  - README.md
  - src/levels.test.ts
  - 20261111T081049Z-orchestrator-decision-c8863988
supersedes: 
seal: sha256:3b84eda50638f4107cd4a137d60d3ea3b212fc5d1189b2ca619b478562be5eed
---

Owner, 2026-11-11: "go ahead with v1.1.0 release". Cut as ABC-319, following VERSIONING.md. It is MINOR because a level is retuned (ABC-318, level 6 to 10 s).

Acceptance:
- **D1, version.** `package.json` "version" becomes 1.1.0, and so do package-lock.json's matching fields (`npm version 1.1.0 --no-git-tag-version` or equivalent; no tag by SE). `npm run chess -- --version` and `bin/skytalix-uci --version` (after the build) print `skytalix 1.1.0`. The README line "for example `skytalix 1.0.0`" becomes 1.1.0. Tests that read the version keep reading package.json, with no hard-coded copy.
- **D2, CHANGELOG.** `## [Unreleased]` becomes `## [1.1.0] - 2026-11-11`, with an empty `## [Unreleased]` above it. The 1.1.0 entry, in plain short English:
  - **Changed:** level 6 thinks 10 s a move (was 5 s).
  - **Changed:** README Levels table.
  - **Strength (measured only, per VERSIONING.md):** levels 1–4 against Stockfish 19 with `UCI_LimitStrength`, 200 games each, both sides at the level's time per move:
    - L1 1499 ± 53 at UCI_Elo 1320;
    - L2 1678 ± 49 at 1720;
    - L3 1909 ± 48 at 1890;
    - L4 2094 ± 48 at 2040.

    These are on the README Strength section's scale only, and are not FIDE or online ratings.
  - No projected figure appears in the release entry.
  - Link definitions: `[Unreleased]` compares v1.1.0...HEAD; `[1.1.0]` is releases/tag/v1.1.0.
- **D3, bundled gaps** (the owner's bundle rule; …c8863988):
  - README L6 strength reads `~2310–2420, projected` (2413.1 rounded outward).
  - `src/levels.test.ts` lines 395 and 404 change "3 s" text to the current fact; test names and comments only, no assertion change.
- **D4, gates.** Lint, typecheck, unit (one worker), build, the art cmp, and both `--version` outputs, each alone under the host lock. QE's verdict signs UAT.

After the merge, the orchestrator creates annotated tag `v1.1.0` on main locally, with message "skytalix 1.1.0". The owner pushes main and the tag, and publishes the Release page with the CHANGELOG 1.1.0 entry.
