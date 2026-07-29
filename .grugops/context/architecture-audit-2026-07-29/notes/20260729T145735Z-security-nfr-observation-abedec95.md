---
id: 20260729T145735Z-security-nfr-observation-abedec95
kind: observation
by: security-nfr
at: 2026-07-29T14:57:35Z
verified_by: 
confidence: high
refs:
  - architecture-audit-2026-07-29
  - NFR-001
  - NFR-002
  - NFR-003
  - NFR-004
  - NFR-005
  - NFR-006
  - NFR-007
  - RISK-002
  - EPIC-003
  - EPIC-004
  - ABC-006
  - ABC-008
  - plans/nfr-catalog.md
  - src/perft.ts
  - src/perft-bench.ts
  - src/legal.ts
  - src/moves.ts
  - src/apply.ts
  - src/zobrist.ts
  - src/fen.ts
  - package.json
supersedes: 
---

# Security/NFR audit — the NFR envelope, `architecture-audit-2026-07-29`

**RESULT: PASS_WITH_RISKS.** Read-only audit. No code, catalog, board, ticket or trace was
modified. Frontmatter `confidence: high` applies to the **measured** figures below (every one
carries the command that produced it). Projections and judgments are marked inline as
`CLAIM (confidence: …)` and are not load-bearing.

**Writer caveat, stated plainly:** this repo has **no `scripts/context-io.ts`** — there is no
`scripts/` directory at all. The sanctioned writer named by
`agent-factory/workflows/16-context-read-write.md` and `agent-factory/contracts/context-note.md`
is absent, so this note was composed **by hand directly against the SCTX-01 schema**. No
validator ran; no admission check ran; no `index.md` / `index.jsonl` was regenerated. I claim no
enforcement I do not have. `verified_by` is deliberately empty and this is `kind: observation`,
not `finding`: there is no live §14-gate verdict for this audit to stamp against, so a `finding`
would be inadmissible — **including for the numbers I measured myself**.

---

## 1. Trigger confirmation — I agree the security half is N/A, with two corrections

I verified the trigger assessment against the code rather than accepting it. **Confirmed absent**,
by evidence not assumption:

- Per-pattern scan of non-test `src/` for `child_process`, `exec(`, `execSync`, `spawn`,
  `eval(`, `new Function`, `require(`, `fs.`, `process.env`, `fetch(`, `http` →
  **all zero**. (The `spawn` pattern reported 3 hits; all three are `isPawn` in `src/apply.ts`
  matching case-insensitively. Not `spawn()`.)
- No auth, 2FA, payments, personal data. `compliance_regime: []` → no Compliance Officer handoff.
- No public API, no file upload, no admin action, no database, no queue, no external integration.
  `dependencies: {}` (zero runtime deps), `"private": true`, no `bin` entry — nothing is published
  and nothing is served.

**The security half is genuinely N/A. I am not manufacturing security work.** The single stated
trigger — *performance-sensitive flow* — is correct and is where this audit spent its effort.

Two corrections to the trigger list, neither of which makes this a security review:

1. **FEN parsing is a live input surface, but it is a RELIABILITY trigger, not a security one.**
   Details in §5. Its failure mode is a wrong chess answer and a corrupted in-memory board — not
   injection, not privilege, not data exposure. There is no trust boundary and no sink. Calling it
   a security finding would be inflation.
2. **A dependency risk exists and is dev-only.** `npm audit --omit=dev` → **0 vulnerabilities**
   (zero runtime deps). Full `npm audit` → **5 high**, entirely inside the coverage toolchain:
   `@vitest/coverage-v8` → `test-exclude` → `glob` → `minimatch` → `brace-expansion`
   (GHSA-mh99-v99m-4gvg, DoS via unbounded expansion). No runtime path, nothing shipped.
   This does resolve an ASVS row the 2026-07-24 review honestly left open: that note recorded
   **V15.1.1 / V15.2.1 as `UNKNOWN - verify`** because SCA was outside static scope. It is no
   longer unknown — see §6 for the disposition.

---

## 2. NFR-001 — MEASURED, still met on this machine today

