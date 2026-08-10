---
id: 20260810T203014Z-architect-design-decision-2dfba7e3
kind: decision
by: architect-design
at: 2026-08-10T20:30:14Z
verified_by: 
confidence: high
refs:
  - ABC-026
  - ABC-025
  - ABC-024
  - ABC-016
  - ABC-017
  - EPIC-003
  - N5
  - N8-LANE
  - NFR-002
  - NFR-008
  - ADR-0008
  - plans/nfr-catalog.md
  - plans/traceability.md
  - plans/tickets/ABC-026-default-lane-cumulative-budget.md
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - memory-bank/50-decisions/ADR-0008-default-test-lane-budget.md
supersedes: 
---

# The rulings: **the lane has a total (`NFR-008`), the per-ticket bar is `N5` with ONE clause changed — its denominator — and `ABC-017`'s `NFR-002` flag was already stale when it was written**

Numbers are in the `observation` note beside this one and are not repeated. This note is the
rulings, what I changed, and what I refused to do.

```
NFR-008        npm test, PERFT_DEEP unset:  <= 3 s WALL  AND  <= 13 s CPU (user+sys),
               medians of >= 7 interleaved runs, reference machine named, UNKNOWN - verify else.
               TODAY 1.565-1.765 s / 7.205-7.640 s = 52-59% of the wall clause. MET, and it BINDS.
               LEVEL is PROVISIONAL, ratifier Olger Oeselg via the Orchestrator. SHAPE is not.
N8-LANE        the standing per-ticket bar: <= 5% of the TOTAL, not of the current lane.
               = BA/PM's re-derived N5 with EXACTLY ONE clause changed.
the floor      CPU = 0.85 s + 159 ms x files, R^2 0.9999 over files = 1..128.  Use 160 ms/file.
22 files       NOT the lever. A test FILE costs 368-504x a test. No test is proposed for anything.
isolation      RETAINED deliberately. The -30% lever is green in 4 of 21 runs.
NFR-002        ABC-017's flag STALE (struck on that ticket); ABC-016's CARRIED. Row BYTE-IDENTICAL.
ABC-026        sizeable now: S. DoR 8 of 10, 2 open, and neither open item is mine.
```

## Ruling 1 — the total exists, and its number is **adopted, not invented**

**`NFR-008`: `npm test` with `PERFT_DEEP` unset, ≤ 3 s wall AND ≤ 13 s CPU.**

The ticket's central complaint was that *"between `ABC-024`'s 36–40 s and today's 1.4 s there is no
line, and inventing one at a cutting hop is precisely the defect that produced this ticket."* **I did
not invent one either. I took the board's own.** `ABC-026`'s promotion trigger — *"promote to `P1`
when the default lane passes 3 s"* — was written by BA/PM at the cut and endorsed by the Orchestrator
at the scheduling hop. **It is the only figure for this quantity that this board had already agreed
to, and a number the board has agreed to is worth more than a better number it has not.** The 13 s is
3 s × the *measured* CPU/wall conversion (4.15–5.07x on 8 logical cores), taken at the low end.

**Two clauses, and neither is decoration — each bounds the other's degenerate optimum, measured:**
`--no-file-parallelism` cuts CPU by **30.1%** and multiplies wall by **2.4x**, so a CPU-only budget
is satisfied by making the engineer wait longer; a wall-only budget is satisfied by buying cores.

**The LEVEL is `PROVISIONAL` and the SHAPE is not, and that split is the honest part of this
ruling.** The clauses, the instrument, the statistic, the admissibility control and the machine are
measured and are mine. **What a 3 s wait is worth to the humans who wait for it is not a quantity any
role on this board can measure**, and I will not dress a judgement as a derivation — that is the
`N5` defect wearing different clothes. Ratifier **Olger Oeselg via the Orchestrator**. The precedent
is in the same file: `NFR-005`'s depth 7 has carried a `PROVISIONAL` marker since 2026-07-30.

**The budget BINDS, on day one, and that is the point.** `ABC-025` cost 4.5–8.8% of it net of the
floor, so **the budget admits 11–22 more `ABC-025`-sized tickets and the plan has ~20 left.** A
budget that did not bind would not have been worth the hop.

## Ruling 2 — the per-ticket bar: **BA/PM's `5%` was never the defect. Its DENOMINATOR was.**

The ticket said `ABC-025`'s re-derived `N5` is *"the current best candidate and is explicitly NOT
assumed correct."* **I tested it and I am adopting it with exactly one clause changed.**

**The structural fault, which no wording fixes:** *n* tickets each passing "≤ 5% of the **current**
lane" multiply the lane by `1.05ⁿ` — **2.65x at twenty tickets** — with every ticket green and every
gate honest. **That is a geometric series. A per-ticket ratio against the current lane is not a weak
budget; it is not a budget.** The same 5% against a **fixed total** is an arithmetic series: twenty
tickets consume it exactly once, and the ticket capacity becomes an explicit number.

