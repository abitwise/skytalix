---
id: 20261010T184200Z-agents-md-scribe-decision-rank3-applied-receipts-refreshed-after-abc131-c7a41e5d
kind: decision
by: agents-md-scribe
at: 2026-10-10T18:42:00Z
verified_by:
confidence: high
refs:
  - ABC-131
  - ABC-109
  - QE-131-c
  - AGENTS.md
  - memory-bank/90-agents-md-command-log.md
  - 20261010T173005Z-orchestrator-decision-owner-word-eight-answers-6a1f3d92
  - 20261010T153936Z-agents-md-scribe-decision-headroom-ranks-1-2-applied-rank-3-held-18dd443c
supersedes:
---

# `AGENTS.md` rank 3 applied; receipts refreshed after `ABC-131`'s merge

Hand-authored, unsealed (`context-io.ts` absent; no `finding` admissible). Branch
`grugops/scribe-receipts-2026-10-10` from wave tip `a9bfd27c`. Not merged, not pushed.

## Size

`AGENTS.md` **23,633 B -> 23,216 B** (-417 B). Cap 24,576 B (`ABC-109`): headroom **943 -> 1,360 B**.

## Applied

- **Rank 3** (-414 B), the owner's "7. ok" (Orchestrator note `…6a1f3d92`, answer 7): the Safety-rules
  "Deploy is allowed…" bullet (622 B) became a 208 B pointer to `## Deployment posture`. Kept: the
  two-clause headline, the owner and date (2026-08-15, one sentence), `production_requires_human_confirmation`
  stays `true`, "the grant did not flip it". Dropped: the "neither 'deploy freely' nor 'the old prohibition
  stands'" sentence (the one clause with no twin in `## Deployment posture`), the no-artifact restatement,
  the `EPIC-006` pointer and "moving it is the owner's word". The last three stay in `## Deployment posture`.
  Nothing new is quoted.
- **`Test (all)`**: 1608 -> **1663** tests, 52 files, 7.8 s -> 6.5 s (run by me, exit 0).
- **`PUZZLE_DEEP`**: 17 -> **18 passed** (12 default); baseline 58/62 -> **54/58** (run by me: 18 passed,
  34.37 s).
- **`Levels deep lane`**: perft + puzzles 246 -> **242** moves; `A3` "35-36 vs 58 of 62" -> **"35 vs 54 of
  58"**. Cited from QE's run on `96f3168d` (28 passed, 213.26 s, `A4` 242 moves, `A3` 35/58 vs 54/58), not
  re-run: ~3.5 min and `src/levels*.ts`, `engine.ts`, `virtual-clock.ts` are untouched by `ABC-131`.
  "202-225 s" stands (213 s is inside). This closes `QE-131-c`.
- Command log: re-measure paragraphs in § Test (all), § Levels deep lane (the OWED paragraph became APPLIED)
  and § Puzzle-suite, plus a closing § "Receipts pass, 2026-10-10".

## Left out, and why

- `NFR-008` R-1, `NFR-005` depth 7, `RISK-003` 0.8x: `AGENTS.md` mentions none (0 hits). No section added.
- Reference runtime Node v26.11.0: § Stack says "Node (>= 22)", a minimum, still true. Left as is.
- ADRs 0035-0038: `AGENTS.md` has no ADR index (only the `ADR-0007` pointer). No pointer added.
