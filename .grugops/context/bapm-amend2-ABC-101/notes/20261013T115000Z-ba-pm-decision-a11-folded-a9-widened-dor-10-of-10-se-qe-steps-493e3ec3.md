---
id: 20261013T115000Z-ba-pm-decision-a11-folded-a9-widened-dor-10-of-10-se-qe-steps-493e3ec3
kind: decision
by: ba-pm
task: bapm-amend2-ABC-101
at: 2026-10-13T11:50:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - ABC-014
  - EPIC-002
  - RISK-005
  - NFR-002
  - WCAG-2.2-AA
  - 20261013T111916Z-orchestrator-decision-owner-word-abc101-uat-glyph-fix-in-scope-7b3805a0
  - 20261013T114409Z-orchestrator-decision-owner-word-abc101-swap-permanent-no-flag-cd4edd0e
  - 20261013T112345Z-frontend-ui-artifact-ref-abc101-piece-polarity-contract-1c687529
  - 20261013T114900Z-ba-pm-observation-a11-frames-cites-and-pins-checked-d17b61d6
supersedes:
---

# A11 folded into ABC-101, A9 widened by three files, ABC-014 and EPIC-002 annotated, DoR 10/10, `M` holds; the SE and QE steps

This note is hand-authored and unsealed. It is an agent `decision`, not a stamp. The ticket pages are
authoritative, and this note records why and what comes next. The readings are in `…d17b61d6`.

## Rulings (dated 2026-10-13, append-only, open)

1. **ABC-101 takes `A11a`–`A11g` and the glyph table verbatim** from Frontend/UI's contract `…1c687529`. A `diff`
   of the pasted lines against the contract is empty. Option (A) is the owner's word.
   - Scope gains one bullet: the polarity swap.
   - Out of scope gains three fences: a light/dark flag (and any follow-up ticket for one), ANSI colour, and
     background detection.
2. **`A11` is its own commit** on `grugops/ABC-101-difficulty-selection`, holding only the three files below.
3. **`A9` is widened by `src/render.ts`, `src/render.test.ts` and `src/__snapshots__/render.test.ts.snap`,** for
   `A11` only. Each file is bounded:
   - `src/render.ts`: `:77-82` and the comment at `:74-75`;
   - `src/render.test.ts`: the new `A11a`–`A11c` `it`s and the 8 re-pins named in `A11f`;
   - the snapshot: the 12 `unicode` bodies, with the 24 keys unchanged.

   New test files: 0.
4. **ABC-014 § Scope** has a dated note after the pairing bullet. **No criterion pins the old pairing, so none is
   amended.** The `U+2654`–`U+265F` and "different code points" criterion still holds after the swap.
5. **EPIC-002 `2c`** has one dated paragraph: the light-background case is covered by `--ascii`, by owner word,
   and no flag will be added. `2c` is at `:156-169`, where the contract places it.
6. **Triggers.**
   - `NFR-002`: not re-triggered. It is the same table lookup in a 9 × 18 frame.
   - Security: not triggered by `A11`.
   - WCAG 1.4.1: met by shape.
   - Contrast: `UNKNOWN - verify`.
   - UAT: needed (`src/render.ts` is production code). `A11g` folds into the held UAT.
7. **DoR 10 of 10, MET. Size `M` holds; `A11` is `XS`.** The split line gains (c), `A11`, as its own commit.
   **Priority `P1`.**

## INVEST, said plainly

`A11` does not depend on the difficulty half and could stand alone as an `XS` ticket. It is in ABC-101 because
the owner said so. Keeping it as its own commit preserves the split. I am not overriding the owner's choice;
I am naming it.

## The SE hop

The SE works on the existing branch `grugops/ABC-101-difficulty-selection`, at tip `98ea0a84`. That branch is
checked out in `../wt-ticket-to-pr-ABC-101`.

1. **Merge `main`, after this amendment has landed there.** Do not rebase.
   - Expect two end-of-file conflicts: the ticket page and `plans/traceability.md`. Keep both sides in date
     order: the branch's 2026-10-12 "Delivery — addendum" first, then the 2026-10-13 amendment.
   - Expect no `src/` conflict.
2. **Write the `A11a`–`A11c` `it`s in `src/render.test.ts` first,** and see `A11a` and `A11b` red on the old
   table (test note 6).
3. **Swap the six `GLYPHS.unicode` pairs in `src/render.ts`** (`:77-82`). Update the comment at `:74-75` to
   match the table. Keep the `[white, black]` order and leave the `ascii` table byte-identical.
4. **Re-pin exactly the 8 `it`s that `A11f` names:**
   - the white-bottom literal, `:316-323`;
   - the six snapshot `it`s, through the regeneration;
   - `UNICODE_BY_FEN_LETTER`, `:411-422`.

   Do not delete, skip or loosen any of them.
5. **Regenerate the snapshot last** with `npx vitest run src/render.test.ts -u`, and only that file. Then read
   `A11d`: `git diff` of the `.snap` touches `unicode` bodies only, and the 24 keys are unchanged.
6. **Commit `A11` alone,** with only those three files. Read the widened `A9` with
   `git diff -U0 <parent> <A11 commit> -- src/render.ts src/render.test.ts src/__snapshots__/render.test.ts.snap`.
7. **Run the full gate on the new tip.** `.test-results/last-run.json` must show `success` `true`. Then run the
   skip-integrity check at 0. Publish the notes. Do not merge to `main`.

## What QE must re-read

The delta is on the new tip: the merge of `main` plus the `A11` commit.

- **`A11a`–`A11f` against the code,** including:
  - `A11f`'s count: exactly 8 re-pinned `it`s, skip 0;
  - `A11e`: the named ABC-014, `render-seam`, `frame*` and `cli.test` `A7` `it`s are green and unedited;
  - the widened `A9` three-file read on the `A11` commit.
- **The full gate, re-run on the new tip.** The earlier QE verdict (`qe-ABC-101`) was read on `98ea0a84` and does
  not cover `A11`.
- **The UAT waiver measurement stays non-empty.** `src/render.ts` joins `src/cli.ts`, `src/cli-options.ts` and
  `src/level-seam.ts`, so the owner's UAT word is needed. That word covers `A11g` and the held difficulty UAT
  together.
- **No re-run needed:** `PUZZLE_DEEP` and the engine lanes are not triggered, because no engine file moves. Run
  `CLI_DEEP` again only if the merge touched `src/cli.ts`; it is not expected to.

## Owed by others

- **Orchestrator:**
  - move ABC-101 on the board for the SE hop;
  - sync the stale front matter (`status: backlog`, `P2`);
  - merge this branch to `main` before the SE merges `main`;
  - dispatch SE, then QE, then the owner's UAT.

  Security/NFR is not re-triggered by `A11`; whether to re-dispatch is the Orchestrator's call.
- **Owner:** UAT on a dark-background UTF-8 TTY: `A11g` with `--colour black` and `--colour white`, plus the
  held difficulty check.
- **Scribe:** nothing. `AGENTS.md` is untouched.
