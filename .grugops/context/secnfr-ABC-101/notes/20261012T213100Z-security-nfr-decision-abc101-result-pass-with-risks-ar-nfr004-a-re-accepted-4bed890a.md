---
id: 20261012T213100Z-security-nfr-decision-abc101-result-pass-with-risks-ar-nfr004-a-re-accepted-4bed890a
kind: decision
by: security-nfr
task: secnfr-ABC-101
at: 2026-10-12T21:31:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - NFR-004
  - AR-NFR004-A
  - AR-095-L1UNIT
  - ADR-0036
  - ADR-0037
  - QE-101-a
  - QE-101-d
  - SEC-101-a
  - V2.2.1
  - V2.2.2
  - 20261012T213000Z-security-nfr-observation-abc101-readings-input-clause-b-seed-plants-5bf0ee0b
  - 20261012T212000Z-qe-e2e-decision-abc101-verdict-pass-with-gaps-2fa04d14
  - 20261010T130030Z-security-nfr-decision-abc087-pass-with-risks-nfr004-ruled-per-move-played-ar-nfr004-a-reaccepted-clamp-pin-owed-3f1974f5
supersedes:
---

# `ABC-101` at `In Security/NFR`: **PASS_WITH_RISKS**. No required fix. `AR-NFR004-A` stands as written and is re-accepted with its number

This note is hand-authored and unsealed. No `finding` is admissible on this install, so this is a `decision`.
The readings are in `…5bf0ee0b`. Pair `3ea3e352..98ea0a84`, code `ac8deab1`, QE tip `dee6562a`. `security.asvs_level`
L1, `block_on: high`, `compliance_regime` empty.

## Result

| item | reading (`…5bf0ee0b`) | verdict |
|---|---|---|
| Input handling, ASVS `V2.2.1` and `V2.2.2` [L1] | `resolveOptions` stays the only validator, using an exact-equality allowlist. Hostile values: 0 of 36 accepted. Echo: 0 ESC/BEL bytes | **MET** |
| The page's firing threshold | No parse outside `resolveOptions`; no regex, `parseInt` or range | **does not fire** |
| The `Object.hasOwn` forward rule (`secnfr-ABC-087` ruling 7) | All prototype keys and off-set numbers throw `RangeError`; the table is frozen | **MET** |
| Plants | 11 run: 9 red, 2 green (S2b no exposure; S2c fails closed, `SEC-101-a`) | **MET** |
| `ADR-0036` clause (b), limbs 1–3 | All 0. New edges `cli.ts → level-seam.ts` and `level-seam.ts → levels.ts` reach no holder. **Holders at the tip: 4** | **does not fire** |
| `ADR-0036` § S1 Ruling 2, by hand | Holders are `book-file.ts` at both ends (non-empty pathspec); the diff is empty | **does not fire** |
| The seed, `ADR-0037` D3 | The only randomness source added; no input, env or argv reaches it | **MET** |
| `AR-NFR004-A` | Below | **stands; re-accepted** |
| ASVS `V1.3.2` [L1] (no `eval`) / `V1.2.5` [L1] (no OS command) | Limb 3 holders: 0; no spawn, exec or eval added | **MET** |

Other L1 chapters (authentication, session, access control, files, HTTP, crypto) are not touched: the pair is a
command-line flag, a frozen table lookup and a PRNG seed. They are not applicable, not unverified.

## `AR-NFR004-A`: the ruling

**It stands as written at the tip and is re-accepted with its number** (+12 ms max, 24/30 over, ≤ 31 ms bound, Apple
M3 / Node v26.11.0). This is its own discharge route. Its "next reading" trigger, "the `EPIC-006` hop that first routes
a played move through a level", fires here. The ruling is written into `plans/nfr-catalog.md` § `NFR-004` as a
dated, append-only block. No row moves; the nine `NFR-00x` rows hash `6b62892c…6b41` before and after.

- **Level 3 is the old construction by value and by call.** At rate 0, `createLevel`'s draw is always `>= 0`, so every
  move calls `chooseMove(position, { budgetMs: 3 000, now: Date.now })`. `createEngine({ budgetMs: DEFAULT_BUDGET_MS })`
  made the same call, because `chooseMove` defaults `now` to `Date.now` (`src/engine.ts:457`). The only addition is one
  mulberry32 draw per move. **It was not timed, and no number is claimed for it.**
