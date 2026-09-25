---
id: 20260926T034200Z-architect-design-decision-g6-pair-is-a-decision-4-row-repoint-stands-no-new-row-ea306e58
kind: decision
by: architect-design
at: 2026-09-26T03:42:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - ABC-081
  - ADR-0026
  - ADR-0006
  - ADR-0025
  - src/transposition.test.ts
  - 20260926T034100Z-architect-design-observation-g6-score-pair-reds-no-castling-key-bug-on-any-path-0a3528d1
  - .grugops/context/ticket-to-pr-ABC-121/notes/20260925T184100Z-software-engineer-decision-abc121-g6-pair-repointed-decision-4-over-7-needs-ratifying-0da3f1a5.md
supersedes:
---

# Ruling G6: the knight pair is a decision-4 row, so the re-point STANDS; the shipped path needs no new row; `ADR-0026` needs a proposed erratum to decision 7

Hand-authored, no `seal`. **The build is NOT on hold.** The queue's first stop condition does not
fire. The evidence is `…0a3528d1`.

## 1. Which reading binds: decision 4, and the row is a work/identity row

- **A row belongs to the decision that matches its assertion, not its name.** Decision 4 defines
  a work reading as "any row that compares the shipped path with a door". The G6 pair row asserts
  table-on equals `searchWithoutTable` at depth 4, which is `ABC-081` `A1`'s identity. `ADR-0026`'s
  Context names `ABC-081` `A1` as one that "cannot hold as identities with LMR on". So it is
  decision 4's row, and pointing it at `searchWithoutPvsOrReductions` is correct.
- **Decision 7 listing "the `G6` knight pair" is an error in the ADR's example list.** Decision 7
  is its author's own text (Architect/Design, `ruling-abc121-lmr-oracle`), written without
  measuring the pair at depth 4 under LMR. Decision 7's own test for a mixed row is that the
  literal half stays shipped only where "the probe reads [it] under every configuration". The
  pair fails that test at depth 4: `w -` reads 830 on `search()` and 820 on every door. So even
  on decision 7's own terms, the pair moves.
- **Nothing is lost by moving it.** The score pair reds no castling-key bug on any path, the door
  included (`…0a3528d1` §2). The table lives one search (`ADR-0025` decision 4). `G6`'s guarantee
  (rights, not availability, in the key) is carried by three key rows that no search switch
  reaches (§3 of that note). All three stay green on the build, and each goes red when rights are
  dropped from the key.

## 2. What carries G6's guarantee on the shipped path: the key rows already do; no new row

- The shipped `search()` and every door run the same `zobristKey`, `zobristKeyAfterMove` and
  table code. `ABC-121` added switches to the recursion, not to the key. A key row therefore binds
  the engine the player gets as much as any search row could.
- The carrying rows, named:
  - `transposition.test.ts` "G6 bites: the knight-g1 pair keys differently";
  - `zobrist.test.ts` "zobristKey depends on castling rights";
  - `zobrist.test.ts` `ABC-075` `A4` "hashes castling RIGHTS, not availability (ADR-0006), and the
    delta agrees";
  - for a stale incremental key, `zobrist.test.ts` `ABC-075` `A1/A2`, `A3/A4` and `A3`.
- **Rejected: a shipped-path score row** (`search()` on the pair at depth 5: 840 / 830, equal to
  table-off; 4 479 nodes). It is measurable and cheap, but it reds neither key bug. It would pin a
  premise, not a guarantee. That is gold plate, so it is not required. If the owner overrules,
  this is the row, named exactly: `search(pair, 5).score` is 840 / 830, and it equals
  `searchWithoutTable(pair, 5).score`.

## 3. `ADR-0026` needs a clarifying amendment: PROPOSED text (the owner accepts; this note does not edit the ADR)

Append to decision 7:

> *(proposed 2026-09-26, `ruling-abc121-g6`)* **A row belongs to the decision that matches its
> assertion, not its name.** A row that compares a search or the engine with a test-only door
> belongs to decision 4, or to decision 5 for the two drift detectors. That holds for identity,
> ratio, hit rate and node pin alike, and it holds even when the row also pins a value. Decision
> 7 covers only assertions made on the shipped path alone. **The `G6` knight pair is struck from
> the examples above.** It is `ABC-081` `A1`'s table-on-vs-off identity, and at depth 4 LMR moves
> `knight-g1 w -` from 820 to 830, so it re-points under decision 4. `G6`'s guarantee does not
> rest on it. The table lives one search (`ADR-0025` decision 4), so the score pair reds no
> castling-key bug on any path. The guarantee rests on the key rows (`transposition.test.ts` "G6
> bites", `zobrist.test.ts`'s castling-rights rows), which no search switch reaches
> (`ruling-abc121-g6` `…0a3528d1`, `…ea306e58`).

A companion erratum to **`ADR-0006`'s `G6` row**, also proposed. Its "how to check" column
names a row that never had bite. Proposed replacement for that cell:

> `ABC-081`'s key row "G6 bites: the knight-g1 pair keys differently" and `zobrist.test.ts`'s
> castling-rights rows (`ABC-075` `A4`). The `ABC-081` `A1` score pair (830 vs 820 at depth 4 on
> the pre-`ABC-121` search) records the premise that the subtrees differ; it does not detect a
> key bug, because the table lives one search.

## 4. What the Engineer must change: one comment, no code, no literal

In `src/transposition.test.ts`, the build's own comment above the `KNIGHT_G1_PAIR` loop (the one
that begins "RE-POINTED at `ABC-121`…") ends "…which is exactly the equality G6 exists to forbid,
so the falsifier has no bite on the shipped path." That sentence implies the pair had bite on the
door, and it did not (`…0a3528d1` §2). Replace the sentence from "The pair then reads 830 twice…"
up to "Measured, not argued:" with this:

> The pair then reads 830 twice on `search()`, so it re-points under decision 4 (ruling
> `ruling-abc121-g6`, which strikes it from decision 7). G6's bite was never this score pair,
> because the table lives one search. It is the key row below and `zobrist.test.ts`'s
> castling-rights rows, which no search switch reaches.

Keep the "Measured, not argued: …probe/g6.ts" sentence. Nothing else changes: no assertion, no
identifier, no literal, and no other comment.

- **Flagged, not to be edited (coding rule 9):** the pre-existing `ABC-081` docstring on
  `KNIGHT_G1_PAIR` says an availability key "would hand one the other's score: `G6`'s FAIL". That
  is true only if the two roots shared a table. They do not. It is `ABC-081`'s text, outside this
  build's change. It gets fixed when the owner accepts the `ADR-0006` erratum.
