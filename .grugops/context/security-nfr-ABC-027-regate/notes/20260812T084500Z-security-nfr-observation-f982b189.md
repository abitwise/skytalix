---
id: 20260812T084500Z-security-nfr-observation-f982b189
kind: observation
by: security-nfr
at: 2026-08-12T08:45:00Z
verified_by:
confidence: high
refs:
  - security-nfr-ABC-027-regate
  - security-nfr-ABC-027
  - ticket-to-pr-ABC-027-rf1
  - ABC-027
  - ABC-015
  - ABC-018
  - ABC-019
  - EPIC-006
  - src/frame.ts
  - src/frame.test.ts
  - 20260811T235000Z-security-nfr-observation-7d40ca6b
supersedes:
---

# THE SECURITY HALF RE-RUN ON THE SHIPPED BUILD — 180/180 CLEAN AT THE NEW COUNTS; AND THE THREE THINGS THE ENGINEER MEASURED, CHECKED RATHER THAN INHERITED — ALL THREE HOLD

> **Hand-authored** — `scripts/context-io.ts` absent from this repository and from the kit,
> `mcp__grugops__propose_note` not in this session's tools. **`observation`, not a `finding`.**

## Part A — the security half. TRIGGERED, RE-RUN, CLEAN.

The trigger is the one I named at the FAIL hop and it is stronger now, not weaker: `ABC-027` takes a
stream that carried **2** escape sequences per frame to **25** (`H + 2`), which is 23 more places
where a byte that should be data would be read as a command. `security.asvs_level` is `L1`; the
relevant `L1` concern is output encoding / injection into an interpreter, and a terminal is an
interpreter. It was re-run against the SHIPPED build rather than carried over.

**Structural, re-read at source.** `src/frame.ts:238-240` is

```
`${CURSOR_HOME}${ERASE_TO_END_OF_LINE}${frame.join(`\n${ERASE_TO_END_OF_LINE}`)}${ERASE_TO_END_OF_SCREEN}`
```

Three module constants and a literal newline. **No parameter, closure variable or element of `frame`
participates in the construction of any escape sequence** — the rows are only ever concatenated
BETWEEN the constants, never interpolated INTO one. The module's only import is a type-only
`GlyphMode`, an edge that erases. `\x1b[K` remains the least dangerous CSI available for this job: an
erase cannot move the cursor, set a mode, switch a character set, alter a scroll region, or open a
reply channel, so it cannot desynchronise the terminal or be chained into something that does.

**Measured on the shipped build: 180 cases, zero escape bytes from supplied data.** 30 adversarial
payloads x 2 glyph modes x 3 placements (message region, a status row, a history row). Payloads
include `\x1b[2J`, `\x1b[H`, `\x1b[K`, `\x1b[0J`, an OSC title set `\x1b]0;pwned\x07`, the alternate
screen `\x1b[?1049h`, a DCS `\x1bP+q544e\x1b\\`, the cursor-position **report** request `\x1b[6n`,
SGR, `\x1b(0`, `\x1b#8`, the 8-bit C1 forms `\x9b2J` / `\x9dpwned\x9c` / `\x84`, a lone `\x1b`, a
combined `\x1b[8m\x1b[2J\x1b[H\x1b[K`, embedded `\x00 \x07 \x08 \x0b \x1f \x7f \r \n \t`, a BOM,
zero-width spaces, 500 `x`, and 50 `♛`.

**180 / 180 clean, against the NEW counts derived from `H`:**

- **unaccounted `\x1b` bytes: 0** in every case — `count(\x1b) == count(\x1b[H) + count(\x1b[K) + count(\x1b[0J)` exactly;
- `\x1b[H` exactly **1**, `\x1b[K` exactly **`H` = 23** (was `H − 1`), `\x1b[0J` exactly **1**,
  `\x1b` exactly **`H + 2` = 25**, in every case;
- with the module's own sequences removed: **0 C0 controls and 0 `U+007F`** survivors (the newline
  separators excepted, which are the writer's own);
- **0 code points above `U+007F`** in ASCII mode;
- row count constant at `H` in every case, including the 500-character item and the 50-glyph item.

`sanitize` (`src/frame.ts:101-110`) is doing the work, it is untouched by this ticket, and this gate
verified it on the shipped build rather than taking anyone's word for it. **`ABC-018`'s C1 ruling is
NOT re-litigated**; `RF-1` adds `1B 5B 4B`, which contains no C1 byte.

**No compliance regime is set** (`compliance_regime: []`), so nothing hands to the Compliance
Officer. No authentication, permission, secret, personal-data, payment, upload, migration, queue or
external-integration surface is touched — this module writes bytes to one sink and reads nothing
ambient.

