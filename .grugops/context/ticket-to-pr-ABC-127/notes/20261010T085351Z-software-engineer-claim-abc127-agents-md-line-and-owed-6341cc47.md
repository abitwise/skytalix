---
id: 20261010T085351Z-software-engineer-claim-abc127-agents-md-line-and-owed-6341cc47
kind: claim
by: software-engineer
at: 2026-10-10T08:53:51Z
verified_by:
confidence: high
refs:
  - ABC-127
  - ABC-126
  - AGENTS.md
  - src/puzzle-suite.baseline.json
  - 20261010T085351Z-software-engineer-decision-abc127-curated-rows-oracles-one-budget-558e9520
  - 20261010T091643Z-software-engineer-observation-abc127-gates-a1-a8-readings-eee7be49
supersedes:
---

# `ABC-127` `A9` line, drafted for the AGENTS.md Scribe, and what is owed

Hand-authored and unsealed. `AGENTS.md` is fenced from this build. The text below is a draft, and
placing it is the Scribe's job.

## The draft: replace the first two lines of the `PUZZLE_DEEP` comment

**Old** (`AGENTS.md` lines 110–111 at `4a64dd9`):

```
  <!-- RUN 2026-10-09: exit 0, 12 passed (9 default), 17.3 s at load1 ~11 (~13 s quiet). Baseline
  `src/puzzle-suite.baseline.json` (40/40, budget 25, step 1). TRIGGER (owner, option B,
```

**New** (the rest of the comment, from `TRIGGER` on, unchanged):

```
  <!-- RUN 2026-10-10: exit 0, 17 passed (12 default), 32-34 s (gating run 20-21 s) at load1 4-8;
  ABC-127 A7 reads <= 90 / 45 s, never asserted, 300 s hang guards. Baseline
  `src/puzzle-suite.baseline.json` (58/62, budget 25, step 1; the 4 unsolved rows named, a run
  prints NEWLY-MISSED / NEWLY-SOLVED per row that differs). TRIGGER (owner, option B,
```

- **Size.** The file goes from 23 464 B to **23 633 B** (+169), under the 24 576 B budget. This was
  measured by applying the replacement in memory, not by writing the file.
- **The count `17 passed (12 default)` is the guard** against an unrecognised `PUZZLE_DEEP` value
  (Security/NFR `…5e1c0a84`). An unrecognised value runs only the 12 default rows.
- **Sources.** The numbers come from observation `…eee7be49`. They are the three `A6` processes at
  `47433c5`: whole lane 32.1 / 32.2 / 33.5 s and gating 20.3 / 20.4 / 20.8 s, at load1 4.2–7.6.

## Owed, not this build's

- **QE `qe-e2e` hop.** QE should re-run `A3` with its own harness, because this build's harness
  reads QE's edits verbatim. QE should also judge whether random-placement rows are acceptable
  breadth (decision `…558e9520` D1).
- **Security/NFR, `N8-LANE`.** The reading is in the observation. The bar is theirs to read.
- **`ABC-126` rebases onto this.** It changes 2 `HANGING_CORPUS` rows. The 22 rows here sit after
  them, and the in-check pair is not a new row. Any baseline move it causes goes in its own commit.
- **Board and trace status.** The board move belongs to the Orchestrator (a board audit is open).
