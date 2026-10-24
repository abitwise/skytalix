---
id: 20261024T082002Z-software-engineer-observation-03288dbe
kind: observation
by: software-engineer
at: 2026-10-24T08:20:02Z
verified_by: 
confidence: high (each check run as the page spells it, base c4acf49f, tip bb8d4432)
refs:
  - ABC-214
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - A8
  - A9
  - A10
  - bb8d4432
supersedes: 
seal: sha256:24f7f3af29dae82f4898809888fbf4fa240a896684d111c8ccbd3338b2158d02
---

# ABC-214 page checks A1-A10 at tip bb8d4432: all hold

- A1: `npm pkg get private license` prints `{"private":true,"license":"Apache-2.0"}`. The package.json numstat is 1 1, `-"license": "UNLICENSED",` → `+"license": "Apache-2.0",`.
- A2: the lock numstat is 1 1, under `packages[""]`. After `npm install --package-lock-only --ignore-scripts`, `git status --porcelain` is empty.
- A3: sha256 `cfc7749b…3d30`, `wc -c` 11358.
- A4:
  - line 1 is `skytalix` and line 2 is `Copyright 2026 Olger Oeselg`;
  - `Apache License, Version 2.0` x2 and `MIT License` x1;
  - each of the four kit paths appears once;
  - `grep -c '@'` 0, `grep -c '/Users/'` 0, `LC_ALL=C grep -c '[^ -~]'` 0.
- A5:
  - Base check: the transpiled `src/evaluate.ts` (removeComments) at `c4acf49f` is IDENTICAL to `c487d89c`, so the identifier list stands.
  - All seven required strings are in NOTICE. The carve-out section names exactly PIECE_VALUE, PAWN_TABLE, KNIGHT_TABLE, BISHOP_TABLE, ROOK_TABLE, QUEEN_TABLE and KING_TABLE, each once, and no other identifier.
  - The first comment block holds the three strings. It opens at line 1, and `./position.ts`'s import follows it.
- A6: the diff is 2 `+` lines and 0 `-` lines, both ` * ` comment lines inside the header (hunk `@@ -20,0 +21,2 @@`). The transpile with removeComments is byte-IDENTICAL at base and tip (9014 B).
- A8:
  - The `src/cli.test.ts` numstat is 1 0: Scope 4's line, directly after `expect(packaged.private).toBe(true);` inside ABC-042 A10.
  - Armed reading: with only package.json's licence reverted to UNLICENSED, `src/cli.test.ts` gave 98 passed and 1 failed. The failure was ABC-042 A10, "package.json license (ABC-214): expected 'UNLICENSED' to be 'Apache-2.0'", and it was the only red. The line was restored before the commit.
- A9: `git diff --name-only` lists exactly LICENSE, NOTICE, package-lock.json, package.json, src/cli.test.ts and src/evaluate.ts. The diff over `tools data` is empty.
- A10: see the gates note.
- UAT waiver grep over base..tip lists `src/evaluate.ts` (comment-only). The waiver therefore rests on A6, which holds. Measuring `<delivered>~1 <delivered>` on `bb8d4432` alone would see only NOTICE. Measure over the whole branch.
