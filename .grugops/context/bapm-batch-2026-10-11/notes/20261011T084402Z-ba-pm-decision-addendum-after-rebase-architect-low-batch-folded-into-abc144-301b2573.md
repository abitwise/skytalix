---
id: 20261011T084402Z-ba-pm-decision-addendum-after-rebase-architect-low-batch-folded-into-abc144-301b2573
kind: decision
by: ba-pm
at: 2026-10-11T08:44:02Z
verified_by:
confidence: high
refs:
  - ABC-144
  - ABC-116
  - ABC-085
  - ABC-083
  - AR-N8SPAWN-DRIFT
  - N8-LANE
  - NFR-008
  - QE-093-b
  - ADR-0017
  - ADR-0035
  - ADR-0037
  - ADR-0039
  - 20261011T084150Z-ba-pm-decision-batch-085-fold-105-rescore-095-fold-cut-143-144-111-fold-f4950252
  - .grugops/context/design-low-batch-2026-10-11/notes/20261011T083621Z-architect-design-decision-ar-n8spawn-drift-discharge-repointed-to-lane-cpu-ticket-36088a35.md
  - .grugops/context/design-low-batch-2026-10-11/notes/20261011T083621Z-architect-design-decision-n8lane-5pct-is-of-the-13s-level-650ms-is-fixed-5ad29a76.md
  - .grugops/context/design-low-batch-2026-10-11/notes/20261011T083621Z-architect-design-decision-nfr008-clause-covers-tools-tests-instrument-is-npm-test-7bf3d1ce.md
  - .grugops/context/design-low-batch-2026-10-11/notes/20261011T083621Z-architect-design-decision-qe093b-compiler-checks-source-sha256-ticket-xs-p3-e95791ae.md
  - plans/tickets/ABC-144-npm-test-chokes-the-macbook-air-m3-cut-its-cpu-and-cap-its-cores.md
supersedes:
---

# Addendum after rebase onto `f6187bc1`: the Architect's LOW-batch follow-ups for the lane-CPU ticket are folded into `ABC-144`; two BA/PM follow-ups are left for the Orchestrator

This note is hand-authored and unsealed. It amends the board-move WIP count in `…f4950252` (item 7).
Everything else in that note stands.

**The wave moved during the hop.** It went `506550f3` → `f6187bc1`: `ADR-0039` (`ABC-083` R reds,
proposed), the Architect LOW batch (`design-low-batch-2026-10-11`), `ABC-114` and `ABC-070` pulled,
and the `ABC-094` UAT hop closed.
- The branch was rebased. The only conflict was the append-only trace, and both sides were kept.
- **Id check re-run:** still no `ABC-143` or `ABC-144` anywhere. The Architect's `QE-093-b` note
  recommends a ticket but cuts no id.

## Folded into `ABC-144` at this hop (both addressed to "the lane-CPU P1 ticket now being cut")
1. **`AR-N8SPAWN-DRIFT`'s discharge** (`…36088a35`, `ADR-0017` § Pointers 2026-10-11). This is
   § Scope 4 on the page.
   - `src/cli.test.ts` is read on its narrow set in the same no-other-hop window, against its last
     admissible base reading.
   - Within `F` = 1.097 s, the risk is discharged for that tree. Over `F`, each of the 27 children
     is checked under `T2`.
   - The result is reported in `A5`.
2. **The `N8-LANE` re-derivation as an output** (`…5ad29a76`). If the owner levels a CPU total
   again (owner question 2), `A5` carries the re-derivation. BA/PM recommends no new level, so
   650 ms stays a fixed number.
3. **The instrument is `npm test`**, `tools/` tests included (`…7bf3d1ce`). The page already said
   `npm test`, and now cites the ruling.

**`ABC-144`'s DoR is unchanged at 10/10.** These folds add one scope bullet and two report fields
and move no criterion.

## Not done here — BA/PM follow-ups from the LOW batch, outside this subtask's five items
- **`ABC-116` pointer fold** (`…36088a35`): re-point the two page lines (~124, ~185) that say
  `ABC-108` holds `AR-N8SPAWN-DRIFT`'s discharge, to `ABC-144`. No DoR, size or column change.
- **Cut the `QE-093-b` ticket** (`…e95791ae`): the compiler checks `SOURCE_SHA256`, `XS`, `P3`.
  The page content is fully specified in that note. The next free id after this batch is
  **`ABC-145`**.

## Board WIP, corrected (amends `…f4950252` item 7)
- **Ready is 2/8 at `f6187bc1`** (`ABC-116`, `ABC-117`).
- Placing `ABC-143` and `ABC-105` makes it **4/8**. Adding `ABC-144` makes it **5/8** until it is
  pulled into `In Design`.
- `ABC-085` → `Ready for Dev` takes In Design to 0/2. Then `ABC-144` makes it 1/2.
