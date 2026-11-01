---
subtask: qe-ABC-246
role: qe-e2e
ticket: ABC-246
ref: .grugops/context/qe-ABC-246/
branch: grugops/ABC-246 @ a1942ea0 (code 3c5e05fd); your worktree .claude/worktrees/qe-ABC-246 on new branch grugops/qe-ABC-246 from it
width: ALONE for every timing read (G8). Only a records-only BA/PM hop (no vitest) may be beside you. Record load1 and foreign processes with every timing. Leave no process running.
---
# QE ABC-246 (XS, P3, test-only, UAT waived): two uci-clock-mode rows + SE-221-g comment
## Read
- The ticket page (A1–A5); the SE hand-back .grugops/queue/done/se-ABC-246.md on the branch and its notes (decision …2f43204c; A3 …8de958b6; A4/A5 …851629b3; handoff …0d04bf8a, SE-246-a).
- qe-ABC-221 notes …8ad25906 and …c6f37a35 (plants HSCM, CLOCKWINSCM).
- ADR-0046 § Addendum and the tranche-2 ruling: W1 (a G8 head reading > 9.7 s is confirmed by a second window of 3 head runs; the median of all 6 decides; > 10 s → STOP).
## Do
- A3 re-read: each plant alone over the WHOLE default lane (not only the one file); A1 red under HSCM, A2 red under CLOCKWINSCM, nothing else red; never commit a plant.
- A4: comment-only diff on src/engine.test.ts; check its figures against HARD_CEILING_MS 60 000.
- A5: gates via `npm run …`; npm test 0 skips; net rows +2; skip-integrity, lane inventory; G8 head (and base main 832ff246) per ADR-0046, W1 applied.
- Verdict: PASS / PASS_WITH_GAPS / FAIL. The verdict closes the ticket (UAT waived).
## Fences
- No edits under src/, tools/, data/; no board edits. No push, force, amend, rebase, or merge into main. Never bare npx or npm exec. Waiting: `kill -0 <pid>` or poll a file; never `while pgrep -f`; never vitest on the same command line as a wait. Thermal stop: Tctl median > 85 °C.
- Scratch `qe-246/`.
## Publish
Sealed notes (task `qe-ABC-246`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-11-01, QE/E2E. QE verdict: PASS** at `3c5e05fd` (base `main` `832ff246`). Branch `grugops/qe-ABC-246` from the SE's tip `a1942ea0`. PREREG `c95e6324` was committed before any run, and the notes are in `7f681d9e`. The hop ran ALONE, beside the records-only `bapm-page-closes` hop, which ran no vitest. Nothing under `src/`, `tools/`, `data/` or the board was edited. Not merged, nothing pushed. UAT waived (0 production lines); this verdict is the QE sign-off and closes the ticket.

- Notes (task `qe-ABC-246`): decision `…119c9268`; plants `…ead81ee6`; gates + A4 + `G8` `…acd91ae2`; findings `…f3353112`; artifacts `…bdf4e139`.
- **A1/A2:** the expected budgets were re-derived from ADR-0052 D2/D4: spread 2 400 vs hard stop **1 900**; `movetime` **5 000** vs C 22 375. Both rows are green in plant `none` and in all 3 `G8` head runs.
- **A3, whole default lane** (63 files):
  - At head (2 366 rows): `none` gives 0 red. **HSCM reds exactly {A1}** (`[2400]` vs `[1900]`). **CLOCKWINSCM reds exactly {A2}** (`[22375]` vs `[5000]`). Nothing else turns red.
  - At base (2 364 rows): both plants survive, so the new rows are the lane's only killers. **QE-221-a closed.** No plant was committed; H was intact afterwards (tar compare, 0 differences).
- **A4:** `src/engine.test.ts` is −1/+4, all inside one `/** */`, and the comment-stripped code is equal at base and head. "About 60 000 readings" = 60 000 ms ÷ 1 ms. "After about 10" matches QE's re-read of 9 readings (6 893 nodes, depth 2).
- **A5:**
  - lint, typecheck and build exit 0.
  - `npm test` ×3: **2 366 passed, 0 failed, 0 skipped**.
  - Skip-integrity `No findings.`; lane inventory 63 = 63, `No findings.`
  - Names +2 / −0, and the name hash is equal once the 2 new rows are removed. **Net +2.**
  - 55 ABC-220* and 29 ABC-221* rows are green at head. `uci-session.test.ts` loses 0 lines.
  - The zero-production-lines measurement is empty.
- **`G8`** (b h h b b h, wait-clear by `kill -0`, admissible):
  - **H 9.51 s** (9.51 / 9.58 / 9.43), **B 9.38 s** (9.44 / 9.35 / 9.38), delta +0.13 s. The new rows cost ≈ 0.25 ms in-thread, so the delta is noise.
  - load1 1.08–1.79 across all runs (head runs 1.08–1.71).
  - No foreign vitest. Run 1 (base) overlapped two of the beside hop's git commits, which is admissible (QE-246-a).
  - Tctl median 55.5 °C, max 74.9.
  - **`NFR-008` MET.**
  - **W1:** H ≤ 9.7 s, so no second window was owed. Head **9.51 s** is part of `ABC-248`'s base.
- **Findings:** QE-246-a INFO (beside hop's commits in base run 1). QE-246-b INFO (W1's scope: the brief applies it here, the page says from `ABC-248`; moot at 9.51 s). QE-246-c INFO (side-blind rows; that class is held by A12). QE-246-d INFO (harness). SE-246-a confirmed, INFO, carried: the "6 746 nodes" comment reads 6 893 at base too.
- `main` moved to `407a676a` by records only, with no code change since `832ff246`. `grugops/ABC-246` merges cleanly (merge-tree). Merge routing is the Orchestrator's.
- STOP: none (H ≤ 10 s; Tctl ≪ 85 °C). Scratch removed; no process left running.

### Trace row (10 cells, header order)

| ABC-246 | uci-clock-mode: rows pin the hard stop (1 900) and movetime over a clock (5 000); SE-221-g comment corrected (test-only) | EPIC-009 | ADR-0052 D2/D4; ADR-0046 § Addendum 2026-10-31 (W1) | NFR-008: G8 H 9.51 s / B 9.38 s ≤ 10 s, load1 1.08–1.79 (W1 not triggered); 2 stubbed rows, 0 real-engine | grugops/ABC-246 @ 3c5e05fd: src/uci-session.test.ts (+2 rows), src/engine.test.ts (comment only) | QE PASS: npm test 2 366 pass ×3, skips 0, net +2; whole-lane HSCM reds A1 only, CLOCKWINSCM reds A2 only, both survive at base; A4 comment-only, 9 readings | UAT waived (0 production lines); QE verdict signs | — | QE PASS (branch, not merged; to the Orchestrator for merge routing) |
