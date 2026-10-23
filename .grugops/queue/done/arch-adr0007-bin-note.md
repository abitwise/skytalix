---
subtask: arch-adr0007-bin-note
role: architect-design
ticket: memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md
ref: .grugops/context/arch-adr0007-bin-note/
width: 2 (records only; disjoint files from bapm-close-EPIC-007-M2)
---

# Add the owner-approved dated note to ADR-0007 recording `bin` since ABC-168 (records only)

## Do
- The owner approved (`…d3681daa`) a dated note on ADR-0007 / §Deployment posture recording that `package.json` has carried a `bin` (`skytalix` → the built `dist/uci.js`) since ABC-168. Read the AR-1 re-statement records named in the ref README for the exact facts, and verify them against `main` (`package.json`, `git log` of the `bin` line).
- One dated, additive note. It records a fact; it does not reverse or amend the decision, and the local-only posture is unchanged. If you find the fact DOES change the posture (e.g. it implies publishing), STOP and report: that is a new ADR and the owner's.
- If `memory-bank/00-index.md` or the ADR index needs a pointer, keep it to one line.

## Fences
- Work on `grugops/arch-adr0007-bin-note` (worktree `../wt-arch-adr0007-bin-note` from `main`). Only ADR-0007 (+ an index line) and your notes. No `src/`, `package*.json`, `plans/`, `.grugops/factory.config.json`, `AGENTS.md`. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/arch0007/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `arch-adr0007-bin-note`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**DONE: the note was added, and the STOP condition did NOT fire** (Architect/Design, 2026-10-23). Branch `grugops/arch-adr0007-bin-note` @ `18d4295f`, one commit on `main` `2d962400`. Records only.

- **ADR-0007:** additive only (+60/−0):
  - a dated `Note 2026-10-23` pointer in `## Status`;
  - a `## § Note 2026-10-23: a bin since ABC-168` section at the end.
  - No clause was amended and no falsifier row was edited.
- **The facts, verified on `main` `2d962400`:**
  - `package.json` reads `[true,{"skytalix":"dist/uci.js"},false,false,false]` for `[private, bin, main?, exports?, files?]`.
  - The `bin` came in with `825b21d1` (ABC-168, 2026-10-21) and reached `main` in merge `513c0211` (2026-10-22). Nothing has changed it since (`git log -S`/`-G`).
  - `build` is `tsc -p tsconfig.build.json`, with `files: ["src/uci.ts"]` and `outDir: dist`. `dist/` is git-ignored and 0 of its files are tracked.
- **`D2`:** the "exposes an executable" leg FIRED. The "publishable" leg did not.
- **The other falsifiers hold:** `D1` finds 0 deploy artifacts and no YAML file. `D3` finds 0 remotes. `D4` finds `.gitkeep` only. `D7` reads `true`. `deploy` is `none-local-only` and `environments` is `["local"]`.
- **Why there was no STOP:** the `bin` is a local executable on a private, unpublishable package. `ADR-0044` D8, which the owner accepted, already placed it inside ADR-0007 and ADR-0018. The posture is unchanged.
- **`D2` baseline:** the note records the reading above, so any other reading fires `D2` again. The row itself was not edited.
- **Index:** no line was added. `00-index.md` has no per-ADR rows, and no separate ADR index exists.
- **Notes** (in `.grugops/context/arch-adr0007-bin-note/notes/` on the branch, sealed by grugops 2.1.0 `admitAndAppend`, read back as 2 notes with seals ok, index rendered):
  - `20261023T105540Z-architect-design-observation-97e856c3` (the facts);
  - `20261023T105540Z-architect-design-decision-0f003634` (the ruling).
- **Follow-ups (INFO, Orchestrator):**
  - `ADR-0018` has the same `D2` row and out-of-date "no `bin`" / "no `dist/` is emitted" wording.
  - `70-runbook.md` § Deploy says "Nothing is published, built or deployed".
  - Both are outside `…d3681daa`'s approval and were not touched.
- **Not touched:** `src/`, `package*.json`, `plans/`, `.grugops/factory.config.json`, `AGENTS.md`. No column moved. Nothing was pushed or merged.

### Trace row (10 cells, header order)

| ADR-0007 (arch note) | Architect/Design: owner-approved dated note on ADR-0007 (…d3681daa): package.json has had bin skytalix → dist/uci.js since ABC-168 (825b21d1, merged 513c0211); D2's executable leg fired, publishable leg not; D1/D3/D4/D7 hold; posture unchanged; no STOP | EPIC-007 | ABC-168 | ADR-0007 D1–D4, D7; ADR-0044 D8; ADR-0018 (follow-up); AR-1 check 3; AR-168-BINPIN | `grugops/arch-adr0007-bin-note` @ `18d4295f` (records only)<br>`.grugops/context/arch-adr0007-bin-note/notes/` (…97e856c3, …0f003634) | records only; read-only readings on main 2d962400 (git show / git log -S/-G / find) | — | — | DONE (no STOP); merge is the Orchestrator's |
