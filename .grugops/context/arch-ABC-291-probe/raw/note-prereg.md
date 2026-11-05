# arch-ABC-291-probe PREREG: `ADR-0075` d10's premise probe, sealed before any measured run

Architect/Design, task `arch-ABC-291-probe`, on `grugops/arch-ABC-291-probe`. Brief cut at `main` `91c21a9f`. `main`'s tip at this seal is `e01d39b1`, and the probe's tree is the same: **`src/` tree `cc6e64d1`** at both. No file under `src/`, `tools/` or `package.json` differs between them. This note is sealed and committed **before any measured run**.

**What ran before this note:** one `tsc` type-check of `cand` and the probe scripts (exit 0; reads no value), and d10's one load-only smoke: `cand` with the term on evaluates the start position to 0, `Object.is`-exact. That value is fixed by symmetry and carries no information. Nothing else ran.

**Terms.** d10 as written, once. This probe can stop the work and set what d10 says. It cannot change a value, the rule, a definition, the ratio, the intent or a bar. If PR3 shows d1's words wrong: STOP to the Orchestrator, no value moved. No bar moves after a reading, and a miss is not re-played.

## Instrument
- **Copies.** Scratch `git archive`s of `91c21a9f`, outside the repository, under `<scratch>/arch291/`:
  - `main`: unpatched, the whole tree, so that PR11's lane loads every suite (`arch-ABC-271`'s copy held `src/` only, and six suites failed to load in both copies);
  - `main2`: `src/` and `package.json`, unpatched, the `G2` control;
  - `cand`: the whole tree with `patch_e4b.py` applied, which writes d2's values, d3's memo part and all of d4: the switch through `src/search.ts`, `src/engine.ts` and quiescence's rules record, `searchWithoutPawnShape`, `chooseMoveWithoutPawnShape`, `evaluateAtPhaseWithoutPawnShape`, `pawnShapeForTest`, the `pawnStructureForTest` field, every older door off;
  - `count`: `cand`'s `src/` with `patch_count.py`'s two counters. PR10's memo count reads it. It is never timed.
- **The probe-only switch.** It is the probe script's form argument. ON calls the shipped entries (`chooseMove`, `search`, `evaluate`). OFF calls d4's doors. No module flag is added, so the timed path is d3 and d4 as the build would carry them, and "ON hard-wired" (PR11) is `cand` as it stands.
- **The labeller.** `labeller.ts` imports nothing. It reads a FEN string, holds pawns as (file, own rank) points, and states d1's clauses over them. Its six hand-worked rows run first; a miss there stops PR3 as the labeller's own fault, before the patch is read.
- **The 16 pawn-shape positions** are `PAWN_SET` in `e4bprobe.ts`: chains, phalanx, each edge file, each clause of Backward failing alone, a doubled rear pawn, both colours, full phase.
- **The games.** `<repo>/.grugops/context/qe-ABC-269/raw/out/b8/d.pgn` (sha256 `46491964…`, 100 games) and `<repo>/.grugops/context/qe-ABC-279/raw/out/c2/d.pgn` (sha256 `9339b414…`, 100 games). Every position: each game's start, each position after a move, the last included. Any game that fails to replay stops PR3 and PR4 by a thrown error, and is counted in PR9.
- **Scripts, sha256** (copies in this task's `raw/scripts/`, as they will run):
  - `patch_e4b.py` `8d7e7163…`, `patch_count.py` `de14ae56…`, `e4bprobe.ts` `8b070dda…`, `labeller.ts` `4dc558bb…`, `pr4c.ts` `63d42460…`, `mainnodes.ts` `55a0142a…`, `g2.ts` `d12a6f18…`, `nsnode.ts` `4905dfe2…`, `hits.ts` `f1738961…`, `lane.py` `dd38835c…`;
  - batches: A `af8eea48…`, B `ce02cb28…`, C `1861ce4b…`, D `01c0c4db…`, E `f15a2737…`, F `a1a872b0…`, G `6a4db84a…`.
- **Running.** Every batch runs under the host lock, one at a time, on one core, one vitest worker. The lock is released between batches. Host paths go into no record: outputs enter `raw/out/` with `<scratch>`, `<home>` and `<repo>` as placeholders.

## The rows, word for word from d10
| row | reads | bar | class |
|---|---|---|---|
| **PR1**, instrument | OFF against unpatched `main`: nodes, score, move on K0 (a)'s rows | exact | else the probe is void: STOP |
| **P0**, counts | ON on the same rows | none, a reading; it becomes K0 (c) | reading |
| **PR2**, mirror | K1 (a)'s sets, ON, `Object.is` | 0 mismatches | exact |
| **PR3**, arithmetic | the seam's parts against an independent labeller, written from d1's words and sharing no code with the patch, over `G3`, the probe's pawn positions and every position of PR9 | 0 mismatches | exact |
| **PR4**, memo and off | a hit equals a fresh call; ON then OFF on one slot; OFF `Object.is`-equal to `main` on the corpora | 0 mismatches | exact |
| **PR5**, mate floor | `ADR-0064` B2's two rows on the 287, ON | 0 violations | safe |
| **PR6**, zugzwang | `ADR-0050` d9's seven rows at recorded depths, ON, the played move only | 7 / 7 | safe |
| **PR7**, `G1` | the 58, ON against OFF | no NEWLY-MISSED line | safe |
| **PR8**, `G2` | d5's instrument, ON against `main` | R ≤ 1.03; a void session leaves it `UNKNOWN`, and it moves to the build | cheap |
| **PR9**, firing | static evaluate, ON minus OFF, at every position of the 200 C2′ games on record (`qe-ABC-269` b8, `qe-ABC-279` c2, `d.pgn`) | share with \|Δ\| ≥ 10 cp at or above 5.0 % | fires |
| **PR10**, reports | reach at 47 000; drift at d5; ns per node on `G2`'s roots at fixed depth; the memo's hit rate in search, as a count; a per-call ratio with the memo bypassed; the endgame report set; PR9 by part | none | decides nothing |
| **PR11**, lane report | the default lane with ON hard-wired, against `main`'s copy | none; it lists the value rows and re-points for K2 | decides nothing |

**How each row is read, stated before any reading. None of these moves a bar.**
- **PR1, P0:** `chooseMove` on kiwipete d8 and d9, position-6 d8, d9 and d10; `search()` d8 on both. Seven rows.
- **PR2:** `G3` + `TAPER_MIRROR_POSITIONS` + the 16.
- **PR3:** also read over `TAPER_MIRROR_POSITIONS`, beside the row's named sets. A `hot` count is printed beside it: `evaluate` minus the off evaluation against the seam's signed net, and the seam's mg against its eg (K1 (d)'s relation). It is a report, but a non-zero `hot` means PR9's Δ does not read the seam, so it is treated as a prototype defect under rule 1.
- **PR4:** the corpora are `G3`, `TAPER_MIRROR_POSITIONS`, `TAPER_DOOR_CORPUS` and the games. OFF is also read at `evaluateWithoutTaper` against `main`'s (K1 (b)). Forced collisions come from the positions themselves, by slot, up to 2 000 pairs.
- **PR5:** the door (OFF) at d4 against ON at d5, and the door at d5 against ON at d5.
- **PR6:** the script prints the played move and nothing else: no score, no nodes.
- **PR7:** a NEWLY-MISSED line is a puzzle ON misses and OFF solves. The list against the baseline's `unsolved` is printed beside it, for ON and for OFF.
- **PR8:** R = (r₁ + r₂) / 2 on the unrounded value, r_s = mean(H) / mean(B), two sessions in reverse order (B,C,H then H,C,B), `main2` the control, rounds 2, 4 and 6 (counted from 1) reversing the session's list, round 1 the dropped warm-up. MET iff R ≤ 1.03. **Void:** c_s outside [0.970, 1.030] voids that session, which leaves PR8 `UNKNOWN`. d10's words govern here: it moves to the build. There is no re-run, although `ADR-0067`'s A5 form allowed one. Each r_s, |r₁ − r₂|, each arm's rounds and the endgame set are reported.
- **PR9:** the exact fraction, as integers: MET iff ge10 × 20 ≥ positions. **No rounding: 4.96 % is below 5.0 %.** |Δ| = 10 counts. 200 games and 0 replay failures are required for the figure to stand.
- **PR10:** ns per node is `search()` at depth 8 on the six roots, three rounds, round 1 dropped, two sessions in reverse order. The per-call ratio with the memo bypassed is `evaluateWithoutPawnCache`, same shape as PR8, 50 000 calls. The memo count is `chooseMove` at depth 8 on the six roots, memo emptied before each root. The endgame report set is `g2.ts`'s, by its stated rule.
- **PR11:** `npx vitest run`, one worker, the JSON reporter, on `main` and on `cand`. A red on `cand` that is not red on `main` is on the list.

