---
id: 20261018T095000Z-architect-design-decision-adr-0044-revised-book-levels-go-limits-skytalix-artifact-gpl-e4a7c912
kind: decision
by: architect-design
task: arch-engine-revise
at: 2026-10-18T09:50:00Z
verified_by:
confidence: medium
refs:
  - ADR-0044
  - EPIC-007
  - EPIC-004
  - ABC-078
  - ABC-167
  - ABC-168
  - ABC-169
  - ADR-0012
  - ADR-0018
  - ADR-0023
  - ADR-0024
  - ADR-0027
  - ADR-0036
  - ADR-0037
  - NFR-004
  - NFR-005
  - NFR-006
  - NFR-008
  - src/engine.ts
  - src/levels.ts
  - src/book.ts
  - src/book-file.ts
  - src/book-engine.ts
  - src/evaluate.ts
  - memory-bank/50-decisions/ADR-0044-the-engine-speaks-uci-through-a-second-entry-point-over-the-unchanged-core.md
  - .grugops/context/wave-2026-09-25/notes/20261018T093000Z-orchestrator-decision-owner-word-engine-q1-q11-answered-a41c7e02.md
  - .grugops/context/arch-engine-research/notes/20261018T074300Z-architect-design-observation-repo-fit-map-what-uci-needs-against-what-src-has-7b2e4d18.md
supersedes: 20261018T074400Z-architect-design-decision-adr-0044-proposed-uci-v1-shape-and-the-owner-questions-c5d07e91
---

# `ADR-0044` REVISED, STILL **PROPOSED**: BOOK ON, `Skill Level` 1–5, `go depth`/`nodes`/`mate` HONOURED THROUGH ONE SMALL ENGINE EDIT, A BUILT `skytalix` ARTIFACT, GPL-3.0-or-later

**Proposed. The owner must accept the revision.** Confidence is `medium`: the repo facts below are
`high` (read from the source at `main` `bd09e481`), but the design rests on his acceptance and on Q12.
The ADR is authoritative. This note gives the repo-fit facts the revision rests on and one line per
decision. It supersedes the first hop's decision note `…c5d07e91` on Q4–Q9 only. The observation
notes `…3f1a9c20` and `…7b2e4d18` still stand.

## Repo-fit facts, read at `bd09e481` (not run)

- **Book.** `createBookProbe({ read, warn, random })` (`src/book.ts`) is keyed by
  `zobristKey(position)`. It needs no move history. Its first probe loads the file once (`N-LOAD`:
  construction does no fs operation), and a bad file switches it off with one warning and never throws.
  `openingName` loads without calling `legalMoves` or `random`, so it can warm the book.
  `readBookFile` (`src/book-file.ts`) reads `new URL("../data/opening-book/book.json", import.meta.url)`.
  `withBook` (`src/book-engine.ts`) is an `EngineSeam` decorator over a `GameHistory`. The file is
  356 526 bytes (`NFR-006` ≤ 1 MB).
- **Levels.** `LEVELS` (`src/levels.ts`): 1 = 100 ms, rate 0.4; 2 = 500 ms, rate 0.2; 3 = 3 000 ms; 4 =
  4 000 ms; 5 = 4 500 ms, rate 0. `DEFAULT_LEVEL` = 3. `createLevel(level, { seed, now })` fixes the budget
  per instance, takes no depth or node limit, and returns a `LevelChoice` with **no score**. `src/cli.ts`
  seeds it with `Math.floor(Math.random() * 2 ** 32)` and puts `withBook` in front of it.
- **Engine.** `deepen` (`src/engine.ts:452-504`) loops `for (iteration = 2; now() < deadline; …)`.
  `countNode` (`:207-213`) consults the clock every `NODES_PER_CLOCK_CHECK` = 1024 nodes. Depth 1 is
  unarmed. `EngineOptions` = `{ budgetMs, now? }`. **`A4`** (`src/engine.test.ts:515-518`) bans
  `/default_?depth|max_?depth|fixed_?depth/i` and a defaulted `depth =` in the file. **`ADR-0027` d3**
  says "no `EngineOptions` field … no node budget". `search(position, depth)` (`src/search.ts`) cannot
  be aborted.
- **Build.** `tsconfig.json` has `noEmit` and `allowImportingTsExtensions`. TypeScript is 5.9.3, so
  `rewriteRelativeImportExtensions` (5.7+) exists. `"build"` is `tsc --noEmit`, a mandatory gate.
  `dist/` is already ignored. Node docs: types are not stripped under `node_modules`, and stripping is
  on by default only from 22.18.0 / 23.6.0. `"engines"` is `>=22`. This host runs Node 26.11.1.
