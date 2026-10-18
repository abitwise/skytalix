---
subtask: bapm-ABC-169-rescope
role: ba-pm
from: main HEAD
branch: grugops/bapm-ABC-169-rescope
worktree: ../wt-bapm-ABC-169-rescope
---

# ABC-169 (and ABC-168): allow the one-line `package.json` key-pin test edit (records only)

The SE stopped ABC-169 at `4a0a075f` on `grugops/ABC-169`; the hop record is `.grugops/queue/done/ticket-to-pr-ABC-169.md`.

- A1–A5 hold, and A3 (comment-only) holds by transpile identity.
- A6 fails. `src/cli.test.ts:1759` ("ABC-042 A10 — package.json gains exactly one scripts key and nothing else") pins the exact
  top-level key list `AT_HEAD` (`:1766-1775`, 8 keys). Adding `"license"` makes it 9.
- The page forbids any test edit (A5 and A6) and says ADR-0036 (c) does not fire.

Do:
1. Re-scope ABC-169 so the delivery adds exactly `"license"` to `AT_HEAD` in `src/cli.test.ts`, and changes nothing else in that test.
   - Amend A5 (three files) and A6.
   - Re-read whether ADR-0036 (c), or any test-integrity rule, fires for editing a pin, and say so.
   - Keep the UAT reading. The test-file edit is excluded by the waiver grep, and A3 covers `src/evaluate.ts`.
2. Find the same blocker on ABC-168 (it adds `bin`, and the `build` script may change `SCRIPTS_AT_HEAD`) and on ABC-172 (rename: `name`,
   and any pinned strings), and fix their pages ahead of time.
   - Grep for every test that pins `package.json` keys, scripts or the name `cli-chess`, and list them on the relevant pages.
3. Write one short decision note under `.grugops/context/bapm-ABC-169-rescope/notes/`.

Fences:
- No diff to src, tools, package*.json, vitest.config.ts or memory-bank/50-decisions.
- Do not touch `plans/board.md` or `plans/traceability.md`; give the trace row in the handoff.
- No tests or timings.
- Nothing pushed or merged.
- When done, write `.grugops/queue/done/bapm-ABC-169-rescope.md` and `.claim.md`, uncommitted, in main's working tree.
