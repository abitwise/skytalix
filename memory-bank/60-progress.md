# Progress
_Updated: 2026-08-03 by Architect/Design (task `ticket-to-pr-ABC-011`, subtask `architect-abc011-defect-definition-and-ratify`, Workflow 04) — **ABC-011's SECOND design hop is closed and the ticket is back in `Ready for Dev`.** Three things were owed and all three are ruled. **(1) The MEDIUM defect's definition question: purity is UNCONDITIONAL and is bought with a PRECONDITION on the probe move, not with a change to what the predicate means; the answer stays domain-restricted and is SPECIFIED (`false`, touching nothing) where the board contradicts the ep square, because the ruled oracle is demonstrably unsound there — `generateMoves` corrupts on two of QE's three FENs and offers a pawn capturing onto the mover's own knight on a third.** Two guards, not one: the captured-pawn guard buys purity and closes a **fourth** reproduction no prior role had; the empty-target guard buys oracle agreement and is needed only for two **pure** divergences constructed at this hop. Re-derived on a fourth independent script: 518,474 nodes / 81,397 ep-set, **0** answers changed, **0** keys changed, **0** guard firings on the reachable population; 193/193 green in a sandbox with no existing test edited. **(2) Castling is NOT the en-passant case** — `zobristKey` keeps hashing castling **rights**, ruled in **`ADR-0006`** from the retained FIDE text whose sha256 **and currency** were both re-verified that day. **(3) `ADR-0005` is `accepted` WITH AN AMENDMENT** (one of its statements was false as written) and **`ADR-0006` is new and `accepted`** — the first ADRs ratified under the owner's standing directive of 2026-08-03, both carrying per-clause falsifier tables. Board: `Ready for UAT` 1/4 → 0/4, `In Design` 0/2 → 1/2 → 0/2, `Ready for Dev` 0/6 → 1/6; no limit approached, no override taken. **No production code changed**, size stays `M`, and one item (`generateMoves` offering a capture onto the mover's own piece) is **routed to BA/PM rather than cut here**. Previously 2026-08-02 by Architect/Design (task `ticket-to-pr-ABC-011`, Workflow 04) — **ABC-011's first design hop is closed: "an en-passant capture is available" is ruled to mean a LEGAL one (strict FIDE 9.2.3), the predicate is homed in `src/legal.ts` with `src/zobrist.ts` importing it, the ticket is re-sized `S` → `M` and not split, and it sits in `Ready for Dev`.** `ADR-0002` is extended around and NOT amended (no human ruling owed, none taken); **`ADR-0005` is written and is `proposed` — no agent may accept it, and ABC-011 is not blocked on it.** Board: `Ready` 5/8 → 4/8, `In Design` 0/2 → 1/2 → 0/2, `Ready for Dev` 0/6 → 1/6; no limit approached, no override taken. No production code changed. Previously the same day by BA/PM (task `refinement-fide-9-6-1`, Workflow 07) — **open question 1 CLOSED: FIDE 9.6.1 does NOT say "consecutive" and `src/gameend.ts` conforms**, ruled against the Laws text retrieved by this role from `handbook.fide.com` and retained verbatim under the task's context folder. No ticket cut, no board move (`Ready` stays 5/8), no code change owed on `main`. The "Next action" section is re-pointed accordingly. Previously the same day by the Orchestrator (ABC-020 merged to `main` on explicit owner instruction; branch stack resolved, board closed). Earlier the same day: first fill of this file, which had been the shipped empty template while the project ran to 27 unmerged commits._

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

## Standing directive — who decides. **This supersedes "no agent may ratify an ADR".**

**Project owner Olger Oeselg, 2026-08-03**, quoted verbatim:

> *"regarding ADR-0005, any legal move, even the special ones still need to be checked. I can see
> ADR-0005 contains a lot of info that human in this project is unable to correctly verify. Thus in
> most cases send decision to correct role. If it is architecture question then to architect to make
> the decision."*

**This is standing and it is a governance change, not a one-off.** Until today the rule was *"no
agent may mark an ADR `accepted`; a human must"*, and `ADR-0004`'s ratification by the Orchestrator
under a named delegation was recorded as **explicitly not precedent**. That rule is now **retired by
the owner**, and `ADR-0004` stops being an exception — it becomes the ordinary case.

