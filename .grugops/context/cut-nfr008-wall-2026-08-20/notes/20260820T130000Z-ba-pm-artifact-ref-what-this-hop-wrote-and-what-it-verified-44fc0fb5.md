---
id: 20260820T130000Z-ba-pm-artifact-ref-what-this-hop-wrote-and-what-it-verified-44fc0fb5
kind: artifact-ref
by: ba-pm
at: 2026-08-20T13:00:00Z
verified_by:
confidence: high
refs:
  - ABC-111
  - ABC-110
  - NFR-008
  - plans/tickets/ABC-111-settle-the-warm-cold-protocol-for-nfr008s-wall-clause.md
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/ABC-110-close-the-default-lanes-1480-ms-cpu-deficit.md
supersedes:
---

# What `cut-nfr008-wall-2026-08-20` wrote, on which branch, and every check it ran

**This is not a stamp.** Hand-authored `artifact-ref`; no `finding` is admissible on this install.

## Branch and working tree

**Branch `grugops/nfr008-wall-cut`, off `main` @ `2605163`. Nothing committed to `main`, nothing
merged, nothing pushed, nothing deployed.**

**Taken in a separate `git worktree` rather than in the repository's own working tree, and the reason
is recorded because it is a real hazard here:** the repository working tree was on
`grugops/abc110-a1a4-measure` with a live queue claim at
`.grugops/queue/claimed/abc110-a1a4-measure/`. **Checking out a different branch under a concurrent
agent would have moved the tree beneath it.** *(The queue claim and the pending→claimed move for
`nfr008-wall-cut` were made in the repository tree, where the queue lives; those files are untracked
and no git state was disturbed.)*

## Artifacts

| artifact | what it is |
|---|---|
| `plans/tickets/ABC-111-settle-the-warm-cold-protocol-for-nfr008s-wall-clause.md` | **NEW.** The one ticket cut. **303 lines** — see the note on the prose budget below. |
| `plans/board.md` | **+1 `Backlog` row (`ABC-111`), +1 dated header.** The four headers above it are ADDED TO, not superseded and not replaced — **so no history file is written**, by this project's standing convention. **No column moved, no WIP limit touched, nothing archived.** |
| `plans/traceability.md` | **+1 row (`ABC-111`), appended. Nothing touched in place.** +1 dated header. |
| `plans/tickets/ABC-110-…-cpu-deficit.md` | **ONE in-place annotation inside `## Dependencies` (+11 lines): the id `ABC-111`, and the 1.480 s / 1.760 s deficit dependency.** **NOT re-scored — it stays DoR 8/10 ⚠️x2 — and `A2` was NOT re-cut.** |
| `.grugops/context/cut-nfr008-wall-2026-08-20/notes/` | **4 notes:** this one, a `decision` (the id, size, priority, DoR), an `observation` (the three things derived from the raw TSVs), a `claim` (the reproduction check and the five uncut items). |

**Whole-branch diff: 4 files changed, 1 added. `git diff --name-only main -- src/` returns 0 files.**

## Checks actually run, with their results

1. **The eight `NFR-001`–`NFR-008` table rows hash `sha256 63f66795…ca31`** —
   `grep "^| NFR-00" plans/nfr-catalog.md | shasum -a 256`, run **before and after** the hop, both
   times matching the fence. **`plans/nfr-catalog.md` and `ADR-0014` were never opened for writing.**
2. **The traceability row has 10 columns** — asserted by **re-splitting the appended row from disk
   after the write**: 12 raw `|`-fields against the header's 12. **No raw pipe inside any cell.**
3. **`git diff --name-only main -- src/` is empty.** 0 production lines, 0 test files.
4. **Nine of Architect/Design's nine published statistics recomputed from the raw TSVs and matched**
   — the working is in the `claim` note. **This is the check that licenses the derived CPU/wall
   ratios in the `observation` note**, since the TSVs carry no header row.
5. **No board column moved** — verified by inspection of the diff: the only change under
   `## Backlog` is one appended row.

## Two things stated honestly rather than glossed

- **The ticket is 303 lines against this project's 300-line prose budget (`AGENTS.md` § Process rules
  2).** It is **shorter than `ABC-108` (329) and `ABC-109` (355)** and 2 lines over `ABC-110` (301),
  so the ten-ticket median the control actually measures keeps falling. **Three lines were not bought
  by deleting a fence, a criterion or a number** — that rule's own text says a shorter ticket bought
  with worse gaps means the budget cut rigour instead of prose. **Recorded as over, not rounded down.**
- **No measurement was taken at this hop.** Every absolute on `ABC-111`'s page is Architect/Design's,
  copied. **The CPU/wall ratios are arithmetic on their raw data, shown with their inputs.**
  **`N8-SPAWN` stays 0 ms and nothing was charged to any account.**
