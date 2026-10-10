---
id: 20261010T171908Z-qe-e2e-decision-abc140-verdict-pass-with-gaps-1e1185ff
kind: decision
by: qe-e2e
at: 2026-10-10T17:19:08Z
verified_by:
confidence: high
refs:
  - ABC-140
  - ADR-0011
  - ADR-0029
  - R5d
  - QE-137-a
  - QE-136-a
  - QE-136-c
  - QE-140-a
  - QE-140-b
  - QE-140-c
  - src/history-pane.nfr.test.ts
  - 20261010T171908Z-qe-e2e-observation-abc140-ledger-static-gates-5400cc2b
  - 20261010T171908Z-qe-e2e-observation-abc140-gap-register-64112bc2
supersedes:
---

# `ABC-140` QE verdict: PASS_WITH_GAPS. `A1`–`A6` are MET on QE's own harness. One LOW gap and two INFO items are routed. No test was added

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`). The ticket's
`## Scope` and `## Risks`-bearing sections are authoritative. This note cites them and does not restate them.

- **Reviewed:** branch `grugops/ABC-140-composer-tripwire-pins`, base `6dde3261`, code `795adca4`, tip `dcc8dcca`.
  The tip's `src` blob is the code commit's (`ddc0dda8`). Not merged, not pushed.
- **Harness:** the Architect's `plant.mjs` (sha256 `b6b5e458…57bd`, unchanged) and QE's own planter, both run
  inside QE's own loop. The permission layer refused nothing. Readings: `…5400cc2b` and `../probe/`.

| criterion | verdict | evidence (QE's own run) |
|---|---|---|
| `A1` | MET | The five survivors `+FMT+WSC` exit 0 with 12/12 at base and exit 1 at head. Each failure is on the drift tripwire: `N591-*` on "…scans EVERY production module", `C-*` on "…compares with an EQUALITY". Whole lane: `N591-TAIL` and `C-OPERAND` give 1607/1608. QE's own five spellings agree, including an inner `&&` filter. |
| `A2` | MET | `CONTROL` and `FMT` run 12/12. `WSC` reds the composer tripwire and `WPS` the licence guard, by name, at base and head; QE's own `Q-WSC` and `Q-WPS` do the same. `N653-NARROW`, `H-SHADOW` and `H-FSMOCK` are recorded green at both. No `PLANT-FAILED`. The five existing pins hash identically. |
| `A3` | MET | "it pins five spans by TEXT" 1 → 0; `R5d` 0 → 2. The comment states seven spans and attributes the sixth and seventh to "the composer tripwire's own (`R5d`)". |
| `A4` | MET | "Both guards at the bottom of this file" 1 → 0 and "THE TWO GUARDS HOLD DIFFERENT PROPERTIES" 1 → 0. The docblock names all three instruments and both rules, and says the probe and the tripwire "share `COMPOSITION_ROOT`". |
| `A5` | MET | One path under `src` (+32/−13), 0 production lines, 0 new `src` files. The helper, the composer statements and `bindsAssembleFrame` are byte-identical. `biome-ignore` 1 → 2. |
| `A6` | MET | lint, typecheck and build exit 0. `npm test`: 52 files / 1608 passed. Skip count 0; integrity `No findings.`; lane-inventory 52/52, `No findings.` |

**Gaps** (`…64112bc2`):
- **`QE-140-a` LOW → Architect/Design.** The composer tripwire's own `XSPLICE` twin survives. That is a statement
  inserted between the two separately pinned statements: an in-place filter or an early `return`. It is outside
  every acceptance criterion and inside `QE-136-a`'s accepted class. That class's trigger names the licence guard's
  lines only.
- **`QE-140-b` INFO.** A local `productionModulesIn` shadow in the composer `it` survives. It is `XSHADOW-HELPER`'s
  twin and in the `QE-136-c` class.
- **`QE-140-c` INFO.** The docblock's "makes that one root fail closed" is unqualified, while `ADR-0029` decision 2's
  pointer bounds it.

**No test was added.** `QE-140-a` closes only by the Architect's choice, which is a contiguous pin or a trigger.
`QE-140-b` is an accepted class. **Next gate:** UAT is waived by the 2026-08-17 rule (0 production lines,
measured). The board move out of `In Review` is the Orchestrator's.
