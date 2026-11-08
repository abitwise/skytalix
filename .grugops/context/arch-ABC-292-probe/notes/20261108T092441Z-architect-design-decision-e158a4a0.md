---
id: 20261108T092441Z-architect-design-decision-e158a4a0
kind: decision
by: architect-design
at: 2026-11-08T09:24:41Z
verified_by: 
confidence: high (pre-registration; nothing measured yet: a type-check, the load-only smoke and parse checks only)
refs:
  - arch-ABC-292-probe
  - ABC-292
  - ADR-0076
  - ADR-0076 d13
  - ADR-0076 d10 step 4
  - EPIC-011
  - E5
  - ADR-0064
  - ADR-0067
  - ADR-0050
  - ADR-0075
  - G1
  - G2
  - G3
  - NFR-008
  - K0
  - K1
  - K2
  - 3cbf5374
  - bba42fb7
  - e88e91f9
  - qe-ABC-292-freeze/20261108T090744Z-qe-e2e-decision-277b648a
  - sha256:6dc902c6be848e970a0cf66228f82e8f00f6e3d2d070fe954d85a27309ffbfe4
  - sha256:ed6a6fdad7c66737e1df4b83478ecb10125c23c6d397ecb4da6a6d6d6146ff36
supersedes: 
seal: sha256:098abbd0432499217dfab5b27922b43ffccf60cc6234c8f387e374ae7ff8284a
---

# arch-ABC-292-probe PREREG: `ADR-0076` d13's premise probe, sealed before any measured run. Two stages: A now (the untimed rows), B only on the Orchestrator's later line citing the owner's held-host word (PR8, then PR10's lane read, last)

Architect/Design, task `arch-ABC-292-probe`, on `grugops/arch-ABC-292-probe` from `main` `3cbf5374` (the brief cut at `1faefe3f`; dispatched at `889d3d2c`; `3cbf5374` is the board stamp after it). **The probe's tree is `main` `3cbf5374`, `src/` tree `bba42fb7`.** It is the tree `ADR-0076` was written on and QE froze on: no file under `src/`, `tools/` or `package.json` differs from `0885de71`. This note's commit descends from QE's freeze commit `e88e91f9` (d10 step 4; `git merge-base --is-ancestor e88e91f9 HEAD` passes). It is sealed and committed **before any measured run**.

**QE's freeze (d10 step 3):** `qe-ABC-292-freeze/20261108T090744Z-qe-e2e-decision-277b648a`, with its gaps note `…c16ba4c6`. Freeze commit `e88e91f9`, merged at `1faefe3f`. Re-hashed here before this seal, both equal:
- `raw/fixtures.json` sha256 `6dc902c6be848e970a0cf66228f82e8f00f6e3d2d070fe954d85a27309ffbfe4`;
- `raw/pre-ticket.json` sha256 `ed6a6fdad7c66737e1df4b83478ecb10125c23c6d397ecb4da6a6d6d6146ff36`.

