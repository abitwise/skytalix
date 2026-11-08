---
id: 20261108T165653Z-orchestrator-decision-4d1e0382
kind: decision
by: orchestrator
at: 2026-11-08T16:56:53Z
verified_by: 
confidence: high
refs:
  - Q-3K-12
  - EPIC-011
  - ABC-284
  - ADR-0060
  - …9a436841
  - …569849c4
supersedes: 
seal: sha256:ce0c8448c8b0b08c0316eb9c70b799c6069b0e88c4fc8cfea4c789c8d63f0b38
---

## The owner's answer on Q-3K-12: option 2

His words: "option 2, with lower time per move we can't reach 3000 elo yes, but we can improve step-by-step, if we improve with low time per move we probably improve also at higher setting."

**So:**
- P1 late-move reductions (`ABC-284`) re-opens for one try: premise named, probe pre-registered, then build and 100 games at 100 ms only if the probe passes. A probe miss closes it; no re-play.
- **He does not take the pause.** His stated aim is step-by-step gains at 100 ms. After option 2, the next step (option 3's held search tickets, one at a time, each probe-first) goes to him again, with the Architect's read. It is not automatic, and no pause or closing read (R2) is taken now.
- His premise (gains at 100 ms probably carry to longer time controls) is his, recorded as such; not a bar.
- Unanswered: whether the stop covers `ABC-306` and row E7 (`ABC-272`, `ABC-294`). No build is queued for any of them, so nothing waits. I ask again when one comes up. Silence is no yes.

**Order (ADR-0076 d10's pattern, adapted):** `arch-ABC-284` writes the re-open (an `ADR-0060` dated line or a new ADR, the Architect's choice) naming the premise on today's `main`, the form, the door counts, the probe written not run, and QE's freeze before probe and build. Acceptance of a new ADR is the owner's; I bring it to him. Then QE's freeze, the probe (timing rows on a held host, W asked per read), then the build after the ancestor check.
