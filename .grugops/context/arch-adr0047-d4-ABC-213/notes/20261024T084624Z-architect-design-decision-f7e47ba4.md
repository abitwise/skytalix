---
id: 20261024T084624Z-architect-design-decision-f7e47ba4
kind: decision
by: architect-design
at: 2026-10-24T08:46:24Z
verified_by: 
confidence: high: a records-only clarification; the built holder read at e46db08e; QE readings cited
refs:
  - ABC-213
  - ABC-203
  - EPIC-006
  - ADR-0047
  - ADR-0015
  - AR-203-UNLINK
  - QE-213-d
  - QE-213-e
  - plans/tickets/ABC-213-a-failed-pgn-save-reports-its-first-error-code-even-when-the-cleanup-also-fails-and-leaves-no-partial-file.md
  - memory-bank/50-decisions/ADR-0047-a-finished-game-is-written-under-games-by-exclusive-create-from-one-fs-holder-whose-path-only-a-date-reaches.md
  - arch-design-ABC-213/20261023T223723Z-architect-design-decision-d7ce173f
  - qe-ABC-213/20261024T084131Z-qe-e2e-decision-aceaddaf
  - qe-ABC-213/20261024T084131Z-qe-e2e-observation-cd83ece0
  - qe-ABC-213/20261024T090500Z-orchestrator-decision-502866f9
  - owner-delegation-2026-10-22/20261022T140148Z-orchestrator-decision-5aaf7cec
  - grugops/ABC-213
  - e46db08e
  - 2c3be9ca
supersedes: 
seal: sha256:98d44fc5b69672eb4ff0098ded0df2ad4ed968f8ca98a7e2894fdb333668d93b
---

# ADR-0047 D4 dated line written for ABC-213: a clarification, no decision moved; records only, src/tools/package.json diff empty

Architect/Design, task `arch-adr0047-d4-ABC-213`, branch `grugops/arch-adr0047-d4-ABC-213` cut from `main` `2c3be9ca`. It is the line the `ABC-213` design ruling drafted (`…d7ce173f`, page § Design ruling) and the Orchestrator routed (`…502866f9`). QE owed item 4 (`…aceaddaf`).

## Written (ADR-0047 § Decision, last bullet of D4)
The drafted text, plus two edits for precision only. The row ids carry their ticket (`ABC-213`'s `A1`–`A3`, `ABC-203`'s `A8`–`A10`, because both tickets use `A1`…). It also names `A2` as the single-fault pin of D4's removal.

## Why no decision moves (the STOP did not fire)
- D4 says "remove that one path, then report". It is silent on a removal that itself fails. The line keeps the removal attempt and reports the failure that triggered it.
- D5 decides the rest. The result is an errno code, and a codeless throw is a defect that is rethrown. The line restates D5 for the cleanup branch. It grants nothing new.
- "The partial file may remain" is forced: the unlink has just failed. Before the fix the same file remained, and the session also exited 70 (QE A5 base). No falsifier in § Rollback moves. D7 and § Consequences' "one child runs them all" still hold for `ABC-203`'s writer rows. The in-process double sits outside `ADR-0015`'s letter, as the design ruling decided.
- So it is below the owner's bar (`…5aaf7cec` item 3: a new, changed or reversed ADR). The Orchestrator routed it as a clarification (`…502866f9`).

## Verified against the build (read only, `git show grugops/ABC-213:src/pgn-file.ts`, tip `e46db08e`)
- The cleanup is `try { unlinkSync(path) } catch (error) { errnoOf(error); }` and then `return { ok: false, code: errnoOf(failure) }`. The close catch is `failure ??= error`. So the first code is reported, an errno-coded unlink error is dropped, and a codeless one is rethrown.
- QE A5 at head: exit 0, stderr `PGN not saved: EFBIG`, and 1 file in `games/` (`…cd83ece0`). That is the line's "may remain" (QE-213-e).

## Not done here (fenced)
- QE-213-d (the `src/pgn-file.ts` header still says "is removed") is the SE's, routed in `se-ABC-213-probe-rows`. This hop touches no `src/`.
- No board edit, no traceability edit, no merge.
