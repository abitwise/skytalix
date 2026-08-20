---
id: 20260820T204000Z-qe-e2e-observation-nine-wrong-builds-run-against-abc044-a1-a7-eight-caught-and-two-instruments-softer-than-they-read-9e1d40b6
kind: observation
by: qe-e2e
role: qe-e2e
task: qe-ABC-044-2026-08-20
at: 2026-08-20T20:40:00Z
verified_by:
confidence: high
refs:
  - ABC-044
  - ABC-044/A1
  - ABC-044/A2
  - ABC-044/A3
  - ABC-044/A4
  - ABC-044/A5
  - ABC-044/A6
  - ABC-044/A7
  - ABC-043/A1
  - NFR-008
  - N8-LANE
supersedes:
---

# `ABC-044` `A1`–`A7`, broken at rather than confirmed: nine wrong builds constructed, eight caught, and two instruments that are softer than their criteria read

**Method.** Every criterion was attacked by MUTATING the delivered module or the delivered entry
point, running the suite, and recording which rows went red — never by reading the test file and
agreeing with it. Every mutant was reverted; `git status` is clean and `git diff` against the branch
tip is empty apart from `plans/traceability.md` and these notes.

## The wrong builds, and exactly which rows saw them

| # | constructed build | rows that went RED |
|---|---|---|
| `M1` | the ticket's own `## Test notes` 2 build: `fivefold → "by repetition"`, `threefold → "by repetition (claimed)"` | `A1` naming; `A2` claimed/automatic **— NOT the non-substring rows** |
| `M4` | `resignation` given `checkmate`'s phrase | `A1` naming only **— NOT the set row** |
| `M6` | `stalemate` and `insufficient-material` given ONE shared phrase that still contains both `named` tokens | **`A1` set row ALONE** |
| `M2` | move number from `pairs.length + 1` instead of `position.fullmoveNumber` | **`A5` black-to-move anchor ALONE** |
| `M3` | `pairs.slice(-8)` — the pane's window applied to the full list | all four `A5` rows |
| `M5` | the pane's fixed-column padding copied onto the empty white cell | **`A5` black-to-move anchor ALONE** |
| `M7` | the `sink.write` guard removed — a stray `\n` on end of input | `A4` entry-point half **and** `ABC-042` `A1` |
| `M8` | `process.exitCode` derived from `reason` (a mate as a failure) | `A6`, `ABC-043` `A2`, `ABC-066` `A1` |
| `M9` | the `history` option carries `{ ...history }` | **NOTHING — 1207/1207 green.** See the `decision` note |

**Eight of nine caught. The ninth is `ABC-043` `A1` and it is adjudicated separately.**

## `A1` — it IS a set of size 8, and the set row IS load-bearing, but not alone

`M6` is the answer to *"would it catch two reasons sharing a phrase?"*: **the set row alone catches
it**, red by itself, on a build every naming row is green on. That is the row doing real work and it
is not decorative.

**Where the set row alone does NOT catch it, measured:** two reasons sharing a phrase whose
`result` DIFFERS. `M4` gives `resignation` `checkmate`'s phrase; the screens still differ by
`White wins` versus `Black wins`, so the set stays size 8 and only the naming row fires. **Six of the
eight carry `draw`, so the set row covers all 15 draw-pairs and the naming row covers the rest —
combined, the criterion is fully instrumented.** Recorded because the ticket's stop condition says
"a SET of size 8, not eight contains-checks" and the honest reading is **both, together**.

## `A2` — asserted in BOTH directions, and softer than it reads

**Both directions are there** (`one not.toContain(other)` and `other not.toContain(one)`) — the
question as asked is answered YES.

**But the strings compared are the WHOLE SCREENS, headline plus the identical move list**, not the
headlines. Two screens over the same game share a common suffix, so one can be a substring of the
other only if it is a suffix of it, and with a single leading `\n` that reduces to **equality** —
which the `A1` set row already buys. **The non-substring rows are dominated.**

**Witnessed, not argued:** `M1` is the ticket's own named wrong build for exactly this row, and it
turned the naming and claimed/automatic rows red **while the non-substring rows stayed green**. The
engineer's own red-build table shows the same two rows and not these; that agreement is a
corroboration, not a source.

**`A2`'s SUBSTANCE is delivered** — by the four word rows (`\bclaimed\b` / `\bautomatic\b` present,
and each pair's other word absent), which are strictly stronger than the criterion asked for and
which make a substring relation between a pair's two headlines unconstructible. **The criterion
passes. Its named instrument is not the row that earns it.** Cheap repair if anyone wants the
criterion's own words instrumented: compare `screen.split("\n")[1]` — the headline — instead of the
joined screen.

## `A3` — all three clauses, plus the non-vacuity guard, all present and all biting

