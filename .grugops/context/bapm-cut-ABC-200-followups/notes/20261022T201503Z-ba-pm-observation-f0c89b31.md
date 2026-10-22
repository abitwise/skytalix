---
id: 20261022T201503Z-ba-pm-observation-f0c89b31
kind: observation
by: ba-pm
at: 2026-10-22T20:15:03Z
verified_by: 
confidence: high (git objects, sealed notes and pages; nothing executed)
refs:
  - ABC-200
  - ABC-201
  - EPIC-006
  - QE-200-a
  - QE-200-d
  - AR-200-C1ECHO
  - AR-096-C1CP
  - NFR-007
  - NFR-008
  - N8-LANE
  - ADR-0011
  - ADR-0015
  - ADR-0018
  - ADR-0036
  - ABC-178
  - 3bee4bdd
  - 0a07df04
  - 1efd2cee
  - bd745ac9
  - plans/tickets/ABC-201-on-a-fresh-git-clone-npm-install-then-npm-run-chess-starts-a-playable-game-and-the-first-board-in-under-2-s.md
  - plans/tickets/ABC-200-on-a-terminal-npm-run-chess-asks-for-colour-and-difficulty-when-the-flags-are-absent.md
  - 20261022T201000Z-orchestrator-decision-838e9652
  - 20261022T195000Z-orchestrator-decision-e459881c
  - 20261022T191000Z-orchestrator-decision-de0099fa
  - 20261022T200253Z-qe-e2e-observation-843719f4
  - 20261022T194346Z-security-nfr-decision-08e4152e
  - 20261017T131800Z-security-nfr-observation-abc096-timing-a4-nfr007-window-w1-clean-8d3f6c15
  - 20261022T185854Z-ba-pm-decision-623c0fed
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
supersedes: 
seal: sha256:4cab100ed59f6c5bb5b9dee6f351f5a5cd4d229d69db2fc8015e22d94f765b29
---

# ABC-200 follow-ups: the record reads behind the rulings (no test, probe or timing ran)

BA/PM, task `bapm-cut-ABC-200-followups`, 2026-10-22, at `main` `3bee4bdd`. Everything here is read from git objects, sealed notes and pages. Nothing was executed apart from `git show`/`git diff`/`grep`.

## QE-200-a: what holds the entry point's use of the answers today
- **The link that is not read behaviourally** is one statement group in `src/cli.ts` at tip `0a07df04`: L184 `const resolution = await askAbsentOptions(parsed, { source: stdin, output: sink });`, L185 `if (resolution === null) return;` and L186 `const { colour, orientation, flags, difficulty } = resolution.options;`.
- **Text pin:** `src/cli.test.ts:4439` `expect(entry).toMatch(/const \{[^}]*\bdifficulty\b[^}]*\} = resolution\.options;/)`. A rewrite that destructures `parsed.options`, the realistic regression, reds it. QE's Q1b plant (`Object.assign(resolution, { options: parsed.options })`) is adversarial and stays green (QE `…843719f4`).
- **Behavioural on both sides of that link:**
  - `src/startup-questions.test.ts` `A1`/`A2` read the options the questions return;
  - `ABC-042`'s colour children and `ABC-101`'s rows read that the destructured colour and difficulty reach the game through the same L186.
  - QE's pty cases 1, 3 and 4, plus an instrumented probe, show the answers played (`…97b2d4d9`, `…843719f4`).
- **Why no XS, test-only behavioural row exists inside the accepted ADRs:**
  1. A spawned child's stdin and stdout are pipes, and the questions ask only when both say `isTTY === true`.
  2. Substituting `./startup-questions.ts` in a child fails `ADR-0015` (S): it is imported by `cli.ts` but not passed in the `runTurnLoop({ … })` bag (`cli.test.ts` 597–650).
  3. A pty lane is refused by the ABC-200 page's test note 4 ("No pty library becomes a dependency"), and `script` is host-specific.
  4. A seam means `cli.ts` exports something, which is `ADR-0011` clause 4.
  5. A child `--import` hook that fakes `isTTY` is a new rig kind that no ADR licenses.
  6. Every route adds a spawn against `NFR-008`'s published 0.605 s headroom.

