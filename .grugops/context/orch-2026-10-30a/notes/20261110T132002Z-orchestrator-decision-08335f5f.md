---
id: 20261110T132002Z-orchestrator-decision-08335f5f
kind: decision
by: orchestrator
at: 2026-11-10T13:20:02Z
verified_by: 
confidence: high
refs:
  - README.md
  - ABC-313
  - ABC-312
  - bin/skytalix-uci
supersedes: 
seal: sha256:06ce12e9e0fb54cb7030b49f142a6df69e5eac62728c72f1044076d44c0c4756
---

Owner, 2026-11-10: "en croissant works on mac with bin/skytalix-uci, I just played one game and lost :D". This is the owner's own run: bin/skytalix-uci on macOS, in En Croissant, one full game played. It is cut as ABC-314 by this note (README.md only). Acceptance:

- **A1.** The README states what was run and no more: on 2026-11-10 the owner played one game against skytalix in En Croissant on macOS through `bin/skytalix-uci`. Update exactly these places on main: the En Croissant row's "Run with skytalix" cell (line ~90); "It has been run on Linux only." (line ~95) becomes a sentence naming Linux and macOS; the per-OS launcher line "**macOS:** … Not run on macOS." (line ~100); the En Croissant section lead (line ~181), whose "These steps … have not been tried in En Croissant." is replaced by a statement that they were followed on macOS by the owner. Keep "The Windows launcher is untested." and every other untested/not-tried statement (Arena, BanksiaGUI, Cute Chess launcher, Windows, Linux-in-En-Croissant). The old sentence about his hand-made launcher may stay or go; no claim about En Croissant on Linux or Windows.
- **A2.** No other change. Art cmp passes; lint passes; diff is README.md plus records; paths stay out of records.

QE checks it, and QE's verdict signs UAT.
