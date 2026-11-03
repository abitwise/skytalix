# qe-ABC-274 gaps: **none blocking, none above LOW.** QE-274-a LOW (process; BA/PM and Orchestrator): A3's freeze-before-build (test note 1) was missed. QE-274-b INFO (Architect, for `ABC-239`): A3's rows are thin in phase and board. QE-274-c INFO: S2's formal ≈ 1 h protocol was not taken. QE-274-d INFO (Engineer and Orchestrator): a worktree's `node_modules` symlink is not git-ignored, though `…a11e7540` says it is

QE/E2E, task `qe-ABC-274`.

## QE-274-a: LOW (process; BA/PM for the template, Orchestrator for the order), the missed A3 freeze
- Ticket test note 1 asks QE to freeze A3's positions before the build's first commit. No freeze was dispatched before `se-ABC-274` built, so the Engineer used a stated selection rule instead (`…3219e70e`). The Architect ruled that the rule suffices and set Q1–Q4 in place of a freeze (`…3169a174`). QE checked them, and all four hold (verification note).
- It is not a defect. A freeze now would postdate the build and protect nothing more. **Owed:** when a ticket's test note puts a QE act before the build, dispatch that QE act before the build.

## QE-274-b: INFO (Architect; matters for `ABC-239`), A3's rows are thin
- Five families (PST.pawn, PST.rook, PST.king, ISOLATED, KING_FILE_HALF_OPEN) read all six rows from position-3 and its five 1-ply children, all at phase 4. KING_FILE_OPEN reads six K+R v K mates at phase 2. PST.queen reads all six at phase 18. DOUBLED has 4 rows, which are two positions and their mirrors.
- It meets the ticket's "≥ 3 per family at phases 1–23" as written. The blend is a single shared formula over the summed Δ, A2 reads every phase 0–30, and QE's mutant M1 shows the rows catch a dropped eg half. So nothing is uncovered today.
- But `ABC-239` relies on A3 holding at its emitted values. A more diverse frozen set, added rows only (A7), would make that re-check less dependent on one board. Not owed here.

## QE-274-c: INFO, the nps reading taken
- S2 is ruled report-only (`…690d3b30`). QE reported ns per node in the PREREG's shape (`chooseMove` d8, frozen clock: H / B 0.977–1.002) and nodes / ms at 4 000 ms from A6. The ≈ 1 h formal S2 protocol (`EPIC-011`) was not run. The ticket asks only that "the nps figure is reported".

## QE-274-d: INFO (Engineer; Orchestrator for the brief template), `node_modules` is not ignored
- `.gitignore` has `node_modules/`, which matches a directory only, and the symlink that worktrees use is a file. `git check-ignore node_modules` exits 1. `se-ABC-274` `…a11e7540` says the symlink "is git-ignored". It was never committed (QE checked `git log --all -- node_modules`), but a `git add -A` in a worktree would stage it. QE removed it before committing. A `node_modules` line without the slash would close this. That is a records change for whoever owns `.gitignore`, and is not done here.

## Carried, not re-opened
- The seam's shipped-path price (about nine typed-array reads per call, `…3169a174`): A5 reads the build at 0.9897 ×, so it is not visible.
- Merge hygiene: the branch has `main` `af214979` merged, and the gates were read on it. If `main` moves before the merge, re-run `npm test` on the merged tree first. The merge waits on the owner's "accept ADR-0067".
