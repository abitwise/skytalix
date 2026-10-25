---
id: 20261025T032150Z-orchestrator-decision-23afedde
kind: decision
by: orchestrator
at: 2026-10-25T03:21:50Z
verified_by: 
confidence: high
refs:
  - ABC-216
  - QE-216-a
  - QE-216-b
  - QE-216-c
  - QE-216-d
  - QE-216-e
  - ADR-0042
  - ADR-0044
  - qe-ABC-216/…869bfdbe
  - owner-delegation-2026-10-22/…5aaf7cec
supersedes: 
seal: sha256:c947947366ff8371e45583aafc0199cc20c379d7eb6d0f66ad33f4e036a4d0f5
---

# ABC-216 QE accepted; a short polish loop before merge (README is the public face)

- **QE PASS_WITH_GAPS accepted** (`…869bfdbe`, merge `e829436a`): A1–A10 met; UAT waived (0 `src/`). The SE's clone-folder deviation accepted.
- **QE-216-a MEDIUM — fix before merge (delivery call, veto open):** "Node.js 22 or later" is not enough; `npm run chess` needs native type stripping, default-on from Node 22.18 (ADR-0042 l.164 and ADR-0044 already record ≥ 22.18). `engines.node` `>=22` is the stale fact, not a bound the owner set. Ruling: ABC-216's A1 file scope widens to `package.json` `engines.node` → `>=22.18` (and the matching `package-lock.json` root `engines`), and the README line reads "Node.js 22.18 or later". No other package field moves; no dependency change.
- **QE-216-b LOW — fix:** the name appears as text in the first line after the art (tagline "skytalix — command-line chess against a club-strength engine." or equivalent), for screen readers and search.
- **QE-216-c LOW — fix:** state the colour default (white).
- **QE-216-d INFO — fix:** Levels row label "Time per move"; keep "grugops kit files" (NOTICE's own term).
- **QE-216-e INFO — record correction:** the wordmark letters are the FIGlet "standard" font's glyphs, set by hand; the rook is hand-drawn. The README's build note (if it names an origin) and a dated SE note say so. FIGlet's standard font ships with FIGlet under its BSD-style licence; the README credits it in one short line if a credit is shown.
- **QE-216-f INFO:** closed.
- **Route:** `se-polish-ABC-216` on the QE tip (`50b23aa4`), then a short QE re-check, then merge with the NFR-008 sentinel.
