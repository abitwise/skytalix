---
id: 20261009T173202Z-security-nfr-decision-abc082-pass-with-risks-nfr005-depth7-ar-drafted-for-owner-no-security-finding-c04abe30
kind: decision
by: security-nfr
at: 2026-10-09T17:32:02Z
verified_by:
confidence: high
refs:
  - ABC-082
  - ABC-083
  - ABC-074
  - NFR-004
  - NFR-005
  - NFR-008
  - NFR-009
  - N8-LANE
  - ADR-0003
  - ADR-0019
  - ADR-0028
  - AR-NFR004-A
  - AR-NFR005-082
  - src/evaluate.ts
  - plans/nfr-catalog.md
  - plans/tickets/ABC-082-evaluation-pawn-structure.md
  - .grugops/context/secnfr-ABC-082/notes/20261009T170442Z-security-nfr-observation-abc082-security-surface-none-bounded-reads-no-io-no-alloc-a8b707ad.md
  - .grugops/context/secnfr-ABC-082/notes/20261009T172203Z-security-nfr-observation-abc082-nfr005-floor-met-depth7-warn-kiwipete-margin-1-05x-ff8ad962.md
  - .grugops/context/secnfr-ABC-082/notes/20261009T173125Z-security-nfr-observation-abc082-a6-358-366ns-met-n8lane-met-net-0-nfr008-second-order-0-8s-cd2e14c1.md
  - .grugops/context/ticket-to-pr-ABC-082/notes/20261009T163130Z-software-engineer-observation-abc082-a6-cost-nfr005-depth-warn-n8lane-a00b6aaa.md
  - .grugops/context/ruling-abc082-levels/notes/20261009T164755Z-architect-design-decision-what-the-engineer-changes-what-ba-pm-folds-owner-word-owed-33e5e0a3.md
supersedes:
---

# `ABC-082` Security/NFR: **PASS_WITH_RISKS**. No security finding and no required fix. `NFR-005`'s depth-7 WARN on kiwipete is real: the margin is now 1.05–1.12x. `AR-NFR005-082` is drafted and waits on the owner's word

Hand-authored and unsealed: a `decision`, not a stamp. `human_admission` is `off`, and this
install has no sanctioned writer. Reviewed: `5ebe1d8..873911d -- src` (one production file,
`src/evaluate.ts` +96/−3). `security.asvs_level` is `L1`, `block_on` is `high`, and
`compliance_regime` is `[]`, so no Compliance Officer hand-off is owed.

## Result

**PASS_WITH_RISKS.**
- Nothing is at or above `high`, so nothing blocks.
- One LOW risk is **proposed** for acceptance: the `NFR-005` depth-7 margin on kiwipete. **This gate
  does not accept it.** As with `AR-N8LANE-121`, it waits on Olger Oeselg's word. **Recommendation: no
  merge before that word.**
- Separately, `ABC-082` already cannot merge before the owner rules on `ADR-0028` (row 17,
  Architect/Design `…33e5e0a3`). That is a different word.
- The board move is the Orchestrator's.

## Gate at `873911d`, re-run here (2026-10-09 17:26Z, load1 ~18)

`npm run lint` exit 0 (94 files). `npm run typecheck` 0. `npm run build` 0. `npm test` exit 0, 49 files /
1 504 tests. Skip count 0. `test-skip-integrity.js --skip-count 0`: "No findings."

## Items

| # | item | reading (load) | severity | disposition |
|---|---|---|---|---|
| 1 | **`NFR-005` floor (depth 6)** | **MET**, 64 / 64 runs, plain node, fresh process per run, two sessions of 8 rounds with the order alternating (load1 2.7–17.5 and 3.8–4.6). Worst floor margin seen: 1.63x | — | Met |
| 2 | **`NFR-005` depth 7 (WARN level, PROVISIONAL)** | **kiwipete: WARN.** Reached 15 / 16 here and 1 / 3 at the build. Margin **1.05–1.12x** against base 1.16–1.27x, because nodes to complete depth 7 rose **532 363 → 610 179 (+14.6%)**. That figure is deterministic and two instruments agree to the node. **position-6: reached** 16 / 16, margin 1.39–1.43x, tree −1.0%. Base also missed once under a load spike. Detail: `…ff8ad962` | **LOW.** A WARN-level performance budget whose level is PROVISIONAL, not an ASVS requirement. The floor holds | **Risk proposed for the owner's acceptance: `AR-NFR005-082`** (below). Not a FAIL, and not a required fix: the page forbids tuning around it, and no in-scope change buys the tree back |
| 3 | `A6` evaluator cost (≤ 1 100 ns) | **357.8–366.1 ns** mean, worst cell 465.0 ns (load1 3.6–4.1). Base 128.6–131.7. Detail: `…cd2e14c1` | — | Met, about 3.0x headroom |
| 4 | `N8-LANE` (≤ 650 ms net) | +0.13 / +0.14 s gross, ≈ 0 net, on two sessions with admissible nulls (load1 13–23). The build read +0.13 net | — | Met |
| 5 | `NFR-008` second order | **+0.76 / +0.84 s CPU** on existing rows (the build read about +0.6 s). The whole change is +0.83 / +0.91 s (+2.7–3.0%) | info | Reported, not ruled (`ABC-108`). A flag goes to the row's owner (see below) |
| 6 | `NFR-004` | `elapsedMs` 3 000–3 006 over 64 runs | — | Inside `AR-NFR004-A`. Nothing new |
| 7 | `NFR-009` | No allocation per call (code read) | — | Not triggered, as the page says |
| 8 | Security (ASVS L1) | Reads are in bounds (max index 103 of 128), loops are bounded, no I/O, no new dependency. `isPassedPawn` has no production importer outside `evaluate.ts`. Detail: `…a8b707ad` | — | **No finding.** The page's "not triggered" is confirmed |

