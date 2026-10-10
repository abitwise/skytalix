---
id: 20261010T151002Z-software-engineer-decision-abc134-four-comment-sites-at-least-four-spellings-1f2b70bf
kind: decision
by: software-engineer
at: 2026-10-10T15:10:02Z
verified_by:
confidence: high
refs:
  - ABC-134
  - QE-053-b
  - QE-053-c
  - QE-053-d
  - QE-057-b
  - ADR-0029
  - src/history-pane.nfr.test.ts
supersedes:
---

# `ABC-134` wording: four comment sites rewritten in place, "at least four" spellings to agree with `ADR-0029`'s pointer, settle tied to its loop bound

Hand-authored and unsealed: this install has no `scripts/context-io.js`, and the `propose_note` tool is not exposed to
this hop. The house convention (`ticket-to-pr-ABC-136`) is followed. Code commit `a42b59e3`, one path, comments only.

1. **`QE-053-b`.** The CONDITIONAL bullet now names the five dimensions the frames hold fixed: game state (the two
   states bound it), glyph mode (`ascii` only), orientation (`white-bottom` only), `thinking` (false) and the message
   region (empty). The probe's executable call is not quoted.
2. **`QE-053-c`.** The rebuild bullet says that `A2`'s spies see a rebuild calling `gameStatus`, and that a rebuild by
   replay (`parseFen`, `makeMove`, `zobristKey`) is seen by no instrument.
3. **`QE-053-d`.** The settle comment states "3 `setImmediate` turns (the loop's bound below)". The literal `turn < 3` is
   NOT spelled in prose, so a reader that greps the literal still finds one hit. It states that the settle reaches an
   import issued from a macrotask up to a chain 3 deep, and that a deeper chain or a timer is not seen. The
   "Node >= 22" reason is kept as an additional reason ("every other sentence is kept"). Only the false clause is gone.
4. **`QE-057-b`.** Both the docblock paragraph and the in-test comment say "AT LEAST these four, and the list is not
   exhaustive". The docblock also says the clause the tripwire reads ends at the first `;`, and points at `ADR-0029`
   decision 2's 2026-10-10 pointer. That pointer lists the same four spellings, with a default binding (both forms)
   counted as one. So docblock and ADR now agree on the count. The examples are in backticks inside comments
   (test note 3).
5. **Spans.** The `probe-it` span (`spansqe.py`) contains the settle comment, so A3 cannot be met with that raw span
   byte-identical. Its hash moves; with its `//` lines dropped it is identical, and the other six spans are
   byte-identical. Readings: `…d5b9d74c`.
