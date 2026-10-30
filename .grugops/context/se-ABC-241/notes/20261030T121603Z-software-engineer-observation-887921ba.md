---
id: 20261030T121603Z-software-engineer-observation-887921ba
kind: observation
by: software-engineer
at: 2026-10-30T12:16:03Z
verified_by: 
confidence: high on counts, gates and red checks as run; G8 informal under shared width
refs:
  - se-ABC-241
  - ABC-241
  - EPIC-010
  - ADR-0020
  - ADR-0054
  - ADR-0044
  - ADR-0002
  - ABC-230
  - grugops/ABC-241
  - 33540592
  - e42b637b
  - src/gameend.ts
  - src/zobrist.ts
  - src/history.ts
  - src/turn-loop.ts
  - src/cli.ts
  - src/uci-session.ts
  - src/levels.ts
supersedes: 
seal: sha256:7fcf8db7f1e7b5c4ce74de33dd5f4f9a3247e9a6c597f2d5c7b4b95e52428ce0
---

# Software Engineer observation, se-ABC-241: rows added, gates as run, red checks

## Rows added (24 at `33540592`, plus 1 import pin; `npm test` 2 245 against base `e42b637b` 2 219, 0 removed, 0 skipped)
- `src/gameend.test.ts` `ABC-241 A1` has 11 rows. Removed: no capturer (1.e4), a pinned capturer (diagonal, `k6b/8/8/3pP3/8/8/1K6/8 w - d6`) and the rank pin (`7k/8/8/K1Pp3r/8/8/8/8 w - d6`). Kept: two legal captures, plus one with a pinned lower capturer and a legal other. Also: no ep, the handed key is read, purity (FEN and board bytes), the `gameStatus` lookup contract on a crafted counts map, and an F8 walk (every ep node of a 2-ply walk from 3 openings: the file is dropped iff the generator offers no ep move; removed > 0 and kept > 0).
- `src/history.test.ts` `ABC-241 A3` has 4 rows, and `A8` has 1. The claim is first at 5.Ng1 (cycle 2) and the fivefold first at 9.Ng1 (cycle 4). Base is pinned in the same run (hash-list count one short: 7.Ng1 / 11.Ng1). The d4xe3 twin keeps 7.Ng1 / 11.Ng1, and its list equals the hash list. The two lists differ only at the 1.e4 key. A6 game side: an ep-free game has equal lists, and a 120-ply pseudo-random game differs exactly where the generator offers no ep capture. `history.ts` imports exactly apply, fen, gameend, moves, position and zobrist.
- `src/turn-loop.test.ts` `ABC-241 A3`: after 3.Ng1, a refused claim reads `repetition 2 of 3`; the twin reads `1 of 3`.
- `src/cli.test.ts` `ABC-241 A4, A7` has 4 rows. Fixture `4k3/7p/8/8/8/8/8/Q3K3 b - - 0 1` with `h7h5 a1a2 e8d8 a2a1 d8e8 a1a2 e8d8 a2a1`: the default level plays d8e8, and `chooseMove` on the trimmed repetition list scores it exactly 0. On the hash list it is not 0. Twin `4k3/7p/8/6P1/8/8/8/Q3K3 b - - 0 1` (g5xh6 e.p. legal): not 0. A7: after the seam's move, `gameStatusOf` reports the threefold claim by white, the hash count is 2, and the twin's d8e8 has no claim. Plus the `cli.ts` import pin.
- `src/uci-session.test.ts` `ABC-241 A4, A5` has 4 rows. `go depth 4` gives `cp 0 bestmove d8e8`, and the twin is not `cp 0`. The handed list is `trimPriorKeys(repetitionKeyHistory)`, 7 keys, with only the h7h5 key differing from the hash list, and the twin's list equals the hash list. The CLI seam's handed list equals UCI's key for key, and both play d8e8 at cp 0. A8: the session's import set is base's plus `gameend.ts`.
- `src/levels.test.ts` `ABC-241 A5`: a blunder from a 1.e4 root hands every child `[...prior, repetitionKey(root)]`, which differs from the raw key.

## Fixture probe (scratch, depth 3/4/5, no clock)
With repetition keys: d8e8 at 0 (65 / 130 / 251 nodes). On the hash list: d8e8 −957, d8c8 −957, d8c7 −956. Twin: identical on both lists (−1050 / −1060 / −1090).

## Gates as run (one host, shared width, no timed reads)
- `npm run lint` clean (129 files). `npm run typecheck` clean. `npm run build` clean.
- `npm test`: 63 files, 2 245 passed, 0 failed. `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`
- G4: no search module changed (`git diff e42b637b` is empty on `engine.ts`, `search.ts`, `apply.ts`, `legal.ts`, `transposition.ts`, `quiescence.ts`, `book*.ts`, `data/`, `zobrist.test.ts`, `search*.test.ts` and `history-pane.nfr.test.ts`). The default-lane identity and node-pin rows are green unedited.
- G9: `src/levels.ts`'s diff is the import name and the `childKeys` line only. `LEVELS`, `DEFAULT_LEVEL` and `HARD_CEILING_MS` are byte-identical. G10: no level reddened.
- G8: vitest Duration was 9.04 s (base), then 9.14, 9.65 and 9.59 s on the candidate. **This is informal.** It was read under shared width beside two records-only sessions, so it is not a G8 reading. QE reads G8 alone. The ENGINE_DEEP lanes were not run.

## Red checks (each mutant applied to a copy, full `npm test`, file restored; the tree is clean after)
- M1 helper returns `key` (the § Rollback): 17 red across all ABC-241 rows on every surface, plus the re-pinned UCI ABC-230 A5.
- M2 legality ignored (drop the file whenever ep is set): 12 red (the kept rows, the twins, F8).
- M3 `gameStatus` lookup raw: 1 red (the crafted-map contract row only; see finding SE-241-a).
- M4 `repetitionCounts` on the hash list: 2 red (A3 1.e4 line, A7).
- M5 `claimShortfall` on `keyHistory` (import added): 2 red (turn-loop A8 ledger, A3 "2 of 3").
- M6 UCI replay raw: 4 red. M7 blunder root raw: 1 red. M8 `cli.ts` importing `keyHistory as repetitionKeyHistory`: 1 red (the import pin). A first M5/M8 attempt used a dynamic `await` and was an invalid mutant; it was discarded and redone.
