---
id: 20260819T150500Z-software-engineer-decision-abc037-five-gaps-disposed-b2c3d4e5
kind: decision
by: software-engineer
at: 2026-08-19T15:05:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - ABC-038
  - ABC-108
  - G1
  - G3
  - G4
  - G5
  - G7
  - src/line-input.ts
  - src/line-input.test.ts
supersedes:
---

# Repair round 1 — each gap's disposition, and the one that is a ruling rather than a fix

Five gaps were mine. **All five are closed.** Two were fenced away from me and one more I chose not
to touch; those are named at the bottom so nobody reads silence as an oversight.

## `G1` (MEDIUM) — CLOSED by a test, after independent reproduction

The retained-bytes bound is no longer a construction argument. It is a row in the deep lane on
`process.memoryUsage().external` after a forced `gc()`. **`M6c` reds at 45 ms.** Reproduction detail
and my own numbers are in the sibling `observation`; I did not adopt QE's guard on QE's word.

**The module's disproved sentence is gone.** The test-file comment that said "`heapUsed` does not
account a V8 cons-string's referents" now says what I measured: `heapUsed` accounts a flattened
16 MiB string at 16.00 MiB exactly, and what it does not count is **external string data**, which is
what the decoder produces. The "do not add a `heapUsed` row back" instruction survives the
correction, because that instruction was right and is the reason the comment exists.

**Threshold choice, stated rather than assumed.** 4 MiB — one chunk's slack above the bound. It
kills `M6c` (32.00 MiB) and deliberately leaves `M6` (2.00 MiB) and `M6b` (0.00 MiB) alive. Both are
equivalent mutants: each half of `absorb`'s bound alone still caps retention at one chunk, and I
verified both still pass with the guard in. A guard tightened to kill `M6` would be asserting which
half of a redundant pair exists, not that the bound holds. **I ran that check rather than reasoning
it** — `M6` 33 passed, `M6b` 33 passed, `M6c` 1 failed.

## `G3` (LOW) — CLOSED, production fix, and the blind row can now see it

QE is right and my `A2` row was structurally blind. The cap ran in `absorb`, **before** `completeLine`
stripped the `\r`, so 1024 units arriving from a Windows pipe counted 1025 and were rejected. The
effective cap was **1023 on CRLF, 1024 on LF**, and no row in the file compared the two.

The fix keeps `absorb` as the memory bound and moves the **verdict** to `completeLine`, where the
line's real length is finally known:

- `absorb` caps at `MAX_LINE_LENGTH + 1` — one unit of slack, and it is the carriage return's.
- `completeLine` sets `overlong` if the line **without its terminator** exceeds the cap.

**This is not a weakened guard and I checked rather than asserted it.** The memory bound moves by one
UTF-16 unit; the cap the player meets is still exactly 1024, now on both terminators. Two mutants
prove both halves are held: reverting to the old ordering reds the CRLF boundary row (`M-R1`), and
keeping the slack while dropping `completeLine`'s verdict — the dangerous half-repair that would
raise the real cap to 1025 — reds two rows (`M-R2`).

The boundary row is now an `it.each` over **both** terminators, and a matching 1025-unit rejection
row over both. A boundary row that feeds one terminator is a boundary row for that terminator only.

## `G4` (LOW) — CLOSED by a decoder-boundary row in the DEFAULT lane

`{ stream: true }` now has a guard: a UTF-8 `é` split **mid-sequence across two chunks**, written as
raw `Buffer` slices. Delivered reassembles it; `M-QE1` turns it into `U+FFFD` and now reds. It sits
in the default lane, not the deep one, because the deep lane's permutation sweep splits **strings**
and this bug only exists in **bytes** — the sweep could never have caught it however long it ran.

## `G5` (LOW) — RULED, and the ruling is "the default lane", not "name `INPUT_DEEP` as required"

The brief demanded I decide and state which is true. **Decision: those kills belong in the default
lane, and they are now in it.** `INPUT_DEEP` is NOT being promoted to a gate requirement.

