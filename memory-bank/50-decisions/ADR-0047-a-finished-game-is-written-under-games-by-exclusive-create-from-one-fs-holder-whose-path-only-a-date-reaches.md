---
kind: adr
id: ADR-0047
---
# ADR-0047: A finished game is written under `games/` by exclusive create, from one `node:fs` holder whose path only a `Date` reaches

## Status

**accepted by the owner**, 2026-10-23 (owner, verbatim: *"1. accept"*; Orchestrator transcription `…7feb0553`). Drafted by Architect/Design (subtask `arch-design-ABC-203`), for `ABC-203`.

- **Correction 2026-10-23 (Orchestrator, `…3898cd9a`).** As first written, this section said the role
  could accept the ADR itself because the delegation (`…5aaf7cec`, item 3) sends "only a reversal" to the
  owner. Item 3 also names **a new ADR** as the owner's. The ADR was held, put to the owner, and accepted
  by him. Superseded text: "**accepted**, 2026-10-23, by Architect/Design … This ADR reverses none."
- **Product calls.** The product calls under it (automatic write, `quit` writes nothing) are
  BA/PM's, on the `ABC-203` page, and are cheap to reverse before the build.
- **Evidence:** `.grugops/context/arch-design-ABC-203/notes/` and the `## Design ruling` section on
  `plans/tickets/ABC-203-at-game-end-npm-run-chess-writes-the-game-as-a-standard-pgn-file-under-games.md`.

## Context

- `ABC-203` makes the CLI write a file for the first time. Until now production code only read one
  file, `src/book-file.ts`, by a fixed path resolved from its own module URL (`ADR-0037` § Addendum R1).
- A written file is a new kind of exposure. It has a path that someone chooses, bytes that someone
  chooses, and a failure that someone reports. Each of the three needs one owner and one rule.
- `ADR-0036` sets clause (b) as a delta test. The new writer is a limb-1 holder, and the edge from
  `src/cli.ts` to it fires (b2). It is the **sixth** holder (5 at `main` `06fabb18`: `book-file.ts`,
  `uci.ts`, `cli.ts`, `glyph-mode.ts`, `perft-bench.ts`). It is also the first holder that exports a
  function taking a caller value that reaches a capability. Both are re-arm triggers of `ADR-0036`
  § Decision 3 (`security-nfr-ABC-168` `…75a45be0` § 1).
- Spawned test children that reach an outcome run with the repository as their working directory.
  A write relative to the working directory would land in the tree on every `npm test`.

## Decision

**D1. Three modules, one job each.**
- `src/pgn.ts` is pure. It builds the PGN text and the stamp. It imports `history.ts` and
  `turn-loop.ts` as types only (`ADR-0002` clause 4). It does no I/O and reads no clock.
- `src/pgn-file.ts` is the only module that writes a file. It is a capability holder (`ADR-0036`
  limb 1). Its whole contract is: one `node:fs` import, one exported function, no `process.`
  reference, no stdout and no stderr.
- `src/cli.ts` wires them. It reads the clock once, gates on the outcome, and writes the one result
  line on the channel it already owns.

**D2. Only a `Date` reaches the path.** The holder's export takes `(startedAt: Date, text: string)`.
It derives the file name itself, through `pgn.ts`'s stamp, from the `Date`'s local-time getters.
A `Date` can only yield digits, so no caller string, argument, option or environment value can
reach the path. `text` reaches the file's bytes, never its path.

**D3. The directory is `games`, relative to the process working directory.** It is a literal in the
holder. The working directory is the one test seam: it is process state the parent sets, not argv
and not the environment. Under `npm run chess` it is the package root.

**D4. Exclusive create, never overwrite.**
- Create the directory with `mkdirSync("games", { recursive: true })`.
- Open each candidate name with flag `"wx"` (`O_CREAT | O_EXCL`). `EEXIST` moves to the next suffix,
  `-2` to `-99`. After `-99`, the result is `EEXIST`.
- Write all bytes to the open descriptor, then close it.
- If the write or the close fails, remove that one path (this call created it), then report.

**D5. A failure is an errno code, and nothing else.** The holder returns
`{ ok: true, path } | { ok: false, code }`. A caught error whose `code` matches `^E[A-Z0-9]+$` becomes
`{ ok: false, code }`. Any other throw is a defect. It is rethrown and reaches `cli.ts`'s one session
`try`/`catch`, which already exits `70`. No message text and no stack is ever printed.

**D6. The clock is read once, in the composition root.** `cli.ts` reads `new Date()` exactly once,
just before `runTurnLoop(`. The same value names the file and gives the `Date` tag. This mirrors
`src/uci.ts`, which binds `Date.now` at its root. No virtual clock reaches `cli.ts` (`ABC-086` `A5`).

