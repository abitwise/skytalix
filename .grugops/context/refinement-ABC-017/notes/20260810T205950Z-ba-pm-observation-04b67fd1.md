---
id: 20260810T205950Z-ba-pm-observation-04b67fd1
kind: observation
by: ba-pm
at: 2026-08-10T20:59:50Z
verified_by:
confidence: high
refs:
  - ABC-017
  - ABC-016
  - ABC-018
  - ABC-012
  - ABC-013
  - ABC-010
  - NFR-002
  - ADR-0002
  - EPIC-002
  - src/history.ts
  - src/san.ts
  - src/frame.ts
  - src/render.ts
  - src/apply.ts
  - src/fen.ts
  - src/position.ts
  - 20260810T205950Z-ba-pm-decision-f0563364
supersedes:
---

# What was measured and what was constructed at `ABC-017`'s promotion — every number, its instrument, and the five wrong panes that pass EVERY criterion the ticket had

**These are BA/PM's figures. They are TARGETS and constructions, not a gate result** — the same
label the ticket's bar carries, and Security/NFR owns the verdict. Machine **Apple M3 (Mac15,13) /
Node v24.12.0 / darwin-arm64**; **`UNKNOWN - verify` on any other hardware.**

## Instrument

Harness outside the repository (`/private/tmp/.../scratchpad/`), importing merged `src/` by absolute
path through Node's type stripping; **nothing under `src/` was written or touched**. Nine rounds per
cell, discarded warm-up of 100–200 iterations, medians of per-round means. 150–2,000 iterations per
round depending on cell cost. Two long-game builders, both legal, both deterministic:

- **`ABC-012`'s own pseudo-random game** (`src/history.test.ts:74-88`, fixed LCG over the generator's
  ordering), which the ticket's test notes mandate. **Measured: it terminates at exactly 378 plies.**
- **A legal knight shuffle** (`Nb1-c3-b1` / `Nb8-c6-b8`), which `ABC-018`'s suite already uses to
  build a real 300-ply game, and which holds the window's CONTENT identical at every length. That
  property is what makes it the control.

**Instrument sanity, stated because this project's record insists on it:** `parseFen` measures
**1.621 µs (1.584–1.806)** here against the **1.62 µs** the ticket's own derivation transcribed from
wave 1 — **0.06%**, on a figure this hop did not look up until after measuring.

The reference pane used for every measurement is an honest build: window by move NUMBER, numbers and
columns read from the replayed position, `toSan` per visible ply, one `parseFen`, fixed-width rows,
top-aligned. It is what `A1`–`A11` describe.

## 1. The pane is `O(plies)` in its replay term — the measurement that makes D1

Knight shuffle, window content identical at every length, so **only the prefix length varies**:

| plies | replay to window start | whole pane |
|---|---|---|
| 40 | 1.73 µs | 51.39 µs |
| 120 | 2.43 | 52.14 |
| 300 | 3.74 | 54.48 |
| 600 | 5.97 | 55.10 |
| 1,000 | 9.08 | 59.89 |
| 2,000 | 16.69 | 66.61 |
| 4,000 | 31.07 | 79.50 |

**replay = 1.56 µs + 7.42 ns × plies, R² 0.99979.**
**pane = 51.72 µs + 7.08 ns × plies, R² 0.99391.**

The intercept is one `parseFen` (1.62 µs measured independently). The slope is `makeMove`.

**Why there is no faster way, checked at source rather than assumed:** `GameHistory` is
`{ initialFen, moves, position }`. `ADR-0002` clause 2 forbids an undo stack, no `UndoRecord` is
stored, and **no clone function exists anywhere in `src/`** — `src/history.ts`'s header says so. So
the position before ply *n*−16 is reachable only by replaying from the anchor. **The ticket's
*"2.2–3.9 µs (measured, flat)"* is linear, and its band misses 40 plies (1.78 µs) at the bottom while
bracketing 120–378.**

**Extrapolated, the absolute bar is crossed at ~13,900 plies** — beyond any legal game, which is why
this is a correction to the label and not to the ruling.

## 2. The ratio criterion measures the FIXTURE, not the algorithm

Same correct build, two builders:

| plies | `ABC-012`'s LCG game | knight shuffle | unbounded model *(toSan every ply)* |
|---|---|---|---|
| 40 | **40.70 µs** (40.20–47.78) | 51.39 µs | 95.3 µs |
| 120 | **69.26** (68.64–80.40) | 52.14 | 382.1 |
| 300 | **75.10** (74.61–92.61) | 54.48 | 1,192.2 |
| 378 | 75.95 (75.48–83.56) | — | 1,500.0 |
| **40/120/300 ratio** | **1.845x** | **1.060x** | **12.51x** |

- **1.845x against the ticket's 2x bar is 7.7% headroom on a CORRECT build**, on the builder the
  ticket's own test notes mandate.
