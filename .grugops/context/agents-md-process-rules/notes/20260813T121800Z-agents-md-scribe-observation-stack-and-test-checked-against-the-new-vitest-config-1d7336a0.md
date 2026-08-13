---
id: 20260813T121800Z-agents-md-scribe-observation-stack-and-test-checked-against-the-new-vitest-config-1d7336a0
kind: observation
by: agents-md-scribe
at: 2026-08-13T12:18:00Z
verified_by:
confidence: medium
refs:
  - agents-md-rules-2026-08-13
  - AGENTS.md
  - vitest.config.ts
  - tsconfig.json
  - biome.json
  - ABC-026
supersedes:
---

# Today's `vitest.config.ts` falsifies NOTHING in § Stack or § Test — so I changed neither

The brief invited me to check whether `main`'s new `vitest.config.ts` (`pool: "threads"`, landed
today at `ABC-026`, commit `acbddf4`) made anything false in those two sections, and to **correct only
what is false**. I checked each existing statement and found nothing to correct.

| Statement in `AGENTS.md` | Status after `vitest.config.ts` |
|---|---|
| § Stack "Vitest for tests, Biome for lint + format" | still true — the config selects a *pool*, it does not change the runner |
| § Stack "Node runs `.ts` files directly via built-in type stripping, so there is no bundler or transpile step in dev" | still true — `pool: "threads"` adds no transpile or bundle step |
| § Stack "TypeScript on Node (>= 22), ESM" | still true — `package.json` `engines.node` `>=22`, `"type": "module"` |
| § Test `npm test` (`vitest run`) | still the correct command — vitest auto-loads the new config; the script in `package.json` is unchanged |
| § Test `npx vitest run <path>` | still the correct command, same reason |

The config changes *how* the existing lane runs, not *what* anyone types or what the stack is. A
`pool` setting is invisible at the command surface, which is the only surface these two sections
describe.

## What I could NOT re-verify here, stated as a limit rather than papered over

`npm test` **could not be executed in this worktree**: it exits `sh: vitest: command not found`
because `/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-scribe/node_modules` **does not
exist**. That is an artifact of this scribe worktree being freshly created — the delivery audit
records the same class of gap being worked around by symlinking `node_modules` from a sibling
worktree. **It is not evidence that the recorded command is wrong, and I did not record it as such.**
I also did not run `npm install` to manufacture a green: populating dependencies is outside this
subtask's file boundary, and the question in front of me (does a `pool` setting change a command
string?) is answerable by reading, which is how I answered it.

## One adjacent fact confirmed while checking

`vitest.config.ts`'s own header warns that it sits outside both include globs, so neither
`npm run typecheck` nor `npm run lint` reads it. **Confirmed, not taken on trust:**
`tsconfig.json` `include` is `["src/**/*.ts", "spike/**/*.ts"]` and `biome.json` `files.includes` is
`["src/**/*.ts", "spike/**/*.ts", "*.json"]` — a root-level `.ts` file matches neither. The warning is
accurate. I deliberately did **not** copy it into `AGENTS.md`: it is already written at the point of
use, where the engineer about to edit that file will actually see it, and duplicating it into the
substrate every agent loads would be drift waiting to contradict its source.
