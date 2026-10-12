---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-12T12:40:17Z
sealed: false
refs: [ABC-146, ABC-052, ABC-056]
---

# Owner word, 2026-10-12 — answers after the Backlog re-score

The owner asked "analyze backend and ready some tickets" (read by the Orchestrator as the Backlog; this CLI has no backend). After both BA/PM halves merged, three questions were put; option answers below are the exact labels selected.
1. **ABC-146** (verdict run route; ABC-152 turned vitest's module runner off, which ADR-0041 names as the cause of the ~4.35× cost) → **"Re-measure, then vitest (Recommended)"**: one paired re-measurement of the factor first; if the in-vitest run (`LADDER_DEEP=verdict npx vitest run src/ladder.test.ts`) fits the accepted 7–13 h band, the verdict runs there with no new code; otherwise fall back to plain node as accepted. BA/PM to amend the page; the re-measurement is a timing reading (width 1).
2. **ABC-052** (no trace record of 94 of 134 Done moves) → **"A: board is the record (Recommended)"**: the board's Done column is the only record of column state; one dated legend paragraph in `plans/traceability.md` says so; ABC-052 DROPPED.
3. **ABC-056** (lockfile-only fix available for nanoid/postcss/source-map-js, all dev-only) → **"Re-state the accepted risk"**: ABC-056 as written — re-state AR-1 over today's three advisories with a trigger that fires on new advisories against an unchanged lockfile. No fix ticket.
