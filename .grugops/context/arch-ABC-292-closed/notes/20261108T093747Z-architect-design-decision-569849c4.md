---
id: 20261108T093747Z-architect-design-decision-569849c4
kind: decision
by: architect-design
at: 2026-11-08T09:37:47Z
verified_by: 
confidence: high on F5, d14 (c) and the door, each read from its own words; high that the cut is value-identical on the probe's corpora, its cost UNKNOWN - verify; medium on the ABC-306 and row E7 readings, open to the Orchestrator; the options' odds are judgement on the records, every Elo figure an estimate
refs:
  - arch-ABC-292-closed
  - ABC-292
  - ADR-0076
  - ADR-0076 F5
  - ADR-0076 d14 (c)
  - ADR-0076 d6
  - ADR-0056
  - ADR-0067
  - ABC-290
  - ABC-293
  - ABC-308
  - ABC-306
  - ABC-284
  - ABC-266
  - ABC-295
  - EPIC-011
  - 6b8dd230
  - bba42fb7
  - arch-ABC-292-probe/20261108T092839Z-architect-design-decision-22e36b63
  - arch-ABC-292-probe/20261108T092839Z-architect-design-observation-d277788e
  - orch-2026-10-30a/20261108T092943Z-orchestrator-decision-5bc9e701
  - orch-2026-10-30a/20261108T083900Z-orchestrator-decision-23d30c72
  - orch-2026-10-30a/20261108T085342Z-orchestrator-decision-e63ff24f
supersedes: 
seal: sha256:3b6931ffa72a23e4767391ddabaff4be1a817c12834f85cdf30c304175b98282
---

# arch-ABC-292-closed decision: `ADR-0076` stays accepted, not in force, and d14 (c) applies. His stop has fired, and the third-pull door stays shut. d6's cut is real on `main` and small: no ticket of its own. For the owner: 3 000 is not in reach on what is left; one cheap search probe, then pause

Architect/Design, task `arch-ABC-292-closed`, records only, on `grugops/arch-ABC-292-closed` from `main` `6b8dd230`. Nothing was run. Inputs: `…22e36b63`, `…d277788e` (`arch-ABC-292-probe`); the Orchestrator's `…5bc9e701`; the owner's `…23d30c72`, `…e63ff24f`; `ADR-0056` D2, D5, D6; `ADR-0067`; `ADR-0076`. Readings: this task's observation note.

## 1. `ADR-0076`: F5 fired
- **Accepted, not in force.** Not withdrawn: he accepted it, and F5 names this state for a miss once accepted. No merge is left to wait for.
- **d14 (c) applies.** No new numbers for the three exports, no subset, no re-play. Not being in force does not loosen it.
- **Dated lines:** § Status and log, d6, d14 (c), § The plain case, § What would falsify this (with a table of what each line reads now), § Consequences, § Rollback. § Rollback's strike is not taken, as on `ADR-0075`.
- **The queue:** `arch-ABC-292-probe`'s brief and claim go to `done/`, with a Result line pointing at `…22e36b63`.

## 2. `ADR-0056` and `ADR-0067`: the stop fired
- **`ADR-0056` D2** (rows E3, E5, E6), **D5** (no C2′ began; a probe miss is F5, not B6), **D6** (step 3 spent on E4b and E5; step 4 cannot be asked; what Phase 4 does next is his).
- **`ADR-0067`:** no term merged, so the door stays shut. The wait's lines stand. No miss on row E2.
- **Two readings, open to the Orchestrator, written in D2:** `ABC-306` on hand values would sit on the stopped path, by `…e63ff24f`'s own reading. Row E7 (`ABC-272`, `ABC-294`) is not named in his ruling; it is hand-set evaluation, so I would ask him before it is built.

## 3. d6's cut on `main`, without the term
**It means something, and it is small. No ticket of its own.** The cut, `kingExposure` reading file sets from the pawn memo in place of its six-rank scan, needs no term. Its value identity is read: on the probe's tree its off evaluation equals `main`'s `evaluate` on 28 400 positions. Its cost is not read. By d6's estimate it buys −5 to −10 % a call, about 1 to 3 Elo, by the method that was low by four last time. Alone it needs d4's file word and the `doubled`/`isolated` fold (or +4 bytes a slot) and one held `G2` session, with no games. That is not worth a held window by itself. It belongs in a speed ticket if he picks one (option 6 below). Its order is the Orchestrator's.

## 4. For the owner: what is left on the way to 3 000, in plain words
**Where things stand.** The last outside reading put the engine near 1 800 at 100 ms a move, before three changes that passed. Hand-set evaluation terms have now failed every time, and tuning failed twice. The design said 3 000 needs a tuned evaluation. **So 3 000 is not in reach on what is left.** What remains are small search steps, none measured.

| option | what it costs | odds, as honestly as the records allow | my read |
|---|---|---|---|
| **1. Pause `EPIC-011`** | nothing | keeps what passed; gives up small steps | **yes, after option 2** |
| **2. Late-move reductions, P1 (`ABC-284`), probe first** | probe under 30 min, which can only stop it; if it passes, a build and one read, about 1 to 1¼ h | the largest search estimate left, +40–100 by guess. But 13 versions failed two earlier probes on the same two rows. The engine has changed since, so it is worth one look. I'd put the probe passing below even. If it reaches games, search changes passed 4 of 5 reads here | **yes, once** |
| **3. Other held search work** (`ABC-257` table re-use, X1, X2, V3; P5, P6) | each a probe, then about 1 h | small guesses (+10 to +50), mostly untried. P5 cannot be seen at 100 ms. P6 waits on a tuned table that may never come | not now; next only if 2 passes |
| **4. Threads (`ABC-266`)** | about 30 min to re-probe, then a large ticket | at 100 ms extra threads gave no extra depth. Any gain would show at long time controls, which our quick games cannot see. Reading it needs more than one core, against your one-core rule | no |
| **5. A tuning pull without a merged term** | about 20 min to the safety row, then up to about 6 h | poor. Four tuned tables of four failed the same safety row. Nothing new exists to tune on, and a miss ends tuning for good | no |
| **6. End tuning for good** | no host; it permits one small speed ticket: remove the unused zero-valued terms, plus d6's cut | gives up tuning's +100–250 guess, never measured. Speed gain a few Elo, unmeasured | your call; waiting costs only that small speed |
| **7. A closing strength reading (R2, `ABC-295`)** | about 0.4 to 0.9 h | gains nothing; tells you where the engine stands now | yes, at the pause |

**My recommendation:** run P1's probe once. If it passes, build and read it. Either way, then pause `EPIC-011`, with R2 as the closing reading. Keep tuning on "wait"; ending it is yours, and nothing forces it now. If you do not want even the probe, pause now. That is a fair answer too.

## For the Orchestrator
- The options read is for him, in your words. Every figure is in the observation note.
- BA/PM's `bapm-ABC-292-closed` owns the pages. Nothing here moves a page, ticket, EPIC or board line.
- The two readings in § 2 are yours to confirm or overrule.

## Confidence
High on F5, d14 (c) and the door, each read from its own words. High that the cut is value-identical on the probe's corpora; its cost is `UNKNOWN - verify`. Medium on the two readings in § 2. The odds in § 4 are judgement on the records, and every Elo figure is an estimate.
