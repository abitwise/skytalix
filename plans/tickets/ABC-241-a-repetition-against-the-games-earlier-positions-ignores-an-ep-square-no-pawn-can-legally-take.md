---
id: ABC-241
title: "A repetition against the game's earlier positions ignores an en-passant square no pawn can legally take, in the game-end count and in the search's prior keys; the hash does not change"
status: backlog
column: Backlog
size: S
priority: P2
epic: EPIC-010
---

# ABC-241: the repetition key (Q3 (c))

> **Cut 2026-10-30 by BA/PM** (task `bapm-q3c-oq228ii-fold`, records only, at `main` `7b8eeb94`). The owner answered
> `EPIC-010` Q3 in session, verbatim *"Q3: c"* (`orch-2026-10-29g` `…c4ab73de`). The design is `ADR-0020` § AMENDMENT
> 2026-10-30, C1–C4 (Architect `arch-q3c-oq228ii` `…b86f7d93`), ACCEPTED on his word. Where this page is shorter, the
> amendment rules. **Waits in Backlog on one thing: `ABC-230`'s merge.** Half of this ticket edits the prior-key
> builders `ABC-230` creates, and `ABC-230` is not re-scoped (`…c4ab73de`, delivery).

## Problem

- **User:** the owner in the CLI and a GUI over UCI.
- **Pain:** under `ADR-0020` d1, a position reached by a double push carries an ep square whether or not a pawn can
  take on it, and its later recurrences carry none. Its first key differs from its later ones, so the threefold and
  the fivefold are counted one occurrence late (`ADR-0020` d2). cutechess counts them on time. SA `sa-ABC-226`
  `…cc53fc79` `A6`: 22 of 1 718 repetitions, all D, 0 R. After `ABC-230` the same late count reaches the search
  through its prior keys.
- **Value:** the game and the search see a repetition when FIDE 9.2 does, with no change to the hash, the table or the
  book.

## Scope

The design is `ADR-0020` § AMENDMENT 2026-10-30. It binds. This page states the outcomes.

1. **C1, the repetition key.** If `epSquare` is set and no legal en-passant capture exists, the key is `zobristKey`
   with the ep file XORed out. Otherwise it is `zobristKey` unchanged. A pseudo-legal but illegal capture takes the
   file out.
2. **C2, one helper, in `src/gameend.ts`.** Exactly one pure function computes it; its name and signature are the
   SE's. `src/zobrist.ts` gains one export, a pure read of the ep file's component. No module gains an import of
   `legal.ts`.
3. **C3, both halves in one merge:**
   - **Game end:** `keyHistory` stays the hash list. `history.ts` gains the repetition-key list. `repetitionCounts`
     counts it and stays the one `positionCounts` supplier. `gameStatus` looks up the live position through the
     helper. `turn-loop.ts` `claimShortfall` counts the repetition-key list.
   - **Prior keys:** `cli.ts` injects the repetition-key list where `ABC-230` injects `keyHistory`. UCI
     `parsePosition` passes each kept key through the helper. The blunder path's appended root key is a repetition
     key. **Every key in `priorKeys` is a repetition key.**
4. **C4, recorded and not fixed:** an in-tree double push and a root that carries an uncapturable ep square stay one
   late (the safe direction).
5. **Value-changing**, so `EPIC-010` § The merge rule's 10 D + 10 R smoke pair applies (`A10`). No `ADR-0026` door:
   it is an exact rule, as `ABC-230`.

## Out of scope

- The hash, the TT, the book (`book.json` is not rebuilt), perft, and the search's own per-ply array and path scan
  (they stay raw).
- `src/apply.ts`, `src/legal.ts`, `src/search.ts`, `src/transposition.ts`, `src/quiescence.ts`, `src/book*.ts` and
  `data/`.
- `ADR-0020` alternatives (b) (the ep-legal hash key) and upstream normalisation in `apply.ts`.

## Acceptance criteria

- **A1 (the helper).** **Given** each case below, **when** the helper runs, **then**:
  - an ep square with no capturer: the key equals `zobristKey` of the same position with no ep square;
  - an ep square with a legal capture: the key equals `zobristKey`;
  - a pseudo-legal but illegal capture (a pinned capturer, and the rank-pin case): the ep file is removed;
  - no ep square: the key equals `zobristKey`;
  - the position is unchanged after the call (purity).
