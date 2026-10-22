---
id: 20261021T165304Z-security-nfr-decision-7c1f3590
kind: decision
by: security-nfr
at: 2026-10-21T16:53:04Z
verified_by: 
confidence: high (every rating and fix flag measured in a scratch clone; no timing taken)
refs:
  - ABC-191
  - QE-191-a
  - QE-191-b
  - QE-191-c
  - AR-191-GITENV
  - AR-191-QUOTEPATH
  - AR-188-BINARY
  - AR-163-UNCOMMENT
  - AR-095-READ
  - ADR-0036
  - ADR-0036 S1
  - F-095-1
  - V5.2.1
  - V5.3.2
  - 837e8b22
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - 20261021T165257Z-security-nfr-observation-62620bb0
  - 20261021T164012Z-qe-e2e-observation-9bc0b262
  - 20261021T164023Z-qe-e2e-decision-16ba4076
  - 20261021T164302Z-orchestrator-decision-7f7588a5
  - 20261021T153032Z-security-nfr-decision-f5843a71
  - 20261021T153240Z-orchestrator-decision-9f5ca4b4
supersedes: 
seal: sha256:38fd071264c4f8dc9ff33124b93c77f8c9a1dd0789fce92fc5c8e817c45d47e7
---

# Security/NFR on QE-191-a: **PASS_WITH_RISKS**. QE-191-a is ACCEPTED as **`AR-191-GITENV`**: LOW with a stand-in, MEDIUM without. Owner: the Orchestrator. Fix: Architect/Design, one XS/P3 ticket that BA/PM cuts now. **Stand-in: YES**, one line at every routing and merge. QE-191-b is RE-RATED from INFO to LOW (latent), as **`AR-191-QUOTEPATH`**, with no routine stand-in. Nothing already merged is gated

ASVS L1, `block_on: high`, `compliance_regime` empty. The readings are in `…62620bb0`. Cites QE `…9bc0b262` and `ADR-0036` § S1 (`ABC-191` block) as authoritative.

## 1. QE-191-a: rating and why
- **Effect is wider than QE measured.** Every blinding route also hides a WIDENING: an added `node:fs` import and an added `fetch` call print `does not fire` on limbs 1 and 3. This is the `F-095-1` class, a form that passes silently, and it can hide an L1-relevant regression (`V5.2.1`, `V5.3.2`). QE measured only X1, a narrowing.
- **Reach is wider than "the operator's own config".** `.git/config` and `.git/info/attributes` are shared by main's checkout and every linked worktree (`extensions.worktreeConfig` is unset).
  - One `git config color.diff always` (or `color.ui always`, `diff.external …`, a prefix key, or a `diff.<drv>.command` plus an attribute) run by any agent in any worktree blinds the Orchestrator's instrument in main's checkout. This is measured.
  - No commit, no diff and nothing in the instrument's output shows it. Every brief forbids the write, but the fence is an instruction, not a control.
  - The env routes (`GIT_EXTERNAL_DIFF`, `GIT_CONFIG_*`) need the operator's own process.
- **A commit alone never blinds it.** A committed `diff=<drv>` attribute needs a configured command. It is inert at routing from main's checkout while the branch is unmerged. It is live at the staged merge in main's checkout only if the command exists.
- **Today nothing is set.** The stand-in line prints nothing on main's checkout. The gap has existed since `ADR-0036`. **Retiring the `--numstat` stand-in lost no cover:** QE showed it never caught these routes. Agreed.
- **Rating: LOW with the stand-in below, MEDIUM without it.** This is the same reasoning as `AR-188-BINARY`. Without the stand-in, a silent widening is reachable by any worktree agent with one command, and it is undetectable. That is worse in detectability than `AR-188-BINARY`'s committed file, which a reviewer could see. It does not block (`block_on: high`).

