---
id: 20260815T211122Z-software-engineer-observation-two-loose-ends-the-orchestrator-owns-not-me-3ad0b777
kind: observation
by: software-engineer
at: 2026-08-15T21:11:22Z
verified_by: 
confidence: high
refs:
  - .grugops/queue/pending/lint-config-drift.md
  - .grugops/queue/claimed/lint-config-drift/
  - package.json
  - lint-config-drift
supersedes: 
---

# Three things left deliberately undone, each one somebody else's to do

Recorded so none of them is discovered later as a surprise.

## 1. The task file could not be `git mv`d, because it was never tracked

The subtask file said to `git mv .grugops/queue/pending/lint-config-drift.md` into the claim
directory. At `main` (`c732fe2`) that path is **untracked**:

```
$ git ls-files --error-unmatch .grugops/queue/pending/lint-config-drift.md
error: pathspec '...' did not match any file(s) known to git
$ git log --all --oneline -- .grugops/queue/pending/lint-config-drift.md
(no output)
```

It exists only as an untracked file in the **main** worktree's working tree. Its bytes were copied
verbatim into `.grugops/queue/claimed/lint-config-drift/lint-config-drift.md` on this branch
(`shasum` matched: `dcc49021cadb562162a8ea4bb5deda4c8459347e`) and staged by explicit path, so the
end state on this branch is the intended one.

**Left for the Orchestrator:** after this branch merges, the untracked copy still sitting at
`.grugops/queue/pending/lint-config-drift.md` in the main worktree is a duplicate of the claimed
one. It was not deleted from here — the main worktree was mid-merge (`HEAD` observed at `eca0f10` on
`grugops/design-adr0007-deploy-authority`, then back at `c732fe2` minutes later) and writing into a
tree another agent is merging is not this role's to do.

Same shape applies to `.grugops/queue/pending/agents-md-owner-grants.md`, also untracked in the main
worktree — noticed, not touched, not this subtask's.

## 2. `package.json` still pins `^2.3.0` while the config now declares schema 2.5.5

`@biomejs/biome` is `^2.3.0` in `package.json` and exactly `2.5.5` in `package-lock.json`. After this
diff, `biome.json`'s `$schema` names 2.5.5. That reads inconsistent at a glance and is **not** a
defect: the caret admits 2.5.5, the lock pins it, `npm ci` is reproducible, and Biome's own
schema-drift check is now silent because it compares the schema against the **installed CLI**, not
against the `package.json` range.

Tightening the caret is a dependency edit, and this hop was explicitly fenced out of dependency
changes. **Flagged, not fixed** (coding rule 12). If anyone wants the caret to match, that is a
ticket, and it should carry the reason: today the fuse is that a future `npm install` could resolve
a 2.x newer than 2.5.5 and re-open the same schema-drift `info`. This diff does not prevent that
recurrence — it clears today's instance of it.

## 3. The board, `plans/traceability.md` and `memory-bank/` were not touched

The Software Engineer role would normally move the board and append a trace row. The subtask's scope
fence names `plans/`, `memory-bank/`, `AGENTS.md` and the board as the Orchestrator's this hop, and
it is concurrently merging two branches into `main`. **The fence wins over the role's default.** No
board column was moved and no traceability row was appended by this hop; there is also no ticket id
here to trace against — this is hygiene work under task `hygiene-2026-08-16`, not a `plans/tickets/`
ticket.
