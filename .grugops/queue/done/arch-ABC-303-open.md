---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T23:27:13Z
subtask: arch-ABC-303-open
role: architect-design
ref: .grugops/context/arch-ABC-303-open/
branch: new grugops/arch-ABC-303-open from main — worktree .claude/worktrees/arch-ABC-303-open
width: records. One read-only deep run allowed for item 2, under the host lock. No src or test edits.
---
# Rulings owed before bundle 1's read
Read se-ABC-303's Result and notes on grugops/ABC-303 (tip 20b85d09; decision …1dbca0e2, rows …75e4058e), ABC-303 § Open, ruling …42c82347, and the Orchestrator's …3c67d3c4.
1. FIRST. ABC-279 A3 (a), src/see.test.ts. All on, the shipped path read 90.91 % within 25 cp, max 96 cp, 0 sign changes, against ADR-0069 F1's ≥ 93 %. The engineer re-pointed both recursions to the all-off door; ADR-0072 d7 names only rows pinning counts. Rule: is this a bar or a pin? May it re-point? If it must stay on the shipped path, it is a red nothing overrode: say whether that is a STOP, and whether it needs the owner. His override named the audit, drift and CH3 rows only, so do not stretch it. State what the row measures and what 90.91 % means for play, in plain words.
2. ABC-271 K0: seven deep rows in src/evaluate.passer.test.ts are reported red on main 1bcdbf2d, pinning pre-ABC-283 figures on the shipped path. Confirm by one deep run of that file on main. If red: say how main came to carry them, how a deep red reached main past QE, who owns the fix, whether it is a re-point or something else, and whether ABC-301's fit or reads are touched. Identity rows are never re-pinned.
3. ABC-303 § Open 1: a candidate fault against "never re-played", for C2′, S′ and Levels.
4. ABC-303 § Open 2: S′'s E.
5. Whether the block's two reasons for reading the bundle first stand on a base moved by ABC-301, and what that changes, if anything. The owner's order stands unless you show cause; nothing moves a bar.
6. NFR-009's sum row in src/transposition.test.ts counts neither the history table nor the countermove table: is it owed in ABC-303 or elsewhere?
Fences: memory-bank/50-decisions and your records only. No ticket, EPIC, board, src or test edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-303-open, contextRoot = the worktree's .grugops/context, `at` from `date -u`, run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result

**2026-11-04, Architect/Design. All six items ruled. Records only, plus the one deep run item 2 allows, on `grugops/arch-ABC-303-open` from `main` `c118a5cf`. Nothing pushed or merged, no `src/`, test, ticket, EPIC or board edit, nothing left running.**

- **1, `ABC-279` A3 (a) (`…84f9bae1`):** a bar, and it may re-point, under `ADR-0072` d6, which takes in `ADR-0050` d4 and `ADR-0058` d5; d7 was the wrong sentence to read. 90.91 % is no red, no STOP, no owner question, and the override is not used. The row sits one rung short: its door of record is `…WithoutBundle`, reading expected at 96.26 % / 95.72 %, `UNKNOWN - verify`. That gates nothing.
- **2, K0 (`…261ea757`, `…e28552ac`):** RED on `main`, 7 failed of 28. A stale row, no engine defect. It came in between `ABC-271`'s pin and `ABC-283`'s merge: the re-read's list had no deep lanes and its brief fenced the expectation. Fix: re-point to `…WithoutBundle`, figures and frozen file untouched, one test-only ticket. `ABC-301`'s fit is untouched; K0 retires at its scope 4 (`ADR-0067`).
- **3, a candidate fault (`…5aee89b7`, `ADR-0056`):** no pass at any score; verdict test; then one new C2′ only if the fault could have decided it. A played C2′ stands only after a value-identical fix.
- **4, S′'s E:** the E in force at the seal, 1 810 today. The pool stands at 18.5 / 30 = 61.7 %, no step.
- **5, the order:** stands. Two sentences narrow. R1 and R2's hop also brings P3 and P4.
- **6, `NFR-009`'s sum:** the countermove's term in `ABC-303`; the history term on `main`, in K0's hop.
- **Supersession:** `…e28552ac` replaces `…aab9f064`, one mistyped ref and one time. `…5aee89b7` corrects one phrase of `…84f9bae1`.
- **Owner:** nothing from these items needs his word. Two readings are flagged to the Orchestrator; either read the other way makes an owner question or a STOP: the new C2′ against B4, and K0 against "identity".
