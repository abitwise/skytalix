---
id: 20260813T121000Z-qe-e2e-observation-eight-criteria-seventeen-mutants-and-the-two-that-survived-9f4c2e13
kind: observation
by: qe-e2e
at: 2026-08-13T12:10:00Z
verified_by:
confidence: high
refs:
  - ABC-021
  - ABC-019
  - ABC-020
  - ABC-035
  - NFR-002
  - src/turn-loop.ts
  - src/turn-loop.test.ts
  - src/turn-loop.nfr.test.ts
  - plans/tickets/ABC-021-draw-claim-interaction.md
supersedes:
---

# Eight criteria, seventeen named mutants, and the two that survived the delivered suite

> **Hand-authored.** Not a `finding` — see the protocol paragraph in this hop's gate note. Every
> verdict below was RUN: each mutant is applied to a tree pinned by md5, the **full** suite is run,
> the verdict is read off the JSON reporter, and the tree is restored in a `finally`. The generator
> is quoted in the `artifact-ref` note and is **outside the repository**.

## The eight criteria, each with a named wrong build and a measured verdict

The ticket's `## Acceptance` is eight bullets; the suite's `describe("ABC-021 acceptance")` is seven
rows plus the untouched `turn-loop.nfr.test.ts`. **All eight criteria are MET.** The table is what
each is worth against a build that tries to satisfy it wrongly.

| # | ticket criterion | row | the plausible WRONG build | verdict | what killed it |
|---|---|---|---|---|---|
| 1 | claim at `ABC-020` `A1` → claimed threefold, final frame, exit 0 | `A1` | **M4** — the allowed claim renders one more frame before returning | **CAUGHT** | `A1` alone: `frames` 10 ≠ 9 |
| 1 | " | " | **M3** — `claimable` defaulted, so every claim is allowed | **CAUGHT** | `A3` alone (NOT `A1` — `A1`'s claim really is available) |
| 2 | `Re8` instead → `white-wins`/`checkmate`, no draw at any point | `A2` | **M5** — the loop claims by itself whenever `claimable` is present | **CAUGHT**, and by `tsc` too | 11 tests incl. `A2`, `A4`, `A5`, and four `ABC-019` rows |
| 3 | nothing claimable → no ply, byte-identical FEN, no re-evaluation, teaching message, prompt re-issued | `A3` | **M6** — a bare `"cannot claim"` | **CAUGHT** | `A3` |
| 3 | " | " | **M7** — `THREEFOLD_OCCURRENCES` drifts 3 → 4 | **CAUGHT** | `A3` (`repetition 1 of 4`) |
| 3 | " | " | **M8** — the occurrence count excludes the current position | **CAUGHT** | `A3` (`repetition 0 of 3`) |
| 3 | " | " | **M9** — the refusal re-evaluates `gameStatusOf` before `continue` | **CAUGHT** | `A3`: `derivesMade()` 2 ≠ 1 |
| 3 | " | " | **M10** — the refusal exits instead of re-prompting | **CAUGHT** | `A3`: `events` `["frame","input"]` |
| 4 | engine has the move with a claim available → plays, never claims | `A4` | **M11** — the engine branch claims for itself | **CAUGHT** | 4 tests incl. `A4`, `A5` |
| 5 | fifth occurrence, nobody claims → automatic fivefold, exit 0 | `A5` | **M11** (same build) | **CAUGHT** | `A5` `{draw, fivefold-repetition}` never reached |
| 6 | availability in the frame, off the SINGLE `gameStatusOf` that ply | `A6` | **M12** — a second `gameStatusOf` on the frame path | **CAUGHT** | 11 tests, incl. **all four** `turn-loop.nfr.test.ts` rows |
| 7 | type admits both claimed reasons + `resignation` + the automatic ones, `gameend.ts` unchanged | `A7`+`A14` | **M13** — `draws[draws.length - 1]` | **CAUGHT** | `A7` alone |
| 8 | `ABC-019`'s per-ply overhead bar still holds | nfr file | **M2** — `keyHistory(history)` once per ADVANCING ply | **SURVIVED** 814/814 | nothing — see the derive note |
| — | the ticket's own boundary: the LOOP adjudicates, not the seam | — | **M1** — the seam derives `gameStatusOf` and returns `game-over`; the loop's arm removed | **CAUGHT** | `A3`'s `derivesMade()===1`, **one assertion in one test** |
| — | " | — | **M16** — the same, but the seam adjudicates via `keyHistory` and never calls `gameStatus` | **SURVIVED** 814/814 | nothing — see the derive note |
| — | the `ABC-035` hazard: a parser that asks availability every prompt | — | **M17** — the stub seam calls `gameStatusOf` on every prompt | **CAUGHT** | 7 tests, **4 of them `ABC-019`'s own** |
| — | the guard the Engineer declined to write | — | **M14** — `claimable.by` overwritten to the wrong side | **SURVIVED**, and correctly | — |

## The three survivors, told apart

**M14 is not a gap and I say so rather than counting it.** The loop never reads `claimable.by`, so
overwriting it can change nothing, which is precisely the Engineer's argument (`gameend.ts:51-52`,
AGENTS.md rule 8: a guard on a state the machine cannot reach). **The mutant surviving is the
evidence FOR his decision, not against it.** I probed the reachability directly rather than trusting
the type: driving the shuffle 40 plies, `claimable` was present in **8** states and **0** of them had
an empty `draws` — so the `as ClaimableDraw` cast at `turn-loop.ts:340` is safe on the reachable
domain, and the `by` field is the side to move in every one.

