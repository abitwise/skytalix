---
id: 20261010T115422Z-software-engineer-decision-abc053-one-root-per-frame-phase-composer-tripwire-9594aafe
kind: decision
by: software-engineer
at: 2026-10-10T11:54:22Z
verified_by:
confidence: high
refs:
  - ABC-053
  - ADR-0029
  - ADR-0030
  - ADR-0011
  - ADR-0009
  - NFR-002
  - src/history-pane.nfr.test.ts
  - src/render-seam.test.ts
  - 20261010T082409Z-architect-design-decision-abc053-ruled-adr0029-load-and-per-frame-one-root-glyph-mode-off-path-09539381
  - 20261010T115422Z-software-engineer-observation-abc053-gates-ledger-controls-cost-3a8f5aa3
supersedes:
---

# `ABC-053` built as `ADR-0029` rules it: one declared root, a per-frame phase in the existing child, and a composer tripwire

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
- Branch `grugops/ABC-053-frame-path-per-frame`, from wave tip `e15eb31d`. The code commit is
  `c9509031`.
- Not merged, not pushed.
- The readings are in `…3a8f5aa3`; the raw files are in `../probe/`.

## What was built, and the choices `ADR-0029` left to the Engineer

All of these are in `src/history-pane.nfr.test.ts` unless stated.

1. **`FRAME_PRODUCERS` is deleted.** It is replaced by `const COMPOSITION_ROOT = "render-seam.ts";`.
   The name is mine; the ADR left it open. It is a plain string, not a one-element list: there is
   one root by ruling, and a list would invite a second entry. The probe asserts the root exists
   among the production modules before it spawns.
2. **Per-frame phase, in the ONE existing `spawnSync` child.** The order is:
   - load phase: import the root, then snapshot `closure`;
   - import `history.ts?fixture` and the plain `legal.ts` (already in the root's closure through
     `status-panel.ts`, so it adds no new module);
   - build the two games, then compute both statuses with the fixture's own `gameStatusOf`;
   - build the seam with `makeRenderSeam("ascii", "white-bottom")`;
   - clear the recorder, draw both frames, settle 3 `setImmediate` turns, then snapshot `perFrame`;
   - clear the recorder and run the arming import, which stays last.

   The statuses are computed **before** the clear, so the only things inside the measured window
   are the frame calls and the settle.
3. **The long game is 40 plies,** played with the fixture's `playMove`. The moves come from the LCG
   that this file's `deterministicGame` already uses (seed `0x2f6e2b1`). The child counts the plies it
   played and reports them. The parent asserts `[0, 40]`, and separately that 40 > `2 × HISTORY_ROWS`
   (the window). That gives no hard-coded 16, and no read of `GameHistory`'s shape beyond
   `.position`, which `legalMoves` needs anyway.
4. **One glyph mode and one orientation** are framed. A lazy edge that depends on the mode is the
   docblock's "conditional on a state the frames do not reach" case, and it is named there. I did not
   widen it into a matrix; the ruling asks for two game states.
5. **The composer tripwire is its own `it`, so it reds under its own name.** The rule is `ADR-0030`
   decision 2 applied to one specifier. For each `^import (?!type\b)… from "./frame.ts";` statement,
   the import counts if it has a namespace binding (`* as x`), or a brace specifier that begins with
   `assembleFrame` (an inline-`type` specifier begins with `type` and does not count). `frame.ts` has
   no default export, so a default binding cannot occur. The result must `toEqual([COMPOSITION_ROOT])`.
   This is a narrow, local parse. It does not pre-empt `ABC-054`'s general consumer instrument, which
   remains that ticket's.
6. **The docblock** replaces the `FRAME_PRODUCERS` docblock and its dated-expiry paragraph. It
   carries:
   - both phases;
   - the one root, cited to `ADR-0009` 9b;
   - the membership rule, and why `glyph-mode.ts` is not a root;
   - the tripwire;
   - the four uncovered cases, in `ADR-0029`'s words;
   - `WGLYPH-DYN` as the recorded loss;
   - `R1` discharged.

   Two other sentences in the file named the old list ("`FRAME_PRODUCERS` for the probe" in
   `productionModulesIn`'s docblock, and "the declared frame producers" twice in the probe's
   docblock). They were re-pointed, because `A2` requires 0 occurrences.
7. **`src/render-seam.test.ts` `A9`.** The first assertion is now
   `expect(probe).toMatch(/^const COMPOSITION_ROOT = "render-seam\.ts";$/m)`. The `declaredList`
   helper and the `LICENSED_DRIVERS` assertion are byte-identical. The test title and one header
   sentence named `FRAME_PRODUCERS`, and both were re-pointed. Diff: +6/−6.

## Deliberately not done

- **No production file was touched.** The three production docblocks that name the deleted list or
  the six-producer census are left for the `XS` follow-up (see `…3a8f5aa3`).
- **No settle tuning and no clock.** The settle is not load-bearing on v26.11.0, measured
  (`CTRL-ZERO-SETTLE+X5b` is still RED).
- **No `artifact-ref` note.** Its `gate_run` field cannot be admitted on this install. The branch and
  sha are carried here and in `…3a8f5aa3`, following `ABC-058`'s engineer hop.
