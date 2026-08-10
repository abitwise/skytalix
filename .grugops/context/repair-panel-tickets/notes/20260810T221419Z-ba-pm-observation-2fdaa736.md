---
id: 20260810T221419Z-ba-pm-observation-2fdaa736
kind: observation
by: ba-pm
at: 2026-08-10T22:14:19Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-018
  - ADR-0009
  - src/frame.ts
  - src/frame.test.ts
  - src/render.ts
supersedes:
---

# Eight row-count mutants re-run against merged `src/`, and two corrections to the record

Recorded as `observation` and **not** as `finding`: every number below is a direct run against merged
`src/` from an out-of-tree harness, but this hop holds no `§14-gate#<id>` stamp and no `human:<name>`
grant, so a `finding` would be refused and faking one is what admission exists to stop.

Read first, and grounded in: `20260810T214235Z-orchestrator-decision-ea14a979` (the LIVE parent
decision), `20260810T213554Z-architect-design-observation-1a02e27d`,
`20260810T213554Z-architect-design-decision-1985d914`, and `ADR-0009` (`accepted`). **`ADR-0009` is not
re-litigated.** Architect/Design's six-mutant table was **re-run rather than transcribed**, because the
subtask asked for exactly that.

## The table, re-run, plus two mutants this hop added

Each assertion form evaluated **exactly as its ticket words it**. `4b` is `beginFrameSession`'s own
strategy choice on a 24-row TTY — not arithmetic. Measured first, and independently: `renderBoard`
returns **9 rows of 18 characters**; `frameHeight({9,3,8})` = **23**; `beginFrameSession` takes the
**in-place** path at `H` = 22, 23, 24 and the **append** path at `H` = 25, 26, 27.

| mutant | `A11` promoted | `A11` struck | `A1` promoted | `A1` struck | merged `:633` | fit `= 23` | fit `<= 24` | H | `4b` |
|---|---|---|---|---|---|---|---|---|---|
| delivered 9/3/8 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | 23 | yes |
| M1 status ships 4 | **FAIL** | **FAIL** | **FAIL** | PASS | PASS | **FAIL** | PASS | 24 | yes |
| M2 history ships 9 | PASS | PASS | **FAIL** | **FAIL** | PASS | **FAIL** | PASS | 24 | yes |
| M3 history ships 10 | PASS | PASS | **FAIL** | **FAIL** | PASS | **FAIL** | **FAIL** | 25 | **no** |
| M4 `renderBoard` ships 10 | PASS | PASS | PASS | PASS | PASS | **FAIL** | PASS | 24 | yes |
| M5 board 10 + history 9 | PASS | PASS | **FAIL** | **FAIL** | PASS | **FAIL** | **FAIL** | 25 | **no** |
| M6 status ships 5 *(added)* | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | **FAIL** | 25 | **no** |
| M7 status 4 + history 7 *(added)* | **FAIL** | **FAIL** | **FAIL** | **FAIL** | PASS | PASS | PASS | 23 | yes |

**Architect/Design's six rows reproduce exactly** for `A11` promoted, `A1` promoted and the two fit
clauses. The two new columns and two new rows are this hop's.

## 1. The strike does NOT repair the defect the subtask names — it RELOCATES it

The subtask asked that `ABC-016`'s `A11` be repaired *"so it can fail on the cases it exists to
catch"* (M3 and M5, the mutants that make epic `4b` unreachable).

**Measured: `A11` passes M3 and M5 BEFORE the strike and AFTER it.** The `A11 struck` column is the
new measurement and it is the one that matters. **Nothing writable on `ABC-016` can catch them:**

- Both mutants move `history`. `ADR-0009` cl. 2 forbids this panel naming another panel's constant,
  and `ABC-017` is unbuilt when `ABC-016` merges **first**, so there is no delivered `HISTORY_ROWS` to
  read.
- The one form that *could* name it is a literal or a local shadow — **and that form passes all
  six**, which is `ADR-0009` Alternative B, rejected there by the same measurement.
- A partial fit-check on `ABC-016` (`renderBoard(...).length` + real `STATUS_ROWS` + a shadow `8`)
  would catch M1/M4/M6 and **still pass M3/M5**, because the shadow does not move when history does.

**So `D8`'s claim that `A11` protects `4b` is retracted in half rather than repaired.** What survives
is real and worth the criterion: at `status` = 5 the frame is **25** rows (M6), `beginFrameSession`
takes the append path, and `4b` dies — and `A11`'s `= 3` clause fails there. `A11` protects `4b`
**against this panel's own row count and nothing else.** The `history`/`board` halves are `ABC-017`'s
`A13` per `ADR-0009` cl. 5.