The reasoning, so it can be argued with:

- The gate runs the default lane. A defect class guarded only by an opt-in flag is guarded by
  nothing that binds. Making `INPUT_DEEP` "required" would mean a second gate that no gate runner
  invokes and that lives in prose — the failure mode dressed up as its own fix.
- **The kills were cheap and the deep lane was never the reason they lived there.** They lived there
  by accident: they fell out of the permutation sweep rather than being aimed at. Aimed directly,
  they cost **4 ms** — a leaked-`data`-listener count over eight reads, and a "surplus already parsed
  out of a chunk still serves after `end()`" row. There was never a lane-budget case for exiling them.
- Both now name the defect in the test title, so a failure reads as the bug rather than as "the
  permutation sweep went red at split 7".

`M-QE2` and `M-QE3` each red exactly one default-lane row now, verified.

**What the deep lane keeps** is what is genuinely expensive: the 16 MiB flood, the retention
measurement, the permutation sweep, the 10,000-character totality row. It stays an opt-in BREADTH
lane. The test-file header now says this explicitly and says why, so the next engineer does not
re-run my mistake in the other direction and start hiding cheap guards behind the flag.

**One consequence the Orchestrator must route, because I am fenced from it.** The retention row needs
a second flag, so this module's full deep command is now:

```
INPUT_DEEP=1 NODE_OPTIONS=--expose-gc npx vitest run src/line-input.test.ts
```

`AGENTS.md:94` records the command **without** `NODE_OPTIONS`, and I was told not to touch that file
because the Scribe is amending its trap paragraph in parallel. **The recorded command as it stands
is not wrong and does not break** — `INPUT_DEEP=1` alone is green at 32 tests, because the retention
row is NOT DEFINED without `--expose-gc`. It is *incomplete*: it silently runs one guard short. That
is a real residual and it is the Scribe's line to fix, not mine. **Flagging it rather than reaching
across the fence.**

## `G7` (INFO) — both record errors CLOSED

- **"eighteen".** `plans/traceability.md`'s header said *"three of eighteen mutants"* while the row
  said nineteen. Corrected — and the count is now **24 named / 22 killed / 2 survived** anyway, with
  the two survivors named as the deliberate equivalents they are.
- **`MAX_LINE_LENGTH` counts UTF-16 code units, not characters.** The doc now says so, and says the
  consequence out loud: **an astral-plane line caps at 512 characters.** I deliberately did NOT
  "fix" this by counting code points. It is a MEMORY bound and UTF-16 units are the unit the memory
  is actually spent in; changing the semantics to make the doc true would be a scope increase
  dressed as a docfix.
  **One thing I left alone and am naming rather than silently keeping:** the player-facing
  `LINE_TOO_LONG_MESSAGES` still reads `max 1024 chars`. It stays "chars" because that region is
  bounded by the frame's `W` (18 at the narrowest) and "code units" does not fit or help a player.
  Precision in the doc, plain words at the prompt — a choice, not an oversight.

## Not mine, and left exactly as found

- **`A6`/`G2`, the obfuscated load-time escape.** The token scan is **NOT widened**. QE's read is
  that this is malicious-edit-only and not input-reachable, that widening a lexical scan is an arms
  race it loses, and that it should ride as a named precondition on `ABC-038`. The Orchestrator
  accepted that and so do I — on the merits, not just on instruction: layer 3 is lexical by
  construction and every unit I add to it buys one more obfuscation and no security.
- **`AGENTS.md` — not touched.** The Scribe holds that pen this hop. One handoff for it, above.
- **`ABC-033`'s rejected-promise residual** (`src/move-input.ts:191`) — not re-opened.
- **`G6`, the two-overlapping-`seam()` precondition.** Not in my brief and not done. It is real
  (QE's analysis is sound: `waiting` is a single slot) and it is unreachable through `runTurnLoop`
  today. **Naming it so it is not lost**: it wants either a header line or a refusal row before
  `EPIC-006` wires the factory. Not silently absorbed, and not silently expanded into.
