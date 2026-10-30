---
id: 20261029T213529Z-architect-design-decision-90a3aa31
kind: decision
by: architect-design
at: 2026-10-29T21:35:29Z
verified_by: 
confidence: high on the design (probe H, code read); the Q3 table's costs are probed for book and nodes, sized by reading for the rest; strength effect of ABC-230 UNKNOWN - verify until its smokes
refs:
  - arch-ABC-230-reading
  - ABC-230
  - EPIC-010
  - ADR-0054
  - ADR-0002
  - ADR-0020
  - ADR-0044
  - ADR-0025
  - ADR-0026
  - ABC-081
  - sa-ABC-226/20261029T202608Z-system-analyst-observation-cc53fc79
  - sa-ideas-verify/20261029T200022Z-system-analyst-observation-306a4012
  - ADR-0005
  - ADR-0011
  - ADR-0012
  - ADR-0053
  - ABC-220
  - ABC-221
  - ABC-235
  - RISK-EPIC010-06
  - owner-delegation-2026-10-22/20261022T140148Z-orchestrator-decision-5aaf7cec
  - memory-bank/50-decisions/ADR-0054-the-games-earlier-positions-reach-the-search-as-read-only-prior-keys-and-a-pre-root-repetition-needs-two-earlier-occurrences.md
supersedes: 
seal: sha256:4cde19add31ce3097f81a6442aa7157639193ab0f1e870c9b323d5d4ee865de3
---

# Ruling for ABC-230: prior keys handed in, two pre-root occurrences make a draw, ADR-0054 PROPOSED (the owner accepts); EPIC-010 Q3 options costed, (a) recommended

The evidence is the sibling observation of this task. The design text is `memory-bank/50-decisions/ADR-0054-…` on branch `grugops/arch-ABC-230-reading`. This note says what binds and who decides.

## 1. The ruling for ABC-230
- **The data.** `priorKeys` is a read-only list of the Zobrist keys of the game's positions before the root, oldest first, with the root excluded. It holds at most `min(root clock, 100)` keys. It is an optional `EngineOptions` field. Absent or empty, the search is today's, node for node. One pure helper trims a full key list for both surfaces, and the engine also reads at most the last 100. The list is not copied, so `ABC-081` `A6`'s one-array rows hold.
- **Where it is built.**
  - **CLI:** `cli.ts` injects `keyHistory` into the level seam. `level-seam.ts` gains no runtime `history.ts` import, so the licence set is unchanged. `createLevel` passes the list on. The blunder path's children get the list plus the root key.
  - **UCI:** `parsePosition` keeps the keys it replays through and returns them with the position. `ucinewgame`, a refused `position` and a bare FEN give an empty list.
- **The scan.** A node at ply `p` with key `k` and clock `c` scores 0 if `k` stood **once on the path** (`keys[0..p−4]`, the root included, bounded by `c`; unchanged) or **twice before the root** (the same walk continued below 0, bounded by `c` and by the list). One pre-root match is not a draw. The order (repetition, then capacity, then table) is unchanged. Quiescence, `search()` and the test-only doors take no prior keys.
- **Why two.** A path cycle's first occurrence is searched, so the side that would leave the cycle is seen leaving it. A pre-root occurrence is history. Probe H2 shows a one-match rule scoring 0 at a second occurrence: a draw that does not exist. Probe H1 shows the two-match rule finding the real third occurrence.
- **The bare-FEN limit.** A FEN has no history, so a bare `position fen <F>` searches exactly as base (`A3`, probe H5).
- **The table.** No change. Repeating nodes return before they probe or store. The history is fixed for one search, and the table is cleared per search (`ADR-0025` d4). If `ADR-0025` d4's "keep across a game" amendment ever ships, it must handle history-shaped entries. That is recorded as a constraint only.
- **What changes values, for the smokes.**
  - Unchanged, node for node: every search with no prior keys (bare FEN, the benchmarks, the `ABC-078` `A3` corpus, `G6`), and every search whose root clock is 0 (probe H4).
  - Changed: game searches whose tree reaches a position that already stood in the reversible window. The root score and move change when it stood twice; only the work changes when it stood once (H3).
  - **So it is value-changing, and the merge rule's smoke pair applies**, with the repetition-ending count, candidate against base (`A7`).
- **`ADR-0026` d10 does not apply.** This is an exact input, not a heuristic, and its absence is base. No switch, no door pair and no drift oracle. Exact rows replace them: the `A1`/`A2` fixtures at exactly 0; a second-occurrence row that keeps base's score (H2); identity with no prior keys (`A3`/`A4`) and with the root clock at 0 (H4); and the 100-key bound (`A5`).
- **Wording for BA/PM to fold into the ticket** (records only; this hop edits no ticket):
  - § Scope item 3, "the repetition rule inside the search is unchanged", becomes "unchanged on the path; a pre-root repetition needs two earlier occurrences".
  - § Scope item 5 and `A1`'s "the door (or base)" become "base (no prior keys)".
  - `A5`'s "since the last irreversible move" means "since the clock last reset". A castling-rights change is not a cut: no key before it can match one after it.
  - Add rows for H2 (second occurrence, base score kept) and H4 (prior keys handed in with root clock 0, node-equal to base).
  - DoR row 10 (the ADR reading) is answered by `ADR-0054` once it is accepted.
