---
id: 20260801T210000Z-orchestrator-observation-b7d3e044
kind: observation
by: orchestrator
at: 2026-08-01T21:00:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-020
  - ABC-020
  - ABC-016
  - ABC-019
  - ABC-021
  - ADR-0002
  - NFR-001
  - EPIC-004
  - EPIC-006
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - src/gameend.ts
supersedes: 
---

# Close record — ABC-020 through the full gate chain; awaiting the human merge, which no agent takes

Close of task `ticket-to-pr-ABC-020` (Workflow 04). Four roles, four waves, concurrency 1
throughout — every wave was a true dependency, not a scheduling choice.

| Wave | Role | Board move it owned |
|---|---|---|
| 1 | Architect/Design | `Ready` → `In Design` → `Ready for Dev` |
| — | **Orchestrator** | **`Ready for Dev` → `In Development`** (DoR re-checked at the pull) |
| 2 | Software Engineer | `In Development` → `In Review` |
| 3 | QE/E2E | `In Review` → `In Security/NFR` |
| 4 | Security/NFR | `In Security/NFR` → `Ready for UAT` |

No WIP limit approached, no override taken at any column. Suite 154 → **174, 0 skips**, lint /
typecheck / build green, `src/gameend.ts` 100%. Production diff is one module, +113/−66.

## Every gate caught something the one before it missed — that is the result worth recording

This ticket exists because `ABC-007` shipped non-conformant code through a green gate with 100%
coverage. The chain was run on the assumption that this could happen again, and it did — four
times, in four different ways:

1. **The design hop falsified the ticket.** ABC-020 asserted its return-shape question "resolves
   identically under all three options". It does not: 18 whole-object `toEqual` assertions outside
   A9's named five survive only if the new field is *absent* rather than `null`/`[]`, which
   eliminates two of the three candidate shapes. **The constraint selected the design.** An
   engineer who had guessed would have burned the change.
2. **The Engineer measured A9 instead of asserting it** — rewrote the module first, ran the suite,
   observed exactly the four named tests fail. That is evidence; "I only changed the named tests"
   is a claim.
3. **QE ran 13 mutations and 4 survived**, every one an ordering above the clock — and found the
   ticket claimed a guard for them that does not exist (`## Out of scope` says "A6 pins it"; A6
   pins checkmate against the *clock*, a different pair). QE also ruled that one of the wrong
   sentences was **its own**, carried from its G-3 note into A5's `Given`.
4. **Security/NFR found all three NFR-001 bars were held by nothing.** A second `legalMoves()`
   call — a doubling of `EPIC-004`'s hottest call — left all 45 tests green. So did two
   `zobristKey` reads. The catalog's "must be spied, not inferred" had no teeth in the repo.
   Closed with `src/gameend.nfr.test.ts`, one spied assertion and one mutant per bar.

Item 4 is the one with the longest reach: it protects an epic that does not exist yet.

## One correction landed on a bar rather than on code

The 3.78 µs NFR-001 ceiling is a **start-position** number and the catalog never said so.
`gameStatus(kiwipete)` measures ~5.3 µs on the **merged** tree as well as this one — so read as an
absolute ceiling the bar indicts the baseline, not this change. The catalog row now carries its
position. No target moved, and the ratio to the same position on the baseline tree (0.94–1.01x) is
the machine-independent quantity.

## Open, routed, and deliberately not closed here

- **FIDE 9.6.1 says "five *consecutive* alternate moves"; the ticket and the code use a plain
  5-count.** Recorded by QE as `UNKNOWN - verify` — it declined to assert a conformance gap from a
  remembered sentence, which is the correct refusal. Same error direction as G-1 at a rarer
  trigger, and **not decidable from a counts map at all**, since a map carries no ordering. This is
  a BA/PM ruling against the actual FIDE text, and it is the one open item inside the owner's
  standing priority. **It should be settled BEFORE the merge, not after** — if it is real it
  changes `src/gameend.ts` again, and a second change to the same module after merge is the
  expensive order.
- **`GameResult` is now referenced by nothing in `src/`.** The Engineer kept it under coding rule
  12 (flag, don't delete) rather than deleting a line the ratified shape spells out — correct. QE
  found the residual trap: it is a flat union matching neither arm, so `render(r: GameResult)`
  compiles and silently loses the claim. One-line close (`GameStatus["result"]`), Architect/Design's
  seam.
- **A5/A8's `Given` wording** is factually wrong about the locked wall (it unfreezes after its
  first capture; the clock resets three times). The criteria's **substance holds** — verified under
  ten drives — and both are now pinned by tests rather than by argument. Documentation only.

## What no agent did, and will not

**Nothing was merged and nothing was deployed.** `autonomy=pr`, and this repo has **no git remote
at all**, so no PR could be opened — the Engineer said so plainly rather than inventing a link,
which is the correct behaviour and is recorded here so the absence is not later read as an
oversight. The work is local on `grugops/ticket-to-pr-ABC-020`, stacked on
`grugops/epic-to-tickets-EPIC-002`, which is itself stacked on
`grugops/architecture-audit-2026-07-29` and unmerged.

**UAT is DEFERRED to `EPIC-006`, not passed** — the `ABC-004..007` precedent, for the same reason:
this ticket renders nothing and prompts for nothing, so no human can exercise it yet.

**Merge order remains load-bearing:** ABC-020 before `ABC-019` and `ABC-016`, whose acceptance
criteria were amended on 2026-07-31 to match it. Reverse the order and both amendments become
wrong, and today's deviation becomes an encoded assumption — the exact failure `ABC-011`'s
escalation trigger was written to prevent.
