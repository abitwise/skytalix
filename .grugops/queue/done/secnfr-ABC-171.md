---
subtask: secnfr-ABC-171
role: security-nfr
ticket: ABC-171
page: plans/tickets/ABC-171-the-uci-session-offers-ownbook-and-skill-level.md
branch: grugops/ABC-171 @ 5dee231c (read-only; not committed to)
base: 55a1e223 (main...5dee231c)
ref: .grugops/context/secnfr-ABC-171/
done_at: 2026-10-19T13:22:00Z
result: PASS_WITH_RISKS. No required fix. New LOW accepted risk R-171-1 (N8-LANE OWED, owner Olger Oeselg, needs his word). Carried: R-167-1 (LOW, Security/NFR), AR-NFR004-A (stands), R-167-2 (still open). NFR-004 MET on reading. Triggers (a)-(d) not triggered. Nothing pushed, merged or committed.
---

# Security/NFR ABC-171 (lean)

Config: `asvs_level` L1, `block_on` high, `compliance_regime` []. The notes are hand-authored and unsealed, under
`.grugops/context/secnfr-ABC-171/notes/`. The decision is `…9a89caf5`.

## Rulings
1. **Triggers (a)–(d): not triggered** (`…5a40004e`).
   - Only `src/uci-session.ts` and `src/uci-session.test.ts` are in the diff. No manifest.
   - `clause-b.mjs 55a1e223 5dee231c {1,2,3}` gives 0/0/0 on every limb: "does not fire". Its one word hit is limb 2's
     JSDoc "read once per process" at `:253`, which is prose and which I do not dispute.
   - `book.ts` is `import type` only (`:18`), and the probe is injected. The test spawns nothing. `book.ts`,
     `levels.ts` and `engine.ts` are unchanged.
2. **R-167-1 carry: confirmed** (`…5a40004e`).
   - The grep on the added `src` lines prints one hit, the test's A2 literal `"constructor"`. It prints nothing on
     `src/uci-session.ts`.
   - `LEVELS[skill]` (`:280`) is set only after `Object.hasOwn(LEVELS, value)` (`:336`).
   - R-167-1 stays LOW, owner Security/NFR, and carries to the ABC-174 and ABC-168 gates.
   - INFO: the optional A11 tripwire was not added, and it is not required.
3. **NFR-004: MET on reading** (`…02bc3a0c`). Level 5 lets 4 500 ms leave the session (QE max 4 600 virtual ms),
   against 3 000 under ABC-167. The engine's 5 000 clamp is unchanged.
   - **Clause A:** the default is still level 3 = 3 000. It is the same call, so `AR-NFR004-A` stands as written.
   - **Clause B:** 4 500 is the same `chooseMove` call as the real-clock readings on record (30/30 ≤ 5 s, max
     4 526–4 590, +90 ms first call). No new mechanism reaches the ceiling.
   - Nothing was measured, and the `Verified by` cell does not move.
   - Catalog `:1364` still holds until ABC-174's merge.
   - **At ABC-174 (ADR-0045):**
     - `DEFAULT_LEVEL` moves to 5 = `{ 3 000, 0 }`, and the maximum budget falls back to 3 000.
     - Clause A is the same call at 3 000, reached through `LEVELS[5]`, so it keeps the same number.
     - ABC-087 `A5` reads at 3 000.
     - Levels 3 and 4 move to `createLevel`.
     - The option line reads `default 5` from `DEFAULT_LEVEL`.
   - **The two routed lines:**
     - `AR-NFR004-A`'s "level 3 = `DEFAULT_BUDGET_MS`", which sits at `plans/nfr-catalog.md:10`, `:1340` and `:1362`;
     - `:1364`'s "Levels 4 and 5 (4 000 / 4 500 ms)".
   - **The edit ABC-174's gate owes** is a dated block after `:1364`, headed "`AR-NFR004-A` RE-READ AT `ABC-174`". It
     should say:
     - (i) re-pointed to `LEVELS[5]`, same number;
     - (ii) `:1364` is superseded: levels 4 and 5 are `1 000 / 0.05` and `3 000 / 0`, no budget is above 3 000, and
       the 4 500 ms and +90 ms readings are reachable by no level;
     - (iii) `THE LEVEL LAYER`'s re-read rule now covers levels 3 and 4;
     - (iv) the `Verified by` cell is unmoved.
   - The catalog is not edited here.
