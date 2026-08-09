---
id: 20260809T102100Z-security-nfr-observation-3dcd09a5
kind: observation
by: security-nfr
at: 2026-08-09T10:21:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-018
  - ABC-018
  - ABC-014
  - ABC-015
  - ABC-016
  - ABC-017
  - ABC-019
  - EPIC-003
  - EPIC-006
  - RISK-005
  - src/frame.ts
  - src/render.ts
  - src/glyph-mode.ts
  - plans/tickets/ABC-018-frame-output-and-redraw.md
  - 20260809T094600Z-qe-e2e-observation-f9b3a54c
  - 20260809T094700Z-qe-e2e-decision-67ac270a
supersedes: 
---

# The escape-stripping bar, re-derived on this gate's own instrument — and the C1 question answered by measuring the board rather than the message

The ticket's measurable security bar is asserted **on the emitted stream** (its own third test note)
and **at byte level**, because the bar is about what reaches a terminal and a terminal reads bytes.
QE's suite was not cited as evidence: a suite is what the delivered code passes, and this gate needs
what the delivered code *emits*.

## The instrument

Own harness **outside the repository**, importing the branch tip's `src/frame.ts` and the merged
`src/render.ts` directly. The board is the **real merged `renderBoard`**, never a stub, so `W = 18`
falls out of shipped code; `ABC-016` and `ABC-017` enter as the fixed-height stubs the ticket
prescribes. Every control character in the corpus is written as a `\uXXXX` escape or built with
`String.fromCharCode`, and the corpus's code points were dumped and checked before it was used.

**The corpus — 21 strings, chosen for what a terminal DOES with them, not for what looks alarming:**
every C0 code point in one string (the bar is a **range**), `U+007F`, `ESC[2J`, the module's own two
sequences supplied as data, OSC-0 (window title, BEL-terminated), OSC-8 (hyperlink), DCS passthrough,
alternate-screen, **DSR `ESC[6n` — the one sequence that makes a terminal WRITE BACK into the
player's own input stream**, 8-bit CSI `U+009B` and 8-bit OSC `U+009D`, `U+0085`/`U+0080`/`U+009F`, a
NUL run, CR overstrike, an RTL override (the Trojan Source shape), ZWSP and BOM, combining marks, an
astral surrogate pair, the epic's own example rejection text, and the criterion's own `é`/`♞` in both
decomposed and precomposed form.

## The result — 21 strings × 2 glyph modes × 2 strategies, in the MESSAGE region and in a PANEL row

**0 ESC bytes from supplied data · 0 C0 bytes · 0 `U+007F` · 0 code points above `U+007F` in ASCII
mode · frame row count CONSTANT at 23 · exactly ONE `write` call per frame (84 frames, 84 writes) ·
exactly the module's own two sequences in place (`ESC[H`, `ESC[0J`) and ZERO in append.**

The single-write count is not decoration: `NFR-007` says nothing here may block on I/O beyond the
single write, and this is that clause measured rather than read.

**Re-run in full under Node's permission model, and the instrument was proved ARMED first** — three
positive controls (`fs.writeFileSync`, `fs.readFileSync` outside the allowlist, `execSync`) all
`ERR_ACCESS_DENIED`. The campaign then completes unchanged, which proves the module performs no
filesystem operation and spawns no process while assembling and emitting a frame. That is `V1.2.5`
(OS command injection) and `V1.3.2` (no dynamic code execution) passing **on evidence** rather than
on a grep.

## TWO INSTRUMENT FAULTS, recorded because either would have produced a false result

1. **A FALSE MISS.** The first run reported **42 surviving C0 bytes** over 21 in-place frames.
   **ESC is itself a C0 byte** and 42 is exactly 2 per frame — the module's own cursor-home and
   erase. Append mode read 0 and gave it away. Subtracted, the count is 0.
2. **A FALSE PASS.** The C1 payload in one section was retyped rather than referenced, the C1 code
   point did not survive the editor, and the section measured `"2J"` and read 0 C1 code points —
   which would have looked like the module stripping C1. The corpus is now referenced **by index**.

Both faults were in the instrument. Neither was in the module. This project's record now carries
nine instrument-limit corrections; the seventh produced a 2.08x false miss on `ABC-012`.

## THE C1 QUESTION — measured on the BOARD, not on the message

QE characterized the behaviour and correctly did not decide it. Decided here, on this measurement:

| Frame (unicode mode) | bytes | bytes ≥ 0x80 | bytes in C1 range 0x80–0x9F |
|---|---|---|---|
| clean frame, **no supplied text at all** | 483 | 96 | **64** |
| the same frame + the whole C1 payload as a message | — | — | **69** |
| the same frame, ASCII mode, either way | 419 | **0** | **0** |

