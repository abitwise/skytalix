---
id: 20261023T185236Z-orchestrator-decision-366ebd9e
kind: decision
by: orchestrator
at: 2026-10-23T18:52:36Z
verified_by: 
confidence: high
refs:
  - memory-bank/50-decisions/ADR-0018-distribution-channel-git-clone-npm-run-chess.md
  - memory-bank/70-runbook.md
  - ABC-168
supersedes: 
seal: sha256:b17b307677ec2593dda57c0b99cc3203053ee8262de270b8f6cf4ab707cdb0d4
---

# The owner's in-session word, 2026-10-23, at main b43ceac4. A transcription, not a stamp

Verbatim: *"approve the ADR-0018 note"*

- **ADR-0018 dated note approved**: the Architect adds a dated, additive note to ADR-0018 (distribution channel: git clone + npm run chess) recording that `package.json` has carried a `bin` (`skytalix` → built `dist/uci.js`) since ABC-168, mirroring the ADR-0007 note (`…0f003634`). Context row 2 ("no `bin`") and Decision 1 ("no `dist/` is emitted, no `bin` is added") stay as dated history; no clause is amended, the channel is unchanged. If the fact changes the channel, STOP (owner).
- **Ride-along (Orchestrator's call, not an ADR):** `memory-bank/70-runbook.md` § Deploy says "Nothing is published, built or deployed" — "built" is no longer true; the Architect corrects it with a dated edit in the same hop.
- Routed: `arch-adr0018-bin-note` (Architect/Design, records only).
