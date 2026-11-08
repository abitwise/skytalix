---
id: ABC-292
title: "E5, narrowed by ADR-0076: a bishop pair bonus and rooks on open and semi-open files, with hand values fixed by one stated rule and judged on their own C2′. Outposts are split off as ABC-308, held; per-piece mobility (a re-try of dropped ABC-207) is ABC-306; rook activity was fenced out of EPIC-010"
status: in-design
column: In Design
size: S–M
priority: P2
epic: EPIC-011
feature: —
adr: "ADR-0076, accepted by the owner 2026-11-08 (orch-2026-10-30a …23d30c72), in force only at this ticket's merge: form (b) on main's tapered evaluation. Two terms on one read, outposts split off d1; definitions d2; one rule and the hand values it gives d3; the pawn memo's file word, 576 KiB, d4; one switch and a test-only off-door pair d5; G2 ≤ 1.05 × with a 1.03 tripwire and a named cut d6; NFR-008 ≤ +0.10 s d7; intent GAIN d8; bars K0–K7 d9; the order before the build d10; the probe d13; the tool line and no second set of values d14. K0 (c), K2's list and the deep pins join it by a dated line before Ready (d10 step 5). Its § Status is the Architect's"
---

# ABC-292: the bishop pair and rook files (E5, narrowed; outposts and per-piece mobility split off)

> **`ADR-0076` ACCEPTED, IN FORCE ONLY AT THIS TICKET'S MERGE; NARROWED TO THE BISHOP PAIR AND THE ROOK FILES; OUTPOSTS SPLIT OFF AS `ABC-308`, HELD; A MISS HERE STOPS THE
> HAND-VALUED PATH; IN DESIGN, 2026-11-08, by BA/PM** (task `bapm-ABC-292-accept`, records only, at `main` `6eaeee01`; nothing run). Sources: the owner's "agree" (`orch-2026-10-30a`
> `…23d30c72`), and `ADR-0076` § Consequences, d10 and d14.
> - **Copied from the ADR, no new bar:** the title and scope narrowed by d1; d2's definitions and d3's table; K0–K7 word for word from d9, with K2's two `ABC-083` rows in its words;
>   `G2` ≤ 1.05 × with the 1.03 tripwire and the named cut (d6, d13 rule 3); `NFR-008` ≤ +0.10 s (d7); the probe's can and cannot lines; F1–F7; d14. This page's "the ADR's
>   ratio", "the ADR is owed" and outposts wording is out, and the old text is in git history. **If this page and the ADR disagree, the ADR holds.**
> - **The split rule fired** (d1): outposts leave as `ABC-308`, held, in `ABC-306`'s form. The bishop pair and the rook file terms stay together, on one read and one switch.
> - **The owner's stop ruling** (`…23d30c72`): **a miss on this ticket, any d14 (c) miss, is the stop for the hand-valued path.** `ABC-290` (E3b) and `ABC-293` (E6) are not built after it
>   without his new word. This is his ruling, not only the Architect's recommendation.
> - **Size M → S–M** (two terms, no new memo bytes, no new loop; § Size and priority). Priority stays P2. **Status and column read In Design,** as the board has since `b1227f2b`; that move was the
>   Orchestrator's.
> - **DoR 9/10, unchanged.** Row 10 stays open until d10 step 5: QE's freeze, then the probe, then K0 (c), K2's list and the deep pins by dated line.

