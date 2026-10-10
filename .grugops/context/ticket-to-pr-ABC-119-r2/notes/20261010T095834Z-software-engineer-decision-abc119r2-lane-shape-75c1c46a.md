---
id: 20261010T095834Z-software-engineer-decision-abc119r2-lane-shape-75c1c46a
kind: decision
by: software-engineer
at: 2026-10-10T09:58:34Z
verified_by:
confidence: high
refs:
  - ABC-119
  - G-06
  - A1
  - A3
  - A4
  - A6
  - src/cli.real-engine.test.ts
supersedes:
---

# `ABC-119` r2: how the lane is built — one file, `CLI_DEEP`, two real children, an empty child environment

Hand-authored, no seal. These are implementation decisions inside the page's fences. None of them changes a criterion.

1. **File and variable.** The file is `src/cli.real-engine.test.ts` (flat in `src/`, so `ADR-0011`'s `nested` row stays
   empty). The variable is `CLI_DEEP`, on the `*_DEEP` precedent, and it is gated as `if (RUN_DEEP) { describe(...) }`.
   `describe.runIf`, `it.skipIf` and `.skip` are never used (trap 1).
2. **The default-lane test (trap 2).** It spawns nothing and can fail. It checks four things:
   - the deep child's argv[0] is the delivered `src/cli.ts`, and it is a file;
   - no further argv element names an import, loader, require, hook or conditions flag;
   - the child environment is empty.
   It reds if anyone adds `--import` or a hook to the deep child. That is `A1`'s "no hook", made structural.
3. **An empty child environment (`env: {}`).** This closes ASVS "the child inherits no secret". It also closes a leak the page
   does not name: a parent `NODE_OPTIONS=--import=…` (for example from an `INPUT_DEEP` shell) would otherwise reach the
   child and could slip in a double. `--ascii` fixes the glyph mode, so the product needs no environment.
4. **Two children, not one.** `played` uses empty stdin and covers `A1` and `A3`. `rejected` gets one `zz9` line and covers `A1` and `A4`.
   One combined child would save ~3.1 s of opt-in wall. Keeping them separate keeps `A3`'s child free of a rejection frame. Both are spawned in
   a `beforeAll` inside the deep `describe`, so with the variable unset nothing spawns at all.
5. **`A3`(i) is checked twice, both times through the generator, never through a literal.**
   - The `last:` SAN must be exactly one of `legalMoves(start).map(toSan)`.
   - The printed board after the reply is read back into a FEN placement. It must equal `toFen` after
     `makeMove` of that move.
   - The printed board before the reply must equal the start placement. That is "the position it was played in".
6. **`A3`(iii)** reads the ply off the status row (`N.` / `N...`) and asserts the side changed and the ply is +1. One engine reply is
   one ply on any machine and in any search, so that number is not a depth or node count.
7. **`A4`'s message** is `rejectionMessage({ reason: "unreadable" })` from the merged module, not a copied string. "Continues" means
   the refused frame is followed by a return to the prompt and an ending on `INPUT_ENDED_NOTICE` (imported), with exit 0.
8. **`A6` mutants preserve `:2512`'s text.** Both rebind a name in the IMPORT line and leave line 175 byte-identical, so
   the default lane's textual wiring row cannot see them. A `createEngine({} as never)` mutant would red `:2512` itself,
   and then it would not test the "default lane stays green" half.
9. **Hang guard = 4 × `HARD_CEILING_MS` (20 s).** A slow child therefore reds on the `A3`(ii) row, not on the spawn timeout.
   `beforeAll` gets 4 × the guard.
