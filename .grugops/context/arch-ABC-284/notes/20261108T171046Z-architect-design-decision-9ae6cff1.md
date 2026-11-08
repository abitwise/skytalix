---
id: 20261108T171046Z-architect-design-decision-9ae6cff1
kind: decision
by: architect-design
at: 2026-11-08T17:10:46Z
verified_by: 
confidence: high on the form, the place and the bars, each from its own words; the recommendation rests on the readings quoted; the odds are judgement on the records; every P1 figure on today's tree and the lane cost UNKNOWN - verify
refs:
  - arch-ABC-284
  - ABC-284
  - ADR-0060
  - ADR-0060 § The 2026-11-08 look
  - ADR-0060 d1
  - ADR-0060 d8
  - ADR-0060 d9
  - R-283-LMR
  - ADR-0063 d11
  - ADR-0076 d10
  - ADR-0076 d13
  - ADR-0056
  - ADR-0056 D2
  - EPIC-011
  - NFR-008
  - NFR-005
  - NFR-009
  - 50ff9250
  - bba42fb7
  - orch-2026-10-30a/20261108T165653Z-orchestrator-decision-4d1e0382
  - arch-ABC-292-closed/20261108T093747Z-architect-design-decision-569849c4
  - arch-ADR-0060-reopen/20261102T153114Z-architect-design-decision-e17a23f4
  - arch-post-268/20261102T205950Z-architect-design-decision-1bc554fb
  - arch-next-pull/20261102T213500Z-architect-design-observation-d0f1a5fc
  - arch-ABC-283-accept/20261104T165453Z-architect-design-decision-10e69053
  - arch-bundle-1/20261104T205537Z-architect-design-observation-ed82b408
supersedes: 
seal: sha256:623b4c63c4f0a88f668dd92f79a37e19bf6947d521c4f1f7b3a114777a9fcfd6
---

# arch-ABC-284 decision: P1's one try is written as a dated re-open of `ADR-0060`, PROPOSED, and my recommendation is: do not re-open. Two of the four rows it missed have no reason to pass that is not a guess

Architect/Design, task `arch-ABC-284`, records only, on `grugops/arch-ABC-284` from `main` `50ff9250` (`src/` tree `bba42fb7`). Nothing was run. Inputs: the owner's `…4d1e0382` (option 2); `ABC-284`'s page; `ADR-0060` with `…e17a23f4`, `…1bc554fb` and its other dated lines; `ADR-0063` d11; `ADR-0076` d10 to d13; my `…569849c4`; `ADR-0056` D2 and D6. Readings: this task's observation note. The text: `ADR-0060` § Status (dated 2026-11-08) and § The 2026-11-08 look (L1 to L6).

## 1. Premise, form, door counts, and where
- **Premise:** decision 1, unchanged, meets every bar on today's `main`. Since its two failed probes on `e72487e1`, E1, Q1, `ABC-283`'s bundle (history with K3, SEE ordering, root aspiration) and bundle 1 (M3, the countermove) have merged. No P1 reading exists on that tree. A different tree is the premise, not a reason.
- **Form: decision 1 exactly,** chosen before any reading. It is the only form whose shape was chosen before these rows bit. Every other form on record lost at least one of them, so choosing one now is choosing with the rows in hand. The premise is about the tree, so the rule stays fixed. No history term: J1–J4 each lost `zugzwang.004` and drifted 69 cp.
- **Door counts on `main`:** 311 546 / 163 523 (`search()` d8) and 573 518 / 94 911 (`chooseMove` to 8), from the pinned rows. Exports +2 / +1 (decision 4). Every door turns `logReductions` off (decision 5).
- **A dated `ADR-0060` re-open, not a new ADR:** the form, bars, switch and doors are its own, unchanged. A new ADR would restate decisions 1–10 and give the bars a second home. `ABC-284`'s front matter names this place.

## 2. The rows it missed, and why it should pass them now
| row | reason now | kind |
|---|---|---|
| `A4` (a) `chooseMove` position-6 ≤ 0.85 (0.8528) | over H1, decision 1 read 0.7749 | measured on a near tree |
| 27 cp cap (63 cp) | over H1, 25 / 11 cp | measured on a near tree, 2 cp inside; E1 moved every value |
| `zugzwang.004` at d11 | none. Kept only on trees without P3's futility; lost on `e72487e1`, over H1 and in all J forms; `main` keeps futility | **guess; the record points against** |
| R-283-LMR's same-depth d5 floor, 0 / 190 and 0 / 188 | K3 may lift a mating quiet move before the reduced ones; unmeasured. Decision 1 lost 2 / 189 on every tree read | **guess; the record points against** |

