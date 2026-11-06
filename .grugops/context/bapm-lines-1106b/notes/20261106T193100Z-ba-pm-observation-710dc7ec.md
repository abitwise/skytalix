---
id: 20261106T193100Z-ba-pm-observation-710dc7ec
kind: observation
by: ba-pm
at: 2026-11-06T19:31:00Z
verified_by: 
confidence: high that each line reads as quoted; the diff's files are read from ADR-0075 d4 and the probe's patch, not from a build; which class stands is UNKNOWN - verify
refs:
  - bapm-lines-1106b
  - ABC-289
  - ABC-290
  - ABC-291
  - ABC-292
  - ABC-293
  - ABC-303
  - EPIC-011
  - ADR-0034
  - ADR-0056
  - ADR-0072
  - ADR-0073
  - ADR-0074
  - ADR-0075
  - OQ-0074-2
  - G1
  - S-prime
  - b42706b3
  - 434fa171
  - 19733697
  - ef3ef82c
  - orch-2026-10-30a/20261106T183544Z-orchestrator-decision-aaeffb04
  - orch-2026-10-30a/20261106T192323Z-orchestrator-decision-40ef8351
  - arch-ABC-289-joint/20261106T192213Z-architect-design-decision-7c297147
  - arch-ABC-289-joint/20261106T192213Z-architect-design-observation-d61479af
  - arch-ABC-303-b5/20261106T183437Z-architect-design-decision-28283e48
  - qe-ABC-303/20261106T175340Z-qe-e2e-decision-ebefbfa2
  - qe-ABC-303/20261106T180618Z-qe-e2e-observation-9e2facfa
supersedes: 
seal: sha256:24e3e936681c9af9018e2f91ad094bf0d8037d75dcbf41c01f81970f5979ede0
---

# bapm-lines-1106b: one point near a bar, written open, and what these pages leave stale

BA/PM, task `bapm-lines-1106b`. Read from the records at `main` `bc2bb953`; nothing run. No bar moved.

## Near a bar: the class of a `G1` miss on `ABC-291`
- **The line:** `…7c297147` § 4 item 5: "An evaluation-only diff has a drift class, so a miss by growth is D, the owner's."
- **`ADR-0034` d2:** decisions 3 and 4 apply only if every printed line of its instrument is `src/evaluate*.ts`. "A diff that touches any other trigger-list file has **no drift class here**. Every missed row is class B." Its controls: `src/engine.ts` and `src/search.ts`, "still all B".
- **`ABC-291`'s diff:** `ADR-0075` d4 puts `pawnShape` in `src/search.ts`'s `Switches`, `src/engine.ts`'s `Heuristics` and quiescence's rules record. The probe's `patch_e4b.py` names `src/engine.ts`, `src/quiescence.ts` and `src/search.ts`. It is read from the design; the diff does not exist yet.
- **Why it matters:** D goes to the owner, whose remedies move the count, the corpus or the budget. B is the Engineer's and then F3: "If real, NOT MET." Written as D, the page would offer a route round F3 for the row most likely to red. That is near a bar, so it stopped here and was not copied.
- **Also:** `…40ef8351` says "if a later term reds it, F7 governs". `ADR-0075` has F1 to F6, and `G1` there is F3. F7 is `ADR-0074`'s.
- **Owed:** the Architect's line, before QE seals `ABC-291`. It blocks neither the build nor the DoR. Who rules it is the Orchestrator's to route.

## Left stale, outside the brief's list
- **`EPIC-011`:** row 41 (`ABC-289` reads Ready, 10/10), row 43 (`ABC-291`: "The build stays behind `ABC-303`, `ABC-289` and `ABC-305`"), row 55 (`ABC-303` reads Ready). § Dependencies' "The reads queue" and its dated "Its build stays behind" line. § Owner questions has no OQ-0074-2 row.
- **`ABC-291`:** front matter Ready against the board's In Development. DoR row 7 reads "1–2", and test notes now run to 5.
- **`ABC-286` and `ABC-288`:** the design pages were not on the list.
- **Still the Architect's (`…40ef8351`):** `ADR-0075`'s Order line, `ADR-0056` D2 row Q2 and D5's order, and `…28283e48`'s `ADR-0056` lines. Those are listed in its § 2, though the notes cite § 3.
- **`se-ABC-289`'s notes** sit only on `grugops/ABC-289`, not on `main`, so `…0e380b06` depends on that branch being kept.
