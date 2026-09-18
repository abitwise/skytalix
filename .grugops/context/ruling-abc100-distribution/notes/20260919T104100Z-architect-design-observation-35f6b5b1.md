---
id: 20260919T104100Z-architect-design-observation-35f6b5b1
kind: observation
by: architect-design
at: 2026-09-19T10:41:00Z
verified_by:
confidence: high
refs:
  - ABC-100
  - ADR-0018
  - ADR-0007
  - NFR-007
  - AGENTS.md
  - memory-bank/00-index.md
  - package.json
supersedes:
---

# Falsifier re-measurement at the `ABC-100` hop, and three stale sentences left standing (fenced or out of scope)

**NOT A STAMP.** Hand-authored `observation`; facts read off the tree at branch
`grugops/ruling-abc100-distribution` (from `2c96dbd`), 2026-09-19. Nothing here is a `finding`.

## `ADR-0007` / `ADR-0018` falsifier rows, re-run rather than inherited

| row | check | result |
|---|---|---|
| `D1` | `find` for `Dockerfile*` / `docker-compose*` / `Chart.yaml` / `*.tf` / `Procfile` / `fly.toml` / `*.yml` / `*.yaml`, excluding `node_modules` and `.git`; `ls -a .github` | zero matches; `.github/` holds only `copilot-instructions.md` |
| `D2` | `grep` `package.json` for `private` / `bin` / `main` / `exports` / `files` | `"private": true`; none of `bin`, `main`, `exports`, `files` present. Also read: `"version": "0.0.0"`, `"engines": { "node": ">=22" }`, no `dependencies` key, scripts include `chess` and no `start` |
| `D3` | `git remote -v` | empty |
| `D4` | `ls -a plans/releases/` | `.gitkeep` only |
| `D7` | `grep production_requires_human_confirmation .grugops/factory.config.json` | `true` |
| build emit | `ls -d dist` | no such directory; `npm run build` is `tsc --noEmit` |
| toolchain | `node --version`, `npm --version` | v24.12.0, 11.7.0 |

All hold. `D3` is, under `ADR-0018`, the first revisit trigger rather than a defect.

## `NFR-007` was NOT measured at this hop

A timed `npm run chess </dev/null` was attempted twice and refused both times by the PreToolUse
production-deploy guard on the command's shell shape (subshell / `time`), not on its content. It was
not retried by another route: `ABC-100` says this ticket defines the window and does not measure it,
and a number produced by working around a guard is not a number this project wants. The figure stays
`UNKNOWN - verify`. Prior data point, cited as observation only: `AGENTS.md` records `node src/cli.ts`
on a closed stdin at real 0.07 s (RUN 2026-08-19, ABC-043 branch tip) — the inner term of the window,
without npm's own startup.

## Three sentences now stale, left standing — each with the reason

1. **`AGENTS.md` § Deployment posture** still reads *"How the CLI will eventually be distributed — npm,
   a binary, a `git clone` — is undecided, and `EPIC-006` decides it. Do not fill that in."* **Fenced**
   (`ABC-109` byte cap; the section is the AGENTS.md Scribe's). Owner: the Scribe, at its next hop;
   the replacement sentence is `ADR-0018` Decision 1.
2. **`memory-bank/00-index.md:12`** still says *"sixteen ratified ADRs, `ADR-0001`–`ADR-0016` … next
   free id is `ADR-0017`"*. Stale since `ADR-0017` landed, now two behind. **Flagged, not fixed** —
   an unrelated line (coding rule 9). Owner: whoever next rewrites the index.
3. **`plans/tickets/ABC-100-distribution-channel-decision.md` § Out of scope** lists *"Editing
   `plans/epics/EPIC-006-*.md`"* as a fence, while the next section says *"whoever closes this ticket
   owns the epic-text correction"*. The second sentence is the operative one and `A7` requires the
   edit; the first was written for BA/PM's cutting hop. The ticket page is BA/PM's and was not edited.

## Other `npx` mentions in the tree that were deliberately NOT touched

`EPIC-006` `:62` and `:143` quote the old wording as dated history (*"Cutting `npx`-shaped tickets…"*,
*"criterion #1 (`npx <package>`) is therefore NOT met by this decomposition"*); `memory-bank/60-progress.md`
carries the same history at several lines. History is not repaired. `ABC-101`'s page was not read at
this hop and may also say `npx` — `UNKNOWN - verify`; if it does, it is BA/PM's at refinement.
