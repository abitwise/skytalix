---
id: 20260919T121000Z-qe-e2e-decision-pass-on-the-eight-criteria-with-the-three-readings-ruled-and-four-gaps-named-not-fixed-6e1f9c43
kind: decision
by: qe-e2e
at: 2026-09-19T12:10:00Z
verified_by:
confidence: high
refs:
  - ABC-034
  - ABC-034/A1
  - ABC-034/A4
  - ABC-034/A7
  - ABC-034/A8
  - ABC-033
  - ABC-032
  - ADR-0004
  - src/rejection.ts
  - src/rejection.test.ts
  - src/move-input.ts
  - plans/tickets/ABC-034-rejections-that-teach.md
supersedes:
---

# QE verdict on `ABC-034` at `aa9e49f`: **PASS** — eight criteria met (three under a reading ruled below, none silently), four gaps named for the next hops, nothing fixed, nothing softened

**This is not a stamp.** Hand-authored `decision`; `human_admission` is `off`, no `finding` is
admissible, and this is QE's recorded verdict per `AGENTS.md § QE validation authority` — the
`In Review` exit's input, not a merge and not an acceptance. Security/NFR's hop is still owed and
the ticket's own threshold fired for it (below).

## The verdict, and what it rests on

- Gates: lint / typecheck / build / unit all green at the tip, **42 / 1291 / 0**, integrity `No
  findings.`, `PERFT_DEEP=1` 32/32 (sibling `observation`).
- Every criterion `A1`–`A8` has at least one mutant that kills it and the row that dies is named
  (sibling `observation`). The classifier is what the ticket asked for: a set operation asked of
  the readers, and a heuristic-shaped build (Mo) dies on `A2`.
- All seven sentences plus `A8`'s two reach the frame's message region whole with hidden count 0
  through the real `assembleFrame` — in the suite (unicode, white-bottom) and re-probed in ascii
  and black-bottom, 44 of 44 (sibling `observation` on probes). `ABC-107`'s overflow pin is intact.
- The gaps below are TEST gaps, not product defects: on the delivered build every probe produced
  the sentence the ticket's table predicts. **A FAIL would need a criterion as written to be
  falsified on the build, and none is.** The one criterion whose LETTER is not met (`A7`) is not
  met by the ticket's own design, which is ruled, not excused, below.

## Ruling 1 — `A1`: the named FEN contains NO pinned piece; the Engineer's reading is the only buildable one

`rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP1BP/RNBQK1NR w KQkq - 1 4`: the queen on h4 attacks e1 along
h4–g3–f2–e1 with g3 and f2 EMPTY. Measured: `isInCheck` = true, `legalMoves` = **[e1f1] only**, 20
pseudo-legal moves. **Nothing stands between the queen and the king, so nothing is pinned** — the
criterion's own premise, *"a move of THAT pinned piece"*, has no referent on the named FEN. As
written, `A1`'s first disjunct is unsatisfiable; its second (*"or any position with an absolutely
pinned piece"*) is what the build satisfies, on `4r1k1/8/8/8/8/8/4N3/4K3 w` (rook e8 → knight e2 →
king e1, not in check): all four inputs → `own-king-exposed` → *exposes your king*. On the named FEN
the ticket's own computation table forces `must-address-check` (= the difference AND `isInCheck`),
and the build asserts exactly that with the sentence naming the king. **`A1` PASSES under the
reading; the reading was the only one that does not contradict the table on the same page.** The
FEN label is a lying label of the kind test note 4 exists for — **BA/PM should replace it on the
ticket page** (the pin fixture above is a candidate); no code or test moves when they do.

## Ruling 2 — `A7`: the LETTER is not met, by one call site of +10/−11, and the ticket's `## Scope` requires that call site

As written, *"`git diff --numstat` shows this ticket's module and test file(s) and nothing else
under `src/`"* is falsified by `src/move-input.ts` 10/11. But the same page's `## Scope` says the
messages *"travel as `PromptOutcome.rejected.messages`"* and its `## Dependencies` says *"the
dispatcher calls it"* — neither is true of an unwired module, and a module nobody calls delivers
none of `EPIC-003`'s third criterion. Read strictly, `A7` and `## Scope` cannot both hold; the
alternative (ship unwired, one-line follow-up ticket) satisfies the letter and hides the scope.
**Ruled: `A7` PASSES as read with `## Scope`, and the deviation from its letter is exactly bounded
and measured** — the four files in the numstat, and `src/legal.ts` / `src/moves.ts` (plus six more
core files) hash-identical to the base; suite green, skip 0, 32/32. The `ABC-033 A6` rows that
changed were rows that had pinned the placeholder codes *"— ABC-034 owns the wording"* by their own
comment, i.e. rows written to be changed by this ticket; none was deleted, trimmed or moved.
**Consequence that is NOT waived: the ticket's security firing threshold fires on its letter**
(*"touches any file under `src/` other than its own module and test file(s)"*) — Security/NFR's hop
is owed and this ruling does not pre-empt it.

