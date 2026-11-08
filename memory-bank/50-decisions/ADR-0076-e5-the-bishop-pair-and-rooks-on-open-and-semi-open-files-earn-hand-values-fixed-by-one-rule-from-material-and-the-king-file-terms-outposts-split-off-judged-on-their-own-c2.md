---
kind: adr
id: ADR-0076
---
# ADR-0076: E5 (`ABC-292`): the bishop pair and rooks on open and semi-open files earn hand values fixed by one rule from `MATERIAL` and the king-file terms. Outposts split off and wait. The pawn file sets join the memo at 576 KiB, behind one switch and a test-only off-door pair, `G2` ≤ 1.05 ×, judged on their own C2′, intent GAIN

## Status

**ACCEPTED 2026-11-08 by the owner. In force only at `ABC-292`'s merge.** Recorded by Architect/Design (task `arch-ABC-292-accept`, records only, on `grugops/arch-ABC-292-accept` from `main` `6eaeee01`). Nothing was run.
- **His word, verbatim** (`orch-2026-10-30a` `…23d30c72`): *"agree"*, to every recommendation the Orchestrator put to him. In the Orchestrator's numbering: 1 accept this ADR, with `G2` ≤ 1.05 × named as looser than `ADR-0075`'s 1.03, and K2's two rows named as lost fixture properties re-found in QE's freeze; 2 a miss here is the stop for the hand-valued path; 3 d14 (c), yes; 4 the pawn terms in a bundle, no; 5 games first over budget, yes; and question 5's reading of a lone pass.
- **What it settles:** d1–d14 as written. **No definition, rule, value, ratio, bar or probe row changes with this acceptance.** The probe stays written and not run. F5's "accepted, not in force" now applies to a miss.
- **Question 1, with the two lines he was shown:**
  - `G2` ≤ 1.05 × stands as d6 writes it, with the 1.03 tripwire and the named cut. He saw it named as looser than `ADR-0075`'s 1.03. The ratio is this ADR's, as the ticket says, so no bar moved. See d6's dated line.
  - K2's two `ABC-083` rows are lost fixture properties, not re-pins and not a bar loosened. Their re-found fixtures are QE's, in the freeze (d10 step 3). Their words and relation stand. See K2's dated line.
- **d14 (c), no second set of values after a miss:** accepted, for this term. "If accepted" and "if he accepts it" in d11's table, F4 and F5 now read accepted. It binds no later term; each asks him in its own ADR.
- **His ruling: a miss on `ABC-292` is the stop for the hand-valued path.** A miss is any in d14 (c)'s list. After one, E3b (`ABC-290`) and E6 (`ABC-293`) are not built without a new word from him. It was § The plain case's recommendation; it is now his ruling. It replaces d14 (c)'s "It does not hold the next term". `ADR-0056` D6's dated line of this task holds it with the term order.
- **Question 3, the pawn terms back in a bundle at the same numbers: no.** `ADR-0075` d11 (d)'s dated line of this task.
- **Question 4, games first over budget: yes.** See d7's dated line. The figure stays ≤ +0.10 s.
- **Question 5:** a lone pass reads "keep this term, it was not seen worse", and nothing more. A third-pull ask carries the odds. No bar or door test moves. See d14 (b)'s dated line and `ADR-0067`'s.
- **OQ-0074-2 (a):** `ABC-289` closes NOT MET. § Consequences' clause that waited on it lapses.
- **Still owed, unchanged:** § Consequences' lines. d10 step 3, QE's freeze, comes next, and no probe or build comes before it.

*Before acceptance:* **PROPOSED 2026-11-07.** Recorded by Architect/Design (task `arch-ABC-292`, records only, on `grugops/arch-ABC-292` from `main` `b1227f2b`, `src/` tree `bba42fb7`).
**Nothing was run:** no test, build, engine, probe or game. Every figure below is arithmetic on `src/` at that commit, or is quoted from a named record. Anything that needs a reading is marked `UNKNOWN - verify`.

**Acceptance is the owner's:** this is a new ADR (`ABC-292`'s front matter, reading (b)). His questions are § The owner's questions. Not in force until `ABC-292` merges.

**What it sets, in short.** Two terms in form (b), on `main`'s tapered evaluation, and outposts leave the page. `BISHOP_PAIR` 50; `ROOK_OPEN_FILE` 20; `ROOK_SEMI_OPEN_FILE` 10; halves equal, from one stated rule, fixed here before any row or game is read. Memo stays 576 KiB. `G2` ≤ 1.05 ×, with a tripwire at 1.03 and a named cut. `NFR-008` ≤ +0.10 s stands. Intent GAIN. QE's freeze comes before the probe and before the build, and the dispatch can check it. A written premise probe, which cannot change a value. **My case is to build it, once, narrowed** (§ The plain case).

**Inputs read:** `ABC-292`'s and `ABC-306`'s pages; `ADR-0075` with its dated lines and § What would falsify this; `…8cc32a89`, `…ad069f2f`, `…2f762abf`, `…024bbd63`, `…61a939d3`, `…e5a5ac0c`, `…ba8265e9`, `…aab9afd1`, `…6e0445ef`, `…32c023cc`, `…c1623ae7`; `ADR-0056` D2, D5 and D6 with their dated lines; `ADR-0067`'s dated blocks; `ADR-0071` D8; `ADR-0031` D2; `EPIC-011` § Test notes; `se-ABC-291`'s `…cb124720`, `…a8daf408`, `…d68ef14e`; `src/evaluate.ts`, `src/evaluate-params.ts`, `src/evaluate.king-mobility.test.ts`, `src/uci-session.test.ts`, `src/search.bundle.test.ts` on `main`; `git diff 780d9021 70d931ab`.

## Decision log

| date (UTC) | by | what | record |
|---|---|---|---|
| 2026-11-07 | Architect/Design | PROPOSED: two terms, outposts split, rule and values, seam, `G2` ratio, order before the build, probe written and not run. Nothing run | `arch-ABC-292` |
| 2026-11-08 | Owner | ACCEPTED ("agree", to every recommendation), in force only at `ABC-292`'s merge. `G2` ≤ 1.05 × and K2's two rows as named; d14 (c) for this term; a miss here stops the hand-valued path; question 3 no; question 4 yes; question 5's reading. OQ-0074-2 (a) | `orch-2026-10-30a` `…23d30c72` |
| 2026-11-08 | Architect/Design | Status and this log. Dated lines at d6, d7, K2, d14 (b), d14 (c), § The plain case, § The owner's questions and § Consequences. The dated lines of `arch-ABC-292` in `ADR-0056` and `ADR-0067` read accepted; his stop ruling in `ADR-0056` D6. No value, rule, definition, ratio or bar moved. Nothing run | `arch-ABC-292-accept` |

## Context

