---
id: 20261010T144155Z-architect-design-decision-abc072-a2-a5-delivered-abc073-folded-66a8bfa8
kind: decision
by: architect-design
at: 2026-10-10T14:41:55Z
verified_by:
confidence: high
refs:
  - ABC-072
  - ABC-073
  - ABC-055
  - ABC-065
  - ABC-042
  - ADR-0036
  - memory-bank/50-decisions/ADR-0036-abc041-clause-b-is-a-delta-test-on-the-production-capability-surface.md
  - plans/tickets/ABC-072-abc041-clause-b-is-a-state-predicate-with-a-one-limb-instrument.md
  - plans/tickets/ABC-073-clause-b-misreading-has-propagated-to-eight-ticket-pages.md
  - plans/tickets/ABC-055-board-renders-ten-of-thirteen-columns.md
  - .grugops/queue/pending/design-ABC-072.md
  - .grugops/context/design-ABC-072/probe/clause-b.mjs
  - .grugops/context/design-ABC-072/probe/RUN.txt
  - .grugops/context/pull-abc065-066-2026-08-16/notes/20260816T030000Z-orchestrator-decision-abc065-merged-and-why-security-nfr-was-skipped-9f2b81d4.md
  - .grugops/context/design-owed-rulings-2026-10-10/notes/20261010T134751Z-architect-design-decision-six-owed-rulings-pointers-r5b-ticket-delta-95c73721.md
  - 20261010T144155Z-architect-design-observation-clause-b-instrument-readings-fixtures-mutants-self-run-23cfa14f
supersedes:
---

# `ABC-072` `A2`–`A6` met; `ABC-073` folded and met on its live set (`ABC-055`); clause (b) has one citable text and a three-command instrument that sees all three limbs

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
- **Branch:** `grugops/ABC-072-clause-b-delta`, from wave tip `6bfc7b29`.
  - **Delivered commit:** `088e48db`. It holds the ADR block and the two `## Security / NFR
    triggers` edits.
  - **Record commit:** follows it, with this note, `probe/`, the trace rows and the two `§ Delivery`
    sections.
  - This is the same build/record split `ABC-058` used.
- **Not merged, not pushed.** Not touched: `src/`, `plans/board.md`, `AGENTS.md`, any `column:` or
  `status:`, and any DoR score.
- **Readings:** `…23cfa14f` and `probe/RUN.txt`.

## What was decided

1. **The canonical text lives in `ADR-0036` § Canonical clause (b),** as a dated block. A later page
   cites that path and heading, then gives its own (b1)/(b2) facts.
   - **Why the ADR and not a note.** An ADR is where a future reader looks for a rule. `A6` and the
     ADR's own § Consequences allow either home.
2. **The instrument is one AST script, run three times, once per limb**
   (`.grugops/context/design-ABC-072/probe/clause-b.mjs <base> <head> <1|2|3>`).
   - **Why the AST.** (b2) needs runtime import edges, and a grep cannot read them. Two examples are
     a multi-line `import { … }` (`ABC-082`'s fourth edge) and an inline `type` specifier, which
     still loads its module. Telling "code" from "comment or string" also needs a parser, and
     `RegExp.prototype.exec` needs to be told apart from `child_process.exec`.
   - **Why it is not new tech.** `typescript` 5.9.3 is already a devDependency (`tsc --noEmit` is
     the typecheck gate). Nothing new is installed.
   - **Where it lives.** The script sits in this task's `probe/`, as every instrument on this board
     does. `tools/` and `src/` are outside `A6`, and the ticket says "zero tests".
3. **Two readings of `ADR-0036` § Decision are settled in the block.** The ruling itself does not
   move.
   - **(b2) is the runtime closure ("holds, or reaches at runtime").** It is a superset of the rule's
     wording and matches the ADR's own "newly reachable" sentence. It only widens, the safe
     direction. At `6bfc7b29` it moves no answer.
   - **§ Alternatives 3's `cli-options.ts` example was wrong.** That module reaches no capability at
     runtime: it uses `import type` only, and its "spawn" is a comment word. The example is corrected
     to `glyph-mode.ts`, and the verdict is unchanged.
4. **`ABC-073`'s repair on `ABC-055` is a citation swap with the page's own facts.** Those facts are
   `plans/board.md` plus one `history/` file only if a header is replaced: 0 production files. The
   fail-safe is kept. Only the `## Security / NFR triggers` section moves.
5. **`ABC-072`'s own Security bullet gains a dated ruled line.** The page is not `Done` and it
   quotes the clause, so `ABC-073` `A1` covers it. The two-reading text stays, as the record of the
   defect.

## Per criterion

**`ABC-072`**
- **`A1` MET**, by `ADR-0036` (accepted earlier). Not re-done.
- **`A2` MET.** The corrected text appears once, in `ADR-0036` § Canonical clause (b) § "The clause
  (`A2`), stated once". It names itself as the place to cite.
- **`A3` MET.**
  - **Three commands, one per limb.** Each prints its unit: import statements, read sites, call sites
    in code. Word hits are listed, never counted.
  - **All were RUN and recorded.** Baseline **0 / 3 / 0** (36 files at the tip; 35 at `f76e041`,
    with the named files).
  - **Fixtures:** `ABC-042` **FIRES**; `ABC-082` and `ABC-059` do not. All three match.
- **`A4` MET.** The block carries no prediction, and "is the hop that ends it" occurs 0 times in it.
  It states the measured fact: `ABC-042` merged @ `dbaf972`, and limb 1 is still 0 across all 36
  production files.
- **`A5` MET.** One sentence: (b) did NOT fire on `ABC-065`, and its merge is not re-opened. The
  Orchestrator's skip note is cited by path.
- **`A6` MET on `088e48db`.**
  - `git diff --name-only` lists 3 paths: the ADR, `ABC-055` (the fold's live set) and `ABC-072`.
  - **0** paths under `src/`.
  - `ABC-041`, `042`, `065` and `066` are byte-identical by blob SHA.
  - The suite is green (1608), and the skip count is 0.

**`ABC-073`** (folded; `ABC-072` `A6` is the binding path list)
- **`A1` MET.** After the hop, the non-`Done` pages returning either grep are `ABC-072` (now in the
  ruled form) and `ABC-073` (this page, excluded). The "unruled" grep returns 0 non-`Done` pages,
  this page excluded. `ABC-055` returns neither grep, and it cites the canonical block.
- **`A2` MET.** `ABC-055` carries the fail-safe, counted over normalized text: 1 of 1.
- **`A3` MET.** The set is one page, and it gives its own facts. No other live page shares the
  answer.
- **`A4` VOID**, as the page records: `ABC-053` is `Done`.
- **`A5` MET.**
  - **`ABC-055`'s single hunk is `@@ -133,3 +133,4 @@`.** It sits inside `## Security / NFR
    triggers`, which runs from `:127` to `:139`.
  - **`## Acceptance` is byte-identical.**
- **`A6` MET**, read inside `ABC-072` `A6`. The live set contributes exactly `ABC-055`, and there are
  0 new files.

## Follow-ups (not done here)

- **Security/NFR, at `ABC-072`'s gate.** Confirm the limb list; it is a security bar. The § "Known
  limits" bullet in the block names the widenings left as word hits.
- **The Orchestrator.**
  - Route on the three commands and cite `ADR-0036` § Canonical clause (b).
  - The board moves are yours. `ABC-073` closes with `ABC-072`.
- **The owner.** The `ADR-0036` veto question stands as asked in `…95c73721`. A veto rewrites the
  block's clause to STATE. The instrument's (b1) and (b2) readings stay usable as the "what changed"
  half.