4. **D10 book read surface: confirmed** (`…5a40004e`).
   - No path or file name comes from UCI input. `setoption` sets only a boolean and an own-key level.
   - `createBookProbe` catches any `read` throw and warns once, with fixed text. It caps the bytes at 1 MiB and
     re-checks every book move against `legalMoves`.
   - The A9 throw and bad-schema rows each give 3 legal `bestmove`s and one warning. `OwnBook` off reads 0 times.
     118/118 at the tip.
   - INFO: the session relies on the probe's never-throws contract. The GUI-facing `info string` binding is
     ABC-168's (QE-171-e).
5. **NFR-008 N8-LANE: OWED** (`…22a93cd8`).
   - The window ran in the foreground, from 13:13:15Z for 180 s with 181 polls, exit 1. It had foreign processes in
     **181 of 181 polls**:
     - ABC-173's `vitest run --coverage` in `../wt-ABC-173`;
     - the `Projects/public/grugops` vitest;
     - the two `oeselg-labs/platform` workers.
   - load1 was 4.48–7.19. No lane run was started and nothing was estimated.
   - **Merge can carry it as R-171-1 (LOW), on the owner's word, as with R-167-2.** The delta is rows added to an
     existing file: no new lane file, 0 spawns, virtual clock only. The CPU delta is `UNKNOWN - verify`.
   - R-167-2 is still open on the same file. One later quiet-window reading discharges both.

## Required fixes
None.

## Accepted risks
| id | severity | what | owner |
|---|---|---|---|
| R-171-1 | LOW | N8-LANE delta for the ABC-171 rows in `src/uci-session.test.ts` is unmeasured (OWED; no quiet window) | Olger Oeselg (owner word needed to merge on it) |
| R-167-1 | LOW (carried) | Bracket or obfuscated global access evades A11's text guard. No new exposure at this tip | Security/NFR (ABC-174/ABC-168 gates) |
| AR-NFR004-A | (stands) | Clause A ≤ 31 ms abort-granularity miss at 3 000 ms. Same call at the UCI default | Security/NFR |
| R-167-2 | LOW (open) | ABC-167's N8-LANE delta on the same file, still unmeasured | Olger Oeselg |

## Trace row (for the Orchestrator to append; plans/traceability.md not touched)
| ABC-171 | NFR-004, NFR-006, NFR-008 | Security/NFR `secnfr-ABC-171` @ `5dee231c` (base `55a1e223`) | **PASS_WITH_RISKS**: triggers (a)–(d) not triggered; R-167-1 no new exposure; NFR-004 MET on reading (level 5 4 500 ms < 5 000 clamp; `AR-NFR004-A` stands); D10 book surface clean; N8-LANE OWED (R-171-1); no required fix; ABC-174 gate owes the `AR-NFR004-A`/`:1364` re-read | `.grugops/context/secnfr-ABC-171/notes/…9a89caf5` |

## Scratch
- The worktree `../wt-secnfr-ABC-171` was removed with `git worktree remove` and `prune`. Its `node_modules` symlink
  was unlinked first.
- Probes are in `.grugops/context/secnfr-ABC-171/probe/`: `window.mjs`/`window1.out`, `clause-b.out` and `grep.out`.
- I did not touch any of these: `src/`, `plans/board.md`, `plans/traceability.md`, `plans/nfr-catalog.md`,
  `../wt-ABC-171`, `../wt-ABC-173`, or any foreign process.
