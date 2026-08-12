---
id: 20260812T181000Z-ba-pm-observation-i-re-verified-five-dor-scores-and-three-of-them-moved-6b2d5f81
kind: observation
by: ba-pm
at: 2026-08-12T18:10:00Z
verified_by:
confidence: high
refs:
  - ABC-010
  - ABC-021
  - ABC-024
  - ABC-026
  - ABC-030
  - src/fen.ts
  - src/moves.ts
  - src/history.ts
  - src/status-panel.ts
  - src/history-pane.ts
  - src/san.nfr.test.ts
supersedes:
---

# I re-verified all five standing `Backlog` DoR scores against the checklist rather than repeating them, and **three of the five moved** — one up, two down, and the one that went down hardest is the one the board treats as the safest

> **Hand-authored, no stamp.** No `scripts/context-io.ts`, no `mcp__grugops__propose_note`,
> `human_admission` `off`, no `§14-gate` verdict under this task — so **no `finding` on this hop**.
> `confidence: high` refers to the measurements below; every one was run at the source on `main` at
> `43d5a9d`, not read off a board row. **I wrote no code and ran no test.**

## The scoreboard, before and after

```
ticket    board says   I score    what moved
ABC-010   10/10 (own)   9/10   DOWN  its module-map premise is stale: fen.ts has FOUR production
                                     importers, not one, and TWO of them call parseFen PER FRAME
ABC-021   10/10 (own)  10/10   HELD  and its blocked-until is now FULLY discharged (the SIXTH stale
                                     reference on this board)
ABC-024    8/10         9/10   UP    both 2026-08-10 warnings discharged by ABC-023's merge; ONE NEW
                                     warning opens, and it is not the one the ticket predicted
ABC-026    9/10        10/10   UP    I wrote the one open item (the acceptance criteria) this hop
ABC-030   10/10        10/10   HELD  re-verified; one live clause corrected in passing
```

## `ABC-010` — 10/10 → **9/10**, and the reason is a measurement its own argument rests on

The page says *"`src/fen.ts` has exactly **one** production consumer (`perft-bench.ts`)"*, *"`parseFen`
has no user-facing caller"* and *"`NFR-001` is not at risk: `fen.ts` … is not on the search hot path"*.
**Measured 2026-08-12:**

```
production (non-test) importers of src/fen.ts:  FOUR
  src/perft-bench.ts   :63 :71 :84
  src/history.ts       :58  :74  :117    <- :117 is inside keyHistory(), used by repetitionCounts,
                                            used by gameStatusOf, called by the loop ONCE PER PLY
  src/status-panel.ts  :156                 <- ONCE PER FRAME
  src/history-pane.ts  :121                 <- ONCE PER FRAME
```

`ABC-012`, `ABC-016` and `ABC-017` put it there, each legitimately — `ADR-0002`'s derive-don't-maintain
rule makes replay-from-`initialFen` the correct shape, and replay begins with a `parseFen`.

**The DoR consequence is item 6 (security/NFR triggers, each with a measurable target).** The trigger
set names `NFR-003` and `NFR-001` and **does not mention `NFR-002` at all** — the < 16 ms render bar,
now reachable **twice per frame**. And the stated bar is the wrong size in the new context:
*"adds < 1 ms per call"* was set against a module with one consumer on no hot path; **two calls at 1 ms
is 12.5% of the whole frame budget.** The bar needs re-deriving against `NFR-002`, not re-typing.

**What did NOT move:** the acceptance criteria (every FEN and every expected `FenError` is a property
of `parseFen` alone), and the `P1` rather than `P0` argument — none of the four callers feeds
`parseFen` a **user-supplied** string; all three new ones pass `history.initialFen`, which the product
produced itself. So the defect stays latent until `EPIC-003` accepts a FEN from a human, exactly as
written.

**This cost `ABC-010` its promotion, and I record that plainly** because its own closing line —
*"this must be `Ready` before `EPIC-003` is decomposed"* — fired at this hop and I assessed it rather
than deferring. The repair is one short BA/PM pass with Architect/Design input and it is cheaper than
discovering it inside `EPIC-003`.

## `ABC-021` — **10/10 held**, and the board carries the SIXTH stale `blocked-until`

- **`ABC-020`** merged 2026-08-02; that half was already recorded discharged on 2026-08-11.
- **`ABC-019` is MERGED and in `Done`.** `src/turn-loop.ts` exists on `main` at `43d5a9d` exporting
  `InputSeam`, `PromptOutcome`, `TerminalReason` and `runTurnLoop`. **The board row still reads
  `blocked-until: ABC-019 only`.**

That row was corrected on 2026-08-11 and was accurate that day; `ABC-019` landed after it. **This is
the sixth stale `blocked-until` reference on this board, and the mechanism is structural rather than
careless: the row is corrected when the blocker is CHECKED, not when the blocker MERGES.** A row that
records a dependency is a cache with no invalidation.

**Two corrections the board flagged at `refinement-ABC-019` and recorded as "not taken" are TAKEN at
this hop**, both re-derived at the source rather than transcribed:

1. **The citation.** The ticket said `src/gameend.test.ts:27-58`. **Measured: `knightCycles` runs from
   its doc comment at line 26 to its closing brace at line 50.** `27-58` starts one line inside the
   comment and runs eight lines past the function, into `describe("ABC-007 acceptance")`. Corrected to
   `26-50`.
