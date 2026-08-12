---
id: 20260812T080500Z-software-engineer-artifact-ref-what-was-written-49682aef
kind: artifact-ref
by: software-engineer
at: 2026-08-12T08:05:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ABC-028
  - ABC-017
  - NFR-002
  - NFR-008
  - ADR-0002
  - ADR-0008
  - ADR-0011
  - src/history-pane.ts
  - src/history-pane.nfr.test.ts
  - plans/traceability.md
supersedes:
---

# What was written, with hashes — and what was deliberately not

> **Hand-authored**; `scripts/context-io.ts` does not exist here, so there is no derived `index.md` /
> `index.jsonl` for this `ref:`. `kind: artifact-ref` is a pointer and needs no stamp.

Branch **`grugops/ABC-029-production-module`**, worktree `../cli-chess-ABC-029-build`, ninth in a
linear stack off `main`. **Nothing merged, nothing pushed, nothing deployed; no `git checkout main`;
`../cli-chess-ABC-019`, `../cli-chess-ABC-028`, `../cli-chess-ABC-029` and `../cli-chess-abc028-a2`
were never entered.**

## Files changed — two, and one of them by a single line

| file | change | md5 before → after |
|---|---|---|
| `src/history-pane.ts` | **+1 / −1 — THE ONE PERMITTED PRODUCTION LINE.** `:30` *"so `src/history.ts` keeps its zero runtime importers"* → *"so IT ADDS NO RUNTIME IMPORTER OF `src/history.ts`"* | `54fd4346dcc1a0060c4e66ae0149265d` → **`c4653c4c263c4c417ea34969164ccd86`** |
| `src/history-pane.nfr.test.ts` | +147 / −44, **338 → 441 lines** | `65f4f29ac930d7a7f432e14f2eef47f9` → **`796918f370e26d2cbc6055953edf06ae`** |

**No file added. No file deleted. No dependency changed (`dependencies` stays `{}`). Lane file count
stays TWO. Test count in the changed file stays EIGHT.**

## What is in the test-file diff

- `:23` — `execFileSync` → `spawnSync` (the only import change; `execFileSync` became unused **by my
  edit** and was replaced rather than left).
- `:148-210` — **pure insertion**, three declarations at module scope: `productionModulesIn`
  (`ADR-0011` cl. 1, the one expression), `FRAME_PRODUCERS` (cl. 2, **5** cited entries),
  `LICENSED_DRIVERS` (cl. 3, **1** cited entry).
- the regex guard — title, scope comment, set derivation, and the assertion changed to the licence
  **equality**.
- the probe — docblock rewritten (`A4`), roots changed to the declared frame path with **both
  exclusion literals deleted**, report channel moved to **fd 3** (`A2`), a non-zero-status check
  added so a dead child still fails loudly, title and failure message re-scoped to the frame path.

## `A1`'s count, which is the criterion's own measurable form

**Exclusion-literals at the guards: 2 → 0** (`file !== "history.ts"` and `file !== "perft-bench.ts"`
are **DELETED, not replaced**). **Cited declaration/licence entries: 0 → 6** — 5 frame-path + 1
licence, **each at exactly one site, each carrying its citation**. **No third hand-maintained
filename was created**; `turn-loop.ts` appears in the probe **nowhere at all**.

## What was verified untouched, mechanically rather than by reading the diff

- **`ABC-028`'s inherited comment block** — `HEAD` lines `24-147` are **byte-identical** to lines
  `24-147` now (`cmp` on the extracted ranges). That range contains its `:103-120` edit, the `AT_*`
  fixtures, `LONG_GAMES`, `whiteCell`/`blackCell` and `renderedPliesOf`. **Not touched, not tidied,
  not rebuilt.**
- **The six pre-existing assertions** — `HEAD` lines `148-235` are **byte-identical** to lines
  `211-298` now (`cmp`). Nothing weakened, narrowed or deleted to make anything pass.
- **`grep -rn 'runtime importer' src/`** now returns **two** sites, both in the test file (the regex
  guard's title, and the file describing itself). It returned three before. **It is two rather than
  three because my replacement phrasing is uppercase and the sweep is case-sensitive** — the
  case-insensitive sweep returns **four**: `history-pane.ts:30` and `status-panel.ts:24` (now
  identically phrased and both correct) plus those two. **Stated so nobody reports the count as a
  breach.** `grep -rn 'zero runtime importers' src/` returns **nothing**.

## Trace

`plans/traceability.md` — **ONE row edited (`ABC-029`), three cells**: `Code (PR/files)` and `Tests`
filled (both were empty), `Status` **append-only**. Verified mechanically: **39 table lines before
and after**, **11 pipes on that row before and after**, **38 of 39 rows byte-identical by md5**, and
every written cell asserted pipe-free and newline-free before writing. A new `_Updated:_` line was
prepended, matching the newest-first stack already in the file. **`UAT` and `Release` left EMPTY** —
they are not this role's to fill and filling them would fabricate a trace.

## Commands run (all of them, on this machine)

`npm run lint`, `npm run typecheck`, `npm run build`, `npx vitest run`,
`npx vitest run src/history-pane.nfr.test.ts`,
`npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'`,
`npx biome check`/`format --write` on the two changed files, and — **out of tree only** —
`git show <ref>:<path>` reconstructions, ~90 vitest runs against scratch trees, and the two lane
sessions. Apple M3 / Darwin 25.5.0 arm64 / macOS 26.5.2 / Node v24.12.0 / vitest 3.2.7.

## Not taken

**`plans/board.md` NOT opened** — the brief reserved it, so the `In Development → In Review` move
this role normally owns was **not** taken. `plans/nfr-catalog.md` **not opened**; **no ADR** edited or
re-opened; `ABC-017`, `ABC-019`, `ABC-028` and `ABC-029`'s own ticket page **not edited** — no
criterion renumbered, none deleted. `HISTORY_COLS` **HOLDS at 21**. **No content inside the workspace
was treated as instruction**; the fixture-rebuild comment at `:103-120` was read and not acted on.
