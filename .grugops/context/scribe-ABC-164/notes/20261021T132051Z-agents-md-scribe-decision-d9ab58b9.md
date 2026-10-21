---
id: 20261021T132051Z-agents-md-scribe-decision-d9ab58b9
kind: decision
by: agents-md-scribe
at: 2026-10-21T13:20:51Z
verified_by: 
confidence: high on the split and its measurements; medium on the A4 method (QE may read strictly)
refs:
  - ABC-164
  - ABC-173
  - ABC-109
  - AGENTS.md
  - 20261021T125254Z-agents-md-scribe-observation-ffbb746f
  - 20261021T125315Z-agents-md-scribe-decision-38d2af93
  - 20261021T131002Z-ba-pm-decision-a7cd9ce2
  - 20261021T131002Z-ba-pm-observation-d197dcbd
  - 20261021T130200Z-orchestrator-decision-18e4ada0
  - grugops/ABC-164
  - e82a3798
  - memory-bank/45-standing-rulings.md
  - memory-bank/90-agents-md-command-log.md
supersedes: 
seal: sha256:7483624d7f2950bb00998283484421d2e11f3d1be2f6f6b73a3f11bf8c0204c1
---

# ABC-164: Option A split built as the page says; five files, 15,606 B; rulings made at the build

**Result.** AGENTS.md 24,575 -> 15,606 B, headroom 7.74 edits at the unchanged 24,576 B constant. All A1-A7 hold on my readings (observation beside this note). QE owns the independent read. Branch grugops/ABC-164, tip e82a3798 (the done record is on main, uncommitted).

**Rulings I made, so QE and the Orchestrator can overrule them.**
1. **O1 wording.** The page's O1 says "pass the main checkout's .grugops/context as contextRoot". The brief for this hop says to pass the worktree. The AGENTS.md line says "the .grugops/context of the checkout you work in (the default root is the plugin's own directory)", which covers both. A6 only needs the string contextRoot.
2. **A4 method.** A whole-run match cannot reach 0 under Option A, because every lane keeps its command line in AGENTS.md while its comment moves. I measured at token level (what the added lines do not carry) and listed the three miss kinds in the 90 entry. The page's three named exceptions cover them. If QE reads strictly by whole run it will see more misses; each is a command line that is still at head.
3. **Standing rulings section.** Seven operative bullets carry only sentences found verbatim in 45, plus one pointer paragraph. Beyond the 11 required strings I kept four sentences of the same rulings: the green-report-is-not-acceptance sentence, the "unfiltered form is the reference measurement" sentence, "A waiver is not a signature", and "A reader who counts four is wrong". Each is in 45 verbatim.
4. **90 additions beyond the page.** The Reader paragraph names QE and the Software Engineer. Moved text carries a one-line "Moved from AGENTS.md by ABC-164" tag above it; those tag lines are new prose, the moved text under them is not reworded. The ladder section's O3 text cites ADR-0038 addendum 2, run 2's reading 4c1d8e27, the Architect's reporter ruling b7e2c915 and the Orchestrator's move ruling 6a2f9d03. Run 2's wall time (40,823 s) comes from the reading note.
5. **QE-hop pointer line.** The Orchestrator's check before a row moves to Done is a new pointer clause, consistent with 40-contributing.

**Flags, not acted on (out of fence).**
- src/cli.test.ts:2242 is a comment saying AGENTS.md carries "13 further closers after this slot's own". It now carries 8 comment closers after the slot's. Stale comment, no assertion; an Engineer matter (BA/PM flagged it in d197dcbd).
- The 24,576 B budget constant is unchanged; lowering it is the open owner decision. At 15,606 B the audit's 18,432 B fits with 2,826 B of room.
- AGENTS.md:NNN citations in tickets and notes are now historical.

**No test was added or changed. No timing was taken.**
