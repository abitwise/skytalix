---
id: 20260809T131600Z-security-nfr-claim-0d0fff8f
kind: claim
by: security-nfr
at: 2026-08-09T13:16:00Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ABC-009
  - ABC-010
  - ABC-022
  - NFR-001
  - plans/nfr-catalog.md
supersedes: 
---

# The soft results — everything this gate could not establish, recorded as non-load-bearing

`confidence: UNKNOWN - verify` on every item below. **None of these may be quoted as a measurement or
relied on downstream.** They are recorded because the honest alternative to a soft result is
recording it softly, not omitting it.

`finding` is not admissible on this task — no §14 gate exists in this install to issue a
`§14-gate#<id>` stamp and `context.human_admission` is `off`, so no `human:<name>` stamp exists
either. Nothing in any of my notes is stamped and **nothing is self-stamped**.

## 1. That the 0.33–0.43 ns per-execution cost generalises — `UNKNOWN - verify`, and this is the load-bearing soft item

The arithmetic that resolves the per-cell question rests on **one resolved cell**: startpos, where the
signal (+1.30 / +1.73 ns) is 6–8x its local null-control floor (±0.22 ns). The expensive cells
(kiwipete at ~420 ns, `R3K2R` at ~503 ns, both dominated by attack scans) **could not resolve it** —
their post−pre readings flip sign between samples and sit inside their own twin's band. So the
multiplier is measured on the cheapest shape and applied to all 396,350 executions.

**This is why the conclusion is stated with a 10x robustness bound rather than as a point estimate:**
even at 4 ns per execution the total is 0.085%, still 20x inside the bar. I believe the true figure
is nearer the measured one — a `Uint8Array` index read plus an integer compare is a sub-nanosecond
operation on this machine — **but that is an argument, and only the startpos cell is measured.**

## 2. That the twin's ~+0.9% aggregate systematic is understood — `UNKNOWN - verify`, and it is NOT attributed

Three of four aggregate identity-twin readings across two gates sit near **+0.9%** on trees that are
byte-identical. That looks systematic rather than random and it would matter if the bar's margin were
thinner. **I did not determine its cause** and no number in my verdict depends on one. Candidates I
did **not** test: module-load order effects, allocator or code-cache state differing for the
last-loaded of three module graphs, and per-tree megamorphic inline-cache state. Recorded so the next
gate has somewhere to start rather than rediscovering the shape.

## 3. That the ordering-variant timings mean anything per cell — `UNKNOWN - verify`

The `generateMoves` and `addCastlingMoves` variant tables are reported for completeness. On the
reachable cells the variant deltas (±1–6 ns on 420–500 ns calls) sit **inside the null control's own
band** and must not be read as signal — the ordering conclusion for that population rests on the
**exact execution counts** (396,350 vs 326,476 vs 280,302 vs 1,284,772), which carry no noise, not on
those timings. **The invalid-cell figure (522 → 28 ns, ~18x) is far outside any noise band and IS
load-bearing.**

## 4. That permutation invariance holds beyond the enumerated corpus — structural, and I am confident, but only the corpus is measured

The structural argument is strong: a conjunction of side-effect-free predicates over an unmutated
position is order-independent, and I verified side-effect freedom by reading and in-bounds indexing
by construction. The measurement is **33 FENs × 3 reorderings = 99 comparisons plus six exact perft
counts per variant**. **I did not enumerate the position space, and I tested three of the 120
possible orderings** — the three QE named. A reordering nobody has written could in principle
interact with something I did not consider, though I cannot construct such a thing and the structural
argument says none exists.

## 5. That `NFR-001`'s standing 6.04M–6.21M baseline still holds — `UNKNOWN - verify`, and one of my runs is under it

My lowest floor run read **6,030,518 nodes/sec**, **0.16% below** the band's bottom. Three runs on one
afternoon do not re-establish a five-run baseline and **I did not try**. I did **not** move the
baseline and I do **not** claim it is wrong; I claim only that one of my three runs sits marginally
under it and that recording it is more honest than rounding it in. The ratio form makes the question
moot for this ticket, which is the argument for the ratio form.