### What `main` scores today
- `MATERIAL` reads N 325, B 325: "Bishop and knight are equal: the bishop's wider reach is paid by mobility". No term sees two bishops.
- `ROOK_MG` holds 20 on the seventh rank and nothing else: "Open files are left to mobility". `MOBILITY_WEIGHT` is 4 cp a square for every piece, clamped to ± 100.
- `kingExposure` prices a file for a king: `KING_FILE_OPEN` 20, `KING_FILE_HALF_OPEN` 10. It finds them by scanning six ranks on up to three files, per king, on every call.
- `pawnStructure` already computes `whiteFiles` and `blackFiles`, then drops them. A memo hit does not have them.
- The memo holds seven arrays, 36 bytes a slot, 589 824 bytes. `doubled`, `isolated` and `passed` are only ever summed on a hit. A hit reads seven words.

### What `ABC-291` taught, taken as design
- **`G2`:** one packed read and one add were forecast "under 1 %". PR8 read 1.04287. K4 read 1.0267 with the cut spent and the re-read spent, inside by 0.0033. The hot function reads at two levels, about 316 ns and about 329 ns, on the same code, cause `UNKNOWN - verify`. A forecast from counting operations cannot be trusted here, so d6 prices by reading and builds no term to the edge.
- **`NFR-008`:** read +0.155 s on a budget of +0.10 s, and most of it lay in the gaps before each file's first row (`…2f762abf`). At least +0.05 s sits in files with no changed line. So d7 limits what the design controls, and says plainly what it cannot.
- **The freeze:** it was missed at dispatch for the fourth time. So d10 names an order the dispatch can check, and puts the freeze first.
- **K1 (h):** a bar no exact build could meet cost a STOP. So d9 writes that row in its working form, and I read the rows this term touches before writing them. That found two more: K2 below.
- **Deep pins:** `ABC-282` A0-3 surfaced as a STOP in the build. So they are named here, and the probe reads them.
- **Score:** 46.0 of 100, −27.9 ± 61.6. It does not show the term worse, and it says nothing about these terms.

### Blindness to `zugzwang.001`
`ADR-0067` test 3 reads "no value … chosen with the row or its attribution in hand". **The row played no part in d2 or d3.** I did not open its FEN, and I worked no term through it. d3's inputs are `MATERIAL`, `KING_FILE_OPEN` and `KING_FILE_HALF_OPEN`, read from `src/evaluate-params.ts`. Attribution of e1e5 is not run. Whether this term holds the row is `UNKNOWN - verify`.

## Decision

Notation: a half h is mg or eg. A file is a to h. "Own" and "enemy" are from the piece's side. "On a file" for a pawn means ranks 2 to 7, the set `pawnStructure` reads.

