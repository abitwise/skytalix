---
id: 20260811T093500Z-software-engineer-artifact-ref-6fa26b26
kind: artifact-ref
by: software-engineer
at: 2026-08-11T09:35:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - src/status-panel.ts
  - src/status-panel.test.ts
  - src/status-panel.nfr.test.ts
  - src/__snapshots__/status-panel.test.ts.snap
supersedes:
---

# What `ticket-to-pr-ABC-016-dev` produced, by reference

> **Hand-authored** — see the decision note of this hop for why, and note that nothing here is a
> `finding`.

## Branch and commits

Worktree `../cli-chess-ABC-016`, branch `grugops/ABC-016-status-panel`, cut from `main` at
`61a3f65`. **Nothing was pushed** (this repo has no git remote, so `autonomy: "pr"` has always meant
branch-plus-gate here), **nothing was merged, nothing was deployed.**

| commit | what |
|---|---|
| `fa0f3fe` | `chore(queue)` — the Workflow 17 claim: `pending/` → `claimed/`, plus the registry record |
| `0314849` | `feat(status-panel)` — the module, both test files, the snapshot file (805 insertions) |

Each commit was made with an explicit `git commit -- <paths>` pathspec and `git status` was read
before and after both, because `git commit` takes the INDEX and this project has a recorded defect
(`2cd84cd`) where that swept ~640 lines of another role's in-flight work into one commit. The
untracked `node_modules` symlink is NOT covered by `.gitignore`'s `node_modules/` entry — a symlink
is not a directory — so it appears in every `git status` here and was never staged.

## Files

- **`src/status-panel.ts`** — 205 lines, the only production file added or changed. Exports
  `renderStatusPanel(history: GameHistory, status: GameStatus, thinking: boolean): string[]` and
  `STATUS_ROWS = 3`. The signature is the render seam `ADR-0009` clause 9b already names.
- **`src/status-panel.test.ts`** — 26 tests: `A1`–`A12`, one test each, plus the snapshot matrix the
  ticket's `## Test notes` asks for, in `ABC-014`'s shape, over 14 cases.
- **`src/status-panel.nfr.test.ts`** — 5 tests, the spied call counts of `A13`, in their own file
  because a `vi.mock` factory is hoisted to file scope (`src/gameend.nfr.test.ts`'s recorded lesson).
- **`src/__snapshots__/status-panel.test.ts.snap`** — 14 generated panel snapshots, beside
  `ABC-014`'s board snapshots.

## Files deliberately NOT touched, and why

- Anything matching **`src/turn-loop.*`** — `ABC-019`'s, building concurrently in another worktree.
- **`src/frame.test.ts`** — `ADR-0009` clause 5 assigns the composition fit-check to `ABC-017`, the
  ticket that merges second. Adding it here would put a fourth copy of an assertion in the tree.
- **`plans/board.md`** — the Orchestrator's alone. The board move is requested, not applied.
- **`plans/nfr-catalog.md`** and **`memory-bank/50-decisions/`** — not this role's, and `ADR-0009` is
  accepted and was not re-opened.
- **`biome.json`** — `npm run lint` emits two pre-existing INFOS against it (schema `2.3.0` against
  CLI `2.5.5`, and the deprecated `recommended` field). They are informational, they are not mine,
  they were there at the green baseline, and fixing them is an unrelated refactor (coding rules 9
  and 12). **Flagged here, not taken.**

## Measurement harness, out of tree by design

`A14`'s cost figures were produced by a throwaway harness under this session's scratchpad, never
under `src/`, because this project's standing rule is that no wall-clock assertion enters the suite
(`src/zobrist.nfr.test.ts:112`). It replays `src/history.test.ts:81-89`'s deterministic LCG game
without importing `history.ts`. The figures are in this hop's observation note.
