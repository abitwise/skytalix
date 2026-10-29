---
subtask: arch-ABC-235
role: architect-design
ticket: ABC-235
ref: .grugops/context/arch-ABC-235/
branch: new grugops/arch-ABC-235 from main, worktree ../wt-arch-ABC-235
---

# ABC-235 design step: confirm which of ABC-227's six cuts are value-identical, and how to prove it

## Read
- `plans/tickets/ABC-235-…` (scope, acceptance, Dependencies: "Architect/Design confirms value-identity at design").
- SE `se-ABC-227/…7175ebdf` (A1–A5 and the six named cuts) and `…e56997fd` (method); `raw/analysis.txt`.
- EPIC-010 (S2 for value-identical changes; the G9 gate) and the ADRs touching move generation, legality, evaluation
  and ordering. The ABC-206 precedent (legality only for captures) and its proof.

## Do
- For each of the six cuts, rule:
  - **value-identical** (same move, order, scores and node counts on every position): yes / no / conditional;
  - what could break that (tie order, ep, castling through check, promotion, pins, PST symmetry, hash keys);
  - the proof it owes (perft, node-count equality on the fixed boards, a bench of N positions with byte-equal
    `chooseMove` traces, and so on);
  - its expected share from ABC-227 (not a speed-up claim).
- Recommend the order and the split. If the ticket's M is too much for all confirmed cuts, say where to split it.
- Name any ADR needed (none expected). Name the gate set for the SE: the mandatory gates plus the value-identity proof.

## Fences
- Records only: your context plus an ADR if one is needed. No `src/`, `data/`, `tools/`, ticket, epic or board edits.
  Short single-process probes are allowed (under 5 min of CPU, only when no cutechess is running; match the process
  name, not the command text). Never push, force, amend or rebase. Never merge into main. Linters only via `npm run …`.

## Publish
- Seal notes (task `arch-ABC-235`) with `at` from `date -u`: the per-cut ruling and the gate set. Commit on your branch.
  Write `## Result` plus a 10-cell trace row into this brief, then move it and its claim.md to done/.

## Result

**2026-10-29, Architect/Design. Done. Branch `grugops/arch-ABC-235` @ `00698a64` (local, not pushed, not merged).**
Records only, at `main` `ff416a56`. `main` moved to `efbb4fc7` during the hop, with no `src`/`data`/`tools` change.
There is no `src`, `data`, `tools`, ticket, epic or board edit on the branch. No ADR was written.

- **Notes** (task `arch-ABC-235`, sealed): `20261029T205200Z-architect-design-decision-7fc1b90c` (the per-cut ruling)
  and `20261029T205200Z-architect-design-decision-eebca902` (order, split, ADRs, gate set). They were written with
  the plugin's `admitAndAppend`, the call `propose_note` makes, because that tool was not available in this session.
- **Evidence** (`raw/`): the SE's 15 CPU profiles re-cut by call stack (`cuts.mts`, `cuts.txt`; no engine run), and
  one 3.3 s-CPU probe on a scratch copy of `src` (`probe.mts`, `probe.txt`, `probe-instrumentation.diff`). No
  `cutechess-cli` process was running (checked with `pgrep -x`), and load1 was 0.74-0.78.
- **Rulings** (bounds are % of self time, k / p6 / s; they are not speed-ups):
  - **Cut 1, the hoisted king square: yes, in.** Bound 7.1 / 8.2 / 7.1. It re-opens the hoist `ADR-0003` § Context
    recorded as closed, under the ≥ 3 % bar only (`OD-235-1`, INFO for the owner).
  - **Cut 2, pin-aware legality: conditional, out.** `ADR-0003` clauses 1 and 3 block it, and it would need an
    owner-ratified amendment. Bound 27.7-29.4.
  - **Cut 3, `generateCaptures`, order-exact: yes if the order is kept, in.** Bound 13.5 / 10.8 / 11.9.
  - **Cut 4, incremental material + PST: yes, out.** The net is at most 4.2-5.3 before maintenance, at 5.3-9.3
    makes per evaluate. It needs state against `ADR-0002`/`ADR-0020`, and it collides with `ABC-231`/`232`.
  - **Cut 5, the exact-keyed pawn cache: yes if both masks are verified, in.** Hit rate 94 / 92 / 83 %, with 0
    mismatches over 1 032 990 calls. Bound ≈ 10.8 / 11.8 / 9.0. 384 KiB, counted in `NFR-009`.
  - **Cut 6, allocation-free ordering: yes under four conditions, split out.** The conditions are a stable sort,
    float64 keys, no mutation of the input, and no output shared between plies. Bound 5.6-6.7 plus 0.2-1.1.
- **Split:** ABC-235 keeps 1 → 3 → 5, one commit each. BA/PM cuts a small value-identical ticket for cut 6, landing
  before `ABC-233`/`234`, or drops it.
- **Gate set:** the mandatory lint, typecheck, test and build gates; A1 cross-build identity at depth 5 on the
  `ABC-078` `A3` corpus and `ABC-121`'s 190, plus doors and `chooseMove` on `tickingClock`; the per-cut list-equality
  and `Object.is` oracles, plus spied guards; perft and `PERFT_DEEP` 32/32; `G1`-`G9` as A2 and A4 name them; and A3
  with 5 interleaved runs and a 3 % drop per cut. A5 is S2 with no smoke (consistent with `bapm-owner-words-b`'s Q4
  fold).
- **Lint:** `.grugops/` is excluded by `biome.json`, and the branch changes nothing else. No node_modules exist in
  the worktree, so no `npm run` gate applied.
- **UNKNOWN - verify:** the nps each confirmed cut buys; cut 4's net sign.
- **STOP:** none. One owner item goes as INFO (`OD-235-1`). Whether to open cut 2 (an `ADR-0003` amendment) is the
  owner's call, if he wants it.

### Trace row (10 cells, header order)

| ABC-235 (design) | Value-identity ruling on ABC-227's six cuts: 1, 3, 5 yes and in; 6 yes and split out; 2 blocked by ADR-0003; 4 out (low net, state, ABC-231 collision) | EPIC-010 | — | NFR-001 (perft half untouched), NFR-004 (clock reads equal), NFR-005 (expected up, G6), NFR-009 (+384 KiB pawn cache), NFR-008 (depth-1 lane rows); ADR-0003 (OD-235-1 INFO; cut 2 needs an amendment), ADR-0002/ADR-0020 (cut 4), no ADR written; notes …7fc1b90c, …eebca902 | grugops/arch-ABC-235 @ 00698a64 (records only): .grugops/context/arch-ABC-235/notes/ (2) + raw/cuts.mts, cuts.txt, probe.mts, probe.txt, probe-instrumentation.diff | — (records only; profile re-cut, 3.3 s probe on a scratch src copy) | n/a (records) | not released | ABC-235 In Design → Ready for Dev once BA/PM splits cut 6 (card move is the Orchestrator's) |
