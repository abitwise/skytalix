---
id: 20260809T102000Z-security-nfr-observation-8f4ab4f6
kind: observation
by: security-nfr
at: 2026-08-09T10:20:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-018
  - ABC-018
  - src/frame.ts
  - src/frame.test.ts
  - AGENTS.md
  - .grugops/factory.config.json
  - 20260809T094500Z-qe-e2e-observation-f4e30dbc
  - 20260809T090500Z-software-engineer-artifact-ref-f0614850
supersedes: 
---

# Every gate RE-RUN on the tip by this role, with its exit code — and the proof this gate changed nothing

Neutral facts only. **Not one exit code below is inherited.** Every command was run here, on branch
`grugops/ticket-to-pr-ABC-018` at **`a446297`**, with the real commands from `AGENTS.md` § Commands.
A gate this role did not run is not reported as a gate.

## The gates, in Workflow 05 step 3 order

| Step | Command (`AGENTS.md`) | Exit | Result |
|---|---|---|---|
| lint | `npm run lint` | **0** | 31 files, **0 errors**, 2 infos |
| typecheck | `npm run typecheck` | **0** | `tsc --noEmit` |
| build | `npm run build` | **0** | `tsc --noEmit` — the honest naming `AGENTS.md` records |
| unit | `npm test` | **0** | **304 passed / 304 on 14 files** |
| test-integrity | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** | **0 skips** |
| test-integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **2** | `cannot read the registry file` |
| e2e | — | **`UNKNOWN - verify`** | the `AGENTS.md` slot is unknown |
| auto-UAT oracles | `node scripts/check-uat-oracles.js` | **`UNKNOWN - verify`** | the script does not exist in this install |

**`npm run lint` exits 0 on the first run here**, because the Engineer's and QE's autofix passes are
already committed. **No autofix pass was needed at this gate and none was run** — this gate added no
code of its own to the repository. The two remaining **infos** are the pre-existing `biome.json`
schema-version mismatch (`2.3.0` against CLI `2.5.5`) and the `recommended`-deprecation notice; both
predate this ticket and were deliberately not touched.

**The test-integrity checker's exit 2 is recorded as an ERROR and NOT as a pass.**
`.grugops/test-skips.md` does not exist (`ls` confirms). Exit 2 means the checker could not run; it
is not the exit-1 human-only short-circuit and it is not green. **No registry file was created** — an
agent may not self-author a justification to clear its own gate — and the suite's skip count is **0**,
so nothing is owed a justification. **This is the sixth ticket on this board to record the same.**

## No `--coverage` run was made, deliberately

The tracked `coverage/` directory is a known hazard on this board: a coverage run rewrites it, and
both the Engineer and QE had to restore it. This gate had no coverage question of its own — QE's
100% on all four axes is QE's measurement and is **not restated here as this gate's** — so the
hazard never arose. `git status --short` shows no `coverage/` entry.

## THE TREE IS UNCHANGED BY THIS GATE

- `md5 src/frame.ts` = **`bb827f52fe537817e40020a29dfa0e6d`** — the Engineer's **first-commit**
  digest (`d88a1f0`), the digest QE published, and the digest this board's merge record checks.
  Read here at the start of the gate and again at the end.
- `git diff --stat -- src/` is **EMPTY**. No production file and **no test file** was changed.
- Every instrument this gate wrote lives **outside the repository**, in the session scratchpad, and
  imports `src/` by absolute path. Nothing was added to `src/`, and the harnesses are deliberately
  not committed: they are one-off gate instruments, not delivered artifacts (`AGENTS.md` rule 5).

## Machine, recorded once and carried by every figure this gate publishes

**Apple M3 (Mac15,13) · Node v24.12.0 · Darwin 25.5.0 arm64 · macOS 26.5.2 (25F84).**
**`UNKNOWN - verify` on any other hardware.**

## Config read at the source, not taken from the activating prompt

`security.asvs_level` **`L1`**, `security.block_on` **`high`**, `compliance_regime` **`[]`** (so no
Compliance Officer hand-off is owed), `quality.gate_enforcement` **`blocking`**,
`quality.mandatory_gates` **`["lint","typecheck","unit","build"]`**, `context.human_admission`
**`off`**, `wip_limits["In Security/NFR"]` **2**, `wip_limits["Ready for UAT"]` **4**.

## Substrate

No `scripts/` in this install or in the kit, so this note is hand-written in the exact shape of
`agent-factory/contracts/context-note.md` and no `index.md` / `index.jsonl` was hand-faked. **No
`finding` is admissible on this task** — there is no §14 gate here to issue a `§14-gate#<id>` stamp
and `context.human_admission` is `off`. Nothing is self-stamped.
