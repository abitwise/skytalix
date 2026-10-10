---
id: 20261010T153936Z-agents-md-scribe-decision-headroom-ranks-1-2-applied-rank-3-held-18dd443c
kind: decision
by: agents-md-scribe
at: 2026-10-10T15:39:36Z
verified_by:
confidence: high
refs:
  - ABC-109
  - ABC-087
  - ABC-131
  - AGENTS.md
  - memory-bank/90-agents-md-command-log.md
  - 20261010T140110Z-agents-md-scribe-decision-agents-md-headroom-proposal-a023cfcd
supersedes:
---

# `AGENTS.md` headroom: ranks 1 and 2 applied, rank 3 HELD, ranks 4-5 in reserve

Hand-authored, unsealed (`context-io.ts` absent; no `finding` admissible). Branch
`grugops/scribe-headroom-2026-10-10` from the wave tip `5d55cc48`. Not merged, not pushed.

## Size

`AGENTS.md` **24,162 B -> 23,633 B** (-529 B). Cap 24,576 B (`ABC-109`): headroom **414 -> 943 B**.

## Applied

- **Rank 1** (-228 B): deleted the "Drafted by BA/PM at `home-the-gaps-2026-08-13`…" paragraph. The
  proposal offered to keep its one behavioural fact as a clause; I did: the no-`finding` blockquote now
  ends "Restoring the writer is an install-level fix (`node install/install.js --check`) escalated to
  the owner, not a ticket. **Do not re-derive this; do not invent a stamp.**" The paragraph was already
  70 B tighter than the proposal measured (`ABC-087`'s pass), so the saving is below the proposed 350 B.
- **Rank 2** (-308 B): deleted the "> **Kit vs state invariant:**" blockquote; the four bullets above
  it carry every clause.
- **Receipts, +7 B net** (re-measured by me, wave tip `5d55cc48`): `Test (all)` 52 files / **1608**
  tests / 7.8 s (was 1603); `ENGINE_DEEP` engine lane **46 passed (33 default)**, RUN date 2026-10-10
  (was 45 / 32); `Levels deep lane` time 202 s -> **202-225 s**, A3 "35" -> **"35-36"**.
- Command log: `Test (all)` and `Engine deep lane` re-measure paragraphs, a NEW `Levels deep lane`
  section (the log had none), and a closing § "Headroom pass, 2026-10-10".

## Held

- **Rank 3** (-460 B, Safety-rules deploy bullet): HELD. It rewrites the owner's 2026-08-15 wording and
  the owner has not answered. Ranks 4-5 (177 B + 97 B) stay in reserve for the next lane line.
  Reachable if the owner OKs rank 3: headroom 943 + ~460 = ~1,400 B.

## Owed, NOT applied: `ABC-131` (unmerged, awaiting the owner's UAT word)

On `grugops/ABC-131-drop-edge-puzzles`, per `QE-131-c`: `PUZZLE_DEEP` **54/58** and **18 passed**
(baseline and `PUZZLE_DEEP` line in `AGENTS.md` read 58/62, 17); levels `A4` perft+puzzles **242 moves**
(not 246) and `A3` **35 vs 54 of 58** (not 58 of 62); `Test (all)` will move again. When it merges, the
Scribe refreshes `AGENTS.md` and the log's Levels and Puzzle-suite entries together (the log records
this).

## Not done

- Nothing in `src/`; `npm run typecheck` not run (no `.ts` change).
- The two deep lanes were run on a loaded machine (load1 ~10-12; engine 310.93 s, levels 224.95 s) and
  other agents were running; times are ranges, not gates.
