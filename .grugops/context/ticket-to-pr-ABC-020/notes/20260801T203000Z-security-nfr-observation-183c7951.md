---
id: 20260801T203000Z-security-nfr-observation-183c7951
kind: observation
by: security-nfr
at: 2026-08-01T20:30:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-020
  - ABC-020
  - ABC-007
  - ABC-009
  - ABC-011
  - EPIC-001
  - EPIC-004
  - NFR-001
  - ADR-0002
  - src/gameend.ts
  - plans/nfr-catalog.md
  - plans/tickets/ABC-020-claimable-draws-and-fide-96-backstops.md
  - 20260731T205000Z-software-engineer-artifact-ref-8d6e55e0
  - 20260801T193500Z-qe-e2e-observation-c22d10e3
supersedes: 
---

# A10's three bars, re-measured independently — all three PASS, and the 3.78 µs bar needs its position written on it

Nothing below is quoted from the Engineer's report. Every figure was produced by a harness written
this session, in the session scratchpad **outside the repo**, against **byte-identical copies** of
`src/gameend.ts` (`cmp` verified against both the branch and `65cb789`). Nothing under `src/` was
instrumented; no instrumentation was left anywhere.

**Machine: Apple M3 (Mac15,13), Node v24.12.0, darwin/arm64, macOS 25.5.0. Every number below reads
`UNKNOWN - verify` on any other hardware.**

## The harness, and the cross-check that it is in the right regime

Call counts were **spied**, exactly as `plans/nfr-catalog.md` demands: throwaway copies of
`legal.ts` and `zobrist.ts` with an entry counter added, `gameend.ts` untouched. Two trees were
built — the branch, and `65cb789` (`b1b96cd~1`, the tree the Engineer started from) as the
pre-`ABC-020` baseline — and the timing runs load **both in one process** and measure them
interleaved `A,B,B,A`, so JIT and thermal drift hit both equally.

Primitives, as a check that the harness is measuring the same thing every earlier note measured:

```
  zobristKey(startpos)  281–293 ns   (published: 288–306 ns, three prior agents)
  legalMoves(startpos)  2.02–2.16 µs (published: 1.83–2.22 µs, ADR-0003)
```

## Bar 1 — `legalMoves` calls per `gameStatus`: **EXACTLY 1**. PASS

Sixteen call shapes: startpos bare, startpos + empty map, the G-1 repetition FEN at 3 / 4 / 5
occurrences, clock 100 with and without a map, clock 149, clock 150 with and without a map,
clock 150 with five occurrences, checkmate, stalemate, thin material at clock 150, and kiwipete
with and without a map.

```
  legalMoves per gameStatus:  min 1, max 1  — every shape, no exceptions
```

This is the invariant `ABC-007` was built to hold, and two new rules did not add a generation.

## Bar 2 — `zobristKey` calls per `gameStatus`: **AT MOST 1**. PASS

```
  1  whenever the counts map is actually consulted (occ 3, 4, 5; clock 100/149 with a map; kiwipete + map)
  0  whenever the caller is BARE — no map, no key, no cost
  0  whenever a cheaper branch decides first — clock >= 150, checkmate, stalemate, thin material
```

The fivefold test and the threefold claim genuinely share **one** read; the shared local is real and
not a comment. The same sixteen shapes on the pre-`ABC-020` tree also show max 1, so this bar is
held, not newly at risk.

## Bar 3 — within 1.5x of the measured 2.52 µs baseline (bar ≤ 3.78 µs). PASS

Denominator, stated because it is the whole point: the 2.52 µs baseline names
**`gameStatus(startpos, emptyMap)`** — the start position, parsed, with an empty `Map` passed
(`…-architect-design-observation-57f6f356`, 2026-07-30). Mean over 200,000 iterations after a
50,000 warm-up. Three fresh processes:

```
  gameStatus(startpos, emptyMap)     BRANCH  2.186 / 2.131 / 2.262 µs
                                     BASE    2.165 / 2.171 / 2.239 µs      ratio 1.010 / 0.981 / 1.010
                                     vs the 3.78 µs bar: 0.56x – 0.60x

  gameStatus(startpos) BARE          BRANCH  1.886 / 1.861 / 2.167 µs
  (the EPIC-004 search-leaf shape)   BASE    1.967 / 1.858 / 1.879 µs
```

**0.56–0.60x of the bar, and 0.98–1.01x of the pre-`ABC-020` code measured in the same process.**
There is no measurable cost. The added work is four integer comparisons, which is what the design
hop predicted.

## The one thing wrong with the bar, and it is the bar's wording, not the code

**The 3.78 µs bar is a START-POSITION number and nothing in `plans/nfr-catalog.md` says so.** Read
as an absolute ceiling on `gameStatus`, it fails on an ordinary middlegame position — and it fails
on the *merged* code too, so it would be indicting the baseline, not this change:

```
  gameStatus(kiwipete, emptyMap)     BRANCH  5.366 / 5.467 / 5.299 µs   (1.40x – 1.45x of the "bar")
                                     BASE    5.294 / 5.849 / 5.359 µs   ratio branch/base 0.94 – 1.01
```

