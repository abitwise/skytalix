---
id: 20260811T133500Z-architect-design-observation-9c31b0a7
kind: observation
by: architect-design
at: 2026-08-11T13:35:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-018
  - ABC-019
  - EPIC-002
  - ADR-0009
  - ADR-0010
  - src/frame.ts
  - src/frame.test.ts
supersedes:
---

# The measurements: the defect prints a WRONG MATERIAL COUNT, survives 17 frames, and fires on a QUIET game — and three things about the original flag were off

> **Hand-authored**; no `finding` is issuable to this role. Everything below was RUN against merged
> `src/` and the DELIVERED `ABC-016` panel (read read-only from `grugops/ABC-016-status-panel` via
> `git show`; that branch was never checked out and never written). Harnesses ran on copies outside
> the repository — **`src/` is byte-identical, 0 lines changed.**

## 1. The flag's numbers are right; three things around them are not

BA/PM's **17** and **67** panel widths both reproduced exactly. Three corrections, each of which
moved the decision:

**(a) The FRAME never swings 50.** `W = max(board, status, history)` and `renderBoard` is **18** wide,
so the status panel alone cannot take the frame below 18. Swing with the board alone: **18 → 67 = 49**.
With a conformant `ABC-017` pane at 24: **24 → 67 = 43**. Worst swing measured in an actually played
game: **50 → 24 = 26**.

**(b) The claim cell is the RARE case. The common case is small, frequent, and has nothing to do with
draws.** Driven by merged `gameStatusOf` over `ABC-017`'s own 20-ply line, **no draw ever claimable**:

| line | `HISTORY_COLS` | distinct `W` | `W` changes | **narrowings** | worst |
|---|---|---|---|---|---|
| quiet 20-ply | 0 | 18, 21, 22, 23, 24 | 14 | **6** | −2 |
| quiet 20-ply | 21 | 21, 22, 23, 24 | 13 | **6** | −2 |
| quiet 20-ply | 24 | 24 | 0 | **0** | — |
| knight shuffle → threefold | 24 | 24, 50 | 2 | **1** | −26 |

Six narrowings in twenty quiet plies, from `last: <SAN>` (`e4` → `exd4` → `O-O`) and the move number
gaining digits. **A fix aimed at the claim cell fixes the case that almost never happens.**

**(c) The panel has FIVE variable cells, not two.** Measured panel widths: **17, 22, 26, 45, 50, 67**.
Move number, `CHECK`, the SAN in `last:`, the material balance and the claim cell all move. `A7`
reserves only the *thinking* cell.

## 2. The defect is a WRONG NUMBER on screen, not a smudge

Merged `assembleFrame` + `beginFrameSession` written into a terminal model implementing this module's
escape grammar. **5/20** redraws stale on the shuffle line; **8/20** on the quiet line at
`HISTORY_COLS` = 21.

| what the frame says | what the player sees |
|---|---|
| `last: c3  material: 0` | `last: c3  material: 00` |
| `last: cxd4  material: 0` | `last: cxd4  material: 01` |
| *(empty row — no claim)* | `claim: threefold repetition` |

**A wrong material readout and an expired draw claim still being offered.** That is misreported game
state.

## 3. It does NOT self-repair — 17 consecutive frames

Longest unbroken run of frames carrying the residue after one narrowing: **17**. `\x1b[0J` erases
downward from the end of the new frame and **never** rightward. `EPIC-002`'s accepted-cosmetic-defect
posture for SIGWINCH rests on *"`4b`'s erase-to-end-of-screen repairs the display on the next frame"* —
**sound for rows, unsound for columns.**

## 4. A producer-side width rule is green by MASKING

The same panels, the same game, the same writer — only a constant **in a different ticket** changes:

| `HISTORY_COLS` | stale frames, quiet 20-ply line |
|---|---|
| 24 | **0/20** |
| 21 | **8/20** |

At 24 the pane hides the status panel's 17 → 24 swing entirely. This is `ADR-0009` cl. 9(v)'s landmine
(*"green at its own gate, armed for the rebase"*) arriving through the width door, and it is the
central evidence for consumer ownership.

## 5. `H` is invariant; `W` is not — the asymmetry the whole ruling turns on

Re-running `ADR-0009` cl. 9(i)'s sweep for width — 510 shapes (status × history 0–16 × five
message-region shapes × both glyph modes):

| quantity | result |
|---|---|
| `H` vs `frameHeight(...)` | **0 mismatches** |
| `H` under the message region | **invariant** |
| `W` over the same sweep | **4 distinct values: 22, 24, 45, 67** |

Freezing `W` at frame 1 truncates `White may claim: threefold repetition, fifty-move rule` to
**`White may c`** and loses **8 panel rows** across one 20-ply game.

## 6. Candidates scored by running them, and the correction I had to make

Six width mutants × two games, into the terminal model. Score = redraws whose screen differs from the
frame. **Three candidates score zero**, so this table does not decide it:

