---
id: 20260819T111500Z-software-engineer-observation-abc037-five-channels-and-the-guard-d4f6a8b0
kind: observation
by: software-engineer
at: 2026-08-19T11:15:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - ABC-035
  - src/line-input.test.ts
supersedes:
---

# `ABC-035` `G1`'s five escape channels, answered one at a time — and where the answer stops

`ABC-035`'s QE measured that a `vi.spyOn` stream guard is blind to `console.log`, `console.error`, a
`process.stdout.write` reference **bound at module load**, and `fs.writeSync`, plus a `globalThis`
flag. That gap is LIVE on `ABC-037` in a way it was not on `ABC-035`, because this module
legitimately writes. Here is what was built and what each layer can actually see.

## The three layers

- **Layer 1 — runtime spies.** The injected `PromptOutput` (every byte, byte-exact), the loop's
  `FrameSink` counted only while the seam is on the stack, `console.log/error/warn/info/debug`,
  `process.stdout.write`, `process.stderr.write`, and a `globalThis` own-key set diff across a full
  exercise.
- **Layer 2 — the import set of the DELIVERED file**, extracted by regex from
  `src/line-input.ts` and asserted to be **exactly** `./command-input.ts`, `./history.ts`,
  `./move-input.ts`, `./turn-loop.ts`. Zero Node builtins, zero packages.
- **Layer 3 — a token scan of the delivered file with comments stripped**: `process`, `console`,
  `globalThis`, `eval`, `Function`, `require`, `import(`, `child_process`, `exec*`, `spawn*`,
  `writeSync`, `fetch`, `Buffer` — all zero.

Comments are stripped first, deliberately. The module's own header NAMES those tokens in order to say
it does not use them; a guard that fired on its own documentation would be deleted by the next
engineer rather than fixed.

## Channel by channel

| channel | seen by | verified |
|---|---|---|
| `console.log` | layer 1 **and** layer 3 | mutant `M9` reds **2** |
| `console.error` | layer 1 **and** layer 3 | same spy set as `M9`; the spy array covers `error` |
| a `process.stdout.write` ref **bound at module load** | **layer 3 only. No runtime spy sees it and none is claimed to.** | closed BY CONSTRUCTION: the delivered file contains the token `process` **zero** times in code, so there is no reference to bind, early or late |
| `fs.writeSync` | **layer 2 and layer 3 only.** No runtime spy sees it; mocking `node:fs` would cost a hoisted `vi.mock` this ticket's one-file lane cannot spend | mutant `M10` (add the import and the call) reds **2**, caught by the import-set assertion and the token scan |
| a `globalThis` flag | layer 1 **and** layer 3 | mutant `M15` reds **1** |

**All five are answered, and two of them are answered by construction rather than by observation.**
That distinction is the point: the two `ABC-035` proved unobservable are exactly the two this module
made impossible.

## Where the guard stops — stated plainly, not glossed

1. **Layer 3 is LEXICAL.** It sees `process.stdout` and it does not see a deliberately obfuscated
   reconstruction of a global's name at runtime. Nothing in this suite would catch that. What it does
   catch is every channel `ABC-035` measured, in the spelling that ticket measured it, on the
   DELIVERED bytes — so a later edit adding `import fs from "node:fs"` reds this file rather than
   shipping.
2. **Layer 1's `process.stdout.write` spy catches only LATE-bound references.** It is kept because it
   costs nothing and it is one more way a careless edit reds, but it is not the load-bearing layer and
   the test header says so.
3. **The `FrameSink` count is a single-window count**, taken while the seam is on the stack. It relies
   on the loop being single-async and not writing concurrently — true of `runTurnLoop` today, and it
   would need re-reading if that ever changed.
4. **The import-set regex reads `from "…"` only.** A side-effect import (`import "node:fs"`) carries
   no `from` and would be missed by layer 2 — but it is caught by layer 3's `node:` and `writeSync`
   tokens. Two layers, one hole each, and the holes do not line up. That is the whole design.
