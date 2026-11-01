---
id: 20261101T172747Z-qe-e2e-decision-f47bc0aa
kind: decision
by: qe-e2e
at: 2026-11-01T17:27:47Z
verified_by: 
confidence: high: every figure below was run by QE at this hop under flock host-test.lock (plants 17:00–17:18Z, gates and G8 17:18–17:26Z); the gaps are MEDIUM/LOW/INFO and none fails an acceptance criterion as written
refs:
  - qe-ABC-259
  - ABC-259
  - EPIC-010
  - ADR-0056
  - R-TC
  - G-1
  - grugops/ABC-259
  - grugops/qe-ABC-259
  - 8f2fc9b5
  - f40665b1
  - e1c10e19
  - 4dbfde26
  - src/levels.test.ts
  - se-ABC-259/20261101T165554Z-software-engineer-decision-1a6787f8
  - se-ABC-259/20261101T165554Z-software-engineer-observation-727bc11a
  - se-ABC-259/20261101T165603Z-software-engineer-observation-1b9a99af
  - QE-259-a
  - QE-259-b
  - QE-259-c
  - QE-259-d
  - NFR-008
  - G8
  - UAT-waiver
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - A7
  - A8
  - A9
supersedes: 
seal: sha256:3149711666f80318c47c662c3ed68141f45cb90ca0af803c3ac8e3b527837a32
---

# qe-ABC-259 verdict: PASS_WITH_GAPS, no blocking gap (QE-259-a MEDIUM, QE-259-b LOW, QE-259-c LOW, QE-259-d INFO)

- **A1:** green at production in all three head `npm test` runs (3/3 rows), with the comment mentions present.
- **A2–A5 (re-planted out of tree by QE):** every ticket plant turns its own row red, and the message names the file and the rule. The comment-only control stays green. Q1 (destructured alias) and Q4 (a `TT_DEEP` const in transposition.ts) are also caught. See the plants note.
- **A6:** QE re-read the plants out of tree. No plant is in any commit (`git diff 8f2fc9b5 e1c10e19` touches src/levels.test.ts only under src/).
- **A7:** under src/ the diff is src/levels.test.ts only (+64/−1). No title or `expect(` line changed. The header count went 46 → 49, which the JSON confirms (base 46, head 49 passed in levels.test.ts). QE-259-d (INFO): the added comment also cites `A8`.
- **A8:** the rows' summed duration is 0.95 / 0.91 / 0.85 ms, median **0.91 ms** (budget ≤ 20 ms). The collect-time read and strip costs about 0.1–0.3 ms more.
- **A9:** lint, typecheck and build exit 0. `npm test` head ×3 passes 2 365 / 2 365; base ×3 passes 2 362; so the count is base + 3, with 0 skipped. Skip-integrity and lane-inventory report "No findings." **G8:** H 9.15 s, B 9.10 s, ALONE before all 6 runs, admissible. NFR-008 MET.
- **UAT waiver** holds: the waiver grep is empty on e1c10e19, on f40665b1 and over the whole range.
- **The gaps** do not break the ticket's literal rules. They are holes in those rules, found by plants the SE did not try. They are routed to BA/PM and the Architect, not back to the SE.
- **Merge:** `git merge-tree main grugops/ABC-259` is clean. Main differs from base 8f2fc9b5 only in src/engine.test.ts (ABC-249, +1 row), so the merged count is expected to be 2 366 (UNKNOWN - verify, the Orchestrator's post-merge gate).
