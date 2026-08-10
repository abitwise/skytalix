---
id: 20260810T120841Z-ba-pm-artifact-ref-ce4b34b8
kind: artifact-ref
by: ba-pm
at: 2026-08-10T12:08:41Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - EPIC-002
  - plans/tickets/ABC-013-san-rendering.md
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/history/ABC-013-board-history.md
  - plans/tickets/history/ABC-023-board-history.md
supersedes: 
---

# What this hop changed, and what it deliberately did not

## Changed

| artifact | change |
|---|---|
| `plans/tickets/ABC-013-san-rendering.md` | `## Acceptance` rewritten (13 → 22 criteria, 18 named FENs, 52 exact strings); `## Security / NFR triggers` re-derived (`N1`–`N4`, position pinned as a FEN); `## Scope` gains the two caller obligations and a re-measurement note on the 40x; `## Test notes` false `ABC-009` sentence corrected and the disambiguation bullet given its measured result; `## Definition of Ready` amended with the seventeen corrections and what they do not establish; front matter `status: ready → ready-for-dev`, `column: Ready → Ready for Dev` |
| `plans/board.md` | `ABC-013` moved `Ready` → `Ready for Dev`; Ready 1/8 → 0/8, Ready for Dev 0/6 → 1/6; `_Updated:` header replaced (one line) |
| `plans/tickets/history/ABC-023-board-history.md` | the outgoing `_Updated:` header appended **verbatim** (2,513 chars, byte-checked) BEFORE the board header was replaced |
| `plans/tickets/history/ABC-013-board-history.md` | the promotion entry appended |
| `plans/traceability.md` | ONE row (`ABC-013`), TWO cells (`NFRs`, `Status`); 33 table lines before and after; the row at exactly 11 unescaped pipes before and after; every added string asserted pipe-free and newline-free before writing; one `_Updated:` line added (27 → 28, the file's accumulate convention) |
| `.grugops/queue/` | `pending/ticket-to-pr-ABC-013-bapm.md` → `claimed/…/` → `done/…/`, by hand, with the claim record |
| `.grugops/context/ticket-to-pr-ABC-013/notes/` | these notes |

## NOT changed, deliberately

- **No file under `src/`.** No `src/san.ts`, no test for it, no line of production code —
  `git status --short -- src/` empty. This subtask changed the ticket, not the code.
- **`memory-bank/50-decisions/ADR-0004-san-ownership.md`** — not re-opened. Its clause 2 amendment
  and `EPIC-003`'s `parseSan` contract are untouched; the ticket still implements the seam without
  re-deciding it.
- **`plans/nfr-catalog.md`** — not edited, no catalog target moved. `NFR-002` and `NFR-003` are the
  catalog's; `N1`–`N4` are ticket-local derived bars.
- **`ABC-016`, `ABC-017`, `ABC-024`, `ABC-010`, `EPIC-002`, `EPIC-003`** — not edited. `ABC-016` and
  `ABC-017` still sit in `Backlog` behind this ticket and are unaffected: they consume `toSan` and
  none of the 22 criteria changes its signature.
- **No branch merged, nothing deployed, no engineer enqueued, no other board column touched.**

## The harness

Read-only against merged `src/`, outside the repository, in this session's scratchpad:
`verify-positions.ts` (18 FENs proved legal, coordinate move lists), `expected-table.ts` (the
hand-typed oracle — `md5 56d56506fcf89de10d79c5774e2a630c`, stamped `2026-08-10T11:51:22Z`, written
before any implementation existed), `builds.ts` (a reference `toSan` plus 14 mutants), `score.ts`
(fifteen builds × two criteria sets), `bench.ts` and `worst.ts` (the NFR re-derivation, two runs
each), `transcription-check.ts` and `a1-check.ts` (the FENs and strings read back OUT of the ticket
and re-verified). It is **not** committed: it is scaffolding, it is not a deliverable of this ticket,
and `src/san.ts` deliberately does not exist yet. Everything it established that matters is in these
notes and in the ticket.
