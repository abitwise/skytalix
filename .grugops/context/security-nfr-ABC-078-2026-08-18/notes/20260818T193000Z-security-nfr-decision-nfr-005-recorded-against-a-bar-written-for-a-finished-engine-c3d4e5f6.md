---
id: 20260818T193000Z-security-nfr-decision-nfr-005-recorded-against-a-bar-written-for-a-finished-engine-c3d4e5f6
kind: decision
by: security-nfr
at: 2026-08-18T19:30:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - NFR-005
  - ABC-074
  - ABC-079
  - ABC-080
  - ABC-081
  - ADR-0003
supersedes:
---

# `NFR-005` — measured at depth 4 and depth 3 against a FAIL floor of 6. **The floor is NOT relaxed,
the ticket does NOT fail on it, and the row is not touched.** What it is, is a bar written for a
finished engine reading a third-built one

**This is not a stamp.** Hand-authored `decision`; no `finding` is admissible on this install.

## The number, three times, and it is stable

| hop | `kiwipete` | `position-6` | budget |
|---|---|---|---|
| engineer | depth 4, 81 968 nodes, 3 005 ms | depth 3, 101 422 nodes, 3 025 ms | 3 s |
| QE | depth 4, 91 184 nodes, 3 021 ms | depth 3, 114 734 nodes, 3 025 ms | 3 s |
| **this gate** | **depth 4**, 88 112 nodes, 3 030 ms | **depth 3**, 91 182 nodes, 3 005 ms | 3 s |

**Against the row: `≥ depth 6` is the FAIL floor, `depth 7` the PROVISIONAL WARN level. Measured
depth 4 and depth 3 — two and three plies below the floor.** Apple M3 (Mac15,13);
`UNKNOWN - verify` elsewhere.

## The ruling, in three parts, and each part is a refusal to do something easy

**1. The row is NOT relaxed and not one byte of it is edited.** The temptation at a gate that
measures 4 against a 6 is to argue the 6 was optimistic. **It was not, and it was not this gate's
to move even if it were.** The level is `ADR-0003` clause 2 **as amended by Olger Oeselg on
2026-07-30**; a gate does not move an owner-ratified level, and this catalog says so in its own
words in three places. **The gap is evidence about the engine, not about the bar.**

**2. `ABC-078` does NOT fail on it, and the reason is causal rather than charitable.** The row
measures **the search**, and `ABC-078` did not build the search — it built the *time control around*
the search. The three tickets that buy depth at a fixed budget are all unbuilt:

| ticket | what it buys | status |
|---|---|---|
| `ABC-080` move ordering | conventionally several plies at a fixed budget — the largest single item | unbuilt |
| `ABC-079` quiescence | correctness at the horizon; costs nodes before it repays them | unbuilt |
| `ABC-081` transposition table | re-search elimination, which is what makes deepening cheap | unbuilt |

**Iterative deepening without move ordering is the configuration in which alpha-beta is worth
least** — the ordering is what makes the previous iteration's best move pay for the next one, and
that is exactly `ABC-080`. **Charging `ABC-078` with depth 4 is charging the clock for the engine's
strength.** `ABC-078` is what made the row *measurable at all*, which is what its own
`Security / NFR triggers` section predicted in advance: *"first point at which the FAIL floor and
WARN level are measurable at all. Report; do not rule."*

**3. The FAIL floor is therefore NOT DUE YET, and this is the distinction that matters.** The row
is a bar on the **finished** engine of `EPIC-004`, and `EPIC-004` is three tickets from finished.
**Recording "FAIL" against a third-built engine would burn the word** — the next reader would find a
FAIL against a bar nobody intended to be met yet, and would either relax the bar or ignore it, and
both of those are how bars die. **Recording nothing would be worse.** So the number is recorded,
with the date, the machine, the three tickets it is waiting on, and the sentence that makes it
readable later: **this is a WAYPOINT, not a verdict.**

## What has to land before the floor is meaningful — stated so the next reader inherits a test

**The floor becomes DUE at the close of the last of `ABC-079`, `ABC-080` and `ABC-081`.** At that
point `NFR-005` is a live bar on `kiwipete` and `position-6` at 3 s and a miss IS a FAIL. Two things
must be true of that hop and neither is true today:

- The measurement must be taken with **all three** landed. A reading after `ABC-080` alone is
  another waypoint, not a verdict — record it as one.
- The **depth-7 WARN level stays PROVISIONAL until `ABC-074`**, which is `Blocked` for want of a
  non-M3 machine. **This gate does not lift that marker and could not**: every number above is true
  of one machine. **`ABC-074` being blocked does not block the FAIL floor** — depth 6 is not
  provisional, only depth 7 is.

**The honest size of the gap, so nobody is surprised at that hop.** Depth 4 → depth 6 is two plies
at an effective branching factor the catalog models at ~6, i.e. **roughly 30–40x more work inside
the same 3 s** — not a tuning distance. `ADR-0003`'s own model says the three unbuilt tickets are
what pay for it. **If they land and the number is still 4, THAT is a finding about the engine and it
belongs to whoever closes the last of them** — and at that point the row's level is what gets
argued, on evidence, by Architect/Design and the owner, not by a gate.

## What is written into `plans/nfr-catalog.md`

A dated waypoint under the `NFR-005` notes: the three readings, the machine, the three blocking
tickets, the "not due yet" ruling and the trigger that makes it due. **No target, level, FAIL floor,
WARN level or PROVISIONAL marker moved**, and the eight table rows are byte-identical across the
write.