**Required fixes: none.**

## DRAFT accepted-risk text, for the owner. NOT accepted by this gate

> **ACCEPTED RISK `AR-NFR005-082`.** `ABC-082`'s pawn term grows kiwipete's search tree to depth 7
> by **+14.6%** (532 363 → 610 179 nodes; deterministic). On the reference Apple M3, `chooseMove`
> at 3 s visits 640k–686k nodes on kiwipete when uncontended. That cuts the depth-7 margin from
> **about 1.2x to 1.05–1.12x**. Depth 7 on kiwipete is still reached on an uncontended machine (16 / 16 at
> load about 4). It is **lost when another process starts on the cores**: Security/NFR read 1 / 16
> below 7, and the build read 2 / 3 at load 7.7–12.9. Base missed 1 / 16 under the same kind of spike.
> **The depth-6 FAIL floor holds in every run, with at least 1.63x margin.** Position-6 is
> unaffected (1.39–1.43x).
>
> **Why it is accepted, not fixed:**
> - The depth-7 level is the WARN level, and it is PROVISIONAL (`ABC-074`).
> - The cause is the evaluator changing the tree's shape, not its speed. The page forbids
>   re-weighting to buy it back, and a pawn hash would not shrink the tree.
> - The floor the owner made binding holds.
>
> **What it costs:** on a busy machine, kiwipete will sometimes search one ply shallower than it did before
> `ABC-082`. On hardware slower than M3, that is likely the usual result rather than an occasional one.
>
> **Owner of the risk:** Olger Oeselg (the `NFR-005` level is his, `ADR-0003` clause 2 as amended).
> **Carrier:** Architect/Design, as `ADR-0003`'s owner. **Trigger:** `ABC-083` (king safety +
> mobility), which must repeat `A6`'s plain-node depth read and the clock-free nodes-to-depth-7
> read. At 1.05x, `ABC-083` will very likely put kiwipete below depth 7 even on an uncontended M3. If
> it does, the WARN becomes steady rather than intermittent, and that is the point where the
> owner decides whether depth 7 stays a level.

## The owner's word owed for `NFR-005`

**Choose one** (only the owner moves an `NFR-005` level):
1. **Accept `AR-NFR005-082`** as drafted, so `ABC-082` merges with a thinner depth-7 margin. This gate
   **recommends** this option. The floor holds, the level is provisional, base is not immune to the
   same spike, and the trigger above forces the next evaluator ticket to face the question with
   numbers.
2. **Refuse it.** Then `ABC-082` does not merge until something outside its scope buys back about
   10–15% of kiwipete's tree or node rate. Architect/Design would size that. No candidate fix is
   measured here.
3. **Move the level** (for example, depth 7 WARN on position-6 only, or a stated tolerance per
   round). That is his alone. **This gate does not recommend it**: one ticket's margin is not the
   evidence a level move needs.

## Follow-ups (not done here, each with an owner)

- **Catalog wording, after merge (catalog owner, Security/NFR by precedent `nfr-depth7-catalog`):**
  the `NFR-005` status sentence says "DEPTH 7 REACHED on the reference machine (WARN level cleared
  there)". After `ABC-082`, kiwipete is reached only intermittently under load, so the sentence should
  gain the `ABC-082` margin. It was not edited here, because this gate's fence excludes the catalog.
- **`NFR-008` (Architect/Design, `ADR-0019`'s owner):** the base default lane read 23.4 s CPU
  (build, load about 5) and 29.4–30.2 s (here, load 13–23). Both are far above 15 s. Whether
  `ADR-0019`'s rollback trigger (a) has fired is `UNKNOWN - verify` under the row's own protocol.
  `ABC-082` adds about 3%.
- **Build note correction (minor):** "node rate unchanged" holds on kiwipete. On position-6 the rate
  is about 4–5% lower (`…ff8ad962`). No action needed.
