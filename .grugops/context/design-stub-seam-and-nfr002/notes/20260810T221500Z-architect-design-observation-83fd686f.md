---
id: 20260810T221500Z-architect-design-observation-83fd686f
kind: observation
by: architect-design
at: 2026-08-10T22:15:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-018
  - ABC-019
  - ADR-0009
  - NFR-002
  - src/frame.ts
  - src/frame.test.ts
  - src/history.ts
  - src/render.ts
supersedes:
---

# Seven measurements against merged `src/`, before either ruling

Recorded as `observation` and **not** as `finding`: every item below is a direct read or a direct run
against merged `src/`, but this hop holds no `§14-gate#<id>` stamp and no `human:<name>` grant, so a
`finding` would be refused and faking one is what admission exists to stop.

Read first, and confirmed rather than re-derived: `20260810T214235Z-orchestrator-decision-ea14a979`
(the LIVE consolidated merge-order decision — the stub-seam item it records as *"still owed"* is
item 1 here), this role's own `20260810T213554Z-architect-design-decision-1985d914` and
`…-observation-1a02e27d` at `design-frame-contract`, `ADR-0009` (accepted), and BA/PM's
`20260810T214622Z-ba-pm-observation-36bdcbfd` / `…-decision-e331c796` at `refinement-ABC-019`
(the hop that raised item 2).

Five throwaway harnesses were written **outside the repository** and run read-only against merged
`src/`. **`src/` is byte-identical across the hop:** 36-file aggregate md5
`afbc181925173a615c3fbf18fd51dab8` before and after, `git status --short -- src/` empty, zero
untracked files. **Zero production lines, zero test lines.**

## 1. `.length` is a total substitute for any declared row count

`assembleFrame(parts, mode).length` equals `frameHeight({ board: parts.board.length, status:
parts.status.length, history: parts.history.length })` over **560 shapes, 0 mismatches** — status
0/1/2/3/4/5/7/10 × history 0/1/7/8/9/10/16 × five message-region shapes (none, one, three, a
400-character item, 40 items) × both glyph modes.

The frame's row count is also **invariant under the message region**: 0, 1, 200 and one
100,000-character item all give `H` = 23. So deriving the height from the *first* frame is safe
whatever that frame happens to carry.

Re-confirmed while there: `renderBoard` returns 9 rows of 18 characters; `MESSAGE_ROWS` 2 +
`PROMPT_ROWS` 1; `frameHeight({9,3,8})` = 23; and on a 24-row TTY `beginFrameSession` takes the
in-place path at `H` = 22/23/24 and the append path at `H` = 25.

## 2. The height can be obtained AFTER the first frame is assembled — the ordering works

Assemble frame 1 → `height = frame1.length` → `beginFrameSession(sink, height)` → write frame 1.
Run: height 23, `frameHeight` agrees, **exactly one write**, in-place on a 24-row TTY. Nothing in
`src/frame.ts` requires the height before a frame exists; it requires the strategy to be chosen once,
which this satisfies.

## 3. Three forms a loop can use for that height, against the swap mutants — the measurement that decides item 1

`4b` is `beginFrameSession`'s own strategy choice on a 24-row TTY. *Overflow* means it chose in-place
for a frame taller than the viewport.

| mutant | `H` | **A** DECLARED (loop states 9/3/8) | **B** IMPORTED | **C** DERIVED (`frame.length`) | `4b` needs |
|---|---|---|---|---|---|
| delivered as budgeted 9/3/8 | 23 | 23 PASS | 23 PASS | 23 PASS | in-place |
| M1 status ships 4 | 24 | 23 **FAIL** | 24 PASS | 24 PASS | in-place |
| M2 history ships 9 | 24 | 23 **FAIL** | 24 PASS | 24 PASS | in-place |
| M3 history ships 10 | 25 | 23 **FAIL — OVERFLOW** | 25 PASS | 25 PASS | append |
| M4 board ships 10 | 24 | 23 **FAIL** | 24 PASS | 24 PASS | in-place |
| M5 board 10 + history 9 | 25 | 23 **FAIL — OVERFLOW** | 25 PASS | 25 PASS | append |

**Form A fails all five mutants, and on M3/M5 it is a live production defect, not a stale number:**
told 23, `beginFrameSession` chooses in-place and emits **25 rows into a 24-row viewport — one row
beyond it**. The frame origin scrolls off the top and epic acceptance `4b` is unreachable. Same `4b`
failure `ADR-0009` clause 4 struck `A11` for being blind to, through a different door.

## 4. Form B is mechanically impossible against unbuilt panels — run, not argued

A loop importing `STATUS_ROWS` / `HISTORY_ROWS` from modules that do not exist, compiled under **this
project's own `tsconfig.json`** (strict, `noUncheckedIndexedAccess`, `moduleResolution: bundler`,
`allowImportingTsExtensions`, `verbatimModuleSyntax`): **`TS2307` × 2, exit 2**. An unrelated file in
the same program is red with it, because the typecheck is project-wide (`AGENTS.md` records there is
no single-file mode) and `typecheck` is in `quality.mandatory_gates` under `gate_enforcement:
blocking`.

**So form B against stubs requires the stub module to EXPORT the constants — which is exactly the
third declaration site.** This is the cost `ADR-0009`'s `## Context` measured for the panel-to-panel
edge, now measured for the loop-to-panel edge.

## 5. `ADR-0009` clause 5's fit-check does not cover the loop — checked, not assumed