- The spread is the cost of `legalMoves` inside `toSan` in opening versus endgame positions — the
  window at 40 plies holds plies 25–40, the window at 300 holds plies 285–300. Hold the content fixed
  and the same code reads **1.060x**.
- The bar **does** catch the unbounded model (12.51x, and 1,192 µs against 150 µs). It does **not**
  catch the `O(plies)` replay term: 3.80 µs of a 75.10 µs pane at 300 plies.

**Worst measured cell 75.95 µs = 0.51x the 150 µs absolute.** The ticket's own arithmetic predicted
~70–75 µs. **The number was right; the label on it was not.**

## 3. Five wrong panes, built and run. Each passes EVERY criterion the ticket had

Criteria as they stood: 8 rows at 0 plies all blank · 8 rows at 1 ply, one reading `1. e4` · 8 rows at
80 plies, first `33.` last `40.` · 8 rows at 300 plies · 8 rows after `takeBack(2)` · byte-identical
twice + `toFen` unchanged · zero code points above `U+007F` · the cost bar.

```
build              c1(0)  c2(1)  c3(80)  c4(300)  c5(takeBack2)   ALL PASS
honest             true   true   true    true     true            true
M1 last-16-plies   true   true   true    true     true            TRUE
M2 index numbering true   true   true    true     true            TRUE
M3 bottom-aligned  true   true   true    true     true            TRUE
M4 unpadded rows   true   true   true    true     true            TRUE
```

**M1 — the window is 16 PLIES, not 8 PAIRS.** Byte-identical to the correct build at 20, 40, 80, 120
and 300 plies. **Every ply count the ticket named is even except 1, where the two agree.** At 19
plies of `A3`'s line:

```
  correct                       M1
  3. Bc4   Bc5                  2. Nc6   Bc4
  4. c3    Nf6                  3. Bc5   c3
  5. d4    exd4                 4. Nf6   d4
  6. cxd4  Bb4+                 5. exd4  cxd4
  7. Nc3   Nxe4                 6. Bb4+  Nc3
  8. O-O   Bxc3                 7. Nxe4  O-O
  9. bxc3  d5                   8. Bxc3  bxc3
 10. Ba3                        9. d5    Ba3
```

**Every cell in the wrong column, every number one too low, eight rows, all ASCII.** Killed by `A4`.

**M2 — move numbers from the array index (`floor(i/2)+1`).** No criterion stated an anchor FEN, so
every one was implicitly a fullmove-1, white-to-move game.

| anchor | correct | M2 |
|---|---|---|
| `… w KQkq - 0 27`, 5 plies | `27. Nc3 Nc6` / `28. Nb1 Nb8` / `29. Nc3` | `1. Nc3 Nc6` / `2. Nb1 Nb8` / `3. Nc3` |
| `… b KQkq - 0 27`, 5 plies | `27. ⟨empty⟩ Nc6` / `28. Nc3 Nb8` / `29. Nb1 Nc6` | `1. Nc6 Nc3` / `2. Nb8 Nb1` / `3. Nc6` |

The black-to-move anchor breaks **both** the numbers and the columns. Killed by `A6`. **The correct
derivation costs nothing** — the replay already produces the position before each visible ply, and
`fullmoveNumber` / `blackToMove` are two fields on it.

**M3 — bottom-aligned.** Passes *"exactly 8 rows, one of which reads `1. e4`"*, and so would a build
placing the row in position 4. Killed by `A8`.

**M4 — unpadded rows**, which is what any natural implementation emits:

```
  0-ply   row widths: [0]
  80-ply  row widths: [14, 15]
  300-ply row widths: [16, 17]
```

So *"identical in count and **width** to the 0-ply case"* is **false**, while *"every row is blank"*
forbids padding if "blank" means `""`. **The two criteria could not both hold.** Killed by `A2`,
which pins a constant `HISTORY_COLS` and defines "blank" as that many spaces.

**M5 — the pane reaches for `takeBack`.** Two versions, and only one is caught:

| version | output correct | byte-identical twice | `toFen` unchanged | `moves.length` | caught? |
|---|---|---|---|---|---|
| rewind, render, **restore** by replay | yes | yes | yes | 80 → 80 | **NO** — passes everything |
| rewind, render, **no restore** | — | **no** | — | 80 → **48** | yes, by determinism |

The restoring version mutates the caller's authoritative state mid-render, is not re-entrant, and
destroys the game on any throw. **Only `A11`'s call count catches it.**

## 4. The `takeBack` criterion, measured against what `takeBack` does

`src/history.ts:99-105` — `takeBack` splices the list and replays from `initialFen`. At 80 plies:

| operation | plies after | pane rows | last row |
|---|---|---|---|
| none | 80 | 33–40 | `40. c8=N Rg6` — **full pair** |
| `takeBack(h, 2)` — `EPIC-006`'s undo | 78 | **32–39** | `39. Nf2 Nh7` — **full pair** |
| `takeBack(h, 1)` | 79 | 33–40 | `40. c8=N` — **white ply alone** |

