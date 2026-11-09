---
id: 20261109T200516Z-orchestrator-decision-4b413e8c
kind: decision
by: orchestrator
at: 2026-11-09T20:05:16Z
verified_by: 
confidence: high
refs:
  - ABC-309
  - README.md
  - src/levels.ts
supersedes: 
seal: sha256:0071bebae63a75a5e7b861c06c23dcd604daf0c7c2bae8ed6f9b486efcb5fccb
---

Rulings on se-ABC-309 (a0d041e2), with no owner question. These are delivery calls:

1. **Cute Chess step 2:** the executable-script route (chmod +x dist/uci.js; Command = the script's full path; node runs it through the shebang) meets A3's intent. It was tested under cutechess-cli 1.5.1. The step must say this route is for Linux and macOS. On Windows a shebang does not run, so it gives the simplest working alternative there, which must be tested if it can be. If it can't be tested, it is marked plainly in the README as untested.
2. **Unverified menu labels (Arena, BanksiaGUI):** no guessed label ships as fact. Each step that names a label not confirmed against the GUI's source or its own docs is reworded to name the action instead. For example: open the engine manager, add a new UCI engine, set the program to node and its argument or parameter field to the full path of dist/uci.js. An exact menu path can stay where confirmed. A3 is graded on the action being complete and correct.
3. **§ Levels, level 5 says 3 s but src/levels.ts has 4 000 ms:** this is a wrong fact in the README the ticket rewrites, so it rides in ABC-309. Re-read every cell of the table against src/levels.ts and fix any that are off (level 5 → 4 s). It is docs only; no other section moves.
