---
id: 20261010T082409Z-architect-design-decision-abc053-ruled-adr0029-load-and-per-frame-one-root-glyph-mode-off-path-09539381
kind: decision
by: architect-design
at: 2026-10-10T08:24:09Z
verified_by:
confidence: high
refs:
  - ABC-053
  - ADR-0029
  - ADR-0011
  - ADR-0009
  - NFR-002
  - src/history-pane.nfr.test.ts
  - src/render-seam.test.ts
  - 20261010T082409Z-architect-design-observation-premises-rechecked-and-the-ledgers-behind-adr0029-adr0030-151fda8a
supersedes:
---

# `ABC-053` ruled in `ADR-0029` (proposed): both phases, by module loads, from one declared root. `glyph-mode.ts` is off the path

This decision is hand-authored. The evidence is note `…151fda8a`. The ADR is the authority; this note is the
summary the next hop reads first.

## The ruling, one sentence per question (`ABC-053` `A1`)

- **What the probe measures:** both phases, as two named assertions in the one existing child. **At load**:
  today's measurement, unchanged. **Per frame**: the recorder is cleared, the seam's frames are called on two
  game states, and `history.ts` must not load. **Loads, not derive calls.**
- **Declared or derived:** **derived** from **one declared root**, `render-seam.ts` (`ADR-0009` 9b). The
  six-name `FRAME_PRODUCERS` is **deleted**. An equality tripwire on value-importers of `assembleFrame` makes a
  second composer fail closed.
- **The dated expiry** (the docblock's and `ADR-0011` `R1`'s): **DISCHARGED**, not re-dated. `ABC-041` made the
  composition an import.
- **`glyph-mode.ts` (`A4`):** **not a frame-path root.** The membership rule is: in the root's load closure, or
  loaded by a frame call. It is called once per session by the entry point before the loop.

## What the Engineer builds (`ABC-053` stays `S` and still adds 0 files)

1. The per-frame phase in the existing `spawnSync` child, with these controls:
   - the fixture comes from `history.ts?fixture`;
   - the frames cover the empty game and a game of more than 16 plies;
   - each frame's row count is reported and must be non-zero;
   - a bounded macrotask settle, with no clock assertion;
   - the arming phase stays last.
2. `FRAME_PRODUCERS` is deleted. `COMPOSITION_ROOT` (the name is the Engineer's) and the `assembleFrame`
   tripwire replace it.
3. The docblock names both phases and the four things neither covers, as listed in `ADR-0029` (`A2`).
4. **`src/render-seam.test.ts` `A9`**: its first assertion parses the deleted literal, so it is re-pointed. This
   second test file is **named before code lands** (`A5`). `ABC-053` security clause (d) fires and the gate
   resolves it.

**`A3`'s arming control is `X5b`, and under the ruling it goes RED**: measured 5/5, plus five sibling spellings.

## Owed elsewhere, not done here

- **Owner:** accept `ADR-0029`, or not. That includes the one lost kill (`WGLYPH-DYN`, an `R4`-class build).
- **BA/PM:**
  - re-score `ABC-053` DoR item 10, which this hop marked with the ADR id and did not score;
  - decide whether the three stale production docblock pointers (`render-seam.ts:34-35`,
    `result-screen.ts:13-14`, `cli.ts:8`) fold into `ABC-053` or go to an `XS` follow-up. Folding them in
    forfeits the zero-production-lines UAT waiver; the follow-up is recommended;
  - sequence `ABC-053`, `ABC-054` and `ABC-057`. All three edit `src/history-pane.nfr.test.ts`.
- **At acceptance, a pointer line in `ADR-0011`:** clause 2 superseded in part, `R1` discharged, `R4` gains
  `WGLYPH-DYN`.
