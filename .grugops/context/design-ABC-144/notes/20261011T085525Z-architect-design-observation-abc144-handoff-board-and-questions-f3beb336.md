---
id: 20261011T085525Z-architect-design-observation-abc144-handoff-board-and-questions-f3beb336
kind: observation
by: architect-design
at: 2026-10-11T08:55:25Z
verified_by:
confidence: high
refs:
  - ABC-144
  - ABC-143
  - ABC-083
  - ADR-0040
  - NFR-008
  - 20261011T085525Z-architect-design-decision-abc144-tradeoff-table-and-what-choking-means-c33f4ab8
  - 20261011T085525Z-architect-design-decision-abc144-recommend-maxworkers-4-and-the-value-pin-df7355cf
  - 20261011T085525Z-architect-design-decision-abc144-quiet-window-measurement-plan-ff54a750
supersedes:
---

# `ABC-144` design hop: what goes next, and the questions

## Board (the Orchestrator moves it; this hop did not edit `plans/board.md`)

- **Recommended order:**
  1. Schedule **Window A** (width 1, ≈ 15 min). `ABC-144` stays `In Design` until the frontier is read
     and `ADR-0040` d2 records k.
  2. Then `In Design → Ready for Dev`.
- **The alternative,** if the Orchestrator wants the build to start sooner: move it to `Ready for Dev` now,
  with k = 4 provisional. The Engineer's diff is one line plus the pin, and a different k changes two
  literals.
  - The frontier must still be read before `In Security/NFR`, so that `A1`'s "if no setting reaches 15 %"
    fork can be answered.
  - The Architect recommends the first order, because the ticket puts the frontier first.

## Owed by other roles

- **Engineer:** the config change, the pin, and reds r1–r3 (`…df7355cf`). `npm run typecheck` on the
  plain-object form.
- **QE:** `A2` from `resolved-workers.mjs`, `A6` and `A7`.
- **Security/NFR:** Window B, `W_new` if needed, and the `NFR-008` row wording after the owner's word
  (`A5`).
- **BA/PM (page wording, no DoR change):** `A6`'s "test count equals base" reads **base + 1** for the `A7`
  pin (`ADR-0040` d3). A one-line page note keeps QE from failing the pin's own test.

## Questions for the owner (through the Orchestrator)

1. **Accept `ADR-0040`?** It sets 4 workers and pins it, and Window A may move the number down by the
   pre-registered rule.
2. **BA/PM's open question 1, now with a table** (`…c33f4ab8`). Which of these is "choking" to you?
   - CPU and battery: 4 workers.
   - Lag when you switch apps: 3 workers, optionally plus a lower test priority.
   - Heat: fewer agent hops in parallel, or `VITEST_MAX_THREADS=2` for agent hops when more than one runs.
     Each hop then takes longer.

   None of them blocks the 4-worker build.
3. **CPU level:** BA/PM's question 2 stands. The Architect agrees: no new level. The `A7` pin holds the cap.

## Merge-order notes

- **`ABC-143`** edits `src/cli.test.ts`'s `A10` literal. The `A7` pin goes in its own `describe` away from
  that hunk, and whichever merges second rebases.
- **`ABC-083`** re-reads on its rebased base, under `ADR-0040` d5.