**Timing rows run alone in one hold (batch D):** PR8, then PR10's two timed reports. `vmstat` at 5 s and the load average beside each session are recorded. A foreign load is never touched. It voids a session only by the void rule above, and whatever it voids is said so; a foreign load beside a session that stands is reported.

**Fenced out (d10), and held to:** no margin on `zugzwang.001`, no v(e1f1) − v(e1e5), no per-part read of it, no singles on any safety row. `cand` has no per-term switch at all.

## Batch order
A (PR1, P0), B (PR2, PR3, PR4), C (PR5, PR6, PR7), D (PR8 and PR10's timed reports), E (PR9), F (PR10's other reports), G (PR11).
- PR1 is read before anything else. A PR1 miss voids the probe: STOP, subject to rule 1's one fix.
- After a real miss under rule 2 or rule 4, the remaining batches still run, once, because each decides nothing further and they complete the record. A miss is not re-played either way.
- **If the probe would pass 55 minutes of lock, it stops and reports.** Lock time is summed from `out/holds.txt`.

## The rule, word for word from d10
1. **PR1, PR2, PR3 or PR4 misses:** a defect in the prototype gets one fix under a sealed addendum, and every row is re-read. If PR3 shows d1's words are wrong and not the patch, STOP: this ADR is restated and goes back to him. No value moves.
2. **PR5, PR6 or PR7 misses:** a defect check first. If the miss is real, the premise is **NOT MET**. `ABC-291` is not built, and it goes back to BA/PM. d11 (d) applies, so no number is changed to pass. There is no subset fallback: form (a) is superseded, and dropping a term after a safety read is choosing with the row in hand.
3. **PR8 above 1.03:** the premise stands. The build carries d5's named cut, and QE reads K4 on the build. This is `ADR-0070`'s rule 5 form.
4. **PR9 below 5.0 %:** the premise is **NOT MET for an own read**. 100 games would then read a term that barely moves the score, near a coin flip, at the term's cost. The intent stays GAIN, and no value is raised. The ticket goes back to BA/PM, and the owner is told. A bundle under B1 stays lawful if a later ADR states the relation.
5. **Every row holds:** the premise is **MET**, and the ADR gets its dated line.

**What the probe can change in this ADR:** K0 (c)'s counts; K2's value-row and re-point list; the forecasts at d5 and § Consequences, replaced by readings; the fixture list; and whether `ABC-291` is built at all.
**What it cannot change:** d1's definitions (except by rule 1's STOP, back to him), d2's rule or any value, d3's memo form, d5's ratio, d6's intent, any bar, or the term order. It cannot turn a miss into a pass, and it cannot be re-run after one.
