---
id: 20261009T170000Z-software-engineer-decision-undo-guards-on-moves-length-before-the-take-back-branch-refusal-exported-heading-dropped-3a91c0e7
kind: decision
by: software-engineer
at: 2026-10-09T17:00:00Z
verified_by:
confidence: high
refs:
  - ABC-102
  - ADR-0021
  - ABC-035
  - ABC-046
  - src/command-input.ts
  - src/command-input.test.ts
  - plans/tickets/ABC-102-undo.md
supersedes:
---

# `ABC-102`: `undo` is a `take-back` row, guarded on `moves.length >= 2` in its own branch ahead of `new`'s; the refusal is an exported one-item constant; `help` is the bare token list

Hand-authored, no `seal` (degraded posture per `AGENTS.md`: no `scripts/context-io.ts`,
`scripts/claim.js` or `propose_note` on this install). Branch `grugops/ABC-102-undo` @ `53fd3d2`,
off `grugops/wave-2026-09-25` @ `4c5eddc`.

1. **Row:** `{ token: "undo", outcome: "take-back" }`, last in `COMMAND_TABLE`; `CommandToken`
   widens by `"undo"`. `CommandSpec.outcome` and `PromptLineOutcome` needed no change.
2. **Branch:** `if (spec.token === "undo")`, placed BEFORE the `outcome === "take-back"` branch,
   because `new` and `undo` share the row outcome and differ in effect. It returns
   `{ kind: "take-back", plies: 2, messages: [] }` at `moves.length >= 2`, otherwise
   `{ kind: "command", messages: UNDO_REFUSAL_MESSAGES }`. Reads one field, mutates nothing, no
   derive.
3. **Refusal constant:** `export const UNDO_REFUSAL_MESSAGES = ["nothing to undo"]`, the same shape
   as `QUIT_CONFIRMATION_MESSAGES` (coding rule 11). The tests assert the literal, not the constant,
   so the ruling-3 wording is pinned independently of the export.
4. **Ruling 6:** `HELP_HEADING` deleted (my edit made it unused); `helpMessages()` returns
   `COMMAND_TABLE.map((spec) => spec.token)`.
5. **Test note 5 honoured:** `undo`'s spellings are NOT in `TOKEN_SPELLINGS` (that sweep runs at ply
   0, where `undo` refuses); they live in `A6`'s own rows at ply 4. `und`/`undoo` joined
   `NON_TOKENS` and `undo 2` joined the no-argument row, as `resign`/`new` did.
6. **Superseded by name, as the page lists:** the foreign list `["moves", "undo"]` → `["moves"]`;
   both `COMMAND_TABLE.length + 1` rows → `COMMAND_TABLE.length`, each with a comment naming ruling 6.
7. **Docblocks re-worded** (`ABC-114`): module header (six/five → seven/six; `undo` "is not here"
   → how it rides the arm and why it is guarded), `CommandToken`, `CommandSpec` (seven tokens;
   `undo` answers `command` at the boundary), the `COMMAND_TABLE` note, `helpMessages` (no
   heading), `resolvePromptLine` (TWO → THREE command paths consulting `history`).

Not touched: `src/turn-loop.ts`, `src/history.ts`, `src/line-input.ts`, `src/cli.ts`,
`src/cli.test.ts`, `src/frame.ts` — no stop condition was hit.