Command: `npm run perft`, run **four** times. Machine: Apple M3 (`hw.model` = Mac15,13, 8 cores),
macOS 26.5.2, Node **v24.12.0**, darwin/arm64.

| Run | Nodes | Elapsed | Rate |
|-----|-------|---------|------|
| 1 | 11,377,922 | 1.869 s | **6,089,121 /sec** |
| 2 | 11,377,922 | 1.861 s | **6,113,488 /sec** |
| 3 | 11,377,922 | 1.860 s | **6,117,863 /sec** |
| 4 | 11,377,922 | 1.831 s | **6,214,366 /sec** |

Observed range **6.09M – 6.21M**, central value **~6.11M**.

- **NFR-001 (≥ 1,000,000 nodes/sec) is MET, ~6.1x over target.** Verified, not restated.
- Correctness is intact alongside the rate: startpos perft(4) = 197,281 and kiwipete perft(4) =
  4,085,603, both exact; `perftDivide` on kiwipete d3 sums to 97,862 across 48 moves.
  `npm test` → **143 tests / 7 files, all pass**; `npm run typecheck` clean; `npm run lint` clean
  (2 infos). The measurements below are taken on green code.
- **Precision note:** the catalog records `~6.2M`. That sits at the **top** of my four-run range,
  not its centre. The honest figure today is ~6.1M. NFR-001 is comfortably met either way, so this
  is a rounding observation, not a failure.

---

## 3. Does the measurement still mean what the catalog says it means? Partly — and the constraint's stated margin is refuted

**The constraint, stated exactly.** `plans/nfr-catalog.md` records NFR-005 as
**RISK-002 = GO WITH CONSTRAINT**: EPIC-004's per-move budget **must be time-based (iterative
deepening against a wall clock), not depth-based**, because compounding ~3x for real legality
filtering and ~3x for slower hardware puts a worst-case machine near ~300k nodes/sec, below the
500k target. It is recorded as inherited by EPIC-004 and non-negotiable.

**Is the current code inside that constraint?** Formally yes and vacuously so — EPIC-004 does not
exist, so nothing has breached it. But the **premise underneath it has been overtaken by
measurement**, and that matters more than the formal answer.

I instrumented the harness's own tree walk to separate counted leaves from nodes that actually
generated (probe run outside the repo; repo untouched):

```
TOTAL leaves = 11,377,922   generating nodes = 321,193   1.918 s
  leaf-node rate        5,931,415 /sec   <- what `npm run perft` prints
  full-generation rate    167,441 /sec   <- nodes that actually generated
  free-leaf fraction        97.3% of tree nodes did no generation
```

The two rates are **the same 1.918 seconds of CPU divided by two different denominators**. The
ratio is 35.4x. ABC-008 estimated the free-leaf fraction at ~96%; measured, it is **97.3%** —
slightly worse than the spike assumed.

I then re-ran the spike's own **metric B definition** (every node generates, leaves included)
against the **real** generator:

| Position | Depth | Nodes | Elapsed | Rate |
|----------|-------|-------|---------|------|
| startpos | 3 | 9,323 | 0.031 s | 302,170 /sec |
| startpos | 4 | 206,604 | 0.588 s | **351,379 /sec** |
| kiwipete | 3 | 99,950 | 0.615 s | 162,561 /sec |
| kiwipete | 4 | 4,185,553 | 22.274 s | **187,912 /sec** |

**The catalog's NFR-005 row cites metric B = 2,639,455 /sec on an M3. The real generator, measured
the same way on an M3, delivers 163k – 351k /sec.** That is **7.5x – 16x below** the proxy. The
spike predicted "materially below 2.64M" and priced it at roughly 3x; the measured gap is far
larger, because the throwaway benchmark had **no legality filtering** and legality filtering turns
out to be ~71% of the real per-node cost (§4).

**Disposition:** the **GO WITH CONSTRAINT decision itself survives and is now more strongly
justified** — time-based iterative deepening is more necessary, not less. What does **not** survive
is the "~5x headroom" clause the row rests on. The worst-case-slow-machine scenario the constraint
was hedging against has arrived **on the fast machine**. The catalog row is stale and currently
reads better than reality. I did not edit it (read-only); ownership in §6.

