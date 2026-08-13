---
id: 20260813T123000Z-qe-e2e-artifact-ref-the-gate-verdict-gaps-and-what-qe-refused-48b38d1a
kind: artifact-ref
by: qe-e2e
at: 2026-08-13T12:30:00Z
verified_by:
confidence: high
refs:
  - ABC-026
  - ABC-021
  - quality-gate-ABC-026
  - H2
  - H5
  - NFR-008
  - ADR-0008
  - N8-LANE
  - vitest.config.ts
  - plans/nfr-catalog.md
  - plans/traceability.md
  - 21f5a12
supersedes:
---

# `ABC-026` quality gate: **`READY_FOR_HUMAN_REVIEW`** — with six gaps named, none of them a defect in this diff

Task `abc026-qe-2026-08-13`, subtask `quality-gate-ABC-026`, Workflow 05, branch
`grugops/quality-gate-ABC-026` in the worktree `../cli-chess-qe026`, branched from the **ticket
branch** `grugops/ABC-026-lane-budget` at `21f5a12`, merge base `06c5427`.

## The terminal result

**`READY_FOR_HUMAN_REVIEW`.** All four `mandatory_gates` green, skip count `0` determined, no
reproduction of the named hazard across ~44 M sampled observations, the integration risk run and
green, and no owner-ratified target moved. `self_fix_attempts` **0 of 2 consumed** — nothing failed.
**`SPLIT_REQUIRED` does not apply**: true product scope is 4 files, `+257/−1`.

**Neither human-only stop condition fired.** There is no UI/E2E surface and therefore no
visual-baseline acceptance (`quality.ui_e2e` is `ui-or-critical-path`; `AGENTS.md` records the E2E
slot as `UNKNOWN - verify`, non-blocking). **Test-integrity exited `2`, not `1`** — could-not-run, not
an unjustified skip — so the Step-4 short-circuit does not apply.

**NO GREEN `§14-gate` VERDICT NOTE WAS EMITTED, and its absence is deliberate.** Workflow 05 requires
the verdict to be emitted by the `emitVerdict` carve-out in `scripts/context-io.ts`. **`scripts/` does
not exist in this repository, there is no `context-io.*` and no `claim.*` in the repository or in the
kit, and `mcp__grugops__propose_note` is not in this session's tool set** — re-verified at this hop,
the **seventh** consecutive one. **Hand-writing a `by: §14-gate` note would be a structural FAIL and an
auditable impersonation, so it was not done.** No note here is a `finding`; no stamp was invented.
**Consequence to carry forward: this result is a recorded gate outcome, not a stamped one, and it
cannot admit anyone's downstream `finding`.**

## What this hop wrote

| path | change |
|---|---|
| `.grugops/context/quality-gate-ABC-026/notes/` | **6 notes** — this one plus 4 `observation` and 1 `claim`. Hand-written in `agent-factory/contracts/context-note.md` format; `index.md` / `index.jsonl` do not exist for this task and nothing mechanically validated any of it. |
| `.grugops/queue/claimed/quality-gate-ABC-026/` → `done/` | Workflow 17: atomic `mkdirSync` claim (`recursive: false`), `pending` → `claimed` → `done` by rename. |

**Nothing else. Zero `src/` bytes, zero production lines, zero test lines in the repository** — the
probes lived in an out-of-tree copy and the `ABC-021` preview was reset.

## Deliberately NOT written

- **Anything under `src/`.** Verified after all work: `git diff --numstat 06c5427 HEAD -- src/` empty,
  `git status --short -- src/` empty, 28 test files, 807 tests, skip count 0.
- **`vitest.config.ts`, `ADR-0008`, `plans/nfr-catalog.md`** — I found one inaccurate sentence and one
  scope gap in them and **recorded both as findings with reasons rather than editing.** No target, bar
  or level moved by me; both governed documents still show **zero deletion lines**.
- **The four `*.nfr.test.ts` files `ABC-030` owns**, and **`ABC-021`'s files** — a preview merge that
  was reset is not an edit.
