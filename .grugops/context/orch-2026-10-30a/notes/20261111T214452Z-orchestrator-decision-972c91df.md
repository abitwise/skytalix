---
id: 20261111T214452Z-orchestrator-decision-972c91df
kind: decision
by: orchestrator
at: 2026-11-11T21:44:52Z
verified_by: 
confidence: high
refs:
  - ABC-320
  - tools/rating/rating.ts
  - tools/rating/pair.ts
  - src/levels.ts
  - memory-bank/60-progress.md
  - ABC-317
  - ABC-225
supersedes: 
seal: sha256:a8e8754ec86baa1b0568cb4c2b8060c78e9fcba59bf5c6f3e2d80cebaf00a5ae
---

Owner, 2026-11-11: after the L5–L7 plan was parked (60-progress § Next action, a0dff0c4: same protocol as L1–L4, nightly 8 h segments, no Stockfish 1 s, no fewer games), "push it, ok let's do 1 night - max 8 hours for level 5". This cuts ABC-320: the plan's harness ticket plus night 1 of L5. The owner's go is his word for a run over 1 h, capped at 8 h. The night's graded run still needs W (his held host) at launch.

Acceptance:
- **C1, harness (tools/rating only, src/ diff empty).**
  - `r --skill L` accepts L in 1–7. Budget stays `LEVELS[L].budgetMs` read from src/levels.ts; both sides at that `st`, timemargins as ABC-316. `--skill 1`–`4` argv byte-equal to today's.
  - `r --start S` (1–100): passes `-openings … start=S`, as `rpair` does (ABC-225), so a segment continues the opening sequence. S + rounds − 1 ≤ 100 (the 100 openings). Without `--start`, argv byte-equal to today's. `machine.txt` records S.
  - A combine step (a new mode, e.g. `rsum <out> <seg-dir>…`) pools segment results into one reading by cutechess-cli 1.5.1's own formula, as `rpair` pools its blocks (pair.ts). It refuses segments whose level, E, sha, pins or `st` differ, and overlapping or non-contiguous opening ranges.
  - Tests in tools/rating/pair-check.ts: argv for L5–L7, `--start`, refusals, pooling against a hand-checked case.
- **C2, QE stage A (no graded games).**
  - Pins and trees, as ABC-317. Read the main sha after C1's merge; its src/ tree equals ABC-317's subject unless C1 changed src/ (it must not).
  - Smoke of at most 2 ungraded games at `--skill 5 --elo 2280 --rounds 1`: control line, Skill Level and UCI_Elo reach both engines, `go movetime 4000`, latency against 4 s.
  - PREREG sealed before any graded game. **E 2280**, the midpoint of L5's projected ~2240–2320, by the same rule as L3 and L4. The full reading is 200 games (openings 1–100, both colours), in nightly segments. Night 1 plays in chunks of rounds from start 1; the session launches no chunk that could end past **8 h** from the session start at worst-case plies, and stops. Expected 60–70 games tonight. The session writes where night 2 starts.
  - Night 1 is reported as an interim reading, not a figure for the README. It is also the band probe: if its score is clearly outside 25–75 %, report; a step needs the owner's word, and restarts L5 at the new E.
  - Validity, FL and W as ABC-317. Runaway stop at 8 h is hard.
- **C3, stage B night 1,** only on a brief line from me citing W.
- **C4, gates.** Lint, typecheck, unit and build, each alone under the host lock; pair-check under node --test. The QE verdict signs UAT; the zero-production-lines waiver applies with an empty src/ diff. README and CHANGELOG change only when L5's 200 games are complete.

Order: se-ABC-320 (C1) → QE check of C1 and merge → qe-ABC-320 stage A → owner's W → night 1 → interim report.
