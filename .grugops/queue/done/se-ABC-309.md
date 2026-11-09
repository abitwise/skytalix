---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-09T19:57:19Z
subtask: se-ABC-309
role: software-engineer
ref: .grugops/context/se-ABC-309/
branch: new grugops/ABC-309 from main
width: README.md only (plus the ticket's Result block and your notes). No src/, test, ADR, EPIC or board.
---
# ABC-309: the README
Read ABC-309's page whole, with its dated lines (bapm-close-1109b …4fa32cf1). The art file assets/readme-art.txt is now committed on main (18bb1a93), so DoR row 10 is met: 10/10.
1. Replace README.md's title block with the art, byte-equal to assets/readme-art.txt, inside a ```text fence. Check it with the page's sed | cmp command.
2. Expand § Use with a chess GUI into step-by-step setup for Arena, Cute Chess and BanksiaGUI only, covering the page's 4 items per GUI. Document all three UCI options as the page gives them, and verify each against src.
3. State R2's strength and its scale exactly as the page words it: X = 1 902.5 ± 49.1, 200 games at 100 ms a move against Stockfish 19 UCI_LimitStrength at UCI_Elo 1 810, 63.0 %. Say plainly that it is not a 40/15 rating.
4. Drop the FIGlet credit line from § Licence.
5. Meet every acceptance row on the page and show the evidence for each: relative links resolve, and the GUI steps are checked against the real menus as far as you can verify. Mark any menu label you cannot verify as `UNKNOWN - verify` in your note. Never guess it silently.
Keep the README's current plain style; do not write marketing copy. Docs only, so no test run is owed. If you run anything, run it as `flock <scratch>/<home>/<repo>/host-test.lock <cmd>`.
Publish sealed notes (contextRoot = your worktree's .grugops/context; `at` from `date -u` run immediately before each note). Commit after running `node tools/grugops/records-path-check.js --base main`. No push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".
