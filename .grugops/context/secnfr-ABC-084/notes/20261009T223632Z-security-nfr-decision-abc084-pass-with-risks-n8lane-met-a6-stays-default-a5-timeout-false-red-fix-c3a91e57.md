---
id: 20261009T223632Z-security-nfr-decision-abc084-pass-with-risks-n8lane-met-a6-stays-default-a5-timeout-false-red-fix-c3a91e57
kind: decision
by: security-nfr
at: 2026-10-09T22:36:32Z
verified_by:
confidence: high
refs:
  - ABC-084
  - RISK-003
  - N8-LANE
  - NFR-008
  - ADR-0019
  - ADR-0027
  - src/puzzle-suite.test.ts
  - src/puzzle-corpus.ts
  - plans/nfr-catalog.md
  - plans/tickets/ABC-084-tactical-puzzle-suite-strength-regression-gate.md
  - .grugops/context/secnfr-ABC-084/notes/20261009T214450Z-security-nfr-observation-abc084-security-surface-none-static-data-fixed-path-env-gated-lanes-5e1c0a84.md
  - .grugops/context/secnfr-ABC-084/notes/20261009T223620Z-security-nfr-observation-abc084-n8lane-met-85-210ms-net-a6-oracle-195ms-a5-false-red-under-load-7f3b2d61.md
  - .grugops/context/ticket-to-pr-ABC-084/notes/20261009T213713Z-software-engineer-observation-abc084-gates-criteria-baseline-n8lane-26f28829.md
  - .grugops/context/wave-2026-09-25/notes/20261009T205550Z-orchestrator-decision-b61e0d35.md
supersedes:
---

# `ABC-084` Security/NFR: **PASS_WITH_RISKS**. `N8-LANE` is MET at **+85 / +210 ms net**, and the `A6` oracle row **stays in the default lane**. There is no security surface. One MEDIUM fix: the gate row's 60 s timeout produces a **false red under load**

Hand-authored and unsealed: a `decision`, not a stamp (`human_admission` is `off`; there is no
sanctioned writer). Reviewed: `7b54dae..e426e91 -- src` on `grugops/ABC-084-puzzle-suite`.
Settings: `security.asvs_level` L1, `block_on` high, `compliance_regime` `[]`.

## Result

**PASS_WITH_RISKS.**
- Nothing is at or above `high`, so nothing blocks.
- One MEDIUM required fix, `F1`, is recommended before merge. If it is not taken, the risk below
  needs the owner's word: this gate does not accept it.
- Board moves are the Orchestrator's.

## Gate re-checked at `e426e91`

- `npm run lint`: 97 files, no fixes.
- `npm run typecheck`: exit 0.
- The default lane ran **green 116 times** on an out-of-tree copy of the tip: 50 files / 1539
  tests, 0 harness errors.
- Gate order, skip integrity and the host check are the build's and QE's; they were not re-run
  here.

## Items