## Ruling 3 — `A8`: passes as written; the `## Scope` lean ("place them together") is unbuildable under `A8`'s own constraint

`A8` as written asks four things and all four hold on the build: `e8=K` → one of the seven
(`no-legal-move-named`, *no move e8=K here*, referent `e8`); `O-O` with no castle legal → one of the
seven (`unreadable`, *type e2e4 or Nf3*); the set is seven, `REJECTION_REASONS.length` = 7, no code
added; `e8=P` → `unreadable` ≠ `e8=Q` → `move`; and no promotion-letter or castle-string table
exists in `src/rejection.ts` or `src/san.ts` (hash pinned). The `## Scope` prose leaned toward
placing both on the `unreadable` side. To do that the classifier would have to recognise `=K` as a
promotion to a king — which is a promotion-letter table, the thing `A8` forbids — or `src/san.ts`
would have to re-code `e8=K`, which `ABC-032`'s accepted `no-such-move` and `## Scope` itself say
is *"not re-opened"*. **Ruled: `A8` PASSES as written; the Engineer's placement by the readers' own
verdicts is the only one that satisfies `A8`'s constraint without re-opening `ABC-032`.** The
teaching cost is real and named in the probes: a player who types well-formed `O-O` (or coordinate
`e1g1`) when castling is unavailable is told the two formats / *e1 cannot reach g1* — retrograde
reasoning is out of scope by the ticket, so this is a BA/PM observation, not a defect.

## Ruling on (f) — `"  qh5  "` never case-folds: `ABC-033`'s, and no `ABC-034` criterion catches it

Probed on the start position: `qh5` → *no move Qh5 here*; `QH5` → *no move Qh5 here*; `"  Qh5  "`
→ *no move Qh5 here*; `"  e2e5  "` → *e2 cannot reach e5*; but `"  qh5  "` and `"  nc3  "` → *type
e2e4 or Nf3*. The classifier is correct for the texts it is handed — a padded uppercase line and a
padded coordinate both classify — so the cause is upstream: `CASE_VARIANTS` in `src/move-input.ts`
transform the WHOLE line and index 0 of a padded line is a space, so no variant of a padded
lowercase SAN line ever reads. That is `ABC-033`'s fold, pinned by `ABC-033 ## Test notes` (*"the
line is handed over unmodified"*), and no `ABC-034` criterion names a padded input (`A3`'s row is the
exact string `Qh5`). **Ruled: not a defect this ticket's criteria catch; `ABC-033`'s, and whether
the fold should trim first is BA/PM's ruling (one `.trim()` in the variant table, with `ABC-033`'s
"does not trim" row re-read).** Recorded here so it is not re-found a third time.

## `A4`'s parenthetical, while here

`A4` asks each sentence to carry *"a square name from the input, a piece name, or the word for the
king"*. `unreadable` cannot carry a square from the input — by definition the grammars read none —
so *type e2e4 or Nf3* carries the two FORMATS instead, and the `A4` regex `/[a-h][1-8]|king/`
accepts it. That is the right sentence (echoing an unread raw line would be unbounded, and `A5`
would fail on a long one); noted so nobody reads the regex as looser than the criterion by accident.

## Gaps — named, not fixed (subtask: do not touch the build)

| id | gap | where it lands |
|---|---|---|
| **G1** | No row binds a code to ITS sentence: the two king sentences swapped (Ma1) and the two origin sentences swapped (Ma2) are both green. Test note 5's distinction is unasserted. Assertable without typing a sentence twice (semantic anchors per code, like `A4`'s) | a test-only follow-up in `src/rejection.test.ts`; owner's call whether it rides `ABC-034` before merge or a sibling ticket |
| G2 | Dispatcher order (raw line before variants) is pinned only through `classifyRejection` with coordinate codes; via `resolveMoveInput` a reversed order (Mc2) echoes `bxc4` for a typed `Bxc4` and nothing reds | same follow-up, one row |
| G3 | The ticket's `NFR-003` cost claim (one `legalMoves` per rejection) is asserted by nothing: the classifier's own import is invisible to `ABC-033 A5`'s spy (Me2 green) | Security/NFR hop — weigh, and note the spy's blind spot |
| G4 | No padded well-formed SAN row: the `.trim()` on the echo (Mn) is unguarded | same follow-up, one row |

None of the four changes the verdict: none falsifies a criterion as written, and the delivered build
behaves correctly on every probe. They are what the next regression would look like, and they are
cheap.

## What this hop did NOT do

No merge, no deploy, no self-sign. No production line and no test line changed — `git diff
--numstat` of this hop under `src/` is empty. `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`
not opened. `NFR-008` not ruled. Security/NFR's review not done for them.
