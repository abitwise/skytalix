---
id: 20261019T224500Z-architect-design-decision-abc175-verdict-and-preflight-carry-one-file-heap-flag-400-a0-binds-7c31d5e8
kind: decision
by: architect-design
at: 2026-10-19T22:45:00Z
verified_by:
confidence: high (command form); UNKNOWN - verify (whether 180 step-4 games fit in 496 MiB)
refs:
  - ABC-175
  - ABC-173
  - ABC-174
  - ADR-0045
  - ADR-0038
  - ADR-0008
  - NFR-010
  - NFR-008
  - tools/grugops/heap-guard.js
supersedes:
---

# `ABC-175`'s verdict and pre-flight commands carry `NODE_OPTIONS=--max-old-space-size=400`. That is the ONE-FILE row, the `AGENTS.md` ladder token and `A0`'s C1, and `A0` binds it. No OOM pre-probe is required; a step-4 probe is owner-routed

This note is hand-authored and unsealed. There is no sanctioned writer on this install: no `scripts/context-io.*` in
the repo or under `~/.grugops`. It answers `secnfr-ABC-174-a0`'s observation `…e4b8d062`.

## Scope

- This is records only, at `main` `397af71f`. The run tree `grugops/ABC-174` @ `f6b63c1c` was read with `git show`
  (`heap-guard.js`, `AGENTS.md:127`, `src/ladder.test.ts`, `src/transposition.ts`).
- No lane was run and no timing was taken.

## Decision

- **Verdict:**
  `caffeinate -i env LADDER_DEEP=verdict NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts --reporter=verbose`
- **Pre-flight:**
  `LADDER_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts --reporter=verbose -t "3v4" > <scratch>.txt 2>&1`
  must exit 0.
- **H1.** The flag is exactly 400, which gives 496 MiB. That is the ONE-FILE row, because the guard counts 1 file and
  `-t` filters names, not files.
- **H2.** The token and its place match `AGENTS.md`'s ladder lane.
- **H3.** `A0`'s vitest arm C1 at 400 binds the flag. It is now an `A0` staleness input (a command input). Any other
  flag means an `A0` re-take or route N.
- **H4.** The pre-flight uses the same flag.
- **H5.** The `env` assignment replaces any ambient `NODE_OPTIONS`.
- **H6.** The budget fits: 2 × 496 = 992 ≤ 1984. The ladder's children are `git`, which is not Node.

## Alternatives rejected

- **A lower flag.** The guard admits it, but `A0` did not read that runner.
- **A higher flag, or no flag.** The guard refuses it, and raising a row is the owner's call (`ABC-173` Q4).
- **The SUITE flag (128).** It is the wrong shape for one file, and below `A0`'s arm.
- **An `npm` script.** The 60 s bound would end the run, and `ABC-042` `A10` would go red.

## Risks

- **An OOM at step 4 is `UNKNOWN - verify`.**
  - The table is fixed-size, allocated once and then zero-filled, so the heap does not grow with the number of games.
  - Read green at 496 MiB: `LADDER_DEEP=1` 18/18 and `A0`'s 5 searches.
  - No step-4 game has run under the cap.
- **No pre-probe is required.** A step-4 probe plays pre-registered verdict games, so it is the owner's word only
  (`OQ-175-H1`).
- **An OOM on the night is `ABC-175` `A4`.** The report should say whether `heap out of memory` or
  `Worker exited unexpectedly` appears.

## Written

- `ADR-0045` § ADDENDUM 2026-10-20 (D6.3 and D6.5).
- `ADR-0038` § ADDENDUM 3, 2026-10-20.
- `.grugops/queue/done/arch-ABC-175-heap.md`.

All of it is uncommitted.
