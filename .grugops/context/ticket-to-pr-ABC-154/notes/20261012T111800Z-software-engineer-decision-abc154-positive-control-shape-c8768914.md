---
id: 20261012T111800Z-software-engineer-decision-abc154-positive-control-shape-c8768914
kind: decision
by: software-engineer
task: ticket-to-pr-ABC-154
at: 2026-10-12T11:18:00Z
verified_by:
confidence: high
refs:
  - ABC-154
  - ABC-105
  - QE-105-z
  - QE-105-y
  - QE-105-p
  - N8-LANE
  - tools/grugops/qe-hop-integrity.test.ts
  - tools/grugops/qe-hop-integrity.js
  - 20261012T103400Z-qe-e2e-decision-abc105-qe4-verdict-pass-with-gaps-n8-not-read-6a647762
supersedes:
---

# `ABC-154`: one positive control on each shared whole-tree read, inside existing `it`s; the JSDoc says "none of"

This is a hand-authored, unsealed note with no stamp, per `AGENTS.md`.

**Ids.** Before editing, a read-only probe ran `coverage()` over the real notes with each measured drop
simulated:
- `ABC-031` reads `covered (qe-e2e)` through `quality-gate-ABC-031-qe-2026-08-17` and turns into a `finding` when
  `quality-gate-*` is dropped;
- `ABC-072` reads the `security-nfr` substitute through `secnfr-ABC-072` and turns into a `finding` when
  `secnfr-*` is dropped.

Both are `Done` and covered, and neither is in the cutover snapshot. One of the two goes red under each measured
drop, and both go red on an empty read.

**Shape. No new `it` and no new read.**
- **`allNotes()`**: two `expect`s go inside `A3`'s unfiltered `it` ("coverage() over EVERY real note …"), next to
  the two `finding` checks that `QE-105-p` was closed with. That `it` is where the check had become vacuous. It
  now fails unless the same `all` also holds real coverage.
- **`plainSweep()`**: two `not.toContain` checks go inside `A9`'s "--sweep lists ABC-073 as a finding" `it`. They
  check that neither `ABC-031` nor `ABC-072` is listed as a finding. An empty or thinned plain read lists them,
  so this is a positive control on the second shared read too. It does not depend on `allNotes()`, so the
  two-fault plant (both memos empty) is caught twice.
- **Not pinned:** the sweep's counts. Both checks are per-id statuses of `Done` tickets, so they do not move
  with the board.
- **Kept the same:** every `it` name, so `A2` compares by name. The memos, the `--ticket` runs, and every
  injection of `notes`. `notes` is still injected only under `--sweep` (Test note 4).

**Tool.** One JSDoc line: "the command line can supply neither" becomes "the command line can supply none of
snapshotIds, root and notes". No other byte changes.