**All 64 come from the module's own glyph table** — the board alone accounts for all 64 — and they
are fully attributed: `U+2654`–`U+265F` encode as `E2 99 94`–`E2 99 9F`, so 32 pieces give 32 middle
`0x99` bytes plus their third byte, the 8 white pawns (`U+2659`) add 8 more `0x99` and the 8 black
pawns (`U+265F`) 8 `0x9F`. **The one 8-bit CSI byte `0x9B` is the BLACK QUEEN — `U+265B` =
`E2 99 9B`.**

So a C1 strip in the sanitizer would remove **5 of 69** such bytes and leave **64**. On a terminal
that decodes this stream as 8-bit rather than UTF-8, the board's own black queen is a CSI introducer
whatever the sanitizer does. The mitigating control is the terminal being UTF-8, and that is a
property of **mode selection** (`src/glyph-mode.ts`), not of sanitization.

**And the coupling is defeatable, which is why this is recorded as a risk rather than dismissed.**
`selectGlyphMode` row 1 gives ASCII to a non-UTF-8 locale — but **row 2 lets `--unicode` beat the
locale**, so a player on a `LANG=C` terminal who passes `--unicode` gets 64 C1-range bytes per frame.
`EPIC-006` owns that flag.

## Four further surfaces, each measured with a control

**1 — the control sits in the ASSEMBLER, not in the WRITER.** `beginFrameSession`'s writer takes
`readonly string[]` and emits whatever it is handed: a raw `ESC[2J` row emits **1 ESC byte**, while
the same payload through `assembleFrame` emits **0**. The type cannot express "sanitized". There is
no untrusted consumer in-process and `src/frame.ts` has **zero runtime importers** (verified here:
`grep` for a runtime import in non-test `src/` returns nothing), so this is a call-site obligation,
not a defect — and **no change is asked for**, because the VALUE/SESSION split is the ticket's own
design and matches `ABC-015`'s.

**2 — the prototype-chain gadget, with a live null control in BOTH directions** (the third on this
board). Unpolluted with `messages` genuinely absent → `assembleFrame` **THROWS TypeError**. With
`Object.prototype.messages = ["polluted ESC[2J"]` → it assembles and **displays the attacker's
text**, while the emitted stream still carries **0 ESC bytes**. Pollution deleted → it throws again.
So pollution turns a loud crash into a silent success, and it is **bounded: it can inject TEXT,
never an ESCAPE**, because the sanitizer runs over whatever the property yields. **There is no sink
either** — every computed-key write in non-test `src/` is a numeric array index (`position.board[…]`,
`rows[row]`), and there is no `__proto__`, no `Object.assign`, no `JSON.parse` and no merge anywhere
in `src/`.

**3 — the `mode` parameter's domain, and its FAIL DIRECTION.** Measured over eight values: `"ascii"`
→ **0** code points above `U+007F`; `"unicode"`, `"ASCII"`, `""`, `undefined`, `null`, `0` and a
plain object → **34** each. Every value that is not exactly `"ascii"` selects unicode. **This is the
opposite fail direction from `ABC-015`'s rule**, which returns ASCII on the ambiguous
`--ascii --unicode` pair precisely because ASCII is `RISK-005`'s fail-safe direction. The union is
erased at runtime and nothing checks it. Third appearance of this class on this board, after
`ABC-014`'s `GLYPHS[mode]` gadget and `ABC-015`'s flags half.

**4 — unbounded input.** `assembleFrame` places no bound on a supplied item's length, and the
packing search is quadratic in the item count. Figures are in this gate's `NFR-002` note; the
security-relevant shape is that the only input this module does not bound is the one that comes from
the player.

## A boundary found, located exactly, and shown to be UNREACHABLE

*"No emitted row exceeds `W`"* is a **display** invariant — a wider row wraps and adds a screen row,
which is the one way content breaks `4a`. The `(+N more)` marker is written into the region's last
row and then `padEnd(W)`, which does not truncate, so at `W ≤ 8` (marker 9 chars) or `W ≤ 9` with
`N ≥ 10` the region row **exceeds `W`**; measured at `W` = 4, 6, 8, 9 and confirmed clean at 10, 12
and 18. It cannot fire while the merged `renderBoard` is in the frame: `W` is the max over panel
rows, `renderBoard` is always 18 wide, and the marker reaches 19 characters only at `N ≥ 10^10`
supplied items. **A fence, not a risk. No change is asked for.**

## Failure modes and logging

This module logs nothing, and there is no logging anywhere in this project. Probed: a missing panel,
a non-array `messages`, a non-string row and a non-string item all throw `TypeError`; a sink whose
`write()` throws (**EPIPE — a reader that closed early, which is exactly `EPIC-006`'s pipe shape**)
propagates uncaught. **No error handling is asked for** — guarding calls that cannot fail through the
only future caller is the impossible-scenario handling `AGENTS.md` rule 8 forbids — but the frame
write is a throw site and `ABC-019`/`EPIC-006` own the loop around it. **One fail direction is a
positive and is recorded as one:** a nonsense height makes `(sink.rows ?? 0) >= height` false, so the
writer **appends** and emits zero cursor control. The strategy choice fails safe; only the glyph mode
fails open.