**D7. Spawned children run the entry point from a neutral working directory.** A test child that
executes `src/cli.ts` and can reach an outcome runs with a fresh `mkdtemp` directory as its working
directory. The test removes the directory by the exact path `mkdtemp` returned. This is the
`ABC-162` precedent. Only a child that npm must run from the package root keeps the repository as its
working directory, and it must end without an outcome. A test row proves it: no child whose working
directory is the repository prints a `PGN saved:` or `PGN not saved:` line.

## Alternatives

| # | alternative | verdict |
|---|---|---|
| 1 | The holder takes a path or a name string | **Rejected.** A caller string reaching a write path is the shape `ADR-0037` R1 option 4 rejected for reads (`V12.3.1`). A `Date` closes it by type |
| 2 | Resolve `games/` from the module URL, like the book | **Rejected.** The file would always land in the clone. Every test child would then write into the tree, and the only fix is a copied tree per child. The working directory gives that seam for free |
| 3 | A `--pgn-dir` flag or an environment variable | **Rejected.** It widens the argv or environment surface, and BA/PM fenced it out of scope |
| 4 | `writeFileSync(path, text, { flag: "wx" })` in one call | **Rejected.** On a failure after the open, the caller cannot tell whether the file exists, so it cannot honour "no partial file" without risking a file it did not create |
| 5 | Refuse a `games` symbolic link by `lstat` | **Not decided here.** Security/NFR rules it (§ Consequences). The default in D4 follows it |
| 6 | Read the headline off `renderResultScreen`'s rows | **Rejected.** It couples the record to the screen's layout (the leading blank row). `result-screen.ts` exports its existing headline function instead, and the rows do not change |
| 7 | Read the clock in the holder at write time | **Rejected.** The scope fixes the stamp at game start, and a holder with a clock is harder to test |

## Consequences

- **Measured on this host** (Node 26.11.1, macOS, non-root, scratchpad only):
  - `games` is a regular file: `mkdirSync` recursive gives `EEXIST`.
  - `games/` has mode `0555`: `mkdirSync` succeeds and the `"wx"` open gives `EACCES`.
  - The last component is a dangling symbolic link: the `"wx"` open gives `EEXIST` and follows nothing.
  - `games` is a symbolic link to a directory: both calls succeed and the file lands in the target.
  - `games` is a dangling symbolic link: `mkdirSync` recursive gives `ENOENT`.
  - `new Date(2026, 9, 23, 14, 5, 9)` reads back `2026 10 23 14 5 9` under `TZ` +14 and −10.
  - `process.chdir` in a worker thread throws `ERR_WORKER_UNSUPPORTED_OPERATION`.
- **For Security/NFR, owed at `ABC-203`'s gate:**
  - `ADR-0036` (b1) limb 1 fires on `src/pgn-file.ts`. (b2) fires on `cli.ts -> pgn-file.ts`.
  - § Decision 3 re-arms twice: a sixth holder, and a holder taking a caller value that reaches a
    capability. Rule whether (b2) needs a call-graph reach. This role's input: no. The holder has one
    importer, and the edge already fires (b2). A new call over that edge can pass another `Date` or
    other text, but never a path byte.
  - Rule on a `games` symbolic link to a directory (measured: followed). This role's input: accept
    as LOW. Planting a link in the clone needs write access to the clone, which already runs code
    through `src/`. The write is still exclusive, and the bytes are product-made.
- **What does not move.** `ADR-0007` and `ADR-0018` (local, inside the clone). `ADR-0011` clause 4
  (`cli.ts` exports nothing). `ADR-0002` clause 4 (type-only imports). `ADR-0029` (the frame path
  root is `render-seam.ts`, and nothing on it imports the new modules). `ADR-0016` (no new stream).
  `ADR-0021` (no loop change). `ADR-0036` fires as designed.
- **Cost.** Two production files of about 80 and 40 lines. The default lane gains one test file and
  one spawn. The holder's cases cannot run in-process: the lane uses `pool: "threads"`, where
  `process.chdir` throws `ERR_WORKER_UNSUPPORTED_OPERATION` (measured). One child runs them all from a
  `mkdtemp` working directory.

## Rollback

Revert the `ABC-203` merge. The two modules, the wiring, the test edits and the `.gitignore` line go
together. Files already written under `games/` stay on disk, because they are the owner's records.
Strike this ADR's status to `superseded` with the reverting commit named.

**What would falsify it:**
- a test child writes into the repository during `npm test`;
- a caller value other than a `Date` reaches the path;
- a pre-existing file changes bytes or mtime;
- stderr carries anything but `PGN not saved: <CODE>`.