- **(i)** the loop over `THE_EIGHT`'s `named` vocabulary excludes all eight reason strings on both
  fault screens;
- **(ii)** `/\bwin\b|\bwins\b|\bdraw\b|\bcheckmate\b|\bstalemate\b/i` — all five words, case-insensitive.
  **Word-bounded**, so `drawn`/`winner` would slip; no build in this diff can produce them and the
  criterion says "words", so this is reported as a reading rather than as a gap;
- **(iii)** `/did not finish/` — the PRESENCE half, which absence rows structurally cannot give.
- **The non-vacuity guard EXISTS and is first** (`expect(screen).not.toBe("")`, `:191`). A renderer
  returning nothing would satisfy every absence clause and this row refuses it. Verified by reading
  and by the fact that the fault screens do render (below).

**Measured output of a fault screen** (zero-ply game, the shape both fault children actually hit):

```
["", "The game did not finish: the engine threw an error.",
     "That is a bug in this program, not a chess outcome.", ""]
```

**No rule from the eight, none of the five words, and it says the game did not finish.** The
entry-point half is driven through the real `src/cli.ts` with a substituted `engine.ts`
(`CHILDREN.engineThrows` / `CHILDREN.engineForeign`) — a real spawn of the delivered product with a
doctored engine, not a hand-built value.

## `A5` — the ≥ 40-ply case and the anchor, both re-measured, and the engineer's claim CONFIRMED

- `LONG_GAME` is **41 plies** and the fixture asserts `>= 40` itself, so the number cannot rot.
- The SAN reference is a **second independent replay** in the test file, not a transcription.
- **The engineer's claim is TRUE and I checked it myself:** `M2` (index-derived move number) is
  green on every other row in the file — including the 41-ply byte-identical token comparison and the
  gapless-numbers row — and **only** the black-to-move anchor row sees it. That is the row the
  Orchestrator's stop condition 4 was protecting, and it is the row that earns it.
- **Pairing is pinned indirectly and I confirmed it:** a one-ply-per-row build repeats each move
  number and fails the gapless row; a white/black swap inside a pair fails the token-order row.
- `A5`'s "no gap" row also holds **from the anchor's number**, not only from `1.`

## `A6` — after the final frame, zero CSI, exit code verbatim

Driven live, not only through the suite:

```
$ printf 'f3\ne5\ng4\nQh4\n' | node src/cli.ts | tail -4
Black wins by checkmate.

1. f3 e5
2. g4 Qh4#
$ ... | grep -c $'\033'   →  0
```

- **Ends with the screen**, byte for byte (`stdout.slice(-written.length)`), where `written` is
  composed from the merged renderer over the game the child played — not a transcription.
- **After the final frame, from BOTH sides**: it begins past the last frame's last row, and zero
  frames follow it.
- **Zero ANSI CSI of its own**: asserted on the screen's bytes, and the whole live stream carries
  **0** escape bytes.
- **Exit code verbatim**: `M8` proves the row bites — a build deriving the code from `reason` is red
  in three places.
- **"One write"** is asserted where it is decided (exactly one `sink.write(` in `src/cli.ts`, guarded)
  rather than pretended to be observable through a pipe. That is the honest instrument for it.

## `A7` and the gate — re-measured at the branch tip, not inherited

```
$ git diff --numstat 30482cd -- src/
116  1  src/cli.test.ts     15  1  src/cli.ts
281  0  src/result-screen.test.ts   172  0  src/result-screen.ts
$ git diff --numstat 30482cd -- src/gameend.ts src/turn-loop.ts src/history-pane.ts src/frame.ts
(empty)
```

| command | exit | number |
|---|---|---|
| `npm run typecheck` | **0** | silent |
| `npm run build` | **0** | silent |
| `npx vitest run --dir src` | **0** | **40 files / 1207 tests / 0 skipped / 2.17 s** |
| pending + todo, from the JSON reporter | **0** | `0` |
| `node tools/grugops/test-skip-integrity.js … --skip-count 0` | **0** | `No findings.` |
| `npx biome check src/` | **0** | `Checked 68 files` |
| `npm run lint` (`biome check .`) | **1** | the 32 gitignored worktrees — **re-measured, not re-litigated** |

**`N8-LANE`:** the whole `src/` lane is 2.17 s wall against `NFR-008`'s 13 s clause; the new file's
own 13 rows are milliseconds. **Two orders under the ≤ 650 ms bar. No flaky risk found** — the
fixtures are a fixed LCG over the generator's own ordering, the anchor FEN is produced by `toFen`
rather than written down, and the SAN reference is recomputed; nothing here depends on wall clock,
ordering or the filesystem. Three consecutive full `src/` runs, identical results.
