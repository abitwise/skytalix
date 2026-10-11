---
id: 20261011T091155Z-qe-e2e-observation-abc114-gap-register-168698b8
kind: observation
by: qe-e2e
role: qe-e2e
task: qe-ABC-114
at: 2026-10-11T09:11:55Z
verified_by:
confidence: high
refs:
  - ABC-114
  - ABC-113
  - src/cli.test.ts
  - plans/tickets/ABC-113-two-instrument-residuals-in-epic-006s-own-test-files.md
  - 20261011T091155Z-qe-e2e-observation-abc114-readings-94a87a28
supersedes:
---

# QE `ABC-114`: the gap register

This note is hand-authored and unsealed. Following the conflict rule (`A7`), **I name what each
replacement sentence must agree with. I do not write the replacement**: the validator does not
author.

| id | sev | where | the gap | owner |
|---|---|---|---|---|
| `QE-114-a` | **HIGH, blocks `A1`** | `src/cli.test.ts:2681–2683` | *"This row is placed BEFORE the other two, so on any decoy it is the row that speaks first."* **False.** The initializer row (`:2669`) comes BEFORE the count row (`:2701`). The same comment says "the initializer row above". On decoy `ORD` (annotated initializer plus a flat copy, `tsc`-clean, count = 2), the initializer row speaks, not the count. The pre-repair text had the same order error ("placed BEFORE them"). This hop widened it to "any decoy". **This is the fifth false sentence the ticket's `## Risks` predicted.** A true sentence must agree with two facts. First, the count sits after the initializer row and before the shorthand row. Second, on `D3` and `M9` it speaks first because both leave the initializer row green | Software Engineer (one comment-only fix). BA/PM for the `P1` trigger |
| `QE-114-b` | LOW | `src/cli.test.ts:2687–2688` | *"leaves the lane GREEN on this file and on the control"*. On the control (`cc037b3e^`) the FILE has 2 unrelated drift reds. Only `A1` is green there. The sentence should be per row. Fold it into the `QE-114-a` fix | Software Engineer |
| `QE-114-c` | MEDIUM | `ABC-114` `A2` and `A4`(b) wording, propagated to `src/cli.test.ts:2684–2688` and `ABC-113` page `:67–70` | (1) `A2`'s mandated remainder list is too broad. `for…in` and `catch (history)` are regex-blind, but `tsc` reds both (exit 2), and the `A1` row's own header names the typecheck as the criterion's instrument. Only `for…of` (`D4`) and the parenthesised `(history) =>` callback are `tsc`-clean AND green. A bare `history =>` IS counted. The comment follows the criterion, so `A2` is MET as written. (2) `A4`(b)'s "for any program" is false. The comment's narrower `process.stdin` scope is correct | BA/PM (criterion wording; decide whether the page and comment lists are narrowed in the same fix) |
| `QE-114-d` | INFO | `src/cli.test.ts:2752–2755` | The kept FIFO figures are for `--colour white`, which the comment does not name. Black reads 4 boards / 2010 vs 2012 bytes | Software Engineer, optional |
| `QE-114-e` | INFO | SE note `…5b2e8c41` and the `## Delivery` section | "`main:` … byte-identical to the tip" should read "to the base `7411f73a`". "The control moved": it was degenerate at the cut | — (recorded only) |
| `QE-114-f` | INFO | `src/cli.test.ts:2759` | A 123-column comment line. `biome` passes. Cosmetic | — |
| `QE-114-g` | INFO | environment | `host-protection.js` exit 2 (`UNKNOWN - verify`). The full lane timed out once per run at load ≈25 in `src/search.test.ts`, unrelated, and was green at load ≈3 | — |
