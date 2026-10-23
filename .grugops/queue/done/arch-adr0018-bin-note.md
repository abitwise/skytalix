---
subtask: arch-adr0018-bin-note
role: architect-design
ticket: memory-bank/50-decisions/ADR-0018-distribution-channel-git-clone-npm-run-chess.md
ref: .grugops/context/arch-adr0018-bin-note/
width: 1 (records only)
---

# Owner-approved dated note on ADR-0018 (bin since ABC-168) + runbook § Deploy wording

## Do
- The owner approved (`…366ebd9e`) a dated, additive note on ADR-0018 recording that `package.json` has carried a `bin` (`skytalix` → built `dist/uci.js`) since ABC-168, the same fact as ADR-0007's note (`…0f003634`). Re-verify on current `main`. Context row 2 and Decision 1 stay as dated history; add a pointer in `## Status` and a closing `§ Note 2026-10-23` section, as you did on ADR-0007. Name how D2 (or ADR-0018's equivalent falsifier) reads from now on.
- If the fact changes the channel (`git clone` + `npm run chess`), STOP and report: that is a new ADR and the owner's.
- `memory-bank/70-runbook.md` § Deploy: correct "Nothing is published, built or deployed" with a dated edit (the UCI artifact is built locally by `npm run build`; still nothing published or deployed). Keep the old wording visible.

## Fences
- Work on `grugops/arch-adr0018-bin-note` (worktree `../wt-arch-adr0018-bin-note` from `main`). Only ADR-0018, `memory-bank/70-runbook.md` and your notes. No `src/`, `package*.json`, `plans/`, `.grugops/factory.config.json`, `AGENTS.md`. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/arch0018/`. Seal notes with an explicit context root in your worktree (not the plugin folder). Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `arch-adr0018-bin-note`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**DONE: the note and the runbook correction were added, and the STOP condition did NOT fire** (Architect/Design, 2026-10-23). Branch `grugops/arch-adr0018-bin-note` @ `6911a99b`, one commit on `main` `7fa33c0c`. Records only.

- **ADR-0018:** additive only (+64/−0):
  - a dated `Note 2026-10-23` pointer at the top of `## Status`;
  - a `## § Note 2026-10-23: a bin since ABC-168` section at the end.
  - No clause was amended and no falsifier row was edited. Context rows 2, 5 and 7, Decision 1 and the chosen Alternatives row stay as dated history, and the note names them.
- **`70-runbook.md` § Deploy:** additive only (+9/−0). A `[CORRECTED 2026-10-23 …]` bracket follows the 2026-09-19 bracket. The old sentence "Nothing is published, built or deployed" stays visible. It now reads: nothing is published or deployed; the UCI engine artifact is built locally by `npm run build`.
- **The facts, re-verified on `main` `7fa33c0c`:**
  - `package.json` reads `[true,{"skytalix":"dist/uci.js"},false,false,false]` for `[private, bin, main?, exports?, files?]`.
  - The `bin` came in with `825b21d1` (ABC-168) and reached `main` in merge `513c0211`. `git log -S`/`-G` show nothing has changed it since.
  - `chess` is `node src/cli.ts`, unchanged since `e1403550` (ABC-042). `build` is `tsc -p tsconfig.build.json`. `dist/` is git-ignored and 0 of its files are tracked.
- **`D2`:** the "exposes an executable" leg FIRED. The "publishable" leg did not.
- **The other falsifiers hold:** `D1` finds 0 deploy artifacts and 0 YAML files. `D3` finds 0 remotes. `D4` finds `.gitkeep` only. `D7` reads `true`. `D6` was not re-read because a `bin` does not touch it.
- **Why there was no STOP:** the channel's steps (clone, `npm install`, `npm run chess`) did not change. The `bin` is the engine's local executable. The package is private, and with no remote the `npx`-from-git route cannot be reached. `ADR-0044` D8, which the owner accepted, already placed the `bin` inside ADR-0018.
- **`D2` from now on:** it is checked against the note's baseline, the same as ADR-0007's. Any other reading fires it again. The row itself was not edited.
- **Notes** (in `.grugops/context/arch-adr0018-bin-note/notes/` on the branch, sealed by grugops 2.1.0 `admitAndAppend`, read back as 2 notes with seals ok, index rendered):
  - `20261023T185614Z-architect-design-observation-a6addc0d` (the facts);
  - `20261023T185614Z-architect-design-decision-5ffd0ca7` (the ruling).
- **Follow-up (INFO, Orchestrator):** `70-runbook.md` § Operate is more out of date than § Deploy was. It says "The game cannot be run" and "no `bin` and no `start` script". That section is outside this brief and was not touched.
- **Not touched:** `src/`, `package*.json`, `plans/`, `.grugops/factory.config.json`, `AGENTS.md`. No column moved. Nothing was pushed or merged.

### Trace row (10 cells, header order)

| ADR-0018 (arch note) | Architect/Design: owner-approved dated note on ADR-0018 (…366ebd9e) + 70-runbook.md § Deploy dated correction ("built" → UCI artifact built locally by npm run build; nothing published or deployed): package.json has had bin skytalix → dist/uci.js since ABC-168 (825b21d1, merged 513c0211); D2's executable leg fired, publishable leg not; channel (chess = node src/cli.ts) unchanged; D1/D3/D4/D7 hold; no STOP | EPIC-006 | ABC-168 | ADR-0018 D1–D4, D7; ADR-0007 § Note 2026-10-23; ADR-0044 D8; AR-1 check 3 | `grugops/arch-adr0018-bin-note` @ `6911a99b` (records only)<br>`.grugops/context/arch-adr0018-bin-note/notes/` (…a6addc0d, …5ffd0ca7) | records only; read-only readings on main 7fa33c0c (git show / git log -S/-G / find) | — | — | DONE (no STOP); merge is the Orchestrator's |
