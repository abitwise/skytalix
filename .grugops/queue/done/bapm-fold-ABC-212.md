---
subtask: bapm-fold-ABC-212
role: ba-pm
ticket: plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
ref: .grugops/context/bapm-fold-ABC-212/
branch: new grugops/bapm-fold-ABC-212 from grugops/qe-ABC-212 (052ae3ad), worktree ../wt-bapm-fold-ABC-212
width: 1 of 3 (beside security-nfr-ABC-212, scribe-runbook-ABC-212; records only)
---

# BA/PM fold lines at the ABC-212 merge

## Do
- Write the `ADR-0044` fold lines (D4.1, D4.4, D11, D5) and the `ABC-204` erratum, as owed by Architect `arch-design-ABC-212/…d2c68ace` ("BA/PM at the merge") and restated by QE `qe-ABC-212/…e58d4635`. Dated lines; no requirement, scope or bound changes (anything like that → STOP, name it).
- Do not touch `plans/nfr-catalog.md` (Security/NFR's hop) or `memory-bank/70-runbook.md` (Scribe's hop).

## Fences
- Only your worktree and `<scratchpad>/bapm212/`. No `src/` edits. Read-only context reads, not render(). Never push, force, amend or rebase; never merge into main; no board edits. Records: no hostnames, IPs, or personal paths.

## Publish
- Commit on your branch. Seal notes (task bapm-fold-ABC-212). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result (ba-pm, 2026-10-24T12:40Z UTC): **`ADR-0044` fold lines D4.1, D4.4, D5 and D11 written, and the `ABC-204` erratum written. No requirement, scope or bound moves. No STOP.**

Records only, on `grugops/bapm-fold-ABC-212` in `../wt-bapm-fold-ABC-212`, cut from `grugops/qe-ABC-212` `052ae3ad`. The tip is **`d52f8625`**: one commit, not merged and not pushed. Nothing was run or timed. The only scratch used is `<scratchpad>/bapm212/`.

Notes are in `.grugops/context/bapm-fold-ABC-212/notes/`. They were sealed with grugops 2.1.0 `context-io.js` `admitAndAppend`, with the worktree's `.grugops/context` as the context root, and read back through `readContext` (2/2):
- `20261024T123712Z-ba-pm-observation-961e38eb`: the sources and the code read at `052ae3ad`, the lines that restate the folded facts, the overlap check, and the line drift;
- `20261024T123712Z-ba-pm-decision-7df0e4af`: what was folded, and the bounds.

**`ADR-0044`** (+36/−0 content, plus 3 reflowed lines). It follows its own 2026-10-19 fold style: a Status block plus inline italic dated lines, with the old text kept.
- **Status block:** "Amended 2026-10-24 by `ADR-0045` § AMENDMENT 2026-10-24". It is effective at `ABC-212`'s merge. The history sections stand as written, and no other decision moves.
- **D4.1:** a bare `go` searches the level's budget at levels 1–7, because `G` = `HARD_CEILING_MS` (32 000) is capped by D4.2. The code is unchanged.
- **D4.4:** one clamp at 32 000. Each level's `NFR-004` ceiling is held by its budget, at least 2 000 ms under it.
- **D5:** `isready` and `stop` are answered up to one budget late: about 5 s at levels 1–5, 7 s at level 6 and 32 s at level 7. This is accepted, with no worker. The first worker trigger is marked as fired and ruled (OQ-212-3).
- **D11:** `max 7`, read from `HARDEST_LEVEL`. Rate 0 is levels 5–7, and rate above 0 is levels 1–4.
- **Four restating lines, with the same dated mark:**
  - D3's `uci` row: `max 7`;
  - D3's `setoption` row: 1 to 7;
  - § Consequences, "Analysis is capped at 5 s": the level's budget binds, up to 30 s;
  - § Consequences, "levels 3–5 deterministic": the rate-0 levels are 5–7. The 2026-10-19 fold had missed this line.
  The 2026-10-19 precedent folded lines of this kind alongside the named decisions.

**`ABC-204` page** (+9/−0 content, plus 2 reflowed lines):
- a header erratum: Q1's "`HARD_CEILING_MS` (5 000)" reads "level 5's ceiling (5 000)";
- an inline erratum at Q1. It cites `NFR-004` clause B instead of `src/engine.ts:129`;
- the general rule reads as ceiling(level) − budget, which is 5 000 − budget at `Skill Level` 5;
- no number, margin or rule changes.

**Overlap:** none. Neither file is touched by `main` since `052ae3ad`, by `grugops/security-nfr-ABC-212`, by `grugops/scribe-runbook-ABC-212`, or (for the `ABC-204` page) by `grugops/ABC-204`.

**Not touched:**
- `src/` and the tests;
- `plans/nfr-catalog.md` and `memory-bank/70-runbook.md` (the sibling hops);
- `ADR-0045` and the `ABC-212` page;
- the board, the trace, other worktrees, the remote and the git config.

**For the Orchestrator:** merge this branch with the `ABC-212` line. `ADR-0045`'s Rollback reverts these fold lines together with the data revert. The history-section mentions of "5 s" and "1–5" are left as history, as the Status block says.

### Trace row (10 cells, header order)

| ABC-212 (bapm-fold-ABC-212) | levels 6 (5 s) and 7 (30 s), rate 0; default stays 5 — merge folds: ADR-0044 D4.1 (bare go = level's budget), D4.4 (clamp 32 000, ceiling per level held by budget), D5 (≤ ~32 s late at 7, accepted, no worker), D11 (max 7, rate 0 = 5–7) + 4 restating lines; ABC-204 erratum "level 5's ceiling (5 000)" | EPIC-004 | — | NFR-004 per-level text owner-accepted (…2c6fa3b1), placed by Security/NFR; no bound moves here; notes …961e38eb, …7df0e4af | grugops/bapm-fold-ABC-212 @ d52f8625 (records only)<br>memory-bank/50-decisions/ADR-0044-the-engine-speaks-uci-through-a-second-entry-point-over-the-unchanged-core.md<br>plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md | — (records only; no test ran) | signed by QE verdict …e58d4635 (PASS_WITH_GAPS) | — | In Security/NFR (records folds ready to merge with the ABC-212 line) |
