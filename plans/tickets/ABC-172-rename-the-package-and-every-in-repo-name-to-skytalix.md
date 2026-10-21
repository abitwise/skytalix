---
id: ABC-172
title: "Rename the npm package and every in-repo name from `cli-chess` to `skytalix`; the directory and any remote are owner steps"
status: done
column: Done
size: XS
priority: P2
epic: EPIC-007
feature: —
---

# ABC-172 — `cli-chess` becomes `skytalix` inside the repo. ZERO production lines

> **Read 2026-10-18 by BA/PM** (subtask `bapm-ABC-169-rescope`, at `main` `692770d6`), before any build, for the
> blocker that stopped `ABC-169`: a test that pins `package.json` (`.grugops/queue/done/ticket-to-pr-ABC-169.md`).
> **It does not reach this ticket.** `ABC-042` `A10` pins `package.json`'s keys, not the `name` value, and no tracked
> test pins the string `cli-chess` (test note 3). So no test edit is needed. `A4` and `A5` (exactly `package.json` and
> `package-lock.json`) stand unchanged. The reasoning is in `.grugops/context/bapm-ABC-169-rescope/notes/`.

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
3. **The test pins, read 2026-10-18 at `main` `692770d6`.** None needs an edit:
   - `git grep -n cli-chess -- '*.test.ts' ':!.grugops'` prints nothing. No test pins the old name or the new one.
   - `src/cli.test.ts:1759` (`ABC-042` `A10`): pins the top-level key list (`AT_HEAD`, `:1766-1775`), the script values
     and the reserved keys. A rename changes the value of `name`, which is already in `AT_HEAD`, so the pin holds. If
     `npm run chess` were renamed (Scope 3, which does not apply), `SCRIPTS_AT_HEAD` and the added list `["chess"]`
     (`:1799`) would go red.
   - `src/cli.test.ts:1111` (`ABC-042` `A1`) and `:2386` (`ABC-059`): `scripts.chess` and `AGENTS.md`'s
     `npm run chess`. Neither changes (Q14: keep it).
   - `src/cli.real-engine.test.ts:84`: the opt-in lane copies `package.json` byte for byte, and the copy is compared
     with the file as it is. Holds.
   - `package-lock.json` is read by no tracked test.
   - The live hits for `A3` are the same as at `a10e09c2`: `package.json:2`, and `package-lock.json:2` and `:8`.

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
| 7 | test notes present | **✅** three, one of them the test-pin reading (added 2026-10-18) |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P2` |
| 10 | no major unresolved blocker (owner acceptance) | **✅** the owner accepted the revised `ADR-0044` and `EPIC-007` on 2026-10-18 (`…c3e81a57`) |

**Recommended: → `Ready`, as far as Ready's WIP limit (8) allows. It is `P2`, so it yields a slot to the `P1` tickets.**
Column moves are the Orchestrator's.

## QE

**`qe-ABC-172`, 2026-10-21. Verdict: PASS_WITH_GAPS (1 LOW, 2 INFO, 0 blocking).** Branch `grugops/qe-ABC-172`, from the tip
`2eaf1a1c`. I merged `main` `41f5b366` at **`a0dc4135`** with no conflict; no manifest or `src/` path came in. Every criterion was run
at that merge before the SE's notes were opened. Notes are under `.grugops/context/qe-ABC-172/`.

- **A1 MET:** `"skytalix"`. **A2 MET:** both lock names are `skytalix`; the lock diff is 2/2, both `name`; `npm ci` rc 0 in a real install.
- **A3 MET:** the page's grep prints nothing. **A5 MET** at the code commit `0bddbb43` (2 manifests; `src/` empty).
- **A4 MET:** lint, typecheck and build 0. `npm test` 59 files, 1987/1987, success true, equal to base (re-run at `3e617b26`). Skip count 0,
  integrity `No findings.`. `CLI_DEEP` 11/11 (6 children); `PERFT_DEEP` 32/32. `npm run chess` starts the game, rc 0.
- **Lock ruling:** `A2` governs. Regenerating the **base** lock (old name) already adds `packages[""].license`, so that line is
  ABC-169's drift, not this rename. The delivered lock is the regenerated one minus that line; no version moved. The line lands
  separately (with ABC-168's lock change, or as a one-line chore), not here.
- **No name left behind:** every remaining `cli-chess` is a decision record, dated history, or the directory (owner's step). `npm run chess` was kept (Q14).
- **Gaps:** QE-172-a (LOW) lock license drift; QE-172-b (INFO) `A5` at the notes tip also lists the SE's context notes;
  QE-172-c (INFO) ADR-0018's table has no dated rename line (the Architect's record).
- **UAT WAIVED** (0 production lines, AGENTS.md form empty at `0bddbb43`). Next: the `ABC-041` (a) security short hop.
