---
id: 20261010T165600Z-architect-design-decision-qe010d-three-accepted-residuals-one-alignment-fix-bbe6bd95
kind: decision
by: architect-design
at: 2026-10-10T16:56:00Z
verified_by:
confidence: high
refs:
  - QE-010-d
  - AR-033-NESTED
  - AR-033-EXT
  - AR-033-COMPUTED
  - AR-072-WORDHIT
  - R3
  - ABC-010
  - ABC-042
  - ABC-103
  - ADR-0033
  - ADR-0011
  - ADR-0036
  - src/fen.test.ts
  - src/cli.test.ts
  - memory-bank/50-decisions/ADR-0033-parsefen-checks-the-side-not-to-move-through-moves-ts-and-off-domain-fixtures-parse-grammar-only.md
  - memory-bank/50-decisions/ADR-0011-production-module-scope-for-nfr-002.md
  - .grugops/context/qe-ABC-010/notes/20261010T164425Z-qe-e2e-observation-abc010-gap-register-2c22980f.md
  - 20261010T165600Z-architect-design-observation-qe010d-readings-guard-suite-lint-tsc-per-shape-03a2029d
supersedes:
---

# `QE-010-d` ruled: three accepted residuals with triggers, no ticket now. One alignment fix for the first two.

Hand-authored and unsealed (see `…03a2029d` for why). Readings are in `…03a2029d` and `../probe/RUN.txt`.

## Scope

`ADR-0033` decision 2's 9(e) guard: `src/fen.test.ts:369–383` on the unmerged `ABC-010` branch, tip
`f9d1ff4b`. The question is the three shapes QE planted (gap register `…2c22980f`). It is not the guard's
comparator, and not anything else of `ABC-010`'s.

## Ruling

**Accepted residuals, all three.** Each is LOW, owned by Architect/Design, and registered in `ADR-0033`
§ "Residuals of decision 2's guard". No ticket is cut now. Decision 2 is unchanged, and the guard already reads
exactly what decision 2 says. **Nothing is owed on the `ABC-010` branch,** and its UAT is unaffected.

| id | shape | today, measured | trigger | what the triggering hop does |
|---|---|---|---|---|
| `AR-033-NESTED` | a production `.ts` under a subdirectory of `src/` | the guard is green, but **the gate is RED**: `cli.test.ts` `A3`'s `nested` equality | **`ADR-0011` `R3`'s trigger**: the first `.ts` under a subdirectory of `src/`. That diff must relax `A3`'s equality, which removes the cover | the alignment fix below, in the same diff |
| `AR-033-EXT` | a production `.mts .cts .js .mjs .cjs` under `src/` | `.mts` is silent on the guard, suite, lint and `tsc`, even live. A live `.js` is red on `tsc` only | the **first diff that adds any of those extensions under `src/`** (0 today at both tips) | the alignment fix below, in the same diff |
| `AR-033-COMPUTED` | the name not spelled: a computed key, a typed template literal, a `\u` escape | silent on all four. The template literal form needs no cast | the **first production diff that binds `fen.ts` other than by a named import**: `import * as`, `import()` or `export * from`. There are 0 today, and the 6 importers are all named | that hop's QE reads it as an `AR-033-COMPUTED` question. **No text pin is owed**, in the same class as `AR-072-WORDHIT` |

**The alignment fix (`AR-033-NESTED` and `AR-033-EXT`; whichever trigger fires first).** The guard's file set
becomes `ADR-0036`'s widened production-file set:
- every JS/TS source under `src/`, read recursively (`.ts .mts .cts .js .mjs .cjs`);
- excluding `.test.<ext>`, declaration files (`.d.ts .d.mts .d.cts`) and `fen.ts`.

The test title changes with it. This is one test file and 0 production lines. It is a criterion on the
triggering hop's own ticket (BA/PM writes it there), not a ticket of its own. The fix closes both of the first
two residuals. **`AR-033-COMPUTED` is not closed by it,** and nothing textual closes that one.

## Why not a ticket now

1. **Shape 1 already cannot merge green.** `cli.test.ts` `A3` reds it (measured), so the real gap is "when `R3`
   fires". `ADR-0011` already rules `R3` as an accepted residual with a trigger, and this rides that trigger.
   A pointer is added beside `R3` so the hop that fires it finds this guard.
2. **Shapes 2 and 3 each need a shape the repository does not have.** There are 0 non-`.ts` sources and 0
   namespace bindings of `fen.ts`, and each would show in `git diff` before any bypass could.
3. **A bypass costs little today.** It lets a grammar-only board into a production path, and the rules core
   keeps its `ABC-009`/`ABC-022` defences for exactly that board (`ADR-0033` Consequences). No FEN input
   exists yet (`ABC-010`'s `P1` trigger).
4. **A ticket now** would be the full BA/PM → Engineer → QE path for shapes that do not exist, or a reopening
   of `ABC-010` at Ready for UAT. That is gold plating.

## Alternatives rejected

- **Widen the guard on the `ABC-010` branch now.** Rejected: it reopens a build that has passed QE and is
  waiting on owner UAT, for shapes that do not exist.
- **A standalone ticket after `ABC-010` merges.** Rejected for reasons 1–4. Its whole content is the
  alignment fix, which costs the same when it rides the triggering hop.
- **Close `AR-033-COMPUTED` with a "named imports of `fen.ts` only" pin.** Rejected: `import()` with a computed
  specifier and an `export *` barrel step around it. It would be a second text pin over an adversarial class,
  the same reasoning as `AR-072-WORDHIT` and `QE-137-b`.
- **Move `parseFenGrammarOnly` out of `fen.ts` into a test-only module.** Rejected: that module would need the
  private grammar exported from `fen.ts`, which is a production export again. `ADR-0033` § Alternatives E/F
  already weigh the bypass-vs-fixture trade.

## Risks

- The `AR-033-EXT` trigger relies on a reader noticing a new extension in `git diff --name-only`. Nothing
  reds on it, which is the residual itself. It is LOW for reasons 2 and 3.
- **Not measured:** `.cts`, `.mjs`, `.cjs`, and a `.js` with a sibling `.d.ts`. All four are inside the
  fix's set.

## NFR impact

None. `NFR-001`, `NFR-002` and `N8-LANE` are untouched, and so is security. The catalog was not opened: no
target, row or owner moves.
