---
id: 20260816T065300Z-ba-pm-observation-e17a
kind: observation
by: ba-pm
at: 2026-08-16T06:53:00Z
verified_by:
confidence: high
refs:
  - EPIC-006
  - ABC-100
  - ABC-101
  - ABC-102
  - ABC-046
  - EPIC-004
supersedes:
---

# Every gap this hop found, with severity and owner — nine, none resolved by me

Ordered by severity. **`G1`–`G3` are the escalations; the rest are recorded work.**

| # | gap | sev | owner | where it lives |
|---|---|---|---|---|
| `G1` | **The distribution channel is unchosen.** No packaging ticket can be scoped, and `EPIC-006` acceptance criterion 1 is unmeetable | **HIGH** | **the project owner**, then Architect/Design to author the superseding ADR | `ABC-100` — cut as the decision, never the answer |
| `G2` | **`EPIC-006` asserts `npx` in four places** while `ADR-0007` clause 5 records the channel as UNDECIDED. Open on the `NFR-007` row since 2026-08-06, and that row names **this hop's role** as one of two owners | **HIGH** | BA/PM + Architect/Design; the repair itself is blocked on `G1` | `ABC-100` `A7`; located in full in note `…-observation-b904` |
| `G3` | **No loop arm carries a state-changing, non-advancing command.** `PromptOutcome`'s `command` arm is message-only and the loop does not re-evaluate `GameStatus` after it. **`undo`, `new` and `quit` all turn on this one ruling** | **HIGH** | **Architect/Design** | `ABC-102` (three shapes priced, none adopted) and `ABC-046` (same ruling, cut 2026-08-13). **Rule it once, for both** |
| `G4` | **`EngineSeam` cannot carry a difficulty level.** `(history) => Promise<Move>` on a `Done`, gated, mutation-tested module. A level can be selected and can reach no engine | **MEDIUM** | Architect/Design, jointly with `EPIC-004`'s decomposition | `ABC-101` Dependencies; `A8` asserts the seam did **not** move at this ticket |
| `G5` | **`EPIC-004` owes the level→budget mapping** (time-based per `RISK-002`) and the answer to whether five rungs are distinguishable in play. Until it lands `ABC-101` ships a flag that changes nothing | **MEDIUM** | `EPIC-004`'s decomposition — **depended on by name and behaviour; no id guessed** | `ABC-101` ruling 1 and Dependencies |
| `G6` | **The interactive startup PROMPT is in the epic's scope and is cut nowhere — for colour OR difficulty.** *"choose colour and difficulty, via prompt or CLI flags"*; `ABC-042` resolves `random` before the loop and prompts for nothing | **MEDIUM** | BA/PM at the next refinement | `ABC-101` § Out of scope, recorded rather than smuggled in |
| `G7` | **`ABC-042` `A6`'s scope table says `--difficulty` is rejected** — a merged, gated page that `ABC-101` supersedes. It needs a dated annotation, not a silent contradiction | **LOW** | whoever builds `ABC-101` | `ABC-101` § guards table, row 5 |
| `G8` | **`ABC-065`'s predicted failure will fire.** Its own board row says *"the failure that arrives the day `EPIC-006` adds an option reds with `expected 3 to be greater than or equal to 4`"* — `ABC-101` is that day. The `AGENTS.md` `Dev / run` slot, `USAGE`, and four assertions in `src/cli.test.ts` all move together | **LOW** | whoever builds `ABC-101` | `ABC-101` § "The guards this ticket will red, named in advance" — **five guards, listed so they are updated deliberately rather than met at the gate** |
| `G9` | **`EPIC-006` should probably be two epics** (session / packaging): no dependency in either direction, blockers of different kinds, and one half waits on a human indefinitely | **LOW** | Orchestrator + owner | note `…-claim-4de2` |

## One overlap the subtask did not name — recorded, NOT resolved

**`G3` is a genuine cross-ticket overlap inside this epic**, not a cross-epic one: `ABC-102`
(mine, this hop) and `ABC-046` (cut 2026-08-13, `Backlog`) are blocked on **the same undecided
ruling**, and `undo` is the strongest argument for shape (b) that exists — it is the only one of the
three commands whose stale-status defect **persists across frames** rather than lasting one. **I did
not resolve it, did not adopt a shape, and did not edit `ABC-046`.** Both pages now name the other.

## Two things I checked for and did NOT find, said so they are not re-checked

- **No `EPIC-004` or `EPIC-005` ticket id appears anywhere in this hop's output.** Grep-checkable —
  `grep -ohE "ABC-[0-9]{3}"` over the three ticket pages and these notes returns exactly 21 distinct
  ids: `ABC-100`…`ABC-102` (mine); existing merged/backlog ids cited as context (`ABC-012`,
  `ABC-017`, `ABC-019`, `ABC-020`, `ABC-021`, `ABC-035`, `ABC-037`, `ABC-038`, `ABC-041`–`ABC-046`,
  `ABC-065`, `ABC-066`); and `ABC-099` / `ABC-115` which occur **only in this note's prose and the
  range statement**, never as a reference to a ticket. **Every cited id belongs to `EPIC-001`,
  `EPIC-002`, `EPIC-003` or `EPIC-006`, or to no epic — none to `EPIC-004` or `EPIC-005`.**
- **No id at or below `ABC-099` was written to.** No file outside `plans/tickets/ABC-10{0,1,2}-*.md`
  and this notes directory was created or modified by this hop.
