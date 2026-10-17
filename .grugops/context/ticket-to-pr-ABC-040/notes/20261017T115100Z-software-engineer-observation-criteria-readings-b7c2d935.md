---
type: observation
role: software-engineer
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-040
at: 2026-10-17T11:51:00Z
sealed: false
refs: [ABC-040]
---

# Readings (base `b84dc637`, file 1100 lines, md5 `6372321941926aec40fb3d9af249a17d`; escape-aware split `re.split(r'(?<!\\)\|', line.strip()[1:-1])`, cells stripped)

Pre-edit: 512 `^| ABC-` rows. Pairs: `ABC-028` L461/L463 and `ABC-029` L462/L464 (they have moved since the
re-score's L460–463). All four split to 10 cells, with 0 escaped pipes. Comment paragraph L379–388.

- **A2** stale `ABC-028` Status is a byte-exact prefix of live: True (2618 of 50168 chars). Stale Code/Tests/UAT/Release all empty.
- **A3** `d` = 2705. Tail = 2404 chars = 2418 UTF-8 bytes. New cell equals the formula: True. `**` count = 206.
  All six probes present. Live cells 0–8 unchanged. Live `ABC-028` row is byte-identical.
- **A4** `` `HISTORY_COLS` HOLDS at 21.** **AMENDED 2026-08-11`` ×1; ``ZERO `src/` bytes. **DESIGN HOP RUN 2026-08-12`` ×1;
  the block between them equals `stale[d:]` exactly.
- **A5** `grep -cF` on the old sentence: 0. Dated sentence `DUPLICATE ROWS RECONCILED 2026-10-17`: 1. It names R3, R4 and "2404 bytes".
- **A1** (i) no two rows share byte-identical cells 0–4 (pre-edit: exactly the two pairs). (ii) `ABC-028` ×1, `ABC-029` ×1.
- **A6** 508 other rows are byte-identical and in the same order. Row count 512 → 510 before the own row, 511 with it.
  `git show --numstat 8d2e4f8b`: one file, `9 13 plans/traceability.md`. `git diff --numstat -- src/`: empty.
  `/usr/bin/diff` hunks: L379–388 → 379–385, L462–464 → 459, and the appended row only.
- Gates on tip `8d2e4f8b`: lint 0, typecheck 0, build 0. `npm test` exit 0, 58 files / 1792 tests (= base).
  `.test-results/last-run.json` success true, pending 0, todo 0. `test-skip-integrity --skip-count 0`: `No findings.`, exit 0.
  No timing reading taken.