---

## 4. The headroom question — there is no safety margin for EPIC-004; there is a deficit

This is the number a human is being asked to bet on, so it is stated without softening.

**Essentially none of the ~6.1M raw perft throughput is a real safety margin for EPIC-004.**

The apparent 12.4x margin (6.2M ÷ 500k) decomposes as:

- **~35.4x of it is a denominator artifact.** 97.3% of the counted nodes returned `1` without
  generating, ordering, hashing or evaluating anything. Remove that and the same run yields
  **167,441 generating nodes/sec**.
- **What remains is a deficit, not a margin.** Search-shaped throughput is **167k – 351k /sec**
  against an NFR-005 target of **≥ 500,000 /sec**. That is **0.33x – 0.70x of target** — a
  **1.4x to 3.1x shortfall**.
- **And that shortfall is measured with zero evaluation.** No eval function, no move ordering,
  no transposition table, no quiescence, no killer/history heuristics. Every one of those adds
  per-node cost. NFR-005 asks for 500k **with evaluation running**; the code is already below
  500k **before** evaluation exists.

Both plausible definitions of "node" land below target, so this is not an artifact of my chosen
denominator: the pessimistic definition (every node generates) gives 163k–351k; the optimistic one
(leaves free, internal nodes only) gives 167,441. Neither reaches 500k.

**Where the cost is — attribution, measured (calls/sec, warmed):**

```
generateMoves(kiwipete) pseudo-legal    1,044,413 /sec   =   958 ns
legalMoves(kiwipete)    legal             187,132 /sec   = 5,263 ns
legalMoves(startpos)    legal             466,526 /sec   = 2,144 ns
isInCheck(kiwipete)                    12,818,637 /sec   =    78 ns
zobristKey(kiwipete)  [BigInt, 128 scan] 3,467,492 /sec   =   288 ns
gameStatus(kiwipete)                      183,803 /sec   = 5,441 ns
```

48 pseudo-legal moves x 78 ns attack-test = 3,744 ns, i.e. **~71% of `legalMoves` time is the
per-move make/test/unmake legality filter in `src/legal.ts`**; ~18% is pseudo-legal generation;
~11% is make/unmake plus per-move object allocation. The cost of producing one legal move list —
**2.1 µs (startpos, 20 moves) to 5.3 µs (kiwipete, 48 moves)** — is the hard ceiling on search node
rate, i.e. **~190k – 470k nodes/sec, before any evaluation**.

**An important correction to how the spike's biases were netted out.** ABC-008 listed "no
alpha-beta, no TT, no move ordering" as a *pessimistic* bias that "buys back a large multiple."
For a **rate** metric it buys back much less than that framing implies: pruning reduces the
**number of nodes** needed to reach a depth, it does not make a node cheaper. Every node still pays
generation. Pruning is real relief for **NFR-004** (wall-clock to a move); it is close to no relief
for **NFR-005** (nodes/sec). The two were netted against each other in a way that flattered the
result.

**The deficit is fixable, but not by tuning — and I tested the cheap fix first and it failed.**
My hypothesis was that `kingSquareOf`'s `position.board.indexOf(...)` linear scan, called inside
the per-move loop, was the hotspot (a black king on e8 = index 116 needs 117 comparisons vs 5 for a
white king on e1). I built a hoisted variant, asserted it returns byte-identical move lists, and
measured it:

```
legalMoves          kiwipete WHITE  200,569 /sec   BLACK  161,967 /sec   (ratio 1.24x)
legalMovesHoisted   kiwipete WHITE  199,109 /sec   BLACK  175,008 /sec
speedup             WHITE 0.99x     BLACK 1.08x
```

**My hypothesis was wrong** and I am recording it rather than hiding it: V8's `Uint8Array.indexOf`
is fast enough that hoisting it buys 8% on black and nothing on white. The real cost is the
architecture, not a micro-inefficiency.

