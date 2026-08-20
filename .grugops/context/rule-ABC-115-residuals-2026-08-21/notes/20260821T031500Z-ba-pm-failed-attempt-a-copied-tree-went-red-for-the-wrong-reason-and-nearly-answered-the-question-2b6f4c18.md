---
id: 20260821T031500Z-ba-pm-failed-attempt-a-copied-tree-went-red-for-the-wrong-reason-and-nearly-answered-the-question-2b6f4c18
kind: failed-attempt
by: ba-pm
at: 2026-08-21T03:15:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - G-QE115-1
supersedes:
---

# THE COPIED TREE WENT RED BEFORE I APPLIED ANY MUTANT — AND A RED FOR THE WRONG REASON IS THE ONE THAT LOOKS LIKE AN ANSWER

**First copy carried `src/` and the config files and NOT `AGENTS.md`.** `npx vitest run
src/cli.test.ts` came back **5 failed / 55 passed** — `ENOENT ... /AGENTS.md` at `src/cli.test.ts:1900`,
because five rows read `${REPOSITORY}AGENTS.md` and `REPOSITORY` is `new URL("..", import.meta.url)`,
i.e. **wherever the tree happens to sit**.

**Why it is recorded rather than quietly fixed.** I was about to run a mutant against that tree. A
mutation reading is `green ⇒ unguarded` / `red ⇒ guarded`, and this tree was **red before the mutant
existed** — five rows red for a missing file. Had I applied the mutant first and read the red, I
would have concluded *the branch IS guarded* and closed `G-QE115-1` on an artefact of my own copy.
**The discipline that saved it: establish the copied tree GREEN on the delivered build first, and
only then mutate.** Baseline 60/60 was recorded before a token was changed.

**Second, smaller dead end, recorded because it wastes a hop:** the probe script was written as
`.cjs`-style `require(...)` in a `.js` file, and the copied `package.json` carries `"type":
"module"`, so all six runs died with `ReferenceError: require is not defined` — a **uniform** failure
on both builds, which is the harmless kind. Renamed to `.cjs`.

**Not attempted, deliberately:** running any mutant inside the repository worktree. The subtask's
fence is `src/` untouched, and a mutant in a git worktree is one `git add -A` away from being
committed.
