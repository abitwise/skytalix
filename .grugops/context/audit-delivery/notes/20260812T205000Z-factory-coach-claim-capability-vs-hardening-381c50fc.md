---
id: 20260812T205000Z-factory-coach-claim-capability-vs-hardening-381c50fc
kind: claim
by: factory-coach
at: 2026-08-12T20:50:00Z
verified_by:
confidence: medium
refs:
  - delivery-audit-2026-08-12
  - plans/metrics.md
  - ABC-006
  - ABC-008
  - ABC-009
  - ABC-011
  - ABC-020
  - ABC-022
  - ABC-023
  - ABC-025
  - ABC-027
  - ABC-028
  - ABC-029
  - src/moves.ts
  - src/history-pane.ts
supersedes:
---

# 20 CAPABILITY / 5 HARDENING overall — but 9:1 in the first ten and 6:4 in the last ten

`confidence: medium` and deliberately so. **The counts are hard; the rule that produces them is a
judgment call, and the rule is the part worth attacking.** So the rule comes first, before any
number, and the six tickets I found genuinely ambiguous are listed by name with what flips them.

## THE RULE, stated before it is applied

> A `Done` ticket is **CAPABILITY** if its merge changed the delivered *behaviour* of `src/` —
> measured as non-comment production lines added or modified in a module on the production path.
> It is **HARDENING/META** if its production diff was zero, comment-only, or behaviour-neutral, and
> what it added was tests, budgets, records, comments or documentation around behaviour that
> already existed and was already correct.

The discriminator is **"did the product's behaviour move?"** — not "was it valuable", and not "did
it fix a bug".

**Two consequences of the rule I am choosing on purpose, because they are where it will be
attacked:**

1. **A defect fix counts as CAPABILITY.** `ABC-009`, `ABC-011` and `ABC-022` changed what the
   program does, so the rule calls them capability, even though they added no *new* capability —
   they repaired capability already banked as `Done`. A stricter *net-new* rule would put those
   three in a third bucket (REWORK) and drop the capability count from 20 to **17**.
2. **I did NOT use user-reachability as the discriminator**, even though the blunt question is
   about exactly that. Under a user-reachability rule the answer is trivially **0 capability out of
   25**, because no human can run anything in this repository. A rule whose output is a constant
   measures nothing. So the rule measures *product surface moved*, and the user-reachability
   question is answered separately, on its own evidence, in the ruling note.

**Evidence per ticket is the production diff itself**, measured with `git log --numstat` per module
in `src/` — not the ticket's own prose about itself. Where a ticket claims "expected production
diff ZERO LINES", I verified the claim rather than quoting it. Every one held.

## THE CLASSIFICATION — all 25, in merge order, with the measured diff

| # | Ticket | Merged | Production diff measured | Class |
|---|---|---|---|---|
| 1 | `ABC-001` position + FEN | 07-23 | `src/position.ts`, `src/fen.ts` created | CAPABILITY |
| 2 | `ABC-002` pseudo-legal moves | 07-23 | `src/moves.ts` **+167** | CAPABILITY |
| 3 | `ABC-003` apply/undo | 07-23 | `src/apply.ts` created | CAPABILITY |
| 4 | `ABC-008` SPIKE throughput | 07-23 | **zero `src/`** — `spike/perft-bench.ts` only | META ⚠ |
| 5 | `ABC-004` special moves | 07-24 | `src/moves.ts` **+196/−13** | CAPABILITY |
| 6 | `ABC-005` legal filtering | 07-24 | `src/legal.ts` **+55** | CAPABILITY |
| 7 | `ABC-006` perft harness | 07-24 | `src/perft.ts` **+71**, `src/perft-bench.ts` **+114** | CAPABILITY ⚠ |
| 8 | `ABC-007` game-end + zobrist | 07-24 | `src/gameend.ts` **+111**, `src/zobrist.ts` **+74** | CAPABILITY |
| 9 | `ABC-020` FIDE 9.2/9.3 claimable draws | 08-02 | `src/gameend.ts` **+87/−26** | CAPABILITY ⚠ |
| 10 | `ABC-011` zobrist ep hashing | 08-04 | `src/zobrist.ts` **+18/−2**, `src/legal.ts` **+87/−8** | CAPABILITY ⚠ |
| 11 | `ABC-012` game history | 08-06 | `src/history.ts` created | CAPABILITY |
| 12 | `ABC-014` board renderer | 08-08 | `src/render.ts` created | CAPABILITY |
| 13 | `ABC-015` glyph mode | 08-08 | `src/glyph-mode.ts` created | CAPABILITY |
| 14 | `ABC-018` frame output | 08-09 | `src/frame.ts` **+222** | CAPABILITY |
| 15 | `ABC-009` legalMoves mutation | 08-09 | `src/moves.ts` **+30/−8** | CAPABILITY ⚠ |
| 16 | `ABC-022` ep preconditions | 08-09 | `src/moves.ts` **+24/−12**, `src/legal.ts` **+6/−2** | CAPABILITY ⚠ |
| 17 | `ABC-013` SAN rendering | 08-10 | `src/san.ts` **+148** | CAPABILITY |
| 18 | `ABC-023` castling precondition net | 08-10 | **zero** — verified | HARDENING |
| 19 | `ABC-025` SAN qualifier minimality net | 08-10 | **zero** (one comment-only `src/legal.ts` +9/−4 in the window) | HARDENING |
| 20 | `ABC-016` status panel | 08-12 | `src/status-panel.ts` created (216 lines) | CAPABILITY |
| 21 | `ABC-027` frame writer clears each row | 08-12 | `src/frame.ts` **+32/−8** across two commits | CAPABILITY ⚠ |
| 22 | `ABC-017` history pane | 08-12 | `src/history-pane.ts` **+145** | CAPABILITY |
| 23 | `ABC-019` turn loop | 08-12 | `src/turn-loop.ts` **+328/−15** across three dev hops | CAPABILITY |
| 24 | `ABC-029` "production module" undefined | 08-12 | `src/history-pane.ts` **+1/−1** — a rename | HARDENING ⚠ |
| 25 | `ABC-028` history-pane unreached classes | 08-12 | **zero** — verified | HARDENING |

