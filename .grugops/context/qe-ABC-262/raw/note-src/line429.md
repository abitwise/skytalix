# qe-ABC-262 A4 waiver re-read: src/legal.ts:429 is correct in production; QB is masked by the epoch-0 alias and caught by ENGINE_DEEP

These are read from the code at `39a6237e` (`src/legal.ts` is unchanged from `767a2e3e`). Nothing called module-private state.

- **Line 429** reads `      (inCheck || pinStamp[from] === epoch) &&` and then `!staysSafe(position, move, kingHome, moverIsBlack)` on line 430. This was confirmed by `sed -n 429p`.
- **In check** (`inCheck` true): `||` short-circuits, so every quiet queen promotion takes `staysSafe`, and `pinStamp` is never read. `epoch` stays at its initial `let epoch = 0` (line 406), because `markPins` runs only `if (!inCheck)` (line 417). Production is correct in check.
- **Out of check:** `epoch = markPins(...)` returns a value ≥ 1:
  - `(pinEpoch + 1) >>> 0`;
  - on wrap to 0 it does `pinStamp.fill(0)` and sets 1 (lines 242–246: `let epoch = (pinEpoch + 1) >>> 0` at 242, `pinStamp.fill(0)` at 244).
  - So only shields stamped on this call equal `epoch`, and stale or never-stamped squares (< `epoch`) do not. Production is correct out of check.
- **Why QB survives the row:** QB turns the guard into `((inCheck && !moverIsBlack) || pinStamp[from] === epoch)`. For black in check, the right operand is `pinStamp[from] === 0`. `pinStamp` is a module `Uint32Array(128)` (line 233) that starts zeroed, and squares are only ever stamped with epochs ≥ 1. So on any square that no earlier `markPins` stamped (a2 = 16 on P1′ in a fresh test file), the operand is true and the test is still taken. QB is only wrong where `pinStamp[from]` is non-zero, which needs an earlier stamp of that exact square.
- **Where QB dies:** the ENGINE_DEEP `ABC-254 A1` walk (six perft roots, 518 474 nodes). It stamps squares across positions and fails on `kiwipete 20-65 39-22 65-99` with an extra illegal black g2–g1=Q (`raw/plants/QB.ENGINE_DEEP-A1.txt`; C0 control green). This matches `qe-ABC-261`'s reading.
- **QE's ruling on the waiver:** I agree with it. A4's plant is masked by an alias in the *plant*, not by a hole in production or in the row. QE's own QBe (QB without the alias) turns the row red on P1′. The remaining exposure is QE-262-a.
