---
id: 20260811T131500Z-software-engineer-artifact-ref-13b601be
kind: artifact-ref
by: software-engineer
at: 2026-08-11T13:15:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - src/status-panel.test.ts
  - src/__snapshots__/status-panel.test.ts.snap
  - plans/traceability.md
supersedes:
---

# What `ticket-to-pr-ABC-016-d19b` produced, by reference — and the board move it REQUESTS

> **Hand-authored** — see this hop's `decision` note for why. **Nothing here is a `finding`.**

## Branch and files

Worktree `../cli-chess-ABC-016`, branch `grugops/ABC-016-status-panel`. `git rev-list --count
HEAD..main` = **0** behind, 7 ahead — re-checked myself, not taken on trust. No git remote in this
repo, so no PR is opened; branch plus gate, as `AGENTS.md` records. **Nothing merged, nothing
deployed, nothing pushed, no `git checkout main`.**

| file | change |
|---|---|
| `src/status-panel.test.ts` | **+29 / −1.** One `PLAYED_CHECK` ply-list const, one `CASES` entry (`played check 3.Qxe5+`), five cell assertions appended to the `A2` test, and that test's name extended |
| `src/__snapshots__/status-panel.test.ts.snap` | **+6 / −0.** One new snapshot key. No existing key moved or changed — vitest keys by test name, not index |
| `plans/traceability.md` | **ONE line changed** — `ABC-016`'s row, two cells (`Code`, `Tests`), appended to |
| `.grugops/queue/claimed/ticket-to-pr-ABC-016-d19b/` | the Workflow 17 claim: `pending/` → `claimed/`, plus the now-running registry record |
| `.grugops/context/ticket-to-pr-ABC-016-d19b/notes/` | 4 hand-authored notes — this one, a `decision`, an `observation`, a `claim` |

**ZERO PRODUCTION LINES.** `git diff --name-only -- src/` filtered of `*.test.ts` and
`__snapshots__/` is **EMPTY**: `src/status-panel.ts` is byte-identical to the delivered tip. BA/PM's
measurement that the delivered panel already renders this case correctly **holds** — the case went
green on the first run against untouched code, so there is nothing to flag on that axis.
**`src/status-panel.nfr.test.ts` came back untouched**, as the ruling asked; two things I noticed
*in* it are flagged in this hop's `claim` note and were not fixed. Nothing matching
`src/turn-loop.*` (`ABC-019`'s) or `src/frame.test.ts` (`ABC-017`'s per `ADR-0009` cl. 5) was created
or touched. **No `plans/board.md` byte written and no ticket front matter written** — both the
Orchestrator's.

The `plans/traceability.md` edit was made under byte-level guards rather than by eye: the row's naive
pipe-field count was asserted **12 before and after**, every appended string was asserted pipe-free
and newline-free **before** writing, and after writing **all 250 other lines were re-read and asserted
byte-identical by md5**, with the file's 251 line count and 36 table lines unchanged. One line
changed — the same footprint, and the same one row, as the previous dev hop and as BA/PM's hop. The
`_Updated:` header was deliberately **not** touched: `git show` on both prior hops shows each changed
exactly one line and left that header to the Orchestrator.

## The measurement harness, out of tree and deleted

