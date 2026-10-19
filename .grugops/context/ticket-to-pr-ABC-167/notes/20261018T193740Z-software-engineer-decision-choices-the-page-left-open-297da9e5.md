---
id: 20261018T193740Z-software-engineer-decision-choices-the-page-left-open-297da9e5
kind: decision
by: software-engineer
task: ticket-to-pr-ABC-167
at: 2026-10-18T19:37:40Z
verified_by:
confidence: medium
refs:
  - ticket-to-pr-ABC-167
  - ABC-167
  - ADR-0044
  - QE-170-g
supersedes:
---

# ABC-167: the QE-170-g edges are decided by ADR-0044 D12; five minor choices outside them

This note is hand-authored and unsealed. No `finding` can be admitted on this install.

**The QE-170-g edges are covered by the page and by D12. Nothing was left for me to decide.**
- `go depth 0`: page `A7`, and D12's rule that "a value that is not a positive integer drops that token, with one `info string`".
- A very small `nodes N` with N ≥ 1 maps to `maxNodes: N`. D12 says "a tiny `N` still returns a depth-1 move". The bound in `A7` reads "unless depth 1 alone took more".
  - A row pins `go nodes 1`: it gives d1, 21 nodes and a legal move.
- `go nodes 0` and negative values: D12's positive-integer rule applies. A row pins `go nodes -5`.
- `go mate N` maps to `maxDepth` 2N−1 (D12). With `depth` also given, the smaller one wins.
  - `go mate 0` is not a positive integer, so the token is dropped. A row pins it.

**Choices outside the page, made by the most literal reading of D3/D4. They are flagged for QE and BA/PM.**
1. The initial position of a new session is the start position. D3 says `ucinewgame` "sets the position back to the start".
2. Time tokens:
   - `movetime`, `wtime`, `btime`, `winc` and `binc` accept any finite decimal number;
   - `movestogo` uses D12's positive-integer rule;
   - an unreadable value drops that token with one `info string`, which mirrors D12.
3. A `go` that arrives while a `bestmove` is held first writes the held line. This keeps the spec's "one bestmove per go". `go infinite` with no position holds `bestmove 0000`.
4. `searchmoves` consumes the tokens that follow it, up to the next `go` keyword.
5. `nps` is `round(nodes × 1000 / max(1, time))`.
