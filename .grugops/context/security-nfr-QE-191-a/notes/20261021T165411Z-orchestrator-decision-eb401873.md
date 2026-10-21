---
id: 20261021T165411Z-orchestrator-decision-eb401873
kind: decision
by: orchestrator
at: 2026-10-21T16:54:11Z
verified_by: 
confidence: high
refs:
  - AR-191-GITENV
  - AR-191-QUOTEPATH
  - QE-191-a
  - QE-191-b
  - ADR-0036
  - 20261021T165304Z-security-nfr-decision-7c1f3590
supersedes: 
seal: sha256:016d636c73c11c42bf2a30c4e325fe199ce8349cda639672f51ff3c174248805
---

# AR-191-GITENV and AR-191-QUOTEPATH recorded (Orchestrator-owned); GITENV stand-in starts now

Security/NFR `…7c1f3590` rules PASS_WITH_RISKS. It gates nothing that is already merged. This note records both risks.

## AR-191-GITENV
- **Rating:** LOW while the stand-in runs; MEDIUM if it is skipped or ever prints.
- **Owner:** Orchestrator.
- **What it is:** git config or environment can blind clause (b)'s one diff call. The config is shared by main and all linked worktrees.
- **Stand-in from now until the fix merges:** at every routing and merge, in my shell and checkout, this line must print nothing:
  `git config --get-regexp '^(color\.(ui|diff)|diff\.(external|srcprefix|dstprefix)|diff\..+\.command)$' | grep -v -E '^color\.(ui|diff) (auto|true|false|never)$'; printenv GIT_EXTERNAL_DIFF`
- **First run:** 2026-10-21T16:54Z on `main` `03ac8bc4`, in this shell. It printed nothing, which also settles Security's `UNKNOWN - verify` about my environment for this run.
- **Fix:** one XS/P3 ticket, cut by BA/PM and built by the Architect. It needs flags (a), harness rows (b) and an ADR-0036 § S1 block (c), as `…7c1f3590` states.
- **Close:** QE reads the (b) rows firing at head and silent on the `837e8b22` instrument.

## AR-191-QUOTEPATH
- **Rating:** LOW (latent).
- **Owner:** Orchestrator. No routine stand-in.
- **Trigger:** a clause (b) dispute line names a target that exists under `src/` with a production extension. That dispute may not be cleared, and the fix lands before that ticket merges. The repository has 0 non-ASCII paths today.
- **Fix:** folded into the same ticket. Every instrument git call gets `-c core.quotePath=false`, plus harness rows QU and QE2.
- **Owner's call:** Security also asks that `AGENTS.md`'s UAT waiver form read `git -c core.quotePath=false diff --name-only …`. That is the owner's text, so I am asking him before the Scribe applies it.

## Routing
- BA/PM cuts the fix ticket after `bapm-rule-QE-176` returns. It is held back so two BA/PM hops don't edit the board at once.
