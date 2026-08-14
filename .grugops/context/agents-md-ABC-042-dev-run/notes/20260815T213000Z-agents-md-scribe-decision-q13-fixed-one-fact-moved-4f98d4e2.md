---
id: 20260815T213000Z-agents-md-scribe-decision-q13-fixed-one-fact-moved-4f98d4e2
kind: decision
by: agents-md-scribe
at: 2026-08-15T21:30:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - Q13
  - AGENTS.md
  - ADR-0007
  - EPIC-006
  - package.json
supersedes: 
---

# `Q13` fixed: exactly one fact moved — the entry point exists

## The contradiction, at the base tip `d011df4`

Two clauses of the same file, both load-bearing, and they cannot both be true:

- **§ Commands, line 62** — `` - Dev / run: `npm run chess` `` with an `ABC-042` comment dating the
  verification 2026-08-14.
- **§ Deployment posture, lines 184-185** — *"There is also no CLI entry point yet, which is why
  `Dev / run` above is `UNKNOWN - verify` and stays that way."*

The § Deployment posture sentence carried **two** false assertions, not one: that no entry point
exists, and that the `Dev / run` slot reads `UNKNOWN - verify`. The second is falsified by simply
scrolling up 120 lines. `A1`'s row asserts the § Commands string and is structurally blind to prose
two sections down, so no gate on this ticket could have caught it.

## Verified at my own hand before editing, not inherited

- `npm run chess` → prints the 23-row start-position frame on stdout, **exit 0**, in a worktree with
  **no `node_modules` at all** (the project has zero runtime dependencies). The command is real.
- `package.json` at this tip: `"private": true`, **no `bin`, no `main`, no `exports`, no `files`, no
  `publishConfig`**. `scripts.chess` is `node src/cli.ts`. `build` is still `tsc --noEmit`.
- No `dist/`. No deploy artifact of any kind (the repo still contains **no YAML file**). `.github`
  holds one file, `copilot-instructions.md` — no CI. `git remote -v` empty. `plans/releases/` still
  `.gitkeep` only.

So `ADR-0007`'s falsifiers **D1, D2, D3, D4 have not fired.** The posture is intact.

## Before

```
measured, not assumed. There is also no CLI entry point yet, which is why `Dev / run` above is
`UNKNOWN - verify` and stays that way.
```

## After

```
measured, not assumed. There IS a CLI entry point as of `ABC-042` (2026-08-14) — `Dev / run` above
is `npm run chess` — and it changes none of the above: it runs `src/cli.ts` from source, in place.
**Runnable is not deployable.** `package.json` is still `private: true` with no `bin`, `main`,
`exports` or `files`; nothing is built, emitted, published or installable.
```

Two lines out, four in. **One hunk. Nothing else in the file changed.**

## Why the replacement is longer than a deletion

Deleting the false sentence was the smaller edit and I rejected it. The old sentence did two jobs:
it stated a fact, and it **fenced an inference** — a reader who saw no entry point could not conclude
anything about packaging. With the entry point now real, deletion would leave § Deployment posture
with no link at all to the command table, and the next reader who finds `npm run chess` in § Commands
would have nothing in front of them saying that runnable is not deployable. **The fence has to be
stated once the absence stops doing the work**, or the fix quietly weakens the section it repairs.

`**Runnable is not deployable.**` is the whole point of the edit. The four-item `package.json`
enumeration is the check a reader can run in one command, and it is exactly `ADR-0007`'s **D2** list,
so a reader who wants to test the sentence knows where to look.

## What I deliberately did NOT do

- **No packaging or distribution language moved.** The next paragraph — *"the revisit trigger is
  named: `EPIC-006` (packaging). How the CLI will eventually be distributed — npm, a binary, a `git
  clone` — is undecided, and `EPIC-006` decides it. Do not fill that in."* — is **byte-identical**.
  I did not say `npx` works. I did not say packaging is settled. `EPIC-006` acceptance criteria #1
  (`npx <package>`) and #4 (`--difficulty`) remain unmet and this file does not imply otherwise.
- **`ADR-0007` untouched.** § Deployment posture is a pointer to it and stays a pointer; the ADR
  pointer paragraph is byte-identical.
- **No config value touched.** `production_requires_human_confirmation` is still `true`,
  `environments` is still `["local"]`, `default_stack.deploy` is still `none-local-only`.
- **§ Safety rules untouched.** *"There is also nothing to deploy and nowhere to deploy it"* is still
  TRUE — an entry point that runs from source in place is not an artifact — so the never-deploy rule
  needed no edit and got none. Editing it would have been the exact decay this subtask exists to
  prevent.
- **`plans/board.md` and `plans/traceability.md` not written.** Reserved to the Orchestrator on this
  ticket.

## The `A12` budget

`AGENTS.md` is inside `A12`'s licensed six, so this edit spends no new path. The delivered-diff file
list is unchanged.