So `N8-LANE` is: **≤ 5% of `NFR-008`'s TOTAL (≤ 650 ms CPU), not of the current lane.** Every other
clause is BA/PM's, adopted **unchanged and with attribution**: CPU (user + sys), net of the measured
per-file floor, median of paired per-round deltas, n ≥ 7 interleaved rounds, one fresh process per
run, identity null control mandatory, scope = every file the branch adds under `src/`. Their wording
survived four instruments and one ruling and I found nothing else wrong with it.

**Where 5% comes from, so it can be disagreed with rather than inherited:** the budget divided by the
work the plan still contains — 7 named tickets in `Backlog`/`Ready` plus 4 undecomposed epics, and
the one epic this board has actually decomposed (`EPIC-002`, XL) produced **nine** tickets. **≈20–25
units, so 1/20 = 5%.** Re-derive it when the plan changes; it is one line of arithmetic and is meant
to be re-run.

**The instrument split, which is the part I expect to be argued with, and it is measured:** the
**total** is on the **wall clock** and the **per-ticket** bar is on **CPU**. That is not an
inconsistency. A total is a ~2x question and wall resolves it easily; a per-ticket delta is a 5%
question and only CPU resolves it. **Adding two test files moves the wall clock by −15 to +3 ms per
file — indistinguishable from zero — while moving CPU by 100–225 ms per file, and wall grows in a
sawtooth with a ~70–75 ms step at each multiple of the 7 default workers. A per-ticket wall bar would
charge two identical tickets different amounts for identical work.** `N5`'s wall wording was
therefore **unmeasurable by construction**, which is a stronger and more useful statement than
"noisy" — and it means the instrument that could not adjudicate `N5` is exactly the right one for the
total.

**Every ticket inherits `N8-LANE` and may state a tighter bar, never a looser one.** This ends
per-ticket bar invention, which has cost this board two ruling hops. **`EPIC-003`'s `parseSan`
ticket, whose `Backlog` row currently instructs it to inherit `ABC-025`'s re-derived `N5`, now
inherits this — same clauses, corrected denominator.**

## Ruling 3 — the shape question has a measured answer, and it contradicts its own premise

`ABC-025`'s gate asked: *"the lane has 22 test files today. No role has ever been asked whether that
is the right shape."* **Asked and answered: 22 files is not the problem and file count is not the
lever.**

**A test FILE costs 368–504x a test.** 128 trivial assertions in one file cost 1.1 s CPU; the same
128 spread over 128 files cost 21.3–23.8 s. **The lane is expensive per file and nearly free per
test.** Consolidating files would trade a real saving against readability, ownership and blast
radius; **reducing the per-file cost costs nothing in coverage at all.** `ABC-026` already put
deleting and narrowing tests out of scope — **this measurement removes the last reason anyone might
have wanted the milder version of that idea too.**

## Ruling 4 — per-file isolation is RETAINED, deliberately, and now its price is on the record

**~70–90% of the per-file cost is per-file process isolation** (`--no-isolate`: −30.7% / −36.5% CPU).
It is the largest single lever on this lane by a wide margin — larger than every test-content saving
anyone has proposed, combined. **It is not available.**

`--no-isolate` is **green in 4 of 21 observed runs**, and the only files that ever fail are
`zobrist.nfr.test.ts`, `gameend.nfr.test.ts` and `san.nfr.test.ts` — **`NFR-005`'s call-count
sub-bar, `NFR-001`'s three `gameStatus` bars and `ABC-025`'s five `N1` rows.** Remove those four and
it is green 6 of 6. **The lane's dominant cost is buying exactly the module-registry isolation this
board's spied call-count guards depend on, and until this hop nobody knew the price.**

**THE FIRST OBSERVED RUN WAS GREEN.** A single-run adoption was available and would have silently
disarmed three of this catalog's own instruments. That is the eleventh instrument-limit correction on
`plans/nfr-catalog.md`'s record and the most expensive one to have got wrong.

**No guard is under suspicion, no test is proposed for change, and no runner configuration was
changed at this hop.** `pool: "threads"` **with** isolation is priced (−13.97% wall / −10.78% CPU,
sign 0/8 both samples, 676/676 green in 24 of 24) and handed to `ABC-026`'s development hop as a
**candidate with a required screen of ≥ 20 consecutive green runs including all four
`*.nfr.test.ts` files** — because *"green 24 times"* is precisely the evidence `--no-isolate` had.
A refinement hop does not change the project's runner configuration.

## Ruling 5 — `NFR-002`: one flag is **STALE**, one is **CARRIED**, and the row is byte-identical

