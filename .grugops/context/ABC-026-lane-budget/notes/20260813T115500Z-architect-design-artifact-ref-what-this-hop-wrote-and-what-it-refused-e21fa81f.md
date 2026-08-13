---
id: 20260813T115500Z-architect-design-artifact-ref-what-this-hop-wrote-and-what-it-refused-e21fa81f
kind: artifact-ref
by: architect-design
at: 2026-08-13T11:55:00Z
verified_by:
confidence: high
refs:
  - ABC-026
  - H5
  - NFR-008
  - ADR-0008
  - N8-LANE
  - vitest.config.ts
  - plans/nfr-catalog.md
  - plans/traceability.md
  - memory-bank/50-decisions/ADR-0008-default-test-lane-budget.md
supersedes:
---

# What this hop wrote, what it refused to write, and where the numbers live

Task `abc026-2026-08-13`, subtask `ABC-026-lane-budget`, Workflow 04, branch
`grugops/ABC-026-lane-budget` in the worktree `../cli-chess-abc026`, from `main` = `06c5427`.

## Written

| file | change | note |
|---|---|---|
| `vitest.config.ts` | **NEW** | `A4`'s adoption (`pool: "threads"`) + `A5`'s isolation warning. The only file the runner reads. Outside `src/`. |
| `memory-bank/50-decisions/ADR-0008-default-test-lane-budget.md` | **+109 / −0** | 2026-08-13 addendum: Decision 8 discharged, `A5`'s warning, extended rollback. **Status stays `accepted`; the 3 s / 13 s level is untouched.** |
| `plans/nfr-catalog.md` | **+78 / −0** | `NFR-008`'s measured result, the re-derived floor, the headroom in files, the threads adoption, the priced config file. **All 8 rows byte-identical, `sha256 63f66795…ca31`.** |
| `plans/traceability.md` | **+1 / −1** | **`ABC-026`'s row only** — one line. Table still 40 `ABC-`/`EPIC-` rows. |
| `.grugops/context/ABC-026-lane-budget/notes/` | 6 notes | This one plus 3 `observation`, 1 `claim`, 1 `decision`. |
| `.grugops/queue/claimed/` → `done/` | queue transitions | Workflow 17: atomic `mkdirSync` claim, `pending` → `claimed` → `done` by rename. |

**Both prose edits are PURE ADDITIONS with zero deletion lines** — which is the strongest available
proof that no target, bar or level moved.

## Deliberately NOT written

- **Anything under `src/`.** 47 md5s identical before and after; `git status --short -- src/` and
  `git diff --numstat -- src/` both empty. Zero production lines, zero test lines. `A6` holds.
- **`plans/board.md`** — the Orchestrator's. The ticket needs a column move it is not mine to make.
- **`plans/metrics.md`**, any other ticket file — out of bounds per the brief.
- **`plans/tickets/ABC-026-default-lane-cumulative-budget.md`** — **not edited, and this is a
  judgement, not an oversight.** The acceptance criteria are BA/PM's; an architect ticking off the
  criteria his own catalog row is judged by is the conflict Security/NFR refused at `ABC-025`'s gate.
  The `A1`–`A6` verdicts are in the trace row, the catalog and the ADR.
- **`ADR-0008`'s Decisions 1–7, its Status, and `NFR-008`'s level.** The 3 s / 13 s is Olger Oeselg's,
  ratified in person 2026-08-11. **A measuring hop measures against a ratified target; it does not
  move one.** Decision 8's stale "four `*.nfr.test.ts` files" was **read as seven and left standing**,
  not rewritten — same convention the 2026-08-12 audit used.
- **`ABC-024`'s page**, which states no lane bar. `N8-LANE`'s own sentence makes that compliant, so
  `A3` needed no edit anywhere in the backlog.
- **No test deleted, narrowed or merged.** Out of scope since the cut, and the measurement has removed
  the last reason anyone might have wanted to: **the lane is expensive per FILE and nearly free per
  TEST.**

## Where each `A`-criterion's evidence lives

- **`A1`** (lane total, `H5`) → `…-observation-the-lane-total-measured-and-what-was-running-649e39ff.md`;
  `plans/nfr-catalog.md` § `NFR-008` item 1.
- **`A2`** (headroom in files) → `…-observation-per-file-floor-re-derived-and-headroom-in-files-7eca0d7d.md`;
  catalog items 4–6.
- **`A3`** (`N8-LANE` over the backlog) → `…-observation-n8-lane-asserted-over-the-backlog-and-a6-verified-2e354ce5.md`.
- **`A4`** / **`A5`** (adopt-or-refuse, placement) → `…-decision-pool-threads-adopted-on-a-mechanism-not-a-run-count-a8216487.md`;
  `ADR-0008`'s addendum; `vitest.config.ts` itself.
- **`A6`** (`src/` byte-identical) → same note as `A3`, items 1–5.
- **the reconciliation of the two prior readings** → `…-claim-the-two-prior-readings-reconciled-70e67de3.md`.

## Fences that travel with every number here

**One machine** — Apple M3 (Mac15,13) / 8 logical cores / Darwin 25.5.0 arm64 / Node v24.12.0 /
npm 11.7.0 / vitest 3.2.7. **`UNKNOWN - verify` on any other hardware**, and the wall clause is
explicitly a function of core count. **Absolutes are session properties and drift ~20%; ratios
replicate.** **`node_modules` was symlinked** from the sibling worktree — a disclosed deviation from
`NFR-008`'s named environment, removed before this hop finished. **The measurement ran under real
concurrent agent load** — 98 of 135 runs above the core count — which makes it conservative, not
flattering.

## The substrate gap, re-verified rather than inherited — **sixth consecutive hop**

`scripts/` does not exist in this repository. There is no `context-io.*` and no `claim.*` anywhere in
the repository or in the kit at `/Users/olgeroeselg/.grugops/agent-factory`. `mcp__grugops__*` is not in
this session's tool set. **Workflow 16's stop condition — *"the only way to record the result would be
to hand-write the `.grugops/context/` path"* — is live on every hop of this install.** These notes were
hand-written in the `agent-factory/contracts/context-note.md` format; `index.md` / `index.jsonl` do not
exist for this task and nothing mechanically validated any of it. **No note here is a `finding` and no
verification stamp was invented** — there is no `§14-gate` verdict on this hop and no human grant.
Owner: **Orchestrator**.

## Nothing merged, nothing pushed, nothing deployed

Committed on `grugops/ABC-026-lane-budget` only. `main` was never checked out from this worktree.
**Humans hold merge and deploy.**
