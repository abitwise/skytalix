---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-08T23:11:08Z
subtask: qe-ABC-298
role: qe-e2e
ref: .grugops/context/qe-ABC-298/
branch: new grugops/qe-ABC-298 from grugops/ABC-298 (b40a2d7e) — worktree .claude/worktrees/qe-ABC-298
width: ADR-0077 d9 step 7, in two stages. Stage A now, untimed. Stage B (timing) only on a later brief line from me. No games, no merge.
---
# ABC-298: QE's verdict
Read ADR-0077 whole with its dated lines (incl. arch-ABC-298-stop …251b60bb), ABC-298's page, your freeze …44a6717d / …1ba0ac40, se-ABC-298's notes (…db1b4b5c, …0c57c9f0, …e57979e2, …44c46e34), my note at 2026-11-08T23:11:08Z under orch-2026-10-30a.
**Stage A, now, untimed:**
1. Stage 0: the build's first code commit descends from b9b8eee9; the freeze's hashes re-read equal; src/ base bba42fb7.
2. SG0, SG1 (a)–(c), SG2 against your frozen figures; at SG1 (c) admit exactly the 4 removed lines of 400c1b9e and nothing else. Re-run what you need to trust it; G4 may be re-run or read from the Engineer's raw files at your judgement, saying which.
3. Gates: typecheck, lint, default lane whole with one worker, the pin deep lanes. Read the code against d1–d3 yourself.
4. Seal the timing PREREG before any timing figure exists: SG3 under ADR-0055 D3-V2 (≥ 1.03 on two boards, ≥ 1.00 on the third; 5 % spread rule; one re-run then VOID), G6, and NFR-008 (≤ +0.10 s, H − B, one worker spelled out, never plain `npm test`), session order, FL/CF rules as ADR-0077 names them.
5. STOP and report. Do not take a held window or time anything.
Every run as `flock <scratch>/<home>/<repo>/host-test.lock <cmd>`, one core, one at a time, vitest with one worker. Fences: your records and test rows only if a gap needs one (say so). No src/ change, ADR, ticket, EPIC or board. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); commit after stage A; a ## Stage A block in this brief, kept in claimed/. Before each commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.

