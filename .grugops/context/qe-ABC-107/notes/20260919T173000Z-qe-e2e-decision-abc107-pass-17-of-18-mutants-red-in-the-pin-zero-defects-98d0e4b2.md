---
id: 20260919T173000Z-qe-e2e-decision-abc107-pass-17-of-18-mutants-red-in-the-pin-zero-defects-98d0e4b2
kind: decision
by: qe-e2e
at: 2026-09-19T17:30:00Z
verified_by:
confidence: high
refs:
  - ABC-107
  - ADR-0022
  - EPIC-002
  - src/frame.overflow-bound.test.ts
  - src/frame.ts
  - src/move-input.ts
  - plans/tickets/ABC-107-the-message-region-cannot-show-a-seven-candidate-ambiguity.md
  - .grugops/context/ticket-to-pr-ABC-107/notes/20260919T162100Z-software-engineer-claim-abc107-four-gates-green-41-files-1238-tests-0-skips-a5a9178-3d7f9b02.md
supersedes:
---

# `ABC-107` QE verdict: **PASS** — every published gate number reproduced, 17 of 18 mutants red in the pin, the 18th red elsewhere, zero defects, `A1'`–`A5` each answered by a named row

**NOT A STAMP.** `context.human_admission` is `off`, no `finding` is admissible on this install
(`AGENTS.md`); this is QE's hand-authored `decision`. Everything below was RUN at the branch tip
`grugops/qe-ABC-107` (created from `grugops/wave-2026-09-19` @ `fb9a740`, which carries the build
`a5a9178`) in an isolated worktree with the main checkout's `node_modules` symlinked. Load average
during the run: 3.98–8.83 (two sibling dev hops live). **QE added zero tests and changed zero
production lines; `git diff --numstat` against the base shows nothing under `src/`.**

## Gates at the tip — every Software Engineer figure reproduced, none moved

| gate | command | result |
| --- | --- | --- |
| lint | `npm run lint` | exit 0 — `Checked 74 files in 98ms.` |
| typecheck | `npm run typecheck` | exit 0 |
| build | `npm run build` | exit 0 (`tsc --noEmit`) |
| unit | `npx vitest run --dir src` | exit 0 — **41 files / 1238 tests / 0 failed**, 4.01 s |
| skip count | `--reporter=json` → `numPendingTests + numTodoTests` | **0** (pending 0, todo 0, 252 suites) |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |
| pin alone | `npx vitest run src/frame.overflow-bound.test.ts` | 25 / 25, tests 14 ms, duration 171 ms |
| search deep lane | `SEARCH_DEEP=1 npx vitest run src/search.test.ts` | 41 / 41, 25.28 s (`AGENTS.md` owes it at the QE hop; `src/search.ts` unchanged) |

## Mutation result — the pin reds under every mutant the subtask named

18 mutants, each an exact-string edit asserted to match once, each reverted by `git checkout --`
with `git status --porcelain -- src` asserted EMPTY afterwards (raw rows in the sibling
`observation`). **Every mutant the subtask named reds the pin:**

- (a) `MESSAGE_ROWS` 2→1: **9 red**; 2→3: **9 red** (the Engineer's 7-of-25 at `= 3` was under a
  different tree — see the ledger; both counts are honest for their tree).
- (b) `markerFor` reporting N+1 / N−1: **3 red each** (the three `hides exactly N` rows); marker
  suppressed entirely: **6 red**.
- (c) the ambiguity list truncated in `src/move-input.ts` to 5: **7 red**; to 6: **9 red** — the
  exact failure `ABC-033` `A4` names is caught.
- (d) a candidate dropped from the resolver (every move from b3 filtered out of `legal`): **10
  red**, including all three knight reachability rows; the last candidate dropped from every
  ambiguity: **6 red**.
- Beyond the minimum: W+1 **6 red**, W+4 **9 red**, W−1 / W−4 / W−6 **6 red**, W−7 **9 red**,
  separator removed **9 red**, one extra frame row **5 red** (incl. the `A2` reference row).
- **The one survivor, `M7` (marker moved from the last row to row 0): NONE in the pin — killed
  by `src/frame.test.ts` (2 rows) in the whole lane.** Not a defect: the pin asserts no row
  width by the ticket's own fence (test note 2), and the row-width invariant is `frame.test.ts`'s.

## Criteria — each answered by a row whose full name carries the criterion id

- **`A1'`** — `describe("ABC-107 A1' / A3 / A5 …")` rows `hides exactly 0/2/3 of 6/7/8` (and 3 of
  8 queens) and `shows the marker exactly when something is hidden`; `describe("ABC-107 A1' — every
  candidate stays reachable…")` resolves full-origin SAN AND coordinate form for every candidate,
  `from`/`to` by value — 6/6, 7/7, 8/8, 8/8. **MET.**
- **`A2`** — `describe("ABC-107 A2 …")`: the two-candidate reference equals `frameHeight(…)` = 23
  and every fixture's frame equals it. Option 4 introduces no paging state, so "every state" is
  the one state. **MET.**
- **`A3`** — the six-knight `shows every candidate in full` row (full name carries `A3` via its
  describe) plus `hides exactly 0 of 6`. **MET.**
- **`A4`** — measured from git by QE: `git diff --name-only a5a9178~1 a5a9178 | grep -v
  '\.test\.ts$' | grep '^src/'` → EMPTY; numstat `202 0 src/frame.overflow-bound.test.ts` only.
  Not a test row by nature. **MET.**
- **`A5`** — the 6/7/8-knight fixtures are named `describe` blocks; the tripwire reds at ±1 row,
  ±1 column and a removed separator (ledger). **MET.**

## Sentence audit — no false sentence that changes a verdict; three imprecisions recorded

In the sibling `observation`: (i) "exactly as `src/move-input.test.ts` reads it" — that file only
asserts the marker's ABSENCE; the regex parse of N is closer to `src/frame.test.ts:418`;
(ii) "up to SIX same-square SAN items" holds for the 4–5-character items the fixtures render;
`ADR-0022`'s own geometry table shows 7-character items fit four — the "six" is the bound for
this rendering, not for every SAN length; (iii) "this file is the only thing that holds it in
place" is true of the 7→2 / 8→3 tripwire; the six-fits half is also pinned by
`src/frame.test.ts:376` and `src/move-input.test.ts` `A4`. All three are wording; none is a defect.

## Gaps (none blocking)

- **G1 LOW** — the pin does not assert row width, so a marker mis-placed onto row 0 (`M7`) reads
  green here; `src/frame.test.ts` holds that line. Fenced by test note 2; recorded so nobody
  reads the pin as a width guard.
- **G2 INFO** — requirement-side headroom is SIX columns, not one: the six-knight `= 0` row stays
  green from W−1 through W−6 and reds at W−7. The ticket's "one column of headroom" (test note 4)
  was `ABC-033`'s six-QUEEN case with different minimal SAN. The tripwire side is one-column
  sensitive both ways (seven knights fit at W+1; hidden moves at W−1).
- **G3 INFO** — the eight-knight fixture is the least sensitive of the four to a wider frame
  (hidden 3 at W+1, 0 at W+2); seven knights and eight queens carry the ±1 sensitivity.
- **`NFR-008` NOT RULED here** (subtask fence); the Engineer's over-15 s readings were under
  sibling load and stay handed up.

**Recommendation: `ABC-107` MAY LEAVE `In Review`.** Zero production lines measured from git, so
the 2026-08-17 UAT waiver applies once the Orchestrator applies it — a waiver is not a signature.
Not merged, not deployed; `plans/board.md` untouched (fenced).
