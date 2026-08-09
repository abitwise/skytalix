---
id: 20260809T114215Z-software-engineer-claim-b43f03cd
kind: claim
by: software-engineer
at: 2026-08-09T11:42:15Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ABC-009
  - ABC-022
  - ABC-013
  - ABC-019
  - NFR-001
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
  - plans/nfr-catalog.md
supersedes: 
---

# The soft results — everything this hop could not establish, recorded as non-load-bearing

`confidence: UNKNOWN - verify` on every item below. **None of these may be quoted as a measurement or
relied on downstream.** They are recorded because the honest alternative to a soft result is recording
it softly, not omitting it.

`finding` is not admissible on this task — there is no §14 gate in this install to issue a
`§14-gate#<id>` stamp and `context.human_admission` is `off`, so no `human:<name>` stamp exists either.
Nothing in any of my notes is stamped and **nothing is self-stamped**; every `verified_by` is empty.

## 1. That `A1`–`A10` is a complete net — `UNKNOWN - verify`, and it came in open and goes out open

Open item 1 is not closed by this hop and I am not treating it as closed. Five mutants were run against
the delivered diff; four died in the disjoint sets the ticket predicts and the fifth was proved
equivalent. **No criterion gap was found — which is not the same as there being none.**
`ABC-018`'s QE ran 56 mutants and found six that passed all twelve criteria and all 297 tests. Five
mutants written by the author of the code is the weakest position from which to certify a criteria set.
**Expect QE to find more, not to stop here.**

The one thing I can hand forward with more than a feeling is a narrowing, and it is in the companion
`observation` note: the existing through-check test **masks the entire colour dimension of both home
squares**, measured over 676 exhaustive boards. Any criterion aimed at colour there is unfalsifiable and
any mutant that only weakens colour is equivalent. **BA/PM's other named place — a criterion set written
entirely over signals that agree — was not examined by this hop at all**, and it is the one that has now
recurred on `ABC-015`, `ABC-018` and `ABC-009`.

## 2. That the behaviour-equivalence result generalizes beyond what was enumerated — `UNKNOWN - verify`

The colour-blind mutant was proved equivalent over **9,604 boards**: 676 with only the two home squares
occupied, and 8,928 with one arbitrary third piece anywhere. **Boards with two or more extra pieces were
not enumerated.** I believe no blocker can change the result — an enemy king on e1 is *adjacent* to a
`kingPath` square, and an enemy rook on the rook's home square attacks precisely the squares
`option.empty` requires clear, so no interposing piece can exist without failing an earlier test — but
**that is an argument, and only the 9,604 boards are measured.** If it matters to anyone downstream, the
enumeration is cheap to extend.

## 3. That the `6.04M–6.21M` standing baseline still holds — `UNKNOWN - verify`

My three `npm run perft` runs on the delivered tree read 6.08M–6.15M, which is *consistent* with the
catalog's range, but one machine on one afternoon does not re-establish a five-run baseline and I did not
try to. This is not a gap left carelessly: it is the argument for the ratio form the bar now carries, and
a ratio measured in one process needs no answer to this question. **Security/NFR owns the discharge on
its own instruments** and the honest expectation is that it re-derives rather than inherits, exactly as
it did on `ABC-011`, `ABC-012`, `ABC-014`, `ABC-015` and `ABC-018`.

## 4. That the per-cell ratios mean anything — `UNKNOWN - verify`, and this one is a warning

The per-cell figures in the `NFR-001` note are reported for completeness and **must not be read as
signal**. The instrument's own floor is about ±1% per cell, established by an identity twin and by two
cells whose true delta is exactly zero. **The kiwipete 0.9930 reading is not a 0.7% regression**, and the
1.0084 reading on a structurally-zero cell is not a 0.8% improvement. Only the aggregate against the
0.98 bar is load-bearing, and only because its margin exceeds the resolution.

## 5. That anything was measured about allocation, coverage, or `gameStatus` cost — nothing was

No allocation figure was taken. **No coverage figure was measured** — deliberately: `## Problem` is
explicit that a test which only raises coverage adds nothing here, `src/legal.ts` having been at 100% on
all axes when this defect shipped, and correction 5's mutants are the second proof of that. `gameStatus`
inherits the fix through its first executable line and I did not time it; `NFR-001`'s three `gameStatus`
bars are pinned in `src/gameend.nfr.test.ts` and that file is untouched and green.

## 6. That `ABC-022`, `ABC-013` and `ABC-019` are unaffected in the way their tickets assume — partly checked, recorded softly

- **`ABC-022`:** its half (b) is still live and that is intended. I did not re-measure the
  `4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1` row on my own diff — BA/PM measured it on a correct castling fix and
  the reasoning is structural (no line of `addPawnMoves` changed, no `FLAG_EN_PASSANT` behaviour changed,
  verified by the diff), but **the row itself was not re-run here**. `ABC-022`'s ticket was not edited.
- **`ABC-013`:** its `## Dependencies` entry says it is a new consumer of `legalMoves` that inherits both
  the defect and the fix. Consistent with a generator-layer fix, but `src/san.ts` does not exist and
  nothing was verified.
- **`ABC-019`:** its traceability row says it *"carries ABC-009 (legalMoves called once per frame)"*. Not
  examined; the module does not exist.

## 7. Substrate and process items, recorded honestly rather than omitted

- **The queue claim was taken BY HAND** — `mkdir .grugops/queue/claimed/ticket-to-pr-ABC-009-dev/` plus a
  `claim.md` registry record, then plain `mv` for both transitions — because `scripts/claim.js` does not
  exist in this install. **Re-checked at the source in both the repo and the kit** rather than inherited
  from the two Orchestrator notes or from BA/PM's record. `mkdir(2)` is the same primitive `claimTask`
  relies on, so the atomicity property is unchanged, but the substrate is absent and that is recorded.
- **These notes were hand-written** into `.grugops/context/ticket-to-pr-ABC-009/notes/` in the shape of
  `agent-factory/contracts/context-note.md`, because `scripts/context-io.ts` and
  `mcp__grugops__propose_note` are both absent. **No `index.md` or `index.jsonl` was hand-faked** — the
  renderer that derives them does not exist here and a hand-written render would be a fabricated
  artifact.
- **A timestamp discrepancy in the trace, recorded because the trace sorts on `at`.** `date -u` on this
  machine reads `11:xx Z` (local `14:xx EEST`, UTC+3). My notes and BA/PM's five carry true UTC. The
  Orchestrator's second note carries `at: 2026-08-09T14:15:00Z` with an `11:12Z` file mtime — local time
  labelled `Z`. So my notes sort *before* that one note despite being written after it. **I did not shift
  my clock to fix the ordering**; a fabricated timestamp is worse than a visible artifact. Nothing else
  in the trace is affected — `supersedes` is empty on every note here and no note depends on that
  ordering.
