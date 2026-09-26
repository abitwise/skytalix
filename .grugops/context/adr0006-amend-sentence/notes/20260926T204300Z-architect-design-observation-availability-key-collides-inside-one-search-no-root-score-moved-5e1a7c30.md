---
id: 20260926T204300Z-architect-design-observation-availability-key-collides-inside-one-search-no-root-score-moved-5e1a7c30
kind: observation
by: architect-design
at: 2026-09-26T20:43:00Z
verified_by:
confidence: high
refs:
  - ADR-0006
  - ADR-0025
  - ABC-081
  - 20260926T235000Z-orchestrator-decision-c99c5919
  - 20260926T034100Z-architect-design-observation-g6-score-pair-reds-no-castling-key-bug-on-any-path-0a3528d1
  - 20260926T034200Z-architect-design-decision-g6-pair-is-a-decision-4-row-repoint-stands-no-new-row-ea306e58
  - 20260926T203000Z-architect-design-decision-g6-ruling-amendments-written-into-adr0026-adr0006-b7e41c92
  - .grugops/context/adr0006-amend-sentence/probe/avail-key.mjs
  - .grugops/context/adr0006-amend-sentence/probe/avail-key.jsonl
  - src/search.ts
  - src/transposition.ts
supersedes:
---

# An availability-keyed table collides the knight-g1 pair's two roots in name only, but inside ONE search it hands nodes another position's entry and cuts on it; no root score moved

Hand-authored, no `seal`. This repo ships no `context-io` writer and no `propose_note` tool
surfaced at this hop, so the note follows the `adr-amend-0026-0006` precedent (`…b7e41c92`). It
is an `observation`, so it needs no stamp. Tree: the wave at `02ead8e`. No `src/` file in the
repository was edited. The mutant ran in a scratch copy outside the repository, and each
exact-string edit was asserted to match once. Values, not timings.

## Scope

- The sentence under test, `ADR-0006`'s 2026-09-25 amendment: *"An availability key would
  collide the two, and the table would return a wrong score."* "The two" is the `knight-g1`
  pair: `4k3/8/8/8/8/8/8/4K1NR w K - 0 1` and `… w - - 0 1`.
- Out of scope: the `ADR-0006` Decision, the `G6` falsifier and its erratum-ed cell. All three
  stand.

## 1. "Collide the two": true of the keys, empty for the table

- Measured in a scratch copy: the two roots' rights keys differ, and their availability keys
  (rights with every unusable right left out) are equal. Neither root can castle now (0 castle
  moves). Both have 15 legal moves.
- The two roots never share a table. `searchRoot` calls `clearTable()` at every search
  (`src/search.ts:498`), and the table's lifetime is one search (`src/transposition.ts:17`,
  `ADR-0025` decision 4). So the root collision can never make the table hand one root the
  other's score. That is the `…0a3528d1` §2 result. Under `drop-rights`, which for this pair
  keys exactly as an availability key does, the pair's scores equal clean at depths 3–6 on all
  four configurations.

## 2. Inside ONE search the shape recurs, and an availability key does return another position's entry

- The probe (`probe/avail-key.mjs`) keys the TABLE ONLY (probe and store, root and interior) on
  an availability key: the rights key minus every right that no castle move uses now, for either
  side. It leaves `keys[]` (in-tree repetition) and `zobristKeyAfterMove` unchanged. A shadow map
  records the rights key of the node that stored each table key. A probe hit whose rights key
  differs is a **foreign hit**: a different position's entry, differing only in castling rights.
- Readings (`probe/avail-key.jsonl`, 32 rows: 2 searches × 16 root/depth cells):

| root | depths | foreign hits that CUT, `search` / pre-`ABC-121` door | root score vs clean |
|---|---|---|---|
| `knight-g1 w K` | 3 / 4 / 5 / 6 | 0/0, 4/3, 8/3, 3/3 | equal in all 8 |
| `knight-g1 w -` | 3–6 | 0 in all (no right in the tree, so the two keys coincide) | equal in all 8 |
| startpos | 3 / 4 | 0 | equal in all 4 |
| kiwipete | 3 / 4 | 0/0, 17/17 | equal in all 4 |
| position-4 | 3 / 4 | 0 | equal in all 4 |
| position-5 | 3 / 4 | 0/0, 2/2 | equal in all 4 |

- Every foreign hit recorded was used. `tableCutoff` returned a score from it, and the node
  returned that score.
- The rights key (the shipped key) gives 0 foreign hits by construction. Its table key is the
  node's own rights key.
- **No root score moved on any of the 32 readings.** `…0a3528d1` §2 gives the likely reason for
  the knight pair: the colliding interior nodes sit deep, on lines that waste plies.

## 3. What this does and does not establish

- **Established:** within one search an availability-keyed table hands a node an entry that
  belongs to a different position with a different subtree, and the search cuts on it. It is
  measured on the pair and on two corpus roots. So "the table would return" a score it should not
  is true **at interior nodes of one search**, not across the pair's two roots.
- **Not established, `UNKNOWN - verify`:** whether any foreign cutoff's bound was wrong for the
  node that used it. The probe did not re-search those nodes. Also unestablished: whether an
  availability key ever changes a ROOT score on some position. None of the 32 readings did. "A
  wrong score" at the root is therefore not on record.
- Which interior nodes collide was not traced. `…0a3528d1` §2 names the rook's round trip
  (Rh2 … Rh1) as the colliding node inside the `w K` root's tree. This probe did not re-check
  that attribution.
- Not re-run: the suite. No `src/` changed, so it has nothing to re-verify.

## Risks

- The probe's availability predicate is this probe's own, not a shipped function. It reads
  castle moves from `legalMoves` for the side to move, and for the other side through a
  side-flipped copy. It matches `ADR-0006`'s "Alternatives" wording ("ask `src/legal.ts` whether
  each castle is currently playable and hash that"). A different predicate could collide
  differently. The root-pair result in §1 does not depend on the predicate.
