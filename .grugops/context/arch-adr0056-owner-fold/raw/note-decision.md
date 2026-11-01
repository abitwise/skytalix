# Architect/Design, arch-adr0056-owner-fold: ADR-0056 ACCEPTED IN DIRECTION; the claim is read at 40/15; fast routine controls proposed; ABC-250 first stands

Records only, at `main` `2e9a2457`. Nothing run (`qe-ABC-223` holds the host ALONE). Branch `grugops/arch-adr0056-owner-fold`. Only ADR-0056 (dated lines and status) and this context were edited.

## Status fold (owner 2026-11-01, `orch-2026-10-30a` `…022fb66f`)
- ADR-0056 is **ACCEPTED IN DIRECTION**. That covers the classical path, the named scale plus a per-change instrument, and the phase order as a recommendation. The original PROPOSED status is kept below it.
- **Answered:**
  - Q-3K-1, the time: the claim is read at 40/15 (≈ 22 s a move). This replaces "one 120 + 1 reading at the claim". The scale (Stockfish 19 `UCI_Elo`) and the claim rule were not contested and stand.
  - Q-3K-5: a new epic, `EPIC-011`, after the open epics close. No work is done twice.
- **Open:** Q-3K-2, Q-3K-3, Q-3K-4, Q-3K-6, Q-3K-7, Q-3K-8, and `ADR-0055` Q-SP-3. Optional for him: whether Stockfish plays on a fixed depth-safe move time (recommended) or on the same 40/15 clock at the claim.

## C1. The claim at 40/15 (estimates)
- **skytalix:** `tc=40/900`, `uci-clock-mode` if `ABC-223` reads MET, else `simple-tournament`. Book on.
- **W1 (time management)** is not needed for the claim to be legal (`EPIC-009` M1 MET). It is needed for strength, so it lands before the claim.
- **Stockfish:** 19 limited, E by the band rule. A fixed `st` of at least 4× the 95th percentile time-to-pick-depth (probed at PREREG), floor 0.5 s, about 2–4 s at E 3 000. `ABC-204`'s depth guard stays.
- **Games:** 200 at E 3 000, MET at ≥ 50 % (≈ ± 40–45 Elo). Futility stop after 100 games below 41 %.
- **Host:** ≈ 22–24 min a game, so ≈ 75–80 h (≈ 3.2 days) ALONE at width 1. On an equal clock it would be ≈ 130–140 h.
- **Heat:** width 1, on mains. Sessions of 50 games (≈ 19–20 h, inside the 22.22 h clean run on record). `ABC-222`'s A7 rule applies per session, with a cool-down gap.
- **When:** run only when a 4 s trend reading plus the measured offset reaches 3 000.

## C2. Per-change SPRT (fast routine control)
- **Control:** 0.5 s a move on both sides (the owner's floor), self-play, paired colours, a fixed seeded opening set larger than 100 positions, width 1.
- **Bounds:** [0, 10] for gains and [−10, 0] for non-regression, α = β = 0.05.
- **Cost (estimate):** ≈ 65–80 games/h. A +40 change takes ≈ 700 games (≈ 10 h), +20 ≈ 1 650 (≈ 24 h), +10 or 0 ≈ 5 000 (≈ 70 h). Cap 6 000 (≈ 85 h).
- **[0, 5] is not affordable at width 1** (≈ 4×). This replaces D5's "a few thousand games, ≈ 10–30 h".
- **Depth caveat:** depth-dependent mechanisms (X2, T4, P5) get a 2 s control, named at design with a firing-rate reason.
- The verdict's place in the merge rule stays Q-3K-2.

## C3. Milestone trend readings
- R's instrument at 4 s a move: 200 games, ≈ 11–12 h, continuous with ≈ 2 074.
- A 0.5 s check against Stockfish (≈ 3 h) is allowed only as a labelled quick check, never as a milestone.
- Milestones 2 200–2 800 are reported "at 4 s" plus the offset. Only 3 000 is claimed, and only at 40/15.

## C4. 40/15 anchors
- **A0** is the first reading of `EPIC-011`: 100 games at 40/15 (≈ 35 h), paired with a 4 s reading on the same build, so the offset is measured.
- **A1** comes after Phase 4.
- Nothing else is read at 40/15.

## Scaling caveat
- **Fast controls predict:** the sign of most changes, bugs, collapses and time losses, W1, and the trend direction.
- **They do not predict:**
  - the size of a gain at 40/15 (eval gains shrink with time; depth gains grow and may read ≤ 0 at 0.5 s);
  - the absolute R at 40/15 (skytalix gains ≈ 50–100 per doubling; limited Stockfish is depth-pinned, so 4 s underestimates by ≈ +120–250 and 0.5 s by more; low confidence);
  - the offset after the engine changes;
  - self-play inflation.

## Order ruling
**`ABC-250` first stands:** `ABC-249` → `ABC-250` → `ABC-251`/`252` on its reading → `ABC-253`. D6 Phase 0's "O1-a then O1-b/c" is withdrawn by a dated line. The reasons:
1. `ADR-0055` is ACCEPTED, and its D4 plus its fold set the order as "BA/PM's cut". ADR-0056 says it does not change `ADR-0055`, and it gave no reason for O1-a first.
2. `ABC-250` is the gate: its ≥ 1.25× bar decides whether `ABC-251`/`252` exist.
3. Its expected yield is the larger (1.25× against 1.02×).
4. No file collision favours O1-a.

Phases 1–5 and M0 are `EPIC-011`'s, after the open epics close. Placing `ABC-231`…`239` is BA/PM's dedupe.

## Correction
D5 item 3's pick depth at E ≈ 3 000 is **14**, not 18–20. It comes from `sf_19` `search.h`'s cubic, which reproduces `ABC-204`'s level 2.56 at E 1 650 and depth 5 at E 2 000.
