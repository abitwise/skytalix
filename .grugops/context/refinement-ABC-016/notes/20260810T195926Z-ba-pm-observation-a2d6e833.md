---
id: 20260810T195926Z-ba-pm-observation-a2d6e833
kind: observation
by: ba-pm
at: 2026-08-10T19:59:26Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-019
  - ABC-010
  - EPIC-002
  - plans/nfr-catalog.md
  - src/legal.ts
  - src/history.ts
  - src/gameend.ts
  - src/san.ts
  - src/apply.ts
  - src/frame.ts
  - 20260810T195926Z-ba-pm-decision-b087d642
supersedes:
---

# What was measured and what was constructed at `ABC-016`'s promotion — every number, its instrument, and the four wrong panels that passed the criteria as they stood

**These are BA/PM's figures. They are TARGETS and constructions, not a gate result** — the same
label `ABC-017`'s bar carries, and Security/NFR owns the verdict. Machine **Apple M3 (Mac15,13) /
Node v24.12.0 / darwin-arm64**; **`UNKNOWN - verify` on any other hardware.**

## Instrument

Harness outside the repository (`/private/tmp/.../scratchpad/`), importing merged `src/` by absolute
path; **nothing under `src/` was written or touched**. Nine rounds per cell, discarded warm-up of 200
iterations, medians of per-round means, min/max reported. 2,000 iterations per round (300 at 300
plies). Histories built with `ABC-012`'s own deterministic LCG game (`src/history.test.ts:74-88`), so
they are identical on every run and comparable with `ABC-017`'s future figures. `parseFen` is
**inside** the timed region for item 4, because the panel pays it there.

**Instrument sanity, stated because this project's record insists on it:** `gameStatusOf` at 120
plies reads **47.93 µs** here against `plans/nfr-catalog.md`'s independently measured **47.75 /
47.59 µs** at `ABC-012`'s Security/NFR gate — agreement to **0.4%** on a figure this hop did not
inherit and did not look up until after measuring.

## 1. Per-frame panel compute, by term and by game length

| Term | 0 plies | 40 | 120 | 300 |
|---|---|---|---|---|
| item 2 `isInCheck` | 0.06 | 0.07 | 0.08 | 0.11 µs |
| item 5 64-square material scan | 0.15 | 0.18 | 0.15 | 0.13 µs |
| item 4 replay to ply *n*−1 + `toSan` | 0.01 | 5.18 | 7.77 | 9.75 µs |
| **item 7 `gameStatusOf(history)`** | **4.41** | **21.06** | **47.93** | **95.64 µs** |
| **whole panel, ticket as written** | **4.62** | **26.24** | **56.12** | **105.00 µs** |
| whole panel, item 7 as an input | ≈ 0.2 | ≈ 5.4 | ≈ 8.0 | ≈ 10.0 µs |

Sum of terms and measured whole agree to **< 1%** at every ply count (4.63/4.62, 26.49/26.24,
55.93/56.12, 105.63/105.00), so nothing material is hiding between them.

**Three readings that matter:**

- **Item 7 is 80–91% of the panel** at every non-trivial game length and it is `O(plies)`. Linear
  fit ≈ **0.335 µs/ply**.
- **The ticket's stated estimate — *"the expected total is well under 20 µs"* — is exceeded from
  roughly 30 plies** (before the opening is over) and is **5.3x out at 300 plies**, a ply count epic
  acceptance `4a` names by number.
- **`isInCheck` is 30–50x cheaper than the ticket priced it.** It is one attack scan
  (`src/legal.ts:32-35`), not a generation; it never sat inside `legalMoves`'s 2.1–5.3 µs band. The
  derivation over-priced its cheapest term and omitted its most expensive one.

**The 250 µs bar is NOT breached today** — 0.42x at 300 plies. It would cross at roughly **730
plies**, a reachable legal game length (FIDE 9.6.2 bounds each irreversible epoch at 150 plies, not
the game). Recorded precisely so nobody reads this as a repeat of `ABC-025`'s `N5`: that bar was
**breached and unmeasurable**; this one was **unmeasurable and comfortable**, which is a different
failure with the same root — a target reverse-engineered from an estimate nobody re-checked when the
scope changed under it.

