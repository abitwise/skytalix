---
id: 20261101T152620Z-software-engineer-decision-bcb0e207
kind: decision
by: software-engineer
at: 2026-11-01T15:26:20Z
verified_by: 
confidence: high: fixture found by an exhaustive probe of the 4-ply checking walks from the start position; the figures are exact at fixed depth
refs:
  - se-ABC-249
  - ABC-249
  - ADR-0054
  - QE-248-c
  - QPLY4
  - EPIC-010
  - grugops/ABC-249
  - 09d1f675
supersedes: 
seal: sha256:f3673ebe6da4523609297c709627e31fe6db054f2155e86a4b8f17815f4bcd44
---

# ABC-249 fixture: a queen perpetual, the twice-seen position met at ply 4, figure = move and score

- Why not a KQ v K shuttle: a probe of all 9 972 quiet 4-ply transitions from the shuttle start (KQ v K, depth 4 and 5) found no root where the move or score moves. The side that would enter the repetition at ply 4 is the winner's opponent only if the winner plays back into it, and the winner never needs to. The node counts that did differ all came from ply 2 hits, which QPLY4 does not touch.
- The fixture that works makes White's moves forced: Black gives perpetual check, so Black picks the check that enters the twice-seen position.
  - Game: FEN `6k1/RR3ppp/8/4q3/8/7P/PP4PK/1N6 w - - 0 1`, moves `h2h1 e5e1 h1h2 e1e5 h2g1 e5d4 g1f1 d4f6`. The start position X (White Kh2 in check from Qe5, White to move) stands at plies 0 and 4 of the game. The root is ply 8, `6k1/RR3ppp/5q2/8/8/7P/PP4P1/1N3K2 w - - 8 5` (White in check from Qf6).
  - Prior keys = `trimPriorKeys(keyHistory(game), 8)`: 8 keys; X stands exactly 2 times (asserted with `occurrencesAfter`).
  - The line from the root to the repeating node: **Kf1-g1 Qf6-d4+ Kg1-h2 Qd4-e5+**, at **ply 4**. The root (Kf1/Qf6), ply 1 (Kg1/Qf6), ply 2 (Kg1/Qd4) and ply 3 (Kh2/Qd4) all differ from X (Kh2/Qe5); the row asserts the ply-4 key is absent from those four keys. So only the pre-root half of decision 3 can score that node 0.
- Figure: move and score at fixed depth 4. With the keys: **Kf1-e1, +404**. Keys withheld (base): **Kf1-g1, +497**. Under QPLY4 the with-keys search reads Kf1-g1, +497, so the row is red.
- Picked move and score over nodes: an absolute node pin re-pins on every ordering change; the move and score fall only if the repetition rule does.
