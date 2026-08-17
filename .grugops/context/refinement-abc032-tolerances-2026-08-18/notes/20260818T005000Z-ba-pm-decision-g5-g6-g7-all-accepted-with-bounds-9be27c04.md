---
id: 20260818T005000Z-ba-pm-decision-g5-g6-g7-all-accepted-with-bounds-9be27c04
kind: decision
by: ba-pm
at: 2026-08-18T00:50:00Z
verified_by:
confidence: high
refs:
  - ABC-032
  - ABC-033
  - ABC-034
  - ABC-106
  - G5
  - G6
  - G7
  - A5
  - ADR-0004
  - src/san.ts
supersedes:
---

# `G5` ACCEPT, `G6` ACCEPT, `G7` ACCEPT-AS-DELIVERED. The closed list goes from two entries to five and stays CLOSED.

Three product rulings on the input grammar, which is why QE pinned them here rather than deciding
them. Each ACCEPT is **bounded by an assertion that already exists in the delivered suite** — an
unbounded ACCEPT would be a widening nobody could stop from creeping, and I would have refused it.
`text.trim()` is already ruled (QE accepted it on the condition that it be asserted, and that
condition is met); it is written onto the page as entry 3 and is not re-opened here.

## `G5` redundant qualifiers (`Nfg5`, `N3g5`, `Nf3g5`) — **ACCEPT**

*Reason.* A redundant qualifier **cannot change which move is named**. It over-specifies an origin
the parser has already fixed, and the delivered filter treats a present qualifier as an equality test
(`src/san.ts:243-244`), so a *wrong* origin is still refused — `Ne4g5` is `no-such-move`, asserted.
So the widening admits strings that are unambiguous and correct, and admits nothing else. It is also
what real notation does to a player: PGN exporters over-qualify, and long-algebraic `Nf3g5` is a
common human habit. Refusing it would push a string that names exactly one legal move into
`ABC-034`'s teaching rejection, where the only honest message is "you named the right move and spelled
your own origin square" — a rejection that teaches nothing and reads as a bug.

*Consequence for `ABC-033`.* **None structurally, and it shrinks the ticket.** The arm returned is
`move`, so the dispatch shape, the fixed order of attempt and the `PromptOutcome` mapping are all
unchanged; fewer strings reach the case-folded retry. Written onto its `## Scope`.

*Consequence for `ABC-034`.* **A code it must NOT invent.** There is no `redundant-qualifier` reason,
because there is no rejection. The seven-code set is unaffected.

## `G6` mixed castle spellings (`O-0`, `0-O`) — **ACCEPT**

*Reason.* `O-0` and `0-O` are keyboard slips, not a notation anyone writes — and there is **exactly
one thing either can mean**. Accepting a slip that has a single interpretation is the same trade the
page already made for `0-0`, which is the entry the digit tolerance exists for. Weighed the other
way: REFUSE costs a defect ticket, a production edit to the most heavily guarded file in the
repository, a test row, a gate and a merge, and buys **no user any protection** — that is bloat by my
own rule, and I said no to it rather than to the tolerance. Also verified before ruling: the
`replaceAll("0","O")` sits after both the piece and pawn branches have failed to match
(`src/san.ts:265`), so the substitution cannot reach a non-castle string.

*The bound, and it is the honest weakness of this ruling.* `o-o` — lowercase, a **far more likely**
habit than mixing `O` and `0` — is still refused. The tolerance set is therefore lopsided at
`ABC-032`'s boundary. **That asymmetry is deliberate and it resolves one ticket later**: case is
meaning in SAN (`bxc4` / `Bxc4` can both be legal), so case-folding is a RETRY that can produce two
candidates, and `ABC-033` owns it.

*Consequence for `ABC-033`.* **Named on its page as work it keeps, not work it inherits.** `o-o` /
`o-o-o` fold to `O-O` / `O-O-O` with exactly one candidate, asserted there. It must not push the case
back into `ABC-032`, and it must not trim the line a second time or normalise before dispatch.

*Consequence for `ABC-034`.* None. No rejection is produced.

## `G7` `e8=K` coded `no-such-move` — **ACCEPT AS DELIVERED for `ABC-032`; the re-classification is `ABC-034` `A8`**

*Reason.* By the floor's own words `e8=K` is not well-formed SAN and belongs on the `unreadable`
side, so the code is arguably wrong — but **`A5` is genuinely MET**: the two codes are independently
reachable from many inputs and never collapse, and QE proved the guard against collapsing them can
fail. The cost of fixing it *inside `ABC-032`* is a private promotion-letter subset in `src/san.ts`,
which is the second table `ADR-0004` clause 2 and `A7` exist to prevent. `ABC-034` is the hop that
widens the vocabulary and writes the player-facing wording; **the classification and the words that
explain it belong in the same hand.** Deferring it is placement, not a floating recommendation — it
is cut as a criterion.

*Consequence for `ABC-034`.* **New `A8`, and a `## Scope` bullet.** `e8=K` and the castle price the
engineer disclosed (`O-O` with no castle legal → `unreadable`) share one root cause and must be
placed **together**; each must land on one of the **seven existing codes** — `A8` forbids an eighth,
so this ruling does not silently grow that ticket — and the fix may not introduce a second
promotion-letter or castle-string table in `src/san.ts`. `A8` carries the three measured witnesses.
`ABC-034`'s DoR row 4 now reads eight criteria, not seven.

*Consequence for `ABC-033`.* None. It carries codes and does not read them.

## What this ruling costs in code, and the one ticket it cuts

**Nothing in production.** All three behaviours are already asserted with their bounds, in rows QE
added at the gate — so ACCEPT carries zero test debt and the closed list on the page is now backed by
executable assertions rather than prose. The one consequence is that those rows are headed
*"CHARACTERIZATION, not a demanded tolerance … whoever rules on them"*, which is now false and
invites the next author to delete them. **Cut as `ABC-106`** (`XS`, `P2`, comment-and-title only,
blocked on `ABC-032` merging) rather than left as a recommendation.
