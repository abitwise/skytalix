---
id: 20261011T100239Z-architect-design-observation-abc085-abc144-handoff-routing-and-owner-questions-be323233
kind: observation
by: architect-design
at: 2026-10-11T10:02:39Z
verified_by:
confidence: high
refs:
  - ABC-085
  - ABC-144
  - ABC-083
  - ADR-0038
  - ADR-0040
  - 20261011T100239Z-architect-design-decision-abc085-verdict-runs-under-plain-node-same-harness-adr0038-addendum-2566e813
  - 20261011T100239Z-architect-design-decision-abc144-adr0040-addendum-window-a-rules-k3-7974985e
supersedes:
---

# Hand-off: what goes next, who owns it, and the owner's questions

This note is hand-authored and unsealed. This hop did not edit `plans/board.md`, `src/` or `vitest.config.ts`,
and it moved no column.

## Owed by other roles

- **Orchestrator:**
  - put both ADR addenda to the owner (questions below);
  - choose where the `ABC-085` verdict build goes. Recommended: the pre-registered split `XS`, after QE passes
    `A3`–`A6`;
  - never schedule the verdict run, under either runner, over a no-other-hop window.
- **BA/PM:**
  - cut the split `XS` if the Orchestrator takes it. Its scope is `ADR-0038` addendum items 1–4, plus the
    verdict run at step 4 on a tree containing `ABC-083`;
  - on `ABC-085` § Security / NFR triggers, the cost table gains a "runner" column (plain `node` ~10 h / vitest
    ~43.5 h);
  - on `ABC-144`, an optional dated line: "head resolves 3 (`ADR-0040` addendum)". `A2`'s bar (≤ 4) is
    unchanged;
  - **decide whether to cut a diagnostic ticket:** what the vitest ~4.35x per-node overhead is, and how much
    of the default lane's CPU it accounts for. It is a possible CPU lever for the owner's "reduce cpu usage",
    outside `ABC-144`'s three settings. It is not a dependency of anything here.
- **Software Engineer (`ABC-144` build):**
  - build k = 3, not 4. The pin's three literals and red r3b are in `…7974985e`;
  - the rest of `…df7355cf` stands.
- **Security/NFR (Window B):**
  - log `com.apple.system.thermalpressurelevel` before and after every run;
  - never report the `CPU_Speed_Limit` column as a reading.
- **Scribe:** the `AGENTS.md` `LADDER_DEEP` line (`…8515e3e7`) stays as drafted until the `ADR-0038` addendum
  is accepted and built.

## Questions for the owner (Olger Oeselg), through the Orchestrator

1. **Accept the `ADR-0038` addendum?**
   - The verdict mode would run the same harness under plain `node` from `tools/ladder/`.
   - That is ~10 h of one core, against ~44 h inside vitest, for identical games, checked by digests before
     any verdict.
   - If you decline, the verdict runs inside vitest at ~44 h.
2. **Accept `ADR-0040` with its addendum: 3 workers, not 4?**
   - The pre-registered rule picked 3. 4 cut only ~11 % CPU, and the bar was 15 %.
   - 3 costs about +1 s of warm wall (7.2 s).
   - 2 would cut ~23 % at 8.2 s. Choose it only if heat is what "choking" means to you: the Air reached
     moderate thermal pressure after ~6 minutes of back-to-back test runs.
