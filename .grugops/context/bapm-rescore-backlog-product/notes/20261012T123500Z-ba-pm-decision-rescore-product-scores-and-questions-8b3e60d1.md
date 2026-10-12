---
id: 20261012T123500Z-ba-pm-decision-rescore-product-scores-and-questions-8b3e60d1
kind: decision
by: ba-pm
task: bapm-rescore-backlog-product
at: 2026-10-12T12:35:00Z
verified_by:
confidence: high
refs:
  - ABC-146
  - ABC-095
  - ABC-096
  - ABC-101
  - ABC-024
  - ADR-0038
  - EPIC-004
  - EPIC-005
  - EPIC-006
  - 20261012T123400Z-ba-pm-observation-rescore-product-readings-4f1a9c27
supersedes:
---

# Product-half Backlog re-score at `1eb2edbc`: three to `Ready`, two stay, one owner question

This is hand-authored and unsealed. The readings are in `…4f1a9c27`. The column moves and the board row are the
Orchestrator's. Each page carries a dated `## Re-score — 2026-10-12` section.

| ticket | DoR | recommend | size | pri | why |
|---|---|---|---|---|---|
| `ABC-024` | 9 → **10** | **Ready** | S | P2 | survivors re-measured at 1775/57: 5 of 7 survive; 2 are held by one incidental row each; `A1`, `A2`, `A4` and `A5` re-based |
| `ABC-095` | 8 → **10** | **Ready** | S | P1 | `ABC-093` and `ABC-094` merged; the stderr half is on the page; owner Q5 answered; `A5`'s game half made concrete |
| `ABC-101` | 7 → **10** | **Ready** | M | **P2 → P1** | `ABC-087` mapping merged (trigger fired); no `EngineSeam` change needed; scope now wires the level; startup line cut (overwritten on a TTY) |
| `ABC-146` | 9 → **8** | Backlog | XS | P1 | addendum accepted and `ABC-083` merged, but `ABC-152` likely removed the 4.35x that justified the `node` route; the owner picks the route |
| `ABC-096` | 8 (board) / 9 (page) → **9** | Backlog | S | P3 | format carries `n` (2,853 of 5,390); probe drops it; 21-column frame → family-name cut; Architect question on where the lookup runs |

**Owner question (`ABC-146`), verbatim on the page:** run the verdict inside vitest with
`LADDER_DEEP=verdict` and no new code, after one paired factor re-read lands inside the accepted 7–13 h band
(a); or build `ABC-146` as accepted, under plain `node` (b).

**Architect/Design question (`ABC-096`), verbatim on the page:** does the name reach the frame through the render
seam or as a passed-in item, and which wins the message region? BA/PM answers the product half: the rejection
line wins.

**BA/PM scope rulings taken here (negotiable, recorded on the pages):**
- `ABC-101`: the level reaches the engine. Ruling 4's startup line is withdrawn.
- `ABC-096`: show the family name, at most 21 characters.

**Pull order recommended:**
1. **`ABC-095`.** It is the only ticket in `EPIC-005` that a player can perceive, it is `S`, and every input is
   merged.
2. **`ABC-101`.** `P1`, and it gives the merged level mapping a user. It shares the `engine:` line with
   `ABC-095`, so it goes after `ABC-095`, never in parallel.
3. **`ABC-024`.** Test-only, 0 production lines, no file overlap with 1 or 2. It can run beside either.
4. **`ABC-146`**, after the owner's word. It holds a core for ~10 h, so schedule it when no width-1 window is owed.
5. **`ABC-096`**, after the Architect ruling, behind `ABC-095`. Droppable.
