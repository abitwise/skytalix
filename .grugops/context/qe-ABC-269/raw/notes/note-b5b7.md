# qe-ABC-269 B5 and B7 on the cut build: both **MET**. B5 (`ADR-0061` d8 (d) cut audit on E1's scale): 30 689 firing nodes, 2 986 sampled, **1 flip (0.033 %), error 17 cp; 0 ≥ 100 cp, 0 ≥ 200 cp**; door noise 0. B7 (`G6` at 4 000 ms, `Q-3K-4` = (b)): **every candidate run depth ≥ 6** (kiwipete 9 × 5, position-6 10 × 5); 0 runs at depth ≤ 7 (no WARN); medians equal base (9 / 9, 10 / 10), same move every run

QE/E2E, task `qe-ABC-269`, after `G2` MET (`…cebf49fe`). Each run under `flock host-test.lock`, ALONE window. Raw: `raw/out/b5-audit.txt`, `raw/out/audit-sample.txt.gz`, `raw/out/g6/`; scripts `raw/scripts/qe-audit-patch.py`, `qe-audit.ts`, `grade-g6.mjs`.

## B5, the cut audit (11:34:33Z–11:34:56Z, load1 0.69 → 0.78)
- **Build:** a scratch copy of `561fc028` `src/` (tree `4d6b117b`), outside the repository, deleted after.
- **Hook:** `qe-ABC-268`'s `qe-audit-patch.py`, adapted only where the cut changed signatures: `futilityNode(…, switches.taper, phase)`, `negamax(…, afterNull, phase)`, `Switches.taper`. `qeNode` searches fresh (cleared table, fresh killers, ply 1) with `search()`'s switches, **`taper: true`**, futility on or off, and `phase = phaseOf(position)`. Firing node = a node of `search()`'s recursion that skipped ≥ 1 move, counted after the loop and before the store.
- **Driver:** `qe-ABC-268`'s `qe-audit.ts`, unchanged: `search()` d6 over the 190 (6 endgames included), counter reset per corpus row, every 10th firing node; each sample searched three times (rule on at its null window h; rule off same window dnw; rule off full window v). Flip = h and dnw on opposite sides of alpha; error = v − alpha (false fail-low) or beta − v (false fail-high). `|alpha| > 15 000` excluded and counted: 0.
- **Readings:**

  | depth | sampled | flips | ≥ 100 cp | ≥ 200 cp | door noise |
  |---|---|---|---|---|---|
  | 1 | 1 945 | 0 | 0 | 0 | 0 |
  | 2 | 977 | 1 | 0 | 0 | 0 |
  | 3 | 64 | 0 | 0 | 0 | 0 |
  | **all** | **2 986** | **1 (0.033 %)** | **0** | **0** | 0 |

  - The one flip: `r3k2r/p1ppqpb1/1n3np1/3pN3/1p2PQ2/7P/PPPBNP1P/R3K2R b KQkq - 0 3`, depth 2, window 415 / 416, h 415, dnw 420, v 432: a false fail-low of **17 cp**.
  - Sample sha256 prefix `c6f4f678a2bdc64b`. Firing 30 689 against `main`'s 30 272 (`qe-ABC-268`): the evaluation changed, so the firing set moved; expected.
- **Bars (`ADR-0061` d8 (d), unchanged): flips ≤ 0.5 % and 0 flips ≥ 200 cp. MET.** F5 does not fire.

## B7, `G6` at `LEVELS[5]` (11:35:18Z–11:41:26Z, load1 0.51 → 0.34)
- **Instrument:** `qe-ABC-268`'s `g6.mjs` / `timed.mjs` / `host.mjs`, unchanged: 5 interleaved rounds; each a kiwipete pair then a position-6 pair; base first in odd rounds, head first in even; one fresh plain `node` process per search; wait-clear before every read (0 vitest, 0 cutechess, load1 ≤ 2.0, Tctl ≤ 60.0); `timed.mjs` refuses unless `LEVELS[5].budgetMs` = `DEFAULT_BUDGET_MS` = 4 000 and blunder rate 0 (both trees passed).
- **Builds:** base = `main` `src/` `58fa3eb4`; head = `561fc028` `src/` `4d6b117b`.
- **Readings (depth completed per run):**

  | board | base | head | median base / head | median nodes base / head | move |
  |---|---|---|---|---|---|
  | kiwipete | 9 9 9 9 9 | 9 9 9 9 9 | 9 / 9 | 3 516 141 / 3 477 209 | Bxa6 every run |
  | position-6 | 10 10 10 10 10 | 10 10 10 10 10 | 10 / 10 | 3 467 035 / 3 409 691 | Nd5 every run |

  - Every run's `ms` 3 999.5–4 001.2. load1 before each read 0.30–0.96. Tctl median 57.3, max 73.3; no thermal stop.
- **Graded under `Q-3K-4` = (b): every run depth ≥ 6: MET.** Depth-7 WARN: 0 runs. "≥ base" reported: equal on both boards.
- Residual risk (named in the ticket): a board on a depth edge can flip its median on 1–4 %; neither board is on an edge at 4 000 ms here.