That architecture is a **documented, deliberate** choice — `src/legal.ts` says so in its header
("correctness first, and the EPIC-004 spike decides whether a pin-aware generator is ever worth
building"). The code did exactly what it said it would. The deferred decision has now come due.

> **CLAIM (confidence: medium).** A pin-aware / incremental-legality generator — testing only king
> moves, pinned pieces and check evasions instead of every pseudo-legal move — is the named fix.
> Published gains for that change are typically 2–4x, which would put search-shaped throughput at
> roughly 350k – 1.4M /sec and plausibly recover NFR-005. This is real engineering under a new
> ticket, not tuning, and no such ticket exists today. The multiplier is from general practice, not
> from anything measured here.

> **CLAIM (confidence: low).** Applying the spike's own 2–3x slower-hardware factor to the measured
> 167k–351k gives **~56k – 175k nodes/sec** on a mid or low-power laptop. Against NFR-004's
> 3-second budget that is ~170k–525k nodes per move. This is arithmetic on an unvalidated factor,
> not a measurement — no non-M3 machine was tested.

**Two concrete EPIC-004 design inputs falling out of the measurements:**

- `zobristKey` is a full 128-square rescan returning a **BigInt** (288 ns). At today's 5.3 µs node
  that is ~5% — affordable only *because* generation is slow. If generation gets 3x faster it
  becomes ~16%. A transposition table will want an **incremental** XOR maintained in
  `makeMove`/`unmakeMove`, and `UndoRecord` currently carries no hash delta — so `src/apply.ts`
  has to change for a TT to be cheap.
- `gameStatus(kiwipete)` = 5,441 ns vs `legalMoves` 5,263 ns: terminal detection adds only ~3% over
  the generation the search already pays. The QE claim that it is "cheap by construction" holds up
  under measurement.

---

## 5. NFR-002..NFR-007 — what is genuinely unverifiable vs what quietly became verifiable

Nothing below is marked passed that was not measured.

| NFR | Catalog today | Audited status |
|-----|---------------|----------------|
| NFR-002 render < 16 ms | `UNKNOWN - verify` | **Genuinely unverifiable — correct as recorded.** `src/` holds 9 non-test modules (apply, fen, gameend, legal, moves, perft, perft-bench, position, zobrist). No renderer exists. |
| NFR-003 keystroke < 50 ms; `moves` / tab-complete < 100 ms | `UNKNOWN - verify` | **Partly verifiable now — do NOT mark passed.** The `moves` command's compute is `legalMoves()`, measured at **2.1–5.3 µs**, i.e. ~19,000–47,000x under the 100 ms budget. Its **compute component has a measured upper bound and is not a risk.** Keystroke echo and terminal I/O are the unmeasured half and remain genuinely unknown. |
| NFR-004 ≤ 3 s / move | `UNKNOWN - verify` | **Genuinely unverifiable — no search exists.** Now *bounded* by the derived arithmetic in §4; that bound is a CLAIM, not a pass. |
| NFR-005 ≥ 500k nodes/sec with eval | "above target with ~5x headroom (GO WITH CONSTRAINT)" | **Its generation half is now measurable, and the measurement contradicts the row.** Measured ceiling **167k–351k /sec with no evaluation at all**, vs a 500k target *with* evaluation. The row is stale and reads better than reality. Not re-marked here (read-only). |
| NFR-006 book ≤ 1 MB | `UNKNOWN - verify` | **Genuinely unverifiable — correct as recorded.** No opening book, no build artifact, no bundling step. |
| NFR-007 npx → board < 2 s | `UNKNOWN - verify` | **Genuinely unverifiable — correct as recorded.** `"private": true`, no `bin`; nothing is publishable. One component bounded: node startup + import of the whole rules core (including the Zobrist table build) = **~40 ms**, ~2% of budget. npm resolution/extraction dominates and cannot be measured until EPIC-006 exists. |

**Net:** four of the six (NFR-002, 004, 006, 007) are honestly and correctly `UNKNOWN - verify`.
**NFR-003 became partly verifiable** and its compute half is comfortable. **NFR-005 became partly
verifiable and the news is bad** — it is the one row whose recorded status is now misleading.

---

## 6. Reliability / robustness — FEN input (`src/fen.ts`), for EPIC-003

**Grammar validation is solid and LOUD.** Every malformed-grammar case I threw at `parseFen` threw
a typed `FenError` naming the exact fault, before any position was returned — 13 for 13: empty
string, garbage, wrong field count, 9 ranks, over-long rank, illegal piece char, zero kings, two
white kings, bad side-to-move, bad castling char, bad ep square, negative halfmove, fullmove 0.
The 2026-07-24 review's assessment of the grammar layer holds up under adversarial input.

**Semantic validation is absent, and there the failure is SILENT.** `parseFen` never cross-checks
the position's own invariants, and four classes of illegal-but-grammatical FEN are accepted without
a word:

1. **Castling rights are not cross-checked against the board — and this one corrupts the caller's
   Position.** `4k3/8/8/8/8/8/8/K7 w KQ - 0 1` (white king on **a1**, castling rights `KQ`, no
   rooks) parses cleanly. `generateMoves` then emits phantom castles `4->6` and `4->2` from an
   empty e1. `makeMove` writes a king onto the destination and `unmakeMove` writes
   `move.piece` back onto `from` — **spawning a second white king on e1 that was never there**:

   ```
   fresh parse   4k3/8/8/8/8/8/8/K7 w KQ - 0 1        kings W@[0]   B@[116]
   legalMoves    -> 5 moves
   board after   4k3/8/8/8/8/8/8/K3K3 w KQ - 0 1      kings W@[0,4] B@[116]
   legalMoves again -> 10, again -> 10   (not idempotent)
   ```

   `src/legal.ts` documents `legalMoves` as leaving the position unchanged ("Plays each move on the
   position in place and takes it back, so the position is unchanged on return"). **That invariant
   is violated: a documented-as-pure query permanently mutates its argument, silently, with no
   error and no log.** A well-formed position is unaffected — kiwipete round-trips exactly through
   two `legalMoves` calls — so this is reachable only from an illegal input, which is precisely
   what EPIC-003 will accept.

2. **An illegal castle is offered as legal.** `4k3/8/8/8/8/8/8/4K3 w K - 0 1` (king on e1, right
   `K`, **no h1 rook**) yields 6 legal moves including `4->6 (CASTLE)`. No corruption here — the
   board round-trips — but the caller is handed a move that does not exist in chess.

3. **A position where the side NOT to move is already in check is accepted, and a king-capturing
   move is offered.** `4k3/8/4Q3/8/8/8/8/4K3 w - - 0 1` → 29 white legal moves, of which **1
   captures the black king** (`84->116`, Qe6xe8). Downstream that removes a king from the board,
   after which `kingSquareOf`'s `indexOf` returns `-1` and `isSquareAttackedBy` indexes a
   `Uint8Array` at negative offsets — undefined behaviour rather than a diagnosable error.
   Pawns on rank 1 / rank 8 and an ep square with no pawn beside it are likewise accepted.

4. **Numeric clocks are unbounded — `toFen` stops round-tripping.** `/^\d+$/` passes, then
   `Number()` overflows silently: a 400-digit halfmove yields `halfmoveClock = Infinity` and
   `toFen` emits the literal `"... - Infinity 1"`; a fullmove of `1e21` emits `"1e+21"`. `toFen` is
   documented to "round-trip byte-identically with parseFen" and here it emits a string `parseFen`
   would reject.

**Minor:** non-string input (`null`, `undefined`, `42`, `{}`, `[]`) throws a raw `TypeError`
(`Cannot read properties of null (reading 'trim')`), not `FenError`. A caller that catches only
`FenError` — the natural thing to write — leaks a stack trace instead. Low severity; typed callers
will not hit it, but a CLI boundary is untyped by nature.

**Honest severity call: this is a reliability defect, not a security one.** There is no injection
sink, no trust boundary, no privilege and no data exposure — the consequences are a wrong chess
answer and a corrupted in-memory board. It is **latent today** (`parseFen` has no user-facing
caller) and becomes **live the moment EPIC-003 accepts a FEN from a user**, which is exactly what
EPIC-003 is for. Loud where it checks; silent where it does not.

---

## 7. Required fixes and accepted risks — stated separately

### Required fixes (before the dependent epic starts; none blocks anything in flight today)

- **RF-1 — before EPIC-004 is planned: correct the NFR-005 catalog row and re-derive the
  constraint.** The row's "~5x headroom" is refuted by measurement (§3, §4); the row should carry
  the measured 167k–351k search-shaped ceiling and record that NFR-005 is **currently missed with
  no evaluation running**. The GO WITH CONSTRAINT decision stands and should be **tightened**, not
  merely inherited. Owner: **Architect/Design** (owns `plans/nfr-catalog.md` per the file's own
  ownership note).
- **RF-2 — before EPIC-004 is committed: take the deferred legality-generation decision.**
  `src/legal.ts` explicitly defers pin-aware generation to "the EPIC-004 spike"; that decision is
  now due, since the make/test/unmake filter is ~71% of per-node cost. Needs a ticket; none exists.
  Decision owner: **Architect/Design**; implementation owner: **Software Engineer**.
- **RF-3 — before EPIC-003 accepts user FEN: add semantic FEN validation.** Cross-check castling
  rights against king/rook placement, reject a position where the side not to move is in check,
  reject pawns on ranks 1/8, bound the clock fields, and normalise non-string input to `FenError`.
  Ticketing owner: **BA/PM** (under EPIC-003); implementation owner: **Software Engineer**.

### Accepted risks (each with a named owner)

- **AR-1 (low, contextual — severity overridden from `high` with reason): 5 high `npm audit`
  findings in dev dependencies.** `@vitest/coverage-v8` → `test-exclude` → `glob` → `minimatch` →
  `brace-expansion` (GHSA-mh99-v99m-4gvg). **Override reason:** `npm audit --omit=dev` reports
  **0 vulnerabilities**; the package has zero runtime dependencies, is `"private": true`, has no
  `bin`, and ships nothing. The vulnerable code path requires attacker-controlled glob patterns,
  which do not exist here. `npm audit fix --force` would install `@vitest/coverage-v8@4.1.10`, a
  **breaking** upgrade — so this warrants a ticket, not a drive-by. Does not cross
  `security.block_on = high` in context. Owner: **Release Manager** (build/release surface).
  This also disposes of the V15.1.1 / V15.2.1 `UNKNOWN - verify` the 2026-07-24 review left open.
- **AR-2 (low, precision): the catalog's NFR-001 `~6.2M` sits at the top of the observed
  6.09M–6.21M range**, not its centre (~6.11M). NFR-001 is met ~6.1x either way. Owner:
  **Architect/Design**.
- **AR-3 (low, latent): the `legalMoves` purity violation (§6 case 1) ships as-is today.**
  Unreachable while `parseFen` has no user-facing caller; the fix rides with RF-3. Owner:
  **Software Engineer**, tracked under EPIC-003.

### No security finding

No ASVS L1 requirement fails. `asvs_level = L1`, `block_on = high`, `compliance_regime = []`.
Deliberately **no `kind: finding`** recorded anywhere in this audit: a `finding` requires a real
`§14-gate#<id>` or `human:<name>` stamp, no live gate verdict exists for this task, and I will not
self-stamp — not even for the throughput numbers I measured myself.

---

## Scope reviewed

`npm run perft` (x4), `npm test`, `npm run typecheck`, `npm run lint`, `npm audit` /
`npm audit --omit=dev`, per-pattern dangerous-surface grep over non-test `src/`, plus three
read-only instrumentation probes executed **outside the repo** (in the session scratchpad,
importing `src/` by absolute path) covering: leaf-rate vs generation-rate separation, the ABC-008
metric-B search-shaped walk against the real generator, component microbenchmarks, a
king-scan-hoist A/B with byte-identical-result assertion, and 25 adversarial FEN cases. Static read
of `src/perft.ts`, `perft-bench.ts`, `moves.ts`, `apply.ts`, `legal.ts`, `zobrist.ts`, `gameend.ts`,
`fen.ts`, `position.ts`, plus `plans/nfr-catalog.md`, `.grugops/factory.config.json`,
`plans/tickets/ABC-006`, `plans/tickets/ABC-008`, and the prior ABC-008 / EPIC-001-gate notes.
No non-M3 hardware was tested. Ran concurrently with, and without sight of, the mapper and
architect subtasks.
