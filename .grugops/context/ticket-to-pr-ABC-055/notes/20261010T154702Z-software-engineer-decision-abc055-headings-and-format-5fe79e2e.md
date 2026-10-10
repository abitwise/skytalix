---
id: 20261010T154702Z-software-engineer-decision-abc055-headings-and-format-5fe79e2e
kind: decision
by: software-engineer
at: 2026-10-10T15:47:02Z
verified_by:
confidence: high
refs:
  - ABC-055
  - plans/board.md
  - .grugops/factory.config.json
supersedes:
---

# `ABC-055`: where the two headings, the skip statement and the invariant went

This note is hand-authored and unsealed (AGENTS.md: no sanctioned writer on this install).
Branch `grugops/ABC-055-board-headings` from `764454b5`; board commit `ec5d975f`.

1. **Headings.** `## In Analysis (WIP 0/2)` and `## In Design (WIP 0/2)` sit between `## Ready`
   and `## Ready for Dev`, in the table's order. Each is followed by two blank lines, like
   `## Ready for Dev`. The limits come from `jq '.wip_limits'` on `.grugops/factory.config.json`
   (`"In Analysis": 2`, `"In Design": 2`), and the table agrees (2, 2).
2. **Config path.** In the FORMAT comment's WIP-numbers paragraph,
   `agent-factory/config/factory.config.json#wip_limits` becomes "this repo's dial
   `.grugops/factory.config.json#wip_limits`". The columns-table preamble,
   "(default from `factory.config.json#wip_limits`)", names no directory, so it is not wrong and
   is left alone. Keeping it was the smaller diff.
3. **Skip statement.** It is in the same FORMAT paragraph, and only there. Four columns may be
   skipped:
   - `In Analysis`, when a ticket's behavior needs no mapping. The kit's Workflow 03 already says
     "a ticket whose behavior needs analysis sits in `In Analysis`".
   - `In Design`, when it needs no structure/ADR decision.
   - `In Security/NFR` and `Ready to Release` in lean mode, unless a trigger fires (the existing
     sentence, kept).

   A skipped column keeps its heading and stays empty. `Ready for Dev` is not listed, because
   AGENTS.md rule 1 puts the criteria review at its exit.
4. **Invariant.** One `INVARIANT:` line follows the HEADING FORMAT paragraph: the H2 headings and
   the `## Columns` table rows are the same 13 names in the same order, and both change together.
   It promises no validator (test note 2).
5. **Header.** One `_Updated:` line is prepended at line 2, which is where and how the
   Orchestrator's last header is written. Nothing is replaced, so `A5`'s archive branch does not
   arise and no `history/` file is written.
6. **Board move withheld.** The SE normally moves its ticket `In Development → In Review`. `A4`
   and the brief forbid any row move in this diff, so `ABC-055`'s row stays in `In Development`.
   The Orchestrator makes that move at close-out. The row's own text ("renders 10") is stale and is
   also left alone.
