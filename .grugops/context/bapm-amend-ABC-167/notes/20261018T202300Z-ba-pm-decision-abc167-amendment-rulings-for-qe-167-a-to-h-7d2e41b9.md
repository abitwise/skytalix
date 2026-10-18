---
id: 20261018T202300Z-ba-pm-decision-abc167-amendment-rulings-for-qe-167-a-to-h-7d2e41b9
kind: decision
by: ba-pm
task: bapm-amend-ABC-167
at: 2026-10-18T20:23:00Z
verified_by:
confidence: high
refs:
  - ABC-167
  - plans/tickets/ABC-167-a-capability-free-uci-session-answers-the-d3-commands-with-the-d4-time-rule-and-the-go-limits.md
  - ADR-0044
  - EPIC-007
  - QE-167-a
  - QE-167-b
  - QE-167-c
  - QE-167-d
  - QE-167-e
  - QE-167-f
  - QE-167-g
  - QE-167-h
  - 20261018T201300Z-qe-e2e-decision-abc167-verdict-pass-with-gaps-e100c23c
  - 20261018T201200Z-qe-e2e-observation-abc167-break-attempts-and-n8-lane-44fa966c
  - 20261018T193740Z-software-engineer-decision-choices-the-page-left-open-297da9e5
supersedes:
---

# ABC-167: BA/PM rulings on QE-167-a..h and on SE choices 1–5

This note is hand-authored and unsealed: this install has no `context-io.ts`. It records a decision, not a finding.

The ticket page's dated `Amended 2026-10-18` lines are authoritative. This note indexes them.

**The evidence.** Every expected figure was read on tip `4dbbfbd8`, on `virtualClock`, in a scratch copy of its
`src/`. No repository worktree was touched. The scripts and their output are in `probe/rows.ts`, `probe/rows2.ts` and
`probe/rows.out`.

| gap | ruling | basis | rows |
|---|---|---|---|
| QE-167-b MEDIUM | Six D4 rows below the 3 000 ms cap, each on step 1 with `G ≤ time ≤ G + 2`. Expected G: 600, 100, 200, 300, 300 | ADR D4.1 | `A5-b1`..`b5` |
| QE-167-c LOW | Overhead pinned by `go wtime 100 btime 100 winc 1000 binc 1000` → G 50. The 1 ms row is kept. M09/M10 are accepted as observationally equivalent | ADR D4.1 | `A5-c1` |
| QE-167-a MEDIUM | The printable check runs on two echoing inputs, and each asserts the ESC-dropped echo (`e2e4[31m`, `[31m`) | ADR D3, `cli.ts` `printableOf` (drop) | `A4-a1`, `A4-a2` |
| QE-167-d LOW | `go ponder` holds, `time` is 3 000 (+2·step), and `ponderhit` releases once | ADR D4.1, D4.3 | `A6-d1` |
| QE-167-e LOW | A held `bestmove` is never dropped. `stop`, `ponderhit`, `go`, `position`, `ucinewgame` and `quit` write it first; `isready` and ignored lines leave it held | D5 "one bestmove per go", D3 spec quote | `A6-e1`..`e5` |
| QE-167-f LOW / choice 2 | Ms tokens take `-?\d+(\.\d+)?`, and `movestogo` takes a positive integer. An unreadable value is dropped with one `info string`. **A keyword is never a value** | **not decided by the ADR; owner may overrule** | `A7-f1`..`f3` |
| choice 4 / QE-167-h | `searchmoves` consumes up to the next `go` keyword (ratified) | **owner may overrule** | `A7-h1` |
| choice 5 / QE-167-h | `nps = round(N × 1000 / max(1, T))` (ratified) | **owner may overrule** | `A3-h1` |
| choice 1 / QE-167-h | A new session starts at the start position | ADR D3 (implicit) | `A9-h1` |
| QE-167-h (A8) | The constants-only `ceil` row counts for nothing. No change is required | — | — |
| QE-167-g LOW | Cheap part, amended: the banned-module check matches every import form. Bracket access to globals goes to the `In Security/NFR` hop, with no follow-up ticket unless that hop asks for one | — | `A11-g1` |

**The QE-167-e rows, split by authority.**
- **Decided by D5:** `A6-e1`, release on a new `go`.
- **BA/PM recommendations, owner may overrule:**
  - `A6-e2`/`e3`: `position` and `ucinewgame` release first.
  - *Why:* a line still held would answer in a position the GUI has already replaced (`bestmove h8g8` after
    `position startpos`).
  - *The alternative:* keep holding, as the tip does.
  - `A6-e4`: `quit` releases. This is a reading of D5.

**Rows the tip fails, so the SE fix hop changes code for them:**
- `A6-e2`, `A6-e3` and `A6-e4`: the release on `position`, `ucinewgame` and `quit`;
- `A7-f1`: the valueless-keyword boundary.

Every other new row passes at the tip and is added as a test row only. `A11-g1` widens the test's import regex.

**The ticket.** DoR is still 10/10, and the size is still `S`.
