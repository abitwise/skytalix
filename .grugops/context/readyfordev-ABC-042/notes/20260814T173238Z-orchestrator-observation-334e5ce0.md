---
id: 20260814T173238Z-orchestrator-observation-334e5ce0
kind: observation
by: orchestrator
at: 2026-08-14T17:32:38Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - src/history-pane.test.ts
  - src/render-seam.test.ts
  - src/san.test.ts
  - 20260814T171719Z-orchestrator-claim-10a5bfe5
supersedes: 20260814T171719Z-orchestrator-claim-10a5bfe5
---

# Correcting my own count: **4** test files import a Node builtin, not 2

Supersedes `20260814T171719Z-orchestrator-claim-10a5bfe5`. **Security/NFR re-measured and caught a
false number in it.** That is the review working; recording it plainly rather than quietly.

## What was wrong

My claim said *"Test files already importing `node:child_process`: **2**"* and, of the board's
"0-of-47" figure, *"2 of those 47 import a builtin today"*. **Both are wrong.** Security/NFR reported
4 and named the two I missed. I re-measured independently before accepting the correction, and the
count of **4** is right:

| file | line | import |
|---|---|---|
| `src/glyph-mode.nfr.test.ts` | 63–65 | `node:fs`, `node:fs/promises`, `node:child_process` |
| `src/history-pane.nfr.test.ts` | 23–24 | `node:child_process`, `node:fs` |
| `src/render-seam.test.ts` | 39 | `node:fs` ← **missed** |
| `src/san.test.ts` | 27 | `node:fs` ← **missed** |

**Why I missed them:** I grepped for `child_process` specifically and then generalised the answer to
"any builtin" without re-running the wider query. The narrower measurement was correct; the sentence
I wrote from it was not.

**One further caution, measured while checking:** a bare `grep -l "node:" src/*.ts` returns **5**
files, not 4. `src/history-pane.test.ts:695` matches on `(node: T, path: string)` — a **parameter
named `node`**, not an import. Any guard written for this invariant that greps the token `node:`
will count that file and be wrong. `src/history-pane.nfr.test.ts:567-568` is a third shape again:
`node:module` and `node:fs` inside a **probe string** compiled for a child process, which is neither
an import of this file nor a false positive.

## What SURVIVED, carried forward so folding out the old note loses nothing

The superseded claim's substance was **upheld**, and its central measurement was never in doubt:

- **Production files under `src/` importing any Node builtin: 0 of 18.** Re-verified here. Security
  reports it is stronger still — zero non-relative imports of any kind in production.
- **The collision the claim raised was real and is now ruled.** Security/NFR ruled that *"the
  delivered diff"* in bars 1 and 3 and in the firing threshold means the delivered **production**
  modules, so `A1` and bar 1 are jointly satisfiable and the production invariant is preserved. The
  ruling is theirs, in
  `.grugops/context/security-nfr-ABC-042/notes/20260814T172700Z-security-nfr-decision-592c0a9e.md`,
  and it ships with a new control (BAR 1b) that my claim did not think of.
- Security also recorded the decisive point I had **not** seen: both merged `child_process` uses are
  security-*positive* — `spawnSync(process.execPath, [...])` is the parameterised, no-shell form ASVS
  V1.2.5 [L1] requires, and `glyph-mode.nfr.test.ts` imports the module **only to spy that production
  never calls it**. A whole-diff reading forbids the instrument that proves the absence of OS calls.

## Consequence for the board — mine to fix

`plans/board.md:3` states the invariant as **"0-of-47 … BREAKS at `ABC-042`"**. On these numbers
that sentence is wrong twice: the denominator counts test files while the numerator is production-
only, and the invariant **does not break** — production stays 0 of 18 under the ruling. Security
raised it as RF-6 and named the Orchestrator as owner. Correct it at this hop's board update.
