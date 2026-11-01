---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T15:10:49Z
subtask: arch-adr0056-100ms-fold
role: architect-design
ref: .grugops/context/arch-adr0056-100ms-fold/
branch: new grugops/arch-adr0056-100ms-fold from main (worktree .claude/worktrees/arch-adr0056-100ms-fold)
width: records only. Two SE hops (ABC-249, ABC-254) run tests under the host lock; a BA/PM records hop (bapm-100-400-rule) edits plans/ beside you.
---
# Architect: fold the owner's 100/400-at-100 ms rule and the probe readings into ADR-0056
## Inputs
- Owner word (verbatim inside): .grugops/context/orch-2026-10-30a/notes/20261101T125800Z-orchestrator-decision-2896c6eb.md — no SPRT; per strength change 100 games at 100 ms (new vs base); per epic 400 games at 100 ms. Claim reading stays at 40/15 vs SF E3000 (ADR-0056).
- qe-tc-depth-probe readout (merged 1d4e1649): .grugops/context/qe-tc-depth-probe/ (decision …b505d675, observations …1889e3b0, …07357280, …9fd1fdce, …f440e5f5). Key: skytalix 100 ms → depth median 6 (500 ms → 8, 4 s → 10); overshoot max 4 ms, 0 losses; 259 self-play games/h at 100 ms; SF pick-depth p95 ≤ 19.1 ms up to E2600 (100 ms gives ≥ 5× headroom; C1's 4×p95 rule met, its 0.5 s floor is your call); E > 2600 unmeasured; 100 games ≈ ±48 Elo, 400 ≈ ±24 Elo. Readings SHARED (foreign vitest) — lower bounds.
## Do
- Supersede ADR-0056 C2/C3 (SPRT lane) with the owner's fixed-count rule: what "pass" means for a 100-game change read and a 400-game epic read (state the decision rule and its known blind spot honestly: ±48 / ±24 Elo), opponent for each (self-play new-vs-base for per-change; state the per-epic opponent and SF move time — 100 ms per the probe, or keep/drop the 0.5 s floor with reason), restart/warm-up handling (first move cold under restart=on).
- Note what is needed before SF at E > 2600 can be used at 100 ms (unmeasured).
- Correct C2's depth estimate with the measured table.
- Say whether ABC-255 (M0 SPRT lane) should be re-scoped to a fixed-count 100/400 mode, so BA/PM can act (they are told to follow your ruling if it lands first; otherwise they word it as pending your ruling).
## Fences
memory-bank/50-decisions/ADR-0056* and your notes only. No plans/, board, src/, tools/, data/, AGENTS.md. Run nothing (no tests, no engines). No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task arch-adr0056-100ms-fold, contextRoot = worktree), commit, ## Result + trace row here, brief + claim to done/.

## Result

**2026-11-01, Architect/Design. DONE (records only). Branch `grugops/arch-adr0056-100ms-fold` (worktree
`.claude/worktrees/arch-adr0056-100ms-fold`, from `main` `452415bd`, which contains `376473fe`): claim `fbf6c7ab`,
ADR fold `75919370`, notes `4f856745`. One file under `memory-bank/50-decisions/` was touched (259 insertions, 0
deletions). `plans/`, the board, `src/`, `tools/`, `data/` and `AGENTS.md` are untouched. Nothing was run, merged or
pushed.**

