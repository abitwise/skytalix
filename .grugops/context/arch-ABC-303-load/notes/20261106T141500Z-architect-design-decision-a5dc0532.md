---
id: 20261106T141500Z-architect-design-decision-a5dc0532
kind: decision
by: architect-design
at: 2026-11-06T14:15:00Z
verified_by: 
confidence: high on the reading, each line traced to CF1-CF10, C-2 and the sealed shape; medium on W, a judgement of cost against a rare branch; the move-time tail under heavy load is UNKNOWN - verify
refs:
  - arch-ABC-303-load
  - qe-ABC-303
  - ABC-303
  - ADR-0056
  - ADR-0028
  - R-CEN-1
  - R-BUNDLE-1
  - C2-prime
  - S-prime
  - CF1
  - CF3
  - CF4
  - CF5
  - CF9
  - CF10
  - FL
  - qe-ABC-303/20261106T140659Z-qe-e2e-decision-b59650bc
  - qe-ABC-303/20261106T135702Z-qe-e2e-decision-53858301
  - arch-owner-answers-1104b/20261104T220311Z-architect-design-decision-d776c0f0
  - orch-2026-10-30a/20261105T074310Z-orchestrator-decision-b836b85c
  - orch-2026-10-30a/20261105T080350Z-orchestrator-decision-0f1ab02e
  - orch-2026-10-30a/20261105T215707Z-orchestrator-decision-43e6d8fd
  - qe-ABC-264-p2/20261102T142816Z-qe-e2e-observation-3af11ebd
  - qe-ABC-268-p2/20261102T204714Z-qe-e2e-decision-186a743e
  - qe-ABC-269/20261103T122410Z-qe-e2e-observation-2c51ee30
  - qe-ABC-282/20261105T075623Z-qe-e2e-decision-6b4674af
  - qe-ABC-282/20261105T113537Z-qe-e2e-observation-1434a7d1
  - secnfr-census-1105/20261105T115526Z-security-nfr-decision-b9038a14
supersedes: 
seal: sha256:86b1a9730299558bf194afd2e6dd57762dea86c3ca2250180c7c670a15a367d5
---

# arch-ABC-303-load: foreign load changes no line of a C2′ or S′ read. A played read is never voided for it. Load is logged and reported (FL), and `ABC-303`'s games wait for an owner-held window (W). No bar moves, and no word of CF1–CF10 moves

Architect/Design, task `arch-ABC-303-load`, on QE's stop `…b59650bc` (Q1) under CF10. Records only: no test, build, game or engine ran. The whole reading is `ADR-0056` D5's dated block of this task, with one pointer under "What QE copies". Q2 is the Orchestrator's ruling and is not read here.

## The answer
Option (a) is the rule, on this read and every later C2′ the Reach line names. Option (c) is a launch condition on this read. Option (b) is not taken. C-1 to C-3, S′'s bars and CF1–CF9 grade what happened in the games and do not ask why, so each outcome under load is already named.

## What QE's addendum carries, word for word
> **FL. Foreign load.** Foreign load during C2′ or S′ changes no line of this read. No game or read is voided, stopped, paused or played again for it, and no foreign process is touched. The read is graded as played, by its bars and CF1–CF10, whatever the host did: a clean read at or above its bar is MET; a clean read below it is NOT MET (CF5); a candidate fault or loss on time is CF1; a base fault or loss on time is UNRESOLVED, re-run once (C-2, CF9). Load does not answer CF3: if the cause is the host alone, no tree is fixed, so it is CF3's STOP with no new read, and `timemargin` and the control do not move. QE reports beside the result, by class and count: the harness's `host.log`, `fsample.sh`'s busy foreign samples of the total, the largest load1, and each side's largest move time. No verdict rides on those figures.

> **W. The window.** The first game starts only on the owner's word that the whole host is quiet, this project, `grugops` and any other, for all three stages of § 6, checked with `ps` first. A busy foreign process at that check is a wait, not a read. If load comes after the first game, FL governs and the read plays on.

FL fills H1 and goes after CF10. W is `ABC-303`'s alone. Later reads copy FL, and W is the Orchestrator's, read by read.

## Why
- **The score needs no void.** Load is not aimed at a side. At 100 ms a NOT MET (`qe-ABC-264-p2`, 44.0) and a MET (`qe-ABC-268-p2`, 58.0) each stood under foreign vitest, with the largest move at 105 and 106 ms against 104 ms quiet (`qe-ABC-269`) and a limit of 150 ms.
- **A void would move accepted lines.** On a clean low score it moves CF5 and § 6's "the read is the read". On a candidate loss on time it moves C-2, CF3's "no new read" and CF4's "another tree".
- **Its trigger would read presence, not effect.** The brief's five of seven counts how often load is there. Samples can miss a spike as well.
- **W is worth asking.** A spike can still end the bundle's one read with no verdict and no way back. W shrinks that for about 44 minutes once, beside a window he is already asked for. If he will not give it, the Orchestrator may drop W by a recorded line before the first game, and the read is still valid under FL.

## Stated, not hidden
- **The residual.** A candidate move past 150 ms with CF2 at 50.0 or more, and a cause that is the host's alone or not reproduced: CF3's STOP, no new read, no verdict, not a miss. Only his word could open another read. That word is not asked here, because it would move C-2, CF3 and CF4. If the Orchestrator wants the branch closed in advance, it is the owner's question, before the first game.
- **A correction to the brief.** "One core" is width 1, not a pin: `rating.ts` sets no affinity and the host has 24 cores. Load reaches a single move through the scheduler, the frequency and the heat, not through a shared core. The conclusion holds.
- **`UNKNOWN - verify`:** the move-time tail at 100 ms under load as heavy as `qe-ABC-282`'s A4 saw, and how load moves a score. Two reads are thin evidence.

## Standing
Within `ADR-0056`'s accepted form. Nothing the owner accepted moves. "Load does not answer CF3" is the Architect's reading of what CF3 and CF4 already say. W is a host fact, asked as one. No later PREREG is sealed at this hop, so nothing needs re-sealing.
