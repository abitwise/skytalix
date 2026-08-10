---
id: 20260810T083351Z-security-nfr-claim-7de9551a
kind: claim
by: security-nfr
at: 2026-08-10T08:33:51Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ABC-023
  - RISK-ABC023-01
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - plans/tickets/ABC-023-castling-precondition-net-hardening.md
  - plans/tickets/history/ABC-023-board-history.md
  - 20260810T083348Z-security-nfr-observation-dc358c57
  - 20260810T083349Z-security-nfr-observation-ff60dfac
  - 20260810T083350Z-security-nfr-decision-30e3ed9e
supersedes: 
---

# Security/NFR verdict **PASS_WITH_RISKS** — one owned LOW risk, no required fix — recorded as a CLAIM, because this install can mint no `§14-gate` stamp

The engineer's and QE's notes both say this and both were re-checked at the source rather than
inherited: there is no `scripts/` directory in this repository, none in the kit root, and no
`context-io.*` in either, so Workflow 05 step 5's `emitVerdict` cannot run and no live green
`§14-gate#<id>` verdict exists for a `finding` to reference. `context.human_admission` is `off`, so
there is no `human:<name>` stamp either, and this host exposes no `mcp__grugops__propose_note`
tool. Per Workflow 16 step 4 the honest record is a **`claim` carrying
`confidence: UNKNOWN - verify`** — non-load-bearing, not a finding, not to be read as one.
**The NUMBERS below are not soft** — every one was run by this gate at this hop and is reported as
it ran. The terminal VERDICT is a judgement no instrument here can stamp.

## The verdict

**PASS_WITH_RISKS.** Not `PASS`, because one risk is accepted and carried; not `FAIL`, because no
L1 requirement fails and nothing reaches `block_on: high`.

```
SECURITY half   FIRED, and reviewed. All 749 added lines read for risk — the first review of this
                diff to ask anything other than "do the right mutants die". No secret, no
                destructive command, no network call, no unbounded loop, no process spawn, no path
                traversal, no swallowed error. ZERO new dependency edges. No .only, no suppression
                comment, no vacuous quantifier, no flake vector.
NFR half        NOT TRIGGERED — structurally, and the premise was re-derived here: all SEVEN
                catalog rows are production-code or artifact bars, none attaches to test-suite
                runtime, and the production tree is byte-identical to main. `npm run perft` was
                deliberately NOT run. NFR-001's ABC-009 discharge is untouched by definition.
RESULT          no required fix · 1 accepted risk · 0 high · 0 medium · 1 low
```

## The one accepted risk, with its owner

```
RISK-ABC023-01  object-literal indexing from a FEN field in the new test helpers, with the
                undefined-cast unguarded (CASTLE_SHAPE[...], PIECE_TYPES[...] as number)
severity        LOW   — unreachable today: every key is a hard-coded literal in this same file
owner           QE/E2E
trigger         the first time a helper is handed a FEN that is not a literal in this file
                (fuzzer, file, generated corpus, property-based lane)
```

An accepted risk with no owner is a risk nobody fixes — this board carried one through three hops
on `ABC-022` before it was caught, and that is why the owner is named on the row and not only in
prose.

## The gate, exactly as it ran at this hop

```
npm run lint                    exit 0   biome, 35 files, 2 infos (pre-existing config migration)
npm run typecheck               exit 0   tsc --noEmit
npm test                        625 passed / 625 on 18 files
npm run build                   exit 0   tsc --noEmit
skip count                      0        by the AGENTS.md `### Test integrity` command
PERFT_DEEP=1 vitest perft       32 passed / 32   EXACT, 46.92 s
md5 -q src/moves.ts             6335b452fc21ffe2d0f902ecab930840   before AND after every run
git diff main --stat -- src/    1 file changed, 749 insertions(+), 0 deletions
test-integrity checker          exit 2   "cannot read the registry file: .grugops/test-skips.md"
E2E                             UNKNOWN - verify   no UI surface until EPIC-006
auto-UAT oracles                UNKNOWN - verify   scripts/check-uat-oracles.js is absent
Compliance Officer hand-off     NOT OWED — compliance_regime is []
```

The test-integrity **exit 2 is COULD-NOT-RUN, not a pass**, and not the exit-1 human-only short
circuit. **No registry file was created.** No agent-fixable failure occurred, so neither of the two
`self_fix_attempts` was spent.

## `A4` held through this gate, and that is the record the verdict rests on

`src/moves.ts` hashes `6335b452fc21ffe2d0f902ecab930840` before and after everything this hop ran,
`git status --short src/` is clean, and **no production code was changed and nothing was repaired
to make this gate's own verdict green** — the same property the engineer's and QE's hops recorded,
now true across all four hops.

## The board move

`ABC-023` `In Security/NFR` → `Ready for UAT`. In Security/NFR 1/2 → 0/2, Ready for UAT 0/4 → 1/4,
both inside their limits, no WIP exception used or needed. The ticket's frontmatter moved to
`status: ready-for-uat` / `column: Ready for UAT` in the same commit as the board row, and the
outgoing `_Updated:` header was appended **verbatim** to
`plans/tickets/history/ABC-023-board-history.md` **before** it was replaced.

## What must NOT be inferred from this claim

- **Not a UAT verdict.** `Ready for UAT` means the gates this column owns have run and returned a
  result. Whether `ABC-023` is UAT-able at all is the UAT Planner's and the Orchestrator's, not
  this gate's, and it is not ruled on here.
- **Not merge authority.** Nothing was merged and nothing was deployed. No one was enqueued.
- **Not that the 749 lines are exhaustively audited.** They were read in full and scanned
  mechanically, and both are reported. A risk class nobody thought to look for would not appear
  here — the same limit every mutation hop on this ticket stated about itself.
- **Not that `NFR-001` was measured.** It was not, deliberately, with the reason recorded.
- **Not that QE's two deep-lane-only leftovers are ruled on.** They are BA/PM's, on the parallel
  subtask. `ABC-009` is not reopened.
