---
id: 20261115T200030Z-orchestrator-decision-a12ff347
kind: decision
by: orchestrator
at: 2026-11-15T20:00:30Z
verified_by: 
confidence: high
refs:
  - ABC-325
  - ABC-324
  - ABC-319
  - qe-ABC-324/20261115T195741Z-qe-e2e-decision-c2ae1641
  - G-QE-324-1
  - G-QE-324-2
  - G-QE-324-3
  - src/version-file.ts
  - VERSIONING.md
supersedes: 
seal: sha256:7e5f8ce913d909c7f9ff845945d60470e21af364d23eb12d6a0a00511b857bf1
---

Owner, 2026-11-15: "yes let's release" — in answer to "fix the three wording gaps first, then tag v1.1.1, or tag as is?". Read as: release v1.1.1, with the gaps fixed first (the orchestrator's recommendation; the gaps are wording only and cheap). This cuts ABC-325: one SE hop modelled on ABC-319 (v1.1.0) — close G-QE-324-1/2/3 in the README, fix the `src/version-file.ts` doc example (still 1.0.0), and bump to 1.1.1 (PATCH per VERSIONING.md: docs and measured figures only, no behaviour change): package.json/package-lock version, CHANGELOG [Unreleased] → [1.1.1] - date with compare links, any version pins in tests. Then a QE hop. On PASS the orchestrator merges and tags v1.1.1 locally; the owner pushes main and the tag and publishes the Release page.
