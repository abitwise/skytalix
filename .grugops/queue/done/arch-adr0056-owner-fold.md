---
subtask: arch-adr0056-owner-fold
role: architect-design
ref: .grugops/context/arch-adr0056-owner-fold/
branch: new grugops/arch-adr0056-owner-fold from main (worktree .claude/worktrees/arch-adr0056-owner-fold)
width: records only. qe-ABC-223 holds the host STRICTLY ALONE. A BA/PM hop creates EPIC-011 beside you (plans/ only).
---
# Architect: fold the owner's answers into ADR-0056 (records only)
## Owner word
.grugops/context/orch-2026-10-30a/notes/20261101T124000Z-orchestrator-decision-022fb66f.md (verbatim inside).
## Do
1. ADR-0056 status: accepted in direction (owner 2026-11-01, "happy with where we are going"); list which D7 questions are answered (Q-3K-1 time control = 40/15 for the claim; Q-3K-5 = new epic, after the open epics close) and which stay open.
2. Re-state the measurement plan for the claim at 40/15 (~22 s/move; EPIC-009 uci-clock-mode; needs real time management): Stockfish's side at high E (depth/time so its strength holds), games per reading, host hours at width 1, thermal note.
3. Fast routine readings: the owner allows shorter controls down to 0.5 s/move. Propose the routine control(s) for per-change SPRT and for milestone trend readings, and say what a shorter control can and cannot predict about 40/15 (scaling caveat). Keep the claim rule at 40/15.
4. Reconcile one order line: ADR-0056 D6 lists O1-a before O1-b; ADR-0055 D4 and the board pull ABC-250 (O1-b, the gate reading) first, ABC-253 (O1-a) after. Say which stands (the Orchestrator keeps ABC-250 first unless you show a reason).
## Fences
- memory-bank/50-decisions/ADR-0056* (dated lines / status) and your notes only. No plans/, board, src/, tools/, data/, AGENTS.md. Run nothing. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `arch-adr0056-owner-fold`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.

## Result

**2026-11-01, Architect/Design. Done, records only.** Branch `grugops/arch-adr0056-owner-fold` (worktree `.claude/worktrees/arch-adr0056-owner-fold`, from `main` `2e9a2457`). The ADR and notes are in commit `193937f9`. Nothing was run, built or played; the only process run was the seal script. Not pushed, not merged. Only ADR-0056 (dated lines and status), my own context and this brief were edited.

- **Status: ACCEPTED IN DIRECTION** (owner 2026-11-01, `…022fb66f`, quoted verbatim). The original PROPOSED status is kept below it.
  - **Answered:** Q-3K-1's time (the claim is read at 40/15, replacing "120 + 1 at the claim"; the scale and claim rule were not contested and stand) and Q-3K-5 (new epic `EPIC-011`, after the open epics close, no work done twice).
  - **Open:** Q-3K-2, Q-3K-3, Q-3K-4, Q-3K-6, Q-3K-7, Q-3K-8, and Q-SP-3.
- **C1, the claim at 40/15:**
  - skytalix plays `tc=40/900` in `uci-clock-mode` if `ABC-223` reads MET, else `simple-tournament`. W1 (time management) lands first, for strength, not legality.
  - Stockfish plays on a fixed `st` of at least 4× the p95 time-to-pick-depth, probed at PREREG, floor 0.5 s (≈ 2–4 s at E 3 000, where the pick depth is **14**). `ABC-204`'s depth guard stays.
  - 200 games at E 3 000, MET at ≥ 50 % (≈ ± 40–45 Elo). A futility stop after 100 games below 41 %.
  - ≈ 75–80 h (≈ 3.2 days) ALONE at width 1; ≈ 130–140 h if both sides are on the clock.
  - Heat: sessions of 50 games (≈ 19–20 h), `ABC-222`'s A7 rule per session, a cool-down gap, on mains.
  - Run it only when the 4 s trend plus the measured offset reaches 3 000.
- **C2, per-change SPRT:**
  - **0.5 s a move on both sides**, self-play, paired colours, width 1. Bounds [0, 10] for gains and [−10, 0] for non-regression, α = β = 0.05.
  - ≈ 65–80 games/h (estimate). +40 ≈ 10 h, +20 ≈ 24 h, 0 ≈ 70 h. Cap 6 000 games.
  - [0, 5] is not affordable at width 1.
  - Depth-dependent rows (X2, T4, P5) get a 2 s control, named at design.
  - The verdict's place in the merge rule stays Q-3K-2.
- **C3, trend readings:** R's instrument at **4 s a move**: 200 games, ≈ 11–12 h, continuous with ≈ 2 074. A 0.5 s check against Stockfish is only a labelled quick check.
- **C4, anchors:** A0 is 100 games at 40/15 plus a 4 s pair, first in `EPIC-011` (≈ 35 h + 11 h). A1 comes after Phase 4. They measure the 4 s → 40/15 offset.
- **Scaling caveat:**
  - **Fast controls predict:** the sign of most changes, bugs, time losses, W1, and the trend.
  - **They do not predict:** the size of a gain at 40/15, the absolute R (skytalix gains with time; limited Stockfish is depth-pinned; 4 s underestimates by ≈ +120–250, a low-confidence estimate), the offset after the engine changes, or self-play inflation.
- **Order ruling: `ABC-250` first stands** (`ABC-249` → `ABC-250` → `ABC-251`/`252` → `ABC-253`). D6 Phase 0's "O1-a then O1-b/c" is withdrawn. The reasons:
  1. `ADR-0055` is ACCEPTED and its D4 plus its fold set the order; ADR-0056 does not change it, and it gave no reason for O1-a first.
  2. `ABC-250` is the gate for `ABC-251`/`252`.
  3. It has the larger yield (1.25× against 1.02×).
  4. No file collision favours O1-a.
  M0 and Phases 1–5 are `EPIC-011`'s. Placing `ABC-231`…`239` is BA/PM's dedupe.
- **Correction:** D5 item 3's "pick depth ≈ 18–20 at E 3 000" is wrong; it is 14. It comes from `sf_19` `search.h`, cross-checked against `ABC-204`.
- **Notes** (task `arch-adr0056-owner-fold`, contextRoot = worktree; 3/3 sealed and read back): decision `20261101T122732Z-architect-design-decision-f9f64375`, observation `…observation-85621c95` (facts and estimates), observation `…observation-04e753dd` (artifacts).

### Trace row (10 cells, header order)

| arch-adr0056-owner-fold (records) | owner 2026-11-01 `…022fb66f`: 3 000 at 40/15; fast readings down to 0.5 s; new epic after open epics; dedupe | EPIC-011 (new, BA/PM), EPIC-010 (O1 order: ABC-250 first), EPIC-009 (claim time mode) | ADR-0056 ACCEPTED IN DIRECTION (status; D5 dated block C1–C4 and the caveat; D6 order line; D7 per question; Consequences) | NFR-004 (22 s, unchanged), NFR-009 (Q-3K-6 open); no level moved | grugops/arch-adr0056-owner-fold @ 193937f9: memory-bank/50-decisions/ADR-0056-… (records only) | none run (records and web reading) | n/a | — | no board move; Orchestrator keeps ABC-250 first |
