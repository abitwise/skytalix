---
id: 20261011T082600Z-qe-e2e-artifact-ref-abc094-uat-pack-4b00155a
kind: artifact-ref
by: qe-e2e
at: 2026-10-11T08:26:00Z
verified_by:
confidence: high
refs:
  - ABC-094
  - ABC-095
  - ABC-096
  - EPIC-005
  - QE-094-a
  - src/book.ts
  - data/opening-book/book.json
  - .grugops/context/uat-ABC-094-2026-10-11/probe/
supersedes:
---

# UAT pack `ABC-094`, the opening-book probe: nine scenarios a player would recognise, run against the real book

This note is hand-authored and unsealed. `context-io.ts` is not on this install and `human_admission` is
`off` (`AGENTS.md` § Test and UAT authority), so no `finding` is admissible. It points at a throwaway
harness, not a UAT spec, so it carries no `sha`, `gate_run` or `content_hash`.

**Who wrote this pack.** QE/E2E wrote it, because the owner chose that role on 2026-10-11. The UAT Planner
and BA/PM hops of Workflow 06 were not run, by the owner's word. Only the owner's own word signs this UAT.
This pack does not sign it, and neither does a green run.

## UAT goal

Decide whether the book probe does what a player of this game needs from an opening book. It should answer
known openings with real book moves and pick among them in proportion to the book. It should repeat itself
under a fixed seed, vary across seeds, and stay quiet out of book. A missing or broken book file should never
crash the game.

## What this ticket can and cannot show

`ABC-094` delivers a module only. **Nothing calls it yet.** `src/cli.ts` does not import `src/book.ts`, so
`npm run chess` cannot show the book today. `ABC-095` wires it in. Each scenario therefore exercises the
module's public API (`createBookProbe` → `inBook` / `bookMove`). It runs on the real compiled book,
`data/opening-book/book.json` (sha256 `3802f52f…4bb41d`, 356,526 B), and reaches positions through the game's
own record (`newGame` + `playMove`), which is the path a real game uses. The parts that only a running game
can show are listed in `…09cc0bac` and are not graded here.

## Entry criteria

| criterion | state |
|---|---|
| Built and QE'd | Code `8cf395fc`; QE `PASS_WITH_GAPS` at `7362f1f9` (`.grugops/context/qe-ABC-094/notes/…a9a9fe1b`) |
| Waiver tested | `git diff --name-only 8cf395fc~1 8cf395fc \| grep -v '\.test\.ts$' \| grep '^src/'` → `src/book.ts`. Production lines are present, so the UAT is conducted |
| Tree under test | `grugops/ABC-094-book-probe` @ `7362f1f9`; `src/book.ts` byte-identical to `8cf395fc` |
| Gate at that tip | `npm test` 1,715 passed, 0 skipped; `npm run lint` clean (104 files); `npm run typecheck` exit 0 |
| Security/NFR | No hop fires here on QE's reading (`ADR-0036` (b) 0 / 0 / 0); it fires on `ABC-095` |

## Who and what

- **Signer:** the owner, Olger Oeselg, by his own word in session (`AGENTS.md`, 2026-08-16 ruling).
- **Conductor:** QE/E2E (agent). It runs the harness and reports the result. It never signs.
- **Test data:** the real book, unchanged (its hash is checked before and after every run). Damaged books
  are **copies** of the real book, written to a scratch directory outside the repository and deleted
  afterwards. Fixed seeds come from `seededRandom` (`src/levels.ts`). **The seeds were chosen before the
  first run and were not changed afterwards:** seed 1 for S1, S2, S5 and S9; seed 5 for the transposition;
  seeds 1–10 for S3 and S4 (the ticket names 1–10 for `A3`); seed 7 for S3's 100 picks.

## Scenarios, expected results and pass/fail