## 2. Four wrong panels, built and run

Each passes the acceptance criteria **as they stood before this hop**. Each is now killed by a named
criterion.

**M1 — SAN against the live position (`A5`, D12).** `toSan(history.position, lastMove)` after
`Ng1f3` from the start position:

```
  san emitted : "Nf3"              <- CORRECT
  fen before  : rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1
  fen after   : rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKBNR b KQkq - 1 1
  LIVE POSITION CORRUPTED: true    <- phantom knight on g1, permanent
```

It violates `toSan`'s first caller obligation, about which `ABC-013` deliberately asserts nothing.
A content assertion passes it. **Only a `toFen` snapshot taken BEFORE the first render catches it** —
a snapshot taken between two renders is byte-identical across a panel that corrupts on every render.
That timing is now in the criterion, not in a test note.

**M2 — the check indicator from `reason === "checkmate"` (`A2`, D4).**

| FEN | wrong build | correct (`isInCheck`) |
|---|---|---|
| `rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3` *(the ticket's ONLY in-check case)* | `true` | `true` |
| start position | `false` | `false` |
| `4k3/8/8/8/8/8/8/4R1K1 b - - 0 1` *(added)* | **`false`** | **`true`** |

The ticket's own FEN measures `{result:"black-wins",reason:"checkmate"}` with `legalMoves` **0** — it
is fool's mate, a position the loop has already stopped on. The two stated cases **cannot
distinguish** the builds. The added plain-check FEN (4 legal replies, `in-progress`) separates them.

**M3 — a claim cell that always names both rules (`A8`, D6).**

| case | correct cell | always-both build | passes as worded? |
|---|---|---|---|
| A1 line, 3rd occurrence | `white … threefold-repetition` | `white … threefold-repetition + fifty-move` | **yes** — it "names a claimable threefold repetition attributed to White" |
| clock 100 | `white … fifty-move` | `white … threefold-repetition + fifty-move` | **yes** — it "names the fifty-move claim" |
| both | `white … threefold + fifty-move` | same | yes |
| nothing | `""` | `""` | yes |

**Four for four.** Killed by the `Does NOT contain` column now on every row of `A8`.

**M4 — the row count nobody pinned (`A11`, D8).** `frameHeight({board: 9, status: N, history: 8})`,
run against merged `src/frame.ts`:

```
  N=1 -> 21 rows   fits a 24-row TTY in place: true
  N=2 -> 22        true
  N=3 -> 23        true      <- the epic's reference layout
  N=4 -> 24        true      <- last value that fits
  N=5 -> 25        FALSE
  N=7 -> 27        FALSE
```

At `N ≥ 5`, `beginFrameSession` finds `sink.rows >= height` false on a standard terminal, takes the
**append** path, and epic acceptance `4b` — the in-place redraw with no stale rows — becomes
unreachable. **No test anywhere fails.** Every criterion said "identical", which a 1-row and a 7-row
panel both satisfy.

## 3. Constructions — the positions the criteria needed and did not have

All driven against merged `src/`, all reproducible.

| Purpose | Given | Measured status |
|---|---|---|
| threefold only (`ABC-020` A1, re-driven) | `6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 0 1` + `Kh1 Bb6 Kg1 Ba5 Kh1 Bb6 Kg1 Ba5` | `{in-progress, claimable:{by:"white", draws:["threefold-repetition"]}}`, live FEN `… w - - 8 5`, occurrences **3** |
| fifty-move only (`ABC-020` A2) | `6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 100 60`, empty move list | `{by:"white", draws:["fifty-move"]}` |
| **BOTH — this position did not exist** | `6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 92 60` + the same 8 plies | `{by:"white", draws:["threefold-repetition","fifty-move"]}`, live FEN `… w - - 100 64` |
| attribution flipped (`A9`) | `6k1/5ppp/8/b7/8/8/5PPP/4R1K1 b - - 100 60` | `{by:"black", draws:["fifty-move"]}` |
| nothing claimable | start position | `{result:"in-progress", reason:null}`, `claimable` **absent** |

The "both hold" case is a shuffle from a clock of **92**: eight plies of the A1 line reach the third
occurrence at clock exactly **100**. The ticket said *"Given both hold"* and left the construction to
whoever wrote the test — which, on a criterion where the naive attempt collides with the fivefold
(≥ 5) and seventy-five-move (≥ 150) automatic thresholds, is not a small ask.

**Order:** `draws` is documented as *"ordered threefold first, then fifty-move"* (`src/gameend.ts:53`)
and the panel must render that order without re-sorting it. A second sort is a second opinion.

## 4. Claims in the ticket, checked at source rather than inherited

| Ticket said | Verdict |
|---|---|
| `isInCheck` at `src/legal.ts:32`, reports on the side to move | **TRUE** — line 32, `isSquareAttackedBy(position, kingSquareOf(position, black), !black)` |
| *"a position in which the side not to move is in check is … unreachable through legal play"* | **TRUE of play, FALSE of a loaded FEN.** `parseFen("4k3/8/8/8/8/8/8/4R1K1 w - - 0 1")` **succeeds**; Black is in check; `isInCheck` answers `false` about White. `ABC-010` is in `Backlog`. **The same ticket relies on the loaded-FEN case for its move number**, so two of its paragraphs assumed opposite things |
| `makeMove` increments `fullmoveNumber` when the side that just moved was black, before the flip | **TRUE** — `src/apply.ts:145`. Driven: start `1` / after `1.e4` `1` (black to move) / after `1.e4 e5` `2` |
| a FEN with fullmove 27 and an empty move list renders `27.` | **TRUE** — `parseFen(… 0 27).fullmoveNumber === 27` |
| `toSan` of `Ng1f3` against the position before it is `Nf3` | **TRUE** |
| the history makes "the position before the last move" reachable | **TRUE, by REPLAY ONLY.** `GameHistory` is `{initialFen, moves, position}` — no undo stack (`ADR-0002` clause 2 forbids one), no stored `UndoRecord`, **no clone function anywhere in `src/`** (`src/history.ts` header says so). The ticket named no derivation; see M1 for what happens |
| `gameStatusOf(history)` exists with that shape and returns what item 7 needs | **TRUE** — `src/history.ts:152`, returns `GameStatus` with `claimable?: DrawClaims` carrying a required `by`. **What is false is that it is free** — see §1 |
| material `0` / `-9` / `+8` | **TRUE** under P 1 · N 3 · B 3 · R 5 · Q 9 · K 0 — values the ticket never stated |
| the panel is three rows | **NOT PINNED BY ANYTHING** — see M4 |

## 5. Two structural facts worth carrying beyond this ticket

**(a) `NFR-002`'s `O(window)` boundary condition rests on a structural fact that item 7 would have
expired.** Security/NFR verified it at `ABC-012`'s gate on the ground that *"`src/history.ts` has
ZERO importers, so nothing pulled the repetition derive into a frame"*. As now specified the panel
imports `GameHistory` as a **type only** and replays through `fen.ts` + `apply.ts`, so **the fact
survives this ticket**. As originally written, `ABC-016` was that importer. Flagged for the
`NFR-002` row's owner (Architect/Design), **not edited** — `ABC-026`'s hop is in that file today.

**(b) `ABC-016` item 4 and `ABC-017`'s pane need the same replay**, to ply *n*−1 and to the window's
first ply respectively, and at frame level each pays its own `parseFen` and its own walk. Neither
bar breaks (10.0 µs + ~75 µs against a 16 ms frame) and **no shared helper is prescribed** — recorded
so the second of the two does not discover it, and so `ABC-018` knows the frame's compute is the
**sum** and not the max.

## What this note does not claim

No wall-clock assertion is proposed for the suite — this project's standing rule; the microseconds
live in `plans/nfr-catalog.md` with their machine and the suite pins the **counts**. These figures
are one machine's and are `UNKNOWN - verify` anywhere else. The per-round spread is reported (worst
cell 4.28–6.75 µs at 0 plies, everything else within 5%) and **no attribution is offered** for the
first-round outliers beyond "warm-up leakage", which this hop did not chase.
