---
id: 20260731T205000Z-software-engineer-artifact-ref-8d6e55e0
kind: artifact-ref
by: software-engineer
at: 2026-07-31T20:50:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-020
  - ABC-020
  - ABC-007
  - ABC-009
  - ABC-011
  - ABC-016
  - ABC-019
  - ABC-021
  - EPIC-001
  - EPIC-002
  - NFR-001
  - ADR-0002
  - ADR-0004
  - src/gameend.ts
  - src/gameend.test.ts
  - plans/tickets/ABC-020-claimable-draws-and-fide-96-backstops.md
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - 20260731T181000Z-architect-design-decision-f95614ca
  - 20260731T151500Z-qe-e2e-observation-36373ca4
  - 20260731T152200Z-qe-e2e-observation-1a02d912
  - 20260731T204500Z-software-engineer-decision-0efc6251
supersedes: 
---

# ABC-020 implemented — branch, diff, how each of A1–A10 was proved, and the measured numbers

Branch **`grugops/ticket-to-pr-ABC-020`** (never a protected branch). PR: **none — this repo has NO git remote** (`git remote` is empty), so there is nowhere to push and no PR to open. `gh` IS installed and authenticated (account `abitwise`), so the blocker is the missing remote, not the tool, and no PR link is invented here. The work is committed **locally** on `grugops/ticket-to-pr-ABC-020` (2 commits) — the same posture the ABC-004..007 stack has been in since 2026-07-24. **Nothing was merged and nothing was deployed; a human holds both.**

## The diff

| File | Change |
|---|---|
| `src/gameend.ts` | **+113 / −66.** Module header corrected; `EndReason` re-membered; new `ClaimableDraw`, `DrawClaims`; `GameStatus` split into the two ratified arms; three new constants (`SEVENTY_FIVE_MOVE_PLIES`, `THREEFOLD_OCCURRENCES`, `FIVEFOLD_OCCURRENCES`); `isInsufficientMaterial`'s doc corrected; the claim-set tail of `gameStatus` |
| `src/gameend.test.ts` | **17 tests → 39.** Five permitted edits, eleven new tests, three extracted helpers |

**No new module. No new import** — the import list is byte-for-byte the merged one (`./legal.ts`,
`./position.ts`, `./zobrist.ts`). **No new state on `Position`.** The `gameStatus` signature is
byte-identical: `positionCounts` stays second and stays optional, so `ADR-0002` clause 4's ruling as
an EXTENSION is what was built, not tested around.

## How each acceptance criterion was proved

| # | Proved by | Evidence |
|---|---|---|
| **A1** | `ABC-020 acceptance > A1` | The G1 FEN driven as the 8-ply move list `Kh1 Bb6 Kg1 Ba5 Kh1 Bb6 Kg1 Ba5`, counts recorded per ply. Third occurrence → `{result:"in-progress", reason:null, claimable:{by:"white", draws:["threefold-repetition"]}}`; `Re8` asserted still legal; `Re8` played → `{white-wins, checkmate}`. Driven as a move list, not a FEN, so the asymmetry (Black's move makes the occurrence, White holds the claim) is real |
| **A2** | `ABC-020 acceptance > A2` | `…w - - 100 60` → in-progress + `{by:"white", draws:["fifty-move"]}`; `Re8` played → `{white-wins, checkmate}` |
| **A3** | `ABC-007 acceptance > makes threefold repetition claimable at the third occurrence, and draws at the fifth` (permitted edit, line 27) | Knight cycle ×2 → 3 occurrences, claimable; ×3 → 4 occurrences, still claimable; ×4 → 5 occurrences → `{draw, fivefold-repetition}` |
| **A4** | `fifty-move rule` boundary block | 99 → in-progress, `claimable` explicitly `undefined`; 100 → claimable; **149 → claimable**; **150 → `{draw, seventy-five-move}`** |
| **A5** | `ABC-020 acceptance > A5` | The locked wall driven bare on the no-progress line; **terminal at exactly ply 150** with `seventy-five-move`, asserted as `expect(plies).toBe(150)`. Also discharges A8's second half. See the `decision` note for why the drive is the no-progress line and why it is bare |
| **A6** | `ABC-020 acceptance > A6` | `4Q2k/6pp/8/8/8/8/8/6K1 b - - 150 80` → `{white-wins, checkmate}`. The clock-100 half is the merged line-142 probe, **untouched** |
| **A7** | `ABC-020 acceptance > A7` **and** the clock-100 test (permitted edit, line 69) | Attribution asserted **both ways**: White claims at the third occurrence Black created; Black claims at clock 100 White reached. Mutation-checked — see below |
| **A8** | `ABC-020 acceptance > A8` + `A5` | Five occurrences with the counts map dropped → `{result:"in-progress", reason:null}`, nothing reported; and the bare wall still terminates at 150 on the clock backstop |
| **A9** | The suite itself, **measured** | See below |
| **A10** | Spy harness + benchmark | See below |

## A9 was measured, not asserted

The intermediate run matters more than the final one. After `src/gameend.ts` was rewritten and
**before** any existing test was touched, `npx vitest run src/gameend.test.ts` reported:

```
  Tests  4 failed | 25 passed (29)
    × ABC-007 acceptance > reports a draw by threefold repetition when a position occurs a third time
    × ABC-007 acceptance > reports a draw by the fifty-move rule when the halfmove clock reaches 100
    × fifty-move rule — the halfmove-clock boundary > draws at exactly 100 plies
    × fifty-move rule — the halfmove-clock boundary > still draws above 100 plies, as a position loaded from FEN can be
```

**Exactly four, and all four are named on the ticket** (lines 27, 69, 195, 199). The fifth named
test (line 191, "does not draw at 99 plies") stayed green on its old assertion and gained the
explicit `.claimable` absence assertion the ticket asks for. **No sixth test moved.** A name-set
diff against `HEAD` confirms it: four names removed, fifteen added, nothing else changed. The 18
whole-object `toEqual` assertions the design hop counted stayed green untouched — which holds
because and only because `claimable` is **absent** rather than `null` or `[]`.

`src/gameend.test.ts:142` ("prefers checkmate over the fifty-move rule when both could apply") is
byte-identical to `main`, as instructed.

## Two mutation checks — the assertions bite

A green suite proves nothing unless the tests fail when the code is wrong. Both mutations were
applied to `src/gameend.ts`, run, and reverted:

| Mutation | Failed |
|---|---|
| `by: "white"` unconditionally — **the exact defect being fixed**, an implementation that ignores whose turn it is | `A7 — flip the side to move…` and `makes the fifty-move draw claimable by the side to move…` |
| fivefold branch disabled | `makes threefold repetition claimable…and draws at the fifth` and `lets an automatic draw outrank a claim…` |

## Seven forbidden states are COMPILE errors, not test failures

Verified with this repo's own `tsc` under its exact flags (`strict`,
`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`), seven
`@ts-expect-error` negatives — a green run proves each negative is a *genuine* error:

