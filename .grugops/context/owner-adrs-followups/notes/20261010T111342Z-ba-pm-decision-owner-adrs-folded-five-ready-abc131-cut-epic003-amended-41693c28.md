---
id: 20261010T111342Z-ba-pm-decision-owner-adrs-folded-five-ready-abc131-cut-epic003-amended-41693c28
kind: decision
by: ba-pm
at: 2026-10-10T11:13:42Z
verified_by:
confidence: high
refs:
  - ABC-053
  - ABC-054
  - ABC-057
  - ABC-083
  - ABC-087
  - ABC-131
  - ABC-126
  - ABC-127
  - ABC-038
  - ABC-129
  - ABC-060
  - EPIC-003
  - ADR-0029
  - ADR-0030
  - ADR-0031
  - ADR-0032
  - ADR-0034
  - plans/traceability.md
  - .grugops/queue/claimed/owner-adrs-followups/owner-adrs-followups.md
  - .grugops/queue/claimed/epic003-drop-abc038/epic003-drop-abc038.md
  - .grugops/context/wave-2026-09-25/notes/20261010T104855Z-orchestrator-decision-owner-word-d7a1c3e5.md
  - .grugops/context/wave-2026-09-25/notes/20261010T105406Z-orchestrator-decision-owner-word-r4-6b2f90e4.md
  - .grugops/context/wave-2026-09-25/notes/20261010T105902Z-orchestrator-decision-owner-word-adrs-91c4e7a0.md
  - .grugops/context/owner-adrs-followups/probe/RUN.txt
supersedes:
---

Owner rulings of 2026-10-10 folded into the pages they unblock. Task `wave-2026-09-25`, subtasks
`owner-adrs-followups` and `epic003-drop-abc038` (claimed and closed in the same hop). Measured
against wave tip `246ddfc`. Every code anchor the ADRs cite was re-checked: no commit since `46b6a0f`
touches `src/history-pane.nfr.test.ts`, `src/render-seam.test.ts`, `src/render-seam.ts`,
`src/frame.ts`, `src/glyph-mode.ts`, `src/cli*.ts` or `src/result-screen.ts`. Fences held: no `src/`,
no `plans/board.md`, no ADR.

| page | ruling | DoR | size / priority | page → | remaining ⚠️ + owner |
|---|---|---|---|---|---|
| ABC-053 | `ADR-0029` | 9 → **10/10** | S / P1 (reason restated) | Ready | none blocking. Owed: `ADR-0011` pointer lines (Architect/Design); production-docblock follow-up (BA/PM, at merge) |
| ABC-054 | `ADR-0030` | 8 → **10/10** | S / P1 (reason restated) | Ready, after `ABC-053` | none blocking. Owed: `ADR-0011` pointer sentence (Architect/Design); `ABC-041` `A8` annotation (BA/PM, at merge) |
| ABC-057 | — (sequence only) | 10/10 unchanged | XS / P2 (→ P1 on `ABC-053`'s pull) | Ready, after `ABC-054` | none |
| ABC-083 | `ADR-0031`, R2 keep 7, `ADR-0034` | 9 → **10/10** | M / P1 | Ready, after `ABC-126` → `ABC-131` | non-blocking reading question: Architect/Design (below) |
| ABC-087 | `ADR-0032` | 9 → **10/10** | M / P1 | Ready, no ordering | none. Owed: `NFR-004` row wording (Security/NFR) |
| **ABC-131** (new) | `ADR-0034` (b) at 0.8x | **10/10** | XS / P1 | Ready, after `ABC-126`, before `ABC-083` | none. Owed after merge: Scribe (`PUZZLE_DEEP` line, 0 B), Security/NFR (`RISK-003`) |
| EPIC-003 | R4 (b) | — | stays XL; 20 points / 8 tickets | scope amended | `NFR-003` catalog row still names tab-completion (Security/NFR) |
| ABC-060 | — | — | — | left as is (owner word on the drop pending) | Orchestrator |

Decisions BA/PM took on its own authority (the Orchestrator may reverse any of them):

1. **ABC-053, the three production docblocks are NOT folded.** `ADR-0029` left this to BA/PM and
   recommended a follow-up. They are `src/render-seam.ts:35`, `src/result-screen.ts:14`, and the census
   line `src/cli.ts:8`. They are true until `ABC-053` lands, so a ticket cut today would describe text
   that is not yet false. Folding them would also take `ABC-053` off the zero-production-lines UAT
   waiver. `A5` makes the PR note list them; **an `XS` comment-only follow-up should be enqueued for
   BA/PM at `ABC-053`'s merge.** Not cut now: the task asked for one cut.
2. **Priorities kept at P1 for `ABC-053` and `ABC-054`, with new reasons.** The August reasons lapsed
   (`ABC-042` is Done; no open page cites `runtimeImportersOf`, measured). On their own merits both are
   high P2 (nothing is broken; `ABC-041` `A11` holds `A8`'s headline today). They stay P1 because they
   precede `ABC-057` on one file, and `ABC-057`'s own `R5` trigger makes it P1 the moment `ABC-053` is
   pulled. A P2 there would hold a P1 behind it. If the Orchestrator does not want the chain this wave,
   lower all three to P2 together.
3. **`ABC-057`'s page gains one Dependencies bullet** (outside the seven items, inside item 2's
   sequencing). It said "either order works" with `ABC-054`; `ADR-0030` found the two share one
   paragraph. Nothing else on that page moved.
4. **`ABC-054` re-cut.** The false-RED premise is struck in place (a true red under
   `verbatimModuleSyntax: true`, `tsconfig.json:16`). `A1` now asserts the consumer instrument over 8
   spellings (4 count: value brace, mixed brace, default, namespace; 4 do not: `import type`, inline
   all-type, bare, `export … from`). The licence column is not re-tested: the regex is unchanged by
   ruling. `ABC-041` `A8`'s page wording waits for this ticket's merge, because until then "runtime
   importer" is the true name of what runs. Size kept S (12 production files have multi-line imports,
   measured, so the parser is not trivial).
