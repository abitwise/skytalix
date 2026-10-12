---
id: 20261012T072547Z-software-engineer-observation-abc105-sweep-at-build-tip-and-hand-count-agree-59fc8af7
kind: observation
by: software-engineer
task: ticket-to-pr-ABC-105
at: 2026-10-12T07:25:47Z
verified_by:
confidence: high
refs:
  - ABC-105
  - A4
  - A6
  - A7
  - QE-105-g
  - 20261012T070924Z-ba-pm-observation-abc105-amend-re-measurements-sweep-cutover-malformed-94f479e1
supersedes:
---

# `ABC-105` `A4` at the build tip `ada10423`: 132 / 38 / 77 / 2 / 15, exit 1, and the hand count agrees

This is a hand-authored, unsealed note with no stamp, per `AGENTS.md`.

**Tree.** `ada10423`. Its `.grugops/context` differs from `d64f6d73` only by this task's own notes
(`ticket-to-pr-ABC-105`, `by: software-engineer`, which can cover nothing). `## Done` is byte-equal to
`d64f6d73` and to `a37a4e12`'s 132 rows. There are 2622 notes, and `find .grugops/context -type l` finds 0
symlinks.

**`node tools/grugops/qe-hop-integrity.js --sweep`, exit 1:**
- Done rows: **132**
- Pre-cutover: **38**
- Covered (`qe-e2e`): **77**. This is QE's 75 at `21980135` plus `ABC-076` (token reading) and `ABC-153`. The
  sets are `cmp`-identical.
- Covered (`security-nfr` substitute): **2**, `ABC-072` (`secnfr-ABC-072/…-29849eeb`) and `ABC-147`
  (`secnfr-ABC-147-review/…-ff01ca7a`).
- In-scope findings: **15**: `ABC-038 044 060 070 073 074 085 092 100 108 110 111 112 113 150`.
- Malformed front matter: **0**.

**This equals the page's `a37a4e12` row, 132 / 38 / 77 / 2 / 15, with the same 15 ids.** No number differs
from the page. As the brief expected, `ABC-105` itself is not a `Done` row and so is not in the sweep.

**Hand count, same rule, different instrument.** A bash + awk script in the session scratchpad
(`handcount.sh`, not committed) shares no code with the tool. It does three things:
- reads `## Done` with `awk`/`sed`;
- matches folder names with `grep -E "(^|[^a-z0-9])abc-?0*N([^0-9]|$)"` on the lower-cased name;
- reads `kind`/`by`/`refs` with `awk`.

It reads `Done 132 | pre 38 | qe 77 | substitute 2: ABC-147 ABC-072 | findings 15: <the same 15> | sum 132`.
**The two agree on every count and every id.**

**`--ticket` readings:**

| ticket | exit | result | note |
|---|---|---|---|
| `ABC-061` | 0 | out-of-scope (pre-cutover) | |
| `ABC-062` | 0 | out-of-scope (pre-cutover) | |
| `ABC-031` | 0 | covered (`qe-e2e`) | `quality-gate-ABC-031-qe-2026-08-17/…-dbbb1b96` |
| `ABC-076` | 0 | covered (`qe-e2e`) | two notes under `quality-gate-ABC-076-qe-2026-08-17/` |
| `ABC-072` | 0 | substitute | |
| `ABC-073` | 1 | finding | |
| `ABC-105` | 0 | covered (`qe-e2e`) | `qe-recheck-ABC-105/…-72ae8565`, QE's pre-build note |

**`ABC-105`'s 0 is the `QE-105-g` ceiling, named in `A7`.** It is not evidence of a post-build hop. QE's
post-build verdict should be filed under the convention, so that the `Done`-exit reader sees a post-build
path.
