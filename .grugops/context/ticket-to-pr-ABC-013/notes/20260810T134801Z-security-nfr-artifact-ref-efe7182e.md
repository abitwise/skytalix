---
id: 20260810T134801Z-security-nfr-artifact-ref-efe7182e
kind: artifact-ref
by: security-nfr
at: 2026-08-10T13:48:01Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - EPIC-002
  - src/san.ts
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - plans/tickets/ABC-013-san-rendering.md
  - plans/tickets/history/ABC-013-board-history.md
supersedes: 
---

# What this hop changed, and what it deliberately did not

## Changed

| artifact | change |
|---|---|
| `plans/board.md` | `ABC-013` moved `In Security/NFR` → `Ready for UAT`; In Security/NFR 1/2 → 0/2, Ready for UAT 0/4 → 1/4; `_Updated:` header replaced (one line). **Four lines changed, verified by re-PARSING every `^## …(WIP` heading rather than by containment**; the format comment's two example headings confirmed byte-identical to before; exactly one `_Updated:` line and exactly one `ABC-013` row before and after; the row's position asserted by line index (between `Ready for UAT` and `In UAT`), and every other line in the file asserted byte-identical |
| `plans/tickets/history/ABC-013-board-history.md` | the `In Security/NFR → Ready for UAT` entry appended, and the outgoing `_Updated:` header appended **verbatim BEFORE** the board header was replaced — the file grew by **exactly** the entry (10,380 chars) + the header (4,319) + one newline, 31,684 → 46,384, with everything preceding the append asserted byte-identical |
| `plans/tickets/ABC-013-san-rendering.md` | front matter only: `status: in-security-nfr → ready-for-uat`, `column: In Security/NFR → Ready for UAT`. Length changed by **exactly** the two token deltas (−4) and every other line asserted byte-identical — **no criterion, FEN, expected string, NFR bar or test note was edited** |
| `plans/traceability.md` | ONE row (`ABC-013`), TWO cells appended to (`NFRs`, `Status`) **and the row's structure REPAIRED** — the previous hop's Tests text was in the UAT column and its Status text was past the trailing pipe. 33 table lines before and after; every other table line asserted byte-identical; the repaired row 11 pipes / 12 fields with the trailing pipe restored; the concatenated cell content asserted equal to the old content plus exactly this hop's two additions in cell order; both added strings asserted pipe-free and newline-free before writing; one `_Updated:` line added (30 → 31, the file's accumulate convention) |
| `.grugops/queue/` | `pending/ticket-to-pr-ABC-013-sec.md` → `claimed/…/` → `done/…/`, by hand, with the claim record |
| `.grugops/context/ticket-to-pr-ABC-013/notes/` | these notes |

## NOT changed, deliberately

- **No file under `src/`.** No module, no test, not one character. `git diff --name-status main..HEAD
  -- src/` is still three `A` lines and `--numstat` still `109/0`, `371/0`, `148/0` — **628
  insertions, zero deletions**. `src/san.ts` was read, never written.
- **`plans/nfr-catalog.md` — not edited, no catalog target moved.** `NFR-002` and `NFR-003` were
  re-derived against and both hold; they are the catalog's rows and `N1`–`N4` are ticket-local derived
  bars.
- **No NFR bar in the ticket edited, and this is the deliberate one.** `RISK-ABC013-01` is a real
  defect in `N4`'s published measurement — it is a group mean labelled a worst — and the subtask, this
  file's standing rule and this role's limits all say the same thing: a gate reports, a human decides.
  The number is wrong in the ticket and it is still wrong in the ticket.
- **No criterion, FEN or expected string edited**, and QE's five criteria gaps **not closed** — they
  are BA/PM's, they bear on neither half of this gate, and closing them from here would be scope a
  gate took because it could.
- **`memory-bank/50-decisions/ADR-0004-san-ownership.md`** — not opened, not amended. No `parseSan`
  written, nothing proposed for `src/`.
- **`ABC-016`, `ABC-017`, `ABC-018`, `ABC-024`, `EPIC-002`, `EPIC-003`** — not edited. No ticket cut;
  the four risks are handed forward with owners, not filed as scope by this role.
- **`memory-bank/30-architecture.md`** — still owed `san.ts` and `history.ts` per `ADR-0004`'s
  Consequences, still not fixed here. Flagged by the Engineer and by QE; the debt predates all three
  hops and is a documentation ticket for BA/PM.
- **Two stale figures in the ticket left alone**, both already on the record and both adjacent-document
  edits: `## Board history`'s byte count (3,598, and the file is now 46,384) and the "52 expected
  strings" that QE recounted at 68. This gate adds nothing to either but confirms neither has moved.
- **No branch merged, nothing deployed, no other board column touched.** The `Ready for UAT` exit is
  the UAT Planner's.

## The harness

Read-only against the repository, in this session's scratchpad, **not committed** — the same position
BA/PM, the Engineer and QE took with theirs:

| file | what it is |
|---|---|
| `bench.ts` | `N1`–`N4` on two builds × two protocols × two samples, with the null floor, the timer floor, the group means and the per-move top-5 |
| `refbuild.ts` | the REFERENCE `toSan` that allocates a rivals array per call — the control that turns "is it a slower build?" from an argument into a measurement |
| `frame.ts` / `longgame.ts` | `NFR-002`'s SAN component at 16 / 40 / 120 / 300 plies, full render and bounded pane |
| `ratio.ts` | `N1`'s ratio at five positions — the diagnostic that found it is not position-independent |
| `bound.ts` | the output length and character set over 351,644 strings — the security half's measurement |
| `board-write.py` / `trace-write.py` | the board, history, ticket and traceability writes, with every byte check made by machine |

Every import is by **absolute** path into `src/`; nothing was copied into the repository and no
dependency was added anywhere. `src/san.ts` was never opened for writing at any point in this hop.
