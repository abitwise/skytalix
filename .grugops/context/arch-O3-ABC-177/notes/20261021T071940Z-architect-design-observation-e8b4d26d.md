---
id: 20261021T071940Z-architect-design-observation-e8b4d26d
kind: observation
by: architect-design
at: 2026-10-21T07:19:40Z
verified_by: 
confidence: high (QE's readings as printed; git diff and note counts read here); estimates are marked; causes UNKNOWN - verify
refs:
  - ABC-177
  - NFR-008
  - R-174-1
  - ADR-0046
  - A10
  - A11
  - O3
  - 20261021T071304Z-qe-e2e-observation-bc49c2fe
  - 20261021T071305Z-qe-e2e-observation-84059cad
  - 20261021T071306Z-qe-e2e-decision-e808274d
  - 20261021T065500Z-orchestrator-decision-31ab7d2d
  - .grugops/queue/pending/arch-O3-ABC-177.md
  - QE-174-b
  - .grugops/context/qe-ABC-177/probe/timing3/t3-r1/
  - 20261021T071200Z-qe-e2e-observation-277060fc
  - ADR-0035
supersedes: 
seal: sha256:4dde1114af363e60d9571c7d4115c637a24de73f56e529792384f29d5515474c
---

# O3 for `ABC-177`: evidence read from QE's t3-r1 rows. The unchanged base read 0.92 s slower than at `QE-174-b`, and the remedy saved more than `ADR-0046` predicted

Records only. No lane was run and nothing was timed. Every reading below is QE's, read from files in
`.grugops/context/qe-ABC-177/probe/timing3/t3-r1/` (`nfr008-full.tsv`, `nfr008-full.summary.txt`,
`readout-nfr008-full-b.out`). Every figure marked "estimate" is arithmetic on those readings, not a reading.

## 1. The base code is the code `QE-174-b` read. It read 0.92 s slower here
- `git diff be6a5599 ff1e375f` over `src/`, `tools/`, `vitest.config.ts` and `package.json` is empty.
  Outside the state planes only `AGENTS.md` changed.
- The one lane input that grew is the note count that `qe-hop-integrity.test.ts` reads: 2 963 → 2 988 (+25, +0.8 %).
  That file was 0.67 s of in-thread time, so the growth is about +0.005 s (estimate).
- `QE-174-b` read 10.010 s median wall on this code (thermal 0, battery, twin wall R 0.280 s).
- t3-r1 read **B 10.93 s and T 10.83 s** on it (AC, warm 5/8). That is **+0.92 s, +9.2 %**, on unchanged code.
- So the measuring stage itself was slow. The host identity is `UNKNOWN - verify` (`…277060fc`: `Mac.lan` and
  `MacBook-Air.local`). AC power should read faster than battery, not slower.

## 2. The remedy saved more than the design predicted
- H−B wall median **−1.620 s**, interval [−1.710, −1.540], sign 0/8.
- `ADR-0046` D3 predicted −0.75 to −1.4 s of wall. The reading is past the top of that range.
- H/B wall ratio in the stage: 9.39 / 10.93 = 0.859.
- Applied to `QE-174-b`'s 10.010 s, the stage's own delta or ratio gives **about 8.4–8.6 s** (estimate, not a reading).

## 3. The per-round thermal flag does not explain the miss on its own
- Rounds 1–3 ran at thermal 0. H read 9.06, 9.26, 9.44 s; H2 read 9.15, 9.44, 9.38 s. The median of those six is 9.32 s.
- B read 10.63, 10.87, 11.13 s in the same rounds.
- So the stage was slow from round 1, before any thermal flag. load1 before those runs was 3.17–7.20.
- Round 0 (discarded by protocol, load1 1.80–2.84) read B 10.38, H 9.02, H2 9.07 s. Not a reading; descriptive only.
- Candidate causes are heat soak from the foreign full suite that ran to 06:41:32Z, the lane's own load, and the
  host. Which one is `UNKNOWN - verify`.

## 4. The size of the miss against the noise
- The miss is **0.195 s** over 9.2 s.
- That is under one twin wall R: H/H2 0.250 s, B/T 0.280 s.
- Re-deriving `ADR-0046` D4 with this stage's own twin wall R gives 9.16 s (B/T) or 9.25 s (H/H2). 9.395 s misses both.
  So restating the target from these Rs does not change the outcome.
- The B/T twin CPU median is 1.54 % of base, over `ADR-0035` d1's 1.5 %. So this stage's twin R is not used here to
  move `F` or D4.
