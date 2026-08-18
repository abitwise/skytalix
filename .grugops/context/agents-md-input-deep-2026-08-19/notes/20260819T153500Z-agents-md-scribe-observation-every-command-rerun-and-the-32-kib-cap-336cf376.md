---
id: 20260819T153500Z-agents-md-scribe-observation-every-command-rerun-and-the-32-kib-cap-336cf376
kind: observation
by: agents-md-scribe
at: 2026-08-19T15:35:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - AGENTS.md
  - NFR-008
supersedes:
---

# Every command I touched, re-run; the flattened-string claim re-measured; and `AGENTS.md` is at
90.7% of the 32 KiB cap

Node v24.12.0, npm 11.7.0. `ls -a .claude/` shows `settings.json` and `skills/` and **no
`worktrees/` directory**, so the recorded commands are correct as written inside this isolated
worktree — the same check QE made.

## The lane, as recorded and as it will be spelled

| command | result |
|---|---|
| `INPUT_DEEP=1 npx vitest run src/line-input.test.ts` | **exit 0, 26 passed, 0.22 s** |
| `npx vitest run src/line-input.test.ts` (default lane) | **23 passed** |
| `INPUT_DEEP=1 NODE_OPTIONS=--expose-gc npx vitest run src/line-input.test.ts` | **exit 0, 26 passed, 0.23 s** |

The third is the spelling the slot says it will take when the `external` guard lands. **It is green
today and the flag costs nothing** — so the forward-looking sentence in `AGENTS.md` is grounded in
a run, not a guess. The recorded slot command is still the first row and still exactly what I ran.

## The mechanism claim, re-measured independently

I wrote the assertion "`heapUsed` accounts a flattened 16 MiB string in full" into `AGENTS.md`, so
I measured it myself rather than transcribe QE. Out of tree, `node --expose-gc`, 16 × 1 MiB chunks
with distinct content:

```
cons  (16 MiB rope, unflattened)   heapUsed delta   0.00 MiB
flat  (the SAME string, flattened) heapUsed delta  16.19 MiB   external delta 0.18 MiB
                                   length 16,777,216
```

**Confirms QE's third row and refutes the cons-string mechanism.** QE read 16.00 MiB, I read
16.19 MiB — same conclusion, different tree, so `AGENTS.md` carries both numbers rather than one
that could later read as a pinned spelling. I did **not** rebuild QE's `external` guard: it is
QE's measurement and the repair hop's code, and re-deriving it here would be exactly the
duplication the fences forbid.

## Gate — unchanged from the base, as the subtask required

No `src/` change was made, so nothing could move, and nothing did.

| step | result |
|---|---|
| `npm test` | **39 files / 1175 tests passed, 0 failed** (2.50 s wall) |
| skip count (`--reporter=json`, `jq '.numPendingTests + .numTodoTests'`) | **0** |
| `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`, exit 0** |
| `npm run lint` | **exit 0, 70 files, no fixes applied** |
| `npm run typecheck` | **exit 0** |
| `npm run build` | **exit 0** |

## `AGENTS.md` is at 90.7% of the 32 KiB Codex cap — INFO, and rising every hop

**29,749 bytes of 32,768.** My edit added 704 of them; the file grew by roughly that on the two
hops before mine as well. Past the cap the tool truncates **silently**, and the tail of this file
is `## When uncertain` and the DoR/DoD pointers — the lines a confused agent needs most are the
ones that fall off the end first.

I am recording this and not acting on it. Every remaining paragraph is a pointer to an owner
directive (merge, UAT, deploy, QE dispatch) or a kit-override precedence note, and unilaterally
cutting one during a correction hop is not a Scribe's call on somebody else's branch. **The right
move is a dedicated compaction hop with a mandate** — most of the Delivery/authority sections
already say "that section is the authority; this is a pointer to them", and several run four
paragraphs to say it. Routing that is the Orchestrator's.
