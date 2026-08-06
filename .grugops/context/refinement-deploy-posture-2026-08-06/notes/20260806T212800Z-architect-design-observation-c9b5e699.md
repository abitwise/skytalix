---
id: 20260806T212800Z-architect-design-observation-c9b5e699
kind: observation
by: architect-design
at: 2026-08-06T21:28:00Z
verified_by: 
confidence: high
refs:
  - refinement-deploy-posture-2026-08-06
  - architect-deploy-posture
  - 20260806T212500Z-architect-design-decision-40352dd5
  - package.json
  - .github/
  - plans/releases/
supersedes: 
---

# What was checked and how — the deploy posture measured against the repo, not read off the config

Every claim in the ruling was verified against the repository on 2026-08-06 **before any file was
edited**. Recorded here so a later reader can re-run the checks rather than inherit the conclusion.

| # | Question | How it was checked | Result |
|---|---|---|---|
| 1 | Is there a container / orchestration / IaC artifact? | filesystem `find` for `Dockerfile*`, `*.dockerfile`, `docker-compose*`, `Chart.yaml`, `*.tf`, `Procfile`, `fly.toml`, `*.yml`, `*.yaml`, excluding `node_modules/`, `.git/`, `coverage/`; independently `git ls-files` over tracked files | **Zero matches.** The stronger form of the result: **this repository contains no YAML file of any kind.** So no manifest, no chart, no compose file — and no CI workflow either |
| 2 | Is there CI, and therefore a CI deploy step? | `ls -a .github` | One file, `copilot-instructions.md`. **There is no `.github/workflows/` directory — no CI exists at all** |
| 3 | Can this be published, or does it expose an executable? | read `package.json` | `"private": true`; **no `main`, no `exports`, no `bin`**; no `start` script; no publish script. It cannot be `npm publish`ed and exposes nothing to run |
| 4 | Is there anywhere to push to? | `git remote -v` | **Empty.** No remote is configured on this repo (consistent with what `60-progress.md` has recorded since 2026-08-02) |
| 5 | Has anything ever been released? | `ls -a plans/releases/` | **`.gitkeep` only** — zero release records. The machinery is present and empty, which is the state this task preserves |
| 6 | Does the build produce an artifact? | `package.json` `build` script; `ls -d dist` | `build` is `tsc --noEmit` — **emits nothing**; **no `dist/` exists** (`dist/` is `.gitignore`d, and it is also simply absent) |
| 7 | Is there a CLI entry point? | `ls src/` | No `index.ts`, `main.ts` or `cli.ts`. The ten modules are the rules core plus `perft-bench.ts`, which is a verification harness that prints — **not the game**. This is why `AGENTS.md` records `Dev / run: UNKNOWN - verify`, and it stays that way |
| 8 | Do the config keys' contracts permit this fact? | read `agent-factory/config/factory.config.md` | `default_stack.deploy` is a free-form string sub-field; `environments` is a free-form *"array of strings"*. **Neither carries an allowed-value set.** Both can honestly carry the fact |
| 9 | Who actually reads those keys? | `grep` across the kit | `environments` → `workflows/12-release.md`, `workflows/13-incident.md`; `default_stack` → `workflows/00-bootstrap-greenfield.md`. **Read as prose by roles; nothing parses them** — this install has no `scripts/` directory |
| 10 | Did the edit break the config? | `node -e "require('./.grugops/factory.config.json')"`, then re-read the parsed values | Parses OK. `default_stack.deploy = "none-local-only"`, `environments = ["local"]`, **`production_requires_human_confirmation = true`**, `nfr` unchanged. `git diff` shows **exactly two changed lines** |

**The shape of the result matters as much as the result.** The absence is **uniform, not partial**:
there is not one deploy-shaped file anywhere in this repository. The three config values the
Orchestrator named were the only place the substrate claimed a deploy target, and there was **no
artifact behind any of them**.

**No command was written into `memory-bank/70-runbook.md`.** The runbook points at `AGENTS.md §
Commands` as the single source instead of restating anything, so no command needed verifying — and
the one command a reader would most want (how to run the game) is stated plainly as not existing,
with `AGENTS.md`'s `UNKNOWN - verify` left exactly as it is. Nothing was guessed to fill a slot.