**`ABC-017`'s flag — *"the row records that the frame is a function of GAME LENGTH … the row is
Architect/Design's to rewrite"* — was ALREADY STALE WHEN IT WAS WRITTEN. No edit is owed and none was
made.** The quoted sentence is verbatim from the `Applies to` cell as it stood at `f3d5966`;
`ABC-017` was cut at `03b0a65`, **2026-07-31T00:27:21+03:00**, and the correction it asks for landed
at `92046f9`, **2026-07-31T09:55:05+03:00** — *"grug correct NFR-002 denominator, ply count to
bounded window"*, written by this role on this row, replacing that cell with *"CORRECTED 2026-07-30 —
the frame is NO LONGER `O(plies)`"* and adding the section-length correction block. **Nine and a half
hours.** Checked at the source: the quoted string occurs nowhere in the `NFR-002` row or its section
today except where this hop quotes it. **Acting on the flag at face value would have re-opened the
most-corrected row in that file for no reason.** The bullet is **struck in place on `ABC-017`** — in
that ticket's own correction convention, original left standing — rather than the row being touched.

**`ABC-016`'s flag (added today at its promotion hop) is CARRIED, not discharged, and deliberately
NOT written into the row.** It is a true and useful statement — the panel imports `GameHistory` as a
type only, so the `O(window)` boundary condition's structural verification survives it — **about a
ticket that has shipped zero lines.** Recording *"the boundary condition survives `ABC-016`"* today
would be this file certifying unbuilt code, which is the one thing its `UNKNOWN - verify` discipline
exists to prevent. **What is new and is recorded: the boundary condition now has TWO named tickets
that can void it, and each has a checker — `ABC-016` and `ABC-017`, each at its own Security/NFR
gate, each obliged to re-verify the importer fact on delivered code by `grep`, not by reading the
ticket.** Owner Security/NFR; trigger each ticket entering `In Security/NFR`.

**The `NFR-002` table row was not touched: its ID, Category, Target, `Applies to` and `Verified by`
cells are byte-identical, verified by hashing the whole line before and after the write.**

## Ruling 6 — `ABC-026` can be sized, and it is `S`

The cut said the size *"is somewhere between one catalog row and a lane restructuring, and which one
depends on the measurement that has not been done."* **The measurement is done and the answer is the
near end: `S` (2).** The lane restructuring is not on the table — the two levers are a two-line
config file and a change to four test files' spy strategy. What is left is acceptance criteria, one
owner ratification, and one optional config change with a determinism screen. Calibrated against
`ABC-011` (`S`) and `ABC-024` (`S`). **BA/PM owns the `Backlog → Ready` promotion and may revise it.**

**DoR is now 8 of 10 with 2 open, and neither open item is mine:**

- **acceptance criteria** ⚠️ — the *blocker* is removed (the central number exists); the criteria are
  **BA/PM's to write**. An architect writing the criteria his own catalog row will be judged by is
  the same conflict Security/NFR refused at `ABC-025`'s gate.
- **`NFR-008`'s level is unratified** ⚠️ — **the owner's.** Not a formality: it is the one input the
  whole row rests on and the one no role here can measure.
- **dependencies known** ✅ **CLOSED — this hop is the Architect/Design hop that line asked for. No
  further Architect/Design hop is needed before `Ready`.**
- **size** ✅ `S`. **problem / scope / value / out-of-scope / test notes** ✅ unchanged.

## What I changed

- **`plans/nfr-catalog.md`** — `NFR-008` row + section; the `NFR-002` ruling block; header.
  **`NFR-001`–`NFR-007` BYTE-IDENTICAL**, all nine pre-existing table lines hashed before and after,
  9 table lines before / 10 after, the new row carrying the same 7 pipe-separated fields as every
  other. **NO TARGET MOVED.**
- **`memory-bank/50-decisions/ADR-0008-default-test-lane-budget.md`** — new, `proposed`.
- **`plans/tickets/ABC-026-…md`** — the hop's block, the DoR status, `## What remains`, `## Size`,
  size `UNKNOWN - verify` → `S` in the front matter, and a flag on this ticket's own promotion
  trigger (it now fires at the same instant as the bar it produced, which is too late for a `P2 → P1`
  escalation to prevent anything — recorded for BA/PM, not fixed by me).
- **`plans/tickets/ABC-017-…md`** — the stale `NFR-002` flag struck in place with its evidence; the
  gate obligation added; `N8-LANE` inherited.
- **`plans/traceability.md`** — one cell of one row (`ABC-026`, `NFRs`). **35 table lines before and
  after; all 34 other lines byte-identical by md5; 12 pipe-separated fields before and after.**

## What I did NOT do

