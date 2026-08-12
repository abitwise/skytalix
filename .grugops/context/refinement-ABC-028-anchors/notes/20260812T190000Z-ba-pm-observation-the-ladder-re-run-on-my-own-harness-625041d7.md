---
id: 20260812T190000Z-ba-pm-observation-the-ladder-re-run-on-my-own-harness-625041d7
kind: observation
by: ba-pm
at: 2026-08-12T19:00:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A5
  - RISK-ABC017-01
  - RISK-ABC028-02
  - RISK-ABC028-03
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# I re-ran the ladder rather than transcribing it, and every cell reproduces — including the one that changes what the ticket may claim

> **Hand-authored, and disclosed rather than hidden.** `scripts/context-io.ts` does **not exist** in
> this repository — there is no `scripts/` directory, checked at source — and
> `mcp__grugops__propose_note` is not in this session's tools. `context.human_admission` is `off` and
> **no `§14-gate` verdict record exists under this task**, so **nothing on this hop is a `finding`.**
> `confidence: high` refers to the measurements, every one of which was RUN. There is no derived
> `index.md` / `index.jsonl`: the tool that renders them does not exist and none was hand-faked.
> `scripts/claim.js` does not exist either; the Workflow 17 claim was made by hand with `mkdir`.

**Machine, once, for every figure in this hop's notes:** Apple M3 (`Mac15,13`), 8 cores, macOS 26.5.2,
node `v24.12.0`, vitest `3.2.7`, biome `2.5.5`. `UNKNOWN - verify` on any other.

## Why a BA/PM ran a test harness at all

`## Test notes` 4 on this ticket says *"re-measure before writing an expected value"*, and this hop
writes numbers into the ticket — into `RISK-ABC028-03`'s status, into a closure ledger, into a
discharged criterion. **A number I inherit and publish is a number I have asserted.** The previous
brief to this role fenced `src/` wholesale and cost it every re-measurement; that fence was corrected
to *read `src/` freely, write nothing there*, and this is what the correction bought.

## The instrument, built from the ticket's own definitions rather than from another hop's harness

One generator parameterised on the axis itself — **`TAIL` = how many trailing move IDENTITIES join
`moves.length` in the cache key** — so `WCACHE-LEN`, `WCACHE-LAST`, `WCACHE-LAST2` and `WCACHE-LAST3`
are **the same code at 0, 1, 2 and 3** and cannot differ by a transcription slip. It **pins by md5**
this tip's `src/history-pane.ts` (`c4653c4c…`), `src/history-pane.test.ts` (`9533f050…`) and
`src/history-pane.nfr.test.ts` (`1d33bea6…`) and **throws rather than measuring the wrong tree**. The
replica is a full copy of `src/` in this session's scratchpad with this worktree's own `node_modules`
symlinked. **No other worktree was reached into, and nothing under `src/` was written.**

Configuration (b) — *"the nfr fixtures rebuilt per test"* — is a second parameterised transform: the
`AT_*` module-scope fixtures at `:124`+ **and the `LONG_GAMES` table that captures them** become `let`
bindings reassigned in a `beforeEach`. The table matters: rebuilding the eight fixtures without
rebuilding the table would have left `A11`'s two count assertions reading the original objects and
would have produced a **false** result.

## The kill matrix — every cell run at this hop

```
build            key                    full suite     history-pane.test.ts ALONE   nfr fixtures
                                        (26 files)     (the OWNED lane)             rebuilt per test
delivered pane   —                      752 passed     26 passed                    752 passed
WCACHE-LEN       length                 5 failed/752   3 failed/26  A1, A5r1, A5r2  3 failed/752
WCACHE-LAST      length + last 1        4 failed/752   2 failed/26  A5r1, A5r2      2 failed/752
WCACHE-LAST2     length + last 2        3 failed/752   1 failed/26  A5r2 ONLY       1 failed/752
WCACHE-LAST3     length + last 3        2 failed/752   26 PASSED — NOTHING          752 PASSED
                                        A11 x2 ONLY    no owned guard               THE GUARD IS GONE
```

**The bottom-right cell is the finding of the hop and it is a `752 PASSED` where a guard used to be.**
At `TAIL = 3` the only two assertions in the whole project that catch the build are the `A11` `toSan`
call counts in `src/history-pane.nfr.test.ts` — and they catch it **by accident**, through shared
fixtures, in a file that owns a different property. Rebuild those fixtures and the project cannot see
the build at all.

## Controls, so this reports rather than merely agrees with the hop I inherited it from

- **The ladder is its own calibration.** In the owned lane it reads **3 / 2 / 1 / 0** at `TAIL`
  0/1/2/3. An instrument blind to caches would read `26 passed` at every rung; one that saw everything
  would kill at every rung. It does neither.
- **Null control 1** — the untouched replica: **752 / 752 on 26 files.** It is this tree.
- **Null control 2** — the delivered pane **with** the fixtures rebuilt per test: **752 / 752.** The
  transform breaks nothing, so a green in configuration (b) is the build's and not the transform's.
- **The worktree itself, not the replica:** `npm run lint` exit **0** (2 pre-existing `biome.json`
  infos), `npm run typecheck` clean, `npm test` **752 / 752 on 26 files**, skip **0** by
  `vitest --reporter=json | jq '.numPendingTests + .numTodoTests'`.

## What reproduces, and what is NEW here

**Reproduces exactly:** the `a5-comment` hop's `TAIL = 3` cells and its 3/2/1/0 ladder, and the `a5`
hop's `WCACHE-LAST2` prediction (survives row 1, dies at row 2).

**New at this hop, and it is the half that says what the ticket MAY claim:** the configuration-(b)
column at `TAIL` **1 and 2** — `2 failed / 752` and `1 failed / 752`, **every kill in
`src/history-pane.test.ts`.** Nobody had run those. They are the positive statement the ledger needed:
for the three keys `A1` and `A5` own, **the rebuild really is free** — the guard is no longer an
accident in another file. The ledger is only credible because both halves were measured.