## Part B — the three things the Engineer measured, CHECKED on my own instruments

All three reproduce. Every substitution went through a helper that ASSERTS the anchor is unique
before any write and ASSERTS the restore by md5 afterwards; both files came back to
`c4ce369bc105204fae661baa14d95314` (`frame.test.ts`) and `bf3e5a8413d0f2740775608b5925a1a8`
(`frame.ts`), and the out-of-tree copy was `diff -r`-verified byte-identical to the worktree's `src/`
before use.

### B1 — the obvious verification IS worthless. The byte-exact `toBe` masks the clause every time.

Four writers substituted at the same unique anchor in the out-of-tree copy, each run as
`vitest run src/frame.test.ts -t "A1 "`:

| writer | `A1` | what the runner PRINTS |
|---|---|---|
| `RF-1` (shipped) | **PASSES** | — |
| old delivered (+66) | **FAILS** | `expected '\x1b[H8 .♜…\x1b[K\n7…' to be '\x1b[H\x1b[K8 .♜…'` — **the `toBe`** |
| `M2` | **FAILS** | the `toBe` |
| merged | **FAILS** | the `toBe` |

**In all three the `toBe` fails FIRST and the column-0 clause never reports.** A build that read the
runner's output would conclude the clause works without ever having run it. **This project's recorded
masking pattern, third appearance, and it is inside `A1` itself.**

### B2 — neither half of the clause is redundant, and clause (b) alone passes the MERGED writer vacuously

`A1` reduced out of tree to the clause alone — the byte-exact `toBe` **and all four counts** removed,
edits scoped to the `A1` block, each anchor asserted unique:

| `A1` reduced to… | `RF-1` | old (+66) | `M2` | merged |
|---|---|---|---|---|
| **both halves, nothing else** | PASS | **FAIL** | **FAIL** | **FAIL** |
| clause (a) only — *begins `\x1b[H\x1b[K`* | PASS | **FAIL** | **FAIL** | **FAIL** |
| clause (b) only — *no `\x1b[K` immediately before a newline* | PASS | **FAIL** | **FAIL** | **PASS — vacuously** |

**The clause fails on the old emission on its own merits, with nothing standing in front of it** —
which is a different measurement from "`A1` went red". And clause (b) alone passes merged vacuously,
because merged emits no `\x1b[K` at all, so "no `\x1b[K` is immediately followed by a newline" is
trivially true of it. **Clause (a) alone kills all three unsafe shapes; clause (b) is the one that
names the actual defect shape. Neither is redundant, and a hop that deletes either as a "duplicate"
of the `toBe` loses a writer.** The Engineer's result is confirmed independently.

### B3 — `A7` has real enforcement, so `AR-1` is closable

With `RF-1` in place, the screen model's margin repair reverted
(`eraseFrom() => Math.min(column, columnCount - 1)` back to `=> column`, one derived column, both
erase helpers):

> **`A7` FAILS ALONE — 1 failed / 716 passed of 717, 1 test file of 24, and nothing else moves.**

**That closes the gap I recorded at the FAIL hop.** `AR-1` as a bare assignment to the Engineer had
**zero enforcement** — the repair could have been skipped at that hop or silently undone a year later
and nothing anywhere would go red. It is now a criterion that fails alone when the repair goes away,
which is this project's "check that cannot fail" class inverted.

**`A7` is my own primitive with my own two controls**, read at source (`src/frame.test.ts:1041-1081`)
and checked assertion by assertion against this hop's fresh emulator readings: control A (10 chars,
no erase → 10 cells), control B (9 chars + erase → 9 intact), the test (10 chars + erase → the cell
at `C − 1` erased), and the wrap probe (the next printable character lands at column 0 of the next
row). All four match the terminal. It derives every number from the screen's own `C`, mentions
neither `H` nor `W`, assembles no frame, and asserts no width constant — checked against the
`## Out of scope` PROHIBITION at source rather than assumed clear.

## Part C — `AR-3` re-measured on the shipped build: still true, and unchanged in kind

**`beginFrameSession` does not sanitize.** Measured, not assumed: a hand-built frame array containing
`\x1b[2J` — `["a", "\x1b[2J", "c"]` — reaches the sink **unaltered**. The writer accepts
`readonly string[]` and concatenates it verbatim; the escape-freeness of the emitted stream rests
entirely on callers routing their rows through `assembleFrame`.

**Pre-existing, unchanged by `ABC-027`, and no fix is required of it** — `main`'s `frame.join("\n")`
has exactly the same property. It is recorded because `ABC-027` changes what an inspector would see:
before, a frame's emission was 2 escapes and anything else was obviously foreign; it is now 25, and
one more would not stand out. Disposition, owner and trigger are in the decision note.
