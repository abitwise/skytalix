---
id: 20261107T201705Z-ba-pm-observation-ecab6432
kind: observation
by: ba-pm
at: 2026-11-07T20:17:05Z
verified_by: 
confidence: high that each line reads as stated; that the owner has not answered is absence on the notes read, not proof; nothing run
refs:
  - bapm-terms-after-291
  - grugops/bapm-terms-after-291
  - ABC-291
  - ABC-290
  - ABC-292
  - ABC-293
  - ABC-306
  - ABC-286
  - ABC-288
  - ABC-289
  - ABC-303
  - ABC-305
  - ABC-307
  - EPIC-011
  - ADR-0075
  - ADR-0056
  - ADR-0067
  - ADR-0072
  - ADR-0073
  - NFR-008
  - OQ-0074-2
  - 44f031b7
  - 9a93c09c
  - orch-2026-10-30a/20261107T201037Z-orchestrator-decision-aab9afd1
  - orch-2026-10-30a/20261107T195913Z-orchestrator-decision-ef659beb
  - orch-2026-10-30a/20261106T211205Z-orchestrator-decision-32c023cc
  - arch-ABC-291-closed/20261107T200924Z-architect-design-decision-8cc32a89
  - arch-ABC-291-closed/20261107T200924Z-architect-design-observation-ad069f2f
  - arch-ABC-301-miss/20261105T004230Z-architect-design-decision-2b3440cf
  - arch-ABC-303-b5/20261106T183437Z-architect-design-decision-28283e48
  - bapm-ABC-291-closed/20261107T200738Z-ba-pm-observation-017e36a9
supersedes: 
seal: sha256:e88ec336fbf06d197ac2ea7eaf0eee0c8180ee95c0567f0f59aea2bae7cf4ace
---

# bapm-terms-after-291: what these pages leave open, and for whom

BA/PM, task `bapm-terms-after-291`. Read from the records at `main` `44f031b7`. Nothing run. No bar moved.

## For the Orchestrator
- **The board card.** `ABC-291`'s page reads column Done from this hop. Its card moves with the merge, by `…aab9afd1`.
- **`ABC-286` and `ABC-288`.** The bundle they designed merged, and their pages and cards still read Backlog. Their `adr:` lines still say "not in force until bundle 1 merges". Closing them as "delivered by `ABC-303`", as `ABC-233` was by `ABC-283`, needs a ruling and a hop with those pages in its fence. `EPIC-011` rows 38 and 40 say it is outside this one.
- **The owner's two questions have no row** in `EPIC-011` § Owner questions. A dated line names them. A row falls to whichever hop carries `ABC-292`'s ADR.

## For the hop that writes `ABC-292`'s ADR
- **The +0.10 s line** is still absent from `ABC-290`, `ABC-292` and `ABC-293`. Their § NFR triggers read `NFR-008` "≤ 10 s: units only". `…8cc32a89` § 4 has BA/PM write the line when each ADR is written.
- **Main's lane** reads near 9.13 s, one arm's figure. It is not on these pages.

## Left stale, on purpose
- **"One at a time … with `ABC-291`"** on `ABC-290`, `ABC-292`, `ABC-293` and `ABC-306`'s `ABC-290`–`ABC-294`. `ABC-291` is closed and holds neither file. It reads harmlessly and was not on the list.
- **`ABC-295`** was not touched. Its Problem carries no "settle" line, and `…2b3440cf`'s rule sits in that note and `EPIC-011`.
- **`ABC-291`'s older banners** keep their words. The new head block answers the in-flight pointers.
- **`EPIC-011` Phases row E4** reads "`ADR-0075` ACCEPTED, in force at `ABC-291`'s merge", with `bapm-ABC-291-closed`'s NOT MET line after it. Row 43 carries the close, so it took no further line.
- **`.grugops/queue/pending/se-ABC-289.md`** still sits in pending on `main`. It is not this hop's, and I did not read or move it.

## `UNKNOWN - verify`
Whether the owner reads the order or the two misses differently. `…aab9afd1` says he is told, and no answer of his is on the record I read.
