---
task: refinement-ABC-016-bapm
by: ba-pm
at: 2026-08-10T19:49:52Z
---

Claimed by hand: `scripts/claim.js` does not exist in this repository or in the kit, and no
`mcp__grugops__*` tool is available (re-verified at this hop). Atomic `mkdir` per Workflow 17
step 2; the directory IS the claim.

## Outcome (recorded at the transition to `done`, 2026-08-10T20:02:41Z)

**`ABC-016` PROMOTED `Backlog` → `Ready`.** `Ready` 0/8 → 1/8; no limit approached, no override
taken. **The board move itself is the Orchestrator's** (two agents, one branch); the exact requested
row text is in the decision note.

**Sixteen acceptance/DoR defects found and fixed where the Orchestrator's pre-check named two.**
Four were witnessed by wrong builds constructed and run against merged `src/`. The sharpest is not an
acceptance defect at all: **item 7's `gameStatusOf(history)` call was a SECOND repetition derive of
the same move list per frame — measured 47.93 µs at 120 plies and 95.64 µs at 300, 91% of the
panel's whole cost — and it made two of `ABC-019`'s acceptance criteria false.** The claimable set is
now an input. NFR bar re-derived from measurement: 250 µs/frame (no denominator, dominant term
omitted) → **≤ 25 µs at each of 40/120/300 plies, within 3x, plus a spied call count**; measured
0.40x and 1.88x. Row count pinned at `STATUS_ROWS` = 3.

**Size `M` and priority `P1` both re-derived and both unmoved.** `src/` NOT written (zero production
lines, as expected). `plans/nfr-catalog.md` read and **deliberately not edited** (`ABC-026`'s hop
holds it). `plans/board.md` **not edited**. `ABC-017` and `ABC-019` **not edited** — `ABC-019` is
owed one line and it is flagged, not taken. No git write of any kind. Nothing merged, nothing
deployed.
