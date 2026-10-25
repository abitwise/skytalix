---
subtask: qe-ABC-204
role: qe-e2e
ticket: plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md
ref: .grugops/context/qe-ABC-204/
branch: grugops/ABC-204 (0e88c5df)
width: 1 — ALONE, when the board is idle (owner …e44d2903); after qe-timing-ABC-203. Hours.
---

# QE gate + long readings for ABC-204 (rating harness)

> **Owner rule 2026-10-24 (`…4c3f7639`): ONE run.** No prior valid reading exists, so run once under the preconditions and write the result; it is final. No repeat on UNRESOLVED/NOT MET (grade it as the page says); the procedure's own defined steps (e.g. a pooled extension) are part of the one run.

## Do
- Own worktree from `grugops/ABC-204`, merge current `main` first (report sha), own `npm ci`.
- Verify A1–A3 independently, then the long readings exactly as the page and Design ruling state: A5 first (D at 3 000 ms, concurrency 3 → median game wall → rule budget B), then A4 baseline R (200 games, E start 1650, the E′ rule, 25–75 % score band, Stockfish depth guard), then A6 A/A D (100 games, interval contains 0). Plus the QE-owned checks the SE listed (book-move counts, `[FEN]` colour pairs, go→bestmove gap stats reported not graded, gzip of .out).
- Preconditions per reading: AC, no foreign vitest, load1 ≤ 8 at start, thermal logged; a fault on a non-quiet host is UNRESOLVED. If the host goes onto battery mid-run, stop that reading and report.
- Verdict per criterion; the baseline R (with interval) is EPIC-008's M1 baseline.

