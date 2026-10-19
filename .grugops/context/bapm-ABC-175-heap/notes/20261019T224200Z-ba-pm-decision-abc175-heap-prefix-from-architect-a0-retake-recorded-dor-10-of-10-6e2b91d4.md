---
id: 20261019T224200Z-ba-pm-decision-abc175-heap-prefix-from-architect-a0-retake-recorded-dor-10-of-10-6e2b91d4
kind: decision
by: ba-pm
task: bapm-ABC-175-heap
at: 2026-10-19T22:42:00Z
verified_by:
confidence: high
refs:
  - ABC-175
  - ABC-174
  - ABC-173
  - ABC-085
  - ADR-0045
  - ADR-0038
  - ADR-0008
  - NFR-010
  - NFR-008
  - OQ-175-H1
  - plans/tickets/ABC-175-abc-085-verdict-re-take-on-abc-174s-qe-passed-branch-route-v.md
  - .grugops/queue/done/arch-ABC-175-heap.md
  - .grugops/context/arch-ABC-175-heap/notes/20261019T224500Z-architect-design-decision-abc175-verdict-and-preflight-carry-one-file-heap-flag-400-a0-binds-7c31d5e8.md
  - .grugops/queue/done/secnfr-ABC-174-a0.md
  - .grugops/context/secnfr-ABC-174-a0/notes/20261019T223600Z-security-nfr-decision-abc174-a0-retake-reading-fhi-1047-route-v-c7a3e915.md
  - .grugops/context/secnfr-ABC-174-a0/notes/20261019T223700Z-security-nfr-observation-abc175-verdict-command-lacks-heap-prefix-refused-by-guard-e4b8d062.md
supersedes:
---

# `ABC-175` amended: both commands carry the heap prefix, copied verbatim from `arch-ABC-175-heap`; `A0` re-take `ed88329c` recorded; out-of-memory line added; DoR re-scored at 10/10

This note is hand-authored and unsealed: `scripts/context-io.*` is absent on this install. **The ticket page is
authoritative**, and its § Scope, § Acceptance `A1` and § Security / NFR triggers govern. This note records only the
choices and the reasons for them. The amendment is records only. Nothing was run or timed, and nothing was committed.

## Choices

- **The commands came from the Architect, not from the probable form.** `arch-ABC-175-heap` landed while this hop
  was running (`done_at` 2026-10-19T22:45Z, ruling H1–H6). Both strings were copied verbatim, and a `grep -F` check
  matched each one against the done file.
  - Verdict (§ Scope 2):
    `caffeinate -i env LADDER_DEEP=verdict NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts --reporter=verbose`
  - Pre-flight (`A1`):
    `LADDER_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts --reporter=verbose -t "3v4" > <scratch>.txt 2>&1`
  - They are byte-equal to the probable form in `…e4b8d062`. No "pending Architect ruling" marker was needed.
- **`A1` gains one check: the flag is the one `A0` read.** It is exactly 400, from Architect H3. A run at any other
  flag needs an `A0` re-take or route N, and the owner decides. The flag is an input to the command, not to a file,
  so `A2`'s verbatim command in `verdict.meta.txt` records it.
- **The `A0` inputs moved to the re-take.** `<A0>` = `ed88329c`; `f6b63c1c` is equivalent if the scratch branch is
  dropped.
  - `vitest.config.ts` md5 is `326bc5ca578a29c48102e0192b4bfe5a`.
  - `src/ladder.test.ts` md5 is `bba67b75565b4f4a2e8d231e8bcd6b2e`.
  - The versions are `v26.11.1` and `vitest/4.1.11 darwin-arm64 node-v26.11.1`.
  - These replace the `eb216351` values. The old "`A0` is STALE on `main` `6fc32150`" bullet is kept as dated
    history, closed 2026-10-20. The night still runs every `A1` check.
- **The out-of-memory line is a trigger, not a probe.** It goes under § Security / NFR triggers:
  - The target is 496 MiB per isolate, summing to 992 MiB, within the 1984 MiB row.
  - Whether 180 games fit is `UNKNOWN - verify`.
  - The page schedules no pre-probe. That is the owner's call under `OQ-175-H1`, and the Architect recommends none.
  - An out-of-memory error on the night falls under `A4`: no score, no restart, and the owner decides under
    `ABC-173` Q4.
  - The report names which out-of-memory signature appeared.
  - `A4`'s acceptance text was not changed.
- **DoR re-score: 10/10.** Item 10 holds because the command blocker `…e4b8d062` is closed and `A0` is met. Neither
  remaining item blocks: `OQ-175-H1` has a default that needs no new word, and an out-of-memory error is
  owner-routed.
  - **Recommendation:** `Backlog → Ready` now, because the 2026-10-19 trigger has passed: `ABC-174` is Ready for UAT.
  - The column move belongs to the Orchestrator. The frontmatter was left at `backlog`.

## Not done (fenced)

The following were not touched, and nothing was pushed or merged:

- `src/`, the ADRs, `AGENTS.md`, `plans/board.md` and `plans/traceability.md`;
- the frontmatter `status` and `column`.
