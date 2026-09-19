---
id: 20260920T032100Z-qe-e2e-observation-abc045-mutant-ledger-13-mutants-plus-m5-isolated-raw-red-rows-and-first-messages-8b2d4f61
kind: observation
by: qe-e2e
at: 2026-09-20T03:21:00Z
verified_by:
confidence: high
refs:
  - ABC-045
  - ABC-035
  - ABC-019
  - src/command-input.ts
  - src/turn-loop.ts
  - src/command-input.test.ts
  - src/cli.test.ts
  - src/turn-loop.test.ts
supersedes:
---

# `ABC-045` mutant ledger — 13 mutants + `M5-isolated`, each written INTO the file in place, the named files run with `--reporter=json`, restored from git and the restore asserted by sha256 and by `git status --porcelain -- src`

Harness `raw-mutants-harness.mjs.txt`, per-round summary `raw-mutants-summary.json.txt` (beside this
note). One node process per round; `npx vitest run <files> --reporter=json`; `M1`–`M11` mutate
`src/command-input.ts`, `M12` mutates `src/turn-loop.ts`; CONTROL is the unmutated tree over all
three files. `restoredByteIdentical: true` and `srcStatusEmpty: true` on all 14 rounds. Load 1-min
5.4–10.6 during the round. Wall per round 0.85–6.2 s (the `cli.test.ts` rounds carry 25 children).

Row names below are shortened: `[045]` = `describe("ABC-045 — resign resolves to the EXISTING
game-over arm …")` in `src/command-input.test.ts`; `[045 cli]` = `src/cli.test.ts`'s
`describe("ABC-045 — resign reaches the screen as reason 8")`; `[035]` = `ABC-035`'s describes in
`src/command-input.test.ts`; `[019]` = `src/turn-loop.test.ts`.

