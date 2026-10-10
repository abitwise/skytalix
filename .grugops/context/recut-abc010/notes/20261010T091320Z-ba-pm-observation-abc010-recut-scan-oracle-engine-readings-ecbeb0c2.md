---
id: 20261010T091320Z-ba-pm-observation-abc010-recut-scan-oracle-engine-readings-ecbeb0c2
kind: observation
by: ba-pm
at: 2026-10-10T09:13:20Z
verified_by:
confidence: high
refs:
  - ABC-010
  - ABC-126
  - ABC-127
  - ABC-084
  - ADR-0033
  - ADR-0027
  - src/puzzle-corpus.ts
  - .grugops/context/recut-abc010/probe/RUN.txt
  - .grugops/context/design-abc010/probe/fen-corpus.mjs
  - .grugops/context/ticket-to-pr-ABC-084/notes/raw-probe-oracle.mts.txt
supersedes:
---

# `recut-abc010` readings: the reject list has not moved, the two corpus rows have measured replacements, and `ABC-127`'s rows pass

This note is hand-authored and unsealed (degraded posture, `AGENTS.md`). The raw outputs and commands are
in `../probe/` (`RUN.txt`). Base `980890f`, Apple M3, Node v26.11.0, load1 about 6–11 with other hops
running. Every script reads `src/` only. None of them wrote to any worktree.

## 1. The Architect's scan, re-run at `980890f` (`fen-corpus.980890f.out.txt`)

The scan read 1,049 literals. It rejected 144 distinct FENs, 186 occurrences. **The reject list is
byte-identical to the Architect's at `6ade041`** (`diff` empty). So the design hop's 15-file fence holds
at today's base, and so does the 2-row corpus finding. The incidental 11 are:
- `coordinate-move.test.ts:17`, `san.parse.test.ts:44` (the kings are adjacent);
- `evaluate.pawns.test.ts:121`, `fen.test.ts:29`, `move-input.test.ts:30`, `:51`, `moves.test.ts:257`,
  `quiescence.test.ts:327`, `status-panel.nfr.test.ts:64`;
- `puzzle-corpus.ts:108` (`pawn on rank 8 (h8)`), `:110` (`side not to move (black) is in check`).

## 2. The criterion 9(d) instrument (`fen-scan.mjs`, `fen-scan.980890f.out.txt`)

The Architect's scan cannot serve as the tip check. At the tip, `parseFen` throws on a rejected FEN
before the prototype rules run, so the scan only counts the rejection under "grammar-rejected" and
names no file. `fen-scan.mjs` uses the same regex and walk, runs each literal through the tree's own
`parseFen`, and prints `file:line`, the message, and a per-file count.
- **At `980890f` it rejects 15**, all of them grammar faults: `fen.test.ts` 8,
  `moves.castling.hardening.test.ts` 5, and 1 each in `history-pane.test.ts:860` and
  `render.test.ts:479`. Those last two are empty boards with no king.
- At `ABC-010`'s tip, a correct build adds rejections only in `fen.test.ts`, the six swap files and the
  two (c) files.

## 3. The two corpus rows: oracle and engine (`oracle.out.txt`, `engine-and-rules.out.txt`, `incheck.out.txt`)

The oracle is `ABC-084`'s material-only 4-ply search. The engine is the shipped `chooseMove` at budget
25, step 1, with a fresh `virtualClock`.

| FEN | ADR-0033 rules | oracle keys | gain | engine |
|---|---|---|---|---|
| shipped "pin" `4k2p/8/8/4q3/8/1P6/P2K4/R7 w - - 0 1` | pawn on rank 8 (h8) | `a1e1` | +4 | `a1e1` d7 |
| shipped "discovered check" `3q4/6k1/8/8/3B4/8/6PP/3R2K1 w - - 0 1` | side not to move in check | `d4e5,d4c3,d4b2,d4a1` | +6 | `d4e5` d7 |
| candidate `4k3/7p/8/4q3/8/1P6/P2K4/R7 w - - 0 1` | accepted | `a1e1` | +4 | `a1e1` d7, 14 legal |
| alt. `4k3/8/8/4q3/8/1P6/P2K4/R7 w - - 0 1` | accepted | `a1e1` | +4 | `a1e1` d7 |
| candidate `3q1k2/8/8/8/3B4/8/6PP/3R2K1 w - - 0 1` | accepted | `d4g7,d4c5` | +4 | `d4c5` d6, 26 legal |

Both shipped rows reproduce the Architect's faults. Both are solved today: the engine's choice is in
`accept`. A replacement keeps the baseline's solved count only if the engine still solves it. Both
candidates are solved, and neither has the side to move in check.

`ABC-126`'s own measured pair (`4k3/8/1p6/b7/8/8/8/R4K2 w`, mirror `r4k2/8/8/8/B7/1P6/8/4K3 b`) is
`accepted` under the rules too (`abc126-candidates.out.txt`). So `ABC-010` would not have to touch it.

## 4. `ABC-127`'s in-flight corpus (`abc127-47433c5-corpus-rules.out.txt`)

This reads `git show 47433c5:src/puzzle-corpus.ts`; nothing was checked out. It has 62 FENs, 22 of them
new. 60 are accepted. The 2 rejected are the same two rows. `ABC-127`'s baseline at `47433c5` is 58/62,
with 4 named unsolved mate-in-3 rows, and neither corpus row is among them. **This is a snapshot of work
in progress, not a verdict.** `ABC-010`'s criterion 9(d) is the check that counts.

## Not measured

- The engine readings are single plain-`node` runs, not the vitest lane. QE showed that plain `node`
  and vitest print identical rows at `ABC-084`. Even so, the candidates are re-measured on the landing
  tree (`ABC-126` test note 4).
- The `PUZZLE_DEEP=1` lane was not run here. No corpus row changed in this hop.
