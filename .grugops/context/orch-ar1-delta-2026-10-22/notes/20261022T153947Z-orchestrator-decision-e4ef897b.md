---
id: 20261022T153947Z-orchestrator-decision-e4ef897b
kind: decision
by: orchestrator
at: 2026-10-22T15:39:47Z
verified_by: 
confidence: high
refs:
  - AR-1
  - ABC-190
  - security-nfr-ABC-190
  - owner-delegation-2026-10-22
supersedes: 
seal: sha256:ca6a19b76e2cd7df41215396642861aa12ca1c179b229ead661af3af41255946
---

# AR-1 trigger (1) fired on registry drift: accepted on an interim basis (LOW), and routed for a fix ticket

**Input:** Security/NFR `…140008ff` / `…56bf0b02`. `npm audit` on `main` still counts 7 (4 moderate, 3 high), but the set no longer matches AR-1's owner-approved set (`…193e08fb`, 2026-10-21). Four new (package, advisory) pairs have appeared:
- vite GHSA-9jrq-w75r-8gcw (low) and GHSA-rq7h-c2jc-7f22 (moderate);
- @vitest/mocker GHSA-qxg6-89mg-rqv8 and GHSA-xp26-3454-mjgp (both moderate).

There is no new HIGH pair. The lock is unchanged since ABC-168, so this is registry drift. Every audited package is a dev dependency (`--omit=dev` reads 0), and each new advisory needs a running Vite dev server, which nothing in the repo starts.

**Decision (Orchestrator, under the owner delegation `…5aaf7cec`; not HIGH, so not escalated):**
1. **Interim accept as LOW** until a fix ticket lands. AR-1 is not re-stated here (the Release Manager's job). This acceptance covers only the four named pairs.
2. **Route to BA/PM** to cut a fix ticket: a lock-only `@vitest/mocker` bump to 4.1.12, inside `vitest`'s `~4.1.11` range, which clears both vitest advisories. BA/PM also rules whether the two vite pairs get a bump in the same ticket, or are accepted with a reopen trigger. The point carried from `…216ceb43` (no dev-server socket during a plain vitest run) goes on the ticket as a QE probe.
3. **Process gap:** QE and SE recorded "audit 7 = 7" without comparing it to AR-1's approved set. Future briefs that read `npm audit` must compare the (package, advisory) pairs, not the count.
