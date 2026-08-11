---
id: 20260812T030500Z-security-nfr-observation-8c17f3d2
kind: observation
by: security-nfr
at: 2026-08-12T03:05:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - A12
  - A13
  - A14
  - NFR-002
  - NFR-008
  - N8-LANE
supersedes:
---

# Every number in this hop was RUN on this gate's own instrument — the bar, the counts, the lane, the escape probe

> **Hand-authored**; an `observation` and not a `finding` — no verification stamp is issuable to me.
> Harness **outside the worktree entirely**, in the session scratchpad, importing the worktree's
> `src/` read-only by absolute path; the instrumented copy for the call counts is a **copy**, and the
> worktree was never written. `git status --porcelain -- src/` read after every stage: **empty**.

## Machine, and it matters because two bars are anchored to it

`Apple M3 (Mac15,13)` / **8 logical cores** / `Darwin 25.5.0 arm64` / Node **v24.12.0** / npm
**11.7.0** / vitest **3.2.7**. **This is byte-for-byte `NFR-008`'s stated reference machine and
`NFR-002`'s stated hardware**, verified by `sysctl`/`uname`/`--version` rather than assumed. Every
figure below is **`UNKNOWN - verify` on any other hardware.**

## Gates, re-run by me in this worktree

| gate | result |
|---|---|
| `npm run lint` | exit **0** (2 pre-existing `biome.json` config infos — schema 2.3.0 vs CLI 2.5.5, deprecated `recommended`; not this ticket's) |
| `npm run typecheck` | exit **0** |
| `npm run build` | exit **0** |
| `npm test` | **711/711**, **24 files** |
| skip count (`--reporter=json`, `numPendingTests + numTodoTests`) | **0** |
| `git status --porcelain -- src/` | **empty** |
| `git rev-list --count main..HEAD` | 15 |

The Orchestrator's stated baseline is reproduced, not inherited — any red would have been mine.

## `A14` / `NFR-002` part 1 and 2 — RE-DERIVED, NOT INHERITED

Protocol, this hop's own: population is **`ABC-012`'s deterministic LCG game from startpos**
(`src/history.test.ts:81-89`) re-implemented over the core's primitives, **asserting the realised ply
count** so a game that ended early could not silently weaken a cell; `status` evaluated **once per
history outside the clock**, because the ticket makes it an INPUT; `parseFen` **inside** the timed
region, where `lastMoveSan` actually pays it; 11 rounds × 2,000 iterations; **round 0 discarded**;
**cell order rotated every round**; medians of per-round means; a checksum against elision; **two
fully independent process runs, quoted separately and never averaged**.

| plies | 40 | 120 | 300 |
|---|---|---|---|
| **this gate, sample 1** | **5.665** | **8.171** | **10.049 µs** |
| **this gate, sample 2** | **5.723** | **8.196** | **10.027 µs** |
| QE (not inherited) | 5.66 | 8.21 | 10.06 µs |
| Engineer (not inherited) | 5.68 | 8.07 | 9.94 µs |

- **Absolute: worst cell 10.049 µs against the 25 µs bar = 0.402x. MET.**
- **Spread: 1.774x and 1.752x against the 3x bar. MET.**
- Component corroboration on the same protocol: `isInCheck` **0.091–0.120 µs** across the three ply
  counts — free, as the ticket says, and it does not sit in `legalMoves`' band.

**Three independently written harnesses by three roles now agree on this quantity to within 1.7%.**
That is a statement about the instrument as much as about the panel, and it is the reason to believe
the number rather than the reason to have skipped taking it.

## `NFR-002` part 3 — `A13`'s call counts, THE PART THAT BINDS

Instrumented copy built outside the worktree. **Every patch asserted to apply exactly once** (a patch
that silently failed to apply would produce a zero meaning *nothing ran*), and an **ARMED-SPY
positive control** run before any zero was believed — QE's `failed-attempt` set that bar and it is
honoured here.

### The rewritten scan clause, at EVERY regime including ply 0

Clause as it now stands: **`64` when `history.moves` is empty, `64` + the anchor's occupied squares
when it is not.**

| anchor | ply 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| 32-piece start (`occupied` = 32) | **64** | 96 | 96 | 96 | 96 | 96 | 96 |
| 3-piece sparse (`occupied` = 3) | **64** | 67 | 67 | 67 | 67 | 67 | 67 |

**14 of 14 cells HOLD.** The boundary is 0 → 1 and nothing else; depth never enters the value.
BA/PM's correction is correct as written, and the wording is true at ply 0 — which is the thing the
brief asked me to verify and which the *previous* wording got wrong.

### And at seven MOVE-TYPE regimes the criterion does not name

The criterion splits on `history.moves` emptiness and says nothing about what the last move IS. That
is an unexamined regime of exactly the shape that produced `D19`, `D22` and `D27`, so it was probed:

| regime | anchor occupancy | `squareAt` | expected | verdict |
|---|---|---|---|---|
| castle (`last: O-O`) | 22 | 86 | 86 | **HOLDS** |
| promotion (`last: a8=Q`) | 3 | 67 | 67 | **HOLDS** |
| en-passant capture | 4 | 68 | 68 | **HOLDS** |
| ordinary capture | 5 | 69 | 69 | **HOLDS** |
| checking last move (`last: Qxe5+`) | 32 | 96 | 96 | **HOLDS** |
| mating last move (`last: Qh4#`) | 32 | 96 | 96 | **HOLDS** |
| disambiguator (`last: Nexd4`) | 5 | 69 | 69 | **HOLDS** |

**21 of 21 regimes hold in total.**

### The sum is STRUCTURALLY complete, not empirically lucky

Every production caller of `squareAt` in the tree, enumerated rather than sampled:
`fen.ts:90` (`parseFen`, one per occupied square — **the replay term**), `fen.ts:193` (`toFen`, not
on the panel's path), `render.ts:133` (`ABC-014`'s board scan), `status-panel.ts:129` (**the 64**).
**`grep -c squareAt src/apply.ts` = 0** — `makeMove` cannot contribute at any depth. `legalMoves`,
`isInCheck` and `toSan` contribute nothing, which is why the count is flat from ply 1 to ply 6.

### The other four clauses, at all 21 regimes

- `gameStatusOf`, `repetitionCounts`, `keyHistory`, `gameStatus` — **0 everywhere**. The returning
  repetition derive stays caught.
- `toSan` — **1**, and **0** on the empty history.
- `isInCheck` **direct** half at ply 0: total **1** on both anchors, with `toSan` at 0, so the total
  IS the panel's own. **HOLDS.**
- `isInCheck` **difference** half at depths 2, 3, 4, 5 on both anchors: `withSan` 2 − `sanAlone` 1 =
  **1** at every one. **HOLDS.** `sanAlone` is **1**, not 0 — the spy does intercept SAN's internal
  call, so the `> 0` provenance guard in the delivered test records a fact that is still true.

## `NFR-008` — the lane TOTAL, on the instrument the row names

`npm test`, `PERFT_DEEP` unset, in this worktree. One fresh OS process per run, round 0 discarded,
**every run asserting its own file AND test count** (24 / 711) — a mismatch would be a harness error,
never a datum. **0 harness errors over 18 runs.**

| sample | wall median | CPU median | worst single run |
|---|---|---|---|
| 1 (n = 8) | **1.590 s** | **7.690 s** | wall 1.74 / CPU 7.79 |
| 2 (n = 8, with the count control on every run) | **1.615 s** | **7.735 s** | wall 1.74 / CPU 7.80 |

**Against ≤ 3 s wall and ≤ 13 s CPU: 0.53x–0.54x and 0.59x–0.60x. BOTH CLAUSES MET**, and met on
every individual run, not only at the median.

## `N8-LANE` — the standing per-ticket bar this ticket inherits

`ABC-016` states no lane bar of its own, and the row is explicit: *"a ticket that states nothing has
stated this one."* Checked against that wording rather than against a per-ticket invention, as the
bar instructs.

Three conditions in one interleaved harness, out of tree with `node_modules` symlinked: **`main`**
(the denominator — the lane without this ticket's files), **`HEAD`**, and a **`cmp`-verified
byte-identical twin of `main` as the identity null control** (824 files compared, **0 differing**).
Condition order rotated every round, one fresh process per run, round 0 discarded, n = 8 usable
rounds, every run's file/test count asserted (22/676 or 24/711). **`main` was never checked out** —
both trees came from `git archive`.

| sample | ticket delta (median paired) | sign | NULL control | NULL sign | admissible? |
|---|---|---|---|---|---|
| 1 | **+485 ms** | 7/8 | −1.77% | 2/8 | **NO** — null exceeds the bar's own ≤ 1.5% floor |
| 2 | **+485 ms** | **8/8** | **−0.57%** | **3/8** | **YES** |

**Sample 1 is reported and not smoothed: its null control fails the admissibility clause the bar
itself requires, so its delta is not admissible and is quoted only for reproduction.** Sample 2's
null is inside the floor and its sign is at chance — 3/8, matching exactly the three prior null
floors this row records (3/8, 3/8, 3/8).

**Both samples independently produced +485 ms**, which is a stronger statement than either alone.

- Gross delta **+485 ms CPU** (6.19% of the denominator lane).
- The branch adds **2 test files** (22 → 24) and 35 tests (676 → 711).
- **Net of the stated per-file floor credit** (160 ms × 2 = 320 ms, charged to the floor account,
  owner Architect/Design, not to this ticket): **+165 ms.**
- **Against the ≤ 650 ms bar: 0.25x. MET.**

**No new NFR row is owed and none was seeded.** `NFR-002` is already the row — its `Applies to` cell
names the status panel — and it carried *"STILL UNMEASURED … the status-panel compute (`ABC-016`)"*
in two places. Following the convention five prior Security/NFR gates in that file set (`ABC-009`,
`ABC-011`, `ABC-012`, `ABC-014`, `ABC-018` each recorded at the gate), the measurement is **appended
as a new block**; the two earlier sentences are **left standing** as the record of what was true at
those hops, because rewriting history in that file is not this gate's to do. `NFR-001` and
`NFR-003`–`NFR-008` verified **byte-identical by md5 line by line**, 10 table lines before and after,
`git diff --numstat` exactly 1 insertion / 1 deletion.

## The structural obligation this ticket homes to THIS gate — DISCHARGED

`NFR-002`'s `O(window)` boundary condition was verified **structurally** at `ABC-012`'s gate on the
ground that nothing pulls the repetition derive into a frame, and the ticket states that `A13` does
**not** discharge it and that the gate must `grep` **delivered** code. Re-grepped here:

| importer of `src/history.ts` | kind |
|---|---|
| `src/history.ts` ← `src/history.test.ts:23` | runtime, **test** |
| `src/status-panel.ts:42` | **`import type`** — erased |
| `src/status-panel.test.ts:33` | **`import type`** — erased |
| `src/status-panel.nfr.test.ts:17/:49/:58` | `vi.mock` + dynamic `await import()` — **test-only** |

**Production runtime importers: ZERO.** Item 7 as originally drafted would have been that importer
and would have expired the verification on merge; as delivered the panel replays through `fen.ts` +
`apply.ts` and calls the repetition machinery zero times. **The `O(window)` statement survives this
ticket.**

## The security half — the probe, and what it found

**`A12` IS asserted on the panel's own returned rows**, not through `assembleFrame` — verified at
source, `src/status-panel.test.ts:457-467` counts code points over `panelOf(...)`. The brief's
question is answered: the trap the ticket warned about is not present.

**Every code point the panel emitted across the 21 regimes above**: `aboveU+007F` **0**, C0 controls
**0**, `U+007F` **0**, `ESC` **0**. The distinct set is entirely printable ASCII.

Adversarial probe on the delivered module, three vectors:

| vector | result |
|---|---|
| hostile FEN with `ESC` in the placement field | **rejected by `parseFen`** — *"illegal character … in placement rank 8"*. No byte reaches a row |
| hostile FEN with `ESC` in the fullmove field | **rejected by `parseFen`** — *"fullmove number must be a non-negative integer"* |
| `GameStatus` with `ESC` as a draw key | **mapped away** — `DRAW_NAMES` is a CLOSED table; an unknown key yields `undefined`, not an echo |
| `GameStatus` with `ESC` in `claimable.by` | **mapped away** — `by === "white" ? "White" : "Black"` is a closed ternary |
| `Position.fullmoveNumber` set to a string / an object with `toString` (**type-contract violation**) | **`ESC` IS emitted verbatim into row 1** |

**The structural reading, which is what makes this clean rather than lucky:** the panel's entire
output alphabet is (a) module literals, (b) `Number.prototype.toString` of two numbers, and (c)
`toSan`'s output — whose alphabet is `PIECE_LETTERS` ∪ `"abcdefgh"` ∪ rank digits ∪ `{x, =, +, #, O, -}`,
read at source. **No input string is ever echoed.** `initialFen` is *parsed*, never passed through.

**The one vector that lands requires violating the `Position` type at runtime, and nothing in
production can**: every `Position` comes from `parseFen` (validated, proven above) and is mutated by
`makeMove` (integer arithmetic). There is no deserialization boundary, no IPC, no `JSON.parse` into a
`Position` anywhere in `src/`.

**And the frame-level control closes it anyway — read at source rather than assumed.**
`src/frame.ts:174` applies `sanitize` to `[...parts.board, ...parts.status, ...parts.history]` —
**the panel's rows are sanitized, not only the message region** — and `sanitize` at `:105` drops
`code < 0x20` and `0x7f` **unconditionally in both glyph modes**. Its own doc comment names the
threat model exactly: *"a player who types an ANSI escape would otherwise get it written to their own
terminal, where it can move the cursor, clear the screen, or corrupt every subsequent in-place
redraw."*

**So the composition is complete and the two controls are complementary, which is worth stating
precisely because neither is sufficient alone:** `A12` pins `> U+007F` at the **panel** level in both
modes; `assembleFrame` strips **C0 and `U+007F`** at the **frame** level in both modes. `ESC` is
`0x1B` — **below** `U+007F` — so **`A12` cannot fail on a terminal escape.** That is a limit of
`A12`'s reach, not a false claim by it: its wording is *"the count of code points above `U+007F` …
is exactly 0"*, which is exact and delivers exactly that. Applying `D17`'s test — *does the criterion
claim a protection it cannot deliver?* — **it does not.** Carried as an accepted risk with an owner,
not as a required fix.