A `probe/` directory at the **worktree root — never under `src/`**: a copy of the panel mutated to
read the check indicator and the balance from item 4's replay position, a copy of the acceptance file
pointed at it, and two throwaway probes for the live-vs-replay FENs. Run with `npx vitest run
probe/<file>`, then **deleted**; `git status` was read after the delete and is clean of them. Results
in this hop's `observation` note. No wall-clock assertion was involved and none entered the suite
(`src/zobrist.nfr.test.ts:112`'s standing rule).

## Gates, run by me in this worktree

| gate | before | after |
|---|---|---|
| `npm run lint` | exit **0** | exit **0** |
| `npm run typecheck` | exit **0** | exit **0** |
| `npm run build` | exit **0** | exit **0** |
| `npm test` | **707/707**, 24 files | **708/708**, 24 files |
| skip count | **0** | **0** |

The baseline row is my own re-run of the Orchestrator's stated 707/707, not an inherited figure. The
+1 is the new snapshot entry; the five new assertions live inside the existing `A2` test and move no
count. **These are an observation, not a gate verdict** — the §14 gate is the authority and no
`§14-gate#<id>` stamp is issuable to me.

## Every criterion, stated plainly

**`A1`–`A14` are ALL met.** Criterion by criterion, and the three that need a sentence rather than a
tick:

- **`A2` — met, and this hop is why.** The played check `1.e4 e5 2.Qh5 g6 3.Qxe5+` is written, with
  all four pinned cells (`CHECK`, `Black to move`, `3...`, `last: Qxe5+`, `material: +1`) asserted on
  one render. It is the ticket's only capture and its only check reached by play, and it is the only
  thing on the ticket that fails the replay-reading build — constructed and run, see the
  `observation` note.
- **`A13` — met, at zero lines, by BA/PM's ruling and not by me.** Both halves of the replacement
  clause are already asserted in delivered `src/status-panel.nfr.test.ts`: the direct half at
  **`:130-132`**, the difference half at **`:140-149`**. I re-read those lines rather than reporting
  "met" on a file I had not opened. The four zero-counts, `toSan` 1 and 0, and the 64-square scan are
  untouched and still assert.
- **`A14` — met on the previous hop's measurement, NOT re-run at this hop, and it cannot have
  moved.** 5.68 / 8.07 / 9.94 µs at 40 / 120 / 300 plies (Apple M3 Mac15,13 / Node v24.12.0 /
  darwin-arm64): worst 0.40x of the 25 µs bar, spread 1.75x against the 3x bar. `src/status-panel.ts`
  is byte-identical to the tip those figures were taken on, so the figures still describe the shipped
  panel. Stated as inherited-and-still-valid rather than re-measured, because that is what it is.
- `A1`, `A3`–`A12` — each asserted by a named test, and `A10`/`A11`/`A12` now iterate **15** cases
  rather than 14, so the new case is inside purity, row count and the ASCII scan as `## Test notes`
  intended.

One honest residual, and it is the ticket's own admission rather than a gap this hop opened:
**`A11`'s *"read from the module's own export"* clause remains an instruction about the test file
rather than an assertion a test can make.** The ticket says so, BA/PM re-read it at the ruling hop and
deliberately left it. `STATUS_ROWS` **is** imported from `./status-panel.ts` at
`src/status-panel.test.ts:37` and `expect(STATUS_ROWS).toBe(3)` asserts the value; nothing mechanical
stops a future editor replacing that import with a local shadow. Recorded so "all met" is not read as
"nothing left to know".

## The board move I am REQUESTING, not making

**`ABC-016`: `In Development` → `In Review`.** Read off `plans/board.md` as it stands: In Development
**1/3 → 0/3**, In Review **1/3 → 2/3** (joining `ABC-019`). Under the limit of 3, no override needed
and no WIP limit approached.

The reason the ticket can go forward again is narrow and checkable: it went back because `A2`'s case
was unwritten and an acceptance criterion with no test behind it is not met. It is written, it is
green, and it kills the build it exists to kill. `A13`, the defect that started this, cost zero lines.

**QE next, on this branch, against the amended criteria** — which is what holding it back was for.
One thing worth handing QE explicitly, from the `observation` note: the fifteen snapshots are a
regression record and are **worth nothing as a mutant net** — the replay-reading mutant passes all
fifteen. The discriminating power is entirely in the explicit `toContain` assertions.

## Two flags carried forward, neither blocking, neither mine to resolve

1. **The width question is untouched, as instructed.** No width reserved, no string changed, no width
   clause written. One datum only, in the `decision` note: the new case's widest row is **26**
   columns, inside the already-flagged 17 → 67 swing. Owner remains Architect/Design.
2. **Two hygiene items in `src/status-panel.nfr.test.ts`** — a comment at `:134-139` that still
   describes `A13` as unsatisfiable after it was ruled and repaired, and the difference half's
   unasserted premise (`withSan - sanAlone === 1` is also `1 - 0`). Both in this hop's `claim` note,
   with the one-line close for the second that does **not** restate `san.ts`'s count. **BA/PM's to
   decide**, and neither blocks review.

Nothing was relayed to the `ABC-019` BA/PM or to the Architect/Design hop, and no channel to either
was opened. On-disk shared context is the only channel and these notes are all of it.
