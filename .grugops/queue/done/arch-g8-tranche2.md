---
subtask: arch-g8-tranche2
role: architect-design
ticket: ADR-0046 tranche 2 (NFR-008 lane wall)
ref: .grugops/context/arch-g8-tranche2/
branch: new grugops/arch-g8-tranche2 from main (worktree .claude/worktrees/arch-g8-tranche2)
width: records only; no vitest, no timing. Leave no process running.
---
# Architect (records): tranche 2 opens (G8 head 9.82 s > 9.6 s)
## Read
- ADR-0046 § Addendum 2026-10-30 (the tranche-2 trigger; the Alternatives table T2a–T2c) and § Ruling 2026-10-31; ADR-0035 D6.
- qe-ABC-245's gates/G8 note (…af467c7b) and findings (…cf53b0ed: QE-245-b noise; head run 3 at 10.19 s slow across all files; base 9.44 s).
- G8 history on main: qe-ABC-243 9.28, qe-ABC-242 9.41, qe-ABC-221 9.84 (inadmissible), qe-ABC-245 9.82.
- ABC-246's page (it adds 2 rows to src/uci-session.test.ts).
## Do
- Record tranche 2 as opened, with the reading. Re-open the candidates as the addendum says: T2a is now stale, because ABC-221 has landed; re-cost it. Also cover T2b, T2c and any new candidate a census of the current lane finds.
- Give each candidate its estimated saving, risk and coverage loss.
- Say whether the noise (QE-245-b) changes what the trigger means. The trigger itself is not yours to waive without a dated amendment, and if you would move it, that change is PROPOSED.
- Recommend one for BA/PM's ruling. Name the ticket BA/PM should cut; do not cut it.
- If the lane is still over 9.7 s after tranche 2, NFR-008 goes to the owner. Say how that would be read.
## Fences
ADR-0046* only (and ADR-0035 only if a dated cross-reference is needed). No src/, tools/, data/, ticket or board edits. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `arch-g8-tranche2`, contextRoot = worktree), commit, `## Result` here, brief + claim to done/.

## Result
- **Tranche 2 is OPEN** (recorded in `ADR-0046` § Addendum 2026-10-31). It opened on `qe-ABC-245`'s head median of
  9.82 s, which is above 9.6 s. It is not waived, and no line moves.
- **The noise reading (`QE-245-b`).**
  - The trigger fired as written.
  - It is not growth: the head added a 1.67 ms row, and head run 3 at 10.19 s was slow in every file, with CPU
    tracking wall.
  - The lane's central value is about **9.5 s**: the six runs pooled give a median of 9.51 s, and adding up from
    `ABC-242`'s 9.41 s agrees.
  - So the noise strengthens the case for tranche 2, because one run already reached 10.19 s. It also sizes the
    remedy at about −0.3 s.
  - The 9.6 s line is spent, and no tranche 3 is defined. The lines left are 9.7 s (owner) and 10 s (`NFR-008`, D6).
- **Candidates.** Every figure is an estimate, from the census of `se-ABC-221`'s lane JSON at `c48a6f83`; shape only.
  - **T2a narrow:** A5's six searched rows move to the file's existing `ENGINE_DEEP` branch, under default-lane kill
    parity. −0.06..−0.16 s, LOW-MEDIUM risk, no coverage lost.
  - **T2a wide:** every P/C row. ≈ −0.47 s, MEDIUM risk. It loses D12, the dropped-token time reads, A6-d1 and the
    level rows.
  - **T2b:** `QE-208-a/b` and the pawn-only row move to `SEARCH_DEEP`. ≈ −0.39 s, MEDIUM risk. It loses
    `ADR-0050`'s abort-restores-root and key-under-null guards.
  - **T2c widened:** `QE-208-a` sampled more sparsely, `QE-208-b` on a cheaper root, under parity. −0.05..−0.25 s,
    LOW-MEDIUM risk, no coverage lost.
  - **T2d (new):** A4-a2 on R2. ≈ −0.035 s, LOW risk, no coverage lost.
  - **Rejected:** U2 to deep lanes (loses the ep guard); O4 and O5; the owner's levers; a coarser step on P rows; a
    jump clock.
  - **Why T2a is stale:** `ABC-221` finished pinning the D4 arithmetic on the stub seam. A5's bare go and G = 3 500
    duplicate reads that other rows already make.
- **Recommendation (T2-R, PROPOSED, for BA/PM's ruling): T2c + T2a narrow + T2d, one S test-only ticket.**
  - Est. −0.15..−0.45 s of wall, central about −0.3 s. No coverage lost by construction.
  - Design target: `G8` head median ≤ 9.4 s.
  - **The ticket BA/PM should cut (not cut here):** *"The default lane sheds ~0.3 s and loses no coverage:
    `QE-208-a` sampled more sparsely and `QE-208-b` on a cheaper root, `ABC-167` A5's duplicated searches moved to
    `ENGINE_DEEP`, and A4-a2 on R2 (test-only)."* S, P1, `EPIC-010`.
  - It shares `src/uci-session.test.ts` with `ABC-246`; taking `ABC-246` first is simplest.
  - T2b is held as the alternative.
- **The owner line (9.7 s after tranche 2).**
  - It is read on the gate's head median and on every later admissible one.
  - **W1 (PROPOSED, BA/PM's word):** a crossing is confirmed by a head-only n = 3 re-read in a second window. It
    routes to the owner if the median of the six head runs is above 9.7 s.
  - If routed: `NFR-008` is still MET, but the agent-side headroom is gone. The owner's options:
    - (a) accept the band;
    - (b) accept coverage-losing moves, T2b first;
    - (c) W, `maxWorkers: 3` or the heap flag.
  - The 10 s line is untouched.
- **For the Orchestrator:** `T-QEHOP-GROWTH` (`ADR-0035` B3) has fired.
  - `main` holds 4 206 notes. The count crossed 4 000 on 2026-10-30, between `33669cd8` and `e7b22c11`.
  - No re-read is on record. A QE re-read is owed, and Architect/Design records it. Severity LOW.
- **Owner:** nothing is owed now.
- **Commits:** the ADR at `38d02496`; the notes, the probe and this Result in the next commit.
- **Notes (sealed):** in `.grugops/context/arch-g8-tranche2/`:
  - decision `…28d7bc3b`;
  - observation `…f1e25b52` (the census and candidates);
  - observation `…ce01caa3` (artifacts).

  The artifacts note was first tried as an `artifact-ref`. The writer refused it, because that kind needs a §14
  `gate_run`, and it was re-recorded as an observation.
- **Not touched:** `src/`, `tools/`, `data/`, `AGENTS.md`, ADR-0035, tickets and the board. Nothing was run, timed,
  pushed or merged, and no process is left running.
