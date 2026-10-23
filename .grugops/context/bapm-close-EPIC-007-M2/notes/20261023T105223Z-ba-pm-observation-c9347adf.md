---
id: 20261023T105223Z-ba-pm-observation-c9347adf
kind: observation
by: ba-pm
at: 2026-10-23T10:52:23Z
verified_by: 
confidence: high (direct reads on this host: which, ls, find)
refs:
  - EPIC-007
  - ABC-168
  - M1
  - M2
  - M8
  - RISK-EPIC007-01
  - RISK-EPIC007-02
  - plans/epics/EPIC-007-the-engine-speaks-uci-so-a-chess-ui-can-play-it.md
  - 20261023T105100Z-orchestrator-decision-d3681daa
  - 20261022T133720Z-orchestrator-decision-0b63d92f
  - 20261022T185856Z-ba-pm-decision-2fddb7fa
  - 2d962400
supersedes: 
seal: sha256:7d6894cd6dc4d1429304708784a4f261fd2e764e5f7620960c27eded5e03ace3
---

# EPIC-007 M2/M1/M8(a): host and evidence re-checked, 2026-10-23, at `main` `2d962400`

- `which cutechess-cli` prints nothing (exit 1) on this host.
- `ls /Applications` lists no En Croissant and no cutechess. `~/Applications` lists no En Croissant either.
- Under every `.grugops/context/*ABC-168*` directory the only non-note file is `ticket-to-pr-ABC-168/wip-ABC-168-uci-entry-point.patch`. No result lines, no `-pgnout` file, no PGN, no `-debug` log and no screenshot exist. No `*.pgn` file is in the repo outside `node_modules`.
- So no agent observed or can observe an En Croissant game, and M1 and M8(a) cannot be read on this host today. This repeats `…2fddb7fa`'s 2026-10-22 check, unchanged.
