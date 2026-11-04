---
id: 20261104T142409Z-software-engineer-decision-a0bef530
kind: decision
by: software-engineer
at: 2026-11-04T14:24:09Z
verified_by: 
confidence: high: read from the diff; the rows and three scratch mutants confirm the shape
refs:
  - se-ABC-300
  - ABC-300
  - ABC-282
  - EPIC-011
  - ADR-0071
  - ADR-0056
  - NFR-008
  - R-281-a
  - ABC-276
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
  - grugops/ABC-300
  - 6af55341
  - 9835859d
supersedes: 
seal: sha256:15b58074514a2d9b5b19d5876f06d6449a0c3cb330dab21d37bd8da3bb3b4e12
---

# se-ABC-300 decision: how `d --tc 40/8` is built

- **One optional field on `ArgSpec`:** `tc?: string | undefined` (the `| undefined` is for `exactOptionalPropertyTypes`, so `main()` passes the flag value as read). `cutechessArgs`' `sky()` emits `tc=<tc>` and `timemargin=0` in the slots of `st=` and `timemargin=`, and `option.TimeMode=uci-clock-mode` after `restart=on` and after the (absent in `d`) `Skill Level` slot. With `tc` absent the vector is built exactly as before, so `r`, `rpair` and every `d --budget-ms` print is unchanged.
- **One constant:** `D_TC = "40/8"`. The value is checked as exact text, not parsed.
- **Refusal order in `main()`:** the unknown-flag check (`--tc` is allowed for `d` only, so `r` and `rpair` give the usage text, as any unknown flag), then `--tc` with `--budget-ms` ("`--tc and --budget-ms: d takes one or the other, not both`"), then any value but `40/8` ("`--tc <value>: d takes only 40/8`"). Both run before the `git rev-parse` of the SHAs, so a refusal starts no process at all (scope 4 says before any build or process start; the existing `--budget-ms` refusals run after `rev-parse`, and are left as they are).
- **`machine.txt`:** `control: skytalix and base tc=40/8 timemargin=0 TimeMode=uci-clock-mode`, placed where `ABC-255`'s short-control line goes. With `--tc` the budget is the default 3 000, so the `ABC-255` line never prints beside it.
- **`usage()` (A4):** `d`'s line reads `[--budget-ms B | --tc 40/8]`, and one line is added after `--budget-ms`'s: `--tc: D only, 40/8: both sides tc=40/8 timemargin=0 TimeMode uci-clock-mode; not with --budget-ms`. No other usage byte changes.
- **Rows:** a new `ABC-300` describe in `tools/rating/pair-check.ts`. A1 builds the expected vector from the live `--budget-ms 100` vector with the three token changes and `deepEqual`s the whole `--tc` vector (also asserting 2 of each source token). A2: four bad values, both flag orders at 100 and 3 000, and `r` / `rpair` usage. A5: each engine group's key list is exactly name, cmd, arg, dir, tc, timemargin, restart, option.TimeMode, stderr. `ABC-276` A5's pinned usage text is the one existing row edited (A4).
- **Deviation from the plan:** none. No smoke game was played (the brief allows at most one; a 40/8 2-game run is up to about 32 minutes on one core, and A6 is checked at `ABC-282` A6).
