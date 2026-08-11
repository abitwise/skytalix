---
id: 20260812T100500Z-qe-e2e-observation-mutants-9f2b41c7
kind: observation
by: qe-e2e
at: 2026-08-12T10:05:00Z
verified_by:
confidence: high
refs:
  - quality-gate-ABC-017-qe
  - ABC-017
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - 20260812T010300Z-software-engineer-observation-e2d54b09
  - 20260812T041500Z-ba-pm-observation-a1-a12-sweep-8d3e07f5
supersedes:
---

# 22 wrong builds run, 13 killed, NINE SURVIVORS in five classes — and one of them renders NINE ROWS

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`.**
> Every verdict is `vitest --reporter=json`'s, per test, from a patch-run-revert harness out of
> tree with a uniqueness check on every anchor. The brief said *"assume the obvious mutants are
> dead, go looking for the ones nobody has thought of"* — the seventeen from the build hop and the
> two from the D23 hop were **not** re-run except where noted, and none of the nine survivors below
> is a member of any previously-run family.

**24 builds constructed; 2 are EQUIVALENT MUTANTS and are excluded from the score rather than
counted as survivors** — `WSANTRUNC` (`padEnd(7).slice(0,7)` cannot truncate a grammar whose longest
string is 7) and `WSLICE8` (`slice(0, HISTORY_ROWS)` on an array already of that length). Saying so
because scoring an equivalent mutant as a survivor is how a mutation score becomes a lie.

## Score: 22 real mutants, 13 killed, **9 survived**

### Class 1 — a black-to-move anchor whose window has SLID. **3 survivors. This is the serious one.**

| build | what it does | verdict |
|---|---|---|
| `WLEAD-A` | `rowsInGame` drops the leading half-row: `Math.ceil(plies / 2)` | **SURVIVED 734/734** |
| `WLEAD-B` | `firstVisiblePly` drops it: `Math.max(0, hiddenRows * 2)` | **SURVIVED 734/734** |
| `WLEAD-C` | both terms drop it | **SURVIVED 734/734** |

**`WLEAD-A` RETURNS NINE ROWS.** Measured on a black-to-move anchor at fullmove 27, knight shuffle:

| plies | delivered | `WLEAD-A` |
|---|---|---|
| 16 | 8 rows | **9 rows** |
| 30 | 8 rows | **9 rows** |
| 40 | 8 rows | **9 rows** |
| 100 | 8 rows | **9 rows** |

Nine rows at **every even ply count ≥ 16** from a black-to-move anchor. `A1` — the criterion whose
entire job is *"exactly `HISTORY_ROWS` rows in every case"* — **passes it**, because all ten of its
length cases are anchored at the white-to-move start FEN. `A13` passes it too, because `A13`
composes the **constant** `HISTORY_ROWS`, never the pane's actual output. The frame would be 24 rows
where `frameHeight` was told 23, and `ABC-019`'s clause-9 session-height assertion would fire at
runtime on the first black-anchored game.

**`WLEAD-B` puts a phantom LEADING HALF-ROW at the top of every slid black-anchored window** — an
empty white cell where a white ply belongs — and drops one ply off screen:

```
delivered, 40 plies:   [  40. Nf3     Ng8    ]
WLEAD-B,   40 plies:   [  40.         Ng8    ]
```

That is `D5`'s defect class inverted, and **`A6` — the criterion added FOR `D5`** — passes it.

Root cause of the blind spot: `A6`'s three anchors are **5 plies each**, so the window never slides;
`A1`'s ten lengths are all white-anchored. **No criterion in the ticket combines a black-to-move
anchor with a game longer than `HISTORY_ROWS` move numbers.** The delivered pane is CORRECT here —
verified by direct probe at 15/16/17/30/31/40/41/100/101 plies. This is a criteria gap, not a code
defect.

### Class 2 — the caller AFTER the render. **2 survivors, and a third that dies only by accident.**

| build | what it does | verdict |
|---|---|---|
| `WFREEZE` | `Object.freeze(history.moves)` on every render | **SURVIVED 734/734** |
| `WSPLICE` | splices the caller's `moves` array to the window and `unshift`s it back | **SURVIVED 734/734** |
| `WCACHE` | memoises rows per `GameHistory` in a `WeakMap` | KILLED — **but see below** |

`WFREEZE` leaves the caller **unable to play another move**: ESM is strict, so the next
`playMove`'s `moves.push` throws `TypeError`. `A9` snapshots `toFen(history.position)` and
`history.moves.length` before and after and both are unchanged, so the criterion that owns
non-mutation passes a build that bricks the caller.

`WSPLICE` is the array-level twin of `W10` (the `takeBack`-and-restore build the ticket says `A11`
is the only catcher for). It reaches into the caller's authoritative array mid-render and restores
it — and unlike `W10` it uses **raw array ops**, so `A11`'s `takeBack` / `playMove` spies never see
it. **The ticket's claim that `A11` catches "mutates the caller's state mid-render" is true only for
the `takeBack` route.**

**`WCACHE`'s kill is INCIDENTAL, and I measured that rather than asserting it.**

| suite | `WCACHE` |
|---|---|
| delivered (`A11`'s fixtures are module-scope singletons already rendered by earlier tests in the file) | **KILLED** — `toSan at 40: expected 16 calls, got 0` |
| `A11`'s fixtures built PER TEST — **the same D23 treatment `A9` just received** | **SURVIVED 734/734** |
| control: delivered pane, `A11`'s fixtures built per test | 734/734 (green, so the variant is sound) |

**The only thing killing a caching pane is the very fixture-sharing that D23 was raised to
eliminate.** Generalise the D23 remedy to `A11` — which is the obvious next tidy-up and which a
later reader will read `## Test notes` as endorsing — and `WCACHE` becomes a survivor. The two
properties are in direct tension and nothing on the ticket records it. A cache satisfies `A9`
perfectly (same input, same output) and satisfies `A11` *better* than the correct build.

