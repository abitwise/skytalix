---
id: 20261021T183616Z-security-nfr-decision-5719a86d
kind: decision
by: security-nfr
at: 2026-10-21T18:36:16Z
verified_by: 
confidence: high (every rating, the stand-in and the fix shape measured in a scratch clone; no timing)
refs:
  - ABC-193
  - QE-193-a
  - QE-193-b
  - QE-193-c
  - QE-193-e
  - R-193-a
  - AR-193-HUNKHDR
  - AR-193-SPACEPATH
  - AR-191-GITENV
  - AR-191-QUOTEPATH
  - AR-188-BINARY
  - AR-163-UNCOMMENT
  - AR-095-READ
  - F-095-1
  - ADR-0036
  - ADR-0036 S1
  - aa86a1a1
  - 63eadabe
  - 11245e3d
  - V5.2.1
  - V5.3.2
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - .grugops/context/design-F-072-1/probe/r2-mutants.sh
  - .grugops/context/security-nfr-QE-193/probe/fix-prototype.patch
  - 20261021T183537Z-security-nfr-observation-c5270049
  - 20261021T182104Z-qe-e2e-decision-69c93667
  - 20261021T182104Z-qe-e2e-observation-9c7a6680
  - 20261021T182327Z-orchestrator-decision-f61be5db
  - 20261021T165304Z-security-nfr-decision-7c1f3590
  - 20261021T153032Z-security-nfr-decision-f5843a71
supersedes: 
seal: sha256:365ec308761cc2488c9d2ea34f0ce7469cf1337d2866f45444a2f722e5520234
---

# Security/NFR on QE-193: **PASS_WITH_RISKS**. QE-193-b is ACCEPTED as **`AR-193-HUNKHDR`**: LOW with a stand-in, MEDIUM without. QE-193-a is ACCEPTED as **`AR-193-SPACEPATH`**: LOW, latent. The Orchestrator owns both. One XS/P3 fix ticket holds both: BA/PM cuts it now and Architect/Design builds it. **Stand-in: YES**, one line at every routing and merge, covering both. QE-193-c and QE-193-e: INFO, agreed. Nothing already merged is gated

ASVS L1, `block_on: high`, `compliance_regime` empty. The readings are in `…c5270049`. Cites QE `…69c93667` / `…9c7a6680` and the Orchestrator's `…f61be5db`. `ADR-0036` § S1 (all dated blocks) is authoritative.

**What clause (b) decides.** Clause (b) firing is what routes a ticket to `In Security/NFR` (`ADR-0036` § Context). A blind limb therefore skips this gate silently. That is the `F-095-1` class: a form that passes silently.

## 1. QE-193-b: rating and why
- **Who can reach it: the author of any change to an existing production file, by content alone.**
  - It needs no config, no file name and no privilege.
  - One line beginning `++ ` at column 0 is enough: in a template literal (lint-clean, per QE) or in a block comment, in an earlier hunk.
  - **A deliberate evasion is trivial.** An accidental one is rare: the stand-in finds 0 such lines in 174 first-parent `src/` commits, and `src/` holds 0 today.
- **Effect: limbs 2 and 3 do not see any later hunk of that file, at head and on `11245e3d`. This is measured.**
  - It hides a new `process.env` read and a new `fetch` (`PP-TPL`, `PP-CMT`).
  - It hides an in-place edit of an existing `process` read in a limb-2 holder (`PP-EDIT`). That breaks § Decision 2's "edited in place … counts".
  - A `++ b/src/<file>` line also reads the later hunks against another production file, and the output names a file the diff never touched (`PP-REDIR`).
  - The regressions it can hide, a spawn/exec/eval call or an input-fed call, are L1-relevant (`V5.2.1`, `V5.3.2`).
- **What still catches it:**
  - limb 1, through Ruling 2 (`PP-L1`);
  - (b2) and the non-literal-import disputes, which are read from each end's AST, not from the diff;
  - new files, which have one hunk;
  - a `++ "` line, which disputes on its own.
  - **The waiver form lists the file**, so no such change rides the UAT waiver. QE reads every ticket, and the owner's UAT and a human merge review see the diff. But nothing flags the line, and the Security/NFR gate is not routed.
