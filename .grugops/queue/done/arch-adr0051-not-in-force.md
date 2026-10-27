---
subtask: arch-adr0051-not-in-force
role: architect-design
ref: .grugops/context/arch-adr0051-not-in-force/
branch: new records branch grugops/arch-adr0051-not-in-force from main, worktree ../wt-arch-adr0051-not-in-force
width: 2 of 2 — records only (no npm, vitest, build or timing)
---

# ADR-0051: accepted, not in force on main (ABC-210 not merged); ADR-0050 d9 P2 did not land

## Do
- Read Orchestrator `orch-2026-10-27k/…85e9c9b2` and QE `qe-ABC-210/…b953e670`.
- **ADR-0051 § Status:** add a dated line: **accepted, not in force on main**. ABC-210's single reading was S1 NOT MET (pooled 800 games NEUTRAL −4.78 ± 16.21), so the ticket was not merged. Use the ADR-0025 D4 / ADR-0026 d9 precedent; fix any pointer line at the top to match.
- **ADR-0050 d9:** on the dated P2 line, add that **P2 did not land**: `zugzwang.005` stays at depth 12 on main. The table row stays unchanged.
- Check read-only that `src/search.ts` / `src/engine.ts` on main carry no check extension.
- Run `node tools/grugops/reference-check.js` on both ADRs.
- Records only: `git diff --stat main...HEAD -- src tools package.json` must print nothing. Paste it.

## Fences
- Work only in your worktree. Don't touch the board or ticket pages.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `arch-adr0051-not-in-force`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Done, records only.** Branch `grugops/arch-adr0051-not-in-force` @ `880fdab3` (`b6c06557` ADRs + `880fdab3` note), cut from `main` `06c1ecc8` (worktree `../wt-arch-adr0051-not-in-force`). Not pushed, not merged.

- **ADR-0051 § Status: dated top line "2026-10-27: accepted, not in force on `main`"**, in the `ADR-0026` d9 / `ADR-0025` D4 form.
  - It cites `ABC-210`'s single reading, S1 NOT MET: d1 NEUTRAL −1.7 ± 22.8, the one extension d2 NEUTRAL −7.8 ± 23.0, pooled over 800 games NEUTRAL −4.78 ± 16.21 (QE `…b953e670`, failed attempt `…86b45c13`, at merge `d71fc369`). Not merged (Orchestrator `…85e9c9b2`). `grugops/ABC-210` `a96f36b0` is kept unmerged.
  - Bullets: no check extension on `main`; `ADR-0024` d4 stands; P2 did not land (P1 did not land either); decisions 1–8 stay as the accepted text. The line moves no code.
- **The top pointer is fixed to match:** the 2026-10-27 ACCEPTED block (owner word `…047d411f`, "in force on `main` at `ABC-210`'s merge") is kept as "Previously (2026-10-27)". The older PROPOSED block is untouched. Rollback gets one line, "2026-10-27: not reached". No other section changed (+16/−1).
- **ADR-0050 d9:** the dated P2 bullet gets "**2026-10-27: P2 did not land.**" It cites `…b953e670` / `…85e9c9b2`: `zugzwang.005` stays at depth 12 on `main`. The table row is unchanged (+4/−0).
- **`main` checked read-only at `06c1ecc8`:**
  - `src/search.ts` and `src/engine.ts` have 0 check-extension matches (`checkExtension` / `CHECK_EXTENSION` / `WithoutCheckExtension`).
  - `grugops/ABC-210` is not an ancestor of `main`.
  - In `src/search.null-move.test.ts`, `zugzwang.005` reads `depth: 12`. In `src/transposition.test.ts`, the `ABC-081` `A5` row reads −485 at depth 3.
- **Checks:**
  - `node tools/grugops/reference-check.js` printed `No findings.` (rc 0) on ADR-0051 and on ADR-0050.
  - `git diff --stat main...HEAD -- src tools package.json` printed nothing (rc 0). The pasted output is empty:
    ```
    ```
  - Class scan over the branch's added lines (personal paths, IPv4, URLs, host/realm/cluster/namespace patterns): 0 hits.
  - No npm, vitest, build or timing was run.
- **Note** (`.grugops/context/arch-adr0051-not-in-force/notes/`, 1): decision `20261027T193628Z-architect-design-decision-c32c79d0`. It was sealed by grugops 2.1.0 `admitAndAppend` (no findings), with `at` 2026-10-27T19:36:28Z from `date -u`. Read back with `readContext` (1 note); index rendered.
- **Not done:** no board, ticket-page, EPIC-008 or `plans/traceability.md` edit, no push.
- **For the Orchestrator:** merge `grugops/arch-adr0051-not-in-force` when ready. No drift rows are owed to other roles: neither ADR names a build-time edit that is now owed. AGENTS.md's check-extension lane line not landing is the Orchestrator's (`…85e9c9b2` item 3) and is not touched here.

### Trace row (10 cells, header order)

| ABC-210 (arch-adr0051-not-in-force) | ADR-0051 dated line "2026-10-27: accepted, not in force on main" (ADR-0026 d9 / ADR-0025 D4 form); S1 NOT MET, pooled 800 games NEUTRAL −4.78 ± 16.21 (…b953e670); not merged (…85e9c9b2); ACCEPTED block kept as Previously, Rollback "not reached". ADR-0050 d9 dated P2 line: P2 did not land, zugzwang.005 stays at depth 12; table row unchanged | EPIC-008 | no check extension on main; leaf hands in-check positions to quiesce as before (ADR-0024 d4 stands) | none moves (no NFR bound or ADR-0026 level; ADR-0050 bars unchanged) | `grugops/arch-adr0051-not-in-force` @ `880fdab3` (b6c06557 ADRs + note …c32c79d0, on 06c1ecc8)<br>ADR-0051 § Status + § Rollback; ADR-0050 decision 9 | records only: `git diff --stat main...HEAD -- src tools package.json` empty; reference-check No findings ×2; class scan 0; main 06c1ecc8 checked read-only (0 check-extension matches, zugzwang.005 depth 12, ABC-210 not an ancestor); no npm/vitest/build | n/a (records); UAT not signed (QE FAIL on A5) | not released; ADR-0051 not in force on main | Backlog (unchanged; no board move) |
