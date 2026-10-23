---
id: 20261023T081245Z-software-engineer-observation-78292c2d
kind: observation
by: software-engineer
at: 2026-10-23T08:12:45Z
verified_by: 
confidence: high (every gate was run as spelled; no timing)
refs:
  - ABC-197
  - QE-177-b
  - ABC-167
  - EPIC-007
  - ABC-177
  - ABC-178
  - src/uci-session.test.ts
  - 051d557a
  - 20e397c8
  - NFR-008
  - N8-LANE
  - 20261023T080227Z-architect-design-decision-578a9290
  - 20261023T072556Z-security-nfr-decision-d0c770b5
  - 20261023T081245Z-software-engineer-observation-eeec2b5f
  - 20261023T081245Z-software-engineer-observation-ba08acdc
supersedes: 
seal: sha256:dc602f400340524433cb67c81377fde98501b80f2b2e13ebf2e54b4874aa7890
---

# `ABC-197` gates at tip `20e397c8` (worktree `../wt-ABC-197`, own `npm ci --ignore-scripts`, vitest 4.1.12, Node v26.11.1). No timing claims

- `npm run lint` 0, `npm run typecheck` 0, `npm run build` 0. `git status` was clean after the build.
- `npm test`: exit 0. `.test-results/last-run.json`: `success` true, 61 files, 2 019 total, 2 019 passed, 0 failed, 0 pending, 0 todo. This matches the brief's expected 61 / 2 019.
- Skip-count capture, as spelled (`NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'`), printed `0`. Then `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` printed `No findings.`, exit 0.
- `UCI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci.real-engine.test.ts`: 1 file, 5/5 passed.
- Heap: 128 on every multi-file run (`npm test`, the capture) and 400 on every one-file run (`UCI_DEEP`, the plants, the census).
- UAT waiver form (`AGENTS.md`, unfiltered): `git -c core.quotePath=false diff --name-only <tip>~1 <tip> | grep -v '\.test\.ts$' | grep '^src/'` prints **nothing**. The same form over `main..tip` also prints nothing. Zero production lines.
- **Owed to a later quiet-host QE timing hop, and not taken here:**
  - **A6 (`N8-LANE`, ONE-FILE)** on B = `git archive 051d557a`, H = `git archive 20e397c8`. Pre-register **F = 0.070 s** (`…578a9290`) and pass `readout174a.py <dir> n8-lane 0.070 changed`, not `16pct`.
  - **A7 (`NFR-008`)** on H under `ABC-177` A9's protocol.
  - **A5**, with the caveat in this task's A5 observation.
- **Cost-line drift (noted, not edited):** the page's § NFR triggers still cites the 0.605 s headroom at `f81bf03c`. The current published headroom is **0.990 s** to W on `00f77f26` (`…d0c770b5` § 4). The 0.190 s to 9.2 s on H is the margin that the ≈ +0.075 s estimate spends first.
