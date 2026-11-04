---
id: 20261104T170654Z-security-nfr-decision-c7289371
kind: decision
by: security-nfr
at: 2026-11-04T17:06:54Z
verified_by: 
confidence: high: a pre-registration; sealed before any timing run; nothing measured yet
refs:
  - secnfr-nfr008-1104
  - NFR-008
  - R-N8H-1
  - Q-N8H-1
  - ADR-0035
  - ADR-0046
  - ABC-283
  - ABC-271
  - ABC-281
  - ABC-282
  - EPIC-011
  - qe-ABC-283/20261104T164437Z-qe-e2e-observation-d15c2a10
  - se-ABC-283-merge/20261104T170008Z-software-engineer-observation-f7f63e1d
  - orch-2026-10-30a/20261104T151305Z-orchestrator-decision-c7609f51
  - orch-2026-10-30a/20261104T164704Z-orchestrator-decision-2409cec9
  - secnfr-nfr008-headroom/20261104T025651Z-security-nfr-decision-8a4fb936
  - qe-ABC-281/20261104T041512Z-qe-e2e-observation-c7e298cd
  - fd6b595f
  - 58e90d07
  - ebd1263f
  - ea08d7b6
supersedes: 
seal: sha256:99b7b696c1bcb9825427db7d497aa8072d937a338cb0968a2dd75ea303ef9bfe
---

# PREREG, secnfr-nfr008-1104: NFR-008 graded on `main` with twin arms (ADR-0035 D1), then a probe for the headroom recommendation. Sealed before any timing run

Security/NFR, task `secnfr-nfr008-1104` (brief by the Orchestrator, 2026-11-04T17:02:06Z). The triggers that brought it: QE graded ABC-283 alone at 9.60 s (`qe-ABC-283` `…d15c2a10`); SE read the merged tree at 9.77 s, ungraded (`se-ABC-283-merge` `…f7f63e1d`); rulings `…c7609f51` item 3 and `…2409cec9` item 3.

## Session 1: the graded read (one `flock <scratch>/host-test.lock` hold, ALONE)
- **Arms, out of tree, each borrowing `node_modules` by symlink:**
  - **H = `main` `fd6b595f`** (`git archive`; lane inputs = merge `58e90d07`, ABC-271 + ABC-283). Expected 71 files / 2 687 passed / 0 skipped / 0 failed.
  - **H2 = `cp -a` of H** (`diff -r` clean, checked before sealing). The identity twin.
  - **B = `ebd1263f`** (`git archive`; `main` after ABC-281, whose lane inputs equal `ea08d7b6`, graded 9.42 s in `qe-ABC-281` `…c7e298cd`). Expected 69 / 2 650 / 0 / 0. B is the in-window reference for what ABC-271 + ABC-283 cost together. B is not graded.
- **Harness:** `qe-ABC-283`'s `n8.sh`, with three changes only: the expected counts above; every run's `last-run.json` kept for the census; and a wait-clear before round 0 (up to 300 s for load1 ≤ 2.0, logged, not a gate). Order rotates B H H2 / H H2 B / H2 B H. Round 0 is discarded. It runs until 8 complete scored rounds or 12 rounds. `npm test` as spelled, one fresh process per run, `/usr/bin/time` wall and CPU (user + sys).
- **The host gate (named):** before every run, wait up to 120 s for load1 ≤ 8. A run that starts at load1 > 8, exits non-zero or reads other counts is not scored, and its round is not complete. load1, the number of foreign `vitest run` processes, and busy foreign vitest (> 1 % CPU) are logged before every run. Power: the `/sys/class/power_supply` entry is logged (none on `oeselg-dev`, mains).
- **Grader:** `qe-ABC-283`'s `n8-grade.py`, unchanged. k from ADR-0035 D1's 92 % rule (k = 2 at n = 8–10). Twin admissible when |H2 − H CPU median| ≤ max(1.5 % of H's CPU, 10 ms) and its sign is at chance, with n ≥ 8.
- **State, per ADR-0035 D1:** MET when the twin is admissible, the wall R ≤ 10 s, and H's median ≤ 10 s. NOT MET when H's median > 10 s, or H's x(k) > 10 s. Otherwise UNRESOLVED. An inadmissible twin is VOID, not graded. Then ONE re-read session is allowed with the same harness, and it is final.
- **Reported:** H's median, interval [x(k), x(n+1−k)] and max, against **10 s, 9.5 s (`R-N8H-1`) and 9.6 s (`Q-N8H-1`)**; H − B wall and CPU; and the twin.

## The rules, fixed before the read
- **`R-N8H-1`** (owner: the Orchestrator, the `NFR-008` watch; remedy owner: Architect/Design). On H's graded median m:
  - m ≤ 9.0 s: closed;
  - 9.0 < m < 9.5 s: LOW;
  - 9.5 ≤ m ≤ 10 s and MET: **MEDIUM**;
  - NOT MET: HIGH, and the breach goes to the owner (ADR-0035 D6).
  - VOID after the re-read: it stays MEDIUM on QE's graded 9.60 s.
- **`Q-N8H-1`** ("re-state `NFR-008`?", held by the Orchestrator; `secnfr-nfr008-headroom` `…8a4fb936`: "ask (b) or (c) only if the lane's median is back at ≥ 9.6 s after the moves land"):
  - graded m ≥ 9.6 s: **ripe**. The Orchestrator puts it to the owner, because an NFR bound is the owner's. It goes framed (a) / (b) / (c), with this hop's recommendation. The headroom ticket goes ahead either way, because it is option (a) and moves no bound.
  - m < 9.6 s: held.

## The census (information, from session 1's own runs)
- From the scored H and H2 runs' JSON: the per-file slot (`endTime − startTime`) and the per-row in-thread `duration`, as medians.
- From these I name candidates for the headroom work in ABC-281's form: a row in a file that already has a `*_DEEP` lane, moved there under form S (`ADR-0046` § Dated 2026-11-04). I write the candidate list into the scratch record before session 2 starts.

## Session 2: the probe (an estimate, never a grade; one hold, ALONE)
- **P = `cp -a` of H** with the candidate rows marked `it.skip` (the `secnfr-nfr008-headroom` probe form); the diff is kept. Paired against H. Order H P P H, repeated; pair 0 is discarded. **8 scored pairs.** Same host gate, `npm test` as spelled. P's expected counts: 2 687 − j passed and j skipped, for j skipped rows.
- **Read:** the paired median P − H for wall and CPU, with sign counts. It sizes the recommendation in seconds. It is an estimate, because a skip keeps the row's collection and its describe's setup.

## Budget and fences
- At most 1 h of runs in all. Nothing left running. No `src/`, test, config, ticket, ADR or board edit. Records: `plans/nfr-catalog.md` (the `NFR-008` row's latest verdict and the risk lines), this task's notes and `raw/`.
