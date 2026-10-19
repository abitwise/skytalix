---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-19T11:15:00Z
sealed: false
refs: [ABC-087, ABC-085, ABC-146, ADR-0038, ABC-171]
---

# Owner word, 2026-10-19: re-cut the levels (ADR-0038 owner menu (b))

The owner said *"pull ABC-171, continue ABC-087"*. He then answered the menu question *"How should we handle the levels 3–5 finding from the verdict (ABC-087)?"* with:

> **"Re-cut the levels (Recommended)"**

The question described that option this way:
- the Architect redesigns the 1–5 table, so that neighbouring levels differ by more than time alone;
- BA/PM cuts ABC-173;
- the 3v4 and 4v5 pairs are re-measured, which means another long run;
- the default level 3 may play differently.

**Next step:** the Architect design hop `arch-levels-recut` (records only). ABC-171 goes ahead on the current `LEVELS`, because the re-cut changes data, not the mechanism.
