---
subtask: arch-ABC-230-reading
role: architect-design
ticket: ABC-230
ref: .grugops/context/arch-ABC-230-reading/
branch: new grugops/arch-ABC-230-reading from main, worktree ../wt-arch-ABC-230-reading
---

# ABC-230's wait: the Architect's reading of ADR-0002 clause 3 (game history into search), plus the en-passant options for EPIC-010 Q3

## Read
- ABC-230; EPIC-010; SA `sa-ideas-verify/…306a4012` item 3 and `sa-ABC-226/…cc53fc79` (484 costed repetitions, R 26; 22
  games where cutechess's ep-normalised key saw a threefold that skytalix's counted twice).
- ADR-0002 (clause 3), ADR-0020 (d2, the owner's 2026-09-19 ep ruling), ADR-0005 clause 1 (superseded), ADR-0044 D3,
  ABC-081 A6, `src/zobrist.ts`, `src/engine.ts`, `src/uci-session.ts`, `src/search.ts` (path repetition).

## Do
- Rule how ABC-230 passes the reversible game history (since the last irreversible move) into the search for CLI and
  UCI: the data shape, where it is built, how the search treats "repeated in game history" versus "cycle on the search
  path" (draw score or not, 2-fold vs 3-fold), the bare-FEN limit, the TT interaction, and what changes values (for the
  merge rule's smokes).
- Whether an ADR is needed (new, or an amendment) and who accepts it (the owner for owner-accepted ADRs, per `…5aaf7cec`).
- **EPIC-010 Q3, for the owner:** options for ADR-0020 d2: (a) keep it; (b) an ep-legal-only key computed cheaply,
  only when an ep square is set; (c) normalise only for the game-history comparison, leaving the hash as it is. Give the
  cost of each (measure only if cheap), its effect on the TT, book and perft, and a recommendation. Don't decide it.

## Fences
- Records only: the ADR folder plus your context. Probes are single-process, under 5 min of CPU, only when
  `pgrep -x cutechess-cli` is empty. SE `se-ABC-235` builds in `src/` in parallel: don't touch its files. Never push,
  force, amend or rebase. Never merge into main. No board, ticket or epic edits.

## Publish
- Seal notes (task `arch-ABC-230-reading`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus a
  10-cell trace row into this brief, then move it and its claim.md to done/.

## Result

*Architect/Design, 2026-10-29, task `arch-ABC-230-reading`; records plus three probes, at `main` `989093f3`.*

- **ADR:** `memory-bank/50-decisions/ADR-0054-the-games-earlier-positions-reach-the-search-as-read-only-prior-keys-and-a-pre-root-repetition-needs-two-earlier-occurrences.md`,
  **PROPOSED.** It adds to `ADR-0002` clause 3 and amends `ADR-0044` D2/D6. **The owner accepts it**
  (`…5aaf7cec` item 3: a new ADR that changes owner-accepted ones). The amended ADRs' texts are not edited; dated lines
  follow on acceptance.
- **Notes** (task `arch-ABC-230-reading`, sealed): `20261029T213529Z-architect-design-observation-e7e6b651` (code
  facts, probes) and `20261029T213529Z-architect-design-decision-90a3aa31` (ruling, ADR owner, Q3 options). The
  `propose_note` tool was not available in this session, so both were written with the plugin's `admitAndAppend`, the
  call `propose_note` makes.
- **Evidence** (`raw/`): three single-process probes on scratch copies of `src/`, about 4 s of CPU in total.
  `pgrep -x cutechess-cli` was empty before each run.
- **Ruling:**
  - **Data:** `priorKeys` is a read-only list of the pre-root keys, oldest first, root excluded, at most
    `min(clock, 100)`. It is an optional `EngineOptions` field. Absent, the search is base.
  - **CLI:** `cli.ts` injects `keyHistory` into the level seam. The licence set is unchanged.
  - **UCI:** `parsePosition` keeps the replayed keys. A bare FEN gives none.
  - **Scan:** one match on the path (root included) is a draw, as today. Before the root, two matches are needed.
    Probe H2 shows a one-match rule inventing a draw.
  - **Table:** no change (cleared per search).
  - **`ADR-0026` d10:** does not apply. Exact rows replace the drift oracle.
  - **Value-changing,** so the smoke pair applies. It is node-identical with no prior keys or with root clock 0.
- **Q3 (owner; not decided here):**
  - **(a) keep:** costs 0.
  - **(b) capturer-beside key:** reverses d1, re-keys at least 685 book entries, and moves d5 nodes on 5 of 6
    benchmarks.
  - **(c) normalise the oldest window key, for history comparisons only:** an S ticket. No effect on the table, book,
    perft or pins.
  - **Recommendation: (a).** (c) is the remedy if the owner wants exact repetition. Not (b).
- **For BA/PM to fold** (no ticket edited here): Scope item 3 and item 5, the `A1` "door" wording, the `A5` cut, and
  two new rows (H2, H4). DoR row 10 is answered on acceptance.
- **STOP:** none. The build may proceed against `ADR-0054`. The smokes and the merge wait on the owner's acceptance.
  Q3 blocks nothing.

### Trace row (10 cells, header order)

| ABC-230 (design) | ADR-0054 PROPOSED: game history reaches the search as read-only prior keys (CLI by injected keyHistory, UCI by parsePosition); path repetition one match, pre-root two; adds to ADR-0002 c3, amends ADR-0044 D2/D6 | EPIC-010 | — | NFR-009 (≤ 100 keys, no new allocation), NFR-005 (G6 unaffected: benchmarks carry no prior keys), RISK-EPIC010-06 (bounded at 100); ADR-0054 (new), ADR-0002 c3 and ADR-0044 D2/D6 (amended on acceptance), ADR-0020 untouched (Q3 costed: (a) recommended); notes …e7e6b651, …90a3aa31 | grugops/arch-ABC-230-reading @ 80b2e2eb (records only): ADR-0054 + .grugops/context/arch-ABC-230-reading/notes/ (2) + raw/ (3 probes, outputs, 2 variant diffs) | probes only (no test run): H1 3rd occurrence 0 / base −1006; H2 2nd occurrence base kept (one-match rule 0); H4/H5 identity; Q3-1 685 book keys; Q3-2 d5 nodes moved 5/6 | — (UAT owed at ABC-230's build) | — | PROPOSED; owner acceptance pending; Q3 open (default (a)) |
