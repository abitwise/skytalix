---
id: 20260812T025000Z-qe-e2e-artifact-ref-reproduction-kit-2f0d6b95
kind: artifact-ref
by: qe-e2e
at: 2026-08-12T02:50:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-017
  - NFR-008
  - ADR-0008
  - EPIC-002
supersedes:
---

# The reproduction kit — every number in this hop, re-runnable

> **Hand-authored.** These files are inputs to a measurement, not report files; they exist so the
> next hop re-runs the evidence instead of trusting it. **None of them is under `src/`** and none is
> part of the product build.

All paths relative to `.grugops/context/quality-gate-ABC-028-instrument/artifacts/`.

| file | what it is | how to run it |
|---|---|---|
| `a4-instrument-and-criterion.ts.txt` | **the deliverable.** The instrument plus four `it`s, exactly the text that produced every verdict. Appends to `src/history-pane.test.ts`; adds no file, no module, no dependency. `tsc` 0, `biome` clean. | `cat` it onto a copy of `src/history-pane.test.ts` in an out-of-tree replica |
| `premises.ts` | re-verifies the two blocker premises (`Object.freeze` on a view; the writable `moves` slot) | `node probe/premises.ts` |
| `make-mutants.ts` | builds the nine panes from the delivered source text, one anchored edit each, md5-checked against `54fd4346dcc1a0060c4e66ae0149265d` first | `node probe/make-mutants.ts` |
| `fixtures.ts` | `ABC-017` `A1`'s ten lengths, rebuilt verbatim from `src/history-pane.test.ts:139-152` | imported by the two below |
| `matrix.ts` | the kill matrix, the arming counter per length, and the failure-mode probes | `node probe/matrix.ts` |
| `lane-n8.py` | `N8-LANE`'s method: CPU via `wait4` rusage, 9 rounds, order rotated, round 0 discarded, median of paired deltas + sign test, identity null control | `python3 lane-n8.py` with `laneA` / `laneB` / `laneN` beside it |

**To rebuild the trees** (this is how they were built here, and it is why nothing under `src/` was
touched):

```
git -C ../cli-chess-ABC-029 archive HEAD src package.json tsconfig.json | tar -x -C <tree>
ln -sfn ../cli-chess-ABC-029/node_modules <tree>/node_modules      # no second npm install
diff -r ../cli-chess-ABC-029/src <tree>/src                        # must be silent
```

**Trace ids this hop touches:** `ABC-028` `A4` (instrument demonstrated, criterion text still owed to
BA/PM), `ABC-017` `A9` (its freeze instrument re-measured and its coverage boundary restated),
`NFR-008` / `N8-LANE` (per-ticket delta measured for `A4` alone), `ADR-0008` (both ratified clauses
re-run and holding).

**`plans/traceability.md` was NOT edited.** No test landed in the repository at this hop — the
criterion is unwritten and the code is an out-of-tree existence proof — so there is no
requirement→code→test row to append yet. It falls due at the build hop, and appending one now would
be a trace row for a test that does not exist.