5. **ABC-083, ordering scored as pull order, not a ⚠️.** `ABC-126` (In Review) and `ABC-131` (Ready) are
   merge-order predecessors with no open question in either. Same rule as `ABC-059`'s at
   `rescore-batch-2`. Ready WIP is the Orchestrator's to weigh (see below).
6. **ABC-083, one reading question raised, not ruled.** `ADR-0034` decision 2 grants a drift class only
   when every trigger-list file the diff touches is `src/evaluate*.ts`. `AGENTS.md`'s glob
   `src/search*.ts` also matches test files. `ABC-082`'s merge touched `src/search.ordering.test.ts` and
   `src/search.pvs-lmr.test.ts` (measured, `3858e3c`), and `ABC-083` `A10` re-pins the same kind of
   rows. Read literally, every missed row on `ABC-083` is class B. BA/PM reads the list as production
   engine code. `UNKNOWN - verify`; owner Architect/Design. Not blocking: either reading still routes a
   red (B → `ADR-0028` decision 1 → read again → owner).
7. **ABC-087, `A8` extended** with `ADR-0032` decision 1: no change to `src/engine.ts` or
   `src/search.ts`, and no import of `src/virtual-clock.ts` from the level module. That makes "shares no
   file with `ABC-083`" and "option B does not run unless the module's name hits a glob" checkable.
8. **ABC-131 folds `QE-127-e`** (LOW, routed to BA/PM by QE at `qe-ABC-127`; `ABC-126` did not take it):
   a `PUZZLE_DEEP=1` row cross-checking `unsolved` against `PUZZLES` and `solved + |unsolved| = total`.
   This ticket re-records that list. It is separable (strike `A6`). Lane count 17 → 18 is a same-length
   edit in `AGENTS.md`.
9. **ABC-131's expectation was verified, not inherited.** Recount of QE's committed per-row files with
   the four seeds removed (`probe/drop-recount.sh` → `drop-recount.out.txt`): base 58 → 54; 14/17
   weakenings red; of `ABC-127` `A3`'s ten survivors, `W1`, `W1b`, `W2`, `W4`, `W5`, `W13`, `W16` red
   (**7/10 ≥ 6**, all four required, 3 optional ≥ 2); `W10`, `W11`, `W14` green. It matches `ADR-0034`'s
   `classify.out.txt` on all 17. `ABC-127` `A1`'s bars still hold: 18 new rows ≥ 16, mate-in-3 8 ≥ 6,
   quiet-key 11 ≥ 4, `depth≥5` 6 ≥ 4, `quiescence` 11 ≥ 4. This is arithmetic; `ABC-131` `A4` is the re-run.
10. **EPIC-003.** Scope line struck with a dated amendment (reason, the owner's words, `ABC-036`/`ABC-033`
    cover discovery). The pager trigger that referenced `ABC-038`'s escalation now stands on its own.
    `NFR-003` bullet strikes tab-completion; the catalog row is Security/NFR's. The `tickets:` front
    matter still lists `ABC-038` (its page is `dropped`, not deleted). `ABC-038` gets a DROPPED
    blockquote; `ABC-129` § Dependencies, the one live page naming it as a neighbour, is corrected.

File overlaps (cannot build in parallel):
- `src/history-pane.nfr.test.ts`: `ABC-053` × `ABC-054` × `ABC-057`. `src/render-seam.test.ts`:
  `ABC-053` × `ABC-054`. Order `053` → `054` → `057`.
- `src/puzzle-corpus.ts`, `src/puzzle-suite.test.ts`: `ABC-126` (In Review, QE running) × `ABC-131`.
  `src/quiescence.test.ts`: `ABC-126` × `ABC-083`.
- `ABC-087`: no shared file. The level module is new.

Recommended pull order (the Orchestrator's call):
1. `ABC-087` now (P1, M, no overlap). It is the hard blocker for `ABC-085`.
2. `ABC-053` now, in parallel with step 1 (disjoint files).
3. `ABC-131` as soon as `ABC-126` merges (P1, XS; gates `ABC-083`).
4. `ABC-054` after `ABC-053` merges; then `ABC-057` after `ABC-054`.
5. `ABC-083` after `ABC-131` merges (P1, M, largest). Run it alone on the engine files.

Ready WIP: the board reads 5/8 (one of them, `ABC-058`, is claimed by a build hop now). Five pages
became Ready here (`053`, `054`, `083`, `087`, `131`), which would make 10/8. Suggested: place
`ABC-087`, `ABC-053` and `ABC-131` now; leave `ABC-054` and `ABC-083` in Backlog, marked "DoR 10/10,
waiting on order", until their predecessors merge. The board is the Orchestrator's.

Not done here (fences): no `src/`, no `plans/board.md`, no ADR (`ADR-0011` pointer lines from
`ADR-0029`/`ADR-0030` are owed by Architect/Design). `ABC-060` left as is. No `finding` is admissible on
this install; this note is a hand-authored `decision` with no seal.
