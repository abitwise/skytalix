---
id: 20261108T171150Z-orchestrator-decision-00cde110
kind: decision
by: orchestrator
at: 2026-11-08T17:11:50Z
verified_by: 
confidence: medium
refs:
  - ABC-284
  - ADR-0060
  - …9ae6cff1
  - …2476937b
  - …4d1e0382
supersedes: 
seal: sha256:097573e3dadd399fd4899f95851da4a1ad05d76cee4decd62932a26262244a33
---

## arch-ABC-284 merged; P1's try back to the owner

Merged `grugops/arch-ABC-284` (tip `032fb620`) at `88b1a7ec`, path check clean. `ADR-0060`'s re-open written PROPOSED (§ The 2026-11-08 look): decision 1 unchanged, probe LR1–LR11 written not run, QE's freeze first.

The Architect recommends **not** re-opening: `zugzwang.004` at d11 and the same-depth mate floor were lost on every tree with futility in it, and `main` has futility; no reason beyond a guess. Odds the probe passes every row: below one in ten, by judgement (his earlier "below even" corrected down).

**My recommendation to the owner:** skip P1's try. A probe can only stop it, so it is cheap (a QE freeze hop and about 25 min of host), but at under one in ten it is the worst-odds step left; his host time does more on option 3. Instead: the Architect ranks the held search tickets (option 3) by odds on today's `main` and writes the best one up, probe-first, one at a time. Keep the same-depth mate floor bar (his q4): yes. A miss on P1 final, if he takes the try anyway: yes.

`ABC-284` stays In Design until he answers.
