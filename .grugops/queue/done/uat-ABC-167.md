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

---
done_at: 2026-10-19T10:03:30Z
branch: grugops/uat-ABC-167 (worktree ../wt-uat-ABC-167, from grugops/ABC-167 @ 660a0d50)
commit: 395cf655
tree_under_test: 660a0d50 (unchanged; src/uci-session.ts md5 b05800c2… before and after)
result: UAT conducted — PASS_WITH_GAPS on the observable half; NOT accepted, owner's word owed
---

QE/E2E conducted the UAT by the owner's delegation (`…5d7c2e18`). **This is not the owner's acceptance.** The owner's
word in session signs. The UAT Planner and BA/PM hops were not run. **No timing reading was taken.** Every session
ran on `virtualClock`, and N8-LANE stays OWED (R-167-2). No other process was touched.

- **Scenarios:** 13 of 13 PASS, 2876 of 2876 checks. Each is a UCI dialogue through `createUciSession` /
  `handleLine`, with a throwaway harness in the GUI's seat. RUN-1 and RUN-2 are byte-identical (sha256 `8033c6ea…`).
  - S1 handshake, 23/23. S2, two clocked games (60 plies at 3+2, 40 at 10+0.1), 1142/1142. S3, FENs, castling, en
    passant and promotion, 91/91. S4, `go depth` / `nodes` / `mate`, 93/93.
  - S5, 17 GUI time controls in their D4 windows and under the 3 s cap, 153/153. S6, `infinite` + `stop` and
    `ponder` + `ponderhit`, 36/36. S7, a held `bestmove` released by `position` / `ucinewgame` / `quit` / `go`, 46/46.
  - S8, bad input (19 ignored lines, 11 refused positions, 27 `go` value lines), 745/745. S9, mate and stalemate,
    47/47. S10 `quit`, 5/5. S11 new game, 28/28. S12 repeatability, 464/464. S13, all 648 lines are protocol lines
    and printable, 3/3.
- **Per criterion:** A1, A2, A3 (+h1), A4 (+a1, a2), A5 (+b1–b5, c1), A6 (+d1, e1–e5), A7 (+f1–f3, h1, i), A8, A9
  (+h1) and A10 all PASS. A11 PASS on the observable half (M4). A12 PASS, re-measured. NFR-004 PASS on the virtual
  clock. **NFR-008 N8-LANE OWED** (R-167-2, accepted).
- **Not observable until ABC-168:** the `skytalix` binary, real stdin/stdout (readline, EPIPE, exit codes), a real
  GUI (cutechess-cli, En Croissant, Lichess), and real time (flagging, `isready`/`stop` latency during a search).
  **Until ABC-171:** the `option` lines, `setoption` OwnBook / Skill Level, the book and levels 1, 2, 4 and 5. Not
  in v1 (D6): `searchmoves`, a per-iteration `info`, real pondering, and the search seeing repetitions (`…19c7115a`).
- **Gates at 660a0d50:**
  - lint 0, typecheck 0, build 0;
  - `npm test` exit 0 on the first run, 59 files, 1915/1915;
  - `last-run.json` reads `success: true`, total 1915, passed 1915, failed 0, pending 0, todo 0;
  - integrity at skip 0: `No findings.`;
  - `merge-tree` against main `ad8b5e3b` is clean, at the tip and again at `395cf655`.
- **Harness controls** (on scratch copies): all eight are caught (C1–C8: printable filter, `position` release, the
  3 000 cap, the black increment, the promotion letter, `ponder` hold, overhead, `quit` release). C4, C5 and C7
  are each caught by one check only.
- **Defects: 0.** INFO items:
  - `UAT-167-a`: my own fixture error in RUN-0. `k7/8/1K6/8/8/8/8/1Q6 w` is a mate in 2, not a mate in 1. It caused
    4 FAILs, and the engine was right both times. The fixture was replaced and self-checked, and the change is
    disclosed in `probe/harness-RUN-0-excerpt.txt`.
  - `UAT-167-b`: D6 repetition. The 3+2 game reaches a threefold repetition by ply 48.
  - `UAT-167-c`: `a7a8` with no promotion letter is refused, which conforms to UCI.
