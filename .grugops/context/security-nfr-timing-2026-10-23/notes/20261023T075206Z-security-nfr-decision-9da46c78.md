---
id: 20261023T075206Z-security-nfr-decision-9da46c78
kind: decision
by: security-nfr
at: 2026-10-23T07:52:06Z
verified_by: 
confidence: high on this host; UNKNOWN - verify beyond the M3 and for a disk-cold launch
refs:
  - security-nfr-timing-2026-10-23
  - ABC-200
  - ABC-201
  - EPIC-006
  - NFR-007
  - NFR-008
  - N8-LANE
  - ADR-0035
  - ADR-0018
  - c91445e3
  - 1d5316e0
  - 5bf1e3d6
  - 55618845
  - c9dd9d1f
  - 52c15f56
  - 20261017T131800Z-security-nfr-observation-abc096-timing-a4-nfr007-window-w1-clean-8d3f6c15
  - 20261023T074000Z-orchestrator-decision-8c94d901
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
  - AR-1
  - AR-096-DISKCOLD
  - plans/nfr-catalog.md
  - plans/epics/EPIC-006-game-session-and-packaging.md
  - plans/tickets/ABC-201-on-a-fresh-git-clone-npm-install-then-npm-run-chess-starts-a-playable-game-and-the-first-board-in-under-2-s.md
supersedes: 
seal: sha256:589d3d26c72a6a0f220710ad837b0a9e6c97605e105b778afe85b26f413a8e8a
---

# ABC-201: A1–A4 **MET** at S = `c91445e3`. NFR-007 MET at 220.9 ms max (n = 10, first launch counted, and it was the max). EPIC-006 acceptance 1 MET. ADR-0018 Decision 3's revisit trigger does **not** fire

This is a `decision`, not a `finding` (`human_admission` is off). Security/NFR built this reading, as the page assigns. The readings are in this task's observation note.

- **A1 MET.** On a fresh clone, `npm install` with no flags, an empty cache and an empty user config exited 0.
- **A2 MET.** Exit 0, 0 stderr bytes, `1. e4 e5` (2 plies) and `input ended` once, after the last frame.
- **A3 MET.** Max 220.9 ms < 2 000 ms, about 9× under the bar. Min 188.3 ms and median 192.6 ms. The first launch after the install was 220.9 ms. The host was held throughout.
- **A4 MET.**
  - **The catalog:** one dated insertion at the head of the `NFR-007` `Verified by` cell. The `Target` cell (the `< 2 s` bar and its denominator) is byte-identical. All other `NFR-` rows are byte-identical, each hashed. Removing the insertion recovers the old file exactly.
  - **The pages:** one dated line on `EPIC-006`, and `## Reading` on the ABC-201 page.
  - **Untouched:** `src/`, `tools/` and `package*.json`.
- **Install scripts: ruled acceptable, not a STOP.** `esbuild` 0.28.1's postinstall can only fetch the lock-pinned platform package from the default registry, and `fsevents` 2.3.3 has no script. On npm 11.20.0 neither ran (`allowScripts` warning; same as `…daf38cf7`). This is the user's real install path, and the game does not depend on either package.
- **Audit:** the 3 dev-only pairs on AR-1's record; `--omit=dev` finds 0. No new risk.
- **Bounds.**
  - The "nothing else installed" half of acceptance 1 is host-bounded, so it stays `UNKNOWN - verify` beyond this M3.
  - A disk-cold launch was not read (`AR-096-DISKCOLD` stands).
- **For the Orchestrator.**
  - **UAT:** 0 production lines, so the waiver form applies; this note is the evidence.
  - **`EPIC-006`:** whether to close it is the Orchestrator's card move under `…5aaf7cec`. Acceptance 1 is now read MET, and 2–4 were already met.
- **Result:** PASS. No required fixes. No new accepted risk.
