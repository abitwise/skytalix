---
id: 20260731T171200Z-ba-pm-decision-0ffe92bd
kind: decision
by: ba-pm
at: 2026-07-31T17:12:00Z
verified_by: 
confidence: high
refs:
  - epic-to-tickets-EPIC-002
  - ba-pm-legality-resequence
  - EPIC-002
  - EPIC-003
  - EPIC-004
  - EPIC-006
  - ABC-016
  - ABC-018
  - ABC-019
  - ABC-020
  - ABC-021
  - 20260731T151500Z-qe-e2e-observation-36373ca4
  - 20260731T153200Z-qe-e2e-claim-aab64fc7
  - plans/epics/EPIC-003-move-input-and-controls.md
  - plans/epics/EPIC-006-game-session-and-packaging.md
  - plans/tickets/ABC-016-status-panel.md
supersedes: 
---

# The claim-UX ruling — who claims, how, and what the frame shows. Nothing escalated to the owner.

"Claimable" means *someone claims*. Four questions, four answers, each with the reason it went that
way rather than the other way, and each with the ticket it lands on. **None of these is escalated:
every one is a product/scope call, which is my lane.** What I did escalate is named at the foot.

## 1. Who claims? The player having the move — and in this slice that means the human only.

FIDE 9.2.1 gives the claim to the claimant *having the move*, and that asymmetry is the whole of
G-1: the third occurrence in QE's line is created by **Black's** move, so Black cannot claim and
White plays `Re8#`. `ABC-020` computes availability against the side to move, and `ABC-020`
acceptance **A7** asserts the **attribution**, not merely that something is claimable — an
implementation that ignores whose turn it is passes every availability assertion and reproduces the
exact defect being fixed.

## 2. Does the engine claim on its own behalf? No — because it cannot yet, not because it should not.

A claim policy worth having is *"claim when the position is not better for me"*. That needs an
evaluation function. **`EPIC-004` does not exist**, and `ABC-019`'s engine stub is seeded-random with
no evaluation at all. The only policy implementable today is *"always claim when available"*, and
that is **strictly worse chess** — it throws away won games by claiming draws in winning positions.

Declining to claim is always legal (a FIDE claim is a right, never an obligation), and 9.6.1 draws
the same game automatically four plies later, so the conformance cost is **zero**. The strength cost
is real and is stated rather than hidden: an engine that cannot claim at occurrence 3 loses the
half-point it was entitled to if the human deviates instead of claiming.

**Handed to `EPIC-004`'s decomposition with the requirement written out** so it is not rediscovered:
*the engine claims a draw when one is available to it and its evaluation of the position is not
better than a draw.* Recorded on `ABC-021`'s `## Dependencies`. This is a deferral with a named
owner and a written requirement, not an omission.

## 3. Is a claim offered when one is available? No prompt. The frame states it; the player asks.

Rejected on product grounds, two of them:

- **`EPIC-002` acceptance `4a` requires every frame to have an identical row count.** A modal offer
  breaks it, and `4a` is one of the two criteria this epic amended precisely because untestable
  criteria fail the Definition of Ready for every ticket beneath them.
- **The product's value is *one command, five seconds, and you are playing*.** This is the same
  reasoning that rejected the first-run glyph prompt in epic amendment `[A1]` (`2c`) — consistency
  with a ruling already on the record, not a fresh preference.

A player who never learns the command loses nothing they had before this pair of tickets: the game
still ends automatically under 9.6.

## 4. What does the status panel show? Availability, attributed to the side to move.

Not "you may claim". The panel renders on the engine's plies too, and the claim genuinely belongs to
whoever has the move. One rule, no special case, and it matches `gameStatus`'s own semantics exactly.

## The tickets this reaches into — named, and all amended today

| Ticket / epic | What it now owns | State |
|---|---|---|
| **`ABC-020`** (`EPIC-001`) | whether a claim exists, and for whom | cut today, `Ready` |
| **`ABC-021`** (`EPIC-002`) | the loop path: the `claim` outcome, the terminal transition, the teaching rejection, the engine-does-not-claim rule | cut today, `Backlog` |
| **`ABC-016`** (`EPIC-002`) | **item 7**, the availability cell — blank-but-present when nothing is claimable, so the panel's height never changes | amended today: scope item, out-of-scope lines, one acceptance criterion, `ABC-020` added to dependencies. **Size stays `M`, priority stays `P1`** |
| **`EPIC-003`** | the **`claim` verb**: grammar, tolerance, tab-completion, and the rejection message that teaches | `## Scope` amended today — `claim` added to the command set with what the epic does and does not own |
| **`EPIC-006`** | the result screen's wording for a **claimed** draw vs an automatic one | `## Scope` amended today; the reason set is now eight, and the exact count is settled at that epic's decomposition |
| **`ABC-018`** | sanitising the rejection message at the terminal sink | unchanged — it already owns escape-sequence injection for the whole frame, and `ABC-021` adds no second path |

**Why the verb is `EPIC-003`'s and not `EPIC-006`'s.** It is closest in *kind* to `resign` (a
game-terminating declaration, which is `EPIC-006`'s). It is placed in `EPIC-003` because that epic
already owns "in-game commands" typed at the prompt and owns the rejection-message standard the
claim path needs — and because `EPIC-006` is `P2` and undecomposed, so parking a `P1`-adjacent
affordance there would strand it. `ABC-021` builds against `ABC-019`'s **stub** input seam meanwhile,
exactly as that ticket builds its coordinate reader from merged code alone.

## What was CUT, with reasons — this is the scope-protection half of the ruling

- **Claiming a draw that will arise after an intended move** (FIDE 9.2.1.1 / 9.3.1). Requires the
  player to announce or write down a move before playing it — a tournament-arbiter mechanism. Cut.
  The claim in this product is always about a position that has already arisen.
- **A penalty for an incorrect claim** (FIDE 9.5.3 — adds time to the opponent's clock). There are no
  clocks in any epic. Cut; an unavailable claim is simply rejected.
- **Draw by agreement / a draw offer** (FIDE 9.1). No epic has one; `EPIC-006`'s command set is
  `undo` / `resign` / `new` / `quit`. Cut, and named in two places so the omission stays visible
  rather than being assumed away. QE flagged that adding one would move the terminal-condition count
  again (`...claim-aab64fc7` §4) — it would, and that is a reason to keep it cut.
- **An offer prompt.** See question 3.
- **A `history`/scroll surface for claims, a claim log, or claim analytics.** Never proposed;
  recorded so it is never proposed.

## The one thing genuinely not mine, and where it went

**Nothing in G-1's product surface needed the owner.** The only escalation is technical: how the
claimable set reaches `gameStatus`'s caller brushes `ADR-0002` clause 4's *"the signature does not
change"*. That went to **Architect/Design** as a design-hop item on `ABC-020`, with the standing rule
attached — if the shape decision amends a ratified clause rather than extending around it, it goes
to a named human, because no agent may amend one. I did not decide it and I did not manufacture an
owner escalation to avoid deciding what was mine.

**One thing the owner should know rather than rule on, recorded plainly:** `ABC-020` changes
behaviour a human already accepted at merge (`ABC-007` passed both gates and was merged on explicit
human instruction). The 2026-07-31 directive is dated after that acceptance and is explicit, so I
treated it as the authority and did not block. Reversing me is one sentence from the owner.