**How this is read, stated explicitly so a later reader can check the reading rather than inherit
it.** The owner's reason is *verifiability*: a decision goes to whoever can actually verify it, and
the owner declines to rubber-stamp technical content they cannot check. Therefore:

- **Architecture decisions — including ratifying an ADR — are Architect/Design's**, and that role
  may now move an ADR to `accepted`. It owns the decision, so it also owns being wrong: an ADR it
  ratifies must record what would falsify it.
- **Product, scope, sizing and priority** are BA/PM's. **Risk, security and NFR bars** are
  Security/NFR's. **Business acceptance** is the UAT Planner's. "Send the decision to the correct
  role" is general; the ADR clause is the specific case the owner named.
- **"In most cases" is the owner's own hedge and is honoured, not rounded up to "all".** A decision
  that changes what the product *promises a user*, or that spends money, or that trades away a
  stated commitment, still goes to the owner. When a role is unsure which side of that line it is
  on, it asks — that is cheaper than a wrong ratification.
- **NOT delegated, and deliberately unchanged: merge and deploy.** `autonomy=pr` still holds and
  the roles' hard limit is untouched — a human holds both, and an agent supplies the keystroke only
  on explicit instruction, which is never standing. The owner delegated *decisions they cannot
  verify*; a merge is a decision they **can** verify, and they have exercised it four times.

**The first sentence is also a technical ruling and is recorded as one**, not just as preamble:
*"any legal move, even the special ones still need to be checked."* It endorses `ADR-0005`'s
strict-FIDE reading — a special move is still a move, so en-passant availability is a **legality**
question.

**The follow-on it raised is now ANSWERED, and the answer is NO — castling is a different case.**
Ruled 2026-08-03 by Architect/Design in **`ADR-0006`**, from the retained FIDE text rather than from
memory, and with the retained bytes' sha256 **and their currency** both re-verified that day.
`zobristKey` keeps hashing castling **rights**. The short form, because this will be asked again:
9.2.3.1 is written in the **capability** mood (*"could have been captured"*) and 9.2.3.2 in the
**entitlement** mood (*"had castling rights"*, *"forfeited these"*), and 9.2.3.2 carries a sentence
with no counterpart in 9.2.3.1 — *"The castling rights are lost **only** after the king or rook is
moved"* — whose "only" excludes transient blockers. And the decisive one: **given the placement and
the side to move, castling availability is a pure function of the rights**, because
`addCastlingMoves` reads nothing else — so hashing the right and hashing the availability are the
same discriminator. That was never true of the en-passant square, which is an extra bit the
placement does not determine. **Same Laws sentence, opposite consequence, and it is the placement
that makes the difference — not a preference.**

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
- **Six ADRs ratified**: **0001** 0x88 board, **0002** game-history ownership, **0003** legality
  strategy, **0004** SAN ownership, **0005** en-passant availability and the hash layer, **0006**
  castling rights stay rights in the hash. **0005 and 0006 were ratified by Architect/Design on
  2026-08-03 under the owner's standing directive above** — the first ADRs accepted under it, and
  `ADR-0004` is no longer the exception. **`ADR-0005` was accepted WITH AN AMENDMENT, not rubber-
  stamped:** one of its statements was false as written (its Consequences promised a predicate that
  "plays a move and takes it back", which the shipped code does not do on a semantically
  inconsistent ep square), so it gained **Decision clause 6** — the probe move's precondition,
  decided but **not yet built**, `ABC-011` carries it — plus a scope bound and a per-clause
  falsifier table. **`ADR-0006` says castling is NOT the en-passant case:** `zobristKey` keeps
  hashing castling **rights** and must not be changed to hash availability. **Both ADRs record what
  would falsify them**, which is the condition the delegation carries.

## What's left

**Nothing is deployed and nothing is released.** `mode=lean`, `autonomy=pr`; Done means merged.