**M2 and M16 are the real ones**, and they are the same hole seen from two sides. They have their own
note.

## What `A3` is carrying, and it is more than its own criterion

**Seven of the seventeen mutants die at `A3` and at nothing else** — M1, M3, M6, M7, M8, M9, M10.
Two of those are not criterion-3 builds at all: **M3** (every claim allowed) is a criterion-1 defect
and **M1** (the seam adjudicates) is a boundary defect, and criterion 1's own row is green under both.
`A3` is the load-bearing row of this ticket, and a single clause inside it — `expect(derivesMade())
.toBe(1)` — is the only thing in the delivered suite standing between this ticket and a seam that
decides claims for itself. **That is not a defect; it is where the weight sits, and the next hop
should know it before it "simplifies" that row.**

## Termination and the sixteenth transition — seven paths driven, no uncovered state, no double-terminate

Driven through the real `runTurnLoop` with my own seams, outside the repository:

| probe | what it drives | result |
|---|---|---|
| `T1` | `claim` × 5 in an unclaimable position | 6 frames (`1 + 5` re-emits), 0 plies, **`toFen` byte-identical**, clean `eof` exit `{null, null, 0}` |
| `T2` | refuse, then play a legal move | the refusal message appears in exactly **one** frame and is gone from the next |
| `T3` | the human is **BLACK** and holds the claim on its own ply | `{draw, threefold-repetition, 0}` at 8 plies — **correct, and covered by no acceptance row** |
| `T4` | `claim` twice where it IS available | terminates on the first; the second token is never read. **No double-terminate** |
| `T5` | mate, then a `claim` token | the token is never read at all — the exit test sits between render and act, so `game-over` precedes the prompt **structurally** |
| `T6` | refuse at 2 occurrences, shuffle one more cycle, claim | `{draw, threefold-repetition, 0}`; message region clears between |
| `T7` | is `claimable` with an EMPTY `draws` reachable? | 8 claimable states over 40 plies, **0** empty |

**No path leaves the loop in a state neither arm covers.** The outcome union has seven arms and the
loop handles all seven: `eof`, `game-over` and `claim` explicitly, `rejected`/`ambiguous`/`command`
through the `!== "move"` catch-all, `move` last — and `tsc` proves the narrowing is total, because
the catch-all reads `outcome.messages`, which only the three message-carrying arms have.

**One honest observation, not a defect.** A seam that returns `{kind: "claim"}` forever in an
unclaimable position loops forever — but so does one that returns `rejected` forever, which is
`ABC-019`'s shipped behaviour. What is NEW is that each iteration of the claim version pays an
`O(plies)` `keyHistory` replay: this is the first unbounded path in the loop that derives. At the
real prompt it is one replay per human keypress-and-enter, ~46-50 µs against `NFR-003`'s 50 ms
budget — 0.1 %. Named because it is new, not because it is a problem.

## Coverage, honestly

`src/turn-loop.ts` reaches **100 % on all four v8 counters** under `turn-loop.test.ts` +
`turn-loop.nfr.test.ts`, against `quality.coverage_threshold` `0.8` (not enforced in `lean` mode).

**And I measured what the ticket's own rows are worth rather than inferring it.** With
`describe("ABC-021 acceptance")` skipped, the module reads **81.11 % stmts / 97.22 % branch / 75 %
funcs**, uncovered at **`234-244`** (`claimShortfall`) and **`335-341`** (the claim arm) — *exactly*
the ticket's own lines and nothing else. So the seven rows cover the whole of what the ticket added
and nothing it did not, which is the right shape and is now a measurement instead of a claim.

**One inherited line map is stale and I correct it rather than repeat it.** `ABC-019`'s gate recorded
`:240-241` — the prompt-driven `game-over` return — as its only uncovered lines. On this tip that
return is at **`:316-318`** and it is covered **without** any `ABC-021` row (by `A8b`, an `ABC-019`
row added at the `a10b` hop). **`ABC-021` did not close that hole and I do not claim it for this
ticket.**
