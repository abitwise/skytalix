---
id: 20261102T205950Z-architect-design-decision-1bc554fb
kind: decision
by: architect-design
at: 2026-11-02T20:59:50Z
verified_by: 
confidence: high on P1 parked (pre-registered verdict rule, measured) and on E 1 980 (the rule as written, arithmetic from the pooled W/L/D); the expected score at 1 980 is an estimate (± 292 Elo on X)
refs:
  - arch-post-268
  - grugops/arch-post-268
  - EPIC-011
  - P1
  - P3
  - ABC-268
  - ABC-265
  - ABC-264
  - ABC-233
  - ABC-204
  - ADR-0060
  - ADR-0061
  - ADR-0056
  - ADR-0050
  - ADR-0026
  - RISK-EPIC011-03
  - QE-268-p2-d
  - e72487e1
  - 56b3782d
  - d65e4bfb
  - orch-2026-10-30a/20261102T205000Z-orchestrator-decision-77a82ec1
  - qe-ABC-268-p2/20261102T204714Z-qe-e2e-decision-186a743e
  - qe-ABC-268-p2/20261102T204714Z-qe-e2e-observation-d582d7dd
  - arch-post-268/20261102T205431Z-architect-design-decision-3a0aac14
  - arch-ADR-0060-reopen/20261102T153114Z-architect-design-decision-e17a23f4
  - NFR-005
  - NFR-008
supersedes: 
seal: sha256:0c488fafe5837b997b77f2e823e7e925ea8a59d163baf9b9e402eeda43934511
---

# arch-post-268 decisions: ADR-0061 IN FORCE on `main` `e72487e1`; S′ re-pinned upward E 1 650 -> **1 980** (pool 26 / 30 = 86.7 %; command `r <candidate> <out> --elo 1980 --budget-ms 500 --rounds 5 --concurrency 1`; the pool resets now); ADR-0060 decision 1 misses three bars after P3, so **P1 stays parked**

Architect/Design, task `arch-post-268`, records only, on `grugops/arch-post-268` from `main` `56b3782d` (`src/` = `e72487e1`). Inputs: Orchestrator `…77a82ec1`; `qe-ABC-268-p2` `…186a743e`, `…d582d7dd`; `ADR-0056` S′ / C10; `ADR-0060` § Status; results note of this task.

## 1. ADR-0061: ACCEPTED, IN FORCE on `main` since `e72487e1`
Dated status line written: A6 58.0 / 100 (41/34/25, +56.1 ± 56.1, LOS 97.6 %, 0 faults, 0 time losses), S′ 8.0 / 10 at E 1 650, Levels 57 / 57; post-merge 2 429 / 2 429. Its d9 counts are now `main`'s and were re-read to the node by this task's door.

## 2. S′ re-pin (ADR-0056, dated status line + pointer at S′'s E bullet)
- Trigger: merged-only pool `qe-ABC-255` 9/1/0 + `qe-EPIC-010-close` 9/1/0 + `qe-ABC-268-p2` 8/2/0 = **26/4/0, 86.7 % > 85 % over 30**; owner pre-authorised upward moves (`…1f5e3b27`), so no ask.
- Step: `ABC-204` A4's band rule, E' = E + X rounded to 10, clamped 1 320-3 190, here E <= 2 600. X = -400 log10(1/0.8667 - 1) = **+325.2** (± 292.3 at 95 %; cutechess-cli's formula as in `tools/rating/pair.ts`). E' = 1 975.2 -> **1 980**.
- **New setting:** Stockfish 19 `UCI_LimitStrength` true, **`UCI_Elo` 1 980**; `st=0.5`, `timemargin` 2 000, `Threads 1`, `Hash 16`, `restart=on`; skytalix `st=0.5`, 50 ms margin; depth guard now depth 5 (computed by `rating.ts`). Bars S-1/S-2/S-4 unchanged.
- **Command:** `node tools/rating/rating.ts r <candidate> <out> --elo 1980 --budget-ms 500 --rounds 5 --concurrency 1`. `r`'s default stays 1 650 in code (no tools change), so `--elo 1980` must be written; a run without it does not pool. `--dry-run` at `e72487e1` printed `option.UCI_Elo=1980` (`raw/s-prime-dry-run.txt`).
- **Pool reset: now.** The E 1 650 pool closes at 26.0 / 30 (history). A new pool opens empty at E 1 980 with the next merged build's S′; the trigger is read again at >= 30 games (> 85 % steps up again by the same rule; < 60 % is the owner's question).

## 3. ADR-0060: P1 stays parked (dated status block + decision 9 dated line)
By the PREREG's verdict rule: decision 1 misses **A4 (a)** (`chooseMove` position-6 0.8528 > 0.85), **A3's 27 cp cap** (63 cp, position-6/g5h6, unchanged from pre-P3) and **zugzwang 7 / 7** (`zugzwang.004` g7f6 at d11; h3h4 only from d12; F3, never a re-pin). Met: the other three A4 (a) readings, A4 (b) +0.384, `chooseMove` drift, mate floor 0 / 163, G1 54 / 58. A4 (c) G6 not read (timing). The audit (5.37 % flips, max 48 cp, 0 >= 100 cp) is information and does not change it. No bar moves; no form is tuned here. The owner's cap question is moot (a "yes" admits nothing: A4 (a) and F3 remain); default "keep the cap" stands. P1 re-opens only on a new named premise with a new pre-registered probe (decision 11's history term, O1h `ABC-233`, is the one on record). "Accept ADR-0060" is not put to the owner.

## Open questions (for the Orchestrator)
1. **S′'s trigger band vs the step (design inconsistency, named, not acted on).** The band-rule step aims E at about 50 % for the merged engine; S′'s trigger band is 60-85 % and its original E was chosen for an expected 67-83 %. So after 30 games at E 1 980 the pool will likely read below 60 % and raise the downward question by construction, and S-4's >= 3.0 / 10 stops an unchanged build about 5 % of the first 10 (the 20-game rule clears most). Options: (a) keep as written and accept the downward question when it comes; (b) amend the step to land at the band centre (72.5 %, Elo +168): E' = 1 650 + 325 - 168 = **1 810**; (c) re-centre the trigger band on 50 % (e.g. 35-65 %). Architect's recommendation: (b), a dated amendment to ADR-0056 S′ before the next S′ is played; it is a measurement setting, within delivery, but it changes a rule the owner confirmed "as written", so the Orchestrator decides whether to tell him. Until ruled, 1 980 stands.
2. **Records owed by BA/PM (outside this fence):** `EPIC-011` § Close-out S′ pool row and C10 (new E, closed pool, reset), and each open strength ticket's S′ line (`--elo 1980`).
3. **Phase 2 next:** with P1 parked, the next item is the Orchestrator's (`ADR-0061` F6: P5 as NEUTRAL with a deep bar; P4 waits for O1h).
4. ADR-0056 D2's P1 row may want a dated line ("parked after P3"); not in this brief.
