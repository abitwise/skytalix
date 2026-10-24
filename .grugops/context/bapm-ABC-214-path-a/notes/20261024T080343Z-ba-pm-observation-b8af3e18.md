---
id: 20261024T080343Z-ba-pm-observation-b8af3e18
kind: observation
by: ba-pm
at: 2026-10-24T08:03:43Z
verified_by: 
confidence: high (each line re-read at this hop with the command named)
refs:
  - ABC-214
  - ABC-205
  - ABC-215
  - OD-214-1
  - d4d49c5a
  - c487d89c
  - 4f650a45
  - arch-design-ABC-205/20261023T215851Z-architect-design-decision-1fb6e1bc
  - ticket-to-pr-ABC-205/20261023T222449Z-software-engineer-decision-18a6a03c
  - owner-word-2026-10-24/20261024T105800Z-orchestrator-decision-fb0468ff
supersedes: 
seal: sha256:10735ac6275ece04365a427ab724f0779de10026cc767548da07fe2d5f680900
---

# ABC-214 path A: readings at main d4d49c5a, and ABC-205's built king tables (pre-read for ABC-214 A5)

BA/PM, task `bapm-ABC-214-path-a`, records only. Input: owner word `owner-word-2026-10-24` `…fb0468ff` (OD-214-1 = path A).

## ABC-214's readings still hold at d4d49c5a
- `git diff --stat c487d89c d4d49c5a -- src/evaluate.ts package.json package-lock.json src/cli.test.ts biome.json src/line-input.test.ts src/cli.real-engine.test.ts tools/grugops` prints nothing.
- `src/evaluate.ts`: the seven arrays at `:43` PIECE_VALUE, `:61` PAWN_TABLE, `:73` KNIGHT_TABLE, `:85` BISHOP_TABLE, `:97` ROOK_TABLE, `:109` QUEEN_TABLE, `:121` KING_TABLE. The Michniewski credit is `:16-20`. `grep -ciE 'michniewski|by-sa' src/evaluate.ts` = 2.
- `package.json:5` is `"license": "UNLICENSED",`. `src/cli.test.ts:1866` is the `private` assertion.
- `git ls-files 'LICENSE*' 'NOTICE*' 'COPYING*' 'README*'` prints nothing.
- A5's base check (transpile identity against c487d89c) therefore holds at d4d49c5a.

## ABC-205 as built (grugops/ABC-205 @ 4f650a45, not merged)
- Design ruling `…1fb6e1bc` item 2: mg = `KING_TABLE`, unchanged; eg = our own `40 − 15·m`, "no Michniewski endgame table".
- The branch adds `KING_ENDGAME_TABLE` (comment: "this project's own (no third-party values)"). The header's line 20 gains "The king endgame table is this project's own."
- **Consequence for ABC-214 A5:** if ABC-205 merges as built, the carve-out list stays the same seven names. Item 7's two lines still go directly after line 20.

## ABC-205's build as size evidence for the re-derive (ABC-215)
- `…18a6a03c`: tapering one table moved 11 ruled rows and 3 deep pins, and went past one ADR-0026 level (d5 drift 79 > 75 cp → OD-205-2).
- `search.qe.test.ts:15-21`: nothing asserts the material values directly. Swapping ROOK/QUEEN left every test green.
- `src/status-panel.ts:77` has its own P1 N3 B3 R5 Q9 K0 scale, not Michniewski's.

## Board facts read (not edited)
- Ready WIP 0/8. ABC-204 In Review, ABC-205 In Development, ABC-207 and ABC-211 in Backlog. Next free id: ABC-215 (no ticket file on any local branch).
