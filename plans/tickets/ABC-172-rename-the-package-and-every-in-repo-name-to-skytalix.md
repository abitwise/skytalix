---
id: ABC-172
title: "Rename the npm package and every in-repo name from `cli-chess` to `skytalix`; the directory and any remote are owner steps"
status: backlog
column: Backlog
size: XS
priority: P2
epic: EPIC-007
feature: —
---

# ABC-172 — `cli-chess` becomes `skytalix` inside the repo. ZERO production lines

> **Accepted 2026-10-18 by the owner** (BA/PM, subtask `bapm-epic007-accept`). Owner word, verbatim
> (`.grugops/context/wave-2026-09-25/notes/20261018T113000Z-orchestrator-decision-owner-word-engine-private-adr0044-epic007-accepted-c3e81a57.md`,
> a transcription, not a stamp): *"accept the revised ADR-0044 and EPIC-007"*. The DoR item "owner acceptance" (item
> 10) is met, and the score is now 10 of 10. Q14 is answered *"keep it"*: `npm run chess` keeps its name, so Scope 3
> does not apply and the size stays `XS`. Readings below are unchanged from the cut.

> **Cut 2026-10-18 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-engine-revise`) as a **proposal**, on the owner's
> word, verbatim: *"Q13: rename yes."* (`.grugops/context/wave-2026-09-25/notes/20261018T103000Z-orchestrator-decision-owner-word-engine-q12-agpl-q13-rename-6b2d90f1.md`,
> a transcription, not a stamp). The Orchestrator's reading: the package, the repo and the terminal game are renamed;
> this ticket covers **in-repo names only**, because humans hold the repo. **This hop ran nothing.** Readings are at
> `main` `a10e09c2`.

## Problem

*User:* the owner, and anyone who clones the repo or installs it as a dependency of the web backend.

*Pain:* the engine is `skytalix` (`id name`, `bin`, `ADR-0044` D13), but the package is still `cli-chess`. A backend
that depends on this repo lists it under one name and runs it under another.

*Value:* one name everywhere a user or a tool reads it.

## Where the old name lives (read at `a10e09c2`)

- **Live, renamed by this ticket:** `package.json:2` (`"name": "cli-chess"`) and `package-lock.json:2` and `:8`.
- **Not present:** no file under `src/`, `tools/`, `spike/` or `data/`, and neither `AGENTS.md` nor any
  `memory-bank/*.md` page, contains `cli-chess` (`grep -rIn cli-chess`). **The terminal game shows no product name.**
  Its only self-reference is the usage line `usage: npm run chess -- …` (`src/cli.ts:93`), which names the command,
  not the product (see Q14).
- **Decision records, the Architect's at acceptance (records only):** `ADR-0044` D8 and D13 say the package "stays
  `cli-chess`". `ADR-0018`'s table names `npx cli-chess` as a rejected option. Each gets a dated line, and none is
  rewritten.
- **Dated history, left as written:** tickets under `plans/tickets/history/`, older ticket pages, `plans/nfr-catalog.md`
  readings, `plans/traceability.md` rows and `.grugops/context/` notes and raw files (over 700 files). They record what
  was true when written.

## Scope

1. `package.json` `"name": "skytalix"`.
2. `package-lock.json`: the two `name` fields, regenerated with `npm install --package-lock-only`, not hand-edited.
3. **Does not apply: Q14 is answered *"keep it"* (2026-10-18, `…c3e81a57`).** It would have applied only if the
   owner had overridden Q14's recommendation: `npm run chess` → `npm run skytalix`, with `src/cli.ts:93`'s usage
   line, its `src/cli.test.ts` pins, `AGENTS.md`'s Dev / run slot and `ADR-0018`'s channel sentence. That would have
   made the ticket `S`, with production lines.

## Out of scope — the owner's steps, listed for him

These are the owner's because humans hold the repo. None is done by an agent.

1. **Rename the directory** `cli-chess-example` (for example to `skytalix`). Before that, close every agent session
   working in it. Afterwards run `git worktree repair` in the main tree, because the linked `../wt-*` worktrees store
   absolute paths, or remove them first.
2. **Re-run the grugops installer** against the new path. `.grugops/install.json:6` records the old absolute `target`.
3. **A remote, if one is added or exists.** `git remote -v` is empty at `a10e09c2`, so there is nothing to rename
   today. A new remote is created under the new name.
4. **The agent host's per-project memory** may be keyed by the directory path (`UNKNOWN - verify` for the host). A
   rename may start a fresh one. Carry it over by hand if wanted.

Also out of scope: `package.json` `description`, the terminal game's text (it carries no product name), and any new
user-visible string.

## Acceptance (Given/When/Then)

- **`A1` (the package).** `npm pkg get name` prints `"skytalix"`.
- **`A2` (the lock).** In `package-lock.json`, `.name` and `.packages[""].name` are both `skytalix`. The lock diff is
  exactly those two lines. `npm ci` exits **0**.
- **`A3` (nothing live keeps the old name).** `git grep -n cli-chess -- . ':!plans/tickets' ':!plans/epics' ':!plans/traceability.md' ':!plans/nfr-catalog.md' ':!plans/board.md' ':!.grugops' ':!memory-bank/50-decisions'`
  prints nothing. The excluded paths are dated history, planning records, or the Architect's records.
- **`A4` (the gates).** The four mandatory gates (lint, typecheck, unit, build) are green, unchanged in count from
  `<base>`. `npm run chess` still starts the terminal game.
- **`A5` (fences).** `git diff --name-only <base> <tip>` lists exactly `package.json` and `package-lock.json` (Q14:
  keep). The production-`src/` grep is empty.

## Dependencies

- **None among open tickets.** It shares `package.json` with `ABC-168` and `ABC-169` (different keys). Whichever merges
  later rebases.
- **Q14: answered 2026-10-18, *"keep it"*.** `npm run chess` keeps its name (`…c3e81a57`).
- **Gate: met.** The owner accepted `EPIC-007` on 2026-10-18 (`…c3e81a57`).

## Security / NFR triggers

- **Security: TRIGGERED, a short hop.** `ABC-041` clause (a) fires on `package.json` and `package-lock.json`. No
  dependency is added (`A2`'s diff is two `name` lines). (b), (c) and (d) do not fire. Expected result: no finding.
- **NFRs:** none apply. The UAT waiver is expected (0 production lines), measured at the exit.

## Test notes

1. **`A3` is the real check.** A rename that leaves one live `cli-chess` is how two names keep living.
2. **Regenerating the lock with `--package-lock-only`** keeps `A2`'s diff at two lines. A full `npm install` could move
   resolved versions, and `A2` catches that.

## Size and priority

**`XS`:** two manifest files and a grep. **Not `S`:** Q14 is answered *"keep it"*, so Scope 3 does not apply.

**`P2`.** It is the owner's wish, but nothing in v1 breaks without it: the engine's name and `bin` are already
`skytalix`. **Not `P1`:** it carries no measure that M1–M10 need. It is M11.

## Definition of Ready

BA/PM, 2026-10-18, at `main` `a10e09c2`. **Result: 10 of 10.** Re-scored 2026-10-18 at `main` `50e081fc` (subtask
`bapm-epic007-accept`). It was 9 of 10 at the cut, with item 10 open until the owner accepted.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** two names for one program |
| 2 | scope and out-of-scope clear | **✅** two files; owner steps listed; history left |
| 3 | INVEST-shaped | **✅** independent; testable by `npm pkg get` and a grep |
| 4 | acceptance testable and measurable | **✅** exact name, two-line lock diff, empty grep, `npm ci` 0 |
| 5 | dependencies known | **✅** none open; `package.json` shared; Q14 answered (keep `npm run chess`) |
| 6 | security/NFR triggers with a measurable target | **✅** clause (a) fires; no NFR |
| 7 | test notes present | **✅** two |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P2` |
| 10 | no major unresolved blocker (owner acceptance) | **✅** the owner accepted the revised `ADR-0044` and `EPIC-007` on 2026-10-18 (`…c3e81a57`) |

**Recommended: → `Ready`, as far as Ready's WIP limit (8) allows. It is `P2`, so it yields a slot to the `P1` tickets.**
Column moves are the Orchestrator's.
