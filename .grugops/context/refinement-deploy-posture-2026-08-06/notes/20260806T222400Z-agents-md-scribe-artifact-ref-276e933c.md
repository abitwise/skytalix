---
id: 20260806T222400Z-agents-md-scribe-artifact-ref-276e933c
kind: artifact-ref
by: agents-md-scribe
at: 2026-08-06T22:24:00Z
verified_by: 
confidence: high
refs:
  - refinement-deploy-posture-2026-08-06
  - agents-md-deployment-section
  - 20260806T222000Z-agents-md-scribe-decision-dfe783f9
  - 20260806T222200Z-agents-md-scribe-observation-3da32e28
  - AGENTS.md
  - memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md
supersedes: 
---

# Artifacts produced by `agents-md-deployment-section` — one file changed, and nothing else

Written on branch `grugops/refinement-deploy-posture-2026-08-06`. Nothing merged, nothing deployed.

| Artifact | Change |
|---|---|
| `AGENTS.md` | **+32 / −1 lines.** (a) **NEW section** `## Deployment posture`, placed between `## Branching model` and `## Safety rules` — five short paragraphs: the measured fact, `EPIC-006` as the named revisit trigger with distribution left **undecided**, the authority pointer to `ADR-0007`, what is **not** relaxed, and precedence over the read-only kit's hardcoded `dev → staging → prod` path. (b) **Two clauses appended** to the existing never-deploy safety bullet pointing at that section; **no existing text in that bullet was deleted or softened.** `## Commands` was audited and left unchanged |
| `.grugops/context/refinement-deploy-posture-2026-08-06/notes/` | Three notes: this one, one `decision` (the section, and the three judgement calls behind it) and one `observation` (the slot-by-slot `## Commands` audit) |
| `.grugops/queue/` | `agents-md-deployment-section.md` moved `pending/` → `claimed/agents-md-deployment-section/` → `done/agents-md-deployment-section/`, with a hand-written `claim.md` registry record |

## Verified after the edit, rather than assumed

- **`production_requires_human_confirmation` is still `true`** — re-read at `.grugops/factory.config.json`
  line 64 after the edit. Not written by this subtask; checked because `ADR-0007` falsifier `D7`
  exists.
- **`git diff --stat` shows exactly one changed file: `AGENTS.md`.** No config, no `plans/`, no
  `memory-bank/`, no `src/`.
- **`AGENTS.md` is 12,818 bytes** — under the 32 KiB Codex truncation cap.
- The two config values the new section quotes were **read from the file, not from a note**:
  `default_stack.deploy = "none-local-only"` (line 16), `environments = ["local"]` (line 63).
- The four kit occurrences of the `dev → staging → prod` path the precedence paragraph cites were
  **grepped first-hand** (`12-release.md` lines 25 and 34; `release-manager.md` lines 32 and 37).

## Files deliberately NOT touched

`.grugops/factory.config.json` — including the `nfr` block — and `plans/nfr-catalog.md`
(**Security/NFR's, running in parallel on this same branch**; ownership is disjoint by design and was
respected so neither agent loses the other's work) · `memory-bank/**`, including `ADR-0007`,
`30-architecture.md`, `70-runbook.md` and `60-progress.md` (the Architect's, cited not rewritten) ·
`plans/board.md` · `plans/traceability.md` (no ticket exists; that file's rule is one row per ticket —
see the `decision` note) · `plans/releases/**` · every file under `agent-factory/` (KIT, read-only) ·
every role adapter under `.claude/agents/` · all of `src/` — **no production code changed.**

**No availability figure was written into `AGENTS.md`**, deliberately: that bar is being ruled
concurrently by Security/NFR and is not this role's. `AGENTS.md` says nothing about availability, so
the two hop-2 outputs cannot contradict each other.

## Substrate degradation

No `scripts/claim.js` and no `scripts/context-io.ts` in this install (there is no `scripts/` directory
at all). Workflow 17 step 2's atomic `claimTask` could not execute and Workflow 16's sanctioned writer
does not exist. The queue transitions were done **by hand** (`mkdir` + `mv`), the `claim.md` registry
record was hand-written, and these three notes were **hand-authored** into `notes/` in the schema's
exact shape (filenames `<at-compact>-<by>-<kind>-<8-hex nonce>`, the nonces drawn from
`crypto.randomUUID()`). No `index.md` / `index.jsonl` render was produced — the tool that produces
them does not exist here, consistent with every other task folder in this repo. **`finding` was not
used** — there is no §14 gate on this task to issue a stamp — and **nothing was self-stamped**:
`verified_by` is empty on all three notes, which the schema permits for `decision` / `observation` /
`artifact-ref`.
