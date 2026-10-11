---
id: 20261011T091155Z-qe-e2e-decision-abc114-verdict-a32a9616
kind: decision
by: qe-e2e
role: qe-e2e
task: qe-ABC-114
at: 2026-10-11T09:11:55Z
verified_by:
confidence: high
refs:
  - ABC-114
  - ABC-113
  - ABC-043
  - ABC-044
  - EPIC-006
  - src/cli.test.ts
  - src/result-screen.test.ts
  - 20261011T091155Z-qe-e2e-observation-abc114-readings-94a87a28
  - 20261011T091155Z-qe-e2e-decision-abc114-control-and-a4-strike-5d58ace9
  - 20261011T091155Z-qe-e2e-observation-abc114-gap-register-168698b8
  - 20261011T084936Z-software-engineer-observation-abc114-readings-a1-a6-5b2e8c41
  - 20261011T084936Z-software-engineer-decision-abc114-a4-strike-and-the-control-7d1f3a90
supersedes:
---

# QE `ABC-114`: FAIL. One new false sentence in `A1`'s block. `A2`–`A7` MET

This note is hand-authored and unsealed. AGENTS.md says no `finding` is admissible on this install.

| item | value |
|---|---|
| subtask | `qe-ABC-114` (A7's validator) |
| branch | `grugops/ABC-114-instrument-comments`, reviewed at `8895a9a0` (code `67296100`, base `7411f73a`) |
| author of the sentences | Software Engineer (Claude Opus 5.5, a separate dispatch) |
| validator | QE/E2E (Claude Opus 5.5, this dispatch). Same model, different agent and role. Every number below is from my own runs (`…94a87a28`) |

## Verdict: **FAIL** (gate result `BLOCKED_NEEDS_FIX`)

One replacement sentence in `S1`'s block is false on measurement (`QE-114-a`): *"This row is placed
BEFORE the other two, so on any decoy it is the row that speaks first."* The initializer row comes
before it. On a `tsc`-clean decoy that reds both, the initializer speaks. That is the recursion the
ticket's `## Risks` names. The ticket exists to remove false narration, so a new false sentence
cannot pass. The fix is comment-only and small. It goes back to the Software Engineer, and **this hop
does not author it** (`A7`).

## Per criterion

| | verdict | basis (my runs) |
|---|---|---|
| `A1` | **NOT MET** | The D3/M9 distinction is right. `M9`: tip 1/66 on the count row; control and ablation red the shorthand row. `D3`: tip red, control and ablation `A1` green. `tsc` clean, porcelain empty. But the block also states an order that the source contradicts (`QE-114-a`) |
| `A2` | MET (gaps `QE-114-b` LOW, `QE-114-c` MEDIUM) | `D4`: `tsc` 0, tip 67/67, `main:` 67/67, control `A1` green, full lane 1680/1680. Names the four forms and quotes the regex as the criterion requires. Page `:64` narrowed. On measurement, `for…in` and `catch` are closed by `tsc` |
| `A3` | MET | `M15`: `tsc` 0. Tip lane 1 / 1679, and the one red is the retargeted headline row. Control `cc037b3e^` 1680/1680. Agrees with the `ABC-113` QE note. The comment and page `:106` say exactly this |
| `A4` | MET (STRIKE) | `G03` played the move in 13/13 runs (white ×6, black ×4, pipe ×3), so RE-MEASURE could not be earned. The kept figures reproduce. The `process.stdin` scope is measured correctly. The reason is written beside the change |
| `A5` | MET | name-only gives exactly the two test files. Non-test numstat is empty. 0 non-`//` lines added or removed. `it(` counts are unchanged |
| `A6` | MET | 53 / 1680 / 0 at the base files and at the tip, both green |
| `A7` | MET by this hop | The author is named in `## Delivery`. I re-planted `M9`, `D3`, `D4`, `M15` and `G03` myself, and added `ORD`, the ablation and the binder-form probes. No `A1`–`A4` number here is quoted from the SE. Porcelain was empty after each revert and at exit |

Gates at the tip: lint 0, typecheck 0, build 0, `npm test` 53/1680, skip-integrity exit 0 at 0
skips, host-protection `UNKNOWN - verify` (exit 2). Production lines: 0, so a UAT waiver applies at
`Done` on this reading. QE is still owed after the fix.

## Rulings (`…5d58ace9`)

- **Control:** valid, read per row. The ablation is the cleaner `A1` control. `cc037b3e^` is exactly
  right for `A3`.
- **`A4` STRIKE:** right. The precise scope is Node's `process.stdin`, which the comment already says.
  "In Node" as a blanket is too broad, and "for any program" is false.
- **Re-size:** the trigger fired, so `S` → `XS`, for BA/PM to record. **`P1` trigger met** on
  `QE-114-a`, for BA/PM to rule.

## Exit

- **Recommendation:** `In Review` → back to `In Development` for `QE-114-a` (plus `-b`). Then a
  fresh QE hop re-reads `A1` only. That hop re-plants `M9`, `D3` and `ORD`. It does not quote this note.
- I did not touch `plans/board.md`, the ticket front matter or production `src/`. I have not merged
  or pushed.
