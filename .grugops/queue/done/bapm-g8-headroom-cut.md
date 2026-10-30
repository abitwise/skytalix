---
subtask: bapm-g8-headroom-cut
role: ba-pm
ref: .grugops/context/bapm-g8-headroom-cut/
branch: new grugops/bapm-g8-headroom-cut from main b0b1778e
width: records only, NO node/tests (a QE plays 40 games ALONE on this host)
---
# BA/PM: cut the default-lane headroom ticket; amend ABC-242 and ABC-221 (arch-g8-headroom)
## Read
Branch grugops/arch-g8-headroom @ 5fd3eee7 (read with `git show`): ADR-0046 § Addendum 2026-10-30 (R1–R4, PROPOSED as an extension of
the accepted step rule — your word at the cut makes it so, as at ABC-177), ADR-0035 addendum, its Result in
.grugops/queue/done/arch-g8-headroom.md and raw/note-decision.md. qe-ABC-229 `…0b7fd4f6` (G8 9.90 s, QE-229-a).
## Do
1. Cut a new ticket (S, P1, test-only, EPIC-010 or the NFR-008 owner's epic): time-blind virtual-clock rows in src/cli.test.ts and
   src/uci-session.test.ts take the coarsest step that keeps QE's caught-mutant set (R1–R4; CLI/UCI paired rows move together; row
   count, bounds and titles unchanged). Acceptance: G8 head median ≤ 9.4 s (design target; NFR-008 stays 10 s); QE per-row node
   count + caught-mutant comparison; N8-LANE on the two files. Triggers (> 9.4 s → second batch; > 9.7 s after it → owner) in Notes.
   Pull order: before ABC-242, ABC-221 and ABC-243 (shared files). Score DoR.
2. Amend ABC-242: its rows follow R1–R4; the lane form is level 1's 100 ms at the coarsest safe step, not QE's 2 000 ms probe set-up.
3. Amend ABC-221 A9: each real-engine row records its clock reads per search; period rows stay stubbed.
4. ABC-243: note the ≈ +0.03 s estimate, ordering after the new ticket.
## Fences
Records only. No src/, tools/, data/, board, ADRs. Never push/force/amend/rebase/merge into main. No host paths. Run no node or tests;
draft a seal script (context-io admitAndAppend only) and give me the command. Never `while pgrep -f`.
## Publish
Notes (task `bapm-g8-headroom-cut`), commit, `## Result` + trace row here, brief + claim to done/.

## Result

