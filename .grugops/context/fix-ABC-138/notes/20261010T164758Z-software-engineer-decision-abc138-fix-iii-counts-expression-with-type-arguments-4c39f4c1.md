---
id: 20261010T164758Z-software-engineer-decision-abc138-fix-iii-counts-expression-with-type-arguments-4c39f4c1
kind: decision
by: software-engineer
at: 2026-10-10T16:47:58Z
verified_by:
confidence: high
refs:
  - ABC-138
  - QE-138-a
  - QE-138-b
  - QE-138-d
  - AR-133-WRAP
  - AR-133-LOADER
  - src/cli.test.ts
  - 20261010T162956Z-qe-e2e-observation-abc138-gap-register-d5a380ba
  - 20261010T164758Z-software-engineer-observation-abc138-fix-plants-a5-gates-3133420f
supersedes:
---

# `ABC-138` fix-forward: (iii) counts a reference inside `ExpressionWithTypeArguments`; the comment names count (i)'s non-first-argument blind spot. Count (i) is not widened

This note is hand-authored and unsealed. Readings are in `…3133420f` and `../probe/`. Code commit `33e54f70`.

- **`QE-138-a` / `QE-138-d`.** Count (iii)'s filter was `ts.findAncestor(name, ts.isTypeNode) === undefined`.
  It is now `ts.findAncestor(name, (n) => ts.isTypeNode(n) && !ts.isExpressionWithTypeArguments(n)) === undefined`,
  QE's scratch-verified line, written in Biome's format. A class `extends` clause and an instantiation expression
  are both `ExpressionWithTypeArguments` and both are value positions, so a bound name inside them now counts.
  Type ARGUMENTS stay type-only: the walk up meets the inner `TypeQuery` / `TypeReference` first (own controls
  `G1`–`G3`, GREEN).
- **`QE-138-b` (comment only).** The bound now reads that a literal that is not a call's FIRST argument is unseen,
  naming `getBuiltinModule.call(process, …)` and `Reflect.apply(req, undefined, […])`. Widening count (i) is
  Security/NFR's residual call, so it is left alone.
- (iii)'s "A reference inside a type does not count" sentence gains its exception, so the comment no longer reads as
  covering `W5`.
- Not touched: counts (i) and (ii), `N8_SPAWN`, any other `it`. `QE-138-c` (the `const` remedy is the blind loader
  shape) is INFO, for Security/NFR, and is not addressed here.