- **`plans/board.md` is the WIP truth** — read it, do not infer state from here. As of 2026-08-03:
  ABC-020 **Done**; **ABC-011 back in `Ready for Dev` (1/6) after a SECOND design hop** — it went
  `Ready for UAT` → `In Design` → `Ready for Dev` on 2026-08-03, the first ticket here to enter
  `In Design` twice, and what it now carries is a **delta** on already-gated branch work rather than
  a fresh ticket; `Ready` holds ABC-009, ABC-012, ABC-013, ABC-014 (4/8); ABC-015..019 + ABC-021 in
  `Backlog` behind their predecessors; `Blocked`, `In Design` and `Ready for UAT` empty.
  **`Ready for Dev` → `In Development` is the Orchestrator's pull and has not been taken.**
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
| **ABC-011** | Zobrist hashes en passant when no capture is available → threefold **under**-detects | ~~S~~ **M** / P1 | latent; error direction is safe (a draw is missed, never falsely declared). **SECOND design hop closed 2026-08-03 — back in `Ready for Dev` with a second, dated contract on the ticket** |
| **ABC-011a** | `zobristKey` **permanently** corrupts a position whose ep square the board contradicts (`4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1` gains a phantom black pawn on d5) | folded into **ABC-011**, no new ticket | latent — invalid FEN only, **0 impure over 518,474 reachable nodes**. MEDIUM (Security/NFR). **The owner declined to merge carrying it**; the fix contract is ruled and the ticket is back in `Ready for Dev` |
| **NEW, unticketed** | `generateMoves` offers an en-passant capture onto a square occupied by the **mover's own** piece (`4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1`, `4k3/8/3N4/3pP3/8/8/8/4K3 w - d6 0 1`) | **unsized — BA/PM's to cut or fold into ABC-010** | latent — invalid FEN only; **pure**, so it is a wrong answer without corruption, unlike ABC-009. Found 2026-08-03 at ABC-011's second design hop and routed, not cut |

The first three are **carried, not owned** by ABC-020. Perft does not cover any of them, because
`src/perft.ts` never calls `gameStatus` or `zobristKey`. **All of them share one trigger class —
a semantically invalid FEN — which is `ABC-010`'s surface**, and the last two are both instances of
the same root shape: a `Move` handed to `makeMove` that `generateMoves` would not have produced
from that board, or produced when it should not have. `ABC-011`'s ruled fix makes the **hash**
immune to it; it does not clean the generator.

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

**Pull `ABC-011` from `Ready for Dev` into `In Development` — a SECOND time.** That is the
Orchestrator's move and it was deliberately not taken at either design hop. What the engineer picks
up is a **delta on already-gated branch work**, not a fresh ticket: two guard conditions in
`hasLegalEnPassant`, six test cases, and two doc-comment corrections. **The only production file
that changes is `src/legal.ts`.** The `### ANSWERED 2026-08-03` block carries the contract, the six
probe FENs with the mutant each one kills, and the cost. **`ABC-011` must land before `ABC-012`** —
that is the whole reason it was pulled first, and `ABC-012`'s repetition tests are written against
this key. **Security/NFR re-gates after the fix**; the design hop measured but does not adjudicate.

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

**Nothing is owed to a human except the merge.** `ADR-0005` and `ADR-0006` are both `accepted` as of
2026-08-03 under the owner's standing directive, so the long-standing "an ADR awaits a human" item is
closed. **Merge and deploy are still human-held and were not delegated**, and an agent supplies the
keystroke only on explicit instruction — never standing.

**One item is ROUTED TO BA/PM and is currently owned by nobody until they act:** `generateMoves`
offers an en-passant capture onto a square occupied by the **mover's own** piece
(`4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1`, `4k3/8/3N4/3pP3/8/8/8/4K3 w - d6 0 1`, both reproduced
2026-08-03). Invalid-FEN class, a sibling of `ABC-009`, plausibly folds into `ABC-010`. Architect/
Design named it rather than cutting it, because cutting tickets is not that role's call. **A second,
cheaper item rides with it:** `makeMove`'s doc comment does not state what a well-formed `Move` is,
which is the precondition every one of these defects violates — one sentence, in a file `ABC-011`
puts out of scope.