`{result:"draw", reason:"threefold-repetition"}` · a terminal status carrying a claim · an
in-progress status carrying an end reason · `"fifty-move"` as an `EndReason` · `"checkmate"` as a
`ClaimableDraw` · a `DrawClaims` without `by` (A7 unrepresentable) · **any fourth `result` value**.
Also verified in the same run: a consumer needs **no narrowing** — `status.claimable?.draws ?? []`
typechecks on the bare union, which is what makes `ABC-016`'s panel cell a one-liner.

## A10 — NFR-001's three bars, MEASURED

**Machine: Apple M3, Node v24.12.0, darwin/arm64. `UNKNOWN - verify` on any other hardware.**
Harness ran in the session scratchpad **outside the repo**; nothing under `src/` was written by it.
Call counts were **spied, not inferred**: counters were injected into throwaway copies of
`legal.ts` and `zobrist.ts` only, with `gameend.ts` verified byte-identical to the branch (`cmp`).

**Bar 1 — `legalMoves` calls per `gameStatus`: EXACTLY 1.** Across ten call shapes (bare, empty
map, 3 occurrences, 5 occurrences, clock 100, clock 150, checkmate, stalemate, insufficient
material, the G1 repetition position) the count was `1` every time.

**Bar 2 — `zobristKey` calls per `gameStatus`: AT MOST 1.** Measured `1` on every path that reads
the counts map and **`0`** whenever the caller is bare *or* an earlier branch decides — including
`clock 150 → seventy-five-move`, which confirms the 150-ply test sits before the key read and a
75-move game pays for no Zobrist key at all.

**Bar 3 — cost within 1.5x of 2.52 µs (≤ 3.78 µs).** Mean over 200,000 iterations after a 50,000
warm-up, `gameStatus(startpos, emptyMap)` — the same quantity the published baseline names:

```
  standalone, this branch : 2.171 / 2.208 / 2.243 µs per call   (three runs)
  same process, merged vs this branch, three runs:
        merged 2.160  branch 2.171   ratio 1.005
        merged 2.148  branch 2.145   ratio 0.998
        merged 2.154  branch 2.132   ratio 0.990
```

**0.86–0.89x of the 2.52 µs baseline, against a 1.5x bar** — and 0.99–1.01x of merged code
measured in the same process, i.e. no measurable cost. The added work is four integer comparisons,
as the design hop predicted. A separate standalone run of merged `src/` measured **2.440 µs**,
consistent with the published 2.52 µs on the same machine class.

**No per-call allocation was added to the common path.** State (c) returns exactly the object
merged code returns; only a genuinely claimable position allocates the `DrawClaims` and its array.

## Gate results — all green, run on this branch

| Gate | Command | Result |
|---|---|---|
| unit | `npm test` | **165 passed / 7 files** (was 143) |
| test integrity | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0 skipped** |
| lint | `npm run lint` | **exit 0** (2 pre-existing biome config-migration *infos*, not introduced here) |
| typecheck | `npm run typecheck` | **exit 0** |
| build | `npm run build` | **exit 0** |
| coverage | `npx vitest run --coverage.enabled` | **`src/gameend.ts` 100% stmt / branch / func / line**, threshold 0.8 |

No self-fix attempt was spent: the only red after the implementation landed was the four named
tests, which is the expected specification change, not a failure to fix.

## What is NOT in this change, and where it went instead

- `ABC-009` and `ABC-011` — **carried, not owned**, both separately ticketed.
- FIDE 5.2.2 dead-position detection — declined; the header wording correction is the whole
  response, per QE's G-3.
- Terminal-check re-ordering — not done; R-4's ordering is load-bearing and A6 now pins it at 150.
- The claim *interaction* — `ABC-021`. `EndReason` gains no `*-claimed` member, so `ABC-021`'s
  "without `src/gameend.ts` being changed by this ticket" is satisfied as the design hop intended.
- `GameResult` is now unreferenced anywhere in `src/` — **flagged, kept, not deleted**; reasoning in
  the `decision` note.

## Provenance

Written directly into `notes/`; this install has **no `scripts/context-io.ts` and no
`mcp__grugops__propose_note` tool**, the same degradation QE and Architect/Design each recorded on
2026-07-31. This is an `artifact-ref` — a pointer kind with an empty `verified_by` — so no admission
stamp was required and none was bypassed. **No `finding` was recorded or attempted: there is no §14
gate in this task to stamp one, and nothing here is self-stamped.** Every number above was produced
by a command that was run; the harnesses are throwaway and every result that matters is transcribed
here with the command that produced it.