## 2. `AR-191-GITENV`: accepted risk
- **Owner: the Orchestrator.** It runs the stand-in. Fix: Architect/Design. Cut: BA/PM, XS, P3. It gates no merge.
- **Stand-in: YES, from now until the fix is on `main`.** At every routing and every merge, in the same checkout and the same shell environment as the instrument, this line must print nothing:
  `git config --get-regexp '^(color\.(ui|diff)|diff\.(external|srcprefix|dstprefix)|diff\..+\.command)$' | grep -v -E '^color\.(ui|diff) (auto|true|false|never)$'; printenv GIT_EXTERNAL_DIFF`
  - It is measured to flag every blinding route (`…62620bb0` § 5).
  - If it prints anything, do not trust that run's clause (b) result. Remove the setting, or route the diff to Security/NFR by hand as fired on every limb.
- **Fix: the ticket must hold:**
  - (a) The one diff call gains `--no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/`. Measured: this turns every blinding route to FIRES on X1 and ADD, limbs 1 and 3. The harmless routes stay FIRES.
  - (b) Harness rows in a scratch clone with clone-local config only, each with a widening plant (ADD), not only X1:
    - `color.diff=always`;
    - `diff.external`;
    - `GIT_EXTERNAL_DIFF`;
    - `diff.<drv>.command` with an attribute;
    - `diff.srcPrefix`/`dstPrefix`.
    Each must FIRE at head and be silent on the `837e8b22` instrument.
  - (c) A dated `ADR-0036` § S1 block, with the stand-in's retirement in it.
- **Closes when** QE reads (b) firing at head and silent on base's instrument. The stand-in then retires.
- **Re-rate trigger:** the stand-in ever prints a line, or it is skipped at a merge. Either one makes this MEDIUM, and Security/NFR re-reads it.

## 3. QE-191-b: RE-RATED from INFO to LOW (latent), as `AR-191-QUOTEPATH`
- **QE's reading holds for an unreached file, but not after it is reached.**
  - Once `cli.ts` imports `src/qé.ts` (one disputed fire), later edits to `src/qé.ts` that add `node:fs` and `fetch` are silent on limbs 1 and 3. The edge already exists, so no dispute is raised.
  - The AGENTS.md waiver form also prints nothing for them, because `grep '^src/'` misses the quoted `"src/q\303\251.ts"`. So the change also rides the UAT waiver.
  - This is the `F-095-1` class again. It is latent: the repository holds 0 non-ASCII paths.
- **Owner: the Orchestrator. Trigger: the dispute line.**
  - Every route to a reached non-ASCII file passes through a fail-safe dispute that reads `-> src/<name>.<ts|js…> (not a production file at <head>)`. That is measured as QB.
  - If such a dispute names a target that exists under `src/` with a production extension, it is this trigger. Security/NFR must NOT clear it. The fix lands before that ticket merges.
  - **No routine stand-in.**
- **The fix rides the same ticket.**
  - Every git call in the instrument runs with `-c core.quotePath=false`. Measured: QU and QE2 FIRE with it.
  - Any path still C-quoted (a `"`, `\`, tab or newline in the name) FIRES (disputed) and is not dropped.
  - Harness rows QU and QE2.
- **Owed outside the instrument (the owner's text):** the AGENTS.md waiver form should read `git -c core.quotePath=false diff --name-only …`. Routed to the Scribe, with owner approval. Until then the trigger above covers it.

## 4. QE-191-c: not re-rated (outside this brief); QE's reading rule stands.

## Accepted risks after this rating
- `AR-191-GITENV` (LOW with the stand-in; owner the Orchestrator; new).
- `AR-191-QUOTEPATH` (LOW, latent; owner the Orchestrator; new).
- Carried, unchanged: `AR-163-UNCOMMENT` and `AR-095-READ`.

**Required fixes before any merge:** none.

## Owed
- **The Orchestrator:**
  - run the stand-in from the next routing on;
  - record both accepted risks;
  - apply the `AR-191-QUOTEPATH` dispute rule;
  - route the cut to BA/PM and the waiver-form wording to the Scribe;
  - commit these records.
- **BA/PM:** cut one XS/P3 ticket holding § 2 (a)–(c) and § 3's fix.
- **Architect/Design:** build it.
