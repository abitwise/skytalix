---
id: 20261009T213713Z-software-engineer-claim-abc084-agents-md-line-and-owed-a9bf6ab2
kind: claim
by: software-engineer
at: 2026-10-09T21:37:13Z
verified_by: 
confidence: medium
refs:
  - ABC-084
  - ABC-079
  - N8-LANE
  - AGENTS.md
supersedes: 
---

# `ABC-084`: the drafted `AGENTS.md` line (`A8`, Scribe's), and what is owed

Hand-authored, no seal. The `AGENTS.md` text is a draft only: the file is fenced from this subtask.

## Drafted line, for the `### Test` list after the quiescence deep lane

```
- Puzzle suite — strength gate (opt-in, ABC-084): `PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts`
  <!-- exit 0, 12 passed (9 default), ~13 s. Baseline `src/puzzle-suite.baseline.json` (40/40,
  budget 25, step 1). TRIGGER (owner, option B, 2026-10-09): QE runs it during review when the
  change touches engine code (`src/engine.ts`, `src/search*.ts`, `src/evaluate*.ts`,
  `src/quiescence.ts`, `src/transposition.ts`, move ordering). red = QE FAIL. The baseline moves
  only in its own commit with a stated reason, never with an engine change (no trigger-list file
  in that commit); raising it is QE's, lowering it needs the owner's word.
  `PUZZLE_DEEP=weakened` is A3's red demonstration and exits 1 by design. -->
```

The draft is 730 B (`awk` over the fenced block). `AGENTS.md` reads 22 451 B at `7b54dae`, so it lands at about 23 181 B, under
the 24 576 B bar. `wc -c` after landing is the Scribe's check.

## Owed / open (not done here)

- **`N8-LANE`:** three admissible runs read +790 / +400 / +120 ms net, at load1 54 / 31 / 24. The
  median is under 650 and run 1 is over. This is handed up per the brief, with nothing trimmed.
  - If the lane is ruled over, the remedy is to move the `A6` mate-oracle row (~157 ms) into
    `PUZZLE_DEEP`.
  - That remedy is not taken here.
- **The UAT-waiver rule's grep** counts `src/puzzle-corpus.ts` and `src/puzzle-suite.baseline.json`
  as non-`.test.ts` files under `src/`, so it does not read "zero production lines". They are test
  data: only `src/puzzle-suite.test.ts` and `src/quiescence.test.ts` import the module (grep over
  `src/*.ts`). Whether the waiver applies is the Orchestrator's call.
- **ABC-079's two in-check rows** (observation `…26f28829`): the doc comment is wrong for them. A
  comment fix, or nothing, is ABC-079's or BA/PM's call. The rows stay.
- QE hop, board move and the `AGENTS.md` line: the Orchestrator and the Scribe.
