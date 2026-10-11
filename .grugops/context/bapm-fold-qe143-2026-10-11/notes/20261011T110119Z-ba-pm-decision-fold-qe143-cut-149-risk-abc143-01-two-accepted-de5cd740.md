---
id: 20261011T110119Z-ba-pm-decision-fold-qe143-cut-149-risk-abc143-01-two-accepted-de5cd740
kind: decision
by: ba-pm
at: 2026-10-11T11:01:19Z
verified_by:
confidence: high
refs:
  - ABC-143
  - ABC-149
  - ABC-056
  - ABC-144
  - ABC-147
  - QE-143-a
  - QE-143-b
  - QE-143-c
  - QE-143-d
  - QE-143-e
  - QE-143-f
  - RISK-ABC143-01
  - AR-143-HANG
  - AR-143-OVERWRITE
  - NFR-008
  - plans/tickets/ABC-149-the-result-file-reporters-exit-code-check-is-pinned-by-no-plant.md
  - plans/tickets/ABC-143-a-red-npm-test-can-leave-a-result-file-that-reads-green.md
  - plans/tickets/ABC-056-ar-1-accepted-risk-has-drifted.md
  - plans/traceability.md
  - .grugops/context/qe-ABC-143/notes/20261011T105337Z-qe-e2e-observation-abc143-gap-register-da133511.md
  - .grugops/context/qe-ABC-143/notes/20261011T105337Z-qe-e2e-observation-abc143-mutants-112f11df.md
  - .grugops/context/qe-ABC-143/notes/20261011T105337Z-qe-e2e-observation-abc143-vitest-coupling-4f652dad.md
  - .grugops/context/qe-ABC-143/notes/20261011T105337Z-qe-e2e-observation-abc143-readings-e1e5acd5.md
  - .grugops/context/qe-ABC-143/notes/20261011T105337Z-qe-e2e-decision-abc143-verdict-efb34d57.md
supersedes:
---

# BA/PM fold of `QE-143`: `ABC-149` cut (a+b), `RISK-ABC143-01` named (c), `AR-143-HANG` and `AR-143-OVERWRITE` accepted (d, e)

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
- **Branch:** `grugops/bapm-fold-qe143-2026-10-11`, from the wave tip `9d0fcb96`.
- **Nothing was measured.** No test, no timing, no CPU. One read was taken: the installed
  `@vitest/coverage-v8` manifest (3.2.7), whose peer is `vitest: 3.2.7`. Every other number is cited
  from the QE notes in `refs`.
- **Not edited:** `src/`, `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, and any page's
  `status`/`column`. `ABC-143`'s acceptance and delivery text are byte-unchanged. Only a
  `## Follow-ups` section was appended.
- **Next free id was `ABC-149`**, checked across every local branch's `plans/tickets/` and `.grugops/queue/`.

## Item → result

| # | item | result |
|---|---|---|
| 1 | `QE-143-a` (LOW) | **CUT → `ABC-149`** (`XS`, `P3`, DoR 10/10). No existing ticket fits: `ABC-144` edits `vitest.config.ts` and is mid-QE, `ABC-147` is a read-only probe, and `ABC-056` performs no upgrade. The plant set goes into the reporter's header comment, where a reporter change meets it. Six rows; the "exit code only" row is QE's coverage-threshold red. `A4`: `M1` and `M9` must disagree with that row |
| 2 | `QE-143-b` (LOW) | **FOLDED into `ABC-149`.** The "hang" row expects exactly `run    started exitCode=none, killed`, and every row is read by content. `A4`: the query without its `run` arm disagrees on the hang row. `A5`: the query without its `suite` arm disagrees on the suite row, which a line count would pass |
| 3 | `QE-143-c` (LOW) | **NAMED `RISK-ABC143-01`**, defined on `ABC-143`'s page § Follow-ups. **Carrier rule:** any ticket that changes the `vitest` or `@vitest/*` major version depends on `ABC-149` (or carries its rows), re-runs the six rows at head, and takes or declines QE's 4.x route. A page note was added to **`ABC-056`**, because its coverage-v8 4.x question is in practice a vitest 4.x bump (peer `vitest: 3.2.7` read at 3.2.7; the 4.x peer is `UNKNOWN - verify`). `ABC-056`'s DoR stays 9/10 |
| 3a | `AGENTS.md` line? | **Warranted, for the Scribe; one line, about 141 B** against 967 B of headroom. A bump hop that never passes through BA/PM will still read `AGENTS.md`, and the page carriers will not reach it. Suggested text, beside "Do not change dependencies without reason": `` - A `vitest`/`@vitest/*` major bump carries `RISK-ABC143-01` (`ABC-143` § Follow-ups): it breaks the result-file reporter, silently on 4.x. `` Placement and wording are the Scribe's. It can ride the next Scribe hop and needs no hop of its own |
| 4a | `QE-143-d` (INFO) | **ACCEPTED as `AR-143-HANG`. No ticket.** `A2` is met as written, and the hung file is found by elimination. A fix costs a write on every green run or touches fenced `run-bounded.js` code. **Trigger** (QE's): a 124 or 143 sighting whose hung file cannot be named by elimination |
| 4b | `QE-143-e` (INFO) | **ACCEPTED as `AR-143-OVERWRITE`. No ticket.** It is fenced out by `ABC-142` and `ABC-143`, adds no new green path, and is visible in the file (1 `testResults` entry). The mitigation is one worktree per hop. **Trigger:** a hop misled by another run's file, or two runs in one checkout by design |
| — | `QE-143-f` (INFO) | The human's (git host). No BA/PM action |

## Why `P3` and not `P2` for `ABC-149`

- Both gaps are LOW. The head is honest on every red QE planted, the coverage red included. The gap is
  that nothing stops a later change from removing the exit-code check.
- **Promotion trigger:** `P2`, and merge first, when a ticket that changes the reporter, the `test`
  script or the vitest / `@vitest/*` major version is cut or pulled. That ties it to `RISK-ABC143-01`.

## Why a comment block, and not a proof script

One run of the set is about six `npm test` runs. A script wired into every gate would spend the CPU
the owner asked `ABC-144` to cut. The set runs on its three triggers only. Automation is a new ticket
if those triggers fire often. This is a scope choice, not a design choice: the block's wording is the
Software Engineer's.

## New tickets

| id | size | priority | DoR | UAT | recommended placement |
|---|---|---|---|---|---|
| `ABC-149` | `XS` | `P3` | 10/10 | waiver expected (0 production `src/` lines, comment-only reporter diff) | `Ready` |

## Board moves recommended (the Orchestrator's to make)

1. **`ABC-149` → `Ready`** (new row). On the board at `9d0fcb96`, Ready goes from 5/8 to 6/8.
   Not under a measurement window (test note 2).
2. **`ABC-143` row in `Done`:** append "follow-ups: `ABC-149`; `RISK-ABC143-01`; `AR-143-HANG`,
   `AR-143-OVERWRITE` accepted". Sync the page's `status`/`column` (still `backlog`/`Backlog`) to `Done`.
3. **`ABC-056` row in `Backlog`:** append "carries `RISK-ABC143-01` if the coverage-v8 upgrade is chosen".
   It stays 9/10.
4. **Scribe:** the one `AGENTS.md` line in 3a, at the next Scribe hop.
5. **Next free id: `ABC-150`.**
