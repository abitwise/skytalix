---
id: 20261103T202041Z-architect-design-decision-ab9f83a3
kind: decision
by: architect-design
at: 2026-11-03T20:20:41Z
verified_by: 
confidence: high on the folds (each is the owner's verbatim word or a merged commit); high on the export facts (read from the export's own index files and HTTP headers); medium on the slice and time figures (estimates, UNKNOWN - verify until the build measures them)
refs:
  - arch-owner-answers-1103
  - grugops/arch-owner-answers-1103
  - ADR-0067
  - ADR-0056
  - ADR-0024
  - ADR-0048
  - ABC-239
  - ABC-274
  - ABC-270
  - ABC-277
  - EPIC-011
  - Q-3K-7
  - Q-3K-9
  - Q-3K-6
  - Q-3K-8
  - B-T8
  - SEC-HP-2
  - Q1
  - E2
  - E2-pre
  - NFR-008
  - RISK-EPIC010-05
  - dc7dc15d
  - 2410d4f7
  - 1e558566
  - orch-2026-10-30a/20261103T200613Z-orchestrator-decision-af126c04
  - qe-ABC-274/20261103T143139Z-qe-e2e-decision-fa87f74d
  - arch-ABC-239/20261103T105010Z-architect-design-decision-e4c34239
supersedes: 
seal: sha256:41e48433532e27ef5b158d2e2e9a927b43cc393a7606d2ace817799a96f1254b
---

# arch-owner-answers-1103 decisions: the owner's answers `…af126c04` are folded into `ADR-0067`, `ADR-0056`, `ADR-0024` and `ADR-0048`. The Lichess data for `ABC-239` is pinned. `SEC-HP-2`'s line is redacted. No bar moved

Architect/Design, task `arch-owner-answers-1103`, on `grugops/arch-owner-answers-1103` from `main` `dc7dc15d`.
Records only. The one run was a data-size probe under the host lock (HTTP headers plus the export's index files,
under 2 s, `raw/lichess-probe.txt`). The source is the owner's word, verbatim: "1. yes ; 2. yes ; 3. no ; 4. no ;
5. ok yes ; 6. yes ; 7. yes; 8. yes".

## 1. The folds
- **`ADR-0067`: ACCEPTED 2026-11-03, IN FORCE as the method.**
  - E2-pre (`ABC-274`) merged at `2410d4f7` on QE `…fa87f74d` (`G2` 0.9897 ×). F8 did not fire, so `ABC-239`'s A3
    and A4 hold as written.
  - Decision log: three rows (owner, Orchestrator, Architect).
  - Decision 9's Lichess block is live, with a pointer to § Addendum.
  - B-T8's row: "approved 2026-11-03".
  - § Consequences: a dated line. Item 8 lets `ABC-270`'s design start now. The build order stays `ABC-239` first,
    under the stall clause, and the Orchestrator decides which build lands first.
- **`ADR-0056`:** a status fold block, a D2 dated line (row E2 accepted; row Q1's d4 open for design) and a D7 dated
  line.
  - Q-3K-7: (a) yes, (b) no, (c) no.
  - B-T8: approved. Q-3K-9: yes.
  - Still open: **Q-3K-6 and Q-3K-8 only.**
- **`ADR-0024`:** a status block, plus a dated line at d4. SEE is opened for the **design** of Q1 only, and a build
  ships on its own evidence (C2′, 100 games at 100 ms, with S′ and the Levels lane). Delta pruning and checks in
  quiescence stay fenced.
- **`ADR-0048`:** a dated status block, plus a line at d6. Lichess CC0 game data is admitted for tuning. It is data,
  not code. Its provenance (URL, sha256, licence line) goes in the tool's output header. `NOTICE` does not change.
- **`SEC-HP-2` / `ABC-277` A7:** `.grugops/context/se-ABC-262/raw/gates/summary.txt` line 5 now reads
  `foreign=[<foreign: vitest> count=3]`. One line, one commit (`1e558566`). No history rewrite.

## 2. The data pin (`ADR-0067` § Addendum 2026-11-03)
- **The export:** `lichess_db_standard_rated_2017-03.pgn.zst`: 2 169 142 067 bytes, 11 346 745 games, sha256
  `b319297e9270285635d615cbcd19a9b0d44747be3ff91d5b3eac41175b794320`.
  - It is the last and largest month before `%clk` comments begin. `2017-04` has the same games at 1.6 × the bytes.
  - It clears the export's known-issue list (self-play before 2016-03, illegal castling up to 2016-08, the 2020–2021
    result issues). It comes before bots.
  - `[%eval]` is in about 6 % of games in every month. So the reader drops every comment unread, and a test proves
    it.
- **The game filters:**
  - rated standard games, with no `Variant` or `FEN` tag;
  - base ≥ 180 s;
  - both ratings ≥ 2000, **and a gap ≤ 200 (new; it only narrows)**;
  - `Termination` "Normal", and a decided result tag;
  - no BOT;
  - every move replays legally;
  - games de-duplicated.
- **The position rules:**
  - ply ≥ 16;
  - sampled by key: fnv1a32("ABC-239/lichess/v1\n" + key) mod 8 = 0;
  - not in check, and a legal move exists;
  - quiescence equals the static score;
  - labels averaged per key;
  - a Lichess key equal to an own-validation key leaves the Lichess rows, and validation is never trimmed;
  - **a cap of 1 000 000** by the smallest hash; **below 250 000 rows, STOP** before any fit.
- **The host:** 2.17 GB on disk, streamed through `node:zlib` zstd and never decompressed to disk. About 1.2 M rows
  inside the heap flag `--max-old-space-size=3000` (host 29 GB). One run is estimated at 10–15 min, with a hard limit
  of 30 min (`UNKNOWN - verify` until the build measures it).
- **The split and the mix:**
  - Outer and inner validation are own games only, by decision 9's strings, unchanged. Every Lichess row is training.
  - **Own games carry 0.5 of the loss**, fixed before any fit and never chosen on validation or play.
  - **K is fitted per source** (K_own, K_lichess), each at the base values, then fixed.
  - Material stays frozen. The C-S / C-F rule is unchanged.
  - The mixed fit is emitted. The own-only fit is reported beside it.
- **Provenance:**
  - The manifest gains the export by URL, byte length and sha256, never by local path.
  - The tool refuses a file whose sha256 differs.
  - The header records every filter count, K_own and K_lichess, the 0.5 weight and a CC0 licence line.
- **The re-read:** B-T0–B-T8 and F1–F7 all hold, and **no bar moves.** The four new stops are data-stage stops (under
  250 000 rows; reader drops over 0.1 %; a run over 30 min; a heap over the flag), not bars.

## 3. Owner questions
- **None.** Every answer the brief needed is in `…af126c04`. No bar had to move.
