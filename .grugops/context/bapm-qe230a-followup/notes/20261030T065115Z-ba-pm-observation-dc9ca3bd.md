---
id: 20261030T065115Z-ba-pm-observation-dc9ca3bd
kind: observation
by: ba-pm
at: 2026-10-30T06:51:15Z
verified_by: 
confidence: high on the source lines as read at 691f9436; the parent-root count's effect and the frequency are UNKNOWN - verify
refs:
  - bapm-qe230a-followup
  - ABC-242
  - ABC-230
  - ABC-241
  - EPIC-010
  - ADR-0054
  - ADR-0032
  - qe-ABC-230/20261030T064100Z-qe-e2e-decision-ba5a249a
  - QE-230-a
  - main 691f9436
  - 24f3e322
  - ABC-226
  - ADR-0020
  - src/levels.ts
  - src/level-seam.ts
  - src/uci-session.ts
  - tools/rating/rating.ts
supersedes: 
seal: sha256:f91d0ff097b726eb7569cb91ac68d233d976d980636872e9b33a494734f49be4
---

# bapm-qe230a-followup: the source facts behind ABC-242 (blunder path, both surfaces, smoke harness, ep key), read at main 691f9436

BA/PM, task `bapm-qe230a-followup`. Read-only source reading at `main` `691f9436`; nothing run beyond `grep`/`sed`. No tests or builds (an SE timing read for `ABC-228` was running on the host).

## Facts read
1. **The blunder path.** `src/levels.ts` `createLevel` (`:124-145`): a blunder draw builds `childKeys = [...priorKeys, zobristKey(position)]` (`:142`) and calls `blunder`, which for each legal move runs `chooseMove(position after move, { priorKeys: childKeys })` and scores `-child.score` (`:164-186`). A child with no legal move is already scored directly (mate `MATE_SCORE − 1`, else 0, `:175-177`): the path already has a "score the child root without searching" branch.
2. **Why the root move is missed.** `ADR-0054` decision 3 scans at full-width nodes at ply `p ≥ 1`. The child's root is ply 0 of its own search, so its own key is never compared with `priorKeys`. This matches QE's probe (`qe-ABC-230/raw/spot/blunder-probe.txt`: `d8e8` −1013 with and without keys, whole list identical, seed 1).
3. **Both surfaces reach it.** CLI: `src/level-seam.ts` → `createLevel(…)(history.position, priorKeys)`. UCI: `src/uci-session.ts` `go` → `createLevel` when `LEVELS[skill].blunderRate > 0` (`:316-324`), else `chooseMove` with `priorKeys` (`:333-337`). Default `skill` is `DEFAULT_LEVEL` (5, rate 0).
4. **The smokes cannot reach it.** `tools/rating/rating.ts` `sky(…)` (`:377-387`) passes `st=` and `timemargin=` only, with no `option.Skill Level`. So every D and R smoke move (and every batch move) is level 5's engine path.
5. **The ep key does not decide the result.** `ADR-0054` § Context: `makeMove` sets an ep square only on a double push, which resets the halfmove clock. A child root with clock ≥ 1 therefore carries no ep square, so its raw `zobristKey` equals its `ABC-241` repetition key. A child root with clock 0 has no reversible window. So `ABC-242`'s comparison gives the same answer before or after `ABC-241`.
6. **Recorded, not scoped (for the Architect).** In a child search the parent root's key sits at prior index −1, so a line that returns to the parent root counts it under the pre-root rule (two matches). On the engine path the same position is `keys[0]`, path (one match). This is BA/PM's reading of `ADR-0054` decision 3 against `:142`. Whether it changes any score is `UNKNOWN - verify`; no probe was run.

## Not known
- How often QE-230-a decides a game at levels 1–4 (`ABC-226` read level 5 games only): `UNKNOWN - verify`.
- The check's time per blunder call on this host: `UNKNOWN - verify`, at most `min(L, c)/2` ≤ 50 comparisons per root move by `ADR-0054` decision 8's arithmetic; `G5` reads it.
