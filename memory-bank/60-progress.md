# Progress
_Updated: 2026-08-02 by the Orchestrator (state save before a context clear). Previously: never — this file was the shipped empty template until now, while the project ran to 25 unmerged commits._

<!--
  The running plan-of-record. Read this FIRST on start, then `plans/board.md`. Keep it short and
  current; it is an orientation file, not a document dump. The detail lives in the files it points
  at — `plans/board.md` (WIP truth), `plans/traceability.md` (the trail), `.grugops/context/<task>/notes/`
  (verified context), `memory-bank/50-decisions/` (ADRs).
-->

## Standing directive — read before prioritising anything

**Project owner Olger Oeselg, 2026-07-31:** *"The most important thing is that chess moves are
legal according to game rules, everything else comes after that. Game has to be played according
to it's rules."*

This is standing, not a one-off. It re-sequenced the board on 2026-07-31 and it outranks the
latent/live test this project otherwise uses for priority. Rules-correctness beats features.

## What works

- **EPIC-001 — the chess rules core is complete and merged on `main`** (ABC-001..007 + the ABC-008
  spike). Nine flat modules in `src/`, no runtime dependencies. Perft **32/32 exact at depth**,
  which is exhaustive proof of move generation, the legality filter, castling, en passant,
  promotion and check detection. This is the best-proven code in the repo — do not re-audit it.
- **NFR-001 met** (~6.1M nodes/sec generation-with-free-leaves; read its denominator fence in
  `plans/nfr-catalog.md` before quoting it — it is **never** evidence for NFR-005).
- Four ADRs ratified: **0001** 0x88 board, **0002** game-history ownership, **0003** legality
  strategy, **0004** SAN ownership.

## What's left

**Nothing is deployed and nothing is released.** `mode=lean`, `autonomy=pr`; Done means merged.

- **`plans/board.md` is the WIP truth** — read it, do not infer state from here. As of 2026-08-02:
  ABC-020 in `Ready for UAT`; `Ready` holds ABC-009, ABC-011, ABC-012, ABC-013, ABC-014;
  ABC-015..019 + ABC-021 in `Backlog` behind their predecessors; `Blocked` empty.
- **EPIC-002** (terminal board + game loop) is decomposed into ABC-012..ABC-019 + ABC-021.
  **EPIC-003..006 are still undecomposed** — each needs `epic-to-tickets` (Workflow 03) before any
  ticket under it can be pulled.
- **UAT is deferred to EPIC-006 for everything so far**, not skipped. Nothing built yet renders or
  prompts, so there is no surface a human can exercise. The traceability UAT cells say so.

## Known issues

### Open defects in merged, `Done`, 100%-covered code

| | What | Size/Pri | Reachable |
|---|---|---|---|
| **ABC-009** | `legalMoves` mutates the position it documents as unchanged | S / P1 | latent — needs a semantically invalid position |
| **ABC-010** | FEN semantic validation missing | M / P1 | live when EPIC-003 accepts a FEN from a user |
| **ABC-011** | Zobrist hashes en passant when no capture is available → threefold **under**-detects | S / P1 | latent; error direction is safe (a draw is missed, never falsely declared) |

All three are **carried, not owned** by ABC-020. Perft does not cover any of them, because
`src/perft.ts` never calls `gameStatus` or `zobristKey`.

### Open questions nobody has ruled on

1. **FIDE 9.6.1 says "five *consecutive* alternate moves"; ABC-020's code uses a plain 5-count.**
   `UNKNOWN - verify` — QE declined to assert a conformance gap from a remembered sentence, which
   was correct. **Not decidable from a counts map at all** (a map carries no ordering). Needs a
   BA/PM ruling against the actual Laws text. **Inside the owner's standing directive, and it should
   be settled BEFORE ABC-020 merges** — if real it changes `src/gameend.ts` again.
2. **`GameResult` is dead** — referenced by nothing in `src/` after ABC-020. Kept deliberately
   (coding rule 12). The trap: it is a flat union matching neither arm of `GameStatus`, so
   `render(r: GameResult)` compiles and silently drops the claim. One-line close
   (`GameStatus["result"]`), Architect/Design's seam.
3. **ABC-020's A5/A8 `Given` wording** is factually wrong about the locked pawn wall (it unfreezes
   after its first capture; the clock resets three times). The criteria's **substance holds** under
   ten drives and is pinned by tests. Documentation only.

## The branch stack — the single easiest thing to lose

**25 commits are unmerged, in three stacked branches. A human holds every merge.** There is
**no git remote on this repo at all**, so no PR exists or can be opened — that absence is recorded,
not an oversight.

```
main                                    d53ce31   EPIC-001 closed
 └─ grugops/architecture-audit-2026-07-29        ADR-0002 + ADR-0003 ratified; ABC-009/010/011 cut
     └─ grugops/epic-to-tickets-EPIC-002         EPIC-002 decomposed; ADR-0004 ratified; ABC-020/021 cut
         └─ grugops/ticket-to-pr-ABC-020  c51e560  ABC-020 implemented + gated  <- current tip
```

Branch from the **tip**, not from `main` — `main` has none of the ADRs the current work rests on.

**Merge order is load-bearing: ABC-020 merges before ABC-019 and ABC-016**, whose acceptance
criteria were amended on 2026-07-31 to match it. Reverse it and today's FIDE deviation stops being
a bug and becomes an encoded assumption.

## Governance facts that must survive a context clear

- **ADR-0004 was ratified by the Orchestrator under an explicit, quoted delegation from Olger
  Oeselg on 2026-07-31 — the first ADR here not ratified by a human directly.** It is recorded in
  the ADR as **NOT precedent**; the delegation was specific to ADR-0004 by name. The standing rule
  is unchanged: **no agent may mark an ADR `accepted`.**
- **This install has no `scripts/context-io.ts` and no `mcp__grugops__propose_note`.** Workflow 16's
  sanctioned writer does not exist here, so every note is hand-written into
  `.grugops/context/<task>/notes/` in the schema's exact shape. Consequence: **`finding` is not
  admissible on any task** — there is no §14 gate to issue a stamp. Use `decision` / `observation` /
  `claim` / `artifact-ref`, and never self-stamp. Every role so far has recorded this degradation
  rather than glossing it.
- **`gameStatus`'s `positionCounts` stays optional.** ADR-0002's recorded reason (a breaking change
  to covered code) does not survive one grep — QE measured 9 test call sites and 0 production ones.
  The decision is still right for a **stronger** reason: ADR-0002 clause 3 makes a bare-calling
  search leaf a legitimate caller shape, not a mistake. That argument is written on ABC-012 and
  ABC-020 because the ADR's clauses are not a ticket's to edit.

## Next action

**Settle open question 1 (FIDE 9.6.1 "consecutive") — a BA/PM ruling against the actual Laws text.**
It is the last thing that could change `src/gameend.ts`, and it is cheaper before the merge than
after. Then the ABC-020 merge is the owner's, in the order named above.