- **A2 (the hash is unchanged).** The `zobrist.test.ts` ep rows (`ADR-0020` d1's `not.toBe` pair), the `ABC-075`
  oracle walk, the book rows and every node pin pass **unedited**. A red there is a build fault, not a re-pin
  (falsifier `F9`).
- **A3 (game end, the `ABC-011` `1.e4` line).** **Given** 1.e4 Nf6 2.Nf3 Ng8 3.Ng1 Nf6 4.Nf3 Ng8 5.Ng1 …, **then**
  `gameStatusOf` reports the threefold claim after **5.Ng1** (base: 7.Ng1), and the fivefold draw after **9.Ng1**
  (base: 11.Ng1); `claimShortfall` reads **"2 of 3"** after 3.Ng1. A twin line from a FEN where the double push can
  be taken legally keeps base's counts on all three.
- **A4 (prior keys, both surfaces).** **Given** a FEN with a non-zero score and a line through an uncapturable double
  push and then a shuffle, **then** the move that makes the third occurrence scores **exactly 0**, on the CLI and on
  UCI. With a legal ep capture available, the same line is not a draw on either surface.
- **A5 (one list).** For A4's line, the CLI's injected list equals UCI's list key for key. On a blunder level (1–4),
  the root key appended for the child searches equals the helper's key of the root, read on an injected seam.
- **A6 (identity elsewhere).** **Given** no prior keys, or prior keys none of which carries an ep square, **then**
  every search is node-equal to base: the `ABC-078` `A3` corpus, every bare-FEN node pin, and `G6`'s boards.
- **A7 (consistency).** On the CLI, the move the search scores 0 in A4 is the move after which `gameStatusOf`
  reports the claim.
- **A8 (fences, unchanged).** The `LICENSED_DRIVERS` equality (`["turn-loop.ts", "cli.ts"]`), `uci-session.test.ts`
  `A11-g1`'s deny list and `ABC-081` `A6` stay green unedited. `history.ts`'s import list is unchanged.
  `uci-session.ts`'s one new import is `gameend.ts` (the `ADR-0044` D2 dated line).
- **A9 (gates).** `G4` (identity rows), `G8`, `G9`, `G10`. `G6` is not re-read: its boards carry no prior keys, and A6
  stands for it.
- **A10 (the reading).** The smoke pair of `EPIC-010` § The merge rule, on the candidate head rebased on `main`, before
  the merge: S-1 0 faults, S-2 0 losses on time, S-3 D ≥ 3.0 of 10 (else ≥ 7.0 of 20), S-4 R ≥ 3.0 of 10 (else ≥ 7.0
  of 20). Reported: each smoke's W/L/D and score, the ledger's pooled R score since the last batch, and **the count of
  smoke games that end by repetition, candidate against base** (as `ABC-230` `A7`).

## NFR triggers

- **`NFR-002` (< 16 ms per frame):** the per-ply derive gains one `hasLegalEnPassant` call per double push in the
  game. Its cost is `UNKNOWN - verify`, expected within the 46–50 µs replay's noise. The existing `NFR-002` rows stay
  green.
- **`NFR-005`:** cannot move (A6). **`NFR-008`:** fixed-depth or virtual-clock rows only; 0 real-clock rows in the
  default lane. **`NFR-009`:** no new per-search storage; the prior-key list is the same length as `ABC-230`'s.
- **Security (ASVS L1):** no new input path. UCI's existing move list passes through one more pure function.

## Test notes

1. The rows' shapes are the amendment's Consequences. The rows themselves are QE's and the SE's.
2. A3's rows are pinned against base in the same run. If they go red after a rollback, the rollback took
   (`ADR-0020` § Rollback).
3. UAT is owed (production lines on both surfaces). The QE verdict signs it.

## Size and priority

- **Size: S.** One helper, one export, a few lines at each call site (`ADR-0020` amendment § Consequences).
- **Priority: P2,** milestone 1, after `ABC-230`.

## Dependencies

- **`ABC-230` merged** (In Development, `se-ABC-230`). Its prior-key builders and the blunder path's root key are
  edited here. Which module appends that root key is `UNKNOWN - verify` until it merges.
- **`ADR-0020` § AMENDMENT 2026-10-30, ACCEPTED** on the owner's word (`…c4ab73de`). It is in force at this ticket's
  merge. Its pointer lines in `ADR-0044` D2 and `ADR-0054` are written.
- Shares `src/cli.ts` and `src/uci-session.ts` with `ABC-230` (first) and `src/uci-session.ts` with `EPIC-009`'s
  `ABC-220`: whichever merges second rebases, and the Orchestrator orders them.
- If `ABC-228` merges first with `OQ-228-1` (ii) built, this ticket's R smoke reads level 5 at 4 000 ms, against the
  4 000 ms reference (`ADR-0053` d10). Nothing on this page changes.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ `ADR-0020` d2; SA `A6` 22 of 1 718 |
| 2 | scope and out-of-scope | ✅ C1–C4; the hash, TT and book out |
| 3 | INVEST | ✅ one rule, two halves that must land together; S; testable |
| 4 | testable, measurable acceptance | ✅ A1–A9 exact (key-equal, 5.Ng1 / 9.Ng1 / "2 of 3", score 0, node-equal); A10 the smoke pair |
| 5 | dependencies known | ✅ `ABC-230`; the amendment (ACCEPTED 2026-10-30) |
| 6 | NFR triggers with targets | ✅ `NFR-002` < 16 ms rows green; `NFR-005` node-equal |
| 7 | test notes | ✅ 3 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P2, milestone 1 |
| 10 | no major unresolved blocker | ⬜ `ABC-230`'s merge (its seams, including the blunder-path module) |

**DoR 9/10 (2026-10-30, `bapm-q3c-oq228ii-fold`). Backlog.** On `ABC-230`'s merge, row 10 is met, and the ticket is
10/10 and Ready with no further BA/PM hop, unless that merge changes the seams this page names.
