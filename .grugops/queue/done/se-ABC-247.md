---
subtask: se-ABC-247
role: software-engineer
ticket: ABC-247
ref: .grugops/context/se-ABC-247/
branch: new grugops/ABC-247 from main (worktree .claude/worktrees/se-ABC-247)
width: one records-only Architect hop beside you (no vitest). Record load1 with any timing. Leave no process running.
---
# SE ABC-247 (XS, P1, tools only): rpair passes Skill Level 6 to skytalix on both builds
## Read
- The ticket page (A1–A4, Test notes).
- The Orchestrator ruling .grugops/context/orch-2026-10-30a/notes/20261031T065500Z-orchestrator-decision-fb0c8978.md.
- qe-EPIC-010-m1-batch's notes and raw/probe/; ABC-225's page; tools/rating/rating.ts, pair.ts and pair-check.ts.
## Do
- Build A1 (the token in every rpair block for both builds, once, in the skytalix engine group; `r` and `d` argvs byte-equal to main).
- Add pair-check test(s) that go red when the token is removed.
- A3: file:line readings at base ca6e675c and at head of every place Skill Level reaches on a `go movetime` path. A miss is a STOP.
- A4: gates via `npm run …`; `npm test` green with 0 skips; the src/data diff is empty. Do not run A2 (QE's probe) or any cutechess games.
## Fences
- tools/rating/ only. No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. No host paths in committed files.
- Waiting: poll an output file or `kill -0 <pid>`; never `while pgrep -f …`. Never put vitest on the same command line as a wait.
- Scratch `se-247/`.
## Publish
Sealed notes (task `se-ABC-247`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-10-31, Software Engineer. Done. Branch `grugops/ABC-247` (worktree `.claude/worktrees/se-ABC-247`, from main `4cd261c1`): code `02f4f3d4`, notes `bc8c4db4`. Not merged; nothing pushed. No game, no engine, no cutechess run, no A2.**

- **A3 (read first, before building): MET at both SHAs; no STOP.** Base `ca6e675c` / head `4cd261c1` (same lines as the ticket's `72a65fb7`): `const level = LEVELS[skill]` `src/uci-session.ts:286` / `:382` is the only search read; cap `:287` / `:384` (under `leveled` `:383`); blunder branch `level.blunderRate > 0` `:295` / `:392`. Rate-0 `chooseMove` takes no skill (`:313-318` / `:410-416`). `LEVELS[5]` `src/levels.ts:54` `{3_000, 0}` / `:59` `{4_000, 0}`; `LEVELS[6]` `:55` / `:60` `{5_000, 0}`. Head `TimeMode` default `level` (`:99`, `:351`). Book, `OwnBook`, `info`, TT and `Hash` read no skill; `level-seam.ts` is the CLI seam, `uci.ts:76` passes none. Observation `…e9efa27d`.
- **A1:** optional `ArgSpec.skill` + `PAIR_SKILL_LEVEL = 6`. `sky()` emits `option.Skill Level=6` after `restart=on` when it is set, and only rpair sets it. `pair-check.ts` has 25/25 tests (+3 new: once per block per build and none on Stockfish; the A5 shape; `r`/`d` send none and match main token for token). The A1 diff test is restated to allow that one token. Mutations: removing the token gives 3 red; leaking it into `r`/`d` gives 2 red. Both restored. Dry-run prints: `r` ×2 and `d` ×2 are byte-equal to main. The `rpair` print gains exactly 20 `option.Skill Level=6` lines and loses none. Decision `…09cbe15a`, observation `…ea98b31b`.
- **A4:** `npm run lint` / `typecheck` / `build` all exit 0. `npm test` ran 63 files / 2 364 passed, 0 skipped, in 9.00 s (load1 0.39). Skip integrity `No findings.` `git diff --stat main -- src data` is empty.
- **Publishing:** `propose_note` was not surfaced, so I used its handler (`handleProposeNote` → `admitAndAppend`) with trusted root = worktree. 4/4 admitted and validated. An `artifact-ref` was refused because it needs a §14 `gate_run`, so the branch/files/tests pointer was filed as observation `…c062cb93`. Raw prints are in `.grugops/context/se-ABC-247/raw/`.
- **QE owes A2** (ALONE): the block-01 probe at both SHAs, plus the base control.
- STOP: none.

### Trace row (10 cells, header order)

| ABC-247 | rpair passes Skill Level 6 to skytalix on both builds (base before ABC-228 searches 4 000 ms); r and d unchanged | EPIC-010 | — | NFR-008 (0 lane files); ADR-0053 d10 intent kept; ADR-0049 d4 (no host path); ASVS L1 (fixed literal) | grugops/ABC-247 @ 02f4f3d4 (+ notes bc8c4db4): tools/rating/rating.ts (ArgSpec.skill, PAIR_SKILL_LEVEL, sky() token, rpair argsOf), tools/rating/pair-check.ts (+3 tests, A1 restated) | pair-check 25/25 (+3; mutations red 3 and 2); r/d dry-run byte-equal to main; npm test 63 files / 2 364 pass, 0 skipped; A3 read at ca6e675c + 4cd261c1; A2 pending QE | — (tools only, no UAT; QE verdict closes) | — | In Review (branch, not merged; A2 pending QE) |
