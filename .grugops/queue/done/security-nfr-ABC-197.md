---
subtask: security-nfr-ABC-197
role: security-nfr
ticket: plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md
ref: .grugops/context/security-nfr-ABC-197/
branch: grugops/qe-timing-ABC-197 (11b745e3; H = 1f2aa4b0, B = 051d557a)
width: 1 (records only; no runs)
---

# Rule the NFR-008 state after ABC-197's A6/A7 readings (plus two deferred catalog items)

## Do
- Read QE's timing notes on `grugops/qe-timing-ABC-197` (`…13c7935f` preconditions, `…c12590b6` A6, `…fc6590fe` A7, `…b4a96d77` artifacts, `…9dc058a9` verdict) and the probe folder `.grugops/context/qe-timing-ABC-197/probe/` there.
- Rule the `NFR-008` state and the `N8-LANE` charge for ABC-197, as the page asks. QE's readings:
  - A7: H at 8.935 s [8.68, 9.11]; B (`051d557a`) at 8.815 s; four arms, 0/8 warm, thermal 0, AC on all runs.
  - A6: H−B CPU +0.125 s [+0.120, +0.160] against 650 ms, F = 0.070 s (Architect `…578a9290`); twin R 0.040 s CPU / 0.070 s wall (the set's third reading).
- Confirm the lane-input diff from `1f2aa4b0` to current `main` is empty (so the reading carries to the merged tree).
- Record the new published headroom (10 s minus H; and to `ADR-0046` D4's 9.2 s).
- **Deferred catalog items, same hop** (one dated insertion each in `plans/nfr-catalog.md`, no bar moved): close `R-178-1` (met by Architect `…578a9290`); handle `QE-201-b` by citing the `c0585331` reading.
- The set's F after three readings (median-of-three) is the Architect's to rule, not yours; just name it as a follow-up if you see a need.
- **Records only. No runs.** Result: PASS, PASS_WITH_RISKS or FAIL.

## Fences
- Work on `grugops/security-nfr-ABC-197` (worktree `../wt-security-nfr-ABC-197` from `main`). No `src/`, `tools/`, `package*.json`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/sec197/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `security-nfr-ABC-197`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**PASS** (Security/NFR, 2026-10-23, branch `grugops/security-nfr-ABC-197` @ `f6904897`, records only: no vitest, no lane, no timing, no probe).

- **`NFR-008` (R-1): MET, 8.935 s** median wall [8.68, 9.11] on H `1f2aa4b0`, **with no flag**: four arms, H/H2 twin admissible, wall R 0.100 s, thermal 0 in 8/8 rounds, 0 foreign polls, AC 36/36, load1 ≤ 5.15, pre-registered (10:16:43Z, before the first poll), vitest 4.1.12. It supersedes `ABC-178`'s 9.010 s as the latest verdict. B (`051d557a`) reads 8.815 s. `ADR-0035` D6 does not fire.
- **`N8-LANE` (A6): MET.** H−B CPU +0.125 s [+0.120, +0.160] against 650 ms, F = 0.070 s. Twin R 0.040 s CPU / 0.070 s wall. 174a and strict 174 agree.
- **Lane-input diff.** The literal `1f2aa4b0` → `main` `88854d7e` diff is **not empty**: it is `src/uci-session.test.ts` −11, R2's own reverse, because `ABC-197` is unmerged. It does not need to be empty, because what carries the reading is:
  - B `051d557a` → `main`: empty outside `plans/`, `.grugops/` and `memory-bank/`;
  - `1f2aa4b0` → a trial merge tree of `main` with `11b745e3` (`git merge-tree`, clean, tree `2bb0d729`): **empty on lane inputs**.
  - So the reading carries to the merged tree, provided no lane-input merge lands on `main` first. The Orchestrator re-checks at merge.
- **Published headroom: 1.065 s** to W on H (10.000 − 8.935), ≈ 10.7 × the wall R. **0.265 s** to `ADR-0046` D4's 9.2 s. On `main`: 1.185 s / 0.385 s.
  - It is larger than `ABC-178`'s 0.990 s because the two windows differ (B 8.985 → 8.815 s). It is not a saving: R2's in-window cost is +0.090 s wall [+0.010, +0.200], against the ≈ +0.075 s estimate.
- **`R-178-1`: CLOSED** in the catalog (met by Architect `…578a9290`: F 0.070 / 0.090 s, no new series; A6 printed `650 ms >= F: True`).
- **`QE-201-b`: handled.** One dated insertion in `NFR-007`'s `Verified by` cell cites QE's `c0585331` reading (`…0a5d72bb`, `…02ef046d`): max 227.2 ms, median 204.3 ms, n 10, first launch counted, frame 0 byte-identical. EPIC-006's page was left alone (not this role's).
- **Security:** not triggered. `src/uci-session.test.ts` +11/−0 is one in-process test row. No production byte.
- **Required fixes:** none. **Accepted risks:** none new.
- **Follow-ups (INFO):**
  - F after three readings is 0.040 / 0.070 s by the stated median-of-three arithmetic. That is Architect/Design's to record, and no cut waits on it.
  - The host name differs from `ABC-178`'s hop (`MacBook-Air.local` vs `Mac.lan`). Whether it is the same machine is `UNKNOWN - verify`. It does not change the state.
- **Probe integrity:** RUNSUMS 64/64 and SHA256SUMS 15/15 OK; the pre-registration's sha matches.
- **Catalog:** three dated insertions (two in the `NFR-008` `Target` cell, one in the `NFR-007` `Verified by` cell). Removing them recovers the old file exactly. Every other row is byte-identical. No level, bar, F or W moved.
- **Notes** (`.grugops/context/security-nfr-ABC-197/notes/` on my branch, sealed by grugops 2.1.0 `admitAndAppend`, read back as 2 notes, seal ok, index rendered): `20261023T104156Z-security-nfr-observation-8aa3ec93` (readings, checks, headroom); `20261023T104156Z-security-nfr-decision-fccf9d20` (rulings and the result).
- **Not touched:** `src/`, `tools/`, `package*.json`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` (the row below is for the Orchestrator), the ticket page. No column moved. Recommended: `In Security/NFR` → `Ready for UAT` (UAT waived, 0 production lines). Nothing was pushed or merged.

### Trace row (10 cells, header order)

| ABC-197 (security-nfr) | Security/NFR gate: NFR-008 MET 8.935 s on 1f2aa4b0 (clean: thermal 0 8/8, 0 foreign, AC 36/36, 4 arms; B 8.815 s); N8-LANE MET +0.125 s CPU (F 0.070 s); R-178-1 closed; QE-201-b cited (NFR-007 at c0585331); published headroom 1.065 s to W, 0.265 s to 9.2 s | EPIC-007 | A6, A7 | NFR-008; N8-LANE; NFR-007; ADR-0035; ADR-0046 D4; R-178-1 (closed); QE-201-b | `grugops/security-nfr-ABC-197` @ `f6904897` (records only)<br>`.grugops/context/security-nfr-ABC-197/notes/` (…8aa3ec93, …fccf9d20) | records only; QE readouts at `11b745e3` cross-checked (n8-a1 174/174a, full-a1 174b); RUNSUMS 64/64, SHA256SUMS 15/15; lane-input diff 1f2aa4b0..trial-merge(main 88854d7e + 11b745e3) empty, 051d557a..88854d7e empty outside records | — | — | PASS (no required fixes; no new accepted risk); UAT waived (0 production lines); column move and merge are the Orchestrator's |
