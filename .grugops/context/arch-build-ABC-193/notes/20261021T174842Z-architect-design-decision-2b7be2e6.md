---
id: 20261021T174842Z-architect-design-decision-2b7be2e6
kind: decision
by: architect-design
at: 2026-10-21T17:48:42Z
verified_by: 
confidence: high (built and measured in scratch; QE's read owed); AR-191-QUOTEPATH whole close UNKNOWN - verify
refs:
  - ABC-193
  - AR-191-GITENV
  - AR-191-QUOTEPATH
  - QE-191-a
  - QE-191-b
  - ADR-0036
  - ADR-0036 S1
  - V1.2.5
  - NFR-008
  - F-095-1
  - R-193-a
  - R-193-b
  - 47a3c9a1
  - e6f91f1d
  - 63eadabe
  - 6b83874c
  - 341da4c1
  - 11245e3d
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - .grugops/context/design-F-072-1/probe/r2-mutants.sh
  - .grugops/context/design-F-072-1/probe/r2-mutants.out.txt
  - memory-bank/50-decisions/ADR-0036-abc041-clause-b-is-a-delta-test-on-the-production-capability-surface.md
  - plans/tickets/ABC-193-git-config-or-environment-can-blind-clause-bs-one-diff-call-and-a-non-ascii-production-file-goes-unseen.md
  - 20261021T171208Z-ba-pm-observation-a7367f5d
  - 20261021T171218Z-ba-pm-decision-7db22c5f
  - 20261021T165304Z-security-nfr-decision-7c1f3590
  - 20261021T165411Z-orchestrator-decision-eb401873
  - 20261021T173242Z-orchestrator-decision-717a2219
  - 20261021T174836Z-architect-design-observation-c1511dfb
supersedes: 
seal: sha256:0075497fac617c433e405b2155a53f0ea1925581a92bd64d3fd3ebfbe6f9fb31
---

# Architect decision for `ABC-193`: built as the page scopes, four files, 0 `src/` lines. The instrument changes three things and nothing else; the harness gains 8 rows with one route hook and one reference mode; `ADR-0036` § S1 gains one dated block. A1–A9 met on the builder's read; QE's read of A2–A7 is owed, and `AR-191-GITENV` closes on it

Cites the page `plans/tickets/ABC-193-…md` `## Scope` / `## Out of scope` and Security/NFR `…decision-7c1f3590` § 2–3 (the `## Risks`) as authoritative. Readings: this task's `…observation-c1511dfb`.

## Chosen design
- **(a) and (b) in `clause-b.mjs`** are two edited lines: the `git` helper prefixes `-c core.quotePath=false` to every argv, and the one diff call gains `--no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/`. Still one `execFileSync` with an argv and no shell (`V1.2.5`).
- **(c)** `changedLines` collects each `--- "`/`+++ "` header into a set, as git printed it with the `a/`/`b/` inside the quotes dropped, so a modified file is named once and reads as `git --name-only` prints it (`"src/q\"t.ts"`). Each becomes an unresolved item, `<path> (C-quoted by git; not read)`, so the limb FIRES (disputed). Cost: 3 added lines, plus the return and destructure lines edited to carry the set (7 `+` / 4 `−` in all).
  - **Rejected:** a module-level array mutated inside `changedLines` (3 lines exactly, as BA/PM's prototype). It hides a side effect in a function that otherwise returns its results.
  - **Rejected:** reading the `diff --git` line. The page defines the rule on a path that "starts with `"`", which is the `---`/`+++` header.
- **Harness.** One hook, `rt <plant> <mode> on|off`, runs only when a row's last argument is `route`: it sets the plant's route in the clone's own config (or exports `GIT_EXTERNAL_DIFF` for `G-ENV`) around each head run, and `off` removes every route, so `341da4c1` always runs with none. One reference mode, `QP`, runs `341da4c1` with `GIT_CONFIG_COUNT=1 core.quotePath=false`. The 12 earlier rows never call either, and their output is byte-equal to base's. `mk` reads names with `-c core.quotePath=false`. A leftover check (`git config --local` `color.*`/`diff.*`, or `.git/info/attributes`) exits 2.
- **ADR.** One block under `### S1` after the `ABC-191` block, stating (i)–(v) and the rollback (revert `63eadabe`; the stand-in and the dispute-line rule return). 0 `−` lines.

## NFR and risk impact
- `AR-191-GITENV`: the fix is built. It closes on QE's read of `A2`–`A4`, and the Orchestrator's stand-in retires at merge.
- `AR-191-QUOTEPATH`: the instrument half closes on QE's read of `QU`, `QE2` and `A6`'s C-quoted plants. The waiver half landed separately (`scribe-waiver-quotepath`, merged to `main` at `4f81850c` during this hop). Whether the risk then closes whole is the Orchestrator's record (`UNKNOWN - verify`).
- `NFR-008`: 0 / 0 / 0; the instrument and the harness run by hand, outside `npm test`.
- INFO `R-193-a` (a hunk line starting `-- "` or `++ "` would be a false dispute, fail-safe direction) and `R-193-b` (an unchanged C-quoted file stays out of the production set, as designed). Neither is against a criterion.

## For QE
- Re-run `A2` (base instrument, `git show 47a3c9a1:<instrument>`) and `A4` with the harness at the tip, under a private `HOME`/`TMPDIR`/`GIT_CONFIG_GLOBAL` and `GIT_CONFIG_NOSYSTEM=1`. A3's copies are one-part removals of head's file; A6 needs X1's plant and four C-quoted plants in a scratch clone.
