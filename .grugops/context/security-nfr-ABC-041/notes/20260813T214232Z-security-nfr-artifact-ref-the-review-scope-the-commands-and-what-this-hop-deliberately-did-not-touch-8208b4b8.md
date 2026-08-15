---
id: 20260813T214232Z-security-nfr-artifact-ref-the-review-scope-the-commands-and-what-this-hop-deliberately-did-not-touch-8208b4b8
kind: artifact-ref
by: security-nfr
at: 2026-08-13T21:42:32Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - plans/board.md
  - plans/traceability.md
  - .grugops/queue/pending/security-nfr-ABC-041.md
  - src/render-seam.ts
  - src/render-seam.test.ts
supersedes: 
---

# Review scope, every command run, and the three things this hop deliberately did NOT touch.

## Where the work is

- **Branch `grugops/security-nfr-ABC-041`**, worktree `../cli-chess-sec041`, cut off the ticket
  branch at **`ac17fe2`**. `git merge-base HEAD main` → `eea6afc`, which is the base every diff below
  is taken against.
- **Four notes**, this one included, under `.grugops/context/security-nfr-ABC-041/notes/`:
  `decision` (the adjudication), `observation` (the ASVS L1 review and its result), `observation`
  (`NFR-002` / `N8-LANE`), `claim` (the threshold repair, homed to BA/PM).
- **Queue claim** taken by hand per `AGENTS.md`: bare `mkdir` (no `-p`) of
  `.grugops/queue/claimed/security-nfr-ABC-041/` in the MAIN repo, exit 0. `EEXIST` would have meant
  the claim was lost and this hop would have stopped. `scripts/claim.js` does not exist in this repo
  or in the kit. Two claims are held across the factory (mine and QE's `quality-gate-ABC-041`);
  `queue.claim_cap` is **2** — at cap, not over it.

## Every command run, so the review is reproducible rather than asserted

```
git diff --numstat eea6afc HEAD                            # whole-branch diff
git diff --numstat eea6afc HEAD -- src/                    # 3 files: +62 / +304 / +1
git diff --numstat eea6afc HEAD -- package.json package-lock.json biome.json tsconfig.json vitest.config.ts
                                                           # EMPTY — every manifest byte-untouched
jq 'has("dependencies")' package.json                      # false
jq -r 'keys[]' package.json                                # no dependencies key
git diff eea6afc HEAD -- src/ | grep '^+' | grep -E 'node:|require\('
                                                           # exactly ONE hit: render-seam.test.ts node:fs
grep -rn 'from "node:' src/                                # 3 test files, 0 production files
grep -rnE 'from "node:(http|https|net|tls|dgram|crypto|dns)"|fetch\(|new WebSocket|createHash|createCipher|randomBytes' src/
                                                           # NONE
grep -rnE '\beval\(|new Function\(' src/                   # NONE
grep -rnE 'writeFileSync|writeFile\(|appendFile|mkdirSync|rmSync|unlinkSync|createWriteStream|writeSync' src/
                                                           # only the merged probe, untouched here
git diff eea6afc HEAD -- src/ | grep -inE 'api[_-]?key|secret|token|password|PRIVATE KEY|xox[baprs]-|ghp_|AKIA[0-9A-Z]{16}'
                                                           # only `const token = FOOLS_MATE[...]` — a chess move
npm audit                                                  # 3 vulns: 1 moderate, 2 high — ALL dev
npm audit --omit=dev                                       # found 0 vulnerabilities
npx vitest run src/render-seam.test.ts                     # 8 passed / 8, 16 ms
```

The ASVS filter was computed off `agent-factory/checklists/security-nfr-checklist.md` rather than
eyeballed: **345 requirements total, 70 at L1**, distributed V1:8 V2:4 V3:8 V4:2 V5:4 V6:13 V7:6 V8:4
V9:4 V10:5 V11:3 V12:3 V13:1 V14:2 V15:3 V16:0 V17:0.

## What this hop deliberately did NOT touch, and why — stated rather than silently skipped

**1. `plans/board.md` — NOT moved.** The role owns the `In Security/NFR` exit, but `ABC-041` is not in
that column: it sits in **`In Review` (1/3)**, and `In Security/NFR` reads **0/2**. This subtask is an
adjudication injected mid-flow, not a column pull. More importantly **QE holds the `In Review` exit on
the SAME tip in a parallel worktree** — two branches editing `plans/board.md` off one base is a
conflict handed to the Orchestrator for nothing. **Owed to the Orchestrator**, with everything it
needs already above.

**2. `plans/traceability.md` — NOT appended.** The role and WF15 both say to append the reviewed NFR
IDs and the result. Deviated for the same single-writer reason as the board, and recorded here rather
than dropped. **What the row is owed, ready to paste:** `ABC-041` — Security/NFR reviewed at ASVS
**L1**, `block_on` **high** → **`PASS`** (zero findings, zero required fixes); NFRs reviewed
**`NFR-002`** (structural claim verified — zero derives added to the frame path; wall clock unchanged
and still `UNKNOWN - verify`) and **`N8-LANE`** (does not fire — 1 file, 16 ms, below the 94.2 ms
median).

**3. `plans/tickets/ABC-041-render-seam-closure.md` — NOT edited.** The threshold's wording is
defective and the repair is drafted in the sibling `claim`, but **a gate does not rewrite the criteria
it gates**. That is BA/PM's, at the next cut. No criterion was waived and none was rewritten.

**4. The queue transition — left to the Orchestrator.** `.grugops/queue/pending/security-nfr-ABC-041.md`
is committed on `main`, which is ahead of this branch's base; this worktree has no
`.grugops/queue/pending/` at all. Completing the `pending → done` move would mean writing `main`'s
tree, and this hop commits **only** on `grugops/security-nfr-ABC-041`. A `done.md` marker was written
inside the claim directory so a later hop reads the claim as **complete rather than stale**
(`queue.stale_ttl_minutes` is 30).

**5. `../cli-chess-qe041` — never entered.** No note was written under any other subtask's folder.
**Nothing was merged and nothing was deployed.**

## `node_modules`

The symlink into the main repo's `node_modules` was used for `npx vitest run` and `npm audit`, and is
**removed** before this hop ends, as the subtask requires.