## AR-200-C1ECHO and QE-200-d
- **Two `printableOf` copies:** `src/cli.ts` L139–143 (usage path, argv echo to stderr) and `src/startup-questions.ts` (question echo). Both drop C0 and `U+007F` only.
- **Pin cost:** `src/cli.test.ts:1777` pins `numbersIn("cli.ts")` to `["0", "0x20", "0x7f", "1", "2", "32", "70"]`. Widening the `cli.ts` copy needs a licensed edit of that pin. `startup-questions.ts` exists only on `grugops/ABC-200`, so the fix could not build before ABC-200 merges, and that merge waits behind ABC-178, ABC-199 and `N8-LANE`.
- **Security/NFR `…08e4152e` § 5:** no L1 item fails. The tty line discipline echoed the same bytes raw before the app read them, so the app's echo adds no reach.
- **Precedent `AR-096-C1CP`** (third-party book names, a real trust boundary): accepted 2026-10-17. Its recommended XS follow-up was never cut. The owner's word `…9858e55f` covers it.
- **QE-200-d:** at a question, end of input writes nothing, and `askAbsentOptions` returns `null`. In the game, the loop writes `input ended\n` (`src/turn-loop.ts` L346–349). The ABC-200 page's scope 5 and `A5` ask for exit 0, no frame and no result screen. Nothing asks for a newline. QE rated it INFO (cosmetic, `…843719f4`).

## The (b1) line list
- **At code `1efd2cee` and tip `0a07df04`:** L150 `const parsed = resolveOptions(process.argv.slice(2));`, L167 `const stdin = process.stdin;`, L200 `warn: (line) => process.stderr.write(…)`.
- **`const sink = process.stdout;`** is L154 at base `bd745ac9` and L164 at the tip, byte-identical. `git diff bd745ac9 1efd2cee -- src/cli.ts` shows no `-`/`+` line for it.
- This matches Security/NFR `…08e4152e` § 1. The page's "Corrected 2026-10-22 (Architect/Design)" bullet and `…f612277c` name the sink line as moved.

## EPIC-006 AC1 and NFR-007: what is on record (search-bounded: `plans/`, `.grugops/context/`)
- **`NFR-007`:** Security/NFR `…8d3f6c15` (`secnfr-ABC-096`, 2026-10-17, Apple M3) series (b): spawn to frame 0 whole on stdout (23 newlines), `npm run --silent chess -- --colour white --ascii`, n = 10, 201.8 / 210.8 / 222.1 ms, MET.
  - It ran on a `git archive` copy with no `node_modules`, not on a clone after `npm install`.
  - Its own text says the catalog row's next edit should cite it. The row still reads `UNKNOWN - verify`, so that edit never happened.
  - `…623c0fed`'s "no reading found" holds only for a fresh clone.
- **AC1:** no reading. QE at ABC-042 (`…8b41d5e6`): "cold `git clone && npm install && npm run chess` was not performed by me". The fresh clones on record (ABC-168 `A7` `…c6c1358b`, `security-nfr-AR-1-premise` `…a8796ea3`) ran other commands.
- **Tree facts for the reading:**
  - The book is tracked (`data/opening-book/book.json`).
  - `chess` is `node src/cli.ts`.
  - `engines.node` is `>=22`.
  - The lock carries 2 install scripts: `esbuild` 0.28.1 and `fsevents` 2.3.3 (optional).
  - No git remote exists (`ADR-0018` `D3`).
  - `ADR-0018` Decision 3 makes a failed AC1/`NFR-007` reading a revisit trigger, and Decision 4 fixes the denominator.