- **Rating: MEDIUM without a stand-in** (QE's proposal, agreed): an author-controlled, silent widening on two limbs. **LOW with the stand-in below.** This is the same reasoning as `AR-191-GITENV` and `AR-188-BINARY`. It does not block (`block_on: high`).

## 2. QE-193-a: rating and why
- **Reach.** The author must give a production file a name with a space. That name shows in every listing, in the waiver form (so there is no ride) and in the instrument's own baseline holder list.
  - Once the file is reached, a later widening is silent on **all three limbs**, Ruling 2 included (`SP-N5`). An unreached one is silent too (`SP-N4`).
  - Unlike `AR-191-QUOTEPATH`, **no dispute line arises**, so no automatic trigger exists.
  - 0 such paths exist in all history.
- **Rating: LOW, latent** (QE's proposal, agreed). The stand-in for `AR-193-HUNKHDR` also flags this case (its `\t$` half), so it costs no extra line.

## 3. `AR-193-HUNKHDR` (QE-193-b) and `AR-193-SPACEPATH` (QE-193-a): accepted risks
- **Owner of both: the Orchestrator**, who runs the stand-in. **Fix:** Architect/Design. **Cut:** BA/PM, one ticket, XS, P3. It gates no merge.
- **Stand-in: YES, from now until the fix is on `main`.** At every routing and every merge, run it in the same checkout, with the same `<base>`/`<head>` as the instrument. This line must print nothing:
  `git -c core.quotePath=false diff -U0 --no-renames --text --no-textconv --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/ <base> <head> -- src | awk '/^diff --git /{h=0} /^@@/{h=1} /^(\+\+\+|---) / && (h || /\t$/)'`
  - It is measured to flag 8 of 8 colliding plants. It is silent on the control and has 0 hits over main's history.
  - It holds under `GIT_DIFF_OPTS`. It carries the instrument's own flags, so git config cannot blind it.
  - **If it prints anything, do not trust that run's clause (b) result.** Route the change to Security/NFR by hand as fired on every limb.
- **What the fix ticket must hold:**
  - **(a)** `changedLines` reads `---`/`+++` lines, and the C-quoted test, as headers **only between a `diff --git ` line and that file's first `@@`**. This is QE's shape. It also removes `R-193-a`'s false dispute.
  - **(b)** An unquoted header path drops **one** trailing TAB. This is unambiguous: git adds the TAB only for a space, and C-quotes any name that holds a real TAB.
  - **(c)** Harness rows in a scratch clone. Each FIRES at head and does not fire on the `63eadabe` instrument:
    - `PP-TPL`: limbs 2 and 3.
    - `PP-EDIT`: limb 2.
    - `PP-REDIR`: limbs 2 and 3, and `production files changed` names only the real file.
    - `SP-N5`: limbs 1, 2 and 3.
    - `RA-PLUS`, which reads with no `C-quoted` line, so `R-193-a` is gone.
    - **The 20 existing rows print what they print today.**
  - **(d)** A dated `ADR-0036` § S1 block, with the stand-in's retirement in it.
  - **Measured:** `probe/fix-prototype.patch` (3 lines added and 5 edited) meets (a) and (b) on every plant and keeps `r2-mutants.sh` at 20/20, byte-identical to head. BA/PM may cite it as the scratch prototype.
  - **Optional rider (not a close term):** drop `GIT_DIFF_OPTS` from the instrument's git environment (QE-193-c).
- **Close conditions:**
  - **`AR-193-HUNKHDR`** closes when QE reads `PP-TPL`, `PP-EDIT`, `PP-REDIR` and `RA-PLUS` as in (c), with the 20 rows unchanged.
  - **`AR-193-SPACEPATH`** closes when QE reads `SP-N5` as in (c).
  - The stand-in retires at that merge, and the Orchestrator records both closes.
- **Re-rate triggers:**
  - The stand-in ever prints a line, or it is skipped at a routing or merge. Either one makes `AR-193-HUNKHDR` MEDIUM, and Security/NFR re-reads it.
  - A `src/` path with whitespace appears. That is `AR-193-SPACEPATH`'s trigger: the fix lands before that ticket merges, and until then the change routes by hand as fired on every limb.

## 4. QE-193-c: INFO, agreed (owner Architect/Design)
- The verdict is fail-safe: it only over-counts, so verdicts can only rise. Neither the stand-in nor the fix prototype is weakened by it (measured under `--unified=5`).
- `ADR-0036` block (i)'s sentence is broader than the flags cover for this one variable. The fix's dated block should state the scope exactly, or the optional rider should make the sentence true.

## 5. QE-193-e: INFO, agreed. It over-fires, which is fail-safe, and matches block (ii)'s words. No action.

## Accepted risks after this rating
- `AR-193-HUNKHDR` (LOW with the stand-in; owner the Orchestrator; new).
- `AR-193-SPACEPATH` (LOW, latent; owner the Orchestrator; new).
- Carried, unchanged: `AR-163-UNCOMMENT` (limbs 2/3) and `AR-095-READ`.

**Required fixes before any merge:** none.

## Owed
- **The Orchestrator:**
  - run the stand-in from the next routing on;
  - record both accepted risks;
  - route the cut to BA/PM;
  - commit these records.
- **BA/PM:** cut one XS/P3 ticket holding § 3 (a)–(d).
- **Architect/Design:** build it.
