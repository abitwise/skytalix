---
id: 20261011T231917Z-architect-design-decision-abc144-fcap-floors-after-abc152-dd7a6ec9
kind: decision
by: architect-design
at: 2026-10-11T23:19:17Z
verified_by:
confidence: high
refs:
  - ABC-144
  - ABC-151
  - ABC-152
  - RISK-ABC144-FCAP
  - NFR-008
  - ADR-0035
  - ADR-0040
  - ADR-0042
  - plans/nfr-catalog.md
  - 20261011T231055Z-security-nfr-decision-abc152-window-grades-and-result-bceca0ca
  - 20261011T231055Z-security-nfr-observation-abc152-window-readings-40741ea8
  - 20261011T231055Z-security-nfr-observation-abc152-window-method-and-limits-397a05b6
  - 20261011T162336Z-architect-design-decision-abc151-adr0040-addendum-2-k2-5c4c4ef2
supersedes:
---

# `RISK-ABC144-FCAP` after `ABC-152`: the 3.2.7 twin does not carry over the merge. The full lane keeps 1.72 s / 3.25 s until a 4.1 twin R is read at k = 2, and the risk stays open on that lane

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`). **Nothing was
measured.** This hop read Security/NFR's `ABC-152` notes `…bceca0ca`, `…40741ea8` and `…397a05b6`, `ADR-0042`
ruling 6 (owner-accepted with the addendum), `ADR-0040` addendum 2 item 6, `ADR-0035` decisions 1 and 3 and its
Rollback, and the catalog's floors block. `7a920ca5` (vitest 4.1.11, `viteModuleRunner: false`, `maxWorkers: 2`)
is an ancestor of `main` `6464bd2f`, checked with `git merge-base --is-ancestor`.

## The question and the answer

| asked | ruling |
|---|---|
| Does `V9`'s 3.2.7 twin R (CPU 0.440 s, wall 0.190 s) apply after the merge? | **No.** It is listed, not used. That is ruling 6 as the owner accepted it, and nothing read since gives a reason to move it |
| Does the full-lane floor need a 4.1 re-read? | **Yes, to move it. No, to hold it.** The full lane keeps `ADR-0035`'s recorded `F`, **1.72 s CPU / 3.25 s wall**, until the first full-lane twin R is read on 4.1.11 with the runner off at k = 2 |
| Is that re-read owed now, as a ticket or a window? | **No.** It is taken at the next paired full-lane window whose base carries `7a920ca5` |
| `RISK-ABC144-FCAP` | **Stays open** on the post-merge lane. Owner: Architect/Design. Severity: low. Its pre-merge half closed at `V9` (ruling 6) |

## Why the 3.2.7 twin does not carry over

- **The instrument changed under it.** `ADR-0035` d3 keys `F` per instrument. `ADR-0040` addendum 2 item 6 treats
  the cap as part of the instrument, and an R read at any other k is listed and not used. Ruling 6 does the same
  for the runner, because the runner change moves every file's per-file cost. The window shows that the change
  is large (`…40741ea8`). Lane CPU went from 23.41 s to 18.54 s, and CPU ÷ wall from 2.55 to 3.03. R measures the
  noise of that lane, and the lane is not the one the twin ran on.
- **Floors are data, not policy** (`ADR-0035` § Rollback). They are re-read when the instrument changes.
  - Scaling 0.440 s by the CPU ratio (0.792) would give about 0.35 s. That figure is a projection, not a reading.
  - It is refused for that reason, and it is not recorded as `F`.
- **Head's spread is not a twin.** The H − B deltas carry B's noise as well as H's. `ADR-0035` d1 reads R only
  from an identity twin. Head had no twin in this window, as ruling 6 specified.

## Why holding 1.72 s / 3.25 s is safe, and why no window is owed for it

- **`F` only screens a bound at the cut** (`ADR-0035` d3). It does not grade a reading.
- **Every reading is self-protecting.** It reports its own twin R, and it resolves a bound `b` only when that
  R ≤ `b` (d1). Otherwise it is UNRESOLVED and never MET. So a stale full-lane `F` cannot pass a reading.
- **The held value refuses more cuts than the newer reading would.** 1.72 s is 3.9 times 0.440 s, the only k = 2
  reading on record. The direction is conservative. Whether it is conservative against 4.1's own R is
  `UNKNOWN - verify` until that R is read.
- **No cut on the board needs it.** In Development, In Review and In Security/NFR are empty, and no ticket in
  Ready names a full-lane bound. A cut that wants a full-lane per-ticket bound below 1.72 s CPU is refused, as it
  is today. It goes to the narrow set (d2), or it asks for the window then.
- **`NFR-008`'s W reading does not use `F`.** W is read as head's warm median plus that window's own twin wall R
  (`V10`, `A3`). So the wall floor of 3.25 s gates nothing that a window reads.
- A dedicated window to replace a screen that nothing is waiting on would be gold plating.

## What the record now says

1. **The full lane on 3.2.7 at k = 2 (from `ABC-151`'s merge to `7a920ca5`).** `F` = 0.440 s CPU / 0.190 s wall.
   It is one reading, so d3's "fewer than three: the largest" applies.
   - That lane ended at `7a920ca5`. It governs only a paired reading whose base and head both carry `ABC-151` and
     both predate `7a920ca5`. None is in flight.
   - The straddle rule (`ADR-0040` d5) makes any such branch rebase first. So it is a record and governs nothing
     today.
2. **The full lane on 4.1.11, runner off, k = 2 (`main` from `7a920ca5`).** `F` = **1.72 s CPU / 3.25 s wall**,
   held.
   - **What moves it:** the first full-lane twin R read at k = 2 on this lane. Base must carry `7a920ca5`, and
     the twin must be a second tree of base with its own `npm ci`. The read is width 1 and warm, with n ≥ 8,
     using `ADR-0035` d1's order statistics.
   - That first R replaces 1.72 / 3.25 outright (fewer than three: the largest). From the third reading on, the
     median of the three most recent governs.
   - **Who takes it:** Security/NFR, at the next paired full-lane window. They already report the twin R under
     d1. Architect/Design moves `F` from it in the catalog's floors block, and closes `RISK-ABC144-FCAP` in the
     same hop.
   - A cooled twin is read only if that window owes the cooled state. Otherwise the warm R alone moves `F`, as
     it would have on 3.2.7.
3. **Narrow sets, from `7a920ca5`** (ruling 6, unchanged; written here because the merge has now happened).
   - The catalog's per-set floors are 3.2.7 readings. They do not carry over: `src/cli.test.ts` 1.097 s,
     `src/history-pane.nfr.test.ts` 0.058 s, `history-pane.nfr` + `render-seam.test` 0.038 s, and the one-file
     row 0.17 s / 0.27 s.
   - Every set is now "a set with none". It takes a provisional 16 % of its own base CPU, from one harness run
     on 4.1.
   - Its first admissible 4.1 reading replaces that, and the median of three governs from the third (d3
     amendment). Ruling 6's "its first three readings on 4.1 replace that" is read as this d3 rule. It is not
     a different one.

## Alternatives rejected

- **Use 0.440 s / 0.190 s after the merge.** The owner accepted ruling 6, which forbids it, and the instrument
  changed (above). Rejected.
- **Use 0.440 s scaled to 4.1, or the H − B spread, as a 4.1 R.** One is a projection and the other is not a twin.
  Rejected (above).
- **Close `RISK-ABC144-FCAP` and open a new id for the 4.1 lane.** Its own text ("the full-lane `F` under the cap
  was not re-read") is still true of the lane `main` carries. Ruling 6 closed it only "for the lane before the
  merge". A second id would split one gap across two names. Rejected.
- **Give the full lane the provisional 16 % (about 3.0 s CPU on 18.54 s).** The 16 % is the per-narrow-set rule.
  Ruling 6 and item 6 both keep the full lane on its recorded `F`. Rejected. No reading argues for it.
- **Commission a 4.1 twin window now.** Rejected as gold plating (above).

## Recorded

- `ADR-0035` § Status: one dated paragraph, "Floors after `ABC-152`". No decision changes.
- `ADR-0040` § Status: one dated pointer under addendum 2 item 6. No literal moves.
- `plans/nfr-catalog.md`: one `_Updated:` line. No table row is touched, and the floors block is not edited.
- `plans/traceability.md`: one appended row.
- `ADR-0042` is not edited. Ruling 6 already holds this answer.

**No owner word is owed.** This applies owner-accepted ruling 6 to a merge that has now happened. No level, bar
or literal moves.
