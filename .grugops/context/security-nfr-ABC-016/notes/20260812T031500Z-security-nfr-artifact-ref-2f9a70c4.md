---
id: 20260812T031500Z-security-nfr-artifact-ref-2f9a70c4
kind: artifact-ref
by: security-nfr
at: 2026-08-12T03:15:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - EPIC-002
  - NFR-002
  - NFR-008
  - plans/board.md
  - plans/nfr-catalog.md
  - plans/traceability.md
supersedes:
---

# What this gate produced, what it deliberately did not, and the board move it REQUESTS

> **Hand-authored** — see this hop's `decision` note for why. **Nothing here is a `finding`, and the
> gate table below is an OBSERVATION, not a `§14-gate` verdict.** That machinery does not exist in
> this repo; no `§14-gate#<id>` is self-attested and none should be inferred from a green row.

## Branch and files

Worktree `../cli-chess-ABC-016`, branch `grugops/ABC-016-status-panel`, `HEAD` `8e3140f`.

| path | change |
|---|---|
| `plans/nfr-catalog.md` | **`NFR-002`'s `Verified by` cell only** — one appended block recording the status-panel compute as measured and met, the `A13` regime verification, and the discharged `O(window)` grep. **`NFR-001` and `NFR-003`–`NFR-008` asserted BYTE-IDENTICAL by md5 line by line**; 10 table lines before and after; pipe count on the row unchanged at 6; `git diff --numstat` exactly **1 insertion / 1 deletion**. **No target, bar or `UNKNOWN - verify` marker moved**, and the two earlier *"STILL UNMEASURED"* sentences were **left standing** rather than rewritten — appending is this file's convention and rewriting its history is not a gate's to do |
| `plans/traceability.md` | **`ABC-016`'s row only, two cells** — `NFRs` (the IDs reviewed and the gate result) and `Status` (the gate verdict, the four owned risks, the requested move, the rebase note). **All 36 other table lines asserted byte-identical by md5**; pipe count unchanged at 11; 37 table lines before and after; `--numstat` exactly **1 / 1** |
| `.grugops/context/security-nfr-ABC-016/notes/` | 4 hand-authored notes — a `decision`, an `observation`, a `claim`, and this `artifact-ref`. **No `finding`** |
| `.grugops/queue/claimed/security-nfr-ABC-016/` | the Workflow 17 claim, its `claim.md` registry record, and the subtask moved `pending/` → `claimed/` |

**ZERO lines written under `src/`.** `git status --porcelain -- src/` is **empty** and `src/` is
byte-identical to the branch tip I was handed. No test was weakened, edited or deleted.

**The `claimed/` parent directory was ABSENT for the fourth time**, exactly as the brief warned. It
was created first, then the **task directory itself** by a single atomic `mkdir` — which is the
operation the claim consists of. `scripts/claim.js` does not exist here, so Workflow 17 was executed
by hand and that is **disclosed rather than implied**. An `ENOENT` from a missing parent is a genuine
failure under step 2 and never a lost claim; creating the parent first is what keeps that distinction
honest.

## The harness, outside the worktree entirely, and deleted

Session scratchpad only — **never a `probe/` directory at the worktree root**, which the two earlier
hops used and which `npm test` and `biome check .` would have picked up. Four scripts: an `A14`
timing harness importing the worktree's `src/` read-only by absolute path; an instrumented **copy**
of `src/` for the `A13` call counts (every patch asserted to apply exactly once, armed-spy positive
control); a move-type regime probe; and an adversarial escape probe. Plus three out-of-tree trees
for the lane measurement (`git archive` of `main`, of `HEAD`, and a `cmp`-verified twin), with
`node_modules` symlinked. **`git status` read after every stage and is clean of all of it.**

## Gates, run by me in this worktree

