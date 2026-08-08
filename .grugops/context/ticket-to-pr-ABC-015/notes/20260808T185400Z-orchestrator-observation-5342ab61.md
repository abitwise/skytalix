---
id: 20260808T185400Z-orchestrator-observation-5342ab61
kind: observation
by: orchestrator
at: 2026-08-08T18:54:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-015
  - ABC-015
  - src/glyph-mode.ts
  - src/glyph-mode.test.ts
  - src/glyph-mode.nfr.test.ts
  - plans/traceability.md
  - plans/board.md
  - 20260808T184400Z-software-engineer-observation-d51e83c7
supersedes: 
---

# Engineer's hand-off checked, not inherited — gates re-run, and one flagged defect does not exist

## The gates, re-run by this role on the branch tip `7024789`

Not carried forward from the Engineer's report. Run here, now, on
`grugops/ticket-to-pr-ABC-015`:

| Gate | Result |
|---|---|
| `npm test` | **271/271, 13 files** |
| skip count (the `AGENTS.md` command) | **0** |
| `npm run lint` | exit **0** — "Checked 29 files. No fixes applied. Found 2 infos." |
| `npm run typecheck` | exit **0** |
| `npm run build` | exit **0** |
| `git status --short` | clean — nothing uncommitted, no stray artifact |

`quality.mandatory_gates` is `["lint","typecheck","unit","build"]` and `gate_enforcement` is
`blocking`. All four are green. **This is not a §14 gate verdict and no `finding` is written** — no
§14 gate exists in this install to issue a stamp, and nothing here is self-stamped.

Arithmetic checked rather than accepted: `main` carries 253 tests on 11 files, this branch adds two
test files and 18 tests → 271 on 13. The Engineer's figures reproduce exactly.

## One of the three hand-forward items DOES NOT HOLD

The Engineer flagged: *"`plans/traceability.md`'s `ABC-015` row has 11 cells against a 10-column
header from an unescaped `|` in a TS union type."*

**Checked directly, and it is wrong.** The pipe **is** escaped — the row contains
`` `export type GlyphMode = "unicode" \| "ascii";` `` with a backslash. Splitting each row on pipes
**not preceded by a backslash**:

| Line | Cells |
|---|---|
| 36 (header) | **10** |
| 38 (`ABC-001`) | **10** |
| **54 (`ABC-015`)** | **10** |
| 55 (`ABC-016`) | **10** |

The `ABC-015` row has 12 raw pipes, of which **one is escaped** — 11 unescaped, the same as every
other row, which is 10 cells. **The table is intact and the escape is correct GFM.**

**This is recorded rather than dropped for two reasons.** First, so QE does not spend time chasing a
defect that is not there. Second, and more important: the "fix" for this non-defect would be to
**remove a correct escape**, which would actually break the row. A flagged non-defect that survives
into the next role's queue is how a good file gets damaged by someone being helpful.

The Engineer's method almost certainly counted raw pipes without accounting for the escape — the
same class of error as counting a document's summary of itself, which this task has now produced
twice, once by this role. **It takes nothing away from the rest of their work**, which reproduces.

## The other two items DO hold, and they are BA/PM's, not QE's

1. **Acceptance criteria 10 and 11 are blind to a single-signal session.** Both criteria move
   `isTTY` **and** the locale together, so the two always agree, and a session that forwards only
   one of them passes all eleven criteria while being wrong. The Engineer fixed the **suite**; the
   **criteria** still cannot see it. Amending an acceptance criterion is BA/PM's exit, not an
   engineer's and not this role's.
2. **An empty locale variable (`LANG=`) counts as UNSET** — ruled POSIX-style (fall through) by the
   Engineer at `confidence: medium`, because the nine tuples never construct it. It is an inference
   from row 4's rationale, not a specification. **This one can change code** (one condition in
   `selectGlyphMode`), so it is a real product question and not a wording tidy.

## Why BA/PM is queued BEHIND QE and not beside it

Both items are spec-level and neither blocks QE from breaking the delivered code. **QE goes first so
that whatever else QE finds joins these two in ONE BA/PM hop rather than two.** If BA/PM then
overturns the empty-locale ruling, that is a small dev change and a QE re-run — visible, and
recorded as its own loop, exactly as `ABC-011`'s second pass was.

Width stays **1 of 3**. Running them in parallel was considered and rejected: both roles would edit
`plans/tickets/ABC-015-…md` and `plans/board.md`, and this install has no lock — the queue claim
protects a *task*, not a *file*.

## A third item, pre-existing and correctly left alone

The tracked `coverage/` directory (22 files under version control) is stale by two merged tickets.
The Engineer restored it byte-identically after a `--coverage` run and flagged rather than fixed it.
**That is coding rule 12 applied correctly** — it predates this ticket and is not this ticket's to
change.

## Next action

QE/E2E breaks `ABC-015` and owns the `In Review` exit.
