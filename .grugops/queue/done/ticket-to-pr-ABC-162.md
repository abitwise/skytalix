---
subtask: ticket-to-pr-ABC-162
role: software-engineer
tickets: [ABC-162]
branch: grugops/ABC-162 (from main @ c83fd575 or the main tip at your start); worktree ../wt-ABC-162
ref: .grugops/context/ticket-to-pr-ABC-162/
---

# SE: ABC-162 — run `A7`'s `booked` child from a neutral working directory. Closes `AR-095-CWD`. ZERO production lines

## Read first
- The ticket page `plans/tickets/ABC-162-the-real-engine-book-child-runs-from-the-tree-root-so-a-cwd-relative-book-read-passes.md`: every criterion and its § Scope.
- The notes it cites.
- `AGENTS.md`: the lanes, their heap prefixes, and the 12 coding rules.

## Do
- Create the worktree `../wt-ABC-162` on branch `grugops/ABC-162` from the current `main`. A `node_modules` symlink to main's is fine.
- Implement exactly the page's scope, test-first where the page asks for a kill: show the new row fails on the named wrong build, then passes.
- **Prove each criterion you own** and run all gates green on the tip:
  - lint, typecheck, build;
  - `npm test` with `last-run.json` success;
  - skip-integrity 0;
  - `CLI_DEEP` and `PERFT_DEEP`.
- Every vitest command carries its `NODE_OPTIONS=--max-old-space-size=400` prefix and runs one at a time. Other SE agents run in parallel on other tickets.
- Take no timing; N8 and NFR-008 readings are QE's.
- Measure production lines changed under `src/` excluding tests. If that's empty, the UAT waiver applies.

## Fences
- Only the files the page scopes.
- Don't touch `plans/board.md`, `plans/traceability.md`, other tickets' files, or other worktrees.
- Commit on `grugops/ABC-162` only. Never push or merge.
- Touch no process you didn't start.
- **Stop and report** if a criterion can't be met as written. Don't widen scope.

## Publish
- Sealed notes via the sanctioned writer (`context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-162`), including a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-162.md` (this brief + `## Result`) and `.claim.md` on main, uncommitted. Include:
  - the tip sha;
  - per-criterion results;
  - the gates;
  - the production-lines measurement;
  - a trace row.

## Result

**Done. Every criterion is MET on the SE's readings. QE's P6b re-plant is owed for `AR-095-CWD`'s close.** Software Engineer (claude-opus-5-5), 2026-10-21.

- **Branch / tip:** `grugops/ABC-162` @ **`3d05e2308cd4a8a267f7814ec126bef2af1e0513`** (`3d05e230`), from `main` `51503331`. One commit, not pushed, not merged. Worktree `../wt-ABC-162` is clean.
- **Diff:** exactly `src/cli.real-engine.test.ts` (+36 −9).
  - `A7`'s booked child runs from a fresh `mkdtemp(os.tmpdir()/abc162-neutral-cwd-)` directory, removed by its exact path (`removeCopy`) in that describe's `afterAll`.
  - `spawnReal` gained an optional `cwd` (default: the tree root). Every other child is unchanged.
- **Production lines under `src/` (excluding tests/snapshots): 0.** `git diff --name-only 51503331 3d05e230 -- src | grep -vE '\.test\.ts$|__snapshots__'` is empty. **The UAT waiver applies.**

| criterion | result |
|---|---|
| `A1` | **MET.** The `A7` line reads `(cwd …/T/abc162-neutral-cwd-XXXXXX)`, which is not the tree root and has no `data/` (asserted in the row). Book reply, stderr `""`, exit 0. `CLI_DEEP` 11/11 at the tip |
| `A2` | **MET.** P6b in scratch copies outside the repository: **base test green 11/11**, **head test red 1 failed / 10 passed**. The only red row is `A7` at `expect(booked.stderr).toBe("")`, receiving `opening book could not be read; playing on without it` |
| `A3` | **MET.** 0 of 6 lane-made `os.tmpdir()` paths exist after the head green, P6b head and tip runs, checked by exact path. One glob census caught a parallel agent's transient `abc095-*` copy, not this lane's |
| `A4` | **MET.** Name-only diff = exactly the test file, and the production grep is empty. `npm test` 59 / 1987 at base = 59 / 1987 at tip, skips 0. `CLI_DEEP` 10 deep (+1 default) at both. Children 6 = 6 |

- **Gates at the tip:** lint 0; typecheck 0; build 0; `npm test` exit 0 with `last-run.json` `success: true` (1987 / 0 failed / 0 pending / 0 todo); skip count 0, integrity `No findings.`; `CLI_DEEP` 11 passed; `PERFT_DEEP` 32 passed. **No timing was taken.**
- **Notes** (`.grugops/context/ticket-to-pr-ABC-162/notes/`):
  - `20261021T081200Z-software-engineer-decision-fb754378`: decision, `mkdtemp` over `tmpdir()`, the seam;
  - `…observation-9e1095de`: branch, diff and gates;
  - `…observation-7afc0e5a`: criteria and plants;
  - `…observation-cdcaf82a`: residual, `AGENTS.md:123-126` says "Two real children" but the lane has 6; out of the fence.

  Disclosure: the notes' `at` stamps (08:12Z) were hand-picked about 5 min ahead of the real clock. The work happened 08:01–08:07Z.
- **Owed:** QE re-plants P6b (page Test note 3), and the Orchestrator then records `AR-095-CWD` closed. Board and trace moves are the Orchestrator's.

**Trace row (for the Orchestrator to append):**

| ABC-162 | AR-095-CWD (QE-095-a) | grugops/ABC-162 @ 3d05e230 | src/cli.real-engine.test.ts (test-only; 0 prod lines) | CLI_DEEP ABC-095 A7 now runs from a neutral mkdtemp cwd; P6b green→red on A7; npm test 59/1987 skip 0 | In Review — QE P6b re-plant owed; UAT waiver applies |
