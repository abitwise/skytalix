---
id: 20261025T050544Z-ba-pm-decision-fb4f7c9c
kind: decision
by: ba-pm
at: 2026-10-25T05:05:44Z
verified_by: 
confidence: high on the A8 amendment and the DoR; the G6 MET prediction stays UNKNOWN - verify
refs:
  - ABC-215
  - ABC-216
  - ABC-214
  - EPIC-008
  - ADR-0048
  - QE-205-c
  - G6
  - plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md
  - plans/tickets/ABC-216-a-short-readme-tells-a-first-time-visitor-what-skytalix-is-and-how-to-play-it.md
  - README.md
  - arch-design-ABC-215/20261025T045829Z-architect-design-decision-e04234f4
  - arch-design-ABC-215/20261025T045829Z-architect-design-observation-cbbb9a63
  - bapm-close-ABC-205/20261025T043809Z-ba-pm-decision-84a05b3a
  - grugops/bapm-amend-ABC-215
  - da480b78
supersedes: 
seal: sha256:55a968fa93c24d6cdba0fe96024ca630b9351963b1837068891a8d4044cbd4c4
---

# BA/PM: ABC-215 A8 amended (dated). The build also corrects README.md's licence sentence, and only it (A8a). DoR 10 of 10, In Design → Ready for Dev

Task `bapm-amend-ABC-215`, records only, at `main` `da480b78`. Source: Architect/Design `…e04234f4` (§ Fences).
Re-reads: this task's observation note.

## The amendment (page § Acceptance, under A8; old text kept)
- **A8 (as amended):** `git diff --name-only <base> <tip>` lists only `NOTICE`, `src/evaluate.ts`, **`README.md`**, and
  the `src/*.test.ts` / `src/__snapshots__/*` files that A2 or A5 explains. The `tools data src/levels.ts
  src/status-panel.ts` fence is unchanged.
- **A8a:** the sentence ends "…[NOTICE](NOTICE) lists them: four grugops kit files (MIT).". Line 84 is unchanged, and
  lines 85–86 become one line. The rest of `README.md` is byte-equal to `<base>`. Checks:
  - one `-U0` hunk, `@@ -85,2 +85 @@`;
  - 0 `michniewski|by-sa|chessprogramming` hits;
  - 1 `four grugops kit files (MIT)` hit;
  - `ABC-216` `A7` (Apache-2.0, `LICENSE`/`NOTICE` links, "other terms", no all-Apache sentence), `A2` (87 lines ≤ 100,
    8 headings) and `A9` (links resolve) hold at the tip.
- If `<base>` has moved the sentence, the hop note gives its lines and the result text is the same. If the sentence
  has changed or is gone: STOP to BA/PM.
- **Why in A8, not a twin ticket:** one prose sentence, and it is false only from this merge on. A twin would have to
  merge in the same window anyway. No other scope moves.
- **Dated pointers:** Scope 3 (the README sentence goes too) and Security (d) (prose only, no limb, no trigger).

## DoR re-score: 10 of 10 → Ready for Dev
- Rows changed: 2 (scope adds the sentence only), 3 (no split, per the probe), 4 (A8a measurable), 8 (L confirmed),
  10 (design ruled, no ADR, no owner word; README gap closed).
- **QE-205-c is still open and does not block.** G6 is graded as written, and `c2` is predicted to meet it
  (`UNKNOWN - verify`).

## Not this role's
- The board move and the trace row are the Orchestrator's. The `ADR-0048` status line after the merge is Architect/Design's.
- The page's frontmatter still reads `column: Ready`. Left for the Orchestrator's move.
