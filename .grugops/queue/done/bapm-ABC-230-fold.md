---
subtask: bapm-ABC-230-fold
role: ba-pm
ticket: ABC-230
ref: .grugops/context/bapm-ABC-230-fold/
branch: new grugops/bapm-ABC-230-fold from main, own worktree
---

# BA/PM: fold ADR-0054 (PROPOSED) into ABC-230's ticket page, records only

The Architect's reading (`arch-ABC-230-reading`, ADR-0054 PROPOSED) left a BA/PM fold owed. The board row lists it:
scope 3/5, the A1 wording, the A5 cut, and rows H2/H4. Fold it so ABC-230 is build-ready the moment the owner accepts ADR-0054.

## Do
- Read ABC-230's page, ADR-0054, the arch-ABC-230-reading notes, ABC-226's records scan and EPIC-010 § The merge rule.
- Rewrite ABC-230's scope and acceptance to match ADR-0054: priorKeys; pre-root needs two earlier occurrences, the path
  needs one; no TT or door change; a bare FEN supplies no history.
- A5: value-changing, so the 10 D + 10 R smoke applies, S-1..S-4.
- Keep the ADR's status PROPOSED and say ABC-230 waits on the owner's accept. Leave Q3 (ep key) as the owner's open
  question, with the recommendation (a) keep. Re-score DoR.

## Fences
- Records only: `plans/tickets/ABC-230-*.md` and your context. No src/, tools/, data/ or ADR edits. No board edits.
- Never push, force, amend or rebase. Never merge into main. No host paths. Never bare `npx`.

## Publish
- Seal notes (task `bapm-ABC-230-fold`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus a 10-cell
  trace row into this brief, then move it and its claim.md to done/.

## Result

*BA/PM, 2026-10-30, task `bapm-ABC-230-fold`; records only, at `main` `0c37165a`. Branch `grugops/bapm-ABC-230-fold` @ `c67100cb`.*

- **Ticket:** `plans/tickets/ABC-230-the-games-earlier-positions-reach-the-search-from-the-cli-and-from-uci.md`, with a FOLDED block added.
  - **Scope 1–2:** `priorKeys` per `ADR-0054` d1–d2. The list is read-only, oldest first, root excluded, at most `min(root clock, 100)`, and an optional `EngineOptions` field. One trimming helper serves both surfaces. CLI: `keyHistory` is injected, and the licence set is unchanged. The blunder children get the prior keys plus the root key. UCI: `parsePosition`; the list is empty after `ucinewgame`, a refused `position` and a bare FEN. The reference is corrected from `ADR-0044` D3 to D2/D6.
  - **Scope 3:** unchanged on the path. **A pre-root repetition needs two earlier occurrences.**
  - **Scope 5:** the `ADR-0026` door is replaced. No door applies. The change is value-changing, so the 10 D + 10 R smoke pair applies (`A7`, S-1..S-4).
  - **A1:** "base (no prior keys)", with the move at exactly 0. **A5:** "since the halfmove clock last reset"; a castling change is not a cut, and a key older than the clock is never matched. **A6:** the fence rows stay green unchanged. **A8 (new, H2):** a second occurrence keeps base's score and move. **A9 (new, H4):** with the root clock at 0, the search is node-equal to base.
- **DoR 9/10, Backlog.** Row 10 is now the owner's acceptance of `ADR-0054`. On acceptance the ticket is 10/10 and moves to Ready with no further BA/PM hop.
- **For the Orchestrator:** the Architect's note says the build may proceed against the PROPOSED text, with the smokes and the merge waiting. The page follows this brief, so the whole ticket waits. The choice is yours, and it is named in § Dependencies.
- **Reading of the brief:** "A5: value-changing, smoke" was taken as scope item 5 (the old door clause). `A7` already carries S-1..S-4, and `A5` carries the board's "A5 cut".
- **Owner questions:** accept `ADR-0054` (the one blocker). Q3 is unchanged: open, with (a) keep recommended.
- **Notes** (sealed, task `bapm-ABC-230-fold`): `20261030T032640Z-ba-pm-decision-644cf2af` and `20261030T032640Z-ba-pm-observation-0991fa77`. `propose_note` was not available, so both were written with the plugin's `admitAndAppend`.
- **No** src/, tools/, data/, ADR or board edits. Nothing was pushed or merged.

### Trace row (10 cells, header order)

| ABC-230 (fold) | ADR-0054 PROPOSED folded into the ticket: priorKeys (≤ min(clock, 100), root excluded), CLI injected keyHistory / UCI parsePosition; path one match, pre-root two; no ADR-0026 door; value-changing → smoke pair | EPIC-010 | — | NFR-009 (≤ 100 keys, no copy), NFR-005 (G6 unaffected), NFR-008 (fixed-depth / virtual-clock rows), RISK-EPIC010-06 (bounded by A5); ADR-0054 (PROPOSED, owner accepts); notes …644cf2af, …0991fa77 | grugops/bapm-ABC-230-fold @ c67100cb (records only): ticket page + .grugops/context/bapm-ABC-230-fold/notes/ (2) | none run (records only); acceptance A1–A9 written, A8 = probe H2, A9 = probe H4, A7 = S-1..S-4 | — (UAT owed at build; QE verdict signs) | — | Backlog, DoR 9/10; waits on owner acceptance of ADR-0054; Q3 open (default (a)) |