- **Notes** (in `.grugops/context/uat-ABC-167/notes/` on the branch, hand-authored, unsealed): `…af06cf1f` (pack,
  artifact-ref), `…4da0ace4` (run), `…19c7115a` (not observable), `…530eb78c` (gates, fences, controls) and
  `…da3cca56` (decision). `qe-hop-integrity.js --ticket ABC-167` on the branch reports covered (qe-e2e).
- **QE-166-d pointer (main's working tree, uncommitted):**
  - the note is
    `.grugops/context/qe-ABC-166/notes/20261019T095041Z-qe-e2e-decision-abc166-pointer-to-qe-abc146-166-3acddd34.md`;
  - it points to `…7b4e1d93` and adds no grading;
  - it carries `kind`/`by`, which the tool parses, as well as the brief's `type`/`role`;
  - `node tools/grugops/qe-hop-integrity.js --ticket ABC-166` → `ABC-166: covered (qe-e2e).`, **exit 0**.
- **Lane cost (reported, not graded):**
  - default lane: +0 files, +0 rows, +0 spawns;
  - the harness: about 5.73M engine nodes per run, 0 child processes;
  - runs: 3 on the tip and 8 on the controls, plus one gate pass;
  - no wall-clock figure is reported.
- **Untouched:**
  - `src/`, `AGENTS.md`, `package.json`, `vitest.config.ts`, `plans/board.md`, `plans/traceability.md`;
  - `../wt-ABC-167`.

  Nothing was pushed or merged, and nothing was self-signed. No `uat/*.uat.spec.ts` was written.
  `pending/uat-ABC-167.md` and `claimed/uat-ABC-167/` are left for the Orchestrator's close.

Owner's one-word signoff checklist (from `…af06cf1f`):
1. Do S1–S13 describe what you want a UCI GUI to get from this session?
2. Do you accept the "owner may overrule" held-`bestmove` rulings (A6-e2, e3, e4: the held move is written first
   on `position` / `ucinewgame` / `quit`), as S7 observed them?
3. Do you accept that the binary, real stdin/stdout, a real GUI and real timing are proven on ABC-168, and the
   options, book and levels on ABC-171?
4. Do you accept the run's result, 13/13 PASS and 2876/2876 checks, with N8-LANE still OWED under R-167-2?
5. **Overall: accept or reject ABC-167?**

Trace row:
| ABC-167 (UAT) | Capability-free UCI session. QE-conducted UAT by the owner's delegation (`…5d7c2e18`), subtask `uat-ABC-167`, at tip `660a0d50`. 13/13 UCI-dialogue scenarios PASS, 2876/2876 checks, through `createUciSession`/`handleLine` on virtual clocks, with a harness in the GUI's seat (two clocked games, 17 time controls, depth/nodes/mate, infinite/ponder, held release, bad input, mate/stalemate, quit). Two runs byte-identical. Controls C1–C8 all caught | EPIC-007 | — | NFR-004 PASS (virtual); NFR-008 N8-LANE OWED (R-167-2); no timing reading | unchanged: `src/uci-session.ts` (production, new) | Harness under `.grugops/context/uat-ABC-167/probe/` (not a lane row). Lane 59 files / 1915 green; skip 0; integrity "No findings." | **UAT conducted — owner's word owed** (notes `…af06cf1f`, `…4da0ace4`, `…19c7115a`, `…530eb78c`, `…da3cca56`) | — | Branch `grugops/uat-ABC-167` @ `395cf655`; not merged, not pushed; no board move. Binary/stdin/GUI/real time are ABC-168's; options/book are ABC-171's. INFO `UAT-167-a` (RUN-0 fixture error, disclosed), `-b` (D6 repetition), `-c` (no promotion letter refused) |
