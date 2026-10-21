---
id: 20261021T183723Z-orchestrator-decision-73e94c9f
kind: decision
by: orchestrator
at: 2026-10-21T18:37:23Z
verified_by: 
confidence: high
refs:
  - AR-193-HUNKHDR
  - AR-193-SPACEPATH
  - QE-193-a
  - QE-193-b
  - ADR-0036
  - 20261021T183616Z-security-nfr-decision-5719a86d
supersedes: 
seal: sha256:37b78a5243dfc41a0f804032a28b1951756db62b94b91aa902fddbe23535ca7f
---

# AR-193-HUNKHDR and AR-193-SPACEPATH recorded (Orchestrator-owned); HUNKHDR stand-in starts now

Security/NFR `…5719a86d` returned PASS_WITH_RISKS. It gates nothing that is already merged.

## AR-193-HUNKHDR
- **Rating:** LOW while the stand-in runs; MEDIUM if it is skipped or ever prints.
- **Owner:** Orchestrator.
- **Stand-in:** run at every routing and merge until the fix is on `main`, in the instrument's checkout, with the change's own `<base>`/`<head>`. It must print nothing:
  `git -c core.quotePath=false diff -U0 --no-renames --text --no-textconv --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/ <base> <head> -- src | awk '/^diff --git /{h=0} /^@@/{h=1} /^(\+\+\+|---) / && (h || /\t$/)'`
- **If it prints anything:** do not trust that run's clause (b) result. Route the change to Security/NFR by hand as fired on every limb.
- **First runs, 18:37Z, all empty:**
  - ABC-193 merge `aa86a1a1^1..aa86a1a1`
  - ABC-192 merge `c4bce2b1^1..7a2ec8bc`
  - `47a3c9a1..HEAD`

## AR-193-SPACEPATH
- **Rating:** LOW, latent.
- **Owner:** Orchestrator.
- **Trigger:** a `src/` path containing whitespace appears. Route that change by hand as fired on every limb, and land the fix before that ticket merges.
- The stand-in's `\t$` arm also flags such a path.

## Fix
- One XS/P3 ticket, cut now by BA/PM (`bapm-cut-AR-193`) and built by the Architect. It gates no merge.
- It holds (a)–(d) as `…5719a86d` states, with the close conditions given there.

## Side note
- The harness flagged Security's report as mentioning `.claude/settings.local.json`. I checked it:
  - It is the owner's file, dated 2026-10-10.
  - The user's global `~/.gitignore:18` ignores it.
  - No agent touched it.
- Nothing to act on.