| gate | result |
|---|---|
| `npm run lint` | exit **0** (2 pre-existing `biome.json` infos, not this ticket's) |
| `npm run typecheck` | exit **0** |
| `npm run build` | exit **0** |
| `npm test` | **711/711**, **24 files** |
| skip count | **0** |
| `git status --porcelain -- src/` | **empty** |

The Orchestrator's stated baseline (711/711 on 24 files, skip 0) is **reproduced, not inherited**.
Re-run again after the scratchpad integrity event described in the `decision` note: still 711/711.

## Result, in one line each

- **`PASS_WITH_RISKS`. No required fix. No production change asked for.**
- **`NFR-002` part 1 — panel compute `5.665 / 8.171 / 10.049` and `5.723 / 8.196 / 10.027 µs` at
  40 / 120 / 300 plies, worst `0.402x` of the 25 µs bar. MET.** Re-derived on this gate's own
  instrument; neither the Engineer's nor QE's figures were reused, and both are reproduced to within
  **1.7%** — three roles, three harnesses, one number.
- **`NFR-002` part 2 — spread `1.774x` / `1.752x` against 3x. MET.**
- **`NFR-002` part 3, the part that binds — `A13`'s repaired two-term scan clause is TRUE AT EVERY
  REGIME INCLUDING PLY 0**: 14/14 depth×anchor cells, plus **7 move-type regimes the criterion does
  not name**, all hold. Four zero-counts 0 everywhere; `toSan` 1 / 0-on-empty; both `isInCheck`
  halves hold. The two-term sum is **structurally complete** — `grep -c squareAt src/apply.ts` = 0.
- **`NFR-008` total — 1.590–1.615 s wall / 7.690–7.735 s CPU against ≤ 3 s / ≤ 13 s. MET at
  0.53x / 0.59x**, on every individual run and not only at the median.
- **`N8-LANE` — +485 ms gross (sign 8/8), net of the 2-file floor credit **+165 ms** against ≤ 650 ms.
  MET at 0.25x**, admissible on a `cmp`-verified identity null reading −0.57% at 3/8. A first sample
  whose null failed the admissibility floor is **reported, not smoothed**.
- **The `O(window)` obligation this ticket homes to THIS gate is DISCHARGED** — `src/history.ts`
  production runtime importers re-grepped on delivered code: **ZERO**.
- **The security half is TRIGGERED, was RUN, and is CLEAN** — said either way rather than silently.
  No user-supplied string reaches the panel; hostile FENs are rejected by `parseFen`; both
  `GameStatus` string fields pass through closed lookup tables; the panel's whole output alphabet is
  structurally printable ASCII. **`A12` IS asserted on the panel's own rows**, not through
  `assembleFrame` — the trap the ticket warned about is not present.
- **FOUR risks accepted, each with a NAMED OWNER and TRIGGER, none `high`, none blocking.** `D27`
  (owner BA/PM, Engineer to apply) — **and it is bigger than recorded: three sites, not one.**
- **No NFR row needed seeding.** `NFR-002` is the row; the measurement was appended to it.

## The board move I am REQUESTING, not making

**`ABC-016`: `In Security/NFR` → `Ready for UAT`.**

My role owns the `In Security/NFR` exit, and `plans/board.md` is the Orchestrator's alone — not one
byte of it was written here, and this ticket's front matter was not touched either. Read off the
board as it stands: **In Security/NFR 2/2 → 1/2** (releasing the column, which was at its limit),
**Ready for UAT** gains one.

**This was `ABC-016`'s last gate and it merges FIRST of four.** Two things the Orchestrator needs
before it does:

- **A REBASE IS OWED.** `git rev-list --count HEAD..main` was **0** when I started and is **1** now:
  `9fb55db` (`docs(board): grug take the FIRST FAIL in this project…`). Read via `git show main:…` —
  **`main` was never checked out.** `git diff --name-only HEAD...main -- src/ plans/tickets/ABC-016-status-panel.md plans/nfr-catalog.md`
  is **empty**, so it touches no `src/` file, not this ticket and not the row I edited, and **every
  measurement in this hop still describes merged `src/` and the amended criteria.** This is the
  **fourth consecutive hop** to leave this note.
- **The merge order has changed under this ticket and that is the Orchestrator's to weigh, not
  mine.** `ABC-027` took this project's **first FAIL** at `9fb55db`, with its `A1` needing a BA/PM
  re-derivation before the fix can even be built. `ABC-016` does not depend on it and is unaffected —
  but it is now the only unblocked forward motion among the four, which is one of the inputs to
  `R1`'s disposition in the `claim` note.

## NOT written, each for a stated reason

- **`plans/board.md`** — the Orchestrator's. The move is requested above, not taken.
- **`plans/tickets/ABC-016-status-panel.md`** — BA/PM's. **`D27`'s enlargement is FLAGGED in the
  `claim` note and was NOT amended.** No criterion was moved, narrowed or added by this gate.
- **`src/`** — the hard limit. Where code would have to change I would have named the module and the
  reason; **nothing does.**
- **`src/turn-loop.*` and `src/frame.*`** — not touched. `src/frame.ts` was **read** at source
  (`sanitize`, `assembleFrame`) because the security answer rests on what it strips and a gate may
  not take that on trust. **No channel was opened to the `ABC-017` Engineer or the `ABC-027`
  Security/NFR hop**; the on-disk shared context is the only channel and these four notes are all of
  it.
- **`ADR-0009` / `ADR-0010` / `memory-bank/50-decisions/`** — not re-opened. **No constant-frame-width
  criterion proposed**, and none is implied by anything above.
- **`ABC-017`'s, `ABC-019`'s and `ABC-027`'s tickets and worktrees** — untouched. See the integrity
  event in the `decision` note: a script that would have written to `../cli-chess-ABC-017` appeared in
  my scratchpad and **was not run**.
- **Nothing merged, nothing deployed, nothing pushed, `main` never checked out.** The owner's standing
  merge authority is the Orchestrator's to exercise, and it is approval to merge work that PASSED —
  which is what this note reports, not what it performs.