## Fences
- Only your worktree and `<scratchpad>/qe204/`; raw outputs committed under your context folder per A7 (.out.gz + PGN). No `src/`/`tools/` edits (findings only). Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes via the plugin writer (task `qe-ABC-204`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**`PASS_WITH_GAPS`.** Branch `grugops/qe-ABC-204` in `../wt-qe-ABC-204` (own `npm ci`, node v26.11.1, Apple M3).
**Merge `e546e124`** = `0e88c5df` + `main` `3497aad2` (no conflict). **Tip `16c51d1c`** holds 4 sealed notes, the redacted
`raw/` (17 MB: `.out.gz`, PGN, `SHA256SUMS`, monitor logs, `PREREG.txt`, scripts), the page's `## Reading` and the
`EPIC-008` dated `M1` line. Not pushed and not merged. No `src/` or `tools/` edit. S = `main` `3497aad2`.

**One run under `…4c3f7639`.** Order: A5, then A4. The page's labels govern: the brief's "A5 wall/B" and "A6 A/A" are
the page's A5 (one D run) and A6.

- **A1 MET:** both tool hashes equal the pins.
- **A2 MET**, with QE-204-b and QE-204-a.
- **A3 MET:**
  - the diff is `tools/rating/` + 1 line each in `tsconfig.json` and `biome.json`;
  - 0 `*.test.*`; `npm test` 62 files = base;
  - `dist/` 22 files, 0 from `tools/`.
- **A4 MET: baseline R = 1 910 + 151.3 ± 50.3 = 2 061.3 ± 50.3.**
  - W/L/D 132/50/18 (70.5 %); 200/200 games, 0 faults; depth guard 0 of 9 115 below 4.
  - 0 foreign-vitest samples and load1 ≤ 7.62, so no overlap.
  - The first run at E 1 650 read 1 913.4 ± 61.8 (82.0 %, outside the band), so E′ = 1 910. **E = 1 910 is frozen.**
- **A5 UNRESOLVED: a battery switch at 17:40:24Z stopped it at 99 of 100 games.** Not re-run.
  - 0 faults in 99 games. The tool printed no Elo line.
  - QE's port of `elo.cpp`, on the tool's W/L/D 26/21/52, gives **+17.6 ± 47.4**. It contains 0.
  - Overlap: 42 of 99 games overlapped a foreign vitest (5 bursts, one a 53 min full suite). The 57 clean games give
    **0.0 ± 61.5**, which also contains 0.
- **A6 MET.**
  - **R:** median game 131 s, 45.5 games/h at concurrency 2, 200 games in 4.40 h ≤ 10 h.
  - **D:** median game 330 s at 3 000 ms, 31.4 games/h at concurrency 3, so 400 games would take 12.2 h > 8 h.
  - **B = 1 500 ms**, `timemargin` 3 500, projected 6.1 h. 2 000 would need a median ≤ 324 s, and the median is in
    [328.5, 330] s whatever game 100 took.
- **A7 MET** at the tip.
- **QE-owned checks:**
  - `[FEN]` pairs: all complete rounds pass (23 non-capturable en-passant squares are dropped by the tool, QE-204-c).
  - Book moves: A5 209 `info string book` / 205 PGN; first R 87 / 87; baseline 78 / 78.
  - go→bestmove gap over 3 031 ms: A5 0 of 5 664; first R 5 of 8 359 (max 3 206 ms); baseline 2 of 9 084 (max
    3 060 ms). All are outside the engine's own search clock (QE-204-d).
  - gzip -9: 13.2× (D) and 7.9× (R).
  - Openings regenerate byte-identical.
- **Gates:** lint, typecheck and build 0; `npm test` 62 files, 2073/2073, success; skips 0, `No findings.`
- **Findings:**
  - **QE-204-b MEDIUM:** the "artifact sha256" is `dist/uci.js` only. It is the same at `8ccba739` and `3497aad2`,
    two different engines (tree hashes `3798b8d1…` v `726e5225…`). Fix before the first D reading (`ABC-205`).
  - **QE-204-a LOW:** a symlinked out dir into the checkout passes the guard.
  - **INFO:** -c (en-passant field), -d (gaps, for Security/NFR), -e (R depends on its anchor: 148 ± 80 between E
    1 650 and 1 910), -f (host), -g (records; the queue TTL of 30 min is shorter than the hop).
- **UAT:** the waiver applies (0 production lines). This verdict signs under `…5aaf7cec` item 2.
- **Owed:**
  - the Orchestrator rules A5's UNRESOLVED as final, and Done;
  - the SE fixes QE-204-b (and -a);
  - Security/NFR reads QE-204-d.
- **Notes:** gate `…fbff3e18`, A5 `…1891d465`, A4 `…bfffcf4c`, verdict `…b5f4d5a1`.

**Trace row** (for the Orchestrator):

| ABC-204 (qe-ABC-204) | QE PASS_WITH_GAPS at merge e546e124: A1–A4, A6, A7 MET; A5 UNRESOLVED (battery stop 99/100, 0 faults, QE elo.cpp +17.6 ± 47.4; 57 clean 0.0 ± 61.5); baseline R 2 061.3 ± 50.3 at E 1 910 (200 g, 0 faults; first R at E 1 650 1 913.4 ± 61.8); A6 R 4.40 h ≤ 10 h, D median 330 s → B = 1 500 ms | EPIC-008 (M1 baseline) | rating harness under tools/rating (R and D modes, 100 pinned openings), outside npm test | NFR-008 untouched (62 files = base); NFR-004 gaps reported (QE-204-d); QE-204-b MEDIUM, -a LOW, -c/-d/-e/-f/-g INFO | grugops/qe-ABC-204 @ 16c51d1c (merge e546e124)<br>tools/rating/{rating.ts, openings.ts, openings.epd}, biome.json, tsconfig.json<br>.grugops/context/qe-ABC-204/notes/ (4) + raw/; ABC-204 ## Reading; EPIC-008 dated M1 line | lint/typecheck/build 0; npm test 62/2073 success; skips 0 No findings.; openings byte-identical; guard probes | waiver applies (0 production lines); signs UAT under …5aaf7cec item 2 | A5 UNRESOLVED ruling (Orchestrator); QE-204-b/-a fix (SE) before the first D reading; QE-204-d to Security/NFR | In Review → Orchestrator's call |
