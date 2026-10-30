---
id: 20261030T202846Z-software-engineer-decision-0813b232
kind: decision
by: software-engineer
at: 2026-10-30T20:28:46Z
verified_by: 
confidence: high: merge and resolution as committed at 3dca0e67; offline checks and gates run
refs:
  - ABC-225
  - EPIC-010
  - ADR-0053
  - ADR-0049
  - NFR-008
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
  - grugops/ABC-225
  - 3dca0e67
  - 14c8aafa
  - 9988a778
  - se-ABC-225/20261029T210343Z-software-engineer-decision-e58c4d25
  - se-ABC-225/20261029T210343Z-software-engineer-observation-14fdbedc
  - bapm-ABC-242-225-owner/20261030T202446Z-ba-pm-decision-e2a5929b
  - qe-ABC-225/20261030T003823Z-qe-e2e-decision-3a53bdfc
supersedes: 
seal: sha256:67574bb5ab8989a6049db1ad8475ea71c16f89654788e0224d1a6044ca99f4fc
---

# SE decision, se-ABC-225-main: main 14c8aafa merged in; rpair plays skytalix at 4 000 ms

Merge commit `3dca0e67` on `grugops/ABC-225` (parents `9988a778`, `14c8aafa`). Merge, not rebase, per the owner fold (`bapm-ABC-242-225-owner`). Code delta against `main`: `tools/rating/rating.ts`, `tools/rating/pair.ts`, `tools/rating/pair-check.ts` only. No `src/`, `data/`, lane or config file differs from `main`.

## The one conflict
- `tools/rating/rating.ts`, in `main()`, the `r`/`d` path. `main` changed the inline argv's R literal `mode === "r" ? 3000 : budget` → `4000` (`8c82399f`, ABC-228, ADR-0053 d10). This branch had moved that whole inline builder into the exported `cutechessArgs()` (so `rpair` and `r` share one builder; that is how A1 holds by construction).
- **Resolution:** keep the branch's `cutechessArgs({ … })` call in `main()`, and carry main's `4000` into `cutechessArgs()`'s `r` literal (`:410`). After the merge the builder body equals `main`'s inline one token for token, apart from `...start` in `-openings`, which is empty for `r` and `d` (textual compare in the gates note).
- Everything else auto-merged: the ticket page (BA/PM's dated lines from `main` and this branch's SE result line both kept) and the queue/records files.

## The rpair budget
- `rpair`'s own `budget: 3000` → `budget: 4000` (`:660`), as the dated line of `bapm-ABC-228-merge-fold` asks.
- **Note:** on the `r` path `cutechessArgs()` does not read `spec.budget`; the `r` literal decides. So before this change `rpair` would already have played 4 000 ms once the merge carried main's literal in, and the `budget` value it passes is a stated value that is not read. Both now say 4 000. I kept the literal (smallest diff, `r`'s line identical to `main`'s) and did not refactor to one shared constant; that is a follow-up a reviewer may want (finding, low, in the QE note).
- `pair-check.ts` A1 pin `st=3 timemargin=2000` → `st=4 timemargin=1000` (`CEILING_MS` 5 000 − 4 000). Test title "skytalix at 3 s" → "4 s". A3's rows read the 3 000 ms records and did not move, as the ticket says.
