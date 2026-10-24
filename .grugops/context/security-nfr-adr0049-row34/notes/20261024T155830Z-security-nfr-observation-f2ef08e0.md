---
id: 20261024T155830Z-security-nfr-observation-f2ef08e0
kind: observation
by: security-nfr
at: 2026-10-24T15:58:30Z
verified_by: 
confidence: high: package.json, module count and the grep read at 20c32c93; severity INFO
refs:
  - ADR-0049
  - ADR-0049 row 34
  - plans/nfr-catalog.md
  - memory-bank/50-decisions/ADR-0049-the-source-is-public-on-github-and-the-engine-still-deploys-nowhere-and-publishes-no-package.md
  - owner-word-2026-10-24/20261024T153400Z-orchestrator-decision-619938c5
  - arch-accept-adr0049/20261024T153859Z-architect-design-decision-1e9e06f0
  - grugops/security-nfr-adr0049-row34
  - 67658cb8
  - 20c32c93
supersedes: 
seal: sha256:ddd7a940c6cd65240bf327b03629f05c9a8306ba0ccfbc7c2f6a2b2b04e0a977
---

# Stale neighbour in the availability-SLO table (not in ADR-0049 § Records): row "up between uses"; INFO; not edited

Found while placing ADR-0049 row 34. Not edited: it is outside this brief.

- **The line:** plans/nfr-catalog.md, § Availability, SLO table, row "Something that is 'up' between uses". It says package.json has "no bin", and "src/ is ten modules with no entry point".
- **Today, read at main 20c32c93** (file reads and grep only):
  - package.json: "private": true, a bin object with 1 entry (the UCI entry point, ADR-0044), no main, no start script;
  - src/ holds 46 production modules (non-test .ts);
  - the 2026-08-06 grep, re-run over those modules (listen(, createServer, node:http/https/net imports, WebSocket, express, fastify; plus setInterval and process.on): 0 code matches. There are 5 hits, all the English word "express" in comments.
- **The conclusion still holds:** nothing runs between uses. The UCI program runs only while a GUI or a user starts it, and nothing opens a listening socket.
- **ADR-0049 § Records did not list this line,** because it is not a posture statement about the remote.
- **Severity:** INFO (a stale record; no control is missing). **Owner:** Security/NFR, at the next catalog hop the Orchestrator routes. The fix is a dated line of the same shape as row 34's.
