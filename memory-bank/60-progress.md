# Progress
_Updated: 2026-08-02 by Architect/Design (task `ticket-to-pr-ABC-011`, Workflow 04) — **ABC-011's design hop is closed: "an en-passant capture is available" is ruled to mean a LEGAL one (strict FIDE 9.2.3), the predicate is homed in `src/legal.ts` with `src/zobrist.ts` importing it, the ticket is re-sized `S` → `M` and not split, and it sits in `Ready for Dev`.** `ADR-0002` is extended around and NOT amended (no human ruling owed, none taken); **`ADR-0005` is written and is `proposed` — no agent may accept it, and ABC-011 is not blocked on it.** Board: `Ready` 5/8 → 4/8, `In Design` 0/2 → 1/2 → 0/2, `Ready for Dev` 0/6 → 1/6; no limit approached, no override taken. No production code changed. Previously the same day by BA/PM (task `refinement-fide-9-6-1`, Workflow 07) — **open question 1 CLOSED: FIDE 9.6.1 does NOT say "consecutive" and `src/gameend.ts` conforms**, ruled against the Laws text retrieved by this role from `handbook.fide.com` and retained verbatim under the task's context folder. No ticket cut, no board move (`Ready` stays 5/8), no code change owed on `main`. The "Next action" section is re-pointed accordingly. Previously the same day by the Orchestrator (ABC-020 merged to `main` on explicit owner instruction; branch stack resolved, board closed). Earlier the same day: first fill of this file, which had been the shipped empty template while the project ran to 27 unmerged commits._

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
  strategy, **0004** SAN ownership. **A fifth, ADR-0005 (en-passant availability and the hash
  layer), is `proposed` and awaits a human — no agent may accept it.** It records `ABC-011`'s design
  ruling that `src/zobrist.ts` asks `src/legal.ts` whether an en-passant capture is legal; the
  graph stays acyclic and exactly as deep, but `zobrist` moves from level 2 to level 5.
  **`ABC-011` is not blocked on it** — the authority for that ruling is the ticket's own delegation
  of the question to Architect/Design by name.

## What's left

**Nothing is deployed and nothing is released.** `mode=lean`, `autonomy=pr`; Done means merged.

- **`plans/board.md` is the WIP truth** — read it, do not infer state from here. As of 2026-08-02:
  ABC-020 **Done**; **ABC-011 in `Ready for Dev` (1/6), design hop closed**; `Ready` holds ABC-009,
  ABC-012, ABC-013, ABC-014 (4/8); ABC-015..019 + ABC-021 in `Backlog` behind their predecessors;
  `Blocked` and `In Design` empty. **`Ready for Dev` → `In Development` is the Orchestrator's pull
  and has not been taken.**
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
| **ABC-011** | Zobrist hashes en passant when no capture is available → threefold **under**-detects | ~~S~~ **M** / P1 | latent; error direction is safe (a draw is missed, never falsely declared). **Design hop closed 2026-08-02 — in `Ready for Dev`, contract on the ticket** |

All three are **carried, not owned** by ABC-020. Perft does not cover any of them, because
`src/perft.ts` never calls `gameStatus` or `zobristKey`.

### Open questions nobody has ruled on

1. ~~**FIDE 9.6.1 says "five *consecutive* alternate moves"; ABC-020's code uses a plain 5-count.**~~
   **CLOSED 2026-08-02 by BA/PM (task `refinement-fide-9-6-1`) against the retrieved Laws text.
   THE CODE CONFORMS. No gap, no ticket, and `src/gameend.ts` does NOT change.** The current
   Article 9.6.1, quoted verbatim from `handbook.fide.com/chapter/E012023` (HTTP 200, retrieved and
   retained under `.grugops/context/refinement-fide-9-6-1/sources/` with its sha256), reads:

   > 9.6.1 the same position has appeared, as in 9.2.2 at least five times.

   **The word "consecutive" appears zero times in the entire 2023 Laws of Chess.** `>= 5` on a
   counts map is a term-for-term match for "at least five times", and 9.2's own parenthesis —
   "(not necessarily by a repetition of moves)" — confirms the repetition rules are counts with no
   ordering predicate. **QE's remembered sentence was real, verbatim, and two editions stale**: it
   is the 2014 text ("for at least five consecutive alternate moves by each player"), removed
   effective 1 July 2017 and absent from the 2017, 2018 and 2023 editions. QE's `UNKNOWN - verify`
   is **vindicated, not overturned** — right words, wrong edition, which is exactly what memory
   cannot detect. **The feared second change to `src/gameend.ts` on `main` is NOT owed**, and the
   conditional Architect/Design hop for a per-ply key list (`ADR-0002` clause 3) is **cancelled
   rather than deferred** — no ordering is needed, so `ADR-0002` needs no amendment. Ruling and
   evidence: `.grugops/context/refinement-fide-9-6-1/notes/20260802T210100Z-ba-pm-decision-968fe5b1.md`.
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

**All eight merged branches were DELETED on 2026-08-02 on explicit owner instruction — `main` is
now the only branch in the repo**, still at `4a73cf3`. Each was validated merged first
(`git merge-base --is-ancestor <branch> main` + `git rev-list --count main..<branch>` = contained / 0)
and deleted with `git branch -d`, the safe form that refuses an unmerged branch; `-D` was never
used. **No commit was lost** — every deleted tip is still reachable from `main`, and the eight SHAs
are recorded in `plans/board.md`'s Done comment so they survive a reflog expiry. This is **not
standing authorization**; the standing rule is unchanged — branch deletion is the owner's call.

There is still **no git remote on this repo at all**, so no PR exists or can be opened; that
absence is recorded, not an oversight.

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

**Pull `ABC-011` from `Ready for Dev` into `In Development`.** That is the Orchestrator's move and it
was deliberately not taken at the design hop. The ticket is unblocked, sized `M`, and its
`### ANSWERED` block carries the ratified contract plus two traps an engineer would otherwise walk
into (`legalMoves(...).some(...)` corrupts the position it hashes; the predicate in `src/moves.ts`
creates this project's first dependency cycle). **`ABC-011` must land before `ABC-012`** — that is
the whole reason it was pulled first, and `ABC-012`'s repetition tests are written against this key.

After it: `Ready` holds ABC-009 (the other rules-core defect), and ABC-012, ABC-013, ABC-014 (the
EPIC-002 P0s the product does not exist without). Rules-before-renderer is pull-order guidance on the
board, not an inflated priority number — read the re-sequencing comment under `Ready` before
choosing. **`ABC-014` still carries the ABC-015/RISK-005 sequencing knot the Orchestrator flagged for
BA/PM on 2026-08-02; it is untouched by this hop.**

**No open question can change already-merged rules code any more.** The one that could — 9.6.1 —
closed as conformant on 2026-08-02. Questions 2 and 3 are a dead type alias and a wording
correction; neither touches behaviour, and neither has been ruled on. **Question 2 is named as
Architect/Design's seam and was deliberately NOT ruled at ABC-011's design hop** — that hop's scope
was one question on one ticket, and taking a second ruling in passing is how a scope becomes a
habit.

**One thing owed to a human, and it is not blocking:** `ADR-0005` is `proposed`. No agent may mark it
`accepted`, and nothing in flight waits on it.
