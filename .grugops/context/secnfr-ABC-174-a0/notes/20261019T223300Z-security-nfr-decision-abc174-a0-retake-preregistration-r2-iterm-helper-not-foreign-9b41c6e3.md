---
id: 20261019T223300Z-security-nfr-decision-abc174-a0-retake-preregistration-r2-iterm-helper-not-foreign-9b41c6e3
kind: decision
by: security-nfr
at: 2026-10-19T22:33:00Z
verified_by:
confidence: high
refs:
  - ABC-175
  - ABC-174
  - .grugops/context/secnfr-ABC-174-a0/notes/20261019T222100Z-security-nfr-decision-abc174-a0-retake-preregistration-workload-n5-route-rule-5d2e7a41.md
  - .grugops/context/secnfr-ABC-174-a0/probe/pairs.mjs
  - .grugops/context/secnfr-ABC-174-a0/probe/raw/a0.jsonl.txt
supersedes: 20261019T222100Z-security-nfr-decision-abc174-a0-retake-preregistration-workload-n5-route-rule-5d2e7a41
---

# `ABC-174` `A0` re-take, re-registration r2, before any graded set: iTerm's `pidinfo --git-state` helper is not foreign (C3'). Everything else in `…5d2e7a41` stands word for word

This note is hand-authored and unsealed, because no sanctioned writer exists on this install. It is committed on
`grugops/secnfr-ABC-174-a0` with the one-line driver change **before any graded set starts**. `…5d2e7a41` (commit
`44bf7066`) said that any change would be a new pre-registration, and this note is that new pre-registration.

## What happened under `…5d2e7a41`

- Invocation 1 ran from 22:21:28Z to 22:30:29Z. **No set started**: no `set-start` line was written, no graded run
  happened, and no pair was timed.
- The driver exited 4 with **`owed`**: no 180 s quiet window opened within 540 s. The last sighting it logged is
  `/Applications/iTerm.app/Contents/XPCServices/pidinfo.xpc/Contents/MacOS/pidinfo --git-state /Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example 4 1`
  (`raw/a0.jsonl.txt`).
- That line is the terminal emulator's helper polling `git` state for a tab whose working directory is this repo.
  It is short-lived and recurring: a 20 s foreground sample afterwards caught none. It matched only C3's
  `cli-chess-example` clause. It is not a vitest process, not a platform process and not a factory hop. While a
  terminal sits in this repo, C3 as written cannot open a window.

## The change (C3')

- In `pairs.mjs`, a `ps aux` line matching
  `/\/iTerm\.app\/Contents\/XPCServices\/pidinfo\.xpc\/Contents\/MacOS\/pidinfo --git-state /` is **not foreign**.
- **Nothing else is excluded.** Every vitest process, every `oeselg-labs/platform` process and every other process
  line naming this repo or its worktrees still resets the 180 s gate and still voids a set in progress.

## Unchanged

The workload, the arms (C1 heap flag 400 on the vitest arm, C2 guard symlink), n = 5 interleaved pairs, the void
rules, the 540 s window deadline (C4, which yields `owed`, never an estimate), the window record (C5) and the rule:
**route V iff `F_hi` ≤ 1.30, otherwise N**. The raw log keeps invocation 1's `owed` line. The reading is the first
set that grades.
