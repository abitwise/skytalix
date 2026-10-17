---
id: 20261017T121000Z-qe-e2e-observation-abc156-criteria-plants-gates-0e84865a
kind: observation
by: qe-e2e
task: qe-ABC-156
at: 2026-10-17T12:10:00Z
verified_by:
confidence: high
refs:
  - ABC-156
  - plans/tickets/ABC-156-metrics-rework-rate-undercounts-backward-moves.md
  - 20261017T120500Z-qe-e2e-observation-abc156-independent-rederivation-bb48de4c
  - 20261017T150100Z-software-engineer-decision-header-placement-a1560002
supersedes:
---

# Criteria at tip `6d2caf56`, planted wrong rows, the SE's two flagged choices, and the gates

**Criteria, each measured.**
- **A1.** `grep -c "13 backward moves in total" plans/metrics.md` gives **0**. The row contains
  `15 backward moves in total (0.60 per ticket)` and `9 of 25 \`Done\` tickets (36%)`.
- **A2.** The row's nine `` `ABC-0nn` **n** `` cells read 009 1, 011 1, 016 2, **017 2**, **019 3**, 025 1, 027 1,
  028 3, 029 1. They sum to **15**. The register's chronology has **15** rows, and its `uniq -c` by ticket equals the
  row. The other seven counts are byte-equal to base `ac7d9589`.
- **A3.** `grep -c "off by one" plans/metrics.md` gives **0**. The row names
  `plans/tickets/history/backward-move-ordinals.md` as holding the corrected ordinals (`2, 3, 4, 5`).
- **A4.** The row reads *"the last ten produced 7 bounced tickets and 13 moves"*, and that equals my own walk
  (`…bb48de4c`). The method is one parenthetical: order is the first `## Done` entry at or before `3215004c`, and moves
  are counted per commit from the `ABC-039` chronology.
- **A5.** `git diff --numstat ac7d9589 6d2caf56 -- plans src memory-bank` gives `plans/metrics.md` **2/1**, the
  ticket page **29/0** and `plans/traceability.md` **1/0**. Nothing is under `src/` or `memory-bank/`. In
  `plans/metrics.md` the 1 deletion is row `:28` and the 2 additions are that row and one `_Updated:` line at `:2`.

**Planted wrong rows.** I copied the tip's `plans/metrics.md` to scratch, re-ran every check above against base, and
reverted nothing in the worktree.

| plant | caught by |
|---|---|
| `ABC-017` back to **1** | A2 (sum 14) |
| an `off by one` sentence re-added | A3 |
| `0.62 per ticket` | A1 |
| a blank line after the new header | A5 (3/1) |
| last-ten `11 moves` | A4 |
| compensating `ABC-028` 2 / `ABC-019` 4 | **sum still 15**; caught only by A2's "017 is 2, 019 is 3, every other unchanged" clause (`QE-156-b`) |

**Flagged choice 1: the header line with no blank separator.** A5 reads *"one `_Updated:` line added, **0 other
lines**"*. A blank line would be a second added line, so the SE's literal reading is right, and a blank line would
fail A5 (plant 4). The cost is real. Under CommonMark, consecutive lines form one paragraph, so the 2026-10-17 line and
the 2026-08-20 QE line render as one run of text. One option inside A5 was not considered: a trailing `\` on the new
line is a CommonMark hard line break. It renders the two headers on separate lines and still adds 1 line with 0
others. The SE's note says *"`A5` has to allow it"*, and that is not so. **Ruling: conforms; cosmetic `QE-156-a`
LOW.**

**Flagged choice 2: the Period-cell correction clause.** A5 bounds the change by the line (*"row `:28` changed"*). The
Scope bounds it by the row. The Period cell is in that row, on that line, so the clause is inside both. It keeps the
2026-08-12 method text, *"de-duplicated by ticket and date"*, and marks it *"not reused"*, which is what Test note 2
asks. It does not contradict A4's one-clause method in the Value cell. It restates the method once more, on purpose,
where the old method stands. **Ruling: conforms, no gap.** The cell's lead date `2026-08-12` stays correct, because the
window is still `3215004c` (2026-08-12).

**Raise trigger (P3 → P2).** `git grep` on `main` for `0.52 per ticket` / `13 backward moves` finds only the
defect-identifying records (`ABC-039`/`ABC-156` pages, the register, BA/PM and QE notes) and the Factory Coach's
2026-08-12 artifact-ref (`audit-delivery/…metrics-filled-0b844c19.md:33`). No ruling cites 13 or 0.52 as evidence.
**Not fired.**

**Gates at `6d2caf56` (worktree clean).**
- `npm run lint`: exit 0, 113 files.
- `npm run typecheck`: exit 0.
- `npm run build`: exit 0.
- `npm test`: exit 0, 58 files, **1810/1810**. `.test-results/last-run.json` shows `success` true,
  pending 0, todo 0.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0.
- `git merge-tree --write-tree main 6d2caf56`: exit 0. `main` has 4 commits ahead (board and context only),
  with no overlap on `plans/metrics.md` or `plans/traceability.md`.
- No deep lane is triggered, because no `src/` file changed.

**UAT-waiver reading.** `git diff --name-only ac7d9589...6d2caf56 | grep -v '\.test\.ts$' | grep '^src/'` is
**empty** (grep exit 1). The per-commit form on `64e9c94d` and on `6d2caf56` is also empty, and
`git diff --name-only ac7d9589...6d2caf56 -- src` lists 0 files. **The waiver applies.** It is a waiver, not a
signature.