- **`plans/board.md`** (the Orchestrator's), **`plans/metrics.md`**, and **any ticket file** —
  including `plans/tickets/ABC-026-*.md`. **`A1`–`A6` are BA/PM's to tick; I reported MET/NOT MET with
  evidence and ticked nothing.**
- **`.grugops/test-skips.md`** — not created. The agent may not author the justification that clears
  its own gate.
- **`plans/traceability.md`** — not touched. My row is a human's or the Orchestrator's to place; the
  evidence is here. *(Board row, for whoever owns it: `ABC-026` — gate green, `READY_FOR_HUMAN_REVIEW`,
  QE 2026-08-13; six gaps, all low/medium, none blocking.)*

## The gaps, with severity and owner

| # | gap | sev | owner |
|---|---|---|---|
| 1 | **`vitest.config.ts` is read by NEITHER `npm run lint` NOR `npm run typecheck`** — outside `tsconfig.json` `include` and explicitly ignored by `biome.json` (`biome check vitest.config.ts` → *"paths provided but ignored"*). The lane's only runner config is unguarded; a mistake in it surfaces only if `npm test` runs. | **MEDIUM** | Architect/Design to route; fixing it is a repo-wide config change no single ticket owns. **Disclosed by the delivering hop itself — a known gap, not a hidden one.** |
| 2 | **`vitest.config.ts` line 52 overstates its own probe**: *"goes RED when the mutation and the read share a worker"*. The hop's own note says *"the SAME module"*, and under `isolate: true` **two test files never share a worker** (measured: fresh `threadId` per file). As written it points a future engineer at a failure mode that cannot occur. | LOW | Architect/Design |
| 3 | **A real `process.env` / `isTTY` leak would be SILENT.** `glyph-mode.nfr.test.ts:96` calls the ambient path but never asserts its return value; every other glyph-mode test injects its environment. **No assertion in 807 tests is pointed at this hazard**, so "24 green runs" — and my 100 — are not evidence about it. Pre-existing; `ABC-026` wrote zero `src/` bytes. | LOW *(the leak is structurally prevented today)* | BA/PM to route; candidate row for **`ABC-030`**, which already owns those files |
| 4 | **`~7` files of headroom is a MEAN on a distribution with no typical member** — mean 309 ms vs median 94 ms per file, one file 25.7% of all file time, spread ~1966x. The published band covers slope and sample variation but **not file weight**, which is what it is most sensitive to. | LOW | BA/PM at the next cut |
| 5 | **`A1`'s medians cannot be independently recomputed** — the spread is published, the eight raw per-round values are not. Everything checkable around them checks out and my own readings bracket them. | LOW | Architect/Design: publish the raw values or say they were not retained |
| 6 | **Test-integrity could not run** — `.grugops/test-skips.md` absent, exit `2`. Recorded as *could not run*, **never as a pass**. Skip count is genuinely `0`, so nothing is being hidden today. | — *(`H2`)* | **A named human** |
| 7 | **Substrate gap, 7th consecutive hop** — no `context-io.*`, no `claim.*`, no `mcp__grugops__*`; notes hand-written, no gate verdict emittable, no `finding` admissible on this install. | **MEDIUM** *(process)* | **Orchestrator** |
| 8 | **`ADR-0008` Decision 8 still says "all four `*.nfr.test.ts` files"; there are SEVEN.** Correct on 2026-08-10, stale since 2026-08-11. Three hops have now deliberately left it standing and read it as *every*. | LOW | Whoever next amends `ADR-0008` — it is owner-ratified, so this is an amendment, not an edit |

**None of gaps 1–8 is a defect introduced by this diff.** 1, 3, 5, 6, 7 and 8 are pre-existing or
substrate; 2 and 4 are accuracy improvements to prose this hop wrote. **None blocks.**

## What the human reviewing this should know in one paragraph

**A measurement ticket wrote zero production bytes and still changed how all 807 tests execute.** The
change is one file, `vitest.config.ts`, and **the entire rollback is deleting it** — which the file
says in its own header. The adoption does **not** rest on green runs: it rests on a mechanism, and
**the mechanism is stronger than the file claims** — `process.env` is copied per worker (tinypool
passes no `SHARE_ENV`, verified two ways) **and** `isolate: true` gives every test file a fresh worker
thread, so the residue path does not exist either. **I could not force the failure and I explain why I
expect it to stay unforceable.** `isolate: false` would collapse both containments at once, which is
exactly the lever the delivered file's long warning exists to stop.

## Fences and disclosures

**Apple M3 (Mac15,13) / 8 logical cores / Darwin 25.5.0 arm64 / Node v24.12.0 / npm 11.7.0 /
vitest 3.2.7 / tinypool 1.1.1. `UNKNOWN - verify` on any other hardware.** **`node_modules` was
SYMLINKED** from the sibling `cli-chess-example` worktree — the same disclosed deviation from
`NFR-008`'s named environment that the last four hops carried — **and it was removed before this hop
finished.** **A second agent gated `ABC-021` on these same cores throughout, and my own campaign is
itself load: 1-minute load averages ran 5.5 to 29.7 on 8 cores.** Every pass/fail result here is
load-insensitive and is what I rely on; **every timing here is load-contaminated by design and none of
it is a lane reading.** `NFR-008`'s reading is the prior hop's, under its own protocol.

## Nothing merged, nothing pushed, nothing deployed

Committed on `grugops/quality-gate-ABC-026` only. **`main` was never checked out from this worktree**;
the `ABC-021` preview merge was made into MY branch, run, and `git reset --hard 21f5a12` verified.
**The gate recommends; a human decides. Humans hold merge and deploy.**
