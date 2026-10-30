---
id: 20261030T143518Z-software-engineer-decision-e8a008f6
kind: decision
by: software-engineer
at: 2026-10-30T14:35:18Z
verified_by: 
confidence: high: each point is read off the merged tree and the arch-ABC-220-a14 decision note
refs:
  - se-ABC-220-main
  - ABC-220
  - ABC-241
  - EPIC-009
  - ADR-0052
  - ADR-0020
  - ADR-0044
  - grugops/ABC-220
  - 9ac8b365
  - 8f444cc4
  - a649fbc4
  - arch-ABC-220-a14
  - src/uci-session.ts
  - src/uci-session.test.ts
  - src/uci.real-engine.test.ts
supersedes: 
seal: sha256:43b17629b0de7303640559a23f72f58dcf9a290049ae1c4f739470f1262f179d
---

# Software Engineer decisions, se-ABC-220-main: main a649fbc4 merged into grugops/ABC-220

- **Merge, not rebase:** `git merge --no-ff a649fbc4` on `grugops/ABC-220` @ `8f444cc4` made merge commit `9ac8b365`. Base: `8e1cdda5`.
- **Conflicts: none.** git auto-merged `src/uci-session.ts` and `src/uci-session.test.ts` with no conflict hunks. The two sides touch different lines:
  - ABC-241 changed `parsePosition`'s key list to `repetitionKey(position, zobristKey(position))` and added the `./gameend.ts` import (`ADR-0020` § AMENDMENT 2026-10-30 C3).
  - ABC-220 changed the TimeMode option, `parseGo`'s budget and `go`'s leveled branch (`ADR-0052`).
  Both hold in the merged file: line 43 has the gameend import, and `parsePosition` keeps repetition keys next to the TimeMode code.
- **Re-pins: none.** Neither side changed the same pinned text.
  - ABC-241's A8 pins the session's import list. It still holds, because ABC-220 added no import to `src/uci-session.ts`; its new `HARD_CEILING_MS` import is in the test file only.
  - ABC-220's two re-pinned `uci`-reply rows (the TimeMode option line) were not touched by ABC-241.
  - Every ABC-241 row (A4, A5 x2, A8, and the moved ABC-230 oracle) and every ABC-220 row is kept.
- **A14a confirmed, no code.** arch-ABC-220-a14's list matches `src/uci.real-engine.test.ts`'s A14 rows item for item:
  - 2 `readyok` and 1 `bestmove`; the busy `readyok` is at bestmove+1 and is the last line.
  - No line lost: the TimeMode option line, `uciok`, an `info depth` line, no book line, and no `info string` (so nothing refused).
  - The `bestmove` is legal after e2e4.
  - Spawn to exit ≥ 2 000 ms.
  - M4, exit 0, no signal, empty stderr.
  - No time is read between lines.
  - `runDialogue` is still the only `spawnSync` call site (D8).
  No row disagrees with the ruling. A14b is QE's, in the ALONE window, and was not run here.