*BA/PM, 2026-10-30, task `bapm-g8-headroom-cut`. Records only, branched from `main` `161e940d` (the caller's setup;
the brief's `b0b1778e` is its ancestor). Branch `grugops/bapm-g8-headroom-cut` @ `5b549cbe` holds the records; this
brief and its claim moved to `done/` in the next commit. Design read from `grugops/arch-g8-headroom` @ `5fd3eee7`.*

- **`ABC-244` cut: S, P1, test-only, `EPIC-010`, DoR 10/10. Recommended Backlog → Ready, pulled before `ABC-242`,
  `ABC-221` and `ABC-243`.**
  - Title: "Time-blind virtual-clock rows in `src/cli.test.ts` and `src/uci-session.test.ts` take the coarsest step
    that keeps QE's caught-mutant set (`ADR-0046` § Addendum 2026-10-30, tranche 1; test-only)".
  - **Units (one value each, written in both files, R3):**
    - **U1:** CLI `ABC-230` `STEP_MS` `:4555` (A1, read-once, A3) with UCI `ABC-230` `:1286` (A2 byte-equal row);
    - **U2:** CLI `ABC-241` `:4626` (A4 ×2, A7) with UCI `ABC-241` `:1413` (A5 CLI-equals-UCI row).
    - Both are at 100 today, with {100, 1 000} admitted.
    - The other 10 of the 18 block rows are fixed-depth or non-searching and stay byte-identical.
    - Census units are optional, at most 4: rows added after `4debc07d`, each time-blind with a single-literal step.
  - **The BA/PM word on R1–R4 is given on its page**, with `ABC-177`'s three conditions: parity decides, never
    finer, and a gain also keeps the old step; 1 000 never makes a ≥ 2-interval search one interval; the list is
    frozen first.
  - **Acceptance:**
    - **Build:** A1 R1 census per row; A2 coarsest step per unit on both surfaces; A3 per-file count equal and names
      byte-identical, 0 skipped; A4 step literals only; A5 everything else byte-identical.
    - **Gate:** A6 the same caught-mutant ids per changed row (frozen list: `qe-ABC-230` seam fault, `qe-ABC-241`
      QM1–QM4, untrimmed keys, a non-zero repetition); A7 fewer nodes per moved row; A8 `N8-LANE` on the two-file set,
      ≤ 650 ms CPU; A9 `G8` b h h b b h, `NFR-008` ≤ 10 s, design target ≤ 9.4 s; A10 gates, 0 skips.
  - **Triggers** (§ NFR triggers): > 9.4 s at its gate, or a later `G8` > 9.6 s, opens tranche 2 as a new ticket.
    Still > 9.7 s after tranche 2 goes to the owner. > 10 s at any gate goes to the owner.
  - The estimate is −0.3..−0.65 s, `UNKNOWN - verify`. A8 and A9 are ALONE reads. UAT is waived by the test-only rule,
    measured at delivery. No smoke.
- **`ABC-242` amended** (dated header, `NFR-008` line, Test note 5, dependency, DoR rows 5–7; stays 10/10):
  - its rows follow R1–R4;
  - the lane form is level 1's own 100 ms at the coarsest safe step, with step 1 as the parity reference and
    condition 2 applied. It is not QE's 2 000 ms `virtualClock(1)` probe set-up;
  - `A4`'s three-way row uses one step;
  - estimate +0.05..+0.15 s; pull after `ABC-244`.
- **`ABC-221` amended** (dated header, `A9`, dependency, DoR rows 5–6; stays 10/10):
  - `A9` gains an R1 census line for each real-engine default-lane row (A8's parity rows, A11's lane row);
  - the period rows A2–A4 stay on the stubbed `chooseMove`, and a time-blind real-engine row takes R2;
  - estimate about +0.1 s; pull after `ABC-244`.
- **`ABC-243` noted** (dated header, `NFR-008` line, dependency, DoR rows 5–6; stays 10/10):
  - about +0.03 s;
  - `A1` reads `time`, so it keeps step 100 (40 reads, R1 line owed), and `A6` is fixed-depth;
  - pull after `ABC-244`.
- **`EPIC-010`:** a dated header block and tickets-table row 20. A footnote says that its row number is not its pull
  order.
- **For the Orchestrator:**
  - merge `grugops/arch-g8-headroom` (notes seal pending) and this branch before `ABC-244`'s build;
  - board move and order;
  - the `ADR-0046` status line recording the word is owed by a records hop (Architect or merge). It was not edited
    here, by fence.
- **Notes: drafted, NOT sealed** (sealing needs `node`). Run from the worktree root:
  `node .grugops/context/bapm-g8-headroom-cut/raw/seal.mjs .grugops/context bapm-g8-headroom-cut .grugops/context/bapm-g8-headroom-cut/raw/seal-spec.json`
  It calls only context-io `admitAndAppend`, then `render` and `readContext`. It admits one decision and one
  observation, both stampless.
- **Checks:**
  - `git diff --check` is clean, and `seal-spec.json` parses.
  - The host-path, login and host-name scan of the added lines found 0 hits.
  - `reference-check` was not run, because it needs `node`: `UNKNOWN - verify`.
- **Not touched:** `src/`, `tools/`, `data/`, the board, the ADRs, the catalog and the trace files. Nothing was run,
  timed, pushed or merged.

### Trace row (10 cells, header order)

| ABC-244 (cut) + ABC-242, ABC-221, ABC-243 (amended) | Time-blind virtual-clock rows in src/cli.test.ts and src/uci-session.test.ts take the coarsest kill-set-preserving step (ADR-0046 § Addendum 2026-10-30 R1–R4, BA/PM word given); ABC-242 lane form = level 1's 100 ms at the coarsest safe step (not the 2 000 ms probe); ABC-221 A9 R1 census, period rows stubbed; ABC-243 ≈ +0.03 s; all three pull after ABC-244 | EPIC-010, EPIC-009 | — | NFR-008 (≤ 10 s; design target G8 ≤ 9.4 s; triggers 9.4 / 9.6 / 9.7 / 10 s), N8-LANE (≤ 650 ms CPU, two-file set); notes drafted (seal pending) | grugops/bapm-g8-headroom-cut @ 5b549cbe (records only): ABC-244 (new), ABC-242, ABC-221, ABC-243, EPIC-010, .grugops/context/bapm-g8-headroom-cut/raw/ (2 drafted notes, seal script) | none run (records only); figures from qe-ABC-229 …0b7fd4f6 and arch-g8-headroom 5fd3eee7 | — (ABC-244 test-only: waiver measured at delivery) | — | ABC-244 Backlog, DoR 10/10, recommended Ready and first pull; ABC-242 / ABC-221 / ABC-243 stay Ready 10/10; board moves the Orchestrator's |