## 6. That the ASVS "PASS by analogue" judgements would be reached the same way by another reviewer — `UNKNOWN - verify`

V2.2.2, V2.3.1, V5.2.1 and V15.3.1 are HTTP/web/file requirements mapped onto a local rules-core
module by analogy. The mappings are reasonable and each is labelled *by analogue* rather than
presented as a literal pass, but **an analogy is a judgement**. V2.3.1 in particular — reading
*"process business logic flows in the expected sequential step order without skipping steps"* onto the
guard-ordering question — is the loosest of the four and **a reviewer who called it Not Applicable
would have a fair case.** I kept it because it is the only L1 row that speaks to the question routed
to this gate.

## 7. That anything was measured about allocation, coverage, or `gameStatus` cost — nothing was

No allocation figure was taken. **No coverage figure was measured**, deliberately — `## Problem` is
explicit that a test which only raises coverage adds nothing here, and no `--coverage` run was made,
so the tracked-`coverage/` hazard never arose. `gameStatus` was not timed; `NFR-001`'s three
`gameStatus` bars are pinned in `src/gameend.nfr.test.ts`, which is untouched and green, and this
change adds no call and no allocation to that path.

## 8. That `ABC-022`, `ABC-010` and `ABC-013` are unaffected as their tickets assume — read, not run

**`ABC-022`:** half (b) is live and intended. I did not re-run the `4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1`
row on my own instruments — the reasoning is structural (no line of `addPawnMoves` changed) and BA/PM
measured it, but **the row itself was not re-run here.** **`ABC-010`:** unbuilt; its stated scope
would reject most of this ticket's FENs, which rests on an unbuilt ticket's prose. **`ABC-013` /
`ABC-019`:** their modules do not exist and nothing was verified. No flag is raised against any of the
three and none was edited.

## 9. That my `NFR-001` catalog edit reads correctly when rendered — verified structurally, not visually

The row's field count, the untouched sibling rows and the unmoved Target/Applies-to cells were all
verified by hashing. The single `_Updated:` header line now opens an italic parenthetical that closes
on the pre-existing trailing `)_` (which was previously unbalanced, 0 `_(` against 1 `)_`, and is now
1 and 1). **I did not render the markdown to look at it**, and no renderer exists in this install to
do so.

## 10. Substrate and process items, recorded honestly rather than omitted

- **The queue claim was taken BY HAND** — `mkdir .grugops/queue/claimed/ticket-to-pr-ABC-009-sec/`
  (exit **0**, so this claim was the first) plus a `claim.md` registry record, then plain `mv` for
  both transitions — because `scripts/claim.js` does not exist. **Re-checked at the source rather
  than inherited** from the subtask brief or the six prior records: `ls scripts` (absent in the repo),
  `ls $KIT/scripts` (absent in the kit), and a `find` for `claim*` and `context-io*` across both trees
  returning only this queue's own `claim.md` files. `mkdir(2)` is the same primitive `claimTask` uses,
  so the atomicity property is unchanged — but `pending/` held exactly one file and `claimed/` was
  empty, so **queue width was 1 and the claim is degenerate**; no contention was possible and none was
  tested.
- **These notes were hand-written** into `.grugops/context/ticket-to-pr-ABC-009/notes/` in the shape
  of `agent-factory/contracts/context-note.md`, because `scripts/context-io.ts` is absent **and
  `mcp__grugops__propose_note` is not in this session's tool set** — checked against the tools
  actually available, not assumed. Workflow 16's stop condition says the sanctioned writer is
  `context-io.ts`; with no writer and no MCP channel, hand-writing is the only path that records
  anything, and **it is recorded as the deviation it is rather than presented as compliance.**
- **Every `at` in my notes and my claim record came from `date -u`**, never from a runner's
  `Start at` line. I saw the trap live in this hop: `npm test` printed `Start at 15:55:43` while
  `date -u` read `12:55Z`. **This machine is UTC+3**, confirmed by running both, exactly as
  `20260809T114649Z-orchestrator-decision-700d4a44` §1 instructs — the note that supersedes
  `20260809T141500Z-orchestrator-decision-865b06ae`, whose `at` is local time labelled `Z`.
