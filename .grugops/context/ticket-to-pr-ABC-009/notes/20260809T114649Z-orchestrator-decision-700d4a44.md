---
id: 20260809T114649Z-orchestrator-decision-700d4a44
kind: decision
by: orchestrator
at: 2026-08-09T11:46:49Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - ABC-022
  - NFR-001
  - NFR-005
  - src/moves.ts
  - src/moves.castling.test.ts
  - plans/board.md
  - agent-factory/workflows/05-pr-quality-gate.md
  - agent-factory/contracts/context-note.md
supersedes: 20260809T141500Z-orchestrator-decision-865b06ae
---

# Two things: my own timestamp was wrong, and the implementation verifies. QE next.

## 1. The correction, first, because it is mine and it corrupts the trace

`20260809T141500Z-orchestrator-decision-865b06ae` carries `at: 2026-08-09T14:15:00Z`. **That is local
time labelled `Z`.** This machine is **UTC+3** (`date -u` reads `11:46:49Z` against `date` reading
`14:46:49+0300`), so the true UTC instant of that note was approximately **`11:15Z`**. I took the
figure off `vitest`'s `Start at 14:10:29` line, which prints local time, instead of running `date -u`
as I had done correctly for my first note.

**Why it matters and is not cosmetic.** `agent-factory/contracts/context-note.md` makes `at` the
authoritative replay sort key — *"never the filename, never `ls`/`readdir` order, and never file
modification time"*. With `14:15:00Z` standing, replay of this task orders the notes:

```
10:32:47Z  orchestrator  gate pass 1 (AMBER)      correct UTC
11:01-11:07Z  ba-pm      the seven corrections     correct UTC
11:39-11:43Z  software-engineer  the implementation   correct UTC
14:15:00Z  orchestrator  gate pass 2 (PASS)       WRONG — 3h ahead
```

— which puts **the note that authorised the pull after the implementation it authorised**. The trace
reads as though work preceded its own gate. That is a causality inversion in the audit record, and it
is the exact failure mode the contract's "never the filename" rule exists to prevent.

**This note supersedes that one to carry the correct instant.** Per the append-only rule the earlier
file stays in `notes/` — it is not edited and not deleted, and its `id` and filename keep the wrong
figure, because rewriting them would be the silent mutation the schema forbids. **Everything else in
that note stands unchanged**: the PASS verdict, the fifteen-count cross-check, the three open items,
and the correction it recorded to my own first note. Only the `at` was wrong.

**The Software Engineer found this, not me.** It flagged the offset in its hand-back and in its claim
record, and it explicitly did **not** shift its own clock to tidy the ordering — its notes carry true
UTC and therefore sort before mine despite being written after. Refusing to fabricate a convenient
timestamp is the right call and it is why this is fixable at all. Recorded as a correction to the
coordinator by a role it coordinates.

**Standing instruction for every later hop on this task: get `at` from `date -u`, never from a test
runner's `Start at` line, which is local.**

## 2. The implementation verifies — checked at the source, not read off the hand-back

**All fifteen `A1`–`A6` counts match the delivered diff**, re-derived by me against the real working
tree — the **fourth** independent derivation (BA/PM's seven candidate builds, my scratch fix, the
engineer's own run, and now this one against what actually shipped). I additionally asserted the
**five scalars** alongside the 128 board bytes on every row, which the earlier derivations reported
only as byte counts:

```
A1/A2 3 · A3 5 · A4 16/16/16/16 · A5 19/17/13/19 · A6 12/7/12/5
castle count 0/0 (generateMoves AND legalMoves) · changed bytes 0 · scalars unchanged — every row
A2 three calls: 3,3,3
over-rejection controls: kiwipete 48 moves / 2 castles STILL OFFERED, and
  r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1 → 26 moves / 2 castles — both pure
```

**Gates re-run by me, not accepted:** `npm test` **337 passed (337) on 15 files**, skip count **0** by
the `AGENTS.md` command. `git diff --name-status main -- src/` shows exactly `M src/moves.ts` and
`A src/moves.castling.test.ts`. `A8`'s "no existing test modified" I checked **mechanically and more
strictly than reported** — iterating every `*.test.ts` that exists on `main` and diffing each: **zero
modified**. `main` is still `aad6d48` and its `src/moves.ts` still hashes `fb4fa40934e768dffeaeed0b43548842`,
the pre-fix value. Nothing merged, nothing deployed.

The structural choice (`rookFrom` in the precomputed `CastleOption` table, guards at the generator
layer) is recorded with three named rejected alternatives, one of which — importing
`CASTLE_ROOK_MOVE` from `apply.ts` — was rejected as a **module cycle**, since `apply.ts` already
imports `moves.ts`. That is a correct call and the reason is verifiable from the import graph.

## 3. What I am NOT treating as closed

- **A fifth mutant survives all twelve criteria at 337/337** — colour-blind `pieceType` guards —
  reported by the engineer rather than buried, with a behaviour-equivalence argument over 9,604 boards
  and zero divergence, because the existing through-check test masks the colour dimension. It proposed
  no criterion for it. **That is QE's to attack, and self-certification by five self-written mutants
  is the weakest evidence in this hop** — `ABC-018`'s QE ran 56 and found six survivors past twelve
  criteria that the engineer's own mutants had not found.
- **`NFR-001` is met but I did not measure it.** Ratio 0.9987 / 0.9974 against ≥ 0.98, floor
  6.08M–6.15M nps, deep lane 32/32 in 36.93 s — all the engineer's figures, the first throughput
  numbers produced on this ticket by anyone. Its own caveat is the important part and it is honest:
  **the instrument's per-cell floor is ~±1%, larger than any signal**, established by reading the
  structurally-zero cells first (`position-3` / `position-6` hold no castling rights, so the two new
  lines execute zero times there — true ratio exactly 1.0000, measured 1.0084 / 0.9918 / 1.0041 /
  0.9989, identity twin up to 1.0126). So **no per-cell number is claimable and kiwipete's 0.9930 is
  not a regression.** Security/NFR re-derives on its own tooling, as it did for `ABC-015` and
  `ABC-018`.
- **The test-integrity checker exited 2** (`cannot read the registry file`) — recorded as an ERROR,
  not a pass, and no registry file was created to make it green. Correct handling; it stays an error.
- **`ABC-022` half (b) is still live by design.** This ticket's fence holds and closes nothing there.
- **Seven defects remain unproven complete**, and one of BA/PM's two named soft spots — a criterion
  set written over signals that agree — **nobody has examined yet**.

## 4. Scheduling

`In Development` 1/3 → 0/3 and `In Review` 0/3 → 1/3 were taken by the Software Engineer, the one
board move it owns; both verified on `plans/board.md`. Queue: `pending/` and `claimed/` both empty,
subtask in `done/`. No stale-claim sweep owed.

Enqueued: `ticket-to-pr-ABC-009-qe` → QE/E2E, Workflow 04 step 5, which owns the `In Review` exit.
Security/NFR follows it, not beside it — `NFR-001` is triggered and the hops stay serial. Width 1 of
`queue.wip_limit` 3; `claim_cap` 2 unspent. Substrate ruling unchanged: hand claim, hand-written
notes, **`finding` inadmissible**, nothing self-stamped.
