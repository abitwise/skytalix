---
id: 20260815T211122Z-software-engineer-artifact-ref-the-diff-the-commands-and-the-five-acceptance-criteria-measured-dfb09303
kind: artifact-ref
by: software-engineer
at: 2026-08-15T21:11:22Z
verified_by: 
confidence: high
refs:
  - biome.json
  - lint-config-drift
  - hygiene-2026-08-16
  - A1
  - A2
  - A3
  - A4
  - A5
supersedes: 
---

# The artifact: one branch, one changed file, four changed characters' worth of meaning

## Branch and commits

- Branch: **`grugops/lint-config-drift`**, branched from **`main` by name** (resolved to `c732fe2`).
- Worktree: `../cli-chess-lintcfg` — a dedicated `git worktree`, because the main worktree's `HEAD`
  was observed moving during this hop under a concurrent Orchestrator merge.
- `f9f73b2` `chore(queue): grug claim lint-config-drift by hand, no script exist`
- `868f384` `fix(lint): grug run biome migrate, two info about config go away`
- **NOT merged.** The Orchestrator takes the merge after re-running the gate on this tip.

## A5 — the file list and the line count

```
 biome.json | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)
```

**One file. Two insertions, two deletions.** `package.json` is NOT in the diff — the migration did
not require it. **Zero lines under `src/`**, confirmed by the diffstat above having no `src/` row.

## A1 — the real `npm run lint` output after the diff

```
> cli-chess@0.0.0 lint
> biome check .

Checked 54 files in 82ms. No fixes applied.
```

Exit **0**. **No diagnostics block at all, and no `Found N infos` line** — Biome omits the summary
line entirely when the count is zero, so "clean" here reads as the absence of that line rather than
`Found 0 infos`. Compare the before, same corpus:

```
Checked 54 files in 91ms. No fixes applied.
Found 2 infos.
```

**54 files checked before, 54 after** — `files.includes` was not touched, so the corpus did not move.

## A2 — the gate, with the numbers, not just the colour

| Command | Before | After |
| --- | --- | --- |
| `npm run lint` | exit 0, `Found 2 infos.` | exit 0, **no findings block** |
| `npm run typecheck` | exit 0 | exit **0** |
| `npm test` | 30 files, 856/856 | **30 files, 856/856** |

Both sides were run in THIS worktree at a clean `npm ci`, so the comparison is like-for-like and the
before column is not borrowed from the parent note (it independently reproduces it). **The test count
did not move: 856/856 over 30 files, identical.**

## A3 — the rule set

**IDENTICAL. 178 enabled rules before, the same 178 after, zero lines differ.** Measured with
`biome rage --linter`; the instrument was validated against a control before its verdict was
trusted. Full evidence, the commands that do NOT report the set, and the one rage line that changes
for a harmless reason are in the sibling `observation` note
`20260815T211122Z-software-engineer-observation-a3-...-c6d872ac`.

## A4 — new findings under `src/**`: NONE

The migration surfaced **zero** new findings anywhere, in `src/**` or outside it. There was nothing
to leave untouched and nothing to route to a ticket. This is the honest empty answer to A4, not a
skipped check: `biome check .` over the full 54-file corpus emitted no diagnostic of any severity
after the diff.

## Commands run, in order

```sh
git worktree add -b grugops/lint-config-drift ../cli-chess-lintcfg main
npm ci                                   # lock pins @biomejs/biome exactly 2.5.5
npm run lint                             # BEFORE: exit 0, Found 2 infos.
npm run typecheck && npm test            # BEFORE: exit 0; 30 files, 856/856
biome rage --linter --colors=off         # BEFORE: 178 enabled rules
biome migrate                            # dry run - read the proposed diff first
biome migrate --write                    # applied, exit 0
npm run lint                             # AFTER: exit 0, no findings block
biome rage --linter --colors=off         # AFTER: 178 enabled rules, diff = empty
biome rage --linter --config-path=<scratch>   # control: one rule off -> 177, one-line diff
npm run typecheck && npm test            # AFTER: exit 0; 30 files, 856/856
```

## Note on the record kind

This is an `artifact-ref`, and the gate results above are recorded as measurements inside it rather
than as a `finding`. **No `finding` is admissible on this install** — `context.human_admission` is
`off`, `scripts/context-io.ts` is absent, so no `§14-gate#<id>` stamp can be emitted and none was
invented. `verified_by` is empty because it is honestly empty.