| # | in the player's words | how it is exercised | passes when |
|---|---|---|---|
| S1 | **A known opening gets a real book move.** | 11 named positions: the start, 1.e4, 1.d4, 1.c4, Sicilian, French, Caro-Kann, Ruy Lopez, Italian, Queen's Gambit, King's Indian. Also one transposition: 1.d4 Nf6 2.c4 e6 against 1.c4 e6 2.d4 Nf6 | Every answer agrees with the book file. In book: a move from that entry, legal on the board. Out of book: nothing. The start and 1.e4 answer with a move. Both move orders get the same answer. 0 warnings |
| S2 | **Out of book, the book stays quiet.** | A middlegame (Kiwipete), an odd line (1.a4 a5 2.h4 h5 3.Ra3 Ra6), and 5 positions the book names but holds no move for (found by walking the book). Also the position where a real book walk runs out | Nothing, and `inBook` false, every time. 0 throws, 0 warnings |
| S3 | **The same seed plays the same opening.** | 2 separate processes. Each lets the book play both sides from the start on seeds 1–10 until it runs out, and takes 100 picks at the start on seed 7 | All 10 walks and the 100 picks are identical across the two processes |
| S4 | **Different seeds give different openings.** | One reply to 1.e4 on each of seeds 1–10 (`A3`) | At least 3 distinct replies |
| S5 | **Popular moves come up more often, as the book weights them.** | 1,000 picks on one seed-1 probe, after 1.e4 and at the start | Every move's share is within ±5 pp of its weight share in the file (`A4`'s tolerance). No move from outside the entry |
| S6 | **A missing book does not crash the game, and says so once.** | A fresh process with no file at the path, 50 questions. The harness binds the warning to stderr | 0 throws, nothing 50 times, exactly 1 warning line, 0 B on stdout |
| S7 | **A damaged book does not crash the game, never plays an illegal move, and says so once.** | 11 cases, each in its own process with 50 questions. C0 is a control (the real book). C2 empty, C3 cut in half, C4 bad key, C4b wrong format, C5 illegal move at the start, C5b illegal move three plies in, C6 padded past 1 MiB, C7 a byte that is not UTF-8, C8 a key carrying a terminal escape, C9 a directory at the path | C0 answers 50 of 50 and prints nothing. C2–C9: 0 throws, nothing or only legal moves, the illegal move never returned, exactly 1 warning line, 0 B on stdout, no byte of the file (no ESC) in the warning |
| S8 | **The book never goes online and never runs what it reads.** | Network globals are stubbed to counters in every process. The module's imports and source are read | 0 network calls, 0 Node built-in or package imports, 0 `eval` / `new Function` / `import()` / `require()` |
| S9 | **Setting the book up costs the game's start nothing.** | Count reads at construction, after the first question, and after 100 more | 0, then 1, then still 1 |

## Known limitations (said before signing, not after)

1. **No in-game evidence.** Nothing here plays `npm run chess`. A book move in a real game, the instant reply,
   falling back to search and the frame staying unchanged are all `ABC-095`'s (`…09cc0bac`).
2. **The stderr in S6 and S7 is the harness's binding.** The delivered module writes to no stream. Which stream
   the warning goes to is decided where `ABC-095` binds it, and `ABC-095`'s page does not yet ask for stderr
   (`QE-094-a`, MEDIUM, still open on the wave branch at `1b6685b6`).
3. **"Once per process" is shown per probe.** Two probes warn twice (`QE-094-e`). The whole-process count is
   `ABC-095` `A5`'s.
4. **No committed `uat/*.uat.spec.ts`.** This is a local CLI with no browser e2e lane. The harness is kept under
   `ref:` as an authoring aid. The suite's own `A1`–`A7` rows in `src/book.test.ts` are the re-runnable
   evidence, and they were green at the tip.
5. **The weights may change.** The owner's `WEIGHT_POLICY` veto is open. S5 reads the weights from the file at
   run time, so it holds under either policy. The walk lines in the run note are a record, not a pin.
6. **Not graded:** cost and timing (QE's and Security/NFR's), mutants (QE's), and the opening name (`ABC-096`;
   the accessor was not built, which the ticket allows).

## Rollback

Nothing ships. The ticket is unmerged on `grugops/ABC-094-book-probe`, and no caller exists. To roll back,
do not merge the branch, or revert one new file (`src/book.ts`) and its test file. No other module changes.

## Signoff checklist (the owner answers each with one word)

| # | question | the owner's word |
|---|---|---|
| 1 | Do S1–S9, as written above, describe what you want from the book probe on its own? | |
| 2 | Do you accept that the in-game half (book in `npm run chess`, warning on stderr, once per process) is proven on `ABC-095` and not here? | |
| 3 | Do you accept the run's result (`…c47971a0`): 9 of 9 PASS on the observable half? | |
| 4 | **Overall: do you accept `ABC-094`?** | |

## Exit criteria

- **Accepted** when the owner gives his word in session to question 4 (or to the one-line question in
  `…138c5fd7`). The agent then transcribes that word; it is never a `human:<name>` stamp.
- **Not accepted** on a "no" to any row. The reason goes back to the Orchestrator, who routes it.
- The board move out of `In UAT` is the Orchestrator's. This pack moves nothing.

## Where things are

| path | what |
|---|---|
| `probe/uat-harness.ts` | The harness. `node uat-harness.ts <tree root> <scratch dir>` runs S1–S9; `walk` and `fail` are its child modes. It writes only to the scratch directory, which it deletes |
| `probe/harness-RUN-1.txt` | The recorded run at `7362f1f9`. A second run was byte-identical (`…c47971a0`) |
