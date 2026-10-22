---
id: 20261022T200322Z-qe-e2e-decision-b8aa74fb
kind: decision
by: qe-e2e
at: 2026-10-22T20:03:22Z
verified_by: 
confidence: high
refs:
  - ABC-200
  - EPIC-006
  - d062d60e
  - 0a07df04
  - 1efd2cee
  - bd745ac9
  - be70482f
  - 4c014a53
  - d55fed25
  - QE-200-a
  - QE-200-b
  - QE-200-c
  - QE-200-d
  - QE-200-e
  - QE-200-f
  - QE-200-g
  - 20261022T193009Z-software-engineer-observation-f274160a
  - 20261022T193009Z-software-engineer-observation-3ccb839a
  - 20261022T193034Z-software-engineer-decision-11628f2f
  - 20261022T200253Z-qe-e2e-observation-0bce441b
  - 20261022T200253Z-qe-e2e-observation-7d19b107
  - 20261022T200253Z-qe-e2e-observation-97b2d4d9
  - 20261022T200253Z-qe-e2e-observation-9c82cf61
  - 20261022T200253Z-qe-e2e-observation-843719f4
supersedes: 
seal: sha256:b35310258edb572c3b2f04fd442f5f0b3192c7a8fb299fd04a190937b54be172
---

# ABC-200 QE verdict: PASS_WITH_GAPS. A1–A9 met on QE's own runs, including A8 on a real pty; P1–P6 red; gaps QE-200-a (LOW) and -b to -g (INFO), none blocking. Signs UAT

QE/E2E, task `qe-ABC-200`, 2026-10-22. Branch `grugops/qe-ABC-200`; merge `d062d60e` (tip `0a07df04`, code `1efd2cee`, plus `main` `be70482f`). Base `bd745ac9`. Readings: `…0bce441b` (criteria and plants), `…7d19b107` (gates), `…97b2d4d9` (the A8 reading), `…9c82cf61` (A8 raw transcripts), `…843719f4` (gaps). The verdict was written to scratch at 19:59:53Z, before the SE's notes were opened.

## Verdict
**PASS_WITH_GAPS.** No gap blocks.
- **UAT:** under the owner delegation (`…5aaf7cec`), this verdict signs UAT. Production lines changed, so UAT is not waived. The A8 reading is written for a human reader (`…97b2d4d9`).
- **Board:** QE releases `In Review`. Security/NFR is already recorded on `main` (`d55fed25`, PASS_WITH_RISKS, `N8-LANE` owed after ABC-178), so the next move is the Orchestrator's. `plans/` is fenced for this hop.

## A rows
- **A1 MET.** In memory; on the pty (case 1, the engine moved first as White); level 1 by an instrumented probe. The entry half is held by text only (`QE-200-a`).
- **A2 MET.**
- **A3 MET**, in memory and on the pty (6, 6b, 6c).
- **A4 MET.** On the pty, the ESC is dropped from the program's echo. The 1 025-character line is in memory only (`QE-200-c`).
- **A5 MET**, including Ctrl-D on the real pty: exit 0, no frame, no stack trace.
- **A6 MET.** `cli.test.ts` and `cli.real-engine.test.ts` have 0 edited lines and are green. Pipe output is byte-identical to base on two deterministic inputs.
- **A7 MET**, in memory and by a real paste.
- **A8 MET**, all eight cases (`…97b2d4d9`).
- **A9 MET.** A real-run probe read the book once, after the answers (`QE-200-b`).

## Ruling on the SE's deviation (`…11628f2f` decision 2)
**Accepted, with no change asked.** An empty answer returns `options.colour` / `options.difficulty` instead of importing `DEFAULT_DIFFICULTY` by name.
- **Behaviour is identical.** A question is asked only when its flag is absent (`absent.colour` / `absent.difficulty`). Those flags turn false on exactly the branches that assign `colour` and `difficulty`, so when a question is asked, `resolveOptions` has left the initial values in place: `WHITE`, which is not `RANDOM`, so no coin; and `DEFAULT_DIFFICULTY`. The empty answer therefore yields `white` and `5`, exactly.
- **The readings agree.** A2's rows are green; P2 (difficulty) and P2c (colour) each red A2. On the pty, two empty answers gave White, and the probe gave level 5.
- **In line with the ruling.** The ruling's operative words are "never re-spelled". This spells neither default at all and keeps one source of truth (`resolveOptions`). The letter "imported" is not met; that is a difference in form only.

## SE comparison (opened after the verdict)
- `…f274160a`, `…3ccb839a` and `…11628f2f` agree on every shared number:
  - 61 / 2 017, and base 60 / 1 995. The SE's base figure is by arithmetic; QE ran base for real and found the same.
  - `line-input.test.ts` stays at 30 rows.
  - CLI_DEEP 11, UCI_DEEP 5, PERFT_DEEP 32, INPUT_DEEP 34.
  - P1 reds A6 ×4, and P2 to P6 red the rows they name.
- The SE's P2 is QE's P2c. QE added P2 (difficulty), Q2o, Q2i, Q3 and Q4, all red, plus two probes that stayed green: Q1b and P5b, now `QE-200-a` and `QE-200-b`.
- The SE left "Ctrl-D exits promptly on a real TTY" as `UNKNOWN - verify`. Now read: it exited, with no further input, at both questions. That is not a time.

## Not claimed
No timing, no `NFR-008` and no `N8-LANE` reading.

## Addendum (same hop)
`main` moved `be70482f` → `4c014a53` during this hop. The move is records only (Security/NFR for ABC-200), with nothing under `src/`, `tools/` or `package*`, so the readings at `d062d60e` stand.
