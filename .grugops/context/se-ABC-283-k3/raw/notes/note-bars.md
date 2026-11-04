# se-ABC-283-k3: every re-read count on the branch head (`ab0a37b6`, K3 built) equals arch-ABC-283-mate `…05ef9fc9`. All bars are MET, and no count differs.

Every run was under `flock <scratch>/host-test.lock`, at fixed depth or on a frozen clock. Drivers are in `raw/scripts/` (arch-ABC-283-mate's `floor.ts` / `rest.ts` with the probe flags removed) and output in `raw/out/`. `rest.jsonl` and `floor.jsonl` are **line-for-line identical** to arch's `rest-K3.jsonl` and to the K3 line of its `floor.jsonl`, ignoring only the candidate label.

| read | head | `…05ef9fc9` |
|---|---|---|
| P0, all-off doors vs main `09694a4e`, d6–d8, kiwipete + position-6, both recursions | 6 / 6 byte-identical | 6 / 6 |
| zugzwang, the seven rows at their depths | 7 / 7 | 7 / 7 |
| G1, the 58 puzzles | 54 / 58, newly missed [] | 54 / 58, none new |
| mate floor, `search()` d5 | 0 / 190 | 0 / 190 |
| mate floor, `chooseMove` d5 | 0 / 188 | 0 / 188 |
| older rows: futility / see-pruning / taper d5 / taper d4→5 | 0/189, 0/190, 0/189, 0/163 | same |
| `chooseMove` d6 (report) | 2 / 209: `7k/8/R4K2/8/8/8/8/8 b`, `7k/8/5K2/8/8/8/8/5R2 b`, −29994 → −652 | 2 / 209, same rows |
| ADR-0063 d8 drift, d5 on the 190, `search()` | 99.47 %, max 28 cp, 0 mate changes | same |
| drift, `chooseMove` | 99.47 %, max 27 cp, 0 mate changes | same |
| d8 nodes / main, `search()` kiwipete, position-6 | 523 847 / 605 117 = 0.8657; 234 214 / 406 787 = 0.5758 | same |
| d8 nodes / main, `chooseMove` | 707 548 / 766 275 = 0.9234; 101 425 / 87 475 = 1.1595 | same |
| lifetime row, non-zero cells | 77 / 28 | 77 / 28 |

Drift and ratios: a maximum of 28 cp is within ADR-0063's ≤ 42 cp limit.

## Gates
- typecheck 0, lint 0, build 0. Skip count 0; `test-skip-integrity.js` reports "No findings." (`raw/out/gates.txt`).
- **`npm test`:** 2 665 / 2 665 green, 70 files.
- **Default-lane time, NFR-008 ≤ 10 s:** 6 interleaved base/head pairs, one lock hold per pair. Base is `main` `09694a4e`, the branch point, at 2 650 tests; head is `ab0a37b6`.
  - base median **9.43 s** [9.31, 9.63];
  - head median **9.81 s** [9.54, 9.94];
  - +0.38 s. **MET.** (`raw/out/npm-test-pairs.txt`)
  - The earlier as-built read was a head median of 9.65 s. The production delta here is one `Math.max`, and the test delta is two cheap assertions, so this difference is most likely host spread.
  - Head is above R-N8H-1's 9.5 s MEDIUM trigger. That is for the Orchestrator and Security/NFR to note, not for this hop to grade.

## Deep lanes (`raw/out/lanes-exits.txt`), all exit 0 with 0 failed
- **R-281-a's four `-t` lines:**
  - ABC-167 A5: **4 passed**;
  - QE-208-a: **1 passed**;
  - ABC-230 A3/A4: **1 passed**;
  - levels A9: **1 passed**.
- **Search-side lanes:**
  - bundle 21 / 21: floor prints "0 of 190" and "0 of 188" (`lanes-bundle-prints.txt`);
  - search 57, see 52, futility 53, taper 169, null-move 45, pvs-lmr 29, quiescence 116;
  - transposition 40 (search) and 26 (engine), ordering 43 (search) and 30 (engine);
  - capacity 1 + 1.
- **Engine and tool lanes:**
  - engine 83, levels 58, puzzle 18, zobrist 33, perft 32, input 34;
  - tune 17, cli 11, uci 13, uci-session 241.
- **Not run:** the self-play ladder lane, because it plays games (brief: no games).
