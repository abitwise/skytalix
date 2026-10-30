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