The consumer impact is real: `playMove` mutates the `GameHistory` **in place**
(`src/history.ts:85-88` — `moveListOf(history).push(move)`), so `ABC-019`'s turn loop hands the
**same object** to `renderHistory` every frame. A cached pane freezes the move list at frame 1 and
the game becomes unreadable from move 2.

### Class 3 — `GameHistory`'s THIRD field. **1 survivor.**

| build | what it does | verdict |
|---|---|---|
| `WFENSET` | rewrites the caller's `history.initialFen` on every render | **SURVIVED 734/734** |

`A9` names `history.position` and `history.moves.length`. `GameHistory` is
`{ initialFen, moves, position }`. **The anchor is unguarded** — and the anchor is the one field
this pane's whole correctness story rests on (`A6`, `D4`, `D5`).

### Class 4 — the pane-width self-comparison. **1 survivor, and it CORRECTS the record.**

| build | what it does | verdict |
|---|---|---|
| `WCOLS24R` | self-consistent 24 columns, padded on the **RIGHT**: `HISTORY_COLS = 24`, `rowFor(...).padEnd(HISTORY_COLS)` | **SURVIVED 734/734** |
| `WCOLS24M` | self-consistent 24 columns, widened in the **MIDDLE**: `MOVE_NUMBER_DIGITS = 7` | KILLED ×7 |

Detail in the separate record-corrections note. Nothing here proposes widening `HISTORY_COLS` and no
criterion is proposed for it.

### Class 5 — the structural importer guard's reach. **2 survivors.**

| build | what it does | verdict |
|---|---|---|
| `WDYNIMP` | production pane carries `void import("./history.ts")` | **SURVIVED 734/734** |
| `WBAREIMP` | production pane carries a bare `import "./history.ts";` | **SURVIVED 734/734** |

`WDYNIMP` **confirms BA/PM's measurement exactly**, on delivered code, independently. `WBAREIMP` is
a **second miss in the same guard and is not on the record**: the regex
`/^import\s+(?!type\b)[^;]*from\s+"\.\/history\.ts";/m` requires a `from` clause, so a bare
side-effect import — a genuine runtime pull that executes the module — is invisible to it. (Checked
and found HEALTHY in the same regex: multi-line `import { … }` blocks and `import * as ns` both
**are** matched, because `[^;]*` spans newlines. Recorded so nobody re-sweeps it.)

## The 13 kills, for the record

`WCACHE` (incidentally — see above), `WCOLS24M` ×7, `WALIAS` ×2 (a shared module-level rows buffer
— caught by `A2`'s wide-cell test and `A6`, which is `A2`'s wide-cell test earning its place),
**`WPOS` ×1** and **`W9ONCE` ×9** (the two D23 builds — **both now dead, D23 is genuinely closed and
I re-ran them rather than trusting the note**), `WNONASCII` ×1, `WROWS9` ×10, `WNOPARSE` ×10,
`WWINDOW7` ×6, `W9POS-every` ×1, `WPOP` ×10, `W2-index` ×2, `WPHANTOM` ×2.

**`WROWS9` is worth one line**: a self-consistent 9-row build (ships 9, exports 9) now fails
**both** `A1` tests *and* `A13`'s `= 23` in `src/frame.test.ts`. The `A1` split the Engineer took
from `## Test notes` is doing its job — both verdicts report.

## Re-run against the PROSPECTIVE MERGE with `ABC-027`

Because `main` moved during the pass, the four load-bearing survivors were re-run on the merged
tree:

| build | merged tree (`ABC-017` + merged `ABC-027`) |
|---|---|
| `WLEAD-A` | **SURVIVED 740/740** |
| `WLEAD-B` | **SURVIVED 740/740** |
| `WFREEZE` | **SURVIVED 740/740** |
| `WSPLICE` | **SURVIVED 740/740** |

**Every survivor survives the merge.** None of them is an artifact of the pre-rebase tree.
