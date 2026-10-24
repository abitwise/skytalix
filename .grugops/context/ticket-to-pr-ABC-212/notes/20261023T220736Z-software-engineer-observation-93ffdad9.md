---
id: 20261023T220736Z-software-engineer-observation-93ffdad9
kind: observation
by: software-engineer
at: 2026-10-23T22:07:36Z
verified_by: 
confidence: high: each row read red at head with its assertion message
refs:
  - ABC-212
  - EPIC-004
  - ADR-0045
  - ADR-0044
  - NFR-004
  - NFR-008
  - 8e101313
  - c735577f
  - grugops/ABC-212
  - arch-design-ABC-212/20261023T215005Z-architect-design-decision-d2c68ace
  - arch-design-ABC-212/20261023T215005Z-architect-design-observation-2146d8c6
  - plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
supersedes: 
seal: sha256:8e75b71e18118aee32c379e061469822b7a6d1c7187534c0ee448c2cd2538b48
---

# ABC-212 STOP: 8 existing rows outside A13 + ruling 4 go red; the one-line edit each needs

Each is a direct consequence of the accepted spec (levels 6–7 exist; boundary 0/6 → 0/8). None is in A13 or the Architect's four additions, so the SE did not edit any of them. Licence needed from Architect/Design (A13 says BA/PM).

| # | row | why red | proposed edit |
|---|---|---|---|
| U1 | `src/cli.test.ts:1340` ABC-042 A6(i) `TABLE_LEVELS` | the hand transcription is `1`–`5` | add `"6", "7"` (and "five" → "seven" in its comment) |
| U2 | `src/cli.test.ts` ABC-042 A8 `numbersIn("cli-options.ts")` | `6`, `7` are new numeric literals | expected list adds `"6", "7"`; comment `1`-`5` → `1`-`7` |
| U3 | `src/cli.test.ts:2331` ABC-065 A3 | AGENTS.md "Dev / run" documents `--difficulty 1\|2\|3\|4\|5` | **no test edit**: goes green when the Scribe's A11 AGENTS.md line lands; merge must carry both |
| U4 | `src/cli.test.ts` ABC-101 A7 | regex pins `export type Difficulty = 1 \| 2 \| 3 \| 4 \| 5;` | regex → `… 5 \| 6 \| 7;` |
| U5 | `src/cli.test.ts` ABC-101 A8′ own-key list | `6` is now an own key | `6` → `8` in the refused key list |
| U6 | `src/levels.test.ts` ABC-174 A1 deep-equal | `toEqual` of the 5-row table | add rows 6 = 5 000/0, 7 = 30 000/0 |
| U7 | `src/startup-questions.test.ts:250` ABC-200 A4 | answers `6` as a wrong answer | `6` → `8` in the input, title and `'"6"'` check |
| U8 | `src/uci-session.test.ts:718` ABC-171 A2 invalid values | `6` is now valid | `"6"` → `"8"` |

The Architect's probe ran with `HARD_CEILING_MS` only (no `LEVELS[6]`/`[7]`), which is why U1–U8 were not seen there.
