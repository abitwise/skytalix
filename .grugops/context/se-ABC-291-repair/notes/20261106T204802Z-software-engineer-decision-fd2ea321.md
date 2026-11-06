---
id: 20261106T204802Z-software-engineer-decision-fd2ea321
kind: decision
by: software-engineer
at: 2026-11-06T20:48:02Z
verified_by: 
confidence: high: the rows are the ruling's; the calls are small and open to QE
refs:
  - ABC-291
  - ABC-282
  - ADR-0075
  - ADR-0071
  - EPIC-011
  - arch-ABC-291-stop/20261106T203245Z-architect-design-decision-2d2c2bad
  - arch-ABC-291-stop/20261106T203300Z-architect-design-observation-77dd9228
  - se-ABC-291/20261106T201944Z-software-engineer-failed-attempt-a8daf408
supersedes: 
seal: sha256:5c3b52ad24fa36ebf2e76d7a0d096c3011be7b2a008624b5ed5218c7564b989e
---

# se-ABC-291-repair decision: `…2d2c2bad` § 5's five items, as written; four small calls inside them

`grugops/ABC-291`, test commit `a3474306`, on the merge of `main` `f59be09d` (`a8d55615`). Three test files. No production line.

## The rows
1. **`src/uci-session.test.ts`, A0-3, six rows through three constants:** `D8` (4 rows) cp 45 → 74; `D7` (1 row) cp 43 → 88; `D6` (1 row, `go depth 6`) cp 87 → 99, nodes 10513 → 10614, nps 618412 → 624353. Each literal is § 1's. The doc comment gains one dated line and keeps `…aadd2d48`, `…0f8a4f82` and "`cp` moves on five". The title, `bestmove c3d5`, D3's `69_705` stay.
2. **`src/evaluate.pawns.test.ts`, the off-branch row's comment:** "NOT K1 (h)'s letter … the Architect's" is now a dated pointer to `ADR-0075` K1 (h)'s dated line. Assertions unchanged.
3. **`src/evaluate.pawns.test.ts`, one new default-lane row beside it,** "d4: pawnShape: true stands in each RULES_PAWN_SHAPE and in search()'s and chooseMove's own bodies, under tools/ in QUIET_RULES and its name, and nowhere else". Source only, no search.
4. **`src/engine.test.ts` A0-1:** the door's `softMs: 1` line deleted, one dated comment in its place. The relation on `chooseMove` stays.
5. **`src/engine.test.ts` A0-1 and A0-2, wording:** `allOn` → `bundleTree`; both title templates (10 rows) say "the bundle's tree". No figure moved.

## The calls
- **Row 3 names each carrier by the top-level declaration whose body holds it,** so "inside the body" is read, not just the count. A hit after that declaration's closing column-0 brace reads "no declaration".
- **Row 3 scans `.ts` and `.js`, every non-`.test.ts` file under `src/` and `tools/`.** `tools/grugops` holds `.js`, which the block's `tree` helper skips. `tree` is unchanged, so K1 (h)'s rows read what they read.
- **A0-1's title** had to lose "all on reads one line with softMs absent and with softMs 1", because a door no longer takes that read. It now reads "the bundle's tree reads its figures; chooseMove reads one line with softMs absent and with softMs 1".
- **Left as they stood:** the loop variable `on`, and "all on" inside the dated `ABC-303` and `ABC-291` comments. § 5 item 5 names `allOn` and the titles; those comments are records of their date.
