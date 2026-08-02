# Progress
_Updated: 2026-08-02 by the Orchestrator (ABC-020 merged to `main` on explicit owner instruction; branch stack resolved, board closed). Earlier the same day: first fill of this file, which had been the shipped empty template while the project ran to 27 unmerged commits._

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

- **ABC-020 is merged** — FIDE 9.2/9.3 draws are now claimable rather than automatic, and the 9.6
  fivefold / 75-move backstops landed with them. The bug it fixed took a won game from the player
  entitled to refuse the draw. **Suite 174/174, 0 skips, `src/gameend.ts` 100%.**
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
  ABC-020 **Done**; `Ready` holds ABC-009, ABC-011, ABC-012, ABC-013, ABC-014;
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
   BA/PM ruling against the actual Laws text. **Inside the owner's standing directive.** The
   Orchestrator recommended settling it before the merge; the owner merged first on 2026-08-02,
   which is a legitimate call — the error direction is the safe one, as with ABC-011. The
   consequence is now real rather than hypothetical: closing it means a **second change to
   `src/gameend.ts` on `main`**, not one change on a branch.
2. **`GameResult` is dead** — referenced by nothing in `src/` after ABC-020. Kept deliberately
   (coding rule 12). The trap: it is a flat union matching neither arm of `GameStatus`, so
   `render(r: GameResult)` compiles and silently drops the claim. One-line close
   (`GameStatus["result"]`), Architect/Design's seam.
3. **ABC-020's A5/A8 `Given` wording** is factually wrong about the locked pawn wall (it unfreezes
   after its first capture; the clock resets three times). The criteria's **substance holds** under
   ten drives and is pinned by tests. Documentation only.

## The branch stack — RESOLVED 2026-08-02, everything is on `main`

**All nine branches are now contained in `main`** (`git branch --no-merged main` is empty), at
`cb62c9f`. The three formerly-open branches — `architecture-audit-2026-07-29`,
`epic-to-tickets-EPIC-002`, `ticket-to-pr-ABC-020` — were a single linear chain and landed in one
fast-forward (27 commits, no merge commit). Gate verified before the merge on the tip and again
after it on `main`: 174/174, 0 skips.

**Branch from `main` now.** It carries all four ADRs and every ticket. The earlier warning that
`main` lacked them is obsolete.

No branch was deleted — the owner's call, not an agent's. There is still **no git remote on this
repo at all**, so no PR exists or can be opened; that absence is recorded, not an oversight.

**The load-bearing merge order was honoured**: ABC-020 landed before ABC-019 and ABC-016, whose
acceptance criteria were amended on 2026-07-31 to match it. That constraint is now **discharged**,
not pending.

**The merge was performed by an agent on explicit human instruction.** That is the one path that
crosses the "humans hold merge" line without breaking it — the human holds the decision, the agent
supplies the keystroke — and it is **not standing authorization**. No future merge happens without
the same explicit instruction.

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

The merge is done and the board has no work in flight — every column between `Ready` and `Done` is
empty. Two candidates, and they are not equivalent:

1. **Settle open question 1 (FIDE 9.6.1 "consecutive")** — a BA/PM ruling against the actual Laws
   text. Cheap, and it is inside the owner's standing directive. It is now a change on `main` if
   real, so it will not get cheaper by waiting.
2. **Pull the next ticket.** `Ready` holds five: ABC-009, ABC-011 (both rules-correctness, which the
   directive ranks first), and ABC-012, ABC-013, ABC-014 (the EPIC-002 renderer P0s the product does
   not exist without). Rules-before-renderer is pull-order guidance on the board, not an inflated
   priority number — read the re-sequencing comment under `Ready` before choosing.

The Orchestrator's recommendation is **(1) first**, on the same reasoning that made it right before
the merge: it is the last open question that can change already-merged rules code, and it is small.
