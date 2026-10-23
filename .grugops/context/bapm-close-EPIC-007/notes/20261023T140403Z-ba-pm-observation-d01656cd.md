---
id: 20261023T140403Z-ba-pm-observation-d01656cd
kind: observation
by: ba-pm
at: 2026-10-23T14:04:03Z
verified_by: 
confidence: high (records read plus read-only spot checks on main a2d7dda7; nothing built or timed)
refs:
  - EPIC-007
  - M1
  - M2
  - M3
  - M4
  - M5
  - M6
  - M7
  - M8
  - M9
  - M10
  - M11
  - QE-202-d
  - ABC-202
  - ADR-0045
  - RISK-EPIC007-01
  - RISK-EPIC007-02
  - a2d7dda7
  - plans/epics/EPIC-007-the-engine-speaks-uci-so-a-chess-ui-can-play-it.md
  - 20261023T135324Z-qe-e2e-decision-632c11f1
  - 20261023T105223Z-ba-pm-decision-b5f65536
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
  - 20261022T185856Z-ba-pm-decision-2fddb7fa
  - 20261019T130500Z-orchestrator-decision-owner-word-adr0045-accepted-q1-q3-abc171-rows-1a9c7f42
  - 20261020T130500Z-orchestrator-decision-ecff6698
supersedes: 
seal: sha256:9165eb98e11fbaeba30b5d5ecb564649e15f52bc9cb1b4ff056d22da6e12a679
---

# EPIC-007 M1–M11 read against their evidence at `main` `a2d7dda7`: 10 MET, M2 closed by acceptance, 0 NOT MET; three rows carry text that ADR-0045 or ABC-202 outdated

Records read, plus read-only spot checks on this host (Apple M3, node v26.11.1). Spot-check output:
`scratchpad/bapm007c/spot-checks.txt`, sha256 `de4f0b54…7ece`. Nothing built, nothing timed, no gate run.

## Tickets
All 13 pages with `epic: EPIC-007` are `status: done`: ABC-167…172, 177, 178, 189, 190, 197, 199, 202.

## Per measure
| M | state | evidence |
|---|---|---|
| M1 | MET | ABC-202 `…202e80c8`, verdict `…632c11f1`: 6/6 pass texts, 0 illegal/forfeit/disconnect/stall, min clock 13.29 s, at default = Skill Level 5 |
| M2 | closed by acceptance, not read | owner `…d3681daa` on `…0b63d92f`; BA/PM `…b5f65536` |
| M3 | MET | ABC-168 A6 86.1/6.9/0.2 ms vs 2000/1000/100 (`…1b96c204`, on unmerged `grugops/qe-ABC-168` @ `7e831392`); owner confirmed A6 as proof `…4ab163ef`; NFR-011 `…75a45be0` |
| M4 | MET | ABC-167 A11 (`…c02ebd96`, UAT `…8f1b3a6d`), ABC-171 A11 (`…d60ef4d9`, UAT `…5c8d2f71`), ABC-168 A5 UCI_DEEP (`…7547ac22`); catalog row (iii) ruled not placed (same pin, second home) |
| M5 | MET | ABC-170 A3 sweep (`…09d90757`, UAT `…3b8d51e6`); ABC-168 A11 D2 list unchanged (`…7547ac22`); ABC-167 A12. `git log` over cli*/levels tests and the D2 list: the only EPIC-007 commits are 344a4128 (+1 AT_HEAD `license`), 825b21d1 (Scope 6 bin pins), deb555d2 (+1 bin value pin, ABC-189), 243c2fdf (comment count 8→9). No behaviour row edited |
| M6 | MET | ABC-171 A3/A4/A9 (`…d60ef4d9`, UAT `…5c8d2f71`); ABC-168 A5 real file (`…7547ac22`) |
| M7 | MET at ADR-0045 table | `src/uci-session.test.ts:828-846` rows [1,100],[3,330],[5,3000]; A2 rows keep old level on 0/6/2.5/x/constructor; live: `default 5`, `value 9` → one `info string … kept 5`; `src/levels.ts:45-53`. Owner accepted ADR-0045 `…1a9c7f42`, ABC-174 UAT `…ecff6698` |
| M8 | MET | (a) `…81066c23`/`…632c11f1`; (b) `src/uci-session.test.ts:371-403` (depth 3, nodes 20000 ≤ +1024, mate 2 → d5g8), live `info depth 3 score mate 2 … pv d5g8`, ABC-170 `…09d90757` |
| M9 | MET | ABC-168 A7 fresh clone (`…7547ac22`), owner `…4ab163ef`; ABC-202 A1 fresh clone rc 0 (`…8a2be50b`). Owner's own repeat not recorded; UAT QE-signed under `…5aaf7cec` item 2 |
| M10 | MET | ABC-169 (`…bb7a6593`, merged `60227f06`); live: private true / UNLICENSED, 0 LICENSE/NOTICE/COPYING tracked, credit `src/evaluate.ts:16-19` inside the first comment block (ends :21) |
| M11 | MET | ABC-172 (`…933d8f15`, `…216ceb43`), ABC-190; live: name `skytalix`, lock `name` ×2 `skytalix`, 0 `cli-chess` outside plans/memory-bank/.grugops; npm ci rc 0 (`…8a2be50b`) |

## Stale page text found
- M1: "Skill Level 3", "raw under ABC-168's context" (QE-202-d).
- M8(a): "raw under ABC-168's context", `-debug` (pinned `-debug all`).
- M7: "default 3", "3 000 ms at level 3", "3 500 ms at level 5" (ADR-0045 D1/D2/D4; ADR-0045's acceptance folds named ADR-0044 D11 and ABC-171, not EPIC-007).
- § v1 — in: "default 3"; § v1 — NOT in: "Skill Level 1 and 2" ignore go limits (now 1–4, ADR-0045 D4).
- RISK-EPIC007-02: its condition (no cutechess-cli) ended (`…7ea41eea`, `…632c11f1`).
