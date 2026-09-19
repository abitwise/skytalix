---
id: 20260919T104000Z-architect-design-decision-dbcad81f
kind: decision
by: architect-design
at: 2026-09-19T10:40:00Z
verified_by:
confidence: high
refs:
  - ABC-100
  - EPIC-006
  - ADR-0018
  - ADR-0007
  - NFR-007
  - memory-bank/50-decisions/ADR-0018-distribution-channel-git-clone-npm-run-chess.md
  - memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md
  - plans/epics/EPIC-006-game-session-and-packaging.md
  - plans/nfr-catalog.md
  - plans/traceability.md
  - memory-bank/30-architecture.md
  - memory-bank/70-runbook.md
  - .grugops/context/owner-rulings-2026-09-19/notes/20260919T100000Z-orchestrator-decision-six-owner-rulings-verbatim-3c9e1f42.md
supersedes:
---

# `ABC-100` delivered: the channel is `git clone` + `npm install` + `npm run chess`, on the owner's word, "for now" — `ADR-0018` supersedes `ADR-0007` clause 5 only

**NOT A STAMP.** `context.human_admission` is `off`; this is a hand-authored `decision` per
`agent-factory/contracts/context-note.md`. No `finding` is admissible on this install and none is
recorded. The `at` is set after the enqueue (`2026-09-19T10:05:00Z`) so replay order is honest; the
machine clock at the hop read 2026-09-18T21:24Z, which is noted and not hidden.

## Authority (cited, not restated)

`.grugops/context/owner-rulings-2026-09-19/notes/20260919T100000Z-orchestrator-decision-six-owner-rulings-verbatim-3c9e1f42.md`,
ruling 1. The owner's word, verbatim: *"1. git clone + npm start works for now"* — Olger Oeselg,
project owner, in session, 2026-09-19. Copied, not paraphrased, into `ADR-0018` § Status.

## Scope of what was decided here (this role's part, kept apart from the owner's)

The owner chose the channel. Architect/Design decided only:

1. **`npm start` maps to `npm run chess`** — `package.json` has no `start` script (measured); adding one
   is a `package.json` edit forbidden by `ABC-100` `A6` and fenced by `ABC-042` `A10`. The owner's
   words are honoured as the shape (clone, then run the game via an npm script); the as-built script is
   `chess`. A `start` alias is a later gated ticket's call and is explicitly **not** a `D2` event.
2. **Five options priced before the choice was recorded** (npm publish, standalone binary,
   `git clone` + `npm start`, `npx` off a git URL, "not yet"), each with the four costs `ABC-100` `A3`
   names plus the `NFR-007` window and the supply-chain surface — the ADR's Alternatives table.
3. **`NFR-007`'s denominator**: *from `npm run chess` on a completed clone (after `npm install`) to the
   first rendered board*; *"warm npm cache"* is meaningless under this channel. Bar `< 2 s` untouched;
   figure stays `UNKNOWN - verify`. Not measured — that is the packaging ticket's.
4. **Revisit triggers** for "for now": the owner asks for a publish/package/binary/`npx`; a second
   user is blocked by the clone path; a git remote appears (`D3`); criterion 1 is measured and fails.
5. **Falsifiers `D1`–`D7` carried forward** in `ADR-0007`'s shape, re-measured at this hop (see the
   sibling `observation` note), with `D2` and `D7` explicit. No `D8`.
6. **What does not move**: `production_requires_human_confirmation` (`true`, re-grepped), the posture,
   both config dials, the gate, the branch guard, the merge posture.

## `ABC-100` `A1`–`A7` — assessed by this role, checkable by inspection

| # | criterion | verdict | how checked |
|---|---|---|---|
| `A1` | ADR exists, `status: accepted`, one channel, supersedes clause 5 only; `ADR-0007` ≤ 2 changed lines | **MET** | `memory-bank/50-decisions/ADR-0018-distribution-channel-git-clone-npm-run-chess.md`; `git diff --numstat` on `ADR-0007` = `2 0` (one pointer line + one blank) |
| `A2` | verbatim, dated, attributed owner quotation in `memory-bank/`; `git log -S` names its commit | **MET** | `grep -rn 'git clone + npm start works for now' memory-bank/` hits `ADR-0018` and `70-runbook.md`; `git log -S` on it will name this hop's commit (and the earlier `60-progress.md` transcription at `2c96dbd`, which is the same quotation) |
| `A3` | ≥ 3 options priced, each with `package.json` keys / build emit / remote precondition / `NFR-007` effect; no rejected option without a cost | **MET** | five options, seven columns, in `ADR-0018` § Alternatives; the winner is priced too |
| `A4` | falsifier rows in `ADR-0007`'s shape; `D2` and `D7` explicit | **MET** | `ADR-0018` § What would falsify this, `D1`–`D7`, same ids |
| `A5` | flag reads `true`; no document produced here argues it obsolete | **MET** | `grep production_requires_human_confirmation .grugops/factory.config.json` → `true`; `ADR-0018` Decision 5 and `D7` forbid the inference by a third route |
| `A6` | zero files under `src/`, zero `package.json` changes, no new file under `plans/releases/` | **MET** | `git diff --numstat` at the commit shows only `memory-bank/`, `plans/`, `.grugops/` |
| `A7` | `EPIC-006`'s four `npx` mentions and the `NFR-007` TWO-DOCUMENTS-DISAGREE item updated to the named channel | **MET** | `EPIC-006` `:206` `:222` `:252` `:257` repaired with dated `[REPAIRED …]` markers; `NFR-007` row tail and the 2026-08-06 block carry `[CLOSED …]` / `[RESOLVED …]`; `grep -n npx` on the epic now hits only dated history and the repair markers' "was" quotes |

**Recommendation to the Orchestrator: `A1`–`A7` are all met; `ABC-100` may move `Backlog` → `Done`.**
The board row was **not** moved by this role. The delivered diff carries zero production lines, so the
2026-08-17 UAT waiver applies by measurement; that is *merged and gated*, never *accepted by a human*.

## Interpretations surfaced rather than picked silently

- **The `NFR-007` denominator edit.** The catalog's 2026-08-06 block says *"Security/NFR owns that edit
  and does not own the choice."* The subtask said *"update the row text, not the bar."* Both were
  honoured as far as they can be together: the `< 2 s` bar is byte-identical, the denominator was
  restated so the row and the ADR do not disagree, and the row and the ADR both say Security/NFR may
  re-state the wording at the measuring hop. If the Orchestrator prefers the `Target` cell reverted and
  the denominator left only in the ADR, that is a one-cell revert.
- **"Append a traceability row"** was read literally: a new delivery row for `ABC-100` at the end of the
  matrix; the 2026-08-16 cut row stands untouched. The file's other convention (touch in place,
  append within cells) was not used because the instruction said append a row.
- **`memory-bank/30-architecture.md` and `70-runbook.md`** were not in the subtask's list but each
  restated "UNDECIDED", and the runbook said in its own text it would be *"the first place that has to
  change"*. One dated pointer each; nothing else in either file moved.

## Fences honoured

Zero files under `src/`; `package.json`, `AGENTS.md`, `plans/board.md`, `.grugops/factory.config.json`
untouched. Not merged, not deployed. Branch `grugops/ruling-abc100-distribution` from `2c96dbd`.
