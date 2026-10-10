---
id: 20261010T144820Z-software-engineer-decision-abc136-two-framed-operand-pins-and-a-reach-comment-5b359211
kind: decision
by: software-engineer
at: 2026-10-10T14:48:20Z
verified_by:
confidence: high
refs:
  - ABC-136
  - ABC-057
  - ABC-134
  - ADR-0011
  - R5b
  - QE-057-a
  - src/history-pane.nfr.test.ts
supersedes:
---

# `ABC-136` spelling: two framed `toContain` pins in the drift tripwire, one per operand, and the comment states its reach

Hand-authored and unsealed. What is pinned is the Architect's (`R5b`); this note records the spelling only.

1. **Two pins, not one.** Each operand has its own `expect(instrument, <message>).toContain(...)` after the
   `R5` operator pin, so a failure names the operand: "the licence guard scans EVERY production module" and
   "the licence guard compares EVERY runtime importer".
2. **Scan pin frame:** `"\n    const production = productionModulesIn(directory);\n    const runtimeImporters = production.filter((file) =>\n"`.
   Framing with the whole next line (not just its first token) makes it unique against `:621`'s
   `productionModulesIn(directory.pathname)` and matches the planter's `QSCAN-NARROW` anchor region.
3. **Importer pin:** the whole statement through `    );\n`, `\n`-escaped on one line (`ABC-057` `D1`),
   single-quoted (it holds `"`; Biome's quote choice), regex backslashes doubled. No pin matches itself: every
   framed form and planter anchor counts exactly 1 in the raw file.
4. **`biome-ignore lint/suspicious/noTemplateCurlyInString`** on the importer literal, with the same reason
   text as `src/cli.test.ts:953-959` (the string IS source). Without it lint prints one warning; the base has 0.
   A template literal was rejected: it would need `\${` and `\`` escapes and read worse.
5. **Comment:** the sentence "a hop that widens the guard reds this test" is replaced by a statement of reach:
   four spans pinned by TEXT (expression, comparator `R5`, the two operands `R5b`: `productionModulesIn`,
   `runtimeImporters`), and "A text pin is not tamper-proof ... it just has to show in the diff".
6. **Not touched:** the guard's statements, `ABC-057`'s spans (hash-identical), `ABC-134`'s four prose sites,
   no `LICENSED_DRIVERS` / `COMPOSITION_ROOT` declaration spelled in any new literal or comment.
7. **Interaction observed, accepted:** under `QLHS-INTERSECT+FMT` Biome rewraps the statement to
   `production\n      .filter(...)`, so the SCAN pin (framed with that line) fires first; the unformatted
   `QLHS-INTERSECT` reds on the importer pin itself. Both are the tripwire `it`, which is what `A2` asks.
