---
task: refinement-ABC-017-bapm
by: ba-pm
at: 2026-08-10T20:54:05Z
---

Claimed by hand: `scripts/claim.js` does not exist in this repository or in the kit, and no
`mcp__grugops__*` tool is available (re-verified at this hop). Atomic `mkdir` per Workflow 17
step 2; the directory IS the claim.

## Outcome (recorded at the transition to `done`, 2026-08-10T21:02:41Z)

**`ABC-017` PROMOTED `Backlog` → `Ready`.** `Ready` 1/8 → 2/8; no limit approached, no override
taken. **The board move itself is the Orchestrator's** (two agents, one branch); the exact requested
row text is in the decision note.

**Eighteen acceptance/DoR defects found and fixed at a gate where the Orchestrator deliberately
named zero.** Five were witnessed by wrong builds constructed and run against merged `src/`, and
**each of the five passes EVERY criterion the ticket had**. The sharpest is the ticket's own claim
about itself: the `40/120/300` within-2x criterion is labelled *"the O(window) proof"* and it proves
nothing of the kind — **the pane is `O(plies)` in its replay term (measured `1.56 µs + 7.42 ns/ply`,
R² 0.99979 over 40…4,000 plies; `GameHistory` has no undo stack, no stored `UndoRecord` and no clone
function, so replay from the anchor is the only way to reach the window), and the ratio measures
WINDOW CONTENT — the same correct build reads 1.845x on `ABC-012`'s builder (7.7% headroom under the
old bar) and 1.060x on a knight shuffle.** Bar re-derived from measurement: ≤ 150 µs absolute
(worst measured 75.95 µs @378 plies, 0.51x) + **within 3x** + **`A11`'s spied call counts**, which
is the clause that binds. Acceptance 8 prose criteria → 12 pinned ones.

**Size `S` and priority `P2` both re-derived and both unmoved.** `src/` NOT written (zero production
lines, as expected). `plans/nfr-catalog.md` read and **deliberately not edited** — the `NFR-002`
strike was re-checked and is accurate and complete; it is **not** re-opened. `plans/board.md` **not
edited**. `ABC-016`, `ABC-018`, `ABC-019`, `EPIC-002`, `plans/traceability.md` **not edited** —
`ABC-016` is owed one cosmetic line and it is flagged, not taken. `N8-LANE` **inherited untouched**;
only the declared test-file count changed, 1 → 2. No git write of any kind. Nothing merged, nothing
deployed.

**Addendum, same transition:** `plans/traceability.md` — **one row edited** (`ABC-017`), because its
`NFRs` cell carried the refuted sentence *"the 40/120/300-ply figures within 2x of each other — the
O(window) proof"* verbatim. 35 table lines before and after, 11 pipe fields before and after,
`git diff --numstat` = 1 insertion / 1 deletion, every other row byte-identical. **`ABC-016`'s row
still carries its own superseded `≤ 250 µs/frame` bar from this morning's hop — flagged in the
decision note, not fixed here.**
