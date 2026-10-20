---
id: 20261020T194700Z-qe-e2e-decision-abc177-verdict-pass-with-gaps-timing-owed-ec9517a5
kind: decision
by: qe-e2e
task: qe-ABC-177
at: 2026-10-20T19:47:00Z
verified_by:
confidence: high (A1–A7, A12 run in this hop); A8–A11 OWED (not read)
sealed: false
refs:
  - ABC-177
  - ADR-0046
  - NFR-008
  - N8-LANE
  - R-174-1
  - OQ-177-1
  - ABC-167
  - ABC-171
  - QE-177-a
  - QE-177-b
  - QE-177-c
  - QE-177-d
  - QE-177-e
  - QE-177-f
  - QE-177-g
  - plans/tickets/ABC-177-npm-test-back-under-nfr-008s-10-s-adr-0046.md
  - 20261020T192200Z-qe-e2e-observation-abc177-criteria-a1-a5-a7-a12-reconfirmed-4c92197e
  - 20261020T192200Z-qe-e2e-observation-abc177-a6-parity-reconfirmed-union-list-graded-e1dfd431
  - 20261020T192200Z-qe-e2e-observation-abc177-open-points-u8-u1-u7-gap-probes-02deb2e2
  - 20261020T194700Z-qe-e2e-observation-abc177-timing-a8-a11-owed-no-ac-power-a4611b8d
  - 20261020T192200Z-qe-e2e-artifact-ref-abc177-probe-files-commands-155330b9
supersedes:
---

# QE on `ABC-177` at `f81bf03c`: **PASS_WITH_GAPS on A1–A7 and A12; A8–A11 OWED.** The build and parity hold. The timing that is the ticket's purpose was not read: no AC power

Hand-authored and unsealed. This is a `decision`, not a `finding`: no `§14-gate#` or `human:` stamp exists on this
install, and the sanctioned writer is absent.
- Nothing was committed, pushed, merged, fixed or self-signed.
- `src/` on any branch, `../wt-ABC-177`, `plans/board.md` and `plans/traceability.md` were not touched, and neither was
  any process this hop did not start.

## Grades
| crit | grade |
|---|---|
| A1 | **MET.** The fold is lossless within a session. It drops one cross-session kill: `QE-177-a` |
| A2 | **MET.** U1–U7 at 1 000, U8 at 100, each the coarsest admitted step with parity |
| A3 | **MET.** 1 987/1 987 at both; 126/126; names byte-identical |
| A4 | **MET.** Step literal only outside U1; no title, bound or `expect(` outside U1 |
| A5 | **MET.** One file; every hunk in range |
| A6 | **MET.** 15/15 rows SAME over the frozen 145. The re-derived list is byte-identical, and the SE's union reading is correct |
| A7 | **MET.** −492 968 nodes, reproduced exactly |
| A8 | **OWED** (no AC) |
| A9 | **OWED** (no AC) |
| A10 | **OWED.** `NFR-008` not read |
| A11 | **OWED.** No reading, so no escalation route fires |
| A12 | **MET.** All gates green; the M4 sweep reds on a release-path plant |

## Open points (graded only)
- **U8 at step 100: in-ticket.** It still pins ABC-171 A7 as written. Its engine searches are now depth 1 (`QE-177-c`,
  INFO).
- **U1–U7 at step 1 000: one time-limit behaviour left unpinned on the default lane.** G on a `go` whose
  `depth`/`nodes`/`mate` token is dropped and that has no time token: U7's blind band grew from about 100 ms to about
  1 000 ms (`QE-177-b`, LOW).
  - The mid-iteration abort and the loop-top deadline stay pinned elsewhere. U1–U7 never pinned them.

## `NFR-008` and `R-174-1`
- **`NFR-008` on the tip: NOT READ (OWED).**
- **`R-174-1`: NOT discharged.** The last admissible state is still `QE-174-b`'s NOT MET, 10.010 s.

## Gaps
| gap | sev | what | route |
|---|---|---|---|
| `QE-177-g` | **MEDIUM** | A8–A11 OWED: the host was on battery for the whole hop (51/51 samples), and a foreign platform suite was running throughout | Orchestrator: re-dispatch the timing half on AC (instruments and pre-registration ready). Then Security/NFR rules the `NFR-008` state |
| `QE-177-b` | LOW | U7 at 1 000: a G cut on the dropped-limit path survives the whole default lane (QP6) | BA/PM: accept, or a new test-only ticket |
| `QE-177-a` | LOW | The fold drops U1's cross-session comparison: module-scope `held` (QP1) survives the whole default lane | BA/PM: accept, or a new test-only row (about 655 nodes) |
| `QE-177-c` | INFO | U8 at 100: the level-1 engine searches are depth 1 (were depth 4 and 2). The kill set is unchanged | BA/PM's reading of the brief's wording; the remedy is one literal |
| `QE-177-d` | INFO | QP4b leaves U1 and QP5 leaves U7, but each is still killed by 24 / 16 lane rows | none |
| `QE-177-e` | INFO | 5 frozen entries are inert at base, including the SE's own successor 171-S42b. No changed row is affected | none |
| `QE-177-f` | INFO | A self-symlink `node_modules/node_modules` in main's tree (2026-10-17, predates this ticket) | whoever owns the workspace; not this ticket |

## Waiver
- `git diff --name-only f81bf03c~1 f81bf03c | grep -v '\.test\.ts$' | grep '^src/'` is **empty**. The
  `ff1e375f...f81bf03c` form is empty too.
- **So the standing UAT waiver applies (confirmed).** A waiver is not a signature, and a green QE is not one either.

## Next column
- **Stay in `In Review`** until the timing hop. The ticket's purpose (`R-174-1`'s discharge) is unread.
- After that, go to `In Security/NFR` for the `NFR-008` state, then `Ready for UAT` → `Done` under the waiver.
- The Orchestrator decides.