## `M1` — `result: "black-wins"` hardcoded (ternary dropped) — 2 failed / 96
- `[045] A1 — the pure function: the side to move loses, in BOTH directions` — `expected { kind: 'game-over', …(2) } to deeply equal { kind: 'game-over', …(2) }`
- `[045] A1 — through the MERGED loop: the human as black loses to white, and exits 0` — `expected 'black-wins' to be 'white-wins'`
- (`A1` loop-as-white stays green: the hardcoded value coincides with that fixture's answer — which is exactly why the criterion demands both directions.)

## `M2` — ternary swapped — 6 failed / 92
- `[045] A1` pure — `toEqual` mismatch; `[045] A1` loop-as-white — `expected 'white-wins' to be 'black-wins'`; `[045] A1` loop-as-black — `expected 'black-wins' to be 'white-wins'`; `[045] A2` — `expected 'white-wins' to be 'black-wins'`; `[045] A3` — `toEqual` mismatch; `[045] A5 — no confirmation` — `expected 'white-wins' to be 'black-wins'`

## `M3` — row flipped to `outcome: "command"` (resign inert) — 7 failed / 91 in the unit file, 1 / 61 in `cli.test.ts`
- `[045 cli] A4` — `expected ' not a chess outcome.\n\n1. e4 e5\n2.…' to be '\nBlack wins by resignation.\n\n1. e4…'` (the child played `d4`, the opponent ran out of script, the screen says the game did not finish)
- `[045] A1` pure — `expected { kind: 'command', messages: [] } to deeply equal { kind: 'game-over', …(2) }`; `A1` loop-as-white — `expected null to be 'black-wins'`; `A1` loop-as-black — `expected null to be 'white-wins'`; `A2` — `expected 2 to be 1` (reads); `A3` — `toEqual` mismatch; `A5 — no confirmation` — `expected 2 to be 1`; `A5 — … no second render` — `expected [ [], [] ] to deeply equal [ [] ]`

## `M4` — `reason: "checkmate"` — 6 failed / 92, 1 / 61
- `[045 cli] A4` — `expected '> \nBlack wins by checkmate.\n\n1. e4…' to be '\nBlack wins by resignation.\n\n1. e4…'`
- `[045] A1` pure (`toEqual`); `A1` loop ×2, `A2`, `A5` — `expected 'checkmate' to be 'resignation'`; `A3` (`toEqual`)

## `M5` — module-level `armed` flag: first `resign` in the module instance → `{ kind: "command", messages: ["confirm"] }`, second → `game-over` (the Engineer's) — 1 failed / 97, 1 / 61
- `[045 cli] A4` — `expected ' not a chess outcome.\n\n1. e4 e5\n2.…' to be '\nBlack wins by resignation.…'` (the child's `d4` was read as the confirmation and played)
- `[035] A1 — four tokens, case-insensitive, trimmed, EXACT classifies "resign" as resign, advancing nothing` — `expected 'command' to be 'game-over'`
- **`[045] A5 — no confirmation` GREEN** — the flag was already spent by the `[035]` row above (same module instance, earlier in the file). Reproduces the Engineer's caveat exactly.

## `M5-isolated` — the same mutant, `npx vitest run src/command-input.test.ts -t "A5 — no confirmation"` — 1 failed / 0 passed (97 not run)
- `[045] A5 — no confirmation: the game ends on the one line and the next line is NEVER read` — **`expected 2 to be 1`** — the row's own assertion is correct and reds when nothing has armed the flag before it.

## `M6` — `legalMoves(history.position)` inside the resign branch (direct import) — 1 failed / 97
- `[045] A3 — classified before the grammars: neither resolver and no derive sees resign` — `expected 1 to be +0` (module-boundary `legalMoves` delta). The only row that sees it, as the Engineer said.

## `M7` — `gameStatusOf(history)` inside the resign branch — 4 failed / 94
- `[035] A6 — the parser adds ZERO derives … "resign"` / `"RESIGN"` / `"  Resign  "` — `expected 1 to be +0` ×3; `[045] A3` — `expected 1 to be +0`

## `M8` — the row deleted from the table — 13 failed / 84 (of 97: one `it.each` row fewer), 1 / 61
- `[045 cli] A4` (did-not-finish screen); `[035] A1` "resign"/"RESIGN"/"  Resign  " — `expected 'rejected' to be undefined` ×3; `[035] A2 — a command never reaches a resolver` ×3 — `expected 4 to be +0` / `5 to be +0`; `[045] A1` pure — `expected { kind: 'rejected', …(1) } to deeply equal { kind: 'game-over', …(2) }`; `A1` loop ×2 — `expected null to be …`; `A2` — `expected 2 to be 1`; `A3` (`toEqual`); `A5` ×2 — `expected 2 to be 1`, `expected [ [], [ 'type e2e4 or Nf3' ] ] to deeply equal [ [] ]`

## `M9` (QE) — PER-GAME confirmation, `WeakSet<GameHistory>`: the first `resign` on a game → `{ kind: "command", messages: ["confirm"] }` — 10 failed / 88, 1 / 61
- `[045 cli] A4` (did-not-finish); `[035] A1` ×3 — `expected 'command' to be 'game-over'`; `[045] A1` pure — `expected { kind: 'command', …(1) } to deeply equal { kind: 'game-over', …(2) }`; `A1` loop ×2 — `expected null to be …`; `A2` — `expected 2 to be 1`; `A3` (`toEqual`); **`A5 — no confirmation` — `expected 2 to be 1`**; `A5 — … no second render` — `expected [ [], [ 'confirm' ] ] to deeply equal [ [] ]`

## `M10` (QE, edge (e)) — `const token = line.trim();` (case folding dropped) — 18 failed / 80
- `[035] A1` for `"HELP"`, `"Help"`, `"BOARD"`, `"QUIT"`, `" Quit "`, `"CLAIM"`, `"  Claim  "`, `"RESIGN"`, `"  Resign  "` — `expected 'rejected' to be 'command'` / `'claim'` / `'game-over'`; `[035] A2` for the same nine — `expected 4 to be +0` / `5 to be +0` (the resolvers were reached). `resign`'s two upper/mixed spellings red under exactly the rule the other four tokens are held to.

## `M11` (QE, edge (d)) — `split(/\s+/)[0]` (first word wins: `resign now` resigns) — 2 failed / 96
- `[035] A1 — … does NOT classify "help now" as a command` — `expected { token: 'help', outcome: 'command' } to be undefined`
- `[035] fences — grammar only takes no argument: a token with anything after it is not a command` — `expected { token: 'claim', outcome: 'claim' } to be undefined` (the sweep's first line reds; `resign now` is the fifth line of the same sweep and is reached by the same assertion)

## `M12` (QE, ruling 1) — `src/turn-loop.ts`: the `game-over` branch renders one frame (`writer(render(history, status, false, []))`) before returning — 2 / 96, 1 / 61, 2 / 61 in `src/turn-loop.test.ts`
- `[045] A2` — `expected 2 to be 1` (`renders`); `[045] A5 — … no second render` — `expected [ [], [] ] to deeply equal [ [] ]`
- `[045 cli] A4` — `expected [ …(4) ] to have a length of 3 but got 4` (frames)
- `[019] ABC-019 — the eighteen scripted rows: fifteen with an exact reason and an exact frame count, two that throw, …` — `expected [ …(2) ] to have a length of 1 but got 2`
- `[019] A8b — the prompt-driven game-over returns the seam's OWN result and reason, unaltered` — `expected [ …(2) ] to have a length of 1 but got 2`

## CONTROL — 0 failed: 98 / 98, 62 / 62, 63 / 63 (223 / 223)

Zero mutants survived. Zero lines under `src/` are left mutated (`git status --porcelain -- src`
empty after the final restore; `git diff --numstat` on the branch shows nothing under `src/`).