- **The ruling, in ADR-0056 D5's dated block "no SPRT. The fixed-count rule at 100 ms (supersedes C2 and C3)".**
  - **C2′, per strength change:**
    - The candidate (rebased on `main`) plays its merge-base, self-play, 100 ms both sides, openings 1–50 × both
      colours = 100 games, width 1, `restart=on`, **`timemargin` 50 ms**.
    - Pass: 0 candidate faults, 0 losses on time, and **GAIN ≥ 50.0 / 100** or **NEUTRAL ≥ 43.0 / 100** (≈ −49 Elo),
      with the intent declared at design.
    - A miss is NOT MET, with no re-play for luck. A base fault or loss on time makes the read UNRESOLVED (re-run
      once).
    - The blind spot: ±48 Elo (draws 0.50). P(pass, GAIN) is 0.79 at +20, 0.66 at +10, 0.34 at −10. It cannot tell
      +10 from −10.
    - It replaces the D smoke. The R smoke (4 s) is recommended kept.
  - **C3′, per epic:**
    - `rpair` at 100 ms. The base is the epic start, the head is `main` at close. Each build plays 200 games against
      Stockfish 19 `UCI_LimitStrength`, E by the band rule, width 1.
    - **Stockfish `st=0.1` for E ≤ 2 600, and the 0.5 s floor is dropped for routine reads.** 100 ms is ≥ 5× p95, and
      Stockfish's play is depth-pinned. It spends its whole `st` (milestone 1 PGN), so the floor would ≈ triple wall
      time for no change in play. The C1 claim keeps its floor.
    - MET: the pair's point estimate ≥ 0. Resolution ≈ ±58–78 on the pair (estimate); the ±24 holds only head-to-head.
      Stockfish is chosen over self-play because the per-change reads are already self-play.
    - ≈ 1.0–1.6 h.
  - **Restart:** keep `restart=on` with no warm-up move. The cold first move is symmetric in C2′ and cancels in the C3′
    pair.
  - **E > 2 600:** it needs an R5-style probe at E 2 700–3 190 first. Then `st` = 100 ms if 4 × p95 ≤ 100 ms, else
    4 × p95 rounded up to 50 ms, with no floor. The probe costs under 1 h.
  - **Depth corrected:** the measured table is 6 / 7 / 8 / 9 / 10 at 100 / 250 / 500 / 1 000 / 4 000 ms. C2's "5–6 at
    0.5 s" was two plies low, and 44.2 games/h at 0.5 s replaces C2's 65–80.
  - **Depth-gated rows** (X2, P5, S1, and T4, which is invisible by construction): the design names the depth. A
    longer read is asked of the owner.
  - **C4 re-pointed:** the anchors pair 40/15 with 100 ms, not 4 s.
- **ABC-255: YES, re-scope it** to a fixed-count 100 ms lane, size M → S. Drop SPRT, the 1 000 openings and the
  `-sprt` question. Instead: `d --budget-ms 100` (50 ms margin), and the 100 ms control in `rpair`/`r`; existing dry
  runs stay byte-equal. The acceptance becomes dry-run rows, one sanity read on `ABC-208` (reported), and one
  identical-pair read. `ABC-256` becomes a 200-game read at the C3′ control. BA/PM may act on this now.
- **Notes (sealed, `.grugops/context/arch-adr0056-100ms-fold/notes/`):**
  - decision `20261101T151909Z-architect-design-decision-db40f09a`;
  - observation `…874a59c0`, the measured corrections and pass probabilities;
  - observation `…9d6249c8`, the artifact pointer. It is recorded as an observation because `artifact-ref` needs a
    `gate_run`, and a records-only hop has none.
- **Open, the owner's if he wants it:** the GAIN/NEUTRAL bars and Stockfish as the epic opponent are the Architect's
  reading of his rule. Also whether the R smoke stays. Q-3K-4/6/7/8 are still open.
- STOP: none.

### Trace row (10 cells, header order)

| arch-adr0056-100ms-fold | ADR-0056 fold: no SPRT; C2′ 100 games self-play at 100 ms per strength change (GAIN ≥ 50.0, NEUTRAL ≥ 43.0); C3′ 400-game rpair vs Stockfish st=0.1 per epic; ABC-255 re-scoped to a fixed-count lane | EPIC-011 | — | none added or moved; ADR-0056 C2/C3 superseded, C4 re-pointed | memory-bank/50-decisions/ADR-0056-… (grugops/arch-adr0056-100ms-fold @ 75919370) | — (records only; nothing run) | — | — | ARCH DONE (decision …db40f09a) |
