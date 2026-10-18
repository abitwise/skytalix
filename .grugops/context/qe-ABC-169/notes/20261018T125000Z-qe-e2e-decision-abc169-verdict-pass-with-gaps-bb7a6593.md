---
id: 20261018T125000Z-qe-e2e-decision-abc169-verdict-pass-with-gaps-bb7a6593
kind: decision
by: qe-e2e
task: qe-ABC-169
at: 2026-10-18T12:50:00Z
verified_by:
confidence: high
refs:
  - ABC-169
  - plans/tickets/ABC-169-declare-the-engine-private.md
  - QE-169-a
  - QE-169-b
  - QE-169-c
  - QE-169-d
  - QE-169-e
  - 20261018T124600Z-qe-e2e-observation-abc169-acceptance-readings-9b0bf9ae
  - 20261018T124700Z-qe-e2e-observation-abc169-a3-transpile-identity-fc56e5fd
  - 20261018T124800Z-qe-e2e-observation-abc169-license-value-unpinned-379f27df
  - 20261018T124900Z-qe-e2e-observation-abc169-hand-tuned-vs-credit-910d778e
  - .grugops/queue/done/qe-ABC-169.md
supersedes:
---

# QE `ABC-169` on `grugops/ABC-169` (tip `344a4128`, base `849d7f92`): **PASS_WITH_GAPS**

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). No timing was read. Nothing was
committed to `grugops/ABC-169`, pushed or merged.

| item | ruling | basis |
|---|---|---|
| `A1` | **MET** | `{ "private": true, "license": "UNLICENSED" }`. One `+` line in `package.json`, no `-` line. Lock file unchanged (`…9b0bf9ae`) |
| `A2` | **MET** | five strings once each in lines 1-21; the import follows. Wording equals ADR-0044 D13 word for word |
| `A3` | **MET** | one `-U0` header hunk, comment lines only. Transpile identical, sha256 `629c825d…7705`. A planted mutant breaks it (`…fc56e5fd`) |
| `A4` | **MET** | no `LICENSE*`, `NOTICE*` or `COPYING*` |
| `A5` | **MET** | three files. `cli.test.ts` `1 0`, `"license",` inside `AT_HEAD`. `tools` and the lock file are empty diffs |
| `A6` | **MET** | lint, typecheck and build exit 0. Unit 1830/1830 at the tip x2 and at base. No file added. Skip check `No findings.` Armed: A10 is the only red row without the key |
| UAT-waiver reading | **applies** | the grep names only `src/evaluate.ts`, which A3 covers. WAIVED (waived is not accepted) |

**Gap register.** No criterion is unmet, and none of these blocks.
- **`QE-169-a` LOW, residual.** The `license` value is not pinned. `"MIT"` passes the whole default lane. The ticket fences
  a new test, so BA/PM can cut a pin or the owner can accept the gap (`…379f27df`).
- **`QE-169-b` LOW.** `src/evaluate.ts:12`, `:58` and `:145`, and two test comments, still say "hand-tuned" or
  "hand-written", which contradicts the credit. They are fenced, so fixing them needs a comment-only follow-up
  (`…910d778e`).
- **`QE-169-c` INFO.** A10's name and its comment now describe history. ABC-168's rebase onto the same `AT_HEAD` should
  not read the name as a contract.
- **`QE-169-d` INFO, `UNKNOWN - verify`.** The table values match Michniewski's as recalled. The primary page was not
  fetched.
- **`QE-169-e` INFO, pointer.** `npm ci` warns about 3 vulnerabilities and unapproved install-scripts. Both come from
  the unchanged lock file, so they predate this ticket. They belong to the Security/NFR lane.

**Next column.** `In Review` exit: QE recommends `In Security/NFR` (already run as `secnfr-ABC-169`), then `Done`
under the zero-production-lines waiver. The Orchestrator decides.
