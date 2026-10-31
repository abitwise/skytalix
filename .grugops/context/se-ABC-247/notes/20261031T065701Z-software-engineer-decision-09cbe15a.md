---
id: 20261031T065701Z-software-engineer-decision-09cbe15a
kind: decision
by: software-engineer
at: 2026-10-31T06:57:01Z
verified_by: 
confidence: high
refs:
  - ABC-247
  - EPIC-010
  - ADR-0053
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
  - grugops/ABC-247
  - 02f4f3d4
  - 4cd261c1
  - orch-2026-10-30a/20261031T065500Z-orchestrator-decision-fb0c8978
  - qe-EPIC-010-m1-batch
  - QE-M1B-a
  - ABC-225
  - QE-225w1-a
supersedes: 
seal: sha256:b201cc3fbcb97303c7af62c8f29350722c3757806c8a14177b35319de5fbe82b
---

# SE decision, se-ABC-247: how rpair carries Skill Level 6

- **Carrier:** a new optional `ArgSpec.skill` field (`rpair` only, documented on the field), and an exported constant `PAIR_SKILL_LEVEL = 6` in `tools/rating/rating.ts`. `cutechessArgs()`'s `sky()` emits `option.Skill Level=${spec.skill}` right after `restart=on` and before `stderr=` when the field is set. `rpair`'s `argsOf` sets `skill: PAIR_SKILL_LEVEL`; `main()` (the `r` and `d` paths) never sets it, so their argv is unchanged by construction.
- **Why the field, not a `sky()` argument:** `sky()` is a closure inside `cutechessArgs`; the field reaches it with no signature change, and it sits beside `start`, the other rpair-only field.
- **Placement:** in `r` mode (all rpair runs are `mode: "r"`) `sky()` builds only the skytalix group, so the token lands once per argv, inside `-engine name=skytalix …`, never in the Stockfish group. In `d` mode `skill` is never set, so neither skytalix nor base gets it.
- **Not touched:** `rpair`'s unread `budget: 4000` (QE-225w1-a). Folding it would change `ArgSpec`'s required shape and every caller; it costs more than nothing, so it stays (ticket § Out of scope).
- **pair-check A1 restated:** the allowed set is now `start=S`, `-rounds`, the output paths and exactly the one `option.Skill Level=6` token, asserted right after `restart=on`.
- No ADR: ADR-0053 d10's intent kept, per the Orchestrator's route (A).