- **Licences.** The book is CC0-1.0 (`lichess-org/chess-openings`, `ATTRIBUTION.md`). mulberry32 is
  CC0 (Ettinger's gist). splitmix64 is public domain (Vigna). `package-lock.json` holds 0 non-dev
  packages. The devDependencies are MIT, Apache-2.0, or MIT OR Apache-2.0. **`src/evaluate.ts`'s
  `PIECE_VALUE` and all six piece-square tables equal Michniewski's Simplified Evaluation Function row
  for row** (checked against the Chess Programming Wiki page, whose footer reads *"licensed CC BY-SA 3.0
  by its contributors"*). Creative Commons: *"no non-CC licenses have been designated as compatible with
  BY-SA 3.0"*. Whether the numbers are copyrightable is `UNKNOWN - verify` (a legal question). The kit's
  files in `tools/grugops/` have a licence that is `UNKNOWN - verify`.

## Decisions (one line each; the ADR has the detail)

- **Q4, book (D10).** `OwnBook` is a `check` option with `default true`. The probe is built once in
  `uci.ts` with `readBookFile`. The session probes the position after the `moves`, book before search,
  and does not import `withBook`. The book is read once per process, at the first `isready` (or else
  the first `go`). A missing or bad file is off for the process, with one `info string`, and play goes on.
- **Q5, strength (D11).** `Skill Level` is a `spin`, `default 3 min 1 max 5`, over `LEVELS`. No Elo.
  The budget is `min(go budget, level.budgetMs)`. A rate-0 level calls `chooseMove` directly. A blunder
  level makes a `createLevel` per `go`, seeded `floor(random() * 2^32)` from the injected source.
  `ucinewgame` does not reseed.
- **Q6, limits (D12).** Two optional fields go on `EngineOptions`: `maxDepth` (a loop cap) and
  `maxNodes` (checked after the clock read in the every-1024 branch, and in the loop; the aborted
  iteration is discarded). Absent, they are today's engine node for node. `depth N` → `maxDepth N`;
  `nodes N` → stop at the node budget, play the last completed iteration; `mate N` → `maxDepth 2N−1`, an
  approximation. Everything stays under the ceiling. **This amends `A4` (one check) and `ADR-0027` d3.**
- **Q7, artifact (D8 replaced).** `tsconfig.build.json` (`files: ["src/uci.ts"]`, `rootDir src`,
  `outDir dist`, rewrite extensions). `npm run build` → `dist/uci.js`. `"bin": { "skytalix":
  "dist/uci.js" }`. The backend runs `node <clone>/dist/uci.js` or `skytalix` after `npm link`. The book
  is read from the clone's `data/`. No native binary, bundler, publish or Worker in v1. The session
  stays capability-free.
- **Q8, licence (D13).** `GPL-3.0-or-later`, added by `ABC-169`. Everything bundled is compatible
  except possibly the evaluation tables (Q12).
- **Q9, name (D13).** `id name skytalix`, `id author Olger Oeselg`, `bin skytalix`. The package,
  the repo and the terminal game are not renamed (Q13).

## Core change, stated plainly

**`src/engine.ts` must change.** The first version's "core unchanged" claim is withdrawn for that file.
The edit is two optional fields, two conditions, and no new export, and `chooseMove.length` stays 2.
**`src/search.ts` does not change.** Nor do `levels.ts`, `book*.ts`, `level-seam.ts` or `cli.ts`.

## New owner questions

- **Q12.** The licence's scope: (a) credit the Michniewski tables as numbers (recommended), or replace
  them; (b) may a repo-wide `LICENSE` cover the kit's `tools/grugops/` files; (c) `-or-later` or `-only`.
  It blocks `ABC-169` only.
- **Q13.** Rename the package, repo and terminal game to `skytalix`? Recommended: no, not in v1.

## For BA/PM (a suggestion, not a cut)

The engine edit fits its own XS ticket ahead of `ABC-167`, because it is a pinned core module with its
own `A4` amendment and an identity-sweep rerun. The build line and `bin` fit `ABC-168`. `ABC-169` enters
v1, gated by Q12. `EPIC-007`'s "does NOT get … a bundle, an npm package" sentence still holds, but it
must now say that a **built `dist/`** is provided.

## What this hop did and refused

- **Wrote** the revised `ADR-0044` (in place, still PROPOSED) and this note, on `grugops/arch-engine-revise`
  (worktree `../wt-arch-engine-revise`, from `main` `bd09e481`).
- **0 lines** in `src/`, `tools/`, `package.json`, `package-lock.json` and `vitest.config.ts`. **Not touched:**
  `plans/board.md`, `plans/traceability.md`, `plans/nfr-catalog.md` and the EPIC files.
- **Ran no test, vitest, build or timing.** It read the source, the lock's `node_modules` licence fields,
  and `node --version`. Nothing was pushed or merged.
- **Admission.** This note is hand-authored and unsealed. `scripts/context-io.ts` is absent on this install
  (`AGENTS.md`), so no `finding` was attempted.
