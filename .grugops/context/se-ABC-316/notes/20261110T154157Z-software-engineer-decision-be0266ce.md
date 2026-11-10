---
id: 20261110T154157Z-software-engineer-decision-be0266ce
kind: decision
by: software-engineer
at: 2026-11-10T15:41:57Z
verified_by: 
confidence: high
refs:
  - se-ABC-316
  - ABC-316
  - grugops/ABC-316
  - ebbeb615
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
  - src/levels.ts
  - orch-2026-10-30a/20261110T153717Z-orchestrator-decision-20c41f8c
supersedes: 
seal: sha256:4ef4fe6819ada8676d3b1c43850559605236715928429667e381e1f3bb154a90
---

se-ABC-316 choices within A1:

1. Under `--skill`, R1's 2600 cap is not applied. The cap is the `--elo` > 2600 refusal at `--budget-ms 100`, and L1's budget is also 100 ms. The cut says "`--elo` keeps 1320–3190", so the cap stays tied to `--budget-ms 100` only. A test pins 2601 and 3190 as accepted under `--skill 1`. If the orchestrator wants the cap at L1, it is a one-line change.
2. A new `ArgSpec.level` field carries the level. Reusing `skill` alone (the `rpair` path) would have needed `stockfishSt` and `SHORT_MARGIN_MS` to change. That would move `rpair`, or `d --budget-ms 1000` if L4's 1000 were added to the margin map. `level` gives skytalix margin 50, Stockfish `st` = budget, and the Skill token; `rpair` and `d` never set it.
3. The tests live in `tools/rating/pair-check.ts` (offline `node --test`), where every earlier harness argv test lives (ABC-247/255/275/300). There is no vitest file for the harness, and it loads tool paths from env at import.
4. The usage text gains `[--budget-ms 500|100 | --skill L]` on r's line and one `--skill:` row. The A5 usage-text test was updated to match. `rpair` and `d` prints are otherwise unchanged.
