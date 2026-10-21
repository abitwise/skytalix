---
id: 20261021T093350Z-architect-design-decision-3951361a
kind: decision
by: architect-design
at: 2026-10-21T09:33:50Z
verified_by: 
confidence: high (code read at 87d3897d; QE plants …7f56f339; main state read at 5d643991)
refs:
  - ABC-163
  - AR-095-L1UNIT
  - ADR-0036
  - grugops/arch-ABC-163-adr-text
  - e7385671
  - 2270c8fa
  - 87d3897d
  - d8c073e2
  - 341da4c1
  - 20261021T091931Z-architect-design-decision-a7d9c818
  - 20261021T093040Z-qe-e2e-decision-8a60d7c8
  - .grugops/queue/claimed/arch-ABC-163-adr-text/arch-ABC-163-adr-text.md
  - G-1
  - G-2
  - AR-095-CWD
  - AR-162-FALLBACK
  - AR-180-VALIDATED
  - f459353e
  - e9cee72d
  - 20261021T093010Z-qe-e2e-observation-7f56f339
  - 20261021T093020Z-qe-e2e-observation-47186969
  - 20261021T082900Z-security-nfr-decision-06c147db
  - src/book-file.ts
  - security-nfr-ABC-163
supersedes: 
seal: sha256:707afd63481547e16172bb8440428b6d0176e87ef13996f80e2e2de2d9b33419
---

# Decision 1: the `…a7d9c818` replacement text is applied to `ADR-0036` § S1 at `e7385671`, with five changes. QE's result made three of them, and `main` made one

**Said first: the changes to the `…a7d9c818` text.** The four owed precisions are all applied. These five changes
differ from the text as it was sealed:
1. **QE: limb 1's output lines.** The text said "Limb 1 prints one added line". The code at `87d3897d` prints the
   `(b1) Ruling 2 …` line, plus one indented line for each holder file that Ruling 2 names. QE measured 1 line, or 2
   where `src/book-file.ts` is named (`…47186969`). The ADR now says so.
2. **QE: the deletion-only gap is restated to match QE's plants** (see G-1 below).
3. **QE: the close.** QE read `A1`–`A3` MET with its own plants (`…8a60d7c8`). The paragraph now says that, and that
   `AR-095-L1UNIT` closes at the merge. The readings list adds `qe-ABC-163` and this task.
4. **`main`: the `AR-095-CWD` clause is dropped.** `…a7d9c818` said the instrument takes over `AR-095-CWD`'s interim
   control. That is stale. `AR-095-CWD` closed at `ABC-162`'s merge (`f459353e`; Security/NFR `…06c147db` § 1). Its
   successor `AR-162-FALLBACK` closed at `ABC-180`'s merge (`e9cee72d`). The live dependent is now `AR-180-VALIDATED`
   (`…73eb06c5`). Its close condition names `AR-095-L1UNIT` closed, and until then it accepts Ruling 2 by hand. The
   ADR now says the Orchestrator keeps the by-hand check until the merge, and that `AR-180-VALIDATED` names this
   merge.
5. **G-3's note is added** (decision 2).

**G-1: the gap the text names, checked against QE's plants (`…7f56f339`).**
- **The rule.** The text says a file that holds limb 1 at `<base>` or `<head>`, touched only by deleted lines, has no
  `+` line, so Ruling 2 does not fire. The code agrees: `ruling2` skips any file whose `added` set is empty, and a
  file deleted at `<head>` never enters `added`.
- **QE's three plants are each covered.**
  - The guard line deleted: a holder at both ends with no `+` line.
  - The import line deleted: a holder at `<base>` only.
  - Rename with the import dropped: the old path is deleted, a holder at `<base>` with no `+` line. The new path holds
    at neither end.
- **The by-hand check** fired on all three. The ADR says so.
- **QE's G-2 uncomment plant** is a holder at `<head>` only, so the rule covers it too. The ADR marks it as
  pre-existing, on every limb, and not from this fold.
- **One change from `…a7d9c818`.** It said the case re-opens at § S1's re-armed § Decision 3 trigger. QE's guard-drop
  plant shows a narrower trigger. A read whose path is built over more than one line can also change by deletion
  alone, with no caller-supplied value. So the ADR now names "a guard, or a read whose path is built over more than one
  line" first, as QE proposed. The re-armed trigger still applies as well.
- **Today's holder** (`src/book-file.ts:15-17`, read at `2270c8fa`) is one read of one fixed path in one line, with
  no parameter. No deletion widens it.
- **Risk is Security/NFR's.** This text states the gap and when it becomes live. It does not rate the gap. If
  Security/NFR's parallel ruling on G-1 changes the text, the Orchestrator re-routes.

**Commit.** `e7385671` on `grugops/arch-ABC-163-adr-text`, from `2270c8fa` (QE's tip). It changes `ADR-0036` only,
+27/−4, in the paragraph under `#### Ruling 2 folded — 2026-10-21 (ABC-163)`. `ADR-0036` has had no change on `main`
since `ccccc6bb`, so the merge has no conflict there.

**NFR impact: none.** The change is docs only. `plans/nfr-catalog.md` is unchanged.
