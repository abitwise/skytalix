---
id: 20260813T113500Z-architect-design-observation-per-file-floor-re-derived-and-headroom-in-files-7eca0d7d
kind: observation
by: architect-design
at: 2026-08-13T11:35:00Z
verified_by:
confidence: high
refs:
  - ABC-026
  - ABC-026-A2
  - NFR-008
  - N8-LANE
  - ADR-0008
  - EPIC-003
  - ABC-021
  - plans/nfr-catalog.md
supersedes:
---

# `A2`: the per-file floor RE-DERIVED (not inherited), and the headroom in FILES with the arithmetic shown

**~7 more test files at today's all-in cost. ~16 if every one were empty. That roughly HALVES the
last published headroom, and the reason is measured-versus-inferred, not a change of method.**

An `observation`, not a `finding` — same reason as the note beside it: no gate verdict, no human grant,
no stamp invented.

## The instrument: out-of-tree copies, because `A6` pins `src/`

Five out-of-tree trees under a scratchpad: `src/` + `package.json` + `tsconfig.json` + `biome.json`
copied, `node_modules` symlinked. **Every copied repository file was `cmp`-verified byte-identical per
file before any condition was applied — 250 file copies, 0 mismatches.** Then `K` trivial
one-assertion test files importing **nothing** from the repository were added to three of them. **The
repository's own `src/` was never written**, re-verified at the end: 47 md5s identical before and
after, `git status --short -- src/` empty.

`treeB` is a **second byte-identical copy of `treeA`** carrying no added files — the **identity null
control**, run as its own condition in the same interleaved harness, which is what makes the deltas
admissible under `N8-LANE`'s own admissibility clause.

## The measurement

```
files       28 (treeA)   30 (+2)    32 (+4)    36 (+8)     null control (28, identical copy)
CPU med     10.315 s    10.685 s   11.025 s   11.590 s     +0.48% CPU, sign 5/8   ADMISSIBLE
paired delta vs 28         +0.360     +0.615     +1.320  s
sign                          7/8        8/8        8/8
marginal CPU per file      180 ms     154 ms     165 ms
marginal WALL per file      18 ms      34 ms       40 ms   <- vs a WALL null of +75 ms

fit over files = 28..36    CPU = 5.920 s + 158.2 ms x files    R^2 0.9954
                          WALL = 0.827 s +  39.1 ms x files    R^2 0.9912
```

## **The published slope is RE-DERIVED, not inherited — and it holds**

`ABC-026`'s own earlier hop published **`CPU = 0.85 s + 159 ms × files`, R² 0.9999**. The brief required
me to re-derive or refute it. **RE-DERIVED: 158.2 ms/file against 159 ms/file — agreement within 0.5%,
from an independent harness, on a lane six files larger, in a different session.** That is a genuine
replication and it is the strongest thing in this note.

**My own band is 154–180 ms per file; use 160 ms.** That sits inside the recorded 100–229 ms.

**THE INTERCEPTS ARE NOT COMPARABLE AND MUST NOT BE QUOTED AGAINST EACH OTHER.** `0.85 s` is an
**empty-tree** intercept fitted over `K` = 1…128 trivial files. `5.920 s` is **this lane's
content-loaded** intercept fitted over a narrow 28…36 window. **Extrapolating 5.920 s down to K = 0 is
not valid and is not done here.** Anyone reading "the intercept moved from 0.85 to 5.92" as a finding
has compared two different models.

One direction where I differ from the record and report it rather than smooth it: the catalog has the
marginal cost **RISING** with the number of files added (100 → 168 ms on the 22-file lane); **mine
FALLS** (180 → 154 → 165). Both sit inside 100–229 ms. I do not have an explanation I can defend —
28 files is exactly 4 × the 7 default workers, so an addition starts a fresh wave rather than filling
idle slots, which is the opposite of the catalog's stated reason — and I am **not** asserting that as
the cause. `UNKNOWN - verify`.

## **The headroom, in the unit a ticket author actually spends**

Computed on the **conservative** (highest) measured CPU median, sample A = 10.390 s:

```
remaining CPU under the 13 s clause   13 - 10.390 = 2.610 s    (sample B: 13 - 9.975 = 3.025 s)

EMPTY files, at the re-derived slope  2.610 / 0.1582 = 16.5  ->  ~16 files    band 14-19
  band  2.610/0.185 = 14.1  and  3.025/0.159 = 19.0

files at TODAY's ALL-IN cost          10.390 / 28    = 371 ms per file
  (floor + the content a real file    2.610 / 0.371  =  7.0  ->  ~7 files     band 7-8
   actually carries)

tickets at N8-LANE's full 650 ms      2.610 / 0.650  =  4.0  ->  ~4 tickets, before the floor
  of content each                                                 those files also cost
```

**USE ~7 AS THE PLANNING NUMBER AND ~16 AS THE CEILING.**

**BA/PM's estimate in `A2` was ≈ 26 files, band 18–41, from `(13 − 8.85) ÷ 160 ms`, and said explicitly
that `A1` would replace the 8.85 with a measured number. It does: 10.390. The estimate was honest
about being one, and it was 2.4x optimistic on the empty-file count.**

**What this costs the plan, stated because a headroom nobody spends is not a budget.** `EPIC-003` was
decomposed into eight tickets each implying about one new test file — **7–8 files. That is the whole
planning number.** `EPIC-004` is sized **L** and is also file-adding. This is `ADR-0008`'s *"tight, not
comfortable"* holding, and it is now tighter than the last restatement of it.

## The restatement rule, because a concurrent lane is live

`ABC-021` is building in a sibling worktree and **carried 28 test files — no new test file yet** — when
this was measured (verified directly in its worktree, not assumed). **If it or any ticket merges a test
file first, do NOT re-measure. Restate by arithmetic from the per-file cost above:** subtract
**160 ms CPU** (band 154–180) per added file from the remaining 2.610 s, and subtract **one** from each
file count. **That is why the reading is anchored to `06c5427` and why the commit is recorded on every
statement of it.**