| mutant (shuffle / quiet) | N nothing | P producer reserves | C consumer clears | S session-frozen `W` |
|---|---|---|---|---|
| W0 delivered | 5/20 · 0/20 | 0 · 0 | 0 · 0 | 0 · 0 |
| W1 status gains a longer cell | 10/20 · 16/20 | 0 · 0 | 0 · 0 | 0 · 0 |
| W2 history ships VARIABLE width | 5/20 · 8/20 | 0 · 0 | 0 · 0 | 0 · 0 |
| W3 board ships a wider row | 5/20 · 0/20 | 0 · 0 | 0 · 0 | 0 · 0 |
| W4 loaded FEN, huge fullmove | 5/20 · 8/20 | 0 · 0 | 0 · 0 | 0 · 0 |
| W5 message item longer than `W` | 5/20 · 0/20 | 0 · 0 | 0 · 0 | 0 · 0 |

The dimensions it cannot see are what decide it:

| candidate | panel rows LOST | `W` over the game | blank cols, quiet frame | bytes/frame |
|---|---|---|---|---|
| N nothing | 0 | {24, 50} | 6 | 621 |
| P producer reserves | 0 | **{67} always** | **49** | 1567 **(+152%)** |
| **C consumer clears** | 0 | {24, 50} | 6 | **690 (+11%)** |
| S session-frozen `W` | **8 LOST** | {24} | 6 | 621 |

> **[CORRECTION, recorded rather than silently fixed.]** My first run of this table scored `S` as
> *"claim text intact: YES"* and `N`, `P`, `C` as *"NO"*. **Every cell of that column was wrong.** The
> check looked for the **two-claim** string while the driving game only reaches **threefold**, so it
> never appeared and the three sound candidates were scored as truncating. `S` scored "intact" for the
> opposite reason — it had truncated the cell so hard that the substring the check keyed on was
> **gone**, so the test never fired. **A check that reports success because the thing it looks for was
> destroyed is worse than no check.** The honest form asserts every non-blank row the panel PRODUCED
> survives, trimmed, in the assembled frame. Verdict unchanged; trustworthiness of the reason changed.

Under `P` the board occupies **columns 1–18 of a 67-column frame** on an 80-column terminal, in every
frame, forever.

## 7. Which assertion form catches it — epic `4b` does NOT

Real narrowing pair (threefold claim expiring on a pawn move) vs a steady pair, three screen widths:

| form | narrowing @ `W`(frame 1) | narrowing @ 80 | steady @ 80 |
|---|---|---|---|
| **F1** epic `4b` *"zero ROWS from frame N"* / merged `:381` | CATCHES | **BLIND** | PASS |
| **F2** merged `:379` screen equals frame | CATCHES | CATCHES | **FALSE POSITIVE** |
| **F3** screen equals frame, **trimmed** | CATCHES | CATCHES | PASS |
| **F4** every frame's `W` equals session `W` | CATCHES | CATCHES | PASS |

- **Epic `4b` as worded does not cover this at any real terminal width.** F1 fires only at the
  artificial width `W`(frame 1). **BA/PM's reading was right**; the merged test's apparent coverage is
  a fixture artifact.
- **The merged `:379` form cannot be reused as-is** — it false-positives on any screen wider than the
  frame, i.e. every real terminal.
- **F4 is correct under `P`/`S` and WRONG under `C`.** The criterion is downstream of the ownership
  decision.

## 8. The merged suite structurally cannot see this

Over **301 plies × thinking × 4 message shapes**, merged `src/frame.test.ts`'s fixtures produce
`W` ∈ **{18}** — one value. `statusStub` maxes at **13**, `historyStub` at **14**, so the real board
pins `W`. **No test in the merged suite can narrow a frame.** A suite hole, not a production defect —
`assembleFrame` is correct and is not touched.

## 9. `4b` / `4c` are not breached by the adopted fix

- **`4c` untouched, measured:** the append path emits **0 escape bytes** on both the non-TTY and
  short-TTY sinks. Only the in-place branch changes.
- **`4b`'s *"in one operation"*** governs the end-of-frame→end-of-screen erase — its own parenthetical
  names the target as *"not cursor-up-by-counted-lines"*. The fix keeps exactly **one** `\x1b[0J`,
  emits no count and no cursor movement, and still writes each frame in **one** `write()`.
- **Stated so it can be checked:** BA/PM read candidate (ii) as *"reads against"* that clause. **I do
  not take that reading**, for the reasons above. If the owner does, `4b` needs a wording hop and that
  is BA/PM's, not an ADR's.

## 10. Two side findings, neither mine to fix

- **A loaded FEN with `fullmoveNumber` ≥ 1e21 renders as `White to move  1e+21.`** — exponential
  notation, a wrong move number shown to the player. `parseFen` imposes **no upper bound** (only
  `>= 1`, `src/fen.ts:179`). Same class `ABC-017` already carries as an accepted limitation pointing at
  **`ABC-010`** (FEN semantic validation, `Backlog`). **Observation only; carried, not owned.** It also
  means the panel's width IS bounded at 67 — row 1 cannot outgrow the claim row.
- **`NFR-002`'s 418-character figure is CORRECT and its scope was unstated.** 418 is
  `frame.join("\n")`; the stream actually **written** is **425 characters / 489 bytes**, the difference
  being `\x1b[H` (3) + `\x1b[0J` (4). Not drift, not an error — two different quantities. Recorded in
  the catalog so the 7-character gap is never read as staleness.