| # | item | reading (load1) | severity | disposition |
|---|---|---|---|---|
| 1 | **`N8-LANE` (≤ 650 ms net)** | **+85 ms** (session 1: null +0.62 %, load1 median 7.4) and **+210 ms** (session 3: null +1.42 %, load1 median 7.5). Session 2 is **inadmissible** (null +1.64 %) and not used. A supplement run one file at a time resolves the content: **+280 ms**, 12/12 | — | **MET.** 85 and 210 ms measured against 650. Under the 2026-08-19 wording, this says nothing about the `NFR-008` total (item 5) |
| 2 | **The named remedy: the `A6` oracle row into `PUZZLE_DEEP`** | It would save about **195 ms** (12/12). On the lane instrument it cannot be separated from zero | — | **NOT REQUIRED, and not recommended.** `A6` would lose the default lane's only rules-only proof that the mate keys are exactly the mating moves. That loss would be silent: an over-broad accepted set loosens `A1`, and the corpus file is not on option B's trigger list (`…7f3b2d61`) |
| 3 | **`A5` (≤ 60 s)** | **12.46 / 12.71 s** at load1 ≈ 7. **48.94 s** at 36–49. **79.40 s** at 49–54. `A3`: 49.26 s at 54–61 | — | **MET at the recorded conditions**, with a 4.7x margin. The breach at load1 ≈ 50 is a property of the machine, recorded and not ruled a failure, because `A5` is sized and recorded with its load (`A5`, `A7`) |
| 4 | **`F1`: the gate row's 60 s timeout turns load into a red** | At load1 49–54 the gate row failed on *"Test timed out in 60000ms"* with **40/40 solved**. `A1` and `A2` passed on the same run | **MEDIUM**: the strength gate's reliability. Under option B, *"red = QE FAIL"*, so an unchanged engine fails QE on a busy machine. A gate that cries wolf teaches people to dismiss its real reds. This is not an ASVS item; it is a reliability NFR | **Required fix, non-blocking under `block_on: high`** (below) |
| 5 | `NFR-008` total (second order) | Base lane 24.9–26.0 s CPU and 6.5–7.2 s wall, on Node v26.11.0 (`UNKNOWN - verify` against the reference v24.12.0). This ticket adds +0.25–0.37 s gross | info | Reported, not ruled. It stays with Architect/Design (`ADR-0019`), as the `ABC-082` gate flagged (`…cd2e14c1`) |
| 6 | **Security (ASVS L1)** | Static data and a test runner. One fixed-path read of a checked-in JSON file. Literal dynamic import. The `vi.doMock` exists only under `PUZZLE_DEEP=weakened`. No production importer, no dependency change, no spawn, no network (`…5e1c0a84`) | — | **No finding.** The page's "not triggered" is confirmed |

## `F1`: the fix, sized

**Owner:** Software Engineer. **File:** test code only. **Size:** about 3 lines in
`src/puzzle-suite.test.ts`. No `src/` production line.

1. **Change the 60 s timeout to a hang guard.** On the gate row and on the `A3` row, raise
   `60_000` to a value no load seen here reaches. `300_000` is `src/engine.test.ts`'s precedent.
2. **Rename the gate row so it no longer claims `"in <= 60 s (A5)"`.** The row asserts the solved
   count only.
3. **Leave `A5` as a reading, which is what the page asks for.** It is the printed wall plus the
   baseline file's wall and load. The catalog's standing rule applies: *"No wall-clock assertion
   belongs in the suite."*

**What the fix must not do:** loosen `solved >= baseline`, touch the baseline, or move any row
between lanes.

**Alternative, if the Orchestrator does not take `F1`.**
- The risk below goes to the owner for his word: **`AR-PUZZLE-TIMEOUT`**. *"`PUZZLE_DEEP=1` goes
  red on a timeout, with the solved count at the baseline, at load1 of about 50 and above on the
  reference M3. QE reads that red as FAIL under option B."*
- **Owner of the risk:** Olger Oeselg. Option B and its red rule are his.
- **This gate does not accept it.**
- The `AGENTS.md` line cannot carve out the exception: "red = QE FAIL" is his verbatim wording.

## Notes handed on (each with an owner)

- **AGENTS.md Scribe (`scribe-abc084-lane`).** The `PUZZLE_DEEP` line must keep the whole-lane
  count, "12 passed (9 default)". An unrecognised value, such as `PUZZLE_DEEP=true`, defines no
  deep row and exits 0; the count is the only thing that catches it (`…5e1c0a84`).
- **Orchestrator, at the `Ready for UAT` exit.** The zero-production-lines waiver's git test lists
  `src/puzzle-corpus.ts` and `src/puzzle-suite.baseline.json`, which are test-only data. The rule
  is "measured, never asserted", so the call is the Orchestrator's, and this gate does not assert
  the waiver.
- **Architect/Design (`ADR-0019`).** Item 5: the base lane reads far above both `NFR-008`
  clauses on today's Node.

## Fence

- Zero lines under `src/`, `tools/`, `package.json` and `plans/nfr-catalog.md`.
- No `plans/board.md`, `AGENTS.md` or ADR edits.
- Harnesses and arms ran outside the repository.
- Nothing merged or pushed.
