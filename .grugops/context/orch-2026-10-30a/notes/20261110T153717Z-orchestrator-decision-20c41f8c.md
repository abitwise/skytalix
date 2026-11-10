---
id: 20261110T153717Z-orchestrator-decision-20c41f8c
kind: decision
by: orchestrator
at: 2026-11-10T15:37:17Z
verified_by: 
confidence: high
refs:
  - ABC-316
  - tools/rating/rating.ts
  - src/levels.ts
  - README.md
  - ABC-295
  - ABC-204
supersedes: 
seal: sha256:a7215b1252757285c4156f9e9c7b3fff4d1d87dd55d21ed72fb7a9b08d588c6e
---

Owner, 2026-11-10: the README level strengths are projected, not measured. Offered options A–D with time estimates; owner: "go with option A, levels 1 and 2 first". Option A = measure levels 1–4 at 200 games each against Stockfish 19; this note cuts its first slice, levels 1 and 2, as ABC-316. Levels 3 and 4 come in a later ticket after this one reads. The owner's choice of option A is his word for a run over 1 h. Each graded run still needs his held-host word (W) at run time.

Acceptance:
- **A1, harness: `r --skill L`.** `tools/rating/rating.ts r` takes `--skill L` with L in 1–4 (option A's levels). With it: skytalix gets `option.Skill Level=L` and `st` = `LEVELS[L].budgetMs` from `src/levels.ts` (100 ms for L1, 180 ms for L2), read from that file and not copied. Its `timemargin` is a fixed 50 ms, as at 100 ms today. Stockfish gets the same `st` as skytalix (both sides on equal time, as R2 at 100 ms), with `timemargin` 2000 and its other pins unchanged. `--skill` with `--budget-ms` is refused. `--elo` keeps 1320–3190. `machine.txt` records the level and both `st` values. Without `--skill`, `r`'s argv is byte-equal to today's, R2's `cmd.txt` included (a test pins it). `rpair` and `d` are unchanged. Dry-run tests cover L1 and L2. No `src/` change.
- **A2, QE stage A (no games).** Pins as ABC-295 checked them. PREREG sealed before any graded game, per level. Fixed rule: E is 1320 for L1, because 1320 is Stockfish's floor and L1 is projected at about 1000–1300. E is 1450 for L2, near its projected midpoint. 200 games (100 rounds), one at a time, one core, the existing openings. The band rule of ABC-204 / ADR-0056 D5 item 4 applies: a score outside 25–75 % allows one step per level, run only on the orchestrator's word. At L1, below 25 % at the floor cannot step: that is reported as an upper bound, not a figure. The PREREG also covers validity (faults, time losses, latency at each level's `st`), the host gates FL/W as in ABC-295, and the time estimate (R2 took 36 min at 100 ms; L2 is about 1.8× that).
- **A3, QE stage B (games),** only on a brief line from the orchestrator citing W. One figure per level: X = E + Elo ± error, on the README Strength scale.
- **A4, README.** After the reads, the Levels table shows the measured L1 and L2 figures labelled as measured, with their conditions (200 games, level time per move on both sides, Stockfish 19 at E). L3–L7 stay projected and are marked as such. The projection prose is adjusted only as far as these figures require. No other README change; the art cmp passes. A CHANGELOG entry is added under an Unreleased heading.
- **A5, gates.** Lint, typecheck, unit and build pass, each run alone under the host lock. QE's verdict signs UAT. A4 is docs only, and A1 touches `tools/` only, so the zero-production-lines waiver applies if the `src/` diff is empty.

Order: se-ABC-316 (A1) → qe-ABC-316 stage A → owner's W → stage B → se-ABC-316-readme (A4) → QE check → merge.
