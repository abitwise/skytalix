---
id: 20261012T061500Z-qe-e2e-observation-abc116-audit-and-fences-557c5bee
kind: observation
by: qe-e2e
task: qe-ABC-116
at: 2026-10-12T06:15:00Z
verified_by:
confidence: high
refs:
  - ABC-116
  - A2
  - A3
  - A4
  - A5
  - A6
  - QE-116-c
  - QE-116-d
  - 20261012T055000Z-software-engineer-observation-abc116-a2-hook-deletion-re-measured-55c8efb6
  - 20261012T055100Z-software-engineer-decision-abc116-carrier-placement-and-what-is-not-made-b7440801
  - 20261012T055200Z-software-engineer-artifact-ref-abc116-branch-files-and-gates-ae9de9b2
  - .grugops/context/ticket-to-pr-ABC-116/probe/a2-runs.tsv
supersedes:
---

# QE `ABC-116`: audit of the Engineer's A2 record, and A3–A6 from git

I read these only after my own A1 and A2 readings (`…69982a4f`).

## The Engineer's raw TSV (`probe/a2-runs.tsv`, 30 rows), recomputed by QE

- **The figures recompute exactly from the rows.** Scored rounds 1–8 are each complete (B, M, T).
  - M−B wall: median **+3.080**, x(2)..x(7) +2.91..+3.19, 8/8 positive.
  - M−B CPU: median **+3.115**, +3.00..+3.27, 8/8 positive.
  - T−B: wall median +0.010 with R 0.180 (5/8 positive); CPU median +0.000 with R 0.100 (4/8 positive).
  - Arm medians: B 4.060 / 5.610, M 7.070 / 8.735, T 4.115 / 5.625.
  - `cpu_s` = `user_s` + `sys_s` on every row.
  - Every row reads exit 0, 1 file, 69 tests, 0 failed, 0 skipped.
  - Scored load1 runs 2.41–9.26, as the note says.
- **Rounding.** The comment and ticket write +3.12 s CPU, which is the 3.115 median rounded up. The note
  carries +3.115.
- **The discards were honest.**
  - The 3 `DISCARDED_FOREIGN` rows (seq 14, 19, 24) each carry a non-zero foreign-during count. No kept
    row carries a non-zero foreign or `pgrep` column.
  - The harness counts a process as foreign when it is a runner and not a descendant of the harness.
    The log's WAIT and "foreign during" entries line up with the TSV.
  - Each discarded run was re-taken after the foreign runner had gone, plus 20 s.
  - The smoke round (`smoke-not-a-reading/`, no gaps) and the aborted start are kept apart and not graded.
  - The foreign process the Engineer names (the `oeselg-labs/platform/repos/shared` runner) is the same
    one my own window hit.
- **The mutant is the one-line hook deletion and nothing else.** `probe/mutant.diff` is one `c` hunk at
  base line 670 (= tip line 695, after the +25 comment lines).
  - The note states that the trees are three `git archive`s of `3c38a8ea` and that B and T are equal under `diff -r`.
  - The `{}` form behaves the same at run time as `ADR-0017`'s option-less form, because `hook` is
    undefined either way.
  - My own mutant is the same line on the tip tree.
- **Wording.** The comment's dated figure, and the note's, state only what was measured: paired
  medians, sign, twin R, and the state at any R.
  - The disagreement sentence lists the differences (lane vs one file, vitest 3.2.7 vs 4.1.11, worker
    count, Node) and claims no cause. I checked each listed difference against the ADR and the
    `281807f4` lockfile/config, and each is true.
  - "Makes that child run the real engine" is true by construction: with no `hook` there is no
    substitution.
  - **No causal claim goes beyond the measurement.**

## A3, A4, A5 and A6, from git (base `3c38a8ea`, tip `d39618d1`, merge-base with `main` = `3c38a8ea`)

- **A3 MET.**
  - I extracted the bold `T1` sentence, the bold `T2` sentence and the `Ruling:` line from
    `## Canonical N8-SPAWN row form` and from `### Security / NFR triggers`. They are `cmp`-equal.
  - Only the fill-ins differ: the readings and the fired / not-fired reasons.
- **A4 MET.** `## Delivery` `:392` reads: "The next cut that carries an `N8-SPAWN` row owes `T1` and `T2`
  inline, in the canonical row form that lives on this page (`ABC-116`, § Canonical `N8-SPAWN` row form)."
- **A5 MET.**
  - `git diff --name-only 3c38a8ea...d39618d1 -- src/` lists exactly `src/cli.test.ts`. The non-test
    `src/` numstat is empty.
  - `src/cli.test.ts` is +25/−0. Of the added and removed lines under `src/`, 0 are not `*`/`//` comment lines.
  - The `plans/nfr-catalog.md` / `AGENTS.md` numstat is empty.
  - The 8-row hash is `c74e742698b59da90b67e101942f20406a20c8aee54da7f518df39da9eae0d3b` on 8 lines at
    base AND at tip.
  - The pointer is named in the ticket and the decision note, with Architect/Design as owner, and it
    is not made. The line refs `:1192` (account block) and `:1629-1630` (`T1`/`T2` bullets) are
    correct at the tip.
  - `plans/traceability.md` at base is a byte prefix of the tip's, so the build row was appended at the end.
- **A6 MET.**
  - `npm test` reads **56 files / 1743 tests / 0 pending / 0 todo** at base (a detached worktree at
    `3c38a8ea`) and at tip (my worktree). Both exit 0 with `success: true`.
  - The `const N8_SPAWN` / `expect(spawned)` / `expect(Object.keys(CHILDREN))` lines hash the same at
    base and tip, and `const N8_SPAWN = 17 + 7 + 1 + 2;` is byte-identical. The `const CHILDREN = { … };`
    block also hashes the same (`0284b8dd…`).
  - **`T2` did not fire.** The diff is comment-only, so no child's argv, script, hook or settle changed.
  - The A2 mutant is explicitly NOT claimed as a `T2` re-measure, in the ticket's `## Delivery` and in
    note `…55c8efb6`'s opening paragraph.
  - **Note.** `AGENTS.md`'s `npm test` receipt (1741) is stale against 1743. That is not this ticket's
    to fix, since `AGENTS.md` is fenced.

## The force-added `*.log` files (QE-116-c)

- **What they are.** `probe/a2-window.log` and `probe/aborted-start-1/a2-window.log` were
  force-added at `d39618d1`.
- **They are the only two tracked `*.log` files in the repository.**
  - `.gitignore:3` (`*.log`) still matches them (`git check-ignore --no-index`).
  - Tools that honour `.gitignore`, such as `rg --files` and grep tools built on it, do not list them.
    I measured this: `rg --files probe/` returns the other 7 files and neither log.
  - The repository convention is the other way: 239 tracked `*.log.txt` / `*.out.txt` files.
- **Is it acceptable record?** Yes: the bytes are in git, and `git show` and `cat` read them.
- **But it is the wrong form.** Evidence a note cites should not be invisible to the project's own
  search. **Recommendation:** `git mv` both files to `*.log.txt` on the branch. The only live
  citation is note `…ae9de9b2:25`, which is append-only, so record the rename in a superseding note.
  The `d39618d1` subject is history and stays as it is. This is LOW and does not block. My own
  logs are committed as `*.log.txt`.

## QE-116-d (INFO)

Note `…ae9de9b2` lists `a2-window.log` among the probe files in carrier commit `9b8c38ec`. Git shows
both `.log` files were added at `d39618d1`, two commits later. Because they are ignored, the carrier
commit could not have held them. A superseding note can correct this. It changes no reading.
