---
subtask: secnfr-catalog-rebase
role: security-nfr
ref: .grugops/context/secnfr-catalog-rebase/
branch: new grugops/secnfr-catalog-rebase from main (sha at spawn)
width: records only
---
# Security/NFR: catalog reference machine re-base (SEC-228-a) + whole-second confirmation
Owner words verbatim in `orch-2026-10-30a/…f4673b9f`.
- Re-base plans/nfr-catalog.md's reference machine to the Ubuntu Linux host oeselg-devl (AMD Ryzen AI 9 HX 370, Linux 7.0.0-42, Node
  v26.12.1 — from qe-ABC-220's A14b record); the M3 / Node v26.11.x lines become dated history. Rule which existing "Verified by" readings
  were taken on the new reference (since 2026-10-28) and which stand only as M3 history; re-base no number you cannot source.
- AR-UCI-BUSY and NFR-004: mark the whole-second reading (< 22 500 ms) owner-CONFIRMED.
- SEC-228-b (NFR-009 "not built yet" stale) and SEC-220-c (NFR-011 load read via os.loadavg on Linux) while there.
Fences: plans/nfr-catalog.md + notes. No src/, tools/, data/, board. Never push/force/amend/rebase/merge into main. Host name is the
owner's label, fine to record; no filesystem paths. Run no builds/tests/node if a QE is timing; draft a seal otherwise.
Publish: notes (task `secnfr-catalog-rebase`), commit, `## Result` here, brief + claim to done/.
