---
id: 20261010T135129Z-ba-pm-decision-owed-batch-two-cut-one-rescore-three-page-notes-26ea8322
kind: decision
by: ba-pm
at: 2026-10-10T13:51:29Z
verified_by:
confidence: high
refs:
  - ABC-041
  - ABC-053
  - ABC-054
  - ABC-057
  - ABC-101
  - ABC-129
  - ABC-132
  - ABC-134
  - ABC-135
  - ABC-087
  - ADR-0029
  - ADR-0030
  - QE-053-b
  - QE-053-c
  - QE-053-d
  - QE-054-a
  - QE-054-c
  - QE-057-b
  - QE-051-d
  - AR-NFR004-A
  - plans/tickets/ABC-041-render-seam-closure.md
  - plans/tickets/ABC-101-difficulty-selection.md
  - plans/tickets/ABC-129-cite-turn-loop-by-symbol-not-by-line.md
  - plans/tickets/ABC-134-frame-path-probe-prose-claims-more-reach-than-it-has.md
  - plans/tickets/ABC-135-a8-instrument-reads-comments-as-specifiers.md
  - .grugops/context/wave-2026-09-25/notes/20261010T132239Z-orchestrator-observation-handoff-2-7d3e1b84.md
  - .grugops/context/qe-ABC-053/notes/20261010T120534Z-qe-e2e-observation-abc053-gap-register-a4b293d2.md
  - .grugops/context/qe-ABC-054/notes/20261010T130030Z-qe-e2e-observation-abc054-gap-register-ee331683.md
  - .grugops/context/qe-ABC-057/notes/20261010T133223Z-qe-e2e-observation-abc057-gap-register-a331f012.md
  - .grugops/context/secnfr-ABC-087/notes/20261010T130030Z-security-nfr-decision-abc087-pass-with-risks-nfr004-ruled-per-move-played-ar-nfr004-a-reaccepted-clamp-pin-owed-3f1974f5.md
  - .grugops/context/bapm-owed-batch-2026-10-10/probe/RUN.txt
supersedes:
---

# BA/PM owed batch: three page notes, one re-score (`ABC-129` 10/10), two cuts (`ABC-134`, `ABC-135`)

This note is hand-authored and unsealed. This install is in the degraded posture `AGENTS.md`
describes, so no `finding` is admissible.
- **Worked against** the wave tip `35ad336b`, in the worktree
  `.claude/worktrees/bapm-owed-batch-2026-10-10`.
- **`ABC-087`'s Security/NFR note** was read with `git show grugops/ABC-087-difficulty-levels:`
  (`8330651d`, not merged).
- **Next free id** was `ABC-134`. No branch holds `ABC-134` or later.
- **Not edited:** `src/`, `plans/board.md`, ADRs, `AGENTS.md`, and no existing ticket's
  `status`/`column`.
- **Every premise was re-measured at the tip** before it was acted on. Readings: `probe/RUN.txt`.
- **The wave moved during the hop** to `9128e7a3` (`ABC-059` merged; Architect rulings merged).
  The branch was rebased onto it, and the only conflict was the append-only trace (both sides kept).
  - Re-read there: the 15 `ABC-129` sites are unmoved, and `src/history-pane.nfr.test.ts` and
    `src/render-seam.test.ts` are byte-identical.
  - `ABC-133` is now in development on `src/cli.test.ts`.
  - `ADR-0029`'s new pointer lists `QE-057-b`'s four spellings, which corroborates `ABC-134` `A4`.
  - No ruling names `QE-054-a` as `C3`.

## Item → disposition (exactly one each)

