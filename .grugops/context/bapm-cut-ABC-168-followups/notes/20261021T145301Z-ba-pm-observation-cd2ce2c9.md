---
id: 20261021T145301Z-ba-pm-observation-cd2ce2c9
kind: observation
by: ba-pm
at: 2026-10-21T14:53:01Z
verified_by: 
confidence: high
refs:
  - ABC-168
  - ABC-188
  - ABC-189
  - ABC-190
  - AR-163-DELONLY
  - AR-163-UNCOMMENT
  - 20261021T143943Z-security-nfr-decision-75a45be0
supersedes: 
seal: sha256:105c3da934c4c6c7fbe36743c1304c5bb622c1fab0715cfe7db5ff1f2881db33
---

# Owner and Orchestrator items from bapm-cut-ABC-168-followups

- **Owner's open call (unchanged by this cut):** ABC-168's merge is held on ABC-188, unless the owner accepts AR-163-DELONLY at MEDIUM by name and merges first (Security/NFR `…75a45be0` § 2). BA/PM recommends building ABC-188 first: it is S, it has no file overlap with ABC-168, and it can run while UAT A8–A10 is pending.
- **Scope finding for the Architect:** the fix named in the term ("drop the `!lines.size` skip, ~3 lines") does not cover a holder deleted or renamed away at `<head>` (measured: REN and a plain delete stay silent). ABC-188 holds Security/NFR's words, so REN must FIRE. If the Architect reads the ruling more narrowly, it goes back to Security/NFR before the build. Until ABC-188 merges, the by-hand check covers this case.
- **Orchestrator:**
  - move ABC-189 and ABC-190 Backlog → Ready when ABC-168 merges (DoR stands);
  - route ABC-190's clause (a) hop;
  - record AR-163-UNCOMMENT limb 1 as covered when ABC-188 merges.
