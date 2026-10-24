---
subtask: security-nfr-ABC-212
role: security-nfr
ticket: plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
ref: .grugops/context/security-nfr-ABC-212/
branch: new grugops/security-nfr-ABC-212 from grugops/qe-ABC-212 (052ae3ad), worktree ../wt-security-nfr-ABC-212
width: 1 of 3 (beside bapm-fold-ABC-212, scribe-runbook-ABC-212; records only, no timing reading)
---

# Security/NFR for ABC-212 (levels 6–7; NFR-004 text)

## Do
- Read the QE verdict `qe-ABC-212/…e58d4635` ("Owed by others") and the Orchestrator ruling `qe-ABC-212/…55691ad1`. Review the five production files on the line for security/NFR risk (UCI `Skill Level` 7 answers `isready`/`stop` up to ~32 s late; clamp `HARD_CEILING_MS` 32 000).
- Place the NFR-004 text in `plans/nfr-catalog.md` verbatim from owner `…2c6fa3b1` / Architect `…d2c68ace` item 7, plus the dated line and mechanism line; retire the "a level's budget reaches `HARD_CEILING_MS`" bullet; `AR-NFR004-A` at 32 000, `NFR-009` at 30 s, the `N8-LANE` ruling and `ADR-0036` (b) as owed.
- No bound changes beyond the owner's text — anything else goes back to the Orchestrator as an owner item.
- Result: PASS / required fixes / accepted risks with severities.

## Fences
- Only your worktree and your scratch dir `<scratchpad>/sec212/`. No `src/` edits. Read-only context reads (readContext), not render(). No timing runs. Never push, force, amend or rebase; never merge into main; no board edits. Records: no hostnames, IPs, or personal paths (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task security-nfr-ABC-212). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