| # | item | disposition | why |
|---|---|---|---|
| 1 | `ABC-041` `A8` one-line note (`ADR-0030` § Consequences) | **PAGE NOTE**, one sentence under `A8`: "importer" reads **runtime consumer** (decision 2) since `ABC-054` merged (`cb044bb2`) | The page says "production importer", and the ADR paraphrased it as "runtime importer". The instrument's test title already says "runtime consumer", and `A8` is green at the tip. A `Done` page is annotated, not rewritten |
| 2 | `ABC-129` re-score | **10/10, 0 ⚠️**, `XS`/`P3` kept. `status`/`column` left at `backlog`/`Backlog` under this hop's fence. **The Orchestrator moves both with the board row** | `ABC-036` (`4a745a77`), `ABC-051` (`a154d306`) and `ABC-128` (`34d9ea70`) merged. 15 cites; every anchor resolves on the line the table names (`turn-loop.ts` unchanged since `54513238`). Site #2 moved `:744` → `:747`. `A3` is still live (8 tokens / 4 `command`; the comment says seven / three). The only in-flight overlap, `ABC-059` in `src/cli.test.ts` at `:2138`, is merge-order only. Test note 4 added: `cli.ts` bar 1 reads comments |
| 2b | the owner's comment-only ruling | **Moves the EXIT only.** YES → after QE, `Ready for UAT → Done`, WAIVED, provided the ruling names a measurement. NO or unruled → his word, and one word can cover `ABC-129` and `ABC-132`. DoR, size and priority are unchanged either way | The 2026-08-17 git test lists 6 production files for this diff and cannot tell a comment from code |
| 3 | `QE-053-b`/`-c`/`-d` | **CUT → `ABC-134`** (with item 5) | All three are live at the tip (`:196`, `:198-199`, `:659-661`). `ABC-054` and `ABC-057` merged without them. The sentences are in `src/`, so a page note on `ABC-053` would leave the misleading prose in place |
| 4 | `QE-054-a` + `QE-054-c` | **CUT → `ABC-135`** (`XS`, `P3`, 10/10, test-only, UAT waived) | Re-measured on the instrument's own expression: all 4 comment spellings over-count, and both unpinned properties hold. One function and one test. **`QE-054-a` is read as conformance to `ADR-0030` decision 2** (a comment is not a specifier), so no new ruling is needed. QE's `C3` alternative is named on the page and would only strike `A1`. **Feasibility measured, not a design:** the file's existing `deliveredCode` strip leaves all 1,190 real-tree pairs (92 consumers) unchanged and fixes all 4 |
| 5 | `QE-057-b` | **CUT → `ABC-134`** (`XS`, `P3`, 10/10, comment-only in one `.test.ts`, UAT waived) | Re-run on the tripwire's own expression: string-named and `;`-in-comment are uncounted, and the "two" count is short. Same file and same docblock as item 3: one ticket, one QE hop, no adjacent-hunk conflict |
| 6 | `ABC-101` forward note (Security/NFR `ABC-087` ruling 7) | **PAGE NOTE** under `## Security / NFR triggers`: look up `LEVELS` only by the validated own integer key (`Object.hasOwn`), refuse anything else, and re-read `AR-NFR004-A` at the first played move through a level. **DoR not re-scored** | Re-measured: prototype keys return members, and `hasOwn` refuses them. `A3`'s closed set already refuses them at the flag. The note covers every other route to the table |

## New tickets

| id | size | priority | DoR | UAT | pull |
|---|---|---|---|---|---|
| `ABC-134` | `XS` | `P3` | **10/10, 0 ⚠️** → Ready | waived (`.test.ts` only) | now. Disjoint from `ABC-135`; `ABC-030` merge-order |
| `ABC-135` | `XS` | `P3` (→ `P2` on `C1`'s trigger) | **10/10, 0 ⚠️** → Ready | waived (`.test.ts` only) | now, parallel-safe with `ABC-134` |

**Ready WIP.** It is 4/8 on the board today. `ABC-129`, `ABC-134` and `ABC-135` would make it
7/8. Placement is the Orchestrator's.

## Seen, not homed (for the Orchestrator)

- **The queue file's item 6 is corrupted.** After "Read it there with", the text of commit
  `97de9122` (a full `git show`) is pasted where a command should be. The intent was recoverable
  from `source_refs`.
- **`RR-LEVEL1-REALCLOCK`** (Security/NFR at `ABC-087`, owner BA/PM): whether `ABC-087` `A2`
  should say "on the injected clock". It is not in this task file, and `ABC-087` is in Ready for UAT.
- **`ABC-060`'s residual "`ABC-101` `A9`"** still waits for `ABC-101`'s next re-score, which
  this hop did not do.
