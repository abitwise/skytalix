---
id: 20260811T235000Z-security-nfr-observation-7d40ca6b
kind: observation
by: security-nfr
at: 2026-08-11T23:50:00Z
verified_by:
confidence: high
refs:
  - security-nfr-ABC-027
  - ABC-027
  - ABC-015
  - ABC-018
  - ABC-019
  - EPIC-002
  - EPIC-006
  - src/frame.ts
supersedes:
---

# THE SECURITY HALF: TRIGGERED, RUN, AND CLEAN — said out loud rather than skipped, because a gate that quietly declines to run is indistinguishable from one that ran and found nothing

> **Hand-authored** — `scripts/context-io.ts` absent here and from the kit,
> `mcp__grugops__propose_note` not in this session's tools. **`observation`, not a `finding`.**

## Is the security half triggered at all? YES, and the reason is not the one in the ticket

The ticket says *"no security trigger, and it is structural rather than a judgement."* **The
conclusion is right and the reasoning is incomplete.** `ABC-027` introduces no input, that much is
true — but it takes a stream that carried **2 escape sequences per frame** and makes it carry
**`H + 1` = 24**, which is 22 more places where a byte that should be data would be read as a command.
*"This change emits more ANSI escape bytes into a terminal"* is a risk-bearing surface on its face and
is worth thirty minutes rather than a sentence. `security.asvs_level` is `L1`; the relevant `L1`
concern is output encoding / injection into an interpreter, and a terminal is an interpreter.

**So it was run. The result is clean, and here is the evidence rather than the assurance.**

## Structural: no argument reaches the escape sequence

`src/frame.ts` — the changed expression is

```
sink.write(`${CURSOR_HOME}${frame.join(`${ERASE_TO_END_OF_LINE}\n`)}${ERASE_TO_END_OF_SCREEN}`);
```

The join separator is a template of **two module constants** (`ERASE_TO_END_OF_LINE = "\x1b[K"` at
`:66-73`, and a literal newline). **No parameter, no closure variable and no element of `frame`
participates in the construction of any escape sequence** — the frame's rows are only ever
concatenated BETWEEN the constants, never interpolated INTO one. The module imports nothing that could
supply a sequence: its only import is `import type { GlyphMode }`, a type-only edge that erases.

**`\x1b[K` is also the least dangerous CSI available for this job**: an erase. It cannot move the
cursor, set a mode, switch a character set, alter scroll regions, or open a reply channel, so it
cannot desynchronise the terminal state or be chained into something that does. Compare `\x1b[6n`,
which reads back.

## Measured: 180 cases, zero escape bytes from supplied data

Own harness outside the repository, driving the **delivered** modules: **30 adversarial payloads × 2
glyph modes × 3 placements (message region, a status row, a history row) = 180 cases.** The payloads
include `\x1b[2J`, `\x1b[H`, `\x1b[K`, `\x1b[0J`, an OSC title set `\x1b]0;pwned\x07`, the alternate
screen `\x1b[?1049h`, a DCS `\x1bP+q544e\x1b\\`, a cursor-position **report** request `\x1b[6n`, SGR,
`\x1b(0` and `\x1b#8`, the 8-bit C1 forms `\x9b2J` / `\x9dpwned\x9c` / `\x84`, a lone `\x1b`, embedded
`\x00 \x07 \x08 \x0b \x1f \x7f \r \n \t`, a BOM, zero-width spaces, 500 `x`, and 50 `♛`.

Every escape byte in what the sink received was accounted for against the module's own three
constants. **180 / 180 clean:**

- **unaccounted `\x1b` bytes: 0** in every case — `count(\x1b) == count(\x1b[H) + count(\x1b[K) + count(\x1b[0J)` exactly;
- `\x1b[H` exactly **1**, `\x1b[K` exactly **`H − 1`**, `\x1b[0J` exactly **1**, in every case;
- with the module's own sequences removed: **0 C0 controls and 0 `U+007F`** survivors (the newline
  separators excepted, which are the writer's own);
- **0 code points above `U+007F`** in ASCII mode;
- row count constant at `H` in every case, including the 500-character item and the 50-glyph item.

`sanitize` at `src/frame.ts:101-110` is doing the work, it is untouched by this ticket, and this gate
verified it on the delivered build rather than taking the ticket's word for it.

**Consistent with `ABC-018`'s gate and NOT a re-litigation of its C1 ruling:** that gate ruled
stripping C1 would be theatre because a clean unicode frame already carries 64 C1-range **bytes** from
the module's own glyph table (`0x9B` is the black queen `♛` = `E2 99 9B`). Nothing here reopens it;
`ABC-027` adds `1B 5B 4B`, which contains no C1 byte, and the control that makes unicode mode safe is
still mode selection (`ABC-015`), owner `EPIC-006`.

## The one thing worth writing down, and it is NOT introduced here

**`beginFrameSession` does not sanitize. The escape-freeness of the emitted stream rests entirely on
callers routing their rows through `assembleFrame`** — the writer accepts `readonly string[]` and
concatenates it verbatim. Measured, not assumed: a hand-built frame array containing `\x1b[2J` reaches
the sink unaltered.

This is **pre-existing and unchanged by `ABC-027`** — `main`'s `frame.join("\n")` has exactly the same
property, so the ticket introduces no new exposure and no fix is required of it. It is recorded because
`ABC-027` changes what an inspector would see: before, a frame's emission was 2 escapes and anything
else was obviously foreign; now it is 24, and one more would not stand out. **The first caller that
composes frames in a loop is `ABC-019`.** Owner and trigger are in the decision note.

**No compliance regime is set** in `.grugops/factory.config.json`, so nothing hands to the Compliance
Officer. No authentication, permission, secret, personal-data, payment, upload, migration, queue or
external-integration surface is touched — this module writes bytes to one sink and reads nothing
ambient.
