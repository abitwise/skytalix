---
id: 20261010T084259Z-software-engineer-observation-abc051-reverify-premise-moved-ac73a414
kind: observation
by: software-engineer
at: 2026-10-10T08:42:59Z
verified_by: 
confidence: high
refs:
  - ABC-051
  - ABC-019
  - ABC-021
  - ABC-120
  - ADR-0021
  - NFR-002
  - src/turn-loop.ts
  - src/turn-loop.nfr.test.ts
  - src/turn-loop.test.ts
  - src/history.ts
  - plans/tickets/ABC-051-turn-loop-records-false-and-per-ply-bar-blind.md
  - memory-bank/50-decisions/ADR-0021-the-turn-loop-gains-quit-and-take-back-arms.md
  - .grugops/queue/claimed/ticket-to-pr-ABC-051/ticket-to-pr-ABC-051.md
supersedes: 
---

# `ABC-051` re-verification: site 2's premise moved under accepted `ADR-0021` — STOPPED before code

Hand-authored, no seal (degraded posture, `AGENTS.md`). Subtask `ticket-to-pr-ABC-051`, branch
`grugops/ABC-051-turn-loop-records` from `b9e94d8`. Read against the tree at `b9e94d8`
(`src/turn-loop.ts` md5 `0b0687a1bb533f0db5e8629f7d0590a0`, `src/turn-loop.nfr.test.ts` md5
`d48a0eb3a53a14e55972418614b8bdf2`). The page's DoR dates from 2026-08-13; `src/turn-loop.ts` has
since taken `d8e7ccc` (`ABC-120`, `ADR-0021` transitions 17 and 18).

## Per site

| # | page site | now | verdict |
|---|---|---|---|
| 1 | `src/turn-loop.ts:105` "FOUR of these do not advance" | `:105` reads "SEVEN of these do not advance a ply — `rejected`, `ambiguous`, `command`, `claim`, `eof`, `quit` and `take-back`". Seven matches the union (`:135-144`) under the page's own convention (`move` advances, `game-over` terminates). The grep phrase `FOUR of these do not advance` has zero hits. | **already true** (rewritten by `ABC-120`) |
| 2 | `src/turn-loop.ts:247` "Eight states and sixteen transitions" | **moved to `:268`**: "Eight states and eighteen transitions; the sixteenth … `ABC-021`'s, and the seventeenth and eighteenth … `ADR-0021`'s". Still a bare number with no rule beside it. | **moved, and the page's repair no longer applies** (see below) |
| 3 | `src/turn-loop.nfr.test.ts:23` "`repetitionCounts` at 0 proves the loop derives nothing on its own" | unchanged, same line | **still false** |
| 4 | `src/turn-loop.nfr.test.ts:131` "The loop derives nothing on its own" | unchanged, same line | **still false** |
| 5 | `src/turn-loop.nfr.test.ts:136` test name "derives ZERO times on a non-advancing prompt outcome" | unchanged, same line; drives `rejected` only | **still false** |
| 6 | `src/turn-loop.nfr.test.ts:40-43` mock wraps `repetitionCounts` only | unchanged | **still a hole, measured below** |

Cited lines that moved: `claimShortfall` `:234` → `:255`, `PromptOutcome` `:125` → `:135`, "FIVE
outcomes" `:255` → `:278` (now "SEVEN"), "THREE-of-FOUR" `:259` → `:287`. `src/history.ts`:
`keyHistory` `:116`, `repetitionCounts` `:136`, `gameStatusOf` `:151-153` (`gameStatus` call on
`:152`, still true as cited in the NFR header).

## Why site 2 stops the build

The page's repair is *"arithmetic, not judgement"* (Test note 5): `ABC-019`'s 15 by-trigger rows,
plus `ABC-021`'s **two** edges (allowed claim → `game-over`, refused claim → `rendering`, "its own
trigger") = **17**.

Since then, `ADR-0021` (**accepted**) clause 5 ratified **"Transitions go 16 → 18"**, numbering
`quit` **17** and `take-back` **18**. Its clause 3 takes 16 from "`ABC-019` (15) plus `ABC-021`'s
transition 16 (`claim`), and the docblock at `:247` says so", which is the stale sentence this page
calls false. The same ADR names the refused claim as an unnumbered sibling: "a non-MUTATING outcome
(7, 8, 9 and the refused claim)". The code and the merged tests now cite 17 and 18 by number
(`src/turn-loop.ts:116`, `:173`, `:192`, `:277`, `:346`, `:378`, `:432`).

So today the page's rule and the accepted ADR give different counts:

- **(a) The page's rule** (the refused claim is its own row): 15 + 2 + 2 = **19**. This contradicts
  `ADR-0021` clause 5's enumeration and either renumbers 17/18 or adds an unnumbered nineteenth. An
  accepted ADR is Architect/Design's to amend.
- **(b) The ADR's enumeration**: keep **18** and write the rule beside it. This contradicts the
  page's Problem row 2 and Test note 5, which say the refused claim is a separate trigger. Then the
  page's "why it is false" would no longer hold, and only the bare-number half of A3 would be left.

Picking (a) or (b) is the judgement the page says this repair does not need. The task file says:
"If any criterion's premise no longer holds … STOP — BA/PM re-scores; do not reinterpret the
page." **No code was written.**

## Site 6 measured: `M2` against the current tree

`M2` = `keyHistory(history);` inserted before the advancing tail's `status = gameStatusOf(history);`
(`src/turn-loop.ts`, end of `runTurnLoop`). The runner pinned `src/turn-loop.ts` by md5 and threw on
mismatch. It restored from a pristine copy in a `finally` and re-checked the md5 afterwards
(restored `0b0687a1…`, both runs; worktree clean afterwards). Mutant md5
`276de6e0bf1e115a6d29820c37ce54f5`. Apple M3 (arm64), Node v26.11.0.

- `npx vitest run src/turn-loop.nfr.test.ts` → **exit 0, 4/4 passed**. The NFR file is **still
  blind** to the second replay on every ply, so A1's premise holds.
- `npx vitest run src/turn-loop.test.ts` → **exit 1, 1 failed | 62 passed**:
  `ABC-021 acceptance — transition 16, the draw claim > A8 — the ONE derive the loop makes on its
  own, ledgered` → `expected "keyHistory" to be called +0 times, but got 8 times`. The merged `A8`
  row still catches M2, as the page says.

## Secondary, for the re-score (not a stop on its own)

`A2` asks the NFR file to assert `keyHistory` **1** on one refusal and **2** on two. Merged
`src/turn-loop.test.ts:1813-1846` (`A8` (ii)/(iii)) already asserts exactly those counts. The page's
Out of scope says it "does not touch, **duplicate**" the `A8` rows. As written, `A2` duplicates
`A8` (ii)/(iii) in a second file. That may be intended, since the bar's own file must count its
own spy, but the re-score should say so.

## Draft AGENTS.md line

None. No command changed.
