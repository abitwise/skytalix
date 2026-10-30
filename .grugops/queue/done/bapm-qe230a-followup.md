---
subtask: bapm-qe230a-followup
role: ba-pm
ref: .grugops/context/bapm-qe230a-followup/
branch: new grugops/bapm-qe230a-followup from main, own worktree
---

# BA/PM: cut the QE-230-a follow-up ticket; fix ABC-230's stale Q3 line

Source: `qe-ABC-230/…ba5a249a` (verdict) gap QE-230-a. On levels 1–4 the blunder path's move that makes a third
occurrence is not scored as a draw: each child search starts after the move, and no search checks its own root for
repetition. ADR-0054 and ABC-230's A1 were met; this is a design gap, not a build fault.

## Do
- Cut a ticket (next free id) in EPIC-010: the problem, the probe evidence QE recorded, testable acceptance, size, and
  priority. State whether it needs an Architect reading (it likely touches ADR-0054 decision 2's level hand-off) and
  whether it is value-changing on levels 1–4 only, which decides whether the smoke pair applies, since the smokes play level 5.
  Note the overlap with ABC-241, which edits the same blunder-root key. Backlog, DoR scored.
- ABC-230's page: its text still says Q3 is open and (c) is a separate ticket. Add a dated line: Q3 answered (c) →
  ABC-241; ABC-230 Done at 24f3e322.

## Fences
- plans/epics, plans/tickets and your context only. No ADR, src/, tools/, data/ or board edits. An SE is building ABC-228:
  don't edit its page.
- Never push, force, amend or rebase. Never merge into main. No host paths. Never bare `npx`. Run nothing CPU-heavy (an
  SE timing read is in progress).

## Publish
- Seal notes (task `bapm-qe230a-followup`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus a 10-cell
  trace row into this brief, then move it and its claim.md to done/. If the worktree guard refuses the main checkout's
  queue, put the done/ move on your branch's tracked copy and say so.

## Result

*BA/PM, 2026-10-30, task `bapm-qe230a-followup`; records only, at `main` `691f9436`. Branch `grugops/bapm-qe230a-followup`;
records and notes in `8e028c94`, claim in `edaca301`, this result and the done/ move in the commit after.*

- **New ticket: `ABC-242`**, "On a blunder level (1–4), a root move that makes the third occurrence of a game position
  scores exactly 0, on the CLI and over UCI; every engine-path search is unchanged". EPIC-010, pull order 10 (after
  `ABC-241`). **Size S, priority P3, Backlog, DoR 9/10.** Row 10: the Architect reading.
  - **Acceptance:** A1 the third-occurrence root move scores exactly 0 (QE probe `d8e8` −1013 today, with and without
    keys); A2 a second occurrence keeps base's score; A3 untrimmed keys at root clock 0 keep base's; A4 CLI = UCI
    `Skill Level` 1–4 (list and move); A5 the `ADR-0032` d2 pick unchanged; A6 identity (no keys; engine path at every
    level); A7 the gates `G4`/`G5`/`G8`/`G9`/`G10`, the levels deep lane and the ladder lane (short); A8 the reading.
  - **Architect reading: yes.** Where the check lives, and whether it adds to `ADR-0054` d2/d3 or `ADR-0032` d1. If it
    amends an accepted ADR, the owner's acceptance is a second wait. The reading also gets one question BA/PM recorded
    and did not scope: in a child search, the parent root counts as pre-root (two matches), where the engine path
    counts it as path (one). Its effect is `UNKNOWN - verify`.
  - **Smokes: no, by BA/PM's reading, and the Orchestrator should confirm it.** The change is value-changing on levels 1–4 only.
    `tools/rating/rating.ts` sets no `Skill Level`, so every smoke and batch move is level 5's engine path, which A6
    proves node-equal. A8 is `EPIC-008` S2, with the ladder lane as the playing check. If the merge rule is read
    strictly, A8 becomes the smoke pair (≈ 1.2 h), and nothing else changes.
  - **Overlap with `ABC-241`:** both edit `src/levels.ts:142` (`createLevel`'s child-key line). This answers
    `ABC-241`'s `UNKNOWN - verify` on which module appends the root key. A child root with a reversible window carries no ep
    square, so the result does not depend on the order. Pull `ABC-242` after `ABC-241`. Whichever merges second rebases.
- **`ABC-230`'s page:** one dated line. Q3 answered (c) → `ABC-241`; `ABC-230` Done at `24f3e322`; QE-230-a →
  `ABC-242`. The historical "Q3 open" text is kept as written.
- **`EPIC-010`:** the ticket table (`ABC-242` row; rows from 10 renumbered; `ABC-230` Done; `ABC-241` Ready 10/10, as its
  page's front matter already says), one § Scope line, and one line under milestone 1 (`ABC-242` is in no milestone).
- **Notes** (sealed, task `bapm-qe230a-followup`, `at` 2026-10-30T06:51:15Z): `20261030T065115Z-ba-pm-decision-9788d230`
  and `20261030T065115Z-ba-pm-observation-dc9ca3bd`. `propose_note` was not available, so I wrote both with the plugin's
  `admitAndAppend`. The plugin path was resolved at run time and is not committed.
- **Queue:** the worktree guard refuses the main checkout, so the claim and the done/ move are on this branch's
  tracked copy. The main checkout's `pending/` copy stays until this branch merges.
- **Not done (outside this brief):** QE-230-b/-c (width 1 and its cost into `EPIC-010` § The merge rule). No board,
  traceability, ADR, `src/`, `tools/` or `data/` edits, and `ABC-228`'s and `ABC-241`'s pages are untouched. Nothing ran
  beyond reads and the note writer. Nothing was pushed or merged.

### Trace row (10 cells, header order)

| ABC-242 (cut) | QE-230-a: on a blunder level (1–4) the root move that makes the third occurrence scores exactly 0, CLI and UCI; second occurrence and untrimmed keys at clock 0 keep base's; engine path node-equal; ABC-230 page dated line (Q3 (c) → ABC-241, Done at 24f3e322) | EPIC-010 | — (Architect reading owed: ADR-0054 d2/d3 or ADR-0032 d1) | NFR-004 (G5 5 s ceiling at levels 1–4; ≤ 50 comparisons per root move), NFR-009 (no new per-search storage), NFR-008 (0 real-clock rows); smokes not applicable by BA/PM's reading (S2), Orchestrator to confirm; notes …9788d230, …dc9ca3bd | grugops/bapm-qe230a-followup @ 8e028c94 (records only): plans/tickets/ABC-242-…md (new), ABC-230-…md (one line), plans/epics/EPIC-010-…md, .grugops/context/bapm-qe230a-followup/notes/ (2) | none run (records only; an SE timing read held the host) | — (UAT owed at the build; QE verdict signs) | — | ABC-242 Backlog DoR 9/10 (waits the Architect reading; after ABC-241) |