**What ran before this note.** None of it reads a value.
- Batch S: one `tsc` type-check of `cand` and of `cut`. Each exits 2 with the same 9 errors, all in `src/search.futility.test.ts`: `futilityNode`'s arity 7 → 8, a K2 class. No error in a non-test file or under `tools/`.
- Batch S: d13's one load-only smoke. `cand` with the term on evaluates the start position to 0, `Object.is`-exact. That is fixed by symmetry and carries no information.
- Parse checks of every script (Node's type stripping and TypeScript's syntax diagnostics, 0 each; `bash -n`; Python's parser). One type-check of `e5probe.ts` and `labeller.ts` against `cand`'s exports, exit 0.
- Lock used so far: batch S 4 s, and a few seconds of checks.

**Terms.** d13 as written, once. This probe can stop the work and set what d13 says it can. It cannot change a value, the rule, a definition, the seam, the ratio, the intent, a bar, or the term order. **No bar moves after a reading, and a miss is not re-played.**

**Two stages,** by the brief (`.grugops/queue/claimed/arch-ABC-292-probe/arch-ABC-292-probe.md`).
- **Stage A, this hop:** batches A, B, C, E, F, G. That is PR1 to PR7, P0, PR9, PR10's untimed parts and PR11. Rules 1, 2 and 4 apply here, as sealed below. Stage A takes no held window and runs no timed row.
- **Stage B, only on a later brief line from the Orchestrator citing the owner's word that the host is held:** batch D (PR8 under rule 3, then PR10's timed parts), then batch H (PR10's lane read), last.
- **Every stage B script is sealed here,** by sha256, before any stage A reading. Nothing in stage B is designed after a stage A figure exists.

## Instrument
- **Copies.** Scratch `git archive`s of `3cbf5374`, outside the repository, under `<scratch>/abc292-probe/`. `node_modules` is a link to `<repo>`'s.
  - **`main`:** the whole tree, unpatched. PR1, PR11's base, `G2`'s base arm B, and PR4's cross reads use it.
  - **`main2`:** `src/` and `package.json`, unpatched. `G2`'s control arm C.
  - **`cand`:** the whole tree with `patch_e5.py` applied. It writes:
    - d3's three exports in `src/evaluate-params.ts`, 50 / 20 / 10 a half, each comment carrying its rule;
    - d4's seam: doubled and isolated in one memo word, the file word beside them (white bits 0–7, black 8–15), so a slot stays seven words and 36 bytes; the walk's rook masks and bishop counts in `if (type >= QUEEN)`'s new `else` branches; after the memo, `pieceTermsOfSide` per side and one packed add, the rook part skipped for a side with no rook; a 256-byte bit-count table;
    - d5's switch `pieceTerms` through `Switches`, `Heuristics` and `QuiescenceRules` (`RULES_PIECE_TERMS` in both recursions); `futilityNode` 7 → 8 arguments; `searchWithoutPieceTerms`, `chooseMoveWithoutPieceTerms`, `evaluateAtPhaseWithoutPieceTerms`, `pieceTermsForTest`, and the `files` field of `pawnStructureForTest`. Every older door is off (21 records in `src/search.ts`, 16 in `src/engine.ts`). `evaluateWithoutTaper` never adds the part. `evaluateWithoutMobility` and `evaluateWithoutPawnCache` keep it on;
    - `tools/tune/tune.ts`'s `QUIET_RULES` with `pieceTerms: true`, and its name changed with it.
  - **`cut`:** `cand` with d6's named cut (`patch_e5.py <root> cut`). `kingExposure` reads own and enemy from the memo's file word, and the 6-rank scan goes. King safety is computed after `pawnStructureCached`. `kingExposureForTest` takes the file word from a fresh `pawnStructure`.
  - **`count`:** `cand`'s `src/` with `patch_count.py`'s two counters. PR10's memo count reads it. It is never timed.
- **The probe-only switch** is the probe script's form argument. ON calls the shipped entries (`chooseMove`, `search`, `evaluate`, `evaluateAtPhase`). OFF calls d5's doors. No module flag is added, so the timed path is d4 and d5 as the build would carry them, and "ON hard-wired" (PR11) is `cand` as it stands.
- **The labeller.** `labeller.ts` imports nothing. It reads a FEN's board field and states d2's clauses, with d3's table as literals. Its six hand rows run first. A miss there stops PR3 as the labeller's own fault, before the patch is read.
- **The games.** `<repo>/.grugops/context/qe-ABC-269/raw/out/b8/d.pgn` (sha256 `46491964d80b0ae59de185106f6a4a61a7aa78d197598735eb05ff0e5a05838f`, 100 games) and `<repo>/.grugops/context/qe-ABC-279/raw/out/c2/d.pgn` (sha256 `9339b4146cfb84fd3c717e6d17aeb7fc00bcf3ca2f0c9af80c50193d9878bd00`, 100 games), as archived in `main`'s copy. Every position counts: each game's start, each position after a move, the last included. Any game that fails to replay stops PR3, PR4 and PR9 by a thrown error.
- **`G1`'s baseline:** `src/puzzle-suite.baseline.json`, sha256 `f1147e4c4843c95e508fd4a1a93346b71f8b05c59b88ab877aa8e90f7e0ccdb2`, budget 25 ms, step 1.
- **Scripts, sha256.** Copies are in this task's `raw/scripts/`, as they will run.
  - `patch_e5.py` `19de59b707300534cf3e5dd42c92bac2af48fef8ff0085452c96e8e3a94c9cf4`
  - `patch_count.py` `87ab4c2291492a06b67076ac744d7fab9302be3578e32738cdf0235cd031ad97`
  - `e5probe.ts` `70d3747890515dbe6b92295155ada7014a8c5d382a747d6d98f3af39cc0bc6a2`
  - `labeller.ts` `7f0f040b9433a9e392797c9723597bde11e533a7b471d08fb3bf31c3b7e44678`
  - `pr4c.ts` `38e47a832f03e37c23ad41d89611050c000441f1516c6054209cd558495918f2`
  - `mainnodes.ts` `6993e37aed4cf22239945dbff41cbd50434efde00b0aab52192de263249c40ce`
  - `hits.ts` `e866718b17bfe10a0ce5826a33c88f7f6c3e10e3b77cc8ea9a9ef02ff73a99e2`
  - `pr11.py` `6f61695034e6774ac41693b8261f0dac6478e40c7235416b4c15692d0af1767f`
  - stage B: `g2.ts` `9715a470d829270d190083ef908d48fff966d2260685f59c971d73a9229b952e`, `nsnode.ts` `7e8f0f6845f48bcbb1786cef03ccd3d5af3b7d616c317fa23b044c8702dd221e`, `lane.sh` `491c73b74015b7ec182846ce9e5688b3193f11215cc07c2c2f6019cd4495d914`, `lane-stage.sh` `2035b910b118d8d56ae5e6fccf404ec832cc7884d23e72b88eaac632794dc618` (QE's `stage.inc.sh` at `grugops/qe-ABC-291` `66ca8de0` with one line changed, its header says which), `fsample.sh` `705353d632274a01bf9f98ca7f71fbcc73b73b126b5cab98f8de2b3db6f4955d` (QE's, unchanged)
  - batches: S `4d59b8b04b902d4d94e1e1abaf96d4cc5bae2d9d0678252007befc7e1f2f9e53`, A `9fd4c9aae871c1727ed06966c77b75aa78a1c69adc8116da825343b2f8a9b28f`, B `9849025a4d6bea7e2ca70177e5b57c3511a944f67a10d0e8f710cca8aeba4a78`, C `6c1c70cc067f3c941ab1a869d3d925e5eb9d22c56b2e48169eb429d7df68f62a`, E `2693a08734c610243b29f29cde6f70de1ece6f2b3e6ad36cd743e6adf900cae9`, F `f63936dd8c1110b490cd30e0d288780b0b6c86f3a8070dfd64194e76496d8c2a`, G `38c6612725efbde3b1729d35636fcff36c9ea67f4a9730fa72f9fadbe2733962`, D `af2635976847d48047b272a4e3d2cf28d16801d18e290a59768743a6ac8e0916`, H `41853f9c2f7cc5c72864bac6993b3391634802e451817f61da0be1d9aec76a38`
- **Running.** Every batch runs under the host lock, `flock <scratch>/<home>/<repo>/host-test.lock`, alone, on one core. Stage A's vitest runs use one worker (`VITEST_MAX_WORKERS=1`). The lock is released between batches. Host paths go into no record: outputs enter `raw/out/` with `<scratch>`, `<home>` and `<repo>` as placeholders.
  - **One exception, named now:** stage B's lane read runs `npm test` as spelled, under vitest's own two-worker cap, because `NFR-008`'s figure and QE's level are defined on that command. At stage B's line the Orchestrator may drop the read (d13 lets him) or bind it to one worker. Either way PR10 stays a report.

## The rows, word for word from d13
| row | reads | bar | class |
|---|---|---|---|
| **PR1**, instrument | OFF against unpatched `main`: nodes, score, move on K0 (a)'s rows | exact | else void: STOP |
| **P0**, counts | ON on the same rows | none, a reading; it becomes K0 (c) | reading |
| **PR2**, mirror | K1 (a)'s sets, ON, `Object.is` | 0 mismatches | exact |
| **PR3**, arithmetic | the seam's parts against QE's frozen fixtures, and against an independent labeller written from d2's words, sharing no code with the patch, over `G3`, the frozen positions and every position of PR9 | 0 mismatches | exact |
| **PR4**, memo and off | a hit equals a fresh call; ON then OFF on one slot; OFF `Object.is`-equal to `main` on the corpora; `cut` `Object.is`-equal to `cand` | 0 mismatches | exact |
| **PR5**, mate floor | `ADR-0064` B2's two rows on the 287, ON | 0 violations | safe |
| **PR6**, zugzwang | `ADR-0050` d9's seven rows at recorded depths, ON, the played move only | 7 / 7 | safe |
| **PR7**, `G1` | the 58, ON against OFF; row 1632's nodes reported | no NEWLY-MISSED line | safe |
| **PR8**, `G2` | d6's instrument: `cand` ON against `main`, and `cut` ON against `main`, in one session list | rule 3 | cheap |
| **PR9**, firing | static evaluate, ON minus OFF, at every position of the 200 C2′ games on record (`qe-ABC-269` b8, `qe-ABC-279` c2, `d.pgn`) | share with \|Δ\| ≥ 10 cp at or above 5.0 % | fires |
| **PR10**, reports | reach at 47 000; drift at depth 5; ns per node on `G2`'s roots at fixed depth; the memo's hit rate in search; a per-call ratio with the memo bypassed; each session's level; the endgame report set; PR9 by part; one lane read on a held host, B, B again and ON, 8 rounds, about 4.5 min, production files only | none | decides nothing |
| **PR11**, lane report | the default lane with ON hard-wired, against `main`'s copy; then, with `-t`, `ABC-282` A0 in `src/uci-session.test.ts` and `src/engine.test.ts`, and `ABC-303`'s depth-8 counts in `src/search.bundle.test.ts`, on their deep lanes | none; it lists K2's value rows, re-finds, re-points and deep pins | decides nothing |

## How each row is read, stated before any reading. None of these moves a bar
- **PR1, P0:** `chooseMove` with `maxDepth` and a frozen clock on kiwipete d8 and d9, position-6 d8, d9 and d10; `search()` d8 on both. Seven rows. PR1 is OFF (`chooseMoveWithoutPieceTerms`, `searchWithoutPieceTerms`) against unpatched `main`'s `chooseMove` and `search()`, exact on nodes, score and move. P0 is ON's figures on the same rows.
- **PR2:** `Object.is(evaluate(p), evaluate(mirrorPosition(p)))`, ON, over `G3` (184), `TAPER_MIRROR_POSITIONS` (30) and QE's 15 new K1 (a) positions. QE's 39 K1 (c) rows and K2's 3 boards join, as QE's note allows. The bar is 0 mismatches over all of them.
- **PR3:**
  - (a) `pieceTermsForTest` against QE's frozen parts, per side and per part, mg and eg, on the 39 K1 (c) rows and K2's 3 boards, each row and its mirror (the parts swap): 0 mismatches.
  - (b) `pieceTermsForTest` against the labeller over `G3`, the frozen positions (K1 (c), K1 (a), K2) and their mirrors, and every position of the 200 games: 0 mismatches. `TAPER_MIRROR_POSITIONS` is read beside, as a report.
  - **`hot`,** K1 (d)'s relation, is read on every position: `evaluate` minus the off evaluation equals the seam's white minus black, signed for the side to move, and each part's mg equals its eg. On the frozen rows it is read against the hand net too. A non-zero `hot` means PR9's Δ does not read the seam, so it is a prototype defect under rule 1.
  - **`labellerVsQE`** is printed beside. If the seam agrees with QE and not the labeller, the labeller is at fault. If the seam and the labeller agree against QE, rule 1's STOP clause is read.
- **PR4:**
  - (a) a hit equals a fresh call: `pawnStructureForTest(p, true)` twice against `(p, false)`, on the packed sum, both passer words and the file word. The corpora are `G3`, `TAPER_MIRROR_POSITIONS`, `TAPER_DOOR_CORPUS`, the frozen positions and their mirrors, and the games. Forced collisions come from the positions themselves, by slot, up to 2 000 pairs. `evaluateWithoutPawnCache` is `Object.is` `evaluate` on the same corpora.
  - (b) ON then OFF on one slot, both orders, the memo emptied before each.
  - (c) OFF `Object.is` `main`: `cand`'s off evaluation against `main`'s `evaluate`, and `cand`'s `evaluateWithoutTaper` against `main`'s, on the same corpora. Both are also read against QE's frozen K1 (b) `newRows` (116).
  - (d) `cut` `Object.is` `cand`, on the same corpora: `evaluate`, the off evaluation, `evaluateWithoutTaper`, `evaluateWithoutMobility`, `evaluateWithoutPawnCache` and `kingExposureForTest`.
  - The bar is 0 mismatches on every part.
- **PR5:** `ADR-0064` B2's two rows on the 287. The door (OFF, `searchWithoutPieceTerms`) at depth 4 against ON (`search()`) at depth 5, and the door at depth 5 against ON at depth 5. A violation is a door mate that ON does not find, or finds with the other sign.
- **PR6:** `chooseMove`, ON, at each row's recorded depth: `zugzwang.001` d9 e1f1; `kpk-b6c6`, `kpk-c6d6`, `kpk-d6e6`, `kpk-e6f6` d8; `zugzwang.004` d11 h3h4; `zugzwang.005` d12 f4d5. The script prints the played move and nothing else: no score, no nodes.
- **PR7:** the 58 at the baseline's budget and step, ON (`chooseMove`) against OFF (`chooseMoveWithoutPieceTerms`). A NEWLY-MISSED line is a puzzle ON misses and OFF solves. Each form's misses against the baseline's `unsolved` are printed beside. **Row 1632** is reported in `qe-ABC-291`'s `row1632.ts` form, ON and OFF: the 25 ms run's depth, move and nodes, and the nodes of the first fixed-depth iteration whose move is e7e2.
- **PR8 (stage B):**
  - R = (r₁ + r₂) / 2 on the unrounded value, r_s = mean(H) / mean(B) for `cand`. X = (x₁ + x₂) / 2 the same way for `cut`.
  - One session list B, C, H, X. Two sessions in reverse order: B, C, H, X, then X, H, C, B. `main2` is the control. Rounds 2, 4 and 6 (counted from 1) reverse the session's list. Round 1 is the dropped warm-up. 200 000 calls a root on the six roots.
  - **Void:** c_s outside [0.970, 1.030], or no c_s figure, voids that session. It is re-run once, in the same order. A second void leaves R `UNKNOWN`, and the build carries the cut, as rule 3 says.
  - Rule 3 reads R as `cand` and X as `cut`.
  - Reported: each r_s, x_s and c_s, each session's level (mean(B), ns a call), each arm's rounds, and the endgame set by `g2.ts`'s stated rule.
- **PR9:** Δ = `evaluate` minus the off evaluation, both on `cand`, static. The exact fraction, as integers: **MET iff ge10 × 20 ≥ positions. No rounding: 4.96 % is below 5.0 %.** |Δ| = 10 counts. 200 games and 0 replay failures are required for the figure to stand. A replay failure is an instrument fault, under rule 1's one fix.
- **PR10, stage A (untimed):**
  - reach at 47 000 nodes, OFF and ON: mean depth over the 190 (the six roots, their children still in progress, six endgames);
  - drift at depth 5 on the same 190, ON against OFF: share within 25 cp, the largest, mate flips, move differences;
  - the memo's hit rate in search, on `count`: `chooseMove` at depth 8 on the six roots, the memo emptied before each root;
  - PR9 by part: per part, |white − black| on the seam's mg, how often non-zero and how often ≥ 10.
- **PR10, stage B (timed):**
  - ns per node: `search()` at depth 8 on the six roots, three rounds, round 1 dropped, arms B, C, H and X, two sessions in reverse order;
  - the per-call ratio with the memo bypassed: `g2.ts` with `ENTRY=bypass`, 50 000 calls, two sessions;
  - each session's level and the endgame report set: from PR8's output;
  - **the lane read (batch H, last):** arms B, B2 (B again) and H (`cand`: production files changed, no test file). `npm test` as spelled, on QE's stage loop. 8 complete scored rounds, round 0 dropped. A run is scored only at stage A's counts and exit for its arm. Wall and CPU, paired H − B and B2 − B, by the median.
- **PR11:**
  - `npx vitest run` on `main` and on `cand`, one worker, `NODE_OPTIONS=--max-old-space-size=128`, the JSON reporter. A red on `cand` that is not red on `main` is on the list.
  - Then, with `-t`, on both copies, one worker, `--max-old-space-size=400`: `ENGINE_DEEP=1` `src/uci-session.test.ts` `-t "ABC-282 A0"`; `ENGINE_DEEP=1` `src/engine.test.ts` `-t "ABC-282 A0"`; `SEARCH_DEEP=1` `src/search.bundle.test.ts` `-t "ABC-303 — the bundle's own counts at depth 8"`.
  - **A deep run with no test counts as a failure.**
  - The `D8` lines `cand` prints are reported. The A0-3 margin in clock reads is reported where a row prints it, else `UNKNOWN - verify`.

## Batch order
**S** (done, before this note), then stage A: **A** (PR1, P0), **B** (PR2, PR3, PR4), **C** (PR5, PR6, PR7), **E** (PR9), **F** (PR10's untimed reports), **G** (PR11). Then stage B only: **D** (PR8, then PR10's timed reports), then **H** (PR10's lane read). **PR8 and PR10's lane read are last.**
- PR1 is read before anything else. A PR1 miss voids the probe: STOP, subject to rule 1's one fix.
- A miss under rule 1 gets one fix under a sealed addendum, and then every stage A row is re-read.
- **A real NOT MET under rule 2 (batch C) or rule 4 (batch E) ends the probe at once.** No further batch runs, timed or untimed, and stage B is not asked for.
- If stage A would pass 55 minutes of lock, it stops and reports. Lock time is summed from `out/holds.txt`.

## The rule, word for word from d13
1. **PR1, PR2, PR3 or PR4 misses:** a defect in the prototype gets one fix under a sealed addendum, and every row is re-read. If PR3 shows d2's words or QE's frozen row are wrong, and not the patch, STOP: this ADR is restated and goes back to him. No value moves.
2. **PR5, PR6 or PR7 misses:** a defect check first. If the miss is real, the premise is **NOT MET**. `ABC-292` is not built, and it goes back to BA/PM. No number is changed to pass. There is no subset fallback: dropping a term after a safety read is choosing with the row in hand.
3. **PR8, on the unrounded R:**
   - `cand` ≤ 1.03: the premise stands, and the build carries no cut. F2's cut and re-read stay unspent.
   - `cand` above 1.03 and `cut` ≤ 1.05: the premise stands, the build carries the cut, and the cut is spent. K4 on the build is then F2's one re-read.
   - `cut` above 1.05: the premise is **NOT MET for cost**. `ABC-292` is not built, it goes back to BA/PM, and the owner is told. This is the stop `ABC-291` did not have.
   - A void session is re-run once under the sealed rule. A second void leaves R `UNKNOWN`, and the build carries the cut.
4. **PR9 below 5.0 %:** the premise is **NOT MET for an own read**. The intent stays GAIN, and no value is raised. The ticket goes back to BA/PM, and the owner is told.
5. **PR11 shows a row no exact build can hold, beyond K2's two:** it is listed by a dated line before Ready. If its words cannot stand on a re-found fixture, STOP to Architect/Design. It is never quietly re-pinned.
6. **Every row holds:** the premise is **MET**, and this ADR gets its dated line.

**Stage A applies rules 1, 2 and 4, and reports what rule 5 would list. Rule 3 and rule 6 wait for stage B.**

**What the probe can change here (d13):** K0 (c)'s counts; K2's list and the deep pins' new figures; d6's and d7's forecasts, replaced by readings; whether the cut is in the build; and whether `ABC-292` is built at all.
**What it cannot change (d13):** d2's definitions (except by rule 1's STOP, back to him), d3's rule or any value, d4's seam, d6's ratio, d8's intent, any bar, or the term order. It cannot turn a miss into a pass, and it cannot be re-run after one.
**Fenced out (d13), and held to:** no margin on `zugzwang.001`, no v(e1f1) − v(e1e5), no per-part read of it, and no singles on any safety row. `…3e6b25fb`'s reading of `ADR-0067` test 3 applies as in `ADR-0075` d10. `cand` has no per-term switch at all.

## The notes after this one
d13 asks for one results note and one decision note. **The brief's two stages split the results note in two:** an `observation` with stage A's readings at stage A's stop, and one with stage B's at stage B's stop. The one `decision` note comes at the probe's end, or at stage A's stop if a rule ends the probe there. Nothing else changes.

**Host estimate.** Stage A: under 15 minutes of lock by `arch-ABC-291-probe`'s 3.5 minutes plus two default-lane runs and six deep runs, `UNKNOWN - verify`. Stage B: about 5 minutes for batch D and about 5 for batch H.
