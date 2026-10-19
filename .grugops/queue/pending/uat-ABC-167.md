---
task: uat-ABC-167
subtask: uat-ABC-167
role: qe-e2e
workflow: agent-factory/workflows/06-uat-pack.md
ticket: plans/tickets/ABC-167-a-capability-free-uci-session-answers-the-d3-commands-with-the-d4-time-rule-and-the-go-limits.md
ref: .grugops/context/uat-ABC-167/
branch: grugops/uat-ABC-167
base: grugops/ABC-167 @ 660a0d50
---

# Subtask: QE goes over ABC-167's UAT items (the capability-free UCI session)

The owner chose QE to run this UAT (`.grugops/context/wave-2026-09-25/notes/…5d7c2e18`). Follow the shape of the ABC-170 precedent, `.grugops/context/uat-ABC-170/`. **Do not run** the UAT Planner or BA/PM hops of Workflow 06. **The waiver does not apply,** because `src/uci-session.ts` is production code. **The owner's word signs.**

## Read first
- `AGENTS.md` § Test and UAT authority, and the "QE is NOT UAT" paragraph.
- The ticket page: A1–A12, plus the rows amended on 2026-10-18.
- ADR-0044, sections D2–D5 and D12.
- The notes from these hops:
  - `qe-ABC-167`
  - `qe2-ABC-167`
  - `secnfr-ABC-167` (PASS_WITH_RISKS; R-167-1 and R-167-2, both accepted)
  - `bapm-amend-ABC-167` and `bapm-amend2-ABC-167`
- The ticket-to-pr done files.

## What this ticket makes hard
ABC-167 is the **session logic only**. The `skytalix` binary and stdin/stdout arrive with ABC-168, so no chess GUI can talk to it yet.

- A UAT scenario is a **UCI dialogue**: the lines a GUI would send, and what the engine writes back. Drive it through the module's public API, using a throwaway harness under `ref:`.
- Cover what a GUI user gets:
  - the handshake (`uci` / `isready`);
  - a game from `position startpos moves …` with legal `bestmove`s;
  - a FEN position;
  - the time controls a GUI sends (`wtime`/`btime`/`winc`/`binc`/`movestogo`/`movetime`), all under the 3 s cap;
  - `go depth` / `nodes` / `mate`;
  - `go infinite` + `stop`, and `ponder` + `ponderhit`;
  - a held `bestmove` released on `position` / `ucinewgame` / `quit`;
  - bad input (a refused FEN, an illegal move, control characters, a missing value) never crashes and always answers;
  - mate and stalemate positions;
  - `quit`.
- **Do not re-run QE and call it UAT.** Grade only what can be observed.
- State plainly what cannot be observed until ABC-168: the binary, the real stdin/stdout, a real GUI (cutechess-cli / En Croissant), and OwnBook / Skill Level (ABC-171).
- Clock scenarios run **on the virtual clock only**. **No timing readings.** N8-LANE stays OWED (R-167-2 is accepted).

## Also, one pointer note (QE-166-d)
`qe-hop-integrity --ticket ABC-166` needs a QE decision note in a folder whose name carries the ticket id.
- Write `.grugops/context/qe-ABC-166/notes/<stamp>-qe-e2e-decision-abc166-pointer-to-qe-abc146-166-<hex8>.md`.
- Use `type: decision` and `role: qe-e2e`. The note is unsealed and hand-authored.
- It points to `.grugops/context/qe-ABC-146-166/notes/…7b4e1d93` (PASS_WITH_GAPS) and adds no new grading.
- Confirm that `node tools/grugops/qe-hop-integrity.js --ticket ABC-166` exits 0.

## Gates
Run these at tip `660a0d50`:
- lint, typecheck, build, and `npm test`;
- confirm `last-run.json` shows `success: true` with the full count;
- integrity at skip 0;
- `git merge-tree` against main must be clean.

## Fences
- Work in a scratch worktree, `git worktree add ../wt-uat-ABC-167 -b grugops/uat-ABC-167 660a0d50`.
- **Do not touch** `../wt-ABC-167`, `src/`, `plans/board.md`, `plans/traceability.md`, `AGENTS.md`, `package.json`, `vitest.config.ts`, or any process you did not start.
- Do not fix defects; a failing UAT is a legitimate result.
- Do not merge, push or self-sign. Word the result so it can never be read as the owner's acceptance.
- Do not commit `uat/*.uat.spec.ts`.

## Publish
- **On the branch:** commit the notes, including a `kind: decision` note by `qe-e2e`, and a UAT pack under `ref:`. The pack holds:
  - the scenarios, mapped to the criteria;
  - the test data;
  - the pass/fail criteria;
  - the known limitations;
  - a one-word signoff checklist for the owner (accept / reject).
- **The pointer note goes in main's working tree, uncommitted.**
- Write `.grugops/queue/done/uat-ABC-167.md` and `.claim.md` in main's working tree, uncommitted. They hold:
  - the result;
  - the commit;
  - the gates;
  - the checklist;
  - a trace row.
