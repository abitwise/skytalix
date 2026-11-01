---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T15:10:49Z
subtask: bapm-100-400-rule
role: ba-pm
ref: .grugops/context/bapm-100-400-rule/
branch: new grugops/bapm-100-400-rule from main (worktree .claude/worktrees/bapm-100-400-rule)
width: records only. Two SE hops run tests under the host lock; an Architect hop (arch-adr0056-100ms-fold) edits ADR-0056 beside you.
---
# BA/PM: write the owner's validation rule into EPIC-010/011, re-scope ABC-255, fix two stale lines
## Inputs
- Owner word (verbatim inside): .grugops/context/orch-2026-10-30a/notes/20261101T125800Z-orchestrator-decision-2896c6eb.md — no SPRT; 100 games at 100 ms per strength change (new vs base), 400 games at 100 ms per epic; any other validation run estimated > 1 h is asked of the owner first; tests on one core.
- qe-tc-depth-probe readout (merged 1d4e1649): .grugops/context/qe-tc-depth-probe/ — 259 games/h at 100 ms self-play (100 games ≈ 0.4 h, 400 ≈ 1.5 h); 100 games ≈ ±48 Elo, 400 ≈ ±24.
## Do
1. EPIC-010 and EPIC-011: add the merge/close rule (per strength change: 100 games at 100 ms new vs base; per epic: 400 games at 100 ms) and the >1 h ask rule. Strength-changing tickets in both epics: align acceptance to it where they named SPRT or other game counts (list each change).
2. ABC-255: re-scope from the SPRT lane to a fixed-count 100/400 mode on the rating harness. If the Architect's ADR-0056 ruling is not yet on main, word it as aligned to the owner rule and "pending ADR-0056 fold".
3. Fix EPIC-011 § Close-out's stale ABC-223 line (ABC-223 is Done, merged b45162fc; EPIC-009 closed) and EPIC-006's front matter status: backlog → closed (EPIC-006 is CLOSED).
## Fences
plans/epics/EPIC-010*, EPIC-011*, EPIC-006* (front matter only), plans/tickets/ for tickets you align, plans/traceability.md (append), your notes. Not plans/board.md, not memory-bank/, src/, tools/, data/. Run nothing. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task bapm-100-400-rule, contextRoot = worktree), commit, ## Result + trace row here, brief + claim to done/.

## Result

**2026-11-01, BA/PM. The owner's rule is in EPIC-010 and EPIC-011, ABC-255 is re-scoped (pending the ADR-0056 fold),
ten reading rows are aligned, and both stale lines are fixed. Branch `grugops/bapm-100-400-rule` (worktree
`.claude/worktrees/bapm-100-400-rule`, from `main` `452415bd`, one board-only commit past the brief's `376473fe`):
claim `24c7d10f`, pages `58bb2471`, notes `905a4f21`. Records only: nothing run. No board, `memory-bank/`, `src/`, `tools/`,
`data/` edit. Not merged, nothing pushed.**

- **The rule (both epics):** per strength-changing ticket, 100 games at 100 ms before the merge (candidate vs merge-base,
  self-play, openings 1–50 both colours, width 1; 0 faults, 0 time losses; pass line = the `ADR-0056` fold's, `UNKNOWN -
  verify` until merged). Per epic, 400 games at 100 ms before the close (the Orchestrator's `rpair`-shape reading; the
  fold's Stockfish time, E and pass line; owner-set, no ask). Any other run over 1 h asked first. Value-identical: S2,
  no games.
- **EPIC-010:** top block; § The merge rule marked superseded for merges to come; Q4 superseded line. No per-change
  read is owed (every remaining ticket is value-identical or test-only). **Its close now owes the 400-game read** (base
  `ca6e675c`, head `main` after 1b, ≈ 1.3–2 h); M2 stays graded on milestone 1's batch.
- **EPIC-011:** top block; Q-3K-2 answered (no SPRT), Q-3K-3 answered (one core); § The per-change rule rewritten (old
  bullets struck); G7 (epic read) added; routine row, cheapest slice 1, phase row M0, ticket rows 1–2, risks 02 and 05
  (100 ms reaches depth 6: depth ≥ 7 changes mostly do not fire) dated. New conflicts: **C12** the Orchestrator may pull
  `ABC-255` before EPIC-010 closes (tools only; it is the close read's instrument; else QE uses a scratch command as the
  probe did); **C13** `ABC-256` closes as merged into EPIC-010's close read if the fold names 100 ms the milestone
  control.
- **ABC-255:** SPRT lane → `d` at 100 ms (100 games) and `rpair` at 100 ms with a Stockfish move time (400 games), an E
  band guard (≤ 2 600 below 500 ms until the fold), A1–A7; M → S; DoR 9/10 (row 5: the fold). File name kept.
- **Aligned reading rows:** `ABC-231` A6, `232` A5, `233` A6, `234` A5, `236` A5, `237` A6, `238` A6 (smoke pair → 100-game
  read); `ABC-239` A6 + scope 3 (smoke pair + 200 + 200 R pair at 4 s → 100-game read + an owner-asked 400-game outside
  pair); `ABC-257` A6 (smoke/SPRT → 100-game read); `ABC-258` A4 (SPRT/design control → 100-game read, guard-only note;
  DoR 8 → 9). `ABC-256`: dedupe line. EPIC-010's `ABC-249`–`254` named no games: untouched.
- **Stale fixes:** EPIC-011 § Close-out EPIC-009 bullet (ABC-223 Done `b45162fc`; EPIC-009 CLOSED `ead25f7b`).
  EPIC-006 front matter `status: done`, `column: Done`, `closed:` line. The brief said "closed"; every closed epic here
  uses `done` plus `closed:`, so that was followed.
- **Interpretations the Orchestrator may reverse:** (a) the per-epic 400 applies to EPIC-010's close; (b) the 100-game
  read replaces both smokes (D and R).
- **Notes:** `…ad006634` (rule fold), `…be4194cd` (ABC-255 re-scope), `…f516b847` (ticket alignment), `…ad258d74` (stale
  fixes + artifacts; an observation, since an artifact-ref needs gate provenance).
- **Re-check owed when `arch-adr0056-100ms-fold` merges:** the pass lines, Stockfish's time and band, the per-epic
  opponent; `ABC-255` row 5 → Ready; whether C13 fires.

### Trace row (10 cells, header order)

| bapm-100-400-rule | Owner's validation rule folded (100 games at 100 ms per strength change, 400 at 100 ms per epic, no SPRT, other runs > 1 h asked first); ABC-255 re-scoped to the 100 ms shapes; EPIC-010 close owes the 400-game read | EPIC-010, EPIC-011 (EPIC-006 front matter) | ABC-231, 232, 233, 234, 236, 237, 238, 239, 255, 256, 257, 258 | none moved (NFR-005 floor unchanged) | `grugops/bapm-100-400-rule` @ `58bb2471` (pages), `905a4f21` (notes …ad006634, …be4194cd, …f516b847, …ad258d74) | records only; nothing run | — (records; pass lines pending the ADR-0056 fold) | — | DONE; merge is the Orchestrator's |