**So I cannot give a reason that is not a guess for two of the four, and I recommend: do not re-open.** By judgement, the probe passes every row less than one time in ten. This corrects my `…569849c4`'s "below even" downward, on a closer reading of the same records.
- **New, not in the options read:** the same-depth floor became a bar for P1 after decision 1 was designed, which had accepted 2 / 189 there as the price of reducing deeper. With it as a bar, any deeper LMR is likely to lose a few rows. Keeping it, as I recommend, all but closes this family here. Loosening it would move a standing bar, so I do not. It is put to him as question 4.

## 3. The probe, the order, NFRs, if he takes the look
- **Probe** (`ADR-0060` L3, `ADR-0076` d13's form): written, not run; a PREREG sealed in `arch-ABC-284-probe` before any measured run. Rows LR1 (instrument, exact), LR0 (counts), LR2 (table vs QE's cells, exact), LR3 (zugzwang 7 / 7), LR4 (both mate floors, 0), LR5 (`A4` (a) ≤ 0.85 ×4), LR6 (reach ≥ +0.25), LR7 (drift 95 % / 25 cp / 27 cp / 0 signs), LR8 (`G1` ≥ 54 / 58, no NEWLY), LR9 to LR11 reports. The two rows the record points against run first, in batch B. Timing (LR11) runs last, only on a held host with W asked. Lane reads use `VITEST_MAX_WORKERS=1 npx vitest run`. The rule: defect fix once for LR1 / LR2; a real safety miss or a pay miss is NOT MET, and nothing after it runs; no form tuned, no second form, no subset.
- **Order** (L4, `ADR-0076` d10's table): owner's answer; records; **QE's freeze** (`qe-ABC-284-freeze`: hand-worked cells, eligibility fixtures, the sets by sha256, the door counts); the probe, whose PREREG commit passes `git merge-base --is-ancestor <freeze commit> <PREREG commit>`; on MET the counts and pin list; the Orchestrator's `git merge-base --is-ancestor <freeze commit> main` check before any build dispatch; the build; QE.
- **`NFR-008` ≤ +0.10 s stays;** expected +0.01 to +0.12 s, midpoint about +0.05, `UNKNOWN - verify`. `G2` is not relevant: P1 does not touch `evaluate`. `NFR-009`: 4 096 bytes at load. `G6` ≥ base is the build's timing gate.
- **Deep pins:** `ABC-282` A0-3 re-pins; A0-1, A0-2 and `ABC-303`'s d8 counts re-point; the same-depth floor rows and the zugzwang rows stay on the shipped path; D5's depth-2 row unchanged by construction. The default lane's list waits for LR10.
- **Intent: GAIN ≥ 50.0 of 100,** unchanged, named before any reading. A pass means "not seen worse".

## 4. For the owner, in plain words (L6)
1. **One try at P1?** Two of its four failed checks now have a fair, measured reason to pass. The other two failed on every version of the engine with the futility pruning, which today's engine has. Odds below one in ten. Cost: a QE freeze hop, about 25 min of the machine, which can only stop it; if it passes, about 1 to 1¼ h more. **Recommend: no.**
2. **If yes and it passes every check, accept ADR-0060 now** so the build and 100 games need no second ask? **Recommend: yes, in that case only.**
3. **Is a miss final for P1?** No second shape of the table after seeing the result; a new shape needs its own ADR, a reason not drawn from a failed check, and his yes. **Recommend: yes.**
4. **The same-depth mate check** was added after P1 was designed and all but closes this kind of change. Turning it back into a report would loosen a safety check. **Recommend: keep it.**

## For the Orchestrator
- If he answers 1 no, option 2 ends with no host time spent, and the next step (option 3's held search tickets, one at a time, probe first) needs the Architect's read under a new brief. It is not written here.
- BA/PM owns `ABC-284`'s page lines; nothing here moves a page, ticket, EPIC or board line.
- No item moves a standing bar. Question 4 names the one that would, and I recommend against it.

## Confidence
High on each reading and each source, quoted. The odds are judgement on the records. Every P1 figure on today's tree, the door's slack on `zugzwang.004` and the lane cost are `UNKNOWN - verify`.
