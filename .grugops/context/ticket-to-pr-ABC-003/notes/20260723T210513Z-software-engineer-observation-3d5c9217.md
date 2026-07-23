---
id: 20260723T210513Z-software-engineer-observation-3d5c9217
kind: observation
by: software-engineer
at: 2026-07-23T21:05:13Z
verified_by: 
confidence: high
refs:
  - ABC-003
  - src/apply.ts
  - src/apply.test.ts
  - NFR-001
supersedes: 
---

Artifacts and gate result for ABC-003.

**Files changed (2 added, 0 production files modified):**
- `src/apply.ts` — new. `makeMove`, `unmakeMove`, `UndoRecord`.
- `src/apply.test.ts` — new. 10 tests: 5 acceptance (one per Given/When/Then criterion) + 5 unit (undo-record contents, three castling-rights cases, halfmove reset on capture).

No existing file was touched. `position.ts`, `moves.ts`, `fen.ts` are unchanged — `apply.ts` imports from them read-only.

**Headline property test passes.** Over all six standard perft positions × every pseudo-legal move ABC-002 generates, `toFen(unmakeMove(makeMove(p, m))) === toFen(p)` holds with zero exceptions — the single strongest signal that state restoration is exact.

**Gate result: READY_FOR_HUMAN_REVIEW** (mandatory gates all green). Commands run, exactly as they exited:
- `npm run lint` → exit 0. "No fixes applied." 2 pre-existing infos (a `biome.json` `recommended`-field deprecation, untouched by this ticket — flagged not fixed, coding rule 12).
- `npm run typecheck` (`tsc --noEmit`) → exit 0 (after the START_FEN self-fix).
- `npm test` (`vitest run`) → exit 0. 59 passed across 3 files (fen 27, moves 22, apply 10), 0 skipped.
- `npm run build` (`tsc --noEmit`) → exit 0.
- Coverage: `src/apply.ts` 100% stmt / 100% func / 100% line / **91.66% branch**, against the 0.8 floor. `moves.ts`/`position.ts` remain 100% on every axis; `fen.ts` unchanged.

**Honest gap handed to QE.** The one uncovered branch is `unmakeMove` line 100 — the fullmove decrement taken only when undoing a *Black* move. The property test round-trips White-to-move perft positions, and the black case of acceptance criterion 5 calls `makeMove` without `unmakeMove`, so undoing a Black move is unexercised. A round-trip of any Black move closes it — named here rather than left for a reader to find behind a green suite.

**No E2E / no UI.** `quality.ui_e2e` is `ui-or-critical-path`; no runnable game until EPIC-006. NOT APPLICABLE, not a pass.
