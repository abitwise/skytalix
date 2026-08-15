---
id: 20260815T103500Z-architect-design-artifact-ref-branch-gates-byte-identity-and-the-queue-record-d84cb3af
kind: artifact-ref
by: architect-design
at: 2026-08-15T10:35:00Z
verified_by: 
confidence: high
refs:
  - ADR-0007
  - memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md
  - grugops/design-adr0007-deploy-authority
  - owner-grants-2026-08-15
  - D7
supersedes: 
---

# Branch, gates, byte-identity and exactly what this hop touched

## Branch

`grugops/design-adr0007-deploy-authority`, branched **by name** from
`grugops/owner-grants-2026-08-15` at its tip, **`daa20c4`** — the commit that both adds this
subtask file and writes the owner's 2026-08-15 directive into `memory-bank/60-progress.md`, so the
authority cited is present in the tree it was branched from. **NOT merged. NOT deployed. NOT pushed**
(this repo has no remote).

**The parallel hop was not touched.** The AGENTS.md Scribe holds `agents-md-owner-grants` and
`AGENTS.md` on its own branch; I checked out nothing but my own branch, staged **explicit paths
only** (never `git add -A`), and left its untracked claim directory alone —
`.grugops/queue/claimed/agents-md-owner-grants/` is still untracked in this tree and is not in my
commit.

## Files written — four paths, and nothing else

```
memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md   +169 / -7  (git diff --numstat)
.grugops/context/design-adr0007-deploy-authority/notes/*.md          4 new notes (this one included)
.grugops/queue/claimed/design-adr0007-deploy-authority/claim.md      new
.grugops/queue/{pending -> claimed -> done}/design-adr0007-deploy-authority.md   renamed
```

**`git status --short` over `src/`, `plans/`, `AGENTS.md`, `.grugops/factory.config.json`,
`memory-bank/70-runbook.md`, `memory-bank/30-architecture.md` and `.claude/` is EMPTY.** Zero bytes
of production or test code moved; the config was not opened for writing; the file the parallel agent
owns was not opened at all.

## The seven deleted lines, named — no clause text was lost

`-7` is three passages, each re-written with its original text **preserved in place**:

1. clause 4 bullet 3 (3 lines) — struck with `~~`, dated, and the kept half called out;
2. the Consequences precedence bullet (3 lines) — one enumerated example struck with `~~`, the rule
   itself unchanged;
3. the `D7` row (1 line) — trigger widened, old wording struck with `~~`, check and verdict unchanged.

Nothing was rewritten silently into agreement with today.

## Byte-identity, asserted rather than claimed

| what | before (`daa20c4`) | after |
|---|---|---|
| `## Context` … `## Decision` (the whole measurement table) | `sha256 1ba3b816…c0c5` | **`1ba3b816…c0c5`** |
| `## Alternatives` … `## Consequences` | `sha256 1b21ba96…a0fe` | **`1b21ba96…a0fe`** |
| falsifier rows `D1`–`D6`, hashed together | `sha256 49518636…e6d0` | **`49518636…e6d0`** |
| `.grugops/factory.config.json` | — | **`git diff --stat` empty** |
| file length | 234 lines | 396 lines |
| clause headers `1.`–`6.` | 6 | **6** (no clause 7 added) |
| falsifier rows | 7 | **7** (no `D8` added) |

## Gates, run on this branch tip after the write

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | **exit 0** — 54 files checked, 2 infos, no fixes applied |
| typecheck | `npm run typecheck` | **exit 0** (`tsc --noEmit`) |
| build | `npm run build` | **exit 0** (`tsc --noEmit`; honest naming per `AGENTS.md`) |
| unit | `npm test` | **exit 0 — 856/856 passed, 30 files, 2.43 s** |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`, exit 0** |

Machine: **Darwin 25.5.0 arm64, Node v24.12.0, vitest 3.2.7.** `UNKNOWN - verify` elsewhere.

**856/856 on 30 files is the same reading the previous hops on this base recorded**, which is
expected: this hop changed one markdown file and the queue.

**No `kind: finding` and no stamp is claimed.** None is emittable on this install (`AGENTS.md`);
these are gate results recorded by the role that ran them, not a verdict.

## The falsifier checks re-run at this hop, and their values

| row | check | result |
|---|---|---|
| `D1` | `find` for `Dockerfile*` / `docker-compose*` / `Chart.yaml` / `*.tf` / `Procfile` / `fly.toml` / `*.yml` / `*.yaml` excl. `node_modules`; `ls -a .github` | **zero matches**; `.github/` holds `copilot-instructions.md` only |
| `D2` | `package.json` | **`private: true`**; no `bin`, `main`, `exports` or `files`; 10 scripts, none of them `start` |
| `D3` | `git remote -v` | **empty** |
| `D4` | `ls -a plans/releases/` | **`.gitkeep` only** |
| `D7` | `grep production_requires_human_confirmation .grugops/factory.config.json` | **`true`** — before the edit and after it |
| config | `default_stack.deploy` / `environments` | **`none-local-only`** / **`["local"]`**, unchanged |

**All hold. The posture was re-measured, not inherited.**

## Queue

Claimed by hand — `mkdir -p .grugops/queue/claimed` then a **bare** `mkdir` of the task directory
(exit 0, no `EEXIST`, **claim WON**) — and transitioned `pending → claimed → done` in this tree per
Workflow 17. Concurrent width at claim time: one live competitor, the AGENTS.md Scribe, on a disjoint
file. **The same paths are tracked on `main`; if the Orchestrator transitions this subtask there too,
integrating this branch surfaces a rename conflict on the queue substrate only.** Flagged, not
avoided.

## Not touched, deliberately

`AGENTS.md` (the Scribe's, in parallel), `.grugops/factory.config.json`, `memory-bank/60-progress.md`
(the authority — cited, never edited by the role citing it), `memory-bank/70-runbook.md` and
`memory-bank/30-architecture.md` (stale in the same way, flagged with line numbers in my observation
note), `plans/board.md`, `plans/traceability.md`, `plans/nfr-catalog.md`, `.claude/agents/*`
(generated), `src/`, `package.json`.

**No board move and no traceability row.** This ADR amendment rules governance text; it delivers no
requirement, no code and no test, so there is nothing for the trail to link. `ADR-0007`'s existing
trace, if any, is unchanged.