The criterion said `takeBack(2)` *"shows one fewer move pair in its last row"*. A row holds one pair.
**78 plies is 39 complete pairs, so the window slides one whole move and no half-row appears.** The
half-row it was describing is `takeBack(1)`'s. Both are criteria now.

## 5. Claims in the ticket, checked at source rather than inherited

| Ticket said | Verdict |
|---|---|
| *"board and labels at ~10 rows … leaves ~8 rows … overflows at roughly move 9"* | **FALSE by one row.** `renderBoard` returns **9** rows of **18** characters. `frameHeight({board:9,status:3,history:N})` = 22 / **23** / 24 / 25 at N = 7 / 8 / 9 / 10. **8 fits with a row of slack; 9 also fits at exactly 24.** The bound's conclusion survives and is now conservative |
| *"the pane shows moves 33–40 of a 40-move game"* | **TRUE for the standard anchor.** Driven: 80 plies of `ABC-012`'s game → rows 33–40, last row `40. c8=N Rg6` |
| *"replay … 2.2–3.9 µs (measured, flat)"* | **BAND roughly right, WORD false.** 1.56 µs + 7.42 ns/ply, R² 0.99979 |
| *"~70–75 µs total"* | **TRUE at the top of the range** — 40.70 / 69.26 / 75.10 / 75.95 µs at 40 / 120 / 300 / 378 |
| *"the unbounded model was 171–176 / 517–533 / 1,272–1,318 µs, a spread of 7.5x"* | **CONSISTENT at the top, higher spread here** — 95.3 / 382.1 / 1,192.2 µs, **12.51x**, on a different game. The 300-ply figure agrees within 7% |
| *"SAN is ASCII by construction"* | **TRUE** — `PIECE_LETTERS`, `squareName`, `O-O`, `x`, `=`, `+`, `#` are all ASCII (`src/san.ts`) |
| *"`history.ts` does not import `san.ts`"* | **TRUE** — `src/history.ts:24` says so and the imports confirm it |
| *"`ADR-0004` is `accepted`, the wait is over"* | **TRUE** — and `ABC-013` is merged on `main` |
| the history makes the window's first position reachable | **TRUE, by REPLAY ONLY.** No undo stack (`ADR-0002` cl. 2), no stored `UndoRecord`, no clone function in `src/` |
| *"Move numbers are the real ones"* | **UNDERIVED.** The sentence names no derivation; there is exactly one that is right for every anchor, and M2 is what the absence buys |
| the pane's row count is 8 | **PINNED HERE, and it was already load-bearing ELSEWHERE** — `ABC-016`'s promoted `A11` hardcodes `history: 8` |
| *"it adds one test file"* (`N8-LANE`) | **NOW TWO** — `A11` needs per-file module-registry isolation. Floor ~320 ms CPU |

Also measured for `A2`'s width requirement:

- **Longest SAN in 378 plies of `ABC-012`'s game: 7 characters (`dxc8=Q+`)**, matching the grammar's
  theoretical maximum (`Qh4xe1#` in shape).
- **`parseFen` accepts `fullmoveNumber` 100,000** and enforces only `>= 1` (`fullmove number must be
  at least 1, found 0`). **Nothing bounds a loaded FEN's move number**, which is why the ticket
  states the >9,999 case as an accepted limitation and carries `ABC-010` rather than owning it.

## 6. Two structural facts worth carrying beyond this ticket

**(a) `src/history.ts` has exactly ONE importer today — `src/history.test.ts`.** Checked by `grep`,
at this hop, for information only. `NFR-002`'s `O(window)` boundary condition rests on that fact, and
`ABC-017` is one of the two tickets that can void it. **`A11` is this ticket's own half of the
guard; the Security/NFR gate's obligation to re-check it on DELIVERED code is not discharged by
anything here.**

**(b) This pane will set the frame's `W`.** `src/frame.ts:179` takes `W` as the widest panel row;
`renderBoard` is 18 characters and any layout meeting `A2`'s requirement (4-digit number + two
7-character SANs) exceeds that. `ABC-018`'s own QE note already anticipated it — *"when `ABC-016` and
`ABC-017` ship, `W` becomes whatever the widest of the three emits"*. **That is why the constant-width
criterion is a criterion and not a nicety: a pane whose width moves makes the whole frame breathe
every ply.**

## What this note does not claim

No wall-clock assertion is proposed for the suite — this project's standing rule; the microseconds
live in `plans/nfr-catalog.md` with their machine and the suite pins the **counts**. These figures
are one machine's and are `UNKNOWN - verify` anywhere else. Per-round spreads are reported inline
(worst cell 74.61–92.61 µs at 300 plies on the LCG game); **no attribution is offered** for the upper
outliers beyond warm-up leakage, which this hop did not chase. **No claim is made about delivered
code, because there is none** — every figure above is an out-of-tree reference build measured against
merged `src/`, and it is a target for the engineer and the gate, not a result.
