---
id: 20260811T234000Z-security-nfr-observation-3c81f0a5
kind: observation
by: security-nfr
at: 2026-08-11T23:40:00Z
verified_by:
confidence: high
refs:
  - security-nfr-ABC-027
  - quality-gate-ABC-027-qe
  - abc027-secnfr-2026-08-11
  - ABC-027
  - ABC-018
  - ABC-019
  - ADR-0010
  - EPIC-002
  - EPIC-006
  - src/frame.ts
  - src/frame.test.ts
supersedes:
---

# THE MARGIN QUESTION IS ANSWERED BY MEASUREMENT, NOT BY DISPOSITION: QE's pending-wrap reading is CORRECT on a real terminal emulator, and `ABC-027` as delivered LOSES THE LAST COLUMN OF EVERY FULL-WIDTH ROW at a terminal exactly `W` wide

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repository or in the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **This is an `observation`, not a
> `finding`** — no `§14-gate#<id>` stamp is issuable to me and the §14 gate machinery does not exist
> here, so nothing in this file is self-attested as verified.

## What I did NOT do

**I did not fabricate a terminal, and I did not extend QE's model.** QE was asked for a risk
disposition because it could not run a terminal. I found one that is installed on this machine and
ran the delivered bytes through it.

## The instrument, named so it can be judged

**GNU screen 5.0.2** (`/opt/homebrew/bin/screen`, build 2026-07-11) — a real terminal emulator with
its own screen buffer, driven ATTACHED to a pty whose winsize this gate set with `TIOCSWINSZ`, so the
emulator's window is exactly the column count under test. The screen contents are read back with
**screen's own `hardcopy` command** — screen's buffer, not a model written here. `TERM=xterm-256color`,
`LC_ALL=en_US.UTF-8`, one fresh emulator process per cell, window cleared with `\x1b[H\x1b[2J` before
every payload.

Machine: **Apple M3 (Mac15,13) / Darwin 25.5.0 arm64 / Node v24.12.0**. `UNKNOWN - verify` on any
other emulator — see the coverage risk in the decision note.

## The primitive, isolated with two controls, at a 10-column window

| payload | bytes | screen buffer, row 0 |
|---|---|---|
| control A | `ABCDEFGHIJ` (exactly 10 = the width) | `ABCDEFGHIJ` — **10 cells, all survive** |
| control B | `ABCDEFGHI` + `\x1b[K` (9 = below the margin) | `ABCDEFGHI` — **erase below the margin harms nothing** |
| **test** | `ABCDEFGHIJ` + `\x1b[K` (10 = AT the margin) | **`ABCDEFGHI` — the last cell is ERASED** |
| cursor probe | `ABCDEFGHIJ` + `\x1b[K` + `x` | row 0 `ABCDEFGHI`, row 1 `x` — **the wrap-pending flag SURVIVED the erase** |

Controls A and B differ from the test by exactly the three bytes of `\x1b[K`, so the erased cell is
attributable to the escape and to nothing else.

**QE's second reading is the one a real emulator implements.** The cursor sits at `columnCount − 1`
with wrap pending; `EL(0)` erases from the cursor, i.e. that cell; and the pending wrap is still
pending afterwards. **The suite's screen model, which lets `column` run to `columnCount` and makes the
erase a no-op there (`src/frame.test.ts:212-215`, `:250-256`), is measurably WRONG at the margin.**

## The delivered writer, end to end, through the same emulator

Frame built from the DELIVERED modules read-only (real `renderBoard` 9 × 18, a 3-row status stub, an
8-row history stub, `H` = 23, `W` = 18), emitted through the DELIVERED `beginFrameSession` in-place
branch. The merged emission was reconstructed from `main`'s `src/frame.ts:216` expression and run as
the baseline in the same session.

| window | writer | screen buffer |
|---|---|---|
| cols = 18 (**= `W`**) | merged | **all 9 board rows intact**, `8 .r:n.b:q.k:b.n:r` / `   a b c d e f g h` |
| cols = 18 (**= `W`**) | **delivered** | **9 rows lose their last cell** — `8 .r:n.b:q.k:b.n:` / `   a b c d e f g` |
| cols = 19 (`W` + 1) | delivered | all rows intact |
| cols = 80 | delivered | all rows intact |
| cols = 12 (`< W`, wraps) | merged **and** delivered | identical to each other; the wrapped/scrolled shape `EPIC-002` accepts as cosmetic |

Repeated in **unicode glyph mode under `screen -U`**, the product's default on a UTF-8 terminal, with
the same result: `8 .♜:♞.♝:♛.♚:♝.♞:` and `   a b c d e f g`.

