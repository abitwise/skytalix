---
subtask: qe-ABC-177-timing
role: qe-e2e
ticket: ABC-177
branch: grugops/ABC-177 @ f81bf03c (base ff1e375f)
ref: .grugops/context/qe-ABC-177/
width: 1 (nothing else in flight; the Orchestrator holds width 1 until this ends)
---

# QE timing half of ABC-177: A8–A11 (QE-177-g)

`qe-ABC-177` passed A1–A7 and A12, but left A8–A11 OWED: the host was on battery. The owner has now connected the charger. At 00:12 +0300 the host read AC Power, load1 2.2, and no foreign vitest.

## Read first
- `.grugops/queue/done/qe-ABC-177.md`.
- Your timing note `…a4611b8d`.
- The pre-registration and instruments in `.grugops/context/qe-ABC-177/probe/`. They are fixed already; use them as registered.
- The ticket's A8–A11.
- The owner's AC rule `…bfdc97e5`.

## Do
- **A8:** N8-LANE on the one-file set `src/uci-session.test.ts`, with the 400 heap flag. The bar is ≤ 650 ms CPU.
- **A9–A11:** the full-lane base-vs-head twin.
  - Four arms, each in its own tree with its own `npm ci`.
  - Run only in a foreground-verified quiet window: 180 s, no foreign vitest, no `oeselg-labs/platform` process, AC power on every sample, load1 ≤ 8.
  - Record power, load1 and process count per run.
  - NFR-008 is ≤ 10 s. The target is ≤ 9.2 s.
- **Escalation, per the page:** over 9.2 s → an O3 note for Architect/BA/PM; over 10 s → the owner.
- **No admissible window:** if none opens in a reasonable time, or power drops to battery, mark it OWED again. Never estimate.

## Fences
- Scratch trees only, and remove them at the end.
- Do not touch `src/`, `../wt-ABC-177`, `plans/`, or any process you did not start. Keep forks low.
- Do not fix anything. Never push, merge or self-sign.

## Publish
- Notes under `ref:`, including a `kind: decision` that amends the verdict. Use the sanctioned writer if available.
- Append `## Result (timing)` to `.grugops/queue/done/qe-ABC-177-timing.md` (this brief + result) and write `.claim.md`, both uncommitted. Include:
  - the A8–A11 grades and readings;
  - the NFR-008 result;
  - whether R-174-1 is discharged;
  - the updated overall verdict;
  - a trace row.
