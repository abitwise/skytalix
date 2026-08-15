---
id: 20260815T224500Z-security-nfr-observation-the-scope-of-this-review-ruled-not-assumed-30268906
kind: observation
by: security-nfr
at: 2026-08-15T22:45:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - V1.2.5
  - V1.3.2
  - V2.1.1
  - V2.2.1
  - V2.2.2
  - V13.4.1
  - V15.1.1
  - V15.2.1
  - src/cli.ts
  - src/cli-options.ts
  - src/cli.test.ts
  - AGENTS.md
  - package.json
supersedes: 
---

# The scope of the security review, RULED — the ASVS L1 result **stands**, but the check the subtask proposed is **necessary and not sufficient**

The subtask asked me to rule this rather than assume it, and offered its own reading —
*"the delta is documentation, notes and queue state only — zero bytes under `src/`"* — with the check
it used. **The reading is correct. The check is not enough on its own, and I would have missed a real
input if I had stopped there.**

## The check the subtask proposed, run

```
git diff --numstat d011df4..HEAD -- src/      ->  EMPTY, exit 0
```

Widened, because "empty numstat" and "identical bytes" are not the same claim:

```
all 50 src/*.ts at HEAD, blob SHA vs d011df4     50 compared, 0 differ
src/cli.ts            4624457783...  IDENTICAL
src/cli-options.ts    c1487e2c3674   IDENTICAL
src/cli.test.ts       46c8c5793f4c   IDENTICAL
src/history-pane.nfr.test.ts         IDENTICAL
package.json          81d3a85ae064   IDENTICAL
```

## Where the subtask's own framing would have let something through

**`src/cli.test.ts` reads two files from OUTSIDE `src/` at run time**, and one of them **is in the
delta**:

| read at | file | in the `d011df4..HEAD` delta? |
|---|---|---|
| `A1`, `src/cli.test.ts:196` | `AGENTS.md` | **YES — changed** |
| `A1`, `:197` and `A10`, `:673` | `package.json` | in the delta's path list, **blob-identical** |

So a `src/`-only diff is a **necessary and not sufficient** scope test for this ticket specifically,
because this ticket's own instruments reach outside `src/`. I resolved it rather than noting it:

```
AGENTS.md changed hunk (git diff -U0)     @@ -184,2 +184,4 @@   the Deployment-posture paragraph
the line A1 actually asserts on           AGENTS.md:62   "- Dev / run: `npm run chess`"
overlap                                   NONE
```

and the `A1` assertion pair (`toContain("- Dev / run: \`npm run chess\`")`,
`not.toContain("- Dev / run: \`UNKNOWN - verify\`")`, `scripts.chess === "node src/cli.ts"`) is
**green against HEAD's actual `AGENTS.md` and `package.json` in 17 full-suite runs I ran myself**
(condition A of both measurement harnesses; 856/856 on 30 files, every run).

## The ticket page moved too — and only its frontmatter

`plans/tickets/ABC-042-…md` **is** in the delta, which matters because `V2.1.1` is asserted against
`## Scope`'s table:

```
frontmatter          status: in-development -> ready-for-uat ; column: In Development -> Ready for UAT
body (line 9 on)     sha256 0724486c…c094  ==  0724486c…c094      IDENTICAL
Acceptance + Security/NFR triggers (87-278)  sha256 97989bad…517a  ==  97989bad…517a   IDENTICAL
```

**Every criterion this hop counts children off is byte-identical to the text both gates were run
against.** The page's `## Scope` table is transcribed *into* the test file rather than read from disk,
so `V2.1.1` has no runtime dependency on the page — but the transcription's correspondence to the page
is a gate obligation, and the page body did not move.

## The ruling

> **The ASVS L1 `PASS_WITH_RISKS` STANDS. It is not re-run, and the reason is measured rather than
> asserted: every ASVS row I evaluated was evaluated over bytes that are identical today.** All four
> bars, `V1.2.5`, `V1.3.2`, `V2.1.1`, `V2.2.1`, `V2.2.2`, `V15.1.1`/`V15.2.1` and `V13.4.1`'s N/A rest
> on `src/cli.ts`, `src/cli-options.ts`, `src/cli.test.ts` and `package.json`, and all four are
> blob-identical to `d011df4`. **Nothing in the delta can move a disposition**: notes, queue records,
> four new ticket pages, `plans/board.md`, `plans/traceability.md`, `plans/nfr-catalog.md`'s new
> `N8-SPAWN` section, one `AGENTS.md` paragraph 122 lines away from the only line the suite reads, and
> one ticket-page frontmatter status.

`V13.4.1` deserves one line because the `AGENTS.md` paragraph that changed is the deployment posture
it turns on. The new text asserts *"`package.json` is still `private: true` with no `bin`, `main`,
`exports` or `files`"*. **Checked at HEAD rather than taken on report:** `private` is `true`; `bin`,
`main`, `files`, `exports`, `publishConfig` and `dependencies` are all ABSENT; `scripts` holds ten
keys including `chess`. **The scribe's claim is true and `V13.4.1` stays N/A under `ADR-0007`.**

## What I did not re-do, said plainly

I did not rebuild the mutant sets from the gate and the re-check. **21 mutants across two hops died
against bytes that have not moved since**, and re-killing them would prove the same thing about the
same bytes. `S1` (low, open, narrower), `S4` and `S5` (low, new, in my own bar text) are unchanged and
are already cut as `ABC-057`–`ABC-060`; the four accepted risks `AR-1`–`AR-4` keep their named owners.
**Result unchanged: `PASS_WITH_RISKS`, zero high findings, nothing blocks on `block_on: high`.**