**This is a REGRESSION INTRODUCED BY THIS TICKET.** The merged writer scores clean at the same width
on the same instrument in the same session; the delivered writer does not. **The lost cells are the
board's entire h-file plus its file label** — QE predicted exactly these 9 rows from the model, and the
emulator produced exactly them.

## And the ticket's own value is CONFIRMED on the same instrument

The four-frame narrowing sequence from `## The measurement that makes these criteria non-vacuous`
(`W` = 37, 18, 38, 18 in ascii mode — 38 not 39 because ASCII mode strips the em dash), written
through one session onto an 80-column emulator:

| writer | screen row 11 after the fourth redraw (the frame says it is EMPTY) |
|---|---|
| merged | `                  to move out of check` — **the stale tail, on a real terminal** |
| **delivered** | **empty — the defect is FIXED** |

**Both halves of this ticket are now measured on a real terminal rather than on a model: the defect it
fixes is real, and the regression it introduces is real.**

## The trigger is exact, and that is the bound

The divergence is reachable at **`terminal columns == W` exactly**, and nowhere else:

- `C > W` — the erase fires at column `W`, below the margin; model and emulator agree; **clean**
  (measured at 19 and at 80).
- `C == W` — every row `0 … H − 2` is padded to exactly `W`, so **every** row ends at the margin and
  **every** row loses its last cell. Rows whose last cell is a pad space lose nothing visible; the
  rows that lose content are those whose content reaches column `W − 1` — **9 of 23 in the reference
  layout, and they are the board.**
- `C < W` — the frame wraps; `EPIC-002` accepts this class as cosmetic and out of scope, and the
  delivered writer is **not worse** than merged there (measured at 12; QE measured 30/24/20 by model
  and found delivered equal or better).

`W` is a per-frame max over delivered panel rows, so a fixed terminal at `C == W` for one frame may be
at `C > W` for the next — the loss appears and disappears with the widest panel row. It is **not**
cumulative: each frame rewrites every row from column 0.

## How far the emulator result generalises — stated exactly, not stretched

One emulator was measured. What can be said beyond it is a capability, not a behaviour: `xenl` — the
magic-margin capability that IS the deferred-wrap state this gate measured — is declared by the
terminfo entries for **`xterm`, `xterm-256color`, `screen`, `screen-256color`, `vt100`, `vt220`,
`Apple_Terminal`, `tmux-256color` and `linux`** on this machine, all of which also spell `el` as
`\x1b[K`. **That establishes they share the last-column state; it does NOT establish that each erases
the last cell.** iTerm2 and Alacritty have no terminfo entry here and nothing is claimed about them.

**One real emulator is enough to make the regression real. Nothing about the remaining emulators can
make it un-real, so the residual unknown does not change the disposition.**

## The candidate remedy, MEASURED rather than proposed — `src/` was NOT edited

The candidate emission was built in this gate's own harness, outside the repository, and run through
the same emulator. `src/` is byte-identical to the branch head; this gate wrote no production line.

```
delivered : CURSOR_HOME + rows.join(EL + "\n") + ED      <- erase AFTER each row, i.e. AT the margin
candidate : CURSOR_HOME + EL + rows.join("\n" + EL) + ED <- erase BEFORE each row, i.e. at COLUMN 0
```

| candidate, same emulator | result |
|---|---|
| cols = 18 (**= `W`**), steady frame | **all 18 columns intact — the h-file and its label survive** |
| cols = 80, the four-frame narrowing sequence | **row 11 empty — the ticket's defect is still fixed** |

Cost: **494 characters against merged's 425 — `+69` = `H × 3`**, three characters more per frame than
the delivered `+66` = `(H − 1) × 3`. Escapes `H + 2` = 25, of which `H` = 23 are `\x1b[K`.

**Why it is safe by construction and not merely by measurement:** every erase fires with the cursor at
column 0, where the margin state cannot exist, so the model and every emulator agree there whatever
their margin representation is. It also makes the suite's four screens-at-exactly-`W` assertion sites
(`:379`, `:408`, `:426`, `A6`) rest on a behaviour that is no longer load-bearing.

The trailing `\x1b[K` on the reserved prompt row is redundant with the `\x1b[0J` that follows it, on
the same argument the module already makes for the last row — 3 characters, and the arithmetic is
BA/PM's at the criterion hop, not this gate's.

## What this does to `A1`

**`A1` currently pins the unsafe emission byte for byte** — *"the frame's rows joined by `\x1b[K` +
newline"*, `\x1b[K` count `H − 1`, `\x1b` count `H + 1`, byte delta exactly `(H − 1) × 3`. The
candidate is `H`, `H + 2` and `H × 3`. So **`A1` as written forbids the shape that survives a real
terminal**, and it is also the criterion QE measured as killing 9 of the 14 mutants. Its numbers must
move with the fix. That is BA/PM's, not the Engineer's and not this gate's.
