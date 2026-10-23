---
id: 20261023T104156Z-security-nfr-decision-fccf9d20
kind: decision
by: security-nfr
at: 2026-10-23T10:41:56Z
verified_by: 
confidence: high (rulings on QE figures and the catalog rules; F after three readings is Architect/Design's; host identity UNKNOWN - verify)
refs:
  - ABC-197
  - security-nfr-ABC-197
  - NFR-008
  - N8-LANE
  - 1f2aa4b0
  - 051d557a
  - 11b745e3
  - 88854d7e
  - plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md
  - plans/nfr-catalog.md
  - 20261023T103455Z-qe-e2e-observation-13c7935f
  - 20261023T103455Z-qe-e2e-observation-c12590b6
  - 20261023T103455Z-qe-e2e-observation-fc6590fe
  - 20261023T103455Z-qe-e2e-observation-b4a96d77
  - 20261023T103518Z-qe-e2e-decision-9dc058a9
  - 20261023T080227Z-architect-design-decision-578a9290
  - 20261023T072556Z-security-nfr-decision-d0c770b5
  - ADR-0035
  - ADR-0046
  - 20261023T104156Z-security-nfr-observation-8aa3ec93
  - R-178-1
  - QE-201-b
  - NFR-007
  - ABC-201
  - ABC-200
  - c0585331
  - c91445e3
  - 20261023T080232Z-qe-e2e-observation-0a5d72bb
  - 20261023T080232Z-qe-e2e-observation-400f9aef
  - 20261023T080232Z-qe-e2e-decision-02ef046d
  - AR-096-DISKCOLD
supersedes: 
seal: sha256:abd212d146f169d7f1b94d54522e0bebb5c6c077bed6b7801ed1ed9b0a2d2943
---

# Security/NFR on `ABC-197` at H `1f2aa4b0`: **PASS.** `NFR-008` **MET** at 8.935 s, with no flag. `N8-LANE` **MET** at +0.125 s CPU. `R-178-1` **CLOSES**. `QE-201-b` is cited in the catalog. Published headroom: **1.065 s** to W, **0.265 s** to 9.2 s

This is a `decision`, not a `finding`: no stamp exists on this install (`human_admission: off`). Evidence: `…8aa3ec93`. QE: `…13c7935f`, `…c12590b6`, `…fc6590fe`, `…b4a96d77`, `…9dc058a9`. Nothing was run or timed at this hop.

## 1. `NFR-008` (R-1): **MET, 8.935 s** median wall [8.68, 9.11] on `1f2aa4b0`, with no flag
- The reading is admissible under `ADR-0035` D1 + A1: four arms, each with its own `npm ci`; the H/H2 twin is admissible; pre-registered; AC on every run; load1 ≤ 8; thermal 0 in 8/8 rounds; 0 foreign polls; vitest 4.1.12.
- It supersedes `ABC-178`'s 9.010 s as the latest verdict. B (`main`'s lane inputs) reads 8.815 s. `ADR-0035` D6 does not fire, and the page's fallback (drop R2) is not taken.
- **It carries to the merged tree only while `git diff --name-only 1f2aa4b0 <merged main> -- <lane inputs>` is empty.** It is empty against a trial merge of `main` `88854d7e` with `11b745e3`. **The literal diff `1f2aa4b0` → `main` is not empty**: it is R2's −11, because `ABC-197` is unmerged. What makes the reading carry is that B → `main` is empty outside records. A lane-input merge to `main` before this one would break that, and the Orchestrator re-checks it at merge time.

## 2. `N8-LANE` (A6): **MET.** H−B CPU +0.125 s [+0.120, +0.160] against 650 ms, with F = 0.070 s
The state test resolves in both views: R 0.040 s ≤ 650 ms, and the median is ≤ 650 ms. The charge sits above F, so it resolves R2's cost rather than reading "reported, not resolved". It agrees with the page's ≈ +150 ms estimate.

## 3. Published headroom: **1.065 s** to W on H (10.000 − 8.935), ≈ 10.7 × the wall R. **0.265 s** to `ADR-0046` D4's 9.2 s
- On `main`: 1.185 s / 0.385 s.
- This replaces `ABC-178`'s 0.990 s / 0.190 s. The rise is between-window drift, not a saving. R2's in-window cost is +0.090 s wall [+0.010, +0.200].
- Each later lane-input merge spends the headroom on an estimate until the lane is read again.

## 4. `R-178-1`: **CLOSED**
Its condition was "re-read F before `ABC-197`'s timing hop is pre-registered". Architect `…578a9290` met it: F = 0.070 s CPU / 0.090 s wall, and 4.1.11 → 4.1.12 is not a new series. The pre-registration named 0.070, and A6 printed `650 ms >= F: True`. The Architect left the catalog closure to this row's owner. It is done here as one dated insertion in the `NFR-008` `Target` cell.

## 5. `QE-201-b`: **handled by citation**
The `NFR-007` row cited only `c91445e3`, from before `ABC-200` changed the startup path. One dated insertion, beside that reading in the `Verified by` cell, cites QE's re-read at `c0585331` (`…0a5d72bb`, `…02ef046d`): max 227.2 ms, median 204.3 ms, n 10, first launch counted, and a byte-identical frame 0. It is MET there too. It ran on the same M3, so `AR-096-DISKCOLD` and `UNKNOWN - verify` on other machines stand. EPIC-006's page is not this role's to edit and was left alone. The Orchestrator's `ABC-201` close row already cites `c0585331`.

## 6. Security: not triggered
`src/uci-session.test.ts` +11/−0 is the only non-record change. It adds one in-process test row. There is no production byte and no input, I/O, secret or dependency surface. The checklist at L1 has nothing to apply to.

## 7. Catalog
- There are three dated insertions in `plans/nfr-catalog.md` and no deletion. Two are in the `NFR-008` `Target` cell (the verdict and headroom; `R-178-1`). One is in the `NFR-007` `Verified by` cell (`QE-201-b`).
- Removing the three insertions recovers the old file exactly. `NFR-001`–`NFR-006` and `NFR-009`–`NFR-011` are byte-identical. No level, bar, F or W moved.

## 8. Follow-ups (INFO, not risks)
- **F after three readings (Architect/Design).** By the median-of-three rule `…578a9290` already states, this set's F now reads 0.040 s CPU / 0.070 s wall (arithmetic). The ruling and its record are the Architect's. No cut on record sits between 0.040 s and 0.070 s, so nothing waits on it.
- **Host name** `MacBook-Air.local` here, `Mac.lan` at `ABC-178`. Whether it is the same machine is `UNKNOWN - verify` (QE disclosed it and inferred nothing). The verdict does not depend on it, because B and H were read in the same window with ≥ 1 s to W.

## Result
**PASS.** There are no required fixes and no new accepted risk. `R-178-1` closes. UAT is waived (0 production lines; a waiver is not a signature). The recommended move is `In Security/NFR` → `Ready for UAT`, or Done under the waiver. The column move and the merge are the Orchestrator's, and the merge is a human's.
