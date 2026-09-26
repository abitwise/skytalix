---
id: 20260926T225600Z-agents-md-scribe-observation-10bd98b4
kind: observation
by: agents-md-scribe
at: 2026-09-26T22:56:00Z
verified_by:
confidence: high
refs:
  - AGENTS.md
  - src/line-input.test.ts
supersedes:
---

# Raw measurements behind the two edits

Hand-authored, same admission-refusal reason as the sibling `decision` note.

## Wait-loop rule source

`.grugops/context/wave-2026-09-25/notes/20260926T073000Z-orchestrator-failed-attempt-8ccbfa69.md`
records three hung shells found by the owner (pids 23057, 27104, 32418), each of the form
`until ! pgrep -f "vitest run src/search.pvs-lmr.test.ts" > /dev/null; do sleep 10; done` —
`pgrep -f` matches the full command line of the loop itself (which contains the same search
string), so the condition can never go false. Stopped with SIGTERM (never SIGKILL). The note asked
for "a Scribe line in AGENTS.md once ABC-109 lands" — ABC-109 landed (`26db9a8`), so this hop adds
it.

## INPUT_DEEP measurements (this worktree, foreground, bounded)

Three runs, `src/line-input.test.ts`, all exit 0:

1. `INPUT_DEEP=1 NODE_OPTIONS=--expose-gc timeout 60 npx vitest run src/line-input.test.ts` →
   **34 passed**, 0.34s (run once), 0.093-0.109s test time (run twice for stability, same count
   both times).
2. `npx vitest run src/line-input.test.ts` (no env vars, default lane) → **30 passed**, 0.017s.
3. `INPUT_DEEP=1 timeout 60 npx vitest run src/line-input.test.ts` (env var dropped, guard should
   not run) → **33 passed**, 0.054s — confirms the "guard-dropped" count is one less than the
   full 34, consistent with the existing trap's shape (previously 32/33, now 33/34).

The prior recorded receipt (`memory-bank/90-agents-md-command-log.md`, RUN 2026-08-19 at `298bb95`)
said 33/32/29 for the same three configurations; today's counts are each exactly +1. The most
likely explanation is a test was added to `src/line-input.test.ts` between 2026-08-19 and now (not
investigated further — out of this hop's narrow scope, which is correcting the stale receipt, not
auditing why it drifted). AGENTS.md's own line does not state the default-lane count, only the
deep-lane pair (33/32 → 34/33), so only the command log's fuller receipt needed the default-lane
note (29 → 30).

## Full-suite result

`npm test` → exit 0, 47 files, 1447 tests, byte-guard test (`src/cli.test.ts:2133`,
"ABC-109 — AGENTS.md stays inside its byte budget") green at 22,090 B against the 24,576 B budget.