- **Overlaps.** `ABC-235` shares `src/engine.ts` and `src/search.ts`. `ABC-220`/`ABC-221` share `src/uci-session.ts`. Whichever merges second rebases.

## 2. The ADR and who accepts it
**`ADR-0054`, PROPOSED.** It adds to `ADR-0002` clause 3 (the clause already says "seeded … from the history module"; this says how, and adds the two-match rule), and it amends `ADR-0044` D2 (the session imports `zobrist.ts` and holds the keys) and D6 (the row leaves "not in v1"). Both of those ADRs are owner-accepted, and this is a new ADR that changes accepted ones. **So the owner accepts it** (`…5aaf7cec` item 3), not the Orchestrator. The build may proceed against it. The smokes and the merge wait on his acceptance. On acceptance, an Architect/Design hop adds dated lines to `ADR-0002` and `ADR-0044` that point here.

## 3. EPIC-010 Q3 for the owner: `ADR-0020` d2 (the ep repetition key). Options, not a decision

The background, in one line: the key carries the ep file whenever an ep square is set. A position first reached by a double push with no possible ep capture therefore hashes differently from its later recurrences. Its threefold is counted one occurrence late. cutechess counts it on time. SA `A6`: 22 of 1 718 repetitions, all D, 0 R (about 0.5 % of 4 199 games); 2 of the 22 are also in SA `A3`. **Fact that sizes the remedy:** only the first position of a reversible window can carry an ep square (a double push resets the clock).

| option | what changes | cost | table | book | perft and tests | repetition after `ABC-230` |
|---|---|---|---|---|---|---|
| **(a) keep d2** | nothing | 0 | as today | as today | as today | one occurrence late in the ep case, consistently in the search and the CLI's game-end count; the arbiter (cutechess) is one earlier, in about 0.5 % of games |
| **(b) ep-legal-only key, cheap form** (the ep file enters only when a pawn of the side to move stands beside the pushed pawn) | `zobrist.ts` key and delta (O(1) board reads on ep-carrying nodes); reverses the owner's 2026-09-19 "relax to ep square set" (d1) | an M ticket: key, delta, the `ADR-0020` ep test rows flipped back, re-pins, and a book rebuild | more merges: d5 nodes moved on 5 of 6 benchmark positions (−0.04 % to −2.4 %), scores unchanged (probe Q3-2) | **685 or more entries re-keyed** (of 3 626 reached; probe Q3-1): `book.json` must be regenerated, or the book misses after nearly every double push | perft counts unchanged (move generation is untouched); every node pin on those positions moves | exact on the board, in the search path and at game end. A pinned capturer still keys the ep file: finer than FIDE in rare cases, never a false equality. The fully legal form is `ADR-0005`'s probe-move design, which `ADR-0020` removed for its cost |
| **(c) normalise for the game-history comparison only** | one helper: the oldest key of the reversible window has its ep file removed when that position has no ep capture. Used by the prior-key builder and, to keep the CLI consistent, by `history.ts`'s game-end count. The hash is unchanged | an S ticket: one capture check per list build (per move, not per node), plus tests; it amends `ADR-0020` d2's consequence (owner) | none | none | none on a bare FEN; no node pin moves | exact against the game's history and the arbiter. In-tree only (a double push inside the search, then a return) stays one late. It adds a second, confined meaning of "key" |

- **(c) without the game-end half** would make the CLI's search see a threefold that the CLI does not yet let anyone claim. That is harmless, but inconsistent. Both halves go together.
- **Every option except (a) is a value change,** so it needs its own smoke pair (about 1.2 h of host time) and an owner-accepted ADR.

**Recommendation: (a), keep d2.** `ABC-230` captures the measured gap (484 games). The ep remainder is about 0.5 % of games, all in self-play, in the safe direction at game end, and none in R. If the owner wants FIDE-exact repetition, **(c)** is the remedy: cheap, with no effect on the table, book, perft or pins. Its trigger: an SA records re-scan of `ABC-230`'s smoke PGNs, or of the milestone-1 batch, finds an ep-late threefold that cost a result from a non-zero score. **(b) is not recommended.** It reverses the owner's own ruling, rebuilds the book and re-pins nodes to buy what (c) buys. The decision is the owner's. Q3's default (a) holds until he answers.

## STOP
None. `ABC-230` can be built against `ADR-0054`. Its smokes and merge wait on the owner's acceptance of `ADR-0054`. Q3 blocks nothing.