## Stage A
*by qe-e2e (claude-opus-5-5), at 2026-11-09T00:14:08Z, on `grugops/qe-ABC-298` from `grugops/ABC-298` `b40a2d7e`. Untimed. No held window, no timing figure, no game.*
- **Notes (sealed, `.grugops/context/qe-ABC-298/`, commit `19d0ba57`):** stage-A readings `…c0727df9`; code read against d1–d3 `…e7d15923`; **timing PREREG `…c981798f`**, sealed before any SG3, `G6` or paired `NFR-008` figure exists.
- **Stage 0:** the first code commit `43fe357e` descends from `b9b8eee9`; `src/` base `bba42fb7` (freeze, `main` `012271f9`, merge-base `2893bdde`); the freeze's 29 hashes re-read equal; F6 does not fire.
- **SG0** 24 / 24 and `PERFT_DEEP` 32 / 32, blob `8fe75ef0` unchanged. **SG1 (a)** `cmp`-equal, 7 / 7. **SG1 (b)** `G4` re-run by QE: `b65f747a…` / `2e1534f0…`, byte-equal to the frozen digest. **SG1 (c):** exactly the 4 lines of `400c1b9e` removed, as ruled (`…251b60bb`); every frozen row in the default lane (2 734 → 2 782) and the pin lanes collected and green. **SG2 (a)–(c)** met (38 cases; walks 0 mismatches, 0 mutations; 8 / 8 never played). **Gates:** typecheck, lint (148 files), build, default lane one worker, the pin lanes; `G1` 54 / 58; mate floors as `main`. No F1, F2, F3, F6, F8.
- **Code read (d1–d3):** every duty kept as the text reads. INFO QE-298-j, l, o, p. **Gap QE-298-m (LOW):** 2 of the 12 mocking files are not byte-unchanged (SG1 (a) rows appended; the ruled re-point); their mock blocks are unchanged and green; the freeze's § 5 letter overreached d3 item 14. No test row was written: none was needed.
- **Lock:** six holds, 52 min 57 s in all, the longest 24 min 43 s; each under 1 h.
- **Stage B needs** the Orchestrator's line citing the owner's word that the whole host is quiet (his other projects too) and a `ps` check. **One held window of about 25–45 min, three holds:** SG3 (5–12 min typical, about 43 min worst), then `G6` (2–15 min, capped at 50), then `NFR-008` (13–20 min, `taskset -c 0 npm test -- --maxWorkers=1`, H − B ≤ +0.10 s). Before the window: `main`'s `src/` still `bba42fb7`.
- **For the Orchestrator before stage B:** QE-298-k (SG3 and `G6` run unpinned, as `ADR-0077` d7 and `ADR-0055`'s second addendum item 2 fix the instrument; pinning SG3 would be the Architect's call) and QE-298-n (`NFR-008`'s absolute 10 s legs are INFO at one worker; the graded leg is H − B ≤ +0.10 s).
- **Not done:** no verdict yet; the brief stays in `claimed/` until stage B.

## Stage B — go
*by orchestrator (claude-opus-5-5, orch-2026-10-30a), at 2026-11-09T08:13:08Z.*
- **The owner's word:** 2026-11-09, "i think all is quiet now", given in answer to my ask that the whole host be quiet, grugops and his other projects included. Read as the PREREG's held-window word.
- **`ps` check, by class and count only:** one foreign monitoring tool at about 13–25 % of one core; three idle Claude sessions under 2 % each; container and network daemons under 1 %. 0 foreign vitest, 0 `cutechess-cli`. load1 0.32 on 24 cores, Tctl 48.9 °C. `main`'s `src/` is `bba42fb7`.
- **Rulings for the window:** QE-298-k: SG3 and `G6` run unpinned, as sealed. QE-298-n: `NFR-008` is graded only on H − B ≤ +0.10 s, and the 10 s legs are INFO.
- **Run stage B on PREREG `…c981798f` exactly as sealed:** § 1's checks outside the lock, then holds 1–3 in its order. A STOP or NOT MET ends the window. Then give the verdict. Nothing else is dispatched while the window is open.

## Stage B
*by qe-e2e (claude-opus-5-5), at 2026-11-09T08:22:10Z, on `grugops/qe-ABC-298` at `dd8e2404`. Run on PREREG `…c981798f` as sealed, after the go line above.*
- **Verdict: FAIL.** SG3 is **NOT MET (F4)**. `G6` and `NFR-008` are **UNRESOLVED, not read**: the window ended on the miss, by PREREG § 5. **`ABC-298` does not merge.** BA/PM closes it as dropped, and with the owner's question-2 yes, V3 closes. Nothing is owed to UAT. QE makes no board move.
- **Notes (sealed, `.grugops/context/qe-ABC-298/`):**
  - hold-1 readings: `…125e3e29`;
  - `failed-attempt` `…77448919`;
  - verdict (decision): `…77b0a7e8`.
  
  Raw files are in `raw/out/stage-b/`: `checks.txt`, `sg3/`, `session.txt`, `ps.txt`. Paths are written as placeholders, and foreign PIDs are masked.
- **§ 1, outside the lock: all checks hold.**
  - Scripts: 22 / 22 hashes equal.
  - `main` is `bfdff004`, `src/` `bba42fb7`. B is `2893bdde` (`bba42fb7`), and H is `dd8e2404` (`b8d055c9`). They differ outside `src/` in `.grugops/` only.
  - F8: no evaluation, quiescence or SEE change.
  - Node v26.12.1.
  - The trees, `g6/` and the arms B, H and H2 are built under `<scratch>/<home>/<repo>/qe-abc298b/`. H and H2 are `diff -r` empty.
- **Hold 1, SG3** (S2, D3-V2, unpinned). Head ÷ base, unrounded:

  | board | H ÷ B | note |
  |---|---|---|
  | kiwipete | **0.962736** | |
  | position-6 | **0.973838** | its one re-run, owed for H's 5.51 % spread; the main reading was 0.951913 |
  | start | **0.959488** | |

  - Every board is valid: spread ≤ 5 %, agreement held, 5 / 5 admitted with 0 discarded, unshared, and Tctl medians about 74 °C.
  - None of the 15 graded pairs reaches 1.00.
  - (v1) held, with no STOP-identity. On kiwipete, base reached depth 10 in 4 of 5 runs, and head reached 9 in all 5.
- **Holds 2 (`G6`) and 3 (`NFR-008`): not run** (§ 5: "NOT MET ends the window"). No figure of either exists.
- **Lock:** one hold, 08:15:35Z–08:18:43Z, **3 min 08 s**, with nothing else in it. Stage A's six holds were 52 min 57 s.
- **Gaps:**
  - QE-298-m (LOW, stage A) stays open, and is moot without a merge.
  - INFO QE-298-q: `origin/main` is a stale 2026-11-05 push.
  - INFO QE-298-r: one idle containerised node process names vitest in its arguments. No sealed detector counts it.
  - INFO QE-298-s: kiwipete's foreign cores peaked at 0.796, under the 0.8 line. The monitoring tool ran at 21–35 %.
- **Host (by class and count):** load1 0.41–1.31, one monitoring tool, 0 foreign vitest by the sealed detectors, and 0 `cutechess-cli`.
