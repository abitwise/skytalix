---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T10:17:03Z
subtask: arch-ABC-239
role: architect-design
ref: .grugops/context/arch-ABC-239/
branch: grugops/arch-ABC-239 — worktree .claude/worktrees/arch-ABC-239 (from main)
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core; the lock is shared (the ABC-269 build may run). Prototype fits stay small: each single run ≤ 30 min, the hop's total host time ≤ 2 h; anything larger — stop and return the question (owner asks for > 1 h validation runs).
---
# Design ABC-239 (offline evaluation tuning) — design 3 of 3
Owner 2026-11-03: designs one-by-one for ABC-234, ABC-236, ABC-239. Both earlier designs came back premise-not-met (ADR-0065, ADR-0066 — search-side levers are exhausted on main); the EPIC-011 analysis (bapm-epic011-cut …08584853, …0fd882f7) ranks this ticket as the biggest evaluation lever.
Read plans/tickets/ABC-239*.md (A1 licence, A6 reading, the waits), ADR-0048 (licence; carved-out CC-BY-SA tables), ADR-0064 (E1: every term an mg/eg pair in src/evaluate-params.ts — the tuner's target; E1 is being built now on grugops/ABC-269, ADR accepted), ADR-0056 (Phase 4, per-change rule, Q-3K-4 (b) for evaluation tickets), ABC-205/ABC-207 history (hand weights lost; why), the arch-next-pull eval probe.
Decide and write ADR-0067 PROPOSED:
- Method (e.g. Texel-style logistic fit of eval to game result; or another, with the reason), loss, K-scaling, optimiser, regularisation, which parameters are free at first pull (keep it bounded), integer emission into evaluate-params.ts, reproducibility (seeded, scripted tool under tools/).
- Data: source and licence under ADR-0048 (own self-play games allowed by default; Lichess CC0 an option; a Stockfish-labelled set raises a product-identity question — if you need it, frame it as an owner question, don't assume). Size, de-duplication (note bapm found duplicated openings in the probe set), train/validation split, quiet-position filter.
- Pre-registered bars and falsifiers: validation-loss improvement, no regression on zugzwang/mate floor/G1, NFR-005 depth-6 floor, then the per-change 100 games at 100 ms (GAIN 50.0) and the owner's 400-game pair only if asked first.
- A small prototype under the width cap is welcome to show the pipeline works and the loss moves (on main's untapered table if E1 is not merged yet) — seal a PREREG before any measured run.
- Dependencies: say plainly whether the build must wait for ABC-269's merge (expected yes) and whether ABC-270/271/272 should go before or after the tuner.
Fences: memory-bank/50-decisions + your records + scratch under the scratchpad (no committed src/tools). Do NOT edit ADR-0056, EPIC-011 or ticket pages — list owed lines in a note. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-239, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result; brief + claim to done/.

## Result
*architect-design (claude-opus-5-5), 2026-11-03T10:50:42Z*
- **`ADR-0067` PROPOSED** (acceptance is the owner's). It sets a logistic fit of game results (Texel-style), with
  cross-entropy, K fixed first, and Newton steps on a traced linear model behind an identity gate.
  - Material is frozen at the first pull, and the free set is sign-bounded (C-S or C-F by an inner-split rule).
  - `tools/tune/` writes only `src/evaluate-params.ts`, byte-reproducible.
  - E2-pre (blend every half, value-identical) goes first.
  - Intent GAIN. Bars B-T0–B-T8, falsifiers F1–F7.
- **Prototype** (scratch, on E1 `b7a8fc3a`, own self-play PGNs at `af15cbc9`: 3 431 games, 254 485 rows):
  - G-P1 0 misses (worst 0.958 cp), G-P2 K 0.585, G-P3 **0.9863 ×** E1's outer cross-entropy. All hold, so the verdict
    is "the loss moves on own games".
  - The unconstrained fit is implausible (queen 2 593 / 137). The diagnostics put the cause in the data, not the loss.
  - Bounded, the move is 0.9960 × (inner split). The king tables come out about 3 × under-weighted in every fit.
  - About 1 min of host in all.
- **Order:** `ABC-269` merge (the build waits: yes) → E2-pre (new ticket, S) → `ABC-239` → `ABC-270` and `ABC-271`
  (after the tuner; `ABC-270` may go first if `ABC-239` stalls on data) → `ABC-272` order free.
- **Notes:**
  - PREREG `…9ed1db11` and addenda `…255e9bcf` and `…f8d36d73`;
  - results `…48ae6a93`, decisions `…e4c34239` (owner questions § 4, owed lines § 5), artifacts `…ad30a5b9`.
- **Commits:** claim and PREREG `ed922f3e`; addenda `acc97083`, `a2bbdee0`; ADR, notes and raw `7344fcc5`; this Result
  and the move to done/ in the closing commit. Not pushed, not merged.
- **Open:**
  - Owner: Q-3K-7 (a) Lichess CC0 for training (recommend yes), (b) a Stockfish-labelled set (recommend no), (c)
    games against Stockfish (recommend no); B-T8, the outside pair before merge (recommend yes); accepting
    `ADR-0067`.
  - BA/PM: cut E2-pre; the `ABC-239` page lines.
  - Architect: the `ADR-0056` / `ADR-0064` pointer lines.