2. **The transition boundary.** The ticket calls its addition *"a fifth prompt outcome"*. **Merged
   `PromptOutcome` already has six arms** (`src/turn-loop.ts:118-124`), and `ABC-019` owns **only that
   the transition exists** — it says so in merged code at `:114-116`. This ticket owns **transition
   16**: driving `game-over` from `awaiting-human` **with a claimed reason**. **No size change**, and
   the re-sizing condition the ticket named is **discharged** — `TerminalReason` shipped as a union
   and admits reasons additively.

## `ABC-024` — 8/10 → **9/10**, and it went stale by the mechanism it did NOT predict

Both 2026-08-10 warnings (INVEST independence; the open ordering dependency) are **discharged** by
`ABC-023`'s merge. **One new warning opens, on item 4:**

```
                       at the cut (2026-08-10)                measured 2026-08-12 on 43d5a9d
src/moves.ts md5       6335b452fc21ffe2d0f902ecab930840       6335b452fc21ffe2d0f902ecab930840  UNCHANGED
default suite          625 tests on 18 files                  807 tests on 28 files             +182 / +10
```

- **`A4` carries a stale number inside a CRITERION, not only inside evidence** — *"the full suite is
  green (**625** before this ticket's rows, plus them)"*. It is 807. One clause fix.
- **The seven survivor verdicts are `UNKNOWN - verify` at 807 on 28 files.** Ten test files landed
  since; at least four (`san.test.ts`, `san.nfr.test.ts`, `san.qualifier.hardening.test.ts`,
  `san.suffix.hardening.test.ts`) drive `toSan` over generated legal move lists, and
  `turn-loop.test.ts` drives `legalMoves` through a whole game. Any of them could have acquired a
  catcher for a castling mutant that survived August's 18-file lane.

**THE LESSON.** The ticket warns that *"any ticket that changes `src/moves.ts` invalidates every verdict
here"*. **`src/moves.ts` did not change — the hash is byte-identical four merges later — and the ticket
went stale anyway, because the LANE grew around it.** A mutant's survival is a property of the whole
suite, not of the file the mutant sits in. Its own rule — *every parenthetical names the suite size it
was measured against* — is the only reason this is visible at all.

**Both escalation triggers re-checked at the source: BOTH still NOT FIRED.** No ticket proposes to
change `addCastlingMoves`, the `CastleOption` tables or the castling right test (the eight new
`EPIC-003` tickets each forbid touching `src/moves.ts`), and `src/perft.test.ts` was last touched at
`a517ff7`, 2026-07-24. **One thing around trigger 2 changed and it raises the stakes rather than the
priority:** three new tickets (`ABC-031` `A5`, `ABC-032` `A1`, `ABC-034` `A2`) now run property tests
**over that same six-position table**, read-only. The table carries more load than it did.

## `ABC-026` — 9/10 → **10/10**. I wrote the open item, and its priority trigger has FIRED

The one open item was **the acceptance criteria, and they were mine.** Written this hop as `A1`–`A6`:
the lane total measured to `NFR-008`'s own protocol (which discharges `H5`), the headroom reported in
**FILES** rather than percent, `N8-LANE` inheritance asserted as a quantifier **over the backlog**,
`pool: "threads"` adopted-or-refused with its ≥ 20-consecutive-green-run screen, the isolation warning
placed, and `src/` byte-identical.

**The `P2 → P1` trigger fired, three-for-two:**

```
test files under src/ at the cut (2026-08-10)   22
test files under src/ measured 2026-08-12       28

tickets that each added a test file since — THREE, and the trigger needed TWO:
  ABC-016  695a2e7   status-panel.test.ts + status-panel.nfr.test.ts
  ABC-017  09d4515   history-pane.test.ts + history-pane.nfr.test.ts
  ABC-019  d83a7e4   turn-loop.test.ts    + turn-loop.nfr.test.ts
```

The other half of the trigger (*the lane passes 3 s*) is **NOT fired** — 1.59 s wall on the
Orchestrator's single run, quoted as a single run and not a median. **Raised to `P1`.**

**A collision nobody had noticed, ruled here.** `ABC-026` § What remains 1(c) says the isolation
dependence should be recorded *"where the next engineer will read it"* — and the tempting answer is
the four `*.nfr.test.ts` files. **`ABC-030` is rewriting the justification comment in all four of those
exact files** and its `## Dependencies` says *"do not run concurrently with any hop live in one of the
four"*. Two `Backlog` tickets editing the same four comment blocks. **Ruled: the warning goes in the
runner configuration the change would be made in (`vitest.config.ts` — verified 2026-08-12, no such
file exists today) and in `ADR-0008`. Not in the four test files.** It is also the better placement on
its own merits: the engineer who disarms these guards is editing the config, not reading a test file.

## `ABC-030` — **10/10 held**, and one live clause corrected in passing

Re-verified all four cited comment sites still exist and still say what the ticket says
(`/usr/bin/grep -nE 'all [0-9]+ tests there|the [0-9]+ rows in' src/*.ts` returns exactly the four
lines the ticket names, exit 0 — i.e. its `A1`/`A2` greps are correctly RED today).

**One clause corrected.** The firing threshold read *"any production line at all, or any new file"*,
**unscoped**, and `ABC-028`'s final gate measured that the unscoped clause **fires on 33 non-source
files** — context notes, queue records, board-history archives — every one of which a normal hop
writes. Now reads *"any new file **under `src/`**"*. **`ABC-028` is in `Done` and was NOT re-opened**:
that gate routed the item to BA/PM against `ABC-028`'s page, and the two false sentences there stand
as a closed record while the correction lands where the clause is still live.
