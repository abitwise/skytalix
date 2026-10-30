---
id: 20261030T121603Z-software-engineer-observation-2136c82c
kind: observation
by: software-engineer
at: 2026-10-30T12:16:03Z
verified_by: 
confidence: medium: SE-241-b is UNKNOWN - verify (not timed)
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
seal: sha256:57a3d4e95798ebf8f718aa60eeba6d85236e38d588b564fdd01fca0c0b50d6c2
---

# Software Engineer observation, se-ABC-241: risks and open items

- **SE-241-a (LOW).** The `gameStatus` lookup through `repetitionKey` cannot be observed through `gameStatusOf` in any real game. By `F3`/`F7`, a live position carrying an ep square is the first occurrence of its window, so its count is 1 on either key, and no claim or draw depends on the lookup. It is built as C3 requires, so that the lookup and the counts agree, and it is pinned only by a crafted-counts-map row in `gameend.test.ts`. M3 is red on that row alone. A future refactor could drop it without any game-level row noticing.
- **SE-241-b (LOW, `UNKNOWN - verify`).** `NFR-002`: each derive (`repetitionCounts` via `gameStatusOf`, once per ply) now calls `hasLegalEnPassant` once per double push in the game. The cost was not timed (shared width, no timed reads). The existing `NFR-002` spy rows are green. QE or a later timed read should confirm that it is within the 46–50 µs replay's noise.
- **SE-241-c (INFO).** The C4 cases stay one late, as recorded: an in-tree double push, and a root carrying an uncapturable ep square (raw in `keys[0]`, no prior keys at clock 0). Nothing was built for them.
- **SE-241-d (INFO).** G8 durations (9.14–9.65 s) were read under shared width and are informal. QE owns the G8 reading.
- **SE-241-e (INFO).** The `cli.ts` text pins (`ABC-043 A1`, `ABC-086 A5 (i′)`) moved from a one-line literal to a whitespace-tolerant regex, because biome splits the longer call. That alone would have admitted an aliased `keyHistory`, so an import pin was added (red-checked).
- **Unchanged interplay.** `ABC-242` (a blunder level's root move that makes the third occurrence) is not touched. This ticket only changes which key the blunder path appends.
