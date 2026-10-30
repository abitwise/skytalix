---
subtask: secnfr-ABC-244
role: security-nfr
ticket: ABC-244
ref: .grugops/context/secnfr-ABC-244/
branch: new grugops/secnfr-ABC-244 from main 712bf0f9; candidate grugops/qe-ABC-244 @ a66d20ab (code 25282ad4)
width: records only
---
# Security/NFR gate: ABC-244 (test-only; NFR-008 state)
Read the ticket's NFR triggers, qe-ABC-244 notes on its branch (`…4fe9bfe1`, `…3c2ac5a2`, `…98d5d2e4`), ADR-0046 § Addendum
2026-10-30, ADR-0035 addendum, plans/nfr-catalog.md NFR-008. Record dated: NFR-008 head 9.25 s / base 9.69 s MET on oeselg-devl;
design target ≤ 9.4 s met, tranche 2 not fired, triggers (> 9.6 s later → tranche 2; > 9.7 s after it / > 10 s → owner); N8-LANE MET
(−1.145 s CPU); the two-file set's first admissible F (R 0.250 s) replacing the provisional 16 %; QE-244-a carry for R4 tickets.
Also the stale sentence the Architect routed (NFR-008 wall depends on per-thread speed, not core count, with the worker cap fixed).
Gate verdict (security not triggered: test-only).
Fences: plans/nfr-catalog.md + notes. No src/, tools/, data/, board. Never push/force/amend/rebase/merge into main. No host paths.
Host is free: you may run the sanctioned seal yourself (context-io admitAndAppend only). Never `while pgrep -f`.
Publish: notes (task `secnfr-ABC-244`), commit, `## Result` + trace row here, brief + claim to done/.

## Result

**Gate: PASS** at `25282ad4` (candidate `grugops/qe-ABC-244` `a66d20ab`). Security not triggered (test-only: 2 step
literals + 4 comments in the two test files). No accepted risk, no required fix, no owner item.
Notes (task `secnfr-ABC-244`): decision `…9087cb39`; records/observations `…619ead26`.
- **`NFR-008` MET** on `oeselg-devl`: `G8` H 9.25 s, B 9.69 s (load1 ≤ 1.94). **Design target ≤ 9.4 s MET**; tranche 2
  not fired. Standing triggers: later `G8` head > 9.6 s → tranche 2; > 9.7 s after it, or > 10 s → owner (`ADR-0035` D6).
- **`N8-LANE` MET** (H−B CPU −1.145 s). **Two-file set `F` = 0.250 s CPU / 0.100 s wall**, first admissible; replaces 16 %.
- **Stale sentence** ("wall clause is a function of core count") struck and kept with a dated per-thread-speed note.
- **Carry `QE-244-a`** (LOW): BA/PM (R4 DoR line) and Architect/Design (tranche 2).
- Catalog: 2 813 → 2 873 lines; only the `NFR-008` row changed among table rows (others sha256-identical).
- Base note: branched from `75ba3f54` (the activator's setup), not `712bf0f9`; the catalog is the same at both.

### Trace row (10 cells, header order)

| ABC-244 | Time-blind ABC-230 virtual-clock rows take step 1 000 on both surfaces; ABC-241 rows keep 100 (they lose seam-fault kills at 1 000); no census unit | EPIC-010 | ADR-0046 § Addendum 2026-10-30 R1–R3; ADR-0035 § Addendum 2026-10-30 | NFR-008 G8 MET H 9.25 s (B 9.69 s, target 9.4 s MET, tranche 2 not fired); N8-LANE MET −1.145 s CPU; two-file set F 0.250 s CPU | grugops/ABC-244 @ 25282ad4: src/cli.test.ts, src/uci-session.test.ts (test-only) | npm test 63 files / 2 322 pass ×6, skips 0; QE parity 24 mutants, 0 U1 rows differ; nodes −791 075 | QE PASS; Security/NFR PASS (security not triggered); UAT waived (0 production lines) | — | In Security/NFR → Ready for UAT (branch, not merged) |
