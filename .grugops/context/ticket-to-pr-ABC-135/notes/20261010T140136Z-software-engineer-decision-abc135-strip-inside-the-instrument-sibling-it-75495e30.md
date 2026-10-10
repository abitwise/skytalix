---
id: 20261010T140136Z-software-engineer-decision-abc135-strip-inside-the-instrument-sibling-it-75495e30
kind: decision
by: software-engineer
at: 2026-10-10T14:01:36Z
verified_by:
confidence: high
refs:
  - ABC-135
  - QE-054-a
  - QE-054-c
  - ADR-0030
  - src/render-seam.test.ts
supersedes:
---

# `ABC-135`: the comment strip lives inside `bindsAValueFrom`, shared with `deliveredCode`; the six rows are a sibling `it`

Hand-authored, no seal.

1. **Where the strip sits: inside the instrument, not its caller.** The spelling rows call
   `bindsAValueFrom` directly. A strip in `runtimeConsumersOf` would leave the rows reading the raw
   string, so `A1`'s rows could never go green. The instrument now matches over
   `withoutComments(source)`.
2. **One strip, not two.** The file's existing `deliveredCode` strip (`A3`/`A6`) is lifted into a
   module-level `withoutComments`, and `deliveredCode` calls it. The regexes are byte-identical to the
   old ones, so `A3`/`A6` read the same text. This is the strip BA/PM measured out of tree. I chose
   it over a string-literal-aware scanner, which is more code and is not asked for. The naive-strip
   risk (ticket test note 1) is held by `A3`'s whole-map equality. The docblock says so.
3. **Sibling `it`, not more rows in the eight-spelling test.** That test asserts
   `toHaveLength(4)` over its `true` rows. Adding rows there would change that count's meaning, and
   `A1` wants the eight unchanged. The new `it` holds exactly the page's six strings.
4. **Docblock:** "COMMENTS ARE NOT READ" and "EVERY matching statement in the file is read" were added
   to `bindsAValueFrom`'s comment. No other prose was changed.
5. **No `C3` ruling exists** (`ADR-0030` and `.grugops/context/design-owed-rulings-2026-10-10*` were
   grepped), so `A1` stands as cut.
