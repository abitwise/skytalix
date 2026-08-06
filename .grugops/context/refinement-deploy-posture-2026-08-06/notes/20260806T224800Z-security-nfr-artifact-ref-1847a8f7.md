---
id: 20260806T224800Z-security-nfr-artifact-ref-1847a8f7
kind: artifact-ref
by: security-nfr
at: 2026-08-06T22:48:00Z
verified_by: 
confidence: high
refs:
  - refinement-deploy-posture-2026-08-06
  - security-nfr-availability-bar
  - 20260806T223500Z-security-nfr-decision-c4552274
  - 20260806T223800Z-security-nfr-observation-f12e567b
  - 20260806T224200Z-security-nfr-observation-ac625981
  - 20260806T224500Z-security-nfr-claim-8065d908
  - .grugops/factory.config.json
  - plans/nfr-catalog.md
supersedes: 
---

# Artifacts produced by `security-nfr-availability-bar` — every file touched, and nothing else

Written on branch `grugops/refinement-deploy-posture-2026-08-06`. **Nothing merged, nothing deployed.**

| Artifact | Change |
|---|---|
| `.grugops/factory.config.json` | **EXACTLY ONE LINE.** `nfr.availability`: `"99.9%"` → `"not-applicable-local-only (nothing is ever up; ruling in plans/nfr-catalog.md)"`. File re-parsed after the edit; **`production_requires_human_confirmation` re-read and still `true`**; `environments` still `["local"]`, `default_stack.deploy` still `"none-local-only"`, and `perf_p95_ms` / `a11y_target` **untouched** |
| `plans/nfr-catalog.md` | **TWO HUNKS AND NO MORE — verified with `git diff -U0`: the `_Updated:` line, and a pure append at end of file.** (1) The header carries the ruling in this file's established convention, with the previous 13,224-character header preserved **verbatim** after the inserted word "Previously" (checked by byte comparison, not by eye). (2) Two new sections appended: `## Availability — why this catalog has NO availability row, and what would create one` and `## Does any other row here — or any risk on record — depend on a deploy target or a promotion path?`. **`NFR-001`–`NFR-007` are byte-identical**; no measured figure, denominator, position, machine, `UNKNOWN - verify` marker or instrument-limit correction was reflowed, re-formatted, re-measured or re-opened |
| `.grugops/context/refinement-deploy-posture-2026-08-06/notes/` | Five notes: this one, one `decision` (the ruling), two `observation`s (the verification evidence; the bounded second question with the two-documents-disagree finding and the fence) and one `claim` (the forward-looking roadmap reading, `confidence: medium`) |
| `.grugops/queue/` | `security-nfr-availability-bar.md` moved `pending/` → `claimed/security-nfr-availability-bar/` → `done/security-nfr-availability-bar/`, with a hand-written `claim.md` registry record |

## Files deliberately NOT touched

`AGENTS.md` (the Scribe's, running **beside** this subtask on the same branch — read-only check only:
it does not restate the availability bar, so nothing was owed to it) · `plans/board.md` (no column
moved, no WIP consumed) · `plans/traceability.md` (no ticket exists on this task, and that file's own
rule is one row per ticket) · `plans/epics/**` (the `EPIC-006` / `ADR-0007` disagreement is **reported,
not resolved** — BA/PM's and Architect/Design's) · `memory-bank/**`, including `ADR-0007`,
`30-architecture.md`, `70-runbook.md` and `00-index.md` (the Architect's from the previous hop) ·
`default_stack` and `environments` in the config (likewise) · `plans/releases/**`, every board column
and every workflow (**no release machinery was removed**) · every file under `agent-factory/` (KIT,
read-only) · every role adapter under `.claude/agents/` (each carries the never-deploy hard limit) ·
all of `src/` and every test — **no production code and no test changed, and no NFR row, risk or
release artefact was deleted.**

## Substrate degradation — recorded, not glossed

No `scripts/claim.js` and no `scripts/context-io.ts` in this install; there is **no `scripts/`
directory at all** (`tools/grugops/` holds two unrelated js tools). Workflow 17 step 2's atomic
`claimTask` could not execute and Workflow 16's sanctioned writer does not exist. The subtask was
moved `pending/` → `claimed/security-nfr-availability-bar/` → `done/security-nfr-availability-bar/`
**by hand** (`mkdir` + `mv` — still the atomic primitive, just not via the sanctioned script), the
`claim.md` registry record was hand-written, and these five notes were **hand-authored** into `notes/`
in the schema's exact shape. No `index.md` / `index.jsonl` render was produced, because the tool that
produces them does not exist here — consistent with every other task folder in this repo.

**`finding` was NOT used** — there is no §14 gate on this task to issue a stamp — and **nothing was
self-stamped**: `verified_by` is empty on all five notes, which the schema permits for
`decision` / `observation` / `claim` / `artifact-ref`.

## Concurrency

The `agents-md-deployment-section` subtask ran on the same branch at the same time. **File ownership
was disjoint by construction and no file was shared**; `AGENTS.md` was never opened for writing here,
and nothing in `.grugops/queue/claimed/agents-md-deployment-section/` was read as input or touched.