> **FORM (b), HAND VALUES ON ITS OWN READ; THE HOLD LIFTS; SECOND IN THE ORDER; THE SPLIT RULE APPLIES, 2026-11-05, by BA/PM** (task `bapm-wait-lines-1105`, records
> only, at `main` `a38315bf`; nothing run). Sources: the owner's "3. wait" (`orch-2026-10-30a` `…b836b85c` item 3), `ADR-0067`'s dated block and `ADR-0056` D2's and D6's dated
> lines of `arch-owner-answers-1105`, `…ba8265e9`, `…2b3440cf` item 4, and the order the Orchestrator accepted (brief
> `bapm-wait-lines-1105`).
> - **The hold lifts.** The trigger, "the second pull merges or closes", fired when `ABC-301` closed NOT MET. The ADR is owed now.
> - **Form (a) is gone for this term.** `ADR-0056` D2's dated line supersedes "structure at 0, values from a pull". This page's form (a)
>   rows and its weights section are out; the old text is in git history.
> - **The form (b) list gains its `G2` line.** The ratio is the ADR's. This page sets none.
> - **The intent is GAIN,** by `ADR-0056` D6's dated line: evaluation rows fire at 100 ms. The NEUTRAL 43.0 option on this page is gone.
> - **Order:** E4b (`ABC-291`), then E5 without per-piece mobility (`ABC-292`), then E3b (`ABC-290`), then E6 (`ABC-293`). The order is the
>   Architect's recommendation, accepted by the Orchestrator (`ADR-0056` D6's reorder rule, with the owner told).
>   **This page is second.**
>   *2026-11-07 (`bapm-terms-after-291`; `…8cc32a89` § 2, `ADR-0056` D6's dated line of `arch-ABC-291-closed`, `…aab9afd1`): **E4b is spent, NOT MET. The order now reads E5 (`ABC-292`), then E3b (`ABC-290`), then E6 (`ABC-293`). This page is first of the three.** `ADR-0075` d11 (d) leaves this page where it stands, so nothing moved by rule. The order stays the Orchestrator's, with the owner told.*
> - **The split rule applies.** The order gives one term a different place, so per-piece mobility leaves this page as `ABC-306`, held. It is the
>   one term that has already lost on hand values, and it waits for a fit or its own case (`…ba8265e9`). The three left share a form and a
>   place in the order, so they stay on this page. If the ADR gives them different forms or orders, the rule fires again before Ready.
> - No bar is new. **DoR 9/10, unchanged: the ADR is owed. Backlog.** The board move is the Orchestrator's.

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog** (task `bapm-epic011-areas`, records only, at `main` `b274711c`;
> nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011` Phase 4,
> stub row E5 ("not cut: weights from the tuner; id at E2's merge" is superseded by the ruling).
> - **Hold:** after E2's second pull (the ruled order `ABC-271` → the second pull). The ADR is owed.
> - **Re-open trigger:** the second pull merges or closes.
> - **Split rule:** if the ADR gives the four terms different forms or orders, BA/PM splits this page per term
>   (E5a…E5d) before Ready. One page now, because one structure-at-0 landing would carry all four.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** every middlegame.
- **Pain, read on `main`** (`src/evaluate-params.ts`):
  - no bishop pair term, no open-file term ("open files are left to mobility"; only a rule of 20 on the seventh rank
    for the rook), no outposts;
  - *2026-11-05: mobility as one shared weight is `ABC-306`'s pain, not this page's.*
  - *2026-11-08 (`bapm-ABC-292-accept`; `ADR-0076` d1): outposts are `ABC-308`'s pain, not this page's. `MATERIAL` reads N 325, B 325, so no term sees two bishops (`ADR-0076` § Context).*
- **History:** `ABC-207` (mobility per piece with hand weights) lost and was dropped (`EPIC-008`). The three terms here have never been tried
  (`…ba8265e9`).
- **Value:** `ADR-0056` D2 row E5 estimates **+30–80 Elo** for the whole row, per-piece mobility included (an estimate, [B] 7.4 / 8.0). Not a
  reading. This page's share of it is `UNKNOWN - verify`.

## Where the values come from (hand values, on the wait)

- **One stated rule, `ADR-0076` d3,** fixed before any row or game was read, and accepted by the owner (`…23d30c72`). Nothing is adjusted after a
  result is seen. If an anchor moves before the build, these numbers stay. The rule is this project's own (`ABC-215`, `ADR-0048`), and `zugzwang.001`
  played no part in it (`ADR-0076` § Blindness to `zugzwang.001`).
- **Not from a pull.** Tuning waits: no third fit and no date (`ADR-0067`'s dated block of `arch-owner-answers-1105`).
- **Its own read.** If this term merges on its own read, or inside a bundle (`…0f1ab02e` item 2), a third pull may be asked for. Asking is not
  a yes.
- **The third-pull door, without per-piece mobility:** *2026-11-05 (`bapm-ABC-291-lines`; `ADR-0075` d11 (c), accepted, in force at `ABC-291`'s merge; `ADR-0067`'s dated line of `arch-ABC-291`): **this page counts.** His table
  names "E3b, E4b, E5 or E6", and "E5" names the row. These three terms are that row, split by `ABC-207`'s loss and not by the row. All three are in `ADR-0056` D2's row E5 from 2026-11-01 and on this page
  from `181da9e3` (2026-11-04, 13:34Z), before `dd88560f` (23:58Z that day), so test 1 holds. If the three split, each part that merges counts on its own: the four tests read on the part, and only merged
  parts enter the free set. Test 4 is unchanged: one door, one fit. This is the Architect's reading, open to overruling at any third-pull call (`…c1623ae7`).*
  *2026-11-07 (`bapm-terms-after-291`; `ADR-0075`'s dated block of `arch-ABC-291-closed`, `…8cc32a89` § 1, `…aab9afd1`, `ADR-0067`'s dated line of `arch-ABC-291-closed`): **"in force at `ABC-291`'s merge" has no merge left to wait for,** and `ADR-0075` stays accepted, not in force. **d11 (c) stands, not struck, by the Orchestrator's ruling, so this page still counts.** It stays open to overruling at any third-pull call. E4b has left the door: it did not merge and cannot, so the door rests on E5, E3b and E6. Test 4 is unchanged, and asking is still not a yes.*
  *2026-11-08 (`bapm-ABC-292-accept`; `ADR-0076` d14 (b), `…23d30c72`): **the three split, so the parts count, each merged part on its own.** This page's two terms count if they merge. Outposts
  (`ABC-308`) count only if they merge one day. Test 4 is unchanged: one door, one fit. The reading stays open to overruling at any third-pull call. **A lone pass reads "keep this term", and
  no more** (the owner's yes to the ADR's question 5): it lets a third pull be asked for, it is no reason to say yes, and the ask carries the odds. With all three of E5, E3b and E6 worth nothing,
  at least one passes 87.5 % of the time; exactly one pass is 37.5 % likely at worth nothing against 23 % at +10 Elo (`ADR-0076` § The owner's questions 5, C2′ alone, upper bounds).*
- **Cost** (`…ba8265e9`): the bishop pair and the rook files look cheap; outposts cost per call.
  *2026-11-08 (`bapm-ABC-292-accept`; `ADR-0076` d1, d6): outposts left this page for that cost. The two terms here need no new memo bytes and no new loop; their price is § NFR triggers.*
- **The shared mobility weight stays at its rule value** (`…2b3440cf`). `MOBILITY_CAP` stays fixed.
- **If he ever says yes to a third pull,** this term may enter its free set~~, and each new export is owed to that pull's emitter change
  (`…6ccd8243` item 3)~~. *2026-11-05 (`bapm-ABC-291-lines`): **superseded.** `ADR-0075`, accepted, in force at `ABC-291`'s merge, moves the tool line from a pull to the term's merge. d11 (a) settles it for
  `ABC-291`. **This term's ADR follows d12's pattern,** in its order: definitions; one rule built on `main`'s own table, fixed before any row and blind to `zugzwang.001`; the memo or per-call seam; one
  switch and an off-door pair; a `G2` ratio with its reason and its blind spot; a probe with rows, a sealed form, and a line for what it can and cannot change; K rows reading the term's own part; CF's
  table filled; the tool line at the merge; no second set after a miss. It sets its own ratio, and d12 binds none of its values. "No second set" binds it only if he accepts that in this term's own ADR
  (`…c1623ae7`). If E2 closes for good, no tool line is owed by any later term.*
  *2026-11-07 (`bapm-terms-after-291`; `ADR-0075`'s dated block of `arch-ABC-291-closed`, `…8cc32a89` § 1, `…aab9afd1`): **"in force at `ABC-291`'s merge" has no merge left to wait for.** `ABC-291` is NOT MET, and `ADR-0075` stays accepted, not in force. **This line stands, not struck, by the Orchestrator's ruling:** d11 (a) and d12 are not tree lines, so the emitter line stays superseded and this term's ADR still follows d12's pattern. `ABC-291` landed no tool line, so nothing is owed from it, and this term's tool line is its own, at its own merge. "No second set" still binds this term only if he accepts that in this term's own ADR.*
  *2026-11-08 (`bapm-ABC-292-accept`; `ADR-0076` d14 (a) and (c), `…23d30c72`): **this term's ADR is `ADR-0076`, and it followed d12's pattern.** Its tool line lands with the term, at its merge
  (§ Scope 5). **He accepted d14 (c): no second set of values after a miss on this term** (§ Acceptance criteria).*

## Scope

`ADR-0076` governs each line. All of it reads the board at the node; none of it reads attacks, pins, or whose move it is (d2). "Own" and "enemy" are from the piece's side. A pawn
"on a file" stands on ranks 2 to 7, the set `pawnStructure` reads.

1. **The bishop pair** (d2): the side has two or more bishops. It counts once, however many. Square colours are not read. A third bishop adds nothing.
2. **Rooks on open and semi-open files** (d2):
   - **Open:** a file holds at least one of the side's rooks, and no pawn of either colour. It counts once per file, however many of the side's rooks stand on it.
   - **Semi-open:** a file holds at least one of the side's rooks, none of the side's pawns, and at least one enemy pawn. It counts once per file.
   - A file is open, semi-open or neither, never two. Doubled rooks earn once. A rook on the seventh on an open file earns 20 from `ROOK_MG` and 20 here. With no pawns on the board every
     file is open, so in `K R` against `K` the term is a constant 20. Queens are not read.
   - **The seventh-rank rule is kept, not folded.** The comment "Open files are left to mobility" on `ROOK_MG` is no longer true at the merge, and the build changes it.

   **The values (d3), by one rule:** a file gives a rook what it costs a king (`ROOK_OPEN_FILE`[h] = `KING_FILE_OPEN`[h], `ROOK_SEMI_OPEN_FILE`[h] = `KING_FILE_HALF_OPEN`[h]); a pair earns
   a minor's premium once more on each bishop (`BISHOP_PAIR`[h] = 2 × (`MATERIAL`[h][BISHOP] − 3 × `MATERIAL`[h][PAWN])).

   | export | mg | eg |
   |---|---:|---:|
   | `BISHOP_PAIR` | 50 | 50 |
   | `ROOK_OPEN_FILE` | 20 | 20 |
   | `ROOK_SEMI_OPEN_FILE` | 10 | 10 |

   - **What "tapered" means here** (d3): "tapered" on this page reads "a pair that enters the blend", as in `ADR-0075` d2. The halves come out equal, by the rule, so the blend has nothing to
     drop. Largest swing: 50 + 2 × 20 = 90 cp a side with two rooks.
3. **The seam** (d4): one new `Int32Array` memo word holds both sides' file sets, white in bits 0–7, black in bits 8–15; `doubled` and `isolated` share one word, in `ADR-0075` d5's form. A slot
   stays 36 bytes and the memo 589 824 bytes (576 KiB); a hit still reads seven words. The walk's `if (type >= QUEEN)` gains branches for rooks and bishops: no new loop, no new pass, no
   allocation. After the memo, per side, open and semi-open are counted over 8 bits; the bishop test is one compare. Three new exports in `src/evaluate-params.ts`, data only, each comment
   carrying its rule.
4. **Form (b)** (d5; `ADR-0026` d10, in `ADR-0064` d7's form): one switch, `pieceTerms`, in `src/search.ts`'s `Switches`, `src/engine.ts`'s `Heuristics` and quiescence's rules record, on in
   `search()` and `chooseMove` only; the test-only exports `searchWithoutPieceTerms`, `chooseMoveWithoutPieceTerms` and `evaluateAtPhaseWithoutPieceTerms`; the test-only seam
   `pieceTermsForTest(position)`, with `pawnStructureForTest` gaining the file word. Every older door turns it off, except `evaluateWithoutMobility` and `evaluateWithoutPawnCache`, which keep it
   on (`ABC-083` A4's bound row must stay the mobility term). `QUIET_RULES` gains `pieceTerms: true` from the start, and `QUIET_RULES_NAME` changes with it.
5. **The tool line, at this term's merge** (d14 (a), read by K7): `tools/tune` gains the three terms' counts in the tracer and the three exports in the emitter, **traced and held, not free**.
   17 → 20 exports. No fit, no emission to `src/`, and `src/` gains no tracing code. If E2 closes for good, no tool line is owed.

## Out of scope

- Mobility per piece type (`ABC-306`), an early-queen term (`ABC-207`'s other half), threats (`ABC-293`), king attack (`ABC-290`), tuning itself.
- *2026-11-08 (`bapm-ABC-292-accept`; `ADR-0076` d1, § Alternatives):* **outposts (`ABC-308`, held).** Also not taken by the ADR: the pair by square colour; an endgame half above the
  middlegame half; rook terms per rook rather than per file; folding the seventh-rank rule.
- *2026-11-08:* **d6's named cut as its own value-identical ticket.** Not this page's: its order is the Orchestrator's (d6). Here it is held, not spent, and used only under d13 rule 3.

## Acceptance criteria

`ADR-0076` d9 fixes the bars below, form (b) by `ADR-0056` D6's dated line. No bar is new, and none is loosened after Ready. Each is written so that an exact build can meet it.

- **Values:** d3's table, fixed before any row is read. K1 (e) reads it.
- **Intent: GAIN, ≥ 50.0 of 100** (d8). It is named before any score and never re-classed after one.
- **`G3`'s relation rows stay green, `ABC-083` A4 (mobility within ± 100 cp) included.** That bound row stands. K2 below names the two `ABC-083` rows that keep their words and their
  relation on a re-found fixture.

**K0–K7, word for word from d9.** "d" numbers are `ADR-0076`'s. "Here", "this decision" and "this ADR" name it, not this page.

- **K0, the doors:**
  - (a) `chooseMoveWithoutPieceTerms` and `searchWithoutPieceTerms` are node-equal to the merge-base's `chooseMove` and `search()`: nodes, score and move, on kiwipete d8 and d9,
    position-6 d8, d9 and d10, and `search()` d8 on both;
  - (b) every older door reads its pre-ticket counts;
  - (c) the head reads the probe's P0 counts. If `main`'s `src/` has moved, the Engineer applies the probe's patch to the new base, re-reads, and puts both in the PR. A re-derived count is a
    dated line here, never a moved bar.
- **K1, units (default lane, no search, in an existing test file):**
  - (a) the mirror, `Object.is`: `G3` + `TAPER_MIRROR_POSITIONS` + ≥ 12 new positions from QE's freeze, 0 mismatches;
  - (b) `evaluateAtPhaseWithoutPieceTerms` and `evaluateWithoutTaper` are `Object.is`-equal to the pre-ticket entries over the frozen corpora;
  - (c) **seam rows, by arithmetic, on fixtures QE freezes under d10:** at least one per definition per colour. For the two rook definitions, one per edge file. They include: one bishop;
    two; three; a same-colour pair; a rook file failing each clause alone; doubled rooks; a seventh-rank rook on an open file; a board with no pawns;
  - (d) **the hot path:** `evaluate` minus the off-door evaluation equals the seam's white minus black, signed for the side to move, exactly. Equal halves leave no tolerance. A second
    row, inside `withParametersForTest` at unequal test halves, reads the blend in `ADR-0070` d4's own-phase form;
  - (e) the rule: each export equals d3's table, rebuilt in the row from the anchors' values at this ADR's date;
  - (f) `ABC-274` A9's bound reads the three pairs: 8 × the larger file term + `BISHOP_PAIR`, per side;
  - (g) the memo: a hit returns what a fresh `pawnStructure` returns, file word and summed word included, on a forced collision too, and on an on-then-off read of one slot;
  - (h) **source rows, written for `ADR-0064` d7's form from the start:**
    - `pieceTermsForTest` is called from test files only;
    - `evaluateAtPhaseWithoutPieceTerms`'s only callers outside test files are the three off branches, two in `src/search.ts` and one in `src/quiescence.ts`, and no shipped search takes one;
    - `pieceTerms: true` stands in code exactly twice in `src/search.ts` and twice in `src/engine.ts`, in each `RULES_PIECE_TERMS` and in `search()`'s or `chooseMove`'s own record, and in no
      other non-test file under `src/`. Under `tools/`, only `QUIET_RULES` and its name carry it.
- **K2, the re-pins.** The list is `UNKNOWN - verify` until PR11, and joins this decision by a dated line before Ready. It binds at the probe's tree and is re-derived on a later base by a
  dated line. A re-pin outside it is a defect. **Known now, by reading, each to be confirmed by PR11:**
  - **Two rows no exact build can hold as written. Both are lost fixture properties, not re-pins.** They go to QE's freeze under d10, so the re-found fixtures are not the Engineer's.
    - `src/evaluate.king-mobility.test.ts` `ABC-083` A4, "white, with substantially more moves at equal material…". `MOBILE_WHITE` puts white's rook on the open d-file and black's behind its
      own h7, and the row asserts `evaluateWithoutMobility` is 0. With d5's line that reads 20. The relation and the ± 100 bound row do not change. Only the premise "every term but
      mobility cancels" is lost.
    - The same file's `ABC-083` A3 (b), "at EQUAL material, shelter equal, at phase 24". `F_HALF_OPEN_E5_24` has white's rook on f1, so the arm that opens the f-file also earns the
      semi-open term. On `main` the margin is about −2 by the Architect's arithmetic. **Any semi-open value of 2 or more turns it red, so this is no fault of d3's rule.** The re-found
      fixture must keep "red with the term zeroed". The twin row stays green.
    - *2026-11-08 (`bapm-ABC-292-accept`; `…23d30c72`):* **the owner accepted this reading with the ADR.** Both rows keep their words and the rule they check, on fixtures QE re-finds in
      its freeze. No bar moved.
  - **The deep pins:** `ADR-0076` § The pins this term moves (`ABC-282` A0-3's three re-pins, `ABC-282` A0-1 and A0-2's re-points, `ABC-303`'s two depth-8 count rows re-pointed, and D5's
    cp 475 row read in PR11). New figures are `UNKNOWN - verify` until PR11, then a dated line in `ADR-0071` D8 and in K2, before Ready.
  - **The classes `ABC-291` showed** (`…cb124720`, 64 rows): door lists, the switch's call sites, `futilityNode`'s arity 7 → 8, older-door re-points, value rows, a lost `ABC-282` A2 fixture.
    The rows will differ, because a piece term reaches rows a pawn term did not. No count carries from that tree.
- **K3, safety (`ADR-0064` d7's rows):** mate floor 0 violations, door depth 4 → head depth 5 and depth 5 → depth 5 on the 287; zugzwang **7 / 7** at recorded depths with `zugzwang.001`
  among them; `G1` no NEWLY-MISSED line. All read all-on. No depth moves, and no expected result is rewritten. Row 1632's 16 838 of 20 534 nodes is the watch; PR7 reports it before the build.
- **K4, `G2` ≤ 1.05 ×** (d6). The endgame report set is reported beside it.
  - **The 1.03 tripwire** (d13 rule 3, on the probe's unrounded R): `cand` ≤ 1.03, the build carries no cut. `cand` above 1.03 and `cut` ≤ 1.05, the build carries the cut, the cut is spent, and
    K4 on the build is F2's one re-read. `cut` above 1.05, the premise is NOT MET for cost: this ticket is not built, it comes back to BA/PM, and the owner is told.
  - **The named cut** (d6, F2's one, value-identical): `kingExposure` reads own and enemy from the memo's file word, and the 6-rank scan goes. Held, not spent, so no speed gain sits inside
    this term's own C2′ unless rule 3 spends it, and then the PREREG discloses it.
  - **Why 1.05 and not `ADR-0075`'s 1.03** (d6): this term works in the walk, and one session's level moves R by about ± 0.018, so a correct build at a true 1.03 would miss a 1.03 bar about
    half the time. It is a cost bar, and it stays one. The ratio is the ADR's, as this page said it would be, and the owner saw it named as looser than 1.03 (`…23d30c72`).
- **K5, `G6` under `Q-3K-4` (b):** every run at depth ≥ 6, depth 7 a WARN, "≥ base" reported, not graded.
- **K6, the read:** d8: C2′ at 100 ms against the merge-base, 100 of 100 complete, 0 candidate faults, 0 losses on time. Then S′ at the E in force (1 810 today), S-4. Then the Levels deep
  lane. Each stage under its own hold, each under 1 h: timing (K4, K5, `NFR-008`), then the games. Not a bundle.
- **K7, the tool line** (d14 (a)): `TUNE_DEEP` green at the tip, its count reported.
- **Reports, not bars:** drift at depth 5, reach at 47 000, PR10's figures, `NFR-008`'s parts.

- **What a pass means (d12):** "not seen worse", not "proven better". By `ADR-0056`'s C2′ table a term truly worth +20 Elo passes 79 % of the time, +10 passes 66 %, 0 passes 50 %, −10 passes
  34 %, and −20 passes 21 %. The term's Elo stays unknown, and the score is not added to any forecast. This page's share of row E5's +30–80 is `UNKNOWN - verify`.

### The premise probe (d13): written, not run

- **It runs on the host after QE's freeze (d10 step 3),** once, under the host lock, on one core, under its own task (the Architect's). It plays no games. PR8 and PR10's lane read need the
  owner's word that the host is held. Its rows are PR1–PR11, sealed in a `decision` note before any measured run. Under 30 min by estimate, `UNKNOWN - verify`.
- **It can change:** K0 (c)'s counts; K2's list and the deep pins' new figures; d6's and d7's forecasts, replaced by readings; whether the cut is in the build; and whether this ticket is built at all.
- **It cannot change:** d2's definitions (except by rule 1's STOP, back to him), d3's rule or any value, d4's seam, d6's ratio, d8's intent, any bar, or the term order. It cannot turn a miss into a
  pass, and it cannot be re-run after one.
- **Its rule 2, rule 3's cost stop or rule 4 fires** (a real miss on PR5, PR6 or PR7; `cut` above 1.05; PR9 below 5.0 %): this ticket is not built and comes back to BA/PM. d14 (c) applies, and so
  does the owner's stop ruling below.

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | d2–d5: a seam, mirror, memo or door row red; K0 not reproduced | a defect, fixed before any cost bar |
| F2 | K4 above 1.05 ×, or a clean run below depth 6 on K5 | STOP to Architect/Design: a defect check first. Then d6's cut if unspent, and one re-read under a PREREG. If the cut is spent, or on a second miss: not merged, and a miss under d14 (c). One cut and one re-read serve both halves. A void is not a miss |
| F3 | K3: a mate-floor, zugzwang or `G1` row red | a defect check first. If real, NOT MET. Never a re-pin, a moved depth or a new value |
| F4 | C2′ NOT MET | not merged, not re-played, back to BA/PM, through CF1–CF10 and d11's table. d14 (c) applies |
| F5 | the probe's rule 2, rule 3's cost stop, or rule 4 | this ticket is not built. `ADR-0076` reads "accepted, not in force". d14 (c) applies |
| F6 | d14 (a): an identity-gate miss at the tip | read against d2's words. `evaluate` wrong is F1. The tracer wrong is a tool defect. No production line changes to fit the tool |
| F7 | d10: a build commit with no freeze commit behind it | K1 (c) is not met to the letter, and QE says so. No reading makes it met. Whether the term may still merge is his |

- **A candidate fault in the read:** CF1–CF10 reach this read, by the owner's word (`…0f1ab02e` item 1). ~~The form QE copies for a single-part read
  is `arch-owner-answers-1105b`'s, in flight.~~ *2026-11-05 (`bapm-pointers-1105`): **settled.** The form, alone or in a bundle, is `ADR-0056` D5's dated block of
  `arch-owner-answers-1105b` (`…65557abd`): QE copies its Reach line and CF1–CF10 unaltered, then its table, filled from this page and the ADR. The block governs. No bar moves.*
  *2026-11-08 (`bapm-ABC-292-accept`): `ADR-0076` d11 is that table, filled for this ticket ("50.0" GAIN; "B6" reads C2′'s miss line; CF3's "no form … moves" reads d2–d5 and every value of
  the three exports; "Tables 1 and 2" reads K0–K5 and K7; "§ 6's order" reads C2′, S′, Levels; "S1, S2 and R7" read K0 (a), (b), (c)). It adds no bar. A defect fix that restores d2 or d3 is not a miss.*
- ~~**Recommended to the ADR, not a rule on any record** (`…ba8265e9`): no second set of values after a miss. New numbers chosen after seeing a
  loss are tuning on play by hand.~~ *2026-11-08 (`bapm-ABC-292-accept`): superseded by the line below, which he accepted.*
- **No second set of values after a miss** (`ADR-0076` d14 (c)): a rule for this term, on his acceptance (`…23d30c72`, the ADR's question 2).
  - After a miss, `BISHOP_PAIR`, `ROOK_OPEN_FILE` and `ROOK_SEMI_OPEN_FILE` do not get new numbers by hand.
  - **A miss is:** a real safety red (F3), C2′ below the bar on a clean read, a CF2 or CF8 NOT MET, a second miss on F2's K4 or K5 half, or the probe's rule 2, rule 3's cost stop, or rule 4.
  - **Not a miss:** a defect fix that restores d2 or d3. A change of values alone is not a changed form; a new form needs a new definition, a reason drawn from no missed read, its own ADR and
    his acceptance.
  - It does not bar outposts (`ABC-308`), which have not been read.
- **The owner's stop ruling** (`…23d30c72`): **a miss here, any d14 (c) miss above, is the stop for the hand-valued path.** `ABC-290` (E3b) and `ABC-293` (E6) are not built after it without his
  new word. How it sits beside d14 (c)'s "a miss here leaves `ABC-290` where it stands" is the Architect's line (`arch-ABC-292-accept`). On these pages his ruling governs: those pages
  stand, and their builds wait for his word.

## NFR triggers

- **`NFR-001` / `G2`:** K4, ≤ 1.05 ×, with the probe's 1.03 tripwire and the named cut (d6, d13 rule 3). **`NFR-005`:** K5.
- **`NFR-008`** (≤ 10 s): **≤ +0.10 s on the lane for this ticket** (d7, the Orchestrator's line `…aab9afd1`; no figure above it is proposed, and one would move a bar). K1's rows are units
  with no search and go in an existing test file: **no new default-lane file, by rule** (d7). Expected +0.03 to +0.14 s, midpoint about +0.085 s, an estimate, `UNKNOWN - verify`; a correct build
  may read over about two times in five. If it reads over, `NFR-008` is UNRESOLVED by `…a49d69d7` § 5's form, not a defect. **Games first:** by his yes to the ADR's question 4 (`…23d30c72`), the
  games may still go first, sealed in the read's PREREG before any figure exists, and the budget is decided only if the term passes. The figure stays ≤ +0.10 s.
- **`NFR-009`:** +0 bytes. The memo stays 589 824 bytes (576 KiB); `src/evaluate.pawns.test.ts`'s and `src/transposition.test.ts`'s byte rows do not move. One small count table, if the build
  uses one, is 256 bytes at load. ~~No new table expected.~~

## Test notes

1. QE freezes the seam fixtures and the (b) rows before the build.
   *2026-11-07 (`bapm-terms-after-291`; `…aab9afd1`, `…32c023cc`, `ADR-0075`'s dated block of `arch-ABC-291-closed`): **the freeze is a gate before the build.** This term's build waits for QE's freeze of the seam fixtures and the (b) rows, and the Orchestrator checks this ticket for it before any build dispatch. `ABC-291`'s freeze came after its build (K1 (c)), the fourth such miss. The gate is on the dispatch: it adds no bar and no DoR row, and this note's words stand.*
   *2026-11-08 (`bapm-ABC-292-accept`; `ADR-0076` d10, accepted `…23d30c72`): **the order is `ADR-0076` d10, and the freeze comes before the probe as well as the build.** Step 3,
   `qe-ABC-292-freeze`, works from d2, d3 and the K rows' words alone, with no code in hand: the seam fixtures with values worked by hand, ≥ 12 mirror positions, the (b) sets by name and commit,
   and K2's two re-found fixtures, in a sealed `decision` note carrying each fixture file's sha256, merged to `main`. No row is written to `src/`. Step 4 is the probe, whose PREREG commit descends
   from the freeze's; step 5, K0 (c), K2's list and the deep pins by dated line, then DoR 10/10; step 6, the Orchestrator's check before any build dispatch, `git merge-base --is-ancestor <freeze
   commit> main` and the freeze note's id in the brief (no id, no dispatch); step 7, the build, its first commit a descendant of the freeze commit; step 8, QE's stage 0 re-reads that ancestry and
   the sha256s. A missed order is F7. The freeze does not hold K0 (c) or K2, which need a tree. A fixture QE finds wrong before the build is a dated addendum to its own note; after the build it is
   F1's defect check, and no fixture changes to fit code. This note's words stand, and it adds no bar and no DoR row.*
2. UAT is owed (production lines); the QE verdict signs it.

## Size and priority

- ~~**Size: M** (three terms; not re-estimated after the split; the rule above stands).~~ **Size: S–M** *2026-11-08 (`bapm-ABC-292-accept`; `ADR-0076` § Consequences,
  d1, d4): re-read after the split. Two terms on one read and one switch, no new memo bytes, no new loop, three new exports; the bulk is the doors and the re-pins, which on `ABC-291` were 64 rows
  (`…cb124720`), and about 55 new rows here by d7's estimate. One SE hop after the freeze and the probe, and a QE hop with its own held window ("some 60 test rows moved, if `ABC-291` is a guide", § The plain case).* **Priority: P2**, the second-largest evaluation
  estimate after E3.

## Dependencies

- ~~**The ADR,** then the owner's acceptance. DoR row 10.~~ *2026-11-08 (`bapm-ABC-292-accept`): **`ADR-0076`, accepted by the owner (`…23d30c72`), in force only at this
  ticket's merge.*** ~~Its probe runs on the host after `ABC-282`'s A4; it need not wait for `ABC-303` or `ABC-289`, only for the host (`ADR-0056` D6's dated line).~~ *Its probe runs after
  QE's freeze (test note 1, d10), on a held host.*
- **The rest of d10's order before the build** (test note 1): QE's freeze, the probe, K0 (c), K2's list and the deep pins by the Architect's dated line, DoR 10/10, the Orchestrator's check, then
  the build. DoR row 10. The held windows are the Orchestrator's to ask and the owner's to give.
- **Outposts are `ABC-308`, held** (`ADR-0076` d1). Nothing here waits on it, and it waits on nothing here.
- **The stop** (§ Acceptance criteria): a miss on this ticket holds the builds of `ABC-290` and `ABC-293` for the owner's new word.
- **Second of the four, after `ABC-291`'s read.**
  *2026-11-07 (`bapm-terms-after-291`; `…8cc32a89` § 2, `…aab9afd1`): **that read is played, NOT MET, so this page is first of the three left and no read waits.** The read's base is `main` as it stands. This term's ADR is next, after these pages merge, unless the owner redirects. QE's freeze goes before its build (test note 1).*
- **The read queues.** A value-changing merge stales the read after it, so this term's C2′ follows `ABC-303` and `ABC-289`.
  *2026-11-06 (`bapm-lines-1106b`; `…7c297147` § 4 item 2, `…40ef8351`): **met.** `ABC-303` merged at `434fa171`, and `ABC-289`'s recorded outcome, NOT MET on an exact build with nothing merged, meets it. This term's place in the order does not change.*
- **`ABC-301` closed NOT MET:** the trigger is met. *2026-11-05: "E2's second pull merged or closed" is gone as a wait.*
- **One at a time on `src/evaluate.ts` / `src/evaluate-params.ts`** with `ABC-272`, `ABC-290`, `ABC-291`, `ABC-293`, `ABC-294`.
  *2026-11-08 (`bapm-ABC-292-accept`; `ADR-0076` § Consequences): `src/search.ts`, `src/engine.ts` and `src/quiescence.ts` take the switch, so the door list is read on the build's base.
  `ABC-291`'s kept branch is unmerged, and nothing here depends on it.*

## `UNKNOWN - verify`

`ADR-0076` § `UNKNOWN - verify` is the list. In short:

- Every reading: whether any row holds, `G2`, `G6`, the firing share, the lane's cost, and the probe's wall time.
- Whether this term holds `zugzwang.001`. Whether row 1632 stays inside its budget.
- Whether a hand-valued term pays. These two terms' share of row E5's estimate. How far the rook term overlaps mobility.
- What d6's cut buys, and why `G2` reads at two levels.
- K2's list and the deep pins' new figures. A3 (b)'s margin of −2 is the Architect's arithmetic, and PR11 reads it.
- Whether 50 pushes the engine into poor trades to keep a pair, or onto bishops it should give up. Reasoned as small, and unread.
- Whether `TUNE_DEEP` is green on `main` today.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ the ~~three~~ two absent terms, read on `main`; the value is an estimate *(2026-11-08: outposts are `ABC-308`'s)* |
| 2 | scope and out-of-scope | ✅ scope 1–~~4~~ 5 *(2026-11-08, `bapm-ABC-292-accept`: `ADR-0076` d1–d5, d14 (a); outposts out)* |
| 3 | INVEST | ✅ ~~M~~ S–M; the split rule applied once and named again *(2026-11-08: and fired again by `ADR-0076` d1, outposts to `ABC-308`)* |
| 4 | testable, measurable acceptance | ✅ form (b): ~~seam rows, `G3`, safety rows, `G2` at the ADR's ratio, `G6`, C2′ ≥ 50.0. Counts owed with the ADR~~ *2026-11-08 (`bapm-ABC-292-accept`):* K0–K7 from `ADR-0076` d9, `G2` ≤ 1.05 ×, C2′ GAIN ≥ 50.0. K0 (c)'s counts and K2's list are row 10's |
| 5 | dependencies known | ✅ ~~the ADR~~ `ADR-0076`, accepted *(2026-11-08)*; d10's order, the freeze first *(2026-11-08)*; second of the four *(2026-11-07, `bapm-terms-after-291`: first of the three left, `ABC-291` NOT MET)*; its read after `ABC-303` and `ABC-289` *(met 2026-11-06, `bapm-lines-1106b`; `…7c297147` § 4)*; the shared files; the stop on a miss *(2026-11-08, `…23d30c72`)* |
| 6 | NFR triggers with targets | ✅ `G2` ~~at the ADR's ratio~~ ≤ 1.05 ×, tripwire 1.03; `NFR-005` `G6`; `NFR-008` ≤ 10 s, ≤ +0.10 s on the lane; `NFR-009` +0 bytes *(2026-11-08)* |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ ~~M~~ S–M *(2026-11-08)* |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ ~~**the ADR is owed**~~ *2026-11-08 (`bapm-ABC-292-accept`): `ADR-0076` is accepted.* **d10 steps 3 to 5 are owed:** QE's freeze, the probe, then K0 (c), K2's list and the deep pins by the Architect's dated line |

~~**DoR 9/10. Backlog.**~~ **DoR 9/10. In Design** *(2026-11-08, `bapm-ABC-292-accept`)*. Row 10 closes at d10 step 5, not before. The board move is the Orchestrator's.