## 2. CORRECTION to `ADR-0009` and to `1a02e27d`: `:632-638` does NOT pass all six

`ADR-0009` `## Context` and `## Consequences`, and Architect/Design's observation note, state that
`src/frame.test.ts:632-638` *"passes on all six mutants"* and name it a hole in a merged suite.

**That is exact for the ASSERTION at `:633` and wrong for the TEST at `:632-638`, which is the unit a
suite fails.** Read at source: the test has three assertions. `:633` and `:634` are pure local
literals. **`:635-637` is `assembleFrame(partsFor(playTo(4), { status: [4 rows] }))` expecting 24
rows** — and `partsFor` (`:119-126`) takes `board` from the **real `renderBoard`**, while
`assembleFrame` (`src/frame.ts`) returns `board.length + status.length + history.length +
MESSAGE_ROWS + PROMPT_ROWS`. **That clause is live on the board term.**

Measured: the test **FAILS M4 and M5** today and passes M1, M2, M3, M6, M7.

**What this does and does not change.** It does **not** change `ADR-0009`'s ruling: the shadow still
passes M1, M2, M3 — **including M3, one of the three mutants that kill `4b`** — and cl. 5's fit-check
is strictly stronger (it fails all of M1–M6). **The hole is real but narrower than recorded, and it
still contains a `4b`-breaker.** Recorded because the ADR calls that table *"the whole basis of the
decision"* and states the all-six claim as a fact in `## Consequences`. **`ADR-0009` was NOT edited** —
`memory-bank/50-decisions/` is a concurrent Architect/Design hop's this wave. **Flagged, not taken.**

## 3. Two mutants worth adding to the shared record

- **M6 (`status` ships 5)** — `H` = 25, `4b` **dead**. It is the `ABC-016`-side `4b`-breaker, and the
  Architect's six did not include one. It is the case that makes `A11`'s surviving clause load-bearing
  rather than decorative.
- **M7 (`status` 4 + `history` 7)** — `H` = **23**, `4b` fine. **The fit-check correctly PASSES while
  both panels' own clauses correctly FAIL.** It is the case proving the two levels of assertion are
  doing different jobs, and that a single criterion trying to do both would have to fail on a frame
  with nothing wrong with it.

## 4. Mechanical facts about the file `ADR-0009` cl. 5 says to edit, read at source

Relevant because cl. 5 characterises the edit as *"a few lines"* and *"a handful of test lines"*:

- **`src/frame.test.ts:45` derives `HEIGHT` from the three shadows, and ~40 assertions consume it** —
  including every `beginFrameSession(sink, HEIGHT)` and `captureSink(true, HEIGHT)` (`:285`–`:769`).
  Replacing the shadows re-provenances all of them at once. They stay green at 9/3/8, so the textual
  edit really is small — but it is **not local**, and that is the honest size.
- **`:288` already asserts `expect(HEIGHT).toBe(23)`**, commented *"near-vacuous under fixed-height
  stubs."* **Once `HEIGHT` reads delivered geometry, `:288` IS cl. 5's `= 23` tripwire.** So the work
  is: make the terms live, and **add the `<= 24` clause**. Adding a third copy of `= 23` is waste.
- **`BOARD_ROWS` cannot become an import** (cl. 6 adds no export to `src/render.ts`); it becomes
  `renderBoard(...).length`. Its one non-arithmetic use (`:769`) indexes frame rows and is unaffected.
- **`historyStub` (`:67-78`) sizes itself from `HISTORY_ROWS`; `statusStub` (`:55-59`) does NOT** — it
  returns a hardcoded three-element array. After the swap the stub and the real constant can disagree
  and the failure surfaces at `:285` pointing at the wrong thing.
- **Making `HEIGHT` live catches nothing on its own.** With `historyStub` sized from a live
  `HISTORY_ROWS`, a `history: 10` build gives `HEIGHT` = 25 and every `toHaveLength(HEIGHT)` /
  `captureSink(true, HEIGHT)` assertion stays green — they are self-consistent. **Only the literal
  `23` and the literal `24` fail.**

## 5. One self-caught measurement error, recorded because the method is the point

The first byte-identity check on `plans/traceability.md` reported the other rows as CHANGED. **The
check was wrong, not the file.** It hashed `grep -n` output, and inserting two header lines shifted
every line number, so the prefixes changed while the content did not. Re-run on content only: **33
non-ticket table lines byte-identical to `HEAD`, `7d1fe1429ac3917ca3e0217888c8d21d` before and after**,
35 table lines before and after, both edited rows at exactly 12 pipe-separated fields. Same
trust-the-mechanism-without-checking-what-it-does shape the Orchestrator recorded against its own
supersede chain in `ea14a979`.