Across all six mutants, clause 5's `= 23` and `≤ 24` verdicts are a pure function of the panels and
are **identical whatever the loop does**. On the budgeted world a form-A loop's literal 23 and the
panels' 23 agree *by coincidence* and both are green.

Clause 5 proves the real panels compose to a frame that fits. It says nothing about whether the
loop's session height equals the frame the loop assembles. **Two different propositions.** This is
the concrete reason the Orchestrator's *"plausibly covers a stub seam"* was not enough.

## 6. The stub's chosen row count decides WHERE the failure lands

| stub status/history | `H` | form A caught at `ABC-019`'s OWN gate? | strategy the geometry requires |
|---|---|---|---|
| **3/8 (copied from the tickets)** | 23 | **NO — green, landmine armed for the rebase** | in-place |
| 2/5 | 19 | YES — red here | in-place |
| 1/1 | 14 | YES — red here | in-place |
| 4/9 | 25 | YES — red here | **append** |
| 5/8 | 25 | YES — red here | **append** |

A 3/8 stub also **never exercises the append branch at all**. Separately: `assembleFrame` does not
normalise height (two shapes one row apart return 19 and 20), so *"every frame's `length` equals the
session height"* is a **real assertion that can fail**.

**The recommended shape was run end to end.** One render seam of the exact signature `ABC-019`'s
`## Scope` already states — `(GameHistory, GameStatus, thinking) => readonly string[]` — stub seam at
2/5: session height 19, **13 frames for 1 initial + 12 plies, 13 writes**, `distinctHeights: [19]`,
one strategy chosen once. **The identical loop code then ran unchanged against three real-geometry
seams**: 9/3/8 → 23 in-place; status 4 → 24 in-place; history 10 → **25 append**; no viewport
overflow in any case.

## 7. Item 2's quantity, re-measured — and two facts about the existing record

Own harness **outside the repository**, its own process, discarded warm-up round, **9 usable rounds ×
300 iterations**, cell order rotated every round, medians of per-round means, the game built by
`src/history.test.ts:81-89`'s LCG so a ply count means the same thing here and in the suite, **every
game's length asserted**, elision-checked. **Apple M3 / Node v24.12.0 / darwin-arm64;
`UNKNOWN - verify` on any other hardware.**

| cell | 40 plies | 120 plies | 300 plies |
|---|---|---|---|
| `repetitionCounts` | 17.74 µs | 44.11 µs | 91.76 µs |
| `gameStatusOf` (the composite) | 20.76 µs | **48.27 µs** | **95.29 µs** |
| `gameStatus` bare (no counts map) | 2.71 µs | 3.31 µs | 2.21 µs |

**(a) `gameStatusOf` ALREADY CONTAINS the `gameStatus` call.** Read at source:
`gameStatusOf(history)` is `gameStatus(history.position, repetitionCounts(history))` —
**`src/history.ts:152`**. So `ABC-019`'s `[D19]` arithmetic *"with `gameStatus`'s 2.52 µs that is
99.5–104.5 µs"* **double-counts it**. The catalog's own words for the quantity are *"`gameStatus`
**fed by** `repetitionCounts`"* and *"the whole `gameStatus` + counts composite"*.

**(b) The catalog's `97–102 µs @ 300` band is a wave-1 PROTOTYPE band and its 300-ply end is ~7%
high.** Every independent reading is **below its 97 lower bound**. At 120 the `46–50` band holds.

**Three independent harnesses, three roles, three days, agreeing** — `gameStatusOf`: `ABC-016`'s hop
**21.06 / 47.93 / 95.64**, `refinement-ABC-019` **20.62 / 48.06 / 94.43**, this hop **20.76 / 48.27 /
95.29**. Spread **2.1% @ 40, 0.7% @ 120, 1.3% @ 300**. `repetitionCounts` against the catalog's own
`ABC-012`-gate figures (17.5 / 44.4 / 92.0): **1.4% / 0.7% / 0.3%**. All far inside the ±22% thermal
drift `NFR-008` documents for this machine.

**A structural fact that is new on that row:** bare `gameStatus` is **FLAT in plies** (the 2.71 /
3.31 / 2.21 ordering is noise at this scale). **The entire `O(plies)` term is `repetitionCounts`** —
91.76 of the composite's 95.29 µs at 300 plies. So the row's falsifier, *"if a renderer ever pulls
the repetition derive into a frame"*, names exactly the right call; a renderer calling bare
`gameStatus` would not void the `O(window)` claim.

## Two incidental observations, neither a defect, neither acted on

- **Merged `src/frame.test.ts` already carries the derived-vs-declared cross-check inside one file.**
  `expect(frame).toHaveLength(HEIGHT)` at eight sites, with `HEIGHT` from the shadow constants
  (`:38-43`) and the frame from `statusStub` / `historyStub` (`:53+`), plus the comment at `:45`
  *"the height every test derives, so no test hands the writer a number the assembler disagrees
  with"* — the intent is exactly clause 9's. What is unguarded is stub↔**real**, and clause 5's
  import swap is what turns that guard into a real cross-check.
- **`plans/traceability.md` received a concurrent hop's completed edit between this hop's read and
  its write.** BA/PM's `repair-panel-tickets` (still `claimed`, uncommitted) edited the `ABC-016` and
  `ABC-017` rows and prepended its own `_Updated:` line. **Preserved byte-for-byte and not
  clobbered** — verified by hashing every other table line inside the same write, 35 table lines
  before and after, zero other lines changed. See the `artifact-ref` note for why that file is
  deliberately left unstaged.
