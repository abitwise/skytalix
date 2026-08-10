---
id: 20260810T213554Z-architect-design-observation-1a02e27d
kind: observation
by: architect-design
at: 2026-08-10T21:35:54Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-018
  - src/frame.ts
  - src/frame.test.ts
  - src/render.ts
  - NFR-002
supersedes:
---

# Five measurements against merged `src/`, before the ruling

Recorded as `observation` and **not** as `finding`: every item below is a direct read or a direct run
against merged `src/`, but this hop holds no `§14-gate#<id>` stamp and no `human:<name>` grant, so a
`finding` would be refused and faking one is what admission exists to stop.

Grounded in `20260810T212028Z-orchestrator-observation-fef2e679` and
`20260810T212028Z-orchestrator-decision-ac72dd8d` (task `frame-merge-order-2026-08-11`), both read
first. The Orchestrator's two facts are **confirmed**, not re-derived: `ABC-018` is merged,
`STATUS_ROWS` / `HISTORY_ROWS` exist nowhere in merged `src/`, and the `A1` edge it describes is real
as the ticket words it.

## 1. The composition identity is ALREADY ASSERTED IN MERGED CODE, and it is a tautology

`src/frame.test.ts:632-638`, test named *"derives H from the panels' constant heights — no 23 anywhere
in the module"*:

```
expect(frameHeight({ board: BOARD_ROWS, status: STATUS_ROWS, history: HISTORY_ROWS })).toBe(23);
```

All three of those names are **local shadow constants declared in that test file** at `:38-43` —
`STATUS_ROWS = 3`, `HISTORY_ROWS = 8`, `BOARD_ROWS = 9` — each commented as the absent ticket's
*"stated constant"*. So `ABC-016`'s `A11` and `ABC-017`'s `A1` each propose to add a **third and fourth
copy** of an assertion that is already green, and the merged copy can prove nothing about any panel.

## 2. The arithmetic in both tickets is correct — re-run, not trusted

`renderBoard` returns **9 rows of 18 characters**. `MESSAGE_ROWS` 2 + `PROMPT_ROWS` 1 = the 3 rows
`frame.ts` owns. `frameHeight({9,3,8})` = **23**. Status sweep at `board: 9, history: 8` →
**21/22/23/24/25/27** for `N` = 1/2/3/4/5/7. History sweep at `board: 9, status: 3` → **22/23/24/25**
for 7/8/9/10.

"Fits" was checked through the merged code that decides it rather than by arithmetic: on a 24-row TTY
`beginFrameSession` takes the **in-place** path at `H` = 23 and 24 and the **append** path at `H` = 25.
So epic acceptance `4b` becomes unreachable at `H` ≥ 25, exactly as `ABC-016`'s `D8` says.

## 3. Six row-count mutants against the four assertion forms — the measurement that decides it

Each form as its ticket words it, run against merged `frameHeight`; `4b` is `beginFrameSession`'s own
strategy choice on a 24-row TTY:

| mutant | `A11` | `A1` | merged shadow | fit `=23` | fit `<=24` | H | `4b` |
|---|---|---|---|---|---|---|---|
| delivered as budgeted 9/3/8 | PASS | PASS | PASS | PASS | PASS | 23 | yes |
| M1 status ships 4 | **FAIL** | **FAIL** | PASS | **FAIL** | PASS | 24 | yes |
| M2 history ships 9 | PASS | **FAIL** | PASS | **FAIL** | PASS | 24 | yes |
| M3 history ships 10 | PASS | **FAIL** | PASS | **FAIL** | **FAIL** | 25 | **no** |
| M4 `renderBoard` ships 10 | PASS | PASS | PASS | **FAIL** | PASS | 24 | yes |
| M5 board 10 + history 9 | PASS | **FAIL** | PASS | **FAIL** | **FAIL** | 25 | **no** |

- **The merged shadow assertion passes all six.**
- **`ABC-016`'s `A11` passes M3 and M5 — the only two mutants that make `4b` unreachable.** `A11` was
  added by `D8` to protect `4b`; as written it cannot fail on the two cases that break it, because it
  hardcodes the term (`history`) that moves in both.
- **`A1` is blind to M4**, because it hardcodes `board: 9`. Paying the import edge buys two terms of
  three.

## 4. `src/render.ts` exports no row-count constant

The board's 9 rows are the **length of `renderBoard`'s return value** (8 rank rows + 1 file-label row,
`:122-149`). So `board: 9` is a bare literal in three places today: the shadow at
`src/frame.test.ts:43`, `A11`, and `A1`. Reading `renderBoard(...).length` instead is the only form
that fails M4.

## 5. The cross-ticket coupling is exactly ONE clause in each ticket, enumerated

`STATUS_ROWS` occurs twice in `ABC-017`: prose at line 84 (*"as `ABC-016` exports `STATUS_ROWS`"*, no
import implied) and as a symbol to evaluate in `A1` at line 151. `history: 8` occurs twice in
`ABC-016`: the `N`-sweep prose at line 77 and `A11` at line 348. **Strike the two criterion clauses and
the coupling is zero** — in production and in test.

## What the edge would cost, mechanically

`tsconfig.json` includes `src/**/*.ts`; `npm run typecheck` is project-wide `tsc --noEmit` (there is no
single-file mode, per `AGENTS.md`); `typecheck` is in `quality.mandatory_gates` with
`gate_enforcement: blocking`. A real `STATUS_ROWS` import in `ABC-017`'s test file therefore couples
**the whole project's blocking typecheck gate** to `ABC-016` having landed first — not merely one red
test file.

## Two incidental observations, neither a defect, neither acted on

- **A hole in a merged suite is named:** `src/frame.test.ts:632-638` passes on all six mutants.
  `src/frame.ts` itself is correct and was not touched; this is a suite hole, not a production defect.
- **`src/` carried three untracked files mid-hop — `_wb019.ts`, `_wb019.test.ts`, `_wb019types.ts` —
  and they were NOT mine.** Their own headers declared them the concurrent `refinement-ABC-019` hop's
  throwaway wrong-build harness, *"deleted before the hop ends; `src/` must be byte-identical
  afterwards"*. Left entirely alone and **deliberately not committed**. **By the end of this hop that
  other hop had removed them and kept its promise** — verified rather than assumed at commit time:
  **all 37 tracked `src/` files hash identical to `HEAD` and `src/` holds zero untracked files.** So
  `src/` is byte-identical, this hop wrote **zero production lines**, and the per-ticket `src/`
  byte-identity check this project relies on is intact. Recorded because a broad `git add` during the
  overlap window would have committed another role's declared throwaway into the tree.