`gameStatus` is dominated by its one `legalMoves` call, and `legalMoves` costs 2.1 µs at startpos
and 3.2 µs in a middlegame — so the function's cost tracks the position, and a bar with no position
on it is not a bar. This is the same defect the project already corrected for `NFR-005`
("in a middlegame position") and `NFR-002` (the ply-count denominator). **The ratio to the same
position on the pre-`ABC-020` tree is the machine-independent quantity and it is 0.94–1.01
everywhere.** `plans/nfr-catalog.md`'s NFR-001 row is corrected in this commit to carry the
position; no target moved.

## Allocation on the hot path

The task's phrasing — state (c) "must stay allocation-free" — is not literally achievable and never
was: merged code already allocates the returned `{ result, reason }` literal on every call. **The
real bar is that the branch adds nothing**, and it does not.

Measured with `--expose-gc --max-semi-space-size=128`, heap-used delta over windows of 1,000,000
calls (three windows each, zero GC events inside every window), with the result consumed so V8
cannot scalar-replace the returned status away:

```
  state (c), in progress, nothing claimable   BRANCH  1.57 / 1.34 / 1.33 B/call
                                              BASE    1.34 / 1.34 / 1.33 B/call     -> indistinguishable
  state (b), a claim IS available (clock 100) BRANCH  3.47 / 3.44 / 3.44 B/call
                                              BASE    5.98 / 1.19 / 1.19 B/call     -> branch ~ +2.3 B/call
```

Two honest notes on those numbers. First, `src/gameend.ts:161` allocates `const draws:
ClaimableDraw[] = []` **unconditionally**, on the state-(c) path as well — the source is not
allocation-free even though the measurement is. It costs nothing here because TurboFan sinks the
allocation into the branch where it escapes, which the state-(c) row measures directly. That
property holds on the optimized path, which is the path a search leaf runs on. Second, the state-(b)
delta of ~2.3 B/call is a **lower bound**, not the object's size: the `DrawClaims` and its array are
partly scalar-replaced too. Either way state (b) means a claim exists, which at a search leaf means
a halfmove clock ≥ 100 or a repeated position — rare, and the allocation is what the ratified shape
asks for.

I attempted the same measurement with TurboFan disabled (`--no-opt`) to price the un-optimized path
and it is **not conclusive** — ±17 B/call of noise with the orderings inverted. Recorded as
`UNKNOWN - verify`; closing it would need V8 allocation-site tracing rather than heap-used deltas.
It does not bear on the verdict: at a search leaf this function is hot by construction.

## Structural checks

- **No new dependency edge out of `src/gameend.ts`.** The import list is byte-identical to
  `65cb789`'s — `./legal.ts`, `./position.ts`, `./zobrist.ts` — verified by diff; only line numbers
  moved.
- **No new state on `Position`** (`ADR-0002` clause 1). `src/position.ts` is unchanged between
  `65cb789` and `HEAD`; the only files touched under `src/` are `gameend.ts` and `gameend.test.ts`.
- **No dependency change at all.** `package.json` and the lockfile are untouched, and the project
  has zero runtime dependencies — so ASVS V15.1.1 / V15.2.1 (third-party component currency) have
  no surface to fail on here.

## The security half, which is genuinely empty, and is not inflated to fill the column

The ticket says "No security trigger". That is correct and I re-checked it rather than accepting it:
`gameStatus` is a pure function of an in-memory `Position` and an optional `Map`; there is no
interpreter, no parser, no file, no socket, no process boundary, no credential, no persistence, and
no user data anywhere in the change. Working the L1 tier of
`agent-factory/checklists/security-nfr-checklist.md` (70 requirements at `security.asvs_level: L1`):
every applicable row is not-applicable **by absence of the surface it names**, not by assertion —
V1 (no interpreter and no `eval`), V3–V5 (no web, API or file surface), V6–V10 (no authentication,
session, authorization or token), V12–V14 (no transport, no configuration, no data at rest), V16
(this module logs nothing, and correctly so — it returns a value), V17 (no WebRTC). Two rows are
worth naming rather than dismissing:

- **V2.2.1 (input validated against logical limits).** `gameStatus` validates nothing and is right
  not to: it is an internal function whose contract is a well-formed `Position`. FEN-level semantic
  validation is `ABC-010`'s, and `ABC-009` (`legalMoves` mutating its argument) is the real
  integrity defect on this path — **carried, not owned**, ticketed, and confirmed still present by
  QE this cycle.
- **V11.4.1 (approved hash functions).** `zobristKey` is a 64-bit position hash for repetition
  detection, **not a security control** — nothing authenticates or authorizes on it, so the ASVS
  row does not apply. Its collision behaviour is a correctness question and it belongs to
  `ABC-011`, which is open and which this change gives a second consumer, as the ticket already
  records.

**No finding at any severity, and nothing at or near `security.block_on: high`.** The consequence of
a defect in this module is a wrong chess result — which is what the whole ticket is about, and it is
neither inflated here nor deflated.

## Provenance

Written directly into `notes/`; this install has **no `scripts/context-io.ts` and no
`mcp__grugops__propose_note` tool**, so Workflow 16's sanctioned writer does not exist here — the
degradation QE, Architect/Design and the Software Engineer each recorded on 2026-07-31. This is an
`observation` — a neutral kind with an empty `verified_by` — so no admission stamp was required and
none was bypassed. **No `finding` was recorded or attempted: there is no §14 gate in this task to
stamp one, and nothing here is self-stamped.** Every harness ran in the session scratchpad against
read-only copies; the copies and the throwaway worktrees have been removed.
