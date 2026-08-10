---
id: 20260810T124328Z-software-engineer-artifact-ref-3d10f59c
kind: artifact-ref
by: software-engineer
at: 2026-08-10T12:43:28Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - EPIC-002
  - EPIC-003
  - ADR-0004
  - src/san.ts
  - src/san.test.ts
  - src/san.nfr.test.ts
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/ABC-013-san-rendering.md
  - plans/tickets/history/ABC-013-board-history.md
supersedes: 
---

# What this hop changed, and what it deliberately did not

## Changed

| artifact | change |
|---|---|
| `src/san.ts` | **NEW**, 148 lines. One export, `toSan(position, move, legal?)`. Imports exactly `./position.ts`, `./moves.ts`, `./apply.ts`, `./legal.ts`. Module-private: `PIECE_LETTERS`, `KINGSIDE_FILE`, `disambiguator`, `suffix`, `body` |
| `src/san.test.ts` | **NEW**, 371 lines, 22 tests — `A1`–`A20` as a `(fen, move, expected)` table over the ticket's 18 FENs, plus two table-free properties over 184 positions |
| `src/san.nfr.test.ts` | **NEW**, 109 lines, 5 tests — `N1`'s mechanism as spied call counts at `P60`, plus a control that the strings are still right while spied |
| `plans/board.md` | `ABC-013` moved `In Development` → `In Review`; In Development 1/3 → 0/3, In Review 0/3 → 1/3; `_Updated:` header replaced (one line) |
| `plans/tickets/history/ABC-013-board-history.md` | the `In Development → In Review` entry appended, and the outgoing `_Updated:` header appended **verbatim BEFORE** the board header was replaced — 5,098 chars, byte-checked (the file grew by exactly the entry + 5,098 + 1) and the `in` test confirmed |
| `plans/tickets/ABC-013-san-rendering.md` | front matter only: `status: in-development → in-review`, `column: In Development → In Review`. **No criterion, no FEN, no expected string, no bar was edited** |
| `plans/traceability.md` | ONE row (`ABC-013`), FOUR cells (`NFRs`, `Code (PR/files)`, `Tests`, `Status`); 33 table lines before and after; the row at exactly 11 unescaped pipes before and after; every added string asserted pipe-free and newline-free before writing; one `_Updated:` line added (28 → 29, the file's accumulate convention) |
| `.grugops/queue/` | `pending/ticket-to-pr-ABC-013-dev.md` → `claimed/…/` → `done/…/`, by hand, with the claim record |
| `.grugops/context/ticket-to-pr-ABC-013/notes/` | these notes |

## NOT changed, deliberately

- **No existing file under `src/`.** `git diff --name-only -- 'src/*.test.ts'` is empty and
  `git status --short src/` lists three untracked files and nothing else. `src/legal.ts`,
  `src/moves.ts`, `src/apply.ts`, `src/position.ts` and every existing test are byte-unchanged —
  `A22`'s "no existing test is modified" clause, and the rules core the ticket fences off.
- **No `parseSan`, and nothing that forecloses it.** No stub, no `SanParseResult`, no
  `SanRejectReason`, no second grammar. `EPIC-003` adds it to this same file over these same tables.
- **`memory-bank/50-decisions/ADR-0004-san-ownership.md`** — not opened, not amended.
- **`plans/nfr-catalog.md`** — not edited; no catalog target moved. `N1`–`N4` are ticket-local
  derived bars and `NFR-002` / `NFR-003` are untouched.
- **`ABC-016`, `ABC-017`, `ABC-024`, `EPIC-002`, `EPIC-003`** — not edited. `ABC-016` and `ABC-017`
  consume `toSan` and its signature is exactly the one they were written against.
- **`memory-bank/30-architecture.md`** — not edited, and this is a deliberate deferral rather than
  an oversight. `ADR-0004`'s Consequences say its component table and dependency chain *"will need
  `san.ts` and `history.ts` added when they are built"*. `history.ts` is merged and absent from that
  map, so the debt predates this ticket and covering only my half would leave the map half-true.
  **Flagged, not fixed** — it is a documentation ticket for BA/PM to cut, not hidden scope for me
  to absorb.
- **No branch merged, nothing deployed, no other board column touched, no other ticket enqueued.**
  The `In Review` exit is QE/E2E's.

## One stale figure found and left alone

`plans/tickets/ABC-013-san-rendering.md` § Board history says the history file is **3,598 bytes**.
It was 11,353 before this hop and is 19,367 after. The number was already wrong when I arrived —
BA/PM's promotion entry outgrew it — and correcting someone else's stale line is adjacent-code
editing, so it is **flagged here rather than changed**. Worth one line from whoever next touches
that section.

## The harness

The mutation runner, the `P60` bench and the move-classification probe live in this session's
scratchpad, outside the repository, and are **not committed**: they are scaffolding rather than a
deliverable, and everything they established is in these notes. `src/san.ts` was restored from a
byte copy after every mutation and the final file is the one the gate ran against.