- **Levels 4 and 5 are player-reachable from this ticket.** Clause A ("at default difficulty") does not apply to them.
  **The 5 s ceiling clause needs nothing new.**
  - Neither budget reaches `HARD_CEILING_MS` (4 000 and 4 500 against 5 000).
  - The recorded readings hold, since `src/levels.ts` and `src/engine.ts` are byte-identical in the pair: `ABC-087`
    `A5` reads 30/30 ≤ 5 s, max 4 526–4 590 ms.
  - The ~3 ms ceiling residual covered by `AR-NFR004-A` needs a budget at or above the clamp. No shipped level has
    one, so no player can reach it.
  - The +90 ms first-call reading at 4 500 ms (outside the acceptance) can now be reached at level 5, and it still
    misses no clause.
  - Whether a level-3 move can read it stays `UNKNOWN - verify`. This ticket does not change the default path's first
    call.
- **Levels 1 and 2** blunder within the level's own clamped total (`THE LEVEL LAYER`). The recorded real-clock blunder
  maximum is level 1's 498–589 ms. **Level 2's real-clock blunder time was not read.** Its deadline is 500 ms, and the
  depth-1 sum that can overrun a deadline was recorded at ≤ 589 ms. That is arithmetic over recorded figures, not a
  reading, and it is far from 5 s either way.
- **What would make it a new question:** a `LEVELS` budget at or above `HARD_CEILING_MS`, or a blunder rate on a level
  near it. Either needs a `src/levels.ts` change, which re-arms this read and `THE LEVEL LAYER`'s rule.
- **The real-clock ±20 % forward item** (catalog § `THE LEVEL LAYER`, item 2) asked this hop to "state the budget's
  clock in its own criterion". `A8′` states it: "a seed `s` and an injected clock". The real-clock budget fidelity at
  level 1 is now reachable by a player. No `NFR` row bars it, so no clause is missed.
- **No timing reading was taken.** The brief made it optional and preferred a ruling from code and catalogue numbers.
- **The `NFR-004` `Verified by` cell is not moved,** because nothing was measured.

## Gaps and items for this gate's view

- **`QE-101-a`** (LOW, Software Engineer; the `A8′` row cannot tell apart a seam that rebuilds the level on every move).
  **No security or NFR bearing.**
  - The seed is not a secret, and the level is not a control boundary.
  - Under P11, levels 1 and 2 would blunder on every move or on none. Every blunder move is still clamped to its level's
    total, so `NFR-004`'s per-move ceiling holds either way.
  - It is a product-behaviour defect class, correctly QE's. Not a merge blocker from this gate.
- **`QE-101-d`** (INFO; a repeated `--difficulty` takes the last value). **No security bearing.**
  - Every occurrence is validated against the closed set before it is assigned, so nothing unvalidated can win.
  - There is one validator and one process. It matches `--colour`'s merged last-wins behaviour.
- **`SEC-101-a`** (INFO, this gate; owner Software Engineer; optional, NOT before merge). The suite cannot see a regex
  that opens the set when it carries no string literal (plant S2c, `/m`).
  - The delivered code has no regex, so this is a guard gap for a future regression, not an exposure.
  - The seam's `hasOwn` guard turns S2c into exit 70 with no prototype read, so the second line fails closed.
  - **One-line hardening, if the SE takes it:** add `"3\n"` to `A3`'s `refusedValues`. It would red S2c, and a
    `.trim()` implementation too.
  - Recorded, not required. The firing threshold remains a review rule, and this gate applied it.

## Required fixes

**None.**

## Accepted risks

| id | severity | owner | state |
|---|---|---|---|
| `AR-NFR004-A` | (as recorded) | **Security/NFR** | re-accepted with its number at `ABC-101`; catalog block dated 2026-10-12 |

No new risk is opened.

## Owed by others (none blocks this gate)

- **Orchestrator:** the board move `In Security/NFR` → `Ready for UAT`. This hop is fenced from `plans/board.md`. The
  ticket front matter (`status: backlog`, `P2`) is still stale.
- **The owner:** the UAT word. The waiver does not apply, because there are production lines in `src/cli-options.ts`,
  `src/cli.ts` and `src/level-seam.ts`.
- **Software Engineer:** `QE-101-a`'s third-call row (QE's LOW), and `SEC-101-a` if taken.
- **Architect/Design:** the `AR-095-L1UNIT` fold of Ruling 2 into `clause-b.mjs`, including the empty-holder case as a
  plant that does not fire. Still open; applied by hand here.