1. **What lands: two terms on one read. Outposts split off.**
   - **On this ticket:** the bishop pair and the rook file terms. They need no new memo bytes and no new loop, and each has an anchor on `main`'s table.
   - **Off this ticket:** outposts. They are the only one of the three that needs per-minor work in the walk, two more memo words and new work on the miss path. Those are about 720 896 bytes against 589 824, two more reads per hit, a rank-zone judgment, and about half the seam rows. Their nearest anchor is an analogy to `ISOLATED`'s 10, and at that value the term moves little for the most cost. K4 passed by 0.0033 on less. The page said "outposts cost per call" before any of this.
   - **The split rule fires** (`ABC-292`'s banner): the ADR gives them different forms and orders. BA/PM cuts outposts as a held page in `ABC-306`'s form: re-open on a yes to a third pull that names it, or on a case of its own the Architect records. No date. Nothing here rules that it will never come.
   - **The two stay together, on one read, and one switch.** Two reads give two draws at 50 % for a term worth nothing, cost two builds, and each read has half the signal. Summed value is what a 100-game read can see at all. No row reads them apart for a decision, so a door per term buys nothing (`ADR-0075` § Alternatives). The price is stated: a miss takes both, and nothing says which.

2. **The definitions.** All read the board at the node. None reads attacks, pins, or whose move it is.
   - **Bishop pair:** the side has two or more bishops. It counts once, however many. Square colours are not read. A third bishop adds nothing.
   - **Rook on an open file:** a file holds at least one of the side's rooks, and no pawn of either colour. It counts once per file, however many of the side's rooks stand on it.
   - **Rook on a semi-open file:** a file holds at least one of the side's rooks, none of the side's pawns, and at least one enemy pawn. It counts once per file.
   - **What follows by arithmetic:** a file is open, semi-open or neither, never two. Doubled rooks earn once. A rook on the seventh on an open file earns 20 from `ROOK_MG` and 20 here. With no pawns on the board every file is open, so in `K R` against `K` the term is a constant 20. Queens are not read.
   - **The seventh-rank rule is kept, not folded.** Folding would change a table value for no gain, and the entry costs nothing.
   - **The comment** "Open files are left to mobility" on `ROOK_MG` is no longer true at the merge, and the build changes it.

3. **The rule, and the values it gives.**
   - **A file gives a rook what it costs a king:** `ROOK_OPEN_FILE`[h] = `KING_FILE_OPEN`[h]; `ROOK_SEMI_OPEN_FILE`[h] = `KING_FILE_HALF_OPEN`[h]. `main` already prices these two files, and the rook is the piece that uses them. The figures sit beside the seventh rank's 20 and under what mobility already pays for reach, so the overlap with mobility stays small.
   - **A pair earns a minor's premium once more on each bishop:** `BISHOP_PAIR`[h] = 2 × (`MATERIAL`[h][BISHOP] − 3 × `MATERIAL`[h][PAWN]). `MATERIAL`'s rule adds 25 to a minor so that it outweighs three pawns. Two bishops cover both square colours, which no single minor does, so each earns that step again.

   | export | mg | eg |
   |---|---:|---:|
   | `BISHOP_PAIR` | 50 | 50 |
   | `ROOK_OPEN_FILE` | 20 | 20 |
   | `ROOK_SEMI_OPEN_FILE` | 10 | 10 |

   - **The halves come out equal, and that is the rule's output.** All three anchors have equal halves. So "tapered" on the page reads "a pair that enters the blend", as in `ADR-0075` d2. `ADR-0064` d3's line stands: no endgame value is hand-written without a rule. A pair worth more in the endgame is a known idea and has no rule here. Equal halves also leave nothing for the blend's trunc to drop.
   - **Fixed now.** The values are set here, before any row or game is read. If an anchor moves before the build, these numbers stay.
   - **One consequence of the rule, stated.** A king on a half-open file with its own rook on that file reads −10 + 10. The same holds for an open file at 20. I read that as fair, because the rook does use the file. It is reasoned, not read.
   - **Largest swing:** 50 + 2 × 20 = 90 cp a side with two rooks. A minor is 325, and mobility's clamp is 100.
   - **Licence:** the rule is this project's own (`ABC-215`, `ADR-0048`). No value is taken from another engine.

4. **The seam: the file sets in the memo, the rest in the walk.**
   - **The memo.** One new `Int32Array` word holds both sides' file sets: white in bits 0–7, black in bits 8–15. `pawnStructure` already has them. `doubled` and `isolated` share one word, in `ADR-0075` d5's form (`pawnCacheDoubledIsolated` stands on `grugops/ABC-291`). So a slot stays 36 bytes, the memo stays 589 824 bytes, and a hit still reads seven words. **This fold is in the design from the start. It is not held as the cut,** because holding it is how `ABC-291` reached K4 with nothing left.
   - **The walk.** `if (type >= QUEEN)` gains branches for the two other types it passes: a rook sets its file's bit in the side's rook mask; a bishop adds one to the side's count. Knights pay compares only. No new loop, no new pass, no allocation.
   - **After the memo.** Per side, open = rooks & ~(white | black) and semi-open = rooks & ~own & enemy, each counted over 8 bits. The bishop test is one compare per side. One packed add. The rook part is skipped when neither side has a rook.
   - **Not in the memo:** both terms read pieces, so neither is a pure function of the pawn masks.
   - **`whiteMinusBlack` gains one boolean,** which decides only whether the part is added. The walk gathers either way, so the off door costs what the head costs.
   - **Parameters:** three new exports, in `src/evaluate-params.ts`, data only, each comment carrying its rule.

5. **One switch and a test-only off-door pair** (`ADR-0026` d10, in `ADR-0064` d7's form).
   - **One switch, `pieceTerms`,** in `src/search.ts`'s `Switches`, `src/engine.ts`'s `Heuristics` and quiescence's rules record. It is on in `search()` and `chooseMove` only, and never module state.
   - **Test-only exports:** `searchWithoutPieceTerms`, `chooseMoveWithoutPieceTerms`, and `evaluateAtPhaseWithoutPieceTerms`, the evaluation those doors call.
   - **One test-only seam, `pieceTermsForTest(position)`:** each side's three parts, mg and eg, per side and never netted, from the same code the hot path runs. `pawnStructureForTest` gains one field, the file word.
   - **Every older door turns it off.** `evaluateWithoutTaper` never adds the part, so `ADR-0064` B1 (c) holds. `evaluateWithoutMobility` and `evaluateWithoutPawnCache` keep it on: `ABC-083` A4's bound row reads `evaluate` minus `evaluateWithoutMobility`, and it must stay the mobility term.
   - **Rows follow `ADR-0064` d7 by reference.** A shipped-side row whose other side is an older door re-points to the new door, figures unchanged. So does a count row titled for a named earlier tree (`ADR-0075` d4's dated reasoning, taken here as this ADR's own line). A row that pins the shipped path's own value re-pins, old → new, in the PR. A lost fixture property is re-found under `ADR-0028` d2. A level that reddens follows `ADR-0028`. **No zugzwang depth is re-pinned.**
   - **`QUIET_RULES` gains `pieceTerms: true`, from the start.** `isQuiet` compares `quiesce` with the shipped `evaluate`, so the record follows the evaluation, as `taper: true` does (`ADR-0075` d11 (a)'s dated line, taken here as this ADR's own line). `QUIET_RULES_NAME` changes with it.

6. **Cost: `G2` ≤ 1.05 × the base, per call.** The price first, then the bar.

   | where | what a call adds | by reading |
   |---|---|---|
   | walk, per knight | two compares | no memory touched |
   | walk, per bishop | two compares, one add | no memory touched |
   | walk, per rook | one compare, one shift, one or | no memory touched |
   | memo hit | one word read, one word read fewer | net 0 of seven |
   | after the memo | two mask pairs, up to four 8-bit counts, two compares, one packed add | up to four L1 reads if a table counts bits |
   | memo miss | one store more, one store fewer | net 0; the file sets exist already |

   - **Forecast: R between 1.02 and 1.05, low confidence, `UNKNOWN - verify`.** The last forecast by this method was low by a factor of four, which is why the probe prices it. On `ABC-291` the same read count, with less after it, read r₁ 1.04448 and r₂ 1.00893.
   - **Why 1.05, and not `ADR-0075`'s 1.03.** The ticket says the ratio is this ADR's.
     - This term does more than one memo read: it works in the walk. 1.03 fitted "one read, one add, one branch", and even that took a spent cut and a 0.0033 margin.
     - One session's level moves R by about ± 0.018. A correct build with a true R of 1.03 would miss a 1.03 bar about half the time. No bar should be a coin flip for a correct build.
     - 1.05 is `ADR-0064` B6's ratio for a change to the whole evaluation. E1 read 1.0373 under it. The page calls 1.05 form (a)'s precedent and no bar here, so it binds nothing: I take it for these reasons, and not because it is old.
     - *Dated 2026-11-08 (`arch-ABC-292-accept`; his word `…23d30c72`): accepted as written. He was shown 1.05 named as looser than `ADR-0075`'s 1.03, and written after K4 read 1.0267. The tripwire at 1.03 and the named cut stand. No bar moved.*
   - **What 1.05 costs in play, by arithmetic.** `evaluate` is about 315 ns, run about 0.9 times a node (`ADR-0031`), and a node is about 1 476 to 1 626 ns (`…024bbd63` K5). So the call is 17 to 19 % of a node, and +5 % a call is about +1 % a node. At `ADR-0055`'s 50–100 Elo a doubling that is about 0.7 to 1.4 Elo. `ABC-291` agrees in size: `nsnode` read 1.0021 and 1.0089 on a per-call 1.0267. **Per-call `G2` guards little Elo at this size.** It is a cost bar, and it stays one.
   - **The instrument:** `ADR-0067` d8's A5 shape under a PREREG sealed before timing, as `ADR-0075` d5 has it: R = (r₁ + r₂) / 2 on the unrounded value, two sessions in reverse order, a `main`-copy control, rounds 2, 4 and 6 reversing the list, round 1 dropped, void window [0.970, 1.030].
   - **What it cannot read, stated now.** `G2` repeats six roots, so it reads the hit path. In this design the miss path adds nothing by reading, but that is not read. A per-call ratio says little about a node. The two levels' cause is unread. PR10 reports all three.
   - **The named cut, F2's one, value-identical:** `kingExposure` reads own and enemy from the memo's file word, and the 6-rank scan goes. That is up to 36 board reads less per call, and it needs `kingSafety` computed after `pawnStructureCached`. The packed sum is commutative, so the value is the same. My estimate is −5 to −10 % a call, `UNKNOWN - verify`, and PR8 reads it.
     - **It is held, not spent, on purpose.** Taken from the start it would put a speed gain inside the term's own C2′. The gain is small: about −1 to −2 % a node, 1 to 3 Elo. Spent, the PREREG discloses it.
     - **For the Orchestrator, no bar and no dependency:** once file sets are on `main`, or on their own, this cut is worth having whatever happens to the term. If it stays unspent, it can be its own value-identical ticket. If the term is refused or misses, it needs only d4's file word. Its order is yours.

7. **`NFR-008` and `NFR-009`.**
   - **`NFR-008`: ≤ +0.10 s stays** (`…aab9afd1`). No figure above it is proposed: that moves a bar. BA/PM writes the line on this page, as `…8cc32a89` § 4 says.
   - **Expected cost and where, from `…2f762abf`'s split of `ABC-291`.** All of it is an estimate, `UNKNOWN - verify`.

     | part | `ABC-291` | this term, expected | what the design does |
     |---|---:|---:|---|
     | new rows | +0.018 s for 81 titles | about +0.012 s for about 55 | K1's rows are units with no search |
     | import of larger production files | +0.01 to +0.06 s for about 11 KiB net | +0.01 to +0.05 s for about 8 KiB | fewer lines in `src/evaluate.ts`; the door records cost what they cost |
     | a new default-lane file | none | **none, by rule** | K1's rows go in an existing file. `R-N8H-3` puts a file at about 0.058 s of wall, more than half the budget |
     | shared rows that search | +0.009 s, se 0.028 | about the same | none |
     | the unresolved part | at least +0.05 s in unchanged files | 0 to +0.07 s, unknown cause | nothing can. It may be read noise |
     | **sum** | +0.133 to +0.165 s | **+0.03 to +0.14 s, midpoint about +0.085 s** | |

   - **So a correct build may well read over.** With QE's read sigma of 0.082 s, a true +0.04 s reads over the bar about 23 % of the time, +0.085 s about 43 %, and +0.12 s about 60 %. That is arithmetic on an estimate.
   - **If it reads over:** `NFR-008` is UNRESOLVED by `…a49d69d7` § 5's form, not a defect. The route is the owner's: § The owner's questions, 3. With no answer, H3's stricter order stands, and no game starts until `NFR-008` is read and not over.
     *Dated 2026-11-08 (`arch-ABC-292-accept`; his word `…23d30c72`): answered. "§ The owner's questions, 3" in the line above means question 4, games first, by its words. He said yes, for the terms after `ABC-291`. I read that as including this one: this line sends this term's over-read to that question, and the question gives this term's odds. That is a reading, open to the Orchestrator's overruling. So if `NFR-008` reads over on this term, its games may go first, and the budget is decided only if it passes. Each read seals that order in its PREREG before any figure exists. H3's stricter order no longer stands for these reads. The figure stays ≤ +0.10 s, and "UNRESOLVED, not a defect" stands.*
   - **The supply stays in reserve.** N1 to N9 are unspent, and rows reach the bar only by riding on the branch (`…61a939d3`). Merged first, they sit in both arms and buy nothing. They are not planned here.
   - **`NFR-009`: +0 bytes.** `src/evaluate.pawns.test.ts`'s and `src/transposition.test.ts`'s byte rows do not move. One small count table, if the build uses one, is 256 bytes at load.
   - **`NFR-001`/`G2`:** d6. **`NFR-005`:** K5. No new NFR file. `plans/nfr-catalog.md` is untouched.

8. **Intent: GAIN, ≥ 50.0 of 100, and the read's shape.** `ADR-0056` D6's dated line fixes the intent: evaluation rows fire at 100 ms. It is named here and never re-classed after a score is seen.
   - **The read:** C2′ at 100 ms against the merge-base, 100 of 100 complete, 0 candidate faults, 0 losses on time. Then S′ at the E in force (1 810 today), S-4. Then the Levels deep lane.
   - **The stages, each under its own hold, each under 1 h:** timing (K4, K5, `NFR-008`), then the games. The owner holds the timing stage. He is asked for the probe's timing rows too.
   - **W** stays the Orchestrator's, read by read. My advice is to ask: this read owes a quiet window for its timing rows anyway, and the dropped W on `ABC-291` let load come (`…8cc32a89` § 3). FL governs whatever happens. No game is voided for load.
   - **Bundle:** this read is not a bundle. I name none: nothing else is ready, and waiting for E3b would put cost risk on a cheap term.

9. **The bars of `ABC-292`, pre-registered** (form (b); no bar is new; none is loosened after Ready). Each is written so that an exact build can meet it.
   - **K0, the doors:**
     - (a) `chooseMoveWithoutPieceTerms` and `searchWithoutPieceTerms` are node-equal to the merge-base's `chooseMove` and `search()`: nodes, score and move, on kiwipete d8 and d9, position-6 d8, d9 and d10, and `search()` d8 on both;
     - (b) every older door reads its pre-ticket counts;
     - (c) the head reads the probe's P0 counts. If `main`'s `src/` has moved, the Engineer applies the probe's patch to the new base, re-reads, and puts both in the PR. A re-derived count is a dated line here, never a moved bar.
   - **K1, units (default lane, no search, in an existing test file):**
     - (a) the mirror, `Object.is`: `G3` + `TAPER_MIRROR_POSITIONS` + ≥ 12 new positions from QE's freeze, 0 mismatches;
     - (b) `evaluateAtPhaseWithoutPieceTerms` and `evaluateWithoutTaper` are `Object.is`-equal to the pre-ticket entries over the frozen corpora;
     - (c) **seam rows, by arithmetic, on fixtures QE freezes under d10:** at least one per definition per colour. For the two rook definitions, one per edge file. They include: one bishop; two; three; a same-colour pair; a rook file failing each clause alone; doubled rooks; a seventh-rank rook on an open file; a board with no pawns;
     - (d) **the hot path:** `evaluate` minus the off-door evaluation equals the seam's white minus black, signed for the side to move, exactly. Equal halves leave no tolerance. A second row, inside `withParametersForTest` at unequal test halves, reads the blend in `ADR-0070` d4's own-phase form;
     - (e) the rule: each export equals d3's table, rebuilt in the row from the anchors' values at this ADR's date;
     - (f) `ABC-274` A9's bound reads the three pairs: 8 × the larger file term + `BISHOP_PAIR`, per side;
     - (g) the memo: a hit returns what a fresh `pawnStructure` returns, file word and summed word included, on a forced collision too, and on an on-then-off read of one slot;
     - (h) **source rows, written for `ADR-0064` d7's form from the start:**
       - `pieceTermsForTest` is called from test files only;
       - `evaluateAtPhaseWithoutPieceTerms`'s only callers outside test files are the three off branches, two in `src/search.ts` and one in `src/quiescence.ts`, and no shipped search takes one;
       - `pieceTerms: true` stands in code exactly twice in `src/search.ts` and twice in `src/engine.ts`, in each `RULES_PIECE_TERMS` and in `search()`'s or `chooseMove`'s own record, and in no other non-test file under `src/`. Under `tools/`, only `QUIET_RULES` and its name carry it.
   - **K2, the re-pins.** The list is `UNKNOWN - verify` until PR11, and joins this decision by a dated line before Ready. It binds at the probe's tree and is re-derived on a later base by a dated line. A re-pin outside it is a defect. **Known now, by reading, each to be confirmed by PR11:**
     - **Two rows no exact build can hold as written. Both are lost fixture properties, not re-pins.** They go to QE's freeze under d10, so the re-found fixtures are not the Engineer's.
       - `src/evaluate.king-mobility.test.ts` `ABC-083` A4, "white, with substantially more moves at equal material…". `MOBILE_WHITE` puts white's rook on the open d-file and black's behind its own h7, and the row asserts `evaluateWithoutMobility` is 0. With d5's line that reads 20. The relation and the ± 100 bound row do not change. Only the premise "every term but mobility cancels" is lost.
       - The same file's `ABC-083` A3 (b), "at EQUAL material, shelter equal, at phase 24". `F_HALF_OPEN_E5_24` has white's rook on f1, so the arm that opens the f-file also earns the semi-open term. On `main` the margin is about −2 by my arithmetic: +6 table, −10 isolated, −10 half-open, +12 mobility. **Any semi-open value of 2 or more turns it red, so this is no fault of d3's rule.** The re-found fixture must keep "red with the term zeroed". The twin row stays green.
       - **Reading:** `ABC-292` says "`G3`'s relation rows stay green, `ABC-083` A4 (mobility within ± 100 cp) included". The bound row is what that names, and it stands. These two keep their words and their relation, on a re-found fixture, under `ADR-0064` d7's own clause. **If the Orchestrator or the owner reads this as a bar loosened after Ready, it comes back here before the seal.**
         *Dated 2026-11-08 (`arch-ABC-292-accept`; his word `…23d30c72`): neither did. The Orchestrator put both rows to him with question 1, as lost fixture properties re-found in QE's freeze, and he accepted. Their re-found fixtures are QE's, made at d10 step 3, before the probe. "Red with the term zeroed" stays the A3 (b) fixture's test. No bar moved.*
     - **The deep pins:** § The pins this term moves.
     - **The classes `ABC-291` showed** (`…cb124720`, 64 rows): door lists, the switch's call sites, `futilityNode`'s arity 7 → 8, older-door re-points, value rows, a lost `ABC-282` A2 fixture. The rows will differ, because a piece term reaches rows a pawn term did not. No count carries from that tree (`ADR-0075`'s dated block of `arch-ABC-291-closed`).
   - **K3, safety (`ADR-0064` d7's rows):** mate floor 0 violations, door depth 4 → head depth 5 and depth 5 → depth 5 on the 287; zugzwang **7 / 7** at recorded depths with `zugzwang.001` among them; `G1` no NEWLY-MISSED line. All read all-on. No depth moves, and no expected result is rewritten.
     - **`G1`'s class on this diff, read now.** d5 touches `src/search.ts`, `src/engine.ts` and `src/quiescence.ts`, so by `ADR-0034` d2's letter there is no drift class, and every missed row is class B. F3 reads as written. Row 1632's 16 838 of 20 534 nodes is the watch. PR7 reports it before the build, so nobody learns it at K3.
   - **K4, `G2` ≤ 1.05 ×** (d6). The endgame report set is reported beside it.
   - **K5, `G6` under `Q-3K-4` (b):** every run at depth ≥ 6, depth 7 a WARN, "≥ base" reported, not graded.
   - **K6, the read:** d8.
   - **K7, the tool line** (d14 (a)): `TUNE_DEEP` green at the tip, its count reported.
   - **Reports, not bars:** drift at depth 5, reach at 47 000, PR10's figures, `NFR-008`'s parts.

10. **The order before the build: QE's freeze is a gate, and the dispatch can check it.** No step moves a bar. Each names what proves it happened.

    | # | step | who | what proves it |
    |---|---|---|---|
    | 1 | he answers § The owner's questions | owner | his word, in an Orchestrator note |
    | 2 | status and dated lines; the page's lines; outposts' page | Architect, BA/PM | merged records |
    | 3 | **the freeze:** `qe-ABC-292-freeze`, from d2, d3 and K rows' words alone, with no code in hand. Seam fixtures with values worked by hand, ≥ 12 mirror positions, the (b) sets by name and commit, the two re-found fixtures of K2. No row is written to `src/` | QE | a sealed `decision` note, with the sha256 of each fixture file, merged to `main` |
    | 4 | the probe, under its own task; PR3 reads QE's frozen rows | Architect | its PREREG commit, a descendant of step 3's commit |
    | 5 | K0 (c), K2's list and the deep pins by dated line; DoR 10 / 10 | Architect, BA/PM | merged records |
    | 6 | **the check:** before any build dispatch, the Orchestrator confirms `git merge-base --is-ancestor <freeze commit> main`, and that the brief cites the freeze note's id | Orchestrator | a line in the dispatch note. No id, no dispatch |
    | 7 | the build, on `main` after step 6 | Engineer | its first commit is a descendant of the freeze commit |
    | 8 | QE's stage 0 re-reads step 7's ancestry and the sha256s, and reports K1 (c) by rows and by order | QE | PREREG line |

    - **Why before the probe, not only before the build.** A freeze made with no patch in the world is blind by date. `ABC-291`'s was blind by QE's word only (`ADR-0075` K1 (c)). It also gives PR3 a second reader of d2 that is not the patch's author.
    - **If the order is missed,** K1 (c) is not met to the letter. No reading makes it met, as `ADR-0075` K1 (c) says of itself. An exact build dispatched after a freeze meets it, so it is a fair bar.
    - **What the freeze does not hold:** K0 (c) and K2, which need a tree. A fixture QE finds wrong before the build is a dated addendum to its own note. After the build it is F1's defect check, and no fixture changes to fit code.

11. **The fault rule on this read.** CF1–CF10 and FL reach it (`ADR-0056` D5's dated blocks of `arch-owner-answers-1105b` and `arch-ABC-303-load`). QE copies the Reach line, CF1–CF10 and FL unaltered, then this table. It adds no bar.

    | the words | in | on `ABC-292`'s read |
    |---|---|---|
    | "50.0" | CF2, CF5 | 50.0 (GAIN) |
    | "B6" | CF2, CF5, CF8 | C2′'s miss line: NOT MET, nothing merges, QE records a `failed-attempt`, and the ticket goes back to BA/PM. d14 (c) applies if he accepts it |
    | "no form, T, tier, door, margin or table moves (row P2)" | CF3 | no definition (d2), rule or value (d3), seam (d4), switch or door (d5) moves. Every value of `BISHOP_PAIR`, `ROOK_OPEN_FILE` and `ROOK_SEMI_OPEN_FILE` is fixed |
    | "Tables 1 and 2" | CF3 | K0–K5 and K7: every graded row the PREREG reads before the first game |
    | "§ 6's order" | CF4 | C2′, then S′, then the Levels lane |
    | "S1, S2 and R7" | CF6, and CF7 through it | K0 (a), the off door against the merge-base; K0 (b), every older door; K0 (c), the head's counts |

    - **No change:** CF1, CF9, CF10. CF7 changes only through CF6, and CF8 only by "B6". 3.0 of 10 and 7.0 of 20 are S-4. "The sealed E" is the E in force at this read's seal.
    - **A defect fix is not a miss.** A fix that restores d2 or d3 as written is CF3's, and CF4's new read follows if CF2 sends it there.

12. **What a pass means: "not seen worse", not "proven better".** By `ADR-0056`'s C2′ table a term truly worth +20 Elo passes 79 % of the time, +10 passes 66 %, 0 passes 50 %, −10 passes 34 %, and −20 passes 21 %. So a merged term's Elo stays unknown. In evidence terms a pass is weak: it moves the odds toward +20 over 0 by 1.6 to 1, and a miss moves them away by 2.4 to 1. The score is not a measure of the term, and it is not added to any forecast. `ADR-0056` D2's +30–80 stays an estimate for row E5 with per-piece mobility in it, and this page's share is `UNKNOWN - verify`.

13. **The premise probe: written here, not run.** It runs on the host after step 3 of d10, once, under the host lock, on one core. It plays no games. PR8 and PR10's lane read need the owner's word that the host is held.
    - **The premise, in three parts:** at d3's values the term is **safe** on the rows that have caught hand values before, **cheap** per call, and **fires** at 100 ms often enough for 100 games to mean something.
    - **Sealed form.** A `decision` note under the probe's own task, sealed and committed **before any measured run**. It names `main`'s tip and `src/` tree, the sha256 of each script, QE's freeze note, the rows and bars below word for word, the batch order, and the rule below. One load-only smoke may run first: the start position with the term on reads 0, by symmetry. Then one results note and one decision note. Scripts and outputs go to the task's `raw/`, with `<scratch>`, `<home>` and `<repo>` as placeholders. **No bar moves after a reading, and a miss is not re-played.**
    - **The instrument.** Scratch `git archive` copies of `src/` at the sealed tree, outside the repository: `main` (unpatched), `main2` (unpatched, the control), `cand` (d4 and d5 patched in, a probe-only switch giving ON and OFF), and `cut` (`cand` with d6's cut).
    - **The rows:**

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

    - **What PR8 must show, and why it comes first among costs.** `cand` at or under 1.03 means the build goes as d4 has it, with about 0.02 of room, one session's swing. Anything over that means the build carries the cut before any graded read, and `cut` must itself show it can meet 1.05.
    - **PR10's lane read** puts a figure on d7 before the build, and its second B arm is QE's way to read the unresolved part (`…2f762abf`). It changes no bar. The Orchestrator may drop it.
    - **Fenced out of the probe.** No margin on `zugzwang.001`, no v(e1f1) − v(e1e5), no per-part read of it, and no singles on any safety row. `…3e6b25fb`'s reading of `ADR-0067` test 3 applies as in `ADR-0075` d10.
    - **The rule (fixed now):**
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
    - **What the probe can change here:** K0 (c)'s counts; K2's list and the deep pins' new figures; d6's and d7's forecasts, replaced by readings; whether the cut is in the build; and whether `ABC-292` is built at all.
    - **What it cannot change:** d2's definitions (except by rule 1's STOP, back to him), d3's rule or any value, d4's seam, d6's ratio, d8's intent, any bar, or the term order. It cannot turn a miss into a pass, and it cannot be re-run after one.
    - **Host:** `ABC-291`'s probe took about 3.5 minutes of lock. This one adds one `G2` arm, one lane read and a few deep rows. Under 30 min by estimate, `UNKNOWN - verify`, and it takes the lock alone.

14. **The carried items.**
    - **(a) The tool line lands with the term, at its merge,** by `ADR-0075` d11 (a), which stands, and which each term's ADR states for itself. `tools/tune` gains the three terms' counts in the tracer and the three exports in the emitter, **traced and held, not free**. 17 → 20 exports. No fit, no emission to `src/`, and `src/` gains no tracing code. `QUIET_RULES`: d5. K7 reads it. It holds no production line, so it stales no read, and test-only commits may follow it. If E2 closes for good, no tool line is owed.
    - **(b) The third-pull door.** `ADR-0075` d11 (c) stands: these parts count, each merged part on its own. Test 4 is unchanged: one door, one fit. Outposts count only if they merge one day. That reading stays open to overruling at any third-pull call. Asking is not a yes.
      *Dated 2026-11-08 (`arch-ABC-292-accept`; his word `…23d30c72`): question 5's reading is his. A lone pass reads "keep this term, it was not seen worse", and nothing more. It lets a third pull be asked for and is no reason to say yes. The ask carries the odds of question 5. No bar and no door test moves.*
    - **(c) No second set of values after a miss. This is his to accept here, for this term** (`…c1623ae7`: each later term's ADR asks him).
      - **The line.** After a miss, `BISHOP_PAIR`, `ROOK_OPEN_FILE` and `ROOK_SEMI_OPEN_FILE` do not get new numbers by hand. New numbers chosen after a loss are tuning on play by hand.
      - **A miss is:** a real safety red (F3), C2′ below the bar on a clean read, a CF2 or CF8 NOT MET, a second miss on F2's K4 or K5 half, or the probe's rule 2, rule 3's cost stop, or rule 4.
      - **Not a miss:** a defect fix that restores d2 or d3.
      - **How it sits with C2′'s line** "a changed form may come back as a new attempt". It narrows that line for this term. A change of values alone is not a changed form. A new form needs a new definition, a reason drawn from no missed read, its own ADR and his acceptance.
      - **What it does not do.** It does not hold the next term: a miss here leaves `ABC-290` where it stands. It does not bar outposts, which have not been read.
      - *Dated 2026-11-08 (`arch-ABC-292-accept`; his word `…23d30c72`): **accepted, for this term.** The list above is what a miss is. **His ruling replaces "It does not hold the next term":** any miss in that list is the stop for the hand-valued path, and E3b (`ABC-290`) and E6 (`ABC-293`) are not built after it without a new word from him (`ADR-0056` D6's dated line of this task). "It does not bar outposts" stands: their page is held, and nothing here reads them. A defect fix that restores d2 or d3 is still not a miss. No value, rule or bar moved.*

## The pins this term moves

`ADR-0071` D8's form. The old column is `main`'s. New figures are `UNKNOWN - verify` until PR11, then a dated line in `ADR-0071` D8 and in K2, on that tree, before Ready. Both boards hold two bishops and rooks a side, so the term fires along the lines, though not at the root. Which fields move is unknown until read.

| rows | lane | where | form | old |
|---|---|---|---|---|
| `ABC-282` A0-3, `D8`: `level` ×2, `simple-tournament` `go movetime 200`, `uci-clock-mode` `go movetime 200` | `ENGINE_DEEP` | `src/uci-session.test.ts` | **re-pin:** the session has no door | `info depth 8 score cp 45 nodes 196681 time 201 nps 978512 pv c3d5` |
| `ABC-282` A0-3, `D7`: `simple-tournament` `go wtime 8000 btime 8000 movestogo 40` | `ENGINE_DEEP` | same | **re-pin** | `info depth 7 score cp 43 nodes 69705 time 76 nps 917171 pv c3d5` |
| `ABC-282` A0-3, `D6`: `uci-clock-mode` `go depth 6` | `ENGINE_DEEP` | same | **re-pin:** a tree pin, so nodes move too | `info depth 6 score cp 87 nodes 10513 time 17 nps 618412 pv c3d5` |
| `ABC-282` A0-1, 6 rows | `ENGINE_DEEP` | `src/engine.test.ts` | **re-point** to `chooseMoveWithoutPieceTerms`, figures unchanged; the `softMs` absent ≡ 1 relation stays on `chooseMove` | `ADR-0071` D8's table in the form of `arch-ABC-303-w1-rows`' block |
| `ABC-282` A0-2, 4 rows | `ENGINE_DEEP` | same | **re-point,** figures unchanged; no shipped line is kept, because a stepping clock's stop follows the tree | same |
| `ABC-303`, "the bundle's own counts at depth 8", 2 rows | `SEARCH_DEEP` | `src/search.bundle.test.ts` | **re-point** by d5's count-row line, figures unchanged | 311 546 / 573 518 and 163 523 / 94 911 |
| D5, "a kept move is reported…", cp 475, `a1f6` | default, a real-engine row | `src/uci-session.test.ts` | **read in PR11.** A pawn term did not move it. This position holds bishops and rooks, so this one may | `info depth 2 score cp 475 … pv a1f6`, with `ABC-282` A2 (a) in `src/engine.test.ts` |

- **The A0-3 margin.** `ADR-0071` D8's dated lines say `D8` still reads a W1 leak only if a leak's line differs from the head's. `main`'s margin is 14 clock reads, and `ABC-291`'s tree read one. PR11 reports this tree's. If a leak would no longer show, it comes to the Architect before Ready.
- **A row outside this table** that PR11 lists is not a surprise, and it joins K2. A deep row outside K2 that reddens in the build is a STOP to the Architect, as on `ABC-291`.

## The plain case

**My recommendation: build it, once, narrowed to these two terms. If it misses, I would then put stop to him as my own recommendation for the hand-valued path, not E3b next.** This is judgment, not a reading.

*Dated 2026-11-08 (`arch-ABC-292-accept`; his word `…23d30c72`, "agree"): **the stop is now his ruling, not only my recommendation.** A miss on `ABC-292`, any miss in d14 (c)'s list, is the stop for the hand-valued path. E3b (`ABC-290`) and E6 (`ABC-293`) are not built after it without a new word from him. So after a miss there is nothing left to recommend; the next step is his. On a pass, the order E5, E3b, E6 stands as `ADR-0056` D6 has it. The case below stands as written.*

**For:**
- **It is a different kind of gap from E4b.** Today the engine cannot tell a bishop pair from a bishop and knight, so it trades one for the other at par. It sees a rook's open file only as a few squares of reach. These are decisions it has no information for. Pawn shape was partly seen already by the square tables and the two pawn terms. That is reasoned, not read.
- **It is the cheapest term left.** No new memo bytes, no new loop, and the same reads on a hit. E3b and E6 need attack maps, and `ABC-205` died on that cost.
- **Its failures are not the earlier ones.** Neither term touches the kings, unlike `ADR-0068`'s lost mates. E4b's miss says nothing about it: −27.9 ± 61.6 spans 0, and `…8cc32a89` found no reason to reorder.
- **The only clean route to a third pull is a merged term,** and this is the likeliest to reach it at the lowest cost.

**Against:**
- **The record.** Five hand-valued attempts, none on `main` as a live term: `ABC-207` lost, `ABC-205` died on cost, `ADR-0068` and `ADR-0070` missed their rows, `ABC-291` missed on score. `ABC-289` is a different row and adds nothing either way.
- **A pass proves little.** A term worth nothing passes half the time. If this passes, he will still not know it pays.
- **The price is real.** An ADR, a freeze, a probe with a held window, a build with some 60 test rows moved, if `ABC-291` is a guide, a QE hop with a second held window, about an hour of host, and a tool line.
- **The estimate is thin.** +30–80 was for the row with per-piece mobility and a fit behind it. These two terms' share is `UNKNOWN - verify`, and the rook term overlaps mobility.
- **It does not get him to 3 000.** The best case is a small step. `…e5a5ac0c` said wait might end in stop, and that stop is the better answer if he does not mean to fund these terms.

**Why build anyway.** The two terms are the largest plain gaps left on the evaluation, at the lowest cost left. The waste if it misses is bounded, and the probe can stop it before the build. One more clean miss would be the second on score, on the two terms with the best case. That would be enough to stop on, by weight of cost if not by proof.

**When not to build.** If he does not mean to fund a third pull even after a term lands, and is not after the small direct gain, then this ADR buys little, and he should say **stop** now. Saying it costs nothing here. d6's cut stays worth doing either way.

## The owner's questions

*Answered 2026-11-08 (`…23d30c72`): "agree", to each recommendation: 1 yes, 2 yes, 3 no, 4 yes, and 5's reading. He also ruled that a miss here is the stop for the hand-valued path (§ The plain case's dated line). The questions stand below as they were asked.*

**1. Do you accept ADR-0076?** The engine would learn two ideas. A side with two bishops earns 50 centipawns. A rook earns 20 on a file with no pawns, and 10 on a file with no pawn of its own. The numbers come from numbers the engine already has, and nothing has been tested. Outposts leave this ticket and wait, because they cost the most and have the weakest case. A yes locks the numbers before any test sees them. After that, QE fixes its test positions, a short host check runs that can only stop the work, the term is built, and it is read in 100 games at 100 ms. **My recommendation: yes.**

**2. If it misses, is that the end for these numbers? (`ADR-0075` d11 (d), for this term.)** A yes means no second set of numbers after a miss, as you ruled for the pawn terms. New numbers picked after seeing a loss are tuning by hand on the result. A new form would need a new reason and its own ADR. **My recommendation: yes.** If you say no, you keep a second try, but its result would be worth less, and each retry is another coin flip. Each later term still asks you for itself.

**3. May the pawn terms come back, with the same numbers, inside a bundle with a later term?** (`…8cc32a89`.) **My recommendation: no.** The rule says "never re-played", and a second read after a score is seen is a re-play by another door. `ABC-233`, `ABC-234` and `ABC-236` missed a pay gate, not a C2′ score, so they are not a precedent. With no answer, they stay out. Nobody has proposed it, and nothing waits on it.

**4. If a later term's test-lane cost reads over the +0.10 s budget, may its games still go first, with the budget decided only if the term passes?** (`…8cc32a89`.) This is what you chose for `ABC-291`. **My recommendation: yes, sealed in each read's plan before any figure exists.** By d7 this term may read over about two times in five, even when built correctly. A miss in the games then closes the question for free. A pass brings you the figure with the result. Against it, a term may play games and then fail the budget, about 25 minutes of host lost. With no answer, the stricter order stands: no game until the budget reads clean. Your silence decides nothing. The figure itself stays ≤ +0.10 s, and I propose no change.

**5. How should a lone pass be read, given the 87.5 %?** The third-pull door needs one merged term of E5, E3b and E6. If all three are worth nothing, at least one passes 87.5 % of the time. If each is worth +10 Elo, 96 %. So the door opening tells you almost nothing: 96 against 87.5 is 1.1 to 1. **Exactly one pass of three is more likely if the terms are worth nothing than if they are worth +10:** 37.5 % against 23 %, and 44 % at −10. Those are upper bounds, C2′ alone. **My recommendation:** read a lone pass as "keep this term, it was not seen worse", and nothing more. It lets a third pull be asked for, as the rule says, and it is no reason to say yes. The ask should carry these odds, and you decide on what a pull costs and whether two or three of the terms passed. This moves no bar and no door test. Two notes: running E3b and E6 as one bundle cuts the draws to two, 75 %. Reading outposts later adds a fourth, 94 %.

## Alternatives

- **All three on one read.** Not taken: d1. If he wants outposts in, the page keeps them and a dated block here sets their zone, anchor and memo words, which means a larger `G2` and `NFR-009` line, before Ready.
- **Three tickets, or two, each on its own read.** Not taken: d1. It costs a build per term, adds draws at the door and halves each read's signal.
- **The bishop pair alone.** Not taken. It is the likeliest term, but the rook term's cost is small and the read gets more signal with both.
- **Do not build.** Stated in § The plain case. A valid outcome, and it is his.
- **File sets gathered in the walk, no memo word.** Not taken: up to 16 more operations per call to save one read that the fold pays for.
- **File sets in the passer words' spare top bits.** Not taken: it saves one read and changes words `ABC-271`'s rows read, with a mask on the hot path. Held as a thought, not as the cut.
- **`kingExposure`'s cut in the build from the start.** Not taken: d6. It would put a speed gain inside the term's own read.
- **That cut as its own ticket first.** Not required. Open to the Orchestrator, since it is value-identical. Merged first, it lowers the base, so `G2` here reads a smaller denominator, and PR8 is then read on that `main`.
- **Rook terms per rook, not per file.** Not taken: it needs per-rook work after the memo for little. Doubling is rare, and mobility still reads it.
- **The pair by square colour.** Not taken: it needs a colour bit for a case only underpromotion makes.
- **An endgame half above the middlegame half, for the pair or the files.** Not taken: no rule on the records, and `ADR-0064` d3.
- **Rook values as a share of mobility, or `ROOK_MG`'s 20 for both.** Not taken: the first has no natural share, and the second loses the open and semi-open step `main` already draws.
- **`BISHOP_PAIR` at a flat half pawn.** The same number. Not taken as the words, because the premise rule says why, and it lands on the table's own step.
- **Values from another engine or a published figure.** Not taken: `ADR-0048`, and they were tuned on another table.
- **Fold the seventh-rank rule into the term.** Not taken: d2.
- **`G2` at 1.03 ×.** Not taken: d6. A correct build would be near a coin flip on it.
- **`G2` at 1.08 × or above.** Not taken: `ADR-0064` B6 held the whole evaluation to 1.05, and nothing here needs more.
- **A door per term.** Not taken: d1.
- **A bundle with E3b or E6.** Not taken: d8.
- **`evaluateWithoutMobility` turning the term off, to keep A4's row as written.** Not taken: the bound row reads the difference, so it would read mobility plus this term.
- **Re-pointing K2's two rows to the off door.** Not taken: they would stop reading the shipped path. A re-found fixture keeps it.
- **QE's freeze after the probe.** Not taken: d10. The patch would exist, and the freeze would be blind by word only.

## What would falsify this

| # | clause | what would falsify it | if it fires |
|---|---|---|---|
| F1 | d2–d5: the design as built | a seam, mirror, memo or door row red; K0 not reproduced | a defect, fixed before any cost bar |
| F2 | d6: cheap | K4 above 1.05 ×, or a clean run below depth 6 on K5 | STOP to Architect/Design: a defect check first. Then d6's cut if unspent, and one re-read under a PREREG. If the cut is spent, or on a second miss: not merged, and a miss under d14 (c). One cut and one re-read serve both halves. A void is not a miss |
| F3 | K3: safe | a mate-floor, zugzwang or `G1` row red | a defect check first. If real, NOT MET. Never a re-pin, a moved depth or a new value |
| F4 | d8: the read | C2′ NOT MET | not merged, not re-played, back to BA/PM, through CF1–CF10 and d11's table. d14 (c) applies if accepted |
| F5 | d13: the premise | the probe's rule 2, rule 3's cost stop, or rule 4 | `ABC-292` is not built. This ADR reads "accepted, not in force", or is withdrawn if not yet accepted. d14 (c) applies if accepted |
| F6 | d14 (a): the tool line | an identity-gate miss at the tip | read against d2's words. `evaluate` wrong is F1. The tracer wrong is a tool defect. No production line changes to fit the tool |
| F7 | d10: the order | a build commit with no freeze commit behind it | K1 (c) is not met to the letter, and QE says so. No reading makes it met. Whether the term may still merge is his |

## Consequences

- **Play:** trades of bishop for knight and rook placement can move. The start position stays 0 by symmetry. No read exists. The bars above are the first.
- **Records owed by BA/PM, after his answer:** `ABC-292`'s title, scope, K rows and the `G2` line at 1.05; a stated `NFR-008` line at ≤ +0.10 s; test note 1 pointing at d10; outposts' held page; `EPIC-011`'s rows. Size re-read at S–M. If he answers on questions 3 to 5, their lines go where each lives.
- **Owed by the Architect:** status and dated lines after his answer; the probe under its own task, after QE's freeze; K0 (c), K2's list, and `ADR-0071` D8's lines by dated line, before Ready.
- **Owed by the Orchestrator:** d10's check, before any build dispatch. The held windows.
- **Host.** Probe under 30 min by estimate, a build, timing 14 to 27 min, games 41 to 48 min, by `ABC-291`'s PREREG. Each stage is under 1 h.
- **Order.** E5, then E3b, then E6 stands, the Orchestrator's by D6's rule, with the owner told. No read waits. `main` is the read's base. If OQ-0074-2 opens a route for `ABC-289`, that read and this one order as `…40ef8351` says.
  *Dated 2026-11-08 (`arch-ABC-292-accept`; his word `…23d30c72`): OQ-0074-2 is answered (a). `ABC-289` closes NOT MET, so no route opens, and the clause above on it lapses. His stop ruling joins this order: after a miss here, E3b and E6 are not built without a new word from him (`ADR-0056` D6's dated line of this task). No read waits.*
- **Third pull.** A merge on its own read meets `ADR-0067`'s trigger, and asking stays a new call for him. A miss here is no miss on row E2.
- **Determinism (`ADR-0027`) and licence (`ADR-0048`):** integer terms, mirror-exact by construction. The rule is this project's own. Security: none.
- **File collisions:** `src/evaluate.ts` and `src/evaluate-params.ts`, one at a time with `ABC-272`, `ABC-290`, `ABC-293` and `ABC-294`. `src/search.ts`, `src/engine.ts` and `src/quiescence.ts` take the switch, so the door list is read on the build's base.
- **`ABC-291`'s kept branch** is unmerged, and nothing here depends on it. `pawnCacheDoubledIsolated`'s form is reused as a form, not as a merge.

### `UNKNOWN - verify`
- Every reading: whether any row holds, `G2`, `G6`, the firing share, the lane's cost, and the probe's wall time.
- Whether this term holds `zugzwang.001`. Whether row 1632 stays inside its budget.
- Whether a hand-valued term pays. These two terms' share of row E5's estimate. How far the rook term overlaps mobility.
- What the cut in d6 buys, and why `G2` reads at two levels.
- K2's list and the deep pins' new figures. A3's margin of −2 is my arithmetic, and PR11 reads it.
- Whether 50 pushes the engine into poor trades to keep a pair, or onto bishops it should give up. Reasoned as small, and unread.
- Whether `TUNE_DEEP` is green on `main` today.

## Rollback

- **Before the merge:** this ADR reads "accepted, not in force", or is withdrawn if not yet accepted. The dated lines of `arch-ABC-292` in `ADR-0056` and `ADR-0067` are read through it. No strike.
- **After the merge:** revert the one merge. The memo keeps its size. The doors and the tool line go with it, and every read after it is stale by C2′'s rule. If a fit has merged on top, revert that first (`ADR-0067` § Rollback).
