---
id: 20260811T110000Z-ba-pm-artifact-ref-9d2e60f5
kind: artifact-ref
by: ba-pm
at: 2026-08-11T11:00:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - plans/tickets/ABC-016-status-panel.md
supersedes:
---

# What `refinement-ABC-016-a13` produced, by reference — and the board move it REQUESTS

> **Hand-authored** — see this hop's decision note for why. **Nothing here is a `finding`.**

## Branch and files

Worktree `../cli-chess-ABC-016`, branch `grugops/ABC-016-status-panel`, **0 commits behind `main`**
(re-checked, not taken on trust). Nothing pushed — this repo has no git remote. **Nothing merged,
nothing deployed.**

| file | change |
|---|---|
| `plans/tickets/ABC-016-status-panel.md` | the only content file changed: `A13`'s `isInCheck` clause replaced, `A2` gains the played-check case, 2 `## Test notes` added, `## Security / NFR triggers` clarified, 2 `## Dependencies` flags struck as discharged, 1 new flag, size/priority re-derived, DoR re-derived a third time |
| `.grugops/queue/claimed/refinement-ABC-016-a13/` | the Workflow 17 claim: `pending/` → `claimed/`, plus the now-running registry record |
| `.grugops/context/refinement-ABC-016-a13/notes/` | 4 hand-authored notes — this one, a `decision`, an `observation`, a `claim` |

**No `src/` byte written. No `plans/board.md` byte written. No ticket front matter written.**

Commits were made with an explicit `git commit -- <paths>` pathspec and `git status` was read before
and after each, because `git commit` takes the **INDEX** and this project has a recorded defect
(`2cd84cd`) where that swept ~640 lines of another role's in-flight work into one commit.

## The measurement harness, out of tree and deleted

Four throwaway probe files under a `probe/` directory at the **worktree root — never under `src/`**,
run with `npx vitest run probe/<file>`, then **deleted**; `git status` was read after the delete and
showed no trace. They measured: the spied `isInCheck` totals per history shape (including the
bare-`toSan`-alone baseline the engineer's test does not print), the 14-case plies/in-check/captures
matrix, the live-vs-replay discriminator at the proposed `A2` case, and the panel's widest row in two
states. **No wall-clock assertion was involved and none entered the suite** — this project's standing
rule (`src/zobrist.nfr.test.ts:112`).

## Gates, re-run by me in the worktree

| gate | result |
|---|---|
| `npm run lint` | exit **0** |
| `npm run typecheck` | exit **0** |
| `npm run build` | exit **0** |
| `npm test` | **707/707**, 24 test files |
| skip count | **0** |

Unchanged by this hop — it writes no code. **These are an observation, not a gate verdict**; the §14
gate is the authority and no `§14-gate#<id>` stamp is issuable to me.

## The board move I am REQUESTING, not making

**`ABC-016`: `In Review` → `In Development`.** In Review 1/3 → **0/3**, In Development 1/3 → **2/3**
(`ABC-019` and `ABC-016`). No WIP limit approached, no override needed.

**A backward move, and a legitimate one.** `A13` is now **met on delivered code** — that half cost
nothing. `A2`'s new case is **unwritten**, and an acceptance criterion with no test behind it is not
met, so the ticket is not ready for review. This board has moved backward before and was right to
(`ABC-009`, `Ready for UAT` → `In Review`); the reason it is right here is that leaving the ticket in
`In Review` would have QE build a mutant net over a criteria set that is knowingly one case short,
which is the same waste that held QE back for this ruling in the first place.

**The dev hop is small and its shape is known**: one `CASES` entry, one assertion block of roughly a
dozen lines in `src/status-panel.test.ts`, and a regenerated snapshot file. **No production line
changes** — the delivered panel already renders the case correctly, measured. `src/status-panel.ts`
and `src/status-panel.nfr.test.ts` should come back **untouched**.

**Then QE, on the same branch, against the amended criteria** — which is what holding it back was
for.

## Suggested board row text, for the Orchestrator to take or leave

> **`A13` RULED AND AMENDED; a SECOND acceptance defect found; `In Review` → `In Development`
> 2026-08-11 by the Orchestrator at BA/PM's request (task `refinement-ABC-016-a13`).** `A13`'s
> `isInCheck` clause was unsatisfiable by any correct build (`toSan`'s `suffix()` calls `isInCheck`
> at `src/san.ts:104`; totals re-spied out of tree at **1 empty / 2 thereafter**, and a checking or
> mating last move adds no third because `legalMoves` never calls `isInCheck`). **REPLACED with two
> halves that name no other module's count** — direct on an empty history, by difference against a
> bare-`toSan` baseline thereafter — rather than with *"1 empty, 2 thereafter"*, which would make this
> ticket restate a number `src/san.ts` owns, the same fault `ADR-0009` cl. 1 names and that `A11`'s
> `frameHeight(...) is 23` clause was struck for the same day. **`A13` now MET on delivered code, zero
> production lines** — both halves are already asserted at `src/status-panel.nfr.test.ts:130-132` and
> `:140-149`. **`D19b`, found by checking the criteria `A13` was not about: measured over all 14
> cases, every in-check case has an EMPTY move list and every played case is quiet and capture-free**,
> so a build reading the check indicator or the material balance from item 4's REPLAY position passes
> every criterion as they stood; `A2` gains the played check `1.e4 e5 2.Qh5 g6 3.Qxe5+` (3 legal
> replies, in progress; replay position is White-to-move and not in check — measured), the only
> capture on the ticket. **That case is unwritten, which is why the ticket goes back**; the panel
> already renders it correctly. **Size `M` / priority `P1` re-derived a fourth time, both unmoved, NOT
> `XL`.** Two carried flags verified DISCHARGED and struck (`ABC-019`'s owed render-seam line landed
> at `ABC-019:219-228`; `blocked-until` already corrected). **NEW FLAG, owner Architect/Design:** the
> panel's widest row is **17** quiet against **67** with both claims — a 50-column swing — while
> `src/frame.ts:179` makes it the frame's `W` and `\x1b[0J` cannot clear to the right of a row, so a
> narrowing frame leaves stale columns; `ABC-017` already carries a constant-width criterion for a
> 3-column swing. Not blocking (nothing loops a frame until `ABC-019`), **decision owed before
> `ABC-019` merges**. **QE next, on this branch, against the amended criteria.** Nothing merged,
> nothing deployed.