## THE RATIO, and the ratio over TIME

- **Overall: 20 CAPABILITY / 5 HARDENING-META = 80% / 20%.**
- **First ten to `Done`: 9 / 1 = 90% / 10%.** The only non-capability is the `ABC-008` spike.
- **Last ten to `Done`: 6 / 4 = 60% / 40%.** `ABC-023`, `ABC-025`, `ABC-029`, `ABC-028`.
- Middle five (`ABC-012`, `-014`, `-015`, `-018`, `-009`): **5 / 0**.

**The headline is the trend, not the total.** Hardening went from one ticket in ten to four in ten.

## THE SUPPORTING MEASUREMENT — production lines vs test lines, which is far starker

This is support, not the headline, because it measures effort and not intent. It is nonetheless
the sharpest number in this audit (`git log --numstat` over `src/`, `spike/`, `tools/`):

| Cohort | Production lines added | Test lines added | Ratio |
|---|---|---|---|
| Rules core, 2026-07-22…24 | **1530** | **1666** | **1.1 : 1** |
| 2026-07-31…08-08 | **618** | **2991** | **4.8 : 1** |
| 2026-08-09…12 | **1164** | **9292** | **8.0 : 1** |
| **2026-08-12 alone** | **1** | **1219** | **1219 : 1** |

Repository today: **2941 production lines, 12866 test lines, 4.4 : 1.** On the last measured day
six tickets reached `Done` and the whole day's production diff was **one word renamed**.

## THE SIX I FOUND GENUINELY AMBIGUOUS — each with what flips it

The rule is more contestable than the count, so here is exactly where it bends.

1. **`ABC-006` perft harness — CAPABILITY, and this one flips the total by one.** It created two
   files on the production path (`src/perft.ts`, `src/perft-bench.ts`, 185 lines) that **no user
   will ever call**; they exist to verify the rules core. Under a user-reachability rule it is
   HARDENING and the total becomes 19/6. I left it CAPABILITY because it is imported production
   code with its own exports, not a test file. **Reasonable people will disagree, and the
   disagreement is one ticket wide.**
2. **`ABC-008` SPIKE — META by the rule, and the rule undersells it.** It wrote no `src/` line and
   produced a *decision* (`GO WITH CONSTRAINT`: a time-based per-move budget is mandatory for
   `EPIC-004`). A spike buys information; it is genuinely a third category and my two buckets have
   nowhere good to put it. Calling it "meta" is the least wrong of two wrong options.
3. **`ABC-009`, `ABC-011`, `ABC-022` — CAPABILITY by the rule, REWORK under a net-new rule.** All
   three are fixes to behaviour that had already been merged and signed off as `Done`. They moved
   the product's behaviour (so: capability) while adding nothing the roadmap had not already
   claimed to have (so: not really). **This is the single largest lever on the number: moving all
   three drops capability from 20 to 17 and the last-ten split from 6/4 to 5/5.**
4. **`ABC-027` — CAPABILITY, arguably HARDENING.** It was cut from a design hop and its final fix
   came out of the project's only Security/NFR **FAIL**. But the defect was user-visible (a
   narrowing frame ate the entire h-file plus its label, 9 rows of 23, measured on a real pty) and
   the fix changed the emitted bytes. Behaviour moved, so: capability.
5. **`ABC-029` — HARDENING, and I overrode my own rule to say so.** Its production diff is
   **+1/−1**, which is non-zero, and a literal reading of "production lines added or modified"
   makes it CAPABILITY. The change is a rename so that one word means one thing in two guards; no
   behaviour moves. **I applied the behaviour test over the line-count test. That is the rule's
   sharpest edge and I am naming it rather than hiding it inside a table cell.**
6. **`ABC-020` — CAPABILITY, with an asterisk.** It made FIDE 9.2/9.3 draws claimable in
   `src/gameend.ts`, but the *claim interaction* that would let anyone claim one is `ABC-021`,
   still in `Backlog` at 12 days. The capability exists and nothing in the codebase can reach it.

**If every ambiguity is resolved against me** — `ABC-006` to hardening, the three fixes to rework —
the split becomes **16 CAPABILITY / 5 HARDENING / 3 REWORK / 1 SPIKE**, and the last ten becomes
**5 capability / 5 not**. That is the pessimistic reading and it is still not a factory that has
stopped building. Both readings are on the record; pick one and say which.