**`src/` was never written** — 37 md5s identical before and after, `git status --short -- src/`
empty; every measurement on out-of-tree copies with every repository file `cmp`-verified
byte-identical per file. **No test was deleted, narrowed, merged or proposed for any of those.** **No
runner configuration was changed**; no `vitest.config.*` exists in the repository and none was
created. **`ABC-025` is not re-opened and no verdict of its changes** — its `N5` was NOT MET on the
gross reading on every instrument and is still NOT MET on mine; the retrospective calibration against
`N8-LANE` is a calibration reading on a closed, merged ticket and nothing more. **The `PERFT_DEEP=1`
lane is not promoted into anything** — `ABC-024`'s rejection stands untouched. **`plans/board.md` was
not edited** — two agents are running and board moves are the Orchestrator's; the row text I am
asking for is at the end of this note. **No `git add`, no `git commit`, no git write command of any
kind.** **No wall-clock assertion was added to the suite** — this project's standing rule; the
seconds live in the catalog with their machine. Nothing merged, nothing deployed — a human holds
both.

## The board row text I am asking the Orchestrator for (I did not edit `plans/board.md`)

**No column moves at this hop.** `ABC-026` stays in `Backlog` until BA/PM writes its acceptance
criteria; `ABC-017` stays in `Backlog` and its hold is discharged. Two rows want text.

**`ABC-026`'s `Backlog` row — replace `size: **UNKNOWN - verify**` with `size: S` and append:**

> **ARCHITECT/DESIGN HOP DONE 2026-08-10 (`refinement-ABC-026-design`) — THE CENTRAL NUMBER NOW
> EXISTS. `NFR-008` seeded in `plans/nfr-catalog.md` and `ADR-0008` written (`proposed`): `npm test`
> with `PERFT_DEEP` unset, **≤ 3 s WALL and ≤ 13 s CPU**, medians of ≥ 7 interleaved runs, Apple M3 /
> 8 logical cores / Node v24.12.0 / vitest 3.2.7, `UNKNOWN - verify` elsewhere; today 1.565–1.765 s /
> 7.205–7.640 s = **52–59% of the wall clause, MET, and it BINDS inside this project's own remaining
> plan.** **The 3 s is ADOPTED from this ticket's own promotion trigger, not invented; the LEVEL is
> `PROVISIONAL` with ratifier Olger Oeselg via the Orchestrator and the SHAPE is not.** Standing
> per-ticket bar **`N8-LANE`** replaces per-ticket invention: **≤ 5% of the TOTAL, not of the current
> lane** — BA/PM's re-derived `N5` with exactly ONE clause changed, the denominator, because *n*
> tickets at 5% of the current lane multiply it by `1.05ⁿ` (2.65x at twenty) with every ticket green.
> **Per-file floor measured as a CURVE: `CPU = 0.85 s + 159 ms × files`, `R² 0.9999` over files =
> 1…128; a test FILE costs 368–504x a test, so 22 files is NOT the lever and NO test is proposed for
> deletion, narrowing or merging.** **~70–90% of the per-file cost is per-file process ISOLATION
> (−30.7%/−36.5% CPU) and that saving is NOT AVAILABLE — green in 4 of 21 runs, failing only in
> `zobrist.nfr.test.ts` / `gameend.nfr.test.ts` / `san.nfr.test.ts`; the FIRST observed run was
> green.** `pool: "threads"` is a priced CANDIDATE (−13.97% wall, 676/676 green 24 of 24) and is NOT
> adopted. **DoR now 8 of 10 — the 2 open items are BA/PM's acceptance criteria and the OWNER's
> ratification of the level; no further Architect/Design hop is needed before `Ready`.** ZERO
> production lines, ZERO test lines, `src/` byte-identical, `NFR-001`–`NFR-007` byte-identical, no
> target moved.

**`ABC-017`'s `Backlog` row — the hold is discharged; replace the `HELD` clause with:**

> **UNBLOCKED 2026-08-10: `ABC-026`'s Architect/Design hop has ruled on the lane total (`NFR-008`)
> and on `NFR-002`. The `NFR-002` rewrite this row records as owed is NOT owed — the flag was
> ALREADY STALE when `ABC-017` was cut: the rewrite landed at `92046f9` 2026-07-31T09:55, nine and a
> half hours after the ticket at `03b0a65` 00:27. The flag is struck in place on the ticket and the
> `NFR-002` row is byte-identical.** What `NFR-002` still owes this ticket is a MEASUREMENT (the
> bounded-pane compute, `≤ 150 µs` and the three ply counts within 2x), not a rewrite. **NEW
> obligation at its Security/NFR gate: re-verify on DELIVERED code that nothing pulls the repetition
> derive into a frame — the structural fact `NFR-002`'s `O(window)` claim rests on.** It inherits
> `N8-LANE` and must not re-derive a lane bar.
