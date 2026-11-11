---
id: 20261111T073837Z-orchestrator-decision-f1dce7dd
kind: decision
by: orchestrator
at: 2026-11-11T07:38:37Z
verified_by: 
confidence: high
refs:
  - ABC-318
  - ADR-0045
  - NFR-004
  - src/levels.ts
  - README.md
  - CHANGELOG.md
  - memory-bank/60-progress.md
  - 20261111T045008Z-qe-e2e-decision-6298d7f0
supersedes: 
seal: sha256:33db76c6cf5ac7f8818ec1365faa2f9c443a2471a7ece489c0cb6ed2c0b23557
---

Owner, 2026-11-11: "go with 10 s for level 6". This answers OQ-212-1's revisit (ADR-0045 A1, "kept at 5 s on the owner's own number … to be revisited with harness data"). It is a requirement change on the owner's word, MINOR per VERSIONING.md. Cut as ABC-318.

Why: L5 is 4 s and L6 5 s, 0.32 doublings apart, projected at +16–24 Elo. That is inside one reading's ± 48, so the two levels cannot be told apart. At 10 s, L6 is projected at ~2310–2410, about +65–100 over L5, and 4 → 10 → 30 s is roughly even in doublings.

Acceptance:
- **C1, ADR-0045 amendment (Architect).** A dated amendment: L6 `budgetMs` goes from 5 000 to 10 000 on the owner's word, citing this note and the ABC-316/317 readings. Rate 0 is unchanged. The ordering row still holds. The "Level 6 plays almost like level 5" paragraph gets a dated resolution line. Amend ADR-0044 and ADR-0052 only where they restate the L6 ceiling (budget + 2 s, so 7 s becomes 12 s), as dated lines, never rewrites.
- **C2, NFR-004 (Security/NFR, records only).** A dated amendment to the per-level ceiling: L6 goes from 7 s to 12 s, on the owner's word. Other levels are unchanged, and HARD_CEILING_MS 60 000 still holds.
- **C3, code (SE).** `src/levels.ts` L6 `budgetMs` is 10 000. Every test and snapshot that pins L6's 5 000 or its 7 000 ceiling is updated to match, and no test is weakened. Every other level is unchanged.
  - The `rating.ts` `rpair` comment that says L6 is 5 000 ms: update the text only if it states a current fact. `rpair` uses `go movetime 4000` capped at the level's budget, so L6 still searches 4 000 ms there. State that; its argv is unchanged.
  - AGENTS.md and README lines that state L6's time: README's Levels table shows 10 s.
  - No other behaviour changes.
- **C4, README and CHANGELOG (SE, same hop).**
  - Levels table: L6 time 10 s; L6 projected ~2310–2410 (2144–2164 + 50–75 × log2 10).
  - The three gaps from QE …6298d7f0:
    - L7's low edge reads ~2380;
    - state the 10–14 Elo per point blunder cost behind 2144–2164;
    - the per-doubling comparison reads +73 to +79 from the Strength section's 1902.5 at 0.1 s to L4 at 1 s.
  - CHANGELOG Unreleased gets "Changed: level 6 thinks 10 s a move (was 5 s)" and the README line.
  - The UCI section, if it states L6's time, matches.
- **C5, gates.** Lint, typecheck, unit (one worker) and build, each alone under the host lock, plus the deep lanes that touch levels if AGENTS.md lists one. QE's verdict signs UAT: this is a production line, so there is no waiver, and QE's PASS signs per the 2026-10-22 ruling. No game reading is needed (L6 stays projected).

Release v1.1.0 is not part of this ticket; it waits on the owner's word.
