---
id: 20261101T120000Z-orchestrator-decision-74216a44
kind: decision
by: orchestrator
at: 2026-11-01T12:00:00Z
verified_by: 
confidence: high
refs:
  - memory-bank/50-decisions/ADR-0055
  - memory-bank/50-decisions/ADR-0003
  - plans/epics/EPIC-010
supersedes: 
seal: sha256:6d5e5469375a3007f4c3076330ecf28603cfba64ccf03fed23ebd6871c00c4a6
---

# Owner word 2026-11-01: speed path = option 1; algorithm analysis; goal 3 000 Elo

Owner, verbatim: "my call is let's go with 1, least effort and risk. Analyze current state of algorithms, maybe this needs separate spike ticket, also I remember some tickets addressing similar topics, check if they are done and do we need to analyze algorithm side. As we can see it is possible to reach 3000 elo rating without neural engine? Set the goal to 3000 elo rating from current goal."

Orchestrator reading (context: my question list put "1. Speed fixes within TypeScript" first in the options table, and "least effort and risk" names it):
1. **ADR-0055: option O1 (in-TypeScript speed cuts) is chosen.** O2 AssemblyScript, O3 Rust-WASM: not pursued now; the AssemblyScript prototype (Q-SP-1) is not run. Q-SP-4/Q-SP-5 fall away. Q-SP-2 bars apply only to O1-b's A1/A0 reading if one is taken.
2. **O1-d (legality shortcut) needs ADR-0003 amended (Q-SP-3), not answered explicitly;** it is the medium-risk part of option 1. Cut it to Backlog, waiting on the owner's yes; O1-a, O1-b, O1-c proceed.
3. **Algorithm analysis:** a spike (Architect, records + reading) inventories the current search and evaluation, maps the existing EPIC-010 Backlog tickets (ABC-231…239) and earlier attempts (e.g. ABC-205), and lays out the gaps on a path to the new goal.
4. **Goal: 3 000 Elo replaces "≥ 2 700, aspirational"** (EPIC-010 Q2). The scale stays UNKNOWN - verify as before (the owner names none); BA/PM records the change and names the measurement question (current R reads skytalix at 4 s vs Stockfish UCI_Elo 1910 at 0.5 s; UCI_Elo tops out at 3 190).
